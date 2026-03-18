import "./Question.css";

function Question({ question, onAnswer, selectedAnswer }) {
  // Decode HTML entities in question and options
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="question-container">
      <h3 className="question-text">{decodeHTML(question.question)}</h3>
      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
            onClick={() => onAnswer(option)}
          >
            {decodeHTML(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
