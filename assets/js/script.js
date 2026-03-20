/* ============================================
   FROGG RECRUITMENT - ADVANCED INTERACTIONS
   Modern JavaScript for Enhanced UX
   ============================================ */

const FroggApp = {
    hasInitialized: false,
    elementorHookBound: false,

    initAll() {
        if (this.hasInitialized) return;

        Preloader.init();
        Header.init();
        MobileNav.init();
        SmoothScroll.init();
        ScrollAnimations.init();
        CounterAnimation.init();
        TestimonialSlider.init();
        FormHandlers.init();
        BackToTop.init();
        WCUTabs.init();
        ImpactSection.init();
        ResourcesSection.init();

        this.hasInitialized = true;
    },

    reinitDynamicUI() {
        Header.init();
        MobileNav.init();
        WCUTabs.init();
    },

    bindElementor() {
        if (this.elementorHookBound) return;
        this.elementorHookBound = true;

        if (!window.jQuery) return;

        window.jQuery(window).on('elementor/frontend/init', () => {
            if (!window.elementorFrontend?.hooks) return;

            window.elementorFrontend.hooks.addAction('frontend/element_ready/global', () => {
                this.reinitDynamicUI();
            });

            this.reinitDynamicUI();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FroggApp.initAll();
    FroggApp.bindElementor();
});

/* ============================================
   PRELOADER (legacy - now handled by preloader.js)
   ============================================ */
const Preloader = {
    init() {
        // New preloader uses #frogg-preloader + preloader.js
        // This stub keeps FroggApp.initAll() from breaking
    }
};

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
const Header = {
    header: null,
    lastScroll: 0,
    isBound: false,

    init() {
        this.header = document.querySelector('.frogg-header') || document.getElementById('header');
        if (!this.header) return;

        this.handleScroll();
        if (this.isBound) return;

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.isBound = true;
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
    isEscapeBound: false,

    init() {
        this.toggle = document.getElementById('mobileToggle') || document.querySelector('.frogg-mobile-toggle');
        this.nav = document.getElementById('nav') || document.querySelector('.frogg-mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link, .frogg-mobile-menu a');

        if (!this.toggle || !this.nav) return;
        if (this.toggle.dataset.froggBound === '1') return;

        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.toggle.dataset.froggBound = '1';
        
        this.navLinks.forEach(link => {
            if (link.dataset.froggNavBound === '1') return;
            link.addEventListener('click', () => this.closeMenu());
            link.dataset.froggNavBound = '1';
        });

        // Close on escape key
        if (!this.isEscapeBound) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.nav?.classList.contains('active')) {
                    this.closeMenu();
                }
            });
            this.isEscapeBound = true;
        }
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
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

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
   WHY CHOOSE US - PREMIUM TAB SYSTEM
   ============================================ */
const WCUTabs = {
    autoplayTimer: null,
    autoplayDuration: 6000,
    progressRAF: null,
    progressStart: 0,
    isPaused: false,
    isBound: false,
    particleRAF: null,

    init() {
        this.section = document.querySelector('.wcu');
        if (!this.section) return;

        this.nav = this.section.querySelector('.wcu__nav');
        this.btns = [...this.section.querySelectorAll('.wcu__nav-btn')];
        this.panels = [...this.section.querySelectorAll('.wcu__panel')];
        this.progressBar = this.section.querySelector('.wcu__progress-bar');
        this.counterCurrent = this.section.querySelector('.wcu__counter-current');

        if (!this.btns.length) return;
        if (this.isBound) return;
        this.isBound = true;

        // Click handlers
        this.btns.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                this.goTo(i);
                this.restartAutoplay();
            });
        });

        // Hover pause
        const tabsContainer = this.section.querySelector('.wcu__tabs');
        if (tabsContainer) {
            tabsContainer.addEventListener('mouseenter', () => { this.isPaused = true; });
            tabsContainer.addEventListener('mouseleave', () => {
                this.isPaused = false;
                this.restartAutoplay();
            });
        }

        // Scroll reveal
        this.initScrollReveal();
        // Particles
        this.initParticles();
        // Start
        this.startAutoplay();
    },

    goTo(index) {
        const currentActive = this.section.querySelector('.wcu__panel.active');
        const nextPanel = this.panels[index];
        if (currentActive === nextPanel) return;

        // Exit current
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('exiting');
            setTimeout(() => currentActive.classList.remove('exiting'), 600);
        }

        // Activate new
        this.btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        this.panels.forEach(p => { if (p !== currentActive) p.classList.remove('active', 'exiting'); });

        this.btns[index].classList.add('active');
        this.btns[index].setAttribute('aria-selected', 'true');
        nextPanel.classList.add('active');

        // Update counter
        if (this.counterCurrent) {
            this.counterCurrent.textContent = String(index + 1).padStart(2, '0');
        }
    },

    getActiveIndex() {
        return this.btns.findIndex(b => b.classList.contains('active'));
    },

    startAutoplay() {
        this.progressStart = performance.now();
        this.tickProgress();
    },

    restartAutoplay() {
        if (this.progressRAF) cancelAnimationFrame(this.progressRAF);
        this.progressRAF = null;
        this.progressStart = performance.now();
        this.lastElapsed = 0;
        if (this.progressBar) this.progressBar.style.width = '0%';
        this.tickProgress();
    },

    tickProgress() {
        if (this.progressRAF) cancelAnimationFrame(this.progressRAF);
        this.progressRAF = requestAnimationFrame((now) => {
            if (this.isPaused) {
                this.progressStart = now - (this.lastElapsed || 0);
                this.progressRAF = requestAnimationFrame((n) => this.tickProgress.call(this));
                return;
            }
            const elapsed = now - this.progressStart;
            this.lastElapsed = elapsed;
            const pct = Math.min((elapsed / this.autoplayDuration) * 100, 100);
            if (this.progressBar) this.progressBar.style.width = pct + '%';

            if (elapsed >= this.autoplayDuration) {
                const next = (this.getActiveIndex() + 1) % this.btns.length;
                this.goTo(next);
                this.progressStart = performance.now();
                this.lastElapsed = 0;
            }
            this.progressRAF = requestAnimationFrame(() => this.tickProgress());
        });
    },

    initScrollReveal() {
        const elements = this.section.querySelectorAll('.wcu__header, .wcu__tabs');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        elements.forEach(el => observer.observe(el));
    },

    initParticles() {
        const canvas = this.section.querySelector('.wcu__canvas');
        if (!canvas) return;

        // Clean up existing canvas if re-initialized
        if (this.particleRAF) cancelAnimationFrame(this.particleRAF);
        const existingCvs = canvas.querySelector('canvas');
        if (existingCvs) existingCvs.remove();

        const cvs = document.createElement('canvas');
        cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
        canvas.appendChild(cvs);

        const ctx = cvs.getContext('2d');
        let particles = [];
        let w, h;

        const resize = () => {
            w = cvs.width = canvas.offsetWidth;
            h = cvs.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                o: Math.random() * 0.3 + 0.1
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${p.o})`;
                ctx.fill();
            });

            // Draw lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            this.particleRAF = requestAnimationFrame(draw);
        };
        draw();
    }
};

/* ============================================
   RESULTS & IMPACT - ANIMATED COUNTERS
   ============================================ */
const ImpactSection = {
    init() {
        this.section = document.querySelector('.impact');
        if (!this.section) return;
        this.initScrollReveal();
        this.initCounters();
    },

    initScrollReveal() {
        const header = this.section.querySelector('.impact__header');
        const cards = this.section.querySelectorAll('.impact__card');
        const trust = this.section.querySelector('.impact__trust');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        if (header) observer.observe(header);
        if (trust) observer.observe(trust);

        cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.12}s`;
            observer.observe(card);
        });
    },

    initCounters() {
        const numbers = this.section.querySelectorAll('.impact__card-number[data-target]');
        if (!numbers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        numbers.forEach(el => observer.observe(el));
    },

    animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const format = el.dataset.format || '';
        const duration = 2000;
        const start = performance.now();

        const formatNumber = (n) => {
            if (format === 'short') {
                if (n >= 1000000) return (n / 1000000).toFixed(0) + 'M';
                if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
            }
            return n.toLocaleString();
        };

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            el.textContent = formatNumber(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
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

/* ============================================
   RESOURCES SECTION - INTERACTIVE FEATURES
   ============================================ */
const ResourcesSection = {
    carousel: null,
    currentSlide: 0,
    totalSlides: 0,
    autoplayInterval: null,
    
    init() {
        this.initCarousel();
        this.initFilters();
        this.initParticles();
        this.initStatsAnimation();
        this.initNewsletterForm();
    },
    
    // Carousel Functionality
    initCarousel() {
        const track = document.getElementById('carouselTrack');
        const slides = document.querySelectorAll('.featured-slide');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');
        
        if (!track || slides.length === 0) return;
        
        this.totalSlides = slides.length;
        
        // Set up event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause on hover
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => this.stopAutoplay());
            carouselWrapper.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Touch swipe support
        this.initTouchSwipe(track);
    },
    
    goToSlide(index) {
        const track = document.getElementById('carouselTrack');
        const slides = document.querySelectorAll('.featured-slide');
        const dots = document.querySelectorAll('.carousel-dots .dot');
        
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        this.currentSlide = index;
        
        // Update track position
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active states
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    },
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    },
    
    initTouchSwipe(track) {
        let startX = 0;
        let endX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    },
    
    // Filter Functionality
    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.resource-card');
        
        if (filterBtns.length === 0 || cards.length === 0) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards with animation
                cards.forEach((card, index) => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                        card.style.animationDelay = `${index * 0.1}s`;
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('show');
                    }
                });
            });
        });
    },
    
    // Floating Particles
    initParticles() {
        const container = document.getElementById('resourcesParticles');
        if (!container) return;
        
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(22, 98, 237, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 15}s linear infinite;
                animation-delay: ${Math.random() * -20}s;
            `;
            container.appendChild(particle);
        }
        
        // Add keyframes dynamically
        if (!document.getElementById('particleKeyframes')) {
            const style = document.createElement('style');
            style.id = 'particleKeyframes';
            style.textContent = `
                @keyframes particleFloat {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}100px, -100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Stats Animation with Intersection Observer
    initStatsAnimation() {
        const statBoxes = document.querySelectorAll('.stat-box');
        const statsSection = document.querySelector('.resources-stats');
        
        if (!statsSection || statBoxes.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statBoxes.forEach((box, index) => {
                        setTimeout(() => {
                            box.classList.add('animated');
                            
                            // Animate counter
                            const valueEl = box.querySelector('.stat-value');
                            if (valueEl) {
                                const target = parseInt(valueEl.dataset.count) || 0;
                                this.animateCounter(valueEl, target);
                            }
                            
                            // Animate progress bar
                            const progressBar = box.querySelector('.progress-bar');
                            if (progressBar) {
                                const progress = progressBar.dataset.progress || 0;
                                box.style.setProperty('--progress-width', `${progress}%`);
                            }
                        }, index * 150);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    },
    
    animateCounter(element, target) {
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current).toLocaleString();
        }, stepDuration);
    },
    
    // Newsletter Form
    initNewsletterForm() {
        const form = document.getElementById('resourcesNewsletter');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]');
            const btn = form.querySelector('button');
            
            if (email && email.value) {
                // Simulate submission
                btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                btn.style.background = '#22c55e';
                email.value = '';
                
                setTimeout(() => {
                    btn.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
                    btn.style.background = '';
                }, 3000);
            }
        });
    }
};
