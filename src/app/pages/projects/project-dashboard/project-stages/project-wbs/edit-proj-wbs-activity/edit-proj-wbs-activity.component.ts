import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { STAGE_WBS_CONFIG_MAP } from '../../../../../stages/stage-wbs.data';

export interface PredecessorItem {
  id?: string | number;
  stage: string;
  deliverable?: string;
  activity: string;
  type?: string;
}

@Component({
  selector: 'app-edit-proj-wbs-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './edit-proj-wbs-activity.component.html',
  styleUrl: './edit-proj-wbs-activity.component.scss'
})
export class EditProjWbsActivityComponent implements OnInit, AfterViewInit {
  activeTab: 'activity' | 'predecessor' = 'activity';

  activityForm: FormGroup;
  isEditMode = true;
  isSubmitting = false;

  deliverables: string[] = [];
  uploadedFileNames: string[] = [];

  departmentOptions: string[] = [
    'Chemical R&D / Process Technology',
    'Analytical Development & Quality Control',
    'Process Engineering & Technology Transfer',
    'Process Safety & ETP',
    'Pilot Plant Operations',
    'Plant Engineering & Production',
    'Regulatory Affairs',
    'Sourcing & Procurement',
    'PMO / Executive Steering Committee',
    'Quality Assurance (QA/QC)'
  ];

  sectionOptions: string[] = [
    'Reaction Chemistry',
    'Process Technology & Scale-Up',
    'Analytical Characterization',
    'Thermal Safety & Reaction Calorimetry',
    'Environmental & Effluent Treatment (ETP)',
    'Pilot Plant Operations',
    'Commercial Plant Engineering',
    'Chemical Regulatory (REACH / TSCA)',
    'Quality Assurance'
  ];

  // Predecessor Tab Data
  predecessorPageIndex = 0;
  predecessorPageSize = 5;

  readonly typeOptions: string[] = [
    'FS - Finish to Start - Finish A to Start B',
    'SF - Start to Finish - B must be started to finish A',
    'SS - Start to Start - A must start before B is started',
    'FF - Finish to Finish - B can be finished only after A is finished'
  ];

  stageOptions: string[] = [
    'S1 - Opportunity Identification',
    'S2 - Concept Screening & Feasibility',
    'S3 - Route Scouting & Lab Synthesis',
    'S4 - Process Optimization (Lab Scale)',
    'S5 - Process Route Selection & Basis of Design',
    'S6 - Bench-to-Pilot Process Development',
    'S7 - Process Safety & Regulatory Studies',
    'S8 - Regulatory Registration Filing (REACH / TSCA)',
    'S9 - Pilot Plant Campaign',
    'S10 - Demonstration-Scale Campaign',
    'S11 - Commercial Plant Build & Commissioning',
    'S12 - Commercial Launch & Ramp-Up'
  ];

  stageDeliverablesMap: { [key: string]: string[] } = {};
  stageActivitiesMap: { [key: string]: string[] } = {};
  allActivities: string[] = [];

  predecessorList: PredecessorItem[] = [
    {
      stage: 'S1 - Opportunity Identification',
      deliverable: '1.1 - Market Demand & Application Scope',
      activity: '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria',
      type: 'FS - Finish to Start - Finish A to Start B'
    },
    {
      stage: 'S1 - Opportunity Identification',
      deliverable: '1.2 - Competitor Grade & Benchmark Characterization',
      activity: '1.2.1 - Acquire and characterize leading commercial competitor grades (DSC, TGA, FTIR, GPC)',
      type: 'SS - Start to Start - A must start before B is started'
    }
  ];

  private initializeChemicalMaps(): void {
    const stageTitles: Record<string, string> = {
      'S1': 'S1 - Opportunity Identification',
      'S2': 'S2 - Concept Screening & Feasibility',
      'S3': 'S3 - Route Scouting & Lab Synthesis',
      'S4': 'S4 - Process Optimization (Lab Scale)',
      'S5': 'S5 - Process Route Selection & Basis of Design',
      'S6': 'S6 - Bench-to-Pilot Process Development',
      'S7': 'S7 - Process Safety & Regulatory Studies',
      'S8': 'S8 - Regulatory Registration Filing (REACH / TSCA)',
      'S9': 'S9 - Pilot Plant Campaign',
      'S10': 'S10 - Demonstration-Scale Campaign',
      'S11': 'S11 - Commercial Plant Build & Commissioning',
      'S12': 'S12 - Commercial Launch & Ramp-Up'
    };

    const stageKeys = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
    this.stageDeliverablesMap = {};
    this.stageActivitiesMap = {};
    this.allActivities = [];

    for (const key of stageKeys) {
      const config = STAGE_WBS_CONFIG_MAP[key];
      const stageTitle = stageTitles[key] || key;
      if (config) {
        const menus = config.sidebarMenus.filter((m: any) => m.slNo !== 'ALL');
        const delivLabels = menus.map((m: any) => `${m.slNo} - ${m.name}`);
        this.stageDeliverablesMap[stageTitle] = delivLabels;

        const activities = (config.modulesData && config.modulesData[0]) ? config.modulesData[0] : [];
        for (const m of menus) {
          const delivLabel = `${m.slNo} - ${m.name}`;
          const matched = activities.filter((a: any) => a.deliverableSlNo === m.slNo || (m.slNo && a.slNo ? a.slNo.startsWith(m.slNo) : false));
          const actLabels = matched.map((a: any) => `${a.slNo} - ${a.task}`);
          this.stageActivitiesMap[delivLabel] = actLabels;
          this.allActivities.push(...actLabels);
        }
      }
    }
  }

  get paginatedPredecessors(): PredecessorItem[] {
    const startIndex = this.predecessorPageIndex * this.predecessorPageSize;
    const page = this.predecessorList.slice(startIndex, startIndex + this.predecessorPageSize);
    for (const row of page) {
      if (!row.stage) {
        row.stage = this.stageOptions[0] || 'S1 - Opportunity Identification';
      }
      const availableDelivs = this.getDeliverablesForStage(row.stage);
      if (!row.deliverable || !availableDelivs.includes(row.deliverable)) {
        row.deliverable = availableDelivs[0] || '1.1 - Market Demand & Application Scope';
      }
      const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
      if (!row.activity || !availableActs.includes(row.activity)) {
        row.activity = availableActs[0] || '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
      }
      if (!row.type) {
        row.type = this.typeOptions[0];
      }
    }
    return page;
  }

  normalizeType(val?: string): string {
    if (!val) return this.typeOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.typeOptions.find(t =>
      t.toLowerCase() === cleanVal ||
      t.toLowerCase().startsWith(cleanVal) ||
      cleanVal.startsWith(t.toLowerCase().slice(0, 2))
    );
    return found || this.typeOptions[0];
  }

  normalizeStage(val?: string): string {
    if (!val) return this.stageOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.stageOptions.find(s =>
      s.toLowerCase() === cleanVal ||
      s.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(s.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(s.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || this.stageOptions[0];
  }

  normalizeDeliverable(stage: string, val?: string): string {
    const list = this.getDeliverablesForStage(stage);
    if (!list || list.length === 0) return '1.1 - Market Demand & Application Scope';
    if (!val) return list[0];
    const cleanVal = val.trim().toLowerCase();
    const found = list.find(d =>
      d.toLowerCase() === cleanVal ||
      d.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(d.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || list[0];
  }

  normalizeActivity(stage: string, del: string, val?: string): string {
    const list = this.getActivitiesFor(stage, del);
    if (!list || list.length === 0) return '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
    if (!val) return list[0];
    const cleanVal = val.trim().toLowerCase();
    const found = list.find(a =>
      a.toLowerCase() === cleanVal ||
      a.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(a.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || list[0];
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProjWbsActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeChemicalMaps();
    this.deliverables = this.data?.deliverables || [
      'Business Case Preparation',
      'Market Sizing & Commercial Modeling',
      'Gate 1 Business Case Review',
      'Project costing sheet preparation & Selection of Project / Product',
      'Provicinal Product Initiation Form (PPIF)',
      'Literature serach & MER',
      'Pre Product Development Strategy (PPDS) finalization',
      'Procurement - Developmental studies',
      'Formulation Development'
    ];

    if (this.data?.departments && Array.isArray(this.data.departments) && this.data.departments.length > 0) {
      this.departmentOptions = [...this.data.departments];
    }
    if (this.data?.department && !this.departmentOptions.includes(this.data.department)) {
      this.departmentOptions.unshift(this.data.department);
    }

    if (this.data?.sections && Array.isArray(this.data.sections) && this.data.sections.length > 0) {
      this.sectionOptions = [...this.data.sections];
    }
    if (this.data?.section && !this.sectionOptions.includes(this.data.section)) {
      this.sectionOptions.unshift(this.data.section);
    }

    const initialDeliverable = this.data?.deliverable || (this.deliverables.length > 0 ? this.deliverables[0] : '');

    this.activityForm = this.fb.group({
      stage: [this.data?.stage || 'S1 - Opportunity Identification', [Validators.required]],
      deliverable: [initialDeliverable, [Validators.required]],
      activityName: ['', [Validators.required]],
      activityCode: [''],
      department: [this.data?.department || (this.departmentOptions[0] || 'R&D')],
      section: [this.data?.section || (this.sectionOptions[0] || 'Reaction Chemistry')],
      applicability: ['All Products'],
      description: [''],
      planDuration: [''],
      planEffort: [''],
      manPowerBudget: [''],
      materialBudget: [''],
      resourceBudget: [''],
      predecessor: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode !== 'add';

    if (this.data) {
      if (this.data.department && !this.departmentOptions.includes(this.data.department)) {
        this.departmentOptions.unshift(this.data.department);
      }
      if (this.data.section && !this.sectionOptions.includes(this.data.section)) {
        this.sectionOptions.unshift(this.data.section);
      }
      this.activityForm.patchValue({
        stage: this.data.stage ?? 'S1 - Opportunity Identification',
        deliverable: this.data.deliverable ?? (this.deliverables[0] || ''),
        activityName: this.data.activityName ?? this.data.task ?? this.data.taskName ?? '',
        activityCode: this.data.activityCode ?? this.data.jobCode ?? this.data.taskCode ?? '',
        department: this.data.department ?? (this.departmentOptions[0] || 'R&D'),
        section: this.data.section ?? (this.sectionOptions[0] || 'Reaction Chemistry'),
        applicability: this.data.applicability ?? 'All Products',
        description: this.data.description ?? '',
        planDuration: this.data.planDuration ?? this.data.duration ?? '',
        planEffort: this.data.planEffort ?? this.data.effort ?? '',
        manPowerBudget: this.data.manPowerBudget ?? '',
        materialBudget: this.data.materialBudget ?? this.data.planBudget ?? this.data.cost ?? '',
        resourceBudget: this.data.resourceBudget ?? '',
        predecessor: this.data.predecessor ?? ''
      });

      const rawPreds = this.data.predecessorsData || this.data.predecessors;
      if (rawPreds && Array.isArray(rawPreds) && rawPreds.length > 0) {
        this.predecessorList = rawPreds.map((p: any) => {
          const stage = this.normalizeStage(p.stage);
          const deliverable = this.normalizeDeliverable(stage, p.deliverable);
          const activity = this.normalizeActivity(stage, deliverable, p.activity);
          const type = this.normalizeType(p.type);
          return {
            ...p,
            stage,
            deliverable,
            activity,
            type
          };
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.resetScroll();
  }

  private resetScroll(): void {
    setTimeout(() => {
      const dialogContent = document.querySelector('.mat-mdc-dialog-content');
      if (dialogContent) {
        dialogContent.scrollTop = 0;
      }
    }, 0);
  }

  setActiveTab(tab: 'activity' | 'predecessor'): void {
    this.activeTab = tab;
    this.resetScroll();
  }

  prevTab(): void {
    if (this.activeTab === 'predecessor') {
      this.activeTab = 'activity';
    }
  }

  nextTab(): void {
    if (this.activeTab === 'activity') {
      this.activeTab = 'predecessor';
    }
  }

  handlePredecessorPage(event: PageEvent): void {
    this.predecessorPageIndex = event.pageIndex;
    this.predecessorPageSize = event.pageSize;
  }

  getDeliverablesForStage(stage: string): string[] {
    if (!stage) {
      return Object.values(this.stageDeliverablesMap).flat();
    }
    if (this.stageDeliverablesMap[stage]) {
      return this.stageDeliverablesMap[stage];
    }
    const matchedKey = Object.keys(this.stageDeliverablesMap).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && this.stageDeliverablesMap[matchedKey]) {
      return this.stageDeliverablesMap[matchedKey];
    }
    return Object.values(this.stageDeliverablesMap).flat();
  }

  getActivitiesFor(stage: string, deliverable?: string): string[] {
    if (deliverable && this.stageActivitiesMap[deliverable]) {
      return this.stageActivitiesMap[deliverable];
    }
    if (deliverable) {
      const matchedDel = Object.keys(this.stageActivitiesMap).find(k =>
        k.toLowerCase().includes(deliverable.toLowerCase()) || deliverable.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedDel && this.stageActivitiesMap[matchedDel]) {
        return this.stageActivitiesMap[matchedDel];
      }
    }
    if (stage) {
      const deliverables = this.getDeliverablesForStage(stage);
      const acts: string[] = [];
      deliverables.forEach(d => {
        if (this.stageActivitiesMap[d]) {
          acts.push(...this.stageActivitiesMap[d]);
        }
      });
      if (acts.length > 0) return acts;
    }
    return this.allActivities;
  }

  onPredecessorStageChange(row: PredecessorItem): void {
    const availableDeliverables = this.getDeliverablesForStage(row.stage);
    if (row.deliverable && !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = '';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  onPredecessorDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  addPredecessorRow(): void {
    const currentStage = this.activityForm.get('stage')?.value;
    const stage = this.normalizeStage(currentStage);
    const deliverables = this.getDeliverablesForStage(stage);
    const deliverable = deliverables.length > 0 ? deliverables[0] : '1.1 - Market Demand & Application Scope';
    const activities = this.getActivitiesFor(stage, deliverable);
    const activity = activities.length > 0 ? activities[0] : '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
    const newRow: PredecessorItem = {
      stage,
      deliverable,
      activity,
      type: this.typeOptions[0]
    };
    this.predecessorPageIndex = 0;
    this.predecessorList.unshift(newRow);
  }

  deletePredecessorRow(row: PredecessorItem): void {
    const index = this.predecessorList.indexOf(row);
    if (index > -1) {
      this.predecessorList.splice(index, 1);
      if (this.predecessorPageIndex > 0 && this.predecessorPageIndex * this.predecessorPageSize >= this.predecessorList.length) {
        this.predecessorPageIndex = Math.max(0, this.predecessorPageIndex - 1);
      }
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedFileNames.push(files[i].name);
      }
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.activityForm.invalid) {
      this.activeTab = 'activity';
      return;
    }

    const val = this.activityForm.value;
    const result = {
      ...this.data,
      ...val,
      activityName: val.activityName,
      task: val.activityName,
      taskName: val.activityName,
      activityCode: val.activityCode,
      jobCode: val.activityCode || this.data.jobCode,
      department: val.department,
      section: val.section,
      applicability: val.applicability,
      description: val.description,
      planDuration: val.planDuration,
      planEffort: val.planEffort,
      manPowerBudget: val.manPowerBudget,
      materialBudget: val.materialBudget,
      resourceBudget: val.resourceBudget,
      files: this.uploadedFileNames,
      predecessors: this.predecessorList,
      predecessorsData: this.predecessorList,
      predecessor: this.predecessorList.length > 0
        ? String(this.predecessorList.length + 3)
        : (this.activityForm.get('predecessor')?.value || '—')
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
