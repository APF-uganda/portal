import { useState, useEffect, useCallback, useRef } from "react";
import PaymentOption from "./PaymentOption";
import { PaymentForms } from "../PaymentForms";
import mtnLogo from "../../../assets/images/registerPage-images/mtn.png";
import airtelLogo from "../../../assets/images/registerPage-images/airtel.png";
import dfcuLogo from "../../../assets/images/registerPage-images/dfcu.jpg";
import { PaymentData, PaymentMethod } from "../../../types/registration";
import TermsModal from "../../common/TermsModal";
import PrivacyModal from "../../common/PrivacyModal";

const REFERENCE_STORAGE_KEY = 'registration_application_reference';

/**
 * Generate a temporary application reference ID in format APF-YYYY-XXXXXX.
 * This mirrors the backend's generate_application_id logic so the user has
 * a consistent reference before the application is submitted.
 */
function generateApplicationReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000; // 6-digit number
  return `APF-${year}-${String(random).padStart(6, '0')}`;
}

interface PaymentStepsProps {
  data?: PaymentData | null;
  onChange?: (data: PaymentData) => void;
  onValidationChange?: (isValid: boolean) => void;
  onPaymentComplete?: () => void; // Callback when payment is successfully completed
}

function PaymentsStep({ data, onChange, onValidationChange, onPaymentComplete }: PaymentStepsProps) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    data?.method || null
  );
  const [, setPaymentData] = useState<PaymentData | null>(data || null);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Generate or restore a stable application reference ID for this session.
  // Computed once on first render and stored in a ref so it never changes.
  const applicationReference = useRef<string>('');
  if (!applicationReference.current) {
    const stored = sessionStorage.getItem(REFERENCE_STORAGE_KEY);
    if (stored) {
      applicationReference.current = stored;
    } else {
      const ref = generateApplicationReference();
      sessionStorage.setItem(REFERENCE_STORAGE_KEY, ref);
      applicationReference.current = ref;
    }
  }

  // Restore consent state from data if available
  useEffect(() => {
    if (data) {
      setPaymentMethod(data.method);
      setPaymentData(data);
      setIsPaymentValid(data.isValidated);
    }
  }, [data]);

  // Update validation state based on consent and payment validation
  useEffect(() => {
    // Both consent checkboxes must be checked and payment must be valid
    const isValid = agreeTerms && isPaymentValid;
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [agreeTerms, isPaymentValid, onValidationChange]);

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    const paymentMethodValue = method as PaymentMethod;
    setPaymentMethod(paymentMethodValue);
    
    // Clear previous payment data when method changes (Requirement 5.3)
    const newPaymentData: PaymentData = {
      method: paymentMethodValue,
      status: 'idle',
      isValidated: false,
      applicationReference: applicationReference.current,
    };
    setPaymentData(newPaymentData);
    setIsPaymentValid(false);
    
    if (onChange) {
      onChange(newPaymentData);
    }
  };

  // Handle payment data change from PaymentForms
  const handlePaymentDataChange = useCallback((data: PaymentData) => {
    // Always carry the reference ID forward
    const enriched = { ...data, applicationReference: applicationReference.current };
    setPaymentData(enriched);
    if (onChange) {
      onChange(enriched);
    }
  }, [onChange, applicationReference]);

  // Handle payment validation result from PaymentForms
  const handlePaymentValidated = useCallback((isValid: boolean) => {
    setIsPaymentValid(isValid);
    // Note: Payment data is already updated by handlePaymentDataChange
    // No need to update it again here to avoid overwriting the status
  }, []);

  return (
    <div className="space-y-6">
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* CONSENT & DECLARATION */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Consent & Declaration
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-1 accent-purple-600"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-purple-600 hover:underline"
              >
                Terms &amp; Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-purple-600 hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </div>
      </div>

      {/* APPLICATION FEE - Only show if consent is given */}
      {agreeTerms && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Application Fee
          </h3>

          <p className="text-xl font-semibold text-[#5F1C9F] mt-2">
            UGX 50,000
          </p>

          <p className="text-sm text-gray-600 mt-1">
            This is a one-time non-refundable application fee. Payment does not
            guarantee membership approval.
          </p>

          {/* PAYMENT OPTIONS */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Payment Options
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PaymentOption
                label="MTN Mobile Money"
                value="mtn"
                logo={mtnLogo}
                selected={paymentMethod}
                onSelect={handlePaymentMethodSelect}
              />

              <PaymentOption
                label="Airtel Money"
                value="airtel"
                logo={airtelLogo}
                selected={paymentMethod}
                onSelect={handlePaymentMethodSelect}
              />

              <PaymentOption
                label="Bank Transfer"
                value="bank"
                logo={dfcuLogo}
                selected={paymentMethod}
                onSelect={handlePaymentMethodSelect}
              />
            </div>
          </div>

          {/* PAYMENT FORMS - Conditional based on selected method */}
          {paymentMethod && (
            <PaymentForms
              selectedMethod={paymentMethod}
              onPaymentDataChange={handlePaymentDataChange}
              onPaymentValidated={handlePaymentValidated}
              onPaymentComplete={onPaymentComplete}
              applicationReference={applicationReference.current}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentsStep;
