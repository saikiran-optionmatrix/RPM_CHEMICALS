import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  appendStudyHistory,
  cloneStudyBudget,
  cloneStudyResultsClosure,
  formatStudyMoney,
  getInVivoLifecycleClass,
  getInVivoPriorityClass,
  getInVivoProjectMaster,
  getInVivoRagClass,
  getInVivoStudiesForProject,
  getInVivoStudyById,
  getStudyDependencyCount,
  getStudyDocuments,
  getStudyRadCount,
  getTodayInVivoDisplay,
  IN_VIVO_STUDIES_DATA,
  InVivoProjectMaster,
  InVivoStudyItem,
  StudyBudgetData
} from '../in-vivo-studies.data';
import { AddInVivoStudiesComponent } from '../add-in-vivo-studies/add-in-vivo-studies.component';
import {
  StudyIdentificationComponent,
  StudyRagUpdateEvent
} from '../study-identification/study-identification.component';
import {
  StudyMilestonesUpdateEvent,
  StudyPlanMilestonesComponent
} from '../study-plan-milestones/study-plan-milestones.component';
import {
  StudyReadinessComponent,
  StudyReadinessUpdateEvent
} from '../study-readiness/study-readiness.component';
import { StudyDependenciesImpactComponent } from '../study-dependencies-impact/study-dependencies-impact.component';
import { StudyRisksActionsComponent } from '../study-risks-actions/study-risks-actions.component';
import { StudyBudgetComponent } from '../study-budget/study-budget.component';
import {
  StudyResultsClosureComponent,
  StudyResultsClosureUpdateEvent
} from '../study-results-closure/study-results-closure.component';
import {
  StudyDocumentsComponent,
  StudyDocumentsUpdateEvent
} from '../study-documents/study-documents.component';
import { StudyHistoryComponent } from '../study-history/study-history.component';

export type InVivoStudyTabId =
  | 'identification'
  | 'plan-milestones'
  | 'readiness'
  | 'dependencies-impact'
  | 'risks-actions'
  | 'budget'
  | 'results-closure'
  | 'documents'
  | 'history';

export interface InVivoStudyTab {
  id: InVivoStudyTabId;
  label: string;
}

@Component({
  selector: 'app-in-vivo-study-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    StudyIdentificationComponent,
    StudyPlanMilestonesComponent,
    StudyReadinessComponent,
    StudyDependenciesImpactComponent,
    StudyRisksActionsComponent,
    StudyBudgetComponent,
    StudyResultsClosureComponent,
    StudyDocumentsComponent,
    StudyHistoryComponent
  ],
  templateUrl: './in-vivo-study-details.component.html',
  styleUrl: './in-vivo-study-details.component.scss'
})
export class InVivoStudyDetailsComponent implements OnInit {
  projectCode = '2026/CHM/001';
  projectName = 'Acrylic Emulsion Binder 50% Solids';
  studyId = '';
  projectMaster?: InVivoProjectMaster;
  study?: InVivoStudyItem;

  activeTab: InVivoStudyTabId = 'identification';

  readonly tabs: readonly InVivoStudyTab[] = [
    { id: 'identification', label: 'Identification' },
    { id: 'plan-milestones', label: 'Plan & milestones' },
    { id: 'readiness', label: 'Readiness' },
    { id: 'dependencies-impact', label: 'Dependencies & impact' },
    { id: 'risks-actions', label: 'Risks, actions & decisions' },
    { id: 'budget', label: 'Budget' },
    { id: 'results-closure', label: 'Results & closure' },
    { id: 'documents', label: 'Documents' },
    { id: 'history', label: 'History' }
  ];

  readonly getLifecycleClass = getInVivoLifecycleClass;
  readonly getRagClass = getInVivoRagClass;
  readonly getPriorityClass = getInVivoPriorityClass;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const paramCode = params['projectCode'] || params['code'];
      const paramName = params['projectName'] || params['name'];
      const paramStudyId = params['studyId'] || '';
      const paramTab = params['tab'] as InVivoStudyTabId | undefined;

      this.projectMaster = getInVivoProjectMaster(paramCode, paramName);
      if (this.projectMaster) {
        this.projectCode = this.projectMaster.projectCode;
        this.projectName = this.projectMaster.projectName;
      }

      this.studyId = paramStudyId;
      this.study =
        getInVivoStudyById(paramStudyId) ||
        getInVivoStudiesForProject(this.projectCode, this.projectName)[0];

      if (this.study && !this.projectMaster) {
        this.projectCode = this.study.projectCode;
        this.projectName = this.study.projectName;
        this.projectMaster = getInVivoProjectMaster(this.study.projectCode, this.study.projectName);
      }

      if (paramTab && this.tabs.some(t => t.id === paramTab)) {
        this.activeTab = paramTab;
      }
    });
  }

  selectTab(tabId: InVivoStudyTabId): void {
    this.activeTab = tabId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  editStudy(): void {
    if (!this.study) return;
    const prev = this.study;
    const dialogRef = this.dialog.open(AddInVivoStudiesComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        item: prev,
        projectCode: this.projectCode,
        projectName: this.projectName,
        availableMarkets: this.projectMaster?.targetMarkets
      }
    });

    dialogRef.afterClosed().subscribe((result?: InVivoStudyItem) => {
      if (!result) return;
      const trackedFields: Array<[keyof InVivoStudyItem, string]> = [
        ['study', 'Study title'],
        ['studyObjective', 'Objective'],
        ['studyLocation', 'Location'],
        ['studyPriority', 'Priority'],
        ['studyOwner', 'Study owner'],
        ['formulationLead', 'Formulation lead'],
        ['regulatoryLead', 'Regulatory lead'],
        ['cro', 'CRO'],
        ['croContact', 'CRO contact'],
        ['lifecycle', 'Lifecycle status'],
        ['statusReason', 'Status reason']
      ];
      for (const [key, label] of trackedFields) {
        const oldVal = String(prev[key] ?? '');
        const newVal = String(result[key] ?? '');
        if (oldVal !== newVal) {
          appendStudyHistory({
            studyId: prev.studyId,
            field: label,
            previousValue: oldVal,
            newValue: newVal,
            reason: key === 'lifecycle' ? result.statusReason || '' : ''
          });
        }
      }
      this.persistUpdatedStudy(result);
    });
  }

  onRagUpdated(event: StudyRagUpdateEvent): void {
    if (!this.study) return;
    if (this.study.ragStatus !== event.ragStatus || this.study.ragReason !== event.ragReason) {
      appendStudyHistory({
        studyId: this.study.studyId,
        field: 'Management RAG assessment',
        previousValue: this.study.ragStatus,
        newValue: event.ragStatus,
        reason: event.ragReason
      });
    }
    this.persistUpdatedStudy({
      ...this.study,
      ragStatus: event.ragStatus,
      ragReason: event.ragReason,
      lastUpdated: event.lastUpdated
    });
  }

  onMilestonesUpdated(event: StudyMilestonesUpdateEvent): void {
    if (!this.study) return;
    this.persistUpdatedStudy({
      ...this.study,
      milestones: event.milestones,
      nextMilestone: event.nextMilestone ?? this.study.nextMilestone,
      forecast: event.forecast ?? this.study.forecast,
      variance: event.variance ?? this.study.variance,
      lastUpdated: event.lastUpdated
    });
  }

  onReadinessUpdated(event: StudyReadinessUpdateEvent): void {
    if (!this.study) return;
    this.persistUpdatedStudy({
      ...this.study,
      readiness: event.readiness,
      lastUpdated: event.lastUpdated
    });
  }

  onDependenciesUpdated(): void {
    if (!this.study) return;
    this.persistUpdatedStudy({
      ...this.study,
      lastUpdated: getTodayInVivoDisplay()
    });
  }

  onRadUpdated(): void {
    if (!this.study) return;
    this.persistUpdatedStudy({
      ...this.study,
      lastUpdated: getTodayInVivoDisplay()
    });
  }

  onBudgetUpdated(budget: StudyBudgetData): void {
    if (!this.study) return;
    const prevBudget = this.study.budget;
    if (!prevBudget) {
      appendStudyHistory({
        studyId: this.study.studyId,
        field: 'Budget · approved budget',
        previousValue: '',
        newValue: formatStudyMoney(budget.approved, budget.currency)
      });
    } else {
      if (prevBudget.approved !== budget.approved) {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Budget · approved budget',
          previousValue: formatStudyMoney(prevBudget.approved, prevBudget.currency),
          newValue: formatStudyMoney(budget.approved, budget.currency)
        });
      }
      if (prevBudget.forecastToComplete !== budget.forecastToComplete) {
        appendStudyHistory({
          studyId: this.study.studyId,
          field: 'Budget · forecast to complete',
          previousValue: formatStudyMoney(prevBudget.forecastToComplete, prevBudget.currency),
          newValue: formatStudyMoney(budget.forecastToComplete, budget.currency)
        });
      }
      if (prevBudget.payments.length !== budget.payments.length) {
        const added = budget.payments[budget.payments.length - 1];
        if (added) {
          appendStudyHistory({
            studyId: this.study.studyId,
            field: `Payment milestone · ${added.trigger}`,
            previousValue: '',
            newValue: `${added.status} · ${formatStudyMoney(added.amount, budget.currency)}`
          });
        }
      }
    }

    this.persistUpdatedStudy({
      ...this.study,
      budget: cloneStudyBudget(budget) ?? budget,
      lastUpdated: getTodayInVivoDisplay()
    });
  }

  onResultsClosureUpdated(event: StudyResultsClosureUpdateEvent): void {
    if (!this.study) return;
    this.persistUpdatedStudy({
      ...this.study,
      resultsClosure: cloneStudyResultsClosure(event.resultsClosure),
      lifecycle: event.lifecycle ?? this.study.lifecycle,
      lastUpdated: event.lastUpdated
    });
  }

  onDocumentsUpdated(event: StudyDocumentsUpdateEvent): void {
    if (!this.study) return;
    this.persistUpdatedStudy({
      ...this.study,
      documents: event.documents.map(d => ({ ...d })),
      lastUpdated: event.lastUpdated
    });
  }

  getTabCount(tabId: InVivoStudyTabId): number {
    if (!this.study) return 0;
    if (tabId === 'dependencies-impact') {
      return getStudyDependencyCount(this.study.studyId);
    }
    if (tabId === 'risks-actions') {
      return getStudyRadCount(this.study.studyId);
    }
    if (tabId === 'documents') {
      return getStudyDocuments(this.study).length;
    }
    return 0;
  }

  private persistUpdatedStudy(updated: InVivoStudyItem): void {
    const idx = IN_VIVO_STUDIES_DATA.findIndex(s => s.studyId === updated.studyId);
    if (idx !== -1) {
      IN_VIVO_STUDIES_DATA[idx] = updated;
    }
    this.study = updated;
  }

  goBackToList(): void {
    this.router.navigate(['/projects/dashboard/clinical-trails'], {
      queryParams: {
        projectCode: this.projectCode,
        projectName: this.projectName,
        studyId: null,
        tab: null
      },
      queryParamsHandling: 'merge'
    });
  }
}

