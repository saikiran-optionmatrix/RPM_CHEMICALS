import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DebateActivitiesComponent, DebateActivityItem } from './debate-activities/debate-activities.component';
import { ReviewDateDialogComponent } from '../review-date-dialog/review-date-dialog.component';

export type DebateDecision = 'Go' | 'Conditional Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect' | null;

export interface DebateMessage {
  id: number;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isSelf?: boolean;
}

export interface GateDebateItem {
  id: number;
  role: string;
  name: string;
  activitiesCount: string;
  checklistCount?: string;
  activitiesList?: DebateActivityItem[];
  decision: DebateDecision;
  messagesCount: number;
  remarks?: string;
  redirectToStage?: string;
}

@Component({
  selector: 'app-project-gates-debate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './project-gates-debate.component.html',
  styleUrl: './project-gates-debate.component.scss',
})
export class ProjectGatesDebateComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  gateCode: string = 'Gate 1';
  gateName: string = 'Concept Approval';

  redirectGateOptions: string[] = [
    'Gate 1 - Business case and project charter approval',
    'Gate 2 - Process route selection and basis of design approval',
    'Gate 3 - Registration and pilot plant readiness approval',
    'Gate 4 - Demo-scale proof and commercial plant design approval',
    'Gate 5 - Commercial production readiness approval'
  ];

  debateSaved: boolean = false;
  reviewDate: string = '2026-11-15';

  debateList: GateDebateItem[] = [
    {
      id: 1,
      role: 'Reviewer',
      name: 'Dr. Sarah Jenkins',
      activitiesCount: '5/12',
      checklistCount: '5/7',
      activitiesList: [
        { id: 1, name: 'Market Demand & Competitive Benchmark Assessment', selected: true },
        { id: 2, name: 'Chemistry & Process Feasibility Assessment', selected: true },
        { id: 3, name: 'Patents & Freedom-to-Operate (FTO) Clearance', selected: true },
        { id: 4, name: 'Process Safety & Scale-Up Risk Assessment', selected: true }
      ],
      decision: 'Go',
      messagesCount: 4,
      redirectToStage: ''
    },
    {
      id: 2,
      role: 'Reviewer',
      name: 'Michael Chang',
      activitiesCount: '7/15',
      checklistCount: '3/7',
      activitiesList: [
        { id: 1, name: 'Yield & Selectivity Profile', selected: true },
        { id: 2, name: 'Process Robustness Proof', selected: true },
        { id: 3, name: 'Impurity & Waste Assessment', selected: true },
        { id: 4, name: 'Preliminary Safety Screening', selected: true }
      ],
      decision: 'Conditional Go',
      messagesCount: 3,
      redirectToStage: ''
    },
    {
      id: 3,
      role: 'Reviewer',
      name: 'Dr. Priya Nair',
      activitiesCount: '5/9',
      checklistCount: '6/7',
      activitiesList: [
        { id: 1, name: 'Analytical Method Validation Review', selected: true },
        { id: 2, name: 'CQA Risk Assessment Matrix Evaluation', selected: true },
        { id: 3, name: 'Process Safety & EHS Audit Verification', selected: true },
        { id: 4, name: 'Raw Material Supplier Qualification', selected: true }
      ],
      decision: 'Go',
      messagesCount: 3,
      redirectToStage: ''
    },
    {
      id: 4,
      role: 'Reviewer',
      name: 'Alex Rivera',
      activitiesCount: '8/12',
      checklistCount: '4/7',
      activitiesList: [
        { id: 1, name: 'EPA TSCA / ECHA REACH Chemical Notification Gap Analysis', selected: true },
        { id: 2, name: 'Pilot Plant Readiness', selected: true },
        { id: 3, name: 'Product Specification & Method Validation', selected: true },
        { id: 4, name: 'REACH / TSCA Dossier & Regulator Advice', selected: true }
      ],
      decision: 'Rework',
      messagesCount: 2,
      redirectToStage: ''
    },
    {
      id: 5,
      role: 'Reviewer',
      name: 'Emily Watson',
      activitiesCount: '6/10',
      checklistCount: '5/7',
      activitiesList: [
        { id: 1, name: 'Pilot Plant Performance Review', selected: true },
        { id: 2, name: 'Demo-Scale Campaign Results', selected: true },
        { id: 3, name: 'Customer Qualification Evidence', selected: true },
        { id: 4, name: 'Process Safety Review Outcome', selected: true }
      ],
      decision: 'Hold',
      messagesCount: 2,
      redirectToStage: ''
    },
    {
      id: 6,
      role: 'Approver',
      name: 'Dr. Satya Prasad',
      activitiesCount: '9/15',
      checklistCount: '7/7',
      activitiesList: [
        { id: 1, name: 'Gate Sign-off & Portfolio Risk Assessment', selected: true },
        { id: 2, name: 'Scientific Dossier Peer Review', selected: true },
        { id: 3, name: 'Commercial Milestones & CAPEX Alignment', selected: true },
        { id: 4, name: 'Pilot Plant to Demo-Scale Gate Transition Plan', selected: true }
      ],
      decision: 'Go',
      messagesCount: 2,
      redirectToStage: ''
    }
  ];

  selectedRecord: GateDebateItem | null = null;
  newMessageText: string = '';

  messagesMap: Record<number, DebateMessage[]> = {
    1: [
      { id: 101, senderName: 'Dr. Sarah Jenkins', senderRole: 'Reviewer', text: 'Initial business case documentation has been submitted for Gate 1 review.', timestamp: '2026-10-15 09:30 AM' },
      { id: 102, senderName: 'Dr. Sarah Jenkins', senderRole: 'Reviewer', text: 'Market sizing and financial NPV assumptions verified with commercial team.', timestamp: '2026-10-15 10:15 AM' },
      { id: 103, senderName: 'Dr. Sarah Jenkins', senderRole: 'Reviewer', text: 'All deliverables on track. Ready for gate sign-off consensus.', timestamp: '2026-10-15 11:45 AM' },
      { id: 104, senderName: 'Dr. Sarah Jenkins', senderRole: 'Reviewer', text: 'Please ensure QA and regulatory sign-offs are completed before EOD.', timestamp: '2026-10-15 02:10 PM' }
    ],
    2: [
      { id: 201, senderName: 'Michael Chang', senderRole: 'Reviewer', text: 'Reaction calorimetry and thermal hazard screening complete for monomer batch #014.', timestamp: '2026-10-14 02:20 PM' },
      { id: 202, senderName: 'Michael Chang', senderRole: 'Reviewer', text: 'Observed slight exotherm overshoot during rapid dosing of catalyst.', timestamp: '2026-10-15 09:40 AM' },
      { id: 203, senderName: 'Michael Chang', senderRole: 'Reviewer', text: 'Recommending Conditional Go pending 14-day accelerated stability readouts.', timestamp: '2026-10-15 11:05 AM' }
    ],
    3: [
      { id: 301, senderName: 'Dr. Priya Nair', senderRole: 'Reviewer', text: 'Protocol qualification and analytical method transfer verified.', timestamp: '2026-10-14 04:50 PM' },
      { id: 302, senderName: 'Dr. Priya Nair', senderRole: 'Reviewer', text: 'No critical Process Safety or EHS deviations noted for current gate evaluation.', timestamp: '2026-10-15 10:00 AM' },
      { id: 303, senderName: 'Dr. Priya Nair', senderRole: 'Reviewer', text: 'Quality Assurance is voting Go with full consensus.', timestamp: '2026-10-15 12:30 PM' }
    ],
    4: [
      { id: 401, senderName: 'Alex Rivera', senderRole: 'Reviewer', text: 'REACH registration technical dossier requires minor revision on aquatic ecotox endpoints.', timestamp: '2026-10-14 11:15 AM' },
      { id: 402, senderName: 'Alex Rivera', senderRole: 'Reviewer', text: 'Requesting rework on PFD mass balance section before formal gate freeze.', timestamp: '2026-10-15 01:25 PM' }
    ],
    5: [
      { id: 501, senderName: 'Emily Watson', senderRole: 'Reviewer', text: 'Primary vendor monomer COA pending secondary warehouse assay confirmation.', timestamp: '2026-10-14 03:00 PM' },
      { id: 502, senderName: 'Emily Watson', senderRole: 'Reviewer', text: 'Holding shipment release until secondary assay confirmation.', timestamp: '2026-10-15 10:45 AM' }
    ],
    6: [
      { id: 601, senderName: 'Dr. Satya Prasad', senderRole: 'Approver', text: 'Reviewed cross-functional risk matrices. High scientific confidence in trial batches.', timestamp: '2026-10-15 11:20 AM' },
      { id: 602, senderName: 'Dr. Satya Prasad', senderRole: 'Approver', text: 'Proceeding with Go recommendation for Gate 1 transition.', timestamp: '2026-10-15 03:15 PM' }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
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
      if (params['reviewDate']) {
        this.reviewDate = params['reviewDate'];
      }
      this.updateChecklistCountsForGate();
    });

    if (this.debateList.length > 0) {
      this.selectedRecord = this.debateList[0];
    }
    this.updateChecklistCountsForGate();
  }

  // Gate checklist total counts matching GateCriteriaComponent / ChecklistPopComponent
  readonly gateChecklistTotals: Record<string, number> = {
    'Gate 1': 7,
    'Gate 2': 6,
    'Gate 3': 6,
    'Gate 4': 6,
    'Gate 5': 5
  };

  getGateChecklistTotal(gateCode?: string): number {
    const code = (gateCode || this.gateCode || 'Gate 1').trim();
    if (this.gateChecklistTotals[code]) {
      return this.gateChecklistTotals[code];
    }
    const normalized = code.toLowerCase();
    if (normalized.includes('gate 1') || normalized.includes('gate-1') || normalized.includes('feasibility')) return 8;
    if (normalized.includes('gate 2') || normalized.includes('gate-2') || normalized.includes('formulation') || normalized.includes('initiation')) return 10;
    if (normalized.includes('gate 3') || normalized.includes('gate-3') || normalized.includes('development') || normalized.includes('prototype')) return 10;
    if (normalized.includes('gate 4') || normalized.includes('gate-4') || normalized.includes('testing') || normalized.includes('scale-up')) return 10;
    if (normalized.includes('gate 5') || normalized.includes('gate-5') || normalized.includes('validation')) return 6;
    if (normalized.includes('gate 6') || normalized.includes('gate-6') || normalized.includes('ttd') || normalized.includes('execution')) return 10;
    if (normalized.includes('gate 7') || normalized.includes('gate-7') || normalized.includes('dossier') || normalized.includes('filing') || normalized.includes('pivotal')) return 9;

    const match = normalized.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num === 1) return 7;
      if (num === 2) return 6;
      if (num === 3) return 6;
      if (num === 4) return 6;
      if (num === 5) return 5;
    }

    return 7;
  }

  updateChecklistCountsForGate(): void {
    const total = this.getGateChecklistTotal(this.gateCode);
    const ratios = [0.75, 0.5, 0.88, 0.62, 0.75, 1.0];

    this.debateList.forEach((row, idx) => {
      if (idx === this.debateList.length - 1 || row.role === 'Approver') {
        row.checklistCount = `${total}/${total}`;
      } else {
        const ratio = ratios[idx % ratios.length];
        const num = Math.min(total - 1, Math.max(1, Math.round(ratio * total)));
        row.checklistCount = `${num}/${total}`;
      }
    });
  }

  getChecklistCount(row: GateDebateItem): string {
    const total = this.getGateChecklistTotal(this.gateCode);
    if (!row.checklistCount) {
      return `${Math.max(1, total - 2)}/${total}`;
    }
    const parts = row.checklistCount.split('/');
    if (parts.length === 2) {
      const origNum = parseInt(parts[0].trim(), 10);
      const origDenom = parseInt(parts[1].trim(), 10);
      if (!isNaN(origNum) && origDenom === total) {
        return row.checklistCount;
      }
      if (!isNaN(origNum)) {
        if (row.role === 'Approver' || (origDenom > 0 && origNum >= origDenom)) {
          return `${total}/${total}`;
        }
        const ratio = (origDenom > 0) ? (origNum / origDenom) : 0.75;
        const num = Math.min(total - 1, Math.max(1, Math.round(ratio * total)));
        return `${num}/${total}`;
      }
    }
    return `${row.checklistCount}`;
  }

  get currentMessages(): DebateMessage[] {
    if (!this.selectedRecord) return [];
    return this.messagesMap[this.selectedRecord.id] || [];
  }

  openReviewDateDialog(): void {
    const dialogRef = this.dialog.open(ReviewDateDialogComponent, {
      width: '450px',
      data: {
        title: 'Review Date',
        reviewDate: this.reviewDate || '',
        gateCode: this.gateCode,
        gateName: this.gateName
      }
    });

    dialogRef.afterClosed().subscribe((res: { reviewDate: string } | null) => {
      if (res && res.reviewDate) {
        this.reviewDate = res.reviewDate;
      }
    });
  }

  onDecisionClick(row: GateDebateItem, decision: 'Conditional Go' | 'Hold' | 'Rework'): void {
    if (row.decision === decision) {
      row.decision = null;
      row.redirectToStage = '';
      return;
    }

    const dialogRef = this.dialog.open(ReviewDateDialogComponent, {
      width: '450px',
      data: {
        title: `Set Review Date (${decision})`,
        decision: decision,
        reviewDate: this.reviewDate || '',
        gateCode: this.gateCode,
        gateName: this.gateName
      }
    });

    dialogRef.afterClosed().subscribe((res: { reviewDate: string; decision: string } | null) => {
      if (res && res.reviewDate) {
        row.decision = decision;
        row.redirectToStage = '';
        this.reviewDate = res.reviewDate;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/gates'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode,
        updatedGate: this.gateCode,
        reviewDate: this.reviewDate
      }
    });
  }

  openActivities(row: GateDebateItem): void {
    this.router.navigate(['/projects/dashboard/gates/debate/activities'], {
      queryParams: {
        role: row.role,
        name: row.name,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        source: 'debate',
        rowId: row.id,
        activitiesCount: row.activitiesCount
      }
    });
  }

  openChecklist(row: GateDebateItem): void {
    this.router.navigate(['/projects/dashboard/gates/checklist'], {
      queryParams: {
        role: row.role,
        name: row.name,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        source: 'debate'
      }
    });
  }

  onDecisionChange(item: GateDebateItem, decision: DebateDecision): void {
    if (item.decision === decision) {
      item.decision = null;
      item.redirectToStage = '';
    } else {
      item.decision = decision;
      if (decision !== 'Redirect') {
        item.redirectToStage = '';
      }
    }
  }

  selectRecordForMessages(item: GateDebateItem): void {
    this.selectedRecord = item;
    setTimeout(() => {
      const el = document.getElementById('debate-messages-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  sendMessage(): void {
    if (!this.newMessageText.trim() || !this.selectedRecord) return;
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newMsg: DebateMessage = {
      id: Date.now(),
      senderName: 'Current User',
      senderRole: 'Debate Reviewer',
      text: this.newMessageText.trim(),
      timestamp: timeStr,
      isSelf: true
    };

    if (!this.messagesMap[this.selectedRecord.id]) {
      this.messagesMap[this.selectedRecord.id] = [];
    }
    this.messagesMap[this.selectedRecord.id].push(newMsg);
    this.selectedRecord.messagesCount = this.messagesMap[this.selectedRecord.id].length;
    this.newMessageText = '';
  }

  saveDebate(): void {
    this.debateSaved = true;
    setTimeout(() => {
      this.debateSaved = false;
    }, 2500);
  }
}
