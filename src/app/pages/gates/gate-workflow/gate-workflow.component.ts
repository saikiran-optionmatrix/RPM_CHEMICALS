import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface WorkflowUserItem {
  id: number;
  userName: string;
  selected?: boolean;
  review?: boolean;
  approval?: boolean;
  na?: boolean;
}

@Component({
  selector: 'app-gate-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './gate-workflow.component.html',
  styleUrl: './gate-workflow.component.scss',
})
export class GateWorkflowComponent implements OnInit {
  gateTitle: string = 'Gate Workflow';

  users: WorkflowUserItem[] = [
    { id: 1, userName: 'Satya', review: true, approval: false, na: false, selected: true },
    { id: 2, userName: 'Pavan Kalyan', review: true, approval: false, na: false, selected: true },
    { id: 3, userName: 'Gaurav', review: false, approval: true, na: false, selected: true },
    { id: 4, userName: 'Ayush', review: false, approval: false, na: true, selected: false },
    { id: 5, userName: 'Santosh', review: false, approval: false, na: true, selected: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<GateWorkflowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if (this.data?.gate) {
      this.gateTitle = `Gate Workflow — ${this.data.gate.name || this.data.gate.gateCode}`;
      if (this.data.gate.workflow) {
        const parts = this.data.gate.workflow.split('/');
        const selectedCount = parseInt(parts[0], 10) || 3;
        this.users.forEach((u, idx) => {
          if (idx < selectedCount) {
            u.selected = true;
            u.na = false;
            if (idx === selectedCount - 1) {
              u.approval = true;
              u.review = false;
            } else {
              u.review = true;
              u.approval = false;
            }
          } else {
            u.selected = false;
            u.review = false;
            u.approval = false;
            u.na = true;
          }
        });
      }
    }
  }

  onToggleReview(u: WorkflowUserItem, checked: boolean): void {
    u.review = checked;
    if (checked) {
      u.approval = false;
      u.na = false;
    }
    u.selected = !!(u.review || u.approval);
  }

  onToggleApproval(u: WorkflowUserItem, checked: boolean): void {
    u.approval = checked;
    if (checked) {
      u.review = false;
      u.na = false;
    }
    u.selected = !!(u.review || u.approval);
  }

  onToggleNA(u: WorkflowUserItem, checked: boolean): void {
    u.na = checked;
    if (checked) {
      u.review = false;
      u.approval = false;
    }
    u.selected = !!(u.review || u.approval);
  }

  save(): void {
    const selectedCount = this.users.filter((u) => u.review || u.approval).length;
    const totalCount = this.users.length;
    this.dialogRef.close({
      summary: `${selectedCount}/${totalCount}`,
      selectedUsers: this.users.filter((u) => u.review || u.approval),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
