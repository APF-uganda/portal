import { Link } from 'react-router-dom'
import { Construction } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function MembershipPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-[#f9fafb] py-16 px-4">
        <div className="max-w-3xl text-center">
          <Construction className="w-24 h-24 text-primary mx-auto mb-8" />
          <h2 className="text-[#1e293b] text-4xl font-bold mb-4">
            Membership
          </h2>
          <h5 className="text-[#374151] text-xl mb-2">
            This page is currently under development
          </h5>
          <p className="text-[#6b7280] mb-8">
            We're working hard to bring you this content soon!
          </p>
          <Link 
            to="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-[25px] font-semibold transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5 no-underline"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MembershipPage
