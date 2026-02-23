import { useScrollAnimation } from '../../hooks/useScrollAnimation'

interface PartnerItem {
  name?: string;
  logo?: any; 
}

function Partners({ data }: { data: PartnerItem[] }) {
  const { elementRef, isVisible } = useScrollAnimation()

  // Fallback partners if CMS is empty
  const defaultPartners = [
    { name: 'ICPAU', logo: '/ICPAU.jfif' },
    { name: 'ACCA', logo: '/ACCA.jfif' },
    { name: 'UBA', logo: '/uba.png' },
  ]

  const items = data && data.length > 0 ? data : defaultPartners;

  const getLogoUrl = (item: any) => {
    if (!item || !item.logo) return '';

    
    const logoObj = item.logo.data ? item.logo.data.attributes : item.logo;
    const rawUrl = logoObj?.url || (typeof item.logo === 'string' ? item.logo : '');

   
    if (!rawUrl || typeof rawUrl !== 'string') return '';

    if (rawUrl.startsWith('/')) {
    
      const isLocalAsset = rawUrl.includes('.') && !rawUrl.startsWith('/uploads');
      if (isLocalAsset) return rawUrl;
      
      return `http://localhost:1337${rawUrl}`;
    }
    
    return rawUrl;
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

      <div className="max-w-full overflow-hidden relative py-6 sm:py-8 
        before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100px] sm:before:w-[150px] before:h-full before:z-[2] before:pointer-events-none before:bg-gradient-to-r before:from-white before:to-transparent 
        after:content-[''] after:absolute after:top-0 after:right-0 after:w-[100px] sm:after:w-[150px] after:h-full after:z-[2] after:pointer-events-none after:bg-gradient-to-l after:from-white after:to-transparent">
       
        <div className="flex gap-8 sm:gap-16 w-fit animate-scroll hover:[animation-play-state:paused]">
         
          {[...items, ...items].map((partner, index) => {
            const logoPath = getLogoUrl(partner);
            
            if (!logoPath) return null;

            return (
              <img
                key={index}
                src={logoPath}
                alt={partner.name || 'Partner Logo'}
                className="h-16 sm:h-24 object-contain min-w-[120px] sm:min-w-[150px] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  console.warn("Failed to load image:", logoPath);
                  e.currentTarget.style.display = 'none';
                }}
              />
            );
          })}
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