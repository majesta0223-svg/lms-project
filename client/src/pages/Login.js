// pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Нэвтрэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🎓</div>
          <h1>LMS Систем</h1>
          <p>Нэвтрэх</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имэйл хаяг</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="email@example.mn" required />
          </div>
          <div className="form-group">
            <label>Нууц үг</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Нууц үгийг оруулна уу" required />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : 'Нэвтрэх'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Бүртгэл байхгүй юу? <Link to="/register">Бүртгүүлэх</Link></p>
        </div>
        <div className="demo-info">
          <p>🧪 Туршилтын нэвтрэлт:</p>
          <p>Admin: admin@lms.mn / admin123</p>
          <p>Ажилтан: dulma@lms.mn / dulma123</p>
        </div>
      </div>
    </div>
  );
};
export default Login;