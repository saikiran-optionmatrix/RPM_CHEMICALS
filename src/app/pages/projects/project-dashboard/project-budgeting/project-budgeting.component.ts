import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

import { BudgetingService, SHEET_NAMES, BUCKET_NAMES } from './services/budgeting.service';
import { BudgetTabKey, BudgetFilterState, KpiSummary } from './models/budgeting.models';

import { WbsSummaryComponent } from './wbs-summary/wbs-summary.component';
import { MainCostSheetComponent } from './main-cost-sheet/main-cost-sheet.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { CapexComponent } from './capex/capex.component';
import { ManPowerComponent } from './man-power/man-power.component';
import { BudgetRldComponent } from './rld/budget-rld.component';
import { AnalyticalCostComponent } from './analytical-cost/analytical-cost.component';

@Component({
  selector: 'app-project-budgeting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    WbsSummaryComponent,
    MainCostSheetComponent,
    MaterialListComponent,
    CapexComponent,
    ManPowerComponent,
    BudgetRldComponent,
    AnalyticalCostComponent
  ],
  templateUrl: './project-budgeting.component.html',
  styleUrl: './project-budgeting.component.scss'
})
export class ProjectBudgetingComponent implements OnInit, OnDestroy {
  protected budgetService = inject(BudgetingService);
  private location = inject(Location);

  // Project Info
  projectName = 'Amphotericin B Liposome 50 mg';
  templateTag = 'budget template example';

  // Active Tab
  activeTab: BudgetTabKey = 'wbs';
  filterState: BudgetFilterState = { n: null, b: null };

  // KPI Summary
  kpi: KpiSummary = {
    budget: 0,
    actual: 0,
    completionPercent: 0,
    manP: 0,
    matP: 0,
    resP: 0,
    notEstimatedCount: 0,
    baseline: 'v1 · frozen at G2'
  };

  // Tab definitions
  tabs: { key: BudgetTabKey; label: string; icon: string }[] = [
    { key: 'wbs', label: 'WBS Summary', icon: 'account_tree' },
    { key: 'main', label: 'Main Cost Sheet', icon: 'grid_on' },
    { key: 'ml', label: 'Material List', icon: 'grid_on' },
    { key: 'cap', label: 'Capex', icon: 'grid_on' },
    { key: 'man', label: 'Manpower', icon: 'grid_on' },
    { key: 'rld', label: 'RLD', icon: 'grid_on' },
    { key: 'ana', label: 'Analytical cost', icon: 'grid_on' }
  ];

  private sub = new Subscription();

  ngOnInit(): void {
    this.kpi = this.budgetService.getKpiSummary();

    this.sub.add(
      this.budgetService.activeTab$.subscribe(tab => {
        this.activeTab = tab;
      })
    );

    this.sub.add(
      this.budgetService.filter$.subscribe(f => {
        this.filterState = f;
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  selectTab(key: BudgetTabKey): void {
    this.budgetService.setTab(key);
  }

  goBack(): void {
    this.location.back();
  }

  getFilteredNodeName(): string {
    if (!this.filterState.n) return '';
    const node = this.budgetService.nodeMap[this.filterState.n];
    return node ? `${node.lvl} ${this.filterState.n} · ${node.name}` : this.filterState.n;
  }

  getFilteredBucketName(): string {
    if (!this.filterState.b) return '';
    return ' · ' + BUCKET_NAMES[this.filterState.b];
  }

  getOtherSheets(): { key: BudgetTabKey; label: string }[] {
    if (!this.filterState.n) return [];
    const sheets = this.budgetService.sheetsFor(this.filterState.n, this.filterState.b);
    return sheets
      .filter(s => s !== this.activeTab)
      .map(s => ({ key: s as BudgetTabKey, label: SHEET_NAMES[s as BudgetTabKey] }));
  }

  clearFilter(): void {
    this.budgetService.clearFilter();
  }

  backToWbsSummary(): void {
    this.budgetService.backToWbsFromDrill();
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }
}

// Backward-compatibility interface exports for legacy material-list
export interface MainCostRow {
  key?: string;
  excelRow?: number;
  serial?: string | number | null;
  activity?: string;
  devCost?: number | null;
  scaleUpCost?: number | null;
  pivotalCost?: number | null;
  totalCost?: number | null;
  cost?: number | null;
  category?: string | null;
  isTotal?: boolean;
  isGrandTotal?: boolean;
}

export interface ApprovalRow {
  id?: number;
  workflow?: string;
  department?: string;
  section?: string;
  responsibility?: string;
  done?: boolean;
  dateDone?: string;
}

/* =======================================================================
   OLD IMPLEMENTATION (COMMENTED OUT AS REQUESTED BY USER)
==========================================================================
export interface MainCostRow {
  key: string;
  excelRow: number;
  serial: string | number | null;
  activity: string;
  devCost: number | null;
  scaleUpCost: number | null;
  pivotalCost: number | null;
  totalCost: number | null;
  cost?: number | null;
  category: string | null;
  isTotal: boolean;
  isGrandTotal: boolean;
}

export interface ApprovalRow {
  id: number;
  workflow: string;
  department: string;
  section: string;
  responsibility: string;
  done: boolean;
  dateDone: string;
}
======================================================================= */
