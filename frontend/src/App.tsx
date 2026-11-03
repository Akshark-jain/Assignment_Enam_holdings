import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { PushFeed } from './components/PushFeed';
import { AlertMonitor } from './components/AlertMonitor';
import { PortfolioView } from './components/PortfolioView';
import { PullResearch } from './components/PullResearch';
import {
  fetchPortfolio,
  fetchStocks,
  fetchDigest,
  fetchAlerts,
  fetchThresholds,
  saveThresholds,
  fetchResearch,
  addStock,
  removeStock
} from './services/api';
import {
  Stock,
  PortfolioSummary,
  DigestResponse,
  TriggeredAlert,
  AlertThresholds,
  PullResearchReport
} from './types';
import { Wifi, Battery, Signal } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('push');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Data states
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [digest, setDigest] = useState<DigestResponse | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string>('24h');
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
  const [thresholds, setThresholds] = useState<AlertThresholds>({
    volume_multiple: 2.0,
    price_change_abs_pct: 3.0,
    monitored_categories: ['results', 'M&A', 'management_change', 'litigation', 'fund_raise', 'credit_rating']
  });
  const [selectedResearchTicker, setSelectedResearchTicker] = useState<string>('RELIANCE.NS');
  const [researchReport, setResearchReport] = useState<PullResearchReport | null>(null);

  // Loading states
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);
  const [isDigestLoading, setIsDigestLoading] = useState(false);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [isResearchLoading, setIsResearchLoading] = useState(false);

  // Initial load
  useEffect(() => {
    loadPortfolio();
    loadThresholdsAndAlerts();
  }, []);

  // Digest reload when window changes
  useEffect(() => {
    loadDigest(selectedWindow);
  }, [selectedWindow]);

  // Pull research reload when ticker changes
  useEffect(() => {
    if (selectedResearchTicker) {
      loadResearch(selectedResearchTicker);
    }
  }, [selectedResearchTicker]);

  const loadPortfolio = async () => {
    try {
      setIsPortfolioLoading(true);
      const [sum, stockList] = await Promise.all([fetchPortfolio(), fetchStocks()]);
      setPortfolioSummary(sum);
      setStocks(stockList);
    } catch (err) {
      console.error('Error loading portfolio:', err);
    } finally {
      setIsPortfolioLoading(false);
    }
  };

  const loadDigest = async (win: string) => {
    try {
      setIsDigestLoading(true);
      const data = await fetchDigest(win);
      setDigest(data);
    } catch (err) {
      console.error('Error loading digest:', err);
    } finally {
      setIsDigestLoading(false);
    }
  };

  const loadThresholdsAndAlerts = async () => {
    try {
      setIsAlertsLoading(true);
      const [t, a] = await Promise.all([fetchThresholds(), fetchAlerts()]);
      setThresholds(t);
      setAlerts(a);
    } catch (err) {
      console.error('Error loading alerts:', err);
    } finally {
      setIsAlertsLoading(false);
    }
  };

  const handleUpdateThresholds = async (newThresholds: AlertThresholds) => {
    try {
      setIsAlertsLoading(true);
      const updated = await saveThresholds(newThresholds);
      setThresholds(updated);
      const freshAlerts = await fetchAlerts(updated.volume_multiple, updated.price_change_abs_pct);
      setAlerts(freshAlerts);
    } catch (err) {
      console.error('Error updating thresholds:', err);
    } finally {
      setIsAlertsLoading(false);
    }
  };

  const loadResearch = async (ticker: string) => {
    try {
      setIsResearchLoading(true);
      const rep = await fetchResearch(ticker);
      setResearchReport(rep);
    } catch (err) {
      console.error('Error loading research:', err);
    } finally {
      setIsResearchLoading(false);
    }
  };

  const handleSelectTickerForResearch = (ticker: string) => {
    setSelectedResearchTicker(ticker);
    setActiveTab('pull');
  };

  const handleAddStock = async (ticker: string, isAdhoc: boolean) => {
    await addStock(ticker, isAdhoc);
    await loadPortfolio();
    await loadDigest(selectedWindow);
    await loadThresholdsAndAlerts();
  };

  const handleRemoveStock = async (ticker: string) => {
    await removeStock(ticker);
    await loadPortfolio();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'push':
        return (
          <PushFeed
            digest={digest}
            selectedWindow={selectedWindow}
            setSelectedWindow={setSelectedWindow}
            onSelectTickerForResearch={handleSelectTickerForResearch}
            isLoading={isDigestLoading}
          />
        );
      case 'alerts':
        return (
          <AlertMonitor
            alerts={alerts}
            thresholds={thresholds}
            onUpdateThresholds={handleUpdateThresholds}
            onSelectTickerForResearch={handleSelectTickerForResearch}
            isLoading={isAlertsLoading}
          />
        );
      case 'portfolio':
        return (
          <PortfolioView
            stocks={stocks}
            summary={portfolioSummary}
            onSelectTickerForResearch={handleSelectTickerForResearch}
            onAddStock={handleAddStock}
            onRemoveStock={handleRemoveStock}
            isLoading={isPortfolioLoading}
          />
        );
      case 'pull':
        return (
          <PullResearch
            report={researchReport}
            selectedTicker={selectedResearchTicker}
            onSelectTicker={setSelectedResearchTicker}
            availableTickers={stocks.map((s) => s.symbol)}
            isLoading={isResearchLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans">
      {/* Top Global Terminal Header */}
      <Header
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        activeCount={stocks.length}
      />

      {/* Main View Area */}
      <main className="flex-1 flex justify-center py-2 sm:py-4 px-2">
        {isMobileFrame ? (
          /* Mobile Phone Shell Chassis */
          <div className="relative w-full max-w-[420px] bg-slate-950 rounded-[44px] border-[7px] border-slate-800/90 shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden min-h-[820px] max-h-[92vh]">
            {/* Phone Top Notch / Dynamic Island & Status Bar */}
            <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-slate-900/60 z-30">
              <span className="font-semibold text-slate-200">09:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center space-x-1.5 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] text-cyan-300 font-mono">FINN 1.0</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Signal className="w-3 h-3 text-slate-300" />
                <Wifi className="w-3 h-3 text-slate-300" />
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* Scrollable Content Inside Phone Screen */}
            <div className="flex-1 overflow-y-auto px-3 pt-3 pb-16 scrollbar-thin">
              {renderContent()}
            </div>

            {/* Bottom Nav fixed to phone footer */}
            <BottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              alertCount={alerts.length}
              digestCount={digest?.total_material_count || 0}
            />

            {/* iOS Home Bar Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700/60 rounded-full pointer-events-none z-50" />
          </div>
        ) : (
          /* Responsive Fullscreen Terminal Mode */
          <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[85vh]">
            <div className="flex-1 pb-16">{renderContent()}</div>
            <BottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              alertCount={alerts.length}
              digestCount={digest?.total_material_count || 0}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
