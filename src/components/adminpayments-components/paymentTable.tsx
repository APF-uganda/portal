import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { Payment } from './types';

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
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden w-full">
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h2 className="font-black text-slate-800 text-xl tracking-tight flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">
              <RotateCcw size={20} className="text-slate-400" />
            </div>
            Recent Transactions
          </h2>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-[#5E2590] hover:gap-3 transition-all">
          View all transactions <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
              <th className="px-8 py-4 border-b border-slate-50">Member Information</th>
              <th className="px-8 py-4 border-b border-slate-50">Description</th>
              <th className="px-8 py-4 border-b border-slate-50 text-right">Amount</th>
              <th className="px-8 py-4 border-b border-slate-50 text-center">Status</th>
              <th className="px-8 py-4 border-b border-slate-50 text-center">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="w-8 h-8 border-3 border-[#5E2590] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 mt-4 font-bold text-sm">Fetching records...</p>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No payment history found.</td>
              </tr>
            ) : (
              paginatedPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-800 group-hover:text-[#5E2590] transition-colors">{p.member_name}</div>
                    <div className="text-xs text-slate-400 font-medium">{p.member_email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-md">{p.description}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-black text-slate-800 text-base">
                      {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-sm text-slate-500 font-medium">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : '--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && payments.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {startIndex + 1}-{endIndex} of {payments.length} transactions
          </p>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-500" htmlFor="payments-rows-per-page">
              Rows:
            </label>
            <select
              id="payments-rows-per-page"
              value={rowsPerPage}
              onChange={(event) => setRowsPerPage(Number(event.target.value))}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 focus:border-[#5E2590] focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={clampedPage === 1}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-slate-600">
              Page {clampedPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={clampedPage === totalPages}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
