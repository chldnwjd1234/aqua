/* ========== 요소 선택 ========== */
const header = document.querySelector("header");
const nav = document.querySelector("nav");
const dropdown = document.querySelector(".dropdown");
const subMenus = document.querySelectorAll(".gnb > li > ul");
const whale = document.querySelector(".whale");
const btnSearch = document.querySelector(".utils .search");
const btnClose = document.querySelector(".dropdown .close");

/* ========== 네비게이션 호버 ========== */
let isNavHover = false;
let isDropdownHover = false;
let closeTimer = null;

const openDropdown = () => {
  dropdown.classList.add("active");
  whale.classList.add("visible");
  subMenus.forEach((menu) => menu.classList.add("visible"));
};

const closeDropdown = () => {
  if (dropdown.classList.contains("search")) return;
  dropdown.classList.remove("active");
  whale.classList.remove("visible");
  subMenus.forEach((menu) => menu.classList.remove("visible"));
};

const scheduleClose = () => {
  closeTimer = setTimeout(() => {
    if (!isNavHover && !isDropdownHover) {
      closeDropdown();
    }
  }, 50);
};

nav.addEventListener("mouseenter", () => {
  if (!dropdown.classList.contains("search")) {
    isNavHover = true;
    clearTimeout(closeTimer);
    openDropdown();
  }
});

nav.addEventListener("mouseleave", () => {
  isNavHover = false;
  scheduleClose();
});

dropdown.addEventListener("mouseenter", () => {
  if (!dropdown.classList.contains("search")) {
    isDropdownHover = true;
    clearTimeout(closeTimer);
    openDropdown();
  }
});

dropdown.addEventListener("mouseleave", () => {
  isDropdownHover = false;
  scheduleClose();
});

/* ========== 검색 ========== */
btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.add("search", "active");
  whale.classList.add("visible");
  subMenus.forEach((menu) => (menu.style.display = "none"));
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.remove("search");
  subMenus.forEach((menu) => (menu.style.display = ""));
  closeDropdown();
});

document.addEventListener("click", (e) => {
  if (dropdown.classList.contains("search")) {
    if (!dropdown.contains(e.target) && !btnSearch.contains(e.target)) {
      btnClose.click();
    }
  }
});

// 태그 클릭 시 검색창에 텍스트 입력
document.querySelectorAll(".tags a").forEach((tag) => {
  tag.addEventListener("click", function (e) {
    e.preventDefault(); // 링크 기본 동작 막기

    // # 제거하고 텍스트만 가져오기
    const tagText = this.textContent.replace("#", "").trim();

    // 검색창 input에 텍스트 넣기
    const searchInput = document.querySelector(".search_box input");
    searchInput.value = tagText;

    // 검색창에 포커스 (선택사항)
    searchInput.focus();
  });
});

/* ========== 헤더 스크롤 ========== */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove("hide");
    return;
  }

  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide");
    if (dropdown.classList.contains("search")) {
      btnClose.click();
    }
    closeDropdown();
  } else if (currentScroll < lastScroll) {
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

/* ========== 메인 슬라이드 ========== */
const mainSlide = new Swiper(".visual .swiper", {
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 35,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".visual .next",
    prevEl: ".visual .prev",
  },
});

document
  .querySelector(".visual .toggle")
  .addEventListener("click", function () {
    if (mainSlide.autoplay.running) {
      mainSlide.autoplay.stop();
      this.querySelector("i").classList.replace("fa-pause", "fa-play");
    } else {
      mainSlide.autoplay.start();
      this.querySelector("i").classList.replace("fa-play", "fa-pause");
    }
  });

// ========== ANIMAL SWIPER ==========
const animalThumbs = new Swiper(".animal_thumbs", {
  direction: "vertical",
  spaceBetween: 25,
  slidesPerView: 3,
  watchSlidesProgress: true,
  loop: true, // 무한 루프
});

const animalSwiper = new Swiper(".animal_swiper", {
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  loop: true, // 무한 루프
  thumbs: {
    swiper: animalThumbs,
  },
  navigation: {
    prevEl: ".animal_prev",
    nextEl: ".animal_next",
  },
  on: {
    slideChange: function () {
      // 모든 비디오 일시정지
      document.querySelectorAll(".animal_vid").forEach((vid) => {
        vid.pause();
      });

      // 현재 활성화된 슬라이드의 비디오만 재생
      const activeSlide = this.slides[this.activeIndex];
      const activeVideo = activeSlide.querySelector(".animal_vid");
      if (activeVideo) {
        activeVideo.currentTime = 0;
        activeVideo.play();
      }
    },
  },
});
