import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  addStudyDocument,
  appendStudyHistory,
  getStudyDocuments,
  getTodayInVivoDisplay,
  InVivoStudyItem,
  StudyDocumentItem
} from '../in-vivo-studies.data';
import { AddDocumentComponent } from './add-document/add-document.component';
import { OpenDocumentComponent, OpenDocumentDialogData } from './open-document/open-document.component';

export interface StudyDocumentsUpdateEvent {
  documents: StudyDocumentItem[];
  lastUpdated: string;
}

@Component({
  selector: 'app-study-documents',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './study-documents.component.html',
  styleUrl: './study-documents.component.scss'
})
export class StudyDocumentsComponent {
  private readonly dialog = inject(MatDialog);

  @Input() study?: InVivoStudyItem;
  @Output() documentsUpdated = new EventEmitter<StudyDocumentsUpdateEvent>();

  get documents(): StudyDocumentItem[] {
    return this.study ? getStudyDocuments(this.study) : [];
  }

  openAddDocumentDialog(): void {
    if (!this.study) return;

    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '780px',
      maxWidth: '95vw',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((payload?: Omit<StudyDocumentItem, 'id'> | null) => {
      if (!payload || !this.study) return;
      const updated = addStudyDocument(this.study.studyId, payload);
      appendStudyHistory({
        studyId: this.study.studyId,
        field: 'Document linked',
        previousValue: '',
        newValue: `${payload.type} · ${payload.ref}`
      });

      this.documentsUpdated.emit({
        documents: updated,
        lastUpdated: getTodayInVivoDisplay()
      });
    });
  }

  openDocument(doc: StudyDocumentItem): void {
    const dialogData: OpenDocumentDialogData = { document: doc };
    this.dialog.open(OpenDocumentComponent, {
      width: '620px',
      maxWidth: '95vw',
      autoFocus: false,
      data: dialogData
    });
  }
}
