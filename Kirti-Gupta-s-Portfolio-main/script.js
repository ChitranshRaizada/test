/* ==========================================================================
   KIRTI GUPTA PORTFOLIO — Interactive Logic & Smooth GSAP Motion Framework
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins safely
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Lenis Smooth Scrolling Initialization
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 2. Custom Magnetic Dual-Ring Cursor
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorText = document.getElementById('cursor-text');
  const magneticTargets = document.querySelectorAll('.magnetic-target, .project-card, a, button');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct dot positioning for instant response
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
  });

  // Smooth lerp for outer ring
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    if (cursorRing) {
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states & custom cursor badges
  magneticTargets.forEach((target) => {
    target.addEventListener('mouseenter', (e) => {
      document.body.classList.add('cursor-active');
      const customLabel = target.getAttribute('data-cursor');
      if (customLabel && cursorText) {
        cursorText.textContent = customLabel;
      } else if (cursorText) {
        cursorText.textContent = 'EXPLORE';
      }
    });

    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
      if (cursorText) cursorText.textContent = '';
    });
  });

  // 3. Hero Initial Load GSAP Sequence
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl.from('.stagger-hero', {
      y: 80,
      opacity: 0,
      stagger: 0.18,
      delay: 0.2
    })
    .from('.hero-shapes .shape', {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'back.out(1.7)'
    }, '-=0.8');

    // Hero Mouse Move Parallax on Geometric Floating Elements
    const floatElements = document.querySelectorAll('.float-element');
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      floatElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0.03;
        gsap.to(el, {
          x: dx * speed * 20,
          y: dy * speed * 20,
          duration: 1,
          ease: 'power1.out'
        });
      });
    });
  }

  // 4. Sticky Header Blur Effect on Scroll
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 5. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // 6. Expandable Services Rows
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach((row) => {
    row.addEventListener('click', () => {
      const isActive = row.classList.contains('active');
      serviceRows.forEach((r) => r.classList.remove('active'));
      if (!isActive) {
        row.classList.add('active');
      }
    });
  });

  // 7. Portfolio Projects Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          gsap.to(card, { display: 'flex', opacity: 1, scale: 1, duration: 0.4 });
        } else {
          gsap.to(card, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => card.style.display = 'none' });
        }
      });
    });
  });

  // 8. Project Details Interactive Modal View
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalImg = document.getElementById('modal-img');

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-title').textContent;
      const cat = card.querySelector('.project-cat').textContent;
      const imgSrc = card.querySelector('.project-img').getAttribute('src');

      if (modalTitle) modalTitle.textContent = title;
      if (modalTag) modalTag.textContent = cat;
      if (modalImg) modalImg.setAttribute('src', imgSrc);

      if (modal) modal.classList.add('active');
    });
  });

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // 9. Statistics Counter Animation (ScrollTrigger)
  const statNumbers = document.querySelectorAll('.stat-number');
  if (typeof ScrollTrigger !== 'undefined') {
    statNumbers.forEach((stat) => {
      const targetVal = parseInt(stat.getAttribute('data-target'), 10) || 0;

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(stat, {
            innerText: targetVal,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out'
          });
        },
        once: true
      });
    });
  }

  // 10. Horizontal Testimonials Slider Controls
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-card').length;

  function updateSlider() {
    if (track) {
      const slideWidth = document.querySelector('.testimonial-card').offsetWidth + 40;
      track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % (totalSlides > 1 ? totalSlides - 1 : 1);
      updateSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + (totalSlides - 1)) % (totalSlides - 1);
      updateSlider();
    });
  }

  // Auto-play slider
  let autoSlide = setInterval(() => {
    if (nextBtn) nextBtn.click();
  }, 6000);

  const sliderContainer = document.getElementById('testimonial-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderContainer.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        if (nextBtn) nextBtn.click();
      }, 6000);
    });
  }

  // 11. Contact Form Submission Interaction
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const emailInput = document.getElementById('email-input');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (emailInput && emailInput.value) {
        formStatus.textContent = '✓ Request received! We will be in touch shortly.';
        emailInput.value = '';
        setTimeout(() => {
          formStatus.textContent = '';
        }, 5000);
      }
    });
  }

  // 12. General GSAP ScrollTrigger Animations for Headers & Dividers
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.reveal-text').forEach((text) => {
      gsap.from(text, {
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.process-step').forEach((step, idx) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: 'top 88%',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        delay: idx * 0.1,
        ease: 'power3.out'
      });
    });
  }
});
