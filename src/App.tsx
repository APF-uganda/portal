import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/* Public pages */
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import MembershipPage from './pages/MembershipPage'
import EventsPage from './pages/EventsPage'
import NewsPage from './pages/NewsPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import OtpPage from './pages/otpPage'

/* Dashboards */
import MemberDashboard from './pages/member/memberDashboard'
import AdminDashboard from './pages/admin/adminDashboard'
import AdminApproval from './pages/admin/adminApproval'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public routes */}
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

          {/* Member dashboard */}
          <Route path="/dashboard" element={<MemberDashboard />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approval" element={<AdminApproval />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
