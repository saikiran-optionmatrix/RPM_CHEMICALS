import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Composition { count: number; title: string; percent: string; subtitle: string; color: string; }
interface Financial { value: string; label: string; sub: string; highlight?: string; }
interface BusinessOpportunity { project: string; product: string; division: string; market: string; size: string; share: string; revenue: string; npv: string; npvBudget: string; score: number; label: string; priority: string; pHighlight: string; }
interface Gate { status: 'passed' | 'on-time' | 'late-1-14' | 'late-14-plus' | 'blocked'; value: string | number; }
interface ExecutionHealth { project: string; subtitle: string; health: string; hScore: number; hStatus: string; schedule: number; progress: number; kit: number; cost: number; gates: Gate[]; currentGate: string; currentGateIndex: number; timelineWidth: string; timelineFinishPos: string; timelineFinishColor: string; finish: string; slip: string; slipStatus: string; }
interface ManagementDecision { project: string; market: string; situation: string; detail: string; action: string; owner: string; needDate: string; impact: string; gain: string; returnImpact: string; }

@Component({
  selector: 'app-dashboard-pfolio-drilldown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-pfolio-drilldown.component.html',
  styleUrl: './dashboard-pfolio-drilldown.component.scss',
})
export class DashboardPfolioDrilldownComponent {

  selectedDivision = 'All divisions';
  selectedDosageForm = 'All dosage forms';
  selectedMarket = 'All markets';
  selectedProject = 'All projects';
  selectedPriority = 'All priorities';
  selectedHealth = 'Good';
  selectedCurrency = 'USD ($)';
  selectedSnapshotDate = '17-Oct-2026 (weekly review)';

  divisions: string[] = ['All divisions', 'Contrast Media', 'Oncology', 'Complex Injections', 'General Injectables'];
  dosageForms: string[] = [
    'All dosage forms',
    'Tablets',
    'Lyo',
    'Solution for Injection',
    'Hard Capsules',
    'Capsules',
    'Oral suspension',
    'DPI'
  ];
  markets: string[] = ['All markets', 'Russia / EAEU', 'US', 'EU', 'Emerging Markets'];
  projects: string[] = [
    'All projects',
    '2026/RD/001 - Abiraterone Acetate',
    '2026/RD/002 - Azacitidine',
    '2026/RD/003 - Fulvestrant',
    '2026/RD/004 - Iohexol',
    '2026/RD/005 - Temozolomide'
  ];
  priorities: string[] = ['All priorities', 'Critical', 'High', 'Medium', 'Low'];
  healthStatuses: string[] = ['Good', 'Watch', 'At risk', 'All'];
  currencies: string[] = ['USD ($)', 'EUR (€)', 'INR (₹)', 'GBP (£)'];
  snapshotDates: string[] = ['17-Oct-2026 (weekly review)', '10-Oct-2026', '03-Oct-2026', '26-Sep-2026'];

  compositions: Composition[] = [
    { count: 1, title: 'Contrast Media', percent: '20%', subtitle: '$0.90 mn budget · $6.80 mn NPV · 1 at risk', color: '#8054ea' },
    { count: 4, title: 'Oncology', percent: '80%', subtitle: '$1.65 mn budget · $11.1 mn NPV · 0 at risk', color: '#0288d1' },
    { count: 0, title: 'Complex Injections', percent: '0%', subtitle: 'No projects in view', color: '#f97316' },
    { count: 0, title: 'General Injectables', percent: '0%', subtitle: 'No projects in view', color: '#10b981' }
  ];

  get selectedCurrencyCode(): string {
    return this.selectedCurrency.split(' ')[0] || 'USD';
  }

  get currencySymbol(): string {
    if (this.selectedCurrency.includes('EUR') || this.selectedCurrency.includes('€')) return '€';
    if (this.selectedCurrency.includes('INR') || this.selectedCurrency.includes('₹')) return '₹';
    if (this.selectedCurrency.includes('GBP') || this.selectedCurrency.includes('£')) return '£';
    return '$';
  }

  rawFinancials = [
    {
      num: '2.55 mn',
      label: 'Final budget',
      sub: 'approved by management\n(Project Budget field)'
    },
    {
      num: '1.52 mn',
      label: 'Actual cost to date',
      sub: '60% of budget used'
    },
    {
      num: '1.03 mn',
      label: 'Remaining budget',
      sub: 'still to be committed'
    },
    {
      num: '2.62 mn',
      label: 'Expected cost at completion',
      sub: (sym: string) => `+${sym}70k vs final budget`,
      highlight: 'danger'
    },
    {
      num: '23.2 mn',
      label: 'Expected revenue / yr',
      sub: 'market size × projected share'
    },
    {
      num: '17.9 mn',
      label: 'Projected NPV',
      sub: '7.0× the budget (NPV ÷ budget)',
      highlight: 'success'
    },
    {
      num: '8.12 mn',
      label: 'Expected profit / yr',
      sub: 'revenue × expected margin\n(35 % assumed, new field)'
    },
    {
      num: '938k',
      label: 'Investment at risk',
      sub: 'spent on projects with\nexecution health At risk',
      highlight: 'danger'
    },
    {
      num: '1.30 mn',
      label: 'Return at risk',
      sub: 'revenue delayed by forecast\nslip',
      highlight: 'warning'
    }
  ];

  get financials(): Financial[] {
    const sym = this.currencySymbol;
    return this.rawFinancials.map(f => ({
      value: `${sym}${f.num}`,
      label: f.label,
      sub: typeof f.sub === 'function' ? f.sub(sym) : f.sub,
      highlight: f.highlight
    }));
  }

  opportunities: BusinessOpportunity[] = [
    { project: '2026/RD/004', product: 'Iohexol solution for injection', division: 'Contrast Media\nSolution for Injection · 300 & 350 mg/mL', market: 'Russia /\nEAEU', size: '$120 mn', share: '7%', revenue: '$8.40 mn', npv: '$6.80 mn', npvBudget: '7.6×', score: 94, label: 'High', priority: 'Critical', pHighlight: 'matches score' },
    { project: '2026/RD/001', product: 'Abiraterone Acetate Film Coated', division: 'Oncology\nTablets · 250 mg & 500 mg', market: 'Russia /\nEAEU', size: '$65 mn', share: '6%', revenue: '$5.10 mn', npv: '$4.20 mn', npvBudget: '9.3×', score: 72, label: 'High', priority: 'High', pHighlight: 'matches score' },
    { project: '2026/RD/003', product: 'Fulvestrant solution for injection\n(Prefilled Syringe)', division: 'Oncology\nSolution for Injection · 250 mg PFS', market: 'Russia /\nEAEU', size: '$48 mn', share: '10%', revenue: '$4.80 mn', npv: '$3.60 mn', npvBudget: '5.5×', score: 56, label: 'Medium', priority: 'Critical', pHighlight: 'above score (Medium)' },
    { project: '2026/RD/002', product: 'Azacitidine Powder for Suspension\nfor Injection', division: 'Oncology\nLyo · 25 mg/mL (100 mg/vial)', market: 'Russia /\nEAEU', size: '$32 mn', share: '8%', revenue: '$2.60 mn', npv: '$1.90 mn', npvBudget: '6.3×', score: 41, label: 'Low', priority: 'Medium', pHighlight: 'above score (Low)' },
    { project: '2026/RD/005', product: 'Temozolomide Hard Gelatin\nCapsules', division: 'Oncology\nHard Capsules · 5–250 mg', market: 'Russia /\nEAEU', size: '$26 mn', share: '9%', revenue: '$2.30 mn', npv: '$1.40 mn', npvBudget: '5.6×', score: 24, label: 'Low', priority: 'Medium', pHighlight: 'above score (Low)' }
  ];

  executionHealthData: ExecutionHealth[] = [
    {
      project: '2026/RD/001', subtitle: 'Abiraterone · High',
      health: 'Watch', hScore: 86, hStatus: 'warning',
      schedule: 100, progress: 100, kit: 50, cost: 92,
      gates: [
        { status: 'passed', value: '✓' }, { status: 'passed', value: '✓' },
        { status: 'on-time', value: '0' }, { status: 'on-time', value: '0' },
        { status: 'on-time', value: '0' }, { status: 'on-time', value: '0' }, { status: 'on-time', value: '0' }
      ],
      currentGate: 'G3', currentGateIndex: 2,
      timelineWidth: '50%', timelineFinishPos: '100%', timelineFinishColor: '#26a69a',
      finish: '03-Jan-2028', slip: '-4 d (early)', slipStatus: 'success'
    },
    {
      project: '2026/RD/002', subtitle: 'Azacitidine · Medium',
      health: 'Watch', hScore: 72, hStatus: 'warning',
      schedule: 70, progress: 80, kit: 51, cost: 100,
      gates: [
        { status: 'passed', value: '✓' }, { status: 'blocked', value: '13' },
        { status: 'blocked', value: '15' }, { status: 'blocked', value: '15' },
        { status: 'late-14-plus', value: '15' }, { status: 'late-14-plus', value: '15' }, { status: 'late-14-plus', value: '15' }
      ],
      currentGate: 'G2', currentGateIndex: 1,
      timelineWidth: '60%', timelineFinishPos: '100%', timelineFinishColor: '#ef5350',
      finish: '30-Dec-2028', slip: '+15 d vs baseline', slipStatus: 'danger'
    },
    {
      project: '2026/RD/003', subtitle: 'Fulvestrant · Critical',
      health: 'Watch', hScore: 75, hStatus: 'warning',
      schedule: 78, progress: 88, kit: 49, cost: 93,
      gates: [
        { status: 'passed', value: '✓' }, { status: 'passed', value: '✓' },
        { status: 'late-14-plus', value: '21' }, { status: 'blocked', value: '11' },
        { status: 'blocked', value: '24' }, { status: 'late-1-14', value: '11' }, { status: 'late-1-14', value: '11' }
      ],
      currentGate: 'G3', currentGateIndex: 2,
      timelineWidth: '40%', timelineFinishPos: '100%', timelineFinishColor: '#ffa726',
      finish: '26-Oct-2027', slip: '+11 d vs baseline', slipStatus: 'danger'
    },
    {
      project: '2026/RD/004', subtitle: 'Iohexol · Critical',
      health: 'At risk', hScore: 61, hStatus: 'danger',
      schedule: 18, progress: 100, kit: 81, cost: 90,
      gates: [
        { status: 'passed', value: '✓' }, { status: 'passed', value: '✓' },
        { status: 'passed', value: '✓' }, { status: 'passed', value: '✓' },
        { status: 'passed', value: '✓' }, { status: 'late-14-plus', value: '41' }, { status: 'late-14-plus', value: '41' }
      ],
      currentGate: 'G6', currentGateIndex: 5,
      timelineWidth: '45%', timelineFinishPos: '105%', timelineFinishColor: '#ef5350',
      finish: '14-Jan-2027', slip: '+41 d vs baseline', slipStatus: 'danger'
    },
    {
      project: '2026/RD/005', subtitle: 'Temozolomide · Medium',
      health: 'Watch', hScore: 74, hStatus: 'warning',
      schedule: 66, progress: 82, kit: 65, cost: 97,
      gates: [
        { status: 'passed', value: '✓' }, { status: 'passed', value: '✓' },
        { status: 'passed', value: '✓' }, { status: 'passed', value: '✓' },
        { status: 'passed', value: '✓' }, { status: 'blocked', value: '17' }, { status: 'blocked', value: '17' }
      ],
      currentGate: 'G6', currentGateIndex: 5,
      timelineWidth: '55%', timelineFinishPos: '105%', timelineFinishColor: '#ef5350',
      finish: '10-May-2027', slip: '+17 d vs baseline', slipStatus: 'danger'
    }
  ];

  decisions: ManagementDecision[] = [
    { project: '2026/RD/003', market: 'Fulvestrant - Russia /\nEAEU', situation: 'Start blocked', detail: '7.1.2 FP Analytical Method Validation\nG5 · kit 4/7', action: 'Confirm AD scientist booking, HPLC booking, released materials now, not on the recovery date (30 Oct)', owner: 'ARD', needDate: '24-Oct-2026', impact: 'G5: 07-Dec-2026\nIf decided today: 24-Nov-2026', gain: 'G5 -13 d', returnImpact: 'none – finish not on critical path' },
    { project: '2026/RD/002', market: 'Azacitidine - Russia /\nEAEU', situation: 'Start blocked', detail: '2.5.3 ITL for RLD processing & approval\nG2 · kit 4/6', action: 'Accept outputs of 2.5.1 and 2.5.2 as soon as they finish, not on the recovery date (31 Oct)', owner: 'R&D', needDate: '24-Oct-2026', impact: 'G2: 03-Mar-2027\nIf decided today: 03-Mar-2027', gain: 'project finish -10 d', returnImpact: '+$71k revenue earlier' },
  ];

  getScoreColor(score: number): string {
    if (score >= 70) return '#2e7d32';
    if (score >= 40) return '#0288d1';
    return '#ed6c02';
  }

  getBarColor(value: number): string {
    if (value >= 75) return '#26a69a';
    if (value >= 60) return '#ffa726';
    return '#ef5350';
  }
}
