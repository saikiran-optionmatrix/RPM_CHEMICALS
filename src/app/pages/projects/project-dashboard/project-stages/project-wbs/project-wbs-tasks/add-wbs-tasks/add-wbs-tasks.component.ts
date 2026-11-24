import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

export interface TaskAllocation {
  id: number;
  date: string;
  hours: number;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<TaskAllocation>;
}

@Component({
  selector: 'app-add-wbs-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './add-wbs-tasks.component.html',
  styleUrl: './add-wbs-tasks.component.scss',
})
export class AddWbsTasksComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'allocation', label: 'Allocation' }
  ];
  activeTab = 'overview';

  allocations: TaskAllocation[] = [];

  departments: string[] = [
    'Process Chemistry',
    'Analytical Development',
    'Process Safety & EHS',
    'Pilot Plant Operations',
    'Scale-up Engineering',
    'Quality Control',
    'Quality Assurance',
    'Regulatory Affairs (REACH/TSCA)',
    'Production & Operations',
    'Supply Chain & Sourcing',
    'Management'
  ];

  sections: string[] = [
    'Synthesis & Reaction Scouting',
    'Process Optimization',
    'Analytical Method Development',
    'Process Safety (RC1/DSC)',
    'Pilot Plant Campaign',
    'Scale-up & Demo Trials',
    'Regulatory Registration Filing',
    'Quality Control & QA',
    'Plant Engineering & EPC'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddWbsTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      active: [true],
      done: [false],
      taskName: ['', [Validators.required]],
      taskCode: [''],
      reference: [''],
      jobCode: [''],
      startDate: [new Date().toISOString().substring(0, 10)],
      dueDate: [new Date().toISOString().substring(0, 10)],
      completedDate: [''],
      approvedDate: [''],
      responsibility: [''],
      department: ['Management'],
      section: ['Formulation Development'],
      priority: ['Medium'],
      role: ['Scientist'],
      remarks: [''],
      planEffort: [16],
      actualEffort: [{ value: 0, disabled: false }],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      // 1. Initialize Allocations
      if (this.data.allocations && Array.isArray(this.data.allocations) && this.data.allocations.length > 0) {
        this.allocations = this.data.allocations.map((a: any, i: number) => ({
          id: a.id || Date.now() + i,
          date: a.date || new Date().toISOString().substring(0, 10),
          hours: Number(a.hours) || 0,
          isEditing: false
        }));
      } else if (this.isEditMode) {
        const existingEffort = this.parseNumericHours(this.data.actualEffort ?? this.data.worked ?? (this.data.done ? 16 : 0));
        if (existingEffort > 0) {
          const firstChunk = Math.min(8, existingEffort);
          const remainder = existingEffort - firstChunk;
          this.allocations = [
            {
              id: Date.now(),
              date: this.data.startDate || new Date().toISOString().substring(0, 10),
              hours: firstChunk,
              isEditing: false
            }
          ];
          if (remainder > 0) {
            this.allocations.push({
              id: Date.now() + 1,
              date: this.data.dueDate || new Date().toISOString().substring(0, 10),
              hours: remainder,
              isEditing: false
            });
          }
        }
      }

      // Calculate initial actual effort
      const initialActual = this.allocations.length > 0
        ? this.totalAllocatedHours
        : this.parseNumericHours(this.data.actualEffort ?? this.data.worked ?? 0);

      const initialPlan = this.parseNumericHours(this.data.planEffort ?? this.data.effort ?? 16);

      this.myGroup.patchValue({
        active: this.data.active ?? true,
        done: this.data.done ?? false,
        taskName: this.data.taskName ?? '',
        taskCode: this.data.taskCode ?? '',
        reference: this.data.reference ?? '',
        jobCode: this.data.jobCode ?? '',
        startDate: this.data.startDate ?? new Date().toISOString().substring(0, 10),
        dueDate: this.data.dueDate ?? new Date().toISOString().substring(0, 10),
        completedDate: this.data.completedDate ?? '',
        approvedDate: this.data.approvedDate ?? '',
        responsibility: this.data.responsibility ?? '',
        department: this.data.department ?? 'Management',
        section: this.data.section ?? 'Formulation Development',
        priority: this.data.priority ?? 'Medium',
        role: this.data.role ?? 'Scientist',
        remarks: this.data.remarks ?? '',
        planEffort: initialPlan,
        actualEffort: initialActual,
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  prevTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex > 0) {
      this.activeTab = this.tabs[currentIndex - 1].id;
    }
  }

  nextTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex < this.tabs.length - 1) {
      this.activeTab = this.tabs[currentIndex + 1].id;
    }
  }

  get totalAllocatedHours(): number {
    return this.allocations.reduce((sum, a) => sum + (Number(a.hours) || 0), 0);
  }

  updateActualEffortFromAllocations(): void {
    const total = this.totalAllocatedHours;
    this.myGroup.patchValue({ actualEffort: total });
  }

  addAllocationRow(): void {
    const today = new Date().toISOString().substring(0, 10);
    const newRow: TaskAllocation = {
      id: Date.now(),
      date: today,
      hours: 4
    };
    this.allocations.push(newRow);
    this.updateActualEffortFromAllocations();
  }

  startEditAllocation(row: TaskAllocation): void {
    row._backup = { date: row.date, hours: row.hours };
    row.isEditing = true;
  }

  saveAllocationRow(row: TaskAllocation): void {
    row.isEditing = false;
    row.isNew = false;
    delete row._backup;
    this.updateActualEffortFromAllocations();
  }

  cancelAllocationEdit(row: TaskAllocation, index: number): void {
    if (row.isNew) {
      this.allocations.splice(index, 1);
    } else if (row._backup) {
      row.date = row._backup.date || row.date;
      row.hours = row._backup.hours !== undefined ? row._backup.hours : row.hours;
      row.isEditing = false;
      delete row._backup;
    } else {
      row.isEditing = false;
    }
    this.updateActualEffortFromAllocations();
  }

  deleteAllocationRow(index: number): void {
    this.allocations.splice(index, 1);
    this.updateActualEffortFromAllocations();
  }

  private parseNumericHours(val: any): number {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  upsertTask(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      this.activeTab = 'overview';
      return;
    }

    // Finalize any row that is currently editing
    for (const alloc of this.allocations) {
      if (alloc.isEditing) {
        alloc.isEditing = false;
        delete alloc._backup;
      }
    }
    this.updateActualEffortFromAllocations();

    const result = {
      ...this.data,
      ...this.myGroup.value,
      allocations: this.allocations,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
