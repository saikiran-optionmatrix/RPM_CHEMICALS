import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddRequisitionComponent } from './add-requisition/add-requisition.component';
import { MaterialTimelineComponent } from './material-timeline/material-timeline.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';

export interface ProjectMaterial {
  stage: string;
  module: string;
  task: string;
  itemName: string;
  quantity: number;
  unitRate: number;
  materialCost: number;
  remarks: string;
  targetDate: string;
  requestedBy: string;
  requestDate: string;
  available: boolean;
  reserved: boolean;
  requestedQuantity: number;
  issuedQuantity: number;
  issued: boolean;
  issueDate: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-materials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './project-materials.component.html',
  styleUrl: './project-materials.component.scss'
})
export class ProjectMaterialsComponent implements OnInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  displayedRows: ProjectMaterial[] = [];

  isTemplate: boolean = false;
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isTemplate = params['isTemplate'] === 'true' || params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' || params['fromTemplate'] === true;
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.loadData();
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    this.displayedRows.forEach((row, idx) => {
      if (!row.updatedDate) {
        row.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!row.updatedBy) {
        row.updatedBy = row.requestedBy || 'Dr. Sarah Jenkins';
      }
    });
  }

  loadData(): void {
    this.displayedRows = [
  {
    "stage": "S1 - Opportunity Identification",
    "module": "Competitor Grade & Market Analysis",
    "task": "Benchmark Grade Characterization",
    "itemName": "Benchmark Acrylic Emulsion Samples (200 kg lots)",
    "quantity": 50,
    "unitRate": 450,
    "materialCost": 22500,
    "remarks": "Imported benchmark lots for comparative profiling",
    "targetDate": "15-Jan-2026",
    "requestedBy": "Dr. Priya Raman",
    "requestDate": "05-Jan-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 50,
    "issuedQuantity": 50,
    "issued": true,
    "issueDate": "10-Jan-2026"
  },
  {
    "stage": "S3 - Route Scouting & Lab Synthesis",
    "module": "Surfactant & Monomer Sourcing",
    "task": "Surfactant Screening",
    "itemName": "Anionic and Non-Ionic Surfactants",
    "quantity": 200,
    "unitRate": 320,
    "materialCost": 64000,
    "remarks": "Pre-emulsion stabilization packages from 2 suppliers",
    "targetDate": "10-Feb-2026",
    "requestedBy": "Anita Desai",
    "requestDate": "26-Jan-2026",
    "available": false,
    "reserved": false,
    "requestedQuantity": 200,
    "issuedQuantity": 0,
    "issued": false,
    "issueDate": ""
  },
  {
    "stage": "S3 - Route Scouting & Lab Synthesis",
    "module": "Catalyst / Initiator Qualification",
    "task": "Initiator System Compatibility Study",
    "itemName": "Persulfate and Redox Initiator Samples",
    "quantity": 25,
    "unitRate": 580,
    "materialCost": 14500,
    "remarks": "KPS, APS, and t-BHP/NaMBS redox couples",
    "targetDate": "15-Feb-2026",
    "requestedBy": "Anita Desai",
    "requestDate": "28-Jan-2026",
    "available": false,
    "reserved": false,
    "requestedQuantity": 25,
    "issuedQuantity": 0,
    "issued": false,
    "issueDate": ""
  },
  {
    "stage": "S4 - Process Optimization (Lab Scale)",
    "module": "Lab Scale Trials",
    "task": "Lab-Scale 2 L Polymerization Batches",
    "itemName": "Butyl Acrylate and Methyl Methacrylate Monomers",
    "quantity": 100,
    "unitRate": 220,
    "materialCost": 22000,
    "remarks": "Polymerization grade monomers (>99.5% purity)",
    "targetDate": "05-Mar-2026",
    "requestedBy": "Rajesh Kumar",
    "requestDate": "26-Feb-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 100,
    "issuedQuantity": 100,
    "issued": true,
    "issueDate": "01-Mar-2026"
  },
  {
    "stage": "S4 - Process Optimization (Lab Scale)",
    "module": "Analytical Development",
    "task": "Film Property Testing",
    "itemName": "Calibration Standards and Test Panels",
    "quantity": 10,
    "unitRate": 1500,
    "materialCost": 15000,
    "remarks": "ASTM D2354 MFFT calibration standards and drawdown panels",
    "targetDate": "20-Mar-2026",
    "requestedBy": "Amit Patel",
    "requestDate": "05-Mar-2026",
    "available": false,
    "reserved": false,
    "requestedQuantity": 10,
    "issuedQuantity": 0,
    "issued": false,
    "issueDate": ""
  },
  {
    "stage": "S4 - Process Optimization (Lab Scale)",
    "module": "Process Development",
    "task": "Feed Profile Optimization",
    "itemName": "Dosing Pump Tubing, Seals and Filter Bags",
    "quantity": 150,
    "unitRate": 180,
    "materialCost": 27000,
    "remarks": "PTFE metering pump diaphragms and 25 micron filter media",
    "targetDate": "25-Mar-2026",
    "requestedBy": "Priya Reddy",
    "requestDate": "10-Mar-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 150,
    "issuedQuantity": 75,
    "issued": true,
    "issueDate": "18-Mar-2026"
  },
  {
    "stage": "S3 - Route Scouting & Lab Synthesis",
    "module": "Raw Material Sourcing",
    "task": "Monomer Inhibitor Removal Trials",
    "itemName": "Inhibitor Removal Resin and Adsorbents",
    "quantity": 20,
    "unitRate": 750,
    "materialCost": 15000,
    "remarks": "Ion exchange columns for MEHQ removal",
    "targetDate": "12-Feb-2026",
    "requestedBy": "Anita Desai",
    "requestDate": "01-Feb-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 20,
    "issuedQuantity": 20,
    "issued": true,
    "issueDate": "08-Feb-2026"
  },
  {
    "stage": "S4 - Process Optimization (Lab Scale)",
    "module": "Lab Scale Trials",
    "task": "Residual Monomer Reduction",
    "itemName": "Chaser Initiator and Biocide Samples",
    "quantity": 30,
    "unitRate": 620,
    "materialCost": 18600,
    "remarks": "In-can preservative (BIT/MIT blend) and redox chasers",
    "targetDate": "15-Apr-2026",
    "requestedBy": "Rajesh Kumar",
    "requestDate": "20-Mar-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 30,
    "issuedQuantity": 15,
    "issued": true,
    "issueDate": "28-Mar-2026"
  },
  {
    "stage": "S4 - Process Optimization (Lab Scale)",
    "module": "Analytical Development",
    "task": "Particle Size Control Study",
    "itemName": "Light Scattering Cuvettes and Reference Latex Standards",
    "quantity": 50,
    "unitRate": 310,
    "materialCost": 15500,
    "remarks": "Polystyrene nanosphere reference standards (100 nm, 150 nm)",
    "targetDate": "10-Apr-2026",
    "requestedBy": "Amit Patel",
    "requestDate": "15-Mar-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 50,
    "issuedQuantity": 50,
    "issued": true,
    "issueDate": "22-Mar-2026"
  },
  {
    "stage": "S4 - Process Optimization (Lab Scale)",
    "module": "Process Development",
    "task": "Storage Stability Screening",
    "itemName": "Sample Bottles and Freeze-Thaw Chambers Consumables",
    "quantity": 100,
    "unitRate": 120,
    "materialCost": 12000,
    "remarks": "HDPE sample containers and freeze-thaw racks",
    "targetDate": "18-Apr-2026",
    "requestedBy": "Dr. Priya Raman",
    "requestDate": "25-Mar-2026",
    "available": true,
    "reserved": true,
    "requestedQuantity": 100,
    "issuedQuantity": 60,
    "issued": true,
    "issueDate": "02-Apr-2026"
  }
];

    this.displayedRows.forEach((row, idx) => {
      if (!row.historyCount) {
        row.historyCount = (idx % 10) + 1;
      }
    });
  }





  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  openTimelineModal(item: ProjectMaterial): void {
    this.dialog.open(MaterialTimelineComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: item
    });
  }

  addMaterial(): void {
    const dialogRef = this.dialog.open(AddRequisitionComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: ProjectMaterial | undefined) => {
      if (res) {
        this.displayedRows.unshift(res);
      }
    });
  }

  editMaterial(row: ProjectMaterial): void {
    const dialogRef = this.dialog.open(AddRequisitionComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: row
    });

    dialogRef.afterClosed().subscribe((res: ProjectMaterial | undefined) => {
      if (res) {
        Object.assign(row, res);
      }
    });
  }

  deleteMaterial(row: ProjectMaterial): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this Material Requisition?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.displayedRows = this.displayedRows.filter(r => r !== row);
      }
    });
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  openHistory(item?: any): void {
    const itemName = (typeof item === 'object' && item !== null) ? (item.itemName || '') : (typeof item === 'string' ? item : '');
    this.router.navigate(['/projects/dashboard/materials/history'], {
      queryParams: {
        itemName: itemName,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
