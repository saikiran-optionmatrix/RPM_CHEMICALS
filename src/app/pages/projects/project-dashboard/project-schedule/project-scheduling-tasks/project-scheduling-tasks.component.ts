import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HistoryPopComponent, HistoryRecord } from '../../../../../common/shared/history-pop/history-pop.component';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { SchedulingAddtaskComponent } from './scheduling-addtask/scheduling-addtask.component';

export interface TaskMessage {
  sender: string;
  date: string;
  text: string;
}

export interface ScheduleTask {
  id: number;
  projectCode: string;
  projectName?: string;
  deliverable: string;
  activity: string;
  task: string;
  hours: number;
  description: string;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  messages: number;
  lastUpdated: string;
  updatedBy: string;
  history: number;
  resourceName?: string;
  date?: string;
  messagesList?: TaskMessage[];
  isEditing?: boolean;
  _backup?: Partial<ScheduleTask>;
}

@Component({
  selector: 'app-project-scheduling-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './project-scheduling-tasks.component.html',
  styleUrl: './project-scheduling-tasks.component.scss',
})
export class ProjectSchedulingTasksComponent implements OnInit {
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  selectedResource: string = '';
  selectedDate: string = '';

  // Filter state
  showFilter: boolean = false;
  keyword: string = '';
  statusFilter: string = 'all';

  // Pagination state
  pageIndex: number = 0;
  pageSize: number = 10;

  // Active dialog state
  selectedTaskForMessage: ScheduleTask | null = null;
  currentTaskMessages: TaskMessage[] = [];
  newMessageText: string = '';
  messageDialogRef?: MatDialogRef<any>;

  resourceList: string[] = [
    'Rajesh Kumar',
    'Anita Desai',
    'Sunita Rao',
    'Rohan Verma',
    'Vikram Malhotra',
    'Kavita Patel',
    'Harish Iyer',
    'Arun Menon',
    'Pooja Singhania',
    'Sneha Kulkarni',
    'Amit Sharma',
    'Divya Pillai',
    'Karthik Rangan',
    'Neha Sengupta',
    'Suresh Naidu',
    'Meera Joshi',
    'Priya Reddy',
    'Deepak Chawla',
    'Manish Saxena',
    'Diego Ruiz',
    'Shalini Nair',
    'Carlos Mendez',
    'John Doe',
    'Priya Sharma',
    'Amit Patel',
    'Mia Chen',
    'Ana Vega'
  ];

  tasks: ScheduleTask[] = [
    {
      id: 1,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Feasibility',
      activity: 'Reference Product Characterization',
      task: 'Physicochemical characterization',
      hours: 4.5,
      description: 'Physicochemical characterization and comparative profiling against innovator.',
      approved: true,
      declined: false,
      pending: false,
      messages: 3,
      lastUpdated: '02-Jun-2026',
      updatedBy: 'Rajesh Kumar',
      history: 4,
      resourceName: 'Rajesh Kumar',
      date: '06-02-26',
      messagesList: [
        { sender: 'Dr. Anita Desai', date: '02-Jun-2026 10:15', text: 'Please ensure comparative benchmarking against market reference resin 50% solids.' },
        { sender: 'Rajesh Kumar', date: '02-Jun-2026 11:30', text: 'Testing completed with reference grade resin. Physicochemical data fully aligned.' },
        { sender: 'Dr. Anita Desai', date: '02-Jun-2026 14:00', text: 'Approved for regulatory documentation.' }
      ]
    },
    {
      id: 2,
      projectCode: '2026/CHM/001',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Concept Screening & Feasibility',
      activity: 'Monomer Feed Profile Optimization',
      task: 'Core-Shell Feed Ratio Profiling',
      hours: 3.5,
      description: 'Evaluation of core-shell monomer addition rate and temperature control stability under continuous feed.',
      approved: true,
      declined: false,
      pending: false,
      messages: 1,
      lastUpdated: '02-Jun-2026',
      updatedBy: 'Rajesh Kumar',
      history: 2,
      resourceName: 'Rajesh Kumar',
      date: '06-02-26',
      messagesList: [
        { sender: 'Rajesh Kumar', date: '02-Jun-2026 16:45', text: 'Core-shell monomer emulsion recipe stabilized at 50.2% solids content.' }
      ]
    },
    {
      id: 3,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Route Scouting & Lab Synthesis',
      activity: 'Reaction Calorimetry (RC1) Testing',
      task: 'Reaction Heat & Exotherm Monitoring',
      hours: 4.0,
      description: 'Isothermal reaction heat release and runaway exotherm potential determination in RC1 calorimeter.',
      approved: true,
      declined: false,
      pending: false,
      messages: 2,
      lastUpdated: '03-Jun-2026',
      updatedBy: 'Priya Sharma',
      history: 3,
      resourceName: 'Priya Sharma',
      date: '06-03-26',
      messagesList: [
        { sender: 'Priya Sharma', date: '03-Jun-2026 11:00', text: 'RC1 isothermal reaction heat measurement completed. Max heat release rate within jacket cooling limit.' },
        { sender: 'Team Lead', date: '03-Jun-2026 13:20', text: 'Data confirmed, please proceed with 500L pilot campaign batch prep.' }
      ]
    },
    {
      id: 4,
      projectCode: '2026/CHM/002',
      projectName: 'Waterborne Polyurethane Dispersion',
      deliverable: 'Concept Screening & Feasibility',
      activity: 'Surfactant & Initiator Compatibility',
      task: 'Emulsifier HLB Optimization',
      hours: 4.0,
      description: 'Anionic vs non-ionic surfactant compatibility and emulsion droplet stability testing under high shear.',
      approved: false,
      declined: false,
      pending: true,
      messages: 0,
      lastUpdated: '03-Jun-2026',
      updatedBy: 'Priya Sharma',
      history: 1,
      resourceName: 'Priya Sharma',
      date: '06-03-26',
      messagesList: []
    },
    {
      id: 5,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Process Optimization (Lab Scale)',
      activity: 'Laboratory Emulsion Polymerization Scouting',
      task: 'Lab Reactor Polymerization Run',
      hours: 5.0,
      description: 'Evaluation of solids content, viscosity curve, conversion percentage, and minimum film formation temperature.',
      approved: true,
      declined: false,
      pending: false,
      messages: 4,
      lastUpdated: '04-Jun-2026',
      updatedBy: 'Carlos Mendez',
      history: 5,
      resourceName: 'Carlos Mendez',
      date: '06-04-26',
      messagesList: [
        { sender: 'Carlos Mendez', date: '04-Jun-2026 09:30', text: 'Pilot batch 01 monomer feed completed successfully at 180 rpm agitation.' },
        { sender: 'Carlos Mendez', date: '04-Jun-2026 12:00', text: 'Disintegration time is within 3 minutes.' },
        { sender: 'QA Lead', date: '04-Jun-2026 14:15', text: 'Friability test passed at 0.2% weight loss.' },
        { sender: 'Carlos Mendez', date: '04-Jun-2026 16:30', text: 'Batch documentation submitted for review.' }
      ]
    },
    {
      id: 6,
      projectCode: '2026/CHM/003',
      projectName: 'High Purity Electronic Grade IPA',
      deliverable: 'Process Optimization (Lab Scale)',
      activity: 'Continuous Stripping & VOC Reduction',
      task: 'Steam Stripping Parameter Optimization',
      hours: 3.0,
      description: 'Binder addition rate and impeller speed DOE study for granule growth.',
      approved: false,
      declined: true,
      pending: false,
      messages: 2,
      lastUpdated: '04-Jun-2026',
      updatedBy: 'Carlos Mendez',
      history: 2,
      resourceName: 'Carlos Mendez',
      date: '06-04-26',
      messagesList: [
        { sender: 'Reviewer', date: '04-Jun-2026 15:00', text: 'Declined due to insufficient torque sensor calibration data.' },
        { sender: 'Carlos Mendez', date: '04-Jun-2026 16:00', text: 'Noted. Recalibration scheduled before retry.' }
      ]
    },
    {
      id: 7,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Analytical',
      activity: 'Assay Method Development',
      task: 'HPLC Method Optimization',
      hours: 4.5,
      description: 'Mobile phase gradient optimization and retention time verification for active drug substance.',
      approved: true,
      declined: false,
      pending: false,
      messages: 1,
      lastUpdated: '05-Jun-2026',
      updatedBy: 'John Doe',
      history: 3,
      resourceName: 'John Doe',
      date: '06-05-26',
      messagesList: [
        { sender: 'John Doe', date: '05-Jun-2026 17:00', text: 'Resolution between analyte and internal standard is > 2.5.' }
      ]
    },
    {
      id: 8,
      projectCode: '2026/CHM/001',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Analytical',
      activity: 'Related Substances Method',
      task: 'Degradation Products Identification',
      hours: 3.5,
      description: 'Forced degradation study under acid, base, peroxide, and heat stress conditions.',
      approved: false,
      declined: false,
      pending: true,
      messages: 3,
      lastUpdated: '05-Jun-2026',
      updatedBy: 'John Doe',
      history: 2,
      resourceName: 'John Doe',
      date: '06-05-26',
      messagesList: [
        { sender: 'John Doe', date: '05-Jun-2026 11:20', text: 'Peroxide stress produced 2 new minor peaks.' },
        { sender: 'Senior Chemist', date: '05-Jun-2026 13:40', text: 'Check mass balance and peak purity using PDA.' },
        { sender: 'John Doe', date: '05-Jun-2026 16:00', text: 'PDA peak purity confirmed homogeneous.' }
      ]
    },
    {
      id: 9,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Process Safety & Regulatory Studies',
      activity: 'Solids Content & Viscosity Profiling',
      task: 'Brookfield Rheology Profiling',
      hours: 4.0,
      description: 'Multi-shear Brookfield viscosity and rheological flow curve profiling vs target benchmark resin.',
      approved: true,
      declined: false,
      pending: false,
      messages: 0,
      lastUpdated: '08-Jun-2026',
      updatedBy: 'Sunita Rao',
      history: 2,
      resourceName: 'Sunita Rao',
      date: '06-08-26',
      messagesList: []
    },
    {
      id: 10,
      projectCode: '2026/CHM/005',
      projectName: 'Waterborne Polyurethane Dispersion',
      deliverable: 'Process Safety & Regulatory Studies',
      activity: 'Disintegration Testing',
      task: 'Fast-Disintegrating Evaluation',
      hours: 4.0,
      description: 'Sub-30 second disintegration endpoint testing in oral simulation testing apparatus.',
      approved: true,
      declined: false,
      pending: false,
      messages: 1,
      lastUpdated: '08-Jun-2026',
      updatedBy: 'Sunita Rao',
      history: 1,
      resourceName: 'Sunita Rao',
      date: '06-08-26',
      messagesList: [
        { sender: 'Sunita Rao', date: '08-Jun-2026 15:30', text: 'Disintegration test met standard specifications (22 seconds).' }
      ]
    },
    {
      id: 11,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Pilot Plant Campaign',
      activity: 'Process Validation Protocol Drafting',
      task: 'Critical Process Parameters (CPP)',
      hours: 4.5,
      description: 'Critical process parameter definition and acceptance criteria matrix across 3 consecutive batches.',
      approved: true,
      declined: false,
      pending: false,
      messages: 2,
      lastUpdated: '22-Jun-2026',
      updatedBy: 'Amit Patel',
      history: 3,
      resourceName: 'Amit Patel',
      date: '06-22-26',
      messagesList: [
        { sender: 'Amit Patel', date: '22-Jun-2026 10:00', text: 'Draft protocol circulated to manufacturing and quality heads.' },
        { sender: 'QA Director', date: '22-Jun-2026 14:30', text: 'Protocol looks comprehensive and compliant with cGMP.' }
      ]
    },
    {
      id: 12,
      projectCode: '2026/CHM/010',
      projectName: 'Specialty Fluoropolymer Resin',
      deliverable: 'Pilot Plant Campaign',
      activity: 'Hold-Time Study Protocol',
      task: 'Granule Hold-Time Evaluation',
      hours: 3.5,
      description: 'Monomer emulsion pre-mix and finished polymer binder hold-time stability study protocol.',
      approved: false,
      declined: false,
      pending: true,
      messages: 1,
      lastUpdated: '22-Jun-2026',
      updatedBy: 'Amit Patel',
      history: 2,
      resourceName: 'Amit Patel',
      date: '06-22-26',
      messagesList: [
        { sender: 'Amit Patel', date: '22-Jun-2026 16:15', text: 'Waiting for stability chamber space reservation confirmation.' }
      ]
    },
    {
      id: 13,
      projectCode: '2026/CHM/006',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Regulatory Registration Filing (REACH / TSCA)',
      activity: 'Process Hazard Analysis (HAZOP) Review',
      task: 'Clinical Study Design Verification',
      hours: 4.5,
      description: 'Clinical study design, pharmacokinetic endpoints, and sample size statistical power calculation.',
      approved: false,
      declined: false,
      pending: true,
      messages: 5,
      lastUpdated: '25-Jun-2026',
      updatedBy: 'Diego Ruiz',
      history: 4,
      resourceName: 'Diego Ruiz',
      date: '06-25-26',
      messagesList: [
        { sender: 'Diego Ruiz', date: '25-Jun-2026 09:15', text: 'Sample size calculation complete with N=36 healthy volunteers.' },
        { sender: 'Biostatistician', date: '25-Jun-2026 11:30', text: 'Statistical power exceeds 90% for Cmax and AUC.' },
        { sender: 'Medical Director', date: '25-Jun-2026 14:00', text: 'Safety monitoring plan approved.' },
        { sender: 'Diego Ruiz', date: '25-Jun-2026 15:45', text: 'IRB submission packet assembled.' },
        { sender: 'Diego Ruiz', date: '25-Jun-2026 17:00', text: 'Pending final sign-off from regulatory affairs head.' }
      ]
    },
    {
      id: 14,
      projectCode: '2026/CHM/001',
      projectName: 'Acrylic Emulsion Binder 50% Solids',
      deliverable: 'Regulatory Registration Filing (REACH / TSCA)',
      activity: 'Ethics Committee Submission Package',
      task: 'Informed Consent Formulation',
      hours: 3.5,
      description: 'Informed consent, investigator brochure, and insurance certificate assembly for EC submission.',
      approved: false,
      declined: true,
      pending: false,
      messages: 2,
      lastUpdated: '25-Jun-2026',
      updatedBy: 'Diego Ruiz',
      history: 3,
      resourceName: 'Diego Ruiz',
      date: '06-25-26',
      messagesList: [
        { sender: 'EC Coordinator', date: '25-Jun-2026 13:00', text: 'Declined: Patient information leaflet requires simplified vernacular phrasing.' },
        { sender: 'Diego Ruiz', date: '25-Jun-2026 16:30', text: 'Revision in progress with medical writing team.' }
      ]
    }
  ];

  filteredTasks: ScheduleTask[] = [];

  get paginatedTasks(): ScheduleTask[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredTasks.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['resource']) {
        this.selectedResource = params['resource'];
      }
      if (params['date']) {
        this.selectedDate = params['date'];
      }

      if (this.selectedResource) {
        this.ensureTasksForResource(this.selectedResource, this.selectedDate);
      }
      this.applyFilter();
    });
  }

  ensureTasksForResource(resource: string, date?: string): void {
    if (!resource) return;
    const formattedDate = date || '02-Jun-2026';
    // Clear disparate or incomplete tasks for this resource so every single record has the identical dummy task breakdown
    this.tasks = this.tasks.filter(
      (t) => !t.resourceName || t.resourceName.toLowerCase() !== resource.toLowerCase()
    );
    const newTasks: ScheduleTask[] = this.createDefaultTasksForResource(resource, formattedDate);
    this.tasks.push(...newTasks);

    if (!this.resourceList.some((r) => r.toLowerCase() === resource.toLowerCase())) {
      this.resourceList.push(resource);
    }
  }

  createDefaultTasksForResource(resource: string, dateStr: string): ScheduleTask[] {
    const formattedDate = dateStr || '02-Jun-2026';
    return [
      {
        id: Date.now() + Math.floor(Math.random() * 1000) + 1,
        projectCode: this.projectCode || '2026/CHM/006',
        projectName: this.projectName || 'Acrylic Emulsion Binder 50% Solids',
        deliverable: 'Feasibility',
        activity: 'Reference Product Characterization',
        task: 'Physicochemical characterization',
        hours: 4.5,
        description: 'Physicochemical characterization and comparative profiling against innovator.',
        approved: true,
        declined: false,
        pending: false,
        messages: 3,
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 4,
        resourceName: resource,
        date: dateStr || '06-02-26',
        messagesList: [
          { sender: 'Dr. Anita Desai', date: `${formattedDate} 10:15`, text: 'Please ensure comparative benchmarking against market reference resin 50% solids.' },
          { sender: resource, date: `${formattedDate} 11:30`, text: 'Testing completed with reference grade resin. Physicochemical data fully aligned.' },
          { sender: 'Dr. Anita Desai', date: `${formattedDate} 14:00`, text: 'Approved for regulatory documentation.' }
        ]
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000) + 2,
        projectCode: '2026/CHM/001',
        projectName: 'Acrylic Emulsion Binder 50% Solids',
        deliverable: 'Concept Screening & Feasibility',
        activity: 'Monomer Feed Profile Optimization',
      task: 'Core-Shell Feed Ratio Profiling',
        hours: 3.5,
        description: 'Evaluation of core-shell monomer addition rate and temperature control stability under continuous feed.',
        approved: true,
        declined: false,
        pending: false,
        messages: 2,
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 2,
        resourceName: resource,
        date: dateStr || '06-02-26',
        messagesList: [
          { sender: resource, date: `${formattedDate} 16:45`, text: 'Core-shell monomer emulsion recipe stabilized at 50.2% solids content.' },
          { sender: 'Lead Scientist', date: `${formattedDate} 17:15`, text: 'Noted and verified.' }
        ]
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000) + 3,
        projectCode: this.projectCode || '2026/CHM/006',
        projectName: this.projectName || 'Acrylic Emulsion Binder 50% Solids',
        deliverable: 'Route Scouting & Lab Synthesis',
        activity: 'Reaction Calorimetry (RC1) Testing',
      task: 'Reaction Heat & Exotherm Monitoring',
        hours: 4.0,
        description: 'Isothermal reaction heat release and runaway exotherm potential determination in RC1 calorimeter.',
        approved: true,
        declined: false,
        pending: false,
        messages: 1,
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 3,
        resourceName: resource,
        date: dateStr || '06-02-26',
        messagesList: [
          { sender: resource, date: `${formattedDate} 14:20`, text: 'Solubility profile completed for pH 1.2, 4.5, and 6.8.' }
        ]
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000) + 4,
        projectCode: '2026/CHM/002',
        projectName: 'Waterborne Polyurethane Dispersion',
        deliverable: 'Route Scouting & Lab Synthesis',
        activity: 'Monomer & Initiator Stability',
      task: 'Peroxide Initiator Half-Life Testing',
        hours: 3.5,
        description: 'Thermal decomposition kinetics and shelf-life stability evaluation with persulfate redox initiators.',
        approved: false,
        declined: false,
        pending: true,
        messages: 2,
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 2,
        resourceName: resource,
        date: dateStr || '06-02-26',
        messagesList: [
          { sender: resource, date: `${formattedDate} 11:00`, text: 'Samples placed in 50°C chamber for binary blend compatibility.' },
          { sender: 'QA Reviewer', date: `${formattedDate} 15:30`, text: 'Pending HPLC analysis report.' }
        ]
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/schedule'], {
      queryParams: {
        view: 'allocation',
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  applyFilter(): void {
    if (this.selectedResource) {
      this.ensureTasksForResource(this.selectedResource, this.selectedDate);
    }

    this.filteredTasks = this.tasks.filter((t) => {
      // Resource filter
      if (this.selectedResource && t.resourceName && t.resourceName.toLowerCase() !== this.selectedResource.toLowerCase()) {
        return false;
      }

      // Status filter
      if (this.statusFilter === 'approved' && !t.approved) {
        return false;
      }
      if (this.statusFilter === 'declined' && !t.declined) {
        return false;
      }
      if (this.statusFilter === 'pending' && !t.pending) {
        return false;
      }

      // Keyword filter
      if (this.keyword && this.keyword.trim()) {
        const query = this.keyword.toLowerCase().trim();
        const combined = `${t.projectCode} ${t.deliverable} ${t.activity} ${t.task} ${t.description} ${t.updatedBy}`.toLowerCase();
        if (!combined.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Safeguard: Never let it be empty for any record or view
    if (this.filteredTasks.length === 0) {
      const targetRes = this.selectedResource || 'Rajesh Kumar';
      const fallbackTasks = this.createDefaultTasksForResource(targetRes, this.selectedDate || '02-Jun-2026');
      this.tasks.push(...fallbackTasks);
      this.filteredTasks = [...fallbackTasks];
    }

    // Reset pagination to first page when filtering
    this.pageIndex = 0;
  }

  clearFilter(): void {
    this.keyword = '';
    this.statusFilter = 'all';
    this.selectedResource = '';
    this.applyFilter();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openEditTask(task: ScheduleTask): void {
    const dialogRef = this.dialog.open(SchedulingAddtaskComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        task: task
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        task.projectCode = res.projectCode;
        if (res.projectName) {
          task.projectName = res.projectName;
        }
        task.deliverable = res.deliverable;
        task.activity = res.activity;
        task.task = res.task;
        task.hours = Number(res.hours) || 0;
        task.description = res.description;
        task.lastUpdated = this.formatDate(new Date());
        task.history = (task.history || 0) + 1;
        this.applyFilter();
      }
    });
  }

  deleteTask(task: ScheduleTask): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Scheduling Task',
        content: `Are you sure you want to delete the task "${task.task}"?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.applyFilter();
      }
    });
  }

  toggleStatus(task: ScheduleTask, type: 'approved' | 'declined' | 'pending', checked: boolean): void {
    if (checked) {
      task.approved = type === 'approved';
      task.declined = type === 'declined';
      task.pending = type === 'pending';
    } else {
      task[type] = false;
      // If unchecked, default to pending if none is selected
      if (!task.approved && !task.declined && !task.pending) {
        task.pending = true;
      }
    }
    task.lastUpdated = this.formatDate(new Date());
    task.history = (task.history || 0) + 1;
  }

  // Messages Dialog
  openMessages(task: ScheduleTask): void {
    this.selectedTaskForMessage = task;
    if (!task.messagesList) {
      task.messagesList = [];
    }
    this.currentTaskMessages = task.messagesList;
    this.newMessageText = '';

    if (this.messageDialog) {
      this.messageDialogRef = this.dialog.open(this.messageDialog, {
        width: '550px',
        maxWidth: '95vw',
        data: task
      });
    }
  }

  openMessagesDialog(task: ScheduleTask): void {
    this.openMessages(task);
  }

  addMessage(task?: ScheduleTask, text?: string): void {
    const targetTask = task || this.selectedTaskForMessage;
    const msgText = (text !== undefined ? text : this.newMessageText).trim();
    if (!msgText || !targetTask) {
      return;
    }

    if (!targetTask.messagesList) {
      targetTask.messagesList = [];
    }

    const newMsg: TaskMessage = {
      sender: this.selectedResource || 'Lead Reviewer',
      date: new Date().toISOString().split('T')[0],
      text: msgText
    };

    targetTask.messagesList.push(newMsg);
    targetTask.messages = targetTask.messagesList.length;
    this.currentTaskMessages = targetTask.messagesList;
    this.newMessageText = '';
  }

  // History Navigation
  openHistory(task: ScheduleTask): void {
    const currentUrl = this.router.url || '';
    const targetRoute = currentUrl.includes('/schedule-tasks')
      ? '/projects/dashboard/schedule-tasks-history'
      : '/projects/dashboard/schedule/tasks/history';

    this.router.navigate([targetRoute], {
      queryParams: {
        taskId: task.id,
        projectCode: task.projectCode,
        projectName: task.projectName || this.projectName,
        deliverable: task.deliverable,
        activity: task.activity,
        taskName: task.task,
        hours: task.hours,
        description: task.description,
        approved: task.approved,
        declined: task.declined,
        pending: task.pending,
        historyCount: task.history || 3,
        lastUpdated: task.lastUpdated,
        updatedBy: task.updatedBy,
        resource: this.selectedResource,
        date: this.selectedDate
      },
      queryParamsHandling: 'merge'
    });
  }

  private getHistoryRecords(task: ScheduleTask): HistoryRecord[] {
    const records: HistoryRecord[] = [];
    const currentStatus = task.approved ? 'Approved' : task.declined ? 'Declined' : 'Pending';

    records.push({
      columnName: 'Status',
      previousValue: task.pending ? 'New' : 'Pending',
      updatedValue: currentStatus,
      updatedDate: `${task.lastUpdated} 10:30`,
      updatedBy: task.updatedBy
    });

    records.push({
      columnName: 'Hours',
      previousValue: `${(task.hours > 1 ? task.hours - 1 : 2).toFixed(1)}`,
      updatedValue: `${task.hours.toFixed(1)}`,
      updatedDate: `${task.lastUpdated} 09:15`,
      updatedBy: task.updatedBy
    });

    records.push({
      columnName: 'Deliverable',
      previousValue: 'Initial Drafting',
      updatedValue: task.deliverable,
      updatedDate: '01-Jun-2026 14:00',
      updatedBy: task.updatedBy
    });

    records.push({
      columnName: 'Description',
      previousValue: 'Draft task allocation',
      updatedValue: task.description,
      updatedDate: '01-Jun-2026 11:20',
      updatedBy: task.updatedBy
    });

    return records;
  }

  // Add Task Modal
  openAddTask(): void {
    const dialogRef = this.dialog.open(SchedulingAddtaskComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        task: {
          projectCode: this.projectCode || '2026/CHM/006',
          deliverable: '',
          activity: '',
          task: '',
          hours: null,
          description: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const createdTask: ScheduleTask = {
          id: Date.now(),
          projectCode: res.projectCode || this.projectCode || '2026/CHM/006',
          projectName: res.projectName || this.projectName,
          deliverable: res.deliverable || '',
          activity: res.activity || '',
          task: res.task || '',
          hours: Number(res.hours) || 0,
          description: res.description || '',
          approved: false,
          declined: false,
          pending: true,
          messages: 0,
          lastUpdated: this.formatDate(new Date()),
          updatedBy: this.selectedResource || 'Current User',
          history: 1,
          resourceName: this.selectedResource || 'Current User',
          messagesList: []
        };

        this.tasks.unshift(createdTask);
        this.applyFilter();
      }
    });
  }

  formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
}
