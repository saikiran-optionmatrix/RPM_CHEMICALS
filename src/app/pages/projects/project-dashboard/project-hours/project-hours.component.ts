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
  description?: string;
}

export interface HourEntry {
  id?: string | number;
  jobCode?: string;
  dateObj: Date;
  name: string;
  workHours?: number;
  projectsCount: number;
  projects?: string[];
  tasks?: string;
  tasksList: HourTaskDetail[];
  approved: number;
  declined: number;
  pending: number;
  totalHours: number;
  hours?: number;
  totalWorkHours?: number;
  loadPercentage: number;
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

  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  filteredEntries: HourEntry[] = [];
  paginatedEntries: HourEntry[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20, 30];

  calendarDays: CalendarDay[] = [];

  defaultAllocationProjects: string[] = [
  "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
  "2026/CHM/001 - Waterborne Polyurethane Dispersion",
  "PRJ-2026-8492 - High Purity Electronic Grade IPA",
  "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin"
];

  // 21 Allocation Resource Mock Templates from ProjectScheduleComponent
  allocationTemplates: Omit<HourEntry, 'id' | 'dateObj' | 'messages'>[] = [
  {
    "name": "Rajesh Kumar",
    "workHours": 7.9,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "2026/CHM/001 - Waterborne Polyurethane Dispersion",
      "PRJ-2026-8492 - High Purity Electronic Grade IPA"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Process Development",
        "task": "Monomer Feed Profile Optimization",
        "hours": 4.5,
        "description": "Feed rate calibration and reactor temperature control"
      },
      {
        "project": "2026/CHM/001 - Waterborne Polyurethane Dispersion",
        "module": "Pre-Polymer",
        "task": "Pre-Polymer Chain Extension Kinetics",
        "hours": 2,
        "description": "Reaction conversion monitoring"
      },
      {
        "project": "PRJ-2026-8492 - High Purity Electronic Grade IPA",
        "module": "Distillation",
        "task": "Azeotropic Distillation Column Balancing",
        "hours": 1.4,
        "description": "Reflux ratio optimization"
      }
    ],
    "approved": 7.9,
    "declined": 0,
    "pending": 0,
    "totalHours": 7.9,
    "hours": 7.9,
    "totalWorkHours": 7.9,
    "loadPercentage": 99
  },
  {
    "name": "Anita Desai",
    "workHours": 7.9,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "2026/CHM/001 - Waterborne Polyurethane Dispersion",
      "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Raw Materials",
        "task": "Surfactant System Screening",
        "hours": 4,
        "description": "Emulsion micelle size and stability testing"
      },
      {
        "project": "2026/CHM/001 - Waterborne Polyurethane Dispersion",
        "module": "Formulation",
        "task": "Polyol Compatibility Trials",
        "hours": 2.5,
        "description": "Viscosity tracking during dispersion"
      },
      {
        "project": "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin",
        "module": "Monomer Sourcing",
        "task": "Adipic Acid & HMD Purity Testing",
        "hours": 1.4,
        "description": "Vendor qualification audit"
      }
    ],
    "approved": 7.9,
    "declined": 0,
    "pending": 0,
    "totalHours": 7.9,
    "hours": 7.9,
    "totalWorkHours": 7.9,
    "loadPercentage": 99
  },
  {
    "name": "Priya Reddy",
    "workHours": 7.9,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "PRJ-2026-8492 - High Purity Electronic Grade IPA",
      "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Regulatory & REACH",
        "task": "REACH Substance Identity & Data Gap Analysis",
        "hours": 4.5,
        "description": "Spectroscopic verification and monomer purity"
      },
      {
        "project": "PRJ-2026-8492 - High Purity Electronic Grade IPA",
        "module": "Regulatory",
        "task": "SEMI-Standard Electronic Chemical Compliance",
        "hours": 2,
        "description": "Metals impurity threshold validation"
      },
      {
        "project": "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin",
        "module": "EHS",
        "task": "Consortium Registration Dossier Review",
        "hours": 1.4,
        "description": "Tonnage band authorization review"
      }
    ],
    "approved": 7.9,
    "declined": 0,
    "pending": 0,
    "totalHours": 7.9,
    "hours": 7.9,
    "totalWorkHours": 7.9,
    "loadPercentage": 99
  },
  {
    "name": "Amit Patel",
    "workHours": 8,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "2026/CHM/001 - Waterborne Polyurethane Dispersion",
      "PRJ-2026-8492 - High Purity Electronic Grade IPA"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Testing",
        "task": "Residual Monomer GC Method Validation",
        "hours": 6,
        "description": "Headspace GC-FID determination of BA and MMA"
      },
      {
        "project": "2026/CHM/001 - Waterborne Polyurethane Dispersion",
        "module": "Testing",
        "task": "Free Isocyanate (NCO) Titration Method",
        "hours": 2.7,
        "description": "Potentiometric back-titration testing"
      },
      {
        "project": "PRJ-2026-8492 - High Purity Electronic Grade IPA",
        "module": "Testing",
        "task": "Trace Metals ICP-MS Profiling",
        "hours": 2,
        "description": "Sub-ppb metals quantification"
      }
    ],
    "approved": 10.7,
    "declined": 0,
    "pending": 0,
    "totalHours": 10.7,
    "hours": 10.7,
    "totalWorkHours": 10.7,
    "loadPercentage": 134
  },
  {
    "name": "Suresh Naidu",
    "workHours": 7.9,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "2026/CHM/001 - Waterborne Polyurethane Dispersion",
      "PRJ-2026-8492 - High Purity Electronic Grade IPA"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Pilot Batches",
        "task": "2 L Reactor Batch Charging & Reaction Monitoring",
        "hours": 4.5,
        "description": "DCS recipe execution and monomer addition"
      },
      {
        "project": "2026/CHM/001 - Waterborne Polyurethane Dispersion",
        "module": "Pilot Batches",
        "task": "Reactor Clean-in-Place (CIP) Validation",
        "hours": 2,
        "description": "Solvent wash cycle testing"
      },
      {
        "project": "PRJ-2026-8492 - High Purity Electronic Grade IPA",
        "module": "Plant Trial",
        "task": "Distillation Column Pre-Heating & Equilibrium",
        "hours": 1.4,
        "description": "Temperature profile stabilization"
      }
    ],
    "approved": 0,
    "declined": 0,
    "pending": 7.9,
    "totalHours": 7.9,
    "hours": 7.9,
    "totalWorkHours": 7.9,
    "loadPercentage": 99
  },
  {
    "name": "Arun Joseph",
    "workHours": 7.9,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "PRJ-2026-8492 - High Purity Electronic Grade IPA",
      "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Process Safety",
        "task": "Reaction Calorimetry (RC1) Heat Transfer Analysis",
        "hours": 4.5,
        "description": "Peak exotherm and adiabatic runaway risk modeling"
      },
      {
        "project": "PRJ-2026-8492 - High Purity Electronic Grade IPA",
        "module": "Process Safety",
        "task": "Flammable Solvent Vent & Scrubber Sizing",
        "hours": 2,
        "description": "Explosion relief vent calculation"
      },
      {
        "project": "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin",
        "module": "Process Safety",
        "task": "Polymerization Autoclave Rupture Disc Verification",
        "hours": 1.4,
        "description": "Overpressure relief sizing"
      }
    ],
    "approved": 7.9,
    "declined": 0,
    "pending": 0,
    "totalHours": 7.9,
    "hours": 7.9,
    "totalWorkHours": 7.9,
    "loadPercentage": 99
  },
  {
    "name": "Lakshmi Devi",
    "workHours": 7.9,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "2026/CHM/001 - Waterborne Polyurethane Dispersion",
      "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin"
    ],
    "tasks": "7/7",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Quality Assurance",
        "task": "IPQA Sampling Protocol & CoA Generation",
        "hours": 4.5,
        "description": "In-process quality assurance testing"
      },
      {
        "project": "2026/CHM/001 - Waterborne Polyurethane Dispersion",
        "module": "Quality Assurance",
        "task": "Specification Review & Release Sign-Off",
        "hours": 2,
        "description": "CoA verification"
      },
      {
        "project": "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin",
        "module": "Quality Assurance",
        "task": "Tensile Strength Testing Documentation",
        "hours": 1.4,
        "description": "Inspection report sign-off"
      }
    ],
    "approved": 0,
    "declined": 7.9,
    "pending": 0,
    "totalHours": 7.9,
    "hours": 7.9,
    "totalWorkHours": 7.9,
    "loadPercentage": 99
  },
  {
    "name": "Deepa Nair",
    "workHours": 8,
    "projectsCount": 3,
    "projects": [
      "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
      "2026/CHM/001 - Waterborne Polyurethane Dispersion",
      "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin"
    ],
    "tasks": "6/6",
    "tasksList": [
      {
        "project": "2026/CHM/006 - Acrylic Emulsion Binder 50% Solids",
        "module": "Polymer Science",
        "task": "Emulsion Particle Morphology & Core-Shell Design",
        "hours": 5.5,
        "description": "TEM/DLS particle size control"
      },
      {
        "project": "2026/CHM/001 - Waterborne Polyurethane Dispersion",
        "module": "Polymer Science",
        "task": "Hard-Segment / Soft-Segment Ratio Modeling",
        "hours": 3,
        "description": "DSC glass transition optimization"
      },
      {
        "project": "PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin",
        "module": "Polymer Science",
        "task": "Solid-State Polymerization (SSP) MW Growth",
        "hours": 2,
        "description": "Intrinsic viscosity testing"
      }
    ],
    "approved": 10.5,
    "declined": 0,
    "pending": 0,
    "totalHours": 10.5,
    "hours": 10.5,
    "totalWorkHours": 10.5,
    "loadPercentage": 131
  }
];

  entries: HourEntry[] = [];

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

    this.initEntries();
    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2); // June 2nd, 2026
    const defaultDay =
      this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault)) ??
      this.calendarDays.find(d => d.inCurrentMonth)!;

    if (defaultDay) {
      this.filterByDate(defaultDay);
    }
  }

  initEntries(): void {
    if (this.entries.length === 0) {
      this.entries = this.generateAllocationEntriesForMonth(2026, 5); // June 2026
    }
  }

  ensureEntriesForMonth(year: number, month: number): void {
    const hasEntriesForMonth = this.entries.some(
      e => e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month
    );
    if (!hasEntriesForMonth) {
      const newEntries = this.generateAllocationEntriesForMonth(year, month);
      this.entries.push(...newEntries);
    }
  }

  generateAllocationEntriesForMonth(year: number, month: number): HourEntry[] {
    const entries: HourEntry[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      for (let i = 0; i < this.allocationTemplates.length; i++) {
        const t = this.allocationTemplates[i];

        let defaultMessages: HourMessage[] = [];
        if (t.name === 'Rajesh Kumar') {
          defaultMessages = [
            { sender: 'Rajesh Kumar', date: '2026-06-02', text: 'Submitted allocation hours for monomer conversion and reference grade assessment.' },
            { sender: 'Project Lead', date: '2026-06-03', text: 'Approved 16 hours. 4 hours pending review.' }
          ];
        } else if (t.name === 'Anita Desai') {
          defaultMessages = [
            { sender: 'Anita Desai', date: '2026-06-02', text: 'Compatibility screening trial completed on schedule.' }
          ];
        } else if (t.name === 'Sunita Rao') {
          defaultMessages = [
            { sender: 'Sunita Rao', date: '2026-06-02', text: 'Solids content and viscosity testing hours logged for review.' }
          ];
        } else if (t.name === 'Harish Iyer') {
          defaultMessages = [
            { sender: 'Harish Iyer', date: '2026-06-02', text: 'Pilot scale manufacturing hours submitted.' }
          ];
        }

        entries.push({
          id: `${year}-${month + 1}-${day}-${i + 1}`,
          jobCode: `JB-${year}${month + 1}${day}-${i + 1}`,
          dateObj: dateObj,
          name: t.name,
          workHours: t.workHours,
          projectsCount: t.projectsCount,
          projects: [...(t.projects || [])],
          tasks: t.tasks,
          tasksList: t.tasksList.map(item => ({ ...item })),
          approved: t.approved,
          declined: t.declined,
          pending: t.pending,
          totalHours: t.totalHours,
          hours: t.hours,
          totalWorkHours: t.totalWorkHours,
          loadPercentage: t.loadPercentage,
          messages: defaultMessages
        });
      }
    }
    return entries;
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.ensureEntriesForMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.ensureEntriesForMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.ensureEntriesForMonth(year, month);
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
        claims: inCurrentMonth ? this.getDummyCalendarClaims(cellDate) : 0
      });
    }
    this.calendarDays = days;
  }

  getDummyCalendarClaims(date: Date): number {
    const d = date.getDate();
    const m = date.getMonth();
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ((d * 3 + m * 5) % 4) + 2;
    }
    const variations = [8, 12, 7, 14, 9, 11, 15, 6, 13, 10, 8, 16, 7, 12, 9, 14, 11, 8, 15, 10, 6, 13, 12, 7, 14, 9, 11, 8, 15, 10, 12];
    return variations[(d + m * 3) % variations.length];
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

  getTaskFraction(entry: HourEntry): string {
    if (entry.tasks && entry.tasks.includes('/')) {
      const parts = entry.tasks.split('/');
      const num = parseInt(parts[0], 10);
      const den = parseInt(parts[1], 10);
      if (!isNaN(num) && !isNaN(den) && den > 0) {
        return num <= den ? `${num}/${den}` : `${den}/${num}`;
      }
      return entry.tasks;
    }
    const numerator = entry.tasksList ? entry.tasksList.length : 1;
    const denominator = Math.max(numerator, numerator + 2);
    return `${numerator}/${denominator}`;
  }

  openProjectsDialog(entry: HourEntry): void {
    const rawList = entry.projects && entry.projects.length > 0 ? entry.projects : this.defaultAllocationProjects;
    const projectsList = rawList.map((p: string, idx: number) => {
      const parts = p.split(' - ');
      return {
        sNo: idx + 1,
        projectCode: parts[0] || p,
        projectName: parts[1] || p
      };
    });
    this.dialog.open(HoursProjectPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: {
        projects: projectsList,
        entry
      }
    });
  }

  openTasks(entry: HourEntry): void {
    const formattedDate = entry.dateObj ? this.formatDate(entry.dateObj) : (this.selectedDate ? this.formatDate(this.selectedDate) : '06-02-26');
    this.router.navigate(['/projects/dashboard/hours/tasks'], {
      queryParams: {
        resource: entry.name,
        date: formattedDate,
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  openTasksDialog(entry: HourEntry): void {
    this.openTasks(entry);
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
      sender: 'Project Reviewer',
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
          project: r.project || '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
          module: r.module || 'General',
          task: r.task || 'Task Log',
          hours: Number(r.hours) || 0,
          description: r.description || ''
        }));
        const total = tasks.reduce((sum, t) => sum + t.hours, 0);

        const newEntry: HourEntry = {
          dateObj: result.dateObj || (this.selectedDate || new Date(2026, 5, 2)),
          id: `new-${Date.now()}`,
          jobCode: 'JB-' + (200 + this.entries.length + 1),
          name: result.name || 'Anonymous',
          workHours: 8.0,
          projectsCount: tasks.length > 0 ? Array.from(new Set(tasks.map(t => t.project))).length : 1,
          projects: tasks.map(t => t.project || '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids'),
          tasks: `${tasks.length}/${tasks.length}`,
          tasksList: tasks.length > 0 ? tasks : [
            {
              project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
              module: 'General',
              task: 'Task Log',
              hours: 1,
              description: 'General work'
            }
          ],
          totalHours: total > 0 ? total : 1,
          hours: total > 0 ? total : 1,
          totalWorkHours: total > 0 ? total : 1,
          approved: 0,
          declined: 0,
          pending: total > 0 ? total : 1,
          loadPercentage: Math.round(((total > 0 ? total : 1) / 8.0) * 100),
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
        project: entry.projects && entry.projects.length > 0 ? entry.projects[0] : '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        entry.dateObj = result.dateObj;
        entry.name = result.name;
        if (result.rows && result.rows.length > 0) {
          entry.tasksList = result.rows.map((r: any) => ({
            project: r.project || '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
            module: r.module || 'General',
            task: r.task || 'Task Log',
            hours: Number(r.hours) || 0,
            description: r.description || ''
          }));
          entry.totalHours = entry.tasksList.reduce((sum, t) => sum + t.hours, 0);
          entry.projects = Array.from(new Set(entry.tasksList.map(t => t.project || '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids')));
          entry.projectsCount = entry.projects.length;
          entry.loadPercentage = Math.round((entry.totalHours / (entry.workHours || 8.0)) * 100);
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
        content: 'Are you sure you want to delete this resource entry?'
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

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/CHM/006", name: this.projectName || "Acrylic Emulsion Binder 50% Solids" }
    });
  }
}
