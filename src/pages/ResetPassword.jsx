import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email: state.email,
        newPassword: password,
      });

      toast.success("Password updated");

      navigate("/login");

    } catch {
      toast.error("Error resetting password");
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

        <button>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}