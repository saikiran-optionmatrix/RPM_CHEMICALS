import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddGateComponent } from './add-gate/add-gate.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';
import { GateWorkflowComponent } from './gate-workflow/gate-workflow.component';
import { GatesDivisionsComponent } from './gates-divisions/gates-divisions.component';
import { DescriptionDialogComponent } from '../../common/shared/description-dialog/description-dialog.component';

export interface Gate {
  name: string;
  count: number;
  route: string;
  status: boolean;
  description: string;
  stageCode: string;
  gateCode: string;
  division?: string;
  divisions?: string[];
  workflow?: string;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-gates',
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
  templateUrl: './gates.component.html',
  styleUrls: ['./gates.component.scss']
})
export class GatesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  // Pagination State
  pageSize: number = 10;
  pageIndex: number = 0;
  totalSize: number = 0;

  // Permissions
  readonly canDelete: boolean = true;
  readonly canUpdate: boolean = true;

  // View State
  isChildRouteActive: boolean = false;

  // Master Data Array
  masterData: Gate[] = [
    {
      name: 'Concept Approval',
      count: 7,
      route: 'feasibility',
      status: true,
      description: 'Formal governance checkpoint to assess technical, economic, and regulatory feasibility of candidate chemistries, market demand, and business case before funding route scouting.',
      stageCode: 'S2',
      gateCode: 'Gate 1',
      division: 'Polymers & Resins - PR',
      divisions: [
        'Polymers & Resins - PR'
      ],
      workflow: '3/5',
      updatedDate: '2026-02-15',
      updatedBy: 'Dr. Priya Raman',
      historyCount: 5
    },
    {
      name: 'Process Route Selection',
      count: 6,
      route: 'route-selection',
      status: true,
      description: 'Select the commercial route based on bench-scale yield, selectivity, robustness, impurity profile, preliminary safety screening, and basis of design.',
      stageCode: 'S5',
      gateCode: 'Gate 2',
      division: 'Polymers & Resins - PR, Specialty Chemicals - SC',
      divisions: [
        'Polymers & Resins - PR',
        'Specialty Chemicals - SC'
      ],
      workflow: '2/5',
      updatedDate: '2026-02-12',
      updatedBy: 'Rajesh Kumar',
      historyCount: 2
    },
    {
      name: 'Registration & Pilot Readiness',
      count: 6,
      route: 'pilot-readiness',
      status: false,
      description: 'Assess process hazard analysis (HAZOP/LOPA), pilot plant readiness, analytical method validation, and REACH/TSCA environmental and toxicology data package before pilot campaign.',
      stageCode: 'S7',
      gateCode: 'Gate 3',
      division: 'Polymers & Resins - PR, Petrochemicals - PC',
      divisions: [
        'Polymers & Resins - PR',
        'Petrochemicals - PC'
      ],
      workflow: '4/5',
      updatedDate: '2026-02-10',
      updatedBy: 'Anita Desai',
      historyCount: 3
    },
    {
      name: 'Demo-Scale Proof',
      count: 6,
      route: 'demo-scale',
      status: false,
      description: 'Review pilot and demo-scale batch results, customer qualification evidence, process safety review, and capex package for commercial plant build.',
      stageCode: 'S10',
      gateCode: 'Gate 4',
      division: 'Polymers & Resins - PR',
      divisions: [
        'Polymers & Resins - PR'
      ],
      workflow: '3/5',
      updatedDate: '2026-02-05',
      updatedBy: 'Suresh Naidu',
      historyCount: 4
    },
    {
      name: 'Commercial Production Readiness',
      count: 5,
      route: 'commercial-readiness',
      status: false,
      description: 'Verify plant commissioning and performance test results, operating procedures and training, pre-startup safety review, operating permits, and GHS/CLP labeling before commercial launch.',
      stageCode: 'S11',
      gateCode: 'Gate 5',
      division: 'Polymers & Resins - PR, Specialty Chemicals - SC, Petrochemicals - PC',
      divisions: [
        'Polymers & Resins - PR',
        'Specialty Chemicals - SC',
        'Petrochemicals - PC'
      ],
      workflow: '5/5',
      updatedDate: '2026-01-30',
      updatedBy: 'Amit Patel',
      historyCount: 5
    }
  ];

  pagedData: Gate[] = [];

  constructor() {
    // Automatically cleans up subscription on component destruction
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.checkChildRoute();
      });
  }

  readonly historySequence: number[] = [5, 2, 3, 4, 5, 1, 6, 2, 4, 3, 5, 2, 6, 1, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  ngOnInit(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30'];
    const sampleUsers = ['Dr. Priya Raman', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu'];
    this.masterData.forEach((g, idx) => {
      if (!g.historyCount) {
        g.historyCount = this.getHistoryCount(idx);
      }
      if (!g.updatedDate) {
        g.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!g.updatedBy) {
        g.updatedBy = sampleUsers[idx % sampleUsers.length];
      }
    });
    this.totalSize = this.masterData.length;
    this.checkChildRoute();
    this.updatePageData();
  }

  private checkChildRoute(): void {
    const childRoutes = this.masterData.map(s => s.route);
    const currentUrl = this.router.url;
    this.isChildRouteActive = childRoutes.some(route => currentUrl.includes(`/gates/${route}`));
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
   * Reorders rows via drag and drop and syncs the master array accurately.
   */
  onDrop(event: CdkDragDrop<Gate[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    // Move in current view
    moveItemInArray(this.pagedData, event.previousIndex, event.currentIndex);

    // Sync master data array
    const startIndex = this.pageIndex * this.pageSize;
    this.masterData.splice(startIndex, this.pageSize, ...this.pagedData);
    this.updatePageData();
  }

/**
   * Navigates to the nested criteria route relative to the current active route.
   * @param route The child path string (e.g., 'feasibility', 'formulation').
   */
  async navigateTo(route: string): Promise<void> {
    if (!route) {
      console.warn('Navigation blocked: Route parameter is missing or empty.');
      return;
    }

    try {
      // router.navigate returns a Promise, which is best practice to handle
      const success = await this.router.navigate([route], { relativeTo: this.activeRoute });

      if (!success) {
        console.error(`Navigation to ${route} failed or was cancelled by a route guard.`);
      }
    } catch (error) {
      console.error('An error occurred during navigation:', error);
    }
  }

  goBack(): void {
    this.location.back();
  }

  getDivisionCount(item: Gate): number {
    if (item.divisions && item.divisions.length) {
      return item.divisions.length;
    }
    return item.division ? item.division.split(',').filter(Boolean).length : 0;
  }

  onDivisionClick(item: Gate): void {
    const currentSelected = item.divisions && item.divisions.length
      ? [...item.divisions]
      : (item.division ? item.division.split(',').map((d: string) => d.trim()).filter(Boolean) : []);

    const dialogRef = this.dialog.open(GatesDivisionsComponent, {
      width: '520px',
      autoFocus: false,
      data: {
        gate: item,
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

  onAddGate(): void {
    const dialogRef = this.dialog.open(AddGateComponent, {
      width: '600px',
      height: 'auto',
      disableClose: false,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.gateName) {
        const nextId = this.masterData.length + 1;
        const newGate: Gate = {
          name: result.gateName,
          description: result.description || '',
          count: 0,
          status: true,
          stageCode: result.stageCode || '',
          gateCode: `Gate ${nextId}`,
          division: result.division || 'Polymers & Resins - PR',
          divisions: result.divisions || (result.division ? [result.division] : ['Polymers & Resins - PR']),
          route: `gate-${nextId}`,
          historyCount: 1
        };
        this.masterData.unshift(newGate);
        this.totalSize = this.masterData.length;
        this.updatePageData();
      }
    });
  }

  onEditGate(item: Gate): void {
    if (!this.canUpdate) return;

    const dialogRef = this.dialog.open(AddGateComponent, {
      width: '600px',
      height: 'auto',
      data: {
        mode: 'edit',
        gateName: item.name,
        division: item.division,
        divisions: item.divisions,
        stageCode: item.stageCode,
        description: item.description
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.gateName) {
        item.name = result.gateName;
        if (result.division !== undefined) {
          item.division = result.division;
          item.divisions = result.divisions || (result.division ? result.division.split(',').map((s: string) => s.trim()) : []);
        }
        if (result.description !== undefined) item.description = result.description;
        if (result.stageCode !== undefined) item.stageCode = result.stageCode;
      }
    });
  }

  onDeleteGate(item: Gate): void {
    if (!this.canDelete || item.TotalUsed) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.masterData = this.masterData.filter(gate => gate.gateCode !== item.gateCode);
        this.totalSize = this.masterData.length;

        const maxPageIndex = Math.max(0, Math.ceil(this.totalSize / this.pageSize) - 1);
        if (this.pageIndex > maxPageIndex) {
          this.pageIndex = maxPageIndex;
        }
        this.updatePageData();
      }
    });
  }

  // onStatusChange(item: Gate): void {
  //   if (!this.canUpdate) return;

  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: {
  //       title: 'Change Status',
  //       content: `Are you sure you want to change the status of ${item.name}?`
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       item.status = !item.status;
  //     }
  //   });
  // }

  openWorkflow(gate: Gate): void {
    const dialogRef = this.dialog.open(GateWorkflowComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { gate },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.summary) {
        gate.workflow = res.summary;
      }
    });
  }

  openHistory(item: Gate, index?: number): void {
    const historyCount = item.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/gates/history'], {
      queryParams: {
        gateCode: item.gateCode,
        gateName: item.name,
        stageCode: item.stageCode,
        division: item.division || (item.divisions ? item.divisions.join(', ') : ''),
        description: item.description,
        workflow: item.workflow,
        count: item.count,
        status: item.status,
        historyCount: historyCount
      }
    });
  }

  openDescription(item: Gate): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '560px',
      maxWidth: '92vw',
      panelClass: 'app-description-dialog-panel',
      data: {
        title: item.name,
        code: item.gateCode,
        type: 'Gate',
        description: item.description || 'No description provided.'
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

