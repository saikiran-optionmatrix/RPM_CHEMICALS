import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-issue.component.html',
  styleUrl: './add-issue.component.scss'
})
export class AddIssueComponent implements OnInit {
  form!: FormGroup;

  stageOptions: string[] = [
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

  allDeliverables: { [stage: string]: string[] } = {
    'S1 - Opportunity Identification': [
      'Customer Application & Target Specification Matrix',
      'Market Sizing & Competitor Grade Benchmarking',
      'Preliminary Business Case & Techno-Economic Screening'
    ],
    'S2 - Concept Screening & Feasibility': [
      'Chemistry Feasibility & Theoretical Yield Assessment',
      'Patent & Freedom-to-Operate (FTO) Screening',
      'Preliminary EHS Hazard & Toxicity Assessment'
    ],
    'S3 - Route Scouting & Lab Synthesis': [
      'Synthetic Route Scouting & Catalyst Screening',
      'Raw Material Sourcing & Specification Alignment',
      'Proof-of-Concept Lab Batch Synthesis'
    ],
    'S4 - Process Optimization (Lab Scale)': [
      'Reaction Parameter Optimization (Temp, Pressure, Feed)',
      'Product Purity & Impurity Profile Optimization',
      'Analytical Method Development & Validation'
    ],
    'S5 - Process Route Selection & Basis of Design': [
      'Final Chemical Route Selection & Mass/Energy Balances',
      'Process Flow Diagram (PFD) & Basis of Design (BOD)',
      'Gate 2 Synthesis Route Freeze Package'
    ],
    'S6 - Bench-to-Pilot Process Development': [
      'Reaction Calorimetry (RC1) & Heat Transfer Evaluation',
      'Scale-Down Pilot Model & Stirring/Mixing Hydrodynamics',
      'Waste Stream Characterization & Solvent Recovery Studies'
    ],
    'S7 - Process Safety & Regulatory Studies': [
      'Process Hazard Analysis (HAZOP) & Safety Interlocks',
      'Toxicological & Ecotoxicological Test Data Package',
      'GHS / CLP Classification & Safety Data Sheet (SDS) Finalization'
    ],
    'S8 - Regulatory Registration Filing (REACH / TSCA)': [
      'REACH / TSCA Technical Dossier Preparation & Filing',
      'Regulatory Authority Inquiries & Compliance Clearance',
      'Consortium Data Sharing & Letter of Access (LoA)'
    ],
    'S9 - Pilot Plant Campaign': [
      'Pilot Campaign Batch Execution & Yield Verification',
      'Pilot Scale Analytical Release Testing & Quality Sign-Off',
      'Pilot Campaign Tech Transfer Dossier'
    ],
    'S10 - Demonstration-Scale Campaign': [
      'Demo-Scale Production Run in Semi-Commercial Facility',
      'Customer Product Sampling & Tier-1 Qualification',
      'Process Robustness & Critical Quality Attributes Freeze'
    ],
    'S11 - Commercial Plant Build & Commissioning': [
      'Detailed Engineering Design & Equipment Procurement',
      'Pre-Startup Safety Review (PSSR) & Dry Commissioning',
      'Water Runs & Solvent Cold Commissioning'
    ],
    'S12 - Commercial Launch & Ramp-Up': [
      'First Commercial Production Campaign & Product Release',
      'Plant Ramp-Up & Full Capacity Performance Test',
      'Post-Launch Customer Technical Service Support'
    ]
  };

  allActivities: { [deliverable: string]: string[] } = {
    'Customer Application & Target Specification Matrix': [
      'Review industrial customer specifications, grade requirements and end-use application criteria',
      'Map physical, chemical, rheological and mechanical performance targets'
    ],
    'Market Sizing & Competitor Grade Benchmarking': [
      'Analyze competitor chemical grades, pricing and volume distribution',
      'Benchmark purity, volatile organic compound (VOC) limits and color standards'
    ],
    'Preliminary Business Case & Techno-Economic Screening': [
      'Develop preliminary manufacturing cost model (raw materials, energy, utilities)',
      'Model 10-year discounted cash flow, net present value (NPV) and payback period'
    ],
    'Chemistry Feasibility & Theoretical Yield Assessment': [
      'Evaluate stoichiometric reaction mechanisms and theoretical conversion yields',
      'Assess thermodynamic feasibility and potential hazardous side reactions'
    ],
    'Patent & Freedom-to-Operate (FTO) Screening': [
      'Perform patent landscape search across composition-of-matter and synthesis processes',
      'Draft preliminary freedom-to-operate (FTO) risk assessment'
    ],
    'Synthetic Route Scouting & Catalyst Screening': [
      'Screen heterogeneous and homogeneous catalyst candidates for selectivity',
      'Optimize reagent addition order, solvent medium and reaction temperature'
    ],
    'Raw Material Sourcing & Specification Alignment': [
      'Identify and qualify primary and alternate chemical raw material suppliers',
      'Establish technical grade specifications and maximum allowable impurity levels'
    ],
    'Reaction Parameter Optimization (Temp, Pressure, Feed)': [
      'Optimize semi-batch feed profile, temperature ramp and agitation speed',
      'Establish design-of-experiments (DoE) response surface for yield maximization'
    ],
    'Analytical Method Development & Validation': [
      'Develop and validate GC/FID, HPLC and titration assay methods',
      'Establish residual solvent and trace by-product detection limits'
    ],
    'Final Chemical Route Selection & Mass/Energy Balances': [
      'Select final synthetic route based on safety, raw material availability and margin',
      'Calculate complete stoichiometric mass and energy balance flowsheet'
    ],
    'Reaction Calorimetry (RC1) & Heat Transfer Evaluation': [
      'Measure isothermal heat flow and instantaneous heat generation rates in RC1',
      'Determine adiabatic temperature rise and runaway reaction criticality class'
    ],
    'Process Hazard Analysis (HAZOP) & Safety Interlocks': [
      'Conduct multi-disciplinary HAZOP on reactor nodes, feed systems and vapor vents',
      'Define safety instrumented systems (SIS) and relief rupture disc specifications'
    ],
    'REACH / TSCA Technical Dossier Preparation & Filing': [
      'Assemble IUCLID chemical registration dossier and physicochemical data package',
      'Submit formal registration to European Chemicals Agency (ECHA) and US EPA'
    ],
    'Pilot Campaign Batch Execution & Yield Verification': [
      'Execute pilot batch campaigns in 100 L and 500 L glass-lined reactors',
      'Verify reaction kinetics, heat transfer coefficients and product yield at pilot scale'
    ]
  };

  allTasks: { [activity: string]: string[] } = {
    'Review industrial customer specifications, grade requirements and end-use application criteria': [
      'Confirm technical scope and operating window',
      'Prepare chemical reagents, raw materials and analytical instruments',
      'Execute chemical process run per standard operating procedure',
      'Collect in-process and final chemical product samples for analytical testing'
    ],
    'Screen heterogeneous and homogeneous catalyst candidates for selectivity': [
      'Screen catalyst loading ratios and recycling stability',
      'Determine reaction conversion and selectivity via GC/FID analysis'
    ],
    'Optimize semi-batch feed profile, temperature ramp and agitation speed': [
      'Calibrate dosing pump feed rates and jacket temperature profile',
      'Sample intermediate conversion kinetics at defined time points'
    ],
    'Develop and validate GC/FID, HPLC and titration assay methods': [
      'Validate precision, accuracy, linearity and range of GC method',
      'Perform system suitability testing with reference standards'
    ],
    'Measure isothermal heat flow and instantaneous heat generation rates in RC1': [
      'Calibrate RC1 reaction calorimeter heat flow baseline',
      'Dose reagents under controlled conditions and calculate delta-H reaction'
    ],
    'Conduct multi-disciplinary HAZOP on reactor nodes, feed systems and vapor vents': [
      'Identify deviation guide words (More Flow, High Temp, Agitator Loss)',
      'Assign safeguard interlocks and verify emergency pressure relief capacity'
    ],
    'Assemble IUCLID chemical registration dossier and physicochemical data package': [
      'Compile physical-chemical endpoint studies (boiling point, vapor pressure, log Kow)',
      'Validate GHS / CLP classification and generate Safety Data Sheet (SDS)'
    ]
  };

  deliverableOptions: string[] = [
    'Customer Application & Target Specification Matrix',
    'Market Sizing & Competitor Grade Benchmarking',
    'Preliminary Business Case & Techno-Economic Screening',
    'Synthetic Route Scouting & Catalyst Screening',
    'Raw Material Sourcing & Specification Alignment',
    'Reaction Parameter Optimization (Temp, Pressure, Feed)',
    'Reaction Calorimetry (RC1) & Heat Transfer Evaluation',
    'Process Hazard Analysis (HAZOP) & Safety Interlocks',
    'REACH / TSCA Technical Dossier Preparation & Filing'
  ];

  activityOptions: string[] = [
    'Review industrial customer specifications, grade requirements and end-use application criteria',
    'Screen heterogeneous and homogeneous catalyst candidates for selectivity',
    'Optimize semi-batch feed profile, temperature ramp and agitation speed',
    'Develop and validate GC/FID, HPLC and titration assay methods',
    'Measure isothermal heat flow and instantaneous heat generation rates in RC1',
    'Conduct multi-disciplinary HAZOP on reactor nodes, feed systems and vapor vents',
    'Assemble IUCLID chemical registration dossier and physicochemical data package'
  ];

  taskOptions: string[] = [
    'Confirm technical scope and operating window',
    'Prepare chemical reagents, raw materials and analytical instruments',
    'Execute chemical process run per standard operating procedure',
    'Collect in-process and final chemical product samples for analytical testing',
    'Screen catalyst loading ratios and recycling stability',
    'Calibrate dosing pump feed rates and jacket temperature profile',
    'Validate precision, accuracy, linearity and range of GC method',
    'Calibrate RC1 reaction calorimeter heat flow baseline',
    'Assign safeguard interlocks and verify emergency pressure relief capacity'
  ];

  filteredDeliverables: string[] = [];
  filteredActivities: string[] = [];
  filteredTasks: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddIssueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const initialStage = this.data?.stage || this.stageOptions[0];

    this.form = this.fb.group({
      stage: [initialStage],
      deliverable: [this.data?.deliverable || ''],
      activity: [this.data?.activity || ''],
      task: [this.data?.task || this.data?.taskName || ''],
      subject: [this.data?.subject || '', Validators.required],
      issueDescription: [this.data?.issueDescription || ''],
      targetDate: [this.data?.targetDate || this.data?.dueDate || ''],
      dueDate: [this.data?.dueDate || this.data?.targetDate || ''],
      status: [this.data?.status || 'Pending', Validators.required],
      assignedTo: [this.data?.assignedTo || this.data?.responsibility || ''],
      remarks: [this.data?.remarks || ''],
      image: [this.data?.image || null],
      document: [this.data?.document || null]
    });

    this.syncDropdownOptions();

    if (!this.data) {
      if (this.filteredDeliverables.length > 0) {
        this.form.patchValue({ deliverable: this.filteredDeliverables[0] });
        this.updateActivityOptions();
      }
      if (this.filteredActivities.length > 0) {
        this.form.patchValue({ activity: this.filteredActivities[0] });
        this.updateTaskOptions();
      }
      if (this.filteredTasks.length > 0) {
        this.form.patchValue({ task: this.filteredTasks[0] });
      }
    }
  }

  syncDropdownOptions(): void {
    this.updateDeliverableOptions();
    this.updateActivityOptions();
    this.updateTaskOptions();
  }

  onStageChange(): void {
    this.updateDeliverableOptions();
    const curDel = this.filteredDeliverables.length > 0 ? this.filteredDeliverables[0] : '';
    this.form.patchValue({ deliverable: curDel });
    this.onDeliverableChange();
  }

  onDeliverableChange(): void {
    this.updateActivityOptions();
    const curAct = this.filteredActivities.length > 0 ? this.filteredActivities[0] : '';
    this.form.patchValue({ activity: curAct });
    this.onActivityChange();
  }

  onActivityChange(): void {
    this.updateTaskOptions();
    const curTask = this.filteredTasks.length > 0 ? this.filteredTasks[0] : '';
    this.form.patchValue({ task: curTask });
  }

  private updateDeliverableOptions(): void {
    const curStage = this.form?.get('stage')?.value || this.stageOptions[0];
    const list = this.allDeliverables[curStage];
    let items = (list && list.length > 0) ? [...list] : [...this.deliverableOptions];
    const curVal = this.form?.get('deliverable')?.value;
    if (curVal && !items.includes(curVal)) {
      items.unshift(curVal);
    }
    this.filteredDeliverables = items;
  }

  private updateActivityOptions(): void {
    const curDel = this.form?.get('deliverable')?.value;
    const list = this.allActivities[curDel || ''];
    let items = (list && list.length > 0) ? [...list] : [...this.activityOptions];
    const curVal = this.form?.get('activity')?.value;
    if (curVal && !items.includes(curVal)) {
      items.unshift(curVal);
    }
    this.filteredActivities = items;
  }

  private updateTaskOptions(): void {
    const curAct = this.form?.get('activity')?.value;
    const list = this.allTasks[curAct || ''];
    let items = (list && list.length > 0) ? [...list] : [...this.taskOptions];
    const curVal = this.form?.get('task')?.value;
    if (curVal && !items.includes(curVal)) {
      items.unshift(curVal);
    }
    this.filteredTasks = items;
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const val = this.form.value;
      if (!val.dueDate && val.targetDate) {
        val.dueDate = val.targetDate;
      }
      if (!val.targetDate && val.dueDate) {
        val.targetDate = val.dueDate;
      }
      if (val.assignedTo && !val.responsibility) {
        val.responsibility = val.assignedTo;
      }
      this.dialogRef.close(val);
    }
  }

  onFileSelected(event: any, type: 'image' | 'document'): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [type]: file.name });
    }
  }
}
