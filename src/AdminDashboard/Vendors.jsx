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

  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/vendors', { params: { page, limit: 10, search, status } });
      setVendors(data.vendors);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Vendor Management</h1>
        <p className="page-subtitle">{total} vendors registered</p>
      </div>

      {/* SEARCH */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>

        <div className="flex gap-2">
          {STATUS_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => { setStatus(t.value); setPage(1); }}
              className={`px-3 py-1 rounded ${
                status === t.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="card overflow-hidden">

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Vendor</th>
                <th>Company</th>
                <th>Phone</th>
                <th>GST</th>
                <th>Status</th>
                <th>Registered</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map(v => (
                <tr key={v._id} className="border-b">

                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-xs text-gray-500">{v.email}</p>
                    </div>
                  </td>

                  <td>{v.companyName}</td>
                  <td>{v.phone}</td>
                  <td>{v.gstNumber}</td>

                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${
                      v.isApproved ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {v.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>

                  {/* 🔥 ONLY CHANGE HERE */}
                  <td className="text-center">
                    <button
                      onClick={() => navigate(`/admin/vendors/${v._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      View More
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

        {/* PAGINATION */}
        {pages > 1 && (
          <div className="flex justify-between p-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft />
            </button>

            <span>Page {page} / {pages}</span>

            <button onClick={() => setPage(p => Math.min(pages, p + 1))}>
              <ChevronRight />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}