import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface StageHistoryRecord {
  id?: number | string;
  stageName: string;
  division: string;
  stageCode: string;
  sequence: string;
  gateCode: string;
  planEffort: number;
  planDuration: number;
  manPowerBudget?: string;
  materialBudget: string;
  resourceBudget?: string;
  description: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-stages-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-history.component.html',
  styleUrl: './stages-history.component.scss',
})
export class StagesHistoryComponent implements OnInit {
  stageName: string = '';
  division: string = '';
  stageCode: string = '';
  sequence: string = '';
  gateCode: string = '';
  planEffort: number = 0;
  planDuration: number = 0;
  manPowerBudget: string = '';
  materialBudget: string = '';
  resourceBudget: string = '';
  stageDescription: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: StageHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['division']) this.division = params['division'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['sequence']) this.sequence = params['sequence'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['planEffort'] !== undefined) this.planEffort = Number(params['planEffort']) || 0;
      if (params['planDuration'] !== undefined) this.planDuration = Number(params['planDuration']) || 0;
      if (params['manPowerBudget']) this.manPowerBudget = params['manPowerBudget'];
      if (params['materialBudget']) this.materialBudget = params['materialBudget'];
      if (params['resourceBudget']) this.resourceBudget = params['resourceBudget'];
      if (params['stageDescription']) this.stageDescription = params['stageDescription'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryData();
    });
  }

  initHistoryData(): void {
    const curStageName = this.stageName || 'Opportunity Identification';
    const curDivision = this.division || 'Specialty Chemicals - SC';
    const curStageCode = this.stageCode || 'S1';
    const curSeq = this.sequence || '1';
    const curGate = this.gateCode || 'Gate 1';
    const curPlanEffort = this.planEffort || 80;
    const curPlanDuration = this.planDuration || 10;
    const curManPowerBudget = this.manPowerBudget || '₹ 3,20,000';
    const curMaterialBudget = this.materialBudget || '₹ 0';
    const curResourceBudget = this.resourceBudget || '₹ 0';
    const curDescription = this.stageDescription || 'Identify and prioritize product and market opportunities from customer demand, competitor gaps and technology trends.';

    // Historical revisions for the selected stage (matching image fields)
    const selectedRevisions: StageHistoryRecord[] = [
      {
        id: 1,
        stageName: curStageName,
        division: curDivision,
        stageCode: curStageCode,
        sequence: curSeq,
        gateCode: curGate,
        planEffort: curPlanEffort,
        planDuration: curPlanDuration,
        manPowerBudget: curManPowerBudget,
        materialBudget: curMaterialBudget,
        resourceBudget: curResourceBudget,
        description: curDescription,
        revision: 'Rev 3 (Current)',
        changedDate: '2026-02-15'
      },
      {
        id: 2,
        stageName: curStageName,
        division: curDivision,
        stageCode: curStageCode,
        sequence: curSeq,
        gateCode: curGate,
        planEffort: 90,
        planDuration: 12,
        manPowerBudget: '₹ 3,40,000',
        materialBudget: '₹ 18,000',
        resourceBudget: '₹ 5,000',
        description: 'Intermediate stage draft with adjusted duration and material budget allocation.',
        revision: 'Rev 2',
        changedDate: '2026-01-20'
      },
      {
        id: 3,
        stageName: curStageName,
        division: curDivision,
        stageCode: curStageCode,
        sequence: curSeq,
        gateCode: curGate,
        planEffort: 100,
        planDuration: 15,
        manPowerBudget: '₹ 3,60,000',
        materialBudget: '₹ 20,000',
        resourceBudget: '₹ 10,000',
        description: 'Initial stage baseline created for chemical product feasibility study.',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    // Other stages history catalog (Chemical Manufacturing)
    const otherStages: StageHistoryRecord[] = [
      {
        id: 4,
        stageName: 'Concept Screening & Feasibility',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR',
        stageCode: 'S2',
        sequence: '2.0',
        gateCode: 'Gate 1',
        planEffort: 900,
        planDuration: 60,
        materialBudget: '$ 40,000',
        description: 'Assess technical, economic and regulatory feasibility of candidate chemistries and products.',
        revision: 'Rev 2'
      },
      {
        id: 5,
        stageName: 'Route Scouting & Lab Synthesis',
        division: 'Specialty Chemicals - SC',
        stageCode: 'S3',
        sequence: '3.0',
        gateCode: '-',
        planEffort: 1400,
        planDuration: 90,
        materialBudget: '$ 85,000',
        description: 'Screen synthesis routes, catalysts and raw materials and prove the chemistry at laboratory scale.',
        revision: 'Rev 1'
      },
      {
        id: 6,
        stageName: 'Raw Material Sourcing & Specification',
        division: 'Specialty Chemicals - SC, Agrochemicals - AG',
        stageCode: 'S4',
        sequence: '4.0',
        gateCode: '-',
        planEffort: 600,
        planDuration: 45,
        materialBudget: '$ 30,000',
        description: 'Establish raw material specs, qualify suppliers and secure developmental material samples.',
        revision: 'Rev 1'
      },
      {
        id: 7,
        stageName: 'Process Optimization (Lab Scale)',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR',
        stageCode: 'S5',
        sequence: '5.0',
        gateCode: 'Gate 2',
        planEffort: 1800,
        planDuration: 120,
        materialBudget: '$ 110,000',
        description: 'Optimize reaction conditions, yield, selectivity and work-up procedures at bench scale.',
        revision: 'Rev 1'
      },
      {
        id: 8,
        stageName: 'Process Safety & Hazard Assessment (PHA / HAZOP)',
        division: 'Specialty Chemicals - SC',
        stageCode: 'S6',
        sequence: '6.0',
        gateCode: '-',
        planEffort: 800,
        planDuration: 60,
        materialBudget: '$ 45,000',
        description: 'Perform reaction calorimetry, thermal hazard screening, HAZOP and safety engineering design.',
        revision: 'Rev 1'
      },
      {
        id: 9,
        stageName: 'Pilot Plant Trial & Scale-Up',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR',
        stageCode: 'S7',
        sequence: '7.0',
        gateCode: 'Gate 3',
        planEffort: 2400,
        planDuration: 120,
        materialBudget: '$ 180,000',
        description: 'Scale up process to pilot plant, demonstrate process safety, mass and energy balances and generate samples.',
        revision: 'Rev 1'
      },
      {
        id: 10,
        stageName: 'Quality Control & Analytical Method Validation',
        division: 'Specialty Chemicals - SC',
        stageCode: 'S8',
        sequence: '8.0',
        gateCode: '-',
        planEffort: 1000,
        planDuration: 75,
        materialBudget: '$ 55,000',
        description: 'Validate QC analytical methods, set product specs and complete stability testing protocols.',
        revision: 'Rev 1'
      },
      {
        id: 11,
        stageName: 'Environmental & Regulatory Compliance (REACH / TSCA)',
        division: 'Specialty Chemicals - SC, Petrochemicals & Solvents - PS',
        stageCode: 'S9',
        sequence: '9.0',
        gateCode: '-',
        planEffort: 800,
        planDuration: 90,
        materialBudget: '$ 65,000',
        description: 'Complete ecotox testing, regulatory registrations (REACH, TSCA, GHS SDS) and environmental permits.',
        revision: 'Rev 1'
      },
      {
        id: 12,
        stageName: 'Demonstration-Scale Campaign & Customer Sampling',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR',
        stageCode: 'S10',
        sequence: '10.0',
        gateCode: 'Gate 4',
        planEffort: 2000,
        planDuration: 90,
        materialBudget: '$ 220,000',
        description: 'Execute demo-scale batches, generate commercial customer qualification samples and validate run metrics.',
        revision: 'Rev 1'
      },
      {
        id: 13,
        stageName: 'Detailed Engineering & Commercial Plant Design',
        division: 'Specialty Chemicals - SC',
        stageCode: 'S11',
        sequence: '11.0',
        gateCode: 'Gate 5',
        planEffort: 3200,
        planDuration: 150,
        materialBudget: '$ 350,000',
        description: 'Deliver commercial plant basic & detailed engineering package, Capex authorization and EPC handover.',
        revision: 'Rev 1'
      },
      {
        id: 14,
        stageName: 'Commercial Production Handover & Market Launch',
        division: 'Specialty Chemicals - SC, Polymers & Resins - PR, Agrochemicals - AG',
        stageCode: 'S12',
        sequence: '12.0',
        gateCode: '-',
        planEffort: 1200,
        planDuration: 60,
        materialBudget: '$ 75,000',
        description: 'Commission commercial unit, achieve steady-state operations and hand over to manufacturing operations.',
        revision: 'Rev 1'
      }
    ];

    otherStages.forEach(st => {
      if (!st.manPowerBudget) st.manPowerBudget = '₹ 4,00,000';
      if (!st.resourceBudget) st.resourceBudget = '₹ 50,000';
    });

    const filteredOther = otherStages.filter(
      s => s.stageCode.toLowerCase() !== curStageCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRecords(): StageHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/stages']);
  }
}
