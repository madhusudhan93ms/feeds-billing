// Seed Data for Multi-Branch Inventory, Sales & Billing Application
// Branches: Shop 1 (Admin Main HQ Shop), Shop 2 (Hosur), Shop 3 (Krishnagiri), Shop 4 (Dharmapuri), Shop 5 (Salem)

export const INITIAL_CATEGORIES = [
  'Summons',
  'Feeds',
  'Silage'
];

export const INITIAL_BRANCHES = [
  {
    id: 'branch-1',
    code: 'HQ-01',
    name: 'Main HQ Shop (Admin)',
    isMainShop: true,
    address: '100 Central Market Road, Krishnagiri Main Junction, TN - 635001',
    phone: '+91 94421 88901',
    assignedUserId: 'user-admin',
    assignedUserName: 'Admin (Central)',
    status: 'Active',
    createdAt: '2026-08-01T09:00:00.000Z'
  },
  {
    id: 'branch-2',
    code: 'HOS-02',
    name: 'Hosur Branch',
    isMainShop: false,
    address: '42 SIPCOT Phase-1 Ring Road, Hosur, TN - 635126',
    phone: '+91 98432 11223',
    assignedUserId: 'user-kumar',
    assignedUserName: 'Kumar',
    status: 'Active',
    createdAt: '2026-08-05T10:00:00.000Z'
  },
  {
    id: 'branch-3',
    code: 'KRI-03',
    name: 'Krishnagiri Branch',
    isMainShop: false,
    address: '18 Rayakottai Main Highway, Krishnagiri, TN - 635002',
    phone: '+91 97891 33445',
    assignedUserId: 'user-ravi',
    assignedUserName: 'Ravi',
    status: 'Active',
    createdAt: '2026-08-08T11:00:00.000Z'
  },
  {
    id: 'branch-4',
    code: 'DHA-04',
    name: 'Dharmapuri Branch',
    isMainShop: false,
    address: '77 Pennagaram Road, Dharmapuri Collectorate Opp, TN - 636701',
    phone: '+91 94433 55667',
    assignedUserId: 'user-selvam',
    assignedUserName: 'Selvam',
    status: 'Active',
    createdAt: '2026-08-10T12:00:00.000Z'
  },
  {
    id: 'branch-5',
    code: 'SLM-05',
    name: 'Salem Branch',
    isMainShop: false,
    address: '15 Omalur Main Road, Junction Area, Salem, TN - 636005',
    phone: '+91 98944 77889',
    assignedUserId: 'user-murugan',
    assignedUserName: 'Murugan',
    status: 'Active',
    createdAt: '2026-08-12T14:00:00.000Z'
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Admin Central',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    branchId: 'branch-1',
    branchName: 'Main HQ Shop (Admin)',
    phone: '+91 94421 88901',
    status: 'Active'
  },
  {
    id: 'user-kumar',
    name: 'Kumar',
    username: 'kumar',
    password: 'shop123',
    role: 'shop_user',
    branchId: 'branch-2',
    branchName: 'Hosur Branch',
    phone: '+91 98432 11223',
    status: 'Active'
  },
  {
    id: 'user-ravi',
    name: 'Ravi',
    username: 'ravi',
    password: 'shop123',
    role: 'shop_user',
    branchId: 'branch-3',
    branchName: 'Krishnagiri Branch',
    phone: '+91 97891 33445',
    status: 'Active'
  },
  {
    id: 'user-selvam',
    name: 'Selvam',
    username: 'selvam',
    password: 'shop123',
    role: 'shop_user',
    branchId: 'branch-4',
    branchName: 'Dharmapuri Branch',
    phone: '+91 94433 55667',
    status: 'Active'
  },
  {
    id: 'user-murugan',
    name: 'Murugan',
    username: 'murugan',
    password: 'shop123',
    role: 'shop_user',
    branchId: 'branch-5',
    branchName: 'Salem Branch',
    phone: '+91 98944 77889',
    status: 'Active'
  }
];

export const INITIAL_PRODUCTS = [
  // Summons
  {
    id: 'prod-sum-01',
    name: 'Summon Variety Super-A',
    sku: 'SUM-001',
    category: 'Summons',
    brand: 'GreenAgro Agro Seeds',
    variety: 'Hybrid Super A Fodder',
    unit: 'Bundle',
    purchasePrice: 420,
    sellingPrice: 580,
    minStock: 25,
    status: 'Active',
    description: 'High-yield drought-tolerant nutritious green summon bundle'
  },
  {
    id: 'prod-sum-02',
    name: 'Summon Variety B-Gold',
    sku: 'SUM-002',
    category: 'Summons',
    brand: 'GreenAgro Agro Seeds',
    variety: 'Gold Supreme Variety',
    unit: 'Bundle',
    purchasePrice: 380,
    sellingPrice: 520,
    minStock: 20,
    status: 'Active',
    description: 'Fast-growing high protein green summon fodder grass'
  },
  {
    id: 'prod-sum-03',
    name: 'Dry Fodder Summon Prime',
    sku: 'SUM-003',
    category: 'Summons',
    brand: 'Kisan Gold',
    variety: 'Dry Sun-Cured Bales',
    unit: 'Bundle',
    purchasePrice: 260,
    sellingPrice: 360,
    minStock: 30,
    status: 'Active',
    description: 'Crisp sun-cured dry summon fodder enriched with minerals'
  },
  {
    id: 'prod-sum-04',
    name: 'Hybrid Green Summon Mini',
    sku: 'SUM-004',
    category: 'Summons',
    brand: 'AgriStar Seeds',
    variety: 'Compact Hybrid Cut',
    unit: 'Bundle',
    purchasePrice: 190,
    sellingPrice: 270,
    minStock: 20,
    status: 'Active',
    description: 'Fresh chopped succulent summon grass for dairy cattle'
  },

  // Feeds
  {
    id: 'prod-feed-01',
    name: 'Dairy Cattle Feed 50KG (Standard)',
    sku: 'FED-001',
    category: 'Feeds',
    brand: 'MilkoMax Feeds',
    variety: '22% Protein Pellet',
    unit: 'Bag (50KG)',
    purchasePrice: 1350,
    sellingPrice: 1650,
    minStock: 30,
    status: 'Active',
    description: 'Balanced dairy feed enriched with bypass protein and minerals'
  },
  {
    id: 'prod-feed-02',
    name: 'High Milk Booster Feed 50KG',
    sku: 'FED-002',
    category: 'Feeds',
    brand: 'MilkoMax Feeds',
    variety: '26% High Yield Pellet',
    unit: 'Bag (50KG)',
    purchasePrice: 1550,
    sellingPrice: 1900,
    minStock: 25,
    status: 'Active',
    description: 'High energy feed for peak lactation dairy cows yielding 15L+'
  },
  {
    id: 'prod-feed-03',
    name: 'Calf Starter Pellet 25KG',
    sku: 'FED-003',
    category: 'Feeds',
    brand: 'NutriCalf',
    variety: 'Micro Pellets',
    unit: 'Bag (25KG)',
    purchasePrice: 850,
    sellingPrice: 1100,
    minStock: 15,
    status: 'Active',
    description: 'Special starter feed formulation for calves 1-6 months'
  },
  {
    id: 'prod-feed-04',
    name: 'Buffalo Special Rich Feed 50KG',
    sku: 'FED-004',
    category: 'Feeds',
    brand: 'MilkoMax Feeds',
    variety: 'Fat Boost Pellet',
    unit: 'Bag (50KG)',
    purchasePrice: 1420,
    sellingPrice: 1750,
    minStock: 20,
    status: 'Active',
    description: 'Custom formulation to enhance milk fat percentage (SNF) in buffaloes'
  },
  {
    id: 'prod-feed-05',
    name: 'Poultry Layer Mash 50KG',
    sku: 'FED-005',
    category: 'Feeds',
    brand: 'EggPro Feeds',
    variety: 'Layer Phase-1 Mash',
    unit: 'Bag (50KG)',
    purchasePrice: 1200,
    sellingPrice: 1480,
    minStock: 15,
    status: 'Active',
    description: 'High calcium and amino acid mash for egg-laying commercial poultry'
  },

  // Silage
  {
    id: 'prod-sil-01',
    name: 'Premium Maize Corn Silage (500KG Bale)',
    sku: 'SIL-001',
    category: 'Silage',
    brand: 'AgriSilage Corp',
    variety: 'Sweet Corn Vacuum Bale',
    unit: 'Bale (500KG)',
    purchasePrice: 3200,
    sellingPrice: 4200,
    minStock: 10,
    status: 'Active',
    description: 'Fermented whole plant corn silage in UV-protected airtight wrapped bales'
  },
  {
    id: 'prod-sil-02',
    name: 'Packed Sweet Corn Silage (50KG Bag)',
    sku: 'SIL-002',
    category: 'Silage',
    brand: 'AgriSilage Corp',
    variety: 'Multi-layer Packed Silage',
    unit: 'Bag (50KG)',
    purchasePrice: 380,
    sellingPrice: 520,
    minStock: 40,
    status: 'Active',
    description: 'Convenient 50KG vacuum bagged fermented silage ready for immediate feeding'
  },
  {
    id: 'prod-sil-03',
    name: 'Sorghum & Maize Mixed Silage (50KG)',
    sku: 'SIL-003',
    category: 'Silage',
    brand: 'FodderPlus',
    variety: 'Sorghum Blend Ferment',
    unit: 'Bag (50KG)',
    purchasePrice: 340,
    sellingPrice: 470,
    minStock: 30,
    status: 'Active',
    description: 'High digestible fiber silage blend of sorghum fodder and yellow maize'
  },
  {
    id: 'prod-sil-04',
    name: 'Sugar Beet Pulp Silage (50KG Bag)',
    sku: 'SIL-004',
    category: 'Silage',
    brand: 'FodderPlus',
    variety: 'Beet Enriched Bag',
    unit: 'Bag (50KG)',
    purchasePrice: 410,
    sellingPrice: 560,
    minStock: 15,
    status: 'Active',
    description: 'Palatable energy-dense silage enriched with sugar beet pulp'
  }
];

// Initial Central Inventory Stock
export const INITIAL_CENTRAL_INVENTORY = [
  { productId: 'prod-sum-01', quantity: 500, updatedAt: '2026-08-20T08:30:00.000Z' },
  { productId: 'prod-sum-02', quantity: 320, updatedAt: '2026-08-20T08:30:00.000Z' },
  { productId: 'prod-sum-03', quantity: 240, updatedAt: '2026-08-20T08:30:00.000Z' },
  { productId: 'prod-sum-04', quantity: 180, updatedAt: '2026-08-20T08:30:00.000Z' },
  { productId: 'prod-feed-01', quantity: 450, updatedAt: '2026-08-21T09:00:00.000Z' },
  { productId: 'prod-feed-02', quantity: 380, updatedAt: '2026-08-21T09:00:00.000Z' },
  { productId: 'prod-feed-03', quantity: 160, updatedAt: '2026-08-21T09:00:00.000Z' },
  { productId: 'prod-feed-04', quantity: 290, updatedAt: '2026-08-21T09:00:00.000Z' },
  { productId: 'prod-feed-05', quantity: 200, updatedAt: '2026-08-21T09:00:00.000Z' },
  { productId: 'prod-sil-01', quantity: 85, updatedAt: '2026-08-22T10:00:00.000Z' },
  { productId: 'prod-sil-02', quantity: 600, updatedAt: '2026-08-22T10:00:00.000Z' },
  { productId: 'prod-sil-03', quantity: 420, updatedAt: '2026-08-22T10:00:00.000Z' },
  { productId: 'prod-sil-04', quantity: 150, updatedAt: '2026-08-22T10:00:00.000Z' }
];

// Initial Branch Inventories (Automatically populated via transfers)
export const INITIAL_BRANCH_INVENTORY = [
  // Shop 1: Admin Main HQ Shop
  { id: 'bi-1-01', branchId: 'branch-1', productId: 'prod-sum-01', quantity: 80, updatedAt: '2026-08-24T10:00:00.000Z' },
  { id: 'bi-1-02', branchId: 'branch-1', productId: 'prod-sum-02', quantity: 60, updatedAt: '2026-08-24T10:00:00.000Z' },
  { id: 'bi-1-03', branchId: 'branch-1', productId: 'prod-feed-01', quantity: 110, updatedAt: '2026-08-24T10:00:00.000Z' },
  { id: 'bi-1-04', branchId: 'branch-1', productId: 'prod-feed-02', quantity: 75, updatedAt: '2026-08-24T10:00:00.000Z' },
  { id: 'bi-1-05', branchId: 'branch-1', productId: 'prod-sil-02', quantity: 120, updatedAt: '2026-08-24T10:00:00.000Z' },

  // Shop 2: Hosur Branch
  { id: 'bi-2-01', branchId: 'branch-2', productId: 'prod-feed-01', quantity: 95, updatedAt: '2026-08-25T11:00:00.000Z' },
  { id: 'bi-2-02', branchId: 'branch-2', productId: 'prod-feed-02', quantity: 15, updatedAt: '2026-08-25T11:00:00.000Z' }, // Low stock sample
  { id: 'bi-2-03', branchId: 'branch-2', productId: 'prod-sum-01', quantity: 45, updatedAt: '2026-08-25T11:00:00.000Z' },
  { id: 'bi-2-04', branchId: 'branch-2', productId: 'prod-sil-01', quantity: 0, updatedAt: '2026-08-25T11:00:00.000Z' }, // Out of stock sample
  { id: 'bi-2-05', branchId: 'branch-2', productId: 'prod-sil-02', quantity: 80, updatedAt: '2026-08-25T11:00:00.000Z' },

  // Shop 3: Krishnagiri Branch
  { id: 'bi-3-01', branchId: 'branch-3', productId: 'prod-feed-01', quantity: 60, updatedAt: '2026-08-25T14:00:00.000Z' },
  { id: 'bi-3-02', branchId: 'branch-3', productId: 'prod-feed-04', quantity: 50, updatedAt: '2026-08-25T14:00:00.000Z' },
  { id: 'bi-3-03', branchId: 'branch-3', productId: 'prod-sum-02', quantity: 12, updatedAt: '2026-08-25T14:00:00.000Z' }, // Low stock
  { id: 'bi-3-04', branchId: 'branch-3', productId: 'prod-sil-02', quantity: 70, updatedAt: '2026-08-25T14:00:00.000Z' },

  // Shop 4: Dharmapuri Branch
  { id: 'bi-4-01', branchId: 'branch-4', productId: 'prod-feed-01', quantity: 75, updatedAt: '2026-08-26T09:30:00.000Z' },
  { id: 'bi-4-02', branchId: 'branch-4', productId: 'prod-feed-03', quantity: 30, updatedAt: '2026-08-26T09:30:00.000Z' },
  { id: 'bi-4-03', branchId: 'branch-4', productId: 'prod-sil-03', quantity: 40, updatedAt: '2026-08-26T09:30:00.000Z' },

  // Shop 5: Salem Branch
  { id: 'bi-5-01', branchId: 'branch-5', productId: 'prod-feed-01', quantity: 85, updatedAt: '2026-08-26T15:00:00.000Z' },
  { id: 'bi-5-02', branchId: 'branch-5', productId: 'prod-feed-02', quantity: 45, updatedAt: '2026-08-26T15:00:00.000Z' },
  { id: 'bi-5-03', branchId: 'branch-5', productId: 'prod-sil-02', quantity: 90, updatedAt: '2026-08-26T15:00:00.000Z' },
  { id: 'bi-5-04', branchId: 'branch-5', productId: 'prod-sum-01', quantity: 35, updatedAt: '2026-08-26T15:00:00.000Z' }
];

export const INITIAL_TRANSFERS = [
  {
    id: 'tr-001',
    transferNumber: 'TR-2026-001',
    fromLocation: 'Central Inventory',
    toBranchId: 'branch-1',
    toBranchName: 'Main HQ Shop (Admin)',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    productSku: 'FED-001',
    category: 'Feeds',
    quantity: 110,
    unit: 'Bag (50KG)',
    status: 'Completed',
    date: '2026-08-24',
    time: '10:00 AM',
    notes: 'Initial stock allotment for HQ Shop counter',
    transferredBy: 'Admin Central'
  },
  {
    id: 'tr-002',
    transferNumber: 'TR-2026-002',
    fromLocation: 'Central Inventory',
    toBranchId: 'branch-2',
    toBranchName: 'Hosur Branch',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    productSku: 'FED-001',
    category: 'Feeds',
    quantity: 100,
    unit: 'Bag (50KG)',
    status: 'Completed',
    date: '2026-08-25',
    time: '11:00 AM',
    notes: 'Dispatched via truck TN-24-AK-4455',
    transferredBy: 'Admin Central'
  },
  {
    id: 'tr-003',
    transferNumber: 'TR-2026-003',
    fromLocation: 'Central Inventory',
    toBranchId: 'branch-2',
    toBranchName: 'Hosur Branch',
    productId: 'prod-sum-01',
    productName: 'Summon Variety Super-A',
    productSku: 'SUM-001',
    category: 'Summons',
    quantity: 50,
    unit: 'Bundle',
    status: 'Completed',
    date: '2026-08-25',
    time: '11:15 AM',
    notes: 'Weekly fresh grass bundle transfer',
    transferredBy: 'Admin Central'
  },
  {
    id: 'tr-004',
    transferNumber: 'TR-2026-004',
    fromLocation: 'Central Inventory',
    toBranchId: 'branch-3',
    toBranchName: 'Krishnagiri Branch',
    productId: 'prod-sil-02',
    productName: 'Packed Sweet Corn Silage (50KG Bag)',
    productSku: 'SIL-002',
    category: 'Silage',
    quantity: 75,
    unit: 'Bag (50KG)',
    status: 'Completed',
    date: '2026-08-25',
    time: '02:30 PM',
    notes: 'Silage supply for dairy farmers cluster',
    transferredBy: 'Admin Central'
  },
  {
    id: 'tr-005',
    transferNumber: 'TR-2026-005',
    fromLocation: 'Central Inventory',
    toBranchId: 'branch-5',
    toBranchName: 'Salem Branch',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    productSku: 'FED-001',
    category: 'Feeds',
    quantity: 90,
    unit: 'Bag (50KG)',
    status: 'Completed',
    date: '2026-08-26',
    time: '03:45 PM',
    notes: 'Monthly starter batch for Salem retail hub',
    transferredBy: 'Admin Central'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-01',
    name: 'Perumal Gounder Dairy Farm',
    phone: '+91 98421 66554',
    email: 'perumal.dairy@gmail.com',
    address: 'Survey 14, Bagalur Road, Hosur',
    branchId: 'branch-2',
    branchName: 'Hosur Branch',
    totalSpent: 41250,
    orderCount: 4,
    balance: 0
  },
  {
    id: 'cust-02',
    name: 'Kaveri Milk Producers Society',
    phone: '+91 97882 11447',
    email: 'kaveri.dairy@coop.in',
    address: 'Main Bazaar, Krishnagiri',
    branchId: 'branch-3',
    branchName: 'Krishnagiri Branch',
    totalSpent: 33000,
    orderCount: 3,
    balance: 2500
  },
  {
    id: 'cust-03',
    name: 'Murugesan Agro Cattle Farm',
    phone: '+91 94432 99881',
    email: 'murugesan.cattle@yahoo.com',
    address: 'Near Old Bus Stand, Dharmapuri',
    branchId: 'branch-4',
    branchName: 'Dharmapuri Branch',
    totalSpent: 28500,
    orderCount: 3,
    balance: 0
  },
  {
    id: 'cust-04',
    name: 'Balaji Dairy & Breeding Center',
    phone: '+91 99441 55223',
    email: 'balaji.dairy@gmail.com',
    address: 'Omalur Highway, Salem',
    branchId: 'branch-5',
    branchName: 'Salem Branch',
    totalSpent: 52000,
    orderCount: 5,
    balance: 0
  },
  {
    id: 'cust-05',
    name: 'Walk-in Retail Customer',
    phone: '+91 90000 00000',
    email: '',
    address: 'Counter Direct Sale',
    branchId: 'branch-1',
    branchName: 'Main HQ Shop (Admin)',
    totalSpent: 12500,
    orderCount: 3,
    balance: 0
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'sup-01',
    name: 'MilkoMax Feed Mills Pvt Ltd',
    contactPerson: 'Mr. S. Ramanathan',
    phone: '+91 98422 77112',
    email: 'sales@milkomaxfeeds.com',
    address: 'Industrial Estate, Erode, TN - 638052',
    productsSupplied: ['Dairy Cattle Feed 50KG', 'High Milk Booster Feed 50KG'],
    totalPurchased: 450000
  },
  {
    id: 'sup-02',
    name: 'AgriSilage Technologies Ltd',
    contactPerson: 'K. Venkatesh',
    phone: '+91 94431 88229',
    email: 'orders@agrisilage.in',
    address: 'Coimbatore Agri Park, TN - 641014',
    productsSupplied: ['Corn Silage 500KG Bale', 'Sweet Corn Silage 50KG'],
    totalPurchased: 380000
  },
  {
    id: 'sup-03',
    name: 'GreenAgro Fodder Seed Farms',
    contactPerson: 'D. Anbarasan',
    phone: '+91 97890 44331',
    email: 'greenagro.seeds@gmail.com',
    address: 'Theni Fodder Zone, TN - 625531',
    productsSupplied: ['Summon Variety Super-A', 'Summon Variety B-Gold'],
    totalPurchased: 210000
  }
];

export const INITIAL_SALES = [
  {
    id: 'sale-001',
    invoiceNumber: 'INV-HOS-001',
    branchId: 'branch-2',
    branchName: 'Hosur Branch',
    customerId: 'cust-01',
    customerName: 'Perumal Gounder Dairy Farm',
    customerPhone: '+91 98421 66554',
    items: [
      {
        productId: 'prod-feed-01',
        name: 'Dairy Cattle Feed 50KG (Standard)',
        sku: 'FED-001',
        unit: 'Bag (50KG)',
        quantity: 5,
        unitPrice: 1650,
        discount: 0,
        total: 8250
      },
      {
        productId: 'prod-sum-01',
        name: 'Summon Variety Super-A',
        sku: 'SUM-001',
        unit: 'Bundle',
        quantity: 5,
        unitPrice: 580,
        discount: 100,
        total: 2800
      }
    ],
    subtotal: 11150,
    totalDiscount: 100,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 11050,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    date: '2026-08-28',
    time: '11:30 AM',
    notes: 'Delivered at Hosur farm gate',
    createdBy: 'Kumar'
  },
  {
    id: 'sale-002',
    invoiceNumber: 'INV-HQ-001',
    branchId: 'branch-1',
    branchName: 'Main HQ Shop (Admin)',
    customerId: 'cust-05',
    customerName: 'Walk-in Retail Customer',
    customerPhone: '+91 90000 00000',
    items: [
      {
        productId: 'prod-feed-02',
        name: 'High Milk Booster Feed 50KG',
        sku: 'FED-002',
        unit: 'Bag (50KG)',
        quantity: 3,
        unitPrice: 1900,
        discount: 0,
        total: 5700
      }
    ],
    subtotal: 5700,
    totalDiscount: 0,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 5700,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    date: '2026-08-28',
    time: '01:15 PM',
    notes: 'Counter retail sale',
    createdBy: 'Admin Central'
  },
  {
    id: 'sale-003',
    invoiceNumber: 'INV-SLM-001',
    branchId: 'branch-5',
    branchName: 'Salem Branch',
    customerId: 'cust-04',
    customerName: 'Balaji Dairy & Breeding Center',
    customerPhone: '+91 99441 55223',
    items: [
      {
        productId: 'prod-sil-02',
        name: 'Packed Sweet Corn Silage (50KG Bag)',
        sku: 'SIL-002',
        unit: 'Bag (50KG)',
        quantity: 10,
        unitPrice: 520,
        discount: 200,
        total: 5000
      },
      {
        productId: 'prod-feed-01',
        name: 'Dairy Cattle Feed 50KG (Standard)',
        sku: 'FED-001',
        unit: 'Bag (50KG)',
        quantity: 5,
        unitPrice: 1650,
        discount: 0,
        total: 8250
      }
    ],
    subtotal: 13450,
    totalDiscount: 200,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 13250,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    date: '2026-08-28',
    time: '03:20 PM',
    notes: 'Direct farm shipment',
    createdBy: 'Murugan'
  }
];

export const INITIAL_STOCK_TRANSACTIONS = [
  {
    id: 'tx-001',
    type: 'CENTRAL_ADD',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    branchId: null,
    branchName: 'Central Inventory',
    quantityChange: 500,
    previousStock: 0,
    newStock: 500,
    referenceId: 'PO-2026-001',
    date: '2026-08-20',
    time: '09:00 AM',
    notes: 'Initial bulk inventory intake from MilkoMax Mills',
    createdBy: 'Admin Central'
  },
  {
    id: 'tx-002',
    type: 'TRANSFER_OUT',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    branchId: null,
    branchName: 'Central Inventory',
    quantityChange: -110,
    previousStock: 500,
    newStock: 390,
    referenceId: 'TR-2026-001',
    date: '2026-08-24',
    time: '10:00 AM',
    notes: 'Stock transfer dispatched to Main HQ Shop (Admin)',
    createdBy: 'Admin Central'
  },
  {
    id: 'tx-003',
    type: 'TRANSFER_IN',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    branchId: 'branch-1',
    branchName: 'Main HQ Shop (Admin)',
    quantityChange: 110,
    previousStock: 0,
    newStock: 110,
    referenceId: 'TR-2026-001',
    date: '2026-08-24',
    time: '10:00 AM',
    notes: 'Stock received from Central Inventory',
    createdBy: 'Admin Central'
  },
  {
    id: 'tx-004',
    type: 'TRANSFER_OUT',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    branchId: null,
    branchName: 'Central Inventory',
    quantityChange: -100,
    previousStock: 390,
    newStock: 290,
    referenceId: 'TR-2026-002',
    date: '2026-08-25',
    time: '11:00 AM',
    notes: 'Stock transfer dispatched to Hosur Branch',
    createdBy: 'Admin Central'
  },
  {
    id: 'tx-005',
    type: 'TRANSFER_IN',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    branchId: 'branch-2',
    branchName: 'Hosur Branch',
    quantityChange: 100,
    previousStock: 0,
    newStock: 100,
    referenceId: 'TR-2026-002',
    date: '2026-08-25',
    time: '11:00 AM',
    notes: 'Stock received from Central Inventory',
    createdBy: 'Admin Central'
  },
  {
    id: 'tx-006',
    type: 'SALE',
    productId: 'prod-feed-01',
    productName: 'Dairy Cattle Feed 50KG (Standard)',
    branchId: 'branch-2',
    branchName: 'Hosur Branch',
    quantityChange: -5,
    previousStock: 100,
    newStock: 95,
    referenceId: 'INV-HOS-001',
    date: '2026-08-28',
    time: '11:30 AM',
    notes: 'Sale to Perumal Gounder Dairy Farm',
    createdBy: 'Kumar'
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-001',
    userId: 'user-admin',
    userName: 'Admin Central',
    role: 'admin',
    action: 'Central Stock Intake',
    branchName: 'Central Inventory',
    date: '2026-08-20',
    time: '09:00 AM',
    reference: 'PO-2026-001',
    details: 'Admin added 500 units of Dairy Cattle Feed 50KG to Central Inventory.'
  },
  {
    id: 'act-002',
    userId: 'user-admin',
    userName: 'Admin Central',
    role: 'admin',
    action: 'Stock Transfer',
    branchName: 'Main HQ Shop (Admin)',
    date: '2026-08-24',
    time: '10:00 AM',
    reference: 'TR-2026-001',
    details: 'Admin transferred 110 units of Dairy Cattle Feed 50KG to Main HQ Shop (Admin).'
  },
  {
    id: 'act-003',
    userId: 'user-admin',
    userName: 'Admin Central',
    role: 'admin',
    action: 'Stock Transfer',
    branchName: 'Hosur Branch',
    date: '2026-08-25',
    time: '11:00 AM',
    reference: 'TR-2026-002',
    details: 'Admin transferred 100 units of Dairy Cattle Feed 50KG to Hosur Branch.'
  },
  {
    id: 'act-004',
    userId: 'user-kumar',
    userName: 'Kumar',
    role: 'shop_user',
    action: 'Invoice Created',
    branchName: 'Hosur Branch',
    date: '2026-08-28',
    time: '11:30 AM',
    reference: 'INV-HOS-001',
    details: 'Kumar sold 5 units of Feed & 5 units of Summon for ₹11,050 to Perumal Gounder.'
  },
  {
    id: 'act-005',
    userId: 'user-admin',
    userName: 'Admin Central',
    role: 'admin',
    action: 'Invoice Created',
    branchName: 'Main HQ Shop (Admin)',
    date: '2026-08-28',
    time: '01:15 PM',
    reference: 'INV-HQ-001',
    details: 'Admin created Invoice INV-HQ-001 for ₹5,700 at Main HQ counter.'
  }
];

export const INITIAL_SETTINGS = {
  businessName: 'AgroFeeds & Silage Central Hub',
  tagline: 'Premium Dairy Cattle Feeds, Silage & High-Yield Fodder Grass',
  gstin: '33AABCU9603R1ZM',
  phone: '+91 94421 88900 / +91 94421 88901',
  email: 'central@agrofeedshub.com',
  address: 'Central Warehouse & Logistics Park, Rayakottai Road, Krishnagiri, Tamil Nadu - 635001',
  currencySymbol: '₹',
  currencyCode: 'INR',
  invoicePrefix: 'INV-',
  transferPrefix: 'TR-',
  termsAndConditions: '1. Goods once sold are not returnable.\n2. Please inspect feed quality and vacuum seal of silage bags upon delivery.\n3. Keep cattle feeds in a dry and moisture-free area.\n4. Thank you for your business!',
  lowStockThresholdDefault: 20
};
