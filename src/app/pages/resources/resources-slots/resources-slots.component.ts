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
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddResourceSlotsComponent } from '../../projects/project-dashboard/project-resources/project-resource-slots/add-resource-slots/add-resource-slots.component';

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
  selector: 'app-resources-slots',
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
  ],
  templateUrl: './resources-slots.component.html',
  styleUrl: './resources-slots.component.scss',
})
export class ResourcesSlotsComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  selectedResource: string = '';
  selectedDate: string = '';

  slots: ResourceSlotItem[] = [];
  filteredSlots: ResourceSlotItem[] = [];

  pageIndex: number = 0;
  pageSize: number = 10;

  stageOptions: string[] = [
    'Opportunity Identification',
    'Concept Screening & Feasibility',
    'Route Scouting & Lab Synthesis',
    'Process Optimization (Lab Scale)',
    'Process Route Selection & Basis of Design',
    'Bench-to-Pilot Process Development',
    'Process Safety & Regulatory Studies',
    'Regulatory Registration Filing (REACH / TSCA)',
    'Pilot Plant Campaign',
    'Demonstration-Scale Campaign',
    'Commercial Plant Build & Commissioning',
    'Commercial Launch & Ramp-Up'
  ];

  get paginatedSlots(): ResourceSlotItem[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredSlots.slice(start, start + this.pageSize);
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

    this.slots = [
      {
        id: 1,
        stage: 'Opportunity Identification',
        deliverable: 'Opportunity Assessment & Scope',
        activity: 'Review industrial customer specifications, grade requirements and end-use application criteria',
        task: 'Target product physicochemical specifications analysis',
        fromTime: '09:00 AM',
        toTime: '11:30 AM',
        approved: true,
        declined: false,
        pending: false,
        resourceName: res,
        date: dt
      },
      {
        id: 2,
        stage: 'Opportunity Identification',
        deliverable: 'Market Sizing & Commercial Potential',
        activity: 'Perform comparative analytical characterization of benchmark commercial grades',
        task: 'Competitor grade sourcing and characterization',
        fromTime: '11:30 AM',
        toTime: '01:30 PM',
        approved: true,
        declined: false,
        pending: false,
        resourceName: res,
        date: dt
      },
      {
        id: 3,
        stage: 'Concept Screening & Feasibility',
        deliverable: 'Chemistry & Synthetic Route Evaluation',
        activity: 'Survey open literature and patents for synthetic pathways, catalytic systems and precursors',
        task: 'Reaction pathway stoichiometry and atom economy evaluation',
        fromTime: '02:30 PM',
        toTime: '04:30 PM',
        approved: false,
        declined: false,
        pending: true,
        resourceName: res,
        date: dt
      },
      {
        id: 4,
        stage: 'Concept Screening & Feasibility',
        deliverable: 'Process Safety & Environmental Screening',
        activity: 'Screen candidate reagents and reaction chemistries for runaway thermal hazard potential',
        task: 'Reagent thermal stability and runaway screening (DSC / TGA)',
        fromTime: '04:30 PM',
        toTime: '06:00 PM',
        approved: false,
        declined: false,
        pending: true,
        resourceName: res,
        date: dt
      }
    ];

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
        content: `Are you sure you want to delete the slot "${slot.task}"?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.slots = this.slots.filter((s) => s.id !== slot.id);
        this.filteredSlots = [...this.slots];
      }
    });
  }

    formatStageName(stage?: string): string {
    if (!stage) return 'Opportunity Identification';
    const s = stage.trim();
    if (s.includes('Business Case')) return 'Opportunity Identification';
    if (s.includes('Project Initiation')) return 'Concept Screening & Feasibility';
    if (s.includes('Development Procurement')) return 'Route Scouting & Lab Synthesis';
    if (s.includes('POC Formulation')) return 'Process Optimization (Lab Scale)';
    if (s.includes('Scale-Up')) return 'Process Route Selection & Basis of Design';
    if (s.includes('Exhibit Batches')) return 'Bench-to-Pilot Process Development';
    if (s.startsWith('Stage 1:') || s.startsWith('S1:')) return 'Opportunity Identification';
    if (s.startsWith('Stage 2:') || s.startsWith('S2:')) return 'Concept Screening & Feasibility';
    if (s.startsWith('Stage 3:') || s.startsWith('S3:')) return 'Route Scouting & Lab Synthesis';
    if (s.startsWith('Stage 4:') || s.startsWith('S4:')) return 'Process Optimization (Lab Scale)';
    if (s.startsWith('Stage 5:') || s.startsWith('S5:')) return 'Process Route Selection & Basis of Design';
    if (s.startsWith('Stage 6:') || s.startsWith('S6:')) return 'Bench-to-Pilot Process Development';
    if (s.startsWith('Stage 7:') || s.startsWith('S7:')) return 'Process Safety & Regulatory Studies';
    if (s.startsWith('Stage 8:') || s.startsWith('S8:')) return 'Regulatory Registration Filing (REACH / TSCA)';
    if (s.startsWith('Stage 9:') || s.startsWith('S9:')) return 'Pilot Plant Campaign';
    if (s.startsWith('Stage 10:') || s.startsWith('S10:')) return 'Demonstration-Scale Campaign';
    if (s.startsWith('Stage 11:') || s.startsWith('S11:')) return 'Commercial Plant Build & Commissioning';
    if (s.startsWith('Stage 12:') || s.startsWith('S12:')) return 'Commercial Launch & Ramp-Up';
    return s;
  }

  goBack(): void {
    this.router.navigate(['/resources']);
  }
}
