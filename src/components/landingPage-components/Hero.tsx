import heroImg from '../../assets/images/landingPage-image/landing_halo-section.jpg'

function Hero() {
  return (
    <section 
      className="h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center relative overflow-hidden pt-16 -mt-16 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImg})`,
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 animate-gradient-shift" />
      
      <div className="max-w-3xl mx-auto text-center text-white px-4 sm:px-6 md:px-8 relative z-10 animate-fade-in-up">
        <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[3rem] mb-4 sm:mb-6 font-bold animate-fade-in-up [animation-delay:0.2s] [animation-fill-mode:both] leading-tight">
          Advancing Accountancy<br />Excellence in Uganda
        </h2>
        <p className="text-sm sm:text-base md:text-[1.1rem] mb-6 sm:mb-8 leading-relaxed animate-fade-in-up [animation-delay:0.4s] [animation-fill-mode:both]">
          The Accountancy Practitioners Forum (APF Uganda) is the leading voice for ethical practice, professional development, and policy advocacy in the Ugandan accountancy sector.
        </p>
        <button className="bg-white text-secondary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-[30px] font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out animate-fade-in-up [animation-delay:0.6s] [animation-fill-mode:both] hover:bg-primary hover:text-white hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)]">
          Become a Member
        </button>
      </div>
    </section>
  )
}

export default Hero
