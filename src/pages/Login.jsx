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
    email_input_123: "",
    password_input_456: "",
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
        email: form.email_input_123,
        password: form.password_input_456,
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* BG */}
      <img
        src={bg}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative flex items-center justify-center w-full px-4">

        {/* Rings */}
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
            {/* Hidden autofill blockers */}
            <input type="text" name="hidden_user" autoComplete="username" className="hidden" />
            <input type="password" name="hidden_pass" autoComplete="new-password" className="hidden" />

            {/* Email */}
            <input
              name="email_input_123"
              type="text"
              placeholder="Enter email"
              value={form.email_input_123}
              onChange={handle}
              autoComplete="off"
              spellCheck="false"
              required
              className="w-full px-4 py-2 rounded-full bg-white text-black text-sm"
            />

            {/* Password */}
            <div className="relative w-full">
              <input
                name="password_input_456"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.password_input_456}
                onChange={handle}
                autoComplete="new-password"
                spellCheck="false"
                required
                className="w-full px-4 py-2 rounded-full bg-white text-black text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 py-2 rounded-full text-white text-sm active:scale-95 transition"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {/* Links */}
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