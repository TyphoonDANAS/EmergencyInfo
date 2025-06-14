const express = require('express');
const router = express.Router();

// 샘플 위치 (향후 DB나 GPS 연동으로 대체 가능)
let positions = [
  { lat: 37.5665, lng: 126.9780 },
  { lat: 37.5668, lng: 126.9785 },
  { lat: 37.5671, lng: 126.9790 },
  { lat: 37.5674, lng: 126.9795 },
  { lat: 37.5677, lng: 126.9800 }
];

let index = 0;

router.get('/', (req, res) => {
  console.log('🚨 /api/ambulance 호출됨');
  const position = positions[index];
  index = (index + 1) % positions.length;
  res.json(position);
});

module.exports = router;
