import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';
import { WbsNode, NodeAggregates, CostBucket } from '../models/budgeting.models';

@Component({
  selector: 'app-wbs-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './wbs-summary.component.html',
  styleUrl: './wbs-summary.component.scss'
})
export class WbsSummaryComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  protected budgetService = inject(BudgetingService);

  searchQuery = '';
  selectedGate = 'all';
  highlightWbs: string | null = null;

  aggregates: Record<string, NodeAggregates> = {};
  displayedNodes: WbsNode[] = [];
  totals = { manP: 0, manA: 0, matP: 0, matA: 0, resP: 0, resA: 0, totalP: 0, totalA: 0, variance: 0 };

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.budgetService.highlightWbs$.subscribe(hl => {
        this.highlightWbs = hl;
        if (hl) {
          setTimeout(() => {
            const el = document.getElementById('r-' + hl.replace(/\./g, '_'));
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      })
    );
    this.refreshView();
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

  onSearchChange(): void {
    this.refreshView();
  }

  onGateChange(): void {
    this.refreshView();
  }

  expandAll(): void {
    this.budgetService.expandAll();
    this.refreshView();
  }

  collapseAll(): void {
    this.budgetService.collapseAll();
    this.refreshView();
  }

  toggleNode(id: string): void {
    this.budgetService.toggleNode(id);
    this.refreshView();
  }

  isOpen(id: string): boolean {
    return this.budgetService.openNodes.has(id);
  }

  drill(nodeId: string, bucket: CostBucket | null): void {
    this.budgetService.drill(nodeId, bucket);
  }

  refreshView(): void {
    this.aggregates = this.budgetService.getAggregates();
    const q = this.searchQuery.trim().toLowerCase();

    const match = (id: string): boolean => {
      const r = this.budgetService.nodeMap[id];
      if (!r) return false;
      return (r.id + ' ' + r.name + ' ' + (r.resp || '')).toLowerCase().includes(q);
    };

    const has = (id: string): boolean => {
      const r = this.budgetService.nodeMap[id];
      if (!r) return false;
      if (r.lvl === 'Activity') return match(id);
      return match(id) || (this.budgetService.childrenMap[id] || []).some(has);
    };

    const list: WbsNode[] = [];
    const walk = (id: string): void => {
      if (q && !has(id)) return;
      const r = this.budgetService.nodeMap[id];
      if (r) list.push(r);
      if (r && r.lvl === 'Activity') return;
      if (q || this.budgetService.openNodes.has(id)) {
        (this.budgetService.childrenMap[id] || []).forEach(walk);
      }
    };

    const gs = this.selectedGate === 'all' ? this.budgetService.gateIds : [this.selectedGate];
    gs.forEach(walk);
    this.displayedNodes = list;

    // Calculate totals for active gate(s)
    const t = { manP: 0, manA: 0, matP: 0, matA: 0, resP: 0, resA: 0 };
    gs.forEach(g => {
      const a = this.aggregates[g];
      if (a) {
        t.manP += a.manP;
        t.manA += a.manA;
        t.matP += a.matP;
        t.matA += a.matA;
        t.resP += a.resP;
        t.resA += a.resA;
      }
    });

    const totalP = t.manP + t.matP + t.resP;
    const totalA = t.manA + t.matA + t.resA;
    this.totals = {
      ...t,
      totalP,
      totalA,
      variance: totalA - totalP
    };
  }

  isEstimate(nodeId: string, bucket: CostBucket): boolean {
    const r = this.budgetService.nodeMap[nodeId];
    if (!r || r.lvl !== 'Activity') return false;
    const a = this.aggregates[nodeId];
    return (!a || !a.n[bucket]) && this.budgetService.blankActivities.has(nodeId + '|' + bucket);
  }

  hasCost(nodeId: string, bucket: CostBucket, kind: 'P' | 'A'): boolean {
    const a = this.aggregates[nodeId];
    if (!a) return false;
    const val = a[(bucket + kind) as keyof NodeAggregates] as number;
    return val > 0 || (this.budgetService.nodeMap[nodeId]?.lvl === 'Activity' && a.n[bucket] > 0);
  }

  getCost(nodeId: string, bucket: CostBucket, kind: 'P' | 'A'): number {
    const a = this.aggregates[nodeId];
    return a ? (a[(bucket + kind) as keyof NodeAggregates] as number) : 0;
  }

  getNodeTotalP(nodeId: string): number {
    const a = this.aggregates[nodeId];
    return a ? a.manP + a.matP + a.resP : 0;
  }

  getNodeTotalA(nodeId: string): number {
    const a = this.aggregates[nodeId];
    return a ? a.manA + a.matA + a.resA : 0;
  }

  getVariance(p: number, a: number): number {
    return a - p;
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }

  getGateName(id: string): string {
    return this.budgetService.nodeMap[id]?.name || id;
  }
}

