import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface WbsActivityHistoryRecord {
  id?: number | string;
  slNo: string;
  activity: string;
  activityCode: string;
  tasks: string;
  requirements: string;
  predecessor: string;
  duration: string;
  effort: string;
  cost: string;
  applicability: string;
  description: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-stages-wbs-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-wbs-history.component.html',
  styleUrl: './stages-wbs-history.component.scss',
})
export class StagesWbsHistoryComponent implements OnInit {
  slNo: string = '';
  activityName: string = '';
  activityCode: string = '';
  tasks: string = '';
  requirements: string = '';
  predecessor: string = '';
  duration: string = '';
  effort: string = '';
  cost: string = '';
  applicability: string = '';
  description: string = '';

  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: WbsActivityHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['task']) this.activityName = params['task'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['tasks']) this.tasks = params['tasks'];
      if (params['requirements']) this.requirements = params['requirements'];
      if (params['predecessor']) this.predecessor = params['predecessor'];
      if (params['duration']) this.duration = params['duration'];
      if (params['effort']) this.effort = params['effort'];
      if (params['cost']) this.cost = params['cost'];
      if (params['applicability']) this.applicability = params['applicability'];
      if (params['description']) this.description = params['description'];

      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curSlNo = this.slNo || '1.1.1';
    const curActivity = this.activityName || 'Review industrial application demand, customer specifications and market opportunities';
    const curCode = this.activityCode || '1.1.1';
    const curTasks = this.tasks || '8';
    const curReqs = this.requirements || '7';
    const curPred = this.predecessor || '—';
    const curDuration = this.duration || '0';
    const curEffort = this.effort || '0';
    const rawCost = this.cost || '1200000';
    const curCost = rawCost.startsWith('$') ? rawCost : `$${Number(rawCost).toLocaleString()}`;
    const curApplicability = this.applicability || 'All Products';
    const curDescription = this.description || 'Program start';

    // Historical revisions for the selected activity
    const selectedRevisions: WbsActivityHistoryRecord[] = [
      {
        id: 1,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: curTasks,
        requirements: curReqs,
        predecessor: curPred,
        duration: curDuration,
        effort: curEffort,
        cost: curCost,
        applicability: curApplicability,
        description: curDescription,
        revision: 'Rev 3 (Current)',
        changedDate: '2026-02-15'
      },
      {
        id: 2,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: '6',
        requirements: '5',
        predecessor: '—',
        duration: '3',
        effort: '24',
        cost: '$2,400',
        applicability: curApplicability,
        description: 'Adjusted scope to incorporate FDA guideline clarifications.',
        revision: 'Rev 2',
        changedDate: '2026-01-20'
      },
      {
        id: 3,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: '4',
        requirements: '4',
        predecessor: '—',
        duration: '4',
        effort: '32',
        cost: '$3,200',
        applicability: curApplicability,
        description: 'Initial activity draft and workflow baseline.',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    // Other activity records from the catalog
    const otherActivities: WbsActivityHistoryRecord[] = [
      {
        id: 4,
        slNo: '0.1.2',
        activity: 'Country & Regulatory Scope Identification',
        activityCode: 'ACT-002',
        tasks: '1',
        requirements: '9',
        predecessor: '7',
        duration: '2',
        effort: '12',
        cost: '$1,200',
        applicability: 'All Products',
        description: 'Identify target geographies, regulatory pathways and filing timelines',
        revision: 'Rev 2'
      },
      {
        id: 5,
        slNo: '0.1.3',
        activity: 'Preliminary COGs and CAPEX Estimation',
        activityCode: 'ACT-003',
        tasks: '7',
        requirements: '8',
        predecessor: '5',
        duration: '2',
        effort: '14',
        cost: '$1,400',
        applicability: 'All Products',
        description: 'Estimate initial Cost of Goods and manufacturing plant CAPEX requirements',
        revision: 'Rev 1'
      },
      {
        id: 6,
        slNo: '0.2.1',
        activity: 'Market Sizing & Forecast Analysis',
        activityCode: 'ACT-004',
        tasks: '9',
        requirements: '1',
        predecessor: '4',
        duration: '3',
        effort: '18',
        cost: '$1,800',
        applicability: 'All Products',
        description: 'Evaluate IQVIA sales data, market volume and 10-year sales curve',
        revision: 'Rev 1'
      },
      {
        id: 7,
        slNo: '0.2.2',
        activity: 'NPV & Commercial Attractiveness Model',
        activityCode: 'ACT-005',
        tasks: '5',
        requirements: '11',
        predecessor: '6',
        duration: '2',
        effort: '10',
        cost: '$1,000',
        applicability: 'All Products',
        description: 'Compute Net Present Value (NPV), IRR and payback horizon',
        revision: 'Rev 1'
      },
      {
        id: 8,
        slNo: '1.1.1',
        activity: 'Review industrial application demand, customer specifications and market opportunities',
        activityCode: 'CHM-T001',
        tasks: '4',
        requirements: '5',
        predecessor: '—',
        duration: '5',
        effort: '100',
        cost: '$10,000',
        applicability: 'All Products',
        description: 'Review industrial application demand, customer specifications and market opportunities (CHM-T001)',
        revision: 'Rev 2'
      },
      {
        id: 9,
        slNo: '1.1.2',
        activity: 'Benchmark competing chemical grades, suppliers and production technologies',
        activityCode: 'CHM-T002',
        tasks: '4',
        requirements: '5',
        predecessor: '1.1.1 (FS)',
        duration: '5',
        effort: '100',
        cost: '$10,000',
        applicability: 'All Products',
        description: 'Benchmark competing chemical grades, suppliers and production technologies (CHM-T002)',
        revision: 'Rev 1'
      },
      {
        id: 10,
        slNo: '1.2.1',
        activity: 'Define target product profile, purity, concentration and performance attributes',
        activityCode: 'CHM-T003',
        tasks: '4',
        requirements: '5',
        predecessor: '1.2.0 (FS)',
        duration: '5',
        effort: '100',
        cost: '$10,000',
        applicability: 'All Products',
        description: 'Define target product profile, purity, concentration and performance attributes (CHM-T003)',
        revision: 'Rev 1'
      },
      {
        id: 11,
        slNo: '1.2.2',
        activity: 'Prepare preliminary business case, project economics and opportunity assessment',
        activityCode: 'CHM-T004',
        tasks: '4',
        requirements: '5',
        predecessor: '1.2.1 (FS)',
        duration: '5',
        effort: '100',
        cost: '$10,000',
        applicability: 'All Products',
        description: 'Prepare preliminary business case, project economics and opportunity assessment (CHM-T004)',
        revision: 'Rev 1'
      },
      {
        id: 12,
        slNo: '2.1.1',
        activity: 'Screen reaction chemistry, formulation options and product feasibility',
        activityCode: 'CHM-T005',
        tasks: '4',
        requirements: '5',
        predecessor: 'Stage start',
        duration: '5',
        effort: '75',
        cost: '$7,500',
        applicability: 'All Products',
        description: 'Screen reaction chemistry, formulation options and product feasibility (CHM-T005)',
        revision: 'Rev 1'
      }
    ];

    const filteredOther = otherActivities.filter(
      a => a.activity.toLowerCase() !== curActivity.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRecords(): WbsActivityHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/stages/wbs'], {
      queryParams: {
        stageCode: this.stageCode || 'S1',
        stageName: this.stageName || 'Business Case',
        gateCode: this.gateCode || 'Gate 1'
      }
    });
  }
}
