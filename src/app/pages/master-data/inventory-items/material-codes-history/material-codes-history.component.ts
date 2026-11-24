import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface MaterialCodeHistoryRecord {
  id: number;
  materialCode: string;
  itemName: string;
  itemCategory: string;
  itemType: string;
  stockAvailable: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-material-codes-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './material-codes-history.component.html',
  styleUrl: './material-codes-history.component.scss'
})
export class MaterialCodesHistoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  materialCode = '';
  itemName = '';
  itemCategory = '';
  itemType = '';
  stockAvailable = '';
  lastUpdated = '';
  historyCount = 3;

  pageIndex = 0;
  pageSize = 10;

  records: MaterialCodeHistoryRecord[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['materialCode']) this.materialCode = params['materialCode'];
      if (params['itemName']) this.itemName = params['itemName'];
      if (params['itemCategory']) this.itemCategory = params['itemCategory'];
      if (params['itemType']) this.itemType = params['itemType'];
      if (params['stockAvailable']) this.stockAvailable = params['stockAvailable'];
      if (params['lastUpdated']) this.lastUpdated = params['lastUpdated'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const code = this.materialCode || '10100001';
    const name = this.itemName || 'Active Pharmaceutical Ingredient (API)';
    const cat = this.itemCategory || 'Raw Materials';
    const type = this.itemType || 'Active (API)';
    const stock = this.stockAvailable || '1,250 kg';
    const updated = this.lastUpdated || '15-Feb-2026';
    const count = this.historyCount || 3;

    const auditTrail: MaterialCodeHistoryRecord[] = [
      {
        id: 1,
        materialCode: code,
        itemName: name,
        itemCategory: cat,
        itemType: type,
        stockAvailable: stock,
        lastUpdated: updated
      },
      {
        id: 2,
        materialCode: code,
        itemName: name,
        itemCategory: cat,
        itemType: type,
        stockAvailable: this.adjustStock(stock, 0.8),
        lastUpdated: '28-Jan-2026'
      },
      {
        id: 3,
        materialCode: code,
        itemName: name,
        itemCategory: cat,
        itemType: type,
        stockAvailable: this.adjustStock(stock, 0.5),
        lastUpdated: '10-Jan-2026'
      },
      {
        id: 4,
        materialCode: code,
        itemName: name,
        itemCategory: cat,
        itemType: type,
        stockAvailable: this.adjustStock(stock, 0.3),
        lastUpdated: '18-Dec-2025'
      },
      {
        id: 5,
        materialCode: code,
        itemName: name,
        itemCategory: cat,
        itemType: type,
        stockAvailable: '0',
        lastUpdated: '01-Dec-2025'
      }
    ];

    this.records = auditTrail.slice(0, Math.max(count, 2));
  }

  private adjustStock(stockStr: string, multiplier: number): string {
    const match = stockStr.match(/^([\d,.]+)\s*(.*)$/);
    if (!match) return stockStr;
    const num = parseFloat(match[1].replace(/,/g, ''));
    const unit = match[2] || '';
    if (isNaN(num)) return stockStr;
    const adjusted = Math.round(num * multiplier);
    return `${adjusted.toLocaleString('en-IN')}${unit ? ' ' + unit : ''}`;
  }

  get paginatedRecords(): MaterialCodeHistoryRecord[] {
    const start = this.pageIndex * this.pageSize;
    return this.records.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/master-data/material-codes'], {
      queryParamsHandling: 'preserve'
    });
  }
}
