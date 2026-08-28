import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Boxes,
  ReceiptText,
  Printer
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';

export const ShopReportsPage = () => {
  const { currentUser } = useAuth();
  const { refreshKey } = useApp();

  const branchId = currentUser?.branchId;

  const sales = useMemo(() => {
    if (!branchId) return [];
    return storageService.getSales({ branchId });
  }, [branchId, refreshKey]);

  const productAnalysis = useMemo(() => {
    if (!branchId) return { topSellingProducts: [], totalRevenue: 0, totalUnitsSold: 0 };
    return storageService.getProductSalesAnalysis(branchId, 'all');
  }, [branchId, refreshKey]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <span>Branch Sales Performance Report</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Summary of retail turnover, fast-moving products, and invoice volume at {currentUser?.branchName}.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Printer className="h-4 w-4 text-slate-400" />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-700">Total Branch Revenue</span>
          <h3 className="text-2xl font-black text-emerald-950">
            ₹{productAnalysis.totalRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-blue-700">Total Units Sold</span>
          <h3 className="text-2xl font-black text-blue-950">
            {productAnalysis.totalUnitsSold.toLocaleString()} units
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Customer Invoices</span>
          <h3 className="text-2xl font-black text-slate-900">
            {sales.length} bills
          </h3>
        </div>
      </div>

      {/* Top Selling Products in this Branch */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Top Performing Products at this Branch</h3>

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
              render: (val, row) => (
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {val} {row.unit}
                </span>
              )
            },
            {
              key: 'revenue',
              header: 'Revenue Generated',
              render: (val) => <strong className="text-sm font-black text-slate-900">₹{val.toLocaleString()}</strong>
            },
            {
              key: 'billsCount',
              header: 'Invoices Count',
              render: (val) => `${val} orders`
            }
          ]}
          data={productAnalysis.topSellingProducts}
          pageSize={8}
          emptyMessage="No product sales recorded yet"
        />
      </div>

    </div>
  );
};
