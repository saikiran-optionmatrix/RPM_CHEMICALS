import { Component, OnInit, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

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

export interface TaskItem {
  id: number;
  taskName: string;
  taskCode: string;
  reference: string;
  jobCode: string;
  startDate: string;
  dueDate: string;
  completionDate: string;
  responsibility: string;
  department: string;
  section: string;
  priority: 'High' | 'Med' | 'Low';
  status: 'Initiated' | 'Overdue' | 'Completed' | 'Pending Approval' | 'Approved' | 'In Progress';
  stage: 'Initiation' | 'Planning' | 'Development' | 'Regulatory' | 'Approval';
  progressPct: number;
}

@Component({
  selector: 'app-dashboard-taskcontrol',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatInputModule, MatPaginatorModule, MatTooltipModule, RouterModule
  ],
  templateUrl: './dashboard-taskcontrol.component.html',
  styleUrls: ['./dashboard-taskcontrol.component.scss'],
})
export class DashboardTaskcontrolComponent implements OnInit, AfterViewInit {
  // Top Filters: Division & Location (matching DashboardDelayReasonsComponent)
  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT',
  ];

  readonly locationsList: string[] = [
    'All',
    'Hyderabad',
    'Mumbai',
    'Bengaluru',
    'Ahmedabad',
    'Pune',
    'Chennai',
    'Delhi',
    'Baddi',
  ];

  onApplyFilters(): void {
    // UI filter apply trigger
  }

  // 5 Top Readonly KPI Cards: Initiated, Overdue, Completed, Pending Approval, Approved
  readonly kpiCards = [
    { title: 'Initiated', value: 142, icon: 'play_circle', colorClass: 'kpi-info', borderClass: 'kpi-border-info' },
    { title: 'Overdue', value: 74, icon: 'error_outline', colorClass: 'kpi-danger', borderClass: 'kpi-border-danger' },
    { title: 'Completed', value: 221, icon: 'check_circle', colorClass: 'kpi-success', borderClass: 'kpi-border-success' },
    { title: 'Pending Approval', value: 52, icon: 'hourglass_top', colorClass: 'kpi-warning', borderClass: 'kpi-border-warning' },
    { title: 'Approved', value: 135, icon: 'verified', colorClass: 'kpi-primary', borderClass: 'kpi-border-primary' }
  ];

  // Active filters: Status (KPI cards / donut chart) & Stage
  selectedStatusFilter: string | null = null;
  selectedStageFilter: string | null = null;

  readonly statusList = [
    { name: 'Initiated', count: 142, pct: 23, color: '#3b82f6' },
    { name: 'Overdue', count: 74, pct: 12, color: '#ef4444' },
    { name: 'Completed', count: 221, pct: 35, color: '#10b981' },
    { name: 'Pending Approval', count: 52, pct: 8, color: '#f59e0b' },
    { name: 'Approved', count: 135, pct: 22, color: '#0d9488' }
  ];

  get stageList() {
    return this.statusList;
  }

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;

  // All Tasks Master List
  allTasks: TaskItem[] = [];
  filteredTasks: TaskItem[] = [];
  paginatedTasks: TaskItem[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initTasksData();
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderTasksByStageChart();
      this.renderOverdueTrendChart();
      this.renderTasksByPriorityChart();
    }, 0);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof Highcharts !== 'undefined' && Highcharts.charts) {
      Highcharts.charts.forEach(c => {
        if (c) c.reflow();
      });
    }
  }

  initTasksData(): void {
    this.allTasks = [
      // Initiation Stage
      {
        id: 1,
        taskName: 'Business Case & Commercial Scope Assessment',
        taskCode: 'TSK-101',
        reference: 'REF-SOP-012',
        jobCode: 'JOB-PRJ-01',
        startDate: '05-Jan-2026',
        dueDate: '20-Jan-2026',
        completionDate: '18-Jan-2026',
        responsibility: 'Karthikeyan S',
        department: 'PMO & Strategy',
        section: 'Project Planning',
        priority: 'High',
        status: 'Completed',
        stage: 'Initiation',
        progressPct: 100
      },
      {
        id: 2,
        taskName: 'Patent Landscape & FTO Freedom to Operate Search',
        taskCode: 'TSK-102',
        reference: 'REF-IP-004',
        jobCode: 'JOB-IP-02',
        startDate: '12-Jan-2026',
        dueDate: '28-Jan-2026',
        completionDate: '27-Jan-2026',
        responsibility: 'Ananya Sharma',
        department: 'Intellectual Property',
        section: 'Legal & Patents',
        priority: 'High',
        status: 'Completed',
        stage: 'Initiation',
        progressPct: 100
      },
      {
        id: 3,
        taskName: 'Market Viability & Volume Forecasting',
        taskCode: 'TSK-103',
        reference: 'REF-MKT-088',
        jobCode: 'JOB-COM-03',
        startDate: '18-Jan-2026',
        dueDate: '05-Feb-2026',
        completionDate: '-',
        responsibility: 'Jyoti Ranjan',
        department: 'Commercial Ops',
        section: 'Portfolio Mgmt',
        priority: 'Med',
        status: 'Initiated',
        stage: 'Initiation',
        progressPct: 40
      },
      {
        id: 4,
        taskName: 'Initial Technical Risk Assessment Matrix',
        taskCode: 'TSK-104',
        reference: 'REF-RA-019',
        jobCode: 'JOB-DEV-01',
        startDate: '25-Jan-2026',
        dueDate: '12-Feb-2026',
        completionDate: '-',
        responsibility: 'Naveen Kumar',
        department: 'Formulation R&D',
        section: 'Oral Solids',
        priority: 'High',
        status: 'Pending Approval',
        stage: 'Initiation',
        progressPct: 80
      },
      {
        id: 5,
        taskName: 'Sourcing Strategy for Reference Listed Drug (RLD)',
        taskCode: 'TSK-105',
        reference: 'REF-SCM-051',
        jobCode: 'JOB-SCM-04',
        startDate: '02-Feb-2026',
        dueDate: '18-Feb-2026',
        completionDate: '-',
        responsibility: 'Suresh Reddy',
        department: 'Supply Chain',
        section: 'Procurement',
        priority: 'Med',
        status: 'Initiated',
        stage: 'Initiation',
        progressPct: 30
      },
      {
        id: 6,
        taskName: 'Project Charter & Stakeholder Alignment Sign-off',
        taskCode: 'TSK-106',
        reference: 'REF-SOP-015',
        jobCode: 'JOB-PRJ-02',
        startDate: '08-Feb-2026',
        dueDate: '22-Feb-2026',
        completionDate: '21-Feb-2026',
        responsibility: 'Preethi N',
        department: 'Project Mgmt',
        section: 'PMO',
        priority: 'Low',
        status: 'Approved',
        stage: 'Initiation',
        progressPct: 100
      },

      // Planning Stage
      {
        id: 7,
        taskName: 'WBS Breakdown & Deliverables Baseline Setup',
        taskCode: 'TSK-201',
        reference: 'REF-WBS-001',
        jobCode: 'JOB-PRJ-03',
        startDate: '15-Feb-2026',
        dueDate: '02-Mar-2026',
        completionDate: '28-Feb-2026',
        responsibility: 'Jyoti Ranjan',
        department: 'Project Mgmt',
        section: 'PMO',
        priority: 'High',
        status: 'Completed',
        stage: 'Planning',
        progressPct: 100
      },
      {
        id: 8,
        taskName: 'Master Project Timeline & Critical Path Mapping',
        taskCode: 'TSK-202',
        reference: 'REF-PM-032',
        jobCode: 'JOB-PRJ-04',
        startDate: '22-Feb-2026',
        dueDate: '10-Mar-2026',
        completionDate: '09-Mar-2026',
        responsibility: 'Karthikeyan S',
        department: 'PMO & Strategy',
        section: 'Scheduling',
        priority: 'High',
        status: 'Completed',
        stage: 'Planning',
        progressPct: 100
      },
      {
        id: 9,
        taskName: 'Formulation Resource & Equipment Allocation Plan',
        taskCode: 'TSK-203',
        reference: 'REF-RES-077',
        jobCode: 'JOB-DEV-02',
        startDate: '01-Mar-2026',
        dueDate: '16-Mar-2026',
        completionDate: '15-Mar-2026',
        responsibility: 'Naveen Kumar',
        department: 'Formulation R&D',
        section: 'Injectables',
        priority: 'Med',
        status: 'Approved',
        stage: 'Planning',
        progressPct: 100
      },
      {
        id: 10,
        taskName: 'Analytical Method Development Protocol & Standards',
        taskCode: 'TSK-204',
        reference: 'REF-AD-011',
        jobCode: 'JOB-ARD-01',
        startDate: '05-Mar-2026',
        dueDate: '20-Mar-2026',
        completionDate: '-',
        responsibility: 'Preethi N',
        department: 'Analytical R&D',
        section: 'Quality Control',
        priority: 'High',
        status: 'Overdue',
        stage: 'Planning',
        progressPct: 60
      },
      {
        id: 11,
        taskName: 'Target Product Profile (TPP) Definition',
        taskCode: 'TSK-205',
        reference: 'REF-REG-005',
        jobCode: 'JOB-REG-01',
        startDate: '10-Mar-2026',
        dueDate: '25-Mar-2026',
        completionDate: '-',
        responsibility: 'Ananya Sharma',
        department: 'Regulatory Affairs',
        section: 'Documentation',
        priority: 'Med',
        status: 'Pending Approval',
        stage: 'Planning',
        progressPct: 85
      },
      {
        id: 12,
        taskName: 'Budget Allocation & Cost Center Mapping',
        taskCode: 'TSK-206',
        reference: 'REF-FIN-021',
        jobCode: 'JOB-FIN-01',
        startDate: '14-Mar-2026',
        dueDate: '30-Mar-2026',
        completionDate: '29-Mar-2026',
        responsibility: 'Suresh Reddy',
        department: 'Finance',
        section: 'Cost Accounting',
        priority: 'Low',
        status: 'Completed',
        stage: 'Planning',
        progressPct: 100
      },

      // Development Stage
      {
        id: 13,
        taskName: 'API Characterization & Polymorph Solubility Profiling',
        taskCode: 'TSK-301',
        reference: 'REF-API-045',
        jobCode: 'JOB-DEV-05',
        startDate: '01-Apr-2026',
        dueDate: '20-Apr-2026',
        completionDate: '18-Apr-2026',
        responsibility: 'Naveen Kumar',
        department: 'Formulation R&D',
        section: 'Solid Orals',
        priority: 'High',
        status: 'Completed',
        stage: 'Development',
        progressPct: 100
      },
      {
        id: 14,
        taskName: 'Excipient Compatibility Study Protocol & Execution',
        taskCode: 'TSK-302',
        reference: 'REF-EXC-019',
        jobCode: 'JOB-DEV-06',
        startDate: '08-Apr-2026',
        dueDate: '25-Apr-2026',
        completionDate: '24-Apr-2026',
        responsibility: 'Naveen Kumar',
        department: 'Formulation R&D',
        section: 'Oral Solids',
        priority: 'High',
        status: 'Completed',
        stage: 'Development',
        progressPct: 100
      },
      {
        id: 15,
        taskName: 'Reverse Engineering & Deformulation of Innovator',
        taskCode: 'TSK-303',
        reference: 'REF-REV-008',
        jobCode: 'JOB-DEV-07',
        startDate: '15-Apr-2026',
        dueDate: '05-May-2026',
        completionDate: '-',
        responsibility: 'Preethi N',
        department: 'Formulation R&D',
        section: 'Pre-formulation',
        priority: 'High',
        status: 'Overdue',
        stage: 'Development',
        progressPct: 70
      },
      {
        id: 16,
        taskName: 'Assay & Related Substances HPLC Method Validation',
        taskCode: 'TSK-304',
        reference: 'REF-ARD-088',
        jobCode: 'JOB-ARD-03',
        startDate: '22-Apr-2026',
        dueDate: '12-May-2026',
        completionDate: '-',
        responsibility: 'Ananya Sharma',
        department: 'Analytical R&D',
        section: 'Chromatography',
        priority: 'Med',
        status: 'Initiated',
        stage: 'Development',
        progressPct: 50
      },
      {
        id: 17,
        taskName: 'Dissolution Method in Multi-Media Conditions',
        taskCode: 'TSK-305',
        reference: 'REF-ARD-092',
        jobCode: 'JOB-ARD-04',
        startDate: '28-Apr-2026',
        dueDate: '18-May-2026',
        completionDate: '-',
        responsibility: 'Preethi N',
        department: 'Analytical R&D',
        section: 'Dissolution Lab',
        priority: 'Med',
        status: 'Overdue',
        stage: 'Development',
        progressPct: 45
      },
      {
        id: 18,
        taskName: 'Prototype Formulation Optimization Batches',
        taskCode: 'TSK-306',
        reference: 'REF-DEV-105',
        jobCode: 'JOB-DEV-08',
        startDate: '05-May-2026',
        dueDate: '25-May-2026',
        completionDate: '-',
        responsibility: 'Naveen Kumar',
        department: 'Formulation R&D',
        section: 'Oral Solids',
        priority: 'High',
        status: 'Pending Approval',
        stage: 'Development',
        progressPct: 90
      },
      {
        id: 19,
        taskName: 'Stress & Accelerated Forced Degradation Profiling',
        taskCode: 'TSK-307',
        reference: 'REF-ARD-103',
        jobCode: 'JOB-ARD-05',
        startDate: '12-May-2026',
        dueDate: '30-May-2026',
        completionDate: '-',
        responsibility: 'Suresh Reddy',
        department: 'Analytical R&D',
        section: 'Stability Testing',
        priority: 'Med',
        status: 'Initiated',
        stage: 'Development',
        progressPct: 40
      },
      {
        id: 20,
        taskName: 'Primary & Secondary Packaging Compatibility Studies',
        taskCode: 'TSK-308',
        reference: 'REF-PKG-014',
        jobCode: 'JOB-PKG-01',
        startDate: '18-May-2026',
        dueDate: '08-Jun-2026',
        completionDate: '06-Jun-2026',
        responsibility: 'Karthikeyan S',
        department: 'Packaging Dev',
        section: 'Packaging Lab',
        priority: 'Low',
        status: 'Approved',
        stage: 'Development',
        progressPct: 100
      },

      // Regulatory Stage
      {
        id: 21,
        taskName: 'Regulatory Dossier Gap Analysis (USFDA / EMA)',
        taskCode: 'TSK-401',
        reference: 'REF-REG-042',
        jobCode: 'JOB-REG-03',
        startDate: '01-Jun-2026',
        dueDate: '18-Jun-2026',
        completionDate: '16-Jun-2026',
        responsibility: 'Ananya Sharma',
        department: 'Regulatory Affairs',
        section: 'International Reg',
        priority: 'High',
        status: 'Completed',
        stage: 'Regulatory',
        progressPct: 100
      },
      {
        id: 22,
        taskName: 'Drug Master File (DMF) Completeness & Letter of Access',
        taskCode: 'TSK-402',
        reference: 'REF-DMF-009',
        jobCode: 'JOB-REG-04',
        startDate: '10-Jun-2026',
        dueDate: '28-Jun-2026',
        completionDate: '-',
        responsibility: 'Ananya Sharma',
        department: 'Regulatory Affairs',
        section: 'API Filings',
        priority: 'High',
        status: 'Pending Approval',
        stage: 'Regulatory',
        progressPct: 85
      },
      {
        id: 23,
        taskName: 'Module 3 Quality Overall Summary Compilation',
        taskCode: 'TSK-403',
        reference: 'REF-CTD-031',
        jobCode: 'JOB-REG-05',
        startDate: '18-Jun-2026',
        dueDate: '08-Jul-2026',
        completionDate: '-',
        responsibility: 'Preethi N',
        department: 'Regulatory Affairs',
        section: 'eCTD Operations',
        priority: 'Med',
        status: 'Overdue',
        stage: 'Regulatory',
        progressPct: 55
      },
      {
        id: 24,
        taskName: 'Labeling & Package Insert Harmonization Review',
        taskCode: 'TSK-404',
        reference: 'REF-LBL-017',
        jobCode: 'JOB-REG-06',
        startDate: '25-Jun-2026',
        dueDate: '15-Jul-2026',
        completionDate: '-',
        responsibility: 'Jyoti Ranjan',
        department: 'Regulatory Affairs',
        section: 'Medical Writing',
        priority: 'Low',
        status: 'Initiated',
        stage: 'Regulatory',
        progressPct: 35
      },
      {
        id: 25,
        taskName: 'Pre-Submission Briefing Package for Health Authority',
        taskCode: 'TSK-405',
        reference: 'REF-REG-077',
        jobCode: 'JOB-REG-07',
        startDate: '02-Jul-2026',
        dueDate: '20-Jul-2026',
        completionDate: '19-Jul-2026',
        responsibility: 'Ananya Sharma',
        department: 'Regulatory Affairs',
        section: 'Agency Liaison',
        priority: 'High',
        status: 'Completed',
        stage: 'Regulatory',
        progressPct: 100
      },

      // Approval Stage
      {
        id: 26,
        taskName: 'Quality Management System Compliance Clearance',
        taskCode: 'TSK-501',
        reference: 'REF-QA-089',
        jobCode: 'JOB-QA-01',
        startDate: '15-Jul-2026',
        dueDate: '30-Jul-2026',
        completionDate: '29-Jul-2026',
        responsibility: 'Suresh Reddy',
        department: 'Quality Assurance',
        section: 'Compliance',
        priority: 'High',
        status: 'Approved',
        stage: 'Approval',
        progressPct: 100
      },
      {
        id: 27,
        taskName: 'Technical Review Committee Governance Sign-Off',
        taskCode: 'TSK-502',
        reference: 'REF-TRC-012',
        jobCode: 'JOB-PRJ-08',
        startDate: '22-Jul-2026',
        dueDate: '08-Aug-2026',
        completionDate: '07-Aug-2026',
        responsibility: 'Karthikeyan S',
        department: 'PMO & Strategy',
        section: 'Governance',
        priority: 'High',
        status: 'Approved',
        stage: 'Approval',
        progressPct: 100
      },
      {
        id: 28,
        taskName: 'Regulatory Agency Filing Authorization Gate Approval',
        taskCode: 'TSK-503',
        reference: 'REF-REG-099',
        jobCode: 'JOB-REG-09',
        startDate: '01-Aug-2026',
        dueDate: '18-Aug-2026',
        completionDate: '-',
        responsibility: 'Ananya Sharma',
        department: 'Regulatory Affairs',
        section: 'Executive Council',
        priority: 'High',
        status: 'Pending Approval',
        stage: 'Approval',
        progressPct: 80
      },
      {
        id: 29,
        taskName: 'Commercial Launch Readiness & Supply Gate Assessment',
        taskCode: 'TSK-504',
        reference: 'REF-COM-044',
        jobCode: 'JOB-COM-05',
        startDate: '10-Aug-2026',
        dueDate: '28-Aug-2026',
        completionDate: '-',
        responsibility: 'Jyoti Ranjan',
        department: 'Commercial Ops',
        section: 'Supply Strategy',
        priority: 'Med',
        status: 'Pending Approval',
        stage: 'Approval',
        progressPct: 70
      },
      {
        id: 30,
        taskName: 'Final Dossier Archival & Verification Sign-off',
        taskCode: 'TSK-505',
        reference: 'REF-DOC-061',
        jobCode: 'JOB-QA-03',
        startDate: '18-Aug-2026',
        dueDate: '05-Sep-2026',
        completionDate: '04-Sep-2026',
        responsibility: 'Suresh Reddy',
        department: 'Quality Assurance',
        section: 'Documentation',
        priority: 'Low',
        status: 'Approved',
        stage: 'Approval',
        progressPct: 100
      }
    ];
  }

  // Filter Handling (Filtered when clicking any KPI card or status slice in Donut chart)
  applyFilters(): void {
    let result = [...this.allTasks];

    if (this.selectedStatusFilter) {
      result = result.filter(t => t.status.toLowerCase() === this.selectedStatusFilter!.toLowerCase());
    }

    if (this.selectedStageFilter) {
      result = result.filter(t => t.stage.toLowerCase() === this.selectedStageFilter!.toLowerCase());
    }

    this.filteredTasks = result;
    this.pageIndex = 0;
    this.updatePagination();
  }

  onStatusFilterClick(statusName: string): void {
    if (this.selectedStatusFilter === statusName) {
      this.selectedStatusFilter = null;
    } else {
      this.selectedStatusFilter = statusName;
    }
    this.applyFilters();
    this.cdr.detectChanges();
  }

  clearStatusFilter(): void {
    this.selectedStatusFilter = null;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  onStageSliceClick(stageName: string): void {
    this.onStatusFilterClick(stageName);
  }

  clearStageFilter(): void {
    this.selectedStageFilter = null;
    this.selectedStatusFilter = null;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = this.pageIndex * this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(start, start + this.pageSize);
  }

  // Highcharts Renderers
  renderTasksByStageChart(): void {
    const containerId = 'tasksByStageChartContainer';
    if (!document.getElementById(containerId)) return;

    const self = this;

    Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 210,
        margin: [0, 0, 0, 0]
      },
      title: {
        text: '<div style="text-align:center;line-height:1.2;"><span style="font-size:22px;font-weight:700;color:#0f172a;">624</span><br/><span style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Total Tasks</span></div>',
        align: 'center',
        verticalAlign: 'middle',
        useHTML: true
      },
      credits: { enabled: false },
      exporting: { enabled: false },
      tooltip: {
        pointFormat: '<b>{point.name}</b>: {point.y} tasks ({point.percentage:.1f}%)'
      },
      legend: { enabled: false },
      plotOptions: {
        pie: {
          size: '92%',
          innerSize: '68%',
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: { enabled: false },
          point: {
            events: {
              click: function (this: any) {
                self.onStatusFilterClick(this.name);
              }
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Tasks by Status',
        data: this.statusList.map(s => ({ name: s.name, y: s.count, color: s.color }))
      }]
    } as any);
  }

  renderOverdueTrendChart(): void {
    const containerId = 'overdueTrendChartContainer';
    if (!document.getElementById(containerId)) return;

    const categories = ['Jan\'26', 'Feb\'26', 'Mar\'26', 'Apr\'26', 'May\'26'];
    const trendValues = [22, 28, 35, 41, 35];

    // Build dynamic zones: upward segments (overdue rising) are red (#ef4444), downward segments (overdue improving) are green (#10b981)
    const zones: any[] = [];
    for (let i = 0; i < trendValues.length - 1; i++) {
      const isRising = trendValues[i + 1] >= trendValues[i];
      const segmentColor = isRising ? '#ef4444' : '#10b981';
      if (i < trendValues.length - 2) {
        zones.push({ value: i + 1, color: segmentColor });
      } else {
        zones.push({ color: segmentColor });
      }
    }

    // Individual point configuration with matching marker border colors
    const dataPoints = trendValues.map((val, idx) => {
      const isDownward = idx > 0 && trendValues[idx] < trendValues[idx - 1];
      const ptColor = isDownward ? '#10b981' : '#ef4444';
      return {
        y: val,
        color: ptColor,
        marker: {
          radius: 5,
          fillColor: '#ffffff',
          lineWidth: 2.5,
          lineColor: ptColor
        }
      };
    });

    Highcharts.chart(containerId, {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        height: 210,
        margin: [25, 20, 45, 40]
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      xAxis: {
        categories: categories,
        labels: { style: { fontSize: '11px', color: '#475569', fontWeight: '500' } },
        lineColor: '#e2e8f0'
      },
      yAxis: {
        min: 0,
        max: 50,
        tickInterval: 10,
        title: { text: 'No. of Tasks', style: { fontSize: '11px', color: '#64748b', fontWeight: '600' } },
        gridLineColor: '#f1f5f9'
      },
      legend: { enabled: false },
      tooltip: {
        useHTML: true,
        headerFormat: '<span style="font-size: 11px; font-weight: 600; color: #475569;">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}; font-size: 14px;">●</span> <b>Overdue Tasks</b>: <b>{point.y}</b>'
      },
      plotOptions: {
        line: {
          color: '#ef4444',
          lineWidth: 3,
          marker: {
            radius: 5,
            fillColor: '#ffffff',
            lineWidth: 2.5
          },
          dataLabels: {
            enabled: true,
            style: { fontSize: '12px', fontWeight: '700', color: '#0f172a', textOutline: 'none' }
          }
        }
      },
      series: [{
        type: 'line',
        name: 'Overdue Tasks',
        zoneAxis: 'x',
        zones: zones,
        data: dataPoints
      }]
    } as any);
  }

  renderTasksByPriorityChart(): void {
    const containerId = 'tasksByPriorityChartContainer';
    if (!document.getElementById(containerId)) return;

    const self = this;

    Highcharts.chart(containerId, {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 210,
        margin: [15, 30, 40, 60]
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      xAxis: {
        categories: ['High', 'Medium', 'Low'],
        title: { text: null },
        labels: { style: { fontSize: '12px', color: '#334155', fontWeight: '600' } },
        lineWidth: 0,
        tickWidth: 0
      },
      yAxis: {
        min: 0,
        max: 400,
        tickInterval: 100,
        title: { text: 'No. of Tasks', style: { fontSize: '11px', color: '#64748b', fontWeight: '600' } },
        gridLineColor: '#f1f5f9'
      },
      legend: { enabled: false },
      tooltip: {
        pointFormat: '<b>{point.category} Priority</b>: {point.y} tasks'
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          pointWidth: 18,
          dataLabels: {
            enabled: true,
            align: 'right',
            x: 28,
            style: { fontSize: '12px', fontWeight: '700', color: '#0f172a' }
          }
        }
      },
      series: [{
        type: 'bar',
        name: 'Tasks',
        data: [
          { y: 140, color: '#10b981' }, // Low
          { y: 302, color: '#f59e0b' }, // Medium
          { y: 182, color: '#ef4444' }  // High
        ]
      }]
    } as any);
  }
}
