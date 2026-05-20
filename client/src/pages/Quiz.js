// pages/Quiz.js — Тест өгөх хуудас (таймертай)
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const QUIZ_TIME = 10 * 60; // 10 минут

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions,  setQuestions]  = useState([]);
  const [course,     setCourse]     = useState(null);
  const [answers,    setAnswers]    = useState({});
  const [currentQ,   setCurrentQ]   = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(QUIZ_TIME);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started,    setStarted]    = useState(false);
  const [startTime,  setStartTime]  = useState(null);

  const submitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : QUIZ_TIME;
      const answersArray = questions.map(q => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] ?? -1
      }));
      const res = await api.post('/quiz/submit', { courseId, answers: answersArray, timeTaken });
      navigate('/result', { state: { result: res.data.result, courseTitle: course?.title } });
    } catch (err) {
      alert('Тест илгээхэд алдаа: ' + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  }, [answers, questions, courseId, course, navigate, submitting, startTime]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, qRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/quiz/${courseId}`)
        ]);
        setCourse(cRes.data.course);
        setQuestions(qRes.data.questions);
      } catch { alert('Тест ачааллахад алдаа гарлаа'); navigate('/dashboard'); }
      finally  { setLoading(false); }
    };
    load();
  }, [courseId, navigate]);

  useEffect(() => {
    if (!started || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); submitQuiz(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitting, submitQuiz]);

  const formatTime = (s) =>
    `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Тест ачааллаж байна...</p></div>;

  if (!started) return (
    <div className="quiz-start-screen">
      <div className="quiz-start-card">
        <div className="quiz-start-icon">📝</div>
        <h2>{course?.title}</h2>
        <p>Эхлэхийн өмнө уншина уу:</p>
        <ul>
          <li>📋 Нийт {questions.length} асуулт</li>
          <li>⏱ Хугацаа: 10 минут</li>
          <li>🎯 Тэнцэх оноо: 80% ба дээш</li>
          <li>⚠️ Хугацаа дуусвал автоматаар илгээгдэнэ</li>
        </ul>
        <button className="btn-primary btn-large" onClick={() => { setStarted(true); setStartTime(Date.now()); }}>
          ▶ Тест Эхлүүлэх
        </button>
      </div>
    </div>
  );

  const question  = questions[currentQ];
  const answered  = Object.keys(answers).length;
  const progress  = questions.length > 0 ? (answered / questions.length) * 100 : 0;
  const isDanger  = timeLeft < 60;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="quiz-info">
          <span>{course?.title}</span>
          <span>{currentQ + 1} / {questions.length}</span>
        </div>
        <div className={`quiz-timer ${isDanger ? 'danger' : ''}`}>⏱ {formatTime(timeLeft)}</div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">{answered} / {questions.length} хариулсан</p>

      <div className="question-card">
        <div className="question-number">Асуулт {currentQ + 1}</div>
        <h3 className="question-text">{question?.question}</h3>
        <div className="options-grid">
          {question?.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${answers[question._id] === i ? 'selected' : ''}`}
              onClick={() => setAnswers(prev => ({ ...prev, [question._id]: i }))}
            >
              <span className="option-letter">{['A','B','C','D'][i]}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button className="btn-secondary" onClick={() => setCurrentQ(p => Math.max(0,p-1))} disabled={currentQ===0}>← Өмнөх</button>
        <div className="question-dots">
          {questions.map((q,i) => (
            <button key={i} className={`dot ${i===currentQ?'active':''} ${answers[q._id]!==undefined?'answered':''}`} onClick={() => setCurrentQ(i)}>{i+1}</button>
          ))}
        </div>
        {currentQ < questions.length - 1
          ? <button className="btn-primary" onClick={() => setCurrentQ(p => p+1)}>Дараах →</button>
          : <button className="btn-submit" onClick={submitQuiz} disabled={submitting}>{submitting ? '⏳ Илгээж байна...' : '✅ Тест илгээх'}</button>
        }
      </div>
    </div>
  );
};
export default Quiz;