import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import bg from "../assets/registerbg.jpg"; // ✅ background

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
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);

      toast.success("Login successful!");
      navigate(data.user.role === "admin" ? "/admin" : "/vendor");
    } catch (err) {
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
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* glass card */}
      <div className="relative w-[320px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">

        <h2 className="text-xl text-cyan-400 text-center mb-4">
          LOGIN
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handle}
            className="input"
          />

          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handle}
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

          <button className="w-full bg-cyan-500 py-2 rounded text-white">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-3">
          Don’t have account?{" "}
          <Link to="/register" className="text-cyan-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}