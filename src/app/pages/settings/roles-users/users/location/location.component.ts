import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface LocationItem {
  sNo: number;
  locationName: string;
  locationCode: string; // Format: LocationCode(CityCode, StateCode) e.g. KPR(HYD, TS)
  city: string;
  state: string;
  selected?: boolean;
}

export type LocationRow = LocationItem;

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent implements OnInit {
  keyword: string = '';
  selectedState: string = '';
  selectedCity: string = '';

  leftPageIndex: number = 0;
  rightPageIndex: number = 0;
  readonly pageSize: number = 4;

  states: string[] = ['Telangana', 'Maharashtra', 'Karnataka', 'Haryana', 'Uttar Pradesh', 'Tamil Nadu'];
  cities: string[] = ['Hyderabad', 'Pune', 'Mumbai', 'Bangalore', 'Gurgaon', 'Noida', 'Chennai'];

  leftColumn: LocationItem[] = [
    { sNo: 1, locationName: 'Kondapur Campus', locationCode: 'KPR(HYD, TS)', city: 'Hyderabad', state: 'Telangana', selected: false },
    { sNo: 2, locationName: 'Madhapur Tech Park', locationCode: 'MDH(HYD, TS)', city: 'Hyderabad', state: 'Telangana', selected: false },
    { sNo: 3, locationName: 'Gachibowli HQ', locationCode: 'GBL(HYD, TS)', city: 'Hyderabad', state: 'Telangana', selected: false },
    { sNo: 4, locationName: 'Hinjewadi Phase 1', locationCode: 'HNJ(PUN, MH)', city: 'Pune', state: 'Maharashtra', selected: false },
    { sNo: 5, locationName: 'Magarpatta City', locationCode: 'MPT(PUN, MH)', city: 'Pune', state: 'Maharashtra', selected: false },
    { sNo: 6, locationName: 'Bandra Kurla Complex', locationCode: 'BKC(MUM, MH)', city: 'Mumbai', state: 'Maharashtra', selected: false },
  ];

  rightColumn: LocationItem[] = [
    { sNo: 7, locationName: 'Andheri East Hub', locationCode: 'ADH(MUM, MH)', city: 'Mumbai', state: 'Maharashtra', selected: false },
    { sNo: 8, locationName: 'Whitefield Campus', locationCode: 'WFD(BLR, KA)', city: 'Bangalore', state: 'Karnataka', selected: false },
    { sNo: 9, locationName: 'Electronic City Phase 2', locationCode: 'ECY(BLR, KA)', city: 'Bangalore', state: 'Karnataka', selected: false },
    { sNo: 10, locationName: 'DLF Cyber City', locationCode: 'DLF(GGN, HR)', city: 'Gurgaon', state: 'Haryana', selected: false },
    { sNo: 11, locationName: 'Noida Sector 62', locationCode: 'S62(NOI, UP)', city: 'Noida', state: 'Uttar Pradesh', selected: false },
    { sNo: 12, locationName: 'Guindy Tech Park', locationCode: 'GDY(CHN, TN)', city: 'Chennai', state: 'Tamil Nadu', selected: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<LocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if (this.data?.locations && Array.isArray(this.data.locations) && this.data.locations.length > 0) {
      const half = Math.ceil(this.data.locations.length / 2);
      this.leftColumn = this.data.locations.slice(0, half);
      this.rightColumn = this.data.locations.slice(half);
    }

    const all = [...this.leftColumn, ...this.rightColumn];
    if (this.data?.user?.location) {
      const parts = this.data.user.location.split('/');
      if (parts.length === 2 && !isNaN(Number(parts[0]))) {
        const count = Number(parts[0]);
        all.forEach((l, idx) => {
          l.selected = idx < count;
        });
      } else {
        const match = all.find(
          (l) => l.locationCode === this.data.user.location || l.locationName === this.data.user.location
        );
        if (match) {
          match.selected = true;
        }
      }
    }
  }

  get paginatedLeftColumn(): LocationItem[] {
    const start = this.leftPageIndex * this.pageSize;
    return this.leftColumn.slice(start, start + this.pageSize);
  }

  get paginatedRightColumn(): LocationItem[] {
    const start = this.rightPageIndex * this.pageSize;
    return this.rightColumn.slice(start, start + this.pageSize);
  }

  handleLeftPage(event: PageEvent): void {
    this.leftPageIndex = event.pageIndex;
  }

  handleRightPage(event: PageEvent): void {
    this.rightPageIndex = event.pageIndex;
  }

  onSearch(): void {
    // Static UI only, no dynamic filtering needed
  }

  onClear(): void {
    this.keyword = '';
    this.selectedState = '';
    this.selectedCity = '';
  }

  toggleAllLeft(checked: boolean): void {
    this.paginatedLeftColumn.forEach((l) => (l.selected = checked));
  }

  isAllLeftSelected(): boolean {
    return this.paginatedLeftColumn.length > 0 && this.paginatedLeftColumn.every((l) => l.selected);
  }

  toggleAllRight(checked: boolean): void {
    this.paginatedRightColumn.forEach((l) => (l.selected = checked));
  }

  isAllRightSelected(): boolean {
    return this.paginatedRightColumn.length > 0 && this.paginatedRightColumn.every((l) => l.selected);
  }

  toggleSelect(loc: LocationItem): void {
    loc.selected = !loc.selected;
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    const all = [...this.leftColumn, ...this.rightColumn];
    const selected = all.filter((l) => l.selected);
    const summary = `${selected.length}/${all.length}`;
    this.dialogRef.close({
      location: summary,
      selectedCount: selected.length,
      totalCount: all.length,
      summary: summary,
    });
  }
}
