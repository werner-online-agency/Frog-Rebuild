(function () {
    /* ================================================
       HEADER & MOBILE MENU
       ================================================ */
    const header = document.getElementById('siteHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function updateHeaderState() {
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileToggle) return;
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function () {
            const isOpen = mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('no-scroll', isOpen);
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMobileMenu();
        });
    }

    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('load', updateHeaderState);
    updateHeaderState();

    /* ================================================
       SCROLL REVEAL  (IntersectionObserver)
       ================================================ */
    var revealSections = document.querySelectorAll('.reveal-section');
    if (revealSections.length && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealSections.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: reveal everything immediately
        revealSections.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ================================================
       ANIMATED COUNTERS
       ================================================ */
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var format = el.getAttribute('data-format');
        var duration = 2000;
        var startTime = null;

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.round(easeOutCubic(progress) * target);

            if (format === 'comma') {
                el.textContent = current.toLocaleString() + suffix;
            } else {
                el.textContent = current + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    if (statNumbers.length && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statNumbers.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ================================================
       TESTIMONIAL CAROUSEL
       ================================================ */
    var carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
        var track = carousel.querySelector('.testimonial-track');
        var slides = carousel.querySelectorAll('.testimonial-slide');
        var prevBtn = carousel.querySelector('.carousel-btn--prev');
        var nextBtn = carousel.querySelector('.carousel-btn--next');
        var dots = carousel.querySelectorAll('.carousel-dot');
        var currentIndex = 0;
        var slideCount = slides.length;
        var autoplayTimer = null;

        function goToSlide(index) {
            if (index < 0) index = slideCount - 1;
            if (index >= slideCount) index = 0;
            currentIndex = index;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(function () { goToSlide(currentIndex + 1); }, 5000);
        }

        function stopAutoplay() {
            if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentIndex - 1); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentIndex + 1); startAutoplay(); });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { goToSlide(i); startAutoplay(); });
        });

        // Touch / swipe support
        var touchStartX = 0;
        var touchEndX = 0;
        carousel.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; stopAutoplay(); }, { passive: true });
        carousel.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
            }
            startAutoplay();
        }, { passive: true });

        goToSlide(0);
        startAutoplay();
    }
})();
