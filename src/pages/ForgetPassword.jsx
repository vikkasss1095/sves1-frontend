import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import api from "../utils/axios";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      return toast.error("Enter valid 10 digit mobile number");
    }

    try {
      setLoading(true);

      // ✅ STEP 1: Check user exist
      await api.post("/auth/check-user", { phone });

      // ✅ STEP 2: Firebase Recaptcha
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha",
        { size: "invisible" }
      );

      // ✅ STEP 3: Send OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;

      toast.success("OTP sent successfully");
      navigate("/verify-otp", { state: { phone } });

    } catch (err) {
      console.log(err);

      if (err.response?.status === 404) {
        toast.error("Mobile number is not registered");
      } else {
        toast.error("Failed to send OTP");
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
          placeholder="Enter mobile number"
          maxLength={10}
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {/* 🔥 Required */}
      <div id="recaptcha"></div>
    </div>
  );
}