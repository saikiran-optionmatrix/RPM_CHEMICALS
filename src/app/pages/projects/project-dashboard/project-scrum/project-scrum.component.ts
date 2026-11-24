import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditBacklogTaskComponent } from './edit-backlog-task/edit-backlog-task.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export type Stage = string;
export type SprintKind = 'backlog' | 'completed' | 'active';

export interface AssignTask {
  id: string;
  name: string;
  code: string;
  module: string;
  duration: string;
  effort: string;
  selected: boolean;
}

export interface TaskBar {
  planStart: string;
  planFinish: string;
  stage?: Stage;
  effort?: number;
}

export interface Task {
  id: string;
  task: string;
  taskCode: string;
  jobCode: string;
  planStart: string;
  planFinish: string;
  effort: number;
  duration: number;
  description: string;
  stage: Stage;
  assigned?: string;
  eta?: string;
  actualStart?: string;
  actualFinish?: string;
  expenses?: number;
  status?: string;
  approved?: boolean;
  notes?: { sender: string; date: string; text: string }[];
  progress?: number;
  expanded?: boolean;
  bars?: TaskBar[];
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface Sprint {
  id: string;
  label: string;
  kind: SprintKind;
  tasks: Task[];
}

export interface CalendarCell {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-project-scrum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    DragDropModule
  ],
  templateUrl: './project-scrum.component.html',
  styleUrl: './project-scrum.component.scss'
})
export class ProjectScrumComponent implements OnInit {

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Scrum';

  team = ['Dr. Sarah Jenkins', 'Rajesh Kumar', 'Ananya Rao', 'Amit Patel', 'Vikram Nair'];
  stages: Stage[] = [
    'Opportunity Identification',
    'Concept Screening & Feasibility',
    'Route Scouting & Lab Synthesis',
    'Process Optimization (Lab Scale)',
    'Process Route Selection & Basis of Design',
    'Bench-to-Pilot Process Development',
    'Process Safety & Regulatory Studies',
    'Regulatory Registration Filing (REACH / TSCA)',
    'Pilot Plant Campaign',
    'Demonstration-Scale Campaign',
    'Commercial Plant Build & Commissioning',
    'Commercial Launch & Ramp-Up'
  ];
  stageFilter: 'all' | Stage = 'all';

  showAssignmentView = false;
  isAddSprintMode = false;
  selectedAssignmentSprintId: string = 'sprint-2';

  assignAvailableTasks: AssignTask[] = [
    { id: 'AT1', name: 'Raw Material Feedstock Screening', code: 'T-001', module: 'Opportunity Identification', duration: '5d', effort: '40h', selected: false },
    { id: 'AT2', name: 'Monomer Feed Ratio Optimization', code: 'T-002', module: 'Route Scouting & Lab Synthesis', duration: '7d', effort: '56h', selected: false },
    { id: 'AT3', name: 'Reaction Calorimetry (RC1) Testing', code: 'T-003', module: 'Process Safety & Regulatory Studies', duration: '4d', effort: '32h', selected: false },
    { id: 'AT4', name: 'HAZOP & LOPA Safety Review', code: 'T-004', module: 'Process Safety & Regulatory Studies', duration: '6d', effort: '48h', selected: false },
    { id: 'AT5', name: 'Pilot Reactor 500L Campaign Execution', code: 'T-005', module: 'Pilot Plant Campaign', duration: '10d', effort: '80h', selected: false },
    { id: 'AT6', name: 'VOC Stripping & Scrubber Efficiency Verification', code: 'T-006', module: 'Process Optimization (Lab Scale)', duration: '4d', effort: '32h', selected: false },
    { id: 'AT7', name: 'IUCLID REACH Dossier Preparation', code: 'T-007', module: 'Regulatory Registration Filing (REACH / TSCA)', duration: '8d', effort: '64h', selected: false }
  ];

  assignAssignedTasks: AssignTask[] = [
    { id: 'AT8', name: 'DCS Recipe Automation Validation', code: 'T-008', module: 'Commercial Plant Build & Commissioning', duration: '5d', effort: '40h', selected: false },
    { id: 'AT9', name: 'PSSR Safety Inspection Walkthrough', code: 'T-009', module: 'Commercial Plant Build & Commissioning', duration: '3d', effort: '24h', selected: false },
    { id: 'AT10', name: 'Commercial Trial Run 50 MT/day', code: 'T-010', module: 'Commercial Launch & Ramp-Up', duration: '7d', effort: '56h', selected: false },
    { id: 'AT11', name: 'Emulsion Technical Release Dossier', code: 'T-011', module: 'Commercial Launch & Ramp-Up', duration: '3d', effort: '24h', selected: false }
  ];

  onAssignmentSprintChange(): void {
    const sprint = this.sprints.find(s => s.id === this.selectedAssignmentSprintId);
    if (sprint && sprint.tasks && sprint.tasks.length > 0) {
      this.assignAssignedTasks = sprint.tasks.map((t, idx) => ({
        id: `AT-S-${idx + 1}`,
        name: t.task,
        code: t.taskCode || `T-00${idx + 8}`,
        module: t.stage || 'General',
        duration: `${t.duration || 4}d`,
        effort: `${t.effort || 32}h`,
        selected: false
      }));
    } else {
      this.assignAssignedTasks = [
        { id: 'AT8', name: 'DCS Recipe Automation Validation', code: 'T-008', module: 'Commercial Plant Build & Commissioning', duration: '5d', effort: '40h', selected: false },
        { id: 'AT9', name: 'PSSR Safety Inspection Walkthrough', code: 'T-009', module: 'Commercial Plant Build & Commissioning', duration: '3d', effort: '24h', selected: false },
        { id: 'AT10', name: 'Commercial Trial Run 50 MT/day', code: 'T-010', module: 'Commercial Launch & Ramp-Up', duration: '7d', effort: '56h', selected: false },
        { id: 'AT11', name: 'Emulsion Technical Release Dossier', code: 'T-011', module: 'Commercial Launch & Ramp-Up', duration: '3d', effort: '24h', selected: false }
      ];
    }
  }

  toggleAssignAvailable(t: AssignTask): void {
    t.selected = !t.selected;
  }

  toggleAssignAssigned(t: AssignTask): void {
    t.selected = !t.selected;
  }

  canAddAssignTasks(): boolean {
    return this.assignAvailableTasks.some(t => t.selected);
  }

  canRemoveAssignTasks(): boolean {
    return this.assignAssignedTasks.some(t => t.selected);
  }

  addSelectedAssignTasks(): void {
    const toMove = this.assignAvailableTasks.filter(t => t.selected);
    this.assignAvailableTasks = this.assignAvailableTasks.filter(t => !t.selected);
    toMove.forEach(t => t.selected = false);
    this.assignAssignedTasks.push(...toMove);
  }

  removeSelectedAssignTasks(): void {
    const toMove = this.assignAssignedTasks.filter(t => t.selected);
    this.assignAssignedTasks = this.assignAssignedTasks.filter(t => !t.selected);
    toMove.forEach(t => t.selected = false);
    this.assignAvailableTasks.push(...toMove);
  }


  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineTask: Task | null = null;

  readonly historySequence: number[] = [4, 2, 5, 3, 6, 1, 7, 2, 4, 8, 3, 5, 2, 6, 4, 8, 2, 5];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  openTimelineModal(task: Task) {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  activeTabId = 'backlog';
  activeView: 'grid' | 'kanban' | 'calendar' | 'gantt' = 'grid';

  kanbanStatuses: string[] = ['Pending', 'Allocated', 'In Process', 'On Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<string, Task[]> = {};

  // Calendar state
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDate: Date = new Date(2026, 6, 1);
  calendarCells: CalendarCell[] = [];
  hoveredCellIndex: number = -1;

  sprints: Sprint[] = [
    {
      id: 'backlog', label: 'Backlog', kind: 'backlog',
      tasks: [
        this.t('Review customer specifications & grade criteria', 'TSK-101', 'JOB-11', '2026-01-05', '2026-01-20', 24, 10, 'Review industrial customer specifications, solids percentage, viscosity target and end-use application criteria.', 'Opportunity Identification', 'Pending'),
        this.t('Competitor grade benchmarking & physicochemical analysis', 'TSK-102', 'JOB-11', '2026-02-01', '2026-02-25', 20, 8, 'Benchmark market reference products for solids content, glass transition temperature (Tg), and particle size distribution.', 'Opportunity Identification', 'Pending'),
        this.t('Candidate synthetic routes & monomer screening', 'TSK-103', 'JOB-12', '2026-03-02', '2026-03-20', 32, 14, 'Screen acrylic monomers (butyl acrylate, methyl methacrylate, acrylic acid) and initiator package feasibility.', 'Concept Screening & Feasibility', 'Allocated'),
        this.t('Feedstock supplier pre-qualification & REACH audit', 'TSK-104', 'JOB-12', '2026-04-05', '2026-04-26', 40, 18, 'Audit bulk monomer supply reliability, pricing index, and EU REACH / TSCA registration compliance status.', 'Concept Screening & Feasibility', 'In Process'),
        this.t('Laboratory-scale emulsion polymerization scouting', 'TSK-105', 'JOB-13', '2026-05-02', '2026-05-28', 36, 15, 'Execute lab-scale core-shell emulsion polymerization trials in 2L automated jacketed glass reactor.', 'Route Scouting & Lab Synthesis', 'In Process'),
        this.t('Initiator system & surfactant package screening', 'TSK-106', 'JOB-13', '2026-06-01', '2026-06-22', 48, 20, 'Screen anionic/nonionic surfactant blends and persulfate/redox initiators for particle size control.', 'Route Scouting & Lab Synthesis', 'On Hold'),
        this.t('Factorial DoE on surfactant & stirring parameters', 'TSK-107', 'JOB-14', '2026-07-01', '2026-07-15', 56, 22, 'Design of Experiments (DoE) investigating feed rate, monomer addition profiles and agitation tip speeds.', 'Process Optimization (Lab Scale)', 'Cancelled'),
        this.t('Post-polymerization steam stripping & VOC reduction', 'TSK-108', 'JOB-14', '2026-08-03', '2026-08-25', 40, 18, 'Optimize stripping parameters to reduce free monomer content below 50 ppm and verify odor specs.', 'Process Optimization (Lab Scale)', 'Completed'),
        this.t('Aspen Plus mass/energy balance & PFD modeling', 'TSK-109', 'JOB-15', '2026-09-01', '2026-09-18', 60, 25, 'Develop comprehensive simulation, mass/energy balance and commercial Process Flow Diagrams (PFD).', 'Process Route Selection & Basis of Design', 'Completed')
      ]
    },
    {
      id: 'sprint-1', label: 'Sprint 1', kind: 'completed',
      tasks: [
        { ...this.t('Review customer specifications & grade criteria', 'TSK-001', 'JOB-10', '2026-06-01', '2026-06-02', 4, 1, 'Review industrial specifications and target solids window.', 'Opportunity Identification', 'Completed'), assigned: 'Dr. Sarah Jenkins', status: 'completed', approved: true, progress: 100, eta: '2026-06-02', actualStart: '2026-06-01', actualFinish: '2026-06-02', expenses: 250 },
        { ...this.t('Competitor grade benchmarking & physicochemical analysis', 'TSK-002', 'JOB-10', '2026-06-02', '2026-06-03', 6, 1, 'Solids %, Tg, particle size distribution and viscosity profiling.', 'Opportunity Identification', 'Completed'), assigned: 'Rajesh Kumar', status: 'completed', approved: true, progress: 100, eta: '2026-06-03', actualStart: '2026-06-02', actualFinish: '2026-06-03', expenses: 0 },
        { ...this.t('Candidate synthetic routes & monomer screening', 'TSK-003', 'JOB-11', '2026-06-03', '2026-06-04', 8, 1, 'Monomer compatibility and initial glass reactor trial runs.', 'Concept Screening & Feasibility', 'In Process'), assigned: 'Ananya Rao', status: 'inprocess', approved: false, progress: 80, eta: '2026-06-04', actualStart: '2026-06-03', actualFinish: '', expenses: 50 },
        { ...this.t('Feedstock supplier pre-qualification & REACH audit', 'TSK-004', 'JOB-12', '2026-06-03', '2026-06-05', 6, 2, 'Monomer dual-sourcing vendor qualification and SDS review.', 'Concept Screening & Feasibility', 'Completed'), assigned: 'Amit Patel', status: 'completed', approved: true, progress: 100, eta: '2026-06-05', actualStart: '2026-06-03', actualFinish: '2026-06-05', expenses: 1200 },
        { ...this.t('Initiator system & surfactant package screening', 'TSK-005', 'JOB-12', '2026-06-02', '2026-06-04', 8, 2, 'Surfactant CMC testing and emulsification stability assessment.', 'Route Scouting & Lab Synthesis', 'Allocated'), assigned: 'Vikram Nair', status: 'allocated', approved: false, progress: 25, eta: '2026-06-04', actualStart: '2026-06-02', actualFinish: '', expenses: 0 }
      ]
    },
    {
      id: 'sprint-2', label: 'Sprint 2', kind: 'active',
      tasks: [
        { ...this.t('Laboratory-scale emulsion polymerization scouting', 'TSK-201', 'JOB-30', '2026-06-25', '2026-07-02', 16, 5, 'Core-shell monomer emulsion feeding and reaction exotherm tracking.', 'Route Scouting & Lab Synthesis', 'In Process'), assigned: 'Dr. Sarah Jenkins', status: 'inprocess', approved: false, progress: 75, eta: '2026-07-02', actualStart: '2026-06-26', actualFinish: '', expenses: 120, notes: [{ sender: 'Admin', date: '2026-07-02', text: 'Polymerization stable; waiting on GPC molecular weight results.' }] },
        { ...this.t('Factorial DoE on surfactant & stirring parameters', 'TSK-202', 'JOB-30', '2026-06-26', '2026-06-30', 6, 2, 'Evaluate stirring speeds 150-350 RPM on coagulum percentage.', 'Process Optimization (Lab Scale)', 'Completed'), assigned: 'Rajesh Kumar', status: 'completed', approved: true, progress: 100, eta: '2026-06-30', actualStart: '2026-06-26', actualFinish: '2026-06-29', expenses: 0 },
        { ...this.t('Post-polymerization steam stripping & VOC reduction', 'TSK-203', 'JOB-31', '2026-06-27', '2026-07-03', 10, 4, 'Stripping vacuum 200 mbar at 70°C for monomer residual reduction.', 'Process Optimization (Lab Scale)', 'In Process'), assigned: 'Amit Patel', status: 'inprocess', approved: false, progress: 50, eta: '2026-07-03', actualStart: '2026-06-28', actualFinish: '', expenses: 50 },
        { ...this.t('Aspen Plus mass/energy balance & PFD modeling', 'TSK-204', 'JOB-31', '2026-06-29', '2026-07-01', 4, 2, 'Simulate jacket cooling duty for 20 m³ commercial reactor.', 'Process Route Selection & Basis of Design', 'Allocated'), assigned: 'Vikram Nair', status: 'allocated', approved: false, progress: 0, eta: '2026-07-01', actualStart: '', actualFinish: '', expenses: 0 }
      ]
    }
  ];

  private t(task: string, taskCode: string, jobCode: string, ps: string, pf: string, eff: number, dur: number, desc: string, stage: Stage, status: string = 'Pending'): Task {
    return { id: taskCode, task, taskCode, jobCode, planStart: ps, planFinish: pf, effort: eff, duration: dur, description: desc, stage, status };
  }

  get activeSprint(): Sprint {
    return this.sprints.find(s => s.id === this.activeTabId) || this.sprints[0];
  }

  get filteredTasks(): Task[] {
    const tasks = this.activeSprint.tasks;
    return this.stageFilter === 'all' ? tasks : tasks.filter(t => t.stage === this.stageFilter);
  }

  selectTab(id: string) {
    this.activeTabId = id;
    this.initViewData();
  }

  initials(name?: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  openAddSprint(): void {
    const defaultName = `Sprint ${this.sprints.filter(s => s.kind !== 'backlog').length + 1}`;
    const dialogRef = this.dialog.open(AddSprintComponent, {
      width: '650px',

      data: { defaultName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        const name = result.name.trim();
        const id = name.toLowerCase().replace(/\s+/g, '-');
        this.sprints.push({ id, label: name, kind: 'active', tasks: [] });
        this.activeTabId = id;
        this.initViewData();
      }
    });
  }

  trackById(_i: number, item: { id: string }) { return item.id; }

  // --- Calendar View State ---
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5];
  calendarCards: any[] = [];

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const statusColors: Record<string, string> = {
      'Completed': '#a0e4ff',
      'completed': '#a0e4ff',
      'Progress': '#ffea9f',
      'inprocess': '#90ee90',
      'In Process': '#90ee90',
      'Hold': '#ffcdd2',
      'onhold': '#ffcdd2',
      'On Hold': '#ffcdd2',
      'Pending': '#e3b2ff',
      'allocated': '#ffea9f',
      'Allocated': '#ffea9f',
      'Cancelled': '#ffcdd2'
    };

    const pastelPalette = ['#a0e4ff', '#ffea9f', '#ffcdd2', '#90ee90', '#e3b2ff'];
    const daysToDistribute = this.showWeekend ? 7 : 5;

    let tasksToMap = this.filteredTasks;
    if (this.excludeCompleted) {
      tasksToMap = tasksToMap.filter(t => (t.status || '').toLowerCase() !== 'completed');
    }

    this.calendarCards = tasksToMap.map((task, i) => {
      const pInitials = task.taskCode || task.task.substring(0, 2).toUpperCase();
      const user = task.assigned || this.team[i % this.team.length];
      const statusLabel = this.getStatusLabel(task.status || 'Pending');

      return {
        id: task.id,
        user: user,
        dayPlacement: (i % daysToDistribute) + 1,
        taskName: task.task,
        taskCode: task.taskCode,
        jobCode: task.jobCode,
        projectName: this.projectName || 'Generic Pharma Development',
        stage: task.stage,
        status: statusLabel,
        planStart: task.planStart,
        planFinish: task.planFinish,
        effort: task.effort,
        color: statusColors[task.status || ''] || pastelPalette[i % pastelPalette.length],
        pInitials: pInitials,
        originalTask: task
      };
    });
  }

  isTemplate: boolean = false;

  // --- View toggler ---
  setView(view: 'grid' | 'kanban' | 'calendar' | 'gantt') {
    if (this.isTemplate && (view === 'kanban' || view === 'calendar')) return;
    this.activeView = view;
    if (view === 'calendar') {
      this.generateCalendarData();
    }
  }

  // --- Kanban Column Helpers ---
  getTasksByStage(stage: Stage): Task[] {
    return this.filteredTasks.filter(t => t.stage === stage);
  }

  // --- Calendar logic ---
  get currentMonthLabel(): string {
    return `${this.monthNames[this.calendarDate.getMonth()]} ${this.calendarDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const cells: CalendarCell[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      cells.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth: cellDate.getMonth() === month,
        isToday: this.isSameDay(cellDate, today),
        tasks: this.getTasksForDate(cellDate)
      });
    }
    this.calendarCells = cells;
  }

  getTasksForDate(date: Date): Task[] {
    const d = this.stripTime(date);
    return this.filteredTasks.filter(t => {
      if (!t.planStart || !t.planFinish) return false;
      const start = this.stripTime(new Date(t.planStart));
      const end = this.stripTime(new Date(t.planFinish));
      return d >= start && d <= end;
    });
  }

  stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  initViewData() {
    const tasks = this.filteredTasks;
    if (tasks && tasks.length > 0) {
      let earliest = new Date(tasks[0].planStart);
      for (const t of tasks) {
        const d = new Date(t.planStart);
        if (d < earliest) {
          earliest = d;
        }
      }
      this.calendarDate = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    } else {
      this.calendarDate = new Date(2026, 6, 1);
    }

    // Group tasks by status for Kanban columns
    const cards: Record<string, Task[]> = {};
    this.kanbanStatuses.forEach(status => {
      cards[status] = tasks.filter(t => {
        const s = t.status || 'Pending';
        if (status === 'In Process') return s === 'In Process' || s === 'inprocess' || s === 'Process';
        if (status === 'On Hold') return s === 'On Hold' || s === 'onhold' || s === 'Hold';
        if (status === 'Completed') return s === 'Completed' || s === 'completed' || s === 'Closed';
        return s.toLowerCase() === status.toLowerCase();
      });
    });
    this.kanbanCards = cards;

    this.buildCalendar();
    this.generateCalendarData();
  }

  dropStatus(event: CdkDragDrop<Task[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      task.status = targetStatus;
    }
  }

  // --- Gantt View logic ---
  ganttScale: 'monthly' | 'weekly' | 'daily' = 'monthly';

  setGanttScale(scale: 'monthly' | 'weekly' | 'daily') {
    this.ganttScale = scale;
  }

  get ganttMonths(): { name: string; fullYear: number; monthIndex: number }[] {
    return [
      { name: 'JAN', fullYear: 2026, monthIndex: 0 },
      { name: 'FEB', fullYear: 2026, monthIndex: 1 },
      { name: 'MAR', fullYear: 2026, monthIndex: 2 },
      { name: 'APR', fullYear: 2026, monthIndex: 3 },
      { name: 'MAY', fullYear: 2026, monthIndex: 4 },
      { name: 'JUN', fullYear: 2026, monthIndex: 5 },
      { name: 'JUL', fullYear: 2026, monthIndex: 6 },
      { name: 'AUG', fullYear: 2026, monthIndex: 7 },
      { name: 'SEP', fullYear: 2026, monthIndex: 8 },
      { name: 'OCT', fullYear: 2026, monthIndex: 9 },
      { name: 'NOV', fullYear: 2026, monthIndex: 10 },
      { name: 'DEC', fullYear: 2026, monthIndex: 11 }
    ];
  }

  get ganttWeeks(): { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] {
    const weeks: { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] = [];
    const months = this.ganttMonths;
    months.forEach(m => {
      ['W1', 'W2', 'W3', 'W4'].forEach((wLabel, wIdx) => {
        weeks.push({
          label: wLabel,
          monthName: m.name,
          monthIndex: m.monthIndex,
          weekInMonth: wIdx + 1
        });
      });
    });
    return weeks;
  }

  get ganttDays(): Date[] {
    const tasks = this.filteredTasks;
    if (!tasks || tasks.length === 0) return [];

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const t of tasks) {
      if (!t.planStart || !t.planFinish) continue;
      const start = new Date(t.planStart);
      const finish = new Date(t.planFinish);
      if (isNaN(start.getTime()) || isNaN(finish.getTime())) continue;

      if (!minDate || start < minDate) minDate = start;
      if (!maxDate || finish > maxDate) maxDate = finish;
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

  getGanttBars(t: Task): TaskBar[] {
    if (this.ganttScale === 'daily') {
      return [{ planStart: t.planStart, planFinish: t.planFinish, stage: t.stage, effort: t.effort }];
    }
    if (t.bars && t.bars.length > 0) {
      return t.bars;
    }
    return this.generateRandomBarsForTask(t);
  }

  generateRandomBarsForTask(t: Task): TaskBar[] {
    const seed = (t.taskCode || t.id || 'TSK-100').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = 2 + (seed % 3);
    const bars: TaskBar[] = [];

    const startMonths = [
      (seed % 3),
      3 + (seed % 3),
      6 + (seed % 3),
      9 + ((seed + 1) % 3)
    ];

    const stages: Stage[] = ['Feasibility', 'Formulation', 'Development', 'Testing', 'Validation', 'Regulatory'];

    for (let i = 0; i < count; i++) {
      const m = startMonths[i];
      const startDay = 1 + ((seed * (i + 1) * 7) % 12);
      const durationDays = 12 + ((seed * (i + 1) * 3) % 10);

      const monthStr = (m + 1).toString().padStart(2, '0');
      const dayStr = startDay.toString().padStart(2, '0');
      const startIso = `2026-${monthStr}-${dayStr}`;

      const finishDate = new Date(2026, m, startDay + durationDays);
      const finishMonthStr = (finishDate.getMonth() + 1).toString().padStart(2, '0');
      const finishDayStr = finishDate.getDate().toString().padStart(2, '0');
      const finishIso = `2026-${finishMonthStr}-${finishDayStr}`;

      const barStage = stages[(seed + i) % stages.length];
      const barEffort = 8 + ((seed * (i + 1)) % 28);

      bars.push({
        planStart: startIso,
        planFinish: finishIso,
        stage: barStage,
        effort: barEffort
      });
    }

    return bars;
  }

  getGanttBarStyleFor(bar: TaskBar): any {
    if (!bar || !bar.planStart || !bar.planFinish) return { display: 'none' };

    const start = new Date(bar.planStart);
    const finish = new Date(bar.planFinish);
    if (isNaN(start.getTime()) || isNaN(finish.getTime())) return { display: 'none' };

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
      const widthPercent = Math.max(0.8, ((finishVal - startVal) / totalMonths) * 100);

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    } else if (this.ganttScale === 'weekly') {
      const totalWeeks = 48;
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startWeekVal = startM * 4 + ((startD - 1) / startDaysTotal) * 4;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishWeekVal = finishM * 4 + (finishD / finishDaysTotal) * 4;

      const leftPercent = (startWeekVal / totalWeeks) * 100;
      const widthPercent = Math.max(0.8, ((finishWeekVal - startWeekVal) / totalWeeks) * 100);

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    } else {
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

      if (startIndex + spanDays > totalDays) {
        spanDays = totalDays - startIndex;
      }

      const leftPercent = (startIndex / totalDays) * 100;
      const widthPercent = (spanDays / totalDays) * 100;

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`
      };
    }
  }

  getGanttBarStyle(t: Task): any {
    return this.getGanttBarStyleFor({ planStart: t.planStart, planFinish: t.planFinish });
  }

  getTabClasses(s: Sprint): string[] {
    const classes = ['tab-btn'];
    if (this.activeTabId === s.id) {
      classes.push('tab-btn--active', `tab-btn--${s.kind}`);
    }
    classes.push(`tab-btn--${s.id}`);
    return classes;
  }

  getStageClasses(stage: Stage | string): string[] {
    const s = (stage || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return ['stage-badge', `stage-badge--${s}`];
  }

  getStatusClasses(status: string): string[] {
    const s = (status || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return ['status-badge', `status-badge--${s}`];
  }

  getStatusLabel(status: string): string {
    if (!status) return '—';
    if (status === 'inprocess') return 'In Process';
    if (status === 'onhold') return 'On Hold';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  colSpanForActiveSprint(): number {
    return this.activeSprint.kind === 'backlog' ? 12 : 14;
  }

  deleteAsset(item: Task): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this task record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const sprint = this.activeSprint;
        sprint.tasks = sprint.tasks.filter(t => t.id !== item.id);
        this.initViewData();
      }
    });
  }

  editAsset(item: Task): void {
    const dialogRef = this.dialog.open(EditBacklogTaskComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      data: {
        task: item,
        isSprint: this.activeSprint.kind !== 'backlog'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, result);
        this.initViewData();
      }
    });
  }

  @ViewChild('notesDialog') notesDialog!: TemplateRef<any>;

  getSliderColor(percent: number): string {
    if (!percent && percent !== 0) return '#0000ff';
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  openNotesDialog(task: Task): void {
    this.dialog.open(this.notesDialog, {
      width: '500px',
      data: task
    });
  }

  addNoteMessage(task: Task, text: string): void {
    if (!text || !text.trim()) return;
    if (!task.notes) {
      task.notes = [];
    }
    task.notes.push({
      sender: 'Admin',
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.initViewData();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isTemplate = params['isTemplate'] === 'true' || params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' || params['fromTemplate'] === true;
      if (this.isTemplate && (this.activeView === 'kanban' || this.activeView === 'calendar')) {
        this.activeView = 'grid';
      }
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    let hIdx = 0;
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    this.sprints.forEach(s => {
      s.tasks.forEach(t => {
        t.historyCount = this.historySequence[hIdx % this.historySequence.length];
        if (!t.updatedDate) {
          t.updatedDate = defaultDates[hIdx % defaultDates.length];
        }
        if (!t.updatedBy) {
          t.updatedBy = t.assigned || defaultUpdaters[hIdx % defaultUpdaters.length];
        }
        hIdx++;
      });
    });
  }

  openHistory(item: Task): void {
    this.router.navigate(['/projects/dashboard/backlog/history'], {
      queryParams: {
        taskName: item.task,
        taskCode: item.taskCode,
        jobCode: item.jobCode,
        effort: item.effort,
        duration: item.duration,
        stage: item.stage,
        description: item.description,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  openAssignmentPopup(mode: 'sprint' | 'task' = 'sprint'): void {
    this.isAddSprintMode = mode === 'sprint';
    if (this.isAddSprintMode) {
      if (this.activeTabId && this.activeTabId !== 'backlog') {
        this.selectedAssignmentSprintId = this.activeTabId;
      } else if (this.sprints.length > 1) {
        this.selectedAssignmentSprintId = this.sprints[1].id;
      }
    } else {
      this.selectedAssignmentSprintId = this.activeTabId;
    }
    this.onAssignmentSprintChange();
    this.showAssignmentView = true;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

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

}
