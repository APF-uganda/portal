import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { CMS_BASE_URL } from '../../config/api';

interface PartnerItem {
  name?: string;
  logo?: any; 
}

function Partners({ data }: { data?: PartnerItem[] }) {
  const { elementRef, isVisible } = useScrollAnimation()

  const defaultPartners = [
    { name: 'ICPAU', logo: '/ICPAU.png' },
    { name: 'ICPAU', logo: '/ICPAU.png' },
  ]

  const items = Array.isArray(data) && data.length > 0 ? data : defaultPartners;

  const getLogoUrl = (item: any) => {
    if (!item) return '';
    if (typeof item.logo === 'string') return item.logo;
    const logoData = item.logo?.data?.attributes || item.logo?.attributes || item.logo;
    const path = logoData?.url || '';
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${CMS_BASE_URL}${path}`;
    return path;
  };

  const validItems = items.filter(item => getLogoUrl(item));

  // Repeat enough copies so the strip is always wider than the viewport
  const copies = Math.max(4, Math.ceil(12 / validItems.length));
  const strip = Array.from({ length: copies }, () => validItems).flat();

  // ~3s per logo feels natural
  const duration = validItems.length * 3;

  return (
    <section className="bg-white py-12 sm:py-16 px-4 overflow-hidden min-h-[200px]">
      <h4
        ref={elementRef}
        className={`text-center text-secondary text-[1.75rem] sm:text-[2rem] mb-8 sm:mb-12 font-bold transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        Our Partners
      </h4>

      <div className="max-w-full overflow-hidden relative py-6 sm:py-8">
        <div
          className="flex gap-12 sm:gap-24 w-max items-center partners-scroll"
          style={{ '--scroll-duration': `${duration}s` } as React.CSSProperties}
        >
          {strip.map((partner, index) => (
            <div key={index} className="flex-shrink-0 px-4">
              <img
                src={getLogoUrl(partner)}
                alt={partner.name || 'Partner Logo'}
                loading="lazy"
                className="h-16 sm:h-24 w-auto object-contain block"
                style={{ minWidth: '140px' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes partners-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / ${copies})); }
        }
        .partners-scroll {
          animation: partners-scroll var(--scroll-duration, 30s) linear infinite;
        }
        .partners-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}


export default Partners
