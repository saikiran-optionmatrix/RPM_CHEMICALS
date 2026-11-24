import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GateActivityItem } from '../proj-gates-activities.component';

@Component({
  selector: 'app-add-gate-activity',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './add-gate-activity.component.html',
  styleUrl: './add-gate-activity.component.scss',
})
export class AddGateActivityComponent implements OnInit {
  isEditMode: boolean = false;
  activeStep: number = 1;

  departments: string[] = [
    'Chemical R&D / Process Technology',
    'Process Safety & EHS',
    'Pilot Plant & Scale-Up Engineering',
    'Analytical Science & QC',
    'Regulatory Affairs & Stewardship',
    'Project Engineering & Operations',
    'Commercial & Supply Chain'
  ];
  sections: string[] = [
    'Process Chemistry',
    'Reaction Engineering',
    'Process Safety (RC1/DSC)',
    'Pilot Plant Operations',
    'Analytical & Quality Control',
    'Regulatory & REACH/TSCA Compliance',
    'Costing & Capital Budgeting'
  ];
  priorities: string[] = ['High', 'Medium', 'Low'];
  responsibilities: string[] = [
    'Dr. Sarah Jenkins',
    'Michael Chang',
    'Dr. Priya Nair',
    'Alex Rivera',
    'Emily Watson',
    'David Miller'
  ];

  formData: Partial<GateActivityItem> = {
    activityName: '',
    activityCode: '',
    jobCode: 'ACT-101',
    department: 'Chemical R&D / Process Technology',
    section: 'Process Chemistry',
    responsibility: 'Dr. Sarah Jenkins',
    priority: 'High',
    status: true,
    done: false,
    tasks: '0/13',
    activitiesCount: '0/9',
    planStart: '',
    planEnd: '',
    actualStart: '',
    actualEnd: '',
    eta: '',
    planDuration: '',
    planEffort: '',
    actualDuration: '',
    actualEffort: '',
    buffer: '',
    slack: '',
    remarks: '',
    description: ''
  };

  constructor(
    @Optional() private readonly dialogRef?: MatDialogRef<AddGateActivityComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = this.data.mode === 'edit';
      if (this.data.departments?.length) this.departments = this.data.departments;
      if (this.data.priorities?.length) this.priorities = this.data.priorities;
      if (this.data.responsibilities?.length) this.responsibilities = this.data.responsibilities;
      if (this.data.activity) {
        this.formData = { ...this.data.activity };
      }
    }
  }

  close(): void {
    this.dialogRef?.close();
  }

  save(): void {
    if (!this.formData.activityName || !this.formData.activityName.trim()) {
      return;
    }
    this.dialogRef?.close(this.formData);
  }
}
