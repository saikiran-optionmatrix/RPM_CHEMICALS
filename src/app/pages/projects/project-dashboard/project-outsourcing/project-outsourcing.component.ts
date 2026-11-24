import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOutsourcingComponent } from './add-outsourcing/add-outsourcing.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';
import { OutsourcingItem, OUTSOURCING_INITIAL_DATA } from './outsourcing.data';

@Component({
  selector: 'app-project-outsourcing',
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
    MatDialogModule
  ],
  templateUrl: './project-outsourcing.component.html',
  styleUrl: './project-outsourcing.component.scss'
})
export class ProjectOutsourcingComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';

  items: OutsourcingItem[] = [...OUTSOURCING_INITIAL_DATA];

  // Filter States
  showFilter = false;
  keyword = '';
  selectedProduct = '';
  selectedTest = '';
  selectedInitiatedBy = '';

  searchKeyword = '';
  searchProduct = '';
  searchTest = '';
  searchInitiatedBy = '';

  // Pagination
  pageIndex = 0;
  pageSize = 10;

  // Filter Dropdown Options
  products: string[] = [];
  tests: string[] = [];
  initiators: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

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

    this.extractFilterOptions();
  }

  extractFilterOptions(): void {
    const pSet = new Set<string>();
    const tSet = new Set<string>();
    const iSet = new Set<string>();

    this.items.forEach(it => {
      if (it.productName?.trim()) pSet.add(it.productName.trim());
      if (it.requiredTest?.trim()) tSet.add(it.requiredTest.trim());
      if (it.initiatedBy?.trim()) iSet.add(it.initiatedBy.trim());
    });

    this.products = Array.from(pSet).sort();
    this.tests = Array.from(tSet).sort();
    this.initiators = Array.from(iSet).sort();
  }

  get filteredItems(): OutsourcingItem[] {
    return this.items.filter(it => {
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        const mProduct = it.productName?.toLowerCase().includes(kw);
        const mTest = it.requiredTest?.toLowerCase().includes(kw);
        const mInstrument = it.instrumentName?.toLowerCase().includes(kw);
        const mSample = it.sampleDetails?.toLowerCase().includes(kw);
        const mReason = it.reasonForRequirement?.toLowerCase().includes(kw);
        const mInit = it.initiatedBy?.toLowerCase().includes(kw);
        const mAppr = it.approvedBy?.toLowerCase().includes(kw);
        const mRemarks = it.remarks?.toLowerCase().includes(kw);

        if (!mProduct && !mTest && !mInstrument && !mSample && !mReason && !mInit && !mAppr && !mRemarks) {
          return false;
        }
      }

      if (this.searchProduct && it.productName?.trim() !== this.searchProduct) {
        return false;
      }

      if (this.searchTest && it.requiredTest?.trim() !== this.searchTest) {
        return false;
      }

      if (this.searchInitiatedBy && it.initiatedBy?.trim() !== this.searchInitiatedBy) {
        return false;
      }

      return true;
    });
  }

  get paginatedItems(): OutsourcingItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchProduct = this.selectedProduct;
    this.searchTest = this.selectedTest;
    this.searchInitiatedBy = this.selectedInitiatedBy;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedProduct = '';
    this.selectedTest = '';
    this.selectedInitiatedBy = '';

    this.searchKeyword = '';
    this.searchProduct = '';
    this.searchTest = '';
    this.searchInitiatedBy = '';

    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  onDelete(item: OutsourcingItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.items = this.items.filter(i => i !== item);
        this.extractFilterOptions();
      }
    });
  }

  openEdit(item: OutsourcingItem): void {
    const dialogRef = this.dialog.open(AddOutsourcingComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: { mode: 'edit', item: { ...item } }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const index = this.items.findIndex(i => i.sNo === item.sNo || i === item);
        if (index > -1) {
          this.items[index] = {
            ...this.items[index],
            ...res
          };
          this.extractFilterOptions();
        }
      }
    });
  }

  addOutsourcing(): void {
    const dialogRef = this.dialog.open(AddOutsourcingComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.onItemAdded(res);
      }
    });
  }

  onItemAdded(newItem: Partial<OutsourcingItem>): void {
    const nextSNo = (this.items.length + 1).toString();
    const item: OutsourcingItem = {
      sNo: nextSNo,
      date: newItem.date || '',
      productName: newItem.productName || '',
      requiredTest: newItem.requiredTest || '',
      instrumentName: newItem.instrumentName || '',
      sampleDetails: newItem.sampleDetails || '',
      reasonForRequirement: newItem.reasonForRequirement || '',
      initiatedBy: newItem.initiatedBy || '',
      approvedBy: newItem.approvedBy || '',
      duration: newItem.duration || '',
      reportReceivedOn: newItem.reportReceivedOn || '',
      remarks: newItem.remarks || ''
    };

    this.items.unshift(item);
    this.extractFilterOptions();
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParamsHandling: 'preserve'
    });
  }
}
