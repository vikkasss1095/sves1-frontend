import { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle2, XCircle, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";

const STATUS_TABS = [
  { value: '',         label: 'All' },
  { value: 'pending',  label: 'Pending' },
  { value: 'approved', label: 'Approved' },
];

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/vendors', { params: { page, limit: 10, search, status } });
      setVendors(data.vendors);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load vendors'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const approve = async (id) => {
    try {
      await api.put(`/admin/vendors/${id}/approve`);
      toast.success('Vendor approved');
      fetchVendors();
    } catch { toast.error('Failed'); }
  };

  const reject = async (id) => {
    try {
      await api.put(`/admin/vendors/${id}/reject`, { reason: 'Account rejected by admin.' });
      toast.success('Vendor rejected');
      fetchVendors();
    } catch { toast.error('Failed'); }
  };

  const deleteV = async (id) => {
    if (!window.confirm('Delete this vendor permanently?')) return;
    try {
      await api.delete(`/admin/vendors/${id}`);
      toast.success('Vendor deleted');
      fetchVendors();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vendor Management</h1>
        <p className="page-subtitle">{total} vendor{total !== 1 ? 's' : ''} registered</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, email, company..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9" />
        </div>
        <div className="flex items-center gap-2">
          {STATUS_TABS.map(t => (
            <button key={t.value} onClick={() => { setStatus(t.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-600 transition-all border
                ${status === t.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No vendors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Vendor', 'Company', 'Phone', 'GST', 'Status', 'Registered', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vendors.map(v => (
                  <tr key={v._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-700 flex-shrink-0">
                          {v.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-600 text-slate-800">{v.name}</p>
                          <p className="text-xs text-slate-400">{v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{v.companyName || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-500">{v.phone || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{v.gstNumber || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={v.isApproved ? 'badge-approved' : 'badge-pending'}>
                        {v.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(v)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-600 transition-all" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {!v.isApproved && (
                          <button onClick={() => approve(v._id)}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all" title="Approve">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {v.isApproved && (
                          <button onClick={() => reject(v._id)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteV(v._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Vendor detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 text-xl font-700">
                {selected.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-700 text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-400">{selected.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Company',    selected.companyName || '—'],
                ['Phone',      selected.phone       || '—'],
                ['GST Number', selected.gstNumber   || '—'],
                ['Status',     selected.isApproved ? 'Approved' : 'Pending'],
                ['Joined',     new Date(selected.createdAt).toLocaleDateString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-400 font-500">{k}</span>
                  <span className="text-slate-700 font-600">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Close</button>
              {!selected.isApproved && (
                <button onClick={() => { approve(selected._id); setSelected(null); }} className="btn-primary flex-1">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}