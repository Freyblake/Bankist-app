'use strict';

///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// lecture 188 (Implementing smooth scrolling)

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log(
  //   'current scroll position(X/Y)',
  //   window.pageXOffset,
  //   window.pageYOffset
  // ); //returns the number of pixels the document is currently scrolled along the vertical axis (that is, up or down) with a value of 0.0, indicating that the top edge of the Document is currently aligned with the top edge of the window's content area.

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrooling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern method

  section1.scrollIntoView({ behavior: 'smooth' });
});

// lecture-192

// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// Event delegation
//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // MATCHING STRATEGY
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// lecture-194
// Tabbed component

//using event delegation

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Gaurd clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Active content-area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation

// we used mouseover here because mouseenter doesn't allow bubbling effect
//opppsite of mouseover is mouseout and mouseenter is mouseleave

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing an "argument" into a handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// lecture-196 and 197
// sticky navigation
// const intialCords = section1.getBoundingClientRect();
// console.log(intialCords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > intialCords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// sticky navigation: Intersection Oberserver API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// lecture-198
// Reveal Sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// lecture 199
// lazy loading images

const imageTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // here don't directly change the lazy class by using removeing instead use addEventListener because in Js at the background it's doing loading function i.e. it's changes the image and loads the new image when we change the source
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imageTarget.forEach(img => imgObserver.observe(img));

// slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"</button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //event listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);

    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

/*
// lecture-186 

// (here we have implemented cookies down the section)

// Selecting Elements
// console.log(document.documentElement); // it will select the whole HTML document
// console.log(document.head); // it will select the head of the HTML
// console.log(document.body); // it will select the body of the HTML

const header = document.querySelector('.header'); // it will select the first element with name header
const allSections = document.querySelectorAll('.section'); // it will select the all the elements name section
// console.log(allSections);

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// Here getElementsByTagName gives us HTML collection not the node list like querySelectorAll, HTML collections changes itself dynamically as the HTML changes

// console.log(document.getElementsByClassName('btn')); // this also gives HTML collections

// Creating and inserting elements

// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');

// message.textContent('We use Cookies for improved functionality and analytics');
message.innerHTML =
  'We use Cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!!</button>';

// header.prepend(message);
// prepend adds the element to header as it's first child we can use append to add the element as the last child
header.append(message);
// header.append(message.cloneNode(true)); // here the clone node will clone will the message and then display it two times

// header.before(message); // this will add the element before the header element as a sibling
// header.after(message); // Similarly this wil add element after the header element also as a sibling

// Delete element

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove(); // this is new method previously we have to call the parentElement and then delete the child element
    message.parentElement.removeChild(message);
  });
*/

///////////////////////////////////////////////////////////////////////////////////////

/*
// lecture-187 (Styles, Attributes and Classes)

// Styles

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// these styles are added as inline styles

// console.log(message.style.color); // this won't give any string as this style is not defined by us in Js
// console.log(message.style.backgroundColor); // this will give a string
// styles can be read by using getComputedStyle

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

message.style.height =
  parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes (such as src, class, id, alt)

const logo = document.querySelector('.nav__logo');

// console.log(logo.alt);
// console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
// console.log(logo.designer); //undefined
// console.log(logo.getAttribute('designer')); // Jonas
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src); // absolute version
// console.log(logo.getAttribute('src')); // relative

const link = document.querySelector('.nav__link--btn');

// console.log(link.href);
// console.log(link.getAttribute('href'));

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes

// logo.classList.add('c', 'j');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c', 'j');

// we add multiple classes

//to set a class name
// logo.className = 'jonas';  // don't use this because this overwrite all the classes also this allows only to write one class on any element
*/

///////////////////////////////////////////////////////////////////////////////////////

/*
// lecture-189

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great!! you are reading h1 heading');
  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // after 3s it will remove the handler function

// another way
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great!! you are reading h1 heading');
// };
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// lecture 191

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // STOP PROPAGATION / BUBBLING
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

// for CAPTURING we need to give 3rd argument in addEventListener as true but capturing is rarely used and it's irrelevant
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// lecture-193 Dom Traversing

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // though they are direct children of h1 but they will go down deep as necessary
console.log(h1.childNodes); // it give all the child nodes presents in the h1 (comment are also included)
console.log(h1.children); // this will us HTML Collection // only works for direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards

//direct parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
// closest method will return a the parent of h1  which has a name of 'header'

h1.closest('h1').style.background = 'var(--gradient-primary)';
// closest method will return the same if we give same

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// to get all of the siblings
console.log(h1.parentElement.children); // HTML Collection

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});
*/

// lecture-202

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built! ', e);
});
// this will run after the HTML is parsed and then DOM content is loaded

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; // no matter what we write here it will show the same pop up
// });

// this is used to give message before exiting the page like 'Do you want to leave this site', or when reloading that 'changes that you made will not be saved'

// always add javaScript file at the end of the body as it first parse the HTML content and then it applies DOM events
