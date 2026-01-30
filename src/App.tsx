import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Public pages */
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import MembershipPage from "./pages/MembershipPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/otpPage";

/* Member dashboard */
import MemberDashboard from "./pages/member/memberDashboard";
import DocumentsPage from "./pages/member/DocumentsPage";
import PaymentsPage from "./pages/member/PaymentsPage";
import ForumPage from "./pages/member/ForumPage";
import NotificationsPage from "./pages/member/NotificationsPage";
import MembershipStatus from "./pages/member/membershipStatus";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminApproval from "./pages/admin/adminApproval";
/* Dashboards */
//import MembershipStatusPage from './pages/member/MembershipStatusPage';
import PaymentHistoryPage from './pages/member/PaymentHistoryPage';

/* Simple auth guard */
const ProtectedRoute: React.FC<{ children: JSX.Element; role?: "admin" | "member" }> = ({ children, role }) => {
  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userStr) {
    try {
      const user = JSON.parse(userStr);
      const userRole = user.role === '1' || user.role === 1 ? 'admin' : 'member';
      
      if (userRole !== role) {
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

const App: React.FC = () => {
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

          {/* Member dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              
                <MemberDashboard />
              
            }
          />
          <Route
            path="/member/dashboard"
            element={
              //<ProtectedRoute role="member">
                <MemberDashboard />
             //</ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute role="member">
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute role="member">
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute role="member">
                <ForumPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute role="member">
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          {/* Member dashboard */}
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/membership-status" element={<MembershipStatus />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Admin routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
              
            }
          />
          <Route
            path="/admin/approval"
            element={
                <ProtectedRoute role="admin">
                <AdminApproval />
                </ProtectedRoute>
              
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;