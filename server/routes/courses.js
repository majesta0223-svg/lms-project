// routes/courses.js
// Курсын API

const express = require('express');
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses — Бүх курс авах
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// GET /api/courses/:id — Нэг курс авах
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name');
    if (!course) return res.status(404).json({ message: 'Курс олдсонгүй' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// POST /api/courses — Курс үүсгэх (зөвхөн admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Нэр болон тайлбарыг оруулна уу' });
    }
    const course = await Course.create({
      title, description,
      duration: duration || '1 цаг',
      category: category || 'Ерөнхий',
      createdBy: req.user._id
    });
    res.status(201).json({ message: 'Курс үүслээ', course });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

// DELETE /api/courses/:id — Курс устгах (зөвхөн admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Курс устгагдлаа' });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});

module.exports = router;