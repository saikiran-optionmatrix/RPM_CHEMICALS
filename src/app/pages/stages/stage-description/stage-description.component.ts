import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface StageDescriptionDialogData {
  stageCode: string;
  stageName: string;
  description: string;
}

@Component({
  selector: 'app-stage-description',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './stage-description.component.html',
  styleUrl: './stage-description.component.scss',
})
export class StageDescriptionComponent {
  constructor(
    public dialogRef: MatDialogRef<StageDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StageDescriptionDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

