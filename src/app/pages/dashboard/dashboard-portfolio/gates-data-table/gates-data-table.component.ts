import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardGatesComponent, GateRow } from '../../dashboard-gates/dashboard-gates.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface GateColumnHeader {
  key: string;
  label: string;
  subtitle: string;
}
@Component({
  selector: 'app-gates-data-table',
  standalone: true,
   imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './gates-data-table.component.html',
  styleUrl: './gates-data-table.component.scss',
})
export class GatesDataTableComponent {


    gatesSearchTerm: string = '';
  
    readonly gateHeaders: GateColumnHeader[] = [
      { key: 'g1', label: 'Gate 1', subtitle: 'Concept Approval' },
      { key: 'g2', label: 'Gate 2', subtitle: 'Route Selection' },
      { key: 'g3', label: 'Gate 3', subtitle: 'Registration & Pilot Readiness' },
      { key: 'g4', label: 'Gate 4', subtitle: 'Demo-Scale Proof' },
      { key: 'g5', label: 'Gate 5', subtitle: 'Commercial Readiness' }
    ];
  
    readonly g1List: string[] = [
      "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
      "Hydrogenation Catalyst Development (Pd/C)",
      "Agrochemical Active Ingredient Multi-Step Synthesis Development",
      "Solvent Recovery & Fractional Distillation Process Development",
      "Water-Dispersible Granule (WDG) Formulation Development",
      "Acrylic Emulsion Binder 50% Solids",
      "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)",
      "Sodium Lauryl Ether Sulfate (SLES) 70% Paste",
      "Fumed Silica (Hydrophilic, 200 m2/g)",
      "Hydrogen Peroxide 50% w/w (Anthraquinone Process)",
      "Bio-based Polyamide 6,10 Resin",
      "Polyether Ether Ketone (PEEK) High Flow Grade",
      "Thermoplastic Polyurethane (TPU) Ester Grade",
      "UV-Curable Oligomer for Optical Coatings",
      "Functionalized Graphene Oxide Dispersion",
      "High-Performance Intumescent Coating Additive",
      "Fluorosurfactant Wetting Agent 50%",
      "Silane Coupling Agent (GLYMO)",
      "Alkyl Polyglucoside Surfactant C8-C10",
      "Bio-Succinic Acid Platform Chemical"
    ];
  
    readonly g2List: string[] = [
      "Acrylic Emulsion Binder 50% Solids",
      "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)",
      "Sodium Lauryl Ether Sulfate (SLES) 70% Paste",
      "Fumed Silica (Hydrophilic, 200 m2/g)",
      "Hydrogen Peroxide 50% w/w (Anthraquinone Process)",
      "Bio-based Polyamide 6,10 Resin",
      "Polyether Ether Ketone (PEEK) High Flow Grade",
      "Thermoplastic Polyurethane (TPU) Ester Grade",
      "UV-Curable Oligomer for Optical Coatings",
      "Functionalized Graphene Oxide Dispersion",
      "High-Performance Intumescent Coating Additive",
      "Fluorosurfactant Wetting Agent 50%"
    ];
  
    readonly g3List: string[] = [
      "Waterborne Polyurethane Dispersion (PUD) Discovery Project",
      "Hydrogenation Catalyst Development (Pd/C)",
      "Agrochemical Active Ingredient Multi-Step Synthesis Development",
      "Solvent Recovery & Fractional Distillation Process Development",
      "Water-Dispersible Granule (WDG) Formulation Development",
      "Silane Coupling Agent (GLYMO)",
      "Alkyl Polyglucoside Surfactant C8-C10",
      "Bio-Succinic Acid Platform Chemical",
      "High-Performance Intumescent Coating Additive"
    ];
  
    readonly g4List: string[] = [
      "Acrylic Emulsion Binder 50% Solids",
      "Liquid Epoxy Resin (Bisphenol-A, EEW 185-192)",
      "Sodium Lauryl Ether Sulfate (SLES) 70% Paste",
      "Fumed Silica (Hydrophilic, 200 m2/g)",
    ];
  
    readonly g5List: string[] = [
      "Hydrogen Peroxide 50% w/w (Anthraquinone Process)",
      "Bio-based Polyamide 6,10 Resin",
      "Polyether Ether Ketone (PEEK) High Flow Grade",
      "Thermoplastic Polyurethane (TPU) Ester Grade",
      "UV-Curable Oligomer for Optical Coatings",
      "Functionalized Graphene Oxide Dispersion",
      "High-Performance Intumescent Coating Additive"
    ];
  
    gateRows: GateRow[] = [];
  
    constructor(private router: Router) { }

    goBack(): void {
      this.router.navigate(['/dashboard/portfolio']);
    }
  
    ngOnInit(): void {
      // Dynamically calculate the max length to prevent hardcoding row limits
      const maxLength = Math.max(
        this.g1List.length,
        this.g2List.length,
        this.g3List.length,
        this.g4List.length,
        this.g5List.length
      );
  
      this.gateRows = Array.from({ length: maxLength }, (_, i) => ({
        g1: this.g1List[i] || '',
        g2: this.g2List[i] || '',
        g3: this.g3List[i] || '',
        g4: this.g4List[i] || '',
        g5: this.g5List[i] || ''
      }));
    }
  
    isMatching(val: string): boolean {
      if (!this.gatesSearchTerm?.trim() || !val) return false;
      return val.toLowerCase().includes(this.gatesSearchTerm.toLowerCase());
    }
  
    highlight(text: string): string {
      if (!this.gatesSearchTerm?.trim() || !text) {
        return text;
      }
  
      // Safely escape special regex characters
      const pattern = this.gatesSearchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${pattern})`, 'gi');
  
      // Use $1 to preserve the original casing of the matched text
      return text.replace(regex, '<span class="highlight-text">$1</span>');
    }
}

