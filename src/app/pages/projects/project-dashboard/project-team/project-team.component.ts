import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

export interface TeamMember {
  id: number;
  name: string;
  department: string;
  section: string;
  location?: string;
  isLead?: boolean;
}

@Component({
  selector: 'app-project-team',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './project-team.component.html',
  styleUrl: './project-team.component.scss',
})
export class ProjectTeamComponent implements OnInit {
  // Project Header Properties
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';
  dynamicBreadcrumb: string = 'Team';

  // Department and Section filter lists
  readonly departmentList: string[] = [
    'Research & Development',
    'Quality Control',
    'Quality Assurance',
    'Production',
    'Regulatory Affairs',
  ];

  readonly departmentSectionsMap: Record<string, string[]> = {
    'Research & Development': ['Formulation Development', 'Analytical Development'],
    'Quality Control': ['Quality Control'],
    'Quality Assurance': ['Quality Assurance'],
    'Production': ['Production'],
    'Regulatory Affairs': ['Regulatory Affairs']
  };

  readonly locationList: string[] = [
    'Kondapur (Hyd,TS)',
    'Bachupally (Hyd,TS)',
    'Balanagar (Hyd,TS)',
    'Genome Valley (Hyd,TS)',
    'Baddi (Sol,HP)',
    'Andheri (Mum,MH)',
    'Bommasandra (Blr,KA)'
  ];

  selectedDepartment: string = '';
  selectedSection: string = '';
  selectedLocation: string = '';

  get availableSections(): string[] {
    if (this.selectedDepartment && this.departmentSectionsMap[this.selectedDepartment]) {
      return this.departmentSectionsMap[this.selectedDepartment];
    }
    return [
      'Formulation Development',
      'Analytical Development',
      'Quality Control',
      'Quality Assurance',
      'Production',
      'Regulatory Affairs'
    ];
  }

  // Members list with section, department, and location
  availableMembers: TeamMember[] = [
    { id: 1, name: 'Alex Johnson', department: 'Research & Development', section: 'Formulation Development', location: 'Kondapur (Hyd,TS)' },
    { id: 2, name: 'Samantha Carter', department: 'Research & Development', section: 'Analytical Development', location: 'Kondapur (Hyd,TS)' },
    { id: 3, name: 'Michael Chen', department: 'Quality Control', section: 'Quality Control', location: 'Bachupally (Hyd,TS)' },
    { id: 4, name: 'Sarah Williams', department: 'Regulatory Affairs', section: 'Regulatory Affairs', location: 'Kondapur (Hyd,TS)' },
    { id: 5, name: 'David Rodriguez', department: 'Production', section: 'Production', location: 'Baddi (Sol,HP)' },
    { id: 6, name: 'Emily Davis', department: 'Quality Assurance', section: 'Quality Assurance', location: 'Kondapur (Hyd,TS)' },
    { id: 7, name: 'James Wilson', department: 'Research & Development', section: 'Formulation Development', location: 'Balanagar (Hyd,TS)' },
    { id: 8, name: 'Olivia Martinez', department: 'Quality Control', section: 'Quality Control', location: 'Kondapur (Hyd,TS)' },
    { id: 9, name: 'William Taylor', department: 'Regulatory Affairs', section: 'Regulatory Affairs', location: 'Andheri (Mum,MH)' },
    { id: 10, name: 'Sophia Anderson', department: 'Quality Assurance', section: 'Quality Assurance', location: 'Kondapur (Hyd,TS)' },
    { id: 11, name: 'Daniel Thomas', department: 'Production', section: 'Production', location: 'Bommasandra (Blr,KA)' }
  ];

  assignedMembers: TeamMember[] = [
    { id: 12, name: 'Liam White', department: 'Research & Development', section: 'Formulation Development', location: 'Kondapur (Hyd,TS)', isLead: true },
    { id: 13, name: 'Emma Harris', department: 'Regulatory Affairs', section: 'Regulatory Affairs', location: 'Kondapur (Hyd,TS)', isLead: false },
    { id: 14, name: 'Noah Martin', department: 'Quality Assurance', section: 'Quality Assurance', location: 'Bachupally (Hyd,TS)', isLead: false },
    { id: 15, name: 'Ava Jackson', department: 'Quality Control', section: 'Quality Control', location: 'Kondapur (Hyd,TS)', isLead: false },
    { id: 16, name: 'Ethan Moore', department: 'Production', section: 'Production', location: 'Baddi (Sol,HP)', isLead: false }
  ];

  selectedAvailable: TeamMember[] = [];
  selectedAssigned: TeamMember[] = [];

  availableSearch: string = '';
  assignedSearch: string = '';

  get filteredAvailableMembers(): TeamMember[] {
    return this.availableMembers.filter((m) => {
      if (this.selectedDepartment && m.department !== this.selectedDepartment) {
        return false;
      }
      if (this.selectedSection && m.section !== this.selectedSection) {
        return false;
      }
      if (this.selectedLocation && m.location !== this.selectedLocation) {
        return false;
      }
      if (this.availableSearch?.trim()) {
        const term = this.availableSearch.toLowerCase().trim();
        const matchesName = m.name.toLowerCase().includes(term);
        const matchesDept = m.department.toLowerCase().includes(term);
        const matchesSec = m.section.toLowerCase().includes(term);
        const matchesLoc = m.location ? m.location.toLowerCase().includes(term) : false;
        if (!matchesName && !matchesDept && !matchesSec && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }

  get filteredAssignedMembers(): TeamMember[] {
    if (!this.assignedSearch?.trim()) {
      return this.assignedMembers;
    }
    const term = this.assignedSearch.toLowerCase().trim();
    return this.assignedMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.department.toLowerCase().includes(term) ||
        m.section.toLowerCase().includes(term) ||
        (m.location && m.location.toLowerCase().includes(term))
    );
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/CHM/006", name: this.projectName || "Acrylic Emulsion Binder 50% Solids" }
    });
  }

  onDepartmentChange(): void {
    if (this.selectedDepartment && this.selectedSection) {
      const validSections = this.departmentSectionsMap[this.selectedDepartment] || [];
      if (!validSections.includes(this.selectedSection)) {
        this.selectedSection = '';
      }
    }
  }

  onSectionChange(): void {
    if (this.selectedSection && !this.selectedDepartment) {
      for (const [dept, sections] of Object.entries(this.departmentSectionsMap)) {
        if (sections.includes(this.selectedSection)) {
          this.selectedDepartment = dept;
          break;
        }
      }
    }
  }

  onLocationChange(): void {
    // triggers automatic re-computation of filteredAvailableMembers getter
  }

  clearFilters(): void {
    this.selectedDepartment = '';
    this.selectedSection = '';
    this.selectedLocation = '';
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  isSelected(member: TeamMember, list: TeamMember[]): boolean {
    return list.some(m => m.id === member.id);
  }

  toggleSelection(member: TeamMember, list: TeamMember[]): void {
    const index = list.findIndex(m => m.id === member.id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(member);
    }
  }

  addMembers(): void {
    if (this.selectedAvailable.length > 0) {
      this.assignedMembers.push(...this.selectedAvailable);
      const selectedIds = new Set(this.selectedAvailable.map((m) => m.id));
      this.availableMembers = this.availableMembers.filter((member) => !selectedIds.has(member.id));
      this.selectedAvailable = [];
    }
  }

  removeMembers(): void {
    if (this.selectedAssigned.length > 0) {
      this.selectedAssigned.forEach(m => m.isLead = false);
      this.availableMembers.push(...this.selectedAssigned);
      const selectedIds = new Set(this.selectedAssigned.map((m) => m.id));
      this.assignedMembers = this.assignedMembers.filter((member) => !selectedIds.has(member.id));
      this.selectedAssigned = [];
    }
  }

  save(): void {
    this.goBack();
  }
}