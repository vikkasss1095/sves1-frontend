import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Auth Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Vendor
import VendorLayout from "./VendorDashboard/VendorLayout.jsx";
import VendorDashboard from "./VendorDashboard/Dashboard.jsx";
import VendorAnalytics from "./VendorDashboard/Analytics.jsx";
import VendorDocuments from "./VendorDashboard/Documents.jsx";
import VendorNotifications from "./VendorDashboard/Notifications.jsx";
import VendorPayments from "./VendorDashboard/Payments.jsx";
import VendorProfile from "./VendorDashboard/Profile.jsx";
import VendorRatings from "./VendorDashboard/Ratings.jsx";
import VendorSettings from "./VendorDashboard/Settings.jsx";
import VendorTasks from "./VendorDashboard/Tasks.jsx";

// Admin
import AdminLayout from "./AdminDashboard/AdminLayout.jsx";
import AdminDashboard from "./AdminDashboard/Dashboard.jsx";
import Vendors from "./AdminDashboard/Vendors.jsx";
import Tasks from "./AdminDashboard/Tasks.jsx";
import Payments from "./AdminDashboard/Payments.jsx";
import Settings from "./AdminDashboard/Settings.jsx";
import Notifications from "./AdminDashboard/Notifications.jsx";
import Documents from "./AdminDashboard/Documents.jsx";
import Evaluation from "./AdminDashboard/Evaluation.jsx";


// 🔒 PROTECTED ROUTE
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // ✅ WAIT for auth check
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ❌ not logged in
  if (!user) return <Navigate to="/login" replace />;

  // ❌ wrong role
  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/vendor"} replace />;
  }

  return children;
};


// 🌐 PUBLIC ROUTE (FIXED)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ✅ WAIT (IMPORTANT FIX)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ✅ already logged in
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/vendor"} replace />;
  }

  return children;
};


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* AUTH */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 🔥 VENDOR */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute role="vendor">
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<VendorDashboard />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="documents" element={<VendorDocuments />} />
            <Route path="notifications" element={<VendorNotifications />} />
            <Route path="payments" element={<VendorPayments />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="ratings" element={<VendorRatings />} />
            <Route path="settings" element={<VendorSettings />} />
            <Route path="tasks" element={<VendorTasks />} />
          </Route>

          {/* 🔥 ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="documents" element={<Documents />} />
            <Route path="evaluation" element={<Evaluation />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}