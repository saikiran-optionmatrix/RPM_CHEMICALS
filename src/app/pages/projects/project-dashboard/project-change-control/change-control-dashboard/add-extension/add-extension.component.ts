import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-extension',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './add-extension.component.html',
  styleUrl: './add-extension.component.scss',
})
export class AddExtensionComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  departments: string[] = [
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddExtensionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      comments: ['', [Validators.required]],
      targetDate: ['', [Validators.required]],
      department: ['', [Validators.required]],
      hod: ['', [Validators.required]],
      signed: [false],
      signedDate: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = this.data.mode === 'edit';
      if (this.data.departments && this.data.departments.length > 0) {
        this.departments = this.data.departments;
      }
      if (this.data.users && this.data.users.length > 0) {
        this.users = this.data.users;
      }

      if (this.data.extension) {
        this.form.patchValue({
          comments: this.data.extension.comments || '',
          targetDate: this.formatToYyyyMmDd(this.data.extension.targetDate) || '',
          department: this.data.extension.department || '',
          hod: this.data.extension.hod || '',
          signed: !!this.data.extension.signed,
          signedDate: this.formatToYyyyMmDd(this.data.extension.signedDate) || '',
        });
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
    this.isSubmitting = true;
    if (this.form.invalid) {
      return;
    }

    const val = { ...this.form.value };
    val.targetDate = this.formatToDdMmYyyy(val.targetDate);
    val.signedDate = this.formatToDdMmYyyy(val.signedDate);
    this.dialogRef.close(val);
  }

  close(): void {
    this.dialogRef.close();
  }
}
