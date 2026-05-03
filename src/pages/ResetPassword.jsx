import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const reset = async (e) => {
    e.preventDefault();

    // ✅ password validation (min 6)
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      if (loading) return;
      setLoading(true);

      await api.post("/auth/forgot-password/reset-password", {
        email: state.email,
        newPassword: password.trim(),
      });

      toast.success("Password updated successfully");

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
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

        <p className="mt-2 text-sm">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}