import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Save,
  Download,
  Upload,
  RotateCcw,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const SettingsPage = () => {
  const { settings, updateBusinessSettings, triggerRefresh, showToast } = useApp();
  const [formData, setFormData] = useState({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessSettings(formData);
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Database backup JSON exported successfully', 'success');
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        storageService.importDatabaseJSON(event.target.result);
        triggerRefresh();
        showToast('Database restored successfully from backup JSON', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    storageService.resetToDemoData();
    triggerRefresh();
    setFormData(storageService.getSettings());
    showToast('Application reset to initial demo data with 5 branches and sample products', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <SettingsIcon className="h-6 w-6 text-blue-600" />
          <span>System & Business Profile Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure company identity, GST details, print bill headers, and manage database backup/reset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Business Profile & Invoicing Form (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="h-4 w-4 text-blue-600" />
              <span>Business Profile Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Tagline / Business Subheading
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  GSTIN / Tax ID Number
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Central Warehouse & Office Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={formData.invoicePrefix}
                  onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Terms & Conditions Printed on Bills
              </label>
              <textarea
                rows={3}
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Business Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Data Management & Backup (1 col) */}
        <div className="space-y-5">
          
          {/* Backup & Restore Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Download className="h-4 w-4 text-emerald-600" />
              <span>Data Backup & Export</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Export all products, branches, stock transfers, invoices, and activity logs to a portable JSON backup file.
            </p>

            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Export Full Database JSON</span>
            </button>

            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Restore from JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>
          </div>

          {/* Clear All Data & Start Fresh Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-slate-600" />
              <span>Database Clean Slate</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Clear all demo products and start empty, or re-populate with default sample data anytime.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  storageService.clearAllData(true);
                  triggerRefresh();
                  showToast('All sample products, stock, and sales cleared! Database is empty.', 'info');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <span>Clear All Data (Start 100% Fresh)</span>
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Sample Demo Data</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Dialog for Reset */}
      {showResetConfirm && (
        <ConfirmDialog
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={handleResetDemoData}
          title="Reset to Sample Demo Data?"
          message="This will re-initialize all products, branches, transfers, and inventory to the fresh starting demo data. Any custom modifications will be replaced."
          confirmText="Yes, Reset Data"
          type="danger"
        />
      )}

    </div>
  );
};
