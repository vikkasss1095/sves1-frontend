import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // 🔥 FIX HERE (plural vendors)
        const res = await api.get(`/admin/vendors/${id}`);
        setVendor(res.data);
      } catch (err) {
        toast.error("Failed to load vendor");
      }
    };

    fetchVendor();
  }, [id]);

  if (!vendor) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Vendor Details</h1>

      <p><b>Name:</b> {vendor.name}</p>
      <p><b>Email:</b> {vendor.email}</p>
      <p><b>Company:</b> {vendor.companyName}</p>
      <p><b>Phone:</b> {vendor.phone}</p>
      <p><b>GST:</b> {vendor.gstNumber}</p>
    </div>
  );
}