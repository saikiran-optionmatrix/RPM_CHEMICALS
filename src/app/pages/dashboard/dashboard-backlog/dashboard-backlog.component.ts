import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

export interface BacklogActivityItem {
  rank: number;
  name: string;
  stageText: string;
  count: number;
  barColor: 'red' | 'amber';
  percentWidth: number;
}

@Component({
  selector: 'app-dashboard-backlog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-backlog.component.html',
  styleUrls: ['./dashboard-backlog.component.scss']
})
export class DashboardBacklogComponent implements OnInit, AfterViewInit {
  activities: BacklogActivityItem[] = [
    { rank: 1, name: 'Assay & Purity Method Validation (Technical Grade)', stageText: 'S7 · Safety & Reg.', count: 48, barColor: 'red', percentWidth: 80 },
    { rank: 2, name: 'Finished Product Shelf-Life & Storage Stability Testing', stageText: 'S8 · Registration', count: 42, barColor: 'red', percentWidth: 70 },
    { rank: 3, name: 'Reaction Calorimetry (RC1) & Thermal Hazard Screening', stageText: 'S7 · Safety & Reg.', count: 37, barColor: 'amber', percentWidth: 62 },
    { rank: 4, name: 'Raw Material Supplier Qualification', stageText: 'S3 · Route Scouting', count: 31, barColor: 'amber', percentWidth: 52 },
    { rank: 5, name: 'Pilot Batch Record Review & Approval', stageText: 'S9 · Pilot Plant', count: 26, barColor: 'amber', percentWidth: 43 },
    { rank: 6, name: 'Effluent Treatment (ETP) Load Assessment', stageText: 'S11 · Plant Build', count: 19, barColor: 'amber', percentWidth: 32 }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initBacklogChart();
    }, 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
      Highcharts.charts.forEach(c => c && c.reflow());
    }
  }

  initBacklogChart(): void {
    const container = document.getElementById('backlogByStageChartContainer');
    if (!container) return;

    Highcharts.chart(container, {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 380,
        margin: [10, 20, 35, 45]
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'],
        reversed: true,
        lineColor: '#cbd5e1',
        labels: {
          style: { fontSize: '11px', color: '#64748b' }
        }
      },
      yAxis: {
        min: 0,
        max: 60,
        tickPositions: [0, 15, 30, 45, 60],
        title: { text: null },
        gridLineColor: '#f1f5f9',
        labels: {
          style: { fontSize: '11px', color: '#64748b' }
        }
      },
      tooltip: {
        pointFormat: '<b>{point.category}</b>: {point.y} open activities'
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          borderRadius: 2,
          pointPadding: 0.15,
          color: '#4f75b8'
        }
      },
      series: [
        {
          name: 'Backlog',
          type: 'bar',
          data: [8, 11, 34, 41, 19, 29, 52, 38, 27, 19, 24, 9]
        }
      ]
    } as any);
  }
}
