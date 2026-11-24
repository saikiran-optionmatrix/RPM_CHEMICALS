import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface MaterialTab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-add-budgeting-material',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './add-budgeting-material.component.html',
  styleUrl: './add-budgeting-material.component.scss'
})
export class AddBudgetingMaterialComponent implements OnInit {
  materialForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  tabs: MaterialTab[] = [
    { id: 'overview', label: 'Material Master' },
    { id: 'cycles', label: 'Cycle & Input' },
    { id: 'trials', label: 'Trial Costing' },
    { id: 'scaleup', label: 'Scale-Up & EB' }
  ];

  activeTab = 'overview';

  categoryOptions: string[] = [
    'API',
    'Excepient',
    'Primary packing',
    'Secondary Packing',
    'Tertiary Packing',
    'Consumables',
    'Filters'
  ];

  uomOptions: string[] = ['Kg', 'Ltr', 'No.', 'Mtrs', "No's", 'Gms', 'mg', 'ml', 'NOS'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddBudgetingMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.materialForm = this.fb.group({
      // Tab 1: Material Master
      category: ['Excepient', [Validators.required]],
      mtlCode: ['', [Validators.required]],
      description: ['', [Validators.required]],
      uom: ['Kg', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      purchasedQty: [0, [Validators.required, Validators.min(0)]],
      totalCost: [0],

      // Tab 2: Cycle & Input Specs
      cyclesPlanned: [20, [Validators.min(0)]],
      inputQtyPerCycle: [0],
      inputQtyUom: ['mg'],
      cf: [1000000],
      devBatchSize: [200],
      devInputQtyPerCycle: [0],

      // Tab 3: Trial Costing
      costPerTrial: [0],
      totalDevCost: [0],

      // Tab 4: Scale-Up & EB
      scaleUpInputQty: [0],
      scaleUpBatchSize: [2000],
      scaleUpBatchCost: [0],
      ebSize: [2000],
      ebInputQty: [6000],
      ebBatchesCost: [0]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.row) {
      this.isEditMode = true;
      const r = this.data.row;
      this.materialForm.patchValue({
        category: r[0] || 'Excepient',
        mtlCode: r[1] ?? '',
        description: r[2] ?? '',
        uom: r[3] || 'Kg',
        price: r[4] ?? 0,
        purchasedQty: r[5] ?? 0,
        totalCost: r[6] ?? 0,
        cyclesPlanned: r[7] ?? 20,
        inputQtyPerCycle: r[8] ?? 0,
        inputQtyUom: r[9] || 'mg',
        cf: r[10] ?? 1000000,
        devBatchSize: r[11] ?? 200,
        devInputQtyPerCycle: r[12] ?? 0,
        costPerTrial: r[13] ?? 0,
        totalDevCost: r[33] ?? 0,
        scaleUpInputQty: r[34] ?? 0,
        scaleUpBatchSize: r[35] ?? 2000,
        scaleUpBatchCost: r[36] ?? 0,
        ebSize: r[37] ?? 2000,
        ebInputQty: r[38] ?? 6000,
        ebBatchesCost: r[39] ?? 0
      });
    } else if (this.data && this.data.defaultCategory) {
      this.materialForm.patchValue({
        category: this.data.defaultCategory
      });
    }

    // Auto-compute totalCost when price or purchasedQty changes
    this.materialForm.get('price')?.valueChanges.subscribe(() => this.recalcTotalCost());
    this.materialForm.get('purchasedQty')?.valueChanges.subscribe(() => this.recalcTotalCost());

    // Auto-compute totalDevCost when costPerTrial or cyclesPlanned changes
    this.materialForm.get('costPerTrial')?.valueChanges.subscribe(() => this.recalcDevCost());
    this.materialForm.get('cyclesPlanned')?.valueChanges.subscribe(() => this.recalcDevCost());
  }

  get f() {
    return this.materialForm.controls;
  }

  private recalcTotalCost(): void {
    const price = Number(this.materialForm.get('price')?.value) || 0;
    const qty = Number(this.materialForm.get('purchasedQty')?.value) || 0;
    const total = Math.round(price * qty * 100) / 100;
    this.materialForm.patchValue({ totalCost: total }, { emitEvent: false });
  }

  private recalcDevCost(): void {
    const costPerTrial = Number(this.materialForm.get('costPerTrial')?.value) || 0;
    const cycles = Number(this.materialForm.get('cyclesPlanned')?.value) || 20;
    const total = Math.round(costPerTrial * cycles * 100) / 100;
    this.materialForm.patchValue({ totalDevCost: total }, { emitEvent: false });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  prevTab(): void {
    const idx = this.tabs.findIndex((t) => t.id === this.activeTab);
    if (idx > 0) {
      this.activeTab = this.tabs[idx - 1].id;
    }
  }

  nextTab(): void {
    const idx = this.tabs.findIndex((t) => t.id === this.activeTab);
    if (idx < this.tabs.length - 1) {
      this.activeTab = this.tabs[idx + 1].id;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.isSubmitting = true;
    if (this.materialForm.invalid) {
      this.materialForm.markAllAsTouched();
      // If error is in basic tab, switch to it
      if (this.f['category'].invalid || this.f['mtlCode'].invalid || this.f['description'].invalid || this.f['uom'].invalid) {
        this.activeTab = 'overview';
      }
      return;
    }

    const val = this.materialForm.value;
    const costPerTrial = Number(val.costPerTrial) || 0;

    // Preserving existing trial variations if editing, else populate 20 trials with costPerTrial
    let trials: any[] = [];
    if (this.isEditMode && this.data?.row && Array.isArray(this.data.row)) {
      const origTrials = this.data.row.slice(13, 33);
      if (origTrials.length === 20 && origTrials[0] === costPerTrial) {
        trials = origTrials;
      } else {
        trials = Array(20).fill(costPerTrial);
      }
    } else {
      trials = Array(20).fill(costPerTrial);
    }

    const row: any[] = [
      val.category,
      Number(val.mtlCode) || val.mtlCode,
      val.description,
      val.uom,
      Number(val.price) || 0,
      Number(val.purchasedQty) || 0,
      Number(val.totalCost) || 0,
      Number(val.cyclesPlanned) || 20,
      Number(val.inputQtyPerCycle) || 0,
      val.inputQtyUom || '',
      Number(val.cf) || 1,
      Number(val.devBatchSize) || 200,
      Number(val.devInputQtyPerCycle) || Number(val.inputQtyPerCycle) || 0,
      ...trials, // Exactly 20 trials (indices 13 to 32)
      Number(val.totalDevCost) || (costPerTrial * 20), // Index 33
      Number(val.scaleUpInputQty) || 0, // Index 34
      Number(val.scaleUpBatchSize) || 2000, // Index 35
      Number(val.scaleUpBatchCost) || 0, // Index 36
      Number(val.ebSize) || 2000, // Index 37
      Number(val.ebInputQty) || 6000, // Index 38
      Number(val.ebBatchesCost) || 0 // Index 39
    ];

    this.dialogRef.close({
      action: this.isEditMode ? 'update' : 'add',
      row,
      originalRow: this.data?.row
    });
  }
}
