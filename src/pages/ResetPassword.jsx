import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password too short");
    }

    try {
      await api.post("/auth/reset-password", {
        phone: state.phone,
        newPassword: password,
      });

      toast.success("Password Updated");
      navigate("/login");

    } catch {
      toast.error("Error");
    }
  };

  return (
    <form onSubmit={reset}>
      <h2>New Password</h2>

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Update</button>
    </form>
  );
}