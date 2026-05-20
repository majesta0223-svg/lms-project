// models/Result.js
// Тестийн үр дүнгийн бүтэц

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  answers: [{
    questionId: String,       // Асуултын ID
    selectedAnswer: Number,   // Хэрэглэгчийн сонгосон (0-3)
    isCorrect: Boolean        // Зөв эсэх
  }],
  score: {
    type: Number,             // Хувиар: 0-100
    required: true
  },
  correctCount: { type: Number, default: 0 },
  wrongCount:   { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['PASS', 'FAIL'],   // 80%+ = PASS
    required: true
  },
  timeTaken: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);