import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddJobCodeComponent } from './add-job-code/add-job-code.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  narration: string;
  description: string;
  hourlyRate: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-job-codes',
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './job-codes.component.html',
  styleUrl: './job-codes.component.scss',
})
export class JobCodesComponent {
  constructor(private dialog: MatDialog) {}
  readonly items: MasterItem[] = [
    { name: 'Plant Operator', code: 'MFG01', narration: 'Plant Operator', description: 'Plant Operator', hourlyRate: 350, status: 'Active' },
    { name: 'Production Executive', code: 'MFG02', narration: 'Production Executive', description: 'Production Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Production Supervisor', code: 'MFG03', narration: 'Production Supervisor', description: 'Production Supervisor', hourlyRate: 650, status: 'Active' },
    { name: 'Production Manager', code: 'MFG04', narration: 'Production Manager', description: 'Production Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'Reactor Operator', code: 'REAC01', narration: 'Reactor Operator', description: 'Reactor Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Distillation Operator', code: 'DIST01', narration: 'Distillation Operator', description: 'Distillation Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Crystallization and Filtration Operator', code: 'CRY01', narration: 'Crystallization and Filtration Operator', description: 'Crystallization and Filtration Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Polymerization Operator', code: 'POLY01', narration: 'Polymerization Operator', description: 'Polymerization Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Blending and Formulation Operator', code: 'BLD01', narration: 'Blending and Formulation Operator', description: 'Blending and Formulation Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Drum and Bag Packing Operator', code: 'PKG01', narration: 'Drum and Bag Packing Operator', description: 'Drum and Bag Packing Operator', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Assurance Executive', code: 'QA01', narration: 'Quality Assurance Executive', description: 'Quality Assurance Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Assurance Officer', code: 'QA02', narration: 'Quality Assurance Officer', description: 'Quality Assurance Officer', hourlyRate: 450, status: 'Active' },
    { name: 'Quality Assurance Manager', code: 'QA03', narration: 'Quality Assurance Manager', description: 'Quality Assurance Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'In-Process Quality Assurance Executive', code: 'IPQA01', narration: 'In-Process Quality Assurance Executive', description: 'In-Process Quality Assurance Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Management System Executive', code: 'QMS01', narration: 'Quality Management System Executive', description: 'Quality Management System Executive', hourlyRate: 550, status: 'Active' },
    { name: 'Quality Documentation Executive', code: 'DOC01', narration: 'Quality Documentation Executive', description: 'Quality Documentation Executive', hourlyRate: 400, status: 'Active' },
    { name: 'Process Validation Executive', code: 'VAL01', narration: 'Process Validation Executive', description: 'Process Validation Executive', hourlyRate: 650, status: 'Active' },
    { name: 'ISO / Responsible Care Audit Executive', code: 'AUD01', narration: 'ISO / Responsible Care Audit Executive', description: 'ISO / Responsible Care Audit Executive', hourlyRate: 700, status: 'Active' },
    { name: 'Deviation and CAPA Executive', code: 'DEV01', narration: 'Deviation and CAPA Executive', description: 'Deviation and CAPA Executive', hourlyRate: 550, status: 'Active' },
    { name: 'Batch Release Officer', code: 'BREL01', narration: 'Batch Release Officer', description: 'Batch Release Officer', hourlyRate: 600, status: 'Active' },
    { name: 'Quality Control Analyst', code: 'QC01', narration: 'Quality Control Analyst', description: 'Quality Control Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Quality Control Executive', code: 'QC02', narration: 'Quality Control Executive', description: 'Quality Control Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Control Manager', code: 'QC03', narration: 'Quality Control Manager', description: 'Quality Control Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'Chromatography (GC / HPLC) Analyst', code: 'CHRO01', narration: 'Chromatography (GC / HPLC) Analyst', description: 'Chromatography (GC / HPLC) Analyst', hourlyRate: 550, status: 'Active' },
    { name: 'Spectroscopy (FTIR / NMR) Analyst', code: 'SPEC01', narration: 'Spectroscopy (FTIR / NMR) Analyst', description: 'Spectroscopy (FTIR / NMR) Analyst', hourlyRate: 550, status: 'Active' },
    { name: 'Storage Stability Testing Analyst', code: 'STAB01', narration: 'Storage Stability Testing Analyst', description: 'Storage Stability Testing Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Raw Material Testing Analyst', code: 'RMQC01', narration: 'Raw Material Testing Analyst', description: 'Raw Material Testing Analyst', hourlyRate: 400, status: 'Active' },
    { name: 'Finished Product Testing Analyst', code: 'FPQC01', narration: 'Finished Product Testing Analyst', description: 'Finished Product Testing Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Wet Chemistry and Titration Analyst', code: 'WET01', narration: 'Wet Chemistry and Titration Analyst', description: 'Wet Chemistry and Titration Analyst', hourlyRate: 500, status: 'Active' },
    { name: 'Effluent and Stack Emission Monitoring Analyst', code: 'EM01', narration: 'Effluent and Stack Emission Monitoring Analyst', description: 'Effluent and Stack Emission Monitoring Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Process Water and ETP Testing Analyst', code: 'WAT01', narration: 'Process Water and ETP Testing Analyst', description: 'Process Water and ETP Testing Analyst', hourlyRate: 400, status: 'Active' },
    { name: 'Process Safety Engineer', code: 'PSE01', narration: 'Process Safety Engineer', description: 'Process Safety Engineer', hourlyRate: 750, status: 'Active' },
    { name: 'Engineering Executive', code: 'ENG01', narration: 'Engineering Executive', description: 'Engineering Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Engineering Manager', code: 'ENG02', narration: 'Engineering Manager', description: 'Engineering Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'Mechanical Maintenance Technician', code: 'MECH01', narration: 'Mechanical Maintenance Technician', description: 'Mechanical Maintenance Technician', hourlyRate: 400, status: 'Active' },
    { name: 'Electrical Technician', code: 'ELEC01', narration: 'Electrical Technician', description: 'Electrical Technician', hourlyRate: 400, status: 'Active' },
    { name: 'Fume Extraction and Scrubber Technician', code: 'HVAC01', narration: 'Fume Extraction and Scrubber Technician', description: 'Fume Extraction and Scrubber Technician', hourlyRate: 450, status: 'Active' },
    { name: 'Utilities Operator (Boiler, Chiller, Compressed Air)', code: 'UTIL01', narration: 'Utilities Operator (Boiler, Chiller, Compressed Air)', description: 'Utilities Operator (Boiler, Chiller, Compressed Air)', hourlyRate: 350, status: 'Active' },
    { name: 'Instrumentation and DCS Technician', code: 'INST01', narration: 'Instrumentation and DCS Technician', description: 'Instrumentation and DCS Technician', hourlyRate: 500, status: 'Active' },
    { name: 'Calibration Technician', code: 'CAL01', narration: 'Calibration Technician', description: 'Calibration Technician', hourlyRate: 450, status: 'Active' },
    { name: 'Commissioning and Qualification Engineer', code: 'CQV01', narration: 'Commissioning and Qualification Engineer', description: 'Commissioning and Qualification Engineer', hourlyRate: 750, status: 'Active' },
    { name: 'Warehouse Executive', code: 'WH01', narration: 'Warehouse Executive', description: 'Warehouse Executive', hourlyRate: 350, status: 'Active' },
    { name: 'Warehouse Supervisor', code: 'WH02', narration: 'Warehouse Supervisor', description: 'Warehouse Supervisor', hourlyRate: 450, status: 'Active' },
    { name: 'Warehouse Manager', code: 'WH03', narration: 'Warehouse Manager', description: 'Warehouse Manager', hourlyRate: 800, status: 'Active' },
    { name: 'Raw Material Storekeeper', code: 'RM01', narration: 'Raw Material Storekeeper', description: 'Raw Material Storekeeper', hourlyRate: 300, status: 'Active' },
    { name: 'Hazardous Materials Storekeeper', code: 'HZ01', narration: 'Hazardous Materials Storekeeper', description: 'Hazardous Materials Storekeeper', hourlyRate: 300, status: 'Active' },
    { name: 'Finished Goods Executive', code: 'FG01', narration: 'Finished Goods Executive', description: 'Finished Goods Executive', hourlyRate: 350, status: 'Active' },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredItems(): MasterItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.narration.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): MasterItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
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
    this.dialog.open(AddJobCodeComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    this.dialog.open(AddJobCodeComponent, {
      width: '800px',
      data: { mode: 'edit', ...item },
    });
  }

  onDelete(item: MasterItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: MasterItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
