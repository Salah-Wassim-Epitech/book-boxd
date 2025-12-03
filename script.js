// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close menu when link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Smooth scroll behavior with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
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
  });
});

// Navbar scroll effect
let lastScrollPosition = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.style.background = 'rgba(255, 249, 240, 0.98)';
    navbar.style.boxShadow = '0 10px 30px rgba(255, 176, 0, 0.25)';
  } else {
    navbar.style.background = 'rgba(255, 249, 240, 0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(255, 176, 0, 0.1)';
  }

  lastScrollPosition = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Animate feature cards on scroll
document.querySelectorAll('.feature-card, .testimonial-card, .community-stat, .club-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});


// Button click handlers
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Parallax effect for hero section
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('scroll', () => {
  const scrollPosition = window.pageYOffset;
  if (scrollPosition < window.innerHeight) {
    heroVisual.style.transform = 'translateY(' + (scrollPosition * 0.5) + 'px)';
  }
});

// Add active state to nav links based on current section
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const navLink = document.querySelector('.nav-link[href="#' + section.id + '"]');

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      document.querySelectorAll('.nav-link').forEach(link => link.style.color = 'var(--light-text)');
      if (navLink) {
        navLink.style.color = 'var(--primary-color)';
      }
    }
  });
});

// Performance optimization: lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

console.log('BookBoxd charge avec succes youpiii');
