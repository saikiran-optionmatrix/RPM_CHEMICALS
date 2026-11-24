import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateHistoryRecord {
  id?: number | string;
  status: boolean;
  gateCode: string;
  name: string;
  division: string;
  description: string;
  stageCode: string;
  workflow: string;
  count: number;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-gates-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './gates-history.component.html',
  styleUrl: './gates-history.component.scss',
})
export class GatesHistoryComponent implements OnInit {
  gateCode: string = '';
  gateName: string = '';
  stageCode: string = '';
  division: string = '';
  description: string = '';
  workflow: string = '';
  count: number = 0;
  status: boolean = true;
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: GateHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['gateName']) this.gateName = params['gateName'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['division']) this.division = params['division'];
      if (params['description']) this.description = params['description'];
      if (params['workflow']) this.workflow = params['workflow'];
      if (params['count']) this.count = Number(params['count']) || 0;
      if (params['status'] !== undefined) this.status = params['status'] === 'true' || params['status'] === true;
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curCode = this.gateCode || 'Gate 1';
    const curName = this.gateName || 'Concept Approval';
    const curStage = this.stageCode || 'S2';
    const curDiv = this.division || 'Specialty Chemicals - SC';
    const curDesc = this.description || 'Concept Approval (Opportunity screening & technical feasibility)';
    const curWorkflow = this.workflow || '7/7';
    const curCount = this.count || 7;
    const curStatus = this.status !== undefined ? this.status : true;
    const count = this.historyCount || 3;

    const baseDates = [
      '2026-02-15 14:30',
      '2026-01-20 11:15',
      '2025-12-10 09:45',
      '2025-11-05 16:20',
      '2025-10-12 10:10'
    ];

    const users = [
      'Dr. Robert Vance',
      'Sarah Jenkins',
      'Michael Chang',
      'Emily Watson',
      'David Miller'
    ];

    const descVariations = [
      curDesc,
      `${curDesc} - Revised Checklist & Workflow Scope`,
      `${curDesc} - Initial Specification Baseline`,
      `${curDesc} - Concept Review Draft`
    ];

    const workflowVariations = [
      curWorkflow,
      '6/6',
      '5/5',
      '7/7',
      '4/5'
    ];

    const countVariations = [
      curCount,
      Math.max(1, curCount - 1),
      Math.max(1, curCount - 2),
      Math.max(1, curCount + 1)
    ];

    const selectedRevisions: GateHistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      selectedRevisions.push({
        id: i + 1,
        status: i === 0 ? curStatus : true,
        gateCode: curCode,
        name: curName,
        division: curDiv,
        description: i === 0 ? curDesc : descVariations[i % descVariations.length],
        stageCode: curStage,
        workflow: i === 0 ? curWorkflow : workflowVariations[i % workflowVariations.length],
        count: i === 0 ? curCount : countVariations[i % countVariations.length],
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog gates for rich history reference (Chemical Manufacturing)
    const catalogGates: GateHistoryRecord[] = [
      {
        id: 101,
        status: true,
        gateCode: 'Gate 1',
        name: 'Concept Approval',
        division: 'Specialty Chemicals - SC',
        description: 'Concept Approval (Opportunity screening & technical feasibility)',
        stageCode: 'S2',
        workflow: '7/7',
        count: 7,
        changedDate: '2026-02-15 14:30',
        changedBy: 'Dr. Robert Vance'
      },
      {
        id: 102,
        status: true,
        gateCode: 'Gate 2',
        name: 'Process Route Selection',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR',
        description: 'Process Route Selection & Basis of Design',
        stageCode: 'S5',
        workflow: '6/6',
        count: 6,
        changedDate: '2026-01-18 10:20',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 103,
        status: true,
        gateCode: 'Gate 3',
        name: 'Registration & Pilot Readiness',
        division: 'Specialty Chemicals - SC',
        description: 'Process Safety, REACH/TSCA Registration & Pilot Readiness',
        stageCode: 'S7',
        workflow: '6/6',
        count: 6,
        changedDate: '2025-12-14 16:00',
        changedBy: 'Michael Chang'
      },
      {
        id: 104,
        status: true,
        gateCode: 'Gate 4',
        name: 'Demo-Scale Proof',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR',
        description: 'Demonstration-Scale Campaign & Customer Qualification',
        stageCode: 'S10',
        workflow: '6/6',
        count: 6,
        changedDate: '2025-11-20 11:35',
        changedBy: 'Emily Watson'
      },
      {
        id: 105,
        status: true,
        gateCode: 'Gate 5',
        name: 'Commercial Production Readiness',
        division: 'Specialty Chemicals - SC',
        description: 'Commercial Plant Build, Commissioning & Handover',
        stageCode: 'S11',
        workflow: '5/5',
        count: 5,
        changedDate: '2025-10-08 15:40',
        changedBy: 'David Miller'
      }
    ];

    const filteredCatalog = catalogGates.filter(
      g => g.gateCode.toLowerCase() !== curCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): GateHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/gates']);
  }
}
