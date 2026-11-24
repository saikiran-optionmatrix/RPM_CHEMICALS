import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddProjActivityComponent } from '../../projects/project-dashboard/project-activities/add-proj-activity/add-proj-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AcceptancePopComponent } from '../../../common/shared/acceptance-pop/acceptance-pop.component';
import { StagesPredecessorComponent } from '../../stages/stages-wbs/stages-predecessor/stages-predecessor.component';
import { DocumentsPopComponent } from '../../../common/shared/documents-pop/documents-pop.component';
 

export interface ActivityTask {
  isBacklog?: boolean;
  id?: string | number;
  slNo?: string;
  activityCode?: string;
  taskCode?: string;
  jobCode?: string;
  IsActive?: boolean;
  Approved?: boolean;
  approved?: boolean;
  Done?: boolean;
  done?: boolean;
  fullKit?: boolean;
  Acceptance?: string;
  acceptance?: string;
  predecessor?: string | number;
  predecessors?: string | number;
  predecessorsData?: any[];
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;
  stage?: string;
  PercentCompletion: number;
  Deliverable?: string;
  Module?: string;
  TaskName: string;
  TaskType: string;
  Responsibility: string;
  Duration: string;
  Effort: string;
  Description: string;
  PlanStart: string;
  planStart?: string;
  PlanEnd: string;
  planEnd?: string;
  ActualStart: string;
  actualStart?: string;
  ActualEnd: string;
  actualEnd?: string;
  ETA: string;
  eta?: string;
  earlyStart?: string;
  EarlyStart?: string;
  earlyEnd?: string;
  EarlyEnd?: string;
  lateStart?: string;
  LateStart?: string;
  lateEnd?: string;
  LateEnd?: string;
  planEffort?: string;
  PlanEffort?: string;
  actualEffort?: string;
  ActualEffort?: string;
  planHours?: string;
  PlanHours?: string;
  actualHours?: string;
  ActualHours?: string;
  Status: string;
  Priority: string;
  Complexity: string;
  Template: string;
  Tasks?: string | number;
  Requirements?: string | number;
  tasks?: string | number;
  requirements?: string | number;
  activities?: string;
  delayReason?: string;
  tasksData?: any[];
  requirementsData?: any[];
  department?: string;
  Department?: string;
  slack?: string;
  section?: string;
  Section?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface CalendarDayItem {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  count: number;
  isBacklog: boolean;
}

export interface CalendarCard {
  hour: string;
  user: string;
  dayPlacement: number;
  taskName: string;
  projectName: string;
  status: string;
  planStart: string;
  color: string;
  borderColor?: string;
  pInitials: string;
}

@Component({
  selector: 'app-monitor-activities',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule
  ],
  templateUrl: './monitor-activities.component.html',
  styleUrls: ['./monitor-activities.component.scss']
})
export class MonitorActivitiesComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View & Toggle States
  showFilter: boolean = false;
  activeView: 'calendar' | 'weekly' | 'table' = 'calendar';

  get isCalendarView(): boolean {
    return this.activeView === 'weekly';
  }
  set isCalendarView(val: boolean) {
    this.activeView = val ? 'weekly' : 'table';
  }

  // Calendar View State & Data (hours-scheduling style)
  readonly monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  readonly dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentCalendarDate: Date = new Date(2026, 9, 1); // October 2026
  selectedCalendarDate: Date | null = null;
  selectedCalendarWeek: string = 'week1';
  readonly weekOptions = [
    { value: 'week1', label: 'Week 1 (01 Oct - 07 Oct)' },
    { value: 'week2', label: 'Week 2 (08 Oct - 14 Oct)' },
    { value: 'week3', label: 'Week 3 (15 Oct - 21 Oct)' },
    { value: 'week4', label: 'Week 4 (22 Oct - 28 Oct)' },
    { value: 'week5', label: 'Week 5 (29 Oct - 31 Oct)' }
  ];

  get selectedWeekLabel(): string {
    const found = this.weekOptions.find(w => w.value === this.selectedCalendarWeek);
    return found ? found.label : 'Select Week';
  }

  selectWeek(value: string): void {
    this.selectedCalendarWeek = value;
    this.generateCalendarData();
  }
  calendarDays: CalendarDayItem[] = [];

  readonly todayReference: Date = new Date(2026, 9, 10); // Reference today: October 10, 2026

  calendarFilteredActivities: ActivityTask[] = [];
  calendarPaginatedActivities: ActivityTask[] = [];
  calendarPageIndex: number = 0;
  calendarPageSize: number = 10;

  @ViewChild('calendarTableContainer') calendarTableContainer!: ElementRef<HTMLDivElement>;
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  isOverdueOnly: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5]; // Default: Mon-Fri

  // Modal States
  showTimelineModal: boolean = false;
  selectedTimelineTask: ActivityTask | null = null;

  // Data Arrays
  rawProjects: ActivityTask[] = [];
  allProjects: ActivityTask[] = [];
  calendarCards: CalendarCard[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  // Permissions
  readonly canUpdate: boolean = true;
  readonly canDelete: boolean = true;

  // Clock
  currentTime: string = '';
  private timeInterval: any;

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectName: [null],
    DateType: [null],
    FromDate: [null],
    ToDate: [null],
    Status: [null],
    Priority: [null],
    Complexity: [null],
    ActiveOnly: [false]
  });

  // Master Lists
  readonly hoursList: string[] = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
  ];

  readonly historySequence: number[] = [3, 5, 3, 2, 1, 6, 8, 3, 5, 2, 4, 7, 3, 6, 1, 5, 8, 2, 4, 3];
  readonly documentsSequence: number[] = [4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 2, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  isFullKit(item: ActivityTask): boolean {
    const acc = String(item.acceptance || item.Acceptance || '').trim();
    if (acc === '5/5') {
      return true;
    }
    return this.checkFullKit(item.Requirements ?? item.requirements ?? item.activities);
  }

  checkFullKit(requirementsVal: any): boolean {
    const req = String(requirementsVal || '').trim();
    if (req.includes('/')) {
      const [numStr, denStr] = req.split('/');
      const num = parseInt(numStr.trim(), 10);
      const den = parseInt(denStr.trim(), 10);
      return !isNaN(num) && !isNaN(den) && den > 0 && num === den;
    }
    return false;
  }

  ngOnInit(): void {
    this.getAllProjects();
    this.buildCalendarDays();
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) ||
      this.calendarDays.find(d => d.inCurrentMonth);
    if (defaultDay) {
      this.selectCalendarDate(defaultDay);
    }
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);

    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.overdueSub?.unsubscribe();
  }

  getAllProjects(): void {
    const mockData = [
      {
            "IsActive": true,
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "ProjectCode": "2026/CHM/001",
            "Stage": "S1 - Opportunity Identification",
            "Module": "Market and application analysis",
            "PercentCompletion": 100,
            "TaskName": "Application and market literature review",
            "TaskType": "Chemical Development",
            "Responsibility": "Dr. Priya Raman",
            "delayReason": "",
            "isDateExceeded": false
      },
      {
            "IsActive": true,
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "ProjectCode": "2026/CHM/001",
            "Stage": "S1 - Opportunity Identification",
            "Module": "Project economics and risk screening",
            "PercentCompletion": 40,
            "TaskName": "Chemistry feasibility and hazard screening",
            "TaskType": "Chemical Development",
            "Responsibility": "Rajesh Kumar",
            "delayReason": "Calorimetry Data Generation Delay",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "ProjectCode": "2026/CHM/001",
            "Stage": "S3 - Route Scouting & Lab Synthesis",
            "Module": "Raw material and screening setup",
            "PercentCompletion": 75,
            "TaskName": "Polyol and isocyanate screening study",
            "TaskType": "Chemical Development",
            "Responsibility": "Anita Desai",
            "delayReason": "Raw Material Sample Qualification Delay",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "ProjectCode": "2026/CHM/002",
            "Stage": "S2 - Concept Screening & Feasibility",
            "Module": "Feasibility plan and success criteria",
            "PercentCompletion": 100,
            "TaskName": "Catalyst performance targets and success criteria",
            "TaskType": "Chemical Development",
            "Responsibility": "Priya Reddy",
            "delayReason": "",
            "isDateExceeded": false
      },
      {
            "IsActive": true,
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "ProjectCode": "2026/CHM/002",
            "Stage": "S2 - Concept Screening & Feasibility",
            "Module": "Regulatory and intellectual property strategy",
            "PercentCompletion": 75,
            "TaskName": "Regulatory pathway and registration strategy outline",
            "TaskType": "Chemical Development",
            "Responsibility": "Suresh Naidu",
            "delayReason": "Regulatory Consultant Meeting Slot Unavailable",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "ProjectCode": "2026/CHM/002",
            "Stage": "S3 - Route Scouting & Lab Synthesis",
            "Module": "Catalyst screening campaign",
            "PercentCompletion": 40,
            "TaskName": "Primary catalyst screening campaign",
            "TaskType": "Chemical Development",
            "Responsibility": "Amit Patel",
            "delayReason": "Catalyst Vendor Dispatch Delay",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Agrochemical Active Ingredient Synthesis Development",
            "ProjectCode": "2026/CHM/003",
            "Stage": "S3 - Route Scouting & Lab Synthesis",
            "Module": "Reaction confirmation and triage",
            "PercentCompletion": 100,
            "TaskName": "Reaction step confirmation and yield testing",
            "TaskType": "Chemical Development",
            "Responsibility": "Dr. Priya Raman",
            "delayReason": "Reagent Vendor Dispatch Delay",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Agrochemical Active Ingredient Synthesis Development",
            "ProjectCode": "2026/CHM/003",
            "Stage": "S3 - Route Scouting & Lab Synthesis",
            "Module": "Intermediate characterization",
            "PercentCompletion": 40,
            "TaskName": "Intermediate characterization and impurity mapping",
            "TaskType": "Chemical Development",
            "Responsibility": "Rajesh Kumar",
            "delayReason": "Impurity Method Reproducibility Verification",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "ProjectCode": "2026/CHM/004",
            "Stage": "S2 - Concept Screening & Feasibility",
            "Module": "Technology and equipment strategy",
            "PercentCompletion": 75,
            "TaskName": "Separation technology and equipment selection",
            "TaskType": "Chemical Development",
            "Responsibility": "Anita Desai",
            "delayReason": "",
            "isDateExceeded": false
      },
      {
            "IsActive": true,
            "ProjectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "ProjectCode": "2026/CHM/004",
            "Stage": "S4 - Process Optimization (Lab Scale)",
            "Module": "Distillation optimization campaign",
            "PercentCompletion": 100,
            "TaskName": "Fractional distillation column design study",
            "TaskType": "Chemical Development",
            "Responsibility": "Priya Reddy",
            "delayReason": "Packing Vendor Lead-Time Delay",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "ProjectCode": "2026/CHM/005",
            "Stage": "S2 - Concept Screening & Feasibility",
            "Module": "Compatibility screening",
            "PercentCompletion": 75,
            "TaskName": "Binder and dispersant compatibility screening",
            "TaskType": "Chemical Development",
            "Responsibility": "Amit Patel",
            "delayReason": "Dispersant Supply Delay",
            "isDateExceeded": true
      },
      {
            "IsActive": true,
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "ProjectCode": "2026/CHM/005",
            "Stage": "S2 - Concept Screening & Feasibility",
            "Module": "Performance testing",
            "PercentCompletion": 40,
            "TaskName": "Granule disintegration and suspensibility testing",
            "TaskType": "Chemical Development",
            "Responsibility": "Suresh Naidu",
            "delayReason": "Pilot Lab Slot Availability",
            "isDateExceeded": true
      }
];

    const defaultDepartments = [
      'R&D', 'RA', 'Finance', 'Commercial', 'Finance',
      'Commercial', 'Finance', 'Governance', 'ARD', 'RA'
    ];
    const defaultSections = [
      'Formulation Development', 'Regulatory Affairs', 'Costing & Budgeting',
      'Market Research', 'Financial Modeling', 'Market Research',
      'Financial Modeling', 'Steering Committee', 'Analytical Development', 'Regulatory Affairs'
    ];
    const defaultSlacks = ['15 days', '14 days', '5 days', '—', '10 days', '7 days', '3 days', '—', '12 days', '8 days'];
    const defaultDates = ['2026-01-10', '2026-01-11', '2026-01-12', '2026-01-13', '2026-01-14'];
    const defaultUpdaters = ['Olivia Brown', "Grace O'Connor", 'Aarav Shah', 'Diego Ruiz'];

    this.rawProjects = mockData.map((item, idx) => {
      const dayNum = ((idx * 3) % 28) + 1;
      const planEndDay = String(dayNum).padStart(2, '0');
      const planStartDay = String(Math.max(1, dayNum - 3)).padStart(2, '0');
      const itemIsBacklog = dayNum < 10;
      const isDone = item.PercentCompletion === 100;
      const isApproved = idx % 2 === 0;
      const acc = idx % 3 === 0 ? '5/5' : (idx % 3 === 1 ? '3/5' : '1/5');
      const isFull = acc === '5/5';
      const tasksVal = idx % 2 === 0 ? '5/5' : '3/5';
      const reqVal = acc;

      return {
        ...item,
        id: idx + 1,
        IsActive: item.IsActive ?? true,
        ProjectName: item.ProjectName,
        ProjectCode: item.ProjectCode,
        TaskName: item.TaskName,
        jobCode: `BC0${idx + 1}`,
        activityCode: `ACT-${String(idx + 1).padStart(3, '0')}`,
        department: defaultDepartments[idx % defaultDepartments.length],
        slack: defaultSlacks[idx % defaultSlacks.length],
        section: defaultSections[idx % defaultSections.length],
        Done: isDone,
        done: isDone,
        Approved: isApproved,
        approved: isApproved,
        fullKit: isFull,
        Acceptance: acc,
        acceptance: acc,
        Tasks: tasksVal,
        tasks: tasksVal,
        Requirements: reqVal,
        requirements: reqVal,
        Deliverable: item.Module || 'Module1',
        Stage: item.Stage || 'S1',
        stage: item.Stage || 'S1',
        predecessors: String((idx % 3) + 1),
        predecessor: String((idx % 3) + 1),
        delayReason: item.delayReason || this.delayReasonOptions[idx % this.delayReasonOptions.length],
        historyCount: this.getHistoryCount(idx),
        documentsCount: this.getDocumentsCount(idx),
        PlanStart: `2026-10-${planStartDay}`,
        PlanEnd: `2026-10-${planEndDay}`,
        ETA: `2026-10-${planEndDay}`,
        isBacklog: itemIsBacklog,
        updatedDate: defaultDates[idx % defaultDates.length],
        updatedBy: item.Responsibility || defaultUpdaters[idx % defaultUpdaters.length],
      } as unknown as ActivityTask;
    });
    this.applyFilter();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  updateTime(): void {
    const now = new Date();
    const formattedHours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.currentTime = `${formattedHours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  }

  // --- Filtering & Pagination ---

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onClear(): void {
    this.filterForm.reset();
    this.excludeCompleted = false;
    this.isOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  onExcludeCompletedChange(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onOverdueChange(): void {
    this.currentPage = 0;
    this.monitorStateService.setOverdue(this.isOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.isOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilter();
    this.cdr.markForCheck();
  }

  applyFilter(): void {
    let filtered = [...this.rawProjects];

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100 && !!p.PlanEnd && p.PlanEnd < today);
    }

    // Add additional logic here to filter using this.filterForm.value

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.allProjects = filtered.slice(start, start + this.pageSize);
    this.generateCalendarData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  isDateExceeded(item: ActivityTask): boolean {
    if (item.Status === 'Completed' || item.PercentCompletion === 100) {
      return false;
    }
    if (!item.PlanEnd) {
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    return item.PlanEnd < today;
  }

  // --- View Toggles ---

  isBacklogActivity(item: ActivityTask): boolean {
    if (item.isBacklog !== undefined) {
      return !!item.isBacklog;
    }
    const dateStr = item.PlanEnd || item.PlanStart;
    if (!dateStr) return false;
    if (dateStr.includes('2026-10-')) {
      const parts = dateStr.split('-');
      const day = parseInt(parts[2], 10);
      return !isNaN(day) && day < 10;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      if (d.getFullYear() === 2026 && d.getMonth() === 9) {
        return d.getDate() < 10;
      }
      const ref = new Date(2026, 9, 10);
      ref.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < ref.getTime();
    }
    return false;
  }

    setActiveView(view: 'calendar' | 'weekly' | 'table'): void {
    this.activeView = view;
    if (view === 'calendar') {
      this.buildCalendarDays();
      if (!this.selectedCalendarDate) {
        const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) ||
          this.calendarDays.find(d => d.inCurrentMonth);
        if (defaultDay) {
          this.selectCalendarDate(defaultDay);
        }
      } else {
        this.updateCalendarTableData();
      }
    } else if (view === 'weekly') {
      this.generateCalendarData();
    }
  }

  showCalendarView(): void { this.setActiveView('calendar'); }
  showWeeklyView(): void { this.setActiveView('weekly'); }
  showGridView(): void { this.setActiveView('table'); }

  // --- Calendar View Methods (hours-scheduling style) ---
  get currentCalendarMonthLabel(): string {
    return `${this.monthNames[this.currentCalendarDate.getMonth()]} ${this.currentCalendarDate.getFullYear()}`;
  }

  get totalActivitiesInMonth(): number {
    return this.calendarDays
      .filter(d => d.inCurrentMonth)
      .reduce((sum, d) => sum + d.count, 0);
  }

  prevCalendarMonth(): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() - 1,
      1
    );
    this.buildCalendarDays();
    this.clearCalendarDateSelection();
  }

  nextCalendarMonth(): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() + 1,
      1
    );
    this.buildCalendarDays();
    this.clearCalendarDateSelection();
  }

  buildCalendarDays(): void {
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const days: CalendarDayItem[] = [];

    const todayRef = new Date(this.todayReference);
    todayRef.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      cellDate.setHours(0, 0, 0, 0);
      const inCurrentMonth = cellDate.getMonth() === month;
      const isToday = this.isSameDay(cellDate, todayRef);
      const isBacklog = cellDate.getTime() < todayRef.getTime();
      const count = inCurrentMonth ? this.getActivityCountForDate(cellDate) : 0;

      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday,
        isSelected: this.selectedCalendarDate ? this.isSameDay(cellDate, this.selectedCalendarDate) : false,
        count,
        isBacklog
      });
    }

    this.calendarDays = days;
  }

  getActivityCountForDate(date: Date): number {
    const d = date.getDate();
    const m = date.getMonth();
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ((d * 2 + m * 3) % 3) + 1;
    }
    const variations = [4, 6, 3, 7, 5, 8, 4, 6, 5, 7, 3, 6, 8, 5, 4, 7, 6, 3, 8, 5, 4, 6, 7, 3, 5, 8, 4, 6, 5, 7, 4];
    return variations[(d - 1) % variations.length];
  }

  isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  isBacklogDate(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ref = new Date(this.todayReference);
    ref.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < ref.getTime();
  }

  selectCalendarDate(day: CalendarDayItem): void {
    if (!day.inCurrentMonth) return;
    if (this.selectedCalendarDate && this.isSameDay(this.selectedCalendarDate, day.date)) {
      this.clearCalendarDateSelection();
      return;
    }
    this.selectedCalendarDate = day.date;
    for (const d of this.calendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }
    this.calendarPageIndex = 0;
    this.updateCalendarTableData();
  }

  clearCalendarDateSelection(): void {
    this.selectedCalendarDate = null;
    for (const d of this.calendarDays) {
      d.isSelected = false;
    }
    this.calendarPageIndex = 0;
    this.updateCalendarTableData();
  }

  getActivitiesForDate(date: Date): ActivityTask[] {
    const count = this.getActivityCountForDate(date);
    const d = date.getDate();
    const isBacklog = this.isBacklogDate(date);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (!this.rawProjects || this.rawProjects.length === 0) {
      return [];
    }

    const result: ActivityTask[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (d * 2 + i * 3) % this.rawProjects.length;
      const base = this.rawProjects[idx];
      result.push({
        ...base,
        id: `cal-${dateStr}-${i + 1}`,
        activityCode: base.activityCode || `ACT-${String((d * 5 + i + 1) % 100).padStart(3, '0')}`,
        PlanStart: dateStr,
        PlanEnd: dateStr,
        ETA: dateStr,
        isBacklog: isBacklog,
        Status: isBacklog ? (i % 2 === 0 ? 'In Progress' : 'Pending') : (i % 3 === 0 ? 'Completed' : 'In Progress'),
        PercentCompletion: isBacklog ? (base.PercentCompletion > 90 ? 65 : base.PercentCompletion) : (i % 3 === 0 ? 100 : 75),
        delayReason: isBacklog ? (base.delayReason || (i % 2 === 0 ? 'Raw Material Shortage' : 'Vendor Dispatch Delay')) : ''
      });
    }
    return result;
  }

  updateCalendarTableData(): void {
    if (this.selectedCalendarDate) {
      this.calendarFilteredActivities = this.getActivitiesForDate(this.selectedCalendarDate);
    } else {
      const allMonthActivities: ActivityTask[] = [];
      const currentMonthDays = this.calendarDays.filter(d => d.inCurrentMonth && d.count > 0);
      for (const d of currentMonthDays) {
        allMonthActivities.push(...this.getActivitiesForDate(d.date));
      }
      this.calendarFilteredActivities = allMonthActivities.length > 0 ? allMonthActivities : [...this.rawProjects];
    }
    const start = this.calendarPageIndex * this.calendarPageSize;
    this.calendarPaginatedActivities = this.calendarFilteredActivities.slice(start, start + this.calendarPageSize);
  }

  handleCalendarPage(event: PageEvent): void {
    this.calendarPageIndex = event.pageIndex;
    this.calendarPageSize = event.pageSize;
    this.updateCalendarTableData();
  }

  scrollCalendarLeft(): void {
    if (this.calendarTableContainer?.nativeElement) {
      this.calendarTableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollCalendarRight(): void {
    if (this.calendarTableContainer?.nativeElement) {
      this.calendarTableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const daysToDistribute = this.showWeekend ? 7 : 5;
    const sourceProjects = this.allProjects && this.allProjects.length > 0 ? this.allProjects : this.rawProjects.slice(0, 10);

    const weekOffsetMap: Record<string, number> = {
      week1: 0,
      week2: 2,
      week3: 4,
      week4: 1,
      week5: 3
    };
    const offset = weekOffsetMap[this.selectedCalendarWeek] || 0;

    const statusCycle: { status: string; color: string; borderColor: string }[] = [
      { status: 'Overdue', color: '#fee2e2', borderColor: '#ef4444' },     // Card 0 (Mon) -> Red
      { status: 'In Progress', color: '#dbeafe', borderColor: '#3b82f6' }, // Card 1 (Tue) -> Blue
      { status: 'Completed', color: '#dcfce7', borderColor: '#22c55e' },   // Card 2 (Wed) -> Green
      { status: 'Overdue', color: '#fee2e2', borderColor: '#ef4444' },     // Card 3 (Thu) -> Red
      { status: 'Completed', color: '#dcfce7', borderColor: '#22c55e' },   // Card 4 (Fri) -> Green
      { status: 'In Progress', color: '#dbeafe', borderColor: '#3b82f6' }, // Card 5 (Mon) -> Blue
      { status: 'Completed', color: '#dcfce7', borderColor: '#22c55e' },   // Card 6 (Tue) -> Green
      { status: 'Overdue', color: '#fee2e2', borderColor: '#ef4444' },     // Card 7 (Wed) -> Red
      { status: 'In Progress', color: '#dbeafe', borderColor: '#3b82f6' }, // Card 8 (Thu) -> Blue
      { status: 'In Progress', color: '#dbeafe', borderColor: '#3b82f6' }  // Card 9 (Fri) -> Blue
    ];

    this.calendarCards = sourceProjects.map((project, i) => {
      const config = statusCycle[(i + offset) % statusCycle.length];
      const cardStatus = config.status;
      const cardColor = config.color;
      const cardBorderColor = config.borderColor;

      return {
        hour: this.hoursList[i % this.hoursList.length],
        user: project.Responsibility,
        dayPlacement: (i % daysToDistribute) + 1,
        taskName: project.TaskName,
        projectName: project.ProjectName,
        status: cardStatus,
        planStart: project.PlanStart,
        color: cardColor,
        borderColor: cardBorderColor,
        pInitials: (project.TaskName || '').substring(0, 2).toUpperCase()
      };
    });
  }

  // --- Actions ---

  // onAddTask(): void {
  //   this.dialog.open(AddProjActivityComponent, { width: '900px', maxWidth: '95vw', data: { isEditMode: false } });
  // }

  onEditTask(item: ActivityTask): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: { ...item, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          activityCode: result.activityCode !== undefined ? result.activityCode : item.activityCode,
          department: (result.department || result.Department) ?? item.department,
          section: (result.section || result.Section) ?? item.section,
          Stage: result.stage || result.Stage || item.Stage || 'S1',
          stage: result.stage || result.Stage || item.stage || 'S1',
          Deliverable: result.Deliverable || item.Deliverable || item.Module,
          Module: result.Deliverable || item.Module,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          planStart: result.PlanStart || result.planStart || item.planStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          planEnd: result.PlanEnd || result.planEnd || item.planEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          actualStart: result.ActualStart || result.actualStart || item.actualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          actualEnd: result.ActualEnd || result.actualEnd || item.actualEnd,
          ETA: result.ETA !== undefined ? result.ETA : item.ETA,
          eta: result.ETA !== undefined ? result.ETA : (result.eta !== undefined ? result.eta : item.eta),
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort,
          planEffort: result.planEffort || item.planEffort,
          actualEffort: result.actualEffort || item.actualEffort,
          planHours: result.planHours || item.planHours,
          actualHours: result.actualHours || item.actualHours,
          earlyStart: result.earlyStart || item.earlyStart,
          earlyEnd: result.earlyEnd || item.earlyEnd,
          lateStart: result.lateStart || item.lateStart,
          lateEnd: result.lateEnd || item.lateEnd,
          predecessor: result.predecessor !== undefined ? result.predecessor : item.predecessor,
          predecessors: result.predecessors !== undefined ? result.predecessors : item.predecessors,
          predecessorsData: result.predecessorsData !== undefined ? result.predecessorsData : item.predecessorsData
        });
        this.generateCalendarData();
        this.applyFilter();
      }
    });
  }

  openEditDialog(item: ActivityTask): void {
    this.onEditTask(item);
  }

  onDeleteTask(item: ActivityTask): void {
    if (!this.canDelete) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  deleteConfirmation(item: ActivityTask): void {
    this.onDeleteTask(item);
  }

  openAcceptancePop(item: ActivityTask): void {
    const dialogRef = this.dialog.open(AcceptancePopComponent, {
      width: '800px',
      minWidth: '750px',
      maxWidth: '95vw',
      data: {
        title: 'Acceptance',
        activity: item
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.acceptedCount !== undefined && res.totalCount !== undefined) {
        const val = `${res.acceptedCount}/${res.totalCount}`;
        item.Acceptance = val;
        item.acceptance = val;
        item.fullKit = this.isFullKit(item);
      }
    });
  }

  openPredecessor(row: ActivityTask): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: {
          ...row,
          task: row.TaskName,
          slNo: row.slNo || row.id
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessors = String(result.predecessor);
          row.predecessor = String(result.predecessor);
        }
      }
    });
  }

  onTasksClick(item: ActivityTask): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        slNo: item.slNo || '',
        activityName: item.TaskName,
        jobCode: item.jobCode || item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        stageCode: item.Stage || item.stage || 'S1',
        projectName: item.ProjectName,
        projectCode: item.ProjectCode,
        tasks: item.Tasks ?? item.tasks ?? '',
        source: 'monitor'
      }
    });
  }

  onRequirementsClick(item: ActivityTask): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        slNo: item.slNo || '',
        activityName: item.TaskName,
        jobCode: item.jobCode || item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        stageCode: item.Stage || item.stage || 'S1',
        projectName: item.ProjectName,
        projectCode: item.ProjectCode,
        requirements: item.Requirements ?? item.requirements ?? item.activities ?? '',
        source: 'monitor'
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

  openHistory(item?: any): void {
    const act = typeof item === 'object' && item !== null ? item : { TaskName: item };
    this.router.navigate(['/projects/dashboard/activities/history'], {
      queryParams: {
        slNo: act.slNo || '',
        activityName: act.TaskName || act.activityName,
        delayReason: act.delayReason,
        stage: act.Stage || act.stage,
        deliverable: act.Deliverable || act.deliverable || act.Module,
        responsibility: act.Responsibility || act.responsibility,
        startDate: act.PlanStart || act.startDate,
        duration: act.Duration || act.duration,
        effort: act.Effort || act.effort,
        status: act.Status || act.status,
        priority: act.Priority || act.priority,
        complexity: act.Complexity || act.complexity,
        projectName: act.ProjectName,
        projectCode: act.ProjectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  // onStatusToggle(item: ActivityTask): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: { title: 'Change Status', content: 'Are you sure you want to Change the Status?' }
  //   });
  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (!confirmed) {
  //       item.IsActive = !item.IsActive; // Revert change
  //     }
  //     this.generateCalendarData();
  //   });
  // }

  // openGridView(): void {
  //   this.dialog.open(FreezepanesDialogComponent, { width: 'auto', height: 'auto' });
  // }

  openProject(item: ActivityTask): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  openPdf(fileName: string): void {
    window.open(`assets/${fileName}`, '_blank');
  }

  // --- Timeline Modal ---

  openTimelineModal(task: ActivityTask): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  scrollLeft(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }
  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
