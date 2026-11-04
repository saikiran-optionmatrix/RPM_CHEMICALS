import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

// @ts-ignore
const ExportingModule: any = HC_exporting;
// @ts-ignore
const ExportDataModule: any = HC_exportData;

if (typeof ExportingModule === 'function') {
  ExportingModule(Highcharts);
} else if (ExportingModule && typeof ExportingModule.default === 'function') {
  ExportingModule.default(Highcharts);
}

if (typeof ExportDataModule === 'function') {
  ExportDataModule(Highcharts);
} else if (ExportDataModule && typeof ExportDataModule.default === 'function') {
  ExportDataModule.default(Highcharts);
}

@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatInputModule, MatPaginatorModule, MatTooltipModule, RouterModule
  ],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrls: ['./dashboard-portfolio.component.scss']
})
export class DashboardPortfolioComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  pageIndex = 0;
  pageSize = 10;
  selectedGate = 'Gate 1';
  portfolioGates = [
    { code: 'Gate 1', name: 'Concept Approval', label: 'Gate 1' },
    { code: 'Gate 2', name: 'Route Selection', label: 'Gate 2' },
    { code: 'Gate 3', name: 'Registration & Pilot Readiness', label: 'Gate 3' },
    { code: 'Gate 4', name: 'Demo-Scale Proof', label: 'Gate 4' },
    { code: 'Gate 5', name: 'Commercial Readiness', label: 'Gate 5' }
  ];

  getGateTitle(gateCode: string): string {
    return `${gateCode} - Portfolio Summary`;
  }

  readonly stageNamesMap: Record<string, string> = {
    'S1': 'Opportunity Identification',
    'S2': 'Concept Screening & Feasibility',
    'S3': 'Route Scouting & Lab Synthesis',
    'S4': 'Process Optimization (Lab Scale)',
    'S5': 'Process Route Selection & Basis of Design',
    'S6': 'Bench-to-Pilot Process Development',
    'S7': 'Process Safety & Regulatory Studies',
    'S8': 'Regulatory Registration Filing (REACH / TSCA)',
    'S9': 'Pilot Plant Campaign',
    'S10': 'Demonstration-Scale Campaign',
    'S11': 'Commercial Plant Build & Commissioning',
    'S12': 'Commercial Launch & Ramp-Up'
  };

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Specialty Chemicals - SC',
    'Polymers & Resins - PR',
    'Agrochemicals - AC',
    'Industrial & Fine Chemicals - IF',
  ];

  readonly locationsList: string[] = [
    'All',
    'Ahmedabad',
    'Hyderabad',
    'Mumbai',
    'Pune',
    'Vadodara',
    'Bengaluru',
    'Chennai',
    'Delhi',
    'Baddi',
  ];

  onApplyFilters(): void {
    // UI filter apply trigger
  }

  portfolioActiveFilter: { type: 'bar'; stage: string; status: 'on-schedule' | 'delayed'; label: string } | null = null;

  allPortfolioProjects: any[] = [];
  filteredPortfolioProjects: any[] = [];
  paginatedProjects: any[] = [];

  chartCategories: string[] = [];
  chartOnTrackData: number[] = [];
  chartDueData: number[] = [];

  gatePieDataMap: any = {
    'Gate 1': [
      { name: 'Go', y: 11, color: '#2ecc71' },
      { name: 'Evaluation', y: 6, color: '#3366cc' },
      { name: 'Rework', y: 2, color: '#f39c12' },
      { name: 'Pending', y: 1, color: '#7f8c8d' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 2': [
      { name: 'Go', y: 9, color: '#2ecc71' },
      { name: 'Evaluation', y: 5, color: '#3366cc' },
      { name: 'Rework', y: 2, color: '#f39c12' },
      { name: 'Redirect', y: 2, color: '#9b59b6' },
      { name: 'Pending', y: 1, color: '#7f8c8d' }
    ],
    'Gate 3': [
      { name: 'Go', y: 8, color: '#2ecc71' },
      { name: 'Evaluation', y: 3, color: '#3366cc' },
      { name: 'Redirect', y: 3, color: '#9b59b6' },
      { name: 'Rework', y: 2, color: '#f39c12' },
      { name: 'Pending', y: 2, color: '#7f8c8d' }
    ],
    'Gate 4': [
      { name: 'Go', y: 6, color: '#2ecc71' },
      { name: 'Evaluation', y: 4, color: '#3366cc' },
      { name: 'Rework', y: 3, color: '#f39c12' },
      { name: 'Pending', y: 3, color: '#7f8c8d' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 5': [
      { name: 'Go', y: 10, color: '#2ecc71' },
      { name: 'Evaluation', y: 2, color: '#3366cc' },
      { name: 'Redirect', y: 2, color: '#9b59b6' },
      { name: 'Rework', y: 1, color: '#f39c12' },
      { name: 'Pending', y: 1, color: '#7f8c8d' }
    ]
  };

  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  navigateToStages(): void {
    this.router.navigate(['/dashboard/portfolio/stages-data-table']);
  }

  navigateToGates(): void {
    this.router.navigate(['/dashboard/portfolio/gates-data-table']);
  }

  ngOnInit() {
    this.initializePortfolioProjects();
    this.applyPortfolioFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderPortfolioStatusChart();
      this.renderPortfolioSummaryChart();
    }, 0);
  }

  initializePortfolioProjects(): void {
    const chemicalProducts = [
      { name: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project', family: 'Polymers & Resins', industry: 'Coatings & Adhesives' },
      { name: 'Hydrogenation Catalyst Development (Pd/C)', family: 'Specialty Chemicals', industry: 'Fine Chemicals & Pharma' },
      { name: 'Agrochemical Active Ingredient Multi-Step Synthesis Development', family: 'Agrochemicals', industry: 'Crop Protection' },
      { name: 'Solvent Recovery & Fractional Distillation Process Development', family: 'Industrial & Fine Chemicals', industry: 'Petrochemical & Industrial' },
      { name: 'Water-Dispersible Granule (WDG) Formulation Development', family: 'Agrochemicals', industry: 'Agriculture' },
      { name: 'Acrylic Emulsion Binder 50% Solids', family: 'Polymers & Resins', industry: 'Paints & Construction' },
      { name: 'Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)', family: 'Polymers & Resins', industry: 'Composites & Electronics' },
      { name: 'Sodium Lauryl Ether Sulfate (SLES) 70% Paste', family: 'Specialty Chemicals', industry: 'Personal Care & Detergents' },
      { name: 'Fumed Silica (Hydrophilic, 200 m2/g)', family: 'Specialty Chemicals', industry: 'Cosmetics & Silicone Rubber' },
      { name: 'Hydrogen Peroxide 50% w/w (Anthraquinone Process)', family: 'Industrial & Fine Chemicals', industry: 'Bleaching & Disinfection' },
    ];

    const stageSpecs = [
      { stage: 'S1', stageName: 'Opportunity Identification', onTrack: 12, due: 3, dates: ['10/01/26', '20/03/26', '25/06/26'] },
      { stage: 'S2', stageName: 'Concept Screening & Feasibility', onTrack: 16, due: 2, dates: ['20/03/26', '15/05/26', '30/07/26'] },
      { stage: 'S3', stageName: 'Route Scouting & Lab Synthesis', onTrack: 8, due: 4, dates: ['25/06/26', '10/08/26', '15/09/26'] },
      { stage: 'S4', stageName: 'Process Optimization (Lab Scale)', onTrack: 15, due: 5, dates: ['15/10/26', '30/11/26', '15/01/27'] },
      { stage: 'S5', stageName: 'Process Route Selection & Basis of Design', onTrack: 7, due: 3, dates: ['20/01/27', '28/02/27', '15/04/27'] },
      { stage: 'S6', stageName: 'Bench-to-Pilot Process Development', onTrack: 11, due: 1, dates: ['25/05/27', '10/07/27', '30/08/27'] },
      { stage: 'S7', stageName: 'Process Safety & Regulatory Studies', onTrack: 13, due: 4, dates: ['10/10/27', '15/11/27', '20/12/27'] },
      { stage: 'S8', stageName: 'Regulatory Registration Filing (REACH / TSCA)', onTrack: 8, due: 0, dates: ['20/02/28', '30/03/28', '15/05/28'] },
      { stage: 'S9', stageName: 'Pilot Plant Campaign', onTrack: 10, due: 2, dates: ['15/06/28', '20/08/28', '30/09/28'] },
      { stage: 'S10', stageName: 'Demonstration-Scale Campaign', onTrack: 14, due: 3, dates: ['20/11/28', '15/01/29', '28/02/29'] },
      { stage: 'S11', stageName: 'Commercial Plant Build & Commissioning', onTrack: 9, due: 2, dates: ['25/09/29', '15/11/29', '20/01/30'] },
      { stage: 'S12', stageName: 'Commercial Launch & Ramp-Up', onTrack: 7, due: 1, dates: ['15/03/30', '30/06/30', '30/09/30'] },
    ];

    this.allPortfolioProjects = [];
    this.chartCategories = [];
    this.chartOnTrackData = [];
    this.chartDueData = [];

    let nameIndex = 0;
    let codeCounter = 1;

    stageSpecs.forEach(spec => {
      this.chartCategories.push(spec.stage);
      this.chartOnTrackData.push(spec.onTrack);
      this.chartDueData.push(spec.due);

      for (let i = 0; i < spec.onTrack; i++) {
        const prod = chemicalProducts[nameIndex % chemicalProducts.length];
        this.allPortfolioProjects.push(this.createProject(prod, codeCounter++, spec.stage, 'on-schedule', spec.dates[i % spec.dates.length]));
        nameIndex++;
      }
      for (let i = 0; i < spec.due; i++) {
        const prod = chemicalProducts[nameIndex % chemicalProducts.length];
        this.allPortfolioProjects.push(this.createProject(prod, codeCounter++, spec.stage, 'delayed', spec.dates[i % spec.dates.length]));
        nameIndex++;
      }
    });
  }

  createProject(prod: { name: string; family: string; industry: string }, codeNum: number, stage: string, status: 'on-schedule' | 'delayed', completion: string) {
    const isDiscovery = codeNum <= 5;
    return {
      projectName: prod.name,
      projectCode: `2026/CHM/${codeNum.toString().padStart(3, '0')}`,
      productFamily: prod.family,
      endUseIndustry: prod.industry,
      currentStage: stage,
      scheduleStatus: status,
      s1: '10/01/26', s2: '20/03/26', s3: '25/06/26', s4: '15/10/26',
      s5: '20/01/27', s6: '25/05/27', s7: '10/10/27', s8: '20/02/28',
      s9: '15/06/28', s10: '20/11/28', s11: '25/09/29', s12: '15/03/30',
      completionDate: isDiscovery ? '15/06/28' : (completion || '30/09/30')
    };
  }

  applyPortfolioFilter() {
    let list = [...this.allPortfolioProjects];
    if (this.portfolioActiveFilter) {
      list = list.filter(p => p.currentStage === this.portfolioActiveFilter!.stage && p.scheduleStatus === this.portfolioActiveFilter!.status);
    }
    this.filteredPortfolioProjects = list;
    this.pageIndex = 0;
    this.updatePagination();
  }

  resetPortfolioFilter() {
    this.portfolioActiveFilter = null;
    this.applyPortfolioFilter();
    this.cdr.detectChanges();
  }

  onPortfolioChartBarClick(stage: string, status: 'on-schedule' | 'delayed') {
    const statusLabel = status === 'on-schedule' ? 'On Schedule' : 'Delayed';
    this.portfolioActiveFilter = {
      type: 'bar',
      stage,
      status,
      label: `${stage} • ${statusLabel}`
    };
    this.applyPortfolioFilter();
    this.cdr.detectChanges();
  }

  handlePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination() {
    const start = this.pageIndex * this.pageSize;
    this.paginatedProjects = this.filteredPortfolioProjects.slice(start, start + this.pageSize);
  }

  setGateCategory(gate: string) {
    this.selectedGate = gate;
    this.renderPortfolioSummaryChart();
    this.cdr.detectChanges();
  }

  renderPortfolioStatusChart() {
    const containerId = 'portfolioStatusChartContainer';
    if (!document.getElementById(containerId)) return;

    const self = this;

    Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null }, // Title moved to HTML
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: this.chartCategories,
        labels: { style: { fontWeight: 'bold' } }
      },
      yAxis: {
        min: 0,
        title: { text: 'No of projects' }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          const stageCode = this.x;
          const fullName = self.stageNamesMap[stageCode] || stageCode;
          let s = `<span style="font-size: 13px; font-weight: bold; color: #1e293b;">${stageCode} - ${fullName}</span><br/>`;
          this.points.forEach((point: any) => {
            s += `<span style="color:${point.series.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`;
          });
          return s;
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          cursor: 'pointer',
          dataLabels: { enabled: true },
          point: {
            events: {
              click: function (this: any) {
                const stage = this.category as string;
                const seriesName = this.series.name;
                const status = seriesName === 'Project on schedule' ? 'on-schedule' : 'delayed';
                self.onPortfolioChartBarClick(stage, status);
              }
            }
          }
        }
      },
      series: [
        { name: 'Project on schedule', color: '#00a859', type: 'column', data: this.chartOnTrackData },
        { name: 'Projects delayed', color: '#ed1c24', type: 'column', data: this.chartDueData }
      ]
    } as any);
  }

  renderPortfolioSummaryChart() {
    const containerId = 'portfolioSummaryPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const pieData = this.gatePieDataMap[this.selectedGate] || [];

    Highcharts.chart(containerId, {
      chart: { type: 'pie', backgroundColor: '#ffffff' },
      title: { text: null }, // Title moved to HTML
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          return `<b>${this.key}</b>: ${this.y} Projects (${this.percentage.toFixed(1)}%)`;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          innerSize: '0%',
          dataLabels: {
            enabled: true,
            distance: -35,
            useHTML: true,
            formatter: function (this: any) {
              return `<div style="text-align:center;color:white;font-weight:bold;font-size:12px;">${this.percentage.toFixed(0)}%</div>`;
            }
          }
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        useHTML: true,
        itemStyle: { color: '#333333' },
        labelFormatter: function (this: any) {
          return `<span style="font-weight:normal; margin-right: 5px;">${this.name}</span> <span style="font-weight:bold">${this.y}</span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Projects',
        data: pieData
      }]
    } as any);
  }



  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }
  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
