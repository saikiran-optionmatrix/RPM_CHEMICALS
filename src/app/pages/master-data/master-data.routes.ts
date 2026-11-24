// src/app/pages/master-data/master-data.routes.ts
import { Routes } from '@angular/router';
import { MasterDataComponent } from './master-data.component';
import { authGuard } from '../../common/guards/auth.guard';

export const MASTER_DATA_ROUTES: Routes = [
  {
    path: 'template-dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./templates/template-dashboard/template-dashboard.routes').then(
        (m) => m.templateDashboardRoutes,
      ),


  },
  // {
  //   path: 'templates/dashboard',
  //   canActivate: [authGuard],
  //   loadChildren: () =>
  //     import('./templates/template-dashboard/template-dashboard.routes').then(
  //       (m) => m.templateDashboardRoutes,
  //     ),
  // },
  {
    path: '',
    component: MasterDataComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assets',
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./assets/assets.component').then((m) => m.AssetsComponent),
        data: {
          breadcrumb: 'Resources',
          description: 'Configure and monitor company Resources.',
        },
      },
      {
        path: 'molecules',
        loadComponent: () =>
          import('./molecules/molecules.component').then((m) => m.MoleculesComponent),
        data: {
          breadcrumb: 'Molecules',
          description: 'Maintain chemical compound and molecule registries.',
        },
      },
      {
        path: 'material-codes',
        loadComponent: () =>
          import('./inventory-items/inventory-items.component').then((m) => m.InventoryItemsComponent),
        data: {
          breadcrumb: 'Material Codes',
          description: 'Track stock balances, lot numbers, and current inventory.',
        },
      },
      {
        path: 'material-codes/history',
        loadComponent: () =>
          import('./inventory-items/material-codes-history/material-codes-history.component').then(
            (m) => m.MaterialCodesHistoryComponent
          ),
        data: {
          breadcrumb: 'Material Codes History',
          description: 'View material code audit revisions and change history.',
        },
      },
      {
        path: 'material-types',
        loadComponent: () =>
          import('./material-types/material-types.component').then((m) => m.MaterialTypesComponent),
        data: {
          breadcrumb: 'Material Types',
          description: 'Configure and monitor standard material types.',
        },
      },
      {
        path: 'material-groups',
        loadComponent: () =>
          import('./material-groups/material-groups.component').then((m) => m.MaterialGroupsComponent),
        data: {
          breadcrumb: 'Material Groups',
          description: 'Configure and monitor standard material groups.',
        },
      },
      // {
      //   path: 'item-categories',
      //   loadComponent: () =>
      //     import('./item-categories/item-categories.component').then((m) => m.ItemCategoriesComponent),
      //   data: {
      //     breadcrumb: 'Item Categories',
      //     description: 'Classify inventory items into primary business categories.',
      //   },
      // },
      {
        path: 'item-sub-categories',
        loadComponent: () =>
          import('./item-sub-categories/item-sub-categories.component').then((m) => m.ItemSubCategoriesComponent),
        data: {
          breadcrumb: 'Item Sub Categories',
          description: 'Define granular sub-classifications for inventory items.',
        },
      },
      {
        path: 'facilities',
        loadComponent: () =>
          import('./facilities/facilities.component').then((m) => m.FacilitiesComponent),
        data: {
          breadcrumb: 'Facilities',
          description: 'Manage facility locations, laboratories, and physical spaces.',
        },
      },
      {
        path: 'project-types',
        loadComponent: () =>
          import('./project-types/project-types.component').then((m) => m.ProjectTypesComponent),
        data: {
          breadcrumb: 'Markets',
          description: 'Configure markets and operational regions.',
        },
      },
      {
        path: 'markets',
        redirectTo: 'project-types',
        pathMatch: 'full',
      },
      {
        path: 'project-statuses',
        loadComponent: () =>
          import('./project-statuses/project-statuses.component').then((m) => m.ProjectStatusesComponent),
        data: {
          breadcrumb: 'Dosage Forms',
          description: 'Configure and manage dosage forms.',
        },
      },
      {
        path: 'dosage-forms',
        redirectTo: 'project-statuses',
        pathMatch: 'full',
      },
      {
        path: 'sections',
        loadComponent: () =>
          import('./sections/sections.component').then((m) => m.SectionsComponent),
        data: {
          breadcrumb: 'Sections',
          description: 'Configure organizational sections and business divisions.',
        },
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./departments/departments.component').then((m) => m.DepartmentsComponent),
        data: {
          breadcrumb: 'Departments',
          description: 'Organize team structures and corporate departments.',
        },
      },
      {
        path: 'divisions',
        loadComponent: () =>
          import('./divisions/divisions.component').then((m) => m.DivisionsComponent),
        data: {
          breadcrumb: 'Divisions',
          description: 'Configure and monitor company business divisions.',
        },
      },
      {
        path: 'divisions/stages-gates',
        loadComponent: () =>
          import('./divisions/division-stages-gates/division-stages-gates.component').then(
            (m) => m.DivisionStagesGatesComponent
          ),
        data: {
          breadcrumb: 'Division Stages & Gates',
          description: 'Allocate and manage gates to stages for the selected division.',
        },
      },
      {
        path: 'job-codes',
        loadComponent: () =>
          import('./job-codes/job-codes.component').then((m) => m.JobCodesComponent),
        data: {
          breadcrumb: 'Job Codes',
          description: 'Maintain standardized employee and role job codes.',
        },
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./tags/tags.component').then((m) => m.TagsComponent),
        data: {
          breadcrumb: 'Tags',
          description: 'The tag master can be managed here.',
        },
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./groups/groups.component').then((m) => m.GroupsComponent),
        data: {
          breadcrumb: 'Groups',
          description: 'The list of groups can be managed here.',
        },
      },
      {
        path: 'sites',
        loadComponent: () =>
          import('./sites/sites.component').then((m) => m.SitesComponent),
        data: {
          breadcrumb: 'Locations',
          description: 'The list of Locations can be managed here.',
        },
      },
      {
        path: 'states',
        loadComponent: () =>
          import('./states/states.component').then((m) => m.StatesComponent),
        data: {
          breadcrumb: 'States',
          description: 'The list of states can be managed here.',
        },
      },
      {
        path: 'cities',
        loadComponent: () =>
          import('./cities/cities.component').then((m) => m.CitiesComponent),
        data: {
          breadcrumb: 'Cities',
          description: 'The list of cities can be managed here.',
        },
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./templates/templates.component').then((m) => m.TemplatesComponent),
        data: {
          breadcrumb: 'Templates',
          description: 'The list of templates can be managed here.',
        },
      },


      {
        path: 'delay-reasons',
        loadComponent: () =>
          import('./delay-reasons/delay-reasons.component').then((m) => m.DelayReasonsComponent),
        data: {
          breadcrumb: 'Delay Reasons',
          description: 'The list of delay reasons can be managed here.',
        },
      },
      {
        path: 'dependency-type',
        loadComponent: () =>
          import('./dependency-type/dependency-type.component').then((m) => m.DependencyTypeComponent),
        data: {
          breadcrumb: 'Dependency Type',
          description: 'The list of Dependency Type can be Viewed.',
        },
      },
      {
        path: 'ttd-master',
        loadComponent: () =>
          import('./ttd-master/ttd-master.component').then((m) => m.TtdMasterComponent),
        data: {
          breadcrumb: 'TTD Master',
          description: 'The list of TTD Master can be Viewed.',
        },
      },
      {
        path: 'dimension-master',
        loadComponent: () =>
          import('./dimension-master/dimension-master.component').then((m) => m.DimensionMasterComponent),
        data: {
          breadcrumb: 'Dimension Master',
          description: 'The list of Dimension Master can be Viewed.',
        },
      },
      {
        path: 'vendor-types',
        loadComponent: () =>
          import('./vendor-types/vendor-types.component').then((m) => m.VendorTypesComponent),
        data: {
          breadcrumb: 'Vendor Types',
          description: 'The list of Vendor Types can be Viewed.',
        },
      },
      {
        path: 'vendor-types/checklist',
        loadComponent: () =>
          import('./vendor-types/vendor-checklist/vendor-checklist.component').then((m) => m.VendorChecklistComponent),
        data: {
          breadcrumb: 'Vendor Checklist',
          description: 'The list of Vendor Checklists can be Viewed.',
        },
      },

      {
        path: 'rejection-reasons',
        loadComponent: () =>
          import('./rejection-reasons/rejection-reasons.component').then((m) => m.RejectionReasonsComponent),
        data: {
          breadcrumb: 'Rejection Reasons',
          description: 'The list of Rejection Reasons can be Viewed.',
        },
      },




    ],
  },
];
