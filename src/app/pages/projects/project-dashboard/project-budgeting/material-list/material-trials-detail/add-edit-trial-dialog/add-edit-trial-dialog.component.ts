import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MaterialItem } from '../../../models/budgeting.models';

export interface AddEditTrialDialogData {
  mode: 'add' | 'edit';
  material: MaterialItem;
  trialIndex: number;
  cycleLabel: string;
  inputQty?: number;
  cost?: number;
}

@Component({
  selector: 'app-add-edit-trial-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-edit-trial-dialog.component.html',
  styleUrls: ['./add-edit-trial-dialog.component.scss']
})
export class AddEditTrialDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditTrialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditTrialDialogData
  ) {
    this.isEditMode = this.data?.mode === 'edit';

    const defaultQty = this.data?.inputQty ?? (this.data?.material?.inq2 || this.data?.material?.inq || 0);
    const initialCost = this.data?.cost ?? this.calculateCost(defaultQty);

    this.form = this.fb.group({
      cycleLabel: [{ value: this.data?.cycleLabel || 'Trial 1', disabled: true }],
      inputQty: [defaultQty, [Validators.required, Validators.min(0)]],
      cost: [initialCost, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Dynamically calculate cost when inputQty changes
    this.form.get('inputQty')?.valueChanges.subscribe(qty => {
      const numQty = Number(qty);
      if (!isNaN(numQty) && numQty >= 0) {
        const computed = this.calculateCost(numQty);
        this.form.get('cost')?.setValue(computed, { emitEvent: false });
      }
    });
  }

  calculateCost(qty: number): number {
    const m = this.data?.material;
    if (!m) return 0;
    const price = Number(m.price) || 0;
    const cf = Number(m.cf) || 1;
    const dbs = Number(m.dbs) || 1;
    return Math.round((price * qty / cf) * dbs);
  }

  save(): void {
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const inputQty = Number(this.form.get('inputQty')?.value) || 0;
    const cost = Number(this.form.get('cost')?.value) || 0;

    this.dialogRef.close({
      trialIndex: this.data.trialIndex,
      cycleLabel: this.data.cycleLabel,
      inputQty,
      cost
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

