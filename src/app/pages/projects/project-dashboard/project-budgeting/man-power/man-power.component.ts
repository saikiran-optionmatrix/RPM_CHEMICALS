import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';
import { RateCard, ManpowerAllocation, BudgetFilterState } from '../models/budgeting.models';

interface FunctionSummary {
  fn: string;
  activitiesCount: number;
  plannedHours: number;
  planCost: number;
  bookedHours: number;
  actualCost: number;
  sharePercent: number;
}

interface RateCardDisplay {
  fn: string;
  res: string;
  ac: number;
  rate: number;
  linesCount: number;
  isTemplate: boolean;
}

interface AllocationRow {
  m: ManpowerAllocation;
  w: string;
  activityName: string;
  fn: string;
  res: string;
  rate: number;
  costP: number;
  costA: number;
  isTemplate: boolean;
  isHighlighted: boolean;
}

@Component({
  selector: 'app-man-power',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './man-power.component.html',
  styleUrl: './man-power.component.scss'
})
export class ManPowerComponent implements OnInit, OnDestroy {
  protected budgetService = inject(BudgetingService);

  searchQuery = '';
  selectedFunction = 'all';
  functionList: string[] = [];

  functionSummaries: FunctionSummary[] = [];
  fnTotalPlannedHours = 0;
  fnTotalPlanCost = 0;
  fnTotalActualCost = 0;
  distinctActivitiesCount = 0;

  rateCardList: RateCardDisplay[] = [];
  allocationRows: AllocationRow[] = [];
  allocTotalP = 0;
  allocTotalA = 0;

  filterState: BudgetFilterState = { n: null, b: null };
  private sub = new Subscription();

  ngOnInit(): void {
    this.functionList = Array.from(new Set(this.budgetService.rc.map(r => r.fn)));

    this.sub.add(
      this.budgetService.filter$.subscribe(f => {
        this.filterState = f;
        this.computeAll();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  computeAll(): void {
    const rcList = this.budgetService.rc;
    const manList = this.budgetService.man;

    // Manpower usage per rate card index
    const used: Record<number, {
      n: number;
      P: number;
      A: number;
      h: number;
      ha: number;
      acts: Set<string>;
    }> = {};

    manList.forEach(m => {
      const k = m.rc;
      if (!used[k]) {
        used[k] = { n: 0, P: 0, A: 0, h: 0, ha: 0, acts: new Set() };
      }
      const u = used[k];
      u.n++;
      u.P += this.budgetService.manCost(m, 'P');
      u.A += this.budgetService.manCost(m, 'A');
      u.h += m.hc * m.hpd * m.occ * m.cyc;
      u.ha += m.hc * m.hpd * m.occ * m.acyc;
      u.acts.add(m.w);
    });

    // 1. Manpower by function summary
    const summaries: FunctionSummary[] = this.functionList.map(fn => {
      const ids = rcList.map((r, i) => (r.fn === fn ? i : -1)).filter(i => i >= 0);
      let P = 0;
      let A = 0;
      let h = 0;
      let ha = 0;
      const acts = new Set<string>();

      ids.forEach(i => {
        const u = used[i];
        if (u) {
          P += u.P;
          A += u.A;
          h += u.h;
          ha += u.ha;
          u.acts.forEach(a => acts.add(a));
        }
      });

      return {
        fn,
        activitiesCount: acts.size,
        plannedHours: h,
        planCost: P,
        bookedHours: ha,
        actualCost: A,
        sharePercent: 0
      };
    });

    const totP = summaries.reduce((a, b) => a + b.planCost, 0);
    const totA = summaries.reduce((a, b) => a + b.actualCost, 0);
    const totH = summaries.reduce((a, b) => a + b.plannedHours, 0);

    summaries.forEach(s => {
      s.sharePercent = totP ? (s.planCost / totP) * 100 : 0;
    });

    this.functionSummaries = summaries;
    this.fnTotalPlanCost = totP;
    this.fnTotalActualCost = totA;
    this.fnTotalPlannedHours = totH;
    this.distinctActivitiesCount = new Set(manList.map(m => m.w)).size;

    // 2. Rate Card list
    this.rateCardList = rcList.map((r, i) => {
      return {
        fn: r.fn,
        res: r.res,
        ac: r.ac,
        rate: this.budgetService.ratePerHour(r),
        linesCount: used[i]?.n || 0,
        isTemplate: !!r.tpl
      };
    });

    // 3. Allocations list
    this.filterAllocations();
  }

  filterAllocations(): void {
    const q = this.searchQuery.trim().toLowerCase();
    const manList = this.budgetService.man;
    const rcList = this.budgetService.rc;

    const filtered: AllocationRow[] = [];
    manList.forEach(m => {
      const r = rcList[m.rc];
      const node = this.budgetService.nodeMap[m.w];
      const nodeName = node?.name || '';

      const fnMatches = this.selectedFunction === 'all' || r.fn === this.selectedFunction;
      const wbsFilterMatches = !this.filterState.n || this.budgetService.isUnder(m.w, this.filterState.n);
      const textMatches = !q || (m.w + ' ' + nodeName + ' ' + r.res + ' ' + r.fn).toLowerCase().includes(q);

      if (fnMatches && wbsFilterMatches && textMatches) {
        const isHighlighted = !!(this.filterState.n && this.budgetService.isUnder(m.w, this.filterState.n));
        filtered.push({
          m,
          w: m.w,
          activityName: nodeName,
          fn: r.fn,
          res: r.res,
          rate: this.budgetService.ratePerHour(r),
          costP: this.budgetService.manCost(m, 'P'),
          costA: this.budgetService.manCost(m, 'A'),
          isTemplate: !!m.tpl,
          isHighlighted
        });
      }
    });

    this.allocationRows = filtered;
    this.allocTotalP = filtered.reduce((a, b) => a + b.costP, 0);
    this.allocTotalA = filtered.reduce((a, b) => a + b.costA, 0);
  }

  selectFunction(fn: string): void {
    this.selectedFunction = fn;
    this.filterAllocations();
    setTimeout(() => {
      const el = document.getElementById('manpower-alloc-heading');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  toWbs(w: string): void {
    this.budgetService.toWbs(w);
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }
}

