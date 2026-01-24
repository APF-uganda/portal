/**
 * PaymentForms Component
 * Feature: membership-registration-payment (Rebuilt)
 * 
 * Payment forms with different inputs based on payment method:
 * - Mobile Money (MTN/Airtel): Phone number only
 * - Credit Card: Standard card fields (number, expiry, CVV, name)
 * 
 * All methods use the same processing flow with visual status feedback.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { useState, useEffect, useRef } from 'react';
import { PaymentData, PaymentMethod, PaymentStatus } from '../../types/registration';
import { 
  processPayment, 
  validatePhoneNumber,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateCardholderName
} from '../../services/paymentApi';
import Input from './Input';

interface PaymentFormsProps {
  selectedMethod: PaymentMethod | null;
  onPaymentDataChange: (paymentData: PaymentData) => void;
  onPaymentValidated: (isValid: boolean) => void;
}

/**
 * PaymentForms component renders payment form based on selected method
 */
export function PaymentForms({
  selectedMethod,
  onPaymentDataChange,
  onPaymentValidated,
}: PaymentFormsProps) {
  // Track previous method to detect changes
  const prevMethodRef = useRef<PaymentMethod | null>(null);

  // Mobile money fields
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  
  // Payment status
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionReference, setTransactionReference] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Clear payment data when method changes
  useEffect(() => {
    if (selectedMethod && prevMethodRef.current !== null && selectedMethod !== prevMethodRef.current) {
      // Clear all fields
      setPhoneNumber('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
      setPaymentStatus('idle');
      setTransactionReference(undefined);
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
      cardNumber: cardNumber || undefined,
      expiryDate: expiryDate || undefined,
      cvv: cvv || undefined,
      cardholderName: cardholderName || undefined,
      status: paymentStatus,
      transactionReference,
      errorMessage,
      isValidated: paymentStatus === 'success',
    };

    onPaymentDataChange(paymentData);
    onPaymentValidated(paymentStatus === 'success');
  }, [selectedMethod, phoneNumber, cardNumber, expiryDate, cvv, cardholderName, paymentStatus, transactionReference, errorMessage, onPaymentDataChange, onPaymentValidated]);

  // Check if form is valid for payment
  const isFormValid = (): boolean => {
    if (!selectedMethod) return false;

    if (selectedMethod === 'mtn' || selectedMethod === 'airtel') {
      return phoneNumber !== '' && validatePhoneNumber(phoneNumber);
    } else if (selectedMethod === 'credit_card') {
      return (
        cardNumber !== '' && validateCardNumber(cardNumber) &&
        expiryDate !== '' && validateExpiryDate(expiryDate) &&
        cvv !== '' && validateCVV(cvv) &&
        cardholderName !== '' && validateCardholderName(cardholderName)
      );
    }

    return false;
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (!selectedMethod || !isFormValid()) return;

    // Set status to pending
    setPaymentStatus('pending');
    setErrorMessage(undefined);

    try {
      // Process payment through mock API
      const response = await processPayment({
        method: selectedMethod,
        amount: 50000, // UGX 50,000
        phoneNumber: phoneNumber || undefined,
        cardNumber: cardNumber || undefined,
        expiryDate: expiryDate || undefined,
        cvv: cvv || undefined,
        cardholderName: cardholderName || undefined,
      });

      if (response.success) {
        setPaymentStatus('success');
        setTransactionReference(response.transactionReference);
      } else {
        setPaymentStatus('failed');
        setErrorMessage(response.errorMessage);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrorMessage('Network error. Please try again.');
    }
  };

  // Handle retry payment
  const handleRetry = () => {
    setPaymentStatus('idle');
    setErrorMessage(undefined);
    setTransactionReference(undefined);
  };

  // Get field validation errors
  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;

    switch (field) {
      case 'phoneNumber':
        if (!phoneNumber) return 'Phone number is required';
        if (!validatePhoneNumber(phoneNumber)) return 'Phone number must be in format 256XXXXXXXXX';
        break;
      case 'cardNumber':
        if (!cardNumber) return 'Card number is required';
        if (!validateCardNumber(cardNumber)) return 'Invalid card number';
        break;
      case 'expiryDate':
        if (!expiryDate) return 'Expiry date is required';
        if (!validateExpiryDate(expiryDate)) return 'Invalid or expired date (MM/YY)';
        break;
      case 'cvv':
        if (!cvv) return 'CVV is required';
        if (!validateCVV(cvv)) return 'CVV must be 3 or 4 digits';
        break;
      case 'cardholderName':
        if (!cardholderName) return 'Cardholder name is required';
        if (!validateCardholderName(cardholderName)) return 'Invalid name format';
        break;
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
  }

  // Get method display name
  const getMethodName = () => {
    switch (selectedMethod) {
      case 'mtn':
        return 'MTN Mobile Money';
      case 'airtel':
        return 'Airtel Money';
      case 'credit_card':
        return 'Credit Card';
      default:
        return 'Payment';
    }
  };

  // Render mobile money form (MTN/Airtel)
  const renderMobileMoneyForm = () => (
    <div className="space-y-4">
      <Input
        label="Phone Number"
        type="text"
        placeholder="256XXXXXXXXX"
        name="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        onBlur={() => handleBlur('phoneNumber')}
        error={getFieldError('phoneNumber')}
        required
      />

      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-medium mb-1">Instructions:</p>
        <p>Enter your phone number and click "Pay Now". You will receive a payment prompt on your phone.</p>
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={!isFormValid()}
        className={`w-full py-3 rounded-lg text-sm font-medium transition-all touch-manipulation min-h-[44px] ${
          isFormValid()
            ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Pay Now - UGX 50,000
      </button>
    </div>
  );

  // Render credit card form
  const renderCreditCardForm = () => (
    <div className="space-y-4">
      <Input
        label="Card Number"
        type="text"
        placeholder="1234 5678 9012 3456"
        name="cardNumber"
        value={cardNumber}
        onChange={(e) => {
          // Auto-format card number with spaces (max 19 chars)
          const value = e.target.value.replace(/\s/g, '');
          if (value.length <= 16) {
            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            setCardNumber(formatted);
          }
        }}
        onBlur={() => handleBlur('cardNumber')}
        error={getFieldError('cardNumber')}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          type="text"
          placeholder="MM/YY"
          name="expiryDate"
          value={expiryDate}
          onChange={(e) => {
            // Auto-format expiry date (max 5 chars)
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
              value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            setExpiryDate(value);
          }}
          onBlur={() => handleBlur('expiryDate')}
          error={getFieldError('expiryDate')}
          required
        />

        <Input
          label="CVV"
          type="text"
          placeholder="123"
          name="cvv"
          value={cvv}
          onChange={(e) => {
            // Only allow digits (max 4)
            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
            setCvv(value);
          }}
          onBlur={() => handleBlur('cvv')}
          error={getFieldError('cvv')}
          required
        />
      </div>

      <Input
        label="Cardholder Name"
        type="text"
        placeholder="John Doe"
        name="cardholderName"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        onBlur={() => handleBlur('cardholderName')}
        error={getFieldError('cardholderName')}
        required
      />

      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-medium mb-1">Secure Payment:</p>
        <p>Your card information is encrypted and secure. We do not store your card details.</p>
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={!isFormValid()}
        className={`w-full py-3 rounded-lg text-sm font-medium transition-all touch-manipulation min-h-[44px] ${
          isFormValid()
            ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Pay Now - UGX 50,000
      </button>
    </div>
  );

  return (
    <div className="mt-6 transition-all duration-300 ease-in-out" style={{ minHeight: '400px' }}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          {getMethodName()} Payment
        </h3>

        {/* Input Form (idle state) */}
        {paymentStatus === 'idle' && (
          <>
            {(selectedMethod === 'mtn' || selectedMethod === 'airtel') && renderMobileMoneyForm()}
            {selectedMethod === 'credit_card' && renderCreditCardForm()}
          </>
        )}

        {/* Pending Status */}
        {paymentStatus === 'pending' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              {/* Spinner */}
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              
              <p className="text-lg font-semibold text-gray-800 mb-2">Processing Payment...</p>
              <p className="text-sm text-gray-600 text-center">
                {selectedMethod === 'credit_card' 
                  ? 'Verifying your card details...'
                  : 'Please check your phone for the payment prompt.'}
                <br />
                This may take up to 5 minutes.
              </p>
              
              <div className="mt-4 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-800">
                  {selectedMethod === 'credit_card' 
                    ? `Card: •••• •••• •••• ${cardNumber.slice(-4)}`
                    : `Phone: ${phoneNumber}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Status */}
        {paymentStatus === 'success' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <p className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</p>
              <p className="text-sm text-gray-600 text-center mb-4">
                Your payment has been processed successfully.
              </p>
              
              <div className="w-full space-y-2">
                <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">
                    <span className="font-medium">Transaction Reference:</span><br />
                    {transactionReference}
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">
                      {selectedMethod === 'credit_card' ? 'Card:' : 'Phone:'}
                    </span>{' '}
                    {selectedMethod === 'credit_card' 
                      ? `•••• •••• •••• ${cardNumber.slice(-4)}`
                      : phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Failed Status */}
        {paymentStatus === 'failed' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              
              <p className="text-lg font-semibold text-red-800 mb-2">Payment Failed</p>
              <p className="text-sm text-gray-600 text-center mb-4">
                {errorMessage || 'Unable to process payment. Please try again.'}
              </p>
              
              <div className="w-full px-4 py-2 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-xs text-red-800">
                  <span className="font-medium">
                    {selectedMethod === 'credit_card' ? 'Card:' : 'Phone:'}
                  </span>{' '}
                  {selectedMethod === 'credit_card' 
                    ? `•••• •••• •••• ${cardNumber.slice(-4)}`
                    : phoneNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="w-full py-3 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 transition-all touch-manipulation min-h-[44px]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
