import React from 'react';
import { TopNav } from './TopNav';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout = ({ isAdminRoute, onNavigate, activeBranchId, children }) => {
  return (
    <div className="min-h-screen w-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <TopNav isAdminRoute={isAdminRoute} onNavigate={onNavigate} activeBranchId={activeBranchId} />

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
