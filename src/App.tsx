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
import CreatePostPage from "./pages/member/CreatePostPage";
import MyPostsPage from "./pages/member/MyPostsPage";
import PostDetailPage from "./pages/member/PostDetailPage";
import NotificationsPage from "./pages/member/NotificationsPage";

import PaymentHistoryPage from './pages/member/PaymentHistoryPage';
import ProfilePage from "./pages/member/ProfilePage";

/* Admin pages */
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminApproval from "./pages/admin/adminApproval";
import AdminProfilePage from "./pages/admin/profilePage";
import ReportsPage from "./pages/admin/reportsAnalytics";
import CmsContentPage from "./pages/admin/cmsPage";
import CommunityForum from "./pages/admin/communityForum";
import CreatePost from "./pages/admin/createPost";
import CommunicationsDashboard from "./pages/admin/announcements";
import CreateAnnouncement from "./pages/admin/createAnnouncement";

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
          <Route path="/cmspage" element={<CmsContentPage />} />
          <Route path="/communityforum" element={<CommunityForum />} />
          <Route path="/announcements" element={<CommunicationsDashboard />} />



          {/* Auth routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* Member routes (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="member">
                <MemberDashboard />
              </ProtectedRoute>
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
            path="/payment-history"
            element={
              <ProtectedRoute role="member">
                <PaymentHistoryPage />
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
            path="/forum/create-post"
            element={
              <ProtectedRoute role="member">
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/my-posts"
            element={
              <ProtectedRoute role="member">
                <MyPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/post/:id"
            element={
              <ProtectedRoute role="member">
                <PostDetailPage />
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="member">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

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


<Route
            path="/admin/cmsPage"
            element={
              <ProtectedRoute role="admin">
                <CmsContentPage />
              </ProtectedRoute>
            }
          />


<Route
            path="/admin/communityForum"
            element={
              <ProtectedRoute role="admin">
                <CommunityForum />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/communityForum/create-post"
            element={
              <ProtectedRoute role="admin">
                <CreatePost />
              </ProtectedRoute>
            }
          />



          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <ReportsPage />
              </ProtectedRoute>
            }
          />





          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfilePage />
              </ProtectedRoute>
            }
          />


<Route
            path="/admin/announcements"
            element={
              <ProtectedRoute role="admin">
                <CommunicationsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-announcement"
            element={
              <ProtectedRoute role="admin">
                <CreateAnnouncement />
              </ProtectedRoute>
            }
          />



          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;