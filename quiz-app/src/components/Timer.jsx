import { useEffect, useState } from "react";
import "./Timer.css";

function Timer({ initialTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className={`timer ${timeLeft <= 5 ? "timer-warning" : ""}`}>
      <span className="timer-text">{timeLeft}s</span>
    </div>
  );
}

export default Timer;
