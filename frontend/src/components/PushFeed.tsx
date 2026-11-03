import React, { useState } from 'react';
import {
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Briefcase,
  TrendingUp,
  FileText,
  AlertCircle,
  Building2,
  UserCheck,
  BarChart3,
  Search,
  Sparkles
} from 'lucide-react';
import { Announcement, DigestResponse } from '../types';

interface PushFeedProps {
  digest: DigestResponse | null;
  selectedWindow: string;
  setSelectedWindow: (win: string) => void;
  onSelectTickerForResearch: (ticker: string) => void;
  isLoading: boolean;
}

export const PushFeed: React.FC<PushFeedProps> = ({
  digest,
  selectedWindow,
  setSelectedWindow,
  onSelectTickerForResearch,
  isLoading
}) => {
  const [showRoutineDrawer, setShowRoutineDrawer] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const windows = [
    { id: '24h', label: 'Last 24h' },
    { id: '3d', label: '3 Days' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: 'all', label: 'All History' }
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'results':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'management_change':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'M&A':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'credit_rating':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'litigation':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
      case 'fund_raise':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
      case 'capex':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
      case 'press_release':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const materialItems = (digest?.material_announcements || []).filter((item) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.ticker.toLowerCase().includes(q) ||
      item.company_name.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const routineItems = digest?.routine_drawer || [];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Controls: Window Selector & Search */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">Windowed Digest</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            {materialItems.length} Material Signals
          </span>
        </div>

        {/* Time Window Pills */}
        <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWindow(w.id)}
              className={`text-[11px] py-1.5 rounded-md font-mono transition-all text-center ${
                selectedWindow === w.id
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter filings by ticker, keyword or event..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-8 pr-3 py-1.5 text-xs rounded-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-900/60 border border-slate-800/80 h-32 rounded-xl" />
          ))}
        </div>
      )}

      {/* Main Material Announcements List */}
      {!isLoading && materialItems.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800/60 rounded-xl">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-mono">No material filings found in this time window.</p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {materialItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-xl p-3.5 transition-all shadow-md relative overflow-hidden group"
            >
              {/* Top Row: Ticker, Category Badge, Timestamp */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    onClick={() => onSelectTickerForResearch(item.ticker)}
                    className="font-mono font-bold text-sm text-cyan-400 cursor-pointer hover:underline"
                  >
                    {item.ticker}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-xs">
                    {item.company_name}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.relative_time}</span>
                </div>
              </div>

              {/* Title & Core Summary */}
              <h3 className="text-xs font-semibold text-slate-100 mb-1 leading-snug">
                {item.title}
              </h3>
              <p className="text-[12px] text-slate-300 leading-relaxed mb-3">
                {item.summary}
              </p>

              {/* --- ENRICHMENT 1: MANAGEMENT CHANGE BIO CARD --- */}
              {item.management_enrichment && (
                <div className="mt-2.5 p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                    <UserCheck className="w-4 h-4" />
                    <span>Executive Profile Enrichment: {item.management_enrichment.person_name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">Position: </span>
                      <span className="text-slate-200 font-medium">{item.management_enrichment.position}</span>
                    </div>
                    {item.management_enrichment.previous_company && (
                      <div>
                        <span className="text-slate-400">Previous Stint: </span>
                        <span className="text-amber-200/90 font-mono">{item.management_enrichment.previous_company}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    <span className="text-slate-400 font-semibold">Track Record: </span>
                    {item.management_enrichment.experience_summary}
                  </p>
                  {item.management_enrichment.educational_background && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Pedigree: {item.management_enrichment.educational_background}
                    </p>
                  )}
                  <div className="pt-1.5 border-t border-amber-900/30 text-[11px] text-amber-200/90 font-medium">
                    <span className="text-amber-400 font-bold">Investor Relevance: </span>
                    {item.management_enrichment.investor_relevance}
                  </div>
                </div>
              )}

              {/* --- ENRICHMENT 2: QUARTERLY RESULTS COMPARISON TABLE --- */}
              {item.results_enrichment && (
                <div className="mt-2.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold font-mono">
                      <BarChart3 className="w-4 h-4" />
                      <span>Headline Financial Results ({item.results_enrichment.quarter})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">in ₹ Crores</span>
                  </div>

                  {/* High Density Numbers Grid */}
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center font-mono">
                    <div className="p-1">
                      <div className="text-[10px] text-slate-400">REVENUE</div>
                      <div className="text-xs font-bold text-slate-100">
                        ₹{item.results_enrichment.revenue_cr.toLocaleString()}
                      </div>
                      <div
                        className={`text-[9px] font-semibold ${
                          item.results_enrichment.revenue_yoy_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.results_enrichment.revenue_yoy_pct >= 0 ? '+' : ''}
                        {item.results_enrichment.revenue_yoy_pct}% YoY
                      </div>
                    </div>

                    <div className="p-1 border-l border-slate-800">
                      <div className="text-[10px] text-slate-400">EBITDA</div>
                      <div className="text-xs font-bold text-slate-100">
                        ₹{item.results_enrichment.ebitda_cr.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-cyan-400">
                        {item.results_enrichment.ebitda_margin_pct}% Mgn
                      </div>
                    </div>

                    <div className="p-1 border-l border-slate-800">
                      <div className="text-[10px] text-slate-400">PBT</div>
                      <div className="text-xs font-bold text-slate-100">
                        ₹{item.results_enrichment.pbt_cr.toLocaleString()}
                      </div>
                      <div
                        className={`text-[9px] ${
                          item.results_enrichment.pbt_qoq_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.results_enrichment.pbt_qoq_pct >= 0 ? '+' : ''}
                        {item.results_enrichment.pbt_qoq_pct}% QoQ
                      </div>
                    </div>

                    <div className="p-1 border-l border-slate-800">
                      <div className="text-[10px] text-slate-400">PAT</div>
                      <div className="text-xs font-bold text-emerald-300">
                        ₹{item.results_enrichment.pat_cr.toLocaleString()}
                      </div>
                      <div
                        className={`text-[9px] font-semibold ${
                          item.results_enrichment.pat_yoy_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.results_enrichment.pat_yoy_pct >= 0 ? '+' : ''}
                        {item.results_enrichment.pat_yoy_pct}% YoY
                      </div>
                    </div>
                  </div>

                  {/* Key Drivers */}
                  {item.results_enrichment.key_drivers.length > 0 && (
                    <div className="space-y-1">
                      {item.results_enrichment.key_drivers.map((kd, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-300">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{kd}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons: Deep Pull Trigger & Source Link */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectTickerForResearch(item.ticker)}
                  className="flex items-center space-x-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Launch Pull Research</span>
                </button>

                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-slate-200 font-mono transition-colors"
                  >
                    <span>Filing Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- COLLAPSIBLE ROUTINE PAPERWORK DRAWER --- */}
      {routineItems.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowRoutineDrawer(!showRoutineDrawer)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all font-mono text-xs"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>
                Routine Paperwork Drawer ({routineItems.length} filings collapsed)
              </span>
            </div>
            {showRoutineDrawer ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showRoutineDrawer && (
            <div className="mt-2 space-y-2 p-2 bg-slate-950/60 rounded-xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 font-mono px-1">
                Routine compliance certificates, ESOP allotments, and loss of share notices filtered out from primary stream.
              </p>
              {routineItems.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-cyan-500 text-[11px] font-bold">{r.ticker}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {r.category}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] truncate">{r.title}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{r.relative_time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
