"""
Pull Mode API Routes.
Primary-source grounded deep company research and concall analysis.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.models.research import PullResearchReport
from app.services.pull_research_service import get_pull_research
from app.services.market_data import normalize_ticker

router = APIRouter(prefix="/api/pull", tags=["Pull Mode"])

class CopilotQueryRequest(BaseModel):
    ticker: str
    question: str

@router.get("/research/{ticker}", response_model=PullResearchReport)
def get_research_report(ticker: str):
    """
    Get grounded 8-section research report + Worked Example (Promise vs Delivery).
    Strictly sourced from Annual Reports and Concall Transcripts.
    """
    try:
        norm = normalize_ticker(ticker)
        return get_pull_research(norm)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate research report: {str(e)}")

@router.post("/query")
def query_primary_sources(payload: CopilotQueryRequest):
    """
    On-demand investor query grounded strictly in primary sources for the requested stock.
    Prevents hallucination by referencing exact concall and annual report citations.
    """
    norm = normalize_ticker(payload.ticker)
    report = get_pull_research(norm)
    
    q_lower = payload.question.lower()
    answer = ""
    citations = []

    if "guidance" in q_lower or "target" in q_lower or "capex" in q_lower or "margin" in q_lower:
        items = report.guidance.guidance_items
        answer = f"According to {report.company_name}'s latest concall:\n" + "\n".join([
            f"• {g.metric}: {g.management_guidance} (Quote: {g.exact_concall_quote})"
            for g in items
        ])
        citations = report.guidance.primary_sources
    elif "debt" in q_lower or "cash" in q_lower or "working capital" in q_lower:
        bs = report.balance_sheet_cash
        answer = f"As per audited FY24 balance sheet and cash flow statement:\n• Net Debt: ₹{bs.net_debt_cr:,.1f} Cr (D/E ratio: {bs.debt_to_equity})\n• Working Capital Cycle: {bs.working_capital_days} days\n• Cash Conversion & FCF: {bs.cash_conversion_trend}"
        citations = bs.primary_sources
    elif "bear" in q_lower or "risk" in q_lower:
        bears = report.bull_vs_bear.bear_case
        answer = f"Key risks grounded in primary filings:\n" + "\n".join([
            f"• {b.title}: {b.argument} [Data: {b.data_backing}]" for b in bears
        ])
        citations = report.bull_vs_bear.primary_sources
    elif "promise" in q_lower or "delivery" in q_lower or "credibility" in q_lower or "track record" in q_lower:
        we = report.worked_example
        answer = f"{we.track_record_score}.\n{we.summary_verdict}\n\nRecent Quarters:\n" + "\n".join([
            f"• {q.quarter}: Promised '{q.management_promise}' -> Actual '{q.actual_delivery}' [{q.status}]"
            for q in we.quarters[:3]
        ])
        citations = we.primary_sources
    else:
        # Default comprehensive answer
        answer = f"From {report.company_name} primary sources:\n" \
                 f"• Business: {report.business_snapshot.business_overview[:180]}...\n" \
                 f"• Direction: {report.trajectory.direction} (3Y Rev CAGR: {report.trajectory.revenue_cagr_3y}%)\n" \
                 f"• Narrative Posture: {report.narrative_vs_numbers.overall_posture} [Rating: {report.narrative_vs_numbers.credibility_rating}]"
        citations = [d["title"] for d in report.primary_documents_analyzed]

    return {
        "ticker": norm,
        "company_name": report.company_name,
        "question": payload.question,
        "grounded_answer": answer,
        "grounding_discipline": "Strictly derived from Annual Reports & Concall Transcripts (No secondary broker notes)",
        "source_citations": citations
    }
