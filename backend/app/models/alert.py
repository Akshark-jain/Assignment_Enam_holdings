from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class AlertType(str, Enum):
    VOLUME_SPIKE = "VOLUME_SPIKE"
    PRICE_SURGE = "PRICE_SURGE"
    PRICE_PLUNGE = "PRICE_PLUNGE"
    MATERIAL_FILING = "MATERIAL_FILING"

class AlertSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    WATCH = "WATCH"

class AlertThresholds(BaseModel):
    volume_multiple: float = 2.0  # e.g., 2.0x average volume
    price_change_abs_pct: float = 3.0  # e.g., +/- 3.0% price move
    monitored_categories: List[str] = [
        "results",
        "M&A",
        "management_change",
        "litigation",
        "fund_raise",
        "credit_rating"
    ]

class TriggeredAlert(BaseModel):
    id: str
    ticker: str
    company_name: str
    alert_type: AlertType
    severity: AlertSeverity
    title: str
    message: str
    metric_value: float
    threshold_value: float
    timestamp: str
    relative_time: str
    linked_filing_id: Optional[str] = None
