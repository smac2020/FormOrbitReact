// EditModal.js
import React, { useState } from 'react';

const EditModal = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Task</h2>
        <label htmlFor="status">Status:</label>
        <input type="text" name="status" value={editedTask.status} onChange={handleInputChange} />
        {/* Add other input fields as needed */}
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditModal;
