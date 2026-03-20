/* Job Satisfaction article — interactions */
(function () {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    /* Scroll state */
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    toggle.addEventListener('click', function () {
        var open = mobileMenu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ===== Scroll-reveal animations ===== */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && 'IntersectionObserver' in window) {
        var idx = 0;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = parseInt(el.dataset.revealDelay, 10) || 0;
                    setTimeout(function () { el.classList.add('revealed'); }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

        revealEls.forEach(function (el) {
            if (el.classList.contains('step-card')) {
                el.dataset.revealDelay = idx * 100;
                idx++;
            }
            observer.observe(el);
        });
    }

    /* ===== Steps progress bar ===== */
    var stepCards = document.querySelectorAll('.step-card');
    var progressFill = document.getElementById('stepsProgressFill');
    if (stepCards.length && progressFill && 'IntersectionObserver' in window) {
        var revealed = 0;
        var total = stepCards.length;
        var progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    revealed++;
                    var pct = Math.min((revealed / total) * 100, 100);
                    progressFill.style.width = pct + '%';
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        stepCards.forEach(function (card) {
            progressObserver.observe(card);
        });
    }

    /* ===== TOC active state on scroll ===== */
    var tocItems = document.querySelectorAll('.toc-item');
    var stepSections = [];
    tocItems.forEach(function (item) {
        var href = item.getAttribute('href');
        if (href) {
            var target = document.querySelector(href);
            if (target) stepSections.push({ link: item, el: target });
        }
    });

    if (stepSections.length) {
        var tocObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var match = stepSections.find(function (s) { return s.el === entry.target; });
                if (match) {
                    if (entry.isIntersecting) {
                        tocItems.forEach(function (t) { t.classList.remove('active'); });
                        match.link.classList.add('active');
                    }
                }
            });
        }, { threshold: 0.2, rootMargin: '-20% 0px -60% 0px' });

        stepSections.forEach(function (s) {
            tocObserver.observe(s.el);
        });
    }
})();