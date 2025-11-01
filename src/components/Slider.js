import React, { useState, useEffect } from 'react';
import './styles.css';

const Slider = ({
  task,
  onDragStart,
  onDragEnd,
  onSaveText,
  openDeleteConfirmation,
  isInLeftColumn = false,
  onMoveUp,     // ✅ added
  onMoveDown    // ✅ added
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [id, setId] = useState(task.id || '');
  const [label, setLabel] = useState(task.label || 'Fitness Level');
  const [min, setMin] = useState(task.min ?? 1);
  const [max, setMax] = useState(task.max ?? 10);
  const [step, setStep] = useState(task.step ?? 1);
  const [defaultValue, setDefaultValue] = useState(task.defaultValue ?? 5);

  useEffect(() => {
    setId(task.id || '');
    setLabel(task.label || 'Fitness Level');
    setMin(task.min ?? 1);
    setMax(task.max ?? 10);
    setStep(task.step ?? 1);
    setDefaultValue(task.defaultValue ?? 5);
  }, [task]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveChanges = () => {
    onSaveText(task.id, id, label, { min, max, step, defaultValue });
    closeModal();
  };

  const handleDelete = () => openDeleteConfirmation(task);

  const renderIconGroup = () => (
    <div className="icon-group" style={{ display: 'flex', gap: '6px' }}>
      {/* ⬆️ Move Up */}
      <span
        role="button"
        aria-label="Move Up"
        className="icon-button"
        title="Move Up"
        style={{ cursor: 'pointer' }}
        onClick={() => onMoveUp?.(task.id)}
      >
        ⬆️
      </span>

      {/* ⬇️ Move Down */}
      <span
        role="button"
        aria-label="Move Down"
        className="icon-button"
        title="Move Down"
        style={{ cursor: 'pointer' }}
        onClick={() => onMoveDown?.(task.id)}
      >
        ⬇️
      </span>

      {/* ⚙️ Edit */}
      <span
        role="img"
        aria-label="edit"
        onClick={openModal}
        className="icon-button"
        title="Edit"
      >
        ⚙️
      </span>

      {/* 🗑️ Delete */}
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
  );

  const renderSliderCard = () => (
    <div
      className="element-card slider-card"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      style={{ userSelect: 'none', cursor: 'grab', padding: '8px', display: 'flex', justifyContent: 'space-between' }}
    >
      <div className="card_left" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="type" style={{ fontWeight: 'bold', marginBottom: '6px' }}>
          Slider
        </div>
        <label style={{ marginTop: '6px' }}>
          {label}: {defaultValue}
        </label>
      </div>

      {renderIconGroup()}
    </div>
  );

  return (
    <>
      {isInLeftColumn ? (
        renderSliderCard()
      ) : (
        <div
          className="element-card slider-card"
          draggable
          onDragStart={(e) => onDragStart(e, task)}
          onDragEnd={onDragEnd}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div className="card_left" style={{ flex: 1, backgroundColor: 'transparent' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>
              {label}: <span>{defaultValue}</span>
            </label>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={defaultValue}
              onChange={(e) => setDefaultValue(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {renderIconGroup()}
        </div>
      )}

      {isModalOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-inner-wrapper">
            <div className="modal-content" tabIndex={0} onClick={(e) => e.stopPropagation()}>
              <div
                className="modal-header"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}
              >
                <img src="/FormOrbit.png" alt="FormOrbit" className="modal-logo" />
                <h2 style={{ margin: 0 }}>Edit Slider Element</h2>
              </div>

              <div>
                <label>ID:</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />

                <label>Label:</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />

                <label>Min:</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />

                <label>Max:</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />

                <label>Step:</label>
                <input
                  type="number"
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '12px', padding: '8px', boxSizing: 'border-box' }}
                />

                <label>Default Value:</label>
                <input
                  type="number"
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(Number(e.target.value))}
                  style={{ width: '100%', marginBottom: '20px', padding: '8px', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
        </div>
      )}
    </>
  );
};

export default Slider;

