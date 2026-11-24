import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  formatInVivoDate,
  getNextDecisionId,
  IN_VIVO_DECISION_OWNERS,
  InVivoStudyItem,
  StudyDecisionItem
} from '../../in-vivo-studies.data';

export interface RequestDecisionDialogData {
  study: InVivoStudyItem;
}

@Component({
  selector: 'app-request-decision',
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
  templateUrl: './request-decision.component.html',
  styleUrl: './request-decision.component.scss'
})
export class RequestDecisionComponent {
  decisionForm: FormGroup;
  isSubmitting = false;

  readonly ownerOptions: readonly string[] = IN_VIVO_DECISION_OWNERS;
  readonly criticalOptions: readonly ('Yes' | 'No')[] = ['Yes', 'No'];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<RequestDecisionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RequestDecisionDialogData | null
  ) {
    this.decisionForm = this.fb.group({
      requested: ['', Validators.required],
      background: ['', Validators.required],
      options: ['', Validators.required],
      recommended: ['', Validators.required],
      owner: ['', Validators.required],
      requiredBy: ['', Validators.required],
      critical: ['No' as 'Yes' | 'No']
    });
  }

  get f() {
    return this.decisionForm.controls;
  }

  save(): void {
    this.isSubmitting = true;
    this.decisionForm.markAllAsTouched();
    if (this.decisionForm.invalid || !this.data?.study) {
      return;
    }

    const v = this.decisionForm.value;
    const result: StudyDecisionItem = {
      id: getNextDecisionId(),
      studyId: this.data.study.studyId,
      requested: String(v.requested || '').trim(),
      background: String(v.background || '').trim(),
      options: String(v.options || '').trim(),
      recommended: String(v.recommended || '').trim(),
      owner: String(v.owner || '').trim(),
      requiredBy: formatInVivoDate(v.requiredBy),
      critical: v.critical === 'Yes',
      status: 'Open',
      decisionTaken: '',
      rationale: '',
      decidedOn: '',
      resultingAction: '',
      evidence: ''
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

