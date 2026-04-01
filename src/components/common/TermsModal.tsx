import { useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Terms &amp; Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 text-sm text-gray-700 space-y-4 leading-relaxed">
          <p>Welcome to APF Uganda!</p>
          <p>
            These terms and conditions outline the rules and regulations for the use of APF Uganda's
            website and portal. By accessing this website we assume you accept these terms and
            conditions. Do not continue to use APF Uganda if you do not agree to take all of the
            terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and
            Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the
            person logged on this website and compliant to the Company's terms and conditions. "The
            Company", "Ourselves", "We", "Our" and "Us", refers to APF Uganda. "Party", "Parties",
            or "Us", refers to both the Client and ourselves. All terms refer to the offer,
            acceptance and consideration of payment necessary to undertake the process of our
            assistance to the Client in the most appropriate manner for the express purpose of
            meeting the Client's needs in respect of provision of the Company's stated services, in
            accordance with and subject to, prevailing law of Uganda.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Cookies</h3>
          <p>
            We employ the use of cookies. By accessing APF Uganda, you agreed to use cookies in
            agreement with APF Uganda's Privacy Policy. Most interactive websites use cookies to let
            us retrieve the user's details for each visit. Cookies are used by our website to enable
            the functionality of certain areas to make it easier for people visiting our website.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">License</h3>
          <p>
            Unless otherwise stated, APF Uganda and/or its licensors own the intellectual property
            rights for all material on APF Uganda. All intellectual property rights are reserved.
            You may access this from APF Uganda for your own personal use subjected to restrictions
            set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Republish material from APF Uganda</li>
            <li>Sell, rent or sub-license material from APF Uganda</li>
            <li>Reproduce, duplicate or copy material from APF Uganda</li>
            <li>Redistribute content from APF Uganda</li>
          </ul>
          <p>
            This Agreement shall begin on the date hereof. Parts of this website offer an
            opportunity for users to post and exchange opinions and information in certain areas of
            the website. APF Uganda does not filter, edit, publish or review Comments prior to their
            presence on the website. Comments do not reflect the views and opinions of APF Uganda,
            its agents and/or affiliates.
          </p>
          <p>
            APF Uganda reserves the right to monitor all Comments and to remove any Comments which
            can be considered inappropriate, offensive or causes breach of these Terms and
            Conditions.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Hyperlinking to our Content</h3>
          <p>
            The following organizations may link to our Website without prior written approval:
            Government agencies; Search engines; News organizations; Online directory distributors;
            and System wide Accredited Businesses.
          </p>
          <p>
            No use of APF Uganda's logo or other artwork will be allowed for linking absent a
            trademark license agreement.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">iFrames</h3>
          <p>
            Without prior approval and written permission, you may not create frames around our
            Webpages that alter in any way the visual presentation or appearance of our Website.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Content Liability</h3>
          <p>
            We shall not be held responsible for any content that appears on your Website. You agree
            to protect and defend us against all claims that is rising on your Website.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Reservation of Rights</h3>
          <p>
            We reserve the right to request that you remove all links or any particular link to our
            Website. We also reserve the right to amend these terms and conditions and its linking
            policy at any time.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Disclaimer</h3>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations,
            warranties and conditions relating to our website and the use of this website. As long
            as the website and the information and services on the website are provided free of
            charge, we will not be liable for any loss or damage of any nature.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
