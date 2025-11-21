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
    e.preventDefault();
    const tagText = this.textContent.replace("#", "").trim();
    const searchInput = document.querySelector(".search_box input");
    searchInput.value = tagText;
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

/* ========== ANIMAL 슬라이드 ========== */
let currentIndex = 0;
const animals = [
  { name: "벨루가", img: "./asset/img/ani1.png" },
  { name: "참물범", img: "./asset/img/ani2.png" },
  { name: "훔볼트 펭귄", img: "./asset/img/ani3.png" },
  { name: "바다거북", img: "./asset/img/ani4.png" },
];

const mainCircles = document.querySelectorAll(".main_circle");
const thumbsContainer = document.querySelector(".animal_thumbs");
const prevBtn = document.querySelector(".animal_prev");
const nextBtn = document.querySelector(".animal_next");

// 썸네일 렌더링 (활성화된 것 제외 3개만)
function renderThumbnails() {
  thumbsContainer.innerHTML = "";

  animals.forEach((animal, index) => {
    if (index !== currentIndex) {
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      thumb.innerHTML = `<img src="${animal.img}" alt="${animal.name}" />`;
      thumb.addEventListener("click", () => changeSlide(index));
      thumbsContainer.appendChild(thumb);
    }
  });
}

// 슬라이드 변경
function changeSlide(newIndex) {
  const currentVideo = mainCircles[currentIndex].querySelector(".animal_vid");
  currentVideo.pause();

  mainCircles[currentIndex].classList.remove("active");
  currentIndex = newIndex;
  mainCircles[currentIndex].classList.add("active");

  const newVideo = mainCircles[currentIndex].querySelector(".animal_vid");
  newVideo.play();

  renderThumbnails();
}

// 이전 버튼
prevBtn.addEventListener("click", () => {
  const newIndex = (currentIndex - 1 + animals.length) % animals.length;
  changeSlide(newIndex);
});

// 다음 버튼
nextBtn.addEventListener("click", () => {
  const newIndex = (currentIndex + 1) % animals.length;
  changeSlide(newIndex);
});

// 초기화
renderThumbnails();

/* ========== Event Swiper ========== */
const eventSwiper = new Swiper(".event_swiper", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: true,
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 1,
    depth: 0,
    modifier: 1,
    slideShadows: false,
    scale: 0.88,
  },
  speed: 3800, // 한 슬라이드 이동 시간
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  freeMode: true,
  freeModeMomentum: false,
  slideToClickedSlide: true,
  allowTouchMove: true,
  navigation: {
    nextEl: ".event_next",
    prevEl: ".event_prev",
  },
  watchSlidesProgress: true,
});

/* ========== Top Button ========== */
const topBtn = document.querySelector('.top_btn');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
});

topBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});