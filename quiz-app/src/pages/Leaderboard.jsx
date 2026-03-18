import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import "./Leaderboard.css";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniquePlayers, setUniquePlayers] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      console.log("Fetching leaderboard...");

      // Get more entries to filter duplicates
      const leaderboardRef = collection(db, "leaderboard");
      const q = query(leaderboardRef, orderBy("score", "desc"), limit(30));

      const querySnapshot = await getDocs(q);
      console.log("Total entries:", querySnapshot.size);

      // Process and remove duplicates
      const allEntries = [];
      const playerBestScores = new Map(); // Use Map to keep best score per player

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allEntries.push({
          id: doc.id,
          ...data,
        });
      });

      console.log("All entries:", allEntries);

      // Keep only the best score for each player
      allEntries.forEach((entry) => {
        const playerName = entry.playerName || "Anonymous";
        const existingEntry = playerBestScores.get(playerName);

        // If no entry exists for this player, or this entry has a higher score
        if (!existingEntry || entry.score > existingEntry.score) {
          playerBestScores.set(playerName, entry);
        }
        // If same score, keep the most recent one
        else if (entry.score === existingEntry.score) {
          const existingDate = new Date(existingEntry.date || 0);
          const newDate = new Date(entry.date || 0);
          if (newDate > existingDate) {
            playerBestScores.set(playerName, entry);
          }
        }
      });

      // Convert Map back to array and sort by score
      const uniqueScores = Array.from(playerBestScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10

      console.log("Unique scores:", uniqueScores);
      setUniquePlayers(uniqueScores.length);
      setScores(uniqueScores);
      setError(null);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-container">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchLeaderboard} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1>🏆 Leaderboard</h1>
        <p className="leaderboard-subtitle">
          Top {scores.length} Players{" "}
          {uniquePlayers > 0 && `(from ${uniquePlayers} unique players)`}
        </p>

        {scores.length > 0 ? (
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr
                    key={score.id || index}
                    className={index < 3 ? `top-three rank-${index + 1}` : ""}
                  >
                    <td className="rank-cell">
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td className="player-cell">
                      <span className="player-name-display">
                        {score.playerName || "Anonymous"}
                      </span>
                      {index === 0 && <span className="crown">👑</span>}
                    </td>
                    <td className="score-cell">
                      <span className="score-badge">
                        {score.score || 0}/{score.totalQuestions || 5}
                      </span>
                    </td>
                    <td className="date-cell">
                      {score.date
                        ? new Date(score.date).toLocaleDateString()
                        : "N/A"}
                      <span className="time-small">
                        {score.date
                          ? new Date(score.date).toLocaleTimeString()
                          : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {scores.length < 10 && (
              <p className="more-spots">
                {10 - scores.length} more spots available! Play now to claim
                them!
              </p>
            )}
          </div>
        ) : (
          <div className="no-scores">
            <div className="empty-state-icon">📊</div>
            <h3>No scores yet!</h3>
            <p>Be the first player to make it to the leaderboard!</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="play-btn"
            >
              Start Quiz Now
            </button>
          </div>
        )}

        <div className="leaderboard-footer">
          <button onClick={fetchLeaderboard} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
