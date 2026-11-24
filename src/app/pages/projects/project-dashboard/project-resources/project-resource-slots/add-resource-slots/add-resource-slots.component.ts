import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-resource-slots',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-resource-slots.component.html',
  styleUrl: './add-resource-slots.component.scss',
})
export class AddResourceSlotsComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  stageOptions: string[] = [
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
    'Commercial Launch & Ramp-Up'
  ];

  deliverableOptions: string[] = [
    'Opportunity Assessment & Scope',
    'Market Sizing & Commercial Potential',
    'Preliminary Regulatory & IP Evaluation',
    'Chemistry & Synthetic Route Evaluation',
    'Process Safety & Environmental Screening',
    'Preliminary Techno-Economic Assessment',
    'Raw Material Sourcing & Catalytic Route Screening',
    'Reaction Scouting & Synthetic Pathway Proof',
    'Analytical Method Feasibility & Proof of Structure',
    'Reaction Condition & Parameter Optimization',
    'Impurity Profiling & Catalytic Efficiency Tuning',
    'Process Route Finalization & Basis of Design',
    'Scale-Up Hazard Evaluation & Process Safety Testing',
    'Pilot Plant Campaign Preparation & Batch Protocol',
    'Commercial Plant Design & Commissioning Support'
  ];

  activityOptions: string[] = [
    'Review industrial customer specifications, grade requirements and end-use application criteria',
    'Screen global supply-chain gaps and identify target domestic and export market volumes',
    'Analyze target product physicochemical specifications (purity, solids content, assay, moisture)',
    'Assess raw material availability, key chemical building blocks and supplier sourcing channels',
    'Define Target Product Profile (TPP) and customer technical acceptance benchmarks',
    'Source benchmark competitor chemical samples and commercial lot references',
    'Perform comparative analytical characterization of benchmark commercial grades',
    'Survey open literature and patents for synthetic pathways, catalytic systems and precursors',
    'Screen candidate reagents and reaction chemistries for runaway thermal hazard potential',
    'Conduct reaction calorimetry (RC1) and differential scanning calorimetry (DSC)',
    'Develop pilot batch manufacturing records (BMR) and standard operating procedures (SOP)',
    'Pilot Plant Campaign trial execution and intermediate sampling'
  ];

  taskOptions: string[] = [
    'Target product physicochemical specifications analysis',
    'Raw material availability and vendor qualification analysis',
    'Target Product Profile (TPP) benchmark compilation',
    'Competitor grade sourcing and characterization',
    'Reaction pathway stoichiometry and atom economy evaluation',
    'Reagent thermal stability and runaway screening (DSC / TGA)',
    'Reaction calorimetry run and exotherm heat profile profiling',
    'Pilot reactor setup, clean-in-place (CIP) and pressure check',
    'In-process reaction monitoring by HPLC / GC and TLC',
    'Product isolation, filtration, cake washing and vacuum drying',
    'Final product assay, purity, moisture and impurity clearance testing'
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddResourceSlotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      stage: ['', [Validators.required]],
      deliverable: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      task: ['', [Validators.required]],
      fromTime: ['', [Validators.required]],
      toTime: ['', [Validators.required]],
      approved: [false],
      declined: [false],
      pending: [true],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit' || !!this.data?.id;
    if (this.data && this.data.stage) {
      this.data.stage = this.normalizeStage(this.data.stage);
    }

    if (this.data) {
      if (this.data.stage && !this.stageOptions.includes(this.data.stage)) {
        this.stageOptions.push(this.data.stage);
      }
      if (this.data.deliverable && !this.deliverableOptions.includes(this.data.deliverable)) {
        this.deliverableOptions.push(this.data.deliverable);
      }
      if (this.data.activity && !this.activityOptions.includes(this.data.activity)) {
        this.activityOptions.push(this.data.activity);
      }
      if (this.data.task && !this.taskOptions.includes(this.data.task)) {
        this.taskOptions.push(this.data.task);
      }

      this.myGroup.patchValue({
        stage: this.data.stage ?? '',
        deliverable: this.data.deliverable ?? '',
        activity: this.data.activity ?? '',
        task: this.data.task ?? '',
        fromTime: this.data.fromTime ?? '',
        toTime: this.data.toTime ?? '',
        approved: !!this.data.approved,
        declined: !!this.data.declined,
        pending:
          this.data.pending !== undefined
            ? !!this.data.pending
            : !this.data.approved && !this.data.declined,
      });
    }
  }

    private normalizeStage(stage?: string): string {
    if (!stage) return 'Opportunity Identification';
    const s = stage.trim();
    if (s.includes('Business Case')) return 'Opportunity Identification';
    if (s.includes('Project Initiation')) return 'Concept Screening & Feasibility';
    if (s.includes('Development Procurement')) return 'Route Scouting & Lab Synthesis';
    if (s.includes('POC Formulation')) return 'Process Optimization (Lab Scale)';
    if (s.includes('Scale-Up')) return 'Process Route Selection & Basis of Design';
    if (s.includes('Exhibit Batches')) return 'Bench-to-Pilot Process Development';
    if (s.startsWith('Stage 1:') || s.startsWith('S1:')) return 'Opportunity Identification';
    if (s.startsWith('Stage 2:') || s.startsWith('S2:')) return 'Concept Screening & Feasibility';
    if (s.startsWith('Stage 3:') || s.startsWith('S3:')) return 'Route Scouting & Lab Synthesis';
    if (s.startsWith('Stage 4:') || s.startsWith('S4:')) return 'Process Optimization (Lab Scale)';
    if (s.startsWith('Stage 5:') || s.startsWith('S5:')) return 'Process Route Selection & Basis of Design';
    if (s.startsWith('Stage 6:') || s.startsWith('S6:')) return 'Bench-to-Pilot Process Development';
    if (s.startsWith('Stage 7:') || s.startsWith('S7:')) return 'Process Safety & Regulatory Studies';
    if (s.startsWith('Stage 8:') || s.startsWith('S8:')) return 'Regulatory Registration Filing (REACH / TSCA)';
    if (s.startsWith('Stage 9:') || s.startsWith('S9:')) return 'Pilot Plant Campaign';
    if (s.startsWith('Stage 10:') || s.startsWith('S10:')) return 'Demonstration-Scale Campaign';
    if (s.startsWith('Stage 11:') || s.startsWith('S11:')) return 'Commercial Plant Build & Commissioning';
    if (s.startsWith('Stage 12:') || s.startsWith('S12:')) return 'Commercial Launch & Ramp-Up';
    return s;
  }

  get f() {
    return this.myGroup.controls;
  }

  onStatusChange(type: 'approved' | 'declined' | 'pending'): void {
    const isChecked = this.myGroup.get(type)?.value;
    if (isChecked) {
      if (type === 'approved') {
        this.myGroup.patchValue({ declined: false, pending: false });
      } else if (type === 'declined') {
        this.myGroup.patchValue({ approved: false, pending: false });
      } else if (type === 'pending') {
        this.myGroup.patchValue({ approved: false, declined: false });
      }
    } else {
      const app = this.myGroup.get('approved')?.value;
      const dec = this.myGroup.get('declined')?.value;
      const pen = this.myGroup.get('pending')?.value;
      if (!app && !dec && !pen) {
        this.myGroup.patchValue({ pending: true });
      }
    }
  }

  upsertSlot(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    const result = {
      ...this.data,
      ...this.myGroup.value,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
