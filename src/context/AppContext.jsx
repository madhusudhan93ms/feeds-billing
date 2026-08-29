import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AppContext = createContext(null);

// Real-Time Cross-Tab Broadcast Channel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('agrofeeds_pos_realtime_sync')
  : null;

export const AppProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [toasts, setToasts] = useState([]);
  
  const [products, setProducts] = useState(() => storageService.getProducts());
  const [sales, setSales] = useState(() => storageService.getSales());
  const [metrics, setMetrics] = useState(() => storageService.getSummaryMetrics());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [settings, setSettings] = useState(() => storageService.getSettings());

  // Master sync trigger that refreshes state from localStorage
  const syncStateFromStorage = useCallback(() => {
    setProducts(storageService.getProducts());
    setSales(storageService.getSales());
    setMetrics(storageService.getSummaryMetrics());
    setNotifications(storageService.getNotifications());
    setSettings(storageService.getSettings());
  }, []);

  // Broadcast change to all open tabs and locally
  const broadcastChange = useCallback(() => {
    syncStateFromStorage();
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
      } catch (err) {}
    }
  }, [syncStateFromStorage]);

  // Listen for Cross-Tab Broadcasts, Storage Events & Window Focus
  useEffect(() => {
    const handleBroadcastMessage = () => {
      syncStateFromStorage();
    };

    const handleStorageEvent = (e) => {
      if (e.key && e.key.startsWith('retail_pos_')) {
        syncStateFromStorage();
      }
    };

    const handleWindowFocus = () => {
      syncStateFromStorage();
    };

    if (syncChannel) {
      syncChannel.addEventListener('message', handleBroadcastMessage);
    }

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleWindowFocus);

    const intervalId = setInterval(() => {
      syncStateFromStorage();
    }, 1000);

    return () => {
      if (syncChannel) {
        syncChannel.removeEventListener('message', handleBroadcastMessage);
      }
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleWindowFocus);
      clearInterval(intervalId);
    };
  }, [syncStateFromStorage]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Admin Product Actions
  const addProduct = useCallback((productData) => {
    try {
      const created = storageService.addProduct(productData);
      broadcastChange();
      showToast(`Added product "${created.name}" (${created.stock} units in stock)`, 'success');
      return created;
    } catch (err) {
      showToast('Error adding product', 'error');
    }
  }, [broadcastChange, showToast]);

  const updateProduct = useCallback((productId, updatedData) => {
    try {
      const updated = storageService.updateProduct(productId, updatedData);
      broadcastChange();
      showToast(`Updated "${updated.name}" successfully!`, 'success');
      return updated;
    } catch (err) {
      showToast('Error updating product', 'error');
    }
  }, [broadcastChange, showToast]);

  const restockProduct = useCallback((productId, qty) => {
    try {
      const updated = storageService.restockProduct(productId, qty);
      broadcastChange();
      showToast(`Added +${qty} units to "${updated.name}" (Total Stock: ${updated.stock})`, 'success');
      return updated;
    } catch (err) {
      showToast('Error restocking item', 'error');
    }
  }, [broadcastChange, showToast]);

  const deleteProduct = useCallback((id) => {
    try {
      storageService.deleteProduct(id);
      broadcastChange();
      showToast('Item deleted from inventory', 'info');
      return true;
    } catch (err) {
      showToast('Error deleting item', 'error');
    }
  }, [broadcastChange, showToast]);

  // POS Billing Action
  const createBill = useCallback((saleData) => {
    try {
      const result = storageService.recordSale(saleData);
      broadcastChange();
      showToast(`Bill #${result.sale.invoiceNumber} created! Total: ₹${result.sale.grandTotal}`, 'success');
      return result.sale;
    } catch (err) {
      showToast('Error creating bill', 'error');
    }
  }, [broadcastChange, showToast]);

  const markNotificationsAsRead = useCallback(() => {
    storageService.markAllNotificationsAsRead();
    broadcastChange();
  }, [broadcastChange]);

  const clearNotifications = useCallback(() => {
    storageService.clearNotifications();
    broadcastChange();
  }, [broadcastChange]);

  const clearAll = useCallback(() => {
    storageService.clearAllData();
    broadcastChange();
    showToast('All items, sales, and alerts cleared', 'info');
  }, [broadcastChange, showToast]);

  const isLowStock = useCallback((product) => {
    return storageService.isLowStock(product);
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        metrics,
        notifications,
        settings,
        toasts,
        showToast,
        removeToast,
        addProduct,
        updateProduct,
        restockProduct,
        deleteProduct,
        createBill,
        markNotificationsAsRead,
        clearNotifications,
        clearAll,
        isLowStock
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
