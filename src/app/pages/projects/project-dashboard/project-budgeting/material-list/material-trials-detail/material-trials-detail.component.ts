import { Component, OnInit, OnDestroy, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../../services/budgeting.service';
import { MaterialItem, BudgetFilterState } from '../../models/budgeting.models';
import { AddMaterialDialogComponent } from '../add-material-dialog/add-material-dialog.component';
import { DeleteConfirmationComponent } from '../../../../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AddEditTrialDialogComponent, AddEditTrialDialogData } from './add-edit-trial-dialog/add-edit-trial-dialog.component';

export interface TrialCycleRow {
  cycleIndex: number;
  cycleLabel: string;
  inputQty: number;
  cost: number;
}

@Component({
  selector: 'app-material-trials-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './material-trials-detail.component.html',
  styleUrl: './material-trials-detail.component.scss'
})
export class MaterialTrialsDetailComponent implements OnInit, OnDestroy {
  @Input() initialMaterialCode: number | null = null;
  @Input() initialViewMode: 'all' | 'qty' | 'cost' = 'all';
  @Output() back = new EventEmitter<void>();

  protected budgetService = inject(BudgetingService);
  private dialog = inject(MatDialog);

  selectedMaterialCode: number | null = null;
  filterState: BudgetFilterState = { n: null, b: null };

  itemsWithCalc: {
    item: MaterialItem;
    calc: ReturnType<BudgetingService['mlCalc']>;
    isHighlighted: boolean;
  }[] = [];

  private sub = new Subscription();

  ngOnInit(): void {
    if (this.initialMaterialCode != null) {
      this.selectedMaterialCode = this.initialMaterialCode;
    }

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

    // Ensure a material is always selected by default if available
    if (this.selectedMaterialCode == null && list.length > 0) {
      this.selectedMaterialCode = list[0].item.code;
    }
  }

  goBack(): void {
    this.back.emit();
  }

  selectTrialMaterial(code: number | null): void {
    this.selectedMaterialCode = code;
  }

  get selectedMaterialItem(): MaterialItem | undefined {
    if (this.selectedMaterialCode != null) {
      const found = this.budgetService.ml.find(m => m.code === this.selectedMaterialCode);
      if (found) return found;
    }
    return this.itemsWithCalc[0]?.item;
  }

  get selectedMaterialCalc(): ReturnType<BudgetingService['mlCalc']> | undefined {
    if (!this.selectedMaterialItem) return undefined;
    return this.budgetService.mlCalc(this.selectedMaterialItem);
  }

  // Auto-calculated per-cycle rows: Trial 1, Trial 2, Trial 3, ..., Trial 20
  get trialRows(): TrialCycleRow[] {
    const item = this.selectedMaterialItem;
    const calc = this.selectedMaterialCalc;
    if (!item || !calc) return [];

    if (item.customTrials && item.customTrials.length > 0) {
      return item.customTrials.map((t, i) => ({
        cycleIndex: i,
        cycleLabel: `Trial ${i + 1}`,
        inputQty: t.inputQty,
        cost: t.cost
      }));
    }

    const cycleCount = item.cyc || 20;
    const rows: TrialCycleRow[] = [];

    for (let i = 0; i < cycleCount; i++) {
      const inputQty = i === 0 ? item.inq : item.inq2;
      const cost = calc.trials && calc.trials[i] !== undefined ? calc.trials[i] : 0;
      rows.push({
        cycleIndex: i,
        cycleLabel: `Trial ${i + 1}`,
        inputQty,
        cost
      });
    }

    return rows;
  }

  get totalTrialInputQty(): number {
    return this.trialRows.reduce((sum, r) => sum + (r.inputQty || 0), 0);
  }

  get totalTrialCost(): number {
    return this.trialRows.reduce((sum, r) => sum + (r.cost || 0), 0);
  }

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }

  formatDec(val: number | null | undefined): string {
    return this.budgetService.formatCurrencyDec(val);
  }

  private ensureCustomTrials(material: MaterialItem): { inputQty: number; cost: number }[] {
    if (!material.customTrials || material.customTrials.length === 0) {
      const calc = this.budgetService.mlCalc(material);
      const count = material.cyc || 20;
      const list: { inputQty: number; cost: number }[] = [];
      for (let i = 0; i < count; i++) {
        const inputQty = i === 0 ? material.inq : material.inq2;
        const cost = calc.trials && calc.trials[i] !== undefined ? calc.trials[i] : 0;
        list.push({ inputQty, cost });
      }
      material.customTrials = list;
    }
    return material.customTrials;
  }

  // Open separate Add Trial Dialog
  openAddTrialDialog(): void {
    const material = this.selectedMaterialItem;
    if (!material) return;

    const trials = this.ensureCustomTrials(material);
    const nextIndex = trials.length;
    const cycleLabel = `Trial ${nextIndex + 1}`;
    const defaultQty = material.inq2 || material.inq || 0;

    const dialogRef = this.dialog.open(AddEditTrialDialogComponent, {
      width: '540px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: {
        mode: 'add',
        material,
        trialIndex: nextIndex,
        cycleLabel,
        inputQty: defaultQty
      } as AddEditTrialDialogData
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        trials.push({ inputQty: res.inputQty, cost: res.cost });
        material.cyc = trials.length;
        this.budgetService.updateMaterial(material.code, {
          customTrials: trials,
          cyc: material.cyc
        });
        this.computeRows();
      }
    });
  }

  // Open separate Edit Trial Dialog
  openEditTrialDialog(row: TrialCycleRow): void {
    const material = this.selectedMaterialItem;
    if (!material) return;

    const trials = this.ensureCustomTrials(material);

    const dialogRef = this.dialog.open(AddEditTrialDialogComponent, {
      width: '540px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: {
        mode: 'edit',
        material,
        trialIndex: row.cycleIndex,
        cycleLabel: row.cycleLabel,
        inputQty: row.inputQty,
        cost: row.cost
      } as AddEditTrialDialogData
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        trials[row.cycleIndex] = { inputQty: res.inputQty, cost: res.cost };
        if (row.cycleIndex === 0) {
          material.inq = res.inputQty;
        }
        this.budgetService.updateMaterial(material.code, {
          customTrials: trials,
          inq: material.inq
        });
        this.computeRows();
      }
    });
  }

  // Delete specific trial
  deleteTrial(row: TrialCycleRow): void {
    const material = this.selectedMaterialItem;
    if (!material) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: { name: `${row.cycleLabel} of ${material.d}` }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const trials = this.ensureCustomTrials(material);
        trials.splice(row.cycleIndex, 1);
        material.cyc = trials.length;
        if (row.cycleIndex === 0 && trials.length > 0) {
          material.inq = trials[0].inputQty;
        }
        this.budgetService.updateMaterial(material.code, {
          customTrials: trials,
          cyc: material.cyc,
          inq: material.inq
        });
        this.computeRows();
      }
    });
  }

  openEditMaterialDialog(item: MaterialItem): void {
    if (!item) return;
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
    if (!item) return;
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: { name: `${item.d} (${item.code})` }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.budgetService.deleteMaterial(item.code);
        this.computeRows();
        if (this.selectedMaterialCode === item.code) {
          this.selectedMaterialCode = this.itemsWithCalc[0]?.item.code ?? null;
        }
      }
    });
  }
}
