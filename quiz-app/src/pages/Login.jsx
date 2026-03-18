import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(""); // Renamed to localError

  const { signIn, signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      setLocalError("Invalid email or password");
      console.error("Login error:", error); // Using error here
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setLocalError("Failed to sign in with Google");
      console.error("Google sign-in error:", error); // Using error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back! 👋</h2>
        <p>Sign in to continue your quiz journey</p>

        {localError && <div className="error-message">{localError}</div>}

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

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-btn"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
