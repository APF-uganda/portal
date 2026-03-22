import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { chairpersonMessage } from '../data/chairpersonMessage';

function ChairpersonMessagePage() {
  const { name, role, fullMessage, photo } = chairpersonMessage;

  return (
    <div className="min-h-screen bg-[#f7f3ff]">
      <Navbar forceSolid />

      <main className="px-6 py-14 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-slate-600 mb-5">
            <Link to="/" className="text-slate-700 hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Chairperson Message</span>
          </div>

          <section className="border border-slate-200 bg-white rounded-sm p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
              <div>
                <div className="relative overflow-hidden rounded-lg w-full max-w-[300px] h-[350px] flex items-center justify-center bg-slate-100 group flex-shrink-0 shadow-lg mx-auto lg:mx-0">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 relative z-0 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-secondary text-[1.75rem] sm:text-[2rem] mb-4 sm:mb-6 font-bold relative inline-block">
                  A Message from the Board Chairperson
                </h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{fullMessage}</p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="font-bold text-base sm:text-lg text-slate-900">{name}</p>
                  <p className="text-sm sm:text-base text-slate-600">{role}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ChairpersonMessagePage;
