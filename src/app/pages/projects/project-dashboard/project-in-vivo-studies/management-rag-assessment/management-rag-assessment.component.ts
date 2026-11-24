import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { InVivoRagStatus, InVivoStudyItem } from '../in-vivo-studies.data';

export interface ManagementRagAssessmentDialogData {
  study?: InVivoStudyItem;
  projectCode?: string;
  projectName?: string;
}

export interface ManagementRagAssessmentResult {
  ragStatus: InVivoRagStatus;
  ragReason: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-management-rag-assessment',
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
  templateUrl: './management-rag-assessment.component.html',
  styleUrl: './management-rag-assessment.component.scss'
})
export class ManagementRagAssessmentComponent implements OnInit {
  ragForm: FormGroup;
  isSubmitting = false;

  readonly assessmentOptions: readonly InVivoRagStatus[] = ['Red', 'Green', 'Grey', 'Amber'];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<ManagementRagAssessmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ManagementRagAssessmentDialogData | null
  ) {
    this.ragForm = this.fb.group({
      ragStatus: ['Green' as InVivoRagStatus, Validators.required],
      ragReason: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  get f() {
    return this.ragForm.controls;
  }

  ngOnInit(): void {
    const s = this.data?.study;
    if (!s) return;

    this.ragForm.patchValue({
      ragStatus: s.ragStatus || 'Green',
      ragReason: s.ragReason || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.ragForm.markAllAsTouched();
    if (this.ragForm.invalid) {
      return;
    }

    const v = this.ragForm.value;
    const result: ManagementRagAssessmentResult = {
      ragStatus: v.ragStatus as InVivoRagStatus,
      ragReason: String(v.ragReason || '').trim(),
      lastUpdated: this.formatToday()
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }

  private formatToday(): string {
    return new Date()
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');
  }
}
