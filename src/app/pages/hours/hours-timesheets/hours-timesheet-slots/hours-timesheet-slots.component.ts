import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddResourceSlotsComponent } from '../../../projects/project-dashboard/project-resources/project-resource-slots/add-resource-slots/add-resource-slots.component';

export interface ResourceSlotItem {
  id: number;
  stage: string;
  deliverable: string;
  activity: string;
  task: string;
  fromTime: string;
  toTime: string;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  resourceName?: string;
  date?: string;
}

@Component({
  selector: 'app-hours-timesheet-slots',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    // AddResourceSlotsComponent,
  ],
  templateUrl: './hours-timesheet-slots.component.html',
  styleUrl: './hours-timesheet-slots.component.scss',
})
export class HoursTimesheetSlotsComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  selectedResource: string = '';
  selectedDate: string = '';

  slots: ResourceSlotItem[] = [];
  filteredSlots: ResourceSlotItem[] = [];

  pageIndex: number = 0;
  pageSize: number = 10;

  showFilter: boolean = false;
  keyword: string = '';
  status: string = '';

  get paginatedSlots(): ResourceSlotItem[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredSlots.slice(start, start + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.applyFilter();
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.filteredSlots = [...this.slots];
    this.pageIndex = 0;
  }

  applyFilter(): void {
    this.filteredSlots = this.slots.filter((s) => {
      if (this.status === 'Approved' && !s.approved) return false;
      if (this.status === 'Declined' && !s.declined) return false;
      if (this.status === 'Pending' && !s.pending) return false;

      if (this.keyword && this.keyword.trim()) {
        const query = this.keyword.toLowerCase().trim();
        const combined = `${s.stage} ${s.deliverable} ${s.activity} ${s.task} ${s.fromTime} ${s.toTime}`.toLowerCase();
        if (!combined.includes(query)) return false;
      }
      return true;
    });
    this.pageIndex = 0;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['resource']) {
        this.selectedResource = params['resource'];
      }
      if (params['date']) {
        this.selectedDate = params['date'];
      }

      this.initSlotsForResource(this.selectedResource, this.selectedDate);
    });
  }

  initSlotsForResource(resource: string, dateStr: string): void {
    const res = resource || 'Gas Chromatograph A';
    const dt = dateStr || '06-02-26';

    if (res === 'Anita Desai') {
      this.slots = [
        {
          id: 1,
          stage: 'Process Optimization (Lab Scale)',
          deliverable: 'Polymer Synthesis',
          activity: 'Monomer Pre-Emulsion Preparation',
          task: 'Surfactant dispersion and high-shear pre-emulsification',
          fromTime: '09:00 AM',
          toTime: '12:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 2,
          stage: 'Process Optimization (Lab Scale)',
          deliverable: 'Analytical Testing',
          activity: 'Particle Size & Solids % Assay',
          task: 'Laser diffraction particle size and gravimetric solids test',
          fromTime: '01:30 PM',
          toTime: '04:00 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 3,
          stage: 'Process Optimization (Lab Scale)',
          deliverable: 'Polymer Synthesis',
          activity: 'Initiator System Screening',
          task: 'Redox initiator dosing rate vs polymerization exotherm',
          fromTime: '04:00 PM',
          toTime: '06:00 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
      ];
    } else if (res === 'Jacketed Reactor B') {
      this.slots = [
        {
          id: 1,
          stage: 'Scale-Up & Pilot Batch',
          deliverable: 'Pilot Plant Operations',
          activity: 'Reactor Heat Transfer & Cooling Run',
          task: 'Jacket heat removal rate calibration at 80°C',
          fromTime: '09:00 AM',
          toTime: '11:30 AM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 2,
          stage: 'Scale-Up & Pilot Batch',
          deliverable: 'Pilot Plant Operations',
          activity: 'Monomer Metering Pump Calibration',
          task: 'Continuous feed rate verification across 4 hours',
          fromTime: '11:30 AM',
          toTime: '01:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 3,
          stage: 'Scale-Up & Pilot Batch',
          deliverable: 'Pilot Plant Operations',
          activity: 'Residual Monomer Vacuum Stripping',
          task: 'Steam-assisted stripping and VOC reduction to <50 ppm',
          fromTime: '02:30 PM',
          toTime: '04:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 4,
          stage: 'Scale-Up & Pilot Batch',
          deliverable: 'Pilot Plant Operations',
          activity: 'Emulsion In-Line Filtration',
          task: '50-micron cartridge filter differential pressure monitoring',
          fromTime: '04:30 PM',
          toTime: '06:00 PM',
          approved: false,
          declined: true,
          pending: false,
          resourceName: res,
          date: dt,
        },
      ];
    } else if (res === 'Amit Patel') {
      this.slots = [
        {
          id: 1,
          stage: 'Process Development & Chemistry',
          deliverable: 'Analytical Method Development',
          activity: 'Residual Monomers GC-FID Method',
          task: 'Headspace GC method validation for MMA and Butyl Acrylate',
          fromTime: '08:30 AM',
          toTime: '10:30 AM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 2,
          stage: 'Process Development & Chemistry',
          deliverable: 'Analytical Method Development',
          activity: 'Gel Permeation Chromatography (GPC)',
          task: 'THF eluent multi-detector GPC molecular weight calibration',
          fromTime: '10:30 AM',
          toTime: '12:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 3,
          stage: 'Process Development & Chemistry',
          deliverable: 'Analytical Method Development',
          activity: 'Thermal Decomposition & DSC Testing',
          task: 'TGA degradation kinetics and glass transition measurement',
          fromTime: '01:30 PM',
          toTime: '03:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 4,
          stage: 'Process Development & Chemistry',
          deliverable: 'Analytical Method Development',
          activity: 'Surfactant & Salt Residue Analysis',
          task: 'Ion chromatography and conductivity titration validation',
          fromTime: '03:30 PM',
          toTime: '05:00 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
        {
          id: 5,
          stage: 'Process Development & Chemistry',
          deliverable: 'Analytical Method Development',
          activity: 'Cleaning & Decontamination Verification',
          task: 'TOC rinse sampling and reactor wall residue testing',
          fromTime: '05:00 PM',
          toTime: '06:30 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
      ];
    } else if (res === 'Rajesh Kumar') {
      this.slots = [
        {
          id: 1,
          stage: 'Opportunity Identification',
          deliverable: 'Feasibility Study',
          activity: 'Benchmark Resin Reverse Engineering',
          task: 'Physicochemical characterization and comparative resin benchmarking',
          fromTime: '09:00 AM',
          toTime: '11:30 AM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 2,
          stage: 'Concept Screening & Feasibility',
          deliverable: 'Polymer Synthesis & Kinetics',
          activity: 'Reaction Calorimetry (RC1) Study',
          task: 'Adiabatic exotherm and thermal runaway hazard testing',
          fromTime: '11:30 AM',
          toTime: '01:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 3,
          stage: 'Concept Screening & Feasibility',
          deliverable: 'Product Performance Testing',
          activity: 'Accelerated Storage & Freeze-Thaw',
          task: 'Viscosity stability and freeze-thaw resistance testing',
          fromTime: '02:30 PM',
          toTime: '04:30 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
        {
          id: 4,
          stage: 'Process Optimization (Lab Scale)',
          deliverable: 'Formulation Engineering',
          activity: 'Crosslinking Density Optimization',
          task: 'Functional monomer addition and scrub resistance assay',
          fromTime: '04:30 PM',
          toTime: '06:00 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
      ];
    } else {
      // Default set for Gas Chromatograph A and others
      this.slots = [
        {
          id: 1,
          stage: 'Opportunity Identification',
          deliverable: 'Feasibility Study',
          activity: 'Competitive Chemical Profiling',
          task: 'Solids %, pH, viscosity, and chemical benchmarking',
          fromTime: '09:00 AM',
          toTime: '11:30 AM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 2,
          stage: 'Concept Screening & Feasibility',
          deliverable: 'Polymer Synthesis & Kinetics',
          activity: 'Reaction Kinetics Run',
          task: 'Conversion vs time profiling via gravimetric sampling',
          fromTime: '11:30 AM',
          toTime: '01:30 PM',
          approved: true,
          declined: false,
          pending: false,
          resourceName: res,
          date: dt,
        },
        {
          id: 3,
          stage: 'Concept Screening & Feasibility',
          deliverable: 'Materials Testing',
          activity: 'Film Properties & Tensile Test',
          task: 'Universal testing machine tensile strength and elongation',
          fromTime: '02:30 PM',
          toTime: '04:30 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
        {
          id: 4,
          stage: 'Process Optimization (Lab Scale)',
          deliverable: 'Analytical Testing',
          activity: 'Viscosity & Rheological Flow Curve',
          task: 'Rotational rheometer shear sweep from 0.1 to 1000 s⁻¹',
          fromTime: '04:30 PM',
          toTime: '06:00 PM',
          approved: false,
          declined: false,
          pending: true,
          resourceName: res,
          date: dt,
        },
      ];
    }

    this.filteredSlots = [...this.slots];
    this.pageIndex = 0;
  }

    toggleStatus(slot: ResourceSlotItem, type: 'approved' | 'declined' | 'pending', checked: boolean): void {
    if (checked) {
      slot.approved = type === 'approved';
      slot.declined = type === 'declined';
      slot.pending = type === 'pending';
    } else {
      slot[type] = false;
      if (!slot.approved && !slot.declined && !slot.pending) {
        slot.pending = true;
      }
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openAddSlot(): void {
    const dialogRef = this.dialog.open(AddResourceSlotsComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        resourceName: this.selectedResource,
        date: this.selectedDate,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newSlot: ResourceSlotItem = {
          id: Date.now(),
          stage: result.stage || 'Opportunity Identification',
          deliverable: result.deliverable || 'Feasibility Study',
          activity: result.activity || 'Reference Product Characterization',
          task: result.task || 'Characterization task',
          fromTime: result.fromTime || '09:00 AM',
          toTime: result.toTime || '11:00 AM',
          approved: result.approved || false,
          declined: result.declined || false,
          pending: result.pending !== undefined ? result.pending : true,
          resourceName: this.selectedResource,
          date: this.selectedDate,
        };
        this.slots.unshift(newSlot);
        this.filteredSlots = [...this.slots];
      }
    });
  }

  openEditSlot(slot: ResourceSlotItem): void {
    const dialogRef = this.dialog.open(AddResourceSlotsComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        ...slot,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(slot, result);
      }
    });
  }

  deleteSlot(slot: ResourceSlotItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Slot',
        content: `Are you sure you want to delete the slot "${slot.task}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.slots = this.slots.filter((s) => s.id !== slot.id);
        this.filteredSlots = [...this.slots];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/hours/timesheets']);
  }
}
