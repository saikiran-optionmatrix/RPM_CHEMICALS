import { Component, OnInit, ViewChild, ElementRef, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HoursProjectPopComponent } from '../hours-project-pop/hours-project-pop.component';
import { DEFAULT_RESOURCES } from '../../resources/resources.component';

export interface ResourceMessage {
  sender: string;
  date: string;
  text: string;
}

export interface ResourceScheduleEntry {
  id?: string | number;
  name: string;
  dateObj: Date;
  projectsCount: number;
  projects?: string[];
  tasks?: string;
  tasksList?: any[];
  slots: number;
  approved: number;
  declined: number;
  pending: number;
  workHours: number;
  totalHours: number;
  loadPercentage: number;
  availability: number;
  allocation: number;
  load: number;
  messages?: ResourceMessage[];
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
  selector: 'app-hours-timesheets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './hours-timesheets.component.html',
  styleUrl: './hours-timesheets.component.scss',
})
export class HoursTimesheetsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  showFilter: boolean = false;
  filterDepartment: string = '';
  filterSection: string = '';
  filterProject: string = '';
  filterOverload: boolean = false;

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    // UI static version as requested
  }

  onClear(): void {
    this.filterDepartment = '';
    this.filterSection = '';
    this.filterProject = '';
    this.filterOverload = false;
  }

  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Hours - Timesheets';

  // Calendar State
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;
  calendarDays: CalendarDay[] = [];

  // Resource Schedule Grid Entries
  entries: ResourceScheduleEntry[] = [];
  filteredEntries: ResourceScheduleEntry[] = [];
  paginatedEntries: ResourceScheduleEntry[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];

  // Schedule templates matching Project Hours grid
  readonly scheduleTemplates: Array<{
    name: string;
    projectsCount: number;
    projects: string[];
    tasks: string;
    slots: number;
    approved: number;
    declined: number;
    pending: number;
    workHours: number;
    totalHours: number;
    loadPercentage: number;
    availability: number;
    allocation: number;
    load: number;
  }> = [
    {
      name: 'Rajesh Kumar',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Waterborne Polyurethane Dispersion', '2026/CHM/002: Bio-based Epoxy Crosslinker'],
      tasks: '4/4',
      slots: 4,
      approved: 16.0,
      declined: 0.0,
      pending: 4.0,
      workHours: 8.0,
      totalHours: 20.0,
      loadPercentage: 250,
      availability: 8.0,
      allocation: 20.0,
      load: 250,
    },
    {
      name: 'Anita Desai',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA'],
      tasks: '2/3',
      slots: 3,
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      workHours: 8.0,
      totalHours: 7.5,
      loadPercentage: 94,
      availability: 8.0,
      allocation: 7.5,
      load: 94,
    },
    {
      name: 'Amit Patel',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Waterborne Polyurethane Dispersion', '2026/CHM/010: Ethylene Vinyl Acetate Emulsion'],
      tasks: '3/4',
      slots: 4,
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      workHours: 8.0,
      totalHours: 8.0,
      loadPercentage: 100,
      availability: 8.0,
      allocation: 8.0,
      load: 100,
    },
    {
      name: 'Neha Sharma',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: High Performance Epoxy Coating'],
      tasks: '2/3',
      slots: 3,
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      workHours: 8.0,
      totalHours: 7.5,
      loadPercentage: 94,
      availability: 8.0,
      allocation: 7.5,
      load: 94,
    },
    {
      name: 'Vikram Malhotra',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA', '2026/CHM/005: Polyamide 66 High-Tenacity Resin'],
      tasks: '3/3',
      slots: 4,
      approved: 12.0,
      declined: 0.0,
      pending: 2.0,
      workHours: 8.0,
      totalHours: 14.0,
      loadPercentage: 175,
      availability: 8.0,
      allocation: 14.0,
      load: 175,
    },
    {
      name: 'Sunita Rao',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: High Performance Epoxy Coating', '2026/CHM/008: UV Curable Oligomer Resin'],
      tasks: '3/3',
      slots: 3,
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      workHours: 8.0,
      totalHours: 16.0,
      loadPercentage: 200,
      availability: 8.0,
      allocation: 16.0,
      load: 200,
    },
    {
      name: 'Deepak Verma',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: High Performance Epoxy Coating', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      tasks: '3/3',
      slots: 4,
      approved: 8.0,
      declined: 0.0,
      pending: 4.0,
      workHours: 8.0,
      totalHours: 12.0,
      loadPercentage: 150,
      availability: 8.0,
      allocation: 12.0,
      load: 150,
    },
    {
      name: 'Priya Sharma',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Waterborne Polyurethane Dispersion'],
      tasks: '2/2',
      slots: 2,
      approved: 6.0,
      declined: 0.0,
      pending: 2.0,
      workHours: 8.0,
      totalHours: 8.0,
      loadPercentage: 100,
      availability: 8.0,
      allocation: 8.0,
      load: 100,
    },
    {
      name: 'Kavita Patel',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      tasks: '2/3',
      slots: 3,
      approved: 7.0,
      declined: 0.0,
      pending: 0.0,
      workHours: 8.0,
      totalHours: 7.0,
      loadPercentage: 88,
      availability: 8.0,
      allocation: 7.0,
      load: 88,
    },
    {
      name: 'Gas Chromatograph A',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Waterborne Polyurethane Dispersion', '2026/CHM/002: Bio-based Epoxy Crosslinker'],
      tasks: '4/4',
      slots: 4,
      approved: 6.5,
      declined: 0.0,
      pending: 0.0,
      workHours: 8.0,
      totalHours: 6.5,
      loadPercentage: 81,
      availability: 8.0,
      allocation: 6.5,
      load: 81,
    },
    {
      name: 'Jacketed Reactor B',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Polyamide 66 High-Tenacity Resin'],
      tasks: '3/4',
      slots: 4,
      approved: 6.0,
      declined: 2.0,
      pending: 0.0,
      workHours: 8.0,
      totalHours: 8.0,
      loadPercentage: 100,
      availability: 8.0,
      allocation: 8.0,
      load: 100,
    },
    {
      name: 'Rohan Mehta',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Polyamide 66 High-Tenacity Resin', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      tasks: '3/3',
      slots: 3,
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      workHours: 8.0,
      totalHours: 16.0,
      loadPercentage: 200,
      availability: 8.0,
      allocation: 16.0,
      load: 200,
    },
  ];

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (params['name'] || params['projectName']) {
        this.projectName = params['name'] || params['projectName'];
      }
      if (params['code'] || params['projectCode']) {
        this.projectCode = params['code'] || params['projectCode'];
      }
      if (this.projectName && this.projectCode) {
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      }
    });
  }

  ngOnInit(): void {
    this.initEntries();
    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2); // June 2nd, 2026
    const defaultDay =
      this.calendarDays.find((d) => d.inCurrentMonth && this.isSameDay(d.date, targetDefault)) ??
      this.calendarDays.find((d) => d.inCurrentMonth);

    if (defaultDay) {
      this.filterByDate(defaultDay);
    }
  }

  // ============ CALENDAR & ENTRIES LOGIC ============
  initEntries(): void {
    if (this.entries.length === 0) {
      this.entries = this.generateEntriesForMonth(2026, 5); // June 2026
    }
  }

  ensureEntriesForMonth(year: number, month: number): void {
    const hasEntries = this.entries.some(
      (e) => e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month
    );
    if (!hasEntries) {
      const newEntries = this.generateEntriesForMonth(year, month);
      this.entries.push(...newEntries);
    }
  }

  generateEntriesForMonth(year: number, month: number): ResourceScheduleEntry[] {
    const entries: ResourceScheduleEntry[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      for (let i = 0; i < this.scheduleTemplates.length; i++) {
        const t = this.scheduleTemplates[i];

        let defaultMessages: ResourceMessage[] = [];
        if (t.name === 'Gas Chromatograph A') {
          defaultMessages = [
            { sender: 'Gas Chromatograph A Operator', date: '2026-06-02', text: 'Calibrated and scheduled for Monomer Conversion & Residual VOC assay runs.' },
            { sender: 'Project Lead', date: '2026-06-03', text: 'Approved 2 slots. 2 slots pending review.' },
          ];
        } else if (t.name === 'Anita Desai') {
          defaultMessages = [
            { sender: 'Anita Desai', date: '2026-06-02', text: 'Slots aligned with Pre-Emulsion compounding & surfactant screening in lab reactor.' },
          ];
        } else if (t.name === 'Jacketed Reactor B') {
          defaultMessages = [
            { sender: 'Jacketed Reactor B Operator', date: '2026-06-02', text: 'Emulsion polymerization reaction calorimetry & scale-up slots booked.' },
          ];
        } else if (t.name === 'Amit Patel') {
          defaultMessages = [
            { sender: 'Amit Patel', date: '2026-06-02', text: 'Testing & polymer GPC / FTIR analytical method validation slots reserved.' },
          ];
        } else if (t.name === 'Rajesh Kumar') {
          defaultMessages = [
            { sender: 'Rajesh Kumar', date: '2026-06-02', text: 'Physicochemical solids % and particle sizing slots reserved for pilot trial run.' },
          ];
        } else {
          defaultMessages = [
            { sender: t.name, date: '2026-06-02', text: 'Chemical slot schedule submitted for review.' },
          ];
        }
        entries.push({
          id: `${year}-${month + 1}-${day}-${i + 1}`,
          name: t.name,
          dateObj: dateObj,
          projectsCount: t.projectsCount,
          projects: [...t.projects],
          tasks: t.tasks,
          slots: t.slots,
          approved: t.approved,
          declined: t.declined,
          pending: t.pending,
          workHours: t.workHours,
          totalHours: t.totalHours,
          loadPercentage: t.loadPercentage,
          availability: t.availability,
          allocation: t.allocation,
          load: t.load,
          messages: defaultMessages,
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
        claims: inCurrentMonth ? this.getDummyCalendarClaims(cellDate) : 0,
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
    this.calendarDays.forEach((d) => {
      d.isSelected = this.isSameDay(d.date, day.date);
    });

    this.filteredEntries = this.entries.filter((e) => this.isSameDay(e.dateObj, day.date));
    this.currentPage = 1;
    this.updatePaginatedEntries();
  }

  get totalClaimsInRange(): number {
    return this.calendarDays.filter((d) => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
  }

  formatDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePaginatedEntries();
  }

  updatePaginatedEntries(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedEntries = this.filteredEntries.slice(startIndex, startIndex + this.pageSize);
  }

  getResourceIcon(name: string): string {
    if (!name) return 'person';
    const lower = name.toLowerCase();
    if (lower.includes('reactor') || lower.includes('chromatograph') || lower.includes('analyzer') || lower.includes('titrator') || lower.includes('hood') || lower.includes('machine') || lower.includes('equipment')) {
      return 'precision_manufacturing';
    }
    return 'person';
  }

  getTaskFraction(entry: ResourceScheduleEntry): string {
    if (entry.tasks && entry.tasks.includes('/')) {
      const parts = entry.tasks.split('/');
      const num = parseInt(parts[0], 10);
      const den = parseInt(parts[1], 10);
      if (!isNaN(num) && !isNaN(den) && den > 0) {
        return num <= den ? `${num}/${den}` : `${den}/${num}`;
      }
      return entry.tasks;
    }
    const num = entry.slots || 4;
    return `${num}/${num}`;
  }

  // ============ NAVIGATION TO INNER TASKS / SLOTS SCREEN ============
  openTasks(entry: ResourceScheduleEntry): void {
    const formattedDate = entry.dateObj ? this.formatDate(entry.dateObj) : (this.selectedDate ? this.formatDate(this.selectedDate) : '06-02-26');
    this.router.navigate(['/hours/timesheets/slots'], {
      queryParams: {
        resource: entry.name,
        date: formattedDate,
        projectName: this.projectName,
        projectCode: this.projectCode,
      },
    });
  }

  openSlots(entry: ResourceScheduleEntry): void {
    this.openTasks(entry);
  }

  // ============ POPUP DIALOGS ============
  openProjectsDialog(entry: ResourceScheduleEntry): void {
    const projectsList = (entry.projects || []).map((p, idx) => {
      const parts = p.split(': ');
      return {
        sNo: idx + 1,
        projectCode: parts[0] || p,
        projectName: parts[1] || p,
      };
    });
    this.dialog.open(HoursProjectPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: {
        projects: projectsList,
        entry,
      },
    });
  }

  openMessagesDialog(entry: ResourceScheduleEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '550px',
      maxWidth: '95vw',
      data: entry,
    });
  }

  addMessage(entry: ResourceScheduleEntry, text: string): void {
    if (!text || !text.trim()) return;
    if (!entry.messages) {
      entry.messages = [];
    }
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    entry.messages.push({
      sender: 'Current User',
      date: dateStr,
      text: text.trim(),
    });
  }
}
