import { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, Clock } from 'lucide-react';
import api from "../utils/axios";
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  pending:  'badge-pending',
  approved: 'badge-progress',
  paid:     'badge-completed',
  rejected: 'badge-rejected',
};

export default function VendorPayments() {
  const [data, setData]     = useState({ payments: [], totalEarnings: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load payments'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <p className="page-subtitle">Your earnings and payment history</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-emerald-50 text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <p className="stat-value">₹{data.totalEarnings.toLocaleString()}</p>
            <p className="stat-label">Total Earnings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-amber-50 text-amber-600"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="stat-value">₹{data.pendingAmount.toLocaleString()}</p>
            <p className="stat-label">Pending Payments</p>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="card overflow-hidden">
        {data.payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Description', 'Task', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.payments.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-500 text-slate-700">{p.description || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-500">{p.task?.title || '—'}</td>
                    <td className="px-4 py-3.5 font-700 text-slate-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5"><span className={STATUS_BADGE[p.status]}>{p.status}</span></td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}