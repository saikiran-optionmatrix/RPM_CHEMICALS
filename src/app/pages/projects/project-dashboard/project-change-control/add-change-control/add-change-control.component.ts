import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface CategoryChangeOptions {
  process: boolean;
  sopGuideline: boolean;
  specStp: boolean;
  equipmentInstrument: boolean;
  document: boolean;
  software: boolean;
  material: boolean;
  facility: boolean;
  packing: boolean;
  otherSpecify: string;
}

export interface InitiationWorkflowRow {
  workflow: string;
  department: string;
  section: string;
  signed: boolean;
  signedDate: string;
}

export interface DepartmentAssessmentRow {
  id: number;
  departmentName: string;
  section: string;
  user: string;
  acceptance: boolean;
  nonAcceptance: boolean;
  na: boolean;
  signed: boolean;
  signedDate: string;
}

@Component({
  selector: 'app-add-change-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './add-change-control.component.html',
  styleUrl: './add-change-control.component.scss'
})
export class AddChangeControlComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';
  ccnParam: string = '';

  isEditMode: boolean = false;
  activeTab: 'initiation' | 'assessment' = 'initiation';

  tabs = [
    { id: 'initiation' as const, label: 'Initiation' },
    { id: 'assessment' as const, label: 'Assessment' }
  ];

  // Dropdown Lists
  departments: string[] = [
    'R&D',
    'Analytical R&D',
    'Formulation R&D',
    'Quality Assurance',
    'Quality Control',
    'Regulatory Affairs',
    'Production',
    'Packaging & Development',
    'Clinical Research'
  ];

  users: string[] = [
    'Dr. Sarah Jenkins',
    'Alex Rivera',
    'Priya Sharma',
    'Michael Chang',
    'Emily Watson',
    'David Kim',
    'Anita Desai',
    'Robert Johnson',
    'Suresh Nair',
    'Kavita Patel'
  ];

  sections: string[] = [
    'DQ',
    'FD',
    'AD',
    'PD',
    'CD',
    'Plant QA',
    'Plant QC',
    'RA',
    'HR',
    'Engineering',
    'IT',
    'TTD',
    'Production'
  ];

  markets: string[] = [
    'US',
    'EU',
    'India',
    'Global',
    'ROW',
    'Canada',
    'UK',
    'Australia'
  ];

  categories: string[] = [
    'Major',
    'Minor',
    'Critical',
    'Moderate',
    'Administrative'
  ];

  // Tab 1: Initiation fields
  changeControlNumber: string = 'CCN-2026-009';
  initiationDepartment: string = 'R&D';
  initiatedBy: string = 'Dr. Sarah Jenkins';
  initiationDate: string = '2026-03-15';
  permanentChangeControl: boolean = false;
  market: string = 'US';
  selectedCategories: string[] = ['Major'];

  categoryOptions: CategoryChangeOptions = {
    process: false,
    sopGuideline: false,
    specStp: false,
    equipmentInstrument: true,
    document: false,
    software: false,
    material: false,
    facility: false,
    packing: false,
    otherSpecify: ''
  };

  existingProcedure: string = '';
  proposedChange: string = '';
  reasonForProposedChange: string = '';

  // File Upload State (Matching UploadDocumentsComponent)
  isDraggingExisting: boolean = false;
  isDraggingProposed: boolean = false;
  existingFiles: File[] = [];
  proposedFiles: File[] = [];

  // Initiation Workflow table (Initiated By & Reviewed By)
  initiationWorkflowRows: InitiationWorkflowRow[] = [
    {
      workflow: 'Initiated By',
      department: 'R&D',
      section: 'AD',
      signed: true,
      signedDate: '2026-03-15'
    },
    {
      workflow: 'Reviewed By',
      department: 'R&D',
      section: 'DQ',
      signed: true,
      signedDate: '2026-03-16'
    }
  ];

  initiationComments: string = '';

  // Tab 2: Assessment - Activity Affected Grid (12 items in 4 rows x 3 columns from image)
  activityGrid = [
    [
      { id: 'sop', label: 'SOP', selected: false },
      { id: 'specStp', label: 'Specification / STP', selected: false },
      { id: 'analyticalMethod', label: 'Analytical method validation', selected: false }
    ],
    [
      { id: 'drawingLayout', label: 'Drawing/ Layout / Art Work', selected: false },
      { id: 'cleaningValidation', label: 'Cleaning validation/ Matrix', selected: false },
      { id: 'methodTransfer', label: 'Method transfer document', selected: false }
    ],
    [
      { id: 'training', label: 'Training', selected: false },
      { id: 'qualificationCalibration', label: 'Qualification /Calibration', selected: false },
      { id: 'techTransferDossier', label: 'Technology transfer dossier', selected: false }
    ],
    [
      { id: 'pmp', label: 'PMP', selected: false },
      { id: 'utilities', label: 'Utilities', selected: false },
      { id: 'masterLists', label: 'Master Lists / Master Schedules', selected: false }
    ]
  ];

  assessmentComments: string = '';

  // Assessment Workflow table (Initial Assessment By)
  assessmentWorkflowRows: InitiationWorkflowRow[] = [
    {
      workflow: 'Initial Assessment By',
      department: 'R&D',
      section: 'RA',
      signed: true,
      signedDate: '2026-03-17'
    }
  ];

  // 13 Department Assessment records with Department = 'R&D' and sections from images
  departmentAssessments: DepartmentAssessmentRow[] = [
    {
      id: 1,
      departmentName: 'R&D',
      section: 'DQ',
      user: 'Dr. Sarah Jenkins',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-18'
    },
    {
      id: 2,
      departmentName: 'R&D',
      section: 'FD',
      user: 'Alex Rivera',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-19'
    },
    {
      id: 3,
      departmentName: 'R&D',
      section: 'AD',
      user: 'Priya Sharma',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-20'
    },
    {
      id: 4,
      departmentName: 'R&D',
      section: 'PD',
      user: 'Anita Desai',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-21'
    },
    {
      id: 5,
      departmentName: 'R&D',
      section: 'CD',
      user: 'Michael Chang',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-22'
    },
    {
      id: 6,
      departmentName: 'R&D',
      section: 'Plant QA',
      user: 'Emily Watson',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-22'
    },
    {
      id: 7,
      departmentName: 'R&D',
      section: 'Plant QC',
      user: 'David Kim',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-23'
    },
    {
      id: 8,
      departmentName: 'R&D',
      section: 'RA',
      user: 'Robert Johnson',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-23'
    },
    {
      id: 9,
      departmentName: 'R&D',
      section: 'HR',
      user: 'Suresh Nair',
      acceptance: false,
      nonAcceptance: false,
      na: true,
      signed: true,
      signedDate: '2026-01-24'
    },
    {
      id: 10,
      departmentName: 'R&D',
      section: 'Engineering',
      user: 'Kavita Patel',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-24'
    },
    {
      id: 11,
      departmentName: 'R&D',
      section: 'IT',
      user: 'Alex Rivera',
      acceptance: false,
      nonAcceptance: false,
      na: true,
      signed: true,
      signedDate: '2026-01-25'
    },
    {
      id: 12,
      departmentName: 'R&D',
      section: 'TTD',
      user: 'Dr. Sarah Jenkins',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-25'
    },
    {
      id: 13,
      departmentName: 'R&D',
      section: 'Production',
      user: 'Emily Watson',
      acceptance: true,
      nonAcceptance: false,
      na: false,
      signed: true,
      signedDate: '2026-01-26'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      } else if (params['name']) {
        this.projectName = params['name'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      } else if (params['code']) {
        this.projectCode = params['code'];
      }

      const mode = params['mode'];
      if (mode === 'add') {
        this.isEditMode = false;
        this.ccnParam = '';
        this.resetAddModeData();
      } else if (mode === 'edit' || params['ccn']) {
        this.isEditMode = true;
        this.ccnParam = params['ccn'] || 'CCN-2026-001';
        this.changeControlNumber = this.ccnParam;
        this.initEditModeData();
      } else {
        this.isEditMode = false;
        this.ccnParam = '';
        this.resetAddModeData();
      }
    });
  }

  resetAddModeData(): void {
    this.changeControlNumber = 'CCN-2026-009';
    this.initiationDepartment = 'R&D';
    this.market = '';
    this.categoryOptions = {
      process: false,
      sopGuideline: false,
      specStp: false,
      equipmentInstrument: false,
      document: false,
      software: false,
      material: false,
      facility: false,
      packing: false,
      otherSpecify: ''
    };
    this.existingProcedure = '';
    this.proposedChange = '';
    this.reasonForProposedChange = '';
    this.initiationWorkflowRows = [
      {
        workflow: 'Initiated By',
        department: 'R&D',
        section: 'AD',
        signed: true,
        signedDate: new Date().toISOString().substring(0, 10)
      },
      {
        workflow: 'Reviewed By',
        department: 'R&D',
        section: 'DQ',
        signed: false,
        signedDate: ''
      }
    ];
    this.initiationComments = '';
    this.assessmentComments = '';
    this.assessmentWorkflowRows = [
      {
        workflow: 'Initial Assessment By',
        department: 'R&D',
        section: 'RA',
        signed: false,
        signedDate: ''
      }
    ];
    this.departmentAssessments = [
      { id: 1, departmentName: 'R&D', section: 'DQ', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 2, departmentName: 'R&D', section: 'FD', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 3, departmentName: 'R&D', section: 'AD', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 4, departmentName: 'R&D', section: 'PD', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 5, departmentName: 'R&D', section: 'CD', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 6, departmentName: 'R&D', section: 'Plant QA', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 7, departmentName: 'R&D', section: 'Plant QC', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 8, departmentName: 'R&D', section: 'RA', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 9, departmentName: 'R&D', section: 'HR', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 10, departmentName: 'R&D', section: 'Engineering', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 11, departmentName: 'R&D', section: 'IT', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 12, departmentName: 'R&D', section: 'TTD', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' },
      { id: 13, departmentName: 'R&D', section: 'Production', user: '', acceptance: false, nonAcceptance: false, na: false, signed: false, signedDate: '' }
    ];
  }

  initEditModeData(): void {
    this.initiationDepartment = 'R&D';
    this.initiationDate = '2026-03-15';
    this.permanentChangeControl = true;
    this.market = 'US';
    this.categoryOptions = {
      process: false,
      sopGuideline: false,
      specStp: false,
      equipmentInstrument: true,
      document: false,
      software: false,
      material: false,
      facility: false,
      packing: false,
      otherSpecify: ''
    };
    this.initiationWorkflowRows = [
      {
        workflow: 'Initiated By',
        department: 'R&D',
        section: 'AD',
        signed: true,
        signedDate: '2026-03-15'
      },
      {
        workflow: 'Reviewed By',
        department: 'R&D',
        section: 'DQ',
        signed: true,
        signedDate: '2026-03-16'
      }
    ];
    this.assessmentWorkflowRows = [
      {
        workflow: 'Initial Assessment By',
        department: 'R&D',
        section: 'RA',
        signed: true,
        signedDate: '2026-03-17'
      }
    ];
    this.departmentAssessments = [
      { id: 1, departmentName: 'R&D', section: 'DQ', user: 'Dr. Sarah Jenkins', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-18' },
      { id: 2, departmentName: 'R&D', section: 'FD', user: 'Alex Rivera', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-19' },
      { id: 3, departmentName: 'R&D', section: 'AD', user: 'Priya Sharma', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-20' },
      { id: 4, departmentName: 'R&D', section: 'PD', user: 'Anita Desai', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-21' },
      { id: 5, departmentName: 'R&D', section: 'CD', user: 'Michael Chang', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-22' },
      { id: 6, departmentName: 'R&D', section: 'Plant QA', user: 'Emily Watson', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-22' },
      { id: 7, departmentName: 'R&D', section: 'Plant QC', user: 'David Kim', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-23' },
      { id: 8, departmentName: 'R&D', section: 'RA', user: 'Robert Johnson', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-23' },
      { id: 9, departmentName: 'R&D', section: 'HR', user: 'Suresh Nair', acceptance: false, nonAcceptance: false, na: true, signed: true, signedDate: '2026-01-24' },
      { id: 10, departmentName: 'R&D', section: 'Engineering', user: 'Kavita Patel', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-24' },
      { id: 11, departmentName: 'R&D', section: 'IT', user: 'Alex Rivera', acceptance: false, nonAcceptance: false, na: true, signed: true, signedDate: '2026-01-25' },
      { id: 12, departmentName: 'R&D', section: 'TTD', user: 'Dr. Sarah Jenkins', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-25' },
      { id: 13, departmentName: 'R&D', section: 'Production', user: 'Emily Watson', acceptance: true, nonAcceptance: false, na: false, signed: true, signedDate: '2026-01-26' }
    ];
  }

  setActiveTab(tabId: 'initiation' | 'assessment'): void {
    this.activeTab = tabId;
  }

  // File Upload Handlers (Matching UploadDocumentsComponent)
  onExistingFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingExisting = false;
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.existingFiles.push(event.dataTransfer.files[i]);
      }
    }
  }

  onProposedFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingProposed = false;
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.proposedFiles.push(event.dataTransfer.files[i]);
      }
    }
  }

  onExistingFileSelected(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.existingFiles.push(event.target.files[i]);
      }
    }
  }

  onProposedFileSelected(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.proposedFiles.push(event.target.files[i]);
      }
    }
  }

  removeExistingFile(idx: number): void {
    this.existingFiles.splice(idx, 1);
  }

  removeProposedFile(idx: number): void {
    this.proposedFiles.splice(idx, 1);
  }

  setAssessmentChoice(row: DepartmentAssessmentRow, choice: 'acceptance' | 'nonAcceptance' | 'na'): void {
    if (choice === 'acceptance') {
      row.acceptance = !row.acceptance;
      if (row.acceptance) {
        row.nonAcceptance = false;
        row.na = false;
      }
    } else if (choice === 'nonAcceptance') {
      row.nonAcceptance = !row.nonAcceptance;
      if (row.nonAcceptance) {
        row.acceptance = false;
        row.na = false;
      }
    } else if (choice === 'na') {
      row.na = !row.na;
      if (row.na) {
        row.acceptance = false;
        row.nonAcceptance = false;
      }
    }
  }

  formatToDdMmYyyy(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (ddmmyyyyMatch) {
      return `${ddmmyyyyMatch[1]}-${ddmmyyyyMatch[2]}-${ddmmyyyyMatch[3]}`;
    }
    const yyyymmddMatch = trimmed.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
    if (yyyymmddMatch) {
      return `${yyyymmddMatch[3]}-${yyyymmddMatch[2]}-${yyyymmddMatch[1]}`;
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, '0');
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const year = parsed.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return dateStr;
  }

  formatToYyyyMmDd(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (ddmmyyyyMatch) {
      return `${ddmmyyyyMatch[3]}-${ddmmyyyyMatch[2]}-${ddmmyyyyMatch[1]}`;
    }
    return trimmed;
  }

  save(): void {
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/change-control'], {
      queryParams: { mode: null, ccn: null },
      queryParamsHandling: 'merge'
    });
  }
}
