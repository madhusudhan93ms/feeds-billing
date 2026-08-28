import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Building2,
  TrendingUp,
  ReceiptText,
  Settings,
  Shield,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSidebar = ({ activeTab, onSelectTab, onCloseMobile }) => {
  const { lowStockSummary, settings } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'central-inventory',
      label: 'Central Stock (Warehouse)',
      icon: Boxes,
      badge: lowStockSummary.centralCount > 0 ? `${lowStockSummary.centralCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'stock-transfers',
      label: 'Transfer Stock to Shops',
      icon: ArrowLeftRight,
      highlight: true
    },
    { id: 'branches', label: 'Branch Shops Monitor', icon: Building2 },
    { id: 'sales', label: 'All Sales & Invoices', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Reset Demo', icon: Settings }
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-slate-900 text-slate-300 no-print">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-black text-white shadow-md shadow-blue-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight line-clamp-1">
              {settings.businessName || 'AgroFeeds Hub'}
            </h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Central Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          Admin Workflow Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              } ${item.highlight && !isActive ? 'border border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/30' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-xl bg-blue-950/40 p-3 border border-blue-800/40 text-[11px] text-blue-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-white">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Admin Workflow:</span>
          </p>
          <p className="text-[10px] text-blue-300">
            1. Add Stock in Central<br/>
            2. Transfer to any Shop<br/>
            3. Switch to Shop & Sell!
          </p>
        </div>
      </div>

    </aside>
  );
};
