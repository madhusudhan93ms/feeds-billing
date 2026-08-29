import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  TrendingUp,
  Shield,
  PlusCircle,
  X,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ activeTab, onSelectTab, onCloseMobile }) => {
  const { metrics, settings } = useApp();
  const { switchRole } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview & Today Metrics',
      icon: LayoutDashboard,
      badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'stock',
      label: 'Stock Management',
      icon: Boxes,
      badge: `${metrics.pendingStockUnits || 0} Units`,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'sales',
      label: 'Sales & Invoices History',
      icon: TrendingUp
    }
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-slate-900 text-slate-300 no-print">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-black text-white shadow-md shadow-blue-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-white tracking-tight truncate">
              {settings.storeName || 'QuickStock'}
            </h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Admin Portal
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
          Admin Controls
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

      {/* Footer Demo Helper */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="rounded-xl bg-blue-950/40 p-3 border border-blue-800/40 text-[11px] text-blue-200 space-y-1">
          <p className="font-bold text-white flex items-center gap-1.5">
            <span>🛡️ Admin Role:</span>
          </p>
          <p className="text-[10px] text-blue-300 leading-relaxed">
            • Add & restock inventory<br/>
            • View Sold Today (₹ & units)<br/>
            • Monitor Pending Stock
          </p>
        </div>

        <button
          onClick={() => switchRole('user')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
        >
          <User className="h-3.5 w-3.5" />
          <span>Switch to User (Billing)</span>
        </button>
      </div>

    </aside>
  );
};
