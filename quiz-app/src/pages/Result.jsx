import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const hasSaved = useRef(false);

  const { playerName, score, totalQuestions } = location.state || {
    playerName: "Anonymous",
    score: 0,
    totalQuestions: 5,
  };

  const percentage = Math.round((score / totalQuestions) * 100) || 0;
  const shareUrl = window.location.origin;
  const shareTitle = `I scored ${score}/${totalQuestions} (${percentage}%) on QuizMaster! Can you beat my score? 🎯`;

  useEffect(() => {
    console.log("Result page loaded");

    if (!location.state) {
      navigate("/");
      return;
    }

    if (!hasSaved.current) {
      hasSaved.current = true;
      saveScoreToFirebase();
    }
  }, []);

  const saveScoreToFirebase = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const scoreData = {
        playerName: playerName || "Anonymous",
        score: Number(score) || 0,
        totalQuestions: Number(totalQuestions) || 5,
        date: new Date().toISOString(),
        timestamp: new Date().getTime(),
      };

      const docRef = await addDoc(collection(db, "leaderboard"), scoreData);
      console.log("✅ Score saved! ID:", docRef.id);
      setSaveSuccess(true);
    } catch (error) {
      console.error("❌ Firebase error:", error);
      setSaveError(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const text = `${shareTitle} Play here: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    alert("Result copied to clipboard! Share it with your friends.");
  };

  const getMessage = () => {
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Nice try! 💪";
    return "Better luck next time! 🍀";
  };

  return (
    <div className="result-container">
      <div className="result-card">
        <h1>Quiz Complete! 🎉</h1>

        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{totalQuestions}</span>
          </div>
          <div className="score-percentage">{percentage}%</div>
          <div className="score-message">{getMessage()}</div>
          <div className="player-name">👤 {playerName}</div>
        </div>

        {saving && (
          <div className="saving-message">
            <div className="spinner-small"></div>
            <p>Saving your score...</p>
          </div>
        )}

        {saveSuccess && (
          <div className="success-message">
            <p>✅ Score saved!</p>
          </div>
        )}

        {saveError && (
          <div className="save-error">
            <p>{saveError}</p>
          </div>
        )}

        {/* Share Section */}
        <div className="share-section">
          <button
            className="share-main-btn"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            📤 Share Your Result
          </button>

          {showShareOptions && (
            <div className="share-options">
              <p className="share-title">Share with friends:</p>
              <div className="share-buttons">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>

                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>

                <button onClick={handleCopyLink} className="copy-link-btn">
                  📋
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="result-actions">
          <button onClick={() => navigate("/")} className="play-again-btn">
            🔄 Play Again
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="leaderboard-btn"
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
