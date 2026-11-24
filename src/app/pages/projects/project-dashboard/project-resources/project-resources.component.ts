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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { HoursProjectPopComponent } from '../../../hours/hours-project-pop/hours-project-pop.component';
import { DEFAULT_RESOURCES } from '../../../resources/resources.component';

export interface ResourceItem {
  code: string;
  name: string;
  selected: boolean;
}

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
  slots: number;
  approved: number;
  declined: number;
  pending: number;
  availability: number | string;
  allocation: number | string;
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
  selector: 'app-project-resources',
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
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './project-resources.component.html',
  styleUrl: './project-resources.component.scss'
})
export class ProjectResourcesComponent implements OnInit {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

  activeTab: 'Scheduling' | 'Allocation' = 'Scheduling';
  isTemplate: boolean = false;
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  // Calendar State
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;
  calendarDays: CalendarDay[] = [];

  // Resource Schedule Grid Entries
  entries: ResourceScheduleEntry[] = [];
  filteredEntries: ResourceScheduleEntry[] = [];
  paginatedEntries: ResourceScheduleEntry[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20, 30];

  // Allocation Tab State
  availableResources: ResourceItem[] = [];
  allocatedResources: ResourceItem[] = [];

  // Refer the Resource names directly from ResourcesComponent (DEFAULT_RESOURCES)
  readonly scheduleTemplates: Array<{
    name: string;
    projectsCount: number;
    projects: string[];
    slots: number;
    approved: number;
    declined: number;
    pending: number;
    availability: number;
    allocation: number;
    load: number;
  }> = DEFAULT_RESOURCES.map((res, index) => {
    const metrics = [
      {
        projectsCount: 3,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/002: Waterborne Polyurethane Dispersion'],
        slots: 4,
        approved: 2,
        declined: 0,
        pending: 2,
        availability: 8.0,
        allocation: 6.5,
        load: 81
      },
      {
        projectsCount: 2,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA'],
        slots: 3,
        approved: 2,
        declined: 0,
        pending: 1,
        availability: 8.0,
        allocation: 7.0,
        load: 88
      },
      {
        projectsCount: 2,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Water-Dispersible Granule (WDG) Formulation'],
        slots: 4,
        approved: 3,
        declined: 1,
        pending: 0,
        availability: 8.0,
        allocation: 8.0,
        load: 100
      },
      {
        projectsCount: 3,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/010: Hydrogen Peroxide 50% w/w (Anthraquinone)'],
        slots: 5,
        approved: 3,
        declined: 0,
        pending: 2,
        availability: 8.0,
        allocation: 8.5,
        load: 106
      },
      {
        projectsCount: 4,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: Solvent Recovery & Fractional Distillation Process', '2026/CHM/007: Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)'],
        slots: 6,
        approved: 4,
        declined: 0,
        pending: 2,
        availability: 8.0,
        allocation: 9.0,
        load: 112
      },
      {
        projectsCount: 3,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/002: Waterborne Polyurethane Dispersion', '2026/CHM/007: Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)'],
        slots: 4,
        approved: 3,
        declined: 0,
        pending: 1,
        availability: 8.0,
        allocation: 7.5,
        load: 94
      },
      {
        projectsCount: 2,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/008: Sodium Lauryl Ether Sulfate (SLES) 70% Paste'],
        slots: 4,
        approved: 4,
        declined: 0,
        pending: 0,
        availability: 8.0,
        allocation: 8.0,
        load: 100
      },
      {
        projectsCount: 3,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: Electronic Grade IPA', '2026/CHM/009: Fumed Silica (Hydrophilic, 200 m²/g)'],
        slots: 3,
        approved: 2,
        declined: 1,
        pending: 0,
        availability: 8.0,
        allocation: 6.0,
        load: 75
      },
      {
        projectsCount: 3,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Metformin'],
        slots: 5,
        approved: 3,
        declined: 0,
        pending: 2,
        availability: 8.0,
        allocation: 8.0,
        load: 100
      },
      {
        projectsCount: 2,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: Cabozantinib Tablets'],
        slots: 4,
        approved: 2,
        declined: 0,
        pending: 2,
        availability: 8.0,
        allocation: 7.0,
        load: 88
      },
      {
        projectsCount: 2,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/006: Empagliflozin Tablets'],
        slots: 3,
        approved: 2,
        declined: 0,
        pending: 1,
        availability: 8.0,
        allocation: 6.5,
        load: 81
      },
      {
        projectsCount: 3,
        projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/007: Fluoropolymer', '2026/CHM/010: Olaparib Tablets'],
        slots: 4,
        approved: 3,
        declined: 0,
        pending: 1,
        availability: 8.0,
        allocation: 8.0,
        load: 100
      }
    ];

    const m = metrics[index % metrics.length];
    return {
      name: res.resource,
      projectsCount: m.projectsCount,
      projects: m.projects,
      slots: m.slots,
      approved: m.approved,
      declined: m.declined,
      pending: m.pending,
      availability: m.availability,
      allocation: m.allocation,
      load: m.load
    };
  });

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isTemplate = params['isTemplate'] === 'true' || params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' || params['fromTemplate'] === true;
      if (this.isTemplate) {
        this.activeTab = 'Allocation';
      }
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.initializeAllocationData();
    this.initEntries();
    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2); // June 2nd, 2026
    const defaultDay =
      this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault)) ??
      this.calendarDays.find(d => d.inCurrentMonth);

    if (defaultDay) {
      this.filterByDate(defaultDay);
    }
  }

  setTab(tab: 'Scheduling' | 'Allocation'): void {
    this.activeTab = tab;
  }

  // ============ CALENDAR & ENTRIES LOGIC ============
  initEntries(): void {
    if (this.entries.length === 0) {
      this.entries = this.generateEntriesForMonth(2026, 5); // June 2026
    }
  }

  ensureEntriesForMonth(year: number, month: number): void {
    const hasEntries = this.entries.some(
      e => e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month
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
      const dayOfWeek = dateObj.getDay();

      // Vary the number of scheduled resources per day so the calendar doesn't show a monotonous static number
      let countForDay: number;
      if (dayOfWeek === 0) {
        countForDay = (day % 2 === 0) ? 2 : 1;
      } else if (dayOfWeek === 6) {
        countForDay = (day % 2 === 0) ? 4 : 3;
      } else if (dayOfWeek === 2) {
        // Tuesdays (including June 2nd, the active calendar selection)
        countForDay = 10;
      } else if (dayOfWeek === 1) {
        countForDay = (day % 3 === 0) ? 9 : 8;
      } else if (dayOfWeek === 3) {
        countForDay = (day % 2 === 0) ? 8 : 7;
      } else if (dayOfWeek === 4) {
        countForDay = (day % 2 === 0) ? 9 : 6;
      } else {
        countForDay = (day % 2 === 0) ? 8 : 7;
      }

      countForDay = Math.min(countForDay, this.scheduleTemplates.length);

      for (let i = 0; i < countForDay; i++) {
        const t = this.scheduleTemplates[i];

        let defaultMessages: ResourceMessage[] = [];
        if (t.name === 'Gas Chromatograph A') {
          defaultMessages = [
            { sender: 'Gas Chromatograph A Operator', date: '2026-06-02', text: 'Calibrated and scheduled for Feasibility / API Assessment runs.' },
            { sender: 'Project Lead', date: '2026-06-03', text: 'Approved 2 slots. 2 slots pending review.' }
          ];
        } else if (t.name === 'Anita Desai') {
          defaultMessages = [
            { sender: 'Anita Desai', date: '2026-06-02', text: 'Slots aligned with Formulation Development & trial batching.' }
          ];
        } else if (t.name === 'Jacketed Reactor B') {
          defaultMessages = [
            { sender: 'Jacketed Reactor B Operator', date: '2026-06-02', text: 'Granulation & process optimization slots booked.' }
          ];
        } else if (t.name === 'Amit Patel') {
          defaultMessages = [
            { sender: 'Amit Patel', date: '2026-06-02', text: 'Testing & analytical method validation slots reserved.' }
          ];
        } else if (t.name === 'HPLC System Agilent 1260') {
          defaultMessages = [
            { sender: 'Lab In-charge', date: '2026-06-02', text: 'System suitability verified. Ready for assay sequence.' }
          ];
        } else if (t.name === 'Dr. Rajesh Sharma') {
          defaultMessages = [
            { sender: 'Dr. Rajesh Sharma', date: '2026-06-02', text: 'DoE factorial runs scheduled for pilot formulation batch.' }
          ];
        } else if (t.name === 'Stability Chamber SC-01') {
          defaultMessages = [
            { sender: 'QA Team', date: '2026-06-02', text: 'Temperature and RH within 40°C ± 2°C / 75% ± 5% RH.' }
          ];
        } else if (t.name === 'Priya Nair') {
          defaultMessages = [
            { sender: 'Priya Nair', date: '2026-06-02', text: 'Dissolution testing protocol approved.' }
          ];
        } else {
          defaultMessages = [
            { sender: t.name, date: '2026-06-02', text: 'Resource slot schedule confirmed and active.' }
          ];
        }

        entries.push({
          id: `${year}-${month + 1}-${day}-${i + 1}`,
          name: t.name,
          dateObj: dateObj,
          projectsCount: t.projectsCount,
          projects: [...t.projects],
          slots: t.slots,
          approved: t.approved,
          declined: t.declined,
          pending: t.pending,
          availability: t.availability,
          allocation: t.allocation,
          load: t.load,
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
    this.calendarDays.forEach(d => {
      d.isSelected = this.isSameDay(d.date, day.date);
    });

    this.filteredEntries = this.entries.filter(e => this.isSameDay(e.dateObj, day.date));
    this.currentPage = 1;
    this.updatePaginatedEntries();
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

  // ============ NAVIGATION TO INNER SLOTS SCREEN ============
  openSlots(entry: ResourceScheduleEntry): void {
    const formattedDate = entry.dateObj ? this.formatDate(entry.dateObj) : (this.selectedDate ? this.formatDate(this.selectedDate) : '06-02-26');
    this.router.navigate(['/projects/dashboard/resources/slots'], {
      queryParams: {
        resource: entry.name,
        date: formattedDate,
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  // ============ POPUP DIALOGS ============
  openProjectsDialog(entry: ResourceScheduleEntry): void {
    const projectsList = (entry.projects || []).map((p, idx) => {
      const parts = p.split(': ');
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

  openMessagesDialog(entry: ResourceScheduleEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '550px',
      maxWidth: '95vw',
      data: entry
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
      text: text.trim()
    });
  }

  // ============ ALLOCATION TAB METHODS ============
  initializeAllocationData(): void {
    this.availableResources = [
      { code: 'RES001', name: 'Gas Chromatograph A', selected: false },
      { code: 'RES002', name: 'Anita Desai', selected: false },
      { code: 'RES003', name: 'Jacketed Reactor B', selected: false },
      { code: 'RES004', name: 'Amit Patel', selected: false },
      { code: 'RES005', name: 'HPLC System Agilent 1260', selected: false },
      { code: 'RES006', name: 'Dr. Rajesh Sharma', selected: false },
      { code: 'RES007', name: 'Stability Chamber SC-01', selected: false },
      { code: 'RES008', name: 'Priya Nair', selected: false },
      { code: 'RES009', name: 'Dissolution Apparatus DT-800', selected: false },
      { code: 'RES010', name: 'Vikram Malhotra', selected: false },
      { code: 'RES011', name: 'Fluid Bed Dryer FBD-10', selected: false },
      { code: 'RES012', name: 'Sneha Reddy', selected: false }
    ];

    this.allocatedResources = [
      { code: 'RES013', name: 'Tablet Compression Press TCP-200', selected: false },
      { code: 'RES014', name: 'Rahul Verma', selected: false },
      { code: 'RES015', name: 'DSC Thermal Analyzer 4000', selected: false },
      { code: 'RES016', name: 'Sunita Rao', selected: false },
      { code: 'RES017', name: 'Autoclave Unit AC-2', selected: false },
      { code: 'RES018', name: 'Manoj Tiwari', selected: false },
      { code: 'RES019', name: 'FTIR Spectrometer IR-6300', selected: false },
      { code: 'RES020', name: 'Deepa Nair', selected: false }
    ];
  }

  toggleAvailableSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  toggleAllocatedSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  allocateResources(): void {
    const selected = this.availableResources.filter(r => r.selected);
    this.allocatedResources.push(...selected);
    this.availableResources = this.availableResources.filter(r => !r.selected);
    this.allocatedResources.forEach(r => r.selected = false);
  }

  deallocateResources(): void {
    const selected = this.allocatedResources.filter(r => r.selected);
    this.availableResources.push(...selected);
    this.allocatedResources = this.allocatedResources.filter(r => !r.selected);
    this.availableResources.forEach(r => r.selected = false);
  }

  canAllocate(): boolean {
    return this.availableResources.some(r => r.selected);
  }

  canDeallocate(): boolean {
    return this.allocatedResources.some(r => r.selected);
  }

  openAddResourceDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newRes: ResourceItem = {
          code: result.code,
          name: result.name || result.resource,
          selected: false
        };
        this.availableResources.push(newRes);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/CHM/006', name: this.projectName || 'Acrylic Emulsion Binder 50% Solids' }
    });
  }
}
