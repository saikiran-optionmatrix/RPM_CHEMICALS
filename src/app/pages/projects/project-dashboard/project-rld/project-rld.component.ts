import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RldService } from './services/rld.service';
import { ProjectMaster, RldKpis } from './models/rld.models';

@Component({
  selector: 'app-project-rld',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './project-rld.component.html',
  styleUrls: ['./project-rld.component.scss']
})
export class ProjectRldComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('scrollContainer') scrollContainer?: ElementRef;

  activeProject: ProjectMaster | null = null;
  allProjects: ProjectMaster[] = [];
  kpis: RldKpis = {
    approvedComparators: '0 / 0',
    approvedCount: 0,
    comparatorTotal: 0,
    totalRequirement: 0,
    reqCount: 0,
    allocatedUsable: 0,
    shortfall: 0,
    nextOpenNeedDate: '—',
    openReqsCount: 0,
    alertsCount: 0,
    highAlertsCount: 0,
    landedVsBudget: 0,
    lotsCount: 0,
    procCount: 0
  };

  projectName = 'Acrylic Emulsion Binder 50% Solids';
  projectCode = '2026/CHM/001';

  constructor(
    public rldService: RldService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Watch all projects & active project
    combineLatest([
      this.rldService.projects$,
      this.rldService.activeProject$,
      this.rldService.projectKpis$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([projects, active, kpis]) => {
        this.allProjects = projects;
        this.activeProject = active;
        this.kpis = kpis;
        if (active) {
          this.projectName = active.name;
          this.projectCode = active.code;
        }
      });

    // Check query params to sync selected project code
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const code = params['projectCode'] || params['code'];
      if (code && (!this.activeProject || this.activeProject.code !== code)) {
        this.rldService.setActiveProject(code);
      }
    });
  }

  onProjectChange(code: string): void {
    if (!code) return;
    this.rldService.setActiveProject(code);
    const selected = this.allProjects.find((p) => p.code === code);
    if (selected) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          projectCode: selected.code,
          projectName: selected.name
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // --- Scrolling logic ---
  scrollLeft(): void {
    const el = this.scrollContainer?.nativeElement || (document.querySelector('.rld-screen-content .table-responsive') as HTMLElement);
    if (el) {
      el.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const el = this.scrollContainer?.nativeElement || (document.querySelector('.rld-screen-content .table-responsive') as HTMLElement);
    if (el) {
      el.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
