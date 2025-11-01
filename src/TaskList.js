import React, { useState, useEffect } from 'react';
import './styles.css'; // Add your own CSS for styling

const TaskList = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks ?? []);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setTasks(initialTasks ?? []);
  }, [initialTasks]);

  const onDragStart = (evt, task) => {
    evt.dataTransfer.setData('text/plain', task.id);
    setDraggedTask(task);
  };

  const onDragEnd = () => {
    setDraggedTask(null);
  };

  const onDragEnter = (evt) => {
    evt.preventDefault();
    evt.currentTarget.classList.add('dragged-over');
  };

  const onDragLeave = (evt) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove('dragged-over');
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    // Add background color to indicate allowed drop area
    evt.currentTarget.classList.add('dragged-over');
  };

  const onDrop = (evt, status) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove('dragged-over');

    if (draggedTask) {
      const updatedTasks = tasks.slice();
      const fromIndex = updatedTasks.findIndex((task) => task.id === draggedTask.id);

      if (status === 'New Order' && draggedTask.status !== 'New Order') {
        // Move from right to left with duplication
        // Remove dragged task from its original position
        updatedTasks.splice(fromIndex, 1);

        // Duplicate the card in the right column only once
        const duplicatedRightTask = { ...draggedTask, id: generateUniqueID(), status: 'In Progress' };
        updatedTasks.push(duplicatedRightTask);

        // Insert duplicated task at the drop position in the left column
        updatedTasks.push({ ...draggedTask, id: generateUniqueID(), status });
      } else {
        // Reorder within the same column or in the left column
        // Remove dragged task from its original position
        updatedTasks.splice(fromIndex, 1);

        // Find the drop position index in the left column
        const toIndexLeft = updatedTasks.findIndex((task) => task.status === status);

        // Insert dragged task at the drop position in the left column
        updatedTasks.splice(toIndexLeft, 0, { ...draggedTask, id: generateUniqueID(), status });
      }

      setTasks(updatedTasks);
      setDraggedTask(null);
    }
  };

  // Function to generate a unique ID (you can use your preferred method)
  const generateUniqueID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const onDoubleClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setEditedTask({ ...task });
  };

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedTask(null);
    setIsDeleteModalOpen(false);
  };

  const deleteTask = () => {
    const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
    setTasks(updatedTasks);
    setIsDeleteModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setEditedTask(null);
  };

  const handleAttributeChange = (attribute, value) => {
    setEditedTask((prevEditedTask) => ({ ...prevEditedTask, [attribute]: value }));
  };

  const saveChanges = () => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === editedTask.id) {
        return editedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    closeModal();
  };

  const renderTasks = (filteredTasks, status) => {
    return (
      <div
        className={`${status.toLowerCase()} small-box`}
        onDragEnter={(e) => onDragEnter(e)}
        onDragLeave={(e) => onDragLeave(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, status === 'In Progress' ? 'In Progress' : 'New Order')}
      >
        <section className="drag_container">
          <div className="container">
            <div className="drag_column">
              <div className="drag_row">
                <h4>{status}</h4>
                <button style={{ width: '100%' }}>+</button>
                {filteredTasks && filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="card"
                      draggable
                      onDragStart={(e) => onDragStart(e, task)}
                      onDragEnd={onDragEnd}
                      onDoubleClick={() => onDoubleClick(task)}
                    >
                      <div className="card_right">
                        {/* Removed display of 'Status' in the card */}
                        {/* Added 'Type' and 'Text' attribute rendering in the card */}
                        <div className="type">{task.type || 'Text Input'}</div>
                        <div className="text">{task.text}</div>
                        <button onClick={() => openDeleteModal(task)}>Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No tasks available</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="container">
      {renderTasks(tasks.filter((data) => data.status === 'New Order'), 'Form Components')}
      {renderTasks(tasks.filter((data) => data.status === 'In Progress'), 'Form Structure')}

      {isModalOpen && selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Component Details</h2>
            {/* Removed the display of 'Status' in the modal */}
            <label>Type:</label>
            <input
              type="text"
              value={editedTask?.type || 'Text Input'}
              readOnly  // Read-only attribute for the 'type' input field
            />
            <label>Text:</label>
            <input
              type="text"
              value={editedTask?.text}
              onChange={(e) => handleAttributeChange('text', e.target.value)}
            />
            <button onClick={saveChanges}>Save Changes</button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeDeleteModal}>
              &times;
            </span>
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <button onClick={deleteTask}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;


