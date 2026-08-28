import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Plus,
  Search,
  Building2,
  Boxes,
  Calendar,
  Clock,
  Printer,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const StockTransfersPage = ({ onNavigate }) => {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');
  const [viewingTransfer, setViewingTransfer] = useState(null);

  const branches = useMemo(() => storageService.getBranches(), [refreshKey]);
  const centralInventory = useMemo(() => storageService.getCentralInventory(), [refreshKey]);
  const transfers = useMemo(() => storageService.getStockTransfers(), [refreshKey]);

  // Form State directly on page for ultra-simple transfer execution
  const [toBranchId, setToBranchId] = useState(branches[1]?.id || branches[0]?.id || '');
  const [productId, setProductId] = useState(centralInventory.find(p => p.quantity > 0)?.id || centralInventory[0]?.id || '');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = useMemo(() => {
    return centralInventory.find(p => p.id === productId) || null;
  }, [productId, centralInventory]);

  const selectedBranch = useMemo(() => {
    return branches.find(b => b.id === toBranchId) || null;
  }, [toBranchId, branches]);

  // Current branch stock for selected product
  const existingBranchStock = useMemo(() => {
    if (!toBranchId || !productId) return 0;
    const branchItems = storageService.getBranchInventory(toBranchId);
    const item = branchItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }, [toBranchId, productId, refreshKey]);

  const transferQty = Number(quantity) || 0;
  const centralBefore = selectedProduct ? selectedProduct.quantity : 0;
  const centralAfter = centralBefore - transferQty;
  const branchBefore = existingBranchStock;
  const branchAfter = branchBefore + transferQty;
  const isInsufficient = selectedProduct && transferQty > centralBefore;

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (!toBranchId) throw new Error('Please select a destination branch');
      if (!productId) throw new Error('Please select a product');
      if (!quantity || Number(quantity) <= 0) {
        throw new Error('Please enter a valid transfer quantity');
      }

      const res = storageService.createStockTransfer({
        toBranchId,
        productId,
        quantity,
        notes,
        transferredBy: currentUser?.name || 'Admin'
      });

      triggerRefresh();
      setQuantity('');
      setNotes('');
      setViewingTransfer(res.transfer);
      showToast(`Transferred ${res.transfer.quantity} units to ${res.transfer.toBranchName}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter(t => {
      const matchBranch = selectedBranchFilter === 'All' || t.toBranchId === selectedBranchFilter;
      const matchSearch =
        searchQuery === '' ||
        t.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.toBranchName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBranch && matchSearch;
    });
  }, [transfers, selectedBranchFilter, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <ArrowLeftRight className="h-6 w-6 text-emerald-600" />
          <span>Stock Transfer Dispatcher</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Transfer stock from Central Warehouse to any branch. Branch stock is automatically updated.
        </p>
      </div>

      {/* CORE WORKFLOW: Transfer Dispatch Card */}
      <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-md shadow-emerald-500/5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Transfer Stock to Branch</h2>
              <p className="text-xs text-slate-400">Select branch, product, and quantity to send</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Auto Branch Inventory Active
          </span>
        </div>

        <form onSubmit={handleExecuteTransfer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1: Destination Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                1. Select Destination Branch *
              </label>
              <select
                value={toBranchId}
                onChange={(e) => setToBranchId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) {b.isMainShop ? '— [Shop 1 Admin HQ]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Product */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                2. Select Product to Send *
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                {centralInventory.map(p => (
                  <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                    {p.name} — Central Stock: {p.quantity} {p.unit} {p.quantity === 0 ? '(Out of Stock)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                3. Quantity to Send ({selectedProduct?.unit || 'Units'}) *
              </label>
              <input
                type="number"
                min="1"
                max={centralBefore}
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Available in Central: ${centralBefore}`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-black text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

          </div>

          {/* Real-time Visual Before / After Pill */}
          {selectedProduct && selectedBranch && (
            <div className={`p-4 rounded-2xl border transition-all ${
              isInsufficient
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Central impact */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">Central Warehouse Stock</span>
                    <span className="text-slate-500 text-xs">Before: <strong>{centralBefore}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-600 font-bold block">-{transferQty || 0}</span>
                    <span className="text-sm font-black text-blue-800">
                      After: {centralAfter} {selectedProduct.unit}
                    </span>
                  </div>
                </div>

                {/* Branch impact */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">{selectedBranch.name} Stock</span>
                    <span className="text-slate-500 text-xs">Current: <strong>{branchBefore}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 font-bold block">+{transferQty || 0}</span>
                    <span className="text-sm font-black text-emerald-800">
                      New Stock: {branchAfter} {selectedProduct.unit}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isInsufficient || transferQty <= 0 || isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Confirm & Transfer Stock Now</span>
          </button>
        </form>
      </div>

      {/* Transfer History Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">Transfer History Log</h3>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transfer #, product..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <DataTable
          columns={[
            {
              key: 'transferNumber',
              header: 'Transfer #',
              render: (val, row) => (
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {val}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{row.date} {row.time}</div>
                </div>
              )
            },
            {
              key: 'productName',
              header: 'Product',
              render: (val, row) => (
                <div>
                  <div className="font-bold text-slate-900">{val}</div>
                  <div className="text-xs text-slate-400">{row.category} • SKU: {row.productSku}</div>
                </div>
              )
            },
            {
              key: 'quantity',
              header: 'Quantity',
              render: (val, row) => (
                <span className="font-black text-slate-900 text-sm">
                  {val} {row.unit}
                </span>
              )
            },
            {
              key: 'toBranchName',
              header: 'Destination Branch',
              render: (val) => <strong className="text-slate-800 text-xs">{val}</strong>
            },
            {
              key: 'status',
              header: 'Status',
              render: (val) => (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {val}
                </span>
              )
            },
            {
              key: 'actions',
              header: 'Voucher',
              className: 'text-right',
              render: (_, row) => (
                <button
                  onClick={() => setViewingTransfer(row)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  View
                </button>
              )
            }
          ]}
          data={filteredTransfers}
          pageSize={8}
          emptyMessage="No stock transfers recorded"
        />
      </div>

      {/* Transfer Voucher Modal */}
      {viewingTransfer && (
        <Modal
          isOpen={!!viewingTransfer}
          onClose={() => setViewingTransfer(null)}
          title={`Stock Transfer Voucher: ${viewingTransfer.transferNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-mono text-sm font-black text-emerald-800">{viewingTransfer.transferNumber}</span>
                <span className="font-bold text-slate-500">{viewingTransfer.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <strong className="text-slate-900">{viewingTransfer.toBranchName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <strong className="text-slate-900">{viewingTransfer.productName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <strong className="text-emerald-800 font-black text-sm">+{viewingTransfer.quantity} {viewingTransfer.unit}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transferred By:</span>
                <span>{viewingTransfer.transferredBy}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Print Slip
              </button>
              <button
                onClick={() => setViewingTransfer(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
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
