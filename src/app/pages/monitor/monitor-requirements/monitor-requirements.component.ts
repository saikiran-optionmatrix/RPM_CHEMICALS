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
import { ProjectWbsRequirementsComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-requirements/project-wbs-requirements.component';

export interface MonitorRequirementItem {
  id: number;
  IsActive: boolean;
  Done: boolean;
  ProjectCode: string;
  RequirementName: string;
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
  selector: 'app-monitor-requirements',
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
  templateUrl: './monitor-requirements.component.html',
  styleUrl: './monitor-requirements.component.scss'
})
export class MonitorRequirementsComponent implements OnInit, OnDestroy {
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
  rawRequirements: MonitorRequirementItem[] = [];
  paginatedRequirements: MonitorRequirementItem[] = [];

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
  currentEditItem: MonitorRequirementItem | null = null;
  editForm: FormGroup = this.fb.group({
    ProjectCode: [''],
    RequirementName: [''],
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
    'Polymers & Resins',
    'Regulatory & EHS',
    'Analytical Development & QC',
    'Process & Manufacturing',
    'Supply Chain & Quality',
    'Sourcing & Procurement'
  ];

  roleOptions: string[] = [
    'Polymer Lead',
    'Polymer Scientist',
    'Regulatory Affairs Specialist',
    'Analytical Chemist',
    'Process Development Manager',
    'QA Chemist',
    'Hazmat Storage Specialist',
    'Raw Material Buyer'
  ];

  ngOnInit(): void {
    this.initMockRequirements();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  initMockRequirements(): void {
    this.rawRequirements = [
      {
        id: 1,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/001',
        RequirementName: 'Solids Content and Particle Size (>=35% solids, <=150 nm) Specification',
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        Department: 'Polymers & Resins',
        Role: 'Polymer Lead',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Analytical particle size and solids content criteria met across bench batches.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/001',
        RequirementName: 'Film Formation and Mechanical Property Acceptance Limits',
        ProjectName: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
        Department: 'Polymers & Resins',
        Role: 'Polymer Scientist',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'Test panel coating evaluation slot awaiting lab clearance.',
        isDateExceeded: true,
        delayReason: 'Test Panel Lab Slot Unavailable'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/002',
        RequirementName: 'Catalyst Metal Loading and Activity Specification',
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        Department: 'Regulatory & EHS',
        Role: 'Regulatory Affairs Specialist',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'Palladium loading target (5 wt%) and turnover frequency validated.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: false,
        Done: false,
        ProjectCode: '2026/CHM/002',
        RequirementName: 'Leachable Metal Residue Method Sensitivity Target',
        ProjectName: 'Hydrogenation Catalyst Development (Pd/C)',
        Department: 'Analytical Development & QC',
        Role: 'Analytical Chemist',
        DueDate: '2026-03-05',
        CompletedDate: '',
        Remarks: 'Reference standards for trace metal analysis in procurement queue.',
        isDateExceeded: false,
        delayReason: 'Reference Standard Qualification Delay'
      },
      {
        id: 5,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/003',
        RequirementName: 'Impurity Profile and Isomer Ratio Similarity Criteria',
        ProjectName: 'Agrochemical Active Ingredient Synthesis Development',
        Department: 'Analytical Development & QC',
        Role: 'Analytical Chemist',
        DueDate: '2026-03-12',
        CompletedDate: '',
        Remarks: 'Isomer ratio and impurity purge factors under HPLC verification.',
        isDateExceeded: false
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/003',
        RequirementName: 'Batch Reactor Yield Target (>=85% Overall)',
        ProjectName: 'Agrochemical Active Ingredient Synthesis Development',
        Department: 'Process & Manufacturing',
        Role: 'Process Development Manager',
        DueDate: '2026-02-10',
        CompletedDate: '2026-02-09',
        Remarks: 'Three consecutive lab runs confirmed overall yield >= 86.4%.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: false,
        Done: false,
        ProjectCode: '2026/CHM/004',
        RequirementName: 'Water Content and Peroxide Release Limits for Recovered Solvent Lots',
        ProjectName: 'Solvent Recovery & Fractional Distillation Process Development',
        Department: 'Supply Chain & Quality',
        Role: 'QA Chemist',
        DueDate: '2026-03-25',
        CompletedDate: '',
        Remarks: 'Coulometric Karl Fischer titration protocol drafted.',
        isDateExceeded: false,
        delayReason: 'Karl Fischer Lab Backlog'
      },
      {
        id: 8,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/004',
        RequirementName: 'Hazardous Storage Architecture for Flammable Solvents (Flameproof, Earthed)',
        ProjectName: 'Solvent Recovery & Fractional Distillation Process Development',
        Department: 'Supply Chain & Quality',
        Role: 'Hazmat Storage Specialist',
        DueDate: '2026-02-05',
        CompletedDate: '2026-02-18',
        Remarks: 'Fire safety alarm and earthing bonding completed after initial due date.',
        isDateExceeded: true,
        delayReason: 'Fire Safety Alarm Sign-off'
      },
      {
        id: 9,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/CHM/005',
        RequirementName: 'Global Registration Submission Matrix (REACH / EPA / CIB&RC)',
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        Department: 'Regulatory & EHS',
        Role: 'Regulatory Affairs Specialist',
        DueDate: '2026-04-02',
        CompletedDate: '',
        Remarks: 'Global registration dossier matrix and test requirements finalized.',
        isDateExceeded: false
      },
      {
        id: 10,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/CHM/005',
        RequirementName: 'Technical-Grade Active Ingredient Supplier Qualification',
        ProjectName: 'Water-Dispersible Granule (WDG) Formulation Development',
        Department: 'Sourcing & Procurement',
        Role: 'Raw Material Buyer',
        DueDate: '2026-01-30',
        CompletedDate: '2026-01-29',
        Remarks: 'Supplier audit and impurity profile comparability approved.',
        isDateExceeded: false
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
    let filtered = [...this.rawRequirements];
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
        t.RequirementName.toLowerCase().includes(kw) ||
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
    this.paginatedRequirements = filtered.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorRequirementItem): void {
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
    } else if (!item.Done) {
      item.CompletedDate = '';
    }
  }

  onEditRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(ProjectWbsRequirementsComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: item,
        requirements: item.RequirementName
          ? [
              {
                name: item.RequirementName,
                dueDate: item.DueDate || '2026-02-15',
                completedDate: item.CompletedDate || '2026-02-14'
              }
            ]
          : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.requirements && result.requirements.length > 0) {
        const lastReq = result.requirements[result.requirements.length - 1];
        if (lastReq?.name) {
          item.RequirementName = lastReq.name;
        }
        if (lastReq?.dueDate) {
          item.DueDate = lastReq.dueDate;
        }
        if (lastReq?.completedDate) {
          item.CompletedDate = lastReq.completedDate;
        }
        this.applyFilter();
      }
    });
  }

  saveEditRequirement(): void {
    if (!this.currentEditItem) return;
    const formVals = this.editForm.value;
    Object.assign(this.currentEditItem, {
      ProjectCode: formVals.ProjectCode,
      RequirementName: formVals.RequirementName,
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

  onDeleteRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawRequirements = this.rawRequirements.filter(t => t.id !== item.id);
        this.applyFilter();
      }
    });
  }

  openProject(item: MonitorRequirementItem): void {
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
  isDateExceeded(item: MonitorRequirementItem): boolean {
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
