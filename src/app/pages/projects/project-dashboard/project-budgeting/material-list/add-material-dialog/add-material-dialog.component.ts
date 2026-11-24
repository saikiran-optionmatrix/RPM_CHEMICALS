import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MaterialItem } from '../../models/budgeting.models';

@Component({
  selector: 'app-add-material-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-material-dialog.component.html',
  styleUrls: ['./add-material-dialog.component.scss']
})
export class AddMaterialDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  categoryOptions: string[] = [
    'API',
    'Excipient',
    'Primary Packing',
    'Secondary Packing',
    'Tertiary Packing',
    'Consumables',
    'Filters'
  ];

  uomOptions: string[] = ['Kg', 'G', 'mg', 'L', 'mL', 'Nos', 'Vials', 'Packs', 'Bottles'];

  wbsDevOptions: string[] = ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.1.7'];
  wbsSuOptions: string[] = ['5.1.4', '5.1.5', '5.1.1', '5.1.2', '5.1.3'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode?: 'add' | 'edit'; item?: MaterialItem }
  ) {
    this.isEditMode = this.data?.mode === 'edit';

    this.form = this.fb.group({
      category: [this.data?.item?.cat || 'Excipient', [Validators.required]],
      code: [this.data?.item?.code ?? null, [Validators.required]],
      description: [this.data?.item?.d || '', [Validators.required]],
      uom: [this.data?.item?.uom || 'Kg', [Validators.required]],
      price: [this.data?.item?.price ?? null, [Validators.required, Validators.min(0)]],
      purchasedQty: [this.data?.item?.pq ?? null, [Validators.required, Validators.min(0)]],
      cyclesPlanned: [this.data?.item?.cyc ?? 20],
      inputQtyUom: [this.data?.item?.inu || 'Kg'],
      cf: [this.data?.item?.cf ?? 1],
      devBatchSize: [this.data?.item?.dbs ?? 10000],
      scaleUpBatchSize: [this.data?.item?.sbs ?? 50000],
      ebSize: [this.data?.item?.ebs ?? 100000],
      wdev: [this.data?.item?.wdev || '3.1.3', [Validators.required]],
      wsu: [this.data?.item?.wsu || '5.1.4', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data?.item) {
      const it = this.data.item;
      this.form.patchValue({
        category: it.cat,
        code: it.code,
        description: it.d,
        uom: it.uom,
        price: it.price,
        purchasedQty: it.pq,
        cyclesPlanned: it.cyc,
        inputQtyUom: it.inu,
        cf: it.cf,
        devBatchSize: it.dbs,
        scaleUpBatchSize: it.sbs,
        ebSize: it.ebs,
        wdev: it.wdev,
        wsu: it.wsu
      });
    }
  }

  get totalCost(): number {
    const p = Number(this.form.get('price')?.value) || 0;
    const q = Number(this.form.get('purchasedQty')?.value) || 0;
    return p * q;
  }

  save(): void {
    this.isSubmitting = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const price = Number(v.price) || 0;
    const pq = Number(v.purchasedQty) || 0;
    const cf = Number(v.cf) || 1;
    const dbs = Number(v.devBatchSize) || 1;
    const sbs = Number(v.scaleUpBatchSize) || 1;
    const ebs = Number(v.ebSize) || 1;

    // Derived or preserved input quantities
    const inq = this.data?.item?.inq ?? (pq > 0 && dbs > 0 ? Number((pq / dbs * cf).toFixed(4)) || 1 : 1);
    const inq2 = this.data?.item?.inq2 ?? inq;
    const inq3 = this.data?.item?.inq3 ?? inq;

    const result: MaterialItem = {
      cat: v.category,
      code: Number(v.code) || Date.now() % 10000,
      d: v.description,
      uom: v.uom,
      price: price,
      pq: pq,
      cyc: v.cyclesPlanned !== null && v.cyclesPlanned !== '' ? Number(v.cyclesPlanned) : null,
      inq: inq,
      inu: v.inputQtyUom || v.uom,
      cf: cf,
      dbs: dbs,
      inq2: inq2,
      inq3: inq3,
      sbs: sbs,
      ebs: ebs,
      flat: this.data?.item?.flat ?? 0,
      firstAlt: this.data?.item?.firstAlt ?? 0,
      wdev: v.wdev,
      wsu: v.wsu
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}

