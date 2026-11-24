import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  formatInVivoDate,
  IN_VIVO_DOCUMENT_TYPES,
  StudyDocumentItem,
  StudyDocumentType
} from '../../in-vivo-studies.data';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatSelectModule],
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.scss'
})
export class AddDocumentComponent {
  readonly form: FormGroup;
  readonly documentTypes = IN_VIVO_DOCUMENT_TYPES;
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<AddDocumentComponent>
  ) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      ref: ['', Validators.required],
      version: [''],
      date: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  close(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value as {
      type: StudyDocumentType;
      title: string;
      ref: string;
      version: string;
      date: string;
    };

    const payload: Omit<StudyDocumentItem, 'id'> = {
      type: v.type,
      title: (v.title || '').trim(),
      ref: (v.ref || '').trim(),
      version: (v.version || '').trim(),
      date: v.date ? formatInVivoDate(v.date) : ''
    };

    this.dialogRef.close(payload);
  }
}

