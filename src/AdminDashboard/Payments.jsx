// ─── Admin Payments ───────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";

const S_BADGE = { pending: 'badge-pending', approved: 'badge-progress', paid: 'badge-completed', rejected: 'badge-rejected' };

export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors]   = useState([]);
  const [form, setForm]         = useState({ vendor: '', amount: '', description: '' });
  const [creating, setCreating] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/payments'); setPayments(data.payments); }
    catch { toast.error('Failed to load payments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openForm = async () => {
    if (!vendors.length) {
      const { data } = await api.get('/admin/vendors', { params: { limit: 100, status: 'approved' } });
      setVendors(data.vendors);
    }
    setShowForm(true);
  };

  const create = async e => {
    e.preventDefault(); setCreating(true);
    try {
      await api.post('/payments', form);
      toast.success('Payment record created'); setShowForm(false);
      setForm({ vendor: '', amount: '', description: '' }); fetch();
    } catch { toast.error('Failed'); } finally { setCreating(false); }
  };

  const approve = async (id) => {
    try { await api.put(`/admin/payments/${id}/approve`); toast.success('Payment approved'); fetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div><h1 className="page-title">Payments</h1><p className="page-subtitle">Manage vendor payments</p></div>
        <button onClick={openForm} className="btn-primary"><Plus className="w-4 h-4" /> Create Payment</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No payments yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Vendor', 'Description', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-600 text-slate-800">{p.vendor?.name}</p>
                      <p className="text-xs text-slate-400">{p.vendor?.companyName}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{p.description || '—'}</td>
                    <td className="px-4 py-3.5 font-700 text-slate-900">₹{p.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3.5"><span className={S_BADGE[p.status]}>{p.status}</span></td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3.5">
                      {p.status === 'pending' && (
                        <button onClick={() => approve(p._id)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-slate-900">Create Payment</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={create} className="space-y-4">
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Select Vendor</label>
                <select value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} required className="input-field">
                  <option value="">Choose vendor</option>
                  {vendors.map(v => <option key={v._id} value={v._id}>{v.name} — {v.companyName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Amount (₹)</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required min={1} className="input-field" placeholder="5000" />
              </div>
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" placeholder="Payment for Task #42" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 justify-center">
                  {creating ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Notifications ──────────────────────────────────────────────────────
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2 as Check2, CreditCard, FileText } from 'lucide-react';

const TYPE_ICON = {
  task_assigned: { icon: Check2, bg: 'bg-brand-50', text: 'text-brand-600' },
  profile_approved: { icon: Check2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  profile_rejected: { icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600' },
  payment: { icon: CreditCard, bg: 'bg-teal-50', text: 'text-teal-600' },
  document: { icon: FileText, bg: 'bg-purple-50', text: 'text-purple-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-600' },
  general: { icon: Info, bg: 'bg-slate-50', text: 'text-slate-500' },
};

export function AdminNotifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(r => setNotifs(r.data.notifications))
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false));
  }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all');
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unread = notifs.filter(n => !n.isRead).length;

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">{unread} unread</p></div>
        {unread > 0 && <button onClick={markAll} className="btn-secondary"><CheckCheck className="w-4 h-4" /> Mark all read</button>}
      </div>
      <div className="card divide-y divide-slate-50">
        {notifs.length === 0 ? (
          <div className="p-12 text-center"><Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-slate-400 text-sm">No notifications</p></div>
        ) : notifs.map(n => {
          const { icon: Icon, bg, text } = TYPE_ICON[n.type] || TYPE_ICON.general;
          return (
            <div key={n._id} className={`flex items-start gap-4 px-5 py-4 ${!n.isRead ? 'bg-brand-50/30' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}><Icon className={`w-4 h-4 ${text}`} /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.isRead ? 'font-500 text-slate-600' : 'font-600 text-slate-800'}`}>{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                <p className="text-[11px] text-slate-300 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Admin Settings ───────────────────────────────────────────────────────────
import { Lock, LogOut } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";   // ✅ FIXED PATH

export function AdminSettings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow]       = useState({ c: false, n: false, r: false });
  const [loading, setLoading] = useState(false);

  const change = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Settings</h1><p className="page-subtitle">Admin account settings</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center"><Lock className="w-4 h-4 text-brand-600" /></div>
            <div><h3 className="text-sm font-700 text-slate-800">Change Password</h3><p className="text-xs text-slate-400">Update admin credentials</p></div>
          </div>
          <form onSubmit={change} className="space-y-4">
            {[
              { name: 'currentPassword', label: 'Current Password', key: 'c' },
              { name: 'newPassword',     label: 'New Password',     key: 'n' },
              { name: 'confirmPassword', label: 'Confirm Password', key: 'r' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-600 text-slate-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                <div className="relative">
                  <input name={f.name} type={show[f.key] ? 'text' : 'password'} value={form[f.name]}
                    onChange={e => setForm({...form, [f.name]: e.target.value})} required minLength={6}
                    placeholder="••••••••" className="input-field pr-10" />
                  <button type="button" onClick={() => setShow(s => ({...s, [f.key]: !s[f.key]}))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center"><LogOut className="w-4 h-4 text-slate-500" /></div>
            <div><h3 className="text-sm font-700 text-slate-800">Logout</h3><p className="text-xs text-slate-400">End current admin session</p></div>
          </div>
          <button onClick={() => { logout(); navigate('/login', { replace: true }); toast.success('Logged out'); }} className="btn-secondary w-full justify-center">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPayments;