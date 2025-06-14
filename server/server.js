const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const ambulanceRouter = require('./routes/ambulance');
const firstaidRouter = require('./routes/firstaid');
const authRouter = require('./routes/auth');
const statusRouter = require('./routes/status');
const voicechatRouter = require('./routes/voicechat');

const app = express();

// ✅ 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔹 form 데이터 대비 추가

// ✅ API 라우터
console.log('📦 /api/ambulance 등록 시도');
app.use('/api/ambulance', ambulanceRouter);
app.use('/api/firstaid', firstaidRouter);
app.use('/api/auth', authRouter);
app.use('/api/status', statusRouter);
app.use('/api/voicechat', voicechatRouter);

// ✅ 정적 파일 제공
app.use(express.static(path.join(__dirname, '../public')));

// ✅ 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚑 서버 실행 중: http://localhost:${PORT}`);
});
