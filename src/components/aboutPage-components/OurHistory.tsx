import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { History, ChevronRight } from 'lucide-react'

function OurHistory() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="bg-[#F3F4F6] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">

          <div>
          
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-[#6A1B9A] flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
            </div>

            <h4
              ref={elementRef}
              className={`text-[#1e293b] text-[1.875rem] mb-6 font-bold transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Our History
            </h4>

            <p className="leading-[1.7] text-[#374151] max-w-xl">
              The Accountancy Practitioners Forum (APF Uganda) is the leading professional
              body dedicated to advancing the accountancy profession in Uganda. We uphold
              ethical standards, foster professional development, and advocate for policies
              that benefit our members and the nation's economic growth.
            </p>
          </div>

         
          <div className="border-l-2 border-purple-700 pl-8">
            {[
              'Become a Member',
              'Our Events',
              'News & Insights',
              "Chairman’s Message",
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-4 cursor-pointer transition-all duration-300 hover:translate-x-2 border-b border-gray-200 last:border-b-0"
              >
                
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#6A1B9A]">
                <ChevronRight className="w-6 h-6 size={14} strokeWidth={3} text-[#ffffff] shrink-0" />
           </div>
               
                <p className="text-[#6A1B9A] font-bold">
                  {text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default OurHistory
