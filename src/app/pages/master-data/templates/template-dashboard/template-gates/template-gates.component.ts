import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { ChecklistPopComponent, ChecklistItem } from '../../../../projects/project-dashboard/project-gates/checklist-pop/checklist-pop.component';
import { ProjectGatesWorkflowComponent, GateWorkflowSignee } from '../../../../projects/project-dashboard/project-gates/project-gates-workflow/project-gates-workflow.component';

export interface GateItem {
  id?: number;
  gateCode: string;
  gateName: string;
  status: 'Approved' | 'Pending' | 'On Hold' | 'Rejected' | 'Redirect pending' | 'Redirect';
  remarks: string;
  checklistCount: number;
  activitiesCount?: number;
  workflow?: string;
  signees?: GateWorkflowSignee[];
  checklistItems?: ChecklistItem[];
  updatedDate?: string;
  timelineDate: string;
  planStart: string;
  planEnd: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  actualDuration?: string;
  planEffort?: string;
  actualEffort?: string;
  buffer?: string;
  description?: string;
  decision: 'Go' | 'Kill' | 'Hold' | 'Redirect' | null;
  redirectToStage?: string;
  isReadonly?: boolean;
}

@Component({
  selector: 'app-template-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './template-gates.component.html',
  styleUrl: './template-gates.component.scss',
})
export class TemplateGatesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/CHM/006';

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

  redirectStageOptions: string[] = [
    'S1 - Business Case',
    'S2 - Product / Project In Initiation',
    'S3 - Procurement of API, RM & Packaging materials - For Developmental studies.',
    'S4 - Formulation Development Phase 1: POC completion',
    'S5 - Procurement of API, Raw materials & Packaging materials - For Ebs',
    'S6 - Formulation Development Phase 2: Pilot Bio',
    'S7 - API Method Validation / verification',
    'S8 - FP method validation, FP specifications & STP',
    'S9 - TTD Submission',
    'S10 - Exhibit / Submission Batches execution',
    'S11 - Demonstration-Scale Campaign studies',
    'S12 - Dossier preparation and filing',
  ];

  gates: GateItem[] = [
    {
      gateCode: 'Gate 1',
      gateName: 'Business Case',
      status: 'Approved',
      remarks: 'Scope and business case approved',
      checklistCount: 7,
      activitiesCount: 7,
      workflow: '3/5',
      updatedDate: '2026-02-15',
      timelineDate: '2026-02-15',
      planStart: '2026-01-05',
      planEnd: '2026-02-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-02-14',
      eta: '2026-02-15',
      planDuration: '20 days',
      actualDuration: '20 days',
      planEffort: '140 hrs',
      actualEffort: '140 hrs',
      buffer: '2 days',
      description: 'Business Case (Business Case)',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Formal Freedom-to-Operate (FTO) Opinion', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'API Source & Vendor Qualification', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Reference Listed Drug (RLD) Characterization', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Target Product Profile (TPP) Documentation', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'Formulation Complexity Risk Rating', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Cost of Goods Sold (COGS) Feasibility', done: true, mandatory: false, priority: 'Medium' },
        { id: 7, text: 'Regulatory Submission Pathway Confirmation', done: true, mandatory: true, priority: 'High' },
      ],
    },
    {
      gateCode: 'Gate 2',
      gateName: 'Feasibility',
      status: 'Approved',
      remarks: 'Formulation feasibility established',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '4/5',
      updatedDate: '2026-06-30',
      timelineDate: '2026-06-30',
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
      description: 'Feasibility of Formulation Development (Feasibility)',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Prototype Batches Manufacturing', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Comparative Dissolution Profile (f2 ≥ 50)', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Critical Quality Attributes (CQAs) Target Ranges', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Excipient Compatibility Study Completion', done: true, mandatory: false, priority: 'High' },
        { id: 5, text: 'Manufacturing Unit Operations Mapping', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Preliminary Impurity Profile Evaluation', done: true, mandatory: true, priority: 'High' },
      ],
    },
    {
      gateCode: 'Gate 3',
      gateName: 'Lab Stability',
      status: 'Pending',
      remarks: 'Lab stability 3M under review',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '1/5',
      updatedDate: '2026-09-15',
      timelineDate: '2026-09-15',
      planStart: '2026-07-01',
      planEnd: '2026-09-15',
      actualStart: '2026-07-01',
      actualEnd: '',
      eta: '2026-09-15',
      planDuration: '150 days',
      actualDuration: '140 days',
      planEffort: '370 hrs',
      actualEffort: '350 hrs',
      buffer: '4 days',
      description: 'Review of Stability Data (Lab Stability)',
      decision: null,
      isReadonly: true,
      checklistItems: [
        { id: 1, text: 'Analytical Methods Validation (ICH Q2)', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Forced Degradation & Stability-Indicating Study', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Accelerated Stability Data (3 Months 40°C/75% RH)', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Long-Term Stability Protocol Initiation', done: true, mandatory: false, priority: 'High' },
        { id: 5, text: 'Container-Closure System Finalization', done: false, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Exhibit Batch Manufacturing Record (BMR) Draft', done: false, mandatory: true, priority: 'High' },
      ],
    },
    {
      gateCode: 'Gate 4',
      gateName: 'EB Stability',
      status: 'Pending',
      remarks: 'Exhibit batches executed, 6M stability ongoing',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '2/5',
      updatedDate: '2026-11-30',
      timelineDate: '2026-11-30',
      planStart: '2026-09-16',
      planEnd: '2026-11-30',
      actualStart: '',
      actualEnd: '',
      eta: '2026-11-30',
      planDuration: '260 days',
      actualDuration: '120 days',
      planEffort: '440 hrs',
      actualEffort: '200 hrs',
      buffer: '6 days',
      description: '6 Months Exhibit Batch Stability Data Review (EB Stability)',
      decision: null,
      isReadonly: true,
      checklistItems: [
        { id: 1, text: 'Exhibit/Registration Batch Scale Manufacturing', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Exhibit Batch Release Specifications Compliance', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Pilot Bioequivalence (BE) Study Trend', done: true, mandatory: false, priority: 'Medium' },
        { id: 4, text: 'Pivotal Bioequivalence (BE) Study Success', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'CMC Quality Data Package Consistency', done: false, mandatory: true, priority: 'High' },
        { id: 6, text: 'Bioanalytical Method Regulatory Validation', done: false, mandatory: false, priority: 'High' },
      ],
    },
    {
      gateCode: 'Gate 5',
      gateName: 'Regulatory Approval',
      status: 'Pending',
      remarks: 'Dossier preparation in progress',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '5/5',
      updatedDate: '2026-12-31',
      timelineDate: '2026-12-31',
      planStart: '2026-12-01',
      planEnd: '2026-12-31',
      actualStart: '',
      actualEnd: '',
      eta: '2026-12-31',
      planDuration: '192 days',
      actualDuration: '0 days',
      planEffort: '310 hrs',
      actualEffort: '0 hrs',
      buffer: '5 days',
      description: 'Approval / Rejection / Hold (Regulatory Approval)',
      decision: null,
      isReadonly: true,
      checklistItems: [
        { id: 1, text: 'Full CTD/eCTD Dossier Compilation (Modules 1-5)', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'Internal QA Dossier Gap Assessment', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'DMF Reference & Letter of Authorization (LoA)', done: false, mandatory: false, priority: 'High' },
        { id: 4, text: 'Product Labeling & Packaging Alignment', done: false, mandatory: false, priority: 'High' },
        { id: 5, text: 'Manufacturing Facility cGMP Inspection Readiness', done: false, mandatory: true, priority: 'High' },
      ],
    },
  ];

  // Pagination
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 0;
  pagedGatesList: GateItem[] = [];

  // Timeline Modal Popup State
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Gate Modal State
  showGateModal = false;
  gateModalStep = 1;
  isEditGateMode = false;
  gateModalData: Partial<GateItem> = {};
  gateModalIndex = -1;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    this.updatePagedGates();
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  // Pagination Logic
  updatePagedGates(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedGatesList = this.gates.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedGates();
  }

  get pagedGates(): GateItem[] {
    return this.pagedGatesList;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.gates.length / this.pageSize));
  }

  isGateZero(gate: GateItem): boolean {
    if (!gate) return false;
    return (
      (gate.gateName && gate.gateName.toLowerCase().includes('gate 0')) ||
      gate.gateCode === 'Gate 0' ||
      gate.gateCode === 'GT000'
    );
  }

  isGateReadonly(gate: GateItem): boolean {
    if (!gate) return false;
    if (gate.isReadonly !== undefined) return gate.isReadonly;
    return gate.gateCode === 'Gate 3' || gate.gateCode === 'Gate 4' || gate.gateCode === 'Gate 5';
  }

  getChecklistFraction(gate: GateItem): string {
    if (!gate) return '0/0';
    if (!gate.checklistItems || gate.checklistItems.length === 0) {
      return gate.checklistCount ? `${gate.checklistCount}/${gate.checklistCount}` : '0/0';
    }
    const completed = gate.checklistItems.filter((item) => item.done).length;
    const total = gate.checklistItems.length;
    return `${completed}/${total}`;
  }

  getActivitiesCount(gate: GateItem): number {
    if (!gate) return 0;
    if (gate.activitiesCount !== undefined) return gate.activitiesCount;
    if (gate.checklistItems && gate.checklistItems.length > 0) return gate.checklistItems.length;
    return gate.checklistCount || 6;
  }

  navigateToActivities(gate: GateItem): void {
    this.router.navigate(['gates/activities'], {
      relativeTo: this.route.parent,
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || '2026/CHM/006',
        gateCode: gate.gateCode,
        gateName: gate.gateName,
      },
      queryParamsHandling: 'merge',
    });
  }

  // Decision Checkbox Toggle (Go / Kill / Hold / Redirect)
  onDecisionChange(gate: GateItem, decisionType: 'Go' | 'Kill' | 'Hold' | 'Redirect', checked: boolean): void {
    if (checked) {
      gate.decision = decisionType;
      gate.updatedDate = new Date().toISOString().split('T')[0];

      if (decisionType === 'Go') {
        gate.status = 'Approved';
      } else if (decisionType === 'Kill') {
        gate.status = 'Rejected';
      } else if (decisionType === 'Hold') {
        gate.status = 'On Hold';
      } else if (decisionType === 'Redirect') {
        gate.status = 'Redirect pending';
      }
    } else {
      gate.decision = null;
      gate.status = 'Pending';
      gate.redirectToStage = undefined;
      gate.updatedDate = new Date().toISOString().split('T')[0];
    }
    this.cdr.detectChanges();
  }

  // Timeline Modal Actions
  openTimelineModal(item: GateItem): void {
    this.selectedTimelineItem = {
      ...item,
      name: item.gateName,
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  // Checklist Modal Actions (Opens ChecklistPopComponent Dialog)
  openChecklistModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ChecklistPopComponent, {
      width: '680px',
      maxWidth: '95vw',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        checklistItems: gate.checklistItems || [],
        isReadonly: this.isGateReadonly(gate),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.checklistItems) {
        gate.checklistItems = result.checklistItems;
        gate.checklistCount = result.checklistItems.length;
        this.cdr.detectChanges();
      }
    });
  }

  // Workflow Modal Actions (Opens ProjectGatesWorkflowComponent Dialog)
  openWorkflowModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ProjectGatesWorkflowComponent, {
      width: '820px',
      maxWidth: '95vw',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        workflow: gate.workflow || '3/5',
        signees: gate.signees,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.workflow) {
          gate.workflow = result.workflow;
        }
        if (result.signees) {
          gate.signees = result.signees;
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Add / Edit Gate Modal Actions
  openAddGate(): void {
    this.gateModalStep = 1;
    const nextNum = String(this.gates.length + 1).padStart(2, '0');
    this.gateModalData = {
      gateCode: 'Gate-' + nextNum,
      gateName: '',
      status: 'Pending',
      remarks: '',
      checklistCount: 0,
      workflow: '0/5',
      updatedDate: new Date().toISOString().split('T')[0],
      timelineDate: '',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      planDuration: '',
      actualDuration: '',
      planEffort: '',
      actualEffort: '',
      buffer: '',
      description: '',
      decision: null,
      checklistItems: [],
    };
    this.isEditGateMode = false;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  openEditGate(gate: GateItem, index: number): void {
    const actualIndex = this.gates.findIndex((g) => g === gate);
    this.gateModalStep = 1;
    this.gateModalData = { ...gate };
    this.isEditGateMode = true;
    this.gateModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  closeGateModal(): void {
    this.showGateModal = false;
    this.setBodyScrollLock(false);
  }

  saveGate(): void {
    if (!this.gateModalData.gateName || !this.gateModalData.gateCode) return;

    if (this.isEditGateMode && this.gateModalIndex > -1) {
      this.gates[this.gateModalIndex] = {
        ...this.gates[this.gateModalIndex],
        ...this.gateModalData,
      } as GateItem;
    } else {
      this.gates.push(this.gateModalData as GateItem);
    }
    this.updatePagedGates();
    this.closeGateModal();
  }

  deleteGate(gate: GateItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this gate record?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gates = this.gates.filter((g) => g !== gate);
        if (this.currentPage >= this.pageCount) {
          this.currentPage = Math.max(0, this.pageCount - 1);
        }
        this.updatePagedGates();
      }
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }
}
