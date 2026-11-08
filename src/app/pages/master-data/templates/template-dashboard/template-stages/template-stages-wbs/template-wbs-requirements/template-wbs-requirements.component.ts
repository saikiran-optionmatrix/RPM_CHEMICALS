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
    @Optional() private location?: Location
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
      this.requirementsList = this.activity.requirementsData.map((item: any) => ({
        ...item,
        isEditing: false
      }));
      return;
    }

    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any) => ({
        ...item,
        isEditing: false
      }));
      return;
    }

    let targetCount = 6;
    if (this.activity?.requirements) {
      const parsed = parseInt(String(this.activity.requirements).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: RequirementItem[] = [
      {
        active: true,
        done: true,
        requirementName: 'Solids Content and Particle Size (>=35% solids, <=150 nm) Specification',
        department: 'Polymers & Resins',
        role: 'Polymer Lead',
        dueDate: '2026-05-15',
        completedDate: '2026-05-14',
        remarks: 'Batch polymer emulsion analytical characterization completed',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Film Formation and Mechanical Property Acceptance Limits',
        department: 'Polymers & Resins',
        role: 'Polymer Scientist',
        dueDate: '2026-06-01',
        completedDate: '2026-05-31',
        remarks: 'Tensile and glass transition temperature (Tg) testing verified',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Catalyst Metal Loading and Activity Specification',
        department: 'Regulatory & EHS',
        role: 'Regulatory Affairs Specialist',
        dueDate: '2026-05-20',
        completedDate: '2026-05-19',
        remarks: 'Precious metal loading and selectivity criteria confirmed',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Leachable Metal Residue Method Sensitivity Target',
        department: 'Analytical Development & QC',
        role: 'Analytical Chemist',
        dueDate: '2026-05-10',
        completedDate: '2026-05-09',
        remarks: 'ICP-MS trace metal detection limit below 1 ppm verified',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Impurity Profile and Isomer Ratio Similarity Criteria',
        department: 'Analytical Development & QC',
        role: 'Analytical Chemist',
        dueDate: '2026-05-12',
        completedDate: '2026-05-11',
        remarks: 'GC-FID and HPLC method selectivity criteria confirmed',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Batch Reactor Yield Target (>=85% Overall)',
        department: 'Process & Manufacturing',
        role: 'Process Development Manager',
        dueDate: '2026-06-05',
        completedDate: '',
        remarks: 'Yield optimization trials in progress in jacketed pilot unit',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Water Content and Peroxide Release Limits for Recovered Solvent Lots',
        department: 'Supply Chain & Quality',
        role: 'QA Chemist',
        dueDate: '2026-05-25',
        completedDate: '2026-05-24',
        remarks: 'Karl Fischer titration and peroxide test strip controls approved',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Hazardous Storage Architecture for Flammable Solvents (Flameproof, Earthed)',
        department: 'Supply Chain & Quality',
        role: 'Hazmat Storage Specialist',
        dueDate: '2026-06-15',
        completedDate: '',
        remarks: 'PESO explosive certification and earthing grid audit underway',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Global Registration Submission Matrix (REACH / EPA / CIB&RC)',
        department: 'Regulatory & EHS',
        role: 'Regulatory Affairs Specialist',
        dueDate: '2026-06-20',
        completedDate: '',
        remarks: 'Dossier preparation for REACH registration tonnage band underway',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Technical-Grade Active Ingredient Supplier Qualification',
        department: 'Sourcing & Procurement',
        role: 'Raw Material Buyer',
        dueDate: '2026-05-18',
        completedDate: '2026-05-17',
        remarks: 'Vendor facility audit and raw material CoA validation complete',
        isEditing: false
      }
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
