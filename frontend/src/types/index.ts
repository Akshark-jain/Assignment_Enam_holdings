export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  market_cap_cr: number;
  current_price: number;
  day_change_pct: number;
  day_change_abs: number;
  day_volume: number;
  avg_volume_20d: number;
  volume_multiple: number;
  is_in_portfolio: boolean;
  pe_ratio?: number;
  roce_pct?: number;
  roe_pct?: number;
  high_52w?: number;
  low_52w?: number;
}

export interface PortfolioSummary {
  total_tracked: number;
  portfolio_count: number;
  adhoc_count: number;
  top_gainers: Stock[];
  top_losers: Stock[];
  high_volume_movers: Stock[];
  sector_breakdown: Record<string, number>;
}

export interface ManagementChangeEnrichment {
  person_name: string;
  position: string;
  change_type: string;
  previous_company?: string;
  experience_summary: string;
  educational_background?: string;
  investor_relevance: string;
}

export interface QuarterlyResultsEnrichment {
  quarter: string;
  revenue_cr: number;
  revenue_qoq_pct: number;
  revenue_yoy_pct: number;
  ebitda_cr: number;
  ebitda_qoq_pct: number;
  ebitda_yoy_pct: number;
  ebitda_margin_pct: number;
  pbt_cr: number;
  pbt_qoq_pct: number;
  pbt_yoy_pct: number;
  pat_cr: number;
  pat_qoq_pct: number;
  pat_yoy_pct: number;
  pat_margin_pct: number;
  key_drivers: string[];
}

export interface Announcement {
  id: string;
  ticker: string;
  company_name: string;
  title: string;
  category: string;
  timestamp: string;
  relative_time: string;
  is_material: boolean;
  priority_score: number;
  summary: string;
  source_url?: string;
  raw_filing_excerpt?: string;
  management_enrichment?: ManagementChangeEnrichment;
  results_enrichment?: QuarterlyResultsEnrichment;
}

export interface DigestResponse {
  window: string;
  total_material_count: number;
  total_routine_count: number;
  material_announcements: Announcement[];
  routine_drawer: Announcement[];
}

export interface TriggeredAlert {
  id: string;
  ticker: string;
  company_name: string;
  alert_type: 'VOLUME_SPIKE' | 'PRICE_SURGE' | 'PRICE_PLUNGE' | 'MATERIAL_FILING';
  severity: 'CRITICAL' | 'HIGH' | 'WATCH';
  title: string;
  message: string;
  metric_value: number;
  threshold_value: number;
  timestamp: string;
  relative_time: string;
  linked_filing_id?: string;
}

export interface AlertThresholds {
  volume_multiple: number;
  price_change_abs_pct: number;
  monitored_categories: string[];
}

export interface SegmentRevenue {
  segment_name: string;
  revenue_pct: number;
  description: string;
  growth_yoy?: number;
}

export interface BusinessSnapshot {
  ticker: string;
  company_name: string;
  business_overview: string;
  key_moats_and_advantages: string[];
  segments: SegmentRevenue[];
  primary_sources: string[];
}

export interface FinancialSnapshot {
  market_cap_cr: number;
  pe_ratio: number;
  industry_pe: number;
  roce_pct: number;
  roe_pct: number;
  revenue_ttm_cr: number;
  ebitda_margin_pct: number;
  pat_ttm_cr: number;
  pat_margin_pct: number;
  dividend_yield_pct: number;
  primary_sources: string[];
}

export interface TrajectoryMetricYear {
  year: string;
  revenue_cr: number;
  ebitda_cr: number;
  pat_cr: number;
  ebitda_margin_pct: number;
}

export interface Trajectory {
  direction: string;
  direction_badge: string;
  summary: string;
  whats_growing: string[];
  whats_compressing: string[];
  historical_data: TrajectoryMetricYear[];
  revenue_cagr_3y: number;
  pat_cagr_3y: number;
  primary_sources: string[];
}

export interface CashFlowYear {
  year: string;
  cfo_cr: number;
  capex_cr: number;
  fcf_cr: number;
  cash_conversion_pct: number;
}

export interface BalanceSheetAndCash {
  total_debt_cr: number;
  cash_and_equivalents_cr: number;
  net_debt_cr: number;
  debt_to_equity: number;
  working_capital_days: number;
  debtor_days: number;
  inventory_days: number;
  payable_days: number;
  cash_conversion_trend: string;
  free_cash_flow_history: CashFlowYear[];
  audit_qualification_flag: boolean;
  audit_notes: string;
  primary_sources: string[];
}

export interface DivergenceItem {
  domain: string;
  management_narrative: string;
  financial_reality: string;
  verdict: string;
  severity: string;
  source_citation: string;
}

export interface NarrativeVsNumbers {
  overall_posture: string;
  credibility_rating: string;
  divergences: DivergenceItem[];
  primary_sources: string[];
}

export interface GuidanceItem {
  metric: string;
  management_guidance: string;
  basis_and_conditions: string;
  confidence_level: string;
  exact_concall_quote: string;
}

export interface Guidance {
  quarter_guided: string;
  forward_commentary: string;
  guidance_items: GuidanceItem[];
  primary_sources: string[];
}

export interface BulletPoint {
  title: string;
  argument: string;
  data_backing: string;
  source_reference: string;
}

export interface BullVsBear {
  bull_case: BulletPoint[];
  bear_case: BulletPoint[];
  asymmetric_risk_skew: string;
  primary_sources: string[];
}

export interface PromiseVsDeliveryQuarter {
  quarter: string;
  management_promise: string;
  actual_delivery: string;
  status: 'BEAT' | 'MET' | 'MISSED';
  variance_explanation: string;
  source_call: string;
}

export interface WorkedExample {
  title: string;
  description: string;
  track_record_score: string;
  quarters: PromiseVsDeliveryQuarter[];
  summary_verdict: string;
  primary_sources: string[];
}

export interface PullResearchReport {
  ticker: string;
  company_name: string;
  last_updated: string;
  primary_documents_analyzed: Array<{ title: string; type: string; url: string; date: string }>;
  business_snapshot: BusinessSnapshot;
  financial_snapshot: FinancialSnapshot;
  trajectory: Trajectory;
  balance_sheet_cash: BalanceSheetAndCash;
  narrative_vs_numbers: NarrativeVsNumbers;
  guidance: Guidance;
  bull_vs_bear: BullVsBear;
  worked_example: WorkedExample;
}
