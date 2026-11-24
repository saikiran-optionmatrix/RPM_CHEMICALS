import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface TaskHistoryItem {
  id?: number | string;
  done: boolean;
  taskName: string;
  taskCode: string;
  jobCode: string;
  dueDate: string;
  completedDate: string;
  approvedDate?: string;
  approved?: boolean;
  responsibility: string;
  department: string;
  revision?: string;
  remarks?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-project-wbs-tasks-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-wbs-tasks-history.component.html',
  styleUrl: './project-wbs-tasks-history.component.scss',
})
export class ProjectWbsTasksHistoryComponent implements OnInit {
  taskName: string = '';
  taskCode: string = '';
  jobCode: string = '';
  dueDate: string = '';
  completedDate: string = '';
  approvedDate: string = '';
  done: boolean = false;
  approved: boolean = false;
  responsibility: string = '';
  department: string = '';

  activityName: string = '';
  jobCodeParam: string = '';
  stageName: string = '';
  stageCode: string = '';
  gateName: string = '';
  gateCode: string = '';
  projectName: string = '';
  projectCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  tasksHistory: TaskHistoryItem[] = [];

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
      if (params['dueDate']) this.dueDate = params['dueDate'];
      if (params['completedDate']) this.completedDate = params['completedDate'];
      if (params['approvedDate']) this.approvedDate = params['approvedDate'];
      if (params['approved'] !== undefined) {
        this.approved = params['approved'] === 'true' || params['approved'] === true;
      }
      if (params['done'] !== undefined) {
        this.done = params['done'] === 'true' || params['done'] === true;
      }
      if (params['responsibility']) this.responsibility = params['responsibility'];
      if (params['department']) this.department = params['department'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['jobCodeParam']) this.jobCodeParam = params['jobCodeParam'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['gateName']) this.gateName = params['gateName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['projectName']) this.projectName = params['projectName'];
      if (params['projectCode']) this.projectCode = params['projectCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curTaskName = this.taskName || 'Analytical costing & CRO proposal review';
    const curTaskCode = this.taskCode || 'TC-01';
    const curJobCode = this.jobCode || 'JOB01';
    const curDueDate = this.dueDate || '2026-01-18';
    const curCompletedDate = this.completedDate || (this.done ? '2026-01-18' : '');
    const curApprovedDate = this.approvedDate || (this.done ? '2026-01-19' : '');
    const curDone = this.done;
    const curResp = this.responsibility || 'Dr. Sarah Connor';
    const curDept = this.department || 'Analytical';

    // Revision history for the clicked task
    const selectedRevisions: TaskHistoryItem[] = [
      {
        id: 1,
        taskName: curTaskName,
        taskCode: curTaskCode,
        jobCode: curJobCode,
        dueDate: curDueDate,
        completedDate: curCompletedDate,
        approvedDate: curApprovedDate,
        done: curDone,
        approved: this.approved || curDone,
        responsibility: curResp,
        department: curDept,
        revision: 'Rev 3 (Current)',
        remarks: 'Task verified and signed off by lead analytical scientist.',
        changedDate: '2026-01-18'
      },
      {
        id: 2,
        taskName: curTaskName,
        taskCode: curTaskCode,
        jobCode: curJobCode,
        dueDate: '2026-01-15',
        completedDate: '',
        done: false,
        responsibility: curResp,
        department: curDept,
        revision: 'Rev 2',
        remarks: 'Preliminary proposal received; awaiting legal NDA confirmation.',
        changedDate: '2026-01-12'
      },
      {
        id: 3,
        taskName: curTaskName,
        taskCode: curTaskCode,
        jobCode: curJobCode,
        dueDate: '2026-01-10',
        completedDate: '',
        done: false,
        responsibility: curResp,
        department: curDept,
        revision: 'Rev 1',
        remarks: 'Initial task created and added to activity execution schedule.',
        changedDate: '2026-01-05'
      }
    ];

    // Other task records
    const otherTasks: TaskHistoryItem[] = [
      {
        id: 4,
        taskName: 'Monomer & solvent procurement requisition filing',
        taskCode: 'TC-02',
        jobCode: 'JOB02',
        dueDate: '2026-01-20',
        completedDate: '2026-01-20',
        done: true,
        responsibility: 'James Miller',
        department: 'Supply Chain',
        revision: 'Rev 2',
        remarks: 'Purchase requisition approved by site sourcing head.'
      },
      {
        id: 5,
        taskName: 'Raw material CoA and purity inspection',
        taskCode: 'TC-03',
        jobCode: 'JOB03',
        dueDate: '2026-01-24',
        completedDate: '2026-01-23',
        done: true,
        responsibility: 'Emily Watson',
        department: 'Quality Control',
        revision: 'Rev 1',
        remarks: 'CoA verified and physical integrity checked against technical grade spec.'
      },
      {
        id: 6,
        taskName: 'GC/FID chromatographic purity method setup',
        taskCode: 'TC-04',
        jobCode: 'JOB04',
        dueDate: '2026-01-28',
        completedDate: '',
        done: false,
        responsibility: 'Dr. Sarah Connor',
        department: 'Analytical Development',
        revision: 'Rev 1',
        remarks: 'Column equilibration and baseline calibration ongoing.'
      },
      {
        id: 7,
        taskName: 'Lab reactor 2 L trial batch charge & heating',
        taskCode: 'TC-05',
        jobCode: 'JOB05',
        dueDate: '2026-02-02',
        completedDate: '',
        done: false,
        responsibility: 'Michael Scott',
        department: 'Process Chemistry',
        revision: 'Rev 1',
        remarks: 'Reactor vessel inerted with nitrogen; raw materials charged.'
      },
      {
        id: 8,
        taskName: 'Reaction calorimetry (RC1) heat flow baseline',
        taskCode: 'TC-06',
        jobCode: 'JOB06',
        dueDate: '2026-02-05',
        completedDate: '',
        done: false,
        responsibility: 'Robert Chen',
        department: 'Process Safety',
        revision: 'Rev 1',
        remarks: 'Calorimeter calibration and baseline heat capacity verified.'
      },
      {
        id: 9,
        taskName: 'REACH registration dossier checklist verification',
        taskCode: 'TC-07',
        jobCode: 'JOB07',
        dueDate: '2026-02-10',
        completedDate: '',
        done: false,
        responsibility: 'Jessica Alba',
        department: 'Regulatory Affairs',
        revision: 'Rev 1',
        remarks: 'Checklist drafted per ECHA REACH guidance.'
      },
      {
        id: 10,
        taskName: 'Pilot plant 100 L equipment staging & line inspection',
        taskCode: 'TC-08',
        jobCode: 'JOB08',
        dueDate: '2026-02-15',
        completedDate: '',
        done: false,
        responsibility: 'Dr. Priya Reddy',
        department: 'Pilot Operations',
        revision: 'Rev 1',
        remarks: 'P&ID walk-through completed and pressure relief valve tagged.'
      }
    ];

    const filteredOther = otherTasks.filter(
      t => t.taskName.toLowerCase() !== curTaskName.toLowerCase()
    );

    this.tasksHistory = [...selectedRevisions, ...filteredOther];
  }

  get paginatedTasks(): TaskHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksHistory.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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
}
