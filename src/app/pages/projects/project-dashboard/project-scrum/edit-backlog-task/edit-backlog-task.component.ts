import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-backlog-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-backlog-task.component.html',
  styleUrls: ['./edit-backlog-task.component.scss']
})
export class EditBacklogTaskComponent implements OnInit {

  isEditMode = false;
  isSprint = false;
  task = '';
  taskCode = '';
  jobCode = '';
  planStart = '';
  planFinish = '';
  effort = 0;
  duration = 0;
  stage = 'Route Scouting & Lab Synthesis';
  assigned = '';
  description = '';
  eta = '';
  actualStart = '';
  actualFinish = '';
  expenses = 0;
  status = 'allocated';
  approved = false;
  progress = 0;

  stages = [
    'Opportunity Identification',
    'Concept Screening & Feasibility',
    'Route Scouting & Lab Synthesis',
    'Process Optimization (Lab Scale)',
    'Process Route Selection & Basis of Design',
    'Bench-to-Pilot Process Development',
    'Process Safety & Regulatory Studies',
    'Regulatory Registration Filing (REACH / TSCA)',
    'Pilot Plant Campaign',
    'Demonstration-Scale Campaign',
    'Commercial Plant Build & Commissioning',
    'Commercial Launch & Ramp-Up'
  ];
  team = ['Aarav Shah', 'Priya Nair', 'Diego Ruiz', 'Mei Tanaka', 'Olivia Brown'];

  readonly statusOptions = [
    { value: 'allocated', label: 'Pending' },
    { value: 'inprocess', label: 'In Process' },
    { value: 'completed', label: 'Completed' },
    { value: 'onhold', label: 'On Hold' }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditBacklogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      const taskData = this.data.task ? this.data.task : this.data;
      this.isSprint = !!this.data.isSprint;
      this.task = taskData.task || '';
      this.taskCode = taskData.taskCode || '';
      this.jobCode = taskData.jobCode || '';
      this.planStart = taskData.planStart || '';
      this.planFinish = taskData.planFinish || '';
      this.effort = taskData.effort || 0;
      this.duration = taskData.duration || 0;
      this.stage = taskData.stage || 'Formulation';
      this.assigned = taskData.assigned || '';
      this.description = taskData.description || '';
      this.eta = taskData.eta || '';
      this.actualStart = taskData.actualStart || '';
      this.actualFinish = taskData.actualFinish || '';
      this.expenses = taskData.expenses || 0;
      this.approved = !!taskData.approved;
      this.progress = taskData.progress || 0;

      if (taskData.status) {
        const s = taskData.status.toString().toLowerCase();
        if (s === 'pending' || s === 'allocated') {
          this.status = 'allocated';
        } else if (s === 'in process' || s === 'inprocess' || s === 'progress') {
          this.status = 'inprocess';
        } else if (s === 'completed') {
          this.status = 'completed';
        } else if (s === 'on hold' || s === 'onhold' || s === 'hold') {
          this.status = 'onhold';
        } else {
          this.status = taskData.status;
        }
      } else {
        this.status = 'allocated';
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      task: this.task,
      taskCode: this.taskCode,
      jobCode: this.jobCode,
      planStart: this.planStart,
      planFinish: this.planFinish,
      effort: Number(this.effort) || 0,
      duration: Number(this.duration) || 0,
      stage: this.stage,
      assigned: this.assigned,
      description: this.description,
      eta: this.eta,
      actualStart: this.actualStart,
      actualFinish: this.actualFinish,
      expenses: Number(this.expenses) || 0,
      status: this.status,
      approved: this.approved,
      progress: Number(this.progress) || 0
    });
  }
}
