export interface PathActivityStep {
  name: string;
  stage: string;
  owner: string;
  ccpDays: number;
  ccmDays: number;
  status: 'Completed' | 'In Process' | 'Pending' | 'Overdue';
}

export interface SchedulePathRow {
  sno: number;
  activities: string[];
  ccp: number;
  ccm: number;
  steps: PathActivityStep[];
}

export const SCHEDULE_MORE_PATHS: SchedulePathRow[] = [
  {
    sno: 1,
    activities: [
      'Competitor Grade & Benchmark Characterization',
      'Monomer & Initiator Compatibility Study',
      'Physicochemical & Emulsion Solids Testing',
      'Laboratory Emulsion Polymerization Scouting',
      'GPC Molecular Weight & Particle Size DLS Analysis'
    ],
    ccp: 48,
    ccm: 54,
    steps: [
      { name: 'Competitor Grade & Benchmark Characterization', stage: 'Feasibility', owner: 'Ana Vega', ccpDays: 9, ccmDays: 10, status: 'Completed' },
      { name: 'Monomer & Initiator Compatibility Study', stage: 'Formulation', owner: 'Mia Chen', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'Physicochemical & Emulsion Solids Testing', stage: 'Formulation', owner: 'Sara Iqbal', ccpDays: 9, ccmDays: 10, status: 'Completed' },
      { name: 'Laboratory Emulsion Polymerization Scouting', stage: 'Formulation', owner: 'Ravi Shah', ccpDays: 10, ccmDays: 11, status: 'In Process' },
      { name: 'GPC Molecular Weight & Particle Size DLS Analysis', stage: 'Development', owner: 'Leo Park', ccpDays: 10, ccmDays: 12, status: 'Pending' }
    ]
  },
  {
    sno: 2,
    activities: [
      'Target Product Specification & Grade Window',
      'Surfactant Package Screening & Supplier Audit',
      'Core-Shell Acrylic Emulsion Design',
      'Residual Monomer & VOC Stripping Optimization'
    ],
    ccp: 41,
    ccm: 46,
    steps: [
      { name: 'Target Product Specification & Grade Window', stage: 'Feasibility', owner: 'Ravi Shah', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'Surfactant Package Screening & Supplier Audit', stage: 'Formulation', owner: 'Ana Vega', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'Core-Shell Acrylic Emulsion Design', stage: 'Formulation', owner: 'Sara Iqbal', ccpDays: 11, ccmDays: 12, status: 'In Process' },
      { name: 'Residual Monomer & VOC Stripping Optimization', stage: 'Development', owner: 'Mia Chen', ccpDays: 10, ccmDays: 12, status: 'Pending' }
    ]
  },
  {
    sno: 3,
    activities: [
      'Bulk Monomer Source & Vendor Qualification',
      'By-product Profiling & Thermal Stability Testing',
      'Reaction Parameter DoE & Viscosity Optimization',
      'Pilot Reactor 500L Campaign Scale-Up',
      'Demonstration 2,500L Campaign Batches',
      'Emulsion Freeze-Thaw & Storage Stability Initiation'
    ],
    ccp: 62,
    ccm: 68,
    steps: [
      { name: 'Bulk Monomer Source & Vendor Qualification', stage: 'Feasibility', owner: 'Mia Chen', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'By-product Profiling & Thermal Stability Testing', stage: 'Development', owner: 'Mei Tanaka', ccpDays: 11, ccmDays: 12, status: 'Completed' },
      { name: 'Reaction Parameter DoE & Viscosity Optimization', stage: 'Formulation', owner: 'Ravi Shah', ccpDays: 10, ccmDays: 11, status: 'In Process' },
      { name: 'Pilot Reactor 500L Campaign Scale-Up', stage: 'Testing', owner: 'Leo Park', ccpDays: 11, ccmDays: 12, status: 'Pending' },
      { name: 'Demonstration 2,500L Campaign Batches', stage: 'Validation', owner: 'Olivia Brown', ccpDays: 10, ccmDays: 11, status: 'Pending' },
      { name: 'Emulsion Freeze-Thaw & Storage Stability Initiation', stage: 'Development', owner: 'Diego Ruiz', ccpDays: 10, ccmDays: 11, status: 'Pending' }
    ]
  },
  {
    sno: 4,
    activities: [
      'Initiator & Surfactant Screening',
      'Stripping & Viscosity Testing',
      'Drum & Bulk Storage Container Compatibility',
      'Demonstration 2,500L Campaign Batches'
    ],
    ccp: 44,
    ccm: 50,
    steps: [
      { name: 'Initiator & Surfactant Screening', stage: 'Formulation', owner: 'Ana Vega', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'Stripping & Viscosity Testing', stage: 'Testing', owner: 'Ana Vega', ccpDays: 11, ccmDays: 13, status: 'Overdue' },
      { name: 'Drum & Bulk Storage Container Compatibility', stage: 'Testing', owner: 'Diego Ruiz', ccpDays: 11, ccmDays: 12, status: 'In Process' },
      { name: 'Demonstration 2,500L Campaign Batches', stage: 'Validation', owner: 'Olivia Brown', ccpDays: 12, ccmDays: 14, status: 'Pending' }
    ]
  },
  {
    sno: 5,
    activities: [
      'Chemical Process Patent & IP Freedom-to-Operate',
      'Reaction Parameter DoE & Viscosity Optimization',
      'Monomer Hold-Time & Emulsion Shelf-Life Verification',
      'Emulsion Freeze-Thaw & Storage Stability Initiation',
      'REACH & TSCA Chemical Registration Dossier Filing'
    ],
    ccp: 55,
    ccm: 61,
    steps: [
      { name: 'Chemical Process Patent & IP Freedom-to-Operate', stage: 'Feasibility', owner: 'Priya Nair', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'Reaction Parameter DoE & Viscosity Optimization', stage: 'Formulation', owner: 'Mei Tanaka', ccpDays: 11, ccmDays: 12, status: 'In Process' },
      { name: 'Monomer Hold-Time & Emulsion Shelf-Life Verification', stage: 'Testing', owner: 'Leo Park', ccpDays: 11, ccmDays: 12, status: 'Pending' },
      { name: 'Emulsion Freeze-Thaw & Storage Stability Initiation', stage: 'Development', owner: 'Diego Ruiz', ccpDays: 11, ccmDays: 13, status: 'Pending' },
      { name: 'REACH & TSCA Chemical Registration Dossier Filing', stage: 'Regulatory', owner: 'Olivia Brown', ccpDays: 12, ccmDays: 13, status: 'Pending' }
    ]
  },
  {
    sno: 6,
    activities: [
      'EHS Classification & Environmental Exposure Risk Evaluation',
      'GC-MS Monomer Assay & GPC Method Transfer',
      'Reaction Kinetics & RC1 Heat Flow Modeling',
      'Pilot Hazard Safety Review & PSSR Readiness',
      'Semi-Commercial 2,500L Demonstration Run',
      'Commercial Plant 20,000L Tech Transfer'
    ],
    ccp: 64,
    ccm: 70,
    steps: [
      { name: 'EHS Classification & Environmental Exposure Risk Evaluation', stage: 'Feasibility', owner: 'Priya Nair', ccpDays: 10, ccmDays: 11, status: 'Completed' },
      { name: 'GC-MS Monomer Assay & GPC Method Transfer', stage: 'Development', owner: 'Mia Chen', ccpDays: 11, ccmDays: 12, status: 'In Process' },
      { name: 'Reaction Kinetics & RC1 Heat Flow Modeling', stage: 'Testing', owner: 'Ravi Shah', ccpDays: 10, ccmDays: 11, status: 'Pending' },
      { name: 'Pilot Hazard Safety Review & PSSR Readiness', stage: 'Testing', owner: 'Olivia Brown', ccpDays: 11, ccmDays: 12, status: 'Pending' },
      { name: 'Semi-Commercial 2,500L Demonstration Run', stage: 'Validation', owner: 'Leo Park', ccpDays: 11, ccmDays: 12, status: 'Pending' },
      { name: 'Commercial Plant 20,000L Tech Transfer', stage: 'Validation', owner: 'Diego Ruiz', ccpDays: 11, ccmDays: 12, status: 'Pending' }
    ]
  }
];
