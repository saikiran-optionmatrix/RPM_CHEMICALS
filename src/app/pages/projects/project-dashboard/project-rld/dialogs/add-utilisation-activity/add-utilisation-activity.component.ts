import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComputedComparator, UtilisationRequirement } from '../../models/rld.models';

export interface AddUtilisationData {
  mode: 'add' | 'edit';
  requirement?: UtilisationRequirement;
  comparators: ComputedComparator[];
}

@Component({
  selector: 'app-add-utilisation-activity',
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
  templateUrl: './add-utilisation-activity.component.html',
  styleUrls: ['./add-utilisation-activity.component.scss']
})
export class AddUtilisationActivityComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  comparators: ComputedComparator[] = [];

  wbsOptions = [
    { code: '4.2.1', name: 'RMP/RLD Physical Characterization', gate: 'G3 – Prototype development' },
    { code: '4.2.2', name: 'RMP/RLD Chemical Characterization', gate: 'G3 – Prototype development' },
    { code: '4.2.3', name: 'RMP/RLD Packing Characterization', gate: 'G3 – Prototype development' },
    { code: '4.4.2', name: 'Prototype development – viscosity & release', gate: 'G3 – Prototype development' },
    { code: '4.4.3', name: 'Comparative stability – reference arm (6 months)', gate: 'G3 – Prototype development' },
    { code: '4.4.4', name: 'Dissolution mapping with innovator product', gate: 'G3 – Prototype development' },
    { code: '4.4.6', name: 'Multimedia dissolution mapping with reference product', gate: 'G3 – Prototype development' },
    { code: '4.4.12', name: 'Reverse Engineering of Reference Product', gate: 'G3 – Prototype development' },
    { code: '5.5.1', name: 'Pilot BE – reference arm & retention', gate: 'G4 – Scale-up & Pilot BE' },
    { code: '10.1.2', name: 'Demonstration-Scale Campaign execution', gate: 'G5 – Demonstration-Scale Campaign & Submission' }
  ];

  categories = ['R&D', 'PE', 'BE'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUtilisationActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUtilisationData
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.comparators = this.data.comparators;
    const r = this.data.requirement;

    this.form = this.fb.group({
      id: [r?.id || ''],
      c: [r?.c || (this.comparators[0]?.id || ''), Validators.required],
      wbs: [r?.wbs || '4.2.1', Validators.required],
      act: [r?.act || 'RMP/RLD Physical Characterization', Validators.required],
      cat: [r?.cat || 'PE', Validators.required],
      basis: [r?.basis || '3 lots × 30 units', Validators.required],
      base: [r?.base || 90, [Validators.required, Validators.min(1)]],
      buf: [r?.buf ? Math.round(r.buf * 100) : 0, [Validators.min(0), Validators.max(100)]],
      bufBy: [r?.bufBy || ''],
      need: [r?.need || '2026-11-20', Validators.required],
      use: [r?.use || 2, [Validators.required, Validators.min(1)]],
      owner: [r?.owner || 'ARD Lead', Validators.required],
      gate: [r?.gate || 'G3 – Prototype development', Validators.required],
      proc: [r?.proc || 'PR-01']
    });

    this.form.get('wbs')?.valueChanges.subscribe((wbsCode) => {
      const match = this.wbsOptions.find((w) => w.code === wbsCode);
      if (match) {
        this.form.patchValue({
          act: match.name,
          gate: match.gate
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    const req: UtilisationRequirement = {
      ...val,
      buf: (val.buf || 0) / 100
    };
    this.dialogRef.close(req);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

