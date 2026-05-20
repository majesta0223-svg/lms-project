// middleware/auth.js
// JWT токен шалгах "хаалт"
// Нэвтрээгүй хүн хамгаалагдсан хуудсанд орж чадахгүй

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Токен шалгах middleware
const protect = async (req, res, next) => {
  let token;

  // Request header-с токен авна
  // Header ийм харагдана: Authorization: "Bearer eyJhbGc..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // "Bearer " хэсгийг хасна

      // Токенийг тайлж хэрэглэгчийн ID авна
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Database-с хэрэглэгч хайна (нууц үггүй)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Дараагийн алхам руу үргэлжлүүлнэ
    } catch (error) {
      return res.status(401).json({ message: 'Токен хүчингүй байна' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Нэвтрэх шаардлагатай' });
  }
};

// Admin эрх шалгах
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin эрх шаардлагатай' });
  }
};

module.exports = { protect, adminOnly };