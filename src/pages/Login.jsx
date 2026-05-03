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
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Decorative Rings - Made Responsive with max-w */}
      <div className="relative flex flex-col items-center justify-center w-full px-4">
        
        {/* Outer Rings: Hidden on very small screens or scaled down */}
        <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-cyan-400 opacity-30 pointer-events-none"></div>
        <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow opacity-40 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] text-center">
          <h2 className="text-cyan-400 text-2xl sm:text-3xl mb-8 tracking-widest font-light">
            LOGIN
          </h2>

          <form onSubmit={submit} autoComplete="off" className="space-y-5">
            {/* Chrome autofill hack */}
            <input type="text" name="fakeuser" className="hidden" />
            <input type="password" name="fakepass" className="hidden" />

            {/* Email Input */}
            <div className="w-full">
              <input
                name="user_email"
                type="email"
                placeholder="Enter email"
                value={form.user_email}
                onChange={handle}
                autoComplete="off"
                required
                className="w-full px-6 py-3 rounded-full bg-white text-black outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Password Input */}
            <div className="relative w-full">
              <input
                name="user_password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.user_password}
                onChange={handle}
                autoComplete="new-password"
                required
                className="w-full px-6 py-3 rounded-full bg-white text-black outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600 transition-colors"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-full text-white font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {/* Links Section */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-300 text-xs sm:text-sm">
              Forgot Password?{" "}
              <Link to="/forgot-password" size="sm" className="text-cyan-400 hover:underline">
                Reset here
              </Link>
            </p>

            <p className="text-gray-300 text-xs sm:text-sm">
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