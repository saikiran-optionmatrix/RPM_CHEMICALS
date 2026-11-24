import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../common/shared/documents-pop/documents-pop.component';
import { AcceptancePopComponent } from '../../../../../common/shared/acceptance-pop/acceptance-pop.component';
import { AddGateActivityComponent } from './add-gate-activity/add-gate-activity.component';
import { getRequirementsForWbs, getRequirementItemsForWbs, getDepartmentAndRoleForRequirement } from '../../../../stages/stage-wbs-requirements.data';
import { getTasksForWbs, getTaskItemsForWbs, getTaskDetails } from '../../../../stages/stage-wbs-tasks.data';

export interface GateActivityItem {
  id: number;
  slNo?: string;
  activityCode?: string;
  stageCode?: string;
  stageName?: string;
  deliverable?: string;
  activityName: string;
  jobCode: string;
  department: string;
  slack?: string;
  section?: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  status: boolean;
  done?: boolean;
  approved?: boolean;
  fullKit?: boolean;
  acceptance?: string;
  tasks?: string | number;
  activitiesCount?: string | number;
  activities?: string;
  requirements?: string | number;
  delayReason?: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  actualDuration?: string;
  actualEffort?: string;
  earlyStart?: string;
  earlyEnd?: string;
  lateStart?: string;
  lateEnd?: string;
  planHours?: string;
  actualHours?: string;
  buffer?: string;
  remarks?: string;
  description?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  tasksData?: any[];
  requirementsData?: any[];
}

@Component({
  selector: 'app-proj-gates-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './proj-gates-activities.component.html',
  styleUrl: './proj-gates-activities.component.scss',
})
export class ProjGatesActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  gateCode: string = 'Gate 1';
  gateName: string = 'Business Case';

  isFilterVisible: boolean = false;
  filterDepartment: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  departments: string[] = [
    'Chemical R&D / Process Technology',
    'Process Safety & EHS',
    'Pilot Plant & Scale-Up Engineering',
    'Analytical Science & QC',
    'Regulatory Affairs & Stewardship',
    'Project Engineering & Operations',
    'Commercial & Supply Chain'
  ];
  priorities: string[] = ['Critical', 'High', 'Medium', 'Low'];
  responsibilities: string[] = ['Olivia Brown', "Grace O'Connor", 'Aarav Shah', 'Diego Ruiz', 'Dr. Sarah Jenkins', 'Michael Chang', 'Dr. Priya Nair', 'Alex Rivera', 'Emily Watson', 'David Miller'];

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
  ];

  readonly historySequence: number[] = [4, 2, 5, 2, 4, 7, 8, 3, 5, 2, 6, 4, 8, 2, 5, 7, 3, 6, 4, 2];
  readonly documentsSequence: number[] = [2, 5, 1, 4, 3, 2, 6, 1, 4, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  activities: GateActivityItem[] = [];
  filteredActivities: GateActivityItem[] = [];
  pagedActivities: GateActivityItem[] = [];

  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal
  showTimelineModal: boolean = false;
  selectedTimelineItem: any = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] || params['projectName']) {
        this.projectName = params['name'] || params['projectName'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      if (params['gateCode']) {
        this.gateCode = params['gateCode'];
      }
      if (params['gateName']) {
        this.gateName = params['gateName'];
      }
      this.initActivitiesForGate();
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

    initActivitiesForGate(): void {
    if (this.gateCode === 'Gate 1' || !this.gateCode) {
      this.activities = [
        {
          id: 1,
          slNo: '1.1.1',
          stageCode: 'S1',
          stageName: 'Opportunity Identification',
          deliverable: 'Market Demand & Application Scope',
          activityName: 'Review industrial customer specifications, grade requirements and end-use application criteria',
          jobCode: 'ACT-111',
          department: 'Chemical R&D / Process Technology',
          responsibility: 'Dr. Sarah Jenkins',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '7/7',
          planDuration: '6 days',
          planEffort: '48 hrs',
          actualDuration: '6 days',
          actualEffort: '48 hrs',
          planStart: '2026-01-05',
          planEnd: '2026-01-11',
          actualStart: '2026-01-05',
          actualEnd: '2026-01-11',
          eta: '2026-01-11',
          buffer: '0 days',
          remarks: 'Industrial customer specifications and target grade performance parameters documented'
        },
        {
          id: 2,
          slNo: '1.1.2',
          stageCode: 'S1',
          stageName: 'Opportunity Identification',
          deliverable: 'Market Demand & Application Scope',
          activityName: 'Screen global supply-chain gaps and identify target domestic and export market volumes',
          jobCode: 'ACT-112',
          department: 'Commercial & Supply Chain',
          responsibility: 'Diego Ruiz',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '6/7',
          planDuration: '7 days',
          planEffort: '56 hrs',
          actualDuration: '7 days',
          actualEffort: '56 hrs',
          planStart: '2026-01-07',
          planEnd: '2026-01-14',
          actualStart: '2026-01-07',
          actualEnd: '2026-01-14',
          eta: '2026-01-14',
          buffer: '1 day',
          remarks: 'Target market volume and supply-demand imbalance across North America and EU verified'
        },
        {
          id: 3,
          slNo: '1.2.1',
          stageCode: 'S1',
          stageName: 'Opportunity Identification',
          deliverable: 'Competitor Grade & Benchmark Characterization',
          activityName: 'Identify competitor benchmark grades, pricing and volume distribution',
          jobCode: 'ACT-121',
          department: 'Commercial & Supply Chain',
          responsibility: 'Diego Ruiz',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '5/7',
          planDuration: '5 days',
          planEffort: '40 hrs',
          actualDuration: '5 days',
          actualEffort: '40 hrs',
          planStart: '2026-01-10',
          planEnd: '2026-01-15',
          actualStart: '2026-01-10',
          actualEnd: '2026-01-15',
          eta: '2026-01-15',
          buffer: '0 days',
          remarks: 'Benchmark characterization completed for key market grades'
        },
        {
          id: 4,
          slNo: '1.3.1',
          stageCode: 'S1',
          stageName: 'Opportunity Identification',
          deliverable: 'Preliminary Business Case & Project Charter',
          activityName: 'Formulate preliminary business case and stage-gate project charter',
          jobCode: 'ACT-131',
          department: 'Project Engineering & Operations',
          responsibility: 'Aarav Shah',
          priority: 'Critical',
          status: true,
          done: true,
          approved: true,
          acceptance: '7/7',
          planDuration: '6 days',
          planEffort: '48 hrs',
          actualDuration: '6 days',
          actualEffort: '48 hrs',
          planStart: '2026-01-12',
          planEnd: '2026-01-18',
          actualStart: '2026-01-12',
          actualEnd: '2026-01-18',
          eta: '2026-01-18',
          buffer: '0 days',
          remarks: 'Stage-gate charter signed off by executive sponsor and business leadership'
        },
        {
          id: 5,
          slNo: '2.1.1',
          stageCode: 'S2',
          stageName: 'Concept Screening & Feasibility',
          deliverable: 'Chemistry Feasibility Assessment',
          activityName: 'Process chemistry screening and preliminary synthetic route options',
          jobCode: 'ACT-211',
          department: 'Chemical R&D / Process Technology',
          responsibility: 'Dr. Sarah Jenkins',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '6/7',
          planDuration: '8 days',
          planEffort: '64 hrs',
          actualDuration: '8 days',
          actualEffort: '64 hrs',
          planStart: '2026-01-15',
          planEnd: '2026-01-23',
          actualStart: '2026-01-15',
          actualEnd: '2026-01-23',
          eta: '2026-01-23',
          buffer: '1 day',
          remarks: '3 synthetic routes screened; continuous emulsion polymerization chosen as lead candidate'
        },
        {
          id: 6,
          slNo: '2.1.2',
          stageCode: 'S2',
          stageName: 'Concept Screening & Feasibility',
          deliverable: 'Raw Material Sourcing Assessment',
          activityName: 'Raw material availability, monomer specifications and supply resilience review',
          jobCode: 'ACT-212',
          department: 'Commercial & Supply Chain',
          responsibility: 'David Miller',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '5/7',
          planDuration: '5 days',
          planEffort: '40 hrs',
          actualDuration: '5 days',
          actualEffort: '40 hrs',
          planStart: '2026-01-18',
          planEnd: '2026-01-23',
          actualStart: '2026-01-18',
          actualEnd: '2026-01-23',
          eta: '2026-01-24',
          buffer: '1 day',
          remarks: 'Primary and secondary acrylate monomer suppliers audited with acceptable spec match'
        },
        {
          id: 7,
          slNo: '2.2.1',
          stageCode: 'S2',
          stageName: 'Concept Screening & Feasibility',
          deliverable: 'Process Safety Screening',
          activityName: 'Preliminary process hazard screening, thermal stability and toxicity profiling',
          jobCode: 'ACT-221',
          department: 'Process Safety & EHS',
          responsibility: 'Alex Rivera',
          priority: 'Critical',
          status: true,
          done: true,
          approved: true,
          acceptance: '6/7',
          planDuration: '6 days',
          planEffort: '48 hrs',
          actualDuration: '6 days',
          actualEffort: '48 hrs',
          planStart: '2026-01-20',
          planEnd: '2026-01-26',
          actualStart: '2026-01-20',
          actualEnd: '2026-01-26',
          eta: '2026-01-26',
          buffer: '0 days',
          remarks: 'DSC and preliminary thermal runaway risk assessment indicates manageable heat of reaction'
        },
        {
          id: 8,
          slNo: '2.2.2',
          stageCode: 'S2',
          stageName: 'Concept Screening & Feasibility',
          deliverable: 'Regulatory Pathway Scoping',
          activityName: 'Regulatory pathway scoping (REACH, TSCA, GHS classification)',
          jobCode: 'ACT-222',
          department: 'Regulatory Affairs & Stewardship',
          responsibility: 'Dr. Priya Nair',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '5/7',
          planDuration: '5 days',
          planEffort: '40 hrs',
          actualDuration: '5 days',
          actualEffort: '40 hrs',
          planStart: '2026-01-22',
          planEnd: '2026-01-27',
          actualStart: '2026-01-22',
          actualEnd: '2026-01-27',
          eta: '2026-01-27',
          buffer: '0 days',
          remarks: 'ECHA and EPA TSCA inventory status mapped; existing monomer listings confirmed'
        },
        {
          id: 9,
          slNo: '2.3.1',
          stageCode: 'S2',
          stageName: 'Concept Screening & Feasibility',
          deliverable: 'Financial & Capex Model',
          activityName: 'Cost of Manufacturing (COM) model and preliminary CAPEX budget estimation',
          jobCode: 'ACT-231',
          department: 'Project Engineering & Operations',
          responsibility: 'Aarav Shah',
          priority: 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '6/7',
          planDuration: '7 days',
          planEffort: '56 hrs',
          actualDuration: '7 days',
          actualEffort: '56 hrs',
          planStart: '2026-01-24',
          planEnd: '2026-01-31',
          actualStart: '2026-01-24',
          actualEnd: '2026-01-31',
          eta: '2026-01-31',
          buffer: '1 day',
          remarks: 'Cost of goods sold model validated against commercial manufacturing scale assumptions'
        },
        {
          id: 10,
          slNo: '2.3.2',
          stageCode: 'S2',
          stageName: 'Concept Screening & Feasibility',
          deliverable: 'Gate Charter Sign-Off',
          activityName: 'Executive gate sign-off: Business case and concept approval for laboratory development',
          jobCode: 'ACT-232',
          department: 'Project Engineering & Operations',
          responsibility: 'David Miller',
          priority: 'Critical',
          status: true,
          done: true,
          approved: true,
          acceptance: '7/7',
          planDuration: '3 days',
          planEffort: '24 hrs',
          actualDuration: '3 days',
          actualEffort: '24 hrs',
          planStart: '2026-01-28',
          planEnd: '2026-01-31',
          actualStart: '2026-01-28',
          actualEnd: '2026-01-31',
          eta: '2026-01-31',
          buffer: '0 days',
          remarks: 'Gate 1 formal approval granted by steering committee to initiate laboratory synthesis (S3)'
        }
      ];
    } else if (this.gateCode === 'Gate 2') {
      this.activities = [
        { id: 1, activityName: 'Lab-Scale Synthetic Route Scouting & Reaction Proof of Concept', jobCode: 'ACT-301', department: 'Chemical R&D / Process Technology', responsibility: 'Dr. Sarah Jenkins', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '7/9', planStart: '2026-02-16', planEnd: '2026-03-30', actualStart: '2026-02-16', actualEnd: '2026-03-28', eta: '2026-03-30', planDuration: '42 days', actualDuration: '40 days', planEffort: '80 hrs', actualEffort: '75 hrs', buffer: '2 days', remarks: '3 candidate synthetic routes evaluated at 1L scale with optimal initiator system' },
        { id: 2, activityName: 'Reaction Calorimetry (RC1) & Heat of Reaction Screening', jobCode: 'ACT-402', department: 'Process Safety & EHS', responsibility: 'Alex Rivera', priority: 'Critical', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-03-15', planEnd: '2026-04-20', actualStart: '2026-03-15', actualEnd: '2026-04-18', eta: '2026-04-20', planDuration: '36 days', actualDuration: '34 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'Specific reaction enthalpy determined; maximum adiabatic temperature rise within cooling capacity' },
        { id: 3, activityName: 'Process Optimization, Yield Maximization & Parameter Sensitivity Window', jobCode: 'ACT-403', department: 'Chemical R&D / Process Technology', responsibility: 'Emily Watson', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-04-01', planEnd: '2026-05-10', actualStart: '2026-04-01', actualEnd: '2026-05-08', eta: '2026-05-10', planDuration: '39 days', actualDuration: '37 days', planEffort: '40 hrs', actualEffort: '40 hrs', buffer: '2 days', remarks: 'Design of Experiments (DoE) finalized with >92% monomer conversion' },
        { id: 4, activityName: 'By-Product Identification, Catalyst Recycling & Waste Stream Characterization', jobCode: 'ACT-404', department: 'Analytical Science & QC', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-04-15', planEnd: '2026-05-25', actualStart: '2026-04-15', actualEnd: '2026-05-23', eta: '2026-05-25', planDuration: '40 days', actualDuration: '38 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'Effluent VOC and aqueous wash stream characterized for biological treatment' },
        { id: 5, activityName: 'Unit Operations Flowsheet & Mass/Energy Balance Simulation (Aspen Plus)', jobCode: 'ACT-501', department: 'Pilot Plant & Scale-Up Engineering', responsibility: 'Michael Chang', priority: 'Medium', status: true, done: true, tasks: '4/13', activitiesCount: '3/9', planStart: '2026-05-01', planEnd: '2026-06-15', actualStart: '2026-05-01', actualEnd: '2026-06-14', eta: '2026-06-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '45 hrs', actualEffort: '44 hrs', buffer: '1 day', remarks: 'Process Flow Diagram (PFD) and heat exchanger duty calculated' },
        { id: 6, activityName: 'Process Route Selection & Basis of Design (BOD) Engineering Package Approval', jobCode: 'ACT-502', department: 'Project Engineering & Operations', responsibility: 'David Miller', priority: 'Critical', status: true, done: true, tasks: '11/13', activitiesCount: '8/9', planStart: '2026-05-15', planEnd: '2026-06-30', actualStart: '2026-05-15', actualEnd: '2026-06-28', eta: '2026-06-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '55 hrs', actualEffort: '52 hrs', buffer: '2 days', remarks: 'Formal Basis of Design package signed off to initiate pilot plant engineering' }
      ];
    } else if (this.gateCode === 'Gate 3') {
      this.activities = [
        { id: 1, activityName: 'Bench-to-Pilot Scale Process Development & Agitator Power Sizing', jobCode: 'ACT-601', department: 'Pilot Plant & Scale-Up Engineering', responsibility: 'Michael Chang', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-07-01', planEnd: '2026-08-15', actualStart: '2026-07-01', actualEnd: '2026-08-14', eta: '2026-08-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'Scale-up geometry and tip speed modeled for 500L reactor' },
        { id: 2, activityName: 'Process Hazard Analysis (HAZOP & LOPA) Package & Mitigation Sign-Off', jobCode: 'ACT-701', department: 'Process Safety & EHS', responsibility: 'Alex Rivera', priority: 'Critical', status: true, done: true, tasks: '10/13', activitiesCount: '7/9', planStart: '2026-07-15', planEnd: '2026-08-30', actualStart: '2026-07-15', actualEnd: '2026-08-28', eta: '2026-08-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'HAZOP review completed; emergency vent and interlock requirements validated' },
        { id: 3, activityName: 'Reaction Thermal Runaway Risk Assessment & Safety Relief Sizing', jobCode: 'ACT-702', department: 'Process Safety & EHS', responsibility: 'Alex Rivera', priority: 'Critical', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-08-01', planEnd: '2026-09-10', actualStart: '2026-08-01', actualEnd: '2026-09-08', eta: '2026-09-10', planDuration: '40 days', actualDuration: '38 days', planEffort: '45 hrs', actualEffort: '42 hrs', buffer: '2 days', remarks: 'DIERS methodology applied for two-phase venting calculations' },
        { id: 4, activityName: 'Ecotoxicity, Biodegradability & Toxicological Data Dossier Compilation', jobCode: 'ACT-801', department: 'Regulatory Affairs & Stewardship', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '4/9', planStart: '2026-08-15', planEnd: '2026-09-25', actualStart: '2026-08-15', actualEnd: '2026-09-24', eta: '2026-09-25', planDuration: '41 days', actualDuration: '40 days', planEffort: '55 hrs', actualEffort: '52 hrs', buffer: '1 day', remarks: 'Aquatic ecotox (OECD 201/202/203) testing package complete' },
        { id: 5, activityName: 'REACH / TSCA Chemical Notification Dossier Submission & Agency Review', jobCode: 'ACT-802', department: 'Regulatory Affairs & Stewardship', responsibility: 'Dr. Priya Nair', priority: 'Critical', status: true, done: true, tasks: '9/13', activitiesCount: '6/9', planStart: '2026-09-01', planEnd: '2026-10-15', actualStart: '2026-09-01', actualEnd: '2026-10-14', eta: '2026-10-15', planDuration: '44 days', actualDuration: '43 days', planEffort: '65 hrs', actualEffort: '62 hrs', buffer: '2 days', remarks: 'Dossier successfully filed with authorities; acknowledgment received' },
        { id: 6, activityName: 'Pilot Plant Modification, Utility Readiness & Pre-Startup Safety Review (PSSR)', jobCode: 'ACT-901', department: 'Pilot Plant & Scale-Up Engineering', responsibility: 'Michael Chang', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-09-15', planEnd: '2026-10-30', actualStart: '2026-09-15', actualEnd: '2026-10-28', eta: '2026-10-30', planDuration: '45 days', actualDuration: '43 days', planEffort: '70 hrs', actualEffort: '68 hrs', buffer: '2 days', remarks: 'Pilot bay electrical classification and cooling brine circuit commissioned' }
      ];
    } else if (this.gateCode === 'Gate 4') {
      this.activities = [
        { id: 1, activityName: 'Pilot Plant Campaign Execution & Key Reaction Kinetic Validation', jobCode: 'ACT-902', department: 'Pilot Plant & Scale-Up Engineering', responsibility: 'Michael Chang', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-11-01', planEnd: '2026-12-15', actualStart: '2026-11-01', actualEnd: '2026-12-12', eta: '2026-12-15', planDuration: '44 days', actualDuration: '42 days', planEffort: '80 hrs', actualEffort: '76 hrs', buffer: '2 days', remarks: '5 consecutive pilot batches completed meeting 50% solids specification' },
        { id: 2, activityName: 'Customer Qualification Samples, End-Use Application Testing & Approval', jobCode: 'ACT-1001', department: 'Commercial & Supply Chain', responsibility: 'Diego Ruiz', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '5/9', planStart: '2026-11-15', planEnd: '2026-12-30', actualStart: '2026-11-15', actualEnd: '2026-12-28', eta: '2026-12-30', planDuration: '45 days', actualDuration: '43 days', planEffort: '40 hrs', actualEffort: '38 hrs', buffer: '2 days', remarks: 'Key industrial paint & coating customers certified film clarity and scrub resistance' },
        { id: 3, activityName: 'Demonstration-Scale Campaign Execution & Continuous Operation Repeatability', jobCode: 'ACT-1002', department: 'Pilot Plant & Scale-Up Engineering', responsibility: 'Michael Chang', priority: 'Critical', status: true, done: true, tasks: '10/13', activitiesCount: '7/9', planStart: '2026-12-01', planEnd: '2027-01-20', actualStart: '2026-12-01', actualEnd: '2027-01-18', eta: '2027-01-20', planDuration: '50 days', actualDuration: '48 days', planEffort: '90 hrs', actualEffort: '86 hrs', buffer: '3 days', remarks: '2500L demo run successfully demonstrated recipe repeatability' },
        { id: 4, activityName: 'Front-End Engineering Design (FEED) Package & Detailed P&ID Finalization', jobCode: 'ACT-1101', department: 'Project Engineering & Operations', responsibility: 'David Miller', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-12-15', planEnd: '2027-02-05', actualStart: '2026-12-15', actualEnd: '2027-02-02', eta: '2027-02-05', planDuration: '52 days', actualDuration: '49 days', planEffort: '75 hrs', actualEffort: '72 hrs', buffer: '3 days', remarks: 'FEED documentation and major equipment specifications finalized' },
        { id: 5, activityName: 'Environmental Consents, Emission Permits & Industrial Licensing Approval', jobCode: 'ACT-1102', department: 'Regulatory Affairs & Stewardship', responsibility: 'Dr. Priya Nair', priority: 'Critical', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2027-01-05', planEnd: '2027-02-20', actualStart: '2027-01-05', actualEnd: '2027-02-18', eta: '2027-02-20', planDuration: '46 days', actualDuration: '44 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'State pollution control board consent to establish (CTE) received' },
        { id: 6, activityName: 'Commercial Plant Capex Budget, EPC Vendor Selection & Board Approval', jobCode: 'ACT-1103', department: 'Project Engineering & Operations', responsibility: 'David Miller', priority: 'Critical', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2027-01-15', planEnd: '2027-03-01', actualStart: '2027-01-15', actualEnd: '2027-02-28', eta: '2027-03-01', planDuration: '45 days', actualDuration: '44 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'Board capex sanction approved for 25,000 MT/year commercial emulsion facility' }
      ];
    } else {
      this.activities = [
        { id: 1, activityName: 'Commercial Plant Mechanical Completion, Piping & Loop Checking', jobCode: 'ACT-1201', department: 'Project Engineering & Operations', responsibility: 'David Miller', priority: 'Critical', status: true, done: true, tasks: '9/13', activitiesCount: '7/9', planStart: '2027-03-01', planEnd: '2027-04-15', actualStart: '2027-03-01', actualEnd: '2027-04-14', eta: '2027-04-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '80 hrs', actualEffort: '78 hrs', buffer: '2 days', remarks: 'Hydrostatic pressure tests and instrumentation loop checks signed off' },
        { id: 2, activityName: 'Cold & Hot Commissioning, Water Batch Trials & DCS Interlock Verification', jobCode: 'ACT-1202', department: 'Pilot Plant & Scale-Up Engineering', responsibility: 'Michael Chang', priority: 'Critical', status: true, done: true, tasks: '10/13', activitiesCount: '8/9', planStart: '2027-03-15', planEnd: '2027-04-30', actualStart: '2027-03-15', actualEnd: '2027-04-28', eta: '2027-04-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '70 hrs', actualEffort: '68 hrs', buffer: '2 days', remarks: 'DCS safety logic, cooling interlocks and emergency quench systems validated' },
        { id: 3, activityName: 'Pre-Startup Safety Review (PSSR) & Statutory Operating Consents in Force', jobCode: 'ACT-1203', department: 'Process Safety & EHS', responsibility: 'Alex Rivera', priority: 'Critical', status: true, done: true, tasks: '7/13', activitiesCount: '6/9', planStart: '2027-04-01', planEnd: '2027-05-10', actualStart: '2027-04-01', actualEnd: '2027-05-08', eta: '2027-05-10', planDuration: '39 days', actualDuration: '37 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'PSSR audit verified zero Level-1 safety punchlist items remaining' },
        { id: 4, activityName: 'Standard Operating Procedures (SOPs), Operator Training & Safety Certification', jobCode: 'ACT-1204', department: 'Chemical R&D / Process Technology', responsibility: 'Dr. Sarah Jenkins', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2027-04-15', planEnd: '2027-05-20', actualStart: '2027-04-15', actualEnd: '2027-05-18', eta: '2027-05-20', planDuration: '35 days', actualDuration: '33 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: '3 operational shifts trained and certified on emulsion polymerization recipe' },
        { id: 5, activityName: 'GHS Compliant Safety Data Sheet (SDS), Packaging & Labeling Release', jobCode: 'ACT-1205', department: 'Regulatory Affairs & Stewardship', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2027-04-20', planEnd: '2027-05-25', actualStart: '2027-04-20', actualEnd: '2027-05-23', eta: '2027-05-25', planDuration: '35 days', actualDuration: '33 days', planEffort: '40 hrs', actualEffort: '38 hrs', buffer: '2 days', remarks: 'Multi-lingual GHS SDS sheets published and barcode packaging validated' },
        { id: 6, activityName: 'Commercial Plant Performance Test Run, Full Capacity Ramp-Up & Product Launch', jobCode: 'ACT-1206', department: 'Project Engineering & Operations', responsibility: 'David Miller', priority: 'Critical', status: true, done: true, tasks: '11/13', activitiesCount: '8/9', planStart: '2027-05-01', planEnd: '2027-06-15', actualStart: '2027-05-01', actualEnd: '2027-06-12', eta: '2027-06-15', planDuration: '45 days', actualDuration: '42 days', planEffort: '90 hrs', actualEffort: '86 hrs', buffer: '3 days', remarks: 'Guaranteed 50 MT/day throughput reached at 99.2% prime grade quality' }
      ];
    }

    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    const sampleAcceptances = ['3/5', '2/6', '4/5', '5/5', '1/4', '3/6', '2/5'];
    const defaultSlacks = ['15 days', '14 days', '5 days', '-', '10 days', '7 days', '3 days', '-', '12 days', '8 days'];

    this.activities.forEach((a, idx) => {
      const slNo = a.slNo || '';
      const actName = a.activityName || '';

      if (slNo) {
        // Tasks from StagesWbsComponent (stage-wbs-tasks.data.ts)
        const knownTasks = getTasksForWbs(slNo, actName);
        let totalTasks = knownTasks && knownTasks.length > 0 ? knownTasks.length : 5;
        let taskDone = a.done ? totalTasks : (idx === 1 ? Math.min(4, totalTasks) : (idx === 2 ? Math.min(3, totalTasks) : (idx === 3 ? Math.min(2, totalTasks) : (idx === 4 || idx === 5 ? 1 : 0))));

        // Check sessionStorage for saved tasks
        for (const k of [slNo, actName]) {
          if (!k) continue;
          const saved = sessionStorage.getItem('project_wbs_tasks_' + k) || sessionStorage.getItem('stages_tasks_' + k);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                totalTasks = parsed.length;
                taskDone = parsed.filter((t: any) => t.done || t.completed || t.status === 'Completed' || t.approved || t.checked).length;
                break;
              }
            } catch (e) {}
          }
        }

        // Requirements from StagesWbsComponent (stage-wbs-requirements.data.ts)
        const knownReqs = getRequirementsForWbs(slNo, actName);
        let totalReqs = knownReqs && knownReqs.length > 0 ? knownReqs.length : 6;
        let reqDone = a.done ? totalReqs : (idx === 1 ? Math.min(5, totalReqs) : (idx === 2 ? Math.min(4, totalReqs) : (idx === 3 ? Math.min(3, totalReqs) : (idx === 4 ? 2 : (idx === 5 || idx === 6 ? 1 : 0)))));

        // Check sessionStorage for saved requirements
        for (const k of [slNo, actName]) {
          if (!k) continue;
          const saved = sessionStorage.getItem('project_wbs_requirements_' + k) || sessionStorage.getItem('stages_requirements_' + k);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                totalReqs = parsed.length;
                reqDone = parsed.filter((r: any) => r.done || r.completed || r.status === 'Completed' || r.status === 'Approved' || r.checked).length;
                break;
              }
            } catch (e) {}
          }
        }

        a.tasks = `${taskDone}/${totalTasks}`;
        a.requirements = `${reqDone}/${totalReqs}`;
        a.activitiesCount = `${reqDone}/${totalReqs}`;

        // Pre-populate tasksData
        const taskItems = getTaskItemsForWbs(slNo, actName);
        a.tasksData = (taskItems && taskItems.length > 0) ? taskItems.map((ti: any, i: number) => {
          const taskName = typeof ti === 'string' ? ti : ti.task;
          const taskId = typeof ti === 'string' ? `TSK-${String(i + 1).padStart(3, '0')}` : (ti.taskId || `TSK-${String(i + 1).padStart(3, '0')}`);
          const details = getTaskDetails(taskName, i, slNo, a.jobCode, a.jobCode, taskId);
          const isItemDone = a.done ? true : i < taskDone;
          return {
            id: Date.now() + i,
            taskId: taskId,
            name: taskName,
            taskName: taskName,
            taskCode: taskId,
            jobCode: details.jobCode || a.jobCode,
            wbsId: slNo,
            activityName: actName,
            status: isItemDone ? 'Completed' : 'Pending',
            done: isItemDone,
            active: true,
            priority: a.priority || 'Medium',
            complexity: 'Medium',
            template: 'Dev Template Standard',
            planStart: a.planStart || '2026-01-05',
            planEnd: a.planEnd || '2026-01-20',
            actualStart: a.actualStart || '',
            actualEnd: a.actualEnd || '',
            eta: a.eta || '',
            planEffort: '8 hrs',
            actualEffort: isItemDone ? '8 hrs' : '',
            duration: '2 days',
            responsible: a.responsibility,
            assignedTo: a.responsibility,
            responsibility: a.responsibility,
            department: details.department || a.department,
            role: details.role,
            approved: a.approved,
            description: `Task ${taskName} for WBS ${slNo} ${actName}`,
            remarks: 'Atomic task / deliverable verified',
            historyCount: this.getHistoryCount(i),
            documentsCount: this.getDocumentsCount(i),
            updatedDate: '2026-01-10',
            updatedBy: a.responsibility || 'Olivia Brown',
            isEditing: false
          };
        }) : [];

        // Pre-populate requirementsData
        const reqItems = getRequirementItemsForWbs(slNo, actName);
        a.requirementsData = (reqItems && reqItems.length > 0) ? reqItems.map((ri: any, i: number) => {
          const reqName = typeof ri === 'string' ? ri : ri.requirement;
          const { department, role } = getDepartmentAndRoleForRequirement(reqName);
          const isItemDone = a.done ? true : i < reqDone;
          return {
            id: Date.now() + i,
            reqId: 'REQ-' + String(i + 1).padStart(3, '0'),
            name: reqName,
            requirementName: reqName,
            wbsId: slNo,
            activityName: actName,
            status: isItemDone ? 'Completed' : 'Pending',
            done: isItemDone,
            active: true,
            department: department || a.department,
            responsibleRole: role || 'Executive',
            role: role || 'Executive',
            assignee: a.responsibility,
            notes: `Requirement ${reqName} for WBS ${slNo}`,
            remarks: 'Atomic prerequisite / resource verified',
            verified: a.approved,
            historyCount: this.getHistoryCount(i),
            documentsCount: this.getDocumentsCount(i),
            updatedDate: '2026-01-10',
            updatedBy: a.responsibility || 'Olivia Brown',
            isEditing: false
          };
        }) : [];
      }

      a.historyCount = this.historySequence[idx % this.historySequence.length];
      a.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (a.done === undefined) a.done = true;
      if (a.approved === undefined) a.approved = true;
      if (!a.acceptance) {
        a.acceptance = sampleAcceptances[idx % sampleAcceptances.length];
      }
      if (!a.activityCode) {
        a.activityCode = `ACT-${String(idx + 1).padStart(3, '0')}`;
      }
      if (!a.section) {
        const defaultSections = [
          'Formulation Development',
          'Regulatory Affairs',
          'Costing & Budgeting',
          'Market Research',
          'Financial Modeling',
          'Market Research',
          'Financial Modeling',
          'Steering Committee',
          'Analytical Development',
          'Regulatory Affairs'
        ];
        a.section = defaultSections[idx % defaultSections.length];
      }
      if (!a.updatedDate) {
        a.updatedDate = defaultDates[idx % defaultDates.length];
      }
      if (!a.updatedBy) {
        a.updatedBy = a.responsibility || defaultUpdaters[idx % defaultUpdaters.length];
      }
      if (!a.slack) {
        a.slack = defaultSlacks[idx % defaultSlacks.length];
      }
    });
  }

  applyFilter(): void {
    this.filteredActivities = this.activities.filter(a => {
      const matchDept = !this.filterDepartment || a.department === this.filterDepartment;
      const matchPrio = !this.filterPriority || a.priority === this.filterPriority;
      const matchStatus = !this.filterStatus || (this.filterStatus === 'Active' ? a.status : !a.status);
      return matchDept && matchPrio && matchStatus;
    });
    this.currentPage = 0;
    this.updatePagedActivities();
  }

  resetFilter(): void {
    this.filterDepartment = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  updatePagedActivities(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedActivities = this.filteredActivities.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedActivities();
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

  goBack(): void {
    this.router.navigate(['/projects/dashboard/gates'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      }
    });
  }

  toggleStatus(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: `Are you sure you want to ${activity.status ? 'deactivate' : 'activate'} this activity?`
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        activity.status = !activity.status;
      }
    });
  }

  deleteActivity(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Activity',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.activities = this.activities.filter(a => a !== activity);
        this.applyFilter();
      }
    });
  }

  shiftDate(dateStr: string, days: number): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  }

  openTimelineModal(activity: GateActivityItem): void {
    const effortNum = parseInt(String(activity.planEffort || '16').replace(/\D/g, '') || '16', 10);
    const planEff = activity.planEffort || `${effortNum} hrs`;
    const actEff = activity.actualEffort || (
      activity.status
        ? planEff
        : (activity.actualStart ? `${Math.round(effortNum * 0.5)} hrs` : '0 hrs')
    );
    const planHrs = activity.planHours || planEff;
    const actHrs = activity.actualHours || actEff;

    const pStart = activity.planStart || '2026-01-05';
    const pEnd = activity.planEnd || '2026-01-07';
    const eStart = activity.earlyStart || pStart;
    const eEnd = activity.earlyEnd || pEnd;
    const lStart = activity.lateStart || this.shiftDate(pStart, 2);
    const lEnd = activity.lateEnd || this.shiftDate(pEnd, 2);

    this.selectedTimelineItem = {
      ...activity,
      name: activity.activityName,
      planStart: pStart,
      planEnd: pEnd,
      actualStart: activity.actualStart || '',
      actualEnd: activity.actualEnd || '',
      eta: activity.eta || pEnd,
      earlyStart: eStart,
      earlyEnd: eEnd,
      lateStart: lStart,
      lateEnd: lEnd,
      planEffort: planEff,
      actualEffort: actEff,
      planHours: planHrs,
      actualHours: actHrs,
      projectName: this.projectName,
      responsibility: activity.responsibility || '—',
      department: activity.department || '—'
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openAddActivity(): void {
    const dialogRef = this.dialog.open(AddGateActivityComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        departments: this.departments,
        priorities: this.priorities,
        responsibilities: this.responsibilities,
        activity: {
          jobCode: 'JB-' + (100 + this.activities.length + 1)
        }
      }
    });

    dialogRef.afterClosed().subscribe((res: Partial<GateActivityItem>) => {
      if (res && res.activityName) {
        const newAct: GateActivityItem = {
          id: Date.now(),
          activityCode: res.activityCode || ('ACT-' + String(this.activities.length + 1).padStart(3, '0')),
          activityName: res.activityName || '',
          jobCode: res.jobCode || ('JB-' + (100 + this.activities.length + 1)),
          department: res.department || this.departments[0],
          section: res.section || 'Formulation Development',
          responsibility: res.responsibility || this.responsibilities[0],
          priority: res.priority || 'High',
          status: true,
          done: true,
          approved: true,
          acceptance: '3/5',
          tasks: '0/13',
          activitiesCount: '0/9',
          planStart: res.planStart || '',
          planEnd: res.planEnd || '',
          actualStart: res.actualStart || '',
          actualEnd: res.actualEnd || '',
          eta: res.eta || '',
          planDuration: res.planDuration || '',
          planEffort: res.planEffort || '',
          actualDuration: res.actualDuration || '',
          actualEffort: res.actualEffort || '',
          buffer: res.buffer || '',
          slack: res.slack || '—',
          remarks: res.remarks || '',
          description: res.description || '',
          historyCount: 1,
          documentsCount: 0,
          updatedDate: new Date().toISOString().split('T')[0],
          updatedBy: res.responsibility || 'Dr. Sarah Jenkins'
        };
        this.activities.unshift(newAct);
        this.applyFilter();
      }
    });
  }

  openEditActivity(activity: GateActivityItem, index: number): void {
    const actualIndex = this.activities.findIndex(a => a === activity);
    const targetIdx = actualIndex >= 0 ? actualIndex : index;

    const dialogRef = this.dialog.open(AddGateActivityComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        departments: this.departments,
        priorities: this.priorities,
        responsibilities: this.responsibilities,
        activity
      }
    });

    dialogRef.afterClosed().subscribe((res: Partial<GateActivityItem>) => {
      if (res && res.activityName) {
        this.activities[targetIdx] = {
          ...this.activities[targetIdx],
          ...res,
          updatedDate: new Date().toISOString().split('T')[0]
        };
        this.applyFilter();
      }
    });
  }

  onTasksClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        slNo: item.slNo || '',
        activityName: item.activityName,
        jobCode: item.jobCode,
        stageName: item.stageName || item.stageCode || 'S1',
        stageCode: item.stageCode || 'S1',
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.tasks,
        source: 'gates'
      }
    });
  }

  onRequirementsClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        slNo: item.slNo || '',
        activityName: item.activityName,
        jobCode: item.jobCode,
        stageName: item.stageName || item.stageCode || 'S1',
        stageCode: item.stageCode || 'S1',
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.requirements || item.activitiesCount || item.activities || '0/9',
        source: 'gates'
      }
    });
  }

  onActivitiesClick(item: GateActivityItem): void {
    this.onRequirementsClick(item);
  }

  openHistory(activity: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/gates/activities/history'], {
      queryParams: {
        activityName: activity.activityName,
        jobCode: activity.jobCode,
        department: activity.department,
        responsibility: activity.responsibility,
        delayReason: activity.delayReason,
        priority: activity.priority,
        tasks: activity.tasks,
        requirements: activity.activitiesCount || activity.activities || activity.requirements,
        planDuration: activity.planDuration,
        planEffort: activity.planEffort,
        actualDuration: activity.actualDuration,
        actualEffort: activity.actualEffort,
        remarks: activity.remarks,
        gateName: this.gateName,
        gateCode: this.gateCode,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  isAcceptancePending(acceptance?: string): boolean {
    const val = (acceptance || '3/5').trim();
    const parts = val.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0], 10);
      const den = parseInt(parts[1], 10);
      return !isNaN(num) && !isNaN(den) && num < den;
    }
    return false;
  }

  openAcceptancePop(activity?: GateActivityItem): void {
    const dialogRef = this.dialog.open(AcceptancePopComponent, {
      width: '800px',
      minWidth: '650px',
      maxWidth: '95vw',
      data: {
        title: 'Acceptance — ' + (activity?.activityName || 'Activity'),
        acceptance: activity?.acceptance,
        activity
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && activity && res.acceptedCount !== undefined && res.totalCount !== undefined) {
        activity.acceptance = `${res.acceptedCount}/${res.totalCount}`;
      }
    });
  }
}
