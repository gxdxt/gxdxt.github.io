/**
 * main.js - 모바일 청첩장 기능 스크립트
 */

let toastTimer = null;

/**
 * 계좌번호 복사 함수
 * @param {string} accountNumber - 하이픈 없는 계좌번호 숫자
 */
function copyAccount(accountNumber) {
  if (navigator.clipboard && window.isSecureContext) {
    // 최신 표준 Clipboard API
    navigator.clipboard.writeText(accountNumber)
      .then(() => showToast("계좌번호가 복사되었습니다."))
      .catch(() => fallbackCopy(accountNumber));
  } else {
    // 이전 브라우저 및 비보안 컨텍스트 폴백
    fallbackCopy(accountNumber);
  }
}

/**
 * 클립보드 복사 폴백 (execCommand)
 */
function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // 화면 깜빡임 방지 스타일
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast("계좌번호가 복사되었습니다.");
    } else {
      showToast("복사에 실패했습니다. 번호를 직접 입력해주세요.");
    }
  } catch (err) {
    showToast("복사 기능이 지원되지 않는 브라우저입니다.");
  }
  
  document.body.removeChild(textArea);
}

/**
 * 하단 안내 토스트 팝업 표출
 * @param {string} message - 안내 문구
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  // 기존 타이머 클리어 후 2초 뒤 숨김
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/**
 * 아코디언 드롭다운 토글 함수
 */
function toggleAccordion(button) {
  const item = button.closest('.accordion-item');
  const body = item.querySelector('.accordion-body');
  const isOpen = item.classList.contains('active');

  if (isOpen) {
    // 닫기
    body.style.maxHeight = null;
    item.classList.remove('active');
  } else {
    // 열기
    item.classList.add('active');
    body.style.maxHeight = body.scrollHeight + "px";
  }
}
