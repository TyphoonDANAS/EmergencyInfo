// 📄 public/scripts/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userId = document.getElementById("userId").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("회원가입 성공! 로그인 페이지로 이동합니다.");
          window.location.href = "/login.html";
        } else {
          alert("회원가입 실패: " + data.error);
        }
      } catch (err) {
        console.error("회원가입 중 오류 발생:", err);
      }
    });
  }
});
