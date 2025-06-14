const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

// OpenAI 초기화
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📁 서버 내부 temp_audio 폴더로 업로드 설정
const upload = multer({ dest: path.join(__dirname, "../temp_audio") });

router.post("/", upload.single("audio"), async (req, res) => {
  const originalPath = path.resolve(req.file.path);           // 예: server/temp_audio/abcd1234
  const newPath = originalPath + ".webm";                      // 예: server/temp_audio/abcd1234.webm

  try {
    // 확장자 붙여 저장
    fs.renameSync(originalPath, newPath);

    // 1️⃣ Whisper API로 음성 → 텍스트
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(newPath),
      model: "whisper-1",
      language: "ko", // 한국어
    });

    const userText = transcription.text;
    console.log("🎤 사용자 음성 인식:", userText);

    // 2️⃣ GPT-4o-mini 응답 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "너는 응급 지원 도우미야. 친절하고 간결하게 대답해줘." },
        { role: "user", content: userText },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("❌ GPT 음성 처리 실패:", err);
    res.status(500).json({ error: "음성 처리 중 오류가 발생했습니다." });
  } finally {
    // 임시 파일 삭제 (.webm 확장자 포함된 경로)
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    }
  }
});

module.exports = router;
