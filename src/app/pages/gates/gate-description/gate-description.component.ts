import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface GateDescriptionDialogData {
  gateCode: string;
  gateName: string;
  description: string;
}

@Component({
  selector: 'app-gate-description',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './gate-description.component.html',
  styleUrl: './gate-description.component.scss',
})
export class GateDescriptionComponent {
  constructor(
    public dialogRef: MatDialogRef<GateDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GateDescriptionDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

