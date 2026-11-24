import { Routes } from '@angular/router';
import { AvailabilityComponent } from './availability.component';

export const availabilityRoutes: Routes = [
    {
        path: '',
        component: AvailabilityComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'working-days',
            },
            {
                path: 'working-days',
                loadComponent: () =>
                    import('./working-days/working-days.component').then(
                        (m) => m.WorkingDaysComponent,
                    ),
                data: {
                    breadcrumb: 'Working Days',
                    description: 'Manage working days.',
                },
            },
            {
                path: 'holidays',
                loadComponent: () =>
                    import('./holidays/holidays.component').then(
                        (m) => m.HolidaysComponent,
                    ),
                data: {
                    breadcrumb: 'Holidays',
                    description: 'Manage holidays.',
                },
            },
        ],
    },
];
