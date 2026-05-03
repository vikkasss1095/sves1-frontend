import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";
import bg from "../assets/registerbg2.jpg";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Enter email");

    try {
      setLoading(true);

      await api.post("/auth/send-otp", { email });

      toast.success("OTP sent to email");

      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Email not registered");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      <img src={bg} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />

      <form onSubmit={sendOtp} className="relative z-10 bg-white/10 p-6 rounded-xl backdrop-blur text-center w-[300px]">
        <h2 className="text-cyan-400 mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md mb-3"
        />

        <button className="w-full bg-cyan-500 py-2 rounded text-white">
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}