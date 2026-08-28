import React, { useState } from 'react';
import { ReceiptText, ShoppingCart, FileSpreadsheet, PlusCircle } from 'lucide-react';
import { PointOfSale } from '../../components/billing/PointOfSale';
import { AdminSalesPage } from './AdminSalesPage';

export const AdminBillingPage = () => {
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'invoices'

  return (
    <div className="space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ReceiptText className="h-6 w-6 text-emerald-600" />
            <span>Admin Billing & Point of Sale (POS)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate invoices at Shop 1 (Admin Main HQ) or manage billing across all 5 branches.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('pos')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pos'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Create New Bill (POS)</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'invoices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>All Invoices Log</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      {activeTab === 'pos' ? (
        <PointOfSale />
      ) : (
        <AdminSalesPage />
      )}

    </div>
  );
};
