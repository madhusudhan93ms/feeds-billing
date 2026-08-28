import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  Boxes,
  TrendingUp,
  ArrowLeftRight,
  Package,
  Building2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';

export const ReportsPage = () => {
  const { refreshKey, showToast, categories } = useApp();
  const [reportType, setReportType] = useState('sales'); // 'sales' | 'stock' | 'transfers' | 'products'

  // Filters
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'today' | 'week' | 'month' | 'all'

  const branches = useMemo(() => storageService.getBranches(), [refreshKey]);
  const products = useMemo(() => storageService.getProducts(), [refreshKey]);
  const sales = useMemo(() => storageService.getSales(), [refreshKey]);
  const transfers = useMemo(() => storageService.getStockTransfers(), [refreshKey]);
  const centralInv = useMemo(() => storageService.getCentralInventory(), [refreshKey]);
  const branchInv = useMemo(() => storageService.getAllBranchInventories(), [refreshKey]);

  // 1. SALES REPORT DATA
  const salesReportData = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let filtered = [...sales];

    if (selectedBranch !== 'All') {
      filtered = filtered.filter(s => s.branchId === selectedBranch);
    }
    if (selectedPeriod === 'today') {
      filtered = filtered.filter(s => s.date === todayStr);
    } else if (selectedPeriod === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      const weekStr = d.toISOString().split('T')[0];
      filtered = filtered.filter(s => s.date >= weekStr);
    }

    const rows = [];
    for (const sale of filtered) {
      for (const it of sale.items) {
        if (selectedCategory !== 'All' && it.category !== selectedCategory) continue;
        rows.push({
          id: `${sale.id}-${it.productId}`,
          invoiceNumber: sale.invoiceNumber,
          date: sale.date,
          branchName: sale.branchName,
          customerName: sale.customerName,
          productName: it.name,
          sku: it.sku,
          category: it.category,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: it.unitPrice,
          total: it.total,
          paymentMethod: sale.paymentMethod
        });
      }
    }
    return rows;
  }, [sales, selectedBranch, selectedCategory, selectedPeriod]);

  // 2. STOCK REPORT DATA
  const stockReportData = useMemo(() => {
    return products.map(prod => {
      const cStock = centralInv.find(c => c.id === prod.id)?.quantity || 0;
      const bItems = branchInv.filter(b => b.productId === prod.id);
      const totalBranchStock = bItems.reduce((s, i) => s + i.quantity, 0);
      const totalStock = cStock + totalBranchStock;

      let status = 'Normal';
      if (totalStock === 0) status = 'Out of Stock';
      else if (totalStock <= prod.minStock) status = 'Low Stock';

      // Branch breakdown string
      const breakdown = bItems.map(b => `${b.branchName.split(' ')[0]}: ${b.quantity}`).join(' | ');

      return {
        id: prod.id,
        name: prod.name,
        sku: prod.sku,
        category: prod.category,
        unit: prod.unit,
        centralStock: cStock,
        branchStock: totalBranchStock,
        totalStock,
        breakdown: breakdown || 'No branch stock',
        purchaseValue: totalStock * prod.purchasePrice,
        salesValue: totalStock * prod.sellingPrice,
        stockStatus: status,
        minStock: prod.minStock
      };
    }).filter(p => selectedCategory === 'All' || p.category === selectedCategory);
  }, [products, centralInv, branchInv, selectedCategory]);

  // 3. TRANSFER REPORT DATA
  const transferReportData = useMemo(() => {
    return transfers.filter(t => {
      const matchBranch = selectedBranch === 'All' || t.toBranchId === selectedBranch;
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchBranch && matchCat;
    });
  }, [transfers, selectedBranch, selectedCategory]);

  // 4. PRODUCT PERFORMANCE REPORT DATA
  const productPerformanceData = useMemo(() => {
    const analysis = storageService.getProductSalesAnalysis(
      selectedBranch === 'All' ? null : selectedBranch,
      selectedPeriod
    );
    return analysis.topSellingProducts.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
  }, [selectedBranch, selectedPeriod, selectedCategory, refreshKey]);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (reportType === 'sales') {
      headers = ['Invoice No', 'Date', 'Branch', 'Customer', 'Product', 'SKU', 'Category', 'Quantity', 'Unit', 'Rate', 'Total', 'Payment'];
      rows = salesReportData.map(r => [
        r.invoiceNumber, r.date, r.branchName, r.customerName, r.productName, r.sku, r.category, r.quantity, r.unit, r.unitPrice, r.total, r.paymentMethod
      ]);
    } else if (reportType === 'stock') {
      headers = ['Product', 'SKU', 'Category', 'Unit', 'Central Stock', 'Total Branch Stock', 'Total Combined Stock', 'Status', 'Cost Value', 'Sales Value'];
      rows = stockReportData.map(r => [
        r.name, r.sku, r.category, r.unit, r.centralStock, r.branchStock, r.totalStock, r.stockStatus, r.purchaseValue, r.salesValue
      ]);
    } else if (reportType === 'transfers') {
      headers = ['Transfer No', 'Date', 'Product', 'SKU', 'Category', 'Quantity', 'From', 'To Branch', 'Status', 'User'];
      rows = transferReportData.map(r => [
        r.transferNumber, r.date, r.productName, r.productSku, r.category, r.quantity, r.fromLocation, r.toBranchName, r.status, r.transferredBy
      ]);
    } else {
      headers = ['Product', 'SKU', 'Category', 'Units Sold', 'Total Revenue (INR)', 'Bills Count'];
      rows = productPerformanceData.map(r => [
        r.name, r.sku, r.category, r.unitsSold, r.revenue, r.billsCount
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>Business Reports & Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate and export consolidated sales, stock valuation, transfer logs, and product performance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'sales', label: 'Sales & Invoices Report', icon: TrendingUp },
          { id: 'stock', label: 'Consolidated Stock Report', icon: Boxes },
          { id: 'transfers', label: 'Stock Transfers Report', icon: ArrowLeftRight },
          { id: 'products', label: 'Product Performance Report', icon: Package }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Branch selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value="All">All Branches (Consolidated)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Category selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Time range */}
          {reportType !== 'stock' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
              </select>
            </div>
          )}

        </div>

        <div className="text-xs text-slate-400 font-medium">
          Generated for: <strong className="text-slate-700">{selectedBranch === 'All' ? 'All Locations' : branches.find(b => b.id === selectedBranch)?.name}</strong>
        </div>
      </div>

      {/* 1. SALES REPORT TABLE */}
      {reportType === 'sales' && (
        <DataTable
          columns={[
            {
              key: 'invoiceNumber',
              header: 'Invoice #',
              render: (val, row) => (
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700">{val}</span>
                  <div className="text-[10px] text-slate-400">{row.date}</div>
                </div>
              )
            },
            { key: 'branchName', header: 'Branch' },
            { key: 'customerName', header: 'Customer' },
            {
              key: 'productName',
              header: 'Product Sold',
              render: (val, row) => (
                <div>
                  <div className="font-bold text-slate-900">{val}</div>
                  <div className="text-xs text-slate-400">{row.category} • SKU: {row.sku}</div>
                </div>
              )
            },
            {
              key: 'quantity',
              header: 'Qty',
              render: (val, row) => `${val} ${row.unit}`
            },
            {
              key: 'unitPrice',
              header: 'Rate',
              render: (val) => `₹${Number(val).toLocaleString()}`
            },
            {
              key: 'total',
              header: 'Line Total',
              render: (val) => <strong className="font-black text-emerald-800">₹{Number(val).toLocaleString()}</strong>
            },
            {
              key: 'paymentMethod',
              header: 'Payment',
              render: (val) => <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{val}</span>
            }
          ]}
          data={salesReportData}
          pageSize={10}
          emptyMessage="No sales match selected filters"
        />
      )}

      {/* 2. CONSOLIDATED STOCK REPORT TABLE */}
      {reportType === 'stock' && (
        <DataTable
          columns={[
            {
              key: 'name',
              header: 'Product',
              render: (_, row) => (
                <div>
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-xs text-slate-400">{row.category} • SKU: {row.sku}</div>
                </div>
              )
            },
            {
              key: 'centralStock',
              header: 'Central Stock',
              render: (val, row) => (
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {val} {row.unit}
                </span>
              )
            },
            {
              key: 'branchStock',
              header: 'Branch Stock Total',
              render: (val, row) => (
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {val} {row.unit}
                </span>
              )
            },
            {
              key: 'totalStock',
              header: 'Total Stock',
              render: (val, row) => (
                <span className="font-black text-slate-900 text-sm">
                  {val} {row.unit}
                </span>
              )
            },
            {
              key: 'breakdown',
              header: 'Branch Distribution',
              render: (val) => <span className="text-xs text-slate-500">{val}</span>
            },
            {
              key: 'purchaseValue',
              header: 'Cost Valuation',
              render: (val) => `₹${val.toLocaleString()}`
            },
            {
              key: 'stockStatus',
              header: 'Status',
              render: (val, row) => (
                <StockStatusBadge status={val} quantity={row.totalStock} minStock={row.minStock} />
              )
            }
          ]}
          data={stockReportData}
          pageSize={10}
          emptyMessage="No products found"
        />
      )}

      {/* 3. TRANSFER REPORT TABLE */}
      {reportType === 'transfers' && (
        <DataTable
          columns={[
            {
              key: 'transferNumber',
              header: 'Transfer #',
              render: (val, row) => (
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800">{val}</span>
                  <div className="text-[10px] text-slate-400">{row.date}</div>
                </div>
              )
            },
            { key: 'fromLocation', header: 'Origin' },
            { key: 'toBranchName', header: 'Destination Branch' },
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
              render: (val, row) => <strong className="text-slate-900">{val} {row.unit}</strong>
            },
            {
              key: 'transferredBy',
              header: 'Authorized By',
              render: (val) => <span className="text-xs text-slate-500">{val}</span>
            }
          ]}
          data={transferReportData}
          pageSize={10}
          emptyMessage="No transfers found"
        />
      )}

      {/* 4. PRODUCT PERFORMANCE TABLE */}
      {reportType === 'products' && (
        <DataTable
          columns={[
            {
              key: 'name',
              header: 'Product Variety',
              render: (_, row) => (
                <div>
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-xs text-slate-400">{row.category} • SKU: {row.sku}</div>
                </div>
              )
            },
            {
              key: 'unitsSold',
              header: 'Units Sold',
              sortable: true,
              render: (val, row) => (
                <span className="text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {val} {row.unit}
                </span>
              )
            },
            {
              key: 'revenue',
              header: 'Revenue Generated',
              sortable: true,
              render: (val) => (
                <strong className="text-sm font-black text-emerald-800">
                  ₹{val.toLocaleString()}
                </strong>
              )
            },
            {
              key: 'billsCount',
              header: 'Orders / Bills Count',
              sortable: true,
              render: (val) => `${val} bills`
            }
          ]}
          data={productPerformanceData}
          pageSize={10}
          emptyMessage="No sales recorded for this criteria"
        />
      )}

    </div>
  );
};
