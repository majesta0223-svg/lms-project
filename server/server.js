// server.js
// ЭНЭ БОЛ СЕРВЕРИЙН ҮНД ФАЙЛ — ЭНД ЭХЭЛНЭ

const express = require('express');      // Web сервер хийх tool
const cors = require('cors');            // Frontend-с холбогдохыг зөвшөөрөх
const dotenv = require('dotenv');        // .env файл унших
const connectDB = require('./config/db'); // MongoDB холболт

// .env файлыг уншина
dotenv.config();

// Express app үүсгэнэ
const app = express();

// ============================
// MIDDLEWARE — хүсэлт ирэх бүрт ажилладаг код
// ============================

// Frontend (localhost:3000) → Backend (localhost:5000) холбогдохыг зөвшөөрнө
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// JSON өгөгдлийг уншиж чадна болгоно
app.use(express.json());

// ============================
// DATABASE ХОЛБОЛТ
// ============================
connectDB();

// ============================
// API ROUTES — URL хаягуудыг бүртгэнэ
// ============================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/results', require('./routes/results'));

// Тест хуудас — сервер ажиллаж байгаа эсэхийг шалгана
app.get('/', (req, res) => {
  res.json({ message: '🎓 LMS сервер ажиллаж байна!' });
});

// ============================
// СЕРВЕР ЭХЛҮҮЛЭХ
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер http://localhost:${PORT} дээр ажиллаж байна`);
});