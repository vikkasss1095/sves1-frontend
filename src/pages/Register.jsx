import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import bg from "../assets/registerbg.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    company_name: "",
    phone_number: "",
    gst_number: "",
    user_password: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;

    // 🔥 phone max 10 digits
    if (name === "phone_number") {
      if (!/^\d{0,10}$/.test(value)) return;
    }

    // 🔥 password max 6
    if (name === "user_password") {
      if (value.length > 6) return;
    }

    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.user_email)) {
      toast.error("Invalid email");
      return false;
    }

    if (form.phone_number.length !== 10) {
      toast.error("Phone must be 10 digits");
      return false;
    }

    if (form.user_password.length !== 6) {
      toast.error("Password must be 6 characters");
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.user_name,
        email: form.user_email,
        password: form.user_password,
        companyName: form.company_name,
        phone: form.phone_number,
        gstNumber: form.gst_number,
      });

      toast.success("Registration successful!");
      navigate("/login", { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4">

      {/* BG */}
      <img src={bg} alt="bg" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] 
                      p-5 sm:p-6 
                      bg-white/10 backdrop-blur-xl 
                      border border-white/20 
                      rounded-2xl">

        <h2 className="text-lg sm:text-xl text-cyan-400 text-center mb-4">
          Register Here
        </h2>

        {/* 🔥 FORM */}
        <form onSubmit={submit} autoComplete="off" className="space-y-3">

          {/* 🔥 Autofill block (important) */}
          <input type="text" name="fake_user" autoComplete="username" className="hidden" />
          <input type="password" name="fake_pass" autoComplete="new-password" className="hidden" />

          {/* Username */}
          <input
            name="user_name"
            value={form.user_name}
            onChange={handle}
            autoComplete="off"
            placeholder="Enter username"
            className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
          />

          {/* Email */}
          <input
            name="user_email"
            type="email"
            value={form.user_email}
            onChange={handle}
            autoComplete="off"
            placeholder="Enter email"
            className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
          />

          {/* Company */}
          <input
            name="company_name"
            value={form.company_name}
            onChange={handle}
            autoComplete="off"
            placeholder="Enter company name"
            className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
          />

          {/* Phone */}
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handle}
            autoComplete="off"
            placeholder="Enter phone"
            className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
          />

          {/* GST */}
          <input
            name="gst_number"
            value={form.gst_number}
            onChange={handle}
            autoComplete="off"
            placeholder="Enter GST"
            className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="user_password"
              type={showPwd ? "text" : "password"}
              value={form.user_password}
              autoComplete="new-password"
              onChange={handle}
              placeholder="Enter password"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full py-2 bg-red-500 text-white rounded-md text-sm sm:text-base active:scale-95 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-3">
          Already have account?{" "}
          <Link to="/login" className="text-red-400">
            Login Here..
          </Link>
        </p>
      </div>
    </div>
  );
}