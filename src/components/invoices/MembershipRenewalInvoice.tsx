import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { downloadMembershipRenewalInvoice } from '../../services/membershipInvoiceGenerator';

interface MembershipRenewalInvoiceProps {
  memberName: string;
  memberEmail: string;
  membershipNumber?: string;
  membershipType: string;
  amount: number;
  renewalPeriod?: string;
  previousBalance?: number;
  discount?: number;
  letterheadUrl?: string;
}

export const MembershipRenewalInvoice: React.FC<MembershipRenewalInvoiceProps> = ({
  memberName,
  memberEmail,
  membershipNumber,
  membershipType,
  amount,
  renewalPeriod,
  previousBalance,
  discount,
  letterheadUrl,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoice = async () => {
    setIsGenerating(true);
    try {
      const today = new Date();
      const currentMonth = today.getMonth(); // 0-11 (0 = January)
      const currentYear = today.getFullYear();
      
      // Membership year runs from April 1st to March 31st
      const membershipStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
      const membershipEndYear = membershipStartYear + 1;
      
      const invoiceNumber = `INV-${currentYear}-${Date.now().toString().slice(-6)}`;
      const invoiceDate = new Date().toLocaleDateString('en-GB');
      const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');
      
      const period = renewalPeriod || `Apr ${membershipStartYear} - Mar ${membershipEndYear}`;

      await downloadMembershipRenewalInvoice(
        {
          invoiceNumber,
          invoiceDate,
          dueDate,
          memberName,
          memberEmail,
          membershipNumber,
          membershipType,
          renewalPeriod: period,
          amount,
          currency: 'UGX',
          previousBalance,
          discount,
        },
        letterheadUrl
      );
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const total = amount + (previousBalance || 0) - (discount || 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Membership Renewal Invoice
            </h3>
            <p className="text-sm text-gray-600">
              {membershipType} Membership
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Member:</span>
          <span className="font-medium text-gray-900">{memberName}</span>
        </div>
        
        {membershipNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Membership No:</span>
            <span className="font-medium text-gray-900">{membershipNumber}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Renewal Period:</span>
          <span className="font-medium text-gray-900">
            {renewalPeriod || (() => {
              const today = new Date();
              const currentMonth = today.getMonth();
              const currentYear = today.getFullYear();
              const startYear = currentMonth < 3 ? currentYear - 1 : currentYear;
              const endYear = startYear + 1;
              return `Apr ${startYear} - Mar ${endYear}`;
            })()}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Membership Fee:</span>
            <span className="font-medium text-gray-900">
              UGX {amount.toLocaleString('en-UG')}
            </span>
          </div>

          {previousBalance && previousBalance > 0 && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Previous Balance:</span>
              <span className="font-medium text-gray-900">
                UGX {previousBalance.toLocaleString('en-UG')}
              </span>
            </div>
          )}

          {discount && discount > 0 && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-green-600">Discount:</span>
              <span className="font-medium text-green-600">
                -UGX {discount.toLocaleString('en-UG')}
              </span>
            </div>
          )}

          <div className="flex justify-between text-base font-semibold mt-3 pt-3 border-t border-gray-200">
            <span className="text-gray-900">Total Amount:</span>
            <span className="text-blue-600">
              UGX {total.toLocaleString('en-UG')}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={generateInvoice}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Invoice...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Invoice (PDF)</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Invoice will be downloaded as a PDF file
      </p>
    </div>
  );
};
