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
import { AcceptancePopComponent } from '../../../../common/shared/acceptance-pop/acceptance-pop.component';
import { StagesPredecessorComponent } from '../../../stages/stages-wbs/stages-predecessor/stages-predecessor.component';
import { getRequirementsForWbs, getRequirementItemsForWbs, getDepartmentAndRoleForRequirement } from '../../../stages/stage-wbs-requirements.data';
import { getTasksForWbs, getTaskItemsForWbs, getTaskDetails } from '../../../stages/stage-wbs-tasks.data';


export interface ProjectActivityItem {
  id?: string | number;
  slNo?: string;
  activityCode?: string;
  taskCode?: string;
  jobCode?: string;
  IsActive?: boolean;
  Approved?: boolean;
  approved?: boolean;
  Done?: boolean;
  done?: boolean;
  fullKit?: boolean;
  Acceptance?: string;
  acceptance?: string;
  predecessor?: string | number;
  predecessors?: string | number;
  predecessorsData?: any[];
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
  planStart?: string;
  PlanEnd: string;
  planEnd?: string;
  ActualStart: string;
  actualStart?: string;
  ActualEnd: string;
  actualEnd?: string;
  ETA: string;
  eta?: string;
  earlyStart?: string;
  EarlyStart?: string;
  earlyEnd?: string;
  EarlyEnd?: string;
  lateStart?: string;
  LateStart?: string;
  lateEnd?: string;
  LateEnd?: string;
  planEffort?: string;
  PlanEffort?: string;
  actualEffort?: string;
  ActualEffort?: string;
  planHours?: string;
  PlanHours?: string;
  actualHours?: string;
  ActualHours?: string;
  Status: string;
  Priority: string;
  Complexity: string;
  Template: string;
  // Done?: boolean;
  Tasks?: string | number;
  Requirements?: string | number;
  tasks?: string | number;
  requirements?: string | number;
  activities?: string;
  delayReason?: string;
  tasksData?: any[];
  requirementsData?: any[];
  department?: string;
  Department?: string;
  slack?: string;
  section?: string;
  Section?: string;
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
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

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

  teamMembers = [
  "Ananya Rao",
  "Dr. Priya Raman",
  "Rajesh Kumar",
  "Anita Desai",
  "Amit Patel",
  "Priya Reddy",
  "Vikram Singh",
  "Suresh Naidu",
  "Arun Joseph",
  "Lakshmi Devi"
];
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
    // 1st 10 Activities taken directly from StagesWbsComponent (S1 and S2)
        const stageActivities: Partial<ProjectActivityItem>[] = [
      {
        slNo: '1.1.1',
        Stage: 'Opportunity Identification',
        Deliverable: 'Market Demand & Application Scope',
        TaskName: 'Review industrial customer specifications, grade requirements and end-use application criteria',
        TaskType: 'R&D',
        Responsibility: 'Dr. Sarah Jenkins',
        Duration: '6 days',
        Effort: '48',
        Description: 'Review industrial customer specifications, grade requirements and end-use application criteria in compliance with chemical manufacturing standards',
        PlanStart: '2026-01-05',
        PlanEnd: '2026-01-11',
        ActualStart: '2026-01-05',
        ActualEnd: '2026-01-11',
        ETA: '2026-01-11',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Chem R&D SOP v2',
        PercentCompletion: 100,
        Done: true,
        done: true,
        Approved: true,
        approved: true,
        Acceptance: '5/5',
        acceptance: '5/5'
      },
      {
        slNo: '1.1.2',
        Stage: 'Opportunity Identification',
        Deliverable: 'Market Demand & Application Scope',
        TaskName: 'Screen global supply-chain gaps and identify target domestic and export market volumes',
        TaskType: 'Commercial',
        Responsibility: 'Rajesh Kumar',
        Duration: '5 days',
        Effort: '40',
        Description: 'Screen global merchant market availability, import tariffs and export volume potential for emulsion polymers',
        PlanStart: '2026-01-06',
        PlanEnd: '2026-01-11',
        ActualStart: '2026-01-06',
        ActualEnd: '',
        ETA: '2026-01-12',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Market Intelligence SOP',
        PercentCompletion: 80,
        Done: false,
        done: false,
        Approved: true,
        approved: true,
        Acceptance: '5/5',
        acceptance: '5/5'
      },
      {
        slNo: '1.1.3',
        Stage: 'Opportunity Identification',
        Deliverable: 'Market Demand & Application Scope',
        TaskName: 'Analyze target product physicochemical specifications (purity, solids content, assay, moisture)',
        TaskType: 'Quality',
        Responsibility: 'Ananya Rao',
        Duration: '4 days',
        Effort: '32',
        Description: 'Establish critical quality parameters: 50% solids, pH 7.5-8.5, viscosity 500-1500 cPs, and MFFT < 10°C',
        PlanStart: '2026-01-07',
        PlanEnd: '2026-01-11',
        ActualStart: '2026-01-07',
        ActualEnd: '',
        ETA: '2026-01-12',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'QC Spec Sheet Template',
        PercentCompletion: 70,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '4/5',
        acceptance: '4/5'
      },
      {
        slNo: '1.2.1',
        Stage: 'Opportunity Identification',
        Deliverable: 'Competitor Grade & Benchmark Characterization',
        TaskName: 'Benchmark competitor grade physicochemical properties (solids %, Tg, viscosity)',
        TaskType: 'R&D',
        Responsibility: 'Amit Patel',
        Duration: '6 days',
        Effort: '48',
        Description: 'Comprehensive comparative profiling against market benchmark resins: differential scanning calorimetry and rheology',
        PlanStart: '2026-01-08',
        PlanEnd: '2026-01-14',
        ActualStart: '2026-01-08',
        ActualEnd: '',
        ETA: '2026-01-14',
        Status: 'In Progress',
        Priority: 'Medium',
        Complexity: 'High',
        Template: 'Polymer Testing SOP',
        PercentCompletion: 60,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '3/5',
        acceptance: '3/5'
      },
      {
        slNo: '1.2.2',
        Stage: 'Opportunity Identification',
        Deliverable: 'Competitor Grade & Benchmark Characterization',
        TaskName: 'Conduct FTIR and GPC molecular weight fingerprinting of commercial benchmark resins',
        TaskType: 'Analytical',
        Responsibility: 'Vikram Nair',
        Duration: '5 days',
        Effort: '40',
        Description: 'Gel permeation chromatography (GPC) molecular weight distribution (Mw, Mn, PDI) and FTIR functional group assay',
        PlanStart: '2026-01-10',
        PlanEnd: '2026-01-15',
        ActualStart: '2026-01-10',
        ActualEnd: '',
        ETA: '2026-01-15',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'GPC Characterization Template',
        PercentCompletion: 50,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '4/5',
        acceptance: '4/5'
      },
      {
        slNo: '1.3.1',
        Stage: 'Opportunity Identification',
        Deliverable: 'Preliminary Business Case & Project Charter',
        TaskName: 'Develop preliminary unit cost economic model and plant CAPEX requirements',
        TaskType: 'Finance',
        Responsibility: 'Dr. Sarah Jenkins',
        Duration: '4 days',
        Effort: '32',
        Description: 'Compile monomer raw material costs, batch cycle time, yield estimate, energy duty and plant CAPEX requirement',
        PlanStart: '2026-01-11',
        PlanEnd: '2026-01-15',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-01-16',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'CAPEX & Cost Model SOP',
        PercentCompletion: 30,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '2/5',
        acceptance: '2/5'
      },
      {
        slNo: '1.3.2',
        Stage: 'Opportunity Identification',
        Deliverable: 'Preliminary Business Case & Project Charter',
        TaskName: 'Draft Project Charter, identify key chemical synthesis risks and gain Gate 1 approval',
        TaskType: 'Governance',
        Responsibility: 'Rajesh Kumar',
        Duration: '3 days',
        Effort: '24',
        Description: 'Document project goals, milestone dates, chemical safety hazards, and present to steering committee for Gate 1 approval',
        PlanStart: '2026-01-13',
        PlanEnd: '2026-01-15',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-01-16',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Gate Charter Template',
        PercentCompletion: 10,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '1/5',
        acceptance: '1/5'
      },
      {
        slNo: '2.1.1',
        Stage: 'Concept Screening & Feasibility',
        Deliverable: 'Reaction Chemistry & Pathway Screening',
        TaskName: 'Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways',
        TaskType: 'R&D',
        Responsibility: 'Ananya Rao',
        Duration: '6 days',
        Effort: '48',
        Description: 'Screen candidate acrylic monomer ratios (MMA/BA/MAA), core-to-shell ratio, and initiator thermal initiation profiles',
        PlanStart: '2026-01-16',
        PlanEnd: '2026-01-22',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-01-23',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Emulsion Chemistry Protocol',
        PercentCompletion: 0,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '0/5',
        acceptance: '0/5'
      },
      {
        slNo: '2.1.2',
        Stage: 'Concept Screening & Feasibility',
        Deliverable: 'Reaction Chemistry & Pathway Screening',
        TaskName: 'Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)',
        TaskType: 'Safety',
        Responsibility: 'Amit Patel',
        Duration: '5 days',
        Effort: '40',
        Description: 'Perform Differential Scanning Calorimetry (DSC) on monomer emulsion and determine heat of polymerization (ΔHrxn)',
        PlanStart: '2026-01-20',
        PlanEnd: '2026-01-25',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-01-26',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Thermal Safety SOP',
        PercentCompletion: 0,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '0/5',
        acceptance: '0/5'
      },
      {
        slNo: '2.2.1',
        Stage: 'Concept Screening & Feasibility',
        Deliverable: 'Raw Material Sourcing & Regulatory Scoping',
        TaskName: 'Screen industrial chemical suppliers, bulk monomer availability and pricing stability',
        TaskType: 'Procurement',
        Responsibility: 'Vikram Nair',
        Duration: '5 days',
        Effort: '40',
        Description: 'Vendor qualification for Butyl Acrylate, Methyl Methacrylate, Surfactants, and evaluate bulk supply contracts',
        PlanStart: '2026-01-22',
        PlanEnd: '2026-01-27',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-01-28',
        Status: 'Pending',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Vendor Audit Template',
        PercentCompletion: 0,
        Done: false,
        done: false,
        Approved: false,
        approved: false,
        Acceptance: '0/5',
        acceptance: '0/5'
      }
    ];

    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
        const defaultDepartments = [
      'Chemical R&D / Process Technology',
      'Market Intelligence & Commercial Strategy',
      'Quality Control & Analytical Services',
      'Product Testing & Application Lab',
      'Quality Control & Analytical Services',
      'Finance & Capital Projects',
      'Executive Steering & Governance',
      'Chemical R&D / Process Technology',
      'Process Safety & Reaction Engineering',
      'Supply Chain & Procurement'
    ];
    const defaultSections = [
      'Polymer Synthesis & Emulsions',
      'Market Analysis & Strategy',
      'Analytical Chemistry',
      'Coatings Performance Lab',
      'Polymer Characterization',
      'Cost Engineering',
      'Steering Committee',
      'Reaction Engineering',
      'Thermal Hazards & Safety',
      'Raw Material Sourcing'
    ];
    const defaultSlacks = ['15 days', '14 days', '5 days', '-', '10 days', '7 days', '3 days', '-', '12 days', '8 days'];

    this.rawProjects = stageActivities.map((item, idx) => {
      const slNo = item.slNo || '';
      const actName = item.TaskName || '';

      // Tasks from StagesWbsComponent (stage-wbs-tasks.data.ts)
      const knownTasks = getTasksForWbs(slNo, actName);
      let totalTasks = knownTasks && knownTasks.length > 0 ? knownTasks.length : 5;
      let taskDone = item.PercentCompletion === 100 ? totalTasks : Math.round(((item.PercentCompletion || 0) / 100) * totalTasks);

      // Check sessionStorage for saved tasks
      for (const k of [slNo, actName]) {
        if (!k) continue;
        const saved = sessionStorage.getItem('project_wbs_tasks_' + k) || sessionStorage.getItem('stages_tasks_' + k);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              totalTasks = parsed.length;
              taskDone = parsed.filter((t: any) => t.done || t.completed || t.status === 'Completed' || t.approved || t.checked).length;
              break;
            }
          } catch (e) {}
        }
      }

      // Requirements from StagesWbsComponent (stage-wbs-requirements.data.ts)
      const knownReqs = getRequirementsForWbs(slNo, actName);
      let totalReqs = knownReqs && knownReqs.length > 0 ? knownReqs.length : 6;
      const accStr = String(item.acceptance || item.Acceptance || '').trim();
      let reqDone = (item.PercentCompletion === 100 || accStr === '5/5') ? totalReqs : Math.round(((item.PercentCompletion || 0) / 100) * totalReqs);

      // Check sessionStorage for saved requirements
      for (const k of [slNo, actName]) {
        if (!k) continue;
        const saved = sessionStorage.getItem('project_wbs_requirements_' + k) || sessionStorage.getItem('stages_requirements_' + k);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              totalReqs = parsed.length;
              reqDone = accStr === '5/5' ? totalReqs : parsed.filter((r: any) => r.done || r.completed || r.status === 'Completed' || r.status === 'Approved' || r.checked).length;
              break;
            }
          } catch (e) {}
        }
      }

      const tasksVal = `${taskDone}/${totalTasks}`;
      const reqVal = `${reqDone}/${totalReqs}`;
      const isFull = accStr === '5/5' || this.checkFullKit(reqVal);

      // Pre-populate tasksData
      const taskItems = getTaskItemsForWbs(slNo, actName);
      const tasksData = (taskItems && taskItems.length > 0) ? taskItems.map((ti, i) => {
        const details = getTaskDetails(ti.task, i, slNo, `BC0${idx + 1}`, `JOB-0${idx + 1}`, ti.taskId);
        const isItemDone = i < taskDone;
        return {
          id: Date.now() + i,
          active: true,
          done: isItemDone,
          approved: isItemDone,
          taskName: ti.task,
          taskCode: ti.taskId || details.taskCode,
          jobCode: details.jobCode || `JOB-0${idx + 1}`,
          department: details.department,
          role: details.role,
          dueDate: details.dueDate,
          completedDate: isItemDone ? '2026-01-07' : '',
          responsibility: item.Responsibility || 'Olivia Brown',
          priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
          remarks: 'Atomic task / deliverable verified',
          historyCount: this.getHistoryCount(i),
          documentsCount: this.getDocumentsCount(i),
          updatedDate: '2026-01-10',
          updatedBy: item.Responsibility || 'Olivia Brown',
          isEditing: false
        };
      }) : [];

      // Pre-populate requirementsData
      const reqItems = getRequirementItemsForWbs(slNo, actName);
      const requirementsData = (reqItems && reqItems.length > 0) ? reqItems.map((ri, i) => {
        const { department, role } = getDepartmentAndRoleForRequirement(ri.requirement);
        const isItemDone = i < reqDone;
        return {
          id: Date.now() + i,
          active: true,
          done: isItemDone,
          requirementName: ri.requirement,
          department: department,
          role: role,
          dueDate: '2026-01-15',
          completedDate: isItemDone ? '2026-01-07' : '',
          remarks: 'Atomic prerequisite / resource verified',
          historyCount: this.getHistoryCount(i),
          documentsCount: this.getDocumentsCount(i),
          updatedDate: '2026-01-10',
          updatedBy: item.Responsibility || 'Olivia Brown',
          isEditing: false
        };
      }) : [];

      const isDone = item.Done !== undefined ? item.Done : (item.done !== undefined ? item.done : (item.PercentCompletion === 100));
      const isApproved = item.Approved !== undefined ? item.Approved : (item.approved !== undefined ? item.approved : (item.PercentCompletion === 100));

      const effortNum = parseInt(String(item.Effort || '16').replace(/\D/g, '') || '16', 10);
      const planEff = item.planEffort || `${effortNum} hrs`;
      const actEff = item.actualEffort || (
        item.PercentCompletion === 100
          ? planEff
          : (item.ActualStart ? `${Math.round((effortNum * (item.PercentCompletion || 50)) / 100)} hrs` : '0 hrs')
      );
      const planHrs = item.planHours || planEff;
      const actHrs = item.actualHours || actEff;

      const pStart = item.PlanStart || '2026-01-05';
      const pEnd = item.PlanEnd || '2026-01-07';
      const eStart = item.earlyStart || item.EarlyStart || pStart;
      const eEnd = item.earlyEnd || item.EarlyEnd || pEnd;
      const lStart = item.lateStart || item.LateStart || this.shiftDate(pStart, 2);
      const lEnd = item.lateEnd || item.LateEnd || this.shiftDate(pEnd, 2);

      return {
        id: idx + 1,
        IsActive: true,
        ProjectName: this.projectName,
        ProjectCode: this.projectCode,
        jobCode: `BC0${idx + 1}`,
        activityCode: item.activityCode || `ACT-${String(idx + 1).padStart(3, '0')}`,
        department: item.department || item.Department || defaultDepartments[idx % defaultDepartments.length],
        slack: item.slack || defaultSlacks[idx % defaultSlacks.length],
        section: item.section || item.Section || defaultSections[idx % defaultSections.length],
        Done: isDone,
        done: isDone,
        Approved: isApproved,
        approved: isApproved,
        fullKit: isFull,
        Tasks: tasksVal,
        tasks: tasksVal,
        Requirements: reqVal,
        requirements: reqVal,
        tasksData: tasksData,
        requirementsData: requirementsData,
        planStart: pStart,
        PlanStart: pStart,
        planEnd: pEnd,
        PlanEnd: pEnd,
        actualStart: item.ActualStart || '',
        ActualStart: item.ActualStart || '',
        actualEnd: item.ActualEnd || '',
        ActualEnd: item.ActualEnd || '',
        eta: item.ETA || pEnd,
        ETA: item.ETA || pEnd,
        earlyStart: eStart,
        EarlyStart: eStart,
        earlyEnd: eEnd,
        EarlyEnd: eEnd,
        lateStart: lStart,
        LateStart: lStart,
        lateEnd: lEnd,
        LateEnd: lEnd,
        planEffort: planEff,
        PlanEffort: planEff,
        actualEffort: actEff,
        ActualEffort: actEff,
        planHours: planHrs,
        PlanHours: planHrs,
        actualHours: actHrs,
        ActualHours: actHrs,
        predecessors: item.predecessors ?? item.predecessor ?? String((idx % 3) + 1),
        predecessor: item.predecessors ?? item.predecessor ?? String((idx % 3) + 1),
        delayReason: item.delayReason ?? this.delayReasonOptions[idx % this.delayReasonOptions.length],
        historyCount: this.getHistoryCount(idx),
        documentsCount: this.getDocumentsCount(idx),
        updatedDate: item.updatedDate ?? defaultDates[idx % defaultDates.length],
        updatedBy: item.updatedBy ?? item.Responsibility ?? defaultUpdaters[idx % defaultUpdaters.length],
        ...item
      } as ProjectActivityItem;
    });
    this.applyFilter();
  }

  openPredecessor(row: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: {
          ...row,
          task: row.TaskName,
          slNo: row.slNo
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessors = String(result.predecessor);
          row.predecessor = String(result.predecessor);
        }
      }
    });
  }

  isFullKit(item: ProjectActivityItem): boolean {
    const acc = String(item.acceptance || item.Acceptance || '').trim();
    if (acc === '5/5') {
      return true;
    }
    return this.checkFullKit(item.Requirements ?? item.requirements ?? item.activities);
  }

  checkFullKit(requirementsVal: any): boolean {
    const req = String(requirementsVal || '').trim();
    if (req.includes('/')) {
      const [numStr, denStr] = req.split('/');
      const num = parseInt(numStr.trim(), 10);
      const den = parseInt(denStr.trim(), 10);
      return !isNaN(num) && !isNaN(den) && den > 0 && num === den;
    }
    return false;
  }

  openAcceptancePop(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(AcceptancePopComponent, {
      width: '800px',
      minWidth: '650px',
      maxWidth: '95vw',
      data: {
        title: 'Acceptance',
        activity: item
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.acceptedCount !== undefined && res.totalCount !== undefined) {
        const val = `${res.acceptedCount}/${res.totalCount}`;
        item.Acceptance = val;
        item.acceptance = val;
        item.fullKit = this.isFullKit(item);
      }
    });
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
        (p.Description && p.Description.toLowerCase().includes(kw)) ||
        (p.slNo && p.slNo.toLowerCase().includes(kw))
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
      width: '1000px',
      maxWidth: '95vw',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const predCount = result.predecessor || (result.predecessorsData?.length ? String(result.predecessorsData.length) : '0');
        const newItem: ProjectActivityItem = {
          IsActive: true,
          ProjectName: this.projectName,
          ProjectCode: this.projectCode,
          activityCode: result.activityCode || `ACT-${String(this.rawProjects.length + 1).padStart(3, '0')}`,
          department: result.department || result.Department || 'R&D',
          slack: result.slack || '—',
          section: result.section || result.Section || 'Formulation Development',
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
          planStart: result.PlanStart || result.planStart || new Date().toISOString().split('T')[0],
          PlanEnd: result.PlanEnd || '',
          planEnd: result.PlanEnd || result.planEnd || '',
          ActualStart: result.ActualStart || '',
          actualStart: result.ActualStart || result.actualStart || '',
          ActualEnd: result.ActualEnd || '',
          actualEnd: result.ActualEnd || result.actualEnd || '',
          ETA: result.ETA || '',
          eta: result.ETA || result.eta || '',
          planEffort: result.planEffort || '20 hrs',
          actualEffort: result.actualEffort || '0 hrs',
          planHours: result.planHours || result.planEffort || '20 hrs',
          actualHours: result.actualHours || result.actualEffort || '0 hrs',
          earlyStart: result.earlyStart || result.PlanStart || new Date().toISOString().split('T')[0],
          earlyEnd: result.earlyEnd || result.PlanEnd || '',
          lateStart: result.lateStart || '',
          lateEnd: result.lateEnd || '',
          Status: result.Status || 'In Progress',
          Priority: 'Medium',
          Complexity: 'Medium',
          Template: 'Dev Template',
          predecessor: predCount,
          predecessors: predCount,
          predecessorsData: result.predecessorsData || []
        };
        this.rawProjects.unshift(newItem);
        this.applyFilter();
      }
    });
  }

  openEditDialog(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: { ...item, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          activityCode: result.activityCode !== undefined ? result.activityCode : item.activityCode,
          department: (result.department || result.Department) ?? item.department,
          section: (result.section || result.Section) ?? item.section,
          Stage: result.stage || result.Stage || item.Stage || 'S1',
          Deliverable: result.Deliverable || item.Deliverable,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          planStart: result.PlanStart || result.planStart || item.planStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          planEnd: result.PlanEnd || result.planEnd || item.planEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          actualStart: result.ActualStart || result.actualStart || item.actualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          actualEnd: result.ActualEnd || result.actualEnd || item.actualEnd,
          ETA: result.ETA !== undefined ? result.ETA : item.ETA,
          eta: result.ETA !== undefined ? result.ETA : (result.eta !== undefined ? result.eta : item.eta),
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort,
          planEffort: result.planEffort || item.planEffort,
          actualEffort: result.actualEffort || item.actualEffort,
          planHours: result.planHours || item.planHours,
          actualHours: result.actualHours || item.actualHours,
          earlyStart: result.earlyStart || item.earlyStart,
          earlyEnd: result.earlyEnd || item.earlyEnd,
          lateStart: result.lateStart || item.lateStart,
          lateEnd: result.lateEnd || item.lateEnd,
          predecessor: result.predecessor !== undefined ? result.predecessor : item.predecessor,
          predecessors: result.predecessors !== undefined ? result.predecessors : item.predecessors,
          predecessorsData: result.predecessorsData !== undefined ? result.predecessorsData : item.predecessorsData
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

  shiftDate(dateStr: string | undefined, days: number): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  }

  openTimelineModal(task: ProjectActivityItem): void {
    const effortNum = parseInt(String(task.Effort || task.planEffort || '16').replace(/\D/g, '') || '16', 10);
    const planEff = task.planEffort || task.PlanEffort || `${effortNum} hrs`;
    const actEff = task.actualEffort || task.ActualEffort || (
      task.PercentCompletion === 100
        ? planEff
        : (task.ActualStart ? `${Math.round((effortNum * (task.PercentCompletion || 50)) / 100)} hrs` : '0 hrs')
    );
    const planHrs = task.planHours || task.PlanHours || planEff;
    const actHrs = task.actualHours || task.ActualHours || actEff;

    const pStart = task.planStart || task.PlanStart || '2026-01-05';
    const pEnd = task.planEnd || task.PlanEnd || '2026-01-07';
    const eStart = task.earlyStart || task.EarlyStart || pStart;
    const eEnd = task.earlyEnd || task.EarlyEnd || pEnd;
    const lStart = task.lateStart || task.LateStart || this.shiftDate(pStart, 2);
    const lEnd = task.lateEnd || task.LateEnd || this.shiftDate(pEnd, 2);

    this.selectedTimelineTask = {
      ...task,
      planStart: pStart,
      PlanStart: pStart,
      planEnd: pEnd,
      PlanEnd: pEnd,
      actualStart: task.actualStart || task.ActualStart || '',
      ActualStart: task.actualStart || task.ActualStart || '',
      actualEnd: task.actualEnd || task.ActualEnd || '',
      ActualEnd: task.actualEnd || task.ActualEnd || '',
      eta: task.eta || task.ETA || pEnd,
      ETA: task.eta || task.ETA || pEnd,
      earlyStart: eStart,
      EarlyStart: eStart,
      earlyEnd: eEnd,
      EarlyEnd: eEnd,
      lateStart: lStart,
      LateStart: lStart,
      lateEnd: lEnd,
      LateEnd: lEnd,
      planEffort: planEff,
      PlanEffort: planEff,
      actualEffort: actEff,
      ActualEffort: actEff,
      planHours: planHrs,
      PlanHours: planHrs,
      actualHours: actHrs,
      ActualHours: actHrs
    };
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
        slNo: item.slNo || '',
        activityName: item.TaskName,
        jobCode: item.jobCode || item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        stageCode: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.Tasks ?? item.tasks ?? '',
        source: 'activities'
      }
    });
  }

  onRequirementsClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        slNo: item.slNo || '',
        activityName: item.TaskName,
        jobCode: item.jobCode || item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        stageCode: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.Requirements ?? item.requirements ?? item.activities ?? '',
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
        slNo: act.slNo || '',
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
