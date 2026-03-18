import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Question from "../components/Question";
import Timer from "../components/Timer";
import "./Quiz.css";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName, category } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerLocked, setAnswerLocked] = useState(false);

  useEffect(() => {
    if (!playerName || !category) {
      navigate("/");
      return;
    }
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using a proxy to avoid CORS issues
      const apiUrl = `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`;
      console.log("Fetching from:", apiUrl);

      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.response_code === 0 && data.results && data.results.length > 0) {
        const formattedQuestions = data.results.map((q) => {
          // Combine and shuffle options
          const allOptions = [...q.incorrect_answers, q.correct_answer];
          const shuffledOptions = shuffleOptions(allOptions);

          return {
            question: q.question,
            options: shuffledOptions,
            correctAnswer: q.correct_answer,
          };
        });

        setQuestions(formattedQuestions);
      } else if (data.response_code === 1) {
        throw new Error(
          "No questions available for this category. Please try another category.",
        );
      } else {
        throw new Error("Failed to load questions. Please try again.");
      }
    } catch (err) {
      console.error("Quiz fetch error:", err);
      if (err.name === "AbortError") {
        setError("Request timed out. Please check your internet connection.");
      } else {
        setError(err.message || "Failed to fetch questions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const shuffleOptions = (options) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const handleAnswer = (answer) => {
    if (answerLocked || selectedAnswer) return;

    setAnswerLocked(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setAnswerLocked(false);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        navigate("/result", {
          state: {
            playerName,
            score: finalScore,
            totalQuestions: questions.length,
          },
        });
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!selectedAnswer && !answerLocked) {
      setAnswerLocked(true);

      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setAnswerLocked(false);
        } else {
          navigate("/result", {
            state: {
              playerName,
              score,
              totalQuestions: questions.length,
            },
          });
        }
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Questions...</h2>
          <p>Fetching exciting questions for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={fetchQuestions} className="retry-btn">
              Try Again
            </button>
            <button onClick={() => navigate("/")} className="home-btn">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error-state">
          <div className="error-icon">😕</div>
          <h2>No Questions Found</h2>
          <p>This category doesn't have any questions right now.</p>
          <button onClick={() => navigate("/")} className="home-btn">
            Choose Another Category
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="player-info">
          <div className="player-avatar">👤</div>
          <div className="player-details">
            <span className="player-name">{playerName}</span>
            <span className="player-score">
              Score: {score}/{questions.length}
            </span>
          </div>
        </div>
        <Timer key={currentQuestion} initialTime={15} onTimeUp={handleTimeUp} />
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            Complete
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <Question
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
        disabled={answerLocked}
      />
    </div>
  );
}

export default Quiz;
