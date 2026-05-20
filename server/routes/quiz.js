// routes/quiz.js
// Тестийн API + Оноо тооцоолол

const express = require('express');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/quiz/add — Асуулт нэмэх (admin) — submit-с ӨМНӨ байх ёстой
router.post('/add', protect, adminOnly, async (req, res) => {
  try {
    const { courseId, question, options, correctAnswer } = req.body;
    if (!courseId || !question || !options || correctAnswer === undefined) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү' });
    }
    if (options.length !== 4) {
      return res.status(400).json({ message: '4 сонголт оруулна уу' });
    }
    const quiz = await Quiz.create({ courseId, question, options, correctAnswer });
    res.status(201).json({ message: 'Асуулт нэмэгдлээ', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// POST /api/quiz/submit — Тест илгээх, оноо тооцоолох
router.post('/submit', protect, async (req, res) => {
  try {
    const { courseId, answers, timeTaken } = req.body;

    // Бүх асуулт + зөв хариултыг database-с авна
    const questions = await Quiz.find({ courseId });
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Асуулт олдсонгүй' });
    }

    // ─── ОНОО ТООЦООЛОХ ───
    // Жишээ: 5 асуулт, 4 зөв = (4/5)*100 = 80% = PASS
    let correctCount = 0;
    const detailedAnswers = [];

    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) correctCount++;
        detailedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        });
      }
    });

    const wrongCount = questions.length - correctCount;
    const score = Math.round((correctCount / questions.length) * 100);
    const status = score >= 80 ? 'PASS' : 'FAIL'; // 80%+ = PASS

    // Үр дүнг хадгална
    const result = await Result.create({
      userId: req.user._id,
      courseId,
      answers: detailedAnswers,
      score,
      correctCount,
      wrongCount,
      status,
      timeTaken: timeTaken || 0
    });

    res.status(201).json({
      message: 'Тест илгээгдлээ',
      result: { score, correctCount, wrongCount, total: questions.length, status, resultId: result._id }
    });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа', error: error.message });
  }
});

// GET /api/quiz/:courseId — Тестийн асуултууд авах
router.get('/:courseId', protect, async (req, res) => {
  try {
    const questions = await Quiz.find({ courseId: req.params.courseId });
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Тест байхгүй байна' });
    }
    // correctAnswer-г хэрэглэгчид ХАРУУЛАХГҮЙ!
    const safe = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));
    res.json({ questions: safe, total: questions.length });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// DELETE /api/quiz/:id — Асуулт устгах (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Асуулт устгагдлаа' });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

module.exports = router;