import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardStagesComponent } from '../../dashboard-stages/dashboard-stages.component';



export interface StageColumnHeader {
  key: string;
  label: string;
  stageCode: string;
  stageNumber: number;
  subtitle: string;
  fullName: string;
  projectCount: number;
}

@Component({
  selector: 'app-stages-data-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    // DashboardStagesComponent
  ],
  templateUrl: './stages-data-table.component.html',
  styleUrl: './stages-data-table.component.scss',
})
export class StagesDataTableComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  gatesSearchTerm: string = '';
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // 12 Chemical Manufacturing Stages
  readonly stageHeaders: StageColumnHeader[] = [
    { key: 's1', label: 'Stage 1', stageCode: 'S1', stageNumber: 1, subtitle: 'Opportunity Identification', fullName: 'Opportunity Identification', projectCount: 20 },
    { key: 's2', label: 'Stage 2', stageCode: 'S2', stageNumber: 2, subtitle: 'Concept Screening & Feasibility', fullName: 'Concept Screening & Feasibility', projectCount: 19 },
    { key: 's3', label: 'Stage 3', stageCode: 'S3', stageNumber: 3, subtitle: 'Route Scouting & Lab Synthesis', fullName: 'Route Scouting & Lab Synthesis', projectCount: 18 },
    { key: 's4', label: 'Stage 4', stageCode: 'S4', stageNumber: 4, subtitle: 'Process Optimization (Lab Scale)', fullName: 'Process Optimization (Lab Scale)', projectCount: 17 },
    { key: 's5', label: 'Stage 5', stageCode: 'S5', stageNumber: 5, subtitle: 'Process Route Selection & Basis of Design', fullName: 'Process Route Selection & Basis of Design', projectCount: 16 },
    { key: 's6', label: 'Stage 6', stageCode: 'S6', stageNumber: 6, subtitle: 'Bench-to-Pilot Process Development', fullName: 'Bench-to-Pilot Process Development', projectCount: 15 },
    { key: 's7', label: 'Stage 7', stageCode: 'S7', stageNumber: 7, subtitle: 'Process Safety & Regulatory Studies', fullName: 'Process Safety & Regulatory Studies', projectCount: 14 },
    { key: 's8', label: 'Stage 8', stageCode: 'S8', stageNumber: 8, subtitle: 'Regulatory Registration Filing (REACH / TSCA)', fullName: 'Regulatory Registration Filing (REACH / TSCA)', projectCount: 13 },
    { key: 's9', label: 'Stage 9', stageCode: 'S9', stageNumber: 9, subtitle: 'Pilot Plant Campaign', fullName: 'Pilot Plant Campaign', projectCount: 12 },
    { key: 's10', label: 'Stage 10', stageCode: 'S10', stageNumber: 10, subtitle: 'Demonstration-Scale Campaign', fullName: 'Demonstration-Scale Campaign', projectCount: 11 },
    { key: 's11', label: 'Stage 11', stageCode: 'S11', stageNumber: 11, subtitle: 'Commercial Plant Build & Commissioning', fullName: 'Commercial Plant Build & Commissioning', projectCount: 10 },
    { key: 's12', label: 'Stage 12', stageCode: 'S12', stageNumber: 12, subtitle: 'Commercial Launch & Ramp-Up', fullName: 'Commercial Launch & Ramp-Up', projectCount: 9 }
  ];

  // Chemical Manufacturing Projects lists
  readonly s1List = [
    "Waterborne Polyurethane Dispersion (PUD) Discovery Project", "Hydrogenation Catalyst Development (Pd/C)", "Agrochemical Active Ingredient Multi-Step Synthesis Development", "Solvent Recovery & Fractional Distillation Process Development", "Water-Dispersible Granule (WDG) Formulation Development", "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)", "Sodium Lauryl Ether Sulfate (SLES) 70% Paste", "Fumed Silica (Hydrophilic, 200 m2/g)", "Hydrogen Peroxide 50% w/w (Anthraquinone Process)", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "UV-Curable Oligomer for Optical Coatings", "Functionalized Graphene Oxide Dispersion", "High-Performance Intumescent Coating Additive", "Fluorosurfactant Wetting Agent 50%", "Silane Coupling Agent (GLYMO)", "Alkyl Polyglucoside Surfactant C8-C10", "Bio-Succinic Acid Platform Chemical"
  ];
  readonly s2List = [
    "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)", "Sodium Lauryl Ether Sulfate (SLES) 70% Paste", "Fumed Silica (Hydrophilic, 200 m2/g)", "Hydrogen Peroxide 50% w/w (Anthraquinone Process)", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "UV-Curable Oligomer for Optical Coatings", "Functionalized Graphene Oxide Dispersion", "High-Performance Intumescent Coating Additive", "Fluorosurfactant Wetting Agent 50%", "Silane Coupling Agent (GLYMO)", "Alkyl Polyglucoside Surfactant C8-C10", "Bio-Succinic Acid Platform Chemical", "Polyimide Film Precursor Monomer", "Specialty Polyolefin Elastomer", "Non-Ionic Polyether Defoamer", "Low VOC Acrylic Polyol"
  ];
  readonly s3List = [
    "Waterborne Polyurethane Dispersion (PUD) Discovery Project", "Hydrogenation Catalyst Development (Pd/C)", "Agrochemical Active Ingredient Multi-Step Synthesis Development", "Solvent Recovery & Fractional Distillation Process Development", "Water-Dispersible Granule (WDG) Formulation Development", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "UV-Curable Oligomer for Optical Coatings", "Functionalized Graphene Oxide Dispersion", "High-Performance Intumescent Coating Additive", "Fluorosurfactant Wetting Agent 50%", "Silane Coupling Agent (GLYMO)", "Alkyl Polyglucoside Surfactant C8-C10", "Bio-Succinic Acid Platform Chemical", "Polyimide Film Precursor Monomer", "Specialty Polyolefin Elastomer", "Non-Ionic Polyether Defoamer"
  ];
  readonly s4List = [
    "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)", "Sodium Lauryl Ether Sulfate (SLES) 70% Paste", "Fumed Silica (Hydrophilic, 200 m2/g)", "Hydrogen Peroxide 50% w/w (Anthraquinone Process)", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "UV-Curable Oligomer for Optical Coatings", "Functionalized Graphene Oxide Dispersion", "High-Performance Intumescent Coating Additive", "Fluorosurfactant Wetting Agent 50%", "Silane Coupling Agent (GLYMO)", "Alkyl Polyglucoside Surfactant C8-C10", "Bio-Succinic Acid Platform Chemical", "Polyimide Film Precursor Monomer", "Specialty Polyolefin Elastomer"
  ];
  readonly s5List = [
    "Waterborne Polyurethane Dispersion (PUD) Discovery Project", "Hydrogenation Catalyst Development (Pd/C)", "Agrochemical Active Ingredient Multi-Step Synthesis Development", "Solvent Recovery & Fractional Distillation Process Development", "Water-Dispersible Granule (WDG) Formulation Development", "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)", "Sodium Lauryl Ether Sulfate (SLES) 70% Paste", "Fumed Silica (Hydrophilic, 200 m2/g)", "Hydrogen Peroxide 50% w/w (Anthraquinone Process)", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "UV-Curable Oligomer for Optical Coatings", "Functionalized Graphene Oxide Dispersion", "High-Performance Intumescent Coating Additive"
  ];
  readonly s6List = [
    "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "UV-Curable Oligomer for Optical Coatings", "Functionalized Graphene Oxide Dispersion", "High-Performance Intumescent Coating Additive", "Fluorosurfactant Wetting Agent 50%", "Silane Coupling Agent (GLYMO)", "Alkyl Polyglucoside Surfactant C8-C10", "Bio-Succinic Acid Platform Chemical", "Waterborne Polyurethane Dispersion (PUD)", "Hydrogenation Catalyst (Pd/C)", "Agrochemical Active Ingredient", "Solvent Recovery & Distillation", "Water-Dispersible Granule"
  ];
  readonly s7List = [
    "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)", "Sodium Lauryl Ether Sulfate (SLES) 70% Paste", "Fumed Silica (Hydrophilic, 200 m2/g)", "Hydrogen Peroxide 50% w/w", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK)", "Thermoplastic Polyurethane (TPU)", "UV-Curable Oligomer", "Functionalized Graphene Oxide", "High-Performance Intumescent Additive", "Fluorosurfactant Wetting Agent", "Silane Coupling Agent", "Alkyl Polyglucoside Surfactant"
  ];
  readonly s8List = [
    "Waterborne Polyurethane Dispersion (PUD)", "Hydrogenation Catalyst Development (Pd/C)", "Agrochemical Active Ingredient Multi-Step Synthesis", "Solvent Recovery Process", "Water-Dispersible Granule Formulation", "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin", "Sodium Lauryl Ether Sulfate", "Fumed Silica", "Hydrogen Peroxide 50% w/w", "Bio-based Polyamide 6,10", "PEEK High Flow Grade", "TPU Ester Grade"
  ];
  readonly s9List = [
    "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A)", "Sodium Lauryl Ether Sulfate (SLES)", "Fumed Silica (Hydrophilic)", "Hydrogen Peroxide 50% w/w", "Bio-based Polyamide 6,10", "PEEK High Flow Grade", "TPU Ester Grade", "UV-Curable Oligomer", "Functionalized Graphene Oxide", "High-Performance Intumescent", "Fluorosurfactant Wetting Agent"
  ];
  readonly s10List = [
    "Waterborne Polyurethane Dispersion (PUD)", "Hydrogenation Catalyst (Pd/C)", "Agrochemical Active Ingredient", "Solvent Recovery & Distillation", "Water-Dispersible Granule", "Acrylic Emulsion Binder", "Liquid Epoxy Resin", "Sodium Lauryl Ether Sulfate", "Fumed Silica", "Hydrogen Peroxide 50%", "Bio-based Polyamide"
  ];
  readonly s11List = [
    "Acrylic Emulsion Binder 50% Solids", "Liquid Epoxy Resin (Bisphenol-A)", "Sodium Lauryl Ether Sulfate (SLES)", "Fumed Silica (Hydrophilic)", "Hydrogen Peroxide 50% w/w", "Bio-based Polyamide 6,10", "PEEK High Flow Grade", "TPU Ester Grade", "UV-Curable Oligomer", "Functionalized Graphene Oxide"
  ];
  readonly s12List = [
    "Hydrogen Peroxide 50% w/w (Anthraquinone Process)", "Bio-based Polyamide 6,10 Resin", "Polyether Ether Ketone (PEEK) High Flow Grade", "Thermoplastic Polyurethane (TPU) Ester Grade", "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)", "Acrylic Emulsion Binder 50% Solids", "Sodium Lauryl Ether Sulfate (SLES) 70% Paste", "Fumed Silica (Hydrophilic, 200 m2/g)", "Waterborne Polyurethane Dispersion (PUD)"
  ];

  stageRows: any[] = [];

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/dashboard/portfolio']);
  }

  ngOnInit(): void {
    // Generate 20 rows dynamically based on the highest length
    for (let i = 0; i < 20; i++) {
      this.stageRows.push({
        s1: this.s1List[i] || '', s2: this.s2List[i] || '', s3: this.s3List[i] || '', s4: this.s4List[i] || '',
        s5: this.s5List[i] || '', s6: this.s6List[i] || '', s7: this.s7List[i] || '', s8: this.s8List[i] || '',
        s9: this.s9List[i] || '', s10: this.s10List[i] || '', s11: this.s11List[i] || '', s12: this.s12List[i] || ''
      });
    }
  }

  ngAfterViewInit(): void {
    this.updateScrollButtons();
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

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  isRed(key: string, rowIndex: number): boolean {
    if (key === 's1' || key === 's2') return false;

    const redIndexesMap: { [key: string]: number[] } = {
      s3: [2, 7, 13], s4: [1, 6, 11], s5: [3, 8, 14], s6: [2, 9],
      s7: [1, 5, 10], s8: [3, 7], s9: [2, 6], s10: [1, 8],
      s11: [3, 7], s12: [2, 5]
    };
    return redIndexesMap[key]?.includes(rowIndex) || false;
  }

  isMatching(val: string): boolean {
    if (!this.gatesSearchTerm?.trim() || !val) return false;
    return val.toLowerCase().includes(this.gatesSearchTerm.toLowerCase());
  }

  highlight(text: string): string {
    if (!this.gatesSearchTerm?.trim() || !text) return text;
    const pattern = this.gatesSearchTerm.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<span class="highlight-text">$1</span>');
  }
}
