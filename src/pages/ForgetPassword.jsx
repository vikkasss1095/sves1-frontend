import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    // 🔒 Basic validation
    if (!phone || phone.length !== 10) {
      return toast.error("Enter valid 10 digit mobile number");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/send-otp", { phone });

      toast.success(res.data.message || "OTP sent successfully");

      // 👉 next page with phone
      navigate("/verify-otp", { state: { phone } });

    } catch (err) {
      console.log("OTP Error:", err);

      // 🎯 MAIN FIX (error handling)
      if (err.response) {
        if (err.response.status === 404) {
          toast.error("Mobile number is not registered");
        } else {
          toast.error(err.response.data.message || "Something went wrong");
        }
      } else {
        toast.error("Server not responding");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form onSubmit={sendOtp}>
        <h2>Enter Mobile Number</h2>

        <input
          type="tel"
          placeholder="Enter mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={10}
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}