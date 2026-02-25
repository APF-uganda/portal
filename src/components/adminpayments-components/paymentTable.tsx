import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Payment } from '../../components/adminpayments-components/types';

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
}

export const PaymentTable = ({ payments, loading }: PaymentTableProps) => {
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (s === 'failed') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <RotateCcw size={18} className="text-slate-400" /> Recent Transactions
        </h2>
        <button className="text-xs font-bold text-[#5E2590] hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 border-b border-gray-100">Member</th>
              <th className="px-6 py-4 border-b border-gray-100">Description</th>
              <th className="px-6 py-4 border-b border-gray-100 text-right">Amount</th>
              <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-[#5E2590] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">No records found.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{p.member_name}</div>
                    <div className="text-[11px] text-gray-400 font-medium">{p.member_email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{p.description}</td>
                  <td className="px-6 py-4 font-black text-gray-800 text-right">
                    {p.currency || 'UGX'} {Number(p.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PaymentTable;