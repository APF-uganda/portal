import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import workImg from '../../assets/images/aboutPage-images/our_work1.png'

function OurWork() {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 
              ref={elementRef}
              className={`text-[#1e293b] text-[1.875rem] mb-6 font-bold transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Our Work
            </h4>
            <p className="leading-[1.7] text-[#374151]">
              APF supports its accounting professionals through advocacy, consultation, 
              and professional development. We promote ethical practice, influence policy, 
              shape standards and provide platforms that help practitioners thrive, 
              innovate and lead within the profession.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl group">
            <img 
              src={workImg} 
              alt="APF Team Collaboration"
              className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurWork
