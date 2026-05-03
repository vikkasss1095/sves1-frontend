import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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

    if (otp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP");
    }

    try {
      if (loading) return;
      setLoading(true);

      await api.post("/auth/forgot-password/verify-otp", {
        email: state.email,
        otp: otp.trim(),
      });

      toast.success("OTP verified");

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
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p className="mt-2 text-sm">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}