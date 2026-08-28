import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  CreditCard,
  Banknote,
  QrCode,
  FileCheck,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Printer
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StockStatusBadge } from '../common/StockStatusBadge';
import { InvoiceModal } from './InvoiceModal';

export const PointOfSale = ({ initialBranchId = null }) => {
  const { currentUser, isAdmin, branches } = useAuth();
  const { refreshKey, triggerRefresh, showToast, categories } = useApp();

  // Branch context: Shop user is locked to their branch; Admin can pick branch (defaulting to Shop 1 - Main HQ)
  const defaultBranchId = useMemo(() => {
    if (initialBranchId) return initialBranchId;
    if (!isAdmin && currentUser?.branchId) return currentUser.branchId;
    const mainShop = branches.find(b => b.isMainShop) || branches[0];
    return mainShop ? mainShop.id : 'branch-1';
  }, [initialBranchId, isAdmin, currentUser, branches]);

  const [selectedBranchId, setSelectedBranchId] = useState(defaultBranchId);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash, UPI, Card, Credit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Modal
  const [completedSale, setCompletedSale] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Get active branch inventory
  const branchInventory = useMemo(() => {
    if (!selectedBranchId) return [];
    return storageService.getBranchInventory(selectedBranchId);
  }, [selectedBranchId, refreshKey]);

  const activeBranch = useMemo(() => {
    return branches.find(b => b.id === selectedBranchId) || null;
  }, [branches, selectedBranchId]);

  // Filtered branch inventory
  const filteredProducts = useMemo(() => {
    return branchInventory.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [branchInventory, selectedCategory, searchQuery]);

  // Cart Handlers
  const addToCart = (product) => {
    if (product.quantity <= 0) {
      showToast(`"${product.name}" is out of stock in this branch!`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.productId);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          showToast(`Cannot add more than available stock (${product.quantity} ${product.unit})`, 'error');
          return prev;
        }
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.productId,
            name: product.name,
            sku: product.sku,
            unit: product.unit,
            unitPrice: product.sellingPrice,
            quantity: 1,
            maxStock: product.quantity,
            total: product.sellingPrice
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          if (qty > item.maxStock) {
            showToast(`Maximum available stock is ${item.maxStock} ${item.unit}`, 'error');
            return { ...item, quantity: item.maxStock, total: item.maxStock * item.unitPrice };
          }
          return { ...item, quantity: qty, total: qty * item.unitPrice };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const grandTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  }, [cart]);

  // Handle Checkout / Generate Bill
  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Please click on a product to add it to the bill first!', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const saleData = {
        branchId: selectedBranchId,
        customerName: customerName.trim() || 'Walk-in Customer',
        customerPhone: customerPhone.trim() || '',
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: 0
        })),
        totalDiscount: 0,
        taxRate: 0,
        paymentMethod,
        paymentStatus: 'Paid',
        notes: '',
        createdBy: currentUser?.name || (isAdmin ? 'Admin' : 'Shop Staff')
      };

      const newSale = storageService.createSale(saleData);

      triggerRefresh();
      setCompletedSale(newSale);
      setShowInvoiceModal(true);
      clearCart();
      showToast(`Bill generated: ${newSale.invoiceNumber}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm">
            POS
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Billing Terminal: <span className="text-emerald-700">{activeBranch?.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAdmin ? 'Admin Mode (Billing for selected shop)' : `Staff: ${currentUser?.name}`}
            </p>
          </div>
        </div>

        {/* If Admin, allow selecting which branch to bill for */}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-slate-600">Select Counter:</label>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setCart([]);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main POS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT: Product Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Search & Category Filter */}
          <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({branchInventory.length})
              </button>
              {categories.map((cat) => {
                const count = branchInventory.filter(i => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const inCart = cart.find(c => c.productId === product.productId);
                const isOutOfStock = product.quantity <= 0;

                return (
                  <div
                    key={product.id || product.productId}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {product.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          product.quantity === 0
                            ? 'bg-rose-100 text-rose-800'
                            : product.quantity <= product.minStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Stock: {product.quantity} {product.unit}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {product.sku}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <div className="text-base font-black text-slate-900">
                        ₹{product.sellingPrice.toLocaleString()}
                      </div>

                      <button
                        disabled={isOutOfStock}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          inCart
                            ? 'bg-emerald-600 text-white'
                            : isOutOfStock
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{inCart ? `Added (${inCart.quantity})` : '+ Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No stock available in this shop</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isAdmin
                    ? 'Use the "Transfer Stock to Shops" tab to dispatch stock from Central Warehouse.'
                    : 'Please contact Central Admin to transfer stock to your shop.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Active Bill & Checkout (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-5 space-y-4">
            
            {/* Bill Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Active Bill</h3>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Quick Customer & Payment Details */}
            <div className="space-y-2.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Payment Method Pills */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'Cash', label: 'Cash', icon: Banknote },
                    { id: 'UPI', label: 'UPI / GPay', icon: QrCode },
                    { id: 'Card', label: 'Card', icon: CreditCard }
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          paymentMethod === method.id
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cart Line Items */}
            <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                      <p className="text-[11px] text-slate-400">
                        ₹{item.unitPrice} × {item.quantity} = <strong className="text-slate-800">₹{item.total.toLocaleString()}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-6 w-6 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-6 text-center font-black text-xs text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="h-6 w-6 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center font-bold text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-slate-300 hover:text-rose-600 ml-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Cart is empty.<br/>Click on any product on the left to add it to the bill.
                </div>
              )}
            </div>

            {/* Total & Big Action Button */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Amount:</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>

              {/* BIG GREEN UNMISSABLE BUTTON */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                <span>{isSubmitting ? 'Generating Bill...' : `Complete Sale & Print Bill (₹${grandTotal.toLocaleString()})`}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Invoice Modal for preview & printing */}
      {showInvoiceModal && completedSale && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setCompletedSale(null);
          }}
          sale={completedSale}
        />
      )}

    </div>
  );
};
