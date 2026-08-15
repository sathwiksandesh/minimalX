// ==========================================================================
// Navbar: scroll style + active link highlighting
// ==========================================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('nav a[data-section]');
const sections = document.querySelectorAll('section[id]');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollY = window.scrollY;

  // Navbar background once scrolled
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Scroll progress bar
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = progress + '%';

  // Back-to-top visibility
  if (backToTop) backToTop.classList.toggle('visible', scrollY > 500);

  // Active nav link based on section in view
  let currentSection = sections[0]?.id;
  const offset = 120;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top - offset <= 0) {
      currentSection = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === currentSection);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ==========================================================================
// Smooth scrolling for in-page navigation
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================================================
// Fade-in animation on scroll
// ==========================================================================
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

// ==========================================================================
// Animated stat counters (about section)
// ==========================================================================
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const isDecimal = !Number.isInteger(target);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = target * eased;
    el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (statNumbers.length) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));
}

// ==========================================================================
// Background particles
// ==========================================================================
const bgAnimation = document.getElementById('bgAnimation');
if (bgAnimation) {
  const particleCount = 30;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    particle.style.animationDelay = (Math.random() * 4) + 's';
    fragment.appendChild(particle);
  }
  bgAnimation.appendChild(fragment);
}

// ==========================================================================
// Button ripple effect
// ==========================================================================
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ==========================================================================
// Contact form validation + fake submit
// ==========================================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(field) {
  const group = field.closest('.form-group');
  if (!group) return true;
  let valid = field.checkValidity();
  group.classList.toggle('invalid', !valid);
  return valid;
}

if (contactForm) {
  contactForm.querySelectorAll('input[required], textarea[required]').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group')?.classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
    let allValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      formSuccess?.classList.remove('visible');
      requiredFields[0]?.closest('.form-group')?.querySelector('input, textarea')?.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn?.classList.add('is-loading');
    if (submitBtn) submitBtn.disabled = true;

    // Simulate network request for the demo
    setTimeout(() => {
      submitBtn?.classList.remove('is-loading');
      if (submitBtn) submitBtn.disabled = false;
      formSuccess?.classList.add('visible');
      contactForm.reset();
      contactForm.querySelectorAll('.form-group.invalid').forEach((g) => g.classList.remove('invalid'));
    }, 600);
  });
}