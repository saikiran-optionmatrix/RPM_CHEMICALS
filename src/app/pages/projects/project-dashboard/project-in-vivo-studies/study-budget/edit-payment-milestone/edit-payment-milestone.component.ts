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
  IN_VIVO_PAYMENT_STATUSES,
  PaymentMilestoneStatus,
  StudyPaymentMilestoneItem,
  toIsoDateString
} from '../../in-vivo-studies.data';

export interface EditPaymentMilestoneDialogData {
  currency: BudgetCurrency;
  paymentIndex: number;
  payment?: StudyPaymentMilestoneItem;
}

@Component({
  selector: 'app-edit-payment-milestone',
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
  templateUrl: './edit-payment-milestone.component.html',
  styleUrl: './edit-payment-milestone.component.scss'
})
export class EditPaymentMilestoneComponent implements OnInit {
  paymentForm: FormGroup;
  isSubmitting = false;

  readonly statusOptions: readonly PaymentMilestoneStatus[] = IN_VIVO_PAYMENT_STATUSES;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<EditPaymentMilestoneComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: EditPaymentMilestoneDialogData | null
  ) {
    this.paymentForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      trigger: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['Planned' as PaymentMilestoneStatus]
    });
  }

  get f() {
    return this.paymentForm.controls;
  }

  get isNew(): boolean {
    return !this.data || this.data.paymentIndex < 0;
  }

  get currency(): BudgetCurrency {
    return this.data?.currency || 'INR';
  }

  ngOnInit(): void {
    const p = this.data?.payment;
    if (!p) return;

    this.paymentForm.patchValue({
      amount: p.amount,
      trigger: p.trigger || '',
      dueDate: toIsoDateString(p.dueDate),
      status: p.status || 'Planned'
    });
  }

  save(): void {
    this.isSubmitting = true;
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) return;

    const v = this.paymentForm.value;
    const result: StudyPaymentMilestoneItem = {
      amount: Number(v.amount),
      trigger: String(v.trigger || '').trim(),
      dueDate: formatInVivoDate(v.dueDate),
      status: (v.status || 'Planned') as PaymentMilestoneStatus
    };

    this.dialogRef?.close(result);
  }

  close(): void {
    this.dialogRef?.close(null);
  }
}

