export type WbsLevel = 'Gate' | 'Stage' | 'Deliverable' | 'Activity';

export interface WbsNode {
  id: string;
  lvl: WbsLevel;
  name: string;
  resp: string;
  F: number;
  G: number;
  gate: string;
}

export interface RateCard {
  fn: string;
  res: string;
  ac: number;
  tpl?: number;
}

export interface ManpowerAllocation {
  w: string;
  rc: number;
  hc: number;
  hpd: number;
  occ: number;
  cyc: number;
  acyc: number;
  tpl?: number;
}

export interface MaterialItem {
  cat: string;
  code: number;
  d: string;
  uom: string;
  price: number;
  pq: number;
  cyc: number | null;
  inq: number;
  inu: string;
  cf: number;
  dbs: number;
  inq2: number;
  inq3: number;
  sbs: number;
  ebs: number;
  flat: number;
  firstAlt: number;
  wdev: string;
  wsu: string;
  customTrials?: { inputQty: number; cost: number }[];
}

export interface CapexItem {
  sl: number | null;
  d: string;
  no: number | null;
  ven: string | null;
  usd: number | null;
  fx: number;
  asset: number | null;
  w: string | null;
}

export interface RldRow {
  k: string;
  b?: string;
  c?: number | string;
  d?: string;
  e?: number;
  f?: number;
  g?: number;
  h?: number;
  w?: string;
  hf?: string;
  ef?: string;
}

export interface RldData {
  rows: RldRow[];
}

export interface AnalyticalQcItem {
  sl: number;
  d: string;
  i: number;
  w: string;
}

export interface AnalyticalColItem {
  sl?: number | string;
  t?: string;
  d?: string;
  d2?: string;
  e?: string;
  f: string;
  g: number | null;
  h: number;
  span?: number;
  cont?: number;
}

export interface AnalyticalCostData {
  qc: AnalyticalQcItem[];
  cols: AnalyticalColItem[];
  colW: string;
  third: { sl: number }[];
  thirdW: string;
  batches: [string, number][];
  colTime: number;
  colReq: number;
}

export type CostBucket = 'man' | 'mat' | 'res';

export interface RollupLine {
  w: string;
  b: CostBucket;
  s: 'man' | 'ml' | 'rld' | 'ana' | 'cap';
  ref: string | number;
  P: number;
  A: number;
}

export interface NodeAggregates {
  manP: number;
  manA: number;
  matP: number;
  matA: number;
  resP: number;
  resA: number;
  n: {
    man: number;
    mat: number;
    res: number;
  };
}

export type BudgetTabKey = 'wbs' | 'main' | 'ml' | 'cap' | 'man' | 'rld' | 'ana';

export interface BudgetFilterState {
  n: string | null;
  b: CostBucket | null;
}

export interface KpiSummary {
  budget: number;
  actual: number;
  completionPercent: number;
  manP: number;
  matP: number;
  resP: number;
  notEstimatedCount: number;
  baseline: string;
}

