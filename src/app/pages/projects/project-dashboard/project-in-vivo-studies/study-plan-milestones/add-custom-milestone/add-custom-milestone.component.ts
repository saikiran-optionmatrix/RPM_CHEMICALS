import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  formatInVivoDate,
  getTodayInVivoDisplay,
  IN_VIVO_MILESTONE_OWNERS,
  IN_VIVO_MILESTONE_PHASES,
  StudyMilestoneItem
} from '../../in-vivo-studies.data';

export interface AddCustomMilestoneDialogData {
  studyId: string;
  studyOwner?: string;
  milestones: StudyMilestoneItem[];
}

export interface AddCustomMilestoneResult {
  insertIndex: number;
  milestone: StudyMilestoneItem;
}

@Component({
  selector: 'app-add-custom-milestone',
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
  templateUrl: './add-custom-milestone.component.html',
  styleUrl: './add-custom-milestone.component.scss'
})
export class AddCustomMilestoneComponent implements OnInit {
  milestoneForm: FormGroup;
  isSubmitting = false;

  readonly phases: readonly string[] = IN_VIVO_MILESTONE_PHASES;
  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];
  insertAfterOptions: { value: number; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<AddCustomMilestoneComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AddCustomMilestoneDialogData | null
  ) {
    this.milestoneForm = this.fb.group({
      phase: ['', Validators.required],
      name: ['', Validators.required],
      owner: ['', Validators.required],
      insertAfterIndex: [0, Validators.required],
      baseline: ['', Validators.required],
      forecast: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  get f() {
    return this.milestoneForm.controls;
  }

  ngOnInit(): void {
    const owner = (this.data?.studyOwner || '').trim();
    if (owner && !this.ownerOptions.includes(owner)) {
      this.ownerOptions = [owner, ...this.ownerOptions];
    }

    const list = this.data?.milestones || [];
    this.insertAfterOptions = list.map((m, i) => ({ value: i, label: m.name }));
    const defaultAfter = list.length >= 2 ? list.length - 2 : list.length - 1;

    this.milestoneForm.patchValue({
      owner: owner || this.ownerOptions[0] || '',
      insertAfterIndex: defaultAfter
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.milestoneForm.markAllAsTouched();
    if (this.milestoneForm.invalid) {
      return;
    }

    const v = this.milestoneForm.value;
    const insertIndex = Math.max(0, Number(v.insertAfterIndex) + 1);
    const reasonText = String(v.reason || '').trim();

    const milestone: StudyMilestoneItem = {
      phase: String(v.phase || ''),
      name: String(v.name || '').trim(),
      owner: String(v.owner || ''),
      baseline: formatInVivoDate(v.baseline),
      forecast: formatInVivoDate(v.forecast),
      actual: '',
      status: 'Not started',
      reason: '',
      evidence: '',
      notes: reasonText,
      updatedOn: getTodayInVivoDisplay(),
      updatedBy: ownerDisplay(this.data?.studyOwner),
      earlierBaselines: [],
      custom: true
    };

    this.dialogRef?.close({ insertIndex, milestone });
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

function ownerDisplay(owner?: string): string {
  return (owner || '').trim() || 'Head of Development';
}

