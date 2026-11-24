import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDimensionComponent } from './add-dimension/add-dimension.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface DimensionItem {
  id: number;
  dimension: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-dimension-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './dimension-master.component.html',
  styleUrl: './dimension-master.component.scss',
})
export class DimensionMasterComponent {
  constructor(private readonly dialog: MatDialog) {}

  dimensions: DimensionItem[] = [
    { id: 1, dimension: 'Warehouse', status: 'Active' },
    { id: 2, dimension: 'Production', status: 'Active' },
    { id: 3, dimension: 'Sterile API', status: 'Active' },
    { id: 4, dimension: 'Quality Control', status: 'Active' },
    { id: 5, dimension: 'Engineering', status: 'Active' },
    { id: 6, dimension: 'Administration', status: 'Active' },
    { id: 7, dimension: 'Quality Assurance', status: 'Active' },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredDimensions(): DimensionItem[] {
    return this.dimensions.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.dimension.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedDimensions(): DimensionItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredDimensions.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddDimensionComponent, {
      width: '600px',
      minWidth: '500px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.dimension && result.dimension.trim()) {
        const nextId =
          this.dimensions.length > 0
            ? Math.max(...this.dimensions.map((d) => d.id)) + 1
            : 1;
        const newItem: DimensionItem = {
          id: nextId,
          dimension: result.dimension.trim(),
          status: 'Active',
        };
        this.dimensions.unshift(newItem);
      }
    });
  }

  onEdit(item: DimensionItem): void {
    const dialogRef = this.dialog.open(AddDimensionComponent, {
      width: '600px',
      minWidth: '500px',
      data: {
        mode: 'edit',
        id: item.id,
        dimension: item.dimension,
        status: item.status,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.dimension && result.dimension.trim()) {
        item.dimension = result.dimension.trim();
      }
    });
  }

  onDelete(item: DimensionItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'edit',
        dimension: item.dimension,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.dimensions = this.dimensions.filter((d) => d.id !== item.id);
      }
    });
  }

  onStatusChange(item: DimensionItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to change the status?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
