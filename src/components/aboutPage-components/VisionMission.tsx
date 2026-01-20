import { Eye, Calendar, Check } from 'lucide-react'

function VisionMission() {
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

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          
          <div className="h-full p-10 rounded-xl bg-primary text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6">
              <Eye className="w-10 h-10 stroke-current" />
            </div>

            <h4 className="text-3xl font-bold mb-4">
              Our Vision
            </h4>

            <p className="leading-[1.7] opacity-95">
              To be the leading voice in uplifting standards and advancing a strong,
              ethical, and globally competitive accountancy profession in Uganda
              and beyond.
            </p>
          </div>

         
          <div className="h-full p-10 rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6">
              <Calendar className="w-10 h-10 text-primary stroke-current" />
            </div>

            <h4 className="text-3xl font-bold text-slate-800 mb-4">
              Our Mission
            </h4>

            <p className="text-gray-700 leading-[1.7]">
              To empower accounting professionals through collaborative and
              continuous learning, ethical engagement, and advocacy while
              strengthening the accountancy profession in Uganda.
            </p>
          </div>

          
          <div className="h-full p-10 rounded-xl bg-white border border-gray-200">
            <h4 className="text-3xl font-bold text-slate-800 mb-6">
              Our Objectives
            </h4>

            <ul className="space-y-4">
              {objectives.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 stroke-current" />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        
        <div className="mt-12 text-center">
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300">
            Join APF
          </button>
        </div>

      </div>
    </section>
  )
}

export default VisionMission
