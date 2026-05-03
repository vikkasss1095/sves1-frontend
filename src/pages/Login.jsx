import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import bg from "../assets/registerbg2.jpg";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    user_email: "",
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
      const res = await api.post("/auth/login", {
        email: form.user_email,
        password: form.user_password,
      });

      login(res.data.token, res.data.user);
      toast.success("Login successful!");

      navigate(res.data.user.role === "admin" ? "/admin" : "/vendor", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden font-sans"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md flex flex-col items-center justify-center py-10">
        
        {/* Responsive Background Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Outer Rotating Ring - Scales with screen width */}
          <div className="w-[85vw] h-[85vw] max-w-[450px] max-h-[450px] rounded-full border-2 border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]"></div>
          {/* Inner Static Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[400px] max-h-[400px] rounded-full border border-cyan-400/20"></div>
        </div>

        {/* Content Box */}
        <div className="relative w-full flex flex-col items-center">
          <h2 className="text-cyan-400 text-3xl sm:text-4xl mb-10 tracking-[0.2em] font-light uppercase">
            Login
          </h2>

          <form onSubmit={submit} className="w-full space-y-5 flex flex-col items-center">
            {/* Hidden inputs to stop autofill issues */}
            <input type="text" name="fakeuser" className="hidden" />
            <input type="password" name="fakepass" className="hidden" />

            {/* Email Field */}
            <div className="w-full max-w-[320px]">
              <input
                name="user_email"
                type="email"
                placeholder="Enter email"
                value={form.user_email}
                onChange={handle}
                required
                className="w-full px-6 py-3 rounded-full bg-white/95 text-black outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-xl text-base"
              />
            </div>

            {/* Password Field */}
            <div className="relative w-full max-w-[320px]">
              <input
                name="user_password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.user_password}
                onChange={handle}
                required
                className="w-full px-6 py-3 rounded-full bg-white/95 text-black outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-xl text-base"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-cyan-600"
              >
                {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <div className="w-full max-w-[320px] pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 py-3 rounded-full text-white font-bold tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
              >
                {loading ? "PROCESSING..." : "LOGIN →"}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-300 text-sm">
              Forgot Password?{" "}
              <Link to="/forgot-password" size="sm" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Reset here
              </Link>
            </p>

            <p className="text-gray-300 text-sm">
              Don’t have an account?{" "}
              <Link to="/register" className="text-red-400 font-semibold hover:text-red-300 transition-colors">
                Register Here..
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
