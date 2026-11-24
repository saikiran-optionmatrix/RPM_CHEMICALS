import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { AddIssueComponent } from './add-issue/add-issue.component';
import { IssueTimelineComponent } from './issue-timeline/issue-timeline.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';

export type Status = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface Card {
  id: number;
  subject: string;
  LawFirm: string;
  createdBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  expedite: boolean;
  notes: { text: string; author: string; date: string }[];
  expanded: boolean;
  status: Status;
}

export interface IssueItem {
  id: number;
  stage?: string;
  deliverable?: string;
  activity?: string;
  task?: string;
  taskName?: string;
  subject: string;
  issueDescription: string;
  createdDate: string | null;
  dueDate?: string | null;
  targetDate?: string | null;
  resolvedDate: string | null;
  resolved: boolean;
  done?: boolean;
  approved?: boolean;
  remarks: string;
  status: string;
  image?: string | null;
  document?: string | null;
  assignedTo?: string;
  responsibility?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string | null;
  updatedBy?: string | null;
}

@Component({
  selector: 'app-project-issues',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule
  ],
  templateUrl: './project-issues.component.html',
  styleUrl: './project-issues.component.scss'
})
export class ProjectIssuesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  filterToggle: boolean = false;
  totalSize = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  myGroup!: FormGroup;

  isKanbanView: boolean = false;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  // Sample data for Project Issues
  originalTableList: IssueItem[] = [
  {
    "id": 1,
    "stage": "S1 - Opportunity Identification",
    "deliverable": "Competitor Grade & Market Analysis",
    "activity": "Competitor grade and price benchmarking",
    "task": "Competitor grade and price benchmarking",
    "subject": "Competitor grade price gap",
    "issueDescription": "Benchmarking of competing acrylic binders shows landed prices 8% below our target cost of manufacturing.",
    "createdDate": "2026-01-08",
    "dueDate": "2026-01-15",
    "targetDate": "2026-01-15",
    "resolvedDate": "2026-01-14",
    "resolved": true,
    "done": true,
    "remarks": "Re-evaluated bulk monomer purchasing agreements and revised cost model.",
    "status": "Completed",
    "assignedTo": "Rajesh Kumar",
    "responsibility": "Rajesh Kumar"
  },
  {
    "id": 2,
    "stage": "S1 - Opportunity Identification",
    "deliverable": "Competitor Grade & Market Analysis",
    "activity": "Customer application and specification research",
    "task": "Customer application and specification research",
    "subject": "Low-VOC and odour requirement",
    "issueDescription": "Formulator feedback highlights low residual monomer (< 50 ppm) and low odour as a critical switching driver.",
    "createdDate": "2026-01-10",
    "dueDate": "2026-01-15",
    "targetDate": "2026-01-15",
    "resolvedDate": "2026-01-15",
    "resolved": true,
    "done": true,
    "remarks": "Added post-polymerization stripping and redox chaser step into recipe scope.",
    "status": "Completed",
    "assignedTo": "Anita Desai",
    "responsibility": "Anita Desai"
  },
  {
    "id": 3,
    "stage": "S1 - Opportunity Identification",
    "deliverable": "Target market and regulatory-region shortlist",
    "activity": "Target market and regulatory-region shortlist",
    "task": "Target market and regulatory-region shortlist",
    "subject": "Chemical registration requirement",
    "issueDescription": "Early regulatory advice indicates EU and India export markets require additional REACH tonnage data on residual monomer.",
    "createdDate": "2026-01-12",
    "dueDate": "2026-01-20",
    "targetDate": "2026-01-20",
    "resolvedDate": "2026-01-19",
    "resolved": true,
    "done": true,
    "remarks": "Included REACH Consortium fee and testing in Stage 8 budget.",
    "status": "Completed",
    "assignedTo": "Dr. Priya Raman",
    "responsibility": "Dr. Priya Raman"
  },
  {
    "id": 4,
    "stage": "S1 - Opportunity Identification",
    "deliverable": "Project economics and risk screening",
    "activity": "Volume and price-band projection",
    "task": "Volume and price-band projection",
    "subject": "Raw material cost overrun",
    "issueDescription": "Butyl acrylate price rise puts the initial cost of manufacturing 9% above the project target.",
    "createdDate": "2026-01-14",
    "dueDate": "2026-01-22",
    "targetDate": "2026-01-22",
    "resolvedDate": "2026-01-22",
    "resolved": true,
    "done": true,
    "remarks": "Formulated flexible MMA/BA monomer ratio window to allow market price balancing.",
    "status": "Completed",
    "assignedTo": "Vikram Singh",
    "responsibility": "Vikram Singh"
  },
  {
    "id": 5,
    "stage": "S4 - Process Optimization (Lab Scale)",
    "deliverable": "Recipe Optimization & Feed Profiles",
    "activity": "Monomer feed profile optimization",
    "task": "Monomer feed profile optimization",
    "subject": "Exotherm control at scale",
    "issueDescription": "Peak reactor temperature exceeds the limit by 6 degrees C at the target feed rate; feed profile needs revision.",
    "createdDate": "2026-03-10",
    "dueDate": "2026-03-25",
    "targetDate": "2026-03-25",
    "resolvedDate": null,
    "resolved": false,
    "done": false,
    "remarks": "Splitting monomer feed into 2 stages (seed 10%, balance 90% over 3.5 hrs).",
    "status": "Progress",
    "assignedTo": "Dr. Priya Raman",
    "responsibility": "Dr. Priya Raman"
  },
  {
    "id": 6,
    "stage": "S4 - Process Optimization (Lab Scale)",
    "deliverable": "Recipe Optimization & Feed Profiles",
    "activity": "Particle size control study",
    "task": "Particle size control study",
    "subject": "Coagulum formation",
    "issueDescription": "Coagulum above 0.05% appears at high surfactant dilution, exceeding the control limit.",
    "createdDate": "2026-03-18",
    "dueDate": "2026-04-05",
    "targetDate": "2026-04-05",
    "resolvedDate": null,
    "resolved": false,
    "done": false,
    "remarks": "Adjusting electrolyte (buffer) concentration to stabilize latex particles.",
    "status": "Progress",
    "assignedTo": "Anita Desai",
    "responsibility": "Anita Desai"
  },
  {
    "id": 7,
    "stage": "S4 - Process Optimization (Lab Scale)",
    "deliverable": "Recipe Optimization & Feed Profiles",
    "activity": "Residual monomer reduction",
    "task": "Residual monomer reduction",
    "subject": "Residual monomer above limit",
    "issueDescription": "Chaser initiator step leaves residual butyl acrylate at 400 ppm against a 100 ppm target.",
    "createdDate": "2026-03-25",
    "dueDate": "2026-04-12",
    "targetDate": "2026-04-12",
    "resolvedDate": null,
    "resolved": false,
    "done": false,
    "remarks": "Testing second chaser addition with sodium formaldehyde sulfoxylate (SFS).",
    "status": "Progress",
    "assignedTo": "Rajesh Kumar",
    "responsibility": "Rajesh Kumar"
  },
  {
    "id": 8,
    "stage": "S4 - Process Optimization (Lab Scale)",
    "deliverable": "Analytical Method Development & Validation",
    "activity": "Storage stability screening",
    "task": "Storage stability screening",
    "subject": "Viscosity drift",
    "issueDescription": "Emulsion viscosity rises 30% after four weeks at 50 degrees C.",
    "createdDate": "2026-04-02",
    "dueDate": "2026-04-20",
    "targetDate": "2026-04-20",
    "resolvedDate": null,
    "resolved": false,
    "done": false,
    "remarks": "Evaluating pH neutralization with ammonia vs AMP-95 to stabilize viscosity.",
    "status": "Pending",
    "assignedTo": "Vikram Singh",
    "responsibility": "Vikram Singh"
  }
];

  tableList: IssueItem[] = [];
  filteredIssues: IssueItem[] = [];

  lists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];

  cards: Record<Status, Card[]> = {
    Pending: [],
    Allocated: [],
    Progress: [],
    Hold: [],
    Cancelled: [],
    Completed: []
  };

  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    public dialog: MatDialog,
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

    this.myGroup = new FormGroup({
      Keyword: new FormControl(''),
      Status: new FormControl('')
    });

    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    const sampleStages = [
      'Stage 1: Business Case',
      'Stage 2: Project Initiation',
      'Stage 3: Development Procurement',
      'Stage 4: POC Formulation',
      'Stage 5: Scale-Up & EB Procurement',
      'Stage 6: Exhibit Batches'
    ];
    const sampleDeliverables = [
      'Business case preparation',
      'Project Costing & Strategy',
      'API & RM Procurement (Dev)',
      'Lab Prototype Batching',
      'Process Validation Protocols',
      'Regulatory Dossier Prep'
    ];
    const sampleActivities = [
      'Molecule Selection & Indication Mapping',
      'Country & Regulatory Scope Identification',
      'Preliminary COGs and CAPEX Estimation',
      'Market sizing and forecast analysis',
      'NPV & Commercial Attractiveness Model',
      'Granulation Parameter Tuning'
    ];
    const sampleTaskNames = [
      'API Characterization Study',
      'Excipient Sourcing & Compatibility',
      'Formulation Trial & Blending',
      'Dissolution Profile Optimization',
      'Analytical Method Validation',
      'Stability Protocol Setup',
      'Regulatory Dossier Preparation'
    ];
    this.originalTableList.forEach((item, idx) => {
      if (item.done === undefined) {
        item.done = item.resolved ?? false;
      }
      if (item.approved === undefined) {
        item.approved = item.resolved ?? false;
      }
      if (!item.stage) {
        item.stage = sampleStages[idx % sampleStages.length];
      }
      if (!item.deliverable) {
        item.deliverable = sampleDeliverables[idx % sampleDeliverables.length];
      }
      if (!item.activity) {
        item.activity = sampleActivities[idx % sampleActivities.length];
      }
      if (!item.task) {
        item.task = sampleTaskNames[idx % sampleTaskNames.length];
      }
      if (!item.historyCount) {
        item.historyCount = (idx % 10) + 1;
      }
      if (!item.documentsCount) {
        item.documentsCount = this.getDocumentsCount(idx);
      }
      if (!item.updatedDate) {
        item.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!item.updatedBy) {
        item.updatedBy = item.assignedTo || item.responsibility || 'Dr. Sarah Jenkins';
      }
    });

    this.go();
  }

  private getKanbanStatus(gridStatus: string): Status {
    if (gridStatus === 'Process') return 'Progress';
    if (gridStatus === 'Closed') return 'Completed';
    if (gridStatus === 'Hold') return 'Hold';
    if (gridStatus === 'Allocated') return 'Allocated';
    if (gridStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  private getGridStatus(kanbanStatus: Status): string {
    if (kanbanStatus === 'Progress') return 'Process';
    if (kanbanStatus === 'Completed') return 'Closed';
    if (kanbanStatus === 'Hold') return 'Hold';
    if (kanbanStatus === 'Allocated') return 'Allocated';
    if (kanbanStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  initializeKanbanData(): void {
    const grouped: Record<Status, Card[]> = {
      Pending: [],
      Allocated: [],
      Progress: [],
      Hold: [],
      Cancelled: [],
      Completed: []
    };

    this.filteredIssues.forEach(item => {
      const kStatus = this.getKanbanStatus(item.status);
      grouped[kStatus].push({
        id: item.id,
        subject: item.subject,
        LawFirm: item.remarks || '',
        createdBy: 'Quality Lead',
        assignedTo: item.responsibility || item.assignedTo || 'Engineer',
        createdDate: item.createdDate || '',
        dueDate: (item.targetDate || item.dueDate) || '',
        expedite: false,
        notes: [],
        expanded: false,
        status: kStatus
      });
    });

    this.cards = grouped;
  }

  // Timeline Modal Popup State
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  openTimelineModal(item: any): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
  }

  toggleDone(item: IssueItem): void {
    item.resolved = !!item.done;
    if (item.done) {
      item.resolvedDate = new Date().toISOString().split('T')[0];
      item.status = 'Closed';
    } else {
      item.resolvedDate = null;
      item.status = 'Process';
    }
    this.initializeKanbanData();
  }

  toggleResolved(item: IssueItem): void {
    item.done = item.resolved;
    this.toggleDone(item);
  }

  toggleApproved(item: IssueItem): void {
    // Approved state updated via mat-checkbox [(ngModel)]
  }

  addIssues(applicant: IssueItem | null): void {
    const isEdit = !!applicant;
    const dialogRef = this.dialog.open(AddIssueComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: applicant ? { ...applicant } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEdit && applicant) {
          const index = this.originalTableList.findIndex(item => item.id === applicant.id);
          if (index !== -1) {
            this.originalTableList[index] = {
              ...this.originalTableList[index],
              ...result,
              dueDate: result.targetDate || result.dueDate || this.originalTableList[index].dueDate
            };
          }
        } else {
          const newId = this.originalTableList.length ? Math.max(...this.originalTableList.map(t => t.id)) + 1 : 1;
          this.originalTableList.unshift({
            id: newId,
            ...result,
            stage: result.stage || 'Stage 1: Business Case',
            deliverable: result.deliverable || 'Business case preparation',
            activity: result.activity || 'Molecule Selection & Indication Mapping',
            task: result.task || 'API Characterization Study',
            status: result.status || 'Pending',
            image: result.image || 'assets/sample-image.jpg',
            document: result.document || 'assets/sample-1.pdf',
            assignedTo: result.assignedTo || result.responsibility || 'Rajesh Kumar',
            responsibility: result.responsibility || result.assignedTo || 'Rajesh Kumar',
            createdDate: new Date().toISOString().split('T')[0],
            resolvedDate: result.status === 'Closed' ? new Date().toISOString().split('T')[0] : null,
            resolved: result.status === 'Closed',
            done: result.status === 'Closed',
            approved: false,
            historyCount: (this.originalTableList.length % 10) + 1
          });
        }
        this.go();
      }
    });
  }

  deleteConfirmation(item: IssueItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        ProjectId: item.id,
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this issue?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.originalTableList = this.originalTableList.filter(t => t.id !== item.id);
        this.go();
      }
    });
  }





  clearFilter(): void {
    this.myGroup.reset();
    this.currentPage = 0;
    this.go();
  }

  fnHandlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.go();
  }

  go(): void {
    const filterVals = this.myGroup.value;
    const keyword = (filterVals.Keyword || '').toLowerCase().trim();
    const status = (filterVals.Status || '').trim();

    this.filteredIssues = this.originalTableList.filter(item => {
      if (keyword) {
        const matchesStage = (item.stage || '').toLowerCase().includes(keyword);
        const matchesDeliverable = (item.deliverable || '').toLowerCase().includes(keyword);
        const matchesActivity = (item.activity || '').toLowerCase().includes(keyword);
        const matchesTask = (item.task || item.taskName || '').toLowerCase().includes(keyword);
        const matchesSubject = (item.subject || '').toLowerCase().includes(keyword);
        const matchesDesc = (item.issueDescription || '').toLowerCase().includes(keyword);
        const matchesRemarks = (item.remarks || '').toLowerCase().includes(keyword);
        const matchesAssigned = (item.assignedTo || item.responsibility || '').toLowerCase().includes(keyword);
        if (!matchesStage && !matchesDeliverable && !matchesActivity && !matchesTask && !matchesSubject && !matchesDesc && !matchesRemarks && !matchesAssigned) {
          return false;
        }
      }
      if (status && item.status !== status) {
        return false;
      }
      return true;
    });

    this.totalSize = this.filteredIssues.length;
    this.tableList = this.filteredIssues.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );

    this.initializeKanbanData();
  }

  drop(event: CdkDragDrop<Card[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.cards[previousList],
        this.cards[currentList],
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = this.cards[currentList][event.currentIndex];
      movedCard.status = currentList;

      const issue = this.originalTableList.find(item => item.id === movedCard.id);
      if (issue) {
        issue.status = this.getGridStatus(currentList);
        issue.resolved = issue.status === 'Closed';
        issue.done = issue.resolved;
        if (issue.resolved && !issue.resolvedDate) {
          issue.resolvedDate = new Date().toISOString().split('T')[0];
        } else if (!issue.resolved) {
          issue.resolvedDate = null;
        }
      }

      const displayedIssue = this.tableList.find(item => item.id === movedCard.id);
      if (displayedIssue) {
        displayedIssue.status = this.getGridStatus(currentList);
        displayedIssue.resolved = displayedIssue.status === 'Closed';
        displayedIssue.done = displayedIssue.resolved;
      }
    } else {
      moveItemInArray(this.cards[targetList], event.previousIndex, event.currentIndex);
    }

    this.cards = { ...this.cards };
  }

  toggleCard(card: Card): void {
    card.expanded = !card.expanded;
  }

  getColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Process': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922',
      'Closed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'pending-card',
      'Allocated': 'allocated-card',
      'Progress': 'progress-card',
      'Hold': 'hold-card',
      'Cancelled': 'cancelled-card',
      'Completed': 'completed-card'
    };
    return classes[status] ?? 'default-card';
  }

  trackByCard(index: number, item: Card): number {
    return item.id;
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
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/CHM/006", name: this.projectName || "Acrylic Emulsion Binder 50% Solids" }
    });
  }

  openHistory(item?: any): void {
    const task = (typeof item === 'object' && item !== null) ? (item.task || item.taskName || '') : '';
    const subject = (typeof item === 'object' && item !== null) ? (item.subject || '') : (typeof item === 'string' ? item : '');
    const description = (typeof item === 'object' && item !== null) ? (item.issueDescription || '') : '';
    const dateCreated = (typeof item === 'object' && item !== null) ? (item.createdDate || '') : '';
    const dueDate = (typeof item === 'object' && item !== null) ? (item.dueDate || item.targetDate || '') : '';
    const dateResolved = (typeof item === 'object' && item !== null) ? (item.resolvedDate || '') : '';
    const resolved = (typeof item === 'object' && item !== null) ? (item.done ?? !!item.resolved) : false;
    const assignedTo = (typeof item === 'object' && item !== null) ? (item.assignedTo || item.responsibility || '') : '';

    this.router.navigate(['/projects/dashboard/issues/history'], {
      queryParams: {
        task: task,
        subject: subject,
        description: description,
        dateCreated: dateCreated,
        dueDate: dueDate,
        dateResolved: dateResolved,
        resolved: resolved,
        assignedTo: assignedTo,
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
