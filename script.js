'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navBar = document.querySelector('.nav');
const divTab = document.querySelectorAll('.operations__tab');
const divText = document.querySelectorAll('.operations__content');
const divContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const totalSlides = slides.length;

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();
const allDots = document.querySelectorAll('.dots__dot');

const dotsFunction = function () {
  allDots.forEach(el =>
    currentSlide === +el.dataset.slide
      ? el.classList.add('dots__dot--active')
      : el.classList.remove('dots__dot--active')
  );
};
dotContainer.addEventListener('click', function (e) {
  const dotsDot = e.target.closest('.dots__dot');
  if (!dotsDot) return;
  const clicked = +e.target.dataset.slide;
  allDots.forEach(dot =>
    +dot.dataset.slide === clicked
      ? dot.classList.add('dots__dot--active')
      : dot.classList.remove('dots__dot--active')
  );
  slides.forEach((slide, i) => {
    currentSlide = clicked;
    slide.style.transform = `translateX(${(i - clicked) * 100}%)`;
  });
});

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(button => button.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved user experience and analytics <button class="btn btn--close-cookie">Got it! </button>`;
header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

message.style.width = '107%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 10 + 'px';
document
  .querySelector('body')
  .style.setProperty('background-color', 'lightblue');

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const att = e.target.getAttribute('href');
    document.querySelector(att).scrollIntoView({ behavior: 'smooth' });
  }
});

divContainer.addEventListener('click', e => {
  const tabbed = e.target.closest('.operations__tab');
  if (!tabbed) return;
  divTab.forEach(el => {
    el.classList.remove('operations__tab--active');
  });
  tabbed.classList.add('operations__tab--active');
  divText.forEach(el => {
    el.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${tabbed.dataset.tab}`)
    .classList.add('operations__content--active');
});

//hovering over buttons on navigation header opacity reduction functionality
const hoverNav = function (e) {
  const link = e.target;
  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const img = link.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(el => {
      if (el !== e.target) el.style.opacity = this;
    });
    if (img !== e.target) img.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverNav.bind(0.5));

nav.addEventListener('mouseout', hoverNav.bind(1));

const navHeight = nav.getBoundingClientRect().height;
const obsCallBack = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navBar.classList.add('sticky');
  } else navBar.classList.remove('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

// section revealing

const observer = new IntersectionObserver(obsCallBack, obsOptions);
observer.observe(header);
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    else {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.18,
});
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Make cookie message sticky

const stickyCookies = function (entries, observer) {
  const [entry] = entries;
  if (true) {
    document.querySelector('.cookie-message').classList.add('sticky');
    observer.unobserve(entry.target);
  }
};
const cookieObserver = new IntersectionObserver(stickyCookies, {
  root: null,
  threshold: 0,
});
cookieObserver.observe(message);

// Lazy loading functionality

const featuresImages = document.querySelectorAll('.features__img');
const unBlurImages = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.setAttribute('src', entry.target.dataset.src);
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const featuresImagesObserver = new IntersectionObserver(unBlurImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
featuresImages.forEach(img => {
  featuresImagesObserver.observe(img);
});

//slider functionality
const resetSlider = () => {
  dotsFunction();
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100}%)`;
  });
};
resetSlider();
function functionSlidesRight() {
  currentSlide++;
  dotsFunction();

  if (currentSlide < totalSlides && currentSlide > 0) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
    });
  } else {
    currentSlide = 0;
    resetSlider();
  }
}
function functionSlidesLeft() {
  currentSlide--;
  dotsFunction();
  if (currentSlide < totalSlides && currentSlide > 0) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
    });
  } else {
    currentSlide = 0;
    resetSlider();
  }
}
btnLeft.addEventListener('click', functionSlidesLeft);
btnRight.addEventListener('click', functionSlidesRight);
document.addEventListener('keydown', function (e) {
  console.log(e.key);
  e.key === 'ArrowLeft' && functionSlidesLeft();
  e.key === 'ArrowRight' && functionSlidesRight();
});

