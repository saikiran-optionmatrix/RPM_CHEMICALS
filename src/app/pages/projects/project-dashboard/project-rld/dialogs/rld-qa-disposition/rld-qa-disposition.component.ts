import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComputedLot } from '../../models/rld.models';
import { RldService } from '../../services/rld.service';

export interface RldQaDispositionData {
  lot: ComputedLot;
}

@Component({
  selector: 'app-rld-qa-disposition',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './rld-qa-disposition.component.html',
  styleUrls: ['./rld-qa-disposition.component.scss']
})
export class RldQaDispositionComponent implements OnInit {
  form!: FormGroup;
  lot!: ComputedLot;

  checkOptions = ['Y', 'N', 'Pending'];
  dispositionOptions = ['Accepted', 'Quarantine', 'Rejected'];
  qaOfficers = ['Dr. Kavita Joshi', 'Sameer Kulkarni', 'Dr. Ajay Kale'];

  constructor(
    private fb: FormBuilder,
    public rldService: RldService,
    private dialogRef: MatDialogRef<RldQaDispositionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RldQaDispositionData
  ) {}

  ngOnInit(): void {
    this.lot = this.data.lot;

    this.form = this.fb.group({
      ck0: [this.lot.ck[0] || 'Y', Validators.required],
      ck1: [this.lot.ck[1] || 'Y', Validators.required],
      ck2: [this.lot.ck[2] || 'Y', Validators.required],
      ck3: [this.lot.ck[3] || 'Y', Validators.required],
      qa: [this.lot.qa || 'Accepted', Validators.required],
      qaBy: [this.lot.qaBy || this.qaOfficers[0], Validators.required],
      qaRef: [this.lot.qaRef || 'QA-RLD-REL-0335', Validators.required]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    const checks = [val.ck0, val.ck1, val.ck2, val.ck3];
    this.dialogRef.close({
      checks,
      disposition: val.qa,
      qaBy: val.qaBy,
      qaRef: val.qaRef
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

