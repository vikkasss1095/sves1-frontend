import { useEffect, useState, useCallback } from "react";
import {
  Search, CheckCircle2, XCircle,
  Trash2, ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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
        <p className="page-subtitle">{total} vendors</p>
      </div>

      {/* SEARCH */}
      <div className="card p-4 mb-5 flex gap-3">
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
      </div>

      {/* TABLE */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="h-40 flex justify-center items-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">Vendor</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map(v => (
                <tr key={v._id} className="border-b">

                  <td className="p-3">
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.email}</p>
                  </td>

                  <td>{v.companyName}</td>
                  <td>{v.phone}</td>

                  <td>
                    {v.isApproved ? "Approved" : "Pending"}
                  </td>

                  <td className="flex gap-2 p-2">
                    <Eye
                      className="cursor-pointer"
                      onClick={() => setSelected(v)}
                    />

                    <CheckCircle2 onClick={() => approve(v._id)} className="cursor-pointer text-green-500" />
                    <XCircle onClick={() => reject(v._id)} className="cursor-pointer text-yellow-500" />
                    <Trash2 onClick={() => deleteV(v._id)} className="cursor-pointer text-red-500" />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 FULL PROFILE MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white w-[700px] rounded-xl p-6 space-y-5">

            <h2 className="text-xl font-bold">Vendor Profile</h2>

            {/* BASIC */}
            <div>
              <h3 className="font-semibold mb-2">Basic Info</h3>
              <p>Name: {selected.name}</p>
              <p>Email: {selected.email}</p>
              <p>Phone: {selected.phone}</p>
              <p>Address: {selected.address}</p>
            </div>

            {/* PROFESSIONAL */}
            <div>
              <h3 className="font-semibold mb-2">Professional</h3>
              <p>Education: {selected.education}</p>
              <p>Experience: {selected.experience}</p>
              <p>Skills: {selected.skills?.join(", ")}</p>
            </div>

            {/* BANK */}
            <div>
              <h3 className="font-semibold mb-2">Bank</h3>
              <p>Account: {selected.bankDetails?.accountNumber}</p>
              <p>IFSC: {selected.bankDetails?.ifsc}</p>
              <p>Bank: {selected.bankDetails?.bankName}</p>
            </div>

            {/* ACTION */}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setSelected(null)} className="btn-secondary">
                Close
              </button>

              {!selected.isApproved && (
                <button
                  onClick={() => {
                    approve(selected._id);
                    setSelected(null);
                  }}
                  className="btn-primary"
                >
                  Approve
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}