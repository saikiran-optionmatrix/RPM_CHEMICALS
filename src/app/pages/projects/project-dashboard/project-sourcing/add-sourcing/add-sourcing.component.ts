import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-sourcing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './add-sourcing.component.html',
  styleUrl: './add-sourcing.component.scss',
})
export class AddSourcingComponent implements OnInit {
  sourcingForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  categoryOptions: string[] = [
    'Raw Materials',
    'Raw Material',
    'Excipient',
    'Primary Packaging',
    'Solvent',
    'Laboratory',
    'Manufacturing',
    'Packaging',
    'Quality',
    'Consumables',
    'Others'
  ];

  itemNamesByCategory: { [key: string]: string[] } = {
    'Raw Materials': ['Active Pharmaceutical Ingredient (API)', 'Pharmaceutical Excipients'],
    'Raw Material': ['Acrylic Emulsion Binder 50% Solids (API)', 'Liposomal Gadobutrol Base', 'Olaparib API Micronized'],
    'Excipient': ['Microcrystalline Cellulose PH-102', 'Magnesium Stearate NF', 'Lactose Monohydrate SuperTab 11SD', 'Povidone (PVP K-30)', 'Croscarmellose Sodium'],
    'Primary Packaging': ['HDPE Container Bottles 120ml', 'Alu-Alu Cold Form Foil 25µ'],
    'Solvent': ['Isopropyl Alcohol (IPA) USP', 'Dichloromethane (DCM) Pure'],
    'Laboratory': ['Analytical Standards'],
    'Manufacturing': ['Granulation Materials'],
    'Packaging': ['Tablet Packaging Materials'],
    'Quality': ['Stability Samples'],
    'Consumables': ['0.22 Micron PES Filter Membranes'],
    'Others': ['Chromatography Reference Standards']
  };

  itemTypes: string[] = [
    'Active (API)',
    'API / Intermediate',
    'Excipient',
    'Binder & Filler',
    'Binder',
    'Disintegrant',
    'Lubricant',
    'Diluent',
    'Bottle Container',
    'Blister Foil',
    'Process Solvent',
    'Extraction Solvent',
    'Analytical Reagent',
    'Granulation Aid',
    'Primary Packaging',
    'Quality Testing Sample',
    'Filter Membrane',
    'Reference Standard',
    'Others'
  ];

  unitOptions: string[] = [
    'Grams',
    'Kg',
    'Liters',
    'Units',
    'Pcs',
    'Rolls',
    'Vials',
    'Boxes',
    'Packs'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSourcingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    this.sourcingForm = this.fb.group({
      itemCode: ['', Validators.required],
      itemCategory: ['', Validators.required],
      itemName: ['', Validators.required],
      itemType: ['', Validators.required],
      devQuantity: [null, [Validators.required, Validators.min(0)]],
      specs: ['', Validators.required],
      projectedEbQuantity: [null, [Validators.required, Validators.min(0)]],
      purchasedQuantity: [0],
      stockAvailable: [null, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      unitRate: [null, [Validators.required, Validators.min(0)]],
      usage: [0, [Validators.min(0)]],
      dmf: ['View / Update'],
      vendorQualification: ['View / Update']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data && this.data.item) {
      const item = this.data.item;
      this.sourcingForm.patchValue({
        itemCode: item.itemCode || '',
        itemCategory: item.itemCategory || '',
        itemName: item.itemName || '',
        itemType: item.itemType || '',
        devQuantity: item.devQuantity ?? null,
        specs: item.specs || '',
        projectedEbQuantity: item.projectedEbQuantity ?? null,
        purchasedQuantity: item.purchasedQuantity ?? null,
        stockAvailable: item.stockAvailable ?? null,
        unit: item.unit || '',
        unitRate: item.unitRate ?? null,
        usage: item.usage ?? 0,
        dmf: item.dmf || 'View / Update',
        vendorQualification: item.vendorQualification || 'View / Update'
      });
    } else {
      // Default generated item code (8-digit numeric)
      const randNum = Math.floor(1000 + Math.random() * 9000);
      this.sourcingForm.patchValue({
        itemCode: `1010${randNum}`,
        itemCategory: 'Raw Material',
        itemType: 'Active (API)',
        unit: 'Grams',
        dmf: 'View / Update',
        vendorQualification: 'View / Update'
      });
    }
  }

  get f() {
    return this.sourcingForm.controls;
  }

  get availableItemNames(): string[] {
    const selectedCategory = this.sourcingForm.get('itemCategory')?.value;
    if (selectedCategory && this.itemNamesByCategory[selectedCategory]) {
      return this.itemNamesByCategory[selectedCategory];
    }
    return [
      'Active Pharmaceutical Ingredient (API)',
      'Acrylic Emulsion Binder 50% Solids (API)',
      'Microcrystalline Cellulose PH-102',
      'HDPE Container Bottles 120ml',
      'Alu-Alu Cold Form Foil 25µ',
      '0.22 Micron PES Filter Membranes'
    ];
  }

  onCategoryChange(cat: string): void {
    const names = this.itemNamesByCategory[cat];
    if (names && names.length > 0) {
      this.sourcingForm.patchValue({ itemName: names[0] });
    } else {
      this.sourcingForm.patchValue({ itemName: '' });
    }
  }

  save(): void {
    this.isSubmitting = true;
    if (this.sourcingForm.invalid) {
      this.sourcingForm.markAllAsTouched();
      return;
    }

    const formVal = this.sourcingForm.getRawValue();
    this.dialogRef.close({
      ...formVal,
      devQuantity: Number(formVal.devQuantity) || 0,
      projectedEbQuantity: Number(formVal.projectedEbQuantity) || 0,
      purchasedQuantity: Number(formVal.purchasedQuantity) || 0,
      stockAvailable: Number(formVal.stockAvailable) || 0,
      unitRate: Number(formVal.unitRate) || 0,
      usage: Number(formVal.usage) || 0,
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
