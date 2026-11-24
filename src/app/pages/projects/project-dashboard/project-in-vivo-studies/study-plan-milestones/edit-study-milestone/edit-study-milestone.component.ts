import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  diffInVivoDays,
  formatInVivoDate,
  getTodayInVivoDisplay,
  getTodayIsoDate,
  IN_VIVO_EVIDENCE_REQUIRED_MILESTONES,
  IN_VIVO_MILESTONE_OWNERS,
  MilestoneStatus,
  StudyMilestoneItem,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditStudyMilestoneDialogData {
  studyId: string;
  studyOwner?: string;
  milestone: StudyMilestoneItem;
}

@Component({
  selector: 'app-edit-study-milestone',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './edit-study-milestone.component.html',
  styleUrl: './edit-study-milestone.component.scss'
})
export class EditStudyMilestoneComponent implements OnInit {
  milestoneForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];
  readonly statusOptions: readonly MilestoneStatus[] = [
    'Not started',
    'In progress',
    'Blocked',
    'Completed',
    'Not applicable'
  ];

  private originalForecastIso = '';

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditStudyMilestoneComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditStudyMilestoneDialogData | null
  ) {
    this.milestoneForm = this.fb.group({
      owner: ['', Validators.required],
      status: ['Not started' as MilestoneStatus, Validators.required],
      forecast: [''],
      actual: [''],
      changeReason: [''],
      evidence: [''],
      notes: ['']
    });
  }

  get milestone(): StudyMilestoneItem | undefined {
    return this.data?.milestone;
  }

  get evidenceRequired(): boolean {
    return !!this.milestone && IN_VIVO_EVIDENCE_REQUIRED_MILESTONES.has(this.milestone.name);
  }

  get currentVarianceLabel(): string {
    const m = this.milestone;
    if (!m || !m.baseline || !m.forecast) return '—';
    const d = diffInVivoDays(m.forecast, m.baseline);
    if (d == null) return '—';
    return `${d > 0 ? '+' : ''}${d} d`;
  }

  get f() {
    return this.milestoneForm.controls;
  }

  ngOnInit(): void {
    const m = this.milestone;
    if (!m) return;

    if (m.owner && !this.ownerOptions.includes(m.owner)) {
      this.ownerOptions = [m.owner, ...this.ownerOptions];
    }

    this.originalForecastIso = toIsoDateString(m.forecast);

    this.milestoneForm.patchValue({
      owner: m.owner || '',
      status: m.status || 'Not started',
      forecast: this.originalForecastIso,
      actual: toIsoDateString(m.actual),
      changeReason: '',
      evidence: m.evidence || '',
      notes: m.notes || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    this.milestoneForm.markAllAsTouched();
    if (this.milestoneForm.invalid || !this.milestone) {
      return;
    }

    const v = this.milestoneForm.value;
    const status = v.status as MilestoneStatus;
    const forecastIso = String(v.forecast || '').trim();
    const actualIso = String(v.actual || '').trim();
    const changeReason = String(v.changeReason || '').trim();
    const evidence = String(v.evidence || '').trim();
    const notes = String(v.notes || '').trim();
    const todayIso = getTodayIsoDate();

    if (status === 'Completed' && !actualIso) {
      this.validationError = 'A milestone cannot be marked complete without an actual completion date.';
      return;
    }
    if (status === 'Completed' && this.evidenceRequired && !evidence) {
      this.validationError = 'This milestone needs a supporting evidence link before it can be completed.';
      return;
    }
    if (actualIso && actualIso > todayIso) {
      this.validationError = 'The actual completion date cannot be in the future.';
      return;
    }
    if (actualIso && status !== 'Completed') {
      this.validationError = 'An actual date is entered only when the milestone is completed.';
      return;
    }
    if (status === 'Not applicable' && !changeReason) {
      this.validationError = 'Give a reason for marking this milestone not applicable.';
      return;
    }
    if (forecastIso !== this.originalForecastIso && !changeReason) {
      this.validationError = 'A reason for variance is required whenever the forecast changes.';
      return;
    }
    if (status !== 'Not applicable' && status !== 'Completed' && !forecastIso) {
      this.validationError = 'An open milestone needs a forecast date.';
      return;
    }

    let updatedReason = this.milestone.reason || '';
    if (status === 'Not applicable') {
      updatedReason = `N/A: ${changeReason}`;
    } else if (forecastIso !== this.originalForecastIso || changeReason) {
      updatedReason = changeReason || updatedReason;
    }

    const forecastDisplay =
      status === 'Completed'
        ? formatInVivoDate(actualIso || forecastIso)
        : formatInVivoDate(forecastIso);

    const updated: StudyMilestoneItem = {
      ...this.milestone,
      owner: String(v.owner || '').trim(),
      status,
      forecast: forecastDisplay,
      actual: actualIso ? formatInVivoDate(actualIso) : '',
      reason: updatedReason,
      evidence,
      notes,
      updatedOn: getTodayInVivoDisplay(),
      updatedBy: (this.data?.studyOwner || '').trim() || 'Head of Development'
    };

    this.dialogRef?.close(updated);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

