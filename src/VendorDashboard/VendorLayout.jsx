import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, User, FileText, Star,
  Bell, CreditCard, Settings, LogOut,
  Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ✅ LOGO IMPORT
import logo from '../assets/logo.png';

const navItems = [
  { to: '/vendor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/vendor/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/vendor/profile', label: 'Profile', icon: User },
  { to: '/vendor/documents', label: 'Documents', icon: FileText },
  { to: '/vendor/ratings', label: 'Ratings', icon: Star },
  { to: '/vendor/notifications', label: 'Notifications', icon: Bell },
  { to: '/vendor/payments', label: 'Payments', icon: CreditCard },
  { to: '/vendor/settings', label: 'Settings', icon: Settings },
];

export default function VendorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      flex flex-col h-full bg-white border-r border-slate-200
      ${mobile ? 'w-72' : 'w-64'}
    `}>

      {/* 🔥 LOGO SECTION (FIXED PERFECTLY) */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-md border border-slate-100">
          <img 
            src={logo} 
            alt="SVES Logo" 
            className="max-w-[75%] max-h-[75%] object-contain"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 leading-none">SVES</p>
          <p className="text-xs text-slate-400 mt-0.5">Vendor Portal</p>
        </div>

        {mobile && (
          <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* USER CARD */}
      <div className="mx-3 mt-4 px-3 py-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.companyName || user?.email}
            </p>
          </div>
        </div>

        {!user?.isApproved && (
          <div className="mt-2 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-700">⏳ Pending approval</p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
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

          <NavLink
            to="/vendor/notifications"
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Bell className="w-5 h-5 text-slate-500" />
          </NavLink>

          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}