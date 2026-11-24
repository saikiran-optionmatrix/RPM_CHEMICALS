import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddClinicalTrialComponent } from './add-clinical-trial/add-clinical-trial.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ClinicalTrialItem, CLINICAL_TRIALS_ALL_DATA } from './clinical-trials.data';

@Component({
  selector: 'app-project-clinical-trials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    // AddClinicalTrialButtonComponent
  ],
  templateUrl: './project-clinical-trials.component.html',
  styleUrl: './project-clinical-trials.component.scss'
})
export class ProjectClinicalTrialsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Project Header Information
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';

  // Master Data
  trials: ClinicalTrialItem[] = [...CLINICAL_TRIALS_ALL_DATA];

  // Filter States
  showFilter = false;
  keyword = '';
  selectedRegion = '';
  selectedStudyType = '';
  selectedCro = '';

  searchKeyword = '';
  searchRegion = '';
  searchStudyType = '';
  searchCro = '';

  // Pagination
  pageIndex = 0;
  pageSize = 10;

  // Unique Filter Options
  regions: string[] = [];
  studyTypes: string[] = [];
  cros: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      } else if (params['name']) {
        this.projectName = params['name'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      } else if (params['code']) {
        this.projectCode = params['code'];
      }
    });

    this.extractFilterOptions();
  }

  extractFilterOptions(): void {
    const rSet = new Set<string>();
    const sSet = new Set<string>();
    const cSet = new Set<string>();

    this.trials.forEach(t => {
      if (t.region && t.region.trim()) rSet.add(t.region.trim());
      if (t.studyType && t.studyType.trim()) sSet.add(t.studyType.trim());
      if (t.croSelection && t.croSelection.trim()) cSet.add(t.croSelection.trim());
    });

    this.regions = Array.from(rSet).sort();
    this.studyTypes = Array.from(sSet).sort();
    this.cros = Array.from(cSet).sort();
  }

  get filteredTrials(): ClinicalTrialItem[] {
    return this.trials.filter(t => {
      // Keyword matching
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        const matchesMolecule = t.molecule?.toLowerCase().includes(kw);
        const matchesStudyCode = t.studyCode?.toLowerCase().includes(kw);
        const matchesCro = t.croSelection?.toLowerCase().includes(kw);
        const matchesLead = t.pctCtLead?.toLowerCase().includes(kw) || t.formulationLead?.toLowerCase().includes(kw);
        const matchesUpdates = t.studyUpdates?.toLowerCase().includes(kw);
        if (!matchesMolecule && !matchesStudyCode && !matchesCro && !matchesLead && !matchesUpdates) {
          return false;
        }
      }

      // Region matching
      if (this.searchRegion && t.region?.trim() !== this.searchRegion) {
        return false;
      }

      // Study Type matching
      if (this.searchStudyType && t.studyType?.trim() !== this.searchStudyType) {
        return false;
      }

      // CRO matching
      if (this.searchCro && t.croSelection?.trim() !== this.searchCro) {
        return false;
      }

      return true;
    });
  }

  get paginatedTrials(): ClinicalTrialItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredTrials.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchRegion = this.selectedRegion;
    this.searchStudyType = this.selectedStudyType;
    this.searchCro = this.selectedCro;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedRegion = '';
    this.selectedStudyType = '';
    this.selectedCro = '';

    this.searchKeyword = '';
    this.searchRegion = '';
    this.searchStudyType = '';
    this.searchCro = '';

    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  onDelete(trial: ClinicalTrialItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.trials = this.trials.filter(t => t !== trial);
        this.extractFilterOptions();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParamsHandling: 'preserve'
    });
  }

  openEditTrial(trial: ClinicalTrialItem): void {
    const dialogRef = this.dialog.open(AddClinicalTrialComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { mode: 'edit', item: { ...trial } }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const index = this.trials.findIndex(t => t.sNo === trial.sNo || t === trial);
        if (index > -1) {
          this.trials[index] = {
            ...this.trials[index],
            ...res
          };
          this.extractFilterOptions();
        }
      }
    });
  }

  onTrialAdded(newTrial: Partial<ClinicalTrialItem>): void {
    const nextSNo = (this.trials.length + 1).toString();
    const item: ClinicalTrialItem = {
      sNo: nextSNo,
      molecule: newTrial.molecule || '',
      region: newTrial.region || '',
      formulationLead: newTrial.formulationLead || '',
      pctCtLead: newTrial.pctCtLead || '',
      croSelection: newTrial.croSelection || '',
      quoteFinalisation: newTrial.quoteFinalisation || '',
      studyCode: newTrial.studyCode || '',
      studyType: newTrial.studyType || '',
      croPoc: newTrial.croPoc || '',
      protocolFinalization: newTrial.protocolFinalization || '',
      agreementExecution: newTrial.agreementExecution || '',
      rldStatus: newTrial.rldStatus || '',
      studyInitiationDate: newTrial.studyInitiationDate || '',
      dosingStatus: newTrial.dosingStatus || '',
      studyUpdates: newTrial.studyUpdates || '',
      bioAnalyticalStatus: newTrial.bioAnalyticalStatus || '',
      csrStatus: newTrial.csrStatus || '',
      escalationRequired: newTrial.escalationRequired || '',
      managementRemarks: newTrial.managementRemarks || '',
      lastUpdatedOn: newTrial.lastUpdatedOn || '',
      isCompleted: !!newTrial.isCompleted
    };

    this.trials.unshift(item);
    this.extractFilterOptions();
  }



  addclinicaltrial(): void {

    const dialogRef = this.dialog.open(AddClinicalTrialComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });
  }
}
