import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";
import bg from "../assets/registerbg2.jpg";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    const cleanEmail = email.toLowerCase().trim();

    // ✅ email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return toast.error("Enter valid email");
    }

    try {
      if (loading) return;
      setLoading(true);

      await api.post("/auth/forgot-password/send-otp", {
        email: cleanEmail,
      });

      toast.success("OTP sent to your email");

      navigate("/verify-otp", { state: { email: cleanEmail } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <img src={bg} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />

      <form
        onSubmit={sendOtp}
        className="relative z-10 w-full max-w-[320px] bg-white/10 p-6 rounded-xl backdrop-blur text-center"
      >
        <h2 className="text-cyan-400 mb-4 text-lg">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md mb-3 text-black"
        />

        <button
          disabled={loading}
          className="w-full bg-cyan-500 py-2 rounded text-white"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-xs text-gray-300 mt-3">
          Back to{" "}
          <Link to="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}