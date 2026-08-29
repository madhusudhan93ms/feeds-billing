import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Store,
  Package,
  Search,
  AlertTriangle,
  ChevronDown,
  Building2,
  PlusCircle,
  User,
  Phone,
  CreditCard,
  QrCode,
  Banknote,
  FileText,
  Clock,
  Sparkles,
  Tag,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from './InvoiceModal';

export const PointOfSale = () => {
  const { products, createBill, showToast, settings, isLowStock } = useApp();

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Cart & Customer Details
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState('0');

  // Form State for Dropdown Search & Add
  const [selectedProductId, setSelectedProductId] = useState('');
  const [formQty, setFormQty] = useState('1');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal State
  const [createdInvoice, setCreatedInvoice] = useState(null);

  const currency = settings.currency || '₹';

  // Categories
  const categories = useMemo(() => {
    const set = new Set(['All']);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered Products for Catalog & Dropdown
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const selectedProductObj = products.find((p) => p.id === selectedProductId);

  // Low stock products in store (<20%)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => {
      const stock = Number(p.stock) || 0;
      return stock > 0 && isLowStock(p);
    });
  }, [products, isLowStock]);

  // Add Item to Cart
  const handleAddItemToCart = (product, quantityToAdd = 1) => {
    if (!product) return;
    const currentStock = Number(product.stock) || 0;

    if (currentStock <= 0) {
      showToast(`"${product.name}" is OUT OF STOCK!`, 'error');
      return;
    }

    const qty = Number(quantityToAdd) || 1;

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > currentStock) {
          showToast(`Cannot add ${qty} more! Only ${currentStock} units in stock.`, 'error');
          return prev;
        }
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: newQty, total: newQty * i.unitPrice }
            : i
        );
      } else {
        if (qty > currentStock) {
          showToast(`Only ${currentStock} units available in stock!`, 'error');
          return prev;
        }
        return [
          ...prev,
          {
            productId: product.id,
            sku: product.sku || 'SKU',
            name: product.name,
            unit: product.unit || 'Bags',
            unitPrice: Number(product.price),
            quantity: qty,
            maxStock: currentStock,
            total: qty * Number(product.price)
          }
        ];
      }
    });

    // Reset Dropdown
    setSelectedProductId('');
    setFormQty('1');
    setIsDropdownOpen(false);
  };

  // Submit from Dropdown Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductObj) {
      showToast('Please select a product from the dropdown!', 'error');
      return;
    }
    handleAddItemToCart(selectedProductObj, Number(formQty) || 1);
  };

  // Quantity adjustments (+ / -)
  const updateQty = (productId, delta) => {
    const prod = products.find((p) => p.id === productId);
    const currentStock = Number(prod?.stock) || 0;

    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > currentStock) {
              showToast(`Only ${currentStock} units in stock!`, 'error');
              return item;
            }
            return {
              ...item,
              quantity: nextQty,
              total: nextQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNotes('');
    setDiscountAmount('0');
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discount = Math.min(Number(discountAmount) || 0, subtotal);
  const grandTotal = Math.max(0, subtotal - discount);

  // Complete Sale
  const handleCompleteSale = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Cart is empty. Please select products first!', 'error');
      return;
    }

    const saleData = {
      cashierName: 'Billing Staff',
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim(),
      paymentMethod,
      notes: orderNotes.trim(),
      items: cart,
      subtotal,
      discount,
      grandTotal
    };

    const newSale = createBill(saleData);
    setCreatedInvoice(newSale);
    clearCart();
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TOP STORE POS HEADER (MOBILE-FIRST) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="h-11 sm:h-12 w-11 sm:w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl font-black shadow-md shrink-0">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                Store Billing Counter
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-200">
                POS Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live Stock Deduction &bull; Instant Bill Generation &bull; Admin Notified in Real Time
            </p>
          </div>
        </div>

        {/* Low Stock Counter Badge */}
        {lowStockProducts.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-black animate-pulse self-start sm:self-auto">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
            <span>{lowStockProducts.length} Item(s) in Low Stock (&lt;20%)</span>
          </div>
        )}

      </div>

      {/* 2. MAIN 2-COLUMN BILLING WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PRODUCT SEARCH, DROPDOWN FORM & CATALOG (7 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* A. PRODUCT DROPDOWN & SEARCH FORM */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Search className="h-4 w-4 text-blue-600" />
              <span>Step 1: Select Product & Add to Cart</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              
              {/* Searchable Dropdown Input (7 Cols) */}
              <div className="sm:col-span-7 relative">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Product Dropdown (Search or Select):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedProductObj ? selectedProductObj.name : searchTerm}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSelectedProductId('');
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Search or pick product..."
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  <ChevronDown
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer"
                  />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95">
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 font-bold">
                        No matching products found
                      </div>
                    ) : (
                      filteredProducts.map((p) => {
                        const stock = Number(p.stock) || 0;
                        const isOut = stock <= 0;
                        const lowWarn = isLowStock(p);

                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              if (!isOut) {
                                setSelectedProductId(p.id);
                                setSearchTerm(p.name);
                                setIsDropdownOpen(false);
                              }
                            }}
                            className={`p-3 text-left transition-colors flex items-center justify-between cursor-pointer ${
                              isOut
                                ? 'bg-slate-50 opacity-40 cursor-not-allowed'
                                : selectedProductId === p.id
                                ? 'bg-blue-50 text-blue-900 font-bold'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <p className="font-black text-xs sm:text-sm text-slate-900">{p.name}</p>
                              <p className="text-[11px] text-slate-500 font-bold">
                                {currency}{Number(p.price).toLocaleString()} &bull; {p.category || 'Feed'}
                              </p>
                            </div>

                            <div>
                              {isOut ? (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-md">
                                  Out of Stock
                                </span>
                              ) : lowWarn ? (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black rounded-md flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-amber-700" />
                                  <span>{stock} left (&lt;20%)</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-md">
                                  {stock} in Stock
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Quantity Input (2 Cols) */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Qty:
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProductObj ? Number(selectedProductObj.stock) || 1 : 999}
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-full px-2 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-center focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Add Button (3 Cols) */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={!selectedProductObj}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                    !selectedProductObj
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </form>
          </div>

          {/* B. CATEGORY FILTER TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* C. INTERACTIVE PRODUCT TILES CATALOG */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Or Tap Any Item Below:
              </span>
              <span className="text-xs font-bold text-slate-400">
                {filteredProducts.length} Items in Store
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Package className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p className="text-base font-bold text-slate-700">No products in inventory</p>
                <p className="text-xs text-slate-400 mt-1">
                  Please open <strong>"Admin Portal"</strong> to add items to store stock.
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-bold">
                No items match your search filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {filteredProducts.map((prod) => {
                  const stock = Number(prod.stock) || 0;
                  const isOut = stock <= 0;
                  const lowWarn = isLowStock(prod);
                  const inCartItem = cart.find((i) => i.productId === prod.id);

                  return (
                    <button
                      key={prod.id}
                      type="button"
                      disabled={isOut}
                      onClick={() => handleAddItemToCart(prod, 1)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isOut
                          ? 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed'
                          : lowWarn
                          ? 'bg-amber-50/60 border-amber-300 hover:border-amber-500 shadow-xs'
                          : inCartItem
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                          : 'bg-white border-slate-200/90 hover:border-emerald-500 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-black text-sm text-slate-900 leading-snug">
                            {prod.name}
                          </span>

                          {/* Stock Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 flex items-center gap-1 ${
                              isOut
                                ? 'bg-rose-100 text-rose-800'
                                : lowWarn
                                ? 'bg-amber-100 text-amber-950 border border-amber-400 animate-pulse'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {isOut ? (
                              'Out of Stock'
                            ) : lowWarn ? (
                              <>
                                <AlertTriangle className="h-3 w-3 text-amber-800" />
                                <span>{stock} Left (&lt;20%)</span>
                              </>
                            ) : (
                              `${stock} in Stock`
                            )}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {prod.category || 'Feed'} &bull; {prod.sku || 'SKU'}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                        <span className="text-base font-black text-slate-900">
                          {currency}{Number(prod.price).toLocaleString()}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                            isOut
                              ? 'bg-slate-200 text-slate-400'
                              : inCartItem
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {inCartItem ? `Added (${inCartItem.quantity})` : '➕ Add'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ACTIVE CART & CUSTOMER DETAILS (5 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-md flex flex-col justify-between sticky top-20">
          
          <div className="space-y-4">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-none">
                    Current Bill ({cart.length} items)
                  </h3>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Step 2: Customer Details Form */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-blue-600" />
                <span>Step 2: Customer Details & Payment</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Customer Name:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in Customer"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g., 9876543210"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Payment Method:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'Cash', label: 'Cash', icon: Banknote },
                    { id: 'UPI', label: 'UPI/QR', icon: QrCode },
                    { id: 'Card', label: 'Card', icon: CreditCard },
                    { id: 'Credit', label: 'Due', icon: FileText }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`py-1.5 px-1 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Cart Line Items */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  Cart is empty. Select items from the left to begin.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs sm:text-sm text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        {currency}{item.unitPrice} &times; {item.quantity}
                      </p>
                    </div>

                    {/* Stepper +/- */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, -1)}
                        className="h-6 w-6 rounded-lg bg-white font-black text-slate-700 flex items-center justify-center hover:bg-slate-200 cursor-pointer shadow-2xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-6 text-center font-black text-xs text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, 1)}
                        className="h-6 w-6 rounded-lg bg-white font-black text-slate-700 flex items-center justify-center hover:bg-slate-200 cursor-pointer shadow-2xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="text-right min-w-[60px]">
                      <p className="font-black text-xs sm:text-sm text-slate-900">
                        {currency}{item.total.toLocaleString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

          {/* Step 3: Total & Checkout Button */}
          <div className="mt-4 pt-3 border-t-2 border-slate-100 space-y-3">
            
            {/* Subtotal & Total */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  Grand Total ({cart.length} items):
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  Paid via {paymentMethod}
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {currency}{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Giant Complete & Print Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-98'
              }`}
            >
              <Receipt className="h-5 w-5" />
              <span>💰 COMPLETE & PRINT TAX INVOICE</span>
            </button>

          </div>

        </div>

      </div>

      {/* PRINTABLE TAX INVOICE MODAL */}
      <InvoiceModal
        isOpen={!!createdInvoice}
        onClose={() => setCreatedInvoice(null)}
        sale={createdInvoice}
      />

    </div>
  );
};
