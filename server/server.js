const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const ambulanceRouter = require('./routes/ambulance');
const firstaidRouter = require('./routes/firstaid');
const statusRouter = require('./routes/status');
const app = express();

app.use(cors());
app.use(express.json());


// API 라우터
console.log('📦 /api/ambulance 등록 시도');
app.use('/api/ambulance', ambulanceRouter);
app.use('/api/firstaid', firstaidRouter);
app.use('/api/auth', authRouter);
app.use('/api/status', statusRouter);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚑 서버 실행 중: http://localhost:${PORT}`);
});
