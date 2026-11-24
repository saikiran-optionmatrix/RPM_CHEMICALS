import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-managers-pop',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatPaginatorModule],
  templateUrl: './managers-pop.component.html',
  styleUrl: './managers-pop.component.scss',
})
export class ManagersPopComponent {
  pageSize: number = 5;
  pageIndex: number = 0;

  managers: string[] = [
    'Sridhar R',
    'Sourabh',
    'Surya Teja',
    'Vamshi',
    'Rajesh Kumar',
    'Ananya Sharma',
    'Vikram Malhotra',
    'Priya Patel',
  ];

  constructor(
    private dialogRef: MatDialogRef<ManagersPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data?.managers && Array.isArray(this.data.managers)) {
      this.managers = this.data.managers;
    }
  }

  get paginatedManagers(): string[] {
    const start = this.pageIndex * this.pageSize;
    return this.managers.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
  }

  close(): void {
    this.dialogRef.close();
  }
}
