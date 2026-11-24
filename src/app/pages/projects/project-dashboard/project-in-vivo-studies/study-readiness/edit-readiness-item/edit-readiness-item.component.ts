import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  formatInVivoDate,
  IN_VIVO_READINESS_STATUS_OPTIONS,
  ReadinessCardData,
  ReadinessFieldEntry,
  ReadinessStatus,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditReadinessItemDialogData {
  studyId: string;
  title: string;
  card: ReadinessCardData;
}

export interface ReadinessFormFieldMeta {
  key: string;
  label: string;
  isDate: boolean;
}

@Component({
  selector: 'app-edit-readiness-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './edit-readiness-item.component.html',
  styleUrl: './edit-readiness-item.component.scss'
})
export class EditReadinessItemComponent implements OnInit {
  readinessForm: FormGroup;
  isSubmitting = false;

  readonly statusOptions: readonly ReadinessStatus[] = IN_VIVO_READINESS_STATUS_OPTIONS;
  fieldMetas: ReadinessFormFieldMeta[] = [];

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditReadinessItemComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditReadinessItemDialogData | null
  ) {
    this.readinessForm = this.fb.group({
      status: ['Not started' as ReadinessStatus, Validators.required]
    });
  }

  get f() {
    return this.readinessForm.controls;
  }

  ngOnInit(): void {
    const card = this.data?.card;
    if (!card) return;

    this.readinessForm.patchValue({ status: card.status || 'Not started' });
    this.fieldMetas = card.fields.map((entry, idx) => {
      const key = `field_${idx}`;
      const isDate = /date$/i.test(entry.label);
      const initialVal = isDate ? toIsoDateString(entry.value) : entry.value || '';
      this.readinessForm.addControl(key, new FormControl(initialVal));
      return { key, label: entry.label, isDate };
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.readinessForm.markAllAsTouched();
    if (this.readinessForm.invalid || !this.data) {
      return;
    }

    const v = this.readinessForm.value;
    const fields: ReadinessFieldEntry[] = this.fieldMetas.map(meta => {
      const raw = String(v[meta.key] || '').trim();
      return {
        label: meta.label,
        value: meta.isDate ? formatInVivoDate(raw) : raw
      };
    });

    const result: ReadinessCardData = {
      status: v.status as ReadinessStatus,
      fields
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

