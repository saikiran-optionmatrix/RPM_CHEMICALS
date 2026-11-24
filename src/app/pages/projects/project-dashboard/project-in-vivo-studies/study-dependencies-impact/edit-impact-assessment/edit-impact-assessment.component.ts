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
  getNextImpactId,
  getTodayIsoDate,
  ImpactAffectsStatus,
  IN_VIVO_IMPACT_AFFECTS_OPTIONS,
  IN_VIVO_MILESTONE_OWNERS,
  InVivoStudyItem,
  parseProjectMarkets,
  StudyImpactAssessmentItem,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditImpactAssessmentDialogData {
  study: InVivoStudyItem;
  existingImpact?: StudyImpactAssessmentItem;
}

@Component({
  selector: 'app-edit-impact-assessment',
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
  templateUrl: './edit-impact-assessment.component.html',
  styleUrl: './edit-impact-assessment.component.scss'
})
export class EditImpactAssessmentComponent implements OnInit {
  impactForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  programmeOptions: string[] = [];
  readonly affectsOptions: readonly ImpactAffectsStatus[] = IN_VIVO_IMPACT_AFFECTS_OPTIONS;
  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditImpactAssessmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditImpactAssessmentDialogData | null
  ) {
    this.impactForm = this.fb.group({
      programme: ['', Validators.required],
      affectedMilestone: ['', Validators.required],
      baseline: [''],
      forecast: [''],
      affects: ['To be assessed' as ImpactAffectsStatus, Validators.required],
      owner: ['', Validators.required],
      assessedOn: [getTodayIsoDate()],
      assumptions: ['', Validators.required],
      evidence: ['']
    });
  }

  get f() {
    return this.impactForm.controls;
  }

  get existingImpact(): StudyImpactAssessmentItem | undefined {
    return this.data?.existingImpact;
  }

  ngOnInit(): void {
    const study = this.data?.study;
    const existing = this.existingImpact;
    if (!study) return;

    const productLabel = (study.molecule || study.projectName).trim();
    const markets = parseProjectMarkets(study.targetMarkets);
    this.programmeOptions = markets.map(mkt => `${productLabel} · ${mkt}`);
    if (existing?.programme && !this.programmeOptions.includes(existing.programme)) {
      this.programmeOptions = [existing.programme, ...this.programmeOptions];
    }

    const defaultOwner = existing?.owner || study.regulatoryLead || study.studyOwner || '';
    if (defaultOwner && !this.ownerOptions.includes(defaultOwner)) {
      this.ownerOptions = [defaultOwner, ...this.ownerOptions];
    }

    this.impactForm.patchValue({
      programme: existing?.programme || this.programmeOptions[0] || '',
      affectedMilestone: existing?.affectedMilestone || '',
      baseline: toIsoDateString(existing?.baseline),
      forecast: toIsoDateString(existing?.forecast),
      affects: existing?.affects || 'To be assessed',
      owner: existing?.owner || defaultOwner,
      assessedOn: existing?.assessedOn ? toIsoDateString(existing.assessedOn) : getTodayIsoDate(),
      assumptions: existing?.assumptions || '',
      evidence: existing?.evidence || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    this.impactForm.markAllAsTouched();
    if (this.impactForm.invalid || !this.data?.study) {
      return;
    }

    const v = this.impactForm.value;
    const affects = v.affects as ImpactAffectsStatus;
    const baselineIso = String(v.baseline || '').trim();
    const forecastIso = String(v.forecast || '').trim();

    if (affects === 'Yes' && (!baselineIso || !forecastIso)) {
      this.validationError = 'Give baseline and forecast dates when the milestone is affected.';
      return;
    }

    const result: StudyImpactAssessmentItem = {
      id: this.existingImpact?.id || getNextImpactId(),
      studyId: this.data.study.studyId,
      programme: String(v.programme || '').trim(),
      affectedMilestone: String(v.affectedMilestone || '').trim(),
      baseline: formatInVivoDate(baselineIso),
      forecast: formatInVivoDate(forecastIso),
      affects,
      owner: String(v.owner || '').trim(),
      assessedOn: formatInVivoDate(String(v.assessedOn || '').trim()),
      assumptions: String(v.assumptions || '').trim(),
      evidence: String(v.evidence || '').trim()
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

