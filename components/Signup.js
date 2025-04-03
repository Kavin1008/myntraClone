import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";

const auth = getAuth();

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleSendOTP = async () => {
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    try {
      const result = await signInWithPhoneNumber(auth, phone, recaptcha);
      setConfirmationResult(result);
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(code);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Error verifying OTP", error);
    }
  };

  return (
    <div>
      <h2>Phone Login</h2>
      <input type="text" placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handleSendOTP}>Send OTP</button>

      <input type="text" placeholder="Enter OTP" value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleVerifyOTP}>Verify OTP</button>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
