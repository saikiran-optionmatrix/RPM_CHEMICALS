import { Routes } from '@angular/router';
import { ProjectRldComponent } from './project-rld.component';

export const PROJECT_RLD_ROUTES: Routes = [
  {
    path: '',
    component: ProjectRldComponent,
    data: {
      breadcrumb: 'RLD',
      description: 'Track Reference Listed Drug sourcing and status.'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reference-products',
      },
      {
        path: 'reference-products',
        loadComponent: () =>
          import('./reference-products/reference-products.component').then(
            (m) => m.ReferenceProductsComponent
          ),
        data: {
          breadcrumb: 'RLD',
          description: 'Track Reference Listed Drug sourcing and status.'
        },
      },
      {
        path: 'utilisation-breakup',
        loadComponent: () =>
          import('./utilisation-breakup/utilisation-breakup.component').then(
            (m) => m.UtilisationBreakupComponent
          ),
        data: {
          breadcrumb: 'RLD',
          description: 'Track Reference Listed Drug sourcing and status.'
        },
      },
      {
        path: 'stock-allocation',
        loadComponent: () =>
          import('./stock-allocation/stock-allocation.component').then(
            (m) => m.StockAllocationComponent
          ),
        data: {
          breadcrumb: 'RLD',
          description: 'Track Reference Listed Drug sourcing and status.'
        },
      },
      {
        path: 'procurement-cost',
        loadComponent: () =>
          import('./procurement-cost/procurement-cost.component').then(
            (m) => m.ProcurementCostComponent
          ),
        data: {
          breadcrumb: 'RLD',
          description: 'Track Reference Listed Drug sourcing and status.'
        },
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./rld-alerts/rld-alerts.component').then(
            (m) => m.RldAlertsComponent
          ),
        data: {
          breadcrumb: 'RLD',
          description: 'Track Reference Listed Drug sourcing and status.'
        },
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./rld-history/rld-history.component').then(
            (m) => m.RldHistoryComponent
          ),
        data: {
          breadcrumb: 'RLD',
          description: 'Track Reference Listed Drug sourcing and status.'
        },
      },
    ],
  },
];
