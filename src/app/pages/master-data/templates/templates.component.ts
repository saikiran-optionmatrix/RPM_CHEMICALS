import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { RouterLink } from '@angular/router';

interface TemplateItem {
  name: string;
  description: string;
  division: string;
  projectType: string;
  stages: number;
  gates: number;
  deliverables: number;
  activities: number;
  sprint: number;
  buffer: number;
  planEffort?: string;
  planDuration?: string;
  period?: string;
  resources: number;
  budget: string;
  updatedDate: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-templates',
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent {
  constructor(private dialog: MatDialog) {}

  readonly items: TemplateItem[] = [
    {
      name: 'Specialty Chemical Process Development Program',
      description: 'End-to-end specialty chemical development covering route scouting, lab and pilot process development, process safety studies, registration and stage-gate delivery to commercial scale',
      division: 'Specialty Chemicals - SC',
      projectType: 'New Product & Process Development',
      stages: 12,
      gates: 5,
      deliverables: 38,
      activities: 142,
      sprint: 16,
      buffer: 45,
      planEffort: '3,450 hrs',
      planDuration: '420 days',
      period: 'days',
      resources: 24,
      budget: '14,500,000',
      updatedDate: '02-Sep-2026',
      status: 'Active',
    },
    {
      name: 'Polymer & Resin Product Development Program',
      description: 'Polymer or resin development including monomer selection, polymerization process development, grade optimization and customer qualification for commercial supply',
      division: 'Polymers & Resins - PR',
      projectType: 'New Product & Process Development',
      stages: 12,
      gates: 5,
      deliverables: 36,
      activities: 135,
      sprint: 14,
      buffer: 40,
      planEffort: '2,980 hrs',
      planDuration: '380 days',
      period: 'days',
      resources: 20,
      budget: '11,200,000',
      updatedDate: '28-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Agrochemical Active Ingredient Process Development',
      description: 'Multi-step synthesis route design, intermediate process development, impurity control, scale-up and registration data generation for an agrochemical active ingredient',
      division: 'Agrochemicals - AC',
      projectType: 'New Product & Process Development',
      stages: 12,
      gates: 5,
      deliverables: 32,
      activities: 118,
      sprint: 12,
      buffer: 35,
      planEffort: '2,420 hrs',
      planDuration: '310 days',
      period: 'days',
      resources: 18,
      budget: '8,750,000',
      updatedDate: '25-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Continuous Flow Process Development Platform',
      description: 'Continuous flow reactor design, residence time optimization, process analytical control, scale-out and stability evaluation for fine chemical intermediates',
      division: 'Industrial & Fine Chemicals - IF',
      projectType: 'New Product & Process Development',
      stages: 12,
      gates: 5,
      deliverables: 28,
      activities: 96,
      sprint: 10,
      buffer: 30,
      planEffort: '1,840 hrs',
      planDuration: '260 days',
      period: 'days',
      resources: 14,
      budget: '5,600,000',
      updatedDate: '20-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Commercial-Scale Plant Scale-Up & Technology Transfer',
      description: 'Large-scale reactor technology transfer, process performance qualification, commercial plant readiness and registration support',
      division: 'Specialty Chemicals - SC',
      projectType: 'Scale-Up & Plant Technology Transfer',
      stages: 12,
      gates: 5,
      deliverables: 34,
      activities: 124,
      sprint: 15,
      buffer: 40,
      planEffort: '3,100 hrs',
      planDuration: '400 days',
      period: 'days',
      resources: 22,
      budget: '12,800,000',
      updatedDate: '18-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Product Reformulation & Post-Registration Change',
      description: 'Formulation and packaging update, comparability studies, storage stability re-evaluation and regulatory variation filing',
      division: 'Industrial & Fine Chemicals - IF',
      projectType: 'Scale-Up & Plant Technology Transfer',
      stages: 12,
      gates: 5,
      deliverables: 24,
      activities: 82,
      sprint: 8,
      buffer: 20,
      planEffort: '1,260 hrs',
      planDuration: '180 days',
      period: 'days',
      resources: 10,
      budget: '3,450,000',
      updatedDate: '12-Aug-2026',
      status: 'Active',
    }
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredItems(): TemplateItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.division && item.division.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        item.projectType.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): TemplateItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  onAdd(): void {
    console.log('Add template clicked');
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: TemplateItem): void {
    const dialogRef = this.dialog.open(EditTemplateComponent, {
      width: '600px',
      minWidth:'600px',
      maxHeight: '100vh',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        Object.assign(item, result);
      }
    });
  }

  onDelete(item: TemplateItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: TemplateItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
