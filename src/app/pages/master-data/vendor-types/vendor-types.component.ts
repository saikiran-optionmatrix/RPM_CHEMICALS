import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface VendorTypeItem {
  id: number;
  vendorType: string;
  checklistCount: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-vendor-types',
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
  templateUrl: './vendor-types.component.html',
  styleUrl: './vendor-types.component.scss',
})
export class VendorTypesComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {}

  vendors: VendorTypeItem[] = [
    { id: 1, vendorType: 'Raw Material Supplier', checklistCount: 8, status: 'Active' },
    { id: 2, vendorType: 'API Manufacturer', checklistCount: 12, status: 'Active' },
    { id: 3, vendorType: 'Packaging Material Vendor', checklistCount: 6, status: 'Active' },
    { id: 4, vendorType: 'Equipment Manufacturer', checklistCount: 9, status: 'Active' },
    { id: 5, vendorType: 'Testing Laboratory', checklistCount: 7, status: 'Active' },
    { id: 6, vendorType: 'CRO / Service Provider', checklistCount: 5, status: 'Active' },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredVendors(): VendorTypeItem[] {
    return this.vendors.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.vendorType.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedVendors(): VendorTypeItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredVendors.slice(startIndex, startIndex + this.pageSize);
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

  openChecklist(vendor: VendorTypeItem): void {
    this.router.navigate(['/master-data/vendor-types/checklist'], {
      queryParams: {
        vendorType: vendor.vendorType,
      },
    });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddVendorComponent, {
      width: '600px',
      minWidth: '500px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.vendorType && result.vendorType.trim()) {
        const nextId =
          this.vendors.length > 0
            ? Math.max(...this.vendors.map((v) => v.id)) + 1
            : 1;
        const newItem: VendorTypeItem = {
          id: nextId,
          vendorType: result.vendorType.trim(),
          checklistCount: 0,
          status: 'Active',
        };
        this.vendors.unshift(newItem);
      }
    });
  }

  onEdit(item: VendorTypeItem): void {
    const dialogRef = this.dialog.open(AddVendorComponent, {
      width: '600px',
      minWidth: '500px',
      data: {
        mode: 'edit',
        id: item.id,
        vendorType: item.vendorType,
        status: item.status,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.vendorType && result.vendorType.trim()) {
        item.vendorType = result.vendorType.trim();
      }
    });
  }

  onDelete(item: VendorTypeItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'edit',
        vendorType: item.vendorType,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.vendors = this.vendors.filter((v) => v.id !== item.id);
      }
    });
  }

  onStatusChange(item: VendorTypeItem): void {
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
