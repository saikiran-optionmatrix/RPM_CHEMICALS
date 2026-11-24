import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';

import { RldService } from '../services/rld.service';
import {
  ComputedAllocation,
  ComputedComparator,
  ComputedLot,
  ComputedRequirement,
  ProjectMaster,
  StockTransaction
} from '../models/rld.models';
import { RequestAllocationComponent } from '../dialogs/request-allocation/request-allocation.component';
import { RldQaDispositionComponent } from '../dialogs/rld-qa-disposition/rld-qa-disposition.component';

@Component({
  selector: 'app-stock-allocation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './stock-allocation.component.html',
  styleUrls: ['./stock-allocation.component.scss']
})
export class StockAllocationComponent implements OnInit {
  activeProject: ProjectMaster | null = null;
  projectPools: string[] = [];

  availableLots: ComputedLot[] = [];
  projectAllocations: ComputedAllocation[] = [];
  projectRequirements: ComputedRequirement[] = [];
  projectTransactions: StockTransaction[] = [];

  constructor(
    public rldService: RldService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.rldService.activeProject$,
      this.rldService.computedComparators$,
      this.rldService.computedLots$,
      this.rldService.computedAllocations$,
      this.rldService.computedRequirements$,
      this.rldService.transactions$
    ]).subscribe(([project, cmps, lots, allocs, reqs, txs]) => {
      this.activeProject = project;
      const projectCmps = cmps.filter((c) => c.p === project.code);
      this.projectPools = Array.from(new Set(projectCmps.map((c) => c.pool)));

      this.availableLots = lots.filter((l) => this.projectPools.includes(l.pool));
      this.projectAllocations = allocs.filter((a) => a.proj === project.code);
      this.projectRequirements = reqs.filter((r) => r.proj === project.code);
      this.projectTransactions = txs.filter((t) => t.proj === project.code);
    });
  }

  openAllocationDialog(): void {
    const ref = this.dialog.open(RequestAllocationComponent, {
      width: '750px',
      maxWidth: '95vw',
      data: {
        requirements: this.projectRequirements,
        lots: this.availableLots
      }
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.rldService.addAllocation(res.lotId, res.reqId, res.quantity, res.requestedBy);
      }
    });
  }

  openQaDialog(lot: ComputedLot): void {
    const ref = this.dialog.open(RldQaDispositionComponent, {
      width: '780px',
      maxWidth: '95vw',
      data: { lot }
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.rldService.updateQaDisposition(lot.id, res.checks, res.disposition, res.qaRef, res.qaBy);
      }
    });
  }

  getTransactionsForAllocation(alloc: ComputedAllocation, type: string): StockTransaction[] {
    return this.projectTransactions.filter(
      (t) => t.req === alloc.req && t.lot === alloc.lot && t.t === type && t.chk === 'OK'
    );
  }
}

