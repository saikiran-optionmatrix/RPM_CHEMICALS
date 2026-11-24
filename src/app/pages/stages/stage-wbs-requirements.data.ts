export interface WbsRequirementConfig {
  wbsId: string;
  activityName: string;
  requirements: string[];
}

export interface WbsAtomicRequirement {
  wbsId: string;
  activity: string;
  requirement: string;
}

/**
 * Complete Atomic Requirements mapping for Chemical Manufacturing Stages S1 through S12.
 */
export const STAGE_WBS_REQUIREMENTS: Record<string, string[]> = {
  "1.1.1": [
    "Technical specification and target acceptance criteria for Review industrial customer specifications, grade requirements and end-use application criteria",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.1.2": [
    "Technical specification and target acceptance criteria for Screen global supply-chain gaps and identify target domestic and export market volumes",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.1.3": [
    "Technical specification and target acceptance criteria for Analyze target product physicochemical specifications (purity, solids content, assay, moisture)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.1.4": [
    "Technical specification and target acceptance criteria for Assess raw material availability, key chemical building blocks and supplier sourcing channels",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.1.5": [
    "Technical specification and target acceptance criteria for Define Target Product Profile (TPP) and customer technical acceptance benchmarks",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.2.1": [
    "Technical specification and target acceptance criteria for Source benchmark competitor chemical samples and commercial lot references",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.2.2": [
    "Technical specification and target acceptance criteria for Perform comprehensive spectroscopic characterization (FTIR, NMR, GC-MS, HPLC, ICP-OES)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.2.3": [
    "Technical specification and target acceptance criteria for Determine thermal stability, glass transition (Tg), viscosity profile and rheological behavior",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.2.4": [
    "Technical specification and target acceptance criteria for Evaluate performance benchmarking vs incumbent industry standard grades",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.2.5": [
    "Technical specification and target acceptance criteria for Map competitive patent landscape and identify Freedom-to-Operate (FTO) white spaces",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.3.1": [
    "Technical specification and target acceptance criteria for Model preliminary Cost of Manufacturing (COM) including raw materials, utilities and yield",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.3.2": [
    "Technical specification and target acceptance criteria for Estimate plant CAPEX investment requirements, equipment footprint and lead-time bottlenecks",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.3.3": [
    "Technical specification and target acceptance criteria for Develop 10-year risk-adjusted commercial Net Present Value (NPV) and IRR economic model",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "1.3.4": [
    "Technical specification and target acceptance criteria for Finalize chemical product opportunity charter and submit for Gate 1 stage sign-off",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.1.1": [
    "Technical specification and target acceptance criteria for Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.1.2": [
    "Technical specification and target acceptance criteria for Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.1.3": [
    "Technical specification and target acceptance criteria for Screen solvent compatibility, green chemistry metrics (atom economy, E-factor, PMI) and recycling",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.1.4": [
    "Technical specification and target acceptance criteria for Establish initial laboratory reaction feasibility criteria, conversion rates and selectivity bounds",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.2.1": [
    "Technical specification and target acceptance criteria for Identify and qualify primary and secondary chemical suppliers for key raw materials and catalysts",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.2.2": [
    "Technical specification and target acceptance criteria for Draft raw material inspection standards, hazardous chemical storage classifications and SDS",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.2.3": [
    "Technical specification and target acceptance criteria for Review environmental regulatory requirements (CPCB / SPCB consent to establish, hazardous waste categories)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.2.4": [
    "Technical specification and target acceptance criteria for Assess global chemical registration triggers (EU REACH tonnage bands, TSCA inventory status, India REACH)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.3.1": [
    "Technical specification and target acceptance criteria for Refine plant-scale techno-economic feasibility model based on laboratory screening yields",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.3.2": [
    "Technical specification and target acceptance criteria for Conduct multi-disciplinary technical risk assessment and process limitation review",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.3.3": [
    "Technical specification and target acceptance criteria for Compile Gate 1 feasibility dossier, preliminary mass balance and product specification sheet",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "2.3.4": [
    "Technical specification and target acceptance criteria for Formal Gate 1 Concept Approval review by stage-gate committee for route scouting sanction",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.1.1": [
    "Technical specification and target acceptance criteria for Execute laboratory synthesis trials for candidate route A (catalytic hydrogenation / oxidation)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.1.2": [
    "Technical specification and target acceptance criteria for Execute parallel synthesis trials for alternative route B (direct condensation / halogenation)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.1.3": [
    "Technical specification and target acceptance criteria for Compare raw material costs, conversion rates, selectivity and by-product generation across routes",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.1.4": [
    "Technical specification and target acceptance criteria for Evaluate reagent hazard profiles, toxicity classification and exposure control requirements",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.1.5": [
    "Technical specification and target acceptance criteria for Select preferred synthesis route based on yield, selectivity, scalability and process safety",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.2.1": [
    "Technical specification and target acceptance criteria for Screen homogeneous and heterogeneous catalysts (precious metal Pd/C, Pt/Al2O3, zeolites, Lewis acids)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.2.2": [
    "Technical specification and target acceptance criteria for Determine optimal catalyst loading, turnover frequency (TOF) and reuse/regeneration cycles",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.2.3": [
    "Technical specification and target acceptance criteria for Investigate reaction parameter boundaries (temperature window, operating pressure, addition rates)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.2.4": [
    "Technical specification and target acceptance criteria for Optimize agitation speed, mixing dynamics and gas-liquid mass transfer in autoclave reactors",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.3.1": [
    "Technical specification and target acceptance criteria for Produce laboratory proof-of-chemistry batches meeting target chemical purity (>98.5%)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.3.2": [
    "Technical specification and target acceptance criteria for Develop discriminatory chromatographic analytical methods (HPLC / GC-FID / Headspace GC)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.3.3": [
    "Technical specification and target acceptance criteria for Identify and structurally elucidate reaction intermediates and critical process impurities",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "3.3.4": [
    "Technical specification and target acceptance criteria for Compile Route Scouting Summary Report with preliminary reaction kinetics and mass balance",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.1.1": [
    "Technical specification and target acceptance criteria for Design and execute Factorial / Response Surface DoE for critical process parameters",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.1.2": [
    "Technical specification and target acceptance criteria for Determine Proven Acceptable Ranges (PAR) for reaction temperature, catalyst concentration and feed rates",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.1.3": [
    "Technical specification and target acceptance criteria for Investigate reaction kinetics, activation energy and intermediate accumulation behavior",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.1.4": [
    "Technical specification and target acceptance criteria for Optimize reaction conversion to minimize residual unreacted starting materials and side reactions",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.1.5": [
    "Technical specification and target acceptance criteria for Establish process control strategy and in-process testing (IPT) specifications",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.2.1": [
    "Technical specification and target acceptance criteria for Optimize quenching, phase separation, liquid-liquid extraction and aqueous wash protocols",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.2.2": [
    "Technical specification and target acceptance criteria for Screen anti-solvents, cooling crystallization curves and seed loading for controlled crystal growth",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.2.3": [
    "Technical specification and target acceptance criteria for Evaluate cake washing efficiency, filtration resistance and centrifugal separation parameters",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.2.4": [
    "Technical specification and target acceptance criteria for Optimize cake drying parameters (vacuum tray / conical dryer) to eliminate solvent inclusions",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.2.5": [
    "Technical specification and target acceptance criteria for Develop solvent distillation recovery process targeting >85% solvent recycle efficiency",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.3.1": [
    "Technical specification and target acceptance criteria for Profile organic impurities, residual solvents and elemental catalyst traces across optimized lots",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.3.2": [
    "Technical specification and target acceptance criteria for Validate analytical test methods for assay, related substances and moisture per ASTM/ISO guidelines",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.3.3": [
    "Technical specification and target acceptance criteria for Establish comprehensive stage mass balance and energy balance at 5-liter bench scale",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "4.3.4": [
    "Technical specification and target acceptance criteria for Author Lab-Scale Process Optimization Report and provisional commercial specifications",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.1.1": [
    "Technical specification and target acceptance criteria for Formally lock commercial synthetic pathway, catalyst system and solvent matrix",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.1.2": [
    "Technical specification and target acceptance criteria for Develop detailed Process Flow Diagrams (PFD) with stream compositions, flow rates and enthalpies",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.1.3": [
    "Technical specification and target acceptance criteria for Establish operating envelopes, design pressures and design temperatures for all unit operations",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.1.4": [
    "Technical specification and target acceptance criteria for Define process waste streams, gaseous emissions and wastewater effluent characteristics",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.2.1": [
    "Technical specification and target acceptance criteria for Finalize engineering Basis of Design (BOD) document for pilot plant and production facility",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.2.2": [
    "Technical specification and target acceptance criteria for Complete rigorous ASPEN / ChemCAD steady-state simulation for mass and energy balances",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.2.3": [
    "Technical specification and target acceptance criteria for Specify materials of construction (SS316L, Hastelloy C-276, Glass-lined) based on corrosion testing",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.2.4": [
    "Technical specification and target acceptance criteria for Size major process equipment (reactors, condensers, crystallizers, filters, scrubbers)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.3.1": [
    "Technical specification and target acceptance criteria for Qualify dual commercial suppliers for all critical starting materials, reagents and solvents",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.3.2": [
    "Technical specification and target acceptance criteria for Update Commercial Cost of Manufacturing (COM) model based on locked engineering parameters",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "5.3.3": [
    "Technical specification and target acceptance criteria for Gate 2 Decision Review: Process Route Selection & Basis of Design sign-off for pilot development",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.1.1": [
    "Technical specification and target acceptance criteria for Calculate scale-up dimensionless numbers (Reynolds, Froude, Power number) and impeller tip speeds",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.1.2": [
    "Technical specification and target acceptance criteria for Model jacket heat transfer coefficients (U-values) for pilot scale vs laboratory glass reactors",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.1.3": [
    "Technical specification and target acceptance criteria for Conduct gas-liquid mass transfer studies (kLa measurement) for hydrogenator and oxidation reactors",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.1.4": [
    "Technical specification and target acceptance criteria for Establish dosing / addition rate profiles to prevent localized hotspots and runaway exotherms",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.1.5": [
    "Technical specification and target acceptance criteria for Optimize pilot batch cycle times and determine maximum holding times for intermediates",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.2.1": [
    "Technical specification and target acceptance criteria for Scale up fractional distillation column packing, reflux ratios and vacuum control systems",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.2.2": [
    "Technical specification and target acceptance criteria for Perform pilot-scale Nutsche filter-dryer / centrifuge filtration and wash displacement trials",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.2.3": [
    "Technical specification and target acceptance criteria for Scale up fluid-bed / vacuum paddle drying operations and establish particle size distribution controls",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.2.4": [
    "Technical specification and target acceptance criteria for Evaluate mother liquor recycling and secondary product recovery in pilot campaign",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.3.1": [
    "Technical specification and target acceptance criteria for Map unit operations against pilot plant reactor trains and utility capacities",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.3.2": [
    "Technical specification and target acceptance criteria for Author comprehensive Pilot Plant Tech Transfer Dossier (TTD) and Master Batch Records (MBR)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.3.3": [
    "Technical specification and target acceptance criteria for Conduct operator training on batch sequence, hazardous reagent handling and critical control points",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "6.3.4": [
    "Technical specification and target acceptance criteria for Complete pilot equipment line clearance, cleaning verification and instrument calibration",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.1.1": [
    "Technical specification and target acceptance criteria for Execute Reaction Calorimetry (RC1) to determine heat of reaction and adiabatic temperature rise",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.1.2": [
    "Technical specification and target acceptance criteria for Perform Differential Scanning Calorimetry (DSC) and Thermal Screening Unit (TSu) on raw materials",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.1.3": [
    "Technical specification and target acceptance criteria for Conduct Accelerating Rate Calorimetry (ARC) to determine maximum temperature for synthesis (MTSR)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.1.4": [
    "Technical specification and target acceptance criteria for Establish Stoessel criticality classification (Class 1 to 5) and time-to-maximum rate (TMRad)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.1.5": [
    "Technical specification and target acceptance criteria for Size emergency pressure relief systems (rupture discs, safety valves) per DIERS methodology",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.2.1": [
    "Technical specification and target acceptance criteria for Conduct formal node-by-node HAZOP study with cross-functional safety and engineering team",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.2.2": [
    "Technical specification and target acceptance criteria for Perform Layer of Protection Analysis (LOPA) and determine Safety Integrity Levels (SIL 1/2)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.2.3": [
    "Technical specification and target acceptance criteria for Specify Safety Instrumented Systems (SIS), interlocks and automated emergency dump / quench valves",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.2.4": [
    "Technical specification and target acceptance criteria for Complete combustible dust hazard screening (Kst, Pmax, MIE) and electrostatic hazard assessment",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.2.5": [
    "Technical specification and target acceptance criteria for Implement all high-priority HAZOP recommendations and verify safety interlock logic",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.3.1": [
    "Technical specification and target acceptance criteria for Characterize process effluents (COD, BOD, TDS, heavy metals, volatile organic carbon)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.3.2": [
    "Technical specification and target acceptance criteria for Verify Effluent Treatment Plant (ETP) treatability, biodegradation kinetics and stripper requirements",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.3.3": [
    "Technical specification and target acceptance criteria for Complete acute aquatic toxicity, biodegradability and bioaccumulation studies for regulatory dossier",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "7.3.4": [
    "Technical specification and target acceptance criteria for Gate 3 Decision Review: Process Safety & Regulatory Studies sign-off for pilot execution",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.1.1": [
    "Technical specification and target acceptance criteria for Compile Substance Identification Dossier (analytical spectral data, purity profile, typical impurities)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.1.2": [
    "Technical specification and target acceptance criteria for Prepare Chemical Safety Report (CSR) including hazard classification and environmental exposure scenarios",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.1.3": [
    "Technical specification and target acceptance criteria for Generate IUCLID dossier for EU REACH (10-100 tonnes / 100-1000 tonnes tier) and UK REACH",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.1.4": [
    "Technical specification and target acceptance criteria for Submit Pre-Manufacture Notice (PMN) / TSCA Section 5 notification to US EPA",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.2.1": [
    "Technical specification and target acceptance criteria for Classify chemical substance under UN GHS / CLP criteria (physical, health and environmental hazards)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.2.2": [
    "Technical specification and target acceptance criteria for Author 16-section Safety Data Sheets (SDS) in target market languages per ISO 11014",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.2.3": [
    "Technical specification and target acceptance criteria for Design regulatory compliant transport and packaging hazard labels (GHS pictograms, ADR/IMDG)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.2.4": [
    "Technical specification and target acceptance criteria for Register product in National Chemical Inventories and poison centre notification (PCN) portals",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.3.1": [
    "Technical specification and target acceptance criteria for Submit formal chemical registration dossier to ECHA / national regulatory authorities",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.3.2": [
    "Technical specification and target acceptance criteria for Track authority review, respond to technical completeness queries and clarification requests",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "8.3.3": [
    "Technical specification and target acceptance criteria for Secure Certificate of Registration and verify import/export authorization compliance",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.1.1": [
    "Technical specification and target acceptance criteria for Perform solvent boil-out and cleaning validation of pilot reactors, transfer lines and receivers",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.1.2": [
    "Technical specification and target acceptance criteria for Complete mechanical integrity checks, pressure testing and inert nitrogen blanketing verification",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.1.3": [
    "Technical specification and target acceptance criteria for Stage and inspect qualified raw materials, catalysts and packaging containers in pilot staging area",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.1.4": [
    "Technical specification and target acceptance criteria for Review and issue executed Batch Manufacturing Records (BMR) with authorized production sign-offs",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.2.1": [
    "Technical specification and target acceptance criteria for Execute 1st pilot synthesis batch (50-100 kg scale) monitoring exotherm profile and IPT conversion",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.2.2": [
    "Technical specification and target acceptance criteria for Execute work-up, phase separation, crystallization and centrifuge isolation operations",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.2.3": [
    "Technical specification and target acceptance criteria for Dry, mill and homogenize pilot batch product under controlled atmospheric conditions",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.2.4": [
    "Technical specification and target acceptance criteria for Execute in-process quality control tests and perform mass balance closure calculation",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.3.1": [
    "Technical specification and target acceptance criteria for Package pilot batch in industrial UN-rated drums / IBC containers with moisture barrier liners",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.3.2": [
    "Technical specification and target acceptance criteria for Release Certificate of Analysis (COA) confirming all critical quality attributes meet commercial spec",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.3.3": [
    "Technical specification and target acceptance criteria for Dispatch qualification samples to lead customer technical evaluation teams",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "9.3.4": [
    "Technical specification and target acceptance criteria for Receive customer application trial feedback and compile Pilot Plant Campaign Technical Report",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.1.1": [
    "Technical specification and target acceptance criteria for Prepare demonstration-scale equipment train (1000L - 3000L reactor scale) and automation sequences",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.1.2": [
    "Technical specification and target acceptance criteria for Execute Demonstration Batch 1 verifying critical process parameter (CPP) control under DCS",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.1.3": [
    "Technical specification and target acceptance criteria for Execute continuous distillation / solvent recovery train verifying VOC emission compliance",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.1.4": [
    "Technical specification and target acceptance criteria for Execute isolated product drying, blending and final packaging operations",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.1.5": [
    "Technical specification and target acceptance criteria for Track energy consumption, steam usage, refrigeration demand and raw material specific consumption",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.2.1": [
    "Technical specification and target acceptance criteria for Execute Demonstration Batch 2 under identical operating parameters verifying process reproducibility",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.2.2": [
    "Technical specification and target acceptance criteria for Execute Demonstration Batch 3 verifying yield consistency (±2.0%) and impurity profile control",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.2.3": [
    "Technical specification and target acceptance criteria for Perform multi-batch statistical process capability analysis (Cp, Cpk > 1.33)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.2.4": [
    "Technical specification and target acceptance criteria for Confirm 3 consecutive demonstration batches meet full commercial customer release specifications",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.3.1": [
    "Technical specification and target acceptance criteria for Complete analytical equivalence testing comparing demo-scale lots with competitor benchmark grade",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.3.2": [
    "Technical specification and target acceptance criteria for Set up commercial accelerated stability testing and packaging integrity testing in 200L drums",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.3.3": [
    "Technical specification and target acceptance criteria for Finalize Commercial Tech Transfer Package (TTP) and standard operating procedures for full plant",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "10.3.4": [
    "Technical specification and target acceptance criteria for Gate 4 Decision Review: Demo-Scale Proof sign-off approving commercial plant commissioning",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.1.1": [
    "Technical specification and target acceptance criteria for Finalize Detailed Piping & Instrumentation Diagrams (P&IDs) and plant 3D layout models",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.1.2": [
    "Technical specification and target acceptance criteria for Procure commercial reactors, distillation columns, glass-lined receivers and scrubbers",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.1.3": [
    "Technical specification and target acceptance criteria for Install chemical process piping, high-integrity valves, mechanical seals and vacuum skids",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.1.4": [
    "Technical specification and target acceptance criteria for Install dedicated Effluent Treatment Plant (ETP), multi-effect evaporator (MEE) and VOC oxidizer",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.1.5": [
    "Technical specification and target acceptance criteria for Perform hydrostatic, pneumatic leak testing and non-destructive weld inspections (NDT)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.2.1": [
    "Technical specification and target acceptance criteria for Program DCS/PLC automation sequences, recipe management and emergency interlock shutdowns",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.2.2": [
    "Technical specification and target acceptance criteria for Commission plant utilities (cooling towers, chilled brine -20°C, high-pressure steam, nitrogen plant)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.2.3": [
    "Technical specification and target acceptance criteria for Perform water / solvent trial run (dry & wet commissioning) to verify fluid dynamics and pump curves",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.2.4": [
    "Technical specification and target acceptance criteria for Conduct factory acceptance testing (FAT) and site acceptance testing (SAT) on instrumentation",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.2.5": [
    "Technical specification and target acceptance criteria for Train commercial operations, maintenance, QC and safety teams on plant operating manuals",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.3.1": [
    "Technical specification and target acceptance criteria for Conduct comprehensive Pre-Startup Safety Review (PSSR) walk-through with statutory safety authorities",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.3.2": [
    "Technical specification and target acceptance criteria for Secure Consent to Operate (CTO) from State Pollution Control Board and Factory Inspectorate license",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.3.3": [
    "Technical specification and target acceptance criteria for Verify all fire protection systems, deluge nozzles, gas sensors and emergency eyewash/showers",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "11.3.4": [
    "Technical specification and target acceptance criteria for Gate 5 Decision Review: Commercial Production Readiness sign-off authorizing active chemical charging",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.1.1": [
    "Technical specification and target acceptance criteria for Charge commercial raw materials and initiate first commercial industrial-scale production campaign",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.1.2": [
    "Technical specification and target acceptance criteria for Monitor real-time DCS reactor temperature profiles, addition rates and exothermic reaction behavior",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.1.3": [
    "Technical specification and target acceptance criteria for Execute commercial crystallization, filtration and automated bulk drumming / packaging operations",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.1.4": [
    "Technical specification and target acceptance criteria for Verify commercial batch yield, overall cycle time and solvent recovery efficiency",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.2.1": [
    "Technical specification and target acceptance criteria for Perform comprehensive commercial batch testing and issue signed Certificate of Analysis (COA)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.2.2": [
    "Technical specification and target acceptance criteria for Establish raw material and finished goods warehouse ERP inventory lot tracking and barcoding",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.2.3": [
    "Technical specification and target acceptance criteria for Fulfill initial commercial customer supply contracts and industrial distribution allocations",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.2.4": [
    "Technical specification and target acceptance criteria for Monitor customer delivery, offloading safety and early application performance feedback",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.3.1": [
    "Technical specification and target acceptance criteria for Ramp up commercial plant production to nameplate capacity utilization (>85%)",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.3.2": [
    "Technical specification and target acceptance criteria for Optimize operational bottleneck areas to reduce unit production cost and specific utility consumption",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.3.3": [
    "Technical specification and target acceptance criteria for Conduct formal post-launch project review comparing actual COM and NPV vs initial project charter",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
  "12.3.4": [
    "Technical specification and target acceptance criteria for Hand over commercial chemical manufacturing asset to Operations and close Stage-Gate project lifecycle",
    "Raw material, reagent, catalyst and solvent availability with CoA clearance",
    "Calibrated process equipment, reactor train and analytical instruments",
    "Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)"
],
};


export function getRequirementsForWbs(slNo?: string, taskName?: string): string[] {
  if (slNo && STAGE_WBS_REQUIREMENTS[slNo]) {
    return STAGE_WBS_REQUIREMENTS[slNo];
  }
  return [
    'Technical specification and target acceptance criteria',
    'Raw material, reagent, catalyst and solvent availability with CoA clearance',
    'Calibrated process equipment, reactor train and analytical instruments',
    'Approved standard operating procedure (SOP) and chemical safety documentation (SDS / Hazchem)'
  ];
}

export function getRequirementItemsForWbs(slNo?: string, taskName?: string): Array<{ requirement: string; history: number }> {
  const reqs = getRequirementsForWbs(slNo, taskName);
  return reqs.map((r, i) => ({
    requirement: r,
    history: ((i * 2 + 3) % 6) + 1
  }));
}

export function getDepartmentAndRoleForRequirement(requirement: string): { department: string; role: string } {
  const r = (requirement || '').toLowerCase();
  if (r.includes('safety') || r.includes('hazard') || r.includes('sds') || r.includes('etp')) {
    return { department: 'Process Safety & EHS', role: 'Process Safety Manager' };
  }
  if (r.includes('regulatory') || r.includes('reach') || r.includes('tsca') || r.includes('registration')) {
    return { department: 'Regulatory Affairs', role: 'Regulatory Affairs Lead' };
  }
  if (r.includes('raw material') || r.includes('solvent') || r.includes('catalyst') || r.includes('supplier')) {
    return { department: 'Procurement / SCM', role: 'Chemical SCM Specialist' };
  }
  if (r.includes('pilot') || r.includes('batch') || r.includes('scale') || r.includes('production')) {
    return { department: 'Pilot Plant / Operations', role: 'Plant Production Manager' };
  }
  return { department: 'Chemical R&D', role: 'Principal Process Chemist' };
}
