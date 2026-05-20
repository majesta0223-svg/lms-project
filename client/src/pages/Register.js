// pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirm:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return setError('Нууц үг таарахгүй байна');
    if (formData.password.length < 6) return setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: formData.name, email: formData.email, password: formData.password
      });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Бүртгүүлэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">📝</div>
          <h1>LMS Систем</h1>
          <p>Шинэ бүртгэл үүсгэх</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Бүтэн нэр</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Таны нэр" required />
          </div>
          <div className="form-group">
            <label>Имэйл хаяг</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.mn" required />
          </div>
          <div className="form-group">
            <label>Нууц үг</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Хамгийн багадаа 6 тэмдэгт" required />
          </div>
          <div className="form-group">
            <label>Нууц үг давтах</label>
            <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} placeholder="Дахин оруулна уу" required />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : 'Бүртгүүлэх'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Бүртгэл байна уу? <Link to="/login">Нэвтрэх</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Register;