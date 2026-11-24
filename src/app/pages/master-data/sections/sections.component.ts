import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddSectionComponent } from './add-section/add-section.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  department: string;
  remarks: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-sections',
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
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.scss',
})
export class SectionsComponent {
  constructor(private dialog: MatDialog) {}

  readonly departments: string[] = [
    'Research & Development',
    'Quality Control',
    'Quality Assurance',
    'Manufacturing',
    'Regulatory Affairs',
  ];

  readonly items: MasterItem[] = [
    {
      name: 'Process Chemistry & Route Development',
      code: 'PCRD',
      department: 'Research & Development',
      remarks: 'Route scouting, catalyst development and process optimization',
      status: 'Active',
    },
    {
      name: 'Analytical Development',
      code: 'AD',
      department: 'Research & Development',
      remarks: 'Analytical method development and product characterization',
      status: 'Active',
    },
    {
      name: 'Quality Control',
      code: 'QC',
      department: 'Quality Control',
      remarks: 'Assay, purity and release testing',
      status: 'Active',
    },
    {
      name: 'Manufacturing',
      code: 'MFG',
      department: 'Manufacturing',
      remarks: 'Reaction, separation, drying and packing operations',
      status: 'Active',
    },
    {
      name: 'Regulatory Affairs',
      code: 'RA',
      department: 'Regulatory Affairs',
      remarks: 'REACH / TSCA dossiers and submissions',
      status: 'Active',
    },
    {
      name: 'Quality Assurance',
      code: 'QA',
      department: 'Quality Assurance',
      remarks: 'ISO 9001 compliance, validation and batch approvals',
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
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.department && item.department.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        item.remarks.toLowerCase().includes(this.searchKeyword.toLowerCase());

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
    const dialogRef = this.dialog.open(AddSectionComponent, {
      width: '800px',
      data: { mode: 'add', departments: this.departments },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SectionName) {
        this.items.unshift({
          name: res.SectionName,
          code: res.SectionCode,
          department: res.Department || this.departments[0],
          remarks: res.Remarks || '',
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
    const dialogRef = this.dialog.open(AddSectionComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        SectionName: item.name,
        SectionCode: item.code,
        Department: item.department,
        Remarks: item.remarks,
        departments: this.departments,
        ...item,
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SectionName) {
        item.name = res.SectionName;
        item.code = res.SectionCode;
        if (res.Department) {
          item.department = res.Department;
        }
        item.remarks = res.Remarks;
      }
    });
  }

  onDelete(item: MasterItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
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
