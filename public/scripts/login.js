document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }) // ✅ 중요: userId로 전송
      });

      const data = await res.json();

      if (res.ok) {
        // 로그인 성공 시 토큰 저장 후 메인 페이지로 이동
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        window.location.href = '/';
      } else {
        // 로그인 실패 시 메시지 표시
        document.getElementById('error-msg').textContent = data.error || '로그인 실패';
        document.getElementById('error-msg').classList.remove('hidden');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      document.getElementById('error-msg').textContent = '서버 오류';
      document.getElementById('error-msg').classList.remove('hidden');
    }
  });
});
