import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
  commercialAttractivenessOptions,
  dosageForms,
  locations,
  molecules,
  projectLeads,
  projectOwners,
  targetMarkets,
} from '../projects-data';

export type ProjectTab =
  | 'overview'
  | 'timeline'
  | 'market'
  | 'productDetails'
  | 'innovator'
  | 'api'
  | 'others';

export interface TabItem {
  id: ProjectTab;
  label: string;
}

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  activeTab: ProjectTab = 'overview';
  tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'market', label: 'Market' },
    { id: 'productDetails', label: 'Product Details' },
    { id: 'innovator', label: 'Innovator' },
    { id: 'api', label: 'API' },
    { id: 'others', label: 'Others' }
  ];

  // Search terms for searchable dropdowns
  projectOwnerSearchTerm: string = '';
  projectLeadSearchTerm: string = '';
  locationSearchTerm: string = '';

  // Option lists for dropdowns
  readonly divisionsList = [
    'Coatings & Adhesives Resins',
    'Epoxy & Composites',
    'Surfactants & Personal Care',
    'Specialty Silicas',
    'Industrial Chemicals',
    'Specialty Chemicals - SC',
    'Polymers & Resins - PR',
    'Agrochemicals - AC',
    'Industrial & Fine Chemicals - IF'
  ];
  readonly templatesList = [
    'Specialty Chemical Process Development Program',
    'Polymer & Resin Product Development Program',
    'Agrochemical Active Ingredient Process Development',
    'Continuous Flow Specialty Ester Synthesis',
    'High-Purity Electronic Chemical Program',
    'Scale-Up & Plant Technology Transfer Program'
  ];
  locationsList: string[] = locations && locations.length ? Array.from(new Set(locations)) : [
    'Hyderabad',
    'Mumbai',
    'Bengaluru',
    'Ahmedabad',
    'Pune',
    'Chennai',
    'Delhi',
    'Baddi',
  ];
  projectOwnersList: string[] = projectOwners ? Array.from(new Set(projectOwners)) : [];
  projectLeadsList: string[] = projectLeads ? Array.from(new Set(projectLeads)) : [];
  moleculesList: string[] = molecules ? Array.from(new Set(molecules)) : [];
  readonly dosageFormsList = dosageForms;
  readonly targetMarketsList = targetMarkets;
  readonly marketsList = targetMarkets;
  readonly commercialAttractivenessList = commercialAttractivenessOptions;
  readonly priorityOptionsList = ['Critical', 'High', 'Medium', 'Low'];
  readonly starProductList = ['Yes', 'No'];
  readonly registrationTypesList = [
    'New Product Development / REACH-India',
    'New Product Development / EU REACH',
    'Product Development / ROW Registration',
    'New Plant Development / ASEAN Registration',
    'Export / US TSCA',
    'Domestic / BIS'
  ];

  get filteredProjectOwners(): string[] {
    if (!this.projectOwnerSearchTerm?.trim()) {
      return this.projectOwnersList;
    }
    const term = this.projectOwnerSearchTerm.trim().toLowerCase();
    return this.projectOwnersList.filter((owner) => owner.toLowerCase().includes(term));
  }

  get filteredProjectLeads(): string[] {
    if (!this.projectLeadSearchTerm?.trim()) {
      return this.projectLeadsList;
    }
    const term = this.projectLeadSearchTerm.trim().toLowerCase();
    return this.projectLeadsList.filter((lead) => lead.toLowerCase().includes(term));
  }

  get filteredLocations(): string[] {
    if (!this.locationSearchTerm?.trim()) {
      return this.locationsList;
    }
    const term = this.locationSearchTerm.trim().toLowerCase();
    return this.locationsList.filter((loc) => loc.toLowerCase().includes(term));
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.fb.group({
      // 1. Overview (Project Identification)
      projectCode: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      module: [''],
      division: [''],
      starProduct: [''],
      registrationType: [''],
      projectOwner: [''],
      projectLead: [''],
      location: [''],
      template: [''],

      // 2. Timeline (Priority, Timeline & Budget)
      priority: [''],
      projectStartDate: [''],
      projectEndDate: [''],
      projectBudget: [''],

      // 3. Market (Market & Commercial)
      market: [''],
      marketSizeLast3Years: [''],
      marketSizeUsdMnYr: [''],
      projectedMarketShare: [''],
      commercialAttractiveness: [''],
      projectedNpv: [''],

      // 4. Product Details
      dosageForm: [''],
      strength: [''],
      fillVolume: [''],
      pharmacopoeia: [''],
      packagingDetails: [''],

      // 5. Innovator (Innovator / RLD & IP)
      innovatorCompany: [''],
      innovatorBrandName: [''],
      innovatorDosageForm: [''],
      innovatorStrengths: [''],
      innovatorApprovalDate: [''],
      innovatorPackPresentation: [''],
      innovatorBioStrength: [''],
      rldInformation: [''],
      innovatorVsJodas: [''],
      ipDetails: [''],

      // 6. API
      apiManufacturer: [''],
      polymorphForm: [''],
      cepDmfNoReceiptStatus: [''],
      dmfAsmfCepReceived: [''],
      apiVendorQualification: [''],
      apiMl: [''],
      apiGmp: [''],

      // 7. Others (Site & Regulatory Certificates & Bio Study & Remarks)
      ml: [''],
      whoGmp: [''],
      bioStudyCroName: [''],
      bioStudyCroGmpStatus: [''],
      beNoc: [''],
      studyTimePeriod: [''],
      bioStudyReport: [''],
      remarks: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;

      const lead = this.data.projectLead || this.data.projectManager || '';
      if (lead && !this.projectLeadsList.includes(lead)) {
        this.projectLeadsList = [lead, ...this.projectLeadsList];
      }
      const owner = this.data.projectOwner || '';
      if (owner && !this.projectOwnersList.includes(owner)) {
        this.projectOwnersList = [owner, ...this.projectOwnersList];
      }
      const mol = this.data.molecule || this.data.module || '';
      if (mol && !this.moleculesList.includes(mol)) {
        this.moleculesList = [mol, ...this.moleculesList];
      }
      const loc = this.data.location || '';
      if (loc && !this.locationsList.includes(loc)) {
        this.locationsList = [loc, ...this.locationsList];
      }

      let budgetVal = this.data.projectBudget ?? this.data.estimatedCostForDevelopment ?? '';
      if (typeof budgetVal === 'string' && budgetVal.includes('$')) {
        const numOnly = budgetVal.replace(/[^0-9.]/g, '');
        if (numOnly) budgetVal = numOnly;
      }

      this.projectForm.patchValue({
        // 1. Overview
        projectCode: this.data.projectCode || '',
        productName: this.data.productName || '',
        module: this.data.molecule || this.data.module || '',
        division: this.data.division || '',
        starProduct: this.data.starProduct || '',
        registrationType: this.data.registrationType || '',
        projectOwner: owner,
        projectLead: lead,
        location: this.data.location || '',
        template: this.data.template || this.data.templateName || '',

        // 2. Timeline
        priority: this.data.priority || this.data.priorityOfProject || '',
        projectStartDate: this.formatDateForInput(this.data.projectStartDate || this.data.projectInitiatedOn || ''),
        projectEndDate: this.formatDateForInput(this.data.projectEndDate || this.data.projectCompletedDate || ''),
        projectBudget: budgetVal,

        // 3. Market
        market: this.data.market || this.data.targetMarket || '',
        marketSizeLast3Years: this.data.marketSizeLast3Years || '',
        marketSizeUsdMnYr: this.data.marketSizeUsdMnYr || this.data.marketSizeInUsd || '',
        projectedMarketShare: this.data.projectedMarketShare || '',
        commercialAttractiveness: this.data.commercialAttractiveness || '',
        projectedNpv: this.data.projectedNpv || '',

        // 4. Product Details
        dosageForm: this.data.dosageForm || '',
        strength: this.data.strength || '',
        fillVolume: this.data.fillVolume || '',
        pharmacopoeia: this.data.pharmacopoeia || '',
        packagingDetails: this.data.packagingDetails || '',

        // 5. Innovator
        innovatorCompany: this.data.innovatorCompany || '',
        innovatorBrandName: this.data.innovatorBrandName || '',
        innovatorDosageForm: this.data.innovatorDosageForm || '',
        innovatorStrengths: this.data.innovatorStrengths || '',
        innovatorApprovalDate: this.data.innovatorApprovalDate || '',
        innovatorPackPresentation: this.data.innovatorPackPresentation || '',
        innovatorBioStrength: this.data.innovatorBioStrength || '',
        rldInformation: this.data.rldInformation || '',
        innovatorVsJodas: this.data.innovatorVsJodas || '',
        ipDetails: this.data.ipDetails || '',

        // 6. API
        apiManufacturer: this.data.apiManufacturer || '',
        polymorphForm: this.data.polymorphForm || '',
        cepDmfNoReceiptStatus: this.data.cepDmfNoReceiptStatus || '',
        dmfAsmfCepReceived: this.data.dmfAsmfCepReceived || '',
        apiVendorQualification: this.data.apiVendorQualification || '',
        apiMl: this.data.apiMl || '',
        apiGmp: this.data.apiGmp || '',

        // 7. Others
        ml: this.data.ml || '',
        whoGmp: this.data.whoGmp || '',
        bioStudyCroName: this.data.bioStudyCroName || '',
        bioStudyCroGmpStatus: this.data.bioStudyCroGmpStatus || '',
        beNoc: this.data.beNoc || '',
        studyTimePeriod: this.data.studyTimePeriod || '',
        bioStudyReport: this.data.bioStudyReport || '',
        remarks: this.data.remarks || '',
        active: this.data.status ? this.data.status === 'Active' : true
      });
    }
  }

  setActiveTab(tab: ProjectTab): void {
    this.activeTab = tab;
  }

  prevTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex > 0) {
      this.activeTab = this.tabs[currentIndex - 1].id;
    }
  }

  nextTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex < this.tabs.length - 1) {
      this.activeTab = this.tabs[currentIndex + 1].id;
    }
  }

  save(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      // If error is in Overview fields, navigate to Overview tab
      if (this.projectForm.get('projectCode')?.invalid || this.projectForm.get('productName')?.invalid) {
        this.activeTab = 'overview';
      }
      return;
    }

    this.dialogRef.close(this.projectForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (ddmmyyyyMatch) {
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const mIdx = monthNames.indexOf(ddmmyyyyMatch[2].toLowerCase());
      if (mIdx !== -1) {
        const day = ddmmyyyyMatch[1].padStart(2, '0');
        const month = String(mIdx + 1).padStart(2, '0');
        const year = ddmmyyyyMatch[3];
        return `${year}-${month}-${day}`;
      }
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }
}
