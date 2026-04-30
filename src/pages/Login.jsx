import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axios";

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
    <div className="min-h-screen flex items-center justify-center bg-black">

      <form onSubmit={submit} autoComplete="off" className="space-y-4 w-[300px]">

        {/* autofill block */}
        <input type="text" name="hidden" autoComplete="username" style={{ display: "none" }} />
        <input type="password" name="hidden-password" autoComplete="new-password" style={{ display: "none" }} />

        <input
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handle}
          autoComplete="off"
          className="input"
        />

        <div className="relative">
          <input
            name="password"
            type={showPwd ? "text" : "password"}
            placeholder="Enter password"
            value={form.password}
            onChange={handle}
            autoComplete="new-password"
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-2"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button className="w-full bg-cyan-500 py-2 rounded text-white">
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don’t have account?{" "}
          <Link to="/register" className="text-cyan-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}