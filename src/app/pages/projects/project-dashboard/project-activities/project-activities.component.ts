import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddProjActivityComponent } from './add-proj-activity/add-proj-activity.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { HoursTimesheetComponent } from '../project-hours/hours-timesheet/hours-timesheet.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';


export interface ProjectActivityItem {
  id?: string | number;
  IsActive: boolean;
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;
  stage?: string;
  PercentCompletion: number;
  Deliverable: string;
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
  Done?: boolean;
  Tasks?: string | number;
  Requirements?: string | number;
  tasks?: string | number;
  requirements?: string | number;
  activities?: string;
  delayReason?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-activities.component.html',
  styleUrl: './project-activities.component.scss'
})
export class ProjectActivitiesComponent implements OnInit {

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Activities';

  showFilter: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: ProjectActivityItem | null = null;
  excludeCompleted: boolean = false;

  // Add / Edit Modal State
  showActivityModal: boolean = false;
  isEditMode: boolean = false;
  editingItem: ProjectActivityItem | null = null;
  activityFormData: Partial<ProjectActivityItem> = {};

  // Timesheet Modal State
  showTimesheetModal: boolean = false;
  timesheetTask: ProjectActivityItem | null = null;

  rawProjects: ProjectActivityItem[] = [];
  allProjects: ProjectActivityItem[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  filterKeyword: string = '';
  filterProjectName: string = '';
  filterDateType: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterComplexity: string = '';
  filterActive: boolean = false;

  teamMembers = ['Alice Johnson', 'Robert Smith', 'Clara Davis', 'Daniel Martinez', 'Evelyn Wright', 'Sophia Carter', 'Michael Johnson', 'Daniel Wilson', 'Emma Thompson', 'Olivia Martinez'];
  statuses = ['Pending', 'Allocation', 'Progress', 'In Progress', 'Testing', 'Review', 'Hold', 'Cancelled', 'Completed'];
  priorities = ['Critical', 'High', 'Medium', 'Low'];
  complexities = ['Very High', 'High', 'Medium', 'Low'];

  readonly delayReasonOptions: string[] = [
  "Benchmark Sample Sourcing Delay",
  "Raw Material, Catalyst & Solvent Shortage",
  "Vendor / Toll Dispatch Delay",
  "Safety / Environmental Approval Pending",
  "Low Yield / Side-Reaction Anomaly",
  "Hazard Study / Method Validation Pending",
  "Equipment Downtime (Reactor / Distillation)",
  "Contractor / Equipment Delivery Delay"
];

  readonly historySequence: number[] = [3, 5, 3, 2, 1, 6, 8, 3, 5, 2, 4, 7, 3, 6, 1, 5, 8, 2, 4, 3];
  readonly documentsSequence: number[] = [4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 2, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.getAllProjects();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  getAllProjects(): void {
    const mockData: ProjectActivityItem[] = [
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S1",
    "PercentCompletion": 100,
    "Deliverable": "Competitor Grade & Market Analysis",
    "TaskName": "Competitor Grade & Market Assessment",
    "TaskType": "Analysis",
    "Responsibility": "Dr. Priya Raman",
    "Duration": "10 days",
    "Effort": "40",
    "Description": "Benchmark competitor acrylic binders against solid content, viscosity and adhesion.",
    "PlanStart": "2026-01-05",
    "PlanEnd": "2026-01-15",
    "ActualStart": "2026-01-05",
    "ActualEnd": "2026-01-15",
    "ETA": "2026-01-15",
    "Status": "Completed",
    "Priority": "Critical",
    "Complexity": "Medium",
    "Template": "Chemical Assessment v1",
    "delayReason": "Benchmark Sample Sourcing Delay",
    "updatedDate": "2026-02-15",
    "updatedBy": "Dr. Priya Raman"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S2",
    "PercentCompletion": 100,
    "Deliverable": "Feasibility & Hazard Assessment",
    "TaskName": "Reaction Feasibility & Hazard Screening",
    "TaskType": "Screening",
    "Responsibility": "Rajesh Kumar",
    "Duration": "10 days",
    "Effort": "30",
    "Description": "Screen reaction chemistry, exotherm envelope, and toxic intermediate risks.",
    "PlanStart": "2026-01-16",
    "PlanEnd": "2026-01-26",
    "ActualStart": "2026-01-16",
    "ActualEnd": "2026-01-26",
    "ETA": "2026-01-26",
    "Status": "Completed",
    "Priority": "High",
    "Complexity": "High",
    "Template": "Hazard Screening Template",
    "delayReason": "Safety / Environmental Approval Pending",
    "updatedDate": "2026-02-15",
    "updatedBy": "Rajesh Kumar"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S3",
    "PercentCompletion": 100,
    "Deliverable": "Raw Material & Catalyst Sourcing",
    "TaskName": "Monomer & Surfactant Sourcing",
    "TaskType": "Sourcing",
    "Responsibility": "Anita Desai",
    "Duration": "15 days",
    "Effort": "50",
    "Description": "Source butyl acrylate, MMA, methacrylic acid and industrial surfactant packages.",
    "PlanStart": "2026-01-27",
    "PlanEnd": "2026-02-15",
    "ActualStart": "2026-01-27",
    "ActualEnd": "2026-02-15",
    "ETA": "2026-02-15",
    "Status": "Completed",
    "Priority": "High",
    "Complexity": "Medium",
    "Template": "Procurement Package",
    "delayReason": "Vendor / Toll Dispatch Delay",
    "updatedDate": "2026-02-28",
    "updatedBy": "Anita Desai"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S4",
    "PercentCompletion": 58,
    "Deliverable": "Particle Size & Viscosity Method",
    "TaskName": "Analytical & Performance Method Development",
    "TaskType": "Method Dev",
    "Responsibility": "Amit Patel",
    "Duration": "30 days",
    "Effort": "90",
    "Description": "Validate solids determination, Brookfield viscosity, and residual monomer GC method.",
    "PlanStart": "2026-03-01",
    "PlanEnd": "2026-04-15",
    "ActualStart": "2026-03-01",
    "ActualEnd": "",
    "ETA": "2026-05-01",
    "Status": "In Progress",
    "Priority": "High",
    "Complexity": "High",
    "Template": "Analytical Method Standard",
    "delayReason": "Raw Material, Catalyst & Solvent Shortage",
    "updatedDate": "2026-04-20",
    "updatedBy": "Amit Patel"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S6",
    "PercentCompletion": 0,
    "Deliverable": "Pilot Reactor Batches",
    "TaskName": "Bench-to-Pilot Polymerization Run",
    "TaskType": "Scale-Up",
    "Responsibility": "Rajesh Kumar",
    "Duration": "25 days",
    "Effort": "100",
    "Description": "Scale up 2 L lab recipe to 100 L pilot reactor with automated feeding.",
    "PlanStart": "2026-06-16",
    "PlanEnd": "2026-07-15",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-07-15",
    "Status": "Pending",
    "Priority": "Critical",
    "Complexity": "Very High",
    "Template": "Scale-Up Template",
    "delayReason": "Equipment Downtime (Reactor / Distillation)",
    "updatedDate": "2026-05-01",
    "updatedBy": "Rajesh Kumar"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S7",
    "PercentCompletion": 0,
    "Deliverable": "Storage Stability Data",
    "TaskName": "Storage Stability Studies",
    "TaskType": "Testing",
    "Responsibility": "Vikram Singh",
    "Duration": "45 days",
    "Effort": "75",
    "Description": "Accelerated thermal aging at 50°C and 5 freeze-thaw cycles.",
    "PlanStart": "2026-08-11",
    "PlanEnd": "2026-09-30",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-09-30",
    "Status": "Pending",
    "Priority": "Medium",
    "Complexity": "Medium",
    "Template": "Stability Protocol",
    "delayReason": "Hazard Study / Method Validation Pending",
    "updatedDate": "2026-05-10",
    "updatedBy": "Vikram Singh"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S6",
    "PercentCompletion": 0,
    "Deliverable": "Distillation and Filtration Steps",
    "TaskName": "Separation & Purification Development",
    "TaskType": "Process",
    "Responsibility": "Rajesh Kumar",
    "Duration": "20 days",
    "Effort": "60",
    "Description": "Optimize post-reaction coagulation filtration and vacuum stripping of unreacted monomer.",
    "PlanStart": "2026-07-16",
    "PlanEnd": "2026-08-10",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-08-10",
    "Status": "Pending",
    "Priority": "High",
    "Complexity": "High",
    "Template": "Separation Template",
    "delayReason": "Low Yield / Side-Reaction Anomaly",
    "updatedDate": "2026-05-12",
    "updatedBy": "Rajesh Kumar"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S8",
    "PercentCompletion": 0,
    "Deliverable": "Drum Filling and Packing Process",
    "TaskName": "Finished Product Formulation & Packing Development",
    "TaskType": "Packaging",
    "Responsibility": "Anita Desai",
    "Duration": "15 days",
    "Effort": "40",
    "Description": "Establish in-line 100-mesh filtration and automated 200 L drum filling line protocols.",
    "PlanStart": "2026-10-01",
    "PlanEnd": "2026-10-20",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-10-20",
    "Status": "Pending",
    "Priority": "Medium",
    "Complexity": "Medium",
    "Template": "Packaging SOP",
    "delayReason": "Vendor / Toll Dispatch Delay",
    "updatedDate": "2026-05-15",
    "updatedBy": "Anita Desai"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S8",
    "PercentCompletion": 0,
    "Deliverable": "Demonstration Batches",
    "TaskName": "Process Validation Batches",
    "TaskType": "Validation",
    "Responsibility": "Rajesh Kumar",
    "Duration": "20 days",
    "Effort": "80",
    "Description": "Execute 3 conformance runs verifying CPP compliance and CQA reproducibility.",
    "PlanStart": "2026-10-21",
    "PlanEnd": "2026-11-05",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2026-11-05",
    "Status": "Pending",
    "Priority": "Critical",
    "Complexity": "High",
    "Template": "Validation Protocol",
    "delayReason": "Equipment Downtime (Reactor / Distillation)",
    "updatedDate": "2026-05-18",
    "updatedBy": "Rajesh Kumar"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S10",
    "PercentCompletion": 0,
    "Deliverable": "Demo-Scale Campaign Batches",
    "TaskName": "Demo-Scale Batch Manufacturing",
    "TaskType": "Manufacturing",
    "Responsibility": "Suresh Naidu",
    "Duration": "30 days",
    "Effort": "120",
    "Description": "Produce 5 m³ demonstration batches for tier-1 formulator qualification.",
    "PlanStart": "2026-12-21",
    "PlanEnd": "2027-01-25",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2027-01-25",
    "Status": "Pending",
    "Priority": "Critical",
    "Complexity": "Very High",
    "Template": "Campaign Run Protocol",
    "delayReason": "Raw Material, Catalyst & Solvent Shortage",
    "updatedDate": "2026-05-20",
    "updatedBy": "Suresh Naidu"
  },
  {
    "IsActive": true,
    "ProjectName": "Acrylic Emulsion Binder 50% Solids",
    "ProjectCode": "2026/CHM/006",
    "Stage": "S11",
    "PercentCompletion": 0,
    "Deliverable": "Customer Qualification Trials",
    "TaskName": "Customer Application Trials",
    "TaskType": "Trials",
    "Responsibility": "Ananya Rao",
    "Duration": "40 days",
    "Effort": "80",
    "Description": "Field trials with coatings formulators evaluating scrub resistance and gloss.",
    "PlanStart": "2027-02-21",
    "PlanEnd": "2027-04-05",
    "ActualStart": "",
    "ActualEnd": "",
    "ETA": "2027-04-05",
    "Status": "Pending",
    "Priority": "High",
    "Complexity": "High",
    "Template": "Customer Trial Protocol",
    "delayReason": "Contractor / Equipment Delivery Delay",
    "updatedDate": "2026-05-22",
    "updatedBy": "Ananya Rao"
  }
];

    const taskCounts = ['4/13', '1/13', '8/13', '6/13', '10/13', '7/13', '9/13', '11/13', '5/13', '2/13', '12/13', '3/13', '4/13', '8/13'];
    const reqCounts = ['5/9', '2/9', '7/9', '4/9', '6/9', '8/9', '3/9', '5/9', '1/9', '7/9', '4/9', '2/9', '6/9', '5/9'];
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    const delayReasons = this.delayReasonOptions;
    this.rawProjects = mockData.map((item, idx) => ({
      ...item,
      historyCount: this.getHistoryCount(idx),
      documentsCount: this.getDocumentsCount(idx),
      updatedDate: item.updatedDate ?? defaultDates[idx % defaultDates.length],
      updatedBy: item.updatedBy ?? item.Responsibility ?? defaultUpdaters[idx % defaultUpdaters.length],
      Tasks: item.Tasks ?? taskCounts[idx % taskCounts.length],
      Requirements: item.Requirements ?? reqCounts[idx % reqCounts.length],
      delayReason: item.delayReason ?? delayReasons[idx % delayReasons.length]
    }));
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = this.rawProjects;

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.filterKeyword && this.filterKeyword.trim()) {
      const kw = this.filterKeyword.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.TaskName && p.TaskName.toLowerCase().includes(kw)) ||
        (p.Stage && p.Stage.toLowerCase().includes(kw)) ||
        (p.Deliverable && p.Deliverable.toLowerCase().includes(kw)) ||
        (p.ProjectName && p.ProjectName.toLowerCase().includes(kw)) ||
        (p.ProjectCode && p.ProjectCode.toLowerCase().includes(kw)) ||
        (p.Responsibility && p.Responsibility.toLowerCase().includes(kw)) ||
        (p.Description && p.Description.toLowerCase().includes(kw))
      );
    }

    if (this.filterProjectName && this.filterProjectName.trim()) {
      const pn = this.filterProjectName.toLowerCase().trim();
      filtered = filtered.filter(p => p.ProjectName && p.ProjectName.toLowerCase().includes(pn));
    }

    if (this.filterStatus) {
      filtered = filtered.filter(p => p.Status === this.filterStatus);
    }

    if (this.filterPriority) {
      filtered = filtered.filter(p => p.Priority === this.filterPriority);
    }

    if (this.filterComplexity) {
      filtered = filtered.filter(p => p.Complexity === this.filterComplexity);
    }

    if (this.filterActive) {
      filtered = filtered.filter(p => p.IsActive === true);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.allProjects = filtered.slice(start, end);
  }

  clearFilter(): void {
    this.filterKeyword = '';
    this.filterProjectName = '';
    this.filterDateType = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterComplexity = '';
    this.filterActive = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newItem: ProjectActivityItem = {
          IsActive: true,
          ProjectName: this.projectName,
          ProjectCode: this.projectCode,
          Stage: result.stage || result.Stage || 'S1',
          PercentCompletion: 0,
          Deliverable: result.Deliverable || 'Module1',
          TaskName: result.TaskName || '',
          TaskType: 'Development',
          Responsibility: 'Alice Johnson',
          Duration: result.planDuration || '5 days',
          Effort: result.planEffort || '20',
          Description: result.Description || '',
          PlanStart: result.PlanStart || new Date().toISOString().split('T')[0],
          PlanEnd: result.PlanEnd || '',
          ActualStart: result.ActualStart || '',
          ActualEnd: result.ActualEnd || '',
          ETA: '',
          Status: result.Status || 'In Progress',
          Priority: 'Medium',
          Complexity: 'Medium',
          Template: 'Dev Template'
        };
        this.rawProjects.unshift(newItem);
        this.applyFilter();
      }
    });
  }

  openEditDialog(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { ...item, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          Stage: result.stage || result.Stage || item.Stage || 'S1',
          Deliverable: result.Deliverable || item.Deliverable,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort
        });
        this.applyFilter();
      }
    });
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.editingItem = null;
    this.activityFormData = {};
  }

  deleteConfirmation(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  toggleActive(item: ProjectActivityItem): void {
    // Toggles state directly
  }

  openProject(item: ProjectActivityItem): void {
    this.router.navigate(['/app/testing/projects/dashboard/analytics'], {
      queryParams: { code: item.ProjectCode || this.projectCode, name: item.ProjectName || this.projectName }
    });
  }

  fnHandlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  openPdf(fileName: string): void {
    const pdfUrl = `assets/${fileName}`;
    window.open(pdfUrl, '_blank');
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  openTimelineModal(task: ProjectActivityItem): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }



  opentimesheet(): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: null
    });
  }



  closeTimesheetModal(): void {
    this.showTimesheetModal = false;
    this.timesheetTask = null;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }


  onTasksClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.Tasks ?? item.tasks ?? '0/13',
        source: 'activities'
      }
    });
  }

  onRequirementsClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.Requirements ?? item.requirements ?? item.activities ?? '0/9',
        source: 'activities'
      }
    });
  }



  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

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

  openHistory(item?: any): void {
    const act = typeof item === 'object' && item !== null ? item : { TaskName: item };
    this.router.navigate(['/projects/dashboard/activities/history'], {
      queryParams: {
        activityName: act.TaskName || act.activityName,
        delayReason: act.delayReason,
        stage: act.Stage || act.stage,
        deliverable: act.Deliverable || act.deliverable,
        responsibility: act.Responsibility || act.responsibility,
        startDate: act.PlanStart || act.startDate,
        duration: act.Duration || act.duration,
        effort: act.Effort || act.effort,
        status: act.Status || act.status,
        priority: act.Priority || act.priority,
        complexity: act.Complexity || act.complexity,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
