import React from 'react';
import { Printer, X, CheckCircle, Download } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrintableInvoice } from './PrintableInvoice';

export const InvoiceModal = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🧾 Invoice ${sale.invoiceNumber}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        
        {/* Success Banner */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold no-print">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Sale completed successfully! Invoice generated and stock updated.</span>
        </div>

        {/* The Printable Invoice Template */}
        <div className="bg-slate-100 p-2 sm:p-4 rounded-2xl">
          <PrintableInvoice sale={sale} />
        </div>

        {/* Actions (Hidden during print) */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Tax Invoice (Thermal / A4)</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
