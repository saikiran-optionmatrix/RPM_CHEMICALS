import { Routes } from '@angular/router';
import { HoursComponent } from './hours.component';

export const hoursRoutes: Routes = [
  {
    path: '',
    component: HoursComponent,
    children: [
      { path: '', redirectTo: 'scheduling', pathMatch: 'full' },
      {
        path: 'scheduling',
        loadComponent: () =>
          import('./hours-scheduling/hours-scheduling.component').then(
            (c) => c.HoursSchedulingComponent
          ),
        data: {
          breadcrumb: 'Scheduling',
          description: 'Manage hours scheduling.',
        },
      },
      {
        path: 'scheduling/tasks',
        loadComponent: () =>
          import(
            './hours-scheduling/hours-scheduling-tasks/hours-scheduling-tasks.component'
          ).then((c) => c.HoursSchedulingTasksComponent),
        data: {
          breadcrumb: 'Scheduling Tasks',
          description: 'Manage hours scheduling tasks.',
        },
      },
     
      {
        path: 'timesheets',
        loadComponent: () =>
          import('./hours-timesheets/hours-timesheets.component').then(
            (c) => c.HoursTimesheetsComponent
          ),
        data: {
          breadcrumb: 'Timesheets',
          description: 'Manage hours timesheets.',
        },
      },
      {
        path: 'timesheets/slots',
        loadComponent: () =>
          import(
            './hours-timesheets/hours-timesheet-slots/hours-timesheet-slots.component'
          ).then((c) => c.HoursTimesheetSlotsComponent),
        data: {
          breadcrumb: 'Timesheet Tasks',
          description: 'View timesheet tasks breakdown.',
        },
      },
      {
        path: 'timesheets-slots',
        loadComponent: () =>
          import(
            './hours-timesheets/hours-timesheet-slots/hours-timesheet-slots.component'
          ).then((c) => c.HoursTimesheetSlotsComponent),
        data: {
          breadcrumb: 'Timesheet Tasks',
          description: 'View timesheet tasks breakdown.',
        },
      },
    ],
  },
];

export const HOURS_ROUTES = hoursRoutes;
