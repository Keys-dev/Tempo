import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle2, Clock, TrendingUp, Loader2 } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.tasks.list();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    overdueTasks: tasks.filter(t => t.status === 'overdue').length,
  };

  const organizedTasks = {
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'completed'),
    urgent:   tasks.filter(t => t.priority === 'high' && t.status !== 'completed'),
    upcoming: tasks.filter(t => (t.priority === 'medium' || t.priority === 'low') && t.status !== 'completed'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const handleTaskCreated = async (taskInput) => {
    try {
      const newTask = await api.tasks.create(taskInput);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updatedTask = await api.tasks.update(id, { status });
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task status');
    }
  };

  const renderTaskList = (taskList) => {
    if (loading) return <div className="loading-state"><Loader2 className="animate-spin" /> Loading tasks...</div>;
    if (error) return <div className="error-state">{error}</div>;
    
    return taskList && taskList.length > 0
      ? taskList.map(task => <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />)
      : <p className="empty-state">No tasks in this category</p>;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Smart Reminder Dashboard</h1>
          <p>Welcome back! Here's your task overview</p>
        </div>
        <button className="btn-primary btn-lg" onClick={() => setShowTaskForm(true)}>
          <Plus size={20} /> New Task
        </button>
      </div>

      {showTaskForm && (
        <div className="modal-overlay">
          <TaskForm onClose={() => setShowTaskForm(false)} onTaskCreated={handleTaskCreated} />
        </div>
      )}

      <div className="stats-grid">
        <StatCard title="Total Tasks"     value={stats.totalTasks}     icon={<Clock size={24} />}         color="blue" />
        <StatCard title="Pending"         value={stats.pendingTasks}   icon={<Clock size={24} />}         color="blue" />
        <StatCard title="Completed"       value={stats.completedTasks} icon={<CheckCircle2 size={24} />}  color="green" />
        <StatCard title="Overdue"         value={stats.overdueTasks}   icon={<AlertCircle size={24} />}   color="red" />
        <StatCard title="Completion Rate" value={`${stats.totalTasks === 0 ? 0 : Math.round(stats.completedTasks / stats.totalTasks * 100)}%`} icon={<TrendingUp size={24} />} color="purple" />
      </div>

      <div className="tasks-section">
        <div className="tabs">
          {['overview', 'critical', 'urgent', 'upcoming', 'completed'].map(tab => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="task-section">
                <h3><AlertCircle size={20} /> Critical Tasks</h3>
                <div className="task-list">{renderTaskList(organizedTasks.critical)}</div>
              </div>
              <div className="task-section">
                <h3><Clock size={20} /> Urgent (Next 24h)</h3>
                <div className="task-list">{renderTaskList(organizedTasks.urgent)}</div>
              </div>
            </div>
          )}
          {activeTab === 'critical'  && <div className="task-list">{renderTaskList(organizedTasks.critical)}</div>}
          {activeTab === 'urgent'    && <div className="task-list">{renderTaskList(organizedTasks.urgent)}</div>}
          {activeTab === 'upcoming'  && <div className="task-list">{renderTaskList(organizedTasks.upcoming)}</div>}
          {activeTab === 'completed' && <div className="task-list">{renderTaskList(organizedTasks.completed)}</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;