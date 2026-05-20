// App.js — Бүх route (хуудас) тодорхойлно

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar        from './components/Navbar';

import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import CourseDetail   from './pages/CourseDetail';
import Quiz           from './pages/Quiz';
import Result         from './pages/Result';
import MyResults      from './pages/MyResults';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses   from './pages/AdminCourses';
import AdminResults   from './pages/AdminResults';

const Layout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">{children}</main>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Нийтийн хуудсууд */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"         element={<Home />} />

          {/* Ажилтны хуудсууд */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="employee"><Layout><Dashboard /></Layout></ProtectedRoute>
          }/>
          <Route path="/courses/:id" element={
            <ProtectedRoute role="employee"><Layout><CourseDetail /></Layout></ProtectedRoute>
          }/>
          <Route path="/quiz/:courseId" element={
            <ProtectedRoute role="employee"><Quiz /></ProtectedRoute>
          }/>
          <Route path="/result" element={
            <ProtectedRoute><Layout><Result /></Layout></ProtectedRoute>
          }/>
          <Route path="/my-results" element={
            <ProtectedRoute role="employee"><Layout><MyResults /></Layout></ProtectedRoute>
          }/>

          {/* Admin хуудсууд */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>
          }/>
          <Route path="/admin/courses" element={
            <ProtectedRoute role="admin"><Layout><AdminCourses /></Layout></ProtectedRoute>
          }/>
          <Route path="/admin/results" element={
            <ProtectedRoute role="admin"><Layout><AdminResults /></Layout></ProtectedRoute>
          }/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;