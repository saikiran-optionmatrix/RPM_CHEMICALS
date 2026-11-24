import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

export interface SourcingUsageDialogData {
  mode: 'add' | 'edit';
  item?: any;
}

@Component({
  selector: 'app-add-sourcing-usage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './add-sourcing-usage.component.html',
  styleUrl: './add-sourcing-usage.component.scss',
})
export class AddSourcingUsageComponent implements OnInit {
  usageForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  // Dropdown options
  stageOptions: string[] = [
    'Product Selection',
    'Pre-Formulation',
    'Formulation Development',
    'Analytical Development',
    'Stability',
    'Pilot Batch',
    'Scale-Up',
    'Regulatory Filing'
  ];

  deliverableOptions: string[] = [
    'API Characterization',
    'Compatibility Study',
    'Prototype Formulation',
    'Dissolution Method Development',
    'Accelerated Stability Study',
    'Pilot-Scale Manufacturing',
    'Dossier Module 3'
  ];

  activityOptions: string[] = [
    'Preformulation Testing',
    'Granulation & Blending Trial',
    'Stability Chamber Loading',
    'Assay & Related Substances',
    'Dissolution Method Transfer',
    'Packaging Qualification'
  ];

  taskOptions: string[] = [
    'Sample Extraction & Analysis',
    'Wet Granulation Batch Preparation',
    'Stress Testing at 40°C/75% RH',
    'Formulation Optimization Trial',
    'Impurity Profile Testing',
    'Batch Release & CoA Generation'
  ];

  issuedToOptions: string[] = [
    'Rajesh Kumar',
    'Priya Sharma',
    'Vikram Singh',
    'Dr. Arun Mehta',
    'Sneha Patel',
    'Ananya Roy',
    'Mohit Verma'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSourcingUsageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SourcingUsageDialogData
  ) {
    this.usageForm = this.fb.group({
      stageName: ['', Validators.required],
      deliverable: ['', Validators.required],
      activity: ['', Validators.required],
      task: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      issuedTo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data?.item) {
      this.usageForm.patchValue({
        stageName: this.data.item.stageName ?? '',
        deliverable: this.data.item.deliverable ?? '',
        activity: this.data.item.activity ?? '',
        task: this.data.item.task ?? '',
        quantity: this.data.item.quantity ?? null,
        issuedTo: this.data.item.issuedTo ?? ''
      });
    }
  }

  get f() {
    return this.usageForm.controls;
  }

  save(): void {
    this.isSubmitting = true;
    if (this.usageForm.invalid) {
      this.usageForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.usageForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
