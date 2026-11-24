import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ReviewDateDialogData {
  title?: string;
  decision?: string;
  reviewDate?: string;
  gateCode?: string;
  gateName?: string;
}

@Component({
  selector: 'app-review-date-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './review-date-dialog.component.html',
  styleUrl: './review-date-dialog.component.scss',
})
export class ReviewDateDialogComponent implements OnInit {
  reviewDate: string = '';

  constructor(
    private dialogRef: MatDialogRef<ReviewDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDateDialogData
  ) {}

  ngOnInit(): void {
    if (this.data?.reviewDate) {
      this.reviewDate = this.data.reviewDate;
    } else {
      // Default to 14 days in the future
      const d = new Date();
      d.setDate(d.getDate() + 14);
      this.reviewDate = d.toISOString().split('T')[0];
    }
  }

  save(): void {
    if (!this.reviewDate) return;
    this.dialogRef.close({
      reviewDate: this.reviewDate,
      decision: this.data?.decision,
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

