// context/AuthContext.js
// Нэвтрэлтийн мэдээллийг бүх хуудсанд дамжуулах Context

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Хуудас нээгдэх үед localStorage-с хадгалсан мэдээлэл авна
  useEffect(() => {
    const savedUser  = localStorage.getItem('lms_user');
    const savedToken = localStorage.getItem('lms_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Нэвтэрсний дараа user-г хадгална
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('lms_user',  JSON.stringify(userData));
    localStorage.setItem('lms_token', token);
  };

  // Гарахад бүгдийг цэвэрлэнэ
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хэрэглэх: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);