import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Stock, PortfolioSummary } from '../types';

interface PortfolioViewProps {
  stocks: Stock[];
  summary: PortfolioSummary | null;
  onSelectTickerForResearch: (ticker: string) => void;
  onAddStock: (ticker: string, isAdhoc: boolean) => Promise<void>;
  onRemoveStock: (ticker: string) => Promise<void>;
  isLoading: boolean;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  stocks,
  summary,
  onSelectTickerForResearch,
  onAddStock,
  onRemoveStock,
  isLoading
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'portfolio' | 'adhoc' | 'high_volume'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTickerInput, setNewTickerInput] = useState('');
  const [isAdhocChoice, setIsAdhocChoice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStocks = stocks.filter((s) => {
    // Mode filter
    if (filterMode === 'portfolio' && !s.is_in_portfolio) return false;
    if (filterMode === 'adhoc' && s.is_in_portfolio) return false;
    if (filterMode === 'high_volume' && s.volume_multiple < 2.0) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerInput.trim()) return;
    try {
      setIsSubmitting(true);
      await onAddStock(newTickerInput.trim(), isAdhocChoice);
      setNewTickerInput('');
      setShowAddModal(false);
    } catch (err) {
      alert('Failed to add ticker. Ensure symbol is valid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Portfolio Summary Card */}
      {summary && (
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-bold text-sm text-slate-100">Watchlist Architecture</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-mono font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ticker</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">TOTAL WATCHED</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">{summary.total_tracked} Stocks</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">CORE PORTFOLIO</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">{summary.portfolio_count} Names</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">AD-HOC RESEARCH</div>
              <div className="text-sm font-bold text-purple-400 mt-0.5">{summary.adhoc_count} Names</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto text-[11px] font-mono shrink-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
              filterMode === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({stocks.length})
          </button>
          <button
            onClick={() => setFilterMode('portfolio')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
              filterMode === 'portfolio' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Portfolio ({stocks.filter((s) => s.is_in_portfolio).length})
          </button>
          <button
            onClick={() => setFilterMode('adhoc')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
              filterMode === 'adhoc' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ad-Hoc ({stocks.filter((s) => !s.is_in_portfolio).length})
          </button>
          <button
            onClick={() => setFilterMode('high_volume')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
              filterMode === 'high_volume' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            Unusual Vol &gt;2x
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search stock, sector, symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-8 pr-3 py-1.5 text-xs rounded-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* High Density Stock List Cards */}
      <div className="space-y-2">
        {filteredStocks.map((stock) => {
          const isGain = stock.day_change_pct >= 0;
          const isHighVol = stock.volume_multiple >= 2.0;

          return (
            <div
              key={stock.symbol}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
            >
              {/* Left Column: Symbol, Name, Sector, Tags */}
              <div className="flex items-start space-x-3">
                <div
                  onClick={() => onSelectTickerForResearch(stock.symbol)}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-cyan-400 group-hover:underline flex items-center space-x-1">
                      <span>{stock.symbol}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        stock.is_in_portfolio
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                          : 'bg-purple-950 text-purple-300 border border-purple-800/50'
                      }`}
                    >
                      {stock.is_in_portfolio ? 'PORTFOLIO' : 'AD-HOC'}
                    </span>
                    {isHighVol && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-bold">
                        {stock.volume_multiple}x VOL
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                    {stock.name} • <span className="text-slate-500">{stock.sector}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Price, Change, Volume Multiple, Ratios, Actions */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60 font-mono">
                {/* Price & Change */}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-100">
                    ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-[10px] font-semibold flex items-center justify-end space-x-0.5 ${
                      isGain ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isGain ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>
                      {isGain ? '+' : ''}
                      {stock.day_change_pct}%
                    </span>
                  </div>
                </div>

                {/* Volume Stats */}
                <div className="text-right hidden md:block">
                  <div className="text-[10px] text-slate-400">VOL / 20D</div>
                  <div className="text-[11px] text-slate-200">
                    {stock.volume_multiple}x ({Math.round(stock.day_volume / 1000)}k)
                  </div>
                </div>

                {/* Key Ratios */}
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-400">P/E | ROCE</div>
                  <div className="text-[11px] text-slate-300">
                    {stock.pe_ratio ? `${stock.pe_ratio}x` : '-'} | {stock.roce_pct ? `${stock.roce_pct}%` : '-'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onSelectTickerForResearch(stock.symbol)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 text-[10px] transition-colors border border-slate-700/60"
                    title="Launch Grounded Pull Analysis"
                  >
                    Research
                  </button>
                  {!stock.is_in_portfolio && (
                    <button
                      onClick={() => onRemoveStock(stock.symbol)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from adhoc list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Ticker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-sm w-full space-y-3 font-mono">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Research Ticker (NSE/BSE)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Enter any valid Indian stock ticker (e.g., <code>HAL.NS</code>, <code>CIPLA.NS</code>, <code>BEL.NS</code>).
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Ticker symbol (e.g. HAL.NS)"
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 text-xs rounded-lg uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                autoFocus
              />

              <div className="flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="adhoc_choice"
                    checked={isAdhocChoice}
                    onChange={() => setIsAdhocChoice(true)}
                    className="accent-cyan-400"
                  />
                  <span>Ad-Hoc Research</span>
                </label>
                <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="adhoc_choice"
                    checked={!isAdhocChoice}
                    onChange={() => setIsAdhocChoice(false)}
                    className="accent-cyan-400"
                  />
                  <span>Portfolio Stock</span>
                </label>
              </div>

              {/* Suggestions */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500">Quick suggestions:</span>
                <div className="flex flex-wrap gap-1">
                  {['HAL.NS', 'CIPLA.NS', 'BEL.NS', 'DMART.NS', 'POLYCAB.NS'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewTickerInput(sug)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Fetching...' : 'Track Ticker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

