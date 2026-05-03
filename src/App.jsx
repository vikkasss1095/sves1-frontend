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

// 🔒 Protected
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

// 🌐 Public
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/vendor" /> : children;
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