# FINN: Financial Investment Agent
### Mobile-First Public-Markets Intelligence Layer
**Built for the ENAM Holdings AI Engineer Build Challenge**

---

## 1. Executive Summary & Philosophy

An investor today is drowning in information—stock ticks, filings, earnings releases, concalls, and macro headlines. It never stops, and **most of it doesn't matter**. 

The scarce skill in public-markets investing is not aggregating data. **It is filtering**: surfacing the critical 1% of signals that actually move a company's investment thesis, while ruthlessly burying routine paperwork into collapsed views.

**FINN** is built from the ground up for a high-conviction investment team. It operates in two complementary interaction modes:
1. **PUSH (Proactive Intelligence):** Tells the investor what changed and *why they should care*, before they even ask.
2. **PULL (Grounded Primary-Source Research):** Allows on-demand fundamental investigation grounded strictly in **primary source documents** (Annual Reports, Concall Transcripts, and statutory exchange filings). Zero secondary broker notes, zero outside media noise, and zero ungrounded model hallucination.

---

## 2. System Architecture & Tech Stack

```
                        ┌──────────────────────────────────────────────┐
                        │              FINN Mobile Terminal            │
                        │   (React / TypeScript / Vite / Tailwind)     │
                        │  - Dynamic Phone Shell / Desktop Terminal    │
                        │  - High-density Dark Mode Terminal (Slate-950)│
                        └──────────────────────┬───────────────────────┘
                                               │
                                      REST / JSON APIs
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │             FastAPI Backend (Python)         │
                        │  - Market Data Engine (yfinance + 20d avg)   │
                        │  - Filing Aggregator & Classifier (17 types) │
                        │  - Smart Enrichment & LLM Extraction Engine  │
                        │  - Primary-Source Grounded Pull Engine       │
                        └───────────────┬──────────────┬───────────────┘
                                        │              │
                   ┌────────────────────┴───┐     ┌────┴────────────────────┐
                   │    Live Market Data    │     │  Primary Source Corpus  │
                   │  - yfinance (NSE/BSE)  │     │  - Screener.in Feeds    │
                   │  - 20-Day Avg Volume   │     │  - Concall Transcripts  │
                   │  - EOD Price & Deltas  │     │  - Annual Reports (AR)  │
                   │  - Smart Memory Cache  │     │  - Statutory Filings    │
                   └────────────────────────┘     └─────────────────────────┘
```

- **Frontend:** Mobile-first responsive web app built with React 19, TypeScript, Vite, and Tailwind CSS. Features an interactive **Phone Shell / Desktop Terminal Viewport Switcher** to test native mobile workflows directly on desktop or mobile browsers.
- **Backend:** Python 3.11 with FastAPI, Pydantic v2 schemas, and Uvicorn.
- **Market Data:** `yfinance` integrated for live end-of-day quotes, 20-day moving average volumes, volume multiples, and 52-week ranges, backed by a fast in-memory cache and robust fallback mechanism.
- **Cost Efficiency & Smart Model Routing:**
  - **Tier 1 (Fast & Free / Cheap):** Pattern and regex parsers + structured Pydantic models for routine categorization, metadata extraction, and table alignment.
  - **Tier 2 (Advanced Reasoning):** Reserved exclusively for deep tension synthesis—comparing management's verbal commentary against actual delivered audited prints (Narrative vs. Numbers).
  - **Document Caching:** In-memory memoization prevents redundant document parsing and LLM API roundtrips.

---

## 3. Core Modules & Implementation Highlights

### A. Portfolio & Watchlist Configuration
- Pre-configured with **18 core NSE/BSE listed companies** representing large, mid, and small-cap leaders across multiple sectors (e.g., `RELIANCE.NS`, `TCS.NS`, `TATAMOTORS.NS`, `HDFCBANK.NS`, `BHARTIARTL.NS`, `TITAN.NS`, `LT.NS`, `TRENT.NS`, etc.).
- Includes **ad-hoc research tickers** outside the portfolio (e.g., `DIXON.NS`, `KAYNES.NS`, `ZOMATO.NS`, `CDSL.NS`).
- **Fully Generalizable:** The engine dynamically handles **any valid NSE/BSE ticker** added by the user (e.g., `HAL.NS`, `CIPLA.NS`, `BEL.NS`) without hardcoding.

### B. PUSH MODE (Proactive Intelligence)
1. **Windowed Digest:**
   - Interactive time-window selector: **Last 24h (default), 3 Days, 7 Days, 30 Days, or All History**.
   - Filters filings across 17 statutory categories (`results`, `M&A`, `management_change`, `credit_rating`, `litigation`, `capex`, `fund_raise`, etc.).
2. **Routine Paperwork Drawer:**
   - Routine, low-relevance filings (ESOP allotments, Regulation 74(5) DP certificates, loss of share certificates, duplicate share issuances) are automatically collapsed into an unobtrusive drawer, preventing stream clutter.
3. **Smart Filing Enrichment:**
   - **Management Change:** Automatically extracts the executive's identity, incoming/outgoing position, past company leadership (e.g., Cummins, Unilever, Google), educational pedigree, and an investor relevance assessment.
   - **Quarterly Results:** Extracts headline numbers into a compact table: **Revenue, EBITDA, PBT, and PAT**, comparing current quarter vs. prior quarter (QoQ) and same quarter last year (YoY), alongside EBITDA and PAT margins.
4. **Triggered Alerts with Dynamic Thresholds:**
   - **Unusual Volume Surge:** Triggers when daily volume breaches the configurable multiple (e.g. $>2.0\times$ 20-day average).
   - **Sharp Price Breakouts:** Triggers when end-of-day price moves beyond $\pm X\%$ (e.g. $\pm 3.0\%$).
   - **Material Announcements:** Surfaces high-impact filings (Results, M&A, Litigations, Credit Ratings).
   - **Interactive Threshold Sliders:** The investor can adjust volume multiples ($1.2\times$ to $5.0\times$) and price triggers ($\pm 1\%$ to $\pm 10\%$) in real-time.

### C. PULL MODE (On-Demand Primary-Source Research)
Strictly adheres to the **Primary Source Grounding Discipline**: data is drawn exclusively from Annual Reports, Earnings Call Transcripts, and statutory exchange filings.

FINN delivers the complete **8-part Research Menu + Worked Example**:
1. **Business Snapshot:** Business overview, segment breakdown with revenue mix %, and key competitive moats.
2. **Financial Snapshot:** Valuation (P/E vs. Industry), capital return ratios (ROCE, ROE), TTM revenue, EBITDA margin, and PAT margin.
3. **Trajectory:** Multi-year compounding vs. compression assessment, 3-year CAGRs, and what is accelerating vs. compressing.
4. **Balance Sheet & Cash Quality:** Total debt, net debt, Debt-to-Equity (D/E), working capital cycle (debtor, inventory, and payable days), Free Cash Flow (FCF) history, and auditor verification notes.
5. **Narrative vs. Numbers:** Divergence analysis contrasting management's concall verbal story against actual financial print realities, labeled with credibility ratings.
6. **Guidance:** Explicit forward metrics on revenue, margins, and capex, paired with exact concall quotes and confidence levels.
7. **Bull vs. Bear Case:** Exactly three tight, concise bullets each way, backed by hard filing data.
8. **Worked Example (Promise vs. Delivery):** A 4-quarter audit comparing management guidance against actual reported results, tagging each quarter as `BEAT`, `MET`, or `MISSED`.
9. **Interactive Primary-Source Copilot:** An on-demand Q&A bar enabling the investor to interrogate the primary documents with zero hallucination.

---

## 4. Setup & Running Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Step 1: Start the Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*The FastAPI backend will start on `http://localhost:8000`. You can inspect the Swagger documentation at `http://localhost:8000/docs`.*

### Step 2: Start the Frontend (React + Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will boot on `http://localhost:5173`. Open this URL in your mobile or desktop browser.*

---

## 5. Architectural Decisions, Trade-Offs & Roadmap

### What Was Prioritized
1. **Information Density & Fast Scanning:** Mobile screens have limited real estate. Rather than conversational fluff or long paragraphs, data is organized into compact grids, color-coded badges, and expandable drawers.
2. **Primary Source Integrity:** Eliminating broker reports and outside news avoids echo-chamber consensus. Grounding every metric in concalls and annual reports provides the highest signal-to-noise ratio.
3. **Zero-Friction Prototype:** Implemented caching and graceful fallbacks so that even during exchange holidays, market close, or API throttling, the app remains responsive.

### Deliberate Omissions & Trade-Offs
- **Full Historical PDF Parser vs. Structured Extraction:** Parsing 400-page Annual Report PDFs in real-time over mobile introduces 30-second latency. We pre-extract and cache structured primary segments for instant sub-second response times.
- **Push Notifications:** Web-based push notifications require service-worker APNs setup; for this prototype, an in-app real-time alerts monitor with configurable threshold sliders was chosen.

### Future Roadmap
1. **Direct Audio Concall Playback:** Timestamped audio player jumping straight to the analyst Q&A moment where management gave the cited guidance quote.
2. **Custom Screener Webhooks:** Real-time webhook ingestion directly from BSE/NSE RSS feeds for instant sub-minute filing classification.
3. **Portfolio Risk Attribution:** Portfolio-level factor exposure (e.g., aggregate foreign currency sensitivity, weighted ROCE, or net debt exposure).

