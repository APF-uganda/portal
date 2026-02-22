import { useScrollAnimation } from '../../hooks/useScrollAnimation'

interface PartnerItem {
  name?: string;
  logo?: {
    url: string;
  };
}

function Partners({ data }: { data: PartnerItem[] }) {
  const { elementRef, isVisible } = useScrollAnimation()

  // Fallback partners if CMS is empty
  const defaultPartners = [
    { name: 'ICPAU', logo: { url: '/ICPAU.jfif' } },
    { name: 'ACCA', logo: { url: '/ACCA.jfif' } },
    { name: 'UBA', logo: { url: '/uba.png' } },
  ]

  const items = data && data.length > 0 ? data : defaultPartners;

  // Helper to handle image URLs
  const getLogoUrl = (item: PartnerItem) => {
    const url = item.logo?.url;
    if (!url) return '';
  
    return url.startsWith('/') && !url.includes('.') ? `http://localhost:1337${url}` : url;
  };

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
          {[...items, ...items].map((partner, index) => (
            <img
              key={index}
              src={getLogoUrl(partner)}
              alt={partner.name || 'Partner Logo'}
              className="h-16 sm:h-24 object-contain min-w-[120px] sm:min-w-[150px] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
              onError={(e) => {
               
                e.currentTarget.style.display = 'none';
              }}
            />
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
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default Partners