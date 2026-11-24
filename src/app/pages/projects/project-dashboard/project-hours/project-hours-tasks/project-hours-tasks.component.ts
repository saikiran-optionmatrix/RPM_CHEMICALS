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
import { SchedulingAddtaskComponent } from '../../project-schedule/project-scheduling-tasks/scheduling-addtask/scheduling-addtask.component';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

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
  messages?: number;
  lastUpdated: string;
  updatedBy: string;
  history: number;
  resourceName?: string;
  date?: string;
}

@Component({
  selector: 'app-project-hours-tasks',
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
  templateUrl: './project-hours-tasks.component.html',
  styleUrl: './project-hours-tasks.component.scss',
})
export class ProjectHoursTasksComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  selectedResource: string = '';
  selectedDate: string = '';

  // Filter state
  keyword: string = '';
  statusFilter: string = 'all';

  // Pagination state
  pageIndex: number = 0;
  pageSize: number = 10;

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
      lastUpdated: '02-Jun-2026',
      updatedBy: 'Rajesh Kumar',
      history: 4,
      resourceName: 'Rajesh Kumar',
      date: '06-02-26'
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
      lastUpdated: '02-Jun-2026',
      updatedBy: 'Rajesh Kumar',
      history: 2,
      resourceName: 'Rajesh Kumar',
      date: '06-02-26'
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
      lastUpdated: '03-Jun-2026',
      updatedBy: 'Priya Sharma',
      history: 3,
      resourceName: 'Priya Sharma',
      date: '06-03-26'
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
      lastUpdated: '03-Jun-2026',
      updatedBy: 'Priya Sharma',
      history: 1,
      resourceName: 'Priya Sharma',
      date: '06-03-26'
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
      lastUpdated: '04-Jun-2026',
      updatedBy: 'Carlos Mendez',
      history: 5,
      resourceName: 'Carlos Mendez',
      date: '06-04-26'
    },
    {
      id: 6,
      projectCode: '2026/CHM/003',
      projectName: 'High Purity Electronic Grade IPA',
      deliverable: 'Process Optimization (Lab Scale)',
      activity: 'Continuous Stripping & VOC Reduction',
      task: 'Steam Stripping Parameter Optimization',
      hours: 3.0,
      description: 'Stripping temperature, vacuum level, and stripping time optimization to lower residual monomer below 50 ppm.',
      approved: false,
      declined: false,
      pending: true,
      lastUpdated: '04-Jun-2026',
      updatedBy: 'Carlos Mendez',
      history: 2,
      resourceName: 'Carlos Mendez',
      date: '06-04-26'
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
    private dialog: MatDialog
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
    this.tasks = this.tasks.filter(
      (t) => !t.resourceName || t.resourceName.toLowerCase() !== resource.toLowerCase()
    );
    const newTasks: ScheduleTask[] = this.createDefaultTasksForResource(resource, formattedDate);
    this.tasks.push(...newTasks);
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
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 4,
        resourceName: resource,
        date: dateStr || '06-02-26'
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
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 2,
        resourceName: resource,
        date: dateStr || '06-02-26'
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
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 3,
        resourceName: resource,
        date: dateStr || '06-02-26'
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
        lastUpdated: formattedDate,
        updatedBy: resource,
        history: 2,
        resourceName: resource,
        date: dateStr || '06-02-26'
      }
    ];
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

    if (this.filteredTasks.length === 0) {
      const targetRes = this.selectedResource || 'Rajesh Kumar';
      const fallbackTasks = this.createDefaultTasksForResource(targetRes, this.selectedDate || '02-Jun-2026');
      this.tasks.push(...fallbackTasks);
      this.filteredTasks = [...fallbackTasks];
    }

    this.pageIndex = 0;
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
        title: 'Delete Task',
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
      if (!task.approved && !task.declined && !task.pending) {
        task.pending = true;
      }
    }
    task.lastUpdated = this.formatDate(new Date());
    task.history = (task.history || 0) + 1;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/hours'], {
      queryParams: {
        projectName: this.projectName,
        projectCode: this.projectCode
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
