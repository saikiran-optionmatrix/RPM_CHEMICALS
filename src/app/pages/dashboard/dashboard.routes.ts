import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { fullBleed: true },
    children: [
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
      {
        path: 'portfolio',
        loadComponent: () => import('./dashboard-portfolio/dashboard-portfolio.component').then(c => c.DashboardPortfolioComponent),
        data: { fullBleed: true }
      },
      {
        path: 'stages',
        loadComponent: () => import('./dashboard-stages/dashboard-stages.component').then(c => c.DashboardStagesComponent),
        data: { fullBleed: true }
      },
      {
        path: 'pipeline',
        redirectTo: 'stages',
        pathMatch: 'full'
      },
      {
        path: 'timeline',
        loadComponent: () => import('./dashboard-timeline/dashboard-timeline.component').then(c => c.DashboardTimelineComponent),
        data: { fullBleed: true }
      },
      {
        path: 'variance',
        loadComponent: () => import('./dashboard-variance/dashboard-variance.component').then(c => c.DashboardVarianceComponent),
        data: { fullBleed: true }
      },
      {
        path: 'buffer',
        loadComponent: () => import('./dashboard-buffer/dashboard-buffer.component').then(c => c.DashboardBufferComponent),
        data: { fullBleed: true }
      },
      {
        path: 'delay-reasons',
        loadComponent: () => import('./dashboard-delay-reasons/dashboard-delay-reasons.component').then(c => c.DashboardDelayReasonsComponent),
        data: { fullBleed: true }
      },
      {
        path: 'backlog',
        loadComponent: () => import('./dashboard-backlog/dashboard-backlog.component').then(c => c.DashboardBacklogComponent),
        data: { fullBleed: true }
      },
      {
        path: 'safety-regulatory',
        loadComponent: () => import('./dashboard-fullkit/dashboard-fullkit.component').then(c => c.DashboardFullkitComponent),
        data: { fullBleed: true }
      },
      {
        path: 'fullkit',
        redirectTo: 'safety-regulatory',
        pathMatch: 'full'
      },
      {
        path: 'gates',
        loadComponent: () => import('./dashboard-gates/dashboard-gates.component').then(c => c.DashboardGatesComponent),
        data: { fullBleed: true }
      },
      {
        path: 'pfolio-drilldown',
        redirectTo: 'portfolio',
        pathMatch: 'full'
      },
      {
        path: 'resourceload',
        loadComponent: () => import('./dashboard-resourceload/dashboard-resourceload.component').then(c => c.DashboardResourceloadComponent),
        data: { fullBleed: true }
      },
      {
        path: 'taskcontrol',
        loadComponent: () => import('./dashboard-taskcontrol/dashboard-taskcontrol.component').then(c => c.DashboardTaskcontrolComponent),
        data: { fullBleed: true }
      }
    ]
  }
];
