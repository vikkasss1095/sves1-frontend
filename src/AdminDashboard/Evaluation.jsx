// ─── Admin Evaluation ────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Trophy, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";

export function AdminEvaluation() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [rateForm, setRateForm] = useState(null);
  const [form, setForm]         = useState({ qualityScore: 8, deliveryScore: 8, costEfficiencyScore: 8, complianceScore: 8, feedback: '', period: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/admin/evaluation')
      .then(r => setRankings(r.data.rankings))
      .catch(() => toast.error('Failed to load rankings'))
      .finally(() => setLoading(false));
  }, []);

  const submitRating = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/ratings', { ...form, vendor: rateForm._id });
      toast.success('Rating submitted');
      setRateForm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const RANK_COLOR = ['bg-amber-400', 'bg-slate-300', 'bg-orange-400'];

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vendor Evaluation</h1>
        <p className="page-subtitle">Performance rankings based on weighted scoring</p>
      </div>

      {/* Scoring formula info */}
      <div className="card p-4 mb-5 flex items-center gap-4 flex-wrap">
        <p className="text-xs font-600 text-slate-500 uppercase tracking-wide">Scoring Formula:</p>
        {[
          { label: 'Quality', weight: '40%', color: 'bg-brand-100 text-brand-700' },
          { label: 'Delivery', weight: '30%', color: 'bg-blue-100 text-blue-700' },
          { label: 'Cost Efficiency', weight: '20%', color: 'bg-teal-100 text-teal-700' },
          { label: 'Compliance', weight: '10%', color: 'bg-purple-100 text-purple-700' },
        ].map(c => (
          <span key={c.label} className={`px-3 py-1 rounded-full text-xs font-600 ${c.color}`}>
            {c.label} {c.weight}
          </span>
        ))}
      </div>

      {/* Rankings */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Rank', 'Vendor', 'Avg Score', 'Ratings', 'Tasks Done', 'Completion', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rankings.map((r, i) => (
                <tr key={r.vendor._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-700 text-white ${RANK_COLOR[i] || 'bg-slate-200'}`}>
                      {i < 3 ? <Trophy className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-600 text-slate-800">{r.vendor.name}</p>
                    <p className="text-xs text-slate-400">{r.vendor.companyName}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-700 text-slate-900">{r.avgScore}</span>
                      <span className="text-slate-400 text-xs">/10</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{r.ratingsCount}</td>
                  <td className="px-4 py-3.5 text-slate-500">{r.completedTasks}/{r.totalTasks}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${r.completionRate}%` }} />
                      </div>
                      <span className="text-xs font-600 text-slate-600">{r.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setRateForm(r.vendor)} className="btn-primary py-1.5 px-3 text-xs">
                      <Star className="w-3.5 h-3.5" /> Rate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rankings.length === 0 && <div className="text-center py-16 text-slate-400 text-sm">No approved vendors yet</div>}
      </div>

      {/* Rating modal */}
      {rateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-700 text-slate-900">Rate {rateForm.name}</h3>
                <p className="text-xs text-slate-400">{rateForm.companyName}</p>
              </div>
              <button onClick={() => setRateForm(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={submitRating} className="space-y-4">
              {[
                { key: 'qualityScore', label: 'Quality Score (40%)' },
                { key: 'deliveryScore', label: 'Delivery Score (30%)' },
                { key: 'costEfficiencyScore', label: 'Cost Efficiency (20%)' },
                { key: 'complianceScore', label: 'Compliance (10%)' },
              ].map(f => (
                <div key={f.key}>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-600 text-slate-500">{f.label}</label>
                    <span className="text-xs font-700 text-brand-600">{form[f.key]}/10</span>
                  </div>
                  <input type="range" min={0} max={10} step={0.5} value={form[f.key]}
                    onChange={e => setForm({...form, [f.key]: parseFloat(e.target.value)})}
                    className="w-full accent-brand-600" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Period (e.g. Q1 2025)</label>
                <input value={form.period} onChange={e => setForm({...form, period: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Feedback</label>
                <textarea rows={3} value={form.feedback} onChange={e => setForm({...form, feedback: e.target.value})} className="input-field resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRateForm(null)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                  {submitting ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvaluation;