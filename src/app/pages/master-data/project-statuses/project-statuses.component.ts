import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddProjectStatusComponent } from './add-project-status/add-project-status.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-project-statuses',
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
  templateUrl: './project-statuses.component.html',
  styleUrl: './project-statuses.component.scss',
})
export class ProjectStatusesComponent {
  constructor(private dialog: MatDialog) {}

  readonly items: MasterItem[] = [
    {
      name: 'Planning',
      description: 'Target product profile, research scope and development planning',
      status: 'Active',
    },
    {
      name: 'Approved',
      description: 'Project approved for execution and funding released',
      status: 'Active',
    },
    {
      name: 'In Progress',
      description: 'Route development, process development and pilot or plant activities underway',
      status: 'Active',
    },
    {
      name: 'On Hold',
      description: 'Project temporarily paused pending data review, safety review or regulatory feedback',
      status: 'Inactive',
    },
    {
      name: 'Completed',
      description: 'Development successfully completed and ready for technology transfer',
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

  get filteredItems(): MasterItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): MasterItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
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
    const dialogRef = this.dialog.open(AddProjectStatusComponent, {
      width: '800px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && (res.ProjectStatus || res.DosageForm || res.name)) {
        this.items.unshift({
          name: res.ProjectStatus || res.DosageForm || res.name,
          status: 'Active',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    const dialogRef = this.dialog.open(AddProjectStatusComponent, {
      width: '800px',
      data: { mode: 'edit', ...item, ProjectStatus: item.name },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && (res.ProjectStatus || res.DosageForm || res.name)) {
        item.name = res.ProjectStatus || res.DosageForm || res.name;
      }
    });
  }

  onDelete(item: MasterItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: { title: 'Delete Dosage Form', itemName: item.name, ...item }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.items.indexOf(item);
        if (index > -1) {
          this.items.splice(index, 1);
        }
      }
    });
  }

  onStatusChange(item: MasterItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
