import { Routes } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard.component';

export const projectDashboardRoutes: Routes = [
  {
    path: '',
    component: ProjectDashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'analytics',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./project-analytics/project-analytics.component').then(
            (m) => m.ProjectAnalyticsComponent,
          ),
        data: { breadcrumb: 'Analytics', description: 'Review project performance and trends.' },
      },
      {
        path: 'npv',
        loadComponent: () =>
          import('./project-npv-calculator/project-npv-calculator.component').then(
            (m) => m.ProjectNpvCalculatorComponent,
          ),
        data: {
          breadcrumb: 'Feasibility',
          description: 'Estimate project financial feasibility and net present value.',
        },
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./project-overview/project-overview.component').then(
            (m) => m.ProjectOverviewComponent,
          ),
        data: { breadcrumb: 'Overview', description: 'View the project summary and key details.' },
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./project-setup/project-setup.component').then((m) => m.ProjectSetupComponent),
        data: { breadcrumb: 'Setup', description: 'Configure the project settings and details.' },
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./project-team/project-team.component').then((m) => m.ProjectTeamComponent),
        data: { breadcrumb: 'Team', description: 'Manage project members and responsibilities.' },
      },
      {
        path: 'sourcing-checklist',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'materials/pre-qualification',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'materials/onsite-qualification',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'sourcing/pre-qualification',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'sourcing/onsite-qualification',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'outsourcing',
        redirectTo: 'team',
        pathMatch: 'full',
      },
      {
        path: 'out-sourcing',
        redirectTo: 'team',
        pathMatch: 'full',
      },
      {
        path: 'rld',
        redirectTo: 'setup',
        pathMatch: 'full',
      },
      {
        path: 'stages',
        loadComponent: () =>
          import('./project-stages/project-stages.component').then((m) => m.ProjectStagesComponent),
        data: { breadcrumb: 'Stages', description: 'Manage the project lifecycle stages.' },
      },
      {
        path: 'stages/history',
        loadComponent: () =>
          import(
            './project-stages/project-stages-history/project-stages-history.component'
          ).then((m) => m.ProjectStagesHistoryComponent),
        data: { breadcrumb: 'Stage History', description: 'View stage change history.' },
      },
      // {
      //   path: 'stages-history',
      //   loadComponent: () =>
      //     import(
      //       './project-stages/project-stages-history/project-stages-history.component'
      //     ).then((m) => m.ProjectStagesHistoryComponent),
      //   data: { breadcrumb: 'Stage History', description: 'View stage change history.' },
      // },
      {
        path: 'stages/wbs',
        loadChildren: () =>
          import('./project-stages/project-wbs/project-wbs.routes').then(
            (m) => m.projectWbsRoutes,
          ),
      },
      {
        path: 'wbs',
        loadChildren: () =>
          import('./project-stages/project-wbs/project-wbs.routes').then(
            (m) => m.projectWbsRoutes,
          ),
      },
      {
        path: 'gates',
        loadComponent: () =>
          import('./project-gates/project-gates.component').then((m) => m.ProjectGatesComponent),
        data: { breadcrumb: 'Gates', description: 'Track project reviews and decision gates.' },
      },
      {
        path: 'gates/history',
        loadComponent: () =>
          import(
            './project-gates/project-gates-history/project-gates-history.component'
          ).then((m) => m.ProjectGatesHistoryComponent),
        data: { breadcrumb: 'Gate History', description: 'View gate change history.' },
      },
      // {
      //   path: 'gates-history',
      //   loadComponent: () =>
      //     import(
      //       './project-gates/project-gates-history/project-gates-history.component'
      //     ).then((m) => m.ProjectGatesHistoryComponent),
      //   data: { breadcrumb: 'Gate History', description: 'View gate change history.' },
      // },
      {
        path: 'gates/checklist',
        loadComponent: () =>
          import(
            './project-gates/checklist-pop/checklist-pop.component'
          ).then((m) => m.ChecklistPopComponent),
        data: {
          breadcrumb: 'Gate Checklist',
          description: 'Review gate checklist requirements and acceptance.',
        },
      },
      {
        path: 'gates/activities',
        loadComponent: () =>
          import(
            './project-gates/proj-gates-activities/proj-gates-activities.component'
          ).then((m) => m.ProjGatesActivitiesComponent),
        data: {
          breadcrumb: 'Gate Activities',
          description: 'Track gate activities and deliverables.',
        },
      },
      {
        path: 'gates/activities/history',
        loadComponent: () =>
          import(
            './project-gates/proj-gates-activities/gates-activity-history/gates-activity-history.component'
          ).then((m) => m.GatesActivityHistoryComponent),
        data: {
          breadcrumb: 'Gate Activity History',
          description: 'Track gate activity revisions and change history.',
        },
      },
      {
        path: 'gates/debate',
        loadComponent: () =>
          import(
            './project-gates/project-gates-debate/project-gates-debate.component'
          ).then((m) => m.ProjectGatesDebateComponent),
        data: {
          breadcrumb: 'Gate Debate',
          description: 'Track gate debate discussions and decisions.',
        },
      },
      {
        path: 'gates/debate/activities',
        loadComponent: () =>
          import(
            './project-gates/project-gates-debate/debate-activities/debate-activities.component'
          ).then((m) => m.DebateActivitiesComponent),
        data: {
          breadcrumb: 'Gate Debate Activities',
          description: 'View and select gate debate activities.',
        },
      },
      {
        path: 'gates/debate/activities/history',
        loadComponent: () =>
          import(
            './project-gates/project-gates-debate/debate-activities/debate-activities-history/debate-activities-history.component'
          ).then((m) => m.DebateActivitiesHistoryComponent),
        data: {
          breadcrumb: 'Debate Activity History',
          description: 'Track gate debate activity revisions and change history.',
        },
      },

      {
        path: 'variance',
        loadComponent: () =>
          import('./project-budget/project-budget.component').then((m) => m.ProjectBudgetComponent),
        data: { breadcrumb: 'Budget', description: 'Monitor project cost variance and budget allocation.' },
      },
      {
        path: 'budget',
        redirectTo: 'variance',
        pathMatch: 'full',
      },
      {
        path: 'budgeting',
        redirectTo: 'variance',
        pathMatch: 'full',
      },
      {
        path: 'change-control',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control/add',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control/add-change-control',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control-add',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control/details',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control/dashboard',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control-dashboard',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control/add-ammendment',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'change-control/add-amendment',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'clinical-trials',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'clinical-trials/details',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'clinical-trails',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'backlog',
        loadComponent: () =>
          import('./project-scrum/project-scrum.component').then((m) => m.ProjectScrumComponent),
        data: { breadcrumb: 'Scrum', description: 'Plan and manage the project backlog.' },
      },
      {
        path: 'backlog/history',
        loadComponent: () =>
          import(
            './project-scrum/project-scrum-history/project-scrum-history.component'
          ).then((m) => m.ProjectScrumHistoryComponent),
        data: { breadcrumb: 'Scrum History', description: 'View scrum task history.' },
      },
      {
        path: 'scrum/history',
        loadComponent: () =>
          import(
            './project-scrum/project-scrum-history/project-scrum-history.component'
          ).then((m) => m.ProjectScrumHistoryComponent),
        data: { breadcrumb: 'Scrum History', description: 'View scrum task history.' },
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./project-activities/project-activities.component').then(
            (m) => m.ProjectActivitiesComponent,
          ),
        data: {
          breadcrumb: 'Activities',
          description: 'Track project activities and assigned tasks.',
        },
      },
      {
        path: 'activities/history',
        loadComponent: () =>
          import(
            './project-activities/project-activities-history/project-activities-history.component'
          ).then((m) => m.ProjectActivitiesHistoryComponent),
        data: {
          breadcrumb: 'Activities History',
          description: 'Track project activity revision history.',
        },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./project-activities/project-activities.component').then(
            (m) => m.ProjectActivitiesComponent,
          ),
        data: {
          breadcrumb: 'Activities',
          description: 'Track project activities and assigned tasks.',
        },
      },
      {
        path: 'tasks/history',
        loadComponent: () =>
          import(
            './project-activities/project-activities-history/project-activities-history.component'
          ).then((m) => m.ProjectActivitiesHistoryComponent),
        data: {
          breadcrumb: 'Tasks History',
          description: 'Track project task revision history.',
        },
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./project-schedule/project-schedule.component').then(
            (m) => m.ProjectScheduleComponent,
          ),
        data: { breadcrumb: 'Scheduling', description: 'Plan dates, milestones, and deliverables.' },
      },
      {
        path: 'schedule/more/details',
        loadComponent: () =>
          import(
            './project-schedule/schedule-more/schedule-path-details/schedule-path-details.component'
          ).then((m) => m.SchedulePathDetailsComponent),
        data: {
          breadcrumb: 'Path Details',
          description: 'View Critical Path and Critical Chain activity details.',
        },
      },
      {
        path: 'schedule/tasks',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks.component'
          ).then((m) => m.ProjectSchedulingTasksComponent),
        data: {
          breadcrumb: 'Scheduling Tasks',
          description: 'View and manage schedule tasks.',
        },
      },
      {
        path: 'schedule/tasks/history',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks-history/project-scheduling-tasks-history.component'
          ).then((m) => m.ProjectSchedulingTasksHistoryComponent),
        data: {
          breadcrumb: 'Scheduling Tasks History',
          description: 'View schedule task revision history.',
        },
      },
      {
        path: 'schedule-tasks',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks.component'
          ).then((m) => m.ProjectSchedulingTasksComponent),
        data: {
          breadcrumb: 'Scheduling Tasks',
          description: 'View and manage schedule tasks.',
        },
      },
      {
        path: 'schedule-tasks-history',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks-history/project-scheduling-tasks-history.component'
          ).then((m) => m.ProjectSchedulingTasksHistoryComponent),
        data: {
          breadcrumb: 'Scheduling Tasks History',
          description: 'View schedule task revision history.',
        },
      },
      {
        path: 'todo',
        loadComponent: () =>
          import('./project-todo/project-todo.component').then((m) => m.ProjectTodoComponent),
        data: { breadcrumb: 'To do', description: 'Manage your outstanding project tasks.' },
      },
      {
        path: 'todo/history',
        loadComponent: () =>
          import(
            './project-todo/project-todo-history/project-todo-history.component'
          ).then((m) => m.ProjectTodoHistoryComponent),
        data: { breadcrumb: 'To do History', description: 'View to do change history.' },
      },
      {
        path: 'todo-history',
        loadComponent: () =>
          import(
            './project-todo/project-todo-history/project-todo-history.component'
          ).then((m) => m.ProjectTodoHistoryComponent),
        data: { breadcrumb: 'To do History', description: 'View to do change history.' },
      },
      // {
      //   path: 'materials',
      //   loadComponent: () =>
      //     import('./project-materials/project-materials.component').then(
      //       (m) => m.ProjectMaterialsComponent,
      //     ),
      //   data: { breadcrumb: 'Materials', description: 'Track materials required for the project.' },
      // },
      // {
      //   path: 'materials/history',
      //   loadComponent: () =>
      //     import(
      //       './project-materials/project-materials-history/project-materials-history.component'
      //     ).then((m) => m.ProjectMaterialsHistoryComponent),
      //   data: { breadcrumb: 'Materials History', description: 'View material requisition history.' },
      // },
      // {
      //   path: 'materials-history',
      //   loadComponent: () =>
      //     import(
      //       './project-materials/project-materials-history/project-materials-history.component'
      //     ).then((m) => m.ProjectMaterialsHistoryComponent),
      //   data: { breadcrumb: 'Materials History', description: 'View material requisition history.' },
      // },
      {
        path: 'resources',
        loadComponent: () =>
          import('./project-resources/project-resources.component').then(
            (m) => m.ProjectResourcesComponent,
          ),
        data: { breadcrumb: 'Resources', description: 'View and manage project resources.' },
      },
      {
        path: 'resources/slots',
        loadComponent: () =>
          import(
            './project-resources/project-resource-slots/project-resource-slots.component'
          ).then((m) => m.ProjectResourceSlotsComponent),
        data: { breadcrumb: 'Resource Slots', description: 'View resource slots breakdown.' },
      },
      {
        path: 'resources-slots',
        loadComponent: () =>
          import(
            './project-resources/project-resource-slots/project-resource-slots.component'
          ).then((m) => m.ProjectResourceSlotsComponent),
        data: { breadcrumb: 'Resource Slots', description: 'View resource slots breakdown.' },
      },
      {
        path: 'resources/history',
        loadComponent: () =>
          import(
            './project-resources/project-resources-history/project-resources-history.component'
          ).then((m) => m.ProjectResourcesHistoryComponent),
        data: { breadcrumb: 'Resources History', description: 'View resource history.' },
      },
      {
        path: 'resources-history',
        loadComponent: () =>
          import(
            './project-resources/project-resources-history/project-resources-history.component'
          ).then((m) => m.ProjectResourcesHistoryComponent),
        data: { breadcrumb: 'Resources History', description: 'View resource history.' },
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('./project-issues/project-issues.component').then((m) => m.ProjectIssuesComponent),
        data: { breadcrumb: 'Issues', description: 'Identify and resolve project issues.' },
      },
      {
        path: 'issues/history',
        loadComponent: () =>
          import(
            './project-issues/project-issues-history/project-issues-history.component'
          ).then((m) => m.ProjectIssuesHistoryComponent),
        data: { breadcrumb: 'Issues History', description: 'View project issues history.' },
      },
      {
        path: 'issues-history',
        loadComponent: () =>
          import(
            './project-issues/project-issues-history/project-issues-history.component'
          ).then((m) => m.ProjectIssuesHistoryComponent),
        data: { breadcrumb: 'Issues History', description: 'View project issues history.' },
      },
      {
        path: 'hours',
        loadComponent: () =>
          import('./project-hours/project-hours.component').then((m) => m.ProjectHoursComponent),
        data: { breadcrumb: 'Timesheet', description: 'Track time and logged hours spent on project work.' },
      },
      {
        path: 'hours/tasks',
        loadComponent: () =>
          import(
            './project-hours/project-hours-tasks/project-hours-tasks.component'
          ).then((m) => m.ProjectHoursTasksComponent),
        data: { breadcrumb: 'Hours Tasks', description: 'View hours tasks.' },
      },
      {
        path: 'hours-tasks',
        loadComponent: () =>
          import(
            './project-hours/project-hours-tasks/project-hours-tasks.component'
          ).then((m) => m.ProjectHoursTasksComponent),
        data: { breadcrumb: 'Hours Tasks', description: 'View hours tasks.' },
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./project-documents/project-documents.component').then(
            (m) => m.ProjectDocumentsComponent,
          ),
        data: { breadcrumb: 'Documents', description: 'Store and manage project documents.' },
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./project-notes/project-notes.component').then((m) => m.ProjectNotesComponent),
        data: { breadcrumb: 'Notes', description: 'Capture and organize project notes.' },
      },
      {
        path: 'notes/history',
        loadComponent: () =>
          import(
            './project-notes/project-notes-history/project-notes-history.component'
          ).then((m) => m.ProjectNotesHistoryComponent),
        data: { breadcrumb: 'Notes History', description: 'View project notes history.' },
      },
      {
        path: 'notes-history',
        loadComponent: () =>
          import(
            './project-notes/project-notes-history/project-notes-history.component'
          ).then((m) => m.ProjectNotesHistoryComponent),
        data: { breadcrumb: 'Notes History', description: 'View project notes history.' },
      },
      {
        path: 'ttd',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./project-sourcing/project-sourcing.component').then((m) => m.ProjectSourcingComponent),
        data: { breadcrumb: 'Materials', description: 'View project and Manage materials.' },
      },
      {
        path: 'sourcing',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'materials/vendor-qualification',
        loadComponent: () =>
          import(
            './project-sourcing/sourcing-vendor-qualification/sourcing-vendor-qualification.component'
          ).then((m) => m.SourcingVendorQualificationComponent),
        data: { breadcrumb: 'Vendor Qualification', description: 'Vendor qualification checkpoints and approvals.' },
      },
      {
        path: 'materials-vendor-qualification',
        loadComponent: () =>
          import(
            './project-sourcing/sourcing-vendor-qualification/sourcing-vendor-qualification.component'
          ).then((m) => m.SourcingVendorQualificationComponent),
        data: { breadcrumb: 'Vendor Qualification', description: 'Vendor qualification checkpoints and approvals.' },
      },
      {
        path: 'materials/usage',
        loadComponent: () =>
          import('./project-sourcing/sourcing-usage/sourcing-usage.component').then(
            (m) => m.SourcingUsageComponent,
          ),
        data: { breadcrumb: 'Usage', description: 'View and manage item usage.' },
      },
      {
        path: 'sourcing/vendor-qualification',
        loadComponent: () =>
          import(
            './project-sourcing/sourcing-vendor-qualification/sourcing-vendor-qualification.component'
          ).then((m) => m.SourcingVendorQualificationComponent),
        data: { breadcrumb: 'Vendor Qualification', description: 'Vendor qualification checkpoints and approvals.' },
      },
      {
        path: 'sourcing-vendor-qualification',
        loadComponent: () =>
          import(
            './project-sourcing/sourcing-vendor-qualification/sourcing-vendor-qualification.component'
          ).then((m) => m.SourcingVendorQualificationComponent),
        data: { breadcrumb: 'Vendor Qualification', description: 'Vendor qualification checkpoints and approvals.' },
      },
      {
        path: 'sourcing/usage',
        loadComponent: () =>
          import('./project-sourcing/sourcing-usage/sourcing-usage.component').then(
            (m) => m.SourcingUsageComponent,
          ),
        data: { breadcrumb: 'Usage', description: 'View and manage item usage.' },
      },
      {
        path: 'budgeting/material-list',
        redirectTo: 'variance',
        pathMatch: 'full',
      },
      {
        path: 'ppif',
        redirectTo: 'setup',
        pathMatch: 'full',
      },


      // {
      //   path: 'in-vivo-studies',
      //   loadComponent: () =>
      //     import('./project-in-vivo-studies/project-in-vivo-studies.component').then((m) => m.ProjectInVivoStudiesComponent),
      //   data: { breadcrumb: 'In Vivo Studies', description: 'Plan and monitor BA/BE, clinical, PK/PD, preclinical, toxicology and human factors studies for this project.' },
      // },
      // {
      //   path: 'in-vivo-studies/details',
      //   loadComponent: () =>
      //     import('./project-in-vivo-studies/in-vivo-study-details/in-vivo-study-details.component').then(
      //       (m) => m.InVivoStudyDetailsComponent
      //     ),
      //   data: {
      //     breadcrumb: 'In Vivo Study Details',
      //     description: 'Plan and monitor BA/BE, clinical, PK/PD, preclinical, toxicology and human factors studies for this project.'
      //   },
      // },

    ],
  },
];
