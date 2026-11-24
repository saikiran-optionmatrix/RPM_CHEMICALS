import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  getInVivoProjectMaster,
  getNextInVivoStudyNumber,
  IN_VIVO_CATEGORY_SUBTYPES,
  IN_VIVO_CRO_OPTIONS,
  IN_VIVO_FORMULATION_LEADS,
  IN_VIVO_LIFECYCLE_OPTIONS,
  IN_VIVO_PRIORITY_OPTIONS,
  IN_VIVO_REGULATORY_LEADS,
  IN_VIVO_STUDY_OWNERS,
  InVivoLifecycle,
  InVivoStudyItem
} from '../in-vivo-studies.data';

export interface AddInVivoStudyDialogData {
  mode?: 'add' | 'edit';
  item?: InVivoStudyItem;
  projectCode?: string;
  projectName?: string;
  nextStudyNumber?: number;
  availableMarkets?: string[];
}

const REASON_REQUIRED_LIFECYCLES: InVivoLifecycle[] = ['On hold', 'Terminated', 'Cancelled'];
const DEFAULT_NEXT_MILESTONE: Record<InVivoLifecycle, string> = {
  Planned: 'Protocol initiation',
  Preparation: 'Regulatory approval received',
  Ongoing: 'Analysis completed',
  'On hold': 'On hold review',
  Terminated: 'Study terminated',
  Cancelled: 'Study cancelled',
  Completed: 'Final report signed'
};

function requireNonEmptySelection(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-add-in-vivo-studies',
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
  templateUrl: './add-in-vivo-studies.component.html',
  styleUrl: './add-in-vivo-studies.component.scss',
})
export class AddInVivoStudiesComponent implements OnInit {
  studyForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  projectCode = '2026/CHM/001';
  projectName = 'Acrylic Emulsion Binder 50% Solids';
  molecule = 'Acrylic Emulsion Binder 50% Solids';
  moleculePrefix = 'Acrylic Emulsion Binder 50% Solids';
  marketOptions: string[] = ['Russia', 'EAEU'];

  categorySubtypeOptions: string[] = [...IN_VIVO_CATEGORY_SUBTYPES];
  readonly priorityOptions: string[] = [...IN_VIVO_PRIORITY_OPTIONS];
  studyOwnerOptions: string[] = [...IN_VIVO_STUDY_OWNERS];
  formulationLeadOptions: string[] = [...IN_VIVO_FORMULATION_LEADS];
  regulatoryLeadOptions: string[] = [...IN_VIVO_REGULATORY_LEADS];
  croOptions: string[] = [...IN_VIVO_CRO_OPTIONS];
  readonly lifecycleOptions: InVivoLifecycle[] = [...IN_VIVO_LIFECYCLE_OPTIONS];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInVivoStudiesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AddInVivoStudyDialogData | null
  ) {
    this.studyForm = this.fb.group({
      study: ['', Validators.required],
      categorySubtype: ['', Validators.required],
      studyCode: [''],
      studyObjective: [''],
      studyLocation: [''],
      targetMarketsList: [[] as string[], requireNonEmptySelection],
      studyPriority: ['Normal', Validators.required],
      priorityRationale: [''],
      studyOwner: ['', Validators.required],
      formulationLead: [''],
      regulatoryLead: [''],
      cro: ['To be identified'],
      croContact: [''],
      lifecycle: ['Planned' as InVivoLifecycle, Validators.required],
      statusReason: [''],
      plannedStart: ['']
    });
  }

  get f() {
    return this.studyForm.controls;
  }

  get isStatusReasonRequired(): boolean {
    const lifecycle = this.studyForm.get('lifecycle')?.value as InVivoLifecycle;
    return REASON_REQUIRED_LIFECYCLES.includes(lifecycle);
  }

  ngOnInit(): void {
    const item = this.data?.item;
    this.isEditMode = this.data?.mode === 'edit' && !!item;
    const master = getInVivoProjectMaster(
      this.data?.projectCode || item?.projectCode,
      this.data?.projectName || item?.projectName
    );

    this.projectCode = this.data?.projectCode || item?.projectCode || master?.projectCode || '2026/CHM/001';
    this.projectName = this.data?.projectName || item?.projectName || master?.projectName || 'Acrylic Emulsion Binder 50% Solids';
    this.molecule = item?.molecule || master?.molecule || '';
    this.moleculePrefix = this.molecule || this.projectName.trim().split(/\s+/)[0] || this.projectName;

    const baseMarkets = this.data?.availableMarkets?.length
      ? this.data.availableMarkets
      : (master?.targetMarkets.length ? master.targetMarkets : ['India', 'RoW']);
    const existingMarkets = this.parseMarkets(item?.targetMarkets);
    this.marketOptions = Array.from(new Set([...baseMarkets, ...existingMarkets]));

    this.mergeDynamicOptions(item, master?.projectOwner, master?.projectLead);

    this.studyForm.get('lifecycle')?.valueChanges.subscribe((status: InVivoLifecycle) => {
      this.updateStatusReasonValidator(status);
    });

    if (this.isEditMode && item) {
      const categorySubtype = item.category && item.subtype
        ? `${item.category} • ${item.subtype}`
        : (item.category || '');

      if (categorySubtype && !this.categorySubtypeOptions.includes(categorySubtype)) {
        this.categorySubtypeOptions.unshift(categorySubtype);
      }

      this.studyForm.patchValue({
        study: item.study || '',
        categorySubtype,
        studyCode: item.studyCode || '',
        studyObjective: item.studyObjective || '',
        studyLocation: item.studyLocation || '',
        targetMarketsList: existingMarkets,
        studyPriority: item.studyPriority || master?.priority || 'Normal',
        priorityRationale: item.priorityRationale || '',
        studyOwner: item.studyOwner || '',
        formulationLead: item.formulationLead || '',
        regulatoryLead: item.regulatoryLead || '',
        cro: item.cro || 'To be identified',
        croContact: item.croContact || '',
        lifecycle: item.lifecycle || 'Planned',
        statusReason: item.statusReason || '',
        plannedStart: this.toInputDate(item.plannedStart || '')
      });
      this.updateStatusReasonValidator(this.studyForm.get('lifecycle')?.value);
    } else if (master) {
      this.studyForm.patchValue({
        studyPriority: master.priority,
        studyOwner: master.projectOwner,
        formulationLead: master.projectLead,
        targetMarketsList: master.targetMarkets.length ? [...master.targetMarkets] : []
      });
    }
  }

  save(): void {
    this.isSubmitting = true;
    this.studyForm.markAllAsTouched();
    if (this.studyForm.invalid) {
      return;
    }

    const v = this.studyForm.value;
    const [category, subtype = ''] = String(v.categorySubtype || '').split(' • ').map((s: string) => s.trim());
    const lifecycle = v.lifecycle as InVivoLifecycle;
    const existing = this.data?.item;

    const result: InVivoStudyItem = {
      ...(existing || {}),
      projectCode: this.projectCode,
      projectName: this.projectName,
      molecule: this.molecule,
      studyId: existing?.studyId || this.generateStudyId(),
      study: String(v.study || '').trim(),
      studyCode: String(v.studyCode || '').trim(),
      category: category || '',
      subtype,
      targetMarkets: (v.targetMarketsList as string[]).join(', '),
      studyOwner: v.studyOwner,
      lifecycle,
      lifecycleStepsCompleted: existing?.lifecycleStepsCompleted ?? this.defaultLifecycleSteps(lifecycle),
      nextMilestone: existing?.nextMilestone || DEFAULT_NEXT_MILESTONE[lifecycle],
      forecast: existing?.forecast || this.formatDisplayDate(v.plannedStart) || 'TBD',
      variance: existing?.variance || '0 d',
      ragStatus: existing?.ragStatus || 'Green',
      ragReason: existing?.ragReason || 'No red or amber trigger and planning information complete',
      studyObjective: String(v.studyObjective || '').trim(),
      studyLocation: String(v.studyLocation || '').trim(),
      studyPriority: v.studyPriority,
      priorityRationale: String(v.priorityRationale || '').trim(),
      formulationLead: v.formulationLead,
      regulatoryLead: v.regulatoryLead,
      cro: v.cro,
      croContact: String(v.croContact || '').trim(),
      statusReason: String(v.statusReason || '').trim(),
      plannedStart: v.plannedStart ? this.formatDisplayDate(v.plannedStart) : ''
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }

  private updateStatusReasonValidator(status: InVivoLifecycle): void {
    const ctrl = this.studyForm.get('statusReason');
    if (!ctrl) return;
    if (REASON_REQUIRED_LIFECYCLES.includes(status)) {
      ctrl.setValidators([Validators.required]);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity();
  }

  private parseMarkets(targetMarkets?: string): string[] {
    if (!targetMarkets) return [];
    return targetMarkets
      .split(/[,/]/)
      .map(m => m.trim())
      .filter(Boolean);
  }

  private mergeDynamicOptions(
    item?: InVivoStudyItem,
    masterOwner?: string,
    masterLead?: string
  ): void {
    const pushUnique = (list: string[], value?: string): string[] => {
      const trimmed = (value || '').trim();
      return trimmed && !list.includes(trimmed) ? [trimmed, ...list] : list;
    };

    this.studyOwnerOptions = pushUnique(pushUnique(this.studyOwnerOptions, masterOwner), item?.studyOwner);
    this.formulationLeadOptions = pushUnique(
      pushUnique(this.formulationLeadOptions, masterLead),
      item?.formulationLead
    );
    this.regulatoryLeadOptions = pushUnique(this.regulatoryLeadOptions, item?.regulatoryLead);
    this.croOptions = pushUnique(this.croOptions, item?.cro);
  }

  private generateStudyId(): string {
    const seq = this.data?.nextStudyNumber ?? getNextInVivoStudyNumber();
    return `IVS-2026-${String(seq).padStart(3, '0')}`;
  }

  private defaultLifecycleSteps(lifecycle: InVivoLifecycle): number {
    if (lifecycle === 'Ongoing') return 1;
    if (lifecycle === 'Completed') return 6;
    return 0;
  }

  private formatDisplayDate(isoDate: string): string {
    if (!isoDate) return '';
    const isoMatch = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const parsed = isoMatch
      ? new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]))
      : new Date(isoDate);
    if (isNaN(parsed.getTime())) return isoDate;
    return parsed
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');
  }

  private toInputDate(displayDate: string): string {
    if (!displayDate) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) return displayDate;
    const parsed = new Date(displayDate);
    if (isNaN(parsed.getTime())) return '';
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
