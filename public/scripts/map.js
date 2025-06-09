const imageSrc = 'https://res.cloudinary.com/dgypeilwt/image/upload/v1748856399/ambulance_icon.png';
const imageSize = new kakao.maps.Size(40, 40);
const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

let map, ambulanceMarker, userMarker;

function initializeMap(lat, lng) {
  const userLocation = new kakao.maps.LatLng(lat, lng);
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: userLocation,
    level: 5
  };

  map = new kakao.maps.Map(mapContainer, mapOption);

  userMarker = new kakao.maps.Marker({ map, position: userLocation, title: "내 위치", zIndex: 10 });
  ambulanceMarker = new kakao.maps.Marker({ map, position: userLocation, image: markerImage, title: "구급차 위치" });

  setInterval(updateAmbulancePosition, 500000);
}

async function updateAmbulancePosition() {
  try {
    const response = await fetch('/api/ambulance');
    const data = await response.json();
    const newLatLng = new kakao.maps.LatLng(data.lat, data.lng);
    ambulanceMarker.setPosition(newLatLng);
    map.panTo(newLatLng);
  } catch (error) {
    console.error('🚨 위치 요청 실패:', error);
  }
}

function findNearbyHospitals() {
  if (!userMarker) return alert('위치를 아직 불러오지 못했어요.');

  const ps = new kakao.maps.services.Places();
  const userLatLng = userMarker.getPosition();

  ps.keywordSearch('응급실', (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      data.forEach(place => {
        const coords = new kakao.maps.LatLng(place.y, place.x);
        new kakao.maps.Marker({ map, position: coords, title: place.place_name });
      });
      map.setCenter(userLatLng);
    } else {
      alert('응급실 정보를 찾을 수 없습니다.');
    }
  }, { location: userLatLng, radius: 5000 });
}

async function showFirstaidInfo() {
  try {
    const response = await fetch('/api/firstaid');
    const data = await response.json();
    const modal = document.getElementById('firstaid-modal');
    const content = document.getElementById('firstaid-content');
    const closeBtn = document.getElementById('close-firstaid-btn');

    if (!modal || !content || !closeBtn) return console.error('모달 요소를 찾을 수 없습니다.');

    content.innerHTML = data.map(item => `<h3 class="font-bold text-lg mt-4">${item.title}</h3><p>${item.description}</p>`).join('');
    modal.classList.remove('hidden');
    closeBtn.onclick = () => modal.classList.add('hidden');
  } catch (error) {
    alert('응급처치 정보를 불러오지 못했습니다.');
    console.error(error);
  }
}

// 지도 초기화
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => initializeMap(coords.latitude, coords.longitude),
    (error) => {
      console.error('⚠️ 위치 정보 가져오기 실패:', error);
      initializeMap(37.5665, 126.9780);
    }
  );
} else {
  console.error("이 브라우저는 위치 정보 기능을 지원하지 않습니다.");
  initializeMap(37.5665, 126.9780);
}

// 버튼 이벤트 바인딩
document.getElementById('find-hospital-btn').addEventListener('click', findNearbyHospitals);
document.getElementById('firstaid-btn').addEventListener('click', showFirstaidInfo);

// 로그인 UI 처리 (DOMContentLoaded 없이 바로 실행)
const loginArea = document.getElementById('login-area');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (loginArea) {
  if (token && username) {
    loginArea.innerHTML = `<button id="user-button" class="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">${username}</button>`;
    document.getElementById('user-button').onclick = () => {
      if (confirm('로그아웃하시겠습니까?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        location.reload();
      }
    };
  } else {
    loginArea.innerHTML = `<a href="/login.html" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">로그인</a>`;
  }
} else {
  console.error("❌ login-area 요소를 찾을 수 없습니다.");
}

async function showEmergencyStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    if (data.length === 0) {
      alert('반경 8km 이내 응급실이 없습니다.');
      return;
    }

    const hospitalList = data.map(h => `🏥 ${h.name} (${h.distance}km)\n📍 ${h.address}`).join('\n\n');
    alert(`✅ 반경 8km 응급실 목록:\n\n${hospitalList}`);
  } catch (err) {
    console.error('응급실 정보 로딩 실패:', err);
    alert('응급실 정보를 불러오지 못했습니다.');
  }
}

document.getElementById('usage-btn').addEventListener('click', showEmergencyStatus);
