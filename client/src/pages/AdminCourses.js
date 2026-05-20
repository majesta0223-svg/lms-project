// pages/AdminCourses.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminCourses = () => {
  const [courses,        setCourses]        = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes,        setQuizzes]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeTab,      setActiveTab]      = useState('courses');
  const [courseForm,     setCourseForm]     = useState({ title:'', description:'', duration:'1 цаг', category:'Програмчлал' });
  const [courseMsg,      setCourseMsg]      = useState('');
  const [courseLoading,  setCourseLoading]  = useState(false);
  const [quizForm,       setQuizForm]       = useState({ question:'', options:['','','',''], correctAnswer:0 });
  const [quizMsg,        setQuizMsg]        = useState('');
  const [quizLoading,    setQuizLoading]    = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try { const r = await api.get('/courses'); setCourses(r.data.courses); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchQuizzes = async (id) => {
    try { const r = await api.get(`/quiz/${id}`); setQuizzes(r.data.questions || []); }
    catch { setQuizzes([]); }
  };

  const selectCourse = (c) => { setSelectedCourse(c); setActiveTab('quiz'); fetchQuizzes(c._id); };

  const handleCreateCourse = async (e) => {
    e.preventDefault(); setCourseLoading(true); setCourseMsg('');
    try {
      await api.post('/courses', courseForm);
      setCourseMsg('✅ Курс амжилттай үүслээ!');
      setCourseForm({ title:'', description:'', duration:'1 цаг', category:'Програмчлал' });
      fetchCourses();
    } catch (err) { setCourseMsg('❌ ' + (err.response?.data?.message||'Алдаа')); }
    finally { setCourseLoading(false); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Устгах уу?')) return;
    await api.delete(`/courses/${id}`); fetchCourses();
    if (selectedCourse?._id === id) { setSelectedCourse(null); setActiveTab('courses'); }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault(); setQuizLoading(true); setQuizMsg('');
    try {
      await api.post('/quiz/add', { ...quizForm, courseId: selectedCourse._id });
      setQuizMsg('✅ Асуулт нэмэгдлээ!');
      setQuizForm({ question:'', options:['','','',''], correctAnswer:0 });
      fetchQuizzes(selectedCourse._id);
    } catch (err) { setQuizMsg('❌ ' + (err.response?.data?.message||'Алдаа')); }
    finally { setQuizLoading(false); }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Устгах уу?')) return;
    await api.delete(`/quiz/${id}`); fetchQuizzes(selectedCourse._id);
  };

  const setOption = (i, v) => {
    const o = [...quizForm.options]; o[i] = v; setQuizForm({ ...quizForm, options: o });
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <h1>📚 Курс & Тест Удирдах</h1>

      <div className="tab-menu">
        <button className={`tab-btn ${activeTab==='courses'?'active':''}`}    onClick={()=>setActiveTab('courses')}>📚 Курсууд ({courses.length})</button>
        <button className={`tab-btn ${activeTab==='add-course'?'active':''}`} onClick={()=>setActiveTab('add-course')}>➕ Курс нэмэх</button>
        {selectedCourse && <button className={`tab-btn ${activeTab==='quiz'?'active':''}`} onClick={()=>setActiveTab('quiz')}>📝 {selectedCourse.title} тест</button>}
      </div>

      {/* Курсуудын жагсаалт */}
      {activeTab === 'courses' && (
        <div>
          <p style={{marginBottom:'1rem',color:'var(--text-secondary)'}}>Курс сонгоод тест асуулт нэмнэ үү</p>
          <div className="courses-grid">
            {courses.map(c => (
              <div key={c._id} className="course-card">
                <h3>{c.title}</h3><p>{c.description}</p>
                <div className="course-meta"><span>⏱ {c.duration}</span><span>📂 {c.category}</span></div>
                <div className="course-actions">
                  <button className="btn-primary"  onClick={()=>selectCourse(c)}>📝 Тест удирдах</button>
                  <button className="btn-danger"   onClick={()=>deleteCourse(c._id)}>🗑 Устгах</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Курс нэмэх */}
      {activeTab === 'add-course' && (
        <div className="form-card">
          <h3>➕ Шинэ Курс Нэмэх</h3>
          {courseMsg && <div className={`alert ${courseMsg.startsWith('✅')?'alert-success':'alert-error'}`}>{courseMsg}</div>}
          <form onSubmit={handleCreateCourse}>
            <div className="form-group"><label>Курсын нэр</label><input value={courseForm.title} onChange={e=>setCourseForm({...courseForm,title:e.target.value})} placeholder="JavaScript Суурь" required /></div>
            <div className="form-group"><label>Тайлбар</label><textarea value={courseForm.description} onChange={e=>setCourseForm({...courseForm,description:e.target.value})} placeholder="Курсын тухай..." rows={3} required /></div>
            <div className="form-row">
              <div className="form-group"><label>Хугацаа</label><input value={courseForm.duration} onChange={e=>setCourseForm({...courseForm,duration:e.target.value})} placeholder="2 цаг" /></div>
              <div className="form-group"><label>Ангилал</label>
                <select value={courseForm.category} onChange={e=>setCourseForm({...courseForm,category:e.target.value})}>
                  <option>Програмчлал</option><option>Мэдээллийн сан</option><option>Дизайн</option><option>Менежмент</option><option>Ерөнхий</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={courseLoading}>{courseLoading?'⏳...':'✅ Курс үүсгэх'}</button>
          </form>
        </div>
      )}

      {/* Тест удирдах */}
      {activeTab === 'quiz' && selectedCourse && (
        <div>
          <h3 style={{marginBottom:'1rem'}}>📝 {selectedCourse.title} — Асуултууд</h3>
          <div className="quiz-list">
            {quizzes.length === 0
              ? <div className="empty-state"><p>📭 Асуулт байхгүй. Доороос нэмнэ үү.</p></div>
              : quizzes.map((q,i) => (
                <div key={q._id} className="quiz-item">
                  <div className="quiz-item-header">
                    <span>{i+1}. {q.question}</span>
                    <button className="btn-danger-sm" onClick={()=>deleteQuiz(q._id)}>🗑</button>
                  </div>
                  <div className="quiz-options">
                    {q.options?.map((opt,j) => <span key={j} className="quiz-option">{['A','B','C','D'][j]}. {opt}</span>)}
                  </div>
                </div>
              ))
            }
          </div>

          <div className="form-card" style={{marginTop:'2rem'}}>
            <h3>➕ Шинэ Асуулт Нэмэх</h3>
            {quizMsg && <div className={`alert ${quizMsg.startsWith('✅')?'alert-success':'alert-error'}`}>{quizMsg}</div>}
            <form onSubmit={handleAddQuiz}>
              <div className="form-group"><label>Асуулт</label><input value={quizForm.question} onChange={e=>setQuizForm({...quizForm,question:e.target.value})} placeholder="Асуультаа бичнэ үү..." required /></div>
              <div className="options-form">
                <label>4 сонголт оруулна уу (зөв хариултын дэргэдүүр "Зөв" сонгоно):</label>
                {quizForm.options.map((opt,i) => (
                  <div key={i} className="option-input-row">
                    <span className={`option-letter-input ${quizForm.correctAnswer===i?'correct':''}`}>{['A','B','C','D'][i]}</span>
                    <input value={opt} onChange={e=>setOption(i,e.target.value)} placeholder={`${i+1}-р сонголт`} required />
                    <label className="radio-label">
                      <input type="radio" name="correct" checked={quizForm.correctAnswer===i} onChange={()=>setQuizForm({...quizForm,correctAnswer:i})} /> Зөв
                    </label>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary" disabled={quizLoading}>{quizLoading?'⏳...':'✅ Асуулт нэмэх'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCourses;