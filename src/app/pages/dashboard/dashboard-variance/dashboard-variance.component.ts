import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

export interface PhaseDeliverableItem {
  name: string;
  spentText: string;
  varianceText: string;
  isOverBudget: boolean;
  pct: number;
}

export interface PhaseCard {
  title: string;
  stageRange: string;
  items: PhaseDeliverableItem[];
}

@Component({
  selector: 'app-dashboard-variance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-variance.component.html',
  styleUrls: ['./dashboard-variance.component.scss']
})
export class DashboardVarianceComponent implements OnInit, AfterViewInit {
  kpis = [
    { label: 'ALLOCATED (USD K)', value: '$2,305k', subtext: '', colorClass: 'val-default' },
    { label: 'ACTUAL (USD K)', value: '$2,338k', subtext: '', colorClass: 'val-teal' },
    { label: 'NET VARIANCE', value: '+$33k', subtext: '1.4% vs plan', colorClass: 'val-red' },
    { label: 'OVER-BUDGET DELIVERABLES', value: '5 / 9', subtext: '', colorClass: 'val-red' }
  ];

  phases: PhaseCard[] = [
    {
      title: 'PHASE 1 · CONCEPT & FEASIBILITY',
      stageRange: 'Stages S1-S2',
      items: [
        { name: 'Raw Material & Route Assessment', spentText: '$112k of $120k', varianceText: '-8k', isOverBudget: false, pct: 93 },
        { name: 'Reaction Screening & Compatibility', spentText: '$108k of $95k', varianceText: '+13k', isOverBudget: true, pct: 100 },
        { name: 'Feasibility & Business Case', spentText: '$54k of $60k', varianceText: '-6k', isOverBudget: false, pct: 90 }
      ]
    },
    {
      title: 'PHASE 2 · ROUTE DEVELOPMENT & SELECTION',
      stageRange: 'Stages S3-S5',
      items: [
        { name: 'Route Scouting & Catalyst Selection', spentText: '$342k of $310k', varianceText: '+32k', isOverBudget: true, pct: 100 },
        { name: 'Reaction Condition & Yield Optimization', spentText: '$398k of $420k', varianceText: '-22k', isOverBudget: false, pct: 95 },
        { name: 'Route Lock & Basis of Design', spentText: '$205k of $180k', varianceText: '+25k', isOverBudget: true, pct: 100 }
      ]
    },
    {
      title: 'PHASE 3 · PILOT DEVELOPMENT & SAFETY',
      stageRange: 'Stages S6-S7',
      items: [
        { name: 'Pilot Process Development & Optimization', spentText: '$590k of $640k', varianceText: '-50k', isOverBudget: false, pct: 92 },
        { name: 'Analytical & Performance Method Development', spentText: '$298k of $260k', varianceText: '+38k', isOverBudget: true, pct: 100 },
        { name: 'Process Hazard Analysis & Tech Transfer', spentText: '$231k of $220k', varianceText: '+11k', isOverBudget: true, pct: 100 }
      ]
    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initVarianceChart();
    }, 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
      Highcharts.charts.forEach(c => c && c.reflow());
    }
  }

  initVarianceChart(): void {
    const container = document.getElementById('varianceChartContainer');
    if (!container) return;

    Highcharts.chart(container, {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 280,
        margin: [20, 20, 95, 45]
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: [
          'Raw Material & Route Assessment',
          'Reaction Screening & Compatibility',
          'Feasibility & Business Case',
          'Route Scouting & Catalyst Selection',
          'Reaction Condition & Yield Optimization',
          'Route Lock & Basis of Design',
          'Pilot Process Development & Optimization',
          'Analytical & Performance Method Development',
          'Process Hazard Analysis & Tech Transfer'
        ],
        labels: {
          rotation: -25,
          style: {
            fontSize: '9.5px',
            color: '#64748b'
          }
        },
        lineColor: '#cbd5e1'
      },
      yAxis: {
        min: 0,
        max: 800,
        tickPositions: [0, 200, 400, 600, 800],
        title: { text: null },
        gridLineColor: '#f1f5f9',
        labels: {
          style: { fontSize: '11px', color: '#64748b' }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          let s = `<b>${this.x}</b><br/>`;
          this.points.forEach((p: any) => {
            s += `<span style="color:${p.color}">\u25CF</span> ${p.series.name}: <b>$${p.y}k</b><br/>`;
          });
          return s;
        }
      },
      plotOptions: {
        column: {
          grouping: true,
          shadow: false,
          borderWidth: 0,
          pointPadding: 0.1,
          groupPadding: 0.2
        }
      },
      series: [
        {
          name: 'Allocated',
          type: 'column',
          color: '#cbd5e1',
          data: [120, 95, 60, 310, 420, 180, 640, 260, 220]
        },
        {
          name: 'Actual',
          type: 'column',
          color: '#006466',
          data: [112, 108, 54, 342, 398, 205, 590, 298, 231]
        }
      ]
    } as any);
  }
}
