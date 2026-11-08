import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddProjActivityComponent } from '../../projects/project-dashboard/project-activities/add-proj-activity/add-proj-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface ActivityTask {
  IsActive: boolean;
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;       // <--- Added for Stage column
  Module?: string;      // <--- Added for Deliverable column
  PercentCompletion: number;
  TaskName: string;
  TaskType: string;
  Responsibility: string;
  Duration: string;
  Effort: string;
  Description: string;
  PlanStart: string;
  PlanEnd: string;
  ActualStart: string;
  ActualEnd: string;
  ETA: string;
  Status: string;
  Priority: string;
  Complexity: string;
  Template: string;
  delayReason?: string;
}

export interface CalendarCard {
  hour: string;
  user: string;
  dayPlacement: number;
  taskName: string;
  projectName: string;
  status: string;
  planStart: string;
  color: string;
  pInitials: string;
}

@Component({
  selector: 'app-monitor-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule
],
  templateUrl: './monitor-activities.component.html',
  styleUrls: ['./monitor-activities.component.scss']
})
export class MonitorActivitiesComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View & Toggle States
  showFilter: boolean = false;
  isCalendarView: boolean = false;
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  isOverdueOnly: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5]; // Default: Mon-Fri

  // Modal States
  showTimelineModal: boolean = false;
  selectedTimelineTask: ActivityTask | null = null;

  // Data Arrays
  rawProjects: ActivityTask[] = [];
  allProjects: ActivityTask[] = [];
  calendarCards: CalendarCard[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  // Permissions
  readonly canUpdate: boolean = true;
  readonly canDelete: boolean = true;

  // Clock
  currentTime: string = '';
  private timeInterval: any;

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectName: [null],
    DateType: [null],
    FromDate: [null],
    ToDate: [null],
    Status: [null],
    Priority: [null],
    Complexity: [null],
    ActiveOnly: [false]
  });

  // Master Lists
  readonly hoursList: string[] = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  ngOnInit(): void {
    this.getAllProjects();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);

    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.overdueSub?.unsubscribe();
  }

getAllProjects(): void {
    const mockData: ActivityTask[] = [
      {
        IsActive: true,
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        ProjectCode: '2026/CHM/001',
        Stage: 'S1 - Opportunity Identification',
        Module: 'Market and application analysis',
        PercentCompletion: 100,
        TaskName: 'Application and market literature review',
        TaskType: 'Planning',
        Responsibility: 'Dr. Priya Raman',
        Duration: '10 days',
        Effort: '80',
        Description: 'Application and market literature review on polyurethane dispersion formulations, unmet end-user needs and market potential.',
        PlanStart: '2026-01-05',
        PlanEnd: '2026-01-15',
        ActualStart: '2026-01-05',
        ActualEnd: '2026-01-14',
        ETA: '2026-01-14',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Specialty Chemical Process Development Program',
        delayReason: '-'
      },
      {
        IsActive: true,
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        ProjectCode: '2026/CHM/001',
        Stage: 'S1 - Opportunity Identification',
        Module: 'Project economics and risk screening',
        PercentCompletion: 75,
        TaskName: 'Chemistry feasibility and hazard screening',
        TaskType: 'Process Safety',
        Responsibility: 'Rajesh Kumar',
        Duration: '12 days',
        Effort: '96',
        Description: 'Screen reaction chemistry, evaluate thermal hazard screening via RC1/DSC calorimetry and identify safety constraints.',
        PlanStart: '2026-01-16',
        PlanEnd: '2026-01-28',
        ActualStart: '2026-01-16',
        ActualEnd: '',
        ETA: '2026-01-30',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Specialty Chemical Process Development Program',
        delayReason: 'Calorimetry Data Generation Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        ProjectCode: '2026/CHM/001',
        Stage: 'S3 - Route Scouting & Lab Synthesis',
        Module: 'Raw material and screening setup',
        PercentCompletion: 40,
        TaskName: 'Polyol and isocyanate screening study',
        TaskType: 'R&D',
        Responsibility: 'Anita Desai',
        Duration: '15 days',
        Effort: '120',
        Description: 'Screen bio-based polyols and diisocyanates for target molecular weight, chain extender ratio and dispersion stability.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-15',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'Specialty Chemical Process Development Program',
        delayReason: 'Raw Material Sample Qualification Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        ProjectCode: '2026/CHM/002',
        Stage: 'S2 - Concept Screening & Feasibility',
        Module: 'Feasibility plan and success criteria',
        PercentCompletion: 100,
        TaskName: 'Catalyst performance targets and success criteria',
        TaskType: 'Planning',
        Responsibility: 'Priya Reddy',
        Duration: '10 days',
        Effort: '60',
        Description: 'Define catalyst activity, turnover frequency, metal dispersion targets and commercial success criteria.',
        PlanStart: '2026-01-10',
        PlanEnd: '2026-01-20',
        ActualStart: '2026-01-10',
        ActualEnd: '2026-01-19',
        ETA: '2026-01-19',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Specialty Chemical Process Development Program',
        delayReason: '-'
      },
      {
        IsActive: true,
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        ProjectCode: '2026/CHM/002',
        Stage: 'S2 - Concept Screening & Feasibility',
        Module: 'Regulatory and intellectual property strategy',
        PercentCompletion: 60,
        TaskName: 'Regulatory pathway and registration strategy outline',
        TaskType: 'Regulatory',
        Responsibility: 'Suresh Naidu',
        Duration: '8 days',
        Effort: '48',
        Description: 'Outline registration strategy under REACH, EPA TSCA and India chemical management regulations.',
        PlanStart: '2026-01-22',
        PlanEnd: '2026-01-30',
        ActualStart: '2026-01-22',
        ActualEnd: '',
        ETA: '2026-02-05',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Specialty Chemical Process Development Program',
        delayReason: 'Regulatory Consultant Meeting Slot Unavailable'
      },
      {
        IsActive: false,
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        ProjectCode: '2026/CHM/002',
        Stage: 'S3 - Route Scouting & Lab Synthesis',
        Module: 'Catalyst screening campaign',
        PercentCompletion: 20,
        TaskName: 'Primary catalyst screening campaign',
        TaskType: 'R&D',
        Responsibility: 'Amit Patel',
        Duration: '14 days',
        Effort: '110',
        Description: 'Screen carbon support precursors, palladium loading levels and reduction protocols in autoclave reactors.',
        PlanStart: '2026-02-05',
        PlanEnd: '2026-02-19',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-02-22',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Specialty Chemical Process Development Program',
        delayReason: 'Catalyst Vendor Dispatch Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Agrochemical Active Ingredient Synthesis Development',
        ProjectCode: '2026/CHM/003',
        Stage: 'S3 - Route Scouting & Lab Synthesis',
        Module: 'Reaction confirmation and triage',
        PercentCompletion: 90,
        TaskName: 'Reaction step confirmation and yield testing',
        TaskType: 'R&D',
        Responsibility: 'Dr. Priya Raman',
        Duration: '12 days',
        Effort: '90',
        Description: 'Confirm individual reaction steps, conversion kinetics and isolate crude active ingredient for yield benchmarking.',
        PlanStart: '2026-01-15',
        PlanEnd: '2026-01-27',
        ActualStart: '2026-01-15',
        ActualEnd: '2026-01-26',
        ETA: '2026-01-26',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Agrochemical Active Ingredient Process Development',
        delayReason: 'Reagent Vendor Dispatch Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Agrochemical Active Ingredient Synthesis Development',
        ProjectCode: '2026/CHM/003',
        Stage: 'S3 - Route Scouting & Lab Synthesis',
        Module: 'Intermediate characterization',
        PercentCompletion: 70,
        TaskName: 'Intermediate characterization and impurity mapping',
        TaskType: 'Analytical',
        Responsibility: 'Rajesh Kumar',
        Duration: '14 days',
        Effort: '105',
        Description: 'Map impurity purge factors, validate intermediate HPLC/GC profiles and document structure elucidation.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-14',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Agrochemical Active Ingredient Process Development',
        delayReason: 'Impurity Method Reproducibility Verification'
      },
      {
        IsActive: true,
        ProjectName: 'Solvent Recovery & Fractional Distillation Process Development',
        ProjectCode: '2026/CHM/004',
        Stage: 'S2 - Concept Screening & Feasibility',
        Module: 'Technology and equipment strategy',
        PercentCompletion: 80,
        TaskName: 'Separation technology and equipment selection',
        TaskType: 'Chemical Engineering',
        Responsibility: 'Anita Desai',
        Duration: '16 days',
        Effort: '120',
        Description: 'Select distillation packing type, column dimensions, condenser metallurgy and vacuum pump specifications.',
        PlanStart: '2026-01-20',
        PlanEnd: '2026-02-05',
        ActualStart: '2026-01-20',
        ActualEnd: '',
        ETA: '2026-02-05',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Continuous Flow Process Development Platform',
        delayReason: '-'
      },
      {
        IsActive: true,
        ProjectName: 'Solvent Recovery & Fractional Distillation Process Development',
        ProjectCode: '2026/CHM/004',
        Stage: 'S4 - Process Optimization (Lab Scale)',
        Module: 'Distillation optimization campaign',
        PercentCompletion: 50,
        TaskName: 'Fractional distillation column design study',
        TaskType: 'Chemical Engineering',
        Responsibility: 'Priya Reddy',
        Duration: '16 days',
        Effort: '128',
        Description: 'Model vapor-liquid equilibrium (VLE), optimize reflux ratio and evaluate HETP for structured wire gauze packing.',
        PlanStart: '2026-02-10',
        PlanEnd: '2026-02-26',
        ActualStart: '2026-02-10',
        ActualEnd: '',
        ETA: '2026-03-01',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Continuous Flow Process Development Platform',
        delayReason: 'Packing Vendor Lead-Time Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        ProjectCode: '2026/CHM/005',
        Stage: 'S2 - Concept Screening & Feasibility',
        Module: 'Compatibility screening',
        PercentCompletion: 65,
        TaskName: 'Binder and dispersant compatibility screening',
        TaskType: 'Formulation',
        Responsibility: 'Amit Patel',
        Duration: '15 days',
        Effort: '100',
        Description: 'Screen polymeric dispersants, wetting agents and lignosulfonate binders for high-load technical active ingredient.',
        PlanStart: '2026-01-12',
        PlanEnd: '2026-01-27',
        ActualStart: '2026-01-12',
        ActualEnd: '',
        ETA: '2026-01-30',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Agrochemical Active Ingredient Process Development',
        delayReason: 'Dispersant Supply Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        ProjectCode: '2026/CHM/005',
        Stage: 'S2 - Concept Screening & Feasibility',
        Module: 'Performance testing',
        PercentCompletion: 35,
        TaskName: 'Granule disintegration and suspensibility testing',
        TaskType: 'Formulation',
        Responsibility: 'Suresh Naidu',
        Duration: '20 days',
        Effort: '160',
        Description: 'Evaluate CIPAC suspensibility, wet sieve residue and accelerated storage stability at 54°C.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-21',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-25',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Agrochemical Active Ingredient Process Development',
        delayReason: 'Pilot Lab Slot Availability'
      }
    ];

    this.rawProjects = mockData;
    this.applyFilter();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#2563eb'; // Blue
    if (percent > 30 && percent <= 80) return '#f59e0b'; // Amber
    if (percent === 100) return '#10b981'; // Green
    return '#3b82f6';
  }

  updateTime(): void {
    const now = new Date();
    const formattedHours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.currentTime = `${formattedHours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  }

  // --- Filtering & Pagination ---

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onClear(): void {
    this.filterForm.reset();
    this.excludeCompleted = false;
    this.isOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  onExcludeCompletedChange(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onOverdueChange(): void {
    this.currentPage = 0;
    this.monitorStateService.setOverdue(this.isOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.isOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilter();
    this.cdr.markForCheck();
  }

  applyFilter(): void {
    let filtered = [...this.rawProjects];

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100 && !!p.PlanEnd && p.PlanEnd < today);
    }

    // Add additional logic here to filter using this.filterForm.value

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.allProjects = filtered.slice(start, start + this.pageSize);
    this.generateCalendarData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  isDateExceeded(item: ActivityTask): boolean {
    if (item.Status === 'Completed' || item.PercentCompletion === 100) {
      return false;
    }
    if (!item.PlanEnd) {
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    return item.PlanEnd < today;
  }

  // --- View Toggles ---

  showCalendarView(): void { this.isCalendarView = true; }
  showGridView(): void { this.isCalendarView = false; }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const statusColors: Record<string, string> = {
      'Completed': '#a0e4ff',
      'Progress': '#ffea9f',
      'Hold': '#ffcdd2',
      'Pending': '#e3b2ff'
    };

    const daysToDistribute = this.showWeekend ? 7 : 5;

    this.calendarCards = this.allProjects.map((project, i) => ({
      hour: this.hoursList[i % this.hoursList.length],
      user: project.Responsibility,
      dayPlacement: (i % daysToDistribute) + 1,
      taskName: project.TaskName,
      projectName: project.ProjectName,
      status: project.Status,
      planStart: project.PlanStart,
      color: statusColors[project.Status] || '#d1fae5',
      pInitials: project.TaskName.substring(0, 2).toUpperCase()
    }));
  }

  // --- Actions ---

  // onAddTask(): void {
  //   this.dialog.open(AddProjActivityComponent, { width: '900px', maxWidth: '95vw', data: { isEditMode: false } });
  // }

  onEditTask(item: ActivityTask): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        ...item,
        Deliverable: item.Module || (item as any).Deliverable || 'Module1',
        Stage: item.Stage || 'Feasibility',
        isEditMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          Module: result.Deliverable || item.Module,
          Stage: result.stage || item.Stage,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort
        });
        this.generateCalendarData();
        this.applyFilter();
      }
    });
  }

  onDeleteTask(item: ActivityTask): void {
    if (!this.canDelete) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  // onStatusToggle(item: ActivityTask): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: { title: 'Change Status', content: 'Are you sure you want to Change the Status?' }
  //   });
  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (!confirmed) {
  //       item.IsActive = !item.IsActive; // Revert change
  //     }
  //     this.generateCalendarData();
  //   });
  // }

  // openGridView(): void {
  //   this.dialog.open(FreezepanesDialogComponent, { width: 'auto', height: 'auto' });
  // }

  openProject(item: ActivityTask): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  openPdf(fileName: string): void {
    window.open(`assets/${fileName}`, '_blank');
  }

  // --- Timeline Modal ---

  openTimelineModal(task: ActivityTask): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  scrollLeft(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }
  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
