import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Phone,
  MapPin,
  User,
  Boxes,
  TrendingUp,
  ReceiptText,
  AlertTriangle,
  Edit2,
  Trash2,
  ExternalLink,
  Store,
  CheckCircle,
  X
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';
import { StockStatusBadge } from '../../components/common/StockStatusBadge';

export const BranchesPage = ({ onNavigate }) => {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [viewingBranch, setViewingBranch] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    assignedUserId: '',
    assignedUserName: '',
    isMainShop: false,
    status: 'Active'
  });

  const branches = useMemo(() => {
    return storageService.getBranches();
  }, [refreshKey]);

  const users = useMemo(() => {
    return storageService.getUsers();
  }, [refreshKey]);

  const filteredBranches = useMemo(() => {
    return branches.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.assignedUserName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [branches, searchQuery]);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      code: `BR-0${branches.length + 1}`,
      address: '',
      phone: '',
      assignedUserId: '',
      assignedUserName: 'Unassigned',
      isMainShop: false,
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
      assignedUserId: branch.assignedUserId || '',
      assignedUserName: branch.assignedUserName || 'Unassigned',
      isMainShop: branch.isMainShop || false,
      status: branch.status || 'Active'
    });
    setShowAddModal(true);
  };

  const handleSaveBranch = (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) throw new Error('Please enter a branch name');
      if (!formData.code.trim()) throw new Error('Please enter a branch code');

      // Find user name if assigned
      const assignedUser = users.find(u => u.id === formData.assignedUserId);
      const payload = {
        ...formData,
        assignedUserName: assignedUser ? assignedUser.name : 'Unassigned'
      };

      if (editingBranch) {
        storageService.updateBranch(editingBranch.id, payload);
        showToast(`Branch "${payload.name}" updated successfully`, 'success');
      } else {
        storageService.addBranch(payload);
        showToast(`Branch "${payload.name}" created successfully`, 'success');
      }

      triggerRefresh();
      setShowAddModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteBranch = (branch) => {
    if (branch.isMainShop) {
      showToast('Cannot delete Main HQ Shop', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${branch.name}?`)) {
      try {
        storageService.deleteBranch(branch.id);
        triggerRefresh();
        showToast(`Branch ${branch.name} deleted`, 'info');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Branch Detail Inventory
  const branchDetailInventory = useMemo(() => {
    if (!viewingBranch) return [];
    return storageService.getBranchInventory(viewingBranch.id);
  }, [viewingBranch, refreshKey]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span>Branch Locations & Retail Shops</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Total {branches.length} registered locations including Admin HQ Shop and regional outlets.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by branch name, code, city, manager..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.map((branch) => {
          const branchItems = storageService.getBranchInventory(branch.id);
          const totalUnits = branchItems.reduce((sum, item) => sum + item.quantity, 0);
          const lowStockCount = branchItems.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;

          return (
            <div
              key={branch.id}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                
                {/* Top Badge & Code */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-xs ${
                      branch.isMainShop ? 'bg-gradient-to-tr from-blue-600 to-indigo-600' : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                    }`}>
                      {branch.code.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {branch.name}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-slate-400">
                        Code: {branch.code}
                      </p>
                    </div>
                  </div>

                  {branch.isMainShop ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">
                      HQ Shop #1
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Branch Shop
                    </span>
                  )}
                </div>

                {/* Info List */}
                <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{branch.address || 'Address not registered'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{branch.phone || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Manager: <strong className="text-slate-800">{branch.assignedUserName}</strong></span>
                  </p>
                </div>

                {/* Stock Stats Mini Pills */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Stock In Hand</p>
                    <p className="text-sm font-black text-slate-800">{totalUnits} units</p>
                  </div>
                  <div className={`rounded-xl p-2.5 border ${
                    lowStockCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Stock Alerts</p>
                    <p className="text-sm font-black">
                      {lowStockCount > 0 ? `${lowStockCount} Low` : 'Normal'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <button
                  onClick={() => setViewingBranch(branch)}
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700"
                >
                  <Boxes className="h-3.5 w-3.5" />
                  <span>View Branch Stock</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(branch)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  {!branch.isMainShop && (
                    <button
                      onClick={() => handleDeleteBranch(branch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD / EDIT BRANCH MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingBranch ? `Edit Branch: ${editingBranch.name}` : 'Add New Branch Location'}
        >
          <form onSubmit={handleSaveBranch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Salem Branch"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Branch Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SLM-05"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Store Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full street address and pin code"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98421 ..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Assign Shop User
                </label>
                <select
                  value={formData.assignedUserId}
                  onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select Registered User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.username})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isMainShop}
                  onChange={(e) => setFormData({ ...formData, isMainShop: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Set as Admin's Main HQ Shop (Shop #1)</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
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
                {editingBranch ? 'Save Changes' : 'Create Branch'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW BRANCH STOCK DRAWER / MODAL */}
      {viewingBranch && (
        <Modal
          isOpen={!!viewingBranch}
          onClose={() => setViewingBranch(null)}
          title={`Inventory for ${viewingBranch.name} (${viewingBranch.code})`}
          subtitle={`Manager: ${viewingBranch.assignedUserName} • Contact: ${viewingBranch.phone}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="space-x-4">
                <span>Total Items: <strong>{branchDetailInventory.length}</strong></span>
                <span>Total Stock Units: <strong>{branchDetailInventory.reduce((s, i) => s + i.quantity, 0)}</strong></span>
              </div>
              <button
                onClick={() => {
                  setViewingBranch(null);
                  onNavigate('stock-transfers');
                }}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
              >
                Transfer Stock to this Branch
              </button>
            </div>

            <DataTable
              columns={[
                {
                  key: 'name',
                  header: 'Product',
                  sortable: true,
                  render: (_, row) => (
                    <div>
                      <div className="font-bold text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-400">{row.category} • SKU: {row.sku}</div>
                    </div>
                  )
                },
                {
                  key: 'quantity',
                  header: 'Stock in Hand',
                  sortable: true,
                  render: (val, row) => (
                    <span className="font-bold text-slate-900 text-sm">
                      {val} {row.unit}
                    </span>
                  )
                },
                {
                  key: 'sellingPrice',
                  header: 'Selling Rate',
                  render: (val) => `₹${val?.toLocaleString()}`
                },
                {
                  key: 'stockStatus',
                  header: 'Status',
                  render: (val, row) => <StockStatusBadge status={val} quantity={row.quantity} minStock={row.minStock} />
                }
              ]}
              data={branchDetailInventory}
              pageSize={8}
              emptyMessage="No stock currently in this branch"
              emptySubMessage="Use the Stock Transfers module to dispatch stock from Central Warehouse."
            />
          </div>
        </Modal>
      )}

    </div>
  );
};
