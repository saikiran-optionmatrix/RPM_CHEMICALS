import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

export interface StageProject {
  name: string;
  code: string;
  health: 'On track' | 'Watch' | 'At risk';
}

export interface PipelineStage {
  code: string;
  name: string;
  projects: StageProject[];
  gateAfter?: {
    num: number;
    code: string;
  };
}

export interface GateSummaryCard {
  gateNum: number;
  name: string;
  passedCount: number;
  totalCount: number;
  percent: number;
  sitsOn: string;
}

@Component({
  selector: 'app-dashboard-stages',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-stages.component.html',
  styleUrls: ['./dashboard-stages.component.scss']
})
export class DashboardStagesComponent implements OnInit {
  stages: PipelineStage[] = [
    {
      code: 'S1',
      name: 'Opportunity',
      projects: []
    },
    {
      code: 'S2',
      name: 'Concept',
      projects: [
        { name: 'PUD Dispersion', code: '2026/CHM/001', health: 'On track' }
      ],
      gateAfter: { num: 1, code: '01' }
    },
    {
      code: 'S3',
      name: 'Route Scouting',
      projects: [
        { name: 'Pd/C Catalyst', code: '2026/CHM/002', health: 'Watch' }
      ]
    },
    {
      code: 'S4',
      name: 'Process Opt.',
      projects: [
        { name: 'Agro AI Synthesis', code: '2026/CHM/003', health: 'At risk' },
        { name: 'Solvent Recovery', code: '2026/CHM/004', health: 'On track' },
        { name: 'Acrylic Binder', code: '2026/CHM/006', health: 'Watch' }
      ]
    },
    {
      code: 'S5',
      name: 'Route Selection',
      projects: [
        { name: 'WDG Formulation', code: '2026/CHM/005', health: 'Watch' }
      ],
      gateAfter: { num: 2, code: '02' }
    },
    {
      code: 'S6',
      name: 'Bench-to-Pilot',
      projects: []
    },
    {
      code: 'S7',
      name: 'Safety & Reg.',
      projects: [],
      gateAfter: { num: 3, code: '03' }
    },
    {
      code: 'S8',
      name: 'Registration',
      projects: [
        { name: 'Liquid Epoxy Resin', code: '2026/CHM/007', health: 'On track' }
      ]
    },
    {
      code: 'S9',
      name: 'Pilot Plant',
      projects: [
        { name: 'SLES 70% Paste', code: '2026/CHM/008', health: 'Watch' }
      ]
    },
    {
      code: 'S10',
      name: 'Demo Scale',
      projects: [
        { name: 'Fumed Silica', code: '2026/CHM/009', health: 'At risk' }
      ],
      gateAfter: { num: 4, code: '04' }
    },
    {
      code: 'S11',
      name: 'Plant Build',
      projects: [
        { name: 'H₂O₂ 50%', code: '2026/CHM/010', health: 'On track' }
      ],
      gateAfter: { num: 5, code: '05' }
    },
    {
      code: 'S12',
      name: 'Launch',
      projects: []
    }
  ];

  gates: GateSummaryCard[] = [
    {
      gateNum: 1,
      name: 'Concept Approval',
      passedCount: 9,
      totalCount: 10,
      percent: 90,
      sitsOn: 'S2'
    },
    {
      gateNum: 2,
      name: 'Process Route Selection',
      passedCount: 4,
      totalCount: 10,
      percent: 40,
      sitsOn: 'S5'
    },
    {
      gateNum: 3,
      name: 'Registration & Pilot Readiness',
      passedCount: 4,
      totalCount: 10,
      percent: 40,
      sitsOn: 'S7'
    },
    {
      gateNum: 4,
      name: 'Demo-Scale Proof',
      passedCount: 1,
      totalCount: 10,
      percent: 10,
      sitsOn: 'S10'
    },
    {
      gateNum: 5,
      name: 'Commercial Production Readiness',
      passedCount: 0,
      totalCount: 10,
      percent: 0,
      sitsOn: 'S11'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToProject(p: StageProject): void {
    this.router.navigate(['/projects', 'dashboard'], {
      queryParams: {
        projectCode: p.code,
        projectName: p.name
      }
    });
  }
}
