import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import '../styles/TaskForm.css';

const TaskForm = ({ onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '', priority: 'medium' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.title.trim()) { setError('Task title is required'); return; }
    if (!formData.deadline)     { setError('Deadline is required'); return; }

    try {
      setIsSubmitting(true);
      const taskInput = {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        deadline: new Date(formData.deadline).toISOString(),
        priority: formData.priority,
        status: 'pending',
      };

      await onTaskCreated(taskInput);
    } catch (err) {
      setError('An error occurred while creating the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <div className="form-header">
          <h2>Create New Task</h2>
          <button className="close-button" onClick={onClose}><X size={24} /></button>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input id="title" type="text" name="title" placeholder="Enter task title" value={formData.title} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Enter task description (optional)" value={formData.description} onChange={handleChange} className="form-textarea" rows={4} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Deadline *</label>
              <input id="deadline" type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;