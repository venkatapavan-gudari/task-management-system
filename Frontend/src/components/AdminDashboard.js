import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = ({ users }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/admin/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUserSelection = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, value]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== value));
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/tasks', {
        title,
        description,
        userIds: selectedUsers
      });
      setTitle('');
      setDescription('');
      setSelectedUsers([]);
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  // Filter out ADMIN users so you only assign tasks to regular USERs
  const assignableUsers = users.filter(u => u.role === 'USER');

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        
        {/* Create Task Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input 
                type="text" 
                className="form-control" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Users</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {assignableUsers.map(user => (
                  <label key={user.id}>
                    <input 
                      type="checkbox" 
                      value={user.id} 
                      checked={selectedUsers.includes(user.id)} 
                      onChange={handleUserSelection} 
                    /> {user.username}
                  </label>
                ))}
                {assignableUsers.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No standard users found.</span>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Task</button>
          </form>
        </div>

        {/* Task List */}
        <div>
          <h3>All Tasks Overview</h3>
          {tasks.length === 0 ? <p>No tasks created yet.</p> : null}
          {tasks.map(task => (
            <div key={task.id} className="glass-panel task-card">
              <div className="task-header">
                <h4 className="task-title">{task.title}</h4>
                <span className={`badge badge-${task.status.toLowerCase().replace('_', '')}`}>{task.status}</span>
              </div>
              <p className="task-desc">{task.description}</p>
              <div className="task-footer">
                <span className="task-assignee">Task ID: {task.id}</span>
                {task.lockedBy && (
                  <span className="task-assignee" style={{ color: 'var(--primary-color)' }}>
                    Locked By: User {task.lockedBy.id} ({task.lockedBy.username})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
