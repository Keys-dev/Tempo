import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import '../styles/TaskDetail.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const data = await api.tasks.get(id);
      setTask(data);
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Task not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      const updatedTask = await api.tasks.update(id, { status: 'completed' });
      setTask(updatedTask);
    } catch (err) {
      console.error('Error completing task:', err);
      alert('Failed to update task status');
    }
  };

  if (loading) return <div className="loading-container"><Loader2 className="animate-spin" /> Loading task details...</div>;
  if (error || !task) return <div className="error-message">{error || 'Task not found'}</div>;

  const reminders = task.reminders || [];
  const isOverdue = task.status === 'overdue' || new Date(task.deadline) < new Date();


  return (
    <div className="task-detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="task-detail-card">
        <div className="detail-header">
          <div>
            <h1>{task.title}</h1>
            <p className="task-meta">Created on {new Date(task.created_at || task.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="detail-badges">
            <span className={`badge priority-${task.priority}`}>{task.priority.toUpperCase()}</span>
            <span className={`badge status-${task.status}`}>{task.status.toUpperCase()}</span>
          </div>
        </div>

        {task.description && (
          <div className="detail-section">
            <h2>Description</h2>
            <p>{task.description}</p>
          </div>
        )}

        <div className="detail-section">
          <h2>Deadline</h2>
          <div className={`deadline-info ${isOverdue ? 'overdue' : ''}`}>
            <Clock size={20} />
            <div>
              <p className="deadline-date">
                {new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString()}
              </p>
              {isOverdue && <p className="overdue-text">This task is overdue</p>}
            </div>
          </div>
        </div>

        {task.status !== 'completed' && (
          <button className="btn-complete-large" onClick={handleCompleteTask}>
            <CheckCircle2 size={20} /> Mark as Completed
          </button>
        )}

        {reminders.length > 0 && (
          <div className="detail-section">
            <h2>Reminders ({reminders.length})</h2>
            <div className="reminders-list">
              {reminders.map(reminder => (
                <div key={reminder.id} className="reminder-item">
                  <div className="reminder-info">
                    <p className="reminder-channel">{reminder.channel.toUpperCase()} — Level {reminder.escalation_level || reminder.escalationLevel}</p>
                    <p className="reminder-time">Scheduled: {new Date(reminder.scheduled_at || reminder.sent_at || reminder.scheduledAt).toLocaleString()}</p>
                  </div>
                  <span className={`badge status-${reminder.status}`}>{reminder.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;