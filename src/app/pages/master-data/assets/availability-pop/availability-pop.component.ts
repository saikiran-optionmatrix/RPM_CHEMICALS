import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface WeekdayAvailability {
  day: string;
  selected: boolean;
}

@Component({
  selector: 'app-availability-pop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './availability-pop.component.html',
  styleUrl: './availability-pop.component.scss',
})
export class AvailabilityPopComponent implements OnInit {
  weekdays: WeekdayAvailability[] = [
    { day: 'Sunday', selected: false },
    { day: 'Monday', selected: true },
    { day: 'Tuesday', selected: true },
    { day: 'Wednesday', selected: true },
    { day: 'Thursday', selected: true },
    { day: 'Friday', selected: true },
    { day: 'Saturday', selected: false },
  ];

  fromTime = '09:00 AM';
  toTime = '05:00 PM';

  constructor(
    private dialogRef: MatDialogRef<AvailabilityPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      if (this.data.fromTime) {
        this.fromTime = this.data.fromTime;
      }
      if (this.data.toTime) {
        this.toTime = this.data.toTime;
      }

      if (Array.isArray(this.data.availableDays) && this.data.availableDays.length > 0) {
        const set = new Set(this.data.availableDays);
        this.weekdays.forEach((w) => {
          w.selected = set.has(w.day);
        });
      } else if (typeof this.data.availability === 'number') {
        const count = Math.min(Math.max(this.data.availability, 0), 7);
        const priorityOrder = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const activeDays = new Set(priorityOrder.slice(0, count));
        this.weekdays.forEach((w) => {
          w.selected = activeDays.has(w.day);
        });
      }
    }
  }

  get selectedCount(): number {
    return this.weekdays.filter((d) => d.selected).length;
  }

  save(): void {
    const selectedDays = this.weekdays.filter((d) => d.selected).map((d) => d.day);
    this.dialogRef.close({
      availability: selectedDays.length,
      availableDays: selectedDays,
      fromTime: this.fromTime,
      toTime: this.toTime,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
