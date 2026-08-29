import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ReceiptText,
  Search,
  Eye,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { InvoiceModal } from '../../components/billing/InvoiceModal';

export const ShopSalesPage = () => {
  const { sales, settings, metrics } = useApp();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const currency = settings.currency || '₹';
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's sales
  const todaySales = useMemo(() => {
    return sales.filter((s) => s.date === todayStr);
  }, [sales, todayStr]);

  const filteredSales = useMemo(() => {
    return todaySales.filter((sale) => {
      const matchesSearch =
        (sale.invoiceNumber && sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [todaySales, searchQuery]);

  const totalTodayAmount = todaySales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Today's Bills & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and reprint customer receipts generated during today's shift.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-right">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Today's Shift Total</p>
          <p className="text-base font-black text-emerald-900">{currency}{totalTodayAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice number or customer name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* INVOICES LIST */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Customer Details</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3 text-center">Payment Mode</th>
                <th className="py-3 px-3 text-right">Bill Total</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-xs">No bills created yet today</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const itemCount = sale.items ? sale.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0) : 0;

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-black text-emerald-800">{sale.invoiceNumber}</span>
                      </td>

                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {sale.time}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{sale.customerName || 'Walk-in Customer'}</div>
                        {sale.customerPhone && (
                          <div className="text-[10px] text-slate-400 font-mono">{sale.customerPhone}</div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[11px]">
                          {itemCount} units ({sale.items?.length || 0} items)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded-full text-[11px] border border-emerald-200">
                          {sale.paymentMethod || 'Cash'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="text-sm font-black text-slate-900">
                          {currency}{Number(sale.grandTotal).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedInvoice(sale)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Reprint</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE RECEIPT MODAL */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        sale={selectedInvoice}
      />

    </div>
  );
};
