import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  WbsNode,
  RateCard,
  ManpowerAllocation,
  MaterialItem,
  CapexItem,
  RldData,
  RldRow,
  AnalyticalCostData,
  RollupLine,
  NodeAggregates,
  BudgetTabKey,
  BudgetFilterState,
  KpiSummary,
  CostBucket
} from '../models/budgeting.models';
import {
  INITIAL_WBS_ROWS,
  INITIAL_RATE_CARDS,
  HOURS_PER_MONTH,
  INITIAL_MANPOWER,
  INITIAL_MATERIALS,
  INITIAL_CAPEX,
  INITIAL_RLD_DATA,
  INITIAL_ANA_DATA,
  BLANK_ACTIVITIES_SET
} from '../data/budget-initial-data';

export const SHEET_NAMES: Record<BudgetTabKey, string> = {
  wbs: 'WBS Summary',
  main: 'Main Cost Sheet',
  ml: 'Material List',
  cap: 'Capex',
  man: 'Manpower',
  rld: 'RLD',
  ana: 'Analytical cost'
};

export const BUCKET_NAMES: Record<CostBucket, string> = {
  man: 'Man',
  mat: 'Material',
  res: 'Resource'
};

@Injectable({
  providedIn: 'root'
})
export class BudgetingService {
  readonly hpm = HOURS_PER_MONTH;
  readonly rows: WbsNode[] = INITIAL_WBS_ROWS;
  readonly rc: RateCard[] = INITIAL_RATE_CARDS;
  readonly man: ManpowerAllocation[] = INITIAL_MANPOWER;
  readonly ml: MaterialItem[] = INITIAL_MATERIALS;
  readonly cap: CapexItem[] = INITIAL_CAPEX;
  readonly rld: RldData = INITIAL_RLD_DATA;
  readonly ana: AnalyticalCostData = INITIAL_ANA_DATA;
  readonly blankActivities = new Set<string>(BLANK_ACTIVITIES_SET.map(x => x + '|res'));

  readonly nodeMap: Record<string, WbsNode> = {};
  readonly ancestorMap: Record<string, string[]> = {};
  readonly childrenMap: Record<string, string[]> = {};
  readonly gateIds: string[] = [];

  private lines: RollupLine[] = [];
  private aggregates: Record<string, NodeAggregates> = {};

  // Interactive state
  private activeTabSubject = new BehaviorSubject<BudgetTabKey>('wbs');
  activeTab$ = this.activeTabSubject.asObservable();

  private filterSubject = new BehaviorSubject<BudgetFilterState>({ n: null, b: null });
  filter$ = this.filterSubject.asObservable();

  private highlightWbsSubject = new BehaviorSubject<string | null>(null);
  highlightWbs$ = this.highlightWbsSubject.asObservable();

  private showTrialsSubject = new BehaviorSubject<boolean>(true);
  showTrials$ = this.showTrialsSubject.asObservable();

  private dataUpdatedSubject = new BehaviorSubject<number>(Date.now());
  dataUpdated$ = this.dataUpdatedSubject.asObservable();

  openNodes = new Set<string>(['G1', 'G3', '3', '3.1']);

  constructor() {
    this.buildWbsStructure();
    this.recalculate();
  }

  private buildWbsStructure(): void {
    let g: string | null = null;
    let s: string | null = null;
    let d: string | null = null;

    this.rows.forEach(r => {
      this.nodeMap[r.id] = r;
      if (r.lvl === 'Gate') {
        g = r.id;
        s = null;
        d = null;
        this.childrenMap[g] = [];
        this.gateIds.push(g);
      } else if (r.lvl === 'Stage') {
        s = r.id;
        d = null;
        this.childrenMap[s] = [];
        if (g && this.childrenMap[g]) {
          this.childrenMap[g].push(s);
        }
      } else if (r.lvl === 'Deliverable') {
        d = r.id;
        this.childrenMap[d] = [];
        if (s && this.childrenMap[s]) {
          this.childrenMap[s].push(d);
        }
      } else {
        if (d && this.childrenMap[d]) {
          this.childrenMap[d].push(r.id);
        }
        if (g && s && d) {
          this.ancestorMap[r.id] = [g, s, d, r.id];
        } else {
          this.ancestorMap[r.id] = [r.id];
        }
      }
    });
  }

  isUnder(w: string, n: string | null): boolean {
    if (!n) return false;
    if (w === n) return true;
    const ancs = this.ancestorMap[w];
    return !!(ancs && ancs.includes(n));
  }

  // Rate card rate per hour
  ratePerHour(r: RateCard): number {
    return r.ac / this.hpm;
  }

  // Manpower cost formula
  manCost(m: ManpowerAllocation, kind: 'P' | 'A'): number {
    const rate = this.ratePerHour(this.rc[m.rc]);
    const cycles = kind === 'A' ? m.acyc : m.cyc;
    return rate * m.hc * m.hpd * m.occ * cycles;
  }

  // Material item formula (matching Excel)
  mlCalc(m: MaterialItem) {
    let trials: number[];
    if (m.customTrials && m.customTrials.length > 0) {
      trials = m.customTrials.map(t => {
        if (t.cost !== undefined && t.cost !== null) return t.cost;
        return (m.price * t.inputQty / m.cf) * m.dbs;
      });
    } else {
      const t1 = m.firstAlt
        ? (m.inq * m.price * m.dbs) / m.cf
        : (m.price / m.cf) * m.inq * m.dbs;
      const tn = (m.price * m.inq2 / m.cf) * m.dbs;
      const count = m.cyc && m.cyc > 1 ? m.cyc - 1 : 19;
      trials = [t1, ...Array(count).fill(tn)];
    }
    const AI = trials.reduce((a, b) => a + b, 0);
    const AL = m.flat ? m.inq3 * m.price : (m.price * m.inq3 / m.cf) * m.sbs;
    const AN = m.ebs * 3;
    const AO = m.flat ? m.price * m.inq3 * 3 : (m.price * m.inq3 / m.cf) * AN;
    return {
      H: m.pq * m.price,
      trials,
      AI,
      AL,
      AN,
      AO
    };
  }

  // Capex INR value
  capH(c: CapexItem): number | null {
    return c.usd == null ? null : c.usd * c.fx;
  }

  // RLD calculations
  rldCalc() {
    const R = this.rld.rows;
    const F = (r: any) => ((Number(r?.c) || 0) * (Number(r?.e) || 0));
    const batchRows = R.filter(r => r.k === 'b');
    let totalBatchFob = 0;
    const F_arr: number[] = [0];
    const H_arr: number[] = [0];

    batchRows.forEach(r => {
      const fob = F(r);
      totalBatchFob += fob;
      const fx = Number(r.g) || 96.5;
      F_arr.push(fob);
      H_arr.push(fob * fx);
    });

    const F7 = 2000;
    const F8 = totalBatchFob * 0.10;
    F_arr.push(F7);
    H_arr.push(F7 * 96.5);
    F_arr.push(F8);
    H_arr.push(F8 * 96.5);

    const F10 = totalBatchFob + F7 + F8;
    const H10 = H_arr.slice(1).reduce((a, b) => a + b, 0);

    const F12 = 480 * 377;
    const F13 = 600;
    const F14 = F12 * 0.075 * 1.1;
    const F15 = F12 + F13 + F14;
    const H15 = 96.5 * F15;

    const C17 = batchRows.reduce((sum, r) => sum + (Number(r.c) || 0), 480);
    const F17 = F15 + F10;

    const H20 = 650000 * 0.35;
    const E24 = batchRows.reduce((sum, r) => sum + (Number(r.c) || 0), 0);
    const H24 = totalBatchFob + F7 + F8;
    const H25 = H24 - H20;
    const FA = F_arr[1] || 0;
    const FB = F_arr[2] || 0;
    const FC = F_arr[3] || 0;

    return {
      F: F_arr,
      H: H_arr,
      F10,
      H10,
      F12,
      F13,
      F14,
      F15,
      H15,
      C17,
      F17,
      H20,
      E24,
      H24,
      H25,
      FA,
      FB,
      FC
    };
  }

  recalculate(): void {
    const L: RollupLine[] = [];

    // Manpower lines
    this.man.forEach((m, i) => {
      L.push({
        w: m.w,
        b: 'man',
        s: 'man',
        ref: i,
        P: this.manCost(m, 'P'),
        A: this.manCost(m, 'A')
      });
    });

    // Material lines
    this.ml.forEach((m, i) => {
      const c = this.mlCalc(m);
      L.push({
        w: m.wdev,
        b: 'mat',
        s: 'ml',
        ref: i,
        P: c.AI,
        A: m.cat === 'API' ? 750000 : 0
      });
      L.push({
        w: m.wsu,
        b: 'mat',
        s: 'ml',
        ref: i,
        P: c.AL + c.AO,
        A: 0
      });
    });

    // RLD lines
    const R = this.rldCalc();
    [1, 2, 3, 4, 5].forEach(i => {
      L.push({
        w: '3.1.2',
        b: 'mat',
        s: 'rld',
        ref: i,
        P: R.H[i],
        A: 0
      });
    });
    L.push({
      w: '5.4.5',
      b: 'mat',
      s: 'rld',
      ref: 12,
      P: R.H15,
      A: 0
    });

    // Analytical cost lines
    this.ana.qc.forEach((q, i) => {
      L.push({
        w: q.w,
        b: 'mat',
        s: 'ana',
        ref: 'q' + i,
        P: q.i,
        A: 0
      });
    });
    this.ana.cols.forEach((c, i) => {
      if (c.g) {
        L.push({
          w: this.ana.colW,
          b: 'mat',
          s: 'ana',
          ref: 'c' + i,
          P: c.g * c.h,
          A: 0
        });
      }
    });

    // Capex lines
    this.cap.forEach((c, i) => {
      const h = this.capH(c);
      if (h && c.w) {
        L.push({
          w: c.w,
          b: 'res',
          s: 'cap',
          ref: i,
          P: h,
          A: 0
        });
      }
    });

    this.lines = L;

    // Aggregate WBS rollup
    const AG: Record<string, NodeAggregates> = {};
    this.rows.forEach(r => {
      AG[r.id] = {
        manP: 0,
        manA: 0,
        matP: 0,
        matA: 0,
        resP: 0,
        resA: 0,
        n: { man: 0, mat: 0, res: 0 }
      };
    });

    this.lines.forEach(l => {
      const ancs = this.ancestorMap[l.w] || [l.w];
      ancs.forEach(id => {
        if (AG[id]) {
          AG[id][(l.b + 'P') as 'manP' | 'matP' | 'resP'] += l.P;
          AG[id][(l.b + 'A') as 'manA' | 'matA' | 'resA'] += l.A;
        }
      });
      if (AG[l.w]) {
        AG[l.w].n[l.b]++;
      }
    });

    this.aggregates = AG;
    this.dataUpdatedSubject.next(Date.now());
  }

  getAggregates(): Record<string, NodeAggregates> {
    return this.aggregates;
  }

  getLines(): RollupLine[] {
    return this.lines;
  }

  getKpiSummary(): KpiSummary {
    const t = { manP: 0, manA: 0, matP: 0, matA: 0, resP: 0, resA: 0 };
    this.lines.forEach(l => {
      t[(l.b + 'P') as 'manP' | 'matP' | 'resP'] += l.P;
      t[(l.b + 'A') as 'manA' | 'matA' | 'resA'] += l.A;
    });

    const budget = t.manP + t.matP + t.resP;
    const actual = t.manA + t.matA + t.resA;
    const completionPercent = budget ? Math.round((actual / budget) * 100) : 0;

    return {
      budget,
      actual,
      completionPercent,
      manP: t.manP,
      matP: t.matP,
      resP: t.resP,
      notEstimatedCount: this.blankActivities.size,
      baseline: 'v1 · frozen at G2'
    };
  }

  sheetsFor(n: string, b?: CostBucket | null): ('man' | 'ml' | 'rld' | 'ana' | 'cap')[] {
    const s: ('man' | 'ml' | 'rld' | 'ana' | 'cap')[] = [];
    this.lines.forEach(l => {
      if (this.isUnder(l.w, n) && (!b || l.b === b) && !s.includes(l.s)) {
        s.push(l.s);
      }
    });
    return (['man', 'ml', 'rld', 'ana', 'cap'] as const).filter(x => s.includes(x));
  }

  // Navigation and drill actions
  setTab(tab: BudgetTabKey): void {
    this.activeTabSubject.next(tab);
    if (tab === 'wbs') {
      this.filterSubject.next({ n: null, b: null });
    }
    this.highlightWbsSubject.next(null);
  }

  drill(n: string, b?: CostBucket | null): void {
    const sh = this.sheetsFor(n, b || null);
    this.filterSubject.next({ n, b: b || null });
    this.highlightWbsSubject.next(null);
    const targetTab = sh[0] || 'wbs';
    this.activeTabSubject.next(targetTab);
  }

  toWbs(w: string): void {
    this.activeTabSubject.next('wbs');
    const ancs = this.ancestorMap[w] || [w];
    ancs.slice(0, -1).forEach(id => this.openNodes.add(id));
    this.openNodes.add(w);
    this.highlightWbsSubject.next(w);
  }

  clearFilter(): void {
    this.filterSubject.next({ n: null, b: null });
  }

  backToWbsFromDrill(): void {
    const current = this.filterSubject.value;
    const n = current.n;
    this.activeTabSubject.next('wbs');
    this.highlightWbsSubject.next(n);
    if (n) {
      const ancs = this.ancestorMap[n] || [];
      ancs.slice(0, -1).forEach(id => this.openNodes.add(id));
      if (this.nodeMap[n] && this.nodeMap[n].lvl !== 'Activity') {
        this.openNodes.add(n);
      }
    }
    this.filterSubject.next({ n: null, b: null });
  }

  expandAll(): void {
    this.rows.forEach(r => {
      if (r.lvl !== 'Activity') {
        this.openNodes.add(r.id);
      }
    });
  }

  collapseAll(): void {
    this.openNodes.clear();
  }

  toggleNode(id: string): void {
    if (this.openNodes.has(id)) {
      this.openNodes.delete(id);
    } else {
      this.openNodes.add(id);
    }
  }

  toggleTrials(): void {
    this.showTrialsSubject.next(!this.showTrialsSubject.value);
  }

  addMaterial(item: MaterialItem): void {
    this.ml.push(item);
    this.recalculate();
  }

  updateMaterial(code: number, updated: Partial<MaterialItem>): void {
    const idx = this.ml.findIndex(m => m.code === code);
    if (idx !== -1) {
      this.ml[idx] = { ...this.ml[idx], ...updated };
      this.recalculate();
    }
  }

  deleteMaterial(code: number): void {
    const idx = this.ml.findIndex(m => m.code === code);
    if (idx !== -1) {
      this.ml.splice(idx, 1);
      this.recalculate();
    }
  }

  addRldRow(row: RldRow): void {
    const t1Idx = this.rld.rows.findIndex(r => r.k === 't1');
    if (t1Idx !== -1) {
      this.rld.rows.splice(t1Idx, 0, row);
    } else {
      this.rld.rows.push(row);
    }
    this.recalculate();
  }

  updateRldRow(index: number, updated: Partial<RldRow>): void {
    if (this.rld.rows[index]) {
      this.rld.rows[index] = { ...this.rld.rows[index], ...updated };
      this.recalculate();
    }
  }

  deleteRldRow(index: number): void {
    if (this.rld.rows[index]) {
      this.rld.rows.splice(index, 1);
      this.recalculate();
    }
  }

  formatCurrency(val: number | null | undefined): string {
    if (val == null || isNaN(val)) return '—';
    return Math.round(val).toLocaleString('en-IN');
  }

  formatCurrencyDec(val: number | null | undefined): string {
    if (val == null || isNaN(val)) return '—';
    if (Math.abs(val) < 100 && val % 1 !== 0) {
      return val.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }
    return Math.round(val).toLocaleString('en-IN');
  }
}

