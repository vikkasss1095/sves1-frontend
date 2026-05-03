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
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Absolute Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

      {/* Main Container - max-w-xs (20rem) for mobile screens */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center">
        
        {/* Responsive Rings - Scaled using 'vw' to never exceed screen width */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-[85vw] h-[85vw] max-w-[400px] max-h-[400px] rounded-full border border-cyan-400/30"></div>
          <div className="absolute w-[95vw] h-[95vw] max-w-[440px] max-h-[440px] rounded-full border border-dashed border-cyan-400/20 animate-[spin_30s_linear_infinite]"></div>
        </div>

        {/* Content Box */}
        <div className="w-full max-w-xs flex flex-col items-center text-center">
          <h2 className="text-cyan-400 text-3xl sm:text-4xl mb-10 tracking-[0.2em] font-light uppercase">
            LOGIN
          </h2>

          <form onSubmit={submit} className="w-full space-y-4">
            {/* Input Wrapper ensures field stays inside phone edges */}
            <div className="w-full">
              <input
                name="user_email"
                type="email"
                placeholder="Enter email"
                value={form.user_email}
                onChange={handle}
                required
                className="w-full px-5 py-3 rounded-full bg-[#f0f0f0] text-black outline-none border-none text-sm placeholder:text-gray-500"
              />
            </div>

            <div className="w-full relative">
              <input
                name="user_password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.user_password}
                onChange={handle}
                required
                className="w-full px-5 py-3 rounded-full bg-[#f0f0f0] text-black outline-none border-none text-sm placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00acc1] hover:bg-cyan-600 py-3 rounded-full text-white font-bold tracking-widest text-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? "LOGGING IN..." : "LOGIN →"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-300 text-xs tracking-tight">
              Forgot Password?{" "}
              <Link to="/forgot-password" size="sm" className="text-cyan-400 hover:underline">
                Reset here
              </Link>
            </p>

            <p className="text-gray-300 text-xs tracking-tight">
              Don’t have an account?{" "}
              <Link to="/register" className="text-red-400 font-medium hover:underline">
                Register Here..
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}