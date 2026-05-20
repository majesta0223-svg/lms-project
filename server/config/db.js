// config/db.js
// MongoDB-тэй холбогдох код

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // .env файлаас MONGODB_URI авч холбогдоно
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB холбогдлоо: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB алдаа: ${error.message}`);
    process.exit(1); // Алдаа гарвал програм зогсоно
  }
};

module.exports = connectDB;