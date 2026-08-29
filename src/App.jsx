import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Admin Inventory & Sales Management (at /admin)
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Staff POS Billing Counter (at /)
import { PointOfSale } from './components/billing/PointOfSale';

const RouterView = () => {
  const getIsAdmin = () => {
    const full = (window.location.pathname + window.location.hash).toLowerCase();
    return full.includes('/admin');
  };

  const [isAdmin, setIsAdmin] = useState(getIsAdmin());

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(getIsAdmin());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsAdmin(path.includes('/admin'));
  };

  return (
    <AppLayout isAdminRoute={isAdmin} onNavigate={navigateTo}>
      {isAdmin ? (
        <AdminDashboard onNavigate={navigateTo} />
      ) : (
        <PointOfSale onNavigate={navigateTo} />
      )}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterView />
      </AppProvider>
    </AuthProvider>
  );
}
