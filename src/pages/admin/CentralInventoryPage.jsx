import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Upload,
  Trash2,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const CentralInventoryPage = ({ onNavigate }) => {
  const { refreshKey, triggerRefresh, showToast, categories } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Stock Modal State
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addQuantity, setAddQuantity] = useState('');
  const [purchaseRate, setPurchaseRate] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CSV Import Modal State
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const centralInventory = useMemo(() => {
    return storageService.getCentralInventory();
  }, [refreshKey]);

  const filteredInventory = useMemo(() => {
    return centralInventory.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [centralInventory, selectedCategory, searchQuery]);

  // Live calculations for Add Stock modal
  const prevStock = selectedProduct ? selectedProduct.quantity : 0;
  const qtyToAdd = Number(addQuantity) || 0;
  const newStock = prevStock + qtyToAdd;

  const handleAddStockSubmit = (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (!selectedProduct) throw new Error('Please select a product');
      if (!addQuantity || Number(addQuantity) <= 0) {
        throw new Error('Please enter a valid stock quantity');
      }

      storageService.addCentralStock({
        productId: selectedProduct.id,
        quantity: addQuantity,
        purchaseRate: purchaseRate || selectedProduct.purchasePrice,
        supplierName: supplierName || 'Direct Factory Supplier',
        notes,
        addedBy: currentUser?.name || 'Admin'
      });

      triggerRefresh();
      setShowAddStockModal(false);
      setSelectedProduct(null);
      setAddQuantity('');
      setPurchaseRate('');
      setSupplierName('');
      setNotes('');
      showToast(`Added +${addQuantity} units to ${selectedProduct.name}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleImportCSV = () => {
    try {
      const imported = storageService.importProductsCSV(csvText);
      triggerRefresh();
      setShowCsvModal(false);
      setCsvText('');
      showToast(`Successfully imported ${imported.length} products!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClearAllData = () => {
    storageService.clearAllData(true);
    triggerRefresh();
    setShowClearConfirm(false);
    showToast('All sample data cleared! Database is now empty and ready for your products.', 'info');
  };

  const downloadSampleCSV = () => {
    const sample = `Product Name,SKU,Category,Unit,Selling Price,Purchase Price,Min Stock,Initial Stock
Summon Special Gold,SUM-001,Summons,Bundle,600,450,15,100
Dairy Cattle Booster Feed,FED-101,Feeds,Bag (50KG),1250,1050,20,150
Maize Corn Silage,SIL-201,Silage,Bag (50KG),400,320,25,200`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Boxes className="h-6 w-6 text-blue-600" />
            <span>Central Warehouse Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage central wholesale stock, upload custom products, or clear sample data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* UPLOAD CUSTOM CSV */}
          <button
            onClick={() => setShowCsvModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 shadow-xs"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Products (CSV / Excel)</span>
          </button>

          {/* CLEAR SAMPLE DATA */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Sample Data</span>
          </button>

          {/* ADD STOCK */}
          <button
            onClick={() => {
              setSelectedProduct(centralInventory[0] || null);
              setShowAddStockModal(true);
            }}
            disabled={centralInventory.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Warehouse Stock</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories ({centralInventory.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Central Inventory Table */}
        <DataTable
          columns={[
            {
              key: 'name',
              header: 'Product Variety',
              render: (_, row) => (
                <div>
                  <div className="font-bold text-slate-900 text-sm">{row.name}</div>
                  <div className="text-xs text-slate-400 font-mono">SKU: {row.sku} • {row.category}</div>
                </div>
              )
            },
            {
              key: 'quantity',
              header: 'Central Stock Available',
              render: (val, row) => (
                <div>
                  <span className="text-base font-black text-slate-900">
                    {val} {row.unit}
                  </span>
                  <div className="mt-0.5">
                    <StockStatusBadge status={row.stockStatus} quantity={val} minStock={row.minStock} size="xs" />
                  </div>
                </div>
              )
            },
            {
              key: 'sellingPrice',
              header: 'Retail Rate',
              render: (val) => <strong className="text-slate-900">₹{val.toLocaleString()}</strong>
            },
            {
              key: 'actions',
              header: 'Add Stock',
              className: 'text-right',
              render: (_, row) => (
                <button
                  onClick={() => {
                    setSelectedProduct(row);
                    setShowAddStockModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                >
                  + Add Stock
                </button>
              )
            }
          ]}
          data={filteredInventory}
          pageSize={10}
          emptyMessage="No products in Central Warehouse. Click 'Upload Products (CSV)' above to add your products!"
        />
      </div>

      {/* CSV UPLOAD MODAL */}
      {showCsvModal && (
        <Modal
          isOpen={showCsvModal}
          onClose={() => setShowCsvModal(false)}
          title="Upload Custom Products (CSV / Excel)"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Upload your product list with categories and prices. You can upload a file or paste CSV text directly below.
            </p>

            {/* Template Download */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800">Download CSV Format Template:</span>
              </div>
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Sample</span>
              </button>
            </div>

            {/* File Picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Choose CSV File (.csv):
              </label>
              <input
                type="file"
                accept=".csv, .txt"
                onChange={handleFileUpload}
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            {/* Direct Paste Area */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Or Paste CSV Data Below:
              </label>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Product Name, SKU, Category, Unit, Selling Price, Purchase Price, Min Stock, Initial Stock&#10;My Feed Premium, FED-01, Feeds, Bag (50KG), 1200, 1000, 10, 50"
                className="w-full rounded-2xl border border-slate-200 p-3 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCSV}
                disabled={!csvText.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-40"
              >
                Import Products Now
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM CLEAR SAMPLE DATA */}
      {showClearConfirm && (
        <ConfirmDialog
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearAllData}
          title="Clear All Sample Data?"
          message="This will remove all demo products, stock records, and demo sales so you can upload and test your own real products from scratch. Shop users & logins will be preserved."
          confirmText="Yes, Clear All Data"
          type="danger"
        />
      )}

      {/* ADD STOCK MODAL WITH LIVE CALCULATION */}
      {showAddStockModal && selectedProduct && (
        <Modal
          isOpen={showAddStockModal}
          onClose={() => setShowAddStockModal(false)}
          title={`Add Stock: ${selectedProduct.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddStockSubmit} className="space-y-4 text-xs">
            
            {/* Live calculation box */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>Previous Stock:</span>
                <strong className="text-slate-900">{prevStock} {selectedProduct.unit}</strong>
              </div>
              <div className="flex justify-between items-center text-blue-700">
                <span>Quantity to Add:</span>
                <strong className="text-blue-900 font-bold">+{qtyToAdd} {selectedProduct.unit}</strong>
              </div>
              <div className="flex justify-between items-center border-t border-blue-200/60 pt-2 text-sm">
                <span className="font-bold text-slate-900">New Central Stock:</span>
                <span className="font-black text-blue-700 text-base">{newStock} {selectedProduct.unit}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity to Add ({selectedProduct.unit}) *</label>
              <input
                type="number"
                min="1"
                required
                value={addQuantity}
                onChange={(e) => setAddQuantity(e.target.value)}
                placeholder="e.g. 50"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Purchase Rate (₹)</label>
                <input
                  type="number"
                  value={purchaseRate}
                  onChange={(e) => setPurchaseRate(e.target.value)}
                  placeholder={`Default: ₹${selectedProduct.purchasePrice}`}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Direct Factory"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={qtyToAdd <= 0 || isSubmitting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-40"
              >
                Confirm & Add Stock
              </button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
};
