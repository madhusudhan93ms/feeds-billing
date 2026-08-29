import React from 'react';
import {
  ReceiptText,
  TrendingUp,
  User,
  Shield,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const ShopSidebar = ({ activeTab, onSelectTab, onCloseMobile }) => {
  const { currentUser, switchRole } = useAuth();
  const { metrics, settings } = useApp();

  const navItems = [
    {
      id: 'pos',
      label: 'Billing / POS Counter',
      icon: ReceiptText,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'today-bills',
      label: "Today's Bills & Receipts",
      icon: TrendingUp,
      badge: `${metrics.todayBillsCount || 0}`,
      badgeColor: 'bg-slate-700 text-slate-200'
    }
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-slate-900 text-slate-300 no-print">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 font-black text-white shadow-md shadow-emerald-500/20">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-white tracking-tight truncate">
              {settings.storeName || 'QuickStock'}
            </h1>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Cashier Billing
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          Billing Actions
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
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Info & Switch to Admin */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-800/40 text-[11px] text-emerald-200 space-y-1">
          <p className="font-bold text-white">👤 Cashier User:</p>
          <p className="text-[10px] text-emerald-300 leading-relaxed">
            • Bill products & print invoice<br/>
            • Automatically updates stock<br/>
            • View today's receipts
          </p>
        </div>

        <button
          onClick={() => switchRole('admin')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Switch to Admin View</span>
        </button>
      </div>

    </aside>
  );
};
