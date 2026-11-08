import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../template-stages-wbs.component';
import { AddWbsTasksComponent } from '../../../../../../projects/project-dashboard/project-stages/project-wbs/project-wbs-tasks/add-wbs-tasks/add-wbs-tasks.component';

export interface TaskItem {
  id?: string | number;
  active?: boolean;
  done: boolean;
  taskName: string;
  taskCode?: string;
  jobCode?: string;
  dueDate: string;
  completedDate: string;
  responsibility?: string;
  department: string;
  role?: string;
  remarks?: string;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<TaskItem>;
}

@Component({
  selector: 'app-template-wbs-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './template-wbs-tasks.component.html',
  styleUrl: './template-wbs-tasks.component.scss',
})
export class TemplateWbsTasksComponent implements OnInit {
  @Input() activity?: WbsActivityItem | null;
  @Input() stageName?: string;
  @Input() stageCode?: string;
  @Input() gateName?: string;
  @Input() gateCode?: string;
  @Input() projectName?: string;
  @Input() projectCode?: string;
  @Output() back = new EventEmitter<any>();

  title: string = 'Assign Tasks';
  pageIndex = 0;
  pageSize = 5;
  source?: string;

  @ViewChild('completionDialog') completionDialog!: TemplateRef<any>;
  activeTaskForDone?: TaskItem;
  selectedCompletionDate: string = '';
  completionDialogRef?: MatDialogRef<any>;

  tasksList: TaskItem[] = [];

  get paginatedTasks(): TaskItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<TemplateWbsTasksComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute,
    @Optional() private router?: Router,
    @Optional() private location?: Location
  ) { }

  ngOnInit(): void {
    this.route?.queryParams.subscribe(params => {
      if (params['activityName'] && !this.activity) {
        this.activity = {
          id: 0,
          activityName: params['activityName'],
          jobCode: params['jobCode'] || '',
          department: params['department'] || '',
          responsibility: '',
          priority: 'High',
          status: true,
          tasks: params['tasks']
        };
      }
      if (params['stageName'] && !this.stageName) this.stageName = params['stageName'];
      if (params['stageCode'] && !this.stageCode) this.stageCode = params['stageCode'];
      if (params['gateName'] && !this.gateName) this.gateName = params['gateName'];
      if (params['gateCode'] && !this.gateCode) this.gateCode = params['gateCode'];
      if (params['projectName'] && !this.projectName) this.projectName = params['projectName'];
      if (params['projectCode'] && !this.projectCode) this.projectCode = params['projectCode'];
      if (params['code'] && !this.projectCode) this.projectCode = params['code'];
      if (params['source']) this.source = params['source'];
    });

    if (this.data?.row && !this.activity) {
      this.activity = this.data.row;
    }

    if (this.activity?.activityName) {
      this.title = `Tasks — ${this.activity.activityName}`;
    } else if (this.data?.title) {
      this.title = this.data.title;
    } else {
      this.title = 'Assign Tasks';
    }

    this.initTasksList();
  }

  private initTasksList(): void {
    if (this.activity?.tasksData && Array.isArray(this.activity.tasksData)) {
      this.tasksList = this.activity.tasksData.map(item => ({ ...item, isEditing: false }));
      return;
    }

    if (this.data?.row?.tasksData && Array.isArray(this.data.row.tasksData)) {
      this.tasksList = this.data.row.tasksData.map((item: any) => ({ ...item, isEditing: false }));
      return;
    }

    let targetCount = 6;
    if (this.activity?.tasks) {
      const parsed = parseInt(String(this.activity.tasks).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: Partial<TaskItem>[] = [
      { taskName: 'Reaction Chemistry Literature & Route Feasibility Screening', taskCode: 'TC-01', jobCode: 'PCRD01', dueDate: '2026-01-18', completedDate: '2026-01-18', responsibility: 'Dr. Priya Raman', department: 'Process Chemistry', active: true, done: true },
      { taskName: 'Process Safety & Reaction Calorimetry Screening Protocol', taskCode: 'TC-02', jobCode: 'PSE01', dueDate: '2026-01-20', completedDate: '2026-01-20', responsibility: 'Rajesh Kumar', department: 'Process Safety', active: true, done: true },
      { taskName: 'Catalyst & Raw Material Scouting Campaign', taskCode: 'TC-03', jobCode: 'PCRD02', dueDate: '2026-01-24', completedDate: '2026-01-23', responsibility: 'Anita Desai', department: 'Process Chemistry', active: true, done: true },
      { taskName: 'Analytical Impurity Profiling & Chromatography Method Validation', taskCode: 'TC-04', jobCode: 'CHRO01', dueDate: '2026-01-28', completedDate: '', responsibility: 'Priya Reddy', department: 'Analytical Development', active: true, done: false },
      { taskName: 'Fractional Distillation Column Internals & Packing Study', taskCode: 'TC-05', jobCode: 'DIST01', dueDate: '2026-02-02', completedDate: '', responsibility: 'Amit Patel', department: 'Chemical Engineering', active: true, done: false },
      { taskName: 'Polymerization Reactor Feed Profile & Kinetic Study', taskCode: 'TC-06', jobCode: 'POLY01', dueDate: '2026-02-05', completedDate: '', responsibility: 'Suresh Naidu', department: 'Process Chemistry', active: true, done: false },
      { taskName: 'Accelerated Product Storage Stability Protocol', taskCode: 'TC-07', jobCode: 'STAB01', dueDate: '2026-02-10', completedDate: '', responsibility: 'Lakshmi Devi', department: 'Quality Control', active: true, done: false },
      { taskName: 'Drum & IBC Packaging Lot Compatibility Assessment', taskCode: 'TC-08', jobCode: 'PKG01', dueDate: '2026-02-15', completedDate: '', responsibility: 'Arun Joseph', department: 'Quality Assurance', active: true, done: false },
      { taskName: 'Pilot Plant Process Hazard Review (HAZOP) Protocol', taskCode: 'TC-09', jobCode: 'PSE01', dueDate: '2026-02-20', completedDate: '', responsibility: 'Rajesh Kumar', department: 'Process Safety', active: true, done: false },
      { taskName: 'Global REACH / TSCA Chemical Registration Dossier Filing', taskCode: 'TC-10', jobCode: 'RA01', dueDate: '2026-02-25', completedDate: '', responsibility: 'Deepa Nair', department: 'Regulatory Affairs', active: true, done: false }
    ];

    this.tasksList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      const taskNum = String(i + 1).padStart(2, '0');
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        taskName: template.taskName || `Task ${i + 1}`,
        taskCode: template.taskCode || `TC-${taskNum}`,
        jobCode: template.jobCode || (this.activity?.jobCode || `JOB${taskNum}`),
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        responsibility: template.responsibility || (this.activity?.responsibility || 'Unassigned'),
        department: template.department || (this.activity?.department || 'Management'),
        role: template.role || 'Scientist',
        remarks: template.remarks || 'Standard task',
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  startEdit(row: TaskItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: TaskItem): void {
    row.isEditing = false;
    row.isNew = false;
    delete row._backup;
  }

  cancelEdit(row: TaskItem): void {
    if (row.isNew) {
      const idx = this.tasksList.indexOf(row);
      if (idx !== -1) {
        this.tasksList.splice(idx, 1);
      }
    } else if (row._backup) {
      Object.assign(row, row._backup);
      row.isEditing = false;
      delete row._backup;
    } else {
      row.isEditing = false;
    }
  }

  deleteTask(row: TaskItem): void {
    const idx = this.tasksList.indexOf(row);
    if (idx !== -1) {
      this.tasksList.splice(idx, 1);
      const totalPages = Math.max(1, Math.ceil(this.tasksList.length / this.pageSize));
      if (this.pageIndex >= totalPages) {
        this.pageIndex = Math.max(0, totalPages - 1);
      }
    }
  }

  save(): void {
    for (const t of this.tasksList) {
      if (t.isEditing) {
        this.saveRow(t);
      }
    }

    const result = {
      tasks: this.tasksList,
      count: this.tasksList.length
    };

    if (this.activity) {
      this.activity.tasksData = this.tasksList;
    }

    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else if (this.back.observed) {
      this.back.emit(result);
    } else {
      this.location?.back();
    }
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.back.observed) {
      this.back.emit();
    } else {
      this.location?.back();
    }
  }

  goBack(): void {
    this.close();
  }

  addTask(): void {
    const dialogRef = this.dialog.open(AddWbsTasksComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const nextId = this.tasksList.length + 1;
        const taskNum = String(nextId).padStart(2, '0');
        const newTask: TaskItem = {
          id: Date.now(),
          active: result.active ?? true,
          done: result.done ?? false,
          taskName: result.taskName ?? '',
          taskCode: result.taskCode || `TC-${taskNum}`,
          jobCode: result.jobCode || (this.activity?.jobCode || `JOB${taskNum}`),
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          responsibility: result.responsibility || (this.activity?.responsibility || 'Unassigned'),
          department: result.department ?? (this.activity?.department || 'Management'),
          role: result.role ?? 'Scientist',
          remarks: result.remarks ?? '',
          isEditing: false
        };
        this.tasksList.unshift(newTask);
        this.pageIndex = 0;
      }
    });
  }

  openDoneDialog(row: TaskItem): void {
    this.activeTaskForDone = row;
    this.selectedCompletionDate = row.completedDate || this.getTodayDateString();
    this.completionDialogRef = this.dialog.open(this.completionDialog, {
      width: '460px',
      maxWidth: '95vw',
      disableClose: false
    });
  }

  saveCompletionDate(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = true;
      this.activeTaskForDone.completedDate = this.selectedCompletionDate || this.getTodayDateString();
    }
    this.closeCompletionDialog();
  }

  markIncomplete(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = false;
      this.activeTaskForDone.completedDate = '';
    }
    this.closeCompletionDialog();
  }

  closeCompletionDialog(): void {
    if (this.completionDialogRef) {
      this.completionDialogRef.close();
    }
    this.completionDialogRef = undefined;
  }

  private getTodayDateString(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
