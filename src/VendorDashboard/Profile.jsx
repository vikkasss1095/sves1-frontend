import { useState, useEffect } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function CreateAccount() {
  const { user, setUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    skills: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  });

  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  // Prefill data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        education: user.education || "",
        experience: user.experience || "",
        skills: user.skills?.join(", ") || "",
        accountNumber: user.bankDetails?.accountNumber || "",
        ifsc: user.bankDetails?.ifsc || "",
        bankName: user.bankDetails?.bankName || "",
      });
    }
  }, [user]);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔥 SCORE SYSTEM
  let score = 0;
  if (form.name) score += 10;
  if (form.phone) score += 10;
  if (form.education) score += 10;
  if (form.experience) score += 10;
  if (form.skills) score += 20;
  if (resume || user?.resume) score += 20;
  if (form.accountNumber) score += 20;

  // 🔥 SAVE PROFILE
  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      data.append(
        "skills",
        JSON.stringify(form.skills.split(",").map((s) => s.trim()))
      );

      if (photo) data.append("photo", photo);
      if (resume) data.append("resume", resume);

      const res = await api.post("/vendor/profile", data);

      toast.success("Profile saved");

      setUser(res.data.user);
      setEditMode(false);

    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vendor Profile</h2>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ================= VIEW MODE ================= */}
      {!editMode ? (
        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white shadow p-4 rounded-xl text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl">
              {user?.name?.charAt(0)}
            </div>

            <h3 className="mt-3 font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>

            <p className="mt-2 text-xs bg-yellow-100 inline-block px-2 py-1 rounded">
              {user?.status || "Pending"}
            </p>

            {/* SCORE */}
            <div className="mt-4">
              <div className="text-lg font-bold">{score}%</div>
              <p className="text-xs text-gray-500">Profile Score</p>
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="md:col-span-2 bg-white shadow p-6 rounded-xl">

            <h3 className="font-semibold mb-4">Profile Details</h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <p><b>Phone:</b> {user?.phone}</p>
              <p><b>Address:</b> {user?.address}</p>
              <p><b>Education:</b> {user?.education}</p>
              <p><b>Experience:</b> {user?.experience}</p>
              <p><b>Skills:</b> {user?.skills?.join(", ")}</p>
            </div>

            {/* Resume */}
            {user?.resume && (
              <div className="mt-4">
                <a
                  href={user.resume}
                  target="_blank"
                  className="text-blue-500"
                >
                  View Resume
                </a>
              </div>
            )}

          </div>
        </div>
      ) : (

        /* ================= EDIT MODE ================= */
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow space-y-6">

          {/* BASIC */}
          <div>
            <h3 className="font-semibold mb-3">Basic Info</h3>

            <input
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="Name"
              className="input"
            />

            <input
              value={user?.email}
              readOnly
              className="input bg-gray-100"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handle}
              placeholder="Phone"
              className="input"
            />

            <input
              name="address"
              value={form.address}
              onChange={handle}
              placeholder="Address"
              className="input"
            />

            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="input"
            />
          </div>

          {/* PROFESSIONAL */}
          <div>
            <h3 className="font-semibold mb-3">Professional</h3>

            <input
              name="education"
              value={form.education}
              onChange={handle}
              placeholder="Education"
              className="input"
            />

            <input
              name="experience"
              value={form.experience}
              onChange={handle}
              placeholder="Experience"
              className="input"
            />

            <input
              name="skills"
              value={form.skills}
              onChange={handle}
              placeholder="Skills (comma separated)"
              className="input"
            />
          </div>

          {/* RESUME */}
          <div>
            <h3 className="font-semibold mb-3">Resume</h3>

            <input
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              className="input"
            />
          </div>

          {/* BANK */}
          <div>
            <h3 className="font-semibold mb-3">Bank Details</h3>

            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handle}
              placeholder="Account Number"
              className="input"
            />

            <input
              name="ifsc"
              value={form.ifsc}
              onChange={handle}
              placeholder="IFSC"
              className="input"
            />

            <input
              name="bankName"
              value={form.bankName}
              onChange={handle}
              placeholder="Bank Name"
              className="input"
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </form>
      )}
    </div>
  );
}