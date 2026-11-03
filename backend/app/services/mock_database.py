"""
Mock Database & Seed Data for FINN Financial Investment Agent.
Contains curated portfolio watchlist, corporate filings history with smart enrichment,
and grounded primary-source research files.
"""

from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.models.announcement import AnnouncementCategory

DEFAULT_PORTFOLIO_TICKERS = [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "BHARTIARTL.NS",
    "ITC.NS",
    "LT.NS",
    "TATAMOTORS.NS",
    "SUNPHARMA.NS",
    "TITAN.NS",
    "ASIANPAINT.NS",
    "SBIN.NS",
    "BAJFINANCE.NS",
    "NTPC.NS",
    "MARUTI.NS",
    "ULTRACEMCO.NS",
    "TRENT.NS"
]

DEFAULT_ADHOC_TICKERS = [
    "DIXON.NS",
    "KAYNES.NS",
    "ZOMATO.NS",
    "CDSL.NS"
]

TICKER_METADATA = {
    "RELIANCE.NS": {"name": "Reliance Industries Ltd.", "sector": "Energy & Digital", "market_cap_cr": 2045000, "pe": 26.4, "roce": 10.2, "roe": 9.5},
    "TCS.NS": {"name": "Tata Consultancy Services", "sector": "IT Services", "market_cap_cr": 1420000, "pe": 29.8, "roce": 58.1, "roe": 49.3},
    "INFY.NS": {"name": "Infosys Ltd.", "sector": "IT Services", "market_cap_cr": 780000, "pe": 28.1, "roce": 37.4, "roe": 31.8},
    "HDFCBANK.NS": {"name": "HDFC Bank Ltd.", "sector": "Banking & Financials", "market_cap_cr": 1310000, "pe": 19.4, "roce": 16.8, "roe": 15.6},
    "ICICIBANK.NS": {"name": "ICICI Bank Ltd.", "sector": "Banking & Financials", "market_cap_cr": 890000, "pe": 18.2, "roce": 17.5, "roe": 18.1},
    "BHARTIARTL.NS": {"name": "Bharti Airtel Ltd.", "sector": "Telecommunications", "market_cap_cr": 940000, "pe": 48.2, "roce": 14.1, "roe": 16.7},
    "ITC.NS": {"name": "ITC Ltd.", "sector": "FMCG & Agri", "market_cap_cr": 605000, "pe": 27.6, "roce": 39.2, "roe": 29.5},
    "LT.NS": {"name": "Larsen & Toubro Ltd.", "sector": "Capital Goods & Infra", "market_cap_cr": 512000, "pe": 34.5, "roce": 15.3, "roe": 14.8},
    "TATAMOTORS.NS": {"name": "Tata Motors Ltd.", "sector": "Automobiles", "market_cap_cr": 368000, "pe": 11.2, "roce": 22.4, "roe": 28.6},
    "SUNPHARMA.NS": {"name": "Sun Pharmaceutical Ind.", "sector": "Pharmaceuticals", "market_cap_cr": 445000, "pe": 38.6, "roce": 17.8, "roe": 16.2},
    "TITAN.NS": {"name": "Titan Company Ltd.", "sector": "Consumer Discretionary", "market_cap_cr": 312000, "pe": 82.5, "roce": 26.4, "roe": 28.1},
    "ASIANPAINT.NS": {"name": "Asian Paints Ltd.", "sector": "Consumer Durables", "market_cap_cr": 268000, "pe": 49.1, "roce": 29.5, "roe": 25.8},
    "SBIN.NS": {"name": "State Bank of India", "sector": "Banking (PSU)", "market_cap_cr": 745000, "pe": 10.8, "roce": 14.2, "roe": 17.9},
    "BAJFINANCE.NS": {"name": "Bajaj Finance Ltd.", "sector": "NBFC", "market_cap_cr": 425000, "pe": 29.1, "roce": 15.9, "roe": 22.3},
    "NTPC.NS": {"name": "NTPC Ltd.", "sector": "Power Generation", "market_cap_cr": 398000, "pe": 18.4, "roce": 11.6, "roe": 13.4},
    "MARUTI.NS": {"name": "Maruti Suzuki India", "sector": "Automobiles", "market_cap_cr": 382000, "pe": 26.3, "roce": 18.9, "roe": 16.8},
    "ULTRACEMCO.NS": {"name": "UltraTech Cement", "sector": "Materials / Cement", "market_cap_cr": 328000, "pe": 44.1, "roce": 13.8, "roe": 12.9},
    "TRENT.NS": {"name": "Trent Ltd. (Zudio/Westside)", "sector": "Retail & Apparel", "market_cap_cr": 248000, "pe": 142.0, "roce": 28.5, "roe": 26.2},
    "DIXON.NS": {"name": "Dixon Technologies Ltd.", "sector": "Electronics Manufacturing", "market_cap_cr": 88000, "pe": 98.4, "roce": 32.1, "roe": 30.4},
    "KAYNES.NS": {"name": "Kaynes Technology India", "sector": "IoT / EMS & Defense", "market_cap_cr": 36000, "pe": 89.2, "roce": 19.5, "roe": 16.8},
    "ZOMATO.NS": {"name": "Zomato Ltd. (Blinkit)", "sector": "Consumer Internet", "market_cap_cr": 235000, "pe": 115.0, "roce": 8.5, "roe": 7.8},
    "CDSL.NS": {"name": "Central Depository Services", "sector": "Market Infrastructure", "market_cap_cr": 345000, "pe": 62.4, "roce": 38.6, "roe": 31.2}
}

def get_now() -> datetime:
    return datetime.now()

def get_seed_announcements() -> List[Dict[str, Any]]:
    """Returns a rich set of announcements spanning 24h, 3d, 7d, 30d across portfolio stocks."""
    now = get_now()
    
    announcements = [
        # --- LAST 24 HOURS (HIGH SIGNAL) ---
        {
            "id": "ann-rel-01",
            "ticker": "RELIANCE.NS",
            "company_name": "Reliance Industries Ltd.",
            "title": "Outcome of Board Meeting - Unaudited Financial Results for Q2 FY25",
            "category": AnnouncementCategory.RESULTS.value,
            "timestamp": (now - timedelta(hours=3)).isoformat(),
            "relative_time": "3h ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "Reported consol revenue of ₹2,35,481 Cr (+0.8% QoQ, -0.2% YoY). Jio & Retail offset weak O2C refining cracks.",
            "source_url": "https://www.screener.in/company/RELIANCE/consolidated/#quarters",
            "raw_filing_excerpt": "The Board approved unaudited consolidated financial results for the quarter ended Sept 30. EBITDA was ₹39,058 Cr with 16.58% margin.",
            "results_enrichment": {
                "quarter": "Q2 FY25",
                "revenue_cr": 235481.0,
                "revenue_qoq_pct": 0.8,
                "revenue_yoy_pct": -0.2,
                "ebitda_cr": 39058.0,
                "ebitda_qoq_pct": 1.2,
                "ebitda_yoy_pct": -2.0,
                "ebitda_margin_pct": 16.58,
                "pbt_cr": 24902.0,
                "pbt_qoq_pct": 2.1,
                "pbt_yoy_pct": -4.8,
                "pat_cr": 19101.0,
                "pat_qoq_pct": 3.4,
                "pat_yoy_pct": -5.1,
                "pat_margin_pct": 8.11,
                "key_drivers": [
                    "Jio ARPU increased to ₹195.1 led by tariff hike flow-through",
                    "Retail revenue grew 4.9% YoY driven by grocery and fashion footfalls",
                    "O2C downstream margin contracted due to weak Asian refining margins (Singapore GRM ~$3.6/bbl)"
                ]
            }
        },
        {
            "id": "ann-tatamotors-02",
            "ticker": "TATAMOTORS.NS",
            "company_name": "Tata Motors Ltd.",
            "title": "Appointment of Chief Operating Officer - Commercial Vehicle Business",
            "category": AnnouncementCategory.MANAGEMENT_CHANGE.value,
            "timestamp": (now - timedelta(hours=6)).isoformat(),
            "relative_time": "6h ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "Appointed Mr. Rajesh Sundaram as COO - Commercial Vehicles. Key hire ahead of the proposed CV-PV demerger.",
            "source_url": "https://www.bseindia.com/corporates/ann.html",
            "raw_filing_excerpt": "Pursuant to Regulation 30, the Board has approved the appointment of Mr. Rajesh Sundaram as Chief Operating Officer for the CV division with immediate effect.",
            "management_enrichment": {
                "person_name": "Rajesh Sundaram",
                "position": "Chief Operating Officer (CV Division)",
                "change_type": "APPOINTED",
                "previous_company": "Cummins India & Volvo Trucks APAC",
                "experience_summary": "26+ years of heavy engineering & commercial fleet management leadership. Previously led heavy duty powertrain transitions and electrified bus programs across APAC.",
                "educational_background": "B.Tech (Mech) IIT Madras, MS Automotive Engg (Purdue University)",
                "investor_relevance": "Signals strong institutional focus on margin defence and fleet decarbonization as Tata Motors prepares for independent CV entity listing in 2025."
            }
        },
        {
            "id": "ann-bharti-03",
            "ticker": "BHARTIARTL.NS",
            "company_name": "Bharti Airtel Ltd.",
            "title": "Credit Rating Upgrade by CRISIL - Long Term Debt upgraded to CRISIL AAA/Stable",
            "category": AnnouncementCategory.CREDIT_RATING.value,
            "timestamp": (now - timedelta(hours=11)).isoformat(),
            "relative_time": "11h ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "CRISIL upgraded Bharti Airtel long term bank loan facilities from AA+ to pristine AAA/Stable citing rapid deleveraging and ARPU expansion.",
            "source_url": "https://www.crisil.com/ratings/bharti-airtel",
            "raw_filing_excerpt": "CRISIL has upgraded the long-term debt rating of Bharti Airtel to 'CRISIL AAA/Stable' reflecting sustained improvement in operating cash flows, prepaid tariff hikes, and reduction in net debt/EBITDA below 2.2x."
        },
        {
            "id": "ann-dixon-04",
            "ticker": "DIXON.NS",
            "company_name": "Dixon Technologies Ltd.",
            "title": "Execution of Binding Joint Venture Agreement with HKC Corporation for Display Modules",
            "category": AnnouncementCategory.MA.value,
            "timestamp": (now - timedelta(hours=14)).isoformat(),
            "relative_time": "14h ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "Signed 50.1% majority JV with global display giant HKC to manufacture liquid crystal display (LCD) and smartphone screen modules in India.",
            "source_url": "https://www.screener.in/company/DIXON/",
            "raw_filing_excerpt": "Dixon Technologies (India) Limited enters into binding agreement with HKC Overseas Limited to establish manufacturing of display modules and precision components with ₹450 Cr capex commitment."
        },
        {
            "id": "ann-trent-05",
            "ticker": "TRENT.NS",
            "company_name": "Trent Ltd.",
            "title": "Press Release - Fast Fashion Store Addition Update (Zudio hits 560 stores)",
            "category": AnnouncementCategory.PRESS_RELEASE.value,
            "timestamp": (now - timedelta(hours=18)).isoformat(),
            "relative_time": "18h ago",
            "is_material": True,
            "priority_score": 2,
            "summary": "Opened 42 net new Zudio stores in current quarter, crossing 560 stores nationwide; launched pilot pilot format for beauty/cosmetics (Zudio Beauty).",
            "source_url": "https://www.screener.in/company/TRENT/"
        },

        # --- ROUTINE PAPERWORK (UNCLASSIFIED / COLLAPSIBLE DRAWER) ---
        {
            "id": "ann-infy-routine-01",
            "ticker": "INFY.NS",
            "company_name": "Infosys Ltd.",
            "title": "Allotment of 18,450 Equity Shares under 2015 Stock Incentive Plan",
            "category": AnnouncementCategory.UNCLASSIFIED.value,
            "timestamp": (now - timedelta(hours=4)).isoformat(),
            "relative_time": "4h ago",
            "is_material": False,
            "priority_score": 1,
            "summary": "Routine share allotment under ESOP scheme. Negligible dilution (<0.0001% of equity capital).",
            "source_url": "https://www.bseindia.com/corporates/ann.html"
        },
        {
            "id": "ann-tcs-routine-02",
            "ticker": "TCS.NS",
            "company_name": "Tata Consultancy Services",
            "title": "Certificate under Regulation 74(5) of SEBI (DP) Regulations for quarter ended",
            "category": AnnouncementCategory.UNCLASSIFIED.value,
            "timestamp": (now - timedelta(hours=8)).isoformat(),
            "relative_time": "8h ago",
            "is_material": False,
            "priority_score": 1,
            "summary": "Dematerialisation compliance certificate received from Link Intime India Pvt Ltd. Pure routine statutory paperwork.",
            "source_url": "https://www.bseindia.com/corporates/ann.html"
        },
        {
            "id": "ann-hdfc-routine-03",
            "ticker": "HDFCBANK.NS",
            "company_name": "HDFC Bank Ltd.",
            "title": "Intimation of Loss of Share Certificates and Issue of Duplicate Share Certificates",
            "category": AnnouncementCategory.UNCLASSIFIED.value,
            "timestamp": (now - timedelta(hours=13)).isoformat(),
            "relative_time": "13h ago",
            "is_material": False,
            "priority_score": 1,
            "summary": "Standard loss of physical share certificates notice for 4 retail shareholders (350 shares total).",
            "source_url": "https://www.bseindia.com/corporates/ann.html"
        },
        {
            "id": "ann-itc-routine-04",
            "ticker": "ITC.NS",
            "company_name": "ITC Ltd.",
            "title": "Compliance Certificate pursuant to Regulation 40(9) of SEBI LODR Regulations",
            "category": AnnouncementCategory.UNCLASSIFIED.value,
            "timestamp": (now - timedelta(hours=22)).isoformat(),
            "relative_time": "22h ago",
            "is_material": False,
            "priority_score": 1,
            "summary": "PCS certificate certifying timely dispatch of share certificates for transfers/transmissions. Zero financial materiality.",
            "source_url": "https://www.bseindia.com/corporates/ann.html"
        },

        # --- WINDOW: 1 TO 3 DAYS AGO ---
        {
            "id": "ann-lt-06",
            "ticker": "LT.NS",
            "company_name": "Larsen & Toubro Ltd.",
            "title": "Mega Order Win: Hydrocarbon Business secures ₹15,000+ Cr EPC contract in Middle East",
            "category": AnnouncementCategory.PRESS_RELEASE.value,
            "timestamp": (now - timedelta(days=2, hours=4)).isoformat(),
            "relative_time": "2d ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "L&T Energy Hydrocarbon (LTEH) awarded large offshore gas compression plant expansion project in UAE valued >₹15,000 Cr.",
            "source_url": "https://www.larsentoubro.com/press-releases/"
        },
        {
            "id": "ann-icici-07",
            "ticker": "ICICIBANK.NS",
            "company_name": "ICICI Bank Ltd.",
            "title": "Investor Conference Presentation - London & New York Non-Deal Roadshow",
            "category": AnnouncementCategory.INVESTOR_MEETINGS.value,
            "timestamp": (now - timedelta(days=2, hours=10)).isoformat(),
            "relative_time": "2d ago",
            "is_material": False,
            "priority_score": 2,
            "summary": "Management presentation to institutional investors detailing NIM trajectory (steady at 4.27%), asset quality (GNPA 2.15%), and digital loan underwriting metrics.",
            "source_url": "https://www.icicibank.com/about-us/investor-relations"
        },
        {
            "id": "ann-sunpharma-08",
            "ticker": "SUNPHARMA.NS",
            "company_name": "Sun Pharmaceutical Ind.",
            "title": "Litigation Update: US District Court stays launch of generic Leqselvi pending patent dispute",
            "category": AnnouncementCategory.LITIGATION.value,
            "timestamp": (now - timedelta(days=3, hours=1)).isoformat(),
            "relative_time": "3d ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "Preliminary injunction granted in US district court regarding alopecia treatment Leqselvi (deuruxolitinib). Delays commercial ramp-up by 2-3 quarters.",
            "source_url": "https://www.sunpharma.com/investors"
        },

        # --- WINDOW: 4 TO 7 DAYS AGO ---
        {
            "id": "ann-kaynes-09",
            "ticker": "KAYNES.NS",
            "company_name": "Kaynes Technology India",
            "title": "Cabinet approval of Semicon India Subsidy for ₹3,300 Cr OSAT Facility in Sanand",
            "category": AnnouncementCategory.CAPEX.value,
            "timestamp": (now - timedelta(days=5, hours=6)).isoformat(),
            "relative_time": "5d ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "Union Cabinet approved 50% central capex subsidy for Kaynes Semicon OSAT unit with capacity of 6 million chips/day.",
            "source_url": "https://www.kaynestechnology.net/investor-relations/"
        },
        {
            "id": "ann-titan-10",
            "ticker": "TITAN.NS",
            "company_name": "Titan Company Ltd.",
            "title": "Declaration of Interim Dividend & Fixation of Record Date",
            "category": AnnouncementCategory.DIVIDEND.value,
            "timestamp": (now - timedelta(days=6, hours=3)).isoformat(),
            "relative_time": "6d ago",
            "is_material": False,
            "priority_score": 2,
            "summary": "Board declared interim dividend of ₹11.00 per share (1100% on FV ₹1). Record date fixed as Nov 14.",
            "source_url": "https://www.titancompany.in/investors"
        },

        # --- WINDOW: 8 TO 30 DAYS AGO ---
        {
            "id": "ann-zomato-11",
            "ticker": "ZOMATO.NS",
            "company_name": "Zomato Ltd.",
            "title": "Approval of Qualified Institutional Placement (QIP) of up to ₹8,500 Crore",
            "category": AnnouncementCategory.FUND_RAISE.value,
            "timestamp": (now - timedelta(days=16)).isoformat(),
            "relative_time": "16d ago",
            "is_material": True,
            "priority_score": 3,
            "summary": "Shareholders approved ₹8,500 Cr institutional equity raise to fortify cash reserves against quick commerce dark store expansion race (Zepto/Swiggy/Blinkit).",
            "source_url": "https://www.bseindia.com/corporates/ann.html"
        },
        {
            "id": "ann-tcs-12",
            "ticker": "TCS.NS",
            "company_name": "Tata Consultancy Services",
            "title": "Concall Transcript & Audio Recording of Q2 FY25 Earnings Call",
            "category": AnnouncementCategory.EARNINGS_CALL.value,
            "timestamp": (now - timedelta(days=22)).isoformat(),
            "relative_time": "22d ago",
            "is_material": True,
            "priority_score": 2,
            "summary": "Full verbatim transcript released. CEO noted cautious discretionary BFSI spend in Europe, steady US deal closures, and BSNL 4G rollout delivery.",
            "source_url": "https://www.screener.in/company/TCS/#documents"
        }
    ]
    return announcements

def get_grounded_research_corpus() -> Dict[str, Dict[str, Any]]:
    """
    Curated primary-source grounded research analyses for key stocks.
    Strictly follows the 8 menu outputs + Worked Example required by ENAM Holdings brief.
    """
    return {
        "RELIANCE.NS": {
            "ticker": "RELIANCE.NS",
            "company_name": "Reliance Industries Limited",
            "primary_documents_analyzed": [
                {"title": "Integrated Annual Report FY 2023-24", "type": "Annual Report", "url": "https://www.screener.in/company/RELIANCE/consolidated/#documents", "date": "July 2024"},
                {"title": "Q2 FY25 Earnings Call Transcript", "type": "Concall Transcript", "url": "https://www.screener.in/company/RELIANCE/consolidated/#concalls", "date": "Oct 2024"},
                {"title": "Q1 FY25 Financial Results & Investors Presentation", "type": "Quarterly Filing", "url": "https://www.ril.com/investors", "date": "July 2024"},
                {"title": "47th AGM Chairman Address by Mukesh D. Ambani", "type": "AGM Transcript", "url": "https://www.ril.com/investors/agm", "date": "August 2024"}
            ],
            "business_snapshot": {
                "business_overview": "Reliance Industries is India's largest conglomerate spanning downstream oil refining and petrochemicals (O2C), telecom and broadband (Jio), organised omnichannel retail (Reliance Retail), and an emerging renewable energy ecosystem (solar giga-factories, green hydrogen, and battery storage).",
                "key_moats_and_advantages": [
                    "Jamnagar complex: world's largest single-location refining hub with high Nelson Complexity Index (12.7), capable of processing heavy/sour crude.",
                    "Jio Digital Ecosystem: 490M+ 5G & 4G subscribers enjoying India's only standalone 5G (SA) architecture with captive fiber network.",
                    "Retail footprint: 18,800+ physical stores covering 79M+ sq.ft across groceries, consumer electronics, and lifestyle."
                ],
                "segments": [
                    {"segment_name": "Oil to Chemicals (O2C)", "revenue_pct": 52.4, "description": "Refining, petrochemicals, polymers, polyesters and aviation fuel exports.", "growth_yoy": -2.8},
                    {"segment_name": "Retail (Reliance Retail)", "revenue_pct": 28.3, "description": "Supermarkets, Trends, Digital, AJIO, and Kirana B2B distribution.", "growth_yoy": 12.1},
                    {"segment_name": "Digital Services (Jio)", "revenue_pct": 14.8, "description": "Wireless connectivity, FTTH home broadband, Enterprise Cloud, JioAirFiber.", "growth_yoy": 17.5},
                    {"segment_name": "Oil & Gas Exploration (KG-D6)", "revenue_pct": 2.4, "description": "Deepwater gas extraction producing ~30 MMSCMD meeting ~30% of India's domestic gas.", "growth_yoy": 14.2},
                    {"segment_name": "Others & Financial Services", "revenue_pct": 2.1, "description": "Media investments, supply chain logistics and incubation.", "growth_yoy": 5.0}
                ],
                "primary_sources": ["AR FY24 pp. 34-48 'Segmental Review'", "Q2 FY25 Investor Presentation pp. 12-18"]
            },
            "financial_snapshot": {
                "market_cap_cr": 2045000.0,
                "pe_ratio": 26.4,
                "industry_pe": 24.2,
                "roce_pct": 10.2,
                "roe_pct": 9.5,
                "revenue_ttm_cr": 925600.0,
                "ebitda_margin_pct": 17.4,
                "pat_ttm_cr": 72450.0,
                "pat_margin_pct": 7.8,
                "dividend_yield_pct": 0.38,
                "primary_sources": ["Audited Consolidated Balance Sheet FY24", "Q2 FY25 Press Release pp. 2"]
            },
            "trajectory": {
                "direction": "Two-Speed Conglomerate (Consumer Compounding vs Cyclical Energy Compression)",
                "direction_badge": "NEUTRAL",
                "summary": "Over the past 3 years, consumer businesses (Jio + Retail) have surged from 35% of consolidated EBITDA to nearly 55%, steadily insulating the group from the cyclical volatility of global refining margins and petchem spreads.",
                "whats_growing": [
                    "Jio ARPU compounding (+12.4% after mid-2024 tariff revision to ₹195.1).",
                    "JioAirFiber home broadband net adds running at >1M homes per month.",
                    "Reliance Retail non-grocery private labels (Trends, Azorte, Yousta) expanding gross margins."
                ],
                "whats_compressing": [
                    "O2C benchmark gross refining margins (GRMs) dropping from historical highs of $12-14/bbl to $3.5-5.0/bbl due to new Chinese/Middle-Eastern refinery capacity.",
                    "Polymer & chemical delta margins suppressed by sluggish Chinese industrial recovery."
                ],
                "historical_data": [
                    {"year": "FY21", "revenue_cr": 466924.0, "ebitda_cr": 80709.0, "pat_cr": 49128.0, "ebitda_margin_pct": 17.28},
                    {"year": "FY22", "revenue_cr": 699962.0, "ebitda_cr": 110460.0, "pat_cr": 60705.0, "ebitda_margin_pct": 15.78},
                    {"year": "FY23", "revenue_cr": 879468.0, "ebitda_cr": 142211.0, "pat_cr": 66702.0, "ebitda_margin_pct": 16.17},
                    {"year": "FY24", "revenue_cr": 914472.0, "ebitda_cr": 162590.0, "pat_cr": 69621.0, "ebitda_margin_pct": 17.78}
                ],
                "revenue_cagr_3y": 25.1,
                "pat_cagr_3y": 12.3,
                "primary_sources": ["Screener 10-year Financials", "Annual Reports FY21-FY24 P&L Statements"]
            },
            "balance_sheet_cash": {
                "total_debt_cr": 324622.0,
                "cash_and_equivalents_cr": 208341.0,
                "net_debt_cr": 116281.0,
                "debt_to_equity": 0.44,
                "working_capital_days": -8,
                "debtor_days": 14,
                "inventory_days": 54,
                "payable_days": 76,
                "cash_conversion_trend": "Healthy operating cash flows (₹1,43,000 Cr in FY24), but massive continuous annual capital expenditures (~₹1,31,000 Cr) keep Free Cash Flow (FCF) near neutral.",
                "free_cash_flow_history": [
                    {"year": "FY22", "cfo_cr": 110654.0, "capex_cr": 145132.0, "fcf_cr": -34478.0, "cash_conversion_pct": 100.1},
                    {"year": "FY23", "cfo_cr": 115024.0, "capex_cr": 141809.0, "fcf_cr": -26785.0, "cash_conversion_pct": 80.9},
                    {"year": "FY24", "cfo_cr": 143431.0, "capex_cr": 131769.0, "fcf_cr": 11662.0, "cash_conversion_pct": 88.2}
                ],
                "audit_qualification_flag": False,
                "audit_notes": "Statutory auditors (SRBC & CO LLP / D T S & Associates) issued an unmodified clean audit opinion without qualifications or emphasis of matter.",
                "primary_sources": ["Audited Consolidated Cash Flow Statement FY24", "Notes to Accounts Note 32 'Borrowings'"]
            },
            "narrative_vs_numbers": {
                "overall_posture": "Story running ahead of prints on New Energy & Capex Tapering",
                "credibility_rating": "Moderate Divergence (6.5/10)",
                "divergences": [
                    {
                        "domain": "Free Cash Flow & Capex Peak",
                        "management_narrative": "Management stated in Q2 FY24 call that 5G rollout capex had peaked and annual group capex would materially taper down towards ₹1,00,000 Cr, unlocking free cash generation.",
                        "financial_reality": "Reported FY24 cash capex remained elevated at ₹1,31,769 Cr due to accelerated retail store fit-outs and Jamnagar solar giga-complex investments. Net debt ticked up ₹5,000 Cr QoQ.",
                        "verdict": "DISCONNECT",
                        "severity": "HIGH",
                        "source_citation": "Q2 FY24 Concall Transcript p. 11 vs FY24 Cash Flow Statement"
                    },
                    {
                        "domain": "New Energy Revenue Contribution",
                        "management_narrative": "Repeated AGM commitments to commission the Dhirubhai Ambani Green Energy Complex in second half of 2024 to generate meaningful new earnings stream.",
                        "financial_reality": "Zero commercial segment revenues broken out as of Q2 FY25. Commercial pilot timelines pushed into late FY25.",
                        "verdict": "AGGRESSIVE_STRETCH",
                        "severity": "MEDIUM",
                        "source_citation": "Chairman AGM Speech 2023 & 2024 vs Q2 FY25 Segmental Disclosures"
                    },
                    {
                        "domain": "Jio ARPU Monetization",
                        "management_narrative": "Guided that 5G network dominance and headline tariff hike would translate directly into double-digit ARPU jump with minimal subscriber churn.",
                        "financial_reality": "Jio ARPU rose from ₹181.7 to ₹195.1 (+7.4%), while reported SIM churn was modest (10.9M inactive SIM cleanups), largely confirming management story.",
                        "verdict": "ALIGNED",
                        "severity": "LOW",
                        "source_citation": "Q1 FY25 Concall p. 7 vs Q2 FY25 Operational KPI Release"
                    }
                ],
                "primary_sources": ["Concall Transcripts Q2-FY24 through Q2-FY25", "Statutory quarterly earnings reports"]
            },
            "guidance": {
                "quarter_guided": "H2 FY25 & FY26 Forward Outlook",
                "forward_commentary": "Management remains bullish on digital monetization through AI compute clusters and retail space productivity, while maintaining caution on global petchem recovery until China stimulus takes effect.",
                "guidance_items": [
                    {
                        "metric": "Jio ARPU Target",
                        "management_guidance": "Steering towards ₹215+ ARPU over next 4-6 quarters through 5G data pack monetization and postpaid mix expansion.",
                        "basis_and_conditions": "Contingent on industry-wide willingness for second round of tariff hikes in early 2025.",
                        "confidence_level": "HIGH",
                        "exact_concall_quote": "'With the initial tariff increase absorbed seamlessly, we see our ARPU systematically migrating towards the ₹200-220 band over the coming operating cycles.'"
                    },
                    {
                        "metric": "Retail Margin Expansion",
                        "management_guidance": "50-75 bps EBITDA margin improvement through supply chain automation and scaling own brand apparel.",
                        "basis_and_conditions": "Subject to festive season consumer demand reviving in tier-2/3 cities.",
                        "confidence_level": "MODERATE",
                        "exact_concall_quote": "'Our focus remains relentless on store productivity and operating leverage across merchant partnerships.'"
                    },
                    {
                        "metric": "New Energy Giga Complex Capex",
                        "management_guidance": "First phase of solar PV module factory (10 GW) to commence manufacturing by end of calendar year.",
                        "basis_and_conditions": "Supply chain equipment delivery from European and Asian vendors.",
                        "confidence_level": "MODERATE",
                        "exact_concall_quote": "'We are on track to commission our 10 GW solar module facility in Jamnagar in the coming months.'"
                    }
                ],
                "primary_sources": ["Q2 FY25 Earnings Call Transcript", "Chairman 2024 AGM Address"]
            },
            "bull_vs_bear": {
                "bull_case": [
                    {
                        "title": "Dual Consumer Value Unlocking (Jio & Retail IPOs)",
                        "argument": "Potential standalone listings of Jio and Reliance Retail over the next 18-24 months will eliminate the conglomerate holding-company discount and re-rate consumer valuations.",
                        "data_backing": "Jio and Retail combined command an implied private valuation >$180B based on secondary transactions and benchmark multiples.",
                        "source_reference": "AR FY24 Shareholding pattern & Q2 Investor Presentation"
                    },
                    {
                        "title": "5G Dominance & ARPU Pricing Power",
                        "argument": "Jio has captured >85% of total 5G traffic in India. With zero spectrum debt due in near term and tariff increases proving price-inelastic, incremental flow-through to EBITDA exceeds 65%.",
                        "data_backing": "Q2 FY25 EBITDA margin expanded to 50.4% in telecom operations.",
                        "source_reference": "Jio Q2 FY25 Key Financial Highlights"
                    },
                    {
                        "title": "Green Energy Free Option",
                        "argument": "The $10B Jamnagar New Energy giga-complex positions Reliance as India's lowest-cost producer of green hydrogen and solar modules, creating a new multi-decade earnings engine.",
                        "data_backing": "Secured PLI incentives for both solar modules and advanced chemistry cell (ACC) battery storage.",
                        "source_reference": "Ministry of Heavy Industries & MNRE PLI Allotment Notices"
                    }
                ],
                "bear_case": [
                    {
                        "title": "Persistent Slump in Global Refining & Petrochem Spreads",
                        "argument": "O2C still accounts for over 50% of top-line. Global refinery additions in China and Nigeria, coupled with soft European demand, will keep GRMs capped well below mid-cycle levels.",
                        "data_backing": "O2C EBITDA contracted 23.7% YoY in Q2 FY25 to ₹12,414 Cr.",
                        "source_reference": "Q2 FY25 Segment Results Schedule IV"
                    },
                    {
                        "title": "Subdued Return on Capital (ROCE ~10%) despite Heavy Capex",
                        "argument": "Over ₹5,00,000 Cr invested in capex over 5 years has yielded an incremental ROCE of barely 10-11%, failing to beat the group's weighted average cost of capital (WACC).",
                        "data_backing": "Consolidated ROCE stood at 10.2% in FY24, lower than peers TCS (58%) and ITC (39%).",
                        "source_reference": "Annual Report FY24 Financial Ratios pp. 112"
                    },
                    {
                        "title": "Retail Footprint Rationalization Risk",
                        "argument": "Aggressive store rollouts in tier-3/4 cities face intensifying local e-commerce competition and lower sales-per-square-foot, necessitating store closures and margin drag.",
                        "data_backing": "Square footage growth decelerated to 7% in FY24 with 350+ unviable stores shuttered.",
                        "source_reference": "Reliance Retail FY24 Management Discussion & Analysis"
                    }
                ],
                "asymmetric_risk_skew": "Balanced to Moderate Upside: Downside protected by domestic consumer duopoly in telecom; upside hinged on O2C crack spread recovery and definitive IPO timelines.",
                "primary_sources": ["Consolidated Financial Statements FY24", "Q2 FY25 Concall Transcripts"]
            },
            "worked_example": {
                "title": "Promise vs. Delivery: 4-Quarter Concall Tracker",
                "description": "Cross-verifying explicit guidance given during quarterly concalls against audited quarterly filings.",
                "track_record_score": "72% Delivery Consistency (2 Beats, 1 Met, 1 Miss)",
                "summary_verdict": "Management consistently delivers or exceeds on digital metrics (Jio subscriber net adds and ARPU), but has missed guidance on capex reduction and O2C export spreads due to macro headwinds.",
                "quarters": [
                    {
                        "quarter": "Q2 FY25",
                        "management_promise": "Tariff revision will lift ARPU by 6-8% in Q2 with further gains in Q3; O2C volumes to remain steady through planned turnaround.",
                        "actual_delivery": "ARPU rose 7.4% to ₹195.1 (BEAT). O2C EBITDA fell 23.7% YoY due to sharp drop in diesel/jet cracks (MISS).",
                        "status": "MET",
                        "variance_explanation": "Consumer delivered as promised; external energy macro deteriorated faster than anticipated.",
                        "source_call": "Q1 FY25 Concall (July 2024)"
                    },
                    {
                        "quarter": "Q1 FY25",
                        "management_promise": "Capex intensity to show visible moderation as pan-India 5G deployment reaches final phase.",
                        "actual_delivery": "Reported capex was ₹38,700 Cr for the single quarter, up 2% QoQ, driven by retail warehouse automation and solar land acquisition.",
                        "status": "MISSED",
                        "variance_explanation": "Capex diverted towards new energy civil works, pushing aggregate spend higher.",
                        "source_call": "Q4 FY24 Concall (April 2024)"
                    },
                    {
                        "quarter": "Q4 FY24",
                        "management_promise": "Targeted >20% YoY growth in retail customer footfalls and sustained double-digit grocery gross margin.",
                        "actual_delivery": "Retail footfalls grew 24.2% YoY crossing 300 million; grocery margins preserved at 18.2%.",
                        "status": "BEAT",
                        "variance_explanation": "Metro format expansions and private label share gains surpassed internal benchmarks.",
                        "source_call": "Q3 FY24 Concall (Jan 2024)"
                    },
                    {
                        "quarter": "Q3 FY24",
                        "management_promise": "KG-D6 gas production to ramp to full design capacity of 30 MMSCMD by end of Q4.",
                        "actual_delivery": "Production hit 29.8 MMSCMD in March 2024, meeting ~30% of India's domestic gas demand.",
                        "status": "MET",
                        "variance_explanation": "MJ deepwater field commissioning executed right on scheduled engineering timelines.",
                        "source_call": "Q2 FY24 Concall (Oct 2023)"
                    }
                ],
                "primary_sources": ["RIL Concall Transcripts Q2-FY24 to Q2-FY25", "BSE/NSE Statutory Quarterly Filings"]
            }
        },
        "DIXON.NS": {
            "ticker": "DIXON.NS",
            "company_name": "Dixon Technologies (India) Limited",
            "primary_documents_analyzed": [
                {"title": "Annual Report FY 2023-24", "type": "Annual Report", "url": "https://www.screener.in/company/DIXON/#documents", "date": "July 2024"},
                {"title": "Q2 FY25 Concall Transcript", "type": "Concall Transcript", "url": "https://www.screener.in/company/DIXON/#concalls", "date": "Oct 2024"},
                {"title": "Investor Presentation Q2 FY25", "type": "Quarterly Deck", "url": "https://dixoninfo.com/investor-relations", "date": "Oct 2024"}
            ],
            "business_snapshot": {
                "business_overview": "Dixon Technologies is India's premier Electronic Manufacturing Services (EMS) powerhouse, manufacturing consumer electronics (LED TVs), mobile phones & smartphones, home appliances (washing machines), lighting products, and telecom equipment under both OEM and ODM models.",
                "key_moats_and_advantages": [
                    "Scale & PLI Dominance: Largest beneficiary of Government of India PLI schemes across Mobiles, IT Hardware, and Telecom equipment.",
                    "Backward Integration: In-house SMT lines, tooling, injection moulding, and sheet metal stamping providing cost leadership over competitors.",
                    "Marquee Global Client Base: Manufacturing partner for Xiaomi, Motorola/Lenovo, Samsung, Transsion, Voltas, and Acer."
                ],
                "segments": [
                    {"segment_name": "Mobile & EMS Division", "revenue_pct": 68.2, "description": "Smartphones, feature phones, set top boxes, telecom networking routers.", "growth_yoy": 124.0},
                    {"segment_name": "Consumer Electronics (TVs)", "revenue_pct": 16.4, "description": "LED TVs for global brands with 35% domestic market share.", "growth_yoy": -8.5},
                    {"segment_name": "Home Appliances", "revenue_pct": 8.1, "description": "Semi-automatic and fully automatic washing machines and refrigerators.", "growth_yoy": 15.2},
                    {"segment_name": "Lighting Products", "revenue_pct": 4.5, "description": "LED bulbs, battens, and professional lighting fixtures.", "growth_yoy": -12.0},
                    {"segment_name": "Security Systems & Others", "revenue_pct": 2.8, "description": "CP Plus CCTV cameras and medical electronics.", "growth_yoy": 22.0}
                ],
                "primary_sources": ["AR FY24 Segment Reporting", "Q2 FY25 Investor Deck pp. 14"]
            },
            "financial_snapshot": {
                "market_cap_cr": 88000.0,
                "pe_ratio": 98.4,
                "industry_pe": 48.0,
                "roce_pct": 32.1,
                "roe_pct": 30.4,
                "revenue_ttm_cr": 26850.0,
                "ebitda_margin_pct": 4.1,
                "pat_ttm_cr": 710.0,
                "pat_margin_pct": 2.64,
                "dividend_yield_pct": 0.08,
                "primary_sources": ["Q2 FY25 Unaudited Financials", "Annual Report FY24 Balance Sheet"]
            },
            "trajectory": {
                "direction": "Exponential Topline Acceleration Driven by Mobile Export Shift",
                "direction_badge": "POSITIVE",
                "summary": "Revenue has tripled in two years fueled by big-ticket smartphone manufacturing contracts for Motorola, Transsion, and Xiaomi. While EBITDA margin compressed slightly from 4.8% to 4.1% due to low-margin mobile assembly mix, absolute operating cash flows and return ratios have expanded sharply.",
                "whats_growing": [
                    "Mobile phone volumes ramping to >35 million units annualised run-rate.",
                    "IsmartU acquisition integration adding Transsion (Infinix, Tecno, Itel) manufacturing capacity.",
                    "IT Hardware PLI 2.0 laptop line commencement (Acer, Lenovo)."
                ],
                "whats_compressing": [
                    "Lighting division revenues facing raw material price deflation and sluggish retail demand.",
                    "TV unit prices dropping due to global open-cell panel price dynamics."
                ],
                "historical_data": [
                    {"year": "FY21", "revenue_cr": 6448.0, "ebitda_cr": 286.0, "pat_cr": 160.0, "ebitda_margin_pct": 4.43},
                    {"year": "FY22", "revenue_cr": 10697.0, "ebitda_cr": 379.0, "pat_cr": 190.0, "ebitda_margin_pct": 3.54},
                    {"year": "FY23", "revenue_cr": 12192.0, "ebitda_cr": 513.0, "pat_cr": 255.0, "ebitda_margin_pct": 4.21},
                    {"year": "FY24", "revenue_cr": 17691.0, "ebitda_cr": 732.0, "pat_cr": 375.0, "ebitda_margin_pct": 4.14}
                ],
                "revenue_cagr_3y": 40.1,
                "pat_cagr_3y": 32.8,
                "primary_sources": ["Screener 10Y Financials", "FY21-24 Audited Financial Statements"]
            },
            "balance_sheet_cash": {
                "total_debt_cr": 420.0,
                "cash_and_equivalents_cr": 380.0,
                "net_debt_cr": 40.0,
                "debt_to_equity": 0.22,
                "working_capital_days": 18,
                "debtor_days": 42,
                "inventory_days": 38,
                "payable_days": 62,
                "cash_conversion_trend": "Extremely disciplined working capital management. Negative net working capital in mobile ODM business allows business to fund rapid 100%+ top-line growth with minimal balance sheet leverage.",
                "free_cash_flow_history": [
                    {"year": "FY22", "cfo_cr": 285.0, "capex_cr": 395.0, "fcf_cr": -110.0, "cash_conversion_pct": 75.2},
                    {"year": "FY23", "cfo_cr": 680.0, "capex_cr": 440.0, "fcf_cr": 240.0, "cash_conversion_pct": 132.5},
                    {"year": "FY24", "cfo_cr": 920.0, "capex_cr": 580.0, "fcf_cr": 340.0, "cash_conversion_pct": 125.7}
                ],
                "audit_qualification_flag": False,
                "audit_notes": "S.N. Dhawan & CO LLP issued unqualified report with clean emphasis notes regarding subsidiary consolidation.",
                "primary_sources": ["AR FY24 Cash Flow Statement pp. 98", "Auditor Report Annexure A"]
            },
            "narrative_vs_numbers": {
                "overall_posture": "Exceptional delivery matching ambitious targets",
                "credibility_rating": "High (9.1/10)",
                "divergences": [
                    {
                        "domain": "Mobile Revenue Guidance",
                        "management_narrative": "Guided during Q4 FY24 concall that mobile division would cross ₹20,000 Cr annualized revenue run-rate in FY25.",
                        "financial_reality": "In Q2 FY25, mobile division alone logged ₹8,420 Cr (extrapolating to >₹32,000 Cr annualized run-rate), handily beating internal commentary.",
                        "verdict": "ALIGNED",
                        "severity": "LOW",
                        "source_citation": "Q4 FY24 Concall Transcript p. 6 vs Q2 FY25 Results Filing"
                    },
                    {
                        "domain": "Component Component Localization & Margin Uplift",
                        "management_narrative": "Story promised display module JV and precision mechanics would lift consol EBITDA margins towards 4.8-5.0%.",
                        "financial_reality": "Consolidated EBITDA margin remained rangebound at 3.9-4.1% as box-build assembly grew faster than component localization.",
                        "verdict": "SELECTIVE_OPTIMISM",
                        "severity": "MEDIUM",
                        "source_citation": "Q1 FY25 Concall p. 14 vs Q2 FY25 Segment Financials"
                    }
                ],
                "primary_sources": ["Concall Transcripts Q1-Q2 FY25", "BSE Segment Reporting"]
            },
            "guidance": {
                "quarter_guided": "FY25 & FY26 Forward Target",
                "forward_commentary": "Management expects to produce ~45 million smartphones in FY26, capturing over 50% of India's outsourced mobile manufacturing market, and expanding IT hardware (notebooks and servers).",
                "guidance_items": [
                    {
                        "metric": "Smartphone Volumes",
                        "management_guidance": "Ramping monthly smartphone dispatch from 2.8M to 4M units by Q4 FY25.",
                        "basis_and_conditions": "Export lines for US market ramping through Motorola.",
                        "confidence_level": "VERY HIGH",
                        "exact_concall_quote": "'Our smartphone capacity will cross 4.5 million units a month by early next year with the commissioning of our new mega Noida campus.'"
                    },
                    {
                        "metric": "Capex Commitment",
                        "management_guidance": "₹700-800 Cr capex in FY25, primarily dedicated to display module JV with HKC and component tooling.",
                        "basis_and_conditions": "Internal cash accruals fully funding the program.",
                        "confidence_level": "HIGH",
                        "exact_concall_quote": "'Capex will be completely self-funded through internal cash generation with zero dilution.'"
                    }
                ],
                "primary_sources": ["Q2 FY25 Earnings Call Transcript"]
            },
            "bull_vs_bear": {
                "bull_case": [
                    {
                        "title": "Unrivalled National Champion of 'Make in India' EMS",
                        "argument": "Dixon is the default domestic anchor for global OEMs entering India to claim PLI incentives and bypass geopolitical supply risks.",
                        "data_backing": "Secured ~55% market share in outsourced smartphone manufacturing in India.",
                        "source_reference": "Q2 FY25 Investor Presentation pp. 8"
                    },
                    {
                        "title": "Backward Integration to Expand Operating Margin",
                        "argument": "New JVs in display modules (HKC) and camera modules will transition Dixon from low-margin box-assembly (2.5-3%) to high-value component manufacturing (8-10% margins).",
                        "data_backing": "HKC JV agreement signed Oct 2024 with ₹450 Cr outlay.",
                        "source_reference": "BSE Announcement dated Oct 24, 2024"
                    },
                    {
                        "title": "Massive Export Runway",
                        "argument": "Exports currently represent <10% of revenue. Motorola US shipments have proven product quality, opening the door for massive global supply chain reallocation.",
                        "data_backing": "Export volumes grew 180% YoY in H1 FY25.",
                        "source_reference": "Concall Q2 FY25 Management Commentary"
                    }
                ],
                "bear_case": [
                    {
                        "title": "Extreme Valuation Multiples Leave Zero Room for Slips",
                        "argument": "Trading at ~98x trailing P/E and ~55x forward EV/EBITDA, any quarterly slowdown in smartphone shipment run-rates or client contract renegotiation will trigger harsh de-rating.",
                        "data_backing": "Stock trades at a 150% valuation premium to global EMS leaders like Foxconn (Hon Hai) and Jabil.",
                        "source_reference": "Bloomberg Consensus Valuation Tracker"
                    },
                    {
                        "title": "Client Concentration Risk in Smartphone Business",
                        "argument": "Top 3 mobile customers (Xiaomi, Motorola, Transsion) account for over 50% of consolidated group revenues.",
                        "data_backing": "Note 24 'Customer Concentration' in Annual Report FY24.",
                        "source_reference": "AR FY24 Notes to Accounts"
                    },
                    {
                        "title": "Vulnerability to Post-PLI Sunset Economics",
                        "argument": "A portion of margin profitability is subsidized by Government PLI incentive disbursements. When PLI incentives phase out after FY26, margins must rely strictly on customer pricing power.",
                        "data_backing": "PLI incentives contributed ₹142 Cr to reported EBITDA in FY24.",
                        "source_reference": "FY24 Notes to Accounts 'Other Operating Revenue'"
                    }
                ],
                "asymmetric_risk_skew": "High Growth with Valuation Vulnerability: Operational execution is world-class, but priced for perfection. Any contract delay could induce sharp multiple contraction.",
                "primary_sources": ["Dixon FY24 AR", "Q2 FY25 Concall Transcript"]
            },
            "worked_example": {
                "title": "Promise vs. Delivery: 4-Quarter Concall Tracker",
                "description": "Quarterly guidance audit comparing CEO Atul Lall's concall statements against actual exchange disclosures.",
                "track_record_score": "95% Delivery Consistency (3 Beats, 1 Met, 0 Misses)",
                "summary_verdict": "One of the highest-credibility management teams in Indian mid/large cap engineering. Every promised capacity addition and client onboarding over the past 4 quarters was executed ahead of schedule.",
                "quarters": [
                    {
                        "quarter": "Q2 FY25",
                        "management_promise": "Guidance: Q2 revenue to exceed ₹10,000 Cr led by smartphone festival inventory pipeline.",
                        "actual_delivery": "Consolidated revenue reached ₹11,534 Cr (+133% YoY), crushing the guidance by 15%.",
                        "status": "BEAT",
                        "variance_explanation": "Surge in Motorola export volumes to North America exceeded internal projections.",
                        "source_call": "Q1 FY25 Concall"
                    },
                    {
                        "quarter": "Q1 FY25",
                        "management_promise": "Close binding agreement for display module manufacturing partnership within 90 days.",
                        "actual_delivery": "Signed formal binding JV agreement with HKC Overseas within 75 days.",
                        "status": "BEAT",
                        "variance_explanation": "Regulatory clearances and JV structure finalized ahead of target deadline.",
                        "source_call": "Q4 FY24 Concall"
                    },
                    {
                        "quarter": "Q4 FY24",
                        "management_promise": "Complete acquisition of 50.1% stake in IsmartU (Transsion mobile OEM plant).",
                        "actual_delivery": "CCI (Competition Commission of India) approval received; phase 1 tranche completed.",
                        "status": "MET",
                        "variance_explanation": "Executed seamlessly as outlined to investors.",
                        "source_call": "Q3 FY24 Concall"
                    },
                    {
                        "quarter": "Q3 FY24",
                        "management_promise": "Commission new Dehradun washing machine plant and onboard 2 new global ODM clients.",
                        "actual_delivery": "Dehradun plant operationalised; Bosch and Lloyd commercial dispatches initiated.",
                        "status": "BEAT",
                        "variance_explanation": "Client pilot audits passed on first attempt without remediation delays.",
                        "source_call": "Q2 FY24 Concall"
                    }
                ],
                "primary_sources": ["Dixon Concalls Q2-FY24 through Q2-FY25", "Exchange filings"]
            }
        },
        "TATAMOTORS.NS": {
            "ticker": "TATAMOTORS.NS",
            "company_name": "Tata Motors Limited",
            "primary_documents_analyzed": [
                {"title": "Annual Report FY 2023-24", "type": "Annual Report", "url": "https://www.screener.in/company/TATAMOTORS/consolidated/#documents", "date": "June 2024"},
                {"title": "Q2 FY25 Earnings Call Transcript", "type": "Concall Transcript", "url": "https://www.screener.in/company/TATAMOTORS/consolidated/#concalls", "date": "Nov 2024"},
                {"title": "JLR Q2 Investor Presentation", "type": "Quarterly Deck", "url": "https://www.tatamotors.com/investors", "date": "Nov 2024"}
            ],
            "business_snapshot": {
                "business_overview": "Tata Motors is an automobile OEM comprising Jaguar Land Rover (luxury SUVs like Defender, Range Rover, Velar), Indian Passenger Vehicles (Nexon, Punch, Harrier, leading EV market share >65%), and Commercial Vehicles (heavy trucks, tippers, buses, SCVs).",
                "key_moats_and_advantages": [
                    "JLR Luxury Franchise: Order bank for high-margin Range Rover & Defender models provides multi-month revenue visibility.",
                    "India EV Dominance: Early mover advantage in mainstream electric cars with captive Tata Power charging network.",
                    "Demerger Value Unlock: Imminent corporate demerger into two separately listed pure-play entities: Commercial Vehicles (CV) and Passenger Vehicles (PV + EV + JLR)."
                ],
                "segments": [
                    {"segment_name": "Jaguar Land Rover (JLR)", "revenue_pct": 69.4, "description": "Global luxury SUVs and performance sedans.", "growth_yoy": 11.2},
                    {"segment_name": "Tata Commercial Vehicles (CV)", "revenue_pct": 18.2, "description": "Medium & Heavy Commercial Vehicles (M&HCV), Intermediate & Light CVs, Buses.", "growth_yoy": -5.1},
                    {"segment_name": "Tata Passenger Vehicles (PV)", "revenue_pct": 11.8, "description": "ICE and electric passenger cars (Punch, Nexon, Tiago, Safari).", "growth_yoy": 3.4},
                    {"segment_name": "Vehicle Financing & Others", "revenue_pct": 0.6, "description": "Tata Motors Finance and logistics.", "growth_yoy": 2.0}
                ],
                "primary_sources": ["AR FY24 Segment Reporting", "JLR Q2 FY25 Financial Results"]
            },
            "financial_snapshot": {
                "market_cap_cr": 368000.0,
                "pe_ratio": 11.2,
                "industry_pe": 22.0,
                "roce_pct": 22.4,
                "roe_pct": 28.6,
                "revenue_ttm_cr": 441000.0,
                "ebitda_margin_pct": 13.8,
                "pat_ttm_cr": 33200.0,
                "pat_margin_pct": 7.52,
                "dividend_yield_pct": 0.65,
                "primary_sources": ["Annual Report FY24", "Q2 FY25 Statutory Press Release"]
            },
            "trajectory": {
                "direction": "Turnaround Complete into Net-Cash Fortress Balance Sheet",
                "direction_badge": "POSITIVE",
                "summary": "Tata Motors has engineered one of the most remarkable balance sheet deleveraging turnarounds in Indian corporate history, slashing automotive net debt from over ₹60,000 Cr in FY21 to net-cash positive in JLR and Tata standalone businesses by FY25.",
                "whats_growing": [
                    "Range Rover and Defender wholesale share reaching >67% of total JLR volumes.",
                    "India passenger car market share holding steady around 14% with #1 rank in micro-SUVs (Tata Punch).",
                    "JLR EBIT margin sustaining above 8.5%."
                ],
                "whats_compressing": [
                    "Domestic commercial vehicle volumes experiencing temporary pre-election infra spend pause.",
                    "Discounts and promotional incentives rising in domestic PV market due to industry-wide inventory accumulation."
                ],
                "historical_data": [
                    {"year": "FY21", "revenue_cr": 249795.0, "ebitda_cr": 32262.0, "pat_cr": -13451.0, "ebitda_margin_pct": 12.92},
                    {"year": "FY22", "revenue_cr": 278454.0, "ebitda_cr": 24813.0, "pat_cr": -11441.0, "ebitda_margin_pct": 8.91},
                    {"year": "FY23", "revenue_cr": 345967.0, "ebitda_cr": 37012.0, "pat_cr": 2414.0, "ebitda_margin_pct": 10.70},
                    {"year": "FY24", "revenue_cr": 437928.0, "ebitda_cr": 60408.0, "pat_cr": 31399.0, "ebitda_margin_pct": 13.80}
                ],
                "revenue_cagr_3y": 20.6,
                "pat_cagr_3y": 145.0,
                "primary_sources": ["Screener 10Y Financials", "FY21-24 Audited Financial Statements"]
            },
            "balance_sheet_cash": {
                "total_debt_cr": 58400.0,
                "cash_and_equivalents_cr": 64200.0,
                "net_debt_cr": -5800.0,
                "debt_to_equity": 0.65,
                "working_capital_days": -22,
                "debtor_days": 18,
                "inventory_days": 44,
                "payable_days": 84,
                "cash_conversion_trend": "Outstanding free cash flow generation: JLR generated over £2.3 billion in FCF in FY24, enabling total debt retirement.",
                "free_cash_flow_history": [
                    {"year": "FY22", "cfo_cr": 14290.0, "capex_cr": 14850.0, "fcf_cr": -560.0, "cash_conversion_pct": 57.6},
                    {"year": "FY23", "cfo_cr": 35410.0, "capex_cr": 20250.0, "fcf_cr": 15160.0, "cash_conversion_pct": 95.7},
                    {"year": "FY24", "cfo_cr": 64580.0, "capex_cr": 26800.0, "fcf_cr": 37780.0, "cash_conversion_pct": 106.9}
                ],
                "audit_qualification_flag": False,
                "audit_notes": "B S R & Co. LLP issued an unqualified clean audit opinion.",
                "primary_sources": ["AR FY24 Balance Sheet & Cash Flows"]
            },
            "narrative_vs_numbers": {
                "overall_posture": "Exceptional execution on debt promises; watching EV demand plateau",
                "credibility_rating": "High (8.7/10)",
                "divergences": [
                    {
                        "domain": "Net Zero Debt Milestone",
                        "management_narrative": "Guided 3 years ago that Tata Motors would achieve zero net automotive debt by FY25.",
                        "financial_reality": "Achieved net-cash position across automotive operations in H1 FY25, well ahead of conservative analyst schedules.",
                        "verdict": "ALIGNED",
                        "severity": "LOW",
                        "source_citation": "Chairman Speech 2021 vs Q1 FY25 Investor Deck"
                    },
                    {
                        "domain": "Electric PV Penetration Pace",
                        "management_narrative": "Guided 25% EV penetration in Tata PV sales by FY26.",
                        "financial_reality": "EV penetration moderated from 15% to 12% in recent quarters due to removal of subsidies and buyer range anxiety, requiring hybrid/CNG mix pivot.",
                        "verdict": "SELECTIVE_OPTIMISM",
                        "severity": "MEDIUM",
                        "source_citation": "Q2 FY24 Concall vs Q2 FY25 Sales Disclosures"
                    }
                ],
                "primary_sources": ["Concall Transcripts Q1-Q2 FY25", "BSE Stock Exchange Reports"]
            },
            "guidance": {
                "quarter_guided": "FY25 & FY26 Forward Target",
                "forward_commentary": "JLR targeting >8.5% EBIT margin with £1.8B+ FCF in FY25; domestic business focusing on demerger execution and margin preservation.",
                "guidance_items": [
                    {
                        "metric": "JLR EBIT Margin",
                        "management_guidance": "Guided 8.5% EBIT margin for FY25 and >10.0% by FY26.",
                        "basis_and_conditions": "Defense of Range Rover order backlog and steady European aluminum supply.",
                        "confidence_level": "HIGH",
                        "exact_concall_quote": "'We remain confident of delivering our guided 8.5% EBIT margin for the full year despite transient supplier supply constraints.'"
                    },
                    {
                        "metric": "Demerger Timeline",
                        "management_guidance": "NCLT demerger process on track for completion by Q1 FY26.",
                        "basis_and_conditions": "Shareholder and regulatory tribunal approvals.",
                        "confidence_level": "VERY HIGH",
                        "exact_concall_quote": "'The demerger process has been initiated with stock exchanges and is proceeding as per our indicated 12-15 month window.'"
                    }
                ],
                "primary_sources": ["Q2 FY25 Earnings Call Transcript"]
            },
            "bull_vs_bear": {
                "bull_case": [
                    {
                        "title": "JLR Pure Luxury Positioning & Margin Expansion",
                        "argument": "Shift in mix toward Defender, Range Rover, and Range Rover Sport has structurally elevated JLR average selling price (ASP) to >£74,000, insulating profitability from volume swings.",
                        "data_backing": "Defender alone sells >110,000 units annually with EBITDA margins >18%.",
                        "source_reference": "JLR Q2 FY25 Investor Presentation pp. 10"
                    },
                    {
                        "title": "Corporate Demerger Unlocks Pure-Play Valuations",
                        "argument": "Splitting into two distinct listed entities removes the conglomerate valuation discount: PV+JLR will trade as a global luxury auto stock, while CV trades as a pure domestic infra play.",
                        "data_backing": "Board approved 1:1 demerger ratio in March 2024.",
                        "source_reference": "BSE Regulatory Filing Demerger Scheme"
                    },
                    {
                        "title": "Fortress Net-Cash Balance Sheet",
                        "argument": "With negative net automotive debt and robust free cash flow, the company has transitioned from solvency risk to capital return (dividend resumption & potential buybacks).",
                        "data_backing": "Automotive net cash stood at +₹5,800 Cr in H1 FY25.",
                        "source_reference": "Consolidated Cash Flow Notes H1 FY25"
                    }
                ],
                "bear_case": [
                    {
                        "title": "China Luxury Market Weakness Capping JLR Growth",
                        "argument": "China constitutes ~22% of JLR retail sales. Deepening real estate weakness and aggressive competition from domestic luxury EVs (NIO, Li Auto) threaten JLR Chinese joint venture dividends.",
                        "data_backing": "JLR China wholesales fell 12% YoY in Q2 FY25.",
                        "source_reference": "JLR Quarterly Retail Disclosures"
                    },
                    {
                        "title": "Indian Auto OEM Discounting War",
                        "argument": "Channel inventory across Indian passenger car dealerships reached a record high of 80-85 days, forcing Tata Motors to offer higher consumer discounts, compressing PV margins.",
                        "data_backing": "Domestic PV EBITDA margin slipped to 6.2% in Q2 FY25.",
                        "source_reference": "FADA Monthly Inventory Survey & Tata Q2 Results"
                    },
                    {
                        "title": "Domestic CV Cyclical Peak Concerns",
                        "argument": "Indian medium & heavy commercial vehicle (M&HCV) sales follow a 4-year replacement cycle. Volumes appear to be plateauing following two years of record post-COVID infrastructure spending.",
                        "data_backing": "CV sales volumes dropped 7.1% YoY in H1 FY25.",
                        "source_reference": "SIAM Monthly Automobile Data"
                    }
                ],
                "asymmetric_risk_skew": "Strongly Favorable: Valuation at ~11x P/E offers substantial safety margin relative to Indian auto peers (M&M at 32x, Maruti at 26x), with the demerger acting as a clear catalyst.",
                "primary_sources": ["Tata Motors FY24 AR", "Q2 FY25 Investor Deck"]
            },
            "worked_example": {
                "title": "Promise vs. Delivery: 4-Quarter Concall Tracker",
                "description": "Validation of management guidance across JLR debt reduction and domestic EV targets.",
                "track_record_score": "88% Delivery Consistency (3 Beats, 1 Met, 0 Misses)",
                "summary_verdict": "Management has over-delivered on balance sheet repair and luxury mix pricing power.",
                "quarters": [
                    {
                        "quarter": "Q2 FY25",
                        "management_promise": "Guidance: JLR to maintain positive EBIT above 8% despite aluminum supply disruption from Novelis flood.",
                        "actual_delivery": "JLR delivered 8.6% EBIT margin; rapid supplier re-routing prevented plant shutdown.",
                        "status": "BEAT",
                        "variance_explanation": "Prioritized highest margin Range Rover production runs to protect profits.",
                        "source_call": "Q1 FY25 Concall"
                    },
                    {
                        "quarter": "Q1 FY25",
                        "management_promise": "Achieve net zero automotive debt by Q1/Q2 FY25.",
                        "actual_delivery": "Reported net cash surplus of ₹5,800 Cr across group automotive operations.",
                        "status": "BEAT",
                        "variance_explanation": "Strong cash conversion at JLR allowed early bond repurchases.",
                        "source_call": "Q4 FY24 Concall"
                    },
                    {
                        "quarter": "Q4 FY24",
                        "management_promise": "Introduce first mass market EV with 400km+ real-world range (Punch EV) and achieve 10,000 monthly EV sales.",
                        "actual_delivery": "Punch EV launched with high acclaim; monthly EV volumes reached 9,400 units.",
                        "status": "MET",
                        "variance_explanation": "Supply chain ramp-up aligned closely with projected schedule.",
                        "source_call": "Q3 FY24 Concall"
                    },
                    {
                        "quarter": "Q3 FY24",
                        "management_promise": "JLR full year FCF to exceed £2.0 billion.",
                        "actual_delivery": "Delivered record annual FCF of £2.3 billion for FY24.",
                        "status": "BEAT",
                        "variance_explanation": "Working capital release and premium model mix beat expectations.",
                        "source_call": "Q2 FY24 Concall"
                    }
                ],
                "primary_sources": ["Tata Motors Concall Transcripts", "Statutory quarterly filings"]
            }
        }
    }
