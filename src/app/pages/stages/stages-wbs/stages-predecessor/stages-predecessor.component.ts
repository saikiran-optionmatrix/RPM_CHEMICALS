import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { STAGE_WBS_CONFIG_MAP } from '../../stage-wbs.data';

export interface PredecessorItem {
  id?: string | number;
  stage: string;
  deliverable?: string;
  activity: string;
  type?: string;
}

const FALLBACK_DELIVERABLES: Record<string, string[]> = {
  'S1 - Opportunity Identification': [
    '1.1 - Market Demand & Application Scope',
    '1.2 - Competitor Grade & Benchmark Characterization',
    '1.3 - Preliminary Business Case & Project Charter'
  ],
  'S2 - Concept Screening & Feasibility': [
    '2.1 - Reaction Chemistry & Pathway Screening',
    '2.2 - Raw Material Sourcing & Regulatory Scoping',
    '2.3 - Preliminary EHS, Hazard & Safety Review'
  ],
  'S3 - Route Scouting & Lab Synthesis': [
    '3.1 - Synthesis Route Evaluation & Reagent Selection',
    '3.2 - Catalyst Screening & Reaction Condition Scoping',
    '3.3 - Analytical Method Development (HPLC, GC, Titration)'
  ],
  'S4 - Process Optimization (Lab Scale)': [
    '4.1 - Reaction Parameter DoE & Yield Optimization',
    '4.2 - Work-Up, Crystallization & Solvent Recovery',
    '4.3 - Impurity Profiling & Quality Specification Lock'
  ],
  'S5 - Process Route Selection & Basis of Design': [
    '5.1 - Commercial Route Lock & Process Flow Diagram (PFD)',
    '5.2 - Basis of Design & Energy/Mass Balance Model',
    '5.3 - Capex/Opex Preliminary Techno-Economic Assessment'
  ],
  'S6 - Bench-to-Pilot Process Development': [
    '6.1 - Scale-Up Kinetics & Mixing/Heat Transfer Studies',
    '6.2 - Separation, Distillation & Filtration Scale-Up',
    '6.3 - Process Analytical Technology (PAT) & Control Limits'
  ],
  'S7 - Process Safety & Regulatory Studies': [
    '7.1 - Reaction Calorimetry (RC1) & Thermal Hazard Screening',
    '7.2 - Process Hazard Analysis (HAZOP) & Safety Interlocks',
    '7.3 - REACH / TSCA Regulatory Classification & Toxicology'
  ],
  'S8 - Regulatory Registration Filing (REACH / TSCA)': [
    '8.1 - Chemical Registration Dossier Compilation (REACH / TSCA)',
    '8.2 - GHS Classification & Safety Data Sheet (SDS) Authoring',
    '8.3 - Agency Regulatory Submission & Authority Clearance'
  ],
  'S9 - Pilot Plant Campaign': [
    '9.1 - Pilot Plant Cleaning, Line Clearance & Charging',
    '9.2 - Demonstration Batch Execution & In-Process QC',
    '9.3 - Product Lot Characterization & Customer Sampling'
  ],
  'S10 - Demonstration-Scale Campaign': [
    '10.1 - Multi-Kilo / Semi-Commercial Demonstration Run',
    '10.2 - 3-Consecutive Batch Specification Conformance',
    '10.3 - Customer Commercial Qualification & Technical Sign-Off'
  ],
  'S11 - Commercial Plant Build & Commissioning': [
    '11.1 - Detailed Engineering, Equipment Procurement & Installation',
    '11.2 - Automation DCS/PLC Logic & Utility Commissioning',
    '11.3 - Pre-Startup Safety Review (PSSR) & Plant Commissioning'
  ],
  'S12 - Commercial Launch & Ramp-Up': [
    '12.1 - First Commercial Production Campaign Execution',
    '12.2 - Commercial Quality Release & Customer Supply Setup',
    '12.3 - Capacity Ramp-Up & Post-Launch Operational Handover'
  ]
};

const FALLBACK_ACTIVITIES: Record<string, string[]> = {
  '1.1 - Market Demand & Application Scope': [
    '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria',
    '1.1.2 - Screen global supply-chain gaps and identify target domestic and export market volumes',
    '1.1.3 - Analyze target product physicochemical specifications (purity, solids content, assay, moisture)',
    '1.1.4 - Assess raw material availability, key chemical building blocks and supplier sourcing channels',
    '1.1.5 - Define Target Product Profile (TPP) and customer technical acceptance benchmarks'
  ],
  '1.2 - Competitor Grade & Benchmark Characterization': [
    '1.2.1 - Source benchmark competitor chemical samples and commercial lot references',
    '1.2.2 - Analyze competitor chemical structure, purity and molecular weight distribution (NMR, GPC, HPLC)',
    '1.2.3 - Benchmark physical properties, performance characteristics and thermal stability profiles',
    '1.2.4 - Evaluate competitor manufacturing route, patent landscape and freedom-to-operate (FTO)',
    '1.2.5 - Establish cost-of-goods (COGS) parity target vs commercial competitor market pricing'
  ],
  '1.3 - Preliminary Business Case & Project Charter': [
    '1.3.1 - Estimate preliminary capital expenditure and operational costs for chemical synthesis route',
    '1.3.2 - Formulate Stage-Gate project timeline, stage milestones and cross-functional core team charter',
    '1.3.3 - Perform preliminary regulatory classification (CAS registry, GHS, REACH scoping)',
    '1.3.4 - Prepare Gate 1 Business Case & Charter dossier for Executive Approval'
  ]
};

@Component({
  selector: 'app-stages-predecessor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-predecessor.component.html',
  styleUrl: './stages-predecessor.component.scss',
})
export class StagesPredecessorComponent implements OnInit {
  pageIndex = 0;
  pageSize = 5;

  taskName: string = '';
  taskSlNo: string = '';

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
      activity: '1.2.1 - Source benchmark competitor chemical samples and commercial lot references',
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
      const config = STAGE_WBS_CONFIG_MAP ? STAGE_WBS_CONFIG_MAP[key] : null;
      const stageTitle = stageTitles[key] || key;
      if (config && config.sidebarMenus) {
        const menus = config.sidebarMenus.filter((m: any) => m.slNo !== 'ALL');
        const delivLabels = menus.map((m: any) => `${m.slNo} - ${m.name}`);
        this.stageDeliverablesMap[stageTitle] = delivLabels;

        const activities = (config.modulesData && config.modulesData[0]) ? config.modulesData[0] : [];
        for (const m of menus) {
          const delivLabel = `${m.slNo} - ${m.name}`;
          const matched = activities.filter((a: any) => a.deliverableSlNo === m.slNo || (m.slNo && a.slNo ? a.slNo.startsWith(m.slNo) : false));
          const actLabels = matched.map((a: any) => `${a.slNo} - ${a.task}`);
          this.stageActivitiesMap[delivLabel] = actLabels.length > 0 ? actLabels : (FALLBACK_ACTIVITIES[delivLabel] || []);
          this.allActivities.push(...this.stageActivitiesMap[delivLabel]);
        }
      } else if (FALLBACK_DELIVERABLES[stageTitle]) {
        this.stageDeliverablesMap[stageTitle] = [...FALLBACK_DELIVERABLES[stageTitle]];
        for (const deliv of FALLBACK_DELIVERABLES[stageTitle]) {
          const acts = FALLBACK_ACTIVITIES[deliv] || [];
          this.stageActivitiesMap[deliv] = [...acts];
          this.allActivities.push(...acts);
        }
      }
    }
  }

  get paginatedPredecessors(): PredecessorItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    const page = this.predecessorList.slice(startIndex, startIndex + this.pageSize);
    // Safety check: ensure every displayed row has a default valid deliverable and activity
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

  constructor(
    private dialogRef: MatDialogRef<StagesPredecessorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

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
    if (!list || list.length === 0) return '1.1 - Market Demand & Application Scope';
    if (!val) return list[0];
    const cleanVal = String(val).trim().toLowerCase();
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
    if (!list || list.length === 0) return '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
    if (!val) return list[0];
    const cleanVal = String(val).trim().toLowerCase();
    const found = list.find(a =>
      a.toLowerCase() === cleanVal ||
      a.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(a.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(a.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || list[0];
  }

  ngOnInit(): void {
    this.initializeChemicalMaps();
    if (this.data?.row) {
      this.taskName = this.data.row.task || '';
      this.taskSlNo = this.data.row.slNo || '';

      if (this.data.row.predecessorsData && Array.isArray(this.data.row.predecessorsData) && this.data.row.predecessorsData.length > 0) {
        this.predecessorList = this.data.row.predecessorsData;
      }
    }

    if (!this.predecessorList || this.predecessorList.length === 0) {
      const stage = this.stageOptions[0] || 'S1 - Opportunity Identification';
      const deliv = this.getDeliverablesForStage(stage)[0] || '1.1 - Market Demand & Application Scope';
      const act = this.getActivitiesFor(stage, deliv)[0] || '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
      this.predecessorList = [
        {
          stage,
          deliverable: deliv,
          activity: act,
          type: this.typeOptions[0]
        }
      ];
    } else {
      // Always normalize every row to guarantee non-empty default chemical manufacturing deliverable and activity
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
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getDeliverablesForStage(stage: string): string[] {
    if (!stage) {
      stage = this.stageOptions[0] || 'S1 - Opportunity Identification';
    }
    if (this.stageDeliverablesMap[stage] && this.stageDeliverablesMap[stage].length > 0) {
      return this.stageDeliverablesMap[stage];
    }
    const matchedKey = Object.keys(this.stageDeliverablesMap).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && this.stageDeliverablesMap[matchedKey] && this.stageDeliverablesMap[matchedKey].length > 0) {
      return this.stageDeliverablesMap[matchedKey];
    }
    const fallbackKey = Object.keys(FALLBACK_DELIVERABLES).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    if (fallbackKey && FALLBACK_DELIVERABLES[fallbackKey]) {
      return FALLBACK_DELIVERABLES[fallbackKey];
    }
    return FALLBACK_DELIVERABLES['S1 - Opportunity Identification'];
  }

  getActivitiesFor(stage: string, deliverable?: string): string[] {
    if (deliverable && this.stageActivitiesMap[deliverable] && this.stageActivitiesMap[deliverable].length > 0) {
      return this.stageActivitiesMap[deliverable];
    }
    if (deliverable) {
      const matchedDel = Object.keys(this.stageActivitiesMap).find(k =>
        k.toLowerCase().includes(deliverable.toLowerCase()) || deliverable.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedDel && this.stageActivitiesMap[matchedDel] && this.stageActivitiesMap[matchedDel].length > 0) {
        return this.stageActivitiesMap[matchedDel];
      }
      if (FALLBACK_ACTIVITIES[deliverable]) {
        return FALLBACK_ACTIVITIES[deliverable];
      }
    }
    if (stage) {
      const deliverables = this.getDeliverablesForStage(stage);
      const acts: string[] = [];
      deliverables.forEach(d => {
        if (this.stageActivitiesMap[d] && this.stageActivitiesMap[d].length > 0) {
          acts.push(...this.stageActivitiesMap[d]);
        } else if (FALLBACK_ACTIVITIES[d]) {
          acts.push(...FALLBACK_ACTIVITIES[d]);
        }
      });
      if (acts.length > 0) return acts;
    }
    return this.allActivities.length > 0 ? this.allActivities : FALLBACK_ACTIVITIES['1.1 - Market Demand & Application Scope'];
  }

  onStageChange(row: PredecessorItem): void {
    const availableDeliverables = this.getDeliverablesForStage(row.stage);
    if (!row.deliverable || !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = availableDeliverables[0] || '1.1 - Market Demand & Application Scope';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (!row.activity || !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
    }
  }

  onDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (!row.activity || !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '1.1.1 - Review industrial customer specifications, grade requirements and end-use application criteria';
    }
  }

  addRow(): void {
    const stage = this.stageOptions[0] || 'S1 - Opportunity Identification';
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
    this.pageIndex = 0;
    this.predecessorList.unshift(newRow);
  }

  deleteRow(row: PredecessorItem): void {
    const index = this.predecessorList.indexOf(row);
    if (index > -1) {
      this.predecessorList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.predecessorList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    this.dialogRef.close({
      predecessors: this.predecessorList,
      count: this.predecessorList.length,
      predecessor: this.predecessorList.length > 0 ? String(this.predecessorList.length + 3) : '—'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
