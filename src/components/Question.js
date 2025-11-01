import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const iconGroups = {
  person: ["person","person-fill","person-circle","person-vcard","person-badge","person-rolodex","person-lines-fill"],
  email: ["envelope","envelope-fill","envelope-open","inbox","send","at"],
  phone: ["telephone","telephone-fill","telephone-forward","phone","phone-vibrate"],
  address: ["geo-alt","geo-alt-fill","map","map-fill","house","building"],
  date: ["calendar","calendar-date","calendar-event","calendar-week"],
  security: ["lock","lock-fill","shield-lock","shield-check","key"],
  general: ["file-earmark-text","clipboard","chat-dots","star"],
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

const Question = ({
  question,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  onMoveUp,
  onMoveDown,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editedId, setEditedId] = useState(question.id || "");
  const [label, setLabel] = useState(question.label || "");
  const [icon, setIcon] = useState(question.icon || "");
  const [required, setRequired] = useState(!!question.required);
  const [iconCategory, setIconCategory] = useState("general");

  useEffect(() => {
    setEditedId(question.id || "");
    setLabel(question.label || "");
    setIcon(question.icon || "");
    setRequired(!!question.required);
    setIconCategory(guessCategoryFromLabel(question.label || ""));
  }, [question]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onUpdate({
      id: editedId,
      label,
      icon,
      required,
    });
    closeModal();
  };

  return (
    <motion.div
      className="element-card textinput-card"
      draggable={!isModalOpen}
      onDragStart={(e) => !isModalOpen && onDragStart && onDragStart(e, question)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: isModalOpen ? "default" : "grab",
        userSelect: isModalOpen ? "text" : "none",
      }}
    >
      {/* Left Column */}
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
        {icon && <i className={`bi bi-${icon}`} style={{ marginRight: 8 }} />}
        <div>
          <strong>{label || "Untitled Question"}</strong>
          <div style={{ fontSize: "0.8rem", color: required ? "#f00" : "#aaa" }}>
            {required ? "Required" : "Optional"}
          </div>
        </div>
      </div>

      {/* Right icons */}
      <div className="icon-group" style={{ display: "flex", gap: 8 }}>
        {isHovered && (
          <>
            <button
              onClick={() => onMoveUp && onMoveUp(question.id)}
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
              onClick={() => onMoveDown && onMoveDown(question.id)}
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
              title="Edit"
              onClick={openModal}
              style={{ cursor: "pointer" }}
            >
              ⚙️
            </span>
            <span
              role="img"
              aria-label="delete"
              title="Delete"
              onClick={() => onDelete && onDelete(question)}
              style={{ cursor: "pointer" }}
            >
              🗑️
            </span>
          </>
        )}
      </div>

      {/* Modal */}
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
                style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
              >
                <img src="/FormOrbit.png" alt="FormOrbit" className="logo" style={{ height: 40 }} />
                <div className="title-group">
                  <h2 style={{ margin: 0 }}>Edit Question</h2>
                  <p className="subtitle">Customize the properties of this question</p>
                </div>
              </div>

              <label>ID:</label>
              <input
                type="text"
                value={editedId}
                onChange={(e) => setEditedId(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 8, boxSizing: "border-box" }}
              />

              <label>Label:</label>
              <input
                type="text"
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  setIconCategory(guessCategoryFromLabel(e.target.value));
                }}
                style={{ width: "100%", marginBottom: 12, padding: 8, boxSizing: "border-box" }}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  style={{ transform: "scale(1.4)" }}
                />
                Required
              </label>

              <label style={{ marginTop: 20, display: "block" }}>Icon Category:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
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

              <label style={{ display: "block", marginBottom: 6 }}>Choose an icon:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
                {iconGroups[iconCategory]?.map((iconName) => (
                  <div
                    key={iconName}
                    className={`icon-box ${icon === iconName ? "selected" : ""}`}
                    onClick={() => setIcon(iconName)}
                    title={iconName}
                  >
                    <i className={`bi bi-${iconName}`} style={{ fontSize: 20 }} />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
                <button onClick={saveChanges} style={{ padding: "8px 16px" }}>Save Changes</button>
                <button onClick={closeModal} type="button" style={{ padding: "8px 16px" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Question;


