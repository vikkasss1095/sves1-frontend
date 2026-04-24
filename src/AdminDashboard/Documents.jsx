import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleUpload = async () => {
    try {
      if (!file) {
        toast.error("Please select file");
        return;
      }

      if (!name || !type) {
        toast.error("Fill all fields");
        return;
      }

      const fd = new FormData();
      fd.append("file", file);   // 🔥 must match backend
      fd.append("name", name);
      fd.append("type", type);

      // ❌ DON'T SET Content-Type manually
      const res = await api.post("/vendor/documents", fd);

      console.log("SUCCESS 👉", res.data);
      toast.success("Uploaded successfully");

      setFile(null);
      setName("");
      setType("");

    } catch (err) {
      console.error("UPLOAD ERROR 👉", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Upload Document</h1>

      <input
        type="text"
        placeholder="Document Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-3 w-full"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 mb-3 w-full"
      >
        <option value="">Select Type</option>
        <option value="PAN Card">PAN Card</option>
        <option value="Aadhar">Aadhar</option>
      </select>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}