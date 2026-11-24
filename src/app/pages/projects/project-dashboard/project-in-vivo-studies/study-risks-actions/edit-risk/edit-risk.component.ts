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
  getNextRiskId,
  getTodayIsoDate,
  IN_VIVO_MILESTONE_OWNERS,
  IN_VIVO_RISK_CATEGORIES,
  IN_VIVO_RISK_ESCALATIONS,
  IN_VIVO_RISK_LEVELS,
  IN_VIVO_RISK_SEVERITIES,
  IN_VIVO_RISK_STATUSES,
  InVivoStudyItem,
  RiskCategory,
  RiskEscalation,
  RiskLevel,
  RiskSeverity,
  RiskStatus,
  StudyRiskItem,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditRiskDialogData {
  study: InVivoStudyItem;
  existingRisk?: StudyRiskItem;
}

@Component({
  selector: 'app-edit-risk',
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
  templateUrl: './edit-risk.component.html',
  styleUrl: './edit-risk.component.scss'
})
export class EditRiskComponent implements OnInit {
  riskForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  readonly categoryOptions: readonly RiskCategory[] = IN_VIVO_RISK_CATEGORIES;
  readonly levelOptions: readonly RiskLevel[] = IN_VIVO_RISK_LEVELS;
  readonly severityOptions: readonly RiskSeverity[] = IN_VIVO_RISK_SEVERITIES;
  readonly statusOptions: readonly RiskStatus[] = IN_VIVO_RISK_STATUSES;
  readonly escalationOptions: readonly RiskEscalation[] = IN_VIVO_RISK_ESCALATIONS;
  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditRiskComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditRiskDialogData | null
  ) {
    this.riskForm = this.fb.group({
      description: ['', Validators.required],
      category: ['' as RiskCategory, Validators.required],
      identifiedOn: [getTodayIsoDate(), Validators.required],
      probability: ['Medium' as RiskLevel],
      impact: ['Medium' as RiskLevel],
      severity: ['Medium' as RiskSeverity, Validators.required],
      effect: ['', Validators.required],
      owner: ['', Validators.required],
      targetDate: ['', Validators.required],
      mitigation: ['', Validators.required],
      status: ['Open' as RiskStatus],
      escalation: ['Study owner' as RiskEscalation],
      closedOn: [''],
      closureEvidence: ['']
    });
  }

  get f() {
    return this.riskForm.controls;
  }

  get existingRisk(): StudyRiskItem | undefined {
    return this.data?.existingRisk;
  }

  get isClosing(): boolean {
    return this.riskForm.get('status')?.value === 'Closed';
  }

  ngOnInit(): void {
    const r = this.existingRisk;
    if (r?.owner && !this.ownerOptions.includes(r.owner)) {
      this.ownerOptions = [r.owner, ...this.ownerOptions];
    }

    if (!r) return;

    this.riskForm.patchValue({
      description: r.description || '',
      category: r.category || '',
      identifiedOn: toIsoDateString(r.identifiedOn) || getTodayIsoDate(),
      probability: r.probability || 'Medium',
      impact: r.impact || 'Medium',
      severity: r.severity || 'Medium',
      effect: r.effect || '',
      owner: r.owner || '',
      targetDate: toIsoDateString(r.targetDate),
      mitigation: r.mitigation || '',
      status: r.status || 'Open',
      escalation: r.escalation || 'Study owner',
      closedOn: toIsoDateString(r.closedOn),
      closureEvidence: r.closureEvidence || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    this.riskForm.markAllAsTouched();
    if (this.riskForm.invalid || !this.data?.study) {
      return;
    }

    const v = this.riskForm.value;
    const status = v.status as RiskStatus;
    const closedIso = String(v.closedOn || '').trim();
    const closureEvidence = String(v.closureEvidence || '').trim();

    if (status === 'Closed' && (!closedIso || !closureEvidence)) {
      this.validationError = 'Closing a risk needs a closure date and closure evidence.';
      return;
    }

    const result: StudyRiskItem = {
      id: this.existingRisk?.id || getNextRiskId(),
      studyId: this.data.study.studyId,
      description: String(v.description || '').trim(),
      category: v.category as RiskCategory,
      identifiedOn: formatInVivoDate(v.identifiedOn),
      probability: v.probability as RiskLevel,
      impact: v.impact as RiskLevel,
      severity: v.severity as RiskSeverity,
      effect: String(v.effect || '').trim(),
      owner: String(v.owner || '').trim(),
      targetDate: formatInVivoDate(v.targetDate),
      mitigation: String(v.mitigation || '').trim(),
      status,
      escalation: v.escalation as RiskEscalation,
      closedOn: closedIso ? formatInVivoDate(closedIso) : '',
      closureEvidence
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

