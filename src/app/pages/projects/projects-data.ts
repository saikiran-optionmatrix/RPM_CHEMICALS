export interface Project {
  projectCode: string;
  projectId?: string;
  productId?: string;
  projectOwner: string;
  projectLead: string;
  molecule: string;
  productName: string;
  dosageForm: string;
  strength: string;
  targetMarket?: string;
  estimatedCostForDevelopment?: string;
  marketSizeInUsd?: string;
  levelOfCompetition?: string;
  competitorName?: string;
  marketAccessStrategy?: string;
  projectedMarketShare?: string;
  projectedNpv?: string;
  commercialAttractiveness?: string;
  priorityOfProject?: string;
  timelineForCompletionOfProject?: string;
  projectInitiatedOn?: string;
  productStatus?: string;
  preEbActivitiesCompletedOn?: string;
  tentativeBatchSize?: string;
  tentativeEbBatchPlan?: string;
  projectCompletedDate?: string;
  expectedMaCost?: string;
  drugAuthorityName?: string;
  remarks?: string;
  status: "Active" | "Inactive";
  division?: string;
  location?: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;

  // Columns from chemical manufacturing data conversion
  starProduct?: string;
  registrationType?: string;
  priority?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  projectBudget?: string;
  market?: string;
  marketSizeLast3Years?: string;
  marketSizeUsdMnYr?: string;
  fillVolume?: string;
  pharmacopoeia?: string;
  packagingDetails?: string;
  innovatorCompany?: string;
  innovatorBrandName?: string;
  innovatorDosageForm?: string;
  innovatorStrengths?: string;
  innovatorApprovalDate?: string;
  innovatorPackPresentation?: string;
  innovatorBioStrength?: string;
  rldInformation?: string;
  innovatorVsJodas?: string;
  ipDetails?: string;
  apiManufacturer?: string;
  polymorphForm?: string;
  cepDmfNoReceiptStatus?: string;
  dmfAsmfCepReceived?: string;
  apiVendorQualification?: string;
  apiMl?: string;
  apiGmp?: string;
  ml?: string;
  whoGmp?: string;
  fsc?: string;
  copp?: string;
  bioStudyCroName?: string;
  bioStudyCroGmpStatus?: string;
  beNoc?: string;
  studyTimePeriod?: string;
  bioStudyReport?: string;
}

export const projects: Project[] = [
  {
    "projectCode": "2026/CHM/006",
    "productId": "PRJ-2026-8492",
    "projectId": "PRJ-2026-8492",
    "productName": "Acrylic Emulsion Binder 50% Solids",
    "molecule": "Acrylic copolymer (butyl acrylate / methyl methacrylate) emulsion",
    "division": "Coatings & Adhesives Resins",
    "starProduct": "Yes",
    "registrationType": "New Product Development / REACH-India",
    "projectOwner": "Product Strategy",
    "projectLead": "Ananya Rao",
    "priority": "High",
    "projectStartDate": "15-Jan-2026",
    "projectEndDate": "31-Jul-2027",
    "projectBudget": "0.55",
    "market": "India / ASEAN",
    "marketSizeLast3Years": "Market trend analysis required for 2023–2025; source data to be confirmed",
    "marketSizeUsdMnYr": "62",
    "projectedMarketShare": "7.0%",
    "commercialAttractiveness": "High",
    "projectedNpv": "3.4",
    "dosageForm": "Aqueous milky-white emulsion, general-purpose binder grade",
    "strength": "50 +/- 1% w/w solids",
    "fillVolume": "200 kg drum; 1,000 kg IBC",
    "pharmacopoeia": "ISO 3251; ASTM D1475; BIS",
    "packagingDetails": "HDPE drum with tamper-evident closure",
    "innovatorCompany": "Dow",
    "innovatorBrandName": "Rhoplex (Dow)",
    "innovatorDosageForm": "Aqueous acrylic emulsion",
    "innovatorStrengths": "About 50% solids",
    "innovatorApprovalDate": "Mature grade; confirm",
    "innovatorPackPresentation": "200 kg drum",
    "innovatorBioStrength": "Per benchmark TDS and CoA",
    "rldInformation": "TDS, SDS and CoA of benchmark lots procured; analytical characterization planned",
    "innovatorVsJodas": "Equivalence of solids, particle size, viscosity, minimum film-forming temperature and film properties planned",
    "ipDetails": "Patent landscape and freedom-to-operate review required",
    "apiManufacturer": "In-house plant: nominated",
    "polymorphForm": "Semi-batch emulsion polymerization, persulfate initiator",
    "cepDmfNoReceiptStatus": "Monomer supplier SDS: pending",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Under evaluation",
    "apiMl": "Planned",
    "apiGmp": "Planned",
    "ml": "Planned",
    "whoGmp": "Planned",
    "fsc": "Planned",
    "copp": "Planned",
    "bioStudyCroName": "Coatings application lab: TBD",
    "bioStudyCroGmpStatus": "To be assessed",
    "beNoc": "Customer trial approvals required",
    "studyTimePeriod": "4-6 months",
    "bioStudyReport": "Paint and coating performance report planned",
    "remarks": "Illustrative planning data; confirm benchmark equivalence assumptions.",
    "status": "Active",
    "historyCount": 4,
    "updatedDate": "05-Oct-2026",
    "updatedBy": "Ananya Rao",
    "location": "Vadodara"
  },
  {
    "projectCode": "2026/CHM/007",
    "productId": "PRJ-2026-5127",
    "projectId": "PRJ-2026-5127",
    "productName": "Liquid Epoxy Resin (BPA, EEW 185-192)",
    "molecule": "Bisphenol-A diglycidyl ether epoxy resin",
    "division": "Epoxy & Composites",
    "starProduct": "Yes",
    "registrationType": "New Product Development / EU REACH",
    "projectOwner": "Portfolio Management",
    "projectLead": "Rahul Mehta",
    "priority": "Medium",
    "projectStartDate": "01-Dec-2026",
    "projectEndDate": "30-Nov-2027",
    "projectBudget": "0.45",
    "market": "India / Middle East",
    "marketSizeLast3Years": "Three-year market trend to be established using validated market intelligence",
    "marketSizeUsdMnYr": "55",
    "projectedMarketShare": "6.0%",
    "commercialAttractiveness": "Medium",
    "projectedNpv": "2.8",
    "dosageForm": "Clear viscous liquid, general-purpose grade",
    "strength": "EEW 185-192 g/eq",
    "fillVolume": "220 kg drum; 1,100 kg IBC",
    "pharmacopoeia": "ASTM D1652; ISO 3001",
    "packagingDetails": "Lined steel drum, nitrogen blanket",
    "innovatorCompany": "Dow",
    "innovatorBrandName": "D.E.R. 331 (Dow)",
    "innovatorDosageForm": "Liquid epoxy resin",
    "innovatorStrengths": "EEW 182-192",
    "innovatorApprovalDate": "Mature grade; confirm",
    "innovatorPackPresentation": "220 kg drum",
    "innovatorBioStrength": "Per benchmark TDS and CoA",
    "rldInformation": "TDS, SDS and CoA of benchmark lots procured; epoxide equivalent and viscosity testing planned",
    "innovatorVsJodas": "Equivalence of EEW, colour, hydrolysable chloride and cure profile planned",
    "ipDetails": "Patent landscape and FTO review required; process patent check",
    "apiManufacturer": "Toll manufacturer: shortlisted",
    "polymorphForm": "Epichlorohydrin / BPA condensation, caustic catalyst",
    "cepDmfNoReceiptStatus": "Raw material REACH registration: requested",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Under evaluation",
    "apiMl": "Planned",
    "apiGmp": "Planned",
    "ml": "Planned",
    "whoGmp": "Planned",
    "fsc": "Planned",
    "copp": "Planned",
    "bioStudyCroName": "Composites testing lab: TBD",
    "bioStudyCroGmpStatus": "To be assessed",
    "beNoc": "Customer qualification required",
    "studyTimePeriod": "6-9 months",
    "bioStudyReport": "Cure and mechanical performance report planned",
    "remarks": "Illustrative planning data; EU REACH registration required.",
    "status": "Active",
    "historyCount": 5,
    "updatedDate": "03-Oct-2026",
    "updatedBy": "Rahul Mehta",
    "location": "Ahmedabad"
  },
  {
    "projectCode": "2026/CHM/008",
    "productId": "PRJ-2026-9341",
    "projectId": "PRJ-2026-9341",
    "productName": "SLES 70% Paste",
    "molecule": "Sodium lauryl ether sulfate (anionic surfactant)",
    "division": "Surfactants & Personal Care",
    "starProduct": "Yes",
    "registrationType": "Product Development / ROW Registration",
    "projectOwner": "Product Strategy",
    "projectLead": "Priya Nair",
    "priority": "High",
    "projectStartDate": "01-Jan-2027",
    "projectEndDate": "31-Dec-2027",
    "projectBudget": "0.38",
    "market": "India / Africa",
    "marketSizeLast3Years": "Market trend and competitor assessment required for 2023–2025",
    "marketSizeUsdMnYr": "48",
    "projectedMarketShare": "5.5%",
    "commercialAttractiveness": "Medium",
    "projectedNpv": "2.4",
    "dosageForm": "Pale viscous paste",
    "strength": "70 +/- 2% active matter",
    "fillVolume": "200 kg drum",
    "pharmacopoeia": "ISO 2271; ASTM D1681",
    "packagingDetails": "HDPE drum",
    "innovatorCompany": "BASF",
    "innovatorBrandName": "Texapon N 70 (BASF)",
    "innovatorDosageForm": "Surfactant paste",
    "innovatorStrengths": "About 70% active matter",
    "innovatorApprovalDate": "Mature grade; confirm",
    "innovatorPackPresentation": "200 kg drum",
    "innovatorBioStrength": "Per benchmark TDS and CoA",
    "rldInformation": "TDS, SDS and CoA of benchmark lots procured; active matter and 1,4-dioxane content testing planned",
    "innovatorVsJodas": "Comparable active matter, colour and sulfate content planned",
    "ipDetails": "Patent landscape and FTO review required",
    "apiManufacturer": "Toll manufacturer: shortlisted",
    "polymorphForm": "Ethoxylation and sulfation (falling-film SO3)",
    "cepDmfNoReceiptStatus": "Raw material SDS and registration: pending",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Under evaluation",
    "apiMl": "Planned",
    "apiGmp": "Planned",
    "ml": "Planned",
    "whoGmp": "Planned",
    "fsc": "Planned",
    "copp": "Planned",
    "bioStudyCroName": "Personal-care formulation lab: TBD",
    "bioStudyCroGmpStatus": "To be assessed",
    "beNoc": "Customer qualification required",
    "studyTimePeriod": "3-6 months",
    "bioStudyReport": "Foaming and viscosity performance report planned",
    "remarks": "Illustrative planning data; 1,4-dioxane limits to be confirmed.",
    "status": "Active",
    "historyCount": 3,
    "updatedDate": "12-Oct-2026",
    "updatedBy": "Priya Nair",
    "location": "Mumbai"
  },
  {
    "projectCode": "2026/CHM/009",
    "productId": "PRJ-2026-2678",
    "projectId": "PRJ-2026-2678",
    "productName": "Fumed Silica (Hydrophilic, 200 m2/g)",
    "molecule": "Amorphous silicon dioxide (flame hydrolysis)",
    "division": "Specialty Silicas",
    "starProduct": "No",
    "registrationType": "New Product Development / EU REACH",
    "projectOwner": "Technical Operations",
    "projectLead": "Karthik Reddy",
    "priority": "Medium",
    "projectStartDate": "15-Feb-2027",
    "projectEndDate": "15-Feb-2028",
    "projectBudget": "0.65",
    "market": "India / selected export markets",
    "marketSizeLast3Years": "Export and domestic data evaluation in progress",
    "marketSizeUsdMnYr": "70",
    "projectedMarketShare": "4.5%",
    "commercialAttractiveness": "High",
    "projectedNpv": "3.8",
    "dosageForm": "Fluffy white powder",
    "strength": "200 +/- 25 m2/g surface area",
    "fillVolume": "10 kg bag; 500 kg bulk bag",
    "pharmacopoeia": "ISO 9277; ISO 3262",
    "packagingDetails": "Multi-wall paper bag, PE liner",
    "innovatorCompany": "Evonik",
    "innovatorBrandName": "AEROSIL 200 (Evonik)",
    "innovatorDosageForm": "Fumed silica powder",
    "innovatorStrengths": "About 200 m2/g",
    "innovatorApprovalDate": "Mature grade; confirm",
    "innovatorPackPresentation": "10 kg bag",
    "innovatorBioStrength": "Per benchmark TDS and CoA",
    "rldInformation": "TDS, SDS and CoA of benchmark lots procured; surface area and tamped density testing planned",
    "innovatorVsJodas": "Comparable surface area, silanol density and thickening performance planned",
    "ipDetails": "Patent landscape and FTO review required; surface-treatment process IP",
    "apiManufacturer": "In-house plant: nominated",
    "polymorphForm": "Flame hydrolysis of silicon tetrachloride",
    "cepDmfNoReceiptStatus": "Raw material file: requested",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Under evaluation",
    "apiMl": "Planned",
    "apiGmp": "Planned",
    "ml": "Planned",
    "whoGmp": "Planned",
    "fsc": "Planned",
    "copp": "Planned",
    "bioStudyCroName": "Rubber and silicone testing lab: TBD",
    "bioStudyCroGmpStatus": "To be assessed",
    "beNoc": "Customer qualification required",
    "studyTimePeriod": "6-9 months",
    "bioStudyReport": "Reinforcement and rheology report planned",
    "remarks": "Illustrative planning data; dust-handling controls pending.",
    "status": "Active",
    "historyCount": 2,
    "updatedDate": "18-Oct-2026",
    "updatedBy": "Karthik Reddy",
    "location": "Hyderabad"
  },
  {
    "projectCode": "2026/CHM/010",
    "productId": "PRJ-2026-4815",
    "projectId": "PRJ-2026-4815",
    "productName": "Hydrogen Peroxide 50% w/w",
    "molecule": "Hydrogen peroxide (anthraquinone process)",
    "division": "Industrial Chemicals",
    "starProduct": "No",
    "registrationType": "New Plant Development / ASEAN Registration",
    "projectOwner": "Product Development",
    "projectLead": "Neha Kapoor",
    "priority": "High",
    "projectStartDate": "01-Mar-2027",
    "projectEndDate": "28-Feb-2028",
    "projectBudget": "0.50",
    "market": "India / selected regulated markets",
    "marketSizeLast3Years": "Regional capacity and demand assessment in progress",
    "marketSizeUsdMnYr": "85",
    "projectedMarketShare": "5.0%",
    "commercialAttractiveness": "High",
    "projectedNpv": "4.1",
    "dosageForm": "Clear colourless liquid, stabilized",
    "strength": "50 +/- 0.5% w/w H2O2",
    "fillVolume": "1,000 kg IBC; tanker",
    "pharmacopoeia": "ISO 2229; ASTM E2294",
    "packagingDetails": "HDPE IBC with vented cap (UN-approved)",
    "innovatorCompany": "Commercial benchmark",
    "innovatorBrandName": "Commercial 50% H2O2 grade",
    "innovatorDosageForm": "Aqueous solution",
    "innovatorStrengths": "50% w/w",
    "innovatorApprovalDate": "Mature grade; confirm",
    "innovatorPackPresentation": "IBC / tanker",
    "innovatorBioStrength": "Per benchmark TDS and CoA",
    "rldInformation": "TDS, SDS and CoA of benchmark lots procured; assay and stabilizer content testing planned",
    "innovatorVsJodas": "Comparable assay, stability and decomposition rate planned",
    "ipDetails": "Patent landscape and FTO review required; stabilizer formulation IP",
    "apiManufacturer": "Toll manufacturer: shortlisted",
    "polymorphForm": "Anthraquinone auto-oxidation, Pd hydrogenation catalyst",
    "cepDmfNoReceiptStatus": "Catalyst supplier file: pending",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Under evaluation",
    "apiMl": "Planned",
    "apiGmp": "Planned",
    "ml": "Planned",
    "whoGmp": "Planned",
    "fsc": "Planned",
    "copp": "Planned",
    "bioStudyCroName": "Water-treatment pilot lab: TBD",
    "bioStudyCroGmpStatus": "To be assessed",
    "beNoc": "Country-level approvals required",
    "studyTimePeriod": "6-12 months",
    "bioStudyReport": "Stability and efficacy report planned",
    "remarks": "Illustrative planning data; storage and transport permits vary by market.",
    "status": "Active",
    "historyCount": 6,
    "updatedDate": "22-Oct-2026",
    "updatedBy": "Neha Kapoor",
    "location": "Pune"
  }
];

export const projectOwners = [
  "Product Strategy",
  "Portfolio Management",
  "Technical Operations",
  "Product Development",
  "Ananya Rao",
  "Rahul Mehta",
  "Priya Nair",
  "Karthik Reddy",
  "Neha Kapoor"
];

export const projectLeads = [
  "Ananya Rao",
  "Rahul Mehta",
  "Priya Nair",
  "Karthik Reddy",
  "Neha Kapoor",
  "Dr. Priya Raman",
  "Vikram Singh",
  "Anita Desai",
  "Rajesh Kumar"
];

export const molecules = [
  "Acrylic copolymer (butyl acrylate / methyl methacrylate) emulsion",
  "Bisphenol-A diglycidyl ether epoxy resin",
  "Sodium lauryl ether sulfate (anionic surfactant)",
  "Amorphous silicon dioxide (flame hydrolysis)",
  "Hydrogen peroxide (anthraquinone process)",
  "Polyurethane dispersion polymer",
  "Palladium on carbon catalyst"
];

export const dosageForms = [
  "Aqueous milky-white emulsion, general-purpose binder grade",
  "Clear viscous liquid, general-purpose grade",
  "Pale viscous paste",
  "Fluffy white powder",
  "Clear colourless liquid, stabilized",
  "Aqueous dispersion",
  "Granular / powder"
];

export const targetMarkets = [
  "India / ASEAN",
  "India / Middle East",
  "India / Africa",
  "India / selected export markets",
  "India / selected regulated markets",
  "Domestic",
  "Global Export"
];

export const competitionLevels = [
  "High",
  "Medium",
  "Low",
  "Tier-1 Established",
  "Commodity"
];

export const commercialAttractivenessOptions = [
  "High",
  "Medium",
  "Low",
  "Attractive",
  "Very attractive"
];

export const priorityOptions = [
  "Critical",
  "High",
  "Medium",
  "Low"
];

export const productStatusOptions = [
  "Active",
  "Under evaluation",
  "In Development",
  "Completed",
  "On Hold"
];

export const drugAuthorityOptions = [
  "REACH / TSCA",
  "India Chemical Rules",
  "EU REACH",
  "K-REACH",
  "ASEAN Chemical Framework",
  "US EPA / TSCA"
];

export const locations = [
  "Vadodara",
  "Ahmedabad",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Bengaluru",
  "Chennai",
  "Delhi",
  "Baddi"
];
