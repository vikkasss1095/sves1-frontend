import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const verify = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verify-otp", {
        phone: state.phone,
        otp,
      });

      navigate("/reset-password", { state });
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <form onSubmit={verify}>
      <h2>Enter OTP</h2>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button>Verify</button>
    </form>
  );
}