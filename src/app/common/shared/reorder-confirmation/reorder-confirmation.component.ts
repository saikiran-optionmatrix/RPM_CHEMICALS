import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ReorderConfirmationData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-reorder-confirmation',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './reorder-confirmation.component.html',
  styleUrl: './reorder-confirmation.component.scss',
})
export class ReorderConfirmationComponent {
  title: string = 'Reorder Confirmation';
  message: string =
    'Are you sure that you want to continue with reordering of stages / gates.  This is a very intensive operation and will reset the allocation of gates to stages in all divisions.  Are you sure that you want to continue?';
  confirmText: string = 'Yes';
  cancelText: string = 'No';

  constructor(
    private dialogRef: MatDialogRef<ReorderConfirmationComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: ReorderConfirmationData
  ) {
    if (this.data?.title) this.title = this.data.title;
    if (this.data?.message) this.message = this.data.message;
    if (this.data?.confirmText) this.confirmText = this.data.confirmText;
    if (this.data?.cancelText) this.cancelText = this.data.cancelText;
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}

