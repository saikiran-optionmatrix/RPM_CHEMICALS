import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AcceptancePopComponent } from '../../../../../common/shared/acceptance-pop/acceptance-pop.component';
// import { AcceptancePopComponent } from '../../../../common/shared/acceptance-pop/acceptance-pop.component';

export interface ChecklistItem {
  id: number;
  text: string;
  subject?: string;
  done: boolean;
  mandatory?: boolean;
  priority?: boolean | string;
  acceptance?: string;
  owner?: string;
  description?: string;
}

export interface ChecklistDialogData {
  gateCode: string;
  gateName: string;
  checklistItems: ChecklistItem[];
  isReadonly?: boolean;
  projectName?: string;
  projectCode?: string;
}

@Component({
  selector: 'app-checklist-pop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './checklist-pop.component.html',
  styleUrl: './checklist-pop.component.scss',
})
export class ChecklistPopComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  gateCode: string = 'Gate 1';
  gateName: string = 'Business case and project charter approval';
  role: string = '';
  memberName: string = '';
  source: string = '';
  isReadonly: boolean = false;
  checklistItems: ChecklistItem[] = [];
  newChecklistText: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    @Optional() public dialogRef?: MatDialogRef<ChecklistPopComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: ChecklistDialogData
  ) {}

  ngOnInit(): void {
    // 1. Check Dialog Data (if opened as modal)
    if (this.data) {
      if (this.data.projectName) this.projectName = this.data.projectName;
      if (this.data.projectCode) this.projectCode = this.data.projectCode;
      if (this.data.gateCode) this.gateCode = this.data.gateCode;
      if (this.data.gateName) this.gateName = this.data.gateName;
      this.isReadonly = !!this.data.isReadonly;
      if (this.data.checklistItems && this.data.checklistItems.length > 0) {
        this.checklistItems = this.data.checklistItems.map((item, idx) => ({
          ...item,
          subject: item.subject || item.text || '',
          priority: typeof item.priority === 'string'
            ? (item.priority.toLowerCase() === 'high' || item.priority.toLowerCase() === 'yes')
            : (item.priority !== undefined ? !!item.priority : true),
          mandatory: item.mandatory !== undefined ? !!item.mandatory : true,
          acceptance: item.acceptance || (idx % 2 === 0 ? '5/7' : '3/7')
        }));
        return;
      }
    }

    // 2. Read Route Query Params (when accessed as inner screen)
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['code'] || params['projectCode']) {
        this.projectCode = params['code'] || params['projectCode'];
      }
      if (params['gateCode']) {
        this.gateCode = params['gateCode'];
      }
      if (params['gateName']) {
        this.gateName = params['gateName'];
      }
      if (params['role']) {
        this.role = params['role'];
      }
      if (params['name']) {
        if (params['projectName']) {
          this.memberName = params['name'];
        } else if (!this.projectName) {
          this.projectName = params['name'];
        }
      }
      if (params['source']) {
        this.source = params['source'];
      }
      if (params['isReadonly'] !== undefined) {
        this.isReadonly = params['isReadonly'] === 'true' || params['isReadonly'] === true;
      }

      this.initChecklistForGate();
    });
  }

  initChecklistForGate(): void {
    if (this.gateCode === 'Gate 1') {
      this.checklistItems = [
        { id: 1, text: 'Market Demand & Competitive Benchmark Assessment', subject: 'Target applications, market size, competitor grades and customer needs documented and approved by commercial.', done: true, mandatory: true, priority: true, acceptance: '7/7' },
        { id: 2, text: 'Chemistry & Process Feasibility Assessment', subject: 'Reaction pathway, raw material availability and technical feasibility confirmed by process chemistry.', done: true, mandatory: true, priority: true, acceptance: '6/7' },
        { id: 3, text: 'Preliminary Business Case & Cost of Manufacturing Model', subject: 'Target product profile, projected cost of manufacturing, volume and NPV threshold validated by finance.', done: true, mandatory: true, priority: true, acceptance: '5/7' },
        { id: 4, text: 'Patents & Freedom-to-Operate (FTO) Clearance', subject: 'Formal IP landscape search and freedom-to-operate opinion documented for the chemistry, process and application.', done: true, mandatory: true, priority: true, acceptance: '7/7' },
        { id: 5, text: 'Process Safety, Technology & Scale-Up Risk Assessment', subject: 'Critical hazards (exotherm, toxic or flammable materials) and technology risks identified with mitigation plans.', done: true, mandatory: false, priority: true, acceptance: '6/7' },
        { id: 6, text: 'Regulatory Pathway & Registration Strategy Outline', subject: 'Registration pathway (REACH, TSCA, India, ASEAN) and high-level data needs outlined.', done: true, mandatory: true, priority: true, acceptance: '5/7' },
        { id: 7, text: 'Executive Committee Concept Approval Release', subject: 'Formal executive sign-off granting authority to fund route scouting and allocate team resources.', done: true, mandatory: false, priority: true, acceptance: '7/7' }
      ];
    } else if (this.gateCode === 'Gate 2') {
      this.checklistItems = [
        { id: 1, text: 'Yield & Selectivity Profile', subject: 'Candidate route meets yield and selectivity targets at bench scale.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 2, text: 'Process Robustness Proof', subject: 'Route performs consistently across repeated runs and parameter ranges.', done: true, mandatory: true, priority: true, acceptance: '5/6' },
        { id: 3, text: 'Impurity & Waste Assessment', subject: 'Impurity profile, by-products and waste streams meet product and environmental criteria.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 4, text: 'Preliminary Safety Screening', subject: 'Reaction calorimetry and thermal stability show an acceptable safety margin.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 5, text: 'Basis of Design & Cost of Manufacturing Estimate', subject: 'Basis of Design and projected cost of manufacturing reviewed by process engineering.', done: true, mandatory: false, priority: true, acceptance: '5/6' },
        { id: 6, text: 'Route Selection Committee Release', subject: 'Formal sign-off to select the route and start pilot development.', done: true, mandatory: false, priority: true, acceptance: '6/6' }
      ];
    } else if (this.gateCode === 'Gate 3') {
      this.checklistItems = [
        { id: 1, text: 'Process Hazard Analysis Package', subject: 'HAZOP and LOPA complete with all high-risk actions closed.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 2, text: 'Pilot Plant Readiness', subject: 'Equipment, utilities and operating procedures ready for the pilot campaign.', done: true, mandatory: true, priority: true, acceptance: '5/6' },
        { id: 3, text: 'Product Specification & Method Validation', subject: 'Product specification and analytical methods validated.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 4, text: 'Environmental & Toxicology Data Package', subject: 'Ecotoxicology, toxicology and fate data complete for registration.', done: true, mandatory: true, priority: true, acceptance: '5/6' },
        { id: 5, text: 'REACH / TSCA Dossier & Regulator Advice', subject: 'Registration dossier compiled and regulator or consultant advice incorporated.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 6, text: 'Executive Committee Registration & Pilot Release', subject: 'Formal sign-off to file registration and start the pilot campaign.', done: true, mandatory: false, priority: true, acceptance: '6/6' }
      ];
    } else if (this.gateCode === 'Gate 4') {
      this.checklistItems = [
        { id: 1, text: 'Pilot Plant Performance Review', subject: 'Pilot data show target yield, quality and acceptable safety performance.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 2, text: 'Demo-Scale Campaign Results', subject: 'Demo-scale batches meet specification with a validated, repeatable process.', done: true, mandatory: true, priority: true, acceptance: '5/6' },
        { id: 3, text: 'Customer Qualification Evidence', subject: 'Key customers confirm performance in their applications.', done: true, mandatory: false, priority: true, acceptance: '5/6' },
        { id: 4, text: 'Process Safety Review Outcome', subject: 'Safety review recommends continuation with no open critical findings.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 5, text: 'Regulatory Registration Status', subject: 'Registration progress and authority feedback documented.', done: true, mandatory: true, priority: true, acceptance: '6/6' },
        { id: 6, text: 'Commercial Plant Design & Capex Approval', subject: 'Plant design package and capital budget approved.', done: true, mandatory: false, priority: true, acceptance: '5/6' }
      ];
    } else if (this.gateCode === 'Gate 5') {
      this.checklistItems = [
        { id: 1, text: 'Commissioning & Performance Test Results', subject: 'Plant meets guaranteed capacity, yield and quality in performance tests.', done: true, mandatory: true, priority: true, acceptance: '5/5' },
        { id: 2, text: 'Operating Procedures & Training', subject: 'Operating procedures complete and operators trained and certified.', done: true, mandatory: true, priority: true, acceptance: '5/5' },
        { id: 3, text: 'Safety, Environmental & Permit Compliance', subject: 'Pre-startup safety review complete and operating consents in force.', done: true, mandatory: true, priority: true, acceptance: '5/5' },
        { id: 4, text: 'Labeling (GHS / CLP), SDS & Emergency Response Plan', subject: 'GHS compliant labeling, Safety Data Sheet (SDS) and emergency plan finalized.', done: true, mandatory: true, priority: true, acceptance: '5/5' },
        { id: 5, text: 'Executive Committee Commercial Launch Release', subject: 'Executive authority to launch commercial manufacture and sales.', done: true, mandatory: true, priority: true, acceptance: '5/5' }
      ];
    } else {
      this.checklistItems = [
        { id: 1, text: `${this.gateName} - Requirement Specifications Approval`, subject: `${this.gateName} - Requirement Specifications Approval`, done: true, mandatory: true, priority: true, acceptance: '5/7' },
        { id: 2, text: `${this.gateName} - Critical Risk Assessment Clearance`, subject: `${this.gateName} - Critical Risk Assessment Clearance`, done: true, mandatory: true, priority: true, acceptance: '3/7' },
        { id: 3, text: `${this.gateName} - Regulatory Dossier Module Compliance`, subject: `${this.gateName} - Regulatory Dossier Module Compliance`, done: true, mandatory: true, priority: true, acceptance: '6/7' },
        { id: 4, text: `${this.gateName} - Quality Assurance Protocols Audit`, subject: `${this.gateName} - Quality Assurance Protocols Audit`, done: false, mandatory: false, priority: false, acceptance: '4/7' },
        { id: 5, text: `${this.gateName} - Stakeholder Stage Transition Sign-off`, subject: `${this.gateName} - Stakeholder Stage Transition Sign-off`, done: false, mandatory: true, priority: true, acceptance: '3/7' }
      ];
    }
  }

  addChecklistItem(): void {
    const text = this.newChecklistText.trim();
    if (!text || this.isReadonly) return;

    this.checklistItems.push({
      id: Date.now(),
      text,
      subject: text,
      done: true,
      mandatory: true,
      priority: true,
      acceptance: '5/7'
    });
    this.newChecklistText = '';
  }

  toggleChecklistItem(item: ChecklistItem): void {
    if (this.isReadonly) return;
    item.done = !item.done;
  }

  deleteChecklistItem(index: number): void {
    if (this.isReadonly) return;
    this.checklistItems.splice(index, 1);
  }

  openAcceptancePop(item: ChecklistItem): void {
    const dialogRef = this.dialog.open(AcceptancePopComponent, {
      width: '800px',
      minWidth: '650px',
      maxWidth: '95vw',
      data: {
        title: 'Acceptance — ' + (item.subject || item.text || 'Checklist Item'),
        acceptance: item.acceptance,
        item: item,
        gateCode: this.gateCode
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.acceptedCount !== undefined && res.totalCount !== undefined) {
        item.acceptance = `${res.acceptedCount}/${res.totalCount}`;
      }
    });
  }

  goBack(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    if (this.source === 'debate') {
      this.router.navigate(['/projects/dashboard/gates/debate'], {
        queryParams: {
          projectName: this.projectName,
          code: this.projectCode,
          gateCode: this.gateCode,
          gateName: this.gateName
        }
      });
      return;
    }
    this.router.navigate(['/projects/dashboard/gates'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      }
    });
  }

  onSave(): void {
    this.checklistItems.forEach(item => {
      item.text = item.subject || item.text || '';
    });
    if (this.dialogRef) {
      this.dialogRef.close({ checklistItems: this.checklistItems });
      return;
    }
    this.goBack();
  }

  onClose(): void {
    this.goBack();
  }
}
