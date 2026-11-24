import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';
import { AnalyticalQcItem, AnalyticalColItem, BudgetFilterState } from '../models/budgeting.models';

@Component({
  selector: 'app-analytical-cost',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './analytical-cost.component.html',
  styleUrl: './analytical-cost.component.scss'
})
export class AnalyticalCostComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  protected budgetService = inject(BudgetingService);

  qcItems: AnalyticalQcItem[] = [];
  colItems: AnalyticalColItem[] = [];
  colWbs = '3.1.7';
  thirdPartyItems: { sl: number }[] = [];
  thirdPartyWbs = '7.1.2';
  batches: [string, number][] = [];
  colTime = 10;
  colReq = 3;

  totalQcCost = 0;
  totalSumProductCol = 0;
  totalColCost = 0;
  totalBatches = 0;

  filterState: BudgetFilterState = { n: null, b: null };
  private sub = new Subscription();

  ngOnInit(): void {
    const ana = this.budgetService.ana;
    this.qcItems = ana.qc;
    this.colItems = ana.cols;
    this.colWbs = ana.colW;
    this.thirdPartyItems = ana.third;
    this.thirdPartyWbs = ana.thirdW;
    this.batches = ana.batches;
    this.colTime = ana.colTime;
    this.colReq = ana.colReq;

    this.totalQcCost = this.qcItems.reduce((a, b) => a + b.i, 0);
    this.totalSumProductCol = this.colItems.reduce((a, b) => a + (b.g || 0), 0);
    this.totalColCost = this.colItems.reduce((a, b) => a + (b.g ? b.g * b.h : 0), 0);
    this.totalBatches = this.batches.reduce((a, b) => a + b[1], 0);

    this.sub.add(
      this.budgetService.filter$.subscribe(f => {
        this.filterState = f;
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  isHighlighted(w: string): boolean {
    return !!(this.filterState.n && this.budgetService.isUnder(w, this.filterState.n));
  }

  toWbs(w: string): void {
    this.budgetService.toWbs(w);
  }

  scrollLeft(): void {
    const containers = document.querySelectorAll('.analytical-cost-container .table-responsive');
    if (containers.length) {
      containers.forEach(c => c.scrollBy({ left: -350, behavior: 'smooth' }));
    } else if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const containers = document.querySelectorAll('.analytical-cost-container .table-responsive');
    if (containers.length) {
      containers.forEach(c => c.scrollBy({ left: 350, behavior: 'smooth' }));
    } else if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }
}

