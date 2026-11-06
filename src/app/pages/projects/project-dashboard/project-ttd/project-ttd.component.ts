import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { RemarksPopComponent } from '../../../../common/shared/remarks-pop/remarks-pop.component';

export interface TtdCheckPoint {
  id: number;
  sNo: string;
  checkPoint: string;
  isGroupHeader?: boolean;
  isGroupPart?: boolean;
  groupSpan?: number;
  status: 'Yes' | 'No' | 'N/A' | null;
  remarks: string;
  documentsCount: number;
  documents?: { id: number; title: string; uploadedDate?: string }[];
}

@Component({
  selector: 'app-project-ttd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './project-ttd.component.html',
  styleUrl: './project-ttd.component.scss'
})
export class ProjectTtdComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Header and Top Information Table fields
  productName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  strength: string = '50% w/w solids';
  market: string = 'India & ASEAN';
  ttdNumber: string = 'TTD/2026/CHM/006';
  versionNumber: string = 'v2.1';

  // Save feedback state
  ttdNumberSaved: boolean = false;
  versionNumberSaved: boolean = false;

  // Check Points Data matching Image 1 and Image 2
  checkPointsList: TtdCheckPoint[] = [
  {
    "id": 1,
    "sNo": "1.",
    "checkPoint": "Title Page",
    "status": "Yes",
    "remarks": "Title page verified with exact product name, grade specifications, and facility codes.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "TTD_Title_Page_Approved.pdf",
        "uploadedDate": "2026-02-10"
      },
      {
        "id": 2,
        "title": "Product_Dossier_Index.pdf",
        "uploadedDate": "2026-02-12"
      }
    ]
  },
  {
    "id": 2,
    "sNo": "2.",
    "checkPoint": "Approval Page",
    "status": "Yes",
    "remarks": "Signed off by Head of Process Chemistry, Tech Transfer Lead, and Plant Operations Head.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "Executed_Signoff_Page.pdf",
        "uploadedDate": "2026-02-14"
      },
      {
        "id": 2,
        "title": "Quality_Approval_Certificate.pdf",
        "uploadedDate": "2026-02-15"
      },
      {
        "id": 3,
        "title": "Steering_Committee_Minutes.pdf",
        "uploadedDate": "2026-02-16"
      }
    ]
  },
  {
    "id": 3,
    "sNo": "3.",
    "checkPoint": "Table of contents",
    "status": "Yes",
    "remarks": "Comprehensive TOC linking all process, safety, engineering and QA sections.",
    "documentsCount": 1,
    "documents": [
      {
        "id": 1,
        "title": "Table_of_Contents_v2.1.pdf",
        "uploadedDate": "2026-02-18"
      }
    ]
  },
  {
    "id": 4,
    "sNo": "4.",
    "checkPoint": "Scope and Process Flow Scheme (Block Flow Diagram)",
    "status": "Yes",
    "remarks": "Reactor train capacities, raw material feed tanks and block flow diagram defined.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Commercial_Process_Scheme_BFD.pdf",
        "uploadedDate": "2026-02-20"
      },
      {
        "id": 2,
        "title": "Scope_Demarcation_Protocol.pdf",
        "uploadedDate": "2026-02-22"
      }
    ]
  },
  {
    "id": 5,
    "sNo": "5.",
    "checkPoint": "Statutory Consents and Hazardous Chemical Permits (CTE / CTO)",
    "status": "Yes",
    "remarks": "State pollution control board Consent to Establish and flammable storage approvals.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "SPCB_Consent_to_Establish.pdf",
        "uploadedDate": "2026-02-25"
      },
      {
        "id": 2,
        "title": "PESO_Monomer_Storage_Permit.pdf",
        "uploadedDate": "2026-02-26"
      },
      {
        "id": 3,
        "title": "Factory_Inspectorate_Approval.pdf",
        "uploadedDate": "2026-02-28"
      },
      {
        "id": 4,
        "title": "Environmental_Clearance_Copy.pdf",
        "uploadedDate": "2026-03-01"
      }
    ]
  },
  {
    "id": 6,
    "sNo": "6.",
    "checkPoint": "Procurement Package (Monomers, Catalysts, Solvents and Packaging)",
    "status": "Yes",
    "remarks": "Vendor qualification audit packages for Butyl Acrylate, MMA, initiators & surfactants.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "Monomer_Vendor_Audit_Package.pdf",
        "uploadedDate": "2026-03-02"
      },
      {
        "id": 2,
        "title": "Surfactant_Supplier_COA_Dossier.pdf",
        "uploadedDate": "2026-03-04"
      },
      {
        "id": 3,
        "title": "Packaging_IBC_Drum_Supplier_Audit.pdf",
        "uploadedDate": "2026-03-05"
      }
    ]
  },
  {
    "id": 7,
    "sNo": "7.",
    "checkPoint": "Technical Grade / Intermediate Specifications and Standard Test Procedures",
    "status": "Yes",
    "remarks": "Pre-emulsion specs, monomer purity limits, and gas chromatography assay methods.",
    "documentsCount": 5,
    "documents": [
      {
        "id": 1,
        "title": "Monomer_Raw_Specifications.pdf",
        "uploadedDate": "2026-03-06"
      },
      {
        "id": 2,
        "title": "STP_GC_Monomer_Purity_Assay.pdf",
        "uploadedDate": "2026-03-08"
      },
      {
        "id": 3,
        "title": "Inhibitor_MEHQ_STP.pdf",
        "uploadedDate": "2026-03-10"
      },
      {
        "id": 4,
        "title": "Initiator_Active_Oxygen_STP.pdf",
        "uploadedDate": "2026-03-12"
      },
      {
        "id": 5,
        "title": "Pre_Emulsion_Stability_STP.pdf",
        "uploadedDate": "2026-03-14"
      }
    ]
  },
  {
    "id": 8,
    "sNo": "8.",
    "checkPoint": "Raw Material Specifications and Standard Test Procedures",
    "status": "Yes",
    "remarks": "Industrial specifications for surfactants, chain transfer agents, and biocides.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Raw_Material_Specifications_Compendium.pdf",
        "uploadedDate": "2026-03-15"
      },
      {
        "id": 2,
        "title": "STP_Surfactant_Release_Testing.pdf",
        "uploadedDate": "2026-03-16"
      },
      {
        "id": 3,
        "title": "Buffer_and_Redox_Agents_Specs.pdf",
        "uploadedDate": "2026-03-18"
      },
      {
        "id": 4,
        "title": "Industrial_Biocide_Preservative_Specs.pdf",
        "uploadedDate": "2026-03-20"
      }
    ]
  },
  {
    "id": 9,
    "sNo": "9.",
    "checkPoint": "Packaging Material (Drum, IBC) Specifications and Standard Test Procedures",
    "status": "Yes",
    "remarks": "UN certified 200 L HDPE drums, 1000 L IBC totes and liner compatibility.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "HDPE_Drum_UN_Certification.pdf",
        "uploadedDate": "2026-03-22"
      },
      {
        "id": 2,
        "title": "IBC_Tote_Specification_STP.pdf",
        "uploadedDate": "2026-03-24"
      },
      {
        "id": 3,
        "title": "GHS_Hazard_Labeling_Specs.pdf",
        "uploadedDate": "2026-03-25"
      }
    ]
  },
  {
    "id": 10,
    "sNo": "10.",
    "checkPoint": "Finished Product Specifications and Standard Test Procedures: In-process, Release and Shelf-life",
    "status": "Yes",
    "remarks": "Solids content (50%), Brookfield viscosity, pH, particle size, and MFFT limits.",
    "documentsCount": 6,
    "documents": [
      {
        "id": 1,
        "title": "Finished_Product_Specifications.pdf",
        "uploadedDate": "2026-03-26"
      },
      {
        "id": 2,
        "title": "In_Process_Polymerization_Checks.pdf",
        "uploadedDate": "2026-03-28"
      },
      {
        "id": 3,
        "title": "STP_Non_Volatile_Solids_Content.pdf",
        "uploadedDate": "2026-03-30"
      },
      {
        "id": 4,
        "title": "STP_Brookfield_Viscosity_Test.pdf",
        "uploadedDate": "2026-04-02"
      },
      {
        "id": 5,
        "title": "STP_Particle_Size_DLS_Analysis.pdf",
        "uploadedDate": "2026-04-04"
      },
      {
        "id": 6,
        "title": "Shelf_Life_Specification_Limits.pdf",
        "uploadedDate": "2026-04-05"
      }
    ]
  },
  {
    "id": 11,
    "sNo": "11.",
    "checkPoint": "Master Batch Manufacturing Instruction (Reaction, Separation and Packing)",
    "status": "Yes",
    "remarks": "Detailed MBMI covering reactor charging, seed addition, dosing profile, and devolatilization.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "MBMI_Reactor_Charge_Seed.pdf",
        "uploadedDate": "2026-04-06"
      },
      {
        "id": 2,
        "title": "MBMI_Monomer_Feed_Control.pdf",
        "uploadedDate": "2026-04-08"
      },
      {
        "id": 3,
        "title": "MBMI_Chaser_Residual_Monomer.pdf",
        "uploadedDate": "2026-04-10"
      },
      {
        "id": 4,
        "title": "MBMI_Authorized_Master.pdf",
        "uploadedDate": "2026-04-12"
      }
    ]
  },
  {
    "id": 12,
    "sNo": "12.",
    "checkPoint": "Master Packaging and Labeling Instruction (GHS / CLP)",
    "status": "Yes",
    "remarks": "Filtration through 100 mesh bag, drum filling line speeds, and GHS label placement.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "MPI_Filtration_Drum_Filling.pdf",
        "uploadedDate": "2026-04-14"
      },
      {
        "id": 2,
        "title": "MPI_IBC_Filling_Automation.pdf",
        "uploadedDate": "2026-04-16"
      },
      {
        "id": 3,
        "title": "GHS_Warning_Label_Placement_SOP.pdf",
        "uploadedDate": "2026-04-18"
      }
    ]
  },
  {
    "id": 13,
    "sNo": "13.",
    "checkPoint": "Storage Stability and Shelf-Life Plan",
    "status": "Yes",
    "remarks": "Accelerated thermal storage at 50°C (3 months) and ambient 12-month retention plan.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Thermal_Stability_Protocol.pdf",
        "uploadedDate": "2026-04-20"
      },
      {
        "id": 2,
        "title": "Freeze_Thaw_Resistance_Study.pdf",
        "uploadedDate": "2026-04-22"
      },
      {
        "id": 3,
        "title": "Viscosity_Drift_Monitoring_Log.pdf",
        "uploadedDate": "2026-04-24"
      },
      {
        "id": 4,
        "title": "Long_Term_Storage_Validation.pdf",
        "uploadedDate": "2026-04-25"
      }
    ]
  },
  {
    "id": 14,
    "sNo": "14.",
    "checkPoint": "Process Flow Diagrams and P&IDs",
    "status": "No",
    "remarks": "P&IDs for polymerization reactor, monomer dosing, cooling water & scrubber systems.",
    "documentsCount": 5,
    "documents": [
      {
        "id": 1,
        "title": "PFD_Polymerization_Reactor_Train.pdf",
        "uploadedDate": "2026-05-01"
      }
    ]
  },
  {
    "id": 15,
    "sNo": "15.",
    "checkPoint": "Material and Energy Balance and Basis of Design",
    "status": "No",
    "remarks": "Detailed heat of polymerization calculations, jacket heat removal, and steam demand.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Heat_Balance_Exotherm_Calculations.pdf",
        "uploadedDate": "2026-05-05"
      }
    ]
  },
  {
    "id": 16,
    "sNo": "16.",
    "checkPoint": "Process Hazard Analysis (HAZOP / LOPA) Report",
    "status": "No",
    "remarks": "HAZOP node sheets, safety interlocks, rupture disk sizing, and SIL assignment.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "HAZOP_Report_Acrylic_Polymerization.pdf",
        "uploadedDate": "2026-05-10"
      }
    ]
  },
  {
    "id": 17,
    "sNo": "17.",
    "checkPoint": "Safety Data Sheets (SDS) and GHS Hazard Classification",
    "status": "No",
    "remarks": "16-section SDS authored in accordance with GHS Rev 8 and REACH Annex II.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "SDS_Acrylic_Emulsion_Binder_50.pdf",
        "uploadedDate": "2026-05-15"
      }
    ]
  },
  {
    "id": 18,
    "sNo": "18.",
    "checkPoint": "Critical Process Parameters (CPP) and Control Strategy",
    "status": "No",
    "remarks": "DCS recipe interlocks for feed rate, temperature window (80-82°C), and agitation.",
    "documentsCount": 6,
    "documents": [
      {
        "id": 1,
        "title": "CPP_Control_Strategy_Document.pdf",
        "uploadedDate": "2026-05-20"
      }
    ]
  },
  {
    "id": 19,
    "sNo": "19.",
    "checkPoint": "Analytical Method Validation and Transfer Protocols (Solids, Particle Size, Viscosity, Residual Monomer)",
    "status": "No",
    "remarks": "Method validation protocol for GC-FID residual monomers and particle size by DLS.",
    "documentsCount": 4,
    "documents": [
      {
        "id": 1,
        "title": "Method_Validation_GC_Residual_Monomer.pdf",
        "uploadedDate": "2026-05-25"
      }
    ]
  },
  {
    "id": 20,
    "sNo": "20.",
    "checkPoint": "Environmental Compliance Plan (Effluent, Emissions, Waste)",
    "status": "No",
    "remarks": "ETP coagulum treatment, VOC carbon adsorption scrubber, and solid waste handling.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "ETP_Waste_Treatment_Protocol.pdf",
        "uploadedDate": "2026-05-28"
      }
    ]
  },
  {
    "id": 21,
    "sNo": "21.",
    "checkPoint": "Equipment Qualification (IQ / OQ / PQ) and Scale-Up Equivalence",
    "status": "No",
    "remarks": "Glass-lined reactor installation qualification and agitation equivalence protocols.",
    "documentsCount": 2,
    "documents": [
      {
        "id": 1,
        "title": "Equipment_IQ_OQ_Protocol.pdf",
        "uploadedDate": "2026-06-01"
      }
    ]
  },
  {
    "id": 22,
    "sNo": "22.",
    "checkPoint": "Process Validation (Demonstration Batch) Protocol",
    "status": "No",
    "remarks": "Protocol for 3 consecutive conformance batches at commercial scale.",
    "documentsCount": 3,
    "documents": [
      {
        "id": 1,
        "title": "Demonstration_Batch_Validation_Protocol.pdf",
        "uploadedDate": "2026-06-05"
      }
    ]
  }
];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.productName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['strength']) {
        this.strength = params['strength'];
      }
      if (params['market']) {
        this.market = params['market'];
      }
      if (params['ttdNumber']) {
        this.ttdNumber = params['ttdNumber'];
      }
      if (params['versionNumber']) {
        this.versionNumber = params['versionNumber'];
      }
    });
  }

  // Set Status: Mutually exclusive between Yes, No, N/A
  setStatus(item: TtdCheckPoint, status: 'Yes' | 'No' | 'N/A'): void {
    if (item.status === status) {
      item.status = null;
    } else {
      item.status = status;
    }
  }

  // Save TTD Number
  saveTtdNumber(): void {
    this.ttdNumberSaved = true;
    setTimeout(() => {
      this.ttdNumberSaved = false;
    }, 2000);
  }

  // Save Version Number
  saveVersionNumber(): void {
    this.versionNumberSaved = true;
    setTimeout(() => {
      this.versionNumberSaved = false;
    }, 2000);
  }

  // Click on Documents number opens DocumentsPopComponent
  openDocuments(item: TtdCheckPoint): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: `Documents — ${item.checkPoint}`,
        documents: item.documents || [
          { id: 1, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_DQA_Signed.pdf`, uploadedDate: '2026-03-15' },
          { id: 2, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_Execution_Record.pdf`, uploadedDate: '2026-03-20' }
        ]
      }
    });
  }

  // Click on Remarks opens RemarksPopComponent
  openRemarks(item: TtdCheckPoint): void {
    const dialogRef = this.dialog.open(RemarksPopComponent, {
      width: '500px',
      data: {
        title: `Remarks — ${item.checkPoint}`,
        placeholder: 'Enter remarks...',
        notes: item.remarks || ''
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined && result !== null) {
        if (typeof result === 'string') {
          item.remarks = result;
        } else if (result && typeof result.notes === 'string') {
          item.remarks = result.notes;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode, name: this.productName }
    });
  }
}
