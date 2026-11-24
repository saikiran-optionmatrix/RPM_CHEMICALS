import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  cloneStudyBudget,
  formatStudyMoney,
  getBudgetActual,
  getBudgetCommitted,
  getBudgetForecastTotal,
  getBudgetVariance,
  IN_VIVO_BUDGET_BASIS,
  InVivoStudyItem,
  PaymentMilestoneStatus,
  StudyBudgetData,
  StudyPaymentMilestoneItem
} from '../in-vivo-studies.data';
import { EditBudgetComponent, EditBudgetDialogData } from './edit-budget/edit-budget.component';
import {
  EditPaymentMilestoneComponent,
  EditPaymentMilestoneDialogData
} from './edit-payment-milestone/edit-payment-milestone.component';

@Component({
  selector: 'app-study-budget',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './study-budget.component.html',
  styleUrl: './study-budget.component.scss'
})
export class StudyBudgetComponent {
  private readonly dialog = inject(MatDialog);

  @Input() study?: InVivoStudyItem;
  @Output() budgetUpdated = new EventEmitter<StudyBudgetData>();

  readonly budgetBasis = IN_VIVO_BUDGET_BASIS;

  get budget(): StudyBudgetData | null {
    return this.study?.budget ?? null;
  }

  get committedAmount(): number {
    return getBudgetCommitted(this.budget);
  }

  get actualAmount(): number {
    return getBudgetActual(this.budget, this.budgetBasis);
  }

  get forecastTotalAmount(): number {
    return getBudgetForecastTotal(this.budget);
  }

  get varianceAmount(): number {
    return getBudgetVariance(this.budget);
  }

  get varianceSubtext(): string {
    const variance = this.varianceAmount;
    if (variance > 0) return 'Over approved budget';
    if (variance < 0) return 'Under approved budget';
    return 'On budget';
  }

  get croQuotationDisplay(): string {
    const b = this.budget;
    if (!b || b.quote === null || b.quote === undefined) {
      return b?.quoteVersion ? `— (${b.quoteVersion})` : '—';
    }
    const base = this.formatMoney(b.quote);
    return b.quoteVersion ? `${base} (${b.quoteVersion})` : base;
  }

  formatMoney(amount: number | null | undefined, showPlus = false): string {
    return formatStudyMoney(amount, this.budget?.currency || 'INR', showPlus);
  }

  getPaymentStatusClass(status: PaymentMilestoneStatus): string {
    switch (status) {
      case 'Paid':
      case 'Approved':
        return 't-green';
      case 'Due':
        return 't-orange';
      case 'Planned':
      default:
        return 't-grey';
    }
  }

  openBudgetDialog(): void {
    if (!this.study) return;

    const dialogData: EditBudgetDialogData = {
      study: this.study,
      budget: cloneStudyBudget(this.study.budget)
    };

    const dialogRef = this.dialog.open(EditBudgetComponent, {
      width: '820px',
      maxWidth: '95vw',
      autoFocus: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result?: StudyBudgetData | null) => {
      if (!result) return;
      this.budgetUpdated.emit(cloneStudyBudget(result) ?? result);
    });
  }

  openPaymentDialog(paymentIndex: number): void {
    const currentBudget = this.budget;
    if (!this.study || !currentBudget) return;

    const existingPayment =
      paymentIndex >= 0 && paymentIndex < currentBudget.payments.length
        ? { ...currentBudget.payments[paymentIndex] }
        : undefined;

    const dialogData: EditPaymentMilestoneDialogData = {
      currency: currentBudget.currency,
      paymentIndex,
      payment: existingPayment
    };

    const dialogRef = this.dialog.open(EditPaymentMilestoneComponent, {
      width: '780px',
      maxWidth: '95vw',
      autoFocus: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result?: StudyPaymentMilestoneItem | null) => {
      if (!result) return;
      const clonedBudget = cloneStudyBudget(currentBudget);
      if (!clonedBudget) return;

      if (paymentIndex >= 0 && paymentIndex < clonedBudget.payments.length) {
        clonedBudget.payments[paymentIndex] = { ...result };
      } else {
        clonedBudget.payments.push({ ...result });
      }

      this.budgetUpdated.emit(clonedBudget);
    });
  }
}
