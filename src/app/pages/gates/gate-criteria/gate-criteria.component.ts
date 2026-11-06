import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Adjust these to your actual paths
import { AddCriteriaComponent } from './add-criteria/add-criteria.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
// import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface GateCriteria {
  id: number;
  status: boolean;
  question: string;
  description: string;
  answer: string | null;
  priority: boolean | string;
  mandatory: boolean;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-gate-criteria',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    DragDropModule
  ],
  templateUrl: './gate-criteria.component.html',
  styleUrls: ['./gate-criteria.component.scss']
})
export class GateCriteriaComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly canDelete = true;
  readonly canUpdate = true;

  currentGateContext: string = '';
  currentGateCode: string = 'Gate 1';
  currentGateName: string = 'Concept Approval';

  readonly gateDefinitions: Record<string, { gateCode: string; gateName: string; criteria: GateCriteria[] }> = {
    'concept-approval': {
      gateCode: 'Gate 1',
      gateName: 'Concept Approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Market Demand & Competitive Benchmark Assessment',
          description: 'Target applications, market size, competitor grades and customer needs documented and approved by commercial.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Chemistry & Process Feasibility Assessment',
          description: 'Reaction pathway, raw material availability and technical feasibility confirmed by process chemistry.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Preliminary Business Case & Cost of Manufacturing Model',
          description: 'Target product profile, projected cost of manufacturing, volume and NPV threshold validated by finance.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Patents & Freedom-to-Operate (FTO) Clearance',
          description: 'Formal IP landscape search and freedom-to-operate opinion documented for the chemistry, process and application.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Process Safety, Technology & Scale-Up Risk Assessment',
          description: 'Critical hazards (exotherm, toxic or flammable materials) and technology risks identified with mitigation plans.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Regulatory Pathway & Registration Strategy Outline',
          description: 'Registration pathway (REACH, TSCA, India, ASEAN) and high-level data needs outlined.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 7,
          status: true,
          question: 'Executive Committee Concept Approval Release',
          description: 'Formal executive sign-off granting authority to fund route scouting and allocate team resources.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    'route-selection': {
      gateCode: 'Gate 2',
      gateName: 'Process Route Selection',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Yield & Selectivity Profile',
          description: 'Candidate route meets yield and selectivity targets at bench scale.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Process Robustness Proof',
          description: 'Route performs consistently across repeated runs and parameter ranges.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Impurity & Waste Assessment',
          description: 'Impurity profile, by-products and waste streams meet product and environmental criteria.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Preliminary Safety Screening',
          description: 'Reaction calorimetry and thermal stability show an acceptable safety margin.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Basis of Design & Cost of Manufacturing Estimate',
          description: 'Basis of Design and projected cost of manufacturing reviewed by process engineering.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Route Selection Committee Release',
          description: 'Formal sign-off to select the route and start pilot development.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    'pilot-readiness': {
      gateCode: 'Gate 3',
      gateName: 'Registration & Pilot Readiness',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Process Hazard Analysis Package',
          description: 'HAZOP and LOPA complete with all high-risk actions closed.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Pilot Plant Readiness',
          description: 'Equipment, utilities and operating procedures ready for the pilot campaign.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Product Specification & Method Validation',
          description: 'Product specification and analytical methods validated.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Environmental & Toxicology Data Package',
          description: 'Ecotoxicology, toxicology and fate data complete for registration.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'REACH / TSCA Dossier & Regulator Advice',
          description: 'Registration dossier compiled and regulator or consultant advice incorporated.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 6,
          status: true,
          question: 'Executive Committee Registration & Pilot Release',
          description: 'Formal sign-off to file registration and start the pilot campaign.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    'demo-scale': {
      gateCode: 'Gate 4',
      gateName: 'Demo-Scale Proof',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Pilot Plant Performance Review',
          description: 'Pilot data show target yield, quality and acceptable safety performance.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Demo-Scale Campaign Results',
          description: 'Demo-scale batches meet specification with a validated, repeatable process.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Customer Qualification Evidence',
          description: 'Key customers confirm performance in their applications.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 4,
          status: true,
          question: 'Process Safety Review Outcome',
          description: 'Safety review recommends continuation with no open critical findings.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Regulatory Registration Status',
          description: 'Registration progress and authority feedback documented.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 6,
          status: true,
          question: 'Commercial Plant Design & Capex Approval',
          description: 'Plant design package and capital budget approved.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    'commercial-readiness': {
      gateCode: 'Gate 5',
      gateName: 'Commercial Production Readiness',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Commissioning & Performance Test Results',
          description: 'Plant meets guaranteed capacity, yield and quality in performance tests.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Operating Procedures & Training',
          description: 'Operating procedures complete and operators trained and certified.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Safety, Environmental & Permit Compliance',
          description: 'Pre-startup safety review complete and operating consents in force.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Labeling (GHS / CLP), SDS & Emergency Response Plan',
          description: 'Labels, SDS and emergency response plan approved.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Executive Committee Production Start Release',
          description: 'Formal sign-off to start commercial production.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    }
  };

  // Route alias mappings for backwards compatibility
  static {
    (GateCriteriaComponent.prototype as any).aliases = {
      feasibility: 'concept-approval',
      formulation: 'route-selection',
      development: 'pilot-readiness',
      testing: 'demo-scale',
      scaling: 'commercial-readiness',
      validation: 'commercial-readiness'
    };
  }

  criteriaList: GateCriteria[] = [];

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const rawContext = params.get('id') || 'concept-approval';
      const aliases: Record<string, string> = {
        feasibility: 'concept-approval',
        formulation: 'route-selection',
        development: 'pilot-readiness',
        testing: 'demo-scale',
        scaling: 'commercial-readiness',
        validation: 'commercial-readiness'
      };
      this.currentGateContext = aliases[rawContext] || rawContext;
      const def = this.gateDefinitions[this.currentGateContext] || this.gateDefinitions['concept-approval'];
      this.currentGateCode = def.gateCode;
      this.currentGateName = def.gateName;
      this.criteriaList = def.criteria.map(c => ({ ...c }));
      this.populateMetadata();
    });
  }

  readonly historySequence: number[] = [4, 2, 5, 2, 4, 7, 8, 3, 5, 2, 6, 4, 8, 2, 5, 7, 3, 6, 4, 2];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  ngOnInit(): void {
    this.populateMetadata();
  }

  private populateMetadata(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25'];
    const sampleUsers = ['Dr. Priya Raman', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel', 'Dr. Rebecca Chen'];
    this.criteriaList.forEach((c, idx) => {
      if (!c.historyCount) {
        c.historyCount = this.getHistoryCount(idx);
      }
      if (!c.updatedDate) {
        c.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!c.updatedBy) {
        c.updatedBy = sampleUsers[idx % sampleUsers.length];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDrop(event: CdkDragDrop<GateCriteria[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.criteriaList, event.previousIndex, event.currentIndex);
    }
  }

  onAddCriteria(): void {
    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '75vw',
      height: 'auto',
      data: { mode: 'add', context: this.currentGateContext }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newCriteria: GateCriteria = {
          id: this.criteriaList.length + 1,
          status: true,
          question: result.subject || result.question || '',
          description: result.description || '',
          priority: result.priority || 'High',
          mandatory: result.mandatory || false,
          answer: null,
          historyCount: 1
        };
        this.criteriaList.unshift(newCriteria);
      }
    });
  }

  onEditCriteria(item: GateCriteria): void {
    if (!this.canUpdate) return;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '1000px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        subject: item.question,
        description: item.description,
        priority: item.priority,
        mandatory: item.mandatory
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.question = result.subject || result.question || item.question;
        item.description = result.description !== undefined ? result.description : item.description;
        item.priority = result.priority || item.priority;
        item.mandatory = result.mandatory !== undefined ? result.mandatory : item.mandatory;
      }
    });
  }

  onDeleteCriteria(item: GateCriteria): void {
    if (!this.canDelete || item.TotalUsed) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.criteriaList = this.criteriaList.filter(c => c.id !== item.id);
      }
    });
  }

  // onStatusChange(item: GateCriteria): void {
  //   if (!this.canUpdate) return;

  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: {
  //       title: 'Change Status',
  //       content: 'Are you sure you want to change the status?'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (confirmed) {
  //       item.status = !item.status;
  //     }
  //   });
  // }

  onDownloadGuidelines(item: GateCriteria): void {
    console.log('Downloading guidelines for:', item.question);
    // Add physical download logic here
  }

  openHistory(item: GateCriteria, index?: number): void {
    const historyCount = item.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/gates/criteria/history'], {
      queryParams: {
        subject: item.question,
        description: item.description,
        priority: item.priority,
        mandatory: item.mandatory,
        context: this.currentGateContext,
        historyCount: historyCount
      }
    });
  }
}
