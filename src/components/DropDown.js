import React, { useState, useEffect } from "react";
import "./styles.css";

const DropDown = ({
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
  const [label, setLabel] = useState(task.label || "");
  const [options, setOptions] = useState(task.options || ["Option 1", "Option 2"]);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    setEditedId(task.id || "");
    setLabel(task.label || "");
    setOptions(task.options || ["Option 1", "Option 2"]);
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions(prev => [...prev, trimmed]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    setOptions(prev => prev.filter(opt => opt !== optionToRemove));
  };

  const handleDelete = () => openDeleteConfirmation(task);

  const saveChanges = () => {
    onSaveText(task.id, editedId, label, options);
    closeModal();
  };

  return (
    <>
      <div
        className="element-card dropdown-card"
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
          userSelect: isModalOpen ? "text" : "none",
          cursor: isModalOpen ? "default" : "grab",
        }}
      >
        <div
          className="card_left"
          style={{ flex: 1, display: "flex", flexDirection: "column", userSelect: "text" }}
        >
          <label className="form-label" style={{ fontWeight: "bold" }}>
            Dropdown
          </label>
          <span>{label || "Dropdown Label"}</span>
        </div>

        <div className="icon-group" style={{ display: "flex", gap: "10px", marginLeft: "12px", userSelect: "none" }}>
          <span
            role="button"
            className="icon-button"
            title="Move Up"
            onClick={() => onMoveUp?.(task.id)}
          >
            ⬆️
          </span>
          <span
            role="button"
            className="icon-button"
            title="Move Down"
            onClick={() => onMoveDown?.(task.id)}
          >
            ⬇️
          </span>
          <span
            role="button"
            className="icon-button"
            title="Edit"
            onClick={openModal}
          >
            ⚙️
          </span>
          <span
            role="button"
            className="icon-button delete-icon"
            title="Delete"
            onClick={handleDelete}
            style={{ color: "#f50336", fontWeight: "bold" }}
          >
            🗑️
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-content" tabIndex={0} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <img
                src="/FormOrbit.png"
                alt="FormOrbit"
                className="logo"
                style={{ height: "40px" }}
              />
              <div className="title-group">
                <h2 style={{ margin: 0 }}>Edit Dropdown</h2>
                <p className="subtitle">Customize the properties of this element</p>
              </div>
            </div>

            <label htmlFor="dropdown-id">ID:</label>
            <input
              id="dropdown-id"
              type="text"
              value={editedId}
              onChange={(e) => setEditedId(e.target.value)}
              placeholder="Enter unique ID"
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
            />

            <label htmlFor="dropdown-label">Label:</label>
            <input
              id="dropdown-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter label for dropdown"
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
            />

            <label htmlFor="new-option">Options:</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                id="new-option"
                type="text"
                placeholder="New option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                style={{ flex: 1, padding: "8px" }}
              />
              <button onClick={handleAddOption} style={{ padding: "8px 12px" }}>
                Add
              </button>
            </div>

            <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
              {options.map((opt, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{opt}</span>
                  <button
                    onClick={() => handleRemoveOption(opt)}
                    style={{
                      backgroundColor: "#f50336",
                      color: "white",
                      border: "none",
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                      borderRadius: "3px",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                    aria-label={`Remove option ${opt}`}
                    title={`Remove option ${opt}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <button onClick={saveChanges} style={{ padding: "8px 16px" }}>
                Save Changes
              </button>
              <button onClick={closeModal} type="button" style={{ padding: "8px 16px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropDown;

