import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  PackageCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const SuppliersPage = () => {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    productsSupplied: '',
    totalPurchased: 0
  });

  const suppliers = useMemo(() => {
    const list = storageService.getSuppliers();
    return list.filter(s =>
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [refreshKey, searchQuery]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      productsSupplied: '',
      totalPurchased: 0
    });
    setShowAddModal(true);
  };

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) throw new Error('Supplier name is required');
      storageService.addSupplier({
        ...formData,
        productsSupplied: formData.productsSupplied.split(',').map(p => p.trim()).filter(Boolean)
      });
      triggerRefresh();
      setShowAddModal(false);
      showToast(`Supplier "${formData.name}" added successfully`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Truck className="h-6 w-6 text-blue-600" />
            <span>Feed Mills & Suppliers Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Primary feed manufacturers, seed corporations, and silage harvesting vendors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search supplier, contact, city..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Supplier / Manufacturer',
            sortable: true,
            render: (_, row) => (
              <div>
                <div className="font-bold text-slate-900">{row.name}</div>
                <div className="text-xs text-slate-400">{row.address}</div>
              </div>
            )
          },
          {
            key: 'contactPerson',
            header: 'Contact Person',
            render: (val, row) => (
              <div>
                <div className="font-medium text-slate-800">{val || '—'}</div>
                <div className="text-xs text-slate-500">{row.phone}</div>
              </div>
            )
          },
          {
            key: 'productsSupplied',
            header: 'Supplied Products',
            render: (val) => (
              <div className="flex flex-wrap gap-1 max-w-xs">
                {(Array.isArray(val) ? val : [val]).map((item, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                    {item}
                  </span>
                ))}
              </div>
            )
          },
          {
            key: 'totalPurchased',
            header: 'Total Purchases (YTD)',
            sortable: true,
            render: (val) => (
              <strong className="text-sm font-black text-slate-900">
                ₹{Number(val || 0).toLocaleString()}
              </strong>
            )
          }
        ]}
        data={suppliers}
        pageSize={10}
        emptyMessage="No suppliers found"
      />

      {/* ADD SUPPLIER MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Vendor / Supplier"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveSupplier} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Company / Supplier Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Coimbatore Agri Feeds Ltd"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Mr. K. Raman"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94431 ..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Products Supplied (Comma separated)
              </label>
              <input
                type="text"
                value={formData.productsSupplied}
                onChange={(e) => setFormData({ ...formData, productsSupplied: e.target.value })}
                placeholder="Dairy Feed 50KG, Maize Silage, Seeds"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Address / Factory Location
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Industrial Estate, Erode"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Save Supplier
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
