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
import { AddTtdComponent } from './add-ttd/add-ttd.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface TtdMasterItem {
  id: number;
  sNo?: number;
  checkpoint: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-ttd-master',
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
  templateUrl: './ttd-master.component.html',
  styleUrl: './ttd-master.component.scss',
})
export class TtdMasterComponent {
  constructor(private dialog: MatDialog) {}

  // 28 Checkpoints taken directly from ProjectTtdComponent
  checkpoints: TtdMasterItem[] = [
    { id: 1, sNo: 1, checkpoint: 'Title Page', status: 'Active' },
    { id: 2, sNo: 2, checkpoint: 'Approval Page', status: 'Active' },
    { id: 3, sNo: 3, checkpoint: 'Table of contents', status: 'Active' },
    { id: 4, sNo: 4, checkpoint: 'Scope and Scheme', status: 'Active' },
    { id: 5, sNo: 5, checkpoint: 'Test license', status: 'Active' },
    { id: 6, sNo: 6, checkpoint: 'Procurement package', status: 'Active' },
    { id: 7, sNo: 7, checkpoint: 'Drug Substance Specifications and Standard Test Procedure', status: 'Active' },
    { id: 8, sNo: 8, checkpoint: 'Raw material Specifications and Standard Test Procedure', status: 'Active' },
    { id: 9, sNo: 9, checkpoint: 'Packaging material Specifications and Standard Test Procedure', status: 'Active' },
    { id: 10, sNo: 10, checkpoint: 'Finished product Specifications and Standard Test Procedures: In-process; Release and Shelf-life', status: 'Active' },
    { id: 11, sNo: 11, checkpoint: 'Master Formula Record', status: 'Active' },
    { id: 12, sNo: 12, checkpoint: 'Master Packaging Record', status: 'Active' },
    { id: 13, sNo: 13, checkpoint: 'Stability Plan.', status: 'Active' },
    { id: 14, sNo: 14, checkpoint: 'Deactivation Study Protocol (If applicable)', status: 'Active' },
    { id: 15, sNo: 15, checkpoint: 'Trade Dress Proposal Form [TDPF] (If applicable)', status: 'Active' },
    { id: 16, sNo: 16, checkpoint: 'Photo stability plan', status: 'Active' },
    { id: 17, sNo: 17, checkpoint: 'Temperature Excursion', status: 'Active' },
    { id: 18, sNo: 18, checkpoint: 'Thermal Cycling Stability plan', status: 'Active' },
    { id: 19, sNo: 19, checkpoint: 'Miscellaneous Study protocol', status: 'Active' },
    { id: 20, sNo: 20, checkpoint: 'Reconstitution and Admixture study protocol', status: 'Active' },
    { id: 21, sNo: 21, checkpoint: 'Dissolution Protocol (if applicable)', status: 'Active' },
    { id: 22, sNo: 22, checkpoint: 'Filter validation study protocol and Report', status: 'Active' },
    { id: 23, sNo: 23, checkpoint: 'CPP & CQA', status: 'Active' },
    { id: 24, sNo: 24, checkpoint: 'Tool Drawings', status: 'Active' },
    { id: 25, sNo: 25, checkpoint: 'Packaging material development report (if applicable)', status: 'Active' },
    { id: 26, sNo: 26, checkpoint: 'Material Safety Data Sheet', status: 'Active' },
    { id: 27, sNo: 27, checkpoint: 'Consumables', status: 'Active' },
    { id: 28, sNo: 28, checkpoint: 'Change History', status: 'Active' },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 25;

  get filteredCheckpoints(): TtdMasterItem[] {
    return this.checkpoints.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.checkpoint.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedCheckpoints(): TtdMasterItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredCheckpoints.slice(startIndex, startIndex + this.pageSize);
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
    const dialogRef = this.dialog.open(AddTtdComponent, {
      width: '650px',
      minWidth: '650px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.checkpoint && result.checkpoint.trim()) {
        const nextId =
          this.checkpoints.length > 0
            ? Math.max(...this.checkpoints.map((c) => c.id)) + 1
            : 1;
        const newItem: TtdMasterItem = {
          id: nextId,
          sNo: this.checkpoints.length + 1,
          checkpoint: result.checkpoint.trim(),
          status: 'Active',
        };
        this.checkpoints.unshift(newItem);
      }
    });
  }

  onEdit(item: TtdMasterItem): void {
    const dialogRef = this.dialog.open(AddTtdComponent, {
      width: '650px',
      minWidth: '650px',
      data: {
        mode: 'edit',
        id: item.id,
        checkpoint: item.checkpoint,
        status: item.status,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.checkpoint && result.checkpoint.trim()) {
        item.checkpoint = result.checkpoint.trim();
      }
    });
  }

  onDelete(item: TtdMasterItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'edit',
        checkpoint: item.checkpoint,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.checkpoints = this.checkpoints.filter((c) => c.id !== item.id);
      }
    });
  }

  onStatusChange(item: TtdMasterItem): void {
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
