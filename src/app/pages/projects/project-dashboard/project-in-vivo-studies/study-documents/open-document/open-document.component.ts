import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StudyDocumentItem } from '../../in-vivo-studies.data';

export interface OpenDocumentDialogData {
  document: StudyDocumentItem;
}

@Component({
  selector: 'app-open-document',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './open-document.component.html',
  styleUrl: './open-document.component.scss'
})
export class OpenDocumentComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<OpenDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: OpenDocumentDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

