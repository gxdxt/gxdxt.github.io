console.log("🔥 main.js 파일 맨 윗줄 로드됨!");
/* ==========================================================================
   Gallery & Modal Carousel Logic
   ========================================================================== */
// Unsplash 기반 고화질 웨딩 목업 15장
const galleryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1519225424933-7e61a7a0b380?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1000&q=80"
];

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

// 그리드 15장 렌더링
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  
  grid.innerHTML = galleryImages.map((src, idx) => `
    <div class="gallery-item" onclick="openGalleryModal(${idx})">
      <img src="${src}" alt="갤러리 사진 ${idx + 1}" loading="lazy">
    </div>
  `).join('');

  document.getElementById("totalIdx").textContent = galleryImages.length;
}

function openGalleryModal(index) {
  currentIndex = index;
  updateModalView();
  document.getElementById("galleryModal").classList.add("show");
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
}

function closeGalleryModal() {
  document.getElementById("galleryModal").classList.remove("show");
  document.body.style.overflow = "";
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "galleryModal" || e.target.classList.contains("modal-img-wrap")) {
    closeGalleryModal();
  }
}

function updateModalView() {
  const modalImg = document.getElementById("modalImg");
  modalImg.style.opacity = 0;
  
  setTimeout(() => {
    modalImg.src = galleryImages[currentIndex];
    document.getElementById("currentIdx").textContent = currentIndex + 1;
    modalImg.style.opacity = 1;
  }, 100);
}

function prevSlide(e) {
  if (e) e.stopPropagation();
  currentIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
  updateModalView();
}

function nextSlide(e) {
  if (e) e.stopPropagation();
  currentIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
  updateModalView();
}

// 모바일 터치 스와이프 지원 (DOMContentLoaded 내부로 이동)
document.addEventListener("DOMContentLoaded", () => {
  renderGallery(); // 갤러리 이미지 그리기

  const modalArea = document.getElementById("galleryModal");
  if (modalArea) {
    modalArea.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modalArea.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
});

function handleSwipe() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 40) { // 40px 이상 스와이프 시 전환
    if (diff > 0) prevSlide();
    else nextSlide();
  }
}
// ==========================================================================
// BGM Controller (디버그 콘솔 강화 버전)
// ==========================================================================
var isPlaying = false;

// 1. 오디오 기본 상태 로깅
// 기존 코드:
// if (!bgm) { ... }  <-- 여기서 bgm 변수가 선언되지 않아 죽음

// 수정 코드:
var bgm = document.getElementById("bgmAudio");

if (!bgm) {
  console.error("❌ [BGM] #bgmAudio 태그를 찾지 못했습니다.");
} else {
  console.log("🔍 [BGM] 오디오 태그 감지 완료. 현재 경로:", bgm.currentSrc || bgm.querySelector('source')?.src);
  
  bgm.addEventListener("error", function(e) {
    console.error("❌ [BGM 에러 이벤트 발생]:", bgm.error);
  });

  bgm.addEventListener("canplay", function() {
    console.log("✅ [BGM] canplay - 오디오 재생 준비 완료");
  });
}
function toggleBgm() {
  console.log("🔘 [BGM] 버튼 클릭됨. 현재 isPlaying 상태:", isPlaying);
var bgm = document.getElementById("bgmAudio");
var bgmBtn = document.getElementById("bgmBtn");

  if (!bgm) {
    console.error("❌ [BGM] bgm 객체가 없습니다.");
    return;
  }

  if (isPlaying) {
    bgm.pause();
    if (bgmBtn) bgmBtn.classList.remove("playing");
    isPlaying = false;
    console.log("⏸️ [BGM] 일시정지 완료");
  } else {
    bgm.volume = 1.0;
    console.log("▶️ [BGM] play() 호출 시도...");

    var playPromise = bgm.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function() {
          console.log("🎶 [BGM] 재생 성공! 정상 출력 중");
          if (bgmBtn) bgmBtn.classList.add("playing");
          isPlaying = true;
        })
        .catch(function(err) {
          console.error("🚨 [BGM] play() 거부/실패:", err.name, err.message);
        });
    }
  }
}

// ==========================================================================
// 첫 터치/클릭 시 자동 재생 & 초기화
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
  renderGallery();

  // 1. 모바일 터치 스와이프 지원 (모달)
  var modalArea = document.getElementById("galleryModal");
  if (modalArea) {
    modalArea.addEventListener("touchstart", function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modalArea.addEventListener("touchend", function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  // 2. 화면 첫 터치/클릭 시 BGM 자동 재생 (1회성)
  function handleFirstInteraction() {
    var bgm = document.getElementById("bgmAudio");
    var bgmBtn = document.getElementById("bgmBtn");

    if (bgm && !isPlaying) {
      bgm.volume = 1.0;
      var playPromise = bgm.play();

      if (playPromise !== undefined) {
        playPromise
          .then(function() {
            if (bgmBtn) bgmBtn.classList.add("playing");
            isPlaying = true;
            console.log("🎶 첫 인터랙션 감지: BGM 자동 재생 시작");
          })
          .catch(function(err) {
            console.log("브라우저 자동재생 제약 유지:", err.message);
          });
      }
    }

    // 재생 시도 후 터치 이벤트 리스너 제거 (중복 실행 방지)
    document.removeEventListener("touchstart", handleFirstInteraction);
    document.removeEventListener("click", handleFirstInteraction);
    document.removeEventListener("scroll", handleFirstInteraction);
  }

  // 화면 터치, 클릭, 스크롤 감지 (once 옵션 부여)
  document.addEventListener("touchstart", handleFirstInteraction, { passive: true });
  document.addEventListener("click", handleFirstInteraction, { passive: true });
  document.addEventListener("scroll", handleFirstInteraction, { passive: true });
});

// ==========================================================================
// D-Day Counter (2027년 1월 23일 11:20 기준)
// ==========================================================================
function updateDday() {
  var ddayEl = document.getElementById("ddayCount");
  var bannerEl = document.getElementById("ddayBanner");

  if (!ddayEl || !bannerEl) {
    return;
  }

  // 2027년 1월 23일 11:20
  var targetDate = new Date(2027, 0, 23, 11, 20, 0);
  var now = new Date();

  // 날짜 단위(자정 기준) 계산
  var targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  var todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var diffTime = targetMidnight - todayMidnight;
  var diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));


  if (diffDays > 0) {
    ddayEl.textContent = diffDays;
  } else if (diffDays === 0) {
    bannerEl.innerHTML = "축복의 날, <span class='dday-highlight'>오늘</span>입니다 ♥";
  } else {
    bannerEl.innerHTML = "소중한 축복 속에 <span class='dday-highlight'>예식</span>을 마쳤습니다 ♥";
  }
}


// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
});

// DOM 완료 후 실행
window.addEventListener("load", function() {
    updateDday();
});

