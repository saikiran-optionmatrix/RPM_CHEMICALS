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
  getNextActionId,
  getTodayIsoDate,
  IN_VIVO_MILESTONE_OWNERS,
  InVivoStudyItem,
  StudyActionItem,
  StudyDecisionItem
} from '../../in-vivo-studies.data';

export interface RecordDecisionDialogData {
  study: InVivoStudyItem;
  decision: StudyDecisionItem;
  mode: 'decide' | 'withdraw';
}

export interface RecordDecisionDialogResult {
  decision: StudyDecisionItem;
  createdAction?: StudyActionItem;
}

@Component({
  selector: 'app-record-decision',
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
  templateUrl: './record-decision.component.html',
  styleUrl: './record-decision.component.scss'
})
export class RecordDecisionComponent implements OnInit {
  decideForm: FormGroup;
  withdrawForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  readonly ownerOptions: readonly string[] = IN_VIVO_MILESTONE_OWNERS;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<RecordDecisionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RecordDecisionDialogData | null
  ) {
    this.decideForm = this.fb.group({
      decisionTaken: ['', Validators.required],
      decidedOn: [getTodayIsoDate(), Validators.required],
      rationale: ['', Validators.required],
      resultingActionDesc: [''],
      actionOwner: [''],
      actionDueDate: [''],
      evidence: ['']
    });

    this.withdrawForm = this.fb.group({
      reason: ['', Validators.required]
    });
  }

  get isWithdraw(): boolean {
    return this.data?.mode === 'withdraw';
  }

  get decision(): StudyDecisionItem | undefined {
    return this.data?.decision;
  }

  get df() {
    return this.decideForm.controls;
  }

  get wf() {
    return this.withdrawForm.controls;
  }

  get hasResultingAction(): boolean {
    return !!String(this.decideForm.get('resultingActionDesc')?.value || '').trim();
  }

  ngOnInit(): void {
    // Default recommended option text when opening Record decision if empty
    if (!this.isWithdraw && this.decision?.recommended) {
      this.decideForm.patchValue({
        decisionTaken: ''
      });
    }
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    if (!this.data?.decision || !this.data.study) return;

    if (this.isWithdraw) {
      this.withdrawForm.markAllAsTouched();
      if (this.withdrawForm.invalid) return;

      const reason = String(this.withdrawForm.value.reason || '').trim();
      const updated: StudyDecisionItem = {
        ...this.data.decision,
        status: 'Withdrawn',
        rationale: reason
      };
      this.dialogRef?.close({ decision: updated } as RecordDecisionDialogResult);
      return;
    }

    this.decideForm.markAllAsTouched();
    if (this.decideForm.invalid) return;

    const v = this.decideForm.value;
    const actionDesc = String(v.resultingActionDesc || '').trim();
    const actionOwner = String(v.actionOwner || '').trim();
    const actionDueIso = String(v.actionDueDate || '').trim();

    if (actionDesc && (!actionOwner || !actionDueIso)) {
      this.validationError = 'A resulting action needs an owner and a due date.';
      return;
    }

    const updated: StudyDecisionItem = {
      ...this.data.decision,
      decisionTaken: String(v.decisionTaken || '').trim(),
      decidedOn: formatInVivoDate(v.decidedOn),
      rationale: String(v.rationale || '').trim(),
      resultingAction: actionDesc ? `${actionDesc} — ${actionOwner}` : '',
      evidence: String(v.evidence || '').trim(),
      status: 'Decided'
    };

    const createdAction: StudyActionItem | undefined = actionDesc
      ? {
          id: getNextActionId(),
          studyId: this.data.study.studyId,
          description: actionDesc,
          relatedTo: this.data.decision.id,
          owner: actionOwner,
          dueDate: formatInVivoDate(actionDueIso),
          status: 'Open',
          latestUpdate: '',
          completedOn: '',
          evidence: ''
        }
      : undefined;

    this.dialogRef?.close({
      decision: updated,
      createdAction
    } as RecordDecisionDialogResult);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

