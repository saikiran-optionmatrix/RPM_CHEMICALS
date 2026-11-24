import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface RegulatoryReadinessItem {
  project: string;
  pathway: string;
  status: 'Not started' | 'In prep' | 'Filed' | 'Approved';
  hazopPct: number;
  psmPct: number;
}

export interface GateCriteriaChecklistItem {
  code: string;
  name: string;
  status: 'passed' | 'pending' | 'failed';
  isMandatory: boolean;
}

@Component({
  selector: 'app-dashboard-fullkit',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-fullkit.component.html',
  styleUrls: ['./dashboard-fullkit.component.scss']
})
export class DashboardFullkitComponent implements OnInit {
  kpis = [
    { label: 'REGISTRATIONS APPROVED', value: '3', subtext: 'REACH / TSCA / ROW', colorClass: 'val-green' },
    { label: 'DOSSIERS IN PREPARATION', value: '4', subtext: '', colorClass: 'val-default' },
    { label: 'AVG. HAZOP COMPLETION', value: '64%', subtext: '', colorClass: 'val-teal' },
    { label: 'FAILED MANDATORY CRITERIA', value: '1', subtext: 'blocks next gate', colorClass: 'val-red' }
  ];

  regulatoryItems: RegulatoryReadinessItem[] = [
    { project: 'PUD Dispersion', pathway: 'EU REACH', status: 'Not started', hazopPct: 10, psmPct: 10 },
    { project: 'Pd/C Catalyst', pathway: 'TSCA', status: 'Not started', hazopPct: 15, psmPct: 25 },
    { project: 'Agro AI Synthesis', pathway: 'CIB&RC / EPA', status: 'In prep', hazopPct: 30, psmPct: 35 },
    { project: 'Solvent Recovery', pathway: 'CPCB', status: 'In prep', hazopPct: 45, psmPct: 45 },
    { project: 'WDG Formulation', pathway: 'CIB&RC', status: 'In prep', hazopPct: 50, psmPct: 55 },
    { project: 'Acrylic Binder', pathway: 'REACH India', status: 'In prep', hazopPct: 55, psmPct: 60 },
    { project: 'Liquid Epoxy Resin', pathway: 'EU REACH', status: 'Filed', hazopPct: 80, psmPct: 75 },
    { project: 'SLES 70% Paste', pathway: 'ROW Registration', status: 'Approved', hazopPct: 100, psmPct: 100 },
    { project: 'Fumed Silica', pathway: 'EU REACH', status: 'Approved', hazopPct: 100, psmPct: 100 },
    { project: 'H₂O₂ 50%', pathway: 'ASEAN Registration', status: 'Approved', hazopPct: 100, psmPct: 100 }
  ];

  criteriaItems: GateCriteriaChecklistItem[] = [
    { code: 'Gate 1.1', name: 'Market Demand & Competitive Benchmark Assessment', status: 'passed', isMandatory: true },
    { code: 'Gate 1.2', name: 'Chemistry & Process Feasibility Assessment', status: 'passed', isMandatory: true },
    { code: 'Gate 1.3', name: 'Preliminary Business Case & Cost of Manufacturing Model', status: 'passed', isMandatory: true },
    { code: 'Gate 1.4', name: 'Patents & Freedom-to-Operate (FTO) Clearance', status: 'pending', isMandatory: true },
    { code: 'Gate 2.1', name: 'Selected Route Yield, Purity & Impurity Profile', status: 'passed', isMandatory: true },
    { code: 'Gate 2.2', name: 'Basis of Design & Preliminary PFD Approved', status: 'pending', isMandatory: true },
    { code: 'Gate 2.3', name: 'Raw Material Dual-Sourcing Confirmed', status: 'pending', isMandatory: true },
    { code: 'Gate 3.1', name: 'HAZOP & Reaction Calorimetry Completed', status: 'failed', isMandatory: true },
    { code: 'Gate 3.2', name: 'SDS & GHS / CLP Classification Issued', status: 'pending', isMandatory: true },
    { code: 'Gate 3.3', name: 'REACH / TSCA Registration Dossier Ready', status: 'pending', isMandatory: true },
    { code: 'Gate 4.1', name: 'Demo Campaign Meets Spec in 3 Consecutive Batches', status: 'pending', isMandatory: true },
    { code: 'Gate 5.1', name: 'Pre-Startup Safety Review (PSSR) Signed Off', status: 'pending', isMandatory: true }
  ];

  ngOnInit(): void {}
}
