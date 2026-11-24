import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface TodoHistoryItem {
  id?: number;
  subject: string;
  description: string;
  assignedTo: string;
  dateCreated: string;
  dueDate: string;
  group: string;
  department: string;
  role?: string;
  site?: string;
  // Timeline pop data
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualDuration?: string;
  actualHours?: number;
  effort?: number;
  status?: string;
}

@Component({
  selector: 'app-project-todo-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-todo-history.component.html',
  styleUrl: './project-todo-history.component.scss',
})
export class ProjectTodoHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  subject: string = 'To Do';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: TodoHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: TodoHistoryItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      }
      if (params['subject']) {
        this.subject = params['subject'];
      }
      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const taskSubject = this.subject && this.subject !== 'To Do' ? this.subject : 'Review Industrial Customer Specification Sheets';

    this.historyRecords = [
      {
        id: 1,
        subject: taskSubject,
        description: 'Revised execution protocol and verified RC1 reaction calorimeter baseline at Dahej pilot center.',
        assignedTo: 'Dr. Sarah Jenkins',
        dateCreated: '2026-06-10',
        dueDate: '2026-07-02',
        group: 'Process Chemistry',
        department: 'Process Chemistry',
        role: 'Process Chemist',
        site: 'R&D Center – Dahej',
        planStart: '2026-06-22',
        planEnd: '2026-07-02',
        actualStart: '2026-06-22',
        actualEnd: '2026-07-03',
        eta: '2026-07-02',
        actualHours: 50,
        effort: 55,
        status: 'In Process'
      },
      {
        id: 2,
        subject: taskSubject,
        description: 'Updated target due date based on technical grade monomer feedstock delivery confirmation.',
        assignedTo: 'Dr. Sarah Jenkins',
        dateCreated: '2026-06-08',
        dueDate: '2026-06-28',
        group: 'Process Chemistry',
        department: 'Process Chemistry',
        role: 'Process Chemist',
        site: 'R&D Center – Dahej',
        planStart: '2026-06-20',
        planEnd: '2026-06-28',
        actualStart: '2026-06-20',
        actualEnd: '',
        eta: '2026-06-28',
        actualHours: 35,
        effort: 45,
        status: 'In Process'
      },
      {
        id: 3,
        subject: taskSubject,
        description: 'Assigned secondary analytical review chemist and aligned with reaction calorimetry requirements.',
        assignedTo: 'Ravi Shah',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-25',
        group: 'Process Safety Group',
        department: 'Process Safety & EHS',
        role: 'Process Safety Engineer',
        site: 'R&D Center – Panoli',
        planStart: '2026-06-15',
        planEnd: '2026-06-25',
        actualStart: '2026-06-16',
        actualEnd: '',
        eta: '2026-06-25',
        actualHours: 25,
        effort: 40,
        status: 'Pending'
      },
      {
        id: 4,
        subject: taskSubject,
        description: 'Initial creation of todo task following Stage 1 Opportunity Identification sign-off.',
        assignedTo: 'Diego Ruiz',
        dateCreated: '2026-06-01',
        dueDate: '2026-06-20',
        group: 'Process Chemistry',
        department: 'Process Chemistry',
        role: 'Process Chemist',
        site: 'R&D Center – Dahej',
        planStart: '2026-06-10',
        planEnd: '2026-06-20',
        actualStart: '2026-06-10',
        actualEnd: '2026-06-20',
        eta: '2026-06-20',
        actualHours: 30,
        effort: 30,
        status: 'Completed'
      }
    ];
  }

  get paginatedRecords(): TodoHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: TodoHistoryItem): void {
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
    this.router.navigate(['/projects/dashboard/todo'], {
      queryParamsHandling: 'merge'
    });
  }
}
