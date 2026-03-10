import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import leader1 from '../../assets/images/aboutPage-images/leader1.jpeg';
import leader2 from '../../assets/images/aboutPage-images/leader2.jpeg';
import leader3 from '../../assets/images/aboutPage-images/leader3.jpeg';
import leader4 from '../../assets/images/aboutPage-images/leader4.jpeg';
import leader5 from '../../assets/images/aboutPage-images/leader5.jpeg';
import leader6 from '../../assets/images/aboutPage-images/leader6.jpeg';
import leader7 from '../../assets/images/aboutPage-images/leader7.jpeg';

function OurGovernance() {
  const { elementRef, isVisible } = useScrollAnimation();

  const leaders = [
    { id: 1, name: 'CPA Michael Tugyetwena', role: 'Board Chairman', photo: leader1 },
    { id: 2, name: 'CPA Ronald Mutumba', role: 'Implementing Director/ Board Member', photo: leader2 },
    { id: 7, name: 'CPA Charles Lutimba', role: 'ICPAU Representative /Ex Official Board Member', photo: leader7 },
    { id: 5, name: 'CPA Silver Boss Mwebesa', role: 'Treasurer', photo: leader5 },
    { id: 3, name: 'CPA Prof. Twaha Kigongo Kaawaase (PHD)',role: 'Board Member',  photo: leader3 },
    { id: 4, name: ' CPA Joseph Gonzaga Kalinda', role: 'Board Member', photo: leader4 },    
    { id: 6, name: 'CPA David Nyende', role: 'Board Member', photo: leader6 },
    
  ];

  return (
    <section className="bg-[#FBFAFF] py-20 px-6">
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
              <div className="relative mb-8 inline-block">
                <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-30"></div>
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="w-[220px] h-[220px] rounded-[2.5rem] mx-auto object-cover bg-slate-50 shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              
              <h6 className="text-secondary text-xl font-bold mb-1 tracking-tight">
                {leader.name}
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
              <div className="relative mb-8 inline-block">
                <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-30"></div>
                <img
                  src={leaders[6].photo}
                  alt={leaders[6].name}
                  className="w-[220px] h-[220px] rounded-[2.5rem] mx-auto object-cover bg-slate-50 shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              
              <h6 className="text-secondary text-xl font-bold mb-1 tracking-tight">
                {leaders[6].name}
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
