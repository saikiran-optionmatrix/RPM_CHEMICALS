import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ClinicalTrialItem } from '../clinical-trials.data';

@Component({
  selector: 'app-add-clinical-trial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './add-clinical-trial.component.html',
  styleUrl: './add-clinical-trial.component.scss'
})
export class AddClinicalTrialComponent implements OnInit {
  trialForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  regionOptions: string[] = ['India', 'RoW', 'US', 'Europe', 'Canada', 'Australia', 'Global'];
  studyTypeOptions: string[] = [
    'Comparitive study',
    'Fasting & Fed study',
    'Fed study',
    'Fasting study',
    'Steady State BE study',
    'PK/PD Study',
    'Phase I Trial'
  ];
  quoteOptions: string[] = ['Finalised', 'Under Discussion', 'Awaited', 'Pending'];
  protocolOptions: string[] = ['Finalised', 'Initiated', 'Draft Shared', 'Under Review', 'Pending'];
  agreementOptions: string[] = ['Executed', 'Finalised', 'Not Initiated', 'Under Review'];
  dosingOptions: string[] = ['Completed', 'Initiated', 'In Progress', 'Yet to start', 'Not Initiated'];
  escalationOptions: string[] = ['No', 'Yes', 'Under Review'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddClinicalTrialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; item?: ClinicalTrialItem }
  ) {
    this.trialForm = this.fb.group({
      molecule: ['', Validators.required],
      region: ['India', Validators.required],
      formulationLead: [''],
      pctCtLead: [''],
      croSelection: ['', Validators.required],
      quoteFinalisation: ['Finalised'],
      studyCode: [''],
      studyType: ['Comparitive study'],
      croPoc: [''],
      protocolFinalization: ['Finalised'],
      agreementExecution: ['Executed'],
      rldStatus: [''],
      studyInitiationDate: [''],
      dosingStatus: ['Yet to start'],
      studyUpdates: [''],
      bioAnalyticalStatus: [''],
      csrStatus: [''],
      escalationRequired: ['No'],
      managementRemarks: [''],
      isCompleted: [false]
    });
  }

  get f() {
    return this.trialForm.controls;
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';
    if (this.isEditMode && this.data.item) {
      this.trialForm.patchValue({
        molecule: this.data.item.molecule || '',
        region: this.data.item.region || 'India',
        formulationLead: this.data.item.formulationLead || '',
        pctCtLead: this.data.item.pctCtLead || '',
        croSelection: this.data.item.croSelection || '',
        quoteFinalisation: this.data.item.quoteFinalisation || 'Finalised',
        studyCode: this.data.item.studyCode || '',
        studyType: this.data.item.studyType || 'Comparitive study',
        croPoc: this.data.item.croPoc || '',
        protocolFinalization: this.data.item.protocolFinalization || 'Finalised',
        agreementExecution: this.data.item.agreementExecution || 'Executed',
        rldStatus: this.data.item.rldStatus || '',
        studyInitiationDate: this.data.item.studyInitiationDate || '',
        dosingStatus: this.data.item.dosingStatus || 'Yet to start',
        studyUpdates: this.data.item.studyUpdates || '',
        bioAnalyticalStatus: this.data.item.bioAnalyticalStatus || '',
        csrStatus: this.data.item.csrStatus || '',
        escalationRequired: this.data.item.escalationRequired || 'No',
        managementRemarks: this.data.item.managementRemarks || '',
        isCompleted: !!this.data.item.isCompleted
      });
    }
  }

  save(): void {
    this.isSubmitting = true;
    if (this.trialForm.invalid) {
      return;
    }

    const formVal = this.trialForm.value;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');

    const result: Partial<ClinicalTrialItem> = {
      ...formVal,
      lastUpdatedOn: formattedDate
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
