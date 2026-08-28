import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const StockStatusBadge = ({ status, quantity, minStock, showIcon = true, size = 'sm' }) => {
  let resolvedStatus = status;

  if (!resolvedStatus && typeof quantity === 'number') {
    if (quantity === 0) {
      resolvedStatus = 'Out of Stock';
    } else if (minStock !== undefined && quantity <= minStock) {
      resolvedStatus = 'Low Stock';
    } else {
      resolvedStatus = 'Normal';
    }
  }

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const currentSize = sizeClasses[size] || sizeClasses.sm;

  if (resolvedStatus === 'Out of Stock') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 ${currentSize}`}>
        {showIcon && <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />}
        <span>Out of Stock</span>
      </span>
    );
  }

  if (resolvedStatus === 'Low Stock') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 ${currentSize}`}>
        {showIcon && <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 animate-pulse" />}
        <span>Low Stock</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${currentSize}`}>
      {showIcon && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
      <span>Normal</span>
    </span>
  );
};
