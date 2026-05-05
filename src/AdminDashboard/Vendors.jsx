import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/vendors", {
        params: { page, limit: 10, search, status },
      });

      setVendors(data.vendors);
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

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Vendor Management</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={`px-3 py-1 rounded ${
              status === t.value ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Vendor</th>
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">GST</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((v) => (
            <tr key={v._id} className="border-t">

              {/* Vendor */}
              <td className="p-2">
                <div>
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-sm text-gray-400">{v.email}</p>
                </div>
              </td>

              {/* FIX ALIGNMENT */}
              <td className="p-2">{v.companyName || "-"}</td>
              <td className="p-2">{v.phone || "-"}</td>
              <td className="p-2">{v.gstNumber || "-"}</td>

              <td className="p-2">
                <span className={v.isApproved ? "text-green-600" : "text-yellow-600"}>
                  {v.isApproved ? "Approved" : "Pending"}
                </span>
              </td>

              {/* ✅ VIEW MORE */}
              <td className="p-2">
                <button
                  onClick={() => navigate(`/admin/vendorsdetails/${v._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeft />
        </button>
        <button onClick={() => setPage(page + 1)} disabled={page === pages}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}