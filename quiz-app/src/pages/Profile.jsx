import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Updated import
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import "./Profile.css";

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    averageScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    bestScore: 0,
    recentGames: [],
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchUserStats();
  }, [currentUser]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Get user's games from leaderboard
      const q = query(
        collection(db, "leaderboard"),
        where("playerName", "==", currentUser.email),
        orderBy("date", "desc"),
        limit(10),
      );

      const querySnapshot = await getDocs(q);
      const games = [];
      let totalScore = 0;
      let totalCorrect = 0;
      let totalQ = 0;
      let best = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        games.push(data);
        totalScore += data.score;
        totalCorrect += data.score;
        totalQ += data.totalQuestions;
        if (data.score > best) best = data.score;
      });

      setStats({
        totalGames: games.length,
        averageScore: games.length
          ? Math.round((totalScore / games.length) * 100) / 100
          : 0,
        totalQuestions: totalQ,
        correctAnswers: totalCorrect,
        bestScore: best,
        recentGames: games,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.displayName} />
            ) : (
              <div className="avatar-placeholder">
                {currentUser.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2>{currentUser.displayName || currentUser.email}</h2>
          <p className="profile-email">{currentUser.email}</p>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Sign Out
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.totalGames}</span>
            <span className="stat-label">Games Played</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.averageScore}</span>
            <span className="stat-label">Avg Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.bestScore}</span>
            <span className="stat-label">Best Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {stats.totalQuestions
                ? Math.round(
                    (stats.correctAnswers / stats.totalQuestions) * 100,
                  )
                : 0}
              %
            </span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>

        <div className="recent-games">
          <h3>Recent Games</h3>
          {stats.recentGames.length > 0 ? (
            <div className="games-list">
              {stats.recentGames.map((game, index) => (
                <div key={index} className="game-item">
                  <span className="game-date">
                    {new Date(game.date).toLocaleDateString()}
                  </span>
                  <span className="game-score">
                    {game.score}/{game.totalQuestions}
                  </span>
                  <span className="game-percentage">
                    {Math.round((game.score / game.totalQuestions) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-games">No games played yet. Start a quiz!</p>
          )}
        </div>

        <button onClick={() => navigate("/")} className="play-now-btn">
          🎯 Play Quiz Now
        </button>
      </div>
    </div>
  );
}

export default Profile;
