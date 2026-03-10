import { useState } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import chairmanImg from '../../assets/images/landingPage-image/chair.jpeg'

function ChairMessage() {
  const { elementRef, isVisible } = useScrollAnimation()
  const [isExpanded, setIsExpanded] = useState(false)

  const chairName = 'CPA Micheal Tugyetwena'
  const chairRole = 'Board Chairperson - APF Uganda'
  const fullMessage = `Dear Colleagues and Partners,

It is a privilege to lead the Accountancy Practitioners Forum (APF) at such a transformative time for our profession. Our vision is clear: to be the premier catalyst for accountancy excellence in Uganda. We aspire to build a future where every licensed practice  regardless of size  is a beacon of integrity, innovation, and global professional trust.

Our commitment to the community is at the heart of everything we do. We are more than just a forum, we are a unified voice for the practitioners who safeguard the financial health of our nation. By championing advocacy, fostering a collaborative learning environment, and investing in "practice enablers" like AI and modern software, we ensure that our members are not just keeping pace with change, but leading it.

Looking ahead, our future goals are ambitious. We are focused on expanding our impact by influencing enabling policies that support high-quality services and nurturing the next generation of talent through mentorship. We aim to create a professional ecosystem where Ugandan practitioners are recognized as indispensable partners in the banking, insurance, and industrial sectors - driving sustainable economic growth across the region.

I invite you to join us on this journey as we elevate the standard of practice and redefine the impact of the accountancy profession in Uganda and beyond.

Together, we empower the profession.

Best regards,`

  return (
    <section className="bg-[#e9d5ff] py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start animate-[fadeIn_1s_ease-out]">
        {/* Profile Image Container */}
        <div className="relative overflow-hidden rounded-lg w-full max-w-[300px] h-[350px] flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] group flex-shrink-0 shadow-lg md:self-start">
          <img
            src={chairmanImg}
            alt={chairName}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 relative z-0 group-hover:scale-105"
          />
        </div>

        <div className="animate-[slideInRight_1s_ease-out] flex-1">
          <h4
            ref={elementRef}
            className={`text-secondary text-[1.75rem] sm:text-[2rem] mb-4 sm:mb-6 font-bold relative inline-block transition-all duration-[800ms] ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            A Message from the Board Chairperson
          </h4>

          {/* Message Content */}
          <div className="leading-relaxed text-[#333] text-sm sm:text-base whitespace-pre-line">
            {isExpanded ? fullMessage : `${fullMessage.substring(0, 350)}...`}
          </div>

          {/* Read More Button */}
          {fullMessage.length > 350 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary font-semibold mt-4 mb-4 p-0 transition-all duration-300 bg-transparent text-sm sm:text-base hover:underline hover:translate-x-1.5"
            >
              {isExpanded ? 'Show Less <-' : 'Read Full Message ->'}
            </button>
          )}

          <div className="mt-4 sm:mt-6 border-t border-purple-200 pt-4">
            <p className="font-bold text-sm sm:text-base">{chairName}</p>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem]">{chairRole}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </section>
  )
}

export default ChairMessage
