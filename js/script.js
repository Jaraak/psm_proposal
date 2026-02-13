/**
 * Phone Store Maracaibo - Landing Page JavaScript
 * Component-based architecture with vanilla JS
 * Following React-like patterns for maintainability
 */

'use strict';

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

/**
 * Utility: Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Utility: Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds to throttle
 * @returns {Function} Throttled function
 */
const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Utility: Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Is element in viewport
 */
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/* ==========================================
   NAVIGATION COMPONENT
   ========================================== */

const NavigationComponent = (() => {
    // Private variables
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let isMenuOpen = false;
    
    /**
     * Handle scroll event to add/remove scrolled class
     */
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100);
    
    /**
     * Toggle mobile menu
     */
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navMenu.style.display = 'flex';
            navMenu.style.position = 'fixed';
            navMenu.style.top = '70px';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.bottom = '0';
            navMenu.style.background = 'rgba(10, 10, 15, 0.98)';
            navMenu.style.flexDirection = 'column';
            navMenu.style.justifyContent = 'center';
            navMenu.style.alignItems = 'center';
            navMenu.style.padding = '2rem';
            navMenu.style.zIndex = '999';
            
            // Animate toggle button
            navToggle.querySelectorAll('.nav__toggle-line').forEach((line, index) => {
                if (index === 0) {
                    line.style.transform = 'rotate(45deg) translateY(7px)';
                } else if (index === 1) {
                    line.style.opacity = '0';
                } else {
                    line.style.transform = 'rotate(-45deg) translateY(-7px)';
                }
            });
        } else {
            navMenu.style.display = 'none';
            
            // Reset toggle button
            navToggle.querySelectorAll('.nav__toggle-line').forEach((line) => {
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        }
    };
    
    /**
     * Handle smooth scroll to section
     * @param {Event} e - Click event
     */
    const handleNavClick = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        
        // Close menu if mobile
        if (isMenuOpen) {
            toggleMenu();
        }
        
        // Smooth scroll to section
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed nav height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    /**
     * Initialize navigation component
     */
    const init = () => {
        // Add scroll listener
        window.addEventListener('scroll', handleScroll);
        
        // Add toggle listener for mobile
        if (navToggle) {
            navToggle.addEventListener('click', toggleMenu);
        }
        
        // Add smooth scroll to all nav links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Close menu on window resize if desktop view
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                toggleMenu();
            }
        }, 250));
    };
    
    // Public API
    return {
        init
    };
})();

/* ==========================================
   SCROLL ANIMATIONS COMPONENT
   ========================================== */

const ScrollAnimations = (() => {
    /**
     * Intersection Observer callback for scroll animations
     * @param {IntersectionObserverEntry[]} entries - Observed entries
     */
    const handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    };
    
    /**
     * Initialize scroll animations
     */
    const init = () => {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(handleIntersection, observerOptions);
            
            // Observe all elements with data-aos attribute
            document.querySelectorAll('[data-aos]').forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback: just show all elements
            document.querySelectorAll('[data-aos]').forEach(element => {
                element.classList.add('aos-animate');
            });
        }
    };
    
    return {
        init
    };
})();

/* ==========================================
   SCROLL INDICATOR COMPONENT
   ========================================== */

const ScrollIndicator = (() => {
    /**
     * Smooth scroll to a target section
     * @param {string} targetId - CSS selector of target element
     */
    const scrollToTarget = (targetId) => {
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    };

    /**
     * Initialize all scroll indicators with their respective targets
     */
    const init = () => {
        const indicators = document.querySelectorAll('.scroll-indicator[data-scroll-target]');
        indicators.forEach(indicator => {
            const target = indicator.getAttribute('data-scroll-target');
            if (target) {
                indicator.style.cursor = 'pointer';
                indicator.addEventListener('click', () => scrollToTarget(target));
            }
        });
    };

    return { init };
})();

/* ==========================================
   PRODUCT CARDS HOVER EFFECT
   ========================================== */

const ProductCards = (() => {
    /**
     * Add parallax effect to glow on mouse move
     * @param {MouseEvent} e - Mouse move event
     * @param {HTMLElement} card - Product card element
     */
    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = card.querySelector('.product-card__glow');
        if (glow) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            glow.style.transform = `translate(${deltaX * 20}px, ${deltaY * 20}px)`;
        }
    };
    
    /**
     * Reset glow position on mouse leave
     * @param {HTMLElement} card - Product card element
     */
    const handleMouseLeave = (card) => {
        const glow = card.querySelector('.product-card__glow');
        if (glow) {
            glow.style.transform = 'translate(0, 0)';
        }
    };
    
    /**
     * Initialize product cards interactions
     */
    const init = () => {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => handleMouseLeave(card));
        });
    };
    
    return {
        init
    };
})();

/* ==========================================
   BENTO CARDS HOVER EFFECT
   ========================================== */

const BentoCards = (() => {
    /**
     * Add tilt effect on mouse move
     * @param {MouseEvent} e - Mouse move event
     * @param {HTMLElement} card - Bento card element
     */
    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 degrees
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    };
    
    /**
     * Reset card position on mouse leave
     * @param {HTMLElement} card - Bento card element
     */
    const handleMouseLeave = (card) => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    };
    
    /**
     * Initialize bento cards interactions
     */
    const init = () => {
        const bentoCards = document.querySelectorAll('.bento-card');
        
        bentoCards.forEach(card => {
            card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => handleMouseLeave(card));
        });
    };
    
    return {
        init
    };
})();

/* ==========================================
   PERFORMANCE OPTIMIZATIONS
   ========================================== */

const PerformanceOptimizations = (() => {
    /**
     * Lazy load images when they come into viewport
     */
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback: load all images immediately
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };
    
    /**
     * Reduce motion for users who prefer it
     */
    const respectReducedMotion = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    };
    
    /**
     * Initialize performance optimizations
     */
    const init = () => {
        lazyLoadImages();
        respectReducedMotion();
    };
    
    return {
        init
    };
})();

/* ==========================================
   WHATSAPP INTEGRATION
   ========================================== */

const WhatsAppIntegration = (() => {
    /**
     * Open WhatsApp with pre-filled message
     * @param {string} phoneNumber - Phone number in international format
     * @param {string} message - Pre-filled message
     */
    const openWhatsApp = (phoneNumber, message = '') => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };
    
    /**
     * Initialize WhatsApp buttons
     */
    const init = () => {
        const whatsappButtons = document.querySelectorAll('[href^="https://wa.me"]');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Let default behavior handle it, but we could add analytics here
                console.log('WhatsApp button clicked');
            });
        });
    };
    
    return {
        init,
        openWhatsApp
    };
})();

/* ==========================================
   ANALYTICS (Placeholder for future implementation)
   ========================================== */

const Analytics = (() => {
    /**
     * Track page view
     */
    const trackPageView = () => {
        // Placeholder for Google Analytics or similar
        console.log('Page view tracked');
    };
    
    /**
     * Track event
     * @param {string} category - Event category
     * @param {string} action - Event action
     * @param {string} label - Event label
     */
    const trackEvent = (category, action, label) => {
        // Placeholder for event tracking
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    };
    
    /**
     * Initialize analytics
     */
    const init = () => {
        trackPageView();
    };
    
    return {
        init,
        trackEvent
    };
})();

/* ==========================================
   APPLICATION INITIALIZATION
   ========================================== */


/* ==========================================
   CAROUSEL COMPONENT - Infinite Loop + Arrows
   ========================================== */

const CarouselComponent = (() => {
    let currentX = 0;
    let isAutoPlaying = true;
    let speed = 0.6; // px per frame at 60fps
    let animationId = null;
    let lastTime = null;
    let isTransitioning = false;
    let track = null;
    let cardWidth = 0;
    let totalOriginalWidth = 0;

    /**
     * Clone cards to enable seamless infinite loop
     */
    const setupInfiniteLoop = () => {
        track = document.querySelector('.carousel-track');
        if (!track) return false;

        // Remove CSS animation
        track.style.animation = 'none';
        track.style.willChange = 'transform';

        const originalCards = [...track.children];
        const gap = 32; // --space-xl = 2rem = 32px

        // Detect responsive card width
        const firstCard = originalCards[0];
        if (!firstCard) return false;
        cardWidth = firstCard.offsetWidth + gap;
        totalOriginalWidth = cardWidth * originalCards.length;

        // Clone cards for seamless loop
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // Set initial transform
        track.style.transform = `translateX(0px)`;
        return true;
    };

    /**
     * Main animation loop using requestAnimationFrame
     */
    const animate = (timestamp) => {
        if (!lastTime) lastTime = timestamp;
        const delta = Math.min(timestamp - lastTime, 50); // cap at 50ms to avoid jumps
        lastTime = timestamp;

        if (isAutoPlaying && !isTransitioning) {
            currentX -= speed * (delta / 16.67);

            // Seamless reset: when we've scrolled one full set of originals
            if (Math.abs(currentX) >= totalOriginalWidth) {
                currentX += totalOriginalWidth;
            }

            track.style.transform = `translateX(${currentX}px)`;
        }

        animationId = requestAnimationFrame(animate);
    };

    /**
     * Manually move carousel by one card
     * @param {number} direction - 1 for next, -1 for prev
     */
    const moveByCard = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;
        isAutoPlaying = false;

        currentX -= direction * cardWidth;

        // Normalize position to stay within bounds
        if (currentX > 0) currentX -= totalOriginalWidth;
        if (Math.abs(currentX) >= totalOriginalWidth) currentX += totalOriginalWidth;

        track.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateX(${currentX}px)`;

        setTimeout(() => {
            track.style.transition = '';
            isTransitioning = false;
            isAutoPlaying = true;
            lastTime = null; // reset timer to avoid position jump
        }, 450);
    };

    /**
     * Initialize the carousel component
     */
    const init = () => {
        const ready = setupInfiniteLoop();
        if (!ready) return;

        // Start auto-play animation
        animationId = requestAnimationFrame(animate);

        // Arrow buttons
        const prevBtn = document.querySelector('.carousel-btn--prev');
        const nextBtn = document.querySelector('.carousel-btn--next');
        if (prevBtn) prevBtn.addEventListener('click', () => moveByCard(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => moveByCard(1));

        // Pause on hover
        track.addEventListener('mouseenter', () => { isAutoPlaying = false; });
        track.addEventListener('mouseleave', () => {
            if (!isTransitioning) {
                lastTime = null;
                isAutoPlaying = true;
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isAutoPlaying = false;
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) moveByCard(diff > 0 ? 1 : -1);
            else {
                lastTime = null;
                isAutoPlaying = true;
            }
        });
    };

    return { init };
})();

const App = (() => {
    /**
     * Initialize all components
     */
    const init = () => {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    };
    
    /**
     * Initialize application components
     */
    const initializeApp = () => {
        console.log('🚀 Phone Store Maracaibo - Landing Page Initialized');
        
        // Initialize all components
        NavigationComponent.init();
        ScrollAnimations.init();
        ScrollIndicator.init();
        CarouselComponent.init();
        ProductCards.init();
        BentoCards.init();
        PerformanceOptimizations.init();
        WhatsAppIntegration.init();
        Analytics.init();
        
        // Add smooth scroll behavior to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            if (!anchor.classList.contains('nav__link')) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
        
        console.log('✅ All components loaded successfully');
    };
    
    return {
        init
    };
})();

// Initialize the application
App.init();

/* ==========================================
   EXPORT FOR POTENTIAL MODULE USAGE
   ========================================== */

// If using modules, export components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationComponent,
        ScrollAnimations,
        ProductCards,
        BentoCards,
        WhatsAppIntegration,
        Analytics
    };
}
/* --- ScrollSpy: Active nav link tracking --- */

/**
 * Tracks scroll position and activates the corresponding nav link.
 * Using IntersectionObserver instead of scroll events for performance.
 * Each section that has a matching nav link gets observed.
 */
const ScrollSpy = (() => {
    const NAV_LINKS = document.querySelectorAll('.nav__link[href^="#"]');
    const ACTIVE_CLASS = 'nav__link--active';

    const OBSERVER_OPTIONS = {
        // Trigger when section reaches upper third of viewport
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    /**
     * Removes active class from all nav links.
     */
    const clearActiveLinks = () => {
        NAV_LINKS.forEach(link => link.classList.remove(ACTIVE_CLASS));
    };

    /**
     * Sets active class on the nav link matching the given section ID.
     * @param {string} sectionId - The ID of the visible section.
     */
    const setActiveLink = (sectionId) => {
        clearActiveLinks();
        const matchingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        if (!matchingLink) return;
        matchingLink.classList.add(ACTIVE_CLASS);
    };

    const init = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                setActiveLink(entry.target.id);
            });
        }, OBSERVER_OPTIONS);

        // Observe all sections that have a corresponding nav link
        NAV_LINKS.forEach(link => {
            const targetId = link.getAttribute('href').replace('#', '');
            const section = document.getElementById(targetId);
            if (!section) return;
            observer.observe(section);
        });
    };

    return { init };
})();

/* --- Pending Pages: preventDefault for future pages --- */

/**
 * Intercepts clicks on pages that are not yet built.
 * Shows a subtle toast instead of navigating to a 404.
 * The data-page-pending attribute identifies these links.
 */
const PendingPages = (() => {
    const PENDING_LINKS = document.querySelectorAll('[data-page-pending]');

    /**
     * Shows a temporary toast notification.
     * @param {string} pageName - Name of the pending page.
     */
    const showComingSoonToast = (pageName) => {
        const existing = document.getElementById('psm-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'psm-toast';
        toast.textContent = `${pageName === 'cart' ? 'Carrito' : 'Mi cuenta'} — Próximamente`;
        toast.style.cssText = `
            position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
            background: #000; color: #fff; padding: 0.75rem 1.5rem;
            border-radius: 9999px; font-size: 0.875rem; font-weight: 500;
            z-index: 9999; opacity: 0; transition: opacity 300ms ease;
            pointer-events: none;
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    };

    const init = () => {
        PENDING_LINKS.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showComingSoonToast(link.dataset.pagePending);
            });
        });
    };

    return { init };
})();

// Initialize new components
ScrollSpy.init();
PendingPages.init();
