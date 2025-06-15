// 📄 server/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

// ✅ 회원가입
router.post("/signup", async (req, res) => {
  const { userId, password, role } = req.body;

  if (!userId || !password)
    return res.status(400).json({ error: "아이디와 비밀번호를 입력하세요." });

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE user_id = $1",
      [userId]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ error: "이미 존재하는 아이디입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    await pool.query(
      "INSERT INTO users (user_id, password, role) VALUES ($1, $2, $3)",
      [userId, hashedPassword, userRole]
    );

    res.status(201).json({ message: "회원가입 성공" });
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// ✅ 로그인
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: "아이디와 비밀번호를 입력하세요." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "존재하지 않는 사용자입니다." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // ✅ role을 토큰과 응답에 포함
    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, // ← 토큰에도 role 포함
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      userId: user.user_id,
      role: user.role // ✅ 클라이언트 저장용
    });
  } catch (err) {
    console.error("로그인 실패:", err);
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
  }
});

module.exports = router;
