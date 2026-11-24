import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AddRejectionComponent } from './add-rejection/add-rejection.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface RejectionReason {
  id?: number;
  reason: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-rejection-reasons',
  standalone: true,
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './rejection-reasons.component.html',
  styleUrl: './rejection-reasons.component.scss',
})
export class RejectionReasonsComponent {
  constructor(private dialog: MatDialog) {}

  rejectionReasons: RejectionReason[] = [
    {
      id: 1,
      reason: 'Evidence not attached',
      status: 'Active',
    },
    {
      id: 2,
      reason: 'Evidence incomplete or not signed',
      status: 'Active',
    },
    {
      id: 3,
      reason: 'Wrong document version or not under document control',
      status: 'Active',
    },
    {
      id: 4,
      reason: 'Does not meet the acceptance criterion',
      status: 'Active',
    },
    {
      id: 5,
      reason: 'Decision criteria not documented or agreed',
      status: 'Active',
    },
    {
      id: 6,
      reason: 'GMP or regulatory compliance gap',
      status: 'Active',
    },
    {
      id: 7,
      reason: 'Regulatory pathway or filing requirement not confirmed',
      status: 'Active',
    },
    {
      id: 8,
      reason: 'Process or method validation not complete',
      status: 'Active',
    },
    {
      id: 9,
      reason: 'Batch or stability data insufficient',
      status: 'Active',
    },
    {
      id: 10,
      reason: 'Open deviations, CAPAs or change controls',
      status: 'Active',
    },
    {
      id: 11,
      reason: 'Quality or QA review findings not closed',
      status: 'Active',
    },
    {
      id: 12,
      reason: 'Risk assessment missing or high risks open',
      status: 'Active',
    },
    {
      id: 13,
      reason: 'Supplier, vendor or material qualification pending',
      status: 'Active',
    },
    {
      id: 14,
      reason: 'Equipment or facility qualification pending',
      status: 'Active',
    },
    {
      id: 15,
      reason: 'COGS or CAPEX estimate not acceptable',
      status: 'Active',
    },
    {
      id: 16,
      reason: 'Timeline or resource plan not confirmed',
      status: 'Active',
    },
    {
      id: 17,
      reason: 'Needs clarification from owner',
      status: 'Active',
    },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredRejectionReasons(): RejectionReason[] {
    return this.rejectionReasons.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.reason.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedRejectionReasons(): RejectionReason[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredRejectionReasons.slice(startIndex, startIndex + this.pageSize);
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

  onAdd(): void {
    const dialogRef = this.dialog.open(AddRejectionComponent, {
      width: '600px',
      minWidth: '450px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reason) {
        this.rejectionReasons.unshift({
          id: Date.now(),
          reason: result.reason,
          status: 'Active',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: RejectionReason): void {
    const dialogRef = this.dialog.open(AddRejectionComponent, {
      width: '600px',
      minWidth: '450px',
      data: {
        mode: 'edit',
        reason: item.reason,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reason) {
        item.reason = result.reason;
      }
    });
  }

  onDelete(item: RejectionReason): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this rejection reason?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        const index = this.rejectionReasons.findIndex((r) => r === item);
        if (index > -1) {
          this.rejectionReasons.splice(index, 1);
        }
      }
    });
  }

  onStatusChange(item: RejectionReason): void {
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
