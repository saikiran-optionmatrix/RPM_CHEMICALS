import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface RequirementItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  requirementName: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-assign-requirements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './assign-requirements.component.html',
  styleUrl: './assign-requirements.component.scss',
})
export class AssignRequirementsComponent implements OnInit {
  private readonly router = inject(Router);

  pageIndex = 0;
  pageSize = 5;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  requirementsList: RequirementItem[] = [
  {
    "active": true,
    "done": true,
    "requirementName": "Target Product Profile (TPP): intended application, grade, purity, concentration and performance criteria",
    "department": "Commercial / BD",
    "role": "Commercial Lead / BD Manager",
    "dueDate": "2026-03-01",
    "completedDate": "2026-03-01",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Market demand, customer segment and competitor grade assessment",
    "department": "R&D Chemistry",
    "role": "Lead Process Chemist",
    "dueDate": "2026-04-02",
    "completedDate": "2026-04-01",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Preliminary business case, project economics and cost-of-manufacturing estimate",
    "department": "Process Engineering",
    "role": "Senior Chemical Engineer",
    "dueDate": "2026-05-03",
    "completedDate": "2026-05-02",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Raw material, catalyst, solvent and critical supplier availability assessment",
    "department": "Process Safety & EHS",
    "role": "Process Safety Specialist",
    "dueDate": "2026-06-04",
    "completedDate": "2026-06-03",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Preliminary process chemistry feasibility and route selection rationale",
    "department": "Quality Assurance",
    "role": "QA Manager",
    "dueDate": "2026-07-05",
    "completedDate": "2026-07-04",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Initial process hazard identification and environmental screening",
    "department": "Analytical Chemistry",
    "role": "Senior Analytical Chemist",
    "dueDate": "2026-08-06",
    "completedDate": "2026-08-05",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Regulatory applicability matrix for REACH, TSCA, India and target export markets",
    "department": "Supply Chain & Sourcing",
    "role": "Raw Material Sourcing Manager",
    "dueDate": "2026-09-07",
    "completedDate": "2026-09-06",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Product specification and critical quality attribute (CQA) definition",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Executive",
    "dueDate": "2026-10-08",
    "completedDate": "2026-10-07",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Reaction pathway feasibility and laboratory synthesis success criteria",
    "department": "Operations & Production",
    "role": "Production Supervisor",
    "dueDate": "2026-03-09",
    "completedDate": "2026-03-08",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Raw material and reagent specifications with approved supplier qualification criteria",
    "department": "Environmental & Effluent",
    "role": "EHS & Effluent Engineer",
    "dueDate": "2026-04-10",
    "completedDate": "2026-04-09",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Laboratory reaction yield, selectivity and conversion acceptance criteria",
    "department": "Commercial / BD",
    "role": "Commercial Lead / BD Manager",
    "dueDate": "2026-05-11",
    "completedDate": "2026-05-10",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Intermediate identity, impurity profile and characterization requirements",
    "department": "R&D Chemistry",
    "role": "Lead Process Chemist",
    "dueDate": "2026-06-12",
    "completedDate": "2026-06-11",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Catalyst activity, loading, reuse and residual metal limits",
    "department": "Process Engineering",
    "role": "Senior Chemical Engineer",
    "dueDate": "2026-07-13",
    "completedDate": "2026-07-12",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Analytical method suitability, validation approach and reference standard requirements",
    "department": "Process Safety & EHS",
    "role": "Process Safety Specialist",
    "dueDate": "2026-08-14",
    "completedDate": "2026-08-13",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Solvent selection, recovery efficiency and residual solvent limits",
    "department": "Quality Assurance",
    "role": "QA Manager",
    "dueDate": "2026-09-15",
    "completedDate": "2026-09-14",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Process mass balance, energy balance and material consumption targets",
    "department": "Analytical Chemistry",
    "role": "Senior Analytical Chemist",
    "dueDate": "2026-10-16",
    "completedDate": "2026-10-15",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Critical process parameters (CPPs) and proven acceptable operating ranges",
    "department": "Supply Chain & Sourcing",
    "role": "Raw Material Sourcing Manager",
    "dueDate": "2026-03-17",
    "completedDate": "2026-03-16",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Reaction temperature, pressure, pH, residence time and agitation control limits",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Executive",
    "dueDate": "2026-04-18",
    "completedDate": "2026-04-17",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Product purity, assay, viscosity, particle size or other grade-specific release specifications",
    "department": "Operations & Production",
    "role": "Production Supervisor",
    "dueDate": "2026-05-19",
    "completedDate": "2026-05-18",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Batch-to-batch consistency and process reproducibility acceptance criteria",
    "department": "Environmental & Effluent",
    "role": "EHS & Effluent Engineer",
    "dueDate": "2026-06-20",
    "completedDate": "2026-06-19",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Process route comparison matrix covering yield, cost, safety and sustainability",
    "department": "Commercial / BD",
    "role": "Commercial Lead / BD Manager",
    "dueDate": "2026-07-21",
    "completedDate": "2026-07-20",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Process flow diagram (PFD), piping and instrumentation diagram (P&ID) and design basis approval",
    "department": "R&D Chemistry",
    "role": "Lead Process Chemist",
    "dueDate": "2026-08-22",
    "completedDate": "2026-08-21",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Equipment sizing, metallurgy, corrosion allowance and material compatibility requirements",
    "department": "Process Engineering",
    "role": "Senior Chemical Engineer",
    "dueDate": "2026-09-23",
    "completedDate": "2026-09-22",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Scale-up criteria and mixing, heat-transfer and mass-transfer performance targets",
    "department": "Process Safety & EHS",
    "role": "Process Safety Specialist",
    "dueDate": "2026-10-24",
    "completedDate": "2026-10-23",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "requirementName": "Bench and pilot batch manufacturing protocol and batch record requirements",
    "department": "Quality Assurance",
    "role": "QA Manager",
    "dueDate": "2026-03-25",
    "completedDate": "2026-03-24",
    "remarks": "Requirement criteria verified and compliant with chemical manufacturing standards",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Pilot-scale yield, throughput and product quality acceptance criteria",
    "department": "Analytical Chemistry",
    "role": "Senior Analytical Chemist",
    "dueDate": "2026-04-01",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Raw material, utility, equipment and instrument qualification requirements",
    "department": "Supply Chain & Sourcing",
    "role": "Raw Material Sourcing Manager",
    "dueDate": "2026-05-02",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Downstream separation, distillation, crystallization and filtration performance criteria",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Executive",
    "dueDate": "2026-06-03",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Process safety review (HAZID/HAZOP), risk ranking and action closure requirements",
    "department": "Operations & Production",
    "role": "Production Supervisor",
    "dueDate": "2026-07-04",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Fire, explosion, pressure relief, hazardous area classification and emergency response requirements",
    "department": "Environmental & Effluent",
    "role": "EHS & Effluent Engineer",
    "dueDate": "2026-08-05",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Occupational exposure limits, PPE and chemical handling requirements",
    "department": "Commercial / BD",
    "role": "Commercial Lead / BD Manager",
    "dueDate": "2026-09-06",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Effluent, stack emissions, waste classification and disposal compliance limits",
    "department": "R&D Chemistry",
    "role": "Lead Process Chemist",
    "dueDate": "2026-10-07",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Regulatory dossier content, substance identity and physicochemical data requirements",
    "department": "Process Engineering",
    "role": "Senior Chemical Engineer",
    "dueDate": "2026-03-08",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "REACH / TSCA / India chemical inventory registration submission requirements",
    "department": "Process Safety & EHS",
    "role": "Process Safety Specialist",
    "dueDate": "2026-04-09",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Safety Data Sheet (SDS), GHS classification, labelling and transport compliance",
    "department": "Quality Assurance",
    "role": "QA Manager",
    "dueDate": "2026-05-10",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Regulatory authority query response and commitment tracking requirements",
    "department": "Analytical Chemistry",
    "role": "Senior Analytical Chemist",
    "dueDate": "2026-06-11",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Pilot plant campaign readiness and approved operating procedure requirements",
    "department": "Supply Chain & Sourcing",
    "role": "Raw Material Sourcing Manager",
    "dueDate": "2026-07-12",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Commercial-scale process design basis and capacity / throughput requirements",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Executive",
    "dueDate": "2026-08-13",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Demonstration-scale batch yield, quality and process capability acceptance criteria",
    "department": "Operations & Production",
    "role": "Production Supervisor",
    "dueDate": "2026-09-14",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Solvent recovery, energy efficiency and waste minimization targets",
    "department": "Environmental & Effluent",
    "role": "EHS & Effluent Engineer",
    "dueDate": "2026-10-15",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Commercial plant construction, installation and commissioning acceptance criteria",
    "department": "Commercial / BD",
    "role": "Commercial Lead / BD Manager",
    "dueDate": "2026-03-16",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Equipment commissioning, calibration and qualification records",
    "department": "R&D Chemistry",
    "role": "Lead Process Chemist",
    "dueDate": "2026-04-17",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Process validation protocol, validation batches and continued process verification criteria",
    "department": "Process Engineering",
    "role": "Senior Chemical Engineer",
    "dueDate": "2026-05-18",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Control system, interlock, alarm and safety instrumented function testing requirements",
    "department": "Process Safety & EHS",
    "role": "Process Safety Specialist",
    "dueDate": "2026-06-19",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Commercial production readiness, EHS clearance and operating permit requirements",
    "department": "Quality Assurance",
    "role": "QA Manager",
    "dueDate": "2026-07-20",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Finished product release testing, certificate of analysis (CoA) and batch disposition criteria",
    "department": "Analytical Chemistry",
    "role": "Senior Analytical Chemist",
    "dueDate": "2026-08-21",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Packaging, storage, shelf-life and product stability requirements",
    "department": "Supply Chain & Sourcing",
    "role": "Raw Material Sourcing Manager",
    "dueDate": "2026-09-22",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Customer application trial, technical data sheet (TDS) and product qualification criteria",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Executive",
    "dueDate": "2026-10-23",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Product stewardship, SDS distribution, change notification and complaint handling requirements",
    "department": "Operations & Production",
    "role": "Production Supervisor",
    "dueDate": "2026-03-24",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "requirementName": "Post-launch process performance monitoring and continuous improvement criteria",
    "department": "Environmental & Effluent",
    "role": "EHS & Effluent Engineer",
    "dueDate": "2026-04-25",
    "completedDate": "",
    "remarks": "Technical evaluation and document collation in progress",
    "isEditing": false
  }
];

  get paginatedRequirements(): RequirementItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialogRef: MatDialogRef<AssignRequirementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any, idx: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(idx),
        isEditing: false
      }));
    } else if (this.data?.requirements && Array.isArray(this.data.requirements)) {
      this.requirementsList = this.data.requirements.map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            active: true,
            done: false,
            requirementName: item,
            department: '',
            role: '',
            dueDate: '',
            completedDate: '',
            remarks: '',
            historyCount: this.getHistoryCount(idx),
            isEditing: false
          };
        }
        return {
          ...item,
          historyCount: item.historyCount || this.getHistoryCount(idx),
          isEditing: false
        };
      });
    } else {
      this.requirementsList.forEach((req, idx) => {
        if (!req.historyCount) req.historyCount = this.getHistoryCount(idx);
      });
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addRequirement(): void {
    const newReq: RequirementItem = {
      active: true,
      done: false,
      requirementName: '',
      department: '',
      role: '',
      dueDate: '',
      completedDate: '',
      remarks: '',
      historyCount: 1,
      isEditing: true,
      isNew: true
    };
    this.pageIndex = 0;
    this.requirementsList.unshift(newReq);
  }

  startEdit(row: RequirementItem): void {
    row._backup = {
      active: row.active,
      done: row.done,
      requirementName: row.requirementName,
      department: row.department,
      role: row.role,
      dueDate: row.dueDate,
      completedDate: row.completedDate,
      remarks: row.remarks
    };
    row.isEditing = true;
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    delete row.isNew;
    delete row._backup;
  }

  cancelEdit(row: RequirementItem): void {
    if (row.isNew) {
      const index = this.requirementsList.indexOf(row);
      if (index > -1) {
        this.requirementsList.splice(index, 1);
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.requirementsList.length) {
          this.pageIndex = Math.max(0, this.pageIndex - 1);
        }
      }
    } else {
      if (row._backup) {
        Object.assign(row, row._backup);
        delete row._backup;
      }
      row.isEditing = false;
    }
  }

  deleteRequirement(row: RequirementItem): void {
    const index = this.requirementsList.indexOf(row);
    if (index > -1) {
      this.requirementsList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.requirementsList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    // Finalize any rows left in edit mode
    this.requirementsList.forEach(r => {
      r.isEditing = false;
      delete r.isNew;
      delete r._backup;
    });

    this.dialogRef.close({
      requirements: this.requirementsList,
      count: this.requirementsList.length
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openHistory(row: RequirementItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.dialogRef.close();
    this.router.navigate(['/stages/wbs/requirements/history'], {
      queryParams: {
        requirementName: row.requirementName,
        activityName: this.data?.row?.task || '',
        activityCode: this.data?.row?.activityCode || this.data?.row?.taskCode || '',
        stageCode: this.data?.row?.stageCode || '',
        stageName: this.data?.row?.stageName || '',
        gateCode: this.data?.row?.gateCode || '',
        historyCount: historyCount
      }
    });
  }
}
