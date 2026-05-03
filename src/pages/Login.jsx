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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* BG */}
      <img
        src={bg}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Center */}
      <div className="relative flex items-center justify-center w-full px-4">

        {/* Rings (thoda bada kiya) */}
        <div className="absolute w-[95vw] max-w-[420px] aspect-square rounded-full border border-cyan-400 opacity-30"></div>

        <div className="absolute w-[100vw] max-w-[470px] aspect-square rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[260px] flex flex-col items-center text-center">

          <h2 className="text-cyan-400 text-xl mb-4 tracking-widest">
            LOGIN
          </h2>

          <form
            onSubmit={submit}
            autoComplete="off"
            className="space-y-3 w-full flex flex-col items-center"
          >
            <input type="text" name="fakeuser" className="hidden" />
            <input type="password" name="fakepass" className="hidden" />

            <input
              name="user_email"
              type="email"
              placeholder="Enter email"
              value={form.user_email}
              onChange={handle}
              className="w-full px-4 py-2 rounded-full bg-white text-black text-sm"
              required
            />

            <div className="relative w-full">
              <input
                name="user_password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.user_password}
                onChange={handle}
                className="w-full px-4 py-2 rounded-full bg-white text-black text-sm"
                required
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 py-2 rounded-full text-white text-sm"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {/* Links FIXED */}
          <div className="mt-4 px-2 text-[11px] leading-tight text-center">
            <p className="text-gray-300">
              Forgot Password?{" "}
              <Link to="/forgot-password" className="text-cyan-400">
                Reset here
              </Link>
            </p>

            <p className="text-gray-300 mt-1 break-words">
              Don’t have an account?{" "}
              <Link to="/register" className="text-red-400">
                Register Here..
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}