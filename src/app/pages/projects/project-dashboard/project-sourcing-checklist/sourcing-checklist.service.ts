import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProxyProject {
  id: string;
  code: string;
  short: string;
  label: string;
  name: string;
}

export interface TechMaterial {
  projectId: string;
  sno: number;
  code: string;
  name: string;
  grade: string;
  form: string;
  markets: string;
  poly: string;
  uom: string;
  dev: number;
  ebpv: number;
  type: string;
  psd: string;
  cat: 'API' | 'Peptide API' | 'Critical excipient' | 'Excipient' | 'Process solvent' | string;
  notes: string;
}

export interface MaterialsPlanRow {
  projectId: string;
  id: string; // e.g. RM-009
  name: string;
  unit: string;
  net: number;
  qc: number;
  allow: number;
  stock: number;
  po: number;
  moq: number;
  lead: number;
  price: number;
  mfr: string;
  supplier: string;
  qr: string;
  decision: 'Approved' | 'Pending' | 'Rejected';
  blocker: string;
  // Computed properties
  wdev?: string;
  buy?: number;
  cost?: number;
  QualificationStatus?: 'Satisfaction' | 'Need Improvement' | string;
  PreQualificationChecklist?: string;
}

export interface UploadedDoc {
  name: string;
  size: number;
  sizeFormatted: string;
  when: string;
  type: string;
}

export interface QAFormQuestion {
  section: string;
  no: number;
  text: string;
  isSterile?: boolean;
}

export interface QAFormConfig {
  id: string; // 'F10' | 'F02'
  code: string;
  title: string;
  who: string;
  attest: string;
  verify: string;
  summaryTitle: string;
  gen: string[];
  sections: [string, string[]][];
}

export const PROXY_PROJECTS: ProxyProject[] = [
  {
    id: 'P1-IOH',
    code: 'P1-IOH',
    short: 'P1 · Iohexol Inj 350 mg/mL',
    name: 'Iohexol Injection 350 mgI/mL',
    label: 'P1-IOH · Iohexol Injection 350 mgI/mL (proxy product)'
  },
  {
    id: 'P2-GDB',
    code: 'P2-GDB',
    short: 'P2 · Gadobutrol Inj 1 mmol/mL',
    name: 'Gadobutrol Injection 1 mmol/mL',
    label: 'P2-GDB · Gadobutrol Injection 1 mmol/mL (proxy product)'
  },
  {
    id: 'P3-LEU',
    code: 'P3-LEU',
    short: 'P3 · Leuprolide PLGA depot 3.75 mg',
    name: 'Leuprolide PLGA depot 3.75 mg',
    label: 'P3-LEU · Leuprolide PLGA depot 3.75 mg (proxy product)'
  }
];

export const INITIAL_TECH_DATA: TechMaterial[] = [
  // P1-IOH
  {
    projectId: 'P1-IOH',
    sno: 1,
    code: 'RM-001',
    name: 'Iohexol',
    grade: 'Ph. Eur./USP; dossier aligned',
    form: 'Injectable',
    markets: 'EU (DE, NL), India',
    poly: 'Non-hygroscopic white powder; confirm isomer ratio',
    uom: 'kg',
    dev: 20,
    ebpv: 302,
    type: 'NPD',
    psd: 'Not critical – fully dissolved',
    cat: 'API',
    notes: 'Control related substances, free iodide/iodine, residual solvents; ASMF/CEP route preferred.'
  },
  {
    projectId: 'P1-IOH',
    sno: 2,
    code: 'RM-002',
    name: 'Trometamol (tromethamine)',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'EU (DE, NL), India',
    poly: 'Crystalline; confirm grade',
    uom: 'kg',
    dev: 1,
    ebpv: 1,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Buffer; BET and elemental impurities per spec.'
  },
  {
    projectId: 'P1-IOH',
    sno: 3,
    code: 'RM-003',
    name: 'Edetate calcium disodium',
    grade: 'USP, parenteral grade',
    form: 'Injectable',
    markets: 'EU (DE, NL), India',
    poly: 'Hydrate form to be confirmed',
    uom: 'kg',
    dev: 0.1,
    ebpv: 0.1,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Stabiliser; confirm hydrate and assay basis.'
  },
  {
    projectId: 'P1-IOH',
    sno: 4,
    code: 'RM-004',
    name: 'Hydrochloric acid',
    grade: 'Ph. Eur., parenteral grade',
    form: 'Injectable',
    markets: 'EU (DE, NL), India',
    poly: 'Concentration to be confirmed',
    uom: 'L',
    dev: 1,
    ebpv: 2,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'pH adjustment; separate code per concentration.'
  },

  // P2-GDB
  {
    projectId: 'P2-GDB',
    sno: 5,
    code: 'RM-005',
    name: 'Gadobutrol',
    grade: 'In-house/Ph. Eur.; dossier aligned',
    form: 'Injectable',
    markets: 'EU (DE, FR, NL)',
    poly: 'Monohydrate; confirm solid form',
    uom: 'kg',
    dev: 5,
    ebpv: 121,
    type: 'NPD',
    psd: 'Not critical – fully dissolved',
    cat: 'API',
    notes: 'Assess free Gd, free ligand and chelate-related impurities; elemental impurities.'
  },
  {
    projectId: 'P2-GDB',
    sno: 6,
    code: 'RM-006',
    name: 'Calcobutrol sodium',
    grade: 'Specification to be approved',
    form: 'Injectable',
    markets: 'EU (DE, FR, NL)',
    poly: 'Confirm salt and water content',
    uom: 'kg',
    dev: 0.05,
    ebpv: 0.11,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Excess ligand; limited supplier base – secure alternate source.'
  },
  {
    projectId: 'P2-GDB',
    sno: 7,
    code: 'RM-007',
    name: 'Trometamol (tromethamine)',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'EU (DE, FR, NL)',
    poly: 'Crystalline; confirm grade',
    uom: 'kg',
    dev: 0.2,
    ebpv: 0.25,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Buffer; same RM code as P1 if same source and grade.'
  },
  {
    projectId: 'P2-GDB',
    sno: 8,
    code: 'RM-008',
    name: 'Hydrochloric acid',
    grade: 'Ph. Eur., parenteral grade',
    form: 'Injectable',
    markets: 'EU (DE, FR, NL)',
    poly: 'Concentration to be confirmed',
    uom: 'L',
    dev: 0.5,
    ebpv: 1,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'pH adjustment.'
  },

  // P3-LEU (Active in img1 screenshot)
  {
    projectId: 'P3-LEU',
    sno: 9,
    code: 'RM-009',
    name: 'Leuprolide acetate',
    grade: 'Peptide API; specification to be approved',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Counterion, water content and assay basis',
    uom: 'g',
    dev: 50,
    ebpv: 600,
    type: 'NPD',
    psd: 'Not critical – dissolved in inner phase',
    cat: 'Peptide API',
    notes: 'Base-equivalent strength, peptide impurities, aggregation, residual TFA/solvents.'
  },
  {
    projectId: 'P3-LEU',
    sno: 10,
    code: 'RM-010',
    name: 'PLGA 50:50 (acid end group)',
    grade: 'Parenteral grade; IV 0.3–0.4 dL/g (proxy)',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Lactide:glycolide 50:50; acid end group',
    uom: 'kg',
    dev: 2,
    ebpv: 2.5,
    type: 'NPD',
    psd: 'Process-critical; R&D to define',
    cat: 'Critical excipient',
    notes: 'Control IV, residual monomer, residual solvent, water; cold storage.'
  },
  {
    projectId: 'P3-LEU',
    sno: 11,
    code: 'RM-011',
    name: 'Polyvinyl alcohol',
    grade: 'Ph. Eur.; parenteral suitability',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Degree of hydrolysis 87–89% (proxy)',
    uom: 'kg',
    dev: 5,
    ebpv: 4,
    type: 'NPD',
    psd: 'Assess formulation relevance',
    cat: 'Excipient',
    notes: 'Emulsifier in outer phase; DEG/EG risk assessment.'
  },
  {
    projectId: 'P3-LEU',
    sno: 12,
    code: 'RM-012',
    name: 'Mannitol',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Beta polymorph; confirm grade',
    uom: 'kg',
    dev: 3,
    ebpv: 6,
    type: 'NPD',
    psd: 'Assess formulation relevance',
    cat: 'Excipient',
    notes: 'Bulking agent; BET limit by intended use.'
  },
  {
    projectId: 'P3-LEU',
    sno: 13,
    code: 'RM-013',
    name: 'Dichloromethane',
    grade: 'Process-validated purity; specification approved',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Amylene-stabilised; water content',
    uom: 'L',
    dev: 40,
    ebpv: 60,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Process solvent',
    notes: 'Residual-solvent control (ICH Q3C class 2); SDS, fire and recovery controls.'
  },
  {
    projectId: 'P3-LEU',
    sno: 14,
    code: 'RM-014',
    name: 'Gelatin',
    grade: 'Ph. Eur., parenteral grade; TSE-compliant',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Bloom strength to be confirmed',
    uom: 'kg',
    dev: 0.5,
    ebpv: 0.5,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Animal origin – TSE/BSE certificate (CEP) mandatory.'
  },
  {
    projectId: 'P3-LEU',
    sno: 15,
    code: 'RM-015',
    name: 'Polysorbate 80',
    grade: 'Ph. Eur., parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Low-peroxide grade',
    uom: 'kg',
    dev: 0.5,
    ebpv: 1,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Diluent component; peroxide and EG/DEG control.'
  },
  {
    projectId: 'P3-LEU',
    sno: 16,
    code: 'RM-016',
    name: 'Carmellose sodium (CMC)',
    grade: 'Ph. Eur., parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Viscosity grade to be confirmed',
    uom: 'kg',
    dev: 1,
    ebpv: 2,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    cat: 'Excipient',
    notes: 'Diluent viscosity agent; viscosity and BET per spec.'
  }
];

export const INITIAL_PLAN_DATA: MaterialsPlanRow[] = [
  // P1-IOH
  {
    projectId: 'P1-IOH',
    id: 'RM-001',
    name: 'Iohexol',
    unit: 'kg',
    net: 322,
    qc: 5,
    allow: 0.03,
    stock: 0,
    po: 0,
    moq: 25,
    lead: 60,
    price: 8200,
    mfr: 'Proxy API Mfr A – Site 1 (India)',
    supplier: 'Direct from manufacturer',
    qr: 'QR-P1-IOH-001',
    decision: 'Approved',
    blocker: 'Proxy: CEP available; sample testing complete'
  },
  {
    projectId: 'P1-IOH',
    id: 'RM-002',
    name: 'Trometamol (tromethamine)',
    unit: 'kg',
    net: 2,
    qc: 0.2,
    allow: 0.05,
    stock: 0,
    po: 0,
    moq: 1,
    lead: 21,
    price: 4500,
    mfr: 'Proxy Excipient Mfr B – Site 1',
    supplier: 'Proxy authorised distributor',
    qr: 'QR-P1-TRO-001',
    decision: 'Approved',
    blocker: 'Proxy: none'
  },
  {
    projectId: 'P1-IOH',
    id: 'RM-003',
    name: 'Edetate calcium disodium',
    unit: 'kg',
    net: 0.2,
    qc: 0.05,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 0.5,
    lead: 30,
    price: 12000,
    mfr: 'Proxy Excipient Mfr C – Site 1',
    supplier: 'Proxy authorised distributor',
    qr: 'QR-P1-EDT-001',
    decision: 'Pending',
    blocker: 'Proxy: hydrate form confirmation awaited'
  },
  {
    projectId: 'P1-IOH',
    id: 'RM-004',
    name: 'Hydrochloric acid',
    unit: 'L',
    net: 3,
    qc: 0.5,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 2.5,
    lead: 14,
    price: 1200,
    mfr: 'Proxy Chemical Mfr D – Site 1',
    supplier: 'Proxy distributor',
    qr: 'QR-P1-HCL-001',
    decision: 'Approved',
    blocker: 'Proxy: none'
  },

  // P2-GDB
  {
    projectId: 'P2-GDB',
    id: 'RM-005',
    name: 'Gadobutrol',
    unit: 'kg',
    net: 126,
    qc: 2,
    allow: 0.03,
    stock: 0,
    po: 0,
    moq: 5,
    lead: 90,
    price: 125000,
    mfr: 'Proxy API Mfr E – Site 2 (EU)',
    supplier: 'Direct from manufacturer',
    qr: 'QR-P2-GDB-001',
    decision: 'Pending',
    blocker: 'Proxy: ASMF access letter and audit pending'
  },
  {
    projectId: 'P2-GDB',
    id: 'RM-006',
    name: 'Calcobutrol sodium',
    unit: 'kg',
    net: 0.16,
    qc: 0.02,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 0.1,
    lead: 90,
    price: 450000,
    mfr: 'Proxy API Mfr E – Site 2 (EU)',
    supplier: 'Direct from manufacturer',
    qr: 'QR-P2-CAL-001',
    decision: 'Pending',
    blocker: 'Proxy: single source – alternate under evaluation'
  },
  {
    projectId: 'P2-GDB',
    id: 'RM-007',
    name: 'Trometamol (tromethamine)',
    unit: 'kg',
    net: 0.45,
    qc: 0.1,
    allow: 0.05,
    stock: 1,
    po: 0,
    moq: 1,
    lead: 21,
    price: 4500,
    mfr: 'Proxy Excipient Mfr B – Site 1',
    supplier: 'Proxy authorised distributor',
    qr: 'QR-P2-TRO-001',
    decision: 'Approved',
    blocker: 'Proxy: 1 kg approved stock shared with P1'
  },
  {
    projectId: 'P2-GDB',
    id: 'RM-008',
    name: 'Hydrochloric acid',
    unit: 'L',
    net: 1.5,
    qc: 0.5,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 2.5,
    lead: 14,
    price: 1200,
    mfr: 'Proxy Chemical Mfr D – Site 1',
    supplier: 'Proxy distributor',
    qr: 'QR-P2-HCL-001',
    decision: 'Approved',
    blocker: 'Proxy: none'
  },

  // P3-LEU
  {
    projectId: 'P3-LEU',
    id: 'RM-009',
    name: 'Leuprolide acetate',
    unit: 'g',
    net: 650,
    qc: 30,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 50,
    lead: 45,
    price: 2200,
    mfr: 'Proxy Peptide Mfr F – Site 1 (India)',
    supplier: 'Direct from manufacturer',
    qr: 'QR-P3-LEU-001',
    decision: 'Pending',
    blocker: 'Proxy: CoA gap assessment pending'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-010',
    name: 'PLGA 50:50 (acid end group)',
    unit: 'kg',
    net: 4.5,
    qc: 0.5,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 1,
    lead: 60,
    price: 95000,
    mfr: 'Proxy Polymer Mfr G – Site 1 (EU)',
    supplier: 'Proxy authorised distributor (India)',
    qr: 'QR-P3-PLG-001',
    decision: 'Pending',
    blocker: 'Proxy: IV spec to be fixed by R&D'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-011',
    name: 'Polyvinyl alcohol',
    unit: 'kg',
    net: 9,
    qc: 0.5,
    allow: 0.05,
    stock: 0,
    po: 0,
    moq: 5,
    lead: 30,
    price: 6500,
    mfr: 'Proxy Excipient Mfr H – Site 1',
    supplier: 'Direct from manufacturer',
    qr: 'QR-P3-PVA-001',
    decision: 'Approved',
    blocker: 'Proxy: DEG/EG statement received'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-012',
    name: 'Mannitol',
    unit: 'kg',
    net: 9,
    qc: 0.5,
    allow: 0.05,
    stock: 2,
    po: 0,
    moq: 25,
    lead: 21,
    price: 900,
    mfr: 'Proxy Excipient Mfr I – Site 1',
    supplier: 'Proxy trader (authorised)',
    qr: 'QR-P3-MAN-001',
    decision: 'Approved',
    blocker: 'Proxy: 2 kg approved stock netted'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-013',
    name: 'Dichloromethane',
    unit: 'L',
    net: 100,
    qc: 2,
    allow: 0.15,
    stock: 0,
    po: 20,
    moq: 25,
    lead: 14,
    price: 350,
    mfr: 'Proxy Solvent Mfr J – Site 1',
    supplier: 'Proxy solvent distributor',
    qr: 'QR-P3-DCM-001',
    decision: 'Approved',
    blocker: 'Proxy: 20 L open PO netted; EHS storage approval'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-014',
    name: 'Gelatin',
    unit: 'kg',
    net: 1,
    qc: 0.1,
    allow: 0.1,
    stock: 0,
    po: 0,
    moq: 1,
    lead: 45,
    price: 8000,
    mfr: 'Proxy Excipient Mfr K – Site 1 (EU)',
    supplier: 'Proxy authorised distributor',
    qr: 'QR-P3-GEL-001',
    decision: 'Rejected',
    blocker: 'Proxy: TSE certificate not provided – re-source'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-015',
    name: 'Polysorbate 80',
    unit: 'kg',
    net: 1.5,
    qc: 0.1,
    allow: 0.05,
    stock: 0,
    po: 0,
    moq: 0.5,
    lead: 30,
    price: 15000,
    mfr: 'Proxy Excipient Mfr L – Site 1',
    supplier: 'Proxy authorised distributor',
    qr: 'QR-P3-P80-001',
    decision: 'Pending',
    blocker: 'Proxy: low-peroxide grade confirmation'
  },
  {
    projectId: 'P3-LEU',
    id: 'RM-016',
    name: 'Carmellose sodium (CMC)',
    unit: 'kg',
    net: 3,
    qc: 0.2,
    allow: 0.05,
    stock: 0,
    po: 0,
    moq: 1,
    lead: 30,
    price: 7000,
    mfr: 'Proxy Excipient Mfr M – Site 1',
    supplier: 'Proxy authorised distributor',
    qr: 'QR-P3-CMC-001',
    decision: 'Approved',
    blocker: 'Proxy: none'
  }
];

export const F10_CONFIG: QAFormConfig = {
  id: 'F10',
  code: 'JEQA035-F10-02',
  title: 'Vendor Self-Assessment Checklist',
  who: 'Filled by the vendor; summary by Jodas QA',
  attest: 'Vendor / supplier’s quality representative',
  verify: 'Assessment verified by (Jodas QA)',
  summaryTitle: 'Summary of self-assessment (to be done by Jodas quality representative)',
  gen: [
    'Name of the vendor',
    'Address with telephone number',
    'Materials considered for audit',
    'Products currently purchased from the vendor',
    'Primary QA contact – Name',
    'Primary QA contact – Job title',
    'Primary QA contact – Phone No.',
    'Primary QA contact – Facsimile No.',
    'Are the process areas dedicated for one product? If not, what other products are manufactured',
    'Other important customers of the vendor',
    'Method of transport used for shipment of products',
    'Is the material and facility approved by ISO / any other Government organisation (officially accredited body)'
  ],
  sections: [
    [
      'I. Warehouse',
      [
        'Adequate space with specially defined areas available.',
        'Adequate lighting and ventilation.',
        'Disposal of waste in safe manner.',
        'Availability of cleaning procedures.',
        'Procedure and records for use of rodenticides and insecticides available.',
        'Records indicating material name, Lot No., quantity, manufacturer name, supplier’s name, material code and date received.',
        'Visual examination of materials for damage at the time of receipt and is documented.',
        'Containers of materials cleaned externally, upon receipt.',
        'Containers, bags and boxes are off floor and suitably spaced for cleaning & inspection. Different materials and/or different batches of same material stored on different pallets to prevent mix-ups.',
        'Released materials properly segregated from under test materials.',
        'Rejected materials identified and controlled as per procedure.',
        'Material identified with appropriate labels.',
        'Materials properly identified and adequately segregated to avoid mix-ups.',
        'Inventory record of each material maintained.',
        'Separate finished products storage.',
        'Finished products distribution records.',
        'Handling of returned products in warehouse.'
      ]
    ],
    [
      'II. Production',
      [
        'Personnel wear adequate protective apparel.',
        'Adequate space with specially defined areas.',
        'Adequate lighting, ventilation and air in production area.',
        'Equipment is suitably located for easy cleaning operation and maintenance.',
        'All equipment identified with numbers.',
        'All the equipment is status labelled.',
        'All the operations related to manufacturing process are recorded.',
        'Rejected in-process materials identified and controlled.',
        'Time limitations for completion of each phase of production are available and followed.',
        'Method of packing and storage of finished products.',
        'Labelling of finished product.'
      ]
    ],
    [
      'III. Quality Control',
      [
        'Personnel wear protective apparel (if applicable).',
        'Procedures for cleaning of glass apparatus.',
        'Acceptance of RM & PM.',
        'Testing of finished product.',
        'Maintenance of laboratory testing records.',
        'All analytical reports signed by chemist with date and checked by second person.',
        'Laboratory log books and records control.',
        'Training and qualification of chemists.'
      ]
    ],
    [
      'IV. Engineering',
      [
        'Maintenance of buildings and facilities.',
        'Operation, usage and maintenance procedures for all equipment.',
        'Calibration records for all instruments.',
        'Preventive maintenance for all equipment.'
      ]
    ],
    [
      'V. Administration',
      [
        'Qualification, experience and responsibilities of personnel.',
        'Training procedures & records.',
        'Housekeeping and sanitation.',
        'Waste disposal system.',
        'Pest control system.',
        'Detailed map showing the locations of pest control performed throughout the facility.'
      ]
    ],
    [
      'VI. Quality Assurance',
      [
        'Review of batch production record.',
        'Investigating deviations.',
        'Approval and release of finished product.',
        'Product failure investigation.',
        'Internal quality audits.',
        'Customer complaints.',
        'Handling of return goods.',
        'Product recall.',
        'Disposition of rejected batches.'
      ]
    ]
  ]
};

export const F02_CONFIG: QAFormConfig = {
  id: 'F02',
  code: 'JEQA035-F02-02',
  title: 'Raw Material Vendor Audit Checklist (with sterile API)',
  who: 'Audit by Jodas QA, or vendor self-assessment',
  attest: 'Supplier’s quality representative (in case of self-assessment)',
  verify: 'Audited by (Jodas QA)',
  summaryTitle: 'Summary of assessment (to be filled by Jodas)',
  gen: [
    'Name of the vendor',
    'Address & telephone number',
    'Materials considered for audit',
    'Registered DMF / EDMF No. (wherever applicable)',
    'Products currently purchased from the vendor',
    'Primary QA contact – Name',
    'Primary QA contact – Job title',
    'Primary QA contact – Phone No.',
    'Primary QA contact – Facsimile No.',
    'Are the process areas dedicated for one product? If not, what other products are manufactured',
    'Other important customers of the vendor',
    'Method of transport used for shipment of products',
    'Is the material and facility approved by USFDA / ISO / any other Government organisation (officially accredited body)'
  ],
  sections: [
    [
      'I. Warehouse',
      [
        'Adequate space with specially defined areas available.',
        'Adequate lighting and ventilation.',
        'Disposal of waste in safe and sanitary manner.',
        'Sanitation procedures and schedules available.',
        'Procedures and records for use of rodenticides and insecticides available.',
        'Records indicating material name, Lot No., quantity, manufacturer name, supplier’s name, material code and date received.',
        'Visual examination of materials for damage at the time of receipt and is documented.',
        'Containers of raw materials cleaned externally upon receipt according to a written procedure.',
        'Containers, bags and boxes are off floor and suitably spaced for cleaning & inspection. Different materials and/or different batches of same material stored on different pallets to prevent mix-ups.',
        'Released materials properly segregated from under test materials.',
        'Rejected materials identified and controlled.',
        'Rejected materials handling procedures.',
        'Receipt, storage and issue of labels.',
        'Handling of rejected printed labels.',
        'Materials properly identified and adequately segregated to avoid mix-ups.',
        'First in first out followed; deviation if any, justified and authorized.',
        'Materials inspected and retested at regular intervals, as per a written procedure.',
        'Inventory record of each material maintained.',
        'Controlled storage conditions maintained wherever required.',
        'Calibration procedures and records for weighing scales.',
        'Cleaning & maintenance of dispensing equipment, dispensing area.',
        'Dispensing operation ensures identification, quantity, batch application and avoids cross contamination.',
        'Separate finished products storage.',
        'Finished products distribution records.',
        'Handling of returned products in warehouse.'
      ]
    ],
    [
      'II. Production',
      [
        'Personnel wear adequate protective apparel.',
        'Gowning & de-gowning procedures.',
        'Cleaning & sanitation of uniforms.',
        'Adequate space with specially defined areas.',
        'Adequate lighting, ventilation and air filtration systems.',
        'Adequate clean toilet facilities.',
        'Sanitation procedure and schedules.',
        'Disposal of waste in safe and sanitary manner.',
        'Drains are of adequate size and have adequate mechanical device to prevent back siphonage.',
        'Ceilings, walls, windows, pipes etc. are free from dust.',
        'Equipment is validated (IQ, OQ & PQ).',
        'Equipment is suitably located for easy cleaning operation and maintenance.',
        'All equipment identified with numbers.',
        'All the equipment is status labelled all the time.',
        'Log books for major equipment providing details of cleaning, maintenance and use available, showing date, time, product and lot number of each batch processed (part of batch records where equipment is dedicated).',
        'Equipment cleaning procedures and schedules available and validated.',
        'Procedures, schedules and records available for calibration of gauges, thermometers, level indicators, flow meters etc.',
        'Preventive maintenance procedures and schedules available. Records maintained.',
        'Non-fibre releasing filters used, otherwise suitable additional filters provided.',
        'Written procedures for cleaning / replacing of filters available.',
        'Solvent pipelines labelled to show the contents and flow direction.',
        'Manufacturing processes are validated.',
        'Master production records available, reviewed and approved by appropriate units.',
        'All the operations related to manufacturing process are recorded.',
        'Detailed process flow diagram, depicting all operations.',
        'Deviations from the normal practice recorded and investigated.',
        'All the raw materials and intermediates in the plant identified with proper labels.',
        'Weighing, measuring and subdividing operations of materials adequately supervised and examined by second person.',
        'Addition of materials to the batch verified by second person.',
        'Actual yields and percentages of theoretical yield determined at the conclusion of each stage and verified by a second person.',
        'In-process controls for each stage described in writing.',
        'Rejected in-process materials identified and controlled.',
        'Time limitations for completion of each phase of production are available and followed.',
        'Clean area facilities maintained for isolation and packing of finished product.',
        'Clean room design: (a) HVAC systems validated (IQ, OQ & PQ); (b) air quality class 10,000 at the point of entry; (c) pressure gradients maintained and monitored; (d) filter cleaning / replacement schedule; (e) dust extraction system to avoid cross contamination; (f) entry and gowning procedures.',
        'Written procedures exist for reprocessing of rejected intermediates and finished products.',
        'Lot numbers reflect one homogeneous product run.',
        'Mother liquors / solvents reused are tested against specifications before use.',
        'Method of packing and storage of finished products.',
        'Finished product labelling indicates product name, production site, batch / lot No., manufacturing date, expiry date, quantity, storage conditions and safety instructions if any.',
        'Safety: (a) safety training; (b) location of safety equipment; (c) firefighting system; (d) handling of solvents, acids and alkalis.',
        '§Sterilized disinfectants are used in the aseptic areas.',
        '§Personnel entering aseptic areas are qualified for gowning and media fill.',
        '§Clean-in-place (CIP) and sterilization-in-place (SIP) used for aseptic area equipment, and the processes are validated.',
        '§Validated load patterns for sterilization of materials and articles through steam sterilizer and dry heat sterilizer.',
        '§Aseptic media fill simulations performed as per routine process.',
        '§Filter validation for filters used in the process.',
        '§Procedure for monitoring of non-viable and viable particles (environmental monitoring).',
        '§Hold time studies for sterilized articles used in the aseptic process.',
        '§Procedure for clean room behaviour practices.',
        '§Procedure for fumigation / fogging of aseptic areas.',
        '§Implementation of contamination control strategy.'
      ]
    ],
    [
      'III. Quality Control',
      [
        'Personnel wear protective apparel.',
        'Procedures for cleaning of glass apparatus.',
        'Procedure for calibration of volumetric glassware.',
        'Acceptance of RM & PM: approved vendor list; vendor audit programme; sampling procedures; control sample procedures; specifications & test procedures; validation of in-house test procedures; analytical reports.',
        'In-process testing: sampling procedures; specifications & test procedures; validation of in-house test procedures; analytical reports.',
        'Finished product testing: sampling procedures; specification & test procedures; validation of test procedures; analytical reports.',
        'Laboratory testing records contain date sampled, date received in lab, sample quantity, location sampled, sample description, current method used, weight of sample per test, reference standard ID; raw data confirms reported values; instruments, calibration due dates and volumetric solutions identified; documents in order; release by a second individual.',
        'Control samples of finished products: quantity, collection, storage, retrieval, disposal.',
        'All specifications and test methods reviewed and approved.',
        'Purified / process / potable water: specifications and test procedures; tested for total bacterial count, E. coli, Salmonella, Pseudomonas aeruginosa and Staphylococcus aureus; strains of these organisms available.',
        'Bulk drug substance tested for bioburden, with total count limit available; organisms identified.',
        'All analytical reports signed by chemist with date and checked by second person.',
        'Standard volumetric solutions: procedures, records.',
        'Reference standards: storage, records.',
        'Working standards: standardization, storage, records.',
        'Laboratory equipment / instruments: validated (IQ, OQ, PQ if any); operation procedures; calibration procedures and records; maintenance records.',
        'Animal house: maintenance; identification of animals; history records of use.',
        'In-house microbiology laboratory: (a) sample receipt, storage and documentation; (b) test procedures and media preparation records; (c) stock cultures, handling of reference cultures; (d) periodic environmental monitoring of clean rooms.',
        'Investigation of out-of-specification results.',
        'Retesting schedules for RM and PM available and records maintained.',
        'Stability study programme: procedure, sample size, stability-indicating tests, test intervals, storage conditions, records.',
        'Laboratory log books and records control.',
        'Training and qualification of chemists.',
        'Validation of in-house analytical methods.',
        'Deviations investigation.',
        'Disinfectant efficacy study for disinfectants used in manufacturing and microbiology lab.',
        'Identification of new isolates and their simulations during routine testing.',
        '§Method validation for tests of sterility and bacterial endotoxins.',
        '§Procedure for sampling and testing of media fill materials / articles.',
        '§Validated load patterns for testing of articles and materials.'
      ]
    ],
    [
      'IV. Engineering',
      [
        'Building, facilities and facility layout.',
        'Operation procedures for all equipment.',
        'Calibration procedures and records for all instruments.',
        'Preventive maintenance schedules for all equipment.',
        'Usage and maintenance logs for all utilities: boiler, purified water plant, soft water plant, compressors, air conditioning systems.',
        'Validation of potable water distribution system: (a) treatment of raw water to make it potable; (b) testing of potable water for chemical and microbial attributes.',
        'Validation of purified water plant and distribution system: (a) IQ, OQ, PQ of DM plant and accessories (UV, heat exchangers etc.); (b) as-built drawing of DM water circulation; (c) feed water; (d) regeneration; (e) sanitization of loop and storage tanks; (f) microbiological and chemical monitoring.',
        'Validation of soft water plant and distribution system.',
        'Validation of steam generation and distribution system.',
        'Validation of compressed air generation and distribution system.',
        'Validation of HVAC system: (a) IQ, OQ, PQ of AHUs, VAM etc.; (b) up-to-date P&ID drawings; (c) pressure differentials and air flow patterns in drawings; (d) temperature and RH monitoring; (e) filter checks; (f) pressure gauge calibration; (g) filter replacement schedules; (h) deviations justified and authorized.'
      ]
    ],
    [
      'V. Administration',
      [
        'Organogram of various departments.',
        'Qualification, experience and responsibilities of personnel.',
        'Training procedures & records.',
        'Periodic health check-up of personnel.',
        'Housekeeping and sanitation.',
        'Waste disposal system.',
        'Pest control system, with a detailed map of pest control locations throughout the facility.'
      ]
    ],
    [
      'VI. Quality Assurance',
      [
        'SOP preparation, approval and control system.',
        'Guidelines on validation of equipment.',
        'Guidelines on process validation.',
        'Guidelines on cleaning validation.',
        'Guidelines on raw material vendor qualification.',
        'Guidelines on packaging material vendor qualification.',
        'Specifications & test methods preparation, approval and control systems.',
        'Change control: (a) review of changes in the last year; (b) relevant tests (stability etc.) after the change; (c) relevant documents such as validation protocols updated; (d) area and equipment clearance during batch change-over.',
        'Area and equipment clearance during product change-over.',
        'Assignment of finished product batch No. and expiration date.',
        'Review of batch production record.',
        'Investigating deviations.',
        'Approval and release of finished product.',
        'Guidelines on post-market surveillance.',
        'Annual review of drug substance quality.',
        'Product failure investigation.',
        'Internal quality audits.',
        'Customer complaints.',
        'Handling of returned drug substances.',
        'Product recall.',
        'Disposition of rejected batches.',
        'TSE / BSE free certification process.'
      ]
    ]
  ]
};

@Injectable({
  providedIn: 'root'
})
export class SourcingChecklistService {
  private activeProjectSubject = new BehaviorSubject<ProxyProject>(PROXY_PROJECTS[2]); // Default P3-LEU as in img1
  public activeProject$: Observable<ProxyProject> = this.activeProjectSubject.asObservable();

  private techDataSubject = new BehaviorSubject<TechMaterial[]>(INITIAL_TECH_DATA);
  public techData$: Observable<TechMaterial[]> = this.techDataSubject.asObservable();

  private planDataSubject = new BehaviorSubject<MaterialsPlanRow[]>(INITIAL_PLAN_DATA);
  public planData$: Observable<MaterialsPlanRow[]> = this.planDataSubject.asObservable();

  private selectedRmSubject = new BehaviorSubject<string>('RM-009'); // Default RM-009
  public selectedRm$: Observable<string> = this.selectedRmSubject.asObservable();

  // Pre-qualification state
  // key: rm|formId|section|index -> assessment value
  private assessments: Record<string, string> = {
    'RM-009|F10|I. Warehouse|1': 'Satisfactory',
    'RM-009|F10|I. Warehouse|2': 'Satisfactory',
    'RM-009|F10|I. Warehouse|3': 'Satisfactory',
    'RM-009|F10|II. Production|1': 'Satisfactory',
    'RM-009|F02|I. Warehouse|1': 'Satisfactory',
    'RM-009|F02|I. Warehouse|2': 'Satisfactory'
  };

  private observations: Record<string, string> = {
    'RM-009|F10|I. Warehouse|1': 'Dedicated cleanroom storage',
    'RM-009|F10|I. Warehouse|2': 'Validated HVAC lux levels verified'
  };

  private formMethods: Record<string, 'fill' | 'upload'> = {
    'RM-009|F10': 'fill',
    'RM-009|F02': 'fill'
  };

  private formFiles: Record<string, UploadedDoc[]> = {
    'RM-009|F10': [
      {
        name: 'JEQA035-F10-02_Signed_Vendor_Self_Assessment.pdf',
        size: 1420000,
        sizeFormatted: '1.4 MB',
        when: '14-Nov-2026, 11:30 AM',
        type: 'Filled checklist'
      },
      {
        name: 'GMP_Certificate_Site1_2026.pdf',
        size: 850000,
        sizeFormatted: '850 KB',
        when: '14-Nov-2026, 11:32 AM',
        type: 'GMP / licence certificate'
      }
    ]
  };

  private formOutcomes: Record<string, string> = {
    'RM-009|F10': 'Approved',
    'RM-009|F02': 'Approved with conditions'
  };

  private sterileToggle: Record<string, boolean> = {
    'RM-009': true
  };

  constructor() { }

  get activeProject(): ProxyProject {
    return this.activeProjectSubject.value;
  }

  getTechItems(projectId: string): TechMaterial[] {
    return this.techDataSubject.value.filter(t => t.projectId === projectId);
  }

  setActiveProject(projectId: string): void {
    const proj = PROXY_PROJECTS.find(p => p.id === projectId);
    if (proj) {
      this.activeProjectSubject.next(proj);
      // Select first RM for this project
      const planRows = this.planDataSubject.value.filter(m => m.projectId === proj.id);
      if (planRows.length > 0) {
        this.selectedRmSubject.next(planRows[0].id);
      }
    }
  }

  setSelectedRm(rmId: string): void {
    this.selectedRmSubject.next(rmId);
  }

  addTechMaterial(item: Omit<TechMaterial, 'sno'>): void {
    const currentList = this.techDataSubject.value;
    const maxSno = currentList.length > 0 ? Math.max(...currentList.map(m => m.sno)) : 0;
    const newItem: TechMaterial = {
      ...item,
      sno: maxSno + 1
    };
    this.techDataSubject.next([...currentList, newItem]);

    // Also add to plan data if not present
    const currentPlan = this.planDataSubject.value;
    if (!currentPlan.some(p => p.id === newItem.code)) {
      const newPlanRow: MaterialsPlanRow = {
        projectId: newItem.projectId,
        id: newItem.code,
        name: newItem.name,
        unit: newItem.uom,
        net: newItem.dev + newItem.ebpv,
        qc: Math.max(0.1, Number((newItem.dev * 0.05).toFixed(2))),
        allow: 0.05,
        stock: 0,
        po: 0,
        moq: newItem.uom === 'g' ? 50 : (newItem.uom === 'kg' ? 1 : 25),
        lead: 30,
        price: 5000,
        mfr: 'New Sourced Manufacturer',
        supplier: 'Direct / Authorised Trader',
        qr: 'QR-' + newItem.code,
        decision: 'Pending',
        blocker: 'Initial technical sourcing requirement added'
      };
      this.planDataSubject.next([...currentPlan, newPlanRow]);
    }
  }

  saveTechMaterialWithPlan(item: TechMaterial, planData: Partial<MaterialsPlanRow>): void {
    const currentTech = this.techDataSubject.value;
    const existingIndex = currentTech.findIndex(t => t.projectId === item.projectId && t.code === item.code);
    if (existingIndex !== -1) {
      const updated = [...currentTech];
      updated[existingIndex] = { ...updated[existingIndex], ...item };
      this.techDataSubject.next(updated);
    } else {
      const maxSno = currentTech.length > 0 ? Math.max(...currentTech.map(m => m.sno)) : 0;
      const newItem: TechMaterial = { ...item, sno: maxSno + 1 };
      this.techDataSubject.next([...currentTech, newItem]);
    }

    const currentPlan = this.planDataSubject.value;
    const planIndex = currentPlan.findIndex(p => p.projectId === item.projectId && p.id === item.code);
    if (planIndex !== -1) {
      const updatedPlan = [...currentPlan];
      updatedPlan[planIndex] = {
        ...updatedPlan[planIndex],
        ...planData,
        id: item.code,
        name: item.name,
        unit: item.uom,
        net: item.dev + item.ebpv
      };
      this.planDataSubject.next(updatedPlan);
    } else {
      const newPlan: MaterialsPlanRow = {
        projectId: item.projectId,
        id: item.code,
        name: item.name,
        unit: item.uom,
        net: item.dev + item.ebpv,
        qc: planData.qc ?? Math.max(0.1, Number((item.dev * 0.05).toFixed(2))),
        allow: planData.allow ?? 0.05,
        stock: planData.stock ?? 0,
        po: planData.po ?? 0,
        moq: planData.moq ?? (item.uom === 'g' ? 50 : (item.uom === 'kg' ? 1 : 25)),
        lead: planData.lead ?? 30,
        price: planData.price ?? 5000,
        mfr: planData.mfr || 'Manufacturer',
        supplier: planData.supplier || 'Supplier',
        qr: planData.qr || ('QR-' + item.code),
        decision: (planData.decision as any) || 'Pending',
        blocker: planData.blocker || 'Initial technical sourcing requirement added',
        wdev: planData.wdev || (item.cat?.includes('API') ? '3.1.1' : '3.1.3')
      };
      this.planDataSubject.next([...currentPlan, newPlan]);
    }
  }

  updateTechMaterial(item: TechMaterial): void {
    const currentList = this.techDataSubject.value;
    const index = currentList.findIndex(m => m.projectId === item.projectId && m.code === item.code);
    if (index !== -1) {
      const updated = [...currentList];
      updated[index] = item;
      this.techDataSubject.next(updated);
    }
  }

  deleteTechMaterial(code: string, projectId: string): void {
    const currentList = this.techDataSubject.value;
    this.techDataSubject.next(currentList.filter(m => !(m.projectId === projectId && m.code === code)));
    const currentPlan = this.planDataSubject.value;
    this.planDataSubject.next(currentPlan.filter(p => !(p.projectId === projectId && p.id === code)));
  }

  updatePlanDecision(rmId: string, decision: 'Approved' | 'Pending' | 'Rejected'): void {
    const updated = this.planDataSubject.value.map(row => {
      if (row.id === rmId) {
        return { ...row, decision };
      }
      return row;
    });
    this.planDataSubject.next(updated);
  }

  // Assessment getters & setters
  getAssessment(key: string): string {
    return this.assessments[key] || '';
  }

  setAssessment(key: string, val: string): void {
    this.assessments[key] = val;
  }

  getObservation(key: string): string {
    return this.observations[key] || '';
  }

  setObservation(key: string, val: string): void {
    this.observations[key] = val;
  }

  getMethod(key: string): 'fill' | 'upload' {
    return this.formMethods[key] || 'fill';
  }

  setMethod(key: string, method: 'fill' | 'upload'): void {
    this.formMethods[key] = method;
  }

  getFiles(key: string): UploadedDoc[] {
    return this.formFiles[key] || [];
  }

  addFile(key: string, doc: UploadedDoc): void {
    if (!this.formFiles[key]) {
      this.formFiles[key] = [];
    }
    this.formFiles[key].push(doc);
  }

  removeFile(key: string, index: number): void {
    if (this.formFiles[key]) {
      this.formFiles[key].splice(index, 1);
    }
  }

  getOutcome(key: string): string {
    return this.formOutcomes[key] || '';
  }

  setOutcome(key: string, outcome: string): void {
    this.formOutcomes[key] = outcome;
  }

  isSterile(rmId: string): boolean {
    return !!this.sterileToggle[rmId];
  }

  toggleSterile(rmId: string): void {
    this.sterileToggle[rmId] = !this.sterileToggle[rmId];
  }

  getPreQualScore(rmId: string): string {
    const sterileOn = this.isSterile(rmId);
    let total = 0;
    let assessed = 0;

    F10_CONFIG.sections.forEach(sec => {
      sec[1].forEach((item, i) => {
        if (item.startsWith('§') && !sterileOn) return;
        total++;
        const key = `${rmId}|F10|${sec[0]}|${i + 1}`;
        if (this.assessments[key]) {
          assessed++;
        }
      });
    });

    return `${assessed} / ${total}`;
  }

  updateQualificationStatus(rmId: string, status: string): void {
    const updated = this.planDataSubject.value.map(row => {
      if (row.id === rmId) {
        return { ...row, QualificationStatus: status };
      }
      return row;
    });
    this.planDataSubject.next(updated);
  }

  updatePlanRow(updatedRow: Partial<MaterialsPlanRow> & { id: string }): void {
    const updated = this.planDataSubject.value.map(row => {
      if (row.id === updatedRow.id) {
        return { ...row, ...updatedRow };
      }
      return row;
    });
    this.planDataSubject.next(updated);
  }

  getComputedPlanRows(projectId: string): MaterialsPlanRow[] {
    return this.planDataSubject.value
      .filter(m => m.projectId === projectId)
      .map(m => {
        const need = Math.max(0, m.net * (1 + m.allow) + m.qc - m.stock - m.po);
        const buy = Math.ceil(+(need / (m.moq || 1)).toFixed(6)) * (m.moq || 1);
        const cost = buy * (m.price || 0);
        const tech = this.techDataSubject.value.find(t => t.projectId === m.projectId && t.name === m.name);
        const wdev = (tech && tech.cat.includes('API')) ? '3.1.1' : '3.1.3';
        const QualificationStatus = m.QualificationStatus || (m.decision === 'Approved' ? 'Satisfaction' : 'Need Improvement');
        const PreQualificationChecklist = m.PreQualificationChecklist || this.getPreQualScore(m.id);
        return {
          ...m,
          wdev,
          buy,
          cost,
          QualificationStatus,
          PreQualificationChecklist
        };
      });
  }
}
