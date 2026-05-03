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

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

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
      <img
        src={bg}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔥 CARD FIX */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] 
                      p-5 sm:p-6 
                      bg-white/10 backdrop-blur-xl 
                      border border-white/20 
                      rounded-2xl">

        <h2 className="text-lg sm:text-xl text-cyan-400 text-center mb-4">
          Register Here
        </h2>

        <form onSubmit={submit} autoComplete="off" className="space-y-3">

          {/* Autofill block */}
          <input type="text" className="hidden" />
          <input type="password" className="hidden" />

          {/* INPUT COMMON CLASS */}
          {/* Username */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              Username
            </label>
            <input
              name="user_name"
              value={form.user_name}
              onChange={handle}
              placeholder="Enter username"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              Email Id
            </label>
            <input
              name="user_email"
              value={form.user_email}
              onChange={handle}
              placeholder="Enter email"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              Company Name
            </label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handle}
              placeholder="Enter company name"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              Phone
            </label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handle}
              placeholder="Enter phone"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
            />
          </div>

          {/* GST */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              GST Number
            </label>
            <input
              name="gst_number"
              value={form.gst_number}
              onChange={handle}
              placeholder="Enter GST"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-xs sm:text-sm text-gray-300">
              Password
            </label>

            <input
              name="user_password"
              type={showPwd ? "text" : "password"}
              value={form.user_password}
              onChange={handle}
              placeholder="Enter password"
              className="w-full mt-1 px-3 py-2 rounded-md bg-white text-black text-sm pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-8 text-gray-500"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Button */}
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