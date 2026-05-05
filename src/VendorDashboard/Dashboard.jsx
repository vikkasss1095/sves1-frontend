import { useEffect, useState } from "react";
import {
  ClipboardList, CheckCircle2, Clock, TrendingUp,
  CreditCard, Star, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

/* ---------- MODERN CARD ---------- */
function StatCard({ label, value, icon: Icon, gradient }) {
  return (
    <div className={`p-5 rounded-2xl text-white shadow-lg ${gradient} transition hover:scale-[1.02]`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs opacity-80">{label}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <Icon className="w-6 h-6 opacity-80" />
      </div>
    </div>
  ); 
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/vendor/dashboard")
      .then(r => setStats(r.data));
  }, []);

  const cards = [
    { label: "Tasks", value: stats?.totalTasks ?? 0, icon: ClipboardList, gradient: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { label: "Completed", value: stats?.completedTasks ?? 0, icon: CheckCircle2, gradient: "bg-gradient-to-r from-green-400 to-emerald-500" },
    { label: "Progress", value: stats?.inProgressTasks ?? 0, icon: Clock, gradient: "bg-gradient-to-r from-blue-400 to-cyan-500" },
    { label: "Pending", value: stats?.pendingTasks ?? 0, icon: AlertCircle, gradient: "bg-gradient-to-r from-yellow-400 to-orange-500" },
    { label: "Score", value: `${stats?.avgScore ?? 0}/10`, icon: Star, gradient: "bg-gradient-to-r from-pink-400 to-purple-500" },
    { label: "Earnings", value: `₹${stats?.totalEarnings ?? 0}`, icon: TrendingUp, gradient: "bg-gradient-to-r from-teal-400 to-green-500" },
    { label: "Payments", value: `₹${stats?.pendingPayments ?? 0}`, icon: CreditCard, gradient: "bg-gradient-to-r from-red-400 to-pink-500" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your vendor performance overview
        </p>
      </div>

      {/* 🔥 CREATE ACCOUNT ALERT (NEW) */}
      {!user?.profileCompleted && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 flex justify-between items-center">
          <span>⚠ Please complete your profile first</span>

          <button
       onClick={() => navigate("/vendor/profile")}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm"
          >
            Create Account
          </button>
          
        </div>
      )}

      {/* EXISTING ALERT */}
      {!user?.isApproved && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-sm">
          ⚠ Your account is under review by admin
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* CHART SECTION */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* BAR */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Task Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { day: "Mon", completed: 2, pending: 3 },
              { day: "Tue", completed: 4, pending: 2 },
              { day: "Wed", completed: 3, pending: 4 },
              { day: "Thu", completed: 5, pending: 1 },
              { day: "Fri", completed: 6, pending: 2 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="#c7d2fe" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AREA */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Performance Score</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={[
              { month: "Aug", score: 7.2 },
              { month: "Sep", score: 7.8 },
              { month: "Oct", score: 8.1 },
              { month: "Nov", score: 7.5 },
              { month: "Dec", score: 8.4 },
            ]}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}