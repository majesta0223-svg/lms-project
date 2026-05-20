// routes/auth.js
// Бүртгэл болон нэвтрэх API

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// JWT токен үүсгэх туслах функц
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // Токенд хэрэглэгчийн ID хийнэ
    process.env.JWT_SECRET,          // Нууц түлхүүр (.env-с авна)
    { expiresIn: '7d' }              // 7 хоногийн дараа хүчингүй болно
  );
};

// ─────────────────────────────────────────
// POST /api/auth/register — Бүртгүүлэх
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Бүх талбарыг бөглөнө үү' });
    }

    // Имэйл давхардсан эсэх шалгана
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Имэйл аль хэдийн бүртгэгдсэн байна' });
    }

    // Хэрэглэгч үүсгэнэ (нууц үг User model дотор автоматаар шифрлэгдэнэ)
    const user = await User.create({ name, email, password, role: 'employee' });

    res.status(201).json({
      message: 'Бүртгэл амжилттай',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа', error: error.message });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login — Нэвтрэх
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Имэйл болон нууц үгийг оруулна уу' });
    }

    // Хэрэглэгч хайна
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Имэйл эсвэл нууц үг буруу байна' });
    }

    // Нууц үг шалгана
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Имэйл эсвэл нууц үг буруу байна' });
    }

    res.json({
      message: 'Нэвтрэлт амжилттай',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Серверийн алдаа', error: error.message });
  }
});

module.exports = router;