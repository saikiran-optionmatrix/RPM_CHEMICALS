import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SchedulingAddtaskComponent } from '../../../projects/project-dashboard/project-schedule/project-scheduling-tasks/scheduling-addtask/scheduling-addtask.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent, HistoryRecord } from '../../../../common/shared/history-pop/history-pop.component';

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
  lastUpdated: string;
  updatedBy: string;
  history: number;
  resourceName?: string;
  date?: string;
}

@Component({
  selector: 'app-hours-scheduling-tasks',
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
    MatSelectModule,
  ],
  templateUrl: './hours-scheduling-tasks.component.html',
  styleUrl: './hours-scheduling-tasks.component.scss',
})
export class HoursSchedulingTasksComponent implements OnInit {
  selectedResource: string = '';
  selectedDate: string = '';

  // Filter state
  showFilter: boolean = false;
  keyword: string = '';
  statusFilter: string = 'all';

  // Pagination state
  pageIndex: number = 0;
  pageSize: number = 10;

  tasks: ScheduleTask[] = [];
  filteredTasks: ScheduleTask[] = [];

  get paginatedTasks(): ScheduleTask[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredTasks.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedResource = params['resource'] || 'Rajesh Kumar';
      this.selectedDate = params['date'] || '06-02-26';

      this.tasks = this.createDefaultTasksForResource(this.selectedResource, this.selectedDate);
      this.applyFilter();
    });
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter((t) => {
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

    this.pageIndex = 0;
  }

  clearFilter(): void {
    this.keyword = '';
    this.statusFilter = 'all';
    this.applyFilter();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openAddTask(): void {
    const dialogRef = this.dialog.open(SchedulingAddtaskComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        task: {
          projectCode: '2026/CHM/006',
          deliverable: '',
          activity: '',
          task: '',
          hours: null,
          description: '',
        },
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const createdTask: ScheduleTask = {
          id: Date.now(),
          projectCode: res.projectCode || '2026/CHM/006',
          projectName: res.projectName || 'Acrylic Emulsion Binder 50% Solids',
          deliverable: res.deliverable || '',
          activity: res.activity || '',
          task: res.task || '',
          hours: Number(res.hours) || 0,
          description: res.description || '',
          approved: false,
          declined: false,
          pending: true,
          lastUpdated: this.formatDate(new Date()),
          updatedBy: this.selectedResource || 'Current User',
          history: 1,
          resourceName: this.selectedResource || 'Current User',
          date: this.selectedDate || '06-02-26',
        };

        this.tasks.unshift(createdTask);
        this.applyFilter();
      }
    });
  }

  openEditTask(task: ScheduleTask): void {
    const dialogRef = this.dialog.open(SchedulingAddtaskComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        task: task,
      },
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
        content: `Are you sure you want to delete the task "${task.task}"?`,
      },
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
      if (!task.approved && !task.declined && !task.pending) {
        task.pending = true;
      }
    }
    task.lastUpdated = this.formatDate(new Date());
    task.history = (task.history || 0) + 1;
  }

  openHistory(task: ScheduleTask): void {
    const currentStatus = task.approved ? 'Approved' : task.declined ? 'Declined' : 'Pending';
    const records: HistoryRecord[] = [
      {
        columnName: 'Status',
        previousValue: task.pending ? 'New' : 'Pending',
        updatedValue: currentStatus,
        updatedDate: `${task.lastUpdated} 10:30`,
        updatedBy: task.updatedBy || this.selectedResource || 'Admin',
      },
      {
        columnName: 'Hours',
        previousValue: `${(task.hours > 1 ? task.hours - 1 : 2).toFixed(1)}`,
        updatedValue: `${task.hours.toFixed(1)}`,
        updatedDate: `${task.lastUpdated} 09:15`,
        updatedBy: task.updatedBy || this.selectedResource || 'Admin',
      },
      {
        columnName: 'Deliverable',
        previousValue: 'Initial Drafting',
        updatedValue: task.deliverable,
        updatedDate: `${task.lastUpdated} 08:45`,
        updatedBy: task.updatedBy || this.selectedResource || 'Admin',
      },
      {
        columnName: 'Description',
        previousValue: 'Draft task allocation',
        updatedValue: task.description,
        updatedDate: `${task.lastUpdated} 08:30`,
        updatedBy: task.updatedBy || this.selectedResource || 'Admin',
      },
    ];

    this.dialog.open(HistoryPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: {
        name: task.task,
        label: 'Task Name',
        title: 'Task History',
        records: records,
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/hours/scheduling']);
  }

  createDefaultTasksForResource(resource: string, dateStr: string): ScheduleTask[] {
    const formattedDate = dateStr || '02-Jun-2026';

    const library: { [name: string]: ScheduleTask[] } = {
      'Rajesh Kumar': [
        {
          id: 101,
          projectCode: '2026/CHM/006',
          projectName: 'Acrylic Emulsion Binder 50% Solids',
          deliverable: 'Reaction Kinetics',
          activity: 'Reaction Calorimetry (RC1) Testing',
          task: 'Emulsion Polymerization Exotherm Profiling',
          hours: 7.0,
          description: 'Reaction calorimetry and heat of polymerization measurement in 2L RC1 reactor.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 4,
          resourceName: resource,
          date: dateStr,
        },
        {
          id: 102,
          projectCode: '2026/CHM/001',
          projectName: 'Waterborne Polyurethane Dispersion',
          deliverable: 'Process Chemistry',
          activity: 'Prepolymer Synthesis & Chain Extension',
          task: 'Isocyanate Consumption Kinetics',
          hours: 5.0,
          description: 'Monitoring NCO% titration during prepolymer formation and amine chain extension.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 2,
          resourceName: resource,
          date: dateStr,
        },
        {
          id: 103,
          projectCode: '2026/CHM/002',
          projectName: 'Bio-based Epoxy Crosslinker',
          deliverable: 'Quality Control',
          activity: 'Accelerated Thermal Aging Study',
          task: 'Viscosity and Gel Time Monitoring',
          hours: 4.0,
          description: 'Stability profiling under elevated temperature (50°C) storage conditions.',
          approved: false,
          declined: false,
          pending: true,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 3,
          resourceName: resource,
          date: dateStr,
        },
        {
          id: 104,
          projectCode: '2026/CHM/006',
          projectName: 'Acrylic Emulsion Binder 50% Solids',
          deliverable: 'Formulation Engineering',
          activity: 'Monomer Feed Rate Optimization',
          task: 'Starved-Feed Polymerization Rate Study',
          hours: 4.0,
          description: 'Metering pump feed profile to maintain low instantaneous conversion and narrow particle size.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 2,
          resourceName: resource,
          date: dateStr,
        },
      ],
      'Anita Desai': [
        {
          id: 201,
          projectCode: '2026/CHM/006',
          projectName: 'Acrylic Emulsion Binder 50% Solids',
          deliverable: 'Process Chemistry',
          activity: 'Surfactant System Screening',
          task: 'Critical Micelle Concentration (CMC) Assay',
          hours: 4.5,
          description: 'Interfacial surface tension and CMC evaluation of anionic/non-ionic emulsifier packages.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 2,
          resourceName: resource,
          date: dateStr,
        },
        {
          id: 202,
          projectCode: '2026/CHM/002',
          projectName: 'Bio-based Epoxy Crosslinker',
          deliverable: 'Process Development',
          activity: 'Catalyst Screening & Reaction Optimization',
          task: 'Epoxide Ring-Opening Rate Analysis',
          hours: 3.0,
          description: 'Functional screening of tertiary amine and imidazole catalysts for curing performance.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 1,
          resourceName: resource,
          date: dateStr,
        },
      ],
      'Neha Sengupta': [
        {
          id: 301,
          projectCode: '2026/CHM/006',
          projectName: 'Acrylic Emulsion Binder 50% Solids',
          deliverable: 'Process Safety & Quality',
          activity: 'QbD Critical Process Parameter Matrix',
          task: 'Process FMEA & CQA Assessment',
          hours: 4.5,
          description: 'Failure modes and effect analysis for agitation speed, jacket temp, and feed rate.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 3,
          resourceName: resource,
          date: dateStr,
        },
        {
          id: 302,
          projectCode: '2026/CHM/005',
          projectName: 'Polyamide 66 High-Tenacity Resin',
          deliverable: 'Polymer Engineering',
          activity: 'Solid-State Polycondensation (SSP)',
          task: 'SSP Reactor Nitrogen Flow & Temp Profiling',
          hours: 3.0,
          description: 'Optimizing moisture stripping and molecular weight buildup in SSP tumbling reactor.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 2,
          resourceName: resource,
          date: dateStr,
        },
      ],
      'Kavita Patel': [
        {
          id: 401,
          projectCode: '2026/CHM/006',
          projectName: 'Acrylic Emulsion Binder 50% Solids',
          deliverable: 'Materials Characterization',
          activity: 'Thermal & Rheological Testing',
          task: 'DSC Glass Transition & MFFT Testing',
          hours: 4.0,
          description: 'Differential scanning calorimetry Tg determination and minimum film forming temp (MFFT).',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 2,
          resourceName: resource,
          date: dateStr,
        },
        {
          id: 402,
          projectCode: '2026/CHM/007',
          projectName: 'Specialty Fluoropolymer Resin',
          deliverable: 'Materials Testing',
          activity: 'Gel Permeation Chromatography (GPC)',
          task: 'Molecular Weight Distribution Assay',
          hours: 3.0,
          description: 'High temperature GPC analysis for Mw, Mn and polydispersity index.',
          approved: true,
          declined: false,
          pending: false,
          lastUpdated: formattedDate,
          updatedBy: resource,
          history: 1,
          resourceName: resource,
          date: dateStr,
        },
      ],
    };

    if (library[resource]) {
      return library[resource];
    }

    // Default template for any other resource
    return [
      {
        id: Date.now() + 1,
        projectCode: '2026/CHM/006',
        projectName: 'Acrylic Emulsion Binder 50% Solids',
        deliverable: 'Process Engineering',
        activity: 'Monomer Emulsion Preparation',
        task: 'Pre-Emulsion Droplet Size Stability',
        hours: 4.5,
        description: 'High-shear homogenization and pre-emulsion stability verification.',
        approved: true,
        declined: false,
        pending: false,
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 3,
        resourceName: resource,
        date: dateStr,
      },
      {
        id: Date.now() + 2,
        projectCode: '2026/CHM/001',
        projectName: 'Waterborne Polyurethane Dispersion',
        deliverable: 'Analytical Testing',
        activity: 'Residual Monomer & VOC Assay',
        task: 'Headspace GC-MS Impurity Profiling',
        hours: 3.5,
        description: 'Gas chromatography determination of residual monomers and free VOCs.',
        approved: false,
        declined: false,
        pending: true,
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 2,
        resourceName: resource,
        date: dateStr,
      },
    ];
  }

  formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
}
