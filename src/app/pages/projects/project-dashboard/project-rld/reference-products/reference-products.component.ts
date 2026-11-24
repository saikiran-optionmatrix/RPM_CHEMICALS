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
import { ComputedComparator, ProjectMaster } from '../models/rld.models';
import { AddRldComparatorComponent } from '../dialogs/add-rld-comparator/add-rld-comparator.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-reference-products',
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
  templateUrl: './reference-products.component.html',
  styleUrls: ['./reference-products.component.scss']
})
export class ReferenceProductsComponent implements OnInit {
  activeProject: ProjectMaster | null = null;
  allProjectComparators: ComputedComparator[] = [];

  // Filter state
  showFilter = false;
  keyword = '';
  selectedMarket = '';
  selectedRa = '';

  searchKeyword = '';
  searchMarket = '';
  searchRa = '';

  // Pagination
  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public rldService: RldService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    combineLatest([this.rldService.activeProject$, this.rldService.computedComparators$]).subscribe(
      ([project, cmps]) => {
        this.activeProject = project;
        this.allProjectComparators = cmps.filter((c) => c.p === project.code);
      }
    );
  }

  get filteredComparators(): ComputedComparator[] {
    return this.allProjectComparators.filter((c) => {
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        const matchesBrand = c.brand.toLowerCase().includes(kw);
        const matchesId = c.id.toLowerCase().includes(kw);
        const matchesMfr = c.mfr.toLowerCase().includes(kw);
        const matchesIdNo = c.idNo.toLowerCase().includes(kw);
        if (!matchesBrand && !matchesId && !matchesMfr && !matchesIdNo) {
          return false;
        }
      }
      if (this.searchMarket && c.market !== this.searchMarket) {
        return false;
      }
      if (this.searchRa && c.ra !== this.searchRa) {
        return false;
      }
      return true;
    });
  }

  get paginatedComparators(): ComputedComparator[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredComparators.slice(start, start + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchMarket = this.selectedMarket;
    this.searchRa = this.selectedRa;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.selectedMarket = '';
    this.selectedRa = '';
    this.searchKeyword = '';
    this.searchMarket = '';
    this.searchRa = '';
    this.pageIndex = 0;
  }

  handlePage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }



  openAddDialog(): void {
    if (!this.activeProject) return;
    const ref = this.dialog.open(AddRldComparatorComponent, {
      width: '880px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        project: this.activeProject
      }
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.rldService.addComparator(res);
      }
    });
  }

  openEditDialog(item: ComputedComparator): void {
    if (!this.activeProject) return;
    const ref = this.dialog.open(AddRldComparatorComponent, {
      width: '880px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        comparator: item,
        project: this.activeProject
      }
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.rldService.updateComparator(res);
      }
    });
  }

  deleteComparator(item: ComputedComparator): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      data: {
        title: 'Delete Reference Product',
        message: `Are you sure you want to delete comparator "${item.brand}" (${item.id})?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.rldService.deleteComparator(item.id);
      }
    });
  }



}

