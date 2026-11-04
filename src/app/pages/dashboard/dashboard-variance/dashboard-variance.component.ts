import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

import { MatIconModule } from '@angular/material/icon';

// Bulletproof Angular 17+ / TypeScript Strict Mode Wrapper
const ExportingModule: any = HC_exporting;
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
  selector: 'app-dashboard-variance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-variance.component.html',
  styleUrls: ['./dashboard-variance.component.scss']
})
export class DashboardVarianceComponent implements OnInit, AfterViewInit {
  projects = [
    'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
    'Hydrogenation Catalyst Development (Pd/C)',
    'Agrochemical Active Ingredient Multi-Step Synthesis Development',
    'Solvent Recovery & Fractional Distillation Process Development',
    'Water-Dispersible Granule (WDG) Formulation Development',
    'Acrylic Emulsion Binder 50% Solids',
    'Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)',
    'Sodium Lauryl Ether Sulfate (SLES) 70% Paste',
    'Fumed Silica (Hydrophilic, 200 m2/g)',
    'Hydrogen Peroxide 50% w/w (Anthraquinone Process)'
  ];

  varianceStages = [
    { key: 'Phase 1', label: 'Phase 1 - Concept & Feasibility (S1-S2)', shortLabel: 'Phase 1' },
    { key: 'Phase 2', label: 'Phase 2 - Route Development & Selection (S3-S5)', shortLabel: 'Phase 2' },
    { key: 'Phase 3', label: 'Phase 3 - Pilot Development & Safety (S6-S7)', shortLabel: 'Phase 3' },
    { key: 'Phase 4', label: 'Phase 4 - Registration & Scale-Up (S8-S10)', shortLabel: 'Phase 4' },
    { key: 'Phase 5', label: 'Phase 5 - Commercial Plant & Launch (S11-S12)', shortLabel: 'Phase 5' }
  ];

  selectedBudgetProject = 'All Projects';
  selectedVarianceStage = 'Phase 1';

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
    this.onBudgetProjectChange();
  }

  readonly moduleShortForms: Record<string, string> = {
    'Raw Material & Route Assessment': 'Raw Material & Route',
    'Reaction Screening & Compatibility': 'Reaction Screening',
    'Feasibility & Business Case': 'Feasibility & Business Case',
    'Route Scouting & Catalyst Selection': 'Route Scouting',
    'Reaction Condition & Yield Optimization': 'Condition & Yield',
    'Route Lock & Basis of Design': 'Route Lock',
    'Pilot Process Development & Optimization': 'Pilot Dev & Optimization',
    'Analytical & Performance Method Development': 'Analytical Method Dev',
    'Process Hazard Analysis & Tech Transfer': 'PHA & Tech Transfer',
    'REACH / TSCA Dossier Preparation & Filing': 'REACH / TSCA Dossier',
    'Pilot Plant Campaign Execution': 'Pilot Campaign',
    'Demonstration-Scale Campaign & PPQ': 'Demo Campaign & PPQ',
    'Commercial Plant Commissioning & Qualification': 'Plant Commissioning',
    'Commercial Launch Inventory & Supply Chain Setup': 'Commercial Launch'
  };

  budgetGanttData: any[] = [
    // Phase 1 - Concept & Feasibility
    { stage: 'Phase 1 - Concept & Feasibility', stageCode: 'Phase 1', module: 'Raw Material & Route Assessment', allocated: 45000, spent: 42000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 1 - Concept & Feasibility', stageCode: 'Phase 1', module: 'Reaction Screening & Compatibility', allocated: 55000, spent: 51000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 1 - Concept & Feasibility', stageCode: 'Phase 1', module: 'Feasibility & Business Case', allocated: 40000, spent: 38000, completion: 95, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },

    // Phase 2 - Route Development & Selection
    { stage: 'Phase 2 - Route Development & Selection', stageCode: 'Phase 2', module: 'Route Scouting & Catalyst Selection', allocated: 75000, spent: 71000, completion: 95, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 2 - Route Development & Selection', stageCode: 'Phase 2', module: 'Reaction Condition & Yield Optimization', allocated: 60000, spent: 58000, completion: 97, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 2 - Route Development & Selection', stageCode: 'Phase 2', module: 'Route Lock & Basis of Design', allocated: 65000, spent: 62000, completion: 95, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },

    // Phase 3 - Pilot Development & Safety
    { stage: 'Phase 3 - Pilot Development & Safety', stageCode: 'Phase 3', module: 'Pilot Process Development & Optimization', allocated: 95000, spent: 88000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 3 - Pilot Development & Safety', stageCode: 'Phase 3', module: 'Analytical & Performance Method Development', allocated: 70000, spent: 65000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 3 - Pilot Development & Safety', stageCode: 'Phase 3', module: 'Process Hazard Analysis & Tech Transfer', allocated: 45000, spent: 41000, completion: 91, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },

    // Phase 4 - Registration & Scale-Up
    { stage: 'Phase 4 - Registration & Scale-Up', stageCode: 'Phase 4', module: 'REACH / TSCA Dossier Preparation & Filing', allocated: 80000, spent: 74000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 4 - Registration & Scale-Up', stageCode: 'Phase 4', module: 'Pilot Plant Campaign Execution', allocated: 110000, spent: 102000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 4 - Registration & Scale-Up', stageCode: 'Phase 4', module: 'Demonstration-Scale Campaign & PPQ', allocated: 95000, spent: 89000, completion: 94, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },

    // Phase 5 - Commercial Plant & Launch
    { stage: 'Phase 5 - Commercial Plant & Launch', stageCode: 'Phase 5', module: 'Commercial Plant Commissioning & Qualification', allocated: 150000, spent: 142000, completion: 95, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },
    { stage: 'Phase 5 - Commercial Plant & Launch', stageCode: 'Phase 5', module: 'Commercial Launch Inventory & Supply Chain Setup', allocated: 90000, spent: 84000, completion: 93, project: 'Waterborne Polyurethane Dispersion (PUD) Discovery Project' },

    // Acrylic Emulsion Binder Project data
    { stage: 'Phase 1 - Concept & Feasibility', stageCode: 'Phase 1', module: 'Raw Material & Route Assessment', allocated: 42000, spent: 39000, completion: 93, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 1 - Concept & Feasibility', stageCode: 'Phase 1', module: 'Reaction Screening & Compatibility', allocated: 50000, spent: 46000, completion: 92, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 1 - Concept & Feasibility', stageCode: 'Phase 1', module: 'Feasibility & Business Case', allocated: 38000, spent: 34000, completion: 89, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 2 - Route Development & Selection', stageCode: 'Phase 2', module: 'Route Scouting & Catalyst Selection', allocated: 68000, spent: 63000, completion: 93, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 2 - Route Development & Selection', stageCode: 'Phase 2', module: 'Reaction Condition & Yield Optimization', allocated: 55000, spent: 50000, completion: 91, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 3 - Pilot Development & Safety', stageCode: 'Phase 3', module: 'Pilot Process Development & Optimization', allocated: 88000, spent: 81000, completion: 92, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 4 - Registration & Scale-Up', stageCode: 'Phase 4', module: 'Pilot Plant Campaign Execution', allocated: 98000, spent: 89000, completion: 91, project: 'Acrylic Emulsion Binder 50% Solids' },
    { stage: 'Phase 5 - Commercial Plant & Launch', stageCode: 'Phase 5', module: 'Commercial Plant Commissioning & Qualification', allocated: 135000, spent: 125000, completion: 93, project: 'Acrylic Emulsion Binder 50% Solids' }
  ];

  filteredBudgetGanttData: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.applyBudgetFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderVariancePieChart(), 0);
  }

  applyBudgetFilter() {
    if (this.selectedBudgetProject === 'All Projects') {
      const map = new Map<string, any>();
      this.budgetGanttData.forEach(d => {
        const key = `${d.stageCode}|${d.module}`;
        if (!map.has(key)) {
          map.set(key, {
            stage: d.stage,
            stageCode: d.stageCode,
            module: d.module,
            allocated: 0,
            spent: 0
          });
        }
        const item = map.get(key);
        item.allocated += d.allocated;
        item.spent += d.spent;
      });

      this.filteredBudgetGanttData = Array.from(map.values()).map(item => ({
        ...item,
        completion: Math.round((item.spent / (item.allocated || 1)) * 100)
      }));
    } else {
      this.filteredBudgetGanttData = this.budgetGanttData
        .filter(d => d.project === this.selectedBudgetProject)
        .map(d => ({
          ...d,
          completion: Math.round((d.spent / (d.allocated || 1)) * 100)
        }));
    }
  }

  onBudgetProjectChange() {
    this.applyBudgetFilter();
    this.renderVariancePieChart();
  }

  setVarianceStage(stage: string) {
    this.selectedVarianceStage = stage;
    this.renderVariancePieChart();
    this.scrollToStage(stage);
  }

  scrollToStage(stage: string): void {
    setTimeout(() => {
      const el = document.getElementById(`stage-row-${stage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  get groupedBudgetTableData(): Array<{ stage: string; stageCode: string; modules: any[] }> {
    const groups: Array<{ stage: string; stageCode: string; modules: any[] }> = [];
    const map = new Map<string, { stage: string; stageCode: string; modules: any[] }>();

    this.filteredBudgetGanttData.forEach(item => {
      const key = item.stage;
      if (!map.has(key)) {
        const group = { stage: item.stage, stageCode: item.stageCode, modules: [] };
        map.set(key, group);
        groups.push(group);
      }
      map.get(key)!.modules.push(item);
    });

    return groups;
  }

  renderVariancePieChart() {
    const containerId = 'variancePieChartContainer';
    if (!document.getElementById(containerId)) return;

    const stageItems = this.filteredBudgetGanttData.filter(d =>
      d.stageCode?.toUpperCase() === this.selectedVarianceStage?.toUpperCase()
    );
    const colors = ['#2b6cb0', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c'];

    const pieData = stageItems.map((item, idx) => ({
      name: this.moduleShortForms[item.module] || item.module,
      fullName: item.module,
      y: item.allocated,
      spent: item.spent,
      variance: item.allocated - item.spent,
      completion: item.completion,
      color: colors[idx % colors.length]
    }));

    Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        height: 460,
        backgroundColor: '#ffffff'
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadCSV',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      title: {
        text: `${this.selectedVarianceStage} - Budget Summary`,
        align: 'left',
        style: { fontSize: '16px', fontWeight: 'bold', color: '#333333' }
      },
      subtitle: {
        text: `Budget distribution across deliverables (${this.selectedBudgetProject})`,
        align: 'left',
        style: { color: '#666666' }
      },
      credits: { enabled: false },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          const p = this.point as any;
          return `<b>${p.fullName || this.key}</b><br/>
                  Allocated: <b>$${Highcharts.numberFormat(this.y, 0)}</b> (${this.percentage.toFixed(1)}%)<br/>
                  Actual Spent: <b>$${Highcharts.numberFormat(p.spent, 0)}</b> (${p.completion}% used)<br/>
                  Variance: <b>$${Highcharts.numberFormat(p.variance, 0)}</b>`;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
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
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 6,
        itemMarginBottom: 6,
        useHTML: true,
        itemStyle: { color: '#333333' },
        labelFormatter: function (this: any) {
          const name = this.name.length > 20 ? this.name.substring(0, 18) + '...' : this.name;
          return `<span style="width:160px;display:inline-block;" title="${this.name}">${name}</span>
                  <span style="font-weight:bold">$${Highcharts.numberFormat(this.y, 0)}</span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Allocated Budget',
        innerSize: '0%',
        data: pieData
      }]
    } as any);
  }
}
