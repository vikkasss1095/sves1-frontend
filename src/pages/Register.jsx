import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";

import bg from "../assets/registerbg.jpg";

export default function Register() {
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
      await api.post("/auth/register", form);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative w-[320px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">

        <h2 className="text-xl text-cyan-400 text-center mb-4">
          Register
        </h2>

        {/* 🔥 IMPORTANT */}
        <form onSubmit={submit} autoComplete="off" className="space-y-3">

          {/* hidden fields (chrome hack) */}
          <input type="text" name="fakeuser" style={{ display: "none" }} />
          <input type="password" name="fakepass" style={{ display: "none" }} />

          {/* Name */}
          <input
            name="name"
            type="text"
            placeholder="Enter username"
            value={form.name}
            onChange={handle}
            autoComplete="off"
            className="input"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handle}
            autoComplete="off"
            className="input"
          />

          {/* Company */}
          <input
            name="companyName"
            type="text"
            placeholder="Enter company name"
            value={form.companyName}
            onChange={handle}
            autoComplete="off"
            className="input"
          />

          {/* Phone */}
          <input
            name="phone"
            type="tel"
            placeholder="Enter phone"
            value={form.phone}
            onChange={handle}
            autoComplete="off"
            className="input"
          />

          {/* GST */}
          <input
            name="gstNumber"
            type="text"
            placeholder="Enter GST"
            value={form.gstNumber}
            onChange={handle}
            autoComplete="off"
            className="input"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handle}
              autoComplete="new-password"
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-2 text-gray-300"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-500 rounded-md text-white"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-3">
          Already have account?{" "}
          <Link to="/login" className="text-red-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
<h1 style={{ color: "red" }}>NEW BUILD TEST</h1>