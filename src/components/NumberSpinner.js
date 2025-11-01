import React, { useState, useEffect } from "react";
import "./styles.css";

const NumberSpinner = ({
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
  const [id, setId] = useState(task.id || "");
  const [label, setLabel] = useState(task.label || "");
  const [value, setValue] = useState(task.defaultValue ?? 1);
  const [min, setMin] = useState(task.min ?? 1);
  const [max, setMax] = useState(task.max ?? 5);
  const [selectedIcon, setSelectedIcon] = useState(task.icon || "");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setId(task.id || "");
    setLabel(task.label || "");
    setValue(task.defaultValue ?? 1);
    setMin(task.min ?? 1);
    setMax(task.max ?? 5);
    setSelectedIcon(task.icon || "");
  }, [task]);

  const openModal = () => {
    console.log("Gear clicked - opening modal");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(id, id, label, false, { min, max, value }, selectedIcon);
    closeModal();
  };

  const handleDelete = () => openDeleteConfirmation(task);

  return (
    <div
      className="element-card number-spinner-card"
      {...(!isModalOpen && {
        draggable: true,
        onDragStart: (e) => onDragStart(e, task),
        onDragEnd,
      })}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <div className="type" style={{ fontWeight: "bold" }}>Number Spinner</div>
        <div className="text">
          {label}: {value} (Min: {min}, Max: {max})
        </div>
      </div>

      {isHovered && (
        <div className="icon-group" style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onMoveUp && onMoveUp(task.id)}
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
            onClick={() => onMoveDown && onMoveDown(task.id)}
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
        </div>
      )}

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
                  <h2 style={{ margin: 0 }}>Edit Number Spinner</h2>
                  <p className="subtitle">Configure spinner values and label</p>
                </div>
              </div>

              <label>ID:</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8 }}
              />

              <label>Label:</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8 }}
              />

              <label>Initial Value:</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                style={{ width: "100%", marginBottom: 12, padding: 8 }}
              />

              <label>Min Value:</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                style={{ width: "100%", marginBottom: 12, padding: 8 }}
              />

              <label>Max Value:</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
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
                <button
                  onClick={closeModal}
                  type="button"
                  style={{ padding: "8px 16px" }}
                >
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

export default NumberSpinner;






