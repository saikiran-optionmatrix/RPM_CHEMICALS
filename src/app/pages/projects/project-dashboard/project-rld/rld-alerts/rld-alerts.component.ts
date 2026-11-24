import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { combineLatest } from 'rxjs';

import { RldService } from '../services/rld.service';
import { ProjectMaster, RldAlert } from '../models/rld.models';

@Component({
  selector: 'app-rld-alerts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './rld-alerts.component.html',
  styleUrls: ['./rld-alerts.component.scss']
})
export class RldAlertsComponent implements OnInit {
  activeProject: ProjectMaster | null = null;
  projectAlerts: RldAlert[] = [];

  constructor(public rldService: RldService) {}

  ngOnInit(): void {
    combineLatest([
      this.rldService.activeProject$,
      this.rldService.computedAlerts$
    ]).subscribe(([project, alerts]) => {
      this.activeProject = project;
      this.projectAlerts = alerts.filter((a) => a.r.proj === project.code);
    });
  }

  updateActionStatus(alert: RldAlert, newStatus: string): void {
    this.rldService.updateAction(alert.r.id, alert.action, alert.due, newStatus);
  }
}

