import { Component, Inject, OnInit, Optional, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { getTasksForWbs, getTaskItemsForWbs, getTaskDetails } from '../../stage-wbs-tasks.data';
import { getTaskEstimates } from '../../stage-wbs.data';

export interface TaskItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  taskName: string;
  taskCode?: string;
  jobCode?: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  isEditing?: boolean;
  isNew?: boolean;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  _backup?: Partial<TaskItem>;
}

@Component({
  selector: 'app-assign-tasks',
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
  templateUrl: './assign-tasks.component.html',
  styleUrl: './assign-tasks.component.scss',
})
export class AssignTasksComponent implements OnInit {
  private readonly router = inject(Router);

  // Screen Context State
  activityName: string = '';
  activityCode: string = '';
  jobCode: string = '';
  stageCode: string = 'S1';
  stageName: string = 'Business Case';
  gateCode: string = 'Gate 1';
  slNo: string = '';
  menuIndex: number = 0;
  tasksCountParam: string = '';
  title: string = 'Assign Tasks';
  isDialog: boolean = false;

  pageIndex = 0;
  pageSize = 5;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  jobCodeOptions: string[] = [
    'RND-01',
    'RND-02',
    'RND-03',
    'QA-01',
    'REG-01',
    'CLIN-01',
    'BC01',
    'BC02',
    'ACT1',
    'ACT2',
    'FORM1',
    'PROC1'
  ];

  tasksList: TaskItem[] = [];

  get paginatedTasks(): TaskItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    @Optional() private dialogRef?: MatDialogRef<AssignTasksComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isDialog = !!this.dialogRef;

    this.route?.queryParams.subscribe(params => {
      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['jobCode']) {
        this.jobCode = params['jobCode'];
        if (this.jobCode && !this.jobCodeOptions.includes(this.jobCode)) {
          this.jobCodeOptions.unshift(this.jobCode);
        }
      }
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['tasks']) this.tasksCountParam = params['tasks'];
      if (params['menuIndex'] !== undefined) this.menuIndex = Number(params['menuIndex']) || 0;

      if (this.activityName) {
        this.title = `Tasks — ${this.activityName}`;
      }
    });

    if (this.data?.row) {
      if (this.data.row.task) this.activityName = this.data.row.task;
      if (this.data.row.activityCode || this.data.row.taskCode) {
        this.activityCode = this.data.row.activityCode || this.data.row.taskCode;
      }
      if (this.data.row.jobCode) {
        this.jobCode = this.data.row.jobCode;
        if (this.jobCode && !this.jobCodeOptions.includes(this.jobCode)) {
          this.jobCodeOptions.unshift(this.jobCode);
        }
      }
      if (this.data.row.stageCode) this.stageCode = this.data.row.stageCode;
      if (this.data.row.stageName) this.stageName = this.data.row.stageName;
      if (this.data.row.gateCode) this.gateCode = this.data.row.gateCode;
      if (this.data.row.slNo) this.slNo = this.data.row.slNo;
      if (this.activityName) {
        this.title = `Tasks — ${this.activityName}`;
      }
    }

    this.initTasks();
  }

  private initTasks(): void {
    const storageKeys = [
      this.slNo ? 'stages_tasks_' + this.slNo : '',
      this.activityCode ? 'stages_tasks_' + this.activityCode : '',
      this.activityName ? 'stages_tasks_' + this.activityName : ''
    ].filter(Boolean);

    // Lookup atomic tasks based on WBS ID (slNo) or activity name
    const taskItems = getTaskItemsForWbs(this.slNo, this.activityName);
    const wbsTasks = taskItems ? taskItems.map(t => t.task) : getTasksForWbs(this.slNo, this.activityName);

    if (wbsTasks && wbsTasks.length > 0) {
      // Check if any previously saved state exists in sessionStorage to retain user changes (status, remarks, codes, dates)
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

      this.tasksList = wbsTasks.map((taskName: string, i: number) => {
        const itemInfo = taskItems && taskItems[i] ? taskItems[i] : undefined;
        const saved = savedMap.get(taskName.trim().toLowerCase());
        const est = getTaskEstimates(taskName, i, this.slNo);
        if (saved) {
          return {
            ...saved,
            taskName: taskName,
            taskCode: saved.taskCode || itemInfo?.taskId,
            historyCount: saved.historyCount || this.getHistoryCount(i),
            min: saved.min !== undefined && saved.min !== '' && !isNaN(Number(saved.min)) ? Number(saved.min) : est.min,
            max: saved.max !== undefined && saved.max !== '' && !isNaN(Number(saved.max)) ? Number(saved.max) : est.max,
            mean: saved.mean !== undefined && saved.mean !== '' && !isNaN(Number(saved.mean)) ? Number(saved.mean) : est.mean,
            median: saved.median !== undefined && saved.median !== '' && !isNaN(Number(saved.median)) ? Number(saved.median) : est.median,
            isEditing: false
          };
        }
        const details = getTaskDetails(taskName, i, this.slNo, this.activityCode, this.jobCode, itemInfo?.taskId);
        return {
          id: Date.now() + i,
          active: true,
          done: i < 2,
          taskName: taskName,
          taskCode: itemInfo?.taskId || details.taskCode,
          jobCode: details.jobCode,
          department: details.department,
          role: details.role,
          dueDate: details.dueDate,
          completedDate: i < 2 ? '2026-03-01' : '',
          remarks: 'Atomic task / deliverable verified',
          historyCount: this.getHistoryCount(i),
          min: est.min,
          max: est.max,
          mean: est.mean,
          median: est.median,
          isEditing: false
        };
      });

      // Persist the updated WBS tasks list back to sessionStorage
      this.persistTasks();
      return;
    }

    for (const key of storageKeys) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.tasksList = parsed.map((item: any, idx: number) => {
              const est = getTaskEstimates(item.taskName || `Task ${idx + 1}`, idx, this.slNo);
              return {
                ...item,
                historyCount: item.historyCount || this.getHistoryCount(idx),
                min: item.min !== undefined && item.min !== '' && !isNaN(Number(item.min)) ? Number(item.min) : est.min,
                max: item.max !== undefined && item.max !== '' && !isNaN(Number(item.max)) ? Number(item.max) : est.max,
                mean: item.mean !== undefined && item.mean !== '' && !isNaN(Number(item.mean)) ? Number(item.mean) : est.mean,
                median: item.median !== undefined && item.median !== '' && !isNaN(Number(item.median)) ? Number(item.median) : est.median,
                isEditing: false
              };
            });
            return;
          }
        } catch (e) { }
      }
    }

    if (this.data?.row?.tasksData && Array.isArray(this.data.row.tasksData) && this.data.row.tasksData.length > 0) {
      this.tasksList = this.data.row.tasksData.map((item: any, idx: number) => {
        const est = getTaskEstimates(item.taskName || `Task ${idx + 1}`, idx, this.slNo);
        return {
          ...item,
          taskCode: item.taskCode || `TC-10${idx + 1}`,
          jobCode: item.jobCode || this.jobCode || 'RND-01',
          historyCount: item.historyCount || this.getHistoryCount(idx),
          min: item.min !== undefined && item.min !== '' && !isNaN(Number(item.min)) ? Number(item.min) : est.min,
          max: item.max !== undefined && item.max !== '' && !isNaN(Number(item.max)) ? Number(item.max) : est.max,
          mean: item.mean !== undefined && item.mean !== '' && !isNaN(Number(item.mean)) ? Number(item.mean) : est.mean,
          median: item.median !== undefined && item.median !== '' && !isNaN(Number(item.median)) ? Number(item.median) : est.median,
          isEditing: false
        };
      });
      return;
    }

    // Determine target count from params or default
    let targetCount = 3;
    const countStr = this.tasksCountParam || (this.data?.row?.tasks ? String(this.data.row.tasks) : '');
    if (countStr) {
      const parsed = parseInt(countStr.split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) {
        targetCount = parsed;
      }
    }

    const sampleCatalog: Partial<TaskItem>[] = [
      { taskName: 'Raw Material Monomer Assay & CoA Verification', taskCode: 'TC-101', jobCode: 'JOB01', department: 'Chemical R&D', role: 'Lead', dueDate: '2026-01-20', completedDate: '2026-01-19', remarks: 'GC assay verified', active: true, done: true },
      { taskName: 'Laboratory Reactor Recipe & Addition Profile Design', taskCode: 'TC-102', jobCode: 'JOB02', department: 'Process Tech', role: 'Scientist', dueDate: '2026-01-25', completedDate: '2026-01-24', remarks: 'Dosing profile tuned', active: true, done: true },
      { taskName: 'Reaction Calorimetry (RC1) Heat Flow Measurement', taskCode: 'TC-103', jobCode: 'JOB03', department: 'Process Safety', role: 'Lead', dueDate: '2026-02-02', completedDate: '2026-02-01', remarks: 'Exotherm modeled', active: true, done: true },
      { taskName: 'Solvent Recovery Distillation Parameter Scouting', taskCode: 'TC-104', jobCode: 'JOB04', department: 'Process Tech', role: 'Engineer', dueDate: '2026-02-10', completedDate: '2026-02-08', remarks: 'Reflux ratio optimized', active: true, done: true },
      { taskName: 'Gas Chromatography Method Validation for Residual Monomers', taskCode: 'TC-105', jobCode: 'JOB05', department: 'Analytical', role: 'Scientist', dueDate: '2026-02-15', completedDate: '', remarks: 'Detection limit validated', active: true, done: false },
      { taskName: 'Differential Scanning Calorimetry (DSC) Thermal Screening', taskCode: 'TC-106', jobCode: 'JOB06', department: 'Process Safety', role: 'Lead', dueDate: '2026-02-20', completedDate: '', remarks: 'Onset temperature defined', active: true, done: false },
      { taskName: 'Catalyst Recycle & Deactivation Rate Study', taskCode: 'TC-107', jobCode: 'JOB07', department: 'Chemical R&D', role: 'Scientist', dueDate: '2026-02-25', completedDate: '', remarks: 'Selectivity confirmed', active: true, done: false },
      { taskName: 'Basis of Design (BOD) Mass & Energy Balance Verification', taskCode: 'TC-108', jobCode: 'JOB08', department: 'Engineering', role: 'Manager', dueDate: '2026-03-02', completedDate: '', remarks: 'Heat duty calculated', active: true, done: false },
      { taskName: 'Raw Material Lot Clearance & Sampling Execution', taskCode: 'TC-109', jobCode: 'JOB09', department: 'Quality Control', role: 'Analyst', dueDate: '2026-03-08', completedDate: '', remarks: 'Lot released', active: true, done: false },
      { taskName: 'HAZOP Node 1 & 2 Reactor Overpressure Review', taskCode: 'TC-110', jobCode: 'JOB10', department: 'Process Safety', role: 'Lead', dueDate: '2026-03-12', completedDate: '', remarks: 'Mitigations signed off', active: true, done: false },
      { taskName: 'Effluent Treatment (ETP) Neutralization & COD Trial', taskCode: 'TC-111', jobCode: 'JOB11', department: 'ETP / EHS', role: 'Reviewer', dueDate: '2026-03-18', completedDate: '', remarks: 'Discharge criteria met', active: true, done: false },
      { taskName: 'REACH / TSCA Registration Dossier Technical Compilation', taskCode: 'TC-112', jobCode: 'JOB12', department: 'Regulatory', role: 'Lead', dueDate: '2026-03-22', completedDate: '', remarks: 'IUCLID entry prepared', active: true, done: false },
      { taskName: 'Pilot Plant 100 L Scale-Up Trial Execution', taskCode: 'TC-113', jobCode: 'JOB13', department: 'Operations', role: 'Manager', dueDate: '2026-03-28', completedDate: '', remarks: 'Trial completed', active: true, done: false }
    ];

    this.tasksList = Array.from({ length: targetCount }, (_, i) => {
      const template = sampleCatalog[i % sampleCatalog.length];
      const taskNum = String(101 + i);
      const taskName = template.taskName || `Task ${i + 1}`;
      const est = getTaskEstimates(taskName, i, this.slNo);
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 2),
        taskName: taskName,
        taskCode: template.taskCode || `TC-${taskNum}`,
        jobCode: template.jobCode || this.jobCode || (this.jobCodeOptions[i % this.jobCodeOptions.length]),
        department: template.department || 'Analytical',
        role: template.role || 'Scientist',
        dueDate: template.dueDate || '2024-06-30',
        completedDate: template.completedDate || '',
        remarks: template.remarks || '',
        historyCount: this.getHistoryCount(i),
        min: est.min,
        max: est.max,
        mean: est.mean,
        median: est.median,
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEstimateChange(row: TaskItem): void {
    if (row.min !== undefined && row.max !== undefined && row.min !== null && row.max !== null) {
      const minVal = Number(row.min);
      const maxVal = Number(row.max);
      if (!isNaN(minVal) && !isNaN(maxVal)) {
        row.mean = Number(((minVal + maxVal) / 2).toFixed(2));
        row.median = Number(((minVal + maxVal) / 2).toFixed(2));
      }
    }
  }

  addTask(): void {
    if (this.jobCode && !this.jobCodeOptions.includes(this.jobCode)) {
      this.jobCodeOptions.unshift(this.jobCode);
    }
    const nextNum = this.tasksList.length + 1;
    const est = getTaskEstimates(`Task ${nextNum}`, this.tasksList.length, this.slNo);
    const newTask: TaskItem = {
      active: true,
      done: false,
      taskName: '',
      taskCode: '',
      jobCode: this.jobCode || this.jobCodeOptions[0] || 'RND-01',
      department: '',
      role: '',
      dueDate: '',
      completedDate: '',
      remarks: '',
      historyCount: 1,
      min: est.min,
      max: est.max,
      mean: est.mean,
      median: est.median,
      isEditing: true,
      isNew: true
    };
    this.pageIndex = 0;
    this.tasksList.unshift(newTask);
  }

  startEdit(row: TaskItem): void {
    if (row.jobCode && !this.jobCodeOptions.includes(row.jobCode)) {
      this.jobCodeOptions.push(row.jobCode);
    }
    row._backup = { ...row };
    row.isEditing = true;
  }

  private persistTasks(): void {
    const keys = [
      this.slNo ? 'stages_tasks_' + this.slNo : '',
      this.activityCode ? 'stages_tasks_' + this.activityCode : '',
      this.activityName ? 'stages_tasks_' + this.activityName : ''
    ].filter(Boolean);
    const json = JSON.stringify(this.tasksList);
    keys.forEach(k => sessionStorage.setItem(k, json));
  }

  saveRow(row: TaskItem): void {
    row.isEditing = false;
    delete row.isNew;
    delete row._backup;

    if (row.min !== undefined && row.min !== null && row.min !== (' ' as any)) row.min = Number(Number(row.min).toFixed(2));
    if (row.max !== undefined && row.max !== null && row.max !== (' ' as any)) row.max = Number(Number(row.max).toFixed(2));
    if (row.mean !== undefined && row.mean !== null && row.mean !== (' ' as any)) row.mean = Number(Number(row.mean).toFixed(2));
    if (row.median !== undefined && row.median !== null && row.median !== (' ' as any)) row.median = Number(Number(row.median).toFixed(2));

    this.persistTasks();
  }

  cancelEdit(row: TaskItem): void {
    if (row.isNew) {
      const index = this.tasksList.indexOf(row);
      if (index > -1) {
        this.tasksList.splice(index, 1);
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.tasksList.length) {
          this.pageIndex = Math.max(0, this.pageIndex - 1);
        }
      }
    } else {
      if (row._backup) {
        Object.assign(row, row._backup);
        delete row._backup;
      }
      row.isEditing = false;
    }
  }

  deleteTask(row: TaskItem): void {
    const index = this.tasksList.indexOf(row);
    if (index > -1) {
      this.tasksList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.tasksList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
      this.persistTasks();
    }
  }

  save(): void {
    // Finalize any rows left in edit mode
    this.tasksList.forEach(r => {
      r.isEditing = false;
      delete r.isNew;
      delete r._backup;
      if (r.min !== undefined && r.min !== null && r.min !== (' ' as any)) r.min = Number(Number(r.min).toFixed(2));
      if (r.max !== undefined && r.max !== null && r.max !== (' ' as any)) r.max = Number(Number(r.max).toFixed(2));
      if (r.mean !== undefined && r.mean !== null && r.mean !== (' ' as any)) r.mean = Number(Number(r.mean).toFixed(2));
      if (r.median !== undefined && r.median !== null && r.median !== (' ' as any)) r.median = Number(Number(r.median).toFixed(2));
    });

    this.persistTasks();

    if (this.dialogRef) {
      this.dialogRef.close({
        tasks: this.tasksList,
        count: this.tasksList.length
      });
    } else {
      this.goBack();
    }
  }

  close(): void {
    this.goBack();
  }

  goBack(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
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

  openHistory(row: TaskItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.router.navigate(['/stages/wbs/tasks/history'], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        jobCode: row.jobCode,
        activityName: this.activityName || this.data?.row?.task || '',
        activityCode: this.activityCode || this.data?.row?.activityCode || this.data?.row?.taskCode || '',
        slNo: this.slNo || this.data?.row?.slNo || '',
        stageCode: this.stageCode || this.data?.row?.stageCode || '',
        stageName: this.stageName || this.data?.row?.stageName || '',
        gateCode: this.gateCode || this.data?.row?.gateCode || '',
        menuIndex: this.menuIndex,
        historyCount: historyCount
      }
    });
  }
}
