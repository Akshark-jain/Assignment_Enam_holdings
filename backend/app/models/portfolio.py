from pydantic import BaseModel, Field
from typing import List, Optional

class Stock(BaseModel):
    symbol: str
    name: str
    sector: str
    market_cap_cr: float = 0.0
    current_price: float = 0.0
    day_change_pct: float = 0.0
    day_change_abs: float = 0.0
    day_volume: int = 0
    avg_volume_20d: int = 0
    volume_multiple: float = 1.0
    is_in_portfolio: bool = True
    pe_ratio: Optional[float] = None
    roce_pct: Optional[float] = None
    roe_pct: Optional[float] = None
    high_52w: Optional[float] = None
    low_52w: Optional[float] = None

class PortfolioConfig(BaseModel):
    portfolio_tickers: List[str]
    adhoc_tickers: List[str] = []

class PortfolioSummary(BaseModel):
    total_tracked: int
    portfolio_count: int
    adhoc_count: int
    top_gainers: List[Stock]
    top_losers: List[Stock]
    high_volume_movers: List[Stock]
    sector_breakdown: dict

