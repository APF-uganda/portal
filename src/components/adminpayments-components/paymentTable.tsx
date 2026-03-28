import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Download, Eye } from 'lucide-react';
import { Payment } from '../payment-components/types';

import { ReceiptGenerator, ReceiptData, showNotification } from '../../services/receiptGenerator';

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  // Update types to match your actual handler in payments.tsx
  onStatusUpdate?: (id: number, newStatus: 'verified' | 'rejected') => Promise<void> | void;
  onView?: (payment: Payment) => void;
}

export const PaymentTable = ({ 
  payments, 
  loading,
  onStatusUpdate,
  onView,
}: PaymentTableProps) => {
 
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);


  const totalPages = Math.max(1, Math.ceil(payments.length / rowsPerPage));
  const clampedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (clampedPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, payments.length);

  const paginatedPayments = useMemo(
    () => payments.slice(startIndex, endIndex),
    [payments, startIndex, endIndex]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    if (currentPage !== clampedPage) {
      setCurrentPage(clampedPage);
    }
  }, [currentPage, clampedPage]);

 
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'verified') return 'bg-transparent text-[#081c15] border-[#40916c]';
    if (s === 'pending') return 'bg-transparent text-[#bd0505] border-[#850a0a]';
    if (s === 'failed' || s === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-gray-50 text-gray-700 border-gray-100';
  };

  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'verified') return 'Approved';
    if (s === 'completed') return 'Completed';
    if (s === 'pending') return 'Pending';
    if (s === 'rejected') return 'Rejected';
    if (s === 'failed') return 'Failed';
    return status;
  };

  const getTransactionDetails = (payment: Payment) => {
    console.log('[Payment Data]', payment);
    console.log('[Payment Type]', payment.payment_type);
    
    let transactionId = '';
    let description = '';
    
    // PRIORITY 1: Check payment_type field first (most reliable)
    if (payment.payment_type) {
      switch (payment.payment_type) {
        case 'donation':
          transactionId = payment.reference || '-';
          description = payment.description || 'Donation';
          break;
        case 'event':
          transactionId = payment.reference || '-';
          description = payment.description || 'Event Payment';
          break;
        case 'other':
          transactionId = payment.reference || '-';
          description = payment.description || 'Other Payment';
          break;
        case 'membership_renewal':
          transactionId = payment.invoice_number || payment.reference || '-';
          description = payment.description || 'Membership Renewal';
          break;
        default:
          transactionId = payment.reference || '-';
          description = payment.description || 'Payment';
      }
    }
    // PRIORITY 2: Check invoice number (membership renewals)
    else if (payment.invoice_number && payment.invoice_number.startsWith('INV-')) {
      transactionId = payment.invoice_number;
      description = 'Membership Renewal';
    }
    // PRIORITY 3: Check reference prefixes
    else if (payment.reference) {
      if (payment.reference.startsWith('DON-')) {
        transactionId = payment.reference;
        description = 'Donation';
      } else if (payment.reference.startsWith('EVT-')) {
        transactionId = payment.reference;
        description = payment.description || 'Event Payment';
      } else if (payment.reference.startsWith('OTH-')) {
        transactionId = payment.reference;
        description = payment.description || 'Other Payment';
      } else {
        transactionId = payment.reference;
        description = payment.description || 'Payment';
      }
    }
    // PRIORITY 4: Check application ID (application fees)
    else if (payment.application_id && payment.application_id.startsWith('APF-')) {
      transactionId = payment.application_id;
      description = 'Application Fee';
    }
    // FALLBACK: Use whatever is available
    else {
      transactionId = payment.reference || payment.application_id || payment.invoice_number || '-';
      description = payment.description || 'Payment';
    }
    
    console.log('[Resolved]', { transactionId, description });
    return { transactionId, description };
  };

  // RECEIPT GENERATION
  const handleDownloadReceipt = async (p: Payment) => {
    try {
      showNotification('Generating receipt...', 'success');
      const { transactionId, description } = getTransactionDetails(p);
      
      const receiptData: ReceiptData = {
        // Casting p.id to string to satisfy ReceiptData requirements
        id: String(p.id),
        title: description,
        reference: transactionId,
        date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A',
        amount: `${p.currency || 'UGX'} ${Number(p.amount).toLocaleString()}`,
        type: 'receipt'
      };
      
      const pdf = await ReceiptGenerator.generateReceiptPDF(receiptData);
      ReceiptGenerator.downloadPDF(pdf, `RECEIPT_${transactionId}.pdf`);
    } catch (error) {
      console.error('Receipt Error:', error);
      showNotification('Error generating PDF', 'error');
    }
  };

  const handleStatusAction = async (paymentId: number, newStatus: 'verified' | 'rejected') => {
    if (!onStatusUpdate) return;
    try {
      setActionError(null);
      // Convert to string here ONLY if your loading state specifically requires a string
      setActionLoadingId(String(paymentId)); 
      
      // Now this matches the interface (number, string)
      await onStatusUpdate(paymentId, newStatus);
      
      setActiveMenuId(null);
    } catch (error: any) {
      setActionError(error?.message || `Failed to ${newStatus} payment`);
    } finally {
      setActionLoadingId(null);
    }
  }; 

  return (
    <div className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-slate-100 overflow-hidden w-full font-montserrat">
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white">
        <div>
          <h2 className="text-slate-800 text-lg md:text-xl tracking-tight flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-slate-50 rounded-lg">
              <RotateCcw size={18} className="md:w-5 md:h-5 text-slate-400" />
            </div>
            Recent Transactions
          </h2>
        </div>
      </div>
      {actionError && (
        <div className="mx-4 md:mx-8 mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {actionError}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[1300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] md:text-[11px]  text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-6 md:px-8 py-3 md:py-4 border-b border-slate-50 min-w-[200px]">Member Information</th>
                <th className="px-6 md:px-8 py-3 md:py-4 border-b border-slate-50 min-w-[160px]">Transaction ID</th>
                <th className="px-6 md:px-8 py-3 md:py-4 border-b border-slate-50 min-w-[140px]">Description</th>
                <th className="px-6 md:px-8 py-3 md:py-4 border-b border-slate-50 text-right min-w-[120px]">Amount</th>
                <th className="px-6 md:px-8 py-3 md:py-4 border-b border-slate-50 text-center min-w-[120px]">Status</th>
                <th className="px-6 md:px-8 py-3 md:py-4 border-b border-slate-50 text-center min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="w-8 h-8 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-bold">No records found.</td>
                </tr>
              ) : (
                paginatedPayments.map((p) => {
                  const { transactionId, description } = getTransactionDetails(p);
                  // Converting p.id to string once to avoid repeated casting
                  const stringId = String(p.id);

                  return (
                    <tr key={stringId} className="hover:bg-slate-50/50  text-sm hover:text-[#10002b] transition-all group">
                      <td className="px-6 md:px-8 py-4 hover:bg-slate-50/50 hover:text-[#10002b]] md:py-6">
                        <div className="font-bold text-gray-900 text-sm">{p.member_name}</div>
                        <div className="text-xs text-gray-500">{p.member_email}</div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6  text-sm">{transactionId}</td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-sm">{description}</td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-right font-bold text-gray-900 hover:text-[#10002b]">
                        {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-sm md:text-[10px]  uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                          {getStatusLabel(p.status)}
                        </span>
                      </td>
                      
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <button 
                            onClick={() => onView?.(p)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDownloadReceipt(p)}
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            title="Download Receipt"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*  FOOTER */}
      {!loading && payments.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-3 md:px-8 py-3 md:py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs md:text-sm text-slate-500 text-center sm:text-left">
            Showing {startIndex + 1}-{endIndex} of {payments.length} transactions
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs md:text-sm text-slate-500" htmlFor="payments-rows-per-page">
                Rows:
              </label>
              <select
                id="payments-rows-per-page"
                value={rowsPerPage}
                onChange={(event) => setRowsPerPage(Number(event.target.value))}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs md:text-sm text-slate-700 focus:border-[#5E2590] focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={clampedPage === 1}
                className="rounded-md border border-slate-300 px-2 md:px-3 py-1 text-xs md:text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              <span className="text-xs md:text-sm font-medium text-slate-600 px-2">
                {clampedPage}/{totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={clampedPage === totalPages}
                className="rounded-md border border-slate-300 px-2 md:px-3 py-1 text-xs md:text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
