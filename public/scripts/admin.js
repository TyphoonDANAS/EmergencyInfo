// 📄 /public/scripts/admin.js

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    alert("로그인이 필요합니다.");
    location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 403) {
      alert("관리자만 접근 가능합니다.");
      location.href = "/";
      return;
    }

    const users = await res.json();
    const container = document.getElementById("user-list");

    if (!Array.isArray(users)) {
      container.innerHTML = "<p>사용자 데이터를 불러오지 못했습니다.</p>";
      return;
    }

    container.innerHTML = users
      .map((user) => {
        const isAdmin = user.role === "admin";
        const buttonText = isAdmin ? "관리자 해제" : "관리자 권한 부여";
        const buttonColor = isAdmin ? "bg-red-600" : "bg-green-600";

        return `
          <div class="flex justify-between items-center border-b py-2">
            <div>
              <span class="font-bold">${user.user_id}</span>
              <span class="text-sm text-gray-600 ml-2">(${user.role})</span>
            </div>
            <button 
              class="${buttonColor} text-white px-3 py-1 rounded"
              onclick="toggleAdmin('${user.user_id}', ${isAdmin})"
            >
              ${buttonText}
            </button>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("사용자 목록 불러오기 실패:", err);
    alert("관리자 정보를 불러오는 데 실패했습니다.");
  }
});

async function toggleAdmin(targetUserId, isCurrentlyAdmin) {
  const token = localStorage.getItem("token");

  const confirmText = isCurrentlyAdmin
    ? "정말 관리자를 해제하시겠습니까?"
    : "정말 관리자로 승격하시겠습니까?";

  if (!confirm(confirmText)) return;

  try {
    const res = await fetch("/api/admin/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: targetUserId,
        role: isCurrentlyAdmin ? "user" : "admin",
      }),
    });

    if (res.ok) {
      alert("권한이 변경되었습니다.");
      location.reload();
    } else {
      const data = await res.json();
      alert(`실패: ${data.error || "권한 변경 실패"}`);
    }
  } catch (err) {
    console.error("권한 변경 오류:", err);
    alert("권한 변경 중 오류가 발생했습니다.");
  }
}
