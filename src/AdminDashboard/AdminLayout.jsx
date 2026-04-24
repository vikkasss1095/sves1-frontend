import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, BarChart3,
  FileText, CreditCard, Bell, Settings, LogOut,
  Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

import logo from '../assets/logo.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/vendors', label: 'Vendors', icon: Users },
  { to: '/admin/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/admin/evaluation', label: 'Evaluation', icon: BarChart3 },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200 ${mobile ? 'w-72' : 'w-64'}`}>

      {/* LOGO */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200">

        <div className="w-11 h-11 flex items-center justify-center bg-white rounded-xl shadow-sm border">
          <img
            src={logo}
            alt="SVES Logo"
            className="w-7 h-7 object-contain"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">SVES</p>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>

        {mobile && (
          <button onClick={() => setOpen(false)} className="ml-auto text-slate-500 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* USER */}
      <div className="mx-3 mt-4 px-3 py-3 bg-slate-50 rounded-xl border">
        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm text-slate-800 font-medium">{user?.name}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
              ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50">

      {/* DESKTOP */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* MOBILE */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-14 bg-white border-b flex items-center px-4 gap-3">
          <button onClick={() => setOpen(true)} className="lg:hidden">
            <Menu className="w-5 h-5 text-slate-500" />
          </button>

          <div className="flex-1" />

          <NavLink to="/admin/notifications" className="p-2 hover:bg-slate-100 rounded-lg">
            <Bell className="w-5 h-5 text-slate-500" />
          </NavLink>

          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}