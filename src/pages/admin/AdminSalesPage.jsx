import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  Receipt,
  FileText,
  Calendar,
  Building2,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  User
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { InvoiceModal } from '../../components/billing/InvoiceModal';

export const AdminSalesPage = () => {
  const { refreshKey } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('All');
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const branches = useMemo(() => {
    return storageService.getBranches();
  }, [refreshKey]);

  const sales = useMemo(() => {
    return storageService.getSales();
  }, [refreshKey]);

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchBranch = selectedBranchFilter === 'All' || s.branchId === selectedBranchFilter;
      const matchPayment = selectedPaymentFilter === 'All' || s.paymentMethod === selectedPaymentFilter;
      const matchSearch =
        searchQuery === '' ||
        s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBranch && matchPayment && matchSearch;
    });
  }, [sales, selectedBranchFilter, selectedPaymentFilter, searchQuery]);

  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  }, [filteredSales]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>Sales & Revenue Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time transaction log across all 5 retail shop locations.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs flex items-center space-x-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Filtered Revenue</span>
            <strong className="text-base font-black text-emerald-800">₹{totalRevenue.toLocaleString()}</strong>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Invoices</span>
            <strong className="text-base font-black text-slate-800">{filteredSales.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Branch Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedBranchFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedBranchFilter === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Branches
            </button>

            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchFilter(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedBranchFilter === b.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Payment Method & Search */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedPaymentFilter}
              onChange={(e) => setSelectedPaymentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI / GPay</option>
              <option value="Card">Card</option>
              <option value="Credit">Credit</option>
            </select>

            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoice #, customer..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

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
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {val}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">{row.date} at {row.time}</div>
              </div>
            )
          },
          {
            key: 'branchName',
            header: 'Branch Shop',
            sortable: true,
            render: (val) => (
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>{val}</span>
              </span>
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
            header: 'Items Breakdown',
            render: (items) => (
              <div className="text-xs text-slate-600 max-w-xs space-y-0.5">
                {items.slice(0, 2).map((it, idx) => (
                  <div key={idx} className="line-clamp-1">
                    • {it.quantity}x {it.name}
                  </div>
                ))}
                {items.length > 2 && (
                  <span className="text-[10px] font-bold text-slate-400">+{items.length - 2} more item(s)</span>
                )}
              </div>
            )
          },
          {
            key: 'grandTotal',
            header: 'Bill Amount',
            sortable: true,
            render: (val) => <strong className="text-sm font-black text-emerald-800">₹{val.toLocaleString()}</strong>
          },
          {
            key: 'paymentMethod',
            header: 'Payment',
            sortable: true,
            render: (val) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {val}
              </span>
            )
          },
          {
            key: 'createdBy',
            header: 'Billed By',
            render: (val) => <span className="text-xs text-slate-500">{val}</span>
          },
          {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (_, row) => (
              <button
                onClick={() => setViewingInvoice(row)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Invoice</span>
              </button>
            )
          }
        ]}
        data={filteredSales}
        pageSize={10}
        emptyMessage="No sales transactions found"
        emptySubMessage="Sales made across branches or at Main HQ Shop will appear here."
      />

      {/* Invoice View Modal */}
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
