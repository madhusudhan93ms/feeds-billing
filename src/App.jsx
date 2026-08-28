import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Auth
import { LoginPage } from './pages/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CentralInventoryPage } from './pages/admin/CentralInventoryPage';
import { StockTransfersPage } from './pages/admin/StockTransfersPage';
import { BranchesPage } from './pages/admin/BranchesPage';
import { AdminSalesPage } from './pages/admin/AdminSalesPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Shop Pages
import { ShopPOSPage } from './pages/shop/ShopPOSPage';
import { ShopInventoryPage } from './pages/shop/ShopInventoryPage';
import { ShopSalesPage } from './pages/shop/ShopSalesPage';

const MainApp = () => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? 'dashboard' : 'pos');

  // When switching users/roles, reset active tab to appropriate default
  useEffect(() => {
    if (isAdmin) {
      if (!['dashboard', 'central-inventory', 'stock-transfers', 'branches', 'sales', 'settings'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else {
      if (!['pos', 'inventory', 'sales'].includes(activeTab)) {
        setActiveTab('pos');
      }
    }
  }, [currentUser, isAdmin]);

  if (!currentUser) {
    return <LoginPage />;
  }

  // Admin View Router
  const renderAdminContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveTab} />;
      case 'central-inventory':
        return <CentralInventoryPage onNavigate={setActiveTab} />;
      case 'stock-transfers':
        return <StockTransfersPage onNavigate={setActiveTab} />;
      case 'branches':
        return <BranchesPage onNavigate={setActiveTab} />;
      case 'sales':
        return <AdminSalesPage onNavigate={setActiveTab} />;
      case 'settings':
        return <SettingsPage onNavigate={setActiveTab} />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  // Shop User View Router
  const renderShopContent = () => {
    switch (activeTab) {
      case 'pos':
        return <ShopPOSPage onNavigate={setActiveTab} />;
      case 'inventory':
        return <ShopInventoryPage onNavigate={setActiveTab} />;
      case 'sales':
        return <ShopSalesPage onNavigate={setActiveTab} />;
      default:
        return <ShopPOSPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {isAdmin ? renderAdminContent() : renderShopContent()}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}
