import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BudgetingService } from '../services/budgeting.service';
import { BudgetFilterState, RldRow } from '../models/budgeting.models';
import { AddRldDialogComponent } from './add-rld-dialog/add-rld-dialog.component';
import { DeleteConfirmationComponent } from '../../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface RenderedRldRow {
  rawIndex?: number;
  w: string | null;
  kind: string;
  product: string;
  packs: string | number | null;
  cur: string | null;
  costFob: number | null;
  usd: number | null;
  fx: number | null;
  costInr: number | null;
  rowClass: string;
  isHighlighted: boolean;
  canAction?: boolean;
}

@Component({
  selector: 'app-budget-rld',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './budget-rld.component.html',
  styleUrl: './budget-rld.component.scss'
})
export class BudgetRldComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  protected budgetService = inject(BudgetingService);
  private dialog = inject(MatDialog);

  renderedRows: RenderedRldRow[] = [];
  filterState: BudgetFilterState = { n: null, b: null };
  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.budgetService.filter$.subscribe(f => {
        this.filterState = f;
        this.renderTable();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  renderTable(): void {
    const R = this.budgetService.rldCalc();
    const rows = this.budgetService.rld.rows;
    const result: RenderedRldRow[] = [];
    let bi = 0;

    rows.forEach((r, idx) => {
      const w = r.w || null;
      const isHighlighted = !!(w && this.filterState.n && this.budgetService.isUnder(w, this.filterState.n));
      const canAction = ['b', 'fr', 'du', 'be', 'bf', 'bd'].includes(r.k);

      switch (r.k) {
        case 'h':
          result.push({
            rawIndex: idx,
            w: null,
            kind: 'h',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F[0] || 0,
            fx: null,
            costInr: null,
            rowClass: 'header-row',
            isHighlighted: false,
            canAction: false
          });
          break;

        case 'b':
          bi++;
          result.push({
            rawIndex: idx,
            w,
            kind: 'b',
            product: r.b || '',
            packs: r.c ?? null,
            cur: r.d ?? null,
            costFob: r.e ?? null,
            usd: R.F[bi],
            fx: r.g ?? null,
            costInr: R.H[bi],
            rowClass: '',
            isHighlighted,
            canAction
          });
          break;

        case 'fr':
          result.push({
            rawIndex: idx,
            w,
            kind: 'fr',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F[4],
            fx: r.g ?? null,
            costInr: R.H[4],
            rowClass: '',
            isHighlighted,
            canAction
          });
          break;

        case 'du':
          result.push({
            rawIndex: idx,
            w,
            kind: 'du',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F[5],
            fx: r.g ?? null,
            costInr: R.H[5],
            rowClass: '',
            isHighlighted,
            canAction
          });
          break;

        case 'gap':
          result.push({
            rawIndex: idx,
            w: null,
            kind: 'gap',
            product: '',
            packs: '',
            cur: '',
            costFob: null,
            usd: null,
            fx: null,
            costInr: null,
            rowClass: 'gap-row',
            isHighlighted: false,
            canAction: false
          });
          break;

        case 't1':
          result.push({
            rawIndex: idx,
            w: null,
            kind: 't1',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F10,
            fx: null,
            costInr: R.H10,
            rowClass: 'subtotal-row',
            isHighlighted: false,
            canAction: false
          });
          break;

        case 'be':
          result.push({
            rawIndex: idx,
            w: '5.4.5',
            kind: 'be',
            product: r.b || '',
            packs: r.c ?? null,
            cur: r.d ?? null,
            costFob: r.e ?? null,
            usd: R.F12,
            fx: r.g ?? null,
            costInr: null,
            rowClass: '',
            isHighlighted: !!(this.filterState.n && this.budgetService.isUnder('5.4.5', this.filterState.n)),
            canAction
          });
          break;

        case 'bf':
          result.push({
            rawIndex: idx,
            w: '5.4.5',
            kind: 'bf',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F13,
            fx: null,
            costInr: r.h ?? null,
            rowClass: '',
            isHighlighted: !!(this.filterState.n && this.budgetService.isUnder('5.4.5', this.filterState.n)),
            canAction
          });
          break;

        case 'bd':
          result.push({
            rawIndex: idx,
            w: '5.4.5',
            kind: 'bd',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F14,
            fx: null,
            costInr: null,
            rowClass: '',
            isHighlighted: !!(this.filterState.n && this.budgetService.isUnder('5.4.5', this.filterState.n)),
            canAction
          });
          break;

        case 'bt':
          result.push({
            rawIndex: idx,
            w: '5.4.5',
            kind: 'bt',
            product: r.b || '',
            packs: '',
            cur: '',
            costFob: null,
            usd: R.F15,
            fx: r.g ?? null,
            costInr: R.H15,
            rowClass: 'subtotal-row',
            isHighlighted: !!(this.filterState.n && this.budgetService.isUnder('5.4.5', this.filterState.n)),
            canAction: false
          });
          break;

        case 'gt':
          result.push({
            rawIndex: idx,
            w: null,
            kind: 'gt',
            product: r.b || '',
            packs: R.C17,
            cur: '',
            costFob: null,
            usd: R.F17,
            fx: null,
            costInr: null,
            rowClass: 'grandtotal-row',
            isHighlighted: false,
            canAction: false
          });
          break;

        case 'ag': {
          let hv: number | null = null;
          if (r.h != null) {
            hv = r.h;
          } else if (r.hf === 'm35') {
            hv = R.H20;
          } else if (r.hf === 'FA') {
            hv = R.FA;
          } else if (r.hf === 'FB') {
            hv = R.FB;
          } else if (r.hf === 'FC') {
            hv = R.FC;
          } else if (r.hf === 'sumH') {
            hv = R.H24;
          } else if (r.hf === 'net') {
            hv = R.H25;
          }

          const ev = r.ef === 'sumE' ? R.E24 : (r.e ?? null);

          result.push({
            rawIndex: idx,
            w: null,
            kind: 'ag',
            product: r.b || '',
            packs: r.c ?? null,
            cur: '',
            costFob: ev,
            usd: null,
            fx: null,
            costInr: hv,
            rowClass: 'agreement-row',
            isHighlighted: false,
            canAction: false
          });
          break;
        }
      }
    });

    this.renderedRows = result;
  }

  toWbs(w: string | null): void {
    if (w) {
      this.budgetService.toWbs(w);
    }
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

  format(val: number | null | undefined): string {
    return this.budgetService.formatCurrency(val);
  }

  formatDec(val: number | null | undefined): string {
    return this.budgetService.formatCurrencyDec(val);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddRldDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((res: RldRow | undefined) => {
      if (res) {
        this.budgetService.addRldRow(res);
        this.renderTable();
      }
    });
  }

  openEditDialog(row: RenderedRldRow): void {
    if (row.rawIndex === undefined) return;
    const rawRow = this.budgetService.rld.rows[row.rawIndex];
    if (!rawRow) return;

    const dialogRef = this.dialog.open(AddRldDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      autoFocus: false,
      data: { mode: 'edit', row: rawRow }
    });

    dialogRef.afterClosed().subscribe((res: RldRow | undefined) => {
      if (res && row.rawIndex !== undefined) {
        this.budgetService.updateRldRow(row.rawIndex, res);
        this.renderTable();
      }
    });
  }

  deleteRld(row: RenderedRldRow): void {
    if (row.rawIndex === undefined) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: { name: row.product }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && row.rawIndex !== undefined) {
        this.budgetService.deleteRldRow(row.rawIndex);
        this.renderTable();
      }
    });
  }
}
