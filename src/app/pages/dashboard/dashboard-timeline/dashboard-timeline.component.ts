import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface RoadmapItem {
  name: string;
  code: string;
  slipText: string;
  statusColor: 'teal' | 'amber' | 'red';
  baselineStartPct: number;
  baselineWidthPct: number;
  forecastStartPct: number;
  forecastWidthPct: number;
}

export interface GateDeliverable {
  num: number;
  name: string;
  percent: number;
  status: 'completed' | 'in-progress' | 'behind' | 'not-started';
}

@Component({
  selector: 'app-dashboard-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-timeline.component.html',
  styleUrls: ['./dashboard-timeline.component.scss']
})
export class DashboardTimelineComponent implements OnInit {
  years = ['2025', '2026', '2027', '2028', '2029', '2030'];

  roadmapItems: RoadmapItem[] = [
    {
      name: 'PUD Dispersion',
      code: '2026/CHM/001',
      slipText: '37 d early',
      statusColor: 'teal',
      baselineStartPct: 20,
      baselineWidthPct: 45,
      forecastStartPct: 20,
      forecastWidthPct: 43
    },
    {
      name: 'Pd/C Catalyst',
      code: '2026/CHM/002',
      slipText: '+73 d slip',
      statusColor: 'amber',
      baselineStartPct: 20,
      baselineWidthPct: 48,
      forecastStartPct: 20,
      forecastWidthPct: 53
    },
    {
      name: 'Agro AI Synthesis',
      code: '2026/CHM/003',
      slipText: '+146 d slip',
      statusColor: 'red',
      baselineStartPct: 22,
      baselineWidthPct: 46,
      forecastStartPct: 22,
      forecastWidthPct: 62
    },
    {
      name: 'Solvent Recovery',
      code: '2026/CHM/004',
      slipText: 'on plan',
      statusColor: 'teal',
      baselineStartPct: 20,
      baselineWidthPct: 48,
      forecastStartPct: 20,
      forecastWidthPct: 48
    },
    {
      name: 'WDG Formulation',
      code: '2026/CHM/005',
      slipText: '+73 d slip',
      statusColor: 'amber',
      baselineStartPct: 20,
      baselineWidthPct: 46,
      forecastStartPct: 20,
      forecastWidthPct: 50
    },
    {
      name: 'Acrylic Binder',
      code: '2026/CHM/006',
      slipText: '+55 d slip',
      statusColor: 'amber',
      baselineStartPct: 21,
      baselineWidthPct: 66,
      forecastStartPct: 21,
      forecastWidthPct: 69
    },
    {
      name: 'Liquid Epoxy Resin',
      code: '2026/CHM/007',
      slipText: '-36 d early',
      statusColor: 'teal',
      baselineStartPct: 15,
      baselineWidthPct: 58,
      forecastStartPct: 15,
      forecastWidthPct: 56
    },
    {
      name: 'SLES 70% Paste',
      code: '2026/CHM/008',
      slipText: '+109 d slip',
      statusColor: 'amber',
      baselineStartPct: 13,
      baselineWidthPct: 52,
      forecastStartPct: 13,
      forecastWidthPct: 58
    },
    {
      name: 'Fumed Silica',
      code: '2026/CHM/009',
      slipText: '+219 d slip',
      statusColor: 'red',
      baselineStartPct: 10,
      baselineWidthPct: 55,
      forecastStartPct: 10,
      forecastWidthPct: 68
    },
    {
      name: 'H₂O₂ 50%',
      code: '2026/CHM/010',
      slipText: 'on plan',
      statusColor: 'teal',
      baselineStartPct: 8,
      baselineWidthPct: 62,
      forecastStartPct: 8,
      forecastWidthPct: 62
    }
  ];

  deliverables: GateDeliverable[] = [
    {
      num: 1,
      name: 'Benchmark Grade Sourcing & Analytical Characterization',
      percent: 100,
      status: 'completed'
    },
    {
      num: 2,
      name: 'Raw Material & Process Route Evaluation',
      percent: 100,
      status: 'completed'
    },
    {
      num: 3,
      name: 'Critical Quality Attribute (CQA) and Performance Specification Profiling',
      percent: 80,
      status: 'in-progress'
    },
    {
      num: 4,
      name: 'Analytical Method Feasibility & Equivalence Testing Plan',
      percent: 55,
      status: 'behind'
    },
    {
      num: 5,
      name: 'Preliminary Cost of Manufacturing & Plant Feasibility',
      percent: 40,
      status: 'in-progress'
    },
    {
      num: 6,
      name: 'Concept Approval Go/No-Go Gate 1 Approval',
      percent: 0,
      status: 'not-started'
    }
  ];

  ngOnInit(): void {}
}
