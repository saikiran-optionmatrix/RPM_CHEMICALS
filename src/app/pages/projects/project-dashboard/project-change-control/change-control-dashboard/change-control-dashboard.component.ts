import { Component, OnInit, DoCheck, ViewChild, ElementRef } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddExtensionComponent } from './add-extension/add-extension.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';


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
  other: boolean;
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

export interface ExtensionItem {
  id: number;
  comments: string;
  targetDate: string;
  department: string;
  hod: string;
  signed: boolean;
  signedDate: string;
}

export interface ImplementationActivityRow {
  id: number;
  proposedActivity: string;
  department: string;
  section: string;
  responsibility: string;
  targetClosureDate: string;
}

export interface EvidenceItem {
  id: number;
  docTitle: string;
  docDescription: string;
  docReference: string;
  fileName?: string;
  fileSize?: string;
  uploadedBy?: string;
  uploadDate?: string;
}

export interface ClosureCheckpointRow {
  id: number;
  action: string;
  yes: boolean;
  no: boolean;
  na: boolean;
}

export interface ClosureWorkflowRow {
  workflow: string;
  department: string;
  section: string;
  responsibility: string;
  signed: boolean;
  signedDate: string;
}

export interface AmendmentItem {
  id: number;
  ccfNo: string;
  amendmentDate: string;
  docTitle: string;
  docNo: string;
  amendmentStatus: 'Approved' | 'Rejected' | 'Pending';
  department: string;
  responsibility: string;
  signed: boolean;
  signedDate: string;
}

@Component({
  selector: 'app-change-control-dashboard',
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
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './change-control-dashboard.component.html',
  styleUrl: './change-control-dashboard.component.scss',
})
export class ChangeControlDashboardComponent implements OnInit, DoCheck {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';
  changeControlNumber: string = 'CCN-2026-001';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('implementationScrollContainer') implementationScrollContainer!: ElementRef;

  isDirty: boolean = false;
  private savedSnapshot: string = '';

  activeTab: 'initiation' | 'assessment' | 'implementation' | 'extension' | 'evidence' | 'closure' | 'amendment' = 'initiation';

  tabs = [
    { id: 'initiation' as const, label: 'Initiation' },
    { id: 'assessment' as const, label: 'Assessment' },
    { id: 'implementation' as const, label: 'Implementation' },
    { id: 'extension' as const, label: 'Extension' },
    { id: 'evidence' as const, label: 'Evidence' },
    { id: 'closure' as const, label: 'Closure' },
    { id: 'amendment' as const, label: 'Amendment' }
  ];

  setActiveTab(tabId: 'initiation' | 'assessment' | 'implementation' | 'extension' | 'evidence' | 'closure' | 'amendment' | string): void {
    this.activeTab = tabId as any;
  }

  formatToDdMmYyyy(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    // Already in dd-mm-yyyy or dd/mm/yyyy
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (ddmmyyyyMatch) {
      return `${ddmmyyyyMatch[1]}-${ddmmyyyyMatch[2]}-${ddmmyyyyMatch[3]}`;
    }
    // yyyy-mm-dd or yyyy/mm/dd
    const yyyymmddMatch = trimmed.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
    if (yyyymmddMatch) {
      return `${yyyymmddMatch[3]}-${yyyymmddMatch[2]}-${yyyymmddMatch[1]}`;
    }
    // dd-MMM-yyyy e.g. 15-Jan-2026
    const ddMmmYyyyMatch = trimmed.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (ddMmmYyyyMatch) {
      const day = ddMmmYyyyMatch[1].padStart(2, '0');
      const monthStr = ddMmmYyyyMatch[2].toLowerCase();
      const months: Record<string, string> = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
      };
      const month = months[monthStr] || '01';
      return `${day}-${month}-${ddMmmYyyyMatch[3]}`;
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

  // ==========================================
  // TAB 1: INITIATION FIELDS
  // ==========================================
  initiationDepartment: string = 'R&D';
  initiatedBy: string = 'Dr. Sarah Jenkins';
  initiationDate: string = '2026-01-15';
  permanentChangeControl: boolean = true;
  regulatoryImpact: boolean = true;
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
    other: false,
    otherSpecify: ''
  };

  existingProcedure: string = 'Standard operating procedure SOP-QC-042 for HPLC assay test of finished product batch.';
  proposedChange: string = 'Update chromatographic column specifications from C18 5um to C18 3.5um for faster resolution and solvent reduction.';
  reasonForProposedChange: string = 'Method optimization to reduce run time from 45 mins to 25 mins without compromising peak separation.';

  // File Upload State
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
      signedDate: '2026-01-15'
    },
    {
      workflow: 'Reviewed By',
      department: 'R&D',
      section: 'DQ',
      signed: true,
      signedDate: '2026-01-16'
    }
  ];

  // Signature rows (Always in Edit mode: all fields visible)
  signInitiatedBy: string = 'Dr. Sarah Jenkins';
  signInitiatedSigned: boolean = true;
  signInitiatedDate: string = '2026-01-15';

  reviewedBy: string = 'Priya Sharma';
  reviewedSigned: boolean = true;
  reviewedDate: string = '2026-01-16';

  initiationComments: string = 'Column comparability data reviewed and found satisfactory in R&D scale.';

  // ==========================================
  // TAB 2: ASSESSMENT FIELDS
  // ==========================================
  activityGrid = [
    [
      { id: 'sop', label: 'SOP', selected: true },
      { id: 'specStp', label: 'Specification / STP', selected: true },
      { id: 'analyticalMethod', label: 'Analytical method validation', selected: true }
    ],
    [
      { id: 'drawingLayout', label: 'Drawing/ Layout / Art Work', selected: false },
      { id: 'cleaningValidation', label: 'Cleaning validation/ Matrix', selected: false },
      { id: 'methodTransfer', label: 'Method transfer document', selected: true }
    ],
    [
      { id: 'training', label: 'Training', selected: true },
      { id: 'qualificationCalibration', label: 'Qualification /Calibration', selected: false },
      { id: 'techTransferDossier', label: 'Technology transfer dossier', selected: false }
    ],
    [
      { id: 'pmp', label: 'PMP', selected: false },
      { id: 'utilities', label: 'Utilities', selected: false },
      { id: 'masterLists', label: 'Master Lists / Master Schedules', selected: true }
    ]
  ];

  assessmentComments: string = 'Impact on analytical specifications and laboratory throughput evaluated. Method validation report required.';

  // Assessment Workflow table (Initial Assessment By)
  assessmentWorkflowRows: InitiationWorkflowRow[] = [
    {
      workflow: 'Initial Assessment By',
      department: 'R&D',
      section: 'RA',
      signed: true,
      signedDate: '2026-01-17'
    }
  ];

  initialAssessmentBy: string = 'Michael Chang';
  initialAssessmentSigned: boolean = true;
  initialAssessmentSignedDate: string = '2026-01-17';

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

  // ==========================================
  // TAB 3: IMPLEMENTATION FIELDS
  // ==========================================
  implementationActivities: ImplementationActivityRow[] = [
    {
      id: 1,
      proposedActivity: 'Prepare and draft revised SOP-QC-042 with updated chromatographic column specifications.',
      department: 'Analytical R&D',
      section: 'Method Development',
      responsibility: 'Dr. Sarah Jenkins',
      targetClosureDate: '2026-02-15'
    },
    {
      id: 2,
      proposedActivity: 'Execute analytical method transfer protocol and perform column comparability testing.',
      department: 'Quality Control',
      section: 'Finished Product Testing',
      responsibility: 'Anita Desai',
      targetClosureDate: '2026-02-28'
    },
    {
      id: 3,
      proposedActivity: 'Conduct analyst training and update analytical test logbooks in the laboratory.',
      department: 'Quality Control',
      section: 'Finished Product Testing',
      responsibility: 'Anita Desai',
      targetClosureDate: '2026-03-10'
    }
  ];

  addImplementationRow(index?: number): void {
    const newRow: ImplementationActivityRow = {
      id: Date.now(),
      proposedActivity: '',
      department: '',
      section: '',
      responsibility: '',
      targetClosureDate: ''
    };
    if (typeof index === 'number' && index >= 0) {
      this.implementationActivities.splice(index + 1, 0, newRow);
    } else {
      this.implementationActivities.push(newRow);
    }
  }

  deleteImplementationRow(index: number): void {
    if (this.implementationActivities.length > 1) {
      this.implementationActivities.splice(index, 1);
    }
  }

  implementationSummary: string = 'All analytical development and transfer activities completed successfully. Regulatory submission in progress.';
  implementedBy: string = 'Dr. Sarah Jenkins';
  implementedSigned: boolean = true;
  implementedSignedDate: string = '2026-03-15';

  // Implementation Workflow table (Implemented By)
  implementationWorkflowRows: InitiationWorkflowRow[] = [
    {
      workflow: 'Implemented By',
      department: 'Analytical R&D',
      section: 'AD',
      signed: true,
      signedDate: '2026-03-15'
    }
  ];

  // ==========================================
  // TAB 4: EXTENSION FIELDS  
  // ==========================================
  extensions: ExtensionItem[] = [
    {
      id: 1,
      comments: 'Delay in vendor column delivery due to international customs clearance. Requesting 30 days extension.',
      targetDate: '15-04-2026',
      department: 'Analytical R&D',
      hod: 'Dr. Sarah Jenkins',
      signed: true,
      signedDate: '20-03-2026'
    },
    {
      id: 2,
      comments: 'Additional stability testing data required by QA before final validation sign-off.',
      targetDate: '30-04-2026',
      department: 'Quality Control',
      hod: 'Anita Desai',
      signed: true,
      signedDate: '25-03-2026'
    }
  ];

  // ==========================================
  // TAB 5: EVIDENCE FIELDS
  // ==========================================
  evidenceDocTitle: string = '';
  evidenceDocDescription: string = '';
  evidenceDocReference: string = '';
  editingFileName: string = '';
  editingFileSize: string = '';
  isEditingEvidence: boolean = false;
  editingEvidenceId: number | null = null;
  isDraggingEvidence: boolean = false;
  uploadedEvidenceFiles: File[] = [];

  evidenceList: EvidenceItem[] = [
    {
      id: 1,
      docTitle: 'HPLC Column Validation Report',
      docDescription: 'Comparability study report verifying peak separation on 3 consecutive validation batches.',
      docReference: 'DOC-VAL-2026-089',
      fileName: 'HPLC_Column_Comparability_Validation_Report_v1.0.pdf',
      fileSize: '3.4 MB',
      uploadedBy: 'Dr. Sarah Jenkins',
      uploadDate: '2026-02-19'
    },
    {
      id: 2,
      docTitle: 'Approved SOP QC-042 Revision 3',
      docDescription: 'Final QA approved standard operating procedure with revised chromatographic column specifications.',
      docReference: 'SOP-QC-042-REV3',
      fileName: 'Approved_SOP_QC_042_Revision_03.pdf',
      fileSize: '1.2 MB',
      uploadedBy: 'Anita Desai',
      uploadDate: '2026-02-25'
    },
    {
      id: 3,
      docTitle: 'QC Analyst Training Attendance & Assessment',
      docDescription: 'Training sign-off sheet and qualification matrix for laboratory analysts.',
      docReference: 'TRN-2026-014',
      fileName: 'QC_Analyst_Training_Attendance_and_Assessment.pdf',
      fileSize: '850 KB',
      uploadedBy: 'Anita Desai',
      uploadDate: '2026-03-02'
    },
    {
      id: 4,
      docTitle: 'Vendor CoA & Column Batch Certificates',
      docDescription: 'Manufacturer certificate of analysis and lot release criteria for C18 3.5um columns.',
      docReference: 'VND-COA-2026-441',
      fileName: 'Vendor_CoA_and_Column_Batch_Certificates.pdf',
      fileSize: '2.1 MB',
      uploadedBy: 'Robert Johnson',
      uploadDate: '2026-03-14'
    }
  ];

  // ==========================================
  // TAB 6: CLOSURE FIELDS
  // ==========================================
  closureCheckpoints: ClosureCheckpointRow[] = [
    {
      id: 1,
      action: 'Implementation activities executed as per approved plan and timeline',
      yes: true,
      no: false,
      na: false
    },
    {
      id: 2,
      action: 'Revised standard operating procedures (SOPs), STPs, and specifications approved & effective',
      yes: true,
      no: false,
      na: false
    },
    {
      id: 3,
      action: 'Personnel training completed and relevant training records documented',
      yes: true,
      no: false,
      na: false
    },
    {
      id: 4,
      action: 'Supporting validation / analytical qualification reports reviewed and approved',
      yes: true,
      no: false,
      na: false
    },
    {
      id: 5,
      action: 'Regulatory notification / customer communication completed (if applicable)',
      yes: true,
      no: false,
      na: false
    },
    {
      id: 6,
      action: 'Post-implementation effectiveness evaluation criteria defined and scheduled',
      yes: true,
      no: false,
      na: false
    }
  ];

  closureRemarks: string = 'All implementation actions, analytical validations, and documentation revisions have been verified and closed satisfactorily.';

  closureWorkflowRows: ClosureWorkflowRow[] = [
    {
      workflow: 'Reviewed By',
      department: 'Quality Assurance',
      section: 'QA Compliance',
      responsibility: 'Priya Sharma',
      signed: true,
      signedDate: '2026-03-24'
    },
    {
      workflow: 'Closed By',
      department: 'Quality Assurance',
      section: 'QA Compliance',
      responsibility: 'Dr. Sarah Jenkins',
      signed: true,
      signedDate: '2026-03-25'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  openAddExtensionModal(): void {
    const dialogRef = this.dialog.open(AddExtensionComponent, {
      width: '750px',
      minWidth: '550px',
      data: {
        mode: 'add',
        departments: this.departments,
        users: this.users
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.extensions.unshift({
          id: Date.now(),
          comments: result.comments,
          targetDate: this.formatToDdMmYyyy(result.targetDate),
          department: result.department,
          hod: result.hod,
          signed: !!result.signed,
          signedDate: this.formatToDdMmYyyy(result.signedDate)
        });
      }
    });
  }

  openEditExtensionModal(ext: ExtensionItem): void {
    const dialogRef = this.dialog.open(AddExtensionComponent, {
      width: '750px',
      minWidth: '550px',
      data: {
        mode: 'edit',
        extension: { ...ext },
        departments: this.departments,
        users: this.users
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        ext.comments = result.comments;
        ext.targetDate = this.formatToDdMmYyyy(result.targetDate);
        ext.department = result.department;
        ext.hod = result.hod;
        ext.signed = !!result.signed;
        ext.signedDate = this.formatToDdMmYyyy(result.signedDate);
      }
    });
  }

  deleteExtension(ext: ExtensionItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.extensions = this.extensions.filter(item => item !== ext);
      }
    });
  }

  // ==========================================
  // TAB 7: AMENDMENT FIELDS & ACTIONS
  // ==========================================
  amendmentList: AmendmentItem[] = [
    {
      id: 1,
      ccfNo: 'CCF-2026-001',
      amendmentDate: '10-02-2026',
      docTitle: 'Analytical Method Validation Protocol for Assay Test',
      docNo: 'DOC-QC-2026-042',
      amendmentStatus: 'Approved',
      department: 'Analytical R&D',
      responsibility: 'Dr. Sarah Jenkins',
      signed: true,
      signedDate: '12-02-2026'
    },
    {
      id: 2,
      ccfNo: 'CCF-2026-002',
      amendmentDate: '18-02-2026',
      docTitle: 'Finished Product Specification Revision 3.5um Column',
      docNo: 'DOC-QA-2026-118',
      amendmentStatus: 'Approved',
      department: 'Quality Assurance',
      responsibility: 'Michael Chang',
      signed: true,
      signedDate: '20-02-2026'
    }
  ];

  navigateToAddAmmendment(): void {
    this.router.navigate(['/projects/dashboard/change-control/add-ammendment'], {
      queryParams: {
        ccfNo: this.changeControlNumber || 'CCN-2026-001',
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  editAmendment(row: AmendmentItem): void {
    this.router.navigate(['/projects/dashboard/change-control/add-ammendment'], {
      queryParams: {
        ccfNo: row.ccfNo,
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  deleteAmendment(row: AmendmentItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.amendmentList = this.amendmentList.filter(item => item !== row);
      }
    });
  }

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

      if (params['tab'] && params['tab'] !== 'amendment') {
        this.activeTab = params['tab'];
      } else {
        this.activeTab = 'initiation';
      }

      if (params['ccn']) {
        this.changeControlNumber = params['ccn'];
        this.loadChangeControlData(params['ccn']);
      }

      try {
        const saved = localStorage.getItem('change_control_' + this.changeControlNumber);
        if (saved) {
          this.restoreFromSnapshot(saved);
        }
      } catch (e) {}

      this.savedSnapshot = this.getSnapshot();
      this.isDirty = false;
    });
  }

  loadChangeControlData(ccn: string): void {
    this.changeControlNumber = ccn;

    // Load custom attributes based on CCN passed from ProjectChangeControlComponent
    if (ccn === 'CCN-2026-001') {
      this.initiationDepartment = 'Analytical R&D';
      this.initiatedBy = 'Dr. Sarah Jenkins';
      this.initiationDate = '2026-01-15';
      this.permanentChangeControl = true;
      this.regulatoryImpact = true;
      this.market = 'US';
      this.selectedCategories = ['Major'];
      this.signInitiatedBy = 'Dr. Sarah Jenkins';
      this.reviewedBy = 'Priya Sharma';
    } else if (ccn === 'CCN-2026-002') {
      this.initiationDepartment = 'Formulation R&D';
      this.initiatedBy = 'Alex Rivera';
      this.initiationDate = '2026-01-28';
      this.permanentChangeControl = false;
      this.regulatoryImpact = false;
      this.market = 'EU';
      this.selectedCategories = ['Minor'];
      this.signInitiatedBy = 'Alex Rivera';
      this.reviewedBy = 'Dr. Sarah Jenkins';
    } else if (ccn === 'CCN-2026-003') {
      this.initiationDepartment = 'Quality Assurance';
      this.initiatedBy = 'Priya Sharma';
      this.initiationDate = '2026-02-10';
      this.permanentChangeControl = true;
      this.regulatoryImpact = true;
      this.market = 'India';
      this.selectedCategories = ['Critical'];
      this.signInitiatedBy = 'Priya Sharma';
      this.reviewedBy = 'Michael Chang';
    } else if (ccn === 'CCN-2026-004') {
      this.initiationDepartment = 'Regulatory Affairs';
      this.initiatedBy = 'Michael Chang';
      this.initiationDate = '2026-02-22';
      this.permanentChangeControl = true;
      this.regulatoryImpact = true;
      this.market = 'US';
      this.selectedCategories = ['Major'];
      this.signInitiatedBy = 'Michael Chang';
      this.reviewedBy = 'Priya Sharma';
    } else if (ccn === 'CCN-2026-005') {
      this.initiationDepartment = 'Production';
      this.initiatedBy = 'Emily Watson';
      this.initiationDate = '2026-03-05';
      this.permanentChangeControl = false;
      this.regulatoryImpact = false;
      this.market = 'Global';
      this.selectedCategories = ['Minor'];
      this.signInitiatedBy = 'Emily Watson';
      this.reviewedBy = 'Alex Rivera';
    } else if (ccn === 'CCN-2026-006') {
      this.initiationDepartment = 'Packaging & Development';
      this.initiatedBy = 'David Kim';
      this.initiationDate = '2026-03-18';
      this.permanentChangeControl = true;
      this.regulatoryImpact = true;
      this.market = 'EU';
      this.selectedCategories = ['Major'];
      this.signInitiatedBy = 'David Kim';
      this.reviewedBy = 'Priya Sharma';
    } else if (ccn === 'CCN-2026-007') {
      this.initiationDepartment = 'Quality Control';
      this.initiatedBy = 'Anita Desai';
      this.initiationDate = '2026-04-02';
      this.permanentChangeControl = false;
      this.regulatoryImpact = false;
      this.market = 'ROW';
      this.selectedCategories = ['Minor'];
      this.signInitiatedBy = 'Anita Desai';
      this.reviewedBy = 'Robert Johnson';
    } else if (ccn === 'CCN-2026-008') {
      this.initiationDepartment = 'Analytical R&D';
      this.initiatedBy = 'Robert Johnson';
      this.initiationDate = '2026-04-14';
      this.permanentChangeControl = true;
      this.regulatoryImpact = true;
      this.market = 'Canada';
      this.selectedCategories = ['Major'];
      this.signInitiatedBy = 'Robert Johnson';
      this.reviewedBy = 'Dr. Sarah Jenkins';
    }
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

  // ==========================================
  // TAB 5: EVIDENCE METHODS
  // ==========================================
  onEditEvidence(item: EvidenceItem): void {
    this.isEditingEvidence = true;
    this.editingEvidenceId = item.id;
    this.evidenceDocTitle = item.docTitle;
    this.evidenceDocDescription = '';
    this.evidenceDocReference = item.docReference;
    this.editingFileName = item.fileName || '';
    this.editingFileSize = item.fileSize || '';
    this.uploadedEvidenceFiles = [];
  }

  onSaveEvidence(): void {
    if (!this.evidenceDocTitle.trim()) {
      return;
    }

    const newFileName = this.uploadedEvidenceFiles.length > 0
      ? this.uploadedEvidenceFiles[0].name
      : (this.editingFileName || this.evidenceDocTitle.trim().replace(/\s+/g, '_') + '.pdf');

    const newFileSize = this.uploadedEvidenceFiles.length > 0
      ? (this.uploadedEvidenceFiles[0].size / (1024 * 1024)).toFixed(1) + ' MB'
      : (this.editingFileSize || '1.4 MB');

    if (this.isEditingEvidence && this.editingEvidenceId !== null) {
      const existing = this.evidenceList.find(e => e.id === this.editingEvidenceId);
      if (existing) {
        existing.docTitle = this.evidenceDocTitle.trim();
        existing.docDescription = '';
        existing.docReference = this.evidenceDocReference.trim();
        existing.fileName = newFileName;
        existing.fileSize = newFileSize;
      }
    } else {
      const newItem: EvidenceItem = {
        id: Date.now(),
        docTitle: this.evidenceDocTitle.trim(),
        docDescription: '',
        docReference: this.evidenceDocReference.trim(),
        fileName: newFileName,
        fileSize: newFileSize,
        uploadedBy: this.signInitiatedBy || 'Dr. Sarah Jenkins',
        uploadDate: new Date().toISOString().substring(0, 10)
      };
      this.evidenceList.unshift(newItem);
    }

    this.onCancelEvidence();
  }

  onCancelEvidence(): void {
    this.isEditingEvidence = false;
    this.editingEvidenceId = null;
    this.evidenceDocTitle = '';
    this.evidenceDocDescription = '';
    this.evidenceDocReference = '';
    this.editingFileName = '';
    this.editingFileSize = '';
    this.uploadedEvidenceFiles = [];
  }

  onDeleteEvidence(item: EvidenceItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.evidenceList = this.evidenceList.filter(e => e.id !== item.id);
        if (this.editingEvidenceId === item.id) {
          this.onCancelEvidence();
        }
      }
    });
  }

  onViewEvidence(item: EvidenceItem): void {
    window.open('/sample.pdf', '_blank');
  }

  onEvidenceFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingEvidence = false;
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.uploadedEvidenceFiles.push(event.dataTransfer.files[i]);
      }
    }
  }

  onEvidenceFileSelected(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploadedEvidenceFiles.push(event.target.files[i]);
      }
    }
  }

  removeUploadedEvidenceFile(idx: number): void {
    this.uploadedEvidenceFiles.splice(idx, 1);
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

  setClosureChoice(item: ClosureCheckpointRow, choice: 'yes' | 'no' | 'na'): void {
    if (choice === 'yes') {
      item.yes = !item.yes;
      if (item.yes) {
        item.no = false;
        item.na = false;
      }
    } else if (choice === 'no') {
      item.no = !item.no;
      if (item.no) {
        item.yes = false;
        item.na = false;
      }
    } else if (choice === 'na') {
      item.na = !item.na;
      if (item.na) {
        item.yes = false;
        item.no = false;
      }
    }
  }

  ngDoCheck(): void {
    if (this.savedSnapshot) {
      this.isDirty = this.getSnapshot() !== this.savedSnapshot;
    }
  }

  // --- Scrolling logic (Reference from ProjectStagesComponent) ---
  scrollLeft(): void {
    if (this.activeTab === 'implementation' && this.implementationScrollContainer) {
      this.implementationScrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    } else if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.activeTab === 'implementation' && this.implementationScrollContainer) {
      this.implementationScrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    } else if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollImplementationLeft(): void {
    if (this.implementationScrollContainer) {
      this.implementationScrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollImplementationRight(): void {
    if (this.implementationScrollContainer) {
      this.implementationScrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  onOtherSpecifyInput(event?: Event): void {
    if (this.categoryOptions.otherSpecify && this.categoryOptions.otherSpecify.trim().length > 0) {
      this.categoryOptions.other = true;
    }
  }

  private getSnapshot(): string {
    return JSON.stringify({
      changeControlNumber: this.changeControlNumber,
      initiationDepartment: this.initiationDepartment,
      initiatedBy: this.initiatedBy,
      initiationDate: this.initiationDate,
      permanentChangeControl: this.permanentChangeControl,
      regulatoryImpact: this.regulatoryImpact,
      market: this.market,
      selectedCategories: this.selectedCategories,
      categoryOptions: this.categoryOptions,
      existingProcedure: this.existingProcedure,
      proposedChange: this.proposedChange,
      reasonForProposedChange: this.reasonForProposedChange,
      initiationWorkflowRows: this.initiationWorkflowRows,
      signInitiatedBy: this.signInitiatedBy,
      signInitiatedSigned: this.signInitiatedSigned,
      signInitiatedDate: this.signInitiatedDate,
      reviewedBy: this.reviewedBy,
      reviewedSigned: this.reviewedSigned,
      reviewedDate: this.reviewedDate,
      initiationComments: this.initiationComments,
      activityGrid: this.activityGrid,
      assessmentComments: this.assessmentComments,
      assessmentWorkflowRows: this.assessmentWorkflowRows,
      departmentAssessments: this.departmentAssessments,
      implementationActivities: this.implementationActivities,
      extensions: this.extensions,
      evidenceList: this.evidenceList,
      closureCheckpoints: this.closureCheckpoints,
      closureWorkflowRows: this.closureWorkflowRows,
      amendmentList: this.amendmentList
    });
  }

  private restoreFromSnapshot(snapshot: string): void {
    if (!snapshot) return;
    try {
      const data = JSON.parse(snapshot);
      Object.keys(data).forEach(key => {
        (this as any)[key] = data[key];
      });
    } catch (e) {
      console.error('Error restoring snapshot', e);
    }
  }

  save(): void {
    try {
      localStorage.setItem('change_control_' + this.changeControlNumber, this.getSnapshot());
    } catch (e) {
      // storage error
    }
    this.savedSnapshot = this.getSnapshot();
    this.isDirty = false;
  }

  discardChanges(): void {
    if (!this.isDirty) {
      this.goBack();
      return;
    }
    if (!confirm('Discard all unsaved changes and return to the last saved state?')) {
      return;
    }
    this.restoreFromSnapshot(this.savedSnapshot);
    this.isDirty = false;
  }

  downloadPdf(): void {
    if (this.isDirty) {
      const choice = confirm(
        'You have unsaved changes. Save before generating the PDF?\n\nChoose OK to save and continue, or Cancel to review your changes.'
      );
      if (!choice) return;
      this.save();
    }
    window.print();
  }

  downloadSignedPdf(tabContext?: 'assessment' | 'closure'): void {
    if (this.isDirty) {
      const choice = confirm(
        'You have unsaved changes. Save before generating the PDF?\n\nChoose OK to save and continue, or Cancel to review your changes.'
      );
      if (!choice) return;
      this.save();
    }

     
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/change-control'], {
      queryParams: { mode: null, ccn: null, tab: null },
      queryParamsHandling: 'merge'
    });
  }
}
