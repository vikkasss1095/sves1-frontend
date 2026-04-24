import { useState } from 'react';
import { Eye, EyeOff, Lock, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from "../utils/axios";
import { useAuth } from '../context/AuthContext';

export default function VendorSettings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow]       = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleShow = key => setShow(s => ({ ...s, [key]: !s[key] }));

  const changePassword = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error('New passwords do not match');
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    toast.success('Logged out');
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/vendor/account');
      logout();
      navigate('/login', { replace: true });
      toast.success('Account deactivated');
    } catch { toast.error('Failed'); }
  };

  const pwFields = [
    { name: 'currentPassword', label: 'Current Password', key: 'current' },
    { name: 'newPassword',     label: 'New Password',     key: 'new' },
    { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account security and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Change password */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
              <Lock className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-700 text-slate-800">Change Password</h3>
              <p className="text-xs text-slate-400">Keep your account secure</p>
            </div>
          </div>
          <form onSubmit={changePassword} className="space-y-4">
            {pwFields.map(f => (
              <div key={f.name}>
                <label className="block text-xs font-600 text-slate-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                <div className="relative">
                  <input name={f.name} type={show[f.key] ? 'text' : 'password'}
                    value={form[f.name]} onChange={handle} required minLength={6}
                    placeholder="••••••••" className="input-field pr-10" />
                  <button type="button" onClick={() => toggleShow(f.key)}
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

        {/* Account actions */}
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
                <LogOut className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-700 text-slate-800">Logout</h3>
                <p className="text-xs text-slate-400">End your current session</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-secondary w-full justify-center">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="card p-6 border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-700 text-slate-800">Delete Account</h3>
                <p className="text-xs text-slate-400">Permanently deactivate your account</p>
              </div>
            </div>
            <button onClick={() => setConfirm(true)} className="btn-danger w-full justify-center">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-700 text-slate-900 mb-2">Delete account?</h3>
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone. All your data will be deactivated.</p>
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