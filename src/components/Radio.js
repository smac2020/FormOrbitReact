import React, { useState, useEffect } from 'react';
import './styles.css';

const Radio = ({
  task,
  onDragStart,
  onDragEnd,
  onSaveText,
  openDeleteConfirmation,
  onMoveUp,
  onMoveDown
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedId, setEditedId] = useState(task.id || '');
  const [editedLabel, setEditedLabel] = useState(task.label || 'Radio Question:');
  const [options, setOptions] = useState(
    Array.isArray(task.options)
      ? task.options.map(opt => (typeof opt === 'string' ? opt : String(opt)))
      : ['Option A', 'Option B']
  );
  const [newOption, setNewOption] = useState('');
  const [selectedValue, setSelectedValue] = useState(task.selectedValue || '');

  useEffect(() => {
    setEditedId(task.id || '');
    setEditedLabel(task.label || 'Radio Question:');
    setOptions(
      Array.isArray(task.options)
        ? task.options.map(opt => (typeof opt === 'string' ? opt : String(opt)))
        : ['Option A', 'Option B']
    );
    setSelectedValue(task.selectedValue || '');
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions(prev => [...prev, trimmed]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    setOptions(prev => prev.filter(opt => opt !== optionToRemove));
    if (selectedValue === optionToRemove) {
      setSelectedValue('');
    }
  };

  const handleDelete = () => openDeleteConfirmation(task);

  const saveChanges = () => {
    onSaveText(task.id, editedId, editedLabel, options, '', '');
    closeModal();
  };

  return (
    <>
      <div
        className="element-card radio-card"
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onDragEnd={onDragEnd}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div className="card_left" style={{ flex: 1 }}>
          <div className="type" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Radio
          </div>
          <label
            className="form-label"
            htmlFor={`radioGroup-${task.id}`}
            style={{ fontWeight: 'bold' }}
          >
            {editedLabel}
          </label>
        </div>

        <div className="icon-group" style={{ display: 'flex', gap: '10px', marginLeft: '12px', userSelect: 'none' }}>
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
            style={{ color: '#f50336', fontWeight: 'bold' }}
          >
            🗑️
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-content" tabIndex={0} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <img
                src="/FormOrbit.png"
                alt="FormOrbit"
                className="logo"
                style={{ height: '40px' }}
              />
              <div className="title-group">
                <h2 style={{ margin: 0 }}>Edit Radio</h2>
                <p className="subtitle">Customize the properties of this element</p>
              </div>
            </div>

            <label htmlFor="radio-id">ID:</label>
            <input
              id="radio-id"
              type="text"
              value={editedId}
              onChange={e => setEditedId(e.target.value)}
              placeholder="Enter unique ID"
              style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
            />

            <label htmlFor="radio-label">Label:</label>
            <input
              id="radio-label"
              type="text"
              value={editedLabel}
              onChange={e => setEditedLabel(e.target.value)}
              placeholder="Enter label for radio group"
              style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
            />

            <label htmlFor="new-option">Options:</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                id="new-option"
                type="text"
                placeholder="New option"
                value={newOption}
                onChange={e => setNewOption(e.target.value)}
                style={{ flex: 1, padding: '8px' }}
              />
              <button onClick={handleAddOption} style={{ padding: '8px 12px' }}>
                Add
              </button>
            </div>

            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              {options.map((opt, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{opt}</span>
                  <button
                    onClick={() => handleRemoveOption(opt)}
                    style={{
                      backgroundColor: '#f50336',
                      color: 'white',
                      border: 'none',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      borderRadius: '3px',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                    aria-label={`Remove option ${opt}`}
                    title={`Remove option ${opt}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

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
    </>
  );
};

export default Radio;

