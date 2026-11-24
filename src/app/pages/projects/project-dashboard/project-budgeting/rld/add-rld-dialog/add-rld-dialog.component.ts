import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RldRow } from '../../models/budgeting.models';

@Component({
  selector: 'app-add-rld-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-rld-dialog.component.html',
  styleUrls: ['./add-rld-dialog.component.scss']
})
export class AddRldDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  wbsOptions: { label: string; value: string }[] = [
    { label: '3.1.2 — R&D and QC Reference Product', value: '3.1.2' },
    { label: '5.4.5 — BA-BE Study Packs', value: '5.4.5' }
  ];

  kindOptions: { label: string; value: string }[] = [
    { label: 'Batch / Product', value: 'b' },
    { label: 'Freight Charges', value: 'fr' },
    { label: 'Customs Duty', value: 'du' },
    { label: 'BA-BE Study Pack', value: 'be' }
  ];

  currencyOptions: string[] = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CHF'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode?: 'add' | 'edit'; row?: RldRow }
  ) {
    this.isEditMode = this.data?.mode === 'edit';

    const row = this.data?.row;
    this.form = this.fb.group({
      w: [row?.w || '3.1.2', [Validators.required]],
      k: [row?.k || 'b', [Validators.required]],
      b: [row?.b || '', [Validators.required]],
      c: [row?.c ?? 100, [Validators.min(0)]],
      d: [row?.d || 'USD', [Validators.required]],
      e: [row?.e ?? 400, [Validators.min(0)]],
      g: [row?.g ?? 96.5, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data?.row) {
      const r = this.data.row;
      this.form.patchValue({
        w: r.w || '3.1.2',
        k: r.k || 'b',
        b: r.b || '',
        c: r.c ?? null,
        d: r.d || 'USD',
        e: r.e ?? null,
        g: r.g ?? 96.5
      });
    }
  }

  get isBatchKind(): boolean {
    const k = this.form.get('k')?.value;
    return k === 'b' || k === 'be';
  }

  get calculatedUsd(): number {
    const k = this.form.get('k')?.value;
    if (k === 'b' || k === 'be') {
      const packs = Number(this.form.get('c')?.value) || 0;
      const fob = Number(this.form.get('e')?.value) || 0;
      return packs * fob;
    }
    const fob = Number(this.form.get('e')?.value) || 0;
    return fob;
  }

  get calculatedInr(): number {
    const fx = Number(this.form.get('g')?.value) || 96.5;
    return this.calculatedUsd * fx;
  }

  save(): void {
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const packs = v.c !== null && v.c !== '' ? Number(v.c) : undefined;
    const costFob = v.e !== null && v.e !== '' ? Number(v.e) : undefined;
    const fx = Number(v.g) || 96.5;

    const result: RldRow = {
      k: v.k,
      b: v.b,
      c: packs,
      d: v.d,
      e: costFob,
      f: this.calculatedUsd,
      g: fx,
      h: this.calculatedInr,
      w: v.w
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}

