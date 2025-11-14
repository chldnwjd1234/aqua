/* ========== 요소 선택 ========== */
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const dropdown = document.querySelector('.dropdown');
const subMenus = document.querySelectorAll('.gnb > li > ul');
const whale = document.querySelector('.whale');
const btnSearch = document.querySelector('.utils .search');
const btnClose = document.querySelector('.dropdown .close');

/* ========== 네비게이션 호버 ========== */
let isNavHover = false;
let isDropdownHover = false;
let closeTimer = null;

const openDropdown = () => {
    dropdown.classList.add('active');
    whale.classList.add('visible');
    subMenus.forEach(menu => menu.classList.add('visible'));
};

const closeDropdown = () => {
    if (dropdown.classList.contains('search')) return;
    dropdown.classList.remove('active');
    whale.classList.remove('visible');
    subMenus.forEach(menu => menu.classList.remove('visible'));
};

const scheduleClose = () => {
    closeTimer = setTimeout(() => {
        if (!isNavHover && !isDropdownHover) {
            closeDropdown();
        }
    }, 50);
};

nav.addEventListener('mouseenter', () => {
    if (!dropdown.classList.contains('search')) {
        isNavHover = true;
        clearTimeout(closeTimer);
        openDropdown();
    }
});

nav.addEventListener('mouseleave', () => {
    isNavHover = false;
    scheduleClose();
});

dropdown.addEventListener('mouseenter', () => {
    if (!dropdown.classList.contains('search')) {
        isDropdownHover = true;
        clearTimeout(closeTimer);
        openDropdown();
    }
});

dropdown.addEventListener('mouseleave', () => {
    isDropdownHover = false;
    scheduleClose();
});

/* ========== 검색 ========== */
btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.add('search', 'active');
    whale.classList.add('visible');
    subMenus.forEach(menu => menu.style.display = 'none');
});

btnClose.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.remove('search');
    subMenus.forEach(menu => menu.style.display = '');
    closeDropdown();
});

document.addEventListener('click', (e) => {
    if (dropdown.classList.contains('search')) {
        if (!dropdown.contains(e.target) && !btnSearch.contains(e.target)) {
            btnClose.click();
        }
    }
});

/* ========== 헤더 스크롤 ========== */
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('hide');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hide');
        if (dropdown.classList.contains('search')) {
            btnClose.click();
        }
        closeDropdown();
    } else if (currentScroll < lastScroll) {
        header.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
});

/* ========== 메인 슬라이드 ========== */
const mainSlide = new Swiper(".visual .swiper", {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 35,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
    },
    navigation: {
        nextEl: '.visual .next',
        prevEl: '.visual .prev'
    }
});

document.querySelector('.visual .toggle').addEventListener('click', function() {
    if (mainSlide.autoplay.running) {
        mainSlide.autoplay.stop();
        this.querySelector('i').classList.replace('fa-pause', 'fa-play');
    } else {
        mainSlide.autoplay.start();
        this.querySelector('i').classList.replace('fa-play', 'fa-pause');
    }
});