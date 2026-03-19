import { useNavigate, Link } from 'react-router-dom';
import { managementMembers, ManagementMember } from '../../data/management';

function ManagementPage() {
  const navigate = useNavigate();
  const leaders: ManagementMember[] = managementMembers;

  return (
    <section className="bg-[#FBFAFF] py-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-10" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/about" className="hover:text-purple-600 transition-colors">
            About Us
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-purple-700">Management</span>
        </nav>

        <div className="text-center mb-16">
          <h3 className="text-secondary text-[2.5rem] mb-4 font-bold">
            Our Management Team
          </h3>
          <p className="text-[#666] max-w-[700px] mx-auto text-lg">
            The dedicated team responsible for implementing APF Uganda's 
            strategic goals and managing daily operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {leaders.map((member) => (
            <div 
              key={member.id} 
              className="group text-center p-8 bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(92,50,163,0.1)] border border-transparent hover:border-purple-50"
            >
              <button 
                type="button"
                onClick={() => navigate(`/about?member=${member.slug}`)}
                className="relative mb-8 inline-block overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                aria-label={`View profile for ${member.name}`}
              >
                <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-30"></div>
                
                <div className="w-[220px] h-[220px] rounded-[2.5rem] mx-auto bg-slate-50 shadow-md overflow-hidden">
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top rounded-[2.5rem]" 
                  />
                </div>
              </button>
              
              <h6 className="text-xl font-bold mb-1 tracking-tight">
                <button
                  type="button"
                  onClick={() => navigate(`/about?member=${member.slug}`)}
                  className="text-black hover:text-purple-700 transition-colors"
                >
                  {member.name}
                </button>
              </h6>
              <p className="text-purple-600 font-bold text-sm uppercase tracking-widest opacity-80">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ManagementPage;