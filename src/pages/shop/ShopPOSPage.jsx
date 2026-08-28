import React from 'react';
import { PointOfSale } from '../../components/billing/PointOfSale';
import { useAuth } from '../../context/AuthContext';

export const ShopPOSPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Point of Sale (POS) Counter Billing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fast retail billing for {currentUser?.branchName || 'Branch'}. Live stock deduction and instant bill generation.
        </p>
      </div>

      <PointOfSale initialBranchId={currentUser?.branchId} />
    </div>
  );
};
