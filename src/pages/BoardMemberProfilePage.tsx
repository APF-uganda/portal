import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { boardMembers } from '../data/boardMembers';

type BoardMemberProfilePageProps = {
  forcedSlug?: string;
};

function BoardMemberProfilePage({ forcedSlug }: BoardMemberProfilePageProps) {
  const { slug: routeSlug } = useParams();
  const slug = forcedSlug || routeSlug;
  const member = boardMembers.find((item) => item.slug === slug);

  if (!member) {
    return <Navigate to="/about" replace />;
  }

  const normalizedName = member.name
    .replace('CPA ', '')
    .replace('Prof. ', '')
    .replace('(PhD)', '')
    .trim();
  const nameParts = normalizedName.split(' ').filter(Boolean);
  const firstName = nameParts[0] || normalizedName;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <div className="min-h-screen bg-white">
      <Navbar forceSolid />

      <main className="px-6 py-14 sm:py-16 bg-[#f7f3ff]">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-slate-600 mb-5">
            <Link to="/" className="text-slate-700 hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/about#governance" className="text-slate-700 hover:underline">
              Governance
            </Link>
            <span className="mx-2">/</span>
            <span>{member.name}</span>
          </div>

          <section className="border border-slate-200 bg-white  rounded-sm p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">{member.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Profile Picture</p>
                <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] border border-slate-200 overflow-hidden bg-slate-50 mx-auto lg:mx-0">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salutation</p>
                  <p className="text-slate-900 mt-1">Mr.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</p>
                  <p className="text-slate-900 mt-1">{firstName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</p>
                  <p className="text-slate-900 mt-1">{lastName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</p>
                  <p className="text-slate-900 mt-1">{member.role}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</p>
                  <p className="text-slate-900 mt-1">Accountancy Practitioners Forum (APF) Uganda</p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Biography</h2>
                <p className="text-slate-700 leading-relaxed">{member.summary}</p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Who They Are</h2>
                <p className="text-slate-700 leading-relaxed">{member.whoTheyAre}</p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Outside APF</h2>
                <p className="text-slate-700 leading-relaxed">{member.outsideApf}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BoardMemberProfilePage;
