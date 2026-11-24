import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  DecisionStatus,
  diffInVivoDays,
  getStudyActions,
  getStudyDecisions,
  getStudyRisks,
  getTodayInVivoDisplay,
  InVivoStudyItem,
  RiskSeverity,
  RiskStatus,
  StudyActionItem,
  StudyActionStatus,
  StudyDecisionItem,
  StudyRiskItem,
  upsertStudyAction,
  upsertStudyDecision,
  upsertStudyRisk
} from '../in-vivo-studies.data';
import { EditRiskComponent } from './edit-risk/edit-risk.component';
import { EditActionComponent } from './edit-action/edit-action.component';
import { RequestDecisionComponent } from './request-decision/request-decision.component';
import {
  RecordDecisionComponent,
  RecordDecisionDialogResult
} from './record-decision/record-decision.component';

@Component({
  selector: 'app-study-risks-actions',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule],
  templateUrl: './study-risks-actions.component.html',
  styleUrl: './study-risks-actions.component.scss'
})
export class StudyRisksActionsComponent implements OnChanges {
  @Input() study?: InVivoStudyItem;
  @Output() radUpdated = new EventEmitter<void>();
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef<HTMLElement>>;

  risks: StudyRiskItem[] = [];
  actions: StudyActionItem[] = [];
  decisions: StudyDecisionItem[] = [];

  private readonly todayDisplay = getTodayInVivoDisplay();

  constructor(private dialog: MatDialog) {}

  scrollLeft(): void {
    this.scrollTables(-350);
  }

  scrollRight(): void {
    this.scrollTables(350);
  }

  private scrollTables(delta: number): void {
    this.scrollContainers?.forEach(container => {
      container.nativeElement.scrollBy({ left: delta, behavior: 'smooth' });
    });
  }

  ngOnChanges(): void {
    this.refreshData();
  }

  getRiskSeverityClass(severity: RiskSeverity): string {
    switch (severity) {
      case 'Critical':
        return 'pill-red';
      case 'High':
        return 'pill-orange';
      case 'Medium':
        return 'pill-blue';
      default:
        return 'pill-grey';
    }
  }

  getRiskStatusClass(status: RiskStatus): string {
    switch (status) {
      case 'Closed':
        return 'pill-green';
      case 'Mitigating':
        return 'pill-blue';
      default:
        return 'pill-grey';
    }
  }

  getActionStatusClass(status: StudyActionStatus): string {
    switch (status) {
      case 'Done':
        return 'pill-green';
      case 'In progress':
        return 'pill-blue';
      default:
        return 'pill-grey';
    }
  }

  getDecisionStatusClass(status: DecisionStatus): string {
    switch (status) {
      case 'Decided':
        return 'pill-green';
      default:
        return 'pill-grey';
    }
  }

  isActionOverdue(action: StudyActionItem): boolean {
    if (action.status === 'Done' || !action.dueDate) return false;
    const diff = diffInVivoDays(action.dueDate, this.todayDisplay);
    return diff != null && diff < 0;
  }

  isDecisionOverdue(decision: StudyDecisionItem): boolean {
    if (decision.status !== 'Open' || !decision.requiredBy) return false;
    const diff = diffInVivoDays(decision.requiredBy, this.todayDisplay);
    return diff != null && diff < 0;
  }

  openRiskDialog(existing?: StudyRiskItem): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(EditRiskComponent, {
      width: '820px',
      maxWidth: '95vw',
      data: {
        study: this.study,
        existingRisk: existing
      }
    });

    dialogRef.afterClosed().subscribe((result?: StudyRiskItem | null) => {
      if (!result) return;
      upsertStudyRisk(result);
      this.refreshData();
      this.radUpdated.emit();
    });
  }

  openActionDialog(existing?: StudyActionItem): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(EditActionComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        study: this.study,
        existingAction: existing
      }
    });

    dialogRef.afterClosed().subscribe((result?: StudyActionItem | null) => {
      if (!result) return;
      upsertStudyAction(result);
      this.refreshData();
      this.radUpdated.emit();
    });
  }

  openRequestDecisionDialog(): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(RequestDecisionComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        study: this.study
      }
    });

    dialogRef.afterClosed().subscribe((result?: StudyDecisionItem | null) => {
      if (!result) return;
      upsertStudyDecision(result);
      this.refreshData();
      this.radUpdated.emit();
    });
  }

  openRecordDecisionDialog(decision: StudyDecisionItem, mode: 'decide' | 'withdraw'): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(RecordDecisionComponent, {
      width: mode === 'withdraw' ? '620px' : '780px',
      maxWidth: '95vw',
      data: {
        study: this.study,
        decision,
        mode
      }
    });

    dialogRef.afterClosed().subscribe((result?: RecordDecisionDialogResult | null) => {
      if (!result) return;
      upsertStudyDecision(result.decision);
      if (result.createdAction) {
        upsertStudyAction(result.createdAction);
      }
      this.refreshData();
      this.radUpdated.emit();
    });
  }

  private refreshData(): void {
    if (!this.study) {
      this.risks = [];
      this.actions = [];
      this.decisions = [];
      return;
    }

    this.risks = getStudyRisks(this.study.studyId);
    this.actions = getStudyActions(this.study.studyId);
    this.decisions = getStudyDecisions(this.study.studyId);
  }
}
