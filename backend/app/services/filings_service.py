"""
Filings Service: Aggregation, Windowed Digest, Categorization, and Filtering.
Supports 17 SEBI/BSE announcement categories and separates routine paperwork from material signals.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.models.announcement import Announcement, AnnouncementCategory
from app.models.alert import TriggeredAlert, AlertThresholds, AlertType, AlertSeverity
from app.services.mock_database import get_seed_announcements
from app.services.enrichment_service import enrich_management_change, enrich_quarterly_results
from app.services.market_data import get_multiple_stocks, normalize_ticker

# Global state of announcements
_ANNOUNCEMENTS_STORE: List[Dict[str, Any]] = get_seed_announcements()

def get_announcements(
    window: str = "24h",
    tickers: Optional[List[str]] = None,
    include_routine: bool = True,
    material_only: bool = False
) -> Dict[str, Any]:
    """
    Fetch announcements filtered by time window, tickers, and materiality.
    Returns both high-priority material announcements and the collapsed routine drawer count/items.
    """
    now = datetime.now()
    
    # Calculate cutoff time
    if window == "24h":
        cutoff = now - timedelta(hours=24)
    elif window == "3d":
        cutoff = now - timedelta(days=3)
    elif window == "7d":
        cutoff = now - timedelta(days=7)
    elif window == "30d":
        cutoff = now - timedelta(days=30)
    else:
        cutoff = now - timedelta(days=365)

    normalized_filter_tickers = [normalize_ticker(t) for t in tickers] if tickers else None

    material_items: List[Announcement] = []
    routine_items: List[Announcement] = []

    for raw in _ANNOUNCEMENTS_STORE:
        raw_ticker = normalize_ticker(raw["ticker"])
        
        # Check ticker match
        if normalized_filter_tickers and raw_ticker not in normalized_filter_tickers:
            continue
            
        # Check time window
        try:
            ts = datetime.fromisoformat(raw["timestamp"])
            if ts < cutoff:
                continue
        except Exception:
            pass

        # Build Announcement object
        ann = Announcement(
            id=raw["id"],
            ticker=raw_ticker,
            company_name=raw["company_name"],
            title=raw["title"],
            category=AnnouncementCategory(raw["category"]),
            timestamp=raw["timestamp"],
            relative_time=raw.get("relative_time", "Recent"),
            is_material=raw.get("is_material", True),
            priority_score=raw.get("priority_score", 2),
            summary=raw.get("summary", ""),
            source_url=raw.get("source_url"),
            raw_filing_excerpt=raw.get("raw_filing_excerpt")
        )

        # Smart Enrichment attach if available or dynamically enriched
        if ann.category == AnnouncementCategory.MANAGEMENT_CHANGE:
            if "management_enrichment" in raw and raw["management_enrichment"]:
                ann.management_enrichment = raw["management_enrichment"]
            else:
                ann.management_enrichment = enrich_management_change(ann.title, ann.raw_filing_excerpt or "", ann.ticker)

        if ann.category == AnnouncementCategory.RESULTS:
            if "results_enrichment" in raw and raw["results_enrichment"]:
                ann.results_enrichment = raw["results_enrichment"]
            else:
                ann.results_enrichment = enrich_quarterly_results(ann.ticker, ann.raw_filing_excerpt or "")

        # Classify into high-signal vs routine
        if ann.category == AnnouncementCategory.UNCLASSIFIED or not ann.is_material:
            routine_items.append(ann)
        else:
            material_items.append(ann)

    # Sort material items by priority and recency
    material_items.sort(key=lambda x: (x.priority_score, x.timestamp), reverse=True)
    routine_items.sort(key=lambda x: x.timestamp, reverse=True)

    return {
        "window": window,
        "total_material_count": len(material_items),
        "total_routine_count": len(routine_items),
        "material_announcements": material_items,
        "routine_drawer": routine_items if include_routine else []
    }

def evaluate_alerts(
    tickers: List[str],
    thresholds: AlertThresholds
) -> List[TriggeredAlert]:
    """
    Evaluates market moves (volume spikes, price breakouts) and material corporate filings
    against dynamic user-configurable thresholds.
    """
    alerts: List[TriggeredAlert] = []
    now = datetime.now()
    
    # 1. Evaluate EOD Market Data moves (Volume & Price)
    stocks = get_multiple_stocks(tickers)
    for stock in stocks:
        # Check volume spike (e.g. >= 2.0x 20-day average)
        if stock.volume_multiple >= thresholds.volume_multiple:
            alerts.append(TriggeredAlert(
                id=f"alert-vol-{stock.symbol}",
                ticker=stock.symbol,
                company_name=stock.name,
                alert_type=AlertType.VOLUME_SPIKE,
                severity=AlertSeverity.HIGH if stock.volume_multiple >= (thresholds.volume_multiple * 1.5) else AlertSeverity.WATCH,
                title=f"Unusual Volume Surge ({stock.volume_multiple}x)",
                message=f"Trading volume hit {stock.day_volume:,} shares vs 20-day avg of {stock.avg_volume_20d:,} shares ({stock.volume_multiple}x). Price moved {stock.day_change_pct:+.2f}%.",
                metric_value=stock.volume_multiple,
                threshold_value=thresholds.volume_multiple,
                timestamp=now.isoformat(),
                relative_time="EOD Market Move"
            ))

        # Check sharp price moves (+/- X%)
        if abs(stock.day_change_pct) >= thresholds.price_change_abs_pct:
            alert_type = AlertType.PRICE_SURGE if stock.day_change_pct > 0 else AlertType.PRICE_PLUNGE
            severity = AlertSeverity.CRITICAL if abs(stock.day_change_pct) >= (thresholds.price_change_abs_pct * 1.8) else AlertSeverity.HIGH
            alerts.append(TriggeredAlert(
                id=f"alert-px-{stock.symbol}",
                ticker=stock.symbol,
                company_name=stock.name,
                alert_type=alert_type,
                severity=severity,
                title=f"Sharp Price Move ({stock.day_change_pct:+.2f}%)",
                message=f"Stock closed at ₹{stock.current_price:,.2f} ({stock.day_change_pct:+.2f}% on day). Breached your alert threshold of ±{thresholds.price_change_abs_pct}%.",
                metric_value=stock.day_change_pct,
                threshold_value=thresholds.price_change_abs_pct,
                timestamp=now.isoformat(),
                relative_time="EOD Market Move"
            ))

    # 2. Evaluate Material Announcements against monitored categories
    ann_result = get_announcements(window="3d", tickers=tickers)
    for ann in ann_result["material_announcements"]:
        if ann.category.value in thresholds.monitored_categories:
            alerts.append(TriggeredAlert(
                id=f"alert-filing-{ann.id}",
                ticker=ann.ticker,
                company_name=ann.company_name,
                alert_type=AlertType.MATERIAL_FILING,
                severity=AlertSeverity.CRITICAL if ann.category in [AnnouncementCategory.RESULTS, AnnouncementCategory.MANAGEMENT_CHANGE, AnnouncementCategory.MA] else AlertSeverity.HIGH,
                title=f"Material Filing: {ann.category.value.upper()}",
                message=ann.summary,
                metric_value=ann.priority_score,
                threshold_value=2.0,
                timestamp=ann.timestamp,
                relative_time=ann.relative_time,
                linked_filing_id=ann.id
            ))

    # Sort alerts by severity
    severity_order = {AlertSeverity.CRITICAL: 3, AlertSeverity.HIGH: 2, AlertSeverity.WATCH: 1}
    alerts.sort(key=lambda a: (severity_order.get(a.severity, 0), a.timestamp), reverse=True)
    return alerts

