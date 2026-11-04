import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-timeline.component.html',
  styleUrls: ['./dashboard-timeline.component.scss']
})
export class DashboardTimelineComponent implements OnInit, AfterViewInit {

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  canScrollLeft = false;
  canScrollRight = true;

  projects = [
    'Waterborne Polyurethane Dispersion (PUD) Discovery Project',
    'Hydrogenation Catalyst Development (Pd/C)',
    'Agrochemical Active Ingredient Multi-Step Synthesis Development',
    'Solvent Recovery & Fractional Distillation Process Development',
    'Water-Dispersible Granule (WDG) Formulation Development',
    'Acrylic Emulsion Binder 50% Solids',
    'Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)',
    'Sodium Lauryl Ether Sulfate (SLES) 70% Paste',
    'Fumed Silica (Hydrophilic, 200 m2/g)',
    'Hydrogen Peroxide 50% w/w (Anthraquinone Process)'
  ];

  mainStages = [
    { key: 'g1', label: 'Concept Approval (Gate 1)' },
    { key: 'g2', label: 'Process Route Selection (Gate 2)' },
    { key: 'g3', label: 'Registration & Pilot Readiness (Gate 3)' },
    { key: 'g4', label: 'Demo-Scale Proof (Gate 4)' },
    { key: 'g5', label: 'Commercial Production Readiness (Gate 5)' }
  ];

  selectedProject = 'Waterborne Polyurethane Dispersion (PUD) Discovery Project';
  selectedStageFilter = 'g1';

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Specialty Chemicals - SC',
    'Polymers & Resins - PR',
    'Agrochemicals - AC',
    'Industrial & Fine Chemicals - IF',
  ];

  readonly locationsList: string[] = [
    'All',
    'Ahmedabad',
    'Hyderabad',
    'Mumbai',
    'Pune',
    'Vadodara',
    'Bengaluru',
    'Chennai',
    'Delhi',
    'Baddi',
  ];

  calendarDays: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  ganttData: any[] = [];

  filteredGanttData: any[] = [];

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: any = null;

  ngOnInit() {
    this.initGanttData();
    this.applyGanttFilter();
  }

  initGanttData() {
    this.ganttData = [];
    this.projects.forEach(p => {
      const isBenchmark = p.includes('Acrylic Emulsion Binder') || p.includes('Liquid Epoxy') || p.includes('Sodium Lauryl') || p.includes('Fumed Silica');

      // Gate 1: Concept Approval
      if (isBenchmark) {
        this.ganttData.push(
          { task: '1. Benchmark Grade Sourcing & Analytical Characterization', start: Date.UTC(2026, 4, 1), end: Date.UTC(2026, 4, 8), completion: 100, gate: 'g1', project: p },
          { task: '2. Raw Material & Process Route Evaluation', start: Date.UTC(2026, 4, 5), end: Date.UTC(2026, 4, 14), completion: 100, gate: 'g1', project: p },
          { task: '3. Critical Quality Attribute (CQA) and Performance Specification Profiling', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 18), completion: 100, gate: 'g1', project: p },
          { task: '4. Analytical Method Feasibility & Equivalence Testing Plan', start: Date.UTC(2026, 4, 12), end: Date.UTC(2026, 4, 22), completion: 100, gate: 'g1', project: p },
          { task: '5. Preliminary Cost of Manufacturing & Plant Feasibility', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 25), completion: 100, gate: 'g1', project: p },
          { task: '6. Concept Approval Go/No-Go Gate 1 Approval', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 28), completion: 100, gate: 'g1', project: p }
        );
      } else {
        this.ganttData.push(
          { task: '1. Market, Application & Competitor Grade Review', start: Date.UTC(2026, 4, 1), end: Date.UTC(2026, 4, 8), completion: 100, gate: 'g1', project: p },
          { task: '2. Raw Material Source & Supplier Evaluation', start: Date.UTC(2026, 4, 5), end: Date.UTC(2026, 4, 14), completion: 100, gate: 'g1', project: p },
          { task: '3. Reaction Pathway & Chemistry Feasibility Screening', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 18), completion: 100, gate: 'g1', project: p },
          { task: '4. Catalyst, Solvent & Material Compatibility Screening', start: Date.UTC(2026, 4, 12), end: Date.UTC(2026, 4, 22), completion: 100, gate: 'g1', project: p },
          { task: '5. Preliminary Cost of Manufacturing & Capex Estimate', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 25), completion: 100, gate: 'g1', project: p },
          { task: '6. Concept Approval Go/No-Go Gate 1 Approval', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 28), completion: 100, gate: 'g1', project: p }
        );
      }

      // Gate 2: Process Route Selection
      this.ganttData.push(
        { task: '1. Lab Scale Reaction Parameter Optimization (DoE)', start: Date.UTC(2026, 4, 2), end: Date.UTC(2026, 4, 11), completion: 90, gate: 'g2', project: p },
        { task: '2. Solvent Recovery & By-product Profiling', start: Date.UTC(2026, 4, 8), end: Date.UTC(2026, 4, 18), completion: 80, gate: 'g2', project: p },
        { task: '3. Preliminary Process Hazard Analysis (PHA)', start: Date.UTC(2026, 4, 13), end: Date.UTC(2026, 4, 23), completion: 65, gate: 'g2', project: p },
        { task: '4. Preliminary Mass & Energy Balance Flowsheet', start: Date.UTC(2026, 4, 17), end: Date.UTC(2026, 4, 27), completion: 50, gate: 'g2', project: p },
        { task: '5. Process Route Selection & Basis of Design Gate 2 Sign-off', start: Date.UTC(2026, 4, 22), end: Date.UTC(2026, 4, 30), completion: 30, gate: 'g2', project: p }
      );

      // Gate 3: Registration & Pilot Readiness
      this.ganttData.push(
        { task: '1. REACH / TSCA Regulatory Dossier Strategy', start: Date.UTC(2026, 4, 3), end: Date.UTC(2026, 4, 14), completion: 75, gate: 'g3', project: p },
        { task: '2. Analytical & Quality Method Validation Protocol', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 20), completion: 60, gate: 'g3', project: p },
        { task: '3. Pilot Plant Equipment Train Clearance & Safety Review', start: Date.UTC(2026, 4, 14), end: Date.UTC(2026, 4, 25), completion: 45, gate: 'g3', project: p },
        { task: '4. Pilot Campaign Raw Material & Catalyst Procurement', start: Date.UTC(2026, 4, 19), end: Date.UTC(2026, 4, 29), completion: 30, gate: 'g3', project: p },
        { task: '5. Pilot Campaign Readiness Gate 3 Authorization', start: Date.UTC(2026, 4, 24), end: Date.UTC(2026, 4, 30), completion: 15, gate: 'g3', project: p }
      );

      // Gate 4: Demo-Scale Proof
      this.ganttData.push(
        { task: '1. Pilot Scale Multi-Batch Campaign Execution', start: Date.UTC(2026, 4, 4), end: Date.UTC(2026, 4, 14), completion: 40, gate: 'g4', project: p },
        { task: '2. Customer Application Sample Testing & Feedback', start: Date.UTC(2026, 4, 11), end: Date.UTC(2026, 4, 21), completion: 25, gate: 'g4', project: p },
        { task: '3. Demonstration-Scale Reactor Detailed Engineering', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 27), completion: 15, gate: 'g4', project: p },
        { task: '4. Demonstration Run & Process Performance Qualification (PPQ)', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 30), completion: 10, gate: 'g4', project: p }
      );

      // Gate 5: Commercial Production Readiness
      this.ganttData.push(
        { task: '1. Commercial Facility Commissioning & Cold Run', start: Date.UTC(2026, 4, 2), end: Date.UTC(2026, 4, 15), completion: 35, gate: 'g5', project: p },
        { task: '2. Commercial Plant Environmental Clearance & HAZOP Action Closeout', start: Date.UTC(2026, 4, 10), end: Date.UTC(2026, 4, 23), completion: 20, gate: 'g5', project: p },
        { task: '3. Commercial Master Production Record & QC Release Protocols', start: Date.UTC(2026, 4, 18), end: Date.UTC(2026, 4, 29), completion: 10, gate: 'g5', project: p }
      );
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScrollBounds(), 100);
  }

  applyGanttFilter() {
    this.filteredGanttData = this.ganttData.filter(d => {
      const matchProj = !this.selectedProject || d.project === this.selectedProject;
      const matchStage = d.gate === this.selectedStageFilter;
      return matchProj && matchStage;
    });
  }

  // --- SCROLLING LOGIC ---

  onTableScroll() {
    this.checkScrollBounds();
  }

  checkScrollBounds() {
    if (!this.tableContainer) return;
    const el = this.tableContainer.nativeElement;

    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1;
  }

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right') {
    if (!this.tableContainer) return;
    const el = this.tableContainer.nativeElement;
    const scrollAmount = 350;

    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // --- GANTT CALENDAR HELPERS ---

  isDayInRange(item: any, day: number): boolean {
    const startDay = new Date(item.start).getUTCDate();
    const endDay = new Date(item.end).getUTCDate();
    return day >= startDay && day <= endDay;
  }

  isDayStart(item: any, day: number): boolean {
    return new Date(item.start).getUTCDate() === day;
  }

  isDayEnd(item: any, day: number): boolean {
    return new Date(item.end).getUTCDate() === day;
  }

  getDarkBarColor(completion: number): string {
    if (completion >= 75) return '#28a745'; // Green
    if (completion > 0) return '#f4a300'; // Orange
    return '#adb5bd'; // Gray for 0%
  }

  // --- TOOLTIP HELPERS ---

  showTooltip(event: MouseEvent, item: any) {
    this.tooltipData = item;
    this.tooltipVisible = true;
    this.updateTooltipPosition(event);
  }

  moveTooltip(event: MouseEvent) {
    this.updateTooltipPosition(event);
  }

  hideTooltip() {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  private updateTooltipPosition(event: MouseEvent) {
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY + 15;
  }
}
