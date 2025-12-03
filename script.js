// Optimized JavaScript for BeeBlee website
(function() {
  'use strict';

  // Cache DOM elements
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.querySelector('.navbar');
  const heroVisual = document.querySelector('.hero-visual');

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Smooth scroll with navbar offset
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
      const href = e.target.getAttribute('href');
      if (href !== '#' && href !== '#hero') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    }
  });

  // Optimized scroll handler with requestAnimationFrame
  let ticking = false;

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    
    // Navbar background change
    if (currentScroll > 50) {
      navbar.style.cssText = 'background: rgba(255, 249, 240, 0.98); box-shadow: 0 10px 30px rgba(255, 176, 0, 0.25);';
    } else {
      navbar.style.cssText = '';
    }

    // Parallax effect (only if hero visual exists and visible)
    if (heroVisual && currentScroll < window.innerHeight) {
      heroVisual.style.transform = `translateY(${currentScroll * 0.5}px)`;
    }

    // Active nav link highlighting (pour index.html seulement)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'index.html' || currentPage === '') {
      highlightCurrentSection();
    }
  };

  // Scroll event with requestAnimationFrame optimization
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Marquer le lien actif selon la page actuelle
  document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Reset tous les liens
    navLinks.forEach(link => link.style.color = '');
    
    // Marquer le lien de la page actuelle
    if (currentPage === 'wbs.html') {
      const wbsLink = document.querySelector('.nav-link[href="wbs.html"]');
      if (wbsLink) wbsLink.style.color = 'var(--primary-color)';
    } else if (currentPage === 'documentation.html') {
      const docLink = document.querySelector('.nav-link[href="documentation.html"]');
      if (docLink) docLink.style.color = 'var(--primary-color)';
    }
  });

  // Fonction pour surligner la section courante
  const highlightCurrentSection = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    let activeLinkFound = false;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.style.color = 'var(--light-text)';
        });

        if (navLink) {
          navLink.style.color = 'var(--primary-color)';
          activeLinkFound = true;
        }
      }
    });

    // Si aucune section n'est dans la zone (haut de page)
    if (!activeLinkFound) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.style.color = 'var(--light-text)';
      });
    }
  };

  // Intersection Observer for animations
  const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card');
  
  if (animatedElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.cssText = 'opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out;';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Initialize and observe elements
    animatedElements.forEach(el => {
      el.style.cssText = 'opacity: 0; transform: translateY(30px);';
      observer.observe(el);
    });
  }

  // Button ripple effect
  const addRippleEffect = () => {
    const style = document.createElement('style');
    style.textContent = `
      .btn { position: relative; overflow: hidden; }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Add event delegation for buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-secondary');
      if (btn) {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
        `;
        ripple.className = 'ripple';
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      }
    });
  };

  // Initialize ripple effect
  addRippleEffect();

  // Initial calls
  handleScroll();

})();