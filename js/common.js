const btnSearch = document.querySelector('.btn_search');
const dropdownBg = document.querySelector('.dropdown_bg');
const btnClose = document.querySelector('.btn_close');
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const subMenus = document.querySelectorAll('.sub_menu');
const whaleImg = document.querySelector('.whale_img');

let isNavHover = false;
let isDropdownHover = false;

// nav 호버 시
nav.addEventListener('mouseenter', () => {
    if (!dropdownBg.classList.contains('search_active')) {
        isNavHover = true;
        openDropdown();
    }
});

nav.addEventListener('mouseleave', () => {
    isNavHover = false;
    setTimeout(() => {
        if (!isDropdownHover && !dropdownBg.classList.contains('search_active')) {
            closeDropdown();
        }
    }, 50);
});

// dropdown 호버 시
dropdownBg.addEventListener('mouseenter', () => {
    if (!dropdownBg.classList.contains('search_active')) {
        isDropdownHover = true;
        openDropdown();
    }
});

dropdownBg.addEventListener('mouseleave', () => {
    isDropdownHover = false;
    setTimeout(() => {
        if (!isNavHover && !dropdownBg.classList.contains('search_active')) {
            closeDropdown();
        }
    }, 50);
});

// 드롭다운 열기
function openDropdown() {
    dropdownBg.style.height = '280px';
    dropdownBg.style.opacity = '1';
    dropdownBg.style.visibility = 'visible';
    whaleImg.style.opacity = '1';
    whaleImg.style.visibility = 'visible';
    subMenus.forEach(menu => {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
    });
}

// 드롭다운 닫기
function closeDropdown() {
    dropdownBg.style.height = '0';
    dropdownBg.style.opacity = '0';
    dropdownBg.style.visibility = 'hidden';
    whaleImg.style.opacity = '0';
    whaleImg.style.visibility = 'hidden';
    subMenus.forEach(menu => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
    });
}

// 검색 열기
btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    isNavHover = false;
    isDropdownHover = false;

    dropdownBg.classList.add('search_active');
    dropdownBg.style.height = '280px';
    dropdownBg.style.opacity = '1';
    dropdownBg.style.visibility = 'visible';

    whaleImg.style.opacity = '1';
    whaleImg.style.visibility = 'visible';

    subMenus.forEach(menu => {
        menu.style.display = 'none';
    });
});

// 검색 닫기
btnClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdownBg.classList.remove('search_active');

    subMenus.forEach(menu => {
        menu.style.display = '';
    });

    closeDropdown();
});

// 외부 클릭 시 검색 닫기
document.addEventListener('click', (e) => {
    if (dropdownBg.classList.contains('search_active')) {
        if (!dropdownBg.contains(e.target) && !btnSearch.contains(e.target)) {
            dropdownBg.classList.remove('search_active');

            subMenus.forEach(menu => {
                menu.style.display = '';
            });

            closeDropdown();
        }
    }
});

// 스크롤 시 헤더 숨김
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('hide');
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hide');

        if (dropdownBg.classList.contains('search_active')) {
            dropdownBg.classList.remove('search_active');
            subMenus.forEach(menu => {
                menu.style.display = '';
            });
        }

        closeDropdown();
    } else if (currentScroll < lastScroll) {
        header.classList.remove('hide');
    }

    lastScroll = currentScroll;
});

// ========== MAIN VISUAL SLIDER ==========
let currentSlide = 0;
const totalSlides = 4;
let isPlaying = true;
let autoPlayInterval;
const slideInterval = 5000;

const sliderWrapper = document.querySelector('.slider_wrapper');
const currentPageEl = document.getElementById('currentPage');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playPauseBtn = document.getElementById('playPauseBtn');

function updateSlider() {
    if (sliderWrapper) {
        const slideWidth = 1660 + 35; // 카드 너비 + 갭
        const offset = -currentSlide * slideWidth;
        sliderWrapper.style.transform = `translateX(${offset}px)`;
        if (currentPageEl) {
            currentPageEl.textContent = currentSlide + 1;
        }
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetAutoPlay();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetAutoPlay();
}

function toggleAutoPlay() {
    isPlaying = !isPlaying;

    if (playIcon) {
        if (isPlaying) {
            playIcon.className = 'fas fa-pause';
            startAutoPlay();
        } else {
            playIcon.className = 'fas fa-play';
            stopAutoPlay();
        }
    }
}

function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, slideInterval);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    if (isPlaying) {
        stopAutoPlay();
        startAutoPlay();
    }
}

// 이벤트 리스너
if (prevBtn) prevBtn.addEventListener('click', previousSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAutoPlay);

// 초기 자동재생 시작
if (sliderWrapper) {
    startAutoPlay();
}

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// 터치 스와이프 지원
let touchStartX = 0;
let touchEndX = 0;

if (sliderWrapper) {
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) nextSlide();
    if (touchEndX > touchStartX + swipeThreshold) previousSlide();
}