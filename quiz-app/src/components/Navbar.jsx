import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          QuizMaster
        </Link>

        {currentUser && (
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="nav-link">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link profile-link">
                <span className="profile-emoji">👤</span>
                {currentUser.email?.split("@")[0]}
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link logout-btn">
                🚪 Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
