import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from '../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../../common/shared/documents-pop/documents-pop.component';
import { AcceptancePopComponent } from '../../../../../../common/shared/acceptance-pop/acceptance-pop.component';
import { GateActivityItem } from '../../proj-gates-activities/proj-gates-activities.component';
import { AddGateActivityComponent } from '../../proj-gates-activities/add-gate-activity/add-gate-activity.component';

export interface DebateActivityItem {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-debate-activities',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './debate-activities.component.html',
  styleUrl: './debate-activities.component.scss',
})
export class DebateActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  gateCode: string = 'Gate 1';
  gateName: string = 'Business Case';
  role: string = '';
  memberName: string = '';
  source: string = 'debate';
  rowId: string | number = '';

  isFilterVisible: boolean = false;
  filterDepartment: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  departments: string[] = [
    'Chemical R&D / Process Technology',
    'Process Safety & EHS',
    'Pilot Plant & Scale-Up Engineering',
    'Analytical Science & QC',
    'Regulatory Affairs & Stewardship',
    'Project Engineering & Operations',
    'Commercial & Supply Chain'
  ];
  sections: string[] = [
    'Process Chemistry',
    'Reaction Engineering',
    'Process Safety (RC1/DSC)',
    'Pilot Plant Operations',
    'Analytical & Quality Control',
    'Regulatory & REACH/TSCA Compliance',
    'Costing & Capital Budgeting'
  ];
  priorities: string[] = ['High', 'Medium', 'Low'];
  responsibilities: string[] = [
    'Dr. Sarah Jenkins',
    'Michael Chang',
    'Dr. Priya Nair',
    'Alex Rivera',
    'Emily Watson',
    'David Miller',
    'Dr. Satya Prasad'
  ];

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
  ];

  activities: GateActivityItem[] = [];
  filteredActivities: GateActivityItem[] = [];
  pagedActivities: GateActivityItem[] = [];

  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal
  showTimelineModal: boolean = false;
  selectedTimelineItem: any = null;

  readonly historySequence: number[] = [4, 2, 5, 2, 4, 7, 8, 3, 5, 2, 6, 4, 8, 2, 5, 7, 3, 6, 4, 2];
  readonly documentsSequence: number[] = [2, 5, 1, 4, 3, 2, 6, 1, 4, 2, 5, 3];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['code'] || params['projectCode']) {
        this.projectCode = params['code'] || params['projectCode'];
      }
      if (params['gateCode']) {
        this.gateCode = params['gateCode'];
      }
      if (params['gateName']) {
        this.gateName = params['gateName'];
      }
      if (params['role']) {
        this.role = params['role'];
      }
      if (params['name'] && params['projectName']) {
        this.memberName = params['name'];
      } else if (params['name'] && !params['projectName'] && !params['role']) {
        this.projectName = params['name'];
      }
      if (params['source']) {
        this.source = params['source'];
      }
      if (params['rowId']) {
        this.rowId = params['rowId'];
      }

      this.initActivities();
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  initActivities(): void {
    this.activities = [
      {
        id: 1,
        activityCode: 'ACT-001',
        activityName: 'Review industrial customer specifications, grade requirements and end-use application criteria',
        jobCode: 'JB-101',
        department: 'Regulatory Affairs',
        section: 'Formulation Development',
        responsibility: this.memberName || 'Alex Rivera',
        priority: 'High',
        status: true,
        done: true,
        approved: true,
        acceptance: '4/5',
        tasks: '4/13',
        activitiesCount: '5/9',
        delayReason: 'Raw Material Shortage',
        planStart: '2026-01-05',
        planEnd: '2026-01-15',
        actualStart: '2026-01-05',
        actualEnd: '2026-01-14',
        eta: '2026-01-15',
        planDuration: '10 days',
        actualDuration: '9 days',
        planEffort: '40 hrs',
        actualEffort: '36 hrs',
        buffer: '1 day',
        remarks: 'Industrial customer specifications and target application scope verified',
        updatedDate: '2026-02-15',
        updatedBy: this.memberName || 'Alex Rivera'
      },
      {
        id: 2,
        activityCode: 'ACT-002',
        activityName: 'Chemistry & Process Feasibility Assessment',
        jobCode: 'JB-102',
        department: 'Supply Chain',
        section: 'Analytical Development',
        responsibility: this.memberName || 'David Miller',
        priority: 'High',
        status: true,
        done: true,
        approved: true,
        acceptance: '2/6',
        tasks: '1/13',
        activitiesCount: '2/9',
        delayReason: 'Regulatory Approval Pending',
        planStart: '2026-01-10',
        planEnd: '2026-01-25',
        actualStart: '2026-01-10',
        actualEnd: '2026-01-24',
        eta: '2026-01-25',
        planDuration: '15 days',
        actualDuration: '14 days',
        planEffort: '30 hrs',
        actualEffort: '30 hrs',
        buffer: '1 day',
        remarks: 'Key chemical precursor vendors qualified with purity and safety assay',
        updatedDate: '2026-03-01',
        updatedBy: this.memberName || 'David Miller'
      },
      {
        id: 3,
        activityCode: 'ACT-003',
        activityName: 'Patents & Freedom-to-Operate (FTO) Clearance',
        jobCode: 'JB-103',
        department: 'Analytical QA',
        section: 'Process Safety (RC1/DSC)',
        responsibility: this.memberName || 'Dr. Priya Nair',
        priority: 'High',
        status: true,
        done: true,
        approved: true,
        acceptance: '3/5',
        tasks: '8/13',
        activitiesCount: '7/9',
        delayReason: 'Vendor Dispatch Delay',
        planStart: '2026-01-15',
        planEnd: '2026-02-05',
        actualStart: '2026-01-15',
        actualEnd: '2026-02-04',
        eta: '2026-02-05',
        planDuration: '20 days',
        actualDuration: '20 days',
        planEffort: '45 hrs',
        actualEffort: '45 hrs',
        buffer: '2 days',
        remarks: 'Thermal stability and reaction hazard assessment completed without runaway potential',
        updatedDate: '2026-03-12',
        updatedBy: this.memberName || 'Dr. Priya Nair'
      },
      {
        id: 4,
        activityCode: 'ACT-004',
        activityName: 'Process Safety & Scale-Up Risk Assessment',
        jobCode: 'JB-104',
        department: 'R&D / Formulation',
        section: 'Regulatory Compliance',
        responsibility: this.memberName || 'Dr. Sarah Jenkins',
        priority: 'High',
        status: true,
        done: true,
        approved: true,
        acceptance: '5/5',
        tasks: '6/13',
        activitiesCount: '4/9',
        planStart: '2026-01-20',
        planEnd: '2026-02-08',
        actualStart: '2026-01-20',
        actualEnd: '2026-02-07',
        eta: '2026-02-08',
        planDuration: '18 days',
        actualDuration: '18 days',
        planEffort: '25 hrs',
        actualEffort: '25 hrs',
        buffer: '1 day',
        remarks: 'Filing strategy pathway baseline signed off',
        updatedDate: '2026-04-05',
        updatedBy: this.memberName || 'Dr. Sarah Jenkins'
      },
      {
        id: 5,
        activityCode: 'ACT-005',
        activityName: 'Process Robustness Proof',
        jobCode: 'JB-105',
        department: 'R&D / Formulation',
        section: 'Formulation Development',
        responsibility: this.memberName || 'Michael Chang',
        priority: 'Medium',
        status: true,
        done: true,
        approved: true,
        acceptance: '3/6',
        tasks: '10/13',
        activitiesCount: '3/9',
        planStart: '2026-01-25',
        planEnd: '2026-02-10',
        actualStart: '2026-01-25',
        actualEnd: '2026-02-09',
        eta: '2026-02-10',
        planDuration: '16 days',
        actualDuration: '15 days',
        planEffort: '20 hrs',
        actualEffort: '20 hrs',
        buffer: '1 day',
        remarks: 'Reaction yield and selectivity verified against benchmark',
        updatedDate: '2026-05-20',
        updatedBy: this.memberName || 'Michael Chang'
      },
      {
        id: 6,
        activityCode: 'ACT-006',
        activityName: 'Cost of Goods Sold (COGS) Feasibility Assessment',
        jobCode: 'JB-106',
        department: 'Project Management',
        section: 'Quality Control',
        responsibility: this.memberName || 'Emily Watson',
        priority: 'Medium',
        status: true,
        done: true,
        approved: true,
        acceptance: '1/4',
        tasks: '7/13',
        activitiesCount: '6/9',
        planStart: '2026-01-28',
        planEnd: '2026-02-12',
        actualStart: '2026-01-28',
        actualEnd: '2026-02-12',
        eta: '2026-02-12',
        planDuration: '15 days',
        actualDuration: '15 days',
        planEffort: '18 hrs',
        actualEffort: '18 hrs',
        buffer: '0 days',
        remarks: 'Target COGS within projected budget threshold',
        updatedDate: '2026-02-15',
        updatedBy: this.memberName || 'Emily Watson'
      },
      {
        id: 7,
        activityCode: 'ACT-007',
        activityName: 'Gate Sign-off & Portfolio Risk Assessment',
        jobCode: 'JB-107',
        department: 'Quality Assurance',
        section: 'Analytical Development',
        responsibility: this.memberName || 'Dr. Satya Prasad',
        priority: 'High',
        status: true,
        done: true,
        approved: true,
        acceptance: '2/5',
        tasks: '9/13',
        activitiesCount: '5/9',
        planStart: '2026-02-01',
        planEnd: '2026-02-15',
        actualStart: '2026-02-01',
        actualEnd: '2026-02-14',
        eta: '2026-02-15',
        planDuration: '14 days',
        actualDuration: '13 days',
        planEffort: '22 hrs',
        actualEffort: '22 hrs',
        buffer: '1 day',
        remarks: 'Process chemistry stage-gate charter sign-off approved',
        updatedDate: '2026-03-01',
        updatedBy: this.memberName || 'Dr. Satya Prasad'
      },
      {
        id: 8,
        activityCode: 'ACT-008',
        activityName: 'Gate 1 Evidence Verification & Tasks Closure',
        jobCode: 'JB-108',
        department: 'Project Management',
        section: 'Formulation Development',
        responsibility: this.memberName || 'Alex Rivera',
        priority: 'High',
        status: true,
        done: true,
        approved: true,
        acceptance: '5/5',
        tasks: '12/13',
        activitiesCount: '8/9',
        planStart: '2026-02-05',
        planEnd: '2026-02-15',
        actualStart: '2026-02-05',
        actualEnd: '2026-02-14',
        eta: '2026-02-15',
        planDuration: '10 days',
        actualDuration: '9 days',
        planEffort: '25 hrs',
        actualEffort: '24 hrs',
        buffer: '1 day',
        remarks: 'All Gate 1 tasks and checklist criteria accepted with traceable evidence',
        updatedDate: '2026-03-05',
        updatedBy: this.memberName || 'Alex Rivera'
      }
    ];

    const gate = (this.gateCode || 'Gate 1').toLowerCase();
    if (gate.includes('gate 2') || gate.includes('gate-2') || gate.includes('initiation') || gate.endsWith('2')) {
      const g2Activities: string[] = [
        'Project Costing & Approved Budget Sign-off',
        'IP Landscape Scan & FTO Strategy',
        'MER Availability & Fit for Use Confirmation',
        'PPDS Finalisation & Formal Approval',
        'Regulatory / EHS Strategy & Quality Product Profile Assessment',
        'Basis of Design (BOD) & Mass Balance Freeze',
        'Raw Material & Catalyst Sourcing Specs',
        'Process Flow Diagram & Energy Model',
        'Gate 2 Chemical Route Selection Review',
        'Gate 2 Tasks Acceptance & Cost Variance Review'
      ];
      this.activities = g2Activities.map((name, i) => ({
        id: i + 1,
        activityCode: `ACT-${String(i + 1).padStart(3, '0')}`,
        activityName: name,
        jobCode: `JB-20${i + 1}`,
        department: this.departments[i % this.departments.length],
        section: this.sections[i % this.sections.length],
        responsibility: this.memberName || this.responsibilities[i % this.responsibilities.length],
        priority: (i % 3 === 0 ? 'High' : (i % 3 === 1 ? 'Medium' : 'Low')) as 'High' | 'Medium' | 'Low',
        status: true,
        done: true,
        approved: true,
        acceptance: `${Math.min(5, i + 2)}/7`,
        tasks: `${i + 4}/13`,
        activitiesCount: `${i + 3}/9`,
        planStart: '2026-02-16',
        planEnd: '2026-06-30',
        actualStart: '2026-02-16',
        actualEnd: '2026-06-28',
        eta: '2026-06-30',
        planDuration: '250 days',
        actualDuration: '240 days',
        planEffort: '280 hrs',
        actualEffort: '270 hrs',
        buffer: '5 days',
        remarks: `Gate 2 checkpoint requirement ${i + 1} completed`,
        updatedDate: '2026-06-30',
        updatedBy: this.memberName || this.responsibilities[i % this.responsibilities.length]
      }));
    } else if (gate.includes('gate 3') || gate.includes('gate-3') || gate.includes('prototype') || gate.endsWith('3')) {
      const g3Activities: string[] = [
        'Process Hazard Analysis (HAZOP) Package',
        'Pilot Plant Equipment & Safety Readiness',
        'Product Specification & GC Method Validation',
        'Environmental & Toxicology Data Package',
        'Reaction Calorimetry (RC1) Thermal Data',
        'REACH / TSCA Technical Dossier Ready',
        'Solvent Recovery & Waste Stream Balance',
        'Pilot Batch Record (BMR) & P&ID Sign-off',
        'Pre-Startup Safety Review (PSSR) Checklist',
        'Executive Committee Pilot Campaign Release'
      ];
      this.activities = g3Activities.map((name, i) => ({
        id: i + 1,
        activityCode: `ACT-${String(i + 1).padStart(3, '0')}`,
        activityName: name,
        jobCode: `JB-30${i + 1}`,
        department: this.departments[i % this.departments.length],
        section: this.sections[i % this.sections.length],
        responsibility: this.memberName || this.responsibilities[i % this.responsibilities.length],
        priority: (i % 2 === 0 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
        status: true,
        done: true,
        approved: true,
        acceptance: `${Math.min(6, i + 2)}/7`,
        tasks: `${i + 3}/13`,
        activitiesCount: `${i + 2}/9`,
        planStart: '2026-07-01',
        planEnd: '2026-09-15',
        actualStart: '2026-07-01',
        actualEnd: '2026-09-10',
        eta: '2026-09-15',
        planDuration: '75 days',
        actualDuration: '70 days',
        planEffort: '150 hrs',
        actualEffort: '140 hrs',
        buffer: '3 days',
        remarks: `Prototype development checkpoint ${i + 1} reviewed`,
        updatedDate: '2026-09-15',
        updatedBy: this.memberName || this.responsibilities[i % this.responsibilities.length]
      }));
    } else if (gate.includes('gate 4') || gate.includes('gate-4') || gate.includes('pilot') || gate.endsWith('4')) {
      const g4Activities: string[] = [
        'Scale-up & EB BOMs Approval & Procurement',
        'Raw and Packaging Materials QA/QC Release',
        'Facility, Equipment & Process Readiness Clearance',
        'Scale-up Batch Execution & Deviation Closure',
        'Pilot Plant Performance Review',
        'Demo-Scale Campaign Results',
        'Customer Qualification Evidence',
        'Process Safety Review Outcome',
        'QbD Formulation & Process Freeze Approval',
        'Gate 4 Tasks Acceptance & Budget Review'
      ];
      this.activities = g4Activities.map((name, i) => ({
        id: i + 1,
        activityCode: `ACT-${String(i + 1).padStart(3, '0')}`,
        activityName: name,
        jobCode: `JB-40${i + 1}`,
        department: this.departments[i % this.departments.length],
        section: this.sections[i % this.sections.length],
        responsibility: this.memberName || this.responsibilities[i % this.responsibilities.length],
        priority: (i % 2 === 0 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
        status: true,
        done: true,
        approved: true,
        acceptance: `${Math.min(5, i + 2)}/7`,
        tasks: `${i + 2}/13`,
        activitiesCount: `${i + 2}/9`,
        planStart: '2026-09-16',
        planEnd: '2026-11-30',
        actualStart: '2026-09-16',
        actualEnd: '2026-11-25',
        eta: '2026-11-30',
        planDuration: '75 days',
        actualDuration: '70 days',
        planEffort: '160 hrs',
        actualEffort: '150 hrs',
        buffer: '4 days',
        remarks: `Scale-Up & Pilot BE checkpoint ${i + 1} progress confirmed`,
        updatedDate: '2026-11-30',
        updatedBy: this.memberName || this.responsibilities[i % this.responsibilities.length]
      }));
    } else if (gate.includes('gate 5') || gate.includes('gate-5') || gate.includes('validation') || gate.endsWith('5')) {
      const g5Activities: string[] = [
        'Commissioning & Performance Test Results',
        'Operating Procedures & Operator Training',
        'Safety, Environmental & Operating Permits',
        'Analytical Method Transfer to QC Execution',
        'Cleaning Validation Clearance & Approval',
        'Gate 5 Tasks Acceptance & Verification'
      ];
      this.activities = g5Activities.map((name, i) => ({
        id: i + 1,
        activityCode: `ACT-${String(i + 1).padStart(3, '0')}`,
        activityName: name,
        jobCode: `JB-50${i + 1}`,
        department: this.departments[i % this.departments.length],
        section: this.sections[i % this.sections.length],
        responsibility: this.memberName || this.responsibilities[i % this.responsibilities.length],
        priority: 'High' as 'High' | 'Medium' | 'Low',
        status: true,
        done: true,
        approved: true,
        acceptance: `${Math.min(5, i + 2)}/6`,
        tasks: `${i + 3}/13`,
        activitiesCount: `${i + 2}/9`,
        planStart: '2026-12-01',
        planEnd: '2027-01-31',
        actualStart: '2026-12-01',
        actualEnd: '2027-01-25',
        eta: '2027-01-31',
        planDuration: '60 days',
        actualDuration: '55 days',
        planEffort: '120 hrs',
        actualEffort: '110 hrs',
        buffer: '3 days',
        remarks: `Commissioning and safety requirement ${i + 1} completed`,
        updatedDate: '2027-01-31',
        updatedBy: this.memberName || this.responsibilities[i % this.responsibilities.length]
      }));
    } else if (gate.includes('gate 6') || gate.includes('gate-6') || gate.includes('ttd') || gate.endsWith('6')) {
      const g6Activities: string[] = [
        'Technology Transfer Dossier (TTD) Approval',
        'Stability & Special-study Protocols Integration',
        'Receiving Site Tech Transfer Acceptance',
        'Final RM, PM and FP Specifications Release',
        'Specialized Study Protocols Sign-off',
        'PV, Hold-time Protocols, BMR & BPR Clearance',
        '3 Exhibit Batches Execution & Deviation Closure',
        'Exhibit Stability Loading & Time Zero Clearance',
        'Exhibit Batch Data Generation & Dossier Inclusion',
        'Gate 6 Tasks Acceptance & Cost Variance Review'
      ];
      this.activities = g6Activities.map((name, i) => ({
        id: i + 1,
        activityCode: `ACT-${String(i + 1).padStart(3, '0')}`,
        activityName: name,
        jobCode: `JB-60${i + 1}`,
        department: this.departments[i % this.departments.length],
        section: this.sections[i % this.sections.length],
        responsibility: this.memberName || this.responsibilities[i % this.responsibilities.length],
        priority: (i % 2 === 0 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
        status: true,
        done: true,
        approved: true,
        acceptance: `${Math.min(6, i + 2)}/7`,
        tasks: `${i + 2}/13`,
        activitiesCount: `${i + 2}/9`,
        planStart: '2027-02-01',
        planEnd: '2027-04-30',
        actualStart: '2027-02-01',
        actualEnd: '2027-04-20',
        eta: '2027-04-30',
        planDuration: '90 days',
        actualDuration: '80 days',
        planEffort: '180 hrs',
        actualEffort: '160 hrs',
        buffer: '5 days',
        remarks: `TTD and Exhibit batch execution milestone ${i + 1} ongoing`,
        updatedDate: '2027-04-30',
        updatedBy: this.memberName || this.responsibilities[i % this.responsibilities.length]
      }));
    } else if (gate.includes('gate 7') || gate.includes('gate-7') || gate.includes('dossier') || gate.endsWith('7')) {
      const g7Activities: string[] = [
        'Pre-Startup Safety Review (PSSR) Sign-Off',
        'Commercial Launch & Nameplate Capacity Ramp-Up',
        'Commercial Quality Control Handover',
        'GHS / CLP Safety Data Sheet (SDS) Final Distribution',
        'Protocol-bound Stability Data Dossier Consolidation',
        'Draft Dossier Compilation & Submission Strategy',
        'Final Dossier Evidence & Country Compliance',
        'Regulatory Dossier Filing & Agency Acknowledgement',
        'Gate 7 Tasks Acceptance & Final Project Review'
      ];
      this.activities = g7Activities.map((name, i) => ({
        id: i + 1,
        activityCode: `ACT-${String(i + 1).padStart(3, '0')}`,
        activityName: name,
        jobCode: `JB-70${i + 1}`,
        department: this.departments[i % this.departments.length],
        section: this.sections[i % this.sections.length],
        responsibility: this.memberName || this.responsibilities[i % this.responsibilities.length],
        priority: (i % 2 === 0 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
        status: true,
        done: true,
        approved: true,
        acceptance: `${Math.min(5, i + 2)}/7`,
        tasks: `${i + 2}/13`,
        activitiesCount: `${i + 2}/9`,
        planStart: '2027-05-01',
        planEnd: '2027-08-31',
        actualStart: '2027-05-01',
        actualEnd: '2027-08-20',
        eta: '2027-08-31',
        planDuration: '120 days',
        actualDuration: '110 days',
        planEffort: '200 hrs',
        actualEffort: '190 hrs',
        buffer: '6 days',
        remarks: `Registration dossier and filing checkpoint ${i + 1} active`,
        updatedDate: '2027-08-31',
        updatedBy: this.memberName || this.responsibilities[i % this.responsibilities.length]
      }));
    }

    const defaultSlacks = ['15 days', '14 days', '5 days', '-', '10 days', '7 days', '3 days', '-', '12 days', '8 days'];
    this.activities.forEach((a, idx) => {
      a.slack = a.slack || defaultSlacks[idx % defaultSlacks.length];
      a.historyCount = this.historySequence[idx % this.historySequence.length];
      a.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (a.done === undefined) {
        a.done = true;
      }
      if (a.approved === undefined) {
        a.approved = true;
      }
    });
  }

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  applyFilter(): void {
    this.filteredActivities = this.activities.filter(a => {
      const matchDept = !this.filterDepartment || a.department === this.filterDepartment;
      const matchPrio = !this.filterPriority || a.priority === this.filterPriority;
      const matchStatus = !this.filterStatus || (this.filterStatus === 'Active' ? a.status : !a.status);
      return matchDept && matchPrio && matchStatus;
    });
    this.currentPage = 0;
    this.updatePagedActivities();
  }

  resetFilter(): void {
    this.filterDepartment = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  updatePagedActivities(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedActivities = this.filteredActivities.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedActivities();
  }

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

  goBack(): void {
    if (this.source === 'activities') {
      this.router.navigate(['/projects/dashboard/gates/activities'], {
        queryParams: {
          gateCode: this.gateCode,
          gateName: this.gateName,
          projectName: this.projectName,
          code: this.projectCode
        }
      });
    } else {
      this.router.navigate(['/projects/dashboard/gates/debate'], {
        queryParams: {
          gateCode: this.gateCode,
          gateName: this.gateName,
          projectName: this.projectName,
          code: this.projectCode
        }
      });
    }
  }

  toggleStatus(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: `Are you sure you want to ${activity.status ? 'deactivate' : 'activate'} this activity?`
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        activity.status = !activity.status;
      }
    });
  }

  deleteActivity(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Activity',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.activities = this.activities.filter(a => a !== activity);
        this.applyFilter();
      }
    });
  }

  shiftDate(dateStr: string, days: number): string {
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

  openTimelineModal(activity: GateActivityItem): void {
    const effortNum = parseInt(String(activity.planEffort || '16').replace(/\D/g, '') || '16', 10);
    const planEff = activity.planEffort || `${effortNum} hrs`;
    const actEff = activity.actualEffort || (
      activity.status
        ? planEff
        : (activity.actualStart ? `${Math.round(effortNum * 0.5)} hrs` : '0 hrs')
    );
    const planHrs = activity.planHours || planEff;
    const actHrs = activity.actualHours || actEff;

    const pStart = activity.planStart || '2026-01-05';
    const pEnd = activity.planEnd || '2026-01-07';
    const eStart = activity.earlyStart || pStart;
    const eEnd = activity.earlyEnd || pEnd;
    const lStart = activity.lateStart || this.shiftDate(pStart, 2);
    const lEnd = activity.lateEnd || this.shiftDate(pEnd, 2);

    this.selectedTimelineItem = {
      ...activity,
      name: activity.activityName,
      planStart: pStart,
      planEnd: pEnd,
      actualStart: activity.actualStart || '',
      actualEnd: activity.actualEnd || '',
      eta: activity.eta || pEnd,
      earlyStart: eStart,
      earlyEnd: eEnd,
      lateStart: lStart,
      lateEnd: lEnd,
      planEffort: planEff,
      actualEffort: actEff,
      planHours: planHrs,
      actualHours: actHrs,
      projectName: this.projectName,
      responsibility: activity.responsibility || '—',
      department: activity.department || '—'
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openAddActivity(): void {
    const dialogRef = this.dialog.open(AddGateActivityComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        departments: this.departments,
        priorities: this.priorities,
        responsibilities: this.responsibilities,
        activity: {
          jobCode: 'JB-' + (100 + this.activities.length + 1),
          responsibility: this.memberName || this.responsibilities[0]
        }
      }
    });

    dialogRef.afterClosed().subscribe((res: Partial<GateActivityItem>) => {
      if (res && res.activityName) {
        const newAct: GateActivityItem = {
          id: Date.now(),
          activityCode: res.activityCode || ('ACT-' + String(this.activities.length + 1).padStart(3, '0')),
          activityName: res.activityName || '',
          jobCode: res.jobCode || ('JB-' + (100 + this.activities.length + 1)),
          department: res.department || this.departments[0],
          section: res.section || 'Formulation Development',
          responsibility: res.responsibility || this.responsibilities[0],
          priority: res.priority || 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '3/5',
          tasks: '0/13',
          activitiesCount: '0/9',
          planStart: res.planStart || '',
          planEnd: res.planEnd || '',
          actualStart: res.actualStart || '',
          actualEnd: res.actualEnd || '',
          eta: res.eta || '',
          planDuration: res.planDuration || '',
          planEffort: res.planEffort || '',
          actualDuration: res.actualDuration || '',
          actualEffort: res.actualEffort || '',
          buffer: res.buffer || '',
          slack: res.slack || '—',
          remarks: res.remarks || '',
          description: res.description || '',
          historyCount: 1,
          documentsCount: 0,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedBy: res.responsibility || 'Dr. Sarah Jenkins'
        };
        this.activities.unshift(newAct);
        this.applyFilter();
      }
    });
  }

  openEditActivity(activity: GateActivityItem, index: number): void {
    const actualIndex = this.activities.findIndex(a => a === activity);
    const targetIdx = actualIndex >= 0 ? actualIndex : index;

    const dialogRef = this.dialog.open(AddGateActivityComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        departments: this.departments,
        priorities: this.priorities,
        responsibilities: this.responsibilities,
        activity
      }
    });

    dialogRef.afterClosed().subscribe((res: Partial<GateActivityItem>) => {
      if (res && res.activityName) {
        this.activities[targetIdx] = {
          ...this.activities[targetIdx],
          ...res,
          updatedDate: new Date().toISOString().split('T')[0]
        };
        this.applyFilter();
      }
    });
  }

  onTasksClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        activityName: item.activityName,
        jobCode: item.jobCode,
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.tasks,
        source: 'debate'
      }
    });
  }

  onRequirementsClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        activityName: item.activityName,
        jobCode: item.jobCode,
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.requirements || item.activitiesCount || item.activities || '0/9',
        role: this.role,
        name: this.memberName,
        source: 'debate'
      }
    });
  }

  onActivitiesClick(item: GateActivityItem): void {
    this.onRequirementsClick(item);
  }

  openHistory(activity: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/gates/debate/activities/history'], {
      queryParams: {
        activityName: activity.activityName,
        jobCode: activity.jobCode,
        department: activity.department,
        responsibility: activity.responsibility,
        delayReason: activity.delayReason,
        priority: activity.priority,
        tasks: activity.tasks,
        requirements: activity.activitiesCount || activity.activities || activity.requirements,
        planDuration: activity.planDuration,
        planEffort: activity.planEffort,
        actualDuration: activity.actualDuration,
        actualEffort: activity.actualEffort,
        remarks: activity.remarks,
        gateName: this.gateName,
        gateCode: this.gateCode,
        projectName: this.projectName,
        projectCode: this.projectCode,
        role: this.role,
        name: this.memberName
      },
      queryParamsHandling: 'merge'
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  isAcceptancePending(acceptance?: string): boolean {
    const val = (acceptance || '3/5').trim();
    const parts = val.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0], 10);
      const den = parseInt(parts[1], 10);
      if (!isNaN(num) && !isNaN(den) && den > 0) {
        return num < den;
      }
    }
    return false;
  }

  openAcceptancePop(activity?: GateActivityItem): void {
    const dialogRef = this.dialog.open(AcceptancePopComponent, {
      width: '800px',
      minWidth: '650px',
      maxWidth: '95vw',
      data: {
        title: 'Acceptance — ' + (activity?.activityName || 'Activity'),
        acceptance: activity?.acceptance,
        activity
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && activity && typeof res.acceptedCount === 'number') {
        activity.acceptance = `${res.acceptedCount}/${res.totalCount}`;
      }
    });
  }
}
