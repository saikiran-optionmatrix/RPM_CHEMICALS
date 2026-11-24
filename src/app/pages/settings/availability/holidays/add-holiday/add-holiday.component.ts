import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-holiday',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-holiday.component.html',
  styleUrl: './add-holiday.component.scss',
})
export class AddHolidayComponent implements OnInit {
  holidayForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddHolidayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.holidayForm = this.fb.group({
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data?.holiday) {
      this.holidayForm.patchValue({
        date: this.data.holiday.date ?? '',
        description: this.data.holiday.description ?? '',
      });
    }
  }

  get f() {
    return this.holidayForm.controls;
  }

  saveHoliday(): void {
    this.isSubmitting = true;

    if (this.holidayForm.invalid) {
      return;
    }

    const result = {
      ...this.data?.holiday,
      ...this.holidayForm.value,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}

