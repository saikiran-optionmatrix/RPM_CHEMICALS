import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface MaterialTypeRecord {
  materialTypeCode: string;
  materialType: string;
}

@Component({
  selector: 'app-material-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './material-types.component.html',
  styleUrl: './material-types.component.scss',
})
export class MaterialTypesComponent {
  readonly items: MaterialTypeRecord[] = [
    { materialTypeCode: 'ZRMA', materialType: 'Raw Materials-API' },
    { materialTypeCode: 'ZEXP', materialType: 'Excipients' },
    { materialTypeCode: 'ZPPM', materialType: 'Primary Packg Materials' },
    { materialTypeCode: 'ZSPM', materialType: 'Secondary Packg Materials' },
    { materialTypeCode: 'ZTPM', materialType: 'Tertiary Packg Materials' },
    { materialTypeCode: 'ZCHE', materialType: 'Lab Chemicals&Consumables' },
    { materialTypeCode: 'ZCON', materialType: 'Stationary & Consumables' },
    { materialTypeCode: 'ZSPR', materialType: 'Tools & Spares' },
    { materialTypeCode: 'ZSFG', materialType: 'Semifinished Product' },
    { materialTypeCode: 'ZJFP', materialType: 'Finished Product' },
    { materialTypeCode: 'ZRLD', materialType: 'Reference Listed Drug' },
    { materialTypeCode: 'ZSST', materialType: 'Solid Support' },
    { materialTypeCode: 'ZMED', materialType: 'Media' },
    { materialTypeCode: 'ZFED', materialType: 'Feed' },
    { materialTypeCode: 'ZCRD', materialType: 'Crude' },
    { materialTypeCode: 'ZCMS', materialType: 'Chemicals' },
    { materialTypeCode: 'ZCNS', materialType: 'Consumables' },
    { materialTypeCode: 'ZRES', materialType: 'Resins' },
    { materialTypeCode: 'ZBUF', materialType: 'Buffer' },
  ];

  showFilter = false;
  keyword = '';
  searchKeyword = '';

  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20, 50];

  get filteredItems(): MaterialTypeRecord[] {
    return this.items.filter((item) => {
      if (!this.searchKeyword) return true;
      const kw = this.searchKeyword.toLowerCase();
      return (
        item.materialTypeCode.toLowerCase().includes(kw) ||
        item.materialType.toLowerCase().includes(kw)
      );
    });
  }

  get paginatedItems(): MaterialTypeRecord[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.searchKeyword = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}

