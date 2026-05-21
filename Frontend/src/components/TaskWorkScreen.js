import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const TaskWorkScreen = ({ currentUser }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [workDate, setWorkDate] = useState('');
  const [workTime, setWorkTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchTaskDetails = useCallback(async () => {
    try {
      const response = await api.get(`/users/${currentUser.id}/tasks`);
      const currentTask = response.data.find(t => t.id === parseInt(taskId));
      setTask(currentTask);
    } catch (err) {
      setError('Failed to fetch task');
    }
  }, [currentUser.id, taskId]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleLock = async () => {
    try {
      await api.post(`/users/${currentUser.id}/tasks/${taskId}/lock`);
      setMessage('Task locked successfully!');
      setError('');
      fetchTaskDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to lock task');
      setMessage('');
    }
  };

  const handleAddWork = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/users/${currentUser.id}/tasks/${taskId}/work-entries`, {
        workDate,
        workTime
      });
      setMessage('Work entry added successfully!');
      setError('');
      setWorkDate('');
      setWorkTime('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add work entry');
      setMessage('');
    }
  };

  const handleComplete = async () => {
    try {
      await api.post(`/users/${currentUser.id}/tasks/${taskId}/complete`);
      setMessage('Task completed!');
      setError('');
      fetchTaskDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete task');
      setMessage('');
    }
  };

  if (!task) return <div className="container">Loading task...</div>;

  const isLockedByMe = task.lockedBy && task.lockedBy.id === currentUser.id;
  const isLockedByOther = task.lockedBy && task.lockedBy.id !== currentUser.id;
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '1rem', backgroundColor: '#6b7280' }}>
        ← Back to Dashboard
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{task.title}</h2>
          <span className={`badge badge-${task.status.toLowerCase().replace('_', '')}`} style={{ fontSize: '1rem' }}>
            {task.status}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{task.description}</p>

        {message && <div style={{ padding: '1rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '0.5rem', marginBottom: '1rem' }}>{message}</div>}
        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Action Panel */}
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
            <h3>Task Actions</h3>
            {!task.lockedBy && !isCompleted && (
              <button className="btn btn-primary" onClick={handleLock} style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem' }}>
                🔒 Lock Task to Start Working
              </button>
            )}
            
            {isLockedByOther && !isCompleted && (
              <p style={{ color: 'var(--danger-color)', fontWeight: '500' }}>
                ⚠️ This task is locked by User {task.lockedBy.id}. You cannot work on it.
              </p>
            )}

            {isLockedByMe && !isCompleted && (
              <button className="btn btn-secondary" onClick={handleComplete} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                ✅ Mark as Complete
              </button>
            )}

            {isCompleted && (
              <p style={{ color: 'var(--secondary-hover)', fontWeight: '500', textAlign: 'center', marginTop: '1rem' }}>
                🎉 This task is fully completed.
              </p>
            )}
          </div>

          {/* Work Entry Form */}
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', opacity: (!isLockedByMe || isCompleted) ? 0.5 : 1 }}>
            <h3>Log Work</h3>
            <form onSubmit={handleAddWork}>
              <div className="form-group">
                <label className="form-label">Work Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                  disabled={!isLockedByMe || isCompleted}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Work Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={workTime}
                  onChange={(e) => setWorkTime(e.target.value)}
                  disabled={!isLockedByMe || isCompleted}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!isLockedByMe || isCompleted}>
                Submit Log
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskWorkScreen;
