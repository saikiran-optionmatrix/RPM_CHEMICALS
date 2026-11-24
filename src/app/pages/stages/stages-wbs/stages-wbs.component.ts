import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddDeliverableComponent } from './add-deliverable/add-deliverable.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AssignRequirementsComponent } from './assign-requirements/assign-requirements.component';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { StagesPredecessorComponent } from './stages-predecessor/stages-predecessor.component';
import { getRequirementsForWbs, getRequirementItemsForWbs, getDepartmentAndRoleForRequirement } from '../stage-wbs-requirements.data';
import { getTasksForWbs, getTaskItemsForWbs, getTaskDetails } from '../stage-wbs-tasks.data';
import { STAGE_WBS_CONFIG_MAP, getActivityEstimates } from '../stage-wbs.data';

export interface WbsTask {
  deliverableSlNo: string;
  slNo: string;
  task: string;
  predecessor: string;
  department?: string;
  section?: string;
  applicability: string;
  taskCode: string;
  jobCode: string;
  activityCode?: string;
  effort: string;
  duration: string;
  description: string;
  procedure: string;
  planned: string;
  assignedTo: string;
  assigned: string;
  actual: string;
  cost: string;
  manPowerBudget?: string | number;
  materialBudget?: string | number;
  resourceBudget?: string | number;
  worked: string;
  remaining: string;
  scheduled: string;
  date: string;
  status: string;
  submitted: string;
  requirements?: string;
  tasks?: string;
  requirementsData?: any[];
  tasksData?: any[];
  predecessorsData?: any[];
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
}

export interface SidebarMenu {
  slNo?: string;
  name: string;
  count: number;
  isOpen: boolean;
  subItems?: string[];
}

export interface StageWbsConfig {
  sidebarMenus: SidebarMenu[];
  modulesData: WbsTask[][];
}

@Component({
  selector: 'app-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './stages-wbs.component.html',
  styleUrls: ['./stages-wbs.component.scss']
})
export class StagesWbsComponent implements OnInit {
  // Modern Dependency Injection
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  // @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View State
  stageCode: string = 'S1';
  stageName: string = 'Business Case';
  gateCode: string = 'Gate 1';

  sidebarMenus: SidebarMenu[] = [];
  modulesData: WbsTask[][] = [];
  selectedMenuIndex: number = 0;

  tableData: WbsTask[] = [];
  paginatedData: WbsTask[] = [];

  // Pagination properties
  totalItems: number = 0;
  pageSize: number = 15;
  pageIndex: number = 0;

  // WBS Data Map (Minified here to save space - KEEP YOUR ORIGINAL DATA BLOCK HERE)
  // private stageWbsMap: { [key: string]: StageWbsConfig } = {
  //   // S1 - Business Case
  //   'S1': {
  //     sidebarMenus: [
  //       { slNo: '0.1', name: 'Business Case Preparation', count: 3, isOpen: true },
  //       { slNo: '0.2', name: 'Market Sizing & Commercial Modeling', count: 2, isOpen: false },
  //       // { slNo: '0.3', name: 'Gate 1 Business Case Review', count: 2, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '0.1', slNo: '0.1.1', task: 'Molecule Selection & Indication Mapping', activityCode: 'ACT-001', predecessor: '6', applicability: 'All Products', taskCode: 'TC-001', jobCode: 'BC01', effort: '16', duration: '2', description: 'Analyze target indication, therapeutic area and molecule profile', procedure: 'PMO Molecule Assessment', planned: '16.00', assignedTo: 'Olivia Brown', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-04-10', date: '2024-04-10', status: 'Approved', submitted: '2024-04-15', requirements: '7', tasks: '8' },
  //         { deliverableSlNo: '0.1', slNo: '0.1.2', task: 'Country & Regulatory Scope Identification', activityCode: 'ACT-002', predecessor: '7', applicability: 'All Products', taskCode: 'TC-002', jobCode: 'BC02', effort: '12', duration: '2', description: 'Identify target geographies, regulatory pathways and filing timelines', procedure: 'Regulatory Strategy SOP', planned: '12.00', assignedTo: 'Grace O\'Connor', assigned: '12.00', actual: '12.00', cost: '1200.00', worked: '12.00', remaining: '0.00', scheduled: '2024-04-12', date: '2024-04-12', status: 'Approved', submitted: '2024-04-16', requirements: '9', tasks: '1' },
  //         { deliverableSlNo: '0.1', slNo: '0.1.3', task: 'Preliminary COGs and CAPEX Estimation', activityCode: 'ACT-003', predecessor: '5', applicability: 'All Products', taskCode: 'TC-003', jobCode: 'BC03', effort: '14', duration: '2', description: 'Estimate initial Cost of Goods and manufacturing plant CAPEX requirements', procedure: 'Finance Modeling SOP', planned: '14.00', assignedTo: 'Aarav Shah', assigned: '14.00', actual: '14.00', cost: '1400.00', worked: '14.00', remaining: '0.00', scheduled: '2024-04-15', date: '2024-04-15', status: 'Approved', submitted: '2024-04-20', requirements: '8', tasks: '7' }
  //       ],
  //       [
  //         { deliverableSlNo: '0.2', slNo: '0.2.1', task: 'Market Sizing & Forecast Analysis', activityCode: 'ACT-004', predecessor: '4', applicability: 'All Products', taskCode: 'TC-004', jobCode: 'BC04', effort: '18', duration: '3', description: 'Evaluate IQVIA sales data, market volume and 10-year sales curve', procedure: 'Market Forecast SOP', planned: '18.00', assignedTo: 'Diego Ruiz', assigned: '18.00', actual: '18.00', cost: '1800.00', worked: '18.00', remaining: '0.00', scheduled: '2024-04-20', date: '2024-04-20', status: 'Approved', submitted: '2024-04-25', requirements: '1', tasks: '9' },
  //         { deliverableSlNo: '0.2', slNo: '0.2.2', task: 'NPV & Commercial Attractiveness Model', activityCode: 'ACT-005', predecessor: '6', applicability: 'All Products', taskCode: 'TC-005', jobCode: 'BC05', effort: '10', duration: '2', description: 'Compute Net Present Value (NPV), IRR and payback horizon', procedure: 'Commercial Model SOP', planned: '10.00', assignedTo: 'Aarav Shah', assigned: '10.00', actual: '10.00', cost: '1000.00', worked: '10.00', remaining: '0.00', scheduled: '2024-04-24', date: '2024-04-24', status: 'Approved', submitted: '2024-04-28', requirements: '11', tasks: '5' }
  //       ],
  //       [
  //         { deliverableSlNo: '0.3', slNo: '0.3.1', task: 'Gate 1 Dossier Assembly', activityCode: 'ACT-006', predecessor: '7', applicability: 'All Products', taskCode: 'TC-006', jobCode: 'BC06', effort: '8', duration: '1', description: 'Assemble business case summary for steering committee approval', procedure: 'Gate 1 Governance SOP', planned: '8.00', assignedTo: 'Olivia Brown', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-04-28', date: '2024-04-28', status: 'Approved', submitted: '2024-04-30', requirements: '7', tasks: '12' },
  //         { deliverableSlNo: '0.3', slNo: '0.3.2', task: 'Steering Committee Sign-off', activityCode: 'ACT-007', predecessor: '5', applicability: 'All Products', taskCode: 'TC-007', jobCode: 'BC07', effort: '4', duration: '1', description: 'Formal executive authorization to initiate project development', procedure: 'Charter Sign-off', planned: '4.00', assignedTo: 'Olivia Brown', assigned: '4.00', actual: '4.00', cost: '400.00', worked: '4.00', remaining: '0.00', scheduled: '2024-04-30', date: '2024-04-30', status: 'Approved', submitted: '2024-04-30', requirements: '8', tasks: '1' }
  //       ]
  //     ]
  //   },

  //   // S2 - Product/Project Initiation (S2) - Exact Data from Reference Image
  //   'S2': {
  //     sidebarMenus: [
  //       { slNo: '1.1', name: 'Project costing sheet preparation & Selection of Project / Product', count: 3, isOpen: true },
  //       { slNo: '1.2', name: 'Provicinal Product Initiation Form (PPIF)', count: 1, isOpen: false },
  //       { slNo: '1.3', name: 'Literature serach & MER', count: 3, isOpen: false },
  //       { slNo: '1.4', name: 'Pre Product Development Strategy (PPDS) finalization', count: 1, isOpen: false },
  //       { slNo: '1.5', name: 'Test license/NOC', count: 3, isOpen: false },
  //       { slNo: '1.6', name: 'RLD import license - Form 11 for Developmental Studies', count: 3, isOpen: false },
  //       { slNo: '1.7', name: 'API import license - Form 11', count: 3, isOpen: false },
  //       { slNo: '1.8', name: 'Form-29 for manufacturing permission/manufacturing license', count: 3, isOpen: false },
  //       { slNo: '1.9', name: 'CT-14 / CT -11Permission to Manufacture The batch for BE purpose', count: 2, isOpen: false },
  //       { slNo: '1.10', name: 'New product information to be sent to plant', count: 1, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 1.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.1', slNo: '1.1.1', task: 'Analytical costing, External CRO costing', predecessor: '—', applicability: 'All Products', taskCode: 'TC-1101', jobCode: 'ACT1', effort: '120', duration: '15', description: 'Analytical costing, External CRO costing for Project Initiation', procedure: 'Costing SOP', planned: '120.00', assignedTo: 'Olivia Brown', assigned: '120.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '0.00', scheduled: '2024-05-01', date: '2024-05-01', status: 'Approved', submitted: '2024-05-15', requirements: '7', tasks: '8' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.2', task: 'RM, PM, API & RLD costing', predecessor: '1.1.1 (SS)', applicability: 'All Products', taskCode: 'TC-1102', jobCode: 'ACT2', effort: '40', duration: '5', description: 'Raw material, packaging material, API & reference listed drug costing', procedure: 'Costing SOP', planned: '40.00', assignedTo: 'Aarav Shah', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-05-05', date: '2024-05-05', status: 'Approved', submitted: '2024-05-10', requirements: '9', tasks: '1' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.3', task: 'BE Costing', predecessor: '1.1.1 (SS)', applicability: 'All Products', taskCode: 'TC-1103', jobCode: 'ACT3', effort: '160', duration: '20', description: 'Bioequivalence clinical & bioanalytical study cost estimation', procedure: 'BE Costing Matrix', planned: '160.00', assignedTo: 'Diego Ruiz', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-05-05', date: '2024-05-05', status: 'Approved', submitted: '2024-05-25', requirements: '8', tasks: '7' }
  //       ],
  //       // 1.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.2', slNo: '1.2', task: 'Provicinal Product Initiation Form (PPIF)', predecessor: '1.1.3', applicability: 'All Products', taskCode: 'TC-1201', jobCode: 'ACT4', effort: '56', duration: '7', description: 'Provincial Product Initiation Form sign-off and charter generation', procedure: 'PPIF Workflow SOP', planned: '56.00', assignedTo: 'Sachin Patil', assigned: '56.00', actual: '56.00', cost: '5600.00', worked: '56.00', remaining: '0.00', scheduled: '2024-05-26', date: '2024-05-26', status: 'Approved', submitted: '2024-06-02' }
  //       ],
  //       // 1.3 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.3', slNo: '1.3.1', task: 'Scan of IP landscpae', predecessor: '1.1.1 (SS)', applicability: 'All Products', taskCode: 'TC-1301', jobCode: 'ACT5', effort: '120', duration: '15', description: 'Patent and intellectual property landscape evaluation', procedure: 'IP Search SOP', planned: '120.00', assignedTo: 'Avi Paul', assigned: '120.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '0.00', scheduled: '2024-05-05', date: '2024-05-05', status: 'Approved', submitted: '2024-05-20' },
  //         { deliverableSlNo: '1.3', slNo: '1.3.2', task: 'Submission of MER', predecessor: '1.3.1', applicability: 'All Products', taskCode: 'TC-1302', jobCode: 'ACT6', effort: '56', duration: '7', description: 'Submission of Market Evaluation Report (MER)', procedure: 'MER Submission Protocol', planned: '56.00', assignedTo: 'David Park', assigned: '56.00', actual: '56.00', cost: '5600.00', worked: '56.00', remaining: '0.00', scheduled: '2024-05-21', date: '2024-05-21', status: 'Approved', submitted: '2024-05-28' },
  //         { deliverableSlNo: '1.3', slNo: '1.3.3', task: 'Literature Search Report', predecessor: '1.1.1 (SS)', applicability: 'All Products', taskCode: 'TC-1303', jobCode: 'ACT7', effort: '80', duration: '10', description: 'Comprehensive scientific literature search and prior art analysis', procedure: 'Literature Review SOP', planned: '80.00', assignedTo: 'Avi Paul', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2024-05-05', date: '2024-05-05', status: 'Approved', submitted: '2024-05-15' }
  //       ],
  //       // 1.4 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.4', slNo: '1.4', task: 'Pre Product Development Strategy (PPDS) finalization', predecessor: '1.3.2', applicability: 'All Products', taskCode: 'TC-1401', jobCode: 'ACT8', effort: '56', duration: '7', description: 'Pre-Product Development Strategy document freeze and technical alignment', procedure: 'PPDS Formulation Guideline', planned: '56.00', assignedTo: 'Elena Rostova', assigned: '56.00', actual: '56.00', cost: '5600.00', worked: '56.00', remaining: '0.00', scheduled: '2024-05-29', date: '2024-05-29', status: 'Approved', submitted: '2024-06-05' }
  //       ],
  //       // 1.5 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.5', slNo: '1.5.1', task: 'Manufacturing Formula & Process', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-1501', jobCode: 'ACT9', effort: '16', duration: '2', description: 'Manufacturing formula and process definition for test license', procedure: 'Formula Definition SOP', planned: '16.00', assignedTo: 'Marcus Vance', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-06-03', date: '2024-06-03', status: 'Approved', submitted: '2024-06-05' },
  //         { deliverableSlNo: '1.5', slNo: '1.5.2', task: 'FP specifications, & STP', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-1502', jobCode: 'ACT10', effort: '24', duration: '3', description: 'Finished Product specifications and Standard Testing Procedures', procedure: 'STP Guideline', planned: '24.00', assignedTo: 'Priya Sharma', assigned: '24.00', actual: '24.00', cost: '2400.00', worked: '24.00', remaining: '0.00', scheduled: '2024-06-03', date: '2024-06-03', status: 'Approved', submitted: '2024-06-06' },
  //         { deliverableSlNo: '1.5', slNo: '1.5.3', task: 'Application processing & Other administrative Documents', predecessor: '1.5.2', applicability: 'All Products', taskCode: 'TC-1503', jobCode: 'ACT11', effort: '280', duration: '35', description: 'Regulatory application processing and administrative submission for Test License/NOC', procedure: 'Regulatory Submission SOP', planned: '280.00', assignedTo: 'Dr. Rebecca Chen', assigned: '280.00', actual: '200.00', cost: '20000.00', worked: '200.00', remaining: '80.00', scheduled: '2024-06-07', date: '2024-06-07', status: 'In Progress', submitted: '-' }
  //       ],
  //       // 1.6 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.6', slNo: '1.6.1', task: 'RLD utilization brake up', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-1601', jobCode: 'ACT12', effort: '8', duration: '1', description: 'Reference Listed Drug sample consumption and utilization calculation', procedure: 'RLD Utilization Matrix', planned: '8.00', assignedTo: 'Lucas Meyer', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-06-03', date: '2024-06-03', status: 'Approved', submitted: '2024-06-04' },
  //         { deliverableSlNo: '1.6', slNo: '1.6.2', task: 'RMP MA holder selection & COO Finalization', predecessor: '1.6.1', applicability: 'All Products', taskCode: 'TC-1602', jobCode: 'ACT13', effort: '40', duration: '5', description: 'Reference Medicinal Product MA holder sourcing and Country of Origin confirmation', procedure: 'Sourcing SOP', planned: '40.00', assignedTo: 'Grace O\'Connor', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-06-05', date: '2024-06-05', status: 'Approved', submitted: '2024-06-10' },
  //         { deliverableSlNo: '1.6', slNo: '1.6.3', task: 'ITL for RLD processing & approval', predecessor: '1.6.2', applicability: 'All Products', taskCode: 'TC-1603', jobCode: 'ACT14', effort: '240', duration: '30', description: 'Import Test License application, tracking and regulatory approval for RLD', procedure: 'Import License SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '120.00', scheduled: '2024-06-11', date: '2024-06-11', status: 'In Progress', submitted: '-' }
  //       ],
  //       // 1.7 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.7', slNo: '1.7.1', task: 'API utililzation brake up', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-1701', jobCode: 'ACT15', effort: '8', duration: '1', description: 'Active Pharmaceutical Ingredient batch quantity utilization break-up', procedure: 'API Allocation Matrix', planned: '8.00', assignedTo: 'Lucas Meyer', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-06-03', date: '2024-06-03', status: 'Approved', submitted: '2024-06-04' },
  //         { deliverableSlNo: '1.7', slNo: '1.7.2', task: 'API vendor finalization', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-1702', jobCode: 'ACT16', effort: '40', duration: '5', description: 'API vendor audit, DMF check and commercial qualification', procedure: 'Vendor Audit SOP', planned: '40.00', assignedTo: 'Grace O\'Connor', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-06-03', date: '2024-06-03', status: 'Approved', submitted: '2024-06-08' },
  //         { deliverableSlNo: '1.7', slNo: '1.7.3', task: 'ITL for API processing & approval', predecessor: '1.7.2', applicability: 'All Products', taskCode: 'TC-1703', jobCode: 'ACT17', effort: '240', duration: '30', description: 'Import Test License application and processing for developmental API lots', procedure: 'Import License SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '60.00', cost: '6000.00', worked: '60.00', remaining: '180.00', scheduled: '2024-06-09', date: '2024-06-09', status: 'In Progress', submitted: '-' }
  //       ],
  //       // 1.8 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.8', slNo: '1.8.1', task: 'Manufacturing Formula & Process', predecessor: '1.5.3', applicability: 'All Products', taskCode: 'TC-1801', jobCode: 'ACT18', effort: '16', duration: '2', description: 'Form-29 specific manufacturing formula and pilot plant processing instructions', procedure: 'Form-29 Batch SOP', planned: '16.00', assignedTo: 'Marcus Vance', assigned: '16.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '16.00', scheduled: '2024-07-12', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.8', slNo: '1.8.2', task: 'FP specifications, STP & Stability data', predecessor: '1.5.3', applicability: 'All Products', taskCode: 'TC-1802', jobCode: 'ACT19', effort: '24', duration: '3', description: 'Finished product specs, testing protocols and stability summary for Form-29', procedure: 'STP Summary SOP', planned: '24.00', assignedTo: 'Priya Sharma', assigned: '24.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '24.00', scheduled: '2024-07-12', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.8', slNo: '1.8.3', task: 'Application processing & Other administrative Documents', predecessor: '1.8.2', applicability: 'All Products', taskCode: 'TC-1803', jobCode: 'ACT20', effort: '240', duration: '30', description: 'State Licensing Authority Form-29 manufacturing permission submission', procedure: 'Form-29 Regulatory SOP', planned: '240.00', assignedTo: 'Grace O\'Connor', assigned: '240.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '240.00', scheduled: '2024-07-15', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       // 1.9 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.9', slNo: '1.9.1', task: 'Batch size confirmation ; API & Formulation reconcilation', predecessor: '1.8.3', applicability: 'All Products', taskCode: 'TC-1901', jobCode: 'ACT21', effort: '16', duration: '2', description: 'Clinical BE batch size confirmation and API formulation quantity reconciliation', procedure: 'Batch Reconciliation SOP', planned: '16.00', assignedTo: 'Carlos Santana', assigned: '16.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '16.00', scheduled: '2024-08-15', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.9', slNo: '1.9.2', task: 'Application processing & Other administrative Documents', predecessor: '1.9.1', applicability: 'All Products', taskCode: 'TC-1902', jobCode: 'ACT22', effort: '240', duration: '30', description: 'CDSCO CT-14 / CT-11 regulatory permission filing for BE batch manufacturing', procedure: 'CT-14 Dossier SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '240.00', scheduled: '2024-08-18', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       // 1.10 Deliverable Activities
  //       [
  //         { deliverableSlNo: '1.10', slNo: '1.10', task: 'New product information to be sent to plant', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-11001', jobCode: 'ACT23', effort: '8', duration: '1', description: 'Handover of new product initiation package and regulatory license copy to manufacturing plant', procedure: 'Plant Handover SOP', planned: '8.00', assignedTo: 'Olivia Brown', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-06-03', date: '2024-06-03', status: 'Approved', submitted: '2024-06-04' }
  //       ]
  //     ]
  //   },

  //   // S3 - Procurement of API, RM & Packaging materials - For Developmental studies.
  //   'S3': {
  //     sidebarMenus: [
  //       { slNo: '2.1', name: 'Procurement - Developmental studies', count: 6, isOpen: true }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '2.1', slNo: '2.1.1', task: 'API Procurement for Developmental studies', predecessor: '1.7.3', applicability: 'All Products', taskCode: 'TC-2101', jobCode: 'PROC1', effort: '240', duration: '30', description: 'API Procurement for Developmental studies', procedure: 'API Procurement SOP', planned: '240.00', assignedTo: 'Elena Rostova', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-06-01', date: '2024-06-01', status: 'Approved', submitted: '2024-06-30' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.2', task: 'RLD Procurement for Developmental studies', predecessor: '1.6.3', applicability: 'All Products', taskCode: 'TC-2102', jobCode: 'PROC2', effort: '480', duration: '60', description: 'RLD Procurement for Developmental studies', procedure: 'RLD Procurement SOP', planned: '480.00', assignedTo: 'Marcus Vance', assigned: '480.00', actual: '240.00', cost: '48000.00', worked: '240.00', remaining: '240.00', scheduled: '2024-06-01', date: '2024-06-01', status: 'In Progress', submitted: '-' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.3', task: 'Raw material Procurement for Developmental studies', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-2103', jobCode: 'PROC3', effort: '240', duration: '30', description: 'Raw material Procurement for Developmental studies', procedure: 'RM Procurement SOP', planned: '240.00', assignedTo: 'Priya Sharma', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-06-01', date: '2024-06-01', status: 'Approved', submitted: '2024-06-30' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.4', task: 'Packaging materials Procurement for Developmental studies', predecessor: '1.2', applicability: 'All Products', taskCode: 'TC-2104', jobCode: 'PROC4', effort: '240', duration: '30', description: 'Packaging materials Procurement for Developmental studies', procedure: 'Packaging Sourcing SOP', planned: '240.00', assignedTo: 'Olivia Brown', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-06-01', date: '2024-06-01', status: 'Approved', submitted: '2024-06-30' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.5', task: 'Analytical Requirements Procurement - API for Developmental studies', predecessor: '1.7.2', applicability: 'All Products', taskCode: 'TC-2105', jobCode: 'PROC5', effort: '240', duration: '30', description: 'Analytical Requirements Procurement - API for Developmental studies', procedure: 'Analytical Standards SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '120.00', cost: '24000.00', worked: '120.00', remaining: '120.00', scheduled: '2024-06-01', date: '2024-06-01', status: 'In Progress', submitted: '-' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.6', task: 'Analytical Requirements Procurement for Developmental studies - Finished product', predecessor: '1.7.2', applicability: 'All Products', taskCode: 'TC-2106', jobCode: 'PROC6', effort: '240', duration: '30', description: 'Analytical Requirements Procurement for Developmental studies - Finished product', procedure: 'Analytical Standards SOP', planned: '240.00', assignedTo: 'Sunil Verma', assigned: '240.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '240.00', scheduled: '2024-06-01', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },

  //   // S4 - Formulation Development Phase 1: POC completion
  //   'S4': {
  //     sidebarMenus: [
  //       { slNo: '3.1', name: 'API Characterization and IH CoA release', count: 4, isOpen: true },
  //       { slNo: '3.2', name: 'RMP Characterization: Physical and Chemical', count: 2, isOpen: false },
  //       { slNo: '3.3', name: 'Tablet tooling & blister change part development & procument', count: 2, isOpen: false },
  //       { slNo: '3.4', name: 'Analytical Method Development (AMD): API & FP', count: 3, isOpen: false },
  //       { slNo: '3.5', name: 'Formulation Development', count: 14, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 3.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '3.1', slNo: '3.1.1', task: 'API Analysis', predecessor: '2.1.1', applicability: 'All Products', taskCode: 'TC-3101', jobCode: 'FORM1', effort: '48', duration: '6', description: 'API Analysis and raw physical-chemical evaluation', procedure: 'API Analysis SOP', planned: '48.00', assignedTo: 'Olivia Brown', assigned: '48.00', actual: '48.00', cost: '4800.00', worked: '48.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-07' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.2', task: 'IH CoA Release', predecessor: '3.1.1', applicability: 'All Products', taskCode: 'TC-3102', jobCode: 'FORM2', effort: '8', duration: '1', description: 'In-house Certificate of Analysis release for active substance', procedure: 'CoA Release SOP', planned: '8.00', assignedTo: 'Aarav Shah', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-07-07', date: '2024-07-07', status: 'Approved', submitted: '2024-07-08' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.3', task: 'API testing at out source laboratory', predecessor: '2.1.1', applicability: 'All Products', taskCode: 'TC-3103', jobCode: 'FORM3', effort: '56', duration: '7', description: 'Specialized API testing at external certified CRO laboratory', procedure: 'Outsource Lab Testing SOP', planned: '56.00', assignedTo: 'Diego Ruiz', assigned: '56.00', actual: '56.00', cost: '5600.00', worked: '56.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-08' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.4', task: 'API test methods and specifications Finalization', predecessor: '3.1.2', applicability: 'All Products', taskCode: 'TC-3104', jobCode: 'FORM4', effort: '24', duration: '3', description: 'Finalize internal analytical methods and specifications for API', procedure: 'Spec Finalization SOP', planned: '24.00', assignedTo: 'Olivia Brown', assigned: '24.00', actual: '24.00', cost: '2400.00', worked: '24.00', remaining: '0.00', scheduled: '2024-07-08', date: '2024-07-08', status: 'Approved', submitted: '2024-07-11' }
  //       ],
  //       // 3.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '3.2', slNo: '3.2.1', task: 'RMP Physical Characterization', predecessor: '2.1.2', applicability: 'All Products', taskCode: 'TC-3201', jobCode: 'FORM5', effort: '16', duration: '2', description: 'Reference Medicinal Product appearance, dimensions, and physical properties', procedure: 'Physical Testing SOP', planned: '16.00', assignedTo: 'Sachin Patil', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-03' },
  //         { deliverableSlNo: '3.2', slNo: '3.2.2', task: 'RMP Chemical Characterization', predecessor: '2.1.2', applicability: 'All Products', taskCode: 'TC-3202', jobCode: 'FORM6', effort: '56', duration: '7', description: 'Reference Medicinal Product assay, impurities, and chemical profiling', procedure: 'Chemical Profiling SOP', planned: '56.00', assignedTo: 'Avi Paul', assigned: '56.00', actual: '56.00', cost: '5600.00', worked: '56.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-08' }
  //       ],
  //       // 3.3 Deliverable Activities
  //       [
  //         { deliverableSlNo: '3.3', slNo: '3.3.1', task: 'Tablet Tooling Procurement', predecessor: '2.1.2', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-3301', jobCode: 'FORM7', effort: '160', duration: '20', description: 'Punch tooling design and manufacturing for pilot compaction press', procedure: 'Tooling Spec SOP', planned: '160.00', assignedTo: 'David Park', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-20' },
  //         { deliverableSlNo: '3.3', slNo: '3.3.2', task: 'Blister change parts Procurement', predecessor: '2.1.2', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-3302', jobCode: 'FORM8', effort: '240', duration: '30', description: 'Blister packing machine forming and sealing change parts procurement', procedure: 'Packaging Change Part SOP', planned: '240.00', assignedTo: 'Elena Rostova', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-30' }
  //       ],
  //       // 3.4 Deliverable Activities
  //       [
  //         { deliverableSlNo: '3.4', slNo: '3.4.1', task: 'Prototype formulation shall be submitted for method development', predecessor: '2.1.1', applicability: 'All Products', taskCode: 'TC-3401', jobCode: 'FORM9', effort: '24', duration: '3', description: 'Submit prototype formulation blend for analytical development', procedure: 'Method Handover SOP', planned: '24.00', assignedTo: 'Marcus Vance', assigned: '24.00', actual: '24.00', cost: '2400.00', worked: '24.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-04' },
  //         { deliverableSlNo: '3.4', slNo: '3.4.2', task: 'Tentative Speicification of FP', predecessor: '2.1.1', applicability: 'All Products', taskCode: 'TC-3402', jobCode: 'FORM10', effort: '16', duration: '2', description: 'Draft preliminary finished product release specifications', procedure: 'Tentative Spec SOP', planned: '16.00', assignedTo: 'Priya Sharma', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-07-01', date: '2024-07-01', status: 'Approved', submitted: '2024-07-03' },
  //         { deliverableSlNo: '3.4', slNo: '3.4.3', task: 'Tentative methods finalization', predecessor: '3.4.2', applicability: 'All Products', taskCode: 'TC-3403', jobCode: 'FORM11', effort: '240', duration: '30', description: 'Finalize tentative testing methods for POC trials', procedure: 'Analytical Method Protocol', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-07-04', date: '2024-07-04', status: 'Approved', submitted: '2024-08-03' }
  //       ],
  //       // 3.5 Deliverable Activities
  //       [
  //         { deliverableSlNo: '3.5', slNo: '3.5.1', task: 'Pre-formulation studies - API Characterization including Solubility studies, RS, PSD, XRD etc - Drug-excipient', predecessor: '3.4.3', applicability: 'All Products', taskCode: 'TC-3501', jobCode: 'FORM12', effort: '360', duration: '45', description: 'Comprehensive pre-formulation, XRD, PSD and drug-excipient compatibility', procedure: 'Preformulation Protocol', planned: '360.00', assignedTo: 'Lucas Meyer', assigned: '360.00', actual: '360.00', cost: '36000.00', worked: '360.00', remaining: '0.00', scheduled: '2024-08-04', date: '2024-08-04', status: 'Approved', submitted: '2024-09-18' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.2', task: 'Selection of manufacturing process trials', predecessor: '3.4.3', applicability: 'All Products', taskCode: 'TC-3502', jobCode: 'FORM13', effort: '40', duration: '5', description: 'Trial and select granulation/direct compression unit operations', procedure: 'Process Selection SOP', planned: '40.00', assignedTo: 'Carlos Santana', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-08-04', date: '2024-08-04', status: 'Approved', submitted: '2024-08-09' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.3', task: 'Drug substance particle selection trials', predecessor: '3.5.2', applicability: 'All Products', taskCode: 'TC-3503', jobCode: 'FORM14', effort: '40', duration: '5', description: 'API particle size distribution optimization for flow and dissolution', procedure: 'Particle Size Screening SOP', planned: '40.00', assignedTo: 'Sunil Verma', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-08-10', date: '2024-08-10', status: 'Approved', submitted: '2024-08-15' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.4', task: 'Initial assessment of formulation variables & Lab scale trials', predecessor: '3.4.3', applicability: 'All Products', taskCode: 'TC-3504', jobCode: 'FORM15', effort: '16', duration: '2', description: 'Screen excipient concentration and core formulation variables', procedure: 'DOE Formulation Matrix', planned: '16.00', assignedTo: 'Grace O\'Connor', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-08-04', date: '2024-08-04', status: 'Approved', submitted: '2024-08-06' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.5', task: 'Multimedia dissolution mapping with reference product', predecessor: '3.5.3', applicability: 'All Products', taskCode: 'TC-3505', jobCode: 'FORM16', effort: '240', duration: '30', description: 'Dissolution profile comparison against Innovator RLD across pH buffers', procedure: 'Dissolution Profiling SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-08-16', date: '2024-08-16', status: 'Approved', submitted: '2024-09-15' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.6', task: 'Reverse Engeeniring of Referance Product (NDDS)', predecessor: '3.4.3', applicability: 'Complex Generics / NDDS Only', taskCode: 'TC-3506', jobCode: 'FORM17', effort: '360', duration: '45', description: 'De-formulation, polymer characterization and quantitative reverse engineering', procedure: 'Deformulation SOP', planned: '360.00', assignedTo: 'Carlos Santana', assigned: '360.00', actual: '360.00', cost: '36000.00', worked: '360.00', remaining: '0.00', scheduled: '2024-08-04', date: '2024-08-04', status: 'Approved', submitted: '2024-09-18' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.7', task: 'POC for NDDS', predecessor: '3.5.6', applicability: 'Complex Generics / NDDS Only', taskCode: 'TC-3507', jobCode: 'FORM18', effort: '960', duration: '120', description: 'Proof of Concept milestone execution for Novel Drug Delivery System', procedure: 'NDDS POC Protocol', planned: '960.00', assignedTo: 'Dr. Rebecca Chen', assigned: '960.00', actual: '480.00', cost: '96000.00', worked: '480.00', remaining: '480.00', scheduled: '2024-09-19', date: '2024-09-19', status: 'In Progress', submitted: '-' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.8', task: 'Lyophilization Optimization', predecessor: '3.5.2', applicability: 'Lyophilized / Injectable Products Only', taskCode: 'TC-3508', jobCode: 'FORM19', effort: '480', duration: '60', description: 'Freeze drying cycle parameters, primary drying and secondary drying', procedure: 'Lyophilization Cycle SOP', planned: '480.00', assignedTo: 'Matteo Rossi', assigned: '480.00', actual: '480.00', cost: '48000.00', worked: '480.00', remaining: '0.00', scheduled: '2024-08-10', date: '2024-08-10', status: 'Approved', submitted: '2024-10-09' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.9', task: 'Hold Time and Compatibility Studies', predecessor: '3.5.8', applicability: 'All Products', taskCode: 'TC-3509', jobCode: 'FORM20', effort: '120', duration: '15', description: 'Bulk blend and core tablet in-process hold time stability study', procedure: 'Hold Time Protocol', planned: '120.00', assignedTo: 'Sarah Jenkins', assigned: '120.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '0.00', scheduled: '2024-10-10', date: '2024-10-10', status: 'Approved', submitted: '2024-10-25' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.10', task: '3M Lab scale stability data generation', predecessor: '3.5.4', applicability: 'All Products', taskCode: 'TC-3510', jobCode: 'FORM21', effort: '800', duration: '100', description: '3-Month accelerated and real-time lab stability analysis of prototype lots', procedure: 'ICH Stability Protocol', planned: '800.00', assignedTo: 'Lucas Meyer', assigned: '800.00', actual: '800.00', cost: '80000.00', worked: '800.00', remaining: '0.00', scheduled: '2024-08-07', date: '2024-08-07', status: 'Approved', submitted: '2024-11-15' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.11', task: 'Filter Validation study', predecessor: '3.5.10', applicability: 'Lyophilized / Injectable Products Only', taskCode: 'TC-3511', jobCode: 'FORM22', effort: '480', duration: '60', description: 'Sterile filter membrane compatibility, retention and extractable study', procedure: 'Filter Validation Protocol', planned: '480.00', assignedTo: 'Sarah Jenkins', assigned: '480.00', actual: '480.00', cost: '48000.00', worked: '480.00', remaining: '0.00', scheduled: '2024-11-16', date: '2024-11-16', status: 'Approved', submitted: '2025-01-15' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.12', task: 'Optimization/ pre validation of methods', predecessor: '3.5.10', applicability: 'All Products', taskCode: 'TC-3512', jobCode: 'FORM23', effort: '240', duration: '30', description: 'Pre-validation of chromatographic assay, dissolution and degradation methods', procedure: 'Method Prevalidation SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-11-16', date: '2024-11-16', status: 'Approved', submitted: '2024-12-16' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.13', task: 'Method development reports', predecessor: '3.5.10', applicability: 'All Products', taskCode: 'TC-3513', jobCode: 'FORM24', effort: '240', duration: '30', description: 'Compile analytical method development reports (AMDR)', procedure: 'AMDR Template', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-11-16', date: '2024-11-16', status: 'Approved', submitted: '2024-12-16' },
  //         { deliverableSlNo: '3.5', slNo: '3.5.14', task: 'Development Stability Analysis of 6M samples', predecessor: '3.5.4', applicability: 'All Products', taskCode: 'TC-3514', jobCode: 'FORM25', effort: '1440', duration: '180', description: '6-Month lab stability testing and completion of POC report', procedure: '6M Stability SOP', planned: '1440.00', assignedTo: 'Lucas Meyer', assigned: '1440.00', actual: '720.00', cost: '144000.00', worked: '720.00', remaining: '720.00', scheduled: '2024-08-07', date: '2024-08-07', status: 'In Progress', submitted: '-' }
  //       ]
  //     ]
  //   },

  //   // S5 - Procurement of API, Raw materials & Packaging materials - For Ebs
  //   'S5': {
  //     sidebarMenus: [
  //       { slNo: '4.1', name: 'Procurement package', count: 1, isOpen: true },
  //       { slNo: '4.2', name: 'Procurement - Submission batches', count: 9, isOpen: false },
  //       { slNo: '4.3', name: 'Release of API, RM and PM', count: 2, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 4.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '4.1', slNo: '4.1.1', task: 'Procurement package', predecessor: '3.5.10', applicability: 'All Products', taskCode: 'TC-4101', jobCode: 'PROC1', effort: '8', duration: '1', description: 'Procurement package finalization for exhibit batches', procedure: 'Procurement Package SOP', planned: '8.00', assignedTo: 'Olivia Brown', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-02' }
  //       ],
  //       // 4.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '4.2', slNo: '4.2.1', task: 'BOM for RM including API', predecessor: '4.1', applicability: 'All Products', taskCode: 'TC-4201', jobCode: 'PROC2', effort: '8', duration: '1', description: 'Bill of Materials for Raw Materials including API', procedure: 'BOM Preparation SOP', planned: '8.00', assignedTo: 'Aarav Shah', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-09-02', date: '2024-09-02', status: 'Approved', submitted: '2024-09-03' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.2', task: 'BOM for PM', predecessor: '4.1', applicability: 'All Products', taskCode: 'TC-4202', jobCode: 'PROC3', effort: '8', duration: '1', description: 'Bill of Materials for Packaging Materials', procedure: 'BOM Preparation SOP', planned: '8.00', assignedTo: 'Diego Ruiz', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2024-09-02', date: '2024-09-02', status: 'Approved', submitted: '2024-09-03' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.3', task: 'API Procurement', predecessor: '4.1', applicability: 'All Products', taskCode: 'TC-4203', jobCode: 'PROC4', effort: '360', duration: '45', description: 'Procurement of Active Pharmaceutical Ingredient', procedure: 'API Procurement SOP', planned: '360.00', assignedTo: 'Elena Rostova', assigned: '360.00', actual: '360.00', cost: '36000.00', worked: '360.00', remaining: '0.00', scheduled: '2024-09-02', date: '2024-09-02', status: 'Approved', submitted: '2024-10-17' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.4', task: 'RLD Procurement', predecessor: '5.1.4', applicability: 'All Products', taskCode: 'TC-4204', jobCode: 'PROC5', effort: '240', duration: '30', description: 'Procurement of Reference Listed Drug for submission batches', procedure: 'RLD Sourcing Protocol', planned: '240.00', assignedTo: 'Marcus Vance', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-09-02', date: '2024-09-02', status: 'Approved', submitted: '2024-10-02' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.5', task: 'Raw material Procurement', predecessor: '4.2.1', applicability: 'All Products', taskCode: 'TC-4205', jobCode: 'PROC6', effort: '360', duration: '45', description: 'Procurement of excipients and raw materials', procedure: 'RM Sourcing Protocol', planned: '360.00', assignedTo: 'Priya Sharma', assigned: '360.00', actual: '360.00', cost: '36000.00', worked: '360.00', remaining: '0.00', scheduled: '2024-09-03', date: '2024-09-03', status: 'Approved', submitted: '2024-10-18' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.6', task: 'Packaging materials Procurement', predecessor: '4.2.1', applicability: 'All Products', taskCode: 'TC-4206', jobCode: 'PROC7', effort: '480', duration: '60', description: 'Primary and secondary packaging materials procurement', procedure: 'PM Sourcing Protocol', planned: '480.00', assignedTo: 'Olivia Brown', assigned: '480.00', actual: '480.00', cost: '48000.00', worked: '480.00', remaining: '0.00', scheduled: '2024-09-03', date: '2024-09-03', status: 'Approved', submitted: '2024-11-02' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.7', task: 'Analytical Requirements Procurement - API & FP', predecessor: '4.2.1', applicability: 'All Products', taskCode: 'TC-4207', jobCode: 'PROC8', effort: '240', duration: '30', description: 'Working standards, impurities and column procurement', procedure: 'Analytical Standards SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-09-03', date: '2024-09-03', status: 'Approved', submitted: '2024-10-03' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.8', task: 'Packing Change part Procurement & Its Qualification', predecessor: '4.2.1', applicability: 'All Products', taskCode: 'TC-4208', jobCode: 'PROC9', effort: '240', duration: '30', description: 'Packaging line change parts procurement and qualification', procedure: 'Change Parts Qualification SOP', planned: '240.00', assignedTo: 'Sunil Verma', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-09-03', date: '2024-09-03', status: 'Approved', submitted: '2024-10-03' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.9', task: 'Toolings procurement & Qualification', predecessor: '4.2.1', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-4209', jobCode: 'PROC10', effort: '120', duration: '15', description: 'Commercial tooling procurement and qualification', procedure: 'Tooling Qualification SOP', planned: '120.00', assignedTo: 'David Park', assigned: '120.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '0.00', scheduled: '2024-09-03', date: '2024-09-03', status: 'Approved', submitted: '2024-09-18' }
  //       ],
  //       // 4.3 Deliverable Activities
  //       [
  //         { deliverableSlNo: '4.3', slNo: '4.3.1', task: 'Release of API', predecessor: '4.2.3', applicability: 'All Products', taskCode: 'TC-4301', jobCode: 'PROC11', effort: '80', duration: '10', description: 'Quality control testing and release of API lot for submission batch', procedure: 'API Release SOP', planned: '80.00', assignedTo: 'Lucas Meyer', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2024-10-18', date: '2024-10-18', status: 'Approved', submitted: '2024-10-28' },
  //         { deliverableSlNo: '4.3', slNo: '4.3.2', task: 'Release of RM and PM', predecessor: '4.2.5', applicability: 'All Products', taskCode: 'TC-4302', jobCode: 'PROC12', effort: '120', duration: '15', description: 'QC inspection, sampling, analysis and release of RM and PM', procedure: 'RM/PM Release SOP', planned: '120.00', assignedTo: 'Sarah Jenkins', assigned: '120.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '0.00', scheduled: '2024-10-19', date: '2024-10-19', status: 'Approved', submitted: '2024-11-03' }
  //       ]
  //     ]
  //   },

  //   // S6 - Formulation Development Phase 2: Pilot Bio
  //   'S6': {
  //     sidebarMenus: [
  //       { slNo: '5.1', name: 'Bio eqquivalence study Requirements', count: 5, isOpen: true },
  //       { slNo: '5.2', name: 'Pilot BE (Test & RMP IP\'s submission and study execution)', count: 1, isOpen: false },
  //       { slNo: '5.3', name: 'Qbd - Formulation optimiztion trials', count: 5, isOpen: false },
  //       { slNo: '5.4', name: 'QBD trials- Manufacturing process development', count: 8, isOpen: false },
  //       { slNo: '5.5', name: 'Scale Up', count: 4, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 5.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '5.1', slNo: '5.1.1', task: 'Pilot & Demonstration-Scale Campaign NOC documents submission', predecessor: '3.5.10', applicability: 'All Products', taskCode: 'TC-5101', jobCode: 'PBE1', effort: '40', duration: '5', description: 'Submit BE NOC documentation to ethics committee and regulatory authorities', procedure: 'BE NOC Submission Protocol', planned: '40.00', assignedTo: 'Olivia Brown', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-06' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.2', task: 'BE study Design & Protocol Finalization', predecessor: '3.5.10', applicability: 'All Products', taskCode: 'TC-5102', jobCode: 'PBE2', effort: '40', duration: '5', description: 'Finalize clinical study design, sample size and protocol', procedure: 'BE Protocol Design SOP', planned: '40.00', assignedTo: 'Aarav Shah', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-06' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.3', task: 'BE NOC application filing & Approval', predecessor: '5.1.2', applicability: 'All Products', taskCode: 'TC-5103', jobCode: 'PBE3', effort: '240', duration: '30', description: 'File BE NOC application and obtain regulatory approval', procedure: 'Regulatory Filing SOP', planned: '240.00', assignedTo: 'Diego Ruiz', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-09-06', date: '2024-09-06', status: 'Approved', submitted: '2024-10-06' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.4', task: 'RLD import license - Form 11 for Pivotal studies', predecessor: '5.1.2', applicability: 'All Products', taskCode: 'TC-5104', jobCode: 'PBE4', effort: '120', duration: '15', description: 'Obtain Form 11 RLD import license for pivotal clinical batches', procedure: 'Form 11 Application SOP', planned: '120.00', assignedTo: 'Elena Rostova', assigned: '120.00', actual: '120.00', cost: '12000.00', worked: '120.00', remaining: '0.00', scheduled: '2024-09-06', date: '2024-09-06', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.5', task: 'Innovator product procurement for Demonstration-Scale Campaign studies', predecessor: '5.1.4', applicability: 'All Products', taskCode: 'TC-5105', jobCode: 'PBE5', effort: '240', duration: '30', description: 'Procure innovator reference batches for pivotal study', procedure: 'Innovator Procurement SOP', planned: '240.00', assignedTo: 'Marcus Vance', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-09-21', date: '2024-09-21', status: 'Approved', submitted: '2024-10-21' }
  //       ],
  //       // 5.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '5.2', slNo: '5.2.1', task: 'Pilot BE (Test & RMP IP\'s submission and study execution)', predecessor: '5.1.3', applicability: 'All Products', taskCode: 'TC-5201', jobCode: 'PBE6', effort: '480', duration: '60', description: 'Investigational Product dosing, bioanalysis and PK parameter calculation', procedure: 'Pilot BE Protocol', planned: '480.00', assignedTo: 'Dr. Rebecca Chen', assigned: '480.00', actual: '480.00', cost: '48000.00', worked: '480.00', remaining: '0.00', scheduled: '2024-10-07', date: '2024-10-07', status: 'Approved', submitted: '2024-12-06' }
  //       ],
  //       // 5.3 Deliverable Activities
  //       [
  //         { deliverableSlNo: '5.3', slNo: '5.3.1', task: 'Optimization of Binder concentration', predecessor: '3.5.12', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5301', jobCode: 'PBE7', effort: '160', duration: '20', description: 'Evaluate effect of binder levels on granule strength and dissolution', procedure: 'Binder Optimization SOP', planned: '160.00', assignedTo: 'Lucas Meyer', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.3', slNo: '5.3.2', task: 'Optimization of Disintegrant concentration', predecessor: '3.5.12', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5302', jobCode: 'PBE8', effort: '160', duration: '20', description: 'Disintegration time and dissolution rate optimization', procedure: 'Disintegrant Study SOP', planned: '160.00', assignedTo: 'Priya Sharma', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.3', slNo: '5.3.3', task: 'optimization of diluent concentration', predecessor: '3.5.12', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5303', jobCode: 'PBE9', effort: '160', duration: '20', description: 'Filler-binder ratio screening for compressibility and blend uniformity', procedure: 'Diluent Study SOP', planned: '160.00', assignedTo: 'Carlos Santana', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.3', slNo: '5.3.4', task: 'Optimzation of Glidant concentration', predecessor: '3.5.12', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5304', jobCode: 'PBE10', effort: '160', duration: '20', description: 'Flow properties, angle of repose and Carr\'s index optimization', procedure: 'Glidant Screening Protocol', planned: '160.00', assignedTo: 'Sunil Verma', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.3', slNo: '5.3.5', task: 'Optimization of Lubricant concentration', predecessor: '3.5.12', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5305', jobCode: 'PBE11', effort: '160', duration: '20', description: 'Ejection force and dissolution profile testing across lubrication times', procedure: 'Lubricant Study SOP', planned: '160.00', assignedTo: 'David Park', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' }
  //       ],
  //       // 5.4 Deliverable Activities
  //       [
  //         { deliverableSlNo: '5.4', slNo: '5.4.1', task: 'optimization of Homogenization cycle', predecessor: '3.5.12', applicability: 'Complex Generics / NDDS Only', taskCode: 'TC-5401', jobCode: 'PBE12', effort: '160', duration: '20', description: 'High-pressure homogenization pressure and cycle optimization', procedure: 'Homogenization SOP', planned: '160.00', assignedTo: 'Carlos Santana', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.2', task: 'Specific Filtration system including TFF', predecessor: '3.5.12', applicability: 'Complex Generics / NDDS Only', taskCode: 'TC-5402', jobCode: 'PBE13', effort: '160', duration: '20', description: 'Tangential flow filtration (TFF) parameter testing', procedure: 'TFF Protocol', planned: '160.00', assignedTo: 'Sarah Jenkins', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.3', task: 'Specific activities / processes Optimization related to NDDS', predecessor: '3.5.12', applicability: 'Complex Generics / NDDS Only', taskCode: 'TC-5403', jobCode: 'PBE14', effort: '160', duration: '20', description: 'Targeted delivery vehicle and nanoparticle size stabilization', procedure: 'NDDS Optimization SOP', planned: '160.00', assignedTo: 'Dr. Rebecca Chen', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-01', date: '2024-09-01', status: 'Approved', submitted: '2024-09-21' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.4', task: 'Optimization of Fluid uptake', predecessor: '5.3.5', applicability: 'All Products', taskCode: 'TC-5404', jobCode: 'PBE15', effort: '160', duration: '20', description: 'Fluid bed spray rate and drying temperature DOE', procedure: 'Granulation Fluid SOP', planned: '160.00', assignedTo: 'Lucas Meyer', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-22', date: '2024-09-22', status: 'Approved', submitted: '2024-10-12' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.5', task: 'Optimization of Granulation parameters', predecessor: '5.3.5', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5405', jobCode: 'PBE16', effort: '160', duration: '20', description: 'Impeller speed, chopper speed and kneading duration optimization', procedure: 'RMG Granulation SOP', planned: '160.00', assignedTo: 'Lucas Meyer', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-22', date: '2024-09-22', status: 'Approved', submitted: '2024-10-12' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.6', task: 'Optimization of milling process', predecessor: '5.3.5', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5406', jobCode: 'PBE17', effort: '160', duration: '20', description: 'Comill screen size and impeller speed selection', procedure: 'Milling Optimization SOP', planned: '160.00', assignedTo: 'David Park', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-22', date: '2024-09-22', status: 'Approved', submitted: '2024-10-12' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.7', task: 'Optimization of Blending time', predecessor: '5.3.5', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5407', jobCode: 'PBE18', effort: '160', duration: '20', description: 'Octagonal blender speed and revolution count uniformity testing', procedure: 'Blending Validation SOP', planned: '160.00', assignedTo: 'Avi Paul', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-22', date: '2024-09-22', status: 'Approved', submitted: '2024-10-12' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.8', task: 'Optimization of Coating', predecessor: '5.3.5', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-5408', jobCode: 'PBE19', effort: '160', duration: '20', description: 'Pan speed, inlet temperature, spray rate and bed temperature DOE', procedure: 'Auto-Coater SOP', planned: '160.00', assignedTo: 'Sachin Patil', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2024-09-22', date: '2024-09-22', status: 'Approved', submitted: '2024-10-12' }
  //       ],
  //       // 5.5 Deliverable Activities
  //       [
  //         { deliverableSlNo: '5.5', slNo: '5.5.1', task: 'RM BOM for Scale up batch', predecessor: '4.2.3', applicability: 'All Products', taskCode: 'TC-5501', jobCode: 'PBE20', effort: '16', duration: '2', description: 'Scale-up batch Raw Materials Bill of Materials', procedure: 'BOM Protocol', planned: '16.00', assignedTo: 'Aarav Shah', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-10-18', date: '2024-10-18', status: 'Approved', submitted: '2024-10-20' },
  //         { deliverableSlNo: '5.5', slNo: '5.5.2', task: 'PM BOM for Scale up batch', predecessor: '4.2.3', applicability: 'All Products', taskCode: 'TC-5502', jobCode: 'PBE21', effort: '16', duration: '2', description: 'Scale-up batch Packaging Materials Bill of Materials', procedure: 'BOM Protocol', planned: '16.00', assignedTo: 'Diego Ruiz', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2024-10-18', date: '2024-10-18', status: 'Approved', submitted: '2024-10-20' },
  //         { deliverableSlNo: '5.5', slNo: '5.5.3', task: 'Scale Up batch Execution', predecessor: '5.5.2', applicability: 'All Products', taskCode: 'TC-5503', jobCode: 'PBE22', effort: '40', duration: '5', description: 'Execute pilot/scale-up batch in manufacturing facility', procedure: 'Batch Manufacturing Record', planned: '40.00', assignedTo: 'Marcus Vance', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-10-21', date: '2024-10-21', status: 'Approved', submitted: '2024-10-26' },
  //         { deliverableSlNo: '5.5', slNo: '5.5.4', task: 'Scale Up batch analysis and Report', predecessor: '5.5.3', applicability: 'All Products', taskCode: 'TC-5504', jobCode: 'PBE23', effort: '80', duration: '10', description: 'Analytical testing and scale-up execution report finalization', procedure: 'Scale-up Summary Report SOP', planned: '80.00', assignedTo: 'Dr. Rebecca Chen', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2024-10-27', date: '2024-10-27', status: 'Approved', submitted: '2024-11-06' }
  //       ]
  //     ]
  //   },

  //   // S7 - API Method Validation / verification
  //   'S7': {
  //     sidebarMenus: [
  //       { slNo: '6.1', name: 'Analytical Method Validation', count: 1, isOpen: true },
  //       { slNo: '6.2', name: 'Method Transfer and Cleaning Validation', count: 2, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 6.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '6.1', slNo: '6.1.1', task: 'API Analytical Method Validation', predecessor: '3.5.12', applicability: 'All Products', taskCode: 'TC-6101', jobCode: 'VAL1', effort: '240', duration: '30', description: 'Perform linearity, accuracy, precision, LOD, LOQ and robustness for API assay/RS', procedure: 'ICH Q2(R1) Validation SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-11-16', date: '2024-11-16', status: 'Approved', submitted: '2024-12-16' }
  //       ],
  //       // 6.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '6.2', slNo: '6.2.1', task: 'Method Transfer', predecessor: '7.1.2', applicability: 'All Products', taskCode: 'TC-6201', jobCode: 'VAL2', effort: '56', duration: '7', description: 'Analytical method transfer to QC/Plant testing laboratory', procedure: 'Analytical Method Transfer Protocol', planned: '56.00', assignedTo: 'Elena Rostova', assigned: '56.00', actual: '56.00', cost: '5600.00', worked: '56.00', remaining: '0.00', scheduled: '2024-12-17', date: '2024-12-17', status: 'Approved', submitted: '2024-12-24' },
  //         { deliverableSlNo: '6.2', slNo: '6.2.2', task: 'Cleaning Validation', predecessor: '6.2.1', applicability: 'All Products', taskCode: 'TC-6202', jobCode: 'VAL3', effort: '24', duration: '3', description: 'Swab/rinse recovery, MACO limits verification and cleaning validation', procedure: 'Cleaning Validation Protocol', planned: '24.00', assignedTo: 'Lucas Meyer', assigned: '24.00', actual: '24.00', cost: '2400.00', worked: '24.00', remaining: '0.00', scheduled: '2024-12-25', date: '2024-12-25', status: 'Approved', submitted: '2024-12-28' }
  //       ]
  //     ]
  //   },

  //   // S8 - FP method validation, FP specifications & STP
  //   'S8': {
  //     sidebarMenus: [
  //       { slNo: '7.1', name: 'FP method validation, FP specifications & STP', count: 2, isOpen: true }
  //     ],
  //     modulesData: [
  //       // 7.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '7.1', slNo: '7.1.1', task: 'AMV Batch Submission', predecessor: '3.5.12', applicability: 'All Products', taskCode: 'TC-7101', jobCode: 'FPVAL1', effort: '40', duration: '5', description: 'Submit Analytical Method Validation (AMV) batch sample to QC', procedure: 'AMV Batch Protocol', planned: '40.00', assignedTo: 'Olivia Brown', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2024-12-01', date: '2024-12-01', status: 'Approved', submitted: '2024-12-06' },
  //         { deliverableSlNo: '7.1', slNo: '7.1.2', task: 'FP Analytical Method Validation', predecessor: '6.1.1', applicability: 'All Products', taskCode: 'TC-7102', jobCode: 'FPVAL2', effort: '240', duration: '30', description: 'Perform full validation of finished product assay, dissolution and RS methods', procedure: 'FP Method Validation SOP', planned: '240.00', assignedTo: 'Dr. Rebecca Chen', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-12-07', date: '2024-12-07', status: 'Approved', submitted: '2025-01-06' }
  //       ]
  //     ]
  //   },

  //   // S9 - TTD Submission
  //   'S9': {
  //     sidebarMenus: [
  //       { slNo: '8.1', name: 'Technology Transfer Documentation (TTD)', count: 6, isOpen: true }
  //     ],
  //     modulesData: [
  //       // 8.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '8.1', slNo: '8.1.1', task: 'Master Formula Card', predecessor: '7.1.2', applicability: 'All Products', taskCode: 'TC-8101', jobCode: 'TTD1', effort: '16', duration: '2', description: 'Compile Master Formula Card (MFC) with quantitative composition', procedure: 'MFC Preparation SOP', planned: '16.00', assignedTo: 'Aarav Shah', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2025-01-07', date: '2025-01-07', status: 'Approved', submitted: '2025-01-09' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.2', task: 'Master Packaging Card', predecessor: '7.1.2', applicability: 'All Products', taskCode: 'TC-8102', jobCode: 'TTD2', effort: '16', duration: '2', description: 'Compile Master Packaging Card (MPC) with bill of packaging materials', procedure: 'MPC Preparation SOP', planned: '16.00', assignedTo: 'Diego Ruiz', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2025-01-07', date: '2025-01-07', status: 'Approved', submitted: '2025-01-09' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.3', task: 'Stability plans: In-use/Routine/XRD studies/Multimedia / photo stability / Thermal cycling study', predecessor: '8.1.1', applicability: 'Lyophilized / Injectable Products Only', taskCode: 'TC-8103', jobCode: 'TTD3', effort: '40', duration: '5', description: 'Comprehensive stability protocol for all planned conditions', procedure: 'Stability Protocol SOP', planned: '40.00', assignedTo: 'Elena Rostova', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-01-10', date: '2025-01-10', status: 'Approved', submitted: '2025-01-15' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.4', task: 'Raw material specification & STP', predecessor: '7.1.2', applicability: 'All Products', taskCode: 'TC-8104', jobCode: 'TTD4', effort: '40', duration: '5', description: 'Release raw material specifications and Standard Testing Procedures', procedure: 'RM Specification SOP', planned: '40.00', assignedTo: 'Priya Sharma', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-01-07', date: '2025-01-07', status: 'Approved', submitted: '2025-01-12' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.5', task: 'Packing material specification & STP', predecessor: '7.1.2', applicability: 'All Products', taskCode: 'TC-8105', jobCode: 'TTD5', effort: '40', duration: '5', description: 'Release packaging material specifications and Standard Testing Procedures', procedure: 'PM Specification SOP', planned: '40.00', assignedTo: 'Olivia Brown', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-01-07', date: '2025-01-07', status: 'Approved', submitted: '2025-01-12' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.6', task: 'In-Process, finished & stability specification & STPs of the drug product', predecessor: '7.1.2', applicability: 'All Products', taskCode: 'TC-8106', jobCode: 'TTD6', effort: '80', duration: '10', description: 'Release IP, FP and stability specifications & STPs for exhibit batch manufacturing', procedure: 'Drug Product Specification SOP', planned: '80.00', assignedTo: 'Dr. Rebecca Chen', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-07', date: '2025-01-07', status: 'Approved', submitted: '2025-01-17' }
  //       ]
  //     ]
  //   },

  //   // S10 - Exhibit / Submission Batches execution
  //   'S10': {
  //     sidebarMenus: [
  //       { slNo: '9.1', name: 'Exhibit Batch readiness & execution', count: 22, isOpen: true },
  //       { slNo: '9.2', name: 'Data Generation On EB batches', count: 4, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 9.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '9.1', slNo: '9.1.1', task: 'Final Specifications preparation & Approval - Raw materials', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9101', jobCode: 'EB01', effort: '40', duration: '5', description: 'Finalize and approve raw material specifications', procedure: 'Spec Release SOP', planned: '40.00', assignedTo: 'Priya Sharma', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-23' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.2', task: 'Final Specifications preparation & Approval - Packaging materials', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9102', jobCode: 'EB02', effort: '40', duration: '5', description: 'Finalize and approve packaging material specifications', procedure: 'Spec Release SOP', planned: '40.00', assignedTo: 'Olivia Brown', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-23' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.3', task: 'Final Specifications preparation & Approval - Finished product', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9103', jobCode: 'EB03', effort: '80', duration: '10', description: 'Finalize and approve finished product release specifications', procedure: 'Spec Release SOP', planned: '80.00', assignedTo: 'Dr. Rebecca Chen', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.4', task: 'Routine stability protocol', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9104', jobCode: 'EB04', effort: '80', duration: '10', description: 'Prepare routine ICH stability protocol for 3 exhibit batches', procedure: 'ICH Protocol SOP', planned: '80.00', assignedTo: 'Lucas Meyer', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.5', task: 'In-Use Stability protocol', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9105', jobCode: 'EB05', effort: '80', duration: '10', description: 'Prepare in-use stability testing protocol', procedure: 'In-Use Stability SOP', planned: '80.00', assignedTo: 'Sarah Jenkins', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.6', task: 'Photo stability protocol', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9106', jobCode: 'EB06', effort: '80', duration: '10', description: 'Prepare photostability protocol as per ICH Q1B', procedure: 'Photostability SOP', planned: '80.00', assignedTo: 'Avi Paul', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.7', task: 'polymorphic stability protocol', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9107', jobCode: 'EB07', effort: '80', duration: '10', description: 'Prepare XRD polymorphic conversion stability protocol', procedure: 'Polymorphic Study SOP', planned: '80.00', assignedTo: 'Sachin Patil', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.8', task: 'Dissolution studies protocol', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9108', jobCode: 'EB08', effort: '80', duration: '10', description: 'Prepare comparative dissolution profiling protocol across media', procedure: 'Dissolution Protocol SOP', planned: '80.00', assignedTo: 'Dr. Rebecca Chen', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.9', task: 'Sub division of tablets study protocol', predecessor: '8.1.6', applicability: 'Tablets / Solid Oral Only', taskCode: 'TC-9109', jobCode: 'EB09', effort: '80', duration: '10', description: 'Prepare tablet score line splitability and uniformity protocol', procedure: 'Tablet Split Study SOP', planned: '80.00', assignedTo: 'David Park', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.10', task: 'Thermal cycling / Freeze thaw study protocol', predecessor: '8.1.6', applicability: 'Lyophilized / Injectable Products Only', taskCode: 'TC-9110', jobCode: 'EB10', effort: '80', duration: '10', description: 'Prepare freeze-thaw temperature excursion cycling protocol', procedure: 'Thermal Cycling Protocol', planned: '80.00', assignedTo: 'Matteo Rossi', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.11', task: 'Reconstitution and dilution studies protocol', predecessor: '8.1.6', applicability: 'Lyophilized / Injectable Products Only', taskCode: 'TC-9111', jobCode: 'EB11', effort: '80', duration: '10', description: 'Prepare reconstitution time and IV diluent compatibility protocol', procedure: 'Reconstitution Protocol', planned: '80.00', assignedTo: 'Sarah Jenkins', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.12', task: 'Preparation & approval of Process validation Protocols', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9112', jobCode: 'EB12', effort: '80', duration: '10', description: 'Prepare and approve commercial process validation protocols', procedure: 'Process Validation SOP', planned: '80.00', assignedTo: 'Marcus Vance', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.13', task: 'Preparation & approval of Hold time study Protocols', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9113', jobCode: 'EB13', effort: '80', duration: '10', description: 'Prepare bulk blend/core tablet hold time protocol for exhibit batch', procedure: 'Hold Time SOP', planned: '80.00', assignedTo: 'Carlos Santana', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.14', task: 'Preparation & Approval of BMRs', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9114', jobCode: 'EB14', effort: '80', duration: '10', description: 'Prepare and release master Batch Manufacturing Records (BMR)', procedure: 'BMR Release SOP', planned: '80.00', assignedTo: 'Aarav Shah', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.15', task: 'Preparation & Approval of BPRs', predecessor: '8.1.6', applicability: 'All Products', taskCode: 'TC-9115', jobCode: 'EB15', effort: '80', duration: '10', description: 'Prepare and release master Batch Packaging Records (BPR)', procedure: 'BPR Release SOP', planned: '80.00', assignedTo: 'Diego Ruiz', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-01-18', date: '2025-01-18', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.16', task: 'Process Order Creation as per BMR', predecessor: '9.1.14 (-1)', applicability: 'All Products', taskCode: 'TC-9116', jobCode: 'EB16', effort: '8', duration: '1', description: 'Create SAP/ERP Process Orders for BMR manufacturing', procedure: 'ERP Order SOP', planned: '8.00', assignedTo: 'Sunil Verma', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2025-01-27', date: '2025-01-27', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.17', task: 'Process Order Creation as per BPR', predecessor: '9.1.15 (-1)', applicability: 'All Products', taskCode: 'TC-9117', jobCode: 'EB17', effort: '8', duration: '1', description: 'Create SAP/ERP Process Orders for BPR packaging', procedure: 'ERP Order SOP', planned: '8.00', assignedTo: 'Sunil Verma', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2025-01-27', date: '2025-01-27', status: 'Approved', submitted: '2025-01-28' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.18', task: 'Exhibit batch Execution: 3 Batches', predecessor: '9.1.15', applicability: 'All Products', taskCode: 'TC-9118', jobCode: 'EB18', effort: '160', duration: '20', description: 'Execute 3 consecutive exhibit/submission batches at plant', procedure: 'Batch Execution SOP', planned: '160.00', assignedTo: 'Marcus Vance', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2025-01-29', date: '2025-01-29', status: 'Approved', submitted: '2025-02-18' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.19', task: 'Exhibit batch Release: 3 Batches', predecessor: '9.1.18 (SS+8)', applicability: 'All Products', taskCode: 'TC-9119', jobCode: 'EB19', effort: '160', duration: '20', description: 'QC complete testing, CoA generation and QA release for 3 exhibit batches', procedure: 'QA Release SOP', planned: '160.00', assignedTo: 'Lucas Meyer', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2025-02-06', date: '2025-02-06', status: 'Approved', submitted: '2025-02-26' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.20', task: 'Batch execution data posting as BMR', predecessor: '9.1.18', applicability: 'All Products', taskCode: 'TC-9120', jobCode: 'EB20', effort: '8', duration: '1', description: 'Post BMR material consumption, yields and parameters in SAP', procedure: 'ERP Posting SOP', planned: '8.00', assignedTo: 'Aarav Shah', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2025-02-19', date: '2025-02-19', status: 'Approved', submitted: '2025-02-20' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.21', task: 'Batch execution data posting as BPR', predecessor: '9.1.18', applicability: 'All Products', taskCode: 'TC-9121', jobCode: 'EB21', effort: '8', duration: '1', description: 'Post BPR packaging material reconciliation in SAP', procedure: 'ERP Posting SOP', planned: '8.00', assignedTo: 'Diego Ruiz', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2025-02-19', date: '2025-02-19', status: 'Approved', submitted: '2025-02-20' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.22', task: 'Stability loading of exhibit batch', predecessor: '9.1.19', applicability: 'All Products', taskCode: 'TC-9122', jobCode: 'EB22', effort: '8', duration: '1', description: 'Load exhibit batch samples in ICH stability chambers', procedure: 'Stability Chamber Loading SOP', planned: '8.00', assignedTo: 'Lucas Meyer', assigned: '8.00', actual: '8.00', cost: '800.00', worked: '8.00', remaining: '0.00', scheduled: '2025-02-27', date: '2025-02-27', status: 'Approved', submitted: '2025-02-28' }
  //       ],
  //       // 9.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '9.2', slNo: '9.2.1', task: 'Reconstitution and Dilution Studies execution on submission Batches', predecessor: '9.1.22', applicability: 'Lyophilized / Injectable Products Only', taskCode: 'TC-9201', jobCode: 'EB23', effort: '40', duration: '5', description: 'Conduct physical-chemical stability testing after reconstitution', procedure: 'Reconstitution Protocol', planned: '40.00', assignedTo: 'Sarah Jenkins', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-02-28', date: '2025-02-28', status: 'Approved', submitted: '2025-03-05' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.2', task: 'Multimedia dissolution profile execution both test and reference products and Comparative dissolutionReport', predecessor: '9.1.22', applicability: 'All Products', taskCode: 'TC-9202', jobCode: 'EB24', effort: '160', duration: '20', description: 'Generate multi-media f2 dissolution profile comparisons against RLD', procedure: 'Comparative Dissolution SOP', planned: '160.00', assignedTo: 'Dr. Rebecca Chen', assigned: '160.00', actual: '160.00', cost: '16000.00', worked: '160.00', remaining: '0.00', scheduled: '2025-02-28', date: '2025-02-28', status: 'Approved', submitted: '2025-03-20' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.3', task: 'pH Solubility Profile to support BCS biowaiver', predecessor: '9.2.2', applicability: 'All Products', taskCode: 'TC-9203', jobCode: 'EB25', effort: '40', duration: '5', description: 'Determine equilibrium solubility over physiological pH range 1.2 to 7.5', procedure: 'BCS Biowaiver Protocol', planned: '40.00', assignedTo: 'Lucas Meyer', assigned: '40.00', actual: '40.00', cost: '4000.00', worked: '40.00', remaining: '0.00', scheduled: '2025-03-21', date: '2025-03-21', status: 'Approved', submitted: '2025-03-26' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.4', task: '6M stability data availability - Accelerated, Long term, In-use, photo stability, freez-thaw study, polymorphic stability', predecessor: '9.1.22', applicability: 'All Products', taskCode: 'TC-9204', jobCode: 'EB26', effort: '1520', duration: '190', description: '6-Month accelerated and real-time stability testing completion for submission', procedure: '6M Stability Final Report SOP', planned: '1520.00', assignedTo: 'Lucas Meyer', assigned: '1520.00', actual: '760.00', cost: '152000.00', worked: '760.00', remaining: '760.00', scheduled: '2025-02-28', date: '2025-02-28', status: 'In Progress', submitted: '-' }
  //       ]
  //     ]
  //   },

  //   // S11 - Demonstration-Scale Campaign studies
  //   'S11': {
  //     sidebarMenus: [
  //       { slNo: '10.1', name: 'Demonstration-Scale Campaign studies', count: 2, isOpen: true }
  //     ],
  //     modulesData: [
  //       // 10.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '10.1', slNo: '10.1.1', task: 'RMP & Test product IP submission', predecessor: '9.1.22', applicability: 'All Products', taskCode: 'TC-1001', jobCode: 'BE01', effort: '16', duration: '2', description: 'Ship test product and RMP IP supplies to CRO clinical trial center', procedure: 'IP Shipment Protocol', planned: '16.00', assignedTo: 'Olivia Brown', assigned: '16.00', actual: '16.00', cost: '1600.00', worked: '16.00', remaining: '0.00', scheduled: '2025-02-28', date: '2025-02-28', status: 'Approved', submitted: '2025-03-02' },
  //         { deliverableSlNo: '10.1', slNo: '10.1.2', task: 'Demonstration-Scale Campaign execution & Report Submission', predecessor: '10.1.1', applicability: 'All Products', taskCode: 'TC-1002', jobCode: 'BE02', effort: '720', duration: '90', description: 'Clinical dosing, sample collection, bioanalysis, statistical analysis and final BE CSR', procedure: 'Demonstration-Scale Campaign Clinical Protocol', planned: '720.00', assignedTo: 'Dr. Rebecca Chen', assigned: '720.00', actual: '720.00', cost: '72000.00', worked: '720.00', remaining: '0.00', scheduled: '2025-03-03', date: '2025-03-03', status: 'Approved', submitted: '2025-06-01' }
  //       ]
  //     ]
  //   },

  //   // S12 - Dossier preparation and filing
  //   'S12': {
  //     sidebarMenus: [
  //       { slNo: '11.1', name: 'Product Development Report (PDR)', count: 1, isOpen: true },
  //       { slNo: '11.2', name: 'Dossier Filing', count: 3, isOpen: false }
  //     ],
  //     modulesData: [
  //       // 11.1 Deliverable Activities
  //       [
  //         { deliverableSlNo: '11.1', slNo: '11.1.1', task: 'Product Development Report (PDR)', predecessor: '5.5.4', applicability: 'All Products', taskCode: 'TC-1101', jobCode: 'DOS1', effort: '240', duration: '30', description: 'Compile comprehensive Module 3.2.P.2 Product Development Report', procedure: 'PDR Writing SOP', planned: '240.00', assignedTo: 'Olivia Brown', assigned: '240.00', actual: '240.00', cost: '24000.00', worked: '240.00', remaining: '0.00', scheduled: '2024-11-07', date: '2024-11-07', status: 'Approved', submitted: '2024-12-07' }
  //       ],
  //       // 11.2 Deliverable Activities
  //       [
  //         { deliverableSlNo: '11.2', slNo: '11.2.1', task: 'Uploading of stability data of protocol bound batches in common folder', predecessor: '9.1.22', applicability: 'All Products', taskCode: 'TC-1102', jobCode: 'DOS2', effort: '480', duration: '60', description: 'Upload verified stability data matrices for submission packages', procedure: 'Stability Documentation SOP', planned: '480.00', assignedTo: 'Lucas Meyer', assigned: '480.00', actual: '480.00', cost: '48000.00', worked: '480.00', remaining: '0.00', scheduled: '2025-02-28', date: '2025-02-28', status: 'Approved', submitted: '2025-04-29' },
  //         { deliverableSlNo: '11.2', slNo: '11.2.2', task: 'Draft dossier preparation with 3M stability data', predecessor: '9.1.22', applicability: 'All Products', taskCode: 'TC-1103', jobCode: 'DOS3', effort: '800', duration: '100', description: 'Compile draft eCTD Modules 1 to 5 with 3-Month interim stability data', procedure: 'eCTD Assembly SOP', planned: '800.00', assignedTo: 'Grace O\'Connor', assigned: '800.00', actual: '800.00', cost: '80000.00', worked: '800.00', remaining: '0.00', scheduled: '2025-02-28', date: '2025-02-28', status: 'Approved', submitted: '2025-06-08' },
  //         { deliverableSlNo: '11.2', slNo: '11.2.3', task: 'Dossier submission strategy note', predecessor: '9.2.4', applicability: 'All Products', taskCode: 'TC-1104', jobCode: 'DOS4', effort: '80', duration: '10', description: 'Finalize regulatory filing strategy note and gateway submission timeline', procedure: 'Filing Strategy Note SOP', planned: '80.00', assignedTo: 'Olivia Brown', assigned: '80.00', actual: '80.00', cost: '8000.00', worked: '80.00', remaining: '0.00', scheduled: '2025-09-06', date: '2025-09-06', status: 'Approved', submitted: '2025-09-16' }
  //       ]
  //     ]
  //   },

  //   // STG001 - Legacy Alias
  //   'STG001': {
  //     sidebarMenus: [
  //       { slNo: '1.1', name: 'API & Raw Material Assessment', count: 3, isOpen: true },
  //       { slNo: '1.2', name: 'Preformulation & Compatibility', count: 2, isOpen: false },
  //       { slNo: '1.3', name: 'Feasibility & Business Case', count: 2, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '1.1', slNo: '1.1.1', task: 'API Characterization & Testing', predecessor: '—', applicability: 'All Products', taskCode: 'TC-101', jobCode: 'FEAS1', effort: '10', duration: '2', description: 'Evaluate API physical, chemical properties and purity', procedure: 'API Characterization SOP', planned: '10.00', assignedTo: 'Olivia Brown', assigned: '10.00', actual: '10.00', cost: '1000.00', worked: '10.00', remaining: '0.00', scheduled: '2024-05-01', date: '2024-05-01', status: 'Approved', submitted: '2024-05-05' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.2', task: 'API Specification Review', predecessor: '1.1.1', applicability: 'All Products', taskCode: 'TC-102', jobCode: 'FEAS2', effort: '15', duration: '3', description: 'Review API specifications and pharmacopeial standards', procedure: 'Spec Review Matrix', planned: '15.00', assignedTo: 'Aarav Shah', assigned: '15.00', actual: '10.00', cost: '1200.00', worked: '10.00', remaining: '5.00', scheduled: '2024-05-03', date: '2024-05-03', status: 'In Progress', submitted: '-' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.3', task: 'Supplier DMF & Qualification', predecessor: '1.1.2', applicability: 'All Products', taskCode: 'TC-103', jobCode: 'FEAS3', effort: '8', duration: '1', description: 'Assess API manufacturer DMF and vendor documentation', procedure: 'Vendor Audit Checklist', planned: '8.00', assignedTo: 'Diego Ruiz', assigned: '8.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '8.00', scheduled: '2024-05-05', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '1.2', slNo: '1.2.1', task: 'API–Excipient Compatibility Study', predecessor: '1.1.3', applicability: 'All Products', taskCode: 'TC-104', jobCode: 'FEAS4', effort: '12', duration: '2', description: 'Evaluate compatibility of API with selected functional excipients', procedure: 'Compatibility Protocol', planned: '12.00', assignedTo: 'Sachin Patil', assigned: '12.00', actual: '12.00', cost: '1200.00', worked: '12.00', remaining: '0.00', scheduled: '2024-05-08', date: '2024-05-08', status: 'Approved', submitted: '2024-05-12' },
  //         { deliverableSlNo: '1.2', slNo: '1.2.2', task: 'Solubility & Dissolution Pre-check', predecessor: '1.2.1', applicability: 'All Products', taskCode: 'TC-105', jobCode: 'FEAS5', effort: '10', duration: '2', description: 'Assess BCS class solubility across physiological pH buffers', procedure: 'Solubility SOP', planned: '10.00', assignedTo: 'Avi Paul', assigned: '10.00', actual: '4.00', cost: '400.00', worked: '4.00', remaining: '6.00', scheduled: '2024-05-10', date: '2024-05-10', status: 'In Progress', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '1.3', slNo: '1.3.1', task: 'Preliminary Formulation Feasibility', predecessor: '1.2.2', applicability: 'All Products', taskCode: 'TC-106', jobCode: 'FEAS6', effort: '14', duration: '2', description: 'Assess technical feasibility and baseline tablet characteristics', procedure: 'Feasibility Trial SOP', planned: '14.00', assignedTo: 'David Park', assigned: '14.00', actual: '14.00', cost: '1400.00', worked: '14.00', remaining: '0.00', scheduled: '2024-05-14', date: '2024-05-14', status: 'Approved', submitted: '2024-05-18' },
  //         { deliverableSlNo: '1.3', slNo: '1.3.2', task: 'Feasibility Gate Assessment Report', predecessor: '1.3.1', applicability: 'All Products', taskCode: 'TC-107', jobCode: 'FEAS7', effort: '8', duration: '1', description: 'Compile feasibility dossier and risk matrix for Gate 1 decision', procedure: 'Gate Dossier Form', planned: '8.00', assignedTo: 'Olivia Brown', assigned: '8.00', actual: '0.00', cost: '0.00', worked: '0.00', remaining: '8.00', scheduled: '2024-05-18', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   }
  // };


  // private stageWbsMap: { [key: string]: StageWbsConfig } = {
  //   // S1
  //   'S1': {
  //     sidebarMenus: [
  //       { slNo: '1.1', name: 'Business case preparation', count: 5, isOpen: true },
  //       { slNo: '1.2', name: 'Market sizing and commercial modeling', count: 2, isOpen: false },
  //       { slNo: '1.3', name: 'Business case approval', count: 1, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '1.1', slNo: '1.1.1', task: 'Molecule Selection & Indication Mapping', predecessor: '0', applicability: 'All Products', taskCode: 'TC-111', jobCode: 'JOB-111', effort: '0', duration: '0', description: 'Project start', procedure: 'Standard SOP', planned: '40000', assignedTo: 'PMO/Management', assigned: '40000', actual: '42000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.2', task: 'Country & Regulatory Scope Identification', predecessor: '1', applicability: 'All Products', taskCode: 'TC-112', jobCode: 'JOB-112', effort: '0', duration: '0', description: 'Runs in parallel with molecule mapping', procedure: 'Standard SOP', planned: '40000', assignedTo: 'PMO/Management/RA', assigned: '40000', actual: '35000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.3', task: 'Preliminary COGs and CAPEX Estimation', predecessor: '1', applicability: 'All Products', taskCode: 'TC-113', jobCode: 'JOB-113', effort: '0', duration: '0', description: 'After: Molecule Selection & Indication Mapping', procedure: 'Standard SOP', planned: '40000', assignedTo: 'PMO/Management', assigned: '40000', actual: '38000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.4', task: 'Market sizing and forecast analysis', predecessor: '1', applicability: 'All Products', taskCode: 'TC-114', jobCode: 'JOB-114', effort: '0', duration: '0', description: 'After: Country & Regulatory Scope Identification', procedure: 'Standard SOP', planned: '40000', assignedTo: 'PMO/Management', assigned: '40000', actual: '38000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.1', slNo: '1.1.5', task: 'NPV & Commercial Attractiveness Model', predecessor: '2', applicability: 'All Products', taskCode: 'TC-115', jobCode: 'JOB-115', effort: '0', duration: '0', description: 'After: Preliminary COGs and CAPEX Estimation; Market sizing and forecast analysis', procedure: 'Standard SOP', planned: '40000', assignedTo: 'PMO/Management', assigned: '40000', actual: '43000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '1.2', slNo: '1.2.1', task: 'Market Sizing & Forecast Analysis', predecessor: '1', applicability: 'All Products', taskCode: 'TC-121', jobCode: 'JOB-121', effort: '0', duration: '0', description: 'After: Market sizing and forecast analysis', procedure: 'Standard SOP', planned: '60000', assignedTo: 'PMO/Management/Finance', assigned: '60000', actual: '64000', cost: '60000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '1.2', slNo: '1.2.2', task: 'NPV & Commercial Attractiveness Model', predecessor: '2', applicability: 'All Products', taskCode: 'TC-122', jobCode: 'JOB-122', effort: '0', duration: '0', description: 'After: NPV & Commercial Attractiveness Model; Market Sizing & Forecast Analysis', procedure: 'Standard SOP', planned: '40000', assignedTo: 'PMO/Management/Finance', assigned: '40000', actual: '45000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '1.3', slNo: '1.3.1', task: 'Steering Committee Sign-off', predecessor: '1', applicability: 'All Products', taskCode: 'TC-131', jobCode: 'JOB-131', effort: '0', duration: '0', description: 'After: NPV & Commercial Attractiveness Model', procedure: 'Standard SOP', planned: '15000', assignedTo: 'Steering Committee', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S2
  //   'S2': {
  //     sidebarMenus: [
  //       { slNo: '2.1', name: 'Project costing sheet preparation and selection of project/product', count: 4, isOpen: true },
  //       { slNo: '2.2', name: 'Literature search and MER', count: 3, isOpen: false },
  //       { slNo: '2.3', name: 'PPDS finalization', count: 2, isOpen: false },
  //       { slNo: '2.4', name: 'Test license /NOC', count: 4, isOpen: false },
  //       { slNo: '2.5', name: 'RLD import license Form 11 for development studies', count: 3, isOpen: false },
  //       { slNo: '2.6', name: 'API import license Form 11', count: 3, isOpen: false },
  //       { slNo: '2.7', name: 'Form 29 manufacturing permission/manufacturing license', count: 3, isOpen: false },
  //       { slNo: '2.8', name: 'CT-14/CT-11 permission to manufacture the batch for BE purpose', count: 2, isOpen: false },
  //       { slNo: '2.9', name: 'New product information to be sent to plant', count: 1, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '2.1', slNo: '2.1.1', task: 'Analytical costing, External CRO costing like Filter validation costing, Extractable & Leachable study costing, any additional test costing etc', predecessor: '1', applicability: 'All Products', taskCode: 'TC-211', jobCode: 'JOB-211', effort: '0', duration: '0', description: 'All costing runs in parallel after business-case sign-off', procedure: 'Standard SOP', planned: '20000', assignedTo: 'R&D', assigned: '20000', actual: '20000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.2', task: 'Licensing costing', predecessor: '1', applicability: 'All Products', taskCode: 'TC-212', jobCode: 'JOB-212', effort: '0', duration: '0', description: 'After: Steering Committee Sign-off', procedure: 'Standard SOP', planned: '20000', assignedTo: 'RA', assigned: '20000', actual: '18000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.3', task: 'RM, PM, Consumables & RLD costing', predecessor: '1', applicability: 'All Products', taskCode: 'TC-213', jobCode: 'JOB-213', effort: '0', duration: '0', description: 'After: Steering Committee Sign-off', procedure: 'Standard SOP', planned: '20000', assignedTo: 'Procurment ', assigned: '20000', actual: '19000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.1', slNo: '2.1.4', task: 'CT/BE Costing', predecessor: '1', applicability: 'All Products', taskCode: 'TC-214', jobCode: 'JOB-214', effort: '0', duration: '0', description: 'After: Steering Committee Sign-off', procedure: 'Standard SOP', planned: '20000', assignedTo: 'Clinical', assigned: '20000', actual: '20000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.2', slNo: '2.2.1', task: 'Scan of IP landscape', predecessor: '1', applicability: 'All Products', taskCode: 'TC-221', jobCode: 'JOB-221', effort: '0', duration: '0', description: 'After: Steering Committee Sign-off', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '133000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.2', slNo: '2.2.2', task: 'MER availability', predecessor: '1', applicability: 'All Products', taskCode: 'TC-222', jobCode: 'JOB-222', effort: '0', duration: '0', description: 'After: Steering Committee Sign-off', procedure: 'Standard SOP', planned: '50000', assignedTo: 'FR&D', assigned: '50000', actual: '47000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.2', slNo: '2.2.3', task: 'Preparation of IPR strategy', predecessor: '1', applicability: 'All Products', taskCode: 'TC-223', jobCode: 'JOB-223', effort: '0', duration: '0', description: 'After: Scan of IP landscape', procedure: 'Standard SOP', planned: '75000', assignedTo: 'FR&D', assigned: '75000', actual: '79000', cost: '75000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.3', slNo: '2.3.1', task: 'Pre Product Development Strategy (PPDS) finalization', predecessor: '6', applicability: 'All Products', taskCode: 'TC-231', jobCode: 'JOB-231', effort: '0', duration: '0', description: 'PPDS needs costing, MER and IP strategy', procedure: 'Standard SOP', planned: '30000', assignedTo: 'R&D', assigned: '30000', actual: '31000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.3', slNo: '2.3.2', task: 'Approve country regulatory/BE strategy and QTPP/CQA assessment', predecessor: '3', applicability: 'All Products', taskCode: 'TC-232', jobCode: 'JOB-232', effort: '0', duration: '0', description: 'Control: G1 approval (1.3.1 Steering Committee sign-off), regulatory scope and MER in place', procedure: 'Standard SOP', planned: '50000', assignedTo: 'RA / R&D / Clinical / Management', assigned: '50000', actual: '48000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.4', slNo: '2.4.1', task: 'Manufacturing Formula & Process', predecessor: '1', applicability: 'All Products', taskCode: 'TC-241', jobCode: 'JOB-241', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '30000', assignedTo: 'R&D', assigned: '30000', actual: '28000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.4', slNo: '2.4.2', task: 'Label claim approval', predecessor: '1', applicability: 'All Products', taskCode: 'TC-242', jobCode: 'JOB-242', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '30000', assignedTo: 'R&D', assigned: '30000', actual: '31000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.4', slNo: '2.4.3', task: 'FP specifications, & STP', predecessor: '1', applicability: 'All Products', taskCode: 'TC-243', jobCode: 'JOB-243', effort: '0', duration: '0', description: 'FP spec drafted in parallel with formula', procedure: 'Standard SOP', planned: '30000', assignedTo: 'R&D', assigned: '30000', actual: '33000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.4', slNo: '2.4.4', task: 'Application processing & Other administrative Documents (API Manufacturing License, MSDS, API UTB & CT-15)', predecessor: '3', applicability: 'All Products', taskCode: 'TC-244', jobCode: 'JOB-244', effort: '0', duration: '0', description: 'After: Manufacturing Formula & Process; Label claim approval; FP specifications, & STP', procedure: 'Standard SOP', planned: '50000', assignedTo: 'R&D', assigned: '50000', actual: '44000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.5', slNo: '2.5.1', task: 'RLD utilization break-up', predecessor: '1', applicability: 'All Products', taskCode: 'TC-251', jobCode: 'JOB-251', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '25000', assignedTo: 'R&D', assigned: '25000', actual: '27000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.5', slNo: '2.5.2', task: 'RMP MA holder selection & COO Finalization', predecessor: '1', applicability: 'All Products', taskCode: 'TC-252', jobCode: 'JOB-252', effort: '0', duration: '0', description: 'MA holder / COO selected alongside RLD quantity break-up', procedure: 'Standard SOP', planned: '25000', assignedTo: 'R&D', assigned: '25000', actual: '27000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.5', slNo: '2.5.3', task: 'ITL for RLD processing & approval', predecessor: '2', applicability: 'All Products', taskCode: 'TC-253', jobCode: 'JOB-253', effort: '0', duration: '0', description: 'After: RLD utilization break-up; RMP MA holder selection & COO Finalization', procedure: 'Standard SOP', planned: '40000', assignedTo: 'R&D', assigned: '40000', actual: '39000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.6', slNo: '2.6.1', task: 'API utilization break-up', predecessor: '1', applicability: 'All Products', taskCode: 'TC-261', jobCode: 'JOB-261', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '25000', assignedTo: 'Procurment / R&D', assigned: '25000', actual: '23000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.6', slNo: '2.6.2', task: 'API vendor finalization', predecessor: '1', applicability: 'All Products', taskCode: 'TC-262', jobCode: 'JOB-262', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '25000', assignedTo: 'Procurment / R&D', assigned: '25000', actual: '28000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.6', slNo: '2.6.3', task: 'ITL for API processing & approval', predecessor: '2', applicability: 'All Products', taskCode: 'TC-263', jobCode: 'JOB-263', effort: '0', duration: '0', description: 'After: API utilization break-up; API vendor finalization', procedure: 'Standard SOP', planned: '40000', assignedTo: 'Procurment / R&D', assigned: '40000', actual: '39000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.7', slNo: '2.7.1', task: 'Manufacturing Formula & Process', predecessor: '1', applicability: 'All Products', taskCode: 'TC-271', jobCode: 'JOB-271', effort: '0', duration: '0', description: 'After: Manufacturing Formula & Process', procedure: 'Standard SOP', planned: '35000', assignedTo: 'R&D', assigned: '35000', actual: '32000', cost: '35000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.7', slNo: '2.7.2', task: 'FP specifications, STP & Stability data', predecessor: '1', applicability: 'All Products', taskCode: 'TC-272', jobCode: 'JOB-272', effort: '0', duration: '0', description: 'After: FP specifications, & STP', procedure: 'Standard SOP', planned: '35000', assignedTo: 'R&D', assigned: '35000', actual: '32000', cost: '35000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.7', slNo: '2.7.3', task: 'Application processing & Other administrative Documents', predecessor: '3', applicability: 'All Products', taskCode: 'TC-273', jobCode: 'JOB-273', effort: '0', duration: '0', description: 'Form 29 follows the test licence / NOC', procedure: 'Standard SOP', planned: '75000', assignedTo: 'R&D', assigned: '75000', actual: '83000', cost: '75000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.8', slNo: '2.8.1', task: 'Batch size confirmation ; API & Formulation reconciliation', predecessor: '1', applicability: 'All Products', taskCode: 'TC-281', jobCode: 'JOB-281', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '30000', assignedTo: 'Clinical / R&D', assigned: '30000', actual: '31000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '2.8', slNo: '2.8.2', task: 'Application processing & Other administrative Documents', predecessor: '2', applicability: 'All Products', taskCode: 'TC-282', jobCode: 'JOB-282', effort: '0', duration: '0', description: 'CT-14/CT-11 needs a manufacturing licence (Form 29)', procedure: 'Standard SOP', planned: '50000', assignedTo: 'Clinical / R&D', assigned: '50000', actual: '55000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '2.9', slNo: '2.9.1', task: 'New product information to be sent to plant', predecessor: '1', applicability: 'All Products', taskCode: 'TC-291', jobCode: 'JOB-291', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '5000', assignedTo: 'R&D / PMO', assigned: '5000', actual: '5000', cost: '5000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S3
  //   'S3': {
  //     sidebarMenus: [
  //       { slNo: '3.1', name: 'Procurement - Developmental studies', count: 10, isOpen: true }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '3.1', slNo: '3.1.1', task: 'API Procurement for Developmental studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-311', jobCode: 'JOB-311', effort: '0', duration: '0', description: 'Needs import licence (ITL) and finalised vendor', procedure: 'Standard SOP', planned: '600000', assignedTo: 'R&D / Procurment', assigned: '600000', actual: '615000', cost: '600000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.2', task: 'RLD Procurement for Developmental studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-312', jobCode: 'JOB-312', effort: '0', duration: '0', description: 'Needs RLD import licence', procedure: 'Standard SOP', planned: '1200000', assignedTo: 'R&D / Procurment', assigned: '1200000', actual: '1371000', cost: '1200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.3', task: 'Excipients procurement for Developmental studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-313', jobCode: 'JOB-313', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '150000', assignedTo: 'R&D / Procurment', assigned: '150000', actual: '147000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.4', task: 'Miscellaneous items like filters etc (if any) procurement for development studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-314', jobCode: 'JOB-314', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '75000', assignedTo: 'R&D / Procurment', assigned: '75000', actual: '77000', cost: '75000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.5', task: 'Packaging materials Procurement for Developmental studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-315', jobCode: 'JOB-315', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '60000', assignedTo: 'R&D / Procurment', assigned: '60000', actual: '66000', cost: '60000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.6', task: 'Analytical Requirements Procurement  for API method development/verification', predecessor: '1', applicability: 'All Products', taskCode: 'TC-316', jobCode: 'JOB-316', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '400000', assignedTo: 'R&D / Procurment', assigned: '400000', actual: '419000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.7', task: 'Analytical Requirements Procurement  for Finished product method development', predecessor: '1', applicability: 'All Products', taskCode: 'TC-317', jobCode: 'JOB-317', effort: '0', duration: '0', description: 'After: Pre Product Development Strategy (PPDS) finalization', procedure: 'Standard SOP', planned: '300000', assignedTo: 'R&D / Procurment', assigned: '300000', actual: '334000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.8', task: 'Evaluation of API COAs and finalisation of vendor', predecessor: '1', applicability: 'All Products', taskCode: 'TC-318', jobCode: 'JOB-318', effort: '0', duration: '0', description: 'Vendor CoA evaluation once preferred vendor is shortlisted', procedure: 'Standard SOP', planned: '20000', assignedTo: 'R&D / Procurment / QA', assigned: '20000', actual: '21000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.9', task: 'Availability of API ODMF/CEP suitability', predecessor: '1', applicability: 'All Products', taskCode: 'TC-319', jobCode: 'JOB-319', effort: '0', duration: '0', description: 'DMF/CEP and spec/MOA collected alongside vendor evaluation', procedure: 'Standard SOP', planned: '15000', assignedTo: 'R&D / Procurment / RA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '3.1', slNo: '3.1.10', task: 'Availability of API spec and MOA', predecessor: '1', applicability: 'All Products', taskCode: 'TC-3110', jobCode: 'JOB-3110', effort: '0', duration: '0', description: 'DMF/CEP and spec/MOA collected alongside vendor evaluation', procedure: 'Standard SOP', planned: '15000', assignedTo: 'R&D / Procurment', assigned: '15000', actual: '13000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S4
  //   'S4': {
  //     sidebarMenus: [
  //       { slNo: '4.1', name: 'API characterization and IH coa release', count: 4, isOpen: true },
  //       { slNo: '4.2', name: 'RMP/RLD characterization (Physical and chemical)', count: 3, isOpen: false },
  //       { slNo: '4.3', name: 'Tablet tooling & blister change part development & procurement', count: 3, isOpen: false },
  //       { slNo: '4.4', name: 'Formulation development', count: 22, isOpen: false },
  //       { slNo: '4.5', name: 'Analytical method development', count: 3, isOpen: false },
  //       { slNo: '4.6', name: 'Formulation, process and packaging freeze', count: 1, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '4.1', slNo: '4.1.1', task: 'API Analysis', predecessor: '3', applicability: 'All Products', taskCode: 'TC-411', jobCode: 'JOB-411', effort: '0', duration: '0', description: 'Needs API, reference standards and supplier MOA', procedure: 'Standard SOP', planned: '60000', assignedTo: 'ARD', assigned: '60000', actual: '56000', cost: '60000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.1', slNo: '4.1.2', task: 'IH CoA Release', predecessor: '1', applicability: 'All Products', taskCode: 'TC-412', jobCode: 'JOB-412', effort: '0', duration: '0', description: 'After: API Analysis', procedure: 'Standard SOP', planned: '10000', assignedTo: 'ARD', assigned: '10000', actual: '10000', cost: '10000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.1', slNo: '4.1.3', task: '3 lots of API verification', predecessor: '1', applicability: 'All Products', taskCode: 'TC-413', jobCode: 'JOB-413', effort: '0', duration: '0', description: 'Lot verification runs alongside analysis', procedure: 'Standard SOP', planned: '150000', assignedTo: 'ARD', assigned: '150000', actual: '135000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.1', slNo: '4.1.4', task: 'API test methods and specifications Finalization', predecessor: '3', applicability: 'All Products', taskCode: 'TC-414', jobCode: 'JOB-414', effort: '0', duration: '0', description: 'After: IH CoA Release; 3 lots of API verification; Availability of API ODMF/CEP suitability', procedure: 'Standard SOP', planned: '40000', assignedTo: 'ARD', assigned: '40000', actual: '38000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '4.2', slNo: '4.2.1', task: 'RMP/RLD Physical Characterization', predecessor: '1', applicability: 'All Products', taskCode: 'TC-421', jobCode: 'JOB-421', effort: '0', duration: '0', description: 'After: RLD Procurement for Developmental studies', procedure: 'Standard SOP', planned: '80000', assignedTo: 'ARD', assigned: '80000', actual: '73000', cost: '80000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.2', task: 'RMP/RLD Chemical Characterization', predecessor: '2', applicability: 'All Products', taskCode: 'TC-422', jobCode: 'JOB-422', effort: '0', duration: '0', description: 'After: RLD Procurement for Developmental studies; Analytical Requirements Procurement  for Finished product method development', procedure: 'Standard SOP', planned: '80000', assignedTo: 'ARD', assigned: '80000', actual: '76000', cost: '80000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.2', slNo: '4.2.3', task: 'RMP/RLD Packing Characterization', predecessor: '1', applicability: 'All Products', taskCode: 'TC-423', jobCode: 'JOB-423', effort: '0', duration: '0', description: 'After: RLD Procurement for Developmental studies', procedure: 'Standard SOP', planned: '80000', assignedTo: 'ARD', assigned: '80000', actual: '84000', cost: '80000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '4.3', slNo: '4.3.1', task: 'Tablet Tooling Procurement', predecessor: '1', applicability: 'All Products', taskCode: 'TC-431', jobCode: 'JOB-431', effort: '0', duration: '0', description: 'Tooling designed from RLD physical dimensions', procedure: 'Standard SOP', planned: '300000', assignedTo: 'R&D / Eng', assigned: '300000', actual: '294000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.3', slNo: '4.3.2', task: 'Blister change parts Procurement', predecessor: '2', applicability: 'All Products', taskCode: 'TC-432', jobCode: 'JOB-432', effort: '0', duration: '0', description: 'Change parts need tablet and pack dimensions', procedure: 'Standard SOP', planned: '400000', assignedTo: 'R&D / Eng', assigned: '400000', actual: '392000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.3', slNo: '4.3.3', task: 'Capsule shell shade card & Art Work', predecessor: '1', applicability: 'All Products', taskCode: 'TC-433', jobCode: 'JOB-433', effort: '0', duration: '0', description: 'After: RMP/RLD Physical Characterization', procedure: 'Standard SOP', planned: '50000', assignedTo: 'R&D / Eng', assigned: '50000', actual: '47000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '4.4', slNo: '4.4.1', task: 'Pre-formulation studies - API Characterization including Solubility studies, RS, PSD, XRD etc - Drug-excipient', predecessor: '2', applicability: 'All Products', taskCode: 'TC-441', jobCode: 'JOB-441', effort: '0', duration: '0', description: 'Needs released API (IH CoA) and excipients', procedure: 'Standard SOP', planned: '250000', assignedTo: 'R&D', assigned: '250000', actual: '238000', cost: '250000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.2', task: 'Development of prototype formulation', predecessor: '3', applicability: 'All Products', taskCode: 'TC-442', jobCode: 'JOB-442', effort: '0', duration: '0', description: 'Needs pre-formulation, RLD chemistry and tooling', procedure: 'Standard SOP', planned: '300000', assignedTo: 'R&D', assigned: '300000', actual: '340000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.3', task: 'Stability loading of prototype formulation', predecessor: '2', applicability: 'All Products', taskCode: 'TC-443', jobCode: 'JOB-443', effort: '0', duration: '0', description: 'After: Development of prototype formulation; Packaging materials Procurement for Developmental studies', procedure: 'Standard SOP', planned: '150000', assignedTo: 'R&D', assigned: '150000', actual: '158000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.4', task: 'Dissolution mapping with innovator product', predecessor: '2', applicability: 'All Products', taskCode: 'TC-444', jobCode: 'JOB-444', effort: '0', duration: '0', description: 'Dissolution mapping needs tentative method', procedure: 'Standard SOP', planned: '100000', assignedTo: 'R&D', assigned: '100000', actual: '104000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.5', task: 'Impact of particle size on dissolution', predecessor: '1', applicability: 'All Products', taskCode: 'TC-445', jobCode: 'JOB-445', effort: '0', duration: '0', description: 'After: Dissolution mapping with innovator product', procedure: 'Standard SOP', planned: '80000', assignedTo: 'R&D', assigned: '80000', actual: '74000', cost: '80000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.6', task: 'Multimedia dissolution mapping with reference product', predecessor: '1', applicability: 'All Products', taskCode: 'TC-446', jobCode: 'JOB-446', effort: '0', duration: '0', description: 'After: Impact of particle size on dissolution', procedure: 'Standard SOP', planned: '200000', assignedTo: 'R&D', assigned: '200000', actual: '215000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.7', task: 'Stability loading of final formulation', predecessor: '6', applicability: 'All Products', taskCode: 'TC-447', jobCode: 'JOB-447', effort: '0', duration: '0', description: 'Final formula locked after dissolution match, process/pH/headspace/NDDS work', procedure: 'Standard SOP', planned: '150000', assignedTo: 'R&D', assigned: '150000', actual: '139000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.8', task: 'Process optimization - Lyophilization/TS feasibility/Aseptic process/others', predecessor: '2', applicability: 'All Products', taskCode: 'TC-448', jobCode: 'JOB-448', effort: '0', duration: '0', description: 'After: Development of prototype formulation; Tentative methods finalization', procedure: 'Standard SOP', planned: '400000', assignedTo: 'R&D', assigned: '400000', actual: '393000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.9', task: 'Photo stability/ Thermal cycling/Temperature Excursion study/Preservative efficacy study/Antioxidant Efficacy study/', predecessor: '1', applicability: 'All Products', taskCode: 'TC-449', jobCode: 'JOB-449', effort: '0', duration: '0', description: 'Run on final formulation, in parallel with stability', procedure: 'Standard SOP', planned: '200000', assignedTo: 'R&D', assigned: '200000', actual: '229000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.10', task: 'Head space gas optimization study/gas sensitivity study', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4410', jobCode: 'JOB-4410', effort: '0', duration: '0', description: 'After: Development of prototype formulation', procedure: 'Standard SOP', planned: '150000', assignedTo: 'R&D', assigned: '150000', actual: '158000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.11', task: 'Vmax study/Throughput studies', predecessor: '2', applicability: 'All Products', taskCode: 'TC-4411', jobCode: 'JOB-4411', effort: '0', duration: '0', description: 'After: Development of prototype formulation; Miscellaneous items like filters etc (if any) procurement for development studies', procedure: 'Standard SOP', planned: '150000', assignedTo: 'R&D', assigned: '150000', actual: '155000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.12', task: 'Reverse Engineering of Reference Product (NDDS)', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4412', jobCode: 'JOB-4412', effort: '0', duration: '0', description: 'After: RMP/RLD Chemical Characterization', procedure: 'Standard SOP', planned: '500000', assignedTo: 'R&D', assigned: '500000', actual: '532000', cost: '500000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.13', task: 'POC for NDDS', predecessor: '2', applicability: 'All Products', taskCode: 'TC-4413', jobCode: 'JOB-4413', effort: '0', duration: '0', description: 'After: Pre-formulation studies - API Characterization including Solubility studies, RS, PSD, XRD etc - Drug-excipient; Reverse Engineering of Reference Product (NDDS)', procedure: 'Standard SOP', planned: '1000000', assignedTo: 'R&D', assigned: '1000000', actual: '1108000', cost: '1000000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.14', task: 'Hold Time and Compatibility Studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4414', jobCode: 'JOB-4414', effort: '0', duration: '0', description: 'After: Process optimization - Lyophilization/TS feasibility/Aseptic process/others', procedure: 'Standard SOP', planned: '100000', assignedTo: 'R&D', assigned: '100000', actual: '109000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.15', task: '3M Lab scale stability data generation', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4415', jobCode: 'JOB-4415', effort: '0', duration: '0', description: '3M stability on final formulation', procedure: 'Standard SOP', planned: '250000', assignedTo: 'R&D', assigned: '250000', actual: '235000', cost: '250000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.16', task: 'Filter Validation study', predecessor: '2', applicability: 'All Products', taskCode: 'TC-4416', jobCode: 'JOB-4416', effort: '0', duration: '0', description: 'Filter validation needs final formulation + Vmax data', procedure: 'Standard SOP', planned: '600000', assignedTo: 'R&D', assigned: '600000', actual: '533000', cost: '600000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.17', task: 'Optimization/ pre validation of methods', predecessor: '2', applicability: 'All Products', taskCode: 'TC-4417', jobCode: 'JOB-4417', effort: '0', duration: '0', description: 'Method pre-validation uses final formulation samples', procedure: 'Standard SOP', planned: '200000', assignedTo: 'R&D', assigned: '200000', actual: '193000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.18', task: 'Method development reports', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4418', jobCode: 'JOB-4418', effort: '0', duration: '0', description: 'After: Optimization/ pre validation of methods', procedure: 'Standard SOP', planned: '30000', assignedTo: 'R&D', assigned: '30000', actual: '29000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.19', task: 'Development Stability Analysis of 6M samples', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4419', jobCode: 'JOB-4419', effort: '0', duration: '0', description: 'After: 3M Lab scale stability data generation', procedure: 'Standard SOP', planned: '350000', assignedTo: 'R&D', assigned: '350000', actual: '328000', cost: '350000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.20', task: 'pH suitability studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4420', jobCode: 'JOB-4420', effort: '0', duration: '0', description: 'After: Development of prototype formulation', procedure: 'Standard SOP', planned: '75000', assignedTo: 'R&D', assigned: '75000', actual: '85000', cost: '75000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.21', task: 'Inuse stability study', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4421', jobCode: 'JOB-4421', effort: '0', duration: '0', description: 'After: Stability loading of final formulation', procedure: 'Standard SOP', planned: '150000', assignedTo: 'R&D', assigned: '150000', actual: '167000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.4', slNo: '4.4.22', task: 'Alternative packing material evaluation', predecessor: '1', applicability: 'All Products', taskCode: 'TC-4422', jobCode: 'JOB-4422', effort: '0', duration: '0', description: 'After: Stability loading of final formulation', procedure: 'Standard SOP', planned: '200000', assignedTo: 'R&D', assigned: '200000', actual: '193000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '4.5', slNo: '4.5.1', task: 'Prototype formulation shall be submitted for method development', predecessor: '1', applicability: 'All Products', taskCode: 'TC-451', jobCode: 'JOB-451', effort: '0', duration: '0', description: 'FD followed by AMD — prototype goes to AD', procedure: 'Standard SOP', planned: '10000', assignedTo: 'FR&D', assigned: '10000', actual: '11000', cost: '10000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.5', slNo: '4.5.2', task: 'Tentative Specification of FP', predecessor: '2', applicability: 'All Products', taskCode: 'TC-452', jobCode: 'JOB-452', effort: '0', duration: '0', description: 'After: Prototype formulation shall be submitted for method development; RMP/RLD Chemical Characterization', procedure: 'Standard SOP', planned: '25000', assignedTo: 'FR&D', assigned: '25000', actual: '25000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '4.5', slNo: '4.5.3', task: 'Tentative methods finalization', predecessor: '2', applicability: 'All Products', taskCode: 'TC-453', jobCode: 'JOB-453', effort: '0', duration: '0', description: 'After: Prototype formulation shall be submitted for method development; Tentative Specification of FP', procedure: 'Standard SOP', planned: '250000', assignedTo: 'FR&D', assigned: '250000', actual: '282000', cost: '250000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '4.6', slNo: '4.6.1', task: 'Approve formulation, process and packaging freeze', predecessor: '27', applicability: 'All Products', taskCode: 'TC-461', jobCode: 'JOB-461', effort: '0', duration: '0', description: 'Control: freeze only after dissolution, process, headspace, NDDS, pH, packaging and all QbD formulation/process trials are complete', procedure: 'Standard SOP', planned: '50000', assignedTo: 'R&D / QA / Management', assigned: '50000', actual: '52000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S5
  //   'S5': {
  //     sidebarMenus: [
  //       { slNo: '5.1', name: 'Procurement submission batches', count: 5, isOpen: true },
  //       { slNo: '5.2', name: 'Release of RM & PM', count: 1, isOpen: false },
  //       { slNo: '5.3', name: 'Scale-up', count: 3, isOpen: false },
  //       { slNo: '5.4', name: 'Bioequivalence study requirements', count: 6, isOpen: false },
  //       { slNo: '5.5', name: 'Pilot BE (Test & RMP IP\'s submission and study execution)', count: 2, isOpen: false },
  //       { slNo: '5.6', name: 'QBD formulation optimization trials', count: 13, isOpen: false },
  //       { slNo: '5.7', name: 'QBD trials manufacturing process development', count: 8, isOpen: false },
  //       { slNo: '5.8', name: 'Facility, equipment and process readiness', count: 1, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '5.1', slNo: '5.1.1', task: 'BOM for RM', predecessor: '1', applicability: 'All Products', taskCode: 'TC-511', jobCode: 'JOB-511', effort: '0', duration: '0', description: 'BOM released once 3M lab stability supports the formula', procedure: 'Standard SOP', planned: '20000', assignedTo: 'FR&D', assigned: '20000', actual: '20000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.2', task: 'BOM for Consumables', predecessor: '1', applicability: 'All Products', taskCode: 'TC-512', jobCode: 'JOB-512', effort: '0', duration: '0', description: 'After: BOM for RM', procedure: 'Standard SOP', planned: '20000', assignedTo: 'R&D', assigned: '20000', actual: '19000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.3', task: 'BOM for Miscellaneous (if any)', predecessor: '1', applicability: 'All Products', taskCode: 'TC-513', jobCode: 'JOB-513', effort: '0', duration: '0', description: 'After: BOM for RM', procedure: 'Standard SOP', planned: '20000', assignedTo: 'R&D', assigned: '20000', actual: '19000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.4', task: 'RM, PM, Consumables, Miscellaneous procurement', predecessor: '3', applicability: 'All Products', taskCode: 'TC-514', jobCode: 'JOB-514', effort: '0', duration: '0', description: 'After: BOM for RM; BOM for Consumables; BOM for Miscellaneous (if any)', procedure: 'Standard SOP', planned: '3000000', assignedTo: 'Procurment', assigned: '3000000', actual: '3095000', cost: '3000000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.1', slNo: '5.1.5', task: 'Filters & Tubing Procurement', predecessor: '2', applicability: 'All Products', taskCode: 'TC-515', jobCode: 'JOB-515', effort: '0', duration: '0', description: 'Filter type fixed by filter validation', procedure: 'Standard SOP', planned: '300000', assignedTo: 'Procurment', assigned: '300000', actual: '285000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.2', slNo: '5.2.1', task: 'Release of RM and PM', predecessor: '2', applicability: 'All Products', taskCode: 'TC-521', jobCode: 'JOB-521', effort: '0', duration: '0', description: 'After: RM, PM, Consumables, Miscellaneous procurement; Filters & Tubing Procurement', procedure: 'Standard SOP', planned: '100000', assignedTo: 'ARD', assigned: '100000', actual: '104000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.3', slNo: '5.3.1', task: 'Scale Up batch Execution', predecessor: '5', applicability: 'All Products', taskCode: 'TC-531', jobCode: 'JOB-531', effort: '0', duration: '0', description: 'Needs released materials, pre-validated methods, manufacturing licence, change parts and facility readiness (5.8.1)', procedure: 'Standard SOP', planned: '1200000', assignedTo: 'FR&D', assigned: '1200000', actual: '1347000', cost: '1200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.3', slNo: '5.3.2', task: 'Scale Up batch analysis and Report', predecessor: '1', applicability: 'All Products', taskCode: 'TC-532', jobCode: 'JOB-532', effort: '0', duration: '0', description: 'After: Scale Up batch Execution', procedure: 'Standard SOP', planned: '200000', assignedTo: 'ARD', assigned: '200000', actual: '198000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.3', slNo: '5.3.3', task: 'Pilot Bio Formulation', predecessor: '2', applicability: 'All Products', taskCode: 'TC-533', jobCode: 'JOB-533', effort: '0', duration: '0', description: 'Pilot bio batch needs CT-14/CT-11 permission', procedure: 'Standard SOP', planned: '800000', assignedTo: 'FR&D', assigned: '800000', actual: '751000', cost: '800000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.4', slNo: '5.4.1', task: 'Pilot & Demonstration-Scale Campaign NOC documents submission', predecessor: '1', applicability: 'All Products', taskCode: 'TC-541', jobCode: 'JOB-541', effort: '0', duration: '0', description: 'BE NOC dossier needs 3M stability data', procedure: 'Standard SOP', planned: '30000', assignedTo: 'FR&D', assigned: '30000', actual: '34000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.2', task: 'BE study Design & Protocol Finalization', predecessor: '1', applicability: 'All Products', taskCode: 'TC-542', jobCode: 'JOB-542', effort: '0', duration: '0', description: 'After: Pilot & Demonstration-Scale Campaign NOC documents submission', procedure: 'Standard SOP', planned: '100000', assignedTo: 'Clinical / R&D', assigned: '100000', actual: '102000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.3', task: 'BE NOC application filing & Approval', predecessor: '2', applicability: 'All Products', taskCode: 'TC-543', jobCode: 'JOB-543', effort: '0', duration: '0', description: 'After: Pilot & Demonstration-Scale Campaign NOC documents submission; BE study Design & Protocol Finalization', procedure: 'Standard SOP', planned: '150000', assignedTo: 'clinical ', assigned: '150000', actual: '136000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.4', task: 'RLD import license - Form 11', predecessor: '1', applicability: 'All Products', taskCode: 'TC-544', jobCode: 'JOB-544', effort: '0', duration: '0', description: 'After: BE study Design & Protocol Finalization', procedure: 'Standard SOP', planned: '50000', assignedTo: 'FR&D / Clinical', assigned: '50000', actual: '45000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.5', task: 'Innovator product procurement for Demonstration-Scale Campaign studies', predecessor: '1', applicability: 'All Products', taskCode: 'TC-545', jobCode: 'JOB-545', effort: '0', duration: '0', description: 'After: RLD import license - Form 11', procedure: 'Standard SOP', planned: '1500000', assignedTo: 'Procurment', assigned: '1500000', actual: '1364000', cost: '1500000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.4', slNo: '5.4.6', task: 'Confirm ethics, CRO and bioanalytical readiness', predecessor: '2', applicability: 'All Products', taskCode: 'TC-546', jobCode: 'JOB-546', effort: '0', duration: '0', description: 'Control: BE protocol final and approved BE strategy; gates pilot and demo campaign', procedure: 'Standard SOP', planned: '100000', assignedTo: 'Clinical', assigned: '100000', actual: '104000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.5', slNo: '5.5.1', task: 'Pilot BE (Test & RMP IP\'s submission and study execution)', predecessor: '3', applicability: 'All Products', taskCode: 'TC-551', jobCode: 'JOB-551', effort: '0', duration: '0', description: 'Needs pilot bio batch, BE NOC and ethics/CRO/bioanalytical readiness (5.4.6)', procedure: 'Standard SOP', planned: '4500000', assignedTo: 'FR&D / Clinical', assigned: '4500000', actual: '4722000', cost: '4500000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.5', slNo: '5.5.2', task: 'Review pilot results and approve progression or waiver', predecessor: '2', applicability: 'All Products', taskCode: 'TC-552', jobCode: 'JOB-552', effort: '0', duration: '0', description: 'Control: go / no-go on pilot BE and scale-up results before TTD', procedure: 'Standard SOP', planned: '25000', assignedTo: 'Clinical / R&D / Management', assigned: '25000', actual: '24000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.6', slNo: '5.6.1', task: 'Optimization of Binder concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-561', jobCode: 'JOB-561', effort: '0', duration: '0', description: 'QbD trials start from scale-up learnings; formulation variables studied in parallel (SS)', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '164000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.2', task: 'Optimization of Disintegrant concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-562', jobCode: 'JOB-562', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '149000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.3', task: 'Optimization of diluent concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-563', jobCode: 'JOB-563', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '135000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.4', task: 'Optimization of Glidant concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-564', jobCode: 'JOB-564', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '147000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.5', task: 'Optimization of Lubricant concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-565', jobCode: 'JOB-565', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '172000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.6', task: 'Optimization of Solubilizer concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-566', jobCode: 'JOB-566', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '153000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.7', task: 'Optimization of polymer concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-567', jobCode: 'JOB-567', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '171000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.8', task: 'Optimization of Antioxidant concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-568', jobCode: 'JOB-568', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '167000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.9', task: 'Optimization of preservative concentration', predecessor: '1', applicability: 'All Products', taskCode: 'TC-569', jobCode: 'JOB-569', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '132000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.10', task: 'Sequence/Order of addition', predecessor: '5', applicability: 'All Products', taskCode: 'TC-5610', jobCode: 'JOB-5610', effort: '0', duration: '0', description: 'Order of addition fixed after excipient levels and pH are set', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '161000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.11', task: 'Optimization of Terminal sterilization time', predecessor: '1', applicability: 'All Products', taskCode: 'TC-5611', jobCode: 'JOB-5611', effort: '0', duration: '0', description: 'TS / lyo cycle optimised once composition and order of addition are fixed', procedure: 'Standard SOP', planned: '250000', assignedTo: 'FR&D', assigned: '250000', actual: '266000', cost: '250000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.12', task: 'Optimization of Lyophilization cycle', predecessor: '1', applicability: 'All Products', taskCode: 'TC-5612', jobCode: 'JOB-5612', effort: '0', duration: '0', description: 'After: Sequence/Order of addition', procedure: 'Standard SOP', planned: '400000', assignedTo: 'FR&D', assigned: '400000', actual: '410000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.6', slNo: '5.6.13', task: 'pH Optimization/suitability study', predecessor: '1', applicability: 'All Products', taskCode: 'TC-5613', jobCode: 'JOB-5613', effort: '0', duration: '0', description: 'After: Optimization of Binder concentration', procedure: 'Standard SOP', planned: '150000', assignedTo: 'FR&D', assigned: '150000', actual: '143000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.7', slNo: '5.7.1', task: 'Optimization of Homogenization cycle', predecessor: '2', applicability: 'All Products', taskCode: 'TC-571', jobCode: 'JOB-571', effort: '0', duration: '0', description: 'After: Sequence/Order of addition; pH Optimization/suitability study', procedure: 'Standard SOP', planned: '200000', assignedTo: 'FR&D', assigned: '200000', actual: '211000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.2', task: 'Specific Filtration system including TFF', predecessor: '1', applicability: 'All Products', taskCode: 'TC-572', jobCode: 'JOB-572', effort: '0', duration: '0', description: 'After: Optimization of Homogenization cycle', procedure: 'Standard SOP', planned: '300000', assignedTo: 'FR&D', assigned: '300000', actual: '273000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.3', task: 'Specific activities / processes Optimization related to NDDS', predecessor: '2', applicability: 'All Products', taskCode: 'TC-573', jobCode: 'JOB-573', effort: '0', duration: '0', description: 'After: Sequence/Order of addition; pH Optimization/suitability study', procedure: 'Standard SOP', planned: '300000', assignedTo: 'FR&D', assigned: '300000', actual: '299000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.4', task: 'Optimization of Fluid uptake', predecessor: '1', applicability: 'All Products', taskCode: 'TC-574', jobCode: 'JOB-574', effort: '0', duration: '0', description: 'Granulation process work after binder level is set', procedure: 'Standard SOP', planned: '200000', assignedTo: 'FR&D', assigned: '200000', actual: '201000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.5', task: 'Optimization of Granulation parameters', predecessor: '3', applicability: 'All Products', taskCode: 'TC-575', jobCode: 'JOB-575', effort: '0', duration: '0', description: 'After: Optimization of Fluid uptake; Optimization of Disintegrant concentration; Optimization of diluent concentration', procedure: 'Standard SOP', planned: '200000', assignedTo: 'FR&D', assigned: '200000', actual: '228000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.6', task: 'Optimization of milling process', predecessor: '1', applicability: 'All Products', taskCode: 'TC-576', jobCode: 'JOB-576', effort: '0', duration: '0', description: 'After: Optimization of Granulation parameters', procedure: 'Standard SOP', planned: '200000', assignedTo: 'FR&D', assigned: '200000', actual: '223000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.7', task: 'Optimization of Blending time', predecessor: '3', applicability: 'All Products', taskCode: 'TC-577', jobCode: 'JOB-577', effort: '0', duration: '0', description: 'Blending after glidant/lubricant levels set', procedure: 'Standard SOP', planned: '200000', assignedTo: 'FR&D', assigned: '200000', actual: '190000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '5.7', slNo: '5.7.8', task: 'Optimization of Coating', predecessor: '1', applicability: 'All Products', taskCode: 'TC-578', jobCode: 'JOB-578', effort: '0', duration: '0', description: 'After: Optimization of Blending time', procedure: 'Standard SOP', planned: '250000', assignedTo: 'FR&D', assigned: '250000', actual: '254000', cost: '250000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '5.8', slNo: '5.8.1', task: 'Confirm facility, equipment and process readiness', predecessor: '2', applicability: 'All Products', taskCode: 'TC-581', jobCode: 'JOB-581', effort: '0', duration: '0', description: 'Control: plant informed and strategy approved; gates scale-up batch', procedure: 'Standard SOP', planned: '150000', assignedTo: 'Operations / Engineering / QA', assigned: '150000', actual: '158000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S6
  //   'S6': {
  //     sidebarMenus: [
  //       { slNo: '6.1', name: 'Analytical method validation', count: 1, isOpen: true },
  //       { slNo: '6.2', name: 'Method transfer and cleaning validation', count: 2, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '6.1', slNo: '6.1.1', task: 'API Analytical Method Validation', predecessor: '2', applicability: 'All Products', taskCode: 'TC-611', jobCode: 'JOB-611', effort: '0', duration: '0', description: 'API AMV needs finalised API methods and pre-validated methods', procedure: 'Standard SOP', planned: '400000', assignedTo: 'ARD', assigned: '400000', actual: '371000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '6.2', slNo: '6.2.1', task: 'Method Transfer', predecessor: '2', applicability: 'All Products', taskCode: 'TC-621', jobCode: 'JOB-621', effort: '0', duration: '0', description: 'Method transfer to QC after API & FP AMV', procedure: 'Standard SOP', planned: '150000', assignedTo: 'ARD', assigned: '150000', actual: '169000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '6.2', slNo: '6.2.2', task: 'Cleaning Validation', predecessor: '1', applicability: 'All Products', taskCode: 'TC-622', jobCode: 'JOB-622', effort: '0', duration: '0', description: 'Cleaning validation in parallel with method transfer', procedure: 'Standard SOP', planned: '200000', assignedTo: 'ARD', assigned: '200000', actual: '223000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S7
  //   'S7': {
  //     sidebarMenus: [
  //       { slNo: '7.1', name: 'FP method validation, FP specifications and STP', count: 2, isOpen: true }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '7.1', slNo: '7.1.1', task: 'Submission of FP samples for AMV', predecessor: '2', applicability: 'All Products', taskCode: 'TC-711', jobCode: 'JOB-711', effort: '0', duration: '0', description: 'AMV samples from scale-up batch, after method development report', procedure: 'Standard SOP', planned: '50000', assignedTo: 'ARD', assigned: '50000', actual: '48000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '7.1', slNo: '7.1.2', task: 'FP Analytical Method Validation', predecessor: '1', applicability: 'All Products', taskCode: 'TC-712', jobCode: 'JOB-712', effort: '0', duration: '0', description: 'After: Submission of FP samples for AMV', procedure: 'Standard SOP', planned: '500000', assignedTo: 'ARD', assigned: '500000', actual: '526000', cost: '500000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S8
  //   'S8': {
  //     sidebarMenus: [
  //       { slNo: '8.1', name: 'Technology transfer documents', count: 31, isOpen: true },
  //       { slNo: '8.2', name: 'Technology transfer acceptance', count: 1, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '8.1', slNo: '8.1.1', task: 'Title Page', predecessor: '3', applicability: 'All Products', taskCode: 'TC-811', jobCode: 'JOB-811', effort: '0', duration: '0', description: 'TTD starts after pilot-result approval (5.5.2) and formulation/process/packaging freeze (4.6.1)', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.2', task: 'Approval Page', predecessor: '1', applicability: 'All Products', taskCode: 'TC-812', jobCode: 'JOB-812', effort: '0', duration: '0', description: 'Approval page signed = TTD release', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.3', task: 'Table of contents', predecessor: '1', applicability: 'All Products', taskCode: 'TC-813', jobCode: 'JOB-813', effort: '0', duration: '0', description: 'Table of contents compiled last', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.4', task: 'Scope and Scheme', predecessor: '1', applicability: 'All Products', taskCode: 'TC-814', jobCode: 'JOB-814', effort: '0', duration: '0', description: 'After: Title Page', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.5', task: 'Test license', predecessor: '2', applicability: 'All Products', taskCode: 'TC-815', jobCode: 'JOB-815', effort: '0', duration: '0', description: 'After: Title Page; Application processing & Other administrative Documents (API Manufacturing License, MSDS, API UTB & CT-15)', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.6', task: 'Procurement package', predecessor: '2', applicability: 'All Products', taskCode: 'TC-816', jobCode: 'JOB-816', effort: '0', duration: '0', description: 'After: Title Page; RM, PM, Consumables, Miscellaneous procurement', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.7', task: 'Drug Substance Specifications and Standard Test Procedure', predecessor: '2', applicability: 'All Products', taskCode: 'TC-817', jobCode: 'JOB-817', effort: '0', duration: '0', description: 'After: Title Page; API Analytical Method Validation', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '13000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.8', task: 'Raw material Specifications and Standard Test Procedure', predecessor: '1', applicability: 'All Products', taskCode: 'TC-818', jobCode: 'JOB-818', effort: '0', duration: '0', description: 'After: Title Page', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.9', task: 'Packaging material Specifications and Standard Test Procedure', predecessor: '2', applicability: 'All Products', taskCode: 'TC-819', jobCode: 'JOB-819', effort: '0', duration: '0', description: 'After: Title Page; Alternative packing material evaluation', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '13000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.10', task: 'Finished product Specifications and Standard Test Procedures: In-process; Release and Shelf-life', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8110', jobCode: 'JOB-8110', effort: '0', duration: '0', description: 'After: Title Page; FP Analytical Method Validation', procedure: 'Standard SOP', planned: '40000', assignedTo: 'DQA', assigned: '40000', actual: '45000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.11', task: 'Master Formula Record', predecessor: '7', applicability: 'All Products', taskCode: 'TC-8111', jobCode: 'JOB-8111', effort: '0', duration: '0', description: 'After: Title Page; Hold Time and Compatibility Studies; Optimization of Terminal sterilization time; Optimization of Lyophilization cycle; Specific Filtration system including TFF; Specific activities / processes Optimization related to NDDS; Optimization of Coating', procedure: 'Standard SOP', planned: '30000', assignedTo: 'DQA', assigned: '30000', actual: '34000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.12', task: 'Master Packaging Record', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8112', jobCode: 'JOB-8112', effort: '0', duration: '0', description: 'After: Master Formula Record; Packaging material Specifications and Standard Test Procedure', procedure: 'Standard SOP', planned: '25000', assignedTo: 'DQA', assigned: '25000', actual: '28000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.13', task: 'Stability Plan.', predecessor: '3', applicability: 'All Products', taskCode: 'TC-8113', jobCode: 'JOB-8113', effort: '0', duration: '0', description: 'After: Finished product Specifications and Standard Test Procedures: In-process; Release and Shelf-life; Photo stability/ Thermal cycling/Temperature Excursion study/Preservative efficacy study/Antioxidant Efficacy study/; Inuse stability study', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.14', task: 'Photo stability Plan', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8114', jobCode: 'JOB-8114', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '13000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.15', task: 'Routine stability study plan', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8115', jobCode: 'JOB-8115', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '17000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.16', task: 'In-Use stability plan', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8116', jobCode: 'JOB-8116', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '17000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.17', task: 'XRD-Stability study plan', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8117', jobCode: 'JOB-8117', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.18', task: 'Deactivation Study Protocol (If applicable)', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8118', jobCode: 'JOB-8118', effort: '0', duration: '0', description: 'After: Title Page', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.19', task: 'Trade Dress Proposal Form [TDPF] (If applicable)', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8119', jobCode: 'JOB-8119', effort: '0', duration: '0', description: 'After: Title Page; Capsule shell shade card & Art Work', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '13000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.20', task: 'Temperature Excursion', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8120', jobCode: 'JOB-8120', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.21', task: 'Thermal Cycling Stability plan', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8121', jobCode: 'JOB-8121', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.22', task: 'Miscellaneous Study protocol', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8122', jobCode: 'JOB-8122', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.23', task: 'Reconstitution and Admixture study protocol', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8123', jobCode: 'JOB-8123', effort: '0', duration: '0', description: 'After: Stability Plan.', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.24', task: 'Dissolution Protocol (if applicable)', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8124', jobCode: 'JOB-8124', effort: '0', duration: '0', description: 'After: Title Page; Multimedia dissolution mapping with reference product', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.25', task: 'Filter validation study protocol and Report', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8125', jobCode: 'JOB-8125', effort: '0', duration: '0', description: 'After: Title Page; Filter Validation study', procedure: 'Standard SOP', planned: '100000', assignedTo: 'DQA', assigned: '100000', actual: '95000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.26', task: 'CPP &CQA', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8126', jobCode: 'JOB-8126', effort: '0', duration: '0', description: 'After: Title Page; Optimization of Coating', procedure: 'Standard SOP', planned: '30000', assignedTo: 'DQA', assigned: '30000', actual: '33000', cost: '30000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.27', task: 'Tool Drawings', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8127', jobCode: 'JOB-8127', effort: '0', duration: '0', description: 'After: Title Page; Tablet Tooling Procurement', procedure: 'Standard SOP', planned: '20000', assignedTo: 'DQA', assigned: '20000', actual: '20000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.28', task: 'Packaging material development report (if applicable)', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8128', jobCode: 'JOB-8128', effort: '0', duration: '0', description: 'After: Title Page; Alternative packing material evaluation', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.29', task: 'Material Safety Data Sheet', predecessor: '1', applicability: 'All Products', taskCode: 'TC-8129', jobCode: 'JOB-8129', effort: '0', duration: '0', description: 'After: Title Page', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '15000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.30', task: 'Consumables', predecessor: '2', applicability: 'All Products', taskCode: 'TC-8130', jobCode: 'JOB-8130', effort: '0', duration: '0', description: 'After: Title Page; BOM for Consumables', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '16000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '8.1', slNo: '8.1.31', task: 'Change History', predecessor: '23', applicability: 'All Products', taskCode: 'TC-8131', jobCode: 'JOB-8131', effort: '0', duration: '0', description: 'Change history closes once every TTD section is complete', procedure: 'Standard SOP', planned: '15000', assignedTo: 'DQA', assigned: '15000', actual: '14000', cost: '15000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '8.2', slNo: '8.2.1', task: 'Obtain receiving-site acceptance of technology transfer', predecessor: '1', applicability: 'All Products', taskCode: 'TC-821', jobCode: 'JOB-821', effort: '0', duration: '0', description: 'Control: receiving site accepts the released TTD before exhibit batch preparation', procedure: 'Standard SOP', planned: '25000', assignedTo: 'Operations / QA', assigned: '25000', actual: '26000', cost: '25000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S9
  //   'S9': {
  //     sidebarMenus: [
  //       { slNo: '9.1', name: 'Exhibit batch readiness and execution', count: 22, isOpen: true },
  //       { slNo: '9.2', name: 'Data generation on EB batches', count: 9, isOpen: false },
  //       { slNo: '9.3', name: 'Exhibit batch stability', count: 2, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '9.1', slNo: '9.1.1', task: 'Final Specifications preparation & Approval - Raw materials', predecessor: '1', applicability: 'All Products', taskCode: 'TC-911', jobCode: 'JOB-911', effort: '0', duration: '0', description: 'Final specs prepared after receiving-site acceptance of TTD (8.2.1)', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '39000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.2', task: 'Final Specifications preparation & Approval - Packaging materials', predecessor: '1', applicability: 'All Products', taskCode: 'TC-912', jobCode: 'JOB-912', effort: '0', duration: '0', description: 'After: Approval Page — after receiving-site acceptance (8.2.1)', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '46000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.3', task: 'Final Specifications preparation & Approval - Finished product', predecessor: '1', applicability: 'All Products', taskCode: 'TC-913', jobCode: 'JOB-913', effort: '0', duration: '0', description: 'After: Approval Page — after receiving-site acceptance (8.2.1)', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '42000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.4', task: 'Routine stability protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-914', jobCode: 'JOB-914', effort: '0', duration: '0', description: 'Protocols need FP spec and matching TTD plan', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '40000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.5', task: 'In-Use Stability protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-915', jobCode: 'JOB-915', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; In-Use stability plan', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '41000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.6', task: 'Photo stability protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-916', jobCode: 'JOB-916', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; Photo stability Plan', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '37000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.7', task: 'Polymorphic stability protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-917', jobCode: 'JOB-917', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; XRD-Stability study plan', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '38000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.8', task: 'Dissolution studies protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-918', jobCode: 'JOB-918', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; Dissolution Protocol (if applicable)', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '39000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.9', task: 'Sub division of tablets study protocol', predecessor: '1', applicability: 'All Products', taskCode: 'TC-919', jobCode: 'JOB-919', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '42000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.10', task: 'Thermal cycling / Freeze thaw study protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-9110', jobCode: 'JOB-9110', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; Thermal Cycling Stability plan', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '38000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.11', task: 'Reconstitution and dilution studies protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-9111', jobCode: 'JOB-9111', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; Reconstitution and Admixture study protocol', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '38000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.12', task: 'Preparation & approval of Process validation Protocols', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9112', jobCode: 'JOB-9112', effort: '0', duration: '0', description: 'After: Approval Page — after receiving-site acceptance (8.2.1)', procedure: 'Standard SOP', planned: '60000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '60000', actual: '54000', cost: '60000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.13', task: 'Preparation & approval of Hold time study Protocols', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9113', jobCode: 'JOB-9113', effort: '0', duration: '0', description: 'After: Approval Page — after receiving-site acceptance (8.2.1)', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '42000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.14', task: 'Preparation & Approval of BMRs', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9114', jobCode: 'JOB-9114', effort: '0', duration: '0', description: 'After: Approval Page — after receiving-site acceptance (8.2.1)', procedure: 'Standard SOP', planned: '50000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '50000', actual: '47000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.15', task: 'Preparation & Approval of BPRs', predecessor: '2', applicability: 'All Products', taskCode: 'TC-9115', jobCode: 'JOB-9115', effort: '0', duration: '0', description: 'After: Approval Page; Final Specifications preparation & Approval - Packaging materials — after receiving-site acceptance (8.2.1)', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '45000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.16', task: 'Process Order Creation as per BMR', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9116', jobCode: 'JOB-9116', effort: '0', duration: '0', description: 'Process order raised 1 day before BMR approval (FS-1)', procedure: 'Standard SOP', planned: '5000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '5000', actual: '6000', cost: '5000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.17', task: 'Process Order Creation as per BPR', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9117', jobCode: 'JOB-9117', effort: '0', duration: '0', description: 'Process order raised 1 day before BPR approval (FS-1)', procedure: 'Standard SOP', planned: '5000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '5000', actual: '4000', cost: '5000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.18', task: 'Exhibit batch Execution: 3 Batches', predecessor: '8', applicability: 'All Products', taskCode: 'TC-9118', jobCode: 'JOB-9118', effort: '0', duration: '0', description: 'Needs approved specs, PV/hold-time protocols, process orders, released materials, method transfer and cleaning validation', procedure: 'Standard SOP', planned: '5500000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '5500000', actual: '5193000', cost: '5500000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.19', task: 'Exhibit batch Release: 3 Batches', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9119', jobCode: 'JOB-9119', effort: '0', duration: '0', description: 'Release starts 8 days after first batch execution starts (SS+8)', procedure: 'Standard SOP', planned: '400000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '400000', actual: '424000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.20', task: 'Batch execution data posting as BMR', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9120', jobCode: 'JOB-9120', effort: '0', duration: '0', description: 'After: Exhibit batch Execution: 3 Batches', procedure: 'Standard SOP', planned: '5000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '5000', actual: '5000', cost: '5000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.21', task: 'Alcohol dose dumping study protocol', predecessor: '1', applicability: 'All Products', taskCode: 'TC-9121', jobCode: 'JOB-9121', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '37000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.1', slNo: '9.1.22', task: 'Thermal excursion study protocol', predecessor: '2', applicability: 'All Products', taskCode: 'TC-9122', jobCode: 'JOB-9122', effort: '0', duration: '0', description: 'After: Final Specifications preparation & Approval - Finished product; Temperature Excursion', procedure: 'Standard SOP', planned: '40000', assignedTo: 'QC/QA/Operation/R&D/RA', assigned: '40000', actual: '45000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '9.2', slNo: '9.2.1', task: 'Reconstitution and Dilution Studies execution on submission Batches', predecessor: '2', applicability: 'All Products', taskCode: 'TC-921', jobCode: 'JOB-921', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches; Reconstitution and dilution studies protocol', procedure: 'Standard SOP', planned: '200000', assignedTo: 'QC/QA', assigned: '200000', actual: '207000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.2', task: 'Multimedia dissolution profile execution both test and reference products and Comparative dissolution Report', predecessor: '2', applicability: 'All Products', taskCode: 'TC-922', jobCode: 'JOB-922', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches; Dissolution studies protocol', procedure: 'Standard SOP', planned: '300000', assignedTo: 'QC/QA', assigned: '300000', actual: '302000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.3', task: 'pH Solubility Profile to support BCS biowaiver', predecessor: '1', applicability: 'All Products', taskCode: 'TC-923', jobCode: 'JOB-923', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches', procedure: 'Standard SOP', planned: '150000', assignedTo: 'QC/QA', assigned: '150000', actual: '164000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.4', task: '6M stability data availability - Accelerated, Long term, Intermediate', predecessor: '2', applicability: 'All Products', taskCode: 'TC-924', jobCode: 'JOB-924', effort: '0', duration: '0', description: '6M stability counted from exhibit stability loading / T0 (9.3.1)', procedure: 'Standard SOP', planned: '800000', assignedTo: 'QC/QA', assigned: '800000', actual: '878000', cost: '800000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.5', task: 'In-use stability, photo stability, freeze-thaw study, Temperature excursions,Polymorphic stability etc.', predecessor: '8', applicability: 'All Products', taskCode: 'TC-925', jobCode: 'JOB-925', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches; Sub division of tablets study protocol; In-Use Stability protocol; Photo stability protocol; Polymorphic stability protocol; Thermal cycling / Freeze thaw study protocol; Thermal excursion study protocol', procedure: 'Standard SOP', planned: '400000', assignedTo: 'QC/QA', assigned: '400000', actual: '373000', cost: '400000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.6', task: 'Alcohol dose dumping dissolution profile execution both test and reference products and Comparative dissolution Report', predecessor: '2', applicability: 'All Products', taskCode: 'TC-926', jobCode: 'JOB-926', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches; Alcohol dose dumping study protocol', procedure: 'Standard SOP', planned: '250000', assignedTo: 'QC/QA', assigned: '250000', actual: '227000', cost: '250000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.7', task: 'Admixture study report', predecessor: '2', applicability: 'All Products', taskCode: 'TC-927', jobCode: 'JOB-927', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches; Reconstitution and dilution studies protocol', procedure: 'Standard SOP', planned: '150000', assignedTo: 'QC/QA', assigned: '150000', actual: '149000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.8', task: 'NG tube study report', predecessor: '2', applicability: 'All Products', taskCode: 'TC-928', jobCode: 'JOB-928', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches; Miscellaneous Study protocol', procedure: 'Standard SOP', planned: '150000', assignedTo: 'QC/QA', assigned: '150000', actual: '149000', cost: '150000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.2', slNo: '9.2.9', task: 'In-use study report', predecessor: '1', applicability: 'All Products', taskCode: 'TC-929', jobCode: 'JOB-929', effort: '0', duration: '0', description: 'After: In-use stability, photo stability, freeze-thaw study, Temperature excursions,Polymorphic stability etc.', procedure: 'Standard SOP', planned: '50000', assignedTo: 'QC/QA', assigned: '50000', actual: '50000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '9.3', slNo: '9.3.1', task: 'Load exhibit stability samples and record time zero', predecessor: '2', applicability: 'All Products', taskCode: 'TC-931', jobCode: 'JOB-931', effort: '0', duration: '0', description: 'Control: stability loaded on executed exhibit batches per approved protocol (T0)', procedure: 'Standard SOP', planned: '50000', assignedTo: 'QC / QA', assigned: '50000', actual: '47000', cost: '50000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '9.3', slNo: '9.3.2', task: 'Approve initial stability dataset for dossier drafting', predecessor: '1', applicability: 'All Products', taskCode: 'TC-932', jobCode: 'JOB-932', effort: '0', duration: '0', description: 'Control: 3M data reviewed and approved (90 days after T0) before dossier drafting', procedure: 'Standard SOP', planned: '20000', assignedTo: 'QA / RA', assigned: '20000', actual: '21000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S10
  //   'S10': {
  //     sidebarMenus: [
  //       { slNo: '10.1', name: 'Demonstration-Scale Campaign studies', count: 2, isOpen: true }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '10.1', slNo: '10.1.1', task: 'RMP & Test product IP submission', predecessor: '4', applicability: 'All Products', taskCode: 'TC-1011', jobCode: 'JOB-1011', effort: '0', duration: '0', description: 'Needs exhibit batch, BE NOC, innovator product and ethics/CRO/bioanalytical readiness (5.4.6)', procedure: 'Standard SOP', planned: '100000', assignedTo: 'Clinical / R&D', assigned: '100000', actual: '108000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '10.1', slNo: '10.1.2', task: 'Demonstration-Scale Campaign execution & Report Submission', predecessor: '1', applicability: 'All Products', taskCode: 'TC-1012', jobCode: 'JOB-1012', effort: '0', duration: '0', description: 'After: RMP & Test product IP submission', procedure: 'Standard SOP', planned: '12000000', assignedTo: 'Clinical', assigned: '12000000', actual: '12742000', cost: '12000000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  //   // S11
  //   'S11': {
  //     sidebarMenus: [
  //       { slNo: '11.1', name: 'Product development report', count: 2, isOpen: true },
  //       { slNo: '11.2', name: 'Dossier filing', count: 5, isOpen: false }
  //     ],
  //     modulesData: [
  //       [
  //         { deliverableSlNo: '11.1', slNo: '11.1.1', task: 'Product Development Report (PDR)', predecessor: '4', applicability: 'All Products', taskCode: 'TC-1111', jobCode: 'JOB-1111', effort: '0', duration: '0', description: 'After: Batch execution data posting as BMR; Method development reports; Development Stability Analysis of 6M samples; Optimization of Coating', procedure: 'Standard SOP', planned: '200000', assignedTo: 'fR&D', assigned: '200000', actual: '229000', cost: '200000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '11.1', slNo: '11.1.2', task: 'Risk assessment reports like Elemental Impurities, Nitrosamines, Residual Solvents etc.', predecessor: '1', applicability: 'All Products', taskCode: 'TC-1112', jobCode: 'JOB-1112', effort: '0', duration: '0', description: 'After: Exhibit batch Release: 3 Batches', procedure: 'Standard SOP', planned: '300000', assignedTo: 'R&D', assigned: '300000', actual: '272000', cost: '300000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ],
  //       [
  //         { deliverableSlNo: '11.2', slNo: '11.2.1', task: 'Uploading of stability data of protocol bound batches in common folder', predecessor: '1', applicability: 'All Products', taskCode: 'TC-1121', jobCode: 'JOB-1121', effort: '0', duration: '0', description: 'Stability data uploaded as it is generated', procedure: 'Standard SOP', planned: '20000', assignedTo: 'QA', assigned: '20000', actual: '20000', cost: '20000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '11.2', slNo: '11.2.2', task: 'Draft dossier preparation with 3M stability data', predecessor: '11', applicability: 'All Products', taskCode: 'TC-1122', jobCode: 'JOB-1122', effort: '0', duration: '0', description: 'Draft dossier needs PDR, risk assessments, EB study reports and approved initial stability dataset (9.3.2)', procedure: 'Standard SOP', planned: '600000', assignedTo: 'RA', assigned: '600000', actual: '583000', cost: '600000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '11.2', slNo: '11.2.3', task: 'Dossier submission strategy note', predecessor: '3', applicability: 'All Products', taskCode: 'TC-1123', jobCode: 'JOB-1123', effort: '0', duration: '0', description: 'Needs draft dossier, demo campaign report and 6M stability', procedure: 'Standard SOP', planned: '40000', assignedTo: 'RA', assigned: '40000', actual: '45000', cost: '40000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '11.2', slNo: '11.2.4', task: 'Approve final dossier evidence and country compliance', predecessor: '14', applicability: 'All Products', taskCode: 'TC-1124', jobCode: 'JOB-1124', effort: '0', duration: '0', description: 'Control: all evidence, BE report and DMF/CEP confirmed against country requirements', procedure: 'Standard SOP', planned: '75000', assignedTo: 'RA / QA', assigned: '75000', actual: '79000', cost: '75000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' },
  //         { deliverableSlNo: '11.2', slNo: '11.2.5', task: 'Submit dossier and record acknowledgement', predecessor: '2', applicability: 'All Products', taskCode: 'TC-1125', jobCode: 'JOB-1125', effort: '0', duration: '0', description: 'Control: submission after strategy note and final evidence approval; project end', procedure: 'Standard SOP', planned: '100000', assignedTo: 'RA', assigned: '100000', actual: '100000', cost: '100000', worked: '0.00', remaining: '0.00', scheduled: '-', date: '-', status: 'Scheduled', submitted: '-' }
  //       ]
  //     ]
  //   },
  // };


  private stageWbsMap: { [key: string]: StageWbsConfig } = STAGE_WBS_CONFIG_MAP;

  constructor() {
    // takeUntilDestroyed automatically unsubscribes when the component is destroyed
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      this.loadStageData();
      if (params['menuIndex'] !== undefined) {
        const mIdx = Number(params['menuIndex']);
        if (!isNaN(mIdx) && mIdx >= 0 && mIdx < this.sidebarMenus.length) {
          this.selectMenu(mIdx);
        }
      }
    });
  }

  ngOnInit(): void {
    // Initialized via constructor subscription
  }

  goBack(): void {
    this.router.navigate(['/stages']);
  }

  private loadStageData(): void {
    const stageKey = this.stageCode?.trim() || 'S1';

    const nameMap: Record<string, string> = {
      'Opportunity Identification': 'S1',
      'Concept Screening & Feasibility': 'S2',
      'Route Scouting & Lab Synthesis': 'S3',
      'Process Optimization (Lab Scale)': 'S4',
      'Process Route Selection & Basis of Design': 'S5',
      'Bench-to-Pilot Process Development': 'S6',
      'Process Safety & Regulatory Studies': 'S7',
      'Regulatory Registration Filing (REACH / TSCA)': 'S8',
      'Pilot Plant Campaign': 'S9',
      'Demonstration-Scale Campaign': 'S10',
      'Commercial Plant Build & Commissioning': 'S11',
      'Commercial Launch & Ramp-Up': 'S12',
      'S0': 'S1'
    };

    let config = this.stageWbsMap[stageKey]
      || this.stageWbsMap[stageKey.toUpperCase()]
      || this.stageWbsMap[nameMap[stageKey]]
      || this.stageWbsMap[nameMap[this.stageName]]
      || this.stageWbsMap[this.stageName]
      || this.getFallbackStageConfig(this.stageName, this.stageCode);

    // Deep copy data so edits only apply locally and ensure requirements/tasks are assigned
    this.sidebarMenus = config.sidebarMenus.map(m => ({ ...m }));
    this.modulesData = config.modulesData.map((mod, modIdx) =>
      mod.map((t, taskIdx) => {
        const copy: WbsTask = { ...t };
        const knownReqs = getRequirementsForWbs(t.slNo, t.task);
        if (knownReqs && knownReqs.length > 0) {
          copy.requirements = String(knownReqs.length);
        } else if (!copy.requirements) {
          copy.requirements = this.getDefaultRequirements(modIdx, taskIdx);
        } else if (typeof copy.requirements === 'string' && copy.requirements.includes('/')) {
          copy.requirements = copy.requirements.split('/')[0];
        }

        const reqItems = getRequirementItemsForWbs(t.slNo, t.task);
        if (reqItems && reqItems.length > 0) {
          copy.requirementsData = reqItems.map((item, i) => {
            const { department, role } = getDepartmentAndRoleForRequirement(item.requirement);
            return {
              id: Date.now() + i,
              active: true,
              done: i < 2,
              requirementName: item.requirement,
              department: department,
              role: role,
              dueDate: '2026-03-15',
              completedDate: i < 2 ? '2026-03-01' : '',
              remarks: 'Atomic prerequisite / resource verified',
              historyCount: this.getHistoryCount(i),
              isEditing: false
            };
          });
        }

        const keysToCheck = [t.slNo, t.activityCode, t.taskCode, t.task].filter(Boolean);
        for (const k of keysToCheck) {
          const savedReqs = sessionStorage.getItem('stages_requirements_' + k);
          if (savedReqs) {
            try {
              const parsed = JSON.parse(savedReqs);
              if (Array.isArray(parsed)) {
                copy.requirements = String(parsed.length);
                copy.requirementsData = parsed;
                break;
              }
            } catch (e) { }
          }
        }
        const knownTasks = getTasksForWbs(t.slNo, t.task);
        if (knownTasks && knownTasks.length > 0) {
          copy.tasks = String(knownTasks.length);
        } else if (!copy.tasks) {
          copy.tasks = this.getDefaultTasks(modIdx, taskIdx);
        } else if (typeof copy.tasks === 'string' && copy.tasks.includes('/')) {
          copy.tasks = copy.tasks.split('/')[0];
        }

        const taskItems = getTaskItemsForWbs(t.slNo, t.task);
        if (taskItems && taskItems.length > 0) {
          copy.tasksData = taskItems.map((item, i) => {
            const details = getTaskDetails(item.task, i, t.slNo, t.activityCode, t.jobCode, item.taskId);
            return {
              id: Date.now() + i,
              active: true,
              done: i < 2,
              taskName: item.task,
              taskCode: item.taskId || details.taskCode,
              jobCode: details.jobCode,
              department: details.department,
              role: details.role,
              dueDate: details.dueDate,
              completedDate: i < 2 ? '2026-03-01' : '',
              remarks: 'Atomic task / deliverable verified',
              historyCount: this.getHistoryCount(i),
              isEditing: false
            };
          });
        }

        for (const k of keysToCheck) {
          const savedTasks = sessionStorage.getItem('stages_tasks_' + k);
          if (savedTasks) {
            try {
              const parsed = JSON.parse(savedTasks);
              if (Array.isArray(parsed)) {
                copy.tasks = String(parsed.length);
                copy.tasksData = parsed;
                break;
              }
            } catch (e) { }
          }
        }
        const est = getActivityEstimates(copy);
        copy.min = est.min;
        copy.max = est.max;
        copy.mean = est.mean;
        copy.median = est.median;

        // Populate Plan Duration (days) and Plan Effort (hours) based on min, max, median (PERT / Median)
        const dur = Math.round((est.min + 4 * est.median + est.max) / 6) || Math.round(est.median) || 1;
        if (!copy.duration || copy.duration === '0' || copy.duration === '—') {
          copy.duration = String(dur);
        }
        if (!copy.effort || copy.effort === '0' || copy.effort === '—') {
          const durNum = Number(copy.duration) || dur;
          copy.effort = String(durNum * 8);
        }
        if (!copy.historyCount) {
          copy.historyCount = this.getHistoryCount(taskIdx);
        }
        if (!copy.updatedDate) {
          const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20', '2026-01-15', '2026-01-10'];
          copy.updatedDate = sampleDates[(modIdx * 3 + taskIdx) % sampleDates.length];
        }
        if (!copy.updatedBy) {
          copy.updatedBy = copy.assignedTo || 'Dr. Sarah Jenkins';
        }
        if (copy.manPowerBudget === undefined || copy.manPowerBudget === null) {
          copy.manPowerBudget = copy.planned && copy.planned !== '0' && copy.planned !== '0.00' ? copy.planned : '40000';
        }
        if (copy.materialBudget === undefined || copy.materialBudget === null) {
          copy.materialBudget = copy.cost && copy.cost !== '40000' ? copy.cost : '0';
        }
        if (copy.resourceBudget === undefined || copy.resourceBudget === null) {
          copy.resourceBudget = '0';
        }
        return copy;
      })
    );

    // Sync menu counts
    this.sidebarMenus.forEach((menu, i) => {
      menu.count = this.modulesData[i]?.length || 0;
    });

    this.selectedMenuIndex = 0;
    this.sidebarMenus.forEach((m, idx) => m.isOpen = idx === 0);
    this.tableData = this.modulesData[0] || [];
    this.totalItems = this.tableData.length;
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  private getFallbackStageConfig(name: string, code: string): StageWbsConfig {
    return {
      sidebarMenus: [
        { slNo: '1.1', name: `${name} Planning & Setup`, count: 0, isOpen: true }
      ],
      modulesData: [[]]
    };
  }

  private getDefaultRequirements(modIdx: number, taskIdx: number): string {
    const numbers = ['7', '8', '9', '1', '2', '3', '4', '5', '6', '10', '11', '12', '13'];
    const index = (modIdx * 3 + taskIdx * 2) % numbers.length;
    return numbers[index];
  }

  private getDefaultTasks(modIdx: number, taskIdx: number): string {
    const numbers = ['8', '1', '7', '9', '5', '12', '4', '6', '3', '10', '2', '11', '13'];
    const index = (modIdx * 3 + taskIdx * 2 + 1) % numbers.length;
    return numbers[index];
  }

  selectMenu(index: number): void {
    this.selectedMenuIndex = index;
    this.sidebarMenus.forEach((menu, i) => {
      menu.isOpen = (i === index) ? !menu.isOpen : false;
    });
    this.tableData = this.modulesData[index] || [];
    this.pageIndex = 0;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, startIndex + this.pageSize);
  }

  formatBudget(val: any): string {
    if (val === null || val === undefined || val === '' || val === '—') return '₹ 0';
    if (typeof val === 'string' && (val.startsWith('₹') || val.startsWith('$') || val.startsWith('Rs.'))) return val;
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
    if (isNaN(num)) return String(val);
    if (num === 0) return '₹ 0';
    return '₹ ' + Math.round(num).toLocaleString('en-IN');
  }

  openAddDeliverableDialog(): void {
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: '1.2',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        const nextSlNo = result.stage || `${this.stageCode}.${this.sidebarMenus.length + 1}`;
        this.sidebarMenus.push({
          slNo: nextSlNo,
          name: result.deliverableName,
          count: 0,
          isOpen: false
        });
        this.modulesData.push([]);
      }
    });
  }

  onDeliverableDrop(event: CdkDragDrop<SidebarMenu[]>): void {
    if (event.previousIndex === event.currentIndex || event.previousIndex === 0 || event.currentIndex === 0) return;

    const currentSelected = this.sidebarMenus[this.selectedMenuIndex];

    moveItemInArray(this.sidebarMenus, event.previousIndex, event.currentIndex);
    moveItemInArray(this.modulesData, event.previousIndex, event.currentIndex);

    if (currentSelected) {
      this.selectedMenuIndex = this.sidebarMenus.indexOf(currentSelected);
    }

    this.tableData = this.modulesData[this.selectedMenuIndex] || [];
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  editDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: menu.slNo,
        name: menu.name,
        deliverableName: menu.name,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        menu.name = result.deliverableName;
        if (result.stage) {
          menu.slNo = result.stage;
          if (this.modulesData[index]) {
            this.modulesData[index].forEach(task => {
              task.deliverableSlNo = result.stage;
            });
          }
        }
      }
    });
  }

  deleteDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: menu
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sidebarMenus.splice(index, 1);
        this.modulesData.splice(index, 1);

        if (this.selectedMenuIndex >= this.sidebarMenus.length) {
          this.selectedMenuIndex = Math.max(0, this.sidebarMenus.length - 1);
        }

        if (this.sidebarMenus.length > 0) {
          this.sidebarMenus.forEach((m, i) => {
            m.isOpen = (i === this.selectedMenuIndex);
          });
          this.tableData = this.modulesData[this.selectedMenuIndex] || [];
        } else {
          this.tableData = [];
        }

        this.pageIndex = 0;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openAddActivityDialog(): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';
    const nextId = this.tableData.length + 1;
    const parentSl = this.sidebarMenus[this.selectedMenuIndex]?.slNo || `1.${this.selectedMenuIndex + 1}`;
    const taskSlNo = `${parentSl}.${nextId}`;

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        department: 'R&D',
        stageSerial: taskSlNo,
        sequence: taskSlNo,
        slNo: taskSlNo,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.activityName) {
        const nextId = this.tableData.length + 1;
        const parentSl = this.sidebarMenus[this.selectedMenuIndex]?.slNo || `1.${this.selectedMenuIndex + 1}`;
        const taskSlNo = `${parentSl}.${nextId}`;

        const newTask: WbsTask = {
          deliverableSlNo: parentSl,
          slNo: taskSlNo,
          task: result.activityName,
          activityCode: result.activityCode || `ACT-${this.selectedMenuIndex + 1}0${nextId}`,
          department: result.department || 'R&D',
          section: result.section || 'Formulation Development',
          predecessor: result.predecessor || '—',
          predecessorsData: result.predecessors || result.predecessorsData,
          applicability: result.applicability || 'All Products',
          taskCode: `TC-${this.selectedMenuIndex + 1}0${nextId}`,
          jobCode: `JOB${nextId}`,
          effort: result.planEffort || '0',
          duration: result.planDuration || '0',
          description: result.description || '',
          procedure: 'Standard SOP',
          planned: '0.00',
          assignedTo: result.department || 'Unassigned',
          assigned: '0.00',
          actual: '0.00',
          cost: result.materialBudget || '0.00',
          manPowerBudget: result.manPowerBudget || '0.00',
          materialBudget: result.materialBudget || '0.00',
          resourceBudget: result.resourceBudget || '0.00',
          worked: '0.00',
          remaining: '0.00',
          scheduled: '-',
          date: '-',
          status: 'Scheduled',
          submitted: '-',
          requirements: `${Math.floor(Math.random() * 13) + 1}`,
          tasks: `${Math.floor(Math.random() * 13) + 1}/14`
        };

        const est = getActivityEstimates(newTask);
        newTask.min = est.min;
        newTask.max = est.max;
        newTask.mean = est.mean;
        newTask.median = est.median;
        if (!newTask.duration || newTask.duration === '0' || newTask.duration === '—') {
          const dur = Math.round((est.min + 4 * est.median + est.max) / 6) || Math.round(est.median) || 1;
          newTask.duration = String(dur);
          if (!newTask.effort || newTask.effort === '0' || newTask.effort === '—') {
            newTask.effort = String(dur * 8);
          }
        }

        this.tableData.push(newTask);
        this.modulesData[this.selectedMenuIndex] = this.tableData;
        this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openEditActivityDialog(row: WbsTask): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        department: row.department || 'R&D',
        section: row.section || 'Formulation Development',
        applicability: row.applicability,
        description: row.description,
        planDuration: row.duration,
        planEffort: row.effort,
        manPowerBudget: row.manPowerBudget ?? row.planned,
        materialBudget: row.materialBudget ?? row.cost,
        resourceBudget: row.resourceBudget ?? '0',
        predecessor: row.predecessor !== '—' ? row.predecessor : '',
        predecessorsData: row.predecessorsData,
        stageSerial: row.slNo || row.deliverableSlNo,
        sequence: row.slNo,
        slNo: row.slNo,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.activityName) row.task = result.activityName;
        if (result.activityCode !== undefined) row.activityCode = result.activityCode;
        if (result.department !== undefined) row.department = result.department;
        if (result.section !== undefined) row.section = result.section;
        if (result.applicability !== undefined) row.applicability = result.applicability;
        if (result.description !== undefined) row.description = result.description;
        if (result.planEffort !== undefined) row.effort = result.planEffort;
        if (result.planDuration !== undefined) row.duration = result.planDuration;
        if (result.manPowerBudget !== undefined) row.manPowerBudget = result.manPowerBudget;
        if (result.materialBudget !== undefined) {
          row.cost = result.materialBudget;
          row.materialBudget = result.materialBudget;
        }
        if (result.resourceBudget !== undefined) row.resourceBudget = result.resourceBudget;
        if (result.predecessor !== undefined) row.predecessor = result.predecessor || '—';
        if (result.predecessors !== undefined) row.predecessorsData = result.predecessors;
        this.updatePaginatedData();
      }
    });
  }

  deleteTask(row: WbsTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.modulesData[this.selectedMenuIndex] = this.tableData;
          this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
          this.totalItems = this.tableData.length;
          this.updatePaginatedData();
        }
      }
    });
  }

  openfilepop(): void {

  }

  scrollLeft(): void {
    this.scrollTable('left');
  }

  scrollRight(): void {
    this.scrollTable('right');
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }








  assignrequirement(row?: WbsTask): void {
    if (!row) return;
    this.router.navigate(['/stages/wbs/requirements'], {
      queryParams: {
        activityName: row.task || '',
        activityCode: row.activityCode || row.taskCode || '',
        jobCode: row.jobCode || '',
        slNo: row.slNo || '',
        requirements: row.requirements || '',
        menuIndex: this.selectedMenuIndex,
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode
      }
    });
  }

  openRequirementsDialog(row?: WbsTask): void {
    if (!row) return;
    const dialogRef = this.dialog.open(AssignRequirementsComponent, {
      width: '1050px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        row,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        jobCode: row.jobCode,
        slNo: row.slNo,
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.requirements) {
        row.requirementsData = res.requirements;
        row.requirements = String(res.requirements.length);
        this.updatePaginatedData();
      }
    });
  }


  assigntasks(row?: WbsTask): void {
    if (!row) return;
    this.router.navigate(['/stages/wbs/tasks'], {
      queryParams: {
        activityName: row.task || '',
        activityCode: row.activityCode || row.taskCode || '',
        jobCode: row.jobCode || '',
        slNo: row.slNo || '',
        tasks: row.tasks || '',
        menuIndex: this.selectedMenuIndex,
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode
      }
    });
  }

  openTasksDialog(row?: WbsTask): void {
    if (!row) return;
    const dialogRef = this.dialog.open(AssignTasksComponent, {
      width: '1050px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        row,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        jobCode: row.jobCode,
        slNo: row.slNo,
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.tasks) {
        row.tasksData = res.tasks;
        row.tasks = String(res.tasks.length);
        const est = getActivityEstimates(row);
        row.min = est.min;
        row.max = est.max;
        row.mean = est.mean;
        row.median = est.median;
        const dur = Math.round((est.min + 4 * est.median + est.max) / 6) || Math.round(est.median) || 1;
        row.duration = String(dur);
        row.effort = String(dur * 8);
        this.updatePaginatedData();
      }
    });
  }

  openPredecessor(row?: WbsTask): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: { mode: 'edit', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessor = String(result.predecessor);
        }
        this.updatePaginatedData();
      }
    });
  }

  openHistory(row: WbsTask, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/stages/wbs/history'], {
      queryParams: {
        slNo: row.slNo,
        task: row.task,
        activityCode: row.activityCode || row.taskCode || '',
        tasks: row.tasks || '',
        requirements: row.requirements || '',
        predecessor: row.predecessor || '',
        duration: row.duration || '',
        effort: row.effort || '',
        cost: row.cost || '',
        manPowerBudget: row.manPowerBudget ?? row.planned ?? '',
        materialBudget: row.materialBudget ?? row.cost ?? '',
        resourceBudget: row.resourceBudget ?? '',
        applicability: row.applicability || 'All Products',
        description: row.description || '',
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode,
        deliverableSlNo: row.deliverableSlNo,
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  onDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    // 1. Reorder the array items in the current page
    moveItemInArray(this.paginatedData, event.previousIndex, event.currentIndex);

    // 2. Sync back to the main tableData and modulesData:
    const startIndex = this.pageIndex * this.pageSize;
    this.tableData.splice(startIndex, this.pageSize, ...this.paginatedData);
    this.modulesData[this.selectedMenuIndex] = this.tableData;

    this.updatePaginatedData();
  }
}
