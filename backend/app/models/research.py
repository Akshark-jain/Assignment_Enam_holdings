from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SegmentRevenue(BaseModel):
    segment_name: str
    revenue_pct: float
    description: str
    growth_yoy: Optional[float] = None

class BusinessSnapshot(BaseModel):
    ticker: str
    company_name: str
    business_overview: str
    key_moats_and_advantages: List[str]
    segments: List[SegmentRevenue]
    primary_sources: List[str]

class FinancialSnapshot(BaseModel):
    market_cap_cr: float
    pe_ratio: float
    industry_pe: float
    roce_pct: float
    roe_pct: float
    revenue_ttm_cr: float
    ebitda_margin_pct: float
    pat_ttm_cr: float
    pat_margin_pct: float
    dividend_yield_pct: float
    primary_sources: List[str]

class TrajectoryMetricYear(BaseModel):
    year: str
    revenue_cr: float
    ebitda_cr: float
    pat_cr: float
    ebitda_margin_pct: float

class Trajectory(BaseModel):
    direction: str  # "Compounding Expansion", "Cyclical Recovery", "Compression Phase"
    direction_badge: str  # "POSITIVE", "NEUTRAL", "NEGATIVE"
    summary: str
    whats_growing: List[str]
    whats_compressing: List[str]
    historical_data: List[TrajectoryMetricYear]
    revenue_cagr_3y: float
    pat_cagr_3y: float
    primary_sources: List[str]

class CashFlowYear(BaseModel):
    year: str
    cfo_cr: float
    capex_cr: float
    fcf_cr: float
    cash_conversion_pct: float  # CFO / EBITDA or CFO / PAT

class BalanceSheetAndCash(BaseModel):
    total_debt_cr: float
    cash_and_equivalents_cr: float
    net_debt_cr: float
    debt_to_equity: float
    working_capital_days: int
    debtor_days: int
    inventory_days: int
    payable_days: int
    cash_conversion_trend: str
    free_cash_flow_history: List[CashFlowYear]
    audit_qualification_flag: bool
    audit_notes: str
    primary_sources: List[str]

class DivergenceItem(BaseModel):
    domain: str  # e.g., "Margin Expansion", "US Generics Demand", "Order Book Execution"
    management_narrative: str
    financial_reality: str
    verdict: str  # "ALIGNED", "DISCONNECT", "AGGRESSIVE_STRETCH"
    severity: str  # "HIGH", "MEDIUM", "LOW"
    source_citation: str

class NarrativeVsNumbers(BaseModel):
    overall_posture: str  # "Story running ahead of prints", "Disciplined execution matching words", "Caution warranted"
    credibility_rating: str  # "High (8.5/10)", "Moderate Divergence (5.8/10)", "Low Grounding (3.2/10)"
    divergences: List[DivergenceItem]
    primary_sources: List[str]

class GuidanceItem(BaseModel):
    metric: str  # "Revenue Growth", "EBITDA Margin", "Annual Capex"
    management_guidance: str
    basis_and_conditions: str
    confidence_level: str
    exact_concall_quote: str

class Guidance(BaseModel):
    quarter_guided: str
    forward_commentary: str
    guidance_items: List[GuidanceItem]
    primary_sources: List[str]

class BulletPoint(BaseModel):
    title: str
    argument: str
    data_backing: str
    source_reference: str

class BullVsBear(BaseModel):
    bull_case: List[BulletPoint]  # Exactly 3 tight bullets
    bear_case: List[BulletPoint]  # Exactly 3 tight bullets
    asymmetric_risk_skew: str
    primary_sources: List[str]

class PromiseVsDeliveryQuarter(BaseModel):
    quarter: str
    management_promise: str
    actual_delivery: str
    status: str  # "BEAT", "MET", "MISSED"
    variance_explanation: str
    source_call: str

class WorkedExample(BaseModel):
    title: str = "Promise vs. Delivery: 4-Quarter Concall Tracker"
    description: str = "Evaluation of forward commentary made by executive management vs reported quarterly prints"
    track_record_score: str
    quarters: List[PromiseVsDeliveryQuarter]
    summary_verdict: str
    primary_sources: List[str]

class PullResearchReport(BaseModel):
    ticker: str
    company_name: str
    last_updated: str
    primary_documents_analyzed: List[Dict[str, str]]
    business_snapshot: BusinessSnapshot
    financial_snapshot: FinancialSnapshot
    trajectory: Trajectory
    balance_sheet_cash: BalanceSheetAndCash
    narrative_vs_numbers: NarrativeVsNumbers
    guidance: Guidance
    bull_vs_bear: BullVsBear
    worked_example: WorkedExample

