import React, { useState, useEffect } from "react";
import "./styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Grouped icons for field types
const iconGroups = {
  person: [
    "person",
    "person-fill",
    "person-circle",
    "person-vcard",
    "person-badge",
    "person-rolodex",
    "person-lines-fill",
  ],
  email: [
    "envelope",
    "envelope-fill",
    "envelope-open",
    "inbox",
    "send",
    "at",
  ],
  phone: [
    "telephone",
    "telephone-fill",
    "telephone-forward",
    "phone",
    "phone-vibrate",
  ],
  address: [
    "geo-alt",
    "geo-alt-fill",
    "map",
    "map-fill",
    "house",
    "building",
  ],
  date: ["calendar", "calendar-date", "calendar-event", "calendar-week"],
  security: ["lock", "lock-fill", "shield-lock", "shield-check", "key"],
  general: ["file-earmark-text", "clipboard", "chat-dots", "star"],
};

const guessCategoryFromLabel = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("name") || l.includes("user")) return "person";
  if (l.includes("email")) return "email";
  if (l.includes("phone") || l.includes("tel")) return "phone";
  if (l.includes("address")) return "address";
  if (l.includes("date") || l.includes("dob")) return "date";
  if (l.includes("password") || l.includes("security")) return "security";
  return "general";
};

const TextInput = ({
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
  const [editedLabel, setEditedLabel] = useState(task.label || "");
  const [editedId, setEditedId] = useState(task.id);
  const [required, setRequired] = useState(task.required || false);
  const [selectedIcon, setSelectedIcon] = useState(task.icon || "");
  const [iconCategory, setIconCategory] = useState("general");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setEditedId(task.id);
    setEditedLabel(task.label || "");
    setRequired(task.required || false);
    setSelectedIcon(task.icon || "");
    setIconCategory(guessCategoryFromLabel(task.label || ""));
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(
      task.id,
      editedId,
      editedLabel,
      required,
      undefined,
      selectedIcon
    );
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
        <div
          className="type"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: "bold",
          }}
        >
          Text Input
        </div>
        <div className="text" style={{ display: "flex", alignItems: "center" }}>
          {selectedIcon && (
            <i className={`bi bi-${selectedIcon}`} style={{ marginRight: 8 }} />
          )}
          {task.label}
        </div>
      </div>

      <div className="icon-group" style={{ display: "flex", gap: 8 }}>
        {isHovered && (
          <>
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
          </>
        )}
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
                  <h2 style={{ margin: 0 }}>Edit Text Input</h2>
                  <p className="subtitle">
                    Customize the properties of this input field
                  </p>
                </div>
              </div>

              <label>ID:</label>
              <input
                type="text"
                value={editedId}
                onChange={(e) => setEditedId(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: 12,
                  padding: 8,
                  boxSizing: "border-box",
                }}
              />

              <label>Label:</label>
              <input
                type="text"
                value={editedLabel}
                onChange={(e) => {
                  setEditedLabel(e.target.value);
                  setIconCategory(guessCategoryFromLabel(e.target.value));
                }}
                style={{
                  width: "100%",
                  marginBottom: 12,
                  padding: 8,
                  boxSizing: "border-box",
                }}
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  style={{ transform: "scale(1.4)" }}
                />
                Required
              </label>

              <label style={{ marginTop: 20, display: "block" }}>
                Icon Category:
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                {Object.keys(iconGroups).map((group) => (
                  <label key={group} style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="icon-category"
                      value={group}
                      checked={iconCategory === group}
                      onChange={(e) => setIconCategory(e.target.value)}
                      style={{ marginRight: 6 }}
                    />
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </label>
                ))}
              </div>

              <label style={{ display: "block", marginBottom: 6 }}>
                Choose an icon:
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 6,
                }}
              >
                {iconGroups[iconCategory]?.map((icon) => (
                  <div
                    key={icon}
                    className={`icon-box ${
                      selectedIcon === icon ? "selected" : ""
                    }`}
                    onClick={() => setSelectedIcon(icon)}
                    title={icon}
                  >
                    <i className={`bi bi-${icon}`} style={{ fontSize: 20 }} />
                  </div>
                ))}
              </div>

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

export default TextInput;






