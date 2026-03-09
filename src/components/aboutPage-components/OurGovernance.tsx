import { useEffect, useState } from 'react';
import api from '../../services/cmsApi';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { CMS_BASE_URL } from '../../config/api';

function OurGovernance() {
  const { elementRef, isVisible } = useScrollAnimation();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        // Fetching from Strapi with population and sorting
        const res = await api.get('/leaderships?populate=*&sort=order:asc');
        setLeaders(res.data.data || []);
      } catch (err) {
        console.error("Error fetching governance data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

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
          {loading ? (
            // Loading State 
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse text-center">
                <div className="w-[200px] h-[200px] bg-slate-200 rounded-[2.5rem] mx-auto mb-6"></div>
                <div className="h-4 bg-slate-200 w-3/4 mx-auto mb-2 rounded"></div>
                <div className="h-3 bg-slate-100 w-1/2 mx-auto rounded"></div>
              </div>
            ))
          ) : (
            leaders.map((leader) => {
              
              const data = leader.attributes || leader;
              
              // Resolve Photo URL
              const photoObj = data.Photo?.data?.attributes || data.Photo;
              const photoUrl = photoObj?.url;
              const fullImageUrl = photoUrl 
                ? (photoUrl.startsWith('http') ? photoUrl : `${CMS_BASE_URL}${photoUrl}`)
                : '/placeholder-profile.png'; 

              return (
                <div 
                  key={leader.id || leader.documentId} 
                  className="group text-center p-8 rounded-[2.5rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(92,50,163,0.1)] border border-transparent hover:border-purple-50"
                >
                  <div className="relative mb-8 inline-block">
                    {/* Image with  background element */}
                    <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-30"></div>
                    <img
                      src={fullImageUrl}
                      alt={data.name}
                      className="w-[220px] h-[220px] rounded-[2.5rem] mx-auto object-cover bg-slate-50 shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  
                  <h6 className="text-secondary text-xl font-bold mb-1 tracking-tight">
                    {data.name}
                  </h6>
                  <p className="text-purple-600 font-bold text-sm uppercase tracking-widest opacity-80">
                    {data.role}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {!loading && leaders.length === 0 && (
          <div className="text-center py-20">
             <p className="text-slate-400 italic">No leadership profiles published yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default OurGovernance;
