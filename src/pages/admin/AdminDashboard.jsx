import React, { useState } from 'react';
import {
  Boxes,
  PlusCircle,
  Trash2,
  Eye,
  Store,
  Building2,
  Bell,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  Phone,
  Receipt,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Edit2,
  Pencil
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../../components/billing/InvoiceModal';
import { Modal } from '../../components/common/Modal';

export const AdminDashboard = ({ onNavigate }) => {
  const {
    metrics,
    products,
    notifications,
    addProduct,
    updateProduct,
    restockProduct,
    deleteProduct,
    clearNotifications,
    markNotificationsAsRead,
    isLowStock,
    settings
  } = useApp();

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'sales'
  const [salesSearch, setSalesSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modals state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editTargetItem, setEditTargetItem] = useState(null);
  const [restockTargetItem, setRestockTargetItem] = useState(null);
  const [restockQty, setRestockQty] = useState('20');

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Item Form State
  const [itemSku, setItemSku] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Cattle Feeds');
  const [itemUnit, setItemUnit] = useState('Bags');
  const [itemPrice, setItemPrice] = useState('');
  const [itemStock, setItemStock] = useState('50');

  // Edit Item Form State
  const [editSku, setEditSku] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Cattle Feeds');
  const [editUnit, setEditUnit] = useState('Bags');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const currency = settings.currency || '₹';

  // Handle Add Item Submit
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice) return;

    addProduct({
      sku: itemSku.trim() || undefined,
      name: itemName.trim(),
      category: itemCategory,
      unit: itemUnit,
      price: Number(itemPrice) || 0,
      stock: Number(itemStock) || 0
    });

    setItemSku('');
    setItemName('');
    setItemPrice('');
    setItemStock('50');
    setIsAddProductModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditTargetItem(item);
    setEditSku(item.sku || '');
    setEditName(item.name || '');
    setEditCategory(item.category || 'Cattle Feeds');
    setEditUnit(item.unit || 'Bags');
    setEditPrice(item.price ? item.price.toString() : '');
    setEditStock(item.stock !== undefined ? item.stock.toString() : '0');
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editTargetItem || !editName.trim() || !editPrice) return;

    updateProduct(editTargetItem.id, {
      sku: editSku.trim() || undefined,
      name: editName.trim(),
      category: editCategory,
      unit: editUnit,
      price: Number(editPrice) || 0,
      stock: Number(editStock) || 0
    });

    setEditTargetItem(null);
  };

  // Handle Restock Submit
  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockTargetItem || Number(restockQty) <= 0) return;

    restockProduct(restockTargetItem.id, Number(restockQty));
    setRestockTargetItem(null);
    setRestockQty('20');
  };

  const todaySalesList = metrics.todaySalesList || [];
  const allSalesList = metrics.allSalesList || todaySalesList;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = inventorySearch.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  // Filtered Sales
  const filteredSales = allSalesList.filter((sale) => {
    const q = salesSearch.toLowerCase().trim();
    return (
      !q ||
      sale.invoiceNumber.toLowerCase().includes(q) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(q)) ||
      (sale.customerPhone && sale.customerPhone.includes(q))
    );
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* 1. EXECUTIVE STORE SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* TOTAL SALES TODAY */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-200">
                Total Revenue Today
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {currency}{(metrics.totalSoldToday || 0).toLocaleString()}
            </h2>
          </div>
          <p className="text-xs text-emerald-100 font-semibold mt-2">
            {metrics.totalItemsSoldToday || 0} items in {metrics.totalBillsCount || 0} bills
          </p>
        </div>

        {/* TOTAL STORE INVENTORY UNITS */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-blue-200">
                Total Store Stock
              </span>
              <Boxes className="h-4 w-4 text-blue-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {(metrics.totalStoreInventory || 0).toLocaleString()} Units
            </h2>
          </div>
          <p className="text-xs text-blue-100 font-semibold mt-2">
            Across {products.length} registered products
          </p>
        </div>

        {/* LOW STOCK ALERTS (<20%) */}
        <div className={`rounded-3xl p-4 sm:p-5 shadow-md flex flex-col justify-between text-white ${
          metrics.lowStockItemsCount > 0
            ? 'bg-gradient-to-br from-amber-600 to-orange-700'
            : 'bg-gradient-to-br from-slate-800 to-slate-900'
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-200">
                Low Stock Warnings
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {metrics.lowStockItemsCount || 0} Items
            </h2>
          </div>
          <p className="text-xs text-white/90 font-semibold mt-2">
            {metrics.lowStockItemsCount > 0 ? 'Stock is below 20% capacity' : 'All items well stocked'}
          </p>
        </div>

        {/* TODAY BILLS COUNT */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-3xl p-4 sm:p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-purple-200">
                Bills Generated
              </span>
              <Receipt className="h-4 w-4 text-purple-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {metrics.totalBillsCount || 0} Bills
            </h2>
          </div>
          <p className="text-xs text-purple-100 font-semibold mt-2">
            Created at billing counter today
          </p>
        </div>

      </div>

      {/* 2. ADMIN TOOLBAR & WORKSPACE TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>Store Inventory ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Sales & Bills ({allSalesList.length})</span>
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddProductModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>➕ Add New Product</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STORE INVENTORY TABLE, EDIT & RESTOCK */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Store Inventory & Price Management
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live stock levels, edit prices/stock, and low stock warnings (&lt;20%)
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Package className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p className="text-base font-bold text-slate-700">No products added yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click <strong>"➕ Add New Product"</strong> above to register inventory items.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">
              No products match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] sm:text-[11px]">
                    <th className="py-3.5 px-4">Item & SKU</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3 text-right">Selling Price</th>
                    <th className="py-3.5 px-3 text-center">Current Stock</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((item) => {
                    const stock = Number(item.stock) || 0;
                    const isOut = stock <= 0;
                    const lowWarn = isLowStock(item);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Name & SKU */}
                        <td className="py-3.5 px-4">
                          <p className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                            {item.sku || 'SKU'} &bull; Unit: {item.unit || 'Bags'}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                            {item.category || 'Feeds'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-3 text-right font-black text-slate-900 text-sm sm:text-base">
                          {currency}{Number(item.price).toLocaleString()}
                        </td>

                        {/* Stock + Quick Restock */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="px-3 py-1 bg-blue-50 text-blue-900 font-black text-xs sm:text-sm rounded-xl border border-blue-200">
                              {stock} Units
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setRestockTargetItem(item);
                                setRestockQty('20');
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black cursor-pointer shadow-2xs"
                              title="Restock Item"
                            >
                              +Restock
                            </button>
                          </div>
                        </td>

                        {/* Stock Status Badge (<20%) */}
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs ${
                            isOut
                              ? 'bg-rose-100 text-rose-800'
                              : lowWarn
                              ? 'bg-amber-100 text-amber-950 border border-amber-400 animate-pulse'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {lowWarn && !isOut && <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />}
                            <span>
                              {isOut ? 'Out of Stock' : lowWarn ? `Low Stock (<20%)` : 'In Stock'}
                            </span>
                          </span>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            
                            {/* EDIT BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Edit Price & Stock"
                            >
                              <Pencil className="h-3.5 w-3.5 text-blue-600" />
                              <span>Edit</span>
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}" from store inventory?`)) {
                                  deleteProduct(item.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SALES & INVOICES AUDIT LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-5">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Sales & Bills Audit Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Complete transactional audit trail of bills generated at the counter
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                placeholder="Search invoice or customer..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {filteredSales.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">
              No bills match the search filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Grand Total</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-black text-blue-700 text-sm">
                        {sale.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {sale.date} {sale.time}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{sale.customerName || 'Walk-in'}</p>
                        {sale.customerPhone && (
                          <p className="text-[10px] text-slate-400">{sale.customerPhone}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">
                        {sale.items ? sale.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0) : 0} items
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-black text-[10px] uppercase">
                          {sale.paymentMethod || 'Cash'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-950 text-sm">
                        {currency}{Number(sale.grandTotal).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(sale)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Bill</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW PRODUCT */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        title="➕ Add New Product to Store"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Milkegen 10000"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                SKU / Code (Optional)
              </label>
              <input
                type="text"
                value={itemSku}
                onChange={(e) => setItemSku(e.target.value)}
                placeholder="e.g., SKU-101"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Category
              </label>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Cattle Feeds">Cattle Feeds</option>
                <option value="Silage & Fodder">Silage & Fodder</option>
                <option value="Mineral Supplements">Mineral Supplements</option>
                <option value="Grains & Seeds">Grains & Seeds</option>
                <option value="General Products">General Products</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Unit of Measure
              </label>
              <select
                value={itemUnit}
                onChange={(e) => setItemUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Bags">Bags (50KG)</option>
                <option value="KG">Kilograms (KG)</option>
                <option value="Liters">Liters</option>
                <option value="Pieces">Pieces / Units</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Selling Price ({currency}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="e.g., 1850"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Initial Stock Units <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={itemStock}
                onChange={(e) => setItemStock(e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT PRODUCT (PRICE, STOCK, NAME, SKU) */}
      {/* ========================================================================= */}
      {editTargetItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditTargetItem(null)}
          title={`✏️ Edit Product: ${editTargetItem.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  SKU / Code
                </label>
                <input
                  type="text"
                  value={editSku}
                  onChange={(e) => setEditSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Cattle Feeds">Cattle Feeds</option>
                  <option value="Silage & Fodder">Silage & Fodder</option>
                  <option value="Mineral Supplements">Mineral Supplements</option>
                  <option value="Grains & Seeds">Grains & Seeds</option>
                  <option value="General Products">General Products</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Unit of Measure
                </label>
                <select
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Bags">Bags (50KG)</option>
                  <option value="KG">Kilograms (KG)</option>
                  <option value="Liters">Liters</option>
                  <option value="Pieces">Pieces / Units</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Selling Price ({currency}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Current Stock Units <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditTargetItem(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 1-CLICK RESTOCK ITEM */}
      {/* ========================================================================= */}
      {restockTargetItem && (
        <Modal
          isOpen={true}
          onClose={() => setRestockTargetItem(null)}
          title={`📦 Restock Item: ${restockTargetItem.name}`}
          maxWidth="max-w-sm"
        >
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Current Available Stock: <strong className="text-slate-900 text-sm">{restockTargetItem.stock} Units</strong>
            </p>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Units to Add to Stock:
              </label>
              <input
                type="number"
                required
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-lg font-black text-center focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex gap-2">
              {[10, 25, 50, 100].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setRestockQty(q.toString())}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-lg cursor-pointer"
                >
                  +{q}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRestockTargetItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
              >
                Add Units
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAX INVOICE PREVIEW */}
      {/* ========================================================================= */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        sale={selectedInvoice}
      />

    </div>
  );
};
