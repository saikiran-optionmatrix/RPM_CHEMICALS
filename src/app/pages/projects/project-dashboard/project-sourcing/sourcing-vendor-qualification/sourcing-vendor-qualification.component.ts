import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { RemarksPopComponent } from '../../../../../common/shared/remarks-pop/remarks-pop.component';
import { DocumentsPopComponent } from '../../../../../common/shared/documents-pop/documents-pop.component';

export interface VendorCheckpointItem {
  id: number;
  done: boolean;
  checkpoint: string;
  dimension: string;
  upload: number;
  remarks: string;
  documents?: { id?: number | string; title: string; url?: string }[];
}

@Component({
  selector: 'app-sourcing-vendor-qualification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './sourcing-vendor-qualification.component.html',
  styleUrl: './sourcing-vendor-qualification.component.scss',
})
export class SourcingVendorQualificationComponent implements OnInit {
  // Top Reference Fields (Default for Acrylic Emulsion Binder 50% Solids)
  itemCode: string = 'CHM-RM-1001';
  itemCategory: string = 'Raw Materials';
  itemName: string = 'Butyl Acrylate (BA Monomer, 99.5%)';
  itemType: string = 'Monomer';

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

  // Vendor Selection (Chemical Manufacturing Industry Categories)
  vendorOptions: string[] = [
    'Raw Material Supplier (Monomers & Solvents)',
    'Specialty Chemical Supplier (Surfactants & Initiators)',
    'Industrial Packaging Vendor (HDPE Drums & IBC Totes)',
    'Process Equipment Manufacturer (Reactors & Condensers)',
    'Analytical & Testing Laboratory (GPC, DSC, HPLC)',
    'Environmental & Tolling Service Partner (ETP & Waste Treatment)'
  ];
  selectedVendor: string = 'Raw Material Supplier (Monomers & Solvents)';
  activeVendor: string = 'Raw Material Supplier (Monomers & Solvents)';

  // Checkpoints by Vendor
  vendorCheckpointsMap: { [vendor: string]: VendorCheckpointItem[] } = {};

  // Current Active Checkpoints
  checkpoints: VendorCheckpointItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['itemCode']) this.itemCode = params['itemCode'];
      if (params['itemCategory']) this.itemCategory = params['itemCategory'];
      if (params['itemName']) this.itemName = params['itemName'];
      if (params['itemType']) this.itemType = params['itemType'];
      if (params['name']) this.projectName = params['name'];
      if (params['code']) this.projectCode = params['code'];
      if (params['vendor'] && this.vendorOptions.includes(params['vendor'])) {
        this.selectedVendor = params['vendor'];
      } else if (params['itemType']) {
        const itemTypeLower = params['itemType'].toLowerCase();
        const matched = this.vendorOptions.find((v) =>
          v.toLowerCase().includes(itemTypeLower)
        );
        if (matched) {
          this.selectedVendor = matched;
        } else if (itemTypeLower.includes('monomer') || itemTypeLower.includes('solvent')) {
          this.selectedVendor = 'Raw Material Supplier (Monomers & Solvents)';
        } else if (itemTypeLower.includes('surfactant') || itemTypeLower.includes('initiator') || itemTypeLower.includes('catalyst')) {
          this.selectedVendor = 'Specialty Chemical Supplier (Surfactants & Initiators)';
        }
      }
    });

    this.initDefaultCheckpoints();
    this.loadVendorCheckpoints(this.selectedVendor);
  }

  initDefaultCheckpoints(): void {
    // 7 Standard Chemical Manufacturing Industry Vendor Qualification Checkpoints
    const standardCheckpoints: Omit<VendorCheckpointItem, 'done' | 'upload' | 'remarks' | 'documents'>[] = [
      {
        id: 1,
        checkpoint: 'ISO 9001:2015 & ISO 14001:2015 Quality & EHS Management System Certification',
        dimension: 'Regulatory & EHS Compliance'
      },
      {
        id: 2,
        checkpoint: 'REACH / TSCA Chemical Substance Registration Dossier & 16-Section GHS SDS Compliance',
        dimension: 'Regulatory & EHS Compliance'
      },
      {
        id: 3,
        checkpoint: 'Technical Quality Agreement (TQA) & Formal Change Notification Protocol Executed',
        dimension: 'Quality Assurance'
      },
      {
        id: 4,
        checkpoint: 'On-Site Chemical Manufacturing Facility & Process Safety Audit (PSM / HAZOP)',
        dimension: 'Process Safety & Facility'
      },
      {
        id: 5,
        checkpoint: 'Physicochemical Specification, Monomer Assay & Trace Impurity Profile Verification',
        dimension: 'Technical & Quality Specification'
      },
      {
        id: 6,
        checkpoint: 'Three Conforming Production Batches with Certificate of Analysis (CoA) & Pilot Trial Conformance',
        dimension: 'Technical & Pilot Validation'
      },
      {
        id: 7,
        checkpoint: 'Annual Chemical Supplier Scorecard, Performance Audit & Dual-Sourcing Allocation Lock',
        dimension: 'Supply Chain & Commercial'
      }
    ];

    // Seed realistic chemical manufacturing vendor qualification presets
    const vendorPresets: { [vendor: string]: { completedIds: number[]; uploads: number[]; remarks: string[] } } = {
      'Raw Material Supplier (Monomers & Solvents)': {
        completedIds: [1, 2, 3, 5, 6], // 5/7
        uploads: [2, 3, 1, 1, 2, 3, 1],
        remarks: [
          'ISO 9001:2015 and ISO 14001:2015 certified site; valid through October 2027.',
          'Full REACH EU registration dossier (CAS 141-32-2) confirmed; 16-section GHS SDS on file.',
          'Bilateral Technical Quality Agreement (TQA) executed with 90-day change notification clause.',
          'On-site chemical plant audit completed; minor PSM action items closed out in Q2.',
          'Gas chromatography (GC) assay > 99.6%, MEHQ inhibitor 15-20 ppm, moisture < 0.03% verified.',
          '3 consecutive 20-ton commercial lot CoAs validated and successfully tested in lab emulsion run.',
          'Annual supplier performance review scheduled for Q4; current vendor rating is 95.4%.'
        ]
      },
      'Specialty Chemical Supplier (Surfactants & Initiators)': {
        completedIds: [1, 2, 3, 5], // 4/7
        uploads: [2, 2, 1, 0, 2, 1, 1],
        remarks: [
          'ISO 9001 certified surfactant manufacturing facility with strict batch traceability.',
          'REACH and TSCA chemical inventory status active for Sodium Lauryl Sulfate and Ethoxylated Alcohols.',
          'TQA signed by Quality Heads with clear critical process parameter (CPP) alerts.',
          'On-site audit scheduled during upcoming commercial campaign shutdown.',
          'Critical micelle concentration (CMC), active surfactant matter (28.2%) and cloud point verified.',
          '2 conforming lot CoAs received; 3rd lot sample undergoing lab verification.',
          'Quarterly supplier scorecard active with on-time delivery metric at 98.2%.'
        ]
      },
      'Industrial Packaging Vendor (HDPE Drums & IBC Totes)': {
        completedIds: [1, 2, 3, 6], // 4/7
        uploads: [1, 2, 1, 1, 1, 2, 0],
        remarks: [
          'UN Certified packaging manufacturer for hazardous and non-hazardous chemical transport.',
          'Compatibility testing and drop-test certification for 200L HDPE drums & 1000L IBC totes on file.',
          'Quality agreement in place covering liner cleanliness and anti-static grounding continuity.',
          'Physical container fabrication facility audit completed with approved rating.',
          'Tare weight tolerances (+/- 0.2 kg) and hydraulic leak tightness certificates verified.',
          '3 trial lots cleared for chemical emulsion storage and transport vibration trials.',
          'Vendor scorecard establishment in progress.'
        ]
      },
      'Process Equipment Manufacturer (Reactors & Condensers)': {
        completedIds: [1, 3, 4, 5, 6, 7], // 6/7
        uploads: [2, 1, 2, 3, 2, 3, 2],
        remarks: [
          'ASME Section VIII, Div 1 and PED 2014/68/EU certification for pressure vessel fabrication.',
          'Factory Acceptance Testing (FAT) protocol and Design Qualification (DQ) documentation verified.',
          'Equipment supply and installation warranty agreement executed with 24/7 service SLA.',
          'Engineering facility audit closed with clean compliance status and full MOC traceability.',
          'SS316L metallurgy, surface roughness (Ra < 0.4 um) and mechanical seal pressure test verified.',
          'Hydrostatic pressure test (1.5x design pressure) and dye penetrant inspection certificates signed.',
          'Approved vendor score 96.8%; vendor scorecard finalized.'
        ]
      },
      'Analytical & Testing Laboratory (GPC, DSC, HPLC)': {
        completedIds: [1, 2, 3, 4, 7], // 5/7
        uploads: [2, 2, 1, 2, 1, 1, 2],
        remarks: [
          'ISO/IEC 17025 accredited analytical chemical testing laboratory.',
          'Annual laboratory proficiency testing results submitted for molecular weight analysis (GPC).',
          'Master Service Agreement (MSA) and confidentiality agreement active.',
          'Technical audit passed with satisfactory rating for instrument calibration and data integrity.',
          'Validation data for residual monomer determination via Headspace-GC verified.',
          'Accelerated thermal aging and freeze-thaw analytical test ongoing.',
          'High vendor reliability rating (96.5%) with turnaround time < 48 hours.'
        ]
      },
      'Environmental & Tolling Service Partner (ETP & Waste Treatment)': {
        completedIds: [1, 2, 3, 4], // 4/7
        uploads: [2, 2, 1, 2, 1, 0, 1],
        remarks: [
          'State Pollution Control Board (SPCB) hazardous waste management authorization valid through 2028.',
          'Manifest tracking system and emergency response plan (ERP) documented.',
          'Bilateral environmental service contract executed per statutory waste disposal norms.',
          'On-site incinerator and common effluent treatment plant (CETP) audit completed.',
          'Distillation solvent recovery efficiency (>88%) and chemical oxygen demand (COD) reduction verified.',
          'Trial batch effluent sample treatment validation completed.',
          'Annual environmental compliance scorecard review scheduled.'
        ]
      }
    };

    // Populate the vendor map
    this.vendorOptions.forEach((vendor) => {
      const preset = vendorPresets[vendor] || {
        completedIds: [1, 2, 3, 5],
        uploads: [1, 1, 1, 1, 1, 1, 1],
        remarks: standardCheckpoints.map(() => 'Chemical manufacturing verification completed.')
      };

      const docCategory = vendor.split(' ')[0].toLowerCase();
      this.vendorCheckpointsMap[vendor] = standardCheckpoints.map((item, idx) => ({
        id: item.id,
        checkpoint: item.checkpoint,
        dimension: item.dimension,
        done: preset.completedIds.includes(item.id),
        upload: preset.uploads[idx] ?? 1,
        remarks: preset.remarks[idx] ?? 'Verified checkpoint.',
        documents: Array.from({ length: preset.uploads[idx] ?? 1 }, (_, i) => ({
          id: i + 1,
          title: `${docCategory}_audit_checkpoint_${item.id}_cert_${i + 1}.pdf`,
          url: 'sample.pdf'
        }))
      }));
    });
  }

  loadVendorCheckpoints(vendor: string): void {
    this.activeVendor = vendor;
    if (!this.vendorCheckpointsMap[vendor]) {
      this.initDefaultCheckpoints();
    }
    this.checkpoints = this.vendorCheckpointsMap[vendor] || [];
  }

  onGo(): void {
    this.loadVendorCheckpoints(this.selectedVendor);
  }

  onDoneChange(row: VendorCheckpointItem): void {
    if (this.vendorCheckpointsMap[this.activeVendor]) {
      const idx = this.vendorCheckpointsMap[this.activeVendor].findIndex((c) => c.id === row.id);
      if (idx > -1) {
        this.vendorCheckpointsMap[this.activeVendor][idx].done = row.done;
      }
    }
  }

  getCompletedCount(): number {
    return this.checkpoints.filter((c) => c.done).length;
  }

  getFractionScore(): string {
    return `${this.getCompletedCount()}/${this.checkpoints.length}`;
  }

  isFullyQualified(): boolean {
    return this.checkpoints.length > 0 && this.getCompletedCount() === this.checkpoints.length;
  }

  openUploadModal(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  openRemarksModal(row: VendorCheckpointItem): void {
    const dialogRef = this.dialog.open(RemarksPopComponent, {
      width: '520px',
      data: {
        title: `Remarks`,
        placeholder: 'Enter chemical vendor checkpoint remarks...',
        notes: row.remarks || ''
      }
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result !== undefined) {
        row.remarks = result;
        if (this.vendorCheckpointsMap[this.activeVendor]) {
          const idx = this.vendorCheckpointsMap[this.activeVendor].findIndex((c) => c.id === row.id);
          if (idx > -1) {
            this.vendorCheckpointsMap[this.activeVendor][idx].remarks = result;
          }
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/materials'], {
      queryParams: {
        code: this.projectCode || '2026/CHM/006',
        name: this.projectName || 'Acrylic Emulsion Binder 50% Solids'
      }
    });
  }
}
