import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ProjectPopItem {
  sNo: number;
  projectCode: string;
  projectName: string;
}

@Component({
  selector: 'app-hours-project-pop',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './hours-project-pop.component.html',
  styleUrl: './hours-project-pop.component.scss'
})
export class HoursProjectPopComponent implements OnInit {
  projects: ProjectPopItem[] = [
    { sNo: 1, projectCode: '2026/CHM/006', projectName: 'Acrylic Emulsion Binder 50% Solids' },
    { sNo: 2, projectCode: '2026/CHM/002', projectName: 'Liquid Epoxy Resin (Bisphenol A Diglycidyl Ether)' },
    { sNo: 3, projectCode: '2026/CHM/003', projectName: 'Sodium Lauryl Ether Sulfate (SLES) 70% Paste' }
  ];

  constructor(
    public dialogRef: MatDialogRef<HoursProjectPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.projects && Array.isArray(this.data.projects)) {
      this.projects = this.data.projects;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
