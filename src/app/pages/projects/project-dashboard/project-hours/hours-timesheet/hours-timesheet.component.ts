import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TimesheetRow {
  project?: string;
  module: string;
  task: string;
  hours: number;
  description: string;
  searchProjectText?: string;
  searchModuleText?: string;
  searchText?: string;
}

@Component({
  selector: 'app-hours-timesheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './hours-timesheet.component.html',
  styleUrl: './hours-timesheet.component.scss'
})
export class HoursTimesheetComponent implements OnInit {

  isEditMode = false;
  dateStr = '';
  name: string | null = null;

  employeeOptions: string[] = [
    'Ravi Sharma',
    'Priya Singh',
    'Amit Kumar',
    'Neha Sharma',
    'Vikram Joshi',
    'Rajesh Kumar',
    'Anita Desai',
    'Priya Reddy',
    'Amit Patel',
    'Suresh Naidu',
    'Arun Joseph',
    'Lakshmi Devi',
    'Deepa Nair'
  ];
  nameSearchTerm = '';

  get filteredEmployeeOptions(): string[] {
    if (!this.nameSearchTerm || !this.nameSearchTerm.trim()) {
      return this.employeeOptions;
    }
    const term = this.nameSearchTerm.toLowerCase().trim();
    return this.employeeOptions.filter(e => e.toLowerCase().includes(term));
  }

  rows: TimesheetRow[] = [];

    availableProjects: string[] = [
    '2026/CHM/001 - Waterborne Polyurethane Dispersion',
    '2026/CHM/002 - Bio-based Epoxy Crosslinker',
    '2026/CHM/003 - High Purity Electronic Grade IPA',
    '2026/CHM/005 - Polyamide 66 High-Tenacity Resin',
    '2026/CHM/006 - Acrylic Emulsion Binder 50% Solids',
    '2026/CHM/007 - Specialty Fluoropolymer Resin'
  ];

  availableModules: string[] = [
    'Opportunity Identification',
    'Concept Screening & Feasibility',
    'Route Scouting & Lab Synthesis',
    'Process Optimization (Lab Scale)',
    'Process Route Selection & Basis of Design',
    'Bench-to-Pilot Process Development',
    'Process Safety & Regulatory Studies',
    'Regulatory Registration Filing (REACH / TSCA)',
    'Pilot Plant Campaign',
    'Demonstration-Scale Campaign',
    'Commercial Plant Build & Commissioning',
    'Commercial Launch & Ramp-Up',
    'General Operations'
  ];

  availableTasks = [
    'Competitor Grade & Benchmark Characterization',
    'Monomer Feed Profile Optimization',
    'Reaction Calorimetry (RC1) Testing',
    'Surfactant & Initiator Compatibility',
    'Laboratory Emulsion Polymerization Scouting',
    'Factorial DoE on Agitation & Feed Rates',
    'Post-polymerization Steam Stripping & VOC Reduction',
    'Aspen Plus PFD Simulation & Mass/Energy Balance',
    'HAZOP & LOPA Safety Review',
    'Emergency Relief Vent & Rupture Disk Sizing',
    'Pilot 500L Jacketed Reactor Batch Run',
    'IUCLID REACH Registration Dossier Filing',
    'Pre-Startup Safety Review (PSSR) Walkthrough',
    'Commercial 50 MT/day Emulsion Production Run',
    'Define product & technical specifications',
    'Identify raw material & monomer requirements',
    'Estimate target commercial production volume',
    'Initial BOM & utility cost estimation'
  ];

  constructor(
    public dialogRef: MatDialogRef<HoursTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.name = this.data.name || null;
      if (this.data.dateObj) {
        const d = new Date(this.data.dateObj);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        this.dateStr = `${yyyy}-${mm}-${dd}`;
      }
      if (this.data.tasksList && this.data.tasksList.length > 0) {
        this.rows = this.data.tasksList.map((t: any) => {
          if (t.project && !this.availableProjects.includes(t.project)) {
            this.availableProjects.push(t.project);
          }
          if (t.module && !this.availableModules.includes(t.module)) {
            this.availableModules.push(t.module);
          }
          return {
            project: t.project || '2026/CHM/001 - Acrylic Emulsion Binder 50% Solids',
            module: t.module || 'General',
            task: t.task || '',
            hours: t.hours || 0,
            description: t.description || ''
          };
        });
      } else {
        if (this.data.project && !this.availableProjects.includes(this.data.project)) {
          this.availableProjects.push(this.data.project);
        }
        if (this.data.module && !this.availableModules.includes(this.data.module)) {
          this.availableModules.push(this.data.module);
        }
        this.rows = [
          {
            project: this.data.project || '2026/CHM/001 - Acrylic Emulsion Binder 50% Solids',
            module: this.data.module || 'General',
            task: this.data.task || '',
            hours: this.data.hours || 0,
            description: this.data.description || ''
          }
        ];
      }
    } else {
      this.isEditMode = false;
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.dateStr = `${today.getFullYear()}-${mm}-${dd}`;
      this.rows = [
        { project: '2026/CHM/001 - Acrylic Emulsion Binder 50% Solids', module: 'General', task: '', hours: 0, description: '' }
      ];
    }
  }

  addRow(): void {
    this.rows.push({ project: '2026/CHM/001 - Acrylic Emulsion Binder 50% Solids', module: 'General', task: '', hours: 0, description: '' });
  }

  deleteRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);
    } else {
      this.rows[0] = { project: '2026/CHM/001 - Acrylic Emulsion Binder 50% Solids', module: 'General', task: '', hours: 0, description: '' };
    }
  }

  getFilteredProjects(searchText?: string): string[] {
    if (!searchText) {
      return this.availableProjects;
    }
    const term = searchText.toLowerCase();
    return this.availableProjects.filter(p => p.toLowerCase().includes(term));
  }

  getFilteredModules(searchText?: string): string[] {
    if (!searchText) {
      return this.availableModules;
    }
    const term = searchText.toLowerCase();
    return this.availableModules.filter(m => m.toLowerCase().includes(term));
  }

  getFilteredTasks(searchText?: string): string[] {
    if (!searchText) {
      return this.availableTasks;
    }
    const term = searchText.toLowerCase();
    return this.availableTasks.filter(t => t.toLowerCase().includes(term));
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      dateObj: this.dateStr ? new Date(this.dateStr + 'T00:00:00') : new Date(),
      name: this.name,
      rows: this.rows
    });
  }
}
