import {
  INITIAL_CATEGORIES,
  INITIAL_BRANCHES,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_CENTRAL_INVENTORY,
  INITIAL_BRANCH_INVENTORY,
  INITIAL_TRANSFERS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_STOCK_TRANSACTIONS,
  INITIAL_ACTIVITIES,
  INITIAL_SETTINGS
} from '../data/initialData';

// LocalStorage Keys
const KEYS = {
  CATEGORIES: 'mb_categories_v1',
  BRANCHES: 'mb_branches_v1',
  USERS: 'mb_users_v1',
  PRODUCTS: 'mb_products_v1',
  CENTRAL_INVENTORY: 'mb_central_inv_v1',
  BRANCH_INVENTORY: 'mb_branch_inv_v1',
  STOCK_TRANSFERS: 'mb_transfers_v1',
  STOCK_TRANSACTIONS: 'mb_transactions_v1',
  SALES: 'mb_sales_v1',
  CUSTOMERS: 'mb_customers_v1',
  SUPPLIERS: 'mb_suppliers_v1',
  ACTIVITIES: 'mb_activities_v1',
  SETTINGS: 'mb_settings_v1',
  SESSION: 'mb_auth_session_v1'
};

// Helper to safely read from localStorage
const getItem = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
};

// Helper to safely write to localStorage
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

// Generate unique sequential / random IDs
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
};

export const generateInvoiceNumber = (branchCode = 'GEN') => {
  const sales = getItem(KEYS.SALES, []);
  const count = sales.length + 1;
  const year = new Date().getFullYear();
  return `INV-${branchCode}-${year}-${String(count).padStart(4, '0')}`;
};

export const generateTransferNumber = () => {
  const transfers = getItem(KEYS.STOCK_TRANSFERS, []);
  const count = transfers.length + 1;
  const year = new Date().getFullYear();
  return `TR-${year}-${String(count).padStart(4, '0')}`;
};

// Storage Service API
export const storageService = {
  // Initialize sample data if localStorage is empty
  init() {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      this.resetToDemoData();
    }
  },

  resetToDemoData() {
    setItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setItem(KEYS.BRANCHES, INITIAL_BRANCHES);
    setItem(KEYS.USERS, INITIAL_USERS);
    setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setItem(KEYS.CENTRAL_INVENTORY, INITIAL_CENTRAL_INVENTORY);
    setItem(KEYS.BRANCH_INVENTORY, INITIAL_BRANCH_INVENTORY);
    setItem(KEYS.STOCK_TRANSFERS, INITIAL_TRANSFERS);
    setItem(KEYS.STOCK_TRANSACTIONS, INITIAL_STOCK_TRANSACTIONS);
    setItem(KEYS.SALES, INITIAL_SALES);
    setItem(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setItem(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    setItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    setItem(KEYS.SETTINGS, INITIAL_SETTINGS);
    
    // Set default active admin session if none exists
    if (!this.getCurrentSession()) {
      this.setCurrentSession(INITIAL_USERS[0]);
    }
  },

  clearAllData(keepBranchesAndUsers = true) {
    setItem(KEYS.PRODUCTS, []);
    setItem(KEYS.CENTRAL_INVENTORY, []);
    setItem(KEYS.BRANCH_INVENTORY, []);
    setItem(KEYS.STOCK_TRANSFERS, []);
    setItem(KEYS.STOCK_TRANSACTIONS, []);
    setItem(KEYS.SALES, []);
    setItem(KEYS.CUSTOMERS, []);
    setItem(KEYS.SUPPLIERS, []);
    setItem(KEYS.ACTIVITIES, []);

    if (!keepBranchesAndUsers) {
      setItem(KEYS.BRANCHES, INITIAL_BRANCHES);
      setItem(KEYS.USERS, INITIAL_USERS);
    }

    this.logActivity('Data Cleared', 'Central Hub', 'CLEARED', 'All sample products, stock, and sales were cleared to start fresh.');
  },

  importProductsCSV(csvText) {
    if (!csvText || !csvText.trim()) {
      throw new Error('CSV content is empty. Please provide product data.');
    }

    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) {
      throw new Error('No valid rows found in CSV data.');
    }

    // Check if first row is header
    const firstRowLower = lines[0].toLowerCase();
    const hasHeader = firstRowLower.includes('name') || firstRowLower.includes('product') || firstRowLower.includes('sku') || firstRowLower.includes('price');
    const dataRows = hasHeader ? lines.slice(1) : lines;

    if (dataRows.length === 0) {
      throw new Error('CSV has header but no data rows.');
    }

    const currentProducts = this.getProducts();
    const currentCentral = getItem(KEYS.CENTRAL_INVENTORY, []);
    const categories = this.getCategories();
    const importedProducts = [];
    const newCentralItems = [...currentCentral];
    let newCategories = [...categories];

    dataRows.forEach((row, idx) => {
      // Split by comma or semicolon or tab, handling optional quotes
      const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) return;

      // Formats supported:
      // Name, SKU, Category, Unit, SellingPrice, PurchasePrice, MinStock, InitialCentralStock
      const name = cols[0] || `Product ${idx + 1}`;
      const sku = cols[1] || `SKU-${Date.now().toString().slice(-4)}-${idx + 1}`;
      const category = cols[2] || 'Feeds';
      const unit = cols[3] || 'Bag (50KG)';
      const sellingPrice = Number(cols[4]) || 0;
      const purchasePrice = Number(cols[5]) || 0;
      const minStock = Number(cols[6]) || 10;
      const initialStock = Number(cols[7]) || 0;

      if (!newCategories.includes(category)) {
        newCategories.push(category);
      }

      const prodId = generateId('prod');
      const newProduct = {
        id: prodId,
        name,
        sku: sku.toUpperCase(),
        category,
        brand: 'Standard',
        variety: 'Standard',
        unit,
        purchasePrice,
        sellingPrice,
        minStock,
        status: 'Active',
        description: 'Uploaded via CSV Importer',
        createdAt: new Date().toISOString()
      };

      importedProducts.push(newProduct);
      newCentralItems.push({
        productId: prodId,
        quantity: initialStock,
        updatedAt: new Date().toISOString()
      });
    });

    if (importedProducts.length === 0) {
      throw new Error('Failed to parse any valid products from the CSV data.');
    }

    setItem(KEYS.CATEGORIES, newCategories);
    setItem(KEYS.PRODUCTS, [...importedProducts, ...currentProducts]);
    setItem(KEYS.CENTRAL_INVENTORY, newCentralItems);

    this.logActivity(
      'Products Uploaded',
      'Central Hub',
      'CSV_IMPORT',
      `Imported ${importedProducts.length} custom products via CSV.`
    );

    return importedProducts;
  },

  // Auth Session
  getCurrentSession() {
    return getItem(KEYS.SESSION, null);
  },

  setCurrentSession(user) {
    setItem(KEYS.SESSION, user);
  },

  clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  },

  authenticate(username, password) {
    const users = this.getUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );
    if (!user) {
      throw new Error('Invalid username or password');
    }
    if (user.status !== 'Active') {
      throw new Error('User account is inactive. Please contact Admin.');
    }
    this.setCurrentSession(user);
    this.logActivity('User Login', user.branchName || 'Central', `USER-${user.id}`, `${user.name} logged in.`);
    return user;
  },

  // ----------------- CATEGORIES -----------------
  getCategories() {
    return getItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  addCategory(categoryName) {
    const categories = this.getCategories();
    const cleanName = categoryName.trim();
    if (!cleanName) throw new Error('Category name cannot be empty');
    if (categories.some(c => c.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error('Category already exists');
    }
    const updated = [...categories, cleanName];
    setItem(KEYS.CATEGORIES, updated);
    this.logActivity('Category Added', 'Central', cleanName, `New category "${cleanName}" created.`);
    return updated;
  },

  // ----------------- BRANCHES -----------------
  getBranches() {
    return getItem(KEYS.BRANCHES, INITIAL_BRANCHES);
  },

  getBranchById(id) {
    const branches = this.getBranches();
    return branches.find(b => b.id === id) || null;
  },

  addBranch(branchData) {
    const branches = this.getBranches();
    const code = branchData.code?.toUpperCase().trim() || `BR-${branches.length + 1}`;
    
    if (branches.some(b => b.code.toUpperCase() === code)) {
      throw new Error(`Branch code "${code}" already exists.`);
    }

    const newBranch = {
      id: generateId('branch'),
      code,
      name: branchData.name.trim(),
      isMainShop: branchData.isMainShop || false,
      address: branchData.address || '',
      phone: branchData.phone || '',
      assignedUserId: branchData.assignedUserId || '',
      assignedUserName: branchData.assignedUserName || 'Unassigned',
      status: branchData.status || 'Active',
      createdAt: new Date().toISOString()
    };

    const updated = [...branches, newBranch];
    setItem(KEYS.BRANCHES, updated);
    this.logActivity('Branch Created', newBranch.name, newBranch.code, `New branch "${newBranch.name}" (${newBranch.code}) created.`);
    return newBranch;
  },

  updateBranch(id, branchData) {
    const branches = this.getBranches();
    const index = branches.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Branch not found');

    const updatedBranch = {
      ...branches[index],
      ...branchData,
      id
    };
    branches[index] = updatedBranch;
    setItem(KEYS.BRANCHES, branches);
    this.logActivity('Branch Updated', updatedBranch.name, updatedBranch.code, `Branch "${updatedBranch.name}" details updated.`);
    return updatedBranch;
  },

  deleteBranch(id) {
    const branches = this.getBranches();
    const branch = branches.find(b => b.id === id);
    if (!branch) throw new Error('Branch not found');
    if (branch.isMainShop) throw new Error('Cannot delete Main HQ Shop.');

    const updated = branches.filter(b => b.id !== id);
    setItem(KEYS.BRANCHES, updated);
    this.logActivity('Branch Deleted', branch.name, branch.code, `Branch "${branch.name}" was removed.`);
    return true;
  },

  // ----------------- USERS -----------------
  getUsers() {
    return getItem(KEYS.USERS, INITIAL_USERS);
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  addUser(userData) {
    const users = this.getUsers();
    if (users.some(u => u.username.toLowerCase() === userData.username.trim().toLowerCase())) {
      throw new Error(`Username "${userData.username}" is already taken.`);
    }

    const branch = userData.branchId ? this.getBranchById(userData.branchId) : null;

    const newUser = {
      id: generateId('user'),
      name: userData.name.trim(),
      username: userData.username.trim().toLowerCase(),
      password: userData.password.trim(),
      role: userData.role || 'shop_user',
      branchId: userData.branchId || null,
      branchName: branch ? branch.name : 'Central / Unassigned',
      phone: userData.phone || '',
      status: userData.status || 'Active',
      createdAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    setItem(KEYS.USERS, updated);
    this.logActivity('User Created', newUser.branchName, `USER-${newUser.id}`, `User "${newUser.name}" (${newUser.username}) created.`);
    return newUser;
  },

  updateUser(id, userData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    const branch = userData.branchId ? this.getBranchById(userData.branchId) : null;

    const updatedUser = {
      ...users[index],
      ...userData,
      branchName: branch ? branch.name : users[index].branchName,
      id
    };

    users[index] = updatedUser;
    setItem(KEYS.USERS, users);
    this.logActivity('User Updated', updatedUser.branchName, `USER-${id}`, `User "${updatedUser.name}" details updated.`);
    return updatedUser;
  },

  deleteUser(id) {
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
      throw new Error('Cannot delete the only Admin user.');
    }

    const updated = users.filter(u => u.id !== id);
    setItem(KEYS.USERS, updated);
    this.logActivity('User Deleted', user.branchName, `USER-${id}`, `User "${user.name}" was removed.`);
    return true;
  },

  // ----------------- PRODUCTS -----------------
  getProducts() {
    return getItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  addProduct(productData) {
    const products = this.getProducts();
    const sku = productData.sku?.toUpperCase().trim() || `SKU-${Date.now().toString().slice(-4)}`;
    
    if (products.some(p => p.sku.toUpperCase() === sku)) {
      throw new Error(`Product SKU "${sku}" already exists.`);
    }

    const newProduct = {
      id: generateId('prod'),
      name: productData.name.trim(),
      sku,
      category: productData.category || 'Feeds',
      brand: productData.brand || '',
      variety: productData.variety || '',
      unit: productData.unit || 'Unit',
      purchasePrice: Number(productData.purchasePrice) || 0,
      sellingPrice: Number(productData.sellingPrice) || 0,
      minStock: Number(productData.minStock) || 10,
      status: productData.status || 'Active',
      description: productData.description || '',
      createdAt: new Date().toISOString()
    };

    const updated = [newProduct, ...products];
    setItem(KEYS.PRODUCTS, updated);

    // Initialize central inventory record with 0 quantity if not present
    const centralInv = getItem(KEYS.CENTRAL_INVENTORY, []);
    if (!centralInv.some(ci => ci.productId === newProduct.id)) {
      centralInv.push({
        productId: newProduct.id,
        quantity: 0,
        updatedAt: new Date().toISOString()
      });
      setItem(KEYS.CENTRAL_INVENTORY, centralInv);
    }

    this.logActivity('Product Created', 'Central Hub', newProduct.sku, `Product "${newProduct.name}" (${newProduct.sku}) added to Product Master.`);
    return newProduct;
  },

  updateProduct(id, productData) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const updatedProduct = {
      ...products[index],
      ...productData,
      purchasePrice: Number(productData.purchasePrice ?? products[index].purchasePrice),
      sellingPrice: Number(productData.sellingPrice ?? products[index].sellingPrice),
      minStock: Number(productData.minStock ?? products[index].minStock),
      id
    };

    products[index] = updatedProduct;
    setItem(KEYS.PRODUCTS, products);
    this.logActivity('Product Updated', 'Central Hub', updatedProduct.sku, `Product "${updatedProduct.name}" updated.`);
    return updatedProduct;
  },

  deleteProduct(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');

    // Check if there is existing stock in central or any branch
    const centralInv = getItem(KEYS.CENTRAL_INVENTORY, []);
    const centralStock = centralInv.find(c => c.productId === id)?.quantity || 0;
    const branchInv = getItem(KEYS.BRANCH_INVENTORY, []);
    const totalBranchStock = branchInv
      .filter(b => b.productId === id)
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    if (centralStock > 0 || totalBranchStock > 0) {
      throw new Error(`Cannot delete product with active stock (Central: ${centralStock}, Branches: ${totalBranchStock}). Please adjust stock to 0 or mark product as Inactive.`);
    }

    const updatedProducts = products.filter(p => p.id !== id);
    setItem(KEYS.PRODUCTS, updatedProducts);

    // Clean inventory records
    setItem(KEYS.CENTRAL_INVENTORY, centralInv.filter(c => c.productId !== id));
    setItem(KEYS.BRANCH_INVENTORY, branchInv.filter(b => b.productId !== id));

    this.logActivity('Product Deleted', 'Central Hub', product.sku, `Product "${product.name}" (${product.sku}) removed.`);
    return true;
  },

  // ----------------- CENTRAL INVENTORY -----------------
  getCentralInventory() {
    const products = this.getProducts();
    const centralInv = getItem(KEYS.CENTRAL_INVENTORY, []);

    return products.map(product => {
      const inv = centralInv.find(c => c.productId === product.id);
      const quantity = inv ? inv.quantity : 0;
      
      let status = 'Normal';
      if (quantity === 0) {
        status = 'Out of Stock';
      } else if (quantity <= product.minStock) {
        status = 'Low Stock';
      }

      return {
        ...product,
        quantity,
        stockStatus: status,
        totalValue: quantity * product.purchasePrice,
        sellingValue: quantity * product.sellingPrice,
        updatedAt: inv?.updatedAt || product.createdAt
      };
    });
  },

  addCentralStock({ productId, quantity, purchasePrice, date, supplier, notes, createdBy = 'Admin' }) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Please enter a valid stock quantity greater than 0.');
    }

    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const centralInv = getItem(KEYS.CENTRAL_INVENTORY, []);
    let invIndex = centralInv.findIndex(c => c.productId === productId);
    let prevStock = 0;

    if (invIndex >= 0) {
      prevStock = centralInv[invIndex].quantity || 0;
      centralInv[invIndex].quantity = prevStock + qty;
      centralInv[invIndex].updatedAt = new Date().toISOString();
    } else {
      centralInv.push({
        productId,
        quantity: qty,
        updatedAt: new Date().toISOString()
      });
      invIndex = centralInv.length - 1;
    }

    setItem(KEYS.CENTRAL_INVENTORY, centralInv);
    const newStock = prevStock + qty;

    // If purchase price provided, optionally update product base purchase price
    if (purchasePrice && Number(purchasePrice) > 0) {
      this.updateProduct(productId, { purchasePrice: Number(purchasePrice) });
    }

    // Record Stock Transaction
    const txId = generateId('tx');
    const refId = `IN-${Date.now().toString().slice(-6)}`;
    const tx = {
      id: txId,
      type: 'CENTRAL_ADD',
      productId: product.id,
      productName: product.name,
      branchId: null,
      branchName: 'Central Inventory',
      quantityChange: qty,
      previousStock: prevStock,
      newStock: newStock,
      purchasePrice: Number(purchasePrice) || product.purchasePrice,
      supplier: supplier || 'Direct Intake',
      referenceId: refId,
      date: date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || `Added ${qty} ${product.unit} to Central Stock`,
      createdBy
    };

    const transactions = getItem(KEYS.STOCK_TRANSACTIONS, []);
    setItem(KEYS.STOCK_TRANSACTIONS, [tx, ...transactions]);

    this.logActivity(
      'Stock Added',
      'Central Inventory',
      refId,
      `${createdBy} added ${qty} ${product.unit} of "${product.name}" to Central Inventory. (Prev: ${prevStock}, New: ${newStock})`
    );

    return {
      product,
      previousStock: prevStock,
      addedQuantity: qty,
      newStock,
      transaction: tx
    };
  },

  // ----------------- STOCK TRANSFERS (CORE FEATURE) -----------------
  getStockTransfers(filters = {}) {
    let transfers = getItem(KEYS.STOCK_TRANSFERS, INITIAL_TRANSFERS);

    if (filters.toBranchId) {
      transfers = transfers.filter(t => t.toBranchId === filters.toBranchId);
    }
    if (filters.productId) {
      transfers = transfers.filter(t => t.productId === filters.productId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      transfers = transfers.filter(t =>
        t.transferNumber.toLowerCase().includes(q) ||
        t.productName.toLowerCase().includes(q) ||
        t.productSku.toLowerCase().includes(q) ||
        t.toBranchName.toLowerCase().includes(q)
      );
    }

    return transfers;
  },

  createStockTransfer({ toBranchId, productId, quantity, notes = '', transferredBy = 'Admin' }) {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Please enter a valid transfer quantity greater than 0.');
    }

    const branch = this.getBranchById(toBranchId);
    if (!branch) throw new Error('Destination branch not found');

    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    // 1. Check Central Stock
    const centralInv = getItem(KEYS.CENTRAL_INVENTORY, []);
    const centralIndex = centralInv.findIndex(c => c.productId === productId);
    const currentCentralStock = centralIndex >= 0 ? (centralInv[centralIndex].quantity || 0) : 0;

    if (currentCentralStock < qty) {
      throw new Error(
        `Insufficient Central Stock for "${product.name}". Available in Central: ${currentCentralStock} ${product.unit}, Requested: ${qty} ${product.unit}.`
      );
    }

    // 2. Reduce Central Stock
    centralInv[centralIndex].quantity = currentCentralStock - qty;
    centralInv[centralIndex].updatedAt = new Date().toISOString();
    setItem(KEYS.CENTRAL_INVENTORY, centralInv);
    const newCentralStock = currentCentralStock - qty;

    // 3. Increment / Create Branch Inventory
    const branchInv = getItem(KEYS.BRANCH_INVENTORY, []);
    let branchItemIndex = branchInv.findIndex(b => b.branchId === toBranchId && b.productId === productId);
    let prevBranchStock = 0;

    if (branchItemIndex >= 0) {
      prevBranchStock = branchInv[branchItemIndex].quantity || 0;
      branchInv[branchItemIndex].quantity = prevBranchStock + qty;
      branchInv[branchItemIndex].updatedAt = new Date().toISOString();
    } else {
      // Auto-create branch inventory record!
      branchInv.push({
        id: generateId('bi'),
        branchId: toBranchId,
        productId,
        quantity: qty,
        updatedAt: new Date().toISOString()
      });
      prevBranchStock = 0;
      branchItemIndex = branchInv.length - 1;
    }

    setItem(KEYS.BRANCH_INVENTORY, branchInv);
    const newBranchStock = prevBranchStock + qty;

    // 4. Create Stock Transfer Record
    const transferNumber = generateTransferNumber();
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const transferRecord = {
      id: generateId('tr'),
      transferNumber,
      fromLocation: 'Central Inventory',
      toBranchId,
      toBranchName: branch.name,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      category: product.category,
      quantity: qty,
      unit: product.unit,
      status: 'Completed',
      date: todayStr,
      time: timeStr,
      notes: notes || `Stock transfer to ${branch.name}`,
      transferredBy
    };

    const transfers = getItem(KEYS.STOCK_TRANSFERS, []);
    setItem(KEYS.STOCK_TRANSFERS, [transferRecord, ...transfers]);

    // 5. Create 2 Transaction Logs (Transfer OUT Central, Transfer IN Branch)
    const transactions = getItem(KEYS.STOCK_TRANSACTIONS, []);
    const txOut = {
      id: generateId('tx'),
      type: 'TRANSFER_OUT',
      productId: product.id,
      productName: product.name,
      branchId: null,
      branchName: 'Central Inventory',
      quantityChange: -qty,
      previousStock: currentCentralStock,
      newStock: newCentralStock,
      referenceId: transferNumber,
      date: todayStr,
      time: timeStr,
      notes: `Transfer dispatched to ${branch.name}`,
      createdBy: transferredBy
    };

    const txIn = {
      id: generateId('tx'),
      type: 'TRANSFER_IN',
      productId: product.id,
      productName: product.name,
      branchId: toBranchId,
      branchName: branch.name,
      quantityChange: qty,
      previousStock: prevBranchStock,
      newStock: newBranchStock,
      referenceId: transferNumber,
      date: todayStr,
      time: timeStr,
      notes: `Stock received from Central Inventory`,
      createdBy: transferredBy
    };

    setItem(KEYS.STOCK_TRANSACTIONS, [txOut, txIn, ...transactions]);

    // 6. Log Activity
    this.logActivity(
      'Stock Transfer',
      branch.name,
      transferNumber,
      `${transferredBy} transferred ${qty} ${product.unit} of "${product.name}" from Central to ${branch.name}. (Central: ${currentCentralStock} -> ${newCentralStock}, ${branch.name}: ${prevBranchStock} -> ${newBranchStock})`
    );

    return {
      transfer: transferRecord,
      centralStock: { before: currentCentralStock, after: newCentralStock },
      branchStock: { before: prevBranchStock, after: newBranchStock }
    };
  },

  // ----------------- BRANCH INVENTORY -----------------
  getBranchInventory(branchId) {
    const products = this.getProducts();
    const branchInv = getItem(KEYS.BRANCH_INVENTORY, []);
    const currentBranchRecords = branchInv.filter(b => b.branchId === branchId);

    // Map each item in branch inventory with its product details
    return currentBranchRecords.map(bi => {
      const product = products.find(p => p.id === bi.productId) || {
        name: 'Unknown Product',
        sku: 'N/A',
        category: 'Uncategorized',
        unit: 'Unit',
        sellingPrice: 0,
        purchasePrice: 0,
        minStock: 10
      };

      const quantity = bi.quantity || 0;
      let status = 'Normal';
      if (quantity === 0) {
        status = 'Out of Stock';
      } else if (quantity <= product.minStock) {
        status = 'Low Stock';
      }

      return {
        id: bi.id,
        branchId: bi.branchId,
        productId: bi.productId,
        quantity,
        stockStatus: status,
        name: product.name,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
        variety: product.variety,
        unit: product.unit,
        sellingPrice: product.sellingPrice,
        purchasePrice: product.purchasePrice,
        minStock: product.minStock,
        totalValue: quantity * product.sellingPrice,
        updatedAt: bi.updatedAt
      };
    });
  },

  getAllBranchInventories() {
    const branches = this.getBranches();
    const products = this.getProducts();
    const branchInv = getItem(KEYS.BRANCH_INVENTORY, []);

    return branchInv.map(bi => {
      const branch = branches.find(b => b.id === bi.branchId);
      const product = products.find(p => p.id === bi.productId);

      const quantity = bi.quantity || 0;
      const minStock = product?.minStock || 10;
      let status = 'Normal';
      if (quantity === 0) {
        status = 'Out of Stock';
      } else if (quantity <= minStock) {
        status = 'Low Stock';
      }

      return {
        ...bi,
        quantity,
        stockStatus: status,
        branchName: branch ? branch.name : 'Unknown Branch',
        branchCode: branch ? branch.code : 'N/A',
        productName: product ? product.name : 'Unknown Product',
        productSku: product ? product.sku : 'N/A',
        category: product ? product.category : 'General',
        unit: product ? product.unit : 'Unit',
        sellingPrice: product ? product.sellingPrice : 0,
        purchasePrice: product ? product.purchasePrice : 0,
        minStock
      };
    });
  },

  // ----------------- SALES & BILLING -----------------
  getSales(filters = {}) {
    let sales = getItem(KEYS.SALES, INITIAL_SALES);

    if (filters.branchId) {
      sales = sales.filter(s => s.branchId === filters.branchId);
    }
    if (filters.paymentMethod) {
      sales = sales.filter(s => s.paymentMethod === filters.paymentMethod);
    }
    if (filters.date) {
      sales = sales.filter(s => s.date === filters.date);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      sales = sales.filter(s =>
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.branchName.toLowerCase().includes(q) ||
        s.items.some(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      );
    }

    return sales;
  },

  getInvoiceById(idOrInvoiceNo) {
    const sales = this.getSales();
    return sales.find(s => s.id === idOrInvoiceNo || s.invoiceNumber === idOrInvoiceNo) || null;
  },

  createSale({
    branchId,
    customerId,
    customerName,
    customerPhone,
    items, // [{ productId, quantity, unitPrice, discount }]
    totalDiscount = 0,
    taxRate = 0,
    paymentMethod = 'Cash',
    paymentStatus = 'Paid',
    notes = '',
    createdBy = 'Shop User'
  }) {
    if (!branchId) throw new Error('Branch is required for sale');
    if (!items || !items.length) throw new Error('Please add at least one item to sale');

    const branch = this.getBranchById(branchId);
    if (!branch) throw new Error('Branch not found');

    const branchInv = getItem(KEYS.BRANCH_INVENTORY, []);
    const products = this.getProducts();

    // 1. Validate Stock for all items FIRST before committing any deduction
    const validatedItems = [];
    let computedSubtotal = 0;

    for (const item of items) {
      const qty = Number(item.quantity);
      if (isNaN(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for item ${item.name || item.productId}`);
      }

      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const branchItem = branchInv.find(b => b.branchId === branchId && b.productId === item.productId);
      const availableStock = branchItem ? (branchItem.quantity || 0) : 0;

      if (availableStock < qty) {
        throw new Error(
          `Insufficient Stock in ${branch.name} for "${product.name}". Available: ${availableStock} ${product.unit}, Requested: ${qty} ${product.unit}.`
        );
      }

      const unitPrice = Number(item.unitPrice ?? product.sellingPrice);
      const itemDiscount = Number(item.discount || 0);
      const lineTotal = (qty * unitPrice) - itemDiscount;
      computedSubtotal += (qty * unitPrice);

      validatedItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        unit: product.unit,
        quantity: qty,
        unitPrice,
        discount: itemDiscount,
        total: lineTotal,
        branchStockBefore: availableStock,
        branchStockAfter: availableStock - qty
      });
    }

    // 2. Perform Stock Deductions & record transactions
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const invoiceNumber = generateInvoiceNumber(branch.code);
    const transactions = getItem(KEYS.STOCK_TRANSACTIONS, []);
    const newTxList = [];

    for (const valItem of validatedItems) {
      const invIndex = branchInv.findIndex(b => b.branchId === branchId && b.productId === valItem.productId);
      branchInv[invIndex].quantity = valItem.branchStockAfter;
      branchInv[invIndex].updatedAt = new Date().toISOString();

      newTxList.push({
        id: generateId('tx'),
        type: 'SALE',
        productId: valItem.productId,
        productName: valItem.name,
        branchId,
        branchName: branch.name,
        quantityChange: -valItem.quantity,
        previousStock: valItem.branchStockBefore,
        newStock: valItem.branchStockAfter,
        referenceId: invoiceNumber,
        date: todayStr,
        time: timeStr,
        notes: `Sale to ${customerName || 'Walk-in'} (${paymentMethod})`,
        createdBy
      });
    }

    setItem(KEYS.BRANCH_INVENTORY, branchInv);
    setItem(KEYS.STOCK_TRANSACTIONS, [...newTxList, ...transactions]);

    // 3. Compute final totals
    const grandSubtotal = computedSubtotal;
    const finalDiscount = Number(totalDiscount) || 0;
    const taxableAmount = Math.max(0, grandSubtotal - finalDiscount);
    const taxAmount = (taxableAmount * (Number(taxRate) || 0)) / 100;
    const grandTotal = Math.round(taxableAmount + taxAmount);

    // 4. Create Sale / Invoice Document
    const saleRecord = {
      id: generateId('sale'),
      invoiceNumber,
      branchId,
      branchName: branch.name,
      branchPhone: branch.phone,
      branchAddress: branch.address,
      customerId: customerId || null,
      customerName: (customerName || 'Walk-in Customer').trim(),
      customerPhone: (customerPhone || '').trim(),
      items: validatedItems,
      subtotal: grandSubtotal,
      totalDiscount: finalDiscount,
      taxRate: Number(taxRate) || 0,
      taxAmount,
      grandTotal,
      paymentMethod,
      paymentStatus,
      notes: notes || '',
      date: todayStr,
      time: timeStr,
      createdBy,
      createdAt: new Date().toISOString()
    };

    const sales = getItem(KEYS.SALES, []);
    setItem(KEYS.SALES, [saleRecord, ...sales]);

    // 5. Update / Add Customer record
    if (customerName && customerName.trim() && customerName !== 'Walk-in Customer') {
      const customers = getItem(KEYS.CUSTOMERS, []);
      let cust = customers.find(c => (customerId && c.id === customerId) || (customerPhone && c.phone === customerPhone));
      
      if (cust) {
        cust.totalSpent = (cust.totalSpent || 0) + grandTotal;
        cust.orderCount = (cust.orderCount || 0) + 1;
        if (paymentMethod === 'Credit') {
          cust.balance = (cust.balance || 0) + grandTotal;
        }
      } else {
        customers.push({
          id: generateId('cust'),
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: '',
          address: '',
          branchId,
          branchName: branch.name,
          totalSpent: grandTotal,
          orderCount: 1,
          balance: paymentMethod === 'Credit' ? grandTotal : 0
        });
      }
      setItem(KEYS.CUSTOMERS, customers);
    }

    // 6. Log Activity
    this.logActivity(
      'Invoice Created',
      branch.name,
      invoiceNumber,
      `${createdBy} generated Invoice ${invoiceNumber} for ₹${grandTotal.toLocaleString()} (${validatedItems.length} items, ${paymentMethod}) at ${branch.name}.`
    );

    return saleRecord;
  },

  // ----------------- TRANSACTIONS & AUDIT -----------------
  getStockTransactions(filters = {}) {
    let txs = getItem(KEYS.STOCK_TRANSACTIONS, INITIAL_STOCK_TRANSACTIONS);

    if (filters.branchId) {
      txs = txs.filter(t => t.branchId === filters.branchId);
    }
    if (filters.productId) {
      txs = txs.filter(t => t.productId === filters.productId);
    }
    if (filters.type) {
      txs = txs.filter(t => t.type === filters.type);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(t =>
        t.productName.toLowerCase().includes(q) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(q)) ||
        (t.branchName && t.branchName.toLowerCase().includes(q))
      );
    }

    return txs;
  },

  getActivityLogs(limit = 100) {
    const activities = getItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    return activities.slice(0, limit);
  },

  logActivity(action, branchName, reference, details, userObj = null) {
    const session = userObj || this.getCurrentSession() || { name: 'System', role: 'system', id: 'sys' };
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newActivity = {
      id: generateId('act'),
      userId: session.id || session.userId || 'sys',
      userName: session.name || 'System',
      role: session.role || 'user',
      action,
      branchName: branchName || 'Central',
      date: todayStr,
      time: timeStr,
      reference: reference || 'N/A',
      details
    };

    const activities = getItem(KEYS.ACTIVITIES, []);
    setItem(KEYS.ACTIVITIES, [newActivity, ...activities].slice(0, 300));
  },

  // ----------------- CUSTOMERS & SUPPLIERS -----------------
  getCustomers(filters = {}) {
    let customers = getItem(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    if (filters.branchId) {
      customers = customers.filter(c => c.branchId === filters.branchId || c.branchName === 'All');
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return customers;
  },

  addCustomer(customerData) {
    const customers = this.getCustomers();
    const newCustomer = {
      id: generateId('cust'),
      name: customerData.name.trim(),
      phone: customerData.phone?.trim() || '',
      email: customerData.email?.trim() || '',
      address: customerData.address?.trim() || '',
      branchId: customerData.branchId || null,
      branchName: customerData.branchName || 'Central',
      totalSpent: 0,
      orderCount: 0,
      balance: Number(customerData.balance) || 0
    };
    const updated = [newCustomer, ...customers];
    setItem(KEYS.CUSTOMERS, updated);
    this.logActivity('Customer Created', newCustomer.branchName, `CUST-${newCustomer.id}`, `Customer "${newCustomer.name}" added.`);
    return newCustomer;
  },

  updateCustomer(id, data) {
    const customers = this.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Customer not found');
    customers[idx] = { ...customers[idx], ...data, id };
    setItem(KEYS.CUSTOMERS, customers);
    return customers[idx];
  },

  getSuppliers() {
    return getItem(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  },

  addSupplier(supplierData) {
    const suppliers = this.getSuppliers();
    const newSupplier = {
      id: generateId('sup'),
      name: supplierData.name.trim(),
      contactPerson: supplierData.contactPerson?.trim() || '',
      phone: supplierData.phone?.trim() || '',
      email: supplierData.email?.trim() || '',
      address: supplierData.address?.trim() || '',
      productsSupplied: Array.isArray(supplierData.productsSupplied) ? supplierData.productsSupplied : [supplierData.productsSupplied || 'General Feed Products'],
      totalPurchased: Number(supplierData.totalPurchased) || 0
    };
    const updated = [newSupplier, ...suppliers];
    setItem(KEYS.SUPPLIERS, updated);
    this.logActivity('Supplier Created', 'Central Hub', `SUP-${newSupplier.id}`, `Supplier "${newSupplier.name}" added.`);
    return newSupplier;
  },

  // ----------------- SETTINGS -----------------
  getSettings() {
    return getItem(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(newSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    setItem(KEYS.SETTINGS, merged);
    this.logActivity('Settings Updated', 'Central Hub', 'CONFIG', 'Business settings updated.');
    return merged;
  },

  exportDatabaseJSON() {
    const dump = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      categories: getItem(KEYS.CATEGORIES, []),
      branches: getItem(KEYS.BRANCHES, []),
      users: getItem(KEYS.USERS, []),
      products: getItem(KEYS.PRODUCTS, []),
      centralInventory: getItem(KEYS.CENTRAL_INVENTORY, []),
      branchInventory: getItem(KEYS.BRANCH_INVENTORY, []),
      transfers: getItem(KEYS.STOCK_TRANSFERS, []),
      transactions: getItem(KEYS.STOCK_TRANSACTIONS, []),
      sales: getItem(KEYS.SALES, []),
      customers: getItem(KEYS.CUSTOMERS, []),
      suppliers: getItem(KEYS.SUPPLIERS, []),
      activities: getItem(KEYS.ACTIVITIES, []),
      settings: getItem(KEYS.SETTINGS, {})
    };
    return JSON.stringify(dump, null, 2);
  },

  importDatabaseJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) setItem(KEYS.PRODUCTS, data.products);
      if (data.categories) setItem(KEYS.CATEGORIES, data.categories);
      if (data.branches) setItem(KEYS.BRANCHES, data.branches);
      if (data.users) setItem(KEYS.USERS, data.users);
      if (data.centralInventory) setItem(KEYS.CENTRAL_INVENTORY, data.centralInventory);
      if (data.branchInventory) setItem(KEYS.BRANCH_INVENTORY, data.branchInventory);
      if (data.transfers) setItem(KEYS.STOCK_TRANSFERS, data.transfers);
      if (data.transactions) setItem(KEYS.STOCK_TRANSACTIONS, data.transactions);
      if (data.sales) setItem(KEYS.SALES, data.sales);
      if (data.customers) setItem(KEYS.CUSTOMERS, data.customers);
      if (data.suppliers) setItem(KEYS.SUPPLIERS, data.suppliers);
      if (data.activities) setItem(KEYS.ACTIVITIES, data.activities);
      if (data.settings) setItem(KEYS.SETTINGS, data.settings);
      this.logActivity('Database Restored', 'Central Hub', 'RESTORE', 'All database tables restored from JSON file.');
      return true;
    } catch (err) {
      throw new Error(`Failed to import JSON: ${err.message}`);
    }
  },

  // ----------------- ANALYTICS & DASHBOARD METRICS -----------------
  getDashboardMetrics(branchId = null) {
    const today = new Date().toISOString().split('T')[0];
    const branches = this.getBranches();
    const products = this.getProducts();
    const centralInv = this.getCentralInventory();
    const allBranchInv = this.getAllBranchInventories();
    const sales = this.getSales();

    if (branchId) {
      // Branch-specific metrics
      const branch = branches.find(b => b.id === branchId);
      const branchItems = this.getBranchInventory(branchId);
      const branchSales = sales.filter(s => s.branchId === branchId);
      const todaySales = branchSales.filter(s => s.date === today);

      const totalItemsInStock = branchItems.reduce((acc, i) => acc + i.quantity, 0);
      const totalInventoryValue = branchItems.reduce((acc, i) => acc + (i.quantity * i.sellingPrice), 0);
      const lowStockCount = branchItems.filter(i => i.stockStatus === 'Low Stock').length;
      const outOfStockCount = branchItems.filter(i => i.stockStatus === 'Out of Stock').length;

      const todayRevenue = todaySales.reduce((acc, s) => acc + s.grandTotal, 0);
      const todayBillsCount = todaySales.length;

      const totalRevenue = branchSales.reduce((acc, s) => acc + s.grandTotal, 0);
      const totalBillsCount = branchSales.length;

      return {
        isBranch: true,
        branch,
        totalItemsInStock,
        totalInventoryValue,
        lowStockCount,
        outOfStockCount,
        todayRevenue,
        todayBillsCount,
        totalRevenue,
        totalBillsCount,
        recentSales: branchSales.slice(0, 5),
        lowStockItems: branchItems.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock')
      };
    } else {
      // Admin Central System-wide metrics
      const totalBranches = branches.length;
      const totalProducts = products.length;
      
      const totalCentralStockUnits = centralInv.reduce((acc, i) => acc + i.quantity, 0);
      const totalCentralStockValue = centralInv.reduce((acc, i) => acc + i.totalValue, 0);

      const totalBranchStockUnits = allBranchInv.reduce((acc, i) => acc + i.quantity, 0);
      const totalBranchStockValue = allBranchInv.reduce((acc, i) => acc + (i.quantity * (i.sellingPrice || 0)), 0);

      const todaySalesList = sales.filter(s => s.date === today);
      const todaySalesRevenue = todaySalesList.reduce((acc, s) => acc + s.grandTotal, 0);
      const todayBillsCount = todaySalesList.length;

      const totalSalesRevenue = sales.reduce((acc, s) => acc + s.grandTotal, 0);
      const totalBillsCount = sales.length;

      // Low stock across central & branches
      const centralLowStock = centralInv.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock');
      const branchLowStock = allBranchInv.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock');

      // Per-branch overview breakdown table
      const branchOverview = branches.map(b => {
        const bSales = sales.filter(s => s.branchId === b.id);
        const bTodaySales = bSales.filter(s => s.date === today);
        const bItems = allBranchInv.filter(i => i.branchId === b.id);
        const bLowStock = bItems.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;
        const bStockUnits = bItems.reduce((acc, i) => acc + i.quantity, 0);

        return {
          branchId: b.id,
          name: b.name,
          code: b.code,
          isMainShop: b.isMainShop,
          manager: b.assignedUserName,
          phone: b.phone,
          todaySalesRevenue: bTodaySales.reduce((acc, s) => acc + s.grandTotal, 0),
          todayBillsCount: bTodaySales.length,
          totalSalesRevenue: bSales.reduce((acc, s) => acc + s.grandTotal, 0),
          totalBillsCount: bSales.length,
          stockUnits: bStockUnits,
          lowStockCount: bLowStock,
          status: b.status
        };
      });

      return {
        isBranch: false,
        totalBranches,
        totalProducts,
        totalCentralStockUnits,
        totalCentralStockValue,
        totalBranchStockUnits,
        totalBranchStockValue,
        todaySalesRevenue,
        todayBillsCount,
        totalSalesRevenue,
        totalBillsCount,
        centralLowStockCount: centralLowStock.length,
        branchLowStockCount: branchLowStock.length,
        branchOverview,
        recentSales: sales.slice(0, 7),
        centralLowStock,
        branchLowStock
      };
    }
  },

  getProductSalesAnalysis(branchId = null, period = 'all') {
    let sales = this.getSales();
    if (branchId) {
      sales = sales.filter(s => s.branchId === branchId);
    }

    // Filter by period if needed
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (period === 'today') {
      sales = sales.filter(s => s.date === todayStr);
    } else if (period === 'week') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      sales = sales.filter(s => s.date >= oneWeekAgo);
    } else if (period === 'month') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
      sales = sales.filter(s => s.date >= oneMonthAgo);
    }

    const productSalesMap = {};
    const categorySalesMap = {};
    let totalUnitsSold = 0;
    let totalRevenue = 0;

    for (const sale of sales) {
      for (const item of sale.items) {
        const pId = item.productId;
        if (!productSalesMap[pId]) {
          productSalesMap[pId] = {
            productId: pId,
            name: item.name,
            sku: item.sku,
            category: item.category || 'General',
            unit: item.unit || 'Unit',
            unitsSold: 0,
            revenue: 0,
            billsCount: 0
          };
        }
        productSalesMap[pId].unitsSold += item.quantity;
        productSalesMap[pId].revenue += item.total;
        productSalesMap[pId].billsCount += 1;

        const cat = item.category || 'General';
        categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.total;

        totalUnitsSold += item.quantity;
        totalRevenue += item.total;
      }
    }

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold);

    const mostSoldProduct = topSellingProducts[0] || null;
    
    let mostSoldCategory = null;
    let maxCatRevenue = 0;
    for (const [cat, rev] of Object.entries(categorySalesMap)) {
      if (rev > maxCatRevenue) {
        maxCatRevenue = rev;
        mostSoldCategory = cat;
      }
    }

    return {
      topSellingProducts,
      categorySalesMap,
      mostSoldProduct,
      mostSoldCategory,
      totalUnitsSold,
      totalRevenue,
      billsCount: sales.length
    };
  }
};

// Auto-run init
storageService.init();
