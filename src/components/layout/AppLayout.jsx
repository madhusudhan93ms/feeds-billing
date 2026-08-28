import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { ShopSidebar } from './ShopSidebar';
import { TopNav } from './TopNav';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout = ({ activeTab, onSelectTab, children }) => {
  const { isAdmin } = useAuth();
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Tab Title helper
  const tabTitles = {
    dashboard: 'Overview Dashboard',
    branches: 'Branch Locations & Shops',
    products: 'Product Catalog Master',
    'central-inventory': 'Central Warehouse Inventory',
    'stock-transfers': 'Stock Transfer Manager',
    sales: 'Sales Transactions',
    billing: 'Billing & Point of Sale (POS)',
    pos: 'Point of Sale (POS) Counter',
    inventory: 'Branch Inventory Stock',
    invoices: 'Invoice Records & History',
    purchases: 'Wholesale Stock Purchases',
    customers: 'Customer Directory',
    suppliers: 'Supplier & Vendor Directory',
    transfers: 'Incoming Stock Transfers',
    reports: 'Business Analytics & Reports',
    users: 'System Users & Staff',
    'activity-log': 'System Activity Audit Log',
    settings: 'System & Business Settings'
  };

  const currentTabTitle = tabTitles[activeTab] || 'Management Portal';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0 h-full">
        {isAdmin ? (
          <AdminSidebar activeTab={activeTab} onSelectTab={onSelectTab} />
        ) : (
          <ShopSidebar activeTab={activeTab} onSelectTab={onSelectTab} />
        )}
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      {sidebarOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpenMobile(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-slate-900 shadow-2xl z-10 animate-in slide-in-from-left">
            {isAdmin ? (
              <AdminSidebar
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                onCloseMobile={() => setSidebarOpenMobile(false)}
              />
            ) : (
              <ShopSidebar
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                onCloseMobile={() => setSidebarOpenMobile(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <TopNav
          onToggleSidebar={() => setSidebarOpenMobile(true)}
          activeTabTitle={currentTabTitle}
        />

        {/* Dynamic Page Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
};
