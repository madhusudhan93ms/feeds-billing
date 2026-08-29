// Initial Data with Default Main Store and Dynamic Branches

export const INITIAL_BRANCHES = [
  {
    id: 'main',
    name: 'Main Branch (Main Store & Warehouse)',
    shortName: 'Main Store',
    isMain: true,
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    id: 'branch-1',
    name: 'Branch 1',
    shortName: 'Branch 1',
    isMain: false,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    id: 'branch-2',
    name: 'Branch 2',
    shortName: 'Branch 2',
    isMain: false,
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  }
];

export const INITIAL_PRODUCTS = [];
export const INITIAL_SALES = [];

export const INITIAL_SETTINGS = {
  businessName: 'Store Central & Branches',
  currency: '₹'
};
