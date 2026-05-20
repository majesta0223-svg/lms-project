// pages/Result.js
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { result, courseTitle } = location.state || {};

  if (!result) { navigate('/dashboard'); return null; }

  const isPassed   = result.status === 'PASS';
  const scoreColor = isPassed ? '#22c55e' : '#ef4444';

  return (
    <div className="result-page">
      <div className="result-card">
        <div className="result-icon">{isPassed ? '🏆' : '😔'}</div>
        <h2 className="result-title">{isPassed ? 'Баяр хүргэе! Тэнцлээ!' : 'Тэнцээгүй байна'}</h2>
        <p className="result-course">{courseTitle}</p>

        <div className="score-display" style={{ color: scoreColor }}>
          <span className="score-number">{result.score}%</span>
          <span className={`score-badge ${isPassed ? 'pass' : 'fail'}`}>{result.status}</span>
        </div>

        <div className="result-details">
          <div className="result-stat"><span className="stat-icon">📋</span><span>Нийт асуулт</span><span className="stat-value">{result.total}</span></div>
          <div className="result-stat"><span className="stat-icon">✅</span><span>Зөв хариулт</span><span className="stat-value correct">{result.correctCount}</span></div>
          <div className="result-stat"><span className="stat-icon">❌</span><span>Буруу хариулт</span><span className="stat-value wrong">{result.wrongCount}</span></div>
        </div>

        <div className="pass-info">
          <div className="pass-bar-container">
            <div className="pass-bar" style={{ width:`${result.score}%`, background: scoreColor }}></div>
          </div>
          <p>{isPassed ? '✅ 80%-с дээш — тэнцлээ!' : '⚠️ 80%-с доош — дахин оролдоно уу'}</p>
        </div>

        <div className="result-actions">
          <Link to="/dashboard"    className="btn-primary">🏠 Нүүр хуудас</Link>
          <Link to="/my-results"   className="btn-secondary">📊 Миний үр дүн</Link>
        </div>
      </div>
    </div>
  );
};
export default Result;