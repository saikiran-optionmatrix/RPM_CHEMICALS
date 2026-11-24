import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudyMilestoneItem } from '../../in-vivo-studies.data';

export interface RebaselineDialogData {
  studyId: string;
  changedMilestones: StudyMilestoneItem[];
}

export interface RebaselineDialogResult {
  approvalRef: string;
  reason: string;
}

@Component({
  selector: 'app-rebaseline-milestones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './rebaseline-milestones.component.html',
  styleUrl: './rebaseline-milestones.component.scss'
})
export class RebaselineMilestonesComponent {
  rebaselineForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<RebaselineMilestonesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RebaselineDialogData | null
  ) {
    this.rebaselineForm = this.fb.group({
      approvalRef: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  get changedMilestones(): StudyMilestoneItem[] {
    return this.data?.changedMilestones || [];
  }

  get f() {
    return this.rebaselineForm.controls;
  }

  save(): void {
    this.isSubmitting = true;
    this.rebaselineForm.markAllAsTouched();
    if (!this.changedMilestones.length || this.rebaselineForm.invalid) {
      return;
    }

    const v = this.rebaselineForm.value;
    this.dialogRef?.close({
      approvalRef: String(v.approvalRef || '').trim(),
      reason: String(v.reason || '').trim()
    } satisfies RebaselineDialogResult);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

