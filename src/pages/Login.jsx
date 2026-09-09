
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import app from "../firebase";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      console.log("Firebase user:", user);

      const response = await fetch(
        `http://localhost:2300/api/users/uid/${user.uid}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "User profile not found."
        );
      }

      const userData = data;

      console.log("MongoDB user:", userData);

      if (userData.role !== role) {
        setError(
          `This account is registered as a ${userData.role}, not a ${role}.`
        );

        return;
      }

      localStorage.setItem(
        "skillconnectUser",
        JSON.stringify(userData)
      );

      if (userData.role === "professional") {
        navigate("/professional-dashboard");
      } else {
        navigate("/customer-dashboard");
      }

    } catch (error) {
      console.log("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Incorrect email or password.");
      } else if (
        error.code === "auth/user-not-found"
      ) {
        setError("No account found with this email.");
      } else if (
        error.code === "auth/invalid-email"
      ) {
        setError("Please enter a valid email address.");
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (
        error.message === "User not found"
      ) {
        setError(
          "Your account exists, but your Skill Connect profile was not found."
        );
      } else {
        setError(
          error.message ||
            "Login failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>Welcome Back</h1>

          <p>
            Login to your Skill Connect account
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label>Login as</label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >

              <option value="customer">
                Customer
              </option>

              <option value="professional">
                Professional
              </option>

            </select>

          </div>

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
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <i className="fa-solid fa-arrow-right"></i>
            )}

          </button>

        </form>

        <div className="login-footer">

          <p>
            Don't have an account?{" "}

            <Link to="/join-now">
              Join Now
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;

