import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getUser } from '../../utils/authStorage';

// APF Logo Asset
import logoPurple from '../../assets/logo_purple.png';

function PendingApprovalPage() {
  const [userName, setUserName] = useState("Member");

  useEffect(() => {
    // Get user details to personalize the greeting
    const user = getUser();
    if (user && user.firstName) {
      setUserName(user.firstName);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar forceSolid />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-10 pt-24">
        <div className="w-full max-w-2xl bg-white border border-purple-100 rounded-3xl shadow-xl shadow-purple-50 p-8 sm:p-12 md:p-16 text-center">
          
          {/* Branded Icon with Pulse Animation */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-purple-50 mb-10 relative">
            <div className="absolute inset-0 rounded-full "></div>
            <Link to="/">
          <img src={logoPurple} alt="APF Logo" className="h-10 sm:h-12 w-auto" />
        </Link>
          </div>

          {/* Personalized Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Thank you, {userName}!
          </h1>
          
          {/* Sub-headline */}
          <p className="mt-4 text-xl font-semibold text-[#5E2590]">
            Your Application is Under Review
          </p>

          {/* Detailed Description */}
          <div className="mt-8 space-y-5 text-slate-600 leading-relaxed text-base">
            <p>
              We have successfully received your membership application and payment. Your professional journey with the <span className="font-semibold text-gray-800">APF Uganda</span> is soon beginning
            </p>
            <p>
              To maintain the highest standards of our community, our administration team verifies all documents and qualifications. 
            </p>
          </div>

          {/* "What's Next" Box */}
          <div className="mt-12 bg-purple-50 border border-purple-100 rounded-2xl p-6 text-left flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="p-3 rounded-xl bg-white border border-purple-100">
                <Mail className="h-8 w-8 text-[#5E2590]" />
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-lg">Check Your Email</h4>
                <p className="text-sm text-slate-600 mt-1">
                    Once your application is approved, you will receive a confirmation email with instructions on how to access your full APF Member Dashboard.
                </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-8 py-3 rounded-xl bg-[#5E2590] text-white font-bold hover:bg-[#4a1d72] transition shadow-lg shadow-purple-200 min-h-[48px]"
            >
              Return to Homepage
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PendingApprovalPage;
