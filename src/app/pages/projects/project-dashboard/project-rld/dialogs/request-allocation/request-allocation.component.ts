import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ComputedLot, ComputedRequirement } from '../../models/rld.models';
import { RldService } from '../../services/rld.service';

export interface RequestAllocationData {
  requirements: ComputedRequirement[];
  lots: ComputedLot[];
  preSelectedReqId?: string;
}

@Component({
  selector: 'app-request-allocation',
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
  templateUrl: './request-allocation.component.html',
  styleUrls: ['./request-allocation.component.scss']
})
export class RequestAllocationComponent implements OnInit {
  form!: FormGroup;
  requirements: ComputedRequirement[] = [];
  allLots: ComputedLot[] = [];
  filteredLots: ComputedLot[] = [];

  selectedReq: ComputedRequirement | null = null;
  selectedLot: ComputedLot | null = null;

  requesters = [
    'Anjali Deshmukh (ARD)',
    'Suresh Patil (ARD Lead)',
    'Priya Sawant (FR&D)',
    'Rahul Gaikwad (FR&D Lead)',
    'Nikhil Rane (Stability Lead)',
    'Dr. Neha Sharma (Clinical Lead)'
  ];

  constructor(
    private fb: FormBuilder,
    public rldService: RldService,
    private dialogRef: MatDialogRef<RequestAllocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestAllocationData
  ) {}

  ngOnInit(): void {
    this.requirements = this.data.requirements;
    this.allLots = this.data.lots;

    const initialReq = this.requirements.find((r) => r.id === this.data.preSelectedReqId) || this.requirements[0];

    this.form = this.fb.group({
      reqId: [initialReq?.id || '', Validators.required],
      lotId: ['', Validators.required],
      quantity: [initialReq?.short || 1, [Validators.required, Validators.min(1)]],
      requestedBy: [this.requesters[0], Validators.required]
    });

    this.form.get('reqId')?.valueChanges.subscribe((reqId) => {
      this.onRequirementChange(reqId);
    });

    this.form.get('lotId')?.valueChanges.subscribe((lotId) => {
      this.selectedLot = this.filteredLots.find((l) => l.id === lotId) || null;
    });

    if (initialReq) {
      this.onRequirementChange(initialReq.id);
    }
  }

  onRequirementChange(reqId: string): void {
    this.selectedReq = this.requirements.find((r) => r.id === reqId) || null;
    if (this.selectedReq) {
      this.filteredLots = this.allLots.filter((l) => l.pool === this.selectedReq!.pool);
      const firstLot = this.filteredLots[0];
      this.form.patchValue({
        lotId: firstLot?.id || '',
        quantity: this.selectedReq.short || 1
      });
      this.selectedLot = firstLot || null;
    } else {
      this.filteredLots = [];
      this.selectedLot = null;
    }
  }

  reserve(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    const reqByName = val.requestedBy.replace(/ \(.*\)$/, '');
    this.dialogRef.close({
      reqId: val.reqId,
      lotId: val.lotId,
      quantity: val.quantity,
      requestedBy: reqByName
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

