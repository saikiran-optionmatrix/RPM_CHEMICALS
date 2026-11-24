import { Component, Inject, OnInit, Optional, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { getRequirementsForWbs, getRequirementItemsForWbs, getDepartmentAndRoleForRequirement } from '../../stage-wbs-requirements.data';

export interface RequirementItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  requirementName: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-assign-requirements',
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
  templateUrl: './assign-requirements.component.html',
  styleUrl: './assign-requirements.component.scss',
})
export class AssignRequirementsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Screen Context State
  activityName: string = '';
  activityCode: string = '';
  jobCode: string = '';
  stageCode: string = 'S1';
  stageName: string = 'Business Case';
  gateCode: string = 'Gate 1';
  slNo: string = '';
  menuIndex: number = 0;
  requirementsCountParam: string = '';
  title: string = 'Assign Requirements';
  isDialog: boolean = false;

  pageIndex = 0;
  pageSize = 5;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  requirementsList: RequirementItem[] = [];

  get paginatedRequirements(): RequirementItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    @Optional() private dialogRef?: MatDialogRef<AssignRequirementsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isDialog = !!this.dialogRef;

    this.route?.queryParams.subscribe(params => {
      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['jobCode']) this.jobCode = params['jobCode'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['requirements']) this.requirementsCountParam = params['requirements'];
      if (params['menuIndex'] !== undefined) this.menuIndex = Number(params['menuIndex']) || 0;

      if (this.activityName) {
        this.title = `Requirements — ${this.activityName}`;
      }
    });

    if (this.data?.row) {
      if (this.data.row.task) this.activityName = this.data.row.task;
      if (this.data.row.activityCode || this.data.row.taskCode) {
        this.activityCode = this.data.row.activityCode || this.data.row.taskCode;
      }
      if (this.data.row.jobCode) this.jobCode = this.data.row.jobCode;
      if (this.data.row.stageCode) this.stageCode = this.data.row.stageCode;
      if (this.data.row.stageName) this.stageName = this.data.row.stageName;
      if (this.data.row.gateCode) this.gateCode = this.data.row.gateCode;
      if (this.data.row.slNo) this.slNo = this.data.row.slNo;
      if (this.activityName) {
        this.title = `Requirements — ${this.activityName}`;
      }
    }

    this.initRequirements();
  }

  private initRequirements(): void {
    const storageKeys = [
      this.slNo ? 'stages_requirements_' + this.slNo : '',
      this.activityCode ? 'stages_requirements_' + this.activityCode : '',
      this.activityName ? 'stages_requirements_' + this.activityName : ''
    ].filter(Boolean);

    // Lookup atomic prerequisites / resources based on WBS ID (slNo) or activity name
    const reqItems = getRequirementItemsForWbs(this.slNo, this.activityName);
    const wbsRequirements = reqItems ? reqItems.map(r => r.requirement) : getRequirementsForWbs(this.slNo, this.activityName);

    if (wbsRequirements && wbsRequirements.length > 0) {
      // Check if any previously saved state exists in sessionStorage to retain user changes (status, remarks, dates)
      const savedMap = new Map<string, any>();
      for (const key of storageKeys) {
        const saved = sessionStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach((p: any) => {
                if (p && p.requirementName) {
                  savedMap.set(p.requirementName.trim().toLowerCase(), p);
                }
              });
              if (savedMap.size > 0) break;
            }
          } catch (e) { }
        }
      }

      this.requirementsList = wbsRequirements.map((reqName: string, i: number) => {
        const saved = savedMap.get(reqName.trim().toLowerCase());
        if (saved) {
          return {
            ...saved,
            requirementName: reqName,
            historyCount: saved.historyCount || this.getHistoryCount(i),
            isEditing: false
          };
        }
        const { department, role } = getDepartmentAndRoleForRequirement(reqName);
        return {
          id: Date.now() + i,
          active: true,
          done: i < 2,
          requirementName: reqName,
          department: department,
          role: role,
          dueDate: '2026-03-15',
          completedDate: i < 2 ? '2026-03-01' : '',
          remarks: 'Atomic prerequisite / resource verified',
          historyCount: this.getHistoryCount(i),
          isEditing: false
        };
      });

      // Always persist the updated WBS requirements list back to sessionStorage
      this.persistRequirements();
      return;
    }

    for (const key of storageKeys) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.requirementsList = parsed.map((item: any, idx: number) => ({
              ...item,
              historyCount: item.historyCount || this.getHistoryCount(idx),
              isEditing: false
            }));
            return;
          }
        } catch (e) { }
      }
    }

    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData) && this.data.row.requirementsData.length > 0) {
      this.requirementsList = this.data.row.requirementsData.map((item: any, idx: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(idx),
        isEditing: false
      }));
      return;
    }

    // Determine target count from params or default
    let targetCount = 3;
    const countStr = this.requirementsCountParam || (this.data?.row?.requirements ? String(this.data.row.requirements) : '');
    if (countStr) {
      const parsed = parseInt(countStr.split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) {
        targetCount = parsed;
      }
    }

    const sampleCatalog: Partial<RequirementItem>[] = [
      { requirementName: 'Raw Material Purity & Assay Specification', department: 'Chemical R&D', role: 'Lead', dueDate: '2026-01-20', completedDate: '2026-01-19', remarks: 'Passed GC/HPLC assay', active: true, done: true },
      { requirementName: 'Reaction Yield & Stoichiometric Balance Criteria', department: 'Process Tech', role: 'Scientist', dueDate: '2026-01-25', completedDate: '2026-01-24', remarks: 'Yield > 92% verified', active: true, done: true },
      { requirementName: 'Reaction Calorimetry (RC1) & Heat Transfer Protocol', department: 'Process Safety', role: 'Lead', dueDate: '2026-02-02', completedDate: '2026-02-01', remarks: 'Enthalpy profiled', active: true, done: true },
      { requirementName: 'Solvent Recovery & Distillation Efficiency Limits', department: 'Process Tech', role: 'Engineer', dueDate: '2026-02-10', completedDate: '2026-02-08', remarks: 'Recovery > 88% verified', active: true, done: true },
      { requirementName: 'Impurity Profiling & Residual Monomer Limits', department: 'Analytical', role: 'Scientist', dueDate: '2026-02-15', completedDate: '', remarks: 'Draft method protocol', active: true, done: false },
      { requirementName: 'Thermal Stability & Differential Scanning Calorimetry (DSC)', department: 'Process Safety', role: 'Lead', dueDate: '2026-02-20', completedDate: '', remarks: 'Onset exotherm checked', active: true, done: false },
      { requirementName: 'Catalyst Reusability & Turnover Frequency Study', department: 'Chemical R&D', role: 'Scientist', dueDate: '2026-02-25', completedDate: '', remarks: '5 recycling cycles', active: true, done: false },
      { requirementName: 'Process Flow Diagram & Piping Instrumentation (P&ID)', department: 'Engineering', role: 'Manager', dueDate: '2026-03-02', completedDate: '', remarks: 'Engineering sign-off', active: true, done: false },
      { requirementName: 'Raw Material Lot Clearance & Bulk Monomer Release', department: 'Quality Control', role: 'Analyst', dueDate: '2026-03-08', completedDate: '', remarks: 'CoA specs approved', active: true, done: false },
      { requirementName: 'Process Hazard Analysis (HAZOP) Study Action Items', department: 'Process Safety', role: 'Lead', dueDate: '2026-03-12', completedDate: '', remarks: 'Interlocks certified', active: true, done: false },
      { requirementName: 'Effluent Characterization (COD, BOD, TDS) Specification', department: 'ETP / EHS', role: 'Reviewer', dueDate: '2026-03-18', completedDate: '', remarks: 'ETP load accepted', active: true, done: false },
      { requirementName: 'REACH / TSCA Substance Identification Dossier', department: 'Regulatory', role: 'Lead', dueDate: '2026-03-22', completedDate: '', remarks: 'Pre-registration filed', active: true, done: false },
      { requirementName: 'Pilot Plant Batch Manufacturing Formula & SOP', department: 'Operations', role: 'Manager', dueDate: '2026-03-28', completedDate: '', remarks: 'Pilot clearance signed', active: true, done: false }
    ];

    this.requirementsList = Array.from({ length: targetCount }, (_, i) => {
      const template = sampleCatalog[i % sampleCatalog.length];
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 2),
        requirementName: template.requirementName || `Requirement ${i + 1}`,
        department: template.department || 'Analytical',
        role: template.role || 'Scientist',
        dueDate: template.dueDate || '2024-06-30',
        completedDate: template.completedDate || '',
        remarks: template.remarks || '',
        historyCount: this.getHistoryCount(i),
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addRequirement(): void {
    const dialogRef = this.dialog.open(AddRequirementComponent, {
      width: '600px',
      data: {
        mode: 'add',
        requirementName: ''
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.requirementName?.trim()) {
        const newReq: RequirementItem = {
          active: true,
          done: false,
          requirementName: res.requirementName.trim(),
          department: '',
          role: '',
          dueDate: '',
          completedDate: '',
          remarks: '',
          historyCount: 1,
          isEditing: false
        };
        this.pageIndex = 0;
        this.requirementsList = [newReq, ...this.requirementsList];
        this.persistRequirements();
      }
    });
  }

  startEdit(row: RequirementItem): void {
    const dialogRef = this.dialog.open(AddRequirementComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        requirementName: row.requirementName
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.requirementName?.trim()) {
        row.requirementName = res.requirementName.trim();
        this.persistRequirements();
      }
    });
  }

  private persistRequirements(): void {
    const keys = [
      this.slNo ? 'stages_requirements_' + this.slNo : '',
      this.activityCode ? 'stages_requirements_' + this.activityCode : '',
      this.activityName ? 'stages_requirements_' + this.activityName : ''
    ].filter(Boolean);
    keys.forEach(k => sessionStorage.setItem(k, JSON.stringify(this.requirementsList)));
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    delete row.isNew;
    delete row._backup;

    this.persistRequirements();
  }

  cancelEdit(row: RequirementItem): void {
    if (row.isNew) {
      const index = this.requirementsList.indexOf(row);
      if (index > -1) {
        this.requirementsList.splice(index, 1);
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.requirementsList.length) {
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

  deleteRequirement(row: RequirementItem): void {
    const index = this.requirementsList.indexOf(row);
    if (index > -1) {
      this.requirementsList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.requirementsList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
      this.persistRequirements();
    }
  }

  save(): void {
    // Finalize any rows left in edit mode
    this.requirementsList.forEach(r => {
      r.isEditing = false;
      delete r.isNew;
      delete r._backup;
    });

    this.persistRequirements();

    if (this.dialogRef) {
      this.dialogRef.close({
        requirements: this.requirementsList,
        count: this.requirementsList.length
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

  openHistory(row: RequirementItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.router.navigate(['/stages/wbs/requirements/history'], {
      queryParams: {
        requirementName: row.requirementName,
        activityName: this.activityName || this.data?.row?.task || '',
        activityCode: this.activityCode || this.data?.row?.activityCode || this.data?.row?.taskCode || '',
        stageCode: this.stageCode || this.data?.row?.stageCode || '',
        stageName: this.stageName || this.data?.row?.stageName || '',
        gateCode: this.gateCode || this.data?.row?.gateCode || '',
        menuIndex: this.menuIndex,
        historyCount: historyCount
      }
    });
  }
}
