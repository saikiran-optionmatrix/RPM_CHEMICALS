import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { OutsourcingItem } from '../outsourcing.data';

@Component({
  selector: 'app-add-outsourcing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './add-outsourcing.component.html',
  styleUrl: './add-outsourcing.component.scss'
})
export class AddOutsourcingComponent implements OnInit {
  outForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddOutsourcingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; item?: OutsourcingItem }
  ) {
    this.outForm = this.fb.group({
      date: [this.getTodayFormatted(), Validators.required],
      productName: ['', Validators.required],
      requiredTest: ['', Validators.required],
      instrumentName: ['', Validators.required],
      sampleDetails: [''],
      reasonForRequirement: [''],
      initiatedBy: ['', Validators.required],
      approvedBy: ['', Validators.required],
      duration: ['3 Days'],
      reportReceivedOn: ['Pending'],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.mode === 'edit' && this.data.item) {
      this.isEditMode = true;
      this.outForm.patchValue({
        date: this.data.item.date,
        productName: this.data.item.productName,
        requiredTest: this.data.item.requiredTest,
        instrumentName: this.data.item.instrumentName,
        sampleDetails: this.data.item.sampleDetails,
        reasonForRequirement: this.data.item.reasonForRequirement,
        initiatedBy: this.data.item.initiatedBy,
        approvedBy: this.data.item.approvedBy,
        duration: this.data.item.duration,
        reportReceivedOn: this.data.item.reportReceivedOn,
        remarks: this.data.item.remarks
      });
    }
  }

  get f() {
    return this.outForm.controls;
  }

  getTodayFormatted(): string {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  save(): void {
    this.isSubmitting = true;
    if (this.outForm.invalid) {
      return;
    }

    const val = this.outForm.value;
    this.dialogRef.close(val);
  }

  close(): void {
    this.dialogRef.close();
  }
}
