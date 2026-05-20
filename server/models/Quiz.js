// models/Quiz.js
// Тестийн асуултуудын бүтэц

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Асуулт шаардлагатай']
  },
  options: {
    type: [String],    // 4 сонголтын array: ['A утга', 'B утга', 'C утга', 'D утга']
    validate: {
      validator: (arr) => arr.length === 4,
      message: 'Яг 4 сонголт байх ёстой'
    }
  },
  correctAnswer: {
    type: Number,      // 0=A, 1=B, 2=C, 3=D
    required: true,
    min: 0,
    max: 3
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);