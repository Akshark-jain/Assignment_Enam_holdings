import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  PieChart,
  TrendingUp,
  Scale,
  MessageSquareDiff,
  Compass,
  CheckCircle,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { PullResearchReport } from '../types';
import { queryCopilot } from '../services/api';

interface PullResearchProps {
  report: PullResearchReport | null;
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
  availableTickers: string[];
  isLoading: boolean;
}

export const PullResearch: React.FC<PullResearchProps> = ({
  report,
  selectedTicker,
  onSelectTicker,
  availableTickers,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tickerInput, setTickerInput] = useState(selectedTicker);
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState<any | null>(null);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  const tabs = [
    { id: 0, label: '1. Business', icon: BookOpen },
    { id: 1, label: '2. Financials', icon: PieChart },
    { id: 2, label: '3. Trajectory', icon: TrendingUp },
    { id: 3, label: '4. Balance Sheet & Cash', icon: Scale },
    { id: 4, label: '5. Narrative vs. Numbers', icon: MessageSquareDiff },
    { id: 5, label: '6. Guidance', icon: Compass },
    { id: 6, label: '7. Bull vs. Bear', icon: Flame },
    { id: 7, label: '8. Worked Example (Guidance vs Delivery)', icon: Award }
  ];

  const handleTickerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      onSelectTicker(tickerInput.trim());
    }
  };

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuestion.trim() || !report) return;
    try {
      setIsCopilotLoading(true);
      const res = await queryCopilot(report.ticker, copilotQuestion.trim());
      setCopilotAnswer(res);
    } catch (err) {
      alert('Failed to query primary sources');
    } finally {
      setIsCopilotLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Ticker Search & Primary Source Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm space-y-3">
        <form onSubmit={handleTickerSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Enter any NSE/BSE ticker (e.g. RELIANCE.NS, DIXON.NS)..."
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-8 pr-3 py-1.5 text-xs rounded-lg uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-colors"
          >
            Pull
          </button>
        </form>

        {/* Quick Ticker Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] font-mono pb-1">
          <span className="text-slate-500 whitespace-nowrap">Quick selects:</span>
          {availableTickers.slice(0, 7).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTickerInput(t);
                onSelectTicker(t);
              }}
              className={`px-2 py-0.5 rounded transition-all whitespace-nowrap ${
                selectedTicker === t
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {t.replace('.NS', '')}
            </button>
          ))}
        </div>

        {/* Primary Source Grounding Discipline Pill */}
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Grounding Discipline:</strong> Analyzed exclusively from Annual Reports & Concall Transcripts. Zero secondary broker notes or ungrounded external model assumptions.
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-900/60 border border-slate-800/80 h-44 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && report && (
        <div className="space-y-4">
          {/* Header Card: Company Title & Document Sources */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <div className="flex items-center space-x-2 font-mono">
                  <h2 className="text-base font-bold text-slate-100">{report.ticker}</h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    Primary Sourced
                  </span>
                </div>
                <p className="text-xs text-slate-400">{report.company_name}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Audit As Of: {report.last_updated}
              </span>
            </div>

            {/* Primary Document Citations Bar */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block mb-1">
                Primary Sources Analyzed ({report.primary_documents_analyzed.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {report.primary_documents_analyzed.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <span>{doc.title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Research Menu Tabs (8 Sections) */}
          <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-4">
            {/* 1. BUSINESS SNAPSHOT */}
            {activeTab === 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1.5">
                    Business Overview
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {report.business_snapshot.business_overview}
                  </p>
                </div>

                {/* Segments Breakdown */}
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                    Operating Segments & Revenue Mix
                  </h3>
                  <div className="space-y-2">
                    {report.business_snapshot.segments.map((seg, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-slate-100">{seg.segment_name}</span>
                          <div className="flex items-center space-x-2">
                            {seg.growth_yoy !== undefined && (
                              <span
                                className={`text-[10px] ${
                                  seg.growth_yoy >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {seg.growth_yoy >= 0 ? '+' : ''}
                                {seg.growth_yoy}% YoY
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[11px] border border-cyan-800/40">
                              {seg.revenue_pct}%
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400">{seg.description}</p>
                        {/* Segment revenue share progress bar */}
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(seg.revenue_pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitive Moats */}
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                    Key Competitive Moats
                  </h3>
                  <div className="space-y-1.5">
                    {report.business_snapshot.key_moats_and_advantages.map((moat, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold font-mono">0{idx + 1}.</span>
                        <span>{moat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. FINANCIAL SNAPSHOT */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Headline Ratios & Capital Efficiency
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">MARKET CAP</span>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      ₹{report.financial_snapshot.market_cap_cr.toLocaleString()} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">P/E RATIO</span>
                    <div className="text-sm font-bold text-amber-400 mt-1">
                      {report.financial_snapshot.pe_ratio}x
                    </div>
                    <span className="text-[9px] text-slate-500">Ind: {report.financial_snapshot.industry_pe}x</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">ROCE</span>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {report.financial_snapshot.roce_pct}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">ROE</span>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {report.financial_snapshot.roe_pct}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">TTM REVENUE</span>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      ₹{report.financial_snapshot.revenue_ttm_cr.toLocaleString()} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">EBITDA MARGIN</span>
                    <div className="text-sm font-bold text-cyan-400 mt-1">
                      {report.financial_snapshot.ebitda_margin_pct}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">TTM PAT</span>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      ₹{report.financial_snapshot.pat_ttm_cr.toLocaleString()} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">PAT MARGIN</span>
                    <div className="text-sm font-bold text-emerald-300 mt-1">
                      {report.financial_snapshot.pat_margin_pct}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TRAJECTORY */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Multi-Year Trajectory
                    </h3>
                    <p className="text-xs text-slate-100 font-semibold mt-0.5">
                      {report.trajectory.direction}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      report.trajectory.direction_badge === 'POSITIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {report.trajectory.direction_badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.trajectory.summary}
                </p>

                {/* Multi-Year Metrics Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="p-2">Fiscal Year</th>
                        <th className="p-2">Revenue (₹ Cr)</th>
                        <th className="p-2">EBITDA (₹ Cr)</th>
                        <th className="p-2">Margin %</th>
                        <th className="p-2">PAT (₹ Cr)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                      {report.trajectory.historical_data.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-800/40">
                          <td className="p-2 font-bold text-slate-200">{row.year}</td>
                          <td className="p-2 text-slate-300">₹{row.revenue_cr.toLocaleString()}</td>
                          <td className="p-2 text-slate-300">₹{row.ebitda_cr.toLocaleString()}</td>
                          <td className="p-2 text-cyan-400">{row.ebitda_margin_pct}%</td>
                          <td className="p-2 text-emerald-300">₹{row.pat_cr.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* What's Growing vs Compressing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                    <span className="font-mono text-emerald-400 font-bold block text-[11px]">
                      ▲ What's Accelerating / Growing:
                    </span>
                    {report.trajectory.whats_growing.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                    <span className="font-mono text-rose-400 font-bold block text-[11px]">
                      ▼ What's Compressing / Headwinds:
                    </span>
                    {report.trajectory.whats_compressing.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. BALANCE SHEET & CASH QUALITY */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Balance Sheet Quality & Free Cash Conversion
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">TOTAL DEBT</span>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      ₹{report.balance_sheet_cash.total_debt_cr.toLocaleString()} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">NET DEBT</span>
                    <div className="text-sm font-bold text-amber-400 mt-1">
                      ₹{report.balance_sheet_cash.net_debt_cr.toLocaleString()} Cr
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">DEBT / EQUITY</span>
                    <div className="text-sm font-bold text-cyan-400 mt-1">
                      {report.balance_sheet_cash.debt_to_equity}x
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">WORKING CAPITAL</span>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {report.balance_sheet_cash.working_capital_days} Days
                    </div>
                  </div>
                </div>

                {/* Working capital cycle components */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 uppercase">Working Capital Component Breakdown</span>
                  <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                    <span>Debtor Days: {report.balance_sheet_cash.debtor_days}d</span>
                    <span>Inventory Days: {report.balance_sheet_cash.inventory_days}d</span>
                    <span>Payable Days: {report.balance_sheet_cash.payable_days}d</span>
                  </div>
                </div>

                {/* Free Cash Flow & Conversion Table */}
                <div>
                  <span className="text-xs font-mono text-slate-300 font-bold block mb-2">
                    Free Cash Flow (FCF) History & Cash Conversion:
                  </span>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-2">Period</th>
                          <th className="p-2">Operating Cash (CFO)</th>
                          <th className="p-2">Capex</th>
                          <th className="p-2">Free Cash Flow (FCF)</th>
                          <th className="p-2">Cash Conversion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                        {report.balance_sheet_cash.free_cash_flow_history.map((row) => (
                          <tr key={row.year}>
                            <td className="p-2 font-bold text-slate-200">{row.year}</td>
                            <td className="p-2 text-slate-300">₹{row.cfo_cr.toLocaleString()} Cr</td>
                            <td className="p-2 text-slate-400">₹{row.capex_cr.toLocaleString()} Cr</td>
                            <td
                              className={`p-2 font-bold ${
                                row.fcf_cr >= 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              ₹{row.fcf_cr.toLocaleString()} Cr
                            </td>
                            <td className="p-2 text-cyan-400">{row.cash_conversion_pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Auditor Opinion & Notes */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Independent Auditor's Report</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {report.balance_sheet_cash.audit_notes}
                  </p>
                </div>
              </div>
            )}

            {/* 5. NARRATIVE VS. NUMBERS */}
            {activeTab === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Narrative vs. Numbers Tension Analysis
                    </h3>
                    <p className="text-xs text-slate-200 font-semibold mt-0.5">
                      {report.narrative_vs_numbers.overall_posture}
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-400 font-bold">
                    Credibility: {report.narrative_vs_numbers.credibility_rating}
                  </span>
                </div>

                <div className="space-y-3">
                  {report.narrative_vs_numbers.divergences.map((div, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-slate-100">{div.domain}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${
                            div.verdict === 'ALIGNED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : div.verdict === 'DISCONNECT'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {div.verdict}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                          <span className="text-cyan-400 font-mono font-bold block mb-1">
                            Management Verbal Story (Concall):
                          </span>
                          <p className="text-slate-300 italic">"{div.management_narrative}"</p>
                        </div>
                        <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                          <span className="text-emerald-400 font-mono font-bold block mb-1">
                            Grounded Financial Reality (Print):
                          </span>
                          <p className="text-slate-300">{div.financial_reality}</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono pt-1">
                        Source Citation: {div.source_citation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. GUIDANCE */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
                    Management Forward Guidance
                  </h3>
                  <p className="text-xs text-slate-300">{report.guidance.forward_commentary}</p>
                </div>

                <div className="space-y-2.5">
                  {report.guidance.guidance_items.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-100 font-bold">{g.metric}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          Confidence: {g.confidence_level}
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs">
                        <strong>Target:</strong> {g.management_guidance}
                      </p>
                      <p className="text-[11px] text-slate-400 font-sans">
                        <strong>Assumptions / Conditions:</strong> {g.basis_and_conditions}
                      </p>
                      <div className="pt-1 text-[11px] text-amber-300/90 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        Exact Concall Quote: {g.exact_concall_quote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. BULL VS. BEAR CASE (3 BULLETS EACH) */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Bull vs. Bear Tension (3 Bullets Each)
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {report.bull_vs_bear.asymmetric_risk_skew}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Bull Case */}
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold text-xs">
                      <span>THE BULL CASE (3 DRIVERS)</span>
                    </div>
                    {report.bull_vs_bear.bull_case.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1"
                      >
                        <h4 className="font-bold text-emerald-300 text-xs">{b.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-normal">{b.argument}</p>
                        <div className="pt-1 text-[10px] text-emerald-400/90 font-mono">
                          Data Backing: {b.data_backing}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bear Case */}
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-1.5 text-rose-400 font-mono font-bold text-xs">
                      <span>THE BEAR CASE (3 RISKS)</span>
                    </div>
                    {report.bull_vs_bear.bear_case.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1"
                      >
                        <h4 className="font-bold text-rose-300 text-xs">{b.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-normal">{b.argument}</p>
                        <div className="pt-1 text-[10px] text-rose-400/90 font-mono">
                          Data Backing: {b.data_backing}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 8. WORKED EXAMPLE: PROMISE VS DELIVERY TRACKER */}
            {activeTab === 7 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {report.worked_example.title}
                    </h3>
                    <p className="text-xs text-slate-400">{report.worked_example.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                    {report.worked_example.track_record_score}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold font-mono">Verdict: </span>
                  {report.worked_example.summary_verdict}
                </p>

                {/* 4 Quarters Audit Cards */}
                <div className="space-y-2.5">
                  {report.worked_example.quarters.map((q, idx) => {
                    const isBeat = q.status === 'BEAT';
                    const isMet = q.status === 'MET';

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs space-y-2 font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 text-xs">{q.quarter}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              isBeat
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : isMet
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {q.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-cyan-400 font-mono font-bold text-[10px] block mb-0.5">
                              Concall Guidance Promise ({q.source_call}):
                            </span>
                            <p className="text-slate-300">{q.management_promise}</p>
                          </div>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-emerald-400 font-mono font-bold text-[10px] block mb-0.5">
                              Actual Audited Delivery:
                            </span>
                            <p className="text-slate-300">{q.actual_delivery}</p>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 font-sans pt-1">
                          <span className="font-semibold text-slate-300">Variance Analysis: </span>
                          {q.variance_explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* --- INTERACTIVE PRIMARY-SOURCE COPILOT QUERY DRAWER --- */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask Primary-Source Copilot ({report.ticker})</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Query management's exact concall statements, debt covenants, or guidance targets with zero hallucination.
            </p>

            <form onSubmit={handleCopilotSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., What did management guide for forward margins & capex?"
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 text-xs rounded-lg placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={isCopilotLoading}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <Send className="w-3 h-3" />
                <span>Ask</span>
              </button>
            </form>

            {/* Copilot Result Box */}
            {copilotAnswer && (
              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-900/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                  <span>Grounded Response:</span>
                  <span>{copilotAnswer.grounding_discipline}</span>
                </div>
                <div className="text-slate-200 leading-relaxed whitespace-pre-line text-[11px]">
                  {copilotAnswer.grounded_answer}
                </div>
                {copilotAnswer.source_citations.length > 0 && (
                  <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                    <strong>Citations:</strong> {copilotAnswer.source_citations.join(' • ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
