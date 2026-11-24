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
  {
    "name": "Plant Operator",
    "code": "MFG01",
    "narration": "Plant Operator",
    "description": "Reaction, separation and plant operations",
    "hourlyRate": 350,
    "status": "Active"
  },
  {
    "name": "Production Executive",
    "code": "MFG02",
    "narration": "Production Executive",
    "description": "Production execution and line oversight",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Production Supervisor",
    "code": "MFG03",
    "narration": "Production Supervisor",
    "description": "Supervising manufacturing shifts and batch records",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "Production Manager",
    "code": "MFG04",
    "narration": "Production Manager",
    "description": "Overall production operations management",
    "hourlyRate": 1000,
    "status": "Active"
  },
  {
    "name": "Reactor Operator",
    "code": "REAC01",
    "narration": "Reactor Operator",
    "description": "Jacketed reactor charge, heating and agitation control",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Distillation Operator",
    "code": "DIST01",
    "narration": "Distillation Operator",
    "description": "Fractional and vacuum distillation unit operations",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Crystallization and Filtration Operator",
    "code": "CRY01",
    "narration": "Crystallization and Filtration Operator",
    "description": "Crystallizer and Nutsche filter/centrifuge operations",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Polymerization Operator",
    "code": "POLY01",
    "narration": "Polymerization Operator",
    "description": "Monomer dosing, polymerization and latex handling",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Blending and Formulation Operator",
    "code": "BLD01",
    "narration": "Blending and Formulation Operator",
    "description": "Chemical blending, dissolution and additive mixing",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Drum and Bag Packing Operator",
    "code": "PKG01",
    "narration": "Drum and Bag Packing Operator",
    "description": "Drum filling, IBC loading and dry powder bagging",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Quality Assurance Executive",
    "code": "QA01",
    "narration": "Quality Assurance Executive",
    "description": "QA compliance and batch documentation review",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Quality Assurance Officer",
    "code": "QA02",
    "narration": "Quality Assurance Officer",
    "description": "In-plant QA monitoring and line clearance",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Quality Assurance Manager",
    "code": "QA03",
    "narration": "Quality Assurance Manager",
    "description": "Head of Quality Assurance and ISO compliance",
    "hourlyRate": 1000,
    "status": "Active"
  },
  {
    "name": "In-Process Quality Assurance Executive",
    "code": "IPQA01",
    "narration": "In-Process Quality Assurance Executive",
    "description": "In-process batch sampling and IPQA verifications",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Quality Management System Executive",
    "code": "QMS01",
    "narration": "Quality Management System Executive",
    "description": "QMS, change control and CAPA management",
    "hourlyRate": 550,
    "status": "Active"
  },
  {
    "name": "Quality Documentation Executive",
    "code": "DOC01",
    "narration": "Quality Documentation Executive",
    "description": "Document control and master formula records",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Process Validation Executive",
    "code": "VAL01",
    "narration": "Process Validation Executive",
    "description": "Process validation and scale-up protocol execution",
    "hourlyRate": 650,
    "status": "Active"
  },
  {
    "name": "ISO / Responsible Care Audit Executive",
    "code": "AUD01",
    "narration": "ISO / Responsible Care Audit Executive",
    "description": "ISO 9001, 14001 and Responsible Care auditing",
    "hourlyRate": 700,
    "status": "Active"
  },
  {
    "name": "Deviation and CAPA Executive",
    "code": "DEV01",
    "narration": "Deviation and CAPA Executive",
    "description": "Investigating deviations and root cause analysis",
    "hourlyRate": 550,
    "status": "Active"
  },
  {
    "name": "Batch Release Officer",
    "code": "BREL01",
    "narration": "Batch Release Officer",
    "description": "Reviewing CoAs and authorizing finished goods dispatch",
    "hourlyRate": 600,
    "status": "Active"
  },
  {
    "name": "Quality Control Analyst",
    "code": "QC01",
    "narration": "Quality Control Analyst",
    "description": "Standard chemical and physical QC testing",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Quality Control Executive",
    "code": "QC02",
    "narration": "Quality Control Executive",
    "description": "QC analytical testing and instrument calibration",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Quality Control Manager",
    "code": "QC03",
    "narration": "Quality Control Manager",
    "description": "Head of Quality Control Laboratory",
    "hourlyRate": 1000,
    "status": "Active"
  },
  {
    "name": "Chromatography (GC / HPLC) Analyst",
    "code": "CHRO01",
    "narration": "Chromatography (GC / HPLC) Analyst",
    "description": "GC-FID, GC-MS and HPLC method execution and analysis",
    "hourlyRate": 550,
    "status": "Active"
  },
  {
    "name": "Spectroscopy (FTIR / NMR) Analyst",
    "code": "SPEC01",
    "narration": "Spectroscopy (FTIR / NMR) Analyst",
    "description": "FTIR, UV-Vis and NMR spectral characterization",
    "hourlyRate": 550,
    "status": "Active"
  },
  {
    "name": "Storage Stability Testing Analyst",
    "code": "STAB01",
    "narration": "Storage Stability Testing Analyst",
    "description": "Accelerated thermal and shelf-life stability monitoring",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Raw Material Testing Analyst",
    "code": "RMQC01",
    "narration": "Raw Material Testing Analyst",
    "description": "Monomer, solvent and catalyst qualification testing",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Finished Product Testing Analyst",
    "code": "FPQC01",
    "narration": "Finished Product Testing Analyst",
    "description": "Finished chemical grade release specification testing",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Wet Chemistry and Titration Analyst",
    "code": "WET01",
    "narration": "Wet Chemistry and Titration Analyst",
    "description": "Acid value, saponification, Karl Fischer water and assays",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Effluent and Stack Emission Monitoring Analyst",
    "code": "EM01",
    "narration": "Effluent and Stack Emission Monitoring Analyst",
    "description": "ETP water, VOC scrubber and stack emissions testing",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Process Water and ETP Testing Analyst",
    "code": "WAT01",
    "narration": "Process Water and ETP Testing Analyst",
    "description": "COD, BOD, TDS and process water monitoring",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Process Safety Engineer",
    "code": "PSE01",
    "narration": "Process Safety Engineer",
    "description": "Reaction calorimetry, HAZOP, LOPA and venting safety",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Engineering Executive",
    "code": "ENG01",
    "narration": "Engineering Executive",
    "description": "Process piping, instrumentation and equipment design",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Engineering Manager",
    "code": "ENG02",
    "narration": "Engineering Manager",
    "description": "Plant engineering and Capex project execution",
    "hourlyRate": 1000,
    "status": "Active"
  },
  {
    "name": "Mechanical Maintenance Technician",
    "code": "MECH01",
    "narration": "Mechanical Maintenance Technician",
    "description": "Pump, seal, agitator and valve maintenance",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Electrical Technician",
    "code": "ELEC01",
    "narration": "Electrical Technician",
    "description": "Flameproof motors, transformers and switchgear maintenance",
    "hourlyRate": 400,
    "status": "Active"
  },
  {
    "name": "Fume Extraction and Scrubber Technician",
    "code": "HVAC01",
    "narration": "Fume Extraction and Scrubber Technician",
    "description": "Scrubber fluid circulation, blowers and duct maintenance",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Utilities Operator (Boiler, Chiller, Compressed Air)",
    "code": "UTIL01",
    "narration": "Utilities Operator",
    "description": "Steam boiler, cooling tower, brine chiller and nitrogen plant",
    "hourlyRate": 350,
    "status": "Active"
  },
  {
    "name": "Instrumentation and DCS Technician",
    "code": "INST01",
    "narration": "Instrumentation and DCS Technician",
    "description": "DCS loop tuning, flowmeters, transmitters and interlocks",
    "hourlyRate": 500,
    "status": "Active"
  },
  {
    "name": "Calibration Technician",
    "code": "CAL01",
    "narration": "Calibration Technician",
    "description": "Weigh bridge, pressure and temperature instrument calibration",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Commissioning and Qualification Engineer",
    "code": "CQV01",
    "narration": "Commissioning and Qualification Engineer",
    "description": "Equipment commissioning, IQ, OQ and PQ qualification",
    "hourlyRate": 750,
    "status": "Active"
  },
  {
    "name": "Warehouse Executive",
    "code": "WH01",
    "narration": "Warehouse Executive",
    "description": "Drum yard and inventory transaction tracking",
    "hourlyRate": 350,
    "status": "Active"
  },
  {
    "name": "Warehouse Supervisor",
    "code": "WH02",
    "narration": "Warehouse Supervisor",
    "description": "Warehouse operations and forklift dispatch supervision",
    "hourlyRate": 450,
    "status": "Active"
  },
  {
    "name": "Warehouse Manager",
    "code": "WH03",
    "narration": "Warehouse Manager",
    "description": "Supply chain inventory and hazardous warehouse head",
    "hourlyRate": 800,
    "status": "Active"
  },
  {
    "name": "Raw Material Storekeeper",
    "code": "RM01",
    "narration": "Raw Material Storekeeper",
    "description": "Receiving raw materials, solvents and segregation",
    "hourlyRate": 300,
    "status": "Active"
  },
  {
    "name": "Hazardous Materials Storekeeper",
    "code": "HZ01",
    "narration": "Hazardous Materials Storekeeper",
    "description": "Flammable, toxic and corrosive chemical storage stewardship",
    "hourlyRate": 300,
    "status": "Active"
  },
  {
    "name": "Finished Goods Executive",
    "code": "FG01",
    "narration": "Finished Goods Executive",
    "description": "Finished chemical inventory and dispatch compliance",
    "hourlyRate": 350,
    "status": "Active"
  }
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
