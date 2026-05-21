import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentUser, setCurrentUser, users }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Task Management System 🚀</Link>

      <div className="nav-menu">
        <select
          value={currentUser.id}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const userObj = users.find(u => u.id === selectedId);
            if (userObj) {
              setCurrentUser({ id: userObj.id, role: userObj.role });
            }
          }}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.role === 'ADMIN' ? 'Admin' : 'User'} ({user.username})
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
