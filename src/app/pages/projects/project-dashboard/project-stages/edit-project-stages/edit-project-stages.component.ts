import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-edit-project-stages',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './edit-project-stages.component.html',
  styleUrl: './edit-project-stages.component.scss',
})
export class EditProjectStagesComponent implements OnInit {
  activeTab: 'overview' | 'timeline' = 'overview';

  tabs = [
    { id: 'overview' as const, label: 'Over view' },
    { id: 'timeline' as const, label: 'Timeline' }
  ];

  stageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProjectStagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stageForm = this.fb.group({
      // Overview tab fields
      name: [''],
      stageCode: [''],
      gateCode: [''],
      description: [''],

      // Timeline tab fields
      planStart: [''],
      actualStart: [''],
      planEnd: [''],
      actualEnd: [''],
      eta: [''],
      buffer: [''],
      planEffort: [''],
      actualEffort: [''],
      planDuration: [''],
      actualDuration: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.stageForm.patchValue({
        name: this.data.name ?? '',
        stageCode: this.data.stageCode ?? '',
        gateCode: this.data.gateCode ?? '',
        description: this.data.description ?? '',

        planStart: this.formatDateForInput(this.data.planStart),
        actualStart: this.formatDateForInput(this.data.actualStart),
        planEnd: this.formatDateForInput(this.data.planEnd),
        actualEnd: this.formatDateForInput(this.data.actualEnd),
        eta: this.formatDateForInput(this.data.eta),
        buffer: this.data.buffer ?? '',
        planEffort: this.data.planEffort ?? '',
        actualEffort: this.data.actualEffort ?? '',
        planDuration: this.data.planDuration ?? '',
        actualDuration: this.data.actualDuration ?? ''
      });
    }
  }

  setActiveTab(tabId: 'overview' | 'timeline'): void {
    this.activeTab = tabId;
  }

  prevTab(): void {
    if (this.activeTab === 'timeline') {
      this.activeTab = 'overview';
    }
  }

  nextTab(): void {
    if (this.activeTab === 'overview') {
      this.activeTab = 'timeline';
    }
  }

  save(): void {
    const val = this.stageForm.getRawValue();
    const result = {
      ...this.data,
      ...val
    };
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }

  private formatDateForInput(dateVal: any): string {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) return dateVal;
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      return dateVal;
    }
    if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
      return dateVal.toISOString().split('T')[0];
    }
    return '';
  }
}
