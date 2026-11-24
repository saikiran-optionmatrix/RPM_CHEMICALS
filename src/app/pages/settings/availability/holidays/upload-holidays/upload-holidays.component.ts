import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ParsedHoliday {
  date: string;
  description: string;
}

@Component({
  selector: 'app-upload-holidays',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './upload-holidays.component.html',
  styleUrl: './upload-holidays.component.scss',
})
export class UploadHolidaysComponent {
  selectedFile: File | null = null;
  parsedHolidays: ParsedHoliday[] = [];
  errorMessage = '';

  constructor(private dialogRef: MatDialogRef<UploadHolidaysComponent>) {}

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    this.errorMessage = '';
    this.parsedHolidays = [];

    if (!file) {
      this.selectedFile = null;
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.errorMessage = 'Please select a valid CSV (.csv) file.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text: string = e.target.result;
      this.parseCSV(text);
    };
    reader.onerror = () => {
      this.errorMessage = 'Failed to read the file.';
    };
    reader.readAsText(file);
  }

  parseCSV(csvText: string): void {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      this.errorMessage = 'The selected file is empty.';
      return;
    }

    const holidays: ParsedHoliday[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const row = this.parseCSVLine(line);
      if (row.length < 2) continue;

      const col0 = row[0].trim();
      const col1 = row[1].trim();

      // Skip header if it contains date or desc
      if (i === 0 && (col0.toLowerCase().includes('date') || col1.toLowerCase().includes('desc'))) {
        continue;
      }

      if (col0 && col1) {
        holidays.push({
          date: col0,
          description: col1,
        });
      }
    }

    if (holidays.length === 0) {
      this.errorMessage = 'No valid holiday records found. Ensure CSV has Date and Description columns.';
    } else {
      this.parsedHolidays = holidays;
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  }

  downloadSample(): void {
    const sample =
      'Date,Description\r\n2026-01-01,New Year\'s Day\r\n2026-01-26,Republic Day\r\n2026-08-15,Independence Day\r\n2026-10-02,Gandhi Jayanti\r\n2026-12-25,Christmas Day';
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'holidays_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  upload(): void {
    if (this.parsedHolidays.length > 0) {
      this.dialogRef.close(this.parsedHolidays);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

