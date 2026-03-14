import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { isAuthenticated, getUser, migrateFromLocalStorage } from "./utils/authStorage";
import { Loader2 } from "lucide-react";

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="animate-spin text-purple-600 mx-auto mb-4" size={40} />
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

/* Lazy loaded public pages */
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const BoardMemberProfilePage = React.lazy(() => import("./pages/BoardMemberProfilePage"));
const ChairpersonMessagePage = React.lazy(() => import("./pages/ChairpersonMessagePage"));
const MembershipPage = React.lazy(() => import("./pages/MembershipPage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const EventRegistrationPage = React.lazy(() => import("./pages/EventRegistrationPage"));
const NewsPage = React.lazy(() => import("./pages/NewsPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const OtpPage = React.lazy(() => import("./pages/otpPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));
const TestCMS = React.lazy(() => import("./pages/TestCMS"));

/* Lazy loaded member dashboard */
const MemberDashboard = React.lazy(() => import("./pages/member/memberDashboard"));
const DocumentsPage = React.lazy(() => import("./pages/member/DocumentsPage"));
const PaymentsPage = React.lazy(() => import("./pages/member/PaymentsPage"));
const ForumPage = React.lazy(() => import("./pages/member/ForumPage"));
const CreatePostPage = React.lazy(() => import("./pages/member/CreatePostPage"));
const MyPostsPage = React.lazy(() => import("./pages/member/MyPostsPage"));
const PostDetailPage = React.lazy(() => import("./pages/member/PostDetailPage"));
const NotificationsPage = React.lazy(() => import("./pages/member/NotificationsPage"));
const SettingsPage = React.lazy(() => import("./pages/member/SettingsPage"));
const PaymentHistoryPage = React.lazy(() => import("./pages/member/PaymentHistoryPage"));
const ProfilePage = React.lazy(() => import("./pages/member/ProfilePage"));

/* Lazy loaded admin pages */
const AdminDashboard = React.lazy(() => import("./pages/admin/adminDashboard"));
const AdminApproval = React.lazy(() => import("./pages/admin/adminApproval"));
const AdminProfilePage = React.lazy(() => import("./pages/admin/profilePage"));
const ReportsPage = React.lazy(() => import("./pages/admin/reportsAnalytics"));
const CmsContentPage = React.lazy(() => import("./pages/admin/cmsPage"));
const CommunityForum = React.lazy(() => import("./pages/admin/communityForum"));
const CreatePost = React.lazy(() => import("./pages/admin/createPost"));
const CommunicationsDashboard = React.lazy(() => import("./pages/admin/announcements"));
const CreateAnnouncement = React.lazy(() => import("./pages/admin/createAnnouncement"));
const SearchResults = React.lazy(() => import("./pages/admin/SearchResults"));
const NewsManagement = React.lazy(() => import("./pages/admin/newsMgt"));
const ManageUsers = React.lazy(() => import("./pages/admin/manageusers"));
const EventCreatePage = React.lazy(() => import("./pages/admin/eventMgt"));
const ManagePayments = React.lazy(() => import("./pages/admin/managePayments"));
const MembershipEditor = React.lazy(() => import('./components/admincms/editMembership'));
const AboutPageEditor = React.lazy(() => import('./components/admincms/editAbout'));
const HomePageEditor = React.lazy(() => import('./components/admincms/editLandingpage'));
const LeadershipManager = React.lazy(() => import('./components/admincms/leadership/leadershipmanager'));
const NewsDetail = React.lazy(() => import('./components/NewsComponents/NewsDetail'));
const AdminInquiryDashboard = React.lazy(() => import('./pages/admin/inquiries'));
const PendingApprovalPage = React.lazy(() => import('./components/register-components/pendingApproval'));
/* Auth guard with session validation */
const ProtectedRoute: React.FC<{
  children: JSX.Element;
  role?: "admin" | "member";
}> = ({ children, role }) => {
  // Check if authenticated and session is valid
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role) {
    const user = getUser();
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    const userRole = user.role === "1" || user.role === 1 ? "admin" : "member";
    if (userRole !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const App: React.FC = () => {
  // Migrate from localStorage to sessionStorage on app load
  useEffect(() => {
    migrateFromLocalStorage();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/chairperson-message" element={<ChairpersonMessagePage />} />
            {/* <Route path="/chairperson-message/" element={<ChairpersonMessagePage />} /> */}
            <Route path="/chair-message" element={<ChairpersonMessagePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/governance/:slug" element={<BoardMemberProfilePage />} />
            <Route path="/board-member/:slug" element={<BoardMemberProfilePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/event-registration"
              element={<EventRegistrationPage />}
            />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/test-cms" element={<TestCMS />} />
            <Route path="/cmspage" element={<CmsContentPage />} />
            <Route path="/cmsPage" element={<CmsContentPage />} />
            <Route path="/communityforum" element={<CommunityForum />} />
            <Route path="/announcements" element={<CommunicationsDashboard />} />
            <Route path="/newsMgt" element={<NewsManagement />} />
            <Route path="/manageUsers" element={<ManageUsers />} />
            <Route path="/eventMgt" element={<EventCreatePage />} />
              <Route path="/editMembership" element={<MembershipEditor />} />
              <Route path="/editAbout" element={<AboutPageEditor />} />
              <Route path="/editLandingpage" element={<HomePageEditor />} />
              <Route path="/admin/about" element={<AboutPageEditor />} />
             <Route path="/admincms/leadership" element={<LeadershipManager />} />
             <Route path="/news/:id" element={<NewsDetail />} />

            {/* Auth routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/apply/pending" element={<PendingApprovalPage />} />

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
              path="/forum/post/:id/edit"
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
            <Route
              path="/member/settings"
              element={
                <ProtectedRoute role="member">
                  <SettingsPage />
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
              path="/admincms"
              element={
                <ProtectedRoute role="admin">
                  <CmsContentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/newsMgt"
              element={
                <ProtectedRoute role="admin">
                  <NewsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/NewsMgt"
              element={<Navigate to="/admin/newsMgt" replace />}
            />
            <Route
              path="/admin/governance"
              element={
                <ProtectedRoute role="admin">
                  <LeadershipManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-page/insights"
              element={
                <ProtectedRoute role="admin">
                  <CmsContentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-page/contact"
              element={
                <ProtectedRoute role="admin">
                  <CmsContentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute role="admin">
                  <AdminProfilePage />
                </ProtectedRoute>
              }
            />

  <Route
              path="/admin/eventMgt"
              element={
                <ProtectedRoute role="admin">
                  <EventCreatePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/manageusers"
              element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute role="admin">
                  <ManagePayments />
                </ProtectedRoute>
              }
            />


  <Route
              path="/admin/inquiries"
              element={
                <ProtectedRoute role="admin">
                  <AdminInquiryDashboard />
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
              path="/admin/communityForum/edit-post/:id"
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
              path="/admin/announcements/:id"
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

            <Route
              path="/admin/search"
              element={
                <ProtectedRoute role="admin">
                  <SearchResults />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
