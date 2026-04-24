// ─── Notifications ───────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, CreditCard, FileText } from 'lucide-react';
import api from "../utils/axios";
import toast from 'react-hot-toast';

const TYPE_ICON = {
  task_assigned:    { icon: CheckCircle2,  bg: 'bg-brand-50',   text: 'text-brand-600' },
  profile_approved: { icon: CheckCircle2,  bg: 'bg-emerald-50', text: 'text-emerald-600' },
  profile_rejected: { icon: AlertTriangle, bg: 'bg-red-50',     text: 'text-red-600' },
  payment:          { icon: CreditCard,    bg: 'bg-teal-50',    text: 'text-teal-600' },
  document:         { icon: FileText,      bg: 'bg-purple-50',  text: 'text-purple-600' },
  warning:          { icon: AlertTriangle, bg: 'bg-amber-50',   text: 'text-amber-600' },
  general:          { icon: Info,          bg: 'bg-slate-50',   text: 'text-slate-500' },
};

export function VendorNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifs(data.notifications);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all');
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  const markOne = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const unread = notifs.filter(n => !n.isRead).length;

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="btn-secondary">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="card divide-y divide-slate-50">
        {notifs.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No notifications yet</p>
          </div>
        ) : notifs.map(n => {
          const { icon: Icon, bg, text } = TYPE_ICON[n.type] || TYPE_ICON.general;
          return (
            <div key={n._id} onClick={() => !n.isRead && markOne(n._id)}
              className={`flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer hover:bg-slate-50/60 ${!n.isRead ? 'bg-brand-50/30' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
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

export default VendorNotifications;