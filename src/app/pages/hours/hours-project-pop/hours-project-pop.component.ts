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
    { sNo: 2, projectCode: '2026/CHM/001', projectName: 'Waterborne Polyurethane Dispersion' },
    { sNo: 3, projectCode: '2026/CHM/002', projectName: 'Bio-based Epoxy Crosslinker' }
  ];

  constructor(
    public dialogRef: MatDialogRef<HoursProjectPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const rawList = this.data?.projects || this.data?.entry?.projects;
    if (rawList && Array.isArray(rawList) && rawList.length > 0) {
      if (typeof rawList[0] === 'string') {
        this.projects = rawList.map((str: string, index: number) => {
          const delimiter = str.includes(' - ') ? ' - ' : str.includes(': ') ? ': ' : ':';
          const parts = str.split(delimiter);
          return {
            sNo: index + 1,
            projectCode: (parts[0] || '').trim(),
            projectName: (parts.slice(1).join(delimiter) || str).trim()
          };
        });
      } else {
        this.projects = rawList;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
