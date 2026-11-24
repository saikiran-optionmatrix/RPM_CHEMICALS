import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  ApprovalApplicability,
  ApprovalStatus,
  formatInVivoDate,
  IN_VIVO_APPROVAL_APPLICABILITY_OPTIONS,
  IN_VIVO_APPROVAL_STATUS_OPTIONS,
  IN_VIVO_MILESTONE_OWNERS,
  StudyApprovalItem,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditApprovalDialogData {
  studyId: string;
  isNew: boolean;
  approval?: StudyApprovalItem;
  defaultOwner?: string;
}

@Component({
  selector: 'app-edit-approval',
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
  templateUrl: './edit-approval.component.html',
  styleUrl: './edit-approval.component.scss'
})
export class EditApprovalComponent implements OnInit {
  approvalForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  readonly applicabilityOptions: readonly ApprovalApplicability[] = IN_VIVO_APPROVAL_APPLICABILITY_OPTIONS;
  readonly statusOptions: readonly ApprovalStatus[] = IN_VIVO_APPROVAL_STATUS_OPTIONS;
  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditApprovalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditApprovalDialogData | null
  ) {
    this.approvalForm = this.fb.group({
      type: ['', Validators.required],
      authority: ['', Validators.required],
      applicability: ['To be confirmed' as ApprovalApplicability],
      status: ['Not submitted' as ApprovalStatus],
      submitted: [''],
      decisionDate: [''],
      conditions: [''],
      evidence: [''],
      owner: ['']
    });
  }

  get f() {
    return this.approvalForm.controls;
  }

  get isNew(): boolean {
    return !!this.data?.isNew;
  }

  ngOnInit(): void {
    const a = this.data?.approval;
    const owner = (a?.owner || this.data?.defaultOwner || '').trim();
    if (owner && !this.ownerOptions.includes(owner)) {
      this.ownerOptions = [owner, ...this.ownerOptions];
    }

    this.approvalForm.patchValue({
      type: a?.type || '',
      authority: a?.authority || '',
      applicability: a?.applicability || 'To be confirmed',
      status: a?.status || 'Not submitted',
      submitted: toIsoDateString(a?.submitted),
      decisionDate: toIsoDateString(a?.decisionDate),
      conditions: a?.conditions || '',
      evidence: a?.evidence || '',
      owner
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    this.approvalForm.markAllAsTouched();
    if (this.approvalForm.invalid) {
      return;
    }

    const v = this.approvalForm.value;
    const status = v.status as ApprovalStatus;
    const decisionIso = String(v.decisionDate || '').trim();
    const evidence = String(v.evidence || '').trim();

    if (status === 'Approved' && (!decisionIso || !evidence)) {
      this.validationError = 'An approved status needs a decision date and an evidence link.';
      return;
    }

    const result: StudyApprovalItem = {
      type: String(v.type || '').trim(),
      authority: String(v.authority || '').trim(),
      applicability: v.applicability as ApprovalApplicability,
      submitted: formatInVivoDate(String(v.submitted || '').trim()),
      status,
      decisionDate: formatInVivoDate(decisionIso),
      conditions: String(v.conditions || '').trim(),
      evidence,
      owner: String(v.owner || '').trim()
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

