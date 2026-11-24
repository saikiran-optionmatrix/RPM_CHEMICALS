import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HeatmapRow {
  function: string;
  values: (number | null)[];
  peak: number;
}

interface PrioritySegment {
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  value: number;
  color: string;
}

interface OpenBooking {
  resource: string;
  segments: PrioritySegment[];
  total: number;
  projects: number;
  overdue: number;
}

interface PeakWeek {
  function: string;
  peakWeek: string;
  activities: number;
  projects: string;
}

@Component({
  selector: 'app-dashboard-resourceload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-resourceload.component.html',
  styleUrl: './dashboard-resourceload.component.scss',
})
export class DashboardResourceloadComponent {

  selectedDivision = 'All divisions';
  selectedDosageForm = 'All dosage forms';
  selectedProject = 'All projects';
  selectedSnapshotDate = '17-Oct-2026 (weekly review)';

  divisions: string[] = ['All divisions', 'Contrast Media', 'Oncology', 'Complex Injections', 'General Injectables'];
  dosageForms: string[] = [
    'All dosage forms',
    'Tablets',
    'Lyo',
    'Solution for Injection',
    'Hard Capsules',
    'Capsules',
    'Oral suspension',
    'DPI'
  ];
  projects: string[] = [
    'All projects',
    '2026/RD/001 - Abiraterone Acetate',
    '2026/RD/002 - Azacitidine',
    '2026/RD/003 - Fulvestrant',
    '2026/RD/004 - Iohexol',
    '2026/RD/005 - Temozolomide'
  ];
  snapshotDates: string[] = ['17-Oct-2026 (weekly review)', '10-Oct-2026', '03-Oct-2026', '26-Sep-2026'];

  weeks: string[] = ['19-Oct', '26-Oct', '02-Nov', '09-Nov', '16-Nov', '23-Nov', '30-Nov', '07-Dec', '14-Dec', '21-Dec', '28-Dec', '04-Jan', '11-Jan', '18-Jan', '25-Jan', '01-Feb'];

  heatmapData: HeatmapRow[] = [
    { function: 'FR&D', values: [12, 4, 8, 8, 8, 5, 3, 2, 12, 13, 14, 8, 7, 7, 4, 3], peak: 14 },
    { function: 'DQA', values: [null, null, null, null, null, null, null, null, null, null, null, null, null, 18, 28, 12], peak: 28 },
    { function: 'QC/QA', values: [7, 9, 7, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1], peak: 9 },
    { function: 'R&D', values: [7, 6, 5, 3, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1], peak: 7 },
    { function: 'ARD', values: [1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 1, 1, 1, 5, 5, 2], peak: 5 },
    { function: 'R&D / Procurment', values: [5, 4, 1, null, null, null, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1], peak: 5 },
    { function: 'Clinical', values: [null, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], peak: 1 },
    { function: 'FR&D / Clinical', values: [null, null, null, null, 1, 1, 1, 1, 1, 1, 1, 1, 1, null, 1, 1], peak: 1 },
    { function: 'Procurment / R&D', values: [3, 1, 1, 1, 1, 1, 1, null, null, null, null, null, null, null, null, null], peak: 3 },
    { function: 'Clinical / R&D', values: [2, 1, 1, null, null, null, null, null, null, null, null, null, null, 1, 1, 1], peak: 2 },
    { function: 'RA', values: [null, null, null, null, null, null, null, null, null, null, 1, 1, 1, null, 1, 1], peak: 1 },
    { function: 'Operations / Engineering / QA', values: [null, 1, 1, 1, null, null, null, null, null, null, null, null, null, null, null, null], peak: 1 },
    { function: 'QC/QA/Operation/R&D/RA', values: [2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null, null], peak: 2 },
    { function: 'fR&D', values: [null, 1, 1, 1, null, null, null, null, null, null, null, null, null, null, null, null], peak: 1 }
  ];

  openBookings: OpenBooking[] = [
    {
      resource: 'FD',
      total: 7,
      projects: 4,
      overdue: 3,
      segments: [
        { priority: 'Critical', value: 1.5, color: '#1e3a8a' },
        { priority: 'High', value: 1.5, color: '#2563eb' },
        { priority: 'Medium', value: 4.0, color: '#93c5fd' }
      ]
    },
    {
      resource: 'QA',
      total: 8,
      projects: 3,
      overdue: 5,
      segments: [
        { priority: 'Critical', value: 1.5, color: '#1e3a8a' },
        { priority: 'High', value: 1.5, color: '#2563eb' },
        { priority: 'Medium', value: 5.0, color: '#93c5fd' }
      ]
    },
    {
      resource: 'AD',
      total: 6,
      projects: 3,
      overdue: 1,
      segments: [
        { priority: 'Critical', value: 3.5, color: '#1e3a8a' },
        { priority: 'Medium', value: 2.5, color: '#93c5fd' }
      ]
    },
    {
      resource: 'HPLC',
      total: 6,
      projects: 2,
      overdue: 5,
      segments: [
        { priority: 'Critical', value: 1.5, color: '#1e3a8a' },
        { priority: 'Medium', value: 4.5, color: '#93c5fd' }
      ]
    },
    {
      resource: 'RA',
      total: 4,
      projects: 2,
      overdue: 2,
      segments: [
        { priority: 'Medium', value: 4.0, color: '#93c5fd' }
      ]
    },
    {
      resource: 'QC analyst',
      total: 3,
      projects: 2,
      overdue: 1,
      segments: [
        { priority: 'Critical', value: 1.5, color: '#1e3a8a' },
        { priority: 'Medium', value: 1.5, color: '#93c5fd' }
      ]
    },
    {
      resource: 'AD analyst',
      total: 2,
      projects: 2,
      overdue: 0,
      segments: [
        { priority: 'Critical', value: 1.0, color: '#1e3a8a' },
        { priority: 'High', value: 1.0, color: '#2563eb' }
      ]
    },
    {
      resource: 'DQA',
      total: 2,
      projects: 2,
      overdue: 1,
      segments: [
        { priority: 'Critical', value: 1.0, color: '#1e3a8a' },
        { priority: 'Medium', value: 1.0, color: '#93c5fd' }
      ]
    },
    {
      resource: 'Pilot-scale process equipment',
      total: 4,
      projects: 1,
      overdue: 1,
      segments: [
        { priority: 'Critical', value: 4.0, color: '#1e3a8a' }
      ]
    },
    {
      resource: 'Dissolution',
      total: 3,
      projects: 1,
      overdue: 2,
      segments: [
        { priority: 'Medium', value: 3.0, color: '#93c5fd' }
      ]
    },
    {
      resource: 'Licensing',
      total: 2,
      projects: 1,
      overdue: 2,
      segments: [
        { priority: 'Medium', value: 2.0, color: '#93c5fd' }
      ]
    },
    {
      resource: 'Purchase',
      total: 2,
      projects: 1,
      overdue: 0,
      segments: [
        { priority: 'Medium', value: 2.0, color: '#93c5fd' }
      ]
    }
  ];

  peakWeeks: PeakWeek[] = [
    { function: 'DQA', peakWeek: '25-Jan', activities: 28, projects: 'RD/003 (28)' },
    { function: 'FR&D', peakWeek: '28-Dec', activities: 14, projects: 'RD/001 (13), RD/003 (1)' },
    { function: 'QC/QA', peakWeek: '26-Oct', activities: 9, projects: 'RD/004 (1), RD/005 (8)' },
    { function: 'R&D', peakWeek: '19-Oct', activities: 7, projects: 'RD/001 (1), RD/002 (5), RD/005 (1)' },
    { function: 'ARD', peakWeek: '18-Jan', activities: 5, projects: 'RD/001 (3), RD/002 (2)' },
    { function: 'R&D / Procurment', peakWeek: '19-Oct', activities: 5, projects: 'RD/002 (5)' },
    { function: 'Procurment / R&D', peakWeek: '19-Oct', activities: 3, projects: 'RD/002 (3)' },
    { function: 'Clinical / R&D', peakWeek: '19-Oct', activities: 2, projects: 'RD/002 (1), RD/005 (1)' }
  ];

  getHeatmapColorClass(value: number | null): string {
    if (!value) return 'hm-0';
    if (value >= 8) return 'hm-8';
    if (value >= 5) return 'hm-5';
    if (value >= 3) return 'hm-3';
    return 'hm-1';
  }

  getSegmentPercent(val: number): number {
    const maxReference = 10;
    return (val / maxReference) * 100;
  }
}
