export interface WbsTaskConfig {
  wbsId: string;
  activityName: string;
  tasks: string[];
}

export interface WbsAtomicTask {
  taskId: string;
  wbsId: string;
  activity: string;
  task: string;
}

/**
 * Complete Atomic Task mapping for Chemical Manufacturing Stages S1 through S12.
 */
export const STAGE_WBS_TASKS: Record<string, string[]> = {
  "1.1.1": [
    "Confirm technical scope and operating window — Review industrial customer specifications, grade requirements and end-use application criteria",
    "Prepare chemical reagents, raw materials and analytical instruments — Review industrial customer specifications, grade requirements and end-use application criteria",
    "Execute chemical process run per standard operating procedure — Review industrial customer specifications, grade requirements and end-use application criteria",
    "Perform in-process testing (IPT) and mass balance verification — Review industrial customer specifications, grade requirements and end-use application criteria",
    "Review analytical data, resolve deviations and issue technical summary report — Review industrial customer specifications, grade requirements and end-use application criteria"
],
  "1.1.2": [
    "Confirm technical scope and operating window — Screen global supply-chain gaps and identify target domestic and export market volumes",
    "Prepare chemical reagents, raw materials and analytical instruments — Screen global supply-chain gaps and identify target domestic and export market volumes",
    "Execute chemical process run per standard operating procedure — Screen global supply-chain gaps and identify target domestic and export market volumes",
    "Perform in-process testing (IPT) and mass balance verification — Screen global supply-chain gaps and identify target domestic and export market volumes",
    "Review analytical data, resolve deviations and issue technical summary report — Screen global supply-chain gaps and identify target domestic and export market volumes"
],
  "1.1.3": [
    "Confirm technical scope and operating window — Analyze target product physicochemical specifications (purity, solids content, assay, moisture)",
    "Prepare chemical reagents, raw materials and analytical instruments — Analyze target product physicochemical specifications (purity, solids content, assay, moisture)",
    "Execute chemical process run per standard operating procedure — Analyze target product physicochemical specifications (purity, solids content, assay, moisture)",
    "Perform in-process testing (IPT) and mass balance verification — Analyze target product physicochemical specifications (purity, solids content, assay, moisture)",
    "Review analytical data, resolve deviations and issue technical summary report — Analyze target product physicochemical specifications (purity, solids content, assay, moisture)"
],
  "1.1.4": [
    "Confirm technical scope and operating window — Assess raw material availability, key chemical building blocks and supplier sourcing channels",
    "Prepare chemical reagents, raw materials and analytical instruments — Assess raw material availability, key chemical building blocks and supplier sourcing channels",
    "Execute chemical process run per standard operating procedure — Assess raw material availability, key chemical building blocks and supplier sourcing channels",
    "Perform in-process testing (IPT) and mass balance verification — Assess raw material availability, key chemical building blocks and supplier sourcing channels",
    "Review analytical data, resolve deviations and issue technical summary report — Assess raw material availability, key chemical building blocks and supplier sourcing channels"
],
  "1.1.5": [
    "Confirm technical scope and operating window — Define Target Product Profile (TPP) and customer technical acceptance benchmarks",
    "Prepare chemical reagents, raw materials and analytical instruments — Define Target Product Profile (TPP) and customer technical acceptance benchmarks",
    "Execute chemical process run per standard operating procedure — Define Target Product Profile (TPP) and customer technical acceptance benchmarks",
    "Perform in-process testing (IPT) and mass balance verification — Define Target Product Profile (TPP) and customer technical acceptance benchmarks",
    "Review analytical data, resolve deviations and issue technical summary report — Define Target Product Profile (TPP) and customer technical acceptance benchmarks"
],
  "1.2.1": [
    "Confirm technical scope and operating window — Source benchmark competitor chemical samples and commercial lot references",
    "Prepare chemical reagents, raw materials and analytical instruments — Source benchmark competitor chemical samples and commercial lot references",
    "Execute chemical process run per standard operating procedure — Source benchmark competitor chemical samples and commercial lot references",
    "Perform in-process testing (IPT) and mass balance verification — Source benchmark competitor chemical samples and commercial lot references",
    "Review analytical data, resolve deviations and issue technical summary report — Source benchmark competitor chemical samples and commercial lot references"
],
  "1.2.2": [
    "Confirm technical scope and operating window — Perform comprehensive spectroscopic characterization (FTIR, NMR, GC-MS, HPLC, ICP-OES)",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform comprehensive spectroscopic characterization (FTIR, NMR, GC-MS, HPLC, ICP-OES)",
    "Execute chemical process run per standard operating procedure — Perform comprehensive spectroscopic characterization (FTIR, NMR, GC-MS, HPLC, ICP-OES)",
    "Perform in-process testing (IPT) and mass balance verification — Perform comprehensive spectroscopic characterization (FTIR, NMR, GC-MS, HPLC, ICP-OES)",
    "Review analytical data, resolve deviations and issue technical summary report — Perform comprehensive spectroscopic characterization (FTIR, NMR, GC-MS, HPLC, ICP-OES)"
],
  "1.2.3": [
    "Confirm technical scope and operating window — Determine thermal stability, glass transition (Tg), viscosity profile and rheological behavior",
    "Prepare chemical reagents, raw materials and analytical instruments — Determine thermal stability, glass transition (Tg), viscosity profile and rheological behavior",
    "Execute chemical process run per standard operating procedure — Determine thermal stability, glass transition (Tg), viscosity profile and rheological behavior",
    "Perform in-process testing (IPT) and mass balance verification — Determine thermal stability, glass transition (Tg), viscosity profile and rheological behavior",
    "Review analytical data, resolve deviations and issue technical summary report — Determine thermal stability, glass transition (Tg), viscosity profile and rheological behavior"
],
  "1.2.4": [
    "Confirm technical scope and operating window — Evaluate performance benchmarking vs incumbent industry standard grades",
    "Prepare chemical reagents, raw materials and analytical instruments — Evaluate performance benchmarking vs incumbent industry standard grades",
    "Execute chemical process run per standard operating procedure — Evaluate performance benchmarking vs incumbent industry standard grades",
    "Perform in-process testing (IPT) and mass balance verification — Evaluate performance benchmarking vs incumbent industry standard grades",
    "Review analytical data, resolve deviations and issue technical summary report — Evaluate performance benchmarking vs incumbent industry standard grades"
],
  "1.2.5": [
    "Confirm technical scope and operating window — Map competitive patent landscape and identify Freedom-to-Operate (FTO) white spaces",
    "Prepare chemical reagents, raw materials and analytical instruments — Map competitive patent landscape and identify Freedom-to-Operate (FTO) white spaces",
    "Execute chemical process run per standard operating procedure — Map competitive patent landscape and identify Freedom-to-Operate (FTO) white spaces",
    "Perform in-process testing (IPT) and mass balance verification — Map competitive patent landscape and identify Freedom-to-Operate (FTO) white spaces",
    "Review analytical data, resolve deviations and issue technical summary report — Map competitive patent landscape and identify Freedom-to-Operate (FTO) white spaces"
],
  "1.3.1": [
    "Confirm technical scope and operating window — Model preliminary Cost of Manufacturing (COM) including raw materials, utilities and yield",
    "Prepare chemical reagents, raw materials and analytical instruments — Model preliminary Cost of Manufacturing (COM) including raw materials, utilities and yield",
    "Execute chemical process run per standard operating procedure — Model preliminary Cost of Manufacturing (COM) including raw materials, utilities and yield",
    "Perform in-process testing (IPT) and mass balance verification — Model preliminary Cost of Manufacturing (COM) including raw materials, utilities and yield",
    "Review analytical data, resolve deviations and issue technical summary report — Model preliminary Cost of Manufacturing (COM) including raw materials, utilities and yield"
],
  "1.3.2": [
    "Confirm technical scope and operating window — Estimate plant CAPEX investment requirements, equipment footprint and lead-time bottlenecks",
    "Prepare chemical reagents, raw materials and analytical instruments — Estimate plant CAPEX investment requirements, equipment footprint and lead-time bottlenecks",
    "Execute chemical process run per standard operating procedure — Estimate plant CAPEX investment requirements, equipment footprint and lead-time bottlenecks",
    "Perform in-process testing (IPT) and mass balance verification — Estimate plant CAPEX investment requirements, equipment footprint and lead-time bottlenecks",
    "Review analytical data, resolve deviations and issue technical summary report — Estimate plant CAPEX investment requirements, equipment footprint and lead-time bottlenecks"
],
  "1.3.3": [
    "Confirm technical scope and operating window — Develop 10-year risk-adjusted commercial Net Present Value (NPV) and IRR economic model",
    "Prepare chemical reagents, raw materials and analytical instruments — Develop 10-year risk-adjusted commercial Net Present Value (NPV) and IRR economic model",
    "Execute chemical process run per standard operating procedure — Develop 10-year risk-adjusted commercial Net Present Value (NPV) and IRR economic model",
    "Perform in-process testing (IPT) and mass balance verification — Develop 10-year risk-adjusted commercial Net Present Value (NPV) and IRR economic model",
    "Review analytical data, resolve deviations and issue technical summary report — Develop 10-year risk-adjusted commercial Net Present Value (NPV) and IRR economic model"
],
  "1.3.4": [
    "Confirm technical scope and operating window — Finalize chemical product opportunity charter and submit for Gate 1 stage sign-off",
    "Prepare chemical reagents, raw materials and analytical instruments — Finalize chemical product opportunity charter and submit for Gate 1 stage sign-off",
    "Execute chemical process run per standard operating procedure — Finalize chemical product opportunity charter and submit for Gate 1 stage sign-off",
    "Perform in-process testing (IPT) and mass balance verification — Finalize chemical product opportunity charter and submit for Gate 1 stage sign-off",
    "Review analytical data, resolve deviations and issue technical summary report — Finalize chemical product opportunity charter and submit for Gate 1 stage sign-off"
],
  "2.1.1": [
    "Confirm technical scope and operating window — Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways",
    "Prepare chemical reagents, raw materials and analytical instruments — Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways",
    "Execute chemical process run per standard operating procedure — Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways",
    "Perform in-process testing (IPT) and mass balance verification — Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways",
    "Review analytical data, resolve deviations and issue technical summary report — Screen candidate synthetic routes, stoichiometric ratios and catalytic conversion pathways"
],
  "2.1.2": [
    "Confirm technical scope and operating window — Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)",
    "Prepare chemical reagents, raw materials and analytical instruments — Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)",
    "Execute chemical process run per standard operating procedure — Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)",
    "Perform in-process testing (IPT) and mass balance verification — Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)",
    "Review analytical data, resolve deviations and issue technical summary report — Evaluate reaction exotherm potential, preliminary heat of reaction and thermal hazard screening (DSC)"
],
  "2.1.3": [
    "Confirm technical scope and operating window — Screen solvent compatibility, green chemistry metrics (atom economy, E-factor, PMI) and recycling",
    "Prepare chemical reagents, raw materials and analytical instruments — Screen solvent compatibility, green chemistry metrics (atom economy, E-factor, PMI) and recycling",
    "Execute chemical process run per standard operating procedure — Screen solvent compatibility, green chemistry metrics (atom economy, E-factor, PMI) and recycling",
    "Perform in-process testing (IPT) and mass balance verification — Screen solvent compatibility, green chemistry metrics (atom economy, E-factor, PMI) and recycling",
    "Review analytical data, resolve deviations and issue technical summary report — Screen solvent compatibility, green chemistry metrics (atom economy, E-factor, PMI) and recycling"
],
  "2.1.4": [
    "Confirm technical scope and operating window — Establish initial laboratory reaction feasibility criteria, conversion rates and selectivity bounds",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish initial laboratory reaction feasibility criteria, conversion rates and selectivity bounds",
    "Execute chemical process run per standard operating procedure — Establish initial laboratory reaction feasibility criteria, conversion rates and selectivity bounds",
    "Perform in-process testing (IPT) and mass balance verification — Establish initial laboratory reaction feasibility criteria, conversion rates and selectivity bounds",
    "Review analytical data, resolve deviations and issue technical summary report — Establish initial laboratory reaction feasibility criteria, conversion rates and selectivity bounds"
],
  "2.2.1": [
    "Confirm technical scope and operating window — Identify and qualify primary and secondary chemical suppliers for key raw materials and catalysts",
    "Prepare chemical reagents, raw materials and analytical instruments — Identify and qualify primary and secondary chemical suppliers for key raw materials and catalysts",
    "Execute chemical process run per standard operating procedure — Identify and qualify primary and secondary chemical suppliers for key raw materials and catalysts",
    "Perform in-process testing (IPT) and mass balance verification — Identify and qualify primary and secondary chemical suppliers for key raw materials and catalysts",
    "Review analytical data, resolve deviations and issue technical summary report — Identify and qualify primary and secondary chemical suppliers for key raw materials and catalysts"
],
  "2.2.2": [
    "Confirm technical scope and operating window — Draft raw material inspection standards, hazardous chemical storage classifications and SDS",
    "Prepare chemical reagents, raw materials and analytical instruments — Draft raw material inspection standards, hazardous chemical storage classifications and SDS",
    "Execute chemical process run per standard operating procedure — Draft raw material inspection standards, hazardous chemical storage classifications and SDS",
    "Perform in-process testing (IPT) and mass balance verification — Draft raw material inspection standards, hazardous chemical storage classifications and SDS",
    "Review analytical data, resolve deviations and issue technical summary report — Draft raw material inspection standards, hazardous chemical storage classifications and SDS"
],
  "2.2.3": [
    "Confirm technical scope and operating window — Review environmental regulatory requirements (CPCB / SPCB consent to establish, hazardous waste categories)",
    "Prepare chemical reagents, raw materials and analytical instruments — Review environmental regulatory requirements (CPCB / SPCB consent to establish, hazardous waste categories)",
    "Execute chemical process run per standard operating procedure — Review environmental regulatory requirements (CPCB / SPCB consent to establish, hazardous waste categories)",
    "Perform in-process testing (IPT) and mass balance verification — Review environmental regulatory requirements (CPCB / SPCB consent to establish, hazardous waste categories)",
    "Review analytical data, resolve deviations and issue technical summary report — Review environmental regulatory requirements (CPCB / SPCB consent to establish, hazardous waste categories)"
],
  "2.2.4": [
    "Confirm technical scope and operating window — Assess global chemical registration triggers (EU REACH tonnage bands, TSCA inventory status, India REACH)",
    "Prepare chemical reagents, raw materials and analytical instruments — Assess global chemical registration triggers (EU REACH tonnage bands, TSCA inventory status, India REACH)",
    "Execute chemical process run per standard operating procedure — Assess global chemical registration triggers (EU REACH tonnage bands, TSCA inventory status, India REACH)",
    "Perform in-process testing (IPT) and mass balance verification — Assess global chemical registration triggers (EU REACH tonnage bands, TSCA inventory status, India REACH)",
    "Review analytical data, resolve deviations and issue technical summary report — Assess global chemical registration triggers (EU REACH tonnage bands, TSCA inventory status, India REACH)"
],
  "2.3.1": [
    "Confirm technical scope and operating window — Refine plant-scale techno-economic feasibility model based on laboratory screening yields",
    "Prepare chemical reagents, raw materials and analytical instruments — Refine plant-scale techno-economic feasibility model based on laboratory screening yields",
    "Execute chemical process run per standard operating procedure — Refine plant-scale techno-economic feasibility model based on laboratory screening yields",
    "Perform in-process testing (IPT) and mass balance verification — Refine plant-scale techno-economic feasibility model based on laboratory screening yields",
    "Review analytical data, resolve deviations and issue technical summary report — Refine plant-scale techno-economic feasibility model based on laboratory screening yields"
],
  "2.3.2": [
    "Confirm technical scope and operating window — Conduct multi-disciplinary technical risk assessment and process limitation review",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct multi-disciplinary technical risk assessment and process limitation review",
    "Execute chemical process run per standard operating procedure — Conduct multi-disciplinary technical risk assessment and process limitation review",
    "Perform in-process testing (IPT) and mass balance verification — Conduct multi-disciplinary technical risk assessment and process limitation review",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct multi-disciplinary technical risk assessment and process limitation review"
],
  "2.3.3": [
    "Confirm technical scope and operating window — Compile Gate 1 feasibility dossier, preliminary mass balance and product specification sheet",
    "Prepare chemical reagents, raw materials and analytical instruments — Compile Gate 1 feasibility dossier, preliminary mass balance and product specification sheet",
    "Execute chemical process run per standard operating procedure — Compile Gate 1 feasibility dossier, preliminary mass balance and product specification sheet",
    "Perform in-process testing (IPT) and mass balance verification — Compile Gate 1 feasibility dossier, preliminary mass balance and product specification sheet",
    "Review analytical data, resolve deviations and issue technical summary report — Compile Gate 1 feasibility dossier, preliminary mass balance and product specification sheet"
],
  "2.3.4": [
    "Confirm technical scope and operating window — Formal Gate 1 Concept Approval review by stage-gate committee for route scouting sanction",
    "Prepare chemical reagents, raw materials and analytical instruments — Formal Gate 1 Concept Approval review by stage-gate committee for route scouting sanction",
    "Execute chemical process run per standard operating procedure — Formal Gate 1 Concept Approval review by stage-gate committee for route scouting sanction",
    "Perform in-process testing (IPT) and mass balance verification — Formal Gate 1 Concept Approval review by stage-gate committee for route scouting sanction",
    "Review analytical data, resolve deviations and issue technical summary report — Formal Gate 1 Concept Approval review by stage-gate committee for route scouting sanction"
],
  "3.1.1": [
    "Confirm technical scope and operating window — Execute laboratory synthesis trials for candidate route A (catalytic hydrogenation / oxidation)",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute laboratory synthesis trials for candidate route A (catalytic hydrogenation / oxidation)",
    "Execute chemical process run per standard operating procedure — Execute laboratory synthesis trials for candidate route A (catalytic hydrogenation / oxidation)",
    "Perform in-process testing (IPT) and mass balance verification — Execute laboratory synthesis trials for candidate route A (catalytic hydrogenation / oxidation)",
    "Review analytical data, resolve deviations and issue technical summary report — Execute laboratory synthesis trials for candidate route A (catalytic hydrogenation / oxidation)"
],
  "3.1.2": [
    "Confirm technical scope and operating window — Execute parallel synthesis trials for alternative route B (direct condensation / halogenation)",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute parallel synthesis trials for alternative route B (direct condensation / halogenation)",
    "Execute chemical process run per standard operating procedure — Execute parallel synthesis trials for alternative route B (direct condensation / halogenation)",
    "Perform in-process testing (IPT) and mass balance verification — Execute parallel synthesis trials for alternative route B (direct condensation / halogenation)",
    "Review analytical data, resolve deviations and issue technical summary report — Execute parallel synthesis trials for alternative route B (direct condensation / halogenation)"
],
  "3.1.3": [
    "Confirm technical scope and operating window — Compare raw material costs, conversion rates, selectivity and by-product generation across routes",
    "Prepare chemical reagents, raw materials and analytical instruments — Compare raw material costs, conversion rates, selectivity and by-product generation across routes",
    "Execute chemical process run per standard operating procedure — Compare raw material costs, conversion rates, selectivity and by-product generation across routes",
    "Perform in-process testing (IPT) and mass balance verification — Compare raw material costs, conversion rates, selectivity and by-product generation across routes",
    "Review analytical data, resolve deviations and issue technical summary report — Compare raw material costs, conversion rates, selectivity and by-product generation across routes"
],
  "3.1.4": [
    "Confirm technical scope and operating window — Evaluate reagent hazard profiles, toxicity classification and exposure control requirements",
    "Prepare chemical reagents, raw materials and analytical instruments — Evaluate reagent hazard profiles, toxicity classification and exposure control requirements",
    "Execute chemical process run per standard operating procedure — Evaluate reagent hazard profiles, toxicity classification and exposure control requirements",
    "Perform in-process testing (IPT) and mass balance verification — Evaluate reagent hazard profiles, toxicity classification and exposure control requirements",
    "Review analytical data, resolve deviations and issue technical summary report — Evaluate reagent hazard profiles, toxicity classification and exposure control requirements"
],
  "3.1.5": [
    "Confirm technical scope and operating window — Select preferred synthesis route based on yield, selectivity, scalability and process safety",
    "Prepare chemical reagents, raw materials and analytical instruments — Select preferred synthesis route based on yield, selectivity, scalability and process safety",
    "Execute chemical process run per standard operating procedure — Select preferred synthesis route based on yield, selectivity, scalability and process safety",
    "Perform in-process testing (IPT) and mass balance verification — Select preferred synthesis route based on yield, selectivity, scalability and process safety",
    "Review analytical data, resolve deviations and issue technical summary report — Select preferred synthesis route based on yield, selectivity, scalability and process safety"
],
  "3.2.1": [
    "Confirm technical scope and operating window — Screen homogeneous and heterogeneous catalysts (precious metal Pd/C, Pt/Al2O3, zeolites, Lewis acids)",
    "Prepare chemical reagents, raw materials and analytical instruments — Screen homogeneous and heterogeneous catalysts (precious metal Pd/C, Pt/Al2O3, zeolites, Lewis acids)",
    "Execute chemical process run per standard operating procedure — Screen homogeneous and heterogeneous catalysts (precious metal Pd/C, Pt/Al2O3, zeolites, Lewis acids)",
    "Perform in-process testing (IPT) and mass balance verification — Screen homogeneous and heterogeneous catalysts (precious metal Pd/C, Pt/Al2O3, zeolites, Lewis acids)",
    "Review analytical data, resolve deviations and issue technical summary report — Screen homogeneous and heterogeneous catalysts (precious metal Pd/C, Pt/Al2O3, zeolites, Lewis acids)"
],
  "3.2.2": [
    "Confirm technical scope and operating window — Determine optimal catalyst loading, turnover frequency (TOF) and reuse/regeneration cycles",
    "Prepare chemical reagents, raw materials and analytical instruments — Determine optimal catalyst loading, turnover frequency (TOF) and reuse/regeneration cycles",
    "Execute chemical process run per standard operating procedure — Determine optimal catalyst loading, turnover frequency (TOF) and reuse/regeneration cycles",
    "Perform in-process testing (IPT) and mass balance verification — Determine optimal catalyst loading, turnover frequency (TOF) and reuse/regeneration cycles",
    "Review analytical data, resolve deviations and issue technical summary report — Determine optimal catalyst loading, turnover frequency (TOF) and reuse/regeneration cycles"
],
  "3.2.3": [
    "Confirm technical scope and operating window — Investigate reaction parameter boundaries (temperature window, operating pressure, addition rates)",
    "Prepare chemical reagents, raw materials and analytical instruments — Investigate reaction parameter boundaries (temperature window, operating pressure, addition rates)",
    "Execute chemical process run per standard operating procedure — Investigate reaction parameter boundaries (temperature window, operating pressure, addition rates)",
    "Perform in-process testing (IPT) and mass balance verification — Investigate reaction parameter boundaries (temperature window, operating pressure, addition rates)",
    "Review analytical data, resolve deviations and issue technical summary report — Investigate reaction parameter boundaries (temperature window, operating pressure, addition rates)"
],
  "3.2.4": [
    "Confirm technical scope and operating window — Optimize agitation speed, mixing dynamics and gas-liquid mass transfer in autoclave reactors",
    "Prepare chemical reagents, raw materials and analytical instruments — Optimize agitation speed, mixing dynamics and gas-liquid mass transfer in autoclave reactors",
    "Execute chemical process run per standard operating procedure — Optimize agitation speed, mixing dynamics and gas-liquid mass transfer in autoclave reactors",
    "Perform in-process testing (IPT) and mass balance verification — Optimize agitation speed, mixing dynamics and gas-liquid mass transfer in autoclave reactors",
    "Review analytical data, resolve deviations and issue technical summary report — Optimize agitation speed, mixing dynamics and gas-liquid mass transfer in autoclave reactors"
],
  "3.3.1": [
    "Confirm technical scope and operating window — Produce laboratory proof-of-chemistry batches meeting target chemical purity (>98.5%)",
    "Prepare chemical reagents, raw materials and analytical instruments — Produce laboratory proof-of-chemistry batches meeting target chemical purity (>98.5%)",
    "Execute chemical process run per standard operating procedure — Produce laboratory proof-of-chemistry batches meeting target chemical purity (>98.5%)",
    "Perform in-process testing (IPT) and mass balance verification — Produce laboratory proof-of-chemistry batches meeting target chemical purity (>98.5%)",
    "Review analytical data, resolve deviations and issue technical summary report — Produce laboratory proof-of-chemistry batches meeting target chemical purity (>98.5%)"
],
  "3.3.2": [
    "Confirm technical scope and operating window — Develop discriminatory chromatographic analytical methods (HPLC / GC-FID / Headspace GC)",
    "Prepare chemical reagents, raw materials and analytical instruments — Develop discriminatory chromatographic analytical methods (HPLC / GC-FID / Headspace GC)",
    "Execute chemical process run per standard operating procedure — Develop discriminatory chromatographic analytical methods (HPLC / GC-FID / Headspace GC)",
    "Perform in-process testing (IPT) and mass balance verification — Develop discriminatory chromatographic analytical methods (HPLC / GC-FID / Headspace GC)",
    "Review analytical data, resolve deviations and issue technical summary report — Develop discriminatory chromatographic analytical methods (HPLC / GC-FID / Headspace GC)"
],
  "3.3.3": [
    "Confirm technical scope and operating window — Identify and structurally elucidate reaction intermediates and critical process impurities",
    "Prepare chemical reagents, raw materials and analytical instruments — Identify and structurally elucidate reaction intermediates and critical process impurities",
    "Execute chemical process run per standard operating procedure — Identify and structurally elucidate reaction intermediates and critical process impurities",
    "Perform in-process testing (IPT) and mass balance verification — Identify and structurally elucidate reaction intermediates and critical process impurities",
    "Review analytical data, resolve deviations and issue technical summary report — Identify and structurally elucidate reaction intermediates and critical process impurities"
],
  "3.3.4": [
    "Confirm technical scope and operating window — Compile Route Scouting Summary Report with preliminary reaction kinetics and mass balance",
    "Prepare chemical reagents, raw materials and analytical instruments — Compile Route Scouting Summary Report with preliminary reaction kinetics and mass balance",
    "Execute chemical process run per standard operating procedure — Compile Route Scouting Summary Report with preliminary reaction kinetics and mass balance",
    "Perform in-process testing (IPT) and mass balance verification — Compile Route Scouting Summary Report with preliminary reaction kinetics and mass balance",
    "Review analytical data, resolve deviations and issue technical summary report — Compile Route Scouting Summary Report with preliminary reaction kinetics and mass balance"
],
  "4.1.1": [
    "Confirm technical scope and operating window — Design and execute Factorial / Response Surface DoE for critical process parameters",
    "Prepare chemical reagents, raw materials and analytical instruments — Design and execute Factorial / Response Surface DoE for critical process parameters",
    "Execute chemical process run per standard operating procedure — Design and execute Factorial / Response Surface DoE for critical process parameters",
    "Perform in-process testing (IPT) and mass balance verification — Design and execute Factorial / Response Surface DoE for critical process parameters",
    "Review analytical data, resolve deviations and issue technical summary report — Design and execute Factorial / Response Surface DoE for critical process parameters"
],
  "4.1.2": [
    "Confirm technical scope and operating window — Determine Proven Acceptable Ranges (PAR) for reaction temperature, catalyst concentration and feed rates",
    "Prepare chemical reagents, raw materials and analytical instruments — Determine Proven Acceptable Ranges (PAR) for reaction temperature, catalyst concentration and feed rates",
    "Execute chemical process run per standard operating procedure — Determine Proven Acceptable Ranges (PAR) for reaction temperature, catalyst concentration and feed rates",
    "Perform in-process testing (IPT) and mass balance verification — Determine Proven Acceptable Ranges (PAR) for reaction temperature, catalyst concentration and feed rates",
    "Review analytical data, resolve deviations and issue technical summary report — Determine Proven Acceptable Ranges (PAR) for reaction temperature, catalyst concentration and feed rates"
],
  "4.1.3": [
    "Confirm technical scope and operating window — Investigate reaction kinetics, activation energy and intermediate accumulation behavior",
    "Prepare chemical reagents, raw materials and analytical instruments — Investigate reaction kinetics, activation energy and intermediate accumulation behavior",
    "Execute chemical process run per standard operating procedure — Investigate reaction kinetics, activation energy and intermediate accumulation behavior",
    "Perform in-process testing (IPT) and mass balance verification — Investigate reaction kinetics, activation energy and intermediate accumulation behavior",
    "Review analytical data, resolve deviations and issue technical summary report — Investigate reaction kinetics, activation energy and intermediate accumulation behavior"
],
  "4.1.4": [
    "Confirm technical scope and operating window — Optimize reaction conversion to minimize residual unreacted starting materials and side reactions",
    "Prepare chemical reagents, raw materials and analytical instruments — Optimize reaction conversion to minimize residual unreacted starting materials and side reactions",
    "Execute chemical process run per standard operating procedure — Optimize reaction conversion to minimize residual unreacted starting materials and side reactions",
    "Perform in-process testing (IPT) and mass balance verification — Optimize reaction conversion to minimize residual unreacted starting materials and side reactions",
    "Review analytical data, resolve deviations and issue technical summary report — Optimize reaction conversion to minimize residual unreacted starting materials and side reactions"
],
  "4.1.5": [
    "Confirm technical scope and operating window — Establish process control strategy and in-process testing (IPT) specifications",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish process control strategy and in-process testing (IPT) specifications",
    "Execute chemical process run per standard operating procedure — Establish process control strategy and in-process testing (IPT) specifications",
    "Perform in-process testing (IPT) and mass balance verification — Establish process control strategy and in-process testing (IPT) specifications",
    "Review analytical data, resolve deviations and issue technical summary report — Establish process control strategy and in-process testing (IPT) specifications"
],
  "4.2.1": [
    "Confirm technical scope and operating window — Optimize quenching, phase separation, liquid-liquid extraction and aqueous wash protocols",
    "Prepare chemical reagents, raw materials and analytical instruments — Optimize quenching, phase separation, liquid-liquid extraction and aqueous wash protocols",
    "Execute chemical process run per standard operating procedure — Optimize quenching, phase separation, liquid-liquid extraction and aqueous wash protocols",
    "Perform in-process testing (IPT) and mass balance verification — Optimize quenching, phase separation, liquid-liquid extraction and aqueous wash protocols",
    "Review analytical data, resolve deviations and issue technical summary report — Optimize quenching, phase separation, liquid-liquid extraction and aqueous wash protocols"
],
  "4.2.2": [
    "Confirm technical scope and operating window — Screen anti-solvents, cooling crystallization curves and seed loading for controlled crystal growth",
    "Prepare chemical reagents, raw materials and analytical instruments — Screen anti-solvents, cooling crystallization curves and seed loading for controlled crystal growth",
    "Execute chemical process run per standard operating procedure — Screen anti-solvents, cooling crystallization curves and seed loading for controlled crystal growth",
    "Perform in-process testing (IPT) and mass balance verification — Screen anti-solvents, cooling crystallization curves and seed loading for controlled crystal growth",
    "Review analytical data, resolve deviations and issue technical summary report — Screen anti-solvents, cooling crystallization curves and seed loading for controlled crystal growth"
],
  "4.2.3": [
    "Confirm technical scope and operating window — Evaluate cake washing efficiency, filtration resistance and centrifugal separation parameters",
    "Prepare chemical reagents, raw materials and analytical instruments — Evaluate cake washing efficiency, filtration resistance and centrifugal separation parameters",
    "Execute chemical process run per standard operating procedure — Evaluate cake washing efficiency, filtration resistance and centrifugal separation parameters",
    "Perform in-process testing (IPT) and mass balance verification — Evaluate cake washing efficiency, filtration resistance and centrifugal separation parameters",
    "Review analytical data, resolve deviations and issue technical summary report — Evaluate cake washing efficiency, filtration resistance and centrifugal separation parameters"
],
  "4.2.4": [
    "Confirm technical scope and operating window — Optimize cake drying parameters (vacuum tray / conical dryer) to eliminate solvent inclusions",
    "Prepare chemical reagents, raw materials and analytical instruments — Optimize cake drying parameters (vacuum tray / conical dryer) to eliminate solvent inclusions",
    "Execute chemical process run per standard operating procedure — Optimize cake drying parameters (vacuum tray / conical dryer) to eliminate solvent inclusions",
    "Perform in-process testing (IPT) and mass balance verification — Optimize cake drying parameters (vacuum tray / conical dryer) to eliminate solvent inclusions",
    "Review analytical data, resolve deviations and issue technical summary report — Optimize cake drying parameters (vacuum tray / conical dryer) to eliminate solvent inclusions"
],
  "4.2.5": [
    "Confirm technical scope and operating window — Develop solvent distillation recovery process targeting >85% solvent recycle efficiency",
    "Prepare chemical reagents, raw materials and analytical instruments — Develop solvent distillation recovery process targeting >85% solvent recycle efficiency",
    "Execute chemical process run per standard operating procedure — Develop solvent distillation recovery process targeting >85% solvent recycle efficiency",
    "Perform in-process testing (IPT) and mass balance verification — Develop solvent distillation recovery process targeting >85% solvent recycle efficiency",
    "Review analytical data, resolve deviations and issue technical summary report — Develop solvent distillation recovery process targeting >85% solvent recycle efficiency"
],
  "4.3.1": [
    "Confirm technical scope and operating window — Profile organic impurities, residual solvents and elemental catalyst traces across optimized lots",
    "Prepare chemical reagents, raw materials and analytical instruments — Profile organic impurities, residual solvents and elemental catalyst traces across optimized lots",
    "Execute chemical process run per standard operating procedure — Profile organic impurities, residual solvents and elemental catalyst traces across optimized lots",
    "Perform in-process testing (IPT) and mass balance verification — Profile organic impurities, residual solvents and elemental catalyst traces across optimized lots",
    "Review analytical data, resolve deviations and issue technical summary report — Profile organic impurities, residual solvents and elemental catalyst traces across optimized lots"
],
  "4.3.2": [
    "Confirm technical scope and operating window — Validate analytical test methods for assay, related substances and moisture per ASTM/ISO guidelines",
    "Prepare chemical reagents, raw materials and analytical instruments — Validate analytical test methods for assay, related substances and moisture per ASTM/ISO guidelines",
    "Execute chemical process run per standard operating procedure — Validate analytical test methods for assay, related substances and moisture per ASTM/ISO guidelines",
    "Perform in-process testing (IPT) and mass balance verification — Validate analytical test methods for assay, related substances and moisture per ASTM/ISO guidelines",
    "Review analytical data, resolve deviations and issue technical summary report — Validate analytical test methods for assay, related substances and moisture per ASTM/ISO guidelines"
],
  "4.3.3": [
    "Confirm technical scope and operating window — Establish comprehensive stage mass balance and energy balance at 5-liter bench scale",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish comprehensive stage mass balance and energy balance at 5-liter bench scale",
    "Execute chemical process run per standard operating procedure — Establish comprehensive stage mass balance and energy balance at 5-liter bench scale",
    "Perform in-process testing (IPT) and mass balance verification — Establish comprehensive stage mass balance and energy balance at 5-liter bench scale",
    "Review analytical data, resolve deviations and issue technical summary report — Establish comprehensive stage mass balance and energy balance at 5-liter bench scale"
],
  "4.3.4": [
    "Confirm technical scope and operating window — Author Lab-Scale Process Optimization Report and provisional commercial specifications",
    "Prepare chemical reagents, raw materials and analytical instruments — Author Lab-Scale Process Optimization Report and provisional commercial specifications",
    "Execute chemical process run per standard operating procedure — Author Lab-Scale Process Optimization Report and provisional commercial specifications",
    "Perform in-process testing (IPT) and mass balance verification — Author Lab-Scale Process Optimization Report and provisional commercial specifications",
    "Review analytical data, resolve deviations and issue technical summary report — Author Lab-Scale Process Optimization Report and provisional commercial specifications"
],
  "5.1.1": [
    "Confirm technical scope and operating window — Formally lock commercial synthetic pathway, catalyst system and solvent matrix",
    "Prepare chemical reagents, raw materials and analytical instruments — Formally lock commercial synthetic pathway, catalyst system and solvent matrix",
    "Execute chemical process run per standard operating procedure — Formally lock commercial synthetic pathway, catalyst system and solvent matrix",
    "Perform in-process testing (IPT) and mass balance verification — Formally lock commercial synthetic pathway, catalyst system and solvent matrix",
    "Review analytical data, resolve deviations and issue technical summary report — Formally lock commercial synthetic pathway, catalyst system and solvent matrix"
],
  "5.1.2": [
    "Confirm technical scope and operating window — Develop detailed Process Flow Diagrams (PFD) with stream compositions, flow rates and enthalpies",
    "Prepare chemical reagents, raw materials and analytical instruments — Develop detailed Process Flow Diagrams (PFD) with stream compositions, flow rates and enthalpies",
    "Execute chemical process run per standard operating procedure — Develop detailed Process Flow Diagrams (PFD) with stream compositions, flow rates and enthalpies",
    "Perform in-process testing (IPT) and mass balance verification — Develop detailed Process Flow Diagrams (PFD) with stream compositions, flow rates and enthalpies",
    "Review analytical data, resolve deviations and issue technical summary report — Develop detailed Process Flow Diagrams (PFD) with stream compositions, flow rates and enthalpies"
],
  "5.1.3": [
    "Confirm technical scope and operating window — Establish operating envelopes, design pressures and design temperatures for all unit operations",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish operating envelopes, design pressures and design temperatures for all unit operations",
    "Execute chemical process run per standard operating procedure — Establish operating envelopes, design pressures and design temperatures for all unit operations",
    "Perform in-process testing (IPT) and mass balance verification — Establish operating envelopes, design pressures and design temperatures for all unit operations",
    "Review analytical data, resolve deviations and issue technical summary report — Establish operating envelopes, design pressures and design temperatures for all unit operations"
],
  "5.1.4": [
    "Confirm technical scope and operating window — Define process waste streams, gaseous emissions and wastewater effluent characteristics",
    "Prepare chemical reagents, raw materials and analytical instruments — Define process waste streams, gaseous emissions and wastewater effluent characteristics",
    "Execute chemical process run per standard operating procedure — Define process waste streams, gaseous emissions and wastewater effluent characteristics",
    "Perform in-process testing (IPT) and mass balance verification — Define process waste streams, gaseous emissions and wastewater effluent characteristics",
    "Review analytical data, resolve deviations and issue technical summary report — Define process waste streams, gaseous emissions and wastewater effluent characteristics"
],
  "5.2.1": [
    "Confirm technical scope and operating window — Finalize engineering Basis of Design (BOD) document for pilot plant and production facility",
    "Prepare chemical reagents, raw materials and analytical instruments — Finalize engineering Basis of Design (BOD) document for pilot plant and production facility",
    "Execute chemical process run per standard operating procedure — Finalize engineering Basis of Design (BOD) document for pilot plant and production facility",
    "Perform in-process testing (IPT) and mass balance verification — Finalize engineering Basis of Design (BOD) document for pilot plant and production facility",
    "Review analytical data, resolve deviations and issue technical summary report — Finalize engineering Basis of Design (BOD) document for pilot plant and production facility"
],
  "5.2.2": [
    "Confirm technical scope and operating window — Complete rigorous ASPEN / ChemCAD steady-state simulation for mass and energy balances",
    "Prepare chemical reagents, raw materials and analytical instruments — Complete rigorous ASPEN / ChemCAD steady-state simulation for mass and energy balances",
    "Execute chemical process run per standard operating procedure — Complete rigorous ASPEN / ChemCAD steady-state simulation for mass and energy balances",
    "Perform in-process testing (IPT) and mass balance verification — Complete rigorous ASPEN / ChemCAD steady-state simulation for mass and energy balances",
    "Review analytical data, resolve deviations and issue technical summary report — Complete rigorous ASPEN / ChemCAD steady-state simulation for mass and energy balances"
],
  "5.2.3": [
    "Confirm technical scope and operating window — Specify materials of construction (SS316L, Hastelloy C-276, Glass-lined) based on corrosion testing",
    "Prepare chemical reagents, raw materials and analytical instruments — Specify materials of construction (SS316L, Hastelloy C-276, Glass-lined) based on corrosion testing",
    "Execute chemical process run per standard operating procedure — Specify materials of construction (SS316L, Hastelloy C-276, Glass-lined) based on corrosion testing",
    "Perform in-process testing (IPT) and mass balance verification — Specify materials of construction (SS316L, Hastelloy C-276, Glass-lined) based on corrosion testing",
    "Review analytical data, resolve deviations and issue technical summary report — Specify materials of construction (SS316L, Hastelloy C-276, Glass-lined) based on corrosion testing"
],
  "5.2.4": [
    "Confirm technical scope and operating window — Size major process equipment (reactors, condensers, crystallizers, filters, scrubbers)",
    "Prepare chemical reagents, raw materials and analytical instruments — Size major process equipment (reactors, condensers, crystallizers, filters, scrubbers)",
    "Execute chemical process run per standard operating procedure — Size major process equipment (reactors, condensers, crystallizers, filters, scrubbers)",
    "Perform in-process testing (IPT) and mass balance verification — Size major process equipment (reactors, condensers, crystallizers, filters, scrubbers)",
    "Review analytical data, resolve deviations and issue technical summary report — Size major process equipment (reactors, condensers, crystallizers, filters, scrubbers)"
],
  "5.3.1": [
    "Confirm technical scope and operating window — Qualify dual commercial suppliers for all critical starting materials, reagents and solvents",
    "Prepare chemical reagents, raw materials and analytical instruments — Qualify dual commercial suppliers for all critical starting materials, reagents and solvents",
    "Execute chemical process run per standard operating procedure — Qualify dual commercial suppliers for all critical starting materials, reagents and solvents",
    "Perform in-process testing (IPT) and mass balance verification — Qualify dual commercial suppliers for all critical starting materials, reagents and solvents",
    "Review analytical data, resolve deviations and issue technical summary report — Qualify dual commercial suppliers for all critical starting materials, reagents and solvents"
],
  "5.3.2": [
    "Confirm technical scope and operating window — Update Commercial Cost of Manufacturing (COM) model based on locked engineering parameters",
    "Prepare chemical reagents, raw materials and analytical instruments — Update Commercial Cost of Manufacturing (COM) model based on locked engineering parameters",
    "Execute chemical process run per standard operating procedure — Update Commercial Cost of Manufacturing (COM) model based on locked engineering parameters",
    "Perform in-process testing (IPT) and mass balance verification — Update Commercial Cost of Manufacturing (COM) model based on locked engineering parameters",
    "Review analytical data, resolve deviations and issue technical summary report — Update Commercial Cost of Manufacturing (COM) model based on locked engineering parameters"
],
  "5.3.3": [
    "Confirm technical scope and operating window — Gate 2 Decision Review: Process Route Selection & Basis of Design sign-off for pilot development",
    "Prepare chemical reagents, raw materials and analytical instruments — Gate 2 Decision Review: Process Route Selection & Basis of Design sign-off for pilot development",
    "Execute chemical process run per standard operating procedure — Gate 2 Decision Review: Process Route Selection & Basis of Design sign-off for pilot development",
    "Perform in-process testing (IPT) and mass balance verification — Gate 2 Decision Review: Process Route Selection & Basis of Design sign-off for pilot development",
    "Review analytical data, resolve deviations and issue technical summary report — Gate 2 Decision Review: Process Route Selection & Basis of Design sign-off for pilot development"
],
  "6.1.1": [
    "Confirm technical scope and operating window — Calculate scale-up dimensionless numbers (Reynolds, Froude, Power number) and impeller tip speeds",
    "Prepare chemical reagents, raw materials and analytical instruments — Calculate scale-up dimensionless numbers (Reynolds, Froude, Power number) and impeller tip speeds",
    "Execute chemical process run per standard operating procedure — Calculate scale-up dimensionless numbers (Reynolds, Froude, Power number) and impeller tip speeds",
    "Perform in-process testing (IPT) and mass balance verification — Calculate scale-up dimensionless numbers (Reynolds, Froude, Power number) and impeller tip speeds",
    "Review analytical data, resolve deviations and issue technical summary report — Calculate scale-up dimensionless numbers (Reynolds, Froude, Power number) and impeller tip speeds"
],
  "6.1.2": [
    "Confirm technical scope and operating window — Model jacket heat transfer coefficients (U-values) for pilot scale vs laboratory glass reactors",
    "Prepare chemical reagents, raw materials and analytical instruments — Model jacket heat transfer coefficients (U-values) for pilot scale vs laboratory glass reactors",
    "Execute chemical process run per standard operating procedure — Model jacket heat transfer coefficients (U-values) for pilot scale vs laboratory glass reactors",
    "Perform in-process testing (IPT) and mass balance verification — Model jacket heat transfer coefficients (U-values) for pilot scale vs laboratory glass reactors",
    "Review analytical data, resolve deviations and issue technical summary report — Model jacket heat transfer coefficients (U-values) for pilot scale vs laboratory glass reactors"
],
  "6.1.3": [
    "Confirm technical scope and operating window — Conduct gas-liquid mass transfer studies (kLa measurement) for hydrogenator and oxidation reactors",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct gas-liquid mass transfer studies (kLa measurement) for hydrogenator and oxidation reactors",
    "Execute chemical process run per standard operating procedure — Conduct gas-liquid mass transfer studies (kLa measurement) for hydrogenator and oxidation reactors",
    "Perform in-process testing (IPT) and mass balance verification — Conduct gas-liquid mass transfer studies (kLa measurement) for hydrogenator and oxidation reactors",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct gas-liquid mass transfer studies (kLa measurement) for hydrogenator and oxidation reactors"
],
  "6.1.4": [
    "Confirm technical scope and operating window — Establish dosing / addition rate profiles to prevent localized hotspots and runaway exotherms",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish dosing / addition rate profiles to prevent localized hotspots and runaway exotherms",
    "Execute chemical process run per standard operating procedure — Establish dosing / addition rate profiles to prevent localized hotspots and runaway exotherms",
    "Perform in-process testing (IPT) and mass balance verification — Establish dosing / addition rate profiles to prevent localized hotspots and runaway exotherms",
    "Review analytical data, resolve deviations and issue technical summary report — Establish dosing / addition rate profiles to prevent localized hotspots and runaway exotherms"
],
  "6.1.5": [
    "Confirm technical scope and operating window — Optimize pilot batch cycle times and determine maximum holding times for intermediates",
    "Prepare chemical reagents, raw materials and analytical instruments — Optimize pilot batch cycle times and determine maximum holding times for intermediates",
    "Execute chemical process run per standard operating procedure — Optimize pilot batch cycle times and determine maximum holding times for intermediates",
    "Perform in-process testing (IPT) and mass balance verification — Optimize pilot batch cycle times and determine maximum holding times for intermediates",
    "Review analytical data, resolve deviations and issue technical summary report — Optimize pilot batch cycle times and determine maximum holding times for intermediates"
],
  "6.2.1": [
    "Confirm technical scope and operating window — Scale up fractional distillation column packing, reflux ratios and vacuum control systems",
    "Prepare chemical reagents, raw materials and analytical instruments — Scale up fractional distillation column packing, reflux ratios and vacuum control systems",
    "Execute chemical process run per standard operating procedure — Scale up fractional distillation column packing, reflux ratios and vacuum control systems",
    "Perform in-process testing (IPT) and mass balance verification — Scale up fractional distillation column packing, reflux ratios and vacuum control systems",
    "Review analytical data, resolve deviations and issue technical summary report — Scale up fractional distillation column packing, reflux ratios and vacuum control systems"
],
  "6.2.2": [
    "Confirm technical scope and operating window — Perform pilot-scale Nutsche filter-dryer / centrifuge filtration and wash displacement trials",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform pilot-scale Nutsche filter-dryer / centrifuge filtration and wash displacement trials",
    "Execute chemical process run per standard operating procedure — Perform pilot-scale Nutsche filter-dryer / centrifuge filtration and wash displacement trials",
    "Perform in-process testing (IPT) and mass balance verification — Perform pilot-scale Nutsche filter-dryer / centrifuge filtration and wash displacement trials",
    "Review analytical data, resolve deviations and issue technical summary report — Perform pilot-scale Nutsche filter-dryer / centrifuge filtration and wash displacement trials"
],
  "6.2.3": [
    "Confirm technical scope and operating window — Scale up fluid-bed / vacuum paddle drying operations and establish particle size distribution controls",
    "Prepare chemical reagents, raw materials and analytical instruments — Scale up fluid-bed / vacuum paddle drying operations and establish particle size distribution controls",
    "Execute chemical process run per standard operating procedure — Scale up fluid-bed / vacuum paddle drying operations and establish particle size distribution controls",
    "Perform in-process testing (IPT) and mass balance verification — Scale up fluid-bed / vacuum paddle drying operations and establish particle size distribution controls",
    "Review analytical data, resolve deviations and issue technical summary report — Scale up fluid-bed / vacuum paddle drying operations and establish particle size distribution controls"
],
  "6.2.4": [
    "Confirm technical scope and operating window — Evaluate mother liquor recycling and secondary product recovery in pilot campaign",
    "Prepare chemical reagents, raw materials and analytical instruments — Evaluate mother liquor recycling and secondary product recovery in pilot campaign",
    "Execute chemical process run per standard operating procedure — Evaluate mother liquor recycling and secondary product recovery in pilot campaign",
    "Perform in-process testing (IPT) and mass balance verification — Evaluate mother liquor recycling and secondary product recovery in pilot campaign",
    "Review analytical data, resolve deviations and issue technical summary report — Evaluate mother liquor recycling and secondary product recovery in pilot campaign"
],
  "6.3.1": [
    "Confirm technical scope and operating window — Map unit operations against pilot plant reactor trains and utility capacities",
    "Prepare chemical reagents, raw materials and analytical instruments — Map unit operations against pilot plant reactor trains and utility capacities",
    "Execute chemical process run per standard operating procedure — Map unit operations against pilot plant reactor trains and utility capacities",
    "Perform in-process testing (IPT) and mass balance verification — Map unit operations against pilot plant reactor trains and utility capacities",
    "Review analytical data, resolve deviations and issue technical summary report — Map unit operations against pilot plant reactor trains and utility capacities"
],
  "6.3.2": [
    "Confirm technical scope and operating window — Author comprehensive Pilot Plant Tech Transfer Dossier (TTD) and Master Batch Records (MBR)",
    "Prepare chemical reagents, raw materials and analytical instruments — Author comprehensive Pilot Plant Tech Transfer Dossier (TTD) and Master Batch Records (MBR)",
    "Execute chemical process run per standard operating procedure — Author comprehensive Pilot Plant Tech Transfer Dossier (TTD) and Master Batch Records (MBR)",
    "Perform in-process testing (IPT) and mass balance verification — Author comprehensive Pilot Plant Tech Transfer Dossier (TTD) and Master Batch Records (MBR)",
    "Review analytical data, resolve deviations and issue technical summary report — Author comprehensive Pilot Plant Tech Transfer Dossier (TTD) and Master Batch Records (MBR)"
],
  "6.3.3": [
    "Confirm technical scope and operating window — Conduct operator training on batch sequence, hazardous reagent handling and critical control points",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct operator training on batch sequence, hazardous reagent handling and critical control points",
    "Execute chemical process run per standard operating procedure — Conduct operator training on batch sequence, hazardous reagent handling and critical control points",
    "Perform in-process testing (IPT) and mass balance verification — Conduct operator training on batch sequence, hazardous reagent handling and critical control points",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct operator training on batch sequence, hazardous reagent handling and critical control points"
],
  "6.3.4": [
    "Confirm technical scope and operating window — Complete pilot equipment line clearance, cleaning verification and instrument calibration",
    "Prepare chemical reagents, raw materials and analytical instruments — Complete pilot equipment line clearance, cleaning verification and instrument calibration",
    "Execute chemical process run per standard operating procedure — Complete pilot equipment line clearance, cleaning verification and instrument calibration",
    "Perform in-process testing (IPT) and mass balance verification — Complete pilot equipment line clearance, cleaning verification and instrument calibration",
    "Review analytical data, resolve deviations and issue technical summary report — Complete pilot equipment line clearance, cleaning verification and instrument calibration"
],
  "7.1.1": [
    "Confirm technical scope and operating window — Execute Reaction Calorimetry (RC1) to determine heat of reaction and adiabatic temperature rise",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute Reaction Calorimetry (RC1) to determine heat of reaction and adiabatic temperature rise",
    "Execute chemical process run per standard operating procedure — Execute Reaction Calorimetry (RC1) to determine heat of reaction and adiabatic temperature rise",
    "Perform in-process testing (IPT) and mass balance verification — Execute Reaction Calorimetry (RC1) to determine heat of reaction and adiabatic temperature rise",
    "Review analytical data, resolve deviations and issue technical summary report — Execute Reaction Calorimetry (RC1) to determine heat of reaction and adiabatic temperature rise"
],
  "7.1.2": [
    "Confirm technical scope and operating window — Perform Differential Scanning Calorimetry (DSC) and Thermal Screening Unit (TSu) on raw materials",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform Differential Scanning Calorimetry (DSC) and Thermal Screening Unit (TSu) on raw materials",
    "Execute chemical process run per standard operating procedure — Perform Differential Scanning Calorimetry (DSC) and Thermal Screening Unit (TSu) on raw materials",
    "Perform in-process testing (IPT) and mass balance verification — Perform Differential Scanning Calorimetry (DSC) and Thermal Screening Unit (TSu) on raw materials",
    "Review analytical data, resolve deviations and issue technical summary report — Perform Differential Scanning Calorimetry (DSC) and Thermal Screening Unit (TSu) on raw materials"
],
  "7.1.3": [
    "Confirm technical scope and operating window — Conduct Accelerating Rate Calorimetry (ARC) to determine maximum temperature for synthesis (MTSR)",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct Accelerating Rate Calorimetry (ARC) to determine maximum temperature for synthesis (MTSR)",
    "Execute chemical process run per standard operating procedure — Conduct Accelerating Rate Calorimetry (ARC) to determine maximum temperature for synthesis (MTSR)",
    "Perform in-process testing (IPT) and mass balance verification — Conduct Accelerating Rate Calorimetry (ARC) to determine maximum temperature for synthesis (MTSR)",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct Accelerating Rate Calorimetry (ARC) to determine maximum temperature for synthesis (MTSR)"
],
  "7.1.4": [
    "Confirm technical scope and operating window — Establish Stoessel criticality classification (Class 1 to 5) and time-to-maximum rate (TMRad)",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish Stoessel criticality classification (Class 1 to 5) and time-to-maximum rate (TMRad)",
    "Execute chemical process run per standard operating procedure — Establish Stoessel criticality classification (Class 1 to 5) and time-to-maximum rate (TMRad)",
    "Perform in-process testing (IPT) and mass balance verification — Establish Stoessel criticality classification (Class 1 to 5) and time-to-maximum rate (TMRad)",
    "Review analytical data, resolve deviations and issue technical summary report — Establish Stoessel criticality classification (Class 1 to 5) and time-to-maximum rate (TMRad)"
],
  "7.1.5": [
    "Confirm technical scope and operating window — Size emergency pressure relief systems (rupture discs, safety valves) per DIERS methodology",
    "Prepare chemical reagents, raw materials and analytical instruments — Size emergency pressure relief systems (rupture discs, safety valves) per DIERS methodology",
    "Execute chemical process run per standard operating procedure — Size emergency pressure relief systems (rupture discs, safety valves) per DIERS methodology",
    "Perform in-process testing (IPT) and mass balance verification — Size emergency pressure relief systems (rupture discs, safety valves) per DIERS methodology",
    "Review analytical data, resolve deviations and issue technical summary report — Size emergency pressure relief systems (rupture discs, safety valves) per DIERS methodology"
],
  "7.2.1": [
    "Confirm technical scope and operating window — Conduct formal node-by-node HAZOP study with cross-functional safety and engineering team",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct formal node-by-node HAZOP study with cross-functional safety and engineering team",
    "Execute chemical process run per standard operating procedure — Conduct formal node-by-node HAZOP study with cross-functional safety and engineering team",
    "Perform in-process testing (IPT) and mass balance verification — Conduct formal node-by-node HAZOP study with cross-functional safety and engineering team",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct formal node-by-node HAZOP study with cross-functional safety and engineering team"
],
  "7.2.2": [
    "Confirm technical scope and operating window — Perform Layer of Protection Analysis (LOPA) and determine Safety Integrity Levels (SIL 1/2)",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform Layer of Protection Analysis (LOPA) and determine Safety Integrity Levels (SIL 1/2)",
    "Execute chemical process run per standard operating procedure — Perform Layer of Protection Analysis (LOPA) and determine Safety Integrity Levels (SIL 1/2)",
    "Perform in-process testing (IPT) and mass balance verification — Perform Layer of Protection Analysis (LOPA) and determine Safety Integrity Levels (SIL 1/2)",
    "Review analytical data, resolve deviations and issue technical summary report — Perform Layer of Protection Analysis (LOPA) and determine Safety Integrity Levels (SIL 1/2)"
],
  "7.2.3": [
    "Confirm technical scope and operating window — Specify Safety Instrumented Systems (SIS), interlocks and automated emergency dump / quench valves",
    "Prepare chemical reagents, raw materials and analytical instruments — Specify Safety Instrumented Systems (SIS), interlocks and automated emergency dump / quench valves",
    "Execute chemical process run per standard operating procedure — Specify Safety Instrumented Systems (SIS), interlocks and automated emergency dump / quench valves",
    "Perform in-process testing (IPT) and mass balance verification — Specify Safety Instrumented Systems (SIS), interlocks and automated emergency dump / quench valves",
    "Review analytical data, resolve deviations and issue technical summary report — Specify Safety Instrumented Systems (SIS), interlocks and automated emergency dump / quench valves"
],
  "7.2.4": [
    "Confirm technical scope and operating window — Complete combustible dust hazard screening (Kst, Pmax, MIE) and electrostatic hazard assessment",
    "Prepare chemical reagents, raw materials and analytical instruments — Complete combustible dust hazard screening (Kst, Pmax, MIE) and electrostatic hazard assessment",
    "Execute chemical process run per standard operating procedure — Complete combustible dust hazard screening (Kst, Pmax, MIE) and electrostatic hazard assessment",
    "Perform in-process testing (IPT) and mass balance verification — Complete combustible dust hazard screening (Kst, Pmax, MIE) and electrostatic hazard assessment",
    "Review analytical data, resolve deviations and issue technical summary report — Complete combustible dust hazard screening (Kst, Pmax, MIE) and electrostatic hazard assessment"
],
  "7.2.5": [
    "Confirm technical scope and operating window — Implement all high-priority HAZOP recommendations and verify safety interlock logic",
    "Prepare chemical reagents, raw materials and analytical instruments — Implement all high-priority HAZOP recommendations and verify safety interlock logic",
    "Execute chemical process run per standard operating procedure — Implement all high-priority HAZOP recommendations and verify safety interlock logic",
    "Perform in-process testing (IPT) and mass balance verification — Implement all high-priority HAZOP recommendations and verify safety interlock logic",
    "Review analytical data, resolve deviations and issue technical summary report — Implement all high-priority HAZOP recommendations and verify safety interlock logic"
],
  "7.3.1": [
    "Confirm technical scope and operating window — Characterize process effluents (COD, BOD, TDS, heavy metals, volatile organic carbon)",
    "Prepare chemical reagents, raw materials and analytical instruments — Characterize process effluents (COD, BOD, TDS, heavy metals, volatile organic carbon)",
    "Execute chemical process run per standard operating procedure — Characterize process effluents (COD, BOD, TDS, heavy metals, volatile organic carbon)",
    "Perform in-process testing (IPT) and mass balance verification — Characterize process effluents (COD, BOD, TDS, heavy metals, volatile organic carbon)",
    "Review analytical data, resolve deviations and issue technical summary report — Characterize process effluents (COD, BOD, TDS, heavy metals, volatile organic carbon)"
],
  "7.3.2": [
    "Confirm technical scope and operating window — Verify Effluent Treatment Plant (ETP) treatability, biodegradation kinetics and stripper requirements",
    "Prepare chemical reagents, raw materials and analytical instruments — Verify Effluent Treatment Plant (ETP) treatability, biodegradation kinetics and stripper requirements",
    "Execute chemical process run per standard operating procedure — Verify Effluent Treatment Plant (ETP) treatability, biodegradation kinetics and stripper requirements",
    "Perform in-process testing (IPT) and mass balance verification — Verify Effluent Treatment Plant (ETP) treatability, biodegradation kinetics and stripper requirements",
    "Review analytical data, resolve deviations and issue technical summary report — Verify Effluent Treatment Plant (ETP) treatability, biodegradation kinetics and stripper requirements"
],
  "7.3.3": [
    "Confirm technical scope and operating window — Complete acute aquatic toxicity, biodegradability and bioaccumulation studies for regulatory dossier",
    "Prepare chemical reagents, raw materials and analytical instruments — Complete acute aquatic toxicity, biodegradability and bioaccumulation studies for regulatory dossier",
    "Execute chemical process run per standard operating procedure — Complete acute aquatic toxicity, biodegradability and bioaccumulation studies for regulatory dossier",
    "Perform in-process testing (IPT) and mass balance verification — Complete acute aquatic toxicity, biodegradability and bioaccumulation studies for regulatory dossier",
    "Review analytical data, resolve deviations and issue technical summary report — Complete acute aquatic toxicity, biodegradability and bioaccumulation studies for regulatory dossier"
],
  "7.3.4": [
    "Confirm technical scope and operating window — Gate 3 Decision Review: Process Safety & Regulatory Studies sign-off for pilot execution",
    "Prepare chemical reagents, raw materials and analytical instruments — Gate 3 Decision Review: Process Safety & Regulatory Studies sign-off for pilot execution",
    "Execute chemical process run per standard operating procedure — Gate 3 Decision Review: Process Safety & Regulatory Studies sign-off for pilot execution",
    "Perform in-process testing (IPT) and mass balance verification — Gate 3 Decision Review: Process Safety & Regulatory Studies sign-off for pilot execution",
    "Review analytical data, resolve deviations and issue technical summary report — Gate 3 Decision Review: Process Safety & Regulatory Studies sign-off for pilot execution"
],
  "8.1.1": [
    "Confirm technical scope and operating window — Compile Substance Identification Dossier (analytical spectral data, purity profile, typical impurities)",
    "Prepare chemical reagents, raw materials and analytical instruments — Compile Substance Identification Dossier (analytical spectral data, purity profile, typical impurities)",
    "Execute chemical process run per standard operating procedure — Compile Substance Identification Dossier (analytical spectral data, purity profile, typical impurities)",
    "Perform in-process testing (IPT) and mass balance verification — Compile Substance Identification Dossier (analytical spectral data, purity profile, typical impurities)",
    "Review analytical data, resolve deviations and issue technical summary report — Compile Substance Identification Dossier (analytical spectral data, purity profile, typical impurities)"
],
  "8.1.2": [
    "Confirm technical scope and operating window — Prepare Chemical Safety Report (CSR) including hazard classification and environmental exposure scenarios",
    "Prepare chemical reagents, raw materials and analytical instruments — Prepare Chemical Safety Report (CSR) including hazard classification and environmental exposure scenarios",
    "Execute chemical process run per standard operating procedure — Prepare Chemical Safety Report (CSR) including hazard classification and environmental exposure scenarios",
    "Perform in-process testing (IPT) and mass balance verification — Prepare Chemical Safety Report (CSR) including hazard classification and environmental exposure scenarios",
    "Review analytical data, resolve deviations and issue technical summary report — Prepare Chemical Safety Report (CSR) including hazard classification and environmental exposure scenarios"
],
  "8.1.3": [
    "Confirm technical scope and operating window — Generate IUCLID dossier for EU REACH (10-100 tonnes / 100-1000 tonnes tier) and UK REACH",
    "Prepare chemical reagents, raw materials and analytical instruments — Generate IUCLID dossier for EU REACH (10-100 tonnes / 100-1000 tonnes tier) and UK REACH",
    "Execute chemical process run per standard operating procedure — Generate IUCLID dossier for EU REACH (10-100 tonnes / 100-1000 tonnes tier) and UK REACH",
    "Perform in-process testing (IPT) and mass balance verification — Generate IUCLID dossier for EU REACH (10-100 tonnes / 100-1000 tonnes tier) and UK REACH",
    "Review analytical data, resolve deviations and issue technical summary report — Generate IUCLID dossier for EU REACH (10-100 tonnes / 100-1000 tonnes tier) and UK REACH"
],
  "8.1.4": [
    "Confirm technical scope and operating window — Submit Pre-Manufacture Notice (PMN) / TSCA Section 5 notification to US EPA",
    "Prepare chemical reagents, raw materials and analytical instruments — Submit Pre-Manufacture Notice (PMN) / TSCA Section 5 notification to US EPA",
    "Execute chemical process run per standard operating procedure — Submit Pre-Manufacture Notice (PMN) / TSCA Section 5 notification to US EPA",
    "Perform in-process testing (IPT) and mass balance verification — Submit Pre-Manufacture Notice (PMN) / TSCA Section 5 notification to US EPA",
    "Review analytical data, resolve deviations and issue technical summary report — Submit Pre-Manufacture Notice (PMN) / TSCA Section 5 notification to US EPA"
],
  "8.2.1": [
    "Confirm technical scope and operating window — Classify chemical substance under UN GHS / CLP criteria (physical, health and environmental hazards)",
    "Prepare chemical reagents, raw materials and analytical instruments — Classify chemical substance under UN GHS / CLP criteria (physical, health and environmental hazards)",
    "Execute chemical process run per standard operating procedure — Classify chemical substance under UN GHS / CLP criteria (physical, health and environmental hazards)",
    "Perform in-process testing (IPT) and mass balance verification — Classify chemical substance under UN GHS / CLP criteria (physical, health and environmental hazards)",
    "Review analytical data, resolve deviations and issue technical summary report — Classify chemical substance under UN GHS / CLP criteria (physical, health and environmental hazards)"
],
  "8.2.2": [
    "Confirm technical scope and operating window — Author 16-section Safety Data Sheets (SDS) in target market languages per ISO 11014",
    "Prepare chemical reagents, raw materials and analytical instruments — Author 16-section Safety Data Sheets (SDS) in target market languages per ISO 11014",
    "Execute chemical process run per standard operating procedure — Author 16-section Safety Data Sheets (SDS) in target market languages per ISO 11014",
    "Perform in-process testing (IPT) and mass balance verification — Author 16-section Safety Data Sheets (SDS) in target market languages per ISO 11014",
    "Review analytical data, resolve deviations and issue technical summary report — Author 16-section Safety Data Sheets (SDS) in target market languages per ISO 11014"
],
  "8.2.3": [
    "Confirm technical scope and operating window — Design regulatory compliant transport and packaging hazard labels (GHS pictograms, ADR/IMDG)",
    "Prepare chemical reagents, raw materials and analytical instruments — Design regulatory compliant transport and packaging hazard labels (GHS pictograms, ADR/IMDG)",
    "Execute chemical process run per standard operating procedure — Design regulatory compliant transport and packaging hazard labels (GHS pictograms, ADR/IMDG)",
    "Perform in-process testing (IPT) and mass balance verification — Design regulatory compliant transport and packaging hazard labels (GHS pictograms, ADR/IMDG)",
    "Review analytical data, resolve deviations and issue technical summary report — Design regulatory compliant transport and packaging hazard labels (GHS pictograms, ADR/IMDG)"
],
  "8.2.4": [
    "Confirm technical scope and operating window — Register product in National Chemical Inventories and poison centre notification (PCN) portals",
    "Prepare chemical reagents, raw materials and analytical instruments — Register product in National Chemical Inventories and poison centre notification (PCN) portals",
    "Execute chemical process run per standard operating procedure — Register product in National Chemical Inventories and poison centre notification (PCN) portals",
    "Perform in-process testing (IPT) and mass balance verification — Register product in National Chemical Inventories and poison centre notification (PCN) portals",
    "Review analytical data, resolve deviations and issue technical summary report — Register product in National Chemical Inventories and poison centre notification (PCN) portals"
],
  "8.3.1": [
    "Confirm technical scope and operating window — Submit formal chemical registration dossier to ECHA / national regulatory authorities",
    "Prepare chemical reagents, raw materials and analytical instruments — Submit formal chemical registration dossier to ECHA / national regulatory authorities",
    "Execute chemical process run per standard operating procedure — Submit formal chemical registration dossier to ECHA / national regulatory authorities",
    "Perform in-process testing (IPT) and mass balance verification — Submit formal chemical registration dossier to ECHA / national regulatory authorities",
    "Review analytical data, resolve deviations and issue technical summary report — Submit formal chemical registration dossier to ECHA / national regulatory authorities"
],
  "8.3.2": [
    "Confirm technical scope and operating window — Track authority review, respond to technical completeness queries and clarification requests",
    "Prepare chemical reagents, raw materials and analytical instruments — Track authority review, respond to technical completeness queries and clarification requests",
    "Execute chemical process run per standard operating procedure — Track authority review, respond to technical completeness queries and clarification requests",
    "Perform in-process testing (IPT) and mass balance verification — Track authority review, respond to technical completeness queries and clarification requests",
    "Review analytical data, resolve deviations and issue technical summary report — Track authority review, respond to technical completeness queries and clarification requests"
],
  "8.3.3": [
    "Confirm technical scope and operating window — Secure Certificate of Registration and verify import/export authorization compliance",
    "Prepare chemical reagents, raw materials and analytical instruments — Secure Certificate of Registration and verify import/export authorization compliance",
    "Execute chemical process run per standard operating procedure — Secure Certificate of Registration and verify import/export authorization compliance",
    "Perform in-process testing (IPT) and mass balance verification — Secure Certificate of Registration and verify import/export authorization compliance",
    "Review analytical data, resolve deviations and issue technical summary report — Secure Certificate of Registration and verify import/export authorization compliance"
],
  "9.1.1": [
    "Confirm technical scope and operating window — Perform solvent boil-out and cleaning validation of pilot reactors, transfer lines and receivers",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform solvent boil-out and cleaning validation of pilot reactors, transfer lines and receivers",
    "Execute chemical process run per standard operating procedure — Perform solvent boil-out and cleaning validation of pilot reactors, transfer lines and receivers",
    "Perform in-process testing (IPT) and mass balance verification — Perform solvent boil-out and cleaning validation of pilot reactors, transfer lines and receivers",
    "Review analytical data, resolve deviations and issue technical summary report — Perform solvent boil-out and cleaning validation of pilot reactors, transfer lines and receivers"
],
  "9.1.2": [
    "Confirm technical scope and operating window — Complete mechanical integrity checks, pressure testing and inert nitrogen blanketing verification",
    "Prepare chemical reagents, raw materials and analytical instruments — Complete mechanical integrity checks, pressure testing and inert nitrogen blanketing verification",
    "Execute chemical process run per standard operating procedure — Complete mechanical integrity checks, pressure testing and inert nitrogen blanketing verification",
    "Perform in-process testing (IPT) and mass balance verification — Complete mechanical integrity checks, pressure testing and inert nitrogen blanketing verification",
    "Review analytical data, resolve deviations and issue technical summary report — Complete mechanical integrity checks, pressure testing and inert nitrogen blanketing verification"
],
  "9.1.3": [
    "Confirm technical scope and operating window — Stage and inspect qualified raw materials, catalysts and packaging containers in pilot staging area",
    "Prepare chemical reagents, raw materials and analytical instruments — Stage and inspect qualified raw materials, catalysts and packaging containers in pilot staging area",
    "Execute chemical process run per standard operating procedure — Stage and inspect qualified raw materials, catalysts and packaging containers in pilot staging area",
    "Perform in-process testing (IPT) and mass balance verification — Stage and inspect qualified raw materials, catalysts and packaging containers in pilot staging area",
    "Review analytical data, resolve deviations and issue technical summary report — Stage and inspect qualified raw materials, catalysts and packaging containers in pilot staging area"
],
  "9.1.4": [
    "Confirm technical scope and operating window — Review and issue executed Batch Manufacturing Records (BMR) with authorized production sign-offs",
    "Prepare chemical reagents, raw materials and analytical instruments — Review and issue executed Batch Manufacturing Records (BMR) with authorized production sign-offs",
    "Execute chemical process run per standard operating procedure — Review and issue executed Batch Manufacturing Records (BMR) with authorized production sign-offs",
    "Perform in-process testing (IPT) and mass balance verification — Review and issue executed Batch Manufacturing Records (BMR) with authorized production sign-offs",
    "Review analytical data, resolve deviations and issue technical summary report — Review and issue executed Batch Manufacturing Records (BMR) with authorized production sign-offs"
],
  "9.2.1": [
    "Confirm technical scope and operating window — Execute 1st pilot synthesis batch (50-100 kg scale) monitoring exotherm profile and IPT conversion",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute 1st pilot synthesis batch (50-100 kg scale) monitoring exotherm profile and IPT conversion",
    "Execute chemical process run per standard operating procedure — Execute 1st pilot synthesis batch (50-100 kg scale) monitoring exotherm profile and IPT conversion",
    "Perform in-process testing (IPT) and mass balance verification — Execute 1st pilot synthesis batch (50-100 kg scale) monitoring exotherm profile and IPT conversion",
    "Review analytical data, resolve deviations and issue technical summary report — Execute 1st pilot synthesis batch (50-100 kg scale) monitoring exotherm profile and IPT conversion"
],
  "9.2.2": [
    "Confirm technical scope and operating window — Execute work-up, phase separation, crystallization and centrifuge isolation operations",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute work-up, phase separation, crystallization and centrifuge isolation operations",
    "Execute chemical process run per standard operating procedure — Execute work-up, phase separation, crystallization and centrifuge isolation operations",
    "Perform in-process testing (IPT) and mass balance verification — Execute work-up, phase separation, crystallization and centrifuge isolation operations",
    "Review analytical data, resolve deviations and issue technical summary report — Execute work-up, phase separation, crystallization and centrifuge isolation operations"
],
  "9.2.3": [
    "Confirm technical scope and operating window — Dry, mill and homogenize pilot batch product under controlled atmospheric conditions",
    "Prepare chemical reagents, raw materials and analytical instruments — Dry, mill and homogenize pilot batch product under controlled atmospheric conditions",
    "Execute chemical process run per standard operating procedure — Dry, mill and homogenize pilot batch product under controlled atmospheric conditions",
    "Perform in-process testing (IPT) and mass balance verification — Dry, mill and homogenize pilot batch product under controlled atmospheric conditions",
    "Review analytical data, resolve deviations and issue technical summary report — Dry, mill and homogenize pilot batch product under controlled atmospheric conditions"
],
  "9.2.4": [
    "Confirm technical scope and operating window — Execute in-process quality control tests and perform mass balance closure calculation",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute in-process quality control tests and perform mass balance closure calculation",
    "Execute chemical process run per standard operating procedure — Execute in-process quality control tests and perform mass balance closure calculation",
    "Perform in-process testing (IPT) and mass balance verification — Execute in-process quality control tests and perform mass balance closure calculation",
    "Review analytical data, resolve deviations and issue technical summary report — Execute in-process quality control tests and perform mass balance closure calculation"
],
  "9.3.1": [
    "Confirm technical scope and operating window — Package pilot batch in industrial UN-rated drums / IBC containers with moisture barrier liners",
    "Prepare chemical reagents, raw materials and analytical instruments — Package pilot batch in industrial UN-rated drums / IBC containers with moisture barrier liners",
    "Execute chemical process run per standard operating procedure — Package pilot batch in industrial UN-rated drums / IBC containers with moisture barrier liners",
    "Perform in-process testing (IPT) and mass balance verification — Package pilot batch in industrial UN-rated drums / IBC containers with moisture barrier liners",
    "Review analytical data, resolve deviations and issue technical summary report — Package pilot batch in industrial UN-rated drums / IBC containers with moisture barrier liners"
],
  "9.3.2": [
    "Confirm technical scope and operating window — Release Certificate of Analysis (COA) confirming all critical quality attributes meet commercial spec",
    "Prepare chemical reagents, raw materials and analytical instruments — Release Certificate of Analysis (COA) confirming all critical quality attributes meet commercial spec",
    "Execute chemical process run per standard operating procedure — Release Certificate of Analysis (COA) confirming all critical quality attributes meet commercial spec",
    "Perform in-process testing (IPT) and mass balance verification — Release Certificate of Analysis (COA) confirming all critical quality attributes meet commercial spec",
    "Review analytical data, resolve deviations and issue technical summary report — Release Certificate of Analysis (COA) confirming all critical quality attributes meet commercial spec"
],
  "9.3.3": [
    "Confirm technical scope and operating window — Dispatch qualification samples to lead customer technical evaluation teams",
    "Prepare chemical reagents, raw materials and analytical instruments — Dispatch qualification samples to lead customer technical evaluation teams",
    "Execute chemical process run per standard operating procedure — Dispatch qualification samples to lead customer technical evaluation teams",
    "Perform in-process testing (IPT) and mass balance verification — Dispatch qualification samples to lead customer technical evaluation teams",
    "Review analytical data, resolve deviations and issue technical summary report — Dispatch qualification samples to lead customer technical evaluation teams"
],
  "9.3.4": [
    "Confirm technical scope and operating window — Receive customer application trial feedback and compile Pilot Plant Campaign Technical Report",
    "Prepare chemical reagents, raw materials and analytical instruments — Receive customer application trial feedback and compile Pilot Plant Campaign Technical Report",
    "Execute chemical process run per standard operating procedure — Receive customer application trial feedback and compile Pilot Plant Campaign Technical Report",
    "Perform in-process testing (IPT) and mass balance verification — Receive customer application trial feedback and compile Pilot Plant Campaign Technical Report",
    "Review analytical data, resolve deviations and issue technical summary report — Receive customer application trial feedback and compile Pilot Plant Campaign Technical Report"
],
  "10.1.1": [
    "Confirm technical scope and operating window — Prepare demonstration-scale equipment train (1000L - 3000L reactor scale) and automation sequences",
    "Prepare chemical reagents, raw materials and analytical instruments — Prepare demonstration-scale equipment train (1000L - 3000L reactor scale) and automation sequences",
    "Execute chemical process run per standard operating procedure — Prepare demonstration-scale equipment train (1000L - 3000L reactor scale) and automation sequences",
    "Perform in-process testing (IPT) and mass balance verification — Prepare demonstration-scale equipment train (1000L - 3000L reactor scale) and automation sequences",
    "Review analytical data, resolve deviations and issue technical summary report — Prepare demonstration-scale equipment train (1000L - 3000L reactor scale) and automation sequences"
],
  "10.1.2": [
    "Confirm technical scope and operating window — Execute Demonstration Batch 1 verifying critical process parameter (CPP) control under DCS",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute Demonstration Batch 1 verifying critical process parameter (CPP) control under DCS",
    "Execute chemical process run per standard operating procedure — Execute Demonstration Batch 1 verifying critical process parameter (CPP) control under DCS",
    "Perform in-process testing (IPT) and mass balance verification — Execute Demonstration Batch 1 verifying critical process parameter (CPP) control under DCS",
    "Review analytical data, resolve deviations and issue technical summary report — Execute Demonstration Batch 1 verifying critical process parameter (CPP) control under DCS"
],
  "10.1.3": [
    "Confirm technical scope and operating window — Execute continuous distillation / solvent recovery train verifying VOC emission compliance",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute continuous distillation / solvent recovery train verifying VOC emission compliance",
    "Execute chemical process run per standard operating procedure — Execute continuous distillation / solvent recovery train verifying VOC emission compliance",
    "Perform in-process testing (IPT) and mass balance verification — Execute continuous distillation / solvent recovery train verifying VOC emission compliance",
    "Review analytical data, resolve deviations and issue technical summary report — Execute continuous distillation / solvent recovery train verifying VOC emission compliance"
],
  "10.1.4": [
    "Confirm technical scope and operating window — Execute isolated product drying, blending and final packaging operations",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute isolated product drying, blending and final packaging operations",
    "Execute chemical process run per standard operating procedure — Execute isolated product drying, blending and final packaging operations",
    "Perform in-process testing (IPT) and mass balance verification — Execute isolated product drying, blending and final packaging operations",
    "Review analytical data, resolve deviations and issue technical summary report — Execute isolated product drying, blending and final packaging operations"
],
  "10.1.5": [
    "Confirm technical scope and operating window — Track energy consumption, steam usage, refrigeration demand and raw material specific consumption",
    "Prepare chemical reagents, raw materials and analytical instruments — Track energy consumption, steam usage, refrigeration demand and raw material specific consumption",
    "Execute chemical process run per standard operating procedure — Track energy consumption, steam usage, refrigeration demand and raw material specific consumption",
    "Perform in-process testing (IPT) and mass balance verification — Track energy consumption, steam usage, refrigeration demand and raw material specific consumption",
    "Review analytical data, resolve deviations and issue technical summary report — Track energy consumption, steam usage, refrigeration demand and raw material specific consumption"
],
  "10.2.1": [
    "Confirm technical scope and operating window — Execute Demonstration Batch 2 under identical operating parameters verifying process reproducibility",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute Demonstration Batch 2 under identical operating parameters verifying process reproducibility",
    "Execute chemical process run per standard operating procedure — Execute Demonstration Batch 2 under identical operating parameters verifying process reproducibility",
    "Perform in-process testing (IPT) and mass balance verification — Execute Demonstration Batch 2 under identical operating parameters verifying process reproducibility",
    "Review analytical data, resolve deviations and issue technical summary report — Execute Demonstration Batch 2 under identical operating parameters verifying process reproducibility"
],
  "10.2.2": [
    "Confirm technical scope and operating window — Execute Demonstration Batch 3 verifying yield consistency (±2.0%) and impurity profile control",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute Demonstration Batch 3 verifying yield consistency (±2.0%) and impurity profile control",
    "Execute chemical process run per standard operating procedure — Execute Demonstration Batch 3 verifying yield consistency (±2.0%) and impurity profile control",
    "Perform in-process testing (IPT) and mass balance verification — Execute Demonstration Batch 3 verifying yield consistency (±2.0%) and impurity profile control",
    "Review analytical data, resolve deviations and issue technical summary report — Execute Demonstration Batch 3 verifying yield consistency (±2.0%) and impurity profile control"
],
  "10.2.3": [
    "Confirm technical scope and operating window — Perform multi-batch statistical process capability analysis (Cp, Cpk > 1.33)",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform multi-batch statistical process capability analysis (Cp, Cpk > 1.33)",
    "Execute chemical process run per standard operating procedure — Perform multi-batch statistical process capability analysis (Cp, Cpk > 1.33)",
    "Perform in-process testing (IPT) and mass balance verification — Perform multi-batch statistical process capability analysis (Cp, Cpk > 1.33)",
    "Review analytical data, resolve deviations and issue technical summary report — Perform multi-batch statistical process capability analysis (Cp, Cpk > 1.33)"
],
  "10.2.4": [
    "Confirm technical scope and operating window — Confirm 3 consecutive demonstration batches meet full commercial customer release specifications",
    "Prepare chemical reagents, raw materials and analytical instruments — Confirm 3 consecutive demonstration batches meet full commercial customer release specifications",
    "Execute chemical process run per standard operating procedure — Confirm 3 consecutive demonstration batches meet full commercial customer release specifications",
    "Perform in-process testing (IPT) and mass balance verification — Confirm 3 consecutive demonstration batches meet full commercial customer release specifications",
    "Review analytical data, resolve deviations and issue technical summary report — Confirm 3 consecutive demonstration batches meet full commercial customer release specifications"
],
  "10.3.1": [
    "Confirm technical scope and operating window — Complete analytical equivalence testing comparing demo-scale lots with competitor benchmark grade",
    "Prepare chemical reagents, raw materials and analytical instruments — Complete analytical equivalence testing comparing demo-scale lots with competitor benchmark grade",
    "Execute chemical process run per standard operating procedure — Complete analytical equivalence testing comparing demo-scale lots with competitor benchmark grade",
    "Perform in-process testing (IPT) and mass balance verification — Complete analytical equivalence testing comparing demo-scale lots with competitor benchmark grade",
    "Review analytical data, resolve deviations and issue technical summary report — Complete analytical equivalence testing comparing demo-scale lots with competitor benchmark grade"
],
  "10.3.2": [
    "Confirm technical scope and operating window — Set up commercial accelerated stability testing and packaging integrity testing in 200L drums",
    "Prepare chemical reagents, raw materials and analytical instruments — Set up commercial accelerated stability testing and packaging integrity testing in 200L drums",
    "Execute chemical process run per standard operating procedure — Set up commercial accelerated stability testing and packaging integrity testing in 200L drums",
    "Perform in-process testing (IPT) and mass balance verification — Set up commercial accelerated stability testing and packaging integrity testing in 200L drums",
    "Review analytical data, resolve deviations and issue technical summary report — Set up commercial accelerated stability testing and packaging integrity testing in 200L drums"
],
  "10.3.3": [
    "Confirm technical scope and operating window — Finalize Commercial Tech Transfer Package (TTP) and standard operating procedures for full plant",
    "Prepare chemical reagents, raw materials and analytical instruments — Finalize Commercial Tech Transfer Package (TTP) and standard operating procedures for full plant",
    "Execute chemical process run per standard operating procedure — Finalize Commercial Tech Transfer Package (TTP) and standard operating procedures for full plant",
    "Perform in-process testing (IPT) and mass balance verification — Finalize Commercial Tech Transfer Package (TTP) and standard operating procedures for full plant",
    "Review analytical data, resolve deviations and issue technical summary report — Finalize Commercial Tech Transfer Package (TTP) and standard operating procedures for full plant"
],
  "10.3.4": [
    "Confirm technical scope and operating window — Gate 4 Decision Review: Demo-Scale Proof sign-off approving commercial plant commissioning",
    "Prepare chemical reagents, raw materials and analytical instruments — Gate 4 Decision Review: Demo-Scale Proof sign-off approving commercial plant commissioning",
    "Execute chemical process run per standard operating procedure — Gate 4 Decision Review: Demo-Scale Proof sign-off approving commercial plant commissioning",
    "Perform in-process testing (IPT) and mass balance verification — Gate 4 Decision Review: Demo-Scale Proof sign-off approving commercial plant commissioning",
    "Review analytical data, resolve deviations and issue technical summary report — Gate 4 Decision Review: Demo-Scale Proof sign-off approving commercial plant commissioning"
],
  "11.1.1": [
    "Confirm technical scope and operating window — Finalize Detailed Piping & Instrumentation Diagrams (P&IDs) and plant 3D layout models",
    "Prepare chemical reagents, raw materials and analytical instruments — Finalize Detailed Piping & Instrumentation Diagrams (P&IDs) and plant 3D layout models",
    "Execute chemical process run per standard operating procedure — Finalize Detailed Piping & Instrumentation Diagrams (P&IDs) and plant 3D layout models",
    "Perform in-process testing (IPT) and mass balance verification — Finalize Detailed Piping & Instrumentation Diagrams (P&IDs) and plant 3D layout models",
    "Review analytical data, resolve deviations and issue technical summary report — Finalize Detailed Piping & Instrumentation Diagrams (P&IDs) and plant 3D layout models"
],
  "11.1.2": [
    "Confirm technical scope and operating window — Procure commercial reactors, distillation columns, glass-lined receivers and scrubbers",
    "Prepare chemical reagents, raw materials and analytical instruments — Procure commercial reactors, distillation columns, glass-lined receivers and scrubbers",
    "Execute chemical process run per standard operating procedure — Procure commercial reactors, distillation columns, glass-lined receivers and scrubbers",
    "Perform in-process testing (IPT) and mass balance verification — Procure commercial reactors, distillation columns, glass-lined receivers and scrubbers",
    "Review analytical data, resolve deviations and issue technical summary report — Procure commercial reactors, distillation columns, glass-lined receivers and scrubbers"
],
  "11.1.3": [
    "Confirm technical scope and operating window — Install chemical process piping, high-integrity valves, mechanical seals and vacuum skids",
    "Prepare chemical reagents, raw materials and analytical instruments — Install chemical process piping, high-integrity valves, mechanical seals and vacuum skids",
    "Execute chemical process run per standard operating procedure — Install chemical process piping, high-integrity valves, mechanical seals and vacuum skids",
    "Perform in-process testing (IPT) and mass balance verification — Install chemical process piping, high-integrity valves, mechanical seals and vacuum skids",
    "Review analytical data, resolve deviations and issue technical summary report — Install chemical process piping, high-integrity valves, mechanical seals and vacuum skids"
],
  "11.1.4": [
    "Confirm technical scope and operating window — Install dedicated Effluent Treatment Plant (ETP), multi-effect evaporator (MEE) and VOC oxidizer",
    "Prepare chemical reagents, raw materials and analytical instruments — Install dedicated Effluent Treatment Plant (ETP), multi-effect evaporator (MEE) and VOC oxidizer",
    "Execute chemical process run per standard operating procedure — Install dedicated Effluent Treatment Plant (ETP), multi-effect evaporator (MEE) and VOC oxidizer",
    "Perform in-process testing (IPT) and mass balance verification — Install dedicated Effluent Treatment Plant (ETP), multi-effect evaporator (MEE) and VOC oxidizer",
    "Review analytical data, resolve deviations and issue technical summary report — Install dedicated Effluent Treatment Plant (ETP), multi-effect evaporator (MEE) and VOC oxidizer"
],
  "11.1.5": [
    "Confirm technical scope and operating window — Perform hydrostatic, pneumatic leak testing and non-destructive weld inspections (NDT)",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform hydrostatic, pneumatic leak testing and non-destructive weld inspections (NDT)",
    "Execute chemical process run per standard operating procedure — Perform hydrostatic, pneumatic leak testing and non-destructive weld inspections (NDT)",
    "Perform in-process testing (IPT) and mass balance verification — Perform hydrostatic, pneumatic leak testing and non-destructive weld inspections (NDT)",
    "Review analytical data, resolve deviations and issue technical summary report — Perform hydrostatic, pneumatic leak testing and non-destructive weld inspections (NDT)"
],
  "11.2.1": [
    "Confirm technical scope and operating window — Program DCS/PLC automation sequences, recipe management and emergency interlock shutdowns",
    "Prepare chemical reagents, raw materials and analytical instruments — Program DCS/PLC automation sequences, recipe management and emergency interlock shutdowns",
    "Execute chemical process run per standard operating procedure — Program DCS/PLC automation sequences, recipe management and emergency interlock shutdowns",
    "Perform in-process testing (IPT) and mass balance verification — Program DCS/PLC automation sequences, recipe management and emergency interlock shutdowns",
    "Review analytical data, resolve deviations and issue technical summary report — Program DCS/PLC automation sequences, recipe management and emergency interlock shutdowns"
],
  "11.2.2": [
    "Confirm technical scope and operating window — Commission plant utilities (cooling towers, chilled brine -20°C, high-pressure steam, nitrogen plant)",
    "Prepare chemical reagents, raw materials and analytical instruments — Commission plant utilities (cooling towers, chilled brine -20°C, high-pressure steam, nitrogen plant)",
    "Execute chemical process run per standard operating procedure — Commission plant utilities (cooling towers, chilled brine -20°C, high-pressure steam, nitrogen plant)",
    "Perform in-process testing (IPT) and mass balance verification — Commission plant utilities (cooling towers, chilled brine -20°C, high-pressure steam, nitrogen plant)",
    "Review analytical data, resolve deviations and issue technical summary report — Commission plant utilities (cooling towers, chilled brine -20°C, high-pressure steam, nitrogen plant)"
],
  "11.2.3": [
    "Confirm technical scope and operating window — Perform water / solvent trial run (dry & wet commissioning) to verify fluid dynamics and pump curves",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform water / solvent trial run (dry & wet commissioning) to verify fluid dynamics and pump curves",
    "Execute chemical process run per standard operating procedure — Perform water / solvent trial run (dry & wet commissioning) to verify fluid dynamics and pump curves",
    "Perform in-process testing (IPT) and mass balance verification — Perform water / solvent trial run (dry & wet commissioning) to verify fluid dynamics and pump curves",
    "Review analytical data, resolve deviations and issue technical summary report — Perform water / solvent trial run (dry & wet commissioning) to verify fluid dynamics and pump curves"
],
  "11.2.4": [
    "Confirm technical scope and operating window — Conduct factory acceptance testing (FAT) and site acceptance testing (SAT) on instrumentation",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct factory acceptance testing (FAT) and site acceptance testing (SAT) on instrumentation",
    "Execute chemical process run per standard operating procedure — Conduct factory acceptance testing (FAT) and site acceptance testing (SAT) on instrumentation",
    "Perform in-process testing (IPT) and mass balance verification — Conduct factory acceptance testing (FAT) and site acceptance testing (SAT) on instrumentation",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct factory acceptance testing (FAT) and site acceptance testing (SAT) on instrumentation"
],
  "11.2.5": [
    "Confirm technical scope and operating window — Train commercial operations, maintenance, QC and safety teams on plant operating manuals",
    "Prepare chemical reagents, raw materials and analytical instruments — Train commercial operations, maintenance, QC and safety teams on plant operating manuals",
    "Execute chemical process run per standard operating procedure — Train commercial operations, maintenance, QC and safety teams on plant operating manuals",
    "Perform in-process testing (IPT) and mass balance verification — Train commercial operations, maintenance, QC and safety teams on plant operating manuals",
    "Review analytical data, resolve deviations and issue technical summary report — Train commercial operations, maintenance, QC and safety teams on plant operating manuals"
],
  "11.3.1": [
    "Confirm technical scope and operating window — Conduct comprehensive Pre-Startup Safety Review (PSSR) walk-through with statutory safety authorities",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct comprehensive Pre-Startup Safety Review (PSSR) walk-through with statutory safety authorities",
    "Execute chemical process run per standard operating procedure — Conduct comprehensive Pre-Startup Safety Review (PSSR) walk-through with statutory safety authorities",
    "Perform in-process testing (IPT) and mass balance verification — Conduct comprehensive Pre-Startup Safety Review (PSSR) walk-through with statutory safety authorities",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct comprehensive Pre-Startup Safety Review (PSSR) walk-through with statutory safety authorities"
],
  "11.3.2": [
    "Confirm technical scope and operating window — Secure Consent to Operate (CTO) from State Pollution Control Board and Factory Inspectorate license",
    "Prepare chemical reagents, raw materials and analytical instruments — Secure Consent to Operate (CTO) from State Pollution Control Board and Factory Inspectorate license",
    "Execute chemical process run per standard operating procedure — Secure Consent to Operate (CTO) from State Pollution Control Board and Factory Inspectorate license",
    "Perform in-process testing (IPT) and mass balance verification — Secure Consent to Operate (CTO) from State Pollution Control Board and Factory Inspectorate license",
    "Review analytical data, resolve deviations and issue technical summary report — Secure Consent to Operate (CTO) from State Pollution Control Board and Factory Inspectorate license"
],
  "11.3.3": [
    "Confirm technical scope and operating window — Verify all fire protection systems, deluge nozzles, gas sensors and emergency eyewash/showers",
    "Prepare chemical reagents, raw materials and analytical instruments — Verify all fire protection systems, deluge nozzles, gas sensors and emergency eyewash/showers",
    "Execute chemical process run per standard operating procedure — Verify all fire protection systems, deluge nozzles, gas sensors and emergency eyewash/showers",
    "Perform in-process testing (IPT) and mass balance verification — Verify all fire protection systems, deluge nozzles, gas sensors and emergency eyewash/showers",
    "Review analytical data, resolve deviations and issue technical summary report — Verify all fire protection systems, deluge nozzles, gas sensors and emergency eyewash/showers"
],
  "11.3.4": [
    "Confirm technical scope and operating window — Gate 5 Decision Review: Commercial Production Readiness sign-off authorizing active chemical charging",
    "Prepare chemical reagents, raw materials and analytical instruments — Gate 5 Decision Review: Commercial Production Readiness sign-off authorizing active chemical charging",
    "Execute chemical process run per standard operating procedure — Gate 5 Decision Review: Commercial Production Readiness sign-off authorizing active chemical charging",
    "Perform in-process testing (IPT) and mass balance verification — Gate 5 Decision Review: Commercial Production Readiness sign-off authorizing active chemical charging",
    "Review analytical data, resolve deviations and issue technical summary report — Gate 5 Decision Review: Commercial Production Readiness sign-off authorizing active chemical charging"
],
  "12.1.1": [
    "Confirm technical scope and operating window — Charge commercial raw materials and initiate first commercial industrial-scale production campaign",
    "Prepare chemical reagents, raw materials and analytical instruments — Charge commercial raw materials and initiate first commercial industrial-scale production campaign",
    "Execute chemical process run per standard operating procedure — Charge commercial raw materials and initiate first commercial industrial-scale production campaign",
    "Perform in-process testing (IPT) and mass balance verification — Charge commercial raw materials and initiate first commercial industrial-scale production campaign",
    "Review analytical data, resolve deviations and issue technical summary report — Charge commercial raw materials and initiate first commercial industrial-scale production campaign"
],
  "12.1.2": [
    "Confirm technical scope and operating window — Monitor real-time DCS reactor temperature profiles, addition rates and exothermic reaction behavior",
    "Prepare chemical reagents, raw materials and analytical instruments — Monitor real-time DCS reactor temperature profiles, addition rates and exothermic reaction behavior",
    "Execute chemical process run per standard operating procedure — Monitor real-time DCS reactor temperature profiles, addition rates and exothermic reaction behavior",
    "Perform in-process testing (IPT) and mass balance verification — Monitor real-time DCS reactor temperature profiles, addition rates and exothermic reaction behavior",
    "Review analytical data, resolve deviations and issue technical summary report — Monitor real-time DCS reactor temperature profiles, addition rates and exothermic reaction behavior"
],
  "12.1.3": [
    "Confirm technical scope and operating window — Execute commercial crystallization, filtration and automated bulk drumming / packaging operations",
    "Prepare chemical reagents, raw materials and analytical instruments — Execute commercial crystallization, filtration and automated bulk drumming / packaging operations",
    "Execute chemical process run per standard operating procedure — Execute commercial crystallization, filtration and automated bulk drumming / packaging operations",
    "Perform in-process testing (IPT) and mass balance verification — Execute commercial crystallization, filtration and automated bulk drumming / packaging operations",
    "Review analytical data, resolve deviations and issue technical summary report — Execute commercial crystallization, filtration and automated bulk drumming / packaging operations"
],
  "12.1.4": [
    "Confirm technical scope and operating window — Verify commercial batch yield, overall cycle time and solvent recovery efficiency",
    "Prepare chemical reagents, raw materials and analytical instruments — Verify commercial batch yield, overall cycle time and solvent recovery efficiency",
    "Execute chemical process run per standard operating procedure — Verify commercial batch yield, overall cycle time and solvent recovery efficiency",
    "Perform in-process testing (IPT) and mass balance verification — Verify commercial batch yield, overall cycle time and solvent recovery efficiency",
    "Review analytical data, resolve deviations and issue technical summary report — Verify commercial batch yield, overall cycle time and solvent recovery efficiency"
],
  "12.2.1": [
    "Confirm technical scope and operating window — Perform comprehensive commercial batch testing and issue signed Certificate of Analysis (COA)",
    "Prepare chemical reagents, raw materials and analytical instruments — Perform comprehensive commercial batch testing and issue signed Certificate of Analysis (COA)",
    "Execute chemical process run per standard operating procedure — Perform comprehensive commercial batch testing and issue signed Certificate of Analysis (COA)",
    "Perform in-process testing (IPT) and mass balance verification — Perform comprehensive commercial batch testing and issue signed Certificate of Analysis (COA)",
    "Review analytical data, resolve deviations and issue technical summary report — Perform comprehensive commercial batch testing and issue signed Certificate of Analysis (COA)"
],
  "12.2.2": [
    "Confirm technical scope and operating window — Establish raw material and finished goods warehouse ERP inventory lot tracking and barcoding",
    "Prepare chemical reagents, raw materials and analytical instruments — Establish raw material and finished goods warehouse ERP inventory lot tracking and barcoding",
    "Execute chemical process run per standard operating procedure — Establish raw material and finished goods warehouse ERP inventory lot tracking and barcoding",
    "Perform in-process testing (IPT) and mass balance verification — Establish raw material and finished goods warehouse ERP inventory lot tracking and barcoding",
    "Review analytical data, resolve deviations and issue technical summary report — Establish raw material and finished goods warehouse ERP inventory lot tracking and barcoding"
],
  "12.2.3": [
    "Confirm technical scope and operating window — Fulfill initial commercial customer supply contracts and industrial distribution allocations",
    "Prepare chemical reagents, raw materials and analytical instruments — Fulfill initial commercial customer supply contracts and industrial distribution allocations",
    "Execute chemical process run per standard operating procedure — Fulfill initial commercial customer supply contracts and industrial distribution allocations",
    "Perform in-process testing (IPT) and mass balance verification — Fulfill initial commercial customer supply contracts and industrial distribution allocations",
    "Review analytical data, resolve deviations and issue technical summary report — Fulfill initial commercial customer supply contracts and industrial distribution allocations"
],
  "12.2.4": [
    "Confirm technical scope and operating window — Monitor customer delivery, offloading safety and early application performance feedback",
    "Prepare chemical reagents, raw materials and analytical instruments — Monitor customer delivery, offloading safety and early application performance feedback",
    "Execute chemical process run per standard operating procedure — Monitor customer delivery, offloading safety and early application performance feedback",
    "Perform in-process testing (IPT) and mass balance verification — Monitor customer delivery, offloading safety and early application performance feedback",
    "Review analytical data, resolve deviations and issue technical summary report — Monitor customer delivery, offloading safety and early application performance feedback"
],
  "12.3.1": [
    "Confirm technical scope and operating window — Ramp up commercial plant production to nameplate capacity utilization (>85%)",
    "Prepare chemical reagents, raw materials and analytical instruments — Ramp up commercial plant production to nameplate capacity utilization (>85%)",
    "Execute chemical process run per standard operating procedure — Ramp up commercial plant production to nameplate capacity utilization (>85%)",
    "Perform in-process testing (IPT) and mass balance verification — Ramp up commercial plant production to nameplate capacity utilization (>85%)",
    "Review analytical data, resolve deviations and issue technical summary report — Ramp up commercial plant production to nameplate capacity utilization (>85%)"
],
  "12.3.2": [
    "Confirm technical scope and operating window — Optimize operational bottleneck areas to reduce unit production cost and specific utility consumption",
    "Prepare chemical reagents, raw materials and analytical instruments — Optimize operational bottleneck areas to reduce unit production cost and specific utility consumption",
    "Execute chemical process run per standard operating procedure — Optimize operational bottleneck areas to reduce unit production cost and specific utility consumption",
    "Perform in-process testing (IPT) and mass balance verification — Optimize operational bottleneck areas to reduce unit production cost and specific utility consumption",
    "Review analytical data, resolve deviations and issue technical summary report — Optimize operational bottleneck areas to reduce unit production cost and specific utility consumption"
],
  "12.3.3": [
    "Confirm technical scope and operating window — Conduct formal post-launch project review comparing actual COM and NPV vs initial project charter",
    "Prepare chemical reagents, raw materials and analytical instruments — Conduct formal post-launch project review comparing actual COM and NPV vs initial project charter",
    "Execute chemical process run per standard operating procedure — Conduct formal post-launch project review comparing actual COM and NPV vs initial project charter",
    "Perform in-process testing (IPT) and mass balance verification — Conduct formal post-launch project review comparing actual COM and NPV vs initial project charter",
    "Review analytical data, resolve deviations and issue technical summary report — Conduct formal post-launch project review comparing actual COM and NPV vs initial project charter"
],
  "12.3.4": [
    "Confirm technical scope and operating window — Hand over commercial chemical manufacturing asset to Operations and close Stage-Gate project lifecycle",
    "Prepare chemical reagents, raw materials and analytical instruments — Hand over commercial chemical manufacturing asset to Operations and close Stage-Gate project lifecycle",
    "Execute chemical process run per standard operating procedure — Hand over commercial chemical manufacturing asset to Operations and close Stage-Gate project lifecycle",
    "Perform in-process testing (IPT) and mass balance verification — Hand over commercial chemical manufacturing asset to Operations and close Stage-Gate project lifecycle",
    "Review analytical data, resolve deviations and issue technical summary report — Hand over commercial chemical manufacturing asset to Operations and close Stage-Gate project lifecycle"
],
};


export function getTasksForWbs(slNo?: string, taskName?: string): string[] {
  if (slNo && STAGE_WBS_TASKS[slNo]) {
    return STAGE_WBS_TASKS[slNo];
  }
  return [
    'Confirm technical scope and protocol per SOP',
    'Prepare raw materials, equipment and experimental setup',
    'Execute chemical run per approved procedure',
    'Analyze analytical data and resolve deviations',
    'Approve findings and issue technical report'
  ];
}

export function getTaskItemsForWbs(slNo?: string, taskName?: string): Array<{ task: string; taskId: string; code: string; jobCode: string; history: number }> {
  const tasks = getTasksForWbs(slNo, taskName);
  return tasks.map((t, i) => {
    const cleanSl = (slNo || '1.1').replace(/\./g, '');
    const code = `TC-${cleanSl}-${i + 1}`;
    return {
      task: t,
      taskId: code,
      code: code,
      jobCode: `JOB-${cleanSl}-${i + 1}`,
      history: ((i * 3 + 2) % 5) + 1
    };
  });
}

function computeTaskHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTaskDetails(
  taskName?: string,
  index: number = 0,
  slNo?: string,
  activityCode?: string,
  jobCode?: string,
  taskId?: string
): {
  taskCode: string;
  code: string;
  jobCode: string;
  department: string;
  role: string;
  dueDate: string;
  history: number;
} {
  const cleanSl = (slNo || '1.1').replace(/\./g, '');
  const tCode = taskId || (activityCode ? `${activityCode}-${index + 1}` : `TC-${cleanSl}-${index + 1}`);
  const jCode = jobCode || `JOB-${cleanSl}-${index + 1}`;

  const depts = ['Process R&D', 'Engineering & Scale-Up', 'QC / Analytical', 'QA & Compliance', 'Regulatory Affairs', 'Operations / Production', 'Process Safety / EHS'];
  const roles = ['Principal Chemist', 'Chemical Process Engineer', 'Senior Analytical Chemist', 'Quality Assurance Officer', 'Regulatory Affairs Manager', 'Plant Operations Lead', 'Process Safety Officer'];

  const hash = computeTaskHash(taskName || '') + index;
  const dept = depts[hash % depts.length];
  const role = roles[hash % roles.length];
  const daysOffset = 10 + (hash % 50);
  const day = String(1 + (daysOffset % 28)).padStart(2, '0');
  const month = String(3 + Math.floor(daysOffset / 30)).padStart(2, '0');
  const dueDate = `2026-${month}-${day}`;

  return {
    taskCode: tCode,
    code: tCode,
    jobCode: jCode,
    department: dept,
    role: role,
    dueDate: dueDate,
    history: (hash % 5) + 1
  };
}
