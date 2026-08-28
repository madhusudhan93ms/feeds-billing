import React, { useState } from 'react';
import { Printer, Download, X, Copy, Check, FileText, Smartphone } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrintableInvoice } from './PrintableInvoice';
import { useApp } from '../../context/AppContext';

export const InvoiceModal = ({ isOpen, onClose, sale }) => {
  const [printFormat, setPrintFormat] = useState('a4');
  const [copied, setCopied] = useState(false);
  const { showToast } = useApp();

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `INVOICE ${sale.invoiceNumber}\nBranch: ${sale.branchName}\nCustomer: ${sale.customerName}\nTotal: ₹${sale.grandTotal.toLocaleString()}\nPayment: ${sale.paymentMethod} (${sale.paymentStatus})\nDate: ${sale.date}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Invoice summary copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invoice: ${sale.invoiceNumber}`} maxWidth="max-w-4xl">
      <div className="space-y-4">
        
        {/* Actions Bar (No Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Format:</span>
            <button
              onClick={() => setPrintFormat('a4')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                printFormat === 'a4'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>A4 Tax Invoice</span>
            </button>

            <button
              onClick={() => setPrintFormat('thermal')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                printFormat === 'thermal'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Thermal Receipt (80mm)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy Details'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Bill</span>
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="print-area max-h-[60vh] overflow-y-auto rounded-xl p-2 bg-slate-100/50">
          <PrintableInvoice sale={sale} printFormat={printFormat} />
        </div>

        {/* Modal Close Button (No Print) */}
        <div className="no-print flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
