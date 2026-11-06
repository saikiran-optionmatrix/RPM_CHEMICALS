import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AddDeliverableComponent } from '../../../stages/stages-wbs/add-deliverable/add-deliverable.component';
import { AddActivityComponent } from '../../../stages/stages-wbs/add-activity/add-activity.component';
import { AddCriteriaComponent } from '../../../gates/gate-criteria/add-criteria/add-criteria.component';

// Interfaces to define our hierarchical data structure
export interface TaskItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export interface ModuleItem {
  id: number;
  name: string;
  description?: string;
  completed?: boolean;
  tasks: TaskItem[];
}

export interface StageItem {
  id: number;
  name: string;
  type: 'stage' | 'gate';
  completed?: boolean;
  modules: ModuleItem[];
  tasks?: TaskItem[];
}

@Component({
  selector: 'app-project-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './project-setup.component.html',
  styleUrl: './project-setup.component.scss',
})
export class ProjectSetupComponent implements OnInit {

  // Project Header Properties
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = [
  {
    "id": 1,
    "name": "S1 - Opportunity Identification",
    "type": "stage",
    "completed": true,
    "modules": [
      {
        "id": 101,
        "name": "Market and competitor grade analysis",
        "description": "Produce and obtain acceptance of the market and competitor grade analysis deliverable.",
        "completed": true,
        "tasks": [
          {
            "id": 1011,
            "name": "Competitor grade and price benchmarking",
            "description": "Compare competing grades against key performance attributes, price points and supply reliability; document gaps and opportunities.",
            "completed": true
          },
          {
            "id": 1012,
            "name": "Customer application and specification research",
            "description": "Gather evidence from formulators, converters and distributors, identify unmet needs and switching drivers, and translate findings into documented requirements.",
            "completed": true
          },
          {
            "id": 1013,
            "name": "Target market and regulatory-region shortlist",
            "description": "Define selection criteria, assess regulatory regimes (REACH, TSCA, K-REACH, India chemical rules) and their constraints, and document the recommended shortlist.",
            "completed": true
          }
        ]
      },
      {
        "id": 102,
        "name": "Project economics and risk screening",
        "description": "Produce and obtain acceptance of the project economics and risk screening deliverable.",
        "completed": true,
        "tasks": [
          {
            "id": 1021,
            "name": "Cost of manufacturing model and initial NPV",
            "description": "Estimate raw material costs, batch cycle time, utility usage and project discounted cash flows.",
            "completed": true
          },
          {
            "id": 1022,
            "name": "Technology and supply chain risk screening",
            "description": "Screen monomer availability, transport hazards, shelf life constraints and alternative catalyst routes.",
            "completed": true
          }
        ]
      },
      {
        "id": 103,
        "name": "Business case approval",
        "description": "Produce and obtain acceptance of the business case approval deliverable.",
        "completed": true,
        "tasks": [
          {
            "id": 1031,
            "name": "Business case consolidation and review",
            "description": "Consolidate market, technical and financial assessments into the formal business case document.",
            "completed": true
          },
          {
            "id": 1032,
            "name": "Project charter sign-off",
            "description": "Obtain steering committee sign-off and charter approval to initiate feasibility work.",
            "completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "S2 - Concept Screening & Feasibility",
    "type": "stage",
    "completed": true,
    "modules": [
      {
        "id": 201,
        "name": "Target Product Profile & Specification Definition",
        "description": "Define emulsion polymer solids, viscosity, MFFT, Tg, and mechanical properties.",
        "completed": true,
        "tasks": [
          {
            "id": 2011,
            "name": "Specification & benchmark equivalence criteria",
            "description": "Establish critical quality attributes against market leading benchmark grade.",
            "completed": true
          },
          {
            "id": 2012,
            "name": "Application performance criteria",
            "description": "Define film clarity, water resistance, scrub resistance, and substrate adhesion criteria.",
            "completed": true
          }
        ]
      },
      {
        "id": 202,
        "name": "Project Costing Sheet & Toll Manufacturer Selection",
        "description": "Prepare detailed costing breakdown and assess internal assets vs toll manufacturing.",
        "completed": true,
        "tasks": [
          {
            "id": 2021,
            "name": "Raw material, packaging & benchmark grade costing breakdown",
            "description": "Benchmark grade sample receipt, hazmat transport & customs clearance documentation.",
            "completed": true
          },
          {
            "id": 2022,
            "name": "Analytical costing & contract lab costing",
            "description": "Evaluate analytical testing and contract lab proposal quotations.",
            "completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "name": "Gate 1: Concept Approval",
    "type": "gate",
    "completed": true,
    "modules": [],
    "tasks": [
      {
        "id": 301,
        "name": "Market Demand & Competitive Benchmark Assessment",
        "description": "Target applications, market size, competitor grades and customer needs documented and approved by commercial.",
        "completed": true
      },
      {
        "id": 302,
        "name": "Chemistry & Process Feasibility Assessment",
        "description": "Reaction pathway, raw material availability and technical feasibility confirmed by process chemistry.",
        "completed": true
      },
      {
        "id": 303,
        "name": "Preliminary Business Case & Cost of Manufacturing Model",
        "description": "Target product profile, projected cost of manufacturing, volume and NPV threshold validated by finance.",
        "completed": true
      },
      {
        "id": 304,
        "name": "Patents & Freedom-to-Operate (FTO) Clearance",
        "description": "Formal IP landscape search and freedom-to-operate opinion documented for the chemistry, process and application.",
        "completed": true
      },
      {
        "id": 305,
        "name": "Process Safety, Technology & Scale-Up Risk Assessment",
        "description": "Critical hazards (exotherm, toxic or flammable materials) and technology risks identified with mitigation plans.",
        "completed": true
      },
      {
        "id": 306,
        "name": "Regulatory Pathway & Registration Strategy Outline",
        "description": "Registration pathway (REACH, TSCA, India, ASEAN) and high-level data needs outlined.",
        "completed": true
      },
      {
        "id": 307,
        "name": "Executive Committee Concept Approval Release",
        "description": "Formal executive sign-off granting authority to fund route scouting and allocate team resources.",
        "completed": true
      }
    ]
  },
  {
    "id": 4,
    "name": "S3 - Route Scouting & Lab Synthesis",
    "type": "stage",
    "completed": true,
    "modules": [
      {
        "id": 401,
        "name": "Monomer & Surfactant Screening",
        "description": "Screen butyl acrylate, methyl methacrylate, methacrylic acid and surfactant packages.",
        "completed": true,
        "tasks": [
          {
            "id": 4011,
            "name": "Monomer purity & inhibitor removal trials",
            "description": "Assess monomer inhibitor levels and impact on polymerization induction time.",
            "completed": true
          },
          {
            "id": 4012,
            "name": "Surfactant & emulsifier package screening",
            "description": "Shortlist anionic/non-ionic surfactants for particle size and coagulum control.",
            "completed": true
          }
        ]
      },
      {
        "id": 402,
        "name": "Initiator & Catalyst System Qualification",
        "description": "Screen thermal persulfate vs redox initiator packages for low-temperature polymerization.",
        "completed": true,
        "tasks": [
          {
            "id": 4021,
            "name": "Initiator system compatibility & conversion study",
            "description": "Measure monomer conversion and free radical generation rates.",
            "completed": true
          },
          {
            "id": 4022,
            "name": "Chain-transfer agent optimization",
            "description": "Control molecular weight distribution and rheological characteristics.",
            "completed": true
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "name": "S4 - Process Optimization (Lab Scale)",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 501,
        "name": "Reaction Feed Profile & Temperature Optimization",
        "description": "Design semi-continuous monomer pre-emulsion feeding to control polymerization exotherm.",
        "completed": false,
        "tasks": [
          {
            "id": 5011,
            "name": "Monomer feed profile optimization",
            "description": "Optimize feed rate, jacket temperature and agitation to balance exotherm and rate.",
            "completed": false
          },
          {
            "id": 5012,
            "name": "Particle size distribution control study",
            "description": "Optimize seed monomer concentration and surfactant dosing profile.",
            "completed": false
          }
        ]
      },
      {
        "id": 502,
        "name": "Residual Monomer Reduction & Devolatilization",
        "description": "Develop post-polymerization redox chaser and vacuum stripping to lower VOC.",
        "completed": false,
        "tasks": [
          {
            "id": 5021,
            "name": "Redox chaser system screening",
            "description": "Reduce residual butyl acrylate and methyl methacrylate below 100 ppm.",
            "completed": false
          },
          {
            "id": 5022,
            "name": "Emulsion storage stability assessment",
            "description": "Evaluate coagulum, viscosity drift and freeze-thaw stability at 50°C.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "name": "S5 - Process Route Selection & Basis of Design",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 601,
        "name": "Basis of Design Package",
        "description": "Compile mass and energy balances, reactor sizing, and heating/cooling duty specifications.",
        "completed": false,
        "tasks": [
          {
            "id": 6011,
            "name": "Mass and energy balance generation",
            "description": "Model batch heat generation, jacket cooling capacity and condenser duties.",
            "completed": false
          },
          {
            "id": 6012,
            "name": "Cost of Manufacturing update",
            "description": "Update raw material usage, cycle time, utility cost and toll manufacturing fee model.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "name": "Gate 2: Process Route Selection",
    "type": "gate",
    "completed": false,
    "modules": [],
    "tasks": [
      {
        "id": 701,
        "name": "Yield & Selectivity Profile",
        "description": "Candidate route meets yield and selectivity targets at bench scale.",
        "completed": true
      },
      {
        "id": 702,
        "name": "Process Robustness Proof",
        "description": "Route performs consistently across repeated runs and parameter ranges.",
        "completed": true
      },
      {
        "id": 703,
        "name": "Impurity & Waste Assessment",
        "description": "Impurity profile, by-products and waste streams meet product and environmental criteria.",
        "completed": true
      },
      {
        "id": 704,
        "name": "Preliminary Safety Screening",
        "description": "Reaction calorimetry and thermal stability show an acceptable safety margin.",
        "completed": true
      },
      {
        "id": 705,
        "name": "Basis of Design & Cost of Manufacturing Estimate",
        "description": "Basis of Design and projected cost of manufacturing reviewed by process engineering.",
        "completed": false
      },
      {
        "id": 706,
        "name": "Route Selection Committee Release",
        "description": "Formal sign-off to select the route and start pilot development.",
        "completed": false
      }
    ]
  },
  {
    "id": 8,
    "name": "S6 - Bench-to-Pilot Process Development",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 801,
        "name": "Scale-Up Mixing & Heat Transfer Modeling",
        "description": "Scale geometric impeller ratios and jacket heat transfer coefficients for 100 L pilot reactor.",
        "completed": false,
        "tasks": [
          {
            "id": 8011,
            "name": "Agitator power number and tip speed calculation",
            "description": "Prevent shear coagulation while maintaining uniform dispersion.",
            "completed": false
          },
          {
            "id": 8012,
            "name": "Dosing pump calibration and feeding accuracy",
            "description": "Verify monomer and initiator feed metering reliability.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "name": "S7 - Process Safety & Regulatory Studies",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 901,
        "name": "Process Hazard Analysis (HAZOP / LOPA)",
        "description": "Conduct formal hazard and operability study for runaway polymerization scenarios.",
        "completed": false,
        "tasks": [
          {
            "id": 9011,
            "name": "Reaction calorimetry (RC1 / DSC) testing",
            "description": "Determine adiabatic temperature rise and time-to-maximum rate.",
            "completed": false
          },
          {
            "id": 9012,
            "name": "Emergency relief sizing (DIERS methodology)",
            "description": "Size rupture disk and relief vent capacity for runaway cooling failure.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "name": "Gate 3: Registration & Pilot Readiness",
    "type": "gate",
    "completed": false,
    "modules": [],
    "tasks": [
      {
        "id": 1001,
        "name": "Process Hazard Analysis Package",
        "description": "HAZOP and LOPA complete with all high-risk actions closed.",
        "completed": false
      },
      {
        "id": 1002,
        "name": "Pilot Plant Readiness",
        "description": "Equipment, utilities and operating procedures ready for the pilot campaign.",
        "completed": false
      },
      {
        "id": 1003,
        "name": "Product Specification & Method Validation",
        "description": "Product specification and analytical methods validated.",
        "completed": false
      },
      {
        "id": 1004,
        "name": "Environmental & Toxicology Data Package",
        "description": "Ecotoxicology, toxicology and fate data complete for registration.",
        "completed": false
      },
      {
        "id": 1005,
        "name": "REACH / TSCA Dossier & Regulator Advice",
        "description": "Registration dossier compiled and regulator or consultant advice incorporated.",
        "completed": false
      },
      {
        "id": 1006,
        "name": "Executive Committee Registration & Pilot Release",
        "description": "Formal sign-off to file registration and start the pilot campaign.",
        "completed": false
      }
    ]
  },
  {
    "id": 11,
    "name": "S8 - Regulatory Registration Filing (REACH / TSCA)",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 1101,
        "name": "Chemical Registration Dossier Compilation",
        "description": "Compile IUCLID dataset, chemical safety report (CSR) and GHS SDS authoring.",
        "completed": false,
        "tasks": [
          {
            "id": 11011,
            "name": "REACH / TSCA dossier submission",
            "description": "Submit regulatory filing and monitor authority technical completeness check.",
            "completed": false
          },
          {
            "id": 11012,
            "name": "Safety Data Sheet (SDS) authoring",
            "description": "Generate 16-section multilingual GHS compliant Safety Data Sheets.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "name": "S9 - Pilot Plant Campaign",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 1201,
        "name": "Pilot Batch Execution (500 L - 1000 L)",
        "description": "Demonstrate reproducibility across consecutive pilot polymerization batches.",
        "completed": false,
        "tasks": [
          {
            "id": 12011,
            "name": "Pilot batch production and sampling",
            "description": "Produce qualification batches and collect in-process kinetics data.",
            "completed": false
          },
          {
            "id": 12012,
            "name": "Customer sample lot dispatch and testing",
            "description": "Supply 200 kg sample drums to key industrial paint formulators.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 13,
    "name": "S10 - Demonstration-Scale Campaign",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 1301,
        "name": "Demonstration-Scale Batches (5 m³)",
        "description": "Confirm scale-up factors, automated recipe control, filtration and bulk drum packing.",
        "completed": false,
        "tasks": [
          {
            "id": 13011,
            "name": "Demo-scale campaign batch manufacturing",
            "description": "Execute three consecutive conformance batches at target cycle time.",
            "completed": false
          },
          {
            "id": 13012,
            "name": "Customer application qualification report",
            "description": "Obtain written approval and qualification certificate from tier-1 formulators.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 14,
    "name": "Gate 4: Demo-Scale Proof",
    "type": "gate",
    "completed": false,
    "modules": [],
    "tasks": [
      {
        "id": 1401,
        "name": "Pilot Plant Performance Review",
        "description": "Pilot data show target yield, quality and acceptable safety performance.",
        "completed": false
      },
      {
        "id": 1402,
        "name": "Demo-Scale Campaign Results",
        "description": "Demo-scale batches meet specification with a validated, repeatable process.",
        "completed": false
      },
      {
        "id": 1403,
        "name": "Customer Qualification Evidence",
        "description": "Key customers confirm performance in their applications.",
        "completed": false
      },
      {
        "id": 1404,
        "name": "Process Safety Review Outcome",
        "description": "Safety review recommends continuation with no open critical findings.",
        "completed": false
      },
      {
        "id": 1405,
        "name": "Regulatory Registration Status",
        "description": "Registration progress and authority feedback documented.",
        "completed": false
      },
      {
        "id": 1406,
        "name": "Commercial Plant Design & Capex Approval",
        "description": "Plant design package and capital budget approved.",
        "completed": false
      }
    ]
  },
  {
    "id": 15,
    "name": "S11 - Commercial Plant Build & Commissioning",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 1501,
        "name": "Plant Engineering, Procurement & Construction",
        "description": "Procure glass-lined reactors, condensers, feed vessels, and DCS automation system.",
        "completed": false,
        "tasks": [
          {
            "id": 15011,
            "name": "Installation & Operation Qualification (IQ/OQ)",
            "description": "Perform mechanical completion, pressure testing, and loop checks.",
            "completed": false
          },
          {
            "id": 15012,
            "name": "Pre-Startup Safety Review (PSSR)",
            "description": "Complete multidisciplinary safety audit prior to monomer introduction.",
            "completed": false
          }
        ]
      }
    ]
  },
  {
    "id": 16,
    "name": "Gate 5: Commercial Production Readiness",
    "type": "gate",
    "completed": false,
    "modules": [],
    "tasks": [
      {
        "id": 1601,
        "name": "Commissioning & Performance Test Results",
        "description": "Plant meets guaranteed capacity, yield and quality in performance tests.",
        "completed": false
      },
      {
        "id": 1602,
        "name": "Operating Procedures & Training",
        "description": "Operating procedures complete and operators trained and certified.",
        "completed": false
      },
      {
        "id": 1603,
        "name": "Safety, Environmental & Permit Compliance",
        "description": "Pre-startup safety review complete and operating consents in force.",
        "completed": false
      },
      {
        "id": 1604,
        "name": "Labeling (GHS / CLP), SDS & Emergency Response Plan",
        "description": "Labels, SDS and emergency response plan approved.",
        "completed": false
      },
      {
        "id": 1605,
        "name": "Executive Committee Production Start Release",
        "description": "Formal sign-off to start commercial production.",
        "completed": false
      }
    ]
  },
  {
    "id": 17,
    "name": "S12 - Commercial Launch & Ramp-Up",
    "type": "stage",
    "completed": false,
    "modules": [
      {
        "id": 1701,
        "name": "Commercial Production & Market Supply",
        "description": "Begin routine multi-lot manufacturing, bulk delivery and ongoing process control.",
        "completed": false,
        "tasks": [
          {
            "id": 17011,
            "name": "Commercial manufacturing ramp-up",
            "description": "Achieve rated monthly tonnage and OEE targets in first operating quarter.",
            "completed": false
          },
          {
            "id": 17012,
            "name": "Customer technical support and supply handover",
            "description": "Hand over formulation technical service and customer logistics to operations.",
            "completed": false
          }
        ]
      }
    ]
  }
];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    // Default to the first stage (Feasibility, id: 1)
    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  // --- Migrated Methods ---

  selectStage(stage: StageItem) {
    this.selectedStage = stage;
    if (stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem) {
    this.selectedModule = moduleItem;
  }

  openAddDeliverableDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.deliverableName || result.name)) {
        const newModule: ModuleItem = {
          id: Date.now(),
          name: result.deliverableName || result.name,
          description: result.description || '',
          completed: false,
          tasks: []
        };
        if (!this.selectedStage!.modules) {
          this.selectedStage!.modules = [];
        }
        this.selectedStage!.modules.push(newModule);
        this.selectedModule = newModule;
      }
    });
  }

  openAddActivityDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const deliverables = this.selectedStage.modules?.map(m => m.name) || [];
    const currentDeliverable = this.selectedModule?.name || (deliverables.length > 0 ? deliverables[0] : '');

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        deliverable: currentDeliverable,
        deliverables: deliverables.length > 0 ? deliverables : [currentDeliverable || 'Deliverable'],
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.activityName || result.task)) {
        const newActivity: TaskItem = {
          id: Date.now(),
          name: result.activityName || result.task,
          description: result.description || '',
          completed: false
        };

        let targetModule = this.selectedModule;
        if (result.deliverable && this.selectedStage?.modules) {
          const found = this.selectedStage.modules.find(m => m.name === result.deliverable);
          if (found) targetModule = found;
        }

        if (targetModule) {
          if (!targetModule.tasks) {
            targetModule.tasks = [];
          }
          targetModule.tasks.push(newActivity);
        }
      }
    });
  }

  openAddCriteriaDialog(): void {
    if (!this.selectedStage || this.selectedStage.type !== 'gate') return;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.subject || result.question || result.name)) {
        const newCriterion: TaskItem = {
          id: Date.now(),
          name: result.subject || result.question || result.name || '',
          description: result.description || '',
          completed: false
        };

        if (this.selectedStage) {
          if (!this.selectedStage.tasks) {
            this.selectedStage.tasks = [];
          }
          this.selectedStage.tasks.push(newCriterion);
        }
      }
    });
  }

  editItem(item: any, type: string) {
    if (type === 'Criterion') {
      const dialogRef = this.dialog.open(AddCriteriaComponent, {
        width: '900px',
        maxWidth: '95vw',
        height: 'auto',
        data: {
          mode: 'edit',
          id: item.id,
          subject: item.name,
          question: item.name,
          description: item.description,
          priority: item.priority || 'High',
          mandatory: item.mandatory || false
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.subject || result.question || result.name || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Module' || type === 'Deliverable') {
      const dialogRef = this.dialog.open(AddDeliverableComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverableName: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && (result.deliverableName || result.name)) {
          item.name = result.deliverableName || result.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Task' || type === 'Activity') {
      const deliverables = this.selectedStage?.modules?.map(m => m.name) || [];
      const dialogRef = this.dialog.open(AddActivityComponent, {
        width: '1000px',
        maxWidth: '95vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverable: this.selectedModule?.name || '',
          deliverables: deliverables.length > 0 ? deliverables : [this.selectedModule?.name || 'Deliverable'],
          activityName: item.name,
          task: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.activityName || result.task || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    }
  }

  deleteItem(item: any, type: string) {
    if (type === 'Task' || type === 'Criterion' || type === 'Activity') {
      if (this.selectedStage?.type === 'gate' && this.selectedStage.tasks) {
        const idx = this.selectedStage.tasks.indexOf(item);
        if (idx > -1) this.selectedStage.tasks.splice(idx, 1);
      } else if (this.selectedModule && this.selectedModule.tasks) {
        const idx = this.selectedModule.tasks.indexOf(item);
        if (idx > -1) this.selectedModule.tasks.splice(idx, 1);
      }
    } else if (type === 'Module' || type === 'Deliverable') {
      if (this.selectedStage && this.selectedStage.modules) {
        const idx = this.selectedStage.modules.indexOf(item);
        if (idx > -1) {
          this.selectedStage.modules.splice(idx, 1);
          if (this.selectedModule === item) {
            this.selectedModule = this.selectedStage.modules[0] || null;
          }
        }
      }
    }
  }

  toggleCompleted(event: Event, item: any) {
    event.stopPropagation();
    item.completed = !item.completed;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/GEN/001", name: this.projectName || "Generic Tablet Development" }
    });
  }

}