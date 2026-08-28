import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  FileText,
  Calendar,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { InvoiceModal } from '../../components/billing/InvoiceModal';

export const ShopSalesPage = () => {
  const { currentUser } = useAuth();
  const { refreshKey } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('All');
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const branchId = currentUser?.branchId;

  const sales = useMemo(() => {
    if (!branchId) return [];
    return storageService.getSales({ branchId });
  }, [branchId, refreshKey]);

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchPayment = selectedPaymentFilter === 'All' || s.paymentMethod === selectedPaymentFilter;
      const matchSearch =
        searchQuery === '' ||
        s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchPayment && matchSearch;
    });
  }, [sales, selectedPaymentFilter, searchQuery]);

  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  }, [filteredSales]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <span>Branch Sales History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            All retail sales and customer invoices created at {currentUser?.branchName}.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs flex items-center space-x-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Sales</span>
            <strong className="text-base font-black text-emerald-800">₹{totalRevenue.toLocaleString()}</strong>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoices</span>
            <strong className="text-base font-black text-slate-800">{filteredSales.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Payment:</span>
          <select
            value={selectedPaymentFilter}
            onChange={(e) => setSelectedPaymentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI / GPay</option>
            <option value="Card">Card</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, customer..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Sales DataTable */}
      <DataTable
        columns={[
          {
            key: 'invoiceNumber',
            header: 'Invoice #',
            sortable: true,
            render: (val, row) => (
              <div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {val}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">{row.date} at {row.time}</div>
              </div>
            )
          },
          {
            key: 'customerName',
            header: 'Customer',
            sortable: true,
            render: (val, row) => (
              <div>
                <div className="font-semibold text-slate-900">{val}</div>
                {row.customerPhone && <div className="text-xs text-slate-400">{row.customerPhone}</div>}
              </div>
            )
          },
          {
            key: 'items',
            header: 'Products Sold',
            render: (items) => (
              <div className="text-xs text-slate-600 max-w-xs space-y-0.5">
                {items.slice(0, 2).map((it, idx) => (
                  <div key={idx} className="line-clamp-1">
                    • {it.quantity}x {it.name}
                  </div>
                ))}
                {items.length > 2 && (
                  <span className="text-[10px] font-bold text-slate-400">+{items.length - 2} more</span>
                )}
              </div>
            )
          },
          {
            key: 'grandTotal',
            header: 'Total Bill',
            sortable: true,
            render: (val) => <strong className="text-sm font-black text-emerald-800">₹{val.toLocaleString()}</strong>
          },
          {
            key: 'paymentMethod',
            header: 'Payment Method',
            render: (val) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {val}
              </span>
            )
          },
          {
            key: 'actions',
            header: 'Action',
            className: 'text-right',
            render: (_, row) => (
              <button
                onClick={() => setViewingInvoice(row)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>View & Print Bill</span>
              </button>
            )
          }
        ]}
        data={filteredSales}
        pageSize={10}
        emptyMessage="No sales recorded at this branch yet"
      />

      {/* Invoice Modal */}
      {viewingInvoice && (
        <InvoiceModal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          sale={viewingInvoice}
        />
      )}

    </div>
  );
};
