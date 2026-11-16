
// =====================================
// MOBILE NAVIGATION
// =====================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================
// HELP BUTTON / TOAST
// =====================================
const toast = document.getElementById('toast');
const helpButton = document.getElementById('helpButton');
let toastTimer;

if (toast && helpButton) {
  helpButton.addEventListener('click', () => {
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  });
}

// =====================================
// FAQ ACCORDION
// Only one answer open at a time
// =====================================
document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-list details').forEach(other => {
        if (other !== item) {
          other.open = false;
        }
      });
    }
  });
});

// =====================================
// CHRISTMAS TEMPLATE CAROUSEL
// =====================================
const track = document.querySelector('.template-track');
const slides = [...document.querySelectorAll('.template-slide')];
const dotsContainer = document.querySelector('.slide-dots');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

if (track && slides.length && dotsContainer) {

  // CREATE NAVIGATION DOTS
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');

    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to Christmas style ${index + 1}`);

    dot.addEventListener('click', () => {
      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();

      const target =
        track.scrollLeft +
        slideRect.left -
        trackRect.left -
        (track.clientWidth - slideRect.width) / 2;

      track.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    });

    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.children];

  // UPDATE ACTIVE DOT
  function updateDots() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + track.clientWidth / 2;

    let activeIndex = 0;
    let shortestDistance = Infinity;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(center - slideCenter);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        activeIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      const active = index === activeIndex;

      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  // NEXT SLIDE
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const amount = slides[0].offsetWidth + gap;

      track.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    });
  }

  // PREVIOUS SLIDE
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const amount = slides[0].offsetWidth + gap;

      track.scrollBy({
        left: -amount,
        behavior: 'smooth'
      });
    });
  }

  // TRACK POSITION CHANGES
  track.addEventListener('scroll', updateDots, {
    passive: true
  });

  window.addEventListener('resize', updateDots);

  // INITIAL STATE
  updateDots();
}
