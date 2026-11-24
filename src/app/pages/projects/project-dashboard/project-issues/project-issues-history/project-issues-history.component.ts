import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface IssueHistoryItem {
  id?: number;
  task?: string;
  taskName?: string;
  subject: string;
  description: string;
  dateCreated: string | null;
  dueDate: string | null;
  dateResolved: string | null;
  resolved: boolean;
  assignedTo: string;
  status?: string;
  remarks?: string;
  revision?: string;
  updatedBy?: string;
  changeDate?: string;
}

@Component({
  selector: 'app-project-issues-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-issues-history.component.html',
  styleUrl: './project-issues-history.component.scss'
})
export class ProjectIssuesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  task: string = '';
  subject: string = '';
  description: string = '';
  dateCreated: string = '';
  dueDate: string = '';
  dateResolved: string = '';
  resolved: boolean = false;
  assignedTo: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: IssueHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: IssueHistoryItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['task'] || params['taskName']) {
        this.task = params['task'] || params['taskName'];
      }
      if (params['subject']) {
        this.subject = params['subject'];
      }
      if (params['description']) {
        this.description = params['description'];
      }
      if (params['dateCreated']) {
        this.dateCreated = params['dateCreated'];
      }
      if (params['dueDate']) {
        this.dueDate = params['dueDate'];
      }
      if (params['dateResolved']) {
        this.dateResolved = params['dateResolved'];
      }
      if (params['resolved'] !== undefined) {
        this.resolved = params['resolved'] === 'true' || params['resolved'] === true;
      }
      if (params['assignedTo']) {
        this.assignedTo = params['assignedTo'];
      }

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const targetTask = this.task || 'Confirm technical scope and operating window';
    const targetSubject = this.subject || 'Customer specification clarification on monomer residual VOC threshold';
    const targetDesc = this.description || 'Customer end-use application requires residual VOC < 50 ppm, requiring post-polymerization stripping cycle verification.';
    const targetCreated = this.dateCreated || '2026-06-01';
    const targetDue = this.dueDate || '2026-06-15';
    const targetResolvedDate = this.dateResolved || (this.resolved ? '2026-06-14' : null);
    const targetResolved = this.resolved;
    const targetAssigned = this.assignedTo || 'Dr. Sarah Jenkins';

    // Detailed historical revisions for the selected issue
    const selectedRevisions: IssueHistoryItem[] = [
      {
        id: 1,
        task: targetTask,
        subject: targetSubject,
        description: targetDesc,
        dateCreated: targetCreated,
        dueDate: targetDue,
        dateResolved: targetResolvedDate,
        resolved: targetResolved,
        assignedTo: targetAssigned,
        status: targetResolved ? 'Closed' : 'Process',
        remarks: 'Vacuum stripping cycle confirmed at Dahej pilot center; residual VOC monitored below 40 ppm.',
        revision: 'Rev 3 (Current)',
        updatedBy: targetAssigned,
        changeDate: '10-Jun-2026'
      },
      {
        id: 2,
        task: targetTask,
        subject: targetSubject,
        description: targetDesc,
        dateCreated: targetCreated,
        dueDate: '2026-06-10',
        dateResolved: null,
        resolved: false,
        assignedTo: targetAssigned,
        status: 'Progress',
        remarks: 'Headspace GC-MS testing completed; stripping temperature raised to 65 °C to accelerate devolatilization.',
        revision: 'Rev 2',
        updatedBy: 'Mia Chen (Analytical Chemist)',
        changeDate: '06-Jun-2026'
      },
      {
        id: 3,
        task: targetTask,
        subject: targetSubject,
        description: targetDesc,
        dateCreated: targetCreated,
        dueDate: '2026-06-08',
        dateResolved: null,
        resolved: false,
        assignedTo: targetAssigned,
        status: 'Allocated',
        remarks: 'Issue identified during customer technical review; assigned to lead process chemist.',
        revision: 'Rev 1',
        updatedBy: 'Dr. Sarah Jenkins',
        changeDate: '01-Jun-2026'
      }
    ];

    // Project chemical issues records
    const projectIssues: IssueHistoryItem[] = [
      {
        id: 4,
        task: 'Review industrial customer specifications, grade requirements and end-use application criteria',
        subject: 'Operating temperature window conflict with site cooling water limits',
        description: 'Customer specified reaction temp of 85 °C approaches maximum cooling tower return capacity.',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-25',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Ravi Shah',
        status: 'Pending',
        remarks: 'Chilled water heat exchanger sizing under review with engineering team.',
        revision: 'Rev 1',
        updatedBy: 'Ravi Shah',
        changeDate: '05-Jun-2026'
      },
      {
        id: 5,
        task: 'Screen heterogeneous and homogeneous catalyst candidates for selectivity',
        subject: 'Monomer raw material assay variation between supplier lots',
        description: 'Technical grade monomer lot 26-04 shows inhibitor variation affecting reaction induction time.',
        dateCreated: '2026-06-10',
        dueDate: '2026-07-05',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Mia Chen',
        status: 'Process',
        remarks: 'Activated alumina column filtration setup to strip residual inhibitor prior to charging.',
        revision: 'Rev 1',
        updatedBy: 'Mia Chen',
        changeDate: '10-Jun-2026'
      },
      {
        id: 6,
        task: 'Optimize semi-batch feed profile, temperature ramp and agitation speed',
        subject: 'Exothermic heat surge during catalyst dosing',
        description: 'Semi-batch monomer feed rate of 5 mL/min causes exotherm overshoot above isothermal setpoint.',
        dateCreated: '2026-06-15',
        dueDate: '2026-07-12',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Ana Vega',
        status: 'Hold',
        remarks: 'Staggered catalyst dosing protocol deployed to maintain reaction temperature within ± 1 °C.',
        revision: 'Rev 1',
        updatedBy: 'Ana Vega',
        changeDate: '15-Jun-2026'
      },
      {
        id: 7,
        task: 'Develop and validate GC/FID, HPLC and titration assay methods',
        subject: 'Distillation column foaming during solvent recovery',
        description: 'Fractional distillation column experiences vapor liquid entrainment at high reboiler heating rate.',
        dateCreated: '2026-06-20',
        dueDate: '2026-07-20',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Robert Chen',
        status: 'Allocated',
        remarks: 'Optimizing anti-foam dosing and reducing vapor velocity across packing beds.',
        revision: 'Rev 1',
        updatedBy: 'Robert Chen',
        changeDate: '20-Jun-2026'
      },
      {
        id: 8,
        task: 'Measure isothermal heat flow and instantaneous heat generation rates in RC1',
        subject: 'RC1 reaction calorimetry jacket heat transfer limit reached',
        description: 'Heat release rate approaches maximum cooling capacity of pilot reactor jacket.',
        dateCreated: '2026-06-25',
        dueDate: '2026-07-28',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Ravi Shah',
        status: 'Pending',
        remarks: 'Extended feed duration from 120 min to 165 min to distribute heat generation.',
        revision: 'Rev 1',
        updatedBy: 'Ravi Shah',
        changeDate: '25-Jun-2026'
      },
      {
        id: 9,
        task: 'Conduct multi-disciplinary HAZOP on reactor nodes, feed systems and vapor vents',
        subject: 'HAZOP critical action: dual rupture disc and emergency relief sizing',
        description: 'DIERS relief vent calculation for total agitation failure runaway requires emergency vent upgrade.',
        dateCreated: '2026-07-01',
        dueDate: '2026-08-08',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Emily Watson',
        status: 'Process',
        remarks: 'Engineering piping team updated P&ID and nozzle schedule for pilot and commercial reactors.',
        revision: 'Rev 1',
        updatedBy: 'Emily Watson',
        changeDate: '01-Jul-2026'
      },
      {
        id: 10,
        task: 'Assemble IUCLID chemical registration dossier and physicochemical data package',
        subject: 'REACH inquiry query on acute aquatic toxicity endpoint',
        description: 'ECHA technical evaluation requested additional 96h OECD 203 freshwater fish ecotoxicity testing.',
        dateCreated: '2026-07-20',
        dueDate: '2026-09-15',
        dateResolved: '2026-08-25',
        resolved: true,
        assignedTo: 'Jessica Alba',
        status: 'Closed',
        remarks: 'All GLP ecotoxicity data compiled and uploaded to ECHA portal; confirmation received.',
        revision: 'Rev 2 (Closed)',
        updatedBy: 'Jessica Alba',
        changeDate: '25-Aug-2026'
      }
    ];

    const otherFiltered = projectIssues.filter(
      item => item.subject.toLowerCase() !== targetSubject.toLowerCase()
    );

    this.historyRecords = [...selectedRevisions, ...otherFiltered];
  }

  get paginatedRecords(): IssueHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: IssueHistoryItem): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    document.body.style.overflow = 'auto';
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/issues'], {
      queryParams: {
        code: this.projectCode || '2026/CHM/006',
        name: this.projectName || 'Acrylic Emulsion Binder 50% Solids'
      },
      queryParamsHandling: 'merge'
    });
  }
}
