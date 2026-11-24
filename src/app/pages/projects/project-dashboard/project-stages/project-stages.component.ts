import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { EditProjectStagesComponent } from './edit-project-stages/edit-project-stages.component';

// Adjust path based on your project structure
// import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

export interface GanttBar {
  name: string;
  planStart: string;
  planEnd: string;
  planEffort: string;
}

export interface StageItem {
  stageCode: string;
  name: string;
  planEffort: string;
  planDuration: string;
  actualEffort?: string;
  actualDuration?: string;
  percentCompletion?: number;
  done?: boolean;
  description: string;
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
  eta: string;
  buffer: string;
  gateName: string;
  gateStatus: 'Approved' | 'Pending' | 'Rejected';
  gateCode: string;
  status: boolean;
  setupCount: number;
  expanded?: boolean;
  bars?: GanttBar[];
  historyCount?: number;
  documentsCount?: number;
  updated?: string;
  updatedDate?: string;
  updatedBy?: string;
  // WBS modules omitted as per request
}

@Component({
  selector: 'app-project-stages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,

  ],
  templateUrl: './project-stages.component.html',
  styleUrl: './project-stages.component.scss',
})
export class ProjectStagesComponent implements OnInit, OnDestroy {

  // Project Header Properties
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Stages';

  // --- Migrated Properties ---
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  activeView: 'grid' | 'gantt' = 'grid';
  ganttScale: 'monthly' | 'weekly' | 'daily' = 'monthly';

  stageOptions: string[] = [
  "Opportunity Identification",
  "Concept Screening & Feasibility",
  "Route Scouting & Lab Synthesis",
  "Process Optimization (Lab Scale)",
  "Process Route Selection & Basis of Design",
  "Bench-to-Pilot Process Development",
  "Process Safety & Regulatory Studies",
  "Regulatory Registration Filing (REACH / TSCA)",
  "Pilot Plant Campaign",
  "Demonstration-Scale Campaign",
  "Commercial Plant Build & Commissioning",
  "Commercial Launch & Ramp-Up"
];

  stages: StageItem[] = [
  {
    "stageCode": "S1",
    "name": "Opportunity Identification",
    "planEffort": "400 hrs",
    "planDuration": "10 days",
    "actualEffort": "400 hrs",
    "actualDuration": "10 days",
    "percentCompletion": 100,
    "done": true,
    "description": "Market assessment, competitor grade benchmarking and customer application research",
    "planStart": "2026-01-05",
    "planEnd": "2026-01-15",
    "actualStart": "2026-01-05",
    "actualEnd": "2026-01-15",
    "eta": "2026-01-15",
    "buffer": "2 days",
    "gateName": "-",
    "gateStatus": "Approved",
    "gateCode": "-",
    "status": true,
    "setupCount": 14,
    "updatedDate": "2026-01-15",
    "updated": "2026-01-15",
    "updatedBy": "Ananya Rao",
    "bars": [
      {
        "name": "Competitor Grade & Price Benchmarking",
        "planStart": "2026-01-05",
        "planEnd": "2026-01-08",
        "planEffort": "160 hrs"
      },
      {
        "name": "Customer Application & Specification Research",
        "planStart": "2026-01-09",
        "planEnd": "2026-01-12",
        "planEffort": "140 hrs"
      },
      {
        "name": "Target Market & Regulatory-Region Shortlist",
        "planStart": "2026-01-13",
        "planEnd": "2026-01-15",
        "planEffort": "100 hrs"
      }
    ]
  },
  {
    "stageCode": "S2",
    "name": "Concept Screening & Feasibility",
    "planEffort": "300 hrs",
    "planDuration": "10 days",
    "actualEffort": "300 hrs",
    "actualDuration": "10 days",
    "percentCompletion": 100,
    "done": true,
    "description": "Preliminary reaction chemistry, raw material cost modeling and hazard screening",
    "planStart": "2026-01-16",
    "planEnd": "2026-01-25",
    "actualStart": "2026-01-16",
    "actualEnd": "2026-01-25",
    "eta": "2026-01-25",
    "buffer": "2 days",
    "gateName": "Concept Approval",
    "gateStatus": "Approved",
    "gateCode": "Gate 1",
    "status": true,
    "setupCount": 12,
    "updatedDate": "2026-01-25",
    "updated": "2026-01-25",
    "updatedBy": "Rajesh Kumar",
    "bars": [
      {
        "name": "Reaction Chemistry & Hazard Screening",
        "planStart": "2026-01-16",
        "planEnd": "2026-01-20",
        "planEffort": "160 hrs"
      },
      {
        "name": "Cost of Manufacturing & Capex Modeling",
        "planStart": "2026-01-21",
        "planEnd": "2026-01-25",
        "planEffort": "140 hrs"
      }
    ]
  },
  {
    "stageCode": "S3",
    "name": "Route Scouting & Lab Synthesis",
    "planEffort": "1500 hrs",
    "planDuration": "30 days",
    "actualEffort": "1500 hrs",
    "actualDuration": "30 days",
    "percentCompletion": 100,
    "done": true,
    "description": "Monomer & surfactant characterization, initiator screening and synthesis",
    "planStart": "2026-01-26",
    "planEnd": "2026-02-25",
    "actualStart": "2026-01-26",
    "actualEnd": "2026-02-25",
    "eta": "2026-02-25",
    "buffer": "3 days",
    "gateName": "-",
    "gateStatus": "Approved",
    "gateCode": "-",
    "status": true,
    "setupCount": 13,
    "updatedDate": "2026-02-25",
    "updated": "2026-02-25",
    "updatedBy": "Anita Desai",
    "bars": [
      {
        "name": "Monomer & Surfactant Characterization",
        "planStart": "2026-01-26",
        "planEnd": "2026-02-10",
        "planEffort": "750 hrs"
      },
      {
        "name": "Initiator & Chain-Transfer Agent Screening",
        "planStart": "2026-02-11",
        "planEnd": "2026-02-25",
        "planEffort": "750 hrs"
      }
    ]
  },
  {
    "stageCode": "S4",
    "name": "Process Optimization (Lab Scale)",
    "planEffort": "3000 hrs",
    "planDuration": "60 days",
    "actualEffort": "1740 hrs",
    "actualDuration": "35 days",
    "percentCompletion": 58,
    "done": false,
    "description": "Reaction recipe design, monomer feed profile optimization and 2 L lab reactor batches",
    "planStart": "2026-02-26",
    "planEnd": "2026-04-27",
    "actualStart": "2026-02-26",
    "actualEnd": "",
    "eta": "2026-04-27",
    "buffer": "5 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 14,
    "updatedDate": "2026-04-15",
    "updated": "2026-04-15",
    "updatedBy": "Priya Reddy",
    "bars": [
      {
        "name": "Monomer Feed Profile & Reaction Kinetics",
        "planStart": "2026-02-26",
        "planEnd": "2026-03-20",
        "planEffort": "1200 hrs"
      },
      {
        "name": "Lab Reactor Batches & Residual Monomer Reduction",
        "planStart": "2026-03-21",
        "planEnd": "2026-04-15",
        "planEffort": "1000 hrs"
      },
      {
        "name": "Particle Size & Viscosity Method Development",
        "planStart": "2026-04-16",
        "planEnd": "2026-04-27",
        "planEffort": "800 hrs"
      }
    ]
  },
  {
    "stageCode": "S5",
    "name": "Process Route Selection & Basis of Design",
    "planEffort": "1200 hrs",
    "planDuration": "25 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "Synthesis route freeze, raw material specifications and Basis of Design (BOD)",
    "planStart": "2026-04-28",
    "planEnd": "2026-05-22",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-05-22",
    "buffer": "2 days",
    "gateName": "Process Route Selection",
    "gateStatus": "Pending",
    "gateCode": "Gate 2",
    "status": true,
    "setupCount": 11,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "Route Yield & Conversion Review",
        "planStart": "2026-04-28",
        "planEnd": "2026-05-10",
        "planEffort": "600 hrs"
      },
      {
        "name": "Basis of Design (BOD) & Gate 2 Dossier",
        "planStart": "2026-05-11",
        "planEnd": "2026-05-22",
        "planEffort": "600 hrs"
      }
    ]
  },
  {
    "stageCode": "S6",
    "name": "Bench-to-Pilot Process Development",
    "planEffort": "3500 hrs",
    "planDuration": "50 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "Bench-scale scale-down model, mixing study, feed nozzle design and safety calorimetry",
    "planStart": "2026-05-23",
    "planEnd": "2026-07-11",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-07-11",
    "buffer": "4 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 13,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "Reaction Calorimetry (RC1) & Heat Transfer",
        "planStart": "2026-05-23",
        "planEnd": "2026-06-15",
        "planEffort": "1800 hrs"
      },
      {
        "name": "Agitation & Coagulum Prevention Model",
        "planStart": "2026-06-16",
        "planEnd": "2026-07-11",
        "planEffort": "1700 hrs"
      }
    ]
  },
  {
    "stageCode": "S7",
    "name": "Process Safety & Regulatory Studies",
    "planEffort": "3200 hrs",
    "planDuration": "45 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "HAZOP study, relief system design, GHS classification, SDS authoring and REACH data prep",
    "planStart": "2026-07-12",
    "planEnd": "2026-08-25",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-08-25",
    "buffer": "4 days",
    "gateName": "Registration & Pilot Readiness",
    "gateStatus": "Pending",
    "gateCode": "Gate 3",
    "status": true,
    "setupCount": 14,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "HAZOP & Relief Vent Sizing",
        "planStart": "2026-07-12",
        "planEnd": "2026-08-05",
        "planEffort": "1600 hrs"
      },
      {
        "name": "GHS Classification & SDS Preparation",
        "planStart": "2026-08-06",
        "planEnd": "2026-08-25",
        "planEffort": "1600 hrs"
      }
    ]
  },
  {
    "stageCode": "S8",
    "name": "Regulatory Registration Filing (REACH / TSCA)",
    "planEffort": "1500 hrs",
    "planDuration": "30 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "REACH registration dossier compilation, consortium data submission and chemical permits",
    "planStart": "2026-08-26",
    "planEnd": "2026-09-24",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-09-24",
    "buffer": "2 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 12,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "REACH Inquiry & Dossier Submission",
        "planStart": "2026-08-26",
        "planEnd": "2026-09-24",
        "planEffort": "1500 hrs"
      }
    ]
  },
  {
    "stageCode": "S9",
    "name": "Pilot Plant Campaign",
    "planEffort": "3600 hrs",
    "planDuration": "40 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "Pilot reactor 100 L trials, conversion verification and cleaning validation",
    "planStart": "2026-09-25",
    "planEnd": "2026-11-03",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-11-03",
    "buffer": "3 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 12,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "Pilot 100 L Batch Campaigns",
        "planStart": "2026-09-25",
        "planEnd": "2026-10-20",
        "planEffort": "2000 hrs"
      },
      {
        "name": "Effluent & Distillate Treatment Run",
        "planStart": "2026-10-21",
        "planEnd": "2026-11-03",
        "planEffort": "1600 hrs"
      }
    ]
  },
  {
    "stageCode": "S10",
    "name": "Demonstration-Scale Campaign",
    "planEffort": "4000 hrs",
    "planDuration": "55 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "Demo plant 1,000 L runs, customer sampling lots, CoA generation and application trials",
    "planStart": "2026-11-04",
    "planEnd": "2026-12-28",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-12-28",
    "buffer": "4 days",
    "gateName": "Demo-Scale Proof",
    "gateStatus": "Pending",
    "gateCode": "Gate 4",
    "status": true,
    "setupCount": 13,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "Demo 1,000 L Batch Runs",
        "planStart": "2026-11-04",
        "planEnd": "2026-12-05",
        "planEffort": "2400 hrs"
      },
      {
        "name": "Customer Sampling & Application Validation",
        "planStart": "2026-12-06",
        "planEnd": "2026-12-28",
        "planEffort": "1600 hrs"
      }
    ]
  },
  {
    "stageCode": "S11",
    "name": "Commercial Plant Build & Commissioning",
    "planEffort": "6500 hrs",
    "planDuration": "150 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "EPC execution, commercial reactor installation, pre-commissioning water batch, SAT",
    "planStart": "2026-12-29",
    "planEnd": "2027-05-27",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2027-05-27",
    "buffer": "10 days",
    "gateName": "Commercial Production Readiness",
    "gateStatus": "Pending",
    "gateCode": "Gate 5",
    "status": true,
    "setupCount": 14,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "Plant Modification & Reactor Sizing",
        "planStart": "2026-12-29",
        "planEnd": "2027-03-15",
        "planEffort": "3500 hrs"
      },
      {
        "name": "Water Batches & Commissioning (SAT)",
        "planStart": "2027-03-16",
        "planEnd": "2027-05-27",
        "planEffort": "3000 hrs"
      }
    ]
  },
  {
    "stageCode": "S12",
    "name": "Commercial Launch & Ramp-Up",
    "planEffort": "1300 hrs",
    "planDuration": "35 days",
    "actualEffort": "0 hrs",
    "actualDuration": "0 days",
    "percentCompletion": 0,
    "done": false,
    "description": "Commercial campaign start, post-launch yield stabilization and customer delivery",
    "planStart": "2027-05-28",
    "planEnd": "2027-07-01",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2027-07-01",
    "buffer": "4 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 12,
    "updatedDate": "-",
    "updated": "-",
    "updatedBy": "-",
    "bars": [
      {
        "name": "First Commercial Batches & Packaging",
        "planStart": "2027-05-28",
        "planEnd": "2027-06-20",
        "planEffort": "800 hrs"
      },
      {
        "name": "Production Ramp-Up & Yield Freeze",
        "planStart": "2027-06-21",
        "planEnd": "2027-07-01",
        "planEffort": "500 hrs"
      }
    ]
  }
];

  // Stage table pagination
  pagedStagesList: StageItem[] = [];
  pageSizeOptions = [5, 10, 15, 20];
  pageSize = 15;
  currentPage = 0;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Stage Modal states
  showStageModal = false;
  stageModalStep = 1;
  isEditStageMode = false;
  stageModalData: Partial<StageItem> = {};
  stageModalIndex = -1;

  private subs = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private dialog: MatDialog
  ) { }

  readonly historySequence: number[] = [4, 2, 1, 5, 4, 6, 8, 3, 2, 5, 1, 4, 7, 3, 6, 2, 5, 8, 4, 1];
  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 3, 5, 2, 4, 1];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  ngOnInit(): void {
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        if (params['projectName'] || params['name']) {
          this.projectName = params['projectName'] || params['name'];
        }
        if (params['projectCode'] || params['code']) {
          this.projectCode = params['projectCode'] || params['code'];
        }
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      })
    );

    const stageCounts: Record<string, number> = {
      'S1': 14, 'S2': 12, 'S3': 13, 'S4': 14, 'S5': 11, 'S6': 13,
      'S7': 14, 'S8': 11, 'S9': 12, 'S10': 13, 'S11': 14, 'S12': 12
    };
    this.stages.forEach((s, idx) => {
      if (stageCounts[s.stageCode]) {
        s.setupCount = stageCounts[s.stageCode];
      }
      s.historyCount = this.historySequence[idx % this.historySequence.length];
      s.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (!s.updatedDate) {
        s.updatedDate = '2026-02-15';
      }
      if (!s.updated) {
        s.updated = s.updatedDate;
      }
      const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
      if (!s.updatedBy) {
        s.updatedBy = defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagedStages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/CHM/006", name: this.projectName || "Acrylic Emulsion Binder 50% Solids" }
    });
  }

  // --- Scrolling logic ---
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

  setView(view: 'grid' | 'gantt') {
    this.activeView = view;
  }

  setGanttScale(scale: 'monthly' | 'weekly' | 'daily') {
    this.ganttScale = scale;
  }

  // --- Gantt View Data Getters ---
  get ganttMonths(): { name: string; fullYear: number; monthIndex: number }[] {
    return [
      { name: 'Jan', fullYear: 2026, monthIndex: 0 },
      { name: 'Feb', fullYear: 2026, monthIndex: 1 },
      { name: 'Mar', fullYear: 2026, monthIndex: 2 },
      { name: 'Apr', fullYear: 2026, monthIndex: 3 },
      { name: 'May', fullYear: 2026, monthIndex: 4 },
      { name: 'Jun', fullYear: 2026, monthIndex: 5 },
      { name: 'Jul', fullYear: 2026, monthIndex: 6 },
      { name: 'Aug', fullYear: 2026, monthIndex: 7 },
      { name: 'Sep', fullYear: 2026, monthIndex: 8 },
      { name: 'Oct', fullYear: 2026, monthIndex: 9 },
      { name: 'Nov', fullYear: 2026, monthIndex: 10 },
      { name: 'Dec', fullYear: 2026, monthIndex: 11 }
    ];
  }

  get ganttWeeks(): { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] {
    const weeks: { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] = [];
    const months = this.ganttMonths;
    months.forEach(m => {
      ['W1', 'W2', 'W3', 'W4'].forEach((wLabel, wIdx) => {
        weeks.push({ label: wLabel, monthName: m.name, monthIndex: m.monthIndex, weekInMonth: wIdx + 1 });
      });
    });
    return weeks;
  }

  get ganttDays(): Date[] {
    if (this.stages.length === 0) return [];
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const s of this.stages) {
      const bars = this.getStageBars(s);
      for (const bar of bars) {
        if (!bar.planStart || !bar.planEnd) continue;
        const start = new Date(bar.planStart);
        const finish = new Date(bar.planEnd);
        if (isNaN(start.getTime()) || isNaN(finish.getTime())) continue;

        if (!minDate || start < minDate) minDate = start;
        if (!maxDate || finish > maxDate) maxDate = finish;
      }
    }

    if (!minDate || !maxDate) return [];

    const days: Date[] = [];
    let current = new Date(minDate);
    let count = 0;
    while (current <= maxDate && count < 120) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      count++;
    }
    return days;
  }

  private getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  getStageBars(s: StageItem): GanttBar[] {
    if (s.bars && s.bars.length > 0) return s.bars;
    return [{ name: s.name, planStart: s.planStart, planEnd: s.planEnd, planEffort: s.planEffort }];
  }

  getGanttBarStyle(s: { planStart?: string; planEnd?: string }, index: number = 0): any {
    if (!s || !s.planStart || !s.planEnd) return { display: 'none' };

    const start = new Date(s.planStart);
    const finish = new Date(s.planEnd);
    if (isNaN(start.getTime()) || isNaN(finish.getTime())) return { display: 'none' };

    let styleObj: any = {};

    if (this.ganttScale === 'monthly') {
      const totalMonths = 12;
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startVal = startM + (startD - 1) / startDaysTotal;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishVal = finishM + finishD / finishDaysTotal;

      const leftPercent = (startVal / totalMonths) * 100;
      const widthPercent = Math.max(0.5, ((finishVal - startVal) / totalMonths) * 100);

      styleObj = { left: `${leftPercent.toFixed(2)}%`, width: `${widthPercent.toFixed(2)}%` };
    } else if (this.ganttScale === 'weekly') {
      const totalWeeks = 48; // 12 months * 4 weeks
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startWeekVal = startM * 4 + ((startD - 1) / startDaysTotal) * 4;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishWeekVal = finishM * 4 + (finishD / finishDaysTotal) * 4;

      const leftPercent = (startWeekVal / totalWeeks) * 100;
      const widthPercent = Math.max(0.5, ((finishWeekVal - startWeekVal) / totalWeeks) * 100);

      styleObj = { left: `${leftPercent.toFixed(2)}%`, width: `${widthPercent.toFixed(2)}%` };
    } else { // daily
      const days = this.ganttDays;
      const totalDays = days.length;
      if (totalDays === 0) return { display: 'none' };

      const startStripped = this.stripTime(start);
      const finishStripped = this.stripTime(finish);

      let startIndex = -1;
      for (let i = 0; i < days.length; i++) {
        if (this.stripTime(days[i]).getTime() === startStripped.getTime()) {
          startIndex = i;
          break;
        }
      }

      if (startIndex === -1) {
        if (startStripped < this.stripTime(days[0])) {
          startIndex = 0;
        } else {
          return { display: 'none' };
        }
      }

      let spanDays = Math.round((finishStripped.getTime() - startStripped.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (spanDays <= 0) spanDays = 1;
      if (startIndex + spanDays > totalDays) spanDays = totalDays - startIndex;

      const leftPercent = (startIndex / totalDays) * 100;
      const widthPercent = (spanDays / totalDays) * 100;

      styleObj = { left: `${leftPercent.toFixed(2)}%`, width: `${widthPercent.toFixed(2)}%` };
    }

    if (index > 0) {
      styleObj.top = `${6 + (index % 3) * 12}px`;
      styleObj.height = '26px';
      styleObj.zIndex = `${index + 1}`;
      styleObj.opacity = '0.94';
      styleObj.boxShadow = '-2px 2px 6px rgba(0,0,0,0.12)';
    }

    return styleObj;
  }

  getStageGanttClass(stageName: string): string {
    const name = stageName.toLowerCase();
    if (name.includes('feasibility') || name.includes('concept') || name.includes('requirement')) return 'gantt-bar-feasibility';
    if (name.includes('design') || name.includes('architecture') || name.includes('specification')) return 'gantt-bar-design';
    if (name.includes('development') || name.includes('implementation') || name.includes('core')) return 'gantt-bar-development';
    if (name.includes('testing') || name.includes('qa') || name.includes('uat') || name.includes('audit')) return 'gantt-bar-testing';
    if (name.includes('deployment') || name.includes('release') || name.includes('prototype') || name.includes('tooling')) return 'gantt-bar-deployment';
    return 'gantt-bar-default';
  }

  stripTime(d: Date): Date {
    if (!d || isNaN(d.getTime())) return new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // --- Pagination ---
  updatePagedStages() {
    const start = this.currentPage * this.pageSize;
    this.pagedStagesList = this.stages.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedStages();
  }

  get pagedStages(): StageItem[] {
    return this.pagedStagesList;
  }

  private setBodyScrollLock(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  // --- CRUD Logic (Grid & Modals) ---
  Confirmation(item: any): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to Change the Status ?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = item.status !== undefined ? !item.status : false;
        const now = new Date().toISOString().split('T')[0];
        item.updatedDate = now;
        item.updated = now;
        item.updatedBy = 'Dr. Sarah Jenkins';
      }
    });
  }

  calculateSlack(item: StageItem): void {
    const stageName = item.name || item.stageCode || 'this stage';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Calculate Slack Confirmation',
        content: `Are you sure you want to re-calculate slack for all activities of this stage?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Confirmed slack calculation
      }
    });
  }

  deleteStage(item: StageItem): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Confirmation', content: 'Are you sure you want to delete this record?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stages = this.stages.filter(s => s !== item);
        const pageCount = Math.max(1, Math.ceil(this.stages.length / this.pageSize));
        if (this.currentPage >= pageCount) this.currentPage = Math.max(0, pageCount - 1);
        this.updatePagedStages();
      }
    });
  }

  onStageNameChange(selectedName: string) {
    if (!selectedName) return;
    const index = this.stageOptions.indexOf(selectedName);
    if (index !== -1) {
      this.stageModalData.stageCode = 'Stage-' + (index + 1);
    }
  }

  openAddStage() {
    this.stageModalStep = 1;
    this.stageModalData = {
      stageCode: 'Stage-' + (this.stages.length + 1), name: '', planEffort: '', planDuration: '', percentCompletion: 0, done: false, description: '', planStart: '', planEnd: '', actualStart: '', actualEnd: '', eta: '', buffer: '', gateName: '', gateStatus: 'Pending', gateCode: '', status: true, setupCount: 0,
      updatedDate: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      updatedBy: 'Dr. Sarah Jenkins'
    };
    this.isEditStageMode = false;
    this.showStageModal = true;
    this.setBodyScrollLock(true);
  }

  openEditStage(item: StageItem, index: number) {
    const actualIndex = this.stages.findIndex(s => s === item);
    const targetIndex = actualIndex >= 0 ? actualIndex : index;

    const dialogRef = this.dialog.open(EditProjectStagesComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: { ...item }
    });

    dialogRef.afterClosed().subscribe((result: StageItem | undefined) => {
      if (result) {
        const now = new Date().toISOString().split('T')[0];
        result.updatedDate = now;
        result.updated = now;
        if (!result.updatedBy) {
          result.updatedBy = 'Dr. Sarah Jenkins';
        }

        if (targetIndex > -1 && targetIndex < this.stages.length) {
          this.stages[targetIndex] = { ...this.stages[targetIndex], ...result };
        } else {
          const matchIdx = this.stages.findIndex(s => s.stageCode === result.stageCode);
          if (matchIdx > -1) {
            this.stages[matchIdx] = { ...this.stages[matchIdx], ...result };
          }
        }
        this.updatePagedStages();
      }
    });
  }

  closeStageModal() {
    this.showStageModal = false;
    this.setBodyScrollLock(false);
  }

  saveStage() {
    if (!this.stageModalData.name || !this.stageModalData.stageCode) return;
    const now = new Date().toISOString().split('T')[0];
    this.stageModalData.updatedDate = now;
    this.stageModalData.updated = now;
    if (!this.stageModalData.updatedBy) {
      this.stageModalData.updatedBy = 'Dr. Sarah Jenkins';
    }
    if (this.isEditStageMode && this.stageModalIndex > -1) {
      this.stages[this.stageModalIndex] = { ...this.stages[this.stageModalIndex], ...this.stageModalData } as StageItem;
    } else {
      this.stages.push(this.stageModalData as StageItem);
    }
    this.updatePagedStages();
    this.closeStageModal();
  }

  getSliderColor(percent: number): string {
    if (percent === 100) return '#008000';
    if (!percent || percent === 0) return '#ff0000';
    if (percent <= 30) return '#ff0000';
    if (percent <= 80) return '#ffb300';
    return '#008000';
  }

  onDoneChange(s: StageItem, checked: boolean): void {
    s.done = checked;
    s.percentCompletion = checked ? 100 : 0;
    const now = new Date().toISOString().split('T')[0];
    s.updatedDate = now;
    s.updated = now;
    s.updatedBy = 'Dr. Sarah Jenkins';
  }

  openTimelineModal(item: any) {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openSetup(item: StageItem) {
    this.router.navigate(['stages/wbs'], {
      relativeTo: this.route.parent,
      queryParams: {
        stageCode: item.stageCode,
        stageName: item.name
      },
      queryParamsHandling: 'merge'
    });
  }

  openHistory(stage?: any): void {
    const stageCode = (typeof stage === 'object' && stage !== null) ? stage.stageCode : '';
    const stageName = (typeof stage === 'object' && stage !== null) ? stage.name : (typeof stage === 'string' ? stage : 'Stage');

    this.router.navigate(['stages/history'], {
      relativeTo: this.route.parent,
      queryParams: {
        stageCode: stageCode,
        stageName: stageName
      },
      queryParamsHandling: 'merge'
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}