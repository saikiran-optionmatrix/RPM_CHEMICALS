import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  DependencyResolvedStatus,
  diffInVivoDays,
  getStudyDependencies,
  getStudyImpacts,
  ImpactAffectsStatus,
  IN_VIVO_STUDIES_DATA,
  InVivoStudyItem,
  isDependencyForecastLate,
  resolveDependencyForecast,
  resolveDependencyStatus,
  StudyDependencyItem,
  StudyImpactAssessmentItem,
  upsertStudyDependency,
  upsertStudyImpact
} from '../in-vivo-studies.data';
import { EditDependencyComponent } from './edit-dependency/edit-dependency.component';
import { EditImpactAssessmentComponent } from './edit-impact-assessment/edit-impact-assessment.component';

export interface DependencySectionView {
  title: string;
  rows: StudyDependencyItem[];
  showAdd: boolean;
}

@Component({
  selector: 'app-study-dependencies-impact',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule],
  templateUrl: './study-dependencies-impact.component.html',
  styleUrl: './study-dependencies-impact.component.scss'
})
export class StudyDependenciesImpactComponent implements OnChanges {
  @Input() study?: InVivoStudyItem;
  @Output() dependenciesUpdated = new EventEmitter<void>();

  incomingDeps: StudyDependencyItem[] = [];
  outgoingDeps: StudyDependencyItem[] = [];
  impacts: StudyImpactAssessmentItem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(): void {
    this.refreshData();
  }

  get dependencySections(): DependencySectionView[] {
    return [
      {
        title: 'This study depends on',
        rows: this.incomingDeps,
        showAdd: true
      },
      {
        title: 'Other studies depend on this one',
        rows: this.outgoingDeps,
        showAdd: false
      }
    ];
  }

  getForecast(dep: StudyDependencyItem): string {
    return resolveDependencyForecast(dep, IN_VIVO_STUDIES_DATA);
  }

  getStatus(dep: StudyDependencyItem): DependencyResolvedStatus {
    return resolveDependencyStatus(dep, IN_VIVO_STUDIES_DATA);
  }

  isLate(dep: StudyDependencyItem): boolean {
    return isDependencyForecastLate(dep, IN_VIVO_STUDIES_DATA);
  }

  getDepStatusClass(status: DependencyResolvedStatus): string {
    switch (status) {
      case 'Complete':
        return 'pill-green';
      case 'At risk':
        return 'pill-orange';
      default:
        return 'pill-grey';
    }
  }

  getImpactVariance(impact: StudyImpactAssessmentItem): number | null {
    if (!impact.baseline || !impact.forecast) return null;
    return diffInVivoDays(impact.forecast, impact.baseline);
  }

  formatVariance(days: number | null): string {
    if (days == null) return '—';
    return `${days > 0 ? '+' : ''}${days} d`;
  }

  getVarianceClass(days: number | null): string {
    if (days == null) return 'variance-empty';
    if (days > 0) return 'variance-late';
    if (days < 0) return 'variance-ahead';
    return 'variance-neutral';
  }

  getAffectsClass(affects: ImpactAffectsStatus): string {
    switch (affects) {
      case 'To be assessed':
        return 'pill-orange';
      case 'No':
        return 'pill-green';
      default:
        return 'pill-grey';
    }
  }

  openDependencyDialog(existing?: StudyDependencyItem): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(EditDependencyComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        successorStudy: this.study,
        existingDependency: existing
      }
    });

    dialogRef.afterClosed().subscribe((result?: StudyDependencyItem | null) => {
      if (!result) return;
      upsertStudyDependency(result);
      this.refreshData();
      this.dependenciesUpdated.emit();
    });
  }

  openImpactDialog(existing?: StudyImpactAssessmentItem): void {
    if (!this.study) return;
    const dialogRef = this.dialog.open(EditImpactAssessmentComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        study: this.study,
        existingImpact: existing
      }
    });

    dialogRef.afterClosed().subscribe((result?: StudyImpactAssessmentItem | null) => {
      if (!result) return;
      upsertStudyImpact(result);
      this.refreshData();
      this.dependenciesUpdated.emit();
    });
  }

  private refreshData(): void {
    if (!this.study) {
      this.incomingDeps = [];
      this.outgoingDeps = [];
      this.impacts = [];
      return;
    }

    const { incoming, outgoing } = getStudyDependencies(this.study.studyId);
    this.incomingDeps = incoming;
    this.outgoingDeps = outgoing;
    this.impacts = getStudyImpacts(this.study.studyId);
  }
}
