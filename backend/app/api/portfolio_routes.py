"""
Portfolio & Watchlist API Routes.
Manages the mock portfolio (18 stocks) and ad-hoc research tickers with full generalization.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from app.models.portfolio import Stock, PortfolioConfig, PortfolioSummary
from app.services.market_data import get_multiple_stocks, get_stock_market_data, normalize_ticker
from app.services.mock_database import DEFAULT_PORTFOLIO_TICKERS, DEFAULT_ADHOC_TICKERS

router = APIRouter(prefix="/api/portfolio", tags=["Portfolio"])

# State for portfolio and adhoc tickers
_PORTFOLIO_STATE = {
    "portfolio": list(DEFAULT_PORTFOLIO_TICKERS),
    "adhoc": list(DEFAULT_ADHOC_TICKERS)
}

class AddTickerRequest(BaseModel):
    ticker: str
    is_adhoc: bool = True

@router.get("", response_model=PortfolioSummary)
def get_portfolio():
    """Get complete portfolio overview with live market quotes and summary metrics."""
    portfolio_stocks = get_multiple_stocks(_PORTFOLIO_STATE["portfolio"], is_portfolio_list=True)
    adhoc_stocks = get_multiple_stocks(_PORTFOLIO_STATE["adhoc"], is_portfolio_list=False)
    
    all_stocks = portfolio_stocks + adhoc_stocks
    
    # Sort gainers and losers
    gainers = sorted(all_stocks, key=lambda s: s.day_change_pct, reverse=True)[:5]
    losers = sorted(all_stocks, key=lambda s: s.day_change_pct)[:5]
    
    # Unusual volume movers (volume_multiple >= 1.5)
    volume_movers = sorted(all_stocks, key=lambda s: s.volume_multiple, reverse=True)[:5]
    
    # Sector breakdown
    sector_counts = {}
    for s in all_stocks:
        sector_counts[s.sector] = sector_counts.get(s.sector, 0) + 1

    return PortfolioSummary(
        total_tracked=len(all_stocks),
        portfolio_count=len(portfolio_stocks),
        adhoc_count=len(adhoc_stocks),
        top_gainers=gainers,
        top_losers=losers,
        high_volume_movers=volume_movers,
        sector_breakdown=sector_counts
    )

@router.get("/stocks", response_model=List[Stock])
def get_all_tracked_stocks():
    """Get list of all tracked stocks."""
    portfolio_stocks = get_multiple_stocks(_PORTFOLIO_STATE["portfolio"], is_portfolio_list=True)
    adhoc_stocks = get_multiple_stocks(_PORTFOLIO_STATE["adhoc"], is_portfolio_list=False)
    return portfolio_stocks + adhoc_stocks

@router.get("/stock/{ticker}", response_model=Stock)
def get_single_stock(ticker: str):
    """Fetch live quote and key metrics for any single ticker."""
    norm = normalize_ticker(ticker)
    is_portfolio = norm in _PORTFOLIO_STATE["portfolio"]
    return get_stock_market_data(norm, is_in_portfolio=is_portfolio)

@router.post("/add")
def add_ticker(payload: AddTickerRequest):
    """Add a new ticker to portfolio or adhoc watchlist (supports any NSE/BSE symbol)."""
    norm = normalize_ticker(payload.ticker)
    
    if payload.is_adhoc:
        if norm not in _PORTFOLIO_STATE["adhoc"]:
            _PORTFOLIO_STATE["adhoc"].append(norm)
    else:
        if norm not in _PORTFOLIO_STATE["portfolio"]:
            _PORTFOLIO_STATE["portfolio"].append(norm)
            
    # Trigger fetch to warm cache
    stock = get_stock_market_data(norm, is_in_portfolio=not payload.is_adhoc)
    return {"status": "success", "message": f"Added {norm}", "stock": stock}

@router.delete("/remove/{ticker}")
def remove_ticker(ticker: str):
    """Remove a ticker from watchlist."""
    norm = normalize_ticker(ticker)
    removed = False
    if norm in _PORTFOLIO_STATE["portfolio"]:
        _PORTFOLIO_STATE["portfolio"].remove(norm)
        removed = True
    if norm in _PORTFOLIO_STATE["adhoc"]:
        _PORTFOLIO_STATE["adhoc"].remove(norm)
        removed = True
        
    if not removed:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found in watchlist")
        
    return {"status": "success", "message": f"Removed {norm}"}

