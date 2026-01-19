import { Eye, Calendar } from 'lucide-react'

function VisionMission() {
  const objectives = [
    { icon: '🎯', text: 'Advocacy & Representation' },
    { icon: '🤝', text: 'Networking & Collaboration' },
    { icon: '📋', text: 'Policy Engagement' },
    { icon: '🎓', text: 'Learning Community' },
    { icon: '👁️', text: 'Public Awareness' },
    { icon: '📚', text: 'Knowledge Hub' },
    { icon: '💼', text: 'Innovation & Talent' },
    { icon: '⚖️', text: 'Practice Enablers' }
  ]

  return (
    <section className="bg-[#f9fafb] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-full p-10 rounded-xl bg-gradient-to-br from-primary to-[#5b21b6] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6">
              <Eye className="w-10 h-10" />
            </div>
            <h4 className="text-[1.875rem] mb-4 font-bold">
              Our Vision
            </h4>
            <p className="leading-[1.7] opacity-95">
              To be the leading voice in uplifting standards advancing a strong, 
              ethical and globally competitive accountancy profession in Uganda and beyond.
            </p>
          </div>

          <div className="h-full p-10 rounded-xl bg-white border-2 border-[#e5e7eb] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h4 className="text-[#1e293b] text-[1.875rem] mb-4 font-bold">
              Our Mission
            </h4>
            <p className="text-[#374151] leading-[1.7]">
              To empower accounting professionals through collaborative, continuous 
              learning, ethical engagement, and advocacy, strengthening the 
              accountancy profession in Uganda.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="p-10 rounded-xl shadow-md bg-white">
              <h4 className="text-[#1e293b] text-[1.875rem] mb-8 font-bold text-center">
                Our Objectives
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {objectives.map((obj, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 transition-all duration-300 rounded-lg hover:bg-[#f3f4f6]"
                  >
                    <span className="text-2xl">
                      {obj.icon}
                    </span>
                    <p className="text-[#1f2937] text-sm">
                      {obj.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionMission
