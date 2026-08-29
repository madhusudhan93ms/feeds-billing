import React, { useState } from 'react';
import { Shield, ShoppingCart, Lock, Key, ArrowRight, UserCheck, Sparkles, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

export const LoginModal = ({ isOpen, onClose, onNavigate }) => {
  const { loginAsAdmin, loginAsStaff } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'staff'
  const [pin, setPin] = useState('1234');

  const handleLogin = (role) => {
    if (role === 'admin') {
      loginAsAdmin();
      if (onNavigate) onNavigate('/admin');
    } else {
      loginAsStaff();
      if (onNavigate) onNavigate('/');
    }
    if (onClose) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔐 Select User Login Role"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-500 font-medium">
          Choose a role to login. Designed for quick demonstration and real-world role segregation.
        </p>

        {/* 2 Big Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* ADMIN CARD */}
          <button
            type="button"
            onClick={() => handleLogin('admin')}
            className="p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-all flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-2 shadow-xs group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">Store Admin</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Full access to Stock, Add Items, Restock, Sales Ledger & KPIs.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200 flex items-center justify-between text-xs font-black text-blue-700">
              <span>Login &rarr;</span>
              <span className="text-[10px] bg-blue-200/80 px-2 py-0.5 rounded-full">/admin</span>
            </div>
          </button>

          {/* BILLING STAFF CARD */}
          <button
            type="button"
            onClick={() => handleLogin('staff')}
            className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 hover:bg-emerald-100/80 text-left transition-all flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-2 shadow-xs group-hover:scale-105 transition-transform">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">Billing Staff</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                POS Retail Counter, Product Search, Customer Info & Bill Print.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200 flex items-center justify-between text-xs font-black text-emerald-700">
              <span>Login &rarr;</span>
              <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full">/ (POS)</span>
            </div>
          </button>

        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
          Default Demo PIN: <strong className="text-slate-900">1234</strong> (1-tap instant switch supported)
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
