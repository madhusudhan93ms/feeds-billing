import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  AlertTriangle,
  Boxes,
  ShoppingCart,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';

export const ShopInventoryPage = ({ onNavigate }) => {
  const { currentUser, assignedBranch } = useAuth();
  const { refreshKey, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const branchId = currentUser?.branchId;

  const branchInventory = useMemo(() => {
    if (!branchId) return [];
    return storageService.getBranchInventory(branchId);
  }, [branchId, refreshKey]);

  const filteredItems = useMemo(() => {
    return branchInventory.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [branchInventory, selectedCategory, searchQuery]);

  const totalUnits = useMemo(() => {
    return branchInventory.reduce((sum, item) => sum + item.quantity, 0);
  }, [branchInventory]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <PackageCheck className="h-6 w-6 text-emerald-600" />
            <span>{assignedBranch?.name || currentUser?.branchName} Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time branch stock levels automatically updated via Central Admin transfers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-xs flex items-center space-x-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total In Hand</span>
              <strong className="text-base font-black text-slate-900">{totalUnits} units</strong>
            </div>
          </div>

          <button
            onClick={() => onNavigate('pos')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Open POS Counter</span>
          </button>
        </div>
      </div>

      {/* Notice regarding Automatic Branch Inventory */}
      <div className="rounded-2xl bg-slate-100/80 p-3.5 border border-slate-200 text-xs text-slate-600 flex items-center space-x-2.5">
        <Info className="h-4 w-4 text-blue-600 shrink-0" />
        <span>
          Branch inventory is automatically populated from Central Hub transfers. If you need stock replenishment, Central Admin will dispatch goods to your shop.
        </span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Products ({branchInventory.length})
          </button>

          {categories.map((cat) => {
            const count = branchInventory.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branch products, SKU..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* Branch Inventory Table */}
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
                  {row.category} • SKU: <span className="font-mono text-slate-700">{row.sku}</span> • {row.brand || 'Standard'}
                </div>
              </div>
            )
          },
          {
            key: 'quantity',
            header: 'Available Stock',
            sortable: true,
            render: (val, row) => (
              <div className="space-y-0.5">
                <span className="text-base font-black text-slate-900">
                  {val.toLocaleString()} {row.unit}
                </span>
                <div className="text-[11px] text-slate-400">Min Alert: {row.minStock} {row.unit}</div>
              </div>
            )
          },
          {
            key: 'sellingPrice',
            header: 'Selling Price (Rate)',
            sortable: true,
            render: (val) => <strong className="text-sm font-bold text-slate-800">₹{val.toLocaleString()}</strong>
          },
          {
            key: 'totalValue',
            header: 'Stock Valuation (Retail)',
            sortable: true,
            render: (val) => (
              <span className="font-bold text-slate-700 text-xs">
                ₹{val.toLocaleString()}
              </span>
            )
          },
          {
            key: 'stockStatus',
            header: 'Stock Status',
            sortable: true,
            render: (val, row) => (
              <StockStatusBadge status={val} quantity={row.quantity} minStock={row.minStock} />
            )
          },
          {
            key: 'actions',
            header: 'Action',
            className: 'text-right',
            render: (_, row) => (
              <button
                onClick={() => onNavigate('pos')}
                disabled={row.quantity <= 0}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Sell Item</span>
              </button>
            )
          }
        ]}
        data={filteredItems}
        pageSize={10}
        emptyMessage="No stock records in your branch"
        emptySubMessage="When Admin transfers products to your branch, they will automatically appear here."
      />

    </div>
  );
};
