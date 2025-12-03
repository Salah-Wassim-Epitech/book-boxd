// Optimized WBS Page JavaScript
(function() {
  'use strict';

  // DOM Cache
  const elements = {
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    wbsLevel: document.querySelector('.wbs-level'),
    level1Cards: document.querySelectorAll('.wbs-card.level-1')
  };

  // Mobile detection
  const isMobile = () => window.innerWidth <= 768;

  // Mobile menu functionality (reused from main script)
  if (elements.hamburger && elements.navMenu) {
    elements.hamburger.addEventListener('click', () => {
      elements.hamburger.classList.toggle('active');
      elements.navMenu.classList.toggle('active');
    });

    elements.navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        elements.hamburger.classList.remove('active');
        elements.navMenu.classList.remove('active');
      }
    });
  }

  // WBS functionality
  let expandedArea;

  const initializeWBS = () => {
    if (!elements.wbsLevel) return;

    // Create expansion area for desktop
    expandedArea = document.createElement('div');
    expandedArea.className = 'expanded-area';
    elements.wbsLevel.parentNode.insertBefore(expandedArea, elements.wbsLevel.nextSibling);

    // Setup level 1 cards
    elements.level1Cards.forEach(setupCard);
  };

  const setupCard = (card) => {
    card.style.cursor = 'pointer';
    
    // Add expand indicator
    const indicator = document.createElement('div');
    indicator.className = 'expand-indicator';
    indicator.textContent = '▼';
    card.appendChild(indicator);

    card.addEventListener('click', (e) => handleCardClick(e, card));
  };

  const handleCardClick = (e, card) => {
    e.stopPropagation();
    
    const branchContainer = card.parentElement;
    const subLevel = branchContainer.querySelector('.sub-level');
    const indicator = card.querySelector('.expand-indicator');
    
    if (!subLevel) return;

    if (isMobile()) {
      handleMobileExpansion(card, branchContainer, indicator, subLevel);
    } else {
      handleDesktopExpansion(card, indicator, subLevel);
    }
  };

  const handleMobileExpansion = (card, branchContainer, indicator, subLevel) => {
    const existingExpansion = branchContainer.querySelector('.mobile-expansion');
    
    if (existingExpansion) {
      // Close current expansion
      existingExpansion.remove();
      resetCardState(card, indicator);
    } else {
      // Close other expansions
      document.querySelectorAll('.mobile-expansion').forEach(exp => exp.remove());
      elements.level1Cards.forEach(otherCard => {
        if (otherCard !== card) resetCardState(otherCard, otherCard.querySelector('.expand-indicator'));
      });
      
      // Create mobile expansion
      const mobileExpansion = document.createElement('div');
      mobileExpansion.className = 'mobile-expansion';
      mobileExpansion.style.cssText = 'width:100%;margin-top:1rem;display:flex;flex-direction:column;gap:1rem;animation:expandDown 0.4s ease-out';
      mobileExpansion.innerHTML = subLevel.innerHTML;
      
      branchContainer.appendChild(mobileExpansion);
      setActiveCardState(card, indicator);
      
      // Smooth scroll to expansion
      setTimeout(() => {
        mobileExpansion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  };

  const handleDesktopExpansion = (card, indicator, subLevel) => {
    const isCurrentlyOpen = expandedArea.classList.contains('active') && 
                           expandedArea.dataset.activeCard === card.textContent;
    
    if (isCurrentlyOpen) {
      // Close expansion
      closeDesktopExpansion();
      resetCardState(card, indicator);
    } else {
      // Reset other cards
      elements.level1Cards.forEach(otherCard => {
        if (otherCard !== card) {
          resetCardState(otherCard, otherCard.querySelector('.expand-indicator'));
        }
      });
      
      // Open current expansion
      openDesktopExpansion(card, subLevel);
      setActiveCardState(card, indicator);
      
      // Smooth scroll to parent card
      setTimeout(() => scrollToCard(card), 400);
    }
  };

  const openDesktopExpansion = (card, subLevel) => {
    expandedArea.classList.add('active');
    expandedArea.dataset.activeCard = card.textContent;
    expandedArea.innerHTML = subLevel.innerHTML;
  };

  const closeDesktopExpansion = () => {
    expandedArea.classList.remove('active');
    expandedArea.innerHTML = '';
    delete expandedArea.dataset.activeCard;
  };

  const setActiveCardState = (card, indicator) => {
    indicator.textContent = '▲';
    indicator.style.transform = 'rotate(180deg)';
    card.classList.add('active');
  };

  const resetCardState = (card, indicator) => {
    if (indicator) {
      indicator.textContent = '▼';
      indicator.style.transform = 'rotate(0deg)';
    }
    card.classList.remove('active');
  };

  const scrollToCard = (card) => {
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top + window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const headerOffset = -150;
    
    const targetScrollTop = cardTop - (viewportHeight / 2) + (cardRect.height / 2) - headerOffset;
    
    window.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
  };

  // Handle resize events
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!isMobile()) {
        // Clean up mobile expansions when switching to desktop
        document.querySelectorAll('.mobile-expansion').forEach(exp => exp.remove());
        if (expandedArea) {
          closeDesktopExpansion();
        }
        elements.level1Cards.forEach(card => {
          resetCardState(card, card.querySelector('.expand-indicator'));
        });
      }
    }, 250);
  };

  window.addEventListener('resize', handleResize);

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initializeWBS);

})();