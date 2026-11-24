import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';

import { RldService } from '../services/rld.service';
import { ComputedComparator, ComputedRequirement, ProjectMaster, UtilisationRequirement } from '../models/rld.models';
import { AddUtilisationActivityComponent } from '../dialogs/add-utilisation-activity/add-utilisation-activity.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-utilisation-breakup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './utilisation-breakup.component.html',
  styleUrls: ['./utilisation-breakup.component.scss']
})
export class UtilisationBreakupComponent implements OnInit {
  activeProject: ProjectMaster | null = null;
  projectComparators: ComputedComparator[] = [];
  allProjectRequirements: ComputedRequirement[] = [];

  // Filter states
  showFilter = false;
  keyword = '';
  selectedCategory = '';
  selectedStatus = '';

  searchKeyword = '';
  searchCategory = '';
  searchStatus = '';

  // Pagination
  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public rldService: RldService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.rldService.activeProject$,
      this.rldService.computedComparators$,
      this.rldService.computedRequirements$
    ]).subscribe(([project, cmps, reqs]) => {
      this.activeProject = project;
      this.projectComparators = cmps.filter((c) => c.p === project.code);
      this.allProjectRequirements = reqs.filter((r) => r.proj === project.code);
    });
  }

  get filteredRequirements(): ComputedRequirement[] {
    return this.allProjectRequirements.filter((r) => {
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        const matchesAct = r.act.toLowerCase().includes(kw);
        const matchesWbs = r.wbs.toLowerCase().includes(kw);
        const matchesId = r.id.toLowerCase().includes(kw);
        const matchesOwner = r.owner.toLowerCase().includes(kw);
        if (!matchesAct && !matchesWbs && !matchesId && !matchesOwner) {
          return false;
        }
      }
      if (this.searchCategory && r.cat !== this.searchCategory) {
        return false;
      }
      if (this.searchStatus && r.status !== this.searchStatus) {
        return false;
      }
      return true;
    });
  }

  get paginatedRequirements(): ComputedRequirement[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredRequirements.slice(start, start + this.pageSize);
  }

  get sumRd(): number {
    return this.allProjectRequirements
      .filter((r) => r.cat === 'R&D')
      .reduce((sum, r) => sum + r.total, 0);
  }

  get sumPe(): number {
    return this.allProjectRequirements
      .filter((r) => r.cat === 'PE')
      .reduce((sum, r) => sum + r.total, 0);
  }

  get sumBe(): number {
    return this.allProjectRequirements
      .filter((r) => r.cat === 'BE')
      .reduce((sum, r) => sum + r.total, 0);
  }

  get sumTotal(): number {
    return this.allProjectRequirements.reduce((sum, r) => sum + r.total, 0);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchCategory = this.selectedCategory;
    this.searchStatus = this.selectedStatus;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.searchKeyword = '';
    this.searchCategory = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }



  openAddDialog(): void {
    const ref = this.dialog.open(AddUtilisationActivityComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        comparators: this.projectComparators
      }
    });

    ref.afterClosed().subscribe((res: UtilisationRequirement | null) => {
      if (res) {
        this.rldService.addRequirement(res);
      }
    });
  }

  openEditDialog(item: ComputedRequirement): void {
    const ref = this.dialog.open(AddUtilisationActivityComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        requirement: item,
        comparators: this.projectComparators
      }
    });

    ref.afterClosed().subscribe((res: UtilisationRequirement | null) => {
      if (res) {
        this.rldService.updateRequirement(res);
      }
    });
  }

  deleteRequirement(item: ComputedRequirement): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      data: {
        title: 'Delete Activity Requirement',
        message: `Are you sure you want to delete requirement "${item.act}" (${item.id})?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.rldService.deleteRequirement(item.id);
      }
    });
  }
}

