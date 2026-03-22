import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { managementMembers, ManagementMember } from '../../data/management';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import heroImg from '../../assets/images/aboutPage-images/about1.jpg';

function ManagementPage() {
  const navigate = useNavigate();
  const getRoleOrder = (role: string) => {
    const normalizedRole = role.toLowerCase();
    if (normalizedRole.includes('implementing director')) return 0;
    if (normalizedRole.includes('treasurer')) return 1;
    if (normalizedRole.includes('icpau representative')) return 2;
    return 99;
  };

  const leaders: ManagementMember[] = [...managementMembers].sort((a, b) => {
    const orderA = getRoleOrder(a.role);
    const orderB = getRoleOrder(b.role);
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  const implementingDirector =
    leaders.find((member) => member.role.toLowerCase().includes('implementing director')) || null;
  const otherLeaders = implementingDirector
    ? leaders.filter((member) => member.id !== implementingDirector.id)
    : leaders;

  const renderLeaderCard = (member: ManagementMember) => (
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
  );

  return (
    <div className="bg-[#FBFAFF] min-h-screen">
      <Navbar />
      <section className="relative h-[200px] md:h-[240px] overflow-hidden">
        <img
          src={heroImg}
          alt="APF Management"
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-5">
          <nav className="max-w-6xl mx-auto px-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center">
              <li>
                <Link to="/" className="text-white hover:text-purple-500 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-purple-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li aria-current="page" className="font-semibold text-white">
                Management
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
        
          <div className="max-w-6xl mx-auto px-6 w-full">
          
            <h4 className="text-black text-3xs text-center sm:text-5xl  mb-4">
              Management Team
            </h4>
            <p className="text-black/90 max-w-2xl mx-auto text-center text-sm md:text-base">
              Meet the leaders driving implementation, operational excellence, and stewardship across APF Uganda.
            </p>
          </div>

          {implementingDirector && (
            <div className="max-w-[420px] mx-auto mb-10">
              {renderLeaderCard(implementingDirector)}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {otherLeaders.map((member) => renderLeaderCard(member))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default ManagementPage;
