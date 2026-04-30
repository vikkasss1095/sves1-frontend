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

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate(data.user.role === "admin" ? "/admin" : "/vendor");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔥 CIRCLE EFFECT */}
      <div className="absolute w-[400px] h-[400px] border-2 border-cyan-400 rounded-full opacity-40 animate-pulse"></div>

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
            className="w-[280px] px-4 py-2 rounded-full bg-white text-black"
          />

          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={handle}
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

          <button className="w-[280px] bg-cyan-500 py-2 rounded-full text-white">
            Login →
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
  );
}