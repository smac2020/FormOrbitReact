import React, { useState, useEffect } from "react";
import "./styles.css";

const DigitalSignature = ({
  task,
  onDragStart,
  onDragEnd,
  onDelete,
  onSaveText,
  openDeleteConfirmation,
  onMoveUp,
  onMoveDown,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLabel, setEditedLabel] = useState(task.label || "Digital Signature");
  const [editedId, setEditedId] = useState(task.id);
  const [isHovered, setIsHovered] = useState(false);

  // Sync local edited state with task props on changes
  useEffect(() => {
    setEditedLabel(task.label || "Digital Signature");
    setEditedId(task.id);
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(task.id, editedId, editedLabel, undefined, "signature");
    closeModal();
  };

  const handleDelete = () => openDeleteConfirmation(task);

  return (
    <div
      className="element-card textinput-card"
      {...(!isModalOpen && {
        draggable: true,
        onDragStart: (e) => onDragStart(e, task),
        onDragEnd,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        className="card_left"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          userSelect: "none",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Digital Signature</div>
        {/* Use editedLabel state here so UI updates immediately */}
        <div style={{ marginLeft: 10 }}>{editedLabel}</div>
      </div>

      <div className="icon-group" style={{ display: "flex", gap: 8 }}>
        {isHovered && (
          <>
            <button
              onClick={() => onMoveUp(task.id)}
              title="Move Up"
              type="button"
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                fontSize: 18,
                userSelect: "none",
                padding: 0,
              }}
            >
              ⬆️
            </button>
            <button
              onClick={() => onMoveDown(task.id)}
              title="Move Down"
              type="button"
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                fontSize: 18,
                userSelect: "none",
                padding: 0,
              }}
            >
              ⬇️
            </button>
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
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-inner-wrapper">
            <div
              className="modal-content"
              tabIndex={0}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                className="modal-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <img
                  src="/FormOrbit.png"
                  alt="FormOrbit"
                  className="logo"
                  style={{ height: 40 }}
                />
                <div className="title-group">
                  <h2 style={{ margin: 0 }}>Edit Digital Signature</h2>
                  <p className="subtitle">
                    Customize the properties of this signature field
                  </p>
                </div>
              </div>

              <label>ID:</label>
              <input
                type="text"
                value={editedId}
                onChange={(e) => setEditedId(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8 }}
              />

              <label>Label:</label>
              <input
                type="text"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8 }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <button onClick={saveChanges} style={{ padding: "8px 16px" }}>
                  Save Changes
                </button>
                <button onClick={closeModal} style={{ padding: "8px 16px" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalSignature;


