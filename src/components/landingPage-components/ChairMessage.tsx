import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { chairpersonMessage } from '../../data/chairpersonMessage'

function ChairMessage() {
  const { elementRef, isVisible } = useScrollAnimation()
  const { name: chairName, role: chairRole, fullMessage, photo } = chairpersonMessage

  return (
    <section className="bg-[#e9d5ff] py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start animate-[fadeIn_1s_ease-out]">
        {/* Profile Image Container */}
        <div className="relative overflow-hidden rounded-lg w-full max-w-[300px] h-[350px] flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] group flex-shrink-0 shadow-lg md:self-start">
          <img
            src={photo}
            alt={chairName}
            loading="lazy"
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
            {`${fullMessage.substring(0, 350)}...`}
          </div>

          {/* Read Full Message Button */}
          {fullMessage.length > 350 && (
            <Link
              to="/chairperson-message"
              className="text-primary font-semibold mt-4 mb-4 p-0 transition-all duration-300 bg-transparent text-sm sm:text-base hover:underline hover:translate-x-1.5"
            >
              Read Full Message {'\u2192'}
            </Link>
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
