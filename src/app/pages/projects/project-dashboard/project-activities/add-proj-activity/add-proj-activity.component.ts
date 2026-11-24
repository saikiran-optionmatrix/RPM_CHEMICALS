import { STAGE_WBS_CONFIG_MAP } from '../../../../stages/stage-wbs.data';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface PredecessorItem {
  id?: string | number;
  stage: string;
  deliverable?: string;
  activity: string;
  type?: string;
}

@Component({
  selector: 'app-add-proj-activity',
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
  templateUrl: './add-proj-activity.component.html',
  styleUrl: './add-proj-activity.component.scss',
})
export class AddProjActivityComponent implements OnInit {
  activeTab: 'activity' | 'predecessor' | 'timeline' = 'activity';

  tabs = [
    { id: 'activity' as const, label: 'Activity' },
    { id: 'timeline' as const, label: 'Timeline' },
    { id: 'predecessor' as const, label: 'Predecessors' }

  ];

  activityForm: FormGroup;
  isEditMode = false;
  uploadedFileNames: string[] = [];

  deliverables: string[] = [
    'Market Demand & Application Scope',
    'Competitor Grade & Benchmark Characterization',
    'Preliminary Business Case & Project Charter',
    'Reaction Chemistry & Pathway Screening',
    'Raw Material Sourcing & Regulatory Scoping',
    'Economic Feasibility & Gate 1 Charter Review',
    'Synthesis Route Evaluation & Reagent Selection',
    'Catalyst Screening & Reaction Condition Scoping',
    'Reaction Parameter DoE & Yield Optimization',
    'Commercial Route Lock & Process Flow Diagram (PFD)',
    'Scale-Up Kinetics & Mixing/Heat Transfer Studies',
    'Reaction Calorimetry (RC1) & Thermal Hazard Screening',
    'Chemical Registration Dossier Compilation (REACH / TSCA)',
    'Pilot Plant Cleaning, Line Clearance & Charging',
    'Demonstration Batch Execution & In-Process QC',
    'First Commercial Production Campaign Execution'
  ];

  statuses: string[] = [
    'In Progress',
    'Pending',
    'Completed',
    'On Hold',
    'Cancelled'
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
      const config = (STAGE_WBS_CONFIG_MAP as any)[key];
      const stageFull = stageTitles[key] || key;
      if (config) {
        const menus = (config.sidebarMenus || []).filter((m: any) => m.slNo !== 'ALL');
        const delivLabels = menus.map((m: any) => `${m.slNo} - ${m.name}`);
        this.stageDeliverablesMap[stageFull] = delivLabels;

        const activities = (config.modulesData && config.modulesData[0]) ? config.modulesData[0] : [];
        for (const m of menus) {
          const delivLabel = `${m.slNo} - ${m.name}`;
          const matched = activities.filter((a: any) => a.deliverableSlNo === m.slNo || (m.slNo && a.slNo ? a.slNo.startsWith(m.slNo) : false));
          const actLabels = matched.map((a: any) => `${a.slNo} - ${a.task}`);
          this.stageActivitiesMap[delivLabel] = actLabels;
          for (const name of actLabels) {
            if (!this.allActivities.includes(name)) {
              this.allActivities.push(name);
            }
          }
        }
      }
    }
  }

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
      activity: '1.2.1 - Benchmark against competitor chemical grades, pricing and volume distribution',
      type: 'SS - Start to Start - A must start before B is started'
    }
  ];

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

  handlePredecessorPage(event: PageEvent): void {
    this.predecessorPageIndex = event.pageIndex;
    this.predecessorPageSize = event.pageSize;
  }

  normalizeType(val?: string): string {
    if (!val) return this.typeOptions[0];
    const cleanVal = String(val).trim().toLowerCase();
    const found = this.typeOptions.find(t =>
      t.toLowerCase() === cleanVal ||
      t.toLowerCase().startsWith(cleanVal) ||
      cleanVal.startsWith(t.toLowerCase().slice(0, 2))
    );
    return found || this.typeOptions[0];
  }

  normalizeStage(val?: string): string {
    if (!val) return this.stageOptions[0];
    const cleanVal = String(val).trim().toLowerCase();
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
    if (!list || list.length === 0) return '';
    if (!val) return list[0];
    const cleanVal = val.trim().toLowerCase();
    const found = list.find(d =>
      d.toLowerCase() === cleanVal ||
      d.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(d.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(d.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || list[0];
  }

  normalizeActivity(stage: string, del: string, val?: string): string {
    const list = this.getActivitiesFor(stage, del);
    if (!list || list.length === 0) return '';
    if (!val) return list[0];
    const cleanVal = val.trim().toLowerCase();
    const found = list.find(a =>
      a.toLowerCase() === cleanVal ||
      a.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(a.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(a.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || list[0];
  }

  getDeliverablesForStage(stage: string): string[] {
    if (!stage) return [];
    if (this.stageDeliverablesMap[stage]) {
      return this.stageDeliverablesMap[stage];
    }
    const matchedKey = Object.keys(this.stageDeliverablesMap).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && this.stageDeliverablesMap[matchedKey]) {
      return this.stageDeliverablesMap[matchedKey];
    }
    return [];
  }

  getActivitiesFor(stage: string, deliverable?: string): string[] {
    if (deliverable) {
      if (this.stageActivitiesMap[deliverable]) {
        return this.stageActivitiesMap[deliverable];
      }
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
    if (!row.deliverable || !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = availableDeliverables[0] || '';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (!row.activity || !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  onPredecessorDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (!row.activity || !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  addPredecessorRow(): void {
    const currentStage = this.activityForm.get('stage')?.value;
    const stage = this.normalizeStage(currentStage);
    const deliverables = this.getDeliverablesForStage(stage);
    const deliverable = deliverables.length > 0 ? deliverables[0] : '';
    const activities = this.getActivitiesFor(stage, deliverable);
    const activity = activities.length > 0 ? activities[0] : '';
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.activityForm = this.fb.group({
      stage: ['Feasibility', Validators.required],
      deliverable: ['Module1', Validators.required],
      taskSubject: ['', Validators.required],
      description: [''],
      status: ['In Progress'],
      manPowerBudget: [''],
      materialBudget: [''],
      resourceBudget: [''],
      materialUsage: [''],
      // Timeline tab fields
      planStart: [''],
      planEnd: [''],
      actualStart: [''],
      actualEnd: [''],
      eta: [''],
      planEffort: [''],
      actualEffort: [''],
      planHours: [''],
      actualHours: [''],
      slack: ['']
    });
  }

  ngOnInit(): void {
    this.initializeChemicalMaps();
    this.isEditMode = !!(this.data && (this.data.isEditMode || this.data.TaskName));

    if (this.data) {
      this.activityForm.patchValue({
        stage: this.data.stage ?? this.data.Stage ?? 'Feasibility',
        deliverable: this.data.deliverable ?? this.data.Deliverable ?? 'Module1',
        taskSubject: this.data.taskSubject ?? this.data.TaskName ?? '',
        description: this.data.description ?? this.data.Description ?? '',
        status: this.data.status ?? this.data.Status ?? 'In Progress',
        manPowerBudget: this.data.manPowerBudget ?? '',
        materialBudget: this.data.materialBudget ?? '',
        resourceBudget: this.data.resourceBudget ?? '',
        materialUsage: this.data.materialUsage ?? '',
        // Timeline fields
        planStart: this.data.planStart ?? this.data.PlanStart ?? '',
        planEnd: this.data.planEnd ?? this.data.PlanEnd ?? '',
        actualStart: this.data.actualStart ?? this.data.ActualStart ?? '',
        actualEnd: this.data.actualEnd ?? this.data.ActualEnd ?? '',
        eta: this.data.eta ?? this.data.ETA ?? '',
        planEffort: this.data.planEffort ?? this.data.Effort ?? '',
        actualEffort: this.data.actualEffort ?? '',
        planHours: this.data.planHours ?? '',
        actualHours: this.data.actualHours ?? '',
        slack: this.data.slack ?? ''
      });

      const rawPreds = this.data?.predecessorsData || this.data?.predecessors;
      if (rawPreds && Array.isArray(rawPreds) && rawPreds.length > 0) {
        this.predecessorList = rawPreds;
      }
    }

    // Always normalize every row to guarantee non-empty default chemical deliverable and activity
    this.predecessorList = this.predecessorList.map((p: any) => {
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

  setActiveTab(tabId: 'activity' | 'predecessor' | 'timeline'): void {
    this.activeTab = tabId;
  }

  prevTab(): void {
    if (this.activeTab === 'timeline') {
      this.activeTab = 'predecessor';
    } else if (this.activeTab === 'predecessor') {
      this.activeTab = 'activity';
    }
  }

  nextTab(): void {
    if (this.activeTab === 'activity') {
      this.activeTab = 'predecessor';
    } else if (this.activeTab === 'predecessor') {
      this.activeTab = 'timeline';
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadedFileNames = Array.from(input.files).map(f => f.name);
    }
  }

  save(): void {
    if (this.activityForm.invalid) {
      this.activeTab = 'activity';
      return;
    }

    const val = this.activityForm.value;
    const result = {
      ...this.data,
      ...val,
      TaskName: val.taskSubject,
      taskSubject: val.taskSubject,
      stage: val.stage,
      Stage: val.stage,
      deliverable: val.deliverable,
      Deliverable: val.deliverable,
      description: val.description,
      Description: val.description,
      status: val.status,
      Status: val.status,
      PlanStart: val.planStart,
      planStart: val.planStart,
      PlanEnd: val.planEnd,
      planEnd: val.planEnd,
      ActualStart: val.actualStart,
      actualStart: val.actualStart,
      ActualEnd: val.actualEnd,
      actualEnd: val.actualEnd,
      ETA: val.eta,
      eta: val.eta,
      Effort: val.planEffort,
      planEffort: val.planEffort,
      actualEffort: val.actualEffort,
      planHours: val.planHours,
      actualHours: val.actualHours,
      slack: val.slack,
      manPowerBudget: val.manPowerBudget,
      materialBudget: val.materialBudget,
      resourceBudget: val.resourceBudget,
      materialUsage: val.materialUsage,
      files: this.uploadedFileNames,
      predecessorsData: this.predecessorList,
      predecessors: this.predecessorList.length > 0 ? String(this.predecessorList.length) : '0',
      predecessor: this.predecessorList.length > 0 ? String(this.predecessorList.length) : '0'
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
