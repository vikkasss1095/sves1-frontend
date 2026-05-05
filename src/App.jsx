import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate(); // ✅ ADD

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
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {STATUS_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => { setStatus(t.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-600 border
              ${status === t.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-500 border-slate-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="border-b bg-slate-50/60">
                  {['Vendor', 'Company', 'Phone', 'GST', 'Status', 'Registered', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {vendors.map(v => (
                  <tr key={v._id} className="hover:bg-slate-50">

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-600">{v.name}</p>
                        <p className="text-xs text-gray-400">{v.email}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3">{v.companyName || '—'}</td>
                    <td className="px-4 py-3">{v.phone || '—'}</td>
                    <td className="px-4 py-3">{v.gstNumber || '—'}</td>

                    <td className="px-4 py-3">
                      <span className={v.isApproved ? 'badge-approved' : 'badge-pending'}>
                        {v.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {new Date(v.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    {/* ✅ FINAL CHANGE */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/admin/vendors/${v._id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View More
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-between px-4 py-3 border-t">
            <p className="text-xs">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft />
              </button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))}>
                <ChevronRight />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}