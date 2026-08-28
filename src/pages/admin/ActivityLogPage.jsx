import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Clock,
  Building2,
  Shield,
  Store,
  User,
  Filter
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';

export const ActivityLogPage = () => {
  const { refreshKey } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const activities = useMemo(() => {
    const list = storageService.getActivityLogs();
    return list.filter(a =>
      searchQuery === '' ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.reference && a.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [refreshKey, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <History className="h-6 w-6 text-blue-600" />
            <span>System Activity & Audit Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time chronological timeline tracking all stock transfers, invoices, logins, and inventory changes.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activity log by action, user, branch, ref..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Activity Timeline Table */}
      <DataTable
        columns={[
          {
            key: 'date',
            header: 'Timestamp',
            sortable: true,
            render: (val, row) => (
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{val}</span>
                <div className="text-[11px] text-slate-400">{row.time}</div>
              </div>
            )
          },
          {
            key: 'userName',
            header: 'User & Role',
            sortable: true,
            render: (val, row) => (
              <div className="flex items-center space-x-2">
                <div className={`h-6 w-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white ${
                  row.role === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {row.role === 'admin' ? 'A' : 'S'}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900">{val}</span>
                  <div className="text-[10px] text-slate-400 capitalize">{row.role}</div>
                </div>
              </div>
            )
          },
          {
            key: 'action',
            header: 'Action Performed',
            sortable: true,
            render: (val) => (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                {val}
              </span>
            )
          },
          {
            key: 'branchName',
            header: 'Location',
            sortable: true,
            render: (val) => (
              <span className="text-xs font-medium text-slate-700">{val || 'Central Hub'}</span>
            )
          },
          {
            key: 'reference',
            header: 'Reference ID',
            render: (val) => (
              <span className="font-mono text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                {val || '—'}
              </span>
            )
          },
          {
            key: 'details',
            header: 'Audit Description',
            render: (val) => (
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">{val}</p>
            )
          }
        ]}
        data={activities}
        pageSize={12}
        emptyMessage="No activity records match your search"
      />

    </div>
  );
};
