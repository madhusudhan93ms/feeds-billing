import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ReceiptText,
  Search,
  Calendar,
  Eye,
  ShoppingBag,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../../components/billing/InvoiceModal';

export const AdminSalesPage = () => {
  const { sales, settings, metrics } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today'
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const currency = settings.currency || '₹';
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        (sale.invoiceNumber && sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.cashierName && sale.cashierName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDate = dateFilter === 'all' || sale.date === todayStr;

      return matchesSearch && matchesDate;
    });
  }, [sales, searchQuery, dateFilter, todayStr]);

  const totalFilteredAmount = filteredSales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  const totalFilteredUnits = filteredSales.reduce((sum, s) => {
    return sum + (s.items ? s.items.reduce((iSum, i) => iSum + (Number(i.quantity) || 0), 0) : 0);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Sales & Invoices History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete record of all bills generated across shifts with printable receipt lookups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Total Billed</p>
            <p className="text-base font-black text-emerald-900">{currency}{totalFilteredAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice number, customer name, or cashier..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                dateFilter === 'all'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Invoices ({sales.length})
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                dateFilter === 'today'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sold Today ({metrics.todayBillsCount || 0})
            </button>
          </div>

        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Cashier</th>
                <th className="py-3 px-3">Customer Details</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-xs">No sales invoices found matching filters</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const itemCount = sale.items ? sale.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0) : 0;

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-3 px-4">
                        <span className="font-black text-blue-700">{sale.invoiceNumber}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{sale.date}</div>
                        <div className="text-[11px] text-slate-400">{sale.time}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700">{sale.cashierName || 'Cashier'}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{sale.customerName || 'Walk-in Customer'}</div>
                        {sale.customerPhone && (
                          <div className="text-[10px] text-slate-400 font-mono">{sale.customerPhone}</div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[11px]">
                          {itemCount} units ({sale.items?.length || 0} products)
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Bill</span>
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
