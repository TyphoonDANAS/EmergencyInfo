console.log("📸 AR 실시간 부상 스캔 초기화됨");

async function loadModel() {
  try {
    const model = await tf.loadGraphModel("https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_140_224/classification/4/default/1", { fromTFHub: true });
    console.log("✅ 모델 로드 완료");
    return model;
  } catch (error) {
    console.error("❌ 모델 로드 실패:", error);
    alert("모델 로드에 실패했습니다.");
  }
}

async function classifyImage(model, imageElement) {
  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();
  
  const prediction = await model.predict(tensor).data();
  const topClass = prediction.indexOf(Math.max(...prediction));
  console.log("🔍 추정 클래스 인덱스:", topClass);

  // 데모용 클래스 해석 (실제는 사용자 정의가 필요)
  const message = topClass === 123 ? "근육 손상 의심" : "정상 또는 기타 부상";

  document.getElementById("ar-result").innerText = `분석 결과: ${message}`;
}

// 📸 카메라 스트리밍 시작
async function startCameraAndScan() {
  const video = document.getElementById("camera-stream");
  const resultBox = document.getElementById("ar-result");
  resultBox.innerText = "카메라 로드 중...";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await new Promise(resolve => video.onloadedmetadata = resolve);

    const model = await loadModel();
    resultBox.innerText = "분석 중...";

    setTimeout(() => classifyImage(model, video), 3000); // 3초 후 분석 시작 (데모용)
  } catch (err) {
    console.error("카메라 접근 실패:", err);
    resultBox.innerText = "카메라 접근 실패";
  }
}

// 버튼 클릭 시 실행
document.getElementById("injury-scan-btn").addEventListener("click", () => {
  const mapDiv = document.getElementById("map");
  mapDiv.innerHTML = `
    <div class="flex flex-col items-center">
      <video id="camera-stream" autoplay playsinline class="w-full max-w-md rounded shadow mb-4"></video>
      <div id="ar-result" class="text-lg font-bold text-center text-blue-700"></div>
    </div>
  `;
  startCameraAndScan();
});
