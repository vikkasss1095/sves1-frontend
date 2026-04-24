import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

// ✅ Image import (IMPORTANT)
import bg from "../assets/registerbg.jpg";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    gstNumber: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
  
      toast.success("Registration successful!");
      navigate("/vendor", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Username", type: "text", placeholder: "Enter username" },
    { name: "email", label: "Email Id", type: "email", placeholder: "Enter email" },
    { name: "companyName", label: "College Name", type: "text", placeholder: "Enter college" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "Enter phone" },
    { name: "gstNumber", label: "GST Number", type: "text", placeholder: "Enter GST" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔵 Blue Glow */}
      <div className="absolute left-[25%] top-[10%] w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-50"></div>

      {/* 🟠 Orange Glow */}
      <div className="absolute right-[25%] bottom-[10%] w-48 h-48 bg-orange-400 rounded-full blur-3xl opacity-50"></div>

      {/* Card */}
      <div className="relative w-[320px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* Heading */}
        <h2 className="text-xl text-cyan-400 text-center font-semibold mb-4">
          Register Here
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="space-y-3">

          {fields.map((f) => (
            <div key={f.name}>
              <label className="text-white text-xs">{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handle}
                required
                placeholder={f.placeholder}
                className="w-full mt-1 px-3 py-2 text-sm rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
              />
            </div>
          ))}

          {/* Password */}
          <div>
            <label className="text-white text-xs">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={handle}
                required
                className="w-full mt-1 px-3 py-2 pr-10 text-sm rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2 text-gray-300"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-600 transition mt-2"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-gray-300 text-xs mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400">
            Login Here..
          </Link>
        </p>
      </div>
    </div>
  );
}