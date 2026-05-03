import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
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

  const reset = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        phone: state.phone,
        newPassword: password,
      });

      toast.success("Password Updated Successfully");

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form onSubmit={reset}>
        <h2>New Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}