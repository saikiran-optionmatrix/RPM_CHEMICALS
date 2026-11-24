import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface RequirementHistoryItem {
  id?: number | string;
  active: boolean;
  done: boolean;
  requirementName: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-project-wbs-requirements-history',
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
  templateUrl: './project-wbs-requirements-history.component.html',
  styleUrl: './project-wbs-requirements-history.component.scss',
})
export class ProjectWbsRequirementsHistoryComponent implements OnInit {
  requirementName: string = '';
  active: boolean = true;
  done: boolean = false;
  department: string = '';
  role: string = '';
  dueDate: string = '';
  completedDate: string = '';
  remarks: string = '';

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

  requirementsHistory: RequirementHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['requirementName']) this.requirementName = params['requirementName'];
      if (params['active'] !== undefined) {
        this.active = params['active'] === 'true' || params['active'] === true;
      }
      if (params['done'] !== undefined) {
        this.done = params['done'] === 'true' || params['done'] === true;
      }
      if (params['department']) this.department = params['department'];
      if (params['role']) this.role = params['role'];
      if (params['dueDate']) this.dueDate = params['dueDate'];
      if (params['completedDate']) this.completedDate = params['completedDate'];
      if (params['remarks']) this.remarks = params['remarks'];

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
    const curReqName = this.requirementName || 'API Solubility and Stability Specification';
    const curDept = this.department || 'Analytical';
    const curRole = this.role || 'Scientist';
    const curDueDate = this.dueDate || '2026-01-20';
    const curCompletedDate = this.completedDate || (this.done ? '2026-01-19' : '');
    const curActive = this.active;
    const curDone = this.done;
    const curRemarks = this.remarks || 'Passed validation';

    // Revision history for the clicked requirement
    const selectedRevisions: RequirementHistoryItem[] = [
      {
        id: 1,
        active: curActive,
        done: curDone,
        requirementName: curReqName,
        department: curDept,
        role: curRole,
        dueDate: curDueDate,
        completedDate: curCompletedDate,
        remarks: curRemarks || 'Final requirement verified and approved for submission',
        revision: 'Rev 3 (Current)',
        changedDate: '2026-01-19'
      },
      {
        id: 2,
        active: true,
        done: false,
        requirementName: curReqName,
        department: curDept,
        role: curRole,
        dueDate: '2026-01-15',
        completedDate: '',
        remarks: 'Intermediate revision: adjusted test parameters according to monograph update',
        revision: 'Rev 2',
        changedDate: '2026-01-12'
      },
      {
        id: 3,
        active: true,
        done: false,
        requirementName: curReqName,
        department: curDept,
        role: curRole,
        dueDate: '2026-01-10',
        completedDate: '',
        remarks: 'Initial requirement baseline drafted and assigned',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    // Other activity requirements history
    const otherRequirements: RequirementHistoryItem[] = [
      {
        id: 4,
        active: true,
        done: true,
        requirementName: 'Distillation Solvent Recovery Purity Specification',
        department: 'Process Chemistry',
        role: 'Lead',
        dueDate: '2026-01-25',
        completedDate: '2026-01-24',
        remarks: 'GC purity ≥ 99.0% verified with low moisture content',
        revision: 'Rev 2'
      },
      {
        id: 5,
        active: true,
        done: true,
        requirementName: 'Raw Material Vendor Dual-Sourcing Qualification',
        department: 'Procurement',
        role: 'Reviewer',
        dueDate: '2026-02-02',
        completedDate: '2026-02-01',
        remarks: 'Alternate monomer supplier audited and approved',
        revision: 'Rev 1'
      },
      {
        id: 6,
        active: true,
        done: true,
        requirementName: 'Reaction Calorimetry Heat Release Profile (< 250 W/kg)',
        department: 'Process Safety',
        role: 'Engineer',
        dueDate: '2026-02-10',
        completedDate: '2026-02-08',
        remarks: 'RC1 adiabatic runaway study within design envelope limits',
        revision: 'Rev 1'
      },
      {
        id: 7,
        active: true,
        done: false,
        requirementName: 'Gas Chromatography Analytical Method Validation',
        department: 'Analytical Development',
        role: 'Scientist',
        dueDate: '2026-02-15',
        completedDate: '',
        remarks: 'Draft protocol submitted for impurity quantification',
        revision: 'Rev 1'
      },
      {
        id: 8,
        active: true,
        done: false,
        requirementName: 'GHS Classification & Safety Data Sheet (SDS) Finalization',
        department: 'Regulatory Affairs',
        role: 'Lead',
        dueDate: '2026-02-20',
        completedDate: '',
        remarks: 'GHS 16-section SDS aligned with EU REACH / CLP standards',
        revision: 'Rev 1'
      },
      {
        id: 9,
        active: true,
        done: false,
        requirementName: 'HAZOP Safety Interlock & Relief Sizing Verification',
        department: 'Engineering',
        role: 'Scientist',
        dueDate: '2026-02-25',
        completedDate: '',
        remarks: 'Emergency relief vent sized per DIERS methodology',
        revision: 'Rev 1'
      },
      {
        id: 10,
        active: true,
        done: false,
        requirementName: 'Pilot Plant Technology Transfer Dossier Approval',
        department: 'Operations',
        role: 'Manager',
        dueDate: '2026-03-02',
        completedDate: '',
        remarks: 'Scale-up critical process parameters and recipe frozen',
        revision: 'Rev 1'
      },
      {
        id: 11,
        active: true,
        done: false,
        requirementName: 'REACH / TSCA Registration Dossier Completeness',
        department: 'Regulatory Affairs',
        role: 'Analyst',
        dueDate: '2026-03-08',
        completedDate: '',
        remarks: 'IUCLID technical dossier formatted for submission',
        revision: 'Rev 1'
      }
    ];

    const filteredOther = otherRequirements.filter(
      r => r.requirementName.toLowerCase() !== curReqName.toLowerCase()
    );

    this.requirementsHistory = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRequirements(): RequirementHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsHistory.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/stages/wbs')) {
      this.router.navigate(['/projects/dashboard/stages/wbs/requirements'], { queryParamsHandling: 'merge' });
    } else if (currentUrl.includes('/wbs')) {
      this.router.navigate(['/projects/dashboard/wbs/requirements'], { queryParamsHandling: 'merge' });
    } else {
      this.location.back();
    }
  }
}
