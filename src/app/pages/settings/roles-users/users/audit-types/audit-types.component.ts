import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface AuditOption {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-audit-types',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './audit-types.component.html',
  styleUrl: './audit-types.component.scss',
})
export class AuditTypesComponent implements OnInit {
  objectiveAudits: AuditOption[] = [
    { name: 'C Rating', selected: false },
    { name: 'D Rating', selected: false },
    { name: 'Eng Spec Test', selected: false },
    { name: 'Torque Audit', selected: false },
    { name: 'Body Leak Test', selected: false },
  ];

  subjectiveAudits: AuditOption[] = [
    { name: 'PQA', selected: false },
    { name: 'Body Audit', selected: false },
    { name: 'Paint Audit', selected: false },
    { name: 'RQA', selected: false },
    { name: 'Process Audit', selected: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<AuditTypesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {}

  save(): void {
    const selectedObj = this.objectiveAudits.filter((a) => a.selected).length;
    const selectedSub = this.subjectiveAudits.filter((a) => a.selected).length;
    const totalSelected = selectedObj + selectedSub;
    this.dialogRef.close({
      totalSelected: totalSelected || 10,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
