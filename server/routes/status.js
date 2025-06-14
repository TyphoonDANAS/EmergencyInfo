// /server/routes/status.js
const express = require('express');
const router = express.Router();

const AJOU_LAT = 37.2819;
const AJOU_LNG = 127.0435;

// 병원 데이터
const hospitals = [
  { name: '아주대학교병원', lat: 37.2809, lng: 127.0436, address: '경기 수원시 영통구 월드컵로 164' },
  { name: '동수원병원', lat: 37.2664, lng: 127.0309, address: '경기 수원시 팔달구 중부대로 165' },
  { name: '수원중앙병원', lat: 37.2619, lng: 127.0322, address: '경기 수원시 팔달구 인계동' },
  { name: '강남병원', lat: 37.2960, lng: 127.0465, address: '경기 수원시 영통구 대학로 150' },
  { name: '삼성서울병원', lat: 37.4880, lng: 127.0850, address: '서울 강남구 일원로 81' }, // 8km 초과
];

// 거리 계산 함수 (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/status
router.get('/', (req, res) => {
  const nearbyHospitals = hospitals
    .map(h => ({
      ...h,
      distance: getDistance(AJOU_LAT, AJOU_LNG, h.lat, h.lng).toFixed(2)
    }))
    .filter(h => h.distance <= 8)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearbyHospitals);
});

module.exports = router;
