// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats,         setStats]         = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, cRes] = await Promise.all([api.get('/results'), api.get('/courses')]);
        setStats({ ...rRes.data.stats, totalCourses: cRes.data.courses.length });
        setRecentResults(rRes.data.results.slice(0, 5));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const passRate = stats?.totalResults > 0 ? Math.round((stats.passCount / stats.totalResults) * 100) : 0;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div><h1>👑 Admin Хяналтын Самбар</h1><p>LMS системийн ерөнхий мэдээлэл</p></div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-number">{stats?.totalCourses||0}</div><div className="stat-label">Нийт курс</div></div>
        <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-number">{stats?.totalResults||0}</div><div className="stat-label">Нийт тест</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-number">{stats?.passCount||0}</div><div className="stat-label">Тэнцсэн</div></div>
        <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-number">{stats?.avgScore||0}%</div><div className="stat-label">Дундаж оноо</div></div>
      </div>

      <div className="chart-card">
        <h3>Тэнцэх хувь</h3>
        <div className="big-score" style={{ color: passRate >= 50 ? '#22c55e' : '#ef4444' }}>{passRate}%</div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width:`${passRate}%`, background: passRate>=50 ? '#22c55e' : '#ef4444' }}></div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'.5rem', fontSize:'.85rem', color:'var(--text-secondary)' }}>
          <span>✅ Тэнцсэн: {stats?.passCount}</span>
          <span>❌ Тэнцээгүй: {stats?.failCount}</span>
        </div>
      </div>

      <div className="admin-links">
        <Link to="/admin/courses" className="admin-link-card"><span>📚</span><h3>Курс Удирдах</h3><p>Курс нэмэх, тест үүсгэх</p></Link>
        <Link to="/admin/results" className="admin-link-card"><span>📊</span><h3>Үр Дүн Харах</h3><p>Бүх ажилтны оноо</p></Link>
      </div>

      <div className="recent-section">
        <h3>🕐 Сүүлийн тестүүд</h3>
        {recentResults.map(r => (
          <div key={r._id} className={`result-item ${r.status==='PASS'?'pass':'fail'}`}>
            <div className="result-item-header">
              <span>{r.userId?.name} — {r.courseId?.title}</span>
              <span className={`badge ${r.status==='PASS'?'badge-pass':'badge-fail'}`}>{r.status}</span>
            </div>
            <div className="result-item-stats">
              <span>🎯 {r.score}%</span>
              <span>✅ {r.correctCount} зөв</span>
              <span>📅 {new Date(r.submittedAt).toLocaleDateString('mn-MN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminDashboard;