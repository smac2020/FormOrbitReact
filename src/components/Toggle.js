import React, { useState, useEffect } from 'react';
import './styles.css';

const Toggle = ({
  task,
  onDragStart,
  onDragEnd,
  onSaveText,
  openDeleteConfirmation,
  onMoveUp,      // <-- added these props
  onMoveDown,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedId, setEditedId] = useState(task.id || '');
  const [label, setLabel] = useState(task.label || '');
  const [onValue, setOnValue] = useState(task.toggleOn || 'Yes');
  const [offValue, setOffValue] = useState(task.toggleOff || 'No');

  useEffect(() => {
    setEditedId(task.id || '');
    setLabel(task.label || '');
    setOnValue(task.toggleOn || 'Yes');
    setOffValue(task.toggleOff || 'No');
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(task.id, editedId, label, onValue, offValue);
    closeModal();
  };

  const handleDelete = () => openDeleteConfirmation(task);

  return (
    <div
      className="element-card toggle-card"
      draggable={!isModalOpen}
      onDragStart={(e) => {
        if (!isModalOpen) onDragStart(e, task);
        else e.preventDefault();
      }}
      onDragEnd={onDragEnd}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: isModalOpen ? 'default' : 'grab',
        userSelect: isModalOpen ? 'text' : 'none',
      }}
    >
      <div className="card_left" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label className="form-label" style={{ fontWeight: 'bold', userSelect: 'text' }}>
          Toggle
        </label>
        <span style={{ userSelect: 'text' }}>{label || 'Toggle Label'}</span>
      </div>

      {/* Arrows + Edit + Delete */}
      <div
        className="icon-group"
        style={{ userSelect: 'none', display: 'flex', gap: '6px', alignItems: 'center' }}
      >
        {/* Move Up Arrow */}
        <span
          role="button"
          aria-label="Move Up"
          title="Move Up"
          className="icon-button"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => onMoveUp && onMoveUp(task.id)}
        >
          ⬆️
        </span>

        {/* Move Down Arrow */}
        <span
          role="button"
          aria-label="Move Down"
          title="Move Down"
          className="icon-button"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => onMoveDown && onMoveDown(task.id)}
        >
          ⬇️
        </span>

        {/* Edit Icon */}
        <span role="img" aria-label="edit" onClick={openModal} className="icon-button" title="Edit">
          ⚙️
        </span>

        {/* Delete Icon */}
        <span
          role="img"
          aria-label="delete"
          onClick={handleDelete}
          className="icon-button delete-icon"
          title="Delete"
        >
          🗑️
        </span>
      </div>

      {isModalOpen && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          style={{ userSelect: 'text' }}
          onClick={closeModal}
        >
          <div className="modal-inner-wrapper" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-content"
              tabIndex={0}
              onClick={(e) => e.stopPropagation()}
              onDragStart={(e) => e.stopPropagation()}
              style={{ userSelect: 'text' }}
            >
              <div
                className="modal-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  userSelect: 'text',
                }}
              >
                <img src="/FormOrbit.png" alt="FormOrbit" className="modal-logo" />
                <div className="title-group">
                  <h2 style={{ margin: 0, userSelect: 'text' }}>Edit Toggle Element</h2>
                  <p className="subtitle" style={{ userSelect: 'text' }}>
                    Customize the properties of this element
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="toggle-id" style={{ userSelect: 'text' }}>
                  ID:
                </label>
                <input
                  id="toggle-id"
                  type="text"
                  value={editedId}
                  onChange={(e) => setEditedId(e.target.value)}
                  placeholder="Enter unique ID"
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label htmlFor="toggle-label" style={{ userSelect: 'text' }}>
                  Label:
                </label>
                <input
                  id="toggle-label"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Enter label"
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label htmlFor="toggle-on" style={{ userSelect: 'text' }}>
                  Value When ON:
                </label>
                <input
                  id="toggle-on"
                  type="text"
                  value={onValue}
                  onChange={(e) => setOnValue(e.target.value)}
                  placeholder="Value for toggle ON"
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label htmlFor="toggle-off" style={{ userSelect: 'text' }}>
                  Value When OFF:
                </label>
                <input
                  id="toggle-off"
                  type="text"
                  value={offValue}
                  onChange={(e) => setOffValue(e.target.value)}
                  placeholder="Value for toggle OFF"
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button onClick={saveChanges} style={{ padding: '8px 16px' }}>
                  Save Changes
                </button>
                <button onClick={closeModal} type="button" style={{ padding: '8px 16px' }}>
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

export default Toggle;







