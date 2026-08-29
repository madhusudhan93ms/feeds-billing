import React, { useState } from 'react';
import {
  Shield,
  ShoppingCart,
  Bell,
  Building2,
  Settings,
  Trash2,
  Store,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

export const TopNav = ({ isAdminRoute, onNavigate }) => {
  const { metrics, notifications, clearNotifications, markNotificationsAsRead, clearAll } = useApp();

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const unreadCount = metrics.unreadNotifCount || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* BRAND LOGO & TITLE */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-white text-lg sm:text-xl shadow-lg shadow-emerald-500/20 shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight text-white leading-none">
                AGROFEEDS & SILAGE
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isAdminRoute
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isAdminRoute ? 'Admin Portal' : 'Billing Counter'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
              {isAdminRoute
                ? 'Store Inventory & Financial Management'
                : 'Point of Sale & Retail Billing Terminal'}
            </p>
          </div>
        </div>

        {/* RIGHT CONTROLS: ONLY ADMIN HAS OPEN POS LINK */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Admin has button to test/open Billing Counter */}
          {isAdminRoute ? (
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Open Billing Counter</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            /* Staff Counter sees a clean status badge */
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Billing Terminal Active</span>
            </div>
          )}

          {/* Real-time Alerts Bell (Admin view) */}
          {isAdminRoute && (
            <button
              type="button"
              onClick={() => {
                markNotificationsAsRead();
                setShowNotifModal(true);
              }}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Real-Time Alerts"
            >
              <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Settings / Reset */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="System Settings"
          >
            <Settings className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>

        </div>

      </div>

      {/* NOTIFICATIONS MODAL */}
      {showNotifModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNotifModal(false)}
          title="🔔 Live Billing & Stock Alerts"
          maxWidth="max-w-lg"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-bold">
                {notifications.length} Activity Events Logged
              </span>
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
              {notifications.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400 font-bold">
                  No activity recorded yet.
                </p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="pt-2 first:pt-0 flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${
                      n.type === 'low_stock'
                        ? 'bg-amber-100 text-amber-900'
                        : n.type === 'restock'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {n.type === 'low_stock' ? '⚠️' : n.type === 'restock' ? '📦' : '💰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-black text-slate-900 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowNotifModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowSettingsModal(false)}
          title="⚙️ Store System Settings"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-black text-slate-800 text-sm">AGROFEEDS Retail POS Engine</p>
              <p>Database: <strong>Local Sync Store</strong></p>
              <p>System Status: <strong>🟢 Online & Ready</strong></p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Demonstration Data Options:
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all products and sales to start fresh?')) {
                    clearAll();
                    setShowSettingsModal(false);
                  }
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All Test Data (Start Fresh)</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

    </header>
  );
};
