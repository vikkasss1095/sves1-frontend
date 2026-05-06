import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    loadVendor();
  }, [id]);

  const loadVendor = async () => {
    try {
      const res = await api.get(`/admin/vendors/${id}`);

      setVendor(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);

      toast.error("Failed to load vendor");
    }
  };

  const approveVendor = async () => {
    try {
      await api.put(`/admin/vendors/${id}/approve`);

      toast.success("Vendor Approved");

      loadVendor();
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  const rejectVendor = async () => {
    try {
      await api.put(`/admin/vendors/${id}/reject`);

      toast.success("Vendor Rejected");

      loadVendor();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  if (!vendor) {
    return (
      <div className="p-6 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Top Card */}
      <div className="bg-white p-6 rounded-xl shadow flex gap-6">

        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white text-3xl">
          {vendor.photoPreview ? (
            <img
              src={vendor.photoPreview}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            vendor.firstName?.charAt(0)
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            {vendor.firstName} {vendor.lastName}
          </h2>

          <p>{vendor.email}</p>

          <p>{vendor.phone}</p>

          <p className="mt-1 text-gray-500">
            {vendor.city}, {vendor.state}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 rounded text-sm ${
              vendor.status === "approved"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {vendor.status}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Company */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-lg">
            Company Details
          </h3>

          <div className="space-y-2">
            <p><b>Name:</b> {vendor.companyName || "-"}</p>

            <p><b>Type:</b> {vendor.companyType || "-"}</p>

            <p><b>GST:</b> {vendor.gstNumber || "-"}</p>

            <p><b>PAN:</b> {vendor.panNumber || "-"}</p>

            <p><b>Website:</b> {vendor.website || "-"}</p>
          </div>
        </div>

        {/* Professional */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-lg">
            Professional Info
          </h3>

          <div className="space-y-2">
            <p><b>Category:</b> {vendor.category || "-"}</p>

            <p><b>Sub Category:</b> {vendor.subCategory || "-"}</p>

            <p><b>Experience:</b> {vendor.experience || "-"}</p>

            <p><b>Role:</b> {vendor.currentRole || "-"}</p>

            <p>
              <b>Skills:</b>{" "}
              {vendor.skills?.length > 0
                ? vendor.skills.join(", ")
                : "-"}
            </p>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-lg">
            Education
          </h3>

          <div className="space-y-3">
            {vendor.education?.length > 0 ? (
              vendor.education.map((edu, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3"
                >
                  <p><b>Degree:</b> {edu.degree}</p>

                  <p><b>Institution:</b> {edu.institution}</p>

                  <p><b>Year:</b> {edu.year}</p>

                  <p><b>Grade:</b> {edu.grade}</p>
                </div>
              ))
            ) : (
              <p>No education added</p>
            )}
          </div>
        </div>

        {/* Bank */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-lg">
            Bank Details
          </h3>

          <div className="space-y-2">
            <p><b>Account Holder:</b> {vendor.accountHolder || "-"}</p>

            <p><b>Account Number:</b> {vendor.accountNumber || "-"}</p>

            <p><b>IFSC:</b> {vendor.ifsc || "-"}</p>

            <p><b>Bank:</b> {vendor.bankName || "-"}</p>

            <p><b>Branch:</b> {vendor.branchName || "-"}</p>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-4">

        <button
          onClick={approveVendor}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
        >
          Approve
        </button>

        <button
          onClick={rejectVendor}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
        >
          Reject
        </button>

      </div>
    </div>
  );
}