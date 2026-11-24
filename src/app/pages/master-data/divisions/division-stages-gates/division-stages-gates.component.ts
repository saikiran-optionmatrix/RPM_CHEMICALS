import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReorderConfirmationComponent } from '../../../../common/shared/reorder-confirmation/reorder-confirmation.component';

export interface DivisionStageGateRow {
  sequence: string;
  stageCode: string;
  stageName: string;
  selectedGate: string;
  lastUpdated: string;
  updatedBy: string;
  historyCount: number;
}

@Component({
  selector: 'app-division-stages-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './division-stages-gates.component.html',
  styleUrl: './division-stages-gates.component.scss',
})
export class DivisionStagesGatesComponent implements OnInit {
  divisionName = 'Specialty Chemicals';
  divisionCode = 'OS';
  stageGates = '7(3)';

  readonly availableGateOptions: string[] = [
    'Gate 1',
    'Gate 2',
    'Gate 3',
    'Gate 4',
    'Gate 5',
    'Gate 6',
    'Gate 7',
  ];

  readonly allMasterStages = [
    { sequence: '1.0', stageCode: 'S1', stageName: 'Business Case' },
    { sequence: '2.0', stageCode: 'S2', stageName: 'Product Initiation' },
    { sequence: '3.0', stageCode: 'S3', stageName: 'Development Procurement' },
    { sequence: '4.0', stageCode: 'S4', stageName: 'POC Formulation' },
    { sequence: '5.0', stageCode: 'S5', stageName: 'EB Procurement' },
    { sequence: '6.0', stageCode: 'S6', stageName: 'Pilot Bio Formulation' },
    { sequence: '7.0', stageCode: 'S7', stageName: 'API Validation' },
    { sequence: '8.0', stageCode: 'S8', stageName: 'FP Validation' },
    { sequence: '9.0', stageCode: 'S9', stageName: 'TTD Submission' },
    { sequence: '10.0', stageCode: 'S10', stageName: 'Exhibit Batches' },
    { sequence: '11.0', stageCode: 'S11', stageName: 'Demonstration-Scale Campaign' },
  ];

  stageRows: DivisionStageGateRow[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['divisionName']) this.divisionName = params['divisionName'];
      if (params['divisionCode']) this.divisionCode = params['divisionCode'];
      if (params['stageGates']) this.stageGates = params['stageGates'];
      this.loadStageGateAllocations();
    });
  }

  loadStageGateAllocations(): void {
    const saved = sessionStorage.getItem(`division_stages_gates_${this.divisionCode}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.stageRows) && parsed.stageRows.length > 0) {
          this.stageRows = parsed.stageRows;
          if (parsed.stageGates) {
            this.stageGates = parsed.stageGates;
          }
          this.cdr.detectChanges();
          return;
        }
      } catch (e) {
        // Fall back to default
      }
    }

    // Parse stageGates e.g. "7(3)" -> 7 stages, 3 gates allocated
    const match = (this.stageGates || '').match(/^(\d+)\((\d+)\)$/);
    const totalStages = match ? parseInt(match[1], 10) : 7;
    const gatesCount = match ? parseInt(match[2], 10) : 3;

    const selectedMaster = this.allMasterStages.slice(
      0,
      Math.min(totalStages, this.allMasterStages.length)
    );
    const gateAssignments = this.getDefaultGateAssignments(selectedMaster.length, gatesCount);

    const sampleDates = [
      '15-Feb-2026 10:30 AM',
      '12-Feb-2026 02:45 PM',
      '10-Feb-2026 11:15 AM',
      '05-Feb-2026 04:20 PM',
      '30-Jan-2026 09:00 AM',
      '28-Jan-2026 03:30 PM',
      '25-Jan-2026 01:10 PM',
      '20-Jan-2026 11:00 AM',
      '15-Jan-2026 04:30 PM',
      '10-Jan-2026 02:15 PM',
      '05-Jan-2026 10:00 AM',
    ];
    const sampleUsers = [
      'Dr. Sarah Jenkins',
      'Rajesh Kumar',
      'Anita Desai',
      'Priya Reddy',
      'Suresh Naidu',
      'Amit Patel',
    ];
    const sampleHistory = [4, 2, 5, 1, 3, 6, 4, 2, 5, 3, 2];

    this.stageRows = selectedMaster.map((stg, idx) => ({
      sequence: stg.sequence,
      stageCode: stg.stageCode,
      stageName: stg.stageName,
      selectedGate: gateAssignments[idx] || '-',
      lastUpdated: sampleDates[idx % sampleDates.length],
      updatedBy: sampleUsers[idx % sampleUsers.length],
      historyCount: sampleHistory[idx % sampleHistory.length],
    }));

    this.updateAllocatedGatesCount();
    this.cdr.detectChanges();
  }

  getDefaultGateAssignments(numStages: number, gatesCount: number): string[] {
    const assignments: string[] = new Array(numStages).fill('-');
    if (gatesCount <= 0) return assignments;

    if (gatesCount === 3 && numStages >= 4) {
      assignments[0] = 'Gate 1';
      assignments[1] = 'Gate 2';
      assignments[3] = 'Gate 3';
      return assignments;
    }
    if (gatesCount === 4 && numStages >= 5) {
      assignments[0] = 'Gate 1';
      assignments[1] = 'Gate 2';
      assignments[3] = 'Gate 3';
      assignments[4] = 'Gate 4';
      return assignments;
    }
    if (gatesCount === 2 && numStages >= 2) {
      assignments[0] = 'Gate 1';
      assignments[1] = 'Gate 2';
      return assignments;
    }

    for (let k = 0; k < Math.min(gatesCount, numStages, 7); k++) {
      assignments[k] = `Gate ${k + 1}`;
    }
    return assignments;
  }

  parseGateNumber(gateStr: string): number {
    if (!gateStr || gateStr === '-') return 0;
    const match = gateStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  isGateBlocked(stageIndex: number, gate: string): boolean {
    if (!gate || gate === '-') return false;
    const gateNum = this.parseGateNumber(gate);
    if (!gateNum) return false;

    // Find the highest gate assigned to any preceding stage
    let maxPrevGate = 0;
    for (let k = 0; k < stageIndex; k++) {
      const g = this.stageRows[k]?.selectedGate;
      if (g && g !== '-') {
        const num = this.parseGateNumber(g);
        if (num > maxPrevGate) {
          maxPrevGate = num;
        }
      }
    }

    return gateNum <= maxPrevGate;
  }

  onGateChange(stageIndex: number, newGate: string): void {
    const now = this.formatCurrentDateTime();
    this.stageRows[stageIndex].selectedGate = newGate;
    this.stageRows[stageIndex].lastUpdated = now;
    this.stageRows[stageIndex].updatedBy = 'Dr. Sarah Jenkins';

    if (newGate && newGate !== '-') {
      const selectedNum = this.parseGateNumber(newGate);
      for (let m = stageIndex + 1; m < this.stageRows.length; m++) {
        const downstreamGate = this.stageRows[m].selectedGate;
        if (downstreamGate && downstreamGate !== '-') {
          const downstreamNum = this.parseGateNumber(downstreamGate);
          if (downstreamNum <= selectedNum) {
            this.stageRows[m].selectedGate = '-';
            this.stageRows[m].lastUpdated = now;
          }
        }
      }
    }

    this.stageRows = [...this.stageRows];
    this.updateAllocatedGatesCount();
    this.cdr.detectChanges();
  }

  onClearGates(): void {
    const dialogRef = this.dialog.open(ReorderConfirmationComponent, {
      width: '420px',
      data: {
        title: 'Clear Gates Confirmation',
        message:
          'Are you sure you want to clear all assigned gates for this division? This will reset all gate allocations to none.',
        confirmText: 'Yes',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        const now = this.formatCurrentDateTime();
        this.stageRows = this.stageRows.map((row) => ({
          ...row,
          selectedGate: '-',
          lastUpdated: now,
          updatedBy: 'Dr. Sarah Jenkins',
        }));
        this.updateAllocatedGatesCount();
        this.cdr.detectChanges();
      }
    });
  }

  updateAllocatedGatesCount(): void {
    const assignedGatesCount = this.stageRows.filter(
      (r) => r.selectedGate && r.selectedGate !== '-'
    ).length;
    this.stageGates = `${this.stageRows.length}(${assignedGatesCount})`;

    sessionStorage.setItem(
      `division_stages_gates_${this.divisionCode}`,
      JSON.stringify({
        divisionCode: this.divisionCode,
        divisionName: this.divisionName,
        stageGates: this.stageGates,
        stageRows: this.stageRows,
      })
    );
  }

  onSave(): void {
    this.updateAllocatedGatesCount();
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/master-data/divisions']);
  }

  openHistory(row: DivisionStageGateRow): void {
    this.router.navigate(['/stages/history'], {
      queryParams: {
        stageName: row.stageName,
        stageCode: row.stageCode,
        sequence: row.sequence,
        gateCode: row.selectedGate,
        division: `${this.divisionName} - ${this.divisionCode}`,
        historyCount: row.historyCount,
      },
    });
  }

  private formatCurrentDateTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${day}-${month}-${year} ${strHours}:${minutes} ${ampm}`;
  }
}
