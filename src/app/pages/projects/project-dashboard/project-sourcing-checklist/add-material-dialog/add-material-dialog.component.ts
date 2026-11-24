import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  SourcingChecklistService,
  TechMaterial,
  MaterialsPlanRow
} from '../sourcing-checklist.service';

export type MaterialTab = 'sourcing' | 'plan-wbs' | 'plan-details';

export interface TabItem {
  id: MaterialTab;
  label: string;
}

export interface AddMaterialDialogData {
  mode?: 'add' | 'edit';
  projectId: string;
  sno?: number;
  code?: string;
  name?: string;
  grade?: string;
  form?: string;
  markets?: string;
  poly?: string;
  uom?: string;
  dev?: number;
  ebpv?: number;
  type?: string;
  psd?: string;
  cat?: string;
  notes?: string;
  // Plan fields
  devStage?: string;
  devDeliverable?: string;
  devActivity?: string;
  scaleUpStage?: string;
  scaleUpDeliverable?: string;
  scaleUpActivity?: string;
  qc?: number;
  allow?: number;
  stock?: number;
  po?: number;
  moq?: number;
  buy?: number;
  lead?: number;
  price?: number;
  freight?: number;
  cost?: number;
  mfr?: string;
  supplier?: string;
  evidence?: string;
}

export interface BudgetCatalogItem {
  code: string;
  name: string;
  cat: string;
  grade?: string;
  form?: string;
  markets?: string;
  poly?: string;
  uom?: string;
  dev?: number;
  ebpv?: number;
  type?: string;
  psd?: string;
  notes?: string;
  devStage?: string;
  devDeliverable?: string;
  devActivity?: string;
  scaleUpStage?: string;
  scaleUpDeliverable?: string;
  scaleUpActivity?: string;
  qc?: number;
  allow?: number;
  stock?: number;
  po?: number;
  moq?: number;
  lead?: number;
  price?: number;
  freight?: number;
  mfr?: string;
  supplier?: string;
  evidence?: string;
}

export const BUDGET_CATALOG_ITEMS: BudgetCatalogItem[] = [
  {
    code: 'RM-001',
    name: 'Iohexol',
    cat: 'API',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Confirm free flow & optical rotation',
    uom: 'kg',
    dev: 25,
    ebpv: 100,
    type: 'NPD',
    psd: 'Assess formulation relevance (solution formulation)',
    notes: 'Primary contrast agent API; DMF available.',
    devActivity: '3.1.1 API Procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 35000,
    lead: 45,
    mfr: 'Proxy API Mfr A – Site 1 (India)',
    supplier: 'Direct from manufacturer',
    evidence: 'Proxy: CEP available; sample testing complete'
  },
  {
    code: 'RM-002',
    name: 'Trometamol (tromethamine)',
    cat: 'Excipient',
    grade: 'Ph. Eur./USP; parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Crystalline, confirm free flow',
    uom: 'kg',
    dev: 0.6,
    ebpv: 2.4,
    type: 'Regularisation',
    psd: 'Not applicable with rationale',
    notes: 'Buffer component; evaluate trace endotoxins.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 1,
    price: 4500,
    lead: 21,
    mfr: 'Proxy Excipient Mfr B – Site 1',
    supplier: 'Proxy authorised distributor',
    evidence: 'Proxy: none'
  },
  {
    code: 'RM-003',
    name: 'Edetate calcium disodium',
    cat: 'Excipient',
    grade: 'USP, parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Hydrate form confirm',
    uom: 'kg',
    dev: 0.05,
    ebpv: 0.2,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    notes: 'Chelating agent; heavy metal limits strictly monitored.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 1,
    price: 18000,
    lead: 30,
    mfr: 'Proxy Excipient Mfr C – Site 1',
    supplier: 'Proxy authorised distributor',
    evidence: 'Proxy: hydrate form confirmation awaited'
  },
  {
    code: 'RM-004',
    name: 'Hydrochloric acid',
    cat: 'Process solvent',
    grade: 'Ph. Eur./USP, 37% analytical grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Clear fuming liquid',
    uom: 'L',
    dev: 2,
    ebpv: 8,
    type: 'Regularisation',
    psd: 'Not applicable (liquid)',
    notes: 'pH adjustor; analytical grade certified for parenteral use.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 2.5,
    price: 1200,
    lead: 14,
    mfr: 'Proxy Chemical Mfr D – Site 1',
    supplier: 'Proxy distributor',
    evidence: 'Proxy: none'
  },
  {
    code: 'RM-005',
    name: 'Gadobutrol',
    cat: 'API',
    grade: 'In-house spec, sterile grade',
    form: 'Injectable',
    markets: 'Global',
    poly: 'Neutral macrocyclic Gd chelate',
    uom: 'kg',
    dev: 15,
    ebpv: 60,
    type: 'NPD',
    psd: 'Solution product – solubility confirmed',
    notes: 'MRI contrast agent; high thermodynamic stability.',
    devActivity: '3.1.1 API Procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 10,
    price: 95000,
    lead: 60,
    mfr: 'Proxy API Mfr E – Site 1',
    supplier: 'Direct from manufacturer',
    evidence: 'Proxy: single source – alternate under evaluation'
  },
  {
    code: 'RM-006',
    name: 'Calcobutrol sodium',
    cat: 'Critical excipient',
    grade: 'In-house spec, parenteral grade',
    form: 'Injectable',
    markets: 'Global',
    poly: 'Confirm stereochemical purity',
    uom: 'g',
    dev: 150,
    ebpv: 600,
    type: 'NPD',
    psd: 'Not critical – freely water soluble',
    notes: 'Free ligand excess scavenger; critical safety additive.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 50,
    price: 850,
    lead: 45,
    mfr: 'Proxy API Mfr E – Site 1',
    supplier: 'Direct from manufacturer',
    evidence: 'Proxy: tied to API supply contract'
  },
  {
    code: 'RM-009',
    name: 'Leuprolide acetate',
    cat: 'Peptide API',
    grade: 'Peptide API; specification to be approved',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Counterion, water content and assay basis',
    uom: 'g',
    dev: 120,
    ebpv: 480,
    type: 'NPD',
    psd: 'Dissolved in polymer phase – D90 not critical',
    notes: 'LHRH agonist peptide; temperature-controlled storage -20°C.',
    devActivity: '3.1.1 API Procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 100,
    price: 2200,
    lead: 30,
    mfr: 'Proxy Peptide Mfr F – Site 1 (India)',
    supplier: 'Direct from manufacturer',
    evidence: 'Proxy: CoA gap assessment pending'
  },
  {
    code: 'RM-010',
    name: 'PLGA 50:50 (acid end group)',
    cat: 'Critical excipient',
    grade: 'Parenteral grade; IV 0.3–0.4 dL/g (proxy)',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Lactide:glycolide 50:50; acid end group',
    uom: 'kg',
    dev: 2.5,
    ebpv: 10,
    type: 'NPD',
    psd: 'Not applicable – dissolved in organic solvent',
    notes: 'Biodegradable copolymer; strictly controlled IV and moisture.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 1,
    price: 180000,
    lead: 60,
    mfr: 'Proxy Polymer Mfr G – Site 1 (EU)',
    supplier: 'Proxy authorised distributor (India)',
    evidence: 'Proxy: IV spec to be fixed by R&D'
  },
  {
    code: 'RM-011',
    name: 'Polyvinyl alcohol',
    cat: 'Excipient',
    grade: 'Ph. Eur.; parenteral suitability',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Degree of hydrolysis 87–89% (proxy)',
    uom: 'kg',
    dev: 1,
    ebpv: 5,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    notes: 'Emulsifying agent; low bioburden certified.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 5,
    price: 3200,
    lead: 21,
    mfr: 'Proxy Excipient Mfr H – Site 1',
    supplier: 'Direct from manufacturer',
    evidence: 'Proxy: DEG/EG statement received'
  },
  {
    code: 'RM-012',
    name: 'Mannitol',
    cat: 'Excipient',
    grade: 'Ph. Eur./USP, parenteral',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Beta polymorph confirm',
    uom: 'kg',
    dev: 2,
    ebpv: 7,
    type: 'Regularisation',
    psd: 'Cryoprotectant role – PSD not critical',
    notes: 'Lyoprotectant in microsphere formulation.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 900,
    lead: 21,
    mfr: 'Proxy Excipient Mfr I – Site 1',
    supplier: 'Proxy trader (authorised)',
    evidence: 'Proxy: 2 kg approved stock netted'
  },
  {
    code: 'RM-013',
    name: 'Dichloromethane',
    cat: 'Process solvent',
    grade: 'ACS reagent / HPLC grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Class 2 solvent – residual limit 600 ppm',
    uom: 'L',
    dev: 20,
    ebpv: 80,
    type: 'AVD',
    psd: 'Liquid – not applicable',
    notes: 'Emulsion organic phase solvent; EHS permits valid.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 350,
    lead: 14,
    mfr: 'Proxy Solvent Mfr J – Site 1',
    supplier: 'Proxy solvent distributor',
    evidence: 'Proxy: 20 L open PO netted; EHS storage approval'
  },
  {
    code: 'RM-014',
    name: 'Gelatin (bovine / fish proxy)',
    cat: 'Excipient',
    grade: 'Ph. Eur., low endotoxin',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Bloom strength 150–200 confirm',
    uom: 'kg',
    dev: 0.5,
    ebpv: 2,
    type: 'NPD',
    psd: 'Aqueous soluble',
    notes: 'Viscosity modifier; TSE/BSE risk certified.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 1,
    price: 8500,
    lead: 30,
    mfr: 'Proxy Excipient Mfr K – Site 1 (EU)',
    supplier: 'Proxy authorised distributor',
    evidence: 'Proxy: TSE certificate not provided – re-source'
  },
  {
    code: 'RM-015',
    name: 'Acetic acid (glacial)',
    cat: 'Process solvent',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'High purity analytical grade',
    uom: 'L',
    dev: 1,
    ebpv: 4,
    type: 'Regularisation',
    psd: 'Liquid – not applicable',
    notes: 'Solvent for peptide wash stages.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 2.5,
    price: 1500,
    lead: 14,
    mfr: 'Proxy Chemical Mfr D – Site 1',
    supplier: 'Proxy distributor',
    evidence: 'Proxy: none'
  },
  {
    code: 'RM-016',
    name: 'Water for injections (Bulk)',
    cat: 'Excipient',
    grade: 'EP/USP, sterile parenteral',
    form: 'Injectable',
    markets: 'Global',
    poly: 'Pyrogen free < 0.25 EU/mL',
    uom: 'L',
    dev: 50,
    ebpv: 200,
    type: 'Regularisation',
    psd: 'Not applicable',
    notes: 'In-house generation loop; daily bioburden and TOC testing.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 100,
    price: 25,
    lead: 2,
    mfr: 'In-house WFI System',
    supplier: 'Internal',
    evidence: 'Proxy: validated loop'
  },
  {
    code: 'RM-017',
    name: 'Glacial Acetic Acid',
    cat: 'Process solvent',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'High purity analytical grade',
    uom: 'L',
    dev: 5,
    ebpv: 10,
    type: 'NPD',
    psd: 'Not applicable with rationale',
    notes: 'Buffer component; test for residual aldehydes and formic acid.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 5,
    price: 1600,
    lead: 14,
    mfr: 'Proxy Chemical Mfr D – Site 1',
    supplier: 'Proxy distributor',
    evidence: 'Analytical test protocol approved'
  },
  {
    code: 'RM-018',
    name: 'Water for Injections (Bulk)',
    cat: 'Excipient',
    grade: 'EP/USP, sterile parenteral',
    form: 'Injectable',
    markets: 'Global',
    poly: 'Pyrogen free < 0.25 EU/mL',
    uom: 'L',
    dev: 500,
    ebpv: 1500,
    type: 'Regularisation',
    psd: 'Not applicable',
    notes: 'In-house generation loop qualification; daily bioburden and TOC.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 500,
    price: 25,
    lead: 3,
    mfr: 'In-house WFI generation loop',
    supplier: 'Internal supply',
    evidence: 'Loop qualification data available'
  },
  {
    code: 'RM-019',
    name: 'Octreotide Acetate',
    cat: 'Peptide API',
    grade: 'Peptide API, parenteral grade',
    form: 'Injectable',
    markets: 'EU, US, India',
    poly: 'Counterion, optical rotation confirmed',
    uom: 'g',
    dev: 25,
    ebpv: 250,
    type: 'NPD',
    psd: 'Not critical – dissolved in aqueous phase',
    notes: 'Synthetic octapeptide; TFA residual limits < 0.2%.',
    devActivity: '3.1.1 API Procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 50,
    price: 4500,
    lead: 45,
    mfr: 'Proxy Peptide Synthetics Ltd',
    supplier: 'Direct manufacturer',
    evidence: 'DMF submitted in EU'
  },
  {
    code: 'RM-020',
    name: 'Sodium Chloride',
    cat: 'Excipient',
    grade: 'Ph. Eur./USP, parenteral grade',
    form: 'Injectable',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'Crystalline, confirm free flow',
    uom: 'kg',
    dev: 10,
    ebpv: 50,
    type: 'AVD',
    psd: 'Not applicable with rationale',
    notes: 'Tonicity modifier; pyrogen free.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 180,
    lead: 10,
    mfr: 'Proxy Salt Refineries',
    supplier: 'Authorised chemical distributor',
    evidence: 'Endotoxin spec passed'
  },
  {
    code: 'RM-021',
    name: 'Polysorbate 80',
    cat: 'Excipient',
    grade: 'Super refined, parenteral grade',
    form: 'Injectable',
    markets: 'Global',
    poly: 'Viscous amber liquid',
    uom: 'kg',
    dev: 2,
    ebpv: 10,
    type: 'NPD',
    psd: 'Not applicable',
    notes: 'Surfactant; low peroxide value essential.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 1,
    price: 12000,
    lead: 25,
    mfr: 'Proxy Surfactants Corp',
    supplier: 'Direct from manufacturer',
    evidence: 'Low peroxide batch certified'
  },
  {
    code: 'RM-022',
    name: 'Sucrose',
    cat: 'Excipient',
    grade: 'Low endotoxin, parenteral grade',
    form: 'Injectable',
    markets: 'Global',
    poly: 'White crystalline powder',
    uom: 'kg',
    dev: 5,
    ebpv: 25,
    type: 'Regularisation',
    psd: 'Aqueous soluble',
    notes: 'Cryoprotectant; microbial limits tightly specified.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 450,
    lead: 15,
    mfr: 'Proxy Sugar Fine Chem',
    supplier: 'Distributor',
    evidence: 'Endotoxin < 0.05 EU/g'
  },
  {
    code: 'RM-023',
    name: 'Microcrystalline Cellulose',
    cat: 'Excipient',
    grade: 'Ph. Eur./USP, PH-102 grade',
    form: 'Oral Solid',
    markets: 'India, ROW (GCC, LATAM)',
    poly: 'White or almost white fine powder',
    uom: 'kg',
    dev: 20,
    ebpv: 100,
    type: 'Regularisation',
    psd: 'Mean particle size ~ 100 µm',
    notes: 'Dry binder and disintegrant.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 320,
    lead: 14,
    mfr: 'Proxy Cellulose Products',
    supplier: 'Authorised distributor',
    evidence: 'PSD and bulk density verified'
  },
  {
    code: 'RM-024',
    name: 'Magnesium Stearate',
    cat: 'Excipient',
    grade: 'USP vegetable source',
    form: 'Oral Solid',
    markets: 'Global',
    poly: 'Fine impalpable powder',
    uom: 'kg',
    dev: 1,
    ebpv: 5,
    type: 'AVD',
    psd: 'D90 < 45 µm',
    notes: 'Tablet lubricant; vegetable origin certificate required.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 5,
    price: 850,
    lead: 14,
    mfr: 'Proxy Stearate Specialists',
    supplier: 'Direct distributor',
    evidence: 'TSE/BSE free statement'
  },
  {
    code: 'RM-025',
    name: 'Ethanol (Absolute)',
    cat: 'Process solvent',
    grade: 'Ph. Eur., 99.9% purity',
    form: 'Liquid Oral',
    markets: 'Global',
    poly: 'Clear colorless volatile liquid',
    uom: 'L',
    dev: 10,
    ebpv: 50,
    type: 'Regularisation',
    psd: 'Liquid – not applicable',
    notes: 'Extraction and granulation solvent; excise permit required.',
    devActivity: '3.1.3 Excipients procurement for Developmental studies',
    scaleUpActivity: '5.1.5 RM procurement for Scale-Up / EB Batches',
    moq: 25,
    price: 220,
    lead: 10,
    mfr: 'Proxy Distilleries & Chemicals',
    supplier: 'Licensed distributor',
    evidence: 'Excise license in place'
  }
];

@Component({
  selector: 'app-add-material-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-material-dialog.component.html',
  styleUrl: './add-material-dialog.component.scss'
})
export class AddMaterialDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  catalog = BUDGET_CATALOG_ITEMS;

  activeTab: MaterialTab = 'sourcing';
  tabs: TabItem[] = [
    { id: 'sourcing', label: 'Technical Sourcing' },
    { id: 'plan-wbs', label: 'Material Plan (WBS)' },
    { id: 'plan-details', label: 'Plan Details & Cost' }
  ];

  // Dropdown option sets
  dosageForms: string[] = [
    'Injectable',
    'Oral Solid',
    'Liquid Oral',
    'Topical',
    'Inhalation',
    'Ophthalmic'
  ];

  targetMarkets: string[] = [
    'India, ROW (GCC, LATAM)',
    'EU, US, India',
    'Global',
    'India',
    'US',
    'Europe',
    'ROW'
  ];

  uomList: string[] = ['kg', 'g', 'mg', 'L', 'mL'];

  sourcingTypes: string[] = ['NPD', 'AVD', 'Regularisation'];

  devStages: string[] = [
    'Stage 3 (S3): Development Procurement',
    'Stage 2 (S2): Project Initiation',
    'Stage 4 (S4): POC Formulation'
  ];

  devDeliverables: string[] = [
    '3.1 Procurement - Developmental studies',
    '2.1 Project charter and initiation',
    '4.1 Prototype formulation trials'
  ];

  devActivities: string[] = [
    '3.1.1 API Procurement for Developmental studies',
    '3.1.2 RLD Procurement for Developmental studies',
    '3.1.3 Excipients procurement for Developmental studies',
    '3.1.4 Miscellaneous items like filters etc procurement',
    '3.1.5 Packaging materials Procurement for Developmental studies'
  ];

  scaleUpStages: string[] = [
    'Stage 5 (S5): Scale-Up & EB procurement',
    'Stage 6 (S6): API Validation',
    'Stage 7 (S7): FP Validation',
    'Stage 9 (S9): Exhibit Batches'
  ];

  scaleUpDeliverables: string[] = [
    '5.1 Procurement submission batches',
    '6.1 API Validation execution',
    '7.1 FP Validation execution',
    '9.1 Exhibit batch manufacturing'
  ];

  scaleUpActivities: string[] = [
    '5.1.1 BOM for RM',
    '5.1.2 BOM for Consumables',
    '5.1.3 BOM for Miscellaneous (if any)',
    '5.1.4 RM, PM, Consumables, Miscellaneous procurement',
    '5.1.5 RM procurement for Scale-Up / EB Batches'
  ];

  constructor(
    private fb: FormBuilder,
    private service: SourcingChecklistService,
    public dialogRef: MatDialogRef<AddMaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMaterialDialogData
  ) {
    this.form = this.fb.group({
      // Technical Sourcing Requirements
      code: ['', [Validators.required]],
      name: [{ value: '', disabled: false }, [Validators.required]],
      cat: [{ value: '', disabled: false }, [Validators.required]],
      grade: ['Ph. Eur./USP, parenteral grade', [Validators.required]],
      form: ['Injectable', [Validators.required]],
      markets: ['India, ROW (GCC, LATAM)', [Validators.required]],
      poly: ['Crystalline / conform to spec', [Validators.required]],
      uom: ['kg', [Validators.required]],
      dev: [1, [Validators.required, Validators.min(0)]],
      ebpv: [1, [Validators.required, Validators.min(0)]],
      type: ['NPD', [Validators.required]],
      psd: ['Assess formulation relevance', [Validators.required]],
      notes: [''],

      // Edit Material Plan (Mandatory*)
      devStage: ['Stage 3 (S3): Development Procurement', [Validators.required]],
      devDeliverable: ['3.1 Procurement - Developmental studies', [Validators.required]],
      devActivity: ['3.1.1 API Procurement for Developmental studies', [Validators.required]],
      scaleUpStage: ['Stage 5 (S5): Scale-Up & EB procurement', [Validators.required]],
      scaleUpDeliverable: ['5.1 Procurement submission batches', [Validators.required]],
      scaleUpActivity: ['5.1.5 RM procurement for Scale-Up / EB Batches', [Validators.required]],

      // Edit Material Plan (Non Mandatory)
      qc: [0.1],
      allow: [5], // 5%
      stock: [0],
      po: [0],
      moq: [1],
      buy: [0],
      lead: [30],
      price: [1000],
      freight: [0],
      cost: [0],
      mfr: [''],
      supplier: [''],
      evidence: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      // Find matching existing plan row for default values
      const existingPlan = this.service.getComputedPlanRows(this.data.projectId).find(p => p.id === this.data.code);

      this.form.patchValue({
        code: this.data.code ?? '',
        name: this.data.name ?? existingPlan?.name ?? '',
        cat: this.data.cat ?? (this.data.code?.includes('001') || this.data.code?.includes('005') || this.data.code?.includes('009') ? 'API' : 'Excipient'),
        grade: this.data.grade ?? 'Ph. Eur./USP, parenteral grade',
        form: this.data.form ?? 'Injectable',
        markets: this.data.markets ?? 'India, ROW (GCC, LATAM)',
        poly: this.data.poly ?? 'Crystalline / conform to spec',
        uom: this.data.uom ?? existingPlan?.unit ?? 'kg',
        dev: this.data.dev ?? (existingPlan ? Math.round(existingPlan.net * 0.2) : 1),
        ebpv: this.data.ebpv ?? (existingPlan ? Math.round(existingPlan.net * 0.8) : 4),
        type: this.data.type ?? 'NPD',
        psd: this.data.psd ?? 'Assess formulation relevance',
        notes: this.data.notes ?? '',

        devStage: this.data.devStage ?? 'Stage 3 (S3): Development Procurement',
        devDeliverable: this.data.devDeliverable ?? '3.1 Procurement - Developmental studies',
        devActivity: this.data.devActivity ?? (existingPlan?.wdev === '3.1.1' ? '3.1.1 API Procurement for Developmental studies' : '3.1.3 Excipients procurement for Developmental studies'),
        scaleUpStage: this.data.scaleUpStage ?? 'Stage 5 (S5): Scale-Up & EB procurement',
        scaleUpDeliverable: this.data.scaleUpDeliverable ?? '5.1 Procurement submission batches',
        scaleUpActivity: this.data.scaleUpActivity ?? '5.1.5 RM procurement for Scale-Up / EB Batches',

        qc: this.data.qc ?? existingPlan?.qc ?? 0.1,
        allow: this.data.allow ?? (existingPlan ? existingPlan.allow * 100 : 5),
        stock: this.data.stock ?? existingPlan?.stock ?? 0,
        po: this.data.po ?? existingPlan?.po ?? 0,
        moq: this.data.moq ?? existingPlan?.moq ?? 1,
        buy: this.data.buy ?? existingPlan?.buy ?? 0,
        lead: this.data.lead ?? existingPlan?.lead ?? 30,
        price: this.data.price ?? existingPlan?.price ?? 1000,
        freight: this.data.freight ?? 0,
        cost: this.data.cost ?? existingPlan?.cost ?? 0,
        mfr: this.data.mfr ?? existingPlan?.mfr ?? '',
        supplier: this.data.supplier ?? existingPlan?.supplier ?? '',
        evidence: this.data.evidence ?? existingPlan?.blocker ?? ''
      });

      this.recalculatePlan();
    } else {
      // Pick first item as initial selection if available
      if (this.catalog.length > 0) {
        this.populateFromCatalog(this.catalog[0]);
      }
    }
  }

  onSelectMaterialCode(e: Event): void {
    const code = (e.target as HTMLSelectElement).value;
    if (!code) return;
    const item = this.catalog.find(c => c.code === code);
    if (item) {
      this.populateFromCatalog(item);
    }
  }

  populateFromCatalog(item: BudgetCatalogItem): void {
    this.form.patchValue({
      code: item.code,
      name: item.name,
      cat: item.cat,
      grade: item.grade || 'Ph. Eur./USP, parenteral grade',
      form: item.form || 'Injectable',
      markets: item.markets || 'India, ROW (GCC, LATAM)',
      poly: item.poly || 'Crystalline / conform to spec',
      uom: item.uom || 'kg',
      dev: item.dev ?? 1,
      ebpv: item.ebpv ?? 1,
      type: item.type || 'NPD',
      psd: item.psd || 'Assess formulation relevance',
      notes: item.notes || '',
      devStage: item.devStage || 'Stage 3 (S3): Development Procurement',
      devDeliverable: item.devDeliverable || '3.1 Procurement - Developmental studies',
      devActivity: item.devActivity || (item.cat.includes('API') ? '3.1.1 API Procurement for Developmental studies' : '3.1.3 Excipients procurement for Developmental studies'),
      scaleUpStage: item.scaleUpStage || 'Stage 5 (S5): Scale-Up & EB procurement',
      scaleUpDeliverable: item.scaleUpDeliverable || '5.1 Procurement submission batches',
      scaleUpActivity: item.scaleUpActivity || '5.1.5 RM procurement for Scale-Up / EB Batches',
      qc: item.qc ?? 0.1,
      allow: item.allow ?? 5,
      stock: item.stock ?? 0,
      po: item.po ?? 0,
      moq: item.moq ?? (item.uom === 'g' ? 50 : 1),
      lead: item.lead ?? 30,
      price: item.price ?? 1000,
      freight: item.freight ?? 0,
      mfr: item.mfr || '',
      supplier: item.supplier || '',
      evidence: item.evidence || ''
    });

    this.recalculatePlan();
  }

  onUomChange(): void {
    const uom = this.form.get('uom')?.value;
    if (uom === 'g') {
      this.form.patchValue({ moq: 50 }, { emitEvent: false });
    } else if (uom === 'kg') {
      this.form.patchValue({ moq: 1 }, { emitEvent: false });
    } else if (uom === 'L') {
      this.form.patchValue({ moq: 2.5 }, { emitEvent: false });
    }
    this.recalculatePlan();
  }

  recalculatePlan(): void {
    const dev = Number(this.form.get('dev')?.value || 0);
    const ebpv = Number(this.form.get('ebpv')?.value || 0);
    const qc = Number(this.form.get('qc')?.value || 0);
    const rawAllow = Number(this.form.get('allow')?.value || 0);
    const allowFraction = rawAllow > 1 ? rawAllow / 100 : rawAllow;
    const stock = Number(this.form.get('stock')?.value || 0);
    const po = Number(this.form.get('po')?.value || 0);
    const moq = Number(this.form.get('moq')?.value || 1);

    const net = dev + ebpv;
    const need = Math.max(0, net * (1 + allowFraction) + qc - stock - po);
    const buy = Math.ceil(+(need / (moq || 1)).toFixed(6)) * (moq || 1);

    this.form.patchValue({ buy }, { emitEvent: false });
    this.recalculateCost();
  }

  recalculateCost(): void {
    const buy = Number(this.form.get('buy')?.value || 0);
    const price = Number(this.form.get('price')?.value || 0);
    const freight = Number(this.form.get('freight')?.value || 0);
    const cost = (buy * price) + freight;
    this.form.patchValue({ cost }, { emitEvent: false });
  }

  setActiveTab(tab: MaterialTab): void {
    this.activeTab = tab;
  }

  prevTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex > 0) {
      this.activeTab = this.tabs[currentIndex - 1].id;
    }
  }

  nextTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex < this.tabs.length - 1) {
      this.activeTab = this.tabs[currentIndex + 1].id;
    }
  }

  save(): void {
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const sourcingControls = ['code', 'name', 'cat', 'grade', 'form', 'markets', 'poly', 'uom', 'dev', 'ebpv', 'type', 'psd'];
      const planWbsControls = ['devStage', 'devDeliverable', 'devActivity', 'scaleUpStage', 'scaleUpDeliverable', 'scaleUpActivity'];
      if (sourcingControls.some(c => this.form.get(c)?.invalid)) {
        this.activeTab = 'sourcing';
      } else if (planWbsControls.some(c => this.form.get(c)?.invalid)) {
        this.activeTab = 'plan-wbs';
      } else {
        this.activeTab = 'plan-details';
      }
      return;
    }

    const val = this.form.getRawValue();

    const techItem: TechMaterial = {
      projectId: this.data.projectId,
      sno: this.data.sno ?? 1,
      code: val.code,
      name: val.name,
      grade: val.grade,
      form: val.form,
      markets: val.markets,
      poly: val.poly,
      uom: val.uom,
      dev: Number(val.dev || 0),
      ebpv: Number(val.ebpv || 0),
      type: val.type,
      psd: val.psd,
      cat: val.cat,
      notes: val.notes
    };

    const allowFraction = Number(val.allow || 0) > 1 ? Number(val.allow) / 100 : Number(val.allow || 0);

    const planRow: Partial<MaterialsPlanRow> = {
      id: val.code,
      name: val.name,
      unit: val.uom,
      net: Number(val.dev || 0) + Number(val.ebpv || 0),
      qc: Number(val.qc || 0),
      allow: allowFraction,
      stock: Number(val.stock || 0),
      po: Number(val.po || 0),
      moq: Number(val.moq || 1),
      lead: Number(val.lead || 0),
      price: Number(val.price || 0),
      buy: Number(val.buy || 0),
      cost: Number(val.cost || 0),
      mfr: val.mfr || '',
      supplier: val.supplier || '',
      qr: 'QR-' + val.code,
      decision: 'Pending',
      blocker: val.evidence || 'Material plan saved',
      wdev: val.devActivity?.split(' ')[0] || (val.cat?.includes('API') ? '3.1.1' : '3.1.3')
    };

    // Save to service
    this.service.saveTechMaterialWithPlan(techItem, planRow);

    // Close modal
    this.dialogRef.close({ techMaterial: techItem, planRow });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
