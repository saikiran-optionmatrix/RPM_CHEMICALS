import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { combineLatest } from 'rxjs';

import { RldService } from '../services/rld.service';
import { ComputedProcurement, ProjectMaster } from '../models/rld.models';

@Component({
  selector: 'app-procurement-cost',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './procurement-cost.component.html',
  styleUrls: ['./procurement-cost.component.scss']
})
export class ProcurementCostComponent implements OnInit {
  activeProject: ProjectMaster | null = null;
  projectProcurements: ComputedProcurement[] = [];

  constructor(
    public rldService: RldService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.rldService.activeProject$,
      this.rldService.computedProcurement$
    ]).subscribe(([project, procs]) => {
      this.activeProject = project;
      this.projectProcurements = procs.filter((p) => p.proj === project.code);
    });
  }

  goToBudgeting(): void {
    if (this.activeProject) {
      this.router.navigate(['/projects/dashboard/budgeting'], {
        queryParams: {
          projectCode: this.activeProject.code,
          projectName: this.activeProject.name
        }
      });
    }
  }


}

