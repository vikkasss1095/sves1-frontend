import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Auth Components
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// 🔥 Vendor Components
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

// 🔥 Admin Components
import AdminLayout from "./AdminDashboard/AdminLayout.jsx";
import AdminDashboard from "./AdminDashboard/Dashboard.jsx";
import Vendors from "./AdminDashboard/Vendors.jsx";
import VendorDetails from "./AdminDashboard/VendorDetails.jsx"; // 🔥 NEW ADD
import Tasks from "./AdminDashboard/Tasks.jsx";
import Payments from "./AdminDashboard/Payments.jsx";
import Settings from "./AdminDashboard/Settings.jsx";
import Notifications from "./AdminDashboard/Notifications.jsx";
import Documents from "./AdminDashboard/Documents.jsx";
import Evaluation from "./AdminDashboard/Evaluation.jsx";


// 🔒 Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/vendor"} replace />;
  }

  return children;
};


// 🌐 Public Route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

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

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 🔥 VENDOR ROUTES */}
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

          {/* 🔥 ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            {/* 🔥 Vendors */}
            <Route path="vendors" element={<Vendors />} />

            {/* 🔥 NEW: Vendor Details Page */}
            <Route path="vendors/:id" element={<VendorDetails />} />

            <Route path="tasks" element={<Tasks />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="documents" element={<Documents />} />
            <Route path="evaluation" element={<Evaluation />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}