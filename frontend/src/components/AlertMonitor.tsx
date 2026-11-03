import React, { useState } from 'react';
import {
  BellRing,
  Sliders,
  TrendingUp,
  TrendingDown,
  Volume2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { TriggeredAlert, AlertThresholds } from '../types';

interface AlertMonitorProps {
  alerts: TriggeredAlert[];
  thresholds: AlertThresholds;
  onUpdateThresholds: (thresholds: AlertThresholds) => void;
  onSelectTickerForResearch: (ticker: string) => void;
  isLoading: boolean;
}

export const AlertMonitor: React.FC<AlertMonitorProps> = ({
  alerts,
  thresholds,
  onUpdateThresholds,
  onSelectTickerForResearch,
  isLoading
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [volumeSlider, setVolumeSlider] = useState(thresholds.volume_multiple);
  const [priceSlider, setPriceSlider] = useState(thresholds.price_change_abs_pct);
  const [selectedCats, setSelectedCats] = useState<string[]>(thresholds.monitored_categories);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const allAvailableCategories = [
    { id: 'results', label: 'Quarterly Results' },
    { id: 'management_change', label: 'Management Changes' },
    { id: 'M&A', label: 'M&A / JV' },
    { id: 'credit_rating', label: 'Credit Ratings' },
    { id: 'litigation', label: 'Litigations / Orders' },
    { id: 'fund_raise', label: 'Fund Raising / QIP' },
    { id: 'capex', label: 'Capex Expansion' }
  ];

  const handleSave = () => {
    onUpdateThresholds({
      volume_multiple: volumeSlider,
      price_change_abs_pct: priceSlider,
      monitored_categories: selectedCats
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleCategory = (catId: string) => {
    if (selectedCats.includes(catId)) {
      setSelectedCats(selectedCats.filter((c) => c !== catId));
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Configuration Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellRing className="w-4 h-4 text-rose-400" />
            <span className="font-mono font-bold text-sm text-slate-100">Triggered Alerts Monitor</span>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-400 transition-colors border border-slate-700/60"
          >
            <Sliders className="w-3 h-3" />
            <span>{showConfig ? 'Hide Config' : 'Configure Triggers'}</span>
          </button>
        </div>

        {/* Current Active Rules Summary */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[10px]">VOLUME TRIGGER</div>
            <div className="font-bold text-amber-400 mt-0.5">
              &gt; {thresholds.volume_multiple}x 20d Avg
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[10px]">PRICE MOVE TRIGGER</div>
            <div className="font-bold text-rose-400 mt-0.5">
              ± {thresholds.price_change_abs_pct}% in day
            </div>
          </div>
        </div>

        {/* Expandable Configuration Drawer */}
        {showConfig && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3.5 text-xs">
            {/* Volume Threshold Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-300">Unusual Volume Multiple:</span>
                <span className="text-amber-400 font-bold">{volumeSlider.toFixed(1)}x recent avg</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="5.0"
                step="0.1"
                value={volumeSlider}
                onChange={(e) => setVolumeSlider(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.2x (Sensitive)</span>
                <span>3.0x</span>
                <span>5.0x (Extreme)</span>
              </div>
            </div>

            {/* Price Move Threshold Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-300">EOD Daily Price Move:</span>
                <span className="text-rose-400 font-bold">±{priceSlider.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={priceSlider}
                onChange={(e) => setPriceSlider(parseFloat(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>±1.0%</span>
                <span>±5.0%</span>
                <span>±10.0%</span>
              </div>
            </div>

            {/* Monitored Filing Categories */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono text-[11px] block">
                Monitor Material Announcement Types:
              </label>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                {allAvailableCategories.map((cat) => {
                  const isChecked = selectedCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-2 py-1.5 rounded text-left transition-all border ${
                        isChecked
                          ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-950 transition-all"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Thresholds Updated!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-white" />
                  <span>Apply Alert Thresholds</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Active Alerts List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Active Alerts ({alerts.length})
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Real-time Watch</span>
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-900/60 border border-slate-800/80 h-24 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && alerts.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
            <p className="text-slate-300 text-xs font-mono font-medium">All Clear across Portfolio</p>
            <p className="text-slate-500 text-[11px] mt-1">No stocks breached your current alert parameters.</p>
          </div>
        )}

        {!isLoading &&
          alerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-900/60'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-900/60'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      onClick={() => onSelectTickerForResearch(alert.ticker)}
                      className="font-mono font-bold text-sm text-cyan-400 cursor-pointer hover:underline"
                    >
                      {alert.ticker}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                      {alert.company_name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                        : isHigh
                        ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="mt-2 flex items-center space-x-2">
                  {alert.alert_type === 'VOLUME_SPIKE' && (
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  {alert.alert_type === 'PRICE_SURGE' && (
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {alert.alert_type === 'PRICE_PLUNGE' && (
                    <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  {alert.alert_type === 'MATERIAL_FILING' && (
                    <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-semibold text-slate-200">{alert.title}</h4>
                </div>

                <p className="mt-1 text-[11px] text-slate-300 leading-relaxed font-mono">
                  {alert.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{alert.relative_time}</span>
                  <button
                    onClick={() => onSelectTickerForResearch(alert.ticker)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                  >
                    Investigate Fundamentals →
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
