import React from "react";

const SmartSuggestionsModal = ({ isOpen, onClose, score = 0, feedbackList = [] }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        padding: "20px",
        animation: "fadeIn 0.3s ease forwards",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 1.6px #0ff, 0 0 4px #0ff; }
          50% { text-shadow: 0 0 2.4px #0ff, 0 0 6px #0ff; }
        }
        .neon-star {
          transition: color 0.3s;
          cursor: default;
          animation: glowPulse 2.5s infinite ease-in-out;
          text-shadow: 0 0 1.6px #0ff, 0 0 4px #0ff;
        }
        .neon-star.inactive {
          color: #222;
          text-shadow: none !important;
          animation: none !important;
        }
        .neon-modal {
          background-color: #121212;
          color: #0ff;
          border-radius: 12px;
          max-width: 480px;
          max-height: 80vh;
          width: 100%;
          padding: 30px 25px;
          box-shadow:
            0 0 3px #0ff,
            0 0 6px #0ff,
            0 0 12px #0ff;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 18px;
          line-height: 1.6;
          user-select: text;
          border: 2px solid #0ff;
        }
        .close-button {
          position: absolute;
          top: 16px;
          right: 20px;
          background: transparent;
          border: none;
          color: #0ff;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          font-weight: bold;
          text-shadow: 0 0 3px #0ff;
          transition: color 0.3s, text-shadow 0.3s;
        }
        .close-button:hover {
          color: #0cc;
          text-shadow: 0 0 5px #0cc;
        }
        .feedback-list li {
          margin-bottom: 0.6em;
          text-shadow: 0 0 1.6px #0ff;
        }
        .score-text {
          margin-left: 10px;
          font-weight: bold;
          font-size: 1.3em;
          text-shadow: 0 0 3px #0ff;
        }
        .highlight-text {
          color: #0f0;
          font-weight: bold;
          text-shadow: 0 0 4.8px #0f0;
          font-size: 1.1em;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="neon-modal" onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: "24px", marginBottom: "16px", textShadow: "0 0 3px #0ff" }}>
          💡 Smart Suggestions
        </h2>

        {/* Star Rating */}
        <div style={{ marginBottom: "20px", fontSize: "2em", display: "flex", alignItems: "center" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`neon-star ${i < score ? "" : "inactive"}`}
            >
              ★
            </span>
          ))}
          <span className="score-text">{score}/10</span>
        </div>

        {score >= 8 && (
          <p className="highlight-text">
            Great job! Your form is highly mobile-friendly.
          </p>
        )}

        {/* Feedback List */}
        <ul className="feedback-list" style={{ listStyleType: "disc", paddingLeft: "20px", maxHeight: "300px", overflowY: "auto", color: "#0ff" }}>
          {feedbackList.length === 0 ? (
            <li>No feedback available.</li>
          ) : (
            feedbackList.map((point, i) => (
              <li key={i}>{point}</li>
            ))
          )}
        </ul>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="close-button"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SmartSuggestionsModal;










