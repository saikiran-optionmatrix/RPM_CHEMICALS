import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ApprovalApplicability,
  ApprovalStatus,
  getOrBuildStudyReadiness,
  getTodayInVivoDisplay,
  InVivoProjectMaster,
  InVivoStudyItem,
  ReadinessCardData,
  ReadinessCategoryKey,
  ReadinessStatus,
  StudyApprovalItem,
  StudyReadinessData
} from '../in-vivo-studies.data';
import { EditReadinessItemComponent } from './edit-readiness-item/edit-readiness-item.component';
import { EditApprovalComponent } from './edit-approval/edit-approval.component';

export interface StudyReadinessUpdateEvent {
  readiness: StudyReadinessData;
  lastUpdated: string;
}

@Component({
  selector: 'app-study-readiness',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule],
  templateUrl: './study-readiness.component.html',
  styleUrl: './study-readiness.component.scss'
})
export class StudyReadinessComponent implements OnChanges {
  @Input() study?: InVivoStudyItem;
  @Input() projectMaster?: InVivoProjectMaster;
  @Output() readinessUpdated = new EventEmitter<StudyReadinessUpdateEvent>();

  readiness?: StudyReadinessData;

  readonly cardDefinitions: readonly { key: ReadinessCategoryKey; title: string }[] = [
    { key: 'test', title: 'Test product' },
    { key: 'comp', title: 'Reference / comparator product' },
    { key: 'prot', title: 'Protocol & supporting documents' },
    { key: 'anal', title: 'Analytical readiness' }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(): void {
    this.readiness = this.study
      ? getOrBuildStudyReadiness(this.study, this.projectMaster)
      : undefined;
  }

  getCard(key: ReadinessCategoryKey): ReadinessCardData | undefined {
    return this.readiness?.[key];
  }

  getReadinessStatusClass(status: ReadinessStatus): string {
    switch (status) {
      case 'Ready':
        return 'pill-green';
      case 'In progress':
        return 'pill-blue';
      case 'Blocked':
        return 'pill-red';
      default:
        return 'pill-grey';
    }
  }

  getApplicabilityClass(app: ApprovalApplicability): string {
    switch (app) {
      case 'Confirmed applicable':
        return 'pill-green';
      case 'To be confirmed':
        return 'pill-orange';
      default:
        return 'pill-grey';
    }
  }

  getApprovalStatusClass(status: ApprovalStatus): string {
    switch (status) {
      case 'Approved':
        return 'pill-green';
      case 'Submitted':
        return 'pill-blue';
      case 'Rejected':
        return 'pill-red';
      default:
        return 'pill-grey';
    }
  }

  openEditReadinessCard(key: ReadinessCategoryKey, title: string): void {
    if (!this.study || !this.readiness) return;

    const card = this.readiness[key];
    const dialogRef = this.dialog.open(EditReadinessItemComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        studyId: this.study.studyId,
        title,
        card
      }
    });

    dialogRef.afterClosed().subscribe((updatedCard?: ReadinessCardData | null) => {
      if (!updatedCard || !this.readiness) return;
      const nextReadiness: StudyReadinessData = {
        ...this.readiness,
        [key]: updatedCard
      };
      this.emitUpdate(nextReadiness);
    });
  }

  openEditApproval(index: number): void {
    if (!this.study || !this.readiness) return;
    const isNew = index < 0;
    const approval = isNew ? undefined : this.readiness.approvals[index];

    const dialogRef = this.dialog.open(EditApprovalComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        studyId: this.study.studyId,
        isNew,
        approval,
        defaultOwner: this.study.regulatoryLead || this.study.studyOwner || ''
      }
    });

    dialogRef.afterClosed().subscribe((result?: StudyApprovalItem | null) => {
      if (!result || !this.readiness) return;
      const approvals = [...this.readiness.approvals];
      if (isNew) {
        approvals.push(result);
      } else {
        approvals[index] = result;
      }
      this.emitUpdate({
        ...this.readiness,
        approvals
      });
    });
  }

  private emitUpdate(readiness: StudyReadinessData): void {
    this.readiness = readiness;
    this.readinessUpdated.emit({
      readiness,
      lastUpdated: getTodayInVivoDisplay()
    });
  }
}
