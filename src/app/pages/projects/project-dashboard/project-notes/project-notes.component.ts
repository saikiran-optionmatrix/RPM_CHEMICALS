import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface NoteData {
  actions: string;
  date: string;
  postedBy: string;
  message: string;
  document: string;
  tags: string;
  updatedDate?: string;
  updatedBy?: string;
  historyCount?: number;
}

@Component({
  selector: 'app-project-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  templateUrl: './project-notes.component.html',
  styleUrl: './project-notes.component.scss'
})
export class ProjectNotesComponent implements OnInit {
  @ViewChild('editNoteDialog') editNoteDialog!: TemplateRef<any>;

  displayedColumns: string[] = ['actions', 'date', 'postedBy', 'message', 'document', 'tags', 'updated', 'updatedBy', 'history'];
  notesList: NoteData[] = [];
  paginatedNotes: NoteData[] = [];

  readonly historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  pageSize: number = 10;
  currentPage: number = 0;

  selectedTag: string = '';
  noteText: string = '';
  attachedDocument: string = '';
  availableTags: string[] = [];

  editingNote: NoteData | null = null;
  editSelectedTag: string = '';
  editNoteText: string = '';
  editDialogRef: any = null;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Notes';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
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
    this.loadTags();
    this.loadNotes();
  }

  loadTags(): void {
    const stored = localStorage.getItem('rpm_tags_chem_v1');
    let tagsList = [];
    if (stored) {
      tagsList = JSON.parse(stored);
    } else {
      tagsList = [
        { id: 1, name: 'Polymer R&D', isActive: true, description: 'Notes regarding core-shell emulsion synthesis and recipe optimization' },
        { id: 2, name: 'Process Safety (PHA)', isActive: true, description: 'Notes regarding RC1 reaction calorimetry, HAZOP and safety relief' },
        { id: 3, name: 'Raw Materials & Monomers', isActive: true, description: 'Notes regarding monomer sourcing, surfactant packages and supplier audits' },
        { id: 4, name: 'Pilot Plant Operations', isActive: true, description: 'Notes regarding 500L pilot campaign, filtration and agitation control' },
        { id: 5, name: 'Analytical QC', isActive: true, description: 'Notes regarding solids %, viscosity, GPC Mw and residual monomer VOC' },
        { id: 6, name: 'Regulatory (REACH/TSCA)', isActive: true, description: 'Notes regarding chemical substance registration and SDS compliance' }
      ];
      localStorage.setItem('rpm_tags_chem_v1', JSON.stringify(tagsList));
    }
    this.availableTags = tagsList.filter((t: any) => t.isActive).map((t: any) => t.name);
    if (this.availableTags.length > 0 && !this.selectedTag) {
      this.selectedTag = this.availableTags[0];
    }
  }

  loadNotes(): void {
    const stored = localStorage.getItem('rpm_notes_chem_v1');
    if (stored) {
      this.notesList = JSON.parse(stored);
    } else {
      this.notesList = [
        {
          actions: '',
          date: '06/05/2026',
          postedBy: 'Rajesh Kumar',
          message: 'Bulk monomer evaluation completed; dual-sourcing vendor qualification established with 2 qualified REACH suppliers.',
          document: 'Monomer Technical Specification.pdf',
          tags: 'Raw Materials & Monomers'
        },
        {
          actions: '',
          date: '06/12/2026',
          postedBy: 'Dr. Sarah Jenkins',
          message: 'Laboratory polymerization trial completed; core-shell acrylic emulsion achieved 50.2% solids with MFFT < 8°C.',
          document: 'Emulsion Polymerization Trial Report.pdf',
          tags: 'Polymer R&D'
        },
        {
          actions: '',
          date: '06/18/2026',
          postedBy: 'Amit Patel',
          message: 'RC1 reaction calorimetry conducted at 80°C isothermal conditions; max heat release within cooling jacket safety threshold.',
          document: 'RC1 Calorimetry Thermal Hazard Report.pdf',
          tags: 'Process Safety (PHA)'
        },
        {
          actions: '',
          date: '06/25/2026',
          postedBy: 'Ananya Rao',
          message: 'Post-polymerization steam stripping validated in 500L pilot reactor; residual free monomer reduced below 35 ppm.',
          document: 'Pilot Stripping & VOC Test Log.pdf',
          tags: 'Pilot Plant Operations'
        },
        {
          actions: '',
          date: '07/02/2026',
          postedBy: 'Vikram Nair',
          message: 'GPC molecular weight distribution and Brookfield rheology confirmed identical to commercial target benchmark resin.',
          document: 'Analytical Fingerprinting & GPC Analysis.pdf',
          tags: 'Analytical QC'
        },
        {
          actions: '',
          date: '07/10/2026',
          postedBy: 'Dr. Sarah Jenkins',
          message: 'IUCLID registration dossier for EU REACH (100-1000 tonne tier) finalized along with GHS Safety Data Sheet (SDS).',
          document: 'REACH Registration Dossier Package.pdf',
          tags: 'Regulatory (REACH/TSCA)'
        }
      ];
      localStorage.setItem('rpm_notes_chem_v1', JSON.stringify(this.notesList));
    }
    const defaultDates = ['2026-06-05', '2026-06-12', '2026-06-18', '2026-06-25', '2026-07-02', '2026-07-10'];
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'Rajesh Kumar', 'Amit Patel', 'Ananya Rao', 'Vikram Nair'];
    this.notesList.forEach((n, idx) => {
      if (!n.updatedDate) {
        n.updatedDate = defaultDates[idx % defaultDates.length];
      }
      if (!n.updatedBy) {
        n.updatedBy = n.postedBy || defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedNotes = this.notesList.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  addNote(): void {
    if (!this.selectedTag || !this.noteText.trim()) {
      return;
    }
    const now = new Date().toISOString().split('T')[0];
    const newNote: NoteData = {
      actions: '',
      date: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      postedBy: 'Dr. Sarah Jenkins',
      message: this.noteText.trim(),
      document: this.attachedDocument || '',
      tags: this.selectedTag,
      updatedDate: now,
      updatedBy: 'Dr. Sarah Jenkins'
    };
    this.notesList = [newNote, ...this.notesList];
    localStorage.setItem('rpm_notes_chem_v1', JSON.stringify(this.notesList));
    this.clearForm();
    this.updatePagination();
  }

  editNote(note: NoteData): void {
    this.editingNote = note;
    this.editSelectedTag = note.tags;
    this.editNoteText = note.message;
    this.editDialogRef = this.dialog.open(this.editNoteDialog, {
      width: '500px',
      maxWidth: '95vw'
    });
  }

  closeEditDialog(): void {
    if (this.editDialogRef) {
      this.editDialogRef.close();
      this.editDialogRef = null;
    }
    this.editingNote = null;
  }

  saveEditDialog(): void {
    if (!this.editSelectedTag || !this.editNoteText.trim()) {
      return;
    }
    if (this.editingNote) {
      this.editingNote.tags = this.editSelectedTag;
      this.editingNote.message = this.editNoteText.trim();
      this.editingNote.updatedDate = new Date().toISOString().split('T')[0];
      this.editingNote.updatedBy = 'Dr. Sarah Jenkins';
      localStorage.setItem('rpm_notes_chem_v1', JSON.stringify(this.notesList));
      this.updatePagination();
    }
    this.closeEditDialog();
  }

  deleteNote(note: NoteData): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this note?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.editingNote === note) {
          this.closeEditDialog();
        }
        this.notesList = this.notesList.filter(n => n !== note);
        localStorage.setItem('rpm_notes_chem_v1', JSON.stringify(this.notesList));
        this.updatePagination();
      }
    });
  }

  clearForm(): void {
    this.selectedTag = this.availableTags[0] || '';
    this.noteText = '';
    this.attachedDocument = '';
  }

  viewPdf(fileName: string): void {
    alert('Viewing document: ' + fileName);
  }

  downloadPdf(fileName: string): void {
    alert('Downloading document: ' + fileName);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/CHM/006", name: this.projectName || "Acrylic Emulsion Binder 50% Solids" }
    });
  }

  uploaddoc(value?: any): void {
    const dialogRef = this.dialog.open(UploadDocumentsComponent, {
      data: value,
      width: '500px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.fileName) {
        this.attachedDocument = result.fileName;
      }
    });
  }

  openHistory(note?: NoteData, index?: number): void {
    const historyCount = note?.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/projects/dashboard/notes/history'], {
      queryParams: {
        date: note?.date || '',
        postedBy: note?.postedBy || '',
        description: note?.message || '',
        document: note?.document || '',
        tags: note?.tags || '',
        historyCount: historyCount,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
