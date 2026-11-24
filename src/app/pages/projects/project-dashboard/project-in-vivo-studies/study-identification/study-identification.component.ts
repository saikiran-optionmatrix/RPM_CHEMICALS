import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  getInVivoLifecycleClass,
  InVivoLifecycle,
  InVivoProjectMaster,
  InVivoStudyItem
} from '../in-vivo-studies.data';
import {
  ManagementRagAssessmentComponent,
  ManagementRagAssessmentResult
} from '../management-rag-assessment/management-rag-assessment.component';

export interface StudyIdentificationFieldRow {
  label: string;
  value: string;
  hint?: string;
  bold?: boolean;
  lifecycleBadge?: InVivoLifecycle;
  confirmedBadge?: 'Confirmed' | 'Pending';
}

export type StudyRagUpdateEvent = ManagementRagAssessmentResult;

@Component({
  selector: 'app-study-identification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './study-identification.component.html',
  styleUrl: './study-identification.component.scss'
})
export class StudyIdentificationComponent {
  @Input() study?: InVivoStudyItem;
  @Input() projectMaster?: InVivoProjectMaster;

  @Output() editRequested = new EventEmitter<void>();
  @Output() ragUpdated = new EventEmitter<StudyRagUpdateEvent>();

  readonly getLifecycleClass = getInVivoLifecycleClass;

  constructor(private dialog: MatDialog) {}

  get leftRows(): StudyIdentificationFieldRow[] {
    const s = this.study;
    if (!s) return [];

    const molecule = s.molecule || this.projectMaster?.molecule || s.projectName;
    const strengthParts = [this.projectMaster?.dosageForm, this.projectMaster?.strength].filter(Boolean);
    const strengthDisplay = strengthParts.length
      ? `Per product master · ${strengthParts.join(' · ')}`
      : 'Per product master';
    const categorySubtype = s.subtype ? `${s.category} · ${s.subtype}` : s.category;

    return [
      {
        label: 'PRAGATI Study ID',
        value: s.studyId,
        hint: 'system-generated, never changes',
        bold: true
      },
      {
        label: 'Product / molecule',
        value: molecule,
        hint: 'product master'
      },
      {
        label: 'Strength / dosage form',
        value: strengthDisplay
      },
      {
        label: 'Development project',
        value: s.projectName,
        hint: 'Per project master'
      },
      {
        label: 'Study title',
        value: s.study
      },
      {
        label: 'Study category / subtype',
        value: categorySubtype
      },
      {
        label: 'CRO study code(s)',
        value: s.studyCode || '—'
      },
      {
        label: 'Study objective',
        value: s.studyObjective || '—'
      },
      {
        label: 'Study location',
        value: s.studyLocation || '—'
      }
    ];
  }

  get rightRows(): StudyIdentificationFieldRow[] {
    const s = this.study;
    if (!s) return [];

    const molecule = (s.molecule || this.projectMaster?.molecule || s.projectName).trim();
    const marketList = (s.targetMarkets || '')
      .split(/[,/]+/)
      .map(m => m.trim())
      .filter(Boolean);
    const linkedProgrammes = marketList.length
      ? marketList.map(m => `${molecule} · ${m}`).join(' · ')
      : '—';

    const priority = s.studyPriority || this.projectMaster?.priority || 'Normal';
    const croValue = s.cro || 'To be identified';

    return [
      {
        label: 'Target market(s)',
        value: s.targetMarkets || '—'
      },
      {
        label: 'Linked product–country programme(s)',
        value: linkedProgrammes
      },
      {
        label: 'Study priority',
        value: priority
      },
      {
        label: 'Priority rationale',
        value: s.priorityRationale || 'Aligned with critical dossier submission timeline'
      },
      {
        label: 'Study owner (accountable)',
        value: s.studyOwner || '—'
      },
      {
        label: 'Formulation lead',
        value: s.formulationLead || this.projectMaster?.projectLead || '—'
      },
      {
        label: 'Regulatory lead',
        value: s.regulatoryLead || '—'
      },
      {
        label: 'CRO',
        value: croValue,
        hint: croValue !== 'To be identified' ? 'CRO master' : undefined
      },
      {
        label: 'CRO contact',
        value: s.croContact || '—'
      },
      {
        label: 'Lifecycle status',
        value: s.lifecycle,
        lifecycleBadge: s.lifecycle
      },
      {
        label: 'Status reason',
        value: s.statusReason || '—'
      }
    ];
  }

  get migrationRows(): StudyIdentificationFieldRow[] {
    const s = this.study;
    if (!s) return [];

    const hasMultipleCodes = (s.studyCode || '').includes(',');
    const defaultIssue = hasMultipleCodes
      ? `Multiple study codes in one row (${s.studyCode}): confirm whether one study or two`
      : 'No migration discrepancies flagged';
    const isConfirmed = s.ownerConfirmed ?? s.lifecycle !== 'Planned';

    return [
      {
        label: 'Source',
        value: s.migrationSource || `Project master tracker · ${s.projectCode}`
      },
      {
        label: 'Original text',
        value: s.migrationOriginalText || s.ragReason || s.studyObjective || '—'
      },
      {
        label: 'Issues',
        value: s.migrationIssues || defaultIssue
      },
      {
        label: 'Owner confirmed',
        value: isConfirmed ? 'Confirmed' : 'Pending',
        confirmedBadge: isConfirmed ? 'Confirmed' : 'Pending'
      }
    ];
  }

  openRagAssessment(): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(ManagementRagAssessmentComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: {
        study: this.study,
        projectCode: this.study.projectCode,
        projectName: this.study.projectName
      }
    });

    dialogRef.afterClosed().subscribe((result?: ManagementRagAssessmentResult | null) => {
      if (result) {
        this.ragUpdated.emit(result);
      }
    });
  }
}
