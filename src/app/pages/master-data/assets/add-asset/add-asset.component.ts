import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-asset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.scss',
})
export class AddAssetComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  weekdayOptions: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      AssetName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      AssetCode: ['', [Validators.required]],
      AssetCategory: [''],
      availability: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], [Validators.required]],
      fromTime: ['09:00', [Validators.required]],
      toTime: ['17:00', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      let initialAvailability: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      if (Array.isArray(this.data.availableDays) && this.data.availableDays.length > 0) {
        initialAvailability = this.data.availableDays;
      } else if (Array.isArray(this.data.availability) && this.data.availability.length > 0) {
        initialAvailability = this.data.availability;
      } else if (typeof this.data.availability === 'number') {
        const count = Math.min(Math.max(this.data.availability, 0), 7);
        const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        initialAvailability = order.slice(0, count);
      }

      this.myGroup.patchValue({
        AssetName: this.data.AssetName ?? '',
        AssetCode: this.data.AssetCode ?? '',
        AssetCategory: this.data.AssetCategory ?? '',
        availability: initialAvailability,
        fromTime: this.formatTimeForInput(this.data.fromTime) || '09:00',
        toTime: this.formatTimeForInput(this.data.toTime) || '17:00',
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  private formatTimeForInput(timeStr?: string): string {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const mins = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${mins}`;
    }
    return timeStr;
  }

  private formatTimeForDisplay(timeStr?: string): string {
    if (!timeStr) return '';
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      let hours = parseInt(match[1], 10);
      const mins = match[2];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      return `${hours.toString().padStart(2, '0')}:${mins} ${ampm}`;
    }
    return timeStr;
  }

  upsertAsset(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    const formVal = this.myGroup.value;
    const selectedDays: string[] = formVal.availability || [];
    const fromTimeDisplay = this.formatTimeForDisplay(formVal.fromTime) || formVal.fromTime || '09:00 AM';
    const toTimeDisplay = this.formatTimeForDisplay(formVal.toTime) || formVal.toTime || '05:00 PM';

    const result = {
      ...this.data,
      ...formVal,
      availability: selectedDays.length,
      availableDays: selectedDays,
      fromTime: fromTimeDisplay,
      toTime: toTimeDisplay,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
