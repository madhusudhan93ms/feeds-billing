import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Tag,
  AlertCircle,
  CheckCircle2,
  Boxes,
  PlusCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const ProductsPage = ({ onNavigate }) => {
  const { refreshKey, triggerRefresh, showToast, categories, addCategory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Feeds',
    brand: '',
    variety: '',
    unit: 'Bag (50KG)',
    purchasePrice: '',
    sellingPrice: '',
    minStock: 20,
    status: 'Active',
    description: ''
  });

  const products = useMemo(() => {
    return storageService.getProducts();
  }, [refreshKey]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.variety?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const count = products.length + 1;
    setFormData({
      name: '',
      sku: `PROD-${String(count).padStart(3, '0')}`,
      category: categories[0] || 'Feeds',
      brand: '',
      variety: '',
      unit: 'Bag (50KG)',
      purchasePrice: '',
      sellingPrice: '',
      minStock: 20,
      status: 'Active',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand || '',
      variety: product.variety || '',
      unit: product.unit || 'Unit',
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      minStock: product.minStock,
      status: product.status || 'Active',
      description: product.description || ''
    });
    setShowAddModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) throw new Error('Product name is required');
      if (!formData.sku.trim()) throw new Error('Product SKU is required');
      if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
        throw new Error('Please enter a valid selling price');
      }

      if (editingProduct) {
        storageService.updateProduct(editingProduct.id, formData);
        showToast(`Product "${formData.name}" updated`, 'success');
      } else {
        storageService.addProduct(formData);
        showToast(`Product "${formData.name}" added to master catalog`, 'success');
      }

      triggerRefresh();
      setShowAddModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        storageService.deleteProduct(product.id);
        triggerRefresh();
        showToast(`Product ${product.name} deleted`, 'info');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      addCategory(newCatName.trim());
      setNewCatName('');
      setShowNewCategoryModal(false);
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
            <Package className="h-6 w-6 text-blue-600" />
            <span>Product Master Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Global catalog common across all branches ({products.length} registered product varieties).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewCategoryModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Tag className="h-4 w-4 text-slate-400" />
            <span>+ Add Category</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
        
        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product, SKU, variety..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* Products DataTable */}
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Product Details',
            sortable: true,
            render: (_, row) => (
              <div>
                <div className="font-bold text-slate-900">{row.name}</div>
                <div className="text-xs text-slate-400">
                  Brand: <span className="text-slate-600 font-medium">{row.brand || 'Standard'}</span> • Variety: {row.variety || 'Standard'}
                </div>
              </div>
            )
          },
          {
            key: 'sku',
            header: 'SKU / Code',
            sortable: true,
            render: (val) => <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{val}</span>
          },
          {
            key: 'category',
            header: 'Category',
            sortable: true,
            render: (val) => (
              <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                {val}
              </span>
            )
          },
          {
            key: 'unit',
            header: 'Unit',
            render: (val) => <span className="text-xs text-slate-600">{val}</span>
          },
          {
            key: 'purchasePrice',
            header: 'Purchase Rate',
            sortable: true,
            render: (val) => `₹${Number(val).toLocaleString()}`
          },
          {
            key: 'sellingPrice',
            header: 'Selling Price',
            sortable: true,
            render: (val) => <strong className="font-black text-slate-900 text-sm">₹{Number(val).toLocaleString()}</strong>
          },
          {
            key: 'minStock',
            header: 'Min Threshold',
            render: (val, row) => <span className="text-xs text-slate-500">{val} {row.unit}</span>
          },
          {
            key: 'status',
            header: 'Status',
            render: (val) => (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                val === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {val}
              </span>
            )
          },
          {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (_, row) => (
              <div className="flex items-center justify-end space-x-1.5">
                <button
                  onClick={() => handleOpenEdit(row)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(row)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          }
        ]}
        data={filteredProducts}
        pageSize={10}
        emptyMessage="No products found"
        emptySubMessage="Try adjusting your category filter or click 'Add New Product'."
      />

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add Product to Master Catalog'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dairy Cattle Feed 50KG"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Product Code / SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  placeholder="e.g. FED-001"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. MilkoMax Feeds"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Variety / Grade
                </label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="e.g. 22% Protein Pellet"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Unit Measurement *
                </label>
                <input
                  type="text"
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g. Bag (50KG)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Purchase Rate (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="1350"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  placeholder="1650"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Min Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  placeholder="20"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Description & Notes
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nutritional composition, storage recommendations..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
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
                {editingProduct ? 'Save Changes' : 'Save to Product Master'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* NEW CATEGORY MODAL */}
      {showNewCategoryModal && (
        <Modal
          isOpen={showNewCategoryModal}
          onClose={() => setShowNewCategoryModal(false)}
          title="Create New Product Category"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Mineral Mixtures, Supplements"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowNewCategoryModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Add Category
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
