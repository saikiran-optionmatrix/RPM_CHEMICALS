import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as HighchartsNamespace from 'highcharts';
import exportingModule from 'highcharts/modules/exporting';
import { AddProjectComponent } from '../../add-project/add-project.component';
import { MatDialog } from '@angular/material/dialog';
import { Project, projects, locations } from '../../projects-data';

const Highcharts: any = (HighchartsNamespace as any).default || HighchartsNamespace;

// Safely initialize Highcharts modules
try {
  const exp = (exportingModule as any)?.default || exportingModule;
  if (typeof exp === 'function' && Highcharts) {
    exp(Highcharts);
  }
} catch (e) {
  console.warn('Could not initialize Highcharts exporting module', e);
}

interface Task {
  name: string;
  assignee: string;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  slipDays: string;
}

interface GanttTaskItem {
  id: number;
  label: string;
  fullName: string;
  duration: string;
  isOverdue: boolean;
  leftPercent: number;
  widthPercent: number;
}

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss',
})
export class ProjectAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tasksByStageRef') tasksByStageRef?: ElementRef;
  @ViewChild('progressTrendRef') progressTrendRef?: ElementRef;
  @ViewChild('sprintBufferRef') sprintBufferRef?: ElementRef;
  @ViewChild('stageBufferRef') stageBufferRef?: ElementRef;
  @ViewChild('costPlanRef') costPlanRef?: ElementRef;
  @ViewChild('projectHoursRef') projectHoursRef?: ElementRef;

  private charts: any[] = [];

  currentProject: any = null;
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';
  projectManager: string = 'R. Kulkarni';
  projectType: string = 'Specialty Chemicals - SC';
  startDate: string = '01-Jul-2026';
  targetFinish: string = '30-Jun-2027';
  projectStatus: string = 'Active';
  overallProgress: number = 46;
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/001';

  // --- Task Data ---
  overdueTasks: Task[] = [
    { name: 'Reaction Calorimetry & Exotherm Study', assignee: 'Dr. Priya R.', status: 'CRITICAL', slipDays: '+6d' },
    { name: 'Monomer Feed Profile & Kinetics Optimization', assignee: 'Rahul K.', status: 'CRITICAL', slipDays: '+5d' },
    { name: 'Pre-Emulsion Droplet Size & Stability Testing', assignee: 'Meena S.', status: 'HIGH', slipDays: '+4d' },
    { name: 'GPC Molecular Weight Method Validation', assignee: 'Anil P.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Accelerated Thermal & Shear Stability Assessment', assignee: 'Kavya R.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Surfactant & Initiator Compatibility Dossier', assignee: 'Suresh N.', status: 'MEDIUM', slipDays: '+2d' },
  ];

  // --- Gantt Timeline Data ---
  ganttMonths: string[] = ['Jun', 'Jul', 'Aug', 'Sep'];

  ganttTasks: GanttTaskItem[] = [
    {
      id: 1,
      label: '1. Benchmark Grade Profiling...',
      fullName: '1. Benchmark Competitor Grade Profiling — 12d',
      duration: '12d',
      isOverdue: false,
      leftPercent: 1.5,
      widthPercent: 12
    },
    {
      id: 2,
      label: '2. Monomer & Initiator Study...',
      fullName: '2. Monomer & Initiator Compatibility Study — 18d',
      duration: '18d',
      isOverdue: false,
      leftPercent: 9.5,
      widthPercent: 18
    },
    {
      id: 3,
      label: '3. Emulsion Polymerization Run...',
      fullName: '3. Emulsion Polymerization Lab Run — 24d',
      duration: '24d',
      isOverdue: false,
      leftPercent: 24.5,
      widthPercent: 24
    },
    {
      id: 4,
      label: '4. Viscosity & Solids % Test...',
      fullName: '4. Viscosity & Solids % Testing — 14d',
      duration: '14d',
      isOverdue: true,
      leftPercent: 44.5,
      widthPercent: 14
    },
    {
      id: 5,
      label: '5. Kinetics Optimization...',
      fullName: '5. Reaction Kinetics Optimization — 20d',
      duration: '20d',
      isOverdue: true,
      leftPercent: 55.0,
      widthPercent: 20
    },
    {
      id: 6,
      label: '6. Thermal & Storage Stability...',
      fullName: '6. Storage Stability & Freeze-Thaw Study — 30d',
      duration: '30d',
      isOverdue: true,
      leftPercent: 71.0,
      widthPercent: 29
    }
  ];

  // Tooltip tracking
  hoveredGanttTask: GanttTaskItem | null = null;
  tooltipPos = { x: 0, y: 0 };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private dialog: MatDialog
  ) {
    const pName = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name');
    const pCode = this.route.snapshot.queryParamMap.get('projectCode') || this.route.snapshot.queryParamMap.get('code');
    if (pName) {
      this.projectName = pName;
    }
    if (pCode) {
      this.projectCode = pCode;
    }
    this.initProjectData();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.initProjectData();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderCharts();
    }, 60);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => {
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
    });
    this.charts = [];
  }

  goBack(): void {
    this.router.navigateByUrl('/projects');
  }

  onGanttBarHover(event: MouseEvent, task: GanttTaskItem): void {
    this.hoveredGanttTask = task;
    this.tooltipPos = {
      x: event.clientX + 12,
      y: event.clientY + 12
    };
  }

  onGanttBarMove(event: MouseEvent): void {
    if (this.hoveredGanttTask) {
      this.tooltipPos = {
        x: event.clientX + 12,
        y: event.clientY + 12
      };
    }
  }

  onGanttBarLeave(): void {
    this.hoveredGanttTask = null;
  }

  private renderCharts(): void {
    if (this.tasksByStageRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.tasksByStageRef.nativeElement, this.getTasksByStageChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering tasksByStage chart', e);
      }
    }
    if (this.progressTrendRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.progressTrendRef.nativeElement, this.getProgressTrendChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering progressTrend chart', e);
      }
    }
    if (this.sprintBufferRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.sprintBufferRef.nativeElement, this.getSprintBufferChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering sprintBuffer chart', e);
      }
    }
    if (this.stageBufferRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.stageBufferRef.nativeElement, this.getStageBufferChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering stageBuffer chart', e);
      }
    }
    if (this.costPlanRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.costPlanRef.nativeElement, this.getCostPlanChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering costPlan chart', e);
      }
    }
    if (this.projectHoursRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.projectHoursRef.nativeElement, this.getProjectHoursChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering projectHours chart', e);
      }
    }
  }

  private getSprintBufferChartOptions(): any {
    return {
      chart: {
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
        title: {
          text: '% completion',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 8,
        tickInterval: 2,
        gridLineColor: '#f1f5f9',
        title: {
          text: 'Buffer Time Used',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          let s = `<div style="font-size: 11px; padding: 2px;"><b>${this.x}</b>`;
          this.points?.forEach((point: any) => {
            s += `<br/><span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b>`;
          });
          s += '</div>';
          return s;
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer',
          color: '#a7f3d0',
          borderRadius: 2,
          pointWidth: 36,
          dataLabels: {
            enabled: true,
            inside: false,
            style: {
              color: '#94a3b8',
              fontSize: '10px',
              fontWeight: 'normal',
              textOutline: 'none'
            }
          },
          data: [
            { y: 0.8, color: '#a7f3d0' },
            { y: 2.5, color: '#fca5a5' },
            { y: 2.2, color: '#a7f3d0' },
            { y: 4.8, color: '#fca5a5' },
            { y: 4.0, color: '#a7f3d0' },
            { y: 6.5, color: '#fca5a5' }
          ]
        },
        {
          type: 'line',
          name: 'Cumulative Completion',
          color: '#2563eb',
          dashStyle: 'Dash',
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 3,
            fillColor: '#2563eb'
          },
          data: [0.8, 1.8, 2.8, 3.8, 4.8, 6.0]
        }
      ]
    };
  }

  private getStageBufferChartOptions(): any {
    return {
      chart: {
        type: 'column',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'],
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 4,
        tickInterval: 1,
        gridLineColor: '#f1f5f9',
        title: {
          text: 'Values',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer Variance',
          color: '#059669',
          borderRadius: 2,
          pointWidth: 40,
          data: [3, 1, 3, 0, 0]
        }
      ]
    };
  }

  private getCostPlanChartOptions(): any {
    return {
      chart: {
        type: 'column',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5'],
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 40,
        tickInterval: 20,
        gridLineColor: '#f1f5f9',
        title: { text: undefined },
        labels: {
          format: '{value}L',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>₹{point.y}L</b>'
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      plotOptions: {
        column: {
          borderRadius: 2,
          pointPadding: 0.1,
          groupPadding: 0.2
        }
      },
      series: [
        {
          type: 'column',
          name: 'Actual Cost',
          color: '#a855f7',
          data: [11, 18, 22, 18, 24]
        },
        {
          type: 'column',
          name: 'Budgeted Cost',
          color: '#3b82f6',
          data: [10, 20, 26, 22, 28]
        }
      ]
    };
  }

  private getProjectHoursChartOptions(): any {
    return {
      chart: {
        type: 'pie',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y}h)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%',
            connectorColor: '#cbd5e1',
            style: {
              color: '#334155',
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none'
            }
          }
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Effort allocation',
          data: [
            {
              name: 'Polymer Synthesis & Reaction Engg',
              y: 54.5,
              color: '#3b82f6'
            },
            {
              name: 'Pilot Plant Operations',
              y: 24.2,
              color: '#10b981'
            },
            {
              name: 'QC & Analytical Testing',
              y: 14.8,
              color: '#f59e0b'
            },
            {
              name: 'Process Safety & EHS',
              y: 6.5,
              color: '#8b5cf6'
            }
          ]
        }
      ]
    };
  }

  private getTasksByStageChartOptions(): any {
    return {
      chart: {
        type: 'bar',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 20, 15, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1 - Feasibility', 'S2 - Lab Synthesis', 'S3 - Optimization', 'S4 - Pilot Trial', 'S5 - Commercialization'],
        reversed: true,
        lineWidth: 1,
        lineColor: '#cbd5e1',
        tickWidth: 0,
        labels: {
          style: {
            color: '#334155',
            fontSize: '12px',
            fontWeight: '500'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 20,
        tickInterval: 5,
        gridLineColor: '#f1f5f9',
        gridLineDashStyle: 'Dash',
        title: {
          text: 'No. of Tasks',
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '500'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        formatter: function (this: any) {
          return `<b>${this.x}</b>: ${this.y} Tasks`;
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          color: '#3b82f6',
          pointWidth: 22,
          dataLabels: {
            enabled: true,
            inside: false,
            align: 'left',
            crop: false,
            overflow: 'none',
            x: 5,
            style: {
              color: '#1e293b',
              fontSize: '11px',
              fontWeight: '600',
              textOutline: 'none'
            },
            formatter: function (this: any) {
              return this.y;
            }
          }
        }
      },
      series: [
        {
          name: 'Tasks',
          data: [4, 8, 16, 10, 5]
        }
      ]
    };
  }

  private getProgressTrendChartOptions(): any {
    return {
      chart: {
        type: 'line',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 20, 15, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['Jul\'26', 'Aug\'26', 'Sep\'26', 'Oct\'26', 'Nov\'26', 'Dec\'26'],
        lineWidth: 1,
        lineColor: '#cbd5e1',
        tickWidth: 0,
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '500'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 25,
        gridLineColor: '#f1f5f9',
        gridLineDashStyle: 'Dash',
        title: { text: undefined },
        labels: {
          formatter: function (this: any) {
            return `${this.value}%`;
          },
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          let s = `<div style="font-size: 11px; padding: 2px;"><b>${this.x}</b>`;
          this.points?.forEach((point: any) => {
            if (point.y !== null && point.y !== undefined) {
              s += `<br/><span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}%</b>`;
            }
          });
          s += '</div>';
          return s;
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'line',
          name: 'Actual Progress',
          color: '#16a34a',
          lineWidth: 2.5,
          marker: {
            enabled: true,
            radius: 5,
            fillColor: '#22c55e',
            lineColor: '#ffffff',
            lineWidth: 2
          },
          dataLabels: {
            enabled: true,
            format: '{y}%',
            y: -10,
            style: {
              color: '#15803d',
              fontSize: '11px',
              fontWeight: '700',
              textOutline: 'none'
            }
          },
          data: [10, 20, 35, 46, null, null]
        },
        {
          type: 'line',
          name: 'Projected Trend',
          color: '#3b82f6',
          dashStyle: 'Dash',
          lineWidth: 2.5,
          marker: {
            enabled: true,
            radius: 5,
            fillColor: '#3b82f6',
            lineColor: '#ffffff',
            lineWidth: 2
          },
          dataLabels: {
            enabled: true,
            format: '{y}%',
            y: -10,
            style: {
              color: '#2563eb',
              fontSize: '11px',
              fontWeight: '700',
              textOutline: 'none'
            }
          },
          data: [
            null,
            null,
            null,
            { y: 46, dataLabels: { enabled: false } },
            65,
            80
          ]
        }
      ]
    };
  }



  initProjectData(): void {
    this.currentProject = this.getProjectData();
    if (this.currentProject) {
      if (this.currentProject.productName) {
        this.projectName = this.currentProject.productName;
      }
      if (this.currentProject.projectCode) {
        this.projectCode = this.currentProject.projectCode;
      }
      if (this.currentProject.projectLead || this.currentProject.projectOwner) {
        this.projectManager = this.currentProject.projectLead || this.currentProject.projectOwner;
      }
      if (this.currentProject.projectStartDate) {
        this.startDate = this.currentProject.projectStartDate;
      }
      if (this.currentProject.projectEndDate) {
        this.targetFinish = this.currentProject.projectEndDate;
      }
      if (this.currentProject.status) {
        this.projectStatus = this.currentProject.status;
      }
      if (this.currentProject.division || this.currentProject.registrationType) {
        this.projectType = this.currentProject.division || this.currentProject.registrationType;
      }
    }
    this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
  }

  getProjectData(): any {
    const pCode = (this.projectCode || '').trim().toLowerCase();
    const pName = (this.projectName || '').trim().toLowerCase();

    let matched = projects.find(p => {
      const c = (p.projectCode || '').trim().toLowerCase();
      const n = (p.productName || '').trim().toLowerCase();
      return (pCode && pCode !== 'j001' && (c === pCode || pCode.includes(c) || c.includes(pCode))) ||
        (pName && (n === pName || pName.includes(n) || n.includes(pName)));
    });

    if (!matched && projects.length > 0) {
      matched = projects[0];
    }

    const defaultLocation = locations && locations.length ? locations[0] : 'Hyderabad';

    if (matched) {
      return {
        ...matched,
        projectCode: (this.projectCode && this.projectCode !== 'J001') ? this.projectCode : (matched.projectCode || '2026/CHM/001'),
        productName: this.projectName || matched.productName || 'Acrylic Emulsion Binder 50% Solids',
        division: matched.division || 'Specialty Chemicals - SC',
        location: matched.location || defaultLocation,
        status: matched.status || 'Active'
      };
    }

    return {
      projectCode: this.projectCode || '2026/CHM/001',
      productName: this.projectName || 'Acrylic Emulsion Binder 50% Solids',
      molecule: 'Acrylic Emulsion Binder 50% Solids',
      division: 'Specialty Chemicals - SC',
      starProduct: 'Yes',
      registrationType: 'Regularisation / Revalidation',
      projectOwner: 'Shantaram',
      projectLead: this.projectManager || 'R. Kulkarni',
      location: defaultLocation,
      priority: 'High',
      projectStartDate: this.startDate || '01-Jul-2026',
      projectEndDate: this.targetFinish || '30-Jun-2027',
      projectBudget: '0.45',
      market: 'Industrial Coatings / Construction',
      marketSizeLast3Years: '',
      marketSizeUsdMnYr: '85',
      projectedMarketShare: '6.0%',
      commercialAttractiveness: 'High',
      projectedNpv: '4.2',
      dosageForm: 'Industrial Emulsion / Liquid',
      strength: '50% Solids w/w',
      fillVolume: 'NA',
      pharmacopoeia: 'ASTM D2369 / ISO 3251 Standard Specs',
      packagingDetails: '200L HDPE Drums / 1000L IBC Totes',
      innovatorCompany: 'BASF SE / Dow Chemical',
      innovatorBrandName: 'Acronal / Joncryl Benchmark',
      innovatorDosageForm: 'Aqueous Polymer Dispersion',
      innovatorStrengths: '50% Active Polymer Solids',
      innovatorApprovalDate: 'Commercial Grade Standard',
      innovatorPackPresentation: '200L Drum / Bulk Road Tanker',
      innovatorBioStrength: '50% Solids',
      rldInformation: 'Available',
      innovatorVsJodas: 'Matches viscosity, Tg (18°C), and particle size distribution',
      ipDetails: 'Polymer composition non-infringing; synthesis process evaluated for Freedom-to-Operate',
      apiManufacturer: 'Styrene/Butyl Acrylate (Reliance / BASF)',
      polymorphForm: 'Liquid Emulsion (Brookfield Viscosity: 1200–2500 cP)',
      cepDmfNoReceiptStatus: 'REACH Registration Dossier: Available / Valid',
      dmfAsmfCepReceived: 'Technical Data Sheet & GHS SDS Available',
      apiVendorQualification: 'Qualified',
      apiMl: 'Industrial License: Valid',
      apiGmp: 'ISO 9001:2015 & ISO 14001:2015 Certified',
      ml: 'Available',
      whoGmp: 'ISO 45001:2018 EHS Compliant',
      bioStudyCroName: '',
      bioStudyCroGmpStatus: 'Compliant',
      beNoc: '',
      studyTimePeriod: '',
      bioStudyReport: 'Application Performance Report Available',
      remarks: '',
      status: 'Active'
    };
  }

  openEditDialog(project?: any): void {
    if (!this.currentProject) {
      this.initProjectData();
    }
    const projToEdit = project || this.currentProject || this.getProjectData();

    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: projToEdit
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const updated = {
          ...projToEdit,
          projectCode: res.projectCode ?? projToEdit.projectCode,
          productName: res.productName ?? projToEdit.productName,
          molecule: res.module ?? projToEdit.molecule,
          division: res.division !== undefined ? res.division : projToEdit.division,
          starProduct: res.starProduct !== undefined ? res.starProduct : projToEdit.starProduct,
          registrationType: res.registrationType !== undefined ? res.registrationType : projToEdit.registrationType,
          projectOwner: res.projectOwner ?? projToEdit.projectOwner,
          projectLead: res.projectLead ?? projToEdit.projectLead,
          location: res.location !== undefined ? res.location : projToEdit.location,
          priority: res.priority !== undefined ? res.priority : projToEdit.priority,
          projectStartDate: res.projectStartDate !== undefined ? res.projectStartDate : projToEdit.projectStartDate,
          projectEndDate: res.projectEndDate !== undefined ? res.projectEndDate : projToEdit.projectEndDate,
          projectBudget: res.projectBudget !== undefined ? res.projectBudget : projToEdit.projectBudget,
          market: res.market !== undefined ? res.market : projToEdit.market,
          marketSizeLast3Years: res.marketSizeLast3Years !== undefined ? res.marketSizeLast3Years : projToEdit.marketSizeLast3Years,
          marketSizeUsdMnYr: res.marketSizeUsdMnYr !== undefined ? res.marketSizeUsdMnYr : projToEdit.marketSizeUsdMnYr,
          projectedMarketShare: res.projectedMarketShare !== undefined ? res.projectedMarketShare : projToEdit.projectedMarketShare,
          commercialAttractiveness: res.commercialAttractiveness !== undefined ? res.commercialAttractiveness : projToEdit.commercialAttractiveness,
          projectedNpv: res.projectedNpv !== undefined ? res.projectedNpv : projToEdit.projectedNpv,
          dosageForm: res.dosageForm !== undefined ? res.dosageForm : projToEdit.dosageForm,
          strength: res.strength !== undefined ? res.strength : projToEdit.strength,
          fillVolume: res.fillVolume !== undefined ? res.fillVolume : projToEdit.fillVolume,
          pharmacopoeia: res.pharmacopoeia !== undefined ? res.pharmacopoeia : projToEdit.pharmacopoeia,
          packagingDetails: res.packagingDetails !== undefined ? res.packagingDetails : projToEdit.packagingDetails,
          innovatorCompany: res.innovatorCompany !== undefined ? res.innovatorCompany : projToEdit.innovatorCompany,
          innovatorBrandName: res.innovatorBrandName !== undefined ? res.innovatorBrandName : projToEdit.innovatorBrandName,
          innovatorDosageForm: res.innovatorDosageForm !== undefined ? res.innovatorDosageForm : projToEdit.innovatorDosageForm,
          innovatorStrengths: res.innovatorStrengths !== undefined ? res.innovatorStrengths : projToEdit.innovatorStrengths,
          innovatorApprovalDate: res.innovatorApprovalDate !== undefined ? res.innovatorApprovalDate : projToEdit.innovatorApprovalDate,
          innovatorPackPresentation: res.innovatorPackPresentation !== undefined ? res.innovatorPackPresentation : projToEdit.innovatorPackPresentation,
          innovatorBioStrength: res.innovatorBioStrength !== undefined ? res.innovatorBioStrength : projToEdit.innovatorBioStrength,
          rldInformation: res.rldInformation !== undefined ? res.rldInformation : projToEdit.rldInformation,
          innovatorVsJodas: res.innovatorVsJodas !== undefined ? res.innovatorVsJodas : projToEdit.innovatorVsJodas,
          ipDetails: res.ipDetails !== undefined ? res.ipDetails : projToEdit.ipDetails,
          apiManufacturer: res.apiManufacturer !== undefined ? res.apiManufacturer : projToEdit.apiManufacturer,
          polymorphForm: res.polymorphForm !== undefined ? res.polymorphForm : projToEdit.polymorphForm,
          cepDmfNoReceiptStatus: res.cepDmfNoReceiptStatus !== undefined ? res.cepDmfNoReceiptStatus : projToEdit.cepDmfNoReceiptStatus,
          dmfAsmfCepReceived: res.dmfAsmfCepReceived !== undefined ? res.dmfAsmfCepReceived : projToEdit.dmfAsmfCepReceived,
          apiVendorQualification: res.apiVendorQualification !== undefined ? res.apiVendorQualification : projToEdit.apiVendorQualification,
          apiMl: res.apiMl !== undefined ? res.apiMl : projToEdit.apiMl,
          apiGmp: res.apiGmp !== undefined ? res.apiGmp : projToEdit.apiGmp,
          ml: res.ml !== undefined ? res.ml : projToEdit.ml,
          whoGmp: res.whoGmp !== undefined ? res.whoGmp : projToEdit.whoGmp,
          bioStudyCroName: res.bioStudyCroName !== undefined ? res.bioStudyCroName : projToEdit.bioStudyCroName,
          bioStudyCroGmpStatus: res.bioStudyCroGmpStatus !== undefined ? res.bioStudyCroGmpStatus : projToEdit.bioStudyCroGmpStatus,
          beNoc: res.beNoc !== undefined ? res.beNoc : projToEdit.beNoc,
          studyTimePeriod: res.studyTimePeriod !== undefined ? res.studyTimePeriod : projToEdit.studyTimePeriod,
          bioStudyReport: res.bioStudyReport !== undefined ? res.bioStudyReport : projToEdit.bioStudyReport,
          remarks: res.remarks !== undefined ? res.remarks : projToEdit.remarks,
          status: res.active !== false ? 'Active' : 'Inactive',
        };

        this.currentProject = updated;

        const matchedIndex = projects.findIndex(p => p.projectCode === projToEdit.projectCode || p.productName === projToEdit.productName);
        if (matchedIndex !== -1) {
          Object.assign(projects[matchedIndex], updated);
        }

        if (updated.productName) this.projectName = updated.productName;
        if (updated.projectCode) this.projectCode = updated.projectCode;
        if (updated.projectLead || updated.projectOwner) {
          this.projectManager = updated.projectLead || updated.projectOwner;
        }
        if (updated.projectStartDate) this.startDate = updated.projectStartDate;
        if (updated.projectEndDate) this.targetFinish = updated.projectEndDate;
        if (updated.status) this.projectStatus = updated.status;
        if (updated.registrationType || updated.division) {
          this.projectType = updated.registrationType || updated.division;
        }
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      }
    });
  }
}