import React, { useState } from 'react';
import { MembershipRenewalInvoice } from '../../components/invoices/MembershipRenewalInvoice';
import { Upload, X } from 'lucide-react';

export const GenerateMembershipInvoice: React.FC = () => {
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [membershipType, setMembershipType] = useState('Full');
  const [amount, setAmount] = useState(150000); // Annual subscription fee for all members
  const [renewalPeriod, setRenewalPeriod] = useState('');
  const [previousBalance, setPreviousBalance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [letterheadUrl, setLetterheadUrl] = useState('');
  const [letterheadFile, setLetterheadFile] = useState<File | null>(null);

  // Membership year runs from April 1st to March 31st
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11 (0 = January)
  const currentYear = today.getFullYear();
  
  // If we're in Jan-Mar, membership year started last year
  // If we're in Apr-Dec, membership year started this year
  const membershipStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  const membershipEndYear = membershipStartYear + 1;
  
  const defaultPeriod = `Apr ${membershipStartYear} - Mar ${membershipEndYear}`;

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLetterheadFile(file);
      const url = URL.createObjectURL(file);
      setLetterheadUrl(url);
    }
  };

  const removeLetterhead = () => {
    if (letterheadUrl) {
      URL.revokeObjectURL(letterheadUrl);
    }
    setLetterheadFile(null);
    setLetterheadUrl('');
  };

  const canGenerate = memberName && memberEmail && amount > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate Membership Renewal Invoice
          </h1>
          <p className="text-gray-600">
            Create professional invoices for membership renewals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Invoice Details
            </h2>

            <div className="space-y-4">
              {/* Letterhead Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letterhead (Optional)
                </label>
                {!letterheadFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload letterhead image
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG (Max 2MB)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleLetterheadUpload}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={letterheadUrl}
                      alt="Letterhead"
                      className="w-full h-32 object-contain border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={removeLetterhead}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Member Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Name *
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter member name"
                  required
                />
              </div>

              {/* Member Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Email *
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="member@example.com"
                  required
                />
              </div>

              {/* Membership Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Number (Optional)
                </label>
                <input
                  type="text"
                  value={membershipNumber}
                  onChange={(e) => setMembershipNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., APF-2024-001"
                />
              </div>

              {/* Membership Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type *
                </label>
                <select
                  value={membershipType}
                  onChange={(e) => setMembershipType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Full">Full Membership</option>
                  <option value="Associate">Associate Membership</option>
                  <option value="Student">Student Membership</option>
                  <option value="Honorary">Honorary Membership</option>
                </select>
              </div>

              {/* Renewal Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewal Period
                </label>
                <input
                  type="text"
                  value={renewalPeriod || defaultPeriod}
                  onChange={(e) => setRenewalPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={defaultPeriod}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Subscription Fee (UGX) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150000"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  All members pay UGX 150,000 annually
                </p>
              </div>

              {/* Previous Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Balance (UGX)
                </label>
                <input
                  type="number"
                  value={previousBalance}
                  onChange={(e) => setPreviousBalance(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (UGX)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Invoice Preview
            </h2>
            
            {canGenerate ? (
              <MembershipRenewalInvoice
                memberName={memberName}
                memberEmail={memberEmail}
                membershipNumber={membershipNumber || undefined}
                membershipType={membershipType}
                amount={amount}
                renewalPeriod={renewalPeriod || defaultPeriod}
                previousBalance={previousBalance || undefined}
                discount={discount || undefined}
                letterheadUrl={letterheadUrl || undefined}
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  Fill in the required fields to preview the invoice
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
