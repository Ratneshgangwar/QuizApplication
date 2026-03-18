import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Updated import
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
    } catch (error) {
      setError("Failed to reset password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password 🔐</h2>
        <p>Enter your email to receive reset instructions</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to Sign In</Link>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
