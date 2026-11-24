import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface AssignRequirementHistoryItem {
  id?: number | string;
  requirementName: string;
  revision?: string;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-assign-requirements-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './assign-requirements-history.component.html',
  styleUrl: './assign-requirements-history.component.scss',
})
export class AssignRequirementsHistoryComponent implements OnInit {
  requirementName: string = '';

  activityName: string = '';
  activityCode: string = '';
  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  slNo: string = '';
  menuIndex: number = 0;
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: AssignRequirementHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['requirementName']) this.requirementName = params['requirementName'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['menuIndex'] !== undefined) this.menuIndex = Number(params['menuIndex']) || 0;
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curReqName = this.requirementName || 'API Solubility and Stability Specification';
    const count = this.historyCount || 3;

    const baseDates = [
      '2024-05-18 14:30',
      '2024-05-02 11:15',
      '2024-04-19 09:45',
      '2024-04-05 16:20',
      '2024-03-22 10:10',
      '2024-03-10 13:00'
    ];

    const users = [
      'Dr. Robert Vance',
      'Sarah Jenkins',
      'Michael Chang',
      'Emily Watson',
      'David Miller'
    ];

    const reqNameVariations = [
      curReqName,
      `${curReqName} - Initial Formulation Scope`,
      `${curReqName} - Preliminary Specification Scope`,
      `${curReqName} - Feasibility Assessment Criteria`,
      `${curReqName} - Baseline Draft Guidelines`
    ];

    const selectedRevisions: AssignRequirementHistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      const revNum = count - i;
      selectedRevisions.push({
        id: i + 1,
        requirementName: i === 0 ? curReqName : reqNameVariations[i % reqNameVariations.length],
        revision: `Rev ${revNum}`,
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog requirements for history view
    const otherReqsCatalog: AssignRequirementHistoryItem[] = [
      {
        id: 101,
        requirementName: 'Finished Product Dissolution Profile Criteria',
        revision: 'Rev 2',
        changedDate: '2024-05-19 16:40',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 102,
        requirementName: 'Finished Product Dissolution Profile Criteria - Initial Study',
        revision: 'Rev 1',
        changedDate: '2024-05-01 10:30',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 103,
        requirementName: 'Reference Listed Drug Characterization Protocol',
        revision: 'Rev 3',
        changedDate: '2024-05-15 09:20',
        changedBy: 'Michael Chang'
      },
      {
        id: 104,
        requirementName: 'Microbial Limits and Bioburden Testing Guidelines',
        revision: 'Rev 2',
        changedDate: '2024-05-10 14:15',
        changedBy: 'Emily Watson'
      },
      {
        id: 105,
        requirementName: 'Packaging Material Migration Testing Requirements',
        revision: 'Rev 1',
        changedDate: '2024-04-28 11:00',
        changedBy: 'Dr. Robert Vance'
      },
      {
        id: 106,
        requirementName: 'Elemental Impurities Risk Assessment Criteria',
        revision: 'Rev 2',
        changedDate: '2024-04-22 15:30',
        changedBy: 'David Miller'
      },
      {
        id: 107,
        requirementName: 'Blend Uniformity and Content Uniformity Parameters',
        revision: 'Rev 1',
        changedDate: '2024-04-18 13:45',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 108,
        requirementName: 'Residual Solvents USP <467> Acceptance Criteria',
        revision: 'Rev 1',
        changedDate: '2024-04-12 17:00',
        changedBy: 'Emily Watson'
      },
      {
        id: 109,
        requirementName: 'Forced Degradation Study Protocol Requirements',
        revision: 'Rev 2',
        changedDate: '2024-04-08 10:15',
        changedBy: 'Michael Chang'
      },
      {
        id: 110,
        requirementName: 'In-Vitro Release Testing (IVRT) Method Verification',
        revision: 'Rev 1',
        changedDate: '2024-03-30 16:50',
        changedBy: 'Dr. Robert Vance'
      }
    ];

    const filteredCatalog = otherReqsCatalog.filter(
      r => r.requirementName.toLowerCase() !== curReqName.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): AssignRequirementHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    if (this.activityName) {
      this.router.navigate(['/stages/wbs/requirements'], {
        queryParams: {
          activityName: this.activityName,
          activityCode: this.activityCode,
          slNo: this.slNo,
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Case',
          gateCode: this.gateCode || 'Gate 1',
          menuIndex: this.menuIndex
        }
      });
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
}
