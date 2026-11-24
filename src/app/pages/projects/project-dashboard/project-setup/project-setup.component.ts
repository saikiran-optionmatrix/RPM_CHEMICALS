import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AddDeliverableComponent } from '../../../stages/stages-wbs/add-deliverable/add-deliverable.component';
import { AddActivityComponent } from '../../../stages/stages-wbs/add-activity/add-activity.component';
import { AddCriteriaComponent } from '../../../gates/gate-criteria/add-criteria/add-criteria.component';
import { CHEMICAL_STAGES } from './project-setup.data';

// Interfaces to define our hierarchical data structure
export interface TaskItem {
  id: number;
  slNo?: string;
  name: string;
  description?: string;
  completed: boolean;
}

export interface ModuleItem {
  id: number;
  slNo?: string;
  name: string;
  description?: string;
  completed?: boolean;
  tasks: TaskItem[];
}

export interface StageItem {
  id: number;
  slNo?: string;
  name: string;
  type: 'stage' | 'gate';
  completed?: boolean;
  modules: ModuleItem[];
  tasks?: TaskItem[];
}

@Component({
  selector: 'app-project-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './project-setup.component.html',
  styleUrl: './project-setup.component.scss',
})
export class ProjectSetupComponent implements OnInit {

  // Project Header Properties
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Acrylic Emulsion Binder 50% Solids - 2026/CHM/006';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      this.loadProjectData();
    });

    if (!this.selectedStage) {
      this.loadProjectData();
    }
  }

  loadProjectData(): void {
    // Master stages and gates matched with stages.component.ts and gates.component.ts
    this.stagesAndGates = JSON.parse(JSON.stringify(CHEMICAL_STAGES));
    this.ensureSequenceNumbers(this.stagesAndGates);

    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  /**
   * Automatically generates sequence numbers (slNo) matching StagesWbsComponent
   * - Deliverable: e.g. 1.1, 1.2, 1.3
   * - Activity: e.g. 1.1.1, 1.1.2, 1.1.3
   * - Gate Checklist: e.g. G1.1, G1.2
   */
  ensureSequenceNumbers(stages: StageItem[]): void {
    let stageCounter = 1;
    let gateCounter = 1;

    for (const item of stages) {
      if (item.type === 'stage') {
        const sMatch = item.name.match(/^S(\d+)/i);
        const stageNum = sMatch ? sMatch[1] : `${stageCounter}`;
        stageCounter++;

        if (!item.slNo) {
          item.slNo = `${stageNum}`;
        }

        if (item.modules) {
          item.modules.forEach((mod, mIdx) => {
            if (!mod.slNo) {
              mod.slNo = `${stageNum}.${mIdx + 1}`;
            }
            if (mod.tasks) {
              mod.tasks.forEach((task, tIdx) => {
                if (!task.slNo) {
                  task.slNo = `${mod.slNo}.${tIdx + 1}`;
                }
              });
            }
          });
        }
      } else if (item.type === 'gate') {
        const gMatch = item.name.match(/Gate\s*(\d+)/i);
        const gateNum = gMatch ? gMatch[1] : `${gateCounter}`;
        gateCounter++;

        if (!item.slNo) {
          item.slNo = `G${gateNum}`;
        }

        if (item.tasks) {
          item.tasks.forEach((task, tIdx) => {
            if (!task.slNo) {
              task.slNo = `G${gateNum}.${tIdx + 1}`;
            }
          });
        }
      }
    }
  }

  // --- Stage & Module Selection ---

  selectStage(stage: StageItem | null) {
    this.selectedStage = stage;
    if (stage && stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem) {
    this.selectedModule = moduleItem;
  }

  // --- Dialog Actions with Sequence Numbers ---

  openAddDeliverableDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const sMatch = this.selectedStage.name.match(/^S(\d+)/i);
    let stageIndex = 1;
    if (sMatch) {
      stageIndex = parseInt(sMatch[1], 10);
    } else {
      const idx = this.stagesAndGates.filter(s => s.type === 'stage').indexOf(this.selectedStage);
      stageIndex = idx >= 0 ? idx + 1 : 1;
    }
    const nextSeq = `${stageIndex}.${(this.selectedStage.modules?.length || 0) + 1}`;

    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        stage: this.selectedStage.name,
        sequence: nextSeq,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.deliverableName || result.name)) {
        const newModule: ModuleItem = {
          id: Date.now(),
          slNo: result.stage || nextSeq,
          name: result.deliverableName || result.name,
          description: result.description || '',
          completed: false,
          tasks: []
        };
        if (!this.selectedStage!.modules) {
          this.selectedStage!.modules = [];
        }
        this.selectedStage!.modules.push(newModule);
        this.selectedModule = newModule;
      }
    });
  }

  openAddActivityDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const deliverables = this.selectedStage.modules?.map(m => m.name) || [];
    const currentDeliverable = this.selectedModule?.name || (deliverables.length > 0 ? deliverables[0] : '');

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '96vh',
      data: {
        stage: this.selectedStage.name,
        deliverable: currentDeliverable,
        deliverables: deliverables.length > 0 ? deliverables : [currentDeliverable || 'Deliverable'],
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.activityName || result.task)) {
        let targetModule = this.selectedModule;
        if (result.deliverable && this.selectedStage?.modules) {
          const found = this.selectedStage.modules.find(m => m.name === result.deliverable);
          if (found) targetModule = found;
        }

        const modSeq = targetModule?.slNo || '1.1';
        const nextTaskSeq = `${modSeq}.${(targetModule?.tasks?.length || 0) + 1}`;

        const newActivity: TaskItem = {
          id: Date.now(),
          slNo: nextTaskSeq,
          name: result.activityName || result.task,
          description: result.description || '',
          completed: false
        };

        if (targetModule) {
          if (!targetModule.tasks) {
            targetModule.tasks = [];
          }
          targetModule.tasks.push(newActivity);
        }
      }
    });
  }

  openAddCriteriaDialog(): void {
    if (!this.selectedStage || this.selectedStage.type !== 'gate') return;

    const gMatch = this.selectedStage.name.match(/Gate\s*(\d+)/i);
    const gateNum = gMatch ? gMatch[1] : '1';
    const nextCriterionSeq = `G${gateNum}.${(this.selectedStage.tasks?.length || 0) + 1}`;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.subject || result.question || result.name)) {
        const newCriterion: TaskItem = {
          id: Date.now(),
          slNo: nextCriterionSeq,
          name: result.subject || result.question || result.name || '',
          description: result.description || '',
          completed: false
        };

        if (this.selectedStage) {
          if (!this.selectedStage.tasks) {
            this.selectedStage.tasks = [];
          }
          this.selectedStage.tasks.push(newCriterion);
        }
      }
    });
  }

  editItem(item: any, type: string) {
    if (type === 'Criterion') {
      const dialogRef = this.dialog.open(AddCriteriaComponent, {
        width: '900px',
        maxWidth: '95vw',
        height: 'auto',
        data: {
          mode: 'edit',
          id: item.id,
          subject: item.name,
          question: item.name,
          description: item.description,
          priority: item.priority || 'High',
          mandatory: item.mandatory || false
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.subject || result.question || result.name || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Module' || type === 'Deliverable') {
      const dialogRef = this.dialog.open(AddDeliverableComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          sequence: item.slNo || '',
          deliverableName: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && (result.deliverableName || result.name)) {
          item.name = result.deliverableName || result.name;
          if (result.stage) {
            item.slNo = result.stage;
          }
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Task' || type === 'Activity') {
      const deliverables = this.selectedStage?.modules?.map(m => m.name) || [];
      const dialogRef = this.dialog.open(AddActivityComponent, {
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '96vh',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverable: this.selectedModule?.name || '',
          deliverables: deliverables.length > 0 ? deliverables : [this.selectedModule?.name || 'Deliverable'],
          activityName: item.name,
          task: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.activityName || result.task || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    }
  }

  deleteItem(item: any, type: string) {
    if (type === 'Task' || type === 'Criterion' || type === 'Activity') {
      if (this.selectedStage?.type === 'gate' && this.selectedStage.tasks) {
        const idx = this.selectedStage.tasks.indexOf(item);
        if (idx > -1) this.selectedStage.tasks.splice(idx, 1);
      } else if (this.selectedModule && this.selectedModule.tasks) {
        const idx = this.selectedModule.tasks.indexOf(item);
        if (idx > -1) this.selectedModule.tasks.splice(idx, 1);
      }
    } else if (type === 'Module' || type === 'Deliverable') {
      if (this.selectedStage && this.selectedStage.modules) {
        const idx = this.selectedStage.modules.indexOf(item);
        if (idx > -1) {
          this.selectedStage.modules.splice(idx, 1);
          if (this.selectedModule === item) {
            this.selectedModule = this.selectedStage.modules[0] || null;
          }
        }
      }
    } else if (type === 'Stage/Gate') {
      const idx = this.stagesAndGates.indexOf(item);
      if (idx > -1) {
        this.stagesAndGates.splice(idx, 1);
        if (this.selectedStage === item) {
          this.selectStage(this.stagesAndGates[0] || null);
        }
      }
    }
  }

  toggleCompleted(event: Event, item: any) {
    event.stopPropagation();
    item.completed = !item.completed;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/stages'], {
      queryParams: { code: this.projectCode || "2026/CHM/001", name: this.projectName || "Acrylic Emulsion Binder 50% Solids" }
    });
  }

}



