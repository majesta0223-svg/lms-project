// pages/CourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course,        setCourse]        = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [cRes, qRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/quiz/${id}`).catch(() => ({ data: { questions: [] } }))
        ]);
        setCourse(cRes.data.course);
        setQuestionCount(qRes.data.questions?.length || 0);
      } catch { navigate('/dashboard'); }
      finally  { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!course)  return null;

  return (
    <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button className="btn-back" onClick={() => navigate(-1)}>← Буцах</button>
      <div className="course-detail-card">
        <div className="course-detail-icon">📘</div>
        <h1>{course.title}</h1>
        <p className="course-detail-desc">{course.description}</p>
        <div className="course-info-grid">
          <div className="info-item"><span>⏱</span><div><strong>Хугацаа</strong><small>{course.duration}</small></div></div>
          <div className="info-item"><span>📂</span><div><strong>Ангилал</strong><small>{course.category}</small></div></div>
          <div className="info-item"><span>❓</span><div><strong>Асуулт</strong><small>{questionCount} ширхэг</small></div></div>
          <div className="info-item"><span>🎯</span><div><strong>Тэнцэх оноо</strong><small>80% ба дээш</small></div></div>
        </div>
        {questionCount > 0
          ? <button className="btn-primary btn-large btn-full" onClick={() => navigate(`/quiz/${id}`)}>▶ Тест Эхлүүлэх</button>
          : <div className="alert alert-info">ℹ️ Энэ курст одоогоор тест байхгүй байна</div>
        }
      </div>
    </div>
  );
};
export default CourseDetail;