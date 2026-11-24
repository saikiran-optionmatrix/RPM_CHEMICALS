import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface PpifFormData {
  ppifCode: string;
  product: string;
  status: string;
  issueDate: string;
  dosageForm: string;
  category: string;
  indication: string;
  stabilityNote: string;
  potentialCountries: string;
  marketStatus: string;
  marketSelectionRemarks: string;
  marketIssueDate: string;
  innovator: string;
  innovatorTradeDress: string;
  innovatorBrandName: string;
  rldStrength: string;
  innovatorDosageForm: string;
  innovatorApprovedSalt: string;
  innovatorDosageStrengths: string;
  innovatorRemarks: string;
  innovatorApprovalDate: string;
  innovatorDosagePacking: string;
  proposedDosageStrengths: string;
  bioCost: string;
  proposedDosagePacking: string;
  innovatorSampleCost: string;
  proposedProductRemarks: string;
  totalProjectCost: string;
  nceExclusivity: string;
  timelineAvailability: string;
  pedExclusivity: string;
  bcsClass: string;
  otherExclusivity: string;
  dmfHolders: number;
  patentExpiry: string;
  proposedSalt: string;
  filingType: string;
  apiSource: string;
  earliestDossierDate: string;
  apiCost: string;
  earliestLaunchDate: string;
  filingRemarks: string;
  keyDevelopmentPoints: string;
  signFd: string;
  signRa: string;
  signRm: string;
  signPm: string;
  signMd: string;
  dateFd: string;
  dateRa: string;
  dateRm: string;
  datePm: string;
  dateMd: string;
  nameFd: string;
  nameRa: string;
  nameRm: string;
  namePm: string;
  nameMd: string;
}

@Component({
  selector: 'app-project-ppif',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './project-ppif.component.html',
  styleUrl: './project-ppif.component.scss'
})
export class ProjectPpifComponent implements OnInit, OnDestroy {
  private readonly STORAGE_KEY = 'pragati-ppif-draft-demo-v1';
  private toastTimer: any;

  isDirty = false;
  toastVisible = false;
  toastMessage = '';
  private savedSnapshot = '';

  formData: PpifFormData = this.getDefaultFormData();

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    // Attempt to restore saved draft from localStorage
    this.restoreSaved();

    // Check if query params provide product name or project code
    this.route.queryParams.subscribe(params => {
      const qProduct = params['projectName'] || params['name'] || params['productName'];
      const qCode = params['projectCode'] || params['code'];

      if (qProduct) {
        this.formData.product = qProduct;
      }
      if (qCode) {
        this.formData.ppifCode = qCode;
      }
    });

    this.savedSnapshot = this.snapshot();
    this.isDirty = false;
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  getDefaultFormData(): PpifFormData {
    return {
      ppifCode: '2026/CHM/001',
      product: 'Acrylic Emulsion Binder 50% Solids',
      status: 'Not yet Approved',
      issueDate: '',
      dosageForm: 'Film Coated Tablet',
      category: 'Androgen biosynthesis inhibitors and antiandrogens',
      indication: 'Indicated with prednisone or prednisolone for: the treatment of newly diagnosed high risk metastatic hormone sensitive prostate cancer (mHSPC) in adult men in combination with androgen deprivation therapy (ADT); the treatment of metastatic castration resistant prostate cancer (mCRPC) in adult men who are asymptomatic or mildly symptomatic after failure of androgen deprivation therapy in whom chemotherapy is not yet clinically indicated; and the treatment of mCRPC in adult men whose disease has progressed on or after a docetaxel-based chemotherapy regimen.',
      stabilityNote: 'Product to be loaded at all stability conditions, irrespective of the countries mentioned in the PPIF.\nOnly specific ROW countries are included in PPIF. However all ROW countries to be filed shall be communicated to regulatory.\nROW markets have been selected based on Preliminary interest received from marketing. More markets can be included later.',
      potentialCountries: 'Europe',
      marketStatus: 'Not yet Approved',
      marketSelectionRemarks: 'Preliminary interest received from Marketing',
      marketIssueDate: '',
      innovator: 'Zytiga',
      innovatorTradeDress: 'Purple, oval-shaped, film-coated tablets (20 mm long by 10 mm wide), debossed with "AA" on one side and "500" on the other side.',
      innovatorBrandName: 'Janssen-Cilag Ltd',
      rldStrength: '500mg',
      innovatorDosageForm: 'Film Coated Tablet',
      innovatorApprovedSalt: 'Acrylic Emulsion Binder acetate',
      innovatorDosageStrengths: '500mg',
      innovatorRemarks: 'NA',
      innovatorApprovalDate: '2017-04-14',
      innovatorDosagePacking: 'PVdC/PE/PVC/aluminium blisters',
      proposedDosageStrengths: '1000mg',
      bioCost: 'To be decided',
      proposedDosagePacking: 'Blister and HDPE packs',
      innovatorSampleCost: 'To be decided',
      proposedProductRemarks: '',
      totalProjectCost: 'To be decided',
      nceExclusivity: 'NA',
      timelineAvailability: '2026-10-01',
      pedExclusivity: 'NA',
      bcsClass: 'Class IV',
      otherExclusivity: 'NA',
      dmfHolders: 24,
      patentExpiry: 'Acrylic Emulsion Binder acetate with specific particle size is claimed in EP 2 969 227 B1. EP 3 578 266 A1 are set to expire on March 17, 2034.',
      proposedSalt: '',
      filingType: 'P-III',
      apiSource: '1. Aurisco\n2. NA\n3.',
      earliestDossierDate: 'Any time EU dossier can be filed',
      apiCost: '1000 USD per kg',
      earliestLaunchDate: 'Launch on approval',
      filingRemarks: '',
      keyDevelopmentPoints: '',
      signFd: 'JDS-RD-0002',
      signRa: '',
      signRm: '',
      signPm: '',
      signMd: '',
      dateFd: '2026-09-01',
      dateRa: '',
      dateRm: '',
      datePm: '',
      dateMd: '',
      nameFd: 'ANKIREDDY.G',
      nameRa: '',
      nameRm: '',
      namePm: '',
      nameMd: ''
    };
  }

  private snapshot(): string {
    return JSON.stringify(this.formData);
  }

  onFieldChange(): void {
    this.isDirty = this.snapshot() !== this.savedSnapshot;
  }

  showToast(message: string): void {
    // Toaster messages disabled
  }

  save(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.formData));
      this.savedSnapshot = this.snapshot();
      this.isDirty = false;
      this.showToast('PPIF saved successfully in this browser.');
    } catch (e) {
      this.showToast('Could not save PPIF in this browser. Please copy your changes before leaving.');
    }
  }

  saveDraft(): void {
    this.save();
  }

  restoreSaved(): boolean {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      this.formData = { ...this.formData, ...data };
      if (!this.formData.stabilityNote) {
        this.formData.stabilityNote = this.getDefaultFormData().stabilityNote;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  discardChanges(): void {
    if (this.snapshot() === this.savedSnapshot) {
      this.showToast('There are no unsaved changes to discard.');
      return;
    }
    if (!confirm('Discard all unsaved changes and return to the last saved draft?')) {
      return;
    }
    const hadSaved = this.restoreSaved();
    if (!hadSaved) {
      this.formData = this.getDefaultFormData();
    }
    this.savedSnapshot = this.snapshot();
    this.isDirty = false;
    this.showToast('Unsaved changes discarded.');
  }

  downloadPdf(): void {
    if (this.snapshot() !== this.savedSnapshot) {
      const choice = confirm(
        'You have unsaved changes. Save before generating the PDF?\n\nChoose OK to save and continue, or Cancel to review your changes.'
      );
      if (!choice) return;
      this.save();
    }
    window.print();
  }
}
