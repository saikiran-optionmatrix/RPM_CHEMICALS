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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AddWbsRequirementComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-requirements/add-wbs-requirement/add-wbs-requirement.component';
import { DocumentsPopComponent } from '../../../common/shared/documents-pop/documents-pop.component';

export interface CalendarDayItem {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  count: number;
  isBacklog: boolean;
}

export interface MonitorRequirementItem {
  isBacklog?: boolean;
  id: number | string;
  IsActive?: boolean;
  active?: boolean;
  Done?: boolean;
  done?: boolean;
  Approve?: boolean;
  approve?: boolean;
  ProjectCode?: string;
  projectCode?: string;
  RequirementName: string;
  requirementName?: string;
  ProjectName?: string;
  projectName?: string;
  Department: string;
  department?: string;
  Role?: string;
  role?: string;
  Responsibility?: string;
  responsibility?: string;
  DueDate: string;
  dueDate?: string;
  CompletedDate: string;
  completedDate?: string;
  Remarks?: string;
  remarks?: string;
  isDateExceeded?: boolean;
  delayReason?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './monitor-requirements.component.html',
  styleUrl: './monitor-requirements.component.scss'
})
export class MonitorRequirementsComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('calendarTableContainer') calendarTableContainer!: ElementRef<HTMLDivElement>;

  activeView: 'calendar' | 'table' = 'calendar';

  readonly monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  readonly dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentCalendarDate: Date = new Date(2026, 9, 1); // October 2026
  selectedCalendarDate: Date | null = null;
  calendarDays: CalendarDayItem[] = [];

  readonly todayReference: Date = new Date(2026, 9, 10); // 10-Oct-2026

  calendarFilteredRequirements: MonitorRequirementItem[] = [];
  calendarPaginatedRequirements: MonitorRequirementItem[] = [];
  calendarPageIndex: number = 0;
  calendarPageSize: number = 10;
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

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];
  readonly documentsSequence: number[] = [3, 1, 4, 2, 5, 2, 4, 1, 3, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  readonly realPersonNames: string[] = [
    'Dr. Sarah Connor',
    'James Miller',
    'Emily Watson',
    'Michael Scott',
    'Robert Chen',
    'Jessica Alba',
    'David Kim',
    'Olivia Brown',
    'Aarav Shah',
    'Dr. Sarah Jenkins',
    'Dr. Priya R.',
    'Rahul K.'
  ];

  departmentOptions: string[] = [
    'Formulation',
    'Analytical',
    'Regulatory',
    'Supply Chain',
    'Quality Assurance',
    'Quality Control',
    'Clinical Research',
    'Medical Affairs'
  ];

  roleOptions: string[] = [
    'Formulator',
    'Analytical Lead',
    'Regulatory Affairs Specialist',
    'QA Auditor',
    'QC Analyst',
    'Clinical Research Associate',
    'Supply Chain Planner',
    'Medical Reviewer'
  ];

  ngOnInit(): void {
    this.initMockRequirements();
    this.buildCalendarDays();
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) || this.calendarDays.find(d => d.inCurrentMonth);
    if (defaultDay) { this.selectCalendarDate(defaultDay); }
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
            "id": 1,
            "IsActive": true,
            "Done": true,
            "ProjectCode": "2026/CHM/001",
            "RequirementName": "Solids Content and Particle Size (>=35% solids, <=150 nm) Specification",
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "Department": "Polymers & Resins",
            "Role": "Polymer Lead",
            "DueDate": "2026-02-15",
            "CompletedDate": "2026-02-14",
            "Remarks": "Requirement validated and approved.",
            "isDateExceeded": false,
            "delayReason": ""
      },
      {
            "id": 2,
            "IsActive": true,
            "Done": false,
            "ProjectCode": "2026/CHM/001",
            "RequirementName": "Film Formation and Mechanical Property Acceptance Limits",
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "Department": "Polymers & Resins",
            "Role": "Polymer Scientist",
            "DueDate": "2026-02-28",
            "CompletedDate": "",
            "Remarks": "Delayed: Test Panel Lab Slot Unavailable",
            "isDateExceeded": true,
            "delayReason": "Test Panel Lab Slot Unavailable"
      },
      {
            "id": 3,
            "IsActive": true,
            "Done": true,
            "ProjectCode": "2026/CHM/002",
            "RequirementName": "Catalyst Metal Loading and Activity Specification",
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "Department": "Regulatory & EHS",
            "Role": "Regulatory Affairs Specialist",
            "DueDate": "2026-01-20",
            "CompletedDate": "2026-01-19",
            "Remarks": "Requirement validated and approved.",
            "isDateExceeded": false,
            "delayReason": ""
      },
      {
            "id": 4,
            "IsActive": false,
            "Done": false,
            "ProjectCode": "2026/CHM/002",
            "RequirementName": "Leachable Metal Residue Method Sensitivity Target",
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "Department": "Analytical Development & QC",
            "Role": "Analytical Chemist",
            "DueDate": "2026-03-05",
            "CompletedDate": "",
            "Remarks": "Delayed: Reference Standard Qualification Delay",
            "isDateExceeded": true,
            "delayReason": "Reference Standard Qualification Delay"
      },
      {
            "id": 5,
            "IsActive": true,
            "Done": false,
            "ProjectCode": "2026/CHM/003",
            "RequirementName": "Impurity Profile and Isomer Ratio Similarity Criteria",
            "ProjectName": "Agrochemical Active Ingredient Synthesis Development",
            "Department": "Analytical Development & QC",
            "Role": "Analytical Chemist",
            "DueDate": "2026-03-12",
            "CompletedDate": "",
            "Remarks": "Verification in progress.",
            "isDateExceeded": false,
            "delayReason": ""
      },
      {
            "id": 6,
            "IsActive": true,
            "Done": true,
            "ProjectCode": "2026/CHM/003",
            "RequirementName": "Batch Reactor Yield Target (>=85% Overall)",
            "ProjectName": "Agrochemical Active Ingredient Synthesis Development",
            "Department": "Process & Manufacturing",
            "Role": "Process Development Manager",
            "DueDate": "2026-02-10",
            "CompletedDate": "2026-02-09",
            "Remarks": "Requirement validated and approved.",
            "isDateExceeded": false,
            "delayReason": ""
      },
      {
            "id": 7,
            "IsActive": false,
            "Done": false,
            "ProjectCode": "2026/CHM/004",
            "RequirementName": "Water Content and Peroxide Release Limits for Recovered Solvent Lots",
            "ProjectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "Department": "Supply Chain & Quality",
            "Role": "QA Chemist",
            "DueDate": "2026-03-25",
            "CompletedDate": "",
            "Remarks": "Delayed: Karl Fischer Lab Backlog",
            "isDateExceeded": true,
            "delayReason": "Karl Fischer Lab Backlog"
      },
      {
            "id": 8,
            "IsActive": true,
            "Done": true,
            "ProjectCode": "2026/CHM/004",
            "RequirementName": "Hazardous Storage Architecture for Flammable Solvents (Flameproof, Earthed)",
            "ProjectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "Department": "Supply Chain & Quality",
            "Role": "Hazmat Storage Specialist",
            "DueDate": "2026-02-05",
            "CompletedDate": "2026-02-18",
            "Remarks": "Delayed: Fire Safety Alarm Sign-off",
            "isDateExceeded": true,
            "delayReason": "Fire Safety Alarm Sign-off"
      },
      {
            "id": 9,
            "IsActive": true,
            "Done": false,
            "ProjectCode": "2026/CHM/005",
            "RequirementName": "Global Registration Submission Matrix (REACH / EPA / CIB&RC)",
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "Department": "Regulatory & EHS",
            "Role": "Regulatory Affairs Specialist",
            "DueDate": "2026-04-02",
            "CompletedDate": "",
            "Remarks": "Verification in progress.",
            "isDateExceeded": false,
            "delayReason": ""
      },
      {
            "id": 10,
            "IsActive": true,
            "Done": true,
            "ProjectCode": "2026/CHM/005",
            "RequirementName": "Technical-Grade Active Ingredient Supplier Qualification",
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "Department": "Sourcing & Procurement",
            "Role": "Raw Material Buyer",
            "DueDate": "2026-01-30",
            "CompletedDate": "2026-01-29",
            "Remarks": "Requirement validated and approved.",
            "isDateExceeded": false,
            "delayReason": ""
      }
];

    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    this.rawRequirements.forEach((item, idx) => {
      item.done = item.Done ?? item.done ?? false;
      item.Done = item.done;
      item.approve = item.Approve ?? item.approve ?? (item.Done || idx % 2 === 0);
      item.Approve = item.approve;
      item.requirementName = item.RequirementName || item.requirementName || '';
      item.RequirementName = item.requirementName;
      item.department = item.Department || item.department || 'Analytical';
      item.Department = item.department;
      item.responsibility = item.Responsibility || item.Role || item.role || this.realPersonNames[idx % this.realPersonNames.length];
      item.Responsibility = item.responsibility;
      item.Role = item.responsibility;
      item.dueDate = item.DueDate || item.dueDate || '2026-02-15';
      item.DueDate = item.dueDate;
      item.completedDate = item.CompletedDate || item.completedDate || '';
      item.CompletedDate = item.completedDate;
      item.remarks = item.Remarks || item.remarks || 'Standard requirement';
      item.Remarks = item.remarks;
      item.documentsCount = item.documentsCount || this.getDocumentsCount(idx);
      item.historyCount = item.historyCount || this.getHistoryCount(idx);
      item.updatedDate = item.updatedDate || sampleDates[idx % sampleDates.length];
      item.updatedBy = item.updatedBy || item.responsibility;
      const dayNum = ((idx * 3) % 28) + 1;
      const dueDay = String(dayNum).padStart(2, '0');
      const startDay = String(Math.max(1, dayNum - 4)).padStart(2, '0');
      const itemIsBacklog = dayNum < 10;
      item.dueDate = `2026-10-${dueDay}`;
      item.DueDate = item.dueDate;
      item.isBacklog = itemIsBacklog;
    });

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
      filtered = filtered.filter(t => !t.Done && !t.done);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => (!t.Done && !t.done) && (t.DueDate || t.dueDate || '') < today && (t.DueDate || t.dueDate || '') !== '');
    }

    if (formVals.Keyword && formVals.Keyword.trim()) {
      const kw = formVals.Keyword.trim().toLowerCase();
      filtered = filtered.filter(t =>
        (t.ProjectCode || '').toLowerCase().includes(kw) ||
        (t.RequirementName || t.requirementName || '').toLowerCase().includes(kw) ||
        (t.ProjectName || '').toLowerCase().includes(kw) ||
        (t.Department || t.department || '').toLowerCase().includes(kw) ||
        (t.Role || t.role || t.Responsibility || t.responsibility || '').toLowerCase().includes(kw) ||
        (t.Remarks || t.remarks || '').toLowerCase().includes(kw)
      );
    }

    if (formVals.ProjectCode && formVals.ProjectCode.trim()) {
      const pc = formVals.ProjectCode.trim().toLowerCase();
      filtered = filtered.filter(t => (t.ProjectCode || '').toLowerCase().includes(pc));
    }

    if (formVals.Department) {
      filtered = filtered.filter(t => (t.Department || t.department) === formVals.Department);
    }

    if (formVals.Role) {
      filtered = filtered.filter(t => (t.Role || t.role || t.Responsibility || t.responsibility) === formVals.Role);
    }

    if (formVals.FromDate) {
      filtered = filtered.filter(t => (t.DueDate || t.dueDate || '') >= formVals.FromDate);
    }

    if (formVals.ToDate) {
      filtered = filtered.filter(t => (t.DueDate || t.dueDate || '') <= formVals.ToDate);
    }

    if (formVals.ActiveOnly) {
      filtered = filtered.filter(t => t.IsActive || t.active);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.paginatedRequirements = filtered.slice(start, start + this.pageSize);
    this.updateCalendarTableData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorRequirementItem): void {
    item.done = item.Done;
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
      item.completedDate = item.CompletedDate;
    } else if (!item.Done) {
      item.CompletedDate = '';
      item.completedDate = '';
    }
  }

  onApproveChange(item: MonitorRequirementItem): void {
    item.approve = item.Approve;
  }

  onEditRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(AddWbsRequirementComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        ...item,
        requirementName: item.RequirementName || item.requirementName,
        department: item.Department || item.department,
        role: item.Responsibility || item.Role || item.role,
        responsibility: item.Responsibility || item.Role || item.role,
        dueDate: item.DueDate || item.dueDate,
        completedDate: item.CompletedDate || item.completedDate,
        remarks: item.Remarks || item.remarks
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.RequirementName = result.requirementName ?? item.RequirementName;
        item.requirementName = item.RequirementName;
        item.Department = result.department ?? item.Department;
        item.department = item.Department;
        item.Role = result.responsibility ?? result.role ?? item.Role;
        item.role = item.Role;
        item.Responsibility = item.Role;
        item.responsibility = item.Role;
        item.DueDate = result.dueDate ?? item.DueDate;
        item.dueDate = item.DueDate;
        item.CompletedDate = result.completedDate ?? item.CompletedDate;
        item.completedDate = item.CompletedDate;
        item.Remarks = result.remarks ?? item.Remarks;
        item.remarks = item.Remarks;
        item.updatedDate = new Date().toISOString().split('T')[0];
        item.updatedBy = item.Role || 'Dr. Sarah Jenkins';
        this.applyFilter();
      }
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
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
        code: item.ProjectCode || item.projectCode || '',
        projectCode: item.ProjectCode || item.projectCode || '',
        name: item.ProjectName || item.projectName || '',
        projectName: item.ProjectName || item.projectName || ''
      }
    });
  }

  // --- Date Exceeded Helper ---
  isDateExceeded(item: MonitorRequirementItem): boolean {
    if (item.isDateExceeded !== undefined) {
      return item.isDateExceeded;
    }
    const due = item.DueDate || item.dueDate;
    const completed = item.CompletedDate || item.completedDate;
    const isDone = item.Done || item.done;
    if (completed && due) {
      return completed > due;
    }
    if (!isDone && due) {
      const today = new Date().toISOString().split('T')[0];
      return due < today;
    }
    return false;
  }

  setActiveView(view: 'calendar' | 'table'): void {
    this.activeView = view;
    if (view === 'calendar') {
      this.buildCalendarDays();
      if (!this.selectedCalendarDate) {
        const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) ||
          this.calendarDays.find(d => d.inCurrentMonth);
        if (defaultDay) {
          this.selectCalendarDate(defaultDay);
        }
      } else {
        this.updateCalendarTableData();
      }
    }
  }

  get currentCalendarMonthLabel(): string {
    return `${this.monthNames[this.currentCalendarDate.getMonth()]} ${this.currentCalendarDate.getFullYear()}`;
  }

  prevCalendarMonth(): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() - 1,
      1
    );
    this.buildCalendarDays();
    this.clearCalendarDateSelection();
  }

  nextCalendarMonth(): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() + 1,
      1
    );
    this.buildCalendarDays();
    this.clearCalendarDateSelection();
  }

  buildCalendarDays(): void {
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const days: CalendarDayItem[] = [];

    const todayRef = new Date(this.todayReference);
    todayRef.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      cellDate.setHours(0, 0, 0, 0);
      const inCurrentMonth = cellDate.getMonth() === month;
      const isToday = this.isSameDay(cellDate, todayRef);
      const isBacklog = cellDate.getTime() < todayRef.getTime();
      const count = inCurrentMonth ? this.getRequirementCountForDate(cellDate) : 0;

      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday,
        isSelected: this.selectedCalendarDate ? this.isSameDay(cellDate, this.selectedCalendarDate) : false,
        count,
        isBacklog
      });
    }

    this.calendarDays = days;
  }

  getRequirementCountForDate(date: Date): number {
    const d = date.getDate();
    const m = date.getMonth();
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ((d * 2 + m * 3) % 3) + 1;
    }
    const variations = [3, 5, 2, 6, 4, 7, 3, 5, 4, 6, 2, 5, 7, 4, 3, 6, 5, 2, 7, 4, 3, 5, 6, 2, 4, 7, 3, 5, 4, 6, 3];
    return variations[(d - 1) % variations.length];
  }

  isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  isBacklogDate(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ref = new Date(this.todayReference);
    ref.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < ref.getTime();
  }

  isBacklogRequirement(item: MonitorRequirementItem): boolean {
    if (item.isBacklog !== undefined) {
      return !!item.isBacklog;
    }
    const dateStr = item.DueDate || item.dueDate;
    if (!dateStr) return false;
    if (dateStr.includes('2026-10-')) {
      const parts = dateStr.split('-');
      const day = parseInt(parts[2], 10);
      return !isNaN(day) && day < 10;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      if (d.getFullYear() === 2026 && d.getMonth() === 9) {
        return d.getDate() < 10;
      }
      const ref = new Date(2026, 9, 10);
      ref.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < ref.getTime();
    }
    return false;
  }

  selectCalendarDate(day: CalendarDayItem): void {
    if (!day.inCurrentMonth) return;
    if (this.selectedCalendarDate && this.isSameDay(this.selectedCalendarDate, day.date)) {
      this.clearCalendarDateSelection();
      return;
    }
    this.selectedCalendarDate = day.date;
    for (const d of this.calendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }
    this.calendarPageIndex = 0;
    this.updateCalendarTableData();
  }

  clearCalendarDateSelection(): void {
    this.selectedCalendarDate = null;
    for (const d of this.calendarDays) {
      d.isSelected = false;
    }
    this.calendarPageIndex = 0;
    this.updateCalendarTableData();
  }

  getRequirementsForDate(date: Date): MonitorRequirementItem[] {
    const count = this.getRequirementCountForDate(date);
    const d = date.getDate();
    const isBacklog = this.isBacklogDate(date);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (!this.rawRequirements || this.rawRequirements.length === 0) {
      return [];
    }

    const result: MonitorRequirementItem[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (d * 2 + i * 3) % this.rawRequirements.length;
      const base = this.rawRequirements[idx];
      result.push({
        ...base,
        id: (d * 100 + i + 1),
        DueDate: dateStr,
        dueDate: dateStr,
        CompletedDate: isBacklog ? '' : (base.CompletedDate || dateStr),
        completedDate: isBacklog ? '' : (base.completedDate || dateStr),
        done: isBacklog ? false : base.done,
        Done: isBacklog ? false : base.Done,
        approve: isBacklog ? false : base.approve,
        Approve: isBacklog ? false : base.Approve,
        isBacklog: isBacklog
      });
    }
    return result;
  }

  updateCalendarTableData(): void {
    if (this.selectedCalendarDate) {
      this.calendarFilteredRequirements = this.getRequirementsForDate(this.selectedCalendarDate);
    } else {
      const allMonthReqs: MonitorRequirementItem[] = [];
      const currentMonthDays = this.calendarDays.filter(d => d.inCurrentMonth && d.count > 0);
      for (const d of currentMonthDays) {
        allMonthReqs.push(...this.getRequirementsForDate(d.date));
      }
      this.calendarFilteredRequirements = allMonthReqs.length > 0 ? allMonthReqs : [...this.rawRequirements];
    }
    const start = this.calendarPageIndex * this.calendarPageSize;
    this.calendarPaginatedRequirements = this.calendarFilteredRequirements.slice(start, start + this.calendarPageSize);
  }

  handleCalendarPage(event: PageEvent): void {
    this.calendarPageIndex = event.pageIndex;
    this.calendarPageSize = event.pageSize;
    this.updateCalendarTableData();
  }

  scrollCalendarLeft(): void {
    if (this.calendarTableContainer?.nativeElement) {
      this.calendarTableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollCalendarRight(): void {
    if (this.calendarTableContainer?.nativeElement) {
      this.calendarTableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  // --- Scrolling logic ---
  scrollLeft(): void {
    if (this.activeView === 'calendar') {
      this.scrollCalendarLeft();
      return;
    }
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.activeView === 'calendar') {
      this.scrollCalendarRight();
      return;
    }
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
