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
import { MatSelectModule } from '@angular/material/select';
import { HoursProjectPopComponent } from '../hours/hours-project-pop/hours-project-pop.component';
import { AddResourceComponent } from '../projects/project-dashboard/project-resources/add-resource/add-resource.component';

export interface ResourceScheduleItem {
  resource: string;
  initials: string;
  stage: string;
  module: string;
  task: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  planDuration: string;
  actualDuration: string;
  status: string;
  dayPlacement: string;
  color: string;
}

export const DEFAULT_RESOURCES: ResourceScheduleItem[] = [
  {
    "resource": "Gas Chromatograph A (AST-1002)",
    "initials": "GC",
    "stage": "Concept Screening & Feasibility",
    "module": "Reaction Chemistry & Route Screening",
    "task": "Reaction Conversion & Impurity Analysis",
    "fromDate": "2026-01-16",
    "fromTime": "09:00 AM",
    "toDate": "2026-01-20",
    "toTime": "05:00 PM",
    "planDuration": "5 days",
    "actualDuration": "5 days",
    "status": "Completed",
    "dayPlacement": "Monday",
    "color": "#dcfce7"
  },
  {
    "resource": "Anita Desai",
    "initials": "AD",
    "stage": "Route Scouting & Lab Synthesis",
    "module": "Raw Material & Surfactant Characterization",
    "task": "Surfactant Selection & Lab Trials",
    "fromDate": "2026-01-26",
    "fromTime": "09:00 AM",
    "toDate": "2026-02-10",
    "toTime": "05:00 PM",
    "planDuration": "14 days",
    "actualDuration": "12 days",
    "status": "Completed",
    "dayPlacement": "Tuesday",
    "color": "#dcfce7"
  },
  {
    "resource": "Jacketed Reactor B (AST-1001)",
    "initials": "JR",
    "stage": "Process Optimization (Lab Scale)",
    "module": "Recipe Optimization & Feed Profiles",
    "task": "Feed Profile Optimization & Scale-Down Study",
    "fromDate": "2026-02-26",
    "fromTime": "09:00 AM",
    "toDate": "2026-03-15",
    "toTime": "05:00 PM",
    "planDuration": "10 days",
    "actualDuration": "8 days",
    "status": "Active",
    "dayPlacement": "Wednesday",
    "color": "#e0f2fe"
  },
  {
    "resource": "Amit Patel",
    "initials": "AP",
    "stage": "Process Optimization (Lab Scale)",
    "module": "Analytical Method Development",
    "task": "Assay & Viscosity Method Validation",
    "fromDate": "2026-03-16",
    "fromTime": "09:00 AM",
    "toDate": "2026-03-25",
    "toTime": "05:00 PM",
    "planDuration": "10 days",
    "actualDuration": "N/A",
    "status": "Pending",
    "dayPlacement": "Thursday",
    "color": "#ffedd5"
  },
  {
    "resource": "Particle Size Analyzer C (AST-1003)",
    "initials": "PS",
    "stage": "Process Optimization (Lab Scale)",
    "module": "Analytical Method Development",
    "task": "Particle Size Distribution Runs",
    "fromDate": "2026-03-01",
    "fromTime": "08:30 AM",
    "toDate": "2026-03-20",
    "toTime": "05:30 PM",
    "planDuration": "15 days",
    "actualDuration": "10 days",
    "status": "Active",
    "dayPlacement": "Monday",
    "color": "#e0f2fe"
  },
  {
    "resource": "Rajesh Kumar",
    "initials": "RK",
    "stage": "Concept Screening & Feasibility",
    "module": "Process Safety Screening",
    "task": "Thermal Runaway Screening & Reaction Enthalpy",
    "fromDate": "2026-01-18",
    "fromTime": "09:00 AM",
    "toDate": "2026-01-25",
    "toTime": "06:00 PM",
    "planDuration": "7 days",
    "actualDuration": "7 days",
    "status": "Completed",
    "dayPlacement": "Tuesday",
    "color": "#dcfce7"
  },
  {
    "resource": "Walk-in Fume Hood Suite D (AST-1004)",
    "initials": "FH",
    "stage": "Route Scouting & Lab Synthesis",
    "module": "Initiator Screening",
    "task": "Redox Chaser & Initiator Handling",
    "fromDate": "2026-02-01",
    "fromTime": "09:00 AM",
    "toDate": "2026-02-25",
    "toTime": "06:00 PM",
    "planDuration": "24 days",
    "actualDuration": "20 days",
    "status": "Completed",
    "dayPlacement": "Wednesday",
    "color": "#dcfce7"
  },
  {
    "resource": "Priya Reddy",
    "initials": "PR",
    "stage": "Bench-to-Pilot Process Development",
    "module": "Scale-Down Model",
    "task": "Agitation Dynamics & Coagulum Reduction",
    "fromDate": "2026-05-23",
    "fromTime": "09:30 AM",
    "toDate": "2026-06-15",
    "toTime": "05:30 PM",
    "planDuration": "15 days",
    "actualDuration": "N/A",
    "status": "Pending",
    "dayPlacement": "Thursday",
    "color": "#ffedd5"
  },
  {
    "resource": "Agitated Nutsche Filter Dryer E (AST-1005)",
    "initials": "AN",
    "stage": "Bench-to-Pilot Process Development",
    "module": "Downstream Separation",
    "task": "Solid-Liquid Separation & Filtration Trials",
    "fromDate": "2026-06-16",
    "fromTime": "09:00 AM",
    "toDate": "2026-06-25",
    "toTime": "05:00 PM",
    "planDuration": "10 days",
    "actualDuration": "N/A",
    "status": "Pending",
    "dayPlacement": "Friday",
    "color": "#ffedd5"
  },
  {
    "resource": "Vikram Singh",
    "initials": "VS",
    "stage": "Demonstration-Scale Campaign",
    "module": "Demo Batches",
    "task": "Pilot Plant Demonstration Batch Execution (1,000 L)",
    "fromDate": "2026-11-04",
    "fromTime": "09:00 AM",
    "toDate": "2026-11-25",
    "toTime": "06:00 PM",
    "planDuration": "21 days",
    "actualDuration": "N/A",
    "status": "Pending",
    "dayPlacement": "Monday",
    "color": "#ffedd5"
  },
  {
    "resource": "Karl Fischer Titrator F (AST-1006)",
    "initials": "KF",
    "stage": "Process Optimization (Lab Scale)",
    "module": "Analytical Development",
    "task": "Trace Moisture & Solvent Water Content Assay",
    "fromDate": "2026-03-05",
    "fromTime": "10:00 AM",
    "toDate": "2026-03-18",
    "toTime": "04:30 PM",
    "planDuration": "11 days",
    "actualDuration": "8 days",
    "status": "Active",
    "dayPlacement": "Wednesday",
    "color": "#e0f2fe"
  },
  {
    "resource": "Dr. Priya Raman",
    "initials": "DR",
    "stage": "Regulatory & REACH Studies",
    "module": "REACH Dossier",
    "task": "Chemical Safety Report (CSR) & REACH Exposure Scenarios",
    "fromDate": "2026-07-12",
    "fromTime": "09:00 AM",
    "toDate": "2026-08-15",
    "toTime": "05:00 PM",
    "planDuration": "25 days",
    "actualDuration": "N/A",
    "status": "Pending",
    "dayPlacement": "Thursday",
    "color": "#ffedd5"
  }
];

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
  selector: 'app-resources',
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
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

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

  activeTab: 'Scheduling' | 'Allocation' = 'Scheduling';
  isTemplate: boolean = false;
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Resources';

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
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 50];

  // Allocation Tab State
  availableResources: ResourceItem[] = [];
  allocatedResources: ResourceItem[] = [];

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
  }> = [
    {
      name: 'Gas Chromatograph A',
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
      name: 'Anita Desai',
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
      name: 'Jacketed Reactor B',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Metformin Hydrochloride Tablets'],
      slots: 4,
      approved: 3,
      declined: 1,
      pending: 0,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    },
    {
      name: 'Amit Patel',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/010: Olaparib Film Coated Tablets'],
      slots: 5,
      approved: 3,
      declined: 0,
      pending: 2,
      availability: 8.0,
      allocation: 8.5,
      load: 106
    },
    {
      name: 'Rajesh Kumar',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/002: Waterborne Polyurethane Dispersion'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.5,
      load: 94
    },
    {
      name: 'Neha Sengupta',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Polyamide 66 High-Tenacity Resin'],
      slots: 3,
      approved: 2,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.5,
      load: 94
    },
    {
      name: 'Kavita Patel',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      slots: 3,
      approved: 2,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.0,
      load: 88
    },
    {
      name: 'Vikram Malhotra',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA', '2026/CHM/005: Polyamide 66 High-Tenacity Resin'],
      slots: 5,
      approved: 4,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.5,
      load: 106
    },
    {
      name: 'Suresh Raina',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/002: Waterborne Polyurethane Dispersion', '2026/CHM/004: Cabozantinib Tablets'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    },
    {
      name: 'Amit Trivedi',
      projectsCount: 4,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: Cabozantinib Tablets', '2026/CHM/008: Lenvatinib Capsules', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids'],
      slots: 5,
      approved: 4,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 9.0,
      load: 113
    },
    {
      name: 'Priya Sharma',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids'],
      slots: 3,
      approved: 2,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 6.0,
      load: 75
    },
    {
      name: 'Pooja Nair',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    },
    {
      name: 'Deepak Verma',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/006: Empagliflozin Tablets', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.5,
      load: 94
    },
    {
      name: 'Anil Kulkarni',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/006: Empagliflozin Tablets', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      slots: 5,
      approved: 4,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.5,
      load: 106
    },
    {
      name: 'Sunita Rao',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/004: Cabozantinib Tablets', '2026/CHM/008: Lenvatinib Capsules'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    },
    {
      name: 'Rohan Mehta',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Polyamide 66 High-Tenacity Resin', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    },
    {
      name: 'Swati Deshmukh',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA', '2026/CHM/006: Empagliflozin Tablets'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.5,
      load: 94
    },
    {
      name: 'Dissolution Tester USP-II',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/002: Waterborne Polyurethane Dispersion', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      slots: 5,
      approved: 4,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    },
    {
      name: 'HPLC Waters Alliance 01',
      projectsCount: 4,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Polyamide 66 High-Tenacity Resin', '2026/CHM/008: Lenvatinib Capsules'],
      slots: 6,
      approved: 5,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 9.0,
      load: 113
    },
    {
      name: 'Tablet Compression Rotary Press',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/006: Empagliflozin Tablets'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.0,
      load: 88
    },
    {
      name: 'Fluid Bed Coater Glatt',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/005: Polyamide 66 High-Tenacity Resin'],
      slots: 3,
      approved: 2,
      declined: 1,
      pending: 0,
      availability: 8.0,
      allocation: 6.0,
      load: 75
    },
    {
      name: 'Kiran Rao',
      projectsCount: 2,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/002: Waterborne Polyurethane Dispersion'],
      slots: 3,
      approved: 2,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 6.5,
      load: 81
    },
    {
      name: 'Harish Babu',
      projectsCount: 3,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/003: High Purity Electronic Grade IPA', '2026/CHM/004: Cabozantinib Tablets'],
      slots: 4,
      approved: 3,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 7.5,
      load: 94
    },
    {
      name: 'Stability Chamber Caron 01',
      projectsCount: 4,
      projects: ['2026/CHM/006: Acrylic Emulsion Binder 50% Solids', '2026/CHM/001: Acrylic Emulsion Binder 50% Solids', '2026/CHM/006: Empagliflozin Tablets', '2026/CHM/007: Specialty Fluoropolymer Resin'],
      slots: 5,
      approved: 4,
      declined: 0,
      pending: 1,
      availability: 8.0,
      allocation: 8.0,
      load: 100
    }
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
      for (let i = 0; i < this.scheduleTemplates.length; i++) {
        const t = this.scheduleTemplates[i];

        let defaultMessages: ResourceMessage[] = [];
        if (t.name === 'Gas Chromatograph A') {
          defaultMessages = [
            { sender: 'Gas Chromatograph A Operator', date: '2026-06-02', text: 'Calibrated and scheduled for Feasibility / API Assessment runs.' },
            { sender: 'Quality Analyst', date: '2026-06-02', text: 'Standard operating validation completed.' }
          ];
        } else if (t.name === 'Anita Desai') {
          defaultMessages = [
            { sender: 'Team Lead', date: '2026-06-02', text: 'Allocated to Formulation Trials.' }
          ];
        } else if (t.name === 'Rajesh Kumar') {
          defaultMessages = [
            { sender: 'Project Manager', date: '2026-06-02', text: 'Reviewing pilot trial results for batch 004.' }
          ];
        } else if (t.name === 'Vikram Malhotra') {
          defaultMessages = [
            { sender: 'Analytical Lead', date: '2026-06-02', text: 'Dissolution profile comparison completed.' }
          ];
        } else if (t.name === 'Sunita Rao') {
          defaultMessages = [
            { sender: 'Manufacturing Head', date: '2026-06-02', text: 'Scale-up parameter sheet signed off.' }
          ];
        } else if (t.name === 'HPLC Waters Alliance 01') {
          defaultMessages = [
            { sender: 'QC Chemist', date: '2026-06-02', text: 'Column backpressure stabilized after methanol rinse.' },
            { sender: 'System Suitability Admin', date: '2026-06-02', text: '%RSD of replicates is 0.42%, system ready.' }
          ];
        } else if (t.name === 'Tablet Compression Rotary Press') {
          defaultMessages = [
            { sender: 'Production Supervisor', date: '2026-06-02', text: 'Tooling inspection and weight variation test passed.' }
          ];
        } else if (t.name === 'Dissolution Tester USP-II') {
          defaultMessages = [
            { sender: 'Analyst', date: '2026-06-02', text: 'Vessel temperature calibrated to 37.0°C ± 0.5°C.' }
          ];
        }

        entries.push({
          id: `${year}-${month + 1}-${day}-${i}`,
          name: t.name,
          dateObj,
          projectsCount: t.projectsCount,
          projects: t.projects,
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

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.ensureEntriesForMonth(year, month);

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const date = new Date(year, month - 1, d);
      days.push({
        date,
        dayNumber: d,
        inCurrentMonth: false,
        isToday: false,
        isSelected: false,
        claims: 0
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = this.selectedDate ? this.isSameDay(date, this.selectedDate) : false;
      const claims = this.getDummyCalendarClaims(date);

      days.push({
        date,
        dayNumber: day,
        inCurrentMonth: true,
        isToday: this.isSameDay(date, new Date()),
        isSelected,
        claims
      });
    }

    // Next month filler days (grid with 35 or 42 cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: i,
        inCurrentMonth: false,
        isToday: false,
        isSelected: false,
        claims: 0
      });
    }

    this.calendarDays = days;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
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

  isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  filterByDate(day: CalendarDay): void {
    this.calendarDays.forEach(d => (d.isSelected = false));
    day.isSelected = true;
    this.selectedDate = day.date;

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
    this.router.navigate(['/resources/slots'], {
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
      { code: 'RES005', name: 'Jacketed Reactor C', selected: false },
      { code: 'RES006', name: 'Deepa Nair', selected: false },
      { code: 'RES007', name: 'Arun Joseph', selected: false },
      { code: 'RES008', name: 'Lakshmi Devi', selected: false }
    ];

    this.allocatedResources = [
      { code: 'RES009', name: 'Vikram Singh', selected: false },
      { code: 'RES010', name: 'Neha Sharma', selected: false },
      { code: 'RES011', name: 'Rohit Mehta', selected: false },
      { code: 'RES012', name: 'Kiran Rao', selected: false },
      { code: 'RES013', name: 'Harish Babu', selected: false }
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
          code: result.code || `RES0${this.availableResources.length + 10}`,
          name: result.name || result.resource || 'New Resource',
          selected: false
        };
        this.availableResources.push(newRes);
      }
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/projects/dashboard/analytics'], {
        queryParams: { code: this.projectCode || '2026/CHM/006', name: this.projectName || 'Acrylic Emulsion Binder 50% Solids' }
      });
    }
  }
}
