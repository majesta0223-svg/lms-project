// seed.js
// Туршилтын өгөгдөл оруулах
// Ажиллуулах: node seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User   = require('./models/User');
const Course = require('./models/Course');
const Quiz   = require('./models/Quiz');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB холбогдлоо...');

  // Өмнөх өгөгдлийг устгана
  await User.deleteMany({});
  await Course.deleteMany({});
  await Quiz.deleteMany({});

  // Admin үүсгэнэ
  const admin = await User.create({
    name: 'Бат-Эрдэнэ', email: 'admin@lms.mn', password: 'admin123', role: 'admin'
  });

  // Ажилтнууд үүсгэнэ
  await User.create({ name: 'Дулмаа', email: 'dulma@lms.mn', password: 'dulma123', role: 'employee' });
  await User.create({ name: 'Болд',   email: 'bold@lms.mn',  password: 'bold123',  role: 'employee' });
  console.log('✅ Хэрэглэгчид үүслээ');

  // Курсууд үүсгэнэ
  const c1 = await Course.create({
    title: 'JavaScript Суурь',
    description: 'JavaScript програмчлалын хэлний үндсэн ойлголтууд — хувьсагч, функц, давталт.',
    duration: '2 цаг', category: 'Програмчлал', createdBy: admin._id
  });
  const c2 = await Course.create({
    title: 'React Хүрээ',
    description: 'React JS ашиглан web хуудас хийх — Component, State, Props.',
    duration: '3 цаг', category: 'Програмчлал', createdBy: admin._id
  });
  console.log('✅ Курсууд үүслээ');

  // JavaScript тестийн асуултууд
  await Quiz.insertMany([
    { courseId: c1._id, question: 'JavaScript-д хувьсагч зарлахад ямар үгийг хэрэглэдэг вэ?', options: ['var, let, const', 'int, float, string', 'make, set, define', 'x, y, z'], correctAnswer: 0 },
    { courseId: c1._id, question: 'console.log(typeof "hello") — гэвэл юу гарах вэ?', options: ['number', 'string', 'object', 'boolean'], correctAnswer: 1 },
    { courseId: c1._id, question: 'JavaScript-д массив хэрхэн үүсгэдэг вэ?', options: ['let a = ()', 'let a = {}', 'let a = []', 'let a = <>'], correctAnswer: 2 },
    { courseId: c1._id, question: 'for давталтын зөв бичиглэл аль нь вэ?', options: ['for (let i=0; i<5; i++)', 'for i = 0 to 5', 'loop(5)', 'repeat 5'], correctAnswer: 0 },
    { courseId: c1._id, question: '== болон === ялгаа юу вэ?', options: ['Ялгаа байхгүй', '== утга, === утга+төрөл шалгана', '=== удаан ажиллана', '== шинэ хувилбар'], correctAnswer: 1 },
  ]);

  // React тестийн асуултууд
  await Quiz.insertMany([
    { courseId: c2._id, question: 'React-д component гэж юу вэ?', options: ['CSS файл', 'Дахин ашиглах UI хэсэг', 'Database', 'URL хаяг'], correctAnswer: 1 },
    { courseId: c2._id, question: 'useState юунд хэрэглэдэг вэ?', options: ['CSS тохируулах', 'URL өөрчлөх', 'Компонентийн өгөгдөл удирдах', 'Зураг нэмэх'], correctAnswer: 2 },
    { courseId: c2._id, question: 'Props гэж юу вэ?', options: ['Компонентод дамжуулах өгөгдөл', 'CSS загвар', 'Database холболт', 'JavaScript функц'], correctAnswer: 0 },
    { courseId: c2._id, question: 'JSX гэж юу вэ?', options: ['Шинэ хэл', 'JS + HTML хосолсон синтакс', 'CSS хүрээ', 'Database хэл'], correctAnswer: 1 },
    { courseId: c2._id, question: 'useEffect хэзээ ажилладаг вэ?', options: ['Зөвхөн click дарахад', 'Render болохад ба dependency өөрчлөгдөхөд', 'Хэзээ ч ажилладаггүй', 'Зөвхөн нэг удаа'], correctAnswer: 1 },
  ]);
  console.log('✅ Тест асуултууд үүслээ');

  console.log('\n🎉 Бэлэн боллоо!');
  console.log('Admin: admin@lms.mn / admin123');
  console.log('Ажилтан: dulma@lms.mn / dulma123');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });