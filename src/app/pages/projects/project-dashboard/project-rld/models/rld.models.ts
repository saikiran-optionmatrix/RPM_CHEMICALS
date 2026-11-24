export interface ProjectMaster {
  code: string;
  mol: string;
  name: string;
  div: string;
  pri: string;
  market: string;
  pm: string;
  innov: string;
  brand: string;
  istr: string;
  ipack: string;
  demo?: boolean;
}

export interface ComparatorItem {
  id: string;
  p: string;
  strength: string;
  form: string;
  pres: string;
  fill: string;
  market: string;
  pool: string;
  brand: string;
  pack: string;
  upp: number;
  unit: string;
  mfr: string;
  mah: string;
  purch: string;
  idType: string;
  idNo: string;
  rld: string;
  rs: string;
  rmp: string;
  evid: string;
  rims: string;
  verOn: string;
  verBy: string;
  ra: string;
  raBy: string;
  raOn: string;
  rem: string;
  mfgC?: string;
}

export interface ComputedComparator extends ComparatorItem {
  reverify: string;
  status: string;
  proj: ProjectMaster;
}

export interface UtilisationRequirement {
  id: string;
  c: string;
  wbs: string;
  cat: string; // 'PE' | 'R&D' | 'BE'
  act: string;
  basis: string;
  base: number;
  buf: number;
  bufBy: string;
  need: string;
  use: number; // months
  owner: string;
  gate: string;
  proc: string;
}

export interface ComputedRequirement extends UtilisationRequirement {
  cmp: ComputedComparator;
  proj: string;
  pool: string;
  unit: string;
  compSt: string;
  total: number;
  minExp: string;
  covered: number;
  short: number;
  issued: number;
  consumed: number;
  returned: number;
  atLab: number;
  p?: ComputedProcurement;
  pOrder: string;
  pRec: string;
  expSup: string;
  latest: string;
  days: number;
  expFail: boolean;
  status: string;
  bucket: string;
  trace: string;
}

export interface ProcurementLine {
  id: string;
  c: string;
  wbs: string;
  sup: string;
  q: string;
  qd: string;
  cur: string;
  price: number;
  packs: number;
  fr: number;
  oth: number;
  bud: number;
  po: string;
  od: string;
  lt: number[]; // [sourcing, transit, customs, acceptance]
  com: string;
  rec: string;
}

export interface ComputedProcurement extends ProcurementLine {
  cmp: ComputedComparator;
  pool: string;
  proj: string;
  units: number;
  fx: number;
  goods: number;
  duty: number;
  landed: number;
  lpu: number;
  ltT: number;
  var: number;
  varPct: number;
  needBy: string;
  latest: string;
  expReady: string;
  status: string;
  owner: string;
}

export interface LotItem {
  id: string;
  c: string;
  pr: string;
  bn: string;
  exp: string;
  sto: string;
  loc: string;
  rd: string;
  ck: string[]; // ['Y', 'Y', 'Y', 'Y']
  qa: string; // 'Accepted' | 'Quarantine' | 'Rejected'
  qaRef: string;
  qaBy: string;
  qaOn: string;
  mfgC?: string;
}

export interface ComputedLot extends LotItem {
  cmp: ComputedComparator;
  pool: string;
  rr: string;
  ready: string;
  received: number;
  wo: number;
  cap: number;
  unit: string;
  rcvBy: string;
  rcvOn: string;
  grn: string;
  issued: number;
  returned: number;
  physical: number;
  reserved: number;
  usable: number;
  days: number;
  expFlag: boolean;
  lpu: number;
  risk: number;
}

export interface AllocationItem {
  id: string;
  req: string;
  lot: string;
  q: number;
  st: string; // 'Reserved' | 'Issued' | 'Released'
  d: string;
  by: string;
  allocBy?: string;
}

export interface ComputedAllocation extends AllocationItem {
  r: ComputedRequirement;
  l: ComputedLot;
  compOk: boolean;
  poolOk: boolean;
  lotOk: boolean;
  expOk: boolean;
  pre: string;
  cum: number | null;
  res: string;
  proj: string;
}

export interface StockTransaction {
  id: string;
  d: string;
  t: string; // 'Receipt' | 'Issue' | 'Consumption' | 'Return' | 'Write-off'
  lot: string;
  req: string;
  q: number;
  by: string;
  from: string;
  to: string;
  doc: string;
  rem?: string;
  rej?: string;
  proj?: string;
  chk?: string;
}

export interface StockPool {
  code: string;
  desc: string;
  unit: string;
  projects: string[];
  demand: number;
  covered: number;
  uncovered: number;
  physical: number;
  usable: number;
  notUsable: number;
  onOrder: number;
  gap: number;
  expiring: number;
}

export interface RldAlert {
  r: ComputedRequirement;
  f: {
    comp: boolean;
    buf: boolean;
    overdue: boolean;
    delay: boolean;
    insuff: boolean;
    expiry: boolean;
  };
  n: number;
  sev: string; // 'High' | 'Medium' | 'Low'
  msg: string;
  owner: string;
  action: string;
  due: string;
  ast: string; // 'Open' | 'In progress' | 'Closed'
}

export interface AuditEntry {
  timestamp: string;
  user: string;
  role: string;
  record: string;
  id: string;
  field: string;
  change: string;
  projectCode: string;
}

export interface RldKpis {
  approvedComparators: string;
  approvedCount: number;
  comparatorTotal: number;
  totalRequirement: number;
  reqCount: number;
  allocatedUsable: number;
  shortfall: number;
  nextOpenNeedDate: string;
  openReqsCount: number;
  alertsCount: number;
  highAlertsCount: number;
  landedVsBudget: number;
  lotsCount: number;
  procCount: number;
}
