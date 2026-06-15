import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, X, CreditCard, Calendar } from 'lucide-react';

interface RenewalReminderModalProps {
  expiredDate: string;   // formatted string e.g. "31 March 2025"
  daysOverdue: number;
  onDismiss: () => void;
}

const RenewalReminderModal: React.FC<RenewalReminderModalProps> = ({
  expiredDate,
  daysOverdue,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-5 relative">
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                Membership Renewal Required
              </h2>
              <p className="text-white/80 text-sm">
                Your membership has expired
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Expiry info */}
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
            <Calendar className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Expired on <span className="text-red-600">{expiredDate}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {daysOverdue === 1
                  ? '1 day overdue'
                  : `${daysOverdue} days overdue`}
              </p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600 leading-relaxed">
            To maintain full access to APF Uganda's resources, CPD events, networking
            forums, and member benefits, please renew your membership now.
          </p>

          {/* What you lose */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700 mb-2">
              Without renewal you will lose access to:
            </p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• CPD events and workshops</li>
              <li>• Member forums and networking</li>
              <li>• Practitioner toolkits and resources</li>
              <li>• Member certificate downloads</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/payments"
            onClick={onDismiss}
            className="flex-1 flex items-center justify-center gap-2 bg-[#5E2590] hover:bg-[#4a1d73] text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Renew Now
          </Link>
          <button
            onClick={onDismiss}
            className="flex-1 text-gray-600 hover:text-gray-800 font-medium text-sm px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewalReminderModal;
