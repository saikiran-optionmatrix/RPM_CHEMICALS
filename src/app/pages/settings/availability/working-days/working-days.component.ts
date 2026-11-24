import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface WorkingDayItem {
  name: string;
  isWorking: boolean;
}

@Component({
  selector: 'app-working-days',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './working-days.component.html',
  styleUrl: './working-days.component.scss',
})
export class WorkingDaysComponent {
  workingDays: WorkingDayItem[] = [
    { name: 'Monday', isWorking: true },
    { name: 'Tuesday', isWorking: true },
    { name: 'Wednesday', isWorking: true },
    { name: 'Thursday', isWorking: true },
    { name: 'Friday', isWorking: true },
    { name: 'Saturday', isWorking: false },
    { name: 'Sunday', isWorking: false },
  ];

  saveSuccessMessage = '';

  onSave(): void {
    this.saveSuccessMessage = 'Working days updated successfully!';
    setTimeout(() => {
      this.saveSuccessMessage = '';
    }, 3000);
  }
}
