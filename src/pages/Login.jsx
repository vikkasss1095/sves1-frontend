import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import bg from "../assets/registerbg2.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ IMPORTANT FIX
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      // ✅ REDIRECT FIX (force reload so context update ho)
      if (res.data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/vendor";
      }

    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Login failed");
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

      {/* MAIN CIRCLE */}
      <div className="relative flex flex-col items-center justify-center">

        {/* OUTER GLOW */}
        <div className="absolute w-[420px] h-[420px] rounded-full border border-cyan-400 opacity-30"></div>

        {/* DOTTED ANIMATION */}
        <div className="absolute w-[460px] h-[460px] rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow opacity-40"></div>

        {/* FORM */}
        <div className="relative text-center">

          <h2 className="text-cyan-400 text-2xl mb-6 tracking-widest">
            LOGIN
          </h2>

          <form onSubmit={submit} className="space-y-4">

            <input
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handle}
              required
              className="w-[280px] px-4 py-2 rounded-full bg-white text-black"
            />

            <div className="relative">
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password"
                value={form.password}
                onChange={handle}
                required
                className="w-[280px] px-4 py-2 rounded-full bg-white text-black"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-2"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-[280px] bg-cyan-500 py-2 rounded-full text-white"
            >
              {loading ? "Loading..." : "Login →"}
            </button>

          </form>

          <p className="text-gray-300 mt-4 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-400">
              Register Here..
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}