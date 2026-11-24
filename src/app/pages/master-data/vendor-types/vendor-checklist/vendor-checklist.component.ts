import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCheckpointComponent } from './add-checkpoint/add-checkpoint.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface VendorChecklistItem {
  id: number;
  checkpointName: string;
  dimension: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-vendor-checklist',
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
  templateUrl: './vendor-checklist.component.html',
  styleUrl: './vendor-checklist.component.scss',
})
export class VendorChecklistComponent implements OnInit {
  vendorType = 'Raw Material Supplier';

  checkpoints: VendorChecklistItem[] = [
    { id: 1, checkpointName: 'Warehouse Storage Conditions & Temp Mapping', dimension: 'Warehouse', status: 'Active' },
    { id: 2, checkpointName: 'Cleanroom Classification & HVAC Validation', dimension: 'Production', status: 'Active' },
    { id: 3, checkpointName: 'Sterility Assurance & Bioburden Control', dimension: 'Sterile API', status: 'Active' },
    { id: 4, checkpointName: 'Analytical Instrument Calibration (HPLC/GC)', dimension: 'Quality Control', status: 'Active' },
    { id: 5, checkpointName: 'Preventive Maintenance & Equipment Qualification', dimension: 'Engineering', status: 'Active' },
    { id: 6, checkpointName: 'Vendor Audit Report & CAPA Review', dimension: 'Administration', status: 'Active' },
    { id: 7, checkpointName: 'GMP Compliance Certificate & Regulatory Approvals', dimension: 'Quality Assurance', status: 'Active' },
    { id: 8, checkpointName: 'Material Safety Data Sheet (MSDS) Verification', dimension: 'Quality Control', status: 'Active' },
  ];

  dimensionsList: string[] = [
    'Warehouse',
    'Production',
    'Sterile API',
    'Quality Control',
    'Engineering',
    'Administration',
    'Quality Assurance',
  ];

  showFilter = false;
  keyword = '';
  selectedDimension = '';
  status = '';
  searchKeyword = '';
  searchDimension = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['vendorType']) {
        this.vendorType = params['vendorType'];
      }
    });
  }

  get filteredCheckpoints(): VendorChecklistItem[] {
    return this.checkpoints.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.checkpointName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.dimension.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const dimensionMatches =
        !this.searchDimension || item.dimension === this.searchDimension;

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && dimensionMatches && statusMatches;
    });
  }

  get paginatedCheckpoints(): VendorChecklistItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredCheckpoints.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchDimension = this.selectedDimension;
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedDimension = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchDimension = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddCheckpointComponent, {
      width: '650px',
      minWidth: '550px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.checkpointName && result.checkpointName.trim()) {
        const nextId =
          this.checkpoints.length > 0
            ? Math.max(...this.checkpoints.map((c) => c.id)) + 1
            : 1;
        const newItem: VendorChecklistItem = {
          id: nextId,
          checkpointName: result.checkpointName.trim(),
          dimension: result.dimension || 'Quality Assurance',
          status: 'Active',
        };
        this.checkpoints.unshift(newItem);
      }
    });
  }

  onEdit(item: VendorChecklistItem): void {
    const dialogRef = this.dialog.open(AddCheckpointComponent, {
      width: '650px',
      minWidth: '550px',
      data: {
        mode: 'edit',
        id: item.id,
        checkpointName: item.checkpointName,
        dimension: item.dimension,
        status: item.status,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.checkpointName && result.checkpointName.trim()) {
        item.checkpointName = result.checkpointName.trim();
        if (result.dimension) {
          item.dimension = result.dimension;
        }
      }
    });
  }

  onDelete(item: VendorChecklistItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'edit',
        checkpoint: item.checkpointName,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.checkpoints = this.checkpoints.filter((c) => c.id !== item.id);
      }
    });
  }

  onStatusChange(item: VendorChecklistItem): void {
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

  goBack(): void {
    this.router.navigate(['/master-data/vendor-types']);
  }
}
