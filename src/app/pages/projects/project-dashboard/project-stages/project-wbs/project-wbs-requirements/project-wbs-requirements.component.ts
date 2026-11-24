import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../project-wbs.component';
import { AddWbsRequirementComponent } from './add-wbs-requirement/add-wbs-requirement.component';
import { getRequirementsForWbs, getRequirementItemsForWbs, getDepartmentAndRoleForRequirement } from '../../../../../stages/stage-wbs-requirements.data';
import { DocumentsPopComponent } from '../../../../../../common/shared/documents-pop/documents-pop.component';

export interface RequirementItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  approve?: boolean;
  requirementName: string;
  department: string;
  role?: string;
  responsibility?: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-project-wbs-requirements',
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
  templateUrl: './project-wbs-requirements.component.html',
  styleUrl: './project-wbs-requirements.component.scss',
})
export class ProjectWbsRequirementsComponent implements OnInit {
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

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];
  readonly documentsSequence: number[] = [3, 1, 4, 2, 5, 2, 4, 1, 3, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  readonly realPersonNames: string[] = [
    'Dr. Sarah Connor',
    'James Miller',
    'Emily Watson',
    'Michael Scott',
    'Robert Chen',
    'Jessica Alba',
    'David Kim',
    'Olivia Brown',
    'Aarav Shah',
    'Dr. Sarah Jenkins',
    'Dr. Priya R.',
    'Rahul K.',
    'Meena S.',
    'Anil P.',
    'Kavya R.',
    'Suresh N.'
  ];

  readonly rolePersonMap: Record<string, string> = {
    // Stage 1 & Commercial roles
    'BD Lead': 'James Miller',
    'Portfolio Manager': 'Emily Watson',
    'Commercial Lead': 'Michael Scott',
    'Financial Analyst': 'Robert Chen',
    'Project Lead': 'Dr. Sarah Connor',
    'Task Lead': 'David Kim',
    'Data Lead': 'Jessica Alba',
    'Materials Lead': 'Olivia Brown',
    'Specifications Lead': 'Aarav Shah',
    'Compliance Officer': 'Dr. Sarah Jenkins',
    'Executive Sponsor': 'Shantaram',
    'PMO Director': 'R. Kulkarni',

    // Technical / Lab roles
    'AD Analyst': 'Dr. Priya R.',
    'Process Chemist': 'Rahul K.',
    'QC Analyst': 'Anil P.',
    'QA Lead': 'Meena S.',
    'QC Lead': 'Kavya R.',
    'RA Lead': 'S. Iyer',
    'Process Chemistry Lead': 'Dr. Sarah Jenkins',
    'AD Lead': 'Dr. Sarah Connor',
    'SCM Lead': 'Suresh N.',
    'DQA Specialist': 'Anki Reddy',
    'PD Specialist': 'Karthikeyan S',
    'HPLC Specialist': 'David Kim',
    'GC Specialist': 'James Miller',
    'PSD Specialist': 'Emily Watson',
    'XRD Specialist': 'Aarav Shah',
    'Thermal Hazard Specialist': 'Rahul K.',
    'Chamber Coordinator': 'Robert Chen',
    'Equipment Technician': 'Michael Scott',
    'Pilot Operations Lead': 'Dr. Priya R.',
    'Inventory Officer': 'Suresh N.',
    'Sourcing Manager': 'Shantaram',
    'Impurity Specialist': 'Meena S.',
    'Chromatography Specialist': 'David Kim',
    'Raw Material Liaison': 'Prasanna',
    'Licensing Manager': 'Dutta',
    'PPIC Planner': 'Anki Reddy',
    'Process Safety Engineer': 'Dr. Sarah Connor',
    'Testing Lab Specialist': 'Jessica Alba',
    'Patent Attorney': 'Olivia Brown',
    'Production Lead': 'Michael Scott',

    // Generic roles
    'Lead': 'Dr. Sarah Connor',
    'Reviewer': 'Jessica Alba',
    'Approver': 'R. Kulkarni',
    'Scientist': 'Dr. Priya R.',
    'Manager': 'Emily Watson',
    'Analyst': 'Robert Chen',
    'Engineer': 'David Kim',
    'Specialist': 'Aarav Shah'
  };

  private isRoleOrGenericTitle(name?: string): boolean {
    if (!name) return true;
    const trimmed = name.trim();
    if (this.rolePersonMap[trimmed]) return true;
    const lower = trimmed.toLowerCase();
    const roleWords = [
      'lead', 'manager', 'analyst', 'scientist', 'engineer', 'specialist',
      'reviewer', 'approver', 'officer', 'technician', 'director', 'sponsor',
      'coordinator', 'attorney', 'liaison', 'planner', 'team', 'head'
    ];
    return roleWords.some(w => lower === w || lower.endsWith(' ' + w) || lower.startsWith(w + ' '));
  }

  getResponsibleName(item: any, index: number): string {
    // 1. If item has a responsibility that is already a real person's name (and not a role title), keep it
    if (item?.responsibility && !this.isRoleOrGenericTitle(item.responsibility)) {
      return item.responsibility;
    }

    // 2. Direct map lookup from role or responsibility
    const roleKey = (item?.role || item?.responsibility || '').trim();
    if (roleKey && this.rolePersonMap[roleKey]) {
      return this.rolePersonMap[roleKey];
    }

    // 3. Partial match against rolePersonMap keys
    if (roleKey) {
      for (const [key, person] of Object.entries(this.rolePersonMap)) {
        if (roleKey.toLowerCase().includes(key.toLowerCase())) {
          return person;
        }
      }
    }

    // 4. Default fallback to real person names
    return this.realPersonNames[index % this.realPersonNames.length];
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<ProjectWbsRequirementsComponent>,
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
          slNo: params['slNo'] || '',
          activityName: params['activityName'],
          jobCode: params['jobCode'] || '',
          department: params['department'] || '',
          responsibility: '',
          priority: 'High',
          status: true,
          requirements: params['requirements']
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
      this.requirementsList = this.activity.requirementsData.map((item, index) => ({
        ...item,
        approve: item.approve ?? item.done ?? false,
        responsibility: this.getResponsibleName(item, index),
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        isEditing: false
      }));
      return;
    }

    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any, index: number) => ({
        ...item,
        approve: item.approve ?? item.done ?? false,
        responsibility: this.getResponsibleName(item, index),
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        isEditing: false
      }));
      return;
    }

    const wbsId = this.activity?.slNo || this.data?.row?.slNo || this.route?.snapshot.queryParamMap.get('slNo') || '';
    const actName = this.activity?.activityName || this.activity?.task || this.data?.row?.activityName || this.data?.row?.taskName || this.data?.row?.task || this.route?.snapshot.queryParamMap.get('activityName') || '';

    const storageKeys = [
      wbsId ? 'project_wbs_requirements_' + wbsId : '',
      wbsId ? 'stages_requirements_' + wbsId : '',
      wbsId ? 'project_wbs_reqs_' + wbsId : '',
      wbsId ? 'stages_reqs_' + wbsId : '',
      actName ? 'project_wbs_requirements_' + actName : '',
      actName ? 'stages_requirements_' + actName : '',
      actName ? 'project_wbs_reqs_' + actName : '',
      actName ? 'stages_reqs_' + actName : ''
    ].filter(Boolean);

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

    const reqItems = getRequirementItemsForWbs(wbsId, actName);
    const predefined = reqItems ? reqItems.map(r => r.requirement) : getRequirementsForWbs(wbsId, actName);
    if (predefined && predefined.length > 0) {
      this.requirementsList = predefined.map((reqName: string, i: number) => {
        const saved = savedMap.get(reqName.trim().toLowerCase());
        const { department, role } = getDepartmentAndRoleForRequirement(reqName);
        const itemForResp = saved ? { ...saved, role: saved.role || role } : { role, requirementName: reqName };
        const respName = this.getResponsibleName(itemForResp, i);
        if (saved) {
          return {
            ...saved,
            requirementName: reqName,
            approve: saved.approve ?? saved.done ?? false,
            responsibility: respName,
            historyCount: saved.historyCount || this.getHistoryCount(i),
            documentsCount: saved.documentsCount || this.getDocumentsCount(i),
            isEditing: false
          };
        }
        return {
          id: Date.now() + i,
          active: true,
          done: i < 2,
          approve: i < 2,
          requirementName: reqName,
          department: department,
          role: role,
          responsibility: respName,
          dueDate: '2026-03-15',
          completedDate: i < 2 ? '2026-03-01' : '',
          remarks: 'Atomic prerequisite / resource verified',
          historyCount: this.getHistoryCount(i),
          documentsCount: this.getDocumentsCount(i),
          updatedDate: '2026-03-15',
          updatedBy: respName,
          isEditing: false
        };
      });
      this.persistRequirements();
      return;
    }

    // Generate items matching the count in fractional requirements (e.g. 7 from '7/13')
    let targetCount = 7;
    if (this.activity?.requirements) {
      const parsed = parseInt(String(this.activity.requirements).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: Partial<RequirementItem>[] = [
      { requirementName: 'Raw Material Purity & Assay Specification', department: 'Chemical R&D', role: 'Lead', responsibility: 'Dr. Sarah Connor', dueDate: '2026-01-20', completedDate: '2026-01-19', remarks: 'Passed GC/HPLC assay', active: true, done: true, approve: true },
      { requirementName: 'Reaction Yield & Stoichiometric Balance Criteria', department: 'Process Tech', role: 'Scientist', responsibility: 'Michael Scott', dueDate: '2026-01-25', completedDate: '2026-01-24', remarks: 'Yield > 92% verified', active: true, done: true, approve: true },
      { requirementName: 'Reaction Calorimetry (RC1) & Heat Transfer Protocol', department: 'Process Safety', role: 'Lead', responsibility: 'Dr. Sarah Jenkins', dueDate: '2026-02-02', completedDate: '2026-02-01', remarks: 'Enthalpy profiled', active: true, done: true, approve: true },
      { requirementName: 'Solvent Recovery & Distillation Efficiency Limits', department: 'Process Tech', role: 'Engineer', responsibility: 'David Kim', dueDate: '2026-02-10', completedDate: '2026-02-08', remarks: 'Recovery > 88% verified', active: true, done: true, approve: true },
      { requirementName: 'Impurity Profiling & Residual Monomer Limits', department: 'Analytical', role: 'Scientist', responsibility: 'Dr. Sarah Connor', dueDate: '2026-02-15', completedDate: '', remarks: 'Draft method protocol', active: true, done: false, approve: false },
      { requirementName: 'Thermal Stability & Differential Scanning Calorimetry (DSC)', department: 'Process Safety', role: 'Lead', responsibility: 'James Miller', dueDate: '2026-02-20', completedDate: '', remarks: 'Onset exotherm checked', active: true, done: false, approve: false },
      { requirementName: 'Catalyst Reusability & Turnover Frequency Study', department: 'Chemical R&D', role: 'Scientist', responsibility: 'Robert Chen', dueDate: '2026-02-25', completedDate: '', remarks: '5 recycling cycles', active: true, done: false, approve: false },
      { requirementName: 'Process Flow Diagram & Piping Instrumentation (P&ID)', department: 'Engineering', role: 'Manager', responsibility: 'Emily Watson', dueDate: '2026-03-02', completedDate: '', remarks: 'Engineering sign-off', active: true, done: false, approve: false },
      { requirementName: 'Raw Material Lot Clearance & Bulk Monomer Release', department: 'Quality Control', role: 'Analyst', responsibility: 'Olivia Brown', dueDate: '2026-03-08', completedDate: '', remarks: 'CoA specs approved', active: true, done: false, approve: false },
      { requirementName: 'Process Hazard Analysis (HAZOP) Study Action Items', department: 'Process Safety', role: 'Lead', responsibility: 'Aarav Shah', dueDate: '2026-03-12', completedDate: '', remarks: 'Interlocks certified', active: true, done: false, approve: false },
      { requirementName: 'Effluent Characterization (COD, BOD, TDS) Specification', department: 'ETP / EHS', role: 'Reviewer', responsibility: 'Emily Watson', dueDate: '2026-03-18', completedDate: '', remarks: 'ETP load accepted', active: true, done: false, approve: false },
      { requirementName: 'REACH / TSCA Substance Identification Dossier', department: 'Regulatory', role: 'Lead', responsibility: 'Dr. Sarah Jenkins', dueDate: '2026-03-22', completedDate: '', remarks: 'Pre-registration filed', active: true, done: false, approve: false },
      { requirementName: 'Pilot Plant Batch Manufacturing Formula & SOP', department: 'Operations', role: 'Manager', responsibility: 'Michael Scott', dueDate: '2026-03-28', completedDate: '', remarks: 'Pilot clearance signed', active: true, done: false, approve: false }
    ];

    this.requirementsList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      const respName = template.responsibility || this.getResponsibleName(template, i);
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        approve: template.approve ?? (i < 3),
        requirementName: template.requirementName || `Requirement ${i + 1}`,
        department: template.department || 'Analytical',
        role: template.role || 'Scientist',
        responsibility: respName,
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        remarks: template.remarks || 'Standard requirement',
        historyCount: this.getHistoryCount(i),
        documentsCount: this.getDocumentsCount(i),
        updatedDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        updatedBy: respName,
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
        const resp = this.getResponsibleName({ responsibility: result.responsibility || result.role, role: result.role }, this.requirementsList.length);
        const newReq: RequirementItem = {
          id: Date.now(),
          active: true,
          done: false,
          approve: false,
          requirementName: result.requirementName ?? '',
          department: result.department ?? 'Analytical',
          role: result.role ?? 'Scientist',
          responsibility: resp,
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          remarks: result.remarks ?? '',
          historyCount: 1,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedBy: resp,
          isEditing: false
        };
        this.requirementsList.unshift(newReq);
        this.pageIndex = 0;
        this.persistRequirements();
      }
    });
  }

  toggleDone(row: RequirementItem): void {
    if (row.done && !row.completedDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      row.completedDate = `${yyyy}-${mm}-${dd}`;
    } else if (!row.done) {
      row.completedDate = '';
    }
    this.persistRequirements();
  }

  toggleApprove(row: RequirementItem): void {
    this.persistRequirements();
  }

  private persistRequirements(): void {
    const wbsId = this.activity?.slNo || this.data?.row?.slNo || this.route?.snapshot.queryParamMap.get('slNo') || '';
    const actName = this.activity?.activityName || this.activity?.task || this.data?.row?.activityName || this.data?.row?.taskName || this.data?.row?.task || this.route?.snapshot.queryParamMap.get('activityName') || '';
    if (wbsId) {
      sessionStorage.setItem('project_wbs_reqs_' + wbsId, JSON.stringify(this.requirementsList));
      sessionStorage.setItem('stages_reqs_' + wbsId, JSON.stringify(this.requirementsList));
      sessionStorage.setItem('project_wbs_requirements_' + wbsId, JSON.stringify(this.requirementsList));
      sessionStorage.setItem('stages_requirements_' + wbsId, JSON.stringify(this.requirementsList));
    }
    if (actName) {
      sessionStorage.setItem('project_wbs_reqs_' + actName, JSON.stringify(this.requirementsList));
      sessionStorage.setItem('stages_reqs_' + actName, JSON.stringify(this.requirementsList));
      sessionStorage.setItem('project_wbs_requirements_' + actName, JSON.stringify(this.requirementsList));
      sessionStorage.setItem('stages_requirements_' + actName, JSON.stringify(this.requirementsList));
    }
  }

  startEdit(row: RequirementItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    row.isNew = false;
    row.updatedDate = new Date().toISOString().split('T')[0];
    row.updatedBy = row.responsibility || row.updatedBy || this.activity?.responsibility || 'Dr. Sarah Connor';
    delete row._backup;
    this.persistRequirements();
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
      this.persistRequirements();
    }
  }

  save(): void {
    for (const r of this.requirementsList) {
      if (r.isEditing) {
        this.saveRow(r);
      }
    }

    this.persistRequirements();

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

  openHistory(row: RequirementItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    const currentUrl = this.router?.url || '';
    let targetPath = 'requirements/history';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/requirements/history';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/requirements/history';
    } else {
      targetPath = '/projects/dashboard/stages/wbs/requirements/history';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        requirementName: row.requirementName,
        active: row.active,
        done: row.done,
        department: row.department,
        role: row.role,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        remarks: row.remarks,
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

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
