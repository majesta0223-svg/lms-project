// models/Course.js
// Курсын мэдээллийн бүтэц

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Курсын нэр шаардлагатай'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Тайлбар шаардлагатай']
  },
  duration: {
    type: String,
    default: '1 цаг'
  },
  category: {
    type: String,
    default: 'Ерөнхий'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User model-тэй холбоно
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);