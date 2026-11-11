import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddStageComponent } from './add-stage/add-stage.component';
import { StageDivisionsComponent } from './stage-divisions/stage-divisions.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';
import { DescriptionDialogComponent } from '../../common/shared/description-dialog/description-dialog.component';

export interface Stage {
  phase: string;
  description: string;
  tasks: number;
  status: 'Active' | 'Pending' | 'Inactive';
  stageCode: string;
  stageName: string;
  division?: string;
  divisions?: string[];
  stageSerial?: number;
  sequence?: string;
  gateCode: string;
  stageDescription: string;
  planEffort: number;
  planDuration: number;
  materialBudget?: string;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-stages',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    DragDropModule
  ],
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  // Permission Flags
  readonly canUpdate: boolean = true;
  readonly canDelete: boolean = true;

  // Pagination State
  totalSize: number = 0;
  pageIndex: number = 0;
  pageSize: number = 15;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  // Master Data Array
  masterData: Stage[] = [
  {
    "sequence": "1.0",
    "phase": "Opportunity Identification",
    "description": "Identify and prioritize chemical product and market opportunities from industrial customer demand, competitor benchmarking and technology trends.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S1",
    "stageName": "Opportunity Identification",
    "division": "Polymers & Resins - PR",
    "divisions": [
      "Polymers & Resins - PR"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Opportunity Identification.",
    "planEffort": 400,
    "planDuration": 10,
    "materialBudget": "$15,000",
    "updatedDate": "2026-02-15",
    "updatedBy": "Dr. Priya Raman",
    "historyCount": 3
  },
  {
    "sequence": "2.0",
    "phase": "Concept Screening & Feasibility",
    "description": "Assess technical, reaction chemistry, raw material sourcing, economic and preliminary regulatory feasibility of candidate chemical products.",
    "tasks": 11,
    "status": "Active",
    "stageCode": "S2",
    "stageName": "Concept Screening & Feasibility",
    "division": "Polymers & Resins - PR, Specialty Chemicals - SC",
    "divisions": [
      "Polymers & Resins - PR",
      "Specialty Chemicals - SC"
    ],
    "gateCode": "Gate 1",
    "stageDescription": "Chemical manufacturing stage: Concept Screening & Feasibility.",
    "planEffort": 300,
    "planDuration": 10,
    "materialBudget": "$40,000",
    "updatedDate": "2026-02-12",
    "updatedBy": "Rajesh Kumar",
    "historyCount": 4
  },
  {
    "sequence": "3.0",
    "phase": "Route Scouting & Lab Synthesis",
    "description": "Screen synthesis routes, catalysts and raw materials and prove the reaction chemistry at laboratory scale.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S3",
    "stageName": "Route Scouting & Lab Synthesis",
    "division": "Polymers & Resins - PR",
    "divisions": [
      "Polymers & Resins - PR"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Route Scouting & Lab Synthesis.",
    "planEffort": 1500,
    "planDuration": 30,
    "materialBudget": "$90,000",
    "updatedDate": "2026-02-10",
    "updatedBy": "Anita Desai",
    "historyCount": 2
  },
  {
    "sequence": "4.0",
    "phase": "Process Optimization (Lab Scale)",
    "description": "Optimize reaction parameters, catalyst loading, yield, selectivity, impurity profile and process robustness at bench scale.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S4",
    "stageName": "Process Optimization (Lab Scale)",
    "division": "Polymers & Resins - PR, Petrochemicals - PC",
    "divisions": [
      "Polymers & Resins - PR",
      "Petrochemicals - PC"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Process Optimization (Lab Scale).",
    "planEffort": 3000,
    "planDuration": 60,
    "materialBudget": "$160,000",
    "updatedDate": "2026-02-05",
    "updatedBy": "Priya Reddy",
    "historyCount": 5
  },
  {
    "sequence": "5.0",
    "phase": "Process Route Selection & Basis of Design",
    "description": "Select the commercial chemical route and define the basis of design, mass/energy balance, cost of manufacturing and risks.",
    "tasks": 10,
    "status": "Active",
    "stageCode": "S5",
    "stageName": "Process Route Selection & Basis of Design",
    "division": "Polymers & Resins - PR",
    "divisions": [
      "Polymers & Resins - PR"
    ],
    "gateCode": "Gate 2",
    "stageDescription": "Chemical manufacturing stage: Process Route Selection & Basis of Design.",
    "planEffort": 1200,
    "planDuration": 25,
    "materialBudget": "$50,000",
    "updatedDate": "2026-01-30",
    "updatedBy": "Suresh Naidu",
    "historyCount": 1
  },
  {
    "sequence": "6.0",
    "phase": "Bench-to-Pilot Process Development",
    "description": "Develop and scale the reaction, downstream separation, purification and solvent recovery steps for pilot readiness.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S6",
    "stageName": "Bench-to-Pilot Process Development",
    "division": "Polymers & Resins - PR, Specialty Chemicals - SC",
    "divisions": [
      "Polymers & Resins - PR",
      "Specialty Chemicals - SC"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Bench-to-Pilot Process Development.",
    "planEffort": 3500,
    "planDuration": 50,
    "materialBudget": "$300,000",
    "updatedDate": "2026-01-28",
    "updatedBy": "Amit Patel",
    "historyCount": 3
  },
  {
    "sequence": "7.0",
    "phase": "Process Safety & Regulatory Studies",
    "description": "Complete process hazard analysis (HAZOP), calorimetry, occupational exposure, toxicology and environmental impact studies.",
    "tasks": 10,
    "status": "Active",
    "stageCode": "S7",
    "stageName": "Process Safety & Regulatory Studies",
    "division": "Polymers & Resins - PR",
    "divisions": [
      "Polymers & Resins - PR"
    ],
    "gateCode": "Gate 3",
    "stageDescription": "Chemical manufacturing stage: Process Safety & Regulatory Studies.",
    "planEffort": 3200,
    "planDuration": 45,
    "materialBudget": "$450,000",
    "updatedDate": "2026-01-25",
    "updatedBy": "Dr. Priya Raman",
    "historyCount": 8
  },
  {
    "sequence": "8.0",
    "phase": "Regulatory Registration Filing (REACH / TSCA)",
    "description": "Compile and submit chemical inventory dossiers (REACH, TSCA, India) and manage authority review and queries.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S8",
    "stageName": "Regulatory Registration Filing (REACH / TSCA)",
    "division": "Polymers & Resins - PR, Agrochemicals - AG",
    "divisions": [
      "Polymers & Resins - PR",
      "Agrochemicals - AG"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Regulatory Registration Filing (REACH / TSCA).",
    "planEffort": 1500,
    "planDuration": 30,
    "materialBudget": "$100,000",
    "updatedDate": "2026-01-22",
    "updatedBy": "Rajesh Kumar",
    "historyCount": 2
  },
  {
    "sequence": "9.0",
    "phase": "Pilot Plant Campaign",
    "description": "Execute pilot batches to confirm process performance, yield, downstream recovery and generate customer qualification samples.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S9",
    "stageName": "Pilot Plant Campaign",
    "division": "Polymers & Resins - PR",
    "divisions": [
      "Polymers & Resins - PR"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Pilot Plant Campaign.",
    "planEffort": 3600,
    "planDuration": 40,
    "materialBudget": "$700,000",
    "updatedDate": "2026-01-20",
    "updatedBy": "Anita Desai",
    "historyCount": 3
  },
  {
    "sequence": "10.0",
    "phase": "Demonstration-Scale Campaign",
    "description": "Run demonstration-scale campaign to prove operating reliability, throughput, emission controls and Gate 4 evidence.",
    "tasks": 10,
    "status": "Active",
    "stageCode": "S10",
    "stageName": "Demonstration-Scale Campaign",
    "division": "Polymers & Resins - PR, Specialty Chemicals - SC",
    "divisions": [
      "Polymers & Resins - PR",
      "Specialty Chemicals - SC"
    ],
    "gateCode": "Gate 4",
    "stageDescription": "Chemical manufacturing stage: Demonstration-Scale Campaign.",
    "planEffort": 4000,
    "planDuration": 55,
    "materialBudget": "$1,800,000",
    "updatedDate": "2026-01-18",
    "updatedBy": "Suresh Naidu",
    "historyCount": 4
  },
  {
    "sequence": "11.0",
    "phase": "Commercial Plant Build & Commissioning",
    "description": "Execute commercial plant construction, commissioning, qualification, validation and operator training for Gate 5 readiness.",
    "tasks": 9,
    "status": "Active",
    "stageCode": "S11",
    "stageName": "Commercial Plant Build & Commissioning",
    "division": "Polymers & Resins - PR",
    "divisions": [
      "Polymers & Resins - PR"
    ],
    "gateCode": "Gate 5",
    "stageDescription": "Chemical manufacturing stage: Commercial Plant Build & Commissioning.",
    "planEffort": 6500,
    "planDuration": 150,
    "materialBudget": "$6,500,000",
    "updatedDate": "2026-01-15",
    "updatedBy": "Amit Patel",
    "historyCount": 2
  },
  {
    "sequence": "12.0",
    "phase": "Commercial Launch & Ramp-Up",
    "description": "Execute first commercial batches, monitor production KPIs, establish product stewardship, SDS controls and complete launch review.",
    "tasks": 4,
    "status": "Active",
    "stageCode": "S12",
    "stageName": "Commercial Launch & Ramp-Up",
    "division": "Polymers & Resins - PR, Petrochemicals - PC",
    "divisions": [
      "Polymers & Resins - PR",
      "Petrochemicals - PC"
    ],
    "gateCode": "-",
    "stageDescription": "Chemical manufacturing stage: Commercial Launch & Ramp-Up.",
    "planEffort": 1300,
    "planDuration": 35,
    "materialBudget": "$300,000",
    "updatedDate": "2026-01-12",
    "updatedBy": "Priya Reddy",
    "historyCount": 1
  }
];

  pagedData: Stage[] = [];

  ngOnInit(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-22', '2026-01-20', '2026-01-18', '2026-01-15', '2026-01-12'];
    const sampleUsers = ['Dr. Priya Raman', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel'];
    this.masterData.forEach((item, index) => {
      if (!item.historyCount) {
        item.historyCount = this.getHistoryCount(index);
      }
      if (!item.updatedDate) {
        item.updatedDate = sampleDates[index % sampleDates.length];
      }
      if (!item.updatedBy) {
        item.updatedBy = sampleUsers[index % sampleUsers.length];
      }
    });
    this.totalSize = this.masterData.length;
    this.updatePageData();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageData();
  }

  private updatePageData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedData = this.masterData.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Reorders rows using Angular CDK DragDrop and syncs the master array safely.
   */
  onDrop(event: CdkDragDrop<Stage[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    // Mutate the local paged view
    moveItemInArray(this.pagedData, event.previousIndex, event.currentIndex);

    // Sync back to the main master data array accurately
    const startIndex = this.pageIndex * this.pageSize;
    this.masterData.splice(startIndex, this.pageSize, ...this.pagedData);
    this.updatePageData();
  }

  // onStatusChange(item: Stage): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: {
  //       title: 'Change Status',
  //       content: `Are you sure you want to change the status of ${item.stageName}?`
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       item.status = item.status === 'Active' ? 'Pending' : 'Active';
  //     }
  //   });
  // }

  onAddStage(): void {
    const nextSerial = this.masterData.length + 1;
    const dialogRef = this.dialog.open(AddStageComponent, {
      width: '920px',
      maxWidth: '900px',
      autoFocus: false,
      data: {
        mode: 'add',
        stageSerial: nextSerial,
        stageCode: `S${nextSerial}`
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const nextId = result.stageSerial ? Number(result.stageSerial) : (this.masterData.length + 1);
        const newStage: Stage = {
          phase: result.stageName || '',
          description: result.stageDescription || '',
          tasks: 0,
          status: 'Active',
          stageCode: result.stageCode || `S${nextId}`,
          stageName: result.stageName || '',
          division: result.division || 'Polymers & Resins - PR',
          divisions: result.divisions || (result.division ? [result.division] : ['Polymers & Resins - PR']),
          stageSerial: nextId,
          sequence: `${nextId}.0`,
          gateCode: result.gateCode || '',
          stageDescription: result.stageDescription || '',
          planEffort: Number(result.planEffort) || 0,
          planDuration: Number(result.planDuration) || 0,
          materialBudget: result.materialBudget ? (String(result.materialBudget).startsWith('$') ? String(result.materialBudget) : `$${result.materialBudget}`) : '$0',
          historyCount: 1
        };

        this.masterData.unshift(newStage);
        this.totalSize = this.masterData.length;
        this.updatePageData();
      }
    });
  }

  getDivisionCount(item: Stage): number {
    if (item.divisions && item.divisions.length) {
      return item.divisions.length;
    }
    return item.division ? item.division.split(',').filter(Boolean).length : 0;
  }

  onDivisionClick(item: Stage): void {
    const currentSelected = item.divisions && item.divisions.length
      ? [...item.divisions]
      : (item.division ? item.division.split(',').map((d: string) => d.trim()).filter(Boolean) : []);

    const dialogRef = this.dialog.open(StageDivisionsComponent, {
      width: '520px',
      autoFocus: false,
      data: {
        stage: item,
        selectedDivisions: currentSelected
      }
    });

    dialogRef.afterClosed().subscribe((result: string[] | undefined) => {
      if (result) {
        item.divisions = result;
        item.division = result.join(', ');
      }
    });
  }

  onEditStage(item: Stage): void {
    if (!this.canUpdate) return;

    const dialogRef = this.dialog.open(AddStageComponent, {
      width: '920px',
      maxWidth: '900px',
      autoFocus: false,
      data: {
        mode: 'edit',
        stageSerial: item.stageSerial || parseInt(item.stageCode.replace(/\D/g, ''), 10) || null,
        // stageCode: item.stageCode,
        ...item
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.stageName = result.stageName || item.stageName;
        item.phase = result.stageName || item.phase;
        if (result.division !== undefined) {
          item.division = result.division;
          item.divisions = result.divisions || (result.division ? result.division.split(',').map((s: string) => s.trim()) : []);
        }
        if (result.stageSerial) {
          item.stageSerial = Number(result.stageSerial);
          item.stageCode = `S${result.stageSerial}`;
        }
        item.gateCode = result.gateCode || item.gateCode;
        item.stageDescription = result.stageDescription ?? item.stageDescription;
        item.description = result.stageDescription ?? item.description;
        item.planEffort = Number(result.planEffort) ?? item.planEffort;
        item.planDuration = Number(result.planDuration) ?? item.planDuration;
        if (result.materialBudget !== undefined) {
          item.materialBudget = String(result.materialBudget).startsWith('$') ? String(result.materialBudget) : `$${result.materialBudget}`;
        }
      }
    });
  }

  onDeleteStage(item: Stage): void {
    if (!this.canDelete || item.TotalUsed) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.masterData = this.masterData.filter(stage => stage.stageCode !== item.stageCode);
        this.totalSize = this.masterData.length;

        // Handle pagination edge case where the user deletes the last item on the last page
        const maxPageIndex = Math.max(0, Math.ceil(this.totalSize / this.pageSize) - 1);
        if (this.pageIndex > maxPageIndex) {
          this.pageIndex = maxPageIndex;
        }

        this.updatePageData();
      }
    });
  }

  openHistory(item: Stage, index?: number): void {
    const historyCount = item.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    const seq = item.sequence || ((this.pageIndex * this.pageSize + (index ?? 0) + 1) + '.0');
    this.router.navigate(['/stages/history'], {
      queryParams: {
        stageName: item.stageName,
        division: item.division || (item.divisions ? item.divisions.join(', ') : ''),
        stageCode: item.stageCode,
        sequence: seq,
        gateCode: item.gateCode,
        planEffort: item.planEffort,
        planDuration: item.planDuration,
        materialBudget: item.materialBudget,
        stageDescription: item.stageDescription || item.description,
        historyCount: historyCount
      }
    });
  }

  openDescription(item: Stage): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: item.stageName,
        code: item.stageCode,
        type: 'Stage',
        description: item.stageDescription || item.description
      }
    });
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
}

