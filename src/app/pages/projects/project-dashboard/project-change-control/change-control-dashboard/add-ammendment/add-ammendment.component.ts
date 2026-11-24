import { Component, OnInit, DoCheck } from '@angular/core';
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

export interface AmendmentWorkflowRow {
  workflow: string;
  department: string;
  section: string;
  responsibility: string;
  signed: boolean;
  signedDate: string;
}

export interface DepartmentRemarkRow {
  id: number;
  department: string;
  remarks: string;
}

@Component({
  selector: 'app-add-ammendment',
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
  templateUrl: './add-ammendment.component.html',
  styleUrl: './add-ammendment.component.scss',
})
export class AddAmmendmentComponent implements OnInit, DoCheck {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';
  ccfNo: string = 'CCN-2026-001';
  amendmentDate: string = new Date().toISOString().substring(0, 10);

  isDirty: boolean = false;
  private savedSnapshot: string = '';

  // Form Fields
  docTitle: string = '';
  docNo: string = '';
  descriptionExisting: string = '';
  descriptionProposed: string = '';
  justificationProposed: string = '';

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

  // Workflow Table (3 rows: Initiated by, Approved by, Approved by with different section)
  workflowRows: AmendmentWorkflowRow[] = [
    {
      workflow: 'Initiated By',
      department: 'R&D',
      section: 'AD',
      responsibility: 'Dr. Sarah Jenkins',
      signed: true,
      signedDate: new Date().toISOString().substring(0, 10)
    },
    {
      workflow: 'Approved By',
      department: 'Quality Assurance',
      section: 'DQ',
      responsibility: 'Priya Sharma',
      signed: false,
      signedDate: ''
    },
    {
      workflow: 'Approved By',
      department: 'Regulatory Affairs',
      section: 'RA',
      responsibility: 'Robert Johnson',
      signed: false,
      signedDate: ''
    }
  ];

  // Remarks Grid (S.No, Department, Enter Remarks, Actions)
  remarksRows: DepartmentRemarkRow[] = [
    {
      id: 1,
      department: 'Quality Control',
      remarks: 'Sample batch validation report required before final column change verification.'
    },
    {
      id: 2,
      department: 'Production',
      remarks: 'No impact observed on bulk manufacturing timeline.'
    }
  ];

  // Amendment Comments (2 lines height, full width)
  amendmentComments: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      }
      if (params['ccfNo']) {
        this.ccfNo = params['ccfNo'];
      } else if (params['ccn']) {
        this.ccfNo = params['ccn'];
      }
      if (params['amendmentDate']) {
        this.amendmentDate = this.formatToYyyyMmDd(params['amendmentDate']);
      }
      if (params['docTitle']) {
        this.docTitle = params['docTitle'];
      }
      if (params['docNo']) {
        this.docNo = params['docNo'];
      }

      this.savedSnapshot = this.getSnapshot();
      this.isDirty = false;
    });
  }

  ngDoCheck(): void {
    if (this.savedSnapshot) {
      this.isDirty = this.getSnapshot() !== this.savedSnapshot;
    }
  }

  private getSnapshot(): string {
    return JSON.stringify({
      projectName: this.projectName,
      projectCode: this.projectCode,
      ccfNo: this.ccfNo,
      amendmentDate: this.amendmentDate,
      docTitle: this.docTitle,
      docNo: this.docNo,
      descriptionExisting: this.descriptionExisting,
      descriptionProposed: this.descriptionProposed,
      justificationProposed: this.justificationProposed,
      workflowRows: this.workflowRows,
      remarksRows: this.remarksRows,
      amendmentComments: this.amendmentComments
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

  addRemarksRow(): void {
    this.remarksRows.push({
      id: Date.now(),
      department: 'R&D',
      remarks: ''
    });
  }

  deleteRemarksRow(index: number): void {
    this.remarksRows.splice(index, 1);
  }

  goBack(): void {
    if (this.route.snapshot.queryParams['from'] === 'monitor') {
      this.router.navigate(['/monitor-new/change-control/cc-dashboard'], {
        queryParams: {
          ccn: this.ccfNo,
          projectName: this.projectName,
          projectCode: this.projectCode,
          tab: 'amendment'
        }
      });
      return;
    }
    this.router.navigate(['/projects/dashboard/change-control/details'], {
      queryParams: {
        ccn: this.ccfNo,
        projectName: this.projectName,
        projectCode: this.projectCode,
        tab: 'initiation'
      }
    });
  }

  save(): void {
    this.saveAmendment();
  }

  saveAmendment(): void {
    this.savedSnapshot = this.getSnapshot();
    this.isDirty = false;
    this.goBack();
  }

  discardChanges(): void {
    if (!this.isDirty) {
      this.goBack();
      return;
    }
    if (!confirm('Discard all unsaved changes and return to previous state?')) {
      return;
    }
    this.restoreFromSnapshot(this.savedSnapshot);
    this.isDirty = false;
    this.goBack();
  }
}
