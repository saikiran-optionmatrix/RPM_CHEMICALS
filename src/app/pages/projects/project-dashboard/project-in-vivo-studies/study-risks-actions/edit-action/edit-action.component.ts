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
  getOrBuildStudyMilestones,
  getStudyDecisions,
  getStudyRisks,
  IN_VIVO_ACTION_STATUSES,
  IN_VIVO_MILESTONE_OWNERS,
  IN_VIVO_STUDIES_DATA,
  InVivoStudyItem,
  StudyActionItem,
  StudyActionStatus,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditActionDialogData {
  study: InVivoStudyItem;
  existingAction?: StudyActionItem;
}

@Component({
  selector: 'app-edit-action',
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
  templateUrl: './edit-action.component.html',
  styleUrl: './edit-action.component.scss'
})
export class EditActionComponent implements OnInit {
  actionForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  relatedOptions: string[] = [];
  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];
  readonly statusOptions: readonly StudyActionStatus[] = IN_VIVO_ACTION_STATUSES;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditActionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditActionDialogData | null
  ) {
    this.actionForm = this.fb.group({
      description: ['', Validators.required],
      relatedTo: [''],
      owner: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['Open' as StudyActionStatus],
      latestUpdate: [''],
      completedOn: [''],
      evidence: ['']
    });
  }

  get f() {
    return this.actionForm.controls;
  }

  get existingAction(): StudyActionItem | undefined {
    return this.data?.existingAction;
  }

  get isMarkingDone(): boolean {
    return this.actionForm.get('status')?.value === 'Done';
  }

  ngOnInit(): void {
    const study = this.data?.study;
    const act = this.existingAction;
    if (!study) return;

    const milestoneNames = getOrBuildStudyMilestones(study, IN_VIVO_STUDIES_DATA).map(m => m.name);
    const riskIds = getStudyRisks(study.studyId).map(r => r.id);
    const decIds = getStudyDecisions(study.studyId).map(d => d.id);
    this.relatedOptions = Array.from(new Set([...milestoneNames, ...riskIds, ...decIds]));

    if (act?.relatedTo && !this.relatedOptions.includes(act.relatedTo)) {
      this.relatedOptions = [act.relatedTo, ...this.relatedOptions];
    }
    if (act?.owner && !this.ownerOptions.includes(act.owner)) {
      this.ownerOptions = [act.owner, ...this.ownerOptions];
    }

    if (!act) return;

    this.actionForm.patchValue({
      description: act.description || '',
      relatedTo: act.relatedTo || '',
      owner: act.owner || '',
      dueDate: toIsoDateString(act.dueDate),
      status: act.status || 'Open',
      latestUpdate: act.latestUpdate || '',
      completedOn: toIsoDateString(act.completedOn),
      evidence: act.evidence || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    this.actionForm.markAllAsTouched();
    if (this.actionForm.invalid || !this.data?.study) {
      return;
    }

    const v = this.actionForm.value;
    const status = v.status as StudyActionStatus;
    const completedIso = String(v.completedOn || '').trim();
    const evidence = String(v.evidence || '').trim();

    if (status === 'Done' && (!completedIso || !evidence)) {
      this.validationError = 'A completed action needs a completion date and an evidence or closure note.';
      return;
    }

    const result: StudyActionItem = {
      id: this.existingAction?.id || getNextActionId(),
      studyId: this.data.study.studyId,
      description: String(v.description || '').trim(),
      relatedTo: String(v.relatedTo || '').trim(),
      owner: String(v.owner || '').trim(),
      dueDate: formatInVivoDate(v.dueDate),
      status,
      latestUpdate: String(v.latestUpdate || '').trim(),
      completedOn: completedIso ? formatInVivoDate(completedIso) : '',
      evidence
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

