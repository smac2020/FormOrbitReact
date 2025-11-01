import React, { useState, useEffect } from 'react';
import './styles.css';

const Checkbox = ({
  task,
  onDragStart,
  onDragEnd,
  onSaveText,
  openDeleteConfirmation,
  onMoveUp,       // ✅ new prop
  onMoveDown      // ✅ new prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editedId, setEditedId] = useState(task.id || '');
  const [label, setLabel] = useState(task.label || '');
  const [checkedValue, setCheckedValue] = useState(task.checkedValue || 'Checked');
  const [uncheckedValue, setUncheckedValue] = useState(task.uncheckedValue || 'Unchecked');
  const [required, setRequired] = useState(task.required || false);

  useEffect(() => {
    setEditedId(task.id || '');
    setLabel(task.label || '');
    setCheckedValue(task.checkedValue || 'Checked');
    setUncheckedValue(task.uncheckedValue || 'Unchecked');
    setRequired(task.required || false);
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(task.id, editedId, label, checkedValue, uncheckedValue, required);
    closeModal();
  };

  const handleDelete = () => openDeleteConfirmation(task);

  return (
    <div
      className="element-card checkbox-card"
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
        userSelect: isModalOpen ? 'text' : 'none',
        cursor: isModalOpen ? 'default' : 'grab',
      }}
    >
      <div
        className="card_left"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', userSelect: 'text' }}
      >
        <label className="form-label" style={{ fontWeight: 'bold' }}>
          Checkbox
        </label>
        <span>{label || 'Checkbox Label'}</span>
      </div>

      <div className="icon-group" style={{ display: 'flex', gap: '6px' }}>
        {/* Move Up */}
        <span
          role="button"
          aria-label="Move Up"
          className="icon-button"
          title="Move Up"
          onClick={() => onMoveUp?.(task.id)}
          style={{ cursor: 'pointer' }}
        >
          ⬆️
        </span>

        {/* Move Down */}
        <span
          role="button"
          aria-label="Move Down"
          className="icon-button"
          title="Move Down"
          onClick={() => onMoveDown?.(task.id)}
          style={{ cursor: 'pointer' }}
        >
          ⬇️
        </span>

        {/* Edit */}
        <span
          role="img"
          aria-label="edit"
          onClick={openModal}
          title="Edit"
          className="icon-button"
        >
          ⚙️
        </span>

        {/* Delete */}
        <span
          role="img"
          aria-label="delete"
          onClick={handleDelete}
          title="Delete"
          className="icon-button delete-icon"
        >
          🗑️
        </span>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal} style={{ userSelect: 'text' }}>
          <div
            className="modal-content"
            style={{ maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
            onDragStart={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <img src="/FormOrbit.png" alt="FormOrbit" className="modal-logo" style={{ height: '40px' }} />
              <div className="title-group">
                <h2 style={{ margin: 0 }}>Edit Checkbox</h2>
                <p className="subtitle">Customize the properties of this element</p>
              </div>
            </div>

            <div>
              <label htmlFor="checkbox-id">ID:</label>
              <input
                id="checkbox-id"
                type="text"
                value={editedId}
                onChange={(e) => setEditedId(e.target.value)}
                placeholder="Enter unique ID"
                style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
              />
            </div>

            <div>
              <label htmlFor="checkbox-label">Label:</label>
              <input
                id="checkbox-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter label"
                style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
              />
            </div>

            <div>
              <label htmlFor="checked-value">Value When Checked:</label>
              <input
                id="checked-value"
                type="text"
                value={checkedValue}
                onChange={(e) => setCheckedValue(e.target.value)}
                placeholder="Value when checked"
                style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
              />
            </div>

            <div>
              <label htmlFor="unchecked-value">Value When Unchecked:</label>
              <input
                id="unchecked-value"
                type="text"
                value={uncheckedValue}
                onChange={(e) => setUncheckedValue(e.target.value)}
                placeholder="Value when unchecked"
                style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
              <label htmlFor="checkbox-required" style={{ cursor: 'pointer' }}>
                <input
                  id="checkbox-required"
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  style={{ transform: 'scale(1.4)', marginRight: '8px' }}
                />
                Required
              </label>
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
      )}
    </div>
  );
};

export default Checkbox;





