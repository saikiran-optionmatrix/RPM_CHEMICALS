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
    MatDialogModule
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
  "S1 - Opportunity Identification",
  "S2 - Concept Screening & Feasibility",
  "S3 - Route Scouting & Lab Synthesis",
  "S4 - Process Optimization (Lab Scale)",
  "S5 - Process Route Selection & Basis of Design",
  "S6 - Bench-to-Pilot Process Development",
  "S7 - Process Safety & Regulatory Studies",
  "S8 - Regulatory Registration Filing (REACH / TSCA)",
  "S9 - Pilot Plant Campaign",
  "S10 - Demonstration-Scale Campaign",
  "S11 - Commercial Plant Build & Commissioning",
  "S12 - Commercial Launch & Ramp-Up"
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
    "description": "Identify and prioritize product and market opportunities from customer demand, competitor gaps and technology trends.",
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
    "setupCount": 8,
    "updated": "20 Feb 2026",
    "updatedDate": "20 Feb 2026",
    "updatedBy": "Ananya Rao",
    "historyCount": 4,
    "documentsCount": 4
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
    "description": "Assess technical, economic and regulatory feasibility of candidate chemistries and products.",
    "planStart": "2026-01-16",
    "planEnd": "2026-01-26",
    "actualStart": "2026-01-16",
    "actualEnd": "2026-01-26",
    "eta": "2026-01-26",
    "buffer": "2 days",
    "gateName": "Business case and project charter approval (Gate 1)",
    "gateStatus": "Approved",
    "gateCode": "Gate 1",
    "status": true,
    "setupCount": 12,
    "updated": "12 Mar 2026",
    "updatedDate": "12 Mar 2026",
    "updatedBy": "Rajesh Kumar",
    "historyCount": 2,
    "documentsCount": 3
  },
  {
    "stageCode": "S3",
    "name": "Route Scouting & Lab Synthesis",
    "planEffort": "1,500 hrs",
    "planDuration": "30 days",
    "actualEffort": "1,500 hrs",
    "actualDuration": "30 days",
    "percentCompletion": 100,
    "done": true,
    "description": "Screen synthesis routes, catalysts and raw materials and prove the chemistry at laboratory scale.",
    "planStart": "2026-01-27",
    "planEnd": "2026-02-28",
    "actualStart": "2026-01-27",
    "actualEnd": "2026-02-28",
    "eta": "2026-02-28",
    "buffer": "3 days",
    "gateName": "-",
    "gateStatus": "Approved",
    "gateCode": "-",
    "status": true,
    "setupCount": 17,
    "updated": "28 Apr 2026",
    "updatedDate": "28 Apr 2026",
    "updatedBy": "Anita Desai",
    "historyCount": 1,
    "documentsCount": 2
  },
  {
    "stageCode": "S4",
    "name": "Process Optimization (Lab Scale)",
    "planEffort": "3,000 hrs",
    "planDuration": "60 days",
    "actualEffort": "1,740 hrs",
    "actualDuration": "35 days",
    "percentCompletion": 58,
    "done": false,
    "description": "Improve yield, selectivity, impurity profile and process robustness at bench scale.",
    "planStart": "2026-03-01",
    "planEnd": "2026-05-15",
    "actualStart": "2026-03-01",
    "actualEnd": "",
    "eta": "2026-05-30",
    "buffer": "5 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 26,
    "updated": "05 Oct 2026",
    "updatedDate": "05 Oct 2026",
    "updatedBy": "Priya Reddy",
    "historyCount": 5,
    "documentsCount": 4
  },
  {
    "stageCode": "S5",
    "name": "Process Route Selection & Basis of Design",
    "planEffort": "1,200 hrs",
    "planDuration": "25 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Select the commercial route and define the basis of design, cost of manufacturing and risks.",
    "planStart": "2026-05-16",
    "planEnd": "2026-06-15",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-06-15",
    "buffer": "2 days",
    "gateName": "Process route selection and basis of design approval (Gate 2)",
    "gateStatus": "Pending",
    "gateCode": "Gate 2",
    "status": true,
    "setupCount": 14,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S6",
    "name": "Bench-to-Pilot Process Development",
    "planEffort": "3,500 hrs",
    "planDuration": "50 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Develop and scale the reaction, separation and purification steps for the pilot plant.",
    "planStart": "2026-06-16",
    "planEnd": "2026-08-10",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-08-10",
    "buffer": "4 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 22,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S7",
    "name": "Process Safety & Regulatory Studies",
    "planEffort": "3,200 hrs",
    "planDuration": "45 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Run hazard studies (HAZOP, calorimetry), toxicology and environmental studies needed to support registration.",
    "planStart": "2026-08-11",
    "planEnd": "2026-09-30",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-09-30",
    "buffer": "4 days",
    "gateName": "Registration and pilot plant readiness approval (Gate 3)",
    "gateStatus": "Pending",
    "gateCode": "Gate 3",
    "status": true,
    "setupCount": 19,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S8",
    "name": "Regulatory Registration Filing (REACH / TSCA)",
    "planEffort": "1,500 hrs",
    "planDuration": "30 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Compile and submit chemical registration dossiers and respond to authority queries.",
    "planStart": "2026-10-01",
    "planEnd": "2026-11-05",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-11-05",
    "buffer": "2 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 18,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S9",
    "name": "Pilot Plant Campaign",
    "planEffort": "3,600 hrs",
    "planDuration": "40 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Produce pilot batches to confirm process performance and generate customer samples.",
    "planStart": "2026-11-06",
    "planEnd": "2026-12-20",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-12-20",
    "buffer": "3 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 11,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S10",
    "name": "Demonstration-Scale Campaign",
    "planEffort": "4,000 hrs",
    "planDuration": "55 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Run larger campaigns to prove scale-up, equipment fit and product quality with customers.",
    "planStart": "2026-12-21",
    "planEnd": "2027-02-20",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2027-02-20",
    "buffer": "4 days",
    "gateName": "Demo-scale proof and commercial plant design approval (Gate 4)",
    "gateStatus": "Pending",
    "gateCode": "Gate 4",
    "status": true,
    "setupCount": 24,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S11",
    "name": "Commercial Plant Build & Commissioning",
    "planEffort": "6,500 hrs",
    "planDuration": "150 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Engineer, build, commission and qualify the commercial plant or line.",
    "planStart": "2027-02-21",
    "planEnd": "2027-06-30",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2027-06-30",
    "buffer": "10 days",
    "gateName": "Commercial production readiness approval (Gate 5)",
    "gateStatus": "Pending",
    "gateCode": "Gate 5",
    "status": true,
    "setupCount": 31,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
  },
  {
    "stageCode": "S12",
    "name": "Commercial Launch & Ramp-Up",
    "planEffort": "1,300 hrs",
    "planDuration": "35 days",
    "actualEffort": "",
    "actualDuration": "",
    "percentCompletion": 0,
    "done": false,
    "description": "Start commercial production, ramp up volumes and hand over to operations.",
    "planStart": "2027-07-01",
    "planEnd": "2027-07-31",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2027-07-31",
    "buffer": "4 days",
    "gateName": "-",
    "gateStatus": "Pending",
    "gateCode": "-",
    "status": true,
    "setupCount": 15,
    "updated": "-",
    "updatedDate": "-",
    "updatedBy": "-",
    "historyCount": 0,
    "documentsCount": 0
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

    this.stages.forEach((s, idx) => {
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
      queryParams: { code: this.projectCode || "2026/GEN/001", name: this.projectName || "Generic Tablet Development" }
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
    this.stageModalStep = 2; // Default to Timeline tab on edit
    this.stageModalData = { ...item };
    this.isEditStageMode = true;
    this.stageModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showStageModal = true;
    this.setBodyScrollLock(true);
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