import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ✅ Auth pages (correct path)
import Login from "./pages/Login";
import Register from "./pages/Register";

// ✅ Vendor pages (correct folder)
import VendorLayout from "./VendorDashboard/VendorLayout";
import VendorDashboard from "./VendorDashboard/Dashboard";
import VendorTasks from "./VendorDashboard/Tasks";
import VendorProfile from "./VendorDashboard/Profile";
import VendorDocuments from "./VendorDashboard/Documents";
import VendorRatings from "./VendorDashboard/Ratings";
import VendorAnalytics from "./VendorDashboard/Analytics";
import VendorNotifications from "./VendorDashboard/Notifications";
import VendorPayments from "./VendorDashboard/Payments";
import VendorSettings from "./VendorDashboard/Settings";

// ✅ Admin pages (correct folder)
import AdminLayout from "./AdminDashboard/AdminLayout";
import AdminDashboard from "./AdminDashboard/Dashboard";
import AdminVendors from "./AdminDashboard/Vendors";
import AdminTasks from "./AdminDashboard/Tasks";
import AdminEvaluation from "./AdminDashboard/Evaluation";
import AdminDocuments from "./AdminDashboard/Documents";
import AdminPayments from "./AdminDashboard/Payments";
import AdminNotifications from "./AdminDashboard/Notifications";
import AdminSettings from "./AdminDashboard/Settings";

// 🔐 Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/vendor"} replace />;
  }

  return children;
};

// 🌍 Public Route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/vendor"} replace />;
  }

  return children;
};

// 🚀 APP
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Vendor */}
          <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorLayout /></ProtectedRoute>}>
            <Route index element={<VendorDashboard />} />
            <Route path="tasks" element={<VendorTasks />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="documents" element={<VendorDocuments />} />
            <Route path="ratings" element={<VendorRatings />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="notifications" element={<VendorNotifications />} />
            <Route path="payments" element={<VendorPayments />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="evaluation" element={<AdminEvaluation />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}