import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  DependencyStatusOption,
  DependencyType,
  formatInVivoDate,
  getNextDependencyId,
  getOrBuildStudyMilestones,
  getTodayInVivoDisplay,
  IN_VIVO_DEPENDENCY_STATUS_OPTIONS,
  IN_VIVO_DEPENDENCY_TYPE_OPTIONS,
  IN_VIVO_MILESTONE_OWNERS,
  IN_VIVO_STUDIES_DATA,
  InVivoStudyItem,
  StudyDependencyItem,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditDependencyDialogData {
  successorStudy: InVivoStudyItem;
  existingDependency?: StudyDependencyItem;
}

@Component({
  selector: 'app-edit-dependency',
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
  templateUrl: './edit-dependency.component.html',
  styleUrl: './edit-dependency.component.scss'
})
export class EditDependencyComponent implements OnInit {
  depForm: FormGroup;
  isSubmitting = false;
  validationError = '';

  targetSuccessorStudy?: InVivoStudyItem;
  predecessorOptions: { value: string; label: string }[] = [];
  successorMilestones: string[] = [];
  readonly typeOptions: readonly DependencyType[] = IN_VIVO_DEPENDENCY_TYPE_OPTIONS;
  readonly statusOptions = IN_VIVO_DEPENDENCY_STATUS_OPTIONS;
  ownerOptions: string[] = [...IN_VIVO_MILESTONE_OWNERS];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditDependencyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditDependencyDialogData | null
  ) {
    this.depForm = this.fb.group({
      predecessorKey: ['', Validators.required],
      externalPredecessor: [''],
      externalForecast: [''],
      successorMilestone: ['', Validators.required],
      type: ['Study' as DependencyType, Validators.required],
      requiredBy: ['', Validators.required],
      owner: ['', Validators.required],
      status: ['Auto' as DependencyStatusOption],
      impact: ['', Validators.required],
      evidence: ['']
    });
  }

  get f() {
    return this.depForm.controls;
  }

  get existingDependency(): StudyDependencyItem | undefined {
    return this.data?.existingDependency;
  }

  get isExternalSelected(): boolean {
    return this.depForm.get('predecessorKey')?.value === 'EXT';
  }

  ngOnInit(): void {
    const existing = this.existingDependency;
    const baseStudy = this.data?.successorStudy;
    if (!baseStudy) return;

    this.targetSuccessorStudy = existing
      ? IN_VIVO_STUDIES_DATA.find(s => s.studyId === existing.successorStudyId) || baseStudy
      : baseStudy;

    const succId = this.targetSuccessorStudy.studyId;
    this.successorMilestones = getOrBuildStudyMilestones(this.targetSuccessorStudy, IN_VIVO_STUDIES_DATA).map(
      m => m.name
    );

    const siblingStudies = IN_VIVO_STUDIES_DATA.filter(
      s =>
        s.studyId !== succId &&
        (s.projectCode === this.targetSuccessorStudy?.projectCode || s.studyId === existing?.predecessorStudyId)
    );

    const studyPredOptions: { value: string; label: string }[] = siblingStudies.flatMap(study =>
      getOrBuildStudyMilestones(study, IN_VIVO_STUDIES_DATA, false).map(m => ({
        value: `${study.studyId}|${m.name}`,
        label: `${study.studyId} · ${m.name}`
      }))
    );

    this.predecessorOptions = [
      { value: 'EXT', label: 'External item (material, approval, decision, CRO / site…)' },
      ...studyPredOptions
    ];

    if (existing?.owner && !this.ownerOptions.includes(existing.owner)) {
      this.ownerOptions = [existing.owner, ...this.ownerOptions];
    }

    const predKey = existing
      ? existing.predecessorStudyId && existing.predecessorMilestone
        ? `${existing.predecessorStudyId}|${existing.predecessorMilestone}`
        : 'EXT'
      : '';

    this.depForm.patchValue({
      predecessorKey: predKey,
      externalPredecessor: existing && !existing.predecessorStudyId ? existing.externalPredecessor || '' : '',
      externalForecast: toIsoDateString(existing?.externalForecast),
      successorMilestone: existing?.successorMilestone || '',
      type: existing?.type || 'Study',
      requiredBy: toIsoDateString(existing?.requiredBy),
      owner: existing?.owner || '',
      status: existing?.status || 'Auto',
      impact: existing?.impact || '',
      evidence: existing?.evidence || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.validationError = '';
    this.depForm.markAllAsTouched();
    if (this.depForm.invalid || !this.targetSuccessorStudy) {
      return;
    }

    const v = this.depForm.value;
    const predKey = String(v.predecessorKey || '').trim();
    const externalPredecessor = String(v.externalPredecessor || '').trim();

    if (predKey === 'EXT' && !externalPredecessor) {
      this.validationError = 'Describe the external predecessor.';
      return;
    }

    const isExternal = predKey === 'EXT';
    const [predStudyId, ...predMilestoneParts] = isExternal ? ['', ''] : predKey.split('|');

    const result: StudyDependencyItem = {
      id: this.existingDependency?.id || getNextDependencyId(),
      predecessorStudyId: isExternal ? undefined : predStudyId,
      predecessorMilestone: isExternal ? undefined : predMilestoneParts.join('|'),
      externalPredecessor: isExternal ? externalPredecessor : undefined,
      decisionId: isExternal ? this.existingDependency?.decisionId : undefined,
      externalForecast: formatInVivoDate(String(v.externalForecast || '').trim()),
      successorStudyId: this.targetSuccessorStudy.studyId,
      successorMilestone: String(v.successorMilestone || '').trim(),
      type: v.type as DependencyType,
      requiredBy: formatInVivoDate(String(v.requiredBy || '').trim()),
      owner: String(v.owner || '').trim(),
      impact: String(v.impact || '').trim(),
      evidence: String(v.evidence || '').trim(),
      status: (v.status as DependencyStatusOption) || 'Auto',
      updatedOn: getTodayInVivoDisplay(),
      updatedBy: this.targetSuccessorStudy.studyOwner || 'Head of Development'
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

