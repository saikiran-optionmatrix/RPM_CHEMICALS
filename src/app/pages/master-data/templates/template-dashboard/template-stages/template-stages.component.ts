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
    'Acrylic Emulsion Binder 50% Solids';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  stages: StageItem[] = [
    {
      stageCode: 'S1',
      name: 'Business Case',
      planEffort: '80 hrs',
      planDuration: '10 days',
      actualEffort: '80 hrs',
      actualDuration: '10 days',
      percentCompletion: 0,
      done: false,
      description: 'Business Case Preparation by PMO Team',
      planStart: '2026-01-05',
      planEnd: '2026-01-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-01-15',
      eta: '2026-01-15',
      buffer: '2 days',
      gateName: 'Gate 1',
      gateStatus: 'Approved',
      gateCode: 'Gate 1',
      status: true,
      setupCount: 7,
    },
    {
      stageCode: 'S2',
      name: 'Product / Project In Initiation',
      planEffort: '60 hrs',
      planDuration: '10 days',
      actualEffort: '60 hrs',
      actualDuration: '10 days',
      percentCompletion: 0,
      done: false,
      description: 'Product / Project In Initiation - Kick-off & Charter Finalization',
      planStart: '2026-01-16',
      planEnd: '2026-01-25',
      actualStart: '2026-01-16',
      actualEnd: '2026-01-25',
      eta: '2026-01-25',
      buffer: '2 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 23,
    },
    {
      stageCode: 'S3',
      name: 'Procurement of API, RM & Packaging materials - For Developmental studies.',
      planEffort: '120 hrs',
      planDuration: '60 days',
      actualEffort: '120 hrs',
      actualDuration: '60 days',
      percentCompletion: 0,
      done: false,
      description: 'Procurement of API, RM & Packaging materials - For Developmental studies.',
      planStart: '2026-01-26',
      planEnd: '2026-03-27',
      actualStart: '2026-01-26',
      actualEnd: '2026-03-27',
      eta: '2026-03-27',
      buffer: '5 days',
      gateName: 'Gate 2',
      gateStatus: 'Approved',
      gateCode: 'Gate 2',
      status: true,
      setupCount: 6,
    },
    {
      stageCode: 'S4',
      name: 'Formulation Development Phase 1: POC completion',
      planEffort: '160 hrs',
      planDuration: '190 days',
      actualEffort: '150 hrs',
      actualDuration: '180 days',
      percentCompletion: 0,
      done: false,
      description: 'Formulation Development Phase 1: POC completion',
      planStart: '2026-03-28',
      planEnd: '2026-10-04',
      actualStart: '2026-03-28',
      actualEnd: '',
      eta: '2026-10-04',
      buffer: '5 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 25,
    },
    {
      stageCode: 'S5',
      name: 'Procurement of API, Raw materials & Packaging materials - For Ebs',
      planEffort: '100 hrs',
      planDuration: '60 days',
      actualEffort: '90 hrs',
      actualDuration: '55 days',
      percentCompletion: 0,
      done: false,
      description: 'Procurement of API, Raw materials & Packaging materials - For Ebs',
      planStart: '2026-05-01',
      planEnd: '2026-06-30',
      actualStart: '2026-05-01',
      actualEnd: '',
      eta: '2026-06-30',
      buffer: '4 days',
      gateName: 'Gate 3',
      gateStatus: 'Pending',
      gateCode: 'Gate 3',
      status: true,
      setupCount: 12,
    },
    {
      stageCode: 'S6',
      name: 'Formulation Development Phase 2: Pilot Bio',
      planEffort: '180 hrs',
      planDuration: '60 days',
      actualEffort: '160 hrs',
      actualDuration: '50 days',
      percentCompletion: 0,
      done: false,
      description: 'Formulation Development Phase 2: Pilot Bio',
      planStart: '2026-06-01',
      planEnd: '2026-07-31',
      actualStart: '2026-06-01',
      actualEnd: '',
      eta: '2026-07-31',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 23,
    },
    {
      stageCode: 'S7',
      name: 'API Method Validation / verification',
      planEffort: '90 hrs',
      planDuration: '30 days',
      actualEffort: '80 hrs',
      actualDuration: '28 days',
      percentCompletion: 0,
      done: false,
      description: 'API Method Validation / verification',
      planStart: '2026-07-01',
      planEnd: '2026-07-31',
      actualStart: '',
      actualEnd: '',
      eta: '2026-07-31',
      buffer: '3 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 3,
    },
    {
      stageCode: 'S8',
      name: 'FP method validation, FP specifications & STP',
      planEffort: '140 hrs',
      planDuration: '60 days',
      actualEffort: '0 hrs',
      actualDuration: '0 days',
      percentCompletion: 0,
      done: false,
      description: 'FP method validation, FP specifications & STP',
      planStart: '2026-08-01',
      planEnd: '2026-09-30',
      actualStart: '',
      actualEnd: '',
      eta: '2026-09-30',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 2,
    },
    {
      stageCode: 'S9',
      name: 'TTD Submission',
      planEffort: '100 hrs',
      planDuration: '10 days',
      actualEffort: '0 hrs',
      actualDuration: '0 days',
      percentCompletion: 0,
      done: false,
      description: 'TTD Submission',
      planStart: '2026-09-01',
      planEnd: '2026-09-10',
      actualStart: '',
      actualEnd: '',
      eta: '2026-09-10',
      buffer: '2 days',
      gateName: 'Gate 4',
      gateStatus: 'Pending',
      gateCode: 'Gate 4',
      status: true,
      setupCount: 6,
    },
    {
      stageCode: 'S10',
      name: 'Exhibit / Submission Batches execution',
      planEffort: '200 hrs',
      planDuration: '190 days',
      actualEffort: '0 hrs',
      actualDuration: '0 days',
      percentCompletion: 0,
      done: false,
      description: 'Exhibit / Submission Batches execution',
      planStart: '2026-09-11',
      planEnd: '2027-03-20',
      actualStart: '',
      actualEnd: '',
      eta: '2027-03-20',
      buffer: '5 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 26,
    },
    {
      stageCode: 'S11',
      name: 'Demonstration-Scale Campaign studies',
      planEffort: '150 hrs',
      planDuration: '92 days',
      actualEffort: '0 hrs',
      actualDuration: '0 days',
      percentCompletion: 0,
      done: false,
      description: 'Demonstration-Scale Campaign studies',
      planStart: '2026-12-01',
      planEnd: '2027-03-03',
      actualStart: '',
      actualEnd: '',
      eta: '2027-03-03',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Pending',
      gateCode: '-',
      status: true,
      setupCount: 2,
    },
    {
      stageCode: 'S12',
      name: 'Dossier preparation and filing',
      planEffort: '160 hrs',
      planDuration: '100 days',
      actualEffort: '0 hrs',
      actualDuration: '0 days',
      percentCompletion: 0,
      done: false,
      description: 'Dossier preparation and filing',
      planStart: '2027-01-05',
      planEnd: '2027-04-15',
      actualStart: '',
      actualEnd: '',
      eta: '2027-04-15',
      buffer: '5 days',
      gateName: 'Gate 5',
      gateStatus: 'Pending',
      gateCode: 'Gate 5',
      status: true,
      setupCount: 4,
    },
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
