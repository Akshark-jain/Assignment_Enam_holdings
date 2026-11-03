import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Activity } from 'lucide-react';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  activeCount
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-3 py-2.5 sm:px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-cyan-900/30">
            F
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wider text-slate-100 font-mono">FINN</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 font-mono border border-cyan-800/40">
                ENAM INTEL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Mobile-First Financial Investment Agent
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold">NSE: LIVE</span>
            <span className="text-slate-500 hidden md:inline">| {activeCount} Stocks</span>
          </div>

          {/* Viewport switch: Mobile Device Frame vs Responsive Fullscreen */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-mono transition-colors border border-slate-700/60"
            title={isMobileFrame ? "Switch to responsive fullscreen terminal" : "Switch to mobile phone shell view"}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Desktop Terminal</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Phone Shell</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

