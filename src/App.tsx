import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/*public pages*/
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import MembershipPage from './pages/MembershipPage'
import EventsPage from './pages/EventsPage'
import NewsPage from './pages/NewsPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import OtpPage from './pages/otpPage'

/*admin pages */
import AdminDashboard from './pages/admin/AdminDashboard'

/* member pages */
import MemberDashboard from './pages/member/memberDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* admin dashboard routes */}
          <Route path="/admin" element={<AdminDashboard/>} />

          {/* member dashboard routes */}
          <Route path="/member" element={<MemberDashboard/>} />


        </Routes>
      </div>
    </Router>
  )
}

export default App
