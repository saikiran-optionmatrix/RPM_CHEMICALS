import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComparatorItem, ProjectMaster } from '../../models/rld.models';

export interface AddRldComparatorData {
  mode: 'add' | 'edit';
  comparator?: ComparatorItem;
  project: ProjectMaster;
}

@Component({
  selector: 'app-add-rld-comparator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './add-rld-comparator.component.html',
  styleUrls: ['./add-rld-comparator.component.scss']
})
export class AddRldComparatorComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  project!: ProjectMaster;

  dosageForms = [
    'Film-coated tablet',
    'Tablet',
    'Powder for suspension for injection',
    'Solution for injection in PFS',
    'Solution for injection',
    'Hard capsule',
    'Capsule',
    'Oral Suspension'
  ];

  markets = ['Russia / EAEU', 'EU (DCP)', 'US (FDA)', 'UK (MHRA)', 'ROW'];
  idTypes = ['EU MA no.', 'NDA / NDC', 'National MA no.', 'ANDA', 'MA no.'];
  raStatuses = ['Approved', 'Pending', 'Rejected'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRldComparatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddRldComparatorData
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.project = this.data.project;
    const c = this.data.comparator;

    this.form = this.fb.group({
      id: [c?.id || '(auto)'],
      p: [this.project.code],
      brand: [c?.brand || '', Validators.required],
      mfr: [c?.mfr || '', Validators.required],
      mah: [c?.mah || '', Validators.required],
      mfgC: [c?.mfgC || 'Italy', Validators.required],
      form: [c?.form || 'Film-coated tablet', Validators.required],
      strength: [c?.strength || '', Validators.required],
      fill: [c?.fill || 'NA'],
      pack: [c?.pack || '', Validators.required],
      upp: [c?.upp || 1, [Validators.required, Validators.min(1)]],
      unit: [c?.unit || 'tablets', Validators.required],
      market: [c?.market || this.project.market || 'Russia / EAEU', Validators.required],
      purch: [c?.purch || 'Germany', Validators.required],
      pool: [c?.pool || `RP-${this.project.brand.toUpperCase()}-01`, Validators.required],
      idType: [c?.idType || 'EU MA no.', Validators.required],
      idNo: [c?.idNo || '', Validators.required],
      rld: [c?.rld || 'N/A'],
      rs: [c?.rs || 'N/A'],
      rmp: [c?.rmp || 'Yes'],
      evid: [c?.evid || 'EMA EPAR'],
      rims: [c?.rims || 'RIMS-RLD-001'],
      verOn: [c?.verOn || '2026-08-05'],
      verBy: [c?.verBy || 'RA Exec – EAEU'],
      ra: [c?.ra || 'Approved', Validators.required],
      raBy: [c?.raBy || 'RA Head'],
      raOn: [c?.raOn || '2026-08-08'],
      rem: [c?.rem || '']
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

