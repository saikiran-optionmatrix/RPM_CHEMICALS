import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

export interface TopDelayStageItem {
  stage: string;
  reason: string;
  occurrences: number;
  daysLost: string;
  isHighDays: boolean;
}

@Component({
  selector: 'app-dashboard-delay-reasons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-delay-reasons.component.html',
  styleUrls: ['./dashboard-delay-reasons.component.scss']
})
export class DashboardDelayReasonsComponent implements OnInit, AfterViewInit {
  stageDelayRows: TopDelayStageItem[] = [
    { stage: 'S1 - Opportunity Identification', reason: 'Market & Application Feasibility Analysis Delay', occurrences: 6, daysLost: '12 d', isHighDays: false },
    { stage: 'S2 - Concept Screening & Feasibility', reason: 'Charter Finalization Delay', occurrences: 4, daysLost: '9 d', isHighDays: false },
    { stage: 'S3 - Route Scouting & Lab Synthesis', reason: 'Raw Material, Catalyst & Solvent Shortage', occurrences: 14, daysLost: '31 d', isHighDays: true },
    { stage: 'S4 - Process Optimization (Lab Scale)', reason: 'Low Yield / Side Reaction Anomaly', occurrences: 18, daysLost: '38 d', isHighDays: true },
    { stage: 'S5 - Process Route Selection & Basis of Design', reason: 'Raw Material Lot Rejection', occurrences: 9, daysLost: '17 d', isHighDays: false },
    { stage: 'S6 - Bench-to-Pilot Process Development', reason: 'Pilot Batch Yield & Purity Variation', occurrences: 12, daysLost: '26 d', isHighDays: false },
    { stage: 'S7 - Process Safety & Regulatory Studies', reason: 'Hazard Study / Method Validation Pending', occurrences: 15, daysLost: '34 d', isHighDays: true },
    { stage: 'S8 - Regulatory Registration Filing (REACH / TSCA)', reason: 'Finished Product Specification Failure', occurrences: 7, daysLost: '15 d', isHighDays: false },
    { stage: 'S9 - Pilot Plant Campaign', reason: 'Tech Transfer Dossier Review Pending', occurrences: 8, daysLost: '19 d', isHighDays: false },
    { stage: 'S10 - Demonstration-Scale Campaign', reason: 'Reactor / Distillation Equipment Downtime', occurrences: 11, daysLost: '29 d', isHighDays: false },
    { stage: 'S11 - Commercial Plant Build & Commissioning', reason: 'Contractor / Equipment Delivery Delay', occurrences: 10, daysLost: '41 d', isHighDays: true },
    { stage: 'S12 - Commercial Launch & Ramp-Up', reason: 'Regulatory Query Response Delay (REACH / EPA)', occurrences: 5, daysLost: '22 d', isHighDays: false }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initBarChart();
      this.initDonutChart();
    }, 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
      Highcharts.charts.forEach(c => c && c.reflow());
    }
  }

  initBarChart(): void {
    const container = document.getElementById('delayOccurrencesChartContainer');
    if (!container) return;

    Highcharts.chart(container, {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 250,
        margin: [20, 15, 35, 35]
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'],
        labels: {
          style: { fontSize: '10px', color: '#64748b' }
        },
        lineColor: '#cbd5e1'
      },
      yAxis: {
        min: 0,
        max: 20,
        tickPositions: [0, 5, 10, 15, 20],
        title: { text: null },
        gridLineColor: '#f1f5f9',
        labels: {
          style: { fontSize: '11px', color: '#64748b' }
        }
      },
      tooltip: {
        pointFormat: '<b>{point.category}</b>: {point.y} occurrences'
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          borderRadius: 2,
          pointPadding: 0.1
        }
      },
      series: [
        {
          name: 'Delay Occurrences',
          type: 'column',
          data: [
            { y: 6, color: '#00796b' },
            { y: 4, color: '#00796b' },
            { y: 14, color: '#d9534f' },
            { y: 18, color: '#d9534f' },
            { y: 9, color: '#00796b' },
            { y: 12, color: '#e67e22' },
            { y: 15, color: '#d9534f' },
            { y: 7, color: '#00796b' },
            { y: 8, color: '#00796b' },
            { y: 11, color: '#e67e22' },
            { y: 10, color: '#e67e22' },
            { y: 5, color: '#00796b' }
          ]
        }
      ]
    } as any);
  }

  initDonutChart(): void {
    const container = document.getElementById('delayShareChartContainer');
    if (!container) return;

    Highcharts.chart(container, {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 250,
        margin: [10, 10, 10, 10]
      },
      title: { text: null },
      credits: { enabled: false },
      tooltip: {
        pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          innerSize: '62%',
          dataLabels: { enabled: false },
          showInLegend: false
        }
      },
      series: [
        {
          name: 'Share of Delays',
          type: 'pie',
          data: [
            { name: 'S4: Process Opt.', y: 18, color: '#00796b' },
            { name: 'S7: Safety & Reg.', y: 15, color: '#e67e22' },
            { name: 'S3: Route Scouting', y: 14, color: '#3498db' },
            { name: 'S6: Bench-to-Pilot', y: 12, color: '#2ecc71' },
            { name: 'S10: Demo Scale', y: 11, color: '#d9534f' },
            { name: 'Others', y: 49, color: '#5a6268' }
          ]
        }
      ]
    } as any);
  }
}
