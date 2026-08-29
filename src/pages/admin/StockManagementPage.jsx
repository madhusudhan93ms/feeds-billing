import React, { useState, useMemo } from 'react';
import {
  Boxes,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';
import { Modal } from '../../components/common/Modal';

export const StockManagementPage = () => {
  const { products, categories, settings, addProduct, updateProduct, deleteProduct, restockProduct } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // 'All' | 'low' | 'out' | 'in'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockProductTarget, setRestockProductTarget] = useState(null);
  const [restockQty, setRestockQty] = useState(25);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const currency = settings.currency || '₹';

  const [formState, setFormState] = useState({
    name: '',
    sku: '',
    category: 'Feeds',
    unit: 'Bag (50KG)',
    costPrice: '',
    sellingPrice: '',
    stock: 20,
    minStock: 10,
    description: ''
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'out') {
        matchesStock = Number(p.stock) === 0;
      } else if (stockFilter === 'low') {
        matchesStock = Number(p.stock) > 0 && Number(p.stock) <= Number(p.minStock || 5);
      } else if (stockFilter === 'in') {
        matchesStock = Number(p.stock) > Number(p.minStock || 5);
      }

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Open Edit Modal
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormState({
      name: p.name,
      sku: p.sku || '',
      category: p.category || 'Feeds',
      unit: p.unit || 'Unit',
      costPrice: p.costPrice || '',
      sellingPrice: p.sellingPrice || '',
      stock: p.stock || 0,
      minStock: p.minStock || 5,
      description: p.description || ''
    });
  };

  // Submit Add or Edit
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.sellingPrice) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formState.name.trim(),
        sku: formState.sku.trim(),
        category: formState.category,
        unit: formState.unit,
        costPrice: Number(formState.costPrice) || 0,
        sellingPrice: Number(formState.sellingPrice) || 0,
        stock: Number(formState.stock) || 0,
        minStock: Number(formState.minStock) || 5,
        description: formState.description
      });
      setEditingProduct(null);
    } else {
      addProduct({
        ...formState,
        costPrice: Number(formState.costPrice) || 0,
        sellingPrice: Number(formState.sellingPrice) || 0,
        stock: Number(formState.stock) || 0,
        minStock: Number(formState.minStock) || 5
      });
      setIsAddModalOpen(false);
    }

    setFormState({
      name: '',
      sku: '',
      category: 'Feeds',
      unit: 'Bag (50KG)',
      costPrice: '',
      sellingPrice: '',
      stock: 20,
      minStock: 10,
      description: ''
    });
  };

  // Handle Restock Submit
  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockProductTarget || Number(restockQty) <= 0) return;
    restockProduct(restockProductTarget.id, Number(restockQty));
    setRestockProductTarget(null);
    setRestockQty(25);
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      deleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Stock & Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add new products, adjust stock quantities, and view current stock valuation.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormState({
              name: '',
              sku: '',
              category: 'Feeds',
              unit: 'Bag (50KG)',
              costPrice: '',
              sellingPrice: '',
              stock: 30,
              minStock: 10,
              description: ''
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by name or SKU..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Stock Level Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'All', label: 'All' },
              { id: 'in', label: 'In Stock' },
              { id: 'low', label: 'Low Stock' },
              { id: 'out', label: 'Out of Stock' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStockFilter(f.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  stockFilter === f.id
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Product Info</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Cost ({currency})</th>
                <th className="py-3 px-3 text-right">Selling Price ({currency})</th>
                <th className="py-3 px-3 text-center">In Stock</th>
                <th className="py-3 px-3 text-right">Total Valuation</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Boxes className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-xs">No products found matching filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const valuation = (Number(p.stock) || 0) * (Number(p.sellingPrice) || 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {p.sku} • {p.unit}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-3 text-right text-slate-500 font-medium">
                        {currency}{Number(p.costPrice || 0).toLocaleString()}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-3 text-right font-black text-slate-900">
                        {currency}{Number(p.sellingPrice || 0).toLocaleString()}
                      </td>

                      {/* In Stock */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs ${
                          p.stock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.stock <= p.minStock
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>

                      {/* Valuation */}
                      <td className="py-3 px-3 text-right font-bold text-blue-700">
                        {currency}{valuation.toLocaleString()}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <StockStatusBadge quantity={p.stock} minStock={p.minStock} size="xs" />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Quick Restock */}
                          <button
                            onClick={() => {
                              setRestockProductTarget(p);
                              setRestockQty(25);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[11px] transition-colors"
                            title="Add stock"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Restock</span>
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteCandidate(p)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          title={editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Stock / Product"}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g., Dairy Cattle Feed 50KG"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SKU / Code
                </label>
                <input
                  type="text"
                  value={formState.sku}
                  onChange={(e) => setFormState({ ...formState, sku: e.target.value })}
                  placeholder="e.g., FED-105"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selling Price ({currency}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formState.sellingPrice}
                  onChange={(e) => setFormState({ ...formState, sellingPrice: e.target.value })}
                  placeholder="1650"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cost / Purchase Price ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  value={formState.costPrice}
                  onChange={(e) => setFormState({ ...formState, costPrice: e.target.value })}
                  placeholder="1350"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Stock Quantity (Units) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formState.stock}
                  onChange={(e) => setFormState({ ...formState, stock: e.target.value })}
                  placeholder="50"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Low Stock Alert Level
                </label>
                <input
                  type="number"
                  min="1"
                  value={formState.minStock}
                  onChange={(e) => setFormState({ ...formState, minStock: e.target.value })}
                  placeholder="10"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                {editingProduct ? 'Save Changes' : 'Add to Stock'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* RESTOCK MODAL */}
      {restockProductTarget && (
        <Modal
          isOpen={true}
          onClose={() => setRestockProductTarget(null)}
          title={`Restock Stock: ${restockProductTarget.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500">Current Stock: <strong className="text-slate-900">{restockProductTarget.stock} units</strong></p>
              <p className="text-slate-500">Selling Price: <strong className="text-slate-900">{currency}{restockProductTarget.sellingPrice}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity to Add (+Units)
              </label>
              <input
                type="number"
                required
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {[10, 25, 50, 100].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setRestockQty(qty)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg"
                >
                  +{qty}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRestockProductTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
              >
                Add Stock Now
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteCandidate(null)}
          title="Confirm Delete Product"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">"{deleteCandidate.name}"</strong> from inventory?
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Delete Product
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
