import { useEffect, useState } from 'react';
import { Save, Trash2, Building2, Mail, Phone, Hash, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";
import { useAuth } from '../context/AuthContext';

export default function VendorProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm]       = useState({ name: '', phone: '', companyName: '', gstNumber: '' });
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', companyName: user.companyName || '', gstNumber: user.gstNumber || '' });
  }, [user]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/vendor/profile', form);
      setUser(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/vendor/account');
      toast.success('Account deactivated');
      window.location.href = '/login';
    } catch {
      toast.error('Failed to deactivate account');
    }
  };

  const fields = [
    { name: 'name',        label: 'Full Name',     icon: User,      type: 'text',  placeholder: 'Your full name' },
    { name: 'companyName', label: 'Company Name',  icon: Building2, type: 'text',  placeholder: 'Company name' },
    { name: 'phone',       label: 'Phone Number',  icon: Phone,     type: 'tel',   placeholder: '+91 98765 43210' },
    { name: 'gstNumber',   label: 'GST Number',    icon: Hash,      type: 'text',  placeholder: '22AAAAA0000A1Z5' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your vendor account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Avatar card */}
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-3xl font-700 shadow-lg shadow-brand-500/20 mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-700 text-slate-800">{user?.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-600 border ${
              user?.isApproved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {user?.isApproved ? '✓ Approved' : '⏳ Pending'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-600 border bg-brand-50 text-brand-700 border-brand-200">
              Vendor
            </span>
          </div>

          <div className="w-full mt-6 pt-5 border-t border-slate-100 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="w-4 h-4 text-slate-300" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="w-4 h-4 text-slate-300" />
              <span>{user?.phone || 'Not added'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 className="w-4 h-4 text-slate-300" />
              <span>{user?.companyName || 'Not added'}</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-700 text-slate-800 mb-5">Edit Information</h3>
          <form onSubmit={save}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-600 text-slate-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      name={f.name} type={f.type} value={form[f.name]} onChange={handle}
                      placeholder={f.placeholder}
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email (read-only) */}
            <div className="mt-4">
              <label className="block text-xs font-600 text-slate-500 mb-1.5 uppercase tracking-wide">Email (read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input value={user?.email || ''} readOnly
                  className="input-field pl-9 bg-slate-50 text-slate-400 cursor-not-allowed" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><Save className="w-4 h-4" /> Save Changes</>
                }
              </button>

              {/* Danger zone */}
              <button type="button" onClick={() => setConfirm(true)}
                className="flex items-center gap-2 text-sm font-500 text-red-500 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-700 text-slate-900 mb-2">Delete account?</h3>
            <p className="text-sm text-slate-500 mb-5">Your account will be deactivated. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={deleteAccount} className="btn-danger flex-1">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}