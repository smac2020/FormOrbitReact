import React, { useState, useEffect } from "react";
import Question from "./Question"; // <-- Use Question instead of TextInput
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

const Page = ({
  page,
  onDropQuestion,
  onUpdateTitle,
  onDeletePage,
  onMoveUp,
  onMoveDown,
  onMoveQuestionUp, // ✅ add
  onMoveQuestionDown, // ✅ add
  onUpdateQuestion,
  onDragStart,
  onDragEnd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(page.title || "");

  useEffect(() => {
    setEditedTitle(page.title || "");
  }, [page.title]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveTitle = () => {
    onUpdateTitle(page.id, editedTitle);
    closeModal();
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDropQuestion) {
      onDropQuestion(page.id, "TextInput"); // pass page.id so parent knows which page to add to
    }
  };

  return (
    <div
      className="page-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      draggable={false}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #666",
        borderRadius: "5px",
        backgroundColor: "#2b2b2b",
        color: "#eee",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h5 style={{ margin: 0, userSelect: "text" }}>{page.title}</h5>

        <div style={{ display: "flex", gap: "8px" }}>
          {/* Move Up */}
          <button
            onClick={() => onMoveUp && onMoveUp(page.id)}
            title="Move Page Up"
            style={buttonStyle}
          >
            ⬆️
          </button>

          {/* Move Down */}
          <button
            onClick={() => onMoveDown && onMoveDown(page.id)}
            title="Move Page Down"
            style={buttonStyle}
          >
            ⬇️
          </button>

          {/* Edit Title */}
          <button
            onClick={openModal}
            title="Edit Page Title"
            style={buttonStyle}
          >
            ⚙️
          </button>

          {/* Delete */}
          <button
            onClick={() => onDeletePage && onDeletePage(page.id)}
            title="Delete Page"
            style={{ ...buttonStyle, color: "#D8000C" }}
          >
            🗑️
          </button>
        </div>
      </div>

     {/* Animate add/remove of questions */}
<AnimatePresence>
  {page.questions.length > 0 ? (
    page.questions.map((question) => (
      <Question
        key={question.id}
        question={question}
        onMoveUp={() => onMoveQuestionUp(page.id, question.id)}
        onMoveDown={() => onMoveQuestionDown(page.id, question.id)}
        onUpdate={(updates) =>
          onUpdateQuestion(page.id, question.id, updates)
        }
      />
    ))
  ) : (
    <motion.p
      key="placeholder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ fontStyle: "italic", color: "#888" }}
    >
      Drag questions here
    </motion.p>
  )}
</AnimatePresence>

      {/* Modal for editing page title */}
      {isModalOpen && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          style={{ userSelect: "text" }}
          onClick={closeModal}
        >
          <div
            className="modal-inner-wrapper"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#222",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              margin: "100px auto",
              color: "#eee",
            }}
          >
            <h2>Edit Page Title</h2>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter page title"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #444",
                backgroundColor: "#333",
                color: "#eee",
                fontSize: "16px",
              }}
              autoFocus
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button onClick={saveTitle} style={modalButtonStyle}>
                Save
              </button>
              <button onClick={closeModal} style={modalButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#444",
  border: "none",
  borderRadius: "4px",
  padding: "6px 10px",
  color: "#eee",
  cursor: "pointer",
  fontSize: "16px",
  userSelect: "none",
};

const modalButtonStyle = {
  backgroundColor: "#28a745",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};

export default Page;
