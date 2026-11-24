import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  formatInVivoDate,
  getTodayInVivoDisplay,
  IN_VIVO_CLOSURE_STATUS_OPTIONS,
  IN_VIVO_MGMT_DECISION_OPTIONS,
  IN_VIVO_OUTCOME_OPTIONS,
  IN_VIVO_REVIEW_STATUS_OPTIONS,
  InVivoStudyItem,
  StudyClosureStatus,
  StudyManagementDecisionOutcome,
  StudyOutcomeAssessment,
  StudyResultsClosureData,
  StudyReviewStatus,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditResultsClosureDialogData {
  study: InVivoStudyItem;
  conductStatus: string;
  analysisStatus: string;
  reportStatus: string;
  resultsClosure: StudyResultsClosureData;
}

@Component({
  selector: 'app-edit-results-closure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatSelectModule],
  templateUrl: './edit-results-closure.component.html',
  styleUrl: './edit-results-closure.component.scss'
})
export class EditResultsClosureComponent {
  readonly form: FormGroup;
  readonly outcomeOptions = IN_VIVO_OUTCOME_OPTIONS;
  readonly reviewStatusOptions = IN_VIVO_REVIEW_STATUS_OPTIONS;
  readonly decisionOptions = IN_VIVO_MGMT_DECISION_OPTIONS;
  readonly closureStatusOptions = IN_VIVO_CLOSURE_STATUS_OPTIONS;

  validationError = '';

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<EditResultsClosureComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: EditResultsClosureDialogData
  ) {
    const r = data.resultsClosure;
    this.form = this.fb.group({
      outcome: [r.outcome],
      reviewStatus: [r.review.status],
      decision: [r.decision],
      closureStatus: [r.closure.status],
      closureDate: [toIsoDateString(r.closure.on)]
    });
  }

  get isClosing(): boolean {
    return this.form.get('closureStatus')?.value === 'Closed';
  }

  close(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.validationError = '';
    const v = this.form.value as {
      outcome: StudyOutcomeAssessment;
      reviewStatus: StudyReviewStatus;
      decision: StudyManagementDecisionOutcome;
      closureStatus: StudyClosureStatus;
      closureDate: string;
    };

    if (
      v.outcome !== 'Pending' &&
      v.outcome !== 'Not applicable' &&
      this.data.reportStatus !== 'Final signed'
    ) {
      this.validationError = 'Enter the outcome after the final report is signed.';
      return;
    }

    if (v.closureStatus === 'Closed' && !v.closureDate) {
      this.validationError = 'Formal closure needs a closure date.';
      return;
    }

    const prev = this.data.resultsClosure;
    const review =
      v.reviewStatus === prev.review.status
        ? { ...prev.review }
        : v.reviewStatus === 'Completed'
          ? { status: 'Completed' as const, by: 'QA reviewer', on: getTodayInVivoDisplay() }
          : { status: 'Pending' as const, by: '', on: '' };

    const closure =
      v.closureStatus === 'Closed'
        ? {
            status: 'Closed' as const,
            on: formatInVivoDate(v.closureDate),
            by: prev.closure.by || 'Head of Development'
          }
        : { status: 'Open' as const, on: '', by: '' };

    const updated: StudyResultsClosureData = {
      outcome: v.outcome,
      review,
      decision: v.decision,
      closure
    };

    this.dialogRef.close(updated);
  }
}

