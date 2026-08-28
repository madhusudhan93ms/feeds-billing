import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Truck,
  Boxes,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const PurchasesPage = ({ onNavigate }) => {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Inward Purchase Form State
  const [formData, setFormData] = useState({
    supplier: 'MilkoMax Feed Mills Pvt Ltd',
    productId: '',
    quantity: '',
    purchasePrice: '',
    invoiceRef: `PUR-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const centralInventory = useMemo(() => {
    return storageService.getCentralInventory();
  }, [refreshKey]);

  const suppliers = useMemo(() => {
    return storageService.getSuppliers();
  }, [refreshKey]);

  // Purchases recorded as CENTRAL_ADD transactions
  const purchases = useMemo(() => {
    const txs = storageService.getStockTransactions({ type: 'CENTRAL_ADD' });
    return txs.filter(t =>
      searchQuery === '' ||
      t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.referenceId && t.referenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.supplier && t.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [refreshKey, searchQuery]);

  const handleOpenAdd = () => {
    const prod = centralInventory[0];
    setFormData({
      supplier: suppliers[0]?.name || 'MilkoMax Feed Mills Pvt Ltd',
      productId: prod ? prod.id : '',
      quantity: '',
      purchasePrice: prod ? prod.purchasePrice : '',
      invoiceRef: `PUR-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleSavePurchase = (e) => {
    e.preventDefault();
    try {
      if (!formData.productId) throw new Error('Please select a product');
      if (!formData.quantity || Number(formData.quantity) <= 0) {
        throw new Error('Please enter a valid purchase quantity');
      }

      storageService.addCentralStock({
        productId: formData.productId,
        quantity: formData.quantity,
        purchasePrice: formData.purchasePrice,
        date: formData.date,
        supplier: formData.supplier,
        notes: `PO Ref: ${formData.invoiceRef}. ${formData.notes || ''}`,
        createdBy: currentUser?.name || 'Admin Central'
      });

      triggerRefresh();
      setShowAddModal(false);
      showToast('Purchase intake recorded & Central Stock updated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span>Wholesale Purchases & Stock Intake</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record incoming wholesale supplies into Central Warehouse from manufacturer mills.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Purchase Order Intake</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search purchases by product, supplier, ref..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Purchases DataTable */}
      <DataTable
        columns={[
          {
            key: 'referenceId',
            header: 'PO Reference',
            sortable: true,
            render: (val) => (
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {val}
              </span>
            )
          },
          {
            key: 'date',
            header: 'Date & Time',
            sortable: true,
            render: (val, row) => (
              <span className="text-xs text-slate-600">{val} {row.time}</span>
            )
          },
          {
            key: 'productName',
            header: 'Product Purchased',
            sortable: true,
            render: (val) => <strong className="text-slate-900 font-bold">{val}</strong>
          },
          {
            key: 'supplier',
            header: 'Supplier / Vendor',
            sortable: true,
            render: (val) => (
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-slate-400" />
                <span>{val || 'Direct Factory'}</span>
              </span>
            )
          },
          {
            key: 'quantityChange',
            header: 'Quantity Inward',
            sortable: true,
            render: (val) => (
              <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                +{val} units
              </span>
            )
          },
          {
            key: 'purchasePrice',
            header: 'Purchase Rate',
            render: (val) => val ? `₹${Number(val).toLocaleString()}` : '—'
          },
          {
            key: 'newStock',
            header: 'Central Stock After',
            render: (val) => <span className="font-semibold text-slate-800">{val}</span>
          },
          {
            key: 'createdBy',
            header: 'Received By',
            render: (val) => <span className="text-xs text-slate-500">{val}</span>
          }
        ]}
        data={purchases}
        pageSize={10}
        emptyMessage="No wholesale purchase records found"
      />

      {/* NEW PURCHASE INTAKE MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="New Purchase Intake to Central Inventory"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSavePurchase} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Supplier / Mill *
                </label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Direct Mill Purchase">Direct Mill Purchase</option>
                  <option value="Agri Market Auction">Agri Market Auction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Invoice / PO Ref #
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoiceRef}
                  onChange={(e) => setFormData({ ...formData, invoiceRef: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Select Product *
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => {
                  const pId = e.target.value;
                  const p = centralInventory.find(item => item.id === pId);
                  setFormData({
                    ...formData,
                    productId: pId,
                    purchasePrice: p ? p.purchasePrice : formData.purchasePrice
                  });
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              >
                {centralInventory.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (SKU: {p.sku}) — Current: {p.quantity} {p.unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Quantity Inward *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 200"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-blue-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Purchase Price / Unit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="1400"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Intake Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Batch quality verified"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Save Purchase & Increment Central Stock
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
