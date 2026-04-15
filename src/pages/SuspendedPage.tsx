import { Link } from 'react-router-dom'
import { AlertTriangle, CreditCard, Mail } from 'lucide-react'
import logoPurple from '../assets/logo_purple.png'

interface SuspendedPageProps {
  suspensionType?: 'non_payment' | 'policy_violation'
  reason?: string
  suspendedAt?: string
}

export default function SuspendedPage({ suspensionType = 'non_payment', reason, suspendedAt }: SuspendedPageProps) {
  const isNonPayment = suspensionType === 'non_payment'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center space-y-6">

        {/* Logo */}
        <img src={logoPurple} alt="APF Uganda" className="h-12 mx-auto" />

        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Suspended</h1>
          {suspendedAt && (
            <p className="text-sm text-gray-500 mt-1">Suspended on {suspendedAt}</p>
          )}
        </div>

        {/* Reason */}
        {reason && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left">
            <p className="text-sm font-semibold text-red-700 mb-1">Reason</p>
            <p className="text-sm text-red-600">{reason}</p>
          </div>
        )}

        {/* Message */}
        {isNonPayment ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              Your account has been suspended due to non-payment of your annual membership subscription fee of <strong>UGX 150,000</strong>.
              To regain full access, please renew your membership.
            </p>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-left text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-purple-700 mb-2">How to reactivate:</p>
              <p>1. Click "Renew Membership" below</p>
              <p>2. Select Membership Renewal as payment type</p>
              <p>3. Pay UGX 150,000 via MTN, Airtel, or Bank Transfer</p>
              <p>4. Upload your proof of payment</p>
              <p>5. Our team will verify and reactivate within 24 hours</p>
            </div>

            <Link
              to="/payments"
              className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Renew Membership
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              Your account has been suspended due to a policy violation. Please contact our support team to discuss your account status.
            </p>

            <a
              href="mailto:admin@apfuganda.org"
              className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
          </div>
        )}

        <p className="text-xs text-gray-400">
          APF Uganda &nbsp;|&nbsp; <a href="mailto:info@apfuganda.org" className="text-purple-600 hover:underline">info@apfuganda.org</a>
        </p>
      </div>
    </div>
  )
}
