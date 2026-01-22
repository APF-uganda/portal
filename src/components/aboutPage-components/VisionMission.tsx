import { Rocket, Target, CircleCheckBig, ChevronDown } from 'lucide-react'
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
    <section className="bg-[#F7F2FD] py-16 px-4">
      <div className="max-w-6xl mx-auto ">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20 items-start">

          <div className="relative h-full p-10 rounded-xl bg-[#6A1B9A] text-white shadow-sm">
            
            <div className="absolute top-6 right-6 w-10 h-10  flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>

            <h4 className="text-2xl font-semibold mb-4">
              Our Vision
            </h4>

            <p className="leading-[1.7] text-white/90 text-sm">
              To be the leading voice in uplifting standards and advancing a strong,
              ethical, and globally competitive accountancy profession in Uganda
              and beyond.
            </p>
          </div>

        
          <div className="relative h-full p-10 rounded-xl bg-white border border-gray-200 shadow-sm">
           
            <div className="absolute top-6 right-6 w-10 h-10  flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-700" />
            </div>

            <h4 className="text-2xl font-semibold text-slate-800 mb-4">
              Our Mission
            </h4>

            <p className="text-gray-600 leading-[1.7] text-sm">
              To empower accounting professionals through collaborative and
              continuous learning, ethical engagement, and advocacy while
              strengthening the accountancy profession in Uganda.
            </p>
          </div>

         
          <div className="pt-6 lg:ml-12 pb-2 border-b border-slate-200 mb-6 w-fit">

            
            <button
              onClick={() => setOpenObjectives(!openObjectives)}
              className="flex items-center gap-2"
            >
              <h4 className="text-2xl font-semibold text-slate-800">
                Our Objectives
              </h4>

              <ChevronDown
                className={`w-5 h-5 text-purple-700 transition-transform duration-300 ${
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
                   
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      <CircleCheckBig className="size={24} text-black-500" />
                    </div>

                    <span className="text-gray-600 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

       

      </div>
    </section>
  )
}

export default VisionMission
