import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddTodoComponent } from '../../projects/project-dashboard/project-todo/add-todo/add-todo.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';

export type TodoStatus = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface CalendarDayItem {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  count: number;
  isBacklog: boolean;
}

export interface TodoTask {
  isBacklog?: boolean;
  id: number;
  done?: boolean;
  Done?: boolean;
  approved?: boolean;
  Approved?: boolean;
  stage?: string;
  Stage?: string;
  deliverable?: string;
  Deliverable?: string;
  activity?: string;
  Activity?: string;
  task?: string;
  Task?: string;
  taskName?: string;
  subject?: string;
  Subject?: string;
  description?: string;
  Description?: string;
  assignedTo?: string;
  AssignedTo?: string;
  responsibility?: string;
  Responsibility?: string;
  dateCreated?: string;
  CreatedDate?: string;
  createdDate?: string;
  dueDate?: string | null;
  DueDate?: string | null;
  completionDate?: string | null;
  CompletionDate?: string | null;
  role?: string;
  Role?: string;
  group?: string;
  Group?: string;
  site?: string;
  Site?: string;
  department?: string;
  Department?: string;
  ProjectCode?: string;
  projectCode?: string;
  ProjectName?: string;
  projectName?: string;
  status?: string;
  Status?: TodoStatus;
  delayReason?: string;
  Comments?: string;
  comments?: string;
  IsActive?: boolean;
  isActive?: boolean;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualHours?: number;
  section?: string;
  taskCode?: string;
  effort?: number;
}

export interface KanbanCard extends TodoTask {
  expanded: boolean;
  notes: { text: string; author: string; date: string }[];
}

@Component({
  selector: 'app-monitor-todo',
  standalone: true,
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
    DragDropModule,
    MatCardModule
  ],
  templateUrl: './monitor-todo.component.html',
  styleUrls: ['./monitor-todo.component.scss']
})
export class MonitorTodoComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('kanbanContainer') kanbanContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('calendarTableContainer') calendarTableContainer!: ElementRef<HTMLDivElement>;

  activeView: 'calendar' | 'table' = 'calendar';

  readonly monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  readonly dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentCalendarDate: Date = new Date(2026, 9, 1); // October 2026
  selectedCalendarDate: Date | null = null;
  calendarDays: CalendarDayItem[] = [];

  readonly todayReference: Date = new Date(2026, 9, 10); // 10-Oct-2026

  calendarFilteredTodos: TodoTask[] = [];
  calendarPaginatedTodos: TodoTask[] = [];
  calendarPageIndex: number = 0;
  calendarPageSize: number = 10;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // View States
  isKanbanView: boolean = false;
  isCalendarView: boolean = false;
  showFilter: boolean = false;
  showOverdueOnly: boolean = false;
  excludeCompleted: boolean = false;
  showWeekend: boolean = false;
  readonly today = new Date();

  // Modals
  showTimelineModal: boolean = false;
  selectedTimelineTask: TodoTask | null = null;

  // Pagination
  totalSize: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  // Data Arrays
  mockData: TodoTask[] = [];
  filteredData: TodoTask[] = [];
  paginatedData: TodoTask[] = [];

  readonly historySequence: number[] = [4, 2, 5, 3, 6, 1, 7, 2, 4, 8, 3, 5, 2, 6, 4, 8];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  // Calendar
  displayDays: number[] = [1, 2, 3, 4, 5];
  readonly hoursList = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
  calendarCards: any[] = [];

  // Kanban
  readonly kanbanLists: TodoStatus[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<TodoStatus, KanbanCard[]> = {
    Pending: [], Allocated: [], Progress: [], Hold: [], Cancelled: [], Completed: []
  };

  stageOptions: string[] = [
    'Stage 1: Business Case',
    'Stage 2: Project Initiation',
    'Stage 3: Development Procurement',
    'Stage 4: POC Formulation',
    'Stage 5: Scale-Up & EB Procurement',
    'Stage 6: Exhibit Batches'
  ];

  departmentOptions: string[] = [
    'Formulation R&D',
    'Pre-Formulation',
    'Formulation Development',
    'Analytical Development',
    'Quality Control',
    'Quality Assurance',
    'Regulatory Affairs'
  ];

  roleOptions: string[] = [
    'Formulation Scientist',
    'Pre-Formulation Lead',
    'Analytical Scientist',
    'Process Chemist',
    'QC Chemist',
    'QA Auditor'
  ];

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectName: [null],
    Stage: [null],
    Department: [null],
    Role: [null]
  });

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilterData();
    this.buildCalendarDays();
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) ||
      this.calendarDays.find(d => d.inCurrentMonth);
    if (defaultDay) {
      this.selectCalendarDate(defaultDay);
    }
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.showOverdueOnly = isOverdue;
      this.applyFilterData();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  private loadMockData(): void {
    this.mockData = [
      {
            "id": 1,
            "done": false,
            "approved": false,
            "subject": "Concept Screening - Chemistry Feasibility",
            "delayReason": "Calorimetry Lab Slot",
            "description": "Conduct feasibility and competitor benchmarking on polyurethane dispersion chemistry, particle size and film performance.",
            "assignedTo": "Dr. Sarah Jenkins",
            "createdDate": "2026-01-10",
            "dueDate": "2026-06-15",
            "group": "Research",
            "projectCode": "2026/CHM/001",
            "projectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "stage": "Stage 2: Concept Screening & Feasibility",
            "deliverable": "Process Feasibility Study",
            "activity": "Concept Screening - Chemistry Feasibility",
            "task": "Concept Screening - Chemistry Feasibility",
            "historyCount": 1,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Sarah Jenkins"
      },
      {
            "id": 2,
            "done": true,
            "approved": true,
            "subject": "Project Definition - Target Product Profile & Specifications",
            "delayReason": "",
            "description": "Cascade target product profile, activity and selectivity specifications for the pilot lot.",
            "assignedTo": "Priya Reddy",
            "createdDate": "2026-01-15",
            "dueDate": "2026-03-25",
            "group": "Project Management",
            "projectCode": "2026/CHM/002",
            "projectName": "Hydrogenation Catalyst Development (Pd/C)",
            "stage": "Stage 2: Concept Screening & Feasibility",
            "deliverable": "Process Feasibility Study",
            "activity": "Project Definition - Target Product Profile & Specifications",
            "task": "Project Definition - Target Product Profile & Specifications",
            "historyCount": 2,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Priya Reddy"
      },
      {
            "id": 3,
            "done": false,
            "approved": false,
            "subject": "Process Development - Synthesis Route Strategy",
            "delayReason": "Reactor Allocation Delay",
            "description": "Finalize multi-step synthesis route strategy, intermediate selection criteria and batch process design.",
            "assignedTo": "Rajesh Kumar",
            "createdDate": "2026-02-01",
            "dueDate": "2026-07-01",
            "group": "Process Development",
            "projectCode": "2026/CHM/003",
            "projectName": "Agrochemical Active Ingredient Synthesis Development",
            "stage": "Stage 2: Concept Screening & Feasibility",
            "deliverable": "Process Feasibility Study",
            "activity": "Process Development - Synthesis Route Strategy",
            "task": "Process Development - Synthesis Route Strategy",
            "historyCount": 3,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Rajesh Kumar"
      },
      {
            "id": 4,
            "done": false,
            "approved": false,
            "subject": "Supplier Sourcing - Raw Material Qualification",
            "delayReason": "Solvent Specification Update",
            "description": "Issue qualification package for technical-grade solvents, including impurity limits and certificates of analysis.",
            "assignedTo": "Anita Desai",
            "createdDate": "2026-02-10",
            "dueDate": "2026-06-30",
            "group": "Sourcing",
            "projectCode": "2026/CHM/004",
            "projectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "stage": "Stage 2: Concept Screening & Feasibility",
            "deliverable": "Process Feasibility Study",
            "activity": "Supplier Sourcing - Raw Material Qualification",
            "task": "Supplier Sourcing - Raw Material Qualification",
            "historyCount": 4,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Anita Desai"
      },
      {
            "id": 5,
            "done": true,
            "approved": true,
            "subject": "Plant Readiness - Assay Validation & Tech Transfer",
            "delayReason": "Resource Reallocation",
            "description": "Execute validation of active-content and suspensibility assays on WDG pilot lots.",
            "assignedTo": "Amit Patel",
            "createdDate": "2026-03-05",
            "dueDate": "2026-05-20",
            "group": "Quality",
            "projectCode": "2026/CHM/005",
            "projectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "stage": "Stage 2: Concept Screening & Feasibility",
            "deliverable": "Process Feasibility Study",
            "activity": "Plant Readiness - Assay Validation & Tech Transfer",
            "task": "Plant Readiness - Assay Validation & Tech Transfer",
            "historyCount": 5,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Amit Patel"
      }
];

    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];

    this.mockData.forEach((item, idx) => {
      const dayNum = ((idx * 3) % 28) + 1;
      const dueDay = String(dayNum).padStart(2, '0');
      const startDay = String(Math.max(1, dayNum - 4)).padStart(2, '0');
      const itemIsBacklog = dayNum < 10;
      item.dateCreated = `2026-10-${startDay}`;
      item.CreatedDate = item.dateCreated;
      item.dueDate = `2026-10-${dueDay}`;
      item.DueDate = item.dueDate;
      item.isBacklog = itemIsBacklog;
      item.done = item.done ?? item.Done ?? (item.status === 'Completed');
      item.Done = item.done;
      item.approved = item.approved ?? item.Approved ?? (item.done || idx % 2 === 0);
      item.Approved = item.approved;
      item.stage = item.stage || item.Stage || 'Stage 1: Business Case';
      item.Stage = item.stage;
      item.deliverable = item.deliverable || item.Deliverable || 'Reference Product Characterization';
      item.Deliverable = item.deliverable;
      item.activity = item.activity || item.Activity || 'Innovator Sample Evaluation';
      item.Activity = item.activity;
      item.task = item.task || item.Task || item.taskName || 'API Characterization Study';
      item.Task = item.task;
      item.taskName = item.task;
      item.subject = item.subject || item.Subject || 'Todo Task';
      item.Subject = item.subject;
      item.description = item.description !== undefined ? item.description : (item.Description || '');
      item.Description = item.description;
      item.assignedTo = item.assignedTo || item.responsibility || item.Responsibility || 'Dr. Sarah Connor';
      item.responsibility = item.assignedTo;
      item.Responsibility = item.assignedTo;
      item.dateCreated = item.dateCreated || item.CreatedDate || '2026-05-28';
      item.CreatedDate = item.dateCreated;
      item.dueDate = item.dueDate || item.DueDate || '2026-06-15';
      item.DueDate = item.dueDate;
      item.department = item.department || item.Department || 'Formulation R&D';
      item.Department = item.department;
      item.ProjectCode = item.ProjectCode || item.projectCode || `2026/CHM/00${(idx % 6) + 1}`;
      item.projectCode = item.ProjectCode;
      item.ProjectName = item.ProjectName || item.projectName || 'Generic Pharma Development';
      item.projectName = item.ProjectName;
      item.Status = item.done ? 'Completed' : ((item.Status as TodoStatus) || 'Progress');
      item.status = item.Status;
      item.updatedDate = item.updatedDate || sampleDates[idx % sampleDates.length];
      item.updatedBy = item.updatedBy || item.assignedTo;
      item.historyCount = item.historyCount || this.getHistoryCount(idx);
    });
  }

  // --- Toggles & Filters ---

  toggleView(view: 'calendar' | 'table' | string): void {
    if (view === 'grid') view = 'table';
    this.activeView = view as any;
    this.isKanbanView = false;
    this.isCalendarView = view === 'calendar';
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
    }
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  toggleOverdueOnly(checked: boolean): void {
    this.showOverdueOnly = checked;
    this.monitorStateService.setOverdue(this.showOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.showOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilterData();
    this.cdr.markForCheck();
  }

  onExcludeCompletedChange(): void {
    this.currentPage = 0;
    this.applyFilterData();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilterData();
  }

  onClear(): void {
    this.filterForm.reset();
    this.excludeCompleted = false;
    this.showOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilterData();
  }

  applyFilterData(): void {
    let filtered = [...this.mockData];

    if (this.excludeCompleted) {
      filtered = filtered.filter(item => !item.done && !item.Done && item.Status !== 'Completed');
    }

    if (this.showOverdueOnly) {
      filtered = filtered.filter(item => this.isTaskOverdue(item));
    }

    const formVals = this.filterForm.value;
    if (formVals.Keyword && formVals.Keyword.trim()) {
      const kw = formVals.Keyword.trim().toLowerCase();
      filtered = filtered.filter(t =>
        (t.ProjectCode || '').toLowerCase().includes(kw) ||
        (t.subject || t.Subject || '').toLowerCase().includes(kw) ||
        (t.task || t.taskName || t.Task || '').toLowerCase().includes(kw) ||
        (t.activity || t.Activity || '').toLowerCase().includes(kw) ||
        (t.stage || t.Stage || '').toLowerCase().includes(kw) ||
        (t.deliverable || t.Deliverable || '').toLowerCase().includes(kw) ||
        (t.department || t.Department || '').toLowerCase().includes(kw) ||
        (t.assignedTo || t.responsibility || t.Responsibility || '').toLowerCase().includes(kw) ||
        (t.description || t.Description || '').toLowerCase().includes(kw)
      );
    }

    if (formVals.ProjectName) {
      filtered = filtered.filter(t => (t.ProjectName || t.projectName) === formVals.ProjectName);
    }
    if (formVals.Stage) {
      filtered = filtered.filter(t => (t.stage || t.Stage) === formVals.Stage);
    }
    if (formVals.Department) {
      filtered = filtered.filter(t => (t.department || t.Department) === formVals.Department);
    }
    if (formVals.Role) {
      filtered = filtered.filter(t => (t.assignedTo || t.role || t.Role || t.responsibility || t.Responsibility) === formVals.Role);
    }

    this.filteredData = filtered;
    this.totalSize = this.filteredData.length;

    const start = this.currentPage * this.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pageSize);

    if (this.isKanbanView) this.initializeKanbanData();
    if (this.isCalendarView) this.generateCalendarData();
    this.cdr.markForCheck();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilterData();
  }

  isTaskOverdue(item: TodoTask): boolean {
    if (item.done || item.Done || item.Status === 'Completed') {
      return false;
    }
    const due = item.dueDate || item.DueDate;
    if (!due) return false;
    const today = new Date().toISOString().split('T')[0];
    const dueStr = due.substring(0, 10);
    return dueStr < today;
  }

  // --- Row Actions ---

  toggleDone(row: TodoTask): void {
    row.done = !row.done;
    row.Done = row.done;
    row.Status = (row.done ? 'Completed' : 'Progress') as TodoStatus;
    row.status = row.Status;
    if (row.done && !row.CompletionDate) {
      row.CompletionDate = new Date().toISOString().split('T')[0];
      row.completionDate = row.CompletionDate;
    } else if (!row.done) {
      row.CompletionDate = null;
      row.completionDate = null;
    }
    this.applyFilterData();
  }

  toggleApproved(row: TodoTask): void {
    row.approved = !row.approved;
    row.Approved = row.approved;
  }

  addTodo(): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const isDone = !!res.done;
        const newItem: TodoTask = {
          id: Date.now(),
          done: isDone,
          Done: isDone,
          approved: false,
          Approved: false,
          stage: res.stage || 'Stage 1: Business Case',
          Stage: res.stage || 'Stage 1: Business Case',
          deliverable: res.deliverable || 'Reference Product Characterization',
          Deliverable: res.deliverable || 'Reference Product Characterization',
          activity: res.activity || 'Innovator Sample Evaluation',
          Activity: res.activity || 'Innovator Sample Evaluation',
          task: res.task || 'API Characterization Study',
          Task: res.task || 'API Characterization Study',
          taskName: res.task || 'API Characterization Study',
          subject: res.subject || '',
          Subject: res.subject || '',
          description: res.description || '',
          Description: res.description || '',
          Comments: '',
          assignedTo: res.assignedTo || 'Dr. Sarah Connor',
          responsibility: res.assignedTo || 'Dr. Sarah Connor',
          Responsibility: res.assignedTo || 'Dr. Sarah Connor',
          dateCreated: res.dateCreated || new Date().toISOString().split('T')[0],
          CreatedDate: res.dateCreated || new Date().toISOString().split('T')[0],
          dueDate: res.dueDate || new Date().toISOString().split('T')[0],
          DueDate: res.dueDate || new Date().toISOString().split('T')[0],
          CompletionDate: isDone ? new Date().toISOString().split('T')[0] : null,
          role: res.role || 'Formulation Scientist',
          Role: res.role || 'Formulation Scientist',
          group: res.group || 'Product Development',
          Group: res.group || 'Product Development',
          site: res.site || 'R&D Center – Mumbai',
          Site: res.site || 'R&D Center – Mumbai',
          department: res.department || 'Formulation R&D',
          Department: res.department || 'Formulation R&D',
          ProjectCode: '2026/CHM/001',
          ProjectName: 'Acrylic Emulsion Binder 50% Solids',
          Status: isDone ? 'Completed' : 'Pending',
          status: isDone ? 'Completed' : 'Pending',
          IsActive: true,
          isActive: true,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedBy: res.assignedTo || 'Dr. Sarah Connor',
          historyCount: 1
        };
        this.mockData.unshift(newItem);
        this.applyFilterData();
      }
    });
  }

  onEditTodo(item: TodoTask): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: {
        ...item,
        stage: item.stage || item.Stage || 'Stage 1: Business Case',
        deliverable: item.deliverable || item.Deliverable || 'Reference Product Characterization',
        activity: item.activity || item.Activity || 'Innovator Sample Evaluation',
        task: item.task || item.Task || item.taskName || 'API Characterization Study',
        subject: item.subject || item.Subject || '',
        description: item.description !== undefined ? item.description : (item.Description || ''),
        assignedTo: item.assignedTo || item.responsibility || item.Responsibility || 'Dr. Sarah Connor',
        dateCreated: item.dateCreated || item.CreatedDate ? (item.dateCreated || item.CreatedDate || '').substring(0, 10) : new Date().toISOString().substring(0, 10),
        dueDate: item.dueDate || item.DueDate ? (item.dueDate || item.DueDate || '').substring(0, 10) : new Date().toISOString().substring(0, 10),
        role: item.role || item.Role || 'Formulation Scientist',
        group: item.group || item.Group || 'Product Development',
        site: item.site || item.Site || 'R&D Center – Mumbai',
        department: item.department || item.Department || 'Formulation R&D',
        done: item.done ?? item.Done ?? (item.Status === 'Completed')
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        item.stage = res.stage;
        item.Stage = res.stage;
        item.deliverable = res.deliverable;
        item.Deliverable = res.deliverable;
        item.activity = res.activity;
        item.Activity = res.activity;
        item.task = res.task;
        item.Task = res.task;
        item.taskName = res.task;
        item.subject = res.subject;
        item.Subject = res.subject;
        item.description = res.description;
        item.Description = res.description;
        item.assignedTo = res.assignedTo;
        item.responsibility = res.assignedTo;
        item.Responsibility = res.assignedTo;
        item.dateCreated = res.dateCreated;
        item.CreatedDate = res.dateCreated;
        item.dueDate = res.dueDate;
        item.DueDate = res.dueDate;
        item.role = res.role;
        item.Role = res.role;
        item.group = res.group;
        item.Group = res.group;
        item.site = res.site;
        item.Site = res.site;
        item.department = res.department;
        item.Department = res.department;
        item.done = !!res.done;
        item.Done = item.done;
        if (item.done) {
          item.Status = 'Completed';
          item.status = 'Completed';
          item.CompletionDate = new Date().toISOString().split('T')[0];
          item.completionDate = item.CompletionDate;
        } else if (item.Status === 'Completed') {
          item.Status = 'Progress';
          item.status = 'Progress';
          item.CompletionDate = null;
          item.completionDate = null;
        }
        item.updatedDate = new Date().toISOString().split('T')[0];
        item.updatedBy = item.assignedTo || 'Dr. Sarah Connor';

        const orig = this.mockData.find(m => m.id === item.id);
        if (orig) {
          Object.assign(orig, item);
        }
        this.applyFilterData();
      }
    });
  }

  onDeleteTodo(item: TodoTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.mockData = this.mockData.filter(x => x.id !== item.id);
        this.applyFilterData();
      }
    });
  }

  openProject(item: TodoTask): void {
    this.router.navigate(['/projects/dashboard/todo'], {
      queryParams: {
        code: item.ProjectCode || item.projectCode || '',
        projectCode: item.ProjectCode || item.projectCode || '',
        name: item.ProjectName || item.projectName || '',
        projectName: item.ProjectName || item.projectName || ''
      }
    });
  }

  openTimelineModal(task: TodoTask): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  openHistory(item?: any): void {
    const subject = (typeof item === 'object' && item !== null) ? (item.subject || item.Subject || '') : (typeof item === 'string' ? item : '');
    this.router.navigate(['/projects/dashboard/todo/history'], {
      queryParams: {
        subject: subject,
        projectName: (typeof item === 'object' && item !== null) ? (item.projectName || item.ProjectName || '') : '',
        projectCode: (typeof item === 'object' && item !== null) ? (item.projectCode || item.ProjectCode || '') : ''
      },
      queryParamsHandling: 'merge'
    });
  }

  get currentCalendarMonthLabel(): string {
    return `${this.monthNames[this.currentCalendarDate.getMonth()]} ${this.currentCalendarDate.getFullYear()}`;
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
      const count = inCurrentMonth ? this.getTodoCountForDate(cellDate) : 0;

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

  getTodoCountForDate(date: Date): number {
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

  isBacklogTodo(item: TodoTask): boolean {
    if (item.isBacklog !== undefined) {
      return !!item.isBacklog;
    }
    const dateStr = item.dueDate || item.DueDate || item.dateCreated || item.CreatedDate;
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

  getTodosForDate(date: Date): TodoTask[] {
    const count = this.getTodoCountForDate(date);
    const d = date.getDate();
    const isBacklog = this.isBacklogDate(date);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (!this.mockData || this.mockData.length === 0) {
      return [];
    }

    const result: TodoTask[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (d * 2 + i * 3) % this.mockData.length;
      const base = this.mockData[idx];
      result.push({
        ...base,
        id: (d * 100 + i + 1),
        dateCreated: dateStr,
        CreatedDate: dateStr,
        dueDate: dateStr,
        DueDate: dateStr,
        completionDate: isBacklog ? null : (base.completionDate || dateStr),
        CompletionDate: isBacklog ? null : (base.CompletionDate || dateStr),
        done: isBacklog ? false : base.done,
        Done: isBacklog ? false : base.Done,
        approved: isBacklog ? false : base.approved,
        Approved: isBacklog ? false : base.Approved,
        status: isBacklog ? 'Pending' : base.status,
        isBacklog: isBacklog
      });
    }
    return result;
  }

  updateCalendarTableData(): void {
    if (this.selectedCalendarDate) {
      this.calendarFilteredTodos = this.getTodosForDate(this.selectedCalendarDate);
    } else {
      const allMonthTodos: TodoTask[] = [];
      const currentMonthDays = this.calendarDays.filter(d => d.inCurrentMonth && d.count > 0);
      for (const d of currentMonthDays) {
        allMonthTodos.push(...this.getTodosForDate(d.date));
      }
      this.calendarFilteredTodos = allMonthTodos.length > 0 ? allMonthTodos : [...this.mockData];
    }
    const start = this.calendarPageIndex * this.calendarPageSize;
    this.calendarPaginatedTodos = this.calendarFilteredTodos.slice(start, start + this.calendarPageSize);
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

  // --- Scrolling logic ---
  scrollLeft(): void {
    if (this.activeView === 'calendar') {
      this.scrollCalendarLeft();
      return;
    }
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.activeView === 'calendar') {
      this.scrollCalendarRight();
      return;
    }
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
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
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  // --- Kanban Logic ---

  private initializeKanbanData(): void {
    const grouped: Record<TodoStatus, KanbanCard[]> = {
      Pending: [], Allocated: [], Progress: [], Hold: [], Cancelled: [], Completed: []
    };

    this.filteredData.forEach((item) => {
      const statusKey = (item.Status || (item.done ? 'Completed' : 'Pending')) as TodoStatus;
      if (grouped[statusKey]) {
        grouped[statusKey].push({
          ...item,
          expanded: false,
          notes: []
        });
      }
    });

    this.kanbanCards = grouped;
  }

  onDrop(event: CdkDragDrop<KanbanCard[]>, targetList: TodoStatus): void {
    const previousList = event.previousContainer.id as TodoStatus;
    const currentList = event.container.id as TodoStatus;

    if (previousList !== currentList) {
      transferArrayItem(
        this.kanbanCards[previousList],
        this.kanbanCards[currentList],
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = this.kanbanCards[currentList][event.currentIndex];
      movedCard.Status = currentList;
      movedCard.status = currentList;
      if (currentList === 'Completed') {
        movedCard.done = true;
        movedCard.Done = true;
      } else {
        movedCard.done = false;
        movedCard.Done = false;
      }

      // Sync master data
      const masterItem = this.mockData.find(m => m.id === movedCard.id);
      if (masterItem) {
        masterItem.Status = currentList;
        masterItem.status = currentList;
        masterItem.done = movedCard.done;
        masterItem.Done = movedCard.Done;
      }

    } else {
      moveItemInArray(this.kanbanCards[targetList], event.previousIndex, event.currentIndex);
    }
  }

  toggleCard(card: KanbanCard): void {
    card.expanded = !card.expanded;
  }

  getKanbanColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a', 'Allocated': '#ef9f27', 'Progress': '#3b82f6',
      'Hold': '#f59e0b', 'Cancelled': '#94a3b8', 'Completed': '#10b981'
    };
    return colors[status] ?? '#94a3b8';
  }

  // --- Calendar Logic ---

  private generateCalendarData(): void {
    this.calendarCards = this.filteredData.map((project, i) => {
      const subject = project.subject || project.Subject || 'Todo';
      const isDone = !!(project.done || project.Done || project.Status === 'Completed');
      return {
        hour: this.hoursList[i % this.hoursList.length],
        user: project.assignedTo || project.responsibility || project.Responsibility || 'Dr. Sarah Connor',
        dayPlacement: (i % (this.showWeekend ? 7 : 5)) + 1,
        taskName: subject,
        projectName: project.projectName || project.ProjectName || 'Generic Pharma Development',
        status: isDone ? 'Completed' : (project.IsActive ? 'Active' : 'Pending'),
        color: isDone ? '#c7f9cc' : (project.IsActive ? '#dbeafe' : '#fef08a'),
        pInitials: subject ? subject.substring(0, 2).toUpperCase() : 'NA'
      };
    });
  }
}
