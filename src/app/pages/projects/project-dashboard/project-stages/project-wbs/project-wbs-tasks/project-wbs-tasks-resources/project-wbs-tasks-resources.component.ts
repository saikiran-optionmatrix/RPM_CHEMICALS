import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { AddResourceComponent } from '../../../../project-resources/add-resource/add-resource.component';
import { ResourceTimelineComponent } from '../../../../project-resources/resource-timeline/resource-timeline.component';
import { ConfirmationDialogComponent } from '../../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface ResourceItem {
  code: string;
  name: string;
  selected: boolean;
}

export interface ResourceScheduleItem {
  resource: string;
  initials: string;
  stage: string;
  module: string;
  task: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  planDuration: string;
  actualDuration: string;
  status: string;
  dayPlacement: string;
  color: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-wbs-tasks-resources',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-wbs-tasks-resources.component.html',
  styleUrl: './project-wbs-tasks-resources.component.scss',
})
export class ProjectWbsTasksResourcesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  activeTab: 'Scheduling' | 'Allocation' = 'Scheduling';

  availableResources: ResourceItem[] = [];
  allocatedResources: ResourceItem[] = [];
  schedules: ResourceScheduleItem[] = [];
  paginatedSchedules: ResourceScheduleItem[] = [];

  // Pagination for Scheduling table
  currentPage: number = 1;
  pageSize: number = 10;

  // Task & Project context parameters
  taskName: string = '';
  taskCode: string = '';
  reference: string = '';
  jobCode: string = '';
  activityName: string = '';
  jobCodeParam: string = '';
  stageName: string = '';
  stageCode: string = '';
  gateName: string = '';
  gateCode: string = '';
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 1. Initialise mock data immediately so UI is always populated
    this.initializeData();

    // 2. Read query params and contextualize top mock items
    this.route.queryParams.subscribe(params => {
      this.taskName = params['taskName'] || '';
      this.taskCode = params['taskCode'] || '';
      this.reference = params['reference'] || '';
      this.jobCode = params['jobCode'] || '';
      this.activityName = params['activityName'] || '';
      this.jobCodeParam = params['jobCodeParam'] || params['jobCode'] || '';
      this.stageName = params['stageName'] || '';
      this.stageCode = params['stageCode'] || '';
      this.gateName = params['gateName'] || '';
      this.gateCode = params['gateCode'] || '';
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }

      // Contextualise schedules with active task info
      if (this.taskName || this.activityName || this.stageName) {
        this.schedules.forEach((s, idx) => {
          if (idx < 3) {
            if (this.taskName) s.task = this.taskName;
            if (this.activityName) s.module = this.activityName;
            if (this.stageName) s.stage = this.stageName;
          }
        });
      }

      this.updatePagination();
    });
  }

  initializeData(): void {
    this.availableResources = [
      { code: 'RES001', name: 'Jacketed Reactor 2L (Chem-01)', selected: false },
      { code: 'RES002', name: 'Dr. Sarah Jenkins', selected: false },
      { code: 'RES003', name: 'Gas Chromatograph GC-FID 02', selected: false },
      { code: 'RES004', name: 'Ravi Shah', selected: false },
      { code: 'RES005', name: 'RC1 Reaction Calorimeter', selected: false },
      { code: 'RES006', name: 'Mia Chen', selected: false },
      { code: 'RES007', name: 'Pilot Glass-Lined Reactor 100L', selected: false },
      { code: 'RES008', name: 'Robert Chen', selected: false }
    ];

    this.allocatedResources = [
      { code: 'RES009', name: 'Emily Watson', selected: false },
      { code: 'RES010', name: 'Jessica Alba', selected: false },
      { code: 'RES011', name: 'Rotary Evaporator Skid', selected: false },
      { code: 'RES012', name: 'Diego Ruiz', selected: false },
      { code: 'RES013', name: 'DSC-01 Calorimeter', selected: false }
    ];

    this.schedules = [
      {
        resource: 'Jacketed Reactor 2L (Chem-01)', initials: 'JR', stage: 'S1: Opportunity Identification', module: 'Customer Application & Target Specification Matrix',
        task: 'Confirm technical scope and operating window', fromDate: '2026-06-01', fromTime: '09:00 AM', toDate: '2026-06-05',
        toTime: '05:00 PM', planDuration: '5 days', actualDuration: '5 days',
        status: 'Completed', dayPlacement: 'Monday', color: '#dcfce7',
        updatedDate: '2026-02-15', updatedBy: 'Dr. Sarah Jenkins', historyCount: 3
      },
      {
        resource: 'Gas Chromatograph GC-FID 02', initials: 'GC', stage: 'S3: Route Scouting & Lab Synthesis', module: 'Raw Material Purity & Catalyst Screening',
        task: 'Validate Monomer & Catalyst Purity', fromDate: '2026-06-08', fromTime: '09:00 AM', toDate: '2026-06-21',
        toTime: '05:00 PM', planDuration: '14 days', actualDuration: '12 days',
        status: 'Completed', dayPlacement: 'Tuesday', color: '#dcfce7',
        updatedDate: '2026-02-12', updatedBy: 'Mia Chen', historyCount: 5
      },
      {
        resource: 'RC1 Reaction Calorimeter', initials: 'RC', stage: 'S4: Process Optimization (Lab Scale)', module: 'Reaction Calorimetry & Heat Transfer Evaluation',
        task: 'Measure isothermal heat flow and instantaneous heat generation rates in RC1', fromDate: '2026-06-22', fromTime: '09:00 AM', toDate: '2026-07-02',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: '8 days',
        status: 'Active', dayPlacement: 'Wednesday', color: '#e0f2fe',
        updatedDate: '2026-02-10', updatedBy: 'Ravi Shah', historyCount: 2
      },
      {
        resource: 'Dr. Sarah Jenkins', initials: 'SJ', stage: 'S4: Process Optimization (Lab Scale)', module: 'Monomer Feed Profile & Reaction Kinetics',
        task: 'Optimize semi-batch feed profile, temperature ramp and agitation speed', fromDate: '2026-07-03', fromTime: '09:00 AM', toDate: '2026-07-13',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Thursday', color: '#ffedd5',
        updatedDate: '2026-02-05', updatedBy: 'Dr. Sarah Jenkins', historyCount: 4
      },
      {
        resource: 'Robert Chen', initials: 'RC', stage: 'S5: Process Route Selection & Basis of Design', module: 'Process Flow Diagram (PFD) & Basis of Design (BOD)',
        task: 'Final Chemical Route Selection & Mass/Energy Balances', fromDate: '2026-07-14', fromTime: '09:00 AM', toDate: '2026-07-25',
        toTime: '05:00 PM', planDuration: '12 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Friday', color: '#ffedd5',
        updatedDate: '2026-01-30', updatedBy: 'Robert Chen', historyCount: 1
      },
      {
        resource: 'Pilot Glass-Lined Reactor 100L', initials: 'PR', stage: 'S6: Bench-to-Pilot Process Development', module: 'Pilot Scale Heat Duty & Agitation Hydrodynamics',
        task: 'Reaction Kinetics & Scale-Down Pilot Model', fromDate: '2026-07-27', fromTime: '09:00 AM', toDate: '2026-08-10',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Monday', color: '#ffedd5',
        updatedDate: '2026-01-28', updatedBy: 'Ravi Shah', historyCount: 6
      },
      {
        resource: 'Emily Watson', initials: 'EW', stage: 'S7: Process Safety & Regulatory Studies', module: 'Process Hazard Analysis (HAZOP) & Safety Interlocks',
        task: 'Conduct multi-disciplinary HAZOP on reactor nodes, feed systems and vapor vents', fromDate: '2026-08-11', fromTime: '09:00 AM', toDate: '2026-09-10',
        toTime: '05:00 PM', planDuration: '30 days', actualDuration: 'N/A',
        status: 'Active', dayPlacement: 'Tuesday', color: '#e0f2fe',
        updatedDate: '2026-01-25', updatedBy: 'Emily Watson', historyCount: 2
      },
      {
        resource: 'Jessica Alba', initials: 'JA', stage: 'S8: Regulatory Registration Filing (REACH / TSCA)', module: 'REACH / TSCA Technical Dossier Preparation & Filing',
        task: 'Assemble IUCLID chemical registration dossier and physicochemical data package', fromDate: '2026-09-11', fromTime: '09:00 AM', toDate: '2026-09-25',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Wednesday', color: '#ffedd5',
        updatedDate: '2026-01-20', updatedBy: 'Jessica Alba', historyCount: 7
      },
      {
        resource: 'Rotary Evaporator Skid', initials: 'RE', stage: 'S5: Process Route Selection & Basis of Design', module: 'Solvent Recovery & Distillation Mass Balance',
        task: 'Perform solvent distillation and recovery efficiency studies', fromDate: '2026-09-26', fromTime: '09:00 AM', toDate: '2026-10-10',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Thursday', color: '#ffedd5',
        updatedDate: '2026-01-15', updatedBy: 'Robert Chen', historyCount: 3
      },
      {
        resource: 'Diego Ruiz', initials: 'DR', stage: 'S9: Pilot Plant Campaign', module: 'Pilot Campaign Batch Execution & Yield Verification',
        task: 'Execute pilot batch campaigns in 100 L and 500 L glass-lined reactors', fromDate: '2026-10-11', fromTime: '09:00 AM', toDate: '2026-10-25',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Friday', color: '#ffedd5',
        updatedDate: '2026-01-10', updatedBy: 'Diego Ruiz', historyCount: 4
      }
    ];

    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedSchedules = this.schedules.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  setTab(tab: 'Scheduling' | 'Allocation'): void {
    this.activeTab = tab;
  }

  // ================= POPUPS =================

  openAddResourceScheduleDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: {
        stage: this.stageName || 'Feasibility',
        module: this.activityName || 'Raw Material Purity Assay',
        task: this.taskName || 'Molecule Selection & Indication Mapping'
      }
    });

    dialogRef.afterClosed().subscribe((result: ResourceScheduleItem | undefined) => {
      if (result) {
        if (!result.historyCount) {
          result.historyCount = Math.floor(Math.random() * 5) + 1;
        }
        if (!result.updatedDate) {
          result.updatedDate = new Date().toISOString().split('T')[0];
        }
        if (!result.updatedBy) {
          result.updatedBy = result.resource || 'Current User';
        }
        this.schedules.unshift(result);
        this.updatePagination();
      }
    });
  }

  editSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: item
    });

    dialogRef.afterClosed().subscribe((result: ResourceScheduleItem | undefined) => {
      if (result) {
        Object.assign(item, result);
        item.updatedDate = new Date().toISOString().split('T')[0];
        this.updatePagination();
      }
    });
  }

  deleteSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this resource schedule?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.schedules = this.schedules.filter(s => s !== item);
        this.updatePagination();
      }
    });
  }

  openTimelineModal(item: ResourceScheduleItem): void {
    this.dialog.open(ResourceTimelineComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: item
    });
  }

  // ================= ALLOCATION TAB METHODS =================

  toggleAvailableSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  toggleAllocatedSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  allocateResources(): void {
    const selected = this.availableResources.filter(r => r.selected);
    this.allocatedResources.push(...selected);
    this.availableResources = this.availableResources.filter(r => !r.selected);
    this.allocatedResources.forEach(r => (r.selected = false));
  }

  deallocateResources(): void {
    const selected = this.allocatedResources.filter(r => r.selected);
    this.availableResources.push(...selected);
    this.allocatedResources = this.allocatedResources.filter(r => !r.selected);
    this.availableResources.forEach(r => (r.selected = false));
  }

  canAllocate(): boolean {
    return this.availableResources.some(r => r.selected);
  }

  canDeallocate(): boolean {
    return this.allocatedResources.some(r => r.selected);
  }

  openAddResourceDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newRes: ResourceItem = {
          code: result.code || ('RES' + Math.floor(100 + Math.random() * 900)),
          name: result.name || result.resource || 'New Resource',
          selected: false
        };
        this.availableResources.push(newRes);
      }
    });
  }

  // ================= NAVIGATION & SCROLL =================

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
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/stages/wbs')) {
      this.router.navigate(['/projects/dashboard/stages/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else if (currentUrl.includes('/wbs')) {
      this.router.navigate(['/projects/dashboard/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else {
      this.location.back();
    }
  }
}
