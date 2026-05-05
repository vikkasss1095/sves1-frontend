import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    api.get(`/admin/vendordetails/${id}`) 
      .then(res => setVendor(res.data))
      .catch(() => toast.error("Failed to load vendor"));
  }, [id]);

  if (!vendor) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-xl shadow flex gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl">
          {vendor.firstName?.charAt(0)}
        </div>

        <div>
          <h2 className="text-xl font-bold">
            {vendor.firstName} {vendor.lastName}
          </h2>
          <p>{vendor.email}</p>
          <p>{vendor.phone}</p>

          <span className={`px-3 py-1 rounded text-sm ${
            vendor.status === "approved"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}>
            {vendor.status}
          </span>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* COMPANY */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Company</h3>
          <p><b>Name:</b> {vendor.companyName}</p>
          <p><b>Type:</b> {vendor.companyType}</p>
          <p><b>GST:</b> {vendor.gstNumber}</p>
        </div>

        {/* PROFESSIONAL */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Professional</h3>
          <p><b>Category:</b> {vendor.category}</p>
          <p><b>Experience:</b> {vendor.experience}</p>
          <p><b>Skills:</b> {vendor.skills?.join(", ")}</p>
        </div>

        {/* EDUCATION */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Education</h3>
          {vendor.education?.map((e, i) => (
            <p key={i}>{e.degree} - {e.institution}</p>
          ))}
        </div>

        {/* BANK */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Bank</h3>
          <p><b>Account:</b> {vendor.accountNumber}</p>
          <p><b>IFSC:</b> {vendor.ifsc}</p>
          <p><b>Bank:</b> {vendor.bankName}</p>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => api.put(`/admin/vendor/${id}/approve`).then(()=>toast.success("Approved"))}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Approve
        </button>

        <button
          onClick={() => api.put(`/admin/vendor/${id}/reject`).then(()=>toast.success("Rejected"))}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
      </div>

    </div>
  );
}