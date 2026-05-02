


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

    try {
      await api.post("/auth/reset-password", {
        phone: state.phone,
        newPassword: password,
      });

      toast.success("Password updated");
      navigate("/login");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <form onSubmit={reset}>
      <h2>New Password</h2>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button>Update</button>
    </form>
  );
}