import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import TaskWorkScreen from './components/TaskWorkScreen';
import api from './api';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState({ id: 2, role: 'USER' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} users={users} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              currentUser.role === 'ADMIN' ? 
                <AdminDashboard users={users} /> : 
                <UserDashboard currentUser={currentUser} />
            } 
          />
          <Route 
            path="/task/:taskId" 
            element={
              currentUser.role === 'USER' ? 
                <TaskWorkScreen currentUser={currentUser} /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
