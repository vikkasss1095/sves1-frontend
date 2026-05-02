import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/send-otp", { phone });

      toast.success("OTP sent");

      navigate("/verify-otp", { state: { phone } });
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  return (
    <div className="center">
      <form onSubmit={sendOtp}>
        <h2>Enter Mobile Number</h2>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button>Send OTP</button>
      </form>
    </div>
  );
}