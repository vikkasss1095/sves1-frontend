import { useEffect, useState } from 'react';
import {
  Users, UserCheck, UserX,
  ClipboardList, CheckCircle2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import api from "../utils/axios";
import toast from 'react-hot-toast';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ❌ remove gradient colors
// ✅ use glass style instead

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="relative p-5 rounded-2xl text-white 
      bg-white/10 backdrop-blur-xl border border-cyan-400/20
      shadow-[0_0_20px_rgba(0,255,255,0.1)]
      flex justify-between items-center transition hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]">

      <div>
        <p className="text-sm text-cyan-200">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>

      <Icon className="w-7 h-7 text-cyan-300" />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = (stats?.monthlyGrowth || []).map(m => ({
    name: MONTH_NAMES[m._id.month],
    vendors: m.count,
  }));

  const cards = [
    { label: 'Total Vendors', value: stats?.totalVendors ?? 0, icon: Users },
    { label: 'Active Vendors', value: stats?.activeVendors ?? 0, icon: UserCheck },
    { label: 'Pending', value: stats?.pendingApprovals ?? 0, icon: UserX },
    { label: 'Tasks', value: stats?.totalTasks ?? 0, icon: ClipboardList },
    { label: 'Completed', value: stats?.completedTasks ?? 0, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-300">
          Welcome back, Admin 👋
        </h1>
        <p className="text-sm text-cyan-100/70">
          System overview and performance by vikas
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* CHART + ACTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* CHART */}
        <div className="bg-white/10 backdrop-blur-xl border border-cyan-400/20 
          rounded-2xl p-5 shadow-[0_0_20px_rgba(0,255,255,0.1)] xl:col-span-2">

          <h3 className="text-sm font-semibold text-cyan-200 mb-3">
            Vendor Growth
          </h3>

          {chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-cyan-200/60">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#67e8f9" />
                <YAxis stroke="#67e8f9" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #22d3ee" }} />

                <Bar dataKey="vendors" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? "#22d3ee" : "#164e63"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white/10 backdrop-blur-xl border border-cyan-400/20 
          rounded-2xl p-5 shadow-[0_0_20px_rgba(0,255,255,0.1)]">

          <h3 className="text-sm font-semibold text-cyan-200 mb-4">
            Quick Actions
          </h3>

          <div className="space-y-2">
            {[
              { label: 'Review Vendors', link: '/admin/vendors' },
              { label: 'Assign Task', link: '/admin/tasks' },
              { label: 'Evaluation', link: '/admin/evaluation' },
              { label: 'Documents', link: '/admin/documents' },
              { label: 'Payments', link: '/admin/payments' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.link}
                className="block px-3 py-2 rounded-lg 
                  text-cyan-100/80 hover:text-white 
                  hover:bg-cyan-400/10 transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}