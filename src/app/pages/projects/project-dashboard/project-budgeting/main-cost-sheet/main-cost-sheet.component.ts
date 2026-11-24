import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';

export interface MainCostItem {
  sl: string | number;
  activity: string;
  devBudget: number | null;
  ebSuBudget: number | null;
  totalBudget: number | null;
  actual: number | null;
  wbs: string[];
  isSubtotal?: boolean;
}

export interface CostTotals {
  devBudget: number;
  ebSuBudget: number;
  totalBudget: number;
  actual: number;
}

@Component({
  selector: 'app-main-cost-sheet',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './main-cost-sheet.component.html',
  styleUrl: './main-cost-sheet.component.scss'
})
export class MainCostSheetComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  protected budgetService = inject(BudgetingService);

  materialItems: MainCostItem[] = [];
  otherItems: MainCostItem[] = [];
  totalMaterialCost: CostTotals = { devBudget: 0, ebSuBudget: 0, totalBudget: 0, actual: 0 };
  totalOtherCost: CostTotals = { devBudget: 0, ebSuBudget: 0, totalBudget: 0, actual: 0 };
  costAPlusB: CostTotals = { devBudget: 0, ebSuBudget: 0, totalBudget: 0, actual: 0 };

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.budgetService.dataUpdated$.subscribe(() => {
        this.computeCosts();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  computeCosts(): void {
    const byCatDev: Record<string, number> = {};
    const byCatEbSu: Record<string, number> = {};
    const byCatTotal: Record<string, number> = {};

    this.budgetService.ml.forEach(m => {
      const c = this.budgetService.mlCalc(m);
      const dev = c.AI;
      const ebSu = c.AL + c.AO;
      const total = dev + ebSu;

      byCatDev[m.cat] = (byCatDev[m.cat] || 0) + dev;
      byCatEbSu[m.cat] = (byCatEbSu[m.cat] || 0) + ebSu;
      byCatTotal[m.cat] = (byCatTotal[m.cat] || 0) + total;
    });

    const R = this.budgetService.rldCalc();
    const I8 = this.budgetService.ana.qc.reduce((a, q) => a + q.i, 0);
    const I27 = this.budgetService.ana.cols.reduce((a, c) => a + (c.g ? c.g * c.h : 0), 0);
    const J48 = 0;

    const matDefs = [
      { sl: 1, name: 'API', cat: 'API', wbs: ['3.1.1', '5.1.4'] },
      { sl: 2, name: 'Excepient', cat: 'Excepient', wbs: ['3.1.3', '5.1.4'] },
      { sl: 3, name: 'Primary packing', cat: 'Primary packing', wbs: ['3.1.5', '5.1.4'] },
      { sl: 4, name: 'Secondary Packing', cat: 'Secondary Packing', wbs: ['3.1.5', '5.1.4'] },
      { sl: 5, name: 'Tertiary Packing', cat: 'Tertiary Packing', wbs: ['3.1.5', '5.1.4'] },
      { sl: 3, name: 'Consumables', cat: 'Consumables', wbs: ['3.1.4', '5.1.5'] },
      { sl: '—', name: 'Filters', cat: 'Filters', wbs: ['3.1.4', '5.1.5'] }
    ];

    this.materialItems = matDefs.map(m => {
      const devBudget = byCatDev[m.cat] || 0;
      const ebSuBudget = byCatEbSu[m.cat] || 0;
      const totalBudget = byCatTotal[m.cat] || 0;
      const actual = m.cat === 'API' ? 750000 : 0;
      return {
        sl: m.sl,
        activity: m.name,
        devBudget,
        ebSuBudget,
        totalBudget,
        actual,
        wbs: m.wbs
      };
    });

    const matDevSum = this.materialItems.reduce((a, b) => a + (b.devBudget || 0), 0);
    const matEbSuSum = this.materialItems.reduce((a, b) => a + (b.ebSuBudget || 0), 0);
    const matTotalSum = this.materialItems.reduce((a, b) => a + (b.totalBudget || 0), 0);
    const matActSum = this.materialItems.reduce((a, b) => a + (b.actual || 0), 0);
    this.totalMaterialCost = {
      devBudget: matDevSum,
      ebSuBudget: matEbSuSum,
      totalBudget: matTotalSum,
      actual: matActSum
    };

    this.otherItems = [
      { sl: 4, activity: 'RLD Cost', devBudget: R.H10, ebSuBudget: 0, totalBudget: R.H10, actual: 0, wbs: ['3.1.2'] },
      { sl: 5, activity: 'CT / BE cost', devBudget: 0, ebSuBudget: 0, totalBudget: 0, actual: 0, wbs: [] },
      { sl: 6, activity: 'Standards / Columns / Lab Chemicals', devBudget: I8, ebSuBudget: 0, totalBudget: I8, actual: 0, wbs: ['3.1.6', '3.1.7'] },
      { sl: 7, activity: 'Testing / Analysis', devBudget: I27, ebSuBudget: 0, totalBudget: I27, actual: 0, wbs: ['3.1.7'] },
      { sl: 8, activity: 'Testing / Analysis with 3rd party', devBudget: J48, ebSuBudget: 0, totalBudget: J48, actual: 0, wbs: ['7.1.2'] },
      { sl: 9, activity: 'Overhead( Depreciation,R&M and other Expenditure)', devBudget: null, ebSuBudget: null, totalBudget: null, actual: 0, wbs: [] },
      { sl: 10, activity: 'Capex Interest', devBudget: null, ebSuBudget: null, totalBudget: null, actual: 0, wbs: [] }
    ];

    const otherDevSum = R.H10 + I8 + I27 + J48;
    const otherEbSuSum = 0;
    const otherTotalSum = otherDevSum + otherEbSuSum;
    this.totalOtherCost = {
      devBudget: otherDevSum,
      ebSuBudget: otherEbSuSum,
      totalBudget: otherTotalSum,
      actual: 0
    };

    this.costAPlusB = {
      devBudget: matDevSum + otherDevSum,
      ebSuBudget: matEbSuSum + otherEbSuSum,
      totalBudget: matTotalSum + otherTotalSum,
      actual: matActSum
    };
  }

  getVarianceDisplay(totalBudget: number | null, actual: number | null): { text: string; css: string } {
    if (totalBudget == null || actual == null || totalBudget === 0) return { text: '—', css: '' };
    const v = (actual / totalBudget) - 1;
    if (Math.abs(v) < 0.0001) return { text: '0%', css: '' };
    const pct = (v * 100).toFixed(1) + '%';
    if (v > 0) return { text: '+' + pct, css: 'variance-over' };
    return { text: pct, css: 'variance-under' };
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }

  toWbs(w: string): void {
    this.budgetService.toWbs(w);
  }
}
