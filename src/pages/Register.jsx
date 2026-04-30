import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import bg from "../assets/registerbg.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    phone: "",
    gstNumber: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.fullName,
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        phone: form.phone,
        gstNumber: form.gstNumber,
      });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative w-[320px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
        <h2 className="text-xl text-cyan-400 text-center mb-4">
          Register Here
        </h2>

        <form onSubmit={submit} className="space-y-3">
          <input name="fullName" placeholder="Name" value={form.fullName} onChange={handle} className="input" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} className="input" />
          <input name="companyName" placeholder="Company" value={form.companyName} onChange={handle} className="input" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handle} className="input" />
          <input name="gstNumber" placeholder="GST" value={form.gstNumber} onChange={handle} className="input" />

          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handle}
              className="input pr-10"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-2">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 bg-red-500 text-white rounded-md">
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-3">
          Already have account? <Link to="/login" className="text-red-400">Login</Link>
        </p>
      </div>
    </div>
  );
}