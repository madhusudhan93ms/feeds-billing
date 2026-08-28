import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
  ReceiptText,
  UserCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const CustomersPage = () => {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    branchId: '',
    balance: 0
  });

  const branches = useMemo(() => {
    return storageService.getBranches();
  }, [refreshKey]);

  const customers = useMemo(() => {
    return storageService.getCustomers({ search: searchQuery });
  }, [refreshKey, searchQuery]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      branchId: branches[0]?.id || '',
      balance: 0
    });
    setShowAddModal(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) throw new Error('Customer name is required');
      const branch = branches.find(b => b.id === formData.branchId);

      storageService.addCustomer({
        ...formData,
        branchName: branch ? branch.name : 'Central'
      });

      triggerRefresh();
      setShowAddModal(false);
      showToast(`Customer "${formData.name}" added successfully`, 'success');
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
            <Users className="h-6 w-6 text-blue-600" />
            <span>Customer Accounts Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Registered farmers, dairy cooperatives, and commercial livestock buyers across all branches.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, phone, city..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Customers DataTable */}
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Customer Details',
            sortable: true,
            render: (_, row) => (
              <div>
                <div className="font-bold text-slate-900">{row.name}</div>
                <div className="text-xs text-slate-400">{row.address || 'Direct counter buyer'}</div>
              </div>
            )
          },
          {
            key: 'phone',
            header: 'Phone / Contact',
            render: (val) => (
              <span className="text-xs font-semibold text-slate-700">{val || '—'}</span>
            )
          },
          {
            key: 'branchName',
            header: 'Primary Branch',
            sortable: true,
            render: (val) => (
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {val || 'All Branches'}
              </span>
            )
          },
          {
            key: 'orderCount',
            header: 'Total Orders',
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
            sortable: true,
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

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Customer Account"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Farm / Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Senthil Dairy Farm"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98421 ..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Primary Branch
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Address / Village
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Village / Road name"
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
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
