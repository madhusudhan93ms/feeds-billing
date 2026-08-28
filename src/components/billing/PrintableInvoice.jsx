import React from 'react';
import { CheckCircle, Phone, MapPin, Building2, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrintableInvoice = ({ sale, printFormat = 'a4' }) => {
  const { settings } = useApp();

  if (!sale) return null;

  const isThermal = printFormat === 'thermal';

  return (
    <div
      className={`mx-auto bg-white text-slate-900 ${
        isThermal
          ? 'w-[78mm] p-3 text-xs leading-snug font-mono border border-slate-300'
          : 'max-w-3xl p-8 border border-slate-300 rounded-2xl shadow-sm text-sm'
      }`}
    >
      {/* HEADER */}
      <div
        className={`border-b ${
          isThermal
            ? 'border-dashed border-slate-400 pb-3 mb-3 text-center'
            : 'border-slate-300 pb-6 mb-6 flex justify-between items-start'
        }`}
      >
        <div>
          <div className="flex items-center space-x-3">
            {!isThermal && (
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-sm">
                AF
              </div>
            )}
            <div>
              <h1 className={`font-black tracking-tight ${isThermal ? 'text-base font-bold' : 'text-2xl text-slate-900'}`}>
                {settings.businessName || 'AgroFeeds & Silage Hub'}
              </h1>
              {!isThermal && (
                <p className="text-xs text-emerald-700 font-semibold">{settings.tagline || 'Wholesale & Retail Cattle Feeds, Silage & Summons'}</p>
              )}
            </div>
          </div>

          <div className={`mt-2 text-slate-600 ${isThermal ? 'text-[11px] space-y-0.5' : 'text-xs space-y-1'}`}>
            <p className="flex items-center gap-1.5 justify-center sm:justify-start">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{settings.address || 'Krishnagiri Main Road, Tamil Nadu, India'}</span>
            </p>
            <p className="flex items-center gap-1.5 justify-center sm:justify-start">
              <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Phone: <strong>{settings.phone || '+91 98765 43210'}</strong></span>
            </p>
            {settings.gstin && (
              <p className="font-mono text-slate-800 font-bold">
                GSTIN: {settings.gstin}
              </p>
            )}
          </div>
        </div>

        {/* INVOICE BADGE (A4 FORMAT) */}
        {!isThermal && (
          <div className="text-right space-y-1">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs uppercase tracking-wider rounded-lg border border-emerald-300">
              Retail Tax Invoice
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">{sale.invoiceNumber}</h2>
            <p className="text-xs text-slate-500 font-medium">Date: <strong>{sale.date}</strong> at {sale.time}</p>
            <p className="text-xs font-bold text-slate-800">Branch: <span className="text-emerald-800">{sale.branchName}</span></p>
          </div>
        )}
      </div>

      {/* THERMAL INVOICE META */}
      {isThermal && (
        <div className="border-b border-dashed border-slate-400 pb-2 mb-2 text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Invoice:</span>
            <span className="font-bold">{sale.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date & Time:</span>
            <span>{sale.date} {sale.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Branch:</span>
            <span className="font-semibold">{sale.branchName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Cashier:</span>
            <span>{sale.createdBy}</span>
          </div>
        </div>
      )}

      {/* CUSTOMER & PAYMENT DETAILS */}
      <div className={`rounded-xl bg-slate-50 p-4 mb-5 ${isThermal ? 'text-[11px] mb-2 p-2' : 'border border-slate-200 flex justify-between items-center'}`}>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Customer Details</p>
          <h4 className={`font-bold text-slate-900 ${isThermal ? 'text-xs' : 'text-base'}`}>{sale.customerName || 'Walk-in Customer'}</h4>
          {sale.customerPhone && (
            <p className="text-xs text-slate-600 font-mono">Mobile: {sale.customerPhone}</p>
          )}
        </div>
        {!isThermal && (
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Payment Details</p>
            <div className="mt-0.5 inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full text-xs border border-emerald-300">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>PAID via {sale.paymentMethod}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Billed by: {sale.createdBy}</p>
          </div>
        )}
      </div>

      {/* LINE ITEMS TABLE */}
      <div className="mb-5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className={`border-b ${isThermal ? 'border-dashed border-slate-400 text-[10px] uppercase font-bold' : 'border-slate-300 bg-slate-100 text-xs uppercase font-extrabold text-slate-700'}`}>
              <th className={`py-2.5 ${isThermal ? 'px-1' : 'px-3'}`}># Product Item</th>
              <th className={`py-2.5 text-center ${isThermal ? 'px-1' : 'px-3'}`}>Qty</th>
              <th className={`py-2.5 text-right ${isThermal ? 'px-1' : 'px-3'}`}>Rate (₹)</th>
              <th className={`py-2.5 text-right ${isThermal ? 'px-1' : 'px-3'}`}>Total (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sale.items.map((item, idx) => (
              <tr key={idx} className={isThermal ? 'text-[11px]' : 'text-sm'}>
                <td className={`py-2.5 ${isThermal ? 'px-1' : 'px-3'}`}>
                  <div className="font-bold text-slate-900">{idx + 1}. {item.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">SKU: {item.sku} • {item.unit}</div>
                </td>
                <td className={`py-2.5 text-center font-bold ${isThermal ? 'px-1' : 'px-3'}`}>
                  {item.quantity}
                </td>
                <td className={`py-2.5 text-right font-medium text-slate-700 ${isThermal ? 'px-1' : 'px-3'}`}>
                  ₹{item.unitPrice.toLocaleString()}
                </td>
                <td className={`py-2.5 text-right font-black text-slate-900 ${isThermal ? 'px-1' : 'px-3'}`}>
                  ₹{item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY TOTALS */}
      <div className={`border-t ${isThermal ? 'border-dashed border-slate-400 pt-2 mb-3' : 'border-slate-300 pt-4 mb-6'} flex justify-end`}>
        <div className={`space-y-1.5 ${isThermal ? 'w-full text-xs' : 'w-72 text-sm'}`}>
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">₹{sale.subtotal.toLocaleString()}</span>
          </div>

          {sale.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount:</span>
              <span className="font-bold">- ₹{sale.totalDiscount.toLocaleString()}</span>
            </div>
          )}

          {sale.taxAmount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>GST Tax ({sale.taxRate}%):</span>
              <span className="font-bold text-slate-900">₹{sale.taxAmount.toLocaleString()}</span>
            </div>
          )}

          <div className={`flex justify-between font-black text-slate-900 border-t ${isThermal ? 'border-dashed border-slate-500 pt-2 text-sm' : 'border-slate-900 pt-3 text-lg'}`}>
            <span>Grand Total:</span>
            <span className="text-emerald-800 text-xl font-black">₹{sale.grandTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>Payment Mode:</span>
            <span className="font-bold text-slate-900 uppercase">{sale.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* FOOTER & TERMS */}
      <div className={`border-t ${isThermal ? 'border-dashed border-slate-400 pt-3 text-[10px] text-center' : 'border-slate-200 pt-6 text-xs text-slate-500'}`}>
        {!isThermal ? (
          <div className="grid grid-cols-2 gap-6 items-end">
            <div>
              <p className="font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">Terms & Conditions:</p>
              <p className="whitespace-pre-line text-slate-500 text-[11px] leading-relaxed">
                {settings.termsAndConditions || '1. Goods once sold are not returnable.\n2. Please verify the bags/weight upon receipt.\n3. Keep cattle feeds in a dry and moisture-free area.'}
              </p>
            </div>
            <div className="text-right flex flex-col justify-end items-end space-y-1">
              <div className="w-48 border-b-2 border-slate-400 mb-1"></div>
              <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Authorized Signatory</p>
              <p className="text-[11px] text-slate-500">{sale.branchName} • {settings.businessName}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-bold text-slate-800">THANK YOU FOR YOUR BUSINESS!</p>
            <p className="text-slate-500">Please visit again.</p>
          </div>
        )}
      </div>

    </div>
  );
};
