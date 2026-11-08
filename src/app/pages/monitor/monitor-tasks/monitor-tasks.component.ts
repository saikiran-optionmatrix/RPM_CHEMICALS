import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
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

import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ProjectWbsTasksComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-tasks/project-wbs-tasks.component';

export interface MonitorTaskItem {
  id: number;
  IsActive: boolean;
  Done: boolean;
  ProjectCode: string;
  TaskName: string;
  ProjectName: string;
  Department: string;
  Role: string;
  DueDate: string;
  CompletedDate: string;
  Remarks?: string;
  isDateExceeded?: boolean;
  delayReason?: string;
}

@Component({
  selector: 'app-monitor-tasks',
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
  templateUrl: './monitor-tasks.component.html',
  styleUrl: './monitor-tasks.component.scss'
})
export class MonitorTasksComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  // View & Toggle States
  showFilter = false;
  excludeCompleted = false;
  isOverdueOnly = false;
  isFullKit = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalSize = 0;

  // Data
  rawTasks: MonitorTaskItem[] = [];
  paginatedTasks: MonitorTaskItem[] = [];

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectCode: [null],
    Department: [null],
    Role: [null],
    FromDate: [null],
    ToDate: [null],
    ActiveOnly: [false]
  });

  // Edit Modal State
  showEditModal = false;
  currentEditItem: MonitorTaskItem | null = null;
  editForm: FormGroup = this.fb.group({
    ProjectCode: [''],
    TaskName: [''],
    ProjectName: [''],
    Department: [''],
    Role: [''],
    DueDate: [''],
    CompletedDate: [''],
    Remarks: [''],
    IsActive: [true],
    Done: [false]
  });

  departmentOptions: string[] = [
    'Process Chemistry',
    'Finance & Project Management',
    'Regulatory Affairs',
    'Quality Assurance',
    'Sourcing & Procurement',
    'Project Strategy',
    'Chemical Engineering',
    'Formulation Development',
    'Process Safety',
    'Analytical Development'
  ];

  roleOptions: string[] = [
    'Process Chemistry Lead',
    'Project Finance Lead',
    'Regulatory Affairs Specialist',
    'Vendor Quality Specialist',
    'Raw Material Buyer',
    'Project Strategy Manager',
    'Separation Process Engineer',
    'Reaction Engineering Lead',
    'Formulation Scientist',
    'Process Safety Lead',
    'Analytical Chemist'
  ];

  ngOnInit(): void {
    this.initMockTasks();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  initMockTasks(): void {
    this.rawTasks = [
      {
        id: 1,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/001',
        TaskName: 'Polyurethane dispersion literature and chemistry review protocol',
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        Department: 'Process Chemistry',
        Role: 'Process Chemistry Lead',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Literature review and synthesis protocol signed off.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/001',
        TaskName: 'Preliminary cost of manufacturing and project budget estimate',
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        Department: 'Finance & Project Management',
        Role: 'Project Finance Lead',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'Vendor raw material quotes pending for polyols and chain extenders.',
        isDateExceeded: true,
        delayReason: 'Raw Material Cost Quote Pending'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/002',
        TaskName: 'Applicable regulations and registration pathway matrix (REACH / TSCA / India)',
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        Department: 'Regulatory Affairs',
        Role: 'Regulatory Affairs Specialist',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'Registration dossiers and regulatory requirements mapped for target jurisdictions.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/002',
        TaskName: 'Catalyst vendor and lab capability audits',
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        Department: 'Quality Assurance',
        Role: 'Vendor Quality Specialist',
        DueDate: '2026-03-10',
        CompletedDate: '',
        Remarks: 'Vendor audit CAPA items pending closure from carbon support vendor.',
        isDateExceeded: false,
        delayReason: 'Vendor Audit Observation Closure Pending'
      },
      {
        id: 5,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/003',
        TaskName: 'Long-lead reagent and intermediate identification and early vendor outreach',
        ProjectName: 'Agrochemical Active Ingredient Synthesis Development',
        Department: 'Sourcing & Procurement',
        Role: 'Raw Material Buyer',
        DueDate: '2026-01-25',
        CompletedDate: '2026-01-24',
        Remarks: 'Long-lead building blocks identified; vendor outreach completed.',
        isDateExceeded: false
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/003',
        TaskName: 'Target product profile (TPP) drafting',
        ProjectName: 'Agrochemical Active Ingredient Synthesis Development',
        Department: 'Project Strategy',
        Role: 'Project Strategy Manager',
        DueDate: '2026-02-10',
        CompletedDate: '2026-02-09',
        Remarks: 'Target product profile specifications agreed with commercial stakeholders.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/004',
        TaskName: 'Distillation column internals and packing concept',
        ProjectName: 'Solvent Recovery & Fractional Distillation Process Development',
        Department: 'Chemical Engineering',
        Role: 'Separation Process Engineer',
        DueDate: '2026-02-25',
        CompletedDate: '',
        Remarks: 'Wire gauze vs sheet structured packing trade-off study in progress.',
        isDateExceeded: true,
        delayReason: 'Packing Specification Conflict'
      },
      {
        id: 8,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/004',
        TaskName: 'Product target and process success criteria cascade',
        ProjectName: 'Solvent Recovery & Fractional Distillation Process Development',
        Department: 'Process Chemistry',
        Role: 'Reaction Engineering Lead',
        DueDate: '2026-03-05',
        CompletedDate: '',
        Remarks: 'Solvent purity criteria and recycle efficiency targets cascaded.',
        isDateExceeded: false,
        delayReason: 'Success Criteria Review Revision'
      },
      {
        id: 9,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/005',
        TaskName: 'Target crop and regulatory-region shortlist',
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        Department: 'Project Strategy',
        Role: 'Project Strategy Manager',
        DueDate: '2026-01-30',
        CompletedDate: '2026-01-29',
        Remarks: 'Target crop registrations and region prioritization finalized.',
        isDateExceeded: false
      },
      {
        id: 10,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/005',
        TaskName: 'Toll agreements and long-lead material order release',
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        Department: 'Sourcing & Procurement',
        Role: 'Raw Material Buyer',
        DueDate: '2026-03-15',
        CompletedDate: '',
        Remarks: 'Toll manufacturing quotes under evaluation.',
        isDateExceeded: false
      },
      {
        id: 11,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/005',
        TaskName: 'Surfactant and dispersant sourcing for WDG formulation',
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        Department: 'Formulation Development',
        Role: 'Formulation Scientist',
        DueDate: '2026-03-20',
        CompletedDate: '',
        Remarks: 'Polymeric dispersant sampling underway.',
        isDateExceeded: false,
        delayReason: 'Dispersant Supply Delay'
      },
      {
        id: 12,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/005',
        TaskName: 'Granule process trial design and safety approval',
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        Department: 'Process Safety',
        Role: 'Process Safety Lead',
        DueDate: '2026-03-28',
        CompletedDate: '',
        Remarks: 'Dust explosion and runaway hazard test slot reserved.',
        isDateExceeded: false,
        delayReason: 'Pilot Lab Slot Availability'
      }
    ];

    this.applyFilter();
  }

  // --- Filter & Pagination ---

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
    this.isFullKit = false;
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
    let filtered = [...this.rawTasks];
    const formVals = this.filterForm.value;

    if (this.excludeCompleted) {
      filtered = filtered.filter(t => !t.Done);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => !t.Done && t.DueDate && t.DueDate < today);
    }

    if (formVals.Keyword && formVals.Keyword.trim()) {
      const kw = formVals.Keyword.trim().toLowerCase();
      filtered = filtered.filter(t =>
        t.ProjectCode.toLowerCase().includes(kw) ||
        t.TaskName.toLowerCase().includes(kw) ||
        t.ProjectName.toLowerCase().includes(kw) ||
        t.Department.toLowerCase().includes(kw) ||
        t.Role.toLowerCase().includes(kw) ||
        (t.Remarks && t.Remarks.toLowerCase().includes(kw))
      );
    }

    if (formVals.ProjectCode && formVals.ProjectCode.trim()) {
      const pc = formVals.ProjectCode.trim().toLowerCase();
      filtered = filtered.filter(t => t.ProjectCode.toLowerCase().includes(pc));
    }

    if (formVals.Department) {
      filtered = filtered.filter(t => t.Department === formVals.Department);
    }

    if (formVals.Role) {
      filtered = filtered.filter(t => t.Role === formVals.Role);
    }

    if (formVals.FromDate) {
      filtered = filtered.filter(t => t.DueDate >= formVals.FromDate);
    }

    if (formVals.ToDate) {
      filtered = filtered.filter(t => t.DueDate <= formVals.ToDate);
    }

    if (formVals.ActiveOnly) {
      filtered = filtered.filter(t => t.IsActive);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.paginatedTasks = filtered.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorTaskItem): void {
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
    } else if (!item.Done) {
      item.CompletedDate = '';
    }
  }

  onEditTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(ProjectWbsTasksComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: item,
        tasks: item.TaskName
          ? [
              {
                name: item.TaskName,
                dueDate: item.DueDate || '2026-02-15',
                completedDate: item.CompletedDate || '2026-02-14'
              }
            ]
          : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.tasks && result.tasks.length > 0) {
        const lastTask = result.tasks[result.tasks.length - 1];
        if (lastTask?.name) {
          item.TaskName = lastTask.name;
        }
        if (lastTask?.dueDate) {
          item.DueDate = lastTask.dueDate;
        }
        if (lastTask?.completedDate) {
          item.CompletedDate = lastTask.completedDate;
        }
        this.applyFilter();
      }
    });
  }

  saveEditTask(): void {
    if (!this.currentEditItem) return;
    const formVals = this.editForm.value;
    Object.assign(this.currentEditItem, {
      ProjectCode: formVals.ProjectCode,
      TaskName: formVals.TaskName,
      ProjectName: formVals.ProjectName,
      Department: formVals.Department,
      Role: formVals.Role,
      DueDate: formVals.DueDate,
      CompletedDate: formVals.CompletedDate,
      Remarks: formVals.Remarks,
      IsActive: formVals.IsActive,
      Done: formVals.Done
    });
    this.closeEditModal();
    this.applyFilter();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentEditItem = null;
  }

  onDeleteTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawTasks = this.rawTasks.filter(t => t.id !== item.id);
        this.applyFilter();
      }
    });
  }

  openProject(item: MonitorTaskItem): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  // --- Date Exceeded Helper ---
  isDateExceeded(item: MonitorTaskItem): boolean {
    if (item.isDateExceeded !== undefined) {
      return item.isDateExceeded;
    }
    if (item.CompletedDate && item.DueDate) {
      return item.CompletedDate > item.DueDate;
    }
    if (!item.Done && item.DueDate) {
      const today = new Date().toISOString().split('T')[0];
      return item.DueDate < today;
    }
    return false;
  }

  // --- Scrolling logic ---
  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
