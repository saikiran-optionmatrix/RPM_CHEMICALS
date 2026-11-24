import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

export interface BudgetItem {
  stage: string;
  deliverable: string;
  activity: string;
  allocation: string;
  standardHours: number;
  actualHours: number;
  staffCost: number;
  budget: number;
  materialCost: number;
  resourceCost: number;
  totalCost: number;
  usage: number;
  completion: number;
}

@Component({
  selector: 'app-project-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './project-budget.component.html',
  styleUrl: './project-budget.component.scss'
})
export class ProjectBudgetComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly numberFormatter = new Intl.NumberFormat('en-IN');
  private readonly sub = new Subscription();

  projectName = 'Acrylic Emulsion Binder 50% Solids';
  projectCode = '2026/CHM/006';

  readonly allRows: BudgetItem[] = [
    {
      stage: 'Opportunity Identification',
      deliverable: 'Market Demand & Application Scope',
      activity: 'Review industrial customer specifications, grade requirements and end-use application criteria',
      allocation: 'SJ',
      standardHours: 48,
      actualHours: 48,
      staffCost: 48000,
      budget: 65000,
      materialCost: 8000,
      resourceCost: 9000,
      totalCost: 65000,
      usage: 8000,
      completion: 100
    },
    {
      stage: 'Opportunity Identification',
      deliverable: 'Competitor Grade & Benchmark Characterization',
      activity: 'Benchmark competitor grade physicochemical properties (solids %, Tg, viscosity)',
      allocation: 'RK',
      standardHours: 40,
      actualHours: 40,
      staffCost: 40000,
      budget: 55000,
      materialCost: 9500,
      resourceCost: 5500,
      totalCost: 55000,
      usage: 9500,
      completion: 100
    },
    {
      stage: 'Concept Screening & Feasibility',
      deliverable: 'Reaction Chemistry & Pathway Screening',
      activity: 'Screen candidate synthetic pathways, core-shell emulsion monomers and initiator systems',
      allocation: 'AR',
      standardHours: 60,
      actualHours: 60,
      staffCost: 60000,
      budget: 85000,
      materialCost: 15000,
      resourceCost: 10000,
      totalCost: 85000,
      usage: 15000,
      completion: 100
    },
    {
      stage: 'Concept Screening & Feasibility',
      deliverable: 'Raw Material Sourcing & Regulatory Scoping',
      activity: 'Feedstock supplier pre-qualification, bulk monomer availability and REACH pre-registration',
      allocation: 'MK',
      standardHours: 35,
      actualHours: 35,
      staffCost: 35000,
      budget: 45000,
      materialCost: 5000,
      resourceCost: 5000,
      totalCost: 45000,
      usage: 5000,
      completion: 100
    },
    {
      stage: 'Route Scouting & Lab Synthesis',
      deliverable: 'Synthesis Route Evaluation & Reagent Selection',
      activity: 'Laboratory-scale emulsion polymerization scouting and monomer feed ratio optimization',
      allocation: 'DR',
      standardHours: 75,
      actualHours: 75,
      staffCost: 75000,
      budget: 110000,
      materialCost: 22000,
      resourceCost: 13000,
      totalCost: 110000,
      usage: 22000,
      completion: 100
    },
    {
      stage: 'Route Scouting & Lab Synthesis',
      deliverable: 'Catalyst Screening & Reaction Condition Scoping',
      activity: 'Thermal initiator screening (persulfate / redox system) and reaction temperature scoping',
      allocation: 'VN',
      standardHours: 50,
      actualHours: 50,
      staffCost: 50000,
      budget: 70000,
      materialCost: 12000,
      resourceCost: 8000,
      totalCost: 70000,
      usage: 12000,
      completion: 100
    },
    {
      stage: 'Process Optimization (Lab Scale)',
      deliverable: 'Reaction Parameter DoE & Yield Optimization',
      activity: 'Factorial DoE on surfactant concentration, feed rates, stirring speed and conversion rate',
      allocation: 'AP',
      standardHours: 80,
      actualHours: 76,
      staffCost: 76000,
      budget: 125000,
      materialCost: 28000,
      resourceCost: 18000,
      totalCost: 122000,
      usage: 28000,
      completion: 95
    },
    {
      stage: 'Process Optimization (Lab Scale)',
      deliverable: 'Work-Up, Crystallization & Solvent Recovery',
      activity: 'Post-polymerization steam stripping, residual monomer reduction (<50 ppm) and biocide dosing',
      allocation: 'SK',
      standardHours: 45,
      actualHours: 40,
      staffCost: 40000,
      budget: 60000,
      materialCost: 11000,
      resourceCost: 7000,
      totalCost: 58000,
      usage: 11000,
      completion: 90
    },
    {
      stage: 'Process Route Selection & Basis of Design',
      deliverable: 'Commercial Route Lock & Process Flow Diagram (PFD)',
      activity: 'Aspen Plus mass/energy balance modeling and commercial Process Flow Diagram (PFD)',
      allocation: 'PS',
      standardHours: 65,
      actualHours: 58,
      staffCost: 58000,
      budget: 90000,
      materialCost: 14000,
      resourceCost: 12000,
      totalCost: 84000,
      usage: 14000,
      completion: 85
    },
    {
      stage: 'Process Route Selection & Basis of Design',
      deliverable: 'Basis of Design & Energy/Mass Balance Model',
      activity: 'Basis of Design (BOD) package, utility balance and storage tank sizing',
      allocation: 'PR',
      standardHours: 50,
      actualHours: 42,
      staffCost: 42000,
      budget: 75000,
      materialCost: 16000,
      resourceCost: 11000,
      totalCost: 69000,
      usage: 15000,
      completion: 80
    },
    {
      stage: 'Bench-to-Pilot Process Development',
      deliverable: 'Scale-Up Kinetics & Mixing/Heat Transfer Studies',
      activity: 'Reactor impeller hydrodynamics, agitation Reynolds number and jacket cooling heat transfer',
      allocation: 'RK',
      standardHours: 90,
      actualHours: 65,
      staffCost: 65000,
      budget: 140000,
      materialCost: 42000,
      resourceCost: 23000,
      totalCost: 130000,
      usage: 38000,
      completion: 70
    },
    {
      stage: 'Bench-to-Pilot Process Development',
      deliverable: 'Separation, Distillation & Filtration Scale-Up',
      activity: 'Continuous cartridge filtration scale-up and automated viscosity adjustment system',
      allocation: 'MK',
      standardHours: 55,
      actualHours: 38,
      staffCost: 38000,
      budget: 85000,
      materialCost: 26000,
      resourceCost: 15000,
      totalCost: 79000,
      usage: 24000,
      completion: 65
    },
    {
      stage: 'Process Safety & Regulatory Studies',
      deliverable: 'Reaction Calorimetry (RC1) & Thermal Hazard Screening',
      activity: 'RC1 reaction calorimetry, heat flow monitoring, ΔHrxn and runaway exotherm modeling',
      allocation: 'SJ',
      standardHours: 70,
      actualHours: 45,
      staffCost: 45000,
      budget: 115000,
      materialCost: 35000,
      resourceCost: 20000,
      totalCost: 100000,
      usage: 30000,
      completion: 60
    },
    {
      stage: 'Process Safety & Regulatory Studies',
      deliverable: 'Process Hazard Analysis (HAZOP) & Safety Interlocks',
      activity: 'Facilitate plant HAZOP review, LOPA risk assessment and emergency relief vent sizing',
      allocation: 'DR',
      standardHours: 60,
      actualHours: 32,
      staffCost: 32000,
      budget: 80000,
      materialCost: 22000,
      resourceCost: 16000,
      totalCost: 70000,
      usage: 18000,
      completion: 55
    },
    {
      stage: 'Regulatory Registration Filing (REACH / TSCA)',
      deliverable: 'Chemical Registration Dossier Compilation (REACH / TSCA)',
      activity: 'Substance identification testing, 14-day ecotoxicity and IUCLID dossier submission',
      allocation: 'AR',
      standardHours: 60,
      actualHours: 30,
      staffCost: 30000,
      budget: 95000,
      materialCost: 32000,
      resourceCost: 18000,
      totalCost: 80000,
      usage: 25000,
      completion: 50
    },
    {
      stage: 'Pilot Plant Campaign',
      deliverable: 'Pilot Plant Cleaning, Line Clearance & Charging',
      activity: '500L pilot reactor system cleaning validation, nitrogen inertization and raw material staging',
      allocation: 'VN',
      standardHours: 50,
      actualHours: 25,
      staffCost: 25000,
      budget: 75000,
      materialCost: 28000,
      resourceCost: 16000,
      totalCost: 69000,
      usage: 22000,
      completion: 45
    },
    {
      stage: 'Pilot Plant Campaign',
      deliverable: 'Demonstration Batch Execution & In-Process QC',
      activity: 'Execute 500L pilot batch, inline solids/pH monitoring and emulsion stability trials',
      allocation: 'AP',
      standardHours: 120,
      actualHours: 45,
      staffCost: 45000,
      budget: 220000,
      materialCost: 85000,
      resourceCost: 45000,
      totalCost: 175000,
      usage: 65000,
      completion: 35
    },
    {
      stage: 'Demonstration-Scale Campaign',
      deliverable: 'Multi-Kilo / Semi-Commercial Demonstration Run',
      activity: 'Execute 2,500L semi-commercial campaign under distributed control system (DCS) automation',
      allocation: 'RK',
      standardHours: 140,
      actualHours: 35,
      staffCost: 35000,
      budget: 280000,
      materialCost: 110000,
      resourceCost: 65000,
      totalCost: 210000,
      usage: 75000,
      completion: 25
    },
    {
      stage: 'Commercial Plant Build & Commissioning',
      deliverable: 'Detailed Engineering, Equipment Procurement & Installation',
      activity: 'Procure 20,000L glass-lined emulsion reactors, cooling skids and automated bulk storage',
      allocation: 'MK',
      standardHours: 160,
      actualHours: 25,
      staffCost: 25000,
      budget: 350000,
      materialCost: 150000,
      resourceCost: 95000,
      totalCost: 270000,
      usage: 80000,
      completion: 15
    },
    {
      stage: 'Commercial Launch & Ramp-Up',
      deliverable: 'First Commercial Production Campaign Execution',
      activity: 'Execute maiden 50 MT/day commercial production run and packaging in 1,000L IBC containers',
      allocation: 'SJ',
      standardHours: 180,
      actualHours: 10,
      staffCost: 10000,
      budget: 450000,
      materialCost: 195000,
      resourceCost: 125000,
      totalCost: 330000,
      usage: 50000,
      completion: 5
    }
  ];

  displayedRows: BudgetItem[] = [];
  stages: string[] = [];
  deliverables: string[] = [];

  get totalBudget(): number {
    return this.displayedRows.reduce((sum, r) => sum + r.budget, 0);
  }

  get totalActual(): number {
    return this.displayedRows.reduce((sum, r) => sum + r.totalCost, 0);
  }

  get overallCompletion(): number {
    if (!this.displayedRows.length) return 0;
    const avg = this.displayedRows.reduce((sum, r) => sum + r.completion, 0) / this.displayedRows.length;
    return Math.round(avg);
  }

  get projectedBudget(): number {
    const actual = this.totalActual;
    const comp = this.overallCompletion;
    if (comp <= 0) return this.totalBudget;
    return Math.round((actual / comp) * 100);
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParamMap;
    this.projectName = queryParams.get('projectName') || queryParams.get('name') || this.projectName;
    this.projectCode = queryParams.get('projectCode') || queryParams.get('code') || this.projectCode;

    this.sub.add(
      this.route.queryParams.subscribe(params => {
        if (params['projectName'] || params['name']) {
          this.projectName = params['projectName'] || params['name'];
        }
        if (params['projectCode'] || params['code']) {
          this.projectCode = params['projectCode'] || params['code'];
        }
      })
    );

    this.stages = [...new Set(this.allRows.map(r => r.stage))];
    this.deliverables = [...new Set(this.allRows.map(r => r.deliverable))];
    this.displayedRows = [...this.allRows];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  applyFilters(stage: string, deliverable: string): void {
    this.displayedRows = this.allRows.filter(r =>
      (!stage || stage === 'Any' || stage === 'All' || r.stage === stage) &&
      (!deliverable || deliverable === 'Any' || deliverable === 'All' || r.deliverable === deliverable)
    );
  }

  fmt(n: number): string {
    return this.numberFormatter.format(n);
  }

  getCompColor(val: number): string {
    if (val >= 75) return '#4caf50'; // Green
    if (val >= 40) return '#ff9800'; // Orange
    return '#f44336'; // Red
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParamsHandling: 'preserve'
    });
  }
}
