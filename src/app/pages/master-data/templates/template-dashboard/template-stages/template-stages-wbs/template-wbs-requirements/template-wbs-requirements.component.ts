import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../template-stages-wbs.component';
import { AddWbsRequirementComponent } from '../../../../../../projects/project-dashboard/project-stages/project-wbs/project-wbs-requirements/add-wbs-requirement/add-wbs-requirement.component';

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
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-template-wbs-requirements',
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
  templateUrl: './template-wbs-requirements.component.html',
  styleUrl: './template-wbs-requirements.component.scss',
})
export class TemplateWbsRequirementsComponent implements OnInit {
  @Input() activity?: WbsActivityItem | null;
  @Input() stageName?: string;
  @Input() stageCode?: string;
  @Input() gateName?: string;
  @Input() gateCode?: string;
  @Input() projectName?: string;
  @Input() projectCode?: string;
  @Output() back = new EventEmitter<any>();

  title: string = 'Assign Requirements';
  pageIndex = 0;
  pageSize = 5;
  source?: string;

  requirementsList: RequirementItem[] = [];

  get paginatedRequirements(): RequirementItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<TemplateWbsRequirementsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute,
    @Optional() private router?: Router,
    @Optional() private location?: Location,
  ) {}

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
          requirements: params['requirements']
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
      this.title = `Requirements — ${this.activity.activityName}`;
    } else if (this.data?.title) {
      this.title = this.data.title;
    } else {
      this.title = 'Assign Requirements';
    }

    this.initRequirementsList();
  }

  private initRequirementsList(): void {
    if (this.activity?.requirementsData && Array.isArray(this.activity.requirementsData)) {
      this.requirementsList = this.activity.requirementsData.map(item => ({ ...item, isEditing: false }));
      return;
    }

    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any) => ({ ...item, isEditing: false }));
      return;
    }

    let targetCount = 7;
    if (this.activity?.requirements) {
      const parsed = parseInt(String(this.activity.requirements).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: Partial<RequirementItem>[] = [
      { requirementName: 'API Solubility and Stability Specification', department: 'Analytical', role: 'Scientist', dueDate: '2026-01-20', completedDate: '2026-01-19', remarks: 'Passed validation', active: true, done: true },
      { requirementName: 'Finished Product Dissolution Profile Criteria', department: 'Formulation', role: 'Lead', dueDate: '2026-01-25', completedDate: '2026-01-24', remarks: 'USP compliant', active: true, done: true },
      { requirementName: 'Reference Listed Drug Characterization Protocol', department: 'Regulatory', role: 'Reviewer', dueDate: '2026-02-02', completedDate: '2026-02-01', remarks: 'COA reviewed', active: true, done: true },
      { requirementName: 'Packaging Material Compatibility Limits', department: 'Packaging', role: 'Engineer', dueDate: '2026-02-10', completedDate: '2026-02-08', remarks: 'HDPE bottle tested', active: true, done: true },
      { requirementName: 'Analytical Method Validation (Assay & Related Subs)', department: 'Analytical', role: 'Scientist', dueDate: '2026-02-15', completedDate: '', remarks: 'Draft protocol', active: true, done: false },
      { requirementName: 'Forced Degradation & Photostability Dossier', department: 'Analytical', role: 'Lead', dueDate: '2026-02-20', completedDate: '', remarks: 'ICH Q1B aligned', active: true, done: false },
      { requirementName: 'Excipient Compatibility & Drug Interaction Study', department: 'Formulation', role: 'Scientist', dueDate: '2026-02-25', completedDate: '', remarks: 'Binary mixtures', active: true, done: false },
      { requirementName: 'Process Flow Diagram & Critical Process Parameters', department: 'Production', role: 'Manager', dueDate: '2026-03-02', completedDate: '', remarks: 'Pending engineering review', active: true, done: false },
      { requirementName: 'Raw Material & Active Ingredient Release Limits', department: 'Quality Control', role: 'Analyst', dueDate: '2026-03-08', completedDate: '', remarks: 'In-house specs', active: true, done: false },
      { requirementName: 'Microbiological Limit Test Validation Protocol', department: 'Microbiology', role: 'Scientist', dueDate: '2026-03-12', completedDate: '', remarks: 'Sterility & endotoxin', active: true, done: false },
      { requirementName: 'Container Closure Integrity Testing Procedure', department: 'Quality Assurance', role: 'Reviewer', dueDate: '2026-03-18', completedDate: '', remarks: 'ASTM standard', active: true, done: false },
      { requirementName: 'Bio-waiver Justification & BCS Classification', department: 'Clinical', role: 'Lead', dueDate: '2026-03-22', completedDate: '', remarks: 'BCS Class II', active: true, done: false },
      { requirementName: 'Pilot Scale Batch Manufacturing Record (BMR)', department: 'Formulation', role: 'Lead', dueDate: '2026-03-28', completedDate: '', remarks: 'Trial batch 001', active: true, done: false }
    ];

    this.requirementsList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        requirementName: template.requirementName || `Requirement ${i + 1}`,
        department: template.department || 'Analytical',
        role: template.role || 'Scientist',
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        remarks: template.remarks || 'Standard requirement',
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addRequirement(): void {
    const dialogRef = this.dialog.open(AddWbsRequirementComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newReq: RequirementItem = {
          id: Date.now(),
          active: true,
          done: false,
          requirementName: result.requirementName ?? '',
          department: result.department ?? 'Analytical',
          role: result.role ?? 'Scientist',
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          remarks: result.remarks ?? '',
          isEditing: false
        };
        this.requirementsList.unshift(newReq);
        this.pageIndex = 0;
      }
    });
  }

  startEdit(row: RequirementItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    row.isNew = false;
    delete row._backup;
  }

  cancelEdit(row: RequirementItem): void {
    if (row.isNew) {
      const idx = this.requirementsList.indexOf(row);
      if (idx !== -1) {
        this.requirementsList.splice(idx, 1);
      }
    } else if (row._backup) {
      Object.assign(row, row._backup);
      row.isEditing = false;
      delete row._backup;
    } else {
      row.isEditing = false;
    }
  }

  deleteRequirement(row: RequirementItem): void {
    const idx = this.requirementsList.indexOf(row);
    if (idx !== -1) {
      this.requirementsList.splice(idx, 1);
      const totalPages = Math.max(1, Math.ceil(this.requirementsList.length / this.pageSize));
      if (this.pageIndex >= totalPages) {
        this.pageIndex = Math.max(0, totalPages - 1);
      }
    }
  }

  save(): void {
    for (const r of this.requirementsList) {
      if (r.isEditing) {
        this.saveRow(r);
      }
    }

    const result = {
      requirements: this.requirementsList,
      count: this.requirementsList.length
    };

    if (this.activity) {
      this.activity.requirementsData = this.requirementsList;
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
}
