import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardList, BarChart3,
  FileText, CreditCard, Bell, Settings,
  Menu, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/vendors", label: "Vendors", icon: Users },
  { to: "/admin/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/admin/evaluation", label: "Evaluation", icon: BarChart3 },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen">

      {/* ✅ DESKTOP SIDEBAR (NOT FIXED) */}
      <aside className="hidden lg:flex w-64 bg-white border-r flex-col">

        {/* LOGO */}
        <div className="flex items-center gap-3 px-5 py-5 border-b">
          <img src={logo} className="w-8 h-8" />
          <div>
            <p className="text-sm font-semibold">SVES</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>

        {/* USER */}
        <div className="p-3">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
            <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="m-3 p-2 bg-red-100 text-red-600 rounded"
        >
          Logout
        </button>
      </aside>

      {/* 🔥 MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-72 bg-white border-r flex flex-col">
            <div className="flex items-center gap-3 px-5 py-5 border-b">
              <img src={logo} className="w-8 h-8" />
              <div>
                <p className="text-sm font-semibold">SVES</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>

              <button onClick={() => setOpen(false)} className="ml-auto">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-14 bg-white border-b flex items-center px-4">
          <button onClick={() => setOpen(true)} className="lg:hidden">
            <Menu size={18} />
          </button>

          <div className="ml-auto">
            <Bell size={18} />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}