import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

export interface ProjectRegisterItem {
  code: string;
  name: string;
  division: string;
  divisionColor: string;
  site: string;
  stage: string;
  progress: number;
  budget: string;
  npv: string;
  health: number;
  healthStatus: 'On track' | 'Watch' | 'At risk';
}

@Component({
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrls: ['./dashboard-portfolio.component.scss']
})
export class DashboardPortfolioComponent implements OnInit, AfterViewInit {
  kpis = [
    { label: 'FINAL BUDGET', value: '$22.13 mn', subtext: '10 projects in view', colorClass: 'val-default' },
    { label: 'ACTUAL COST TO DATE', value: '$14.18 mn', subtext: '64% of budget used', colorClass: 'val-default' },
    { label: 'PROJECTED NPV', value: '$115.40 mn', subtext: 'risk-adjusted, 10 yr', colorClass: 'val-green' },
    { label: 'EXPECTED REVENUE / YR', value: '$143.00 mn', subtext: 'at nameplate capacity', colorClass: 'val-blue' },
    { label: 'INVESTMENT AT RISK', value: '$4.02 mn', subtext: '2 at-risk projects', colorClass: 'val-red' },
    { label: 'AVG. EXECUTION HEALTH', value: '74', subtext: 'out of 100', colorClass: 'val-default' }
  ];

  divisionBreakdown = [
    {
      name: 'Specialty Chemicals',
      bulletColor: '#00796b',
      barColor: '#00796b',
      subtext: '3 projects · $4.91 mn of $7.05 mn',
      npv: '$32.90 mn NPV',
      percent: 70
    },
    {
      name: 'Polymers & Resins',
      bulletColor: '#2563eb',
      barColor: '#2563eb',
      subtext: '3 projects · $2.97 mn of $6.02 mn',
      npv: '$38.80 mn NPV',
      percent: 49
    },
    {
      name: 'Agrochemicals',
      bulletColor: '#10b981',
      barColor: '#10b981',
      subtext: '2 projects · $930k of $1.58 mn',
      npv: '$12.70 mn NPV',
      percent: 59
    },
    {
      name: 'Industrial & Fine Chemicals',
      bulletColor: '#f59e0b',
      barColor: '#f59e0b',
      subtext: '2 projects · $5.37 mn of $7.48 mn',
      npv: '$31.00 mn NPV',
      percent: 72
    }
  ];

  projects: ProjectRegisterItem[] = [
    {
      code: '2026/CHM/001',
      name: 'Waterborne Polyurethane Dispersion (PUD) Discovery',
      division: 'Polymers & Resins',
      divisionColor: '#2563eb',
      site: 'Dahej, Gujarat',
      stage: 'S2 Concept',
      progress: 30,
      budget: '$420k',
      npv: '$3.10 mn',
      health: 88,
      healthStatus: 'On track'
    },
    {
      code: '2026/CHM/002',
      name: 'Hydrogenation Catalyst Development (Pd/C)',
      division: 'Specialty Chemicals',
      divisionColor: '#00796b',
      site: 'Taloja, Maharashtra',
      stage: 'S3 Route Scouting',
      progress: 38,
      budget: '$650k',
      npv: '$5.40 mn',
      health: 71,
      healthStatus: 'Watch'
    },
    {
      code: '2026/CHM/003',
      name: 'Agrochemical AI Multi-Step Synthesis Development',
      division: 'Agrochemicals',
      divisionColor: '#10b981',
      site: 'Ankleshwar, Gujarat',
      stage: 'S4 Process Opt.',
      progress: 41,
      budget: '$1.10 mn',
      npv: '$8.90 mn',
      health: 58,
      healthStatus: 'At risk'
    },
    {
      code: '2026/CHM/004',
      name: 'Solvent Recovery & Fractional Distillation Process',
      division: 'Industrial & Fine Chemicals',
      divisionColor: '#f59e0b',
      site: 'Panoli, Gujarat',
      stage: 'S4 Process Opt.',
      progress: 52,
      budget: '$580k',
      npv: '$2.60 mn',
      health: 84,
      healthStatus: 'On track'
    },
    {
      code: '2026/CHM/005',
      name: 'Water-Dispersible Granule (WDG) Formulation',
      division: 'Agrochemicals',
      divisionColor: '#10b981',
      site: 'Ankleshwar, Gujarat',
      stage: 'S5 Route Selection',
      progress: 55,
      budget: '$480k',
      npv: '$3.80 mn',
      health: 69,
      healthStatus: 'Watch'
    },
    {
      code: '2026/CHM/006',
      name: 'Acrylic Emulsion Binder 50% Solids',
      division: 'Polymers & Resins',
      divisionColor: '#2563eb',
      site: 'Dahej, Gujarat',
      stage: 'S4 Process Opt.',
      progress: 34,
      budget: '$2.40 mn',
      npv: '$14.20 mn',
      health: 74,
      healthStatus: 'Watch'
    },
    {
      code: '2026/CHM/007',
      name: 'Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)',
      division: 'Polymers & Resins',
      divisionColor: '#2563eb',
      site: 'Taloja, Maharashtra',
      stage: 'S8 Registration',
      progress: 62,
      budget: '$3.20 mn',
      npv: '$21.50 mn',
      health: 86,
      healthStatus: 'On track'
    },
    {
      code: '2026/CHM/008',
      name: 'Sodium Lauryl Ether Sulfate (SLES) 70% Paste',
      division: 'Specialty Chemicals',
      divisionColor: '#00796b',
      site: 'Vizag, Andhra Pradesh',
      stage: 'S9 Pilot Plant',
      progress: 68,
      budget: '$1.80 mn',
      npv: '$9.70 mn',
      health: 72,
      healthStatus: 'Watch'
    },
    {
      code: '2026/CHM/009',
      name: 'Fumed Silica (Hydrophilic, 200 m²/g)',
      division: 'Specialty Chemicals',
      divisionColor: '#00796b',
      site: 'Panoli, Gujarat',
      stage: 'S10 Demo Scale',
      progress: 70,
      budget: '$4.60 mn',
      npv: '$17.80 mn',
      health: 55,
      healthStatus: 'At risk'
    },
    {
      code: '2026/CHM/010',
      name: 'Hydrogen Peroxide 50% w/w (Anthraquinone)',
      division: 'Industrial & Fine Chemicals',
      divisionColor: '#f59e0b',
      site: 'Vizag, Andhra Pradesh',
      stage: 'S11 Plant Build',
      progress: 82,
      budget: '$6.90 mn',
      npv: '$28.40 mn',
      health: 81,
      healthStatus: 'On track'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initBubbleChart();
    }, 50);
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
      Highcharts.charts.forEach(c => c && c.reflow());
    }
  }

  initBubbleChart(): void {
    const container = document.getElementById('bubbleChartContainer');
    if (!container) return;

    Highcharts.chart(container, {
      chart: {
        type: 'scatter',
        backgroundColor: 'transparent',
        height: 230,
        margin: [20, 20, 35, 45]
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        min: 50,
        max: 95,
        tickPositions: [50, 65, 80, 95],
        gridLineWidth: 1,
        gridLineColor: '#f1f5f9',
        lineColor: '#cbd5e1',
        tickColor: '#cbd5e1',
        labels: {
          style: { color: '#64748b', fontSize: '11px' }
        }
      },
      yAxis: {
        min: 0,
        max: 32,
        tickPositions: [0, 8, 16, 24, 32],
        gridLineWidth: 1,
        gridLineColor: '#f1f5f9',
        lineColor: '#cbd5e1',
        title: { text: null },
        labels: {
          style: { color: '#64748b', fontSize: '11px' }
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          return `<b>${this.point.name}</b><br/>Health: ${this.x}<br/>NPV: $${this.y} mn<br/>Budget: ${this.point.budget}`;
        }
      },
      plotOptions: {
        scatter: {
          marker: {
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function (this: any) {
              return `<span style="font-size: 9px; color: #475569; font-weight: 500;">${this.point.name}</span>`;
            },
            align: 'left',
            verticalAlign: 'middle',
            x: 8
          }
        }
      },
      series: [
        {
          name: 'Projects',
          type: 'scatter',
          data: [
            { x: 55, y: 17.8, name: 'Fumed Silica', budget: '$4.60 mn', marker: { radius: 10, fillColor: '#00796b' } },
            { x: 58, y: 8.9, name: 'Agro AI Synthesis', budget: '$1.10 mn', marker: { radius: 7, fillColor: '#10b981' } },
            { x: 69, y: 3.8, name: 'WDG Formulation', budget: '$480k', marker: { radius: 6, fillColor: '#10b981' } },
            { x: 71, y: 5.4, name: 'Pd/C Catalyst', budget: '$650k', marker: { radius: 7, fillColor: '#00796b' } },
            { x: 72, y: 9.7, name: 'SLES 70% Paste', budget: '$1.80 mn', marker: { radius: 8, fillColor: '#00796b' } },
            { x: 74, y: 14.2, name: 'Acrylic Binder', budget: '$2.40 mn', marker: { radius: 8, fillColor: '#2563eb' } },
            { x: 81, y: 28.4, name: 'H₂O₂ 50%', budget: '$6.90 mn', marker: { radius: 12, fillColor: '#f59e0b' } },
            { x: 84, y: 2.6, name: 'Solvent Recovery', budget: '$580k', marker: { radius: 6, fillColor: '#f59e0b' } },
            { x: 86, y: 21.5, name: 'Liquid Epoxy Resin', budget: '$3.20 mn', marker: { radius: 11, fillColor: '#2563eb' } },
            { x: 88, y: 3.1, name: 'PUD Dispersion', budget: '$420k', marker: { radius: 6, fillColor: '#2563eb' } }
          ]
        }
      ]
    } as any);
  }

  navigateToProject(item: ProjectRegisterItem): void {
    this.router.navigate(['/projects', 'dashboard'], {
      queryParams: {
        projectCode: item.code,
        projectName: item.name
      }
    });
  }
}
