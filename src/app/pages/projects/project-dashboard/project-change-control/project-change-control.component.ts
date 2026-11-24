import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface ChangeControlItem {
  changeControlNumber: string;
  initiationDepartment: string;
  initiatedBy: string;
  initiationDate: string;
  permanentChangeControl: boolean;
  market: string;
  categoryOfChange: 'Major' | 'Minor' | 'Critical' | string;
  changeType: 'Generic' | 'Formulation' | string;
}

@Component({
  selector: 'app-project-change-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './project-change-control.component.html',
  styleUrl: './project-change-control.component.scss'
})
export class ProjectChangeControlComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';

  // Master list of change controls
  changeControls: ChangeControlItem[] = [
    {
      changeControlNumber: 'CCN-2026-001',
      initiationDepartment: 'Analytical R&D',
      initiatedBy: 'Dr. Sarah Jenkins',
      initiationDate: '15-01-2026',
      permanentChangeControl: true,
      market: 'US',
      categoryOfChange: 'Major',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-002',
      initiationDepartment: 'Formulation R&D',
      initiatedBy: 'Dr. Vikram Patel',
      initiationDate: '28-01-2026',
      permanentChangeControl: true,
      market: 'US',
      categoryOfChange: 'Major',
      changeType: 'Formulation'
    },
    {
      changeControlNumber: 'CCN-2026-003',
      initiationDepartment: 'Quality Assurance',
      initiatedBy: 'Priya Sharma',
      initiationDate: '10-02-2026',
      permanentChangeControl: true,
      market: 'India',
      categoryOfChange: 'Critical',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-004',
      initiationDepartment: 'Formulation R&D',
      initiatedBy: 'Neha Kulkarni',
      initiationDate: '22-02-2026',
      permanentChangeControl: false,
      market: 'EU',
      categoryOfChange: 'Minor',
      changeType: 'Formulation'
    },
    {
      changeControlNumber: 'CCN-2026-005',
      initiationDepartment: 'Production',
      initiatedBy: 'Emily Watson',
      initiationDate: '05-03-2026',
      permanentChangeControl: false,
      market: 'Global',
      categoryOfChange: 'Minor',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-006',
      initiationDepartment: 'Production',
      initiatedBy: 'Marcus Vance',
      initiationDate: '18-03-2026',
      permanentChangeControl: true,
      market: 'India',
      categoryOfChange: 'Critical',
      changeType: 'Formulation'
    },
    {
      changeControlNumber: 'CCN-2026-007',
      initiationDepartment: 'Quality Control',
      initiatedBy: 'Anita Desai',
      initiationDate: '02-04-2026',
      permanentChangeControl: false,
      market: 'ROW',
      categoryOfChange: 'Minor',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-008',
      initiationDepartment: 'Quality Assurance',
      initiatedBy: 'Sunita Rao',
      initiationDate: '14-04-2026',
      permanentChangeControl: true,
      market: 'Global',
      categoryOfChange: 'Major',
      changeType: 'Formulation'
    },
    {
      changeControlNumber: 'CCN-2026-009',
      initiationDepartment: 'Regulatory Affairs',
      initiatedBy: 'Michael Chang',
      initiationDate: '28-04-2026',
      permanentChangeControl: true,
      market: 'US',
      categoryOfChange: 'Major',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-010',
      initiationDepartment: 'Packaging & Development',
      initiatedBy: 'Carlos Mendoza',
      initiationDate: '12-05-2026',
      permanentChangeControl: false,
      market: 'ROW',
      categoryOfChange: 'Minor',
      changeType: 'Formulation'
    },
    {
      changeControlNumber: 'CCN-2026-011',
      initiationDepartment: 'Packaging & Development',
      initiatedBy: 'David Kim',
      initiationDate: '25-05-2026',
      permanentChangeControl: true,
      market: 'EU',
      categoryOfChange: 'Major',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-012',
      initiationDepartment: 'Formulation R&D',
      initiatedBy: 'Dr. Elena Rostova',
      initiationDate: '09-06-2026',
      permanentChangeControl: true,
      market: 'Canada',
      categoryOfChange: 'Major',
      changeType: 'Formulation'
    },
    {
      changeControlNumber: 'CCN-2026-013',
      initiationDepartment: 'Analytical R&D',
      initiatedBy: 'Robert Johnson',
      initiationDate: '22-06-2026',
      permanentChangeControl: true,
      market: 'Canada',
      categoryOfChange: 'Major',
      changeType: 'Generic'
    },
    {
      changeControlNumber: 'CCN-2026-014',
      initiationDepartment: 'Formulation R&D',
      initiatedBy: 'Alex Rivera',
      initiationDate: '05-07-2026',
      permanentChangeControl: false,
      market: 'EU',
      categoryOfChange: 'Minor',
      changeType: 'Formulation'
    },
  ];

  // Filter States
  showFilter: boolean = false;
  keyword: string = '';
  selectedDepartment: string = '';
  selectedCategory: string = '';

  searchKeyword: string = '';
  searchDepartment: string = '';
  searchCategory: string = '';

  // Dropdown options
  departments: string[] = [];
  categories: string[] = [];

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      } else if (params['name']) {
        this.projectName = params['name'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      } else if (params['code']) {
        this.projectCode = params['code'];
      }
    });

    this.updateFilterLists();
  }

  updateFilterLists(): void {
    const deptSet = new Set<string>();
    const catSet = new Set<string>();

    this.changeControls.forEach(item => {
      if (item.initiationDepartment) deptSet.add(item.initiationDepartment);
      if (item.categoryOfChange) catSet.add(item.categoryOfChange);
    });

    this.departments = Array.from(deptSet).sort();
    this.categories = Array.from(catSet).sort();
  }

  get filteredChangeControls(): ChangeControlItem[] {
    return this.changeControls.filter(item => {
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        const matchNumber = item.changeControlNumber.toLowerCase().includes(kw);
        const matchDept = item.initiationDepartment.toLowerCase().includes(kw);
        const matchUser = item.initiatedBy.toLowerCase().includes(kw);
        const matchMarket = item.market.toLowerCase().includes(kw);
        const matchCat = item.categoryOfChange.toLowerCase().includes(kw);
        const matchType = item.changeType ? item.changeType.toLowerCase().includes(kw) : false;

        if (!matchNumber && !matchDept && !matchUser && !matchMarket && !matchCat && !matchType) {
          return false;
        }
      }

      if (this.searchDepartment && item.initiationDepartment !== this.searchDepartment) {
        return false;
      }

      if (this.searchCategory && item.categoryOfChange !== this.searchCategory) {
        return false;
      }

      return true;
    });
  }

  get paginatedChangeControls(): ChangeControlItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredChangeControls.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchDepartment = this.selectedDepartment;
    this.searchCategory = this.selectedCategory;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedDepartment = '';
    this.selectedCategory = '';

    this.searchKeyword = '';
    this.searchDepartment = '';
    this.searchCategory = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onAdd(): void {
    this.router.navigate(['/projects/dashboard/change-control/add'], {
      queryParams: { mode: 'add', ccn: null },
      queryParamsHandling: 'merge'
    });
  }

  onOpenDashboard(item: ChangeControlItem): void {
    this.router.navigate(['/projects/dashboard/change-control/details'], {
      queryParams: { ccn: item.changeControlNumber, mode: null, tab: 'initiation' },
      queryParamsHandling: 'merge'
    });
  }

  onEdit(item: ChangeControlItem): void {
    this.router.navigate(['/projects/dashboard/change-control/add'], {
      queryParams: { mode: 'edit', ccn: item.changeControlNumber },
      queryParamsHandling: 'merge'
    });
  }

  onDelete(item: ChangeControlItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.changeControls = this.changeControls.filter(c => c !== item);
        this.updateFilterLists();
      }
    });
  }

  formatToDdMmYyyy(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    const match = dateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
      return `${match[3].padStart(2, '0')}-${match[2].padStart(2, '0')}-${match[1]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return dateStr;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParamsHandling: 'preserve'
    });
  }
}
