import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      return toast.error("Enter valid mobile number");
    }

    try {
      const res = await api.post("/auth/send-otp", { phone });

      // 🔥 OTP popup
      toast.success(`OTP: ${res.data.otp}`);

      navigate("/verify-otp", { state: { phone } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="center">
      <form onSubmit={sendOtp}>
        <h2>Enter Mobile Number</h2>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={10}
        />

        <button>Send OTP</button>
      </form>
    </div>
  );
}