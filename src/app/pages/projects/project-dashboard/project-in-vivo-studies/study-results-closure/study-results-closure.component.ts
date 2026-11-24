import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  appendStudyHistory,
  getOrBuildStudyMilestones,
  getOrBuildStudyResultsClosure,
  getStudyAnalysisStatus,
  getStudyConductStatus,
  getStudyReportStatus,
  getTodayInVivoDisplay,
  InVivoLifecycle,
  InVivoStudyItem,
  StudyResultsClosureData
} from '../in-vivo-studies.data';
import {
  EditResultsClosureComponent,
  EditResultsClosureDialogData
} from './edit-results-closure/edit-results-closure.component';

export interface StudyResultsClosureUpdateEvent {
  resultsClosure: StudyResultsClosureData;
  lifecycle?: InVivoLifecycle;
  lastUpdated: string;
}

export interface ResultsClosureRow {
  index: number;
  item: string;
  status: string;
  meta: string;
  howItIsSet: string;
}

@Component({
  selector: 'app-study-results-closure',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './study-results-closure.component.html',
  styleUrl: './study-results-closure.component.scss'
})
export class StudyResultsClosureComponent {
  private readonly dialog = inject(MatDialog);

  @Input() study?: InVivoStudyItem;
  @Output() resultsClosureUpdated = new EventEmitter<StudyResultsClosureUpdateEvent>();

  get milestones() {
    return this.study ? getOrBuildStudyMilestones(this.study) : [];
  }

  get resultsClosure(): StudyResultsClosureData {
    return this.study
      ? getOrBuildStudyResultsClosure(this.study)
      : {
          outcome: 'Pending',
          review: { status: 'Pending', by: '', on: '' },
          decision: '—',
          closure: { status: 'Open', on: '', by: '' }
        };
  }

  get conductStatus(): string {
    return this.study ? getStudyConductStatus(this.study, this.milestones) : 'Not started';
  }

  get analysisStatus(): string {
    return this.study ? getStudyAnalysisStatus(this.study, this.milestones) : 'Not started';
  }

  get reportStatus(): string {
    return this.study ? getStudyReportStatus(this.study, this.milestones) : 'Not received';
  }

  get rows(): ResultsClosureRow[] {
    const r = this.resultsClosure;
    const reviewMeta = [r.review.by, r.review.on].filter(Boolean).join(' · ');
    const closureMeta = [r.closure.on, r.closure.by].filter(Boolean).join(' · ');

    return [
      {
        index: 1,
        item: 'Conduct status',
        status: this.conductStatus,
        meta: '',
        howItIsSet: 'From conduct milestones'
      },
      {
        index: 2,
        item: 'Analysis status',
        status: this.analysisStatus,
        meta: '',
        howItIsSet: 'From analysis milestone'
      },
      {
        index: 3,
        item: 'Report status',
        status: this.reportStatus,
        meta: '',
        howItIsSet: 'From reporting milestones'
      },
      {
        index: 4,
        item: 'Outcome assessment',
        status: r.outcome,
        meta: '',
        howItIsSet: 'Entered only by an authorised scientific or regulatory reviewer'
      },
      {
        index: 5,
        item: 'Regulatory / scientific review',
        status: r.review.status,
        meta: reviewMeta,
        howItIsSet: 'Reviewer and date recorded'
      },
      {
        index: 6,
        item: 'Management decision',
        status: r.decision,
        meta: '',
        howItIsSet: 'Proceed / further assessment / repeat / redesign / stop / other'
      },
      {
        index: 7,
        item: 'Formal closure',
        status: r.closure.status,
        meta: closureMeta,
        howItIsSet: 'Closure date and approver'
      }
    ];
  }

  getStatusPillClass(status: string): string {
    switch (status) {
      case 'Completed':
      case 'Final signed':
      case 'Meets predefined criteria':
      case 'Proceed':
      case 'Closed':
        return 't-green';
      case 'Ongoing':
      case 'Draft received':
      case 'Under review':
      case 'Further assessment':
        return 't-blue';
      case 'Inconclusive':
      case 'Repeat':
      case 'Redesign':
        return 't-orange';
      case 'Terminated':
      case 'Does not meet criteria':
      case 'Stop':
        return 't-red';
      default:
        return 't-grey';
    }
  }

  openEditDialog(): void {
    if (!this.study) return;
    const prev = this.resultsClosure;

    const dialogData: EditResultsClosureDialogData = {
      study: this.study,
      conductStatus: this.conductStatus,
      analysisStatus: this.analysisStatus,
      reportStatus: this.reportStatus,
      resultsClosure: prev
    };

    const dialogRef = this.dialog.open(EditResultsClosureComponent, {
      width: '820px',
      maxWidth: '95vw',
      autoFocus: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((updated?: StudyResultsClosureData | null) => {
      if (!updated || !this.study) return;

      if (updated.outcome !== prev.outcome) {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Outcome assessment',
          previousValue: prev.outcome,
          newValue: updated.outcome
        });
      }
      if (updated.review.status !== prev.review.status) {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Scientific / regulatory review',
          previousValue: prev.review.status,
          newValue: updated.review.status
        });
      }
      if (updated.decision !== prev.decision) {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Management decision',
          previousValue: prev.decision,
          newValue: updated.decision
        });
      }
      let nextLifecycle: InVivoLifecycle | undefined;
      if (updated.closure.status !== prev.closure.status || updated.closure.on !== prev.closure.on) {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Formal closure',
          previousValue: prev.closure.status,
          newValue: `${updated.closure.status}${updated.closure.on ? ' ' + updated.closure.on : ''}`
        });
      }
      if (updated.closure.status === 'Closed' && this.study.lifecycle !== 'Completed') {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Lifecycle status',
          previousValue: this.study.lifecycle,
          newValue: 'Completed',
          reason: 'Formal closure'
        });
        nextLifecycle = 'Completed';
      }

      this.resultsClosureUpdated.emit({
        resultsClosure: updated,
        lifecycle: nextLifecycle,
        lastUpdated: getTodayInVivoDisplay()
      });
    });
  }
}
