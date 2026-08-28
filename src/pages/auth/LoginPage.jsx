import React, { useState } from 'react';
import {
  Shield,
  Store,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Boxes,
  MapPin,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { login, allUsers, branches } = useAuth();
  const { settings, showToast } = useApp();

  const [activePortalTab, setActivePortalTab] = useState('branches'); // 'branches' | 'admin' | 'manual'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adminUser = allUsers.find(u => u.role === 'admin') || allUsers[0];
  const branchUsers = allUsers.filter(u => u.role !== 'admin');

  const handleQuickLogin = (targetUser) => {
    try {
      login(targetUser.username, targetUser.password);
      showToast(`Welcome! Logged in to ${targetUser.branchName || 'Central Hub'}`, 'success');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      login(username, password);
      showToast('Logged in successfully!', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Main Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 mb-1">
            <Boxes className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {settings.businessName || 'AgroFeeds & Silage Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Multi-Branch Inventory & POS Billing System • Select Your Portal to Begin
          </p>
        </div>

        {/* Portal Chooser Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* CARD 1: 🏪 BRANCH SHOPS LOGIN (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Branch Shop Portals</h2>
                    <p className="text-xs text-emerald-400 font-medium">Select a branch to open its billing terminal</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800/60">
                  Shop Staff
                </span>
              </div>

              {/* Branch Quick Login Buttons */}
              <div className="space-y-2.5">
                {branches.map((branch, index) => {
                  const branchUser = allUsers.find(u => u.branchId === branch.id) || adminUser;

                  return (
                    <button
                      key={branch.id}
                      onClick={() => handleQuickLogin(branchUser)}
                      className={`w-full group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
                        branch.isMainShop
                          ? 'bg-blue-950/30 border-blue-800/40 hover:bg-blue-900/50 hover:border-blue-500'
                          : 'bg-slate-800/60 border-slate-700/60 hover:bg-emerald-950/40 hover:border-emerald-500/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black text-xs text-white ${
                          branch.isMainShop ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                              {branch.name}
                            </h4>
                            {branch.isMainShop && (
                              <span className="text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded">
                                HQ Shop #1
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <User className="h-3 w-3 text-slate-500" />
                            <span>Staff: <strong>{branch.assignedUserName}</strong></span>
                            <span className="text-slate-600">•</span>
                            <span className="font-mono text-slate-400">{branch.code}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                        <span>Open Shop</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Each shop staff has independent access to their branch inventory, POS billing, and bills.</span>
            </div>
          </div>

          {/* CARD 2: 👑 CENTRAL ADMIN LOGIN (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-blue-500/30 bg-slate-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Central Admin Portal</h2>
                    <p className="text-xs text-blue-400 font-medium">Main warehouse & stock transfer hub</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-950 text-blue-300 px-2 py-0.5 rounded-md border border-blue-800/60">
                  Admin
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  As Central Admin, you control warehouse stock intake, dispatch stock transfers to all 5 shops, monitor cross-branch inventory, and view sales reports.
                </p>

                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-1.5 text-[11px]">
                  <p className="font-bold text-blue-200">Admin Controls:</p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>Add & Manage Central Stock</li>
                    <li>Transfer Stock to Shops 1-5</li>
                    <li>Live Multi-Branch Overview</li>
                    <li>Consolidated Sales & Reports</li>
                  </ul>
                </div>
              </div>

              {/* 1-Click Admin Button */}
              <button
                onClick={() => handleQuickLogin(adminUser)}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all group"
              >
                <span>Enter as Central Admin</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Manual Login Accordion Toggle */}
            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={() => setActivePortalTab(activePortalTab === 'manual' ? 'branches' : 'manual')}
                className="text-[11px] text-slate-400 hover:text-slate-200 font-medium underline"
              >
                {activePortalTab === 'manual' ? 'Hide Manual Login' : 'Sign in with custom Username/Password'}
              </button>

              {activePortalTab === 'manual' && (
                <form onSubmit={handleManualSubmit} className="mt-3 space-y-2.5">
                  {error && <div className="text-[11px] text-rose-400 font-semibold">{error}</div>}
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        <p className="text-center text-xs text-slate-500">
          Client-Side LocalStorage • Demo Simulation Mode
        </p>

      </div>

    </div>
  );
};
