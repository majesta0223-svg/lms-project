// components/Navbar.js
// Дээд навигацийн цэс

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
          🎓 <span>LMS Систем</span>
        </Link>
      </div>

      <div className="navbar-links">
        {user?.role === 'employee' && (
          <>
            <Link to="/dashboard">🏠 Нүүр</Link>
            <Link to="/my-results">📊 Миний үр дүн</Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin">📈 Хяналт</Link>
            <Link to="/admin/courses">📚 Курс удирдах</Link>
            <Link to="/admin/results">📋 Үр дүн</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        {user && (
          <>
            <span className="user-badge">
              {user.role === 'admin' ? '👑' : '👤'} {user.name}
            </span>
            <button onClick={handleLogout} className="btn-logout">Гарах</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;