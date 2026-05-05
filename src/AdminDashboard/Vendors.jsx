import { useEffect, useState, useCallback } from "react";
import {
  Search, CheckCircle2, XCircle,
  Trash2, ChevronLeft, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/vendors", {
        params: { page, limit: 10, search, status }
      });
      setVendors(data.vendors);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const approve = async (id) => {
    await api.put(`/admin/vendors/${id}/approve`);
    toast.success("Approved");
    fetchVendors();
  };

  const reject = async (id) => {
    await api.put(`/admin/vendors/${id}/reject`);
    toast.success("Rejected");
    fetchVendors();
  };

  const deleteV = async (id) => {
    if (!window.confirm("Delete vendor?")) return;
    await api.delete(`/admin/vendors/${id}`);
    toast.success("Deleted");
    fetchVendors();
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Vendor Management</h1>
        <p className="page-subtitle">{total} vendors registered</p>
      </div>

      {/* SEARCH */}
      <div className="card p-4 mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="h-40 flex justify-center items-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                <th className="p-3 text-left">Vendor</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map(v => (
                <tr key={v._id} className="border-b hover:bg-slate-50 transition">

                  {/* NAME */}
                  <td className="p-3">
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.email}</p>
                  </td>

                  {/* COMPANY */}
                  <td>{v.companyName}</td>

                  {/* PHONE */}
                  <td>{v.phone}</td>

                  {/* STATUS */}
                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${
                      v.isApproved
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {v.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2 justify-center flex-wrap">

                    {/* 🔥 VIEW BUTTON */}
                    <button
                      onClick={() => navigate(`/admin/vendors/${v._id}`)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>

                    {/* APPROVE */}
                    {!v.isApproved && (
                      <button
                        onClick={() => approve(v._id)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}

                    {/* REJECT */}
                    {v.isApproved && (
                      <button
                        onClick={() => reject(v._id)}
                        className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    )}

                    {/* DELETE */}
                    <button
                      onClick={() => deleteV(v._id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
  );
}