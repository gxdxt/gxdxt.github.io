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

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
});
