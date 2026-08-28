import React, { useState, useMemo } from 'react';
import {
  ArrowDownLeft,
  Search,
  CheckCircle2,
  Calendar,
  Package,
  FileText
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';

export const ShopTransfersPage = () => {
  const { currentUser } = useAuth();
  const { refreshKey } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTransfer, setViewingTransfer] = useState(null);

  const branchId = currentUser?.branchId;

  const transfers = useMemo(() => {
    if (!branchId) return [];
    const all = storageService.getStockTransfers({ toBranchId: branchId });
    return all.filter(t =>
      searchQuery === '' ||
      t.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.productSku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [branchId, refreshKey, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ArrowDownLeft className="h-6 w-6 text-emerald-600" />
            <span>Incoming Stock Received from Central</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Log of all inventory shipments dispatched by Admin to {currentUser?.branchName}.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transfer #, product name, SKU..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Transfers DataTable */}
      <DataTable
        columns={[
          {
            key: 'transferNumber',
            header: 'Transfer Ref #',
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
            key: 'productName',
            header: 'Product Received',
            sortable: true,
            render: (val, row) => (
              <div>
                <div className="font-bold text-slate-900">{val}</div>
                <div className="text-xs text-slate-400">{row.category} • SKU: {row.productSku}</div>
              </div>
            )
          },
          {
            key: 'quantity',
            header: 'Quantity Inward',
            sortable: true,
            render: (val, row) => (
              <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                +{val} {row.unit}
              </span>
            )
          },
          {
            key: 'fromLocation',
            header: 'Dispatched Origin',
            render: (val) => <span className="text-xs font-semibold text-blue-700">{val}</span>
          },
          {
            key: 'status',
            header: 'Status',
            render: (val) => (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{val}</span>
              </span>
            )
          },
          {
            key: 'transferredBy',
            header: 'Dispatched By',
            render: (val) => <span className="text-xs text-slate-500">{val}</span>
          },
          {
            key: 'actions',
            header: 'Voucher',
            className: 'text-right',
            render: (_, row) => (
              <button
                onClick={() => setViewingTransfer(row)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span>View</span>
              </button>
            )
          }
        ]}
        data={transfers}
        pageSize={10}
        emptyMessage="No stock transfers received yet"
      />

      {/* View Transfer Modal */}
      {viewingTransfer && (
        <Modal
          isOpen={!!viewingTransfer}
          onClose={() => setViewingTransfer(null)}
          title={`Transfer Voucher: ${viewingTransfer.transferNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold">{viewingTransfer.date} {viewingTransfer.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="font-bold text-slate-900">{viewingTransfer.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity:</span>
                <span className="font-black text-emerald-800 text-sm">+{viewingTransfer.quantity} {viewingTransfer.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <span>{viewingTransfer.fromLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatched By:</span>
                <span>{viewingTransfer.transferredBy}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingTransfer(null)}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
