import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { boardMembers } from '../../data/boardMembers';

function OurGovernance() {
  const navigate = useNavigate();
  const { elementRef, isVisible } = useScrollAnimation();
  const imageClass =
    'w-[220px] h-[220px] rounded-[2.5rem] mx-auto bg-slate-50 shadow-md overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]';
  const leaders = boardMembers;

  return (
    <section id="governance" className="bg-[#FBFAFF] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 
            ref={elementRef}
            className={`text-secondary text-[2.5rem] mb-4 font-bold transition-all duration-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Our Governance
          </h3>
          <p className="text-[#666] max-w-[700px] mx-auto text-lg">
            Meet the dedicated leaders who steer APF Uganda towards its vision of 
            professional excellence and integrity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {leaders.slice(0, 6).map((leader) => (
            <div 
              key={leader.id} 
              className="group text-center p-8 rounded-[2.5rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(92,50,163,0.1)] border border-transparent hover:border-purple-50"
            >
              <button
                type="button"
                onClick={() => navigate(`/about?member=${leader.slug}`)}
                className="relative mb-8 inline-block"
                aria-label={`View profile for ${leader.name}`}
              >
                <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-30"></div>
                <div className={imageClass}>
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </button>
              
              <h6 className="text-xl font-bold mb-1 tracking-tight">
                <button
                  type="button"
                  onClick={() => navigate(`/about?member=${leader.slug}`)}
                  className="text-black hover:text-black transition-colors"
                >
                  {leader.name}
                </button>
              </h6>
              <p className="text-purple-600 font-bold text-sm uppercase tracking-widest opacity-80">
                {leader.role}
              </p>
            </div>
          ))}
        </div>

        {/* Centered 7th leader */}
        {leaders[6] && (
          <div className="flex justify-center mt-10">
            <div className="group text-center p-8 rounded-[2.5rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(92,50,163,0.1)] border border-transparent hover:border-purple-50 w-full max-w-[400px]">
              <button
                type="button"
                onClick={() => navigate(`/about?member=${leaders[6].slug}`)}
                className="relative mb-8 inline-block"
                aria-label={`View profile for ${leaders[6].name}`}
              >
                <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-30"></div>
                <div className={imageClass}>
                  <img
                    src={leaders[6].photo}
                    alt={leaders[6].name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </button>
              
              <h6 className="text-xl font-bold mb-1 tracking-tight">
                <button
                  type="button"
                  onClick={() => navigate(`/about?member=${leaders[6].slug}`)}
                  className="text-black hover:text-black transition-colors"
                >
                  {leaders[6].name}
                </button>
              </h6>
              <p className="text-purple-600 font-bold text-sm uppercase tracking-widest opacity-80">
                {leaders[6].role}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OurGovernance;
