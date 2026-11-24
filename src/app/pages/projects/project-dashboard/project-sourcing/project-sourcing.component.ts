import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { AddSourcingComponent } from './add-sourcing/add-sourcing.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface SourcingItem {
  id?: number;
  serial: number;
  itemCode: string;
  itemCategory: string;
  itemName: string;
  itemType: string;
  devQuantity: number;
  specs: string;
  dmf: string;
  vendorQualification: string;
  projectedEbQuantity: number;
  purchasedQuantity: number;
  issuedQuantity: number;
  stockAvailable: number;
  unit: string;
  unitRate: number;
  usage: number;
  shortfall?: number;
}

@Component({
  selector: 'app-project-sourcing',
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
  templateUrl: './project-sourcing.component.html',
  styleUrl: './project-sourcing.component.scss',
})
export class ProjectSourcingComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

  // Table Data (20 records populated from Master Data: Material Code, Material Group, Material Name, Material Type)
  sourcingList: SourcingItem[] = [
  {
    "id": 1,
    "serial": 1,
    "itemCode": "CHM-RM-1001",
    "itemCategory": "Raw Materials",
    "itemName": "Butyl Acrylate (BA Monomer, 99.5%)",
    "itemType": "Monomer",
    "devQuantity": 150,
    "specs": "Tech Grade, GC Purity > 99.5%, Inhibitor MEHQ 15-20 ppm",
    "dmf": "2",
    "vendorQualification": "5/7",
    "projectedEbQuantity": 12000,
    "purchasedQuantity": 14000,
    "issuedQuantity": 11500,
    "stockAvailable": 2500,
    "unit": "Kg",
    "unitRate": 145,
    "usage": 11500
  },
  {
    "id": 2,
    "serial": 2,
    "itemCode": "CHM-RM-1002",
    "itemCategory": "Raw Materials",
    "itemName": "Methyl Methacrylate (MMA Monomer, 99.8%)",
    "itemType": "Monomer",
    "devQuantity": 120,
    "specs": "High Purity Grade, GC Purity > 99.8%, MEHQ 10-15 ppm",
    "dmf": "2",
    "vendorQualification": "6/7",
    "projectedEbQuantity": 9500,
    "purchasedQuantity": 11000,
    "issuedQuantity": 9000,
    "stockAvailable": 2000,
    "unit": "Kg",
    "unitRate": 160,
    "usage": 9000
  },
  {
    "id": 3,
    "serial": 3,
    "itemCode": "CHM-RM-1003",
    "itemCategory": "Raw Materials",
    "itemName": "Methacrylic Acid (MAA, 99.0%)",
    "itemType": "Functional Monomer",
    "devQuantity": 20,
    "specs": "Glacial Grade, Assay > 99.0%, Crosslinking component",
    "dmf": "1",
    "vendorQualification": "4/7",
    "projectedEbQuantity": 1200,
    "purchasedQuantity": 1500,
    "issuedQuantity": 1100,
    "stockAvailable": 400,
    "unit": "Kg",
    "unitRate": 220,
    "usage": 1100
  },
  {
    "id": 4,
    "serial": 4,
    "itemCode": "CHM-RM-1004",
    "itemCategory": "Raw Materials",
    "itemName": "Sodium Lauryl Sulfate (SLS, 28% aqueous)",
    "itemType": "Surfactant",
    "devQuantity": 40,
    "specs": "Anionic surfactant, active matter 28 +/- 1%",
    "dmf": "3",
    "vendorQualification": "5/7",
    "projectedEbQuantity": 2400,
    "purchasedQuantity": 3000,
    "issuedQuantity": 2200,
    "stockAvailable": 800,
    "unit": "Kg",
    "unitRate": 85,
    "usage": 2200
  },
  {
    "id": 5,
    "serial": 5,
    "itemCode": "CHM-RM-1005",
    "itemCategory": "Raw Materials",
    "itemName": "Ethoxylated Fatty Alcohol Surfactant",
    "itemType": "Surfactant",
    "devQuantity": 30,
    "specs": "Non-ionic surfactant, 30 moles EO, HLB 16.5",
    "dmf": "2",
    "vendorQualification": "5/7",
    "projectedEbQuantity": 1800,
    "purchasedQuantity": 2200,
    "issuedQuantity": 1750,
    "stockAvailable": 450,
    "unit": "Kg",
    "unitRate": 195,
    "usage": 1750
  },
  {
    "id": 6,
    "serial": 6,
    "itemCode": "CHM-RM-1006",
    "itemCategory": "Catalyst / Initiator",
    "itemName": "Potassium Persulfate (KPS, 99.0%)",
    "itemType": "Thermal Initiator",
    "devQuantity": 15,
    "specs": "Free-flowing crystals, Active Oxygen > 5.8%",
    "dmf": "2",
    "vendorQualification": "4/7",
    "projectedEbQuantity": 650,
    "purchasedQuantity": 800,
    "issuedQuantity": 600,
    "stockAvailable": 200,
    "unit": "Kg",
    "unitRate": 310,
    "usage": 600
  },
  {
    "id": 7,
    "serial": 7,
    "itemCode": "CHM-RM-1007",
    "itemCategory": "Catalyst / Initiator",
    "itemName": "tert-Butyl Hydroperoxide (t-BHP, 70% aqueous)",
    "itemType": "Redox Chaser",
    "devQuantity": 10,
    "specs": "Oxidizing chaser component for residual monomer destruction",
    "dmf": "1",
    "vendorQualification": "4/7",
    "projectedEbQuantity": 350,
    "purchasedQuantity": 450,
    "issuedQuantity": 320,
    "stockAvailable": 130,
    "unit": "Kg",
    "unitRate": 480,
    "usage": 320
  },
  {
    "id": 8,
    "serial": 8,
    "itemCode": "CHM-RM-1008",
    "itemCategory": "Additive",
    "itemName": "Isothiazolinone Preservative (BIT/MIT)",
    "itemType": "Biocide",
    "devQuantity": 5,
    "specs": "In-can biocide broad spectrum antimicrobial formulation",
    "dmf": "2",
    "vendorQualification": "6/7",
    "projectedEbQuantity": 280,
    "purchasedQuantity": 350,
    "issuedQuantity": 260,
    "stockAvailable": 90,
    "unit": "Kg",
    "unitRate": 920,
    "usage": 260
  },
  {
    "id": 9,
    "serial": 9,
    "itemCode": "CHM-PM-2001",
    "itemCategory": "Packaging Material",
    "itemName": "200 L Tight-Head Composite Plastic Drum",
    "itemType": "Packaging",
    "devQuantity": 10,
    "specs": "UN rated 1H1/Y1.8/100, food grade HDPE inner liner",
    "dmf": "1",
    "vendorQualification": "5/7",
    "projectedEbQuantity": 450,
    "purchasedQuantity": 500,
    "issuedQuantity": 420,
    "stockAvailable": 80,
    "unit": "Nos",
    "unitRate": 1850,
    "usage": 420
  },
  {
    "id": 10,
    "serial": 10,
    "itemCode": "CHM-PM-2002",
    "itemCategory": "Packaging Material",
    "itemName": "1,000 L Intermediate Bulk Container (IBC)",
    "itemType": "Packaging",
    "devQuantity": 2,
    "specs": "UN rated composite IBC, steel tubular cage, bottom valve",
    "dmf": "1",
    "vendorQualification": "5/7",
    "projectedEbQuantity": 80,
    "purchasedQuantity": 100,
    "issuedQuantity": 75,
    "stockAvailable": 25,
    "unit": "Nos",
    "unitRate": 11500,
    "usage": 75
  }
];

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 20;
  pageSizeOptions: number[] = [5, 10, 20, 50];


  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      };
      if (params['name']) this.projectName = params['name'];
      if (params['code']) this.projectCode = params['code'];
    });
  }

  get paginatedSourcing(): SourcingItem[] {
    const start = this.pageIndex * this.pageSize;
    return this.sourcingList.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getShortfall(row: SourcingItem): string | number {
    if (row.shortfall !== undefined && row.shortfall !== null) {
      return row.shortfall;
    }
    const issued = Number(row.issuedQuantity) || 0;
    const usage = Number(row.usage) || 0;
    const diff = issued - usage;
    return diff >= 0 ? diff : 0;
  }

  getUsageClass(row: SourcingItem): string {
    return Number(row.usage) === Number(row.issuedQuantity) ? 'usage-equal' : 'usage-less';
  }

  // Scrolling logic matching ProjectStagesComponent
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

  // Navigation logic
  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: {
        code: this.projectCode || '2026/CHM/006',
        name: this.projectName || 'Acrylic Emulsion Binder 50% Solids'
      }
    });
  }

  navigateToUsage(item: SourcingItem): void {
    this.router.navigate(['/projects/dashboard/sourcing/usage'], {
      queryParams: {
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemCategory: item.itemCategory,
        itemType: item.itemType,
        unit: item.unit,
        stockAvailable: item.stockAvailable,
        usage: item.usage,
        purchasedQuantity: item.purchasedQuantity,
        issuedQuantity: item.issuedQuantity,
        name: this.projectName,
        code: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  navigateToVendorQualification(item: SourcingItem): void {
    this.router.navigate(['/projects/dashboard/sourcing/vendor-qualification'], {
      queryParams: {
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemCategory: item.itemCategory,
        itemType: item.itemType,
        vendorQualification: item.vendorQualification,
        name: this.projectName,
        code: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  // Dialog actions
  openAddSourcing(): void {
    const dialogRef = this.dialog.open(AddSourcingComponent, {
      width: '880px',
      maxWidth: '95vw',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const nextSerial = this.sourcingList.length + 1;
        const newItem: SourcingItem = {
          ...res,
          id: Date.now(),
          serial: nextSerial,
          itemCode: res.itemCode || `1010${1000 + nextSerial}`,
          dmf: res.dmf || 'View / Update',
          vendorQualification: res.vendorQualification || '3/7',
          issuedQuantity: res.purchasedQuantity && res.stockAvailable
            ? Math.max(0, Number(res.purchasedQuantity) - Number(res.stockAvailable))
            : (res.issuedQuantity || 0)
        };
        this.sourcingList.push(newItem);
      }
    });
  }

  openEditSourcing(item: SourcingItem): void {
    const dialogRef = this.dialog.open(AddSourcingComponent, {
      width: '880px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        item: { ...item }
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const index = this.sourcingList.findIndex((x) => x.id === item.id || x.serial === item.serial);
        if (index > -1) {
          this.sourcingList[index] = {
            ...this.sourcingList[index],
            ...res
          };
        }
      }
    });
  }

  deleteSourcing(item: SourcingItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '380px',
      data: {
        title: 'Delete Sourcing Item',
        itemName: item.itemName,
        itemCode: item.itemCode
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sourcingList = this.sourcingList.filter((x) => x !== item);
        // Re-index serials
        this.sourcingList.forEach((it, idx) => (it.serial = idx + 1));
      }
    });
  }

  openDmfModal(item: SourcingItem): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: `Technical & REACH Dossier — ${item.itemName} (${item.itemCode})`,
        documents: [
          { title: `${item.itemName.replace(/\s+/g, '_')}_Technical_Data_Sheet_TDS.pdf`, url: 'sample.pdf' },
          { title: `${item.itemName.replace(/\s+/g, '_')}_REACH_Registration_Dossier.pdf`, url: 'sample.pdf' },
          { title: `${item.itemName.replace(/\s+/g, '_')}_GHS_Safety_Data_Sheet_SDS.pdf`, url: 'sample.pdf' }
        ]
      }
    });
  }

  openVendorQualificationModal(item: SourcingItem): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: `Vendor Qualification — ${item.itemName} (${item.itemCode})`,
        documents: [
          { title: `${item.itemName.replace(/\s+/g, '_')}_ISO_EHS_Audit_Report.pdf`, url: 'sample.pdf' },
          { title: `${item.itemName.replace(/\s+/g, '_')}_Technical_Quality_Agreement.pdf`, url: 'sample.pdf' },
          { title: `${item.itemName.replace(/\s+/g, '_')}_REACH_Compliance_Certificate.pdf`, url: 'sample.pdf' }
        ]
      }
    });
  }
}
