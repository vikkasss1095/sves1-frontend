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

const colors = [
  "from-indigo-500 to-purple-500",
  "from-emerald-500 to-green-500",
  "from-yellow-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-pink-500 to-rose-500"
];

function StatCard({ label, value, icon: Icon, gradient }) {
  return (
    <div className={`p-5 rounded-2xl text-white bg-gradient-to-r ${gradient} shadow-lg flex justify-between items-center`}>
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <Icon className="w-7 h-7 opacity-80" />
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
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, Admin 👋
        </h1>
        <p className="text-sm text-slate-500">
          System overview and performance
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map((c, i) => (
          <StatCard key={c.label} {...c} gradient={colors[i]} />
        ))}
      </div>

      {/* CHART + ACTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* CHART */}
        <div className="bg-white rounded-2xl p-5 shadow-sm xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Vendor Growth
          </h3>

          {chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-400">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendors" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? "#6366f1" : "#c7d2fe"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
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
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 transition text-sm text-slate-600"
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