import React, { useState, useEffect } from 'react';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const availableIcons = [
  'person', 'envelope', 'telephone', 'calendar', 'geo-alt', 'lock',
  'clipboard', 'star', 'chat-dots', 'file-earmark-text'
];

const TextArea = ({
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
  const [editedId, setEditedId] = useState(task.id || '');
  const [editedLabel, setEditedLabel] = useState(task.label || '');
  const [editedRequired, setEditedRequired] = useState(task.required || false);
  const [selectedIcon, setSelectedIcon] = useState(task.icon || '');

  useEffect(() => {
    setEditedId(task.id || '');
    setEditedLabel(task.label || '');
    setEditedRequired(task.required || false);
    setSelectedIcon(task.icon || '');
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(task.id, editedId, editedLabel, editedRequired, '', selectedIcon);
    closeModal();
  };

  const handleDelete = () => openDeleteConfirmation(task);

  const dragProps = !isModalOpen
    ? {
        draggable: true,
        onDragStart: (e) => onDragStart(e, task),
        onDragEnd,
      }
    : {};

  return (
    <>
      <div
        className="element-card textarea-card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        {...dragProps}
      >
        <div className="card_left" style={{ flex: 1 }}>
          <div className="type" style={{ fontWeight: 'bold', marginBottom: '4px' }}>Text Area</div>
          <div className="text">
            {selectedIcon && (
              <i className={`bi bi-${selectedIcon}`} style={{ marginRight: '8px' }}></i>
            )}
            {editedLabel || 'Text Area Label'}
          </div>
        </div>

        <div
          className="icon-group"
          style={{ display: 'flex', gap: '10px', marginLeft: '12px', cursor: 'pointer', userSelect: 'none' }}
        >
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
            style={{ fontSize: '28px' }}
          >
            ⚙️
          </span>
          <span
            role="button"
            className="icon-button delete-icon"
            title="Delete"
            onClick={handleDelete}
            style={{ fontSize: '32px', color: '#f50336', fontWeight: 'bold' }}
          >
            🗑️
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" role="dialog" aria-modal="true" onClick={closeModal}>
          <div
            className="modal-content"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <img
                src="/FormOrbit.png"
                alt="FormOrbit"
                className="logo"
                style={{ height: '40px' }}
              />
              <div className="title-group">
                <h2 style={{ margin: 0 }}>Edit Text Area Input</h2>
                <p className="subtitle">Customize the properties of this input field</p>
              </div>
            </div>

            <label htmlFor="textarea-id">ID:</label>
            <input
              id="textarea-id"
              type="text"
              value={editedId}
              onChange={(e) => setEditedId(e.target.value)}
              placeholder="Enter unique ID"
              style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
            />

            <label htmlFor="textarea-label">Label:</label>
            <textarea
              id="textarea-label"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              style={{ width: '100%', height: '100px', padding: '8px', boxSizing: 'border-box' }}
            />

            <label
              htmlFor="textarea-required"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}
            >
              <input
                id="textarea-required"
                type="checkbox"
                checked={editedRequired}
                onChange={(e) => setEditedRequired(e.target.checked)}
                style={{ transform: 'scale(1.4)' }}
              />
              Required
            </label>

            <label style={{ marginTop: '20px' }}>Choose an icon:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {availableIcons.map((icon) => (
                <div
                  key={icon}
                  className={`icon-box ${selectedIcon === icon ? 'selected' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                  title={icon}
                  style={{
                    cursor: 'pointer',
                    padding: '4px',
                    border: selectedIcon === icon ? '2px solid #007bff' : '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedIcon(icon);
                  }}
                >
                  <i className={`bi bi-${icon}`} style={{ fontSize: '20px' }}></i>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={saveChanges} style={{ padding: '8px 16px' }}>
                Save Changes
              </button>
              <button onClick={closeModal} type="button" style={{ padding: '8px 16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TextArea;


