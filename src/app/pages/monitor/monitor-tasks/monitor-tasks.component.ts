import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef, TemplateRef } from '@angular/core';
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
import { AddWbsTasksComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-tasks/add-wbs-tasks/add-wbs-tasks.component';

export interface CalendarDayItem {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  count: number;
  isBacklog: boolean;
}

export interface MonitorTaskItem {
  isBacklog?: boolean;
  id: number | string;
  IsActive?: boolean;
  active?: boolean;
  Done?: boolean;
  done?: boolean;
  approved?: boolean;
  Approved?: boolean;
  approvedDate?: string;
  ApprovedDate?: string;
  activityName?: string;
  ActivityName?: string;
  taskName?: string;
  TaskName?: string;
  taskCode?: string;
  reference?: string;
  section?: string;
  jobCode?: string;
  ProjectCode?: string;
  ProjectName?: string;
  startDate?: string;
  StartDate?: string;
  dueDate?: string;
  DueDate?: string;
  completedDate?: string;
  CompletedDate?: string;
  responsibility?: string;
  Department?: string;
  department?: string;
  Role?: string;
  role?: string;
  priority?: 'High' | 'Medium' | 'Low' | string;
  remarks?: string;
  Remarks?: string;
  planEffort?: number | string;
  actualEffort?: number | string;
  allocations?: any[];
  historyCount?: number;
  documentsCount?: number;
  todoCount?: string;
  issuesCount?: string;
  resourcesCount?: string;
  updatedDate?: string;
  updatedBy?: string;
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './monitor-tasks.component.html',
  styleUrl: './monitor-tasks.component.scss'
})
export class MonitorTasksComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('calendarTableContainer') calendarTableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('completionDialog') completionDialog!: TemplateRef<any>;

  activeView: 'calendar' | 'table' = 'calendar';

  readonly monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  readonly dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentCalendarDate: Date = new Date(2026, 9, 1); // October 2026
  selectedCalendarDate: Date | null = null;
  calendarDays: CalendarDayItem[] = [];

  readonly todayReference: Date = new Date(2026, 9, 10); // Reference today: October 10, 2026

  calendarFilteredTasks: MonitorTaskItem[] = [];
  calendarPaginatedTasks: MonitorTaskItem[] = [];
  calendarPageIndex: number = 0;
  calendarPageSize: number = 10;

  activeTaskForDone: MonitorTaskItem | null = null;
  selectedCompletionDate: string = '';
  completionDialogRef: any = null;

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

  readonly documentsSequence: number[] = [2, 4, 1, 3, 5, 2, 3, 1, 4, 2, 5, 3];
  readonly todoSequence: string[] = ['2/4', '1/3', '3/5', '4/6', '1/2', '0/3', '2/2', '3/4'];
  readonly issuesSequence: string[] = ['1/2', '0/1', '2/3', '1/4', '0/2', '3/3', '1/1', '0/4'];
  readonly resourcesSequence: string[] = ['3/5', '2/4', '4/4', '1/3', '2/2', '5/6', '3/3', '2/5'];

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  getTodoCount(index: number): string {
    return this.todoSequence[index % this.todoSequence.length];
  }

  getIssuesCount(index: number): string {
    return this.issuesSequence[index % this.issuesSequence.length];
  }

  getResourcesCount(index: number): string {
    return this.resourcesSequence[index % this.resourcesSequence.length];
  }

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
    this.initMockTasks();
    this.buildCalendarDays();
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) ||
      this.calendarDays.find(d => d.inCurrentMonth);
    if (defaultDay) {
      this.selectCalendarDate(defaultDay);
    }
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
            "id": 1,
            "IsActive": true,
            "active": true,
            "Done": true,
            "done": true,
            "approved": true,
            "Approved": true,
            "approvedDate": "2026-02-10",
            "ApprovedDate": "2026-02-10",
            "activityName": "Polyurethane dispersion literature and chemistry review protocol",
            "ActivityName": "Polyurethane dispersion literature and chemistry review protocol",
            "taskCode": "CHM-T001",
            "reference": "REF-CHM-01",
            "jobCode": "JOB-CHM-01",
            "ProjectCode": "2026/CHM/001",
            "TaskName": "Polyurethane dispersion literature and chemistry review protocol",
            "taskName": "Polyurethane dispersion literature and chemistry review protocol",
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "Department": "Process Chemistry",
            "department": "Process Chemistry",
            "section": "Process Chemistry",
            "Role": "Process Chemistry Lead",
            "role": "Process Chemistry Lead",
            "responsibility": "Dr. Priya Raman",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "2026-02-25",
            "CompletedDate": "2026-02-25",
            "priority": "High",
            "Remarks": "Chemical process execution progressing per protocol.",
            "remarks": "Chemical process execution progressing per protocol.",
            "isDateExceeded": false,
            "delayReason": "",
            "todoCount": "1/3",
            "issuesCount": "0/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman"
      },
      {
            "id": 2,
            "IsActive": true,
            "active": true,
            "Done": false,
            "done": false,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Preliminary cost of manufacturing and project budget estimate",
            "ActivityName": "Preliminary cost of manufacturing and project budget estimate",
            "taskCode": "CHM-T002",
            "reference": "REF-CHM-02",
            "jobCode": "JOB-CHM-02",
            "ProjectCode": "2026/CHM/001",
            "TaskName": "Preliminary cost of manufacturing and project budget estimate",
            "taskName": "Preliminary cost of manufacturing and project budget estimate",
            "ProjectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "Department": "Finance & Project Management",
            "department": "Finance & Project Management",
            "section": "Finance & Project Management",
            "Role": "Project Finance Lead",
            "role": "Project Finance Lead",
            "responsibility": "Rajesh Kumar",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "",
            "CompletedDate": "",
            "priority": "Low",
            "Remarks": "Delayed due to: Raw Material Cost Quote Pending",
            "remarks": "Delayed due to: Raw Material Cost Quote Pending",
            "isDateExceeded": true,
            "delayReason": "Raw Material Cost Quote Pending",
            "todoCount": "2/3",
            "issuesCount": "1/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Rajesh Kumar"
      },
      {
            "id": 3,
            "IsActive": true,
            "active": true,
            "Done": true,
            "done": true,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Applicable regulations and registration pathway matrix (REACH / TSCA / India)",
            "ActivityName": "Applicable regulations and registration pathway matrix (REACH / TSCA / India)",
            "taskCode": "CHM-T003",
            "reference": "REF-CHM-03",
            "jobCode": "JOB-CHM-03",
            "ProjectCode": "2026/CHM/002",
            "TaskName": "Applicable regulations and registration pathway matrix (REACH / TSCA / India)",
            "taskName": "Applicable regulations and registration pathway matrix (REACH / TSCA / India)",
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "Department": "Regulatory Affairs",
            "department": "Regulatory Affairs",
            "section": "Regulatory Affairs",
            "Role": "Regulatory Affairs Specialist",
            "role": "Regulatory Affairs Specialist",
            "responsibility": "Anita Desai",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "2026-02-25",
            "CompletedDate": "2026-02-25",
            "priority": "Medium",
            "Remarks": "Chemical process execution progressing per protocol.",
            "remarks": "Chemical process execution progressing per protocol.",
            "isDateExceeded": false,
            "delayReason": "",
            "todoCount": "3/3",
            "issuesCount": "0/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Anita Desai"
      },
      {
            "id": 4,
            "IsActive": true,
            "active": true,
            "Done": false,
            "done": false,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Catalyst vendor and lab capability audits",
            "ActivityName": "Catalyst vendor and lab capability audits",
            "taskCode": "CHM-T004",
            "reference": "REF-CHM-04",
            "jobCode": "JOB-CHM-04",
            "ProjectCode": "2026/CHM/002",
            "TaskName": "Catalyst vendor and lab capability audits",
            "taskName": "Catalyst vendor and lab capability audits",
            "ProjectName": "Hydrogenation Catalyst Development (Pd/C)",
            "Department": "Quality Assurance",
            "department": "Quality Assurance",
            "section": "Quality Assurance",
            "Role": "Vendor Quality Specialist",
            "role": "Vendor Quality Specialist",
            "responsibility": "Priya Reddy",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "",
            "CompletedDate": "",
            "priority": "High",
            "Remarks": "Delayed due to: Vendor Audit Observation Closure Pending",
            "remarks": "Delayed due to: Vendor Audit Observation Closure Pending",
            "isDateExceeded": true,
            "delayReason": "Vendor Audit Observation Closure Pending",
            "todoCount": "1/3",
            "issuesCount": "1/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Priya Reddy"
      },
      {
            "id": 5,
            "IsActive": true,
            "active": true,
            "Done": true,
            "done": true,
            "approved": true,
            "Approved": true,
            "approvedDate": "2026-02-10",
            "ApprovedDate": "2026-02-10",
            "activityName": "Long-lead reagent and intermediate identification and early vendor outreach",
            "ActivityName": "Long-lead reagent and intermediate identification and early vendor outreach",
            "taskCode": "CHM-T005",
            "reference": "REF-CHM-05",
            "jobCode": "JOB-CHM-05",
            "ProjectCode": "2026/CHM/003",
            "TaskName": "Long-lead reagent and intermediate identification and early vendor outreach",
            "taskName": "Long-lead reagent and intermediate identification and early vendor outreach",
            "ProjectName": "Agrochemical Active Ingredient Synthesis Development",
            "Department": "Sourcing & Procurement",
            "department": "Sourcing & Procurement",
            "section": "Sourcing & Procurement",
            "Role": "Raw Material Buyer",
            "role": "Raw Material Buyer",
            "responsibility": "Suresh Naidu",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "2026-02-25",
            "CompletedDate": "2026-02-25",
            "priority": "Medium",
            "Remarks": "Chemical process execution progressing per protocol.",
            "remarks": "Chemical process execution progressing per protocol.",
            "isDateExceeded": false,
            "delayReason": "",
            "todoCount": "2/3",
            "issuesCount": "0/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Suresh Naidu"
      },
      {
            "id": 6,
            "IsActive": true,
            "active": true,
            "Done": false,
            "done": false,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Target product profile (TPP) drafting",
            "ActivityName": "Target product profile (TPP) drafting",
            "taskCode": "CHM-T006",
            "reference": "REF-CHM-06",
            "jobCode": "JOB-CHM-06",
            "ProjectCode": "2026/CHM/003",
            "TaskName": "Target product profile (TPP) drafting",
            "taskName": "Target product profile (TPP) drafting",
            "ProjectName": "Agrochemical Active Ingredient Synthesis Development",
            "Department": "Project Strategy",
            "department": "Project Strategy",
            "section": "Project Strategy",
            "Role": "Project Strategy Manager",
            "role": "Project Strategy Manager",
            "responsibility": "Amit Patel",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "",
            "CompletedDate": "",
            "priority": "Low",
            "Remarks": "Chemical process execution progressing per protocol.",
            "remarks": "Chemical process execution progressing per protocol.",
            "isDateExceeded": false,
            "delayReason": "",
            "todoCount": "3/3",
            "issuesCount": "0/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Amit Patel"
      },
      {
            "id": 7,
            "IsActive": true,
            "active": true,
            "Done": true,
            "done": true,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Distillation column internals and packing concept",
            "ActivityName": "Distillation column internals and packing concept",
            "taskCode": "CHM-T007",
            "reference": "REF-CHM-07",
            "jobCode": "JOB-CHM-07",
            "ProjectCode": "2026/CHM/004",
            "TaskName": "Distillation column internals and packing concept",
            "taskName": "Distillation column internals and packing concept",
            "ProjectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "Department": "Chemical Engineering",
            "department": "Chemical Engineering",
            "section": "Chemical Engineering",
            "Role": "Separation Process Engineer",
            "role": "Separation Process Engineer",
            "responsibility": "Dr. Priya Raman",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "2026-02-25",
            "CompletedDate": "2026-02-25",
            "priority": "High",
            "Remarks": "Delayed due to: Packing Specification Conflict",
            "remarks": "Delayed due to: Packing Specification Conflict",
            "isDateExceeded": true,
            "delayReason": "Packing Specification Conflict",
            "todoCount": "1/3",
            "issuesCount": "1/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman"
      },
      {
            "id": 8,
            "IsActive": true,
            "active": true,
            "Done": false,
            "done": false,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Product target and process success criteria cascade",
            "ActivityName": "Product target and process success criteria cascade",
            "taskCode": "CHM-T008",
            "reference": "REF-CHM-08",
            "jobCode": "JOB-CHM-08",
            "ProjectCode": "2026/CHM/004",
            "TaskName": "Product target and process success criteria cascade",
            "taskName": "Product target and process success criteria cascade",
            "ProjectName": "Specialty Ester Plasticizer Continuous Flow Process",
            "Department": "Process Chemistry",
            "department": "Process Chemistry",
            "section": "Process Chemistry",
            "Role": "Reaction Engineering Lead",
            "role": "Reaction Engineering Lead",
            "responsibility": "Rajesh Kumar",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "",
            "CompletedDate": "",
            "priority": "Low",
            "Remarks": "Delayed due to: Success Criteria Review Revision",
            "remarks": "Delayed due to: Success Criteria Review Revision",
            "isDateExceeded": true,
            "delayReason": "Success Criteria Review Revision",
            "todoCount": "2/3",
            "issuesCount": "1/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Rajesh Kumar"
      },
      {
            "id": 9,
            "IsActive": true,
            "active": true,
            "Done": true,
            "done": true,
            "approved": true,
            "Approved": true,
            "approvedDate": "2026-02-10",
            "ApprovedDate": "2026-02-10",
            "activityName": "Target crop and regulatory-region shortlist",
            "ActivityName": "Target crop and regulatory-region shortlist",
            "taskCode": "CHM-T009",
            "reference": "REF-CHM-09",
            "jobCode": "JOB-CHM-09",
            "ProjectCode": "2026/CHM/005",
            "TaskName": "Target crop and regulatory-region shortlist",
            "taskName": "Target crop and regulatory-region shortlist",
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "Department": "Project Strategy",
            "department": "Project Strategy",
            "section": "Project Strategy",
            "Role": "Project Strategy Manager",
            "role": "Project Strategy Manager",
            "responsibility": "Anita Desai",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "2026-02-25",
            "CompletedDate": "2026-02-25",
            "priority": "Medium",
            "Remarks": "Chemical process execution progressing per protocol.",
            "remarks": "Chemical process execution progressing per protocol.",
            "isDateExceeded": false,
            "delayReason": "",
            "todoCount": "3/3",
            "issuesCount": "0/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Anita Desai"
      },
      {
            "id": 10,
            "IsActive": true,
            "active": true,
            "Done": false,
            "done": false,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Toll agreements and long-lead material order release",
            "ActivityName": "Toll agreements and long-lead material order release",
            "taskCode": "CHM-T010",
            "reference": "REF-CHM-10",
            "jobCode": "JOB-CHM-10",
            "ProjectCode": "2026/CHM/005",
            "TaskName": "Toll agreements and long-lead material order release",
            "taskName": "Toll agreements and long-lead material order release",
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "Department": "Sourcing & Procurement",
            "department": "Sourcing & Procurement",
            "section": "Sourcing & Procurement",
            "Role": "Raw Material Buyer",
            "role": "Raw Material Buyer",
            "responsibility": "Priya Reddy",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "",
            "CompletedDate": "",
            "priority": "High",
            "Remarks": "Chemical process execution progressing per protocol.",
            "remarks": "Chemical process execution progressing per protocol.",
            "isDateExceeded": false,
            "delayReason": "",
            "todoCount": "1/3",
            "issuesCount": "0/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Priya Reddy"
      },
      {
            "id": 11,
            "IsActive": true,
            "active": true,
            "Done": true,
            "done": true,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Surfactant and dispersant sourcing for WDG formulation",
            "ActivityName": "Surfactant and dispersant sourcing for WDG formulation",
            "taskCode": "CHM-T011",
            "reference": "REF-CHM-11",
            "jobCode": "JOB-CHM-11",
            "ProjectCode": "2026/CHM/005",
            "TaskName": "Surfactant and dispersant sourcing for WDG formulation",
            "taskName": "Surfactant and dispersant sourcing for WDG formulation",
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "Department": "Formulation Development",
            "department": "Formulation Development",
            "section": "Formulation Development",
            "Role": "Formulation Scientist",
            "role": "Formulation Scientist",
            "responsibility": "Suresh Naidu",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "2026-02-25",
            "CompletedDate": "2026-02-25",
            "priority": "Medium",
            "Remarks": "Delayed due to: Dispersant Supply Delay",
            "remarks": "Delayed due to: Dispersant Supply Delay",
            "isDateExceeded": true,
            "delayReason": "Dispersant Supply Delay",
            "todoCount": "2/3",
            "issuesCount": "1/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Suresh Naidu"
      },
      {
            "id": 12,
            "IsActive": true,
            "active": true,
            "Done": false,
            "done": false,
            "approved": false,
            "Approved": false,
            "approvedDate": "",
            "ApprovedDate": "",
            "activityName": "Granule process trial design and safety approval",
            "ActivityName": "Granule process trial design and safety approval",
            "taskCode": "CHM-T012",
            "reference": "REF-CHM-12",
            "jobCode": "JOB-CHM-12",
            "ProjectCode": "2026/CHM/005",
            "TaskName": "Granule process trial design and safety approval",
            "taskName": "Granule process trial design and safety approval",
            "ProjectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "Department": "Process Safety",
            "department": "Process Safety",
            "section": "Process Safety",
            "Role": "Process Safety Lead",
            "role": "Process Safety Lead",
            "responsibility": "Amit Patel",
            "startDate": "2026-02-01",
            "StartDate": "2026-02-01",
            "dueDate": "2026-02-28",
            "DueDate": "2026-02-28",
            "completedDate": "",
            "CompletedDate": "",
            "priority": "Low",
            "Remarks": "Delayed due to: Pilot Lab Slot Availability",
            "remarks": "Delayed due to: Pilot Lab Slot Availability",
            "isDateExceeded": true,
            "delayReason": "Pilot Lab Slot Availability",
            "todoCount": "3/3",
            "issuesCount": "1/1",
            "resourcesCount": "2/2",
            "documentsCount": 2,
            "updatedDate": "2026-02-15",
            "updatedBy": "Amit Patel"
      }
];

    this.rawTasks = this.rawTasks.map((t, idx) => {
      const dayNum = ((idx * 3) % 28) + 1;
      const dueDay = String(dayNum).padStart(2, '0');
      const startDay = String(Math.max(1, dayNum - 4)).padStart(2, '0');
      const itemIsBacklog = dayNum < 10;
      return {
        ...t,
        startDate: `2026-10-${startDay}`,
        StartDate: `2026-10-${startDay}`,
        dueDate: `2026-10-${dueDay}`,
        DueDate: `2026-10-${dueDay}`,
        isBacklog: itemIsBacklog
      };
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
    let filtered = [...this.rawTasks];
    const formVals = this.filterForm.value;

    if (this.excludeCompleted) {
      filtered = filtered.filter(t => !(t.Done || t.done));
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => {
        const isDone = t.Done || t.done;
        const due = t.DueDate || t.dueDate;
        return !isDone && !!due && due < today;
      });
    }

    if (formVals.Keyword && formVals.Keyword.trim()) {
      const kw = formVals.Keyword.trim().toLowerCase();
      filtered = filtered.filter(t =>
        (t.activityName && t.activityName.toLowerCase().includes(kw)) ||
        (t.ActivityName && t.ActivityName.toLowerCase().includes(kw)) ||
        (t.ProjectCode && t.ProjectCode.toLowerCase().includes(kw)) ||
        (t.jobCode && t.jobCode.toLowerCase().includes(kw)) ||
        (t.taskCode && t.taskCode.toLowerCase().includes(kw)) ||
        (t.reference && t.reference.toLowerCase().includes(kw)) ||
        (t.TaskName && t.TaskName.toLowerCase().includes(kw)) ||
        (t.taskName && t.taskName.toLowerCase().includes(kw)) ||
        (t.ProjectName && t.ProjectName.toLowerCase().includes(kw)) ||
        (t.Department && t.Department.toLowerCase().includes(kw)) ||
        (t.department && t.department.toLowerCase().includes(kw)) ||
        (t.section && t.section.toLowerCase().includes(kw)) ||
        (t.Role && t.Role.toLowerCase().includes(kw)) ||
        (t.responsibility && t.responsibility.toLowerCase().includes(kw)) ||
        (t.Remarks && t.Remarks.toLowerCase().includes(kw)) ||
        (t.remarks && t.remarks.toLowerCase().includes(kw))
      );
    }

    if (formVals.ProjectCode && formVals.ProjectCode.trim()) {
      const pc = formVals.ProjectCode.trim().toLowerCase();
      filtered = filtered.filter(t => (t.ProjectCode && t.ProjectCode.toLowerCase().includes(pc)) || (t.jobCode && t.jobCode.toLowerCase().includes(pc)));
    }

    if (formVals.Department) {
      filtered = filtered.filter(t => (t.Department === formVals.Department) || (t.department === formVals.Department));
    }

    if (formVals.Role) {
      filtered = filtered.filter(t => (t.Role === formVals.Role) || (t.responsibility === formVals.Role));
    }

    if (formVals.FromDate) {
      filtered = filtered.filter(t => ((t.DueDate || t.dueDate) || '') >= formVals.FromDate);
    }

    if (formVals.ToDate) {
      filtered = filtered.filter(t => ((t.DueDate || t.dueDate) || '') <= formVals.ToDate);
    }

    if (formVals.ActiveOnly) {
      filtered = filtered.filter(t => (t.IsActive || t.active));
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.paginatedTasks = filtered.slice(start, start + this.pageSize);
    this.updateCalendarTableData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  toggleApproved(item: MonitorTaskItem): void {
    item.approved = !item.approved;
    item.Approved = item.approved;
    if (item.approved) {
      item.approvedDate = item.approvedDate || new Date().toISOString().split('T')[0];
      item.ApprovedDate = item.approvedDate;
    } else {
      item.approvedDate = '';
      item.ApprovedDate = '';
    }
  }

  onDoneChange(item: MonitorTaskItem): void {
    item.Done = item.done ?? item.Done;
    item.done = item.Done;
    if (item.done && !item.completedDate) {
      item.completedDate = new Date().toISOString().split('T')[0];
      item.CompletedDate = item.completedDate;
    } else if (!item.done) {
      item.completedDate = '';
      item.CompletedDate = '';
    }
  }

  openDoneDialog(item: MonitorTaskItem): void {
    this.activeTaskForDone = item;
    this.selectedCompletionDate = item.completedDate || item.CompletedDate || new Date().toISOString().split('T')[0];
    this.completionDialogRef = this.dialog.open(this.completionDialog, {
      width: '460px',
      maxWidth: '95vw',
      disableClose: false
    });
  }

  saveCompletionDate(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = true;
      this.activeTaskForDone.Done = true;
      this.activeTaskForDone.completedDate = this.selectedCompletionDate || new Date().toISOString().split('T')[0];
      this.activeTaskForDone.CompletedDate = this.activeTaskForDone.completedDate;
    }
    this.closeCompletionDialog();
  }

  markIncomplete(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = false;
      this.activeTaskForDone.Done = false;
      this.activeTaskForDone.completedDate = '';
      this.activeTaskForDone.CompletedDate = '';
    }
    this.closeCompletionDialog();
  }

  closeCompletionDialog(): void {
    if (this.completionDialogRef) {
      this.completionDialogRef.close();
      this.completionDialogRef = null;
    }
    this.activeTaskForDone = null;
  }

  editTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(AddWbsTasksComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        ...item,
        activityName: item.activityName || item.ActivityName,
        taskName: item.taskName || item.TaskName,
        taskCode: item.taskCode,
        reference: item.reference,
        section: item.section || 'Formulation Development',
        jobCode: item.jobCode || item.ProjectCode,
        startDate: item.startDate || item.StartDate,
        dueDate: item.dueDate || item.DueDate,
        completedDate: item.completedDate || item.CompletedDate,
        approvedDate: item.approvedDate || item.ApprovedDate,
        responsibility: item.responsibility || item.Role,
        department: item.department || item.Department,
        priority: item.priority || 'Medium',
        role: item.role || item.Role || 'Scientist',
        remarks: item.remarks || item.Remarks,
        done: item.done ?? item.Done ?? false,
        approved: item.approved ?? item.Approved ?? false,
        active: item.active ?? item.IsActive ?? true
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.active = result.active ?? item.active;
        item.IsActive = item.active;
        item.done = result.done ?? item.done;
        item.Done = item.done;
        item.activityName = result.activityName ?? item.activityName;
        item.ActivityName = item.activityName;
        item.taskName = result.taskName ?? item.taskName;
        item.TaskName = item.taskName || item.TaskName || '';
        item.taskCode = result.taskCode ?? item.taskCode;
        item.reference = result.reference ?? item.reference;
        item.section = result.section ?? item.section;
        item.jobCode = result.jobCode ?? item.jobCode;
        item.ProjectCode = item.jobCode;
        item.startDate = result.startDate ?? item.startDate;
        item.StartDate = item.startDate;
        item.dueDate = result.dueDate ?? item.dueDate;
        item.DueDate = item.dueDate;
        item.completedDate = result.completedDate ?? item.completedDate;
        item.CompletedDate = item.completedDate;
        item.approved = result.approved ?? item.approved;
        item.Approved = item.approved;
        item.approvedDate = result.approvedDate ?? item.approvedDate;
        item.ApprovedDate = item.approvedDate;
        item.responsibility = result.responsibility ?? item.responsibility;
        item.department = result.department ?? item.department;
        item.Department = item.department;
        item.priority = result.priority ?? item.priority;
        item.role = result.role ?? item.role;
        item.Role = item.role;
        item.remarks = result.remarks ?? item.remarks;
        item.Remarks = item.remarks;
        item.planEffort = result.planEffort ?? item.planEffort;
        item.actualEffort = result.actualEffort ?? item.actualEffort;
        item.allocations = result.allocations ?? item.allocations;
        item.updatedDate = new Date().toISOString().split('T')[0];
        item.updatedBy = result.responsibility || item.responsibility || 'Dr. Sarah Jenkins';
        this.applyFilter();
      }
    });
  }

  onEditTask(item: MonitorTaskItem): void {
    this.editTask(item);
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

  deleteTask(item: MonitorTaskItem): void {
    this.onDeleteTask(item);
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
    if (!item) return false;
    if (item.isDateExceeded !== undefined) {
      return item.isDateExceeded;
    }
    const completedDate = item.completedDate || item.CompletedDate;
    const dueDate = item.dueDate || item.DueDate;
    const isDone = item.done ?? item.Done ?? false;

    if (completedDate && dueDate) {
      return completedDate > dueDate;
    }
    if (!isDone && dueDate) {
      const today = new Date().toISOString().split('T')[0];
      return dueDate < today;
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

  showCalendarView(): void {
    this.setActiveView('calendar');
  }

  showGridView(): void {
    this.setActiveView('table');
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
      const count = inCurrentMonth ? this.getTaskCountForDate(cellDate) : 0;

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

  getTaskCountForDate(date: Date): number {
    const d = date.getDate();
    const m = date.getMonth();
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ((d * 2 + m * 3) % 3) + 1;
    }
    const variations = [4, 6, 3, 7, 5, 8, 4, 6, 5, 7, 3, 6, 8, 5, 4, 7, 6, 3, 8, 5, 4, 6, 7, 3, 5, 8, 4, 6, 5, 7, 4];
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

  isBacklogTask(item: MonitorTaskItem): boolean {
    if (item.isBacklog !== undefined) {
      return !!item.isBacklog;
    }
    const dateStr = item.dueDate || item.DueDate || item.startDate || item.StartDate;
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

  getTasksForDate(date: Date): MonitorTaskItem[] {
    const count = this.getTaskCountForDate(date);
    const d = date.getDate();
    const isBacklog = this.isBacklogDate(date);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (!this.rawTasks || this.rawTasks.length === 0) {
      return [];
    }

    const result: MonitorTaskItem[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (d * 2 + i * 3) % this.rawTasks.length;
      const base = this.rawTasks[idx];
      result.push({
        ...base,
        id: `cal-${dateStr}-${i + 1}`,
        taskCode: base.taskCode || `TC-${String((d * 5 + i + 1) % 100).padStart(2, '0')}`,
        startDate: dateStr,
        StartDate: dateStr,
        dueDate: dateStr,
        DueDate: dateStr,
        completedDate: isBacklog ? '' : (base.completedDate || dateStr),
        CompletedDate: isBacklog ? '' : (base.CompletedDate || dateStr),
        isDateExceeded: isBacklog,
        done: isBacklog ? false : base.done,
        Done: isBacklog ? false : base.Done,
        approved: isBacklog ? false : base.approved,
        Approved: isBacklog ? false : base.Approved,
        isBacklog: isBacklog
      });
    }
    return result;
  }

  updateCalendarTableData(): void {
    if (this.selectedCalendarDate) {
      this.calendarFilteredTasks = this.getTasksForDate(this.selectedCalendarDate);
    } else {
      const allMonthTasks: MonitorTaskItem[] = [];
      const currentMonthDays = this.calendarDays.filter(d => d.inCurrentMonth && d.count > 0);
      for (const d of currentMonthDays) {
        allMonthTasks.push(...this.getTasksForDate(d.date));
      }
      this.calendarFilteredTasks = allMonthTasks.length > 0 ? allMonthTasks : [...this.rawTasks];
    }
    const start = this.calendarPageIndex * this.calendarPageSize;
    this.calendarPaginatedTasks = this.calendarFilteredTasks.slice(start, start + this.calendarPageSize);
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
