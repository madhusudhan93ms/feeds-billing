import React, { useState } from 'react';
import {
  Shield,
  User,
  Boxes,
  ArrowRight,
  Sparkles,
  ReceiptText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { login, allUsers } = useAuth();
  const { settings, showToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminUser = allUsers.find((u) => u.role === 'admin') || allUsers[0];
  const cashierUser = allUsers.find((u) => u.role !== 'admin') || allUsers[1] || allUsers[0];

  const handleQuickLogin = (targetUser) => {
    try {
      login(targetUser.username, targetUser.password);
      showToast(`Welcome! Logged in as ${targetUser.name}`, 'success');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      login(username, password);
      showToast('Logged in successfully!', 'success');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 selection:bg-blue-500 selection:text-white">
      
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Main Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 mb-1">
            <Boxes className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {settings.storeName || 'QuickStock & POS'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Clean 2-User Demonstration: Admin Stock Management & User Point of Sale
          </p>
        </div>

        {/* 2 Roles Chooser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* CARD 1: 🛡️ ADMIN PORTAL */}
          <div
            onClick={() => handleQuickLogin(adminUser)}
            className="group rounded-3xl border border-blue-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-5 cursor-pointer hover:border-blue-400 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Admin Portal</h2>
                    <p className="text-xs text-blue-400 font-medium">Stock & Sales Overview</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-950 text-blue-300 px-2.5 py-1 rounded-md border border-blue-800/60">
                  Manager
                </span>
              </div>

              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  <span>Add, edit & restock products</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  <span>Monitor <strong>Sold Today</strong> (₹ & items)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  <span>Track <strong>Pending Stock</strong> in inventory</span>
                </li>
              </ul>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30">
              <span>Open Admin View</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* CARD 2: 👤 USER BILLING PORTAL */}
          <div
            onClick={() => handleQuickLogin(cashierUser)}
            className="group rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-5 cursor-pointer hover:border-emerald-400 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">User Billing Counter</h2>
                    <p className="text-xs text-emerald-400 font-medium">Point of Sale (POS)</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-800/60">
                  Cashier
                </span>
              </div>

              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Browse catalog with live stock badges</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Bill products & apply discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Auto-deduct stock & print invoices</span>
                </li>
              </ul>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30">
              <span>Open Billing POS</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

        {error && (
          <p className="text-center text-xs text-rose-400 font-semibold">{error}</p>
        )}

      </div>

    </div>
  );
};
