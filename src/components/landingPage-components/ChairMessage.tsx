import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import chairmanImg from '../../assets/images/landingPage-image/chair.jpg'

function ChairMessage() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="bg-[#e9d5ff] py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center animate-[fadeIn_1s_ease-out]">
        <div className="relative overflow-hidden rounded-lg w-full max-w-[300px] h-[350px] flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] group flex-shrink-0">
          <img
            src={chairmanImg}
            alt="CPA Ronald Mukumba - Chairperson APF Uganda"
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 relative z-0 group-hover:scale-105"
            onError={(e) => {
              console.error('Image failed to load:', chairmanImg)
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        
        <div className="animate-[slideInRight_1s_ease-out] flex-1">
          <h4 
            ref={elementRef}
            className={`text-secondary text-[1.75rem] sm:text-[2rem] mb-4 sm:mb-6 font-bold relative inline-block transition-all duration-[800ms] ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            Message from the Director
          </h4>
          <p className="leading-relaxed text-[#333] mb-4 text-sm sm:text-base">
            It is with immense pleasure that I welcome you to the Accountancy Practitioners Forum (APF Uganda). Our mission is clear: to champion advocacy, integrity, and innovation within the accounting profession across Uganda. We are committed to fostering a culture of excellence where continuous learning is paramount, and where the collective voice of our members drives meaningful change. Together, we build a stronger, more credible profession for a prosperous future.
          </p>
          <p className="font-bold mt-4 sm:mt-6 text-sm sm:text-base">
            CPA Ronald Mutumba
          </p>
          <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem]">
            Director - APF Uganda
          </p>
          <button 
            onClick={() => console.log('Navigate to full message')}
            className="text-primary font-semibold mt-3 sm:mt-4 p-0 transition-all duration-300 bg-transparent text-sm sm:text-base hover:underline hover:translate-x-1.5"
          >
            Read Full Message →
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}

export default ChairMessage
