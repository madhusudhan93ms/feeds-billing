import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  ChevronDown,
  Shield,
  Store,
  Clock,
  Sparkles,
  AlertTriangle,
  Menu,
  Check,
  ArrowLeftRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const TopNav = ({ onToggleSidebar, activeTabTitle }) => {
  const { currentUser, isAdmin, allUsers, switchUser, logout, branches } = useAuth();
  const { lowStockSummary } = useApp();
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md no-print">
      
      {/* LEFT: Mobile Menu & Current Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-white text-xs shadow-xs ${
              isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
            }`}
          >
            {isAdmin ? <Shield className="h-4 w-4" /> : <Store className="h-4 w-4" />}
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              {isAdmin ? 'Central Admin Hub' : currentUser?.branchName}
            </h2>
            <p className="text-[11px] font-semibold text-slate-400">
              {isAdmin ? 'Warehouse & Multi-Branch Control' : `Logged in as: ${currentUser?.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Quick Switch Portal Pill, Alerts, Logout */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* FAST DEMO PORTAL SWITCHER DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(!showPortalMenu)}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-xs"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">
              Switch Portal: <span className="text-blue-700 font-black">{isAdmin ? 'Admin' : currentUser?.branchName?.split(' ')[0]}</span>
            </span>
            <span className="text-xs font-bold text-slate-800 sm:hidden">
              Switch
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {showPortalMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-in zoom-in-95">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Demo Portal:
                </p>
              </div>

              <div className="space-y-1">
                {allUsers.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  const isUserAdmin = user.role === 'admin';

                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user);
                        setShowPortalMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/90 border border-blue-200 text-blue-950 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold ${
                            isUserAdmin ? 'bg-blue-600' : 'bg-emerald-600'
                          }`}
                        >
                          {isUserAdmin ? 'AD' : user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold">{user.role === 'admin' ? 'Central Admin Portal' : user.branchName}</p>
                          <p className="text-[10px] text-slate-400">{user.name}</p>
                        </div>
                      </div>

                      {isCurrent && <Check className="h-4 w-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    logout();
                    setShowPortalMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl text-left text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out (Choose Portal)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct Log Out Button */}
        <button
          onClick={logout}
          title="Log Out"
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>

      </div>

    </header>
  );
};
