import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { Clock } from 'lucide-react'

function OurHistory() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
          <div>
            <div className="mb-4">
              <Clock className="w-12 h-12 text-primary" />
            </div>
            <h4 
              ref={elementRef}
              className={`text-[#1e293b] text-[1.875rem] mb-6 font-bold transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Our History
            </h4>
            <p className="leading-[1.7] text-[#374151]">
              The Accountancy Practitioners Forum (APF Uganda) is the leading professional 
              body dedicated to advancing the accountancy profession in Uganda. We uphold 
              ethical standards, foster professional development, and advocate for policies 
              that benefit our members and the nation's economic growth.
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-8">
            {[
              { icon: '👤', text: 'Become a Member' },
              { icon: '📅', text: 'Our Events' },
              { icon: '📰', text: 'News & Insights' },
              { icon: '💬', text: "Chairman's message" },
            ].map((link, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 py-4 cursor-pointer transition-all duration-300 hover:text-primary hover:translate-x-2"
              >
                <span className="text-xl">{link.icon}</span>
                <p className="text-[#1f2937]">{link.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurHistory
