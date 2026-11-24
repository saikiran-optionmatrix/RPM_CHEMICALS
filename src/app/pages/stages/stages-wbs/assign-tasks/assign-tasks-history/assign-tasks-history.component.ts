import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  slNo: string = '';
  menuIndex: number = 0;
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: AssignTaskHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['taskName']) this.taskName = params['taskName'];
      if (params['taskCode']) this.taskCode = params['taskCode'];
      if (params['jobCode']) this.jobCode = params['jobCode'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['menuIndex'] !== undefined) this.menuIndex = Number(params['menuIndex']) || 0;
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curTaskName = this.taskName || 'API Solubility and Stability Specification';
    const curTaskCode = this.taskCode || 'TC-101';
    const curJobCode = this.jobCode || 'RND-01';
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
        taskName: 'Finished Product Dissolution Profile Criteria',
        taskCode: 'TC-102',
        jobCode: 'RND-02',
        revision: 'Rev 2',
        changedDate: '2024-05-19 16:40',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 102,
        taskName: 'Finished Product Dissolution Profile Criteria - Initial Study',
        taskCode: 'TC-102',
        jobCode: 'RND-01',
        revision: 'Rev 1',
        changedDate: '2024-05-01 10:30',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 103,
        taskName: 'Reference Listed Drug Characterization Protocol',
        taskCode: 'TC-103',
        jobCode: 'RND-03',
        revision: 'Rev 3',
        changedDate: '2024-05-15 09:20',
        changedBy: 'Michael Chang'
      },
      {
        id: 104,
        taskName: 'Analytical Method Development for Impurity Profiling',
        taskCode: 'TC-104',
        jobCode: 'QA-01',
        revision: 'Rev 2',
        changedDate: '2024-05-10 14:15',
        changedBy: 'Emily Watson'
      },
      {
        id: 105,
        taskName: 'Excipient Compatibility Study Design',
        taskCode: 'TC-105',
        jobCode: 'FORM1',
        revision: 'Rev 1',
        changedDate: '2024-04-28 11:00',
        changedBy: 'Dr. Robert Vance'
      },
      {
        id: 106,
        taskName: 'Formulation Prototype Batch Manufacturing Protocol',
        taskCode: 'TC-106',
        jobCode: 'PROC1',
        revision: 'Rev 2',
        changedDate: '2024-04-22 15:30',
        changedBy: 'David Miller'
      },
      {
        id: 107,
        taskName: 'Stability Protocol Formulation for Accelerated Testing',
        taskCode: 'TC-107',
        jobCode: 'RND-01',
        revision: 'Rev 1',
        changedDate: '2024-04-18 13:45',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 108,
        taskName: 'Container Closure System Evaluation Report',
        taskCode: 'TC-108',
        jobCode: 'QA-01',
        revision: 'Rev 1',
        changedDate: '2024-04-12 17:00',
        changedBy: 'Emily Watson'
      },
      {
        id: 109,
        taskName: 'Pre-formulation Assessment and Permeability Screening',
        taskCode: 'TC-109',
        jobCode: 'BC01',
        revision: 'Rev 2',
        changedDate: '2024-04-08 10:15',
        changedBy: 'Michael Chang'
      },
      {
        id: 110,
        taskName: 'Bioequivalence Study Draft Design',
        taskCode: 'TC-110',
        jobCode: 'CLIN-01',
        revision: 'Rev 1',
        changedDate: '2024-03-30 16:50',
        changedBy: 'Dr. Robert Vance'
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
    if (this.activityName) {
      this.router.navigate(['/stages/wbs/tasks'], {
        queryParams: {
          activityName: this.activityName,
          activityCode: this.activityCode,
          jobCode: this.jobCode,
          slNo: this.slNo,
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Case',
          gateCode: this.gateCode || 'Gate 1',
          menuIndex: this.menuIndex
        }
      });
    } else {
      this.router.navigate(['/stages/wbs'], {
        queryParams: {
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Case',
          gateCode: this.gateCode || 'Gate 1',
          menuIndex: this.menuIndex
        }
      });
    }
  }
}
