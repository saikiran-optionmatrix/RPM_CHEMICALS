import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ProjectMaster,
  ComparatorItem,
  ComputedComparator,
  UtilisationRequirement,
  ComputedRequirement,
  ProcurementLine,
  ComputedProcurement,
  LotItem,
  ComputedLot,
  AllocationItem,
  ComputedAllocation,
  StockTransaction,
  StockPool,
  RldAlert,
  AuditEntry,
  RldKpis
} from '../models/rld.models';

export const ASOF_DATE = '2026-11-03';

export const RLD_SETTINGS = {
  expMarginM: 1,
  expWindowD: 90,
  reverifyM: 12,
  defLT: { src: 30, tr: 7, clr: 14, acc: 7 },
  dutyRate: 0.0825,
  fx: { INR: 1, USD: 88.0, EUR: 96.5 } as { [key: string]: number },
  raOwner: 'RA Head',
  custodian: 'Ravi Shinde (RLD custodian)',
  procLead: 'Purchase Manager'
};

export const INITIAL_PROJECTS: ProjectMaster[] = [
  {
    code: '2026/CHM/001',
    mol: 'Acrylic Emulsion Binder 50% Solids',
    name: 'Acrylic Emulsion Binder 50% Solids',
    div: 'Oncology',
    pri: 'High',
    market: 'Russia / EAEU',
    pm: 'R. Kulkarni',
    innov: 'Janssen-Cilag (Johnson & Johnson)',
    brand: 'Zytiga',
    istr: '250 mg, 500 mg',
    ipack: '250 mg: HDPE bottle of 120 tablets; 500 mg: blister pack of 56 or 60 tablets'
  },
  {
    code: '2026/CHM/002',
    mol: 'Azacitidine',
    name: 'Azacitidine Powder for Suspension for Injection',
    div: 'Oncology',
    pri: 'Medium',
    market: 'Russia / EAEU',
    pm: 'S. Iyer',
    innov: 'Celgene (Bristol-Myers Squibb)',
    brand: 'Vidaza',
    istr: '25 mg/mL after reconstitution (100 mg/vial)',
    ipack: '1 glass vial containing 100 mg powder'
  },
  {
    code: '2026/CHM/003',
    mol: 'Fulvestrant',
    name: 'Fulvestrant solution for injection (Prefilled Syringe)',
    div: 'Oncology',
    pri: 'Critical',
    market: 'Russia / EAEU',
    pm: 'A. Menon',
    innov: 'AstraZeneca',
    brand: 'Faslodex',
    istr: '250 mg/5 mL',
    ipack: '1 or 2 glass pre-filled syringes (5 mL)'
  },
  {
    code: '2026/CHM/004',
    mol: 'Iohexol',
    name: 'Iohexol solution for injection',
    div: 'Diagnostics / Contrast Media',
    pri: 'Critical',
    market: 'Russia / EAEU',
    pm: 'P. Nair',
    innov: 'GE Healthcare',
    brand: 'Omnipaque',
    istr: '140–350 mg I/mL',
    ipack: 'Glass vials / PP bottles 10–500 mL'
  },
  {
    code: '2026/CHM/005',
    mol: 'Temozolomide',
    name: 'Temozolomide Hard Gelatin Capsules',
    div: 'Oncology',
    pri: 'Medium',
    market: 'Russia / EAEU',
    pm: 'V. Rao',
    innov: 'Merck Sharp & Dohme',
    brand: 'Temodal',
    istr: '5–250 mg',
    ipack: 'Amber glass bottles or sachets of 5 or 20 capsules'
  },
  {
    code: '2026/CHM/006',
    mol: 'Acrylic Emulsion Binder 50% Solids',
    name: 'Acrylic Emulsion Binder 50% Solids FCT – EU (demo record)',
    div: 'Oncology',
    pri: 'High',
    market: 'EU (DCP)',
    pm: 'R. Kulkarni',
    innov: 'Janssen-Cilag (Johnson & Johnson)',
    brand: 'Zytiga',
    istr: '500 mg',
    ipack: 'Blister pack of 56 or 60 tablets',
    demo: true
  }
];

export const INITIAL_COMPARATORS: ComparatorItem[] = [
  {
    id: 'CMP-001',
    p: '2026/CHM/001',
    strength: '500 mg',
    form: 'Film-coated tablet',
    pres: 'Blister, 60 tablets',
    fill: 'NA',
    market: 'Russia / EAEU',
    pool: 'RP-ZYT500-DE',
    brand: 'Zytiga® 500 mg',
    pack: '60 tablets / carton',
    upp: 60,
    unit: 'tablets',
    mfr: 'Janssen-Cilag',
    mah: 'Janssen-Cilag International NV',
    purch: 'Germany',
    idType: 'EU MA no.',
    idNo: 'EU/1/11/714/002',
    rld: 'N/A',
    rs: 'N/A',
    rmp: 'Yes',
    evid: 'EMA EPAR',
    rims: 'RIMS-RLD-001-A',
    verOn: '2026-08-05',
    verBy: 'RA Exec – EAEU',
    ra: 'Approved',
    raBy: 'RA Head',
    raOn: '2026-08-08',
    rem: 'Primary reference listed drug for EAEU dossier',
    mfgC: 'Italy'
  },
  {
    id: 'CMP-002',
    p: '2026/CHM/001',
    strength: '250 mg',
    form: 'Tablet',
    pres: 'HDPE bottle, 120 tablets',
    fill: 'NA',
    market: 'US (FDA)',
    pool: 'RP-ZYT250-US',
    brand: 'Zytiga® 250 mg',
    pack: '120 tablets / bottle',
    upp: 120,
    unit: 'tablets',
    mfr: 'Janssen Biotech',
    mah: 'Janssen Biotech, Inc.',
    purch: 'USA',
    idType: 'NDA / NDC',
    idNo: 'NDC 57894-150-12',
    rld: 'Yes',
    rs: 'Yes',
    rmp: 'N/A',
    evid: 'FDA Orange Book',
    rims: 'RIMS-RLD-001-B',
    verOn: '2026-08-05',
    verBy: 'RA Exec – US',
    ra: 'Approved',
    raBy: 'RA Head',
    raOn: '2026-08-08',
    rem: 'Supportive comparator – characterisation only',
    mfgC: 'Puerto Rico (USA)'
  },
  {
    id: 'CMP-003',
    p: '2026/CHM/002',
    strength: '100 mg/vial',
    form: 'Powder for suspension for injection',
    pres: 'Single vial',
    fill: 'NA',
    market: 'Russia / EAEU',
    pool: 'RP-VID100-DE',
    brand: 'Vidaza® 100 mg',
    pack: '1 vial / carton',
    upp: 1,
    unit: 'vials',
    mfr: 'Celgene / BMS',
    mah: 'Bristol-Myers Squibb Pharma EEIG',
    purch: 'Germany',
    idType: 'EU MA no.',
    idNo: 'EU/1/08/488/001',
    rld: 'N/A',
    rs: 'N/A',
    rmp: 'Yes',
    evid: 'EMA EPAR',
    rims: 'RIMS-RLD-002-A',
    verOn: '2026-10-22',
    verBy: 'RA Exec – EAEU',
    ra: 'Pending',
    raBy: '',
    raOn: '',
    rem: 'EAEU reference acceptability under review',
    mfgC: 'Italy'
  },
  {
    id: 'CMP-004',
    p: '2026/CHM/003',
    strength: '250 mg/5 mL',
    form: 'Solution for injection in PFS',
    pres: 'Pre-filled syringe 5 mL',
    fill: '5 mL',
    market: 'Russia / EAEU',
    pool: 'RP-FAS250-DE',
    brand: 'Faslodex® 250 mg/5 mL',
    pack: '2 PFS / carton',
    upp: 2,
    unit: 'PFS',
    mfr: 'AstraZeneca',
    mah: 'AstraZeneca AB',
    purch: 'Germany',
    idType: 'EU MA no.',
    idNo: 'EU/1/03/269/001',
    rld: 'N/A',
    rs: 'N/A',
    rmp: 'Yes',
    evid: 'EMA EPAR',
    rims: 'RIMS-RLD-003-A',
    verOn: '2026-07-12',
    verBy: 'RA Exec – EAEU',
    ra: 'Approved',
    raBy: 'RA Head',
    raOn: '2026-07-15',
    rem: 'Approved comparator for bioequivalence reference arm',
    mfgC: 'United Kingdom'
  },
  {
    id: 'CMP-005',
    p: '2026/CHM/004',
    strength: '350 mg I/mL',
    form: 'Solution for injection',
    pres: '100 mL bottle',
    fill: '100 mL',
    market: 'Russia / EAEU',
    pool: 'RP-OMN350-DE',
    brand: 'Omnipaque® 350',
    pack: '10 bottles / pack',
    upp: 10,
    unit: 'bottles',
    mfr: 'GE Healthcare',
    mah: 'GE Healthcare Buchler GmbH',
    purch: 'Germany',
    idType: 'National MA no.',
    idNo: 'MA 04221/008',
    rld: 'N/A',
    rs: 'N/A',
    rmp: 'Yes',
    evid: 'PharmNet.Bund',
    rims: 'RIMS-RLD-004-A',
    verOn: '2026-07-20',
    verBy: 'RA Exec – EAEU',
    ra: 'Approved',
    raBy: 'RA Head',
    raOn: '2026-07-24',
    rem: 'Contrast medium reference standard for analytical assays',
    mfgC: 'Ireland'
  },
  {
    id: 'CMP-006',
    p: '2026/CHM/005',
    strength: '100 mg',
    form: 'Hard capsule',
    pres: 'Sachet / bottle, 5 capsules',
    fill: 'NA',
    market: 'Russia / EAEU',
    pool: 'RP-TMD100-DE',
    brand: 'Temodal® 100 mg',
    pack: '5 capsules / pack',
    upp: 5,
    unit: 'capsules',
    mfr: 'MSD',
    mah: 'Merck Sharp & Dohme B.V.',
    purch: 'Germany',
    idType: 'EU MA no.',
    idNo: 'EU/1/98/096/001',
    rld: 'N/A',
    rs: 'N/A',
    rmp: 'Yes',
    evid: 'EMA EPAR',
    rims: 'RIMS-RLD-005-A',
    verOn: '2026-06-25',
    verBy: 'RA Exec – EAEU',
    ra: 'Approved',
    raBy: 'RA Head',
    raOn: '2026-06-30',
    rem: 'Reference listed drug for in vitro dissolution & pilot BE',
    mfgC: 'Belgium'
  },
  {
    id: 'CMP-007',
    p: '2026/CHM/006',
    strength: '500 mg',
    form: 'Film-coated tablet',
    pres: 'Blister, 60 tablets',
    fill: 'NA',
    market: 'EU (DCP)',
    pool: 'RP-ZYT500-DE',
    brand: 'Zytiga® 500 mg',
    pack: '60 tablets / carton',
    upp: 60,
    unit: 'tablets',
    mfr: 'Janssen-Cilag',
    mah: 'Janssen-Cilag International NV',
    purch: 'Germany',
    idType: 'EU MA no.',
    idNo: 'EU/1/11/714/002',
    rld: 'N/A',
    rs: 'N/A',
    rmp: 'Yes',
    evid: 'EMA EPAR',
    rims: 'RIMS-RLD-006-A',
    verOn: '2026-10-01',
    verBy: 'RA Exec – EU',
    ra: 'Approved',
    raBy: 'RA Head',
    raOn: '2026-10-06',
    rem: 'Shares stock pool RP-ZYT500-DE with 2026/CHM/001',
    mfgC: 'Italy'
  }
];

export const INITIAL_REQUIREMENTS: UtilisationRequirement[] = [
  {
    id: 'R-0101',
    c: 'CMP-001',
    wbs: '4.2.1',
    cat: 'PE',
    act: 'RMP/RLD physical & chemical characterisation',
    basis: '3 lots × 30 tablets',
    base: 90,
    buf: 0,
    bufBy: '',
    need: '2026-11-15',
    use: 2,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-01'
  },
  {
    id: 'R-0102',
    c: 'CMP-001',
    wbs: '4.4.4',
    cat: 'R&D',
    act: 'Dissolution mapping with innovator product',
    basis: '10 profiles × 12 tablets',
    base: 120,
    buf: 0.1,
    bufBy: 'R&D Head',
    need: '2026-11-20',
    use: 2,
    owner: 'FR&D Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-01'
  },
  {
    id: 'R-0103',
    c: 'CMP-001',
    wbs: '5.5.1',
    cat: 'BE',
    act: 'Pilot BE – reference arm & retention',
    basis: '24 subjects × 1 tablet + 96 retention',
    base: 120,
    buf: 0,
    bufBy: '',
    need: '2027-02-15',
    use: 3,
    owner: 'Clinical Lead',
    gate: 'G4 – Scale-up & Pilot BE',
    proc: 'PR-01'
  },
  {
    id: 'R-0104',
    c: 'CMP-002',
    wbs: '4.2.2',
    cat: 'PE',
    act: 'RMP/RLD chemical characterisation (250 mg)',
    basis: '2 lots × 30 tablets',
    base: 60,
    buf: 0,
    bufBy: '',
    need: '2026-12-10',
    use: 2,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-02'
  },
  {
    id: 'R-0201',
    c: 'CMP-003',
    wbs: '4.2.1',
    cat: 'PE',
    act: 'RMP/RLD physical & chemical characterisation',
    basis: '3 lots × 6 vials',
    base: 18,
    buf: 0,
    bufBy: '',
    need: '2027-01-05',
    use: 3,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-03'
  },
  {
    id: 'R-0202',
    c: 'CMP-003',
    wbs: '4.4.12',
    cat: 'R&D',
    act: 'Reverse engineering of reference product',
    basis: '4 trials × 3 vials',
    base: 12,
    buf: 0.25,
    bufBy: '',
    need: '2027-01-20',
    use: 3,
    owner: 'FR&D Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-03'
  },
  {
    id: 'R-0301',
    c: 'CMP-004',
    wbs: '4.2.1',
    cat: 'PE',
    act: 'RMP/RLD physical & chemical characterisation',
    basis: '3 lots × 6 PFS',
    base: 18,
    buf: 0,
    bufBy: '',
    need: '2026-11-20',
    use: 2,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-05'
  },
  {
    id: 'R-0302',
    c: 'CMP-004',
    wbs: '4.4.2',
    cat: 'R&D',
    act: 'Prototype development – viscosity, injectability, release',
    basis: '4 trials × 3 PFS',
    base: 12,
    buf: 0,
    bufBy: '',
    need: '2026-12-01',
    use: 2,
    owner: 'FR&D Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-06'
  },
  {
    id: 'R-0303',
    c: 'CMP-004',
    wbs: '5.5.1',
    cat: 'BE',
    act: 'Pilot BE – reference arm (500 mg = 2 PFS)',
    basis: '24 subjects × 2 PFS + 24 retention',
    base: 72,
    buf: 0.1,
    bufBy: 'R&D Head',
    need: '2027-01-15',
    use: 3,
    owner: 'Clinical Lead',
    gate: 'G4 – Scale-up & Pilot BE',
    proc: 'PR-06'
  },
  {
    id: 'R-0401',
    c: 'CMP-005',
    wbs: '4.2.1',
    cat: 'PE',
    act: 'RMP/RLD physical & chemical characterisation',
    basis: '2 lots × 6 bottles',
    base: 12,
    buf: 0,
    bufBy: '',
    need: '2026-11-25',
    use: 2,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-07'
  },
  {
    id: 'R-0402',
    c: 'CMP-005',
    wbs: '4.4.3',
    cat: 'R&D',
    act: 'Comparative stability – reference arm (6 months)',
    basis: '3 time points × 3 bottles',
    base: 9,
    buf: 0,
    bufBy: '',
    need: '2026-12-01',
    use: 6,
    owner: 'Stability Lead',
    gate: 'G3 – Prototype development',
    proc: ''
  },
  {
    id: 'R-0501',
    c: 'CMP-006',
    wbs: '4.2.1',
    cat: 'PE',
    act: 'RMP/RLD physical & chemical characterisation',
    basis: '2 lots × 15 capsules',
    base: 30,
    buf: 0,
    bufBy: '',
    need: '2026-10-20',
    use: 2,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-08'
  },
  {
    id: 'R-0502',
    c: 'CMP-006',
    wbs: '4.4.4',
    cat: 'R&D',
    act: 'Dissolution mapping with innovator product',
    basis: '5 profiles × 12 capsules',
    base: 60,
    buf: 0,
    bufBy: '',
    need: '2026-12-15',
    use: 2,
    owner: 'FR&D Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-08'
  },
  {
    id: 'R-0601',
    c: 'CMP-007',
    wbs: '4.2.1',
    cat: 'PE',
    act: 'RMP/RLD physical & chemical characterisation',
    basis: '3 lots × 30 tablets',
    base: 90,
    buf: 0,
    bufBy: '',
    need: '2026-12-01',
    use: 2,
    owner: 'ARD Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-01'
  },
  {
    id: 'R-0602',
    c: 'CMP-007',
    wbs: '4.4.6',
    cat: 'R&D',
    act: 'Multimedia dissolution mapping with reference product',
    basis: '3 media × 6 profiles × 12 tablets',
    base: 216,
    buf: 0,
    bufBy: '',
    need: '2026-12-20',
    use: 2,
    owner: 'FR&D Lead',
    gate: 'G3 – Prototype development',
    proc: 'PR-10'
  }
];

export const INITIAL_PROCUREMENT: ProcurementLine[] = [
  {
    id: 'PR-01',
    c: 'CMP-001',
    wbs: '3.1.2 / 5.4.5',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-071',
    qd: '2026-08-05',
    cur: 'EUR',
    price: 2950,
    packs: 10,
    fr: 45000,
    oth: 12000,
    bud: 3000000,
    po: 'PO/RD/26/0388',
    od: '2026-08-14',
    lt: [14, 7, 14, 5],
    com: '2026-09-22',
    rec: '2026-09-25'
  },
  {
    id: 'PR-02',
    c: 'CMP-002',
    wbs: '3.1.2',
    sup: 'US specialty distributor',
    q: 'Q-26-074',
    qd: '2026-08-10',
    cur: 'USD',
    price: 2850,
    packs: 2,
    fr: 30000,
    oth: 8000,
    bud: 560000,
    po: 'PO/RD/26/0392',
    od: '2026-08-20',
    lt: [14, 7, 14, 5],
    com: '2026-09-28',
    rec: '2026-09-30'
  },
  {
    id: 'PR-03',
    c: 'CMP-003',
    wbs: '3.1.2',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-118',
    qd: '2026-10-18',
    cur: 'EUR',
    price: 380,
    packs: 30,
    fr: 25000,
    oth: 6000,
    bud: 1000000,
    po: '',
    od: '',
    lt: [30, 7, 21, 7],
    com: '',
    rec: ''
  },
  {
    id: 'PR-04',
    c: 'CMP-004',
    wbs: '3.1.2',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-080',
    qd: '2026-08-28',
    cur: 'EUR',
    price: 520,
    packs: 5,
    fr: 20000,
    oth: 5000,
    bud: 280000,
    po: 'PO/RD/26/0410',
    od: '2026-09-05',
    lt: [21, 7, 14, 7],
    com: '2026-10-08',
    rec: '2026-10-10'
  },
  {
    id: 'PR-05',
    c: 'CMP-004',
    wbs: '3.1.2',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-097',
    qd: '2026-09-22',
    cur: 'EUR',
    price: 540,
    packs: 10,
    fr: 25000,
    oth: 5000,
    bud: 560000,
    po: 'PO/RD/26/0451',
    od: '2026-09-28',
    lt: [21, 7, 14, 7],
    com: '2026-10-28',
    rec: '2026-10-30'
  },
  {
    id: 'PR-06',
    c: 'CMP-004',
    wbs: '5.4.5',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-109',
    qd: '2026-10-14',
    cur: 'EUR',
    price: 520,
    packs: 20,
    fr: 40000,
    oth: 8000,
    bud: 1100000,
    po: 'PO/RD/26/0502',
    od: '2026-10-20',
    lt: [30, 7, 14, 7],
    com: '2026-12-20',
    rec: ''
  },
  {
    id: 'PR-07',
    c: 'CMP-005',
    wbs: '3.1.2',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-066',
    qd: '2026-08-01',
    cur: 'EUR',
    price: 610,
    packs: 3,
    fr: 30000,
    oth: 5000,
    bud: 180000,
    po: 'PO/RD/26/0379',
    od: '2026-08-10',
    lt: [15, 7, 10, 5],
    com: '2026-09-10',
    rec: '2026-09-12'
  },
  {
    id: 'PR-08',
    c: 'CMP-006',
    wbs: '3.1.2',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-083',
    qd: '2026-08-24',
    cur: 'EUR',
    price: 165,
    packs: 20,
    fr: 18000,
    oth: 4000,
    bud: 300000,
    po: 'PO/RD/26/0405',
    od: '2026-08-30',
    lt: [10, 7, 10, 5],
    com: '2026-09-18',
    rec: '2026-09-20'
  },
  {
    id: 'PR-10',
    c: 'CMP-007',
    wbs: '3.1.2',
    sup: 'EU wholesaler (Germany)',
    q: 'Q-26-121',
    qd: '2026-10-22',
    cur: 'EUR',
    price: 3010,
    packs: 4,
    fr: 35000,
    oth: 8000,
    bud: 1150000,
    po: 'PO/RD/26/0517',
    od: '2026-10-28',
    lt: [14, 7, 14, 7],
    com: '2026-12-10',
    rec: ''
  }
];

export const INITIAL_LOTS: LotItem[] = [
  {
    id: 'LOT-001',
    c: 'CMP-001',
    pr: 'PR-01',
    bn: 'DEMO-ZA500-01',
    exp: '2028-03-31',
    sto: 'Below 30 °C',
    loc: 'RLD store – cabinet R1',
    rd: '2026-09-25',
    ck: ['Y', 'Y', 'Y', 'Y'],
    qa: 'Accepted',
    qaRef: 'QA-RLD-REL-0310',
    qaBy: 'Dr. Kavita Joshi',
    qaOn: '2026-09-29',
    mfgC: 'Italy'
  },
  {
    id: 'LOT-002',
    c: 'CMP-002',
    pr: 'PR-02',
    bn: 'DEMO-ZA250-07',
    exp: '2027-12-31',
    sto: 'Below 30 °C',
    loc: 'RLD store – cabinet R1',
    rd: '2026-09-30',
    ck: ['Y', 'Y', 'Y', 'Y'],
    qa: 'Accepted',
    qaRef: 'QA-RLD-REL-0314',
    qaBy: 'Dr. Kavita Joshi',
    qaOn: '2026-10-03',
    mfgC: 'Puerto Rico (USA)'
  },
  {
    id: 'LOT-003',
    c: 'CMP-004',
    pr: 'PR-04',
    bn: 'DEMO-FAS-11',
    exp: '2027-09-30',
    sto: '2–8 °C',
    loc: 'Cold room CR-1, shelf 2',
    rd: '2026-10-10',
    ck: ['Y', 'Y', 'Y', 'Y'],
    qa: 'Accepted',
    qaRef: 'QA-RLD-REL-0322',
    qaBy: 'Dr. Kavita Joshi',
    qaOn: '2026-10-14',
    mfgC: 'United Kingdom'
  },
  {
    id: 'LOT-004',
    c: 'CMP-004',
    pr: 'PR-05',
    bn: 'DEMO-FAS-14',
    exp: '2028-01-31',
    sto: '2–8 °C',
    loc: 'Cold room CR-1 – quarantine',
    rd: '2026-10-30',
    ck: ['Y', 'Y', 'Pending', 'Y'],
    qa: 'Quarantine',
    qaRef: '',
    qaBy: '',
    qaOn: '',
    mfgC: 'United Kingdom'
  },
  {
    id: 'LOT-005',
    c: 'CMP-005',
    pr: 'PR-07',
    bn: 'DEMO-OMN-50',
    exp: '2027-03-31',
    sto: 'Below 30 °C, protect from light',
    loc: 'RLD store – rack C2',
    rd: '2026-09-12',
    ck: ['Y', 'Y', 'Y', 'Y'],
    qa: 'Accepted',
    qaRef: 'QA-RLD-REL-0301',
    qaBy: 'Dr. Kavita Joshi',
    qaOn: '2026-09-16',
    mfgC: 'Ireland'
  },
  {
    id: 'LOT-006',
    c: 'CMP-005',
    pr: 'PR-07',
    bn: 'DEMO-OMN-29',
    exp: '2027-01-20',
    sto: 'Below 30 °C, protect from light',
    loc: 'RLD store – rack C2',
    rd: '2026-09-12',
    ck: ['Y', 'Y', 'Y', 'Y'],
    qa: 'Accepted',
    qaRef: 'QA-RLD-REL-0302',
    qaBy: 'Dr. Kavita Joshi',
    qaOn: '2026-09-16',
    mfgC: 'Ireland'
  },
  {
    id: 'LOT-007',
    c: 'CMP-006',
    pr: 'PR-08',
    bn: 'DEMO-TMD-03',
    exp: '2028-06-30',
    sto: 'Below 25 °C',
    loc: 'RLD store – cabinet R2',
    rd: '2026-09-20',
    ck: ['Y', 'Y', 'Y', 'Y'],
    qa: 'Accepted',
    qaRef: 'QA-RLD-REL-0306',
    qaBy: 'Dr. Kavita Joshi',
    qaOn: '2026-09-24',
    mfgC: 'Belgium'
  }
];

export const INITIAL_ALLOCATIONS: AllocationItem[] = [
  { id: 'AL-01', req: 'R-0101', lot: 'LOT-001', q: 90, st: 'Issued', d: '2026-10-01', by: 'Anjali Deshmukh', allocBy: 'Ravi Shinde' },
  { id: 'AL-02', req: 'R-0102', lot: 'LOT-001', q: 132, st: 'Reserved', d: '2026-10-01', by: 'Priya Sawant', allocBy: 'Ravi Shinde' },
  { id: 'AL-03', req: 'R-0103', lot: 'LOT-001', q: 120, st: 'Reserved', d: '2026-10-01', by: 'Dr. Neha Sharma', allocBy: 'Ravi Shinde' },
  { id: 'AL-04', req: 'R-0104', lot: 'LOT-002', q: 60, st: 'Reserved', d: '2026-10-03', by: 'Anjali Deshmukh', allocBy: 'Ravi Shinde' },
  { id: 'AL-05', req: 'R-0301', lot: 'LOT-003', q: 10, st: 'Reserved', d: '2026-10-15', by: 'Suresh Patil', allocBy: 'Ravi Shinde' },
  { id: 'AL-06', req: 'R-0302', lot: 'LOT-004', q: 12, st: 'Reserved', d: '2026-10-31', by: 'Priya Sawant', allocBy: 'Ravi Shinde' },
  { id: 'AL-07', req: 'R-0401', lot: 'LOT-005', q: 12, st: 'Issued', d: '2026-10-20', by: 'Suresh Patil', allocBy: 'Ravi Shinde' },
  { id: 'AL-08', req: 'R-0402', lot: 'LOT-005', q: 9, st: 'Reserved', d: '2026-10-20', by: 'Nikhil Rane', allocBy: 'Ravi Shinde' },
  { id: 'AL-09', req: 'R-0501', lot: 'LOT-007', q: 30, st: 'Issued', d: '2026-10-10', by: 'Anjali Deshmukh', allocBy: 'Ravi Shinde' },
  { id: 'AL-10', req: 'R-0502', lot: 'LOT-007', q: 60, st: 'Reserved', d: '2026-10-10', by: 'Priya Sawant', allocBy: 'Ravi Shinde' },
  { id: 'AL-11', req: 'R-0601', lot: 'LOT-001', q: 90, st: 'Reserved', d: '2026-10-12', by: 'Suresh Patil', allocBy: 'Ravi Shinde' },
  { id: 'AL-12', req: 'R-0602', lot: 'LOT-001', q: 216, st: 'Reserved', d: '2026-10-29', by: 'Rahul Gaikwad', allocBy: 'Ravi Shinde' }
];

export const INITIAL_TRANSACTIONS: StockTransaction[] = [
  { id: 'TXN-001', d: '2026-09-12', t: 'Receipt', lot: 'LOT-005', req: '', q: 20, by: 'Courier – EU wholesaler', from: 'Courier – EU wholesaler', to: 'Meena Pillai', doc: 'GRN-26-0911' },
  { id: 'TXN-002', d: '2026-09-12', t: 'Receipt', lot: 'LOT-006', req: '', q: 10, by: 'Courier – EU wholesaler', from: 'Courier – EU wholesaler', to: 'Meena Pillai', doc: 'GRN-26-0911' },
  { id: 'TXN-003', d: '2026-09-20', t: 'Receipt', lot: 'LOT-007', req: '', q: 100, by: 'Courier – EU wholesaler', from: 'Courier – EU wholesaler', to: 'Meena Pillai', doc: 'GRN-26-0930' },
  { id: 'TXN-004', d: '2026-09-25', t: 'Receipt', lot: 'LOT-001', req: '', q: 600, by: 'Courier – EU wholesaler', from: 'Courier – EU wholesaler', to: 'Ravi Shinde', doc: 'GRN-26-0941' },
  { id: 'TXN-005', d: '2026-09-30', t: 'Receipt', lot: 'LOT-002', req: '', q: 240, by: 'Courier – US distributor', from: 'Courier – US distributor', to: 'Meena Pillai', doc: 'GRN-26-0952' },
  { id: 'TXN-006', d: '2026-10-05', t: 'Issue', lot: 'LOT-001', req: 'R-0101', q: 90, by: 'Ravi Shinde', from: 'Ravi Shinde', to: 'Anjali Deshmukh', doc: 'ISS-26-0301' },
  { id: 'TXN-007', d: '2026-10-10', t: 'Receipt', lot: 'LOT-003', req: '', q: 10, by: 'Courier – EU wholesaler', from: 'Courier – EU wholesaler', to: 'Ravi Shinde', doc: 'GRN-26-1004' },
  { id: 'TXN-008', d: '2026-10-15', t: 'Issue', lot: 'LOT-007', req: 'R-0501', q: 30, by: 'Meena Pillai', from: 'Meena Pillai', to: 'Anjali Deshmukh', doc: 'ISS-26-0312' },
  { id: 'TXN-009', d: '2026-10-20', t: 'Consumption', lot: 'LOT-007', req: 'R-0501', q: 28, by: 'Anjali Deshmukh', from: 'Anjali Deshmukh', to: '', doc: 'LNB-005-04' },
  { id: 'TXN-010', d: '2026-10-22', t: 'Return', lot: 'LOT-007', req: 'R-0501', q: 2, by: 'Anjali Deshmukh', from: 'Anjali Deshmukh', to: 'Meena Pillai', doc: 'RET-26-0041' },
  { id: 'TXN-011', d: '2026-10-25', t: 'Consumption', lot: 'LOT-001', req: 'R-0101', q: 60, by: 'Anjali Deshmukh', from: 'Anjali Deshmukh', to: '', doc: 'LNB-001-07' },
  { id: 'TXN-012', d: '2026-10-28', t: 'Issue', lot: 'LOT-005', req: 'R-0401', q: 12, by: 'Ravi Shinde', from: 'Ravi Shinde', to: 'Suresh Patil', doc: 'ISS-26-0328' },
  { id: 'TXN-013', d: '2026-10-30', t: 'Receipt', lot: 'LOT-004', req: '', q: 20, by: 'Courier – EU wholesaler', from: 'Courier – EU wholesaler', to: 'Meena Pillai', doc: 'GRN-26-1029' },
  { id: 'TXN-014', d: '2026-11-02', t: 'Issue', lot: 'LOT-004', req: 'R-0302', q: 6, by: 'Meena Pillai', from: 'Meena Pillai', to: 'Priya Sawant', doc: 'ISS-26-0331', rem: 'Attempted issue from quarantined lot', rej: 'BLOCKED – lot not QA-accepted (at time of request)' }
];

export const INITIAL_ACTIONS: { [key: string]: [string, string, string] } = {
  'R-0202': ['Approve 25% buffer; raise PO under PR-03', '2026-11-06', 'Open'],
  'R-0201': ['RA to approve CMP-003; place PR-03 immediately (latest order date passed)', '2026-11-05', 'Open'],
  'R-0301': ['Expedite CoA and QA release of LOT-004, then allocate 8 PFS', '2026-11-07', 'In progress'],
  'R-0302': ['Use LOT-004 after QA release, or expedite PR-06 (part-shipment)', '2026-11-10', 'Open'],
  'R-0303': ['Raise additional PO for the 40-PFS pool gap before 15-Nov', '2026-11-12', 'Open'],
  'R-0402': ['Procure a fresh lot with expiry ≥ 01-Jul-2027; release AL-08', '2026-11-10', 'Open'],
  'R-0602': ['Allocate 168 unreserved tablets from LOT-001 now; balance from PR-10', '2026-11-06', 'Open']
};

export const INITIAL_AUDIT: AuditEntry[] = [
  { timestamp: '2026-07-15 10:05', user: 'Dr. Sunita Rao (RA Head)', role: 'RA', record: 'Comparator', id: 'CMP-004', field: 'RA approval', change: 'Pending → Approved', projectCode: '2026/CHM/003' },
  { timestamp: '2026-07-24 11:05', user: 'Dr. Sunita Rao (RA Head)', role: 'RA', record: 'Comparator', id: 'CMP-005', field: 'RA approval', change: 'Pending → Approved', projectCode: '2026/CHM/004' },
  { timestamp: '2026-08-08 09:40', user: 'Dr. Sunita Rao (RA Head)', role: 'RA', record: 'Comparator', id: 'CMP-001', field: 'RA approval', change: 'Pending → Approved', projectCode: '2026/CHM/001' },
  { timestamp: '2026-08-08 09:42', user: 'Dr. Sunita Rao (RA Head)', role: 'RA', record: 'Comparator', id: 'CMP-002', field: 'RA approval', change: 'Pending → Approved', projectCode: '2026/CHM/001' },
  { timestamp: '2026-09-29 15:00', user: 'Dr. Kavita Joshi', role: 'Quality', record: 'Batch', id: 'LOT-001', field: 'QA disposition', change: 'Quarantine → Accepted', projectCode: '2026/CHM/001' },
  { timestamp: '2026-10-01 14:12', user: 'Dr. Ajay Kale (R&D Head)', role: 'R&D', record: 'Utilisation', id: 'R-0102', field: 'Buffer', change: '0% → 10% (approved)', projectCode: '2026/CHM/001' },
  { timestamp: '2026-10-06 12:30', user: 'Dr. Sunita Rao (RA Head)', role: 'RA', record: 'Comparator', id: 'CMP-007', field: 'RA approval', change: 'Pending → Approved', projectCode: '2026/CHM/006' },
  { timestamp: '2026-10-20 17:05', user: 'Ravi Shinde', role: 'Inventory', record: 'Allocation', id: 'AL-08', field: 'Allocation', change: 'Blocked – lot expiry before minimum expiry needed', projectCode: '2026/CHM/004' },
  { timestamp: '2026-10-29 16:40', user: 'Ravi Shinde', role: 'Inventory', record: 'Allocation', id: 'AL-12', field: 'Allocation', change: 'Blocked – exceeds lot stock (double allocation)', projectCode: '2026/CHM/006' },
  { timestamp: '2026-10-31 11:25', user: 'Ravi Shinde', role: 'Inventory', record: 'Allocation', id: 'AL-06', field: 'Allocation', change: 'Blocked – lot not ready (quarantine)', projectCode: '2026/CHM/003' },
  { timestamp: '2026-11-02 09:10', user: 'Ravi Shinde', role: 'Inventory', record: 'Ledger', id: 'TXN-014', field: 'Issue', change: 'Blocked – lot not QA-accepted', projectCode: '2026/CHM/003' }
];

@Injectable({
  providedIn: 'root'
})
export class RldService {
  private projectsSubject = new BehaviorSubject<ProjectMaster[]>(INITIAL_PROJECTS);
  private activeProjectCodeSubject = new BehaviorSubject<string>('2026/CHM/003');

  private comparatorsSubject = new BehaviorSubject<ComparatorItem[]>(INITIAL_COMPARATORS);
  private requirementsSubject = new BehaviorSubject<UtilisationRequirement[]>(INITIAL_REQUIREMENTS);
  private procurementSubject = new BehaviorSubject<ProcurementLine[]>(INITIAL_PROCUREMENT);
  private lotsSubject = new BehaviorSubject<LotItem[]>(INITIAL_LOTS);
  private allocationsSubject = new BehaviorSubject<AllocationItem[]>(INITIAL_ALLOCATIONS);
  private transactionsSubject = new BehaviorSubject<StockTransaction[]>(INITIAL_TRANSACTIONS);
  private actionsSubject = new BehaviorSubject<{ [key: string]: [string, string, string] }>(INITIAL_ACTIONS);
  private auditSubject = new BehaviorSubject<AuditEntry[]>(INITIAL_AUDIT);

  // Observables for state
  projects$ = this.projectsSubject.asObservable();
  activeProjectCode$ = this.activeProjectCodeSubject.asObservable();

  activeProject$ = combineLatest([this.projects$, this.activeProjectCode$]).pipe(
    map(([projects, code]) => projects.find((p) => p.code === code) || projects[0])
  );

  // Computations
  computedComparators$ = combineLatest([this.comparatorsSubject, this.projectsSubject]).pipe(
    map(([cmps, projects]) => {
      const pMap = new Map(projects.map((p) => [p.code, p]));
      return cmps.map((c) => {
        const due = c.verOn ? this.addM(c.verOn, RLD_SETTINGS.reverifyM) : '';
        let st = '';
        if (c.ra !== 'Approved') {
          st = c.ra === 'Rejected' ? 'Rejected' : 'Pending RA approval';
        } else if (!due) {
          st = 'Verification missing';
        } else if (due < ASOF_DATE) {
          st = 'Re-verification due';
        } else {
          st = 'Approved';
        }
        const proj = pMap.get(c.p) || {
          code: c.p,
          mol: '',
          name: '',
          div: '',
          pri: '',
          market: '',
          pm: '',
          innov: '',
          brand: '',
          istr: '',
          ipack: ''
        };
        return {
          ...c,
          reverify: due,
          status: st,
          proj
        } as ComputedComparator;
      });
    })
  );

  computedProcurement$ = combineLatest([
    this.procurementSubject,
    this.computedComparators$,
    this.requirementsSubject
  ]).pipe(
    map(([lines, cmps, reqs]) => {
      const cmpMap = new Map(cmps.map((c) => [c.id, c]));
      return lines.map((p) => {
        const c = cmpMap.get(p.c)!;
        const units = p.packs * (c?.upp || 1);
        const fx = RLD_SETTINGS.fx[p.cur] || 1;
        const goods = p.price * p.packs * fx;
        const duty = (goods + p.fr) * RLD_SETTINGS.dutyRate;
        const landed = goods + p.fr + duty + p.oth;
        const ltT = p.lt.reduce((a, b) => a + b, 0);

        const linkedNeeds = reqs.filter((r) => r.proc === p.id).map((r) => r.need).sort();
        const needBy = linkedNeeds[0] || '';
        const latest = needBy ? this.addD(needBy, -ltT) : '';
        const expReady = p.rec
          ? this.addD(p.rec, p.lt[3])
          : p.com
          ? this.addD(p.com, p.lt[3])
          : '';

        let status = '';
        if (!p.od) {
          status = latest && ASOF_DATE > latest ? 'Overdue – PO not placed' : 'Quotation stage';
        } else if (p.rec) {
          status = 'Received';
        } else if (needBy && expReady > needBy) {
          status = 'Delayed vs need date';
        } else if (p.com && ASOF_DATE > p.com) {
          status = 'Delivery overdue';
        } else {
          status = 'On order – on track';
        }

        return {
          ...p,
          cmp: c,
          pool: c?.pool || '',
          proj: c?.p || '',
          units,
          fx,
          goods,
          duty,
          landed,
          lpu: units ? landed / units : 0,
          ltT,
          var: landed - p.bud,
          varPct: p.bud ? (landed - p.bud) / p.bud : 0,
          needBy,
          latest,
          expReady,
          status,
          owner: RLD_SETTINGS.procLead
        } as ComputedProcurement;
      });
    })
  );

  computedLots$ = combineLatest([
    this.lotsSubject,
    this.computedComparators$,
    this.transactionsSubject,
    this.allocationsSubject,
    this.computedProcurement$
  ]).pipe(
    map(([lots, cmps, txs, allocs, procs]) => {
      const cmpMap = new Map(cmps.map((c) => [c.id, c]));
      const procMap = new Map(procs.map((pr) => [pr.id, pr]));

      return lots.map((l) => {
        const c = cmpMap.get(l.c)!;
        const rr = l.ck.every((x) => x === 'Y')
          ? 'Pass'
          : l.ck.some((x) => x === 'N')
          ? 'Fail'
          : 'Pending';

        let ready = '';
        if (rr !== 'Pass') {
          ready = `Not ready – receipt checks ${rr.toLowerCase()}`;
        } else if (l.qa !== 'Accepted') {
          ready = `Not ready – QA ${l.qa.toLowerCase()}`;
        } else if (l.exp <= ASOF_DATE) {
          ready = 'Not ready – expired';
        } else {
          ready = 'Ready';
        }

        const received = txs
          .filter((t) => t.lot === l.id && t.t === 'Receipt')
          .reduce((a, t) => a + t.q, 0);
        const wo = txs
          .filter((t) => t.lot === l.id && t.t === 'Write-off' && t.doc)
          .reduce((a, t) => a + t.q, 0);

        const r1 = txs
          .filter((t) => t.lot === l.id && t.t === 'Receipt')
          .sort((a, b) => (a.d < b.d ? -1 : 1))[0];

        const issued = txs
          .filter((x) => x.lot === l.id && x.t === 'Issue')
          .reduce((a, x) => a + x.q, 0);
        const returned = txs
          .filter((x) => x.lot === l.id && x.t === 'Return')
          .reduce((a, x) => a + x.q, 0);
        const physical = received - issued + returned - wo;

        // Reserved from valid allocations
        const reserved = allocs
          .filter((a) => a.lot === l.id && a.st === 'Reserved')
          .reduce((s2, a) => {
            const issuedForReq = txs
              .filter((x) => x.lot === l.id && x.req === a.req && x.t === 'Issue')
              .reduce((k, x) => k + x.q, 0);
            return s2 + Math.max(0, a.q - issuedForReq);
          }, 0);

        const usable = ready === 'Ready' ? Math.max(0, physical - reserved) : 0;
        const days = this.diff(l.exp, ASOF_DATE);
        const expFlag = usable > 0 && days <= RLD_SETTINGS.expWindowD;
        const lpu = procMap.get(l.pr)?.lpu || 0;
        const risk = expFlag ? usable * lpu : 0;

        return {
          ...l,
          cmp: c,
          pool: c?.pool || '',
          rr,
          ready,
          received,
          wo,
          cap: received - wo,
          unit: c?.unit || 'units',
          rcvBy: r1?.to || 'Meena Pillai',
          rcvOn: r1?.d || l.rd,
          grn: r1?.doc || 'GRN-26-0941',
          issued,
          returned,
          physical,
          reserved,
          usable,
          days,
          expFlag,
          lpu,
          risk
        } as ComputedLot;
      });
    })
  );

  computedRequirements$ = combineLatest([
    this.requirementsSubject,
    this.computedComparators$,
    this.allocationsSubject,
    this.transactionsSubject,
    this.computedProcurement$,
    this.computedLots$
  ]).pipe(
    map(([reqs, cmps, allocs, txs, procs, lots]) => {
      const cmpMap = new Map(cmps.map((c) => [c.id, c]));
      const procMap = new Map(procs.map((p) => [p.id, p]));
      const lotMap = new Map(lots.map((l) => [l.id, l]));

      return reqs.map((r) => {
        const c = cmpMap.get(r.c)!;
        const total = Math.ceil(r.base * (1 + r.buf) - 1e-9);
        const minExp = this.addM(r.need, r.use + RLD_SETTINGS.expMarginM);

        // Covered by valid allocations
        const covered = allocs
          .filter((a) => {
            if (a.req !== r.id || a.st === 'Released') return false;
            const l = lotMap.get(a.lot);
            const compOk = c?.status === 'Approved';
            const poolOk = l && c && c.pool === l.pool;
            const lotOk = l && l.ready === 'Ready';
            const expOk = !!(l && l.exp >= minExp);
            return compOk && poolOk && lotOk && expOk;
          })
          .reduce((s, a) => s + a.q, 0);

        const short = Math.max(0, total - covered);

        const sFunc = (type: string) =>
          txs.filter((x) => x.req === r.id && x.t === type).reduce((a, x) => a + x.q, 0);
        const issued = sFunc('Issue');
        const consumed = sFunc('Consumption');
        const returned = sFunc('Return');
        const atLab = issued - consumed - returned;

        const p = procMap.get(r.proc);
        const pOrder = p ? p.od : '';
        const pRec = p ? p.rec : '';
        const expSup = p ? p.expReady : '';
        const lt = p ? p.ltT : RLD_SETTINGS.defLT.src + RLD_SETTINGS.defLT.tr + RLD_SETTINGS.defLT.clr + RLD_SETTINGS.defLT.acc;
        const latest = this.addD(r.need, -lt);
        const days = this.diff(r.need, ASOF_DATE);

        const expFail = allocs.some((a) => {
          if (a.req !== r.id || a.st === 'Released') return false;
          const l = lotMap.get(a.lot);
          return l && l.exp < minExp;
        });

        let status = '';
        if (c?.status !== 'Approved') {
          status = 'Blocked – comparator not approved';
        } else if (short === 0) {
          status = 'Ready';
        } else if (expFail) {
          status = 'Expiry unsuitable – fresh lot needed';
        } else if (!pOrder && ASOF_DATE > latest) {
          status = 'Overdue procurement';
        } else if (pRec) {
          status = 'Received – awaiting QA release / allocation';
        } else if (expSup && expSup > r.need) {
          status = 'Delivery delay';
        } else if (days < 0) {
          status = 'Short – past due';
        } else {
          status = 'Supply in progress';
        }

        let bucket = '';
        if (status === 'Ready') {
          bucket = 'Ready';
        } else if (days < 0) {
          bucket = 'Past due';
        } else if (days <= 30) {
          bucket = '≤30 d';
        } else if (days <= 60) {
          bucket = '31–60 d';
        } else if (days <= 90) {
          bucket = '61–90 d';
        } else {
          bucket = '>90 d';
        }

        const trace = c?.status === 'Approved' && r.act && r.need && r.gate ? 'Traceable' : 'Incomplete';

        return {
          ...r,
          cmp: c,
          proj: c?.p || '',
          pool: c?.pool || '',
          unit: c?.unit || 'units',
          compSt: c?.status || '',
          total,
          minExp,
          covered,
          short,
          issued,
          consumed,
          returned,
          atLab,
          p,
          pOrder,
          pRec,
          expSup,
          latest,
          days,
          expFail,
          status,
          bucket,
          trace
        } as ComputedRequirement;
      });
    })
  );

  computedAllocations$ = combineLatest([
    this.allocationsSubject,
    this.computedRequirements$,
    this.computedLots$
  ]).pipe(
    map(([allocs, reqs, lots]) => {
      const reqMap = new Map(reqs.map((r) => [r.id, r]));
      const lotMap = new Map(lots.map((l) => [l.id, l]));

      const cum: { [lot: string]: number } = {};

      return allocs.map((a) => {
        const r = reqMap.get(a.req)!;
        const l = lotMap.get(a.lot)!;

        const compOk = r?.compSt === 'Approved';
        const poolOk = !!(r && l && r.pool === l.pool);
        const lotOk = l?.ready === 'Ready';
        const expOk = !!(l && r && l.exp >= r.minExp);

        let pre = 'OK';
        if (!compOk) pre = 'comparator not approved';
        else if (!poolOk) pre = 'lot is from a different reference product pool';
        else if (!lotOk) pre = 'lot not ready (receipt / QA / expiry)';
        else if (!expOk) pre = 'lot expiry before minimum expiry needed';

        let cVal: number | null = null;
        let res = '';
        if (a.st === 'Released') {
          res = 'Released';
        } else if (pre !== 'OK') {
          res = 'BLOCKED – ' + pre;
        } else {
          cVal = (cum[a.lot] || 0) + a.q;
          if (l && cVal > l.cap) {
            res = 'BLOCKED – exceeds lot stock (double allocation)';
          } else {
            cum[a.lot] = cVal;
            res = 'OK';
          }
        }

        return {
          ...a,
          r,
          l,
          compOk,
          poolOk,
          lotOk,
          expOk,
          pre,
          cum: cVal,
          res,
          proj: r ? r.proj : ''
        } as ComputedAllocation;
      });
    })
  );

  computedPools$ = combineLatest([
    this.computedComparators$,
    this.computedRequirements$,
    this.computedLots$,
    this.computedProcurement$
  ]).pipe(
    map(([cmps, reqs, lots, procs]) => {
      const poolCodes = Array.from(new Set(cmps.map((c) => c.pool)));

      return poolCodes.map((code) => {
        const rs = reqs.filter((r) => r.pool === code);
        const ls = lots.filter((l) => l.pool === code);
        const demand = rs.reduce((a, r) => a + r.total, 0);
        const covered = rs.reduce((a, r) => a + r.covered, 0);
        const physical = ls.reduce((a, l) => a + l.physical, 0);
        const usable = ls.reduce((a, l) => a + l.usable, 0);
        const notUsable = ls.filter((l) => l.ready !== 'Ready').reduce((a, l) => a + l.physical, 0);
        const onOrder = procs.filter((p) => p.pool === code && p.od && !p.rec).reduce((a, p) => a + p.units, 0);
        const uncovered = demand - covered;
        const gap = Math.max(0, uncovered - usable - notUsable - onOrder);
        const expiring = ls.filter((l) => l.expFlag).reduce((a, l) => a + l.usable, 0);
        const cm = cmps.find((c) => c.pool === code);

        return {
          code,
          desc: cm ? `${cm.brand} · ${cm.pack} · ${cm.purch}` : '',
          unit: cm?.unit || 'units',
          projects: Array.from(new Set(cmps.filter((c) => c.pool === code).map((c) => c.p))),
          demand,
          covered,
          uncovered,
          physical,
          usable,
          notUsable,
          onOrder,
          gap,
          expiring
        } as StockPool;
      });
    })
  );

  computedAlerts$ = combineLatest([
    this.computedRequirements$,
    this.computedPools$,
    this.actionsSubject
  ]).pipe(
    map(([reqs, pools, actions]) => {
      const poolMap = new Map(pools.map((p) => [p.code, p]));

      return reqs
        .map((r) => {
          const pool = poolMap.get(r.pool);
          const f = {
            comp: r.compSt !== 'Approved',
            buf: r.buf > 0 && !r.bufBy,
            overdue: r.short > 0 && !r.pOrder && ASOF_DATE > r.latest,
            delay: r.short > 0 && !!r.expSup && r.expSup > r.need,
            insuff: r.short > 0 && (pool?.gap || 0) > 0,
            expiry: r.expFail
          };

          const crit = f.comp || f.overdue || f.delay || f.insuff || f.expiry;
          const n = Object.values(f).filter(Boolean).length;
          const sev = crit ? (r.days <= 60 || f.overdue ? 'High' : 'Medium') : n ? 'Low' : '';

          const msgs: string[] = [];
          if (f.comp) msgs.push('Comparator not RA-approved');
          if (f.buf) msgs.push('Buffer approval pending');
          if (f.overdue) msgs.push(`Order overdue (latest order ${this.formatDate(r.latest)})`);
          if (f.delay) msgs.push(`Supply expected ${this.formatDate(r.expSup)} vs need ${this.formatDate(r.need)}`);
          if (f.insuff) msgs.push(`Short ${r.short} ${r.unit}; pool gap ${pool?.gap || 0}`);
          if (f.expiry) msgs.push(`Allocated lot expires before ${this.formatDate(r.minExp)}`);

          const owner = f.comp
            ? RLD_SETTINGS.raOwner
            : f.overdue || f.delay
            ? r.p
              ? 'Purchase Exec – Imports'
              : RLD_SETTINGS.procLead
            : f.expiry
            ? RLD_SETTINGS.custodian
            : n
            ? r.owner
            : '';

          const act = actions[r.id] || ['', '', 'Open'];

          return {
            r,
            f,
            n,
            sev,
            msg: msgs.join('; '),
            owner,
            action: act[0],
            due: act[1],
            ast: act[2] as 'Open' | 'In progress' | 'Closed'
          } as RldAlert;
        })
        .filter((a) => a.n > 0);
    })
  );

  projectKpis$: Observable<RldKpis> = combineLatest([
    this.activeProjectCode$,
    this.computedComparators$,
    this.computedRequirements$,
    this.computedProcurement$,
    this.computedAlerts$,
    this.computedLots$
  ]).pipe(
    map(([projCode, cmps, reqs, procs, alerts, lots]) => {
      const projectCmps = cmps.filter((c) => c.p === projCode);
      const projectReqs = reqs.filter((r) => r.proj === projCode);
      const projectProcs = procs.filter((p) => p.proj === projCode);
      const projectAlerts = alerts.filter((a) => a.r.proj === projCode);
      const projectPools = new Set(projectCmps.map((c) => c.pool).filter(Boolean));
      const projectLots = lots.filter((l) => projectPools.has(l.pool));

      const approvedCount = projectCmps.filter((c) => c.status === 'Approved').length;
      const comparatorTotal = projectCmps.length;
      const totalRequirement = projectReqs.reduce((sum, r) => sum + r.total, 0);
      const allocatedUsable = projectReqs.reduce((sum, r) => sum + r.covered, 0);
      const shortfall = projectReqs.reduce((sum, r) => sum + r.short, 0);

      const openNeeds = projectReqs.filter((r) => r.status !== 'Ready').map((r) => r.need).sort();
      const nextOpenNeedDate = openNeeds[0] ? this.formatDate(openNeeds[0]) : '—';
      const openReqsCount = openNeeds.length;

      const alertsCount = projectAlerts.length;
      const highAlertsCount = projectAlerts.filter((a) => a.sev === 'High').length;

      const landed = projectProcs.reduce((sum, p) => sum + p.landed, 0);
      const budget = projectProcs.reduce((sum, p) => sum + p.bud, 0);
      const landedVsBudget = landed - budget;

      return {
        approvedComparators: `${approvedCount} / ${comparatorTotal}`,
        approvedCount,
        comparatorTotal,
        totalRequirement,
        reqCount: projectReqs.length,
        allocatedUsable,
        shortfall,
        nextOpenNeedDate,
        openReqsCount,
        alertsCount,
        highAlertsCount,
        landedVsBudget,
        lotsCount: projectLots.length,
        procCount: projectProcs.length
      };
    })
  );

  audit$ = this.auditSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();
  alerts$ = this.computedAlerts$;
  computedProcurements$ = this.computedProcurement$;

  // Helper date functions
  private parseDate(s: string): Date | null {
    return s ? new Date(s + 'T00:00:00Z') : null;
  }

  addD(dateStr: string, n: number): string {
    const d = this.parseDate(dateStr);
    if (!d) return '';
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  addM(dateStr: string, n: number): string {
    const d = this.parseDate(dateStr);
    if (!d) return '';
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + n);
    const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, lastDay));
    return d.toISOString().slice(0, 10);
  }

  diff(a: string, b: string): number {
    const da = this.parseDate(a);
    const db = this.parseDate(b);
    if (!da || !db) return 0;
    return Math.round((da.getTime() - db.getTime()) / 864e5);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = this.parseDate(dateStr);
    if (!d) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getUTCDate()).padStart(2, '0')}-${months[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
  }

  formatNumber(n: number | null | undefined): string {
    if (n == null || isNaN(n)) return '';
    return Math.round(n).toLocaleString('en-IN');
  }

  // State manipulation methods
  setActiveProject(code: string): void {
    this.activeProjectCodeSubject.next(code);
  }

  setActiveProjectCode(code: string): void {
    this.setActiveProject(code);
  }

  addComparator(item: ComparatorItem): void {
    const list = this.comparatorsSubject.getValue();
    const id = `CMP-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = { ...item, id };
    this.comparatorsSubject.next([...list, newItem]);

    this.logAudit({
      timestamp: `${ASOF_DATE} 15:00`,
      user: 'RA Head',
      role: 'RA',
      record: 'Comparator',
      id,
      field: 'Created',
      change: `Added ${newItem.brand}`,
      projectCode: newItem.p
    });
  }

  updateComparator(item: ComparatorItem): void {
    const list = this.comparatorsSubject.getValue();
    const idx = list.findIndex((c) => c.id === item.id);
    if (idx !== -1) {
      list[idx] = { ...item };
      this.comparatorsSubject.next([...list]);

      this.logAudit({
        timestamp: `${ASOF_DATE} 15:00`,
        user: 'RA Head',
        role: 'RA',
        record: 'Comparator',
        id: item.id,
        field: 'Updated',
        change: `Updated ${item.brand}`,
        projectCode: item.p
      });
    }
  }

  deleteComparator(id: string): void {
    const list = this.comparatorsSubject.getValue().filter((c) => c.id !== id);
    this.comparatorsSubject.next(list);
  }

  addRequirement(req: UtilisationRequirement): void {
    const list = this.requirementsSubject.getValue();
    const id = `R-${String(list.length + 101).padStart(4, '0')}`;
    const newReq = { ...req, id };
    this.requirementsSubject.next([...list, newReq]);
  }

  updateRequirement(req: UtilisationRequirement): void {
    const list = this.requirementsSubject.getValue();
    const idx = list.findIndex((r) => r.id === req.id);
    if (idx !== -1) {
      list[idx] = { ...req };
      this.requirementsSubject.next([...list]);
    }
  }

  deleteRequirement(id: string): void {
    const list = this.requirementsSubject.getValue().filter((r) => r.id !== id);
    this.requirementsSubject.next(list);
  }

  addAllocation(lotId: string, reqId: string, qty: number, requestedBy: string): string {
    const allocs = this.allocationsSubject.getValue();
    const id = `AL-${String(allocs.length + 1).padStart(2, '0')}`;
    const newAlloc: AllocationItem = {
      id,
      req: reqId,
      lot: lotId,
      q: qty,
      st: 'Reserved',
      d: ASOF_DATE,
      by: requestedBy,
      allocBy: 'Ravi Shinde'
    };
    this.allocationsSubject.next([...allocs, newAlloc]);

    this.logAudit({
      timestamp: `${ASOF_DATE} 15:00`,
      user: requestedBy,
      role: 'R&D',
      record: 'Allocation',
      id,
      field: 'Allocation',
      change: `Reserved ${qty} from ${lotId}`,
      projectCode: this.activeProjectCodeSubject.getValue()
    });

    return id;
  }

  updateQaDisposition(lotId: string, checks: string[], disposition: string, qaRef: string, qaBy: string): void {
    const lots = this.lotsSubject.getValue();
    const lot = lots.find((l) => l.id === lotId);
    if (lot) {
      const before = lot.qa;
      lot.ck = [...checks];
      lot.qa = disposition;
      lot.qaRef = qaRef;
      if (disposition !== 'Quarantine') {
        lot.qaBy = qaBy;
        lot.qaOn = ASOF_DATE;
      }
      this.lotsSubject.next([...lots]);

      this.logAudit({
        timestamp: `${ASOF_DATE} 15:05`,
        user: qaBy || 'Dr. Kavita Joshi',
        role: 'Quality',
        record: 'Batch',
        id: lotId,
        field: 'QA disposition',
        change: `${before} → ${disposition}`,
        projectCode: this.activeProjectCodeSubject.getValue()
      });
    }
  }

  updateAction(reqId: string, actionText: string, due: string, status: string): void {
    const actions = { ...this.actionsSubject.getValue() };
    actions[reqId] = [actionText, due, status];
    this.actionsSubject.next(actions);
  }

  private logAudit(entry: AuditEntry): void {
    const current = this.auditSubject.getValue();
    this.auditSubject.next([entry, ...current]);
  }
}
