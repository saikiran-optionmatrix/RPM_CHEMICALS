import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard-buffer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSelectModule, MatIconModule],
  templateUrl: './dashboard-buffer.component.html',
  styleUrls: ['./dashboard-buffer.component.scss']
})
export class DashboardBufferComponent implements AfterViewInit {
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
  selectedBufferProject = 'All Projects';

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
    this.onBufferFilterChange();
  }

  bufferBarChart: Highcharts.Chart | null = null;
  bufferStageChart: Highcharts.Chart | null = null;

  readonly phaseDefinitions = [
    { key: 'Phase 1 - Concept', fullName: 'Concept & Feasibility (S1-S2)', threshold: 2.0 },
    { key: 'Phase 2 - Route', fullName: 'Route Development & Selection (S3-S5)', threshold: 4.5 },
    { key: 'Phase 3 - Pilot', fullName: 'Pilot Development & Safety (S6-S7)', threshold: 6.5 },
    { key: 'Phase 4 - Scale-Up', fullName: 'Registration & Scale-Up (S8-S10)', threshold: 8.5 },
    { key: 'Phase 5 - Commercial', fullName: 'Commercial Plant & Launch (S11-S12)', threshold: 10.5 }
  ];

  bufferProjectData: { [project: string]: { [phase: string]: { bufferUsed: number; bufferTime: number } } } = {
    'Waterborne Polyurethane Dispersion (PUD) Discovery Project': {
      'Phase 1 - Concept': { bufferUsed: 0.8, bufferTime: -0.3 },
      'Phase 2 - Route': { bufferUsed: 2.3, bufferTime: -0.2 },
      'Phase 3 - Pilot': { bufferUsed: 4.4, bufferTime: 0.4 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.1, bufferTime: 0.8 },
      'Phase 5 - Commercial': { bufferUsed: 8.0, bufferTime: 1.2 }
    },
    'Hydrogenation Catalyst Development (Pd/C)': {
      'Phase 1 - Concept': { bufferUsed: 0.7, bufferTime: -0.4 },
      'Phase 2 - Route': { bufferUsed: 2.1, bufferTime: -0.3 },
      'Phase 3 - Pilot': { bufferUsed: 4.2, bufferTime: 0.2 },
      'Phase 4 - Scale-Up': { bufferUsed: 5.9, bufferTime: 0.6 },
      'Phase 5 - Commercial': { bufferUsed: 7.8, bufferTime: 0.9 }
    },
    'Agrochemical Active Ingredient Multi-Step Synthesis Development': {
      'Phase 1 - Concept': { bufferUsed: 0.9, bufferTime: 0.2 },
      'Phase 2 - Route': { bufferUsed: 2.5, bufferTime: 0.5 },
      'Phase 3 - Pilot': { bufferUsed: 4.8, bufferTime: 0.7 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.8, bufferTime: 1.1 },
      'Phase 5 - Commercial': { bufferUsed: 8.9, bufferTime: 1.5 }
    },
    'Solvent Recovery & Fractional Distillation Process Development': {
      'Phase 1 - Concept': { bufferUsed: 0.6, bufferTime: -0.5 },
      'Phase 2 - Route': { bufferUsed: 1.9, bufferTime: -0.4 },
      'Phase 3 - Pilot': { bufferUsed: 3.8, bufferTime: -0.1 },
      'Phase 4 - Scale-Up': { bufferUsed: 5.5, bufferTime: 0.3 },
      'Phase 5 - Commercial': { bufferUsed: 7.2, bufferTime: 0.6 }
    },
    'Water-Dispersible Granule (WDG) Formulation Development': {
      'Phase 1 - Concept': { bufferUsed: 0.8, bufferTime: -0.1 },
      'Phase 2 - Route': { bufferUsed: 2.4, bufferTime: 0.3 },
      'Phase 3 - Pilot': { bufferUsed: 4.6, bufferTime: 0.5 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.3, bufferTime: 0.9 },
      'Phase 5 - Commercial': { bufferUsed: 8.2, bufferTime: 1.3 }
    },
    'Acrylic Emulsion Binder 50% Solids': {
      'Phase 1 - Concept': { bufferUsed: 0.8, bufferTime: -0.2 },
      'Phase 2 - Route': { bufferUsed: 2.3, bufferTime: -0.1 },
      'Phase 3 - Pilot': { bufferUsed: 4.4, bufferTime: 0.3 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.1, bufferTime: 0.7 },
      'Phase 5 - Commercial': { bufferUsed: 8.0, bufferTime: 1.0 }
    },
    'Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)': {
      'Phase 1 - Concept': { bufferUsed: 0.7, bufferTime: -0.3 },
      'Phase 2 - Route': { bufferUsed: 2.2, bufferTime: -0.1 },
      'Phase 3 - Pilot': { bufferUsed: 4.3, bufferTime: 0.3 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.0, bufferTime: 0.6 },
      'Phase 5 - Commercial': { bufferUsed: 7.9, bufferTime: 1.1 }
    },
    'Sodium Lauryl Ether Sulfate (SLES) 70% Paste': {
      'Phase 1 - Concept': { bufferUsed: 0.6, bufferTime: -0.4 },
      'Phase 2 - Route': { bufferUsed: 2.0, bufferTime: -0.2 },
      'Phase 3 - Pilot': { bufferUsed: 4.1, bufferTime: 0.1 },
      'Phase 4 - Scale-Up': { bufferUsed: 5.8, bufferTime: 0.5 },
      'Phase 5 - Commercial': { bufferUsed: 7.6, bufferTime: 0.8 }
    },
    'Fumed Silica (Hydrophilic, 200 m2/g)': {
      'Phase 1 - Concept': { bufferUsed: 0.9, bufferTime: 0.1 },
      'Phase 2 - Route': { bufferUsed: 2.6, bufferTime: 0.4 },
      'Phase 3 - Pilot': { bufferUsed: 4.7, bufferTime: 0.6 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.5, bufferTime: 1.0 },
      'Phase 5 - Commercial': { bufferUsed: 8.5, bufferTime: 1.4 }
    },
    'Hydrogen Peroxide 50% w/w (Anthraquinone Process)': {
      'Phase 1 - Concept': { bufferUsed: 0.8, bufferTime: -0.2 },
      'Phase 2 - Route': { bufferUsed: 2.3, bufferTime: 0.1 },
      'Phase 3 - Pilot': { bufferUsed: 4.5, bufferTime: 0.4 },
      'Phase 4 - Scale-Up': { bufferUsed: 6.2, bufferTime: 0.8 },
      'Phase 5 - Commercial': { bufferUsed: 8.1, bufferTime: 1.2 }
    }
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderBufferBarChart();
      this.renderBufferPieChart();
    }, 0);
  }

  onBufferFilterChange() {
    this.renderBufferBarChart();
    this.renderBufferPieChart();
  }

  getBufferDataForProject(project: string): { [phase: string]: { bufferUsed: number; bufferTime: number } } {
    if (project !== 'All Projects' && this.bufferProjectData[project]) {
      return this.bufferProjectData[project];
    }
    const phases = this.phaseDefinitions.map(p => p.key);
    const projectKeys = Object.keys(this.bufferProjectData);
    const result: { [phase: string]: { bufferUsed: number; bufferTime: number } } = {};

    phases.forEach(phase => {
      let totalUsed = 0;
      let totalTime = 0;
      projectKeys.forEach(p => {
        totalUsed += this.bufferProjectData[p][phase]?.bufferUsed || 0;
        totalTime += this.bufferProjectData[p][phase]?.bufferTime || 0;
      });
      result[phase] = {
        bufferUsed: +(totalUsed / projectKeys.length).toFixed(1),
        bufferTime: +(totalTime / projectKeys.length).toFixed(1)
      };
    });
    return result;
  }

  renderBufferBarChart() {
    const containerId = 'bufferBarChartContainer';
    if (!document.getElementById(containerId)) return;

    const categories = this.phaseDefinitions.map(p => p.key);
    const thresholdData = this.phaseDefinitions.map(p => p.threshold);
    const projectData = this.getBufferDataForProject(this.selectedBufferProject);

    const self = this;
    const columnData = this.phaseDefinitions.map(pDef => {
      const used = projectData[pDef.key]?.bufferUsed ?? 0;
      return {
        y: used,
        color: used > pDef.threshold ? '#dc3545' : '#28a745',
        status: used > pDef.threshold ? 'Over Threshold' : 'On Track',
        fullName: pDef.fullName
      };
    });

    this.bufferBarChart = Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null },
      credits: { enabled: false },
      legend: {
        itemStyle: { color: '#000000' }
      },
      xAxis: {
        title: { text: 'Phases', style: { color: '#000000' } },
        categories: categories,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        labels: {
          step: 1,
          style: { color: '#000000' }
        }
      },
      yAxis: {
        title: { text: 'Buffer Time Used (days)', style: { color: '#000000' } },
        min: 0,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        labels: { style: { color: '#000000' } }
      },
      tooltip: {
        shared: false,
        useHTML: true,
        formatter: function (this: any): string {
          if (this.series.name.includes('Average Threshold')) {
            return `<div style="color: white;"><b>Average Threshold</b><br/>${this.x}<br/>Expected Buffer: <b>${this.y}</b></div>`;
          }
          const fullName = (this.point as any).options?.fullName || this.x;
          return `
            <div style="font-size: 13px; color:white;">
              <b>${this.x}</b><br/>
              <span style="font-size: 11px; opacity: 0.85;">${fullName}</span><br/>
              <span style="color: ${this.point.color}">\u25CF</span> Buffer Time Used: <b>${this.y} days</b><br/>
              Status: <i>${(this.point as any).options?.status}</i>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          borderRadius: 3,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontWeight: 'bold', color: '#000000', textOutline: 'none' }
          },
          point: {
            events: {
              mouseOver: function () {
                const idx = (this as any).index;
                const stageChart = self.bufferStageChart;
                if (!stageChart) return;
                const pt = stageChart.series[0]?.points[idx];
                if (pt) pt.setState('hover');
              },
              mouseOut: function () {
                const idx = (this as any).index;
                const stageChart = self.bufferStageChart;
                if (!stageChart) return;
                const pt = stageChart.series[0]?.points[idx];
                if (pt) pt.setState('');
              }
            }
          }
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer Used',
          data: columnData
        },
        {
          type: 'line',
          name: 'Average Threshold (y=x)',
          data: thresholdData,
          color: '#007bff',
          dashStyle: 'Dash',
          marker: { enabled: true, radius: 4 }
        }
      ]
    } as any);
  }

  renderBufferPieChart() {
    const containerId = 'bufferPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const categories = this.phaseDefinitions.map(p => p.key);
    const projectData = this.getBufferDataForProject(this.selectedBufferProject);

    const stageData = this.phaseDefinitions.map(pDef => {
      const timeVal = projectData[pDef.key]?.bufferTime ?? 0;
      return {
        name: pDef.key,
        y: timeVal,
        color: timeVal > 0 ? '#dc3545' : '#00a859',
        fullName: pDef.fullName
      };
    });

    const self = this;

    this.bufferStageChart = Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null },
      credits: { enabled: false },
      legend: {
        itemStyle: { color: '#000000' }
      },
      xAxis: {
        title: { text: 'Phases', style: { color: '#000000' } },
        categories: categories,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        gridLineWidth: 0,
        labels: {
          step: 1,
          style: { color: '#000000' }
        }
      },
      yAxis: {
        title: { text: 'Buffer Time (days)', style: { color: '#000000' } },
        gridLineWidth: 0,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        plotLines: [{ value: 0, width: 2, color: '#1b2e5e', zIndex: 4 }],
        labels: { style: { color: '#000000' } }
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any): string {
          const p = this.point as any;
          const fullName = p.options?.fullName || this.key;
          const status = p.y > 0 ? 'Over Buffer (Delay)' : (p.y < 0 ? 'Under Buffer (Saved)' : 'On Track');
          return `
            <div style="font-size: 13px; color:white;">
              <b>${this.key}</b><br/>
              <span style="font-size: 11px; opacity: 0.85;">${fullName}</span><br/>
              Buffer Time: <b>${p.y > 0 ? '+' : ''}${p.y} days</b><br/>
              Status: <i>${status}</i>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#000000',
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              const val = this.y as number;
              return (val > 0 ? '+' : '') + val.toFixed(1);
            },
            style: { fontWeight: 'bold', color: '#000000', textOutline: 'none' }
          },
          point: {
            events: {
              mouseOver: function () {
                const idx = (this as any).index;
                const barChart = self.bufferBarChart;
                if (!barChart) return;
                const pt = barChart.series[0]?.points[idx];
                if (pt) pt.setState('hover');
              },
              mouseOut: function () {
                const idx = (this as any).index;
                const barChart = self.bufferBarChart;
                if (!barChart) return;
                const pt = barChart.series[0]?.points[idx];
                if (pt) pt.setState('');
              }
            }
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Buffer Time',
        data: stageData
      }]
    } as any);
  }
}
