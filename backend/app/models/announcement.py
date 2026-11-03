from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class AnnouncementCategory(str, Enum):
    RESULTS = "results"
    MA = "M&A"
    FUND_RAISE = "fund_raise"
    MANAGEMENT_CHANGE = "management_change"
    LITIGATION = "litigation"
    INSIDER_TRADING = "insider_trading"
    EARNINGS_CALL = "earnings_call"
    INVESTOR_MEETINGS = "investor_meetings"
    CREDIT_RATING = "credit_rating"
    DIVIDEND = "dividend"
    BONUS_SPLIT = "bonus_split"
    CAPEX = "capex"
    PRESS_RELEASE = "press_release"
    POSTAL_BALLOT = "postal_ballot"
    AGM_EGM = "agm_egm"
    PLEDGING = "pledging"
    UNCLASSIFIED = "unclassified"

class ManagementChangeEnrichment(BaseModel):
    person_name: str
    position: str
    change_type: str  # APPOINTED, RESIGNED, RETIRED, PROMOTED
    previous_company: Optional[str] = None
    experience_summary: str
    educational_background: Optional[str] = None
    investor_relevance: str

class QuarterlyResultsEnrichment(BaseModel):
    quarter: str  # e.g., "Q2 FY25"
    revenue_cr: float
    revenue_qoq_pct: float
    revenue_yoy_pct: float
    ebitda_cr: float
    ebitda_qoq_pct: float
    ebitda_yoy_pct: float
    ebitda_margin_pct: float
    pbt_cr: float
    pbt_qoq_pct: float
    pbt_yoy_pct: float
    pat_cr: float
    pat_qoq_pct: float
    pat_yoy_pct: float
    pat_margin_pct: float
    key_drivers: List[str] = []

class Announcement(BaseModel):
    id: str
    ticker: str
    company_name: str
    title: str
    category: AnnouncementCategory
    timestamp: str
    relative_time: str
    is_material: bool
    priority_score: int = 1  # 1 = low/routine, 2 = medium, 3 = high priority
    summary: str
    source_url: Optional[str] = None
    raw_filing_excerpt: Optional[str] = None
    management_enrichment: Optional[ManagementChangeEnrichment] = None
    results_enrichment: Optional[QuarterlyResultsEnrichment] = None

