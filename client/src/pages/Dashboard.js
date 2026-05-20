// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses,    setCourses]    = useState([]);
  const [results,    setResults]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, rRes] = await Promise.all([
          api.get('/courses'),
          api.get('/results/my')
        ]);
        setCourses(cRes.data.courses);
        setResults(rRes.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResult = (courseId) =>
    results.find(r => r.courseId?._id === courseId || r.courseId === courseId);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Ачааллаж байна...</p></div>;

  const passCount = results.filter(r => r.status === 'PASS').length;
  const avgScore  = results.length > 0 ? Math.round(results.reduce((s,r) => s + r.score, 0) / results.length) : 0;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Сайн байна уу, {user?.name}! 👋</h1>
          <p>Өнөөдөр юу сурах вэ?</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-number">{courses.length}</div><div className="stat-label">Нийт курс</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-number">{results.length}</div><div className="stat-label">Өгсөн тест</div></div>
        <div className="stat-card"><div className="stat-icon">🏆</div><div className="stat-number">{passCount}</div><div className="stat-label">Тэнцсэн</div></div>
        <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-number">{avgScore}%</div><div className="stat-label">Дундаж оноо</div></div>
      </div>

      <div className="search-section">
        <h2>📖 Боломжит курсууд</h2>
        <input className="search-input" placeholder="Курс хайх..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><p>🔍 Курс олдсонгүй</p></div>
        : (
          <div className="courses-grid">
            {filtered.map(course => {
              const result = getResult(course._id);
              return (
                <div key={course._id} className="course-card">
                  <div className="course-icon">📘</div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span>⏱ {course.duration}</span>
                    <span>📂 {course.category}</span>
                  </div>
                  {result && (
                    <div className={`result-badge ${result.status === 'PASS' ? 'pass' : 'fail'}`}>
                      {result.status === 'PASS' ? '✅ Тэнцсэн' : '❌ Тэнцээгүй'} — {result.score}%
                    </div>
                  )}
                  <div className="course-actions">
                    <Link to={`/courses/${course._id}`} className="btn-primary">
                      {result ? '🔄 Дахин өгөх' : '▶ Тест эхлүүлэх'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
};
export default Dashboard;