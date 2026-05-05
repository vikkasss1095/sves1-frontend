import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔥 FETCH DATA
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/vendors", {
        params: {
          page,
          limit: 10,
          search,
        },
      });

      setVendors(res.data.vendors || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Vendor Management
        </h1>
        <p className="text-sm text-slate-500">
          {total} vendors registered
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <table className="w-full text-sm">

            {/* HEAD */}
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Vendor</th>
                <th className="text-left">Company</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Status</th>
                <th className="text-center">Details</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v._id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* NAME */}
                  <td className="p-3">
                    <p className="font-medium text-slate-800">
                      {v.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {v.email}
                    </p>
                  </td>

                  {/* COMPANY */}
                  <td className="text-slate-700">
                    {v.companyName || "-"}
                  </td>

                  {/* PHONE */}
                  <td className="text-slate-700">
                    {v.phone}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        v.isApproved
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {v.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  {/* BUTTON */}
                  <td className="text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/vendors/${v._id}`)
                      }
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View Full Details
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
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft />
          </button>

          <span className="text-sm">
            Page {page} / {pages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            <ChevronRight />
          </button>
        </div>
      )}

    </div>
  );
}