import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import {
  SourcingChecklistService,
  MaterialsPlanRow,
  ProxyProject,
  PROXY_PROJECTS,
  QAFormConfig,
  F10_CONFIG,
  F02_CONFIG,
  UploadedDoc
} from '../sourcing-checklist.service';

interface FormSectionRow {
  groupStart: boolean;
  groupEnd?: boolean;
  section: string;
  no: number;
  text: string;
  sterile: boolean;
  obsKey: string;
  assessKey: string;
}

@Component({
  selector: 'app-pre-qualification-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './pre-qualification-checklist.component.html',
  styleUrl: './pre-qualification-checklist.component.scss'
})
export class PreQualificationChecklistComponent implements OnInit, OnDestroy {
  activeProject: ProxyProject = PROXY_PROJECTS[2];
  planRows: MaterialsPlanRow[] = [];
  selectedRm: string = 'RM-009';
  selectedCase?: MaterialsPlanRow;

  activeMode: 'F10' | 'F02' = 'F10';
  f10Config = F10_CONFIG;
  f02Config = F02_CONFIG;

  readonly sections: string[] = [
    'I. Warehouse',
    'II. Production',
    'III. Quality Control',
    'IV. Engineering',
    'V. Administration',
    'VI. Quality Assurance'
  ];
  selectedSection: string = 'I. Warehouse';
  savedSectionFeedback: string | null = null;

  private sub = new Subscription();

  constructor(
    public service: SourcingChecklistService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activeProject = this.service.activeProject || PROXY_PROJECTS[2];
    this.loadCases();

    this.sub.add(
      this.route.queryParams.subscribe(params => {
        const matId = params['materialId'];
        if (matId) {
          this.selectedRm = matId;
          this.service.setSelectedRm(matId);
          if (this.planRows.length > 0) {
            this.selectedCase = this.planRows.find(r => r.id === matId);
          }
          this.cdr.markForCheck();
        }
      })
    );

    this.sub.add(
      this.service.activeProject$.subscribe(project => {
        if (project) {
          this.activeProject = project;
          this.loadCases();
          this.cdr.markForCheck();
        }
      })
    );

    this.sub.add(
      this.service.selectedRm$.subscribe(rm => {
        if (rm) {
          this.selectedRm = rm;
          this.selectedCase = this.planRows.find(r => r.id === rm);
          this.cdr.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadCases(): void {
    if (!this.activeProject) return;
    this.planRows = this.service.getComputedPlanRows(this.activeProject.id);
    if (this.planRows.length > 0) {
      if (!this.planRows.some(r => r.id === this.selectedRm)) {
        this.selectedRm = this.planRows[0].id;
        this.service.setSelectedRm(this.selectedRm);
      }
      this.selectedCase = this.planRows.find(r => r.id === this.selectedRm);
    }
  }

  selectCase(rmId: string): void {
    this.selectedRm = rmId;
    this.service.setSelectedRm(rmId);
    this.selectedCase = this.planRows.find(r => r.id === rmId);
    this.cdr.markForCheck();
  }

  setMode(mode: 'F10' | 'F02'): void {
    this.activeMode = mode;
    this.cdr.markForCheck();
  }

  getCurrentConfig(): QAFormConfig {
    return this.activeMode === 'F10' ? this.f10Config : this.f02Config;
  }

  getCurrentMethod(): 'fill' | 'upload' {
    return this.service.getMethod(this.selectedRm + '|' + this.activeMode);
  }

  setMethod(method: 'fill' | 'upload'): void {
    this.service.setMethod(this.selectedRm + '|' + this.activeMode, method);
    this.cdr.markForCheck();
  }

  isSterile(): boolean {
    return this.service.isSterile(this.selectedRm);
  }

  toggleSterile(): void {
    this.service.toggleSterile(this.selectedRm);
    this.cdr.markForCheck();
  }

  getFormRows(): FormSectionRow[] {
    const config = this.getCurrentConfig();
    const rows: FormSectionRow[] = [];
    const sterileOn = this.isSterile();

    config.sections.forEach(sec => {
      const validItems = sec[1]
        .map((text, i) => ({ text, index: i + 1 }))
        .filter(item => !item.text.startsWith('§') || sterileOn);

      validItems.forEach((item, idx) => {
        const isSterileItem = item.text.startsWith('§');
        const displayText = isSterileItem ? item.text.slice(1) : item.text;
        const keyBase = `${this.selectedRm}|${config.id}|${sec[0]}|${item.index}`;

        rows.push({
          groupStart: idx === 0,
          groupEnd: idx === validItems.length - 1,
          section: sec[0],
          no: item.index,
          text: displayText,
          sterile: isSterileItem,
          obsKey: keyBase,
          assessKey: keyBase
        });
      });
    });

    return rows;
  }

  saveSection(sectionTitle: string): void {
    this.savedSectionFeedback = sectionTitle;
    this.cdr.markForCheck();

    setTimeout(() => {
      if (this.savedSectionFeedback === sectionTitle) {
        this.savedSectionFeedback = null;
        this.cdr.markForCheck();
      }
    }, 3000);
  }

  getObservation(key: string): string {
    return this.service.getObservation(key);
  }

  setObservation(key: string, val: string): void {
    this.service.setObservation(key, val);
  }

  getAssessment(key: string): string {
    return this.service.getAssessment(key);
  }

  setAssessment(key: string, val: string): void {
    this.service.setAssessment(key, val);
    this.cdr.markForCheck();
  }

  getOutcome(): string {
    return this.service.getOutcome(this.selectedRm + '|' + this.activeMode);
  }

  setOutcome(val: string): void {
    this.service.setOutcome(this.selectedRm + '|' + this.activeMode, val);
    this.cdr.markForCheck();
  }

  getUploadedFiles(): UploadedDoc[] {
    return this.service.getFiles(this.selectedRm + '|' + this.activeMode);
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const sizeStr = file.size > 1048576
        ? (file.size / 1048576).toFixed(1) + ' MB'
        : Math.max(1, Math.round(file.size / 1024)) + ' KB';

      const doc: UploadedDoc = {
        name: file.name,
        size: file.size,
        sizeFormatted: sizeStr,
        when: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: i === 0 ? 'Filled checklist' : 'GMP / licence certificate'
      };
      this.service.addFile(this.selectedRm + '|' + this.activeMode, doc);
    }
    input.value = '';
    this.cdr.markForCheck();
  }

  removeFile(index: number): void {
    this.service.removeFile(this.selectedRm + '|' + this.activeMode, index);
    this.cdr.markForCheck();
  }

  getSectionItemCount(sec: string): number {
    const config = this.getCurrentConfig();
    const found = config.sections.find(s => s[0] === sec);
    if (!found) return 0;
    const sterileOn = this.isSterile();
    return found[1].filter(item => !item.startsWith('§') || sterileOn).length;
  }

  getSectionAssessedCount(sec: string): number {
    const config = this.getCurrentConfig();
    const found = config.sections.find(s => s[0] === sec);
    if (!found) return 0;
    const sterileOn = this.isSterile();
    let count = 0;
    found[1].forEach((item, i) => {
      if (item.startsWith('§') && !sterileOn) return;
      const key = `${this.selectedRm}|${config.id}|${sec}|${i + 1}`;
      if (this.service.getAssessment(key)) {
        count++;
      }
    });
    return count;
  }

  getSectionProgress(sec: string): number {
    const total = this.getSectionItemCount(sec);
    if (total === 0) return 0;
    const assessed = this.getSectionAssessedCount(sec);
    return Math.round((assessed / total) * 100);
  }

  getSectionAnchorId(section: string): string {
    return 'sec-' + section.replace(/[^a-zA-Z0-9]/g, '-');
  }

  scrollToSection(sec: string): void {
    this.selectedSection = sec;
    if (this.getCurrentMethod() === 'upload') {
      this.setMethod('fill');
    }

    setTimeout(() => {
      const elId = this.getSectionAnchorId(sec);
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }

  getAssessedStats(mode: 'F10' | 'F02'): { assessed: number; total: number; isDone: boolean; sub: string } {
    const cfg = mode === 'F10' ? this.f10Config : this.f02Config;
    const sterileOn = this.isSterile();
    let total = 0;
    let assessed = 0;

    cfg.sections.forEach(sec => {
      sec[1].forEach((item, i) => {
        if (item.startsWith('§') && !sterileOn) return;
        total++;
        const key = `${this.selectedRm}|${mode}|${sec[0]}|${i + 1}`;
        if (this.service.getAssessment(key)) {
          assessed++;
        }
      });
    });

    const meth = this.service.getMethod(this.selectedRm + '|' + mode);
    const files = this.service.getFiles(this.selectedRm + '|' + mode);
    const outcome = this.service.getOutcome(this.selectedRm + '|' + mode);

    const isDone = meth === 'upload' ? files.length > 0 && !!outcome : (assessed > 0 && assessed === total && !!outcome);
    let sub = '';
    if (meth === 'upload') {
      sub = files.length > 0 ? `${files.length} document${files.length > 1 ? 's' : ''} uploaded` : 'Upload pending';
    } else {
      sub = `${assessed}/${total} assessed`;
    }
    if (outcome) {
      sub += ` · ${outcome}`;
    }

    return { assessed, total, isDone, sub };
  }

  getCaseProgress(rmId: string): number {
    const f10Done = !!this.service.getOutcome(rmId + '|F10');
    const f02Done = !!this.service.getOutcome(rmId + '|F02');
    let count = 0;
    if (f10Done) count += 50;
    if (f02Done) count += 50;
    return count;
  }

  submitForApproval(): void {
    const outcome = this.getOutcome();
    if (!outcome) {
      alert('Please select a QA outcome before submitting.');
      return;
    }
    alert(`QA Qualification for ${this.selectedCase?.id} (${this.activeMode}) submitted successfully with status: ${outcome}!`);
  }
}
