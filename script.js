/* ============================================
   FROGG RECRUITMENT - ADVANCED INTERACTIONS
   Modern JavaScript for Enhanced UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    Header.init();
    MobileNav.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    CounterAnimation.init();
    TestimonialSlider.init();
    FormHandlers.init();
    BackToTop.init();
    ServicesTabs.init();
});

/* ============================================
   PRELOADER
   ============================================ */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.classList.remove('no-scroll');
            }, 500);
        });

        // Fallback - hide preloader after 3 seconds max
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 3000);
    }
};

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
const Header = {
    header: null,
    lastScroll: 0,

    init() {
        this.header = document.getElementById('header');
        if (!this.header) return;

        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
    }
};

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
const MobileNav = {
    toggle: null,
    nav: null,
    navLinks: null,

    init() {
        this.toggle = document.getElementById('mobileToggle');
        this.nav = document.getElementById('nav');
        this.navLinks = document.querySelectorAll('.nav-link');

        if (!this.toggle || !this.nav) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.nav.classList.contains('active')) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    },

    closeMenu() {
        this.toggle.classList.remove('active');
        this.nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};

/* ============================================
   SMOOTH SCROLL
   ============================================ */
const SmoothScroll = {
    init() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                this.updateActiveLink(targetId);
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => this.handleScrollSpy(), { passive: true });
    },

    updateActiveLink(targetId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    },

    handleScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveLink(`#${sectionId}`);
            }
        });
    }
};

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
const ScrollAnimations = {
    init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Add stagger effect to children if needed
                    const children = entry.target.querySelectorAll('[data-aos-child]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('aos-animate');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });

        // Also animate sections as they come into view
        this.animateSections();
    },

    animateSections() {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
};

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const CounterAnimation = {
    init() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        if (!counters.length) return;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
};

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
const TestimonialSlider = {
    track: null,
    cards: null,
    currentIndex: 0,
    dotsContainer: null,
    autoplayInterval: null,

    init() {
        this.track = document.getElementById('testimonialTrack');
        this.dotsContainer = document.getElementById('sliderDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!this.track) return;

        this.cards = this.track.querySelectorAll('.testimonial-card');
        
        // Create dots
        this.createDots();

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        // Touch support
        this.initTouch();

        // Autoplay
        this.startAutoplay();

        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());

        // Handle resize
        window.addEventListener('resize', () => this.updateSlider());
    },

    createDots() {
        if (!this.dotsContainer) return;

        const totalSlides = this.getVisibleSlides();
        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }
    },

    getVisibleSlides() {
        const width = window.innerWidth;
        if (width <= 768) return this.cards.length;
        if (width <= 1024) return Math.ceil(this.cards.length / 2);
        return Math.ceil(this.cards.length / 3);
    },

    getSlideWidth() {
        const width = window.innerWidth;
        if (width <= 768) return 100;
        if (width <= 1024) return 50;
        return 33.333;
    },

    updateSlider() {
        this.createDots();
        this.goTo(0);
    },

    prev() {
        const totalSlides = this.getVisibleSlides();
        this.currentIndex = (this.currentIndex - 1 + totalSlides) % totalSlides;
        this.slide();
    },

    next() {
        const totalSlides = this.getVisibleSlides();
        this.currentIndex = (this.currentIndex + 1) % totalSlides;
        this.slide();
    },

    goTo(index) {
        this.currentIndex = index;
        this.slide();
    },

    slide() {
        const slideWidth = this.getSlideWidth();
        const offset = this.currentIndex * slideWidth;
        this.track.style.transform = `translateX(-${offset}%)`;

        // Update dots
        const dots = this.dotsContainer?.querySelectorAll('.dot');
        dots?.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    },

    initTouch() {
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isDragging = false;
        }, { passive: true });
    },

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), 5000);
    },

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
};

/* ============================================
   SERVICES TABS
   ============================================ */
const ServicesTabs = {
    init() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        if (!tabBtns.length) return;
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active class from all buttons and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                btn.classList.add('active');
                const panel = document.getElementById(tabId);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });
    }
};

/* ============================================
   FORM HANDLERS
   ============================================ */
const FormHandlers = {
    init() {
        this.initContactForm();
        this.initNewsletterForm();
        this.initFormValidation();
    },

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            // Simulate form submission (replace with actual API call)
            await this.simulateSubmit();

            // Show success
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    },

    initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const input = form.querySelector('input[type="email"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            await this.simulateSubmit();

            btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            input.value = '';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
        });
    },

    initFormValidation() {
        const inputs = document.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    },

    validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = '#ef4444';
        } else {
            field.classList.remove('error');
            field.style.borderColor = '';
        }

        return isValid;
    },

    simulateSubmit() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
};

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const BackToTop = {
    button: null,

    init() {
        this.button = document.getElementById('backToTop');
        if (!this.button) return;

        window.addEventListener('scroll', () => this.toggleVisibility(), { passive: true });
        this.button.addEventListener('click', () => this.scrollToTop());
    },

    toggleVisibility() {
        if (window.pageYOffset > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

/* ============================================
   PARALLAX EFFECTS (Optional Enhancement)
   ============================================ */
const Parallax = {
    init() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }, { passive: true });
    }
};

/* ============================================
   CURSOR EFFECT (Optional Enhancement)
   ============================================ */
const CustomCursor = {
    cursor: null,
    cursorDot: null,

    init() {
        // Only on desktop
        if (window.innerWidth <= 1024) return;

        this.createCursor();
        this.bindEvents();
    },

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = '<div class="cursor-dot"></div>';
        document.body.appendChild(this.cursor);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(22, 98, 237, 0.5);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .custom-cursor .cursor-dot {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: #1662ed;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            .custom-cursor.hover {
                width: 60px;
                height: 60px;
                border-color: #1662ed;
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }
};

/* ============================================
   TYPING EFFECT (Optional Enhancement)
   ============================================ */
const TypeWriter = {
    init(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    },

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
};

/* ============================================
   MAGNETIC BUTTONS (Optional Enhancement)
   ============================================ */
const MagneticButtons = {
    init() {
        const buttons = document.querySelectorAll('.btn-primary');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
};

/* ============================================
   INITIALIZE OPTIONAL ENHANCEMENTS
   ============================================ */
// Uncomment to enable optional features
// document.addEventListener('DOMContentLoaded', () => {
//     Parallax.init();
//     CustomCursor.init();
//     MagneticButtons.init();
// });
