const recordBtn = document.getElementById("voicechat-btn");
let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener("click", async () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    // 🎤 음성 녹음 시작
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");

      try {
        const response = await fetch("/api/voicechat", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        alert("🤖 챗봇 응답: " + result.reply);
      } catch (err) {
        console.error("음성 전송 실패:", err);
        alert("서버 오류로 챗봇 응답을 받을 수 없습니다.");
      }
    };

    mediaRecorder.start();
    recordBtn.textContent = "🎙 녹음 중... 클릭 시 중지";
  } else {
    // ⏹ 녹음 종료
    mediaRecorder.stop();
    recordBtn.textContent = "음성 챗봇";
  }
});
