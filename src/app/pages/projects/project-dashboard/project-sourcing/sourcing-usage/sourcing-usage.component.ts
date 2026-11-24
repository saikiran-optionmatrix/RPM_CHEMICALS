import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { AddSourcingUsageComponent } from './add-sourcing-usage/add-sourcing-usage.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface UsageRecord {
  id: number;
  stageName: string;
  deliverable: string;
  activity: string;
  task: string;
  quantity: number;
  issuedTo: string;
  date?: string;
}

@Component({
  selector: 'app-sourcing-usage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './sourcing-usage.component.html',
  styleUrl: './sourcing-usage.component.scss',
})
export class SourcingUsageComponent implements OnInit {
  // Top Reference Fields
  itemCode: string = 'CAT/RAW/01';
  itemCategory: string = 'Raw Material';
  itemName: string = 'Consumables';
  itemType: string = 'API';
  unit: string = 'Grams';

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

  // Usage Table Data
  usageList: UsageRecord[] = [
    {
      id: 1,
      stageName: 'Pre-Formulation',
      deliverable: 'API Characterization',
      activity: 'Preformulation Testing',
      task: 'Sample Extraction & Analysis',
      quantity: 50,
      issuedTo: 'Priya Sharma',
      date: '10-Jan-2026'
    },
    {
      id: 2,
      stageName: 'Formulation Development',
      deliverable: 'Prototype Formulation',
      activity: 'Granulation & Blending Trial',
      task: 'Wet Granulation Batch Preparation',
      quantity: 150,
      issuedTo: 'Rajesh Kumar',
      date: '18-Jan-2026'
    },
    {
      id: 3,
      stageName: 'Formulation Development',
      deliverable: 'Prototype Formulation',
      activity: 'Granulation & Blending Trial',
      task: 'Formulation Optimization Trial',
      quantity: 100,
      issuedTo: 'Vikram Singh',
      date: '25-Jan-2026'
    },
    {
      id: 4,
      stageName: 'Analytical Development',
      deliverable: 'Dissolution Method Development',
      activity: 'Dissolution Method Transfer',
      task: 'Assay & Impurity Analysis',
      quantity: 75,
      issuedTo: 'Dr. Arun Mehta',
      date: '02-Feb-2026'
    },
    {
      id: 5,
      stageName: 'Stability',
      deliverable: 'Accelerated Stability Study',
      activity: 'Stability Chamber Loading',
      task: 'Stress Testing at 40°C/75% RH',
      quantity: 75,
      issuedTo: 'Sneha Patel',
      date: '12-Feb-2026'
    }
  ];

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['itemCode']) this.itemCode = params['itemCode'];
      if (params['itemName']) this.itemName = params['itemName'];
      if (params['itemCategory']) this.itemCategory = params['itemCategory'];
      if (params['itemType']) this.itemType = params['itemType'];
      if (params['unit']) this.unit = params['unit'];
      if (params['name']) this.projectName = params['name'];
      if (params['code']) this.projectCode = params['code'];
    });
  }

  get paginatedUsage(): UsageRecord[] {
    const start = this.pageIndex * this.pageSize;
    return this.usageList.slice(start, start + this.pageSize);
  }

  getTotalUsageQuantity(): number {
    return this.usageList.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openAddUsage(): void {
    const dialogRef = this.dialog.open(AddSourcingUsageComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const newItem: UsageRecord = {
          id: Date.now(),
          stageName: res.stageName,
          deliverable: res.deliverable,
          activity: res.activity,
          task: res.task,
          quantity: Number(res.quantity),
          issuedTo: res.issuedTo,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        this.usageList = [newItem, ...this.usageList];
      }
    });
  }

  openEditUsage(item: UsageRecord): void {
    const dialogRef = this.dialog.open(AddSourcingUsageComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        item: { ...item }
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const idx = this.usageList.findIndex((u) => u.id === item.id);
        if (idx > -1) {
          this.usageList[idx] = {
            ...this.usageList[idx],
            ...res,
            quantity: Number(res.quantity)
          };
          this.usageList = [...this.usageList];
        }
      }
    });
  }

  deleteUsage(item: UsageRecord): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '380px',
      data: {
        title: 'Delete Usage Record',
        itemName: `${item.stageName} (${item.task})`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.usageList = this.usageList.filter((u) => u.id !== item.id);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/sourcing'], {
      queryParams: {
        code: this.projectCode,
        name: this.projectName
      }
    });
  }
}
