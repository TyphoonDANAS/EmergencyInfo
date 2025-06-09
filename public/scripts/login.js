document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('로그인 성공!');
    window.location.href = '/';  // 메인 페이지로 이동
  } else {
    document.getElementById('error-msg').textContent = data.message;
    document.getElementById('error-msg').classList.remove('hidden');
  }
});
