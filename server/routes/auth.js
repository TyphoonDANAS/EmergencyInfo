const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const USERS = [
  { username: 'admin', password: '1234' }, // 임시 사용자
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }

  const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
