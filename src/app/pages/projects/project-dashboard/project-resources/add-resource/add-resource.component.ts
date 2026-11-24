import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-resource',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-resource.component.html',
  styleUrl: './add-resource.component.scss'
})
export class AddResourceComponent implements OnInit {

  isEditMode: boolean = false;

  stage: string | null = null;
  deliverable: string | null = null;
  activity: string | null = null;
  task: string | null = null;
  resource: string | null = null;
  module: string | null = null;
  fromDate: string = '';
  toDate: string = '';
  fromTime: string = '';
  toTime: string = '';
  planDuration: string = '';
  actualDuration: string = '';
  status: string | null = null;

  stages: string[] = [
    'S1 - Opportunity Identification',
    'S2 - Concept Screening & Feasibility',
    'S3 - Route Scouting & Lab Synthesis',
    'S4 - Process Optimization (Lab Scale)',
    'S5 - Process Route Selection & Basis of Design',
    'S6 - Bench-to-Pilot Process Development',
    'S7 - Process Safety & Regulatory Studies',
    'S8 - Regulatory Registration Filing (REACH / TSCA)',
    'S9 - Pilot Plant Campaign',
    'S10 - Demonstration-Scale Campaign',
    'S11 - Commercial Plant Build & Commissioning',
    'S12 - Commercial Launch & Ramp-Up'
  ];

  deliverables: string[] = [
    'Customer Application & Target Specification Matrix',
    'Market Sizing & Competitor Grade Benchmarking',
    'Preliminary Business Case & Techno-Economic Screening',
    'Chemistry Feasibility & Theoretical Yield Assessment',
    'Synthetic Route Scouting & Catalyst Screening',
    'Raw Material Sourcing & Specification Alignment',
    'Reaction Parameter Optimization (Temp, Pressure, Feed)',
    'Process Flow Diagram (PFD) & Basis of Design (BOD)',
    'Reaction Calorimetry (RC1) & Heat Transfer Evaluation',
    'Process Hazard Analysis (HAZOP) & Safety Interlocks',
    'REACH / TSCA Technical Dossier Preparation & Filing',
    'Pilot Campaign Batch Execution & Yield Verification'
  ];

  activities: string[] = [
    'Review industrial customer specifications, grade requirements and end-use application criteria',
    'Screen heterogeneous and homogeneous catalyst candidates for selectivity',
    'Optimize semi-batch feed profile, temperature ramp and agitation speed',
    'Develop and validate GC/FID, HPLC and titration assay methods',
    'Measure isothermal heat flow and instantaneous heat generation rates in RC1',
    'Conduct multi-disciplinary HAZOP on reactor nodes, feed systems and vapor vents',
    'Assemble IUCLID chemical registration dossier and physicochemical data package',
    'Execute pilot batch campaigns in 100 L and 500 L glass-lined reactors',
    'Perform solvent distillation and recovery efficiency studies',
    'Verify product quality conformance against customer specification targets'
  ];

  tasks: string[] = [
    'Confirm technical scope and operating window',
    'Prepare chemical reagents, raw materials and analytical instruments',
    'Execute chemical process run per standard operating procedure',
    'Collect in-process and final chemical product samples for analytical testing',
    'Screen catalyst loading ratios and recycling stability',
    'Calibrate dosing pump feed rates and jacket temperature profile',
    'Validate precision, accuracy, linearity and range of GC method',
    'Calibrate RC1 reaction calorimeter heat flow baseline',
    'Assign safeguard interlocks and verify emergency pressure relief capacity',
    'Compile physical-chemical endpoint studies and SDS documentation'
  ];

  statuses: string[] = ['Active', 'Completed', 'Pending'];

  resourceOptions: string[] = [
    'Jacketed Reactor 2L (Chem-01)',
    'Gas Chromatograph GC-FID 02',
    'RC1 Reaction Calorimeter',
    'Pilot Glass-Lined Reactor 100L',
    'Rotary Evaporator Skid',
    'Differential Scanning Calorimeter (DSC-01)',
    'Centrifugal Filtration Unit',
    'Thin Film Evaporator Skid',
    'Dr. Sarah Jenkins (Process Chemist)',
    'Ravi Shah (Process Safety Engineer)',
    'Mia Chen (Analytical Chemist)',
    'Robert Chen (Chemical Engineer)',
    'Emily Watson (Process Safety Lead)',
    'Jessica Alba (Regulatory Specialist)',
    'Diego Ruiz (Process Chemist)'
  ];

  resourceSearchTerm: string = '';

  get filteredResourceOptions(): string[] {
    if (!this.resourceSearchTerm || !this.resourceSearchTerm.trim()) {
      return this.resourceOptions;
    }
    const term = this.resourceSearchTerm.toLowerCase().trim();
    return this.resourceOptions.filter(r => r.toLowerCase().includes(term));
  }

  constructor(
    public dialogRef: MatDialogRef<AddResourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.stage = this.data.stage || null;
      this.deliverable = this.data.deliverable || this.data.module || null;
      this.module = this.deliverable;
      this.activity = this.data.activity || null;
      this.task = this.data.task || null;
      this.resource = this.data.resource || this.data.name || null;
      this.fromDate = this.data.fromDate || '';
      this.toDate = this.data.toDate || '';
      this.fromTime = this.data.fromTime || '';
      this.toTime = this.data.toTime || '';
      this.planDuration = this.data.planDuration || '';
      this.actualDuration = this.data.actualDuration || '';
      this.status = this.data.status || null;
    }
  }

  save(): void {
    if (!this.resource || !this.resource.trim()) {
      alert('Please select a Resource Name.');
      return;
    }
    const initials = this.resource.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'RS';
    this.dialogRef.close({
      code: this.data?.code || 'RES' + Math.floor(100 + Math.random() * 900),
      name: this.resource.trim(),
      resource: this.resource.trim(),
      initials: initials,
      stage: this.stage || 'General',
      deliverable: this.deliverable || this.module || 'General',
      module: this.deliverable || this.module || 'General',
      activity: this.activity || 'General',
      task: this.task || 'Task',
      fromDate: this.fromDate || new Date().toISOString().split('T')[0],
      toDate: this.toDate || new Date().toISOString().split('T')[0],
      fromTime: this.fromTime || '09:00 AM',
      toTime: this.toTime || '05:00 PM',
      planDuration: this.planDuration || '8 hours',
      actualDuration: this.actualDuration || 'N/A',
      status: this.status || 'Active',
      color: this.status === 'Completed' ? '#e0f2fe' : (this.status === 'Active' ? '#dcfce7' : '#f3e8ff'),
      dayPlacement: 'Monday'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
