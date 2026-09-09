
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import app from "../firebase";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      setSuccess(
        "Password reset link has been sent. Please check your email."
      );

      setEmail("");
    } catch (error) {
      console.log("Password reset error:", error);

      if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account was found with this email address.");
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (
        error.code === "auth/too-many-requests"
      ) {
        setError(
          "Too many attempts. Please wait and try again later."
        );
      } else {
        setError(
          "Unable to send reset email. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">

      <div className="forgot-password-card">

        <div className="forgot-password-header">

          <div className="forgot-password-icon">
            <i className="fa-solid fa-lock"></i>
          </div>

          <h1>Forgot Password?</h1>

          <p>
            Enter your email address and we will send
            you a password reset link.
          </p>

        </div>

        <form
          className="forgot-password-form"
          onSubmit={handleResetPassword}
        >

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              disabled={loading}
            />

          </div>

          {error && (
            <p className="forgot-password-error">
              {error}
            </p>
          )}

          {success && (
            <div className="forgot-password-success">

              <i className="fa-solid fa-circle-check"></i>

              <p>{success}</p>

            </div>
          )}

          <button
            type="submit"
            className="forgot-password-btn"
            disabled={loading}
          >

            {loading
              ? "Sending..."
              : "Send Reset Link"}

            {!loading && (
              <i className="fa-solid fa-paper-plane"></i>
            )}

          </button>

        </form>

        <div className="forgot-password-footer">

          <Link to="/login">
            <i className="fa-solid fa-arrow-left"></i>
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
