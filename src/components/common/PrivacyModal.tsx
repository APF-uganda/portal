import { useEffect } from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
          <h2 className="text-lg font-semibold text-gray-900">Privacy Policy</h2>
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
          <p>
            At APF Uganda, one of our main priorities is the privacy of our visitors. This Privacy
            Policy document contains types of information that is collected and recorded by APF
            Uganda and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy,
            do not hesitate to contact us at{' '}
            <a href="mailto:info@apfuganda.org" className="text-purple-600 hover:underline">
              info@apfuganda.org
            </a>.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Log Files</h3>
          <p>
            APF Uganda follows a standard procedure of using log files. These files log visitors
            when they visit websites. The information collected by log files include internet
            protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time
            stamp, referring/exit pages, and possibly the number of clicks. These are not linked to
            any information that is personally identifiable. The purpose of the information is for
            analyzing trends, administering the site, tracking users' movement on the website, and
            gathering demographic information.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Cookies and Web Beacons</h3>
          <p>
            Like any other website, APF Uganda uses cookies. These cookies are used to store
            information including visitors' preferences, and the pages on the website that the
            visitor accessed or visited. The information is used to optimize the users' experience
            by customizing our web page content based on visitors' browser type and/or other
            information.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Third Party Privacy Policies</h3>
          <p>
            APF Uganda's Privacy Policy does not apply to other advertisers or websites. Thus, we
            are advising you to consult the respective Privacy Policies of these third-party ad
            servers for more detailed information. It may include their practices and instructions
            about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more
            detailed information about cookie management with specific web browsers, it can be found
            at the browsers' respective websites.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Children's Information</h3>
          <p>
            Another part of our priority is adding protection for children while using the internet.
            We encourage parents and guardians to observe, participate in, and/or monitor and guide
            their online activity.
          </p>
          <p>
            APF Uganda does not knowingly collect any Personal Identifiable Information from
            children under the age of 13. If you think that your child provided this kind of
            information on our website, we strongly encourage you to contact us immediately and we
            will do our best efforts to promptly remove such information from our records.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Online Privacy Policy Only</h3>
          <p>
            This Privacy Policy applies only to our online activities and is valid for visitors to
            our website with regards to the information that they shared and/or collect in APF
            Uganda. This policy is not applicable to any information collected offline or via
            channels other than this website.
          </p>

          <h3 className="font-semibold text-gray-900 pt-2">Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms
            and Conditions.
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
