import { Project, projectLeads, projectOwners, projects } from '../../projects-data';

export type InVivoLifecycle =
    | 'Planned'
    | 'Preparation'
    | 'Ongoing'
    | 'On hold'
    | 'Terminated'
    | 'Cancelled'
    | 'Completed';

export type InVivoRagStatus = 'Amber' | 'Red' | 'Green' | 'Grey';
export type InVivoStudyPriority = 'Normal' | 'High' | 'Critical' | 'Low';
export type InVivoTemplateKey = 'BE' | 'TOX' | 'CLIN' | 'HF';
export type MilestoneStatus = 'Not started' | 'In progress' | 'Blocked' | 'Completed' | 'Not applicable';

export interface MilestoneBaselineHistory {
    baseline: string;
    replacedOn: string;
    approvalRef: string;
}

export interface StudyMilestoneDependency {
    direction: 'in' | 'out';
    studyId: string;
    milestoneName: string;
    status: string;
}

export interface StudyMilestoneItem {
    phase: string;
    name: string;
    owner: string;
    baseline: string;
    forecast: string;
    actual: string;
    status: MilestoneStatus;
    reason: string;
    evidence: string;
    notes: string;
    updatedOn: string;
    updatedBy: string;
    earlierBaselines: MilestoneBaselineHistory[];
    custom?: boolean;
    dependencies?: StudyMilestoneDependency[];
}

export type ReadinessStatus = 'Not started' | 'In progress' | 'Ready' | 'Blocked' | 'Not applicable';
export type ReadinessCategoryKey = 'test' | 'comp' | 'prot' | 'anal';
export type ApprovalApplicability = 'To be confirmed' | 'Confirmed applicable' | 'Confirmed not applicable';
export type ApprovalStatus = 'Not submitted' | 'Submitted' | 'Approved' | 'Rejected' | 'Not applicable';

export interface ReadinessFieldEntry {
    label: string;
    value: string;
}

export interface ReadinessCardData {
    status: ReadinessStatus;
    fields: ReadinessFieldEntry[];
}

export interface StudyApprovalItem {
    type: string;
    authority: string;
    applicability: ApprovalApplicability;
    submitted: string;
    status: ApprovalStatus;
    decisionDate: string;
    conditions: string;
    evidence: string;
    owner: string;
}

export interface StudyReadinessData {
    test: ReadinessCardData;
    comp: ReadinessCardData;
    prot: ReadinessCardData;
    anal: ReadinessCardData;
    approvals: StudyApprovalItem[];
}

export type DependencyType = 'Study' | 'Approval' | 'Material' | 'Decision' | 'CRO / site' | 'Other';
export type DependencyStatusOption = 'Auto' | 'Open' | 'At risk' | 'Complete' | 'Not applicable';
export type DependencyResolvedStatus = 'Open' | 'At risk' | 'Complete' | 'Not applicable';

export interface StudyDependencyItem {
    id: string;
    predecessorStudyId?: string;
    predecessorMilestone?: string;
    externalPredecessor?: string;
    decisionId?: string;
    externalForecast?: string;
    successorStudyId: string;
    successorMilestone: string;
    type: DependencyType;
    requiredBy: string;
    owner: string;
    impact: string;
    evidence: string;
    status: DependencyStatusOption;
    updatedOn: string;
    updatedBy: string;
}

export type ImpactAffectsStatus = 'Yes' | 'No' | 'To be assessed';

export interface StudyImpactAssessmentItem {
    id: string;
    studyId: string;
    programme: string;
    affectedMilestone: string;
    baseline: string;
    forecast: string;
    affects: ImpactAffectsStatus;
    owner: string;
    assessedOn: string;
    assumptions: string;
    evidence: string;
}

export type RiskCategory =
    | 'Scientific'
    | 'Regulatory'
    | 'CRO'
    | 'Material'
    | 'Analytical'
    | 'Financial'
    | 'Timeline'
    | 'Other';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskStatus = 'Open' | 'Mitigating' | 'Closed';
export type RiskEscalation = 'Study owner' | 'Head of Development' | 'CEO';

export interface StudyRiskItem {
    id: string;
    studyId: string;
    description: string;
    category: RiskCategory;
    identifiedOn: string;
    probability: RiskLevel;
    impact: RiskLevel;
    severity: RiskSeverity;
    effect: string;
    owner: string;
    targetDate: string;
    mitigation: string;
    status: RiskStatus;
    escalation: RiskEscalation;
    closedOn: string;
    closureEvidence: string;
}

export type StudyActionStatus = 'Open' | 'In progress' | 'Done';

export interface StudyActionItem {
    id: string;
    studyId: string;
    description: string;
    relatedTo: string;
    owner: string;
    dueDate: string;
    status: StudyActionStatus;
    latestUpdate: string;
    completedOn: string;
    evidence: string;
}

export type DecisionStatus = 'Open' | 'Decided' | 'Withdrawn';

export interface StudyDecisionItem {
    id: string;
    studyId: string;
    requested: string;
    background: string;
    options: string;
    recommended: string;
    owner: string;
    requiredBy: string;
    critical: boolean;
    status: DecisionStatus;
    decisionTaken: string;
    rationale: string;
    decidedOn: string;
    resultingAction: string;
    evidence: string;
}

export type BudgetCurrency = 'INR' | 'USD' | 'EUR' | 'BRL';
export type PaymentMilestoneStatus = 'Planned' | 'Due' | 'Approved' | 'Paid';

export interface StudyPaymentMilestoneItem {
    amount: number;
    trigger: string;
    dueDate: string;
    status: PaymentMilestoneStatus;
}

export interface StudyBudgetData {
    currency: BudgetCurrency;
    approved: number | null;
    approvedOn: string;
    quote: number | null;
    quoteVersion: string;
    contracted: number | null;
    changes: number | null;
    paid: number | null;
    invoiced: number | null;
    forecastToComplete: number | null;
    financeRef: string;
    payments: StudyPaymentMilestoneItem[];
}

export type StudyOutcomeAssessment =
    | 'Pending'
    | 'Meets predefined criteria'
    | 'Does not meet criteria'
    | 'Inconclusive'
    | 'Not applicable';

export type StudyReviewStatus = 'Pending' | 'Completed';

export type StudyManagementDecisionOutcome =
    | '—'
    | 'Proceed'
    | 'Further assessment'
    | 'Repeat'
    | 'Redesign'
    | 'Stop'
    | 'Other';

export type StudyClosureStatus = 'Open' | 'Closed';

export interface StudyResultsClosureData {
    outcome: StudyOutcomeAssessment;
    review: {
        status: StudyReviewStatus;
        by: string;
        on: string;
    };
    decision: StudyManagementDecisionOutcome;
    closure: {
        status: StudyClosureStatus;
        on: string;
        by: string;
    };
}

export type StudyDocumentType =
    | 'Protocol'
    | 'Approval'
    | 'Agreement'
    | 'Report'
    | 'Decision record'
    | 'Other';

export interface StudyDocumentItem {
    id: string;
    type: StudyDocumentType;
    title: string;
    ref: string;
    version: string;
    date: string;
}

export interface StudyHistoryEntry {
    ts: string;
    user: string;
    studyId: string;
    field: string;
    previousValue: string;
    newValue: string;
    reason: string;
    approvalRef: string;
}

export interface InVivoStudyItem {
    projectCode: string;
    projectName: string;
    molecule?: string;
    studyId: string;
    study: string;
    studyCode: string;
    category: string;
    subtype: string;
    targetMarkets: string;
    studyOwner: string;
    lifecycle: InVivoLifecycle;
    lifecycleStepsCompleted: number; // out of 6 segments shown under Lifecycle
    nextMilestone: string;
    forecast: string;
    variance: string;
    ragStatus: InVivoRagStatus;
    ragReason: string;
    studyObjective?: string;
    studyLocation?: string;
    studyPriority?: InVivoStudyPriority | string;
    priorityRationale?: string;
    formulationLead?: string;
    regulatoryLead?: string;
    cro?: string;
    croContact?: string;
    statusReason?: string;
    plannedStart?: string;
    migrationSource?: string;
    migrationOriginalText?: string;
    migrationIssues?: string;
    ownerConfirmed?: boolean;
    lastUpdated?: string;
    milestones?: StudyMilestoneItem[];
    readiness?: StudyReadinessData;
    budget?: StudyBudgetData | null;
    resultsClosure?: StudyResultsClosureData;
    documents?: StudyDocumentItem[];
}

export interface InVivoProjectMaster {
    projectCode: string;
    projectName: string;
    molecule: string;
    division: string;
    dosageForm: string;
    strength: string;
    projectOwner: string;
    projectLead: string;
    priority: InVivoStudyPriority;
    productStatus: string;
    targetMarkets: string[];
    targetMarketsLabel: string;
    bioStudyCroName: string;
    bioStudyReport: string;
    beNoc: string;
    masterSummary: string;
    studyCount: number;
}

export const IN_VIVO_CATEGORY_SUBTYPES: readonly string[] = [
    'Bioequivalence (BE) • Fasting',
    'Bioequivalence (BE) • Fed',
    'Bioequivalence (BE) • Fasting & Fed',
    'Bioequivalence (BE) • Steady State',
    'Bioavailability (BA) • Comparative',
    'Clinical • Comparative study',
    'Clinical • Phase I Trial',
    'PK/PD • PK/PD Study',
    'PK/PD • Pharmacodynamic BE',
    'Preclinical • Acute toxicity',
    'Toxicology • Subacute',
    'Toxicology • Chronic / Subchronic',
    'Human factors • Usability study'
];

export const IN_VIVO_LIFECYCLE_OPTIONS: readonly InVivoLifecycle[] = [
    'Planned',
    'Preparation',
    'Ongoing',
    'On hold',
    'Terminated',
    'Cancelled',
    'Completed'
];

export const IN_VIVO_PRIORITY_OPTIONS: readonly InVivoStudyPriority[] = [
    'Normal',
    'High',
    'Critical',
    'Low'
];

export const IN_VIVO_STUDY_OWNERS: readonly string[] = Array.from(
    new Set(['Dr. Prriya', 'Tathagata', ...projectOwners])
);

export const IN_VIVO_FORMULATION_LEADS: readonly string[] = Array.from(
    new Set([...projectOwners, ...projectLeads, 'Tathagata'])
);

export const IN_VIVO_REGULATORY_LEADS: readonly string[] = [
    'Dr. Prriya',
    'Sheetal K',
    'Ravikanth',
    'Yadvendra',
    'Harika',
    'Dr. Arora',
    'Paurnima C'
];

export const IN_VIVO_CRO_OPTIONS: readonly string[] = [
    'To be identified',
    'Raptim Research',
    'Raptim Research Lab',
    'VIVO Biotech',
    'Trialguna',
    'RYT Life Sciences / Ahmedabad',
    'Jeeva Lifesciences',
    'Jeeva Lifesciences / AIIMS Bibinagar',
    'Accutest Research Lab',
    'Spinos'
];

const MARKET_NORMALIZATIONS: Record<string, string> = {
    EUROPE: 'Europe',
    ROW: 'RoW',
    EAEU: 'EAEU',
    RUSSIA: 'Russia',
    DOMESTIC: 'Domestic',
    EXPORT: 'Export',
    AUSTRALIA: 'Australia',
    BRAZIL: 'Brazil',
    BELARUS: 'Belarus',
    INDIA: 'India',
    SAUDI: 'Saudi Arabia'
};

const PROJECT_NAME_ALIASES: Record<string, string> = {
    'semaglutide pen injection': '2026/CHM/072',
    'liposomal amphotericin b injection, 50 mg/vial': '2026/CHM/045',
    'liposomal gadobutrol': '2026/CHM/159',
    'liposomal bupivacaine': '2026/CHM/167',
    taphalgin: '2026/CHM/149',
    risidiplam: '2026/CHM/098'
};

/** Splits combined project master market strings into clean, normalized market labels. */
export function parseProjectMarkets(rawMarket?: string): string[] {
    if (!rawMarket) return ['RoW'];
    const tokens = rawMarket
        .replace(/\band\b/gi, ',')
        .split(/[/,&]+/)
        .map(part => part.trim())
        .filter(part => Boolean(part) && part.toUpperCase() !== 'NA');

    const normalized = tokens.map(token => {
        const key = token.toUpperCase();
        return MARKET_NORMALIZATIONS[key] || token;
    });

    return normalized.length ? Array.from(new Set(normalized)) : ['RoW'];
}

function normalizeStudyPriority(raw?: string): InVivoStudyPriority {
    const val = (raw || '').toLowerCase();
    if (val.includes('critical')) return 'Critical';
    if (val.includes('high') || val.includes('p1')) return 'High';
    if (val.includes('low')) return 'Low';
    return 'Normal';
}

function buildMasterSummary(master: Omit<InVivoProjectMaster, 'masterSummary' | 'studyCount'>): string {
    const parts = [master.projectName];
    if (master.dosageForm) parts.push(master.dosageForm);
    if (master.strength) parts.push(master.strength.replace(/\s+/g, ' ').trim());
    if (master.targetMarketsLabel) parts.push(master.targetMarketsLabel);
    return `${parts.join(' • ')} (from masters)`;
}

type StudyBlueprint = Omit<InVivoStudyItem, 'projectCode' | 'projectName' | 'molecule' | 'studyId'>;

/**
 * Curated study suites keyed by `projectCode` from `projects-data.ts`.
 * Provides comprehensive study depth for key portfolio projects while baseline generator covers all remaining projects.
 */
const CURATED_STUDY_BLUEPRINTS: Record<string, StudyBlueprint[]> = {
    '2026/CHM/001': [
        {
            study: 'Acrylic Emulsion Binder acetate 500 mg — pivotal fasting BE study (Russia / EAEU)',
            studyCode: 'BE/26/001-F',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Shantaram',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '15-Sep-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'BE report available per project master; CSR archival completed',
            studyObjective: 'Demonstrate fasting BE of Acrylic Emulsion Binder 50% Solids 500 mg film-coated tablets against Zytiga for Russia / EAEU dossier',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Critical',
            priorityRationale: 'Star Oncology product targeted for Russia / EAEU registration',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Dr. Priya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '10-Jun-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate 500 mg — pivotal fed food-effect BE study',
            studyCode: 'BE/26/001-FED',
            category: 'Bioequivalence (BE)',
            subtype: 'Fed',
            targetMarkets: 'Russia, EAEU, Europe',
            studyOwner: 'Dr. Priya',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Statistical analysis completed',
            forecast: '28-Nov-2026',
            variance: '-2 d',
            ragStatus: 'Green',
            ragReason: 'Period I & II dosing completed cleanly; bioanalysis in final QC review',
            studyObjective: 'Establish fed-state bioequivalence per EMA and EAEU product-specific guidance',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '18-Aug-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate 250 mg — lower strength fasting BE study (Europe)',
            studyCode: 'BE/26/001-EU',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Europe',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Regulatory approval received',
            forecast: '18-Dec-2026',
            variance: '+14 d',
            ragStatus: 'Amber',
            ragReason: 'RLD European batch COAs awaited before BE NOC submission',
            studyObjective: 'Evaluate fasting BE against EU Zytiga 250 mg reference product',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '02-Jan-2027'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — comparative PK pilot cohort (healthy volunteers)',
            studyCode: 'PK/26/001-PLT',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'India, EAEU',
            studyOwner: 'Shantaram',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '02-Aug-2026',
            variance: '-5 d',
            ragStatus: 'Green',
            ragReason: 'Intra-subject CV confirmed at 18.4%; sample size locked for pivotal study',
            studyObjective: 'Estimate intra-subject variability and Cmax/AUC0-t ratio across test prototype batches',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'High',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Yadvendra',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            plannedStart: '12-May-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — high-fat meal interaction bridging study',
            studyCode: 'BA/26/001-FE',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Europe, Export',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Period II dosing completed',
            forecast: '06-Dec-2026',
            variance: '+9 d',
            ragStatus: 'Amber',
            ragReason: 'Subject check-in delayed by 9 d due to festive screening window',
            studyObjective: 'Quantify prandial systemic exposure shifts vs originator lot across fed cohorts',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Normal',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Sheetal K',
            cro: 'Raptim Research Lab',
            croContact: 'Sheetal K',
            plannedStart: '22-Sep-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — replicate design BE study (highly variable analyte)',
            studyCode: 'BE/26/001-REP',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting & Fed',
            targetMarkets: 'Europe, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Ethics approval received',
            forecast: '25-Nov-2026',
            variance: '+21 d',
            ragStatus: 'Red',
            ragReason: 'Overdue: Ethics approval received slipped 21 d awaiting IEC quorum review',
            studyObjective: '4-period full-replicate BE evaluation supporting reference-scaled average BE criteria',
            studyLocation: 'Chennai, India',
            studyPriority: 'Critical',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            croContact: 'Dr. Prriya',
            plannedStart: '15-Dec-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — steady-state repeat dose oncology safety bridging',
            studyCode: 'CT/26/001-SS',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Shantaram',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '15-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Protocol synopsis drafted per EAEU clinical review feedback',
            studyObjective: 'Assess steady-state trough testosterone suppression and hepatic lab profile if requested',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Dr. Prriya',
            cro: 'To be identified',
            plannedStart: '15-Feb-2027'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — preclinical 28-day hepatic tolerability bridging (rat)',
            studyCode: 'TOX/26/001-R',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'Russia, India',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '19-Jul-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: 'Impurity qualification tox limits cleared within ICH Q3A/B thresholds',
            studyObjective: 'Qualify trace synthesis related-substances via 28-day rat repeat-dose study',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '20-Apr-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — acute single-dose impurity safety study',
            studyCode: 'PRE/26/001-AC',
            category: 'Preclinical',
            subtype: 'Acute toxicity',
            targetMarkets: 'EAEU, Export',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '28-May-2026',
            variance: '-6 d',
            ragStatus: 'Green',
            ragReason: 'No clinical signs or histopathology findings observed at limit dose',
            studyObjective: 'Preclinical safety margin confirmation for excipient grade change in coated core',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Harika',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '04-Apr-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — regional bridging BE study (Belarus & Kazakhstan)',
            studyCode: 'BE/26/001-BY',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Belarus, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'On hold',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'On hold review',
            forecast: '10-Mar-2027',
            variance: '+30 d',
            ragStatus: 'Amber',
            ragReason: 'On hold pending mutual-recognition waiver confirmation under EAEU Act 85',
            studyObjective: 'Local EAEU mutual recognition bridging if standalone cohort requested by regulator',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Low',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Yadvendra',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            statusReason: 'Awaiting EAEU mutual-recognition BE waiver feedback',
            plannedStart: '10-Mar-2027'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — swallowability & tablet scoreability usability check',
            studyCode: 'HF/26/001-US',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Russia, Europe',
            studyOwner: 'Shantaram',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 5,
            nextMilestone: 'Final report signed',
            forecast: '22-Nov-2026',
            variance: '-1 d',
            ragStatus: 'Green',
            ragReason: 'Human factors interviews completed across 30 participants; draft CSR under review',
            studyObjective: 'Verify patient Leaflet comprehension and tablet handling ergonomics for 500 mg strength',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'R. Kulkarni',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '20-Sep-2026'
        },
        {
            study: 'Acrylic Emulsion Binder acetate — accelerated metaboliser CYP3A4 PD exploratory arm',
            studyCode: 'PD/26/001-EX',
            category: 'PK/PD',
            subtype: 'Pharmacodynamic BE',
            targetMarkets: 'Export, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'CRO contract executed',
            forecast: '12-Nov-2026',
            variance: '+17 d',
            ragStatus: 'Red',
            ragReason: 'Overdue: CRO contract executed slipped 17 d pending legal MSA redlines',
            studyObjective: 'Explore downstream androgen-suppression PD biomarkers in healthy male subjects',
            studyLocation: 'Chennai, India',
            studyPriority: 'Normal',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            croContact: 'Dr. Prriya',
            plannedStart: '28-Dec-2026'
        }
    ],
    '2026/CHM/002': [
        {
            study: 'Azacitidine Lyo 100 mg/vial — parenteral PK & systemic exposure study',
            studyCode: 'PK/26/002-IV',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Shantaram',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Bioanalysis completed',
            forecast: '25-Nov-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Sample cold-chain shipment received at bioanalytical lab on schedule',
            studyObjective: 'Support comparative SC/IV systemic PK profile for reconstituted lyophilized suspension',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'S. Iyer',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research Lab',
            croContact: 'Sheetal K',
            plannedStart: '01-Sep-2026'
        },
        {
            study: 'Azacitidine Lyo — subcutaneous comparative bioavailability study',
            studyCode: 'BA/26/002-SC',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Protocol finalisation',
            forecast: '14-Dec-2026',
            variance: '+11 d',
            ragStatus: 'Amber',
            ragReason: 'Protocol finalisation delayed waiting for cold-chain stabilization SOP at CRO',
            studyObjective: 'Verify SC absorption rate comparability post-reconstitution across pH range',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Normal',
            formulationLead: 'S. Iyer',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '15-Jan-2027'
        },
        {
            study: 'Azacitidine Lyo — post-reconstitution particulate & hemolysis tox check',
            studyCode: 'TOX/26/002-HL',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'EAEU, India',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '08-Aug-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: 'Local injection-site tolerance and hemolysis study passed with no reactions',
            studyObjective: 'Confirm injection-site safety margin for mannitol excipient batch',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'S. Iyer',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '10-May-2026'
        },
        {
            study: 'Azacitidine Lyo — acute toxicity qualification of degradation impurity',
            studyCode: 'PRE/26/002-IMP',
            category: 'Preclinical',
            subtype: 'Acute toxicity',
            targetMarkets: 'Russia, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Histopathology review',
            forecast: '19-Nov-2026',
            variance: '+6 d',
            ragStatus: 'Amber',
            ragReason: 'Reconstitution temperature stability samples delayed by 6 d',
            studyObjective: 'Qualify hydrolysis degradants under 24-hr refrigerated in-use stability window',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Harika',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '12-Sep-2026'
        },
        {
            study: 'Azacitidine Lyo — oncology infusion reconstitution usability study',
            studyCode: 'HF/26/002-ONC',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Russia, Europe',
            studyOwner: 'Shantaram',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '10-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Pharmacy reconstitution human factors cohort scheduled Q1 2027',
            studyObjective: 'Validate closed-system transfer device reconstitution instructions with oncology nurses',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'S. Iyer',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '10-Feb-2027'
        },
        {
            study: 'Azacitidine Lyo — multi-dose myelodysplastic PD bridging review',
            studyCode: 'CT/26/002-PD',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Feasibility questionnaire',
            forecast: '20-Mar-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Clinical feasibility aligned with regulatory Q1/Q2 biowaiver fallback strategy',
            studyObjective: 'Prepare patient PK/PD comparative protocol if biowaiver exemption not granted',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Low',
            formulationLead: 'S. Iyer',
            regulatoryLead: 'Yadvendra',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            plannedStart: '20-Mar-2027'
        }
    ],
    '2026/CHM/003': [
        {
            study: 'Fulvestrant PFS 250 mg — steady-state depot PK study',
            studyCode: 'BE/26/003-SS',
            category: 'Bioequivalence (BE)',
            subtype: 'Steady State',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Dutta',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Regulatory approval received',
            forecast: '18-Dec-2026',
            variance: '+14 d',
            ragStatus: 'Amber',
            ragReason: 'RLD Faslodex lot release documentation awaited before IEC submission',
            studyObjective: 'Establish comparative IM depot pharmacokinetics for Fulvestrant 250 mg prefilled syringe',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            priorityRationale: 'Star Oncology PFS programme',
            formulationLead: 'A. Menon',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '05-Jan-2027'
        },
        {
            study: 'Fulvestrant PFS — single-dose IM oil-depot pilot PK study',
            studyCode: 'PK/26/003-IM',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'Russia, India',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Day-56 PK sampling',
            forecast: '09-Nov-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: 'Day-28 interim PK samples confirm matched oily depot release kinetics',
            studyObjective: 'Characterise terminal half-life and initial burst profile in healthy postmenopausal subjects',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'A. Menon',
            regulatoryLead: 'Sheetal K',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '15-Aug-2026'
        },
        {
            study: 'Fulvestrant PFS — syringe usability & needle-safety human factors study',
            studyCode: 'HF/26/003-PFS',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Russia, EAEU, Europe',
            studyOwner: 'Dutta',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Simulated IM injection validation',
            forecast: '02-Dec-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Simulated-use cohort of 20 HCPs scheduled without protocol deviations',
            studyObjective: 'Verify glide force, dose graduation readability, and safety shield activation',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'A. Menon',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '05-Oct-2026'
        },
        {
            study: 'Fulvestrant PFS — preclinical IM local tolerance & muscle histopathology (rabbit)',
            studyCode: 'TOX/26/003-RB',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'EAEU, India',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '21-Aug-2026',
            variance: '-5 d',
            ragStatus: 'Green',
            ragReason: 'Muscle tissue recovery score comparable to Faslodex RLD at Day 14 and Day 28',
            studyObjective: 'Evaluate local IM tissue tolerance of castor oil / benzyl benzoate co-solvent system',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr. Arora',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '02-May-2026'
        },
        {
            study: 'Fulvestrant PFS — comparative clinical efficacy bridging study (breast cancer)',
            studyCode: 'CT/26/003-BR',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Investigator site selection',
            forecast: '15-Jan-2027',
            variance: '+19 d',
            ragStatus: 'Red',
            ragReason: 'Site qualification audit delayed 19 d due to cold-storage monitoring log review',
            studyObjective: 'Support patient-level steady-state PK & ORR confirmation across 6 oncology sites',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'High',
            formulationLead: 'A. Menon',
            regulatoryLead: 'Yadvendra',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            plannedStart: '01-Feb-2027'
        },
        {
            study: 'Fulvestrant PFS — bilateral gluteal viscosity & BA comparison study',
            studyCode: 'BA/26/003-VIS',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Export, RoW',
            studyOwner: 'Dutta',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '25-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Viscosity specification confirmed prior to clinical protocol drafting',
            studyObjective: 'Compare injection site absorption rate with commercial viscosity extremes',
            studyLocation: 'Chennai, India',
            studyPriority: 'Normal',
            formulationLead: 'A. Menon',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '25-Feb-2027'
        }
    ],
    '2026/CHM/004': [
        {
            study: 'Iohexol 300 & 350 mgI/mL — comparative clinical contrast efficacy study',
            studyCode: 'CT/26/004-IM',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Russia, EAEU, India',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Agreement executed',
            forecast: '12-Dec-2026',
            variance: '+9 d',
            ragStatus: 'Amber',
            ragReason: 'Protocol initiated; agreement execution and RLD consignment pending',
            studyObjective: 'Compare vascular contrast opacification & adverse-event rate of Iohexol vs Omnipaque',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            priorityRationale: 'Star Diagnostics / Contrast Media injectable',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Yadvendra',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            plannedStart: '15-Nov-2026'
        },
        {
            study: 'Iohexol injection — renal clearance & PK equivalence study',
            studyCode: 'PK/26/004-RN',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Dutta',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Urinary recovery assay completed',
            forecast: '28-Nov-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'Plasma and urine iodine LC-MS/MS bioanalysis tracking ahead of plan',
            studyObjective: 'Confirm identical GFR elimination kinetics across both 300 and 350 mgI/mL strengths',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'P. Nair',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '20-Aug-2026'
        },
        {
            study: 'Iohexol injection — preclinical nephrotoxicity & osmolality screening (rat)',
            studyCode: 'TOX/26/004-NP',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'India, EAEU',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '12-Sep-2026',
            variance: '-6 d',
            ragStatus: 'Green',
            ragReason: 'Serum creatinine, BUN, and renal tubular pathology identical to reference contrast media',
            studyObjective: 'Confirm absence of elevated contrast-induced nephropathy risk vs Omnipaque',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '01-Jun-2026'
        },
        {
            study: 'Iohexol injection — acute hypersensitivity & extravasation tolerance',
            studyCode: 'PRE/26/004-EX',
            category: 'Preclinical',
            subtype: 'Acute toxicity',
            targetMarkets: 'Russia, India',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '29-Jul-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Perivascular injection tolerance comparable to innovator reference',
            studyObjective: 'Demonstrate paravenous tissue safety across 350 mgI/mL strength',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'P. Nair',
            regulatoryLead: 'Harika',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '15-Apr-2026'
        },
        {
            study: 'Iohexol injection — high-pressure injector flow-rate human factors trial',
            studyCode: 'HF/26/004-INJ',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Europe, Russia',
            studyOwner: 'Dutta',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Radiology tech usability scoring',
            forecast: '10-Dec-2026',
            variance: '+7 d',
            ragStatus: 'Amber',
            ragReason: 'Power-injector manifold compatibility test extended by 1 week for 100 mL bottles',
            studyObjective: 'Validate bottle flip-off seal and CT auto-injector transfer ergonomics',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'P. Nair',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '25-Sep-2026'
        },
        {
            study: 'Iohexol injection — Phase I tolerability & contrast CT attenuation extension',
            studyCode: 'CT/26/004-P1',
            category: 'Clinical',
            subtype: 'Phase I Trial',
            targetMarkets: 'RoW, India',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '10-Jan-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Contingency Phase I CT enhancement evaluation planned for RoW markets',
            studyLocation: 'Chennai, India',
            studyPriority: 'Normal',
            formulationLead: 'P. Nair',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '10-Jan-2027'
        }
    ],
    '2026/CHM/005': [
        {
            study: 'Temozolomide 250 mg capsules — pivotal fasting BE study',
            studyCode: 'BE/26/005-F',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Shantaram',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'BE NOC approval received',
            forecast: '30-Nov-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Patient-cohort BE protocol finalised per Russia/EAEU cytotoxic requirements',
            studyObjective: 'Establish fasting BE in glioma / melanoma patients vs Temodar 250 mg reference',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'V. Rao',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '15-Dec-2026'
        },
        {
            study: 'Temozolomide capsules — strength-proportionality dissolution & BA bridging',
            studyCode: 'BA/26/005-SP',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Final biowaiver dossier compiled',
            forecast: '18-Nov-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'Multi-media f2 similarity confirmed across 5, 20, 100, 140, 180 mg strengths',
            studyObjective: 'Substantiate lower-strength biowaivers anchored on 250 mg pivotal patient BE',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'V. Rao',
            regulatoryLead: 'Dr. Prriya',
            cro: 'To be identified',
            plannedStart: '01-Sep-2026'
        },
        {
            study: 'Temozolomide capsules — patient fed-state supportive PK cohort',
            studyCode: 'BE/26/005-FED',
            category: 'Bioequivalence (BE)',
            subtype: 'Fed',
            targetMarkets: 'EAEU, Export',
            studyOwner: 'Shantaram',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '08-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Scheduled after primary fasting patient cohort lock',
            studyObjective: 'Supportive food-effect PK assessment if requested by EAEU assessor',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Normal',
            formulationLead: 'V. Rao',
            regulatoryLead: 'Paurnima C',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '08-Feb-2027'
        },
        {
            study: 'Temozolomide — stabilized oral plasma assay validation & clinical PD',
            studyCode: 'PK/26/005-MTIC',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'Russia, EAEU',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '14-Oct-2026',
            variance: '-2 d',
            ragStatus: 'Green',
            ragReason: 'pH-acidified plasma collection and MTIC metabolite bioanalytical validation approved',
            studyObjective: 'Prevent rapid ex-vivo hydrolysis during clinical PK blood processing',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'V. Rao',
            regulatoryLead: 'Sheetal K',
            cro: 'Raptim Research Lab',
            croContact: 'Sheetal K',
            plannedStart: '20-Jul-2026'
        },
        {
            study: 'Temozolomide capsules — nitrosamine / process impurity tox qualification',
            studyCode: 'TOX/26/005-N',
            category: 'Toxicology',
            subtype: 'Chronic / Subchronic',
            targetMarkets: 'Russia, Europe',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Ames & 28-day tox report draft',
            forecast: '04-Dec-2026',
            variance: '+12 d',
            ragStatus: 'Amber',
            ragReason: 'Analytical trace confirmation delayed 12 d pending confirmatory LC-HRMS run',
            studyObjective: 'Provide preclinical safety clearance for hard gelatin capsule excipient levels',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'V. Rao',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '05-Sep-2026'
        },
        {
            study: 'Temozolomide capsules — child-resistant blister & handling usability study',
            studyCode: 'HF/26/005-CR',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Russia, Export',
            studyOwner: 'Shantaram',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'IEC protocol clearance',
            forecast: '22-Nov-2026',
            variance: '+15 d',
            ragStatus: 'Red',
            ragReason: 'Senior caregiver recruitment under target by 6 subjects ahead of scheduled session',
            studyObjective: 'Demonstrate cytotoxic blister peel-push usability & safe disposal messaging',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'V. Rao',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '02-Dec-2026'
        }
    ],
    '2026/CHM/045': [
        {
            study: 'Amphotericin B Liposomal 50 mg/vial — BE study (Brazil)',
            studyCode: 'ARL-25-082',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Brazil',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'RLD procurement & BE NOC',
            forecast: '26-Nov-2026',
            variance: '+12 d',
            ragStatus: 'Amber',
            ragReason: 'Test product ready; awaiting Brazilian RLD purchase before study initiation',
            studyObjective: 'Liposomal Amphotericin B 50 mg/vial comparative pharmacokinetic study for Brazil filing',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Shantaram',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '26-Nov-2026'
        },
        {
            study: 'Amphotericin B Liposomal 50 mg/vial — BE study (Europe)',
            studyCode: 'BE/25/105',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Europe',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Dosing initiation confirmed',
            forecast: '15-Nov-2026',
            variance: '+18 d',
            ragStatus: 'Red',
            ragReason: 'Protocol and agreement finalised; RLD available but CRO dosing date overdue',
            studyObjective: 'Comparative free and liposomal amphotericin B BE study for European submission',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Critical',
            formulationLead: 'Shantaram',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research Lab',
            croContact: 'Sheetal K',
            plannedStart: '26-Oct-2026'
        },
        {
            study: 'Amphotericin B Liposomal — unencapsulated free drug vs liposomal PK deconvolution',
            studyCode: 'PK/26/045-FR',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'Europe, Brazil',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'SPE cartridge extraction report',
            forecast: '18-Nov-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: 'Free vs liposome-encapsulated validated bioanalytical assay approved',
            studyObjective: 'Establish separation stability across frozen clinical plasma aliquots per EMA Q&A',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Critical',
            formulationLead: 'Dhananjay',
            regulatoryLead: 'Sheetal K',
            cro: 'Raptim Research Lab',
            croContact: 'Sheetal K',
            plannedStart: '12-Aug-2026'
        },
        {
            study: 'Amphotericin B Liposomal — repeat-dose nephrotoxicity & PK comparability (rat)',
            studyCode: 'TOX/26/045-R',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'Europe, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '04-Sep-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: '14-day renal histopathology and plasma liposomal AUC match AmBisome reference',
            studyObjective: 'Non-clinical confirmatory tissue distribution & nephrotoxicity bridging',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Dhananjay',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '18-May-2026'
        },
        {
            study: 'Amphotericin B Liposomal — infusion complement-activation (CARPA) safety check',
            studyCode: 'PRE/26/045-CR',
            category: 'Preclinical',
            subtype: 'Acute toxicity',
            targetMarkets: 'Europe, Brazil',
            studyOwner: 'Shantaram',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '29-Jul-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'In-vitro & in-vivo SC5b-9 complement levels within reference product range',
            studyObjective: 'De-risk infusion reactions linked to liposome particle-size distribution',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Dhananjay',
            regulatoryLead: 'Dr. Arora',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '10-Apr-2026'
        }
    ],
    '2026/CHM/052': [
        {
            study: 'Nilotinib hard capsules — Demonstration Campaign study (Australia)',
            studyCode: 'SPN-NIL-AU',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Australia',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '30-Aug-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Dosing and bioanalytical analysis completed for Australian cohort',
            studyObjective: 'Evaluate single-dose fasting bioequivalence of Nilotinib capsules for TGA filing',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '01-Oct-2025'
        },
        {
            study: 'Nilotinib hard capsules — Demonstration Campaign study (Europe)',
            studyCode: 'SPN-NIL-EU',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Europe',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Bioanalysis completed',
            forecast: '25-Nov-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Clinical dosing completed; sample bioanalysis currently under process',
            studyObjective: 'Evaluate comparative bioequivalence against European Tasigna reference product',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '01-Sep-2026'
        },
        {
            study: 'Nilotinib hard capsules — fed-state AUC0-inf sensitivity bridging study',
            studyCode: 'BE/26/052-FED',
            category: 'Bioequivalence (BE)',
            subtype: 'Fed',
            targetMarkets: 'Australia, Europe',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Statistical BE report',
            forecast: '08-Dec-2026',
            variance: '+4 d',
            ragStatus: 'Amber',
            ragReason: 'ISR (Incurred Sample Reanalysis) repeat samples scheduled for next run',
            studyObjective: 'Assess fed-state formulation robustness for polymorphic API salt form',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '12-Sep-2026'
        },
        {
            study: 'Nilotinib 50 & 150 mg — strength proportionality biowaiver bridging',
            studyCode: 'BA/26/052-SP',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Australia, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '15-Sep-2026',
            variance: '-2 d',
            ragStatus: 'Green',
            ragReason: 'Dissolution f2 > 70 across pH 1.2–6.8; TGA waiver dossier ready',
            studyObjective: 'Support lower-strength capsules without separate clinical cohorts',
            studyPriority: 'Normal',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '01-Jun-2026'
        }
    ],
    '2026/CHM/053': [
        {
            study: 'Ruxolitinib tablets — BE study (Europe / Australia)',
            studyCode: 'SPN-RUX-01',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Europe, Australia',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '15-Sep-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Clinical dosing and bioanalytical phase completed',
            studyObjective: 'Support EMA and TGA registration of Ruxolitinib 5–20 mg tablets',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '01-Nov-2025'
        },
        {
            study: 'Ruxolitinib 20 mg — pivotal fed BE study (Europe)',
            studyCode: 'SPN-RUX-FED',
            category: 'Bioequivalence (BE)',
            subtype: 'Fed',
            targetMarkets: 'Europe, Australia',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 5,
            nextMilestone: 'CSR QA sign-off',
            forecast: '24-Nov-2026',
            variance: '-2 d',
            ragStatus: 'Green',
            ragReason: '90% CI for Cmax and AUC within 94–106%; CSR QC near closure',
            studyObjective: 'Confirm fed bioequivalence against Jakavi 20 mg European reference',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '10-Aug-2026'
        },
        {
            study: 'Ruxolitinib 5/10/15 mg — lower-strength biowaiver dissolution bridging',
            studyCode: 'BA/26/053-BW',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Australia, EAEU',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '02-Oct-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'BCS Class I proportionality package approved by Regulatory QA',
            studyObjective: 'Anchor 5 mg, 10 mg, and 15 mg tablet waivers on 20 mg pivotal clinical results',
            studyPriority: 'Normal',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '15-Jul-2026'
        },
        {
            study: 'Ruxolitinib tablets — repeat-dose safety & impurity tox qualification',
            studyCode: 'TOX/26/053-IMP',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'Europe, Australia',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '12-Jul-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Zero unexpected hematologic findings in 14-day comparative rat bridging arm',
            studyObjective: 'Qualify process-related chiral isomer trace level at 0.25% threshold',
            studyPriority: 'Normal',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '20-Mar-2026'
        }
    ],
    '2026/CHM/072': [
        {
            study: 'Semaglutide pen injection — Demonstration Campaign study',
            studyCode: 'BE/26/038, BE/26/039',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'India, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Regulatory approval received',
            forecast: '10-Dec-2026',
            variance: '+82 d',
            ragStatus: 'Amber',
            ragReason: 'Forecast slipped: Regulatory approval received is 82 d behind baseline',
            studyObjective: 'Sub-acute toxicity reports in two animal species required by DCGI for BE NOC approval',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Critical',
            priorityRationale: 'Core GLP-1 pre-filled pen registration programme',
            formulationLead: 'Shantaram',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '26-Nov-2026'
        },
        {
            study: 'Semaglutide — subacute toxicity study (rat)',
            studyCode: '26/0619(G)',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'India',
            studyOwner: 'Shantaram',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'Final report signed',
            forecast: '04-Nov-2026',
            variance: '-8 d',
            ragStatus: 'Red',
            ragReason: 'Overdue: Final report signed (forecast 04-Nov-2026, 2 d late)',
            studyObjective: '28-day subacute repeat-dose toxicity study in rat supporting DCGI BE NOC submission',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Shantaram',
            regulatoryLead: 'Sheetal K',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '15-Aug-2026'
        },
        {
            study: 'Semaglutide — subacute toxicity study (rabbit)',
            studyCode: '26/0620(G)',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'India',
            studyOwner: 'Shantaram',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Analysis completed',
            forecast: '10-Nov-2026',
            variance: '-7 d',
            ragStatus: 'Green',
            ragReason: 'No red or amber trigger and planning information complete',
            studyObjective: '28-day subacute repeat-dose toxicity study in rabbit for two-species preclinical clearance',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Shantaram',
            regulatoryLead: 'Sheetal K',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '01-Sep-2026'
        },
        {
            study: 'Semaglutide pen — human factors study',
            studyCode: 'TG/PRO/26/MD/001',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'India',
            studyOwner: 'Shantaram',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Ethics approval received',
            forecast: '20-Oct-2026',
            variance: '+27 d',
            ragStatus: 'Red',
            ragReason: 'Overdue: Ethics approval received (forecast 20-Oct-2026, 17 d late)',
            studyObjective: 'Validate autoinjector pen dose-setting, injection delivery, and IFU comprehension',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Shantaram',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '26-Oct-2026'
        },
        {
            study: 'Semaglutide PFS — comparative immunogenicity & ADA screening cohort',
            studyCode: 'CT/26/072-ADA',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'Europe, Export',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'ECL assay validation approved',
            forecast: '15-Dec-2026',
            variance: '+5 d',
            ragStatus: 'Amber',
            ragReason: 'Neutralizing antibody cell-based assay matrix interference check under repeat',
            studyObjective: 'Meet EMA recombinant/synthetic peptide immunogenicity comparability guidance',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Critical',
            formulationLead: 'Suman',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research Lab',
            croContact: 'Sheetal K',
            plannedStart: '18-Jan-2027'
        },
        {
            study: 'Semaglutide PFS — multi-strength SC depot PK proportionality bridging',
            studyCode: 'PK/26/072-SC',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'Europe, RoW',
            studyOwner: 'Suman',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '02-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: '0.25 mg / 0.5 mg / 1.0 mg pen-injector PK proportionality bridging planned post BE NOC',
            studyObjective: 'Demonstrate dose-normalized PK comparability vs Ozempic reference pen',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'Suman',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '02-Feb-2027'
        }
    ],
    '2026/CHM/098': [
        {
            study: 'Risdiplam oral solution — acute & chronic toxicology study',
            studyCode: 'JLS-RIS-TOX',
            category: 'Toxicology',
            subtype: 'Chronic / Subchronic',
            targetMarkets: 'India, Russia, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Final report signed',
            forecast: '15-Dec-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Acute & subacute studies completed; chronic and subchronic study ongoing',
            studyObjective: 'Non-clinical toxicology support for Risdiplam oral powder for solution 0.75 mg/mL',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '15-Aug-2026'
        },
        {
            study: 'Risdiplam oral solution 0.75 mg/mL — pivotal fasting BE study',
            studyCode: 'BE/26/098-F',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Russia, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'RLD Evrysdi delivery at CRO',
            forecast: '28-Nov-2026',
            variance: '+9 d',
            ragStatus: 'Amber',
            ragReason: 'Evrysdi cold-chain reference stock import license in final customs clearance',
            studyObjective: 'Compare oral solution exposure after reconstitution against Evrysdi reference',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Siva',
            regulatoryLead: 'Paurnima C',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '20-Dec-2026'
        },
        {
            study: 'Risdiplam oral solution — pediatric dosing syringe usability validation',
            studyCode: 'HF/26/098-SYR',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Russia, India',
            studyOwner: 'Dutta',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Draft usability report QC',
            forecast: '19-Nov-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'Caregiver constitution and 0.75 mL oral syringe measurement accuracy > 98%',
            studyObjective: 'Validate home reconstitution and enteral syringe dose accuracy for SMA caregivers',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Siva',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '05-Sep-2026'
        },
        {
            study: 'Risdiplam — SMN2 exon-7 splicing PD biomarker & systemic PK check',
            studyCode: 'PK/26/098-PD',
            category: 'PK/PD',
            subtype: 'Pharmacodynamic BE',
            targetMarkets: 'Russia, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '12-Oct-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: 'Preclinical splicing assay confirmed complete biological equivalence to RLD',
            studyObjective: 'Demonstrate equivalent functional SMN protein upregulation alongside plasma AUC',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '02-Jul-2026'
        }
    ],
    '2026/CHM/129': [
        {
            study: 'Dasatinib tablets — fasting BE study (Europe)',
            studyCode: 'RAP-DAS-EU',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'Europe, EAEU, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Agreement executed',
            forecast: '05-Jan-2027',
            variance: '+10 d',
            ragStatus: 'Amber',
            ragReason: 'Protocol initiated at Raptim Research; EU Sprycel RLD procurement pending',
            studyObjective: 'Compare oral bioavailability of Dasatinib tablets 20–140 mg against Sprycel',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '10-Jan-2027'
        },
        {
            study: 'Dasatinib tablets — fed BE study under gastric-pH modulation',
            studyCode: 'RAP-DAS-FED',
            category: 'Bioequivalence (BE)',
            subtype: 'Fed',
            targetMarkets: 'Europe, EAEU',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '28-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Planned fed crossover sequence linked to fasting Sprycel RLD shipment',
            studyObjective: 'Demonstrate BE across postprandial pH conditions per EMA product-specific guidance',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Sheetal K',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '28-Feb-2027'
        },
        {
            study: 'Dasatinib — free base vs monohydrate polymorphic bridging pilot PK',
            studyCode: 'PK/26/129-PM',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'EU, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '28-Sep-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'Pilot Cmax ratio 1.02 confirmed non-inferior gastric solubility of API salt form',
            studyObjective: 'De-risk gastric-pH dependent absorption ahead of 100/140 mg pivotal study',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Spinos',
            plannedStart: '15-Jun-2026'
        },
        {
            study: 'Dasatinib 20–80 mg — multi-strength dissolution & biowaiver package',
            studyCode: 'BA/26/129-BW',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'Europe, RoW',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Multimedia f2 report QA',
            forecast: '26-Nov-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'pH 1.2, 4.5, and 6.8 + Brij-35 discriminatory dissolution curves aligned with Sprycel',
            studyObjective: 'Support compositional biowaiver for 20, 50, 70, and 80 mg tablet strengths',
            studyPriority: 'Normal',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            plannedStart: '02-Sep-2026'
        }
    ],
    '2026/CHM/131': [
        {
            study: 'Elexacaftor + Ivacaftor + Tezacaftor — chronic toxicology study',
            studyCode: 'JLS-EIT-TOX',
            category: 'Toxicology',
            subtype: 'Chronic / Subchronic',
            targetMarkets: 'India, EAEU, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Final report signed',
            forecast: '20-Dec-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Acute & subacute toxicology completed; chronic and subchronic phase ongoing',
            studyObjective: 'Preclinical toxicology qualification supporting triple-combination tablet BE filing',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '12-Aug-2026'
        },
        {
            study: 'Trikafta generic FDC (100/75/50 mg) — pivotal fed BE study',
            studyCode: 'BE/26/131-FED',
            category: 'Bioequivalence (BE)',
            subtype: 'Fed',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'CRO RFP & analytical transfer',
            forecast: '15-Jan-2027',
            variance: '+14 d',
            ragStatus: 'Amber',
            ragReason: 'Simultaneous 3-analyte chiral LC-MS/MS sensitivity check in progress',
            studyObjective: 'Establish fed bioequivalence of triple CFTR modulator fixed-dose tablet',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Critical',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Sheetal K',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '25-Jan-2027'
        },
        {
            study: 'Elexacaftor + Ivacaftor + Tezacaftor — amorphous solid dispersion PK pilot',
            studyCode: 'PK/26/131-ASD',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'India, EAEU',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '28-Sep-2026',
            variance: '-3 d',
            ragStatus: 'Green',
            ragReason: 'Spray-dried dispersion batch matched innovator Kaftrio systemic AUC',
            studyObjective: 'Select optimal HPMCAS polymer ratio via 18-subject single-dose pilot',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Paurnima C',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '18-Jun-2026'
        },
        {
            study: 'Elexacaftor FDC — morning/evening tablet regimen human factors check',
            studyCode: 'HF/26/131-REG',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '15-Mar-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Wallet blister calendar labelling evaluation scheduled Q1 2027',
            studyObjective: 'Confirm clear distinction between morning triple FDC and evening Ivacaftor dose',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '15-Mar-2027'
        }
    ],
    '2026/CHM/149': [
        {
            study: 'Tafalgin SA Liquid 4 mg/mL — comparative clinical study',
            studyCode: 'JE-CT-2026-001',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'India, Domestic',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'RLD consignment received',
            forecast: '08-Dec-2026',
            variance: '+15 d',
            ragStatus: 'Amber',
            ragReason: 'Protocol finalised and agreement executed; Russia RLD import awaited',
            studyObjective: 'Comparative PK and clinical equivalence of Tafalgin 4 mg/mL self-administered liquid',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr. Prriya',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            plannedStart: '25-Nov-2026'
        },
        {
            study: 'Tafalgin SA Liquid — preclinical opioid analgesia & PD bridging',
            studyCode: 'PD/26/149-PRE',
            category: 'PK/PD',
            subtype: 'Pharmacodynamic BE',
            targetMarkets: 'Domestic, Russia',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '10-Sep-2026',
            variance: '-2 d',
            ragStatus: 'Green',
            ragReason: 'Preclinical antinociceptive PD & blood-brain-barrier selectivity verified vs RLD',
            studyObjective: 'Confirm tetrapeptide receptor selectivity and absence of respiratory depression',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Srinivas',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '20-Jun-2026'
        },
        {
            study: 'Tafalgin SA Liquid — 28-day repeat-dose SC tolerance toxicology (rat)',
            studyCode: 'TOX/26/149-SC',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'Domestic, India',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Histopathology slide read',
            forecast: '20-Nov-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'In-life SC dosing phase complete with zero local injection erythema',
            studyObjective: 'Establish preclinical local and systemic safety ahead of human comparative dosing',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr Rajaram Ravikrishnan',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '22-Aug-2026'
        },
        {
            study: 'Tafalgin SA Liquid — multi-dose self-injection usability assessment',
            studyCode: 'HF/26/149-SA',
            category: 'Human factors',
            subtype: 'Usability study',
            targetMarkets: 'Domestic',
            studyOwner: 'Dutta',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '18-Jan-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Scheduled after Russian RLD clinical comparative enrollment start',
            studyObjective: 'Validate pain-clinic home administration accuracy for self-injected peptide solution',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Normal',
            formulationLead: 'Srinivas',
            regulatoryLead: 'Ravikanth',
            cro: 'Trialguna',
            croContact: 'Ravikanth',
            plannedStart: '18-Jan-2027'
        }
    ],
    '2026/CHM/159': [
        {
            study: 'Gadobutrol Liposomes — preclinical rabbit MRI & glioblastoma crossover study',
            studyCode: 'JLS-GAD-PRE',
            category: 'Preclinical',
            subtype: 'Acute toxicity',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Crossover MRI scan completed',
            forecast: '30-Nov-2026',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Healthy rabbit MRI scans satisfactory vs Reference; tumor-model crossover initiated',
            studyObjective: 'Acute & subacute toxicity plus CNS glioblastoma contrast MRI evaluation in rabbits',
            studyLocation: 'AIIMS Bibinagar / Hyderabad',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Jeeva Lifesciences / AIIMS Bibinagar',
            croContact: 'Dr. Arora',
            plannedStart: '10-Aug-2026'
        },
        {
            study: 'Gadobutrol Liposomes — gadolinium retention & bone/brain biodistribution',
            studyCode: 'TOX/26/159-GD',
            category: 'Toxicology',
            subtype: 'Chronic / Subchronic',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'ICP-MS tissue Gd assay',
            forecast: '28-Dec-2026',
            variance: '+8 d',
            ragStatus: 'Amber',
            ragReason: 'Day-90 washout cohort ongoing; ICP-MS tissue gadolinium run queued',
            studyObjective: 'Demonstrate absence of unexpected dentate-nucleus or nephrogenic Gd accumulation',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Siva',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '18-Jul-2026'
        },
        {
            study: 'Gadobutrol Liposomes — macrocyclic chelate plasma clearance PK study',
            studyCode: 'PK/26/159-IV',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'India, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Protocol finalisation',
            forecast: '20-Dec-2026',
            variance: '+11 d',
            ragStatus: 'Amber',
            ragReason: 'Agreement execution pending finalized liposomal release stability limits',
            studyObjective: 'Evaluate blood-pool residence extension & hepatobiliary vs renal excretion pathway',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Yadvendra',
            cro: 'RYT Life Sciences / Ahmedabad',
            croContact: 'Yadvendra',
            plannedStart: '12-Jan-2027'
        },
        {
            study: 'Gadobutrol Liposomes — Phase I ascending-dose healthy subject safety MRI trial',
            studyCode: 'CT/26/159-P1',
            category: 'Clinical',
            subtype: 'Phase I Trial',
            targetMarkets: 'RoW, EAEU',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '22-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'First-in-human safety & T1 signal-intensity milestone synced post rabbit crossover',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'Siva',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '22-Feb-2027'
        }
    ],
    '2026/CHM/167': [
        {
            study: 'Bupivacaine liposomal dispersion — chronic & subchronic toxicology study',
            studyCode: 'JLS-BUP-TOX',
            category: 'Toxicology',
            subtype: 'Chronic / Subchronic',
            targetMarkets: 'India, EAEU, RoW',
            studyOwner: 'Tathagata',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Final report signed',
            forecast: '22-Dec-2026',
            variance: '+5 d',
            ragStatus: 'Amber',
            ragReason: 'Acute & subacute toxicology completed; prolonged-release chronic cohort in progress',
            studyObjective: 'Compare prolonged local exposure safety of liposomal bupivacaine vs Exparel reference',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '18-Aug-2026'
        },
        {
            study: 'Bupivacaine liposomal dispersion — 72-hr prolonged release BE study',
            studyCode: 'BE/26/167-PK',
            category: 'Bioequivalence (BE)',
            subtype: 'Comparative',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 2,
            nextMilestone: 'BE NOC approval received',
            forecast: '14-Dec-2026',
            variance: '+18 d',
            ragStatus: 'Red',
            ragReason: 'Overdue: BE NOC query response delayed pending free vs encapsulated assay addendum',
            studyObjective: 'Establish partial-AUC equivalence across 0–12 h, 12–48 h, and 48–72 h windows',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Siva',
            regulatoryLead: 'Paurnima C',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '05-Jan-2027'
        },
        {
            study: 'Bupivacaine liposomal — sciatic nerve block PD analgesia comparison',
            studyCode: 'PD/26/167-NB',
            category: 'PK/PD',
            subtype: 'Pharmacodynamic BE',
            targetMarkets: 'India, EAEU',
            studyOwner: 'Dutta',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '02-Oct-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: '72-hr motor & sensory blockade duration within ±8% of Exparel',
            studyObjective: 'Verify sustained peripheral sensory block without acute burst cardiotoxicity',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Tathagata',
            regulatoryLead: 'Harika',
            cro: 'VIVO Biotech',
            croContact: 'Dr Rajaram Ravikrishnan',
            plannedStart: '28-Jun-2026'
        },
        {
            study: 'Bupivacaine liposomal — post-surgical wound infiltration clinical study',
            studyCode: 'CT/26/167-WI',
            category: 'Clinical',
            subtype: 'Comparative study',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Planned',
            lifecycleStepsCompleted: 0,
            nextMilestone: 'Protocol initiation',
            forecast: '28-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Bunionectomy pain-score (NRS AUC0-72) clinical protocol synopsis approved',
            studyLocation: 'Mumbai, India',
            studyPriority: 'High',
            formulationLead: 'Siva',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '28-Feb-2027'
        }
    ],
    '2026/CHM/219': [
        {
            study: 'Semaglutide tablets (3/7/14 mg) — fasting bioequivalence study',
            studyCode: 'BE/26/219-F',
            category: 'Bioequivalence (BE)',
            subtype: 'Fasting',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Dr. Prriya',
            lifecycle: 'Preparation',
            lifecycleStepsCompleted: 1,
            nextMilestone: 'Protocol finalisation',
            forecast: '15-Feb-2027',
            variance: '0 d',
            ragStatus: 'Green',
            ragReason: 'Oral GLP-1 formulation development underway; BE planning aligned with T0 milestone',
            studyObjective: 'Demonstrate fasting BE of SNAC-enabled Semaglutide oral tablets vs Rybelsus',
            studyLocation: 'Mumbai, India',
            studyPriority: 'Critical',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            croContact: 'Sheetal K',
            plannedStart: '01-Feb-2027'
        },
        {
            study: 'Semaglutide oral tablets — replicate fasting water-volume sensitivity PK study',
            studyCode: 'PK/26/219-WV',
            category: 'PK/PD',
            subtype: 'PK/PD Study',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 3,
            nextMilestone: 'Bioanalysis completed',
            forecast: '04-Dec-2026',
            variance: '+6 d',
            ragStatus: 'Amber',
            ragReason: 'Low-pg/mL plasma LC-MS/MS sensitivity check in repeat calibration run',
            studyObjective: 'Compare gastric SNAC permeation kinetics under standardized 120 mL water dosing',
            studyLocation: 'Ahmedabad, India',
            studyPriority: 'Critical',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Paurnima C',
            cro: 'Accutest Research Lab',
            croContact: 'Paurnima C',
            plannedStart: '05-Sep-2026'
        },
        {
            study: 'Semaglutide tablets 3 & 7 mg — strength proportionality dissolution bridging',
            studyCode: 'BA/26/219-SP',
            category: 'Bioavailability (BA)',
            subtype: 'Comparative',
            targetMarkets: 'EAEU, RoW',
            studyOwner: 'Anki Reddy',
            lifecycle: 'Ongoing',
            lifecycleStepsCompleted: 4,
            nextMilestone: 'Report QA sign-off',
            forecast: '25-Nov-2026',
            variance: '-2 d',
            ragStatus: 'Green',
            ragReason: 'SNAC release synchronization curves match Rybelsus across all 3 strengths',
            studyObjective: 'Evaluate SNAC-to-API dissolution ratio prior to pivotal 14 mg dosing',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Dr. Prriya',
            cro: 'Raptim Research',
            plannedStart: '25-Aug-2026'
        },
        {
            study: 'Semaglutide oral tablets — SNAC excipient subchronic GI tolerance (rat/dog)',
            studyCode: 'TOX/26/219-GI',
            category: 'Toxicology',
            subtype: 'Subacute',
            targetMarkets: 'EAEU, India',
            studyOwner: 'Tathagata',
            lifecycle: 'Completed',
            lifecycleStepsCompleted: 6,
            nextMilestone: 'Final report signed',
            forecast: '18-Sep-2026',
            variance: '-4 d',
            ragStatus: 'Green',
            ragReason: 'Gastric mucosal safety verified at 3x SNAC clinical exposure ratio',
            studyObjective: 'Qualify synthesized SNAC sodium salt lot for oral clinical trials',
            studyLocation: 'Hyderabad, India',
            studyPriority: 'High',
            formulationLead: 'Anki Reddy',
            regulatoryLead: 'Harika',
            cro: 'Jeeva Lifesciences',
            croContact: 'Harika',
            plannedStart: '04-Jun-2026'
        }
    ]
};

interface ClinicalTrialBriefOverride {
    rldNote: string;
    cro?: string;
}

/** Additional clinical-trial programme metadata for projects present in `projects-data.ts`. */
const CLINICAL_TRIAL_PROJECT_NOTES: Record<string, ClinicalTrialBriefOverride> = {
    '2026/CHM/059': { rldNote: 'Domestic Axitinib RLD available in inventory' },
    '2026/CHM/069': { rldNote: 'Enzalutamide RLD procurement pending for EU BE study' },
    '2026/CHM/076': { rldNote: 'Dabrafenib RLD sourcing required ahead of EAEU BE study' },
    '2026/CHM/079': { rldNote: 'Bosutinib RLD not yet procured' },
    '2026/CHM/080': { rldNote: 'Eltrombopag EU RLD procurement in queue' },
    '2026/CHM/081': { rldNote: 'Trientine RLD sourcing awaited' },
    '2026/CHM/091': { rldNote: 'Tamsulosin Australia RLD expired; replacement batch pending' },
    '2026/CHM/104': { rldNote: 'Lenvatinib RLD procurement pending' },
    '2026/CHM/113': { rldNote: 'Afatinib RLD sourcing required for EAEU/Export BE' },
    '2026/CHM/114': { rldNote: 'Pomalidomide RLD procurement pending' },
    '2026/CHM/119': { rldNote: 'Palbociclib EU RLD lot expiry flagged; replenishment needed' },
    '2026/CHM/122': { rldNote: 'Ivacaftor EU RLD expired; replacement lot requested' },
    '2026/CHM/130': { rldNote: 'Ivacaftor + Lumacaftor RLD replacement requested' },
    '2026/CHM/136': { rldNote: 'Obeticholic acid ROW RLD procurement awaited' },
    '2026/CHM/139': { rldNote: 'Vismodegib RLD available (Qty: 68); CRO selection planned' },
    '2026/CHM/173': { rldNote: 'Vismodegib Export RLD alignment with BE protocol' },
    '2026/CHM/175': { rldNote: 'Sorafenib RLD procurement pending for EAEU/RoW' },
    '2026/CHM/177': { rldNote: 'Dolutegravir RLD available (Qty: 76); ready for CRO RFP' },
    '2026/CHM/187': { rldNote: 'Lapatinib RLD procurement awaited' },
    '2026/CHM/189': { rldNote: 'Cabozantinib RLD procurement awaited' },
    '2026/CHM/208': { rldNote: 'Venetoclax RLD procurement pending' },
    '2026/CHM/210': { rldNote: 'Olaparib EAEU/RoW RLD procurement awaited' },
    '2026/CHM/213': { rldNote: 'Siponimod EAEU/RoW RLD procurement pending' },
    '2026/CHM/214': { rldNote: 'Riociguat RLD procurement pending for EAEU/RoW/Belarus' },
    '2026/CHM/216': { rldNote: 'Alogliptin RLD available (Qty: 178); protocol preparation pending' },
    '2026/CHM/217': { rldNote: 'Sacubitril + Valsartan RLD available (Qty: 103)' },
    '2026/CHM/218': { rldNote: 'Fingolimod RLD expired; replacement order required' },
    '2026/CHM/220': { rldNote: 'Delamanid RLD available (Qty: 85); ready for CRO scoping' },
    '2026/CHM/244': { rldNote: 'Tofacitinib Belarus RLD procurement awaited' }
};

interface StudyTrackTemplate {
    codeSuffix: string;
    category: string;
    subtype: string;
    titleSuffix: string;
    milestone: string;
    defaultCro: string;
}

const ORAL_STUDY_TRACKS: readonly StudyTrackTemplate[] = [
    {
        codeSuffix: 'BE-F',
        category: 'Bioequivalence (BE)',
        subtype: 'Fasting',
        titleSuffix: 'pivotal fasting BE study',
        milestone: 'Bioanalysis completed',
        defaultCro: 'Raptim Research'
    },
    {
        codeSuffix: 'BE-FED',
        category: 'Bioequivalence (BE)',
        subtype: 'Fed',
        titleSuffix: 'pivotal fed food-effect BE study',
        milestone: 'Regulatory approval received',
        defaultCro: 'Accutest Research Lab'
    },
    {
        codeSuffix: 'PK-PLT',
        category: 'PK/PD',
        subtype: 'PK/PD Study',
        titleSuffix: 'pilot PK screening cohort',
        milestone: 'Final report signed',
        defaultCro: 'RYT Life Sciences / Ahmedabad'
    },
    {
        codeSuffix: 'BA-BW',
        category: 'Bioavailability (BA)',
        subtype: 'Comparative',
        titleSuffix: 'strength-proportionality & BA bridging study',
        milestone: 'Dissolution f2 sign-off',
        defaultCro: 'Spinos'
    },
    {
        codeSuffix: 'TOX-IMP',
        category: 'Toxicology',
        subtype: 'Subacute',
        titleSuffix: 'impurity qualification subacute tox check',
        milestone: 'Pathology review completed',
        defaultCro: 'Jeeva Lifesciences'
    }
];

const PARENTERAL_STUDY_TRACKS: readonly StudyTrackTemplate[] = [
    {
        codeSuffix: 'PK-IV',
        category: 'PK/PD',
        subtype: 'PK/PD Study',
        titleSuffix: 'parenteral PK & systemic exposure study',
        milestone: 'Bioanalysis completed',
        defaultCro: 'Raptim Research Lab'
    },
    {
        codeSuffix: 'BA-Q1',
        category: 'Bioavailability (BA)',
        subtype: 'Comparative',
        titleSuffix: 'Q1/Q2 comparative bioavailability assessment',
        milestone: 'Protocol finalisation',
        defaultCro: 'Accutest Research Lab'
    },
    {
        codeSuffix: 'CT-BR',
        category: 'Clinical',
        subtype: 'Comparative study',
        titleSuffix: 'comparative clinical safety bridging',
        milestone: 'Ethics approval received',
        defaultCro: 'RYT Life Sciences / Ahmedabad'
    },
    {
        codeSuffix: 'TOX-LT',
        category: 'Toxicology',
        subtype: 'Subacute',
        titleSuffix: 'local injection tolerance & hemolysis study',
        milestone: 'Final report signed',
        defaultCro: 'Jeeva Lifesciences'
    },
    {
        codeSuffix: 'HF-DEV',
        category: 'Human factors',
        subtype: 'Usability study',
        titleSuffix: 'reconstitution / administration usability study',
        milestone: 'Simulated-use report signed',
        defaultCro: 'Trialguna'
    }
];

const INHALATION_STUDY_TRACKS: readonly StudyTrackTemplate[] = [
    {
        codeSuffix: 'PD-IN',
        category: 'PK/PD',
        subtype: 'Pharmacodynamic BE',
        titleSuffix: 'pharmacodynamic lung-deposition BE study',
        milestone: 'Spirometry AUC analysis',
        defaultCro: 'Raptim Research'
    },
    {
        codeSuffix: 'PK-CC',
        category: 'PK/PD',
        subtype: 'PK/PD Study',
        titleSuffix: 'charcoal-block pulmonary absorption PK study',
        milestone: 'Regulatory approval received',
        defaultCro: 'Spinos'
    },
    {
        codeSuffix: 'HF-DPI',
        category: 'Human factors',
        subtype: 'Usability study',
        titleSuffix: 'dry-powder inhaler handling usability trial',
        milestone: 'Patient IFU validation',
        defaultCro: 'Trialguna'
    },
    {
        codeSuffix: 'TOX-IN',
        category: 'Toxicology',
        subtype: 'Subacute',
        titleSuffix: '28-day inhalation respiratory irritation study',
        milestone: 'Final report signed',
        defaultCro: 'VIVO Biotech'
    }
];

function selectStudyTracksForProject(master: InVivoProjectMaster): readonly StudyTrackTemplate[] {
    const form = master.dosageForm.toLowerCase();
    const name = master.projectName.toLowerCase();

    if (form.includes('dpi') || name.includes('inhal')) {
        return INHALATION_STUDY_TRACKS;
    }
    if (
        (form.includes('inj') || form.includes('lyo') || form.includes('liquid') || form.includes('bottle')) &&
        !form.includes('oral')
    ) {
        return PARENTERAL_STUDY_TRACKS;
    }
    return ORAL_STUDY_TRACKS;
}

const FORECAST_DATES = [
    '12-Oct-2026',
    '08-Nov-2026',
    '26-Nov-2026',
    '14-Dec-2026',
    '18-Jan-2027',
    '22-Feb-2027'
];

function inferBaselineTrackStatus(
    master: InVivoProjectMaster,
    trackIdx: number,
    track: StudyTrackTemplate,
    ctNote?: ClinicalTrialBriefOverride
): {
    lifecycle: InVivoLifecycle;
    steps: number;
    nextMilestone: string;
    ragStatus: InVivoRagStatus;
    ragReason: string;
    variance: string;
    forecast: string;
    statusReason?: string;
} {
    const status = master.productStatus.toLowerCase();
    const report = master.bioStudyReport.toLowerCase();

    if (status === 'dropped') {
        return {
            lifecycle: 'Cancelled',
            steps: 0,
            nextMilestone: 'Study cancelled',
            ragStatus: 'Amber',
            ragReason: 'Project status marked as Dropped in portfolio master',
            variance: '0 d',
            forecast: 'TBD',
            statusReason: 'Deprioritised in portfolio review'
        };
    }
    if (status === 'hold') {
        return {
            lifecycle: 'On hold',
            steps: 1,
            nextMilestone: 'On hold review',
            ragStatus: 'Amber',
            ragReason: 'Project currently on hold per portfolio master',
            variance: '+15 d',
            forecast: 'TBD',
            statusReason: 'Awaiting management prioritization sign-off'
        };
    }

    // Spread study tracks realistically across lifecycle phases and RAG states
    if (trackIdx === 2 || report.includes('available') || status === 'development completed' || status === 'ttd submitted') {
        return {
            lifecycle: 'Completed',
            steps: 6,
            nextMilestone: 'Final report signed',
            ragStatus: 'Green',
            ragReason: 'Study completed within baseline timeline; final report archived',
            variance: '-3 d',
            forecast: '28-Sep-2026'
        };
    }

    if (trackIdx === 0 && (status === 'under development' || status === 'active')) {
        return {
            lifecycle: 'Ongoing',
            steps: 4,
            nextMilestone: track.milestone,
            ragStatus: 'Green',
            ragReason: ctNote ? ctNote.rldNote : 'Subject dosing completed; bioanalysis tracking on schedule',
            variance: '-2 d',
            forecast: FORECAST_DATES[1]
        };
    }

    if (trackIdx === 1) {
        const isDelayed = master.priority === 'Critical' || master.priority === 'High';
        return {
            lifecycle: 'Preparation',
            steps: 2,
            nextMilestone: track.milestone,
            ragStatus: isDelayed ? 'Amber' : 'Green',
            ragReason: ctNote
                ? ctNote.rldNote
                : isDelayed
                    ? 'RLD import permit & BE NOC submission +12 d behind baseline'
                    : 'Protocol finalised; CRO slot locked cleanly',
            variance: isDelayed ? '+12 d' : '0 d',
            forecast: FORECAST_DATES[3]
        };
    }

    if (trackIdx === 3) {
        return {
            lifecycle: status === 'not initiated' ? 'Planned' : 'Ongoing',
            steps: status === 'not initiated' ? 0 : 3,
            nextMilestone: track.milestone,
            ragStatus: 'Green',
            ragReason: 'Comparative bridging package aligned with regulatory filing sequence',
            variance: '0 d',
            forecast: FORECAST_DATES[2]
        };
    }

    return {
        lifecycle: trackIdx === 4 && status === 't0 completed' ? 'Preparation' : 'Planned',
        steps: trackIdx === 4 && status === 't0 completed' ? 1 : 0,
        nextMilestone: track.milestone,
        ragStatus: trackIdx === 4 && ctNote ? 'Red' : 'Green',
        ragReason:
            trackIdx === 4 && ctNote
                ? `Overdue: ${ctNote.rldNote}`
                : 'Scheduled milestone aligned with dossier submission target',
        variance: trackIdx === 4 && ctNote ? '+19 d' : '0 d',
        forecast: FORECAST_DATES[(trackIdx + 3) % FORECAST_DATES.length]
    };
}

function formatStudyCodeToken(projectCode: string): string {
    return projectCode.replace(/^2026\/RD\//i, 'IV-26-');
}

function buildBaselineStudiesForProject(master: InVivoProjectMaster): Omit<InVivoStudyItem, 'studyId'>[] {
    const tracks = selectStudyTracksForProject(master);
    const ctNote = CLINICAL_TRIAL_PROJECT_NOTES[master.projectCode];
    const baseToken = formatStudyCodeToken(master.projectCode);
    const labelLead = master.molecule || master.projectName;

    return tracks.map((track, idx) => {
        const state = inferBaselineTrackStatus(master, idx, track, ctNote);
        const marketSlice =
            idx === 0 || idx === 1
                ? master.targetMarketsLabel
                : master.targetMarkets[idx % master.targetMarkets.length] || master.targetMarketsLabel;

        return {
            projectCode: master.projectCode,
            projectName: master.projectName,
            molecule: master.molecule,
            study: `${labelLead} (${master.strength || master.dosageForm}) — ${track.titleSuffix}`,
            studyCode: `${baseToken}-${track.codeSuffix}`,
            category: track.category,
            subtype: track.subtype,
            targetMarkets: marketSlice,
            studyOwner: idx === 0 && ctNote ? 'Dr. Prriya' : idx % 2 === 0 ? master.projectOwner : 'Dr. Prriya',
            lifecycle: state.lifecycle,
            lifecycleStepsCompleted: state.steps,
            nextMilestone: state.nextMilestone,
            forecast: state.forecast,
            variance: state.variance,
            ragStatus: state.ragStatus,
            ragReason: state.ragReason,
            studyObjective: `${track.titleSuffix} for ${master.projectName} (${master.strength || master.dosageForm}) targeting ${marketSlice}`,
            studyLocation: 'Hyderabad, India',
            studyPriority: master.priority,
            formulationLead: master.projectLead || master.projectOwner,
            regulatoryLead: idx % 2 === 0 ? 'Dr. Prriya' : 'Sheetal K',
            cro: ctNote?.cro || master.bioStudyCroName || track.defaultCro,
            statusReason: state.statusReason,
            plannedStart: state.forecast === 'TBD' ? '' : state.forecast
        };
    });
}

function buildProjectMasters(): InVivoProjectMaster[] {
    const byCode = new Map<string, Omit<InVivoProjectMaster, 'masterSummary' | 'studyCount'>>();

    for (const p of projects as Project[]) {
        const markets = parseProjectMarkets(p.targetMarket || p.market);
        const existing = byCode.get(p.projectCode);

        if (existing) {
            const mergedMarkets = Array.from(new Set([...existing.targetMarkets, ...markets]));
            existing.targetMarkets = mergedMarkets;
            existing.targetMarketsLabel = mergedMarkets.join(', ');
            if (!existing.division && p.division) existing.division = p.division;
            if (!existing.bioStudyCroName && p.bioStudyCroName) existing.bioStudyCroName = p.bioStudyCroName;
            if (!existing.bioStudyReport && p.bioStudyReport) existing.bioStudyReport = p.bioStudyReport;
            if (!existing.beNoc && p.beNoc) existing.beNoc = p.beNoc;
            continue;
        }

        byCode.set(p.projectCode, {
            projectCode: p.projectCode,
            projectName: p.productName.replace(/\s+/g, ' ').trim(),
            molecule: (p.molecule || '').trim(),
            division: p.division || 'Generics / Specialty',
            dosageForm: p.dosageForm || '',
            strength: (p.strength || '').replace(/\s+/g, ' ').trim(),
            projectOwner: p.projectOwner || 'Shantaram',
            projectLead: p.projectLead || p.projectOwner || 'R. Kulkarni',
            priority: normalizeStudyPriority(p.priorityOfProject || p.priority),
            productStatus: p.productStatus || p.status || 'Active',
            targetMarkets: markets,
            targetMarketsLabel: markets.join(', '),
            bioStudyCroName: p.bioStudyCroName || '',
            bioStudyReport: p.bioStudyReport || '',
            beNoc: p.beNoc || ''
        });
    }

    return Array.from(byCode.values()).map(m => {
        const tempMaster: InVivoProjectMaster = {
            ...m,
            masterSummary: '',
            studyCount: 0
        };
        return {
            ...m,
            masterSummary: buildMasterSummary(m),
            studyCount:
                CURATED_STUDY_BLUEPRINTS[m.projectCode]?.length ??
                selectStudyTracksForProject(tempMaster).length
        };
    });
}

function buildAllStudies(masters: InVivoProjectMaster[]): InVivoStudyItem[] {
    const studies: InVivoStudyItem[] = [];
    let seq = 1;

    const nextId = (): string => `IVS-2026-${String(seq++).padStart(3, '0')}`;

    for (const master of masters) {
        const blueprints = CURATED_STUDY_BLUEPRINTS[master.projectCode];
        if (blueprints?.length) {
            for (const bp of blueprints) {
                studies.push({
                    ...bp,
                    projectCode: master.projectCode,
                    projectName: master.projectName,
                    molecule: master.molecule,
                    studyId: nextId()
                });
            }
        } else {
            for (const item of buildBaselineStudiesForProject(master)) {
                studies.push({
                    ...item,
                    studyId: nextId()
                });
            }
        }
    }

    return studies;
}

/** Deduplicated project master catalogue derived from all entries in `projects-data.ts`. */
export const IN_VIVO_PROJECT_MASTERS: InVivoProjectMaster[] = buildProjectMasters();

/** Complete portfolio-wide In-vivo Studies dataset covering every project in `projects-data.ts`. */
export const IN_VIVO_STUDIES_DATA: InVivoStudyItem[] = buildAllStudies(IN_VIVO_PROJECT_MASTERS);

/** Finds a project master record by `projectCode` (preferred) or `projectName` / alias. */
export function getInVivoProjectMaster(
    projectCode?: string,
    projectName?: string
): InVivoProjectMaster | undefined {
    const normalizedCode = (projectCode || '').trim().toLowerCase();
    if (normalizedCode) {
        const byCode = IN_VIVO_PROJECT_MASTERS.find(
            m => m.projectCode.toLowerCase() === normalizedCode
        );
        if (byCode) return byCode;
    }

    const normalizedName = (projectName || '').trim().replace(/\s+/g, ' ').toLowerCase();
    if (!normalizedName) return IN_VIVO_PROJECT_MASTERS[0];

    const aliasCode = PROJECT_NAME_ALIASES[normalizedName];
    if (aliasCode) {
        return IN_VIVO_PROJECT_MASTERS.find(m => m.projectCode === aliasCode);
    }

    return (
        IN_VIVO_PROJECT_MASTERS.find(m => m.projectName.toLowerCase() === normalizedName) ||
        IN_VIVO_PROJECT_MASTERS.find(m => m.molecule.toLowerCase() === normalizedName)
    );
}

/** Returns all In-vivo Studies linked to the given project (`projectCode` first, fallback to `projectName`). */
export function getInVivoStudiesForProject(
    projectCode?: string,
    projectName?: string
): InVivoStudyItem[] {
    const master = getInVivoProjectMaster(projectCode, projectName);
    if (master) {
        return IN_VIVO_STUDIES_DATA.filter(s => s.projectCode === master.projectCode);
    }

    const normalizedName = (projectName || '').trim().toLowerCase();
    if (!normalizedName) return [];
    return IN_VIVO_STUDIES_DATA.filter(s => s.projectName.toLowerCase() === normalizedName);
}

/** Computes the next sequential study number for generating `IVS-2026-XXX` IDs. */
export function getNextInVivoStudyNumber(studies: readonly InVivoStudyItem[] = IN_VIVO_STUDIES_DATA): number {
    let max = 0;
    for (const item of studies) {
        const m = item.studyId.match(/(\d+)$/);
        if (m) {
            max = Math.max(max, Number(m[1]));
        }
    }
    return max + 1;
}

/** Finds a single In-vivo Study by its `studyId`. */
export function getInVivoStudyById(studyId?: string): InVivoStudyItem | undefined {
    const normalized = (studyId || '').trim().toLowerCase();
    if (!normalized) return undefined;
    return IN_VIVO_STUDIES_DATA.find(item => item.studyId.toLowerCase() === normalized);
}

/** Maps lifecycle status to its shared CSS badge class. */
export function getInVivoLifecycleClass(lifecycle?: InVivoLifecycle | string): string {
    switch (lifecycle) {
        case 'Ongoing':
            return 'lifecycle-ongoing';
        case 'Preparation':
            return 'lifecycle-preparation';
        case 'Completed':
            return 'lifecycle-completed';
        case 'On hold':
            return 'lifecycle-on-hold';
        case 'Terminated':
        case 'Cancelled':
            return 'lifecycle-terminated';
        default:
            return 'lifecycle-planned';
    }
}

/** Maps RAG status to its shared CSS badge class. */
export function getInVivoRagClass(rag?: InVivoRagStatus | string): string {
    switch (rag) {
        case 'Amber':
            return 'rag-amber';
        case 'Red':
            return 'rag-red';
        case 'Grey':
            return 'rag-grey';
        default:
            return 'rag-green';
    }
}

/** Maps priority level to its CSS badge class. */
export function getInVivoPriorityClass(priority?: string): string {
    const val = (priority || '').toLowerCase();
    if (val === 'critical') return 'priority-critical';
    if (val === 'high') return 'priority-high';
    if (val === 'low') return 'priority-low';
    return 'priority-normal';
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const IN_VIVO_TEMPLATE_NAMES: Record<InVivoTemplateKey, string> = {
    BE: 'BA / BE / PK-PD',
    TOX: 'Toxicology / preclinical',
    CLIN: 'Clinical',
    HF: 'Human factors'
};

export const IN_VIVO_MILESTONE_PHASES: readonly string[] = [
    'Strategy & design',
    'CRO selection',
    'Contracting',
    'Study preparation',
    'Approvals',
    'Conduct',
    'Analysis',
    'Reporting',
    'Project integration'
];

export const IN_VIVO_EVIDENCE_REQUIRED_MILESTONES: ReadonlySet<string> = new Set([
    'Agreement signed',
    'Regulatory approval received',
    'Ethics approval received',
    'Animal ethics approval received',
    'Final report signed',
    'Study closed'
]);

export const IN_VIVO_MILESTONE_TEMPLATES: Record<InVivoTemplateKey, readonly [string, string, number][]> = {
    BE: [
        ['Strategy & design', 'Study requirement confirmed', 0],
        ['CRO selection', 'CRO selected', 20],
        ['Contracting', 'Budget approved', 30],
        ['Contracting', 'Agreement signed', 45],
        ['Study preparation', 'Protocol finalised', 60],
        ['Study preparation', 'Test material ready', 70],
        ['Study preparation', 'Comparator available', 80],
        ['Study preparation', 'Analytical readiness confirmed', 85],
        ['Approvals', 'Regulatory approval received', 110],
        ['Approvals', 'Ethics approval received', 115],
        ['Conduct', 'Study initiated', 125],
        ['Conduct', 'Last dosing', 140],
        ['Analysis', 'Analysis completed', 170],
        ['Reporting', 'Draft report received', 190],
        ['Reporting', 'Final report signed', 215],
        ['Project integration', 'Results reviewed', 225],
        ['Project integration', 'Study closed', 235]
    ],
    TOX: [
        ['Strategy & design', 'Study requirement confirmed', 0],
        ['CRO selection', 'CRO selected', 20],
        ['Contracting', 'Agreement signed', 35],
        ['Study preparation', 'Protocol finalised', 45],
        ['Study preparation', 'Test material ready', 50],
        ['Approvals', 'Animal ethics approval received', 60],
        ['Conduct', 'Study initiated', 70],
        ['Conduct', 'End of in-life phase', 100],
        ['Analysis', 'Analysis completed', 120],
        ['Reporting', 'Draft report received', 135],
        ['Reporting', 'Final report signed', 150],
        ['Project integration', 'Results reviewed', 160],
        ['Project integration', 'Study closed', 165]
    ],
    CLIN: [
        ['Strategy & design', 'Study requirement confirmed', 0],
        ['Strategy & design', 'Study design approved', 15],
        ['CRO selection', 'CRO selected', 30],
        ['Contracting', 'Budget approved', 40],
        ['Contracting', 'Agreement signed', 55],
        ['Study preparation', 'Protocol finalised', 70],
        ['Study preparation', 'Test material ready', 80],
        ['Study preparation', 'Comparator available', 90],
        ['Approvals', 'Regulatory approval received', 130],
        ['Approvals', 'Ethics approval received', 135],
        ['Conduct', 'Study initiated', 150],
        ['Conduct', 'Last dosing', 240],
        ['Analysis', 'Analysis completed', 270],
        ['Reporting', 'Draft report received', 290],
        ['Reporting', 'Final report signed', 315],
        ['Project integration', 'Results reviewed', 325],
        ['Project integration', 'Study closed', 335]
    ],
    HF: [
        ['Strategy & design', 'Study requirement confirmed', 0],
        ['CRO selection', 'CRO selected', 20],
        ['Contracting', 'Agreement signed', 35],
        ['Study preparation', 'Protocol finalised', 50],
        ['Approvals', 'Ethics approval received', 70],
        ['Conduct', 'Study initiated', 80],
        ['Conduct', 'Study sessions completed', 95],
        ['Reporting', 'Draft report received', 115],
        ['Reporting', 'Final report signed', 130],
        ['Project integration', 'Results reviewed', 140],
        ['Project integration', 'Study closed', 145]
    ]
};

export const IN_VIVO_MILESTONE_OWNERS: readonly string[] = Array.from(
    new Set([...IN_VIVO_STUDY_OWNERS, ...IN_VIVO_REGULATORY_LEADS, 'R. Kulkarni', 'Head of Development', 'CEO'])
);

export function getInVivoTemplateKey(category?: string): InVivoTemplateKey {
    const c = (category || '').toLowerCase();
    if (c.includes('toxicology') || c.includes('preclinical') || c.includes('nonclinical')) return 'TOX';
    if (c.includes('clinical')) return 'CLIN';
    if (c.includes('human factors')) return 'HF';
    return 'BE';
}

export function parseInVivoDate(value?: string | null): Date | null {
    const raw = (value || '').trim();
    if (!raw || raw === '—' || raw.toUpperCase() === 'TBD') return null;

    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
        return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
    }

    const dmy = raw.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (dmy) {
        const monthIdx = MONTH_NAMES.findIndex(m => m.toLowerCase() === dmy[2].toLowerCase());
        if (monthIdx !== -1) {
            return new Date(Date.UTC(Number(dmy[3]), monthIdx, Number(dmy[1])));
        }
    }

    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return null;
    return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
}

export function formatInVivoDate(value?: Date | string | null): string {
    if (!value) return '';
    const d = value instanceof Date ? value : parseInVivoDate(value);
    if (!d) return typeof value === 'string' ? value : '';
    const day = String(d.getUTCDate()).padStart(2, '0');
    const mon = MONTH_NAMES[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day}-${mon}-${year}`;
}

export function toIsoDateString(value?: Date | string | null): string {
    if (!value) return '';
    const d = value instanceof Date ? value : parseInVivoDate(value);
    if (!d) return '';
    return d.toISOString().slice(0, 10);
}

export function getTodayIsoDate(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function getTodayInVivoDisplay(): string {
    return formatInVivoDate(getTodayIsoDate());
}

export function addInVivoDays(base: Date | string, offsetDays: number): string {
    const d = base instanceof Date ? new Date(base.getTime()) : parseInVivoDate(base);
    if (!d) return '';
    d.setUTCDate(d.getUTCDate() + offsetDays);
    return formatInVivoDate(d);
}

export function diffInVivoDays(later?: string | null, earlier?: string | null): number | null {
    const d1 = parseInVivoDate(later);
    const d2 = parseInVivoDate(earlier);
    if (!d1 || !d2) return null;
    return Math.round((d1.getTime() - d2.getTime()) / 86400000);
}

function resolveMilestoneOwner(study: InVivoStudyItem, phase: string, milestoneName: string): string {
    if (phase === 'Approvals') return study.regulatoryLead || study.studyOwner;
    if (milestoneName === 'Test material ready') return study.formulationLead || study.studyOwner;
    return study.studyOwner;
}

function findNextMilestoneTemplateIndex(
    study: InVivoStudyItem,
    tpl: readonly [string, string, number][]
): number {
    if (study.lifecycle === 'Completed') return tpl.length;
    if (study.lifecycle === 'Planned') return 0;

    const target = (study.nextMilestone || '').toLowerCase();
    if (target) {
        const exactIdx = tpl.findIndex(([, name]) => name.toLowerCase() === target);
        if (exactIdx !== -1) return exactIdx;

        const keywordRules: [RegExp, RegExp][] = [
            [/regulatory|be noc|dcgi/, /regulatory approval/i],
            [/ethics|ec approval/, /ethics approval/i],
            [/final report/, /final report signed/i],
            [/draft report/, /draft report received/i],
            [/analysis|statistical/, /analysis completed/i],
            [/dosing|period ii|in-life/, /last dosing|end of in-life|study sessions completed/i],
            [/protocol/, /protocol finalised/i],
            [/agreement|contract/, /agreement signed/i],
            [/initiat/, /study initiated/i],
            [/comparator|rld/, /comparator available/i],
            [/biowaiver|closure|closed/, /study closed/i]
        ];

        for (const [targetRx, tplRx] of keywordRules) {
            if (targetRx.test(target)) {
                const idx = tpl.findIndex(([, name]) => tplRx.test(name));
                if (idx !== -1) return idx;
            }
        }
    }

    const ratio = Math.max(0, Math.min(5, study.lifecycleStepsCompleted)) / 6;
    return Math.min(tpl.length - 1, Math.max(1, Math.round(ratio * (tpl.length - 1))));
}

export const IN_VIVO_READINESS_STATUS_OPTIONS: readonly ReadinessStatus[] = [
    'Not started',
    'In progress',
    'Ready',
    'Blocked',
    'Not applicable'
];

export const IN_VIVO_APPROVAL_APPLICABILITY_OPTIONS: readonly ApprovalApplicability[] = [
    'To be confirmed',
    'Confirmed applicable',
    'Confirmed not applicable'
];

export const IN_VIVO_APPROVAL_STATUS_OPTIONS: readonly ApprovalStatus[] = [
    'Not submitted',
    'Submitted',
    'Approved',
    'Rejected',
    'Not applicable'
];

export const IN_VIVO_DEPENDENCY_TYPE_OPTIONS: readonly DependencyType[] = [
    'Study',
    'Approval',
    'Material',
    'Decision',
    'CRO / site',
    'Other'
];

export const IN_VIVO_DEPENDENCY_STATUS_OPTIONS: readonly { value: DependencyStatusOption; label: string }[] = [
    { value: 'Auto', label: 'Automatic (from predecessor)' },
    { value: 'Open', label: 'Open' },
    { value: 'At risk', label: 'At risk' },
    { value: 'Complete', label: 'Complete' },
    { value: 'Not applicable', label: 'Not applicable' }
];

export const IN_VIVO_IMPACT_AFFECTS_OPTIONS: readonly ImpactAffectsStatus[] = [
    'Yes',
    'No',
    'To be assessed'
];

const CURATED_MILESTONE_OVERRIDES: Record<string, Record<string, Partial<StudyMilestoneItem>>> = {
    'BE/26/038, BE/26/039': {
        'Comparator available': { actual: '28-Aug-2026', forecast: '28-Aug-2026' },
        'Regulatory approval received': {
            status: 'Blocked',
            reason: 'DCGI requires subacute toxicity reports in two animal species before BE NOC'
        }
    },
    '26/0619(G)': {
        'Final report signed': {
            forecast: '04-Nov-2026',
            reason: 'CRO QA review of final report took longer than planned'
        }
    },
    '26/0620(G)': {
        'Analysis completed': {
            forecast: '10-Nov-2026',
            reason: 'CRO advanced analysis to support BE NOC timing'
        },
        'Draft report received': {
            forecast: '14-Nov-2026',
            reason: 'Advanced with analysis'
        },
        'Final report signed': {
            forecast: '18-Nov-2026',
            reason: 'CRO committed final report by mid-Nov'
        }
    },
    'TG/PRO/26/MD/001': {
        'Ethics approval received': {
            forecast: '20-Oct-2026',
            reason: 'EC meeting date moved by the committee'
        }
    },
    'ARL-25-082': {
        'Comparator available': {
            status: 'Blocked',
            forecast: '25-Nov-2026',
            reason: 'RLD still to be purchased; procurement decision pending'
        }
    },
    'JE-CT-2026-001': {
        'Comparator available': {
            status: 'Blocked',
            reason: 'Awaiting RLD from Russia'
        }
    }
};

const CURATED_READINESS_OVERRIDES: Record<string, Partial<Record<ReadinessCategoryKey, Record<string, string>>>> = {
    'BE/26/038, BE/26/039': {
        comp: {
            'Source country / market': 'EU',
            'Procurement status': 'Available'
        }
    },
    'ARL-25-082': {
        comp: {
            'Source country / market': 'Brazil',
            'Procurement status': 'To be purchased'
        }
    },
    'JE-CT-2026-001': {
        comp: {
            'Source country / market': 'Russia',
            'Procurement status': 'Awaited'
        }
    },
    'BE/26/001-EU': {
        comp: {
            'Source country / market': 'Europe',
            'Procurement status': 'Awaited'
        }
    }
};

function findByStudyCode(allStudies: readonly InVivoStudyItem[], code: string): InVivoStudyItem | undefined {
    const target = code.toLowerCase();
    return allStudies.find(s => (s.studyCode || '').toLowerCase() === target);
}

function pickSafePredecessorMilestone(study: InVivoStudyItem): string {
    const key = getInVivoTemplateKey(study.category);
    if (key === 'TOX') return 'Final report signed';
    if (key === 'HF') return 'Final report signed';
    return study.lifecycle === 'Completed' ? 'Final report signed' : 'Protocol finalised';
}

function pickSafeSuccessorMilestone(study: InVivoStudyItem): string {
    const key = getInVivoTemplateKey(study.category);
    if (key === 'TOX') return 'Study initiated';
    if (key === 'HF') return 'Study initiated';
    return 'Regulatory approval received';
}

function buildInitialDependencies(allStudies: readonly InVivoStudyItem[]): StudyDependencyItem[] {
    const list: StudyDependencyItem[] = [];
    let nextSeq = 1;
    const nextDepId = (): string => `DEP-${String(nextSeq++).padStart(2, '0')}`;

    const semaBe = findByStudyCode(allStudies, 'BE/26/038, BE/26/039');
    const semaRat = findByStudyCode(allStudies, '26/0619(G)');
    const semaRabbit = findByStudyCode(allStudies, '26/0620(G)');

    if (semaBe && semaRat) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: semaRat.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: semaBe.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '20-Nov-2026',
            owner: 'Shantaram',
            impact: 'BE NOC application cannot be completed without the rat report',
            evidence: 'Tracker row 7 · DCGI requirement',
            status: 'Auto',
            updatedOn: '05-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    if (semaBe && semaRabbit) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: semaRabbit.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: semaBe.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '20-Nov-2026',
            owner: 'Shantaram',
            impact: 'BE NOC application cannot be completed without the rabbit report',
            evidence: 'Tracker row 7 · DCGI requirement',
            status: 'Auto',
            updatedOn: '05-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    const lambBr = findByStudyCode(allStudies, 'ARL-25-082');
    if (lambBr) {
        list.push({
            id: nextDepId(),
            externalPredecessor: 'Decision DEC-01: comparator procurement',
            decisionId: 'DEC-01',
            externalForecast: '12-Nov-2026',
            successorStudyId: lambBr.studyId,
            successorMilestone: 'Comparator available',
            type: 'Decision',
            requiredBy: '12-Nov-2026',
            owner: 'Head of Development',
            impact: 'Comparator cannot be ordered; BE start moves with it',
            evidence: '',
            status: 'Open',
            updatedOn: '02-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    const tafClin = findByStudyCode(allStudies, 'JE-CT-2026-001');
    if (tafClin) {
        list.push({
            id: nextDepId(),
            externalPredecessor: 'RLD shipment from Russia',
            externalForecast: '30-Nov-2026',
            successorStudyId: tafClin.studyId,
            successorMilestone: 'Comparator available',
            type: 'Material',
            requiredBy: '12-Nov-2026',
            owner: 'Dr. Prriya',
            impact: 'Comparative study cannot start',
            evidence: 'Supplier e-mail',
            status: 'Open',
            updatedOn: '12-Oct-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    const abiFasting = findByStudyCode(allStudies, 'BE/26/001-F');
    const abiFed = findByStudyCode(allStudies, 'BE/26/001-FED');
    const abiEu = findByStudyCode(allStudies, 'BE/26/001-EU');
    const abiPilot = findByStudyCode(allStudies, 'PK/26/001-PLT');
    const abiBaFe = findByStudyCode(allStudies, 'BA/26/001-FE');
    const abiRep = findByStudyCode(allStudies, 'BE/26/001-REP');
    const abiClinSs = findByStudyCode(allStudies, 'CT/26/001-SS');
    const abiToxRat = findByStudyCode(allStudies, 'TOX/26/001-R');

    if (abiEu && abiPilot) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiPilot.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: abiEu.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '15-Oct-2026',
            owner: 'Dr. Prriya',
            impact: 'Intra-subject CV sample-size justification required for EU BE NOC protocol',
            evidence: 'DMS/PK-26-001-PLT/CSR',
            status: 'Auto',
            updatedOn: '02-Aug-2026',
            updatedBy: 'Shantaram'
        });
    }

    // 2026/CHM/001 — Acrylic Emulsion Binder 50% Solids rich cross-study & material chain
    if (abiFasting && abiPilot) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiPilot.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: abiFasting.studyId,
            successorMilestone: 'Protocol finalised',
            type: 'Study',
            requiredBy: '05-Aug-2026',
            owner: 'Shantaram',
            impact: 'Pilot PK intra-subject CV & washout duration required to lock pivotal fasting crossover design',
            evidence: 'DMS/PK-26-001-PLT/CSR',
            status: 'Auto',
            updatedOn: '04-Aug-2026',
            updatedBy: 'Shantaram'
        });
    }

    if (abiFasting && abiToxRat) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiToxRat.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: abiFasting.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '25-Jul-2026',
            owner: 'Tathagata',
            impact: '28-day repeat-dose hepatic safety summary required for Russia / EAEU BE NOC submission',
            evidence: 'DMS/TOX-26-001-R/CSR',
            status: 'Auto',
            updatedOn: '21-Jul-2026',
            updatedBy: 'Dr. Priya'
        });
    }

    if (abiFasting) {
        list.push({
            id: nextDepId(),
            externalPredecessor: 'Zytiga 500 mg RLD COA & Russian customs clearance',
            externalForecast: '18-May-2026',
            successorStudyId: abiFasting.studyId,
            successorMilestone: 'Comparator available',
            type: 'Material',
            requiredBy: '25-May-2026',
            owner: 'Shantaram',
            impact: 'Originator comparator release certificate needed before IP dispensing and Period I dosing',
            evidence: 'QAD/RLD/2026-001-COA',
            status: 'Complete',
            updatedOn: '20-May-2026',
            updatedBy: 'Shantaram'
        });
    }

    if (abiFasting && abiFed) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiFasting.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: abiFed.studyId,
            successorMilestone: 'Analysis completed',
            type: 'Study',
            requiredBy: '30-Sep-2026',
            owner: 'Dr. Priya',
            impact: 'Fasting BE statistical CSR conclusions and T/R 90% CI bounds benchmark the fed food-effect analysis',
            evidence: 'DMS/IVS-2026-001/CSR',
            status: 'Auto',
            updatedOn: '16-Sep-2026',
            updatedBy: 'Dr. Priya'
        });
    }

    if (abiFasting && abiEu) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiFasting.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: abiEu.studyId,
            successorMilestone: 'Protocol finalised',
            type: 'Study',
            requiredBy: '25-Sep-2026',
            owner: 'Dr. Prriya',
            impact: 'Pivotal Russia fasting PK profile and sampling time-points inform EU lower-strength bridging protocol',
            evidence: 'DMS/IVS-2026-001/CSR',
            status: 'Auto',
            updatedOn: '18-Sep-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    if (abiFasting && abiClinSs) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiFasting.studyId,
            predecessorMilestone: 'Results reviewed',
            successorStudyId: abiClinSs.studyId,
            successorMilestone: 'Study design approved',
            type: 'Study',
            requiredBy: '15-Oct-2026',
            owner: 'Shantaram',
            impact: 'Fasting CSR pharmacokinetic summary defines dosing floor for steady-state clinical bridging synopsis',
            evidence: 'PK/BE-26-001/Review-Minutes',
            status: 'Auto',
            updatedOn: '28-Sep-2026',
            updatedBy: 'Shantaram'
        });
    }

    if (abiBaFe && abiRep) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: abiBaFe.studyId,
            predecessorMilestone: 'Analysis completed',
            successorStudyId: abiRep.studyId,
            successorMilestone: 'Protocol finalised',
            type: 'Study',
            requiredBy: '15-Nov-2026',
            owner: 'Dr. Prriya',
            impact: 'High-fat meal Cmax variability drives replicate sample size confirmation prior to IEC submission',
            evidence: 'PK/BA-26-001/Interim-CV',
            status: 'Auto',
            updatedOn: '06-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    if (abiEu) {
        list.push({
            id: nextDepId(),
            externalPredecessor: 'EU Zytiga 250 mg reference batch COA & QP release',
            externalForecast: '05-Dec-2026',
            successorStudyId: abiEu.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Material',
            requiredBy: '20-Nov-2026',
            owner: 'Dr. Prriya',
            impact: 'EU comparator batch certificate required before BE NOC dossier submission in Europe',
            evidence: 'EU Supply Chain Tracker #44',
            status: 'Auto',
            updatedOn: '09-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    // 2026/CHM/002 — Azacitidine Lyo
    const azaIv = findByStudyCode(allStudies, 'PK/26/002-IV');
    const azaSc = findByStudyCode(allStudies, 'BA/26/002-SC');
    const azaHl = findByStudyCode(allStudies, 'TOX/26/002-HL');
    const azaImp = findByStudyCode(allStudies, 'PRE/26/002-IMP');
    const azaPd = findByStudyCode(allStudies, 'CT/26/002-PD');

    if (azaIv && azaHl) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: azaHl.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: azaIv.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '15-Aug-2026',
            owner: 'Tathagata',
            impact: 'Particulate & hemolysis clearance required for parenteral PK study regulatory sign-off',
            evidence: 'DMS/TOX-26-002-HL/CSR',
            status: 'Auto',
            updatedOn: '10-Aug-2026',
            updatedBy: 'Tathagata'
        });
    }
    if (azaSc && azaIv) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: azaIv.studyId,
            predecessorMilestone: 'Analysis completed',
            successorStudyId: azaSc.studyId,
            successorMilestone: 'Study initiated',
            type: 'Study',
            requiredBy: '20-Nov-2026',
            owner: 'Dr. Prriya',
            impact: 'IV cold-chain bioanalytical recovery validates SC comparative assay window',
            evidence: 'Bioanalysis/PK-26-002-IV',
            status: 'Auto',
            updatedOn: '07-Nov-2026',
            updatedBy: 'Shantaram'
        });
    }
    if (azaPd && azaImp) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: azaImp.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: azaPd.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '10-Nov-2026',
            owner: 'Tathagata',
            impact: 'Degradation impurity qualification report gates multi-dose PD bridging NOC filing',
            evidence: 'DMS/PRE-26-002-IMP',
            status: 'Auto',
            updatedOn: '04-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }

    // 2026/CHM/003 — Fulvestrant PFS
    const fulvSs = findByStudyCode(allStudies, 'BE/26/003-SS');
    const fulvIm = findByStudyCode(allStudies, 'PK/26/003-IM');
    const fulvRb = findByStudyCode(allStudies, 'TOX/26/003-RB');
    const fulvBr = findByStudyCode(allStudies, 'CT/26/003-BR');
    const fulvVis = findByStudyCode(allStudies, 'BA/26/003-VIS');

    if (fulvSs && fulvRb) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: fulvRb.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: fulvSs.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '01-Sep-2026',
            owner: 'Tathagata',
            impact: 'Rabbit IM muscle tolerance histopathology required before steady-state clinical IEC filing',
            evidence: 'DMS/TOX-26-003-RB/CSR',
            status: 'Auto',
            updatedOn: '24-Aug-2026',
            updatedBy: 'Dutta'
        });
    }
    if (fulvBr && fulvIm) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: fulvIm.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: fulvBr.studyId,
            successorMilestone: 'Protocol finalised',
            type: 'Study',
            requiredBy: '20-Nov-2026',
            owner: 'Dr. Prriya',
            impact: 'Single-dose oil depot burst PK sets steady-state clinical sampling schedule',
            evidence: 'PK/26/003-IM/Interim',
            status: 'Auto',
            updatedOn: '08-Nov-2026',
            updatedBy: 'Dr. Prriya'
        });
    }
    if (fulvVis && fulvSs) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: fulvSs.studyId,
            predecessorMilestone: 'Regulatory approval received',
            successorStudyId: fulvVis.studyId,
            successorMilestone: 'Study initiated',
            type: 'Study',
            requiredBy: '05-Jan-2027',
            owner: 'Dutta',
            impact: 'Steady-state NOC protocol feedback locks viscosity bracket cohorts',
            evidence: 'Fulvestrant Programme Plan',
            status: 'Auto',
            updatedOn: '05-Nov-2026',
            updatedBy: 'Dutta'
        });
    }

    // 2026/CHM/004 — Iohexol
    const iohClin = findByStudyCode(allStudies, 'CT/26/004-IM');
    const iohRn = findByStudyCode(allStudies, 'PK/26/004-RN');
    const iohNp = findByStudyCode(allStudies, 'TOX/26/004-NP');

    if (iohClin && iohNp) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: iohNp.studyId,
            predecessorMilestone: 'Final report signed',
            successorStudyId: iohClin.studyId,
            successorMilestone: 'Regulatory approval received',
            type: 'Study',
            requiredBy: '20-Sep-2026',
            owner: 'Tathagata',
            impact: 'Preclinical nephrotoxicity & osmolality report required for contrast clinical trial NOC',
            evidence: 'DMS/TOX-26-004-NP/CSR',
            status: 'Auto',
            updatedOn: '14-Sep-2026',
            updatedBy: 'Dr. Prriya'
        });
    }
    if (iohClin && iohRn) {
        list.push({
            id: nextDepId(),
            predecessorStudyId: iohRn.studyId,
            predecessorMilestone: 'Analysis completed',
            successorStudyId: iohClin.studyId,
            successorMilestone: 'Study initiated',
            type: 'Study',
            requiredBy: '05-Dec-2026',
            owner: 'Dutta',
            impact: 'Renal clearance PK equivalence confirms safe contrast bolus rate for patient cohort',
            evidence: 'PK/26/004-RN/Summary',
            status: 'Auto',
            updatedOn: '08-Nov-2026',
            updatedBy: 'Dutta'
        });
    }

    // Auto-seed balanced dependency chains for remaining projects so every project has connected studies
    const curatedProjects = new Set([
        '2026/CHM/001',
        '2026/CHM/002',
        '2026/CHM/003',
        '2026/CHM/004',
        '2026/CHM/045',
        '2026/CHM/072',
        '2026/CHM/149'
    ]);
    const byProject = new Map<string, InVivoStudyItem[]>();
    for (const s of allStudies) {
        if (curatedProjects.has(s.projectCode)) continue;
        const arr = byProject.get(s.projectCode) || [];
        arr.push(s);
        byProject.set(s.projectCode, arr);
    }

    for (const [, group] of byProject) {
        if (!group.length) continue;
        const primary = group[0];
        const secondary = group[1];
        const tertiary = group[2];

        const baseReq = primary.plannedStart || primary.forecast;
        const reqDate =
            parseInVivoDate(baseReq) != null ? addInVivoDays(baseReq, -7) : '15-Nov-2026';

        list.push({
            id: nextDepId(),
            externalPredecessor: `${primary.molecule || primary.projectName} reference lot & COA release`,
            externalForecast:
                parseInVivoDate(baseReq) != null ? addInVivoDays(baseReq, -14) : '08-Nov-2026',
            successorStudyId: primary.studyId,
            successorMilestone: pickSafeSuccessorMilestone(primary),
            type: 'Material',
            requiredBy: reqDate,
            owner: primary.studyOwner,
            impact: `Originator RLD batch qualification required ahead of ${primary.studyCode} initiation`,
            evidence: `${primary.studyCode} Readiness Log`,
            status: 'Auto',
            updatedOn: '05-Nov-2026',
            updatedBy: primary.regulatoryLead || primary.studyOwner
        });

        if (secondary) {
            list.push({
                id: nextDepId(),
                predecessorStudyId: primary.studyId,
                predecessorMilestone: pickSafePredecessorMilestone(primary),
                successorStudyId: secondary.studyId,
                successorMilestone: pickSafeSuccessorMilestone(secondary),
                type: 'Study',
                requiredBy:
                    parseInVivoDate(secondary.plannedStart || secondary.forecast) != null
                        ? addInVivoDays(secondary.plannedStart || secondary.forecast, 7)
                        : '30-Nov-2026',
                owner: secondary.studyOwner,
                impact: `${primary.studyCode} output supports protocol & regulatory submission of ${secondary.studyCode}`,
                evidence: `Programme tracker · ${primary.projectCode}`,
                status: 'Auto',
                updatedOn: '06-Nov-2026',
                updatedBy: secondary.studyOwner
            });
        }

        if (tertiary && secondary) {
            list.push({
                id: nextDepId(),
                predecessorStudyId: secondary.studyId,
                predecessorMilestone: pickSafePredecessorMilestone(secondary),
                successorStudyId: tertiary.studyId,
                successorMilestone: pickSafeSuccessorMilestone(tertiary),
                type: 'Study',
                requiredBy:
                    parseInVivoDate(tertiary.plannedStart || tertiary.forecast) != null
                        ? addInVivoDays(tertiary.plannedStart || tertiary.forecast, 10)
                        : '15-Dec-2026',
                owner: tertiary.studyOwner,
                impact: `${secondary.studyCode} deliverables gate progression of ${tertiary.studyCode}`,
                evidence: `Programme tracker · ${primary.projectCode}`,
                status: 'Auto',
                updatedOn: '06-Nov-2026',
                updatedBy: tertiary.studyOwner
            });
        }
    }

    return list;
}

function buildInitialImpacts(allStudies: readonly InVivoStudyItem[]): StudyImpactAssessmentItem[] {
    const list: StudyImpactAssessmentItem[] = [];
    let nextSeq = 1;
    const nextImpId = (): string => `IMP-${String(nextSeq++).padStart(2, '0')}`;

    const semaBe = findByStudyCode(allStudies, 'BE/26/038, BE/26/039');
    if (semaBe) {
        list.push({
            id: nextImpId(),
            studyId: semaBe.studyId,
            programme: 'Semaglutide · India',
            affectedMilestone: 'Dossier filing (India)',
            baseline: '31-Mar-2027',
            forecast: '15-May-2027',
            affects: 'Yes',
            owner: 'R. Kulkarni',
            assessedOn: '04-Nov-2026',
            assumptions: 'BE starts within two weeks of NOC; no parallel activity can absorb the delay',
            evidence: 'Fortnightly review 03-Nov-2026'
        });
    }

    const lambBr = findByStudyCode(allStudies, 'ARL-25-082');
    if (lambBr) {
        list.push({
            id: nextImpId(),
            studyId: lambBr.studyId,
            programme: 'Amphotericin B Liposomal · Brazil',
            affectedMilestone: 'Dossier filing (Brazil)',
            baseline: '30-Jun-2027',
            forecast: '',
            affects: 'To be assessed',
            owner: 'R. Kulkarni',
            assessedOn: '',
            assumptions: 'To be assessed and confirmed',
            evidence: ''
        });
    }

    const abiFasting = findByStudyCode(allStudies, 'BE/26/001-F');
    const abiFed = findByStudyCode(allStudies, 'BE/26/001-FED');
    const abiEu = findByStudyCode(allStudies, 'BE/26/001-EU');
    const abiRep = findByStudyCode(allStudies, 'BE/26/001-REP');
    const abiBaFe = findByStudyCode(allStudies, 'BA/26/001-FE');

    if (abiEu) {
        list.push({
            id: nextImpId(),
            studyId: abiEu.studyId,
            programme: 'Acrylic Emulsion Binder 50% Solids · Europe',
            affectedMilestone: 'EU DCP submission',
            baseline: '28-Feb-2027',
            forecast: '14-Mar-2027',
            affects: 'Yes',
            owner: 'Dr. Prriya',
            assessedOn: '08-Nov-2026',
            assumptions: '14 d BE NOC variance carries directly unless EU RLD COA arrives early',
            evidence: 'EU submission tracker'
        });
    }

    // 2026/CHM/001 — Downstream product-country impacts for IVS-2026-001 (BE/26/001-F) and sibling studies
    if (abiFasting) {
        list.push(
            {
                id: nextImpId(),
                studyId: abiFasting.studyId,
                programme: 'Acrylic Emulsion Binder 50% Solids · Russia',
                affectedMilestone: 'Dossier filing (Russia)',
                baseline: '15-Oct-2026',
                forecast: '12-Oct-2026',
                affects: 'No',
                owner: 'Shantaram',
                assessedOn: '18-Sep-2026',
                assumptions: 'CSR signed 3 d ahead of baseline; Russia CTD Module 2.7/5.3 compilation on schedule',
                evidence: 'DMS/IVS-2026-001/CSR'
            },
            {
                id: nextImpId(),
                studyId: abiFasting.studyId,
                programme: 'Acrylic Emulsion Binder 50% Solids · EAEU',
                affectedMilestone: 'EAEU MA submission',
                baseline: '30-Nov-2026',
                forecast: '27-Nov-2026',
                affects: 'No',
                owner: 'Dr. Priya',
                assessedOn: '20-Sep-2026',
                assumptions: 'Bioanalytical ISR & fasting CSR sign-off accepted; EAEU harmonization sequence unaffected',
                evidence: 'Regulatory Readiness Tracker'
            }
        );
    }

    if (abiFed) {
        list.push({
            id: nextImpId(),
            studyId: abiFed.studyId,
            programme: 'Acrylic Emulsion Binder 50% Solids · EAEU',
            affectedMilestone: 'Fed BE module addendum',
            baseline: '15-Dec-2026',
            forecast: '13-Dec-2026',
            affects: 'No',
            owner: 'Dr. Priya',
            assessedOn: '05-Nov-2026',
            assumptions: 'Statistical bioanalysis QC finishing 2 d early; CTD addendum stays inside December filing slot',
            evidence: 'Raptim QC Update 05-Nov-2026'
        });
    }

    if (abiRep) {
        list.push({
            id: nextImpId(),
            studyId: abiRep.studyId,
            programme: 'Acrylic Emulsion Binder 50% Solids · RoW',
            affectedMilestone: 'RoW variation filing',
            baseline: '15-Jan-2027',
            forecast: '05-Feb-2027',
            affects: 'Yes',
            owner: 'Dr. Prriya',
            assessedOn: '07-Nov-2026',
            assumptions: '21 d IEC quorum delay shifts replicate dosing completion into early January',
            evidence: 'Spinos Ethics Escalation Note'
        });
    }

    if (abiBaFe) {
        list.push({
            id: nextImpId(),
            studyId: abiBaFe.studyId,
            programme: 'Acrylic Emulsion Binder 50% Solids · Europe',
            affectedMilestone: 'Food-effect SmPC bridging',
            baseline: '20-Jan-2027',
            forecast: '29-Jan-2027',
            affects: 'Yes',
            owner: 'Tathagata',
            assessedOn: '06-Nov-2026',
            assumptions: '9 d festive check-in delay pushes statistical PK report into late January',
            evidence: 'Mumbai Clinical Site Log'
        });
    }

    // 2026/CHM/002 — Azacitidine Lyo
    const azaIv = findByStudyCode(allStudies, 'PK/26/002-IV');
    const azaSc = findByStudyCode(allStudies, 'BA/26/002-SC');
    if (azaIv) {
        list.push({
            id: nextImpId(),
            studyId: azaIv.studyId,
            programme: 'Azacitidine Lyo · Russia',
            affectedMilestone: 'Russia injectable dossier filing',
            baseline: '18-Jan-2027',
            forecast: '18-Jan-2027',
            affects: 'No',
            owner: 'Shantaram',
            assessedOn: '05-Nov-2026',
            assumptions: 'Cold-chain bioanalysis on track; systemic PK summary locks prior to CMC stability freeze',
            evidence: 'Azacitidine Fortnightly Review'
        });
    }
    if (azaSc) {
        list.push({
            id: nextImpId(),
            studyId: azaSc.studyId,
            programme: 'Azacitidine Lyo · EAEU',
            affectedMilestone: 'EAEU SC bridging supplement',
            baseline: '10-Feb-2027',
            forecast: '21-Feb-2027',
            affects: 'Yes',
            owner: 'Dr. Prriya',
            assessedOn: '06-Nov-2026',
            assumptions: '11 d cold-chain stabilization SOP wait carries directly unless bioanalysis compresses by 5 d',
            evidence: 'Accutest Protocol Tracker'
        });
    }

    // 2026/CHM/003 — Fulvestrant PFS
    const fulvSs = findByStudyCode(allStudies, 'BE/26/003-SS');
    const fulvBr = findByStudyCode(allStudies, 'CT/26/003-BR');
    if (fulvSs) {
        list.push({
            id: nextImpId(),
            studyId: fulvSs.studyId,
            programme: 'Fulvestrant PFS · Russia',
            affectedMilestone: 'Dossier filing (Russia)',
            baseline: '30-Apr-2027',
            forecast: '14-May-2027',
            affects: 'Yes',
            owner: 'Dutta',
            assessedOn: '07-Nov-2026',
            assumptions: '14 d RLD Faslodex lot release delay shifts steady-state cohort initiation',
            evidence: 'Oncology PFS Steering Call'
        });
    }
    if (fulvBr) {
        list.push({
            id: nextImpId(),
            studyId: fulvBr.studyId,
            programme: 'Fulvestrant PFS · EAEU',
            affectedMilestone: 'EAEU clinical bridging submission',
            baseline: '25-May-2027',
            forecast: '13-Jun-2027',
            affects: 'Yes',
            owner: 'Dr. Prriya',
            assessedOn: '08-Nov-2026',
            assumptions: '19 d site cold-storage audit variance flows directly into first-patient-in date',
            evidence: 'RYT Site Audit Memo'
        });
    }

    // 2026/CHM/004 — Iohexol
    const iohClin = findByStudyCode(allStudies, 'CT/26/004-IM');
    if (iohClin) {
        list.push({
            id: nextImpId(),
            studyId: iohClin.studyId,
            programme: 'Iohexol · Russia',
            affectedMilestone: 'Russia hospital tender registration',
            baseline: '15-Mar-2027',
            forecast: '24-Mar-2027',
            affects: 'Yes',
            owner: 'Dr. Prriya',
            assessedOn: '07-Nov-2026',
            assumptions: '9 d CRO agreement & RLD consignment delay shifts patient contrast enrolment window',
            evidence: 'Contrast Media Programme Review'
        });
    }

    // Auto-seed a downstream programme impact on the primary study of every remaining project
    const curatedProjects = new Set([
        '2026/CHM/001',
        '2026/CHM/002',
        '2026/CHM/003',
        '2026/CHM/004',
        '2026/CHM/045',
        '2026/CHM/072',
        '2026/CHM/149'
    ]);
    const seenProjects = new Set<string>();
    for (const s of allStudies) {
        if (curatedProjects.has(s.projectCode) || seenProjects.has(s.projectCode)) continue;
        seenProjects.add(s.projectCode);

        const market = (s.targetMarkets || 'India')
            .split(',')
            .map(m => m.trim())
            .find(Boolean) || 'India';
        const anchorDate = parseInVivoDate(s.forecast) != null ? s.forecast : '31-Dec-2026';
        const varianceDays = parseInt((s.variance || '0').replace(/[^\d+-]/g, ''), 10) || 0;
        const baselineFiling = addInVivoDays(anchorDate, 60);
        const forecastFiling = addInVivoDays(baselineFiling, varianceDays);
        const impactsTarget = varianceDays > 0 ? 'Yes' : 'No';

        list.push({
            id: nextImpId(),
            studyId: s.studyId,
            programme: `${s.molecule || s.projectName} · ${market}`,
            affectedMilestone: `Dossier filing (${market})`,
            baseline: baselineFiling,
            forecast: forecastFiling,
            affects: impactsTarget,
            owner: s.regulatoryLead || s.studyOwner,
            assessedOn: '06-Nov-2026',
            assumptions:
                varianceDays > 0
                    ? `Current +${varianceDays} d study variance carries into ${market} submission timeline unless absorbed in reporting`
                    : `${s.studyCode} tracking on plan against ${market} filing target`,
            evidence: `${s.projectCode} Regulatory Review`
        });
    }

    return list;
}

/** Shared portfolio dependency register (§9); links appear in both linked studies. */
export const IN_VIVO_STUDY_DEPENDENCIES: StudyDependencyItem[] = buildInitialDependencies(IN_VIVO_STUDIES_DATA);

/** Shared portfolio downstream product–country impact register (§9). */
export const IN_VIVO_PROGRAMME_IMPACTS: StudyImpactAssessmentItem[] = buildInitialImpacts(IN_VIVO_STUDIES_DATA);

/** Resolves the current forecast date (dd-MMM-yyyy) of a dependency predecessor. */
export function resolveDependencyForecast(
    dep: StudyDependencyItem,
    allStudies: readonly InVivoStudyItem[] = IN_VIVO_STUDIES_DATA
): string {
    if (dep.predecessorStudyId && dep.predecessorMilestone) {
        const predStudy = allStudies.find(s => s.studyId === dep.predecessorStudyId);
        if (predStudy) {
            const ms = getOrBuildStudyMilestones(predStudy, allStudies, false).find(
                m => m.name === dep.predecessorMilestone
            );
            if (ms) {
                return ms.actual || ms.forecast || '';
            }
        }
        return '';
    }
    return dep.externalForecast || '';
}

/** Resolves dynamic dependency status; turns "At risk" automatically when forecast > required-by date (§9). */
export function resolveDependencyStatus(
    dep: StudyDependencyItem,
    allStudies: readonly InVivoStudyItem[] = IN_VIVO_STUDIES_DATA
): DependencyResolvedStatus {
    if (dep.status === 'Not applicable' || dep.status === 'Complete') {
        return dep.status;
    }

    if (dep.predecessorStudyId && dep.predecessorMilestone) {
        const predStudy = allStudies.find(s => s.studyId === dep.predecessorStudyId);
        if (predStudy) {
            const ms = getOrBuildStudyMilestones(predStudy, allStudies, false).find(
                m => m.name === dep.predecessorMilestone
            );
            if (ms?.status === 'Completed') {
                return 'Complete';
            }
        }
    }

    if (dep.decisionId) {
        const linkedDecision = IN_VIVO_STUDY_DECISIONS.find(d => d.id === dep.decisionId);
        if (linkedDecision?.status === 'Decided') {
            return 'Complete';
        }
    }

    const fc = resolveDependencyForecast(dep, allStudies);
    const fcDiff = diffInVivoDays(fc, dep.requiredBy);
    if (fcDiff != null && fcDiff > 0) {
        return 'At risk';
    }

    return dep.status === 'At risk' ? 'At risk' : 'Open';
}

export function isDependencyForecastLate(
    dep: StudyDependencyItem,
    allStudies: readonly InVivoStudyItem[] = IN_VIVO_STUDIES_DATA
): boolean {
    const fc = resolveDependencyForecast(dep, allStudies);
    const diff = diffInVivoDays(fc, dep.requiredBy);
    return diff != null && diff > 0;
}

export function getStudyDependencies(studyId?: string): {
    incoming: StudyDependencyItem[];
    outgoing: StudyDependencyItem[];
} {
    if (!studyId) return { incoming: [], outgoing: [] };
    return {
        incoming: IN_VIVO_STUDY_DEPENDENCIES.filter(d => d.successorStudyId === studyId),
        outgoing: IN_VIVO_STUDY_DEPENDENCIES.filter(d => d.predecessorStudyId === studyId)
    };
}

export function getStudyDependencyCount(studyId?: string): number {
    if (!studyId) return 0;
    const { incoming, outgoing } = getStudyDependencies(studyId);
    return incoming.length + outgoing.length;
}

export function getNextDependencyId(): string {
    let max = 0;
    for (const d of IN_VIVO_STUDY_DEPENDENCIES) {
        const m = d.id.match(/(\d+)$/);
        if (m) max = Math.max(max, Number(m[1]));
    }
    return `DEP-${String(max + 1).padStart(2, '0')}`;
}

export function upsertStudyDependency(dep: StudyDependencyItem): StudyDependencyItem {
    const idx = IN_VIVO_STUDY_DEPENDENCIES.findIndex(d => d.id === dep.id);
    if (idx !== -1) {
        IN_VIVO_STUDY_DEPENDENCIES[idx] = dep;
    } else {
        IN_VIVO_STUDY_DEPENDENCIES.push(dep);
    }
    return dep;
}

export function getStudyImpacts(studyId?: string): StudyImpactAssessmentItem[] {
    if (!studyId) return [];
    return IN_VIVO_PROGRAMME_IMPACTS.filter(i => i.studyId === studyId);
}

export function getNextImpactId(): string {
    let max = 0;
    for (const item of IN_VIVO_PROGRAMME_IMPACTS) {
        const m = item.id.match(/(\d+)$/);
        if (m) max = Math.max(max, Number(m[1]));
    }
    return `IMP-${String(max + 1).padStart(2, '0')}`;
}

export function upsertStudyImpact(impact: StudyImpactAssessmentItem): StudyImpactAssessmentItem {
    const idx = IN_VIVO_PROGRAMME_IMPACTS.findIndex(i => i.id === impact.id);
    if (idx !== -1) {
        IN_VIVO_PROGRAMME_IMPACTS[idx] = impact;
    } else {
        IN_VIVO_PROGRAMME_IMPACTS.push(impact);
    }
    return impact;
}

function mapMilestoneStatusToReadiness(m?: StudyMilestoneItem): ReadinessStatus {
    if (!m || m.status === 'Not applicable') return 'Not applicable';
    if (m.status === 'Completed') return 'Ready';
    if (m.status === 'Blocked') return 'Blocked';
    if (m.status === 'In progress') return 'In progress';
    return 'Not started';
}

function toFieldEntries(record: Record<string, string>): ReadinessFieldEntry[] {
    return Object.entries(record).map(([label, value]) => ({ label, value }));
}

function cloneReadiness(r: StudyReadinessData): StudyReadinessData {
    return {
        test: { status: r.test.status, fields: r.test.fields.map(f => ({ ...f })) },
        comp: { status: r.comp.status, fields: r.comp.fields.map(f => ({ ...f })) },
        prot: { status: r.prot.status, fields: r.prot.fields.map(f => ({ ...f })) },
        anal: { status: r.anal.status, fields: r.anal.fields.map(f => ({ ...f })) },
        approvals: r.approvals.map(a => ({ ...a }))
    };
}

/** Returns persisted study readiness or derives readiness cards and approvals from study milestones (§8.3). */
export function getOrBuildStudyReadiness(
    study: InVivoStudyItem,
    projectMaster?: InVivoProjectMaster
): StudyReadinessData {
    if (study.readiness) {
        return cloneReadiness(study.readiness);
    }

    const milestones = getOrBuildStudyMilestones(study, IN_VIVO_STUDIES_DATA, false);
    const byName = (name: string): StudyMilestoneItem | undefined => milestones.find(m => m.name === name);

    const testMs = byName('Test material ready');
    const compMs = byName('Comparator available');
    const protMs = byName('Protocol finalised');
    const analMs = byName('Analytical readiness confirmed') || byName('Analysis completed');

    const ov = CURATED_READINESS_OVERRIDES[study.studyCode] || {};
    const productName = study.molecule || projectMaster?.molecule || study.projectName;
    const strengthLabel = projectMaster?.strength || 'Per product master';

    const testFields: Record<string, string> = {
        'Product & strength': `${productName} · ${strengthLabel}`,
        'Batch number': '',
        'Required qty (unit)': '',
        'Available qty (unit)': '',
        'Manufacture / availability date': '',
        'Release status': testMs?.status === 'Completed' ? 'Released' : '',
        'Expiry / retest date': '',
        Owner: study.formulationLead || study.studyOwner || '',
        Evidence: testMs?.evidence || '',
        ...(ov.test || {})
    };

    const compFields: Record<string, string> = {
        'Product & strength': 'Reference product',
        'Source country / market': '',
        Supplier: '',
        'Batch number': '',
        'Qty required / available': '',
        'Procurement status': compMs?.status === 'Completed' ? 'Available' : '',
        'Expected availability date': compMs?.forecast || '',
        'Expiry date': '',
        Owner: study.studyOwner || '',
        Evidence: compMs?.evidence || '',
        ...(ov.comp || {})
    };

    const protStatus =
        protMs?.status === 'Completed' ? 'Approved' : protMs?.status === 'In progress' ? 'Under review' : 'Draft';
    const protFields: Record<string, string> = {
        'Protocol number & version': '',
        'Status (draft / under review / approved)': protStatus,
        'Approval date': protMs?.actual || '',
        'Link to controlled protocol': '',
        'Outstanding comments': '',
        ...(ov.prot || {})
    };

    const analFields: Record<string, string> = {
        'Laboratory / CRO': study.cro || '',
        'Method readiness status': '',
        'Qualification / validation status': '',
        'Planned readiness date': analMs?.baseline || '',
        'Actual readiness date': analMs?.actual || '',
        'Outstanding issue & owner': '',
        Evidence: '',
        ...(ov.anal || {})
    };

    const approvals: StudyApprovalItem[] = milestones
        .filter(m => m.phase === 'Approvals')
        .map(m => ({
            type: m.name.replace(/ received$/i, ''),
            authority: /Animal/i.test(m.name)
                ? 'IAEC'
                : /Ethics/i.test(m.name)
                  ? 'Ethics committee'
                  : 'National regulator (per jurisdiction)',
            applicability: 'Confirmed applicable',
            submitted: m.status !== 'Not started' && m.baseline ? addInVivoDays(m.baseline, -30) : '',
            status: m.status === 'Completed' ? 'Approved' : m.status !== 'Not started' ? 'Submitted' : 'Not submitted',
            decisionDate: m.actual || '',
            conditions: '',
            evidence: m.evidence || '',
            owner: study.regulatoryLead || study.studyOwner || ''
        }));

    return {
        test: { status: mapMilestoneStatusToReadiness(testMs), fields: toFieldEntries(testFields) },
        comp: { status: mapMilestoneStatusToReadiness(compMs), fields: toFieldEntries(compFields) },
        prot: { status: mapMilestoneStatusToReadiness(protMs), fields: toFieldEntries(protFields) },
        anal: { status: mapMilestoneStatusToReadiness(analMs), fields: toFieldEntries(analFields) },
        approvals
    };
}

function buildMilestoneDependencies(
    study: InVivoStudyItem,
    milestoneName: string,
    allStudies: readonly InVivoStudyItem[]
): StudyMilestoneDependency[] | undefined {
    const deps = IN_VIVO_STUDY_DEPENDENCIES;
    if (!deps?.length) return undefined;

    const incoming = deps
        .filter(d => d.successorStudyId === study.studyId && d.successorMilestone === milestoneName)
        .map(d => ({
            direction: 'in' as const,
            studyId: d.predecessorStudyId || d.decisionId || 'EXT',
            milestoneName: d.predecessorMilestone || d.externalPredecessor || 'External item',
            status: resolveDependencyStatus(d, allStudies)
        }));

    const outgoing = deps
        .filter(d => d.predecessorStudyId === study.studyId && d.predecessorMilestone === milestoneName)
        .map(d => ({
            direction: 'out' as const,
            studyId: d.successorStudyId,
            milestoneName: d.successorMilestone,
            status: resolveDependencyStatus(d, allStudies)
        }));

    const combined = [...incoming, ...outgoing];
    return combined.length ? combined : undefined;
}

/** Returns existing study milestones or builds a template-derived schedule aligned with study state. */
export function getOrBuildStudyMilestones(
    study: InVivoStudyItem,
    allStudies: readonly InVivoStudyItem[] = IN_VIVO_STUDIES_DATA,
    includeDependencies = true
): StudyMilestoneItem[] {
    if (study.milestones?.length) {
        if (!includeDependencies) return study.milestones;
        return study.milestones.map(m => ({
            ...m,
            dependencies: buildMilestoneDependencies(study, m.name, allStudies)
        }));
    }

    const tpl = IN_VIVO_MILESTONE_TEMPLATES[getInVivoTemplateKey(study.category)];
    const activeIdx = findNextMilestoneTemplateIndex(study, tpl);
    const slipDays = parseInt((study.variance || '0').replace(/[^+\-\d]/g, ''), 10) || 0;
    const forecastDate = parseInVivoDate(study.forecast);
    const plannedStartDate = parseInVivoDate(study.plannedStart);
    const updatedOn = study.lastUpdated || '11-Nov-2026';
    const updatedBy = study.studyOwner || 'System';
    const studyOverrides = CURATED_MILESTONE_OVERRIDES[study.studyCode] || {};

    let startDate: Date | null = null;
    if (activeIdx < tpl.length && forecastDate) {
        startDate = new Date(forecastDate.getTime());
        startDate.setUTCDate(startDate.getUTCDate() - (tpl[activeIdx][2] + slipDays));
    } else if (study.lifecycle === 'Completed' && forecastDate) {
        const reportIdx = tpl.findIndex(([, name]) => name === 'Final report signed');
        const anchorOffset = tpl[reportIdx !== -1 ? reportIdx : tpl.length - 1][2];
        startDate = new Date(forecastDate.getTime());
        startDate.setUTCDate(startDate.getUTCDate() - (anchorOffset + slipDays));
    } else if (plannedStartDate) {
        startDate = plannedStartDate;
    }

    const isBlockedStudy =
        study.lifecycle === 'On hold' ||
        /blocked|await|require|not available/i.test(study.statusReason || study.ragReason || '');

    return tpl.map(([phase, name, offset], idx) => {
        const baseline = startDate ? addInVivoDays(startDate, offset) : '';
        const isCompleted = activeIdx >= tpl.length || idx < activeIdx;
        const deps = includeDependencies ? buildMilestoneDependencies(study, name, allStudies) : undefined;
        const ov = studyOverrides[name];

        if (isCompleted) {
            const actualDate =
                study.lifecycle === 'Completed' && slipDays !== 0 && idx >= tpl.length - 3 && startDate
                    ? addInVivoDays(startDate, offset + slipDays)
                    : baseline;
            const evidenceSlug = name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            return {
                phase,
                name,
                owner: resolveMilestoneOwner(study, phase, name),
                baseline,
                forecast: ov?.forecast ?? (actualDate || baseline),
                actual: ov?.actual ?? (actualDate || baseline),
                status: ov?.status ?? 'Completed',
                reason: ov?.reason ?? '',
                evidence: ov?.evidence ?? `DMS/${study.studyId}/${evidenceSlug}`,
                notes: ov?.notes ?? '',
                updatedOn,
                updatedBy,
                earlierBaselines: [],
                dependencies: deps
            };
        }

        const forecast = ov?.forecast ?? (baseline ? addInVivoDays(baseline, slipDays) : '');
        const isCurrent = idx === activeIdx;
        let status: MilestoneStatus = 'Not started';
        if (isCurrent) {
            status = isBlockedStudy ? 'Blocked' : 'In progress';
        }
        if (ov?.status) {
            status = ov.status;
        }

        const reason =
            ov?.reason ??
            (isCurrent && (status === 'Blocked' || slipDays > 0)
                ? study.statusReason || study.ragReason || ''
                : '');

        return {
            phase,
            name,
            owner: resolveMilestoneOwner(study, phase, name),
            baseline,
            forecast,
            actual: ov?.actual ?? '',
            status,
            reason,
            evidence: ov?.evidence ?? '',
            notes: ov?.notes ?? '',
            updatedOn,
            updatedBy,
            earlierBaselines: [],
            dependencies: deps
        };
    });
}

export const IN_VIVO_RISK_CATEGORIES: readonly RiskCategory[] = [
    'Scientific',
    'Regulatory',
    'CRO',
    'Material',
    'Analytical',
    'Financial',
    'Timeline',
    'Other'
];

export const IN_VIVO_RISK_LEVELS: readonly RiskLevel[] = ['Low', 'Medium', 'High'];
export const IN_VIVO_RISK_SEVERITIES: readonly RiskSeverity[] = ['Critical', 'High', 'Medium', 'Low'];
export const IN_VIVO_RISK_STATUSES: readonly RiskStatus[] = ['Open', 'Mitigating', 'Closed'];
export const IN_VIVO_RISK_ESCALATIONS: readonly RiskEscalation[] = ['Study owner', 'Head of Development', 'CEO'];
export const IN_VIVO_ACTION_STATUSES: readonly StudyActionStatus[] = ['Open', 'In progress', 'Done'];
export const IN_VIVO_DECISION_OWNERS: readonly string[] = Array.from(
    new Set(['CEO', 'Head of Development', ...IN_VIVO_MILESTONE_OWNERS])
);
export const IN_VIVO_BUDGET_CURRENCIES: readonly BudgetCurrency[] = ['INR', 'USD', 'EUR', 'BRL'];
export const IN_VIVO_PAYMENT_STATUSES: readonly PaymentMilestoneStatus[] = ['Planned', 'Due', 'Approved', 'Paid'];
export const IN_VIVO_BUDGET_BASIS: 'Paid' | 'Invoiced' = 'Invoiced';

function buildInitialRisks(allStudies: readonly InVivoStudyItem[]): StudyRiskItem[] {
    const list: StudyRiskItem[] = [];
    let seq = 1;
    const nextId = (): string => `RSK-${String(seq++).padStart(2, '0')}`;

    const semaBe = findByStudyCode(allStudies, 'BE/26/038, BE/26/039');
    if (semaBe) {
        list.push({
            id: nextId(),
            studyId: semaBe.studyId,
            description: 'DCGI requires subacute toxicity reports in two species before granting BE NOC',
            category: 'Regulatory',
            identifiedOn: '07-Oct-2026',
            probability: 'High',
            impact: 'High',
            severity: 'Critical',
            effect: 'BE NOC milestone and India filing',
            owner: 'Dr. Prriya',
            targetDate: '20-Nov-2026',
            mitigation: 'Expedite rat and rabbit final reports',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }

    const lambBr = findByStudyCode(allStudies, 'ARL-25-082');
    if (lambBr) {
        list.push({
            id: nextId(),
            studyId: lambBr.studyId,
            description: 'Reference product not yet purchased',
            category: 'Material',
            identifiedOn: '15-Sep-2026',
            probability: 'High',
            impact: 'High',
            severity: 'High',
            effect: 'Comparator milestone, study start',
            owner: 'Dr. Prriya',
            targetDate: '12-Nov-2026',
            mitigation: 'Decision on procurement route (DEC-01)',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }

    const semaHf = findByStudyCode(allStudies, 'TG/PRO/26/MD/001');
    if (semaHf) {
        list.push({
            id: nextId(),
            studyId: semaHf.studyId,
            description: 'Ethics committee approval later than planned',
            category: 'CRO',
            identifiedOn: '21-Oct-2026',
            probability: 'Medium',
            impact: 'Medium',
            severity: 'Medium',
            effect: 'Study initiation',
            owner: 'Shantaram',
            targetDate: '10-Nov-2026',
            mitigation: 'Confirm next EC meeting date with CRO',
            status: 'Open',
            escalation: 'Study owner',
            closedOn: '',
            closureEvidence: ''
        });
    }

    const tafClin = findByStudyCode(allStudies, 'JE-CT-2026-001');
    if (tafClin) {
        list.push({
            id: nextId(),
            studyId: tafClin.studyId,
            description: 'RLD for Russia market awaited',
            category: 'Material',
            identifiedOn: '20-Sep-2026',
            probability: 'High',
            impact: 'Medium',
            severity: 'High',
            effect: 'Comparator milestone',
            owner: 'Dr. Prriya',
            targetDate: '15-Nov-2026',
            mitigation: 'Evaluate alternate sourcing route (DEC-02)',
            status: 'Open',
            escalation: 'CEO',
            closedOn: '',
            closureEvidence: ''
        });
    }

    // 2026/CHM/001 — Acrylic Emulsion Binder 50% Solids
    const abiFasting = findByStudyCode(allStudies, 'BE/26/001-F');
    const abiFed = findByStudyCode(allStudies, 'BE/26/001-FED');
    const abiEu = findByStudyCode(allStudies, 'BE/26/001-EU');
    const abiRep = findByStudyCode(allStudies, 'BE/26/001-REP');
    const abiBaFe = findByStudyCode(allStudies, 'BA/26/001-FE');

    if (abiFasting) {
        list.push(
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                description: 'EAEU mutual-recognition dossier review may request supplementary metabolite ISR table',
                category: 'Regulatory',
                identifiedOn: '18-Sep-2026',
                probability: 'Medium',
                impact: 'Medium',
                severity: 'Medium',
                effect: 'EAEU CTD Module 2.7 validation query turnaround',
                owner: 'Dr. Priya',
                targetDate: '25-Nov-2026',
                mitigation: 'Pre-assemble active metabolite Δ4-Acrylic Emulsion Binder ISR summary appendix alongside fasting CSR',
                status: 'Mitigating',
                escalation: 'Study owner',
                closedOn: '',
                closureEvidence: ''
            },
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                description: 'Zytiga 500 mg comparator customs quarantine during Russian RLD consignment transfer',
                category: 'Material',
                identifiedOn: '04-May-2026',
                probability: 'Medium',
                impact: 'High',
                severity: 'High',
                effect: 'Period I dosing start date',
                owner: 'Shantaram',
                targetDate: '28-May-2026',
                mitigation: 'Submitted apostilled import permit and temperature logger calibration ahead of arrival',
                status: 'Closed',
                escalation: 'Study owner',
                closedOn: '22-May-2026',
                closureEvidence: 'QAD/RLD/2026-001-CLR'
            }
        );
    }

    if (abiFed) {
        list.push({
            id: nextId(),
            studyId: abiFed.studyId,
            description: 'High-fat meal lipemia matrix suppression during LC-MS/MS reanalysis QC batch',
            category: 'Analytical',
            identifiedOn: '22-Oct-2026',
            probability: 'Low',
            impact: 'Medium',
            severity: 'Medium',
            effect: 'Statistical analysis completion (-2 d buffer)',
            owner: 'Dr. Priya',
            targetDate: '20-Nov-2026',
            mitigation: 'Run deuterated internal standard QC bracketing across fed subject runs',
            status: 'Mitigating',
            escalation: 'Study owner',
            closedOn: '',
            closureEvidence: ''
        });
    }

    if (abiEu) {
        list.push({
            id: nextId(),
            studyId: abiEu.studyId,
            description: 'European Zytiga 250 mg reference batch COA awaited for BE NOC submission',
            category: 'Material',
            identifiedOn: '02-Nov-2026',
            probability: 'High',
            impact: 'High',
            severity: 'High',
            effect: 'BE NOC submission (+14 d variance) & EU DCP timeline',
            owner: 'Dr. Prriya',
            targetDate: '22-Nov-2026',
            mitigation: 'Parallel courier release request logged with German QP distributor',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }

    if (abiRep) {
        list.push({
            id: nextId(),
            studyId: abiRep.studyId,
            description: 'IEC ethics quorum deferred review of 4-period replicate blood-draw volume',
            category: 'CRO',
            identifiedOn: '30-Oct-2026',
            probability: 'High',
            impact: 'High',
            severity: 'Critical',
            effect: 'Ethics approval (+21 d overdue) & RoW filing',
            owner: 'Dr. Prriya',
            targetDate: '18-Nov-2026',
            mitigation: 'Submit reduced-volume micro-sampling justification note before extraordinary IEC session',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }

    if (abiBaFe) {
        list.push({
            id: nextId(),
            studyId: abiBaFe.studyId,
            description: 'Festive volunteer check-in dropout affecting Period II fed cohort balance',
            category: 'Timeline',
            identifiedOn: '29-Oct-2026',
            probability: 'Medium',
            impact: 'Medium',
            severity: 'Medium',
            effect: 'Period II dosing shifted +9 d',
            owner: 'Tathagata',
            targetDate: '24-Nov-2026',
            mitigation: 'Over-enrol 4 standby volunteers screened for Period II admission',
            status: 'Mitigating',
            escalation: 'Study owner',
            closedOn: '',
            closureEvidence: ''
        });
    }

    // 2026/CHM/002 — Azacitidine Lyo
    const azaSc = findByStudyCode(allStudies, 'BA/26/002-SC');
    if (azaSc) {
        list.push({
            id: nextId(),
            studyId: azaSc.studyId,
            description: 'Reconstituted suspension chemical hydrolysis >2 h at bedside requires strict cold-chain SOP',
            category: 'Scientific',
            identifiedOn: '01-Nov-2026',
            probability: 'Medium',
            impact: 'High',
            severity: 'High',
            effect: 'Protocol finalisation (+11 d)',
            owner: 'Dr. Prriya',
            targetDate: '18-Nov-2026',
            mitigation: 'Validate pre-chilled WFI reconstitution SOP at Accutest clinic pharmacy',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }

    // 2026/CHM/003 — Fulvestrant PFS
    const fulvSs = findByStudyCode(allStudies, 'BE/26/003-SS');
    const fulvBr = findByStudyCode(allStudies, 'CT/26/003-BR');
    if (fulvSs) {
        list.push({
            id: nextId(),
            studyId: fulvSs.studyId,
            description: 'Originator Faslodex lot release documentation awaited before IEC filing',
            category: 'Material',
            identifiedOn: '03-Nov-2026',
            probability: 'Medium',
            impact: 'High',
            severity: 'High',
            effect: 'Regulatory & ethics approvals (+14 d)',
            owner: 'Dutta',
            targetDate: '24-Nov-2026',
            mitigation: 'Obtain certified Russian distributor batch CoA copy ahead of physical shipment',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }
    if (fulvBr) {
        list.push({
            id: nextId(),
            studyId: fulvBr.studyId,
            description: 'Oncology investigator site cold-storage excursion audit CAPA closure pending',
            category: 'CRO',
            identifiedOn: '05-Nov-2026',
            probability: 'High',
            impact: 'High',
            severity: 'Critical',
            effect: 'Site qualification (+19 d)',
            owner: 'Dr. Prriya',
            targetDate: '25-Nov-2026',
            mitigation: 'Dual digital data-logger installation verified across all 6 oncology sites',
            status: 'Open',
            escalation: 'Head of Development',
            closedOn: '',
            closureEvidence: ''
        });
    }

    // 2026/CHM/004 — Iohexol
    const iohClin = findByStudyCode(allStudies, 'CT/26/004-IM');
    if (iohClin) {
        list.push({
            id: nextId(),
            studyId: iohClin.studyId,
            description: 'Omnipaque 350 mgI/mL comparator allocation and CTA indemnity clause negotiation',
            category: 'Financial',
            identifiedOn: '02-Nov-2026',
            probability: 'Medium',
            impact: 'Medium',
            severity: 'Medium',
            effect: 'Agreement executed (+9 d)',
            owner: 'Dr. Prriya',
            targetDate: '22-Nov-2026',
            mitigation: 'Legal redlines escalated with RYT Life Sciences insurance broker',
            status: 'Mitigating',
            escalation: 'Study owner',
            closedOn: '',
            closureEvidence: ''
        });
    }

    // Baseline seeded risk for lead study in remaining portfolio projects
    const curatedProjects = new Set([
        '2026/CHM/001',
        '2026/CHM/002',
        '2026/CHM/003',
        '2026/CHM/004',
        '2026/CHM/045',
        '2026/CHM/072',
        '2026/CHM/149'
    ]);
    const seenProj = new Set<string>();
    for (const s of allStudies) {
        if (curatedProjects.has(s.projectCode) || seenProj.has(s.projectCode)) continue;
        seenProj.add(s.projectCode);
        const isCriticalOrRed = s.ragStatus === 'Red' || s.studyPriority === 'Critical';
        list.push({
            id: nextId(),
            studyId: s.studyId,
            description: s.ragReason || `Schedule and RLD readiness monitoring for ${s.studyCode}`,
            category: s.ragStatus === 'Red' ? 'Regulatory' : 'Timeline',
            identifiedOn: '02-Nov-2026',
            probability: isCriticalOrRed ? 'High' : 'Medium',
            impact: isCriticalOrRed ? 'High' : 'Medium',
            severity: s.ragStatus === 'Red' ? 'High' : 'Medium',
            effect: `${s.nextMilestone || 'Milestone schedule'} & target dossier slot`,
            owner: s.studyOwner || 'Dr. Prriya',
            targetDate: parseInVivoDate(s.forecast) != null ? s.forecast : '30-Nov-2026',
            mitigation: `Weekly tracking with ${s.cro || 'assigned CRO'} and regulatory lead`,
            status: s.lifecycle === 'Completed' ? 'Closed' : 'Open',
            escalation: s.ragStatus === 'Red' ? 'Head of Development' : 'Study owner',
            closedOn: s.lifecycle === 'Completed' ? s.forecast : '',
            closureEvidence: s.lifecycle === 'Completed' ? `DMS/${s.studyId}/CLOSURE` : ''
        });
    }

    return list;
}

function buildInitialActions(allStudies: readonly InVivoStudyItem[]): StudyActionItem[] {
    const list: StudyActionItem[] = [];
    let seq = 1;
    const nextId = (): string => `ACT-${String(seq++).padStart(2, '0')}`;

    const semaRat = findByStudyCode(allStudies, '26/0619(G)');
    if (semaRat) {
        list.push({
            id: nextId(),
            studyId: semaRat.studyId,
            description: 'Obtain signed final rat toxicity report from VIVO Biotech',
            relatedTo: 'Final report signed',
            owner: 'Shantaram',
            dueDate: '08-Nov-2026',
            status: 'Open',
            latestUpdate: 'CRO QA review in progress',
            completedOn: '',
            evidence: ''
        });
    }

    const lambBr = findByStudyCode(allStudies, 'ARL-25-082');
    if (lambBr) {
        list.push({
            id: nextId(),
            studyId: lambBr.studyId,
            description: 'Raise purchase request for Brazil RLD',
            relatedTo: 'DEC-01',
            owner: '',
            dueDate: '14-Nov-2026',
            status: 'Open',
            latestUpdate: 'Waiting for decision',
            completedOn: '',
            evidence: ''
        });
    }

    const semaHf = findByStudyCode(allStudies, 'TG/PRO/26/MD/001');
    if (semaHf) {
        list.push({
            id: nextId(),
            studyId: semaHf.studyId,
            description: 'Confirm EC meeting date with Trialguna',
            relatedTo: 'Ethics approval received',
            owner: 'Shantaram',
            dueDate: '07-Nov-2026',
            status: 'Open',
            latestUpdate: '',
            completedOn: '',
            evidence: ''
        });
    }

    const tafClin = findByStudyCode(allStudies, 'JE-CT-2026-001');
    if (tafClin) {
        list.push({
            id: nextId(),
            studyId: tafClin.studyId,
            description: 'Confirm RLD dispatch date with supplier',
            relatedTo: 'Comparator available',
            owner: 'Dr. Prriya',
            dueDate: '15-Nov-2026',
            status: 'Open',
            latestUpdate: '',
            completedOn: '',
            evidence: ''
        });
    }

    // 2026/CHM/001 — Acrylic Emulsion Binder 50% Solids
    const abiFasting = findByStudyCode(allStudies, 'BE/26/001-F');
    const abiFed = findByStudyCode(allStudies, 'BE/26/001-FED');
    const abiEu = findByStudyCode(allStudies, 'BE/26/001-EU');
    const abiRep = findByStudyCode(allStudies, 'BE/26/001-REP');

    if (abiFasting) {
        list.push(
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                description: 'Compile supplementary Δ4-Acrylic Emulsion Binder metabolite ISR appendix for EAEU dossier sequence',
                relatedTo: 'RSK-05',
                owner: 'Dr. Priya',
                dueDate: '22-Nov-2026',
                status: 'In progress',
                latestUpdate: 'Analytical QC tables 80% verified with Raptim bioanalysis lead',
                completedOn: '',
                evidence: ''
            },
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                description: 'Prepare EAEU mutual-recognition waiver vs local Armenia bridging position note',
                relatedTo: 'DEC-04',
                owner: 'Shantaram',
                dueDate: '26-Nov-2026',
                status: 'Open',
                latestUpdate: 'Awaiting regional RA precedent summary from Moscow liaison',
                completedOn: '',
                evidence: ''
            },
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                description: 'Archive signed pivotal fasting BE CSR & eCTD Module 5.3.1.2 bookmarks',
                relatedTo: 'Final report signed',
                owner: 'Shantaram',
                dueDate: '18-Sep-2026',
                status: 'Done',
                latestUpdate: 'Signed CSR & SAS statistical appendices verified in repository',
                completedOn: '16-Sep-2026',
                evidence: 'DMS/IVS-2026-001/CSR'
            }
        );
    }

    if (abiFed) {
        list.push({
            id: nextId(),
            studyId: abiFed.studyId,
            description: 'Complete ISR repeatability audit for fed-arm chromatogram batches #14–#22',
            relatedTo: 'Analysis completed',
            owner: 'Dr. Priya',
            dueDate: '24-Nov-2026',
            status: 'In progress',
            latestUpdate: '19 of 22 runs signed off by bioanalytical QA',
            completedOn: '',
            evidence: ''
        });
    }

    if (abiEu) {
        list.push({
            id: nextId(),
            studyId: abiEu.studyId,
            description: 'Escalate EU Zytiga 250 mg reference batch COA delivery with QP distributor',
            relatedTo: 'Regulatory approval received',
            owner: 'Dr. Prriya',
            dueDate: '19-Nov-2026',
            status: 'Open',
            latestUpdate: 'Courier tracking requested from Munich depot',
            completedOn: '',
            evidence: ''
        });
    }

    if (abiRep) {
        list.push({
            id: nextId(),
            studyId: abiRep.studyId,
            description: 'Submit revised phlebotomy blood-volume schedule for extraordinary IEC review',
            relatedTo: 'Ethics approval received',
            owner: 'Dr. Prriya',
            dueDate: '16-Nov-2026',
            status: 'Open',
            latestUpdate: 'Protocol amendment v1.2 under Spinos QA check',
            completedOn: '',
            evidence: ''
        });
    }

    // 2026/CHM/002 & 003 & 004
    const azaSc = findByStudyCode(allStudies, 'BA/26/002-SC');
    const fulvSs = findByStudyCode(allStudies, 'BE/26/003-SS');
    const iohClin = findByStudyCode(allStudies, 'CT/26/004-IM');

    if (azaSc) {
        list.push({
            id: nextId(),
            studyId: azaSc.studyId,
            description: 'Execute bedside cold-chain reconstitution dry-run qualification at Accutest',
            relatedTo: 'Protocol finalised',
            owner: 'Dr. Prriya',
            dueDate: '25-Nov-2026',
            status: 'In progress',
            latestUpdate: 'Ice-bath transfer timers validated at pharmacy bench',
            completedOn: '',
            evidence: ''
        });
    }
    if (fulvSs) {
        list.push({
            id: nextId(),
            studyId: fulvSs.studyId,
            description: 'Obtain certified Faslodex comparator CoA from Russian oncology wholesaler',
            relatedTo: 'Comparator available',
            owner: 'Dutta',
            dueDate: '21-Nov-2026',
            status: 'Open',
            latestUpdate: 'Batch #FL-9041 release scan requested',
            completedOn: '',
            evidence: ''
        });
    }
    if (iohClin) {
        list.push({
            id: nextId(),
            studyId: iohClin.studyId,
            description: 'Finalize CTA indemnity schedule & execute RYT Life Sciences contract',
            relatedTo: 'Agreement signed',
            owner: 'Tathagata',
            dueDate: '20-Nov-2026',
            status: 'In progress',
            latestUpdate: 'Legal indemnity cap agreed; countersignature pending',
            completedOn: '',
            evidence: ''
        });
    }

    // Baseline action for lead study in remaining portfolio projects
    const curatedProjects = new Set([
        '2026/CHM/001',
        '2026/CHM/002',
        '2026/CHM/003',
        '2026/CHM/004',
        '2026/CHM/045',
        '2026/CHM/072',
        '2026/CHM/149'
    ]);
    const seenProj = new Set<string>();
    for (const s of allStudies) {
        if (curatedProjects.has(s.projectCode) || seenProj.has(s.projectCode)) continue;
        seenProj.add(s.projectCode);
        const due = parseInVivoDate(s.forecast) != null ? addInVivoDays(s.forecast, -7) : '24-Nov-2026';
        list.push({
            id: nextId(),
            studyId: s.studyId,
            description: `Confirm ${s.nextMilestone || 'milestone readiness'} & evidence package for ${s.studyCode}`,
            relatedTo: s.nextMilestone || '',
            owner: s.studyOwner || 'Dr. Prriya',
            dueDate: due,
            status: s.lifecycle === 'Completed' ? 'Done' : s.lifecycle === 'Ongoing' ? 'In progress' : 'Open',
            latestUpdate:
                s.lifecycle === 'Completed'
                    ? 'Completed and archived per study closure checklist'
                    : `Assigned to ${s.studyOwner || 'study owner'} for weekly operational review`,
            completedOn: s.lifecycle === 'Completed' ? s.forecast : '',
            evidence: s.lifecycle === 'Completed' ? `DMS/${s.studyId}/SIGN-OFF` : ''
        });
    }

    return list;
}

function buildInitialDecisions(allStudies: readonly InVivoStudyItem[]): StudyDecisionItem[] {
    const list: StudyDecisionItem[] = [];
    let seq = 1;
    const nextId = (): string => `DEC-${String(seq++).padStart(2, '0')}`;

    const lambBr = findByStudyCode(allStudies, 'ARL-25-082');
    if (lambBr) {
        list.push({
            id: nextId(),
            studyId: lambBr.studyId,
            requested: 'Authorise comparator (RLD) procurement for the Brazil BE study',
            background:
                'Test product is ready. The study cannot start until the RLD is purchased and BE NOC is received.',
            options: 'A) Buy through Brazil market supplier · B) Buy through EU distributor',
            recommended: 'A',
            owner: 'Head of Development',
            requiredBy: '12-Nov-2026',
            critical: true,
            status: 'Open',
            decisionTaken: '',
            rationale: '',
            decidedOn: '',
            resultingAction: '',
            evidence: ''
        });
    }

    const tafClin = findByStudyCode(allStudies, 'JE-CT-2026-001');
    if (tafClin) {
        list.push({
            id: nextId(),
            studyId: tafClin.studyId,
            requested: 'Approve RLD sourcing route for the Taphalgin comparative study',
            background: 'RLD is awaited from Russia. Protocol and agreement are complete.',
            options: 'A) Keep waiting for the current supplier · B) Use an alternate sourcing agent',
            recommended: 'B',
            owner: 'CEO',
            requiredBy: '03-Nov-2026',
            critical: true,
            status: 'Open',
            decisionTaken: '',
            rationale: '',
            decidedOn: '',
            resultingAction: '',
            evidence: ''
        });
    }

    // 2026/CHM/001 — Acrylic Emulsion Binder 50% Solids
    const abiFasting = findByStudyCode(allStudies, 'BE/26/001-F');
    const abiRep = findByStudyCode(allStudies, 'BE/26/001-REP');
    const abiEu = findByStudyCode(allStudies, 'BE/26/001-EU');

    if (abiFasting) {
        list.push(
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                requested: 'Proceed with Russia CTD Module 5 filing using pivotal fasting BE CSR',
                background: 'Final fasting BE CSR signed 15-Sep-2026; 90% Cmax & AUC CI fell within 80.00–125.00%.',
                options: 'Proceed with immediate Module 2.7/5.3 lock · Wait for fed study CSR first',
                recommended: 'Proceed with immediate Module 2.7/5.3 lock',
                owner: 'Head of Development',
                requiredBy: '25-Sep-2026',
                critical: false,
                status: 'Decided',
                decisionTaken: 'Proceed',
                rationale: 'Pivotal fasting BE criteria met cleanly; file Russia primary wave without delay',
                decidedOn: '18-Sep-2026',
                resultingAction: 'Compile Module 5.3.1.2 — Shantaram',
                evidence: 'DMS/DEC/2026-ABI-01'
            },
            {
                id: nextId(),
                studyId: abiFasting.studyId,
                requested: 'Confirm EAEU mutual-recognition submission strategy (Russia reference vs Armenia bridging)',
                background:
                    'Russian BE CSR is archived; Armenia RA requested confirmation whether local confirmatory PK waiver is relied on under EAEU Decision 85.',
                options:
                    'A) Submit unified EAEU Decision 85 reliance file via Russia RMS · B) Add supplementary Armenia biowaiver memo',
                recommended: 'A',
                owner: 'Head of Development',
                requiredBy: '28-Nov-2026',
                critical: false,
                status: 'Open',
                decisionTaken: '',
                rationale: '',
                decidedOn: '',
                resultingAction: '',
                evidence: ''
            }
        );
    }

    if (abiRep) {
        list.push({
            id: nextId(),
            studyId: abiRep.studyId,
            requested: 'Approve protocol amendment switching replicate cohort to sparse PD blood volume',
            background:
                'Ethics committee requested total blood withdrawal reduction across 4-period replicate crossover.',
            options: 'A) Reduce PD sampling time-points · B) Split into partial-replicate 3-period design',
            recommended: 'A',
            owner: 'Head of Development',
            requiredBy: '18-Nov-2026',
            critical: true,
            status: 'Open',
            decisionTaken: '',
            rationale: '',
            decidedOn: '',
            resultingAction: '',
            evidence: ''
        });
    }

    if (abiEu) {
        list.push({
            id: nextId(),
            studyId: abiEu.studyId,
            requested: 'Authorise air-freight courier uplift for EU Zytiga 250 mg reference batch',
            background: 'BE NOC filing slipped +14 d awaiting German QP release certificate.',
            options: 'A) Direct priority air-freight QP release · B) Wait for scheduled consolidated lane',
            recommended: 'A',
            owner: 'CEO',
            requiredBy: '20-Nov-2026',
            critical: true,
            status: 'Open',
            decisionTaken: '',
            rationale: '',
            decidedOn: '',
            resultingAction: '',
            evidence: ''
        });
    }

    const fulvBr = findByStudyCode(allStudies, 'CT/26/003-BR');
    if (fulvBr) {
        list.push({
            id: nextId(),
            studyId: fulvBr.studyId,
            requested: 'Approve standby oncology site onboarding to protect Q1 first-patient-in date',
            background: 'Cold-storage audit CAPA delayed primary Ahmedabad site by 19 d.',
            options: 'A) Activate backup Pune site · B) Absorb 19 d delay at Ahmedabad only',
            recommended: 'A',
            owner: 'Head of Development',
            requiredBy: '24-Nov-2026',
            critical: true,
            status: 'Open',
            decisionTaken: '',
            rationale: '',
            decidedOn: '',
            resultingAction: '',
            evidence: ''
        });
    }

    return list;
}

function assignInitialBudgets(allStudies: InVivoStudyItem[]): void {
    const byCode = (code: string): InVivoStudyItem | undefined =>
        allStudies.find(s => s.studyCode === code);

    const curatedBudgets: Record<string, StudyBudgetData | null> = {
        'BE/26/001-F': {
            currency: 'INR',
            approved: 8200000,
            approvedOn: '20-May-2026',
            quote: 7950000,
            quoteVersion: 'v2',
            contracted: 7950000,
            changes: 210000,
            paid: 6528000,
            invoiced: 7344000,
            forecastToComplete: 816000,
            financeRef: 'PO-IVS-2026-001',
            payments: [
                { amount: 2385000, trigger: 'Agreement signing', dueDate: '30-May-2026', status: 'Paid' },
                { amount: 1590000, trigger: 'Protocol & IEC approval', dueDate: '25-Jun-2026', status: 'Paid' },
                { amount: 2553000, trigger: 'Last dosing & bioanalysis', dueDate: '22-Aug-2026', status: 'Paid' },
                { amount: 1632000, trigger: 'Final CSR & archival', dueDate: '25-Nov-2026', status: 'Due' }
            ]
        },
        'BE/26/001-FED': {
            currency: 'INR',
            approved: 6800000,
            approvedOn: '28-Jul-2026',
            quote: 6600000,
            quoteVersion: 'v1',
            contracted: 6600000,
            changes: 0,
            paid: 3960000,
            invoiced: 4620000,
            forecastToComplete: 1980000,
            financeRef: 'PO-IVS-2026-002',
            payments: [
                { amount: 1980000, trigger: 'Agreement signing', dueDate: '10-Aug-2026', status: 'Paid' },
                { amount: 1980000, trigger: 'Period I & II dosing complete', dueDate: '18-Oct-2026', status: 'Paid' },
                { amount: 1320000, trigger: 'Bioanalysis QC complete', dueDate: '05-Dec-2026', status: 'Approved' },
                { amount: 1320000, trigger: 'Final report signed', dueDate: '10-Jan-2027', status: 'Planned' }
            ]
        },
        'BE/26/001-EU': {
            currency: 'EUR',
            approved: 115000,
            approvedOn: '15-Sep-2026',
            quote: 112000,
            quoteVersion: 'v2',
            contracted: 112000,
            changes: 8000,
            paid: 25000,
            invoiced: 38000,
            forecastToComplete: 82000,
            financeRef: 'PO-EU-2026-003',
            payments: [
                { amount: 25000, trigger: 'Protocol & NOC submission fee', dueDate: '15-Oct-2026', status: 'Paid' },
                { amount: 45000, trigger: 'Clinical dosing initiation', dueDate: '10-Jan-2027', status: 'Planned' },
                { amount: 50000, trigger: 'Final CSR delivery', dueDate: '30-Apr-2027', status: 'Planned' }
            ]
        },
        'PK/26/001-PLT': {
            currency: 'INR',
            approved: 2900000,
            approvedOn: '20-Apr-2026',
            quote: 2750000,
            quoteVersion: 'v1',
            contracted: 2750000,
            changes: 0,
            paid: 2750000,
            invoiced: 2750000,
            forecastToComplete: 0,
            financeRef: 'PO-IVS-2026-004',
            payments: [
                { amount: 1375000, trigger: 'Study initiation', dueDate: '15-May-2026', status: 'Paid' },
                { amount: 1375000, trigger: 'Final report signed', dueDate: '10-Aug-2026', status: 'Paid' }
            ]
        },
        'CT/26/001-SS': null,
        'BE/26/038, BE/26/039': {
            currency: 'INR',
            approved: 9500000,
            approvedOn: '10-Jul-2026',
            quote: 9200000,
            quoteVersion: 'v2',
            contracted: 9200000,
            changes: 0,
            paid: 2760000,
            invoiced: 3680000,
            forecastToComplete: 5520000,
            financeRef: 'PO-IVS-001',
            payments: [
                { amount: 2760000, trigger: 'Agreement signing', dueDate: '20-Jul-2026', status: 'Paid' },
                { amount: 920000, trigger: 'Protocol approval', dueDate: '15-Oct-2026', status: 'Approved' },
                { amount: 3680000, trigger: 'Last dosing', dueDate: '05-Feb-2027', status: 'Planned' },
                { amount: 1840000, trigger: 'Final report', dueDate: '20-May-2027', status: 'Planned' }
            ]
        },
        '26/0619(G)': {
            currency: 'INR',
            approved: 1800000,
            approvedOn: '05-Jun-2026',
            quote: 1750000,
            quoteVersion: 'v1',
            contracted: 1750000,
            changes: 0,
            paid: 1225000,
            invoiced: 1575000,
            forecastToComplete: 175000,
            financeRef: 'PO-IVS-002',
            payments: [
                { amount: 875000, trigger: 'Study initiation', dueDate: '24-Aug-2026', status: 'Paid' },
                { amount: 350000, trigger: 'End of in-life', dueDate: '23-Sep-2026', status: 'Paid' },
                { amount: 525000, trigger: 'Final report', dueDate: '12-Nov-2026', status: 'Due' }
            ]
        },
        '26/0620(G)': {
            currency: 'INR',
            approved: 2100000,
            approvedOn: '05-Jun-2026',
            quote: 2050000,
            quoteVersion: 'v1',
            contracted: 2050000,
            changes: 0,
            paid: 1025000,
            invoiced: 1435000,
            forecastToComplete: 615000,
            financeRef: 'PO-IVS-003',
            payments: []
        },
        'TG/PRO/26/MD/001': {
            currency: 'INR',
            approved: 1200000,
            approvedOn: '20-Jul-2026',
            quote: 1150000,
            quoteVersion: 'v1',
            contracted: 1150000,
            changes: 0,
            paid: 345000,
            invoiced: 345000,
            forecastToComplete: 805000,
            financeRef: 'PO-IVS-004',
            payments: []
        },
        'ARL-25-082': {
            currency: 'INR',
            approved: 11000000,
            approvedOn: '20-May-2026',
            quote: 10400000,
            quoteVersion: 'v3',
            contracted: 10400000,
            changes: 350000,
            paid: 2080000,
            invoiced: 2080000,
            forecastToComplete: 8970000,
            financeRef: 'PO-IVS-005',
            payments: []
        },
        'JE-CT-2026-001': {
            currency: 'INR',
            approved: 4200000,
            approvedOn: '01-Jul-2026',
            quote: 4100000,
            quoteVersion: 'v2',
            contracted: 4100000,
            changes: 0,
            paid: 1230000,
            invoiced: 1230000,
            forecastToComplete: 2870000,
            financeRef: 'PO-IVS-008',
            payments: []
        },
        'PK/26/002-IV': {
            currency: 'INR',
            approved: 5400000,
            approvedOn: '18-Aug-2026',
            quote: 5250000,
            quoteVersion: 'v1',
            contracted: 5250000,
            changes: 0,
            paid: 2625000,
            invoiced: 3150000,
            forecastToComplete: 2100000,
            financeRef: 'PO-IVS-2026-012',
            payments: [
                { amount: 1575000, trigger: 'Protocol & initiation', dueDate: '01-Sep-2026', status: 'Paid' },
                { amount: 1575000, trigger: 'Cold-chain bioanalysis', dueDate: '15-Nov-2026', status: 'Due' },
                { amount: 2100000, trigger: 'Final CSR', dueDate: '20-Dec-2026', status: 'Planned' }
            ]
        },
        'BE/26/003-SS': {
            currency: 'INR',
            approved: 8800000,
            approvedOn: '10-Sep-2026',
            quote: 8500000,
            quoteVersion: 'v2',
            contracted: 8500000,
            changes: 450000,
            paid: 1700000,
            invoiced: 2550000,
            forecastToComplete: 6400000,
            financeRef: 'PO-IVS-2026-017',
            payments: [
                { amount: 1700000, trigger: 'Agreement signing', dueDate: '25-Sep-2026', status: 'Paid' },
                { amount: 2550000, trigger: 'First dosing cohort', dueDate: '15-Jan-2027', status: 'Planned' },
                { amount: 4700000, trigger: 'Final PK CSR', dueDate: '30-Apr-2027', status: 'Planned' }
            ]
        },
        'CT/26/004-IM': {
            currency: 'INR',
            approved: 6500000,
            approvedOn: '18-Sep-2026',
            quote: 6800000,
            quoteVersion: 'v1',
            contracted: null,
            changes: 0,
            paid: 0,
            invoiced: 0,
            forecastToComplete: 6800000,
            financeRef: '',
            payments: [
                { amount: 2040000, trigger: 'Agreement signing', dueDate: '12-Dec-2026', status: 'Planned' },
                { amount: 2720000, trigger: '50% patient enrolment', dueDate: '20-Jan-2027', status: 'Planned' },
                { amount: 2040000, trigger: 'Clinical CSR lock', dueDate: '15-Mar-2027', status: 'Planned' }
            ]
        }
    };

    for (const s of allStudies) {
        if (Object.prototype.hasOwnProperty.call(curatedBudgets, s.studyCode)) {
            s.budget = cloneStudyBudget(curatedBudgets[s.studyCode]);
            continue;
        }

        // Leave planned studies without an assigned CRO unbudgeted so empty-state flow works naturally
        if (s.lifecycle === 'Planned' && (!s.cro || s.cro === 'To be identified')) {
            s.budget = null;
            continue;
        }

        const catLower = s.category.toLowerCase();
        const baseAmt = catLower.includes('clinical')
            ? 7200000
            : catLower.includes('bioequivalence')
              ? 6400000
              : catLower.includes('human factors')
                ? 1450000
                : catLower.includes('toxicology') || catLower.includes('preclinical')
                  ? 2200000
                  : 4100000;

        const isCompleted = s.lifecycle === 'Completed';
        const isOngoing = s.lifecycle === 'Ongoing';
        const quote = Math.round(baseAmt * 0.96);
        const paid = isCompleted ? quote : isOngoing ? Math.round(quote * 0.5) : Math.round(quote * 0.25);
        const invoiced = isCompleted ? quote : isOngoing ? Math.round(quote * 0.6) : Math.round(quote * 0.25);
        const slip = parseInt((s.variance || '0').replace(/[^\d+-]/g, ''), 10) || 0;
        const overrun = slip > 10 ? Math.round(baseAmt * 0.08) : 0;
        const ftc = isCompleted ? 0 : Math.max(0, quote - invoiced + overrun);

        s.budget = {
            currency: 'INR',
            approved: baseAmt,
            approvedOn: isCompleted ? '12-Mar-2026' : '15-Jul-2026',
            quote,
            quoteVersion: 'v1',
            contracted: quote,
            changes: overrun > 0 ? Math.round(overrun / 2) : 0,
            paid,
            invoiced,
            forecastToComplete: ftc,
            financeRef: `PO-${s.studyId}`,
            payments: [
                {
                    amount: Math.round(quote * 0.3),
                    trigger: 'Agreement & initiation',
                    dueDate: '01-Aug-2026',
                    status: 'Paid'
                },
                {
                    amount: Math.round(quote * 0.4),
                    trigger: 'Conduct & bioanalysis milestone',
                    dueDate: '25-Nov-2026',
                    status: isCompleted ? 'Paid' : isOngoing ? 'Due' : 'Planned'
                },
                {
                    amount: quote - Math.round(quote * 0.3) - Math.round(quote * 0.4),
                    trigger: 'Final report signed',
                    dueDate: parseInVivoDate(s.forecast) != null ? addInVivoDays(s.forecast, 7) : '15-Jan-2027',
                    status: isCompleted ? 'Paid' : 'Planned'
                }
            ]
        };
    }
}

export const IN_VIVO_STUDY_RISKS: StudyRiskItem[] = buildInitialRisks(IN_VIVO_STUDIES_DATA);
export const IN_VIVO_STUDY_ACTIONS: StudyActionItem[] = buildInitialActions(IN_VIVO_STUDIES_DATA);
export const IN_VIVO_STUDY_DECISIONS: StudyDecisionItem[] = buildInitialDecisions(IN_VIVO_STUDIES_DATA);
assignInitialBudgets(IN_VIVO_STUDIES_DATA);

export function getStudyRisks(studyId?: string): StudyRiskItem[] {
    if (!studyId) return [];
    return IN_VIVO_STUDY_RISKS.filter(r => r.studyId === studyId);
}

export function getNextRiskId(): string {
    let max = 0;
    for (const r of IN_VIVO_STUDY_RISKS) {
        const m = r.id.match(/(\d+)$/);
        if (m) max = Math.max(max, Number(m[1]));
    }
    return `RSK-${String(max + 1).padStart(2, '0')}`;
}

export function upsertStudyRisk(risk: StudyRiskItem): StudyRiskItem {
    const idx = IN_VIVO_STUDY_RISKS.findIndex(r => r.id === risk.id);
    if (idx !== -1) {
        IN_VIVO_STUDY_RISKS[idx] = risk;
    } else {
        IN_VIVO_STUDY_RISKS.push(risk);
    }
    return risk;
}

export function getStudyActions(studyId?: string): StudyActionItem[] {
    if (!studyId) return [];
    return IN_VIVO_STUDY_ACTIONS.filter(a => a.studyId === studyId);
}

export function getNextActionId(): string {
    let max = 0;
    for (const a of IN_VIVO_STUDY_ACTIONS) {
        const m = a.id.match(/(\d+)$/);
        if (m) max = Math.max(max, Number(m[1]));
    }
    return `ACT-${String(max + 1).padStart(2, '0')}`;
}

export function upsertStudyAction(action: StudyActionItem): StudyActionItem {
    const idx = IN_VIVO_STUDY_ACTIONS.findIndex(a => a.id === action.id);
    if (idx !== -1) {
        IN_VIVO_STUDY_ACTIONS[idx] = action;
    } else {
        IN_VIVO_STUDY_ACTIONS.push(action);
    }
    return action;
}

export function getStudyDecisions(studyId?: string): StudyDecisionItem[] {
    if (!studyId) return [];
    return IN_VIVO_STUDY_DECISIONS.filter(d => d.studyId === studyId);
}

export function getNextDecisionId(): string {
    let max = 0;
    for (const d of IN_VIVO_STUDY_DECISIONS) {
        const m = d.id.match(/(\d+)$/);
        if (m) max = Math.max(max, Number(m[1]));
    }
    return `DEC-${String(max + 1).padStart(2, '0')}`;
}

export function upsertStudyDecision(decision: StudyDecisionItem): StudyDecisionItem {
    const idx = IN_VIVO_STUDY_DECISIONS.findIndex(d => d.id === decision.id);
    if (idx !== -1) {
        IN_VIVO_STUDY_DECISIONS[idx] = decision;
    } else {
        IN_VIVO_STUDY_DECISIONS.push(decision);
    }
    return decision;
}

/** Open count for the "Risks, actions & decisions" tab badge (§10). */
export function getStudyRadCount(studyId?: string): number {
    if (!studyId) return 0;
    const openRisks = IN_VIVO_STUDY_RISKS.filter(r => r.studyId === studyId && r.status !== 'Closed').length;
    const openActions = IN_VIVO_STUDY_ACTIONS.filter(a => a.studyId === studyId && a.status !== 'Done').length;
    const openDecs = IN_VIVO_STUDY_DECISIONS.filter(d => d.studyId === studyId && d.status === 'Open').length;
    return openRisks + openActions + openDecs;
}

export function cloneStudyBudget(b?: StudyBudgetData | null): StudyBudgetData | null {
    if (!b) return null;
    return {
        ...b,
        payments: (b.payments || []).map(p => ({ ...p }))
    };
}

export function getBudgetCommitted(b?: StudyBudgetData | null): number {
    if (!b) return 0;
    return (Number(b.contracted) || 0) + (Number(b.changes) || 0);
}

export function getBudgetActual(b?: StudyBudgetData | null, basis: 'Paid' | 'Invoiced' = IN_VIVO_BUDGET_BASIS): number {
    if (!b) return 0;
    return Number(basis === 'Paid' ? b.paid : b.invoiced) || 0;
}

export function getBudgetForecastTotal(b?: StudyBudgetData | null): number {
    if (!b) return 0;
    return getBudgetActual(b) + (Number(b.forecastToComplete) || 0);
}

export function getBudgetVariance(b?: StudyBudgetData | null): number {
    if (!b) return 0;
    return getBudgetForecastTotal(b) - (Number(b.approved) || 0);
}

export function formatStudyMoney(
    amount: number | null | undefined,
    currency?: BudgetCurrency | string,
    showPlus = false
): string {
    if (amount == null || Number.isNaN(Number(amount))) return '—';
    const num = Number(amount);
    const absStr = Math.abs(num).toLocaleString('en-IN');
    const sign = num < 0 ? '-' : showPlus && num > 0 ? '+' : '';
    return currency ? `${sign}${currency} ${absStr}` : `${sign}${absStr}`;
}

export const IN_VIVO_OUTCOME_OPTIONS: readonly StudyOutcomeAssessment[] = [
    'Pending',
    'Meets predefined criteria',
    'Does not meet criteria',
    'Inconclusive',
    'Not applicable'
];

export const IN_VIVO_REVIEW_STATUS_OPTIONS: readonly StudyReviewStatus[] = ['Pending', 'Completed'];

export const IN_VIVO_MGMT_DECISION_OPTIONS: readonly StudyManagementDecisionOutcome[] = [
    '—',
    'Proceed',
    'Further assessment',
    'Repeat',
    'Redesign',
    'Stop',
    'Other'
];

export const IN_VIVO_CLOSURE_STATUS_OPTIONS: readonly StudyClosureStatus[] = ['Open', 'Closed'];

export const IN_VIVO_DOCUMENT_TYPES: readonly StudyDocumentType[] = [
    'Protocol',
    'Approval',
    'Agreement',
    'Report',
    'Decision record',
    'Other'
];

export function cloneStudyResultsClosure(r?: StudyResultsClosureData | null): StudyResultsClosureData {
    if (!r) {
        return {
            outcome: 'Pending',
            review: { status: 'Pending', by: '', on: '' },
            decision: '—',
            closure: { status: 'Open', on: '', by: '' }
        };
    }
    return {
        outcome: r.outcome,
        review: { ...r.review },
        decision: r.decision,
        closure: { ...r.closure }
    };
}

export function getStudyConductStatus(
    study: InVivoStudyItem,
    milestones: readonly StudyMilestoneItem[] = getOrBuildStudyMilestones(study, IN_VIVO_STUDIES_DATA, false)
): 'Terminated' | 'Completed' | 'Ongoing' | 'Not started' {
    if (study.lifecycle === 'Terminated') return 'Terminated';
    const endMs = milestones.find(m => /Last dosing|End of in-life|sessions completed/i.test(m.name));
    const initMs = milestones.find(m => m.name === 'Study initiated');
    if (endMs?.status === 'Completed') return 'Completed';
    if (initMs?.status === 'Completed') return 'Ongoing';
    return 'Not started';
}

export function getStudyAnalysisStatus(
    study: InVivoStudyItem,
    milestones: readonly StudyMilestoneItem[] = getOrBuildStudyMilestones(study, IN_VIVO_STUDIES_DATA, false)
): 'Not applicable' | 'Completed' | 'Ongoing' | 'Not started' {
    const analysisMs = milestones.find(m => m.name === 'Analysis completed');
    if (!analysisMs || analysisMs.status === 'Not applicable') return 'Not applicable';
    if (analysisMs.status === 'Completed') return 'Completed';
    return getStudyConductStatus(study, milestones) === 'Completed' ? 'Ongoing' : 'Not started';
}

export function getStudyReportStatus(
    study: InVivoStudyItem,
    milestones: readonly StudyMilestoneItem[] = getOrBuildStudyMilestones(study, IN_VIVO_STUDIES_DATA, false)
): 'Final signed' | 'Under review' | 'Draft received' | 'Not received' {
    const finalMs = milestones.find(m => m.name === 'Final report signed');
    const draftMs = milestones.find(m => m.name === 'Draft report received');
    if (finalMs?.status === 'Completed') return 'Final signed';
    if (draftMs?.status === 'Completed') {
        return finalMs?.status === 'In progress' ? 'Under review' : 'Draft received';
    }
    return 'Not received';
}

export function getOrBuildStudyResultsClosure(study: InVivoStudyItem): StudyResultsClosureData {
    if (study.resultsClosure) {
        return cloneStudyResultsClosure(study.resultsClosure);
    }
    if (study.lifecycle === 'Completed') {
        const reviewOn =
            parseInVivoDate(study.forecast) != null ? addInVivoDays(study.forecast, 3) : '18-Sep-2026';
        const closedOn =
            parseInVivoDate(study.forecast) != null ? addInVivoDays(study.forecast, 7) : '22-Sep-2026';
        return {
            outcome: 'Meets predefined criteria',
            review: { status: 'Completed', by: 'QA reviewer', on: reviewOn },
            decision: 'Proceed',
            closure: { status: 'Closed', on: closedOn, by: 'Head of Development' }
        };
    }
    return cloneStudyResultsClosure(null);
}

function assignInitialResultsAndDocuments(allStudies: InVivoStudyItem[]): void {
    let docSeq = 1;
    const nextDocId = (): string => `DOC-${String(docSeq++).padStart(3, '0')}`;

    const curatedDocsByCode: Record<string, Omit<StudyDocumentItem, 'id'>[]> = {
        'BE/26/001-F': [
            {
                type: 'Protocol',
                title: 'Pivotal fasting BE study protocol (Acrylic Emulsion Binder 500 mg vs Zytiga)',
                ref: 'DMS/PROT/BE-26-001F',
                version: 'v2.0',
                date: '20-Jun-2026'
            },
            {
                type: 'Agreement',
                title: 'Clinical services agreement — Raptim Research',
                ref: 'DMS/AGR/RAP-2026-01',
                version: 'Signed',
                date: '15-Jun-2026'
            },
            {
                type: 'Report',
                title: 'Final integrated bioequivalence study report (CSR & SAS outputs)',
                ref: 'DMS/IVS-2026-001/CSR',
                version: 'Final',
                date: '15-Sep-2026'
            },
            {
                type: 'Decision record',
                title: 'Russia / EAEU dossier filing authorization',
                ref: 'DMS/DEC/2026-041',
                version: 'Approved',
                date: '20-Sep-2026'
            }
        ],
        'BE/26/001-FED': [
            {
                type: 'Protocol',
                title: 'Pivotal fed BE food-effect study protocol',
                ref: 'DMS/PROT/BE-26-001FED',
                version: 'v1.2',
                date: '14-Aug-2026'
            },
            {
                type: 'Approval',
                title: 'IEC ethics & CDSCO BE NOC approval packet',
                ref: 'DMS/APPR/BE-26-001FED',
                version: 'Approved',
                date: '04-Sep-2026'
            }
        ],
        'BE/26/001-EU': [
            {
                type: 'Protocol',
                title: 'Lower-strength 250 mg fasting BE study protocol',
                ref: 'DMS/PROT/BE-26-001EU',
                version: 'v1.0',
                date: '10-Oct-2026'
            }
        ],
        'PK/26/001-PLT': [
            {
                type: 'Protocol',
                title: 'Comparative PK pilot study protocol',
                ref: 'DMS/PROT/PK-26-001',
                version: 'v1.0',
                date: '08-May-2026'
            },
            {
                type: 'Report',
                title: 'Pilot PK statistical & CV% final report',
                ref: 'DMS/PK-26-001-PLT/CSR',
                version: 'Final',
                date: '02-Aug-2026'
            }
        ],
        'BE/26/038, BE/26/039': [
            {
                type: 'Protocol',
                title: 'BE study protocol',
                ref: 'DMS/PROT/BE-26-038',
                version: 'v2.0',
                date: '05-Aug-2026'
            },
            {
                type: 'Agreement',
                title: 'Clinical services agreement — Raptim',
                ref: 'DMS/AGR/RAP-2026-07',
                version: 'Signed',
                date: '16-Jul-2026'
            }
        ],
        '26/0619(G)': [
            {
                type: 'Protocol',
                title: 'Rat subacute toxicity protocol',
                ref: 'DMS/PROT/26-0619G',
                version: 'v1.0',
                date: '30-Jul-2026'
            },
            {
                type: 'Report',
                title: 'Draft study report (rat)',
                ref: 'DMS/RPT/26-0619G-D1',
                version: 'Draft 1',
                date: '28-Oct-2026'
            }
        ]
    };

    for (const s of allStudies) {
        if (!s.resultsClosure) {
            s.resultsClosure = getOrBuildStudyResultsClosure(s);
        }

        if (Object.prototype.hasOwnProperty.call(curatedDocsByCode, s.studyCode)) {
            s.documents = curatedDocsByCode[s.studyCode].map(d => ({ id: nextDocId(), ...d }));
            continue;
        }

        const docs: StudyDocumentItem[] = [];
        if (s.lifecycle !== 'Planned') {
            docs.push({
                id: nextDocId(),
                type: 'Protocol',
                title: `${s.category} study protocol (${s.studyCode})`,
                ref: `DMS/${s.studyId}/PROTOCOL`,
                version: s.lifecycle === 'Completed' ? 'Final' : 'v1.0',
                date: parseInVivoDate(s.plannedStart) != null ? formatInVivoDate(s.plannedStart) : '15-Aug-2026'
            });
        }
        if (s.lifecycle === 'Completed') {
            docs.push({
                id: nextDocId(),
                type: 'Report',
                title: `Final signed study report (${s.studyCode})`,
                ref: `DMS/${s.studyId}/FINAL-CSR`,
                version: 'Final',
                date: parseInVivoDate(s.forecast) != null ? formatInVivoDate(s.forecast) : '15-Oct-2026'
            });
        }
        s.documents = docs;
    }
}

export function getStudyDocuments(studyOrId?: InVivoStudyItem | string): StudyDocumentItem[] {
    if (!studyOrId) return [];
    const study =
        typeof studyOrId === 'string'
            ? IN_VIVO_STUDIES_DATA.find(s => s.studyId === studyOrId)
            : studyOrId;
    return study?.documents ? study.documents.map(d => ({ ...d })) : [];
}

export function addStudyDocument(
    studyId: string,
    doc: Omit<StudyDocumentItem, 'id'>
): StudyDocumentItem[] {
    const study = IN_VIVO_STUDIES_DATA.find(s => s.studyId === studyId);
    if (!study) return [];
    const existing = study.documents ? [...study.documents] : [];
    const newItem: StudyDocumentItem = {
        id: `DOC-${Date.now()}-${existing.length + 1}`,
        ...doc
    };
    const updated = [...existing, newItem];
    study.documents = updated;
    return updated;
}

export function getNowInVivoTimestamp(): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${getTodayInVivoDisplay()} ${hh}:${mm}`;
}

function buildInitialHistory(allStudies: readonly InVivoStudyItem[]): StudyHistoryEntry[] {
    const entries: StudyHistoryEntry[] = [];

    const abiFasting = findByStudyCode(allStudies, 'BE/26/001-F');
    const abiFed = findByStudyCode(allStudies, 'BE/26/001-FED');
    const abiEu = findByStudyCode(allStudies, 'BE/26/001-EU');
    const abiRep = findByStudyCode(allStudies, 'BE/26/001-REP');
    const semaBe = findByStudyCode(allStudies, 'BE/26/038, BE/26/039');
    const semaRat = findByStudyCode(allStudies, '26/0619(G)');
    const semaHf = findByStudyCode(allStudies, 'TG/PRO/26/MD/001');

    if (abiFasting) {
        entries.push(
            {
                ts: '20-Sep-2026 16:40',
                user: 'Head of Development',
                studyId: abiFasting.studyId,
                field: 'Formal closure',
                previousValue: 'Open',
                newValue: 'Closed 20-Sep-2026',
                reason: 'CSR signed, QA outcome reviewed, and eCTD Module 5 archive verified',
                approvalRef: 'DMS/DEC/2026-041'
            },
            {
                ts: '18-Sep-2026 14:15',
                user: 'QA reviewer',
                studyId: abiFasting.studyId,
                field: 'Outcome assessment',
                previousValue: 'Pending',
                newValue: 'Meets predefined criteria',
                reason: '90% CI for Cmax and AUC0-t within 80.00%–125.00% acceptance range',
                approvalRef: 'DMS/IVS-2026-001/CSR'
            },
            {
                ts: '15-Sep-2026 11:05',
                user: 'Shantaram',
                studyId: abiFasting.studyId,
                field: 'Document linked',
                previousValue: '',
                newValue: 'Report · DMS/IVS-2026-001/CSR',
                reason: 'Signed final CSR uploaded to repository',
                approvalRef: ''
            },
            {
                ts: '10-Jun-2026 09:30',
                user: 'Shantaram',
                studyId: abiFasting.studyId,
                field: 'Dependency added',
                previousValue: '',
                newValue: 'DEP-06: PK/26/001-PLT · Final report signed -> Protocol finalised',
                reason: 'Pilot intra-subject CV required to finalize pivotal sample size',
                approvalRef: ''
            }
        );
    }

    if (abiFed) {
        entries.push(
            {
                ts: '04-Nov-2026 15:20',
                user: 'Dr. Priya',
                studyId: abiFed.studyId,
                field: 'Forecast · Statistical analysis completed',
                previousValue: '30-Nov-2026',
                newValue: '28-Nov-2026',
                reason: 'Bioanalytical QC runs ahead of schedule; 19/22 batches passed',
                approvalRef: ''
            },
            {
                ts: '04-Sep-2026 10:15',
                user: 'Dr. Prriya',
                studyId: abiFed.studyId,
                field: 'Document linked',
                previousValue: '',
                newValue: 'Approval · DMS/APPR/BE-26-001FED',
                reason: 'CDSCO BE NOC & IEC approval letters linked',
                approvalRef: ''
            }
        );
    }

    if (abiEu) {
        entries.push({
            ts: '02-Nov-2026 13:10',
            user: 'Dr. Prriya',
            studyId: abiEu.studyId,
            field: 'Forecast · Regulatory approval received',
            previousValue: '04-Dec-2026',
            newValue: '18-Dec-2026',
            reason: 'RLD European Zytiga 250 mg batch CoA awaited from German distributor',
            approvalRef: ''
        });
    }

    if (abiRep) {
        entries.push({
            ts: '30-Oct-2026 17:05',
            user: 'Dr. Prriya',
            studyId: abiRep.studyId,
            field: 'Forecast · Ethics approval received',
            previousValue: '04-Nov-2026',
            newValue: '25-Nov-2026',
            reason: 'IEC quorum deferred review of 4-period blood-draw volume justification',
            approvalRef: ''
        });
    }

    if (semaBe) {
        entries.push(
            {
                ts: '05-Nov-2026 11:20',
                user: 'Dr. Prriya',
                studyId: semaBe.studyId,
                field: 'Dependency added',
                previousValue: '',
                newValue: 'DEP-01, DEP-02',
                reason: 'DCGI requirement',
                approvalRef: ''
            },
            {
                ts: '28-Oct-2026 10:12',
                user: 'Dr. Prriya',
                studyId: semaBe.studyId,
                field: 'Forecast · Regulatory approval received',
                previousValue: '19-Sep-2026',
                newValue: '10-Dec-2026',
                reason: 'DCGI requires subacute toxicity reports in two animal species before BE NOC',
                approvalRef: ''
            }
        );
    }

    if (semaRat) {
        entries.push({
            ts: '04-Nov-2026 16:05',
            user: 'Shantaram',
            studyId: semaRat.studyId,
            field: 'Forecast · Final report signed',
            previousValue: '31-Oct-2026',
            newValue: '04-Nov-2026',
            reason: 'CRO QA review of final report took longer than planned',
            approvalRef: ''
        });
    }

    if (semaHf) {
        entries.push({
            ts: '21-Oct-2026 09:40',
            user: 'Shantaram',
            studyId: semaHf.studyId,
            field: 'Forecast · Ethics approval received',
            previousValue: '23-Sep-2026',
            newValue: '20-Oct-2026',
            reason: 'EC meeting date moved by the committee',
            approvalRef: ''
        });
    }

    // Seed baseline creation/migration history for every study so History tab always has traceable baseline context
    for (const s of allStudies) {
        entries.push({
            ts: '07-Oct-2026 18:00',
            user: 'Migration',
            studyId: s.studyId,
            field: 'Pilot import',
            previousValue: '',
            newValue: `${s.studyCode} · ${s.category}`,
            reason: s.migrationOriginalText || 'Portfolio study register migration',
            approvalRef: ''
        });
    }

    return entries;
}

assignInitialResultsAndDocuments(IN_VIVO_STUDIES_DATA);
export const IN_VIVO_STUDY_HISTORY: StudyHistoryEntry[] = buildInitialHistory(IN_VIVO_STUDIES_DATA);

export function getStudyHistory(studyId?: string): StudyHistoryEntry[] {
    if (!studyId) return [];
    return IN_VIVO_STUDY_HISTORY.filter(h => h.studyId === studyId);
}

export function appendStudyHistory(entry: {
    studyId: string;
    user?: string;
    field: string;
    previousValue?: string;
    newValue?: string;
    reason?: string;
    approvalRef?: string;
    ts?: string;
}): StudyHistoryEntry {
    const item: StudyHistoryEntry = {
        ts: entry.ts || getNowInVivoTimestamp(),
        user: entry.user || 'Head of Development',
        studyId: entry.studyId,
        field: entry.field,
        previousValue: entry.previousValue ?? '',
        newValue: entry.newValue ?? '',
        reason: entry.reason ?? '',
        approvalRef: entry.approvalRef ?? ''
    };
    IN_VIVO_STUDY_HISTORY.unshift(item);
    return item;
}
