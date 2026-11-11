import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface TaskItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  taskName: string;
  taskCode?: string;
  jobCode?: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<TaskItem>;
}

@Component({
  selector: 'app-assign-tasks',
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
  templateUrl: './assign-tasks.component.html',
  styleUrl: './assign-tasks.component.scss',
})
export class AssignTasksComponent implements OnInit {
  private readonly router = inject(Router);

  pageIndex = 0;
  pageSize = 5;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  jobCodeOptions: string[] = [
    "BD01",
    "RND01",
    "PM01",
    "RM01",
    "PSE01",
    "QA03",
    "REAC01",
    "CHRO01",
    "QC02",
    "QC03",
    "DIST01",
    "ENG02",
    "ENG01",
    "INST01",
    "MFG03",
    "MFG04",
    "VAL01",
    "EM01",
    "REG01",
    "DOC01",
    "CQV01"
];

  tasksList: TaskItem[] = [
  {
    "active": true,
    "done": true,
    "taskName": "Review industrial application demand, customer specifications and market opportunities",
    "taskCode": "CHM-T001",
    "jobCode": "BD01",
    "department": "Commercial / Business Development",
    "role": "Business Development Executive",
    "dueDate": "2026-03-01",
    "completedDate": "2026-03-01",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Benchmark competing chemical grades, suppliers and production technologies",
    "taskCode": "CHM-T002",
    "jobCode": "BD01",
    "department": "Commercial / Business Development",
    "role": "Business Development Executive",
    "dueDate": "2026-04-02",
    "completedDate": "2026-04-01",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Define target product profile, purity, concentration and performance attributes",
    "taskCode": "CHM-T003",
    "jobCode": "RND01",
    "department": "R&D Chemistry",
    "role": "Research & Development Chemist",
    "dueDate": "2026-05-03",
    "completedDate": "2026-05-02",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Prepare preliminary business case, project economics and opportunity assessment",
    "taskCode": "CHM-T004",
    "jobCode": "PM01",
    "department": "Project Management",
    "role": "Chemical Program Manager",
    "dueDate": "2026-06-04",
    "completedDate": "2026-06-03",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Screen reaction chemistry, formulation options and product feasibility",
    "taskCode": "CHM-T005",
    "jobCode": "RND01",
    "department": "R&D Chemistry",
    "role": "Research & Development Chemist",
    "dueDate": "2026-07-05",
    "completedDate": "2026-07-04",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Assess raw material availability, critical reagent supply and vendor capability",
    "taskCode": "CHM-T006",
    "jobCode": "RM01",
    "department": "Supply Chain & Sourcing",
    "role": "Raw Material Storekeeper / Sourcing Specialist",
    "dueDate": "2026-08-06",
    "completedDate": "2026-08-05",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Conduct preliminary process hazard, environmental and regulatory screening",
    "taskCode": "CHM-T007",
    "jobCode": "PSE01",
    "department": "Process Safety & EHS",
    "role": "Process Safety Engineer",
    "dueDate": "2026-09-07",
    "completedDate": "2026-09-06",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Prepare feasibility report, target specifications and Gate 1 submission",
    "taskCode": "CHM-T008",
    "jobCode": "QA03",
    "department": "Quality Assurance",
    "role": "Quality Assurance Manager",
    "dueDate": "2026-10-08",
    "completedDate": "2026-10-07",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Develop candidate synthesis routes and reaction pathway hypotheses",
    "taskCode": "CHM-T009",
    "jobCode": "RND01",
    "department": "R&D Chemistry",
    "role": "Research & Development Chemist",
    "dueDate": "2026-03-09",
    "completedDate": "2026-03-08",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Conduct laboratory-scale reaction and catalyst screening experiments",
    "taskCode": "CHM-T010",
    "jobCode": "REAC01",
    "department": "Reaction Engineering",
    "role": "Reactor Operator / Chemical Engineer",
    "dueDate": "2026-04-10",
    "completedDate": "2026-04-09",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Characterize intermediates, impurities and product composition using GC/HPLC and spectroscopy",
    "taskCode": "CHM-T011",
    "jobCode": "CHRO01",
    "department": "Analytical Chemistry",
    "role": "Chromatography (GC/HPLC) Analyst",
    "dueDate": "2026-05-11",
    "completedDate": "2026-05-10",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Document route scouting results, material balance and preliminary yield assessment",
    "taskCode": "CHM-T012",
    "jobCode": "QC02",
    "department": "Quality Control",
    "role": "Quality Control Executive",
    "dueDate": "2026-06-12",
    "completedDate": "2026-06-11",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Optimize reaction parameters, catalyst loading, temperature, pressure and residence time",
    "taskCode": "CHM-T013",
    "jobCode": "REAC01",
    "department": "Reaction Engineering",
    "role": "Reactor Operator / Chemical Engineer",
    "dueDate": "2026-07-13",
    "completedDate": "2026-07-12",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Evaluate solvent systems, separation methods and purification sequence",
    "taskCode": "CHM-T014",
    "jobCode": "DIST01",
    "department": "Separation & Purification",
    "role": "Distillation & Separation Operator",
    "dueDate": "2026-08-14",
    "completedDate": "2026-08-13",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Assess process yield, selectivity, impurity profile and batch-to-batch reproducibility",
    "taskCode": "CHM-T015",
    "jobCode": "QC02",
    "department": "Quality Control",
    "role": "Quality Control Executive",
    "dueDate": "2026-09-15",
    "completedDate": "2026-09-14",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Develop analytical methods and establish in-process control limits",
    "taskCode": "CHM-T016",
    "jobCode": "CHRO01",
    "department": "Analytical Chemistry",
    "role": "Chromatography (GC/HPLC) Analyst",
    "dueDate": "2026-10-16",
    "completedDate": "2026-10-15",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Compare candidate process routes against safety, quality, cost and sustainability criteria",
    "taskCode": "CHM-T017",
    "jobCode": "ENG02",
    "department": "Process Engineering",
    "role": "Engineering Manager",
    "dueDate": "2026-03-17",
    "completedDate": "2026-03-16",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Prepare process flow diagrams, mass and energy balances and equipment sizing basis",
    "taskCode": "CHM-T018",
    "jobCode": "ENG01",
    "department": "Process Engineering",
    "role": "Engineering Executive",
    "dueDate": "2026-04-18",
    "completedDate": "2026-04-17",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Define critical process parameters, control strategy and operating envelope",
    "taskCode": "CHM-T019",
    "jobCode": "INST01",
    "department": "Instrumentation & DCS",
    "role": "Instrumentation and DCS Technician",
    "dueDate": "2026-05-19",
    "completedDate": "2026-05-18",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Complete basis of design, scale-up risk review and Gate 2 recommendation",
    "taskCode": "CHM-T020",
    "jobCode": "PM01",
    "department": "Project Management",
    "role": "Chemical Program Manager",
    "dueDate": "2026-06-20",
    "completedDate": "2026-06-19",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Translate laboratory process parameters into bench and pilot scale operating procedures",
    "taskCode": "CHM-T021",
    "jobCode": "REAC01",
    "department": "Reaction Engineering",
    "role": "Reactor Operator / Chemical Engineer",
    "dueDate": "2026-07-21",
    "completedDate": "2026-07-20",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Execute bench-scale batches and assess yield, quality and process consistency",
    "taskCode": "CHM-T022",
    "jobCode": "MFG03",
    "department": "Manufacturing / Production",
    "role": "Production Supervisor",
    "dueDate": "2026-08-22",
    "completedDate": "2026-08-21",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Develop downstream separation, solvent recovery and waste treatment operations",
    "taskCode": "CHM-T023",
    "jobCode": "DIST01",
    "department": "Separation & Purification",
    "role": "Distillation & Separation Operator",
    "dueDate": "2026-09-23",
    "completedDate": "2026-09-22",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": true,
    "taskName": "Qualify raw materials, utilities, equipment and measurement systems for pilot readiness",
    "taskCode": "CHM-T024",
    "jobCode": "VAL01",
    "department": "Process Validation",
    "role": "Process Validation Executive",
    "dueDate": "2026-10-24",
    "completedDate": "2026-10-23",
    "remarks": "Activity executed in accordance with chemical process procedure and batch records",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Complete process hazard analysis (HAZOP), risk assessment and safeguards review",
    "taskCode": "CHM-T025",
    "jobCode": "PSE01",
    "department": "Process Safety & EHS",
    "role": "Process Safety Engineer",
    "dueDate": "2026-03-25",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Assess occupational exposure, chemical compatibility, fire and explosion protection",
    "taskCode": "CHM-T026",
    "jobCode": "PSE01",
    "department": "Process Safety & EHS",
    "role": "Process Safety Engineer",
    "dueDate": "2026-04-01",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Develop environmental impact, effluent, emissions and hazardous waste management plans",
    "taskCode": "CHM-T027",
    "jobCode": "EM01",
    "department": "Environmental & Effluent",
    "role": "Effluent and Stack Emission Monitoring Analyst",
    "dueDate": "2026-05-02",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Compile regulatory data package, safety studies and Gate 3 readiness evidence",
    "taskCode": "CHM-T028",
    "jobCode": "REG01",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Specialist",
    "dueDate": "2026-06-03",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Prepare jurisdiction-specific registration strategy and chemical inventory submissions",
    "taskCode": "CHM-T029",
    "jobCode": "REG01",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Specialist",
    "dueDate": "2026-07-04",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Compile substance identity, composition, impurity and physicochemical data dossiers",
    "taskCode": "CHM-T030",
    "jobCode": "DOC01",
    "department": "Quality Documentation",
    "role": "Quality Documentation Executive",
    "dueDate": "2026-08-05",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Complete toxicology, ecotoxicology and exposure data review as applicable",
    "taskCode": "CHM-T031",
    "jobCode": "REG01",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Specialist",
    "dueDate": "2026-09-06",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Submit REACH, TSCA, India and other applicable registration dossiers; track authority queries",
    "taskCode": "CHM-T032",
    "jobCode": "REG01",
    "department": "Regulatory Affairs",
    "role": "Regulatory Affairs Specialist",
    "dueDate": "2026-10-07",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Plan pilot plant campaign, batch sequence, raw material staging and resource allocation",
    "taskCode": "CHM-T033",
    "jobCode": "MFG04",
    "department": "Manufacturing / Production",
    "role": "Production Manager",
    "dueDate": "2026-03-08",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Execute pilot batches and monitor critical process parameters and control limits",
    "taskCode": "CHM-T034",
    "jobCode": "MFG03",
    "department": "Manufacturing / Production",
    "role": "Production Supervisor",
    "dueDate": "2026-04-09",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Perform in-process sampling, finished product testing and batch record review",
    "taskCode": "CHM-T035",
    "jobCode": "QC03",
    "department": "Quality Control",
    "role": "Quality Control Manager",
    "dueDate": "2026-05-10",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Evaluate pilot campaign yield, deviations, process capability and scale-up readiness",
    "taskCode": "CHM-T036",
    "jobCode": "VAL01",
    "department": "Process Validation",
    "role": "Process Validation Executive",
    "dueDate": "2026-06-11",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Execute demonstration-scale campaign using approved process and control strategy",
    "taskCode": "CHM-T037",
    "jobCode": "MFG04",
    "department": "Manufacturing / Production",
    "role": "Production Manager",
    "dueDate": "2026-07-12",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Verify product quality, throughput, cycle time and operating reliability at demo scale",
    "taskCode": "CHM-T038",
    "jobCode": "QC03",
    "department": "Quality Control",
    "role": "Quality Control Manager",
    "dueDate": "2026-08-13",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Assess waste generation, solvent recovery, energy consumption and operating cost",
    "taskCode": "CHM-T039",
    "jobCode": "EM01",
    "department": "Environmental & Effluent",
    "role": "Effluent and Stack Emission Monitoring Analyst",
    "dueDate": "2026-09-14",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Prepare demonstration-scale performance report and Gate 4 evidence package",
    "taskCode": "CHM-T040",
    "jobCode": "QA03",
    "department": "Quality Assurance",
    "role": "Quality Assurance Manager",
    "dueDate": "2026-10-15",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Complete detailed engineering, procurement, construction and installation of commercial plant",
    "taskCode": "CHM-T041",
    "jobCode": "ENG02",
    "department": "Process Engineering",
    "role": "Engineering Manager",
    "dueDate": "2026-03-16",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Commission reactors, separation systems, utilities, DCS, instrumentation and safety systems",
    "taskCode": "CHM-T042",
    "jobCode": "CQV01",
    "department": "Commissioning & Qualification",
    "role": "Commissioning and Qualification Engineer",
    "dueDate": "2026-04-17",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Execute equipment qualification, process validation and operator training",
    "taskCode": "CHM-T043",
    "jobCode": "VAL01",
    "department": "Process Validation",
    "role": "Process Validation Executive",
    "dueDate": "2026-05-18",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Complete commercial plant readiness, EHS clearance and Gate 5 approval dossier",
    "taskCode": "CHM-T044",
    "jobCode": "QA03",
    "department": "Quality Assurance",
    "role": "Quality Assurance Manager",
    "dueDate": "2026-06-19",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Execute first commercial production batches and confirm approved release specifications",
    "taskCode": "CHM-T045",
    "jobCode": "MFG04",
    "department": "Manufacturing / Production",
    "role": "Production Manager",
    "dueDate": "2026-07-20",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Monitor process performance, batch quality, yield and manufacturing KPIs during ramp-up",
    "taskCode": "CHM-T046",
    "jobCode": "MFG03",
    "department": "Manufacturing / Production",
    "role": "Production Supervisor",
    "dueDate": "2026-08-21",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Establish product stewardship, SDS controls, customer technical support and change management",
    "taskCode": "CHM-T047",
    "jobCode": "QA03",
    "department": "Quality Assurance",
    "role": "Quality Assurance Manager",
    "dueDate": "2026-09-22",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  },
  {
    "active": true,
    "done": false,
    "taskName": "Complete launch review, supply continuity plan and post-launch improvement actions",
    "taskCode": "CHM-T048",
    "jobCode": "PM01",
    "department": "Project Management",
    "role": "Chemical Program Manager",
    "dueDate": "2026-10-23",
    "completedDate": "",
    "remarks": "Pre-execution checks and resource allocation in progress",
    "isEditing": false
  }
];

  get paginatedTasks(): TaskItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialogRef: MatDialogRef<AssignTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.row?.tasksData && Array.isArray(this.data.row.tasksData)) {
      this.tasksList = this.data.row.tasksData.map((item: any, idx: number) => ({
        ...item,
        taskCode: item.taskCode || `TC-10${idx + 1}`,
        jobCode: item.jobCode || 'RND-01',
        historyCount: item.historyCount || this.getHistoryCount(idx),
        isEditing: false
      }));
    } else if (this.data?.tasks && Array.isArray(this.data.tasks)) {
      this.tasksList = this.data.tasks.map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            active: true,
            done: false,
            taskName: item,
            taskCode: `TC-10${idx + 1}`,
            jobCode: 'RND-01',
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
          taskCode: item.taskCode || `TC-10${idx + 1}`,
          jobCode: item.jobCode || 'RND-01',
          historyCount: item.historyCount || this.getHistoryCount(idx),
          isEditing: false
        };
      });
    } else {
      this.tasksList.forEach((t, idx) => {
        if (!t.historyCount) t.historyCount = this.getHistoryCount(idx);
      });
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addTask(): void {
    const nextNum = this.tasksList.length + 1;
    const newTask: TaskItem = {
      active: true,
      done: false,
      taskName: '',
      taskCode: `TC-10${nextNum}`,
      jobCode: this.jobCodeOptions[0] || 'RND-01',
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
    this.tasksList.unshift(newTask);
  }

  startEdit(row: TaskItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: TaskItem): void {
    row.isEditing = false;
    delete row.isNew;
    delete row._backup;
  }

  cancelEdit(row: TaskItem): void {
    if (row.isNew) {
      const index = this.tasksList.indexOf(row);
      if (index > -1) {
        this.tasksList.splice(index, 1);
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.tasksList.length) {
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

  deleteTask(row: TaskItem): void {
    const index = this.tasksList.indexOf(row);
    if (index > -1) {
      this.tasksList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.tasksList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    // Finalize any rows left in edit mode
    this.tasksList.forEach(r => {
      r.isEditing = false;
      delete r.isNew;
      delete r._backup;
    });

    this.dialogRef.close({
      tasks: this.tasksList,
      count: this.tasksList.length
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openHistory(row: TaskItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.dialogRef.close();
    this.router.navigate(['/stages/wbs/tasks/history'], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        jobCode: row.jobCode,
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
