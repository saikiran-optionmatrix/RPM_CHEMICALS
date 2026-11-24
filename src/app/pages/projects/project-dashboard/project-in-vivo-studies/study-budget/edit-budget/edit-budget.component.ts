import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  BudgetCurrency,
  formatInVivoDate,
  IN_VIVO_BUDGET_CURRENCIES,
  InVivoStudyItem,
  StudyBudgetData,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditBudgetDialogData {
  study: InVivoStudyItem;
  budget?: StudyBudgetData | null;
}

@Component({
  selector: 'app-edit-budget',
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
  templateUrl: './edit-budget.component.html',
  styleUrl: './edit-budget.component.scss'
})
export class EditBudgetComponent implements OnInit {
  budgetForm: FormGroup;
  isSubmitting = false;

  readonly currencyOptions: readonly BudgetCurrency[] = IN_VIVO_BUDGET_CURRENCIES;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditBudgetComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditBudgetDialogData | null
  ) {
    this.budgetForm = this.fb.group({
      currency: ['INR' as BudgetCurrency, Validators.required],
      approved: [null, [Validators.required, Validators.min(0)]],
      approvedOn: ['', Validators.required],
      quote: [null, Validators.min(0)],
      quoteVersion: [''],
      contracted: [null, Validators.min(0)],
      changes: [0, Validators.min(0)],
      paid: [0, Validators.min(0)],
      invoiced: [0, Validators.min(0)],
      forecastToComplete: [null, Validators.min(0)],
      financeRef: ['']
    });
  }

  get f() {
    return this.budgetForm.controls;
  }

  get study(): InVivoStudyItem | undefined {
    return this.data?.study;
  }

  ngOnInit(): void {
    const b = this.data?.budget;
    if (!b) return;

    this.budgetForm.patchValue({
      currency: b.currency || 'INR',
      approved: b.approved,
      approvedOn: toIsoDateString(b.approvedOn),
      quote: b.quote,
      quoteVersion: b.quoteVersion || '',
      contracted: b.contracted,
      changes: b.changes ?? 0,
      paid: b.paid ?? 0,
      invoiced: b.invoiced ?? 0,
      forecastToComplete: b.forecastToComplete,
      financeRef: b.financeRef || ''
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.budgetForm.markAllAsTouched();
    if (this.budgetForm.invalid) return;

    const v = this.budgetForm.value;
    const toNum = (raw: unknown): number | null => {
      if (raw === null || raw === undefined || String(raw).trim() === '') return null;
      const num = Number(raw);
      return Number.isNaN(num) ? null : num;
    };

    const result: StudyBudgetData = {
      currency: (v.currency || 'INR') as BudgetCurrency,
      approved: toNum(v.approved),
      approvedOn: formatInVivoDate(v.approvedOn),
      quote: toNum(v.quote),
      quoteVersion: String(v.quoteVersion || '').trim(),
      contracted: toNum(v.contracted),
      changes: toNum(v.changes),
      paid: toNum(v.paid),
      invoiced: toNum(v.invoiced),
      forecastToComplete: toNum(v.forecastToComplete),
      financeRef: String(v.financeRef || '').trim(),
      payments: (this.data?.budget?.payments || []).map(p => ({ ...p }))
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

