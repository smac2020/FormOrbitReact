import React, { useState, useEffect } from 'react';


import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const availableIcons = [
    // Essentials
    "person", "envelope", "telephone", "calendar", "geo-alt", "lock", "clipboard",
    "star", "chat-dots", "file-earmark-text", "box-arrow-down", "gear", "house-door",

    // Global/tech
    "cloud", "globe", "wifi", "shield-lock", "lightning", "key", "search", "send",

    // Natural elements and beautiful icons
    "sun", "moon", "cloud-sun", "cloud-moon", "cloud-rain", "cloud-lightning",
    "wind", "fire", "droplet", "snow", "tree", "leaf", "flower1", "flower2",
    "umbrella", "globe-americas", "mountain", "water", "compass",

    // Others
    "camera", "cart", "gift", "music-note", "palette", "paperclip", "printer",
    "question-circle", "upload", "arrow-right", "arrow-left"
  ];


const FormElement = ({ task, onDragStart, onDragEnd, openDeleteConfirmation, onUpdateForm }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState(task.formName || '');
  const [formStyle, setFormStyle] = useState(task.formStyle || '');
  const [formSubtitle, setFormSubtitle] = useState(task.formSubtitle || '');
  const [formIcon, setFormIcon] = useState(task.formIcon || '');

  useEffect(() => {
  setFormName(task.formName || '');
  setFormStyle(task.formStyle || '');
  setFormSubtitle(task.formSubtitle || '');
  setFormIcon(task.formIcon || '');
}, [task]);

  
 const handleSave = () => {
  onUpdateForm(task.id, {
    formName,
    formStyle,
    formIcon,
    formSubtitle,
  });
  setModalOpen(false);
};



  return (
    <>
      <div
        className="card"
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <strong>Form Element:</strong> {formIcon && <i className={`bi bi-${formIcon}`} style={{ marginRight: 6 }} />}
        {formName}
        {formSubtitle && (
          <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: 4 }}>
            {formSubtitle}
          </div>
        )}

        <span
          role="button"
          aria-label="Edit Form"
          onClick={() => setModalOpen(true)}
          style={{
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '22px',
            userSelect: 'none',
          }}
          title="Edit Form"
        >
          ⚙️
        </span>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Edit Form Element</h2>

            <label>Form Name:</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            <label>Subtitle (optional):</label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
            />

            <label>Form Style:</label>
            <select
              value={formStyle}
              onChange={(e) => setFormStyle(e.target.value)}
            >
              <option value="">Select Style</option>

              <optgroup label="Color Themes">
                <option value="AuroraPulse">Aurora Pulse</option>
                <option value="CircuitWave">Circuit Wave</option>
                <option value="CyberVelvet">CyberVelvet</option>
                <option value="CysteralDiamonds">Cysteral Diamonds</option>
                <option value="EclipseShadow">Eclipse Shadow</option>
                <option value="ElectricTwilight">Electric Twilight</option>
                <option value="Glass">Glass</option>
                <option value="MapleStyle">Maple Style</option>
                <option value="MidnightGlass">Midnight Glass</option>
                 <option value="MonarchGold">Monarch Gold</option>
                <option value="OrbitalSlate">Orbital Slate</option>
                <option value="QuantumFrost">Quantum Frost</option>
                <option value="SolarFlare">Solar Flare</option>
                <option value="SolarisDawn">Solaris Dawn</option>
                <option value="TitaniumCore">Titanium Core</option>
              </optgroup>
            </select>

            <label>Select Icon:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              {availableIcons.map((icon) => (
                <div
                  key={icon}
                  className={`icon-box ${formIcon === icon ? 'selected' : ''}`}
                  onClick={() => setFormIcon(icon)}
                  title={icon}
                  style={{
                    cursor: 'pointer',
                    padding: 8,
                    border: formIcon === icon ? '2px solid #0df' : '1px solid #666',
                    borderRadius: 6,
                    background: formIcon === icon ? '#222' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className={`bi bi-${icon}`} style={{ fontSize: 20 }} />
                </div>
              ))}
            </div>

            <label>Form Id:</label>
            <input
              type="text"
              value={task.id} 
              readOnly
            />

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
              <button onClick={() => openDeleteConfirmation(task)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormElement;













