import React, { useState, useMemo } from 'react';
import {
  Building2,
  Package,
  Boxes,
  TrendingUp,
  ReceiptText,
  AlertTriangle,
  ArrowLeftRight,
  PlusCircle,
  ShoppingBag,
  ArrowUpRight,
  Calendar,
  Store,
  Layers,
  ChevronRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';

export const AdminDashboard = ({ onNavigate }) => {
  const { refreshKey, settings } = useApp();
  const { currentUser } = useAuth();
  const [salesPeriod, setSalesPeriod] = useState('all'); // 'today' | 'week' | 'month' | 'all'

  const metrics = useMemo(() => {
    return storageService.getDashboardMetrics();
  }, [refreshKey]);

  const salesAnalysis = useMemo(() => {
    return storageService.getProductSalesAnalysis(null, salesPeriod);
  }, [salesPeriod, refreshKey]);

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Central Management Hub & Multi-Shop System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentUser?.name || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Managing Central Warehouse and 5 retail shops across Hosur, Krishnagiri, Dharmapuri, and Salem.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('central-inventory')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Stock</span>
          </button>

          <button
            onClick={() => onNavigate('stock-transfers')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Transfer Stock</span>
          </button>

          <button
            onClick={() => onNavigate('billing')}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <ReceiptText className="h-4 w-4" />
            <span>Create Bill</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Branches / Shops"
          value={metrics.totalBranches}
          subtitle="1 Main HQ Shop + 4 Branches"
          icon={Building2}
          variant="blue"
          onClick={() => onNavigate('branches')}
        />

        <StatCard
          title="Product Master Catalog"
          value={metrics.totalProducts}
          subtitle="Summons, Feeds & Silage"
          icon={Package}
          variant="purple"
          onClick={() => onNavigate('products')}
        />

        <StatCard
          title="Central Inventory Stock"
          value={`${metrics.totalCentralStockUnits.toLocaleString()} units`}
          subtitle={`Valuation: ₹${metrics.totalCentralStockValue.toLocaleString()}`}
          icon={Boxes}
          variant="indigo"
          onClick={() => onNavigate('central-inventory')}
        />

        <StatCard
          title="Total Branch Stock"
          value={`${metrics.totalBranchStockUnits.toLocaleString()} units`}
          subtitle="Distributed across 5 shops"
          icon={Layers}
          variant="cyan"
          onClick={() => onNavigate('central-inventory')}
        />

        <StatCard
          title="Today's Sales Revenue"
          value={`₹${metrics.todaySalesRevenue.toLocaleString()}`}
          subtitle={`${metrics.todayBillsCount} bills generated today`}
          icon={TrendingUp}
          variant="emerald"
          onClick={() => onNavigate('sales')}
        />

        <StatCard
          title="Total System Sales"
          value={`₹${metrics.totalSalesRevenue.toLocaleString()}`}
          subtitle={`${metrics.totalBillsCount} lifetime invoices`}
          icon={ReceiptText}
          variant="emerald"
          onClick={() => onNavigate('sales')}
        />

        <StatCard
          title="Central Low Stock Items"
          value={metrics.centralLowStockCount}
          subtitle="Products below minimum threshold"
          icon={AlertTriangle}
          variant={metrics.centralLowStockCount > 0 ? 'amber' : 'emerald'}
          onClick={() => onNavigate('central-inventory')}
        />

        <StatCard
          title="Branch Stock Alerts"
          value={metrics.branchLowStockCount}
          subtitle="Branch items requiring transfer"
          icon={AlertTriangle}
          variant={metrics.branchLowStockCount > 0 ? 'rose' : 'emerald'}
          onClick={() => onNavigate('stock-transfers')}
        />
      </div>

      {/* BRANCH OVERVIEW TABLE (Requirement #16) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-600" />
              <span>Multi-Branch Performance Overview</span>
            </h3>
            <p className="text-xs text-slate-500">Live sales, invoices and stock levels across all 5 shops</p>
          </div>

          <button
            onClick={() => onNavigate('branches')}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Manage All Branches</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Shop / Branch</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3 text-right">Today Sales</th>
                <th className="px-4 py-3 text-center">Bills</th>
                <th className="px-4 py-3 text-center">Stock Units</th>
                <th className="px-4 py-3 text-center">Stock Alerts</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.branchOverview.map((branch) => (
                <tr key={branch.branchId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                        branch.isMainShop ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}>
                        {branch.code.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{branch.name}</span>
                          {branch.isMainShop && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-extrabold">
                              Shop 1 (Admin HQ)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">Code: {branch.code}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-800">{branch.manager}</div>
                    <div className="text-xs text-slate-400">{branch.phone}</div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                    ₹{branch.todaySalesRevenue.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                    {branch.todayBillsCount}
                  </td>

                  <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                    {branch.stockUnits.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    {branch.lowStockCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{branch.lowStockCount} Low</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Healthy
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onNavigate('stock-transfers')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                      <span>Transfer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT SALES ANALYSIS & TOP SELLERS (Requirement #17) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Products List (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Selling Products</h3>
              <p className="text-xs text-slate-500">Fastest moving items by units sold</p>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSalesPeriod(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    salesPeriod === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {salesAnalysis.topSellingProducts.length > 0 ? (
              salesAnalysis.topSellingProducts.slice(0, 5).map((prod, index) => (
                <div
                  key={prod.productId}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                      <p className="text-xs text-slate-400">
                        {prod.category} • SKU: {prod.sku}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-800">
                      {prod.unitsSold} {prod.unit}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      ₹{prod.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No product sales recorded in this time range.
              </div>
            )}
          </div>
        </div>

        {/* Category Share & Highlights (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Category Sales Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Revenue distribution across categories</p>

            <div className="space-y-3">
              {Object.entries(salesAnalysis.categorySalesMap).map(([cat, rev]) => {
                const percent = salesAnalysis.totalRevenue > 0
                  ? Math.round((rev / salesAnalysis.totalRevenue) * 100)
                  : 0;

                const colors = {
                  Summons: 'bg-emerald-500',
                  Feeds: 'bg-blue-500',
                  Silage: 'bg-amber-500'
                };

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{cat}</span>
                      <span>₹{rev.toLocaleString()} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[cat] || 'bg-indigo-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100 text-xs space-y-2">
            <p className="font-bold text-blue-900">Most Popular Category:</p>
            <p className="text-sm font-extrabold text-blue-700">
              {salesAnalysis.mostSoldCategory || 'Feeds'}
            </p>
            <p className="text-[11px] text-slate-500">
              Cattle feed products generate the highest consistent volume across Hosur and Salem branches.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
