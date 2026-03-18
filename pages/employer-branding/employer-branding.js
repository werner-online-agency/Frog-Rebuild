/* ============================================================
   EMPLOYER BRANDING — PAGE SCRIPTS
   ============================================================ */
(function () {
    'use strict';

    /* ---------- MOBILE MENU ---------- */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            this.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });
    }

    /* ---------- SCROLL REVEAL ---------- */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-reveal') || '0', 10);
                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ---------- STEPS PROGRESS BAR ---------- */
    const stepsSection = document.querySelector('.steps-section');
    const progressFill = document.getElementById('stepsProgressFill');
    if (stepsSection && progressFill) {
        function updateProgress() {
            const rect = stepsSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;

            if (sectionTop >= windowHeight) {
                progressFill.style.width = '0%';
            } else if (sectionTop + sectionHeight <= 0) {
                progressFill.style.width = '100%';
            } else {
                var scrolled = windowHeight - sectionTop;
                var total = sectionHeight + windowHeight;
                var pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
                progressFill.style.width = pct + '%';
            }
        }
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* ---------- TOC ACTIVE STATE ---------- */
    const tocItems = document.querySelectorAll('.toc-item');
    const stepCards = document.querySelectorAll('.step-card[id]');
    if (tocItems.length && stepCards.length) {
        const tocObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocItems.forEach(function (item) {
                        item.classList.toggle('active', item.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-20% 0px -50% 0px' });

        stepCards.forEach(function (card) { tocObserver.observe(card); });
    }

    /* ---------- SMOOTH SCROLL FOR TOC LINKS ---------- */
    tocItems.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var offset = 120;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ---------- HEADER SHRINK ON SCROLL ---------- */
    const header = document.getElementById('siteHeader');
    if (header) {
        var lastScroll = 0;
        window.addEventListener('scroll', function () {
            var scrollY = window.pageYOffset;
            if (scrollY > 80) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }
})();