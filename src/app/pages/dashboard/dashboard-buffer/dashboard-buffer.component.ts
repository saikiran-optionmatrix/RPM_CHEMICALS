import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

export interface BufferProjectItem {
  name: string;
  percent: number;
  status: 'green' | 'amber' | 'red';
}

@Component({
  selector: 'app-dashboard-buffer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-buffer.component.html',
  styleUrls: ['./dashboard-buffer.component.scss']
})
export class DashboardBufferComponent implements OnInit, AfterViewInit {
  bufferProjects: BufferProjectItem[] = [
    { name: 'Fumed Silica', percent: 88, status: 'red' },
    { name: 'Agro AI Synthesis', percent: 78, status: 'red' },
    { name: 'SLES 70% Paste', percent: 57, status: 'amber' },
    { name: 'WDG Formulation', percent: 52, status: 'amber' },
    { name: 'Pd/C Catalyst', percent: 46, status: 'amber' },
    { name: 'Acrylic Binder', percent: 41, status: 'amber' },
    { name: 'H₂O₂ 50%', percent: 35, status: 'amber' },
    { name: 'Solvent Recovery', percent: 24, status: 'green' },
    { name: 'Liquid Epoxy Resin', percent: 22, status: 'green' },
    { name: 'PUD Dispersion', percent: 18, status: 'green' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initFeverChart();
    }, 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
      Highcharts.charts.forEach(c => c && c.reflow());
    }
  }

  initFeverChart(): void {
    const container = document.getElementById('feverChartContainer');
    if (!container) return;

    Highcharts.chart(container, {
      chart: {
        type: 'scatter',
        backgroundColor: 'transparent',
        height: 380,
        margin: [20, 30, 45, 45]
      },
      title: { text: null },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        min: 0,
        max: 100,
        tickPositions: [0, 25, 50, 75, 100],
        lineColor: '#cbd5e1',
        gridLineWidth: 1,
        gridLineColor: '#f1f5f9',
        labels: {
          style: { fontSize: '11px', color: '#64748b' }
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        tickPositions: [0, 25, 50, 75, 100],
        title: { text: null },
        lineColor: '#cbd5e1',
        gridLineWidth: 1,
        gridLineColor: '#f1f5f9',
        labels: {
          style: { fontSize: '11px', color: '#64748b' }
        },
        plotBands: [
          {
            from: 0,
            to: 33,
            color: 'rgba(236, 253, 245, 0.65)' // green zone
          },
          {
            from: 33,
            to: 66,
            color: 'rgba(254, 249, 195, 0.45)' // amber zone
          },
          {
            from: 66,
            to: 100,
            color: 'rgba(254, 226, 226, 0.5)' // red zone
          }
        ]
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          return `<b>${this.point.name}</b><br/>Chain Completed: <b>${this.x}%</b><br/>Buffer Consumed: <b>${this.y}%</b>`;
        }
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            fillColor: '#1e293b'
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function (this: any) {
              return `<span style="font-size: 10px; font-weight: 500; color: #1e293b; line-height: 1.1;">${this.point.name}</span>`;
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
            { x: 31, y: 18, name: 'PUD<br/>Dispersion' },
            { x: 56, y: 24, name: 'Solvent<br/>Recovery' },
            { x: 62, y: 22, name: 'Liquid<br/>Epoxy<br/>Resin' },
            { x: 82, y: 35, name: 'H₂O₂<br/>50%' },
            { x: 34, y: 41, name: 'Acrylic<br/>Binder' },
            { x: 36, y: 46, name: 'Pd/C<br/>Catalyst' },
            { x: 55, y: 52, name: 'WDG<br/>Formulation' },
            { x: 72, y: 57, name: 'SLES<br/>70%<br/>Paste' },
            { x: 37, y: 78, name: 'Agro<br/>AI<br/>Synthesis' },
            { x: 70, y: 88, name: 'Fumed<br/>Silica' }
          ]
        }
      ]
    } as any);
  }
}
