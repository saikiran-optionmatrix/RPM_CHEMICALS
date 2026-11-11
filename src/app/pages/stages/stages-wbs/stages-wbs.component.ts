import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddDeliverableComponent } from './add-deliverable/add-deliverable.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AssignRequirementsComponent } from './assign-requirements/assign-requirements.component';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { StagesPredecessorComponent } from './stages-predecessor/stages-predecessor.component';
import { DescriptionDialogComponent } from '../../../common/shared/description-dialog/description-dialog.component';

export interface WbsTask {
  deliverableSlNo: string;
  slNo: string;
  task: string;
  predecessor: string;
  department?: string;
  applicability: string;
  taskCode: string;
  jobCode: string;
  activityCode?: string;
  effort: string;
  duration: string;
  description: string;
  procedure: string;
  planned: string;
  assignedTo: string;
  assigned: string;
  actual: string;
  cost: string;
  worked: string;
  remaining: string;
  scheduled: string;
  date: string;
  status: string;
  submitted: string;
  requirements?: string;
  tasks?: string;
  requirementsData?: any[];
  tasksData?: any[];
  predecessorsData?: any[];
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface SidebarMenu {
  slNo?: string;
  name: string;
  description?: string;
  count: number;
  isOpen: boolean;
  subItems?: string[];
}

export interface StageWbsConfig {
  sidebarMenus: SidebarMenu[];
  modulesData: WbsTask[][];
}

@Component({
  selector: 'app-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './stages-wbs.component.html',
  styleUrls: ['./stages-wbs.component.scss']
})
export class StagesWbsComponent implements OnInit {
  // Modern Dependency Injection
  private readonly dialog = inject(MatDialog);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  // @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View State
  stageCode: string = 'S1';
  stageName: string = 'Opportunity Identification';
  gateCode: string = '-';

  sidebarMenus: SidebarMenu[] = [];
  modulesData: WbsTask[][] = [];
  selectedMenuIndex: number = 0;

  tableData: WbsTask[] = [];
  paginatedData: WbsTask[] = [];

  // Pagination properties
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  private stageWbsMap: { [key: string]: StageWbsConfig } = {
  "S1": {
    "sidebarMenus": [
      {
        "slNo": "1.1",
        "name": "Market opportunity and customer requirements baseline",
        "description": "Compile and obtain cross-functional approval of the market opportunity and customer requirements baseline deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "1.2",
        "name": "Product concept and preliminary business case",
        "description": "Compile and obtain cross-functional approval of the product concept and preliminary business case deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "1.1",
          "slNo": "1.1.1",
          "task": "Review industrial application demand, customer specifications and market opportunities",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T001",
          "jobCode": "BD01",
          "activityCode": "1.1.1",
          "department": "Commercial / Business Development",
          "effort": "100",
          "duration": "5",
          "description": "Review industrial application demand, customer specifications and market opportunities (CHM-T001). Sequencing context: Initial activity for this stage.",
          "procedure": "BD01; process data; approved procedures and equipment as applicable",
          "planned": "511452",
          "assignedTo": "Commercial",
          "assigned": "511452",
          "actual": "511452",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.1",
          "slNo": "1.1.2",
          "task": "Benchmark competing chemical grades, suppliers and production technologies",
          "predecessor": "1.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T002",
          "jobCode": "BD01",
          "activityCode": "1.1.2",
          "department": "Commercial / Business Development",
          "effort": "100",
          "duration": "5",
          "description": "Benchmark competing chemical grades, suppliers and production technologies (CHM-T002). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "BD01; process data; approved procedures and equipment as applicable",
          "planned": "524867",
          "assignedTo": "Commercial",
          "assigned": "524867",
          "actual": "524867",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "1.2",
          "slNo": "1.2.1",
          "task": "Define target product profile, purity, concentration and performance attributes",
          "predecessor": "1.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T003",
          "jobCode": "RND01",
          "activityCode": "1.2.1",
          "department": "R&D Chemistry",
          "effort": "100",
          "duration": "5",
          "description": "Define target product profile, purity, concentration and performance attributes (CHM-T003). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "RND01; process data; approved procedures and equipment as applicable",
          "planned": "535530",
          "assignedTo": "R&D Chemistry",
          "assigned": "535530",
          "actual": "535530",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.2",
          "slNo": "1.2.2",
          "task": "Prepare preliminary business case, project economics and opportunity assessment",
          "predecessor": "1.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T004",
          "jobCode": "PM01",
          "activityCode": "1.2.2",
          "department": "Project Management",
          "effort": "100",
          "duration": "5",
          "description": "Prepare preliminary business case, project economics and opportunity assessment (CHM-T004). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "PM01; process data; approved procedures and equipment as applicable",
          "planned": "553874",
          "assignedTo": "Project Management",
          "assigned": "553874",
          "actual": "553874",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S2": {
    "sidebarMenus": [
      {
        "slNo": "2.1",
        "name": "Product and process feasibility assessment",
        "description": "Compile and obtain cross-functional approval of the product and process feasibility assessment deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "2.2",
        "name": "Project charter, EHS and regulatory feasibility package",
        "description": "Compile and obtain cross-functional approval of the project charter, ehs and regulatory feasibility package deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      },
      {
        "slNo": "Gate 1",
        "name": "Gate 1: Concept Approval Checkpoints",
        "description": "Formal Stage-Gate quality checkpoint: GATE 1: Concept Approval. Review decision options (Go / Hold / Kill / Rework / Redirect) against all mandatory and recommended gate acceptance criteria.",
        "count": 7,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.1",
          "task": "Screen reaction chemistry, formulation options and product feasibility",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T005",
          "jobCode": "RND01",
          "activityCode": "2.1.1",
          "department": "R&D Chemistry",
          "effort": "75",
          "duration": "5",
          "description": "Screen reaction chemistry, formulation options and product feasibility (CHM-T005). Sequencing context: Initial activity for this stage.",
          "procedure": "RND01; process data; approved procedures and equipment as applicable",
          "planned": "577765",
          "assignedTo": "R&D Chemistry",
          "assigned": "577765",
          "actual": "577765",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.2",
          "task": "Assess raw material availability, critical reagent supply and vendor capability",
          "predecessor": "2.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T006",
          "jobCode": "Raw Material Storekeeper",
          "activityCode": "2.1.2",
          "department": "Supply Chain & Sourcing",
          "effort": "75",
          "duration": "5",
          "description": "Assess raw material availability, critical reagent supply and vendor capability (CHM-T006). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Raw Material Storekeeper; process data; approved procedures and equipment as applicable",
          "planned": "542428",
          "assignedTo": "Supply Chain & Sourcing",
          "assigned": "542428",
          "actual": "542428",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "2.2",
          "slNo": "2.2.1",
          "task": "Conduct preliminary process hazard, environmental and regulatory screening",
          "predecessor": "2.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T007",
          "jobCode": "Process Safety Engineer",
          "activityCode": "2.2.1",
          "department": "Process Safety & EHS",
          "effort": "75",
          "duration": "5",
          "description": "Conduct preliminary process hazard, environmental and regulatory screening (CHM-T007). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Process Safety Engineer; process data; approved procedures and equipment as applicable",
          "planned": "588192",
          "assignedTo": "Process Safety & EHS",
          "assigned": "588192",
          "actual": "588192",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.2",
          "slNo": "2.2.2",
          "task": "Prepare feasibility report, target specifications and Gate 1 submission",
          "predecessor": "2.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T008",
          "jobCode": "Quality Assurance Manager",
          "activityCode": "2.2.2",
          "department": "Quality Assurance",
          "effort": "75",
          "duration": "5",
          "description": "Prepare feasibility report, target specifications and Gate 1 submission (CHM-T008). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Assurance Manager; process data; approved procedures and equipment as applicable",
          "planned": "545479",
          "assignedTo": "Quality Assurance",
          "assigned": "545479",
          "actual": "545479",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.1",
          "task": "Market Demand & Competitive Benchmark Assessment",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate1.1",
          "jobCode": "GATE",
          "activityCode": "Gate1.1",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Target applications, market size, competitor grades and customer needs documented and approved by commercial.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G1-01).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "591180",
          "assignedTo": "Gate Committee",
          "assigned": "591180",
          "actual": "591180",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.2",
          "task": "Chemistry & Process Feasibility Assessment",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate1.2",
          "jobCode": "GATE",
          "activityCode": "Gate1.2",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Reaction pathway, raw material availability and technical feasibility confirmed by process chemistry.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G1-02).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "590159",
          "assignedTo": "Gate Committee",
          "assigned": "590159",
          "actual": "590159",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.3",
          "task": "Preliminary Business Case & Cost of Manufacturing Model",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate1.3",
          "jobCode": "GATE",
          "activityCode": "Gate1.3",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Target product profile, projected cost of manufacturing, volume and NPV threshold validated by finance.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G1-03).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "594831",
          "assignedTo": "Gate Committee",
          "assigned": "594831",
          "actual": "594831",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.4",
          "task": "Patents & Freedom-to-Operate (FTO) Clearance",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate1.4",
          "jobCode": "GATE",
          "activityCode": "Gate1.4",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Formal IP landscape search and freedom-to-operate opinion documented for the chemistry, process and application.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G1-04).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "595698",
          "assignedTo": "Gate Committee",
          "assigned": "595698",
          "actual": "595698",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.5",
          "task": "Process Safety, Technology & Scale-Up Risk Assessment",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate1.5",
          "jobCode": "GATE",
          "activityCode": "Gate1.5",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Critical hazards (exotherm, toxic or flammable materials) and technology risks identified with mitigation plans.. Mandatory: No. Source: Source: S27 Gate Checklists (G1-05).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "590472",
          "assignedTo": "Gate Committee",
          "assigned": "590472",
          "actual": "590472",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.6",
          "task": "Regulatory Pathway & Registration Strategy Outline",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate1.6",
          "jobCode": "GATE",
          "activityCode": "Gate1.6",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Registration pathway (REACH, TSCA, India, ASEAN) and high-level data needs outlined.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G1-06).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "591028",
          "assignedTo": "Gate Committee",
          "assigned": "591028",
          "actual": "591028",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 1",
          "slNo": "Gate1.7",
          "task": "Executive Committee Concept Approval Release",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate1.7",
          "jobCode": "GATE",
          "activityCode": "Gate1.7",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Formal executive sign-off granting authority to fund route scouting and allocate team resources.. Mandatory: No. Source: Source: S27 Gate Checklists (G1-07).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "597904",
          "assignedTo": "Gate Committee",
          "assigned": "597904",
          "actual": "597904",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S3": {
    "sidebarMenus": [
      {
        "slNo": "3.1",
        "name": "Candidate chemistry routes and laboratory synthesis results",
        "description": "Compile and obtain cross-functional approval of the candidate chemistry routes and laboratory synthesis results deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "3.2",
        "name": "Intermediate characterization and route scouting report",
        "description": "Compile and obtain cross-functional approval of the intermediate characterization and route scouting report deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.1",
          "task": "Develop candidate synthesis routes and reaction pathway hypotheses",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T009",
          "jobCode": "RND01",
          "activityCode": "3.1.1",
          "department": "R&D Chemistry",
          "effort": "375",
          "duration": "5",
          "description": "Develop candidate synthesis routes and reaction pathway hypotheses (CHM-T009). Sequencing context: Initial activity for this stage.",
          "procedure": "RND01; process data; approved procedures and equipment as applicable",
          "planned": "541616",
          "assignedTo": "R&D Chemistry",
          "assigned": "541616",
          "actual": "541616",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.2",
          "task": "Conduct laboratory-scale reaction and catalyst screening experiments",
          "predecessor": "3.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T010",
          "jobCode": "Reactor Operator",
          "activityCode": "3.1.2",
          "department": "Reaction Engineering",
          "effort": "375",
          "duration": "5",
          "description": "Conduct laboratory-scale reaction and catalyst screening experiments (CHM-T010). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Reactor Operator; process data; approved procedures and equipment as applicable",
          "planned": "584479",
          "assignedTo": "Reaction Engineering",
          "assigned": "584479",
          "actual": "584479",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.1",
          "task": "Characterize intermediates, impurities and product composition using GC/HPLC and spectroscopy",
          "predecessor": "3.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T011",
          "jobCode": "Chromatography (GC / HPLC) Analyst",
          "activityCode": "3.2.1",
          "department": "Analytical Chemistry",
          "effort": "375",
          "duration": "5",
          "description": "Characterize intermediates, impurities and product composition using GC/HPLC and spectroscopy (CHM-T011). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Chromatography (GC / HPLC) Analyst; process data; approved procedures and equipment as applicable",
          "planned": "532294",
          "assignedTo": "Analytical Chemistry",
          "assigned": "532294",
          "actual": "532294",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.2",
          "task": "Document route scouting results, material balance and preliminary yield assessment",
          "predecessor": "3.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T012",
          "jobCode": "Quality Control Executive",
          "activityCode": "3.2.2",
          "department": "Quality Control",
          "effort": "375",
          "duration": "5",
          "description": "Document route scouting results, material balance and preliminary yield assessment (CHM-T012). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Control Executive; process data; approved procedures and equipment as applicable",
          "planned": "567133",
          "assignedTo": "Quality Control",
          "assigned": "567133",
          "actual": "567133",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S4": {
    "sidebarMenus": [
      {
        "slNo": "4.1",
        "name": "Optimized laboratory process and operating window",
        "description": "Compile and obtain cross-functional approval of the optimized laboratory process and operating window deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "4.2",
        "name": "Analytical control strategy and process robustness evidence",
        "description": "Compile and obtain cross-functional approval of the analytical control strategy and process robustness evidence deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "4.1",
          "slNo": "4.1.1",
          "task": "Optimize reaction parameters, catalyst loading, temperature, pressure and residence time",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T013",
          "jobCode": "Reactor Operator",
          "activityCode": "4.1.1",
          "department": "Reaction Engineering",
          "effort": "750",
          "duration": "5",
          "description": "Optimize reaction parameters, catalyst loading, temperature, pressure and residence time (CHM-T013). Sequencing context: Initial activity for this stage.",
          "procedure": "Reactor Operator; process data; approved procedures and equipment as applicable",
          "planned": "545982",
          "assignedTo": "Reaction Engineering",
          "assigned": "545982",
          "actual": "545982",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.1",
          "slNo": "4.1.2",
          "task": "Evaluate solvent systems, separation methods and purification sequence",
          "predecessor": "4.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T014",
          "jobCode": "Distillation Operator",
          "activityCode": "4.1.2",
          "department": "Separation & Purification",
          "effort": "750",
          "duration": "5",
          "description": "Evaluate solvent systems, separation methods and purification sequence (CHM-T014). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Distillation Operator; process data; approved procedures and equipment as applicable",
          "planned": "521815",
          "assignedTo": "Separation & Purification",
          "assigned": "521815",
          "actual": "521815",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "4.2",
          "slNo": "4.2.1",
          "task": "Assess process yield, selectivity, impurity profile and batch-to-batch reproducibility",
          "predecessor": "4.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T015",
          "jobCode": "Quality Control Executive",
          "activityCode": "4.2.1",
          "department": "Quality Control",
          "effort": "750",
          "duration": "5",
          "description": "Assess process yield, selectivity, impurity profile and batch-to-batch reproducibility (CHM-T015). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Control Executive; process data; approved procedures and equipment as applicable",
          "planned": "570792",
          "assignedTo": "Quality Control",
          "assigned": "570792",
          "actual": "570792",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.2",
          "slNo": "4.2.2",
          "task": "Develop analytical methods and establish in-process control limits",
          "predecessor": "4.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T016",
          "jobCode": "Chromatography (GC / HPLC) Analyst",
          "activityCode": "4.2.2",
          "department": "Analytical Chemistry",
          "effort": "750",
          "duration": "5",
          "description": "Develop analytical methods and establish in-process control limits (CHM-T016). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Chromatography (GC / HPLC) Analyst; process data; approved procedures and equipment as applicable",
          "planned": "538948",
          "assignedTo": "Analytical Chemistry",
          "assigned": "538948",
          "actual": "538948",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S5": {
    "sidebarMenus": [
      {
        "slNo": "5.1",
        "name": "Selected process route and approved basis of design",
        "description": "Compile and obtain cross-functional approval of the selected process route and approved basis of design deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "5.2",
        "name": "Engineering design basis and scale-up risk assessment",
        "description": "Compile and obtain cross-functional approval of the engineering design basis and scale-up risk assessment deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      },
      {
        "slNo": "Gate 2",
        "name": "Gate 2: Process Route Selection Checkpoints",
        "description": "Formal Stage-Gate quality checkpoint: GATE 2: Process Route Selection. Review decision options (Go / Hold / Kill / Rework / Redirect) against all mandatory and recommended gate acceptance criteria.",
        "count": 6,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "5.1",
          "slNo": "5.1.1",
          "task": "Compare candidate process routes against safety, quality, cost and sustainability criteria",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T017",
          "jobCode": "Engineering Manager",
          "activityCode": "5.1.1",
          "department": "Process Engineering",
          "effort": "300",
          "duration": "5",
          "description": "Compare candidate process routes against safety, quality, cost and sustainability criteria (CHM-T017). Sequencing context: Initial activity for this stage.",
          "procedure": "Engineering Manager; process data; approved procedures and equipment as applicable",
          "planned": "522764",
          "assignedTo": "Process Engineering",
          "assigned": "522764",
          "actual": "522764",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.1",
          "slNo": "5.1.2",
          "task": "Prepare process flow diagrams, mass and energy balances and equipment sizing basis",
          "predecessor": "5.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T018",
          "jobCode": "Engineering Executive",
          "activityCode": "5.1.2",
          "department": "Process Engineering",
          "effort": "300",
          "duration": "5",
          "description": "Prepare process flow diagrams, mass and energy balances and equipment sizing basis (CHM-T018). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Engineering Executive; process data; approved procedures and equipment as applicable",
          "planned": "530207",
          "assignedTo": "Process Engineering",
          "assigned": "530207",
          "actual": "530207",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "5.2",
          "slNo": "5.2.1",
          "task": "Define critical process parameters, control strategy and operating envelope",
          "predecessor": "5.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T019",
          "jobCode": "Instrumentation and DCS Technician",
          "activityCode": "5.2.1",
          "department": "Instrumentation & DCS",
          "effort": "300",
          "duration": "5",
          "description": "Define critical process parameters, control strategy and operating envelope (CHM-T019). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Instrumentation and DCS Technician; process data; approved procedures and equipment as applicable",
          "planned": "567051",
          "assignedTo": "Instrumentation & DCS",
          "assigned": "567051",
          "actual": "567051",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.2",
          "slNo": "5.2.2",
          "task": "Complete basis of design, scale-up risk review and Gate 2 recommendation",
          "predecessor": "5.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T020",
          "jobCode": "PM01",
          "activityCode": "5.2.2",
          "department": "Project Management",
          "effort": "300",
          "duration": "5",
          "description": "Complete basis of design, scale-up risk review and Gate 2 recommendation (CHM-T020). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "PM01; process data; approved procedures and equipment as applicable",
          "planned": "558783",
          "assignedTo": "Project Management",
          "assigned": "558783",
          "actual": "558783",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "Gate 2",
          "slNo": "Gate2.1",
          "task": "Yield & Selectivity Profile",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate2.1",
          "jobCode": "GATE",
          "activityCode": "Gate2.1",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Candidate route meets yield and selectivity targets at bench scale.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G2-01).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "596938",
          "assignedTo": "Gate Committee",
          "assigned": "596938",
          "actual": "596938",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 2",
          "slNo": "Gate2.2",
          "task": "Process Robustness Proof",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate2.2",
          "jobCode": "GATE",
          "activityCode": "Gate2.2",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Route performs consistently across repeated runs and parameter ranges.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G2-02).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "592139",
          "assignedTo": "Gate Committee",
          "assigned": "592139",
          "actual": "592139",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 2",
          "slNo": "Gate2.3",
          "task": "Impurity & Waste Assessment",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate2.3",
          "jobCode": "GATE",
          "activityCode": "Gate2.3",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Impurity profile, by-products and waste streams meet product and environmental criteria.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G2-03).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "593261",
          "assignedTo": "Gate Committee",
          "assigned": "593261",
          "actual": "593261",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 2",
          "slNo": "Gate2.4",
          "task": "Preliminary Safety Screening",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate2.4",
          "jobCode": "GATE",
          "activityCode": "Gate2.4",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Reaction calorimetry and thermal stability show an acceptable safety margin.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G2-04).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "592648",
          "assignedTo": "Gate Committee",
          "assigned": "592648",
          "actual": "592648",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 2",
          "slNo": "Gate2.5",
          "task": "Basis of Design & Cost of Manufacturing Estimate",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate2.5",
          "jobCode": "GATE",
          "activityCode": "Gate2.5",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Basis of Design and projected cost of manufacturing reviewed by process engineering.. Mandatory: No. Source: Source: S27 Gate Checklists (G2-05).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "592560",
          "assignedTo": "Gate Committee",
          "assigned": "592560",
          "actual": "592560",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 2",
          "slNo": "Gate2.6",
          "task": "Route Selection Committee Release",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate2.6",
          "jobCode": "GATE",
          "activityCode": "Gate2.6",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Formal sign-off to select the route and start pilot development.. Mandatory: No. Source: Source: S27 Gate Checklists (G2-06).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "593052",
          "assignedTo": "Gate Committee",
          "assigned": "593052",
          "actual": "593052",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S6": {
    "sidebarMenus": [
      {
        "slNo": "6.1",
        "name": "Bench-to-pilot process development package",
        "description": "Compile and obtain cross-functional approval of the bench-to-pilot process development package deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "6.2",
        "name": "Pilot equipment, materials and scale-up readiness",
        "description": "Compile and obtain cross-functional approval of the pilot equipment, materials and scale-up readiness deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "6.1",
          "slNo": "6.1.1",
          "task": "Translate laboratory process parameters into bench and pilot scale operating procedures",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T021",
          "jobCode": "Reactor Operator",
          "activityCode": "6.1.1",
          "department": "Reaction Engineering",
          "effort": "875",
          "duration": "5",
          "description": "Translate laboratory process parameters into bench and pilot scale operating procedures (CHM-T021). Sequencing context: Initial activity for this stage.",
          "procedure": "Reactor Operator; process data; approved procedures and equipment as applicable",
          "planned": "554267",
          "assignedTo": "Reaction Engineering",
          "assigned": "554267",
          "actual": "554267",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.1",
          "slNo": "6.1.2",
          "task": "Execute bench-scale batches and assess yield, quality and process consistency",
          "predecessor": "6.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T022",
          "jobCode": "Production Supervisor",
          "activityCode": "6.1.2",
          "department": "Manufacturing / Production",
          "effort": "875",
          "duration": "5",
          "description": "Execute bench-scale batches and assess yield, quality and process consistency (CHM-T022). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Production Supervisor; process data; approved procedures and equipment as applicable",
          "planned": "568485",
          "assignedTo": "Manufacturing",
          "assigned": "568485",
          "actual": "568485",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "6.2",
          "slNo": "6.2.1",
          "task": "Develop downstream separation, solvent recovery and waste treatment operations",
          "predecessor": "6.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T023",
          "jobCode": "Distillation Operator",
          "activityCode": "6.2.1",
          "department": "Separation & Purification",
          "effort": "875",
          "duration": "5",
          "description": "Develop downstream separation, solvent recovery and waste treatment operations (CHM-T023). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Distillation Operator; process data; approved procedures and equipment as applicable",
          "planned": "562616",
          "assignedTo": "Separation & Purification",
          "assigned": "562616",
          "actual": "562616",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.2",
          "slNo": "6.2.2",
          "task": "Qualify raw materials, utilities, equipment and measurement systems for pilot readiness",
          "predecessor": "6.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T024",
          "jobCode": "Process Validation Executive",
          "activityCode": "6.2.2",
          "department": "Process Validation",
          "effort": "875",
          "duration": "5",
          "description": "Qualify raw materials, utilities, equipment and measurement systems for pilot readiness (CHM-T024). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Process Validation Executive; process data; approved procedures and equipment as applicable",
          "planned": "541643",
          "assignedTo": "Process Validation",
          "assigned": "541643",
          "actual": "541643",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S7": {
    "sidebarMenus": [
      {
        "slNo": "7.1",
        "name": "Process safety and risk assessment dossier",
        "description": "Compile and obtain cross-functional approval of the process safety and risk assessment dossier deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "7.2",
        "name": "Regulatory, environmental and pilot readiness evidence",
        "description": "Compile and obtain cross-functional approval of the regulatory, environmental and pilot readiness evidence deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      },
      {
        "slNo": "Gate 3",
        "name": "Gate 3: Registration & Pilot Readiness Checkpoints",
        "description": "Formal Stage-Gate quality checkpoint: GATE 3: Registration & Pilot Readiness. Review decision options (Go / Hold / Kill / Rework / Redirect) against all mandatory and recommended gate acceptance criteria.",
        "count": 6,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "7.1",
          "slNo": "7.1.1",
          "task": "Complete process hazard analysis (HAZOP), risk assessment and safeguards review",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T025",
          "jobCode": "Process Safety Engineer",
          "activityCode": "7.1.1",
          "department": "Process Safety & EHS",
          "effort": "800",
          "duration": "5",
          "description": "Complete process hazard analysis (HAZOP), risk assessment and safeguards review (CHM-T025). Sequencing context: Initial activity for this stage.",
          "procedure": "Process Safety Engineer; process data; approved procedures and equipment as applicable",
          "planned": "586608",
          "assignedTo": "Process Safety & EHS",
          "assigned": "586608",
          "actual": "586608",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.1",
          "slNo": "7.1.2",
          "task": "Assess occupational exposure, chemical compatibility, fire and explosion protection",
          "predecessor": "7.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T026",
          "jobCode": "Process Safety Engineer",
          "activityCode": "7.1.2",
          "department": "Process Safety & EHS",
          "effort": "800",
          "duration": "5",
          "description": "Assess occupational exposure, chemical compatibility, fire and explosion protection (CHM-T026). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Process Safety Engineer; process data; approved procedures and equipment as applicable",
          "planned": "580220",
          "assignedTo": "Process Safety & EHS",
          "assigned": "580220",
          "actual": "580220",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.1",
          "task": "Develop environmental impact, effluent, emissions and hazardous waste management plans",
          "predecessor": "7.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T027",
          "jobCode": "Effluent and Stack Emission Monitoring Analyst",
          "activityCode": "7.2.1",
          "department": "Environmental & Effluent Management",
          "effort": "800",
          "duration": "5",
          "description": "Develop environmental impact, effluent, emissions and hazardous waste management plans (CHM-T027). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Effluent and Stack Emission Monitoring Analyst; process data; approved procedures and equipment as applicable",
          "planned": "543201",
          "assignedTo": "Environmental & Effluent Management",
          "assigned": "543201",
          "actual": "543201",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.2",
          "task": "Compile regulatory data package, safety studies and Gate 3 readiness evidence",
          "predecessor": "7.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T028",
          "jobCode": "REG01",
          "activityCode": "7.2.2",
          "department": "Regulatory Affairs",
          "effort": "800",
          "duration": "5",
          "description": "Compile regulatory data package, safety studies and Gate 3 readiness evidence (CHM-T028). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "REG01; process data; approved procedures and equipment as applicable",
          "planned": "538189",
          "assignedTo": "Regulatory Affairs",
          "assigned": "538189",
          "actual": "538189",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "Gate 3",
          "slNo": "Gate3.1",
          "task": "Process Hazard Analysis Package",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate3.1",
          "jobCode": "GATE",
          "activityCode": "Gate3.1",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: HAZOP and LOPA complete with all high-risk actions closed.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G3-01).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "596446",
          "assignedTo": "Gate Committee",
          "assigned": "596446",
          "actual": "596446",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 3",
          "slNo": "Gate3.2",
          "task": "Pilot Plant Readiness",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate3.2",
          "jobCode": "GATE",
          "activityCode": "Gate3.2",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Equipment, utilities and operating procedures ready for the pilot campaign.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G3-02).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "596669",
          "assignedTo": "Gate Committee",
          "assigned": "596669",
          "actual": "596669",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 3",
          "slNo": "Gate3.3",
          "task": "Product Specification & Method Validation",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate3.3",
          "jobCode": "GATE",
          "activityCode": "Gate3.3",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Product specification and analytical methods validated.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G3-03).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "593202",
          "assignedTo": "Gate Committee",
          "assigned": "593202",
          "actual": "593202",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 3",
          "slNo": "Gate3.4",
          "task": "Environmental & Toxicology Data Package",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate3.4",
          "jobCode": "GATE",
          "activityCode": "Gate3.4",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Ecotoxicology, toxicology and fate data complete for registration.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G3-04).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "594019",
          "assignedTo": "Gate Committee",
          "assigned": "594019",
          "actual": "594019",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 3",
          "slNo": "Gate3.5",
          "task": "REACH / TSCA Dossier & Regulator Advice",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate3.5",
          "jobCode": "GATE",
          "activityCode": "Gate3.5",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Registration dossier compiled and regulator or consultant advice incorporated.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G3-05).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "596855",
          "assignedTo": "Gate Committee",
          "assigned": "596855",
          "actual": "596855",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 3",
          "slNo": "Gate3.6",
          "task": "Executive Committee Registration & Pilot Release",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate3.6",
          "jobCode": "GATE",
          "activityCode": "Gate3.6",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Formal sign-off to file registration and start the pilot campaign.. Mandatory: No. Source: Source: S27 Gate Checklists (G3-06).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "592246",
          "assignedTo": "Gate Committee",
          "assigned": "592246",
          "actual": "592246",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S8": {
    "sidebarMenus": [
      {
        "slNo": "8.1",
        "name": "Chemical registration dossier and submission",
        "description": "Compile and obtain cross-functional approval of the chemical registration dossier and submission deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "8.2",
        "name": "Regulatory filing, authority interaction and compliance records",
        "description": "Compile and obtain cross-functional approval of the regulatory filing, authority interaction and compliance records deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "8.1",
          "slNo": "8.1.1",
          "task": "Prepare jurisdiction-specific registration strategy and chemical inventory submissions",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T029",
          "jobCode": "REG01",
          "activityCode": "8.1.1",
          "department": "Regulatory Affairs",
          "effort": "375",
          "duration": "5",
          "description": "Prepare jurisdiction-specific registration strategy and chemical inventory submissions (CHM-T029). Sequencing context: Initial activity for this stage.",
          "procedure": "REG01; process data; approved procedures and equipment as applicable",
          "planned": "510170",
          "assignedTo": "Regulatory Affairs",
          "assigned": "510170",
          "actual": "510170",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.1",
          "slNo": "8.1.2",
          "task": "Compile substance identity, composition, impurity and physicochemical data dossiers",
          "predecessor": "8.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T030",
          "jobCode": "Quality Documentation Executive",
          "activityCode": "8.1.2",
          "department": "Quality Documentation",
          "effort": "375",
          "duration": "5",
          "description": "Compile substance identity, composition, impurity and physicochemical data dossiers (CHM-T030). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Documentation Executive; process data; approved procedures and equipment as applicable",
          "planned": "588498",
          "assignedTo": "Quality Documentation",
          "assigned": "588498",
          "actual": "588498",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.1",
          "task": "Complete toxicology, ecotoxicology and exposure data review as applicable",
          "predecessor": "8.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T031",
          "jobCode": "REG01",
          "activityCode": "8.2.1",
          "department": "Regulatory Affairs",
          "effort": "375",
          "duration": "5",
          "description": "Complete toxicology, ecotoxicology and exposure data review as applicable (CHM-T031). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "REG01; process data; approved procedures and equipment as applicable",
          "planned": "589620",
          "assignedTo": "Regulatory Affairs",
          "assigned": "589620",
          "actual": "589620",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.2",
          "task": "Submit REACH, TSCA, India and other applicable registration dossiers; track authority queries",
          "predecessor": "8.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T032",
          "jobCode": "REG01",
          "activityCode": "8.2.2",
          "department": "Regulatory Affairs",
          "effort": "375",
          "duration": "5",
          "description": "Submit REACH, TSCA, India and other applicable registration dossiers; track authority queries (CHM-T032). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "REG01; process data; approved procedures and equipment as applicable",
          "planned": "569754",
          "assignedTo": "Regulatory Affairs",
          "assigned": "569754",
          "actual": "569754",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S9": {
    "sidebarMenus": [
      {
        "slNo": "9.1",
        "name": "Pilot plant campaign execution records",
        "description": "Compile and obtain cross-functional approval of the pilot plant campaign execution records deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "9.2",
        "name": "Pilot batch quality, yield and scale-up assessment",
        "description": "Compile and obtain cross-functional approval of the pilot batch quality, yield and scale-up assessment deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "9.1",
          "slNo": "9.1.1",
          "task": "Plan pilot plant campaign, batch sequence, raw material staging and resource allocation",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T033",
          "jobCode": "Production Manager",
          "activityCode": "9.1.1",
          "department": "Manufacturing / Production",
          "effort": "900",
          "duration": "5",
          "description": "Plan pilot plant campaign, batch sequence, raw material staging and resource allocation (CHM-T033). Sequencing context: Initial activity for this stage.",
          "procedure": "Production Manager; process data; approved procedures and equipment as applicable",
          "planned": "519849",
          "assignedTo": "Manufacturing",
          "assigned": "519849",
          "actual": "519849",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.1",
          "slNo": "9.1.2",
          "task": "Execute pilot batches and monitor critical process parameters and control limits",
          "predecessor": "9.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T034",
          "jobCode": "Production Supervisor",
          "activityCode": "9.1.2",
          "department": "Manufacturing / Production",
          "effort": "900",
          "duration": "5",
          "description": "Execute pilot batches and monitor critical process parameters and control limits (CHM-T034). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Production Supervisor; process data; approved procedures and equipment as applicable",
          "planned": "527985",
          "assignedTo": "Manufacturing",
          "assigned": "527985",
          "actual": "527985",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "9.2",
          "slNo": "9.2.1",
          "task": "Perform in-process sampling, finished product testing and batch record review",
          "predecessor": "9.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T035",
          "jobCode": "Quality Control Manager",
          "activityCode": "9.2.1",
          "department": "Quality Control",
          "effort": "900",
          "duration": "5",
          "description": "Perform in-process sampling, finished product testing and batch record review (CHM-T035). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Control Manager; process data; approved procedures and equipment as applicable",
          "planned": "560161",
          "assignedTo": "Quality Control",
          "assigned": "560161",
          "actual": "560161",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.2",
          "slNo": "9.2.2",
          "task": "Evaluate pilot campaign yield, deviations, process capability and scale-up readiness",
          "predecessor": "9.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T036",
          "jobCode": "Process Validation Executive",
          "activityCode": "9.2.2",
          "department": "Process Validation",
          "effort": "900",
          "duration": "5",
          "description": "Evaluate pilot campaign yield, deviations, process capability and scale-up readiness (CHM-T036). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Process Validation Executive; process data; approved procedures and equipment as applicable",
          "planned": "560938",
          "assignedTo": "Process Validation",
          "assigned": "560938",
          "actual": "560938",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S10": {
    "sidebarMenus": [
      {
        "slNo": "10.1",
        "name": "Demonstration-scale campaign performance package",
        "description": "Compile and obtain cross-functional approval of the demonstration-scale campaign performance package deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "10.2",
        "name": "Commercial plant design basis and Gate 4 evidence",
        "description": "Compile and obtain cross-functional approval of the commercial plant design basis and gate 4 evidence deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      },
      {
        "slNo": "Gate 4",
        "name": "Gate 4: Demo-Scale Proof Checkpoints",
        "description": "Formal Stage-Gate quality checkpoint: GATE 4: Demo-Scale Proof. Review decision options (Go / Hold / Kill / Rework / Redirect) against all mandatory and recommended gate acceptance criteria.",
        "count": 6,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.1",
          "task": "Execute demonstration-scale campaign using approved process and control strategy",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T037",
          "jobCode": "Production Manager",
          "activityCode": "10.1.1",
          "department": "Manufacturing / Production",
          "effort": "1000",
          "duration": "5",
          "description": "Execute demonstration-scale campaign using approved process and control strategy (CHM-T037). Sequencing context: Initial activity for this stage.",
          "procedure": "Production Manager; process data; approved procedures and equipment as applicable",
          "planned": "574609",
          "assignedTo": "Manufacturing",
          "assigned": "574609",
          "actual": "574609",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.2",
          "task": "Verify product quality, throughput, cycle time and operating reliability at demo scale",
          "predecessor": "10.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T038",
          "jobCode": "Quality Control Manager",
          "activityCode": "10.1.2",
          "department": "Quality Control",
          "effort": "1000",
          "duration": "5",
          "description": "Verify product quality, throughput, cycle time and operating reliability at demo scale (CHM-T038). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Control Manager; process data; approved procedures and equipment as applicable",
          "planned": "524740",
          "assignedTo": "Quality Control",
          "assigned": "524740",
          "actual": "524740",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "10.2",
          "slNo": "10.2.1",
          "task": "Assess waste generation, solvent recovery, energy consumption and operating cost",
          "predecessor": "10.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T039",
          "jobCode": "Effluent and Stack Emission Monitoring Analyst",
          "activityCode": "10.2.1",
          "department": "Environmental & Effluent Management",
          "effort": "1000",
          "duration": "5",
          "description": "Assess waste generation, solvent recovery, energy consumption and operating cost (CHM-T039). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Effluent and Stack Emission Monitoring Analyst; process data; approved procedures and equipment as applicable",
          "planned": "517379",
          "assignedTo": "Environmental & Effluent Management",
          "assigned": "517379",
          "actual": "517379",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.2",
          "slNo": "10.2.2",
          "task": "Prepare demonstration-scale performance report and Gate 4 evidence package",
          "predecessor": "10.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T040",
          "jobCode": "Quality Assurance Manager",
          "activityCode": "10.2.2",
          "department": "Quality Assurance",
          "effort": "1000",
          "duration": "5",
          "description": "Prepare demonstration-scale performance report and Gate 4 evidence package (CHM-T040). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Assurance Manager; process data; approved procedures and equipment as applicable",
          "planned": "588734",
          "assignedTo": "Quality Assurance",
          "assigned": "588734",
          "actual": "588734",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "Gate 4",
          "slNo": "Gate4.1",
          "task": "Pilot Plant Performance Review",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate4.1",
          "jobCode": "GATE",
          "activityCode": "Gate4.1",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Pilot data show target yield, quality and acceptable safety performance.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G4-01).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "590849",
          "assignedTo": "Gate Committee",
          "assigned": "590849",
          "actual": "590849",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 4",
          "slNo": "Gate4.2",
          "task": "Demo-Scale Campaign Results",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate4.2",
          "jobCode": "GATE",
          "activityCode": "Gate4.2",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Demo-scale batches meet specification with a validated, repeatable process.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G4-02).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "593047",
          "assignedTo": "Gate Committee",
          "assigned": "593047",
          "actual": "593047",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 4",
          "slNo": "Gate4.3",
          "task": "Customer Qualification Evidence",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate4.3",
          "jobCode": "GATE",
          "activityCode": "Gate4.3",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Key customers confirm performance in their applications.. Mandatory: No. Source: Source: S27 Gate Checklists (G4-03).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "597657",
          "assignedTo": "Gate Committee",
          "assigned": "597657",
          "actual": "597657",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 4",
          "slNo": "Gate4.4",
          "task": "Process Safety Review Outcome",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate4.4",
          "jobCode": "GATE",
          "activityCode": "Gate4.4",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Safety review recommends continuation with no open critical findings.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G4-04).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "593065",
          "assignedTo": "Gate Committee",
          "assigned": "593065",
          "actual": "593065",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 4",
          "slNo": "Gate4.5",
          "task": "Regulatory Registration Status",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate4.5",
          "jobCode": "GATE",
          "activityCode": "Gate4.5",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Registration progress and authority feedback documented.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G4-05).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "592434",
          "assignedTo": "Gate Committee",
          "assigned": "592434",
          "actual": "592434",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 4",
          "slNo": "Gate4.6",
          "task": "Commercial Plant Design & Capex Approval",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate4.6",
          "jobCode": "GATE",
          "activityCode": "Gate4.6",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Plant design package and capital budget approved.. Mandatory: No. Source: Source: S27 Gate Checklists (G4-06).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "593025",
          "assignedTo": "Gate Committee",
          "assigned": "593025",
          "actual": "593025",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S11": {
    "sidebarMenus": [
      {
        "slNo": "11.1",
        "name": "Commercial plant construction and commissioning package",
        "description": "Compile and obtain cross-functional approval of the commercial plant construction and commissioning package deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "11.2",
        "name": "Equipment qualification, process validation and readiness approval",
        "description": "Compile and obtain cross-functional approval of the equipment qualification, process validation and readiness approval deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      },
      {
        "slNo": "Gate 5",
        "name": "Gate 5: Commercial Production Readiness Checkpoints",
        "description": "Formal Stage-Gate quality checkpoint: GATE 5: Commercial Production Readiness. Review decision options (Go / Hold / Kill / Rework / Redirect) against all mandatory and recommended gate acceptance criteria.",
        "count": 5,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.1",
          "task": "Complete detailed engineering, procurement, construction and installation of commercial plant",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T041",
          "jobCode": "Engineering Manager",
          "activityCode": "11.1.1",
          "department": "Process Engineering",
          "effort": "1625",
          "duration": "5",
          "description": "Complete detailed engineering, procurement, construction and installation of commercial plant (CHM-T041). Sequencing context: Initial activity for this stage.",
          "procedure": "Engineering Manager; process data; approved procedures and equipment as applicable",
          "planned": "522424",
          "assignedTo": "Process Engineering",
          "assigned": "522424",
          "actual": "522424",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.2",
          "task": "Commission reactors, separation systems, utilities, DCS, instrumentation and safety systems",
          "predecessor": "11.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T042",
          "jobCode": "Commissioning and Qualification Engineer",
          "activityCode": "11.1.2",
          "department": "Commissioning & Qualification",
          "effort": "1625",
          "duration": "5",
          "description": "Commission reactors, separation systems, utilities, DCS, instrumentation and safety systems (CHM-T042). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Commissioning and Qualification Engineer; process data; approved procedures and equipment as applicable",
          "planned": "558476",
          "assignedTo": "Commissioning & Qualification",
          "assigned": "558476",
          "actual": "558476",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.1",
          "task": "Execute equipment qualification, process validation and operator training",
          "predecessor": "11.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T043",
          "jobCode": "Process Validation Executive",
          "activityCode": "11.2.1",
          "department": "Process Validation",
          "effort": "1625",
          "duration": "5",
          "description": "Execute equipment qualification, process validation and operator training (CHM-T043). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Process Validation Executive; process data; approved procedures and equipment as applicable",
          "planned": "518189",
          "assignedTo": "Process Validation",
          "assigned": "518189",
          "actual": "518189",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.2",
          "task": "Complete commercial plant readiness, EHS clearance and Gate 5 approval dossier",
          "predecessor": "11.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T044",
          "jobCode": "Quality Assurance Manager",
          "activityCode": "11.2.2",
          "department": "Quality Assurance",
          "effort": "1625",
          "duration": "5",
          "description": "Complete commercial plant readiness, EHS clearance and Gate 5 approval dossier (CHM-T044). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Assurance Manager; process data; approved procedures and equipment as applicable",
          "planned": "530900",
          "assignedTo": "Quality Assurance",
          "assigned": "530900",
          "actual": "530900",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "Gate 5",
          "slNo": "Gate5.1",
          "task": "Commissioning & Performance Test Results",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate5.1",
          "jobCode": "GATE",
          "activityCode": "Gate5.1",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Plant meets guaranteed capacity, yield and quality in performance tests.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G5-01).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "596604",
          "assignedTo": "Gate Committee",
          "assigned": "596604",
          "actual": "596604",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 5",
          "slNo": "Gate5.2",
          "task": "Operating Procedures & Training",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate5.2",
          "jobCode": "GATE",
          "activityCode": "Gate5.2",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Operating procedures complete and operators trained and certified.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G5-02).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "592935",
          "assignedTo": "Gate Committee",
          "assigned": "592935",
          "actual": "592935",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 5",
          "slNo": "Gate5.3",
          "task": "Safety, Environmental & Permit Compliance",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate5.3",
          "jobCode": "GATE",
          "activityCode": "Gate5.3",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Pre-startup safety review complete and operating consents in force.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G5-03).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "591757",
          "assignedTo": "Gate Committee",
          "assigned": "591757",
          "actual": "591757",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 5",
          "slNo": "Gate5.4",
          "task": "Labeling (GHS / CLP), SDS & Emergency Response Plan",
          "predecessor": "Deliverables complete",
          "applicability": "Mandatory: Yes",
          "taskCode": "Gate5.4",
          "jobCode": "GATE",
          "activityCode": "Gate5.4",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Labels, SDS and emergency response plan approved.. Mandatory: Yes. Source: Source: S27 Gate Checklists (G5-04).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "591559",
          "assignedTo": "Gate Committee",
          "assigned": "591559",
          "actual": "591559",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "Gate 5",
          "slNo": "Gate5.5",
          "task": "Executive Committee Production Start Release",
          "predecessor": "Deliverables complete",
          "applicability": "Recommended",
          "taskCode": "Gate5.5",
          "jobCode": "GATE",
          "activityCode": "Gate5.5",
          "department": "Gate Review Committee",
          "effort": "0",
          "duration": "1",
          "description": "Gate Acceptance Criterion: Formal sign-off to start commercial production.. Mandatory: No. Source: Source: S27 Gate Checklists (G5-05).",
          "procedure": "Executive committee review, documented sign-off, and formal gate release decision.",
          "planned": "595748",
          "assignedTo": "Gate Committee",
          "assigned": "595748",
          "actual": "595748",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S12": {
    "sidebarMenus": [
      {
        "slNo": "12.1",
        "name": "Commercial launch and first-batch release package",
        "description": "Compile and obtain cross-functional approval of the commercial launch and first-batch release package deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "12.2",
        "name": "Ramp-up, product stewardship and post-launch improvement plan",
        "description": "Compile and obtain cross-functional approval of the ramp-up, product stewardship and post-launch improvement plan deliverable. Consolidate supporting activity outputs, verify traceability to chemical product requirements, process safety and regulatory expectations, and retain controlled evidence.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "12.1",
          "slNo": "12.1.1",
          "task": "Execute first commercial production batches and confirm approved release specifications",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "CHM-T045",
          "jobCode": "Production Manager",
          "activityCode": "12.1.1",
          "department": "Manufacturing / Production",
          "effort": "325",
          "duration": "5",
          "description": "Execute first commercial production batches and confirm approved release specifications (CHM-T045). Sequencing context: Initial activity for this stage.",
          "procedure": "Production Manager; process data; approved procedures and equipment as applicable",
          "planned": "516433",
          "assignedTo": "Manufacturing",
          "assigned": "516433",
          "actual": "516433",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "12.1",
          "slNo": "12.1.2",
          "task": "Monitor process performance, batch quality, yield and manufacturing KPIs during ramp-up",
          "predecessor": "12.1.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T046",
          "jobCode": "Production Supervisor",
          "activityCode": "12.1.2",
          "department": "Manufacturing / Production",
          "effort": "325",
          "duration": "5",
          "description": "Monitor process performance, batch quality, yield and manufacturing KPIs during ramp-up (CHM-T046). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Production Supervisor; process data; approved procedures and equipment as applicable",
          "planned": "532444",
          "assignedTo": "Manufacturing",
          "assigned": "532444",
          "actual": "532444",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "12.2",
          "slNo": "12.2.1",
          "task": "Establish product stewardship, SDS controls, customer technical support and change management",
          "predecessor": "12.2.0 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T047",
          "jobCode": "Quality Assurance Manager",
          "activityCode": "12.2.1",
          "department": "Quality Assurance",
          "effort": "325",
          "duration": "5",
          "description": "Establish product stewardship, SDS controls, customer technical support and change management (CHM-T047). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "Quality Assurance Manager; process data; approved procedures and equipment as applicable",
          "planned": "524445",
          "assignedTo": "Quality Assurance",
          "assigned": "524445",
          "actual": "524445",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "12.2",
          "slNo": "12.2.2",
          "task": "Complete launch review, supply continuity plan and post-launch improvement actions",
          "predecessor": "12.2.1 (FS)",
          "applicability": "All Products",
          "taskCode": "CHM-T048",
          "jobCode": "PM01",
          "activityCode": "12.2.2",
          "department": "Project Management",
          "effort": "325",
          "duration": "5",
          "description": "Complete launch review, supply continuity plan and post-launch improvement actions (CHM-T048). Sequencing context: Follows preceding activity in deliverable sequence.",
          "procedure": "PM01; process data; approved procedures and equipment as applicable",
          "planned": "516501",
          "assignedTo": "Project Management",
          "assigned": "516501",
          "actual": "516501",
          "cost": "0",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  }
};

  constructor() {
    // takeUntilDestroyed automatically unsubscribes when the component is destroyed
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      this.loadStageData();
    });
  }

  ngOnInit(): void {
    // Initialized via constructor subscription
  }

  goBack(): void {
    this.location.back();
  }

  private loadStageData(): void {
    const stageKey = this.stageCode?.trim() || 'S1';

    const nameMap: Record<string, string> = {
      // Chemical Stage Names (from Excel)
      'Opportunity Identification': 'S1',
      'Concept Screening & Feasibility': 'S2',
      'Route Scouting & Lab Synthesis': 'S3',
      'Process Optimization (Lab Scale)': 'S4',
      'Process Route Selection & Basis of Design': 'S5',
      'Bench-to-Pilot Process Development': 'S6',
      'Process Safety & Regulatory Studies': 'S7',
      'Regulatory Registration Filing (REACH / TSCA)': 'S8',
      'Pilot Plant Campaign': 'S9',
      'Demonstration-Scale Campaign': 'S10',
      'Commercial Plant Build & Commissioning': 'S11',
      'Commercial Launch & Ramp-Up': 'S12',

      'Stage 1 (S1): Opportunity Identification': 'S1',
      'Stage 2 (S2): Concept Screening & Feasibility': 'S2',
      'Stage 3 (S3): Route Scouting & Lab Synthesis': 'S3',
      'Stage 4 (S4): Process Optimization (Lab Scale)': 'S4',
      'Stage 5 (S5): Process Route Selection & Basis of Design': 'S5',
      'Stage 6 (S6): Bench-to-Pilot Process Development': 'S6',
      'Stage 7 (S7): Process Safety & Regulatory Studies': 'S7',
      'Stage 8 (S8): Regulatory Registration Filing (REACH / TSCA)': 'S8',
      'Stage 9 (S9): Pilot Plant Campaign': 'S9',
      'Stage 10 (S10): Demonstration-Scale Campaign': 'S10',
      'Stage 11 (S11): Commercial Plant Build & Commissioning': 'S11',
      'Stage 12 (S12): Commercial Launch & Ramp-Up': 'S12',

      // S-prefixed
      'S1 – Opportunity Identification': 'S1',
      'S2 – Concept Screening & Feasibility': 'S2',
      'S3 – Route Scouting & Lab Synthesis': 'S3',
      'S4 – Process Optimization (Lab Scale)': 'S4',
      'S5 – Process Route Selection & Basis of Design': 'S5',
      'S6 – Bench-to-Pilot Process Development': 'S6',
      'S7 – Process Safety & Regulatory Studies': 'S7',
      'S8 – Regulatory Registration Filing (REACH / TSCA)': 'S8',
      'S9 – Pilot Plant Campaign': 'S9',
      'S10 – Demonstration-Scale Campaign': 'S10',
      'S11 – Commercial Plant Build & Commissioning': 'S11',
      'S12 – Commercial Launch & Ramp-Up': 'S12',

      'S0': 'S1'
    };

    let config = this.stageWbsMap[stageKey]
      || this.stageWbsMap[stageKey.toUpperCase()]
      || this.stageWbsMap[nameMap[stageKey]]
      || this.stageWbsMap[nameMap[this.stageName]]
      || this.stageWbsMap[this.stageName]
      || this.getFallbackStageConfig(this.stageName, this.stageCode);

    // Deep copy data so edits only apply locally and ensure requirements/tasks are assigned
    this.sidebarMenus = config.sidebarMenus.map(m => ({ ...m }));
    this.modulesData = config.modulesData.map((mod, modIdx) =>
      mod.map((t, taskIdx) => {
        const copy: WbsTask = { ...t };
        if (!copy.requirements) {
          copy.requirements = this.getDefaultRequirements(modIdx, taskIdx);
        } else if (typeof copy.requirements === 'string' && copy.requirements.includes('/')) {
          copy.requirements = copy.requirements.split('/')[0];
        }
        if (!copy.tasks) {
          copy.tasks = this.getDefaultTasks(modIdx, taskIdx);
        } else if (typeof copy.tasks === 'string' && copy.tasks.includes('/')) {
          copy.tasks = copy.tasks.split('/')[0];
        }
        if (!copy.historyCount) {
          copy.historyCount = this.getHistoryCount(taskIdx);
        }
        if (!copy.updatedDate) {
          const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20', '2026-01-15', '2026-01-10'];
          copy.updatedDate = sampleDates[(modIdx * 3 + taskIdx) % sampleDates.length];
        }
        if (!copy.updatedBy) {
          copy.updatedBy = copy.assignedTo || 'Dr. Sarah Jenkins';
        }
        return copy;
      })
    );

    // Sync menu counts
    this.sidebarMenus.forEach((menu, i) => {
      menu.count = this.modulesData[i]?.length || 0;
    });

    this.selectedMenuIndex = 0;
    this.sidebarMenus.forEach((m, idx) => m.isOpen = idx === 0);
    this.tableData = this.modulesData[0] || [];
    this.totalItems = this.tableData.length;
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  private getFallbackStageConfig(name: string, code: string): StageWbsConfig {
    return {
      sidebarMenus: [
        { slNo: '1.1', name: `${name} Planning & Setup`, count: 0, isOpen: true }
      ],
      modulesData: [[]]
    };
  }

  private getDefaultRequirements(modIdx: number, taskIdx: number): string {
    const numbers = ['7', '8', '9', '1', '2', '3', '4', '5', '6', '10', '11', '12', '13'];
    const index = (modIdx * 3 + taskIdx * 2) % numbers.length;
    return numbers[index];
  }

  private getDefaultTasks(modIdx: number, taskIdx: number): string {
    const numbers = ['8', '1', '7', '9', '5', '12', '4', '6', '3', '10', '2', '11', '13'];
    const index = (modIdx * 3 + taskIdx * 2 + 1) % numbers.length;
    return numbers[index];
  }

  selectMenu(index: number): void {
    this.selectedMenuIndex = index;
    this.sidebarMenus.forEach((menu, i) => {
      menu.isOpen = (i === index) ? !menu.isOpen : false;
    });
    this.tableData = this.modulesData[index] || [];
    this.pageIndex = 0;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, startIndex + this.pageSize);
  }

  openAddDeliverableDialog(): void {
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: '1.2',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        const nextSlNo = result.stage || `${this.stageCode}.${this.sidebarMenus.length + 1}`;
        this.sidebarMenus.push({
          slNo: nextSlNo,
          name: result.deliverableName,
          count: 0,
          isOpen: false
        });
        this.modulesData.push([]);
      }
    });
  }

  onDeliverableDrop(event: CdkDragDrop<SidebarMenu[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const currentSelected = this.sidebarMenus[this.selectedMenuIndex];

    moveItemInArray(this.sidebarMenus, event.previousIndex, event.currentIndex);
    moveItemInArray(this.modulesData, event.previousIndex, event.currentIndex);

    if (currentSelected) {
      this.selectedMenuIndex = this.sidebarMenus.indexOf(currentSelected);
    }

    this.tableData = this.modulesData[this.selectedMenuIndex] || [];
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  editDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: menu.slNo,
        name: menu.name,
        deliverableName: menu.name,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        menu.name = result.deliverableName;
        if (result.stage) {
          menu.slNo = result.stage;
          if (this.modulesData[index]) {
            this.modulesData[index].forEach(task => {
              task.deliverableSlNo = result.stage;
            });
          }
        }
      }
    });
  }

  deleteDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: menu
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sidebarMenus.splice(index, 1);
        this.modulesData.splice(index, 1);

        if (this.selectedMenuIndex >= this.sidebarMenus.length) {
          this.selectedMenuIndex = Math.max(0, this.sidebarMenus.length - 1);
        }

        if (this.sidebarMenus.length > 0) {
          this.sidebarMenus.forEach((m, i) => {
            m.isOpen = (i === this.selectedMenuIndex);
          });
          this.tableData = this.modulesData[this.selectedMenuIndex] || [];
        } else {
          this.tableData = [];
        }

        this.pageIndex = 0;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openAddActivityDialog(): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        department: 'R&D',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.activityName) {
        const nextId = this.tableData.length + 1;
        const parentSl = this.sidebarMenus[this.selectedMenuIndex]?.slNo || `1.${this.selectedMenuIndex + 1}`;
        const taskSlNo = `${parentSl}.${nextId}`;

        const newTask: WbsTask = {
          deliverableSlNo: parentSl,
          slNo: taskSlNo,
          task: result.activityName,
          activityCode: result.activityCode || `ACT-${this.selectedMenuIndex + 1}0${nextId}`,
          department: result.department || 'R&D',
          predecessor: result.predecessor || '—',
          predecessorsData: result.predecessors || result.predecessorsData,
          applicability: result.applicability || 'All Products',
          taskCode: `TC-${this.selectedMenuIndex + 1}0${nextId}`,
          jobCode: `JOB${nextId}`,
          effort: result.planEffort || '0',
          duration: result.planDuration || '0',
          description: result.description || '',
          procedure: 'Standard SOP',
          planned: '0.00',
          assignedTo: result.department || 'Unassigned',
          assigned: '0.00',
          actual: '0.00',
          cost: result.materialBudget || '0.00',
          worked: '0.00',
          remaining: '0.00',
          scheduled: '-',
          date: '-',
          status: 'Scheduled',
          submitted: '-',
          requirements: `${Math.floor(Math.random() * 13) + 1}`,
          tasks: `${Math.floor(Math.random() * 13) + 1}/14`
        };

        this.tableData.push(newTask);
        this.modulesData[this.selectedMenuIndex] = this.tableData;
        this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openEditActivityDialog(row: WbsTask): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        department: row.department || 'R&D',
        applicability: row.applicability,
        description: row.description,
        planDuration: row.duration,
        planEffort: row.effort,
        materialBudget: row.cost,
        predecessor: row.predecessor !== '—' ? row.predecessor : '',
        predecessorsData: row.predecessorsData,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.activityName) row.task = result.activityName;
        if (result.activityCode !== undefined) row.activityCode = result.activityCode;
        if (result.department !== undefined) row.department = result.department;
        if (result.applicability !== undefined) row.applicability = result.applicability;
        if (result.description !== undefined) row.description = result.description;
        if (result.planEffort !== undefined) row.effort = result.planEffort;
        if (result.planDuration !== undefined) row.duration = result.planDuration;
        if (result.materialBudget !== undefined) row.cost = result.materialBudget;
        if (result.predecessor !== undefined) row.predecessor = result.predecessor || '—';
        if (result.predecessors !== undefined) row.predecessorsData = result.predecessors;
        this.updatePaginatedData();
      }
    });
  }

  deleteTask(row: WbsTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.modulesData[this.selectedMenuIndex] = this.tableData;
          this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
          this.totalItems = this.tableData.length;
          this.updatePaginatedData();
        }
      }
    });
  }

  openfilepop(): void {
    
  }

  scrollLeft(): void {
    this.scrollTable('left');
  }

  scrollRight(): void {
    this.scrollTable('right');
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }








  assignrequirement(row?: WbsTask): void {
    const dialogRef = this.dialog.open(AssignRequirementsComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.requirements = result.count !== undefined ? String(result.count) : row.requirements;
        if (result.requirements) {
          (row as any).requirementsData = result.requirements;
        }
        this.updatePaginatedData();
      }
    });
  }


  assigntasks(row?: WbsTask): void {
    const dialogRef = this.dialog.open(AssignTasksComponent, {
      width: '850px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.tasks = result.count !== undefined ? String(result.count) : row.tasks;
        if (result.tasks) {
          row.tasksData = result.tasks;
        }
        this.updatePaginatedData();
      }
    });
  }

  openPredecessor(row?: WbsTask): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: { mode: 'edit', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessor = String(result.predecessor);
        }
        this.updatePaginatedData();
      }
    });
  }

  openHistory(row: WbsTask, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/stages/wbs/history'], {
      queryParams: {
        slNo: row.slNo,
        task: row.task,
        activityCode: row.activityCode || row.taskCode || '',
        tasks: row.tasks || '',
        requirements: row.requirements || '',
        predecessor: row.predecessor || '',
        duration: row.duration || '',
        effort: row.effort || '',
        cost: row.cost || '',
        applicability: row.applicability || 'All Products',
        description: row.description || '',
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode,
        deliverableSlNo: row.deliverableSlNo,
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  openDescription(row: WbsTask): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: row.task,
        code: row.slNo,
        type: 'Activity',
        description: row.description
      }
    });
  }

  openDeliverableDescription(menu: SidebarMenu, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: menu.name,
        code: menu.slNo,
        type: 'Deliverable',
        description: menu.description || 'Deliverable description not available.'
      }
    });
  }

}
