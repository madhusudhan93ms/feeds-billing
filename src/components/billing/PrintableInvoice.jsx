import React from 'react';
import { Store, Receipt, CheckCircle, Phone, Calendar, User, Clock, CreditCard } from 'lucide-react';

export const PrintableInvoice = ({ sale }) => {
  if (!sale) return null;

  return (
    <div className="printable-receipt bg-white text-slate-900 p-6 max-w-lg mx-auto font-mono text-xs border border-slate-300 rounded-2xl shadow-sm">
      
      {/* STORE HEADER */}
      <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
        <h2 className="text-lg font-black tracking-tight text-slate-950 font-sans uppercase">
          AGROFEEDS & SILAGE
        </h2>
        <p className="text-[11px] font-bold text-slate-600 font-sans">
          {sale.branchName || 'Retail Branch'}
        </p>
        <p className="text-[10px] text-slate-500 font-sans mt-0.5">
          Wholesale & Retail Agro Feeds, Silage & Animal Nutrition
        </p>
      </div>

      {/* INVOICE & CUSTOMER METADATA */}
      <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-3 mb-3">
        <div>
          <p><span className="text-slate-500">Invoice:</span> <strong>{sale.invoiceNumber}</strong></p>
          <p><span className="text-slate-500">Date:</span> {sale.date} {sale.time}</p>
          <p><span className="text-slate-500">Cashier:</span> {sale.cashierName || 'Staff'}</p>
        </div>
        <div className="text-right">
          <p><span className="text-slate-500">Customer:</span> <strong>{sale.customerName || 'Walk-in'}</strong></p>
          {sale.customerPhone && (
            <p><span className="text-slate-500">Phone:</span> {sale.customerPhone}</p>
          )}
          <p><span className="text-slate-500">Payment:</span> <span className="uppercase font-bold text-emerald-700">{sale.paymentMethod || 'Cash'}</span></p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full text-left my-3 border-collapse">
        <thead>
          <tr className="border-b border-slate-400 text-slate-700 font-bold uppercase text-[10px]">
            <th className="py-1">Item Description</th>
            <th className="py-1 text-center">Qty</th>
            <th className="py-1 text-right">Rate</th>
            <th className="py-1 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-slate-200">
          {sale.items && sale.items.map((item, idx) => (
            <tr key={idx} className="py-1.5">
              <td className="py-1.5 font-bold text-slate-900 pr-2">
                {item.name}
              </td>
              <td className="py-1.5 text-center font-semibold">
                {item.quantity}
              </td>
              <td className="py-1.5 text-right font-medium">
                ₹{Number(item.unitPrice).toLocaleString()}
              </td>
              <td className="py-1.5 text-right font-bold text-slate-950">
                ₹{Number(item.total).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS & BREAKDOWN */}
      <div className="border-t-2 border-dashed border-slate-300 pt-3 mt-3 space-y-1 text-right text-[11px]">
        {sale.subtotal && sale.discount > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal:</span>
              <span>₹{Number(sale.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-rose-600 font-bold">
              <span>Discount:</span>
              <span>-₹{Number(sale.discount).toLocaleString()}</span>
            </div>
          </>
        )}

        <div className="flex justify-between text-sm sm:text-base font-black text-slate-950 pt-2 border-t border-slate-300">
          <span>GRAND TOTAL:</span>
          <span>₹{Number(sale.grandTotal).toLocaleString()}</span>
        </div>
      </div>

      {/* FOOTER & TERMS */}
      <div className="text-center border-t border-slate-200 pt-4 mt-4 text-[10px] text-slate-500 font-sans space-y-1">
        <p className="font-bold text-slate-700">Thank you for your business!</p>
        <p>Goods once sold cannot be returned without original receipt.</p>
        <p className="text-[9px] text-slate-400">Computer Generated Tax Invoice</p>
      </div>

    </div>
  );
};
