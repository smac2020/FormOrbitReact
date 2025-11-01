import React, { useState } from "react";

function FormFeedbackModal({ formJson, onClose }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  async function fetchFeedback() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/your-api-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formJson }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      // Expected data format:
      // { suggestions: ["...", "..."], score: 8 }
      setFeedback(data);
    } catch (err) {
      setError(err.message || "Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  }

  // Call fetchFeedback when modal opens (once)
  React.useEffect(() => {
    fetchFeedback();
  }, []);

  function renderStars(score) {
    const maxStars = 10;
    const filledStars = Math.round(score);
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= filledStars ? "#FFD700" : "#ddd",
            fontSize: "24px",
            marginRight: 2,
          }}
          aria-hidden="true"
        >
          ★
        </span>
      );
    }
    return stars;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "1.5rem",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 id="modal-title" style={{ marginBottom: "1rem" }}>
          Form Usability Feedback
        </h2>

        {loading && <p>Loading feedback...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Error fetching feedback: {error}
          </p>
        )}

        {feedback && (
          <>
            <ul style={{ marginBottom: "1rem", paddingLeft: "1.2rem" }}>
              {feedback.suggestions.map((suggestion, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  {suggestion}
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              {renderStars(feedback.score)}
              <span
                style={{
                  marginLeft: "0.5rem",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {feedback.score}/10
              </span>
            </div>

            {feedback.score >= 8 ? (
              <p
                style={{
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  padding: "0.75rem",
                  borderRadius: "5px",
                  fontWeight: "600",
                }}
              >
                Great job! Your form is highly optimized for mobile users.
              </p>
            ) : (
              <p>
                Consider implementing some of the suggestions to improve your
                mobile form experience.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FormFeedbackModal;
