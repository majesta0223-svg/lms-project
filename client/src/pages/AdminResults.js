// pages/AdminResults.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    api.get('/results')
      .then(r => { setResults(r.data.results); setStats(r.data.stats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const filtered = results.filter(r => {
    const okStatus = filter === 'all' || r.status === filter;
    const okName   = !search || r.userId?.name?.toLowerCase().includes(search.toLowerCase());
    return okStatus && okName;
  });

  return (
    <div className="page-container">
      <h1>📋 Бүх Ажилтны Үр Дүн</h1>
      <div className="stats-grid" style={{marginTop:'1.5rem'}}>
        <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-number">{stats?.totalResults}</div><div className="stat-label">Нийт тест</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-number">{stats?.passCount}</div><div className="stat-label">Тэнцсэн</div></div>
        <div className="stat-card"><div className="stat-icon">❌</div><div className="stat-number">{stats?.failCount}</div><div className="stat-label">Тэнцээгүй</div></div>
        <div className="stat-card"><div className="stat-icon">📈</div><div className="stat-number">{stats?.avgScore}%</div><div className="stat-label">Дундаж</div></div>
      </div>

      <div className="filter-section">
        <input className="search-input" placeholder="Ажилтны нэрээр хайх..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="filter-buttons">
          {['all','PASS','FAIL'].map(f => (
            <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f==='all'?'Бүгд':f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><p>📭 Үр дүн олдсонгүй</p></div>
        : (
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr><th>Ажилтан</th><th>Курс</th><th>Оноо</th><th>Зөв/Буруу</th><th>Статус</th><th>Огноо</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div className="user-cell">
                        <span>👤</span>
                        <div><strong>{r.userId?.name}</strong><small>{r.userId?.email}</small></div>
                      </div>
                    </td>
                    <td>{r.courseId?.title}</td>
                    <td><span className="score-pill" style={{color:r.score>=80?'#22c55e':'#ef4444'}}>{r.score}%</span></td>
                    <td>✅{r.correctCount} / ❌{r.wrongCount}</td>
                    <td><span className={`badge ${r.status==='PASS'?'badge-pass':'badge-fail'}`}>{r.status}</span></td>
                    <td>{new Date(r.submittedAt).toLocaleDateString('mn-MN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};
export default AdminResults;