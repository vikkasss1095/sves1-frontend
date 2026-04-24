import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";

const PRIORITY_COLOR = {
  low: 'bg-slate-50 text-slate-600 border-slate-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
};
const STATUS_BADGE = {
  pending: 'badge-pending', in_progress: 'badge-progress',
  completed: 'badge-completed', cancelled: 'badge-rejected',
};

export default function AdminTasks() {
  const [tasks, setTasks]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [form, setForm]       = useState({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
  const [creating, setCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (status !== 'all') params.status = status;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks); setTotal(data.total); setPages(data.pages);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const loadVendors = async () => {
    if (vendors.length) return;
    try {
      const { data } = await api.get('/admin/vendors', { params: { limit: 100, status: 'approved' } });
      setVendors(data.vendors);
    } catch {}
  };

  const openForm = () => { loadVendors(); setShowForm(true); };

  const createTask = async e => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/tasks', form);
      toast.success('Task created and vendor notified');
      setShowForm(false);
      setForm({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally { setCreating(false); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch { toast.error('Failed'); }
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">{total} task{total !== 1 ? 's' : ''} in system</p>
        </div>
        <button onClick={openForm} className="btn-primary"><Plus className="w-4 h-4" /> Assign Task</button>
      </div>

      {/* Filter bar */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search tasks..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'pending', 'in_progress', 'completed'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-600 transition-all border
                ${status === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No tasks found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Task', 'Assigned To', 'Priority', 'Status', 'Deadline', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map(task => (
                  <tr key={task._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="font-600 text-slate-800 truncate">{task.title}</p>
                      {task.description && <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-500 text-slate-700">{task.assignedTo?.name || '—'}</p>
                      <p className="text-xs text-slate-400">{task.assignedTo?.companyName || ''}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 border ${PRIORITY_COLOR[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><span className={STATUS_BADGE[task.status]}>{task.status.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">{fmtDate(task.deadline)}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => deleteTask(task._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">Page {page} of {pages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600">◀</button>
              <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-600">▶</button>
            </div>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-slate-900">Assign New Task</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={createTask} className="space-y-4">
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Task Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Enter task title" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={3} placeholder="Task details..." className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-600 text-slate-500 mb-1.5">Assign To *</label>
                  <select value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} required className="input-field">
                    <option value="">Select vendor</option>
                    {vendors.map(v => <option key={v._id} value={v._id}>{v.name} — {v.companyName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-600 text-slate-500 mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="input-field">
                    {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-600 text-slate-500 mb-1.5">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="input-field" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 justify-center">
                  {creating ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}