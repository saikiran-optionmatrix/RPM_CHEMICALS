import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

export interface StageItem {
  stageCode: string;
  name: string;
  planEffort: string;
  planDuration: string;
  actualEffort?: string;
  actualDuration?: string;
  percentCompletion?: number;
  done?: boolean;
  description: string;
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
  eta: string;
  buffer: string;
  gateName: string;
  gateStatus: 'Approved' | 'Pending' | 'Rejected';
  gateCode: string;
  status: boolean;
  setupCount: number;
}

@Component({
  selector: 'app-template-stages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  templateUrl: './template-stages.component.html',
  styleUrl: './template-stages.component.scss',
})
export class TemplateStagesComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Specialty Chemical Process Development Program';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  stages: StageItem[] = [
    {
      stageCode: 'S1',
      name: 'Opportunity Identification',
      planEffort: '400 hrs',
      planDuration: '10 days',
      actualEffort: '400 hrs',
      actualDuration: '10 days',
      percentCompletion: 100,
      done: true,
      description: 'Identify and prioritize product and market opportunities from customer demand, competitor gaps and technology trends.',
      planStart: '2026-01-05',
      planEnd: '2026-01-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-01-15',
      eta: '2026-01-15',
      buffer: '2 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 8,
    },
    {
      stageCode: 'S2',
      name: 'Concept Screening & Feasibility',
      planEffort: '300 hrs',
      planDuration: '10 days',
      actualEffort: '300 hrs',
      actualDuration: '10 days',
      percentCompletion: 100,
      done: true,
      description: 'Assess technical, economic and regulatory feasibility of candidate chemistries and products.',
      planStart: '2026-01-16',
      planEnd: '2026-01-26',
      actualStart: '2026-01-16',
      actualEnd: '2026-01-26',
      eta: '2026-01-26',
      buffer: '2 days',
      gateName: 'Business case and project charter approval (Gate 1)',
      gateStatus: 'Approved',
      gateCode: 'Gate 1',
      status: true,
      setupCount: 12,
    },
    {
      stageCode: 'S3',
      name: 'Route Scouting & Lab Synthesis',
      planEffort: '1,500 hrs',
      planDuration: '30 days',
      actualEffort: '1,500 hrs',
      actualDuration: '30 days',
      percentCompletion: 100,
      done: true,
      description: 'Screen synthesis routes, catalysts and raw materials and prove the chemistry at laboratory scale.',
      planStart: '2026-01-27',
      planEnd: '2026-02-28',
      actualStart: '2026-01-27',
      actualEnd: '2026-02-28',
      eta: '2026-02-28',
      buffer: '3 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 17,
    },
    {
      stageCode: 'S4',
      name: 'Process Optimization (Lab Scale)',
      planEffort: '3,000 hrs',
      planDuration: '60 days',
      actualEffort: '1,740 hrs',
      actualDuration: '35 days',
      percentCompletion: 58,
      done: false,
      description: 'Improve yield, selectivity, impurity profile and process robustness at bench scale.',
      planStart: '2026-03-01',
      planEnd: '2026-05-15',
      actualStart: '2026-03-01',
      actualEnd: '',
      eta: '2026-05-30',
      buffer: '5 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 26,
    },
    {
      stageCode: 'S5',
      name: 'Process Route Selection & Basis of Design',
      planEffort: '1,200 hrs',
      planDuration: '25 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Select the commercial route and define the basis of design, cost of manufacturing and risks.',
      planStart: '2026-05-16',
      planEnd: '2026-06-15',
      actualStart: '',
      actualEnd: '',
      eta: '2026-06-15',
      buffer: '2 days',
      gateName: 'Process route selection and basis of design approval (Gate 2)',
      gateStatus: 'Pending',
      gateCode: 'Gate 2',
      status: true,
      setupCount: 14,
    },
    {
      stageCode: 'S6',
      name: 'Bench-to-Pilot Process Development',
      planEffort: '3,500 hrs',
      planDuration: '50 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Develop and scale the reaction, separation and purification steps for the pilot plant.',
      planStart: '2026-06-16',
      planEnd: '2026-08-10',
      actualStart: '',
      actualEnd: '',
      eta: '2026-08-10',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 22,
    },
    {
      stageCode: 'S7',
      name: 'Process Safety & Regulatory Studies',
      planEffort: '3,200 hrs',
      planDuration: '45 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Run hazard studies (HAZOP, calorimetry), toxicology and environmental studies needed to support registration.',
      planStart: '2026-08-11',
      planEnd: '2026-09-30',
      actualStart: '',
      actualEnd: '',
      eta: '2026-09-30',
      buffer: '4 days',
      gateName: 'Registration and pilot plant readiness approval (Gate 3)',
      gateStatus: 'Pending',
      gateCode: 'Gate 3',
      status: true,
      setupCount: 19,
    },
    {
      stageCode: 'S8',
      name: 'Regulatory Registration Filing (REACH / TSCA)',
      planEffort: '1,500 hrs',
      planDuration: '30 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Compile and submit chemical registration dossiers and respond to authority queries.',
      planStart: '2026-10-01',
      planEnd: '2026-11-05',
      actualStart: '',
      actualEnd: '',
      eta: '2026-11-05',
      buffer: '2 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 18,
    },
    {
      stageCode: 'S9',
      name: 'Pilot Plant Campaign',
      planEffort: '3,600 hrs',
      planDuration: '40 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Produce pilot batches to confirm process performance and generate customer samples.',
      planStart: '2026-11-06',
      planEnd: '2026-12-20',
      actualStart: '',
      actualEnd: '',
      eta: '2026-12-20',
      buffer: '3 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 11,
    },
    {
      stageCode: 'S10',
      name: 'Demonstration-Scale Campaign',
      planEffort: '4,000 hrs',
      planDuration: '55 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Run larger campaigns to prove scale-up, equipment fit and product quality with customers.',
      planStart: '2026-12-21',
      planEnd: '2027-02-20',
      actualStart: '',
      actualEnd: '',
      eta: '2027-02-20',
      buffer: '4 days',
      gateName: 'Demo-scale proof and commercial plant design approval (Gate 4)',
      gateStatus: 'Pending',
      gateCode: 'Gate 4',
      status: true,
      setupCount: 24,
    },
    {
      stageCode: 'S11',
      name: 'Commercial Plant Build & Commissioning',
      planEffort: '6,500 hrs',
      planDuration: '150 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Engineer, build, commission and qualify the commercial plant or line.',
      planStart: '2027-02-21',
      planEnd: '2027-06-30',
      actualStart: '',
      actualEnd: '',
      eta: '2027-06-30',
      buffer: '10 days',
      gateName: 'Commercial production readiness approval (Gate 5)',
      gateStatus: 'Pending',
      gateCode: 'Gate 5',
      status: true,
      setupCount: 31,
    },
    {
      stageCode: 'S12',
      name: 'Commercial Launch & Ramp-Up',
      planEffort: '1,300 hrs',
      planDuration: '35 days',
      actualEffort: '',
      actualDuration: '',
      percentCompletion: 0,
      done: false,
      description: 'Start commercial production, ramp up volumes and hand over to operations.',
      planStart: '2027-07-01',
      planEnd: '2027-07-31',
      actualStart: '',
      actualEnd: '',
      eta: '2027-07-31',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 15,
    }
  ];

  // Stage table pagination
  pagedStagesList: StageItem[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  private subs = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
    });
    this.subs.add(sub);

    this.updatePagedStages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  // Scrolling logic
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

  // Pagination
  updatePagedStages() {
    const start = this.currentPage * this.pageSize;
    this.pagedStagesList = this.stages.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedStages();
  }

  get pagedStages(): StageItem[] {
    return this.pagedStagesList;
  }

  toggleStatus(item: StageItem): void {
    item.status = !item.status;
  }

  getSliderColor(percent: number): string {
    if (percent === 100) return '#008000';
    if (!percent || percent === 0) return '#ff0000';
    if (percent <= 30) return '#ff0000';
    if (percent <= 80) return '#ffb300';
    return '#008000';
  }

  onDoneChange(s: StageItem, checked: boolean): void {
    s.done = checked;
    s.percentCompletion = checked ? 100 : 0;
  }

  openTimelineModal(item: any) {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openSetup(item: StageItem) {
    this.router.navigate(['stages/wbs'], {
      relativeTo: this.route.parent,
      queryParams: {
        stageCode: item.stageCode,
        stageName: item.name,
        projectName: this.projectName,
      },
      queryParamsHandling: 'merge',
    });
  }

  private setBodyScrollLock(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }
}
