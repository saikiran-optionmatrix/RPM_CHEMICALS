import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  diffInVivoDays,
  getOrBuildStudyMilestones,
  getTodayInVivoDisplay,
  IN_VIVO_EVIDENCE_REQUIRED_MILESTONES,
  IN_VIVO_STUDIES_DATA,
  InVivoStudyItem,
  MilestoneStatus,
  StudyMilestoneDependency,
  StudyMilestoneItem
} from '../in-vivo-studies.data';
import {
  AddCustomMilestoneComponent,
  AddCustomMilestoneResult
} from './add-custom-milestone/add-custom-milestone.component';
import { EditStudyMilestoneComponent } from './edit-study-milestone/edit-study-milestone.component';
import {
  RebaselineDialogResult,
  RebaselineMilestonesComponent
} from './rebaseline-milestones/rebaseline-milestones.component';

export interface StudyMilestonesUpdateEvent {
  milestones: StudyMilestoneItem[];
  nextMilestone?: string;
  forecast?: string;
  variance?: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-study-plan-milestones',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule],
  templateUrl: './study-plan-milestones.component.html',
  styleUrl: './study-plan-milestones.component.scss'
})
export class StudyPlanMilestonesComponent implements OnChanges {
  @Input() study?: InVivoStudyItem;
  @Output() milestonesUpdated = new EventEmitter<StudyMilestonesUpdateEvent>();

  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLElement>;
  @ViewChild('evidenceDialog') evidenceDialogTemplate?: TemplateRef<{ ref: string; milestoneName: string }>;

  milestones: StudyMilestoneItem[] = [];
  readonly todayDisplay = getTodayInVivoDisplay();

  constructor(private dialog: MatDialog) {}

  scrollLeft(): void {
    this.scrollTable(-350);
  }

  scrollRight(): void {
    this.scrollTable(350);
  }

  private scrollTable(delta: number): void {
    this.scrollContainer?.nativeElement.scrollBy({ left: delta, behavior: 'smooth' });
  }

  ngOnChanges(): void {
    this.milestones = this.study
      ? getOrBuildStudyMilestones(this.study, IN_VIVO_STUDIES_DATA).map(m => ({
          ...m,
          earlierBaselines: [...(m.earlierBaselines || [])],
          dependencies: m.dependencies ? [...m.dependencies] : undefined
        }))
      : [];
  }

  isEvidenceRequired(name: string): boolean {
    return IN_VIVO_EVIDENCE_REQUIRED_MILESTONES.has(name);
  }

  isOpen(m: StudyMilestoneItem): boolean {
    return m.status !== 'Completed' && m.status !== 'Not applicable';
  }

  getStatusClass(status: MilestoneStatus): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In progress':
        return 'status-in-progress';
      case 'Blocked':
        return 'status-blocked';
      case 'Not applicable':
        return 'status-na';
      default:
        return 'status-not-started';
    }
  }

  getForecastVariance(m: StudyMilestoneItem): number | null {
    if (!m.baseline || !m.forecast || m.status === 'Completed') return null;
    return diffInVivoDays(m.forecast, m.baseline);
  }

  getActualVariance(m: StudyMilestoneItem): number | null {
    if (!m.baseline || !m.actual) return null;
    return diffInVivoDays(m.actual, m.baseline);
  }

  getDaysToForecast(m: StudyMilestoneItem): number | null {
    if (!this.isOpen(m) || !m.forecast) return null;
    return diffInVivoDays(m.forecast, this.todayDisplay);
  }

  formatVariance(days: number | null): string {
    if (days == null) return '—';
    return `${days > 0 ? '+' : ''}${days} d`;
  }

  getVarianceClass(days: number | null): string {
    if (days == null) return 'variance-empty';
    if (days > 0) return 'variance-late';
    if (days < 0) return 'variance-ahead';
    return 'variance-neutral';
  }

  formatDependency(dep: StudyMilestoneDependency): string {
    return dep.direction === 'in'
      ? `← ${dep.studyId} · ${dep.milestoneName} (${dep.status})`
      : `→ ${dep.studyId} · ${dep.milestoneName}`;
  }

  formatBaselineHistory(m: StudyMilestoneItem): string {
    if (!m.earlierBaselines?.length) return '';
    return (
      'Earlier baselines:\n' +
      m.earlierBaselines
        .map(b => `${b.baseline} (replaced ${b.replacedOn}, ${b.approvalRef})`)
        .join('\n')
    );
  }

  openAddCustomMilestone(): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(AddCustomMilestoneComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        studyId: this.study.studyId,
        studyOwner: this.study.studyOwner,
        milestones: this.milestones
      }
    });

    dialogRef.afterClosed().subscribe((result?: AddCustomMilestoneResult | null) => {
      if (!result) return;
      const updated = [...this.milestones];
      updated.splice(result.insertIndex, 0, result.milestone);
      this.applyMilestoneChanges(updated);
    });
  }

  openEditMilestone(milestone: StudyMilestoneItem, index: number): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(EditStudyMilestoneComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        studyId: this.study.studyId,
        studyOwner: this.study.studyOwner,
        milestone
      }
    });

    dialogRef.afterClosed().subscribe((updatedMilestone?: StudyMilestoneItem | null) => {
      if (!updatedMilestone) return;
      const updated = this.milestones.map((item, i) => (i === index ? updatedMilestone : item));
      this.applyMilestoneChanges(updated);
    });
  }

  openRebaseline(): void {
    if (!this.study) return;
    const changedMilestones = this.milestones.filter(
      m => this.isOpen(m) && !!m.forecast && !!m.baseline && m.forecast !== m.baseline
    );

    const dialogRef = this.dialog.open(RebaselineMilestonesComponent, {
      width: '680px',
      maxWidth: '95vw',
      data: {
        studyId: this.study.studyId,
        changedMilestones
      }
    });

    dialogRef.afterClosed().subscribe((result?: RebaselineDialogResult | null) => {
      if (!result) return;
      const today = getTodayInVivoDisplay();
      const updated = this.milestones.map(m => {
        if (this.isOpen(m) && m.forecast && m.baseline && m.forecast !== m.baseline) {
          return {
            ...m,
            earlierBaselines: [
              ...(m.earlierBaselines || []),
              { baseline: m.baseline, replacedOn: today, approvalRef: result.approvalRef }
            ],
            baseline: m.forecast,
            reason: result.reason,
            updatedOn: today,
            updatedBy: this.study?.studyOwner || 'Head of Development'
          };
        }
        return m;
      });
      this.applyMilestoneChanges(updated);
    });
  }

  openEvidenceInfo(milestone: StudyMilestoneItem): void {
    if (!this.evidenceDialogTemplate || !milestone.evidence) return;
    this.dialog.open(this.evidenceDialogTemplate, {
      width: '520px',
      maxWidth: '95vw',
      data: {
        ref: milestone.evidence,
        milestoneName: milestone.name
      }
    });
  }

  private applyMilestoneChanges(updated: StudyMilestoneItem[]): void {
    this.milestones = updated;
    const nextOpen = updated.find(m => this.isOpen(m));
    let nextMilestone = this.study?.nextMilestone;
    let forecast = this.study?.forecast;
    let variance = this.study?.variance;

    if (nextOpen) {
      nextMilestone = nextOpen.name;
      forecast = nextOpen.forecast || forecast;
      const v = this.getForecastVariance(nextOpen);
      if (v != null) {
        variance = `${v > 0 ? '+' : ''}${v} d`;
      }
    } else if (updated.length) {
      const completedReport =
        updated.find(m => m.name === 'Final report signed') || updated[updated.length - 1];
      nextMilestone = completedReport.name;
      forecast = completedReport.actual || completedReport.forecast || forecast;
      const v = this.getActualVariance(completedReport);
      if (v != null) {
        variance = `${v > 0 ? '+' : ''}${v} d`;
      }
    }

    this.milestonesUpdated.emit({
      milestones: updated,
      nextMilestone,
      forecast,
      variance,
      lastUpdated: getTodayInVivoDisplay()
    });
  }
}
