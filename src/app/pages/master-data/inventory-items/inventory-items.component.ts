import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface MasterItemRecord {
  materialCode: string;
  itemName: string;
  itemCategory: string;
  itemType: string;
  stockAvailable?: string;
  lastUpdated?: string;
  historyCount?: number;
}

@Component({
  selector: 'app-inventory-items',
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
  ],
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss',
})
export class InventoryItemsComponent {
  private readonly router = inject(Router);

  readonly items: MasterItemRecord[] = [
    {
      materialCode: '10100001',
      itemName: 'Active Pharmaceutical Ingredient (API)',
      itemCategory: 'Raw Materials',
      itemType: 'Active (API)',
      stockAvailable: '1,250 kg',
      lastUpdated: '15-Feb-2026',
      historyCount: 3,
    },
    {
      materialCode: '10200001',
      itemName: 'Pharmaceutical Excipients',
      itemCategory: 'Raw Materials',
      itemType: 'Excipient',
      stockAvailable: '4,800 kg',
      lastUpdated: '12-Feb-2026',
      historyCount: 4,
    },
    {
      materialCode: '10100101',
      itemName: 'Acrylic Emulsion Binder 50% Solids (API)',
      itemCategory: 'Raw Material',
      itemType: 'Active (API)',
      stockAvailable: '350 kg',
      lastUpdated: '08-Feb-2026',
      historyCount: 2,
    },
    {
      materialCode: '10100204',
      itemName: 'Liposomal Gadobutrol Base',
      itemCategory: 'Raw Material',
      itemType: 'API / Intermediate',
      stockAvailable: '120 L',
      lastUpdated: '04-Feb-2026',
      historyCount: 5,
    },
    {
      materialCode: '10200301',
      itemName: 'Microcrystalline Cellulose PH-102',
      itemCategory: 'Excipient',
      itemType: 'Binder & Filler',
      stockAvailable: '2,500 kg',
      lastUpdated: '28-Jan-2026',
      historyCount: 3,
    },
    {
      materialCode: '10300401',
      itemName: 'HDPE Container Bottles 120ml',
      itemCategory: 'Primary Packaging',
      itemType: 'Bottle Container',
      stockAvailable: '15,000 Nos',
      lastUpdated: '22-Jan-2026',
      historyCount: 2,
    },
    {
      materialCode: '10400502',
      itemName: 'Isopropyl Alcohol (IPA) USP',
      itemCategory: 'Solvent',
      itemType: 'Process Solvent',
      stockAvailable: '850 L',
      lastUpdated: '19-Jan-2026',
      historyCount: 4,
    },
    {
      materialCode: '10100108',
      itemName: 'Olaparib API Micronized',
      itemCategory: 'Raw Material',
      itemType: 'Active (API)',
      stockAvailable: '95 kg',
      lastUpdated: '15-Jan-2026',
      historyCount: 3,
    },
    {
      materialCode: '10200308',
      itemName: 'Magnesium Stearate NF',
      itemCategory: 'Excipient',
      itemType: 'Lubricant',
      stockAvailable: '1,100 kg',
      lastUpdated: '10-Jan-2026',
      historyCount: 1,
    },
    {
      materialCode: '10300415',
      itemName: 'Alu-Alu Cold Form Foil 25µ',
      itemCategory: 'Primary Packaging',
      itemType: 'Blister Foil',
      stockAvailable: '6,500 m',
      lastUpdated: '05-Jan-2026',
      historyCount: 3,
    },
    {
      materialCode: '10200312',
      itemName: 'Lactose Monohydrate SuperTab 11SD',
      itemCategory: 'Excipient',
      itemType: 'Diluent',
      stockAvailable: '3,200 kg',
      lastUpdated: '28-Dec-2025',
      historyCount: 4,
    },
    {
      materialCode: '10400508',
      itemName: 'Dichloromethane (DCM) Pure',
      itemCategory: 'Solvent',
      itemType: 'Extraction Solvent',
      stockAvailable: '600 L',
      lastUpdated: '20-Dec-2025',
      historyCount: 2,
    },
    {
      materialCode: '10500001',
      itemName: 'Analytical Standards',
      itemCategory: 'Laboratory',
      itemType: 'Analytical Reagent',
      stockAvailable: '45 Vials',
      lastUpdated: '15-Dec-2025',
      historyCount: 3,
    },
    {
      materialCode: '10600001',
      itemName: 'Granulation Materials',
      itemCategory: 'Manufacturing',
      itemType: 'Granulation Aid',
      stockAvailable: '1,750 kg',
      lastUpdated: '10-Dec-2025',
      historyCount: 2,
    },
    {
      materialCode: '10300001',
      itemName: 'Tablet Packaging Materials',
      itemCategory: 'Packaging',
      itemType: 'Primary Packaging',
      stockAvailable: '25,000 Nos',
      lastUpdated: '02-Dec-2025',
      historyCount: 5,
    },
    {
      materialCode: '10700001',
      itemName: 'Stability Samples',
      itemCategory: 'Quality',
      itemType: 'Quality Testing Sample',
      stockAvailable: '180 Packs',
      lastUpdated: '25-Nov-2025',
      historyCount: 3,
    },
    {
      materialCode: '10503876',
      itemName: '0.22 Micron PES Filter Membranes',
      itemCategory: 'Consumables',
      itemType: 'Filter Membrane',
      stockAvailable: '120 Nos',
      lastUpdated: '18-Nov-2025',
      historyCount: 2,
    },
    {
      materialCode: '10500701',
      itemName: 'Chromatography Reference Standards',
      itemCategory: 'Others',
      itemType: 'Reference Standard',
      stockAvailable: '30 Kits',
      lastUpdated: '12-Nov-2025',
      historyCount: 4,
    },
    {
      materialCode: '10200315',
      itemName: 'Povidone (PVP K-30)',
      itemCategory: 'Excipient',
      itemType: 'Binder',
      stockAvailable: '900 kg',
      lastUpdated: '05-Nov-2025',
      historyCount: 3,
    },
    {
      materialCode: '10200320',
      itemName: 'Croscarmellose Sodium',
      itemCategory: 'Excipient',
      itemType: 'Disintegrant',
      stockAvailable: '1,400 kg',
      lastUpdated: '28-Oct-2025',
      historyCount: 2,
    },
  ];

  // Default filter should be open only in this screen
  showFilter = true;

  keyword = '';
  selectedCategory = '';
  selectedType = '';

  searchKeyword = '';
  searchCategory = '';
  searchType = '';

  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20, 50];

  get categories(): string[] {
    const set = new Set<string>();
    this.items.forEach((it) => {
      if (it.itemCategory?.trim()) set.add(it.itemCategory.trim());
    });
    return Array.from(set).sort();
  }

  get types(): string[] {
    const set = new Set<string>();
    this.items.forEach((it) => {
      if (it.itemType?.trim()) set.add(it.itemType.trim());
    });
    return Array.from(set).sort();
  }

  get filteredItems(): MasterItemRecord[] {
    return this.items.filter((item) => {
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        const mCode = item.materialCode.toLowerCase().includes(kw);
        const mName = item.itemName.toLowerCase().includes(kw);
        const mCat = item.itemCategory.toLowerCase().includes(kw);
        const mType = item.itemType.toLowerCase().includes(kw);
        const mStock = item.stockAvailable ? item.stockAvailable.toLowerCase().includes(kw) : false;
        const mDate = item.lastUpdated ? item.lastUpdated.toLowerCase().includes(kw) : false;
        if (!mCode && !mName && !mCat && !mType && !mStock && !mDate) {
          return false;
        }
      }

      if (this.searchCategory && item.itemCategory.trim() !== this.searchCategory) {
        return false;
      }

      if (this.searchType && item.itemType.trim() !== this.searchType) {
        return false;
      }

      return true;
    });
  }

  get paginatedItems(): MasterItemRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchCategory = this.selectedCategory;
    this.searchType = this.selectedType;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.searchKeyword = '';
    this.searchCategory = '';
    this.searchType = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openHistory(item: MasterItemRecord): void {
    this.router.navigate(['/master-data/material-codes/history'], {
      queryParams: {
        materialCode: item.materialCode,
        itemName: item.itemName,
        itemCategory: item.itemCategory,
        itemType: item.itemType,
        stockAvailable: item.stockAvailable,
        lastUpdated: item.lastUpdated,
        historyCount: item.historyCount || 3,
      },
    });
  }
}
