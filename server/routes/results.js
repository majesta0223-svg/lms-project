// routes/results.js
// Тестийн үр дүнгийн API

const express = require('express');
const Result = require('../models/Result');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/results/my — Өөрийн үр дүн (employee)
router.get('/my', protect, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate('courseId', 'title description')
      .sort({ submittedAt: -1 });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// GET /api/results — Бүх үр дүн (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ submittedAt: -1 });

    // Статистик тооцоолол
    const totalResults = results.length;
    const passCount  = results.filter(r => r.status === 'PASS').length;
    const failCount  = results.filter(r => r.status === 'FAIL').length;
    const avgScore   = totalResults > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / totalResults)
      : 0;

    res.json({ results, stats: { totalResults, passCount, failCount, avgScore } });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

module.exports = router;