import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  SourcingChecklistService,
  TechMaterial,
  ProxyProject,
  PROXY_PROJECTS
} from '../sourcing-checklist.service';
import { AddMaterialDialogComponent } from '../add-material-dialog/add-material-dialog.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-sourcing-checklist-items',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './sourcing-checklist-items.component.html',
  styleUrl: './sourcing-checklist-items.component.scss'
})
export class SourcingChecklistItemsComponent implements OnInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  activeProject: ProxyProject = PROXY_PROJECTS[2];
  items: TechMaterial[] = [];
  private sub = new Subscription();

  constructor(
    private service: SourcingChecklistService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activeProject = this.service.activeProject || PROXY_PROJECTS[2];
    this.loadItems();

    this.sub.add(
      this.service.activeProject$.subscribe(project => {
        if (project) {
          this.activeProject = project;
          this.loadItems();
        }
      })
    );

    this.sub.add(
      this.service.techData$.subscribe(() => {
        this.loadItems();
      })
    );
  }

  loadItems(): void {
    if (this.activeProject) {
      this.items = this.service.getTechItems(this.activeProject.id);
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openAddMaterialDialog(): void {
    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        projectId: this.activeProject.id
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadItems();
    });
  }

  onEdit(item: TechMaterial): void {
    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        ...item,
        projectId: this.activeProject.id
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadItems();
    });
  }

  onDelete(item: TechMaterial): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.service.deleteTechMaterial(item.code, this.activeProject.id);
      }
    });
  }

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }
}
