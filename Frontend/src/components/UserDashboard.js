import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UserDashboard = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchAssignedTasks = useCallback(async () => {
    try {
      const response = await api.get(`/users/${currentUser.id}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchAssignedTasks();
  }, [fetchAssignedTasks]);

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>My Assigned Tasks</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tasks.length === 0 ? <p>No tasks assigned to you right now.</p> : null}
        
        {tasks.map(task => (
          <div key={task.id} className="glass-panel task-card" onClick={() => navigate(`/task/${task.id}`)} style={{ cursor: 'pointer' }}>
            <div className="task-header">
              <h4 className="task-title">{task.title}</h4>
              <span className={`badge badge-${task.status.toLowerCase().replace('_', '')}`}>{task.status}</span>
            </div>
            <p className="task-desc">{task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description}</p>
            <div className="task-footer">
               <span className="task-assignee" style={{ color: 'var(--primary-color)' }}>Click to View Workspace ➔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
