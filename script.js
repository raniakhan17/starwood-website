const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open menu');
}));

const buildTrack = document.querySelector('.build-track');
const buildSlides = [...document.querySelectorAll('.build-slide')];
const buildDots = [...document.querySelectorAll('.slider-dots button')];
const buildCount = document.querySelector('.slider-count');
const buildSlider = document.querySelector('.build-slider');
let buildIndex = 0;
let touchStartX = 0;

function showBuild(index) {
  if (!buildTrack || !buildSlides.length) return;
  buildIndex = (index + buildSlides.length) % buildSlides.length;
  buildTrack.style.transform = `translateX(-${buildIndex * 100}%)`;
  buildSlides.forEach((slide, i) => {
    const active = i === buildIndex;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  buildDots.forEach((dot, i) => {
    const active = i === buildIndex;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', String(active));
  });
  if (buildCount) buildCount.textContent = `${String(buildIndex + 1).padStart(2, '0')} / ${String(buildSlides.length).padStart(2, '0')}`;
}

document.querySelector('.slider-prev')?.addEventListener('click', () => showBuild(buildIndex - 1));
document.querySelector('.slider-next')?.addEventListener('click', () => showBuild(buildIndex + 1));
buildDots.forEach((dot, i) => dot.addEventListener('click', () => showBuild(i)));
buildSlider?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showBuild(buildIndex - 1);
  if (event.key === 'ArrowRight') showBuild(buildIndex + 1);
});
buildSlider?.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
buildSlider?.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) showBuild(buildIndex + (distance < 0 ? 1 : -1));
}, { passive: true });
