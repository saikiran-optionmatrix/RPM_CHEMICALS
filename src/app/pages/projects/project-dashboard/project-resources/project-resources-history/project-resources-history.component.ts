import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ResourceHistoryItem {
  id?: number;
  timeline?: string;
  resource: string;
  stage: string;
  deliverable: string;
  activity: string;
  planDuration: string;
  actualDuration: string;
  fromDate?: string;
  toDate?: string;
  fromTime?: string;
  toTime?: string;
  status?: string;
  remarks?: string;
  revision?: string;
  updatedBy?: string;
  changeDate?: string;
}

@Component({
  selector: 'app-project-resources-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-resources-history.component.html',
  styleUrl: './project-resources-history.component.scss'
})
export class ProjectResourcesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  resourceName: string = '';
  stage: string = '';
  deliverable: string = '';
  activity: string = '';
  planDuration: string = '';
  actualDuration: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: ResourceHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: ResourceHistoryItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      }
      if (params['resource']) {
        this.resourceName = params['resource'];
      } else if (params['resourceName']) {
        this.resourceName = params['resourceName'];
      }
      if (params['stage']) {
        this.stage = params['stage'];
      }
      if (params['deliverable']) {
        this.deliverable = params['deliverable'];
      }
      if (params['activity']) {
        this.activity = params['activity'];
      }
      if (params['planDuration']) {
        this.planDuration = params['planDuration'];
      }
      if (params['actualDuration']) {
        this.actualDuration = params['actualDuration'];
      }

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const res = this.resourceName || 'Jacketed Reactor 2L (Chem-01)';
    const stg = this.stage || 'S1: Opportunity Identification';
    const deliv = this.deliverable || 'Raw Material Purity & Assay Validation';
    const act = this.activity || 'Reaction Calorimetry & Thermal Hazard Screening';
    const pDur = this.planDuration || '5 days';
    const aDur = this.actualDuration || '5 days';

    // Build specific revisions for the selected resource
    const selectedResourceRevisions: ResourceHistoryItem[] = [
      {
        id: 1,
        resource: res,
        stage: stg,
        deliverable: deliv,
        activity: act,
        planDuration: pDur,
        actualDuration: aDur,
        fromDate: '2026-06-01',
        toDate: '2026-06-05',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Completed',
        remarks: 'Batch equipment run finalized and operational parameters successfully verified against standard chemical protocol.',
        revision: 'Rev 3 (Current)',
        updatedBy: 'Dr. Sarah Jenkins (Process Chemistry Lead)',
        changeDate: '05-Jun-2026'
      },
      {
        id: 2,
        resource: res,
        stage: stg,
        deliverable: deliv,
        activity: act,
        planDuration: pDur,
        actualDuration: '3 days',
        fromDate: '2026-06-01',
        toDate: '2026-06-04',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'In Progress',
        remarks: 'Mid-activity calibration and sample extraction completed; execution extended to incorporate duplicate runs.',
        revision: 'Rev 2',
        updatedBy: 'Ravi Shah (Safety Engineer)',
        changeDate: '03-Jun-2026'
      },
      {
        id: 3,
        resource: res,
        stage: stg,
        deliverable: deliv,
        activity: act,
        planDuration: '4 days',
        actualDuration: 'N/A',
        fromDate: '2026-06-01',
        toDate: '2026-06-04',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Scheduled',
        remarks: 'Initial resource allocation approved and equipment chamber booked for feasibility stage execution.',
        revision: 'Rev 1',
        updatedBy: 'Robert Chen (Resource Coordinator)',
        changeDate: '28-May-2026'
      }
    ];

    // Additional historical records for other chemical resources
    const otherResourceRecords: ResourceHistoryItem[] = [
      {
        id: 4,
        resource: 'Dr. Sarah Jenkins',
        stage: 'S3: Route Scouting & Lab Synthesis',
        deliverable: 'Synthetic Route Scouting & Catalyst Screening',
        activity: 'Catalyst Concentration & Reaction Yield Optimization',
        planDuration: '14 days',
        actualDuration: '12 days',
        fromDate: '2026-06-08',
        toDate: '2026-06-21',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Completed',
        remarks: 'Catalyst screening runs 01 through 04 completed ahead of schedule with 94% target selectivity.',
        revision: 'Rev 2',
        updatedBy: 'Dr. Sarah Jenkins',
        changeDate: '20-Jun-2026'
      },
      {
        id: 5,
        resource: 'RC1 Reaction Calorimeter',
        stage: 'S4: Process Optimization (Lab Scale)',
        deliverable: 'Reaction Calorimetry (RC1) & Heat Transfer Evaluation',
        activity: 'Isothermal Heat Removal & Agitation Rate Study',
        planDuration: '10 days',
        actualDuration: '8 days',
        fromDate: '2026-06-22',
        toDate: '2026-07-02',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Active',
        remarks: 'Reaction calorimetry runs optimized at 350 rpm; adiabatic runaway potential below critical threshold.',
        revision: 'Rev 1',
        updatedBy: 'Ravi Shah',
        changeDate: '22-Jun-2026'
      },
      {
        id: 6,
        resource: 'Mia Chen',
        stage: 'S4: Process Optimization (Lab Scale)',
        deliverable: 'Analytical Method Development & Validation',
        activity: 'Gas Chromatography Residual Solvent & Assay Profiling',
        planDuration: '10 days',
        actualDuration: 'N/A',
        fromDate: '2026-07-03',
        toDate: '2026-07-13',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'GC-FID capillary column equilibrated; waiting for reaction optimization samples from Dahej pilot facility.',
        revision: 'Rev 1',
        updatedBy: 'Mia Chen',
        changeDate: '30-Jun-2026'
      },
      {
        id: 7,
        resource: 'Rotary Evaporator Skid',
        stage: 'S5: Process Route Selection & Basis of Design',
        deliverable: 'Solvent Recovery & Distillation Mass Balance',
        activity: 'Fractional Distillation & Solvent Recovery Run',
        planDuration: '12 days',
        actualDuration: 'N/A',
        fromDate: '2026-07-14',
        toDate: '2026-07-25',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'Vacuum condenser overhaul complete; recovery run scheduled prior to raw material batch charging.',
        revision: 'Rev 1',
        updatedBy: 'Robert Chen',
        changeDate: '01-Jul-2026'
      },
      {
        id: 8,
        resource: 'Pilot Glass-Lined Reactor 100L',
        stage: 'S9: Pilot Plant Campaign',
        deliverable: 'Pilot Campaign Batch Execution & Yield Verification',
        activity: 'Demo-Scale 100 L Batch Verification',
        planDuration: '15 days',
        actualDuration: 'N/A',
        fromDate: '2026-07-27',
        toDate: '2026-08-10',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'Vessel passivation and DI water boil-out signed off by plant maintenance engineer.',
        revision: 'Rev 1',
        updatedBy: 'Diego Ruiz',
        changeDate: '05-Jul-2026'
      }
    ];

    // Filter other resources so we don't duplicate the selected one
    const otherFiltered = otherResourceRecords.filter(
      item => item.resource.toLowerCase() !== res.toLowerCase()
    );

    this.historyRecords = [...selectedResourceRevisions, ...otherFiltered];
  }

  get paginatedRecords(): ResourceHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: ResourceHistoryItem): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    document.body.style.overflow = 'auto';
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/resources'], {
      queryParams: {
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
