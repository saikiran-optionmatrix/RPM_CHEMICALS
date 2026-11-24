import { Routes } from '@angular/router';
import { ProjectSourcingChecklistComponent } from './project-sourcing-checklist.component';

export const PROJECT_SOURCING_CHECKLIST_ROUTES: Routes = [
  {
    path: '',
    component: ProjectSourcingChecklistComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./sourcing-checklist-items/sourcing-checklist-items.component').then(
            (m) => m.SourcingChecklistItemsComponent
          ),
        data: {
          breadcrumb: 'Checklist',
          description: 'Technical sourcing requirements'
        }
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./sourcing-checklist-items/sourcing-checklist-items.component').then(
            (m) => m.SourcingChecklistItemsComponent
          ),
        data: {
          breadcrumb: 'Checklist',
          description: 'Technical sourcing requirements'
        }
      },
      {
        path: 'materials-plan',
        loadComponent: () =>
          import('./materials-plan/materials-plan.component').then(
            (m) => m.MaterialsPlanComponent
          ),
        data: {
          breadcrumb: 'Materials Plan',
          description: 'Procurement planning and budget integration'
        }
      },
      {
        path: 'pre-qualification',
        loadComponent: () =>
          import('./pre-qualification-checklist/pre-qualification-checklist.component').then(
            (m) => m.PreQualificationChecklistComponent
          ),
        data: {
          breadcrumb: 'Pre-Qualification Checklist',
          description: 'Vendor qualification for materials'
        }
      }
    ]
  }
];
