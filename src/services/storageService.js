// Professional Single-Store Inventory & POS Billing Engine
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_SETTINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'retail_pos_products',
  SALES: 'retail_pos_sales',
  SETTINGS: 'retail_pos_settings',
  NOTIFICATIONS: 'retail_pos_notifications'
};

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.resetData();
    }
  }

  resetData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }

  clearAllData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }

  // ----------------------------------------------------
  // 1. Inventory & Products
  // ----------------------------------------------------
  getProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  addProduct(productData) {
    const products = this.getProducts();
    const startingStock = Number(productData.stock) || 0;

    const newProduct = {
      id: 'prod-' + Date.now().toString(36),
      sku: productData.sku ? productData.sku.trim().toUpperCase() : `SKU-${100 + products.length + 1}`,
      name: productData.name.trim(),
      category: productData.category ? productData.category.trim() : 'Cattle Feeds',
      unit: productData.unit || 'Bags',
      price: Number(productData.price) || 0,
      stock: startingStock,
      initialStock: startingStock > 0 ? startingStock : 50,
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(productId, updatedData) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    const newStock = Number(updatedData.stock) >= 0 ? Number(updatedData.stock) : products[index].stock;
    const newPrice = Number(updatedData.price) >= 0 ? Number(updatedData.price) : products[index].price;

    products[index] = {
      ...products[index],
      name: (updatedData.name || products[index].name).trim(),
      sku: updatedData.sku ? updatedData.sku.trim().toUpperCase() : products[index].sku,
      category: updatedData.category || products[index].category,
      unit: updatedData.unit || products[index].unit,
      price: newPrice,
      stock: newStock,
      initialStock: Math.max(products[index].initialStock || 0, newStock),
      updatedAt: new Date().toISOString()
    };

    this.saveProducts(products);

    this.addNotification({
      type: 'edit',
      title: `✏️ Product Updated: ${products[index].name}`,
      message: `Price: ₹${products[index].price.toLocaleString()} | Stock: ${products[index].stock} units`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });

    return products[index];
  }

  restockProduct(productId, quantityToAdd) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    const qty = Number(quantityToAdd) || 0;
    const newStock = Math.max(0, (products[index].stock || 0) + qty);
    products[index].stock = newStock;

    if (newStock > (products[index].initialStock || 0)) {
      products[index].initialStock = newStock;
    }

    this.saveProducts(products);

    this.addNotification({
      type: 'restock',
      title: `📦 Stock Added: +${qty} units`,
      message: `Restocked "${products[index].name}". Total store stock is now ${newStock} units.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });

    return products[index];
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    this.saveProducts(filtered);
    return true;
  }

  // <20% Low Stock Checker
  isLowStock(product) {
    if (!product) return false;
    const stock = Number(product.stock) || 0;
    if (stock === 0) return true;

    const initial = Number(product.initialStock) || (stock > 0 ? stock : 10);
    const percent = (stock / Math.max(initial, 1)) * 100;
    return percent <= 20 || stock <= 5;
  }

  // ----------------------------------------------------
  // 2. Sales & Invoices
  // ----------------------------------------------------
  getSales() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveSales(sales) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  recordSale(saleData) {
    const products = this.getProducts();
    const sales = this.getSales();
    const lowStockAlerts = [];

    // 1. Deduct Stock
    const updatedProducts = products.map((product) => {
      const itemInSale = saleData.items.find((i) => i.productId === product.id);
      if (itemInSale) {
        const currentStock = Number(product.stock) || 0;
        const newStock = Math.max(0, currentStock - Number(itemInSale.quantity));
        const updatedProd = {
          ...product,
          stock: newStock
        };

        if (this.isLowStock(updatedProd)) {
          lowStockAlerts.push({
            productName: product.name,
            remainingStock: newStock
          });
        }

        return updatedProd;
      }
      return product;
    });

    this.saveProducts(updatedProducts);

    // 2. Generate Invoice
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const invoiceNumber = 'INV-' + (1000 + sales.length + 1);

    const newSale = {
      id: invoiceNumber,
      invoiceNumber,
      date: dateStr,
      time: timeStr,
      timestamp: now.toISOString(),
      cashierName: saleData.cashierName || 'Billing Staff',
      customerName: (saleData.customerName || 'Walk-in Customer').trim(),
      customerPhone: (saleData.customerPhone || '').trim(),
      paymentMethod: saleData.paymentMethod || 'Cash',
      notes: (saleData.notes || '').trim(),
      items: saleData.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPrice: Number(item.unitPrice || item.price),
        quantity: Number(item.quantity),
        total: Number(item.unitPrice || item.price) * Number(item.quantity)
      })),
      subtotal: Number(saleData.subtotal || saleData.grandTotal) || 0,
      discount: Number(saleData.discount) || 0,
      grandTotal: Number(saleData.grandTotal) || 0
    };

    sales.unshift(newSale);
    this.saveSales(sales);

    // 3. Trigger Real-Time Notification for Admin
    const totalItemsCount = saleData.items.reduce((s, i) => s + Number(i.quantity), 0);

    this.addNotification({
      type: 'sale',
      title: `💰 New Bill Created: ${invoiceNumber}`,
      message: `Billed ₹${newSale.grandTotal.toLocaleString()} (${totalItemsCount} items) to ${newSale.customerName} via ${newSale.paymentMethod}`,
      time: timeStr,
      timestamp: now.toISOString(),
      saleId: invoiceNumber
    });

    lowStockAlerts.forEach((alert) => {
      this.addNotification({
        type: 'low_stock',
        title: `⚠️ LOW STOCK ALERT (<20%)`,
        message: `"${alert.productName}" has only ${alert.remainingStock} units remaining! Please restock.`,
        time: timeStr,
        timestamp: now.toISOString()
      });
    });

    return {
      sale: newSale,
      updatedProducts
    };
  }

  // ----------------------------------------------------
  // 3. Notifications Feed
  // ----------------------------------------------------
  getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveNotifications(notifications) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  addNotification(notif) {
    const notifications = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      ...notif,
      read: false
    };

    notifications.unshift(newNotif);
    this.saveNotifications(notifications.slice(0, 50));
    return newNotif;
  }

  markAllNotificationsAsRead() {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    this.saveNotifications(updated);
    return updated;
  }

  clearNotifications() {
    this.saveNotifications([]);
  }

  // ----------------------------------------------------
  // 4. Metrics Summary
  // ----------------------------------------------------
  getSummaryMetrics() {
    const products = this.getProducts();
    const sales = this.getSales();
    const notifications = this.getNotifications();
    const todayStr = new Date().toISOString().split('T')[0];

    const todaySales = sales.filter((s) => s.date === todayStr);
    const totalSoldToday = todaySales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const totalBillsCount = todaySales.length;
    const totalItemsSoldToday = todaySales.reduce((sum, s) => {
      return sum + (s.items ? s.items.reduce((iSum, i) => iSum + (Number(i.quantity) || 0), 0) : 0);
    }, 0);

    const totalStoreInventory = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);

    const lowStockItemsCount = products.filter((p) => this.isLowStock(p)).length;
    const unreadNotifCount = notifications.filter((n) => !n.read).length;

    return {
      totalSoldToday,
      totalBillsCount,
      totalItemsSoldToday,
      totalStoreInventory,
      lowStockItemsCount,
      allProductsCount: products.length,
      unreadNotifCount,
      todaySalesList: todaySales,
      allSalesList: sales,
      recentNotifications: notifications.slice(0, 15)
    };
  }

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  }
}

export const storageService = new StorageService();
