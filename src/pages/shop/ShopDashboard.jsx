import React, { useMemo } from 'react';
import {
  TrendingUp,
  ReceiptText,
  Boxes,
  AlertTriangle,
  ShoppingCart,
  ArrowDownLeft,
  Store,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';

export const ShopDashboard = ({ onNavigate }) => {
  const { currentUser, assignedBranch } = useAuth();
  const { refreshKey } = useApp();

  const branchId = currentUser?.branchId;

  const metrics = useMemo(() => {
    if (!branchId) return null;
    return storageService.getDashboardMetrics(branchId);
  }, [branchId, refreshKey]);

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/20">
            <Store className="h-3.5 w-3.5" />
            <span>{assignedBranch?.name || currentUser?.branchName} • Branch Counter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Branch Code: <span className="font-mono font-bold text-emerald-400">{assignedBranch?.code}</span> • Managing retail sales and local inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pos')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Open POS / New Sale</span>
          </button>
        </div>
      </div>

      {/* Low Stock Restock Request Notice if low stock exists */}
      {metrics.lowStockCount > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{metrics.lowStockCount} product(s) in your branch are low or out of stock!</span>
              <p className="text-amber-700 text-[11px] mt-0.5">
                Central Admin automatically receives low-stock notifications to dispatch fresh stock.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="font-bold text-amber-900 underline hover:text-amber-800 shrink-0 text-xs"
          >
            View Low Stock Items
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Today's Branch Sales"
          value={`₹${metrics.todayRevenue.toLocaleString()}`}
          subtitle={`${metrics.todayBillsCount} bills today`}
          icon={TrendingUp}
          variant="emerald"
          onClick={() => onNavigate('sales')}
        />

        <StatCard
          title="Total Branch Invoices"
          value={metrics.totalBillsCount}
          subtitle={`Lifetime: ₹${metrics.totalRevenue.toLocaleString()}`}
          icon={ReceiptText}
          variant="blue"
          onClick={() => onNavigate('invoices')}
        />

        <StatCard
          title="Branch Stock in Hand"
          value={`${metrics.totalItemsInStock} units`}
          subtitle={`Valuation: ₹${metrics.totalInventoryValue.toLocaleString()}`}
          icon={Boxes}
          variant="indigo"
          onClick={() => onNavigate('inventory')}
        />

        <StatCard
          title="Stock Alerts"
          value={metrics.lowStockCount + metrics.outOfStockCount}
          subtitle={metrics.outOfStockCount > 0 ? `${metrics.outOfStockCount} Out of Stock` : 'Stock levels monitor'}
          icon={AlertTriangle}
          variant={metrics.lowStockCount + metrics.outOfStockCount > 0 ? 'amber' : 'emerald'}
          onClick={() => onNavigate('inventory')}
        />
      </div>

      {/* Recent Sales & Quick POS Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Sales List (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Branch Invoices</h3>
              <p className="text-xs text-slate-500">Latest sales completed at this counter</p>
            </div>

            <button
              onClick={() => onNavigate('sales')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All Sales</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {metrics.recentSales.length > 0 ? (
              metrics.recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {sale.invoiceNumber}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{sale.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {sale.date} at {sale.time} • {sale.items.length} items • {sale.paymentMethod}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">
                      ₹{sale.grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No sales recorded at this branch yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Branch Actions & Details (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Quick Branch Operations</h3>

            <button
              onClick={() => onNavigate('pos')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-bold"
            >
              <div className="flex items-center space-x-2.5">
                <ShoppingCart className="h-4 w-4 text-emerald-700" />
                <span>Open POS Terminal</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('inventory')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 transition-colors text-xs font-bold"
            >
              <div className="flex items-center space-x-2.5">
                <PackageCheck className="h-4 w-4 text-slate-600" />
                <span>Check Available Stock</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('transfers')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 transition-colors text-xs font-bold"
            >
              <div className="flex items-center space-x-2.5">
                <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                <span>Stock Received from Central</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Shop Location Address</span>
            <p className="font-semibold text-slate-800">{assignedBranch?.address}</p>
            <p className="text-slate-500 text-[11px]">Phone: {assignedBranch?.phone}</p>
          </div>

        </div>

      </div>

    </div>
  );
};
