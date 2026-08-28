import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [categories, setCategories] = useState(() => storageService.getCategories());
  const [lowStockSummary, setLowStockSummary] = useState({ centralCount: 0, branchCount: 0 });

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setSettings(storageService.getSettings());
    setCategories(storageService.getCategories());
  }, []);

  // Recalculate low stock alerts on refresh
  useEffect(() => {
    const central = storageService.getCentralInventory();
    const centralLow = central.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;
    
    const branches = storageService.getAllBranchInventories();
    const branchLow = branches.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;

    setLowStockSummary({
      centralCount: centralLow,
      branchCount: branchLow,
      totalCount: centralLow + branchLow
    });
  }, [refreshKey]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateBusinessSettings = useCallback((newSettings) => {
    const updated = storageService.updateSettings(newSettings);
    setSettings(updated);
    triggerRefresh();
    showToast('Settings saved successfully', 'success');
  }, [triggerRefresh, showToast]);

  const addCategory = useCallback((categoryName) => {
    const updated = storageService.addCategory(categoryName);
    setCategories(updated);
    triggerRefresh();
    showToast(`Category "${categoryName}" added`, 'success');
  }, [triggerRefresh, showToast]);

  return (
    <AppContext.Provider
      value={{
        refreshKey,
        triggerRefresh,
        toasts,
        showToast,
        removeToast,
        settings,
        updateBusinessSettings,
        categories,
        addCategory,
        lowStockSummary
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
