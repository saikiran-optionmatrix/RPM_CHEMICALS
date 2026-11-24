import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AddDocumentComponent } from './add-document/add-document.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { ViewDocsComponent } from './view-docs/view-docs.component';

export interface TaskDocumentItem {
  id: string | number;
  stageName: string;
  deliverableName: string;
  activityName: string;
  taskName: string;
  documentsCount: number;
  documents?: { id: number; title: string; uploadedDate?: string }[];
}

export interface GateDocumentItem {
  id: string | number;
  gateCode: string;
  gateName: string;
  documentTitle: string;
  uploadedDate?: string;
  uploadedBy?: string;
}

export interface ActivityNode {
  id: string | number;
  name: string;
  jobCode?: string;
  tasks: TaskDocumentItem[];
}

export interface DeliverableNode {
  id: string | number;
  name: string;
  expanded?: boolean;
  activities: ActivityNode[];
}

export interface StageNode {
  id: string | number;
  type: 'stage';
  stageCode: string;
  stageName: string;
  gateCode?: string;
  expanded?: boolean;
  deliverables: DeliverableNode[];
}

export interface GateNode {
  id: string | number;
  type: 'gate';
  gateCode: string;
  gateName: string;
  documents: GateDocumentItem[];
}

export type TreeNode = StageNode | GateNode;

@Component({
  selector: 'app-project-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './project-documents.component.html',
  styleUrl: './project-documents.component.scss'
})
export class ProjectDocumentsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

  // Filter dropdown: All, Stages, Gates
  selectedFilter: 'All' | 'Stages' | 'Gates' = 'All';

  // Tree Nodes
  allTreeNodes: TreeNode[] = [];
  filteredTreeNodes: TreeNode[] = [];

  // Currently selected item: can be 'stage', 'deliverable', 'activity', or 'gate'
  selectedItemType: 'stage' | 'deliverable' | 'activity' | 'gate' = 'stage';
  selectedStage: StageNode | null = null;
  selectedDeliverable: DeliverableNode | null = null;
  selectedActivity: ActivityNode | null = null;
  selectedGate: GateNode | null = null;

  // Active table datasets
  currentActivityTasks: TaskDocumentItem[] = [];
  filteredActivityTasks: TaskDocumentItem[] = [];

  currentGateDocuments: GateDocumentItem[] = [];
  filteredGateDocuments: GateDocumentItem[] = [];

  // Search keyword for table rows
  tableSearchKeyword: string = '';

  // Pagination matching AssetsComponent
  pageIndex: number = 0;
  pageSize: number = 10;

  get paginatedActivityTasks(): TaskDocumentItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredActivityTasks.slice(startIndex, startIndex + this.pageSize);
  }

  get paginatedGateDocuments(): GateDocumentItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredGateDocuments.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
    });

    this.initMasterTreeData();
    this.applyTreeFilter();

    // Default select Stage 1 (Business Case) so all its tasks appear in the grid
    this.setDefaultSelection();
  }

  private initMasterTreeData(): void {
    // 1. Stage 1: Opportunity Identification
    const stage1: StageNode = {
      id: 'S1',
      type: 'stage',
      stageCode: 'S1',
      stageName: 'Opportunity Identification',
      gateCode: 'Gate 1',
      expanded: true,
      deliverables: [
        {
          id: 'D1-1',
          name: 'Market and competitor grade analysis',
          expanded: true,
          activities: [
            {
              id: 'A1-1',
              name: 'Competitor grade and price benchmarking',
              jobCode: 'CHM-T001',
              tasks: [
                {
                  id: 'T1-1',
                  stageName: 'Opportunity Identification',
                  deliverableName: 'Market and competitor grade analysis',
                  activityName: 'Competitor grade and price benchmarking',
                  taskName: 'Market opportunity assessment & end-use demand review',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Chemical_Market_Demand_Report.pdf', uploadedDate: '2026-01-08' },
                    { id: 2, title: 'Emulsion_Demand_Model_2026.xlsx', uploadedDate: '2026-01-09' },
                    { id: 3, title: 'Coatings_Adhesives_Segment_Review.pdf', uploadedDate: '2026-01-10' },
                    { id: 4, title: 'Customer_Specification_Survey.pdf', uploadedDate: '2026-01-11' }
                  ]
                },
                {
                  id: 'T1-2',
                  stageName: 'Opportunity Identification',
                  deliverableName: 'Market and competitor grade analysis',
                  activityName: 'Competitor grade and price benchmarking',
                  taskName: 'Competitive landscape and patent mapping',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Competitor_Grade_Benchmarking.pdf', uploadedDate: '2026-01-12' },
                    { id: 2, title: 'Patent_Landscape_Acrylic_Emulsion.pdf', uploadedDate: '2026-01-13' },
                    { id: 3, title: 'FTO_Search_Report.pdf', uploadedDate: '2026-01-14' }
                  ]
                },
                {
                  id: 'T1-3',
                  stageName: 'Opportunity Identification',
                  deliverableName: 'Market and competitor grade analysis',
                  activityName: 'Competitor grade and price benchmarking',
                  taskName: 'Pricing strategy and contract price projection',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Pricing_Strategy_Draft.pdf', uploadedDate: '2026-01-14' },
                    { id: 2, title: 'Raw_Material_PassThrough_Formula.xlsx', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            },
            {
              id: 'A1-2',
              name: 'Project economics and risk screening',
              jobCode: 'CHM-T002',
              tasks: [
                {
                  id: 'T1-4',
                  stageName: 'Opportunity Identification',
                  deliverableName: 'Project economics and risk screening',
                  activityName: 'Project economics and risk screening',
                  taskName: 'NPV & IRR discounted cash flow forecast',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'DCF_Valuation_Model.xlsx', uploadedDate: '2026-01-12' },
                    { id: 2, title: 'Sensitivity_Analysis_Raw_Materials.pdf', uploadedDate: '2026-01-13' },
                    { id: 3, title: 'Executive_Finance_Signoff.pdf', uploadedDate: '2026-01-14' }
                  ]
                },
                {
                  id: 'T1-5',
                  stageName: 'Opportunity Identification',
                  deliverableName: 'Project economics and risk screening',
                  activityName: 'Project economics and risk screening',
                  taskName: 'Capex, Opex and plant modification budget validation',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Capex_Reactor_Addition_Approval.pdf', uploadedDate: '2026-01-14' },
                    { id: 2, title: 'Plant_Modification_Cost_Breakdown.pdf', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 2. Stage 2: Concept Screening & Feasibility
    const stage2: StageNode = {
      id: 'S2',
      type: 'stage',
      stageCode: 'S2',
      stageName: 'Concept Screening & Feasibility',
      gateCode: 'Gate 1',
      expanded: false,
      deliverables: [
        {
          id: 'D2-1',
          name: 'Project Costing Sheet Preparation & Toll Manufacturer Selection',
          expanded: false,
          activities: [
            {
              id: 'A2-1',
              name: 'Analytical Costing & Contract Lab Costing',
              jobCode: 'CHM-T004',
              tasks: [
                {
                  id: 'T2-1',
                  stageName: 'Concept Screening & Feasibility',
                  deliverableName: 'Project Costing Sheet Preparation & Toll Manufacturer Selection',
                  activityName: 'Analytical Costing & Contract Lab Costing',
                  taskName: 'Analytical testing & contract lab proposal evaluation',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Contract_Lab_Evaluation_Matrix.pdf', uploadedDate: '2026-01-20' },
                    { id: 2, title: 'Analytical_Cost_Comparison.xlsx', uploadedDate: '2026-01-21' }
                  ]
                },
                {
                  id: 'T2-2',
                  stageName: 'Concept Screening & Feasibility',
                  deliverableName: 'Project Costing Sheet Preparation & Toll Manufacturer Selection',
                  activityName: 'Analytical Costing & Contract Lab Costing',
                  taskName: 'Method transfer and verification quote review',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Method_Transfer_Quote_Summary.pdf', uploadedDate: '2026-01-22' }
                  ]
                }
              ]
            },
            {
              id: 'A2-2',
              name: 'Raw Material, Packaging & Benchmark Grade Costing Breakdown',
              jobCode: 'CHM-T005',
              tasks: [
                {
                  id: 'T2-3',
                  stageName: 'Concept Screening & Feasibility',
                  deliverableName: 'Project Costing Sheet Preparation & Toll Manufacturer Selection',
                  activityName: 'Raw Material, Packaging & Benchmark Grade Costing Breakdown',
                  taskName: 'Benchmark grade sample receipt, hazmat transport & customs clearance documentation',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Benchmark_Hazmat_Shipping_Permit.pdf', uploadedDate: '2026-01-22' },
                    { id: 2, title: 'Customs_Clearance_Record.pdf', uploadedDate: '2026-01-23' }
                  ]
                },
                {
                  id: 'T2-4',
                  stageName: 'Concept Screening & Feasibility',
                  deliverableName: 'Project Costing Sheet Preparation & Toll Manufacturer Selection',
                  activityName: 'Raw Material, Packaging & Benchmark Grade Costing Breakdown',
                  taskName: 'Bill of Materials (BOM) monomer, solvent & packaging quote consolidation',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Consolidated_BOM_Quotes.xlsx', uploadedDate: '2026-01-24' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'D2-2',
          name: 'Project Initiation Form (PIF)',
          expanded: false,
          activities: []
        }
      ]
    };

    // 3. Gate 1: Concept Approval
    const gate1: GateNode = {
      id: 'G1',
      type: 'gate',
      gateCode: 'Gate 1',
      gateName: 'Gate 1: Concept Approval',
      documents: [
        { id: 'GD1-1', gateCode: 'Gate 1', gateName: 'Gate 1: Concept Approval', documentTitle: 'Formal Freedom-to-Operate (FTO) Legal Opinion', uploadedDate: '2026-01-23', uploadedBy: 'Legal & IP Counsel' },
        { id: 'GD1-2', gateCode: 'Gate 1', gateName: 'Gate 1: Concept Approval', documentTitle: 'Raw Material Source & Primary Vendor Qualification Report', uploadedDate: '2026-01-24', uploadedBy: 'Anita Desai' },
        { id: 'GD1-3', gateCode: 'Gate 1', gateName: 'Gate 1: Concept Approval', documentTitle: 'Benchmark Grade Characterization Protocol', uploadedDate: '2026-01-24', uploadedBy: 'Dr. Priya Raman' },
        { id: 'GD1-4', gateCode: 'Gate 1', gateName: 'Gate 1: Concept Approval', documentTitle: 'Target Product Profile and Specification Baseline Document', uploadedDate: '2026-01-25', uploadedBy: 'Ananya Rao' },
        { id: 'GD1-5', gateCode: 'Gate 1', gateName: 'Gate 1: Concept Approval', documentTitle: 'Cost of Manufacturing Feasibility Summary', uploadedDate: '2026-01-25', uploadedBy: 'Vikram Singh' },
        { id: 'GD1-6', gateCode: 'Gate 1', gateName: 'Gate 1: Concept Approval', documentTitle: 'Gate 1 Steering Committee Approval Resolution', uploadedDate: '2026-01-25', uploadedBy: 'Steering Committee' }
      ]
    };

    // 4. Stage 3: Route Scouting & Lab Synthesis
    const stage3: StageNode = {
      id: 'S3',
      type: 'stage',
      stageCode: 'S3',
      stageName: 'Route Scouting & Lab Synthesis',
      gateCode: '-',
      expanded: false,
      deliverables: []
    };

    // 5. Stage 4: Process Optimization (Lab Scale)
    const stage4: StageNode = {
      id: 'S4',
      type: 'stage',
      stageCode: 'S4',
      stageName: 'Process Optimization (Lab Scale)',
      gateCode: 'Gate 2',
      expanded: false,
      deliverables: []
    };

    // 6. Stage 5: Process Route Selection & Basis of Design
    const stage5: StageNode = {
      id: 'S5',
      type: 'stage',
      stageCode: 'S5',
      stageName: 'Process Route Selection & Basis of Design',
      gateCode: 'Gate 2',
      expanded: false,
      deliverables: []
    };

    // 7. Gate 2: Process Route Selection
    const gate2: GateNode = {
      id: 'G2',
      type: 'gate',
      gateCode: 'Gate 2',
      gateName: 'Gate 2: Process Route Selection',
      documents: [
        { id: 'GD2-1', gateCode: 'Gate 2', gateName: 'Gate 2: Process Route Selection', documentTitle: 'Route Yield and Selectivity Summary Report', uploadedDate: '2026-04-10', uploadedBy: 'Rajesh Kumar' },
        { id: 'GD2-2', gateCode: 'Gate 2', gateName: 'Gate 2: Process Route Selection', documentTitle: 'Candidate Process Conversion and Impurity Profile Report', uploadedDate: '2026-04-12', uploadedBy: 'Dr. Priya Raman' },
        { id: 'GD2-3', gateCode: 'Gate 2', gateName: 'Gate 2: Process Route Selection', documentTitle: 'Preliminary Benchmark Equivalence Data Package', uploadedDate: '2026-04-14', uploadedBy: 'Amit Patel' },
        { id: 'GD2-4', gateCode: 'Gate 2', gateName: 'Gate 2: Process Route Selection', documentTitle: 'Raw Material and Catalyst Supply Plan', uploadedDate: '2026-04-15', uploadedBy: 'Anita Desai' },
        { id: 'GD2-5', gateCode: 'Gate 2', gateName: 'Gate 2: Process Route Selection', documentTitle: 'Basis of Design and Cost of Manufacturing Update', uploadedDate: '2026-04-15', uploadedBy: 'Priya Reddy' },
        { id: 'GD2-6', gateCode: 'Gate 2', gateName: 'Gate 2: Process Route Selection', documentTitle: 'Gate 2 Steering Committee Approval Resolution', uploadedDate: '2026-04-15', uploadedBy: 'Steering Committee' }
      ]
    };

    // 8. Stage 6: Bench-to-Pilot Process Development
    const stage6: StageNode = {
      id: 'S6', type: 'stage', stageCode: 'S6', stageName: 'Bench-to-Pilot Process Development', gateCode: '-', expanded: false, deliverables: []
    };

    // 9. Stage 7: Process Safety & Regulatory Studies
    const stage7: StageNode = {
      id: 'S7', type: 'stage', stageCode: 'S7', stageName: 'Process Safety & Regulatory Studies', gateCode: 'Gate 3', expanded: false, deliverables: []
    };

    // 10. Gate 3: Registration & Pilot Readiness
    const gate3: GateNode = {
      id: 'G3', type: 'gate', gateCode: 'Gate 3', gateName: 'Gate 3: Registration & Pilot Readiness', documents: []
    };

    // 11. Stage 8: Regulatory Registration Filing (REACH / TSCA)
    const stage8: StageNode = {
      id: 'S8', type: 'stage', stageCode: 'S8', stageName: 'Regulatory Registration Filing (REACH / TSCA)', gateCode: '-', expanded: false, deliverables: []
    };

    // 12. Stage 9: Pilot Plant Campaign
    const stage9: StageNode = {
      id: 'S9', type: 'stage', stageCode: 'S9', stageName: 'Pilot Plant Campaign', gateCode: '-', expanded: false, deliverables: []
    };

    // 13. Stage 10: Demonstration-Scale Campaign
    const stage10: StageNode = {
      id: 'S10', type: 'stage', stageCode: 'S10', stageName: 'Demonstration-Scale Campaign', gateCode: 'Gate 4', expanded: false, deliverables: []
    };

    // 14. Gate 4: Demo-Scale Proof
    const gate4: GateNode = {
      id: 'G4', type: 'gate', gateCode: 'Gate 4', gateName: 'Gate 4: Demo-Scale Proof', documents: []
    };

    // 15. Stage 11: Commercial Plant Build & Commissioning
    const stage11: StageNode = {
      id: 'S11', type: 'stage', stageCode: 'S11', stageName: 'Commercial Plant Build & Commissioning', gateCode: 'Gate 5', expanded: false, deliverables: []
    };

    // 16. Gate 5: Commercial Production Readiness
    const gate5: GateNode = {
      id: 'G5', type: 'gate', gateCode: 'Gate 5', gateName: 'Gate 5: Commercial Production Readiness', documents: []
    };

    // 17. Stage 12: Commercial Launch & Ramp-Up
    const stage12: StageNode = {
      id: 'S12', type: 'stage', stageCode: 'S12', stageName: 'Commercial Launch & Ramp-Up', gateCode: '-', expanded: false, deliverables: []
    };

    this.allTreeNodes = [
      stage1, stage2, gate1, stage3, stage4, stage5, gate2,
      stage6, stage7, gate3, stage8, stage9, stage10, gate4,
      stage11, gate5, stage12
    ];
  }

  onFilterChange(): void {
    this.applyTreeFilter();
  }

  private applyTreeFilter(): void {
    if (this.selectedFilter === 'All') {
      this.filteredTreeNodes = [...this.allTreeNodes];
    } else if (this.selectedFilter === 'Stages') {
      this.filteredTreeNodes = this.allTreeNodes.filter(node => node.type === 'stage');
    } else if (this.selectedFilter === 'Gates') {
      this.filteredTreeNodes = this.allTreeNodes.filter(node => node.type === 'gate');
    }

    // Ensure valid current selection after filtering
    if (this.selectedFilter === 'Gates' && this.selectedItemType !== 'gate') {
      const firstGate = this.filteredTreeNodes.find(n => n.type === 'gate') as GateNode;
      if (firstGate) {
        this.selectGate(firstGate);
      }
    } else if (this.selectedFilter === 'Stages' && this.selectedItemType === 'gate') {
      const firstStage = this.filteredTreeNodes.find(n => n.type === 'stage') as StageNode;
      if (firstStage) {
        this.selectStage(firstStage, false);
      }
    }
  }

  private setDefaultSelection(): void {
    const stage1 = this.allTreeNodes[0] as StageNode;
    if (stage1) {
      stage1.expanded = true;
      if (stage1.deliverables.length > 0) {
        stage1.deliverables[0].expanded = true;
      }
      this.selectStage(stage1, false);
    }
  }

  // Click on Stage button: selects Stage and loads ALL its tasks across all deliverables & activities
  selectStage(stage: StageNode, toggle: boolean = true): void {
    if (toggle) {
      stage.expanded = !stage.expanded;
    } else {
      stage.expanded = true;
    }
    this.selectedItemType = 'stage';
    this.selectedStage = stage;
    this.selectedDeliverable = null;
    this.selectedActivity = null;
    this.selectedGate = null;

    // Aggregate all tasks across all deliverables and activities in this stage
    const allStageTasks: TaskDocumentItem[] = [];
    stage.deliverables?.forEach(deliv => {
      deliv.activities?.forEach(act => {
        if (act.tasks) {
          allStageTasks.push(...act.tasks);
        }
      });
    });
    this.currentActivityTasks = allStageTasks;
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Toggle stage expand/collapse specifically from the chevron arrow
  toggleStageArrow(event: Event, stage: StageNode): void {
    event.stopPropagation();
    stage.expanded = !stage.expanded;
  }

  // Click on Deliverable button: selects Deliverable and loads ALL its tasks across all activities
  selectDeliverable(deliv: DeliverableNode, stage: StageNode, toggle: boolean = true): void {
    if (toggle) {
      deliv.expanded = !deliv.expanded;
    } else {
      deliv.expanded = true;
    }
    this.selectedItemType = 'deliverable';
    this.selectedStage = stage;
    this.selectedDeliverable = deliv;
    this.selectedActivity = null;
    this.selectedGate = null;

    // Aggregate all tasks across all activities in this deliverable
    const allDelivTasks: TaskDocumentItem[] = [];
    deliv.activities?.forEach(act => {
      if (act.tasks) {
        allDelivTasks.push(...act.tasks);
      }
    });
    this.currentActivityTasks = allDelivTasks;
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Toggle deliverable expand/collapse specifically from the chevron arrow
  toggleDeliverableArrow(event: Event, deliv: DeliverableNode): void {
    event.stopPropagation();
    deliv.expanded = !deliv.expanded;
  }

  // Click on Activity button: selects Activity and displays its tasks
  selectActivity(act: ActivityNode, deliv: DeliverableNode, stage: StageNode): void {
    this.selectedItemType = 'activity';
    this.selectedStage = stage;
    this.selectedDeliverable = deliv;
    this.selectedActivity = act;
    this.selectedGate = null;
    this.currentActivityTasks = act.tasks || [];
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Click on Gate button: selects Gate and displays its documents
  selectGate(gate: GateNode): void {
    this.selectedItemType = 'gate';
    this.selectedGate = gate;
    this.selectedStage = null;
    this.selectedDeliverable = null;
    this.selectedActivity = null;
    this.currentGateDocuments = gate.documents || [];
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Filter table rows by search keyword
  filterTableData(): void {
    const kw = this.tableSearchKeyword.toLowerCase().trim();
    if (this.selectedItemType === 'gate') {
      if (!kw) {
        this.filteredGateDocuments = [...this.currentGateDocuments];
      } else {
        this.filteredGateDocuments = this.currentGateDocuments.filter(doc =>
          doc.gateName.toLowerCase().includes(kw) ||
          doc.gateCode.toLowerCase().includes(kw) ||
          doc.documentTitle.toLowerCase().includes(kw)
        );
      }
    } else {
      if (!kw) {
        this.filteredActivityTasks = [...this.currentActivityTasks];
      } else {
        this.filteredActivityTasks = this.currentActivityTasks.filter(item =>
          item.stageName.toLowerCase().includes(kw) ||
          item.deliverableName.toLowerCase().includes(kw) ||
          item.activityName.toLowerCase().includes(kw) ||
          item.taskName.toLowerCase().includes(kw) ||
          String(item.documentsCount).includes(kw)
        );
      }
    }
  }

  clearSearch(): void {
    this.tableSearchKeyword = '';
    this.filterTableData();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Click on task documents count (opens ViewDocsComponent)
  openTaskDocuments(task?: TaskDocumentItem): void {
    this.dialog.open(ViewDocsComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  // Click on View icon in gate documents table (directly opens sample PDF)
  viewGateDocument(doc?: GateDocumentItem): void {
    window.open('/sample.pdf', '_blank');
  }

  // Upload Document dialog
  uploaddoc(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      height: 'auto',
      width: '850px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        if (this.selectedItemType === 'gate' && this.selectedGate) {
          const newGateDoc: GateDocumentItem = {
            id: 'GD-NEW-' + Date.now(),
            gateCode: this.selectedGate.gateCode,
            gateName: this.selectedGate.gateName,
            documentTitle: data.documentTitle || 'New Gate Document',
            uploadedDate: new Date().toISOString().split('T')[0],
            uploadedBy: 'Admin_User'
          };
          this.currentGateDocuments.unshift(newGateDoc);
          this.filterTableData();
        } else {
          const newTask: TaskDocumentItem = {
            id: 'T-NEW-' + Date.now(),
            stageName: this.selectedStage?.stageName || 'Stage',
            deliverableName: this.selectedDeliverable?.name || 'Deliverable',
            activityName: this.selectedActivity?.name || 'General Activity',
            taskName: data.documentTitle || 'New Document Upload Task',
            documentsCount: 1,
            documents: [
              { id: 1, title: data.documentTitle || 'New_Upload.pdf', uploadedDate: new Date().toISOString().split('T')[0] }
            ]
          };
          this.currentActivityTasks.unshift(newTask);
          this.filterTableData();
        }
      }
    });
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/CHM/006', name: this.projectName || 'Acrylic Emulsion Binder 50% Solids' }
    });
  }
}
