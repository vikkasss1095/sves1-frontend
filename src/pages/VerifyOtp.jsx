import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  // 🔥 सुरक्षा check
  useEffect(() => {
    if (!state?.phone) {
      toast.error("Invalid access");
      navigate("/forgot-password");
    }
  }, [state, navigate]);

  const verify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid OTP");
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-otp", {
        phone: state.phone,
        otp,
      });

      toast.success("OTP Verified");

      navigate("/reset-password", { state });

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form onSubmit={verify}>
        <h2>Enter OTP</h2>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}