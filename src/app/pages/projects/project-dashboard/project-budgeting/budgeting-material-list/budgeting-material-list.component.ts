import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MainCostRow } from '../project-budgeting.component';
import { AddBudgetingMaterialComponent } from './add-budgeting-material/add-budgeting-material.component';

export type CostPhaseTab = 'total' | 'dev' | 'scaleup' | 'pivotal';

export interface CostTabDefinition {
  id: CostPhaseTab;
  label: string;
  icon: string;
  description: string;
}

export interface BudgetMaterialItem {
  id: string;
  category: string;
  materialCode: number | string;
  description: string;
  purchaseUom: string;
  purchasePrice: number;
  purchasedQty: number;
  totalPurchaseCost: number;

  // Development Cost Columns
  totalCycles: number;
  inputQtyPerCycle: number;
  inputUom: string;
  conversionFactor: number;
  devBatchSize: number;
  costPerCycle: number;
  devTotalCost: number;

  // Scale-up Columns
  scaleUpBatchSize: number;
  scaleUpCost: number;

  // Pivotal Costs Columns
  pivotalBatchQty: number;
  numberOfBatches: number;
  pivotalQty: number;
  pivotalCost: number;

  // Total Cost Columns
  totalQty: number;
  totalCost: number;

  // Raw 40-element array for add/edit dialog compatibility
  rawRow: any[];
}

export function mapRowToMaterialItem(r: any[], index: number): BudgetMaterialItem {
  const category = String(r[0] || '').trim();
  const materialCode = r[1] ?? '';
  const description = String(r[2] || '').trim();
  const purchaseUom = String(r[3] || '').trim();
  const purchasePrice = Number(r[4]) || 0;
  const purchasedQty = Number(r[5]) || 0;
  const totalPurchaseCost = Number(r[6]) || (purchasePrice * purchasedQty);

  const totalCycles = Number(r[7]) || (r[11] ? 20 : 0);
  const inputQtyPerCycle = Number(r[8]) || 0;
  const inputUom = String(r[9] || '').trim();
  const conversionFactor = Number(r[10]) || 1;
  const devBatchSize = Number(r[11]) || 0;
  const costPerCycle = Number(r[13]) || ((purchasePrice / conversionFactor) * inputQtyPerCycle * devBatchSize);
  const devTotalCost = Number(r[33]) || (costPerCycle * totalCycles);

  const scaleUpBatchSize = Number(r[35]) || 0;
  const scaleUpCost = Number(r[36]) || ((purchasePrice / conversionFactor) * inputQtyPerCycle * scaleUpBatchSize);

  const pivotalBatchQty = Number(r[37]) || 0;
  const numberOfBatches = (Number(r[38]) && Number(r[37])) ? Math.round(Number(r[38]) / Number(r[37])) : 3;
  const pivotalQty = Number(r[38]) || (pivotalBatchQty * numberOfBatches);
  const pivotalCost = Number(r[39]) || ((purchasePrice / conversionFactor) * inputQtyPerCycle * pivotalQty);

  const totalQty = (devBatchSize * totalCycles) + scaleUpBatchSize + pivotalQty;
  const totalCost = devTotalCost + scaleUpCost + pivotalCost;

  return {
    id: `mat-${materialCode || index}-${index}`,
    category,
    materialCode,
    description,
    purchaseUom,
    purchasePrice,
    purchasedQty,
    totalPurchaseCost,
    totalCycles,
    inputQtyPerCycle,
    inputUom,
    conversionFactor,
    devBatchSize,
    costPerCycle,
    devTotalCost,
    scaleUpBatchSize,
    scaleUpCost,
    pivotalBatchQty,
    numberOfBatches,
    pivotalQty,
    pivotalCost,
    totalQty,
    totalCost,
    rawRow: r
  };
}

@Component({
  selector: 'app-budgeting-material-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './budgeting-material-list.component.html',
  styleUrl: './budgeting-material-list.component.scss'
})
export class BudgetingMaterialListComponent implements OnInit, OnChanges {
  @Input() selectedCostItem: MainCostRow | null = null;
  @Input() initialTab: CostPhaseTab = 'total';
  @Input() productName = 'Acrylic Emulsion Binder 50% Solids';
  @Input() projectCode = '2026/CHM/001';
  @Output() back = new EventEmitter<void>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // 4 Horizontal Tabs
  costTabs: CostTabDefinition[] = [
    { id: 'total', label: 'Total Cost', icon: 'calculate', description: 'Comprehensive material costing view with all phase columns' },
    { id: 'dev', label: 'Development Cost', icon: 'science', description: 'Development trial batches costing (20 cycles)' },
    { id: 'scaleup', label: 'Scale-up Cost', icon: 'trending_up', description: 'Scale-up batch costing' },
    { id: 'pivotal', label: 'Pivotal Cost', icon: 'verified', description: 'Pivotal 3 EB batches costing' }
  ];

  activeCostTab: CostPhaseTab = 'total';

  // Filters
  activeCategory = 'ALL';
  searchQuery = '';

  // Pagination matching standard PRAGATI screens
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  // Toast Notification
  toastVisible = false;
  toastMessage = '';
  private toastTimer: any;

  // Raw source materials (24 items from workbook)
  rawMaterials: any[][] = [
  [
    "API",
    10000435,
    "Amphotericin B ",
    "Kg",
    2755000,
    0.5,
    1377500,
    20,
    62.5,
    "mg",
    1000000,
    200,
    62.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    34437.5,
    688750,
    62.5,
    2000,
    344375,
    2000,
    6000,
    1033125
  ],
  [
    "Excepient",
    10100277,
    "Hydrogenated soy phosphatidylcholine ",
    "Kg",
    89460,
    2,
    178920,
    20,
    234.3,
    "mg",
    1000000,
    200,
    234.3,
    4192.095600000001,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    4192.0956,
    83841.91200000001,
    234.3,
    2000,
    41920.956,
    2000,
    6000,
    125762.86799999999
  ],
  [
    "Excepient",
    10100278,
    "Distearoyl phosphatidyl glycerol sodium ",
    "Kg",
    703800,
    2,
    1407600,
    20,
    92.4,
    "mg",
    1000000,
    200,
    92.4,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    13006.224,
    260124.4799999999,
    92.4,
    2000,
    130062.24,
    2000,
    6000,
    390186.72000000003
  ],
  [
    "Excepient",
    10100495,
    "Cholesterol",
    "Kg",
    612000,
    3,
    1836000,
    20,
    56.160000000000004,
    "mg",
    1000000,
    200,
    56.160000000000004,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    6873.984,
    137479.67999999996,
    56.160000000000004,
    2000,
    68739.84,
    2000,
    6000,
    206219.52
  ],
  [
    "Excepient",
    10100519,
    "DL-alpha-tocopherol*",
    "Kg",
    51520,
    4,
    206080,
    20,
    0.8320000000000001,
    "mg",
    1000000,
    200,
    0.8320000000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    8.572928000000001,
    171.45856,
    0.8320000000000001,
    2000,
    85.72928000000002,
    2000,
    6000,
    257.18784000000005
  ],
  [
    "Excepient",
    10100501,
    "Sucrose ",
    "Kg",
    15005,
    5,
    75025,
    20,
    900,
    "mg",
    1000000,
    200,
    900,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    2700.9,
    54018.000000000015,
    900,
    2000,
    27009,
    2000,
    6000,
    81027
  ],
  [
    "Excepient",
    10100282,
    "Disodium succinate hexahydrate",
    "Kg",
    145843,
    1,
    145843,
    20,
    27,
    "mg",
    1000000,
    200,
    27,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    787.5522,
    15751.044,
    27,
    2000,
    7875.522,
    2000,
    6000,
    23626.566
  ],
  [
    "Excepient",
    10100496,
    "Methanol",
    "Ltr",
    5000,
    50,
    250000,
    20,
    2.5,
    "ml",
    1000,
    200,
    2.5,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    2500,
    50000,
    2.5,
    2000,
    25000,
    2000,
    6000,
    75000
  ],
  [
    "Excepient",
    10100038,
    "sodium hydroxide ",
    "Kg",
    5331.2,
    10,
    53312,
    20,
    0.16,
    "KG",
    1,
    200,
    0.16,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    170598.4,
    3411967.999999999,
    0.16,
    2000,
    1705984,
    2000,
    6000,
    5117952
  ],
  [
    "Excepient",
    10100487,
    "Chloroform",
    "Ltr",
    2031.05,
    10,
    20310.5,
    20,
    2.5,
    "ml",
    1000,
    200,
    2.5,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    1015.5250000000001,
    20310.5,
    2.5,
    2000,
    10155.25,
    2000,
    6000,
    30465.75
  ],
  [
    "Excepient",
    10100496,
    "Hydrochloric acid ",
    "Ltr",
    5000,
    10,
    50000,
    20,
    0.14,
    "Ltr",
    1000,
    200,
    0.14,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    2800,
    0.14,
    2000,
    1400.0000000000002,
    2000,
    6000,
    4200
  ],
  [
    "Primary packing",
    10200696,
    "25 ml, 20 mm clear tubular type 1, flat bottom glass vial",
    "No.",
    7,
    100,
    700,
    20,
    1,
    "NOS",
    1,
    200,
    1,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    1400,
    28000,
    1,
    2000,
    14000,
    2000,
    6000,
    42000
  ],
  [
    "Primary packing",
    10200485,
    "20 mm double slotted grey bromobutyl RTU rubber stopper",
    "No.",
    10.3,
    100,
    1030,
    20,
    1,
    "NOS",
    1,
    200,
    1,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    2060,
    41200,
    1,
    2000,
    20600,
    2000,
    6000,
    61800.00000000001
  ],
  [
    "Secondary Packing",
    10201019,
    "20 mm sky blue aluminium flipoff seal",
    "No.",
    0.51,
    10,
    5.1,
    20,
    1,
    "NOS",
    1,
    200,
    1,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    102,
    2040,
    1,
    2000,
    1020,
    2000,
    6000,
    3060
  ],
  [
    "Tertiary Packing",
    10503876,
    "Versapor membrane 5µ, 25 mm sterile (Code: 6094184)",
    "No.",
    185,
    1,
    185,
    null,
    1,
    "NOS",
    1,
    200,
    1,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    37000,
    740000,
    1,
    2000,
    370000,
    2000,
    6000,
    1110000
  ],
  [
    "Tertiary Packing",
    10302760,
    "Amphotericin B liposomal- Insert",
    "No.",
    2.88,
    1,
    2.88,
    null,
    1,
    "NOS",
    1,
    200,
    1,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    576,
    11520,
    1,
    2000,
    5760,
    2000,
    6000,
    17280
  ],
  [
    "Tertiary Packing",
    10302759,
    "Amphotericin B liposomal 50mg- Printed carton",
    "No.",
    2.88,
    1,
    2.88,
    null,
    1,
    "NOS",
    27,
    200,
    1,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    21.333333333333332,
    426.6666666666665,
    1,
    2000,
    213.33333333333331,
    2000,
    6000,
    640
  ],
  [
    "Tertiary Packing",
    10400191,
    "E-flute Inner carton (285x285x95 mm (ID))",
    "No.",
    27,
    1,
    27,
    null,
    1,
    "NOS",
    27,
    200,
    1,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    200,
    4000,
    1,
    2000,
    2000,
    2000,
    6000,
    6000
  ],
  [
    "Tertiary Packing",
    10400193,
    "7 ply Outer shipper (580x290x225 mm (ID))",
    "No.",
    94,
    1,
    94,
    null,
    1,
    "NOS",
    100,
    200,
    1,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    188,
    3760,
    1,
    2000,
    1880,
    2000,
    6000,
    5640
  ],
  [
    "Consumables",
    10706435,
    "Imapure platinum cured silicone tubing – 5 mm ID X 11mm ODCatalogue Number: 901-128-60",
    "Mtrs",
    294,
    10,
    2940,
    null,
    30,
    "Mtrs",
    200,
    200,
    30,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    8820,
    176400,
    30,
    2000,
    8820,
    2000,
    6000,
    26460
  ],
  [
    "Consumables",
    10706658,
    "Imapure platinum cured silicone tubing- 8mm ID X14 mm OD Catalogue number: 901-142-60",
    "Mtrs",
    495,
    10,
    4950,
    null,
    15,
    "Mtrs",
    200,
    200,
    15,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    7425,
    148500,
    15,
    2000,
    7425,
    2000,
    6000,
    22275
  ],
  [
    "Consumables",
    10707594,
    "Imapure platinum cured silicone tubing- 12mm ID X 18 mm OD Catalogue number: 901-152-60",
    "Mtrs",
    552.5,
    10,
    5525,
    null,
    2.5,
    "Mtrs",
    200,
    200,
    2.5,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    1381.25,
    27625,
    2.5,
    2000,
    1381.25,
    2000,
    6000,
    4143.75
  ],
  [
    "Filters",
    10709248,
    "mdi AseptiCap Nano PES Membrane Capsule Filter (Type: LKN) - SIze: 30\"",
    "No's",
    104500,
    2,
    209000,
    null,
    2,
    "NOS",
    200,
    200,
    2,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    209000,
    4180000,
    2,
    2000,
    209000,
    2000,
    6000,
    627000
  ],
  [
    "Filters",
    10710326,
    "mdi AseptiCap Nano PES Membrane Capsule Filter (Type: LKN) - SIze: 20\"",
    "No's",
    87400,
    1,
    87400,
    25,
    1,
    "NOS",
    200,
    200,
    1,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    87400,
    1748000,
    1,
    2000,
    87400,
    2000,
    6000,
    262200
  ]
];

  allMaterials: BudgetMaterialItem[] = [];
  materialCategories: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.allMaterials = this.rawMaterials.map((r, i) => mapRowToMaterialItem(r, i));
  }

  ngOnInit(): void {
    if (this.initialTab) {
      this.activeCostTab = this.initialTab;
    }

    this.updateCategories();

    this.route.queryParams.subscribe(params => {
      const qProduct = params['projectName'] || params['name'] || params['productName'];
      const qCode = params['projectCode'] || params['code'];
      const qCat = params['category'];
      const qTab = params['tab'] as CostPhaseTab;
      if (qProduct) this.productName = qProduct;
      if (qCode) this.projectCode = qCode;
      if (qTab && ['total', 'dev', 'scaleup', 'pivotal'].includes(qTab)) {
        this.activeCostTab = qTab;
      }
      if (qCat && (this.materialCategories.includes(qCat) || qCat === 'ALL')) {
        this.activeCategory = qCat;
      }
    });

    if (this.selectedCostItem && this.selectedCostItem.category) {
      this.activeCategory = this.selectedCostItem.category;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialTab'] && this.initialTab) {
      this.activeCostTab = this.initialTab;
      this.pageIndex = 0;
    }

    if (changes['selectedCostItem'] && this.selectedCostItem) {
      if (this.selectedCostItem.category) {
        this.activeCategory = this.selectedCostItem.category;
      } else {
        this.activeCategory = 'ALL';
      }
      this.pageIndex = 0;
    }
  }

  selectCostPhase(phase: CostPhaseTab): void {
    this.activeCostTab = phase;
    this.pageIndex = 0;
  }

  setActiveCostTab(tab: CostPhaseTab): void {
    this.selectCostPhase(tab);
  }

  updateCategories(): void {
    this.materialCategories = Array.from(new Set(this.allMaterials.map(r => r.category))).filter(Boolean);
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  onBack(): void {
    if (this.back.observed) {
      this.back.emit();
    } else {
      this.router.navigate(['/projects/dashboard/budgeting'], {
        queryParams: { code: this.projectCode, name: this.productName },
        queryParamsHandling: 'merge'
      });
    }
  }

  onFilterChange(): void {
    this.pageIndex = 0;
  }

  clearFilters(): void {
    this.activeCategory = 'ALL';
    this.searchQuery = '';
    this.pageIndex = 0;
    this.showToast('Material filters cleared.');
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get filteredMaterials(): BudgetMaterialItem[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.allMaterials.filter(row => {
      const matchCat = this.activeCategory === 'ALL' || row.category === this.activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = [row.category, row.materialCode, row.description, row.purchaseUom, row.inputUom]
        .map(v => String(v ?? '')).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  get pagedMaterials(): BudgetMaterialItem[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredMaterials.slice(start, start + this.pageSize);
  }

  get isDirectCategoryMapped(): boolean {
    return !!(this.selectedCostItem && this.selectedCostItem.category);
  }

  // Summary Totals for Active Tab
  get totalPurchaseCostSum(): number {
    return this.filteredMaterials.reduce((acc, m) => acc + (m.totalPurchaseCost || 0), 0);
  }

  get devTotalCostSum(): number {
    return this.filteredMaterials.reduce((acc, m) => acc + (m.devTotalCost || 0), 0);
  }

  get scaleUpCostSum(): number {
    return this.filteredMaterials.reduce((acc, m) => acc + (m.scaleUpCost || 0), 0);
  }

  get pivotalCostSum(): number {
    return this.filteredMaterials.reduce((acc, m) => acc + (m.pivotalCost || 0), 0);
  }

  get grandTotalCostSum(): number {
    return this.filteredMaterials.reduce((acc, m) => acc + (m.totalCost || 0), 0);
  }

  formatCurrency(value: any): string {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (isNaN(num)) return '—';
    return '₹ ' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(num);
  }

  formatNumber(value: any, maxDec = 2): string {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: maxDec }).format(num);
  }

  openAddMaterialDialog(): void {
    const defaultCat = (this.activeCategory !== 'ALL' && this.activeCategory)
      ? this.activeCategory
      : (this.selectedCostItem?.category || 'Excepient');

    const dialogRef = this.dialog.open(AddBudgetingMaterialComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        defaultCategory: defaultCat
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'add' && result.row) {
        const newItem = mapRowToMaterialItem(result.row, this.allMaterials.length);
        this.allMaterials.unshift(newItem);
        this.updateCategories();
        this.pageIndex = 0;
        this.showToast(`Material "${newItem.description}" added successfully.`);
      }
    });
  }

  openEditMaterial(item: BudgetMaterialItem): void {
    const dialogRef = this.dialog.open(AddBudgetingMaterialComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        row: [...item.rawRow]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'update' && result.row) {
        const idx = this.allMaterials.findIndex(m => m.id === item.id || (m.materialCode === item.materialCode && m.description === item.description));
        if (idx !== -1) {
          const updatedItem = mapRowToMaterialItem(result.row, idx);
          this.allMaterials[idx] = updatedItem;
          this.updateCategories();
          this.showToast(`Material "${updatedItem.description}" updated successfully.`);
        }
      }
    });
  }

  deleteMaterial(item: BudgetMaterialItem): void {
    const desc = item.description || item.materialCode || 'this material';
    if (confirm(`Are you sure you want to delete material "${desc}"?`)) {
      this.allMaterials = this.allMaterials.filter(m => m.id !== item.id && !(m.materialCode === item.materialCode && m.description === item.description));
      this.updateCategories();
      if (this.pageIndex > 0 && this.pagedMaterials.length === 0) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
      this.showToast(`Material "${desc}" deleted.`);
    }
  }

  showToast(message: string): void {
    // Toaster messages disabled
  }

  toggleColumns(): void {
    // Action will be defined later
  }

  toggleFilter(): void {
    // Action will be defined later
  }
}
