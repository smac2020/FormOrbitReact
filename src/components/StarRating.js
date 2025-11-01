import React, { useState, useEffect } from "react";

const StarRating = ({
  task,
  onDragStart,
  onDragEnd,
  onSaveText,
  openDeleteConfirmation,
  onMoveUp,
  onMoveDown,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedId, setEditedId] = useState(task.id || "");
  const [label, setLabel] = useState(task.label || "Your Rating");
  const [starCount, setStarCount] = useState(task.maxStars || 5);

  useEffect(() => {
    setEditedId(task.id || "");
    setLabel(task.label || "Your Rating");
    setStarCount(task.maxStars || 5);
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
  if (!editedId.trim() || !label.trim()) return;
  onSaveText?.(
    task.id,
    editedId.trim(),
    label.trim(),
    starCount // This will be received as `newOptionsOrOnValue` in handleSaveText
  );
  closeModal();
};


  const handleDelete = () => openDeleteConfirmation?.(task);

  return (
    <div
      className="element-card star-rating-card"
      draggable={!isModalOpen}
      onDragStart={(e) => {
        if (!isModalOpen) onDragStart(e, task);
        else e.preventDefault();
      }}
      onDragEnd={onDragEnd}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: isModalOpen ? "default" : "grab",
        userSelect: isModalOpen ? "text" : "none",
        position: "relative",
      }}
    >
      {/* Left side with label */}
      <div
        className="card_left"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <label
          className="form-label"
          style={{ fontWeight: "bold", userSelect: "text", marginBottom: 0 }}
        >
          StarRating
        </label>
        <span style={{ userSelect: "text" }}>{label || "Your Rating"}</span>
      </div>

      {/* Icons group - show only on hover */}
      <div
        className="icon-group"
        style={{
          userSelect: "none",
          display: "flex",
          gap: "6px",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.3s ease",
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <span
          role="button"
          aria-label="Move Up"
          title="Move Up"
          className="icon-button"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => onMoveUp && onMoveUp(task.id)}
        >
          ⬆️
        </span>

        <span
          role="button"
          aria-label="Move Down"
          title="Move Down"
          className="icon-button"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => onMoveDown && onMoveDown(task.id)}
        >
          ⬇️
        </span>

        <span
          role="img"
          aria-label="edit"
          onClick={openModal}
          className="icon-button"
          title="Edit"
          style={{ cursor: "pointer" }}
        >
          ⚙️
        </span>

        <span
          role="img"
          aria-label="delete"
          onClick={handleDelete}
          className="icon-button delete-icon"
          title="Delete"
          style={{ cursor: "pointer" }}
        >
          🗑️
        </span>
      </div>

     {/* Modal */}
{isModalOpen && (
  <div
    className="modal"
    role="dialog"
    aria-modal="true"
    style={{ userSelect: "text" }}
    onClick={closeModal}
  >
    <div className="modal-inner-wrapper" onClick={(e) => e.stopPropagation()}>
      <div
        className="modal-content"
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
        onDragStart={(e) => e.stopPropagation()}
        style={{ userSelect: "text" }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
            userSelect: "text",
          }}
        >
          <img src="/FormOrbit.png" alt="FormOrbit" className="modal-logo" />
          <div className="title-group">
            <h2 style={{ margin: 0, userSelect: "text" }}>Edit StarRating Element</h2>
            <p className="subtitle" style={{ userSelect: "text" }}>
              Customize the properties of this element
            </p>
          </div>
        </div>

        {/* ID Field */}
        <div>
          <label htmlFor="star-id" style={{ userSelect: "text" }}>
            ID:
          </label>
          <input
            id="star-id"
            type="text"
            value={editedId}
            onChange={(e) => setEditedId(e.target.value)}
            placeholder="Enter unique ID"
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Label Field */}
        <div>
          <label htmlFor="star-label" style={{ userSelect: "text" }}>
            Label:
          </label>
          <input
            id="star-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter label"
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Star Count Field */}
        <div>
          <label htmlFor="star-count" style={{ userSelect: "text" }}>
            Number of Stars (1–10):
          </label>
          <input
            id="star-count"
            type="number"
            min={1}
            max={10}
            value={starCount}
            onChange={(e) =>
              setStarCount(Math.min(10, Math.max(1, Number(e.target.value))))
            }
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <button onClick={saveChanges} style={{ padding: "8px 16px" }}>
            Save Changes
          </button>
          <button onClick={closeModal} type="button" style={{ padding: "8px 16px" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Show icons only on hover */}
      <style>
        {`
          .star-rating-card:hover .icon-group {
            opacity: 1 !important;
          }
        `}
      </style>
    </div>
  );
};

export default StarRating;
