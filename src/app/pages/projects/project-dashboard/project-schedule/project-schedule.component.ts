import { Component, OnInit, ElementRef, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HoursProjectPopComponent } from '../../../hours/hours-project-pop/hours-project-pop.component';
import { ScheduleMoreComponent } from './schedule-more/schedule-more.component';

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

export interface ScheduleTask {
  id: string;
  name: string;
  module: string;
  assignee: string;
  planStart: Date;
  planEnd: Date;
  actualStartObj: Date | null;
  actualEndObj: Date | null;
  status: 'Pending' | 'In Process' | 'Completed' | 'Overdue';
  completion: number;
  stage: string;
  sprint?: string;
}

export interface TimelineDay {
  date: number;
  name: string;
}

export interface TimelineMonth {
  name: string;
  daysCount: number;
  width: number;
}

export interface TimelineWeek {
  weekNumber: number;
  label: string;
  startDate: Date;
  monthName: string;
}

export interface TimelineMonthColumn {
  name: string;
  unitLabel: string;
  daysText: string;
}

export interface GanttBar {
  left: number;
  width: number;
  color: string;
  label: string;
  completion?: number;
}

@Component({
  selector: 'app-project-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ScheduleMoreComponent,
],
  templateUrl: './project-schedule.component.html',
  styleUrl: './project-schedule.component.scss'
})
export class ProjectScheduleComponent implements OnInit {
  @ViewChild('ganttViewport') ganttViewport!: ElementRef<HTMLDivElement>;
  @ViewChild('allocationTasksDialog') allocationTasksDialog!: TemplateRef<any>;
  @ViewChild('allocationProjectsDialog') allocationProjectsDialog!: TemplateRef<any>;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  viewMode: 'grid' | 'gantt' | 'allocation' = 'allocation';
  timeScale: 'daily' | 'weekly' | 'monthly' = 'monthly';
  isMaskingPending: boolean = false;
  isCriticalPath: boolean = false;
  isCriticalChain: boolean = false;
  isMoreView: boolean = false;
  private prevChainPathMode: 'chain' | 'path' | null = null;

  filterToggle: boolean = false;
  stages: string[] = [
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
  stageFilter: string = 'Feasibility';
  sprints: string[] = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'];
  sprintFilter: string = 'all';
  modules: string[] = [
    'Feasibility',
    'Formulation',
    'Development',
    'Testing',
    'Validation',
    'Regulatory'
  ];
  moduleFilter: string = 'all';

  // Custom splitter state
  leftPaneWidth: number = 560;
  isResizing: boolean = false;
  timelineDays: TimelineDay[] = [];
  timelineMonths: TimelineMonth[] = [];
  timelineWeeks: TimelineWeek[] = [];
  timelineWeeksMonths: TimelineMonth[] = [];
  timelineMonthlyColumns: TimelineMonthColumn[] = [];
  dayWidth: number = 36; // width in pixels of each day column
  weekWidth: number = 80; // width in pixels of each week column
  monthWidth: number = 240; // width in pixels of each month column
  private startResizeX: number = 0;
  private startPaneWidth: number = 0;
  private containerElemWidth: number = 1200;

  // Allocation calendar & data state
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  currentAllocationDate: Date = new Date(2026, 5, 1);
  selectedAllocationDate: Date | null = null;
  allocationCalendarDays: AllocationCalendarDay[] = [];
  filteredAllocations: AllocationEntry[] = [];
  paginatedAllocations: AllocationEntry[] = [];
  allocationPageSize: number = 10;
  allocationCurrentPage: number = 1;

  defaultAllocationProjects: string[] = [
    '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
    '2026/CHM/001 - Waterborne Polyurethane Dispersion',
    'PRJ-2026-8492 - High Purity Electronic Grade IPA',
    'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin'
  ];

  allocationTemplates: Omit<AllocationEntry, 'id' | 'dateObj'>[] = [
    {
      name: 'Rajesh Kumar',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/001 - Waterborne Polyurethane Dispersion', 'PRJ-2026-8492 - High Purity Electronic Grade IPA'],
      tasks: '4/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Feasibility', task: 'Benchmark Grade Characterization', hours: 7.0, description: 'Physicochemical characterization and comparative profiling' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Concept Screening & Feasibility', task: 'Monomer Feed Profile Optimization', hours: 5.0, description: 'Evaluation of solid-state properties and polymorphic form' },
        { project: 'PRJ-2026-8492 - High Purity Electronic Grade IPA', module: 'Process Safety & Regulatory Studies', task: 'Accelerated Stability Stress pull', hours: 4.0, description: 'Chemical stability evaluation under stress conditions' },
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Route Scouting & Lab Synthesis', task: 'Excipient Blend Homogeneity', hours: 4.0, description: 'Spectroscopic blend content uniformity verification' }
      ],
      approved: 16.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 20.0,
      hours: 20.0,
      totalWorkHours: 20.0,
      loadPercentage: 250
    },

      {
      name: 'Anita Desai',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', 'PRJ-2026-8492 - High Purity Electronic Grade IPA'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Route Scouting & Lab Synthesis', task: 'Surfactant & Initiator Compatibility', hours: 4.5, description: 'Isothermal stress testing and binary blend studies' },
        { project: 'PRJ-2026-8492 - High Purity Electronic Grade IPA', module: 'Concept Screening & Feasibility', task: 'Surfactant HLB Screening', hours: 3.0, description: 'Evaluation of non-ionic surfactants for latex stability' }
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94
    },
    {
      name: 'Neha Sengupta',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Route Scouting & Lab Synthesis', task: 'QbD Risk Assessment Matrix', hours: 4.5, description: 'Failure modes and effect analysis (FMEA)' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Route Scouting & Lab Synthesis', task: 'Jacket Cooling Duty Simulation', hours: 3.0, description: 'Aspen Plus batch reactor heat transfer model' }
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94
    },

     {
      name: 'Kavita Patel',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Safety & Regulatory Studies', task: 'Forced Degradation Testing', hours: 4.0, description: 'Stress study under thermal and oxidative conditions' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Process Safety & Regulatory Studies', task: 'Method Robustness Study', hours: 3.0, description: 'Flow rate and column temperature variation' }
      ],
      approved: 7.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.0,
      hours: 7.0,
      totalWorkHours: 7.0,
      loadPercentage: 88
    },
    {
      name: 'Sunita Rao',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', 'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '3/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Optimization (Lab Scale)', task: 'Comparative Dissolution Testing', hours: 6.0, description: 'Multi-media dissolution testing in pH 1.2, 4.5, 6.8' },
        { project: 'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin', module: 'Process Safety & Regulatory Studies', task: 'Assay Method Validation Protocol', hours: 4.0, description: 'Precision, linearity and robustness protocol execution' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Pilot Plant Campaign', task: 'Dissolution Profiling Stability Pull', hours: 4.0, description: 'Profile comparison against reference listed drug' }
      ],
      approved: 10.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 14.0,
      hours: 14.0,
      totalWorkHours: 14.0,
      loadPercentage: 175
    },
    {
      name: 'Vikram Malhotra',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', 'PRJ-2026-8492 - High Purity Electronic Grade IPA', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Route Scouting & Lab Synthesis', task: 'Surfactant & Initiator Compatibility', hours: 5.0, description: 'Isothermal stress testing and binary blend studies' },
        { project: 'PRJ-2026-8492 - High Purity Electronic Grade IPA', module: 'Concept Screening & Feasibility', task: 'Surfactant HLB Screening', hours: 3.0, description: 'Evaluation of non-ionic surfactants for latex stability' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Process Optimization (Lab Scale)', task: 'Granulation Parameter Optimization', hours: 4.0, description: 'Binder addition rate and endpoint determination' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 12.0,
      hours: 12.0,
      totalWorkHours: 12.0,
      loadPercentage: 150
    },
    {
      name: 'Harish Iyer',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', '2026/CHM/008 - Lenvatinib Capsules'],
      tasks: '4/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Optimization (Lab Scale)', task: 'Pilot Scale Batch Manufacturing', hours: 8.0, description: 'Execution in GMP pilot production suite' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Process Safety & Regulatory Studies', task: 'Degradation Products Identification', hours: 5.0, description: 'Stress degradation sample assay' },
        { project: '2026/CHM/008 - Lenvatinib Capsules', module: 'Pilot Plant Campaign', task: 'Process Parameter Verification', hours: 4.0, description: 'CPP range verification testing' },
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Regulatory Registration Filing (REACH / TSCA)', task: 'Investigational Dossier Signoff', hours: 3.0, description: 'Chemistry and manufacturing data compilation' }
      ],
      approved: 16.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 20.0,
      hours: 20.0,
      totalWorkHours: 20.0,
      loadPercentage: 250
    },

     {
      name: 'Diego Ruiz',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/001 - Waterborne Polyurethane Dispersion'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Regulatory Registration Filing (REACH / TSCA)', task: 'Bioequivalence Study Protocol Review', hours: 4.5, description: 'Clinical study design and sample size verification' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Regulatory Registration Filing (REACH / TSCA)', task: 'Ethics Committee Submission Package', hours: 3.5, description: 'Informed consent and investigator brochure assembly' }
      ],
      approved: 0.0,
      declined: 0.0,
      pending: 8.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      name: 'Pooja Singhania',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/001 - Waterborne Polyurethane Dispersion', 'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin'],
      tasks: '3/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Regulatory Registration Filing (REACH / TSCA)', task: 'Process Hazard Analysis (HAZOP) Review', hours: 6.0, description: 'Full plant HAZOP node review and safety relief sizing' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Regulatory Registration Filing (REACH / TSCA)', task: 'REACH Registration Dossier Preparation', hours: 4.0, description: 'IUCLID substance identity and exposure scenario compilation' },
        { project: 'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin', module: 'Regulatory Registration Filing (REACH / TSCA)', task: 'Module 3 Dossier Review', hours: 4.0, description: 'Quality overall summary review' }
      ],
      approved: 10.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 14.0,
      hours: 14.0,
      totalWorkHours: 14.0,
      loadPercentage: 175
    },
    {
      name: 'Karthik Rangan',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/002 - Bio-based Epoxy Crosslinker', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '3/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Optimization (Lab Scale)', task: 'Emulsion Polymerization Batch Trial', hours: 5.0, description: '500L pilot reactor run with inline temperature monitoring' },
        { project: '2026/CHM/002 - Bio-based Epoxy Crosslinker', module: 'Process Optimization (Lab Scale)', task: 'Continuous VOC Stripping Optimization', hours: 4.0, description: 'Steam stripping column parameter tuning for < 50 ppm VOC' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Pilot Plant Campaign', task: 'Process Validation Protocol Drafting', hours: 3.0, description: 'Critical process parameter definition' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 12.0,
      hours: 12.0,
      totalWorkHours: 12.0,
      loadPercentage: 150
    },
    {
      name: 'Amit Sharma',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/002 - Bio-based Epoxy Crosslinker', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '4/5',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Safety & Regulatory Studies', task: 'Freeze-Thaw & Storage Stability Setup', hours: 6.0, description: '5-cycle freeze-thaw stability and oven aging trial' },
        { project: '2026/CHM/002 - Bio-based Epoxy Crosslinker', module: 'Process Safety & Regulatory Studies', task: 'Viscosity Rheological Profiling', hours: 5.0, description: 'Brookfield high-shear viscosity curve calibration' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Process Safety & Regulatory Studies', task: 'Assay Method Robustness Study', hours: 5.0, description: 'Assay method robustness testing' }
      ],
      approved: 12.0,
      declined: 0.0,
      pending: 4.0,
      totalHours: 16.0,
      hours: 16.0,
      totalWorkHours: 16.0,
      loadPercentage: 200
    },
    {
      name: 'Suresh Naidu',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Pilot Plant Campaign', task: 'Reactor Scale-Up Agitation Modeling', hours: 6.0, description: 'Impeller tip speed and Reynolds number modeling' },
        { project: '2026/CHM/005 - Polyamide 66 High-Tenacity Resin', module: 'Scale-Up', task: 'Filtration Skid Commissioning', hours: 4.0, description: 'Bag filter and cartridge filter pressure drop validation' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 2.0,
      totalHours: 10.0,
      hours: 10.0,
      totalWorkHours: 10.0,
      loadPercentage: 125
    },
    {
      name: 'Manish Saxena',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Pilot Plant Campaign', task: 'Monomer Hold-Time Study Protocol', hours: 5.5, description: 'Pre-emulsion storage stability and inhibitor depletion rate' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Pilot Plant Campaign', task: 'Semi-Commercial 2500L Run Execution', hours: 4.5, description: 'Continuous DCS tracking of monomer conversion rate' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 2.0,
      totalHours: 10.0,
      hours: 10.0,
      totalWorkHours: 10.0,
      loadPercentage: 125
    },
    {
      name: 'Priya Reddy',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', 'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Optimization (Lab Scale)', task: 'Comparative Dissolution Testing', hours: 5.0, description: 'Dissolution profile testing across pH buffers' },
        { project: 'PRJ-2026-5127 - Polyamide 66 High-Tenacity Resin', module: 'Analytical Development', task: 'Method Robustness Study', hours: 3.5, description: 'Assay method robustness testing' }
      ],
      approved: 5.0,
      declined: 0.0,
      pending: 3.5,
      totalHours: 8.5,
      hours: 8.5,
      totalWorkHours: 8.5,
      loadPercentage: 106
    },
    {
      name: 'Shalini Nair',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/009 - Macitentan Tablets'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Safety & Regulatory Studies', task: 'Impurities Profiling Assay', hours: 5.0, description: 'Related substances chromatogram resolution' },
        { project: '2026/CHM/009 - Macitentan Tablets', module: 'Process Safety & Regulatory Studies', task: 'Residual Solvent Quantification', hours: 3.5, description: 'Headspace GC residual solvent determination' }
      ],
      approved: 5.0,
      declined: 0.0,
      pending: 3.5,
      totalHours: 8.5,
      hours: 8.5,
      totalWorkHours: 8.5,
      loadPercentage: 106
    },
  
   
    {
      name: 'Sneha Kulkarni',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/009 - Macitentan Tablets'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Concept Screening & Feasibility', task: 'Particle Size Distribution Profiling', hours: 3.5, description: 'Laser diffraction D10, D50, D90 determination' },
        { project: '2026/CHM/009 - Macitentan Tablets', module: 'Process Optimization (Lab Scale)', task: 'Direct Compression Feasibility', hours: 3.0, description: 'Flowability and compressibility index measurement' }
      ],
      approved: 6.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 6.5,
      hours: 6.5,
      totalWorkHours: 6.5,
      loadPercentage: 81
    },
    {
      name: 'Rohan Verma',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/002 - Bio-based Epoxy Crosslinker', '2026/CHM/001 - Waterborne Polyurethane Dispersion'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Feasibility', task: 'Target Product Profile Formulation', hours: 4.0, description: 'TPP matrix parameter establishment' },
        { project: '2026/CHM/001 - Waterborne Polyurethane Dispersion', module: 'Concept Screening & Feasibility', task: 'Solubility & Permeability Assay', hours: 4.0, description: 'BCS class determination assay' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      name: 'Arun Menon',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/007 - Specialty Fluoropolymer Resin'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Optimization (Lab Scale)', task: 'Compression Trial Hardness Testing', hours: 4.5, description: 'Tablet compression parameter study' },
        { project: '2026/CHM/007 - Specialty Fluoropolymer Resin', module: 'Process Optimization (Lab Scale)', task: 'Film Coating Uniformity Trial', hours: 3.5, description: 'Pan speed and spray rate calibration' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      name: 'Divya Pillai',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', 'PRJ-2026-8492 - High Purity Electronic Grade IPA'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Safety & Regulatory Studies', task: 'Stability Testing Protocol Setup', hours: 4.5, description: 'Accelerated and real-time stability chamber allocation' },
        { project: 'PRJ-2026-8492 - High Purity Electronic Grade IPA', module: 'Process Safety & Regulatory Studies', task: 'Photostability Testing Protocol', hours: 3.5, description: 'ICH Q1B light stress trial' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
   
    {
      name: 'Meera Joshi',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/005 - Polyamide 66 High-Tenacity Resin'],
      tasks: '1/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Feasibility', task: 'Literature & Patent Landscape Review', hours: 6.0, description: 'Freedom-to-operate patent screening and API synthetic route analysis' }
      ],
      approved: 6.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 6.0,
      hours: 6.0,
      totalWorkHours: 6.0,
      loadPercentage: 75
    },
    {
      name: 'Deepak Chawla',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', '2026/CHM/008 - Lenvatinib Capsules'],
      tasks: '1/3',
      tasksList: [
        { project: '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids', module: 'Process Optimization (Lab Scale)', task: 'Packaging Moisture Barrier Study', hours: 5.0, description: 'Alu-Alu blister foil moisture transmission rate evaluation' }
      ],
      approved: 5.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 5.0,
      hours: 5.0,
      totalWorkHours: 5.0,
      loadPercentage: 63
    }
  ];

  allocationEntries: AllocationEntry[] = [];

  // ─── Critical Path Tasks (Sequential, Non-overlapping chain) ─────────────
  criticalPathTasks: ScheduleTask[] = [
    {
      id: 'CP-1',
      name: 'Benchmark Grade Characterization',
      module: 'Feasibility',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 1),
      planEnd: new Date(2026, 5, 18),
      actualStartObj: new Date(2026, 5, 1),
      actualEndObj: new Date(2026, 5, 18),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'CP-2',
      name: 'Surfactant & Initiator Compatibility Study',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 19),
      planEnd: new Date(2026, 6, 8),
      actualStartObj: new Date(2026, 5, 19),
      actualEndObj: new Date(2026, 6, 8),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'CP-3',
      name: 'Laboratory Prototype Batch',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 9),
      planEnd: new Date(2026, 6, 30),
      actualStartObj: new Date(2026, 6, 9),
      actualEndObj: null,
      status: 'In Process',
      completion: 75,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'CP-4',
      name: 'Analytical Method Development',
      module: 'Process Optimization (Lab Scale)',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 31),
      planEnd: new Date(2026, 7, 20),
      actualStartObj: new Date(2026, 6, 31),
      actualEndObj: null,
      status: 'In Process',
      completion: 40,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    {
      id: 'CP-5',
      name: 'Pilot Batch Scale-Up',
      module: 'Process Safety & Regulatory Studies',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 7, 21),
      planEnd: new Date(2026, 8, 10),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 4'
    },
    {
      id: 'CP-6',
      name: 'Process Validation Batches',
      module: 'Pilot Plant Campaign',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 11),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    {
      id: 'CP-7',
      name: 'Regulatory Dossier Preparation & Filing',
      module: 'Regulatory Registration Filing (REACH / TSCA)',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 9, 3),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Regulatory',
      sprint: 'Sprint 5'
    }
  ];

  // ─── Critical Chain Tasks (CCPM with Feeding & Project Buffers) ─────────────
  criticalChainTasks: ScheduleTask[] = [
    {
      id: 'CC-1',
      name: 'Benchmark Grade Characterization',
      module: 'Feasibility',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 1),
      planEnd: new Date(2026, 5, 15),
      actualStartObj: new Date(2026, 5, 1),
      actualEndObj: new Date(2026, 5, 15),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'CC-2',
      name: 'Surfactant & Initiator Compatibility Study',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 16),
      planEnd: new Date(2026, 6, 4),
      actualStartObj: new Date(2026, 5, 16),
      actualEndObj: new Date(2026, 6, 4),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'CC-3',
      name: 'Laboratory Prototype Batch',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 5),
      planEnd: new Date(2026, 6, 25),
      actualStartObj: new Date(2026, 6, 5),
      actualEndObj: null,
      status: 'In Process',
      completion: 80,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'CC-FB1',
      name: 'Feeding Buffer (Formulation)',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Buffer Control',
      planStart: new Date(2026, 6, 26),
      planEnd: new Date(2026, 7, 2),
      actualStartObj: new Date(2026, 6, 26),
      actualEndObj: null,
      status: 'In Process',
      completion: 60,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'CC-4',
      name: 'Analytical Method Development',
      module: 'Process Optimization (Lab Scale)',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 7, 3),
      planEnd: new Date(2026, 7, 22),
      actualStartObj: new Date(2026, 7, 3),
      actualEndObj: null,
      status: 'In Process',
      completion: 45,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    {
      id: 'CC-5',
      name: 'Pilot Batch Scale-Up',
      module: 'Process Safety & Regulatory Studies',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 7, 23),
      planEnd: new Date(2026, 8, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 4'
    },
    {
      id: 'CC-6',
      name: 'Process Validation Batches',
      module: 'Pilot Plant Campaign',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 13),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    {
      id: 'CC-PB',
      name: 'Project Buffer (End-to-End)',
      module: 'Regulatory Registration Filing (REACH / TSCA)',
      assignee: 'Project Management',
      planStart: new Date(2026, 9, 3),
      planEnd: new Date(2026, 9, 18),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Regulatory',
      sprint: 'Sprint 5'
    },
    {
      id: 'CC-7',
      name: 'Regulatory Dossier Filing',
      module: 'Regulatory Registration Filing (REACH / TSCA)',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 9, 19),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Regulatory',
      sprint: 'Sprint 5'
    }
  ];

  allTasks: ScheduleTask[] = [
    // Feasibility Stage
    {
      id: 'T1',
      name: 'Benchmark Grade Characterization',
      module: 'Feasibility',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 1),
      planEnd: new Date(2026, 5, 10),
      actualStartObj: new Date(2026, 5, 1),
      actualEndObj: new Date(2026, 5, 10),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'T2',
      name: 'Target Product Profile (TPP) Definition',
      module: 'Feasibility',
      assignee: 'Ravi Shah',
      planStart: new Date(2026, 5, 5),
      planEnd: new Date(2026, 5, 18),
      actualStartObj: new Date(2026, 5, 5),
      actualEndObj: new Date(2026, 5, 18),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'T3',
      name: 'API Source & Vendor Qualification',
      module: 'Feasibility',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 10),
      planEnd: new Date(2026, 5, 25),
      actualStartObj: new Date(2026, 5, 10),
      actualEndObj: new Date(2026, 5, 25),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'T4',
      name: 'Preformulation & Physicochemical Testing',
      module: 'Feasibility',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 5, 15),
      planEnd: new Date(2026, 6, 5),
      actualStartObj: new Date(2026, 5, 15),
      actualEndObj: null,
      status: 'In Process',
      completion: 80,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    {
      id: 'T5',
      name: 'Freedom-to-Operate (FTO) Patent Assessment',
      module: 'Feasibility',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 5, 20),
      planEnd: new Date(2026, 6, 10),
      actualStartObj: new Date(2026, 5, 20),
      actualEndObj: null,
      status: 'In Process',
      completion: 60,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    {
      id: 'T6',
      name: 'Cost of Goods Sold (COGS) Feasibility Model',
      module: 'Feasibility',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 5, 25),
      planEnd: new Date(2026, 6, 15),
      actualStartObj: new Date(2026, 5, 25),
      actualEndObj: null,
      status: 'Overdue',
      completion: 40,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    {
      id: 'T7',
      name: 'Regulatory Pathway & Risk Evaluation',
      module: 'Feasibility',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 6, 1),
      planEnd: new Date(2026, 6, 20),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    // Formulation Stage
    {
      id: 'T8',
      name: 'API Characterization',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 10),
      planEnd: new Date(2026, 5, 24),
      actualStartObj: new Date(2026, 5, 10),
      actualEndObj: new Date(2026, 5, 23),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 1'
    },
    {
      id: 'T9',
      name: 'Surfactant & Initiator Compatibility Study',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 18),
      planEnd: new Date(2026, 6, 2),
      actualStartObj: new Date(2026, 5, 18),
      actualEndObj: new Date(2026, 6, 2),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'T10',
      name: 'Excipient Screening',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 25),
      planEnd: new Date(2026, 6, 10),
      actualStartObj: new Date(2026, 5, 25),
      actualEndObj: new Date(2026, 6, 10),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'T11',
      name: 'Prototype Formulation Design',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Ravi Shah',
      planStart: new Date(2026, 6, 1),
      planEnd: new Date(2026, 6, 18),
      actualStartObj: new Date(2026, 6, 1),
      actualEndObj: null,
      status: 'In Process',
      completion: 75,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'T12',
      name: 'Laboratory Prototype Batch',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 10),
      planEnd: new Date(2026, 6, 28),
      actualStartObj: new Date(2026, 6, 10),
      actualEndObj: null,
      status: 'In Process',
      completion: 50,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'T13',
      name: 'Dissolution Testing',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 6, 18),
      planEnd: new Date(2026, 7, 5),
      actualStartObj: new Date(2026, 6, 18),
      actualEndObj: null,
      status: 'Overdue',
      completion: 30,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'T14',
      name: 'Formulation Optimization',
      module: 'Route Scouting & Lab Synthesis',
      assignee: 'Mei Tanaka',
      planStart: new Date(2026, 6, 25),
      planEnd: new Date(2026, 7, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    // Development Stage
    {
      id: 'T15',
      name: 'Analytical Method Development',
      module: 'Process Optimization (Lab Scale)',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 7, 1),
      planEnd: new Date(2026, 7, 20),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    {
      id: 'T16',
      name: 'Stability Studies Initiation',
      module: 'Process Optimization (Lab Scale)',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 7, 12),
      planEnd: new Date(2026, 7, 30),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    // Testing Stage
    {
      id: 'T17',
      name: 'Pilot Batch Scale-Up',
      module: 'Process Safety & Regulatory Studies',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 7, 22),
      planEnd: new Date(2026, 8, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 4'
    },
    {
      id: 'T18',
      name: 'Bioequivalence (BE) Study Readiness',
      module: 'Process Safety & Regulatory Studies',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 1),
      planEnd: new Date(2026, 8, 22),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 5'
    },
    // Validation Stage
    {
      id: 'T19',
      name: 'Process Validation Batches',
      module: 'Pilot Plant Campaign',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 15),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    {
      id: 'T20',
      name: 'Commercial Site Tech Transfer',
      module: 'Pilot Plant Campaign',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 8, 25),
      planEnd: new Date(2026, 9, 15),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    // Regulatory Stage
    {
      id: 'T21',
      name: 'Regulatory Dossier Preparation & Filing',
      module: 'Regulatory Registration Filing (REACH / TSCA)',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 9, 5),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Regulatory',
      sprint: 'Sprint 5'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['view'] === 'more') {
        this.isMoreView = true;
        this.isCriticalPath = false;
        this.isCriticalChain = false;
        this.viewMode = 'gantt';
      } else if (params['view'] && ['grid', 'gantt', 'allocation'].includes(params['view'])) {
        this.isMoreView = false;
        this.viewMode = params['view'];
      } else {
        this.isMoreView = false;
        this.viewMode = 'allocation';
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.initializeTimeline();

    // Initialize allocation entries (15-30 dummy records per day with 250%, 150%, 175%, etc. load)
    this.initAllocationEntries();
    this.buildAllocationCalendar();
    const defaultAllocationDay =
      this.allocationCalendarDays.find(d => d.inCurrentMonth && d.dayNumber === 2) ||
      this.allocationCalendarDays.find(d => d.inCurrentMonth);
    if (defaultAllocationDay) {
      this.filterAllocationByDate(defaultAllocationDay);
    }
  }

  viewAll(): void {
    this.stageFilter = 'all';
    this.sprintFilter = 'all';
    this.moduleFilter = 'all';
    this.isCriticalPath = false;
    this.isCriticalChain = false;
    this.isMoreView = false;
  }

  get isViewAllActive(): boolean {
    return this.stageFilter === 'all' && !this.isCriticalPath && !this.isCriticalChain && !this.isMoreView;
  }

  toggleChainOrPath(mode: 'chain' | 'path'): void {
    this.isMoreView = false;
    if (mode === 'chain') {
      this.isCriticalChain = !this.isCriticalChain;
      if (this.isCriticalChain) {
        this.isCriticalPath = false;
      }
    } else {
      this.isCriticalPath = !this.isCriticalPath;
      if (this.isCriticalPath) {
        this.isCriticalChain = false;
      }
    }
  }

  toggleMoreView(): void {
    if (!this.isMoreView) {
      this.prevChainPathMode = this.isCriticalPath ? 'path' : (this.isCriticalChain ? 'chain' : null);
      this.isMoreView = true;
      this.isCriticalPath = false;
      this.isCriticalChain = false;
      if (this.viewMode === 'allocation') {
        this.viewMode = 'gantt';
      }
    } else {
      this.closeMoreView();
    }
  }

  closeMoreView(): void {
    this.isMoreView = false;
    if (this.prevChainPathMode === 'path') {
      this.isCriticalPath = true;
      this.isCriticalChain = false;
    } else if (this.prevChainPathMode === 'chain') {
      this.isCriticalChain = true;
      this.isCriticalPath = false;
    }
    this.prevChainPathMode = null;
  }

  toggleCriticalPath(): void {
    this.isMoreView = false;
    this.isCriticalPath = !this.isCriticalPath;
    if (this.isCriticalPath) {
      this.isCriticalChain = false;
    }
  }

  toggleCriticalChain(): void {
    this.isMoreView = false;
    this.isCriticalChain = !this.isCriticalChain;
    if (this.isCriticalChain) {
      this.isCriticalPath = false;
    }
  }

  onStageChange(): void {
    this.isMoreView = false;
    if (this.isCriticalPath) {
      this.isCriticalPath = false;
    }
    if (this.isCriticalChain) {
      this.isCriticalChain = false;
    }
  }

  onTimeScaleChange(): void {
    if (this.ganttViewport) {
      this.ganttViewport.nativeElement.scrollLeft = 0;
    }
  }

  get stats() {
    let tasks = this.isCriticalPath
      ? this.criticalPathTasks
      : (this.isCriticalChain ? this.criticalChainTasks : this.allTasks);

    if (!this.isCriticalPath && !this.isCriticalChain) {
      if (this.stageFilter && this.stageFilter !== 'all') {
        tasks = tasks.filter(t => t.stage === this.stageFilter);
      }
      if (this.sprintFilter && this.sprintFilter !== 'all') {
        tasks = tasks.filter(t => t.sprint === this.sprintFilter);
      }
      if (this.moduleFilter && this.moduleFilter !== 'all') {
        tasks = tasks.filter(t => t.module === this.moduleFilter);
      }
    }
    return {
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProcess: tasks.filter(t => t.status === 'In Process').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length
    };
  }

  applyFilter(): void {
    this.isMoreView = false;
    this.isCriticalPath = false;
    this.isCriticalChain = false;
  }

  clearFilter(): void {
    this.isMoreView = false;
    this.isCriticalPath = false;
    this.isCriticalChain = false;
    this.stageFilter = 'Feasibility';
    this.sprintFilter = 'all';
    this.moduleFilter = 'all';
  }

  get displayedTasks(): ScheduleTask[] {
    let tasks = this.isCriticalPath
      ? this.criticalPathTasks
      : (this.isCriticalChain ? this.criticalChainTasks : this.allTasks);

    if (this.isMaskingPending) {
      tasks = tasks.filter(x => x.status !== 'Pending');
    }
    if (!this.isCriticalPath && !this.isCriticalChain) {
      if (this.stageFilter && this.stageFilter !== 'all') {
        tasks = tasks.filter(x => x.stage === this.stageFilter);
      }
      if (this.sprintFilter && this.sprintFilter !== 'all') {
        tasks = tasks.filter(x => x.sprint === this.sprintFilter);
      }
      if (this.moduleFilter && this.moduleFilter !== 'all') {
        tasks = tasks.filter(x => x.module === this.moduleFilter);
      }
    }
    return tasks;
  }

  getStatusClass(status: string): string {
    return (status || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  get totalTimelineWidth(): number {
    if (this.timeScale === 'weekly') {
      return this.timelineWeeks.length * this.weekWidth;
    } else if (this.timeScale === 'monthly') {
      return this.timelineMonthlyColumns.length * this.monthWidth;
    }
    return this.timelineDays.length * this.dayWidth;
  }

  initializeTimeline(): void {
    this.initializeTimelineDays();
    this.initializeTimelineWeeks();
    this.initializeTimelineMonths();
  }

  initializeTimelineDays(): void {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const tempDays: TimelineDay[] = [];
    const tempMonths: TimelineMonth[] = [];

    const startDate = new Date(2026, 5, 1); // 1 Jun 2026
    const endDate = new Date(2026, 9, 31);   // 31 Oct 2026

    const monthNames = ['June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let currentMonthName = '';
    let currentMonthCount = 0;

    while (current <= endDate) {
      const dayLetter = daysOfWeek[current.getDay()];
      const mIdx = current.getMonth() - 5;
      const mName = (mIdx >= 0 && mIdx < monthNames.length) ? monthNames[mIdx] : '';

      tempDays.push({
        date: current.getDate(),
        name: dayLetter
      });

      if (mName !== currentMonthName) {
        if (currentMonthName !== '') {
          tempMonths.push({
            name: currentMonthName,
            daysCount: currentMonthCount,
            width: currentMonthCount * this.dayWidth
          });
        }
        currentMonthName = mName;
        currentMonthCount = 0;
      }
      currentMonthCount++;

      current.setDate(current.getDate() + 1);
    }

    if (currentMonthCount > 0) {
      tempMonths.push({
        name: currentMonthName,
        daysCount: currentMonthCount,
        width: currentMonthCount * this.dayWidth
      });
    }

    this.timelineDays = tempDays;
    this.timelineMonths = tempMonths;
  }

  initializeTimelineWeeks(): void {
    const weeks: TimelineWeek[] = [];
    const monthNames = ['June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
    const monthWeekCounts = [0, 0, 0, 0, 0];

    const startDate = new Date(2026, 5, 1); // 1 Jun 2026 (Monday)
    const endDate = new Date(2026, 9, 31);   // 31 Oct 2026

    let current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let weekNum = 1;

    while (current <= endDate) {
      const mIdx = Math.max(0, Math.min(4, current.getMonth() - 5));
      monthWeekCounts[mIdx]++;

      weeks.push({
        weekNumber: weekNum,
        label: `Week ${weekNum}`,
        startDate: new Date(current),
        monthName: monthNames[mIdx]
      });

      weekNum++;
      current.setDate(current.getDate() + 7);
    }

    this.timelineWeeks = weeks;
    this.timelineWeeksMonths = monthNames.map((name, idx) => ({
      name,
      daysCount: monthWeekCounts[idx] * 7,
      width: monthWeekCounts[idx] * this.weekWidth
    }));
  }

  initializeTimelineMonths(): void {
    this.timelineMonthlyColumns = [
      { name: 'June 2026', unitLabel: 'Month 1', daysText: '30 Days' },
      { name: 'July 2026', unitLabel: 'Month 2', daysText: '31 Days' },
      { name: 'August 2026', unitLabel: 'Month 3', daysText: '31 Days' },
      { name: 'September 2026', unitLabel: 'Month 4', daysText: '30 Days' },
      { name: 'October 2026', unitLabel: 'Month 5', daysText: '31 Days' }
    ];
  }

  setView(mode: 'grid' | 'gantt' | 'allocation'): void {
    this.isMoreView = false;
    this.viewMode = mode;
  }

  toggleMaskPending(): void {
    this.isMaskingPending = !this.isMaskingPending;
  }

  formatDate(d: Date | null): string {
    if (!d) return '—';
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${monthList[d.getMonth()]}`;
  }

  scrollGantt(direction: 'left' | 'right'): void {
    if (this.ganttViewport) {
      const scrollAmount = 350;
      const element = this.ganttViewport.nativeElement;
      const targetScroll = direction === 'right' ? element.scrollLeft + scrollAmount : element.scrollLeft - scrollAmount;
      element.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  // ─── Custom Resizable Splitter Logic ────────────────────────────────────

  initResize(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();

    this.startResizeX = event.clientX;
    this.startPaneWidth = this.leftPaneWidth;

    const container = (event.target as HTMLElement).closest('.gantt-split-container');
    if (container) {
      this.containerElemWidth = container.clientWidth;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isResizing) {
      const deltaX = event.clientX - this.startResizeX;
      this.leftPaneWidth = Math.max(200, Math.min(this.containerElemWidth - 100, this.startPaneWidth + deltaX));
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isResizing) {
      this.isResizing = false;
    }
  }

  // ─── Gantt Bars Calculation ─────────────────────────────────────────────

  getDayOffset(d: Date): number {
    const timelineStart = new Date(2026, 5, 1);
    const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const startOfTimeline = new Date(timelineStart.getFullYear(), timelineStart.getMonth(), timelineStart.getDate());
    const diffTime = startOfD.getTime() - startOfTimeline.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getDateOffsetPixels(d: Date): number {
    if (this.timeScale === 'weekly') {
      const timelineStart = new Date(2026, 5, 1);
      const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = (startOfD.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, (diffDays / 7) * this.weekWidth);
    } else if (this.timeScale === 'monthly') {
      const monthIndex = d.getMonth() - 5;
      const clampedMonthIndex = Math.max(0, Math.min(4, monthIndex));
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const dayFraction = Math.max(0, Math.min(1, (d.getDate() - 1) / daysInMonth));
      return (clampedMonthIndex + dayFraction) * this.monthWidth;
    } else {
      const offset = this.getDayOffset(d);
      const totalDays = this.timelineDays.length;
      const clamped = Math.max(0, Math.min(totalDays - 1, offset));
      return clamped * this.dayWidth;
    }
  }

  getDateEndPixels(d: Date): number {
    if (this.timeScale === 'weekly') {
      const timelineStart = new Date(2026, 5, 1);
      const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = ((startOfD.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(0, (diffDays / 7) * this.weekWidth);
    } else if (this.timeScale === 'monthly') {
      const monthIndex = d.getMonth() - 5;
      const clampedMonthIndex = Math.max(0, Math.min(4, monthIndex));
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const dayFraction = Math.max(0, Math.min(1, d.getDate() / daysInMonth));
      return (clampedMonthIndex + dayFraction) * this.monthWidth;
    } else {
      const offset = this.getDayOffset(d);
      const totalDays = this.timelineDays.length;
      const clamped = Math.max(0, Math.min(totalDays - 1, offset));
      return (clamped + 1) * this.dayWidth;
    }
  }

  getMinBarWidth(): number {
    if (this.timeScale === 'weekly') return 24;
    if (this.timeScale === 'monthly') return 20;
    return this.dayWidth;
  }

  getPlanBar(task: ScheduleTask): GanttBar | null {
    if (!task.planStart || !task.planEnd) return null;
    const left = this.getDateOffsetPixels(task.planStart);
    const endPixels = this.getDateEndPixels(task.planEnd);
    const width = Math.max(this.getMinBarWidth(), endPixels - left);

    return {
      left,
      width,
      color: '#86efac', // Soft pastel green for Planned schedule
      label: 'Plan'
    };
  }

  getActualBar(task: ScheduleTask): GanttBar | null {
    if (!task.actualStartObj) return null;
    const left = this.getDateOffsetPixels(task.actualStartObj);

    // If ongoing, actual spans to late August 2026 tracking date
    const actualEnd = task.actualEndObj || new Date(2026, 7, 27);
    const endPixels = this.getDateEndPixels(actualEnd);
    const width = Math.max(this.getMinBarWidth(), endPixels - left);

    let color = '#10b981'; // Rich emerald green for Completed
    if (task.status === 'In Process') {
      color = '#3b82f6';
    } else if (task.status === 'Overdue') {
      color = '#ef4444';
    }

    return {
      left,
      width,
      color,
      label: 'Actual',
      completion: task.completion
    };
  }

  getCriticalPathBar(task: ScheduleTask): GanttBar | null {
    if (!task.planStart || !task.planEnd) return null;
    const left = this.getDateOffsetPixels(task.planStart);
    const endPixels = this.getDateEndPixels(task.planEnd);
    const width = Math.max(this.getMinBarWidth(), endPixels - left);

    return {
      left,
      width,
      color: '#6366f1', // Indigo color for Critical Path
      label: 'Critical Path',
      completion: task.completion
    };
  }

  getCriticalChainBar(task: ScheduleTask): GanttBar | null {
    if (!task.planStart || !task.planEnd) return null;
    const left = this.getDateOffsetPixels(task.planStart);
    const endPixels = this.getDateEndPixels(task.planEnd);
    const width = Math.max(this.getMinBarWidth(), endPixels - left);

    const isBuffer = task.name.toLowerCase().includes('buffer');
    return {
      left,
      width,
      color: isBuffer ? '#8b5cf6' : '#ef4444', // Vibrant purple for buffer, red for critical chain
      label: isBuffer ? 'Buffer' : 'Critical Chain',
      completion: task.completion
    };
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  // ─── Allocation Calendar & Methods ──────────────────────────────────────────

  initAllocationEntries(): void {
    if (this.allocationEntries.length === 0) {
      this.allocationEntries = this.generateAllocationEntriesForMonth(2026, 5); // June 2026
    }
  }

  ensureAllocationEntriesForMonth(year: number, month: number): void {
    const hasEntriesForMonth = this.allocationEntries.some(
      e => e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month
    );
    if (!hasEntriesForMonth) {
      const newEntries = this.generateAllocationEntriesForMonth(year, month);
      this.allocationEntries.push(...newEntries);
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
            { sender: 'Rajesh Kumar', date: '2026-06-02', text: 'Allocated for Acrylic Emulsion polymerization & RC1 testing across projects.' },
            { sender: 'Project Manager', date: '2026-06-03', text: 'Approved work hours allocation for sprint.' }
          ];
        } else if (t.name.includes('Anita')) {
          defaultMessages = [
            { sender: 'Anita Desai', date: '2026-06-02', text: 'Trial batch preparation & excipient compatibility on track.' }
          ];
        } else if (t.name.includes('Amit')) {
          defaultMessages = [
            { sender: 'Amit Patel', date: '2026-06-02', text: 'Dissolution testing sequence scheduled in HPLC lab.' }
          ];
        } else {
          defaultMessages = [
            { sender: t.name, date: '2026-06-02', text: 'Task schedule submitted and aligned with milestone dates.' }
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

  get currentAllocationMonthLabel(): string {
    return `${this.monthNames[this.currentAllocationDate.getMonth()]} ${this.currentAllocationDate.getFullYear()}`;
  }

  prevAllocationMonth(): void {
    this.currentAllocationDate = new Date(this.currentAllocationDate.getFullYear(), this.currentAllocationDate.getMonth() - 1, 1);
    this.buildAllocationCalendar();
  }

  nextAllocationMonth(): void {
    this.currentAllocationDate = new Date(this.currentAllocationDate.getFullYear(), this.currentAllocationDate.getMonth() + 1, 1);
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
        claims: inCurrentMonth ? this.getDummyCalendarClaims(cellDate) : 0
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
    this.filteredAllocations = this.allocationEntries.filter(e => this.isSameDay(e.dateObj, day.date));

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
    return this.allocationCalendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
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

  getAllocationTotal(entry: AllocationEntry): number {
    return Number(((entry.approved || 0) + (entry.declined || 0) + (entry.pending || 0)).toFixed(1));
  }

  openAllocationTasks(entry: AllocationEntry): void {
    this.router.navigate(['/projects/dashboard/schedule/tasks'], {
      queryParams: {
        resource: entry.name,
        date: this.formatAllocationDate(entry.dateObj),
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  // openAllocationProjects(entry: AllocationEntry): void {
  //   if (this.allocationProjectsDialog) {
  //     this.dialog.open(this.allocationProjectsDialog, {
  //       width: '550px',
  //       maxWidth: '95vw',
  //       data: entry
  //     });
  //   }
  // }


   openAllocationProjects(entry: AllocationEntry): void {
      this.dialog.open(HoursProjectPopComponent, {
        width: '650px',
        maxWidth: '95vw',
        data: { entry }
      });
    }

  @ViewChild('allocationMessageDialog') allocationMessageDialog!: TemplateRef<any>;

  openAllocationMessages(entry: AllocationEntry): void {
    this.dialog.open(this.allocationMessageDialog, {
      width: '550px',
      maxWidth: '95vw',
      data: entry
    });
  }

  addAllocationMessage(entry: AllocationEntry, text: string): void {
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
}
