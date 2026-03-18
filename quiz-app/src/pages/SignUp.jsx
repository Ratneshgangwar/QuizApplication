import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Auth.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(""); // Renamed to localError

  const { signUp, signInWithGoogle, currentUser } = useAuth();
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

    if (password !== confirmPassword) {
      return setLocalError("Passwords do not match");
    }

    if (password.length < 6) {
      return setLocalError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await signUp(email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setLocalError("Email already in use");
      } else {
        setLocalError("Failed to create account");
      }
      console.error("Signup error:", error); // Using error here
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
        <h2>Join QuizMaster! 🎯</h2>
        <p>Create an account to start playing</p>

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
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Creating Account..." : "Sign Up"}
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
          <Link to="/login">Already have an account? Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
