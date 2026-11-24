import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { AddHolidayComponent } from './add-holiday/add-holiday.component';
import { UploadHolidaysComponent } from './upload-holidays/upload-holidays.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface HolidayItem {
  id: number;
  date: string;
  description: string;
}

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
})
export class HolidaysComponent {
  constructor(private dialog: MatDialog) {}

  holidays: HolidayItem[] = [
    { id: 1, date: '2026-01-01', description: "New Year's Day" },
    { id: 2, date: '2026-01-14', description: 'Pongal / Makar Sankranti' },
    { id: 3, date: '2026-01-26', description: 'Republic Day' },
    { id: 4, date: '2026-03-04', description: 'Maha Shivratri' },
    { id: 5, date: '2026-03-25', description: 'Holi' },
    { id: 6, date: '2026-04-03', description: 'Good Friday' },
    { id: 7, date: '2026-04-14', description: 'Dr. B.R. Ambedkar Jayanti' },
    { id: 8, date: '2026-05-01', description: 'May Day / Labour Day' },
    { id: 9, date: '2026-08-15', description: 'Independence Day' },
    { id: 10, date: '2026-09-04', description: 'Janmashtami' },
    { id: 11, date: '2026-10-02', description: 'Gandhi Jayanti' },
    { id: 12, date: '2026-10-20', description: 'Dussehra (Vijayadashami)' },
    { id: 13, date: '2026-11-08', description: 'Diwali (Deepavali)' },
    { id: 14, date: '2026-12-25', description: 'Christmas Day' },
  ];

  showFilter = false;
  keyword = '';
  searchKeyword = '';

  selectedYear = '';
  searchYear = '';

  pageIndex = 0;
  pageSize = 10;

  get availableYears(): string[] {
    const years = new Set<string>();
    years.add('2025');
    years.add('2026');
    years.add('2027');
    this.holidays.forEach((h) => {
      if (h.date) {
        const y = h.date.substring(0, 4);
        if (y && !isNaN(Number(y))) {
          years.add(y);
        }
      }
    });
    return Array.from(years).sort();
  }

  get filteredHolidays(): HolidayItem[] {
    return this.holidays.filter((h) => {
      const term = this.searchKeyword.toLowerCase();
      const matchesKeyword =
        !this.searchKeyword ||
        h.description.toLowerCase().includes(term) ||
        h.date.toLowerCase().includes(term);

      const matchesYear =
        !this.searchYear ||
        (h.date && h.date.startsWith(this.searchYear));

      return matchesKeyword && matchesYear;
    });
  }

  get paginatedHolidays(): HolidayItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredHolidays.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchYear = this.selectedYear;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedYear = '';
    this.searchKeyword = '';
    this.searchYear = '';
    this.pageIndex = 0;
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddHolidayComponent, {
      width: '550px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.date && res.description) {
        const nextId =
          this.holidays.length > 0 ? Math.max(...this.holidays.map((h) => h.id)) + 1 : 1;
        const newHoliday: HolidayItem = {
          id: nextId,
          date: res.date,
          description: res.description,
        };
        this.holidays = [newHoliday, ...this.holidays];
      }
    });
  }

  onEdit(holiday: HolidayItem): void {
    const dialogRef = this.dialog.open(AddHolidayComponent, {
      width: '550px',
      data: {
        mode: 'edit',
        holiday: { ...holiday },
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.date && res.description) {
        const index = this.holidays.findIndex((h) => h.id === holiday.id);
        if (index > -1) {
          this.holidays[index] = { ...this.holidays[index], ...res };
          this.holidays = [...this.holidays];
        }
      }
    });
  }

  onDelete(holiday: HolidayItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        title: 'Delete Holiday',
        content: `Are you sure you want to delete holiday "${holiday.description}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.holidays = this.holidays.filter((h) => h.id !== holiday.id);
      }
    });
  }

  downloadCSV(): void {
    const headers = ['Date', 'Description'];
    const rows = this.holidays.map((h) => [
      `"${h.date}"`,
      `"${h.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    this.triggerDownload(csvContent, 'holidays.csv');
  }

  downloadTemplate(): void {
    const sampleContent = [
      'Date,Description',
      '2026-01-01,New Year\'s Day',
      '2026-01-26,Republic Day',
      '2026-08-15,Independence Day',
      '2026-10-02,Gandhi Jayanti',
      '2026-12-25,Christmas Day',
    ].join('\r\n');
    this.triggerDownload(sampleContent, 'holidays_template.csv');
  }

  onUploadCSV(): void {
    const dialogRef = this.dialog.open(UploadHolidaysComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((importedList: any) => {
      if (importedList && Array.isArray(importedList) && importedList.length > 0) {
        let currentMaxId =
          this.holidays.length > 0 ? Math.max(...this.holidays.map((h) => h.id)) : 0;
        const newItems: HolidayItem[] = importedList.map((item) => ({
          id: ++currentMaxId,
          date: item.date,
          description: item.description,
        }));
        this.holidays = [...newItems, ...this.holidays];
      }
    });
  }

  private triggerDownload(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
