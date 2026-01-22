import { useNavigate } from 'react-router-dom'
import heroImg from '../../assets/images/landingPage-image/landing_halo-section.jpg'

function Hero() {
  const navigate = useNavigate()

  const handleBecomeAMember = () => {
    navigate('/register')
  }

  return (
    <section 
      className="min-h-[500px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[700px] flex items-center relative overflow-hidden pt-16 -mt-16 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImg})`,
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 animate-gradient-shift" />
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-3xl text-white text-center md:text-left animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] mb-4 sm:mb-6 md:mb-8 font-bold leading-tight animate-fade-in-up [animation-delay:0.2s] [animation-fill-mode:both]">
            <span className="block">Advancing Accountancy</span>
            <span className="block">Excellence in Uganda</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-[1.25rem] mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto md:mx-0 animate-fade-in-up [animation-delay:0.4s] [animation-fill-mode:both]">
            The Accountancy Practitioners Forum (APF Uganda) is the leading voice for ethical practice, professional development, and policy advocacy in the Ugandan accountancy sector.
          </p>
          <button 
            onClick={handleBecomeAMember}
            className="bg-transparent text-white border-2 border-white px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg rounded-full font-semibold transition-all duration-300 ease-in-out animate-fade-in-up [animation-delay:0.6s] [animation-fill-mode:both] hover:bg-white hover:text-purple-700 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)]"
          >
            Become a Member
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
