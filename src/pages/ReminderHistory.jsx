import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Phone, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import '../styles/ReminderHistory.css';

const getChannelIcon = (channel) => {
  switch (channel) {
    case 'email': return <Mail size={18} />;
    case 'sms':   return <Phone size={18} />;
    default:      return <MessageSquare size={18} />;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'sent':      return <CheckCircle2 size={18} className="icon-green" />;
    case 'failed':    return <XCircle size={18} className="icon-red" />;
    case 'dismissed': return <Clock size={18} className="icon-orange" />;
    default:          return <Clock size={18} />;
  }
};

const ReminderHistory = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.reminders.list();
      setReminders(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load reminder history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupedByDate = reminders.reduce((acc, reminder) => {
    const date = new Date(reminder.sent_at || reminder.sentAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(reminder);
    return acc;
  }, {});

  return (
    <div className="reminder-history-page">
      <div className="page-header">
        <h1>Reminder History</h1>
        <p>Track all reminders sent to you over the past 30 days</p>
      </div>

      <div className="history-container">
        {error ? (
          <p className="error-state">{error}</p>
        ) : loading ? (
          <div className="loading-state"><Loader2 className="animate-spin" /> Fetching history...</div>
        ) : Object.keys(groupedByDate).length > 0 ? (
          Object.entries(groupedByDate).map(([date, dayReminders]) => (
            <div key={date} className="history-day">
              <h3 className="day-header">{date}</h3>
              <div className="reminders-list">
                {dayReminders.map(reminder => (
                  <div key={reminder.id} className="reminder-item">
                    <div className="reminder-icons">
                      {getChannelIcon(reminder.channel)}
                      {getStatusIcon(reminder.status)}
                    </div>
                    <div className="reminder-info">
                      <p className="reminder-channel">
                        {reminder.channel.charAt(0).toUpperCase() + reminder.channel.slice(1)} Reminder
                      </p>
                      <p className="reminder-meta">
                        Escalation Level: {reminder.escalation_level || reminder.escalationLevel} • Status: {reminder.status}
                      </p>
                    </div>
                    <div className="reminder-time">
                      {new Date(reminder.sent_at || reminder.sentAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No reminders found in your history.</p>
        )}
      </div>
    </div>
  );
};

export default ReminderHistory;