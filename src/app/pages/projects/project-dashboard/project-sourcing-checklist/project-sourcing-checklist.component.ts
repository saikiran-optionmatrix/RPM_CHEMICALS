import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  SourcingChecklistService,
  ProxyProject,
  PROXY_PROJECTS
} from './sourcing-checklist.service';

@Component({
  selector: 'app-project-sourcing-checklist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './project-sourcing-checklist.component.html',
  styleUrl: './project-sourcing-checklist.component.scss'
})
export class ProjectSourcingChecklistComponent implements OnInit, OnDestroy {
  allProjects: ProxyProject[] = PROXY_PROJECTS;
  activeProject: ProxyProject = PROXY_PROJECTS[2]; // Default P3-LEU matching img1

  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';

  showWbsDetails: boolean = false;
  activeTab: 'items' | 'materials-plan' | 'pre-qualification' = 'items';

  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SourcingChecklistService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    // Immediate initialization from service
    this.activeProject = this.service.activeProject || PROXY_PROJECTS[2];

    this.sub.add(
      this.route.queryParams.subscribe(params => {
        const paramName = params['projectName'] || params['name'];
        const paramCode = params['projectCode'] || params['code'];

        if (paramName) this.projectName = paramName;
        if (paramCode) this.projectCode = paramCode;
        this.cdr.markForCheck();
      })
    );

    this.sub.add(
      this.service.activeProject$.subscribe(proj => {
        if (proj) {
          this.activeProject = proj;
          this.cdr.markForCheck();
        }
      })
    );

    this.updateActiveTabFromUrl();

    this.sub.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateActiveTabFromUrl();
          this.cdr.markForCheck();
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private updateActiveTabFromUrl(): void {
    const url = this.router.url;
    if (url.includes('materials-plan')) {
      this.activeTab = 'materials-plan';
    } else if (url.includes('pre-qualification')) {
      this.activeTab = 'pre-qualification';
    } else {
      this.activeTab = 'items';
    }
  }

  selectTab(tab: 'items' | 'materials-plan' | 'pre-qualification'): void {
    this.activeTab = tab;
    this.router.navigate([tab], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve'
    });
  }

  onSelectProject(projectId: string): void {
    this.service.setActiveProject(projectId);
  }

  toggleWbsDetails(): void {
    this.showWbsDetails = !this.showWbsDetails;
  }
}
