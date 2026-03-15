import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { Payment } from '../payment-components/types';

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
}

export const PaymentTable = ({ payments, loading }: PaymentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    if (s === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (s === 'failed') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-gray-50 text-gray-700 border-gray-100';
  };

  return (
    <div className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-slate-100 overflow-hidden w-full">
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white">
        <div>
          <h2 className="font-black text-slate-800 text-lg md:text-xl tracking-tight flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-slate-50 rounded-lg">
              <RotateCcw size={18} className="md:w-5 md:h-5 text-slate-400" />
            </div>
            Recent Transactions
          </h2>
        </div>
        {/* <button className="flex items-center gap-2 text-sm font-bold text-[#5E2590] hover:gap-3 transition-all">
          View all transactions <ArrowRight size={16} />
        </button> */}
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="min-w-[800px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-3 md:px-8 py-3 md:py-4 border-b border-slate-50 min-w-[150px]">Member Information</th>
                <th className="px-3 md:px-8 py-3 md:py-4 border-b border-slate-50 min-w-[140px]">Transaction ID</th>
                <th className="px-3 md:px-8 py-3 md:py-4 border-b border-slate-50 min-w-[120px]">Description</th>
                <th className="px-3 md:px-8 py-3 md:py-4 border-b border-slate-50 text-right min-w-[100px]">Amount</th>
                <th className="px-3 md:px-8 py-3 md:py-4 border-b border-slate-50 text-center min-w-[80px]">Status</th>
                <th className="px-3 md:px-8 py-3 md:py-4 border-b border-slate-50 text-center min-w-[80px]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 md:py-20 text-center">
                    <div className="w-6 md:w-8 h-6 md:h-8 border-2 md:border-3 border-[#5E2590] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 mt-3 md:mt-4 font-bold text-xs md:text-sm">Fetching records...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 md:py-20 text-center text-slate-400 font-bold text-sm">No payment history found.</td>
                </tr>
              ) : (
                paginatedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      <div className="font-bold text-slate-800 group-hover:text-[#5E2590] transition-colors text-sm md:text-base truncate">{p.member_name}</div>
                      <div className="text-xs text-slate-400 font-medium truncate">{p.member_email}</div>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      <div className="font-mono text-xs md:text-sm text-purple-600 font-semibold bg-purple-50 px-2 md:px-3 py-1 rounded-md border border-purple-100 truncate">
                        {p.application_id || p.invoice_number || '-'}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {p.application_id ? 'Application' : p.invoice_number ? 'Invoice' : 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      <span className="text-xs md:text-sm text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-md truncate block">{p.description}</span>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5 text-right">
                      <span className="font-black text-slate-800 text-sm md:text-base">
                        {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5 text-center">
                      <span className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5 text-center text-xs md:text-sm text-slate-500 font-medium">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
