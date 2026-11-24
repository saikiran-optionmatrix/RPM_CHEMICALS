import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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

import { AddIssueComponent } from '../../../../project-issues/add-issue/add-issue.component';
import { IssueTimelineComponent } from '../../../../project-issues/issue-timeline/issue-timeline.component';
import { ConfirmationDialogComponent } from '../../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../../../common/shared/documents-pop/documents-pop.component';

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
  selector: 'app-project-wbs-tasks-issues',
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
    MatInputModule
  ],
  templateUrl: './project-wbs-tasks-issues.component.html',
  styleUrl: './project-wbs-tasks-issues.component.scss',
})
export class ProjectWbsTasksIssuesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  filterToggle: boolean = false;
  totalSize = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  myGroup: FormGroup = new FormGroup({
    Keyword: new FormControl(''),
    Status: new FormControl('')
  });

  taskName: string = '';
  taskCode: string = '';
  reference: string = '';
  jobCode: string = '';
  activityName: string = '';
  jobCodeParam: string = '';
  stageName: string = '';
  stageCode: string = '';
  gateName: string = '';
  gateCode: string = '';
  projectName: string = '';
  projectCode: string = '';

  originalTableList: IssueItem[] = [];
  tableList: IssueItem[] = [];
  filteredIssues: IssueItem[] = [];

  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taskName = params['taskName'] || '';
      this.taskCode = params['taskCode'] || '';
      this.reference = params['reference'] || '';
      this.jobCode = params['jobCode'] || '';
      this.activityName = params['activityName'] || '';
      this.jobCodeParam = params['jobCodeParam'] || params['jobCode'] || '';
      this.stageName = params['stageName'] || '';
      this.stageCode = params['stageCode'] || '';
      this.gateName = params['gateName'] || '';
      this.gateCode = params['gateCode'] || '';
      this.projectName = params['projectName'] || params['name'] || 'Acrylic Emulsion Binder 50% Solids';
      this.projectCode = params['projectCode'] || params['code'] || '2026/CHM/006';

      this.initIssuesData();
    });
  }

  private initIssuesData(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];

    const actName = this.activityName || 'Review industrial customer specifications, grade requirements and end-use application criteria';
    const tName = this.taskName || 'Confirm technical scope and operating window — Review industrial customer specifications, grade requirements and end-use application criteria';
    const stg = this.stageName || 'S1: Opportunity Identification';

    let targetResolved = 1;
    let targetTotal = 2;
    const countParam = this.route?.snapshot.queryParamMap.get('issuesCount');
    if (countParam && countParam.includes('/')) {
      const parts = countParam.split('/');
      targetResolved = parseInt(parts[0], 10) || 0;
      targetTotal = parseInt(parts[1], 10) || 1;
    }

    const taskSpecificIssues: IssueItem[] = [
      {
        id: 1,
        stage: stg,
        deliverable: 'Customer Application & Target Specification Matrix',
        activity: actName,
        task: tName,
        subject: 'Customer specification clarification on monomer residual VOC threshold',
        issueDescription: 'Customer end-use application requires residual VOC < 50 ppm, requiring post-polymerization stripping cycle verification.',
        createdDate: '2026-06-01',
        dueDate: '2026-06-15',
        targetDate: '2026-06-15',
        resolvedDate: targetResolved >= 1 ? '2026-06-14' : null,
        resolved: targetResolved >= 1,
        remarks: targetResolved >= 1 ? 'Vacuum stripping cycle confirmed at Dahej pilot center; meets < 50 ppm target.' : 'Under review with customer technical team.',
        status: targetResolved >= 1 ? 'Closed' : 'Process',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Dr. Sarah Jenkins',
        responsibility: 'Dr. Sarah Jenkins'
      },
      {
        id: 2,
        stage: stg,
        deliverable: 'Preliminary Business Case & Techno-Economic Screening',
        activity: actName,
        task: tName,
        subject: 'Operating temperature window conflict with summer site cooling water limits',
        issueDescription: 'Customer operating window requires max reactor jacket temperature below 85 °C during peak summer cooling tower conditions.',
        createdDate: '2026-06-05',
        dueDate: '2026-06-25',
        targetDate: '2026-06-25',
        resolvedDate: targetResolved >= 2 ? '2026-06-24' : null,
        resolved: targetResolved >= 2,
        remarks: targetResolved >= 2 ? 'Chilled water loop capacity allocated in plant layout.' : 'Evaluating supplemental chilled brine heat exchanger.',
        status: targetResolved >= 2 ? 'Closed' : 'Pending',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Ravi Shah',
        responsibility: 'Ravi Shah'
      },
      {
        id: 3,
        stage: stg,
        deliverable: 'Customer Application & Target Specification Matrix',
        activity: actName,
        task: tName,
        subject: 'Raw material grade availability for secondary initiator',
        issueDescription: 'Technical grade organic peroxide initiator supplier reports 8-week lead time for imported lots.',
        createdDate: '2026-06-10',
        dueDate: '2026-07-05',
        targetDate: '2026-07-05',
        resolvedDate: targetResolved >= 3 ? '2026-07-02' : null,
        resolved: targetResolved >= 3,
        remarks: targetResolved >= 3 ? 'Alternate domestic vendor qualified for azo-initiator substitute.' : 'Sourcing team pursuing expedited customs clearance.',
        status: targetResolved >= 3 ? 'Closed' : 'Hold',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Anita Desai',
        responsibility: 'Anita Desai'
      }
    ];

    const currentTaskItems = taskSpecificIssues.slice(0, Math.max(targetTotal, 1));

    const generalChemicalIssues: IssueItem[] = [
      {
        id: 10,
        stage: 'S3: Route Scouting & Lab Synthesis',
        deliverable: 'Synthetic Route Scouting & Catalyst Screening',
        activity: 'Raw Material Characterization',
        task: 'Monomer & Catalyst Quality Assay',
        subject: 'Monomer raw material assay variation between supplier lots',
        issueDescription: 'Technical grade butyl acrylate lot 26-04 shows 0.8% inhibitor impurity affecting initial polymerization induction period.',
        createdDate: '2026-06-15',
        dueDate: '2026-07-12',
        targetDate: '2026-07-12',
        resolvedDate: null,
        resolved: false,
        remarks: 'Activated alumina column filtration setup to strip residual inhibitor prior to reactor charging.',
        status: 'Hold',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Mia Chen',
        responsibility: 'Mia Chen'
      },
      {
        id: 11,
        stage: 'S4: Process Optimization (Lab Scale)',
        deliverable: 'Reaction Parameter Optimization (Temp, Pressure, Feed)',
        activity: 'Reaction Kinetics & Parameter Optimization',
        task: 'Lab Scale 2 L Batch Synthesis',
        subject: 'Exothermic heat surge during rapid catalyst dosing',
        issueDescription: 'Semi-batch monomer feed rate of 5 mL/min causes 4 °C exotherm overshoot above isothermal setpoint.',
        createdDate: '2026-06-20',
        dueDate: '2026-07-20',
        targetDate: '2026-07-20',
        resolvedDate: null,
        resolved: false,
        remarks: 'Recalibrating PID feed controller and staggering catalyst additions over 180 min feed window.',
        status: 'Allocated',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Ana Vega',
        responsibility: 'Ana Vega'
      },
      {
        id: 12,
        stage: 'S5: Process Route Selection & Basis of Design',
        deliverable: 'Process Flow Diagram (PFD) & Basis of Design (BOD)',
        activity: 'Basis of Design (BOD) & Gate 2 Dossier',
        task: 'Mass & Energy Balance Flowsheet',
        subject: 'Distillation column foaming during fractional solvent recovery',
        issueDescription: 'Solvent recovery column overhead condenser experiences vapor liquid entrainment at 120 °C reboiler temperature.',
        createdDate: '2026-06-25',
        dueDate: '2026-07-28',
        targetDate: '2026-07-28',
        resolvedDate: null,
        resolved: false,
        remarks: 'Testing anti-foam additive dosing rate and reducing column boil-up rate by 15%.',
        status: 'Pending',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Robert Chen',
        responsibility: 'Robert Chen'
      },
      {
        id: 13,
        stage: 'S6: Bench-to-Pilot Process Development',
        deliverable: 'Reaction Calorimetry (RC1) & Heat Transfer Evaluation',
        activity: 'Reaction Calorimetry (RC1) & Heat Transfer',
        task: 'Reaction Kinetics & Calorimetry',
        subject: 'RC1 reaction calorimetry jacket heat transfer limit reached',
        issueDescription: 'Heat release rate of 145 W/L approaches maximum heat removal capacity of the pilot 100 L reactor cooling jacket.',
        createdDate: '2026-07-01',
        dueDate: '2026-08-08',
        targetDate: '2026-08-08',
        resolvedDate: null,
        resolved: false,
        remarks: 'Extended dosing time by 45 minutes to flatten peak heat generation curve.',
        status: 'Process',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Ravi Shah',
        responsibility: 'Ravi Shah'
      },
      {
        id: 14,
        stage: 'S7: Process Safety & Regulatory Studies',
        deliverable: 'Process Hazard Analysis (HAZOP) & Safety Interlocks',
        activity: 'HAZOP & Relief Vent Sizing',
        task: 'HAZOP Critical Process Review',
        subject: 'HAZOP critical action: dual rupture disc and emergency relief sizing',
        issueDescription: 'DIERS relief vent calculation for total agitation failure runaway indicates vent line diameter must be increased from 3-inch to 4-inch.',
        createdDate: '2026-07-10',
        dueDate: '2026-08-18',
        targetDate: '2026-08-18',
        resolvedDate: null,
        resolved: false,
        remarks: 'Engineering piping team updated P&ID and nozzle schedule for pilot and commercial reactors.',
        status: 'Hold',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Emily Watson',
        responsibility: 'Emily Watson'
      },
      {
        id: 15,
        stage: 'S8: Regulatory Registration Filing (REACH / TSCA)',
        deliverable: 'REACH / TSCA Technical Dossier Preparation & Filing',
        activity: 'REACH Inquiry & Dossier Submission',
        task: 'REACH / TSCA Dossier Compilation',
        subject: 'REACH inquiry query on acute aquatic toxicity endpoint',
        issueDescription: 'ECHA technical evaluation requested additional 96h OECD 203 freshwater fish ecotoxicity testing for polymer breakdown products.',
        createdDate: '2026-07-20',
        dueDate: '2026-09-15',
        targetDate: '2026-09-15',
        resolvedDate: '2026-08-25',
        resolved: true,
        remarks: 'Commissioned GLP certified laboratory study; data incorporated into IUCLID dossier Section 6.1.',
        status: 'Closed',
        image: 'assets/sample-image.jpg',
        document: 'assets/sample-1.pdf',
        assignedTo: 'Jessica Alba',
        responsibility: 'Jessica Alba'
      }
    ];

    this.originalTableList = [...currentTaskItems, ...generalChemicalIssues];

    this.originalTableList.forEach((item, idx) => {
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

  openTimelineModal(item: any): void {
    this.dialog.open(IssueTimelineComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: item
    });
  }

  toggleResolved(item: IssueItem): void {
    if (item.resolved) {
      item.resolvedDate = new Date().toISOString().split('T')[0];
      item.status = 'Closed';
    } else {
      item.resolvedDate = null;
      item.status = 'Process';
    }
  }

  addIssues(applicant: IssueItem | null): void {
    const isEdit = !!applicant;
    const dialogRef = this.dialog.open(AddIssueComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: applicant ? { ...applicant } : {
        task: this.taskName,
        activity: this.activityName,
        stage: this.stageName
      }
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
            stage: result.stage || this.stageName || 'S1: Opportunity Identification',
            deliverable: result.deliverable || '0.1 - Business Case Preparation',
            activity: result.activity || this.activityName || 'Competitor Grade & Price Benchmarking',
            task: result.task || this.taskName || 'Market Benchmarking & Purity Analysis',
            status: result.status || 'Pending',
            image: result.image || 'assets/sample-image.jpg',
            document: result.document || 'assets/sample-1.pdf',
            assignedTo: result.assignedTo || result.responsibility || 'Rajesh Kumar',
            responsibility: result.responsibility || result.assignedTo || 'Rajesh Kumar',
            createdDate: new Date().toISOString().split('T')[0],
            resolvedDate: result.status === 'Closed' ? new Date().toISOString().split('T')[0] : null,
            resolved: result.status === 'Closed',
            historyCount: (this.originalTableList.length % 10) + 1,
            documentsCount: 1
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
    this.myGroup.reset({ Keyword: '', Status: '' });
    this.currentPage = 0;
    this.go();
  }

  fnHandlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.go();
  }

  go(): void {
    const filterVals = this.myGroup ? this.myGroup.value : {};
    const keyword = (filterVals?.Keyword || '').toLowerCase().trim();
    const status = (filterVals?.Status || '').trim();

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
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/stages/wbs')) {
      this.router.navigate(['/projects/dashboard/stages/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else if (currentUrl.includes('/wbs')) {
      this.router.navigate(['/projects/dashboard/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else {
      this.location.back();
    }
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
