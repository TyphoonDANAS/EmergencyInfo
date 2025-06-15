// 📄 middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// ✅ 토큰 인증 (모든 사용자)
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "토큰이 필요합니다." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role } 객체 저장
    next();
  } catch (err) {
    return res.status(403).json({ error: "토큰 검증 실패" });
  }
}

// ✅ 관리자 권한 검사
function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "관리자 권한이 필요합니다." });
  }
  next();
}

module.exports = {
  authenticateToken,
  authorizeAdmin
};
