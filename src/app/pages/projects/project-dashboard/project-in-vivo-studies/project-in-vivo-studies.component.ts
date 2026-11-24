import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddInVivoStudiesComponent } from './add-in-vivo-studies/add-in-vivo-studies.component';
import {
  getInVivoLifecycleClass,
  getInVivoProjectMaster,
  getInVivoRagClass,
  getInVivoStudiesForProject,
  getNextInVivoStudyNumber,
  IN_VIVO_STUDIES_DATA,
  InVivoProjectMaster,
  InVivoStudyItem
} from './in-vivo-studies.data';

@Component({
  selector: 'app-project-in-vivo-studies',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './project-in-vivo-studies.component.html',
  styleUrl: './project-in-vivo-studies.component.scss',
})
export class ProjectInVivoStudiesComponent implements OnInit {
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/001';
  currentMaster?: InVivoProjectMaster;

  readonly lifecycleSteps: readonly number[] = [1, 2, 3, 4, 5, 6];

  studies: InVivoStudyItem[] = [];

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const paramName = params['projectName'] || params['name'];
      const paramCode = params['projectCode'] || params['code'];

      if (paramName) this.projectName = paramName;
      if (paramCode) this.projectCode = paramCode;

      this.syncProjectData(paramCode, paramName);
    });
  }

  private syncProjectData(code?: string, name?: string): void {
    this.currentMaster = getInVivoProjectMaster(code, name);
    if (this.currentMaster) {
      this.projectCode = this.currentMaster.projectCode;
      this.projectName = this.currentMaster.projectName;
    }

    this.studies = [...getInVivoStudiesForProject(this.projectCode, this.projectName)];
    this.pageIndex = 0;
  }

  get paginatedStudies(): InVivoStudyItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.studies.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addInVivoStudies(): void {
    const dialogRef = this.dialog.open(AddInVivoStudiesComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        projectCode: this.projectCode,
        projectName: this.projectName,
        availableMarkets: this.currentMaster?.targetMarkets,
        nextStudyNumber: getNextInVivoStudyNumber([...IN_VIVO_STUDIES_DATA, ...this.studies])
      }
    });

    dialogRef.afterClosed().subscribe((result?: InVivoStudyItem) => {
      if (result) {
        IN_VIVO_STUDIES_DATA.push(result);
        this.studies = [...this.studies, result];
      }
    });
  }

  readonly getLifecycleClass = getInVivoLifecycleClass;
  readonly getRagClass = getInVivoRagClass;

  openStudyDetails(item: InVivoStudyItem): void {
    this.router.navigate(['/projects/dashboard/clinical-trials/details'], {
      queryParams: {
        projectCode: this.projectCode,
        projectName: this.projectName,
        studyId: item.studyId,
        tab: 'identification'
      },
      queryParamsHandling: 'merge'
    });
  }

  getVarianceClass(variance: string): string {
    const trimmed = (variance || '').trim();
    if (trimmed.startsWith('+') && !trimmed.startsWith('+0')) return 'variance-late';
    if (trimmed.startsWith('-')) return 'variance-ahead';
    return 'variance-neutral';
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParamsHandling: 'preserve'
    });
  }
}
