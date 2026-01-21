import { useState } from "react";
import PaymentOption from "./PaymentOption";
import mtnLogo from "../../../assets/images/registerPage-images/mtn.png";
import airtelLogo from "../../../assets/images/registerPage-images/airtel.png";
import dfcuLogo from "../../../assets/images/registerPage-images/dfcu.jpg"; 

function PaymentsStep() {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [consentEKYC, setConsentEKYC] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="space-y-6">
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
              checked={consentEKYC}
              onChange={(e) => setConsentEKYC(e.target.checked)}
            />
            <span>
              I consent to electronic identity verification (eKYC)
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-1 accent-purple-600"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a
                href="#"
                className="text-purple-600 hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-purple-600 hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
      </div>

      {/* APPLICATION FEE */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-gray-800 mb-2">
          Application Fee
        </h3>

        <p className="text-xl font-semibold text-gray-900 mt-2">
          UGX 50,000
        </p>

        <p className="text-sm text-gray-600 mt-1">
          This is a one-time application processing fee. Payment does not
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
              onSelect={setPaymentMethod}
            />

            <PaymentOption
              label="Airtel Money"
              value="airtel"
              logo={airtelLogo}
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />

            <PaymentOption
              label="DFCU Bank"
              value="dfcu"
              logo={dfcuLogo}
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>
        </div>

        {/* PROCEED BUTTON */}
        <button
          type="button"
          disabled={!paymentMethod}
          className={`w-full mt-6 py-3 rounded-lg text-sm font-medium
            ${
              paymentMethod
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentsStep;
