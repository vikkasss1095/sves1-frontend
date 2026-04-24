import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";

const STATUS_OPTIONS = ['all', 'pending', 'in_progress', 'completed', 'cancelled'];
const PRIORITY_COLOR = {
  low:    'bg-slate-50 text-slate-600 border-slate-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high:   'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
};
const STATUS_BADGE = {
  pending:     'badge-pending',
  in_progress: 'badge-progress',
  completed:   'badge-completed',
  cancelled:   'badge-rejected',
};

function StatusDropdown({ taskId, current, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const update = async (status) => {
    setLoading(true);
    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      toast.success('Task status updated');
      onUpdate(taskId, status);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const next = {
    pending:     ['in_progress'],
    in_progress: ['completed', 'pending'],
    completed:   [],
    cancelled:   [],
  }[current] || [];

  if (!next.length) return <span className={STATUS_BADGE[current]}>{current.replace('_', ' ')}</span>;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={STATUS_BADGE[current]}>{current.replace('_', ' ')}</span>
      {next.map(s => (
        <button key={s} onClick={() => update(s)} disabled={loading}
          className="text-[11px] px-2 py-0.5 rounded-full border border-brand-200 text-brand-600
                     hover:bg-brand-50 transition-all font-500 disabled:opacity-50">
          → {s.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
}

export default function VendorTasks() {
  const [tasks, setTasks]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (status !== 'all') params.status = status;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleStatusUpdate = (id, newStatus) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const isOverdue = (deadline, status) => {
    if (!deadline || status === 'completed' || status === 'cancelled') return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
        <p className="page-subtitle">{total} task{total !== 1 ? 's' : ''} assigned to you</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search tasks..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-600 transition-all border
                ${status === s
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}>
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
        <button onClick={fetchTasks} className="btn-secondary flex-shrink-0">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Task', 'Priority', 'Status', 'Assigned By', 'Deadline', 'Completed'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map(task => (
                  <tr key={task._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="font-600 text-slate-800 truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                      )}
                      {isOverdue(task.deadline, task.status) && (
                        <span className="inline-block mt-1 text-[10px] font-600 text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
                          OVERDUE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 border ${PRIORITY_COLOR[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusDropdown taskId={task._id} current={task.status} onUpdate={handleStatusUpdate} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{task.assignedBy?.name || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(task.deadline)}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{fmtDate(task.completedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">Page {page} of {pages} · {total} results</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-lg text-xs font-600 transition-all
                    ${page === n ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}