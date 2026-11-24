import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AddTodoComponent } from '../../../../project-todo/add-todo/add-todo.component';
import { ConfirmationDialogComponent } from '../../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface ProjectTodoItem {
  id?: number;
  done?: boolean;
  stage?: string;
  deliverable?: string;
  activity?: string;
  task?: string;
  taskName?: string;
  subject: string;
  description: string;
  assignedTo?: string;
  dateCreated?: string;
  dueDate: string;
  role: string;
  group: string;
  site: string;
  department: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualHours?: number;
  section?: string;
  taskCode?: string;
  effort?: number;
  status?: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-wbs-tasks-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './project-wbs-tasks-todo.component.html',
  styleUrl: './project-wbs-tasks-todo.component.scss',
})
export class ProjectWbsTasksTodoComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  todos: ProjectTodoItem[] = [];
  filteredTodos: ProjectTodoItem[] = [];
  paginatedTodos: ProjectTodoItem[] = [];

  // Filter Card state
  filterToggle: boolean = false;
  searchKeyword: string = '';
  selectedRole: string | null = null;
  selectedGroup: string | null = null;
  selectedSite: string | null = null;
  selectedDepartment: string | null = null;

  // Dropdown options
  roleOptions: string[] = [];
  groupOptions: string[] = [];
  siteOptions: string[] = [];
  departmentOptions: string[] = [];

  // Pagination
  pageIndex: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  taskName: string = '';
  taskCode: string = '';
  reference: string = '';
  jobCode: string = '';
  activityName: string = '';
  jobCodeParam: string = '';
  stageName: string = '';
  stageCode: string = '';
  gateName: string = '';
  gateCode: string = '';
  projectName: string = '';
  projectCode: string = '';

  // Timeline Modal Popup state
  showTimelineModal: boolean = false;
  selectedTimelineTask: ProjectTodoItem | null = null;

  readonly historySequence: number[] = [4, 2, 5, 3, 6, 1, 7, 2, 4, 8, 3, 5, 2, 6, 4, 8];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taskName = params['taskName'] || '';
      this.taskCode = params['taskCode'] || '';
      this.reference = params['reference'] || '';
      this.jobCode = params['jobCode'] || '';
      this.activityName = params['activityName'] || '';
      this.jobCodeParam = params['jobCodeParam'] || params['jobCode'] || '';
      this.stageName = params['stageName'] || '';
      this.stageCode = params['stageCode'] || '';
      this.gateName = params['gateName'] || '';
      this.gateCode = params['gateCode'] || '';
      this.projectName = params['projectName'] || params['name'] || 'Acrylic Emulsion Binder 50% Solids';
      this.projectCode = params['projectCode'] || params['code'] || '2026/CHM/006';

      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];

    const actName = this.activityName || 'Review industrial customer specifications, grade requirements and end-use application criteria';
    const tName = this.taskName || 'Confirm technical scope and operating window — Review industrial customer specifications, grade requirements and end-use application criteria';
    const stg = this.stageName || 'S1: Opportunity Identification';

    let targetDone = 2;
    let targetTotal = 4;
    const countParam = this.route?.snapshot.queryParamMap.get('todoCount');
    if (countParam && countParam.includes('/')) {
      const parts = countParam.split('/');
      targetDone = parseInt(parts[0], 10) || 2;
      targetTotal = parseInt(parts[1], 10) || 4;
    }

    const taskSpecificTodos: ProjectTodoItem[] = [
      {
        id: 1,
        done: targetDone >= 1,
        stage: stg,
        deliverable: 'Customer Application & Target Specification Matrix',
        activity: actName,
        task: tName,
        subject: 'Review Industrial Customer Specification Sheets',
        description: 'Examine customer technical grade requirements, viscosity range, solids %, and end-use application criteria.',
        assignedTo: 'Dr. Sarah Jenkins',
        dateCreated: '2026-05-28',
        dueDate: '2026-06-05',
        role: 'Process Chemist',
        group: 'R&D Group',
        site: 'R&D Center – Dahej',
        department: 'Process Chemistry',
        status: targetDone >= 1 ? 'Completed' : 'Pending',
        planStart: '2026-06-01',
        planEnd: '2026-06-05',
        actualStart: '2026-06-01',
        actualEnd: targetDone >= 1 ? '2026-06-05' : '',
        eta: '2026-06-05',
        actualHours: targetDone >= 1 ? 30 : 0,
        section: 'Process Chemistry',
        taskCode: 'TODO-001',
        effort: 32
      },
      {
        id: 2,
        done: targetDone >= 2,
        stage: stg,
        deliverable: 'Market Sizing & Competitor Grade Benchmarking',
        activity: actName,
        task: tName,
        subject: 'Benchmark Against Competitor Product Grades',
        description: 'Compile competitor physical and chemical properties datasheet, purity limits, and price-point benchmarks.',
        assignedTo: 'Ravi Shah',
        dateCreated: '2026-05-30',
        dueDate: '2026-06-12',
        role: 'Process Safety Engineer',
        group: 'Safety Group',
        site: 'R&D Center – Panoli',
        department: 'Process Safety & EHS',
        status: targetDone >= 2 ? 'Completed' : 'Pending',
        planStart: '2026-06-05',
        planEnd: '2026-06-12',
        actualStart: '2026-06-05',
        actualEnd: targetDone >= 2 ? '2026-06-12' : '',
        eta: '2026-06-12',
        actualHours: targetDone >= 2 ? 40 : 0,
        section: 'Process Safety (RC1/DSC)',
        taskCode: 'TODO-002',
        effort: 40
      },
      {
        id: 3,
        done: targetDone >= 3,
        stage: stg,
        deliverable: 'Preliminary Business Case & Techno-Economic Screening',
        activity: actName,
        task: tName,
        subject: 'Align Operating Window with Production Capacity',
        description: 'Validate proposed temperature, cycle time, and reaction kinetics against commercial plant envelope.',
        assignedTo: 'Mia Chen',
        dateCreated: '2026-06-02',
        dueDate: '2026-06-16',
        role: 'Analytical Scientist',
        group: 'Analytical Group',
        site: 'R&D Center – Dahej',
        department: 'Analytical Development',
        status: targetDone >= 3 ? 'Completed' : 'In Process',
        planStart: '2026-06-08',
        planEnd: '2026-06-16',
        actualStart: '2026-06-08',
        actualEnd: targetDone >= 3 ? '2026-06-15' : '',
        eta: '2026-06-16',
        actualHours: 20,
        section: 'Analytical Method Development',
        taskCode: 'TODO-003',
        effort: 48
      },
      {
        id: 4,
        done: targetDone >= 4,
        stage: stg,
        deliverable: 'Customer Application & Target Specification Matrix',
        activity: actName,
        task: tName,
        subject: 'Finalize Technical Specification Sign-off Matrix',
        description: 'Obtain joint technical review approval across R&D, Pilot Plant, and Quality Assurance.',
        assignedTo: 'Robert Chen',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-20',
        role: 'Chemical Engineer',
        group: 'Engineering Group',
        site: 'Corporate Office – Mumbai',
        department: 'Scale-up Engineering',
        status: targetDone >= 4 ? 'Completed' : 'Pending',
        planStart: '2026-06-12',
        planEnd: '2026-06-20',
        actualStart: '',
        actualEnd: '',
        eta: '2026-06-20',
        actualHours: 0,
        section: 'Scale-Up Engineering',
        taskCode: 'TODO-004',
        effort: 36
      },
      {
        id: 5,
        done: targetDone >= 5,
        stage: stg,
        deliverable: 'Preliminary Business Case & Techno-Economic Screening',
        activity: actName,
        task: tName,
        subject: 'Raw Material Feedstock Purity & Grade Verification',
        description: 'Verify assay and key impurity limits for monomer and solvent feedstocks with supply chain team.',
        assignedTo: 'Diego Ruiz',
        dateCreated: '2026-06-06',
        dueDate: '2026-06-18',
        role: 'Process Chemist',
        group: 'R&D Group',
        site: 'R&D Center – Dahej',
        department: 'Process Chemistry',
        status: targetDone >= 5 ? 'Completed' : 'Pending',
        planStart: '2026-06-10',
        planEnd: '2026-06-18',
        actualStart: targetDone >= 5 ? '2026-06-10' : '',
        actualEnd: targetDone >= 5 ? '2026-06-17' : '',
        eta: '2026-06-18',
        actualHours: targetDone >= 5 ? 32 : 0,
        section: 'Process Chemistry',
        taskCode: 'TODO-005',
        effort: 32
      }
    ];

    const currentTaskItems = taskSpecificTodos.slice(0, Math.max(targetTotal, 2));

    const generalTodos: ProjectTodoItem[] = [
      {
        id: 10,
        done: true,
        stage: 'S2: Concept Screening & Feasibility',
        deliverable: 'Chemistry Feasibility & Theoretical Yield Assessment',
        activity: 'Reaction Chemistry & Hazard Screening',
        task: 'Calorimetry & Hazard Screening',
        subject: 'Perform Reaction Hazard Screening',
        description: 'Conduct DSC screening and thermal stability evaluation for proposed monomer and catalyst combinations.',
        assignedTo: 'Ravi Shah',
        dateCreated: '2026-05-30',
        dueDate: '2026-06-12',
        role: 'Process Safety Engineer',
        group: 'Safety Group',
        site: 'R&D Center – Panoli',
        department: 'Process Safety & EHS',
        status: 'Completed',
        planStart: '2026-06-05',
        planEnd: '2026-06-12',
        actualStart: '2026-06-05',
        actualEnd: '2026-06-12',
        eta: '2026-06-12',
        actualHours: 40,
        section: 'Process Safety (RC1/DSC)',
        taskCode: 'TODO-010',
        effort: 40
      },
      {
        id: 11,
        done: false,
        stage: 'S3: Route Scouting & Lab Synthesis',
        deliverable: 'Synthetic Route Scouting & Catalyst Screening',
        activity: 'Monomer & Surfactant Characterization',
        task: 'Raw Material Impurity Profiling',
        subject: 'Validate Monomer & Catalyst Purity',
        description: 'Perform GC/FID testing to confirm raw material assay and verify absence of trace catalyst poisons.',
        assignedTo: 'Mia Chen',
        dateCreated: '2026-06-02',
        dueDate: '2026-06-16',
        role: 'Analytical Scientist',
        group: 'Analytical Group',
        site: 'R&D Center – Dahej',
        department: 'Analytical Development',
        status: 'In Process',
        planStart: '2026-06-08',
        planEnd: '2026-06-16',
        actualStart: '2026-06-08',
        actualEnd: '2026-06-15',
        eta: '2026-06-16',
        actualHours: 45,
        section: 'Analytical Method Development',
        taskCode: 'TODO-011',
        effort: 48
      },
      {
        id: 12,
        done: false,
        stage: 'S4: Process Optimization (Lab Scale)',
        deliverable: 'Reaction Parameter Optimization (Temp, Pressure, Feed)',
        activity: 'Monomer Feed Profile & Reaction Kinetics',
        task: 'Lab Scale 2 L Batch Synthesis',
        subject: 'Optimize Monomer Feed Profile',
        description: 'Calibrate semi-batch monomer dosing pump rate and jacket temperature to maintain isothermal condition.',
        assignedTo: 'Ana Vega',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-20',
        role: 'Process Chemist',
        group: 'R&D Group',
        site: 'R&D Center – Dahej',
        department: 'Process Chemistry',
        status: 'In Process',
        planStart: '2026-06-12',
        planEnd: '2026-06-20',
        actualStart: '2026-06-12',
        actualEnd: '',
        eta: '2026-06-20',
        actualHours: 25,
        section: 'Process Chemistry',
        taskCode: 'TODO-012',
        effort: 50
      },
      {
        id: 13,
        done: false,
        stage: 'S5: Process Route Selection & Basis of Design',
        deliverable: 'Process Flow Diagram (PFD) & Basis of Design (BOD)',
        activity: 'Basis of Design (BOD) & Gate 2 Dossier',
        task: 'Mass & Energy Balance Flowsheet',
        subject: 'Finalize Process Basis of Design (BOD)',
        description: 'Compile stoichiometric mass balance, solvent recycling loops, and utility heat duty models.',
        assignedTo: 'Robert Chen',
        dateCreated: '2026-06-10',
        dueDate: '2026-06-28',
        role: 'Chemical Engineer',
        group: 'Engineering Group',
        site: 'Corporate Office – Mumbai',
        department: 'Scale-up Engineering',
        status: 'Pending',
        planStart: '2026-06-18',
        planEnd: '2026-06-28',
        actualStart: '',
        actualEnd: '',
        eta: '2026-06-28',
        actualHours: 0,
        section: 'Scale-Up Engineering',
        taskCode: 'TODO-013',
        effort: 60
      },
      {
        id: 14,
        done: false,
        stage: 'S6: Bench-to-Pilot Process Development',
        deliverable: 'Reaction Calorimetry (RC1) & Heat Transfer Evaluation',
        activity: 'Reaction Calorimetry (RC1) & Heat Transfer',
        task: 'Reaction Kinetics & Calorimetry',
        subject: 'Complete RC1 Calorimetry Run',
        description: 'Quantify instantaneous reaction heat flow and calculate adiabatic runaway temperature.',
        assignedTo: 'Ravi Shah',
        dateCreated: '2026-06-15',
        dueDate: '2026-07-08',
        role: 'Process Safety Engineer',
        group: 'Safety Group',
        site: 'R&D Center – Panoli',
        department: 'Process Safety & EHS',
        status: 'Pending',
        planStart: '2026-06-25',
        planEnd: '2026-07-08',
        actualStart: '',
        actualEnd: '',
        eta: '2026-07-08',
        actualHours: 0,
        section: 'Process Safety (RC1/DSC)',
        taskCode: 'TODO-014',
        effort: 45
      },
      {
        id: 15,
        done: false,
        stage: 'S7: Process Safety & Regulatory Studies',
        deliverable: 'Process Hazard Analysis (HAZOP) & Safety Interlocks',
        activity: 'HAZOP & Relief Vent Sizing',
        task: 'HAZOP Critical Process Review',
        subject: 'Execute Reactor Node HAZOP',
        description: 'Perform multidisciplinary HAZOP on monomer feeding, runaway cooling, and emergency venting.',
        assignedTo: 'Emily Watson',
        dateCreated: '2026-06-20',
        dueDate: '2026-07-18',
        role: 'Process Safety Lead',
        group: 'Safety Group',
        site: 'R&D Center – Panoli',
        department: 'Process Safety & EHS',
        status: 'Pending',
        planStart: '2026-07-01',
        planEnd: '2026-07-18',
        actualStart: '',
        actualEnd: '',
        eta: '2026-07-18',
        actualHours: 0,
        section: 'Process Safety (RC1/DSC)',
        taskCode: 'TODO-015',
        effort: 55
      },
      {
        id: 16,
        done: false,
        stage: 'S8: Regulatory Registration Filing (REACH / TSCA)',
        deliverable: 'REACH / TSCA Technical Dossier Preparation & Filing',
        activity: 'REACH Inquiry & Dossier Submission',
        task: 'REACH / TSCA Dossier Compilation',
        subject: 'Submit REACH Technical Dossier',
        description: 'Assemble IUCLID technical registration dossier and submit to ECHA agency.',
        assignedTo: 'Jessica Alba',
        dateCreated: '2026-06-25',
        dueDate: '2026-07-25',
        role: 'Regulatory Specialist',
        group: 'Regulatory Group',
        site: 'Corporate Office – Mumbai',
        department: 'Regulatory Affairs (REACH/TSCA)',
        status: 'Pending',
        planStart: '2026-07-10',
        planEnd: '2026-07-25',
        actualStart: '',
        actualEnd: '',
        eta: '2026-07-25',
        actualHours: 0,
        section: 'Regulatory Affairs',
        taskCode: 'TODO-016',
        effort: 40
      }
    ];

    this.todos = [...currentTaskItems, ...generalTodos];

    this.extractFilterOptions();
    this.applyFilters();
  }

  extractFilterOptions(): void {
    this.roleOptions = Array.from(new Set(this.todos.map(t => t.role).filter(Boolean)));
    this.groupOptions = Array.from(new Set(this.todos.map(t => t.group).filter(Boolean)));
    this.siteOptions = Array.from(new Set(this.todos.map(t => t.site).filter(Boolean)));
    this.departmentOptions = Array.from(new Set(this.todos.map(t => t.department).filter(Boolean)));
  }

  applyFilters(): void {
    let result = [...this.todos];

    if (this.searchKeyword && this.searchKeyword.trim() !== '') {
      const kw = this.searchKeyword.toLowerCase().trim();
      result = result.filter(item =>
        (item.stage || '').toLowerCase().includes(kw) ||
        (item.deliverable || '').toLowerCase().includes(kw) ||
        (item.activity || '').toLowerCase().includes(kw) ||
        (item.task || item.taskName || '').toLowerCase().includes(kw) ||
        (item.subject || '').toLowerCase().includes(kw) ||
        (item.description || '').toLowerCase().includes(kw) ||
        (item.role || '').toLowerCase().includes(kw) ||
        (item.group || '').toLowerCase().includes(kw) ||
        (item.site || '').toLowerCase().includes(kw) ||
        (item.department || '').toLowerCase().includes(kw)
      );
    }

    if (this.selectedRole) {
      result = result.filter(item => item.role === this.selectedRole);
    }

    if (this.selectedGroup) {
      result = result.filter(item => item.group === this.selectedGroup);
    }

    if (this.selectedSite) {
      result = result.filter(item => item.site === this.selectedSite);
    }

    if (this.selectedDepartment) {
      result = result.filter(item => item.department === this.selectedDepartment);
    }

    this.filteredTodos = result;
    this.pageIndex = 0;
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedRole = null;
    this.selectedGroup = null;
    this.selectedSite = null;
    this.selectedDepartment = null;
    this.pageIndex = 0;
    this.applyFilters();
  }

  updatePagination(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedTodos = this.filteredTodos.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  toggleDone(todo: ProjectTodoItem): void {
    todo.done = !todo.done;
    todo.status = todo.done ? 'Completed' : 'Pending';
  }

  addTodo(): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: ProjectTodoItem | undefined) => {
      if (res) {
        res.id = Date.now();
        res.stage = res.stage || this.stageName || 'S1: Opportunity Identification';
        res.deliverable = res.deliverable || '0.1 - Business Case Preparation';
        res.activity = res.activity || this.activityName || 'Competitor Grade & Price Benchmarking';
        res.task = res.task || this.taskName || 'Market Benchmarking & Purity Analysis';
        res.historyCount = (this.todos.length % 10) + 1;
        this.todos.unshift(res);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  editTodo(todo: ProjectTodoItem): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: { ...todo }
    });

    dialogRef.afterClosed().subscribe((res: ProjectTodoItem | undefined) => {
      if (res) {
        Object.assign(todo, res);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  deleteTodo(todo: ProjectTodoItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this Todo?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  openTimelineModal(todo: ProjectTodoItem): void {
    this.selectedTimelineTask = todo;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  goBack(): void {
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/stages/wbs')) {
      this.router.navigate(['/projects/dashboard/stages/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else if (currentUrl.includes('/wbs')) {
      this.router.navigate(['/projects/dashboard/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else {
      this.location.back();
    }
  }
}
