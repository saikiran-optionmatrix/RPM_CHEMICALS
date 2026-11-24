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
import { AddAssetComponent } from './add-asset/add-asset.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AvailabilityPopComponent } from './availability-pop/availability-pop.component';

interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  availability: number;
  availableDays?: string[];
  fromTime: string;
  toTime: string;
}

@Component({
  selector: 'app-assets',
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
    // AvailabilityPopComponent,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent {
  constructor(private dialog: MatDialog) {}

  readonly assets: Asset[] = [
    {
      name: 'Glass-Lined Jacketed Reactor (500 L)',
      code: 'AST-1001',
      status: 'Active',
      availability: 5,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      fromTime: '09:00 AM',
      toTime: '05:00 PM',
    },
    {
      name: 'Gas Chromatograph (GC-FID / GC-MS)',
      code: 'AST-1002',
      status: 'Active',
      availability: 6,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      fromTime: '09:00 AM',
      toTime: '06:00 PM',
    },
    {
      name: 'Laser Particle Size Analyzer',
      code: 'AST-1003',
      status: 'Active',
      availability: 5,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      fromTime: '08:30 AM',
      toTime: '04:30 PM',
    },
    {
      name: 'Walk-in Fume Hood (Ducted, Scrubber-Connected)',
      code: 'AST-1004',
      status: 'Active',
      availability: 7,
      availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      fromTime: '09:00 AM',
      toTime: '05:00 PM',
    },
    {
      name: 'Agitated Nutsche Filter Dryer (ANFD)',
      code: 'AST-1005',
      status: 'Active',
      availability: 5,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      fromTime: '10:00 AM',
      toTime: '06:00 PM',
    },
    {
      name: 'Karl Fischer Titrator',
      code: 'AST-1006',
      status: 'Active',
      availability: 7,
      availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      fromTime: '08:00 AM',
      toTime: '08:00 PM',
    },
  ];

  showFilter = false;

  keyword = '';

  status = '';

  searchKeyword = '';

  searchStatus = '';

  pageIndex = 0;

  pageSize = 10;

  get filteredAssets(): Asset[] {
    return this.assets.filter((asset) => {
      const keywordMatches =
        !this.searchKeyword ||
        asset.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        asset.code.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || asset.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedAssets(): Asset[] {
    const startIndex = this.pageIndex * this.pageSize;

    return this.filteredAssets.slice(startIndex, startIndex + this.pageSize);
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
    const dialogRef = this.dialog.open(AddAssetComponent, {
      width: '900px',
      minWidth: '650px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.AssetName) {
        this.assets.unshift({
          name: result.AssetName,
          code: result.AssetCode || `AST-${1000 + this.assets.length + 1}`,
          status: 'Active',
          availability: 5,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          fromTime: '09:00 AM',
          toTime: '05:00 PM',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    const dialogRef = this.dialog.open(AddAssetComponent, {
      width: '800px',
      minWidth: '650px',
      data: {
        mode: 'edit',
        AssetName: asset.name,
        AssetCode: asset.code,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        asset.name = result.AssetName || asset.name;
        asset.code = result.AssetCode || asset.code;
      }
    });
  }

  onDelete(asset: Asset): void {
    this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'edit',
        AssetName: asset.name,
        AssetCode: asset.code,
      },
    });
  }

  // onStatusChange(asset: Asset): void {
  //   console.log('Change status:', asset);
  // }

  onStatusChange(asset: Asset): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to change the status?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        asset.status = asset.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }

  openAvailabilityPop(asset: Asset): void {
    const dialogRef = this.dialog.open(AvailabilityPopComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: {
        name: asset.name,
        code: asset.code,
        availability: asset.availability,
        availableDays: asset.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        fromTime: asset.fromTime,
        toTime: asset.toTime,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        asset.availability = result.availability;
        asset.availableDays = result.availableDays;
        if (result.fromTime) asset.fromTime = result.fromTime;
        if (result.toTime) asset.toTime = result.toTime;
      }
    });
  }
}

