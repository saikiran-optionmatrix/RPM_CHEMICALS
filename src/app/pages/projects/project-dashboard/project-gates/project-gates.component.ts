import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { ChecklistPopComponent, ChecklistItem } from './checklist-pop/checklist-pop.component';
import { ProjectGatesWorkflowComponent, GateWorkflowSignee } from './project-gates-workflow/project-gates-workflow.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { ReviewDateDialogComponent } from './review-date-dialog/review-date-dialog.component';

export interface GateItem {
  id?: number;
  gateCode: string;
  gateName: string;
  status: 'Approved' | 'Pending' | 'On Hold' | 'Rejected' | 'Redirect pending' | 'Redirect';
  remarks: string;
  reviewDate?: string;
  checklistCount: number;
  activitiesCount?: number | string;
  debateCount?: number | string;
  workflow?: string;
  signees?: GateWorkflowSignee[];
  checklistItems?: ChecklistItem[];
  updatedDate?: string;
  updatedBy?: string;
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
  decision: 'Go' | 'Conditional Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect' | null;
  redirectToGate?: string;
  redirectToStage?: string;
  isReadonly?: boolean;
  historyCount?: number;
  documentsCount?: number;
}

@Component({
  selector: 'app-project-gates',
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
  templateUrl: './project-gates.component.html',
  styleUrl: './project-gates.component.scss',
})
export class ProjectGatesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  readonly projectName = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

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

  redirectGateOptions: string[] = [
  "Gate 1 - Business case and project charter approval",
  "Gate 2 - Process route selection and basis of design approval",
  "Gate 3 - Registration and pilot plant readiness approval",
  "Gate 4 - Demo-scale proof and commercial plant design approval",
  "Gate 5 - Commercial production readiness approval"
];

  redirectStageOptions: string[] = [
  "S1 - Opportunity Identification",
  "S2 - Concept Screening & Feasibility",
  "S3 - Route Scouting & Lab Synthesis",
  "S4 - Process Optimization (Lab Scale)",
  "S5 - Process Route Selection & Basis of Design",
  "S6 - Bench-to-Pilot Process Development",
  "S7 - Process Safety & Regulatory Studies",
  "S8 - Regulatory Registration Filing (REACH / TSCA)",
  "S9 - Pilot Plant Campaign",
  "S10 - Demonstration-Scale Campaign",
  "S11 - Commercial Plant Build & Commissioning",
  "S12 - Commercial Launch & Ramp-Up"
];

  gates: GateItem[] = [
  {
    "gateCode": "Gate 1",
    "gateName": "Business case and project charter approval",
    "status": "Approved",
    "remarks": "Business case and project charter approved",
    "checklistCount": 7,
    "activitiesCount": "7",
    "debateCount": "5/5",
    "workflow": "5/5",
    "updatedDate": "2026-01-25",
    "timelineDate": "2026-01-25",
    "planStart": "2026-01-05",
    "planEnd": "2026-01-25",
    "actualStart": "2026-01-05",
    "actualEnd": "2026-01-25",
    "eta": "2026-01-25",
    "planDuration": "20 days",
    "actualDuration": "20 days",
    "planEffort": "700 hrs",
    "actualEffort": "700 hrs",
    "buffer": "2 days",
    "decision": "Go",
    "documentsCount": 3,
    "historyCount": 5,
    "updatedBy": "Rajesh Kumar"
  },
  {
    "gateCode": "Gate 2",
    "gateName": "Process route selection and basis of design approval",
    "status": "Pending",
    "remarks": "Process Route Selection review pending completion of S5",
    "checklistCount": 6,
    "activitiesCount": "6",
    "debateCount": "2/5",
    "workflow": "2/5",
    "updatedDate": "2026-04-15",
    "timelineDate": "2026-05-22",
    "planStart": "2026-01-26",
    "planEnd": "2026-05-22",
    "actualStart": "2026-01-26",
    "actualEnd": "",
    "eta": "2026-05-22",
    "planDuration": "115 days",
    "actualDuration": "80 days",
    "planEffort": "5700 hrs",
    "actualEffort": "3240 hrs",
    "buffer": "5 days",
    "decision": null,
    "documentsCount": 1,
    "historyCount": 2,
    "updatedBy": "Priya Reddy"
  },
  {
    "gateCode": "Gate 3",
    "gateName": "Registration and pilot plant readiness approval",
    "status": "Pending",
    "remarks": "Registration & Pilot Readiness review",
    "checklistCount": 6,
    "activitiesCount": "6",
    "debateCount": "0/5",
    "workflow": "0/5",
    "updatedDate": "-",
    "timelineDate": "2026-08-25",
    "planStart": "2026-05-23",
    "planEnd": "2026-08-25",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-08-25",
    "planDuration": "95 days",
    "actualDuration": "0 days",
    "planEffort": "6700 hrs",
    "actualEffort": "0 hrs",
    "buffer": "4 days",
    "decision": null,
    "documentsCount": 0,
    "historyCount": 0,
    "updatedBy": "-"
  },
  {
    "gateCode": "Gate 4",
    "gateName": "Demo-scale proof and commercial plant design approval",
    "status": "Pending",
    "remarks": "Demo-Scale Proof review",
    "checklistCount": 6,
    "activitiesCount": "6",
    "debateCount": "0/5",
    "workflow": "0/5",
    "updatedDate": "-",
    "timelineDate": "2026-12-28",
    "planStart": "2026-08-26",
    "planEnd": "2026-12-28",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2026-12-28",
    "planDuration": "125 days",
    "actualDuration": "0 days",
    "planEffort": "9100 hrs",
    "actualEffort": "0 hrs",
    "buffer": "4 days",
    "decision": null,
    "documentsCount": 0,
    "historyCount": 0,
    "updatedBy": "-"
  },
  {
    "gateCode": "Gate 5",
    "gateName": "Commercial production readiness approval",
    "status": "Pending",
    "remarks": "Commercial Production Readiness review",
    "checklistCount": 5,
    "activitiesCount": "5",
    "debateCount": "0/5",
    "workflow": "0/5",
    "updatedDate": "-",
    "timelineDate": "2027-05-27",
    "planStart": "2026-12-29",
    "planEnd": "2027-05-27",
    "actualStart": "",
    "actualEnd": "",
    "eta": "2027-05-27",
    "planDuration": "150 days",
    "actualDuration": "0 days",
    "planEffort": "6500 hrs",
    "actualEffort": "0 hrs",
    "buffer": "10 days",
    "decision": null,
    "documentsCount": 0,
    "historyCount": 0,
    "updatedBy": "-"
  }
];

  // Pagination
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
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
    private cdr: ChangeDetectorRef
  ) { }

  readonly historySequence: number[] = [5, 2, 3, 4, 5, 1, 6, 2, 4, 3, 5, 2, 6, 1, 4];
  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.projectCode = params['code'];
      }
      if (params['updatedGate'] && params['reviewDate']) {
        const found = this.gates.find(x => x.gateCode === params['updatedGate']);
        if (found) {
          found.reviewDate = params['reviewDate'];
        }
      }
    });
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    const defaultReviewDates = ['2026-03-01', '2026-07-15', '2026-10-01', '2026-11-20', '2027-01-15', '2027-03-30', '2027-06-15'];
    this.gates.forEach((g, idx) => {
      if (!g.reviewDate) {
        g.reviewDate = defaultReviewDates[idx % defaultReviewDates.length];
      }
      g.historyCount = this.historySequence[idx % this.historySequence.length];
      g.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (!g.updatedBy) {
        g.updatedBy = defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagedGates();
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  // --- Pagination Logic ---
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
    const completed = gate.checklistItems.filter(item => item.done).length;
    const total = gate.checklistItems.length;
    return `${completed}/${total}`;
  }

  getActivitiesFraction(gate: GateItem): string {
    if (!gate) return '0/0';
    if (typeof gate.activitiesCount === 'string') return gate.activitiesCount;
    if (typeof gate.activitiesCount === 'number') {
      return `${Math.max(0, gate.activitiesCount - 1)}/${gate.activitiesCount}`;
    }
    return '6/7';
  }

  getActivitiesCount(gate: GateItem): string {
    return this.getActivitiesFraction(gate);
  }

  navigateToActivities(gate: GateItem): void {
    this.router.navigate(['/projects/dashboard/gates/activities'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || '2026/CHM/006',
        gateCode: gate.gateCode,
        gateName: gate.gateName
      }
    });
  }

  getDebateFraction(gate: GateItem): string {
    if (!gate) return '0/0';
    if (typeof gate.debateCount === 'string') return gate.debateCount;
    if (typeof gate.debateCount === 'number') {
      return `${Math.max(0, gate.debateCount - 1)}/${gate.debateCount}`;
    }
    return '5/6';
  }

  getDebateCount(gate: GateItem): string {
    return this.getDebateFraction(gate);
  }

  openReviewDate(gate: GateItem): void {
    const dialogRef = this.dialog.open(ReviewDateDialogComponent, {
      width: '450px',
      data: {
        title: `Review Date — ${gate.gateCode}`,
        reviewDate: gate.reviewDate || '',
        gateCode: gate.gateCode,
        gateName: gate.gateName
      }
    });

    dialogRef.afterClosed().subscribe((res: { reviewDate: string } | null) => {
      if (res && res.reviewDate) {
        gate.reviewDate = res.reviewDate;
        this.updatePagedGates();
      }
    });
  }

  navigateToDebate(gate: GateItem): void {
    this.router.navigate(['/projects/dashboard/gates/debate'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || '2026/CHM/006',
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        reviewDate: gate.reviewDate || ''
      }
    });
  }

  // --- Decision Checkbox Toggle (Go / Conditional Go / Hold / Kill / Rework / Redirect) ---
  onDecisionChange(gate: GateItem, decisionType: 'Go' | 'Conditional Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect', checked: boolean): void {
    if (checked) {
      gate.decision = decisionType;
      gate.updatedDate = new Date().toISOString().split('T')[0];

      if (decisionType === 'Go' || decisionType === 'Conditional Go') {
        gate.status = 'Approved';
      } else if (decisionType === 'Kill') {
        gate.status = 'Rejected';
      } else if (decisionType === 'Hold') {
        gate.status = 'On Hold';
      } else if (decisionType === 'Rework') {
        gate.status = 'Pending';
      } else if (decisionType === 'Redirect') {
        gate.status = 'Redirect pending';
      }
    } else {
      gate.decision = null;
      gate.status = 'Pending';
      gate.redirectToGate = undefined;
      gate.redirectToStage = undefined;
      gate.updatedDate = new Date().toISOString().split('T')[0];
    }
    this.cdr.detectChanges();
  }

  // --- Timeline Modal Actions ---
  openTimelineModal(item: GateItem): void {
    this.selectedTimelineItem = {
      ...item,
      name: item.gateName
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  // --- Checklist Navigation (Navigates to ChecklistPopComponent inner screen) ---
  navigateToChecklist(gate: GateItem): void {
    this.router.navigate(['/projects/dashboard/gates/checklist'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || '2026/CHM/006',
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        isReadonly: this.isGateReadonly(gate)
      }
    });
  }

  openChecklistModal(gate: GateItem): void {
    this.navigateToChecklist(gate);
  }

  // --- Workflow Modal Actions (Opens ProjectGatesWorkflowComponent Dialog) ---
  openWorkflowModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ProjectGatesWorkflowComponent, {
      width: '820px',
      maxWidth: '95vw',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        workflow: gate.workflow || '3/5',
        signees: gate.signees
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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

  // --- Add / Edit Gate Modal Actions ---
  openAddGate(): void {
    this.gateModalStep = 1;
    const nextNum = String(this.gates.length + 1).padStart(2, '0');
    this.gateModalData = {
      gateCode: 'Gate-' + nextNum,
      gateName: '',
      status: 'Pending',
      remarks: '',
      checklistCount: 0,
      activitiesCount: '0/6',
      debateCount: '0/6',
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
      checklistItems: []
    };
    this.isEditGateMode = false;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  openEditGate(gate: GateItem, index: number): void {
    const actualIndex = this.gates.findIndex(g => g === gate);
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
        ...this.gateModalData
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
        content: 'Are you sure you want to delete this gate record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gates = this.gates.filter(g => g !== gate);
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

  openHistory(gate?: any): void {
    const gateCode = (typeof gate === 'object' && gate !== null) ? gate.gateCode : '';
    const gateName = (typeof gate === 'object' && gate !== null) ? gate.gateName : (typeof gate === 'string' ? gate : 'Gate');

    this.router.navigate(['gates/history'], {
      relativeTo: this.route.parent,
      queryParams: {
        gateCode: gateCode,
        gateName: gateName
      },
      queryParamsHandling: 'merge'
    });
  }

   openFeasibilityReport(): void {
    window.open('/Feasibility%20Report.pdf', '_blank');
  }

  openDocuments(gate?: GateItem): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: gate ? `Gate Documents — ${gate.gateCode}: ${gate.gateName}` : 'Gate Documents'
      }
    });
  }
}
