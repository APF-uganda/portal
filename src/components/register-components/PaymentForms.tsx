/**
 * PaymentForms Component
 * Feature: membership-registration-payment (Rebuilt)
 * 
 * Payment forms with different inputs based on payment method:
 * - Mobile Money (MTN/Airtel): Phone number only with dummy merchant codes
 * - Bank Transfer: Bank account details with proof of payment upload
 * 
 * All methods use the same processing flow with visual status feedback.
 * 
 * 
 */

import { useState, useEffect, useRef } from 'react';
import { PaymentData, PaymentMethod, PaymentStatus } from '../../types/registration';
import ProofOfPaymentUpload from './ProofOfPaymentUpload';
import PhoneInputField from './PhoneInput';

interface PaymentFormsProps {
  selectedMethod: PaymentMethod | null;
  onPaymentDataChange: (paymentData: PaymentData) => void;
  onPaymentValidated: (isValid: boolean) => void;
  onPaymentComplete?: () => void; // Callback when payment is successfully completed
  applicationReference?: string; // Pre-generated application reference ID
}

/**
 * PaymentForms component renders payment form based on selected method
 */
export function PaymentForms({
  selectedMethod,
  onPaymentDataChange,
  onPaymentValidated,
  onPaymentComplete,
  applicationReference,
}: PaymentFormsProps) {
  // Track previous method to detect changes
  const prevMethodRef = useRef<PaymentMethod | null>(null);

  // Mobile money fields
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Bank transfer fields
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  
  // Payment status
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const MTN_PREFIXES = ['25677', '25678', '25676', '25679'];
  const AIRTEL_PREFIXES = ['25670', '25675', '25674'];

  // Payment phone number
  const PAYMENT_PHONE_NUMBER = '0767618767';

  // Bank account details
  const BANK_DETAILS = {
    accountName: 'Accountants Professional Forum',
    accountNumber: '01410017142250',
    bankName: 'DFCU Bank',
    branch: 'Main Branch'
  };


  // Clear payment data when method changes
  useEffect(() => {
    if (selectedMethod && prevMethodRef.current !== null && selectedMethod !== prevMethodRef.current) {
      // Clear all fields
      setPhoneNumber('');      setProofOfPayment(null);
      setPaymentStatus('idle');
      setErrorMessage(undefined);
      setTouched({});
    }
    prevMethodRef.current = selectedMethod;
  }, [selectedMethod]);

  // Update parent with payment data whenever it changes
  useEffect(() => {
    if (!selectedMethod) return;

    const paymentData: PaymentData = {
      method: selectedMethod,
      phoneNumber: phoneNumber || undefined,
      status: paymentStatus,
      errorMessage,
      isValidated: proofOfPayment !== null,
      proofOfPayment: proofOfPayment || undefined,
    };

    onPaymentDataChange(paymentData);
    onPaymentValidated(proofOfPayment !== null);
  }, [selectedMethod, phoneNumber, proofOfPayment, paymentStatus, errorMessage, onPaymentDataChange, onPaymentValidated]);

  // Handle proof of payment file selection
  const handleProofOfPaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please upload a JPG, PNG, or PDF file');
        return;
      }
      
      setProofOfPayment(file);
      setErrorMessage(undefined);
      setPaymentStatus('completed');
    }
  };

  // Handle proof of payment removal
  const handleRemoveProofOfPayment = () => {
    setProofOfPayment(null);
    setPaymentStatus('idle');
    // Reset file input
    const fileInput = document.getElementById('proofOfPayment') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Get field validation errors
  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;

    switch (field) {
      case 'phoneNumber': {
        if (!phoneNumber) return 'Phone number is required';
        break;
      }
    }

    return undefined;
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  // Don't render anything if no method selected
  if (!selectedMethod) {
    return null;
  };

  // Get method display name
  const getMethodName = () => {
    switch (selectedMethod) {
      case 'mtn':
        return 'MTN Mobile Money';
      case 'airtel':
        return 'Airtel Money';
      case 'bank':
        return 'Bank Transfer';
      default:
        return 'Payment';
    }
  };

  // Render mobile money form (MTN/Airtel)
  const renderMobileMoneyForm = () => (
    <div className="space-y-4">
      {/* Payment Phone Number Display */}
      <div className="bg-purple-50 border-2 border-[#5F1C9F] rounded-lg p-4">
        <h4 className="font-medium text-[#5F1C9F] mb-3">Payment Details</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Send Money To:</span>
            <span className="font-extrabold text-2xl tracking-widest text-[#5F1C9F] bg-white border border-purple-300 rounded px-3 py-1">
              {PAYMENT_PHONE_NUMBER}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-lg text-black">UGX 50,000</span>
          </div>
          {applicationReference && (
            <div className="flex justify-between items-center border-t border-purple-200 pt-3 mt-1">
              <span className="text-gray-600">Your Reference ID:</span>
              <span className="font-bold text-base tracking-wide text-[#5F1C9F] bg-white border border-purple-300 rounded px-3 py-1 select-all">
                {applicationReference}
              </span>
            </div>
          )}
        </div>
      </div>

      <PhoneInputField
        label="Transaction Phone Number"
        required
        operator={selectedMethod === 'mtn' ? 'mtn' : 'airtel'}
        value={phoneNumber || undefined}
        onChange={(val) => setPhoneNumber(val || '')}
      />

      {/* Instructions */}
      <div className="text-sm text-black bg-white border border-l-4 border-[#9333EA] p-4 rounded-lg">
        <p className="font-medium mb-2">Payment Instructions:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Dial *165# (MTN) or *185# (Airtel)</li>
          <li>Select "Send Money"</li>
          <li>Enter Phone Number: <span className="font-bold">{PAYMENT_PHONE_NUMBER}</span></li>
          <li>Enter Amount: <span className="font-bold">50000</span></li>
          <li>Enter your Reference ID as the reason: <span className="font-bold">{applicationReference ?? 'Your Reference ID'}</span></li>
          <li>Confirm payment</li>
          <li>Upload proof of payment below</li>
        </ol>
      </div>

      {/* Proof of Payment Upload */}
      <ProofOfPaymentUpload
        proofOfPayment={proofOfPayment}
        onFileChange={handleProofOfPaymentChange}
        onRemoveFile={handleRemoveProofOfPayment}
      />
    </div>
  );

  // Render bank transfer form
  const renderBankTransferForm = () => (
    <div className="space-y-4">
      {/* Bank Details Display */}
      <div className="bg-white border  border-[#5F1C9F] rounded-lg p-4">
        <h4 className="font-medium text-black mb-3">Bank Transfer Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black">Account Name:</span>
            <span className="font-medium text-black">{BANK_DETAILS.accountName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Account Number:</span>
            <span className="font-large font-bold text-black">{BANK_DETAILS.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Bank:</span>
            <span className="font-medium text-black">{BANK_DETAILS.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Branch:</span>
            <span className="font-medium text-black">{BANK_DETAILS.branch}</span>
          </div>
          <div className="flex justify-between border-t border-[#5F1C9F] pt-2 mt-3">
            <span className="text-black">Amount:</span>
            <span className="font-bold text-black">UGX 50,000</span>
          </div>
          {applicationReference && (
            <div className="flex justify-between border-t border-[#5F1C9F] pt-2 mt-1">
              <span className="text-black">Your Reference ID:</span>
              <span className="font-bold text-[#5F1C9F] select-all">{applicationReference}</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-black bg-white border border-l-4 border-[#5F1C9F] p-4 rounded-lg">
        <p className="font-medium mb-2">Payment Instructions:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Transfer UGX 50,000 to the account details above</li>
          <li>Use <span className="font-bold">{applicationReference ?? 'Your Reference ID'}</span> as the payment reference</li>
          <li>Take a screenshot or photo of the transaction receipt</li>
          <li>Upload the proof of payment below</li>
        </ol>
      </div>

      {/* Proof of Payment Upload */}
      <ProofOfPaymentUpload
        proofOfPayment={proofOfPayment}
        onFileChange={handleProofOfPaymentChange}
        onRemoveFile={handleRemoveProofOfPayment}
      />

      {/* Success Status */}
      {proofOfPayment && paymentStatus === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-800">Proof of payment uploaded successfully!</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6 transition-all duration-300 ease-in-out" style={{ minHeight: '400px' }}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          {getMethodName()} Payment
        </h3>

        {/* Render appropriate form based on method */}
        {(selectedMethod === 'mtn' || selectedMethod === 'airtel') && renderMobileMoneyForm()}
        {selectedMethod === 'bank' && renderBankTransferForm()}

        {/* Error message display */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
