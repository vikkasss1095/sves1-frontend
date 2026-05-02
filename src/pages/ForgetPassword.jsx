import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ FIXED RECAPTCHA INIT
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      return toast.error("Enter valid mobile number");
    }

    try {
      setLoading(true);

      // ✅ backend check
      await api.post("/auth/check-user", { phone });

      const appVerifier = window.recaptchaVerifier;

      // 🔥 OTP send
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier
      );

      window.confirmationResult = confirmationResult;

      toast.success("OTP sent");
      navigate("/verify-otp", { state: { phone } });

    } catch (err) {
      console.log("OTP Error:", err);

      if (err.response?.status === 404) {
        toast.error("Mobile number not registered");
      } else if (err.code === "auth/invalid-phone-number") {
        toast.error("Invalid number");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many attempts");
      } else {
        toast.error("OTP failed");
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={10}
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {/* 🔥 MUST */}
      <div id="recaptcha-container"></div>
    </div>
  );
}