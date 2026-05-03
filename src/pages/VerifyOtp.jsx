import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.email) {
      toast.error("Invalid access");
      navigate("/forgot-password");
    }
  }, []);

  const verify = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/verify-otp", {
        email: state.email,
        otp,
      });

      toast.success("OTP verified");

      navigate("/reset-password", { state });

    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form onSubmit={verify}>
        <h2>Enter OTP</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />

        <button>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}