import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../common/shared/documents-pop/documents-pop.component';
import { AddSimulationComponent } from './add-simulation/add-simulation.component';
import { ProjectWbsRequirementsComponent } from './project-wbs-requirements/project-wbs-requirements.component';
import { ProjectWbsTasksComponent } from './project-wbs-tasks/project-wbs-tasks.component';
import { StagesPredecessorComponent } from '../../../../stages/stages-wbs/stages-predecessor/stages-predecessor.component';
import { EditProjWbsActivityComponent } from './edit-proj-wbs-activity/edit-proj-wbs-activity.component';
import { getRequirementsForWbs, getRequirementItemsForWbs, getDepartmentAndRoleForRequirement } from '../../../../stages/stage-wbs-requirements.data';
import { getTasksForWbs, getTaskItemsForWbs, getTaskDetails } from '../../../../stages/stage-wbs-tasks.data';
import { STAGE_WBS_CONFIG_MAP, StageWbsConfig, WbsActivityData } from '../../../../stages/stage-wbs.data';

export const CHEMICAL_STAGE_NAMES: Record<string, string> = {
  'S1': 'Opportunity Identification',
  'S2': 'Concept Screening & Feasibility',
  'S3': 'Route Scouting & Lab Synthesis',
  'S4': 'Process Optimization (Lab Scale)',
  'S5': 'Process Route Selection & Basis of Design',
  'S6': 'Bench-to-Pilot Process Development',
  'S7': 'Process Safety & Regulatory Studies',
  'S8': 'Regulatory Registration Filing (REACH / TSCA)',
  'S9': 'Pilot Plant Campaign',
  'S10': 'Demonstration-Scale Campaign',
  'S11': 'Commercial Plant Build & Commissioning',
  'S12': 'Commercial Launch & Ramp-Up'
};

export const CHEMICAL_NAME_TO_CODE: Record<string, string> = {
  'opportunity identification': 'S1',
  'concept screening & feasibility': 'S2',
  'concept screening and feasibility': 'S2',
  'route scouting & lab synthesis': 'S3',
  'route scouting and lab synthesis': 'S3',
  'process optimization (lab scale)': 'S4',
  'process optimization': 'S4',
  'process route selection & basis of design': 'S5',
  'process route selection and basis of design': 'S5',
  'bench-to-pilot process development': 'S6',
  'bench to pilot process development': 'S6',
  'process safety & regulatory studies': 'S7',
  'process safety and regulatory studies': 'S7',
  'regulatory registration filing (reach / tsca)': 'S8',
  'regulatory registration filing': 'S8',
  'regulatory registration filing (reach/tsca)': 'S8',
  'pilot plant campaign': 'S9',
  'demonstration-scale campaign': 'S10',
  'demonstration scale campaign': 'S10',
  'commercial plant build & commissioning': 'S11',
  'commercial plant build and commissioning': 'S11',
  'commercial launch & ramp-up': 'S12',
  'commercial launch and ramp-up': 'S12'
};

export interface WbsActivityItem {
  id: number;
  slNo?: string;
  task?: string;
  taskName?: string;
  activityName: string;
  slack?: string;
  jobCode: string;
  department: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low';
  status: boolean;
  predecessor?: string;
  predecessorsData?: any[];
  requirements?: string;
  tasks?: string;
  delayReason?: string;
  requirementsData?: any[];
  tasksData?: any[];
  earlyStart?: string;
  earlyEnd?: string;
  lateStart?: string;
  lateEnd?: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  planBudget?: string;
  actualCost?: string;
  actualDuration?: string;
  actualEffort?: string;
  dueDate?: string;
  description?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  section?: string;
  applicability?: string;
}

export interface WbsDeliverable {
  id: number;
  name: string;
  activities: WbsActivityItem[];
}

export const STAGE_1_DELIVERABLES: WbsDeliverable[] = [
  {
    id: 1,
    name: 'Market Demand & Application Scope',
    activities: [
      {
        id: 101,
        slNo: '1.1.1',
        activityName: 'Review industrial customer specifications, grade requirements and end-use application criteria',
        jobCode: 'JOB-111',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-05',
        planEnd: '2026-01-08',
        planDuration: '6 days',
        planEffort: '48 hrs',
        predecessor: '—',
        description: 'Review industrial customer specifications, grade requirements and end-use application criteria in compliance with chemical manufacturing and safety specifications'
      },
      {
        id: 102,
        slNo: '1.1.2',
        activityName: 'Assess domestic and international regulatory constraints (REACH, TSCA, CLP / GHS)',
        jobCode: 'JOB-112',
        department: 'Regulatory Affairs',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-06',
        planEnd: '2026-01-09',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '1.1.1',
        description: 'Assess domestic and international regulatory constraints (REACH, TSCA, CLP / GHS)'
      },
      {
        id: 103,
        slNo: '1.1.3',
        activityName: 'Define technical Target Product Profile (TPP: purity, solids, viscosity, monomer levels)',
        jobCode: 'JOB-113',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-08',
        planEnd: '2026-01-11',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '1.1.1',
        description: 'Define technical Target Product Profile (TPP: purity, solids, viscosity, monomer levels)'
      },
      {
        id: 104,
        slNo: '1.1.4',
        activityName: 'Conduct initial customer survey and application testing protocol agreement',
        jobCode: 'JOB-114',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-09',
        planEnd: '2026-01-13',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '1.1.2',
        description: 'Conduct initial customer survey and application testing protocol agreement'
      },
      {
        id: 105,
        slNo: '1.1.5',
        activityName: 'Compile initial market volume, pricing benchmarks and demand growth forecasts',
        jobCode: 'JOB-115',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-11',
        planEnd: '2026-01-15',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '1.1.3',
        description: 'Compile initial market volume, pricing benchmarks and demand growth forecasts'
      }
    ]
  },
  {
    id: 2,
    name: 'Competitor Grade & Benchmark Characterization',
    activities: [
      {
        id: 106,
        slNo: '1.2.1',
        activityName: 'Acquire and characterize leading commercial competitor grades (DSC, TGA, FTIR, GPC)',
        jobCode: 'JOB-121',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-10',
        planEnd: '2026-01-14',
        planDuration: '6 days',
        planEffort: '48 hrs',
        predecessor: '1.1.3',
        description: 'Acquire and characterize leading commercial competitor grades (DSC, TGA, FTIR, GPC)'
      },
      {
        id: 107,
        slNo: '1.2.2',
        activityName: 'Perform comparative performance and durability testing versus incumbent chemical products',
        jobCode: 'JOB-122',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-11',
        planEnd: '2026-01-14',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '1.2.1',
        description: 'Perform comparative performance and durability testing versus incumbent chemical products'
      },
      {
        id: 108,
        slNo: '1.2.3',
        activityName: 'Map competitor patent landscape and establish Freedom-to-Operate (FTO) boundary',
        jobCode: 'JOB-123',
        department: 'Regulatory Affairs',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-12',
        planEnd: '2026-01-15',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '1.2.1',
        description: 'Map competitor patent landscape and establish Freedom-to-Operate (FTO) boundary'
      },
      {
        id: 109,
        slNo: '1.2.4',
        activityName: 'Evaluate supply security, volatility and pricing trends for required key raw materials',
        jobCode: 'JOB-124',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-12',
        planEnd: '2026-01-15',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '1.2.2',
        description: 'Evaluate supply security, volatility and pricing trends for required key raw materials'
      },
      {
        id: 110,
        slNo: '1.2.5',
        activityName: 'Document customer technical gap analysis and value-proposition differentiation matrix',
        jobCode: 'JOB-125',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-13',
        planEnd: '2026-01-15',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '1.2.3',
        description: 'Document customer technical gap analysis and value-proposition differentiation matrix'
      }
    ]
  },
  {
    id: 3,
    name: 'Preliminary Business Case & Project Charter',
    activities: [
      {
        id: 111,
        slNo: '1.3.1',
        activityName: 'Draft preliminary Cost of Goods (COGS) model and preliminary margin sensitivity analysis',
        jobCode: 'JOB-131',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-12',
        planEnd: '2026-01-14',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '1.2.4',
        description: 'Draft preliminary Cost of Goods (COGS) model and preliminary margin sensitivity analysis'
      },
      {
        id: 112,
        slNo: '1.3.2',
        activityName: 'Estimate early CAPEX requirements for lab, pilot and plant equipment adaptations',
        jobCode: 'JOB-132',
        department: 'Plant Engineering & Production',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-13',
        planEnd: '2026-01-15',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '1.3.1',
        description: 'Estimate early CAPEX requirements for lab, pilot and plant equipment adaptations'
      },
      {
        id: 113,
        slNo: '1.3.3',
        activityName: 'Identify high-level process safety hazards, effluent profile and EHS considerations',
        jobCode: 'JOB-133',
        department: 'Process Safety & ETP',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-13',
        planEnd: '2026-01-15',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '1.3.1',
        description: 'Identify high-level process safety hazards, effluent profile and EHS considerations'
      },
      {
        id: 114,
        slNo: '1.3.4',
        activityName: 'Compile Stage 1 Gate Dossier and submit Project Charter for executive Gate 1 review',
        jobCode: 'JOB-134',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-14',
        planEnd: '2026-01-15',
        planDuration: '3 days',
        planEffort: '24 hrs',
        predecessor: '1.3.2, 1.3.3',
        description: 'Compile Stage 1 Gate Dossier and submit Project Charter for executive Gate 1 review'
      }
    ]
  }
];

export const STAGE_2_DELIVERABLES: WbsDeliverable[] = [
  {
    id: 1,
    name: 'Reaction Chemistry & Pathway Screening',
    activities: [
      {
        id: 201,
        slNo: '2.1.1',
        activityName: 'Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways',
        jobCode: 'JOB-211',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-16',
        planEnd: '2026-01-20',
        planDuration: '6 days',
        planEffort: '48 hrs',
        predecessor: '1.3.4',
        description: 'Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways'
      },
      {
        id: 202,
        slNo: '2.1.2',
        activityName: 'Conduct stoichiometry and reaction kinetics feasibility evaluation in laboratory micro-reactor',
        jobCode: 'JOB-212',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-18',
        planEnd: '2026-01-22',
        planDuration: '6 days',
        planEffort: '48 hrs',
        predecessor: '2.1.1',
        description: 'Conduct stoichiometry and reaction kinetics feasibility evaluation in laboratory micro-reactor'
      },
      {
        id: 203,
        slNo: '2.1.3',
        activityName: 'Perform screening differential scanning calorimetry (DSC) for reaction exotherm assessment',
        jobCode: 'JOB-213',
        department: 'Process Safety & ETP',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-19',
        planEnd: '2026-01-23',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '2.1.1',
        description: 'Perform screening differential scanning calorimetry (DSC) for reaction exotherm assessment'
      },
      {
        id: 204,
        slNo: '2.1.4',
        activityName: 'Identify and profile major by-products, co-products and potential impurity classes',
        jobCode: 'JOB-214',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-21',
        planEnd: '2026-01-25',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '2.1.2',
        description: 'Identify and profile major by-products, co-products and potential impurity classes'
      }
    ]
  },
  {
    id: 2,
    name: 'Raw Material Sourcing & Regulatory Scoping',
    activities: [
      {
        id: 205,
        slNo: '2.2.1',
        activityName: 'Initiate vendor identification and technical qualification for key raw materials and catalysts',
        jobCode: 'JOB-221',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-18',
        planEnd: '2026-01-22',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '2.1.1',
        description: 'Initiate vendor identification and technical qualification for key raw materials and catalysts'
      },
      {
        id: 206,
        slNo: '2.2.2',
        activityName: 'Collect manufacturer SDS and evaluate hazardous transport / storage requirements',
        jobCode: 'JOB-222',
        department: 'Process Safety & ETP',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-19',
        planEnd: '2026-01-23',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '2.2.1',
        description: 'Collect manufacturer SDS and evaluate hazardous transport / storage requirements'
      },
      {
        id: 207,
        slNo: '2.2.3',
        activityName: 'Evaluate regulatory inventory status (EINECS/REACH, TSCA, IECSC) for all raw materials and intermediates',
        jobCode: 'JOB-223',
        department: 'Regulatory Affairs',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-20',
        planEnd: '2026-01-24',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '2.2.2',
        description: 'Evaluate regulatory inventory status (EINECS/REACH, TSCA, IECSC) for all raw materials and intermediates'
      },
      {
        id: 208,
        slNo: '2.2.4',
        activityName: 'Execute provisional NDAs and request technical data packages from primary chemical suppliers',
        jobCode: 'JOB-224',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-21',
        planEnd: '2026-01-25',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '2.2.3',
        description: 'Execute provisional NDAs and request technical data packages from primary chemical suppliers'
      }
    ]
  },
  {
    id: 3,
    name: 'Economic Feasibility & Gate 1 Charter Review',
    activities: [
      {
        id: 209,
        slNo: '2.3.1',
        activityName: 'Develop preliminary mass and energy balance model across candidate chemical routes',
        jobCode: 'JOB-231',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-20',
        planEnd: '2026-01-24',
        planDuration: '5 days',
        planEffort: '40 hrs',
        predecessor: '2.1.2',
        description: 'Develop preliminary mass and energy balance model across candidate chemical routes'
      },
      {
        id: 210,
        slNo: '2.3.2',
        activityName: 'Compute route-specific Cost of Goods (COGS) at commercial production scale',
        jobCode: 'JOB-232',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-22',
        planEnd: '2026-01-25',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '2.3.1',
        description: 'Compute route-specific Cost of Goods (COGS) at commercial production scale'
      },
      {
        id: 211,
        slNo: '2.3.3',
        activityName: 'Conduct initial environmental load assessment and waste treatment compatibility check',
        jobCode: 'JOB-233',
        department: 'Process Safety & ETP',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'Medium',
        status: true,
        planStart: '2026-01-22',
        planEnd: '2026-01-25',
        planDuration: '4 days',
        planEffort: '32 hrs',
        predecessor: '2.3.1',
        description: 'Conduct initial environmental load assessment and waste treatment compatibility check'
      },
      {
        id: 212,
        slNo: '2.3.4',
        activityName: 'Compile Concept Screening Dossier and present recommendations for Gate 1 approval',
        jobCode: 'JOB-234',
        department: 'Chemical R&D / Process Technology',
        responsibility: 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        planStart: '2026-01-23',
        planEnd: '2026-01-25',
        planDuration: '3 days',
        planEffort: '24 hrs',
        predecessor: '2.3.2, 2.3.3',
        description: 'Compile Concept Screening Dossier and present recommendations for Gate 1 approval'
      }
    ]
  }
];

@Component({
  selector: 'app-project-wbs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    // EditProjWbsActivityComponent
  ],
  templateUrl: './project-wbs.component.html',
  styleUrl: './project-wbs.component.scss',
})
export class ProjectWbsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';
  stageCode: string = 'S1';
  stageName: string = 'Opportunity Identification';

  // Inner screen view state
  currentView: 'wbs' | 'requirements' | 'tasks' = 'wbs';
  selectedActivity: WbsActivityItem | null = null;

  // Filter properties matching AssetsComponent
  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';

  // Pagination properties matching AssetsComponent
  pageIndex = 0;
  pageSize = 10;

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
  ];

  deliverables: WbsDeliverable[] = [];
  selectedDeliverable!: WbsDeliverable;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Activity Modal state
  showActivityModal = false;
  isEditActivityMode = false;
  activityModalData: Partial<WbsActivityItem> = {};
  activityModalIndex = -1;

  readonly historySequence: number[] = [4, 7, 2, 9, 3, 8, 1, 6, 5, 10, 3, 6, 2, 8, 4, 7, 5, 1, 9, 2];
  readonly documentsSequence: number[] = [3, 1, 5, 2, 4, 2, 6, 1, 3, 4, 2, 5, 3, 1, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  syncActivityCounts(a: WbsActivityItem): void {
    const slNo = a.slNo || '';
    const actName = a.activityName || '';

    // 1. Requirements count
    const knownReqs = getRequirementsForWbs(slNo, actName);
    let totalReqs = knownReqs && knownReqs.length > 0 ? knownReqs.length : 13;
    let reqDone = Math.min(2, totalReqs);

    const checkKeys = [slNo, a.jobCode, actName, a.id ? String(a.id) : ''].filter(Boolean);
    for (const k of checkKeys) {
      const saved = sessionStorage.getItem('project_wbs_requirements_' + k)
        || sessionStorage.getItem('stages_requirements_' + k)
        || sessionStorage.getItem('project_wbs_reqs_' + k)
        || sessionStorage.getItem('stages_reqs_' + k);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const checkedCount = parsed.filter((item: any) => item.done || item.completed || item.status === 'Completed' || item.status === 'Approved' || item.checked).length;
            reqDone = checkedCount;
            totalReqs = parsed.length > 0 ? parsed.length : totalReqs;
            break;
          }
        } catch (e) {}
      }
    }
    a.requirements = `${reqDone}/${totalReqs}`;

    // 2. Tasks count
    const knownTasks = getTasksForWbs(slNo, actName);
    let totalTasks = knownTasks && knownTasks.length > 0 ? knownTasks.length : 5;
    let taskDone = Math.min(2, totalTasks);

    for (const k of checkKeys) {
      const saved = sessionStorage.getItem('project_wbs_tasks_' + k) || sessionStorage.getItem('stages_tasks_' + k);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const checkedCount = parsed.filter((item: any) => item.done || item.completed || item.status === 'Completed' || item.approved || item.checked).length;
            taskDone = checkedCount;
            totalTasks = parsed.length > 0 ? parsed.length : totalTasks;
            break;
          }
        } catch (e) {}
      }
    }
    a.tasks = `${taskDone}/${totalTasks}`;

    // 3. Pre-populate atomic requirements and tasks data if not present
    if (!a.requirementsData || a.requirementsData.length === 0) {
      const reqItems = getRequirementItemsForWbs(slNo, actName);
      if (reqItems && reqItems.length > 0) {
        const rolePersonMap: Record<string, string> = {
          'BD Lead': 'James Miller',
          'Portfolio Manager': 'Emily Watson',
          'Commercial Lead': 'Michael Scott',
          'Financial Analyst': 'Robert Chen',
          'Project Lead': 'Dr. Sarah Connor',
          'Task Lead': 'David Kim',
          'Data Lead': 'Jessica Alba',
          'Materials Lead': 'Olivia Brown',
          'Specifications Lead': 'Aarav Shah',
          'Compliance Officer': 'Dr. Sarah Jenkins'
        };
        const demoNames = [
          'Dr. Sarah Connor', 'James Miller', 'Emily Watson', 'Michael Scott',
          'Robert Chen', 'Jessica Alba', 'David Kim', 'Olivia Brown'
        ];
        a.requirementsData = reqItems.map((item, i) => {
          const { department, role } = getDepartmentAndRoleForRequirement(item.requirement);
          const resp = rolePersonMap[role] || demoNames[i % demoNames.length];
          return {
            id: Date.now() + i,
            active: true,
            done: i < 2,
            requirementName: item.requirement,
            department: department,
            role: role,
            responsibility: resp,
            dueDate: '2026-03-15',
            completedDate: i < 2 ? '2026-03-01' : '',
            remarks: 'Atomic prerequisite / resource verified',
            historyCount: this.getHistoryCount(i),
            documentsCount: this.getDocumentsCount(i),
            updatedDate: '2026-03-15',
            updatedBy: resp,
            isEditing: false
          };
        });
      }
    }

    if (!a.tasksData || a.tasksData.length === 0) {
      const taskItems = getTaskItemsForWbs(slNo, actName);
      if (taskItems && taskItems.length > 0) {
        a.tasksData = taskItems.map((item, i) => {
          const details = getTaskDetails(item.task, i, slNo, a.jobCode, a.jobCode, item.taskId);
          return {
            id: Date.now() + i,
            active: true,
            done: i < 2,
            approved: i < 2,
            taskName: item.task,
            taskCode: item.taskId || details.taskCode,
            jobCode: details.jobCode || a.jobCode || 'JOB-01',
            department: details.department,
            role: details.role,
            dueDate: details.dueDate,
            completedDate: i < 2 ? '2026-03-01' : '',
            responsibility: a.responsibility || 'Dr. Sarah Connor',
            priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
            remarks: 'Atomic task / deliverable verified',
            historyCount: this.getHistoryCount(i),
            documentsCount: this.getDocumentsCount(i),
            updatedDate: '2026-03-15',
            updatedBy: a.responsibility || 'Dr. Sarah Connor',
            isEditing: false
          };
        });
      }
    }
  }

  private resolveChemicalStage(): void {
    if (this.stageCode) {
      const codeKey = this.stageCode.toUpperCase().trim();
      if (CHEMICAL_STAGE_NAMES[codeKey]) {
        this.stageCode = codeKey;
        if (!this.stageName || this.isPharmaOrInvalidStageName(this.stageName)) {
          this.stageName = CHEMICAL_STAGE_NAMES[codeKey];
        }
      }
    }
    if (this.stageName) {
      const lower = this.stageName.toLowerCase().trim();
      if (CHEMICAL_NAME_TO_CODE[lower]) {
        this.stageCode = CHEMICAL_NAME_TO_CODE[lower];
        this.stageName = CHEMICAL_STAGE_NAMES[this.stageCode];
      }
    }
    if (!this.stageCode || !CHEMICAL_STAGE_NAMES[this.stageCode]) {
      this.stageCode = 'S1';
      this.stageName = 'Opportunity Identification';
    }
  }

  private isPharmaOrInvalidStageName(name: string): boolean {
    const lower = name.toLowerCase();
    return lower.includes('product') ||
      lower.includes('initiation') ||
      lower.includes('business case') ||
      lower.includes('formulation') ||
      lower.includes('procurement') ||
      lower.includes('validation') ||
      lower.includes('dossier') ||
      lower.includes('exhibit');
  }

  loadDeliverablesForStage(): void {
    this.resolveChemicalStage();
    const stageKey = this.stageCode || 'S1';
    const config: StageWbsConfig = STAGE_WBS_CONFIG_MAP[stageKey] || STAGE_WBS_CONFIG_MAP['S1'];

    if (config) {
      const deliverableMenus = config.sidebarMenus.filter(m => m.slNo !== 'ALL');
      const allActivities: WbsActivityData[] = (config.modulesData && config.modulesData[0]) ? config.modulesData[0] : [];

      const sampleDates = [
        '2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30',
        '2026-01-28', '2026-01-25', '2026-01-22', '2026-01-20', '2026-01-18'
      ];
      const samplePredecessors = ['6', '7', '5', '4', '3', '8', '2', '6', '5', '7'];
      const sampleSlacks = [
        '68 days', '89 days', '97 days', '-', '74 days', '62 days',
        '85 days', '-', '91 days', '78 days', '65 days', '99 days', '82 days', '-'
      ];

      let count = 0;
      this.deliverables = deliverableMenus.map((menu, mIdx) => {
        const rawItems = allActivities.filter(a =>
          a.deliverableSlNo === menu.slNo || (menu.slNo && a.slNo ? a.slNo.startsWith(menu.slNo) : false)
        );

        const activities: WbsActivityItem[] = rawItems.map((item, aIdx) => {
          const actItem: WbsActivityItem = {
            id: (mIdx + 1) * 100 + aIdx + 1,
            slNo: item.slNo,
            task: item.task,
            taskName: item.task,
            activityName: item.task,
            jobCode: item.jobCode || item.taskCode || `JOB-${stageKey}-${mIdx + 1}${aIdx + 1}`,
            department: item.department || 'Chemical R&D / Process Technology',
            responsibility: item.assignedTo || 'Dr. Sarah Jenkins',
            priority: (aIdx % 3 === 0 ? 'High' : aIdx % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
            status: true,
            slack: sampleSlacks[count % sampleSlacks.length],
            predecessor: item.predecessor && item.predecessor !== '0' ? item.predecessor : samplePredecessors[count % samplePredecessors.length],
            planStart: item.scheduled || '2026-01-10',
            planEnd: item.date || '2026-03-15',
            planDuration: `${item.duration || 5} days`,
            planEffort: `${item.effort || 40} hrs`,
            planBudget: item.planned && item.planned !== '0' ? `$${Number(item.planned).toLocaleString()}` : '$15,000',
            actualCost: item.actual && item.actual !== '0' ? `$${Number(item.actual).toLocaleString()}` : '$13,800',
            dueDate: item.scheduled || item.date || '2026-03-15',
            description: item.description || item.task,
            historyCount: this.getHistoryCount(count),
            documentsCount: this.getDocumentsCount(count),
            updatedDate: item.updatedDate || sampleDates[count % sampleDates.length],
            updatedBy: item.updatedBy || item.assignedTo || 'Dr. Sarah Jenkins',
            section: item.section || 'Chemical Process',
            applicability: item.applicability || 'All Products'
          };

          this.syncActivityCounts(actItem);
          count++;
          return actItem;
        });

        return {
          id: mIdx + 1,
          name: menu.name,
          activities: activities
        };
      });
    }

    if (this.deliverables.length > 0) {
      this.selectedDeliverable = this.deliverables[0];
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      if (params['stageName']) {
        this.stageName = params['stageName'];
      }
      if (params['stageCode']) {
        this.stageCode = params['stageCode'];
      }
      this.loadDeliverablesForStage();
    });
  }

  get filteredActivities(): WbsActivityItem[] {
    if (!this.selectedDeliverable || !this.selectedDeliverable.activities) {
      return [];
    }
    return this.selectedDeliverable.activities.filter(item => {
      const keywordMatches =
        !this.searchKeyword ||
        item.activityName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.jobCode.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.department.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.responsibility.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const itemStatusStr = item.status ? 'Active' : 'Inactive';
      const statusMatches = !this.searchStatus || itemStatusStr === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedActivities(): WbsActivityItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredActivities.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  selectDeliverable(d: WbsDeliverable): void {
    this.selectedDeliverable = d;
    this.pageIndex = 0;
  }

  deleteDeliverable(d: WbsDeliverable, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Deliverable', content: `Are you sure you want to delete "${d.name}"?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliverables = this.deliverables.filter(item => item.id !== d.id);
        if (this.selectedDeliverable?.id === d.id) {
          this.selectedDeliverable = this.deliverables[0] || null;
          this.pageIndex = 0;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/stages'], {
      queryParamsHandling: 'preserve'
    });
  }

  goToSchedule(): void {
    this.router.navigate(['/projects/dashboard/schedule'], {
      queryParamsHandling: 'preserve'
    });
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  toggleStatus(item: WbsActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status of this activity?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = !item.status;
      }
    });
  }

  deleteActivity(item: WbsActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Activity', content: 'Are you sure you want to delete this activity?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedDeliverable) {
        this.selectedDeliverable.activities = this.selectedDeliverable.activities.filter(a => a.id !== item.id);
      }
    });
  }

  openAddActivity(): void {
    const deliverableNames = this.deliverables.map(d => d.name);
    const currentDeliverable = this.selectedDeliverable?.name || deliverableNames[0] || '';
    const nextNum = (this.selectedDeliverable?.activities?.length || 0) + 1;

    const dialogRef = this.dialog.open(EditProjWbsActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityCode: 'ACT' + nextNum,
        department: 'Management',
        section: 'Formulation Development',
        applicability: 'All Products',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.selectedDeliverable) {
        const newAct: WbsActivityItem = {
          id: Date.now(),
          activityName: result.activityName || '',
          slack: '-',
          jobCode: result.activityCode || result.jobCode || ('ACT' + (this.selectedDeliverable.activities.length + 1)),
          department: result.department || 'Management',
          section: result.section || 'Formulation Development',
          applicability: result.applicability || 'All Products',
          responsibility: 'Dr. Sarah Connor',
          priority: 'Medium',
          status: true,
          predecessor: result.predecessor || '—',
          predecessorsData: result.predecessorsData || result.predecessors || [],
          requirements: '0/13',
          tasks: '0/16',
          planDuration: result.planDuration,
          planEffort: result.planEffort,
          planBudget: result.materialBudget,
          description: result.description,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedBy: 'Dr. Sarah Connor'
        };
        this.selectedDeliverable.activities.push(newAct);
      }
    });
  }

  openEditActivity(item: WbsActivityItem, index: number): void {
    const deliverableNames = this.deliverables.map(d => d.name);
    const currentDeliverable = this.selectedDeliverable?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(EditProjWbsActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityName: item.activityName || item.task || item.taskName || '',
        activityCode: item.jobCode,
        department: item.department || 'R&D',
        section: item.section || 'Formulation Development',
        applicability: item.applicability || 'All Products',
        description: item.description || '',
        planDuration: item.planDuration || '',
        planEffort: item.planEffort || '',
        materialBudget: item.planBudget || '',
        predecessor: item.predecessor && item.predecessor !== '—' ? item.predecessor : '',
        predecessorsData: item.predecessorsData,
        mode: 'edit',
       
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.selectedDeliverable) {
        const targetIndex = this.selectedDeliverable.activities.findIndex(a => a.id === item.id);
        const idxToUpdate = targetIndex !== -1 ? targetIndex : index;

        if (idxToUpdate !== -1 && this.selectedDeliverable.activities[idxToUpdate]) {
          const existing = this.selectedDeliverable.activities[idxToUpdate];
          this.selectedDeliverable.activities[idxToUpdate] = {
            ...existing,
            activityName: result.activityName || existing.activityName,
            jobCode: result.activityCode || result.jobCode || existing.jobCode,
            department: result.department || existing.department,
            section: result.section || existing.section,
            applicability: result.applicability || existing.applicability,
            description: result.description !== undefined ? result.description : existing.description,
            planDuration: result.planDuration !== undefined ? result.planDuration : existing.planDuration,
            planEffort: result.planEffort !== undefined ? result.planEffort : existing.planEffort,
            planBudget: result.materialBudget !== undefined ? result.materialBudget : existing.planBudget,
            predecessor: result.predecessor !== undefined ? result.predecessor : (existing.predecessor || '—'),
            predecessorsData: result.predecessorsData || result.predecessors || existing.predecessorsData,
            updatedDate: new Date().toISOString().split('T')[0],
            updatedBy: existing.responsibility || 'Dr. Sarah Jenkins'
          };
        }
      }
    });
  }

  saveActivity(): void {
    this.closeActivityModal();
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.activityModalData = {};
    this.activityModalIndex = -1;
  }

  openPredecessor(item?: WbsActivityItem): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: item ? { mode: 'edit', row: item } : {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && item) {
        if (result.predecessors) {
          item.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          item.predecessor = String(result.predecessor);
        }
      }
    });
  }

  openTimelineModal(item: WbsActivityItem): void {
    this.selectedTimelineItem = {
      ...item,
      earlyStart: item.earlyStart || item.planStart || '2026-01-05',
      earlyEnd: item.earlyEnd || item.planEnd || '2026-01-15',
      lateStart: item.lateStart || '2026-01-08',
      lateEnd: item.lateEnd || '2026-01-18',
      planStart: item.planStart || '2026-01-05',
      planEnd: item.planEnd || '2026-01-15',
      actualStart: item.actualStart || item.planStart || '2026-01-05',
      actualEnd: item.actualEnd || item.planEnd || '2026-01-15',
      eta: item.eta || item.planEnd || '2026-01-15',
      planDuration: item.planDuration || '10 days',
      planEffort: item.planEffort || '80 hrs',
      actualDuration: item.actualDuration || item.planDuration || '10 days',
      actualEffort: item.actualEffort || item.planEffort || '80 hrs'
    };
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
  }

  openAddSimulation(): void {
    const dialogRef = this.dialog.open(AddSimulationComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Simulation data saved:', result);
      }
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  openHistory(item?: WbsActivityItem): void {
    this.router.navigate(['history'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        responsibility: item?.responsibility,
        delayReason: item?.delayReason,
        priority: item?.priority,
        updatedDate: item?.updatedDate,
        updatedBy: item?.updatedBy,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  assignrequirement(item?: WbsActivityItem): void {
    this.router.navigate(['requirements'], {
      relativeTo: this.route,
      queryParams: {
        slNo: item?.slNo,
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        requirements: item?.requirements
      },
      queryParamsHandling: 'merge'
    });
  }

  assigntasks(item?: WbsActivityItem): void {
    this.router.navigate(['tasks'], {
      relativeTo: this.route,
      queryParams: {
        slNo: item?.slNo,
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        tasks: item?.tasks
      },
      queryParamsHandling: 'merge'
    });
  }

  closeInnerScreen(result?: any): void {
    if (result && this.selectedActivity) {
      if (this.currentView === 'requirements' && result.count !== undefined) {
        const denom = (this.selectedActivity.requirements || '').split('/')[1] || '13';
        this.selectedActivity.requirements = `${result.count}/${denom}`;
        if (result.requirements) {
          this.selectedActivity.requirementsData = result.requirements;
        }
      } else if (this.currentView === 'tasks' && result.count !== undefined) {
        const denom = (this.selectedActivity.tasks || '').split('/')[1] || '16';
        this.selectedActivity.tasks = `${result.count}/${denom}`;
        if (result.tasks) {
          this.selectedActivity.tasksData = result.tasks;
        }
      }
    }
    this.currentView = 'wbs';
    this.selectedActivity = null;
  }
}
