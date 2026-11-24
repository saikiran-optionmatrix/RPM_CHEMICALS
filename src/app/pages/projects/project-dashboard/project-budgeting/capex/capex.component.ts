import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';
import { CapexItem, BudgetFilterState } from '../models/budgeting.models';

@Component({
  selector: 'app-capex',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './capex.component.html',
  styleUrl: './capex.component.scss'
})
export class CapexComponent implements OnInit, OnDestroy {
  protected budgetService = inject(BudgetingService);

  capexList: {
    item: CapexItem;
    inrCost: number | null;
    isHighlighted: boolean;
  }[] = [];

  filterState: BudgetFilterState = { n: null, b: null };
  totalUsd = 0;
  totalInr = 0;

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.budgetService.filter$.subscribe(f => {
        this.filterState = f;
        this.computeRows();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  computeRows(): void {
    const list = this.budgetService.cap.map(c => {
      const inrCost = this.budgetService.capH(c);
      const isHighlighted = !!(
        this.filterState.n &&
        c.w &&
        this.budgetService.isUnder(c.w, this.filterState.n)
      );
      return { item: c, inrCost, isHighlighted };
    });

    this.capexList = list;
    this.totalUsd = list.reduce((a, b) => a + (b.item.usd || 0), 0);
    this.totalInr = list.reduce((a, b) => a + (b.inrCost || 0), 0);
  }

  toWbs(w: string | null): void {
    if (w) {
      this.budgetService.toWbs(w);
    }
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }

  formatDec(val: number | null | undefined): string {
    return this.budgetService.formatCurrencyDec(val);
  }
}

