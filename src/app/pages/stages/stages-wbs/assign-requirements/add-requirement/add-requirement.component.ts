import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-requirement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-requirement.component.html',
  styleUrl: './add-requirement.component.scss'
})
export class AddRequirementComponent implements OnInit {
  requirementForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRequirementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.requirementForm = this.fb.group({
      requirementName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.requirementForm.patchValue({
        requirementName: this.data.requirementName ?? ''
      });
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.requirementForm.invalid) {
      return;
    }

    const result = {
      ...this.data,
      ...this.requirementForm.value
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}

