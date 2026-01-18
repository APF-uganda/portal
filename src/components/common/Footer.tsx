import { Facebook, Linkedin, Youtube } from 'lucide-react'
import logoBlue from '../../assets/logo_blue.png'

// Custom X (Twitter) logo component
const XLogo = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 py-6">
          {/* Logo and Description Section */}
          <div>
            <img
              src={logoBlue}
              alt="APF Logo"
              className="h-[60px] mb-3"
            />
            <p className="text-gray-400 leading-relaxed mb-3 max-w-[400px] text-[0.875rem]">
              The Accountancy Practitioners Forum (APF Uganda) is dedicated to fostering excellence and promoting the highest standards in the accountancy profession in Uganda.
            </p>
            <div className="flex gap-1.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center no-underline cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(24,119,242,0.3)]"
              >
                <Facebook size={18} />
              </a>
              
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center no-underline cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
              >
                <XLogo size={18} />
              </a>
              
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center no-underline cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(10,102,194,0.3)]"
              >
                <Linkedin size={18} />
              </a>
              
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center no-underline cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(255,0,0,0.3)]"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h6 className="text-gray-800 mb-3 text-base font-semibold">
              Quick Links
            </h6>
            <ul className="list-none p-0 m-0">
              {['Membership', 'Governance', 'Policy Documents', 'Annual Reports', 'FAQs'].map((link) => (
                <li key={link} className="mb-2">
                  <a
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 no-underline text-[0.95rem] transition-colors duration-200 ease-in-out hover:text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h6 className="text-gray-800 mb-3 text-base font-semibold">
              Connect
            </h6>
            <ul className="list-none p-0 m-0">
              {['Member Directory', 'Partners', 'Sponsorship'].map((link) => (
                <li key={link} className="mb-2">
                  <a
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 no-underline text-[0.95rem] transition-colors duration-200 ease-in-out hover:text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-gray-400 text-sm">
            © 2025 APF Uganda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
