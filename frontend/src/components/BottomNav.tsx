import React from 'react';
import { Newspaper, BellRing, SearchCode, LineChart } from 'lucide-react';

export type TabType = 'push' | 'alerts' | 'pull' | 'portfolio';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  alertCount: number;
  digestCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  alertCount,
  digestCount
}) => {
  const tabs = [
    {
      id: 'push' as TabType,
      label: 'Push Digest',
      icon: Newspaper,
      badge: digestCount > 0 ? digestCount : null,
      badgeColor: 'bg-cyan-500'
    },
    {
      id: 'alerts' as TabType,
      label: 'Alerts',
      icon: BellRing,
      badge: alertCount > 0 ? alertCount : null,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'pull' as TabType,
      label: 'Pull Research',
      icon: SearchCode,
      badge: null
    },
    {
      id: 'portfolio' as TabType,
      label: 'Portfolio',
      icon: LineChart,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] font-mono font-bold text-white px-1.5 py-0.2 rounded-full ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-mono tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-cyan-400 rounded-t-full shadow-glow" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

