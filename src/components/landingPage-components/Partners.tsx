import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function Partners() {
  const { elementRef, isVisible } = useScrollAnimation()

  const partners = [
    'ICPAU',
    'ACCA',
    'CPA',
    'IFAC',
    'AAT',
    'CIMA',
    'IIA',
    'ISACA'
  ]

  return (
    <section className="bg-white py-12 sm:py-16 px-4 overflow-hidden">
      <h4 
        ref={elementRef}
        className={`text-center text-secondary text-[1.75rem] sm:text-[2rem] mb-8 sm:mb-12 font-bold transition-opacity duration-800 ${
          isVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'
        }`}
      >
        Our Partners
      </h4>
      <div className="max-w-full overflow-hidden relative py-6 sm:py-8 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100px] sm:before:w-[150px] before:h-full before:z-[2] before:pointer-events-none before:bg-gradient-to-r before:from-white before:to-transparent after:content-[''] after:absolute after:top-0 after:right-0 after:w-[100px] sm:after:w-[150px] after:h-full after:z-[2] after:pointer-events-none after:bg-gradient-to-l after:from-white after:to-transparent">
        <div className="flex gap-8 sm:gap-16 w-fit animate-scroll hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((partner, index) => (
            <h3
              key={index}
              className="text-[1.75rem] sm:text-[2.5rem] font-bold text-[#3b82f6] whitespace-nowrap min-w-[120px] sm:min-w-[150px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-120 hover:text-primary"
            >
              {partner}
            </h3>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default Partners
