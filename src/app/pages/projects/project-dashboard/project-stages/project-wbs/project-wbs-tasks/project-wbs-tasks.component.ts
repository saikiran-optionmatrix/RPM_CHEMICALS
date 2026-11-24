import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../project-wbs.component';
import { AddWbsTasksComponent } from './add-wbs-tasks/add-wbs-tasks.component';
import { DocumentsPopComponent } from '../../../../../../common/shared/documents-pop/documents-pop.component';
import { getTasksForWbs, getTaskItemsForWbs, getTaskDetails } from '../../../../../stages/stage-wbs-tasks.data';

export interface TaskItem {
  id?: string | number;
  active?: boolean;
  done: boolean;
  approved?: boolean;
  approvedDate?: string;
  taskName: string;
  taskCode?: string;
  reference?: string;
  section?: string;
  jobCode?: string;
  startDate?: string;
  dueDate: string;
  completedDate: string;
  responsibility?: string;
  department: string;
  priority?: 'High' | 'Medium' | 'Low';
  role?: string;
  remarks?: string;
  planEffort?: number | string;
  actualEffort?: number | string;
  allocations?: any[];
  historyCount?: number;
  documentsCount?: number;
  todoCount?: string;
  issuesCount?: string;
  resourcesCount?: string;
  updatedDate?: string;
  updatedBy?: string;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<TaskItem>;
}

@Component({
  selector: 'app-project-wbs-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-wbs-tasks.component.html',
  styleUrl: './project-wbs-tasks.component.scss',
})
export class ProjectWbsTasksComponent implements OnInit {
  @Input() activity?: WbsActivityItem | null;
  @Input() stageName?: string;
  @Input() stageCode?: string;
  @Input() gateName?: string;
  @Input() gateCode?: string;
  @Input() projectName?: string;
  @Input() projectCode?: string;
  @Output() back = new EventEmitter<any>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  title: string = 'Assign Tasks';
  pageIndex = 0;
  pageSize = 5;
  source?: string;

  @ViewChild('completionDialog') completionDialog!: TemplateRef<any>;
  activeTaskForDone?: TaskItem;
  selectedCompletionDate: string = '';
  completionDialogRef?: MatDialogRef<any>;

  tasksList: TaskItem[] = [];

  readonly historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];
  readonly documentsSequence: number[] = [2, 4, 1, 3, 5, 2, 3, 1, 4, 2, 5, 3];
  readonly todoSequence: string[] = ['2/4', '1/3', '3/5', '4/6', '1/2', '0/3', '2/2', '3/4'];
  readonly issuesSequence: string[] = ['1/2', '0/1', '2/3', '1/4', '0/2', '3/3', '1/1', '0/4'];
  readonly resourcesSequence: string[] = ['3/5', '2/4', '4/4', '1/3', '2/2', '5/6', '3/3', '2/5'];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  getTodoCount(index: number): string {
    return this.todoSequence[index % this.todoSequence.length];
  }

  getIssuesCount(index: number): string {
    return this.issuesSequence[index % this.issuesSequence.length];
  }

  getResourcesCount(index: number): string {
    return this.resourcesSequence[index % this.resourcesSequence.length];
  }

  get paginatedTasks(): TaskItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<ProjectWbsTasksComponent>,
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
          slNo: params['slNo'] || '',
          activityName: params['activityName'],
          jobCode: params['jobCode'] || '',
          department: params['department'] || '',
          responsibility: '',
          priority: 'High',
          status: true,
          tasks: params['tasks']
        };
      } else if (this.activity && params['slNo'] && !this.activity.slNo) {
        this.activity.slNo = params['slNo'];
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
      this.tasksList = this.activity.tasksData.map((item, index) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        todoCount: item.todoCount || this.getTodoCount(index),
        issuesCount: item.issuesCount || this.getIssuesCount(index),
        resourcesCount: item.resourcesCount || this.getResourcesCount(index),
        isEditing: false
      }));
      return;
    }

    if (this.data?.row?.tasksData && Array.isArray(this.data.row.tasksData)) {
      this.tasksList = this.data.row.tasksData.map((item: any, index: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        todoCount: item.todoCount || this.getTodoCount(index),
        issuesCount: item.issuesCount || this.getIssuesCount(index),
        resourcesCount: item.resourcesCount || this.getResourcesCount(index),
        isEditing: false
      }));
      return;
    }

    const wbsId = this.activity?.slNo || this.data?.row?.slNo || this.route?.snapshot.queryParamMap.get('slNo') || '';
    const actName = this.activity?.activityName || this.activity?.task || this.data?.row?.activityName || this.data?.row?.taskName || this.data?.row?.task || this.route?.snapshot.queryParamMap.get('activityName') || '';

    const storageKeys = [
      wbsId ? 'project_wbs_tasks_' + wbsId : '',
      wbsId ? 'stages_tasks_' + wbsId : '',
      actName ? 'project_wbs_tasks_' + actName : '',
      actName ? 'stages_tasks_' + actName : ''
    ].filter(Boolean);

    const savedMap = new Map<string, any>();
    for (const key of storageKeys) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((p: any) => {
              if (p && p.taskName) {
                savedMap.set(p.taskName.trim().toLowerCase(), p);
              }
            });
            if (savedMap.size > 0) break;
          }
        } catch (e) { }
      }
    }

    const taskItems = getTaskItemsForWbs(wbsId, actName);
    const predefined = taskItems ? taskItems.map(t => t.task) : getTasksForWbs(wbsId, actName);
    if (predefined && predefined.length > 0) {
      this.tasksList = predefined.map((taskName: string, i: number) => {
        const itemInfo = taskItems && taskItems[i] ? taskItems[i] : undefined;
        const saved = savedMap.get(taskName.trim().toLowerCase());
        if (saved) {
          return {
            ...saved,
            taskName: taskName,
            taskCode: saved.taskCode || itemInfo?.taskId,
            historyCount: saved.historyCount || this.getHistoryCount(i),
            documentsCount: saved.documentsCount || this.getDocumentsCount(i),
            todoCount: saved.todoCount || this.getTodoCount(i),
            issuesCount: saved.issuesCount || this.getIssuesCount(i),
            resourcesCount: saved.resourcesCount || this.getResourcesCount(i),
            isEditing: false
          };
        }
        const details = getTaskDetails(taskName, i, wbsId, this.activity?.jobCode, this.activity?.jobCode, itemInfo?.taskId);
        return {
          id: Date.now() + i,
          active: true,
          done: i < 2,
          approved: i < 2,
          approvedDate: i < 2 ? '2026-03-02' : '',
          taskName: taskName,
          taskCode: itemInfo?.taskId || details.taskCode,
          jobCode: details.jobCode || this.activity?.jobCode || 'JOB-01',
          department: details.department,
          role: details.role,
          dueDate: details.dueDate,
          completedDate: i < 2 ? '2026-03-01' : '',
          responsibility: this.activity?.responsibility || 'Dr. Sarah Connor',
          priority: (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
          remarks: 'Atomic task / deliverable verified',
          historyCount: this.getHistoryCount(i),
          documentsCount: this.getDocumentsCount(i),
          todoCount: this.getTodoCount(i),
          issuesCount: this.getIssuesCount(i),
          resourcesCount: this.getResourcesCount(i),
          updatedDate: '2026-03-15',
          updatedBy: this.activity?.responsibility || 'Dr. Sarah Connor',
          isEditing: false
        };
      });
      this.persistTasks();
      return;
    }

    // Generate items matching the count in fractional tasks (e.g. 6 from '6/16')
    let targetCount = 6;
    if (this.activity?.tasks) {
      const parsed = parseInt(String(this.activity.tasks).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: Partial<TaskItem>[] = [
      { taskName: 'Raw material specification & supplier CoA review', taskCode: 'TC-01', reference: 'REF-CHM-01', section: 'Chemical Process', jobCode: 'JOB01', startDate: '2026-01-10', dueDate: '2026-01-18', completedDate: '2026-01-18', approvedDate: '2026-01-19', responsibility: 'Dr. Sarah Connor', department: 'Chemical R&D', priority: 'High', active: true, done: true, approved: true },
      { taskName: 'Monomer & solvent procurement requisition filing', taskCode: 'TC-02', reference: 'REF-SC-02', section: 'Procurement', jobCode: 'JOB02', startDate: '2026-01-12', dueDate: '2026-01-20', completedDate: '2026-01-20', approvedDate: '2026-01-21', responsibility: 'James Miller', department: 'Supply Chain', priority: 'Medium', active: true, done: true, approved: true },
      { taskName: 'Benchmark competitor grade physical-chemical testing', taskCode: 'TC-03', reference: 'REF-QC-03', section: 'Analytical Characterization', jobCode: 'JOB03', startDate: '2026-01-15', dueDate: '2026-01-24', completedDate: '2026-01-23', approvedDate: '2026-01-24', responsibility: 'Emily Watson', department: 'Quality Control', priority: 'High', active: true, done: true, approved: true },
      { taskName: 'Gas Chromatography (GC/FID) method setup', taskCode: 'TC-04', reference: 'REF-AN-04', section: 'Analytical Characterization', jobCode: 'JOB04', startDate: '2026-01-20', dueDate: '2026-01-28', completedDate: '', approvedDate: '', responsibility: 'Dr. Sarah Connor', department: 'Analytical', priority: 'High', active: true, done: false, approved: false },
      { taskName: 'Lab reactor synthesis trial & recipe execution', taskCode: 'TC-05', reference: 'REF-CR-05', section: 'Reaction Chemistry', jobCode: 'JOB05', startDate: '2026-01-22', dueDate: '2026-02-02', completedDate: '', approvedDate: '', responsibility: 'Michael Scott', department: 'Chemical R&D', priority: 'Medium', active: true, done: false, approved: false },
      { taskName: 'Exotherm screening via differential scanning calorimetry', taskCode: 'TC-06', reference: 'REF-PS-06', section: 'Thermal Safety', jobCode: 'JOB06', startDate: '2026-01-26', dueDate: '2026-02-05', completedDate: '', approvedDate: '', responsibility: 'Robert Chen', department: 'Process Safety', priority: 'High', active: true, done: false, approved: false },
      { taskName: 'Regulatory inventory classification (REACH / TSCA)', taskCode: 'TC-07', reference: 'REF-RA-07', section: 'Regulatory Affairs', jobCode: 'JOB07', startDate: '2026-02-01', dueDate: '2026-02-10', completedDate: '', approvedDate: '', responsibility: 'Jessica Alba', department: 'Regulatory', priority: 'High', active: true, done: false, approved: false },
      { taskName: 'Distillation and solvent recovery efficiency test', taskCode: 'TC-08', reference: 'REF-PT-08', section: 'Process Technology', jobCode: 'JOB08', startDate: '2026-02-05', dueDate: '2026-02-15', completedDate: '', approvedDate: '', responsibility: 'David Kim', department: 'Process Technology', priority: 'Medium', active: true, done: false, approved: false },
      { taskName: 'Effluent wastewater COD/BOD baseline determination', taskCode: 'TC-09', reference: 'REF-ETP-09', section: 'ETP / Waste Management', jobCode: 'JOB09', startDate: '2026-02-08', dueDate: '2026-02-20', completedDate: '', approvedDate: '', responsibility: 'Dr. Sarah Jenkins', department: 'Process Safety & ETP', priority: 'High', active: true, done: false, approved: false },
      { taskName: 'Process optimization design of experiments (DoE)', taskCode: 'TC-12', reference: 'REF-CR-12', section: 'Reaction Chemistry', jobCode: 'JOB12', startDate: '2026-02-22', dueDate: '2026-03-05', completedDate: '', approvedDate: '', responsibility: 'Robert Chen', department: 'Chemical R&D', priority: 'Medium', active: true, done: false, approved: false },
      { taskName: 'Pilot plant reactor equipment fit & agitation check', taskCode: 'TC-13', reference: 'REF-PL-13', section: 'Pilot Plant Operations', jobCode: 'JOB13', startDate: '2026-02-26', dueDate: '2026-03-10', completedDate: '', approvedDate: '', responsibility: 'David Kim', department: 'Pilot Plant', priority: 'Medium', active: true, done: false, approved: false },
      { taskName: 'Impurity profiling against benchmark chemical standard', taskCode: 'TC-14', reference: 'REF-AN-14', section: 'Analytical Characterization', jobCode: 'JOB14', startDate: '2026-03-02', dueDate: '2026-03-15', completedDate: '', approvedDate: '', responsibility: 'Dr. Sarah Connor', department: 'Analytical', priority: 'High', active: true, done: false, approved: false },
      { taskName: 'Final stage gate technical dossier QA sign-off', taskCode: 'TC-15', reference: 'REF-QA-15', section: 'Quality Assurance', jobCode: 'JOB15', startDate: '2026-03-08', dueDate: '2026-03-20', completedDate: '', approvedDate: '', responsibility: 'Emily Watson', department: 'Quality Assurance', priority: 'High', active: true, done: false, approved: false }
    ];

    this.tasksList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      const taskNum = String(i + 1).padStart(2, '0');
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        approved: template.approved ?? (i < 3),
        approvedDate: template.approvedDate || (i < 3 ? `2026-02-${String(10 + (i % 18)).padStart(2, '0')}` : ''),
        taskName: template.taskName || `Task ${i + 1}`,
        taskCode: template.taskCode || `TC-${taskNum}`,
        reference: template.reference || `REF-WBS-${taskNum}`,
        section: template.section || 'Process Chemistry',
        jobCode: template.jobCode || (this.activity?.jobCode || `JOB${taskNum}`),
        startDate: template.startDate || `2026-02-${String(1 + (i % 10)).padStart(2, '0')}`,
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        responsibility: template.responsibility || (this.activity?.responsibility || 'Unassigned'),
        department: template.department || (this.activity?.department || 'Management'),
        priority: template.priority || (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'),
        role: template.role || 'Scientist',
        remarks: template.remarks || 'Standard task',
        historyCount: this.getHistoryCount(i),
        documentsCount: this.getDocumentsCount(i),
        todoCount: this.getTodoCount(i),
        issuesCount: this.getIssuesCount(i),
        resourcesCount: this.getResourcesCount(i),
        updatedDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        updatedBy: template.responsibility || (this.activity?.responsibility || 'Dr. Sarah Jenkins'),
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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


  startEdit(row: TaskItem): void {
    this.editTask(row);
  }

  editTask(row: TaskItem): void {
    const dialogRef = this.dialog.open(AddWbsTasksComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        ...row,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        row.active = result.active ?? row.active;
        row.done = result.done ?? row.done;
        row.taskName = result.taskName ?? row.taskName;
        row.taskCode = result.taskCode ?? row.taskCode;
        row.reference = result.reference ?? row.reference;
        row.section = result.section ?? row.section;
        row.jobCode = result.jobCode ?? row.jobCode;
        row.startDate = result.startDate ?? row.startDate;
        row.dueDate = result.dueDate ?? row.dueDate;
        row.completedDate = result.completedDate ?? row.completedDate;
        row.approvedDate = result.approvedDate ?? row.approvedDate;
        row.responsibility = result.responsibility ?? row.responsibility;
        row.department = result.department ?? row.department;
        row.priority = result.priority ?? row.priority;
        row.role = result.role ?? row.role;
        row.remarks = result.remarks ?? row.remarks;
        row.planEffort = result.planEffort ?? row.planEffort;
        row.actualEffort = result.actualEffort ?? row.actualEffort;
        row.allocations = result.allocations ?? row.allocations;
        row.updatedDate = new Date().toISOString().split('T')[0];
        row.updatedBy = result.responsibility || row.responsibility || 'Dr. Sarah Jenkins';
        this.persistTasks();
      }
    });
  }

  private persistTasks(): void {
    const wbsId = this.activity?.slNo || this.data?.row?.slNo || this.route?.snapshot.queryParamMap.get('slNo') || '';
    const actName = this.activity?.activityName || this.activity?.task || this.data?.row?.activityName || this.data?.row?.taskName || this.data?.row?.task || this.route?.snapshot.queryParamMap.get('activityName') || '';
    if (wbsId) {
      sessionStorage.setItem('project_wbs_tasks_' + wbsId, JSON.stringify(this.tasksList));
      sessionStorage.setItem('stages_tasks_' + wbsId, JSON.stringify(this.tasksList));
    }
    if (actName) {
      sessionStorage.setItem('project_wbs_tasks_' + actName, JSON.stringify(this.tasksList));
      sessionStorage.setItem('stages_tasks_' + actName, JSON.stringify(this.tasksList));
    }
  }

  saveRow(row: TaskItem): void {
    row.isEditing = false;
    row.isNew = false;
    row.updatedDate = new Date().toISOString().split('T')[0];
    row.updatedBy = row.responsibility || 'Dr. Sarah Jenkins';
    delete row._backup;
    this.persistTasks();
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
      this.persistTasks();
    }
  }

  save(): void {
    for (const t of this.tasksList) {
      if (t.isEditing) {
        this.saveRow(t);
      }
    }

    this.persistTasks();

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
      this.close();
    }
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.back.observed) {
      this.back.emit();
    } else if (this.source === 'debate') {
      this.router?.navigate(['/projects/dashboard/gates/debate/activities'], {
        queryParams: {
          gateCode: this.gateCode || this.route?.snapshot.queryParamMap.get('gateCode'),
          gateName: this.gateName || this.route?.snapshot.queryParamMap.get('gateName'),
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode'),
          role: this.route?.snapshot.queryParamMap.get('role'),
          name: this.route?.snapshot.queryParamMap.get('name')
        }
      });
    } else if (this.source === 'gates' || this.gateCode) {
      this.router?.navigate(['/projects/dashboard/gates/activities'], {
        queryParams: {
          gateCode: this.gateCode || this.route?.snapshot.queryParamMap.get('gateCode'),
          gateName: this.gateName || this.route?.snapshot.queryParamMap.get('gateName'),
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    } else if (this.source === 'activities') {
      this.router?.navigate(['/projects/dashboard/activities'], {
        queryParams: {
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    } else {
      this.router?.navigate(['/projects/dashboard/stages/wbs'], {
        queryParams: {
          stageCode: this.stageCode || this.route?.snapshot.queryParamMap.get('stageCode') || 'S1',
          stageName: this.stageName || this.route?.snapshot.queryParamMap.get('stageName') || 'Business Case',
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    }
  }

  goBack(): void {
    this.close();
  }

  openHistory(row: TaskItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    const currentUrl = this.router?.url || '';
    let targetPath = 'tasks/history';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/tasks/history';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/tasks/history';
    } else {
      targetPath = '/projects/dashboard/stages/wbs/tasks/history';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        jobCode: row.jobCode,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        approvedDate: row.approvedDate || '',
        done: row.done,
        responsibility: row.responsibility,
        department: row.department,
        activityName: this.activity?.activityName || '',
        jobCodeParam: this.activity?.jobCode || '',
        stageName: this.stageName || '',
        stageCode: this.stageCode || '',
        gateName: this.gateName || '',
        gateCode: this.gateCode || '',
        projectName: this.projectName || '',
        projectCode: this.projectCode || '',
        updatedDate: row.updatedDate || '',
        updatedBy: row.updatedBy || '',
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  openTodo(row: TaskItem, index?: number): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    const currentUrl = this.router?.url || '';
    let targetPath = '/projects/dashboard/stages/wbs/tasks/todo';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/tasks/todo';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/tasks/todo';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        reference: row.reference || '',
        jobCode: row.jobCode,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        approvedDate: row.approvedDate || '',
        done: row.done,
        responsibility: row.responsibility,
        department: row.department,
        activityName: this.activity?.activityName || '',
        jobCodeParam: this.activity?.jobCode || '',
        stageName: this.stageName || '',
        stageCode: this.stageCode || '',
        gateName: this.gateName || '',
        gateCode: this.gateCode || '',
        projectName: this.projectName || '',
        projectCode: this.projectCode || '',
        updatedDate: row.updatedDate || '',
        updatedBy: row.updatedBy || '',
        todoCount: row.todoCount || (index !== undefined ? this.getTodoCount(index) : '2/4')
      },
      queryParamsHandling: 'merge'
    });
  }

  openIssues(row: TaskItem, index?: number): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    const currentUrl = this.router?.url || '';
    let targetPath = '/projects/dashboard/stages/wbs/tasks/issues';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/tasks/issues';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/tasks/issues';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        reference: row.reference || '',
        jobCode: row.jobCode,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        approvedDate: row.approvedDate || '',
        done: row.done,
        responsibility: row.responsibility,
        department: row.department,
        activityName: this.activity?.activityName || '',
        jobCodeParam: this.activity?.jobCode || '',
        stageName: this.stageName || '',
        stageCode: this.stageCode || '',
        gateName: this.gateName || '',
        gateCode: this.gateCode || '',
        projectName: this.projectName || '',
        projectCode: this.projectCode || '',
        updatedDate: row.updatedDate || '',
        updatedBy: row.updatedBy || '',
        issuesCount: row.issuesCount || (index !== undefined ? this.getIssuesCount(index) : '1/2')
      },
      queryParamsHandling: 'merge'
    });
  }

  openResources(row: TaskItem, index?: number): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    const currentUrl = this.router?.url || '';
    let targetPath = '/projects/dashboard/stages/wbs/tasks/resources';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/tasks/resources';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/tasks/resources';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        reference: row.reference || '',
        jobCode: row.jobCode,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        approvedDate: row.approvedDate || '',
        done: row.done,
        responsibility: row.responsibility,
        department: row.department,
        activityName: this.activity?.activityName || '',
        jobCodeParam: this.activity?.jobCode || '',
        stageName: this.stageName || '',
        stageCode: this.stageCode || '',
        gateName: this.gateName || '',
        gateCode: this.gateCode || '',
        projectName: this.projectName || '',
        projectCode: this.projectCode || '',
        updatedDate: row.updatedDate || '',
        updatedBy: row.updatedBy || '',
        resourcesCount: row.resourcesCount || (index !== undefined ? this.getResourcesCount(index) : '3/5')
      },
      queryParamsHandling: 'merge'
    });
  }







  addTask(): void {
    const dialogRef = this.dialog.open(AddWbsTasksComponent, {
      width: '1100px',
      maxWidth: '95vw',

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
          approved: result.approved ?? false,
          approvedDate: result.approvedDate ?? '',
          taskName: result.taskName ?? '',
          taskCode: result.taskCode || `TC-${taskNum}`,
          reference: result.reference || `REF-${taskNum}`,
          section: result.section || 'Process Chemistry',
          jobCode: result.jobCode || (this.activity?.jobCode || `JOB${taskNum}`),
          startDate: result.startDate || new Date().toISOString().split('T')[0],
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          responsibility: result.responsibility || (this.activity?.responsibility || 'Unassigned'),
          department: result.department ?? (this.activity?.department || 'Management'),
          priority: result.priority || 'Medium',
          role: result.role ?? 'Scientist',
          remarks: result.remarks ?? '',
          planEffort: result.planEffort ?? '',
          actualEffort: result.actualEffort ?? 0,
          allocations: result.allocations ?? [],
          todoCount: '0/1',
          issuesCount: '0/0',
          resourcesCount: '1/1',
          isEditing: false
        };
        this.tasksList.unshift(newTask);
        this.pageIndex = 0;
        this.persistTasks();
      }
    });
  }

  toggleApproved(row: TaskItem): void {
    row.approved = !row.approved;
    if (row.approved) {
      row.approvedDate = row.approvedDate || this.getTodayDateString();
    } else {
      row.approvedDate = '';
    }
    this.persistTasks();
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
      this.persistTasks();
    }
    this.closeCompletionDialog();
  }

  markIncomplete(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = false;
      this.activeTaskForDone.completedDate = '';
      this.persistTasks();
    }
    this.closeCompletionDialog();
  }

  closeCompletionDialog(): void {
    if (this.completionDialogRef) {
      this.completionDialogRef.close();
      this.completionDialogRef = undefined;
    }
  }

  private getTodayDateString(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  openDocuments(row?: TaskItem): void {
    const taskTitle = row?.taskName ? `Documents — ${row.taskName}` : 'Task Documents';
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: taskTitle
      }
    });
  }
}
