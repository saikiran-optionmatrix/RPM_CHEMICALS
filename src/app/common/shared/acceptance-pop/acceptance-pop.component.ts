import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface AcceptanceItem {
  id: number;
  workflow: 'Reviewer' | 'Approver' | string;
  name: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
  rejectionReason?: string;
}

@Component({
  selector: 'app-acceptance-pop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './acceptance-pop.component.html',
  styleUrl: './acceptance-pop.component.scss',
})
export class AcceptancePopComponent implements OnInit {
  title: string = 'Acceptance';

    readonly rejectionReasons: string[] = [
    'Process safety, REACH/TSCA or regulatory compliance gap',
    'Reaction calorimetry, thermal runaway or explosion hazard open',
    'Process Hazard Analysis (HAZOP / LOPA) action items incomplete',
    'Chemical SDS, GHS classification or toxicological package pending',
    'Raw material monomer purity, assay or supplier qualification not met',
    'Bench-scale yield or selectivity below target threshold',
    'Pilot plant campaign or demonstration batch quality criteria not met',
    'Effluent treatment, VOC emission or waste neutralization plan unapproved',
    'Mass and energy balance or basis of design documentation unconfirmed',
    'Analytical method validation or purity assay protocol incomplete',
    'Equipment metallurgy or corrosion resistance qualification pending',
    'Cost of manufacturing (COM) or capital expenditure (CAPEX) variance exceeded',
    'Evidence document incomplete or not under document control',
    'Customer specification or grade qualification benchmark not met',
    'Timeline or engineering resource plan not confirmed',
    'Needs clarification from chemical process owner'
  ];

    acceptanceList: AcceptanceItem[] = [
    { id: 1, workflow: 'Reviewer', name: 'Dr. Sarah Jenkins', status: 'Accepted' },
    { id: 2, workflow: 'Reviewer', name: 'Alex Rivera', status: 'Accepted' },
    { id: 3, workflow: 'Reviewer', name: 'Michael Chang', status: 'Accepted' },
    { id: 4, workflow: 'Reviewer', name: 'Dr. Priya Nair', status: 'Accepted' },
    { id: 5, workflow: 'Reviewer', name: 'Emily Watson', status: 'Accepted' },
    { id: 6, workflow: 'Reviewer', name: 'Marcus Vance', status: 'Rejected', rejectionReason: 'Process Hazard Analysis (HAZOP / LOPA) action items incomplete' },
    { id: 7, workflow: 'Approver', name: 'David Miller', status: 'Rejected', rejectionReason: 'Cost of manufacturing (COM) or capital expenditure (CAPEX) variance exceeded' }
  ];

  constructor(
    @Optional() private dialogRef?: MatDialogRef<AcceptancePopComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

    ngOnInit(): void {
    if (this.data?.title) {
      this.title = this.data.title;
    }
    if (this.data?.acceptanceList && Array.isArray(this.data.acceptanceList)) {
      this.acceptanceList = this.data.acceptanceList;
    } else {
      const frac = this.data?.acceptance || this.data?.item?.acceptance || this.data?.activity?.acceptance || '';
      if (frac && typeof frac === 'string' && frac.includes('/')) {
        const parts = frac.split('/');
        const acceptedCount = parseInt(parts[0], 10);
        const totalCount = parseInt(parts[1], 10);

        if (!isNaN(totalCount) && totalCount > 0) {
          const stakeholders = [
            { id: 1, name: 'Dr. Sarah Jenkins', role: 'Reviewer' },
            { id: 2, name: 'Alex Rivera', role: 'Reviewer' },
            { id: 3, name: 'Michael Chang', role: 'Reviewer' },
            { id: 4, name: 'Dr. Priya Nair', role: 'Reviewer' },
            { id: 5, name: 'Emily Watson', role: 'Reviewer' },
            { id: 6, name: 'Marcus Vance', role: 'Reviewer' },
            { id: 7, name: 'David Miller', role: 'Approver' },
            { id: 8, name: 'Robert Chen', role: 'Reviewer' },
            { id: 9, name: 'Sophia Lin', role: 'Reviewer' },
            { id: 10, name: 'Dr. Aris Thorne', role: 'Approver' }
          ];

          const fallbackReasons = [
            'Process Hazard Analysis (HAZOP / LOPA) action items incomplete',
            'Process safety, REACH/TSCA or regulatory compliance gap',
            'Raw material monomer purity, assay or supplier qualification not met',
            'Pilot plant campaign or demonstration batch quality criteria not met',
            'Cost of manufacturing (COM) or capital expenditure (CAPEX) variance exceeded'
          ];

          const count = Math.min(totalCount, stakeholders.length);
          const accepted = !isNaN(acceptedCount) ? Math.min(acceptedCount, count) : Math.max(1, count - 1);

          this.acceptanceList = [];
          for (let i = 0; i < count; i++) {
            const isAccepted = i < accepted;
            const s = stakeholders[i];
            const isApprover = (i === count - 1);
            this.acceptanceList.push({
              id: s.id,
              workflow: isApprover ? 'Approver' : 'Reviewer',
              name: s.name,
              status: isAccepted ? 'Accepted' : 'Rejected',
              rejectionReason: isAccepted ? '' : (fallbackReasons[i % fallbackReasons.length])
            });
          }
        }
      }
    }
  }

  onStatusChange(item: AcceptanceItem, type: 'Accepted' | 'Rejected', checked: boolean): void {
    if (checked) {
      item.status = type;
      if (type === 'Rejected' && !item.rejectionReason) {
        item.rejectionReason = this.rejectionReasons[0];
      } else if (type === 'Accepted') {
        item.rejectionReason = '';
      }
    } else {
      item.status = 'Pending';
      if (type === 'Rejected') {
        item.rejectionReason = '';
      }
    }
  }

  setStatus(item: AcceptanceItem, status: 'Accepted' | 'Rejected'): void {
    this.onStatusChange(item, status, item.status !== status);
  }

  get acceptedCount(): number {
    return this.acceptanceList.filter(x => x.status === 'Accepted').length;
  }

  get rejectedCount(): number {
    return this.acceptanceList.filter(x => x.status === 'Rejected').length;
  }

  close(): void {
    this.dialogRef?.close();
  }

  save(): void {
    this.dialogRef?.close({
      acceptedCount: this.acceptedCount,
      rejectedCount: this.rejectedCount,
      totalCount: this.acceptanceList.length,
      list: this.acceptanceList
    });
  }
}
