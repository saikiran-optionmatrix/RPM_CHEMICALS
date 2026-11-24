import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  SourcingChecklistService,
  MaterialsPlanRow,
  ProxyProject,
  PROXY_PROJECTS
} from '../sourcing-checklist.service';
import { AddMaterialDialogComponent } from '../add-material-dialog/add-material-dialog.component';

@Component({
  selector: 'app-materials-plan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './materials-plan.component.html',
  styleUrl: './materials-plan.component.scss'
})
export class MaterialsPlanComponent implements OnInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  activeProject: ProxyProject = PROXY_PROJECTS[2];
  planRows: MaterialsPlanRow[] = [];
  freightValues: Record<string, number> = {};

  totalEstimatedCost: number = 0;
  cntApproved: number = 0;
  cntPending: number = 0;
  cntRejected: number = 0;

  private sub = new Subscription();

  constructor(
    private service: SourcingChecklistService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activeProject = this.service.activeProject || PROXY_PROJECTS[2];
    this.loadPlan();

    this.sub.add(
      this.service.activeProject$.subscribe(project => {
        if (project) {
          this.activeProject = project;
          this.loadPlan();
          this.cdr.markForCheck();
        }
      })
    );

    this.sub.add(
      this.service.planData$.subscribe(() => {
        this.loadPlan();
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadPlan(): void {
    if (!this.activeProject) return;
    this.planRows = this.service.getComputedPlanRows(this.activeProject.id);

    this.cntApproved = 0;
    this.cntPending = 0;
    this.cntRejected = 0;
    let sumCost = 0;

    for (const row of this.planRows) {
      if (row.decision === 'Approved') this.cntApproved++;
      else if (row.decision === 'Rejected') this.cntRejected++;
      else this.cntPending++;

      sumCost += (row.cost || 0) + (this.freightValues[row.id] || 0);
    }
    this.totalEstimatedCost = sumCost;
  }

  onFreightChange(rmId: string, val: string): void {
    const num = parseFloat(val) || 0;
    this.freightValues[rmId] = num;
    this.loadPlan();
  }

  formatNum(n: number | undefined): string {
    if (n === undefined || isNaN(n)) return '0';
    return Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  formatCurrency(n: number | undefined): string {
    if (n === undefined || isNaN(n)) return '₹ 0';
    return '₹ ' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  getDecisionLabel(decision: string): string {
    switch (decision) {
      case 'Approved':
        return 'Final budget';
      case 'Pending':
        return 'Forecast';
      case 'Rejected':
        return 'Rejected – re-source';
      default:
        return decision;
    }
  }

  getDecisionPillClass(decision: string): string {
    switch (decision) {
      case 'Approved':
        return 'pill-approved';
      case 'Pending':
        return 'pill-pending';
      case 'Rejected':
        return 'pill-rejected';
      default:
        return '';
    }
  }

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -360, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 360, behavior: 'smooth' });
    }
  }

  navigateToPreQualification(rmId: string): void {
    this.service.setSelectedRm(rmId);
    this.router.navigate(['../pre-qualification'], {
      relativeTo: this.route,
      queryParams: { materialId: rmId },
      queryParamsHandling: 'merge'
    });
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
      this.loadPlan();
    });
  }

  onEditPlanRow(row: MaterialsPlanRow): void {
    const tech = this.service.getTechItems(this.activeProject.id).find(t => t.code === row.id);
    const dialogRef = this.dialog.open(AddMaterialDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        projectId: this.activeProject.id,
        code: row.id,
        name: row.name,
        grade: tech?.grade,
        form: tech?.form,
        markets: tech?.markets,
        poly: tech?.poly,
        uom: row.unit,
        dev: tech?.dev,
        ebpv: tech?.ebpv,
        type: tech?.type,
        psd: tech?.psd,
        cat: tech?.cat,
        notes: tech?.notes,
        qc: row.qc,
        allow: row.allow ? row.allow * 100 : 5,
        stock: row.stock,
        po: row.po,
        moq: row.moq,
        buy: row.buy,
        lead: row.lead,
        price: row.price,
        freight: this.freightValues[row.id] || 0,
        cost: (row.cost || 0) + (this.freightValues[row.id] || 0),
        mfr: row.mfr,
        supplier: row.supplier,
        evidence: row.blocker,
        devActivity: row.wdev
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPlan();
    });
  }
}
