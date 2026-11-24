import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateCriteriaHistoryRecord {
  id?: number | string;
  subject: string;
  description: string;
  guidelines?: string;
  priority: string | boolean;
  mandatory: boolean;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-gate-criteria-history',
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
  templateUrl: './gate-criteria-history.component.html',
  styleUrl: './gate-criteria-history.component.scss',
})
export class GateCriteriaHistoryComponent implements OnInit {
  subject: string = '';
  description: string = '';
  priority: string | boolean = 'High';
  mandatory: boolean = true;
  gateContext: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: GateCriteriaHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['subject']) this.subject = params['subject'];
      if (params['description']) this.description = params['description'];
      if (params['priority'] !== undefined) {
        this.priority = params['priority'];
      }
      if (params['mandatory'] !== undefined) {
        this.mandatory = params['mandatory'] === 'true' || params['mandatory'] === true;
      }
      if (params['context']) this.gateContext = params['context'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  isPriority(val: any): boolean {
    return val === 'High' || val === true || val === 'true';
  }

  initHistoryRecords(): void {
    const curSubject = this.subject || 'Market Demand & Competitive Benchmark Assessment';
    const curDesc = this.description || 'Target applications, market size, competitor grades and customer needs documented and approved by commercial.';
    const curPriority = this.priority !== undefined ? this.priority : 'High';
    const curMandatory = this.mandatory !== undefined ? this.mandatory : true;
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
      `${curDesc} - Revised Guidelines & Compliance Scope`,
      `${curDesc} - Preliminary Specification Scope`,
      `${curDesc} - Baseline Assessment Outline`
    ];

    const selectedRevisions: GateCriteriaHistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      selectedRevisions.push({
        id: i + 1,
        subject: curSubject,
        description: i === 0 ? curDesc : descVariations[i % descVariations.length],
        guidelines: 'Guidelines.pdf',
        priority: i === 0 ? curPriority : (i % 2 === 0 ? 'High' : 'Medium'),
        mandatory: i === 0 ? curMandatory : (i % 2 === 0 ? true : false),
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog gate criteria for complete reference (Chemical Manufacturing)
    const catalogCriteria: GateCriteriaHistoryRecord[] = [
      {
        id: 101,
        subject: 'Raw Material Source & Vendor Qualification',
        description: 'Key raw material and precursor suppliers identified with secondary supplier qualified; technical specifications and COA confirmed.',
        guidelines: 'Raw_Material_Qualification_Spec.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2026-01-18 10:20',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 102,
        subject: 'Benchmark Resin & Competitive Chemical Characterization',
        description: 'Competitor benchmark grades characterized for chemical composition, solids %, viscosity, molecular weight, and performance profile.',
        guidelines: 'Benchmark_Profiling_Protocol.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2026-01-10 14:15',
        changedBy: 'Michael Chang'
      },
      {
        id: 103,
        subject: 'Target Product Profile (TPP) & End-Use Specification',
        description: 'Chemical product specifications documented — polymer solids %, glass transition temp (Tg), particle size distribution, and application criteria.',
        guidelines: 'Chemical_TPP_Specification.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2025-12-14 16:00',
        changedBy: 'Dr. Robert Vance'
      },
      {
        id: 104,
        subject: 'Reaction Chemistry & Synthesis Route Complexity Rating',
        description: 'Synthesis pathway complexity, selectivity, and exotherm risk rated (Low/Med/High) with process chemistry rationale.',
        guidelines: 'Reaction_Complexity_Assessment.pdf',
        priority: 'Medium',
        mandatory: false,
        changedDate: '2025-11-20 11:35',
        changedBy: 'Emily Watson'
      },
      {
        id: 105,
        subject: 'Cost of Manufacturing (COM) & Capex Feasibility',
        description: 'Preliminary chemical mass balance and economic model confirm raw material consumption and manufacturing cost within target margin.',
        guidelines: 'Mass_Balance_Cost_Model.pdf',
        priority: 'Medium',
        mandatory: false,
        changedDate: '2025-11-08 09:50',
        changedBy: 'David Miller'
      },
      {
        id: 106,
        subject: 'Process Safety Screening & Reaction Calorimetry (RC1)',
        description: 'Reaction calorimetry (RC1), runaway exotherm potential, and adiabatic temperature rise evaluated with emergency relief scope.',
        guidelines: 'Process_Safety_RC1_Protocol.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2025-10-25 15:40',
        changedBy: 'Sarah Jenkins'
      },
      {
        id: 107,
        subject: 'Environmental, EHS & Regulatory Registration Strategy',
        description: 'Chemical substance registration pathway confirmed (REACH, TSCA, GHS SDS classification, and VOC regulatory compliance).',
        guidelines: 'REACH_TSCA_Registration_Plan.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2025-10-10 13:25',
        changedBy: 'Michael Chang'
      },
      {
        id: 108,
        subject: 'Bulk Packaging, Storage Stability & Tank Compatibility',
        description: 'Bulk drum / IBC container compatibility, corrosion testing, inert blanketing, and shelf-life stability verified.',
        guidelines: 'Bulk_Packaging_Compatibility.pdf',
        priority: 'Medium',
        mandatory: false,
        changedDate: '2025-09-28 17:00',
        changedBy: 'Emily Watson'
      }
    ];

    const filteredCatalog = catalogCriteria.filter(
      c => c.subject.toLowerCase() !== curSubject.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): GateCriteriaHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onDownloadGuidelines(item: GateCriteriaHistoryRecord): void {
    console.log('Downloading guidelines for:', item.subject);
  }

  goBack(): void {
    if (this.gateContext) {
      this.router.navigate(['/gates', this.gateContext]);
    } else {
      this.location.back();
    }
  }
}
