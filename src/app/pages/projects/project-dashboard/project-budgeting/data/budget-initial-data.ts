// Auto-generated Budget Initial Data from RPM Budget Blueprint
import { WbsNode, RateCard, ManpowerAllocation, MaterialItem, CapexItem, RldData, AnalyticalCostData } from '../models/budgeting.models';

export const INITIAL_WBS_ROWS: WbsNode[] = [
  {
    "id": "G1",
    "lvl": "Gate",
    "name": "GATE 1: Business case and molecule selection",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G1"
  },
  {
    "id": "1",
    "lvl": "Stage",
    "name": "Stage 1 (S1): Business Case",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G1"
  },
  {
    "id": "1.1",
    "lvl": "Deliverable",
    "name": "Business case preparation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G1"
  },
  {
    "id": "1.1.1",
    "lvl": "Activity",
    "name": "Molecule Selection & Indication Mapping",
    "resp": "PMO/Managemnet",
    "F": 40000,
    "G": 42000,
    "gate": "G1"
  },
  {
    "id": "1.1.2",
    "lvl": "Activity",
    "name": "Country & Regulatory Scope Identification",
    "resp": "PMO/Managemnet/RA",
    "F": 40000,
    "G": 35000,
    "gate": "G1"
  },
  {
    "id": "1.1.3",
    "lvl": "Activity",
    "name": "Preliminary COGs and CAPEX Estimation",
    "resp": "PMO/Managemnet",
    "F": 40000,
    "G": 38000,
    "gate": "G1"
  },
  {
    "id": "1.1.4",
    "lvl": "Activity",
    "name": "Market sizing and forecast analysis",
    "resp": "PMO/Managemnet",
    "F": 40000,
    "G": 38000,
    "gate": "G1"
  },
  {
    "id": "1.1.5",
    "lvl": "Activity",
    "name": "NPV & Commercial Attractiveness Model",
    "resp": "PMO/Managemnet",
    "F": 40000,
    "G": 43000,
    "gate": "G1"
  },
  {
    "id": "1.2",
    "lvl": "Deliverable",
    "name": "Market sizing and commercial modeling",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G1"
  },
  {
    "id": "1.2.1",
    "lvl": "Activity",
    "name": "Market Sizing & Forecast Analysis",
    "resp": "PMO/Managemnet/Finace",
    "F": 60000,
    "G": 64000,
    "gate": "G1"
  },
  {
    "id": "1.2.2",
    "lvl": "Activity",
    "name": "NPV & Commercial Attractiveness Model",
    "resp": "PMO/Managemnet/Finace",
    "F": 40000,
    "G": 45000,
    "gate": "G1"
  },
  {
    "id": "1.3",
    "lvl": "Deliverable",
    "name": "Business case approval",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G1"
  },
  {
    "id": "1.3.1",
    "lvl": "Activity",
    "name": "Steering Committee Sign-off",
    "resp": "Steering Committee",
    "F": 15000,
    "G": 14000,
    "gate": "G1"
  },
  {
    "id": "G2",
    "lvl": "Gate",
    "name": "GATE 2: Design and project initiation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2",
    "lvl": "Stage",
    "name": "Stage 2 (S2): Project Initiation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.1",
    "lvl": "Deliverable",
    "name": "Project costing sheet preparation and selection of project/product",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.1.1",
    "lvl": "Activity",
    "name": "Analytical costing, External CRO costing like Filter validation costing, Extractable & Leachable study costing, any additional test costing etc",
    "resp": "R&D",
    "F": 20000,
    "G": 20000,
    "gate": "G2"
  },
  {
    "id": "2.1.2",
    "lvl": "Activity",
    "name": "Licensing costing",
    "resp": "RA",
    "F": 20000,
    "G": 18000,
    "gate": "G2"
  },
  {
    "id": "2.1.3",
    "lvl": "Activity",
    "name": "RM, PM, Consumables & RLD costing",
    "resp": "Procurment",
    "F": 20000,
    "G": 19000,
    "gate": "G2"
  },
  {
    "id": "2.1.4",
    "lvl": "Activity",
    "name": "CT/BE Costing",
    "resp": "Clinical",
    "F": 20000,
    "G": 20000,
    "gate": "G2"
  },
  {
    "id": "2.2",
    "lvl": "Deliverable",
    "name": "Literature search and MER",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.2.1",
    "lvl": "Activity",
    "name": "Scan of IP landscape",
    "resp": "FR&D",
    "F": 150000,
    "G": 133000,
    "gate": "G2"
  },
  {
    "id": "2.2.2",
    "lvl": "Activity",
    "name": "MER availability",
    "resp": "FR&D",
    "F": 50000,
    "G": 47000,
    "gate": "G2"
  },
  {
    "id": "2.2.3",
    "lvl": "Activity",
    "name": "Preparation of IPR strategy",
    "resp": "FR&D",
    "F": 75000,
    "G": 79000,
    "gate": "G2"
  },
  {
    "id": "2.3",
    "lvl": "Deliverable",
    "name": "PPDS finalization",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.3.1",
    "lvl": "Activity",
    "name": "Pre Product Development Strategy (PPDS) finalization",
    "resp": "R&D",
    "F": 30000,
    "G": 31000,
    "gate": "G2"
  },
  {
    "id": "2.3.2",
    "lvl": "Activity",
    "name": "Approve country regulatory/BE strategy and QTPP/CQA assessment",
    "resp": "RA / R&D / Clinical / Management",
    "F": 50000,
    "G": 48000,
    "gate": "G2"
  },
  {
    "id": "2.4",
    "lvl": "Deliverable",
    "name": "Test license /NOC",
    "resp": "RA will submit",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.4.1",
    "lvl": "Activity",
    "name": "Manufacturing Formula & Process",
    "resp": "R&D",
    "F": 30000,
    "G": 28000,
    "gate": "G2"
  },
  {
    "id": "2.4.2",
    "lvl": "Activity",
    "name": "Label claim approval",
    "resp": "R&D",
    "F": 30000,
    "G": 31000,
    "gate": "G2"
  },
  {
    "id": "2.4.3",
    "lvl": "Activity",
    "name": "FP specifications, & STP",
    "resp": "R&D",
    "F": 30000,
    "G": 33000,
    "gate": "G2"
  },
  {
    "id": "2.4.4",
    "lvl": "Activity",
    "name": "Application processing & Other administrative Documents (API Manufacturing License, MSDS, API UTB & CT-15)",
    "resp": "R&D",
    "F": 50000,
    "G": 44000,
    "gate": "G2"
  },
  {
    "id": "2.5",
    "lvl": "Deliverable",
    "name": "RLD import license Form 11 for development studies",
    "resp": "RA will submit",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.5.1",
    "lvl": "Activity",
    "name": "RLD utilization break-up",
    "resp": "R&D",
    "F": 25000,
    "G": 27000,
    "gate": "G2"
  },
  {
    "id": "2.5.2",
    "lvl": "Activity",
    "name": "RMP MA holder selection & COO Finalization",
    "resp": "R&D",
    "F": 25000,
    "G": 27000,
    "gate": "G2"
  },
  {
    "id": "2.5.3",
    "lvl": "Activity",
    "name": "ITL for RLD processing & approval",
    "resp": "R&D",
    "F": 40000,
    "G": 39000,
    "gate": "G2"
  },
  {
    "id": "2.6",
    "lvl": "Deliverable",
    "name": "API import license Form 11",
    "resp": "RA will submit",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.6.1",
    "lvl": "Activity",
    "name": "API utilization break-up",
    "resp": "Procurment / R&D",
    "F": 25000,
    "G": 23000,
    "gate": "G2"
  },
  {
    "id": "2.6.2",
    "lvl": "Activity",
    "name": "API vendor finalization",
    "resp": "Procurment / R&D",
    "F": 25000,
    "G": 28000,
    "gate": "G2"
  },
  {
    "id": "2.6.3",
    "lvl": "Activity",
    "name": "ITL for API processing & approval",
    "resp": "Procurment / R&D",
    "F": 40000,
    "G": 39000,
    "gate": "G2"
  },
  {
    "id": "2.7",
    "lvl": "Deliverable",
    "name": "Form 29 manufacturing permission/manufacturing license",
    "resp": "RA will submit",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.7.1",
    "lvl": "Activity",
    "name": "Manufacturing Formula & Process",
    "resp": "R&D",
    "F": 35000,
    "G": 32000,
    "gate": "G2"
  },
  {
    "id": "2.7.2",
    "lvl": "Activity",
    "name": "FP specifications, STP & Stability data",
    "resp": "R&D",
    "F": 35000,
    "G": 32000,
    "gate": "G2"
  },
  {
    "id": "2.7.3",
    "lvl": "Activity",
    "name": "Application processing & Other administrative Documents",
    "resp": "R&D",
    "F": 75000,
    "G": 83000,
    "gate": "G2"
  },
  {
    "id": "2.8",
    "lvl": "Deliverable",
    "name": "CT-14/CT-11 permission to manufacture the batch for BE purpose",
    "resp": "RA will submit",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.8.1",
    "lvl": "Activity",
    "name": "Batch size confirmation ; API & Formulation reconciliation",
    "resp": "Clinical / R&D",
    "F": 30000,
    "G": 31000,
    "gate": "G2"
  },
  {
    "id": "2.8.2",
    "lvl": "Activity",
    "name": "Application processing & Other administrative Documents",
    "resp": "Clinical / R&D",
    "F": 50000,
    "G": 55000,
    "gate": "G2"
  },
  {
    "id": "2.9",
    "lvl": "Deliverable",
    "name": "New product information to be sent to plant",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G2"
  },
  {
    "id": "2.9.1",
    "lvl": "Activity",
    "name": "New product information to be sent to plant",
    "resp": "R&D / PMO",
    "F": 5000,
    "G": 5000,
    "gate": "G2"
  },
  {
    "id": "G3",
    "lvl": "Gate",
    "name": "GATE 3: Prototype development",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "3",
    "lvl": "Stage",
    "name": "Stage 3 (S3): Development Procurement",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "3.1",
    "lvl": "Deliverable",
    "name": "Procurement - Developmental studies",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "3.1.1",
    "lvl": "Activity",
    "name": "API Procurement for Developmental studies",
    "resp": "R&D / Procurment",
    "F": 600000,
    "G": 615000,
    "gate": "G3"
  },
  {
    "id": "3.1.2",
    "lvl": "Activity",
    "name": "RLD Procurement for Developmental studies",
    "resp": "R&D / Procurment",
    "F": 1200000,
    "G": 1371000,
    "gate": "G3"
  },
  {
    "id": "3.1.3",
    "lvl": "Activity",
    "name": "Excipients procurement for Developmental studies",
    "resp": "R&D / Procurment",
    "F": 150000,
    "G": 147000,
    "gate": "G3"
  },
  {
    "id": "3.1.4",
    "lvl": "Activity",
    "name": "Miscellaneous items like filters etc (if any) procurement for development studies",
    "resp": "R&D / Procurment",
    "F": 75000,
    "G": 77000,
    "gate": "G3"
  },
  {
    "id": "3.1.5",
    "lvl": "Activity",
    "name": "Packaging materials Procurement for Developmental studies",
    "resp": "R&D / Procurment",
    "F": 60000,
    "G": 66000,
    "gate": "G3"
  },
  {
    "id": "3.1.6",
    "lvl": "Activity",
    "name": "Analytical Requirements Procurement  for API method development/verification",
    "resp": "R&D / Procurment",
    "F": 400000,
    "G": 419000,
    "gate": "G3"
  },
  {
    "id": "3.1.7",
    "lvl": "Activity",
    "name": "Analytical Requirements Procurement  for Finished product method development",
    "resp": "R&D / Procurment",
    "F": 300000,
    "G": 334000,
    "gate": "G3"
  },
  {
    "id": "3.1.8",
    "lvl": "Activity",
    "name": "Evaluation of API COAs and finalisation of vendor",
    "resp": "R&D / Procurment / QA",
    "F": 20000,
    "G": 21000,
    "gate": "G3"
  },
  {
    "id": "3.1.9",
    "lvl": "Activity",
    "name": "Availability of API ODMF/CEP suitability",
    "resp": "R&D / Procurment / RA",
    "F": 15000,
    "G": 16000,
    "gate": "G3"
  },
  {
    "id": "3.1.10",
    "lvl": "Activity",
    "name": "Availability of API spec and MOA",
    "resp": "R&D / Procurment",
    "F": 15000,
    "G": 13000,
    "gate": "G3"
  },
  {
    "id": "4",
    "lvl": "Stage",
    "name": "Stage 4 (S4): POC Formulation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.1",
    "lvl": "Deliverable",
    "name": "API characterization and IH coa release",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.1.1",
    "lvl": "Activity",
    "name": "API Analysis",
    "resp": "ARD",
    "F": 60000,
    "G": 56000,
    "gate": "G3"
  },
  {
    "id": "4.1.2",
    "lvl": "Activity",
    "name": "IH CoA Release",
    "resp": "ARD",
    "F": 10000,
    "G": 10000,
    "gate": "G3"
  },
  {
    "id": "4.1.3",
    "lvl": "Activity",
    "name": "3 lots of API verification",
    "resp": "ARD",
    "F": 150000,
    "G": 135000,
    "gate": "G3"
  },
  {
    "id": "4.1.4",
    "lvl": "Activity",
    "name": "API test methods and specifications Finalization",
    "resp": "ARD",
    "F": 40000,
    "G": 38000,
    "gate": "G3"
  },
  {
    "id": "4.2",
    "lvl": "Deliverable",
    "name": "RMP/RLD characterization (Physical and chemical)",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.2.1",
    "lvl": "Activity",
    "name": "RMP/RLD Physical Characterization",
    "resp": "ARD",
    "F": 80000,
    "G": 73000,
    "gate": "G3"
  },
  {
    "id": "4.2.2",
    "lvl": "Activity",
    "name": "RMP/RLD Chemical Characterization",
    "resp": "ARD",
    "F": 80000,
    "G": 76000,
    "gate": "G3"
  },
  {
    "id": "4.2.3",
    "lvl": "Activity",
    "name": "RMP/RLD Packing Characterization",
    "resp": "ARD",
    "F": 80000,
    "G": 84000,
    "gate": "G3"
  },
  {
    "id": "4.3",
    "lvl": "Deliverable",
    "name": "Tablet tooling & blister change part development & procurement",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.3.1",
    "lvl": "Activity",
    "name": "Tablet Tooling Procurement",
    "resp": "R&D / Eng",
    "F": 300000,
    "G": 294000,
    "gate": "G3"
  },
  {
    "id": "4.3.2",
    "lvl": "Activity",
    "name": "Blister change parts Procurement",
    "resp": "R&D / Eng",
    "F": 400000,
    "G": 392000,
    "gate": "G3"
  },
  {
    "id": "4.3.3",
    "lvl": "Activity",
    "name": "Capsule shell shade card & Art Work",
    "resp": "R&D / Eng",
    "F": 50000,
    "G": 47000,
    "gate": "G3"
  },
  {
    "id": "4.4",
    "lvl": "Deliverable",
    "name": "Formulation development",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.4.1",
    "lvl": "Activity",
    "name": "Pre-formulation studies - API Characterization including Solubility studies, RS, PSD, XRD etc - Drug-excipient",
    "resp": "R&D",
    "F": 250000,
    "G": 238000,
    "gate": "G3"
  },
  {
    "id": "4.4.2",
    "lvl": "Activity",
    "name": "Development of prototype formulation",
    "resp": "R&D",
    "F": 300000,
    "G": 340000,
    "gate": "G3"
  },
  {
    "id": "4.4.3",
    "lvl": "Activity",
    "name": "Stability loading of prototype formulation",
    "resp": "R&D",
    "F": 150000,
    "G": 158000,
    "gate": "G3"
  },
  {
    "id": "4.4.4",
    "lvl": "Activity",
    "name": "Dissolution mapping with innovator product",
    "resp": "R&D",
    "F": 100000,
    "G": 104000,
    "gate": "G3"
  },
  {
    "id": "4.4.5",
    "lvl": "Activity",
    "name": "Impact of particle size on dissolution",
    "resp": "R&D",
    "F": 80000,
    "G": 74000,
    "gate": "G3"
  },
  {
    "id": "4.4.6",
    "lvl": "Activity",
    "name": "Multimedia dissolution mapping with reference product",
    "resp": "R&D",
    "F": 200000,
    "G": 215000,
    "gate": "G3"
  },
  {
    "id": "4.4.7",
    "lvl": "Activity",
    "name": "Stability loading of final formulation",
    "resp": "R&D",
    "F": 150000,
    "G": 139000,
    "gate": "G3"
  },
  {
    "id": "4.4.8",
    "lvl": "Activity",
    "name": "Process optimization - Lyophilization/TS feasibility/Aseptic process/others",
    "resp": "R&D",
    "F": 400000,
    "G": 393000,
    "gate": "G3"
  },
  {
    "id": "4.4.9",
    "lvl": "Activity",
    "name": "Photo stability/ Thermal cycling/Temperature Excursion study/Preservative efficacy study/Antioxidant Efficacy study/",
    "resp": "R&D",
    "F": 200000,
    "G": 229000,
    "gate": "G3"
  },
  {
    "id": "4.4.10",
    "lvl": "Activity",
    "name": "Head space gas optimization study/gas sensitivity study",
    "resp": "R&D",
    "F": 150000,
    "G": 158000,
    "gate": "G3"
  },
  {
    "id": "4.4.11",
    "lvl": "Activity",
    "name": "Vmax study/Throughput studies",
    "resp": "R&D",
    "F": 150000,
    "G": 155000,
    "gate": "G3"
  },
  {
    "id": "4.4.12",
    "lvl": "Activity",
    "name": "Reverse Engineering of Reference Product (NDDS)",
    "resp": "R&D",
    "F": 500000,
    "G": 532000,
    "gate": "G3"
  },
  {
    "id": "4.4.13",
    "lvl": "Activity",
    "name": "POC for NDDS",
    "resp": "R&D",
    "F": 1000000,
    "G": 1108000,
    "gate": "G3"
  },
  {
    "id": "4.4.14",
    "lvl": "Activity",
    "name": "Hold Time and Compatibility Studies",
    "resp": "R&D",
    "F": 100000,
    "G": 109000,
    "gate": "G3"
  },
  {
    "id": "4.4.15",
    "lvl": "Activity",
    "name": "3M Lab scale stability data generation",
    "resp": "R&D",
    "F": 250000,
    "G": 235000,
    "gate": "G3"
  },
  {
    "id": "4.4.16",
    "lvl": "Activity",
    "name": "Filter Validation study",
    "resp": "R&D",
    "F": 600000,
    "G": 533000,
    "gate": "G3"
  },
  {
    "id": "4.4.17",
    "lvl": "Activity",
    "name": "Optimization/ pre validation of methods",
    "resp": "R&D",
    "F": 200000,
    "G": 193000,
    "gate": "G3"
  },
  {
    "id": "4.4.18",
    "lvl": "Activity",
    "name": "Method development reports",
    "resp": "R&D",
    "F": 30000,
    "G": 29000,
    "gate": "G3"
  },
  {
    "id": "4.4.19",
    "lvl": "Activity",
    "name": "Development Stability Analysis of 6M samples",
    "resp": "R&D",
    "F": 350000,
    "G": 328000,
    "gate": "G3"
  },
  {
    "id": "4.4.20",
    "lvl": "Activity",
    "name": "pH suitability studies",
    "resp": "R&D",
    "F": 75000,
    "G": 85000,
    "gate": "G3"
  },
  {
    "id": "4.4.21",
    "lvl": "Activity",
    "name": "Inuse stability study",
    "resp": "R&D",
    "F": 150000,
    "G": 167000,
    "gate": "G3"
  },
  {
    "id": "4.4.22",
    "lvl": "Activity",
    "name": "Alternative packing material evaluation",
    "resp": "R&D",
    "F": 200000,
    "G": 193000,
    "gate": "G3"
  },
  {
    "id": "4.5",
    "lvl": "Deliverable",
    "name": "Analytical method development",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.5.1",
    "lvl": "Activity",
    "name": "Prototype formulation shall be submitted for method development",
    "resp": "FR&D",
    "F": 10000,
    "G": 11000,
    "gate": "G3"
  },
  {
    "id": "4.5.2",
    "lvl": "Activity",
    "name": "Tentative Specification of FP",
    "resp": "FR&D",
    "F": 25000,
    "G": 25000,
    "gate": "G3"
  },
  {
    "id": "4.5.3",
    "lvl": "Activity",
    "name": "Tentative methods finalization",
    "resp": "FR&D",
    "F": 250000,
    "G": 282000,
    "gate": "G3"
  },
  {
    "id": "4.6",
    "lvl": "Deliverable",
    "name": "Formulation, process and packaging freeze",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G3"
  },
  {
    "id": "4.6.1",
    "lvl": "Activity",
    "name": "Approve formulation, process and packaging freeze",
    "resp": "R&D / QA / Management",
    "F": 50000,
    "G": 52000,
    "gate": "G3"
  },
  {
    "id": "G4",
    "lvl": "Gate",
    "name": "GATE 4: Scale-UP & Pilot BE",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5",
    "lvl": "Stage",
    "name": "Stage 5 (S5): Scale-Up & EB procurement",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.1",
    "lvl": "Deliverable",
    "name": "Procurement submission batches",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.1.1",
    "lvl": "Activity",
    "name": "BOM for RM",
    "resp": "FR&D",
    "F": 20000,
    "G": 20000,
    "gate": "G4"
  },
  {
    "id": "5.1.2",
    "lvl": "Activity",
    "name": "BOM for Consumables",
    "resp": "R&D",
    "F": 20000,
    "G": 19000,
    "gate": "G4"
  },
  {
    "id": "5.1.3",
    "lvl": "Activity",
    "name": "BOM for Miscellaneous (if any)",
    "resp": "R&D",
    "F": 20000,
    "G": 19000,
    "gate": "G4"
  },
  {
    "id": "5.1.4",
    "lvl": "Activity",
    "name": "RM, PM, Consumables, Miscellaneous procurement",
    "resp": "Procurment",
    "F": 3000000,
    "G": 3095000,
    "gate": "G4"
  },
  {
    "id": "5.1.5",
    "lvl": "Activity",
    "name": "Filters & Tubing Procurement",
    "resp": "Procurment",
    "F": 300000,
    "G": 285000,
    "gate": "G4"
  },
  {
    "id": "5.2",
    "lvl": "Deliverable",
    "name": "Release of RM & PM",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.2.1",
    "lvl": "Activity",
    "name": "Release of RM and PM",
    "resp": "ARD",
    "F": 100000,
    "G": 104000,
    "gate": "G4"
  },
  {
    "id": "5.3",
    "lvl": "Deliverable",
    "name": "Scale-up",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.3.1",
    "lvl": "Activity",
    "name": "Scale Up batch Execution",
    "resp": "FR&D",
    "F": 1200000,
    "G": 1347000,
    "gate": "G4"
  },
  {
    "id": "5.3.2",
    "lvl": "Activity",
    "name": "Scale Up batch analysis and Report",
    "resp": "ARD",
    "F": 200000,
    "G": 198000,
    "gate": "G4"
  },
  {
    "id": "5.3.3",
    "lvl": "Activity",
    "name": "Pilot Bio Formulation",
    "resp": "FR&D",
    "F": 800000,
    "G": 751000,
    "gate": "G4"
  },
  {
    "id": "5.4",
    "lvl": "Deliverable",
    "name": "Bioequivalence study requirements",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.4.1",
    "lvl": "Activity",
    "name": "Pilot & Demonstration-Scale Campaign NOC documents submission",
    "resp": "FR&D",
    "F": 30000,
    "G": 34000,
    "gate": "G4"
  },
  {
    "id": "5.4.2",
    "lvl": "Activity",
    "name": "BE study Design & Protocol Finalization",
    "resp": "Clinical / R&D",
    "F": 100000,
    "G": 102000,
    "gate": "G4"
  },
  {
    "id": "5.4.3",
    "lvl": "Activity",
    "name": "BE NOC application filing & Approval",
    "resp": "clinical",
    "F": 150000,
    "G": 136000,
    "gate": "G4"
  },
  {
    "id": "5.4.4",
    "lvl": "Activity",
    "name": "RLD import license - Form 11",
    "resp": "FR&D / Clinical",
    "F": 50000,
    "G": 45000,
    "gate": "G4"
  },
  {
    "id": "5.4.5",
    "lvl": "Activity",
    "name": "Innovator product procurement for Demonstration-Scale Campaign studies",
    "resp": "Procurment",
    "F": 1500000,
    "G": 1364000,
    "gate": "G4"
  },
  {
    "id": "5.4.6",
    "lvl": "Activity",
    "name": "Confirm ethics, CRO and bioanalytical readiness",
    "resp": "Clinical",
    "F": 100000,
    "G": 104000,
    "gate": "G4"
  },
  {
    "id": "5.5",
    "lvl": "Deliverable",
    "name": "Pilot BE (Test & RMP IP's submission and study execution)",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.5.1",
    "lvl": "Activity",
    "name": "Pilot BE (Test & RMP IP's submission and study execution)",
    "resp": "FR&D / Clinical",
    "F": 4500000,
    "G": 4722000,
    "gate": "G4"
  },
  {
    "id": "5.5.2",
    "lvl": "Activity",
    "name": "Review pilot results and approve progression or waiver",
    "resp": "Clinical / R&D / Management",
    "F": 25000,
    "G": 24000,
    "gate": "G4"
  },
  {
    "id": "5.6",
    "lvl": "Deliverable",
    "name": "QBD formulation optimization trials",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.6.1",
    "lvl": "Activity",
    "name": "Optimization of Binder concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 164000,
    "gate": "G4"
  },
  {
    "id": "5.6.2",
    "lvl": "Activity",
    "name": "Optimization of Disintegrant concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 149000,
    "gate": "G4"
  },
  {
    "id": "5.6.3",
    "lvl": "Activity",
    "name": "Optimization of diluent concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 135000,
    "gate": "G4"
  },
  {
    "id": "5.6.4",
    "lvl": "Activity",
    "name": "Optimization of Glidant concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 147000,
    "gate": "G4"
  },
  {
    "id": "5.6.5",
    "lvl": "Activity",
    "name": "Optimization of Lubricant concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 172000,
    "gate": "G4"
  },
  {
    "id": "5.6.6",
    "lvl": "Activity",
    "name": "Optimization of Solubilizer concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 153000,
    "gate": "G4"
  },
  {
    "id": "5.6.7",
    "lvl": "Activity",
    "name": "Optimization of polymer concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 171000,
    "gate": "G4"
  },
  {
    "id": "5.6.8",
    "lvl": "Activity",
    "name": "Optimization of Antioxidant concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 167000,
    "gate": "G4"
  },
  {
    "id": "5.6.9",
    "lvl": "Activity",
    "name": "Optimization of preservative concentration",
    "resp": "FR&D",
    "F": 150000,
    "G": 132000,
    "gate": "G4"
  },
  {
    "id": "5.6.10",
    "lvl": "Activity",
    "name": "Sequence/Order of addition",
    "resp": "FR&D",
    "F": 150000,
    "G": 161000,
    "gate": "G4"
  },
  {
    "id": "5.6.11",
    "lvl": "Activity",
    "name": "Optimization of Terminal sterilization time",
    "resp": "FR&D",
    "F": 250000,
    "G": 266000,
    "gate": "G4"
  },
  {
    "id": "5.6.12",
    "lvl": "Activity",
    "name": "Optimization of Lyophilization cycle",
    "resp": "FR&D",
    "F": 400000,
    "G": 410000,
    "gate": "G4"
  },
  {
    "id": "5.6.13",
    "lvl": "Activity",
    "name": "pH Optimization/suitability study",
    "resp": "FR&D",
    "F": 150000,
    "G": 143000,
    "gate": "G4"
  },
  {
    "id": "5.7",
    "lvl": "Deliverable",
    "name": "QBD trials manufacturing process development",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.7.1",
    "lvl": "Activity",
    "name": "Optimization of Homogenization cycle",
    "resp": "FR&D",
    "F": 200000,
    "G": 211000,
    "gate": "G4"
  },
  {
    "id": "5.7.2",
    "lvl": "Activity",
    "name": "Specific Filtration system including TFF",
    "resp": "FR&D",
    "F": 300000,
    "G": 273000,
    "gate": "G4"
  },
  {
    "id": "5.7.3",
    "lvl": "Activity",
    "name": "Specific activities / processes Optimization related to NDDS",
    "resp": "FR&D",
    "F": 300000,
    "G": 299000,
    "gate": "G4"
  },
  {
    "id": "5.7.4",
    "lvl": "Activity",
    "name": "Optimization of Fluid uptake",
    "resp": "FR&D",
    "F": 200000,
    "G": 201000,
    "gate": "G4"
  },
  {
    "id": "5.7.5",
    "lvl": "Activity",
    "name": "Optimization of Granulation parameters",
    "resp": "FR&D",
    "F": 200000,
    "G": 228000,
    "gate": "G4"
  },
  {
    "id": "5.7.6",
    "lvl": "Activity",
    "name": "Optimization of milling process",
    "resp": "FR&D",
    "F": 200000,
    "G": 223000,
    "gate": "G4"
  },
  {
    "id": "5.7.7",
    "lvl": "Activity",
    "name": "Optimization of Blending time",
    "resp": "FR&D",
    "F": 200000,
    "G": 190000,
    "gate": "G4"
  },
  {
    "id": "5.7.8",
    "lvl": "Activity",
    "name": "Optimization of Coating",
    "resp": "FR&D",
    "F": 250000,
    "G": 254000,
    "gate": "G4"
  },
  {
    "id": "5.8",
    "lvl": "Deliverable",
    "name": "Facility, equipment and process readiness",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G4"
  },
  {
    "id": "5.8.1",
    "lvl": "Activity",
    "name": "Confirm facility, equipment and process readiness",
    "resp": "Operations / Engineering / QA",
    "F": 150000,
    "G": 158000,
    "gate": "G4"
  },
  {
    "id": "G5",
    "lvl": "Gate",
    "name": "GATE 5: API, finished product validations and transfer",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G5"
  },
  {
    "id": "6",
    "lvl": "Stage",
    "name": "Stage 6 (S6): API Validation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G5"
  },
  {
    "id": "6.1",
    "lvl": "Deliverable",
    "name": "Analytical method validation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G5"
  },
  {
    "id": "6.1.1",
    "lvl": "Activity",
    "name": "API Analytical Method Validation",
    "resp": "ARD",
    "F": 400000,
    "G": 371000,
    "gate": "G5"
  },
  {
    "id": "6.2",
    "lvl": "Deliverable",
    "name": "Method transfer and cleaning validation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G5"
  },
  {
    "id": "6.2.1",
    "lvl": "Activity",
    "name": "Method Transfer",
    "resp": "ARD",
    "F": 150000,
    "G": 169000,
    "gate": "G5"
  },
  {
    "id": "6.2.2",
    "lvl": "Activity",
    "name": "Cleaning Validation",
    "resp": "ARD",
    "F": 200000,
    "G": 223000,
    "gate": "G5"
  },
  {
    "id": "7",
    "lvl": "Stage",
    "name": "Stage 7 (S7): FP Validation",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G5"
  },
  {
    "id": "7.1",
    "lvl": "Deliverable",
    "name": "FP method validation, FP specifications and STP",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G5"
  },
  {
    "id": "7.1.1",
    "lvl": "Activity",
    "name": "Submission of FP samples for AMV",
    "resp": "ARD",
    "F": 50000,
    "G": 48000,
    "gate": "G5"
  },
  {
    "id": "7.1.2",
    "lvl": "Activity",
    "name": "FP Analytical Method Validation",
    "resp": "ARD",
    "F": 500000,
    "G": 526000,
    "gate": "G5"
  },
  {
    "id": "G6",
    "lvl": "Gate",
    "name": "GATE 6: TTD release and EB executions",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "8",
    "lvl": "Stage",
    "name": "Stage 8 (S8): TTD Submission",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "8.1",
    "lvl": "Deliverable",
    "name": "Technology transfer documents",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "8.1.1",
    "lvl": "Activity",
    "name": "Title Page",
    "resp": "DQA",
    "F": 15000,
    "G": 16000,
    "gate": "G6"
  },
  {
    "id": "8.1.2",
    "lvl": "Activity",
    "name": "Approval Page",
    "resp": "DQA",
    "F": 15000,
    "G": 14000,
    "gate": "G6"
  },
  {
    "id": "8.1.3",
    "lvl": "Activity",
    "name": "Table of contents",
    "resp": "DQA",
    "F": 15000,
    "G": 16000,
    "gate": "G6"
  },
  {
    "id": "8.1.4",
    "lvl": "Activity",
    "name": "Scope and Scheme",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.5",
    "lvl": "Activity",
    "name": "Test license",
    "resp": "DQA",
    "F": 15000,
    "G": 16000,
    "gate": "G6"
  },
  {
    "id": "8.1.6",
    "lvl": "Activity",
    "name": "Procurement package",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.7",
    "lvl": "Activity",
    "name": "Drug Substance Specifications and Standard Test Procedure",
    "resp": "DQA",
    "F": 15000,
    "G": 13000,
    "gate": "G6"
  },
  {
    "id": "8.1.8",
    "lvl": "Activity",
    "name": "Raw material Specifications and Standard Test Procedure",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.9",
    "lvl": "Activity",
    "name": "Packaging material Specifications and Standard Test Procedure",
    "resp": "DQA",
    "F": 15000,
    "G": 13000,
    "gate": "G6"
  },
  {
    "id": "8.1.10",
    "lvl": "Activity",
    "name": "Finished product Specifications and Standard Test Procedures: In-process; Release and Shelf-life",
    "resp": "DQA",
    "F": 40000,
    "G": 45000,
    "gate": "G6"
  },
  {
    "id": "8.1.11",
    "lvl": "Activity",
    "name": "Master Formula Record",
    "resp": "DQA",
    "F": 30000,
    "G": 34000,
    "gate": "G6"
  },
  {
    "id": "8.1.12",
    "lvl": "Activity",
    "name": "Master Packaging Record",
    "resp": "DQA",
    "F": 25000,
    "G": 28000,
    "gate": "G6"
  },
  {
    "id": "8.1.13",
    "lvl": "Activity",
    "name": "Stability Plan.",
    "resp": "DQA",
    "F": 15000,
    "G": 14000,
    "gate": "G6"
  },
  {
    "id": "8.1.14",
    "lvl": "Activity",
    "name": "Photo stability Plan",
    "resp": "DQA",
    "F": 15000,
    "G": 13000,
    "gate": "G6"
  },
  {
    "id": "8.1.15",
    "lvl": "Activity",
    "name": "Routine stability study plan",
    "resp": "DQA",
    "F": 15000,
    "G": 17000,
    "gate": "G6"
  },
  {
    "id": "8.1.16",
    "lvl": "Activity",
    "name": "In-Use stability plan",
    "resp": "DQA",
    "F": 15000,
    "G": 17000,
    "gate": "G6"
  },
  {
    "id": "8.1.17",
    "lvl": "Activity",
    "name": "XRD-Stability study plan",
    "resp": "DQA",
    "F": 15000,
    "G": 14000,
    "gate": "G6"
  },
  {
    "id": "8.1.18",
    "lvl": "Activity",
    "name": "Deactivation Study Protocol (If applicable)",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.19",
    "lvl": "Activity",
    "name": "Trade Dress Proposal Form [TDPF] (If applicable)",
    "resp": "DQA",
    "F": 15000,
    "G": 13000,
    "gate": "G6"
  },
  {
    "id": "8.1.20",
    "lvl": "Activity",
    "name": "Temperature Excursion",
    "resp": "DQA",
    "F": 15000,
    "G": 16000,
    "gate": "G6"
  },
  {
    "id": "8.1.21",
    "lvl": "Activity",
    "name": "Thermal Cycling Stability plan",
    "resp": "DQA",
    "F": 15000,
    "G": 16000,
    "gate": "G6"
  },
  {
    "id": "8.1.22",
    "lvl": "Activity",
    "name": "Miscellaneous Study protocol",
    "resp": "DQA",
    "F": 15000,
    "G": 14000,
    "gate": "G6"
  },
  {
    "id": "8.1.23",
    "lvl": "Activity",
    "name": "Reconstitution and Admixture study protocol",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.24",
    "lvl": "Activity",
    "name": "Dissolution Protocol (if applicable)",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.25",
    "lvl": "Activity",
    "name": "Filter validation study protocol and Report",
    "resp": "DQA",
    "F": 100000,
    "G": 95000,
    "gate": "G6"
  },
  {
    "id": "8.1.26",
    "lvl": "Activity",
    "name": "CPP &CQA",
    "resp": "DQA",
    "F": 30000,
    "G": 33000,
    "gate": "G6"
  },
  {
    "id": "8.1.27",
    "lvl": "Activity",
    "name": "Tool Drawings",
    "resp": "DQA",
    "F": 20000,
    "G": 20000,
    "gate": "G6"
  },
  {
    "id": "8.1.28",
    "lvl": "Activity",
    "name": "Packaging material development report (if applicable)",
    "resp": "DQA",
    "F": 15000,
    "G": 14000,
    "gate": "G6"
  },
  {
    "id": "8.1.29",
    "lvl": "Activity",
    "name": "Material Safety Data Sheet",
    "resp": "DQA",
    "F": 15000,
    "G": 15000,
    "gate": "G6"
  },
  {
    "id": "8.1.30",
    "lvl": "Activity",
    "name": "Consumables",
    "resp": "DQA",
    "F": 15000,
    "G": 16000,
    "gate": "G6"
  },
  {
    "id": "8.1.31",
    "lvl": "Activity",
    "name": "Change History",
    "resp": "DQA",
    "F": 15000,
    "G": 14000,
    "gate": "G6"
  },
  {
    "id": "8.2",
    "lvl": "Deliverable",
    "name": "Technology transfer acceptance",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "8.2.1",
    "lvl": "Activity",
    "name": "Obtain receiving-site acceptance of technology transfer",
    "resp": "Operations / QA",
    "F": 25000,
    "G": 26000,
    "gate": "G6"
  },
  {
    "id": "9",
    "lvl": "Stage",
    "name": "Stage 9 (S9): Exhibit Batches",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "9.1",
    "lvl": "Deliverable",
    "name": "Exhibit batch readiness and execution",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "9.1.1",
    "lvl": "Activity",
    "name": "Final Specifications preparation & Approval - Raw materials",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 39000,
    "gate": "G6"
  },
  {
    "id": "9.1.2",
    "lvl": "Activity",
    "name": "Final Specifications preparation & Approval - Packaging materials",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 46000,
    "gate": "G6"
  },
  {
    "id": "9.1.3",
    "lvl": "Activity",
    "name": "Final Specifications preparation & Approval - Finished product",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 42000,
    "gate": "G6"
  },
  {
    "id": "9.1.4",
    "lvl": "Activity",
    "name": "Routine stability protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 40000,
    "gate": "G6"
  },
  {
    "id": "9.1.5",
    "lvl": "Activity",
    "name": "In-Use Stability protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 41000,
    "gate": "G6"
  },
  {
    "id": "9.1.6",
    "lvl": "Activity",
    "name": "Photo stability protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 37000,
    "gate": "G6"
  },
  {
    "id": "9.1.7",
    "lvl": "Activity",
    "name": "Polymorphic stability protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 38000,
    "gate": "G6"
  },
  {
    "id": "9.1.8",
    "lvl": "Activity",
    "name": "Dissolution studies protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 39000,
    "gate": "G6"
  },
  {
    "id": "9.1.9",
    "lvl": "Activity",
    "name": "Sub division of tablets study protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 42000,
    "gate": "G6"
  },
  {
    "id": "9.1.10",
    "lvl": "Activity",
    "name": "Thermal cycling / Freeze thaw study protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 38000,
    "gate": "G6"
  },
  {
    "id": "9.1.11",
    "lvl": "Activity",
    "name": "Reconstitution and dilution studies protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 38000,
    "gate": "G6"
  },
  {
    "id": "9.1.12",
    "lvl": "Activity",
    "name": "Preparation & approval of Process validation Protocols",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 60000,
    "G": 54000,
    "gate": "G6"
  },
  {
    "id": "9.1.13",
    "lvl": "Activity",
    "name": "Preparation & approval of Hold time study Protocols",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 42000,
    "gate": "G6"
  },
  {
    "id": "9.1.14",
    "lvl": "Activity",
    "name": "Preparation & Approval of BMRs",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 50000,
    "G": 47000,
    "gate": "G6"
  },
  {
    "id": "9.1.15",
    "lvl": "Activity",
    "name": "Preparation & Approval of BPRs",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 45000,
    "gate": "G6"
  },
  {
    "id": "9.1.16",
    "lvl": "Activity",
    "name": "Process Order Creation as per BMR",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 5000,
    "G": 6000,
    "gate": "G6"
  },
  {
    "id": "9.1.17",
    "lvl": "Activity",
    "name": "Process Order Creation as per BPR",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 5000,
    "G": 4000,
    "gate": "G6"
  },
  {
    "id": "9.1.18",
    "lvl": "Activity",
    "name": "Exhibit batch Execution: 3 Batches",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 5500000,
    "G": 5193000,
    "gate": "G6"
  },
  {
    "id": "9.1.19",
    "lvl": "Activity",
    "name": "Exhibit batch Release: 3 Batches",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 400000,
    "G": 424000,
    "gate": "G6"
  },
  {
    "id": "9.1.20",
    "lvl": "Activity",
    "name": "Batch execution data posting as BMR",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 5000,
    "G": 5000,
    "gate": "G6"
  },
  {
    "id": "9.1.21",
    "lvl": "Activity",
    "name": "Alcohol dose dumping study protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 37000,
    "gate": "G6"
  },
  {
    "id": "9.1.22",
    "lvl": "Activity",
    "name": "Thermal excursion study protocol",
    "resp": "QC/QA/Operation/R&D/RA",
    "F": 40000,
    "G": 45000,
    "gate": "G6"
  },
  {
    "id": "9.2",
    "lvl": "Deliverable",
    "name": "Data generation on EB batches",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "9.2.1",
    "lvl": "Activity",
    "name": "Reconstitution and Dilution Studies execution on submission Batches",
    "resp": "QC/QA",
    "F": 200000,
    "G": 207000,
    "gate": "G6"
  },
  {
    "id": "9.2.2",
    "lvl": "Activity",
    "name": "Multimedia dissolution profile execution both test and reference products and Comparative dissolution Report",
    "resp": "QC/QA",
    "F": 300000,
    "G": 302000,
    "gate": "G6"
  },
  {
    "id": "9.2.3",
    "lvl": "Activity",
    "name": "pH Solubility Profile to support BCS biowaiver",
    "resp": "QC/QA",
    "F": 150000,
    "G": 164000,
    "gate": "G6"
  },
  {
    "id": "9.2.4",
    "lvl": "Activity",
    "name": "6M stability data availability - Accelerated, Long term, Intermediate",
    "resp": "QC/QA",
    "F": 800000,
    "G": 878000,
    "gate": "G6"
  },
  {
    "id": "9.2.5",
    "lvl": "Activity",
    "name": "In-use stability, photo stability, freeze-thaw study, Temperature excursions,Polymorphic stability etc.",
    "resp": "QC/QA",
    "F": 400000,
    "G": 373000,
    "gate": "G6"
  },
  {
    "id": "9.2.6",
    "lvl": "Activity",
    "name": "Alcohol dose dumping dissolution profile execution both test and reference products and Comparative dissolution Report",
    "resp": "QC/QA",
    "F": 250000,
    "G": 227000,
    "gate": "G6"
  },
  {
    "id": "9.2.7",
    "lvl": "Activity",
    "name": "Admixture study report",
    "resp": "QC/QA",
    "F": 150000,
    "G": 149000,
    "gate": "G6"
  },
  {
    "id": "9.2.8",
    "lvl": "Activity",
    "name": "NG tube study report",
    "resp": "QC/QA",
    "F": 150000,
    "G": 149000,
    "gate": "G6"
  },
  {
    "id": "9.2.9",
    "lvl": "Activity",
    "name": "In-use study report",
    "resp": "QC/QA",
    "F": 50000,
    "G": 50000,
    "gate": "G6"
  },
  {
    "id": "9.3",
    "lvl": "Deliverable",
    "name": "Exhibit batch stability",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G6"
  },
  {
    "id": "9.3.1",
    "lvl": "Activity",
    "name": "Load exhibit stability samples and record time zero",
    "resp": "QC / QA",
    "F": 50000,
    "G": 47000,
    "gate": "G6"
  },
  {
    "id": "9.3.2",
    "lvl": "Activity",
    "name": "Approve initial stability dataset for dossier drafting",
    "resp": "QA / RA",
    "F": 20000,
    "G": 21000,
    "gate": "G6"
  },
  {
    "id": "G7",
    "lvl": "Gate",
    "name": "GATE 7: Commercial production readiness approval",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G7"
  },
  {
    "id": "10",
    "lvl": "Stage",
    "name": "Stage 10 (S10): Demonstration-Scale Campaign",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G7"
  },
  {
    "id": "10.1",
    "lvl": "Deliverable",
    "name": "Demonstration-Scale Campaign studies",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G7"
  },
  {
    "id": "10.1.1",
    "lvl": "Activity",
    "name": "RMP & Test product IP submission",
    "resp": "Clinical / R&D",
    "F": 100000,
    "G": 108000,
    "gate": "G7"
  },
  {
    "id": "10.1.2",
    "lvl": "Activity",
    "name": "Demonstration-Scale Campaign execution & Report Submission",
    "resp": "Clinical",
    "F": 12000000,
    "G": 12742000,
    "gate": "G7"
  },
  {
    "id": "11",
    "lvl": "Stage",
    "name": "Stage 11 (S11): Dossier Filing",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G7"
  },
  {
    "id": "11.1",
    "lvl": "Deliverable",
    "name": "Product development report",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G7"
  },
  {
    "id": "11.1.1",
    "lvl": "Activity",
    "name": "Product Development Report (PDR)",
    "resp": "fR&D",
    "F": 200000,
    "G": 229000,
    "gate": "G7"
  },
  {
    "id": "11.1.2",
    "lvl": "Activity",
    "name": "Risk assessment reports like Elemental Impurities, Nitrosamines, Residual Solvents etc.",
    "resp": "R&D",
    "F": 300000,
    "G": 272000,
    "gate": "G7"
  },
  {
    "id": "11.2",
    "lvl": "Deliverable",
    "name": "Dossier filing",
    "resp": "",
    "F": 0,
    "G": 0,
    "gate": "G7"
  },
  {
    "id": "11.2.1",
    "lvl": "Activity",
    "name": "Uploading of stability data of protocol bound batches in common folder",
    "resp": "QA",
    "F": 20000,
    "G": 20000,
    "gate": "G7"
  },
  {
    "id": "11.2.2",
    "lvl": "Activity",
    "name": "Draft dossier preparation with 3M stability data",
    "resp": "RA",
    "F": 600000,
    "G": 583000,
    "gate": "G7"
  },
  {
    "id": "11.2.3",
    "lvl": "Activity",
    "name": "Dossier submission strategy note",
    "resp": "RA",
    "F": 40000,
    "G": 45000,
    "gate": "G7"
  },
  {
    "id": "11.2.4",
    "lvl": "Activity",
    "name": "Approve final dossier evidence and country compliance",
    "resp": "RA / QA",
    "F": 75000,
    "G": 79000,
    "gate": "G7"
  },
  {
    "id": "11.2.5",
    "lvl": "Activity",
    "name": "Submit dossier and record acknowledgement",
    "resp": "RA",
    "F": 100000,
    "G": 100000,
    "gate": "G7"
  }
];

export const INITIAL_RATE_CARDS: RateCard[] = [
  {
    "fn": "P R&D",
    "res": "Principal Sceintist",
    "ac": 250000,
    "tpl": 1
  },
  {
    "fn": "P R&D",
    "res": "Scientist",
    "ac": 175000,
    "tpl": 1
  },
  {
    "fn": "P R&D",
    "res": "Assoiates",
    "ac": 120000,
    "tpl": 1
  },
  {
    "fn": "AR&D",
    "res": "Principal Sceintist",
    "ac": 250000,
    "tpl": 1
  },
  {
    "fn": "AR&D",
    "res": "Scientist",
    "ac": 175000,
    "tpl": 1
  },
  {
    "fn": "AR&D",
    "res": "Assoiates",
    "ac": 120000,
    "tpl": 1
  },
  {
    "fn": "PMO",
    "res": "Project Manager",
    "ac": 220000,
    "tpl": 0
  },
  {
    "fn": "PMO",
    "res": "Project Executive",
    "ac": 110000,
    "tpl": 0
  },
  {
    "fn": "Finance",
    "res": "Finance Manager",
    "ac": 200000,
    "tpl": 0
  },
  {
    "fn": "Finance",
    "res": "Finance Analyst",
    "ac": 110000,
    "tpl": 0
  },
  {
    "fn": "RA",
    "res": "RA Manager",
    "ac": 220000,
    "tpl": 0
  },
  {
    "fn": "RA",
    "res": "RA Executive",
    "ac": 120000,
    "tpl": 0
  },
  {
    "fn": "Clinical",
    "res": "Clinical Manager",
    "ac": 230000,
    "tpl": 0
  },
  {
    "fn": "Clinical",
    "res": "Clinical Associate",
    "ac": 120000,
    "tpl": 0
  },
  {
    "fn": "Procurement",
    "res": "Purchase Manager",
    "ac": 180000,
    "tpl": 0
  },
  {
    "fn": "Procurement",
    "res": "Purchase Executive",
    "ac": 100000,
    "tpl": 0
  },
  {
    "fn": "QA / QC",
    "res": "QA Manager",
    "ac": 200000,
    "tpl": 0
  },
  {
    "fn": "QA / QC",
    "res": "QA Executive",
    "ac": 110000,
    "tpl": 0
  },
  {
    "fn": "Operations",
    "res": "Production Manager",
    "ac": 200000,
    "tpl": 0
  },
  {
    "fn": "Operations",
    "res": "Production Executive",
    "ac": 100000,
    "tpl": 0
  },
  {
    "fn": "IP",
    "res": "IP Manager",
    "ac": 220000,
    "tpl": 0
  },
  {
    "fn": "IP",
    "res": "IP Analyst",
    "ac": 120000,
    "tpl": 0
  },
  {
    "fn": "Management",
    "res": "Steering Committee",
    "ac": 400000,
    "tpl": 0
  }
];

export const HOURS_PER_MONTH: number = 118.99999999999999;

export const INITIAL_MANPOWER: ManpowerAllocation[] = [
  {
    "w": "4.4.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.3125,
    "cyc": 20,
    "acyc": 22,
    "tpl": 1
  },
  {
    "w": "4.4.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.625,
    "cyc": 20,
    "acyc": 20,
    "tpl": 1
  },
  {
    "w": "4.4.2",
    "rc": 2,
    "hc": 3,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 20,
    "acyc": 19,
    "tpl": 1
  },
  {
    "w": "4.5.3",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4375,
    "cyc": 20,
    "acyc": 21,
    "tpl": 1
  },
  {
    "w": "4.5.3",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 20,
    "acyc": 23,
    "tpl": 1
  },
  {
    "w": "4.5.3",
    "rc": 5,
    "hc": 6,
    "hpd": 8,
    "occ": 0.875,
    "cyc": 20,
    "acyc": 18,
    "tpl": 1
  },
  {
    "w": "1.1.1",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "1.1.1",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "1.1.2",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "1.1.2",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "1.1.3",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "1.1.3",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "1.1.4",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "1.1.4",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "1.1.5",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "1.1.5",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "1.2.1",
    "rc": 8,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "1.2.1",
    "rc": 9,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "1.2.2",
    "rc": 8,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "1.2.2",
    "rc": 9,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "1.3.1",
    "rc": 22,
    "hc": 1,
    "hpd": 8,
    "occ": 0.25,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.2",
    "rc": 10,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.2",
    "rc": 11,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.3",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.3",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.1.4",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.1.4",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.2.1",
    "rc": 20,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "2.2.1",
    "rc": 21,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 10,
    "acyc": 11,
    "tpl": 0
  },
  {
    "w": "2.2.2",
    "rc": 20,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.2.2",
    "rc": 21,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "2.2.3",
    "rc": 20,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "2.2.3",
    "rc": 21,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "2.3.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.3.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.3.2",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.3.2",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "2.4.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.4.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.4.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.4.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.4.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.4.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.4.4",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.4.4",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.5.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.5.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.5.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.5.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.5.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.5.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.6.1",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.6.1",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.6.2",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.6.2",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.6.3",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.6.3",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "2.7.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.7.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.7.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.7.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.7.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.7.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "2.8.1",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.8.1",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.8.2",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "2.8.2",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "2.9.1",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "2.9.1",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "3.1.8",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "3.1.8",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "3.1.9",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "3.1.9",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "3.1.10",
    "rc": 14,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "3.1.10",
    "rc": 15,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.1.1",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.1.1",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.1.2",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.1.2",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.1.3",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.1.3",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.1.4",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.1.4",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.2.1",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.2.1",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.2.2",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.2.2",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.2.3",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.2.3",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.3.1",
    "rc": 18,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 7,
    "acyc": 8,
    "tpl": 0
  },
  {
    "w": "4.3.1",
    "rc": 19,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 14,
    "acyc": 16,
    "tpl": 0
  },
  {
    "w": "4.3.2",
    "rc": 18,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 9,
    "acyc": 10,
    "tpl": 0
  },
  {
    "w": "4.3.2",
    "rc": 19,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 18,
    "acyc": 18,
    "tpl": 0
  },
  {
    "w": "4.3.3",
    "rc": 18,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.3.3",
    "rc": 19,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.4.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "4.4.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "4.4.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.4",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.4.4",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.5",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.4.5",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.4.6",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.6",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "4.4.7",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.7",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.8",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 7,
    "acyc": 7,
    "tpl": 0
  },
  {
    "w": "4.4.8",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 10,
    "acyc": 9,
    "tpl": 0
  },
  {
    "w": "4.4.9",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.9",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "4.4.10",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.10",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.11",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.11",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.12",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 9,
    "acyc": 9,
    "tpl": 0
  },
  {
    "w": "4.4.12",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 13,
    "acyc": 14,
    "tpl": 0
  },
  {
    "w": "4.4.13",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 18,
    "acyc": 18,
    "tpl": 0
  },
  {
    "w": "4.4.13",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 26,
    "acyc": 23,
    "tpl": 0
  },
  {
    "w": "4.4.14",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.4.14",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.15",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.15",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 6,
    "tpl": 0
  },
  {
    "w": "4.4.16",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 11,
    "acyc": 11,
    "tpl": 0
  },
  {
    "w": "4.4.16",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 15,
    "acyc": 13,
    "tpl": 0
  },
  {
    "w": "4.4.17",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.17",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.18",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.4.18",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.4.19",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 6,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "4.4.19",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 9,
    "acyc": 10,
    "tpl": 0
  },
  {
    "w": "4.4.20",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.4.20",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "4.4.21",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "4.4.21",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.22",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "4.4.22",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "4.5.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.5.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.5.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.5.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.6.1",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "4.6.1",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "5.1.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.1.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.1.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.1.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.1.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.1.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.2.1",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "5.2.1",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.3.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 7,
    "acyc": 6,
    "tpl": 0
  },
  {
    "w": "5.3.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 11,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.3.2",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.3.2",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.3.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 15,
    "acyc": 15,
    "tpl": 0
  },
  {
    "w": "5.3.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 21,
    "acyc": 19,
    "tpl": 0
  },
  {
    "w": "5.4.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.4.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.4.2",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.4.2",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.4.3",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.4.3",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 6,
    "tpl": 0
  },
  {
    "w": "5.4.4",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.4.4",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 2,
    "tpl": 0
  },
  {
    "w": "5.4.6",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.4.6",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.5.1",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 31,
    "acyc": 33,
    "tpl": 0
  },
  {
    "w": "5.5.1",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 58,
    "acyc": 57,
    "tpl": 0
  },
  {
    "w": "5.5.2",
    "rc": 6,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 1,
    "tpl": 0
  },
  {
    "w": "5.5.2",
    "rc": 7,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.6.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.6.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.6.4",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.4",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.6.5",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.6.5",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.6",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.6.6",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.6.7",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.6.7",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.6.8",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.8",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.6.9",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.6.9",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.10",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.10",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.11",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "5.6.11",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "5.6.12",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 7,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.12",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 10,
    "acyc": 10,
    "tpl": 0
  },
  {
    "w": "5.6.13",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.6.13",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.7.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 8,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.3",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 5,
    "tpl": 0
  },
  {
    "w": "5.7.3",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 8,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.4",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.7.4",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.5",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.7.5",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.6",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.7.6",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.7",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 4,
    "tpl": 0
  },
  {
    "w": "5.7.7",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.8",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.7.8",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "5.8.1",
    "rc": 18,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 3,
    "tpl": 0
  },
  {
    "w": "5.8.1",
    "rc": 19,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 7,
    "acyc": 8,
    "tpl": 0
  },
  {
    "w": "6.1.1",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 7,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "6.1.1",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 10,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "6.2.1",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "6.2.1",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "6.2.2",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "6.2.2",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "7.1.1",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "7.1.1",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "7.1.2",
    "rc": 3,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 9,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "7.1.2",
    "rc": 4,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 13,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.1",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.1",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.2",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.2",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.3",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.3",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.4",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.4",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.5",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.5",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.6",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.6",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.7",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.7",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.8",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.8",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.9",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.9",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.10",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.10",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.11",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.11",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.12",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.12",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.13",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.13",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.14",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.14",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.15",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.15",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.16",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.16",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.17",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.17",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.18",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.18",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.19",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.19",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.20",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.20",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.21",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.21",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.22",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.22",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.23",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.23",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.24",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.24",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.25",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.25",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 7,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.26",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.26",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.27",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.27",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.28",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.28",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.29",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.29",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.30",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.30",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.31",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.1.31",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.2.1",
    "rc": 18,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "8.2.1",
    "rc": 19,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.1",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.1",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.2",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.2",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.3",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.3",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.4",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.4",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.5",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.5",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.6",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.6",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.7",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.7",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.8",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.8",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.9",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.9",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.10",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.10",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.11",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.11",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.12",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.12",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.13",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.13",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.14",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.14",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.15",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.15",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.16",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.16",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.17",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.17",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.18",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 43,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.18",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 77,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.19",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 16,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.19",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 28,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.20",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.20",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.21",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.21",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.22",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.1.22",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.1",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.1",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 8,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.2",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 7,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.2",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 12,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.3",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.3",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.4",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 18,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.4",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 33,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.5",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 9,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.5",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 16,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.6",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.6",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 10,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.7",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.7",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.8",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.8",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.9",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.2.9",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.3.1",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 2,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.3.1",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.3.2",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "9.3.2",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "10.1.1",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "10.1.1",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "10.1.2",
    "rc": 12,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 81,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "10.1.2",
    "rc": 13,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 155,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.1.1",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.1.1",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 9,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.1.2",
    "rc": 0,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 9,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.1.2",
    "rc": 1,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 13,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.1",
    "rc": 16,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.1",
    "rc": 17,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.2",
    "rc": 10,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 21,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.2",
    "rc": 11,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 39,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.3",
    "rc": 10,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 1,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.3",
    "rc": 11,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.4",
    "rc": 10,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 3,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.4",
    "rc": 11,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 5,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.5",
    "rc": 10,
    "hc": 1,
    "hpd": 8,
    "occ": 0.4,
    "cyc": 4,
    "acyc": 0,
    "tpl": 0
  },
  {
    "w": "11.2.5",
    "rc": 11,
    "hc": 1,
    "hpd": 8,
    "occ": 0.75,
    "cyc": 6,
    "acyc": 0,
    "tpl": 0
  }
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    "cat": "API",
    "code": 10000435,
    "d": "Amphotericin B",
    "uom": "Kg",
    "price": 2755000,
    "pq": 0.5,
    "cyc": 20,
    "inq": 62.5,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 62.5,
    "inq3": 62.5,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.1",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100277,
    "d": "Hydrogenated soy phosphatidylcholine",
    "uom": "Kg",
    "price": 89460,
    "pq": 2,
    "cyc": 20,
    "inq": 234.3,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 234.3,
    "inq3": 234.3,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100278,
    "d": "Distearoyl phosphatidyl glycerol sodium",
    "uom": "Kg",
    "price": 703800,
    "pq": 2,
    "cyc": 20,
    "inq": 92.4,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 92.4,
    "inq3": 92.4,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100495,
    "d": "Cholesterol",
    "uom": "Kg",
    "price": 612000,
    "pq": 3,
    "cyc": 20,
    "inq": 56.16,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 56.16,
    "inq3": 56.16,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100519,
    "d": "DL-alpha-tocopherol*",
    "uom": "Kg",
    "price": 51520,
    "pq": 4,
    "cyc": 20,
    "inq": 0.832,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 0.832,
    "inq3": 0.832,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100501,
    "d": "Sucrose",
    "uom": "Kg",
    "price": 15005,
    "pq": 5,
    "cyc": 20,
    "inq": 900,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 900,
    "inq3": 900,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100282,
    "d": "Disodium succinate hexahydrate",
    "uom": "Kg",
    "price": 145843,
    "pq": 1,
    "cyc": 20,
    "inq": 27,
    "inu": "mg",
    "cf": 1000000,
    "dbs": 200,
    "inq2": 27,
    "inq3": 27,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100496,
    "d": "Methanol",
    "uom": "Ltr",
    "price": 5000,
    "pq": 50,
    "cyc": 20,
    "inq": 2.5,
    "inu": "ml",
    "cf": 1000,
    "dbs": 200,
    "inq2": 2.5,
    "inq3": 2.5,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100038,
    "d": "sodium hydroxide",
    "uom": "Kg",
    "price": 5331.2,
    "pq": 10,
    "cyc": 20,
    "inq": 0.16,
    "inu": "KG",
    "cf": 1,
    "dbs": 200,
    "inq2": 0.16,
    "inq3": 0.16,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100487,
    "d": "Chloroform",
    "uom": "Ltr",
    "price": 2031.05,
    "pq": 10,
    "cyc": 20,
    "inq": 2.5,
    "inu": "ml",
    "cf": 1000,
    "dbs": 200,
    "inq2": 2.5,
    "inq3": 2.5,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Excepient",
    "code": 10100496,
    "d": "Hydrochloric acid",
    "uom": "Ltr",
    "price": 5000,
    "pq": 10,
    "cyc": 20,
    "inq": 0.14,
    "inu": "Ltr",
    "cf": 1000,
    "dbs": 200,
    "inq2": 0.14,
    "inq3": 0.14,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 0,
    "wdev": "3.1.3",
    "wsu": "5.1.4"
  },
  {
    "cat": "Primary packing",
    "code": 10200696,
    "d": "25 ml, 20 mm clear tubular type 1, flat bottom glass vial",
    "uom": "No.",
    "price": 7,
    "pq": 100,
    "cyc": 20,
    "inq": 1,
    "inu": "NOS",
    "cf": 1,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Primary packing",
    "code": 10200485,
    "d": "20 mm double slotted grey bromobutyl RTU rubber stopper",
    "uom": "No.",
    "price": 10.3,
    "pq": 100,
    "cyc": 20,
    "inq": 1,
    "inu": "NOS",
    "cf": 1,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Secondary Packing",
    "code": 10201019,
    "d": "20 mm sky blue aluminium flipoff seal",
    "uom": "No.",
    "price": 0.51,
    "pq": 10,
    "cyc": 20,
    "inq": 1,
    "inu": "NOS",
    "cf": 1,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Tertiary Packing",
    "code": 10503876,
    "d": "Versapor membrane 5µ, 25 mm sterile (Code: 6094184)",
    "uom": "No.",
    "price": 185,
    "pq": 1,
    "cyc": null,
    "inq": 1,
    "inu": "NOS",
    "cf": 1,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Tertiary Packing",
    "code": 10302760,
    "d": "Amphotericin B liposomal- Insert",
    "uom": "No.",
    "price": 2.88,
    "pq": 1,
    "cyc": null,
    "inq": 1,
    "inu": "NOS",
    "cf": 1,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Tertiary Packing",
    "code": 10302759,
    "d": "Amphotericin B liposomal 50mg- Printed carton",
    "uom": "No.",
    "price": 2.88,
    "pq": 1,
    "cyc": null,
    "inq": 1,
    "inu": "NOS",
    "cf": 27,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Tertiary Packing",
    "code": 10400191,
    "d": "E-flute Inner carton (285x285x95 mm (ID))",
    "uom": "No.",
    "price": 27,
    "pq": 1,
    "cyc": null,
    "inq": 1,
    "inu": "NOS",
    "cf": 27,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Tertiary Packing",
    "code": 10400193,
    "d": "7 ply Outer shipper (580x290x225 mm (ID))",
    "uom": "No.",
    "price": 94,
    "pq": 1,
    "cyc": null,
    "inq": 1,
    "inu": "NOS",
    "cf": 100,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 0,
    "firstAlt": 1,
    "wdev": "3.1.5",
    "wsu": "5.1.4"
  },
  {
    "cat": "Consumables",
    "code": 10706435,
    "d": "Imapure platinum cured silicone tubing – 5 mm ID X 11mm ODCatalogue Number: 901-128-60",
    "uom": "Mtrs",
    "price": 294,
    "pq": 10,
    "cyc": null,
    "inq": 30,
    "inu": "Mtrs",
    "cf": 200,
    "dbs": 200,
    "inq2": 30,
    "inq3": 30,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 1,
    "firstAlt": 0,
    "wdev": "3.1.4",
    "wsu": "5.1.5"
  },
  {
    "cat": "Consumables",
    "code": 10706658,
    "d": "Imapure platinum cured silicone tubing- 8mm ID X14 mm OD Catalogue number: 901-142-60",
    "uom": "Mtrs",
    "price": 495,
    "pq": 10,
    "cyc": null,
    "inq": 15,
    "inu": "Mtrs",
    "cf": 200,
    "dbs": 200,
    "inq2": 15,
    "inq3": 15,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 1,
    "firstAlt": 0,
    "wdev": "3.1.4",
    "wsu": "5.1.5"
  },
  {
    "cat": "Consumables",
    "code": 10707594,
    "d": "Imapure platinum cured silicone tubing- 12mm ID X 18 mm OD Catalogue number: 901-152-60",
    "uom": "Mtrs",
    "price": 552.5,
    "pq": 10,
    "cyc": null,
    "inq": 2.5,
    "inu": "Mtrs",
    "cf": 200,
    "dbs": 200,
    "inq2": 2.5,
    "inq3": 2.5,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 1,
    "firstAlt": 0,
    "wdev": "3.1.4",
    "wsu": "5.1.5"
  },
  {
    "cat": "Filters",
    "code": 10709248,
    "d": "mdi AseptiCap Nano PES Membrane Capsule Filter (Type: LKN) - SIze: 30\"",
    "uom": "No's",
    "price": 104500,
    "pq": 2,
    "cyc": null,
    "inq": 2,
    "inu": "NOS",
    "cf": 200,
    "dbs": 200,
    "inq2": 2,
    "inq3": 2,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 1,
    "firstAlt": 0,
    "wdev": "3.1.4",
    "wsu": "5.1.5"
  },
  {
    "cat": "Filters",
    "code": 10710326,
    "d": "mdi AseptiCap Nano PES Membrane Capsule Filter (Type: LKN) - SIze: 20\"",
    "uom": "No's",
    "price": 87400,
    "pq": 1,
    "cyc": 25,
    "inq": 1,
    "inu": "NOS",
    "cf": 200,
    "dbs": 200,
    "inq2": 1,
    "inq3": 1,
    "sbs": 2000,
    "ebs": 2000,
    "flat": 1,
    "firstAlt": 0,
    "wdev": "3.1.4",
    "wsu": "5.1.5"
  }
];

export const INITIAL_CAPEX: CapexItem[] = [
  {
    "sl": 1,
    "d": "homogenizer machine",
    "no": 1,
    "ven": "IKA",
    "usd": 5997.06806282723,
    "fx": 95.5,
    "asset": 1710000317,
    "w": "4.4.8"
  },
  {
    "sl": 2,
    "d": "High pressure homogenizer machine",
    "no": 1,
    "ven": "Avastin Canada",
    "usd": 334561.627539267,
    "fx": 95.5,
    "asset": 1730000475,
    "w": "4.4.8"
  },
  {
    "sl": 3,
    "d": "Rotavapor 50 ltrs",
    "no": 1,
    "ven": "Adithya ",
    "usd": 25942.4083769634,
    "fx": 95.5,
    "asset": 1710000694,
    "w": "4.4.8"
  },
  {
    "sl": 4,
    "d": "150 ltrs Bio Spec Tank",
    "no": 1,
    "ven": "Bio Spek",
    "usd": 44740.0209424084,
    "fx": 95.5,
    "asset": 1710000710,
    "w": "4.4.8"
  },
  {
    "sl": 5,
    "d": "100 ltrs Filter Connection tank",
    "no": 1,
    "ven": "Bio Spek",
    "usd": 35636.3979057592,
    "fx": 95.5,
    "asset": 1710000710,
    "w": "4.4.8"
  },
  {
    "sl": 6,
    "d": "PH Meter",
    "no": 1,
    "ven": "Thermo",
    "usd": 759.916230366492,
    "fx": 95.5,
    "asset": 1720015826,
    "w": "4.4.20"
  },
  {
    "sl": 7,
    "d": "ESP4- Dissolution operation",
    "no": 1,
    "ven": "sotax",
    "usd": 131098.12565445,
    "fx": 95.5,
    "asset": 1730000324,
    "w": "4.4.6"
  },
  {
    "sl": 8,
    "d": "Consumables ",
    "no": null,
    "ven": null,
    "usd": null,
    "fx": 95.5,
    "asset": null,
    "w": null
  }
];

export const INITIAL_RLD_DATA: RldData = {
  "rows": [
    {
      "k": "h",
      "b": "RLD - R&D & QC ( JODAS COST )"
    },
    {
      "k": "b",
      "b": "Batch A",
      "c": 352,
      "d": "USD",
      "e": 475,
      "g": 96.5,
      "w": "3.1.2"
    },
    {
      "k": "b",
      "b": "Batch B",
      "c": 535,
      "d": "USD",
      "e": 475,
      "g": 96.5,
      "w": "3.1.2"
    },
    {
      "k": "b",
      "b": "Batch C",
      "c": 510,
      "d": "USD",
      "e": 377,
      "g": 96.5,
      "w": "3.1.2"
    },
    {
      "k": "fr",
      "b": "Freight ",
      "f": 2000,
      "g": 96.5,
      "w": "3.1.2"
    },
    {
      "k": "du",
      "b": "Customs Duty (7.5%+ 10% on 7.5%",
      "g": 96.5,
      "w": "3.1.2"
    },
    {
      "k": "gap"
    },
    {
      "k": "t1",
      "b": "R&D and QC = Total "
    },
    {
      "k": "gap"
    },
    {
      "k": "be",
      "b": "BA- BE study",
      "c": 480,
      "d": "USD",
      "e": 377,
      "g": 96.5
    },
    {
      "k": "bf",
      "b": "Freight charges",
      "f": 600,
      "h": 83.5
    },
    {
      "k": "bd",
      "b": "Customs Duty (7.5%+ 10% on 7.5%"
    },
    {
      "k": "bt",
      "b": "Total",
      "g": 96.5,
      "w": "5.4.5"
    },
    {
      "k": "gap"
    },
    {
      "k": "gt",
      "b": "Total"
    },
    {
      "k": "gap"
    },
    {
      "k": "ag",
      "b": "Agreement Value for Amphotericin B by MRJ to JODAS",
      "h": 650000
    },
    {
      "k": "ag",
      "b": "35% of Ist Mile Stone ",
      "e": 0.35,
      "hf": "m35"
    },
    {
      "k": "ag",
      "b": "Batch A Qty",
      "c": "Qty",
      "e": 352,
      "hf": "FA"
    },
    {
      "k": "ag",
      "b": "Batch B Qty",
      "e": 535,
      "hf": "FB"
    },
    {
      "k": "ag",
      "b": "Batch C ty",
      "e": 510,
      "hf": "FC"
    },
    {
      "k": "ag",
      "b": "Total ",
      "ef": "sumE",
      "hf": "sumH"
    },
    {
      "k": "ag",
      "b": "Net Cost to Jodas ",
      "hf": "net"
    },
    {
      "k": "ag",
      "b": "",
      "h": 370000
    }
  ]
};

export const INITIAL_ANA_DATA: AnalyticalCostData = {
  "qc": [
    {
      "sl": 1,
      "d": "Chemicals / Glass ware other ",
      "i": 600000,
      "w": "3.1.6"
    },
    {
      "sl": 2,
      "d": "Other consumables ",
      "i": 150000,
      "w": "3.1.7"
    }
  ],
  "cols": [
    {
      "sl": 1,
      "t": "Assay",
      "d": "Pheomenex Inert Clone 5µm  ODS(3) 100 Å,150 x 4.6 mm ",
      "e": "H21108676",
      "f": "Amphotericin-B EPCRS",
      "g": 25288,
      "h": 3,
      "span": 1
    },
    {
      "sl": 2,
      "t": "Related Substances",
      "d": "YMC Pack Pro C18, 150 x 4.6 mm, 3 μm ",
      "e": "109ZB10369",
      "f": "Amphotericin-B EPCRS",
      "g": 40095,
      "h": 3,
      "span": 2
    },
    {
      "cont": 1,
      "f": "Nystatin EPCRS",
      "g": null,
      "h": 3
    },
    {
      "sl": 3,
      "t": "Lipid Assay",
      "d": "Xterra MS C18, 250x4.6mm, 5µm ",
      "e": "186000494",
      "f": "Cholestrol,HSPC, DSPG",
      "g": 61324,
      "h": 3,
      "span": 1
    },
    {
      "sl": 4,
      "t": "Lipid Related Substances",
      "d": "Xterra MS C18, 250x4.6mm, 5µm ",
      "e": "186000494",
      "f": "Lysophosphadtilycholine",
      "g": 61324,
      "h": 3,
      "span": 2
    },
    {
      "cont": 1,
      "f": "Lysophosphadtilyglycerol ",
      "g": null,
      "h": 3
    },
    {
      "sl": 5,
      "t": "Alpha tocopherol",
      "d": "Inertsil ODS 3V,150 x 4.6 mm,5µm ",
      "e": "1B5182461",
      "f": "Alphatocopherol standard",
      "g": 32784,
      "h": 3,
      "span": 1
    },
    {
      "sl": 6,
      "t": "Sugar",
      "d": "MCI GEL, 300 x 7.8 mm, 9 µm ",
      "e": "MCL-0-010-07",
      "f": "Dextrose",
      "g": 114475,
      "h": 3,
      "span": 1
    },
    {
      "sl": 7,
      "t": "Free Drug(Entrappy)",
      "d": "YMC- Pack PRO 150.4.6mm, ",
      "e": "109ZB10369",
      "f": "Amphotericin-B EPCRS",
      "g": 30016,
      "h": 3,
      "span": 1
    },
    {
      "sl": "",
      "t": "",
      "d": "3µm  & PD 10 Column",
      "e": "",
      "f": "",
      "g": 40095,
      "h": 3,
      "span": 1
    },
    {
      "sl": 8,
      "t": "Dissolution",
      "d": "Pheomenex Inert Clone 5µm  ODS(3) 100 Å,150 x 4.6 mm &",
      "e": "H21108676",
      "f": "Amphotericin-B EPCRS",
      "g": 25288,
      "h": 3,
      "span": 2
    },
    {
      "cont": 1,
      "d2": "Flot-A-lyzer- 300KD make: Specturm",
      "f": "",
      "g": 16201,
      "h": 3
    }
  ],
  "colW": "3.1.7",
  "third": [
    {
      "sl": 1
    },
    {
      "sl": 2
    },
    {
      "sl": 3
    },
    {
      "sl": 4
    },
    {
      "sl": 5
    },
    {
      "sl": 6
    },
    {
      "sl": 7
    },
    {
      "sl": 8
    }
  ],
  "thirdW": "7.1.2",
  "batches": [
    [
      "Developmemnt stage",
      25
    ],
    [
      "Scale up",
      1
    ],
    [
      "EB",
      3
    ]
  ],
  "colTime": 10,
  "colReq": 3
};

export const BLANK_ACTIVITIES_SET: string[] = [
  "2.2.1",
  "2.4.4",
  "2.5.3",
  "2.6.3",
  "2.7.3",
  "2.8.2",
  "4.3.1",
  "4.3.2",
  "4.4.16",
  "5.3.1",
  "5.4.2",
  "5.4.3",
  "5.4.4",
  "5.4.6",
  "5.5.1",
  "5.8.1",
  "6.1.1",
  "7.1.2",
  "8.1.25",
  "9.1.18",
  "9.2.4",
  "10.1.2",
  "11.1.2",
  "11.2.5"
];
