# ENAM Holdings - AI Engineer Build Challenge
## Covering Note: FINN (Financial Investment Agent)

**Applicant:** AI Engineer Candidate  
**Target:** ENAM Holdings Pvt. Ltd. (Public-Markets Investment Intelligence)  
**Submission Subject:** ENAM - IIT screening - 2027  
**Deliverable:** Mobile-first working prototype + repository + covering note  

---

### 1. What Was Built
FINN is a mobile-first financial investment agent purpose-built for high-conviction public-market investors. Rather than an ungrounded chat interface or a basic data dump, FINN acts as an opinionated intelligence filter that ruthlessly separates material corporate signal from low-relevance statutory noise.

The application implements two distinct interaction workflows:

1. **PUSH MODE (Proactive Intelligence):**
   - **Windowed Digest:** Configurable across 24h (default), 3d, 7d, 30d, and full history. Automatically categorizes exchange disclosures across the 17 statutory categories.
   - **Routine Paperwork Drawer:** Statutorily required but low-materiality filings (ESOP allotments, Regulation 74(5) DP certificates, loss/duplicate share issuances) are automatically collapsed into a drawer, preserving the investor’s cognitive bandwidth for what moves stocks.
   - **Smart Filing Enrichment:**
     - *Management Changes:* Ingests exchange intimations and automatically enriches executive profiles with past operational pedigree (e.g. Ex-Cummins, Ex-Unilever), educational background, and strategic investor relevance.
     - *Quarterly Results:* Directly extracts headline financial metrics (**Revenue, EBITDA, PBT, PAT**) comparing current quarter vs previous quarter (QoQ) and same quarter last year (YoY), alongside EBITDA and PAT margins and key operating drivers.
   - **Triggered Alerts & Configurable Thresholds:** Real-time triggers for unusual EOD market moves (volume $>2\times$ 20-day moving average, price breakout beyond $\pm 3\%$, and critical corporate actions) with live sliders allowing the investor to tune sensitivity.

2. **PULL MODE (On-Demand Grounded Research):**
   - **Strict Grounding Rule:** Research is anchored exclusively in primary sources (Annual Reports, Concall Transcripts, statutory quarterly filings). No broker consensus, secondary news, or outside model speculation.
   - **8-Output Fundamental Menu:**
     1. *Business Snapshot:* Operating segments, revenue mix %, and structural moats.
     2. *Financial Snapshot:* Valuation multiples (P/E vs Industry), ROCE, ROE, TTM revenue, and margins.
     3. *Trajectory:* Multi-year compounding direction, 3Y CAGRs, what's accelerating vs compressing.
     4. *Balance Sheet & Cash Quality:* Net debt, D/E ratio, working capital cycle breakdown (debtor/inventory/payable days), Free Cash Flow (FCF) conversion, and auditor notes.
     5. *Narrative vs. Numbers:* Critical synthesis contrasting management's verbal concall commentary against audited financial print reality, complete with credibility scores and exact citations.
     6. *Guidance:* Forward targets on growth, margins, and capex with exact verbatim quotes and confidence ratings.
     7. *Bull vs. Bear Case:* Exactly 3 tight, data-backed bullets each way.
     8. *Worked Example (Promise vs. Delivery):* A 4-quarter audit comparing management guidance against subsequent reported results, tagged as `BEAT`, `MET`, or `MISSED`.
   - **Interactive Primary-Source Copilot:** An embedded query bar allowing the investor to interrogate the primary documents with verifiable citations.

3. **Portfolio & Watchlist Generalization:**
   - Pre-configured with a mock portfolio of 18 high-conviction NSE/BSE stocks across large/mid/small caps and diverse sectors.
   - Supports 4 ad-hoc research tickers (`DIXON.NS`, `KAYNES.NS`, `ZOMATO.NS`, `CDSL.NS`).
   - The engine is fully generalized to accept **any valid NSE/BSE symbol** input by the user on the fly.

---

### 2. Key Decisions & Architectural Choices

1. **Mobile-First UX with Dual Viewport Mode:**
   Public-markets investors check portfolios on their phones throughout market hours. The frontend features a native-feeling phone shell (complete with status bar, dynamic island, and bottom tabs) as well as an instant toggle to a wide-screen responsive terminal.
2. **High Information Density (No "AI Slop"):**
   Eliminated long conversational pleasantries and generic boilerplate. Everything is presented in dense tabular grids, color-coded badges, and expandable drawers.
3. **Smart Model Routing & Cost Efficiency:**
   - Fast, deterministic pattern extraction and Pydantic schemas handle 80% of routine categorizations and table alignments with near-zero latency and cost.
   - Advanced reasoning is reserved specifically for the **Narrative vs. Numbers** tension analysis and the **Promise vs. Delivery** concall audit.
   - In-memory memoization caches heavy document parsing to prevent repetitive token expenditure.
4. **Resilient Fallback Plumbing:**
   While integrated with `yfinance` and web feeds, Indian market APIs can throttle or shut down during off-market hours. The backend employs an intelligent cache with automatic fallback to ensure the prototype boots and runs smoothly 100% of the time.

---

### 3. What Was Deliberately Left Out

- **Real-Time 400-Page PDF OCR Ingestion on Mobile:**
  Parsing a 400-page Annual Report PDF on mobile in real time introduces 20–40 seconds of loading latency. For this prototype, primary document sections were pre-indexed and structured to provide instantaneous, sub-second responses.
- **Native OS Push Notifications:**
  Implementing web push notifications involves APNs/FCM service workers, device permissions, and Apple Developer certificates. Instead, we prioritized a visible, interactive in-app Alert Monitor with configurable threshold sliders that reacts instantaneously to parameter adjustments.
- **Complex Secondary Derivatives / Options Pricing:**
  Kept focus strictly aligned with the ENAM brief: public-markets fundamental equities research and exchange filing intelligence.

---

### 4. Where I Would Take This Next

1. **Audio Concall Player with Verbatim Jump-to-Timestamp:**
   Linking the exact quote in the "Narrative vs. Numbers" table to the precise minute:second audio in the investor call, allowing the analyst to hear management's inflection and tone.
2. **BSE/NSE Direct Websocket Ingestion:**
   Connecting directly to exchange dissemination feeds to classify filings within 5 seconds of disclosure.
3. **Cross-Company Capital Allocation Matrix:**
   Screening which portfolio companies generate high FCF but fail to reinvest at ROCE $>$ cost of capital.
4. **Automated WhatsApp / Telegram EOD Briefing:**
   Pioneering a 6:00 PM market-close audio/text digest dispatched directly to the investment committee's mobile phones.

