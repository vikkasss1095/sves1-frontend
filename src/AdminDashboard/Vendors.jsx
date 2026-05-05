import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

export default function Vendors() {
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
        params: { page, limit: 10, search, status },
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

  return (
    <div className="p-5">

      {/* HEADER */}
      <h1 className="text-xl font-bold mb-1">Vendor Management</h1>
      <p className="text-sm text-gray-500 mb-4">
        {total} vendors registered
      </p>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setStatus(t.value);
              setPage(1);
            }}
            className={`px-3 py-2 rounded ${
              status === t.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">

        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
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
              {vendors.map((v) => (
                <tr key={v._id} className="border-b">

                  <td className="p-3">
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.email}</p>
                  </td>

                  <td>{v.companyName}</td>
                  <td>{v.phone}</td>
                  <td>{v.gstNumber}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        v.isApproved
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {v.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>

                  {/* 🔥 FINAL BUTTON */}
                  <td className="text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/vendors/${v._id}`)
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
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
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft />
            </button>

            <span>
              Page {page} / {pages}
            </span>

            <button onClick={() => setPage((p) => Math.min(pages, p + 1))}>
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}