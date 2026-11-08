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
    'Specialty Chemical Process Development Program';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/CHM/001';

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
    'S1 - Opportunity Identification',
    'S2 - Concept Screening & Feasibility',
    'S3 - Route Scouting & Lab Synthesis',
    'S4 - Process Optimization (Lab Scale)',
    'S5 - Process Route Selection & Basis of Design',
    'S6 - Bench-to-Pilot Process Development',
    'S7 - Process Safety & Regulatory Studies',
    'S8 - Regulatory Registration Filing (REACH / TSCA)',
    'S9 - Pilot Plant Campaign',
    'S10 - Demonstration-Scale Campaign',
    'S11 - Commercial Plant Build & Commissioning',
    'S12 - Commercial Launch & Ramp-Up',
  ];

  gates: GateItem[] = [
    {
      gateCode: 'Gate 1',
      gateName: 'Concept Approval',
      status: 'Approved',
      remarks: 'Business case and project charter approved',
      checklistCount: 7,
      activitiesCount: 7,
      workflow: '5/5',
      decision: 'Go',
      updatedDate: '12-Mar-2026',
      timelineDate: '2026-03-12',
      planStart: '2026-01-05',
      planEnd: '2026-03-12',
      checklistItems: [
        { id: 1, text: 'Competitor grade and market assessment complete', mandatory: true, done: true },
        { id: 2, text: 'Patent and FTO review', mandatory: true, done: true },
        { id: 3, text: 'Regulatory region shortlist', mandatory: true, done: true },
        { id: 4, text: 'Business case and NPV approved', mandatory: true, done: true },
        { id: 5, text: 'Budget and resource plan', mandatory: true, done: true },
        { id: 6, text: 'Risk register baselined', mandatory: false, done: true },
        { id: 7, text: 'Project charter signed', mandatory: true, done: true }
      ]
    },
    {
      gateCode: 'Gate 2',
      gateName: 'Process Route Selection',
      status: 'Pending',
      remarks: 'Process Route Selection review pending completion of S5',
      checklistCount: 4,
      activitiesCount: 6,
      workflow: '2/5',
      decision: null,
      updatedDate: '05-Oct-2026',
      timelineDate: '2026-08-15',
      planStart: '2026-03-01',
      planEnd: '2026-08-15',
      checklistItems: [
        { id: 1, text: 'Reaction yield and selectivity data', mandatory: true, done: true },
        { id: 2, text: 'Candidate route conversion and impurity profile', mandatory: true, done: true },
        { id: 3, text: 'Preliminary benchmark equivalence data', mandatory: true, done: true },
        { id: 4, text: 'Raw material and catalyst supply plan', mandatory: true, done: true },
        { id: 5, text: 'Basis of Design and cost update', mandatory: false, done: false },
        { id: 6, text: 'Route selection review', mandatory: true, done: false }
      ]
    },
    {
      gateCode: 'Gate 3',
      gateName: 'Registration & Pilot Readiness',
      status: 'Pending',
      remarks: 'Registration & Pilot Readiness review',
      checklistCount: 0,
      activitiesCount: 8,
      workflow: '0/5',
      decision: null,
      updatedDate: '-',
      timelineDate: '2026-09-30',
      planStart: '2026-08-11',
      planEnd: '2026-09-30',
      checklistItems: [
        { id: 1, text: 'Process locked (reaction and separation)', mandatory: true, done: false },
        { id: 2, text: 'Equivalence package complete', mandatory: true, done: false },
        { id: 3, text: 'Analytical methods validated', mandatory: true, done: false },
        { id: 4, text: 'Technical grade and finished product validated', mandatory: true, done: false },
        { id: 5, text: 'Storage stability data', mandatory: true, done: false },
        { id: 6, text: 'Hazard study (HAZOP / LOPA) complete', mandatory: true, done: false },
        { id: 7, text: 'Tech transfer readiness', mandatory: true, done: false },
        { id: 8, text: 'QA and EHS review', mandatory: true, done: false }
      ]
    },
    {
      gateCode: 'Gate 4',
      gateName: 'Demo-Scale Proof',
      status: 'Pending',
      remarks: 'Demo-Scale Proof review',
      checklistCount: 0,
      activitiesCount: 7,
      workflow: '0/5',
      decision: null,
      updatedDate: '-',
      timelineDate: '2027-02-20',
      planStart: '2026-12-21',
      planEnd: '2027-02-20',
      checklistItems: [
        { id: 1, text: 'Toxicology and ecotoxicology package', mandatory: true, done: false },
        { id: 2, text: 'Pilot batch released', mandatory: true, done: false },
        { id: 3, text: 'Customer trial protocol finalized', mandatory: false, done: false },
        { id: 4, text: 'Toll manufacturer and site qualification', mandatory: true, done: false },
        { id: 5, text: 'REACH / TSCA dossier ready', mandatory: true, done: false },
        { id: 6, text: 'Regulator advice incorporated', mandatory: false, done: false },
        { id: 7, text: 'Process safety plan approved', mandatory: true, done: false }
      ]
    },
    {
      gateCode: 'Gate 5',
      gateName: 'Commercial Production Readiness',
      status: 'Pending',
      remarks: 'Commercial Production Readiness review',
      checklistCount: 0,
      activitiesCount: 9,
      workflow: '0/5',
      decision: null,
      updatedDate: '-',
      timelineDate: '2027-06-30',
      planStart: '2027-02-21',
      planEnd: '2027-06-30',
      checklistItems: [
        { id: 1, text: 'Demonstration campaign report', mandatory: true, done: false },
        { id: 2, text: 'Statistical and capability analysis', mandatory: true, done: false },
        { id: 3, text: 'Plant design package complete', mandatory: true, done: false },
        { id: 4, text: 'Commissioning and validation data', mandatory: true, done: false },
        { id: 5, text: 'Storage stability data', mandatory: true, done: false },
        { id: 6, text: 'Labeling (GHS / CLP) and SDS', mandatory: true, done: false },
        { id: 7, text: 'Emergency response plan', mandatory: true, done: false },
        { id: 8, text: 'Registration status review', mandatory: true, done: false },
        { id: 9, text: 'Final approval to start production', mandatory: true, done: false }
      ]
    }
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
        code: this.projectCode || '2026/GEN/001',
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
      width: '600px',
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
      width: '650px',
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
