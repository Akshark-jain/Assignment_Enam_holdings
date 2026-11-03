"""
Push Mode API Routes.
Windowed digests, routine-drawer collapsing, alert triggers & dynamic thresholds.
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.alert import AlertThresholds, TriggeredAlert
from app.services.filings_service import get_announcements, evaluate_alerts
from app.api.portfolio_routes import _PORTFOLIO_STATE

router = APIRouter(prefix="/api/push", tags=["Push Mode"])

# Current active user-configurable alert thresholds
_ACTIVE_THRESHOLDS = AlertThresholds(
    volume_multiple=2.0,
    price_change_abs_pct=3.0,
    monitored_categories=[
        "results",
        "M&A",
        "management_change",
        "litigation",
        "fund_raise",
        "credit_rating"
    ]
)

@router.get("/digest")
def get_digest(
    window: str = Query("24h", description="Time window: 24h, 3d, 7d, 30d, or all"),
    include_routine: bool = Query(True, description="Whether to include routine drawer filings"),
    ticker: Optional[str] = Query(None, description="Optional specific ticker to filter")
):
    """
    Get windowed digest of corporate filings across tracked portfolio stocks.
    Filters high-signal material announcements and collapses routine compliance into a drawer.
    """
    ticker_val = ticker if isinstance(ticker, str) and ticker else None
    window_val = window if isinstance(window, str) else "24h"
    include_routine_val = include_routine if isinstance(include_routine, bool) else True

    tickers = [ticker_val] if ticker_val else (_PORTFOLIO_STATE["portfolio"] + _PORTFOLIO_STATE["adhoc"])
    return get_announcements(
        window=window_val,
        tickers=tickers,
        include_routine=include_routine_val
    )

@router.get("/alerts", response_model=List[TriggeredAlert])
def get_alerts(
    volume_threshold: Optional[float] = None,
    price_threshold: Optional[float] = None
):
    """
    Evaluate alerts against user configurable thresholds:
    - Unusual EOD volume (> 2.0x 20-day average)
    - Sharp price move (> +/- 3.0%)
    - High-materiality corporate filings (M&A, Results, Management Changes, Ratings, Litigations)
    """
    current_thresholds = _ACTIVE_THRESHOLDS.copy()
    if volume_threshold is not None:
        current_thresholds.volume_multiple = volume_threshold
    if price_threshold is not None:
        current_thresholds.price_change_abs_pct = price_threshold

    all_tickers = _PORTFOLIO_STATE["portfolio"] + _PORTFOLIO_STATE["adhoc"]
    return evaluate_alerts(all_tickers, current_thresholds)

@router.get("/thresholds", response_model=AlertThresholds)
def get_thresholds():
    """Retrieve current configured alert thresholds."""
    return _ACTIVE_THRESHOLDS

@router.post("/thresholds", response_model=AlertThresholds)
def update_thresholds(payload: AlertThresholds):
    """Update alert thresholds on the fly."""
    global _ACTIVE_THRESHOLDS
    _ACTIVE_THRESHOLDS = payload
    return _ACTIVE_THRESHOLDS
