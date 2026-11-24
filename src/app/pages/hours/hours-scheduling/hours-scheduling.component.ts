import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { HoursProjectPopComponent } from '../hours-project-pop/hours-project-pop.component';

export interface AllocationTaskDetail {
  project?: string;
  module: string;
  task: string;
  hours: number;
  description?: string;
}

export interface ResourceMessage {
  sender: string;
  date: string;
  text: string;
}

export interface AllocationEntry {
  id?: number | string;
  dateObj: Date;
  name: string;
  workHours?: number;
  projectsCount: number;
  projects?: string[];
  tasks?: string;
  tasksList: AllocationTaskDetail[];
  approved: number;
  declined: number;
  pending: number;
  totalHours: number;
  hours?: number;
  totalWorkHours?: number;
  loadPercentage: number;
  messages?: ResourceMessage[];
}

export interface AllocationCalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  claims: number;
}

@Component({
  selector: 'app-hours-scheduling',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  templateUrl: './hours-scheduling.component.html',
  styleUrl: './hours-scheduling.component.scss',
})
export class HoursSchedulingComponent implements OnInit {
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

  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  readonly dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentAllocationDate: Date = new Date(2026, 5, 1); // June 2026
  selectedAllocationDate: Date | null = null;

  allocationCalendarDays: AllocationCalendarDay[] = [];
  allocationEntries: AllocationEntry[] = [];
  filteredAllocations: AllocationEntry[] = [];
  paginatedAllocations: AllocationEntry[] = [];

  allocationPageSize: number = 10;
  allocationCurrentPage: number = 1;

  allocationTemplates: Omit<AllocationEntry, 'id' | 'dateObj'>[] = [
    {
      name: 'Rajesh Kumar',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/001 - Waterborne Polyurethane Dispersion', '2026/CHM/002 - Bio-based Epoxy Crosslinker'],
      tasks: '4/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Feasibility', task: 'Monomer Feed Profile & Polymerization Kinetics', hours: 7.0, description: 'Physicochemical characterization and reaction calorimetry (RC1) profiling' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Process Development', task: 'Prepolymer Synthesis & Emulsification Window', hours: 5.0, description: 'Evaluation of isocyanate prepolymer chain extension and dispersion stability' },
        { project: '2026/CHM/002 - Bio-based Epoxy Crosslinker', module: 'Testing', task: 'Accelerated Thermal & Hydrolytic Stability', hours: 4.0, description: 'Chemical stability evaluation and degradation kinetics under thermal stress' },
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Pilot Scale-Up', task: 'Particle Size Distribution & Solids % Optimization', hours: 4.0, description: 'Dynamic light scattering (DLS) particle sizing and solids verification' },
      ],
      approved: 16.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 20.0,
      hours: 20.0,
      totalWorkHours: 20.0,
      loadPercentage: 250,
    },
    {
      name: 'Anita Desai',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/002 - Bio-based Epoxy Crosslinker'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Chemistry', task: 'Surfactant & Initiator Compatibility Matrix', hours: 4.5, description: 'Isothermal calorimetry and redox initiator screening at 75°C' },
        { project: '2026/CHM/002 - Bio-based Epoxy Crosslinker', module: 'Reaction Engineering', task: 'Epoxy Equivalent Weight (EEW) Optimization', hours: 3.0, description: 'Functional titration and curing agent stoichiometry screening' },
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94,
    },
    {
      name: 'Neha Sengupta',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Chemistry', task: 'QbD Critical Process Parameter (CPP) Matrix', hours: 4.5, description: 'Process FMEA and critical quality attribute risk analysis' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Scale-Up', task: 'Solid-State Polymerization (SSP) Optimization', hours: 3.0, description: 'Inherent viscosity and moisture control during SSP reactor run' },
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94,
    },
    {
      name: 'Kavita Patel',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Testing', task: 'Thermal Stability & TGA Decomposition Analysis', hours: 4.0, description: 'Thermogravimetric analysis (TGA) and DSC glass transition profiling' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Testing', task: 'Fluorine NMR & GPC Molecular Weight Method', hours: 3.0, description: 'Flow rate, eluent composition and column calibration robustness' },
      ],
      approved: 7.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.0,
      hours: 7.0,
      totalWorkHours: 7.0,
      loadPercentage: 88,
    },
    {
      name: 'Vikram Malhotra',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/003 - High Purity Electronic Grade IPA', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Development', task: 'Pilot Reactor Heat Removal & Exotherm Control', hours: 6.0, description: 'Cooling jacket heat transfer coefficient and runaway reaction safety' },
        { project: '2026/CHM/003 - High Purity Electronic Grade IPA', module: 'Testing', task: 'Trace Metals (ICP-MS) Assay Protocol', hours: 4.0, description: 'Sub-ppb trace metal impurity detection method validation' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Validation', task: 'Melt Flow Index & Tensile Strength Testing', hours: 4.0, description: 'ASTM D1238 MFI testing against benchmark resin grade' },
      ],
      approved: 12.0,
      declined: 0.0,
      pending: 2.0,
      totalHours: 14.0,
      hours: 14.0,
      totalWorkHours: 14.0,
      loadPercentage: 175,
    },
    {
      name: 'Suresh Raina',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/002 - Bio-based Epoxy Crosslinker', '2026/CHM/004 - High Performance Epoxy Coating'],
      tasks: '3/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Chemistry', task: 'Co-Monomer Feed Ratio Optimization', hours: 5.0, description: 'Butyl acrylate / methyl methacrylate ratio screening' },
        { project: '2026/CHM/002 - Bio-based Epoxy Crosslinker', module: 'Process Development', task: 'Viscosity & Crosslinking Density Study', hours: 3.0, description: 'Rotational rheometer viscosity profiling across shear rates' },
        { project: '2026/CHM/004 - High Performance Epoxy Coating', module: 'Development', task: 'Corrosion Resistance Salt Spray Testing', hours: 4.0, description: 'ASTM B117 salt fog exposure and adhesion pull-off assay' },
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 12.0,
      hours: 12.0,
      totalWorkHours: 12.0,
      loadPercentage: 150,
    },
    {
      name: 'Amit Trivedi',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/004 - High Performance Epoxy Coating', '2026/CHM/008 - UV Curable Oligomer Resin'],
      tasks: '4/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Development', task: 'Pilot Scale 500L Emulsion Polymerization Run', hours: 8.0, description: 'Execution in industrial pilot reactor suite' },
        { project: '2026/CHM/004 - High Performance Epoxy Coating', module: 'Testing', task: 'Chemical Resistance & Solvent Rub Test', hours: 5.0, description: 'MEK double-rub testing and VOC headspace measurement' },
        { project: '2026/CHM/008 - UV Curable Oligomer Resin', module: 'Validation', task: 'Cure Speed & Photoinitiator Dosage Verification', hours: 4.0, description: 'UV-LED cure kinetics and pendulum hardness testing' },
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'EHS & Regulatory', task: 'REACH / TSCA Compliance Dossier Signoff', hours: 3.0, description: 'Chemical substance identity and safety data sheet (SDS) compilation' },
      ],
      approved: 16.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 20.0,
      hours: 20.0,
      totalWorkHours: 20.0,
      loadPercentage: 250,
    },
    {
      name: 'Priya Sharma',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/001 - Waterborne Polyurethane Dispersion'],
      tasks: '2/2',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'EHS & Regulatory', task: 'HAZOP & Process Safety Review', hours: 4.5, description: 'Reactor thermal hazard assessment and emergency pressure relief sizing' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'EHS & Regulatory', task: 'VOC Emissions & Environmental Permitting', hours: 3.5, description: 'Fugitive emission calculations and air permit submission' },
      ],
      approved: 6.0,
      declined: 0.0,
      pending: 2.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100,
    },
    {
      name: 'Pooja Nair',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/001 - Waterborne Polyurethane Dispersion', '2026/CHM/003 - High Purity Electronic Grade IPA'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Regulatory', task: 'HAZOP & Process Safety Review', hours: 6.0, description: 'Reactor thermal hazard assessment and emergency pressure relief sizing' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Regulatory', task: 'VOC Emissions & Environmental Permitting', hours: 4.0, description: 'Fugitive emission calculations and air permit submission' },
        { project: '2026/CHM/003 - High Purity Electronic Grade IPA', module: 'Regulatory', task: 'SEMI C1 Grade Quality Specification Review', hours: 4.0, description: 'Semiconductor grade chemical specification verification' },
      ],
      approved: 10.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 14.0,
      hours: 14.0,
      totalWorkHours: 14.0,
      loadPercentage: 175,
    },
    {
      name: 'Deepak Verma',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/004 - High Performance Epoxy Coating', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Development', task: 'Continuous Monomer Emulsion Feed Trial', hours: 5.0, description: 'Metering pump calibration and feed rate control study' },
        { project: '2026/CHM/004 - High Performance Epoxy Coating', module: 'Development', task: 'Pigment Dispersion & Grind Gauge Analysis', hours: 4.0, description: 'Bead mill dispersion and Hegman gauge fineness testing' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Validation', task: 'Extrusion Compounding Parameter Definition', hours: 3.0, description: 'Twin-screw extruder temperature profile and torque optimization' },
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 12.0,
      hours: 12.0,
      totalWorkHours: 12.0,
      loadPercentage: 150,
    },
    {
      name: 'Anil Kulkarni',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/003 - High Purity Electronic Grade IPA', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Testing', task: 'Freeze-Thaw & Mechanical Stability Protocol', hours: 6.0, description: 'ISO 1147 freeze-thaw cycles and high-speed mechanical shear testing' },
        { project: '2026/CHM/003 - High Purity Electronic Grade IPA', module: 'Testing', task: 'Water Content (Karl Fischer) & Assay Protocol', hours: 5.0, description: 'Coulometric Karl Fischer titration and GC purity assay' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Testing', task: 'Melt Rheology & Die Swell Study', hours: 5.0, description: 'Capillary rheometer shear rate sweep at 300°C' },
      ],
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 16.0,
      hours: 16.0,
      totalWorkHours: 16.0,
      loadPercentage: 200,
    },
    {
      name: 'Sunita Rao',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/004 - High Performance Epoxy Coating', '2026/CHM/008 - UV Curable Oligomer Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Validation', task: 'Continuous VOC Stripping Optimization', hours: 6.0, description: 'Steam stripping and residual monomer vacuum devolatilization' },
        { project: '2026/CHM/004 - High Performance Epoxy Coating', module: 'Validation', task: 'Coating Curing Kinetics & Pot Life Verification', hours: 5.0, description: 'Gel time and isothermal cure kinetics validation' },
        { project: '2026/CHM/008 - UV Curable Oligomer Resin', module: 'Development', task: 'Bench Scale UV Curing Trials', hours: 5.0, description: 'UV radiation intensity and crosslinking conversion rate' },
      ],
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 16.0,
      hours: 16.0,
      totalWorkHours: 16.0,
      loadPercentage: 200,
    },
    {
      name: 'Rohan Mehta',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Testing', task: 'GPC Molecular Weight Distribution Protocol', hours: 6.0, description: 'Gel permeation chromatography Mw, Mn, and polydispersity assay' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Testing', task: 'Residual Monomer (Caprolactam) GC Method', hours: 5.0, description: 'Gas chromatography method development with FID detector' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Testing', task: 'Fluorine Elemental Assay & FTIR Identification', hours: 5.0, description: 'FTIR ATR spectrometer fingerprinting and halogen analysis' },
      ],
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 16.0,
      hours: 16.0,
      totalWorkHours: 16.0,
      loadPercentage: 200,
    },
    {
      name: 'Swati Deshmukh',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/003 - High Purity Electronic Grade IPA', '2026/CHM/001 - Waterborne Polyurethane Dispersion'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Regulatory', task: 'GHS Safety Data Sheet (SDS) & Labeling Package', hours: 6.0, description: 'Classification, pictograms, hazard statements and SDS authoring' },
        { project: '2026/CHM/003 - High Purity Electronic Grade IPA', module: 'Regulatory', task: 'Cleanroom Certification & Handling Guidelines', hours: 5.0, description: 'ISO Class 5 packaging standards and chemical container compatibility' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Regulatory', task: 'Industrial Customer Technical Data Sheet (TDS)', hours: 5.0, description: 'Product technical data sheet and application guidelines authoring' },
      ],
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 16.0,
      hours: 16.0,
      totalWorkHours: 16.0,
      loadPercentage: 200,
    },
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.buildAllocationCalendar();

    // Default to June 2, 2026 or first active day
    const defaultDay =
      this.allocationCalendarDays.find((d) => d.inCurrentMonth && d.dayNumber === 2) ||
      this.allocationCalendarDays.find((d) => d.inCurrentMonth);

    if (defaultDay) {
      this.filterAllocationByDate(defaultDay);
    }
  }

  generateAllocationEntriesForMonth(year: number, month: number): AllocationEntry[] {
    const entries: AllocationEntry[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      for (let i = 0; i < this.allocationTemplates.length; i++) {
        const t = this.allocationTemplates[i];
        let defaultMessages: ResourceMessage[] = [];
        if (t.name.includes('Rajesh')) {
          defaultMessages = [
            { sender: 'Rajesh Kumar', date: '2026-06-02', text: 'Allocated for Emulsion Polymerization kinetics and RC1 reaction calorimetry.' },
            { sender: 'Plant Manager', date: '2026-06-03', text: 'Approved work hours allocation for polymerization pilot campaign.' }
          ];
        } else if (t.name.includes('Anita')) {
          defaultMessages = [
            { sender: 'Anita Desai', date: '2026-06-02', text: 'Surfactant screening & redox initiator compatibility on track in lab reactor.' }
          ];
        } else if (t.name.includes('Amit')) {
          defaultMessages = [
            { sender: 'Amit Trivedi', date: '2026-06-02', text: '500L pilot reactor run scheduled; DCS recipe and charging sequences verified.' }
          ];
        } else {
          defaultMessages = [
            { sender: t.name, date: '2026-06-02', text: 'Chemical batch schedule submitted and aligned with milestone dates.' }
          ];

        }

        entries.push({
          id: `${year}-${month + 1}-${day}-${i + 1}`,
          dateObj: dateObj,
          name: t.name,
          workHours: t.workHours,
          projectsCount: t.projectsCount,
          projects: [...(t.projects || [])],
          tasks: t.tasks,
          tasksList: t.tasksList.map((item) => ({ ...item })),
          approved: t.approved,
          declined: t.declined,
          pending: t.pending,
          totalHours: t.totalHours,
          hours: t.hours,
          totalWorkHours: t.totalWorkHours,
          loadPercentage: t.loadPercentage,
          messages: defaultMessages,
        });
      }
    }
    return entries;
  }

  ensureAllocationEntriesForMonth(year: number, month: number): void {
    if (this.allocationEntries.length === 0) {
      this.allocationEntries = this.generateAllocationEntriesForMonth(2026, 5); // June 2026
    }
    const hasEntriesForMonth = this.allocationEntries.some(
      (e) => e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month
    );
    if (!hasEntriesForMonth) {
      const newEntries = this.generateAllocationEntriesForMonth(year, month);
      this.allocationEntries.push(...newEntries);
    }
  }

  get currentAllocationMonthLabel(): string {
    return `${this.monthNames[this.currentAllocationDate.getMonth()]} ${this.currentAllocationDate.getFullYear()}`;
  }

  prevAllocationMonth(): void {
    this.currentAllocationDate = new Date(
      this.currentAllocationDate.getFullYear(),
      this.currentAllocationDate.getMonth() - 1,
      1
    );
    this.buildAllocationCalendar();
  }

  nextAllocationMonth(): void {
    this.currentAllocationDate = new Date(
      this.currentAllocationDate.getFullYear(),
      this.currentAllocationDate.getMonth() + 1,
      1
    );
    this.buildAllocationCalendar();
  }

  buildAllocationCalendar(): void {
    const year = this.currentAllocationDate.getFullYear();
    const month = this.currentAllocationDate.getMonth();
    this.ensureAllocationEntriesForMonth(year, month);
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const days: AllocationCalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const inCurrentMonth = cellDate.getMonth() === month;
      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday: this.isSameDay(cellDate, today),
        isSelected: this.selectedAllocationDate ? this.isSameDay(cellDate, this.selectedAllocationDate) : false,
        claims: inCurrentMonth ? this.getDummyCalendarClaims(cellDate) : 0,
      });
    }
    this.allocationCalendarDays = days;
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

  filterAllocationByDate(day: AllocationCalendarDay): void {
    if (!day.inCurrentMonth) return;

    this.selectedAllocationDate = day.date;
    this.filteredAllocations = this.allocationEntries.filter((e) => this.isSameDay(e.dateObj, day.date));

    for (const d of this.allocationCalendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }

    this.allocationCurrentPage = 1;
    this.updateAllocationPagination();
  }

  updateAllocationPagination(): void {
    const startIndex = (this.allocationCurrentPage - 1) * this.allocationPageSize;
    const endIndex = startIndex + Number(this.allocationPageSize);
    this.paginatedAllocations = this.filteredAllocations.slice(startIndex, endIndex);
  }

  handleAllocationPageEvent(event: PageEvent): void {
    this.allocationCurrentPage = event.pageIndex + 1;
    this.allocationPageSize = event.pageSize;
    this.updateAllocationPagination();
  }

  get totalAllocationsInRange(): number {
    return this.allocationCalendarDays
      .filter((d) => d.inCurrentMonth)
      .reduce((sum, d) => sum + d.claims, 0);
  }

  formatAllocationDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  getTaskFraction(entry: AllocationEntry): string {
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

  openAllocationTasks(entry: AllocationEntry): void {
    this.router.navigate(['/hours/scheduling/tasks'], {
      queryParams: {
        resource: entry.name,
        date: this.formatAllocationDate(entry.dateObj),
      },
    });
  }

  openAllocationProjects(entry: AllocationEntry): void {
    this.dialog.open(HoursProjectPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: { entry },
    });
  }

  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

  openMessagesDialog(entry: AllocationEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '550px',
      maxWidth: '95vw',
      data: entry,
    });
  }

  addMessage(entry: AllocationEntry, text: string): void {
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
