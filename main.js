/* =====================================================
   FAZZARI CLINICHE DENTALI — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header Scroll Behaviour ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const isHeroPage = document.querySelector('.hero') !== null;

    const updateHeader = () => {
      if (isHeroPage) {
        if (window.scrollY > 60) {
          header.classList.remove('header-transparent');
          header.classList.add('header-scrolled');
        } else {
          header.classList.add('header-transparent');
          header.classList.remove('header-scrolled');
        }
      }
    };

    if (isHeroPage) {
      header.classList.add('header-transparent');
    } else {
      header.classList.add('header-solid');
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');

  const closeMobileMenu = () => {
    if (!hamburger) return;
    hamburger.classList.remove('active');
    mobileNav?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    hamburger.classList.add('active');
    mobileNav?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  hamburger?.addEventListener('click', () => {
    if (hamburger.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ── Scroll Reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  /* ── Animated Counters ── */
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-height'), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* ── Active Nav Link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Cookie Banner ── */
  const cookieBanner  = document.getElementById('cookie-banner');
  const cookieModal   = document.getElementById('cookie-modal');

  const COOKIE_KEY = 'fazzari_cookie_consent';

  const hideBanner = () => {
    cookieBanner?.classList.remove('visible');
  };

  const showBanner = () => {
    cookieBanner?.classList.add('visible');
  };

  if (cookieBanner) {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setTimeout(showBanner, 800);
    }

    document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ technical: true, analytics: true }));
      hideBanner();
    });

    document.getElementById('cookie-accept-minimal')?.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ technical: true, analytics: false }));
      hideBanner();
    });

    document.getElementById('cookie-open-settings')?.addEventListener('click', () => {
      cookieModal?.classList.add('visible');
    });
  }

  if (cookieModal) {
    document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
      cookieModal.classList.remove('visible');
    });

    document.getElementById('cookie-modal-save')?.addEventListener('click', () => {
      const analytics = document.getElementById('toggle-analytics')?.checked ?? false;
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ technical: true, analytics }));
      cookieModal.classList.remove('visible');
      hideBanner();
    });

    cookieModal.addEventListener('click', (e) => {
      if (e.target === cookieModal) cookieModal.classList.remove('visible');
    });
  }

  /* ── Contact Form Validation ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const successMsg = document.getElementById('form-success');

    const validateField = (field) => {
      const errorEl = field.parentElement.querySelector('.form-error');
      let valid = true;
      let message = '';

      if (field.required && !field.value.trim()) {
        valid = false;
        message = 'Questo campo è obbligatorio.';
      } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          valid = false;
          message = 'Inserisci un indirizzo email valido.';
        }
      } else if (field.type === 'tel' && field.value) {
        const telRegex = /^[\d\s\+\-\(\)]{7,15}$/;
        if (!telRegex.test(field.value.trim())) {
          valid = false;
          message = 'Inserisci un numero di telefono valido.';
        }
      }

      field.classList.toggle('error', !valid);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = valid ? 'none' : 'block';
      }
      return valid;
    };

    contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
      const privacyCheck = contactForm.querySelector('#privacy-check');
      let allValid = true;

      fields.forEach((f) => {
        if (!validateField(f)) allValid = false;
      });

      if (privacyCheck && !privacyCheck.checked) {
        allValid = false;
        const errorEl = privacyCheck.closest('.form-checkbox').querySelector('.form-error');
        if (errorEl) { errorEl.textContent = 'Devi accettare la privacy policy.'; errorEl.style.display = 'block'; }
      }

      if (allValid) {
        contactForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
        window.scrollTo({ top: contactForm.parentElement.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }

  /* ── Testimonials Simple Slider ── */
  const slider = document.querySelector('.testimonials-slider');
  if (slider) {
    const track = slider.querySelector('.testimonials-track');
    const dots  = slider.querySelectorAll('.slider-dot');
    const prev  = slider.querySelector('.slider-prev');
    const next  = slider.querySelector('.slider-next');
    const cards = slider.querySelectorAll('.testimonial-card');

    if (cards.length < 2) return;

    let current = 0;
    let autoplay;

    const goTo = (index) => {
      current = (index + cards.length) % cards.length;
      const itemWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * itemWidth}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAutoplay = () => {
      autoplay = setInterval(() => goTo(current + 1), 5000);
    };
    const stopAutoplay = () => clearInterval(autoplay);

    dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); }));
    prev?.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
    next?.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

    startAutoplay();

    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
      startAutoplay();
    });
  }

});
