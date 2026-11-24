import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest } from 'rxjs';

import { RldService } from '../services/rld.service';
import { AuditEntry, ProjectMaster } from '../models/rld.models';

@Component({
  selector: 'app-rld-history',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rld-history.component.html',
  styleUrls: ['./rld-history.component.scss']
})
export class RldHistoryComponent implements OnInit {
  activeProject: ProjectMaster | null = null;
  projectAudit: AuditEntry[] = [];

  constructor(public rldService: RldService) {}

  ngOnInit(): void {
    combineLatest([
      this.rldService.activeProject$,
      this.rldService.audit$
    ]).subscribe(([project, audit]) => {
      this.activeProject = project;
      this.projectAudit = audit.filter((a) => a.projectCode === project.code);
    });
  }
}

