import { Eye, Calendar, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

function VisionMission() {
  const [openObjectives, setOpenObjectives] = useState(false)

  const objectives = [
    'Advocacy & Representation',
    'Networking & Collaboration',
    'Policy Engagement',
    'Learning Community',
    'Public Awareness',
    'Knowledge Hub',
    'Innovation & Talent',
    'Practice Enablers'
  ]

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

          <div className="h-full p-10 rounded-xl bg-purple-700 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Eye className="w-10 h-10 mb-6" />

            <h4 className="text-3xl font-bold mb-4">
              Our Vision
            </h4>

            <p className="leading-[1.7] text-white/90">
              To be the leading voice in uplifting standards and advancing a strong,
              ethical, and globally competitive accountancy profession in Uganda
              and beyond.
            </p>
          </div>

          
          <div className="h-full p-10 rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Calendar className="w-10 h-10 text-purple-700 mb-6" />

            <h4 className="text-3xl font-bold text-slate-800 mb-4">
              Our Mission
            </h4>

            <p className="text-gray-700 leading-[1.7]">
              To empower accounting professionals through collaborative and
              continuous learning, ethical engagement, and advocacy while
              strengthening the accountancy profession in Uganda.
            </p>
          </div>

          <div className="pt-4">

            
            <button
  onClick={() => setOpenObjectives(!openObjectives)}
  className="flex items-center gap-2 text-left"
>
  <h4 className="text-3xl font-bold text-slate-800">
    Our Objectives
  </h4>

  <ChevronDown
    className={`w-6 h-6 text-purple-700 transition-transform duration-300 ${
      openObjectives ? 'rotate-180' : ''
    }`}
  />
</button>


            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openObjectives ? 'max-h-[500px] mt-6' : 'max-h-0'
              }`}
            >
              <ul className="space-y-4">
                {objectives.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-700 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-white stroke-[3]" />
                    </div>

                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        
        <div className="mt-12 text-center">
        <button className="bg-purple-700 hover:bg-purple-800 text-white px-10 py-4 text-base font-semibold rounded-[25px] shadow-[0_4px_6px_rgba(124,58,237,0.3)] transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(124,58,237,0.4)]">
          Join APF
        </button>
        </div>

      </div>
    </section>
  )
}

export default VisionMission
