import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  ReceiptText
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const ShopCustomersPage = () => {
  const { currentUser } = useAuth();
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const branchId = currentUser?.branchId;

  const customers = useMemo(() => {
    const all = storageService.getCustomers({ branchId });
    return all.filter(c =>
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [branchId, refreshKey, searchQuery]);

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) throw new Error('Customer name is required');
      storageService.addCustomer({
        ...formData,
        branchId,
        branchName: currentUser?.branchName
      });
      triggerRefresh();
      setShowAddModal(false);
      setFormData({ name: '', phone: '', address: '' });
      showToast(`Customer "${formData.name}" added to branch directory`, 'success');
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
            <Users className="h-6 w-6 text-emerald-600" />
            <span>Branch Customer Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Local farmers and dairy clients registered at {currentUser?.branchName}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Local Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer name or phone..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Customer DataTable */}
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Customer / Farm Name',
            sortable: true,
            render: (_, row) => (
              <div>
                <div className="font-bold text-slate-900">{row.name}</div>
                <div className="text-xs text-slate-400">{row.address || 'Direct counter walk-in'}</div>
              </div>
            )
          },
          {
            key: 'phone',
            header: 'Phone',
            render: (val) => <span className="text-xs font-semibold text-slate-700">{val || '—'}</span>
          },
          {
            key: 'orderCount',
            header: 'Orders',
            sortable: true,
            render: (val) => <span className="font-bold text-slate-800">{val || 0}</span>
          },
          {
            key: 'totalSpent',
            header: 'Total Purchases',
            sortable: true,
            render: (val) => (
              <strong className="text-sm font-black text-emerald-800">
                ₹{Number(val || 0).toLocaleString()}
              </strong>
            )
          },
          {
            key: 'balance',
            header: 'Credit Balance',
            render: (val) => (
              <span className={`text-xs font-bold ${val > 0 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded' : 'text-slate-500'}`}>
                ₹{Number(val || 0).toLocaleString()}
              </span>
            )
          }
        ]}
        data={customers}
        pageSize={10}
        emptyMessage="No customer records found"
      />

      {/* Add Customer Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Branch Customer"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Customer Name / Farm Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kaveri Dairy Farm"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
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
                placeholder="+91 98421 ..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Village / Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Village / Area name"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
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
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
