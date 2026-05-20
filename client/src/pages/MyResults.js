// pages/MyResults.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/results/my')
      .then(res => setResults(res.data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const passCount = results.filter(r => r.status === 'PASS').length;
  const avgScore  = results.length > 0 ? Math.round(results.reduce((s,r) => s + r.score, 0) / results.length) : 0;

  return (
    <div className="page-container">
      <h1>📊 Миний Тестийн Түүх</h1>
      <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
        <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-number">{results.length}</div><div className="stat-label">Нийт тест</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-number">{passCount}</div><div className="stat-label">Тэнцсэн</div></div>
        <div className="stat-card"><div className="stat-icon">❌</div><div className="stat-number">{results.length - passCount}</div><div className="stat-label">Тэнцээгүй</div></div>
        <div className="stat-card"><div className="stat-icon">📈</div><div className="stat-number">{avgScore}%</div><div className="stat-label">Дундаж</div></div>
      </div>
      {results.length === 0
        ? <div className="empty-state"><p>📭 Тест өгсөн түүх байхгүй байна</p></div>
        : (
          <div className="results-list" style={{ marginTop:'1.5rem' }}>
            {results.map(r => (
              <div key={r._id} className={`result-item ${r.status === 'PASS' ? 'pass' : 'fail'}`}>
                <div className="result-item-header">
                  <h3>{r.courseId?.title || 'Курс'}</h3>
                  <span className={`badge ${r.status==='PASS'?'badge-pass':'badge-fail'}`}>{r.status}</span>
                </div>
                <div className="result-item-stats">
                  <span>🎯 Оноо: <strong>{r.score}%</strong></span>
                  <span>✅ Зөв: {r.correctCount}</span>
                  <span>❌ Буруу: {r.wrongCount}</span>
                  <span>📅 {new Date(r.submittedAt).toLocaleDateString('mn-MN')}</span>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};
export default MyResults;