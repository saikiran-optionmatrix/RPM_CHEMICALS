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
import { StageDescriptionComponent } from './stage-description/stage-description.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';
import { ReorderConfirmationComponent } from '../../common/shared/reorder-confirmation/reorder-confirmation.component';
import { getStageEstimates, STAGE_WBS_CONFIG_MAP } from './stage-wbs.data';

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
  manPowerBudget?: string;
  materialBudget?: string;
  resourceBudget?: string;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
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
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // --- Scrolling logic ---
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
        "description": "Identify and prioritize product and market opportunities from customer demand, competitor gaps and technology trends.",
        "tasks": 12,
        "status": "Active",
        "stageCode": "S1",
        "stageName": "Opportunity Identification",
        "division": "Specialty Chemicals - SC",
        "divisions": [
            "Specialty Chemicals - SC"
        ],
        "gateCode": "-",
        "stageDescription": "Identify and prioritize product and market opportunities from customer demand, competitor gaps and technology trends.",
        "planEffort": 400,
        "planDuration": 30,
        "manPowerBudget": "$ 30,000",
        "materialBudget": "$ 15,000",
        "resourceBudget": "$ 6,000",
        "historyCount": 3,
        "updatedDate": "2026-02-15",
        "updatedBy": "Dr. Priya Raman"
    },
    {
        "sequence": "2.0",
        "phase": "Concept Screening & Feasibility",
        "description": "Assess technical, economic and regulatory feasibility of candidate chemistries and products.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S2",
        "stageName": "Concept Screening & Feasibility",
        "division": "Specialty Chemicals - SC, Polymers & Resins - PR",
        "divisions": [
            "Specialty Chemicals - SC",
            "Polymers & Resins - PR"
        ],
        "gateCode": "Gate 1",
        "stageDescription": "Assess technical, economic and regulatory feasibility of candidate chemistries and products.",
        "planEffort": 900,
        "planDuration": 60,
        "manPowerBudget": "$ 67,500",
        "materialBudget": "$ 40,000",
        "resourceBudget": "$ 12,000",
        "historyCount": 4,
        "updatedDate": "2026-02-12",
        "updatedBy": "Rajesh Kumar"
    },
    {
        "sequence": "3.0",
        "phase": "Route Scouting & Lab Synthesis",
        "description": "Screen synthesis routes, catalysts and raw materials and prove the chemistry at laboratory scale.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S3",
        "stageName": "Route Scouting & Lab Synthesis",
        "division": "Specialty Chemicals - SC",
        "divisions": [
            "Specialty Chemicals - SC"
        ],
        "gateCode": "-",
        "stageDescription": "Screen synthesis routes, catalysts and raw materials and prove the chemistry at laboratory scale.",
        "planEffort": 1600,
        "planDuration": 90,
        "manPowerBudget": "$ 1,20,000",
        "materialBudget": "$ 90,000",
        "resourceBudget": "$ 18,000",
        "historyCount": 2,
        "updatedDate": "2026-02-10",
        "updatedBy": "Anita Desai"
    },
    {
        "sequence": "4.0",
        "phase": "Process Optimization (Lab Scale)",
        "description": "Improve yield, selectivity, impurity profile and process robustness at bench scale.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S4",
        "stageName": "Process Optimization (Lab Scale)",
        "division": "Specialty Chemicals - SC, Polymers & Resins - PR",
        "divisions": [
            "Specialty Chemicals - SC",
            "Polymers & Resins - PR"
        ],
        "gateCode": "-",
        "stageDescription": "Improve yield, selectivity, impurity profile and process robustness at bench scale.",
        "planEffort": 2400,
        "planDuration": 120,
        "manPowerBudget": "$ 1,80,000",
        "materialBudget": "$ 1,60,000",
        "resourceBudget": "$ 24,000",
        "historyCount": 5,
        "updatedDate": "2026-02-05",
        "updatedBy": "Priya Reddy"
    },
    {
        "sequence": "5.0",
        "phase": "Process Route Selection & Basis of Design",
        "description": "Select the commercial route and define the basis of design, cost of manufacturing and risks.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S5",
        "stageName": "Process Route Selection & Basis of Design",
        "division": "Specialty Chemicals - SC",
        "divisions": [
            "Specialty Chemicals - SC"
        ],
        "gateCode": "Gate 2",
        "stageDescription": "Select the commercial route and define the basis of design, cost of manufacturing and risks.",
        "planEffort": 1000,
        "planDuration": 45,
        "manPowerBudget": "$ 75,000",
        "materialBudget": "$ 50,000",
        "resourceBudget": "$ 9,000",
        "historyCount": 1,
        "updatedDate": "2026-01-30",
        "updatedBy": "Suresh Naidu"
    },
    {
        "sequence": "6.0",
        "phase": "Bench-to-Pilot Process Development",
        "description": "Develop and scale the reaction, separation and purification steps for the pilot plant.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S6",
        "stageName": "Bench-to-Pilot Process Development",
        "division": "Specialty Chemicals - SC, Polymers & Resins - PR",
        "divisions": [
            "Specialty Chemicals - SC",
            "Polymers & Resins - PR"
        ],
        "gateCode": "-",
        "stageDescription": "Develop and scale the reaction, separation and purification steps for the pilot plant.",
        "planEffort": 3000,
        "planDuration": 120,
        "manPowerBudget": "$ 2,25,000",
        "materialBudget": "$ 3,00,000",
        "resourceBudget": "$ 24,000",
        "historyCount": 3,
        "updatedDate": "2026-01-28",
        "updatedBy": "Amit Patel"
    },
    {
        "sequence": "7.0",
        "phase": "Process Safety & Regulatory Studies",
        "description": "Run hazard studies (HAZOP, calorimetry), toxicology and environmental studies needed to support registration.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S7",
        "stageName": "Process Safety & Regulatory Studies",
        "division": "Specialty Chemicals - SC",
        "divisions": [
            "Specialty Chemicals - SC"
        ],
        "gateCode": "Gate 3",
        "stageDescription": "Run hazard studies (HAZOP, calorimetry), toxicology and environmental studies needed to support registration.",
        "planEffort": 3200,
        "planDuration": 150,
        "manPowerBudget": "$ 2,40,000",
        "materialBudget": "$ 4,50,000",
        "resourceBudget": "$ 30,000",
        "historyCount": 8,
        "updatedDate": "2026-01-25",
        "updatedBy": "Dr. Priya Raman"
    },
    {
        "sequence": "8.0",
        "phase": "Regulatory Registration Filing (REACH / TSCA)",
        "description": "Compile and submit chemical registration dossiers and respond to authority queries.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S8",
        "stageName": "Regulatory Registration Filing (REACH / TSCA)",
        "division": "Specialty Chemicals - SC, Polymers & Resins - PR",
        "divisions": [
            "Specialty Chemicals - SC",
            "Polymers & Resins - PR"
        ],
        "gateCode": "-",
        "stageDescription": "Compile and submit chemical registration dossiers and respond to authority queries.",
        "planEffort": 1200,
        "planDuration": 90,
        "manPowerBudget": "$ 90,000",
        "materialBudget": "$ 1,00,000",
        "resourceBudget": "$ 18,000",
        "historyCount": 2,
        "updatedDate": "2026-01-22",
        "updatedBy": "Rajesh Kumar"
    },
    {
        "sequence": "9.0",
        "phase": "Pilot Plant Campaign",
        "description": "Produce pilot batches to confirm process performance and generate customer samples.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S9",
        "stageName": "Pilot Plant Campaign",
        "division": "Specialty Chemicals - SC",
        "divisions": [
            "Specialty Chemicals - SC"
        ],
        "gateCode": "-",
        "stageDescription": "Produce pilot batches to confirm process performance and generate customer samples.",
        "planEffort": 3500,
        "planDuration": 150,
        "manPowerBudget": "$ 2,62,500",
        "materialBudget": "$ 7,00,000",
        "resourceBudget": "$ 30,000",
        "historyCount": 3,
        "updatedDate": "2026-01-20",
        "updatedBy": "Anita Desai"
    },
    {
        "sequence": "10.0",
        "phase": "Demonstration-Scale Campaign",
        "description": "Run larger campaigns to prove scale-up, equipment fit and product quality with customers.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S10",
        "stageName": "Demonstration-Scale Campaign",
        "division": "Specialty Chemicals - SC, Polymers & Resins - PR",
        "divisions": [
            "Specialty Chemicals - SC",
            "Polymers & Resins - PR"
        ],
        "gateCode": "Gate 4",
        "stageDescription": "Run larger campaigns to prove scale-up, equipment fit and product quality with customers.",
        "planEffort": 5000,
        "planDuration": 240,
        "manPowerBudget": "$ 3,75,000",
        "materialBudget": "$ 18,00,000",
        "resourceBudget": "$ 48,000",
        "historyCount": 4,
        "updatedDate": "2026-01-18",
        "updatedBy": "Suresh Naidu"
    },
    {
        "sequence": "11.0",
        "phase": "Commercial Plant Build & Commissioning",
        "description": "Engineer, build, commission and qualify the commercial plant or line.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S11",
        "stageName": "Commercial Plant Build & Commissioning",
        "division": "Specialty Chemicals - SC",
        "divisions": [
            "Specialty Chemicals - SC"
        ],
        "gateCode": "Gate 5",
        "stageDescription": "Engineer, build, commission and qualify the commercial plant or line.",
        "planEffort": 8000,
        "planDuration": 360,
        "manPowerBudget": "$ 6,00,000",
        "materialBudget": "$ 65,00,000",
        "resourceBudget": "$ 72,000",
        "historyCount": 2,
        "updatedDate": "2026-01-15",
        "updatedBy": "Amit Patel"
    },
    {
        "sequence": "12.0",
        "phase": "Commercial Launch & Ramp-Up",
        "description": "Start commercial production, ramp up volumes and hand over to operations.",
        "tasks": 4,
        "status": "Active",
        "stageCode": "S12",
        "stageName": "Commercial Launch & Ramp-Up",
        "division": "Specialty Chemicals - SC, Polymers & Resins - PR",
        "divisions": [
            "Specialty Chemicals - SC",
            "Polymers & Resins - PR"
        ],
        "gateCode": "-",
        "stageDescription": "Start commercial production, ramp up volumes and hand over to operations.",
        "planEffort": 2500,
        "planDuration": 180,
        "manPowerBudget": "$ 1,87,500",
        "materialBudget": "$ 3,00,000",
        "resourceBudget": "$ 36,000",
        "historyCount": 1,
        "updatedDate": "2026-01-12",
        "updatedBy": "Priya Reddy"
    }
];

  pagedData: Stage[] = [];

  ngOnInit(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20', '2026-01-15', '2026-01-10', '2026-01-05', '2025-12-28'];
    const sampleUsers = ['Dr. Sarah Jenkins', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel'];
    this.masterData.forEach((item, index) => {
      const config = STAGE_WBS_CONFIG_MAP[item.stageCode];
      if (config && config.modulesData && config.modulesData[0]) {
        item.tasks = config.modulesData[0].length;
      }
      if (!item.historyCount) {
        item.historyCount = this.getHistoryCount(index);
      }
      if (!item.updatedDate) {
        item.updatedDate = sampleDates[index % sampleDates.length];
      }
      if (!item.updatedBy) {
        item.updatedBy = sampleUsers[index % sampleUsers.length];
      }
      const est = getStageEstimates(item.stageCode);
      item.min = est.min;
      item.max = est.max;
      item.mean = est.mean;
      item.median = est.median;
      if (est.median > 0) {
        const dur = Math.round((est.min + 4 * est.median + est.max) / 6) || Math.round(est.median);
        item.planDuration = dur;
        item.planEffort = dur * 8;
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

    const dialogRef = this.dialog.open(ReorderConfirmationComponent, {
      width: '480px',
      autoFocus: false,
      data: {
        title: 'Reorder Confirmation',
        message:
          'Are you sure that you want to continue with reordering of stages / gates.  This is a very intensive operation and will reset the allocation of gates to stages in all divisions.  Are you sure that you want to continue?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Mutate the local paged view
        moveItemInArray(this.pagedData, event.previousIndex, event.currentIndex);

        // Sync back to the main master data array accurately
        const startIndex = this.pageIndex * this.pageSize;
        this.masterData.splice(startIndex, this.pageSize, ...this.pagedData);
        this.updatePageData();
      } else {
        // Reset pagedData view to keep untouched order
        this.updatePageData();
      }
    });
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
      width: '600px',
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
          division: result.division || 'Specialty Chemicals - SC',
          divisions: result.divisions || (result.division ? [result.division] : ['Specialty Chemicals - SC']),
          stageSerial: nextId,
          sequence: `${nextId}.0`,
          gateCode: result.gateCode || '',
          stageDescription: result.stageDescription || '',
          planEffort: Number(result.planEffort) || 0,
          planDuration: Number(result.planDuration) || 0,
          manPowerBudget: result.manPowerBudget ? (String(result.manPowerBudget).startsWith('₹') || String(result.manPowerBudget).startsWith('$') ? String(result.manPowerBudget) : `₹ ${result.manPowerBudget}`) : '₹ 0',
          materialBudget: result.materialBudget ? (String(result.materialBudget).startsWith('₹') || String(result.materialBudget).startsWith('$') ? String(result.materialBudget) : `₹ ${result.materialBudget}`) : '₹ 0',
          resourceBudget: result.resourceBudget ? (String(result.resourceBudget).startsWith('₹') || String(result.resourceBudget).startsWith('$') ? String(result.resourceBudget) : `₹ ${result.resourceBudget}`) : '₹ 0',
          historyCount: 1,
          min: 0,
          max: 0,
          mean: 0,
          median: 0
        };

        const est = getStageEstimates(newStage.stageCode);
        newStage.min = est.min;
        newStage.max = est.max;
        newStage.mean = est.mean;
        newStage.median = est.median;
        if (!newStage.planDuration && est.median > 0) {
          const dur = Math.round((est.min + 4 * est.median + est.max) / 6) || Math.round(est.median);
          newStage.planDuration = dur;
          if (!newStage.planEffort) {
            newStage.planEffort = dur * 8;
          }
        }

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

  openDescription(item: Stage): void {
    this.dialog.open(StageDescriptionComponent, {
      width: '560px',
      autoFocus: false,
      data: {
        stageCode: item.stageCode,
        stageName: item.stageName || item.phase,
        description: item.stageDescription || item.description,
      },
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
        if (result.manPowerBudget !== undefined) {
          item.manPowerBudget = String(result.manPowerBudget).startsWith('₹') || String(result.manPowerBudget).startsWith('$') ? String(result.manPowerBudget) : `₹ ${result.manPowerBudget}`;
        }
        if (result.materialBudget !== undefined) {
          item.materialBudget = String(result.materialBudget).startsWith('₹') || String(result.materialBudget).startsWith('$') ? String(result.materialBudget) : `₹ ${result.materialBudget}`;
        }
        if (result.resourceBudget !== undefined) {
          item.resourceBudget = String(result.resourceBudget).startsWith('₹') || String(result.resourceBudget).startsWith('$') ? String(result.resourceBudget) : `₹ ${result.resourceBudget}`;
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
        manPowerBudget: item.manPowerBudget,
        materialBudget: item.materialBudget,
        resourceBudget: item.resourceBudget,
        stageDescription: item.stageDescription || item.description,
        historyCount: historyCount
      }
    });
  }
}
