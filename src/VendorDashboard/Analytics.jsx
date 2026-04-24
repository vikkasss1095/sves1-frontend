import { useEffect, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import api from "../utils/axios";
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-600 text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function VendorAnalytics() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/vendor/analytics')
      .then(r => setChartData(r.data.chartData))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const latest = chartData[chartData.length - 1] || {};
  const radarData = [
    { subject: 'Quality',    A: latest.quality    || 0, fullMark: 10 },
    { subject: 'Delivery',   A: latest.delivery   || 0, fullMark: 10 },
    { subject: 'Cost',       A: latest.cost       || 0, fullMark: 10 },
    { subject: 'Compliance', A: latest.compliance || 0, fullMark: 10 },
  ];

  const COLORS = { quality: '#4f46e5', delivery: '#0891b2', cost: '#059669', compliance: '#d97706' };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Performance Analytics</h1>
        <p className="page-subtitle">Track your performance trends over time</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Line chart */}
        <div className="card p-5 xl:col-span-2">
          <div className="mb-5">
            <h3 className="text-sm font-700 text-slate-800">Score Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly performance across all criteria</p>
          </div>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Not enough data to display chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                {Object.entries(COLORS).map(([key, color]) => (
                  <Line key={key} type="monotone" dataKey={key} name={key.charAt(0).toUpperCase() + key.slice(1)}
                    stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Radar chart */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="text-sm font-700 text-slate-800">Latest Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Across all evaluation criteria</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score breakdown cards */}
        <div className="card p-5">
          <h3 className="text-sm font-700 text-slate-800 mb-5">Latest Scores Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Quality Score',        value: latest.quality    || 0, weight: '40%', color: COLORS.quality },
              { label: 'Delivery Score',       value: latest.delivery   || 0, weight: '30%', color: COLORS.delivery },
              { label: 'Cost Efficiency',      value: latest.cost       || 0, weight: '20%', color: COLORS.cost },
              { label: 'Compliance Score',     value: latest.compliance || 0, weight: '10%', color: COLORS.compliance },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">weight: {item.weight}</span>
                    <span className="font-700 text-slate-800">{item.value}/10</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(item.value / 10) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}