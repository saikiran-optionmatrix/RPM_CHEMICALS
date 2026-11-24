export interface OutsourcingItem {
  sNo: string;
  date: string;
  productName: string;
  requiredTest: string;
  instrumentName: string;
  sampleDetails: string;
  reasonForRequirement: string;
  initiatedBy: string;
  approvedBy: string;
  duration: string;
  reportReceivedOn: string;
  remarks: string;
}

export const OUTSOURCING_INITIAL_DATA: OutsourcingItem[] = [
  {
    sNo: '1',
    date: '12-Jan-2026',
    productName: 'Acrylic Emulsion Binder 50% Solids 250mg',
    requiredTest: 'Particle size',
    instrumentName: 'Malvern master sizer',
    sampleDetails: 'API Micronized Lot M-101 (10g)',
    reasonForRequirement: 'In-house equipment breakdown / routine validation',
    initiatedBy: 'Tathagata',
    approvedBy: 'Dr. Satish',
    duration: '3 Days',
    reportReceivedOn: '15-Jan-2026',
    remarks: 'Complies with D90 < 10 µm specification'
  },
  {
    sNo: '2',
    date: '18-Jan-2026',
    productName: 'Liposomal Gadobutrol',
    requiredTest: 'Solid-state XRPD Crystallinity',
    instrumentName: 'Bruker D8 Advance XRD',
    sampleDetails: 'Polymorphic Form I Raw Material (Batch RM-4421, 5g)',
    reasonForRequirement: 'Verification of crystalline form purity vs amorphous conversion',
    initiatedBy: 'Sneha Roy',
    approvedBy: 'Dr. Satish',
    duration: '5 Days',
    reportReceivedOn: '23-Jan-2026',
    remarks: 'Peak at 2θ 14.8° confirms pure Form I polymorph'
  },
  {
    sNo: '3',
    date: '02-Feb-2026',
    productName: 'Taphalgin Injection',
    requiredTest: 'Differential Scanning Calorimetry (DSC)',
    instrumentName: 'TA Instruments DSC 2500',
    sampleDetails: 'Binary compatibility mix API + MCC 102 (Batch BC-09, 2g)',
    reasonForRequirement: 'Preformulation drug-excipient compatibility assessment',
    initiatedBy: 'Pooja Verma',
    approvedBy: 'Dr. Ramesh',
    duration: '4 Days',
    reportReceivedOn: '06-Feb-2026',
    remarks: 'Sharp endotherm at 228.4°C, no degradation peak observed'
  },
  {
    sNo: '4',
    date: '14-Feb-2026',
    productName: 'Risidiplam Oral Solution',
    requiredTest: 'Trace Elemental Impurities (ICP-MS)',
    instrumentName: 'Agilent 7900 ICP-MS',
    sampleDetails: 'Finished Oral Liquid Trial Batch T-03 (50mL)',
    reasonForRequirement: 'ICH Q3D compliance testing for Class 1 & 2A heavy metals',
    initiatedBy: 'Karthik N.',
    approvedBy: 'Dr. Satish',
    duration: '7 Days',
    reportReceivedOn: '21-Feb-2026',
    remarks: 'Lead, Arsenic, Cadmium, Mercury all below 0.1 ppm detection limit'
  },
  {
    sNo: '5',
    date: '01-Mar-2026',
    productName: 'Liposomal Bupivacaine Injectable',
    requiredTest: 'High-Resolution Mass Spectrometry (HRMS)',
    instrumentName: 'Thermo Orbitrap Exploris 120',
    sampleDetails: 'Accelerated Stability Unknown Degradant at RRT 1.14 (10mg)',
    reasonForRequirement: 'Impurity profiling and structural elucidation per ICH Q3A',
    initiatedBy: 'Vikram Shenoy',
    approvedBy: 'Dr. Ramesh',
    duration: '10 Days',
    reportReceivedOn: '11-Mar-2026',
    remarks: 'M+H at m/z 391.24 confirms N-oxide degradation adduct'
  },
  {
    sNo: '6',
    date: '10-Mar-2026',
    productName: 'Acrylic Emulsion Binder 50% Solids 500mg',
    requiredTest: 'Specific Surface Area (BET)',
    instrumentName: 'Micromeritics TriStar II Plus',
    sampleDetails: 'Micronized Active Pharmaceutical Ingredient (Batch MC-882, 15g)',
    reasonForRequirement: 'Milling process optimization and surface area determination',
    initiatedBy: 'Sneha Roy',
    approvedBy: 'Dr. Satish',
    duration: '3 Days',
    reportReceivedOn: '13-Mar-2026',
    remarks: 'BET surface area: 4.82 m²/g, meeting target 4.5–5.5 m²/g'
  },
  {
    sNo: '7',
    date: '22-Mar-2026',
    productName: 'Nanocrystal Oral Suspension',
    requiredTest: 'In-Vitro Permeability (Caco-2 Assay)',
    instrumentName: 'Multi-well Transwell Automated System',
    sampleDetails: 'Nanocrystal prototype NS-04 (50mL)',
    reasonForRequirement: 'BCS Class IV permeability enhancement verification',
    initiatedBy: 'Dr. Prriya',
    approvedBy: 'Dr. Satish',
    duration: '14 Days',
    reportReceivedOn: '05-Apr-2026',
    remarks: 'Apparent permeability Papp improved 3.2-fold vs conventional formulation'
  },
  {
    sNo: '8',
    date: '08-Apr-2026',
    productName: 'Taphalgin Extended Release',
    requiredTest: 'Residual Solvents (Headspace GC-MS)',
    instrumentName: 'Shimadzu GCMS-QP2020 NX',
    sampleDetails: 'Coated Granules Scale-Up Batch SG-01 (20g)',
    reasonForRequirement: 'Determination of residual Isopropanol & Methylene Chloride',
    initiatedBy: 'Pooja Verma',
    approvedBy: 'Dr. Ramesh',
    duration: '4 Days',
    reportReceivedOn: '12-Apr-2026',
    remarks: 'IPA < 50 ppm, DCM < 10 ppm (well below ICH Q3C limits)'
  },
  {
    sNo: '9',
    date: '19-Apr-2026',
    productName: 'Acrylic Emulsion Binder 50% Solids',
    requiredTest: 'Nuclear Magnetic Resonance (NMR 500MHz)',
    instrumentName: 'Bruker Avance III HD 500',
    sampleDetails: 'Key Starting Material KSM-02 (Batch KSM-910, 50mg in DMSO-d6)',
    reasonForRequirement: 'Confirmation of chemical structure and regio-isomerism',
    initiatedBy: 'Vikram Shenoy',
    approvedBy: 'Dr. Ramesh',
    duration: '2 Days',
    reportReceivedOn: '21-Apr-2026',
    remarks: '1H and 13C NMR spectra fully consistent with assigned structure'
  },
  {
    sNo: '10',
    date: '02-May-2026',
    productName: 'Liposomal Gadobutrol Vial',
    requiredTest: 'Osmolality & Sub-visible Particle Count',
    instrumentName: 'PAMAS SVSS / Advanced Instruments Osmometer',
    sampleDetails: 'Injectable Concentrate Batch INJ-01 (10 Vials)',
    reasonForRequirement: 'Pharmacopoeial testing per USP <788> and USP <785>',
    initiatedBy: 'Karthik N.',
    approvedBy: 'Dr. Satish',
    duration: '5 Days',
    reportReceivedOn: '07-May-2026',
    remarks: 'Particles >= 10µm: 12/container; Particles >= 25µm: 1/container (USP pass)'
  },
  {
    sNo: '11',
    date: '15-May-2026',
    productName: 'Risidiplam API Hydrate',
    requiredTest: 'Thermogravimetric Analysis (TGA)',
    instrumentName: 'PerkinElmer TGA 8000',
    sampleDetails: 'Hydrate Form Lyophilized Powder (Batch LP-05, 10mg)',
    reasonForRequirement: 'Stoichiometric water of crystallization quantification',
    initiatedBy: 'Sneha Roy',
    approvedBy: 'Dr. Ramesh',
    duration: '3 Days',
    reportReceivedOn: '18-May-2026',
    remarks: 'Weight loss of 4.85% at 95°C indicates monohydrate form'
  },
  {
    sNo: '12',
    date: '28-May-2026',
    productName: 'Topical Gel Prototype G-12',
    requiredTest: 'Viscosity & Rheological Flow Profile',
    instrumentName: 'Anton Paar MCR 302e Rheometer',
    sampleDetails: 'Topical Gel Base Prototype G-12 (50g)',
    reasonForRequirement: 'Thixotropic loop and shear thinning behavior evaluation',
    initiatedBy: 'Dr. Prriya',
    approvedBy: 'Dr. Satish',
    duration: '4 Days',
    reportReceivedOn: 'Pending',
    remarks: 'Sample submitted to NABL accredited testing laboratory; report awaited'
  }
];
