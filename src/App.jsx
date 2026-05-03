import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";


// Auth
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Vendor
import VendorLayout from "./VendorDashboard/VendorLayout.jsx";
import VendorDashboard from "./VendorDashboard/Dashboard.jsx";
import VendorTasks from "./VendorDashboard/Tasks.jsx";
import VendorProfile from "./VendorDashboard/Profile.jsx";
import VendorDocuments from "./VendorDashboard/Documents.jsx";
import VendorRatings from "./VendorDashboard/Ratings.jsx";
import VendorAnalytics from "./VendorDashboard/Analytics.jsx";
import VendorNotifications from "./VendorDashboard/Notifications.jsx";
import VendorPayments from "./VendorDashboard/Payments.jsx";
import VendorSettings from "./VendorDashboard/Settings.jsx";

// Admin
import AdminLayout from "./AdminDashboard/AdminLayout.jsx";
import AdminDashboard from "./AdminDashboard/Dashboard.jsx";
import AdminVendors from "./AdminDashboard/Vendors.jsx";
import AdminTasks from "./AdminDashboard/Tasks.jsx";
import AdminEvaluation from "./AdminDashboard/Evaluation.jsx";
import AdminDocuments from "./AdminDashboard/Documents.jsx";
import AdminPayments from "./AdminDashboard/Payments.jsx";
import AdminNotifications from "./AdminDashboard/Notifications.jsx";
import AdminSettings from "./AdminDashboard/Settings.jsx";

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/vendor"} replace />;
  }

  return children;
};

// Public Route
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
            <Toaster position="top-right" />
    
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
    
              {/* Auth */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
    
              {/* Vendor */}
              <Route
                path="/vendor"
                element={<ProtectedRoute role="vendor"><VendorLayout /></ProtectedRoute>}
              >
                <Route index element={<VendorDashboard />} />
              </Route>
    
              {/* 🔥 ADMIN FULL ROUTES */}
              <Route
                path="/admin"
                element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="payments" element={<Payments />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="documents" element={<Documents />} />
                <Route path="evaluation" element={<Evaluation />} />
              </Route>
    
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
  );
}