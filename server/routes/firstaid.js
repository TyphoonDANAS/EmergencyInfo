const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const firstaidData = [
    {
      title: '심정지',
      description: '즉시 119에 신고하고, 심폐소생술(CPR)을 시작하세요. 가슴 가운데를 강하고 빠르게 압박합니다.'
    },
    {
      title: '출혈',
      description: '깨끗한 천이나 붕대로 출혈 부위를 압박하여 지혈합니다. 가능한 한 상처를 심장보다 높게 유지합니다.'
    },
    {
      title: '화상',
      description: '화상을 입은 부위를 10~15분간 찬물에 담그고, 물집을 터뜨리지 말고 깨끗한 거즈로 감쌉니다.'
    },
    {
      title: '기도 막힘',
      description: '기침이 불가능하거나 의식이 없으면 즉시 하임리히법(복부 밀치기)을 시도합니다.'
    },
    {
      title: '골절',
      description: '부위를 움직이지 말고 부목 등으로 고정합니다. 가능한 한 움직이지 않고 응급실로 이동합니다.'
    }
  ];

  res.json(firstaidData);
});

module.exports = router;