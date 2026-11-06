import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { HoursTimesheetComponent } from './hours-timesheet/hours-timesheet.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HoursProjectPopComponent } from '../../../hours/hours-project-pop/hours-project-pop.component';

export interface HourMessage {
  sender: string;
  date: string;
  text: string;
}

export interface HourTaskDetail {
  project?: string;
  module: string;
  task: string;
  hours: number;
  description: string;
}

export interface HourEntry {
  dateObj: Date;
  jobCode: string;
  name: string;
  project?: number | string;
  projectsCount?: number;
  tasksList: HourTaskDetail[];
  totalHours: number;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  messages?: HourMessage[];
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  claims: number;
}

@Component({
  selector: 'app-project-hours',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-hours.component.html',
  styleUrl: './project-hours.component.scss'
})
export class ProjectHoursComponent implements OnInit {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;
  @ViewChild('tasksDialog') tasksDialog!: TemplateRef<any>;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  filteredEntries: HourEntry[] = [];
  paginatedEntries: HourEntry[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  calendarDays: CalendarDay[] = [];

  entries: HourEntry[] = [
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-301',
      name: 'Rajesh Kumar',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Process Development",
                "task": "Monomer Feed Profile Optimization",
                "hours": 4.5,
                "description": "Semi-continuous monomer feed rate and reactor temperature control"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Lab Trials",
                "task": "Lab Reactor Batch Run (2 L)",
                "hours": 3.4,
                "description": "2 L reactor trial batch synthesis and exotherm monitoring"
        }
],
      totalHours: 7.9,
      approved: true,
      declined: false,
      pending: false,
      messages: [
        {
                "sender": "Rajesh Kumar",
                "date": "2026-06-02",
                "text": "Submitted timesheet for monomer feed optimization."
        },
        {
                "sender": "Process Lead",
                "date": "2026-06-03",
                "text": "Approved."
        }
]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-302',
      name: 'Anita Desai',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Raw Material Sourcing",
                "task": "Surfactant Screening & Qualification",
                "hours": 4.5,
                "description": "Anionic/non-ionic surfactant package screening for emulsion stability"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Raw Material Sourcing",
                "task": "Monomer Inhibitor Removal Trials",
                "hours": 3.4,
                "description": "Evaluation of MEHQ inhibitor removal resins"
        }
],
      totalHours: 7.9,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-303',
      name: 'Priya Reddy',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Regulatory Affairs",
                "task": "REACH / TSCA Dossier Compilation",
                "hours": 4.5,
                "description": "Compilation of polymer characterization and monomer registration data"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Regulatory Affairs",
                "task": "Safety Data Sheet Authoring",
                "hours": 3.4,
                "description": "16-section multilingual GHS Safety Data Sheet authoring"
        }
],
      totalHours: 7.9,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-304',
      name: 'Amit Patel (Overtime)',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Analytical & QC",
                "task": "Particle Size & Viscosity Profiling",
                "hours": 5.5,
                "description": "DLS particle size distribution and Brookfield viscosity measurements"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Analytical & QC",
                "task": "Residual Monomer GC-FID Analysis",
                "hours": 5.2,
                "description": "Gas chromatography testing for residual butyl acrylate below 100 ppm"
        }
],
      totalHours: 10.7,
      approved: true,
      declined: false,
      pending: false,
      messages: [
        {
                "sender": "Amit Patel",
                "date": "2026-06-02",
                "text": "Overtime authorized for urgent residual monomer GC run."
        }
]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-305',
      name: 'Suresh Naidu',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Plant Operations",
                "task": "Reactor Maintenance & Cleaning",
                "hours": 4.5,
                "description": "Jacketed reactor caustic boil-out and seal inspection"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Plant Operations",
                "task": "Monomer Feed Pump Calibration",
                "hours": 3.4,
                "description": "Peristaltic pump metering accuracy and stroke calibration"
        }
],
      totalHours: 7.9,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-306',
      name: 'Arun Joseph',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Process Safety",
                "task": "Calorimetry & Exotherm Assessment",
                "hours": 4.5,
                "description": "RC1 reaction calorimetry heat output and cooling rate calculations"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Process Safety",
                "task": "HAZOP Study Node Preparation",
                "hours": 3.4,
                "description": "Preparation of deviation nodes for runaway polymerization scenarios"
        }
],
      totalHours: 7.9,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-307',
      name: 'Lakshmi Devi',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Quality Assurance",
                "task": "Batch Record Audit",
                "hours": 4.5,
                "description": "Review of in-process critical parameters for trial batches"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Quality Assurance",
                "task": "COA Verification",
                "hours": 3.4,
                "description": "Verification of certificate of analysis against customer specification"
        }
],
      totalHours: 7.9,
      approved: false,
      declined: true,
      pending: false,
      messages: [
        {
                "sender": "QA Lead",
                "date": "2026-06-02",
                "text": "Resubmit with equipment log attachment."
        }
]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-308',
      name: 'Deepa Nair (Overtime)',
      project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
      projectsCount: 3,
      tasksList: [
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Polymer Synthesis",
                "task": "Emulsion Polymerization Synthesis",
                "hours": 6,
                "description": "Extended polymerization run tracking monomer conversion kinetics"
        },
        {
                "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
                "module": "Polymer Synthesis",
                "task": "Coagulum Determination & Filtration",
                "hours": 4.5,
                "description": "Post-batch 100 mesh filter residue gravimetric analysis"
        }
],
      totalHours: 10.5,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2); // June 2nd, 2026
    const defaultDay =
      this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault)) ??
      this.calendarDays.find(d => d.inCurrentMonth)!;

    this.filterByDate(defaultDay);
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const inCurrentMonth = cellDate.getMonth() === month;
      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday: this.isSameDay(cellDate, today),
        isSelected: this.selectedDate ? this.isSameDay(cellDate, this.selectedDate) : false,
        claims: inCurrentMonth ? this.entries.filter(e => this.isSameDay(e.dateObj, cellDate)).length : 0
      });
    }
    this.calendarDays = days;
  }

  isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  filterByDate(day: CalendarDay): void {
    if (!day.inCurrentMonth) return;

    this.selectedDate = day.date;
    this.filteredEntries = this.entries.filter(e => this.isSameDay(e.dateObj, day.date));

    for (const d of this.calendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + Number(this.pageSize);
    this.paginatedEntries = this.filteredEntries.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  get totalClaimsInRange(): number {
    return this.calendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
  }

  formatDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  toggleRowStatus(entry: HourEntry, field: 'approved' | 'declined' | 'pending'): void {
    if (field === 'approved') {
      entry.approved = !entry.approved;
      if (entry.approved) {
        entry.declined = false;
        entry.pending = false;
      }
    } else if (field === 'declined') {
      entry.declined = !entry.declined;
      if (entry.declined) {
        entry.approved = false;
        entry.pending = false;
      }
    } else if (field === 'pending') {
      entry.pending = !entry.pending;
      if (entry.pending) {
        entry.approved = false;
        entry.declined = false;
      }
    }
  }

  openTasksDialog(entry: HourEntry): void {
    this.dialog.open(this.tasksDialog, {
      width: '750px',
      maxWidth: '95vw',
      data: entry
    });
  }

  openMessagesDialog(entry: HourEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '550px',
      maxWidth: '95vw',
      data: entry
    });
  }

  addMessage(entry: HourEntry, text: string): void {
    if (!text || !text.trim()) return;
    if (!entry.messages) {
      entry.messages = [];
    }
    entry.messages.push({
      sender: 'Lead Reviewer',
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    });
  }

  addTimesheet(): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const tasks: HourTaskDetail[] = (result.rows || []).map((r: any) => ({
          project: r.project || '2026/RD/001 - Abiraterone Acetate Film Coated',
          module: r.module || 'General',
          task: r.task || 'Task Log',
          hours: Number(r.hours) || 0,
          description: r.description || ''
        }));
        const total = tasks.reduce((sum, t) => sum + t.hours, 0);

        const newEntry: HourEntry = {
          dateObj: result.dateObj,
          jobCode: 'JB-' + (200 + this.entries.length + 1),
          name: result.name || 'Anonymous',
          project: tasks.length > 0 ? (tasks[0].project || '2026/RD/001 - Abiraterone Acetate Film Coated') : '2026/RD/001 - Abiraterone Acetate Film Coated',
          tasksList: tasks.length > 0 ? tasks : [
            {
              project: '2026/RD/001 - Abiraterone Acetate Film Coated',
              module: 'General',
              task: 'Task Log',
              hours: 1,
              description: 'General work'
            }
          ],
          totalHours: total > 0 ? total : 1,
          approved: false,
          declined: false,
          pending: true,
          messages: []
        };
        this.entries.unshift(newEntry);

        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  editEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: {
        dateObj: entry.dateObj,
        name: entry.name,
        tasksList: entry.tasksList,
        project: entry.project
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        entry.dateObj = result.dateObj;
        entry.name = result.name;
        if (result.rows && result.rows.length > 0) {
          entry.tasksList = result.rows.map((r: any) => ({
            project: r.project || '2026/RD/001 - Abiraterone Acetate Film Coated',
            module: r.module || 'General',
            task: r.task || 'Task Log',
            hours: Number(r.hours) || 0,
            description: r.description || ''
          }));
          entry.totalHours = entry.tasksList.reduce((sum, t) => sum + t.hours, 0);
          entry.project = entry.tasksList[0].project;
        }

        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  deleteEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this timesheet entry?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.entries = this.entries.filter(e => e !== entry);
        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  openProjectsDialog(entry: HourEntry): void {
    this.dialog.open(HoursProjectPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: { entry }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/GEN/001", name: this.projectName || "Generic Tablet Development" }
    });
  }
}
