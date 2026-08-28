import React from 'react';
import {
  ReceiptText,
  PackageCheck,
  TrendingUp,
  Store,
  Sparkles,
  ArrowDownLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ShopSidebar = ({ activeTab, onSelectTab, onCloseMobile }) => {
  const { currentUser, assignedBranch } = useAuth();

  const navItems = [
    { id: 'pos', label: '1. Quick Billing / POS', icon: ReceiptText, highlight: true },
    { id: 'inventory', label: '2. My Branch Stock', icon: PackageCheck },
    { id: 'sales', label: '3. Bills & Invoices', icon: TrendingUp }
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-slate-900 text-slate-300 no-print">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 font-black text-white shadow-md shadow-emerald-500/20">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight line-clamp-1">
              {currentUser?.branchName || 'Branch Shop'}
            </h1>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              {assignedBranch?.code || 'Shop Counter'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          Shop Staff Actions
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
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Branch Staff Badge & Notice */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
        <div className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-800/40 text-[11px] text-emerald-200">
          <p className="font-bold text-white">Staff: {currentUser?.name}</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">
            Stock is received automatically from Admin.
          </p>
        </div>
      </div>

    </aside>
  );
};
