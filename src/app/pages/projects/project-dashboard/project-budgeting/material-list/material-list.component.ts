import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';
import { MaterialItem, BudgetFilterState } from '../models/budgeting.models';
import { AddMaterialDialogComponent } from './add-material-dialog/add-material-dialog.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';
import { MaterialTrialsDetailComponent } from './material-trials-detail/material-trials-detail.component';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MaterialTrialsDetailComponent
  ],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss'
})
export class MaterialListComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  protected budgetService = inject(BudgetingService);
  private dialog = inject(MatDialog);

  // Inner screen state
  isTrialDetailView = false;
  selectedMaterialCode: number | null = null;
  trialViewMode: 'all' | 'qty' | 'cost' = 'all';

  filterState: BudgetFilterState = { n: null, b: null };

  itemsWithCalc: {
    item: MaterialItem;
    calc: ReturnType<BudgetingService['mlCalc']>;
    isHighlighted: boolean;
  }[] = [];

  totalAI = 0;
  totalAL = 0;
  totalAO = 0;
  trialTotal1 = 0;

  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.budgetService.filter$.subscribe(f => {
        this.filterState = f;
        this.computeRows();
      })
    );

    this.sub.add(
      this.budgetService.dataUpdated$.subscribe(() => {
        this.computeRows();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  computeRows(): void {
    const list = this.budgetService.ml.map(m => {
      const calc = this.budgetService.mlCalc(m);
      const isHighlighted = !!(
        this.filterState.n &&
        (this.budgetService.isUnder(m.wdev, this.filterState.n) ||
          this.budgetService.isUnder(m.wsu, this.filterState.n))
      );
      return { item: m, calc, isHighlighted };
    });

    this.itemsWithCalc = list;

    // Totals
    this.totalAI = list.reduce((a, b) => a + b.calc.AI, 0);
    this.totalAL = list.reduce((a, b) => a + b.calc.AL, 0);
    this.totalAO = list.reduce((a, b) => a + b.calc.AO, 0);
    this.trialTotal1 = list.reduce((sum, r) => sum + (r.calc.trials[0] || 0), 0);
  }

  // Navigation to and from the Inner Trial Details Screen
  openTrialDetails(item?: MaterialItem, mode: 'all' | 'qty' | 'cost' = 'all'): void {
    this.selectedMaterialCode = item ? item.code : null;
    this.trialViewMode = mode;
    this.isTrialDetailView = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeTrialDetails(): void {
    this.isTrialDetailView = false;
    this.selectedMaterialCode = null;
    this.trialViewMode = 'all';
  }

  toWbs(w: string): void {
    this.budgetService.toWbs(w);
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }

  formatDec(val: number | null | undefined): string {
    return this.budgetService.formatCurrencyDec(val);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((res: MaterialItem | undefined) => {
      if (res) {
        this.budgetService.addMaterial(res);
        this.computeRows();
      }
    });
  }

  openEditDialog(item: MaterialItem): void {
    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: { mode: 'edit', item }
    });

    dialogRef.afterClosed().subscribe((res: MaterialItem | undefined) => {
      if (res) {
        this.budgetService.updateMaterial(item.code, res);
        this.computeRows();
      }
    });
  }

  deleteMaterial(item: MaterialItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: { name: `${item.d} (${item.code})` }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.budgetService.deleteMaterial(item.code);
        this.computeRows();
      }
    });
  }
}
