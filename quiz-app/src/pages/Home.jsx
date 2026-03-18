import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Home.css";

const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 17, name: "Science & Nature" },
  { id: 23, name: "History" },
  { id: 18, name: "Computers" },
  { id: 22, name: "Geography" },
  { id: 21, name: "Sports" },
];

const difficulties = [
  { id: "easy", name: "Easy", multiplier: 1, color: "#4CAF50" },
  { id: "medium", name: "Medium", multiplier: 2, color: "#FF9800" },
  { id: "hard", name: "Hard", multiplier: 3, color: "#f44336" },
];

function Home() {
  const [playerName, setPlayerName] = useState("");
  const [category, setCategory] = useState(categories[0].id);
  const [difficulty, setDifficulty] = useState("easy");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const startQuiz = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      navigate("/quiz", {
        state: {
          playerName: playerName,
          category: category,
          difficulty: difficulty,
        },
      });
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to QuizMaster! 🎯</h1>
        <p>
          Hello, {currentUser?.email?.split("@")[0] || "Player"}! Ready to test
          your knowledge?
        </p>

        <form onSubmit={startQuiz} className="quiz-form">
          <div className="form-group">
            <label>Your Name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name for leaderboard"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty:</label>
              <div className="difficulty-buttons">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`difficulty-btn ${difficulty === d.id ? "active" : ""}`}
                    style={{
                      backgroundColor:
                        difficulty === d.id ? d.color : "#e0e0e0",
                    }}
                    onClick={() => setDifficulty(d.id)}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="start-btn">
            Start Quiz
          </button>
        </form>

        <div className="scoring-info">
          <h4>🎯 Scoring System:</h4>
          <ul>
            <li>Easy: 1 point per question</li>
            <li>Medium: 2 points per question</li>
            <li>Hard: 3 points per question</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
