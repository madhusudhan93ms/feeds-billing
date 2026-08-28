import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Shield,
  Store,
  Phone,
  Lock,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';

export const UsersPage = () => {
  const { refreshKey, triggerRefresh, showToast } = useApp();
  const { refreshUserData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'shop_user',
    branchId: '',
    phone: '',
    status: 'Active'
  });

  const users = useMemo(() => {
    return storageService.getUsers();
  }, [refreshKey]);

  const branches = useMemo(() => {
    return storageService.getBranches();
  }, [refreshKey]);

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.branchName && u.branchName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'shop_user',
      branchId: branches[1]?.id || branches[0]?.id || '',
      phone: '',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      branchId: user.branchId || '',
      phone: user.phone || '',
      status: user.status || 'Active'
    });
    setShowAddModal(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.username.trim()) throw new Error('Username is required');
      if (!formData.password.trim()) throw new Error('Password is required');

      if (editingUser) {
        storageService.updateUser(editingUser.id, formData);
        showToast(`User "${formData.name}" updated`, 'success');
      } else {
        storageService.addUser(formData);
        showToast(`User "${formData.name}" created`, 'success');
      }

      triggerRefresh();
      refreshUserData();
      setShowAddModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Delete user account "${user.name}"?`)) {
      try {
        storageService.deleteUser(user.id);
        triggerRefresh();
        refreshUserData();
        showToast(`User "${user.name}" deleted`, 'info');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <UserCheck className="h-6 w-6 text-blue-600" />
            <span>Staff & User Accounts Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control access roles, branch assignments, and login credentials.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, username, branch..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Users DataTable */}
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Staff Name & Role',
            sortable: true,
            render: (_, row) => (
              <div className="flex items-center space-x-2.5">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                  row.role === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {row.role === 'admin' ? <Shield className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-xs text-slate-400 font-mono">@{row.username}</div>
                </div>
              </div>
            )
          },
          {
            key: 'role',
            header: 'System Role',
            sortable: true,
            render: (val) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                val === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {val === 'admin' ? 'Central Admin' : 'Shop Staff'}
              </span>
            )
          },
          {
            key: 'branchName',
            header: 'Assigned Shop Location',
            sortable: true,
            render: (val) => <span className="font-semibold text-xs text-slate-800">{val}</span>
          },
          {
            key: 'phone',
            header: 'Phone',
            render: (val) => <span className="text-xs text-slate-600">{val || '—'}</span>
          },
          {
            key: 'status',
            header: 'Status',
            render: (val) => (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                val === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {val}
              </span>
            )
          },
          {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (_, row) => (
              <div className="flex items-center justify-end space-x-1.5">
                <button
                  onClick={() => handleOpenEdit(row)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteUser(row)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          }
        ]}
        data={filteredUsers}
        pageSize={10}
        emptyMessage="No users found"
      />

      {/* ADD / EDIT USER MODAL */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingUser ? `Edit User: ${editingUser.name}` : 'Create Staff Account'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kumar S"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. kumar"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="shop_user">Shop User</option>
                  <option value="admin">Central Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Assign to Branch *
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>
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
                  placeholder="+91 98432 ..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
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
                {editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
