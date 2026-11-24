import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  managerSearchTerm: string = '';

  readonly roles = [
    'Group Leader',
    'Shop Head',
    'General Manager',
    'Test',
    'Senior Manager',
  ];

  readonly departments = [
    'Engineering',
    'Quality',
    'R&D',
    'EHS',
    'Supply Chain',
    'Operations',
    'IT & Systems',
  ];

  readonly sections = [
    'Chassis Section',
    'Inspection Section',
    'CAD Section',
    'Safety Section',
    'Logistics Section',
  ];

  readonly managers = [
    'Satya',
    'Pavan Kalyan',
    'Gaurav',
    'Ayush',
    'Santosh',
  ];

  get filteredManagers(): string[] {
    if (!this.managerSearchTerm?.trim()) {
      return this.managers;
    }
    const term = this.managerSearchTerm.trim().toLowerCase();
    return this.managers.filter((m) => m.toLowerCase().includes(term));
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required]],
      shortForm: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      section: ['', [Validators.required]],
      workHours: [8, [Validators.required]],
      manager: [[] as string[], [Validators.required]],
      managerialRole: [false],
      project: [false],
      cft: [false],
      status: ['Active'],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data?.user) {
      let initialManagers: string[] = [];
      const mgrVal = this.data.user.manager;
      if (Array.isArray(mgrVal)) {
        initialManagers = mgrVal;
      } else if (typeof mgrVal === 'string' && mgrVal) {
        initialManagers = mgrVal.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      this.userForm.patchValue({
        userName: this.data.user.userName ?? '',
        shortForm: this.data.user.shortForm ?? '',
        email: this.data.user.email ?? '',
        phone: this.data.user.phone ?? '',
        role: this.data.user.role ?? '',
        department: this.data.user.department ?? '',
        section: this.data.user.section ?? '',
        workHours: this.data.user.workHours ?? 8,
        manager: initialManagers,
        managerialRole: this.data.user.managerialRole ?? false,
        project: this.data.user.project ?? false,
        cft: this.data.user.cft ?? false,
        status: this.data.user.status ?? 'Active',
      });
    }
  }

  get f() {
    return this.userForm.controls;
  }

  saveUser(): void {
    this.isSubmitting = true;

    if (this.userForm.invalid) {
      return;
    }

    const val = this.userForm.value;
    const selectedManagers = Array.isArray(val.manager)
      ? val.manager
      : (val.manager ? [val.manager] : []);

    const result = {
      ...this.data?.user,
      ...val,
      manager: selectedManagers.join(', '),
      managers: selectedManagers.length,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
