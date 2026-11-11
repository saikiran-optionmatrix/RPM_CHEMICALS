import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface AssignTaskHistoryItem {
  id?: number | string;
  taskName: string;
  taskCode: string;
  jobCode: string;
  revision?: string;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-assign-tasks-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './assign-tasks-history.component.html',
  styleUrl: './assign-tasks-history.component.scss',
})
export class AssignTasksHistoryComponent implements OnInit {
  taskName: string = '';
  taskCode: string = '';
  jobCode: string = '';

  activityName: string = '';
  activityCode: string = '';
  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: AssignTaskHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['taskName']) this.taskName = params['taskName'];
      if (params['taskCode']) this.taskCode = params['taskCode'];
      if (params['jobCode']) this.jobCode = params['jobCode'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curTaskName = this.taskName || 'Review industrial application demand, customer specifications and market opportunities';
    const curTaskCode = this.taskCode || 'CHM-T001';
    const curJobCode = this.jobCode || 'BD01';
    const count = this.historyCount || 3;

    const baseDates = [
      '2024-05-18 14:30',
      '2024-05-02 11:15',
      '2024-04-19 09:45',
      '2024-04-05 16:20',
      '2024-03-22 10:10',
      '2024-03-10 13:00'
    ];

    const users = [
      'Dr. Robert Vance',
      'Sarah Jenkins',
      'Michael Chang',
      'Emily Watson',
      'David Miller'
    ];

    const taskNameVariations = [
      curTaskName,
      `${curTaskName} - Initial Formulation Draft`,
      `${curTaskName} - Preliminary Specification Scope`,
      `${curTaskName} - Feasibility Outline`,
      `${curTaskName} - Baseline Proposal`
    ];

    const jobCodeVariations = [
      curJobCode,
      curJobCode === 'RND-01' ? 'RND-02' : 'RND-01',
      curJobCode === 'QA-01' ? 'RND-01' : 'QA-01',
      'BC01',
      'ACT1'
    ];

    const selectedRevisions: AssignTaskHistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      const revNum = count - i;
      selectedRevisions.push({
        id: i + 1,
        taskName: i === 0 ? curTaskName : taskNameVariations[i % taskNameVariations.length],
        taskCode: curTaskCode,
        jobCode: i === 0 ? curJobCode : jobCodeVariations[i % jobCodeVariations.length],
        revision: `Rev ${revNum}`,
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Additional catalog tasks history records for reference and completeness
    const otherTasksCatalog: AssignTaskHistoryItem[] = [
      {
        id: 101,
        taskName: 'Review industrial application demand, customer specifications and market opportunities',
        taskCode: 'CHM-T001',
        jobCode: 'BD01',
        revision: 'Rev 3',
        changedDate: '2024-05-19 16:40',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 102,
        taskName: 'Benchmark competing chemical grades, suppliers and production technologies',
        taskCode: 'CHM-T002',
        jobCode: 'BD01',
        revision: 'Rev 2',
        changedDate: '2024-05-01 10:30',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 103,
        taskName: 'Define target product profile, purity, concentration and performance attributes',
        taskCode: 'CHM-T003',
        jobCode: 'RND01',
        revision: 'Rev 3',
        changedDate: '2024-05-15 09:20',
        changedBy: 'Dr. Priya Raman'
      },
      {
        id: 104,
        taskName: 'Prepare preliminary business case, project economics and opportunity assessment',
        taskCode: 'CHM-T004',
        jobCode: 'PM01',
        revision: 'Rev 2',
        changedDate: '2024-05-10 14:15',
        changedBy: 'Anita Desai'
      },
      {
        id: 105,
        taskName: 'Screen reaction chemistry, formulation options and product feasibility',
        taskCode: 'CHM-T005',
        jobCode: 'RND01',
        revision: 'Rev 1',
        changedDate: '2024-04-28 11:00',
        changedBy: 'Dr. Priya Raman'
      },
      {
        id: 106,
        taskName: 'Assess raw material availability, critical reagent supply and vendor capability',
        taskCode: 'CHM-T006',
        jobCode: 'RM01',
        revision: 'Rev 2',
        changedDate: '2024-04-22 15:30',
        changedBy: 'Priya Reddy'
      },
      {
        id: 107,
        taskName: 'Conduct preliminary process hazard, environmental and regulatory screening',
        taskCode: 'CHM-T007',
        jobCode: 'PSE01',
        revision: 'Rev 1',
        changedDate: '2024-04-18 13:45',
        changedBy: 'Suresh Naidu'
      },
      {
        id: 108,
        taskName: 'Prepare feasibility report, target specifications and Gate 1 submission',
        taskCode: 'CHM-T008',
        jobCode: 'QA03',
        revision: 'Rev 1',
        changedDate: '2024-04-12 17:00',
        changedBy: 'Amit Patel'
      },
      {
        id: 109,
        taskName: 'Develop candidate synthesis routes and reaction pathway hypotheses',
        taskCode: 'CHM-T009',
        jobCode: 'RND01',
        revision: 'Rev 2',
        changedDate: '2024-04-08 10:15',
        changedBy: 'Dr. Priya Raman'
      },
      {
        id: 110,
        taskName: 'Conduct laboratory-scale reaction and catalyst screening experiments',
        taskCode: 'CHM-T010',
        jobCode: 'REAC01',
        revision: 'Rev 1',
        changedDate: '2024-03-30 16:50',
        changedBy: 'Priya Reddy'
      },
      {
        id: 111,
        taskName: 'Characterize intermediates, impurities and product composition using GC/HPLC and spectroscopy',
        taskCode: 'CHM-T011',
        jobCode: 'CHRO01',
        revision: 'Rev 2',
        changedDate: '2024-03-24 11:20',
        changedBy: 'Anita Desai'
      },
      {
        id: 112,
        taskName: 'Document route scouting results, material balance and preliminary yield assessment',
        taskCode: 'CHM-T012',
        jobCode: 'QC02',
        revision: 'Rev 1',
        changedDate: '2024-03-18 14:10',
        changedBy: 'Rajesh Kumar'
      }
    ];

    const filteredCatalog = otherTasksCatalog.filter(
      t => t.taskCode.toLowerCase() !== curTaskCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): AssignTaskHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    if (this.stageCode || this.stageName) {
      this.router.navigate(['/stages/wbs'], {
        queryParams: {
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Case',
          gateCode: this.gateCode || 'Gate 1'
        }
      });
    } else {
      this.location.back();
    }
  }
}
