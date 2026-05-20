// components/ProtectedRoute.js
// Нэвтрээгүй хэрэглэгч хамгаалагдсан хуудсанд орохоос сэргийлнэ

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0a0a1a' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Нэвтрээгүй бол login хуудас руу
  if (!user) return <Navigate to="/login" replace />;

  // Эрх таарахгүй бол нүүр хуудас руу
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;