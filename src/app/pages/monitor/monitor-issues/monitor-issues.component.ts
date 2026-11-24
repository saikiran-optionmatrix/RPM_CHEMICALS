import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddIssueComponent } from '../../projects/project-dashboard/project-issues/add-issue/add-issue.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { DocumentsPopComponent } from '../../../common/shared/documents-pop/documents-pop.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

export type Status = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface CalendarDayItem {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  count: number;
  isBacklog: boolean;
}

export interface IssueCard {
  isBacklog?: boolean;
  id: number;
  stage?: string;
  deliverable?: string;
  activity?: string;
  task?: string;
  taskName?: string;
  subject: string;
  issueDescription: string;
  remarks: string;
  status: string;
  targetDate: string;
  dueDate?: string;
  createdDate?: string;
  resolvedDate?: string | null;
  completedDate?: string;
  resolved?: boolean;
  done?: boolean;
  approved?: boolean;
  closed?: boolean;
  image?: string;
  document?: string;
  responsibility: string;
  assignedTo?: string;
  projectName?: string;
  projectCode?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string | null;
  updatedBy?: string | null;
  delayReason?: string;
  // Kanban specific
  LawFirm?: string;
  createdBy?: string;
  expedite?: boolean;
  notes?: { text: string; author: string; date: string }[];
  expanded?: boolean;
}

@Component({
  selector: 'app-monitor-issues',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './monitor-issues.component.html',
  styleUrls: ['./monitor-issues.component.scss']
})
export class MonitorIssuesComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('kanbanContainer') kanbanContainer!: ElementRef<HTMLDivElement>;
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

  calendarFilteredIssues: IssueCard[] = [];
  calendarPaginatedIssues: IssueCard[] = [];
  calendarPageIndex: number = 0;
  calendarPageSize: number = 10;

  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View & Modal States
  showFilter: boolean = false;
  isKanbanView: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: IssueCard | null = null;
  maskClosed: boolean = false;
  isOverdueOnly: boolean = false;

  // Pagination & Filtering
  totalSize: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  filterForm: FormGroup = this.fb.group({
    Keyword: [''],
    Status: ['']
  });

  // Data Arrays
  originalTableList: IssueCard[] = [];
  tableList: IssueCard[] = [];
  filteredIssues: IssueCard[] = [];

  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  // Kanban Data
  readonly kanbanLists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<Status, IssueCard[]> = {
    Pending: [], Allocated: [], Progress: [],
    Hold: [], Cancelled: [], Completed: []
  };

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
    this.buildCalendarDays();
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && d.dayNumber === 10) ||
      this.calendarDays.find(d => d.inCurrentMonth);
    if (defaultDay) {
      this.selectCalendarDate(defaultDay);
    }
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  private loadMockData(): void {
    this.originalTableList = [
      {
            "id": 1,
            "stage": "S3 - Route Scouting & Lab Synthesis",
            "deliverable": "Reaction confirmation and triage",
            "activity": "Particle Size Spread Across Polymerization Batches",
            "task": "Particle Size Spread Across Polymerization Batches",
            "taskName": "Particle Size Spread Across Polymerization Batches",
            "subject": "Particle Size Spread Across Polymerization Batches",
            "issueDescription": "Batch-to-batch particle size spread is above target; surfactant lot comparison is under review.",
            "remarks": "Batch-to-batch particle size spread is above target; surfactant lot comparison is under review.",
            "status": "Pending",
            "targetDate": "2026-03-15",
            "dueDate": "2026-03-15",
            "createdDate": "2026-02-01",
            "resolvedDate": null,
            "completedDate": "",
            "resolved": false,
            "done": false,
            "approved": false,
            "closed": false,
            "responsibility": "Process Chemistry",
            "assignedTo": "Process Chemistry",
            "projectName": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "projectCode": "2026/CHM/001",
            "historyCount": 1,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman",
            "delayReason": "Surfactant Lot Variability",
            "LawFirm": "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
            "createdBy": "Process Chemistry",
            "expedite": true,
            "notes": [
                  {
                        "text": "Batch-to-batch particle size spread is above target; surfactant lot comparison is under review.",
                        "author": "Process Chemistry",
                        "date": "2026-02-10"
                  }
            ],
            "expanded": false
      },
      {
            "id": 2,
            "stage": "S3 - Route Scouting & Lab Synthesis",
            "deliverable": "Reaction confirmation and triage",
            "activity": "Catalyst Activity Loss After Recycle",
            "task": "Catalyst Activity Loss After Recycle",
            "taskName": "Catalyst Activity Loss After Recycle",
            "subject": "Catalyst Activity Loss After Recycle",
            "issueDescription": "Pd/C activity drops 15% after the third recycle; regeneration trial is in progress.",
            "remarks": "Pd/C activity drops 15% after the third recycle; regeneration trial is in progress.",
            "status": "In Progress",
            "targetDate": "2026-03-20",
            "dueDate": "2026-03-20",
            "createdDate": "2026-02-01",
            "resolvedDate": null,
            "completedDate": "",
            "resolved": false,
            "done": false,
            "approved": false,
            "closed": false,
            "responsibility": "Catalyst Development",
            "assignedTo": "Catalyst Development",
            "projectName": "Hydrogenation Catalyst Development (Pd/C)",
            "projectCode": "2026/CHM/002",
            "historyCount": 2,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman",
            "delayReason": "Catalyst Supplier Lot Qualification Delay",
            "LawFirm": "Hydrogenation Catalyst Development (Pd/C)",
            "createdBy": "Catalyst Development",
            "expedite": false,
            "notes": [
                  {
                        "text": "Pd/C activity drops 15% after the third recycle; regeneration trial is in progress.",
                        "author": "Catalyst Development",
                        "date": "2026-02-10"
                  }
            ],
            "expanded": false
      },
      {
            "id": 3,
            "stage": "S3 - Route Scouting & Lab Synthesis",
            "deliverable": "Reaction confirmation and triage",
            "activity": "Exotherm Excursion in Cyclization Step",
            "task": "Exotherm Excursion in Cyclization Step",
            "taskName": "Exotherm Excursion in Cyclization Step",
            "subject": "Exotherm Excursion in Cyclization Step",
            "issueDescription": "Reaction calorimetry shows a higher adiabatic temperature rise than modelled; cooling design is on hold pending data.",
            "remarks": "Reaction calorimetry shows a higher adiabatic temperature rise than modelled; cooling design is on hold pending data.",
            "status": "On Hold",
            "targetDate": "2026-03-10",
            "dueDate": "2026-03-10",
            "createdDate": "2026-02-01",
            "resolvedDate": null,
            "completedDate": "",
            "resolved": false,
            "done": false,
            "approved": false,
            "closed": false,
            "responsibility": "Process Safety",
            "assignedTo": "Process Safety",
            "projectName": "Agrochemical Active Ingredient Synthesis Development",
            "projectCode": "2026/CHM/003",
            "historyCount": 3,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman",
            "delayReason": "Calorimetry Slot Backlog",
            "LawFirm": "Agrochemical Active Ingredient Synthesis Development",
            "createdBy": "Process Safety",
            "expedite": true,
            "notes": [
                  {
                        "text": "Reaction calorimetry shows a higher adiabatic temperature rise than modelled; cooling design is on hold pending data.",
                        "author": "Process Safety",
                        "date": "2026-02-10"
                  }
            ],
            "expanded": false
      },
      {
            "id": 4,
            "stage": "S3 - Route Scouting & Lab Synthesis",
            "deliverable": "Reaction confirmation and triage",
            "activity": "Column Flooding at Design Reflux",
            "task": "Column Flooding at Design Reflux",
            "taskName": "Column Flooding at Design Reflux",
            "subject": "Column Flooding at Design Reflux",
            "issueDescription": "Packing specification and reflux ratio revised; flooding limit verification passed.",
            "remarks": "Packing specification and reflux ratio revised; flooding limit verification passed.",
            "status": "Closed",
            "targetDate": "2026-02-25",
            "dueDate": "2026-02-25",
            "createdDate": "2026-02-01",
            "resolvedDate": "2026-02-24",
            "completedDate": "2026-02-24",
            "resolved": false,
            "done": false,
            "approved": false,
            "closed": true,
            "responsibility": "Chemical Engineering",
            "assignedTo": "Chemical Engineering",
            "projectName": "Solvent Recovery & Fractional Distillation Process Development",
            "projectCode": "2026/CHM/004",
            "historyCount": 4,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman",
            "delayReason": "",
            "LawFirm": "Solvent Recovery & Fractional Distillation Process Development",
            "createdBy": "Chemical Engineering",
            "expedite": false,
            "notes": [
                  {
                        "text": "Packing specification and reflux ratio revised; flooding limit verification passed.",
                        "author": "Chemical Engineering",
                        "date": "2026-02-10"
                  }
            ],
            "expanded": false
      },
      {
            "id": 5,
            "stage": "S3 - Route Scouting & Lab Synthesis",
            "deliverable": "Reaction confirmation and triage",
            "activity": "Poor Suspensibility in Granule Prototypes",
            "task": "Poor Suspensibility in Granule Prototypes",
            "taskName": "Poor Suspensibility in Granule Prototypes",
            "subject": "Poor Suspensibility in Granule Prototypes",
            "issueDescription": "Suspensibility is below the 80% criterion; dispersant change is under review.",
            "remarks": "Suspensibility is below the 80% criterion; dispersant change is under review.",
            "status": "Pending",
            "targetDate": "2026-03-18",
            "dueDate": "2026-03-18",
            "createdDate": "2026-02-01",
            "resolvedDate": null,
            "completedDate": "",
            "resolved": false,
            "done": false,
            "approved": false,
            "closed": false,
            "responsibility": "Formulation Development",
            "assignedTo": "Formulation Development",
            "projectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "projectCode": "2026/CHM/005",
            "historyCount": 5,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman",
            "delayReason": "Dispersant Vendor Report Delay",
            "LawFirm": "Water-Dispersible Granule (WDG) Formulation Development",
            "createdBy": "Formulation Development",
            "expedite": true,
            "notes": [
                  {
                        "text": "Suspensibility is below the 80% criterion; dispersant change is under review.",
                        "author": "Formulation Development",
                        "date": "2026-02-10"
                  }
            ],
            "expanded": false
      },
      {
            "id": 6,
            "stage": "S3 - Route Scouting & Lab Synthesis",
            "deliverable": "Reaction confirmation and triage",
            "activity": "Binder Migration During Drying",
            "task": "Binder Migration During Drying",
            "taskName": "Binder Migration During Drying",
            "subject": "Binder Migration During Drying",
            "issueDescription": "Binder migration gives uneven granule hardness; drying profile is under optimization",
            "remarks": "Binder migration gives uneven granule hardness; drying profile is under optimization",
            "status": "Pending",
            "targetDate": "2026-03-28",
            "dueDate": "2026-03-28",
            "createdDate": "2026-02-01",
            "resolvedDate": null,
            "completedDate": "",
            "resolved": false,
            "done": false,
            "approved": false,
            "closed": false,
            "responsibility": "Formulation Development",
            "assignedTo": "Formulation Development",
            "projectName": "Water-Dispersible Granule (WDG) Formulation Development",
            "projectCode": "2026/CHM/005",
            "historyCount": 6,
            "documentsCount": 1,
            "updatedDate": "2026-02-15",
            "updatedBy": "Dr. Priya Raman",
            "delayReason": "Dryer Trial Slot Delay",
            "LawFirm": "Water-Dispersible Granule (WDG) Formulation Development",
            "createdBy": "Formulation Development",
            "expedite": true,
            "notes": [
                  {
                        "text": "Binder migration gives uneven granule hardness; drying profile is under optimization",
                        "author": "Formulation Development",
                        "date": "2026-02-10"
                  }
            ],
            "expanded": false
      }
];

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
        item.done = item.status === 'Closed' || !!item.closed;
      }
      if (item.approved === undefined) {
        item.approved = item.status === 'Closed' || !!item.closed;
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
  }

  // --- Filtering & Pagination ---

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onClear(): void {
    this.filterForm.reset();
    this.maskClosed = false;
    this.isOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilters();
  }

  toggleDone(item: IssueCard): void {
    item.resolved = !!item.done;
    item.closed = !!item.done;
    if (item.done) {
      item.resolvedDate = new Date().toISOString().split('T')[0];
      item.completedDate = item.resolvedDate;
      item.status = 'Closed';
    } else {
      item.resolvedDate = null;
      item.completedDate = '';
      item.status = 'Process';
    }
    const orig = this.originalTableList.find(t => t.id === item.id);
    if (orig) {
      orig.done = item.done;
      orig.resolved = item.resolved;
      orig.closed = item.closed;
      orig.resolvedDate = item.resolvedDate;
      orig.completedDate = item.completedDate;
      orig.status = item.status;
    }
    this.applyFilters();
  }

  toggleApproved(item: IssueCard): void {
    const orig = this.originalTableList.find(t => t.id === item.id);
    if (orig) {
      orig.approved = item.approved;
    }
  }

  onClosedChange(item: IssueCard, checked: boolean): void {
    item.closed = checked;
    item.done = checked;
    item.resolved = checked;
    if (checked) {
      item.status = 'Closed';
      if (!item.completedDate) {
        item.completedDate = new Date().toISOString().split('T')[0];
      }
      if (!item.resolvedDate) {
        item.resolvedDate = item.completedDate;
      }
    } else {
      if (item.status === 'Closed') {
        item.status = 'Pending';
      }
      item.completedDate = '';
      item.resolvedDate = null;
    }
    const orig = this.originalTableList.find(t => t.id === item.id);
    if (orig) {
      orig.closed = item.closed;
      orig.done = item.done;
      orig.resolved = item.resolved;
      orig.status = item.status;
      orig.completedDate = item.completedDate;
      orig.resolvedDate = item.resolvedDate;
    }
    this.applyFilters();
  }

  isDateExceeded(item: IssueCard): boolean {
    const isClosed = item.closed || item.done || item.status === 'Closed';
    if (isClosed) return false;
    const d = item.dueDate || item.targetDate;
    if (!d) return false;
    const today = new Date().toISOString().split('T')[0];
    return d < today;
  }

  onOverdueChange(): void {
    this.currentPage = 0;
    this.monitorStateService.setOverdue(this.isOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.isOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilters();
  }

  applyFilters(): void {
    const { Keyword, Status } = this.filterForm.value;
    const keywordStr = (Keyword || '').toLowerCase().trim();
    const today = new Date().toISOString().split('T')[0];

    this.filteredIssues = this.originalTableList.filter(item => {
      if (this.maskClosed && (item.closed || item.done || item.status === 'Closed')) {
        return false;
      }
      if (this.isOverdueOnly) {
        const d = item.dueDate || item.targetDate;
        const isClosed = item.closed || item.done || item.status === 'Closed';
        if (isClosed || !d || d >= today) {
          return false;
        }
      }
      let matchesKeyword = true;
      if (keywordStr) {
        matchesKeyword = (item.stage || '').toLowerCase().includes(keywordStr) ||
                         (item.deliverable || '').toLowerCase().includes(keywordStr) ||
                         (item.activity || '').toLowerCase().includes(keywordStr) ||
                         (item.task || item.taskName || '').toLowerCase().includes(keywordStr) ||
                         (item.subject || '').toLowerCase().includes(keywordStr) ||
                         (item.issueDescription || '').toLowerCase().includes(keywordStr) ||
                         (item.remarks || '').toLowerCase().includes(keywordStr) ||
                         (item.projectCode || '').toLowerCase().includes(keywordStr) ||
                         (item.projectName || '').toLowerCase().includes(keywordStr) ||
                         (item.assignedTo || item.responsibility || '').toLowerCase().includes(keywordStr);
      }
      let matchesStatus = true;
      if (Status) {
        matchesStatus = item.status === Status;
      }
      return matchesKeyword && matchesStatus;
    });

    this.totalSize = this.filteredIssues.length;
    const start = this.currentPage * this.pageSize;
    this.tableList = this.filteredIssues.slice(start, start + this.pageSize);
    this.initializeKanbanData();
    this.updateCalendarTableData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  // --- Kanban Logic ---

  public getKanbanStatus(gridStatus: string): Status {
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
    return kanbanStatus;
  }

  private initializeKanbanData(): void {
    const grouped: Record<Status, IssueCard[]> = {
      Pending: [], Allocated: [], Progress: [],
      Hold: [], Cancelled: [], Completed: []
    };

    this.filteredIssues.forEach(item => {
      const kStatus = this.getKanbanStatus(item.status);
      grouped[kStatus].push({
        ...item,
        LawFirm: item.remarks || '',
        createdBy: 'Admin',
        assignedTo: item.responsibility,
        dueDate: item.targetDate,
        expedite: false,
        notes: [],
        expanded: false,
        status: kStatus
      });
    });
    this.kanbanCards = grouped;
  }

  onDrop(event: CdkDragDrop<IssueCard[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.kanbanCards[previousList],
        this.kanbanCards[currentList],
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = this.kanbanCards[currentList][event.currentIndex];
      movedCard.status = currentList;

      // Sync with master table list
      const issue = this.originalTableList.find(item => item.id === movedCard.id);
      if (issue) issue.status = this.getGridStatus(currentList);

      const displayedIssue = this.tableList.find(item => item.id === movedCard.id);
      if (displayedIssue) displayedIssue.status = this.getGridStatus(currentList);
    } else {
      moveItemInArray(this.kanbanCards[targetList], event.previousIndex, event.currentIndex);
    }
  }

  toggleCard(card: IssueCard): void {
    card.expanded = !card.expanded;
  }

  getKanbanColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    return status.toLowerCase() + '-card';
  }

  onEditIssue(item: IssueCard): void {
    const dialogRef = this.dialog.open(AddIssueComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: { ...item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, result);
        item.dueDate = result.targetDate || result.dueDate || item.dueDate;
        const orig = this.originalTableList.find(t => t.id === item.id);
        if (orig) {
          Object.assign(orig, result);
          orig.dueDate = item.dueDate;
        }
        this.applyFilters();
      }
    });
  }

  addIssues(applicant: IssueCard): void {
    this.onEditIssue(applicant);
  }

  deleteConfirmation(applicant: IssueCard): void {
    this.onDeleteIssue(applicant);
  }

  onDeleteIssue(item: IssueCard): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.originalTableList = this.originalTableList.filter(t => t.id !== item.id);
        this.applyFilters();
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
        projectName: (typeof item === 'object' && item !== null) ? item.projectName : undefined,
        projectCode: (typeof item === 'object' && item !== null) ? item.projectCode : undefined
      },
      queryParamsHandling: 'merge'
    });
  }

  // openGridView(): void {
  //   this.dialog.open(IssuesGridColumnsComponent, { width: '800px', height: 'auto', data: {} });
  // }

  openProject(item: IssueCard): void {
    this.router.navigate(['/projects/dashboard/issues'], {
      queryParams: {
        code: item.projectCode,
        projectCode: item.projectCode,
        name: item.projectName,
        projectName: item.projectName
      }
    });
  }

  openTimelineModal(task: IssueCard): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }
  setActiveView(view: 'calendar' | 'table'): void {
    this.activeView = view;
    this.isKanbanView = false;
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
      const count = inCurrentMonth ? this.getIssueCountForDate(cellDate) : 0;

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

  getIssueCountForDate(date: Date): number {
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

  isBacklogIssue(item: IssueCard): boolean {
    if (item.isBacklog !== undefined) {
      return !!item.isBacklog;
    }
    const dateStr = item.dueDate || item.targetDate || item.createdDate;
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

  getIssuesForDate(date: Date): IssueCard[] {
    const count = this.getIssueCountForDate(date);
    const d = date.getDate();
    const isBacklog = this.isBacklogDate(date);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (!this.originalTableList || this.originalTableList.length === 0) {
      return [];
    }

    const result: IssueCard[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (d * 2 + i * 3) % this.originalTableList.length;
      const base = this.originalTableList[idx];
      result.push({
        ...base,
        id: (d * 100 + i + 1),
        createdDate: dateStr,
        dueDate: dateStr,
        targetDate: dateStr,
        resolvedDate: isBacklog ? null : (base.resolvedDate || dateStr),
        completedDate: isBacklog ? '' : (base.completedDate || dateStr),
        done: isBacklog ? false : base.done,
        resolved: isBacklog ? false : base.resolved,
        approved: isBacklog ? false : base.approved,
        closed: isBacklog ? false : base.closed,
        status: isBacklog ? 'Pending' : base.status,
        isBacklog: isBacklog
      });
    }
    return result;
  }

  updateCalendarTableData(): void {
    if (this.selectedCalendarDate) {
      this.calendarFilteredIssues = this.getIssuesForDate(this.selectedCalendarDate);
    } else {
      const allMonthIssues: IssueCard[] = [];
      const currentMonthDays = this.calendarDays.filter(d => d.inCurrentMonth && d.count > 0);
      for (const d of currentMonthDays) {
        allMonthIssues.push(...this.getIssuesForDate(d.date));
      }
      this.calendarFilteredIssues = allMonthIssues.length > 0 ? allMonthIssues : [...this.originalTableList];
    }
    const start = this.calendarPageIndex * this.calendarPageSize;
    this.calendarPaginatedIssues = this.calendarFilteredIssues.slice(start, start + this.calendarPageSize);
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
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.activeView === 'calendar') {
      this.scrollCalendarRight();
      return;
    }
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollKanban(direction: 'left' | 'right', amount: number = 340): void {
    if (!this.kanbanContainer?.nativeElement) return;
    const container = this.kanbanContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  public updateScrollButtons(): void {
    if (!this.kanbanContainer?.nativeElement) return;
    const el = this.kanbanContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
